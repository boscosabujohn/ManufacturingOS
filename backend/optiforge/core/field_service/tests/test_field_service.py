import uuid
from datetime import date, datetime, timezone
import pytest

from optiforge.core.field_service.models import (
    InstalledBaseUnit, RMA, ServiceContract, ServiceDispatch,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='FS Tenant', status='active')


@pytest.mark.django_db
def test_installed_base_and_contract(tenant):
    unit = InstalledBaseUnit.objects.create(
        tenant=tenant, serial_number='SN-1', item_code='APP-1',
        customer_account_id=uuid.uuid4(), installed_on=date.today(),
    )
    ServiceContract.objects.create(
        tenant=tenant, number='AMC-1', customer_account_id=unit.customer_account_id,
        contract_type='amc', start_date=date.today(), end_date=date.today(),
        response_sla_hours=4, resolution_sla_hours=48,
    )
    assert InstalledBaseUnit.objects.count() == 1


@pytest.mark.django_db
def test_service_dispatch_lifecycle(tenant):
    unit = InstalledBaseUnit.objects.create(
        tenant=tenant, serial_number='SN-2', item_code='APP-2',
        customer_account_id=uuid.uuid4(),
    )
    d = ServiceDispatch.objects.create(
        tenant=tenant, number='SD-1', installed_unit=unit,
        scheduled_at=datetime.now(timezone.utc),
    )
    assert d.status == 'scheduled'


@pytest.mark.django_db
def test_rma_records_installed_unit(tenant):
    unit = InstalledBaseUnit.objects.create(
        tenant=tenant, serial_number='SN-3', item_code='X',
        customer_account_id=uuid.uuid4(),
    )
    RMA.objects.create(
        tenant=tenant, number='RMA-1', installed_unit=unit, reason='defective',
    )
    assert RMA.objects.filter(installed_unit=unit).count() == 1
