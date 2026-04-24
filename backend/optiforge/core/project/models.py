from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Project(TenantAwareModel):
    STATUS = [('planning', 'Planning'), ('active', 'Active'),
              ('on_hold', 'On Hold'), ('completed', 'Completed'),
              ('cancelled', 'Cancelled')]
    code = models.CharField(max_length=50, db_index=True)
    name = models.CharField(max_length=255)
    status = models.CharField(max_length=20, choices=STATUS, default='planning')
    start_date = models.DateField(null=True, blank=True)
    target_end_date = models.DateField(null=True, blank=True)
    actual_end_date = models.DateField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'code')


class WBSNode(TenantAwareModel):
    """Work Breakdown Structure node. Hierarchical via parent."""
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='wbs_nodes')
    parent = models.ForeignKey('self', null=True, blank=True,
                               on_delete=models.CASCADE, related_name='children')
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    sequence = models.IntegerField(default=0)
    is_leaf = models.BooleanField(default=True)
    planned_effort_hours = models.DecimalField(max_digits=10, decimal_places=2, default=0)

    class Meta:
        unique_together = ('tenant', 'project', 'code')


class Milestone(TenantAwareModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='milestones')
    name = models.CharField(max_length=255)
    target_date = models.DateField()
    achieved_date = models.DateField(null=True, blank=True)
    invoice_percentage = models.DecimalField(max_digits=5, decimal_places=2, default=0,
                                             help_text="Percentage of contract value invoiceable at this milestone")


class ResourceAllocation(TenantAwareModel):
    project = models.ForeignKey(Project, on_delete=models.CASCADE, related_name='allocations')
    wbs_node = models.ForeignKey(WBSNode, on_delete=models.CASCADE, related_name='allocations')
    resource_ref = models.CharField(max_length=120, help_text="FK-like reference to HR employee or role")
    hours = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    start_date = models.DateField(null=True, blank=True)
    end_date = models.DateField(null=True, blank=True)
