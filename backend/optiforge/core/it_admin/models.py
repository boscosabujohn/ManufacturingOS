"""IT & Admin Services: tenant operations surface + user admin workflows."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class TenantConfigSetting(TenantAwareModel):
    """Per-tenant configuration key/value store."""
    key = models.CharField(max_length=120)
    value = models.JSONField(default=dict, blank=True)
    description = models.TextField(blank=True, default='')
    updated_by = models.UUIDField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('tenant', 'key')


class AdminAuditLog(TenantAwareModel):
    """
    Tenant-admin-facing audit log: covers user admin, password resets,
    feature flag toggles, etc. Distinct from the platform hash-chain audit
    (which is compliance-grade).
    """
    actor_user_id = models.UUIDField(null=True, blank=True)
    action = models.CharField(max_length=100)
    target_type = models.CharField(max_length=100, blank=True, default='')
    target_id = models.CharField(max_length=100, blank=True, default='')
    details = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
