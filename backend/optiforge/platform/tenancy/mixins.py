"""
Cross-cutting mixins for audit columns and soft delete.

ADR-0004 §"Obligations accepted" pins these semantics as shared contracts
across the two backends. The NestJS counterpart lives in
`b3-erp/backend/src/common/entities/base.entity.ts`.

Both mixins are abstract models — include them in your model's bases to
get the columns. Prefer `AuditedTenantModel` (see models.py) for new
tenant-scoped tables, which composes these with `TenantAwareModel`.
"""
from __future__ import annotations

import uuid
from django.db import models


class AuditMixin(models.Model):
    """
    Adds the audit columns required by the compliance layer
    (21 CFR Part 11, IATF 16949, AS9100) — who changed what, when.

    `created_by` and `updated_by` store user UUIDs. We deliberately do
    not ForeignKey to an auth user model here because:
      1) The auth user is managed by Keycloak (ADR-0003), not the local DB.
      2) Audit records must survive user deletion.
      3) Keeps this mixin usable across platform/core without an
         identity dependency.

    Populating `created_by` / `updated_by` is the caller's responsibility
    — typically via the JWT subject in the request context.
    """

    created_at = models.DateTimeField(auto_now_add=True, db_index=True)
    updated_at = models.DateTimeField(auto_now=True)
    created_by = models.UUIDField(null=True, blank=True)
    updated_by = models.UUIDField(null=True, blank=True)

    class Meta:
        abstract = True


class SoftDeleteManager(models.Manager):
    """
    Default manager that hides soft-deleted rows. Use `all_objects`
    (declared on `SoftDeleteMixin`) when you need to see deleted rows —
    e.g., for audit reports, compliance exports, or recovery.
    """

    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset().filter(deleted_at__isnull=True)


class AllObjectsManager(models.Manager):
    """Manager that returns every row including soft-deleted ones."""

    def get_queryset(self) -> models.QuerySet:
        return super().get_queryset()


class SoftDeleteMixin(models.Model):
    """
    Adds soft-delete columns and the filtering manager.

    Semantics:
      - `delete()` is overridden to set `deleted_at = now()` (soft).
      - `hard_delete()` performs the normal Django deletion (for GDPR /
        data-subject-removal flows where a real purge is required).
      - `objects` is the soft-delete-aware manager: default queries
        do not see deleted rows.
      - `all_objects` returns every row including deleted ones.
      - `restore()` clears the deletion marker.

    The manager filter uses `deleted_at IS NULL`. We do not try to filter
    via a boolean column — timestamp-based soft-delete gives you retention
    windows, "deleted last 30 days" reports, and lets the column double
    as a retention-expiry column.
    """

    deleted_at = models.DateTimeField(null=True, blank=True, db_index=True)
    deleted_by = models.UUIDField(null=True, blank=True)

    objects = SoftDeleteManager()
    all_objects = AllObjectsManager()

    class Meta:
        abstract = True

    def delete(self, using=None, keep_parents=False, *, deleted_by: uuid.UUID | None = None):
        """
        Soft delete: set `deleted_at = now()`. Does NOT cascade.
        Passing `hard=True` via `hard_delete()` performs a real delete.
        """
        from django.utils import timezone

        self.deleted_at = timezone.now()
        if deleted_by is not None:
            self.deleted_by = deleted_by
        self.save(update_fields=['deleted_at', 'deleted_by'])

    def hard_delete(self, using=None, keep_parents=False):
        """Irreversible, full-row deletion. Use for GDPR right-to-erasure."""
        return super().delete(using=using, keep_parents=keep_parents)

    def restore(self) -> None:
        """Clear the soft-delete marker."""
        self.deleted_at = None
        self.deleted_by = None
        self.save(update_fields=['deleted_at', 'deleted_by'])

    @property
    def is_deleted(self) -> bool:
        return self.deleted_at is not None
