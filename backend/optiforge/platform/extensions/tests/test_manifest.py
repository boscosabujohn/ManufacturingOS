import pytest
from optiforge.platform.extensions.manifest import (
    validate_manifest, ManifestValidationError, VersionMismatchError,
)

VALID_MANIFEST = {
    "id": "kitchen-equipment",
    "name": "KitchenEquipment",
    "version": "0.1.0",
    "depends_on": {
        "modes": ["eto"],
        "core_version_range": ">=0.1.0,<1.0.0",
    },
    "extends": {
        "integrations": {
            "boq_import": {"parser": "kitchen_equipment.parsers.boq_parser"}
        },
        "entities": {
            "Item": {
                "fascia_type": {"type": "string"},
                "cladding_type": {"type": "string"},
            }
        },
    },
}


def test_valid_manifest():
    result = validate_manifest(VALID_MANIFEST)
    assert result['id'] == 'kitchen-equipment'


def test_missing_required_field():
    bad = {"name": "Bad Pack", "version": "0.1.0"}
    with pytest.raises(ManifestValidationError) as exc:
        validate_manifest(bad)
    assert "'id'" in str(exc.value)


def test_invalid_id_format():
    bad = {"id": "Bad Pack!", "name": "Bad", "version": "0.1.0"}
    with pytest.raises(ManifestValidationError) as exc:
        validate_manifest(bad)
    assert "Invalid pack id" in str(exc.value)


def test_invalid_version_format():
    bad = {"id": "good-pack", "name": "Good", "version": "not-semver"}
    with pytest.raises(ManifestValidationError) as exc:
        validate_manifest(bad)
    assert "Invalid version format" in str(exc.value)


def test_core_version_mismatch():
    bad = {
        "id": "future-pack",
        "name": "Future",
        "version": "0.1.0",
        "depends_on": {"core_version_range": ">=2.0.0"},
    }
    with pytest.raises(VersionMismatchError) as exc:
        validate_manifest(bad)
    assert "requires core >=2.0.0" in str(exc.value)


def test_core_version_in_range():
    good = {
        "id": "current-pack",
        "name": "Current",
        "version": "0.1.0",
        "depends_on": {"core_version_range": ">=0.1.0,<1.0.0"},
    }
    result = validate_manifest(good)
    assert result['id'] == 'current-pack'
