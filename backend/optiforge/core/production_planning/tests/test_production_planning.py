from datetime import date
import pytest

from optiforge.core.production_planning.models import (
    BOMHeader, BOMLine, MRPRun, PlannedOrder, Routing, RoutingOperation, WorkOrder,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='PP Tenant', status='active')


@pytest.mark.django_db
def test_bom_structure(tenant):
    h = BOMHeader.objects.create(tenant=tenant, parent_item_code='ASSY-1')
    BOMLine.objects.create(tenant=tenant, bom=h, component_item_code='COMP-A', quantity_per=2)
    BOMLine.objects.create(tenant=tenant, bom=h, component_item_code='COMP-B', quantity_per=5)
    assert h.lines.count() == 2


@pytest.mark.django_db
def test_routing_operations_ordered(tenant):
    r = Routing.objects.create(tenant=tenant, item_code='ASSY-1')
    RoutingOperation.objects.create(tenant=tenant, routing=r, sequence=10,
                                    work_center_code='WC-1', run_minutes_per_unit=5)
    RoutingOperation.objects.create(tenant=tenant, routing=r, sequence=20,
                                    work_center_code='WC-2', run_minutes_per_unit=3)
    seqs = list(r.operations.order_by('sequence').values_list('sequence', flat=True))
    assert seqs == [10, 20]


@pytest.mark.django_db
def test_mrp_run_creates_planned_orders(tenant):
    mrp = MRPRun.objects.create(tenant=tenant, run_number='MRP-1', horizon_days=90)
    po = PlannedOrder.objects.create(
        tenant=tenant, mrp_run=mrp, item_code='COMP-A',
        order_type='buy', quantity=500, required_by=date(2026, 5, 1),
    )
    mrp.planned_orders_created = 1
    mrp.status = 'completed'
    mrp.save()
    assert mrp.planned_orders.count() == 1
    assert po.order_type == 'buy'


@pytest.mark.django_db
def test_work_order_derived_from_planned_order(tenant):
    po = PlannedOrder.objects.create(
        tenant=tenant, item_code='ASSY-1', order_type='make',
        quantity=10, required_by=date(2026, 5, 15),
    )
    wo = WorkOrder.objects.create(
        tenant=tenant, number='WO-1', planned_order=po, item_code='ASSY-1', quantity=10,
    )
    assert wo.planned_order_id == po.id
