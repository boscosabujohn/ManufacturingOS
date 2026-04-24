"""Support: customer tickets, knowledge base, Field Service integration."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class SupportTicket(TenantAwareModel):
    PRIORITY = [('p1', 'P1'), ('p2', 'P2'), ('p3', 'P3'), ('p4', 'P4')]
    STATUS = [('open', 'Open'), ('pending', 'Pending'),
              ('resolved', 'Resolved'), ('closed', 'Closed'),
              ('cancelled', 'Cancelled')]

    number = models.CharField(max_length=50, db_index=True)
    customer_account_id = models.UUIDField()
    installed_unit_id = models.UUIDField(null=True, blank=True)
    subject = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    priority = models.CharField(max_length=10, choices=PRIORITY, default='p3')
    status = models.CharField(max_length=20, choices=STATUS, default='open')
    dispatched_service_id = models.UUIDField(null=True, blank=True,
                                             help_text="Link to field_service.ServiceDispatch")
    created_at = models.DateTimeField(auto_now_add=True)
    resolved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')


class KBArticle(TenantAwareModel):
    slug = models.SlugField(max_length=120, db_index=True)
    title = models.CharField(max_length=255)
    body = models.TextField()
    category = models.CharField(max_length=60, blank=True, default='')
    is_published = models.BooleanField(default=False)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('tenant', 'slug')
