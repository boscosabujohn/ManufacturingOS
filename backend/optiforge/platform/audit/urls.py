from django.urls import path
from .views import AuditHistoryView

urlpatterns = [
    path('api/v1/audit/', AuditHistoryView.as_view(), name='audit-history'),
]
