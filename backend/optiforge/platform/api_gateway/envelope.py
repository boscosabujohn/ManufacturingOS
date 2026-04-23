"""
Standard error envelope. Every endpoint (REST or GraphQL) returns:

    { "error_code": "...", "message": "...", "details": {...}, "correlation_id": "..." }

The standard set of error_code values is enumerated here so clients can
handle them programmatically.
"""
from .context import get_correlation_id


class ErrorCode:
    INVALID_INPUT = 'INVALID_INPUT'
    NOT_FOUND = 'NOT_FOUND'
    UNAUTHENTICATED = 'UNAUTHENTICATED'
    FORBIDDEN = 'FORBIDDEN'
    RATE_LIMITED = 'RATE_LIMITED'
    CONFLICT = 'CONFLICT'
    IDEMPOTENCY_CONFLICT = 'IDEMPOTENCY_CONFLICT'
    PACK_FAILURE = 'PACK_FAILURE'
    INTERNAL = 'INTERNAL'


def error_envelope(error_code, message, details=None, correlation_id=None):
    return {
        'error_code': error_code,
        'message': message,
        'details': details or {},
        'correlation_id': correlation_id or get_correlation_id(),
    }
