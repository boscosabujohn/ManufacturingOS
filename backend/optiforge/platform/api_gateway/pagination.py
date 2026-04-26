"""
Shared pagination classes for DRF list endpoints.

ADR-0004 §"Obligations accepted" pins pagination shape as a cross-backend
contract. The NestJS counterpart is
`b3-erp/backend/src/common/dto/pagination.dto.ts` — both sides emit the
same envelope:

    {
        "results": [ ... page of items ... ],
        "pagination": {
            "total": <int>,
            "page": <int>,
            "limit": <int>,
            "next": <absolute URL | null>,
            "prev": <absolute URL | null>
        }
    }

Defaults: `limit=50`, hard max `limit=500`. These match the NestJS
defaults in `pagination.dto.ts`.

Three classes:
- `DefaultPageNumberPagination` — the global DRF default. Page-number
  based. Suitable for reference tables that are not insert-heavy.
- `OptiForgeCursorPagination` — cursor-based. Use for append-heavy
  tables (audit records, events, workflow instances) where offset
  pagination drifts under concurrent writes.
- `paginated_response()` — a utility to build the same envelope manually
  for handlers that aren't DRF generics.
"""
from __future__ import annotations

from collections import OrderedDict
from rest_framework.pagination import (
    CursorPagination as DRFCursorPagination,
    PageNumberPagination,
)
from rest_framework.response import Response


# ---- limits shared across all pagination classes ---------------------

DEFAULT_PAGE_SIZE = 50
MAX_PAGE_SIZE = 500


class DefaultPageNumberPagination(PageNumberPagination):
    """
    Project default: page-number pagination with page_size=50, capped at 500.

    Client sends `?page=<n>&limit=<k>` (or the legacy `page_size=<k>` —
    both accepted). If `limit` > 500 it is clamped silently; if the
    client sends garbage it gets 400 via DRF.

    Response shape (identical to OptiForgeCursorPagination + NestJS
    PaginationDto envelope):

        {
          "results": [ ... ],
          "pagination": {
            "total": <int>,
            "page": <int>,
            "limit": <int>,
            "next": <URL | null>,
            "prev": <URL | null>
          }
        }
    """

    page_size = DEFAULT_PAGE_SIZE
    max_page_size = MAX_PAGE_SIZE
    # Accept either `limit` (preferred, matches NestJS DTO) or the DRF
    # classic `page_size`.
    page_size_query_param = 'limit'
    page_query_param = 'page'

    def get_paginated_response(self, data) -> Response:
        return Response(
            OrderedDict([
                ('results', data),
                ('pagination', OrderedDict([
                    ('total', self.page.paginator.count),
                    ('page', self.page.number),
                    ('limit', self.page.paginator.per_page),
                    ('next', self.get_next_link()),
                    ('prev', self.get_previous_link()),
                ])),
            ])
        )


class OptiForgeCursorPagination(DRFCursorPagination):
    """
    Cursor pagination for insert-heavy tables. Cursor stability is
    preserved under concurrent writes, unlike page-number pagination.

    Order explicitly by a stable, monotonic key (default: `-created_at`).
    Subclasses MUST override `ordering` to a real column.

    Client sends `?cursor=<opaque>&limit=<k>`. The envelope matches the
    page-number variant but `page` is always reported as 0 (cursors
    don't have page numbers).
    """

    page_size = DEFAULT_PAGE_SIZE
    max_page_size = MAX_PAGE_SIZE
    page_size_query_param = 'limit'
    cursor_query_param = 'cursor'
    ordering = '-created_at'

    def get_paginated_response(self, data) -> Response:
        return Response(
            OrderedDict([
                ('results', data),
                ('pagination', OrderedDict([
                    # Cursor pagination doesn't know the total without a
                    # COUNT(*) that defeats the purpose. Report None.
                    ('total', None),
                    ('page', 0),
                    ('limit', self.get_page_size(self.request)),
                    ('next', self.get_next_link()),
                    ('prev', self.get_previous_link()),
                ])),
            ])
        )


def paginated_response(results, *, total: int, page: int, limit: int,
                       next_url: str | None = None,
                       prev_url: str | None = None):
    """
    Build the paginated envelope by hand. Useful for ad-hoc handlers
    that compute pagination themselves (e.g., raw-SQL reports) and
    aren't based on a DRF generic view.
    """
    return {
        'results': results,
        'pagination': {
            'total': total,
            'page': page,
            'limit': limit,
            'next': next_url,
            'prev': prev_url,
        },
    }
