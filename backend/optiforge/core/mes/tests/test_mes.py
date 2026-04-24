from datetime import datetime, timezone
import pytest

from optiforge.core.mes.models import AndonEvent, OEESnapshot, ProductionRun, WorkCenter
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='MES Tenant', status='active')


@pytest.mark.django_db
def test_production_run_yield(tenant):
    wc = WorkCenter.objects.create(tenant=tenant, code='WC-1', name='Line A')
    run = ProductionRun.objects.create(
        tenant=tenant, work_order_number='WO-1', work_center=wc,
        planned_quantity=100, produced_quantity=90,
    )
    assert run.yield_percentage == 90.0


@pytest.mark.django_db
def test_andon_lifecycle(tenant):
    wc = WorkCenter.objects.create(tenant=tenant, code='WC-2', name='Line B')
    e = AndonEvent.objects.create(
        tenant=tenant, work_center=wc, event_type='quality', description='scratch',
    )
    assert e.status == 'open'


@pytest.mark.django_db
def test_oee_product(tenant):
    wc = WorkCenter.objects.create(tenant=tenant, code='WC-3', name='Line C')
    now = datetime.now(timezone.utc)
    s = OEESnapshot.objects.create(
        tenant=tenant, work_center=wc, period_start=now, period_end=now,
        availability=90, performance=95, quality=99,
    )
    assert round(s.oee, 2) == round((90 * 95 * 99) / 10_000.0, 2)
