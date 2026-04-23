"""
Core workflow definitions shipped by Layer 2 / platform.

Core owns the mode-agnostic skeleton. Anything industry-specific (finishing
review, commissioning handover, …) lives in a pack and is spliced in via
insertion points.
"""
from .runtime import upsert_core_definition


QUOTATION_APPROVAL_V1 = {
    "workflow_id": "QuotationApproval",
    "version": "1.0.0",
    "description": "Review, approve, and issue a customer quotation.",
    "initial_step": "initial_review",
    "steps": [
        {
            "id": "initial_review",
            "name": "Initial Review",
            "transitions": [
                {"on": "approve", "to": "final_approval"},
                {"on": "reject", "to": "rejected"},
            ],
        },
        {
            "id": "final_approval",
            "name": "Final Approval",
            "transitions": [
                {"on": "approve", "to": "issued"},
                {"on": "reject", "to": "rejected"},
            ],
        },
        {"id": "issued", "name": "Issued to Customer", "terminal": True},
        {"id": "rejected", "name": "Rejected", "terminal": True},
    ],
    "insertion_points": [
        {"id": "after_initial_review", "after": "initial_review", "on_event": "approve"},
        {"id": "before_final_approval", "before": "final_approval", "on_event": "approve"},
    ],
}


def seed_core_workflows():
    """Publish core workflow definitions. Idempotent — call from app ready() or tests."""
    upsert_core_definition(QUOTATION_APPROVAL_V1)
