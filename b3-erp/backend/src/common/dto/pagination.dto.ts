/**
 * Shared pagination DTO + response envelope for the NestJS backend.
 *
 * ADR-0004 §"Obligations accepted" pins the pagination shape as a
 * cross-backend contract. The Django counterpart lives at
 * `backend/optiforge/platform/api_gateway/pagination.py` and emits the
 * SAME envelope:
 *
 *   {
 *     "results": [...],
 *     "pagination": {
 *       "total": <int | null>,
 *       "page": <int>,
 *       "limit": <int>,
 *       "next": <URL | null>,
 *       "prev": <URL | null>
 *     }
 *   }
 *
 * Defaults: limit=50, hard max limit=500. Identical to the Django side.
 *
 * Usage in a controller:
 *
 *     @Get()
 *     async list(@Query() page: PaginationDto) {
 *       const [items, total] = await this.repo.findAndCount({
 *         skip: page.offset,
 *         take: page.take,
 *       });
 *       return paginated(items, total, page);
 *     }
 */
import { Type } from 'class-transformer';
import { IsInt, IsOptional, Max, Min } from 'class-validator';

export const DEFAULT_PAGE_SIZE = 50;
export const MAX_PAGE_SIZE = 500;

/**
 * Query DTO for paginated list endpoints. Accepts:
 *   - `page=<n>` (1-indexed; default 1)
 *   - `limit=<k>` (default 50, max 500)
 *   - `cursor=<opaque>` (for cursor-based pagination; mutually exclusive
 *     with `page` — when present, `page` is ignored)
 */
export class PaginationDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page: number = 1;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(MAX_PAGE_SIZE)
  limit: number = DEFAULT_PAGE_SIZE;

  @IsOptional()
  cursor?: string;

  /** TypeORM `take` parameter — equivalent to `limit`. */
  get take(): number {
    return this.limit;
  }

  /** TypeORM `skip` parameter — `(page - 1) * limit`. */
  get offset(): number {
    return Math.max(0, (this.page - 1) * this.limit);
  }
}

/**
 * Pagination metadata block — appears under `pagination` in the
 * response envelope.
 */
export interface PaginationMeta {
  total: number | null;
  page: number;
  limit: number;
  next: string | null;
  prev: string | null;
}

/**
 * Paginated response envelope. Generic over the row type.
 */
export interface PaginatedResponse<T> {
  results: T[];
  pagination: PaginationMeta;
}

/**
 * Build a {@link PaginatedResponse} from a result set + total count + the
 * pagination DTO. Uses page-number pagination semantics; cursor-based
 * callers should pass `total: null` and build `next`/`prev` themselves.
 *
 * @param results  current page of items
 * @param total    total count across all pages, or `null` for cursor pagination
 * @param page     the PaginationDto used to fetch this page
 * @param baseUrl  optional absolute URL used to build next/prev links
 */
export function paginated<T>(
  results: T[],
  total: number | null,
  page: PaginationDto,
  baseUrl?: string,
): PaginatedResponse<T> {
  const limit = page.limit;
  const currentPage = page.page;
  const hasNext =
    total !== null && currentPage * limit < total;
  const hasPrev = currentPage > 1;

  const buildLink = (targetPage: number): string | null => {
    if (!baseUrl) return null;
    const url = new URL(baseUrl);
    url.searchParams.set('page', String(targetPage));
    url.searchParams.set('limit', String(limit));
    return url.toString();
  };

  return {
    results,
    pagination: {
      total,
      page: currentPage,
      limit,
      next: hasNext ? buildLink(currentPage + 1) : null,
      prev: hasPrev ? buildLink(currentPage - 1) : null,
    },
  };
}
