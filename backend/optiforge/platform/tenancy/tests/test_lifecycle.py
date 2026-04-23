import uuid
import pytest
from optiforge.platform.tenancy.models import Tenant, TenantPackActivation


@pytest.mark.django_db
def test_tenant_lifecycle_provisioning_to_active():
    t = Tenant.objects.create(name='Lifecycle Tenant')
    assert t.status == 'provisioning'
    t.transition_to('active')
    assert t.status == 'active'


@pytest.mark.django_db
def test_tenant_lifecycle_active_to_suspended():
    t = Tenant.objects.create(name='Suspend Test')
    t.transition_to('active')
    t.transition_to('suspended')
    assert t.status == 'suspended'


@pytest.mark.django_db
def test_tenant_lifecycle_suspended_to_active():
    t = Tenant.objects.create(name='Reactivate Test')
    t.transition_to('active')
    t.transition_to('suspended')
    t.transition_to('active')
    assert t.status == 'active'


@pytest.mark.django_db
def test_tenant_lifecycle_archived_is_terminal():
    t = Tenant.objects.create(name='Archive Test')
    t.transition_to('active')
    t.transition_to('archived')
    with pytest.raises(ValueError, match="Cannot transition"):
        t.transition_to('active')


@pytest.mark.django_db
def test_invalid_transition_from_provisioning():
    t = Tenant.objects.create(name='Invalid Test')
    with pytest.raises(ValueError, match="Cannot transition"):
        t.transition_to('suspended')


@pytest.mark.django_db
def test_pack_activation():
    t = Tenant.objects.create(name='Pack Test', status='active')
    activation = TenantPackActivation.objects.create(
        tenant=t, pack_id='kitchen-equipment', pack_version='0.1.0', is_active=True,
    )
    assert activation.is_active is True
    assert TenantPackActivation.objects.filter(tenant=t, is_active=True).count() == 1


@pytest.mark.django_db
def test_pack_deactivation():
    t = Tenant.objects.create(name='Deactivate Test', status='active')
    activation = TenantPackActivation.objects.create(
        tenant=t, pack_id='kitchen-equipment', pack_version='0.1.0', is_active=True,
    )
    activation.is_active = False
    activation.save()
    assert activation.is_active is False
