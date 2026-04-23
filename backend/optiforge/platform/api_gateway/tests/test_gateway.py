import json
import uuid
import pytest

from optiforge.platform.api_gateway import graphql, rate_limit
from optiforge.platform.api_gateway.context import (
    clear_correlation_id, get_correlation_id, set_correlation_id,
)
from optiforge.platform.api_gateway.envelope import ErrorCode, error_envelope
from optiforge.platform.api_gateway.idempotency import (
    IdempotencyConflict, handle_write, remember,
)
from optiforge.platform.api_gateway.models import IdempotencyRecord
from optiforge.platform.api_gateway.rate_limit import (
    RateLimitExceeded, configure_defaults, enforce, reset, set_tenant_limit,
)


# --- Correlation IDs ---

def test_correlation_id_defaults_to_fresh_uuid():
    cid = set_correlation_id()
    assert uuid.UUID(cid)
    assert get_correlation_id() == cid
    clear_correlation_id()


def test_correlation_id_accepts_propagated_value():
    cid = set_correlation_id('abc-123')
    assert cid == 'abc-123'
    clear_correlation_id()


# --- Error envelope ---

def test_error_envelope_shape():
    set_correlation_id('corr-1')
    env = error_envelope(ErrorCode.NOT_FOUND, 'nope')
    assert env == {
        'error_code': 'NOT_FOUND',
        'message': 'nope',
        'details': {},
        'correlation_id': 'corr-1',
    }
    clear_correlation_id()


# --- Rate limit ---

def test_rate_limit_allows_within_budget():
    reset()
    configure_defaults(capacity=5, rate_per_second=0.1)
    t = uuid.uuid4()
    for _ in range(5):
        enforce(t)


def test_rate_limit_raises_on_exhaustion_with_retry_after():
    reset()
    configure_defaults(capacity=2, rate_per_second=0.1)
    t = uuid.uuid4()
    enforce(t)
    enforce(t)
    with pytest.raises(RateLimitExceeded) as exc_info:
        enforce(t)
    assert exc_info.value.retry_after > 0


def test_rate_limit_tenant_override():
    reset()
    configure_defaults(capacity=2, rate_per_second=0.01)
    t = uuid.uuid4()
    set_tenant_limit(t, capacity=10, rate_per_second=0.01)
    for _ in range(10):
        enforce(t)
    with pytest.raises(RateLimitExceeded):
        enforce(t)


# --- Idempotency ---

@pytest.mark.django_db
def test_idempotency_replay_returns_prior_response():
    tenant = uuid.uuid4()
    calls = []

    def do_write():
        calls.append(1)
        return 201, {'id': 'abc'}

    s1, b1 = handle_write(tenant, 'key-1', 'POST', '/x', {'a': 1}, do_write)
    s2, b2 = handle_write(tenant, 'key-1', 'POST', '/x', {'a': 1}, do_write)
    assert len(calls) == 1
    assert (s1, b1) == (s2, b2) == (201, {'id': 'abc'})


@pytest.mark.django_db
def test_idempotency_replay_different_body_conflicts():
    tenant = uuid.uuid4()
    handle_write(tenant, 'key-1', 'POST', '/x', {'a': 1},
                 do_write=lambda: (201, {'id': 'abc'}))
    status, body = handle_write(tenant, 'key-1', 'POST', '/x', {'a': 2},
                                do_write=lambda: (201, {'id': 'other'}))
    assert status == 409
    assert body['error_code'] == ErrorCode.IDEMPOTENCY_CONFLICT


@pytest.mark.django_db
def test_idempotency_noop_without_key():
    tenant = uuid.uuid4()
    calls = []
    s, b = handle_write(tenant, None, 'POST', '/x', {'a': 1},
                        do_write=lambda: (calls.append(1) or (201, {'n': 1})))
    assert s == 201
    assert IdempotencyRecord.objects.count() == 0


@pytest.mark.django_db
def test_remember_same_body_is_idempotent():
    tenant = uuid.uuid4()
    rec1 = remember(tenant, 'k', 'POST', '/x', {'a': 1}, 201, {'id': 1})
    rec2 = remember(tenant, 'k', 'POST', '/x', {'a': 1}, 201, {'id': 1})
    assert rec1.pk == rec2.pk


@pytest.mark.django_db
def test_remember_different_body_raises():
    tenant = uuid.uuid4()
    remember(tenant, 'k', 'POST', '/x', {'a': 1}, 201, {'id': 1})
    with pytest.raises(IdempotencyConflict):
        remember(tenant, 'k', 'POST', '/x', {'a': 2}, 201, {'id': 2})


# --- GraphQL facade ---

@pytest.fixture(autouse=True)
def reset_schema():
    graphql.clear_schema()
    yield
    graphql.clear_schema()


def test_graphql_single_fetch_by_id():
    store = {'abc': {'id': 'abc', 'title': 'hello'}}
    graphql.register_type(
        'Requirement', fields=('id', 'title'),
        fetch_by_id=lambda tenant, pk: store.get(pk),
    )
    result = graphql.execute_graphql(
        'query { Requirement(id: "abc") { id title } }', tenant_id=uuid.uuid4(),
    )
    assert result['errors'] == []
    assert result['data']['Requirement'] == {'id': 'abc', 'title': 'hello'}


def test_graphql_list_query():
    graphql.register_type(
        'Requirement', fields=('id', 'title'),
        fetch_all=lambda tenant: [{'id': '1', 'title': 'a'}, {'id': '2', 'title': 'b'}],
    )
    result = graphql.execute_graphql(
        'query { Requirements { id title } }', tenant_id=uuid.uuid4(),
    )
    assert [r['id'] for r in result['data']['Requirements']] == ['1', '2']


def test_graphql_unknown_field_rejected():
    graphql.register_type(
        'Requirement', fields=('id',),
        fetch_by_id=lambda tenant, pk: {'id': pk},
    )
    result = graphql.execute_graphql(
        'query { Requirement(id: "x") { id secret } }', tenant_id=uuid.uuid4(),
    )
    assert result['data'] is None
    assert result['errors'][0]['error_code'] == ErrorCode.INVALID_INPUT


def test_graphql_unknown_type_rejected():
    result = graphql.execute_graphql(
        'query { Ghost(id: "x") { id } }', tenant_id=uuid.uuid4(),
    )
    assert result['errors'][0]['error_code'] == ErrorCode.NOT_FOUND


def test_graphql_malformed_query_rejected():
    result = graphql.execute_graphql('not a graphql query', tenant_id=uuid.uuid4())
    assert result['errors'][0]['error_code'] == ErrorCode.INVALID_INPUT
