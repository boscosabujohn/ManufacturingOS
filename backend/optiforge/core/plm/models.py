"""PLM: Part master, revisions, ECR/ECO/ECN, drawing vault links."""
from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Part(TenantAwareModel):
    part_number = models.CharField(max_length=60, db_index=True)
    name = models.CharField(max_length=255)
    description = models.TextField(blank=True, default='')
    uom = models.CharField(max_length=20, default='EA')
    is_active = models.BooleanField(default=True)
    extensible_attributes = models.JSONField(default=dict, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'part_number')


class PartRevision(TenantAwareModel):
    STATUS = [('draft', 'Draft'), ('released', 'Released'),
              ('obsolete', 'Obsolete')]
    part = models.ForeignKey(Part, on_delete=models.CASCADE, related_name='revisions')
    rev_code = models.CharField(max_length=10)
    status = models.CharField(max_length=20, choices=STATUS, default='draft')
    released_at = models.DateTimeField(null=True, blank=True)
    drawing_document_id = models.UUIDField(null=True, blank=True,
                                           help_text="Link to documents.Document")

    class Meta:
        unique_together = ('tenant', 'part', 'rev_code')


class ChangeRequest(TenantAwareModel):
    """ECR: initial change proposal."""
    STATUS = [('open', 'Open'), ('approved', 'Approved'),
              ('rejected', 'Rejected'), ('closed', 'Closed')]
    number = models.CharField(max_length=50, db_index=True)
    title = models.CharField(max_length=255)
    reason = models.TextField(blank=True, default='')
    status = models.CharField(max_length=20, choices=STATUS, default='open')
    created_at = models.DateTimeField(auto_now_add=True)


class ChangeOrder(TenantAwareModel):
    """ECO: approved, scheduled change action referencing one or more parts."""
    STATUS = [('planned', 'Planned'), ('released', 'Released'),
              ('implemented', 'Implemented'), ('cancelled', 'Cancelled')]
    change_request = models.ForeignKey(ChangeRequest, on_delete=models.PROTECT,
                                       related_name='change_orders')
    number = models.CharField(max_length=50, db_index=True)
    status = models.CharField(max_length=20, choices=STATUS, default='planned')
    target_release_date = models.DateField(null=True, blank=True)
    implemented_at = models.DateTimeField(null=True, blank=True)


class ChangeNotice(TenantAwareModel):
    """ECN: published notice once the change has been executed."""
    change_order = models.ForeignKey(ChangeOrder, on_delete=models.CASCADE,
                                     related_name='change_notices')
    number = models.CharField(max_length=50)
    issued_at = models.DateTimeField(auto_now_add=True)
    summary = models.TextField(blank=True, default='')
