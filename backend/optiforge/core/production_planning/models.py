"""Production Planning with MRP deep-run and Routing folded in."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class BOMHeader(TenantAwareModel):
    parent_item_code = models.CharField(max_length=60, db_index=True)
    rev = models.CharField(max_length=10, default='A')
    is_active = models.BooleanField(default=True)

    class Meta:
        unique_together = ('tenant', 'parent_item_code', 'rev')


class BOMLine(TenantAwareModel):
    bom = models.ForeignKey(BOMHeader, on_delete=models.CASCADE, related_name='lines')
    component_item_code = models.CharField(max_length=60)
    quantity_per = models.DecimalField(max_digits=18, decimal_places=6, default=1)
    scrap_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)


class Routing(TenantAwareModel):
    """Folded in from the Phase 1 standalone Routing module (Q8)."""
    item_code = models.CharField(max_length=60, db_index=True)
    rev = models.CharField(max_length=10, default='A')

    class Meta:
        unique_together = ('tenant', 'item_code', 'rev')


class RoutingOperation(TenantAwareModel):
    routing = models.ForeignKey(Routing, on_delete=models.CASCADE, related_name='operations')
    sequence = models.IntegerField()
    work_center_code = models.CharField(max_length=60)
    setup_minutes = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    run_minutes_per_unit = models.DecimalField(max_digits=10, decimal_places=4, default=0)


class MRPRun(TenantAwareModel):
    """A single deep-run MRP execution: captures inputs + summary outputs."""
    STATUS = [('running', 'Running'), ('completed', 'Completed'), ('failed', 'Failed')]
    run_number = models.CharField(max_length=60, db_index=True)
    horizon_days = models.IntegerField(default=180)
    started_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='running')
    shortages_identified = models.IntegerField(default=0)
    planned_orders_created = models.IntegerField(default=0)


class PlannedOrder(TenantAwareModel):
    TYPE = [('make', 'Make'), ('buy', 'Buy'), ('transfer', 'Transfer')]
    STATUS = [('planned', 'Planned'), ('released', 'Released'), ('cancelled', 'Cancelled')]
    mrp_run = models.ForeignKey(MRPRun, null=True, blank=True,
                                on_delete=models.SET_NULL, related_name='planned_orders')
    item_code = models.CharField(max_length=60, db_index=True)
    order_type = models.CharField(max_length=10, choices=TYPE)
    quantity = models.DecimalField(max_digits=18, decimal_places=4)
    required_by = models.DateField()
    status = models.CharField(max_length=20, choices=STATUS, default='planned')


class WorkOrder(TenantAwareModel):
    """Released production order, derived from a planned_order or direct entry."""
    STATUS = [('released', 'Released'), ('in_progress', 'In Progress'),
              ('completed', 'Completed'), ('cancelled', 'Cancelled')]

    number = models.CharField(max_length=50, db_index=True)
    planned_order = models.ForeignKey(PlannedOrder, null=True, blank=True,
                                      on_delete=models.SET_NULL, related_name='work_orders')
    item_code = models.CharField(max_length=60, db_index=True)
    quantity = models.DecimalField(max_digits=18, decimal_places=4)
    status = models.CharField(max_length=20, choices=STATUS, default='released')
    released_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')
