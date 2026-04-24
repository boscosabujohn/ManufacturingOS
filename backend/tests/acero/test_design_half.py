"""
ACERO design-half regression: sales order → design lock → change request →
cost impact → approval. Includes PLM ECR/ECO chain.
"""
import uuid
import pytest

from optiforge.core.plm.models import ChangeOrder, ChangeRequest, Part, PartRevision
from optiforge.core.project.models import Milestone, Project, WBSNode
from optiforge.core.sales.models import CustomerRequirement, Quotation, SalesOrder
from optiforge.modes.eto import service as eto
from optiforge.modes.eto.models import (
    MilestoneBillingSchedule, ProjectWorkOrderLink,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='ACERO Design Tenant', status='active')


@pytest.mark.django_db
def test_e2e_design_lock_then_approved_change_order(tenant):
    cr = CustomerRequirement.objects.create(tenant=tenant, source_type='boq_import')
    q = Quotation.objects.create(tenant=tenant, number='Q-D-1', customer_requirement=cr)
    so = SalesOrder.objects.create(tenant=tenant, number='SO-D-1', quotation=q, mode='eto')

    eto.lock_design(tenant.id, so.id, snapshot={'bom_hash': 'abc'})
    co = eto.submit_change_order(tenant.id, so.id, 'CO-1', 'customer request')
    eto.record_cost_impact(co, cost_impact=5000, schedule_impact_days=3)
    eto.approve_change_order(co)

    co.refresh_from_db()
    assert co.status == 'approved'
    assert float(co.cost_impact) == 5000.0


@pytest.mark.django_db
def test_e2e_plm_ecr_to_eco_chain(tenant):
    part = Part.objects.create(tenant=tenant, part_number='P-1', name='Panel')
    PartRevision.objects.create(tenant=tenant, part=part, rev_code='A', status='released')
    ecr = ChangeRequest.objects.create(tenant=tenant, number='ECR-1', title='Thicken panel')
    eco = ChangeOrder.objects.create(tenant=tenant, change_request=ecr, number='ECO-1')
    assert eco.change_request.number == 'ECR-1'


@pytest.mark.django_db
def test_e2e_project_milestones_and_billing(tenant):
    from datetime import date
    proj = Project.objects.create(tenant=tenant, code='PRJ-D-1', name='Install A')
    WBSNode.objects.create(tenant=tenant, project=proj, code='1', name='Design')
    Milestone.objects.create(
        tenant=tenant, project=proj, name='Design Lock',
        target_date=date.today(), invoice_percentage=20,
    )

    cr = CustomerRequirement.objects.create(tenant=tenant, source_type='boq_import')
    q = Quotation.objects.create(tenant=tenant, number='Q-D-2', customer_requirement=cr)
    so = SalesOrder.objects.create(tenant=tenant, number='SO-D-2', quotation=q, mode='eto')

    ProjectWorkOrderLink.objects.create(
        tenant_id=tenant.id, sales_order_id=so.id, project_id=proj.id,
    )
    MilestoneBillingSchedule.objects.create(
        tenant_id=tenant.id, sales_order_id=so.id,
        milestone_code='M-DESIGN-LOCK', percentage=20,
    )
    assert MilestoneBillingSchedule.objects.filter(sales_order_id=so.id).count() == 1
