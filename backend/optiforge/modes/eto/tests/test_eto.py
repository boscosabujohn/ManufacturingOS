import uuid
import pytest

from optiforge.modes.eto import service
from optiforge.modes.eto.models import (
    ChangeOrderRequest, DesignLock, LiquidatedDamages,
    MilestoneBillingSchedule, ProjectWorkOrderLink, RetentionPolicy, SiteSurvey,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='ETO Tenant', status='active')


@pytest.mark.django_db
def test_lock_design_creates_lock(tenant):
    so_id = uuid.uuid4()
    lock = service.lock_design(tenant.id, so_id, snapshot={'bom': ['x']})
    assert lock.sales_order_id == so_id
    assert lock.design_snapshot == {'bom': ['x']}


@pytest.mark.django_db
def test_lock_design_is_not_idempotent_while_active(tenant):
    so_id = uuid.uuid4()
    service.lock_design(tenant.id, so_id)
    with pytest.raises(service.DesignAlreadyLockedError):
        service.lock_design(tenant.id, so_id)


@pytest.mark.django_db
def test_submit_change_order_requires_lock(tenant):
    so_id = uuid.uuid4()
    with pytest.raises(service.DesignNotLockedError):
        service.submit_change_order(tenant.id, so_id, 'CO-1', 'reason')


@pytest.mark.django_db
def test_change_order_approval_requires_cost_impact(tenant):
    so_id = uuid.uuid4()
    service.lock_design(tenant.id, so_id)
    co = service.submit_change_order(tenant.id, so_id, 'CO-1', 'dimension tweak')
    with pytest.raises(service.CostImpactRequiredError):
        service.approve_change_order(co)


@pytest.mark.django_db
def test_change_order_flow_with_cost_impact(tenant):
    so_id = uuid.uuid4()
    service.lock_design(tenant.id, so_id)
    co = service.submit_change_order(tenant.id, so_id, 'CO-2', 'add sink')
    service.record_cost_impact(co, cost_impact=2500.50, schedule_impact_days=7)
    co.refresh_from_db()
    assert co.status == 'submitted'
    assert float(co.cost_impact) == 2500.50
    service.approve_change_order(co)
    co.refresh_from_db()
    assert co.status == 'approved'
    assert co.approved_at is not None


@pytest.mark.django_db
def test_project_link_persists(tenant):
    link = ProjectWorkOrderLink.objects.create(
        tenant_id=tenant.id, sales_order_id=uuid.uuid4(), project_id=uuid.uuid4(),
    )
    assert link.created_at is not None


@pytest.mark.django_db
def test_milestone_billing_schedule(tenant):
    so_id = uuid.uuid4()
    MilestoneBillingSchedule.objects.create(
        tenant_id=tenant.id, sales_order_id=so_id,
        milestone_code='M1', percentage=20,
    )
    assert MilestoneBillingSchedule.objects.filter(sales_order_id=so_id).count() == 1


@pytest.mark.django_db
def test_retention_and_ld_records(tenant):
    so_id = uuid.uuid4()
    retention = RetentionPolicy.objects.create(
        tenant_id=tenant.id, sales_order_id=so_id, retention_percentage=10,
    )
    ld = LiquidatedDamages.objects.create(
        tenant_id=tenant.id, sales_order_id=so_id, per_day_amount=500, cap_percentage=10,
    )
    assert retention.retention_percentage == 10
    assert ld.per_day_amount == 500


@pytest.mark.django_db
def test_site_survey_lifecycle(tenant):
    s = SiteSurvey.objects.create(
        tenant_id=tenant.id, sales_order_id=uuid.uuid4(), status='scheduled',
    )
    assert s.status == 'scheduled'
