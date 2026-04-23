import uuid
from django.db import models


class ScheduledReport(models.Model):
    """
    A tenant-scoped scheduled report. The run loop (a Celery beat task) reads
    this table, picks up due rows, runs the registered view, exports, and
    delivers via the Notification service.
    """
    FORMAT_CHOICES = [
        ('csv', 'CSV'),
        ('xlsx', 'Excel'),
        ('pdf', 'PDF'),
        ('json', 'JSON'),
    ]

    STATUS_CHOICES = [
        ('active', 'Active'),
        ('paused', 'Paused'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True)
    name = models.CharField(max_length=255)
    view_name = models.CharField(max_length=255)
    params = models.JSONField(default=dict, blank=True)
    cron_expression = models.CharField(
        max_length=100,
        help_text="Standard 5-field cron spec; interpreted by the beat runner.",
    )
    export_format = models.CharField(max_length=10, choices=FORMAT_CHOICES, default='csv')
    delivery_channel = models.CharField(
        max_length=20, default='email',
        help_text="Channel used by the Notification service for delivery.",
    )
    delivery_recipient = models.CharField(
        max_length=255,
        help_text="Email / phone / address forwarded to the Notification service.",
    )
    notification_event_type = models.CharField(
        max_length=100, default='report.scheduled_delivery',
        help_text="Event type used to resolve a notification template.",
    )
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    last_run_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} ({self.cron_expression}) -> {self.export_format}"
