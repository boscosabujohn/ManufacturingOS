from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class CustomerRequirement(TenantAwareModel):
    """
    The single core entity for the Phase 1 tracer bullet.
    Captures customer requirements from various sources (BOQ, RFQ, configurator, etc.).
    """
    SOURCE_TYPE_CHOICES = [
        ('catalog_order', 'Catalog Order'),
        ('configurator_order', 'Configurator Order'),
        ('bom_import', 'BOM Import'),
        ('boq_import', 'BOQ Import'),
        ('rfq_spec', 'RFQ Spec'),
        ('contract_release', 'Contract Release'),
        ('forecast_plan', 'Forecast Plan'),
    ]

    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('parsed', 'Parsed'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    source_type = models.CharField(max_length=30, choices=SOURCE_TYPE_CHOICES)
    source_payload = models.JSONField(default=dict, help_text="Raw input payload from the source")
    extensible_attributes = models.JSONField(default=dict, blank=True, help_text="Pack-contributed attributes")
    parsed_lines = models.JSONField(default=list, blank=True, help_text="Parsed line items from the parser")
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"CR-{self.id} ({self.source_type}) [{self.status}]"
