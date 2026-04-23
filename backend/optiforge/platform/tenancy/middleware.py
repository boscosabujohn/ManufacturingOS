from django.http import JsonResponse
from optiforge.platform.tenancy.context import set_current_tenant_id, _current_tenant_id

class TenantMiddleware:
    """
    Middleware to extract the tenant ID from the request headers and set it in the context.
    """
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        tenant_id = request.headers.get('X-Tenant-ID')
        if tenant_id:
            token = set_current_tenant_id(tenant_id)
            try:
                response = self.get_response(request)
            finally:
                _current_tenant_id.reset(token)
        else:
            # No tenant provided; BaseTenantRepository will block access to tenant-scoped data
            response = self.get_response(request)
            
        return response
