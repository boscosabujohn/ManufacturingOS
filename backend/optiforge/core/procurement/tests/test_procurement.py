import pytest
from django.db import IntegrityError

from optiforge.core.procurement.models import (
    GoodsReceiptNote, PurchaseOrder, RFQ, Supplier,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Proc Tenant', status='active')


@pytest.mark.django_db
def test_supplier_code_unique_per_tenant(tenant):
    Supplier.objects.create(tenant=tenant, code='S-001', name='Widget Co')
    with pytest.raises(IntegrityError):
        Supplier.objects.create(tenant=tenant, code='S-001', name='Widget Co 2')


@pytest.mark.django_db
def test_po_references_supplier(tenant):
    s = Supplier.objects.create(tenant=tenant, code='S-1', name='X')
    po = PurchaseOrder.objects.create(
        tenant=tenant, number='PO-001', supplier=s,
        total_amount=1000, currency='USD',
    )
    assert po.supplier_id == s.id


@pytest.mark.django_db
def test_rfq_to_po_to_grn_chain(tenant):
    s = Supplier.objects.create(tenant=tenant, code='S-1', name='X')
    rfq = RFQ.objects.create(tenant=tenant, number='RFQ-1', title='Lights')
    po = PurchaseOrder.objects.create(tenant=tenant, number='PO-1', supplier=s)
    grn = GoodsReceiptNote.objects.create(
        tenant=tenant, purchase_order=po, number='GRN-1',
    )
    assert rfq.status == 'draft'
    assert grn.purchase_order_id == po.id
