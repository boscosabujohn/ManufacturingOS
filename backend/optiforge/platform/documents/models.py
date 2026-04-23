import uuid
from datetime import timedelta
from django.db import models
from django.utils import timezone


class DocumentClass(models.Model):
    """Catalogue entry — retention rules attach per class."""
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    code = models.CharField(max_length=100, unique=True)
    name = models.CharField(max_length=255)
    retention_days = models.IntegerField(default=365 * 5)
    description = models.TextField(blank=True, default='')

    def __str__(self):
        return f"{self.code} ({self.retention_days}d retention)"


class Document(models.Model):
    """
    Tenant-scoped document handle. Binary content lives in DocumentRevision
    rows so revisions are immutable and storable in a blob backend.
    """
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('archived', 'Archived'),
    ]

    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    tenant_id = models.UUIDField(db_index=True)
    title = models.CharField(max_length=255)
    document_class = models.ForeignKey(DocumentClass, on_delete=models.PROTECT, related_name='documents')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    checked_out_by = models.UUIDField(null=True, blank=True)
    checked_out_until = models.DateTimeField(null=True, blank=True)
    archived_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        indexes = [
            models.Index(fields=['tenant_id', 'status']),
            models.Index(fields=['tenant_id', 'document_class']),
        ]

    def __str__(self):
        return f"{self.title} ({self.document_class.code})"

    @property
    def is_check_out_stale(self):
        return bool(
            self.checked_out_until
            and timezone.now() >= self.checked_out_until
        )

    @property
    def retention_expires_at(self):
        return self.created_at + timedelta(days=self.document_class.retention_days)


class DocumentRevision(models.Model):
    """
    Immutable revision of a Document. Sequential rev_number per document.
    Content is kept in the DB for the stub backend; a real deployment swaps
    the `storage_key` for an S3 / GCS path.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    document = models.ForeignKey(Document, on_delete=models.CASCADE, related_name='revisions')
    rev_number = models.IntegerField()
    mime_type = models.CharField(max_length=100, default='application/octet-stream')
    size_bytes = models.BigIntegerField()
    content = models.BinaryField(help_text="Stub backend; real deployments use storage_key")
    storage_key = models.CharField(max_length=500, blank=True, default='')
    created_by = models.UUIDField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('document', 'rev_number')
        ordering = ['document', 'rev_number']


class DocumentOCRIndex(models.Model):
    """
    OCR-extracted text per revision, feeding the reporting fabric's full-text
    search via a registered view.
    """
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    revision = models.OneToOneField(DocumentRevision, on_delete=models.CASCADE, related_name='ocr_index')
    tenant_id = models.UUIDField(db_index=True)
    extracted_text = models.TextField()
    lang = models.CharField(max_length=10, default='eng')
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        indexes = [
            models.Index(fields=['tenant_id']),
        ]
