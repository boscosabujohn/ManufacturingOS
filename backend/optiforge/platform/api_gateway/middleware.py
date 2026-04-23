"""
Gateway middleware: attaches a correlation id, enforces per-tenant rate
limiting, and wraps unhandled exceptions in the standard error envelope.
"""
import json
import logging

from django.http import JsonResponse

from .context import clear_correlation_id, set_correlation_id
from .envelope import ErrorCode, error_envelope
from .rate_limit import RateLimitExceeded, enforce

logger = logging.getLogger(__name__)


class GatewayMiddleware:
    """
    Order matters — install *after* TenantMiddleware so the tenant id is set.
    """

    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        correlation_id = set_correlation_id(
            request.META.get('HTTP_X_CORRELATION_ID') or None,
        )
        request.correlation_id = correlation_id

        tenant_id = self._resolve_tenant(request)

        try:
            if tenant_id is not None:
                enforce(tenant_id)

            response = self.get_response(request)

        except RateLimitExceeded as exc:
            response = JsonResponse(
                error_envelope(
                    ErrorCode.RATE_LIMITED,
                    "Tenant rate limit exceeded",
                    details={'retry_after': exc.retry_after},
                ),
                status=429,
            )
            response['Retry-After'] = f"{max(1, int(exc.retry_after))}"

        except Exception as exc:
            logger.exception("[Gateway] unhandled error: %s", exc)
            response = JsonResponse(
                error_envelope(
                    ErrorCode.INTERNAL, str(exc) or 'Internal error',
                ),
                status=500,
            )
        finally:
            pass

        response['X-Correlation-Id'] = correlation_id
        clear_correlation_id()
        return response

    @staticmethod
    def _resolve_tenant(request):
        from optiforge.platform.tenancy.context import get_current_tenant_id
        return get_current_tenant_id()
