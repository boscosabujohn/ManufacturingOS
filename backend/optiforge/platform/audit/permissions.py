"""
Audit reader role. Tenant admins cannot read audit logs by default — only
users explicitly granted the `audit_reader` role via AuditReaderGrant may.
"""
from rest_framework import permissions

from .models import AuditReaderGrant


class IsAuditReader(permissions.BasePermission):
    """Grants access only to users with an active AuditReaderGrant in the tenant."""

    message = "User does not have the audit-reader role."

    def has_permission(self, request, view):
        from optiforge.platform.tenancy.context import get_current_tenant_id

        tenant_id = get_current_tenant_id()
        if not tenant_id or not request.user or not request.user.is_authenticated:
            return False
        return AuditReaderGrant.objects.filter(
            tenant_id=tenant_id, user=request.user, is_active=True,
        ).exists()
