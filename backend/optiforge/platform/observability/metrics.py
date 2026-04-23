"""
In-process metrics registry. Counters and histograms are accumulated
per (module, operation, labels) and exposable via `snapshot()`. A real
deployment swaps in prometheus_client / statsd behind these functions
without changing callers.

Pack-specific metrics are namespaced by prefixing the module with
`pack:<pack_id>` so dashboards can separate core vs. pack rates.
"""
import time
from collections import defaultdict
from threading import Lock


_counters = defaultdict(int)
_histograms = defaultdict(list)
_lock = Lock()


def _key(module, operation, labels):
    label_str = ','.join(f'{k}={v}' for k, v in sorted((labels or {}).items()))
    return f"{module}|{operation}|{label_str}"


def incr(module, operation, value=1, labels=None):
    with _lock:
        _counters[_key(module, operation, labels)] += value


def observe(module, operation, value_ms, labels=None):
    with _lock:
        _histograms[_key(module, operation, labels)].append(value_ms)


def pack_incr(pack_id, operation, value=1, labels=None):
    """Pack-specific counter with enforced namespace."""
    incr(f'pack:{pack_id}', operation, value=value, labels=labels)


def pack_observe(pack_id, operation, value_ms, labels=None):
    observe(f'pack:{pack_id}', operation, value_ms, labels=labels)


def reset():
    with _lock:
        _counters.clear()
        _histograms.clear()


def snapshot():
    """Return a dict-of-dicts suitable for scraping into Prom format."""
    with _lock:
        return {
            'counters': dict(_counters),
            'histograms': {
                key: {
                    'count': len(values),
                    'sum': sum(values),
                    'avg': (sum(values) / len(values)) if values else 0.0,
                }
                for key, values in _histograms.items()
            },
        }


class timed:
    """
    Context manager that records latency_ms on exit.
    Usage:
        with timed('sales', 'create_cr'):
            ...
    """
    def __init__(self, module, operation, labels=None):
        self.module = module
        self.operation = operation
        self.labels = labels
        self._start = None

    def __enter__(self):
        self._start = time.monotonic()
        return self

    def __exit__(self, exc_type, exc_val, exc_tb):
        elapsed_ms = (time.monotonic() - self._start) * 1000.0
        observe(self.module, self.operation, elapsed_ms, self.labels)
        incr(self.module, self.operation + '.calls', labels=self.labels)
        if exc_type is not None:
            incr(self.module, self.operation + '.errors', labels=self.labels)
        return False
