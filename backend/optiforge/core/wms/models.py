"""WMS: Warehouses + bin-level locations + RF task orchestration."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Warehouse(TenantAwareModel):
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    address = models.TextField(blank=True, default='')

    class Meta:
        unique_together = ('tenant', 'code')


class Bin(TenantAwareModel):
    """Bin-level location. aisle/rack/level/position identify a bin within a warehouse."""
    warehouse = models.ForeignKey(Warehouse, on_delete=models.CASCADE, related_name='bins')
    code = models.CharField(max_length=80, db_index=True,
                            help_text="Canonical bin code, e.g. 'A01-R03-L02-P05'")
    aisle = models.CharField(max_length=20, blank=True, default='')
    rack = models.CharField(max_length=20, blank=True, default='')
    level = models.CharField(max_length=20, blank=True, default='')
    position = models.CharField(max_length=20, blank=True, default='')
    zone = models.CharField(max_length=50, blank=True, default='', db_index=True)
    capacity = models.DecimalField(max_digits=18, decimal_places=4, null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('blocked', 'Blocked'), ('full', 'Full')],
        default='active',
    )

    class Meta:
        unique_together = ('tenant', 'warehouse', 'code')


class RFTask(TenantAwareModel):
    """Handheld-RF work item: putaway / pick / move / count."""
    TASK_TYPE = [('putaway', 'Putaway'), ('pick', 'Pick'),
                 ('move', 'Move'), ('count', 'Count')]
    STATUS = [('pending', 'Pending'), ('in_progress', 'In Progress'),
              ('completed', 'Completed'), ('cancelled', 'Cancelled')]

    task_type = models.CharField(max_length=20, choices=TASK_TYPE)
    source_bin = models.ForeignKey(Bin, null=True, blank=True, on_delete=models.SET_NULL,
                                   related_name='outgoing_tasks')
    target_bin = models.ForeignKey(Bin, null=True, blank=True, on_delete=models.SET_NULL,
                                   related_name='incoming_tasks')
    item_code = models.CharField(max_length=60)
    qty = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    status = models.CharField(max_length=20, choices=STATUS, default='pending')
    assigned_to_user_id = models.UUIDField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
