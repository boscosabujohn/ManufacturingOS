"""Tests for issue #36 finishing: SAML, TOTP, role hierarchy, delegated admin."""
import pytest
from django.contrib.auth import get_user_model

from optiforge.platform.identity import totp
from optiforge.platform.identity.abac import evaluate_access
from optiforge.platform.identity.delegated_admin import (
    CrossTenantAdminError, create_tenant_user,
)
from optiforge.platform.identity.models import ABACPolicy, TenantMembership
from optiforge.platform.identity.role_hierarchy import (
    RoleCycleError, RoleHierarchy, UnknownRoleError,
)
from optiforge.platform.identity.saml import (
    SAMLAssertionError, sign_assertion, sp_metadata_xml, verify_response,
)
from optiforge.platform.tenancy.models import Tenant

User = get_user_model()


# --- SAML ---

def test_sp_metadata_contains_entity_and_acs():
    xml = sp_metadata_xml('https://optiforge.example/sp', 'https://optiforge.example/acs')
    assert 'https://optiforge.example/sp' in xml
    assert 'https://optiforge.example/acs' in xml
    assert 'SPSSODescriptor' in xml


def test_sp_metadata_missing_fields_rejected():
    with pytest.raises(ValueError):
        sp_metadata_xml('', 'https://x/acs')


def test_saml_sign_verify_roundtrip():
    assertion = '<Assertion>user@example.com</Assertion>'
    sig = sign_assertion(assertion, 'shared')
    assert verify_response(assertion, sig, 'shared') == assertion


def test_saml_signature_mismatch_raises():
    with pytest.raises(SAMLAssertionError):
        verify_response('<Assertion>x</Assertion>', 'deadbeef', 'shared')


# --- TOTP ---

def test_totp_verify_valid_code():
    secret = totp.generate_secret()
    code = totp.generate_code(secret)
    assert totp.verify(secret, code)


def test_totp_verify_wrong_code_rejected():
    secret = totp.generate_secret()
    assert not totp.verify(secret, '000000')


def test_totp_window_tolerates_small_clock_drift():
    secret = totp.generate_secret()
    # Generate code for timestamp `t - 30s` but verify at `t` with window=1.
    now = 1_700_000_000
    code_prev = totp.generate_code(secret, at=now - totp.TOTP_STEP_SECONDS)
    assert totp.verify(secret, code_prev, at=now, window=1)


# --- Role hierarchy ---

def test_role_hierarchy_inherits_permissions():
    h = RoleHierarchy()
    h.add_role('user', permissions=['read.order'])
    h.add_role('manager', parents=['user'], permissions=['approve.quote'])
    h.add_role('admin', parents=['manager'], permissions=['manage.users'])

    assert h.permissions_of('admin') == {'read.order', 'approve.quote', 'manage.users'}
    assert h.permissions_of('manager') == {'read.order', 'approve.quote'}
    assert h.permissions_of('user') == {'read.order'}


def test_role_cycle_rejected_at_definition():
    h = RoleHierarchy()
    h.add_role('a')
    h.add_role('b', parents=['a'])
    # Make `a` inherit from `b` (creates cycle a -> b -> a)
    h._roles['a']['parents'].append('b')
    with pytest.raises(RoleCycleError):
        h._check_cycle('a')


def test_unknown_parent_rejected():
    h = RoleHierarchy()
    with pytest.raises(UnknownRoleError):
        h.add_role('a', parents=['ghost'])


# --- ABAC with plant-scoped rule ---

@pytest.mark.django_db
def test_abac_plant_scoped_read():
    """A user should be able to read items only in their plant."""
    tenant = Tenant.objects.create(name='Plant Tenant', status='active')

    ABACPolicy.objects.create(
        name='Plant restricted read', tenant=tenant,
        resource_type='inventory.item', action='read',
        conditions={'user_plant': 'PLANT-A', 'item_plant': 'PLANT-A'},
        effect='allow', priority=20,
    )
    ABACPolicy.objects.create(
        name='Default deny cross-plant', tenant=tenant,
        resource_type='inventory.item', action='read',
        conditions={},
        effect='deny', priority=10,
    )

    ok_ctx = {'user_plant': 'PLANT-A', 'item_plant': 'PLANT-A'}
    bad_ctx = {'user_plant': 'PLANT-A', 'item_plant': 'PLANT-B'}

    assert evaluate_access(tenant.id, 'inventory.item', 'read', ok_ctx).allowed
    assert not evaluate_access(tenant.id, 'inventory.item', 'read', bad_ctx).allowed


# --- Delegated admin ---

@pytest.mark.django_db
def test_delegated_admin_creates_user_in_own_tenant():
    tenant = Tenant.objects.create(name='T1', status='active')
    admin = User.objects.create_user(username='deleg_admin', email='da@example.com')
    admin_membership = TenantMembership.objects.create(
        user=admin, tenant=tenant, role='tenant_admin', is_delegated_admin=True,
    )

    user, membership = create_tenant_user(
        admin_membership, username='new_user', email='new@example.com',
        role='user', tenant=tenant,
    )
    assert membership.tenant_id == tenant.id
    assert membership.role == 'user'


@pytest.mark.django_db
def test_delegated_admin_cannot_cross_tenant():
    tenant_a = Tenant.objects.create(name='A', status='active')
    tenant_b = Tenant.objects.create(name='B', status='active')
    admin = User.objects.create_user(username='da', email='a@example.com')
    admin_membership = TenantMembership.objects.create(
        user=admin, tenant=tenant_a, role='tenant_admin', is_delegated_admin=True,
    )
    with pytest.raises(CrossTenantAdminError):
        create_tenant_user(
            admin_membership, username='new', email='n@example.com',
            role='user', tenant=tenant_b,
        )


@pytest.mark.django_db
def test_non_delegated_admin_cannot_create_users():
    tenant = Tenant.objects.create(name='T', status='active')
    not_admin = User.objects.create_user(username='u', email='u@example.com')
    membership = TenantMembership.objects.create(
        user=not_admin, tenant=tenant, role='manager', is_delegated_admin=False,
    )
    with pytest.raises(CrossTenantAdminError):
        create_tenant_user(
            membership, username='new', email='n@example.com',
            role='user', tenant=tenant,
        )
