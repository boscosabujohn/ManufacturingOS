import pytest

from optiforge.core.logistics.models import Carrier, Shipment, ShipmentLine
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Log Tenant', status='active')


@pytest.mark.django_db
def test_outbound_shipment_with_lines(tenant):
    s = Shipment.objects.create(
        tenant=tenant, number='SH-1', direction='outbound',
        reference_type='sales_order', reference_id='SO-1',
    )
    ShipmentLine.objects.create(tenant=tenant, shipment=s, item_code='X', quantity=2)
    assert s.lines.count() == 1


@pytest.mark.django_db
def test_carrier_links_integration_connector(tenant):
    c = Carrier.objects.create(
        tenant=tenant, code='FEDEX', name='FedEx', connector_id='fedex-connector',
    )
    assert c.connector_id == 'fedex-connector'


@pytest.mark.django_db
def test_reverse_shipment_for_rma(tenant):
    s = Shipment.objects.create(
        tenant=tenant, number='SH-RMA', direction='reverse',
        reference_type='rma', reference_id='RMA-1',
    )
    assert s.direction == 'reverse'
