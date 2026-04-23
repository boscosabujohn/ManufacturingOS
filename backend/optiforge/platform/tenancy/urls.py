from django.urls import path
from .views import TenantProvisioningView, TenantLifecycleView, PackActivationView, PackDeactivationView

urlpatterns = [
    path('api/v1/tenants/', TenantProvisioningView.as_view(), name='tenant-provisioning'),
    path('api/v1/tenants/<uuid:pk>/lifecycle/', TenantLifecycleView.as_view(), name='tenant-lifecycle'),
    path('api/v1/tenants/<uuid:tenant_id>/packs/activate/', PackActivationView.as_view(), name='pack-activate'),
    path('api/v1/tenants/<uuid:tenant_id>/packs/deactivate/', PackDeactivationView.as_view(), name='pack-deactivate'),
]
