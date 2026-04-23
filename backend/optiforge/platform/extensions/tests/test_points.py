"""
Extension-point registry mechanics. Pack-level exerciser tests live at
`tests/contract/` so platform code does not import from packs.
"""
import pytest

from optiforge.platform.extensions.points import (
    DuplicateRegistrationError,
    ExtensionPoint,
    extension_points,
)


@pytest.fixture(autouse=True)
def clean_registry():
    extension_points.clear()
    yield
    extension_points.clear()


def test_ten_extension_points_exist():
    assert set(ExtensionPoint.ALL) == {
        'entity_attributes', 'workflow_state', 'screen_slot', 'master_data_seed',
        'workflow_step_handler', 'validation_rule', 'report_template',
        'integration_connector', 'event_subscription', 'permission_scope',
    }


def test_register_and_lookup():
    extension_points.register(
        ExtensionPoint.INTEGRATION_CONNECTOR, 'p1', 'boq_import', {'parser': lambda p: p},
    )
    reg = extension_points.get(ExtensionPoint.INTEGRATION_CONNECTOR, 'boq_import')
    assert reg.pack_id == 'p1'


def test_list_for_pack_collects_across_points():
    extension_points.register(ExtensionPoint.SCREEN_SLOT, 'p1', 'slot-a', {'component': 'A'})
    extension_points.register(ExtensionPoint.REPORT_TEMPLATE, 'p1', 'tpl-a', {'title': 'A'})
    assert len(extension_points.list_for_pack('p1')) == 2


def test_duplicate_key_rejected():
    extension_points.register(ExtensionPoint.SCREEN_SLOT, 'p1', 'same', {'component': 'A'})
    with pytest.raises(DuplicateRegistrationError):
        extension_points.register(ExtensionPoint.SCREEN_SLOT, 'p2', 'same', {'component': 'B'})


def test_unknown_extension_point_rejected():
    with pytest.raises(ValueError, match="Unknown extension point"):
        extension_points.register('not_a_point', 'p', 'k', {})


def test_same_pack_can_reregister_same_key_idempotently():
    extension_points.register(ExtensionPoint.SCREEN_SLOT, 'p1', 'same', {'component': 'A'})
    extension_points.register(ExtensionPoint.SCREEN_SLOT, 'p1', 'same', {'component': 'A'})
    registrations = extension_points.list_for_point(ExtensionPoint.SCREEN_SLOT)
    assert len(registrations) == 1
