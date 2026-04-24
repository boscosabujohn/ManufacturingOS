"""Concrete test model exercising AuditedTenantModel (tenancy + audit
+ soft-delete). Only loaded under optiforge.test_settings."""
from django.db import models

from optiforge.platform.tenancy.models import AuditedTenantModel


class DummyAuditedEntity(AuditedTenantModel):
    """Minimal concrete entity for the mixin test suite."""

    name = models.CharField(max_length=255)

    class Meta:
        app_label = 'audit_soft_delete_test'
