import io
import json
import logging
import pytest

from optiforge.platform.observability import alerts, metrics, tracing
from optiforge.platform.observability.alerts import AlertName
from optiforge.platform.observability.logging import (
    StructuredFormatter, structured_log_extra,
)


# --- Structured logs ---

def test_structured_formatter_emits_required_fields():
    buf = io.StringIO()
    handler = logging.StreamHandler(buf)
    handler.setFormatter(StructuredFormatter())
    logger = logging.getLogger('test.obs')
    logger.handlers = [handler]
    logger.setLevel(logging.INFO)

    logger.info(
        'cr created', extra=structured_log_extra(
            layer='core', module_name='sales', operation='create_cr',
            outcome='ok', duration_ms=12.3, actor_id='u-1',
        ),
    )
    payload = json.loads(buf.getvalue().strip())

    for field in ('timestamp', 'correlation_id', 'tenant_id', 'actor_id',
                  'operation', 'layer', 'module', 'duration_ms', 'outcome'):
        assert field in payload
    assert payload['layer'] == 'core'
    assert payload['module'] == 'sales'
    assert payload['duration_ms'] == 12.3


def test_invalid_layer_rejected():
    with pytest.raises(AssertionError):
        structured_log_extra(
            layer='nope', module_name='x', operation='op',
        )


# --- Metrics ---

@pytest.fixture(autouse=True)
def reset_metrics():
    metrics.reset()
    yield
    metrics.reset()


def test_counters_and_histograms_record():
    metrics.incr('sales', 'created')
    metrics.incr('sales', 'created', value=2)
    metrics.observe('sales', 'create_latency', 100.0)
    metrics.observe('sales', 'create_latency', 200.0)

    snap = metrics.snapshot()
    assert snap['counters']['sales|created|'] == 3
    hist = snap['histograms']['sales|create_latency|']
    assert hist['count'] == 2
    assert hist['avg'] == 150.0


def test_pack_metrics_are_namespaced():
    metrics.pack_incr('kitchen-equipment', 'finishing_review', value=5)
    snap = metrics.snapshot()
    assert 'pack:kitchen-equipment|finishing_review|' in snap['counters']


def test_timed_context_records_latency_and_errors():
    with metrics.timed('sales', 'create'):
        pass
    try:
        with metrics.timed('sales', 'create'):
            raise ValueError('boom')
    except ValueError:
        pass
    snap = metrics.snapshot()
    assert snap['counters'].get('sales|create.calls|', 0) == 2
    assert snap['counters'].get('sales|create.errors|', 0) == 1


# --- Tracing ---

def test_trace_start_and_propagation():
    tracing.clear_trace()
    trace_id, span_id = tracing.start_trace()
    assert tracing.current_trace()['trace_id'] == trace_id
    headers = tracing.inject_headers({'Content-Type': 'application/json'})
    assert headers['traceparent'].startswith(f"00-{trace_id}-")


def test_extract_headers_parses_traceparent():
    t_id, parent = tracing.extract_headers(
        {'traceparent': '00-abc-span-01'},
    )
    assert t_id == 'abc' and parent == 'span'


def test_extract_missing_traceparent_returns_none():
    t_id, parent = tracing.extract_headers({})
    assert t_id is None and parent is None


# --- Alerts ---

@pytest.fixture(autouse=True)
def reset_alerts():
    alerts.reset()
    yield
    alerts.reset()


def test_default_alert_rules_cover_prd_named_conditions():
    alerts.install_default_rules()
    assert set(alerts._rules.keys()) == {
        AlertName.DLQ_DEPTH_EXCEEDED,
        AlertName.HASH_CHAIN_BREAK,
        AlertName.CROSS_TENANT_QUERY,
        AlertName.PACK_ACTIVATION_ROLLBACK,
        AlertName.P95_LATENCY_SLO,
        AlertName.PACK_ERROR_RATE_SLO,
    }


def test_dlq_threshold_triggers_alert():
    alerts.install_default_rules()
    fired = alerts.evaluate({'dlq_depth': 500, 'dlq_threshold': 100})
    assert AlertName.DLQ_DEPTH_EXCEEDED in fired


def test_hash_chain_failure_triggers_alert():
    alerts.install_default_rules()
    fired = alerts.evaluate({'hash_chain_failures': [{'entity_id': 'x'}]})
    assert AlertName.HASH_CHAIN_BREAK in fired


def test_cross_tenant_attempt_triggers_alert():
    alerts.install_default_rules()
    fired = alerts.evaluate({'cross_tenant_query_attempt': True})
    assert AlertName.CROSS_TENANT_QUERY in fired


def test_pack_activation_rollback_triggers_alert():
    alerts.install_default_rules()
    fired = alerts.evaluate({'pack_activation_rollback': True})
    assert AlertName.PACK_ACTIVATION_ROLLBACK in fired


def test_p95_latency_slo_triggers_alert():
    alerts.install_default_rules()
    fired = alerts.evaluate({'p95_latency_ms': 900, 'p95_latency_slo_ms': 500})
    assert AlertName.P95_LATENCY_SLO in fired


def test_pack_error_rate_triggers_alert():
    alerts.install_default_rules()
    fired = alerts.evaluate({'pack_error_rate': 0.05, 'pack_error_rate_slo': 0.01})
    assert AlertName.PACK_ERROR_RATE_SLO in fired


def test_chaos_every_alert_fires_when_triggered_deliberately():
    alerts.install_default_rules()
    facts = {
        'dlq_depth': 1_000, 'dlq_threshold': 100,
        'hash_chain_failures': [{'x': 1}],
        'cross_tenant_query_attempt': True,
        'pack_activation_rollback': True,
        'p95_latency_ms': 2_000, 'p95_latency_slo_ms': 500,
        'pack_error_rate': 0.2, 'pack_error_rate_slo': 0.01,
    }
    fired = alerts.evaluate(facts)
    assert set(fired) == {
        AlertName.DLQ_DEPTH_EXCEEDED,
        AlertName.HASH_CHAIN_BREAK,
        AlertName.CROSS_TENANT_QUERY,
        AlertName.PACK_ACTIVATION_ROLLBACK,
        AlertName.P95_LATENCY_SLO,
        AlertName.PACK_ERROR_RATE_SLO,
    }


def test_alert_sink_invoked_on_fire():
    received = []

    def sink(name, ctx):
        received.append(name)

    alerts.register('always_fire', lambda ctx: True)
    alerts.evaluate({}, sink=sink)
    assert received == ['always_fire']
