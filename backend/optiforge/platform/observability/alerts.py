"""
Alert rule engine. Rules are named conditions over a snapshot dict. When
a rule fires, a callable sink (logger / pager / notifier) is invoked.
"""
from .metrics import snapshot


class AlertName:
    DLQ_DEPTH_EXCEEDED = 'dlq_depth_exceeded'
    HASH_CHAIN_BREAK = 'hash_chain_break'
    CROSS_TENANT_QUERY = 'cross_tenant_query'
    PACK_ACTIVATION_ROLLBACK = 'pack_activation_rollback'
    P95_LATENCY_SLO = 'p95_latency_slo_breach'
    PACK_ERROR_RATE_SLO = 'pack_error_rate_slo_breach'


_rules = {}
_fired = []


def register(name, predicate):
    """Register a predicate: dict(snapshot + facts) -> bool."""
    _rules[name] = predicate


def reset():
    _rules.clear()
    _fired.clear()


def evaluate(facts=None, sink=None):
    """
    Evaluate every registered rule. Any rule whose predicate returns True is
    appended to the fired history and dispatched to `sink`.
    """
    facts = facts or {}
    snap = snapshot()
    context = {'snapshot': snap, **facts}
    fired_now = []
    for name, predicate in _rules.items():
        try:
            if predicate(context):
                fired_now.append(name)
                _fired.append(name)
                if sink:
                    sink(name, context)
        except Exception as exc:
            _fired.append(f'{name}.predicate_error')
    return fired_now


def history():
    return list(_fired)


def _default_rules():
    def dlq_rule(ctx):
        return ctx.get('dlq_depth', 0) > ctx.get('dlq_threshold', 100)

    def hash_chain_rule(ctx):
        return bool(ctx.get('hash_chain_failures'))

    def cross_tenant_rule(ctx):
        return bool(ctx.get('cross_tenant_query_attempt'))

    def rollback_rule(ctx):
        return bool(ctx.get('pack_activation_rollback'))

    def latency_rule(ctx):
        return ctx.get('p95_latency_ms', 0) > ctx.get('p95_latency_slo_ms', 500)

    def pack_error_rule(ctx):
        return ctx.get('pack_error_rate', 0) > ctx.get('pack_error_rate_slo', 0.01)

    return {
        AlertName.DLQ_DEPTH_EXCEEDED: dlq_rule,
        AlertName.HASH_CHAIN_BREAK: hash_chain_rule,
        AlertName.CROSS_TENANT_QUERY: cross_tenant_rule,
        AlertName.PACK_ACTIVATION_ROLLBACK: rollback_rule,
        AlertName.P95_LATENCY_SLO: latency_rule,
        AlertName.PACK_ERROR_RATE_SLO: pack_error_rule,
    }


def install_default_rules():
    for name, predicate in _default_rules().items():
        register(name, predicate)
