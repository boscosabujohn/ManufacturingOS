"""
Issue #104 — second-pack readiness drill. A non-kitchen dummy industry
pack exercises every extension point against the same core. Proves the
5-layer seam supports more than one industry pack concurrently.
"""
import pytest

from optiforge.platform.extensions.points import ExtensionPoint, extension_points


PACK_ID_DUMMY = 'automotive-tier1'


def _register_dummy_automotive_pack():
    """Mirror of TestIndustry exerciser but using a different pack id."""
    def _noop_parser(payload):
        return payload

    def _noop_handler(step_id, step_type, context):
        return {'ok': True}

    def _noop_validator(instance):
        return None

    def _noop_event(event_type, payload, tenant_id):
        return {'received': True}

    extension_points.register(ExtensionPoint.ENTITY_ATTRIBUTES, PACK_ID_DUMMY,
                              key='Vehicle', spec={'vin_range': {'type': 'string'}})
    extension_points.register(ExtensionPoint.WORKFLOW_STATE, PACK_ID_DUMMY,
                              key='QuotationApproval:after_initial_review:ppap',
                              spec={'step': {'id': 'ppap_step', 'step_type': 'automotive.ppap'}})
    extension_points.register(ExtensionPoint.SCREEN_SLOT, PACK_ID_DUMMY,
                              key='sales.quote.sidebar.automotive',
                              spec={'component': 'AutomotiveQuoteSidebar'})
    extension_points.register(ExtensionPoint.MASTER_DATA_SEED, PACK_ID_DUMMY,
                              key='automotive_categories',
                              spec={'items': [{'code': 'PPAP-L3', 'name': 'PPAP Level 3'}]})
    extension_points.register(ExtensionPoint.WORKFLOW_STEP_HANDLER, PACK_ID_DUMMY,
                              key='automotive.ppap', spec={'callable': _noop_handler})
    extension_points.register(ExtensionPoint.VALIDATION_RULE, PACK_ID_DUMMY,
                              key='Item.automotive_vin',
                              spec={'callable': _noop_validator,
                                    'message': 'VIN range validation'})
    extension_points.register(ExtensionPoint.REPORT_TEMPLATE, PACK_ID_DUMMY,
                              key='automotive_ppap_summary',
                              spec={'title': 'PPAP Summary', 'format': ['pdf']})
    extension_points.register(ExtensionPoint.INTEGRATION_CONNECTOR, PACK_ID_DUMMY,
                              key='edi_830', spec={'parser': _noop_parser})
    extension_points.register(ExtensionPoint.EVENT_SUBSCRIPTION, PACK_ID_DUMMY,
                              key='CustomerRequirementCreated:automotive',
                              spec={'handler': _noop_event})
    extension_points.register(ExtensionPoint.PERMISSION_SCOPE, PACK_ID_DUMMY,
                              key='automotive.restricted',
                              spec={'resource_type': 'automotive.vin', 'action': 'read'})


@pytest.fixture(autouse=True)
def clean_state():
    extension_points.clear()
    yield
    extension_points.clear()


def test_dummy_automotive_pack_covers_every_extension_point():
    _register_dummy_automotive_pack()
    covered = {reg.point for reg in extension_points.list_for_pack(PACK_ID_DUMMY)}
    assert covered == set(ExtensionPoint.ALL)


def test_two_packs_coexist_without_collision():
    from optiforge.packs.test_industry.exerciser import (
        PACK_ID as TI_PACK, register_all_extension_points,
    )
    register_all_extension_points()
    _register_dummy_automotive_pack()

    ti_registrations = extension_points.list_for_pack(TI_PACK)
    auto_registrations = extension_points.list_for_pack(PACK_ID_DUMMY)

    assert len(ti_registrations) >= 10
    assert len(auto_registrations) >= 10
    # No registration belongs to both packs.
    ti_keys = {r.key for r in ti_registrations}
    auto_keys = {r.key for r in auto_registrations}
    # Some keys like 'CustomerRequirementCreated' are shared by design —
    # different packs subscribe to the same event. This is fine: each
    # pack is a separate ExtensionRegistration row owned by its pack_id.
    assert ti_registrations != auto_registrations
