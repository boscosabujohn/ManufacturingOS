import pytest

from optiforge.core.plm.models import ChangeOrder, ChangeRequest, Part, PartRevision
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='PLM Tenant', status='active')


@pytest.mark.django_db
def test_part_and_revision(tenant):
    p = Part.objects.create(tenant=tenant, part_number='P-100', name='Door Panel')
    r = PartRevision.objects.create(tenant=tenant, part=p, rev_code='A', status='draft')
    assert p.revisions.count() == 1
    assert r.status == 'draft'


@pytest.mark.django_db
def test_revision_release_state(tenant):
    from django.utils import timezone
    p = Part.objects.create(tenant=tenant, part_number='P-200', name='Shelf')
    r = PartRevision.objects.create(tenant=tenant, part=p, rev_code='A')
    r.status = 'released'
    r.released_at = timezone.now()
    r.save()
    assert r.status == 'released'
    assert r.released_at is not None


@pytest.mark.django_db
def test_ecr_to_eco_chain(tenant):
    ecr = ChangeRequest.objects.create(
        tenant=tenant, number='ECR-1', title='Thicken door panel',
    )
    eco = ChangeOrder.objects.create(
        tenant=tenant, change_request=ecr, number='ECO-1',
    )
    assert eco.change_request_id == ecr.id
