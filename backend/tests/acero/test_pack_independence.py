"""
ACERO pack-independence check: the core demand/design half must succeed with
no pack active. Regression guard for the layering seam.
"""
import pytest

from optiforge.core.sales.models import CustomerRequirement, Quotation, SalesOrder
from optiforge.modes.eto import service as eto
from optiforge.platform.tenancy.models import Tenant
from optiforge.platform.workflow.runtime import start_instance, upsert_core_definition
from optiforge.platform.workflow.seeds import QUOTATION_APPROVAL_V1


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='No-Pack Tenant', status='active')


@pytest.mark.django_db
def test_no_pack_full_demand_design_flow_succeeds(tenant):
    cr = CustomerRequirement.objects.create(tenant=tenant, source_type='rfq_spec')
    q = Quotation.objects.create(tenant=tenant, number='NP-Q-1', customer_requirement=cr)
    so = SalesOrder.objects.create(tenant=tenant, number='NP-SO-1', quotation=q, mode='eto')

    eto.lock_design(tenant.id, so.id)
    co = eto.submit_change_order(tenant.id, so.id, 'CO-NP-1', 'tweak')
    eto.record_cost_impact(co, cost_impact=1000)
    eto.approve_change_order(co)

    assert co.status == 'approved'


@pytest.mark.django_db
def test_no_pack_quotation_workflow_uses_pure_core_steps(tenant):
    upsert_core_definition(QUOTATION_APPROVAL_V1)
    instance = start_instance('QuotationApproval', active_pack_ids=[])
    step_ids = [s['id'] for s in instance.resolved_definition['steps']]
    assert step_ids == ['initial_review', 'final_approval', 'issued', 'rejected']
