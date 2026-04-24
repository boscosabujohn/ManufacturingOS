import uuid
from datetime import date
import pytest

from optiforge.core.sop.models import (
    ATPQuote, ConsensusRound, DemandForecast, MasterProductionSchedule,
    RoughCutCapacityPlan,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='SOP Tenant', status='active')


@pytest.mark.django_db
def test_demand_forecast_versioned(tenant):
    DemandForecast.objects.create(
        tenant=tenant, period_start=date(2026, 5, 1),
        item_code='ITEM-1', forecast_qty=100, version=1,
    )
    DemandForecast.objects.create(
        tenant=tenant, period_start=date(2026, 5, 1),
        item_code='ITEM-1', forecast_qty=120, version=2,
    )
    assert DemandForecast.objects.filter(item_code='ITEM-1').count() == 2


@pytest.mark.django_db
def test_rccp_shortfall(tenant):
    rccp = RoughCutCapacityPlan.objects.create(
        tenant=tenant, period_start=date(2026, 5, 1),
        resource_code='LINE-1', required_hours=200, available_hours=160,
    )
    assert rccp.shortfall_hours == 40


@pytest.mark.django_db
def test_atp_and_ctp_quote(tenant):
    atp = ATPQuote.objects.create(
        tenant=tenant, customer_requirement_id=uuid.uuid4(),
        promise_date=date(2026, 6, 15), promise_qty=50, is_ctp=False,
    )
    ctp = ATPQuote.objects.create(
        tenant=tenant, customer_requirement_id=uuid.uuid4(),
        promise_date=date(2026, 6, 20), promise_qty=25, is_ctp=True,
    )
    assert not atp.is_ctp
    assert ctp.is_ctp


@pytest.mark.django_db
def test_mps_status_flow(tenant):
    row = MasterProductionSchedule.objects.create(
        tenant=tenant, period_start=date(2026, 5, 1),
        item_code='ITEM-1', qty=100, status='proposed',
    )
    row.status = 'approved'
    row.save()
    assert MasterProductionSchedule.objects.filter(status='approved').count() == 1


@pytest.mark.django_db
def test_consensus_round_lock(tenant):
    c = ConsensusRound.objects.create(
        tenant=tenant, cycle_name='2026-Q2', forecast_version=1,
    )
    assert c.status == 'open'
    c.status = 'locked'
    c.save()
    assert ConsensusRound.objects.filter(status='locked').count() == 1
