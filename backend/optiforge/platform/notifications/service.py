"""
Unified notification service. Callers (core modules, packs) send through
`notify(...)`; nothing mails, SMSes, or pushes directly.

Pipeline per recipient:
  1. Resolve template: tenant-specific override → core fallback.
  2. Check opt-out preferences unless the template is transactional.
  3. Render the template against the payload.
  4. Persist a NotificationDelivery row (status='queued').
  5. Invoke the channel adapter; mark 'sent' or 'failed' + record DLQ.
"""
import logging
from django.utils import timezone

from .channels import (
    ChannelNotRegisteredError,
    get_channel_adapter,
    record_dlq,
)
from .models import (
    NotificationDelivery,
    NotificationPreference,
    NotificationTemplate,
)

logger = logging.getLogger(__name__)


class TemplateMissingError(LookupError):
    pass


def resolve_template(tenant_id, event_type, channel, locale='en-US'):
    """
    Tenant override first, then the core fallback. Returns the highest active
    version when more than one exists.
    """
    tenant_match = (
        NotificationTemplate.objects
        .filter(tenant_id=tenant_id, event_type=event_type, channel=channel,
                locale=locale, is_active=True)
        .order_by('-version').first()
    )
    if tenant_match:
        return tenant_match

    core_match = (
        NotificationTemplate.objects
        .filter(tenant_id__isnull=True, event_type=event_type, channel=channel,
                locale=locale, is_active=True)
        .order_by('-version').first()
    )
    if core_match:
        return core_match

    raise TemplateMissingError(
        f"No template for event='{event_type}' channel='{channel}' locale='{locale}' "
        f"(tenant={tenant_id} or core fallback)"
    )


def is_opted_in(tenant_id, user_id, channel, event_type):
    """
    A preference row with opted_in=False for the specific (channel, event_type)
    or for (channel, '*') suppresses this delivery. Absence of rows = opted in.
    """
    prefs = NotificationPreference.objects.filter(
        tenant_id=tenant_id, user_id=user_id, channel=channel,
    )
    for pref in prefs:
        if pref.event_type == event_type and not pref.opted_in:
            return False
        if pref.event_type == '*' and not pref.opted_in:
            return False
    return True


def render(template, payload):
    """
    Minimal {{ key }} substitution. We deliberately don't pull in Jinja / Django
    templates: the template body is rendered as a plain str.format_map over the
    payload with missing keys left as-is.
    """
    class _Default(dict):
        def __missing__(self, key):
            return '{' + key + '}'

    rendered_body = template.body.format_map(_Default(payload))
    rendered_subject = template.subject.format_map(_Default(payload))
    return rendered_subject, rendered_body


def notify(tenant_id, event_type, channel, recipient_user_id, recipient_address,
           payload=None, locale='en-US'):
    """Send one notification. Returns the persisted NotificationDelivery row."""
    payload = payload or {}

    template = resolve_template(tenant_id, event_type, channel, locale)

    if not template.is_transactional and recipient_user_id is not None:
        if not is_opted_in(tenant_id, recipient_user_id, channel, event_type):
            delivery = NotificationDelivery.objects.create(
                tenant_id=tenant_id, recipient_user_id=recipient_user_id,
                recipient_address=recipient_address, channel=channel,
                event_type=event_type, locale=locale,
                rendered_subject='', rendered_body='',
                status='suppressed', template_version=template.version,
                completed_at=timezone.now(),
            )
            return delivery

    subject, body = render(template, payload)

    delivery = NotificationDelivery.objects.create(
        tenant_id=tenant_id, recipient_user_id=recipient_user_id,
        recipient_address=recipient_address, channel=channel,
        event_type=event_type, locale=locale,
        rendered_subject=subject, rendered_body=body,
        status='queued', template_version=template.version,
    )

    try:
        adapter = get_channel_adapter(channel)
        adapter(recipient_address, subject, body)
        delivery.status = 'sent'
        delivery.completed_at = timezone.now()
        delivery.save(update_fields=['status', 'completed_at'])
    except ChannelNotRegisteredError as exc:
        delivery.status = 'failed'
        delivery.error = str(exc)
        delivery.completed_at = timezone.now()
        delivery.save(update_fields=['status', 'error', 'completed_at'])
        record_dlq(channel, delivery, exc)
        logger.error("[Notifications] %s", exc)
    except Exception as exc:
        delivery.status = 'failed'
        delivery.error = str(exc)
        delivery.completed_at = timezone.now()
        delivery.save(update_fields=['status', 'error', 'completed_at'])
        record_dlq(channel, delivery, exc)
        logger.warning("[Notifications] %s/%s delivery failed: %s", channel, event_type, exc)

    return delivery
