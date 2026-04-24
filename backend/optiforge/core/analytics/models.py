"""Analytics & BI: unified warehouse, semantic layer, dashboards, embed hooks."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class SemanticModel(TenantAwareModel):
    """A BI semantic layer definition — dimensions + measures keyed by name."""
    name = models.CharField(max_length=120, db_index=True)
    version = models.IntegerField(default=1)
    dimensions = models.JSONField(default=list,
                                  help_text="List of {name, source_column, data_type}")
    measures = models.JSONField(default=list,
                                help_text="List of {name, aggregation, source_column}")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'name', 'version')


class Dashboard(TenantAwareModel):
    name = models.CharField(max_length=120, db_index=True)
    module_code = models.CharField(max_length=60)
    layout = models.JSONField(default=dict)
    is_default = models.BooleanField(default=False)

    class Meta:
        unique_together = ('tenant', 'module_code', 'name')


class EmbedHookRegistration(TenantAwareModel):
    """External BI tool (e.g. Tableau, Power BI, Metabase) embed endpoint config."""
    tool_code = models.CharField(max_length=40)
    endpoint_url = models.URLField()
    shared_secret_cipher = models.TextField(blank=True, default='',
                                            help_text="Encrypted secret — stored by platform.audit keystore")
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('tenant', 'tool_code')


class WarehouseExtract(TenantAwareModel):
    """Extract run record for the unified warehouse pipeline."""
    STATUS = [('running', 'Running'), ('completed', 'Completed'), ('failed', 'Failed')]
    source_module = models.CharField(max_length=60)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    rows_exported = models.BigIntegerField(default=0)
    status = models.CharField(max_length=20, choices=STATUS, default='running')
