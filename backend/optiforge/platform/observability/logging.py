"""
Structured JSON log formatter. Every line carries:
  timestamp, correlation_id, tenant_id, actor_id, operation, layer,
  module, duration_ms, outcome.
"""
import datetime
import json
import logging


LAYERS = ('platform', 'core', 'mode', 'compliance', 'pack')


class StructuredFormatter(logging.Formatter):
    """
    Formats any LogRecord as JSON with the PRD-named fields. Missing fields
    are populated from defaults rather than omitted so every line is uniform.
    """

    DEFAULTS = {
        'correlation_id': None,
        'tenant_id': None,
        'actor_id': None,
        'operation': None,
        'layer': 'platform',
        'module': None,
        'duration_ms': None,
        'outcome': None,
    }

    def format(self, record):
        # pull any attached contextvars on demand
        try:
            from optiforge.platform.api_gateway.context import get_correlation_id
            correlation_id = get_correlation_id()
        except Exception:
            correlation_id = None
        try:
            from optiforge.platform.tenancy.context import get_current_tenant_id
            tenant_id = str(get_current_tenant_id()) if get_current_tenant_id() else None
        except Exception:
            tenant_id = None

        payload = {
            'timestamp': datetime.datetime.now(datetime.timezone.utc).isoformat(),
            'level': record.levelname,
            'message': record.getMessage(),
            'logger': record.name,
            **self.DEFAULTS,
            'correlation_id': getattr(record, 'correlation_id', None) or correlation_id,
            'tenant_id': getattr(record, 'tenant_id', None) or tenant_id,
            'actor_id': getattr(record, 'actor_id', None),
            'operation': getattr(record, 'operation', None),
            'layer': getattr(record, 'layer', 'platform'),
            'module': getattr(record, 'module_name', record.module),
            'duration_ms': getattr(record, 'duration_ms', None),
            'outcome': getattr(record, 'outcome', None),
        }
        return json.dumps(payload, default=str)


def structured_log_extra(layer, module_name, operation, outcome=None,
                         duration_ms=None, actor_id=None):
    """
    Build the `extra=` dict callers pass to logger.info(...) so each log
    line is fully populated.
    """
    assert layer in LAYERS, f"layer must be one of {LAYERS}"
    return {
        'layer': layer,
        'module_name': module_name,
        'operation': operation,
        'outcome': outcome,
        'duration_ms': duration_ms,
        'actor_id': actor_id,
    }
