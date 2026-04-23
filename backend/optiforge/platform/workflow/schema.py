"""
JSON schema + validator for workflow definitions and pack insertions.

A workflow definition describes a state machine as pure data:
  - a list of steps with typed transitions
  - a set of named insertion points at which packs may inject steps
  - a version string (semantic) used to pin running instances
"""
from .exceptions import WorkflowValidationError


WORKFLOW_DEFINITION_SCHEMA = {
    "type": "object",
    "required": ["workflow_id", "version", "initial_step", "steps"],
    "properties": {
        "workflow_id": {"type": "string"},
        "version": {"type": "string"},
        "description": {"type": "string"},
        "initial_step": {"type": "string"},
        "steps": {
            "type": "array",
            "minItems": 1,
            "items": {
                "type": "object",
                "required": ["id"],
                "properties": {
                    "id": {"type": "string"},
                    "name": {"type": "string"},
                    "step_type": {"type": "string"},
                    "terminal": {"type": "boolean"},
                    "transitions": {
                        "type": "array",
                        "items": {
                            "type": "object",
                            "required": ["on", "to"],
                            "properties": {
                                "on": {"type": "string"},
                                "to": {"type": "string"},
                            },
                        },
                    },
                },
            },
        },
        "insertion_points": {
            "type": "array",
            "items": {
                "type": "object",
                "required": ["id"],
                "properties": {
                    "id": {"type": "string"},
                    "after": {"type": "string"},
                    "before": {"type": "string"},
                    "on_event": {"type": "string"},
                },
            },
        },
    },
}


INSERTION_SCHEMA = {
    "type": "object",
    "required": ["workflow_id", "insertion_point", "pack_id", "step"],
    "properties": {
        "workflow_id": {"type": "string"},
        "insertion_point": {"type": "string"},
        "pack_id": {"type": "string"},
        "step": {
            "type": "object",
            "required": ["id"],
            "properties": {
                "id": {"type": "string"},
                "name": {"type": "string"},
                "step_type": {"type": "string"},
                "transitions": {"type": "array"},
            },
        },
    },
}


def _check_type(value, expected_type, path):
    if expected_type == "string" and not isinstance(value, str):
        raise WorkflowValidationError(f"{path}: expected string, got {type(value).__name__}")
    if expected_type == "boolean" and not isinstance(value, bool):
        raise WorkflowValidationError(f"{path}: expected boolean, got {type(value).__name__}")
    if expected_type == "array" and not isinstance(value, list):
        raise WorkflowValidationError(f"{path}: expected array, got {type(value).__name__}")
    if expected_type == "object" and not isinstance(value, dict):
        raise WorkflowValidationError(f"{path}: expected object, got {type(value).__name__}")


def _validate_schema(obj, schema, path="$"):
    _check_type(obj, schema.get("type", "object"), path)

    if schema.get("type") == "object":
        for required_field in schema.get("required", []):
            if required_field not in obj:
                raise WorkflowValidationError(f"{path}: missing required field '{required_field}'")
        for field_name, field_schema in schema.get("properties", {}).items():
            if field_name in obj:
                _validate_schema(obj[field_name], field_schema, f"{path}.{field_name}")

    if schema.get("type") == "array":
        min_items = schema.get("minItems")
        if min_items is not None and len(obj) < min_items:
            raise WorkflowValidationError(f"{path}: requires at least {min_items} item(s)")
        item_schema = schema.get("items")
        if item_schema:
            for i, item in enumerate(obj):
                _validate_schema(item, item_schema, f"{path}[{i}]")


def validate_definition(definition):
    """Validate a workflow definition dict. Raises WorkflowValidationError on failure."""
    _validate_schema(definition, WORKFLOW_DEFINITION_SCHEMA)

    step_ids = {step["id"] for step in definition["steps"]}
    if definition["initial_step"] not in step_ids:
        raise WorkflowValidationError(
            f"initial_step '{definition['initial_step']}' is not in steps list"
        )

    for step in definition["steps"]:
        for i, transition in enumerate(step.get("transitions", [])):
            if transition["to"] not in step_ids:
                raise WorkflowValidationError(
                    f"step '{step['id']}' transition[{i}] points to unknown step '{transition['to']}'"
                )

    insertion_point_ids = set()
    for ip in definition.get("insertion_points", []):
        if ip["id"] in insertion_point_ids:
            raise WorkflowValidationError(f"duplicate insertion_point id: '{ip['id']}'")
        insertion_point_ids.add(ip["id"])
        anchor = ip.get("after") or ip.get("before")
        if not anchor:
            raise WorkflowValidationError(
                f"insertion_point '{ip['id']}' must declare 'after' or 'before'"
            )
        if anchor not in step_ids:
            raise WorkflowValidationError(
                f"insertion_point '{ip['id']}' anchors on unknown step '{anchor}'"
            )


def validate_insertion(insertion):
    """Validate a pack insertion dict. Raises WorkflowValidationError on failure."""
    _validate_schema(insertion, INSERTION_SCHEMA)
