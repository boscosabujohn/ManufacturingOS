/**
 * Contract tests for the shared pagination DTO + envelope.
 *
 * Mirrors backend/tests/pagination/test_pagination.py on the Django
 * side. The shape and limits must stay aligned per ADR-0004
 * §"Obligations accepted".
 */
import 'reflect-metadata';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';

import {
  DEFAULT_PAGE_SIZE,
  MAX_PAGE_SIZE,
  PaginationDto,
  paginated,
} from '../../../../src/common/dto/pagination.dto';

// ---------------------------------------------------------------------------
// Locked constants
// ---------------------------------------------------------------------------

describe('Pagination contract constants', () => {
  it('default page size is 50', () => {
    expect(DEFAULT_PAGE_SIZE).toBe(50);
  });

  it('max page size is 500', () => {
    expect(MAX_PAGE_SIZE).toBe(500);
  });
});

// ---------------------------------------------------------------------------
// PaginationDto — defaults
// ---------------------------------------------------------------------------

describe('PaginationDto defaults', () => {
  it('defaults page to 1 and limit to 50 when nothing is provided', () => {
    const dto = plainToInstance(PaginationDto, {});
    expect(validateSync(dto)).toEqual([]);
    expect(dto.page).toBe(1);
    expect(dto.limit).toBe(50);
  });

  it('respects user-provided values within range', () => {
    const dto = plainToInstance(PaginationDto, { page: 3, limit: 25 });
    expect(validateSync(dto)).toEqual([]);
    expect(dto.page).toBe(3);
    expect(dto.limit).toBe(25);
  });
});

// ---------------------------------------------------------------------------
// PaginationDto — validation
// ---------------------------------------------------------------------------

describe('PaginationDto validation', () => {
  it('rejects negative page', () => {
    const dto = plainToInstance(PaginationDto, { page: -1 });
    const errors = validateSync(dto);
    expect(errors).not.toHaveLength(0);
  });

  it('rejects zero limit', () => {
    const dto = plainToInstance(PaginationDto, { limit: 0 });
    const errors = validateSync(dto);
    expect(errors).not.toHaveLength(0);
  });

  it('rejects limit greater than the hard cap', () => {
    const dto = plainToInstance(PaginationDto, { limit: MAX_PAGE_SIZE + 1 });
    const errors = validateSync(dto);
    expect(errors).not.toHaveLength(0);
  });

  it('accepts limit at the hard cap exactly', () => {
    const dto = plainToInstance(PaginationDto, { limit: MAX_PAGE_SIZE });
    expect(validateSync(dto)).toEqual([]);
  });

  it('coerces string query-param values to numbers', () => {
    const dto = plainToInstance(PaginationDto, { page: '2', limit: '10' });
    expect(validateSync(dto)).toEqual([]);
    expect(dto.page).toBe(2);
    expect(dto.limit).toBe(10);
  });
});

// ---------------------------------------------------------------------------
// PaginationDto — TypeORM helpers
// ---------------------------------------------------------------------------

describe('PaginationDto TypeORM helpers', () => {
  it('take equals limit', () => {
    const dto = plainToInstance(PaginationDto, { page: 1, limit: 25 });
    expect(dto.take).toBe(25);
  });

  it('offset equals (page - 1) * limit', () => {
    const dto = plainToInstance(PaginationDto, { page: 3, limit: 20 });
    expect(dto.offset).toBe(40);
  });

  it('offset is never negative even on page 0/1 edge', () => {
    const dto = plainToInstance(PaginationDto, { page: 1, limit: 50 });
    expect(dto.offset).toBe(0);
  });
});

// ---------------------------------------------------------------------------
// paginated() — envelope shape
// ---------------------------------------------------------------------------

describe('paginated() envelope', () => {
  it('matches the shared cross-backend shape', () => {
    const dto = plainToInstance(PaginationDto, { page: 1, limit: 2 });
    const env = paginated([{ id: 1 }, { id: 2 }], 5, dto, 'http://api.example.test/items');

    expect(Object.keys(env).sort()).toEqual(['pagination', 'results']);
    expect(Object.keys(env.pagination).sort()).toEqual(
      ['limit', 'next', 'page', 'prev', 'total'],
    );
    expect(env.pagination.total).toBe(5);
    expect(env.pagination.page).toBe(1);
    expect(env.pagination.limit).toBe(2);
    expect(env.pagination.prev).toBeNull();
    expect(env.pagination.next).toContain('page=2');
    expect(env.pagination.next).toContain('limit=2');
  });

  it('omits next link on the last page', () => {
    const dto = plainToInstance(PaginationDto, { page: 3, limit: 2 });
    const env = paginated([{ id: 5 }], 5, dto, 'http://api.example.test/items');
    expect(env.pagination.next).toBeNull();
    expect(env.pagination.prev).not.toBeNull();
  });

  it('reports total = null for cursor-based pagination', () => {
    const dto = plainToInstance(PaginationDto, { page: 1, limit: 50, cursor: 'opaque' });
    const env = paginated([{ id: 1 }], null, dto);
    expect(env.pagination.total).toBeNull();
    expect(env.pagination.next).toBeNull(); // no baseUrl provided
  });

  it('produces null next/prev when no baseUrl is provided', () => {
    const dto = plainToInstance(PaginationDto, { page: 1, limit: 2 });
    const env = paginated([{ id: 1 }], 5, dto);
    expect(env.pagination.next).toBeNull();
    expect(env.pagination.prev).toBeNull();
  });
});
