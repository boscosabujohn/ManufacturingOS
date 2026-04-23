"""
Tests for issue #38 finishing criteria: dedicated audit reader role, 5y+2y
retention, archival without deletion, reason_for_change queryable (including
empty), SLO-helper for entity query latency.
"""
import uuid
from datetime import timedelta
from unittest.mock import MagicMock
import pytest
from django.contrib.auth import get_user_model
from django.utils import timezone

from optiforge.platform.audit.models import (
    AuditArchive, AuditReaderGrant, AuditRecord,
)
from optiforge.platform.audit.permissions import IsAuditReader
from optiforge.platform.audit.tasks import (
    ARCHIVE_RETENTION_DAYS, ONLINE_RETENTION_DAYS,
    archive_expired_online, celery_beat_schedule,
    entity_query_latency_ms,
)
from optiforge.platform.tenancy.context import tenant_context
from optiforge.platform.tenancy.models import Tenant

User = get_user_model()


@pytest.mark.django_db
def test_tenant_admin_cannot_read_audit_by_default():
    tenant = Tenant.objects.create(name='T', status='active')
    user = User.objects.create_user(username='admin', email='a@example.com')

    request = MagicMock()
    request.user = user
    perm = IsAuditReader()
    with tenant_context(tenant.id):
        assert perm.has_permission(request, MagicMock()) is False


@pytest.mark.django_db
def test_audit_reader_grant_allows_read():
    tenant = Tenant.objects.create(name='T', status='active')
    user = User.objects.create_user(username='reader', email='r@example.com')
    AuditReaderGrant.objects.create(tenant_id=tenant.id, user=user, is_active=True)

    request = MagicMock()
    request.user = user
    with tenant_context(tenant.id):
        assert IsAuditReader().has_permission(request, MagicMock()) is True


@pytest.mark.django_db
def test_revoked_grant_blocks_read():
    tenant = Tenant.objects.create(name='T', status='active')
    user = User.objects.create_user(username='ex-reader', email='x@example.com')
    AuditReaderGrant.objects.create(tenant_id=tenant.id, user=user, is_active=False)

    request = MagicMock()
    request.user = user
    with tenant_context(tenant.id):
        assert IsAuditReader().has_permission(request, MagicMock()) is False


@pytest.mark.django_db
def test_retention_constants_match_prd():
    assert ONLINE_RETENTION_DAYS == 5 * 365
    assert ARCHIVE_RETENTION_DAYS == 7 * 365


@pytest.mark.django_db
def test_archive_expired_moves_records_without_deleting():
    tenant_id = uuid.uuid4()
    entity_id = str(uuid.uuid4())
    # Create a record in the past.
    rec = AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='sales.customerrequirement',
        entity_id=entity_id, operation='CREATE', after_state={'v': 1},
    )
    # Push it beyond 5-year retention.
    AuditRecord.objects.filter(pk=rec.pk).update(
        timestamp=timezone.now() - timedelta(days=ONLINE_RETENTION_DAYS + 1),
    )

    result = archive_expired_online()
    assert result['archived'] == 1
    rec.refresh_from_db()
    assert rec.is_archived is True
    # Row is still in the DB — archive never deletes.
    assert AuditRecord.objects.filter(pk=rec.pk).exists()
    # Archive batch persisted.
    assert AuditArchive.objects.count() == 1
    batch = AuditArchive.objects.first()
    assert batch.record_count == 1


@pytest.mark.django_db
def test_archive_is_idempotent_when_nothing_expired():
    assert archive_expired_online() == {'archived': 0, 'batches': 0}


@pytest.mark.django_db
def test_reason_for_change_queryable_including_empty():
    tenant_id = uuid.uuid4()
    entity_id = str(uuid.uuid4())
    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='sales.customerrequirement',
        entity_id=entity_id, operation='CREATE', after_state={'v': 1},
        reason_for_change='initial load',
    )
    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='sales.customerrequirement',
        entity_id=entity_id, operation='UPDATE',
        before_state={'v': 1}, after_state={'v': 2},
        reason_for_change='',  # empty but valid
    )
    with_reason = AuditRecord.objects.filter(reason_for_change='initial load').count()
    null_reason = AuditRecord.objects.filter(reason_for_change='').count()
    assert with_reason == 1
    assert null_reason >= 1


@pytest.mark.django_db
def test_entity_query_latency_returns_ms():
    tenant_id = uuid.uuid4()
    entity_id = str(uuid.uuid4())
    for _ in range(5):
        AuditRecord.create_record(
            tenant_id=tenant_id, entity_type='sales.customerrequirement',
            entity_id=entity_id, operation='UPDATE', after_state={'v': 1},
        )
    latency = entity_query_latency_ms('sales.customerrequirement', entity_id)
    assert latency >= 0
    # 5 rows is trivial; stay well under the 1 s SLO.
    assert latency < 1000.0


@pytest.mark.django_db
def test_celery_beat_schedule_includes_every_job():
    sched = celery_beat_schedule()
    assert set(sched.keys()) == {
        'audit-hourly-verify',
        'audit-nightly-prune',
        'audit-nightly-archive',
    }
    assert sched['audit-hourly-verify']['schedule'] == 3600.0
    assert sched['audit-nightly-archive']['schedule'] == 24 * 3600.0
