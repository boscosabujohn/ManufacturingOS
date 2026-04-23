"""
TOTP implementation (RFC 6238) using HMAC-SHA1. No external dependency.
Admin roles are required to have MFAConfig.is_enabled = True with a secret
that verifies via `verify(secret, otp)`.
"""
import base64
import hashlib
import hmac
import secrets
import struct
import time


TOTP_STEP_SECONDS = 30
TOTP_DIGITS = 6


def generate_secret(length_bytes=20):
    return base64.b32encode(secrets.token_bytes(length_bytes)).decode('ascii')


def _decode_secret(secret):
    padded = secret + '=' * (-len(secret) % 8)
    return base64.b32decode(padded.upper())


def _totp_code(secret_bytes, timestamp, step=TOTP_STEP_SECONDS, digits=TOTP_DIGITS):
    counter = int(timestamp // step)
    counter_bytes = struct.pack('>Q', counter)
    hmac_digest = hmac.new(secret_bytes, counter_bytes, hashlib.sha1).digest()
    offset = hmac_digest[-1] & 0x0F
    raw = struct.unpack('>I', hmac_digest[offset:offset + 4])[0] & 0x7FFFFFFF
    return str(raw % (10 ** digits)).zfill(digits)


def generate_code(secret, at=None):
    secret_bytes = _decode_secret(secret)
    at = at if at is not None else time.time()
    return _totp_code(secret_bytes, at)


def verify(secret, otp, at=None, window=1):
    """
    Verify a TOTP against the secret. Accepts the current step plus
    +/- `window` adjacent steps to allow for small clock drift.
    """
    secret_bytes = _decode_secret(secret)
    at = at if at is not None else time.time()
    for offset in range(-window, window + 1):
        candidate = _totp_code(secret_bytes, at + offset * TOTP_STEP_SECONDS)
        if hmac.compare_digest(candidate, otp):
            return True
    return False
