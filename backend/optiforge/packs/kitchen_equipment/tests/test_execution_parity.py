"""
Acceptance test for issue #94: KitchenEquipment pack execution-half parity.
"""
import pytest

from optiforge.packs.kitchen_equipment.execution import (
    COMMISSIONING_PROTOCOLS, NSF_EXECUTION_RULES, WARRANTY_REPORT_TEMPLATE,
)
from optiforge.platform.extensions.points import ExtensionPoint, extension_points
from optiforge.platform.extensions.registry import extension_registry


@pytest.fixture(autouse=True)
def clean_state():
    extension_points.clear()
    extension_registry.clear()
    yield
    extension_points.clear()
    extension_registry.clear()


@pytest.mark.django_db
def test_load_pack_registers_execution_surfaces():
    from optiforge.packs.kitchen_equipment.loader import load_pack
    load_pack()

    keys = {r.key for r in extension_points.list_for_pack('kitchen-equipment')}
    assert 'kitchen_commissioning_protocols' in keys
    assert 'WorkOrder.nsf_execution' in keys
    assert 'kitchen_warranty_registration' in keys
    assert 'work_order.panels.finishing_qc' in keys
    assert 'commissioning.capture.site_survey' in keys


def test_commissioning_protocols_cover_major_kitchen_categories():
    required = set()
    for p in COMMISSIONING_PROTOCOLS:
        required.update(p['required_for'])
    assert {'HOOD', 'COLD_ROOM', 'APPLIANCE', 'COUNTER', 'SINK'} <= required


def test_nsf_execution_rules_set_bounds():
    assert NSF_EXECUTION_RULES['finishing']['max_rms_roughness_um'] == 0.8
    assert NSF_EXECUTION_RULES['welding']['passivation_required']


def test_warranty_report_template_covers_pdf_and_csv():
    assert set(WARRANTY_REPORT_TEMPLATE['format']) == {'pdf', 'csv'}
    assert 'serial_numbers' in WARRANTY_REPORT_TEMPLATE['fields']
