import uuid
from datetime import timedelta
import pytest
from django.utils import timezone
from optiforge.platform.audit.models import AuditRecord
from optiforge.platform.audit.tasks import verify_all_audit_chains, prune_audit_records


@pytest.mark.django_db
def test_verify_all_audit_chains_reports_intact():
    tenant_id = uuid.uuid4()
    entity_id = str(uuid.uuid4())
    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='sales.customerrequirement',
        entity_id=entity_id, operation='CREATE', after_state={'v': 1},
    )
    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='sales.customerrequirement',
        entity_id=entity_id, operation='UPDATE',
        before_state={'v': 1}, after_state={'v': 2},
    )

    result = verify_all_audit_chains()
    assert result['verified'] >= 1
    assert result['failures'] == []


@pytest.mark.django_db
def test_verify_all_audit_chains_detects_tamper():
    tenant_id = uuid.uuid4()
    entity_id = str(uuid.uuid4())
    rec = AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='sales.customerrequirement',
        entity_id=entity_id, operation='CREATE', after_state={'v': 1},
    )
    # Tamper: mutate the persisted after_state without recomputing this_hash.
    AuditRecord.objects.filter(pk=rec.pk).update(after_state={'v': 'tampered'})

    result = verify_all_audit_chains()
    assert len(result['failures']) == 1
    assert result['failures'][0]['entity_id'] == entity_id


@pytest.mark.django_db
def test_prune_audit_records_respects_retention():
    tenant_id = uuid.uuid4()
    old_rec = AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='sales.customerrequirement',
        entity_id=str(uuid.uuid4()), operation='CREATE', after_state={'v': 1},
    )
    AuditRecord.objects.filter(pk=old_rec.pk).update(
        timestamp=timezone.now() - timedelta(days=400),
    )
    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='sales.customerrequirement',
        entity_id=str(uuid.uuid4()), operation='CREATE', after_state={'v': 1},
    )

    result = prune_audit_records(retention_days=365)
    assert result['deleted'] == 1
    assert AuditRecord.objects.count() == 1
