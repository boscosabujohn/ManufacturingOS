import uuid
from django.db import models


class Tenant(models.Model):
    """Core Tenant model with full provisioning lifecycle."""
    STATUS_CHOICES = [
        ('provisioning', 'Provisioning'),
        ('active', 'Active'),
        ('suspended', 'Suspended'),
        ('archived', 'Archived'),
    ]

    STATUS_TRANSITIONS = {
        'provisioning': ['active'],
        'active': ['suspended', 'archived'],
        'suspended': ['active', 'archived'],
        'archived': [],
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='provisioning')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return self.name

    def can_transition_to(self, new_status):
        """Check if the tenant can transition to the given status."""
        allowed = self.STATUS_TRANSITIONS.get(self.status, [])
        return new_status in allowed

    def transition_to(self, new_status):
        """Transition the tenant to a new status. Raises ValueError on invalid transition."""
        if not self.can_transition_to(new_status):
            raise ValueError(
                f"Cannot transition tenant from '{self.status}' to '{new_status}'. "
                f"Allowed transitions: {self.STATUS_TRANSITIONS.get(self.status, [])}"
            )
        self.status = new_status
        self.save()
        return self


class TenantPackActivation(models.Model):
    """Tracks which packs are activated for each tenant."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='pack_activations')
    pack_id = models.CharField(max_length=100, db_index=True)
    pack_version = models.CharField(max_length=50)
    is_active = models.BooleanField(default=True)
    activated_at = models.DateTimeField(auto_now_add=True)
    deactivated_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'pack_id')

    def __str__(self):
        status = 'active' if self.is_active else 'inactive'
        return f"{self.pack_id} v{self.pack_version} on {self.tenant.name} ({status})"


class TenantAwareModel(models.Model):
    """
    Abstract base model for all tenant-scoped entities.
    Enforces a non-nullable tenant_id and provides the base for RLS.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.PROTECT, db_index=True)

    class Meta:
        abstract = True
