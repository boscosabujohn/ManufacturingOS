import uuid
from datetime import date
import pytest

from optiforge.core.sales.models import (
    CustomerRequirement, PriceBook, PriceBookEntry, Quotation, QuotationLine, SalesOrder,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Sales Tenant', status='active')


@pytest.mark.django_db
def test_quotation_derives_from_customer_requirement(tenant):
    cr = CustomerRequirement.objects.create(
        tenant=tenant, source_type='boq_import', source_payload={'pages': 3},
    )
    q = Quotation.objects.create(
        tenant=tenant, number='Q-1', customer_requirement=cr,
        total_amount=12500, currency='USD',
    )
    assert q.customer_requirement_id == cr.id


@pytest.mark.django_db
def test_quotation_line_total(tenant):
    cr = CustomerRequirement.objects.create(tenant=tenant, source_type='rfq_spec')
    q = Quotation.objects.create(tenant=tenant, number='Q-2', customer_requirement=cr)
    line = QuotationLine.objects.create(
        tenant=tenant, quotation=q, item_code='SKU-1',
        qty=4, unit_price=250,
    )
    assert line.line_total == 1000.0


@pytest.mark.django_db
def test_sales_order_mode_field_defaults_to_discrete(tenant):
    cr = CustomerRequirement.objects.create(tenant=tenant, source_type='catalog_order')
    q = Quotation.objects.create(tenant=tenant, number='Q-3', customer_requirement=cr)
    so = SalesOrder.objects.create(tenant=tenant, number='SO-3', quotation=q)
    assert so.mode == 'discrete'


@pytest.mark.django_db
def test_price_book_lookup(tenant):
    pb = PriceBook.objects.create(tenant=tenant, name='Standard', currency='USD')
    PriceBookEntry.objects.create(
        tenant=tenant, price_book=pb, item_code='SKU-1', unit_price=100, min_qty=1,
    )
    PriceBookEntry.objects.create(
        tenant=tenant, price_book=pb, item_code='SKU-1', unit_price=90, min_qty=10,
    )
    entry = PriceBookEntry.objects.filter(
        price_book=pb, item_code='SKU-1', min_qty__lte=5,
    ).order_by('-min_qty').first()
    assert float(entry.unit_price) == 100
