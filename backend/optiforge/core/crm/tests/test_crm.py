import pytest

from optiforge.core.crm.models import Account, Contact, Lead, Opportunity
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='CRM Tenant', status='active')


@pytest.mark.django_db
def test_account_and_primary_contact(tenant):
    acct = Account.objects.create(tenant=tenant, name='Acme Corp', industry='Food Service')
    Contact.objects.create(tenant=tenant, account=acct, first_name='Alice',
                           last_name='Wong', is_primary=True)
    assert acct.contacts.filter(is_primary=True).count() == 1


@pytest.mark.django_db
def test_lead_conversion_links_account(tenant):
    acct = Account.objects.create(tenant=tenant, name='Converted Corp')
    lead = Lead.objects.create(
        tenant=tenant, company='Converted Corp', contact_name='Bob',
        status='converted', converted_account=acct,
    )
    assert lead.converted_account_id == acct.id


@pytest.mark.django_db
def test_opportunity_weighted_amount(tenant):
    acct = Account.objects.create(tenant=tenant, name='Acme')
    opp = Opportunity.objects.create(
        tenant=tenant, account=acct, name='Big Deal',
        amount=100000, probability=0.3,
    )
    assert opp.weighted_amount == 30000.0
