"""Logistics: inward, outward, reverse, carrier connector hooks."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Shipment(TenantAwareModel):
    DIRECTION = [('outbound', 'Outbound'), ('inbound', 'Inbound'),
                 ('reverse', 'Reverse')]
    STATUS = [('draft', 'Draft'), ('picked', 'Picked'),
              ('in_transit', 'In Transit'), ('delivered', 'Delivered'),
              ('exception', 'Exception'), ('cancelled', 'Cancelled')]

    number = models.CharField(max_length=50, db_index=True)
    direction = models.CharField(max_length=20, choices=DIRECTION)
    reference_type = models.CharField(max_length=60, blank=True, default='',
                                      help_text="sales_order / purchase_order / rma")
    reference_id = models.CharField(max_length=100, blank=True, default='')
    carrier_code = models.CharField(max_length=60, blank=True, default='')
    tracking_number = models.CharField(max_length=120, blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    shipped_at = models.DateTimeField(null=True, blank=True)
    delivered_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')


class ShipmentLine(TenantAwareModel):
    shipment = models.ForeignKey(Shipment, on_delete=models.CASCADE, related_name='lines')
    item_code = models.CharField(max_length=60)
    quantity = models.DecimalField(max_digits=18, decimal_places=4, default=1)


class Carrier(TenantAwareModel):
    code = models.CharField(max_length=60)
    name = models.CharField(max_length=255)
    connector_id = models.CharField(max_length=100, blank=True, default='',
                                    help_text="Matches an integration.Connector's connector_id")

    class Meta:
        unique_together = ('tenant', 'code')
