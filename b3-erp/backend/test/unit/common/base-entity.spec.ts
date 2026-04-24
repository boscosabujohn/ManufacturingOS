/**
 * Contract tests for the shared base entities (AuditedEntity,
 * TenantAuditedEntity).
 *
 * Mirrors backend/tests/audit_soft_delete/test_mixins.py on the Django
 * side. The columns and semantics must stay aligned per ADR-0004
 * §"Obligations accepted".
 *
 * This spec focuses on the TypeScript-level contract — that the decorators
 * are in place, the helper methods behave correctly, and the class can be
 * extended. Full soft-delete integration with TypeORM is exercised in the
 * per-module integration tests as entities migrate to the base.
 */
import 'reflect-metadata';
import { Entity, Column, getMetadataArgsStorage } from 'typeorm';

import {
  AuditedEntity,
  TenantAuditedEntity,
} from '../../../src/common/entities/base.entity';

// ---------------------------------------------------------------------------
// A concrete subclass used only in these tests.
// ---------------------------------------------------------------------------

@Entity({ name: 'test_audited_entities' })
class DummyAuditedEntity extends AuditedEntity {
  @Column()
  name!: string;
}

@Entity({ name: 'test_tenant_audited_entities' })
class DummyTenantEntity extends TenantAuditedEntity {
  @Column()
  name!: string;
}

/**
 * TypeORM's MetadataArgsStorage stores decorator args on the class where
 * the decorator was actually applied. For inherited columns, the target is
 * the *parent* abstract class, not the concrete child. This helper walks
 * the prototype chain and matches either.
 */
function findColumn(target: Function, prop: string) {
  const targets: Function[] = [];
  let cursor: Function | null = target;
  while (cursor && cursor !== Function.prototype) {
    targets.push(cursor);
    cursor = Object.getPrototypeOf(cursor);
  }
  return getMetadataArgsStorage().columns.find(
    (c) => targets.includes(c.target as Function) && c.propertyName === prop,
  );
}

function findGeneration(target: Function, prop: string) {
  const targets: Function[] = [];
  let cursor: Function | null = target;
  while (cursor && cursor !== Function.prototype) {
    targets.push(cursor);
    cursor = Object.getPrototypeOf(cursor);
  }
  return getMetadataArgsStorage().generations.find(
    (g) => targets.includes(g.target as Function) && g.propertyName === prop,
  );
}

// ---------------------------------------------------------------------------
// AuditedEntity — column contract
// ---------------------------------------------------------------------------

describe('AuditedEntity column contract', () => {
  it('registers a primary generated uuid column named id', () => {
    const gen = findGeneration(DummyAuditedEntity, 'id');
    expect(gen).toBeDefined();
    expect(gen?.strategy).toBe('uuid');
  });

  it('registers createdAt as a CreateDateColumn (timestamptz)', () => {
    const col = findColumn(DummyAuditedEntity, 'createdAt');
    expect(col?.mode).toBe('createDate');
    expect(col?.options.type).toBe('timestamptz');
  });

  it('registers updatedAt as an UpdateDateColumn (timestamptz)', () => {
    const col = findColumn(DummyAuditedEntity, 'updatedAt');
    expect(col?.mode).toBe('updateDate');
    expect(col?.options.type).toBe('timestamptz');
  });

  it('registers deletedAt as a DeleteDateColumn (drives soft delete)', () => {
    const col = findColumn(DummyAuditedEntity, 'deletedAt');
    expect(col?.mode).toBe('deleteDate');
    expect(col?.options.type).toBe('timestamptz');
  });

  it('registers createdBy, updatedBy, deletedBy as nullable uuid columns', () => {
    for (const prop of ['createdBy', 'updatedBy', 'deletedBy']) {
      const col = findColumn(DummyAuditedEntity, prop);
      expect(col).toBeDefined();
      expect(col?.options.type).toBe('uuid');
      expect(col?.options.nullable).toBe(true);
    }
  });
});

// ---------------------------------------------------------------------------
// AuditedEntity — helpers
// ---------------------------------------------------------------------------

describe('AuditedEntity helpers', () => {
  it('isDeleted returns false when deletedAt is null/undefined', () => {
    const e = new DummyAuditedEntity();
    e.deletedAt = null;
    expect(e.isDeleted).toBe(false);
  });

  it('isDeleted returns true when deletedAt is a Date', () => {
    const e = new DummyAuditedEntity();
    e.deletedAt = new Date();
    expect(e.isDeleted).toBe(true);
  });

  it('markDeletedBy records the caller user id', () => {
    const e = new DummyAuditedEntity();
    e.markDeletedBy('11111111-1111-1111-1111-111111111111');
    expect(e.deletedBy).toBe('11111111-1111-1111-1111-111111111111');
  });

  it('markDeletedBy accepts null to clear the attribution', () => {
    const e = new DummyAuditedEntity();
    e.deletedBy = 'abc';
    e.markDeletedBy(null);
    expect(e.deletedBy).toBeNull();
  });
});

// ---------------------------------------------------------------------------
// TenantAuditedEntity — contract
// ---------------------------------------------------------------------------

describe('TenantAuditedEntity', () => {
  it('inherits all AuditedEntity columns', () => {
    for (const prop of [
      'id',
      'createdAt',
      'updatedAt',
      'createdBy',
      'updatedBy',
      'deletedAt',
      'deletedBy',
    ]) {
      const col = findColumn(DummyTenantEntity, prop);
      const gen = findGeneration(DummyTenantEntity, prop);
      expect(col ?? gen).toBeDefined();
    }
  });

  it('adds a non-nullable tenantId uuid column', () => {
    const col = findColumn(DummyTenantEntity, 'tenantId');
    expect(col).toBeDefined();
    expect(col?.options.type).toBe('uuid');
    // TypeORM @Column without nullable is non-nullable by default.
    expect(col?.options.nullable).not.toBe(true);
  });
});
