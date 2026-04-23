"""
Report runner. Executes a registered view, exports, and hands the payload
to the Notification service for delivery.
"""
import base64
import logging
from django.utils import timezone

from . import views as view_registry
from .exporters import export
from .models import ScheduledReport

logger = logging.getLogger(__name__)


def run_report(view_name, tenant_id, export_format='csv', params=None):
    """Return the exported bytes for a named view."""
    view = view_registry.get_view(view_name)
    rows = view_registry.run(view_name, tenant_id, params)
    return view.columns, export(export_format, view.columns, rows)


def run_scheduled_report(scheduled_id, notify_fn=None):
    """
    Execute a ScheduledReport row. `notify_fn` defaults to the Notification
    service but is injectable so tests can avoid the import.
    """
    scheduled = ScheduledReport.objects.get(pk=scheduled_id)
    if scheduled.status != 'active':
        logger.info("[Reporting] schedule %s is paused; skipping", scheduled.id)
        return None

    columns, body = run_report(
        scheduled.view_name, scheduled.tenant_id,
        scheduled.export_format, scheduled.params,
    )

    if notify_fn is None:
        from optiforge.platform.notifications.service import notify as notify_fn

    encoded = base64.b64encode(body).decode('ascii')
    delivery = notify_fn(
        tenant_id=scheduled.tenant_id,
        event_type=scheduled.notification_event_type,
        channel=scheduled.delivery_channel,
        recipient_user_id=None,
        recipient_address=scheduled.delivery_recipient,
        payload={
            'report_name': scheduled.name,
            'format': scheduled.export_format,
            'rows_b64': encoded,
            'columns': ','.join(columns),
        },
    )

    scheduled.last_run_at = timezone.now()
    scheduled.save(update_fields=['last_run_at'])
    return delivery
