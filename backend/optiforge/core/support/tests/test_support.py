import uuid
import pytest

from optiforge.core.support.models import KBArticle, SupportTicket
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Support Tenant', status='active')


@pytest.mark.django_db
def test_support_ticket_with_priority(tenant):
    t = SupportTicket.objects.create(
        tenant=tenant, number='T-1', customer_account_id=uuid.uuid4(),
        subject='broken', priority='p1',
    )
    assert t.priority == 'p1'


@pytest.mark.django_db
def test_kb_article_publish_state(tenant):
    a = KBArticle.objects.create(
        tenant=tenant, slug='reset-oven', title='How to reset the oven',
        body='Press button for 10s.', category='troubleshooting',
        is_published=True,
    )
    assert a.is_published


@pytest.mark.django_db
def test_ticket_links_to_dispatch(tenant):
    dispatch_id = uuid.uuid4()
    t = SupportTicket.objects.create(
        tenant=tenant, number='T-2', customer_account_id=uuid.uuid4(),
        subject='service call', dispatched_service_id=dispatch_id,
    )
    assert t.dispatched_service_id == dispatch_id
