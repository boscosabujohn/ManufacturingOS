"""
Trace context propagation. A trace is identified by (trace_id, span_id);
the gateway middleware uses this to carry context across HTTP calls and
(when Celery ships) across worker boundaries.
"""
import contextvars
import uuid


_trace_ctx = contextvars.ContextVar('optiforge_trace_ctx', default=None)


def start_trace(trace_id=None, parent_span_id=None):
    trace_id = trace_id or uuid.uuid4().hex
    span_id = uuid.uuid4().hex
    _trace_ctx.set({
        'trace_id': trace_id,
        'span_id': span_id,
        'parent_span_id': parent_span_id,
    })
    return trace_id, span_id


def current_trace():
    return _trace_ctx.get()


def clear_trace():
    _trace_ctx.set(None)


def inject_headers(headers=None):
    """Propagate trace context over HTTP (W3C-style, simplified)."""
    ctx = _trace_ctx.get()
    headers = dict(headers or {})
    if ctx:
        headers['traceparent'] = f"00-{ctx['trace_id']}-{ctx['span_id']}-01"
    return headers


def extract_headers(headers):
    """Parse an incoming traceparent header; returns (trace_id, parent_span)."""
    tp = headers.get('traceparent') or headers.get('Traceparent')
    if not tp:
        return None, None
    parts = tp.split('-')
    if len(parts) != 4:
        return None, None
    return parts[1], parts[2]
