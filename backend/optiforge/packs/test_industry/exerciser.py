"""
TestIndustry exercises every one of the ten extension points.
Its only purpose is to catch regressions — if adding a new extension point
forgets to give TestIndustry a way in, the exerciser tests fail in CI.
"""
from optiforge.platform.extensions.points import ExtensionPoint, extension_points

PACK_ID = 'test-industry'


def _noop_parser(payload):
    return payload


def _noop_step_handler(step_id, step_type, context):
    return {'ok': True}


def _noop_validator(instance):
    return None


def _noop_event_handler(event_type, payload, tenant_id):
    return {'received': True}


def register_all_extension_points():
    """Register at least one entry at every extension point."""
    extension_points.register(
        ExtensionPoint.ENTITY_ATTRIBUTES, PACK_ID,
        key='Item',
        spec={'ti_marker_field': {'type': 'string', 'required': False}},
    )
    extension_points.register(
        ExtensionPoint.WORKFLOW_STATE, PACK_ID,
        key='QuotationApproval:after_initial_review:ti_review',
        spec={'step': {'id': 'ti_review', 'step_type': 'ti.review'}},
    )
    extension_points.register(
        ExtensionPoint.SCREEN_SLOT, PACK_ID,
        key='sales.quote.sidebar',
        spec={'component': 'TestIndustrySidebarPanel'},
    )
    extension_points.register(
        ExtensionPoint.MASTER_DATA_SEED, PACK_ID,
        key='ti_categories',
        spec={'items': [{'code': 'TI-A', 'name': 'TI Category A'}]},
    )
    extension_points.register(
        ExtensionPoint.WORKFLOW_STEP_HANDLER, PACK_ID,
        key='ti.review',
        spec={'callable': _noop_step_handler},
    )
    extension_points.register(
        ExtensionPoint.VALIDATION_RULE, PACK_ID,
        key='CustomerRequirement.ti_rule',
        spec={'callable': _noop_validator, 'message': 'TestIndustry validation'},
    )
    extension_points.register(
        ExtensionPoint.REPORT_TEMPLATE, PACK_ID,
        key='ti_operations_summary',
        spec={'title': 'TestIndustry Operations Summary', 'format': ['pdf', 'xlsx']},
    )
    extension_points.register(
        ExtensionPoint.INTEGRATION_CONNECTOR, PACK_ID,
        key='ti_import',
        spec={'parser': _noop_parser},
    )
    extension_points.register(
        ExtensionPoint.EVENT_SUBSCRIPTION, PACK_ID,
        key='CustomerRequirementCreated',
        spec={'handler': _noop_event_handler},
    )
    extension_points.register(
        ExtensionPoint.PERMISSION_SCOPE, PACK_ID,
        key='ti.restricted_action',
        spec={'resource_type': 'test_industry.special', 'action': 'read'},
    )
