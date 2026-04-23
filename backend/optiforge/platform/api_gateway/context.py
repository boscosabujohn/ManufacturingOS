"""
Correlation-id propagation. Middleware reads X-Correlation-Id from the
request (or mints a fresh UUID) and stores it in a contextvar so logs,
audit, and downstream services can attach it.
"""
import contextvars
import uuid

_correlation_id = contextvars.ContextVar('optiforge_correlation_id', default=None)


def set_correlation_id(value=None):
    value = value or str(uuid.uuid4())
    _correlation_id.set(value)
    return value


def get_correlation_id():
    return _correlation_id.get()


def clear_correlation_id():
    _correlation_id.set(None)
