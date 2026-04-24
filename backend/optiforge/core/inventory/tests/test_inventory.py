import pytest

from optiforge.core.inventory.models import Item, StockUnit
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Inv Tenant', status='active')


@pytest.mark.django_db
def test_item_tracking_defaults(tenant):
    item = Item.objects.create(tenant=tenant, code='SKU-1', description='Test')
    assert item.tracking == 'none'


@pytest.mark.django_db
def test_stock_unit_genealogy_parent_child(tenant):
    item = Item.objects.create(tenant=tenant, code='SKU-1',
                               description='Raw', tracking='lot')
    parent = StockUnit.objects.create(
        tenant=tenant, item=item, identifier='LOT-100', tracking='lot', qty=1000,
    )
    child = StockUnit.objects.create(
        tenant=tenant, item=item, identifier='LOT-100-A', tracking='lot',
        qty=200, parent_unit=parent,
    )
    assert child.parent_unit_id == parent.id
    assert parent.children.count() == 1


@pytest.mark.django_db
def test_stock_unit_status_transitions(tenant):
    item = Item.objects.create(tenant=tenant, code='SKU-1', description='x', tracking='serial')
    su = StockUnit.objects.create(
        tenant=tenant, item=item, identifier='SN-42', tracking='serial', qty=1,
    )
    su.status = 'quarantine'
    su.save()
    assert StockUnit.objects.filter(status='quarantine').count() == 1
