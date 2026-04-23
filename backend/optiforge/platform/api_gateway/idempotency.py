"""
Idempotency-Key handling for write endpoints. Clients submit the same key
to guarantee a write happens at most once; the stored response is returned
on replay.
"""
import hashlib
import json

from .envelope import ErrorCode, error_envelope
from .models import IdempotencyRecord


class IdempotencyConflict(Exception):
    def __init__(self, existing_fingerprint, new_fingerprint):
        self.existing_fingerprint = existing_fingerprint
        self.new_fingerprint = new_fingerprint
        super().__init__(
            "Idempotency-Key replay with a different request body is rejected."
        )


def request_fingerprint(method, path, body):
    payload = json.dumps({'m': method, 'p': path, 'b': body},
                         sort_keys=True, default=str)
    return hashlib.sha256(payload.encode('utf-8')).hexdigest()


def remember(tenant_id, key, method, path, body, response_status, response_body):
    fp = request_fingerprint(method, path, body)
    existing = IdempotencyRecord.objects.filter(
        tenant_id=tenant_id, key=key, method=method, path=path,
    ).first()
    if existing:
        if existing.request_fingerprint != fp:
            raise IdempotencyConflict(existing.request_fingerprint, fp)
        return existing
    return IdempotencyRecord.objects.create(
        tenant_id=tenant_id, key=key, method=method, path=path,
        request_fingerprint=fp,
        response_status=response_status, response_body=response_body,
    )


def replay(tenant_id, key, method, path):
    return IdempotencyRecord.objects.filter(
        tenant_id=tenant_id, key=key, method=method, path=path,
    ).first()


def handle_write(tenant_id, key, method, path, body, do_write):
    """
    High-level entry point. If the key has already been seen and body matches,
    returns the stored response. If not seen, runs `do_write()` and stores
    its (status, body). If body differs from the stored one, returns a
    standard error envelope with IDEMPOTENCY_CONFLICT.
    """
    if not key:
        status, response_body = do_write()
        return status, response_body

    prior = replay(tenant_id, key, method, path)
    fp = request_fingerprint(method, path, body)
    if prior:
        if prior.request_fingerprint != fp:
            return 409, error_envelope(
                ErrorCode.IDEMPOTENCY_CONFLICT,
                "Idempotency-Key replay with different body",
            )
        return prior.response_status, prior.response_body

    status, response_body = do_write()
    remember(tenant_id, key, method, path, body, status, response_body)
    return status, response_body
