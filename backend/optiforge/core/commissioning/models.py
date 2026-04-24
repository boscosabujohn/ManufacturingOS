"""Commissioning & Installation: on-site workflow, handover, installed-base creation."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class CommissioningPlan(TenantAwareModel):
    STATUS = [('draft', 'Draft'), ('in_progress', 'In Progress'),
              ('completed', 'Completed'), ('cancelled', 'Cancelled')]

    number = models.CharField(max_length=50, db_index=True)
    sales_order_id = models.UUIDField(db_index=True)
    site_location = models.CharField(max_length=255, blank=True, default='')
    planned_start = models.DateField(null=True, blank=True)
    planned_end = models.DateField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')

    class Meta:
        unique_together = ('tenant', 'number')


class CommissioningStep(TenantAwareModel):
    """One ordered step within a commissioning plan."""
    plan = models.ForeignKey(CommissioningPlan, on_delete=models.CASCADE, related_name='steps')
    sequence = models.IntegerField()
    title = models.CharField(max_length=255)
    instructions = models.TextField(blank=True, default='')
    is_qc_gate = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)
    result = models.CharField(
        max_length=20,
        choices=[('pending', 'Pending'), ('pass', 'Pass'), ('fail', 'Fail')],
        default='pending',
    )


class HandoverCertificate(TenantAwareModel):
    plan = models.OneToOneField(CommissioningPlan, on_delete=models.CASCADE,
                                related_name='handover_certificate')
    issued_at = models.DateTimeField(auto_now_add=True)
    issued_by_user_id = models.UUIDField(null=True, blank=True)
    customer_signature_document_id = models.UUIDField(null=True, blank=True)
    installed_unit_id = models.UUIDField(null=True, blank=True,
                                         help_text="Link to field_service.InstalledBaseUnit")
