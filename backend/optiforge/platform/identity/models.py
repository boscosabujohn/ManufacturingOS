import uuid
from django.db import models
from django.conf import settings
from optiforge.platform.tenancy.models import Tenant


class TenantMembership(models.Model):
    """
    Links a User to a Tenant with a specific role.
    Supports role hierarchy: super_admin > tenant_admin > manager > user.
    """
    ROLE_CHOICES = [
        ('super_admin', 'Super Admin'),
        ('tenant_admin', 'Tenant Admin'),
        ('manager', 'Manager'),
        ('user', 'User'),
    ]

    ROLE_HIERARCHY = {
        'super_admin': 4,
        'tenant_admin': 3,
        'manager': 2,
        'user': 1,
    }

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tenant_memberships')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=50, choices=ROLE_CHOICES, default='user')
    is_delegated_admin = models.BooleanField(default=False, help_text="Whether this user can manage other users in this tenant")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('user', 'tenant')

    def __str__(self):
        return f"{self.user} - {self.tenant.name} ({self.role})"

    @property
    def role_level(self):
        return self.ROLE_HIERARCHY.get(self.role, 0)

    def has_role_or_above(self, required_role):
        """Check if this membership has the required role or higher."""
        required_level = self.ROLE_HIERARCHY.get(required_role, 0)
        return self.role_level >= required_level


class ABACPolicy(models.Model):
    """
    Attribute-Based Access Control policy rule.
    Evaluated at runtime to grant or deny access based on attributes of the
    user, resource, action, and environment.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='abac_policies', null=True, blank=True,
                               help_text="Null = global policy; set = tenant-specific")
    resource_type = models.CharField(max_length=100, help_text="e.g. 'sales.customerrequirement'")
    action = models.CharField(max_length=50, help_text="e.g. 'create', 'read', 'update', 'delete'")
    conditions = models.JSONField(default=dict, help_text="JSON conditions evaluated against request context")
    effect = models.CharField(max_length=10, choices=[('allow', 'Allow'), ('deny', 'Deny')], default='allow')
    priority = models.IntegerField(default=0, help_text="Higher priority policies are evaluated first")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-priority']

    def __str__(self):
        return f"[{self.effect}] {self.name}: {self.resource_type}.{self.action}"

    def evaluate(self, context):
        """
        Evaluate this policy against a request context dict.
        Context should include: user_role, tenant_id, resource_attrs, etc.
        Returns True if all conditions match.
        """
        for key, expected in self.conditions.items():
            actual = context.get(key)
            if isinstance(expected, list):
                if actual not in expected:
                    return False
            elif actual != expected:
                return False
        return True


class MFAConfig(models.Model):
    """
    MFA configuration per user. Phase 2 supports TOTP only.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.OneToOneField(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='mfa_config')
    is_enabled = models.BooleanField(default=False)
    totp_secret = models.CharField(max_length=64, blank=True, default='')
    backup_codes = models.JSONField(default=list, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"MFA for {self.user} ({'enabled' if self.is_enabled else 'disabled'})"
