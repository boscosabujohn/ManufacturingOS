"""
Acceptance test for issue #32: KitchenEquipment inserts finishing_review_step
into QuotationApproval at runtime when active, and already-running instances
are untouched.
"""
import pytest

from optiforge.packs.kitchen_equipment.workflow import register_workflow_extensions
from optiforge.platform.workflow.registry import workflow_registry
from optiforge.platform.workflow.runtime import advance, start_instance, upsert_core_definition
from optiforge.platform.workflow.seeds import QUOTATION_APPROVAL_V1


@pytest.fixture(autouse=True)
def clean_registry():
    workflow_registry.clear()
    yield
    workflow_registry.clear()


@pytest.fixture
def quotation_workflow(db):
    return upsert_core_definition(QUOTATION_APPROVAL_V1)


@pytest.mark.django_db
def test_finishing_review_absent_when_pack_inactive(quotation_workflow):
    register_workflow_extensions()
    instance = start_instance('QuotationApproval', active_pack_ids=[])

    step_ids = [s['id'] for s in instance.resolved_definition['steps']]
    assert 'finishing_review_step' not in step_ids


@pytest.mark.django_db
def test_finishing_review_present_when_pack_active(quotation_workflow):
    register_workflow_extensions()
    instance = start_instance('QuotationApproval', active_pack_ids=['kitchen-equipment'])

    step_ids = [s['id'] for s in instance.resolved_definition['steps']]
    assert 'finishing_review_step' in step_ids

    advance(instance, 'approve')
    assert instance.current_step == 'finishing_review_step'
    assert instance.context.get('finishing_review_seen') is True

    advance(instance, 'next')
    assert instance.current_step == 'final_approval'

    advance(instance, 'approve')
    assert instance.current_step == 'issued'
    assert instance.status == 'completed'


@pytest.mark.django_db
def test_running_instance_immune_to_later_pack_activation(quotation_workflow):
    early = start_instance('QuotationApproval', active_pack_ids=[])

    register_workflow_extensions()
    late = start_instance('QuotationApproval', active_pack_ids=['kitchen-equipment'])

    early_ids = {s['id'] for s in early.resolved_definition['steps']}
    late_ids = {s['id'] for s in late.resolved_definition['steps']}

    assert 'finishing_review_step' not in early_ids
    assert 'finishing_review_step' in late_ids

    advance(early, 'approve')
    assert early.current_step == 'final_approval'
