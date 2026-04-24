"""
ACERO demand-half regression: lead → account → quotation → sales order with
ETO mode, plus CustomerRequirement BOQ parse and workflow instance start.
"""
import uuid
import pytest

from optiforge.core.crm.models import Account, Lead
from optiforge.core.sales.models import CustomerRequirement, Quotation, SalesOrder
from optiforge.platform.extensions.points import extension_points
from optiforge.platform.extensions.registry import extension_registry
from optiforge.platform.tenancy.models import Tenant
from optiforge.platform.workflow.runtime import start_instance, upsert_core_definition
from optiforge.platform.workflow.seeds import QUOTATION_APPROVAL_V1


@pytest.fixture(autouse=True)
def clean_pack_state():
    extension_registry.clear()
    extension_points.clear()
    yield
    extension_registry.clear()
    extension_points.clear()


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='ACERO Demand Tenant', status='active')


@pytest.mark.django_db
def test_e2e_lead_to_sales_order_eto_mode(tenant):
    lead = Lead.objects.create(
        tenant=tenant, company='Pizzeria Linea', contact_name='Luca Rossi',
    )
    account = Account.objects.create(tenant=tenant, name=lead.company)
    lead.status = 'converted'
    lead.converted_account = account
    lead.save()

    cr = CustomerRequirement.objects.create(
        tenant=tenant, source_type='boq_import',
        source_payload={'file': 'boq.pdf', 'pages': 2},
    )
    assert cr.status == 'draft'

    quote = Quotation.objects.create(
        tenant=tenant, number='Q-E2E-1', customer_requirement=cr,
        total_amount=125000, currency='USD',
    )
    so = SalesOrder.objects.create(
        tenant=tenant, number='SO-E2E-1', quotation=quote, mode='eto',
    )

    assert so.quotation_id == quote.id
    assert so.mode == 'eto'


@pytest.mark.django_db
def test_e2e_boq_parsed_via_pack_parser(tenant):
    from optiforge.packs.kitchen_equipment.loader import load_pack
    load_pack()
    parsed = extension_registry.invoke_parser('boq_import', {'file': 'fake.pdf'})
    assert len(parsed) == 2
    assert parsed[0]['fascia_type'] == 'ss304'


@pytest.mark.django_db
def test_e2e_quotation_approval_workflow_with_ke_pack_active(tenant):
    from optiforge.packs.kitchen_equipment.loader import load_pack
    upsert_core_definition(QUOTATION_APPROVAL_V1)
    load_pack()

    instance = start_instance(
        'QuotationApproval', active_pack_ids=['kitchen-equipment'],
    )
    step_ids = [s['id'] for s in instance.resolved_definition['steps']]
    assert 'finishing_review_step' in step_ids
    assert instance.definition_version == '1.0.0'


@pytest.mark.django_db
def test_e2e_quotation_approval_without_ke_pack_has_no_finishing_step(tenant):
    upsert_core_definition(QUOTATION_APPROVAL_V1)
    instance = start_instance('QuotationApproval', active_pack_ids=[])
    step_ids = [s['id'] for s in instance.resolved_definition['steps']]
    assert 'finishing_review_step' not in step_ids
