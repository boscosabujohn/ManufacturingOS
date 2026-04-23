from rest_framework import permissions
from optiforge.platform.tenancy.context import get_current_tenant_id
from optiforge.platform.identity.models import TenantMembership

class IsTenantMember(permissions.BasePermission):
    """
    Checks if the authenticated user has a membership in the currently active tenant context.
    """
    message = "User does not have access to this tenant."

    def has_permission(self, request, view):
        tenant_id = get_current_tenant_id()
        if not tenant_id:
            # If no tenant is requested, we can't verify membership.
            # Usually tenant-scoped views will fail anyway via the repository.
            return True
            
        if not request.user or not request.user.is_authenticated:
            return False

        return TenantMembership.objects.filter(
            user=request.user, 
            tenant_id=tenant_id
        ).exists()
