import uuid
from datetime import timedelta
import pytest
from django.utils import timezone

from optiforge.platform.documents.models import (
    Document,
    DocumentClass,
    DocumentOCRIndex,
    DocumentRevision,
)
from optiforge.platform.documents.service import (
    CheckOutConflictError,
    DocumentNotFoundError,
    NotCheckedOutError,
    archive_expired,
    check_in,
    check_out,
    search_ocr,
    upload,
    upload_new_revision,
)


@pytest.fixture
def doc_class(db):
    return DocumentClass.objects.create(code='drawings', name='Drawings', retention_days=365)


@pytest.fixture
def tenant():
    return uuid.uuid4()


@pytest.fixture
def other_tenant():
    return uuid.uuid4()


@pytest.fixture
def actor():
    return uuid.uuid4()


@pytest.mark.django_db
def test_upload_returns_handle_with_first_revision(tenant, doc_class, actor):
    doc = upload(tenant, 'spec.pdf', 'drawings', b'%PDF-1 fake',
                 mime_type='application/pdf', actor_id=actor)
    assert doc.tenant_id == tenant
    assert doc.revisions.count() == 1
    assert doc.revisions.first().rev_number == 1


@pytest.mark.django_db
def test_new_revisions_are_monotonic(tenant, doc_class, actor):
    doc = upload(tenant, 'spec.pdf', 'drawings', b'v1', actor_id=actor)
    upload_new_revision(tenant, doc.id, b'v2', actor_id=actor)
    upload_new_revision(tenant, doc.id, b'v3', actor_id=actor)
    rev_numbers = list(doc.revisions.order_by('rev_number').values_list('rev_number', flat=True))
    assert rev_numbers == [1, 2, 3]


@pytest.mark.django_db
def test_check_out_prevents_concurrent_edit(tenant, doc_class, actor):
    other_actor = uuid.uuid4()
    doc = upload(tenant, 's', 'drawings', b'v1', actor_id=actor)
    check_out(tenant, doc.id, actor)
    with pytest.raises(CheckOutConflictError):
        check_out(tenant, doc.id, other_actor)


@pytest.mark.django_db
def test_stale_check_out_can_be_reclaimed(tenant, doc_class, actor):
    other_actor = uuid.uuid4()
    doc = upload(tenant, 's', 'drawings', b'v1', actor_id=actor)
    check_out(tenant, doc.id, actor, ttl=timedelta(seconds=1))
    # Make the lock stale by hand.
    Document.objects.filter(pk=doc.id).update(
        checked_out_until=timezone.now() - timedelta(seconds=1),
    )
    check_out(tenant, doc.id, other_actor)
    doc.refresh_from_db()
    assert doc.checked_out_by == other_actor


@pytest.mark.django_db
def test_check_in_without_check_out_raises(tenant, doc_class, actor):
    doc = upload(tenant, 's', 'drawings', b'v1', actor_id=actor)
    with pytest.raises(NotCheckedOutError):
        check_in(tenant, doc.id, actor)


@pytest.mark.django_db
def test_check_in_persists_new_revision(tenant, doc_class, actor):
    doc = upload(tenant, 's', 'drawings', b'v1', actor_id=actor)
    check_out(tenant, doc.id, actor)
    check_in(tenant, doc.id, actor, content=b'v2', mime_type='application/pdf')
    doc.refresh_from_db()
    assert doc.checked_out_by is None
    assert doc.revisions.count() == 2


@pytest.mark.django_db
def test_retention_archives_but_does_not_delete(tenant, doc_class, actor):
    doc = upload(tenant, 's', 'drawings', b'v1', actor_id=actor)
    # Force doc into retention-expired state.
    Document.objects.filter(pk=doc.id).update(
        created_at=timezone.now() - timedelta(days=doc_class.retention_days + 1),
    )
    archived = archive_expired()
    assert archived == 1
    doc.refresh_from_db()
    assert doc.status == 'archived'
    assert doc.archived_at is not None
    # Bits are still there.
    assert DocumentRevision.objects.filter(document=doc).count() == 1


@pytest.mark.django_db
def test_tenant_isolation_prevents_cross_reads(tenant, other_tenant, doc_class, actor):
    doc = upload(tenant, 's', 'drawings', b'v1', actor_id=actor)
    with pytest.raises(DocumentNotFoundError):
        upload_new_revision(other_tenant, doc.id, b'leaky')


@pytest.mark.django_db
def test_ocr_index_searchable_per_tenant(tenant, other_tenant, doc_class, actor):
    upload(tenant, 'spec.pdf', 'drawings', b'Stainless steel counter',
           mime_type='application/pdf', actor_id=actor, ocr_text='Stainless steel counter')
    upload(other_tenant, 'spec.pdf', 'drawings', b'Other tenant secret',
           mime_type='application/pdf', actor_id=actor, ocr_text='Other tenant secret')

    own_hits = search_ocr(tenant, 'Stainless')
    other_hits = search_ocr(tenant, 'secret')
    assert len(own_hits) == 1
    assert len(other_hits) == 0


@pytest.mark.django_db
def test_ocr_skipped_for_non_ocr_mime(tenant, doc_class, actor):
    upload(tenant, 'csv.bin', 'drawings', b'a,b,c', mime_type='application/octet-stream', actor_id=actor)
    assert DocumentOCRIndex.objects.count() == 0
