import uuid
from django.db import models


class PackRegistry(models.Model):
    """
    Stores registered pack manifests per tenant.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    pack_id = models.CharField(max_length=100, db_index=True, help_text="Unique pack identifier from manifest")
    name = models.CharField(max_length=255)
    version = models.CharField(max_length=50)
    manifest = models.JSONField(help_text="Full parsed manifest content")
    tenant_id = models.UUIDField(db_index=True, null=True, blank=True, help_text="Null = global registration; set = per-tenant activation")
    is_active = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        unique_together = ('pack_id', 'tenant_id')

    def __str__(self):
        return f"{self.name} v{self.version} ({'active' if self.is_active else 'inactive'})"
