"""
End-to-end tests for the AuditMixin + SoftDeleteMixin contract.

These are the canonical contract tests for the semantics described in
ADR-0004 §"Obligations accepted" and in
optiforge.platform.tenancy.mixins. The NestJS counterpart at
b3-erp/backend/test/unit/common/base-entity.spec.ts enforces the same
semantics on the other backend.
"""
from __future__ import annotations

import uuid
import time

import pytest

from optiforge.platform.tenancy.models import Tenant
from tests.audit_soft_delete.models import DummyAuditedEntity


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='AuditMixin Test Tenant', status='active')


# ---------------------------------------------------------------------------
# AuditMixin
# ---------------------------------------------------------------------------


@pytest.mark.django_db
def test_created_at_is_set_on_creation(tenant):
    entity = DummyAuditedEntity.objects.create(tenant=tenant, name='alpha')
    assert entity.created_at is not None


@pytest.mark.django_db
def test_updated_at_advances_on_save(tenant):
    entity = DummyAuditedEntity.objects.create(tenant=tenant, name='alpha')
    first_updated = entity.updated_at
    time.sleep(0.01)  # ensure clock tick on very fast CI
    entity.name = 'beta'
    entity.save()
    assert entity.updated_at > first_updated


@pytest.mark.django_db
def test_created_by_and_updated_by_are_nullable_uuids(tenant):
    user_a = uuid.uuid4()
    entity = DummyAuditedEntity.objects.create(
        tenant=tenant, name='alpha', created_by=user_a, updated_by=user_a,
    )
    assert entity.created_by == user_a
    assert entity.updated_by == user_a


# ---------------------------------------------------------------------------
# SoftDeleteMixin — default manager
# ---------------------------------------------------------------------------


@pytest.mark.django_db
def test_default_manager_hides_soft_deleted_rows(tenant):
    alive = DummyAuditedEntity.objects.create(tenant=tenant, name='alive')
    dead = DummyAuditedEntity.objects.create(tenant=tenant, name='dead')
    dead.delete()

    visible = list(DummyAuditedEntity.objects.values_list('id', flat=True))
    assert alive.id in visible
    assert dead.id not in visible


@pytest.mark.django_db
def test_all_objects_returns_every_row_including_deleted(tenant):
    alive = DummyAuditedEntity.objects.create(tenant=tenant, name='alive')
    dead = DummyAuditedEntity.objects.create(tenant=tenant, name='dead')
    dead.delete()

    all_ids = set(DummyAuditedEntity.all_objects.values_list('id', flat=True))
    assert {alive.id, dead.id}.issubset(all_ids)


# ---------------------------------------------------------------------------
# SoftDeleteMixin — delete / restore / hard_delete
# ---------------------------------------------------------------------------


@pytest.mark.django_db
def test_delete_is_soft_and_stamps_deleted_at(tenant):
    entity = DummyAuditedEntity.objects.create(tenant=tenant, name='alpha')
    assert entity.deleted_at is None
    entity.delete()
    entity.refresh_from_db()
    assert entity.deleted_at is not None
    assert entity.is_deleted is True


@pytest.mark.django_db
def test_delete_records_deleted_by_when_provided(tenant):
    user = uuid.uuid4()
    entity = DummyAuditedEntity.objects.create(tenant=tenant, name='alpha')
    entity.delete(deleted_by=user)
    entity.refresh_from_db()
    assert entity.deleted_by == user


@pytest.mark.django_db
def test_restore_clears_the_soft_delete_marker(tenant):
    entity = DummyAuditedEntity.objects.create(tenant=tenant, name='alpha')
    entity.delete()
    assert entity.is_deleted
    entity.restore()
    entity.refresh_from_db()
    assert entity.deleted_at is None
    assert entity.deleted_by is None
    assert entity.is_deleted is False


@pytest.mark.django_db
def test_restored_row_is_visible_to_default_manager_again(tenant):
    entity = DummyAuditedEntity.objects.create(tenant=tenant, name='alpha')
    entity.delete()
    assert not DummyAuditedEntity.objects.filter(id=entity.id).exists()
    entity.restore()
    assert DummyAuditedEntity.objects.filter(id=entity.id).exists()


@pytest.mark.django_db
def test_hard_delete_removes_the_row_completely(tenant):
    entity = DummyAuditedEntity.objects.create(tenant=tenant, name='alpha')
    entity_id = entity.id
    entity.hard_delete()
    assert not DummyAuditedEntity.all_objects.filter(id=entity_id).exists()


# ---------------------------------------------------------------------------
# Tenant scoping still works alongside the mixins (regression check)
# ---------------------------------------------------------------------------


@pytest.mark.django_db
def test_mixins_compose_with_tenant_scoping(tenant):
    other = Tenant.objects.create(name='Other Tenant', status='active')
    DummyAuditedEntity.objects.create(tenant=tenant, name='mine')
    DummyAuditedEntity.objects.create(tenant=other, name='yours')

    mine = list(DummyAuditedEntity.objects.filter(tenant=tenant).values_list('name', flat=True))
    yours = list(DummyAuditedEntity.objects.filter(tenant=other).values_list('name', flat=True))
    assert mine == ['mine']
    assert yours == ['yours']
