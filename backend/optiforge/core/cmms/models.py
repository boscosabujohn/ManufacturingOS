"""CMMS/EAM: asset register, PM, PdM, maintenance WO, MTBF/MTTR/OEE, PTW."""
from decimal import Decimal
from django.db import models
from django.utils import timezone
from optiforge.platform.tenancy.models import TenantAwareModel


class Asset(TenantAwareModel):
    code = models.CharField(max_length=60, db_index=True)
    name = models.CharField(max_length=255)
    location_code = models.CharField(max_length=80, blank=True, default='')
    status = models.CharField(
        max_length=20,
        choices=[('in_service', 'In Service'), ('out_of_service', 'Out of Service'),
                 ('retired', 'Retired')],
        default='in_service',
    )
    commissioned_on = models.DateField(null=True, blank=True)
    extensible_attributes = models.JSONField(default=dict, blank=True)

    class Meta:
        unique_together = ('tenant', 'code')


class PreventiveMaintenance(TenantAwareModel):
    """PM plan for an asset: recurrence + instructions."""
    FREQ = [('daily', 'Daily'), ('weekly', 'Weekly'),
            ('monthly', 'Monthly'), ('quarterly', 'Quarterly'),
            ('yearly', 'Yearly'), ('running_hours', 'Running Hours')]

    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='pm_plans')
    name = models.CharField(max_length=255)
    frequency = models.CharField(max_length=20, choices=FREQ, default='monthly')
    interval_value = models.IntegerField(default=1)
    instructions = models.TextField(blank=True, default='')
    last_executed = models.DateTimeField(null=True, blank=True)


class MaintenanceWorkOrder(TenantAwareModel):
    WO_TYPE = [('pm', 'Preventive'), ('cm', 'Corrective'), ('pdm', 'Predictive')]
    STATUS = [('open', 'Open'), ('in_progress', 'In Progress'),
              ('completed', 'Completed'), ('cancelled', 'Cancelled')]

    number = models.CharField(max_length=50, db_index=True)
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT, related_name='work_orders')
    wo_type = models.CharField(max_length=10, choices=WO_TYPE, default='cm')
    status = models.CharField(max_length=20, choices=STATUS, default='open')
    ptw_reference = models.CharField(max_length=100, blank=True, default='',
                                     help_text="Permit-to-Work reference, if required")
    started_at = models.DateTimeField(null=True, blank=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    downtime_minutes = models.IntegerField(default=0)

    class Meta:
        unique_together = ('tenant', 'number')


class ReliabilityMetric(TenantAwareModel):
    """Stored MTBF/MTTR/OEE snapshot per asset per period."""
    asset = models.ForeignKey(Asset, on_delete=models.CASCADE, related_name='reliability_metrics')
    period_start = models.DateField()
    mtbf_hours = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    mttr_hours = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    oee_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    availability = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    performance = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    quality = models.DecimalField(max_digits=5, decimal_places=2, default=0)

    class Meta:
        unique_together = ('tenant', 'asset', 'period_start')


class PermitToWork(TenantAwareModel):
    """PTW record for hazardous maintenance activities."""
    STATUS = [('requested', 'Requested'), ('approved', 'Approved'),
              ('active', 'Active'), ('closed', 'Closed'),
              ('rejected', 'Rejected')]
    number = models.CharField(max_length=50, db_index=True)
    asset = models.ForeignKey(Asset, on_delete=models.PROTECT)
    hazards = models.JSONField(default=list, blank=True)
    controls = models.JSONField(default=list, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='requested')
    approved_by_user_id = models.UUIDField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    valid_from = models.DateTimeField(null=True, blank=True)
    valid_until = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')
