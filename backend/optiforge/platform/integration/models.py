import uuid
from django.db import models


class ScheduledSync(models.Model):
    """
    Per-connector scheduled job. The runner picks up due rows, invokes the
    connector's sync_in callback, and routes failures to the connector's DLQ.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True)
    connector_id = models.CharField(max_length=100, db_index=True)
    cron_expression = models.CharField(max_length=100)
    params = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    last_run_at = models.DateTimeField(null=True, blank=True)
    last_error = models.TextField(blank=True, default='')
    created_at = models.DateTimeField(auto_now_add=True)


class WebhookInboundLog(models.Model):
    """Audit row for every inbound webhook, kept for replay and debugging."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True, null=True, blank=True)
    connector_id = models.CharField(max_length=100, db_index=True)
    body_sha256 = models.CharField(max_length=64)
    accepted = models.BooleanField()
    error = models.TextField(blank=True, default='')
    received_at = models.DateTimeField(auto_now_add=True)
