"""
Acceptance test for issue #75: KitchenEquipment pack demand/design-half
parity — BOQ parser registered, taxonomy seeds registered, item field
extensions present, NSF validator rejects non-SS fascia, workflow
insertion present.
"""
import pytest

from optiforge.packs.kitchen_equipment.taxonomy import (
    KITCHEN_CATEGORIES, NSF_ALLOWED_FASCIA, nsf_fascia_validator,
)
from optiforge.packs.kitchen_equipment.item_extensions import ITEM_FIELD_EXTENSIONS
from optiforge.platform.extensions.points import ExtensionPoint, extension_points
from optiforge.platform.extensions.registry import extension_registry


@pytest.fixture(autouse=True)
def clean_registries():
    extension_points.clear()
    extension_registry.clear()
    yield
    extension_points.clear()
    extension_registry.clear()


@pytest.mark.django_db
def test_load_pack_registers_all_demand_design_extensions():
    from optiforge.packs.kitchen_equipment.loader import load_pack
    load_pack()

    by_point = {p: extension_points.list_for_point(p) for p in ExtensionPoint.ALL}

    assert any(r.pack_id == 'kitchen-equipment'
               for r in by_point[ExtensionPoint.ENTITY_ATTRIBUTES])
    assert any(r.pack_id == 'kitchen-equipment'
               for r in by_point[ExtensionPoint.MASTER_DATA_SEED])
    assert any(r.pack_id == 'kitchen-equipment'
               for r in by_point[ExtensionPoint.VALIDATION_RULE])
    assert any(r.pack_id == 'kitchen-equipment'
               for r in by_point[ExtensionPoint.SCREEN_SLOT])

    assert 'boq_import' in extension_registry.registered_types()


def test_kitchen_categories_are_seeded():
    codes = {c['code'] for c in KITCHEN_CATEGORIES}
    assert {'COUNTER', 'COLD_ROOM', 'HOOD', 'SINK'} <= codes


def test_item_extensions_include_fascia_and_cladding():
    assert 'fascia_type' in ITEM_FIELD_EXTENSIONS
    assert 'cladding_type' in ITEM_FIELD_EXTENSIONS
    assert ITEM_FIELD_EXTENSIONS['fascia_type']['required']


def test_nsf_validator_rejects_unapproved_fascia():
    class StubItem:
        extensible_attributes = {'fascia_type': 'plastic'}
    errors = nsf_fascia_validator(StubItem())
    assert len(errors) == 1
    assert 'plastic' in errors[0]


def test_nsf_validator_passes_approved_fascia():
    class StubItem:
        extensible_attributes = {'fascia_type': 'ss304'}
    assert nsf_fascia_validator(StubItem()) == []


def test_nsf_allowed_set_contains_stainless_steel_grades():
    assert 'ss304' in NSF_ALLOWED_FASCIA
    assert 'ss316' in NSF_ALLOWED_FASCIA
