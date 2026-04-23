from django.urls import path
from .views import CustomerRequirementCreateView, CustomerRequirementListView, CustomerRequirementDetailView

urlpatterns = [
    path('api/v1/customer-requirements/', CustomerRequirementCreateView.as_view(), name='cr-create'),
    path('api/v1/customer-requirements/list/', CustomerRequirementListView.as_view(), name='cr-list'),
    path('api/v1/customer-requirements/<uuid:pk>/', CustomerRequirementDetailView.as_view(), name='cr-detail'),
]
