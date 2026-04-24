"""Core inventory: Item master + lot/batch/serial genealogy."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Item(TenantAwareModel):
    code = models.CharField(max_length=60, db_index=True)
    description = models.CharField(max_length=255)
    uom = models.CharField(max_length=20, default='EA')
    item_class = models.CharField(
        max_length=20,
        choices=[('raw', 'Raw Material'), ('wip', 'WIP'), ('finished', 'Finished Good'),
                 ('service', 'Service')],
        default='raw',
    )
    tracking = models.CharField(
        max_length=20,
        choices=[('none', 'None'), ('lot', 'Lot'), ('batch', 'Batch'),
                 ('serial', 'Serial')],
        default='none',
    )
    is_active = models.BooleanField(default=True)
    extensible_attributes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'code')


class StockUnit(TenantAwareModel):
    """
    Lot / batch / serial instance. Genealogy is captured via parent_unit for
    child units split from a lot.
    """
    item = models.ForeignKey(Item, on_delete=models.PROTECT, related_name='stock_units')
    identifier = models.CharField(max_length=100, db_index=True)
    tracking = models.CharField(
        max_length=20,
        choices=[('lot', 'Lot'), ('batch', 'Batch'), ('serial', 'Serial')],
    )
    parent_unit = models.ForeignKey('self', null=True, blank=True,
                                    on_delete=models.SET_NULL, related_name='children')
    qty = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    location_code = models.CharField(max_length=50, blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=[('available', 'Available'), ('quarantine', 'Quarantine'),
                 ('consumed', 'Consumed'), ('scrapped', 'Scrapped')],
        default='available',
    )
    received_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'item', 'identifier')
