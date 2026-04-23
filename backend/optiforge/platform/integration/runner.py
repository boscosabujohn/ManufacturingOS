"""
Scheduled sync runner + webhook receiver. Both surface failures to the
per-connector DLQ.
"""
import hashlib
import logging
from django.utils import timezone

from .connectors import (
    ConnectorNotRegisteredError,
    connectors as connector_registry,
    record_dlq,
)
from .models import ScheduledSync, WebhookInboundLog
from .webhook import WebhookSignatureError, validate_inbound

logger = logging.getLogger(__name__)


def run_scheduled_sync(scheduled_id):
    scheduled = ScheduledSync.objects.get(pk=scheduled_id)
    if scheduled.status != 'active':
        return None

    try:
        connector = connector_registry.get(scheduled.connector_id)
    except ConnectorNotRegisteredError as exc:
        record_dlq(scheduled.connector_id, attempt=1, error=exc)
        scheduled.last_error = str(exc)
        scheduled.save(update_fields=['last_error'])
        raise

    if not connector.sync_in:
        record_dlq(connector.connector_id, attempt=1,
                   error=RuntimeError(f"Connector '{connector.connector_id}' has no sync_in"))
        raise RuntimeError(f"Connector '{connector.connector_id}' has no sync_in callback")

    try:
        result = connector.sync_in(scheduled.tenant_id, scheduled.params)
        scheduled.last_run_at = timezone.now()
        scheduled.last_error = ''
        scheduled.save(update_fields=['last_run_at', 'last_error'])
        return result
    except Exception as exc:
        record_dlq(connector.connector_id, attempt=1, error=exc)
        scheduled.last_error = str(exc)
        scheduled.save(update_fields=['last_error'])
        raise


def receive_webhook(connector_id, headers, body, tenant_id=None):
    """
    Process an inbound webhook. Validates signature, logs receipt, and
    forwards to the connector's webhook_in callback.
    """
    body_sha = hashlib.sha256(body).hexdigest() if body else ''
    try:
        connector = connector_registry.get(connector_id)
    except ConnectorNotRegisteredError as exc:
        WebhookInboundLog.objects.create(
            tenant_id=tenant_id, connector_id=connector_id,
            body_sha256=body_sha, accepted=False, error=str(exc),
        )
        raise

    secret = connector.metadata.get('webhook_secret')
    if secret is None:
        raise RuntimeError(f"Connector '{connector_id}' has no webhook_secret")

    try:
        validate_inbound(secret, headers, body)
    except WebhookSignatureError as exc:
        WebhookInboundLog.objects.create(
            tenant_id=tenant_id, connector_id=connector_id,
            body_sha256=body_sha, accepted=False, error=str(exc),
        )
        raise

    if not connector.webhook_in:
        raise RuntimeError(f"Connector '{connector_id}' declares no webhook_in handler")

    result = connector.webhook_in(tenant_id, headers, body)
    WebhookInboundLog.objects.create(
        tenant_id=tenant_id, connector_id=connector_id,
        body_sha256=body_sha, accepted=True,
    )
    return result
