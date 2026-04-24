"""Manufacturing Execution (MES): OEE, ANDON, PLC/SCADA hooks."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class WorkCenter(TenantAwareModel):
    code = models.CharField(max_length=60, db_index=True)
    name = models.CharField(max_length=255)
    is_active = models.BooleanField(default=True)
    plc_endpoint = models.CharField(max_length=255, blank=True, default='',
                                    help_text="opc.tcp:// or modbus:// endpoint; empty if manual")

    class Meta:
        unique_together = ('tenant', 'code')


class ProductionRun(TenantAwareModel):
    """A single execution slice (shift, batch, or order) for OEE/MES."""
    STATUS = [('scheduled', 'Scheduled'), ('running', 'Running'),
              ('paused', 'Paused'), ('completed', 'Completed'),
              ('aborted', 'Aborted')]

    work_order_number = models.CharField(max_length=60, db_index=True)
    work_center = models.ForeignKey(WorkCenter, on_delete=models.PROTECT,
                                    related_name='production_runs')
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    planned_quantity = models.DecimalField(max_digits=18, decimal_places=4)
    produced_quantity = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    scrap_quantity = models.DecimalField(max_digits=18, decimal_places=4, default=0)
    status = models.CharField(max_length=20, choices=STATUS, default='scheduled')

    @property
    def yield_percentage(self):
        if not self.planned_quantity:
            return 0.0
        return float(self.produced_quantity) / float(self.planned_quantity) * 100.0


class AndonEvent(TenantAwareModel):
    EVENT_TYPE = [('quality', 'Quality'), ('maintenance', 'Maintenance'),
                  ('material', 'Material'), ('other', 'Other')]
    STATUS = [('open', 'Open'), ('acknowledged', 'Acknowledged'),
              ('resolved', 'Resolved')]

    work_center = models.ForeignKey(WorkCenter, on_delete=models.CASCADE,
                                    related_name='andon_events')
    event_type = models.CharField(max_length=20, choices=EVENT_TYPE)
    description = models.CharField(max_length=500, blank=True, default='')
    raised_at = models.DateTimeField(auto_now_add=True)
    acknowledged_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='open')


class OEESnapshot(TenantAwareModel):
    """Availability × performance × quality, per work center per period."""
    work_center = models.ForeignKey(WorkCenter, on_delete=models.CASCADE,
                                    related_name='oee_snapshots')
    period_start = models.DateTimeField()
    period_end = models.DateTimeField()
    availability = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    performance = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    quality = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    @property
    def oee(self):
        a, p, q = float(self.availability), float(self.performance), float(self.quality)
        return (a * p * q) / 10_000.0
