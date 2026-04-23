"""
Webhook engine. HMAC-SHA256 signing + verification for outbound signatures
and inbound request authentication.
"""
import hmac
import hashlib


class WebhookSignatureError(ValueError):
    pass


def sign(secret, payload):
    if isinstance(payload, str):
        payload = payload.encode('utf-8')
    if isinstance(secret, str):
        secret = secret.encode('utf-8')
    return hmac.new(secret, payload, hashlib.sha256).hexdigest()


def verify(secret, payload, signature):
    expected = sign(secret, payload)
    if not hmac.compare_digest(expected, signature or ''):
        raise WebhookSignatureError("Webhook signature verification failed")
    return True


def validate_inbound(secret, headers, body):
    """
    Validate an inbound webhook request. `headers` must contain
    X-Signature. The body must be present and bytes-like.
    """
    if not body:
        raise WebhookSignatureError("Empty webhook body rejected")
    signature = headers.get('X-Signature') or headers.get('x-signature')
    if not signature:
        raise WebhookSignatureError("Missing X-Signature header")
    return verify(secret, body, signature)
