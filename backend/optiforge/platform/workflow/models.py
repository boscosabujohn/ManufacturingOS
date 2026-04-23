import uuid
from django.db import models


class WorkflowDefinition(models.Model):
    """
    A versioned JSON state-machine definition owned by 'core' or a pack.
    A single workflow_id may have many versions; at most one version is is_active=True.
    Definitions are global (not tenant-scoped) — per-tenant variance happens via
    pack activation, not per-tenant definition copies.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow_id = models.CharField(max_length=100, db_index=True)
    version = models.CharField(max_length=50)
    owner = models.CharField(max_length=100, default='core', help_text="'core' or a pack_id")
    definition = models.JSONField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('workflow_id', 'version')
        indexes = [
            models.Index(fields=['workflow_id', 'is_active']),
        ]

    def __str__(self):
        return f"{self.workflow_id} v{self.version} ({self.owner})"


class WorkflowInsertion(models.Model):
    """
    A pack-registered insertion of a step at a named insertion point on a core workflow.
    Insertions are merged into the resolved definition at instance start time.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow_id = models.CharField(max_length=100, db_index=True)
    pack_id = models.CharField(max_length=100, db_index=True)
    insertion_point = models.CharField(max_length=100)
    step = models.JSONField(help_text="Step JSON to splice in at the insertion point")
    load_order = models.IntegerField(default=0, help_text="Lower runs first among co-located insertions")
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('workflow_id', 'pack_id', 'insertion_point')
        ordering = ['load_order']


class WorkflowInstance(models.Model):
    """
    A running execution of a workflow. The resolved_definition is snapshotted at
    start() so mid-flight changes to WorkflowDefinition or WorkflowInsertion
    never mutate running instances.
    """
    STATUS_CHOICES = [
        ('running', 'Running'),
        ('completed', 'Completed'),
        ('failed', 'Failed'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    workflow_id = models.CharField(max_length=100, db_index=True)
    definition_version = models.CharField(max_length=50)
    resolved_definition = models.JSONField(
        help_text="Core + pack insertions merged at start; never mutated thereafter"
    )
    tenant_id = models.UUIDField(db_index=True, null=True, blank=True)
    current_step = models.CharField(max_length=100)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='running')
    history = models.JSONField(default=list, help_text="Ordered list of transition records")
    context = models.JSONField(default=dict, help_text="Mutable state carried through the instance")
    active_packs = models.JSONField(default=list, help_text="Pack ids active at start")
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def __str__(self):
        return f"{self.workflow_id} v{self.definition_version} #{self.id} @ {self.current_step}"
