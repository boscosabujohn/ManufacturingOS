import uuid
from datetime import date
import pytest

from optiforge.core.finance.models import (
    APInvoice, ARInvoice, BankReconciliation, ChartOfAccounts, CostCenter, Currency,
    ExchangeRate, GLEntry, GLJournal,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Fin Tenant', status='active')


@pytest.mark.django_db
def test_coa_hierarchy(tenant):
    root = ChartOfAccounts.objects.create(
        tenant=tenant, code='1000', name='Assets', account_type='asset',
    )
    child = ChartOfAccounts.objects.create(
        tenant=tenant, code='1100', name='Current Assets',
        account_type='asset', parent=root,
    )
    assert child.parent_id == root.id


@pytest.mark.django_db
def test_gl_journal_balanced_entries(tenant):
    cash = ChartOfAccounts.objects.create(
        tenant=tenant, code='1000', name='Cash', account_type='asset',
    )
    rev = ChartOfAccounts.objects.create(
        tenant=tenant, code='4000', name='Revenue', account_type='revenue',
    )
    j = GLJournal.objects.create(tenant=tenant, number='J-1', posting_date=date.today())
    GLEntry.objects.create(tenant=tenant, journal=j, account=cash, debit=1000)
    GLEntry.objects.create(tenant=tenant, journal=j, account=rev, credit=1000)
    debits = sum(e.debit for e in j.entries.all())
    credits = sum(e.credit for e in j.entries.all())
    assert debits == credits


@pytest.mark.django_db
def test_multi_currency_rate(tenant):
    Currency.objects.create(tenant=tenant, code='USD', name='US Dollar', is_base=True)
    Currency.objects.create(tenant=tenant, code='EUR', name='Euro')
    ExchangeRate.objects.create(
        tenant=tenant, from_code='EUR', to_code='USD',
        rate='1.08', effective_from=date.today(),
    )
    assert ExchangeRate.objects.filter(from_code='EUR').count() == 1


@pytest.mark.django_db
def test_ar_invoice_with_milestone_reference(tenant):
    inv = ARInvoice.objects.create(
        tenant=tenant, number='AR-1', customer_account_id=uuid.uuid4(),
        total_amount=5000, status='issued', milestone_reference='M-DESIGN-LOCK',
    )
    assert inv.milestone_reference == 'M-DESIGN-LOCK'


@pytest.mark.django_db
def test_ap_invoice_and_bank_rec(tenant):
    APInvoice.objects.create(
        tenant=tenant, number='AP-1', supplier_code='S-1',
        total_amount=2000, status='approved',
    )
    br = BankReconciliation.objects.create(
        tenant=tenant, bank_account_code='BA-1', statement_date=date.today(),
        statement_balance=100000,
    )
    assert br.status == 'pending'
