import pytest
from unittest.mock import Mock
from django.contrib.auth import get_user_model
from optiforge.platform.identity.permissions import IsTenantMember, HasRole, IsDelegatedAdmin, ABACPermission
from optiforge.platform.identity.models import TenantMembership, ABACPolicy
from optiforge.platform.tenancy.models import Tenant
from optiforge.platform.tenancy.context import tenant_context

User = get_user_model()


@pytest.fixture
def test_user(db):
    return User.objects.create_user(username='member_user', email='member@example.com')


@pytest.fixture
def admin_user(db):
    return User.objects.create_user(username='admin_user', email='admin@example.com')


@pytest.fixture
def test_tenant(db):
    return Tenant.objects.create(name='Test Tenant')


@pytest.fixture
def user_membership(test_user, test_tenant):
    return TenantMembership.objects.create(user=test_user, tenant=test_tenant, role='user')


@pytest.fixture
def admin_membership(admin_user, test_tenant):
    return TenantMembership.objects.create(user=admin_user, tenant=test_tenant, role='tenant_admin', is_delegated_admin=True)


# --- IsTenantMember ---

@pytest.mark.django_db
def test_permission_granted_for_member(test_user, test_tenant, user_membership):
    request = Mock(user=test_user)
    permission = IsTenantMember()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, Mock()) is True


@pytest.mark.django_db
def test_permission_denied_for_non_member(test_user, test_tenant):
    request = Mock(user=test_user)
    permission = IsTenantMember()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, Mock()) is False


@pytest.mark.django_db
def test_permission_allowed_if_no_tenant_requested(test_user):
    request = Mock(user=test_user)
    permission = IsTenantMember()
    assert permission.has_permission(request, Mock()) is True


# --- HasRole ---

@pytest.mark.django_db
def test_has_role_user_allowed(test_user, test_tenant, user_membership):
    request = Mock(user=test_user)
    view = Mock(required_role='user')
    permission = HasRole()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, view) is True


@pytest.mark.django_db
def test_has_role_user_denied_for_manager(test_user, test_tenant, user_membership):
    request = Mock(user=test_user)
    view = Mock(required_role='manager')
    permission = HasRole()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, view) is False


@pytest.mark.django_db
def test_has_role_admin_allowed_for_manager(admin_user, test_tenant, admin_membership):
    request = Mock(user=admin_user)
    view = Mock(required_role='manager')
    permission = HasRole()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, view) is True


@pytest.mark.django_db
def test_role_hierarchy():
    """Verify role hierarchy levels."""
    assert TenantMembership.ROLE_HIERARCHY['super_admin'] > TenantMembership.ROLE_HIERARCHY['tenant_admin']
    assert TenantMembership.ROLE_HIERARCHY['tenant_admin'] > TenantMembership.ROLE_HIERARCHY['manager']
    assert TenantMembership.ROLE_HIERARCHY['manager'] > TenantMembership.ROLE_HIERARCHY['user']


# --- IsDelegatedAdmin ---

@pytest.mark.django_db
def test_delegated_admin_allowed(admin_user, test_tenant, admin_membership):
    request = Mock(user=admin_user)
    permission = IsDelegatedAdmin()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, Mock()) is True


@pytest.mark.django_db
def test_non_delegated_admin_denied(test_user, test_tenant, user_membership):
    request = Mock(user=test_user)
    permission = IsDelegatedAdmin()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, Mock()) is False


# --- ABACPermission ---

@pytest.mark.django_db
def test_abac_deny_policy(test_user, test_tenant, user_membership):
    """ABAC deny policy blocks access based on user_role."""
    ABACPolicy.objects.create(
        name='Deny users from creating CRs',
        tenant=test_tenant,
        resource_type='sales.customerrequirement',
        action='create',
        conditions={'user_role': 'user'},
        effect='deny',
        priority=10,
    )
    request = Mock(user=test_user, method='POST')
    view = Mock(abac_resource_type='sales.customerrequirement', abac_action='create')
    permission = ABACPermission()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, view) is False


@pytest.mark.django_db
def test_abac_allow_policy(admin_user, test_tenant, admin_membership):
    """ABAC allow policy grants access based on user_role."""
    ABACPolicy.objects.create(
        name='Allow admins to create CRs',
        tenant=test_tenant,
        resource_type='sales.customerrequirement',
        action='create',
        conditions={'user_role': ['tenant_admin', 'super_admin']},
        effect='allow',
        priority=10,
    )
    request = Mock(user=admin_user, method='POST')
    view = Mock(abac_resource_type='sales.customerrequirement', abac_action='create')
    permission = ABACPermission()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, view) is True


@pytest.mark.django_db
def test_abac_no_policies_defaults_allow(test_user, test_tenant, user_membership):
    """No matching ABAC policies defaults to allow."""
    request = Mock(user=test_user, method='GET')
    view = Mock(abac_resource_type='sales.customerrequirement', abac_action='read')
    permission = ABACPermission()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(request, view) is True
