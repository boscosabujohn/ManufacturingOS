import uuid
from django.db import models


CHANNEL_CHOICES = [
    ('email', 'Email'),
    ('sms', 'SMS'),
    ('push', 'Push'),
    ('in_app', 'In-App Inbox'),
]

DELIVERY_STATUS_CHOICES = [
    ('queued', 'Queued'),
    ('sent', 'Sent'),
    ('failed', 'Failed'),
    ('bounced', 'Bounced'),
    ('suppressed', 'Suppressed by opt-out'),
]


class NotificationTemplate(models.Model):
    """
    Versioned template for a notification. Tenant-scoped templates shadow core
    templates of the same (channel, event_type, locale) — look-up logic returns
    the tenant-specific row if present, else falls back to the tenant=NULL row.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(null=True, blank=True, db_index=True,
                                 help_text="Null = core template (fallback)")
    event_type = models.CharField(max_length=100, db_index=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    locale = models.CharField(max_length=10, default='en-US')
    version = models.IntegerField(default=1)
    subject = models.CharField(max_length=255, blank=True, default='')
    body = models.TextField()
    is_transactional = models.BooleanField(
        default=False,
        help_text="Transactional templates bypass user opt-out preferences.",
    )
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant_id', 'event_type', 'channel', 'locale', 'version')
        indexes = [
            models.Index(fields=['event_type', 'channel', 'locale', 'is_active']),
        ]

    def __str__(self):
        scope = 'core' if self.tenant_id is None else f'tenant={self.tenant_id}'
        return f"[{scope}] {self.event_type}/{self.channel}/{self.locale} v{self.version}"


class NotificationPreference(models.Model):
    """Per-user opt-in/opt-out per channel + event_type."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user_id = models.UUIDField(db_index=True)
    tenant_id = models.UUIDField(db_index=True)
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    event_type = models.CharField(max_length=100, help_text="Use '*' to opt out of all")
    opted_in = models.BooleanField(default=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('user_id', 'tenant_id', 'channel', 'event_type')


class NotificationDelivery(models.Model):
    """An attempted delivery. Status is observable by downstream dashboards."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True)
    recipient_user_id = models.UUIDField(db_index=True, null=True, blank=True)
    recipient_address = models.CharField(max_length=255, blank=True, default='',
                                         help_text="Email address, phone, device token, …")
    channel = models.CharField(max_length=20, choices=CHANNEL_CHOICES)
    event_type = models.CharField(max_length=100, db_index=True)
    locale = models.CharField(max_length=10, default='en-US')
    rendered_subject = models.CharField(max_length=255, blank=True, default='')
    rendered_body = models.TextField()
    status = models.CharField(max_length=20, choices=DELIVERY_STATUS_CHOICES, default='queued')
    error = models.TextField(blank=True, default='')
    template_version = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        indexes = [
            models.Index(fields=['tenant_id', 'status']),
            models.Index(fields=['event_type', 'status']),
        ]
