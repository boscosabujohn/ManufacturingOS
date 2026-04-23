import uuid
import hashlib
import json
from django.db import models
from django.db.models import Q
from django.utils import timezone


class AuditRecord(models.Model):
    """
    Hash-chained audit record for every mutation on tenant-scoped entities.
    Each record chains to the previous record for the same (entity_type, entity_id) pair
    via previous_hash / this_hash, forming a tamper-evident log.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True)
    actor = models.CharField(max_length=255, blank=True, default='system')
    timestamp = models.DateTimeField(default=timezone.now, db_index=True)
    entity_type = models.CharField(max_length=255, db_index=True)
    entity_id = models.CharField(max_length=255, db_index=True)
    operation = models.CharField(
        max_length=10,
        choices=[('CREATE', 'Create'), ('UPDATE', 'Update'), ('DELETE', 'Delete')],
    )
    before_state = models.JSONField(null=True, blank=True)
    after_state = models.JSONField(null=True, blank=True)
    reason_for_change = models.TextField(blank=True, default='')
    layer = models.CharField(max_length=50, default='core')
    previous_hash = models.CharField(max_length=64, blank=True, default='')
    this_hash = models.CharField(max_length=64)

    is_archived = models.BooleanField(default=False, db_index=True,
                                      help_text="Moved to archive tier after 5 years online")

    class Meta:
        ordering = ['timestamp']
        indexes = [
            models.Index(fields=['entity_type', 'entity_id', 'timestamp']),
            models.Index(fields=['tenant_id', 'is_archived']),
            models.Index(
                fields=['tenant_id'],
                name='audit_nullreason_idx',
                condition=Q(reason_for_change=''),
            ),
        ]

    def __str__(self):
        return f"[{self.operation}] {self.entity_type}:{self.entity_id} @ {self.timestamp}"

    def save(self, *args, **kwargs):
        if not self.this_hash:
            self.this_hash = self.compute_hash()
        super().save(*args, **kwargs)

    def compute_hash(self):
        """
        Compute SHA-256 hash of the audit record content chained to previous_hash.
        """
        payload = json.dumps({
            'tenant_id': str(self.tenant_id),
            'actor': self.actor,
            'timestamp': self.timestamp.isoformat() if self.timestamp else '',
            'entity_type': self.entity_type,
            'entity_id': str(self.entity_id),
            'operation': self.operation,
            'before_state': self.before_state,
            'after_state': self.after_state,
            'reason_for_change': self.reason_for_change,
            'layer': self.layer,
            'previous_hash': self.previous_hash,
        }, sort_keys=True, default=str)
        return hashlib.sha256(payload.encode('utf-8')).hexdigest()

    @classmethod
    def create_record(cls, tenant_id, entity_type, entity_id, operation,
                      before_state=None, after_state=None, actor='system',
                      reason_for_change='', layer='core'):
        """
        Create a new audit record, chaining it to the last record for this entity.
        """
        last_record = cls.objects.filter(
            entity_type=entity_type,
            entity_id=str(entity_id),
        ).order_by('-timestamp').first()

        previous_hash = last_record.this_hash if last_record else ''

        record = cls(
            tenant_id=tenant_id,
            actor=actor,
            entity_type=entity_type,
            entity_id=str(entity_id),
            operation=operation,
            before_state=before_state,
            after_state=after_state,
            reason_for_change=reason_for_change,
            layer=layer,
            previous_hash=previous_hash,
        )
        record.this_hash = record.compute_hash()
        record.save()
        return record

    @classmethod
    def active_online(cls, tenant_id=None):
        """Rows still in the online tier (is_archived=False)."""
        qs = cls.objects.filter(is_archived=False)
        if tenant_id:
            qs = qs.filter(tenant_id=tenant_id)
        return qs

    @classmethod
    def verify_chain(cls, entity_type, entity_id):
        """
        Verify the hash chain for a given entity. Returns (is_valid, broken_record_id).
        """
        records = cls.objects.filter(
            entity_type=entity_type,
            entity_id=str(entity_id),
        ).order_by('timestamp')

        previous_hash = ''
        for record in records:
            if record.previous_hash != previous_hash:
                return False, record.id
            expected_hash = record.compute_hash()
            if record.this_hash != expected_hash:
                return False, record.id
            previous_hash = record.this_hash

        return True, None


class AuditReaderGrant(models.Model):
    """
    Explicit grant of the audit-reader role to a user, per tenant. This is
    distinct from tenant_admin: tenant admins do not read audit logs by
    default.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True)
    user = models.ForeignKey(
        'auth.User', on_delete=models.CASCADE, related_name='audit_grants',
    )
    granted_by = models.UUIDField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant_id', 'user')


class AuditArchive(models.Model):
    """
    Pointer row for an archived batch of audit records. The archive payload
    is a JSON blob suitable for export to S3/Glacier. In Phase 2 we keep the
    payload inline; swapping in a storage_key column is a one-liner.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True, null=True, blank=True)
    record_count = models.IntegerField()
    from_timestamp = models.DateTimeField()
    to_timestamp = models.DateTimeField()
    payload = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)
