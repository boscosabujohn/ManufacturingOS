import uuid
from django.db import models

class Tenant(models.Model):
    """
    Core Tenant model for the platform.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    status = models.CharField(
        max_length=20,
        choices=[
            ('provisioning', 'Provisioning'),
            ('active', 'Active'),
            ('suspended', 'Suspended'),
            ('archived', 'Archived'),
        ],
        default='provisioning'
    )
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

class TenantAwareModel(models.Model):
    """
    Abstract base model for all tenant-scoped entities.
    Enforces a non-nullable tenant_id and provides the base for RLS.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.PROTECT, db_index=True)
    
    class Meta:
        abstract = True
