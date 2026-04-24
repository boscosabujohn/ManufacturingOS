"""QMS: IQC/IPQC/OQC, NCR, CAPA, SCAR, SPC, calibration, audit, doc control, change control."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class QualityCheck(TenantAwareModel):
    CHECK_TYPE = [('iqc', 'Incoming'), ('ipqc', 'In-Process'),
                  ('oqc', 'Outgoing'), ('final', 'Final')]
    RESULT = [('pass', 'Pass'), ('fail', 'Fail'), ('pending', 'Pending')]

    check_type = models.CharField(max_length=10, choices=CHECK_TYPE)
    reference_type = models.CharField(max_length=60, blank=True, default='',
                                      help_text="e.g. 'grn', 'work_order', 'shipment'")
    reference_id = models.CharField(max_length=100, blank=True, default='')
    item_code = models.CharField(max_length=60, db_index=True)
    result = models.CharField(max_length=10, choices=RESULT, default='pending')
    inspected_at = models.DateTimeField(auto_now_add=True)
    inspected_by_user_id = models.UUIDField(null=True, blank=True)
    measurements = models.JSONField(default=dict, blank=True)


class NonConformanceReport(TenantAwareModel):
    """NCR — deviation record."""
    STATUS = [('open', 'Open'), ('contained', 'Contained'),
              ('root_caused', 'Root Caused'), ('closed', 'Closed')]

    number = models.CharField(max_length=50, db_index=True)
    quality_check = models.ForeignKey(QualityCheck, null=True, blank=True,
                                      on_delete=models.SET_NULL, related_name='ncrs')
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default='open')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'number')


class CAPA(TenantAwareModel):
    """Corrective and Preventive Action."""
    STATUS = [('open', 'Open'), ('in_progress', 'In Progress'),
              ('verified', 'Verified'), ('closed', 'Closed')]

    number = models.CharField(max_length=50, db_index=True)
    ncr = models.ForeignKey(NonConformanceReport, null=True, blank=True,
                            on_delete=models.SET_NULL, related_name='capas')
    root_cause = models.TextField(blank=True, default='')
    corrective_action = models.TextField(blank=True, default='')
    preventive_action = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS, default='open')
    target_close_date = models.DateField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')


class SupplierCAR(TenantAwareModel):
    """Supplier Corrective Action Request (SCAR)."""
    STATUS = [('issued', 'Issued'), ('supplier_acknowledged', 'Supplier Acknowledged'),
              ('closed', 'Closed')]
    number = models.CharField(max_length=50)
    supplier_code = models.CharField(max_length=60)
    description = models.TextField()
    status = models.CharField(max_length=25, choices=STATUS, default='issued')

    class Meta:
        unique_together = ('tenant', 'number')


class SPCMeasurement(TenantAwareModel):
    characteristic = models.CharField(max_length=60, db_index=True)
    value = models.DecimalField(max_digits=18, decimal_places=4)
    lower_spec = models.DecimalField(max_digits=18, decimal_places=4, null=True, blank=True)
    upper_spec = models.DecimalField(max_digits=18, decimal_places=4, null=True, blank=True)
    measured_at = models.DateTimeField(auto_now_add=True, db_index=True)

    @property
    def is_in_spec(self):
        if self.lower_spec is not None and self.value < self.lower_spec:
            return False
        if self.upper_spec is not None and self.value > self.upper_spec:
            return False
        return True


class CalibrationRecord(TenantAwareModel):
    instrument_code = models.CharField(max_length=60, db_index=True)
    calibrated_on = models.DateField()
    next_due_on = models.DateField()
    certificate_document_id = models.UUIDField(null=True, blank=True)


class QualityAudit(TenantAwareModel):
    STATUS = [('planned', 'Planned'), ('in_progress', 'In Progress'),
              ('reported', 'Reported'), ('closed', 'Closed')]
    audit_type = models.CharField(
        max_length=20,
        choices=[('internal', 'Internal'), ('supplier', 'Supplier'),
                 ('customer', 'Customer'), ('regulatory', 'Regulatory')],
    )
    scheduled_date = models.DateField()
    scope = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS, default='planned')


class DocumentControlItem(TenantAwareModel):
    """Controlled document (SOP / WI / spec) with effective dates."""
    code = models.CharField(max_length=60, db_index=True)
    title = models.CharField(max_length=255)
    rev = models.CharField(max_length=10)
    effective_from = models.DateField()
    supersedes_id = models.UUIDField(null=True, blank=True)
    document_store_id = models.UUIDField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'code', 'rev')


class QualityChangeControl(TenantAwareModel):
    """Change Control for the QMS layer (distinct from PLM ECN/ECO)."""
    STATUS = [('draft', 'Draft'), ('approved', 'Approved'),
              ('implemented', 'Implemented'), ('rejected', 'Rejected')]
    number = models.CharField(max_length=50, db_index=True)
    description = models.TextField()
    status = models.CharField(max_length=20, choices=STATUS, default='draft')

    class Meta:
        unique_together = ('tenant', 'number')
