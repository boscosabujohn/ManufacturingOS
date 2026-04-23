from rest_framework import generics
from rest_framework.response import Response
from .models import Tenant
from .serializers import TenantSerializer

class TenantProvisioningView(generics.CreateAPIView):
    """
    API endpoint to provision a new tenant.
    No tenant context is required to create a tenant since the tenant itself is what provides the context.
    """
    queryset = Tenant.objects.all()
    serializer_class = TenantSerializer
    
    # In Phase 1, we allow unauthenticated provisioning for ease of scaffolding, or we require some admin auth.
    # We will leave authentication open until P1-03 (Identity).
    
    def create(self, request, *args, **kwargs):
        # We might want to set up some initial data here eventually, but for now we just create the record
        return super().create(request, *args, **kwargs)
