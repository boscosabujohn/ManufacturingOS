"""
ETO mode extension: the Layer-3 behaviours packs and core compose with when
ETO is the active manufacturing mode.
"""
from decimal import Decimal
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class DesignLock(TenantAwareModel):
    """
    Enforces that a sales order's design is frozen before work orders release.
    A locked design blocks direct edits; changes must flow through a
    ChangeOrder record.
    """
    sales_order_id = models.UUIDField(unique=True, db_index=True)
    locked_at = models.DateTimeField(auto_now_add=True)
    locked_by = models.UUIDField(null=True, blank=True)
    design_snapshot = models.JSONField(default=dict, blank=True,
                                       help_text="BOM/routing/spec state at lock time")
    unlocked_at = models.DateTimeField(null=True, blank=True)


class ChangeOrderRequest(TenantAwareModel):
    """Post-lock change request with required cost impact calculation."""
    STATUS = [('submitted', 'Submitted'),
              ('cost_impact_pending', 'Cost Impact Pending'),
              ('approved', 'Approved'), ('rejected', 'Rejected'),
              ('implemented', 'Implemented'),
              ('cancelled', 'Cancelled')]

    sales_order_id = models.UUIDField(db_index=True)
    number = models.CharField(max_length=50, db_index=True)
    reason = models.TextField(blank=True, default='')
    status = models.CharField(max_length=30, choices=STATUS, default='submitted')
    submitted_by = models.UUIDField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    cost_impact = models.DecimalField(max_digits=18, decimal_places=2, null=True, blank=True)
    schedule_impact_days = models.IntegerField(null=True, blank=True)
    approved_at = models.DateTimeField(null=True, blank=True)

    class Meta:
        unique_together = ('tenant', 'number')


class ProjectWorkOrderLink(TenantAwareModel):
    """
    Binds an ETO sales order to a Project + WBS node so work orders, costs,
    and milestones are attributed correctly.
    """
    sales_order_id = models.UUIDField(db_index=True)
    project_id = models.UUIDField(db_index=True)
    wbs_node_id = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)


class MilestoneBillingSchedule(TenantAwareModel):
    """Milestone-based billing plan for an ETO sales order."""
    sales_order_id = models.UUIDField(db_index=True)
    milestone_code = models.CharField(max_length=50)
    description = models.CharField(max_length=255, blank=True, default='')
    percentage = models.DecimalField(max_digits=5, decimal_places=2)
    target_date = models.DateField(null=True, blank=True)
    invoiced_at = models.DateTimeField(null=True, blank=True)
    invoice_ref = models.CharField(max_length=100, blank=True, default='')

    class Meta:
        unique_together = ('tenant', 'sales_order_id', 'milestone_code')


class RetentionPolicy(TenantAwareModel):
    """Retention money held back until warranty expiry or handover milestone."""
    sales_order_id = models.UUIDField(db_index=True)
    retention_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    release_on_milestone = models.CharField(max_length=50, blank=True, default='')
    retention_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    released_at = models.DateTimeField(null=True, blank=True)


class LiquidatedDamages(TenantAwareModel):
    """LD terms for late delivery."""
    sales_order_id = models.UUIDField(db_index=True)
    per_day_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)
    cap_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=10)
    applied_amount = models.DecimalField(max_digits=18, decimal_places=2, default=0)


class SiteSurvey(TenantAwareModel):
    """Pre-production site survey capturing as-is dimensions and constraints."""
    STATUS = [('scheduled', 'Scheduled'), ('completed', 'Completed'),
              ('cancelled', 'Cancelled')]
    sales_order_id = models.UUIDField(db_index=True)
    scheduled_date = models.DateField(null=True, blank=True)
    surveyed_at = models.DateTimeField(null=True, blank=True)
    surveyor_user_id = models.UUIDField(null=True, blank=True)
    findings = models.JSONField(default=dict, blank=True)
    status = models.CharField(max_length=20, choices=STATUS, default='scheduled')
