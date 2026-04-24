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


class Quotation(TenantAwareModel):
    """CPQ-folded quotation. Derived from a CustomerRequirement."""
    STATUS = [('draft', 'Draft'), ('priced', 'Priced'), ('submitted', 'Submitted'),
              ('accepted', 'Accepted'), ('declined', 'Declined'), ('expired', 'Expired')]
    number = models.CharField(max_length=50, db_index=True)
    customer_requirement = models.ForeignKey(
        CustomerRequirement, on_delete=models.PROTECT, related_name='quotations',
    )
    total_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    currency = models.CharField(max_length=3, default='USD')
    valid_until = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    workflow_instance_id = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'number')


class QuotationLine(TenantAwareModel):
    quotation = models.ForeignKey(Quotation, on_delete=models.CASCADE, related_name='lines')
    item_code = models.CharField(max_length=60)
    description = models.CharField(max_length=255, blank=True, default='')
    qty = models.DecimalField(max_digits=18, decimal_places=4, default=1)
    unit_price = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    extensible_attributes = models.JSONField(default=dict, blank=True)

    @property
    def line_total(self):
        return float(self.qty) * float(self.unit_price)


class SalesOrder(TenantAwareModel):
    STATUS = [('draft', 'Draft'), ('confirmed', 'Confirmed'),
              ('in_production', 'In Production'), ('shipped', 'Shipped'),
              ('invoiced', 'Invoiced'), ('cancelled', 'Cancelled')]
    number = models.CharField(max_length=50, db_index=True)
    quotation = models.ForeignKey(Quotation, null=True, blank=True,
                                  on_delete=models.PROTECT, related_name='sales_orders')
    mode = models.CharField(max_length=30, default='discrete',
                            help_text="Manufacturing mode: eto|discrete|process|job_shop|repetitive|mixed")
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    promised_ship_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'number')


class PriceBook(TenantAwareModel):
    """Configurable list pricing for CPQ."""
    name = models.CharField(max_length=120)
    currency = models.CharField(max_length=3, default='USD')
    is_active = models.BooleanField(default=True)


class PriceBookEntry(TenantAwareModel):
    price_book = models.ForeignKey(PriceBook, on_delete=models.CASCADE, related_name='entries')
    item_code = models.CharField(max_length=60, db_index=True)
    unit_price = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    min_qty = models.DecimalField(max_digits=18, decimal_places=4, default=1)
    effective_from = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'price_book', 'item_code', 'min_qty')
