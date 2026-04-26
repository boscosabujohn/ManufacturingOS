"""
Contract tests for the shared pagination envelope.

ADR-0004 §"Obligations accepted" requires identical pagination semantics
on both backends. This suite locks the Django side to the envelope shape,
limits (50 default, 500 max), and the page/limit query-parameter names
that the NestJS counterpart also consumes.
"""
from __future__ import annotations

from rest_framework.request import Request
from rest_framework.test import APIRequestFactory

from optiforge.platform.api_gateway import pagination


def _api_request(query_params: dict):
    """Build a DRF `Request` so pagination classes can read `.query_params`."""
    factory = APIRequestFactory()
    return Request(factory.get('/', query_params))


# ---------------------------------------------------------------------------
# Module-level constants — locked by contract
# ---------------------------------------------------------------------------


def test_default_page_size_is_fifty():
    assert pagination.DEFAULT_PAGE_SIZE == 50


def test_max_page_size_is_five_hundred():
    assert pagination.MAX_PAGE_SIZE == 500


# ---------------------------------------------------------------------------
# DefaultPageNumberPagination
# ---------------------------------------------------------------------------


def test_default_pagination_class_inherits_limits():
    cls = pagination.DefaultPageNumberPagination
    assert cls.page_size == pagination.DEFAULT_PAGE_SIZE
    assert cls.max_page_size == pagination.MAX_PAGE_SIZE


def test_default_pagination_accepts_limit_and_page_query_params():
    cls = pagination.DefaultPageNumberPagination
    # Matches NestJS PaginationDto field names — see ADR-0004 §"Data contracts".
    assert cls.page_size_query_param == 'limit'
    assert cls.page_query_param == 'page'


def test_default_pagination_envelope_shape():
    """Paginated response shape matches the shared contract."""
    request = _api_request({'limit': 2})

    # Simulate a queryset-ish object by passing a list.
    paginator = pagination.DefaultPageNumberPagination()
    page = paginator.paginate_queryset(list(range(5)), request)
    response = paginator.get_paginated_response(page)

    assert set(response.data.keys()) == {'results', 'pagination'}
    pagination_block = response.data['pagination']
    assert set(pagination_block.keys()) == {'total', 'page', 'limit', 'next', 'prev'}
    assert pagination_block['total'] == 5
    assert pagination_block['limit'] == 2
    assert pagination_block['page'] == 1
    # 5 items, limit 2 → next link present
    assert pagination_block['next'] is not None
    assert pagination_block['prev'] is None
    assert response.data['results'] == [0, 1]


def test_default_pagination_hard_cap_is_enforced():
    """Client asking for limit > 500 is clamped to 500."""
    request = _api_request({'limit': 10000})

    paginator = pagination.DefaultPageNumberPagination()
    # 600 items with a requested limit of 10000 should clamp to 500.
    paginator.paginate_queryset(list(range(600)), request)
    assert paginator.get_page_size(request) == 500


def test_default_pagination_limit_below_cap_is_respected():
    request = _api_request({'limit': 25})

    paginator = pagination.DefaultPageNumberPagination()
    paginator.paginate_queryset(list(range(100)), request)
    assert paginator.get_page_size(request) == 25


# ---------------------------------------------------------------------------
# OptiForgeCursorPagination
# ---------------------------------------------------------------------------


def test_cursor_pagination_inherits_limits():
    cls = pagination.OptiForgeCursorPagination
    assert cls.page_size == pagination.DEFAULT_PAGE_SIZE
    assert cls.max_page_size == pagination.MAX_PAGE_SIZE


def test_cursor_pagination_uses_cursor_query_param():
    cls = pagination.OptiForgeCursorPagination
    assert cls.cursor_query_param == 'cursor'
    assert cls.page_size_query_param == 'limit'


def test_cursor_pagination_orders_by_created_at_descending_by_default():
    """Subclasses override `ordering`, but the base default is -created_at
    (stable, monotonic for append-heavy tables)."""
    cls = pagination.OptiForgeCursorPagination
    assert cls.ordering == '-created_at'


# ---------------------------------------------------------------------------
# paginated_response() utility
# ---------------------------------------------------------------------------


def test_paginated_response_helper_produces_shared_envelope():
    envelope = pagination.paginated_response(
        results=[{'id': 1}, {'id': 2}],
        total=2,
        page=1,
        limit=50,
        next_url=None,
        prev_url=None,
    )
    assert set(envelope.keys()) == {'results', 'pagination'}
    assert envelope['results'] == [{'id': 1}, {'id': 2}]
    assert envelope['pagination'] == {
        'total': 2,
        'page': 1,
        'limit': 50,
        'next': None,
        'prev': None,
    }
