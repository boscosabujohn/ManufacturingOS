"""
Delegated-admin helpers. A delegated admin can create users + assign roles
within their tenant only. Cross-tenant admin operations are rejected.
"""
from django.contrib.auth import get_user_model

from .models import TenantMembership

User = get_user_model()


class CrossTenantAdminError(PermissionError):
    """Raised when a delegated admin tries to act outside their tenant."""


def create_tenant_user(acting_membership, username, email, role, tenant):
    """
    Create a user in the given tenant, assigning them `role`. The acting
    membership must be a delegated admin of `tenant`; attempts outside the
    tenant are rejected.
    """
    if acting_membership.tenant_id != tenant.id:
        raise CrossTenantAdminError(
            f"Delegated admin of tenant {acting_membership.tenant_id} "
            f"cannot create users in tenant {tenant.id}"
        )
    if not acting_membership.is_delegated_admin:
        raise CrossTenantAdminError("Acting user is not a delegated admin")

    user = User.objects.create_user(username=username, email=email)
    membership = TenantMembership.objects.create(
        user=user, tenant=tenant, role=role,
    )
    return user, membership
