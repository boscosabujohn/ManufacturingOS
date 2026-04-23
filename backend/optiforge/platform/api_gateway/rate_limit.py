"""
Per-tenant token-bucket rate limiter. In-memory for Phase 2 — swap in
Redis behind `_buckets` for a real deployment without changing callers.
"""
import time
from collections import defaultdict
from threading import Lock


class RateLimitExceeded(Exception):
    def __init__(self, tenant_id, retry_after):
        self.tenant_id = tenant_id
        self.retry_after = retry_after
        super().__init__(
            f"Tenant {tenant_id} exceeded rate limit; retry after {retry_after:.1f}s"
        )


class TokenBucket:
    """Classic token-bucket: `capacity` tokens refilled at `rate` per second."""
    def __init__(self, capacity, rate_per_second):
        self.capacity = float(capacity)
        self.rate = float(rate_per_second)
        self.tokens = float(capacity)
        self.updated = time.monotonic()
        self.lock = Lock()

    def try_consume(self, cost=1.0):
        with self.lock:
            now = time.monotonic()
            elapsed = now - self.updated
            self.tokens = min(self.capacity, self.tokens + elapsed * self.rate)
            self.updated = now
            if self.tokens >= cost:
                self.tokens -= cost
                return True, 0.0
            deficit = cost - self.tokens
            retry_after = deficit / self.rate if self.rate > 0 else float('inf')
            return False, retry_after


_buckets = {}
_lock = Lock()
_config = {'default_capacity': 120, 'default_rate_per_second': 2.0}
_overrides = defaultdict(dict)  # tenant_id -> {'capacity': n, 'rate_per_second': r}


def configure_defaults(capacity, rate_per_second):
    _config['default_capacity'] = capacity
    _config['default_rate_per_second'] = rate_per_second


def set_tenant_limit(tenant_id, capacity, rate_per_second):
    _overrides[tenant_id] = {'capacity': capacity, 'rate_per_second': rate_per_second}
    _buckets.pop(tenant_id, None)


def reset():
    with _lock:
        _buckets.clear()
        _overrides.clear()


def enforce(tenant_id):
    """
    Raise RateLimitExceeded if the tenant's bucket is empty.
    Returns the current remaining budget on success.
    """
    with _lock:
        if tenant_id not in _buckets:
            override = _overrides.get(tenant_id)
            capacity = override['capacity'] if override else _config['default_capacity']
            rate = override['rate_per_second'] if override else _config['default_rate_per_second']
            _buckets[tenant_id] = TokenBucket(capacity, rate)
        bucket = _buckets[tenant_id]
    ok, retry_after = bucket.try_consume()
    if not ok:
        raise RateLimitExceeded(tenant_id, retry_after)
    return bucket.tokens
