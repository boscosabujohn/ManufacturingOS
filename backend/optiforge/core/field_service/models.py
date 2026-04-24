"""Field Service / Aftermarket: installed base, warranty, AMC/SLA, dispatch, RMA."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class InstalledBaseUnit(TenantAwareModel):
    serial_number = models.CharField(max_length=100, db_index=True)
    item_code = models.CharField(max_length=60)
    customer_account_id = models.UUIDField()
    location = models.CharField(max_length=255, blank=True, default='')
    installed_on = models.DateField(null=True, blank=True)
    warranty_until = models.DateField(null=True, blank=True)
    status = models.CharField(
        max_length=20,
        choices=[('active', 'Active'), ('retired', 'Retired'),
                 ('lost', 'Lost')],
        default='active',
    )

    class Meta:
        unique_together = ('tenant', 'serial_number')


class ServiceContract(TenantAwareModel):
    CONTRACT_TYPE = [('amc', 'AMC'), ('sla', 'SLA'), ('warranty', 'Warranty')]
    number = models.CharField(max_length=50, db_index=True)
    customer_account_id = models.UUIDField()
    contract_type = models.CharField(max_length=20, choices=CONTRACT_TYPE, default='amc')
    start_date = models.DateField()
    end_date = models.DateField()
    response_sla_hours = models.IntegerField(null=True, blank=True)
    resolution_sla_hours = models.IntegerField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')


class ServiceDispatch(TenantAwareModel):
    STATUS = [('scheduled', 'Scheduled'), ('en_route', 'En Route'),
              ('on_site', 'On Site'), ('completed', 'Completed'),
              ('cancelled', 'Cancelled')]
    number = models.CharField(max_length=50, db_index=True)
    installed_unit = models.ForeignKey(InstalledBaseUnit, on_delete=models.PROTECT,
                                       related_name='dispatches')
    scheduled_at = models.DateTimeField()
    technician_user_id = models.UUIDField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='scheduled')
    completed_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')


class RMA(TenantAwareModel):
    """Return Merchandise Authorisation."""
    STATUS = [('requested', 'Requested'), ('approved', 'Approved'),
              ('returned', 'Returned'), ('refunded', 'Refunded'),
              ('rejected', 'Rejected')]
    number = models.CharField(max_length=50, db_index=True)
    installed_unit = models.ForeignKey(InstalledBaseUnit, null=True, blank=True,
                                       on_delete=models.SET_NULL, related_name='rmas')
    reason = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS, default='requested')
    raised_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'number')
