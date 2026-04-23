import uuid
from django.db import models
from django.conf import settings
from optiforge.platform.tenancy.models import Tenant

class TenantMembership(models.Model):
    """
    Links a User to a Tenant with a specific role.
    For Phase 1, the role defaults to 'user'.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='tenant_memberships')
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='memberships')
    role = models.CharField(max_length=50, default='user')
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'tenant')
        
    def __str__(self):
        return f"{self.user} - {self.tenant.name} ({self.role})"
