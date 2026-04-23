"""
Document service. Binary backend is currently the DB BinaryField; swap in
S3/GCS behind `_store_binary` without touching callers.
"""
import uuid
from datetime import timedelta
from django.db import transaction
from django.utils import timezone

from .models import Document, DocumentClass, DocumentOCRIndex, DocumentRevision


class DocumentNotFoundError(LookupError):
    pass


class CheckOutConflictError(RuntimeError):
    """Raised when a concurrent check-out is attempted on an active lock."""


class NotCheckedOutError(RuntimeError):
    """Raised when check-in is attempted without a prior check-out."""


DEFAULT_CHECKOUT_TTL = timedelta(hours=4)


def _store_binary(tenant_id, document_id, rev_number, content):
    """
    Stub backend: the caller persists `content` on the DocumentRevision row.
    A real deployment would write to S3 and return the storage key.
    """
    return f"stub://{tenant_id}/{document_id}/{rev_number}"


def _run_ocr_stub(content, mime_type):
    """
    Stub OCR pipeline. Real deployments swap in tesseract / AWS Textract.
    We treat anything application/pdf or image/* as OCR-eligible and return
    the caller-supplied text heuristic.
    """
    if mime_type not in ('application/pdf', 'image/png', 'image/jpeg'):
        return None
    try:
        return content.decode('utf-8', errors='ignore').strip()
    except Exception:
        return ''


@transaction.atomic
def upload(tenant_id, title, document_class_code, content, mime_type='application/octet-stream',
           actor_id=None, ocr_text=None):
    """
    Create a new Document + first revision. Returns the Document handle.
    """
    doc_class = DocumentClass.objects.get(code=document_class_code)
    doc = Document.objects.create(
        tenant_id=tenant_id, title=title, document_class=doc_class,
    )
    _create_revision(doc, content, mime_type, actor_id, ocr_text)
    return doc


@transaction.atomic
def upload_new_revision(tenant_id, document_id, content,
                        mime_type='application/octet-stream',
                        actor_id=None, ocr_text=None):
    """Append a new revision. Returns the revision."""
    doc = _require_tenant_document(tenant_id, document_id)
    if doc.checked_out_by and doc.checked_out_by != actor_id and not doc.is_check_out_stale:
        raise CheckOutConflictError(
            f"Document is checked out by {doc.checked_out_by} until {doc.checked_out_until}"
        )
    return _create_revision(doc, content, mime_type, actor_id, ocr_text)


def _create_revision(doc, content, mime_type, actor_id, ocr_text):
    last = doc.revisions.order_by('-rev_number').first()
    next_rev = (last.rev_number if last else 0) + 1
    storage_key = _store_binary(doc.tenant_id, doc.id, next_rev, content)
    rev = DocumentRevision.objects.create(
        document=doc, rev_number=next_rev, mime_type=mime_type,
        size_bytes=len(content), content=content, storage_key=storage_key,
        created_by=actor_id,
    )
    extracted = ocr_text if ocr_text is not None else _run_ocr_stub(content, mime_type)
    if extracted:
        DocumentOCRIndex.objects.create(
            revision=rev, tenant_id=doc.tenant_id, extracted_text=extracted,
        )
    return rev


def check_out(tenant_id, document_id, actor_id, ttl=DEFAULT_CHECKOUT_TTL):
    """Acquire an edit lock. Stale locks are reclaimable."""
    doc = _require_tenant_document(tenant_id, document_id)
    if doc.checked_out_by and doc.checked_out_by != actor_id and not doc.is_check_out_stale:
        raise CheckOutConflictError(
            f"Already checked out by {doc.checked_out_by} until {doc.checked_out_until}"
        )
    doc.checked_out_by = actor_id
    doc.checked_out_until = timezone.now() + ttl
    doc.save(update_fields=['checked_out_by', 'checked_out_until', 'updated_at'])
    return doc


def check_in(tenant_id, document_id, actor_id, content=None,
             mime_type='application/octet-stream', ocr_text=None):
    """Release the lock, optionally persisting a new revision."""
    doc = _require_tenant_document(tenant_id, document_id)
    if not doc.checked_out_by:
        raise NotCheckedOutError("Document is not checked out.")
    if doc.checked_out_by != actor_id and not doc.is_check_out_stale:
        raise CheckOutConflictError("Check-in attempted by a different actor.")

    if content is not None:
        _create_revision(doc, content, mime_type, actor_id, ocr_text)

    doc.checked_out_by = None
    doc.checked_out_until = None
    doc.save(update_fields=['checked_out_by', 'checked_out_until', 'updated_at'])
    return doc


def get_revision(tenant_id, document_id, rev_number=None):
    doc = _require_tenant_document(tenant_id, document_id)
    if rev_number is None:
        return doc.revisions.order_by('-rev_number').first()
    return doc.revisions.get(rev_number=rev_number)


def search_ocr(tenant_id, q):
    """Tenant-scoped OCR full-text search stub."""
    return list(
        DocumentOCRIndex.objects
        .filter(tenant_id=tenant_id, extracted_text__icontains=q)
        .values('revision__document_id', 'revision__rev_number', 'extracted_text')
    )


def archive_expired(now=None):
    """
    Archive (never delete) documents whose retention window has expired.
    Returns the count archived.
    """
    now = now or timezone.now()
    archived = 0
    for doc in Document.objects.filter(status='active').select_related('document_class'):
        if doc.retention_expires_at <= now:
            doc.status = 'archived'
            doc.archived_at = now
            doc.save(update_fields=['status', 'archived_at', 'updated_at'])
            archived += 1
    return archived


def _require_tenant_document(tenant_id, document_id):
    try:
        return Document.objects.get(pk=document_id, tenant_id=tenant_id)
    except Document.DoesNotExist:
        raise DocumentNotFoundError(f"Document {document_id} not found in tenant {tenant_id}")
