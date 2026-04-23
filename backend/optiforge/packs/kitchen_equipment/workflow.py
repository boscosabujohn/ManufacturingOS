"""
KitchenEquipment pack workflow extensions.

Inserts finishing_review_step into the core QuotationApproval workflow at
the 'after_initial_review' insertion point, and registers a step handler
for the 'kitchen.finishing_review' step type.
"""
from optiforge.platform.workflow.models import WorkflowInsertion
from optiforge.platform.workflow.registry import workflow_registry


FINISHING_REVIEW_INSERTION = {
    "workflow_id": "QuotationApproval",
    "pack_id": "kitchen-equipment",
    "insertion_point": "after_initial_review",
    "step": {
        "id": "finishing_review_step",
        "name": "Finishing Review (Kitchen)",
        "step_type": "kitchen.finishing_review",
    },
}


def finishing_review_handler(step_id, step_type, context):
    """
    Phase 2 stub: records that a kitchen finishing review was evaluated.
    A real handler would call the finishing-cost calculator, check the QC
    gate state, and push an e-signature request.
    """
    context['finishing_review_seen'] = True
    return {'ok': True, 'step': step_id}


def register_workflow_extensions():
    """Register insertion + step handler. Idempotent."""
    WorkflowInsertion.objects.update_or_create(
        workflow_id=FINISHING_REVIEW_INSERTION['workflow_id'],
        pack_id=FINISHING_REVIEW_INSERTION['pack_id'],
        insertion_point=FINISHING_REVIEW_INSERTION['insertion_point'],
        defaults={
            'step': FINISHING_REVIEW_INSERTION['step'],
            'is_active': True,
        },
    )
    workflow_registry.register(
        step_type='kitchen.finishing_review',
        pack_id='kitchen-equipment',
        handler=finishing_review_handler,
    )
