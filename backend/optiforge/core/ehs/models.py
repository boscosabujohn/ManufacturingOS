"""EHS: incidents, HIRA/JSA, PTW (core), PPE, hazmat/SDS, env monitoring, training, MoC."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Incident(TenantAwareModel):
    SEVERITY = [('near_miss', 'Near Miss'), ('first_aid', 'First Aid'),
                ('recordable', 'Recordable'), ('lti', 'LTI'), ('fatality', 'Fatality')]
    STATUS = [('reported', 'Reported'), ('investigating', 'Investigating'),
              ('closed', 'Closed')]

    number = models.CharField(max_length=50, db_index=True)
    occurred_at = models.DateTimeField()
    location = models.CharField(max_length=255, blank=True, default='')
    severity = models.CharField(max_length=20, choices=SEVERITY)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default='reported')

    class Meta:
        unique_together = ('tenant', 'number')


class HIRAEntry(TenantAwareModel):
    """Hazard Identification & Risk Assessment row."""
    activity = models.CharField(max_length=255)
    hazard = models.CharField(max_length=255)
    likelihood = models.IntegerField(help_text="1-5")
    severity = models.IntegerField(help_text="1-5")
    controls = models.JSONField(default=list, blank=True)

    @property
    def risk_score(self):
        return self.likelihood * self.severity


class JSA(TenantAwareModel):
    """Job Safety Analysis."""
    job_title = models.CharField(max_length=255)
    steps = models.JSONField(default=list, help_text="Ordered list of {step, hazards, controls}")
    approved_by_user_id = models.UUIDField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)


class PPEAllocation(TenantAwareModel):
    employee_ref = models.CharField(max_length=120, help_text="FK-like reference to HR employee")
    ppe_code = models.CharField(max_length=60)
    issued_at = models.DateTimeField(auto_now_add=True)
    size = models.CharField(max_length=20, blank=True, default='')


class SDS(TenantAwareModel):
    """Safety Data Sheet for a hazmat substance."""
    substance_code = models.CharField(max_length=60, db_index=True)
    substance_name = models.CharField(max_length=255)
    hazard_class = models.CharField(max_length=60, blank=True, default='')
    sds_document_id = models.UUIDField(null=True, blank=True)
    issued_on = models.DateField(null=True, blank=True)
    supersedes = models.ForeignKey('self', null=True, blank=True,
                                   on_delete=models.SET_NULL, related_name='superseded_by')


class EnvMonitoringReading(TenantAwareModel):
    parameter = models.CharField(max_length=60, db_index=True)
    value = models.DecimalField(max_digits=18, decimal_places=4)
    unit = models.CharField(max_length=20)
    recorded_at = models.DateTimeField(db_index=True)
    limit_value = models.DecimalField(max_digits=18, decimal_places=4, null=True, blank=True)
    is_exceedance = models.BooleanField(default=False)


class TrainingRecord(TenantAwareModel):
    employee_ref = models.CharField(max_length=120)
    course_code = models.CharField(max_length=60)
    completed_on = models.DateField()
    expires_on = models.DateField(null=True, blank=True)


class ManagementOfChange(TenantAwareModel):
    STATUS = [('draft', 'Draft'), ('review', 'Review'),
              ('approved', 'Approved'), ('implemented', 'Implemented'),
              ('rejected', 'Rejected')]
    number = models.CharField(max_length=50, db_index=True)
    title = models.CharField(max_length=255)
    change_summary = models.TextField()
    hira_reference_id = models.UUIDField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')

    class Meta:
        unique_together = ('tenant', 'number')
