import pytest
from unittest.mock import Mock
from django.contrib.auth import get_user_model
from optiforge.platform.identity.permissions import IsTenantMember
from optiforge.platform.identity.models import TenantMembership
from optiforge.platform.tenancy.models import Tenant
from optiforge.platform.tenancy.context import tenant_context

User = get_user_model()

@pytest.fixture
def test_user():
    return User.objects.create_user(username='member_user', email='member@example.com')

@pytest.fixture
def test_tenant():
    return Tenant.objects.create(name='Test Tenant')

@pytest.fixture
def test_membership(test_user, test_tenant):
    return TenantMembership.objects.create(user=test_user, tenant=test_tenant, role='user')

@pytest.fixture
def mock_request(test_user):
    request = Mock()
    request.user = test_user
    return request

@pytest.mark.django_db
def test_permission_granted_for_member(test_user, test_tenant, test_membership, mock_request):
    permission = IsTenantMember()
    with tenant_context(test_tenant.id):
        assert permission.has_permission(mock_request, Mock()) == True

@pytest.mark.django_db
def test_permission_denied_for_non_member(test_user, test_tenant, mock_request):
    permission = IsTenantMember()
    with tenant_context(test_tenant.id):
        # User is not a member of test_tenant
        assert permission.has_permission(mock_request, Mock()) == False

@pytest.mark.django_db
def test_permission_allowed_if_no_tenant_requested(mock_request):
    permission = IsTenantMember()
    # No tenant context set
    assert permission.has_permission(mock_request, Mock()) == True
