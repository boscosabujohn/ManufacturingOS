import pytest

from optiforge.platform.workflow.exceptions import (
    InstanceTerminalError,
    InvalidTransitionError,
    PackStepFailedError,
    UnknownWorkflowError,
)
from optiforge.platform.workflow.models import WorkflowInsertion
from optiforge.platform.workflow.registry import workflow_registry
from optiforge.platform.workflow.runtime import (
    advance,
    resolve_definition,
    start_instance,
    upsert_core_definition,
)
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
def test_start_instance_captures_definition_version(quotation_workflow):
    instance = start_instance('QuotationApproval')
    assert instance.definition_version == '1.0.0'
    assert instance.current_step == 'initial_review'
    assert instance.status == 'running'
    assert instance.resolved_definition['workflow_id'] == 'QuotationApproval'


@pytest.mark.django_db
def test_happy_path_without_pack(quotation_workflow):
    instance = start_instance('QuotationApproval')
    advance(instance, 'approve')
    assert instance.current_step == 'final_approval'
    advance(instance, 'approve')
    assert instance.current_step == 'issued'
    assert instance.status == 'completed'


@pytest.mark.django_db
def test_invalid_transition_raises(quotation_workflow):
    instance = start_instance('QuotationApproval')
    with pytest.raises(InvalidTransitionError):
        advance(instance, 'no_such_event')


@pytest.mark.django_db
def test_terminal_instance_cannot_advance(quotation_workflow):
    instance = start_instance('QuotationApproval')
    advance(instance, 'reject')
    assert instance.status == 'completed'
    with pytest.raises(InstanceTerminalError):
        advance(instance, 'approve')


@pytest.mark.django_db
def test_unknown_workflow_raises():
    with pytest.raises(UnknownWorkflowError):
        start_instance('DoesNotExist')


@pytest.mark.django_db
def test_definition_version_is_frozen_on_instance(quotation_workflow):
    instance = start_instance('QuotationApproval')

    # Publish a v2 that removes final_approval — the running instance must not feel it.
    v2 = dict(QUOTATION_APPROVAL_V1)
    v2 = {**QUOTATION_APPROVAL_V1, 'version': '2.0.0',
          'steps': [
              {'id': 'initial_review', 'transitions': [{'on': 'approve', 'to': 'issued'}]},
              {'id': 'issued', 'terminal': True},
          ],
          'insertion_points': []}
    upsert_core_definition(v2)

    advance(instance, 'approve')
    assert instance.current_step == 'final_approval'  # still on v1's path
    assert instance.definition_version == '1.0.0'


@pytest.mark.django_db
def test_new_instance_picks_up_new_core_version(quotation_workflow):
    v2 = {**QUOTATION_APPROVAL_V1, 'version': '2.0.0'}
    upsert_core_definition(v2)

    instance = start_instance('QuotationApproval')
    assert instance.definition_version == '2.0.0'


@pytest.mark.django_db
def test_resolve_definition_without_packs_returns_core(quotation_workflow):
    resolved, version = resolve_definition('QuotationApproval', active_pack_ids=[])
    assert version == '1.0.0'
    step_ids = [s['id'] for s in resolved['steps']]
    assert step_ids == ['initial_review', 'final_approval', 'issued', 'rejected']


@pytest.mark.django_db
def test_pack_step_handler_failure_attributes_pack(quotation_workflow):
    WorkflowInsertion.objects.create(
        workflow_id='QuotationApproval',
        pack_id='bad-pack',
        insertion_point='after_initial_review',
        step={'id': 'bad_step', 'step_type': 'bad.handler'},
    )

    def boom(step_id, step_type, context):
        raise RuntimeError("kaboom")

    workflow_registry.register('bad.handler', 'bad-pack', boom)

    instance = start_instance('QuotationApproval', active_pack_ids=['bad-pack'])
    with pytest.raises(PackStepFailedError) as exc_info:
        advance(instance, 'approve')

    assert exc_info.value.pack_id == 'bad-pack'
    assert exc_info.value.step_id == 'bad_step'
    assert exc_info.value.step_type == 'bad.handler'
    instance.refresh_from_db()
    assert instance.status == 'failed'
