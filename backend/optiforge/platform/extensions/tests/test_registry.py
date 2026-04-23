import pytest
from optiforge.platform.extensions.registry import (
    extension_registry, DuplicateRegistrationError, NoParserRegisteredError,
)


@pytest.fixture(autouse=True)
def clean_registry():
    """Clear the registry before each test."""
    extension_registry.clear()
    yield
    extension_registry.clear()


def fake_boq_parser(payload):
    return [{"line": 1, "fascia_type": "ss304"}, {"line": 2, "cladding_type": "laminate"}]


def fake_rfq_parser(payload):
    return [{"line": 1, "spec": "standard"}]


def test_register_and_invoke():
    extension_registry.register_parser('boq_import', 'kitchen-equipment', fake_boq_parser)
    result = extension_registry.invoke_parser('boq_import', {})
    assert len(result) == 2
    assert result[0]['fascia_type'] == 'ss304'


def test_duplicate_registration_rejected():
    extension_registry.register_parser('boq_import', 'pack-a', fake_boq_parser)
    with pytest.raises(DuplicateRegistrationError) as exc:
        extension_registry.register_parser('boq_import', 'pack-b', fake_rfq_parser)
    assert "already registered by pack 'pack-a'" in str(exc.value)


def test_no_parser_registered():
    with pytest.raises(NoParserRegisteredError) as exc:
        extension_registry.invoke_parser('nonexistent_type', {})
    assert "No parser registered for source_type 'nonexistent_type'" in str(exc.value)


def test_two_packs_different_types():
    extension_registry.register_parser('boq_import', 'kitchen-equipment', fake_boq_parser)
    extension_registry.register_parser('rfq_spec', 'test-industry', fake_rfq_parser)

    r1 = extension_registry.invoke_parser('boq_import', {})
    r2 = extension_registry.invoke_parser('rfq_spec', {})

    assert len(r1) == 2
    assert len(r2) == 1
    assert r2[0]['spec'] == 'standard'


def test_registered_types():
    extension_registry.register_parser('boq_import', 'kitchen-equipment', fake_boq_parser)
    extension_registry.register_parser('rfq_spec', 'test-industry', fake_rfq_parser)
    types = extension_registry.registered_types()
    assert set(types) == {'boq_import', 'rfq_spec'}
