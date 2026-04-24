"""S&OP and Demand Planning: forecasts, MPS, RCCP, ATP/CTP."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class DemandForecast(TenantAwareModel):
    """Statistical forecast per item per period."""
    period_start = models.DateField(db_index=True)
    item_code = models.CharField(max_length=60, db_index=True)
    forecast_qty = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    method = models.CharField(
        max_length=30,
        choices=[('moving_average', 'Moving Average'),
                 ('exp_smoothing', 'Exponential Smoothing'),
                 ('consensus', 'Consensus'),
                 ('manual', 'Manual')],
        default='moving_average',
    )
    confidence = models.FloatField(default=0.5)
    version = models.IntegerField(default=1)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'period_start', 'item_code', 'version')


class MasterProductionSchedule(TenantAwareModel):
    """MPS line: quantity per item per period."""
    period_start = models.DateField(db_index=True)
    item_code = models.CharField(max_length=60, db_index=True)
    qty = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    status = models.CharField(
        max_length=20,
        choices=[('proposed', 'Proposed'), ('approved', 'Approved'),
                 ('frozen', 'Frozen')],
        default='proposed',
    )

    class Meta:
        unique_together = ('tenant', 'period_start', 'item_code')


class RoughCutCapacityPlan(TenantAwareModel):
    """RCCP: capacity demand vs. availability per resource per period."""
    period_start = models.DateField(db_index=True)
    resource_code = models.CharField(max_length=60)
    required_hours = models.DecimalField(max_digits=12, decimal_places=2, default=0)
    available_hours = models.DecimalField(max_digits=12, decimal_places=2, default=0)

    @property
    def shortfall_hours(self):
        return max(0, float(self.required_hours) - float(self.available_hours))


class ATPQuote(TenantAwareModel):
    """Available-to-promise / capable-to-promise quote for a customer requirement."""
    customer_requirement_id = models.UUIDField()
    promise_date = models.DateField()
    promise_qty = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    is_ctp = models.BooleanField(default=False, help_text="True = capable-to-promise (plan+make)")
    created_at = models.DateTimeField(auto_now_add=True)


class ConsensusRound(TenantAwareModel):
    """A round of the consensus cycle locking a forecast version."""
    cycle_name = models.CharField(max_length=120)
    forecast_version = models.IntegerField()
    status = models.CharField(
        max_length=20,
        choices=[('open', 'Open'), ('locked', 'Locked')],
        default='open',
    )
    locked_at = models.DateTimeField(null=True, blank=True)
