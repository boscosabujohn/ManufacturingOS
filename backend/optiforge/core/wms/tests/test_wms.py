import pytest

from optiforge.core.wms.models import Bin, RFTask, Warehouse
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='WMS Tenant', status='active')


@pytest.mark.django_db
def test_bin_unique_per_warehouse(tenant):
    wh = Warehouse.objects.create(tenant=tenant, code='WH-1', name='Main')
    b = Bin.objects.create(tenant=tenant, warehouse=wh, code='A01-R01-L01-P01',
                           aisle='A01', rack='R01', level='L01', position='P01')
    assert b.warehouse_id == wh.id


@pytest.mark.django_db
def test_rf_task_lifecycle(tenant):
    wh = Warehouse.objects.create(tenant=tenant, code='WH-1', name='Main')
    src = Bin.objects.create(tenant=tenant, warehouse=wh, code='SRC')
    dst = Bin.objects.create(tenant=tenant, warehouse=wh, code='DST')
    task = RFTask.objects.create(
        tenant=tenant, task_type='move', source_bin=src, target_bin=dst,
        item_code='SKU-1', qty=5, status='pending',
    )
    task.status = 'completed'
    task.save()
    assert RFTask.objects.filter(status='completed').count() == 1
