import uuid
import pytest
from optiforge.platform.audit.models import AuditRecord


@pytest.mark.django_db
def test_audit_record_hash_chain():
    """Test that audit records form a valid hash chain per entity."""
    tenant_id = uuid.uuid4()
    entity_type = 'test.entity'
    entity_id = str(uuid.uuid4())

    r1 = AuditRecord.create_record(
        tenant_id=tenant_id, entity_type=entity_type, entity_id=entity_id,
        operation='CREATE', after_state={'name': 'v1'},
    )
    r2 = AuditRecord.create_record(
        tenant_id=tenant_id, entity_type=entity_type, entity_id=entity_id,
        operation='UPDATE', before_state={'name': 'v1'}, after_state={'name': 'v2'},
    )

    assert r1.previous_hash == ''
    assert r2.previous_hash == r1.this_hash
    assert r1.this_hash != r2.this_hash


@pytest.mark.django_db
def test_audit_chain_verification_passes():
    """Verify that an untampered chain passes verification."""
    tenant_id = uuid.uuid4()
    entity_type = 'test.entity'
    entity_id = str(uuid.uuid4())

    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type=entity_type, entity_id=entity_id,
        operation='CREATE', after_state={'name': 'v1'},
    )
    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type=entity_type, entity_id=entity_id,
        operation='UPDATE', before_state={'name': 'v1'}, after_state={'name': 'v2'},
    )

    is_valid, broken_id = AuditRecord.verify_chain(entity_type, entity_id)
    assert is_valid is True
    assert broken_id is None


@pytest.mark.django_db
def test_audit_chain_detects_tampering():
    """Verify that a directly-mutated audit row breaks the chain."""
    tenant_id = uuid.uuid4()
    entity_type = 'test.tamper'
    entity_id = str(uuid.uuid4())

    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type=entity_type, entity_id=entity_id,
        operation='CREATE', after_state={'name': 'v1'},
    )
    r2 = AuditRecord.create_record(
        tenant_id=tenant_id, entity_type=entity_type, entity_id=entity_id,
        operation='UPDATE', before_state={'name': 'v1'}, after_state={'name': 'v2'},
    )

    # Tamper with the record directly in the database
    AuditRecord.objects.filter(pk=r2.pk).update(after_state={'name': 'HACKED'})

    is_valid, broken_id = AuditRecord.verify_chain(entity_type, entity_id)
    assert is_valid is False
    assert broken_id == r2.pk


@pytest.mark.django_db
def test_audit_layer_attribution():
    """Verify that audit records carry the correct layer."""
    tenant_id = uuid.uuid4()
    entity_type = 'test.layer'
    entity_id = str(uuid.uuid4())

    r = AuditRecord.create_record(
        tenant_id=tenant_id, entity_type=entity_type, entity_id=entity_id,
        operation='CREATE', after_state={'name': 'v1'}, layer='pack:kitchen-equipment',
    )
    assert r.layer == 'pack:kitchen-equipment'
