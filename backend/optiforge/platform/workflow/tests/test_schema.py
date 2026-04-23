import pytest

from optiforge.platform.workflow.exceptions import WorkflowValidationError
from optiforge.platform.workflow.schema import validate_definition, validate_insertion


def _valid_def():
    return {
        "workflow_id": "T",
        "version": "1.0.0",
        "initial_step": "s1",
        "steps": [
            {"id": "s1", "transitions": [{"on": "next", "to": "s2"}]},
            {"id": "s2", "terminal": True},
        ],
        "insertion_points": [{"id": "ip_after_s1", "after": "s1"}],
    }


def test_valid_definition_passes():
    validate_definition(_valid_def())


def test_missing_required_field():
    bad = _valid_def()
    del bad["initial_step"]
    with pytest.raises(WorkflowValidationError, match="missing required field 'initial_step'"):
        validate_definition(bad)


def test_initial_step_must_exist():
    bad = _valid_def()
    bad["initial_step"] = "does_not_exist"
    with pytest.raises(WorkflowValidationError, match="not in steps list"):
        validate_definition(bad)


def test_transition_target_must_exist():
    bad = _valid_def()
    bad["steps"][0]["transitions"] = [{"on": "next", "to": "ghost"}]
    with pytest.raises(WorkflowValidationError, match="unknown step 'ghost'"):
        validate_definition(bad)


def test_insertion_point_must_anchor_on_real_step():
    bad = _valid_def()
    bad["insertion_points"] = [{"id": "ip", "after": "ghost"}]
    with pytest.raises(WorkflowValidationError, match="unknown step 'ghost'"):
        validate_definition(bad)


def test_insertion_point_needs_anchor_direction():
    bad = _valid_def()
    bad["insertion_points"] = [{"id": "ip"}]
    with pytest.raises(WorkflowValidationError, match="'after' or 'before'"):
        validate_definition(bad)


def test_valid_insertion_passes():
    validate_insertion({
        "workflow_id": "T",
        "insertion_point": "ip",
        "pack_id": "p1",
        "step": {"id": "s", "step_type": "p.x"},
    })


def test_insertion_missing_step_id():
    with pytest.raises(WorkflowValidationError, match="missing required field 'id'"):
        validate_insertion({
            "workflow_id": "T",
            "insertion_point": "ip",
            "pack_id": "p1",
            "step": {"step_type": "p.x"},
        })
