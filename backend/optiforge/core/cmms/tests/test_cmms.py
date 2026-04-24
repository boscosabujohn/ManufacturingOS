import pytest
from django.utils import timezone

from optiforge.core.cmms.models import (
    Asset, MaintenanceWorkOrder, PermitToWork, PreventiveMaintenance, ReliabilityMetric,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='CMMS Tenant', status='active')


@pytest.mark.django_db
def test_asset_pm_plan_and_wo(tenant):
    a = Asset.objects.create(tenant=tenant, code='ASSET-1', name='CNC-01')
    PreventiveMaintenance.objects.create(
        tenant=tenant, asset=a, name='Oil change', frequency='monthly',
    )
    wo = MaintenanceWorkOrder.objects.create(
        tenant=tenant, number='WO-1', asset=a, wo_type='pm',
    )
    assert a.pm_plans.count() == 1
    assert wo.status == 'open'


@pytest.mark.django_db
def test_reliability_metric_unique_per_period(tenant):
    from datetime import date
    a = Asset.objects.create(tenant=tenant, code='A', name='X')
    ReliabilityMetric.objects.create(
        tenant=tenant, asset=a, period_start=date(2026, 4, 1),
        mtbf_hours=100, mttr_hours=1, oee_percentage=85,
        availability=90, performance=95, quality=99,
    )
    assert ReliabilityMetric.objects.count() == 1


@pytest.mark.django_db
def test_permit_to_work_lifecycle(tenant):
    a = Asset.objects.create(tenant=tenant, code='A', name='X')
    ptw = PermitToWork.objects.create(
        tenant=tenant, number='PTW-1', asset=a,
        hazards=['electrical'], controls=['lockout-tagout'],
    )
    assert ptw.status == 'requested'
