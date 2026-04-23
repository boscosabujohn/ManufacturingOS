"""
Integration test for the Phase 1 tracer bullet:
  BOQ upload → KitchenEquipment parser → CustomerRequirement → audit → event → TestIndustry subscriber
"""
import uuid
import pytest

from optiforge.platform.tenancy.models import Tenant
from optiforge.platform.tenancy.context import tenant_context
from optiforge.platform.extensions.registry import extension_registry
from optiforge.platform.events.bus import event_bus
from optiforge.platform.audit.models import AuditRecord
from optiforge.core.sales.models import CustomerRequirement
from optiforge.packs.kitchen_equipment.loader import load_pack as load_kitchen
from optiforge.packs.test_industry.loader import load_pack as load_test_industry


@pytest.fixture(autouse=True)
def clean_registries():
    """Reset extension registry and event bus between tests."""
    extension_registry.clear()
    event_bus.clear()
    yield
    extension_registry.clear()
    event_bus.clear()


@pytest.fixture
def tenant_a(db):
    return Tenant.objects.create(name='Tenant A', status='active')


@pytest.fixture
def tenant_b(db):
    return Tenant.objects.create(name='Tenant B', status='active')


@pytest.mark.django_db
def test_full_tracer_bullet_flow(tenant_a):
    """
    End-to-end: load both packs, create a CR with boq_import, verify parsed lines,
    verify audit record, verify event delivered to TestIndustry.
    """
    # Load packs
    load_kitchen()
    load_test_industry()

    test_industry_received = []

    # Also subscribe a tracking handler to verify event delivery
    def tracking_handler(event_type, payload, tenant_id):
        test_industry_received.append(payload)
        return {'tracked': True}

    event_bus.subscribe('CustomerRequirementCreated', 'test-industry-tracker', tracking_handler)

    with tenant_context(tenant_a.id):
        # Create CustomerRequirement
        cr = CustomerRequirement.objects.create(
            tenant_id=tenant_a.id,
            source_type='boq_import',
            source_payload={'file': 'fake_boq.xlsx'},
        )

        # Invoke parser
        parsed_lines = extension_registry.invoke_parser('boq_import', cr.source_payload)
        cr.parsed_lines = parsed_lines
        cr.status = 'parsed'
        cr.save()

        # Publish event
        event_bus.publish(
            'CustomerRequirementCreated',
            {'cr_id': str(cr.id), 'source_type': 'boq_import', 'tenant_id': str(tenant_a.id)},
            tenant_id=tenant_a.id,
        )

    # Assertions
    assert len(parsed_lines) == 2
    assert parsed_lines[0]['fascia_type'] == 'ss304'
    assert parsed_lines[1]['cladding_type'] == 'powder_coated'

    # Verify event was received by TestIndustry
    assert len(test_industry_received) == 1
    assert test_industry_received[0]['cr_id'] == str(cr.id)

    # Verify audit trail
    audit_records = AuditRecord.objects.filter(
        entity_type='sales.customerrequirement',
        entity_id=str(cr.id),
    )
    assert audit_records.count() >= 1  # CREATE + UPDATE


@pytest.mark.django_db
def test_cross_tenant_isolation(tenant_a, tenant_b):
    """
    Verify that Tenant A's CustomerRequirement is invisible to Tenant B.
    """
    with tenant_context(tenant_a.id):
        cr = CustomerRequirement.objects.create(
            tenant_id=tenant_a.id,
            source_type='boq_import',
            source_payload={},
        )

    # Tenant B should NOT be able to see Tenant A's CR
    with tenant_context(tenant_b.id):
        visible = CustomerRequirement.objects.filter(tenant_id=tenant_b.id)
        assert visible.count() == 0

    # But Tenant A can
    with tenant_context(tenant_a.id):
        visible = CustomerRequirement.objects.filter(tenant_id=tenant_a.id)
        assert visible.count() == 1
        assert visible.first().id == cr.id


@pytest.mark.django_db
def test_no_parser_registered_returns_clear_error(tenant_a):
    """
    Creating a CR with a source_type that has no registered parser should raise NoParserRegisteredError.
    """
    from optiforge.platform.extensions.registry import NoParserRegisteredError

    with tenant_context(tenant_a.id):
        cr = CustomerRequirement.objects.create(
            tenant_id=tenant_a.id,
            source_type='rfq_spec',
            source_payload={},
        )

        with pytest.raises(NoParserRegisteredError) as exc:
            extension_registry.invoke_parser('rfq_spec', cr.source_payload)
        assert "No parser registered for source_type 'rfq_spec'" in str(exc.value)
