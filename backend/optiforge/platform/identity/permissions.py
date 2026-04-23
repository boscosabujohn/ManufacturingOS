from rest_framework import permissions
from optiforge.platform.tenancy.context import get_current_tenant_id
from optiforge.platform.identity.models import TenantMembership
from optiforge.platform.identity.abac import evaluate_access


class IsTenantMember(permissions.BasePermission):
    """Checks if the authenticated user has a membership in the active tenant."""
    message = "User does not have access to this tenant."

    def has_permission(self, request, view):
        tenant_id = get_current_tenant_id()
        if not tenant_id:
            return True
        if not request.user or not request.user.is_authenticated:
            return False
        return TenantMembership.objects.filter(
            user=request.user,
            tenant_id=tenant_id
        ).exists()


class HasRole(permissions.BasePermission):
    """
    Checks if the user has a specific role or higher in the current tenant.
    Usage: set `required_role` on the view.
    """
    message = "Insufficient role for this action."

    def has_permission(self, request, view):
        tenant_id = get_current_tenant_id()
        required_role = getattr(view, 'required_role', 'user')
        if not tenant_id or not request.user or not request.user.is_authenticated:
            return False
        try:
            membership = TenantMembership.objects.get(user=request.user, tenant_id=tenant_id)
            return membership.has_role_or_above(required_role)
        except TenantMembership.DoesNotExist:
            return False


class IsDelegatedAdmin(permissions.BasePermission):
    """Checks if the user is a delegated admin for the current tenant."""
    message = "Only delegated admins can perform this action."

    def has_permission(self, request, view):
        tenant_id = get_current_tenant_id()
        if not tenant_id or not request.user or not request.user.is_authenticated:
            return False
        return TenantMembership.objects.filter(
            user=request.user,
            tenant_id=tenant_id,
            is_delegated_admin=True,
        ).exists()


class ABACPermission(permissions.BasePermission):
    """
    Evaluates ABAC policies for the current request.
    Usage: set `abac_resource_type` and `abac_action` on the view.
    """
    message = "Access denied by policy."

    def has_permission(self, request, view):
        tenant_id = get_current_tenant_id()
        resource_type = getattr(view, 'abac_resource_type', None)
        action = getattr(view, 'abac_action', None)

        if not resource_type or not action:
            return True  # No ABAC config on view; skip

        if not tenant_id or not request.user or not request.user.is_authenticated:
            return True  # Let other permissions handle auth

        # Build context for evaluation
        try:
            membership = TenantMembership.objects.get(user=request.user, tenant_id=tenant_id)
            user_role = membership.role
        except TenantMembership.DoesNotExist:
            user_role = None

        context = {
            'user_role': user_role,
            'tenant_id': str(tenant_id),
            'user_id': str(request.user.id),
            'method': request.method,
        }

        decision = evaluate_access(tenant_id, resource_type, action, context)
        if not decision.allowed:
            self.message = decision.reason
        return decision.allowed
