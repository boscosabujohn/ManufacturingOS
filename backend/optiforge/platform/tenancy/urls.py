from django.urls import path
from .views import TenantProvisioningView

urlpatterns = [
    path('api/v1/tenants/', TenantProvisioningView.as_view(), name='tenant-provisioning'),
]
