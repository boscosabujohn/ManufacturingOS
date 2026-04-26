/**
 * Shared base entities for the NestJS domain services.
 *
 * ADR-0004 §"Obligations accepted" pins audit + soft-delete semantics as
 * shared contracts across the two backends. The Django counterpart lives at
 * `backend/optiforge/platform/tenancy/mixins.py`; the semantics here must
 * stay aligned with it.
 *
 * New entities SHOULD extend {@link AuditedEntity} (or
 * {@link TenantAuditedEntity} if tenant-scoped). Existing entities may be
 * migrated incrementally; adoption is tracked as a follow-up to issue #113.
 */
import {
  Column,
  CreateDateColumn,
  DeleteDateColumn,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * UUID primary key + audit columns.
 *
 * Columns:
 *  - id           UUID v4, primary key.
 *  - createdAt    timestamp, set on insert.
 *  - updatedAt    timestamp, set on every save.
 *  - createdBy    UUID (nullable), typically the JWT sub of the actor.
 *  - updatedBy    UUID (nullable), last actor to mutate the row.
 *  - deletedAt    timestamp (nullable), set by TypeORM soft-delete.
 *  - deletedBy    UUID (nullable), set explicitly via softDelete(entity, userId).
 *
 * Soft delete is driven by TypeORM's {@link DeleteDateColumn}. Default
 * finds (repo.find, repo.findOne) automatically exclude rows where
 * deletedAt IS NOT NULL. To include them use `repo.find({ withDeleted: true })`.
 *
 * To soft-delete a row, prefer `repo.softRemove(entity)` or
 * `repo.softDelete(id)`. Call {@link markDeletedBy} first if you need to
 * attribute the deletion to a user.
 */
export abstract class AuditedEntity {
  @PrimaryGeneratedColumn('uuid')
  id!: string;

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt!: Date;

  @UpdateDateColumn({ type: 'timestamptz' })
  updatedAt!: Date;

  @Column({ type: 'uuid', nullable: true })
  createdBy!: string | null;

  @Column({ type: 'uuid', nullable: true })
  updatedBy!: string | null;

  @DeleteDateColumn({ type: 'timestamptz' })
  deletedAt!: Date | null;

  @Column({ type: 'uuid', nullable: true })
  deletedBy!: string | null;

  /**
   * Stamp the caller onto the row before a soft-delete. Call this then
   * `repo.softRemove(entity)` — the DeleteDateColumn then stamps deletedAt
   * and the row disappears from default finds.
   */
  markDeletedBy(userId: string | null): void {
    this.deletedBy = userId;
  }

  /** Convenience accessor matching the Django `is_deleted` property. */
  get isDeleted(): boolean {
    return this.deletedAt !== null && this.deletedAt !== undefined;
  }
}

/**
 * AuditedEntity + non-nullable tenantId for tenant-scoped domain tables.
 *
 * The tenantId is a free-form UUID (not a ForeignKey) because the Tenant
 * table of record lives in the Django/OptiForge backend. NestJS services
 * validate and filter by tenantId at the guard/repo layer; they do not
 * reach across backends to look up the tenant.
 *
 * See ADR-0004 Q3 (tenant_id authority) and docs/architecture-dual-backend.md
 * "Tenant scoping" section.
 */
export abstract class TenantAuditedEntity extends AuditedEntity {
  @Column({ type: 'uuid' })
  tenantId!: string;
}
