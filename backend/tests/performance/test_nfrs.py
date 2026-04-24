"""
Issue #105 — performance + scalability validation against PRD NFRs.
These tests exercise the programmatic SLO helpers; full load tests
against realistic data volumes are a separate infra-owned activity.
"""
import uuid
import pytest

from optiforge.platform.audit.models import AuditRecord
from optiforge.platform.audit.tasks import entity_query_latency_ms
from optiforge.platform.api_gateway.rate_limit import (
    configure_defaults, enforce, reset, set_tenant_limit, RateLimitExceeded,
)


@pytest.fixture(autouse=True)
def reset_rl():
    reset()
    yield
    reset()


@pytest.mark.django_db
def test_audit_entity_query_slo_under_1s_on_100_rows():
    tenant_id = uuid.uuid4()
    entity_id = str(uuid.uuid4())
    for _ in range(100):
        AuditRecord.create_record(
            tenant_id=tenant_id,
            entity_type='nfr.entity', entity_id=entity_id,
            operation='UPDATE', after_state={'v': 1},
        )
    latency_ms = entity_query_latency_ms('nfr.entity', entity_id)
    # SLO is 1s p95; on 100 rows under SQLite in-memory, we expect well
    # under 100ms. Generous budget to avoid CI flakiness.
    assert latency_ms < 500.0, f"latency {latency_ms}ms exceeded NFR budget"


def test_rate_limit_enforces_per_tenant_budget():
    t = uuid.uuid4()
    configure_defaults(capacity=50, rate_per_second=0.1)
    for _ in range(50):
        enforce(t)
    with pytest.raises(RateLimitExceeded):
        enforce(t)


def test_rate_limit_tenant_override_independent_of_default():
    fast_tenant = uuid.uuid4()
    slow_tenant = uuid.uuid4()
    configure_defaults(capacity=5, rate_per_second=0.01)
    set_tenant_limit(fast_tenant, capacity=50, rate_per_second=0.01)
    for _ in range(50):
        enforce(fast_tenant)
    for _ in range(5):
        enforce(slow_tenant)
    with pytest.raises(RateLimitExceeded):
        enforce(slow_tenant)
