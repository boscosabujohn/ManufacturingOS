"""Test-only Django app that exposes a concrete AuditedTenantModel
subclass so the audit + soft-delete mixins can be exercised end-to-end
without touching real platform/core tables."""
from django.apps import AppConfig


class AuditSoftDeleteTestConfig(AppConfig):
    name = 'tests.audit_soft_delete'
    label = 'audit_soft_delete_test'  # short; avoids collision with platform app labels
    default_auto_field = 'django.db.models.BigAutoField'
