"""
Contract test: every Phase 4 migration adapter accepts a synthetic legacy
row and returns a dict suitable for the corresponding core model's
create(). Missing source fields stay absent (no silent defaults) except
where the new schema's default applies.
"""
import pytest

from optiforge.migrations.legacy_bridge.adapters import ADAPTERS


def test_sixteen_adapters_registered():
    expected_keys = {
        'crm.lead', 'crm.account', 'sales.quotation', 'finance.costing_line',
        'production.work_order', 'procurement.purchase_order', 'project.ppc',
        'hr.employee', 'inventory.item', 'wms.bin', 'it_admin.setting',
        'commissioning.plan', 'logistics.shipment', 'support.ticket',
        'finance.gl_journal', 'workflow.definition',
    }
    assert set(ADAPTERS.keys()) == expected_keys


@pytest.mark.parametrize('key', sorted(ADAPTERS.keys()))
def test_every_adapter_handles_empty_input(key):
    """Empty input must not crash; returns a (possibly-empty) dict."""
    out = ADAPTERS[key]({})
    assert isinstance(out, dict)


def test_crm_lead_maps_aliases():
    from optiforge.migrations.legacy_bridge.adapters import crm_lead_to_layered
    out = crm_lead_to_layered({'org_name': 'Acme Inc', 'contact': 'Alice'})
    assert out['company'] == 'Acme Inc'
    assert out['contact_name'] == 'Alice'
    assert out['status'] == 'new'


def test_support_ticket_priority_mapped():
    from optiforge.migrations.legacy_bridge.adapters import support_ticket_to_layered
    out = support_ticket_to_layered({'ticket_no': 'T-1', 'subject': 'X',
                                     'priority': 'urgent'})
    assert out['priority'] == 'p1'


def test_inventory_item_uses_sku_alias():
    from optiforge.migrations.legacy_bridge.adapters import stores_item_to_inventory
    out = stores_item_to_inventory({'sku': 'SKU-1', 'description': 'thing'})
    assert out['code'] == 'SKU-1'


def test_procurement_po_vendor_code_alias():
    from optiforge.migrations.legacy_bridge.adapters import procurement_po_to_layered
    out = procurement_po_to_layered({'po_no': 'PO-1', 'vendor_code': 'V-1', 'amount': 500})
    assert out['supplier_code'] == 'V-1'
    assert out['total_amount'] == 500


def test_finance_costing_maps_to_gl_default():
    from optiforge.migrations.legacy_bridge.adapters import costing_snapshot_to_finance_line
    out = costing_snapshot_to_finance_line({'description': 'labour', 'cost': 1000})
    assert out['amount'] == 1000
    assert out['account_code'] == '5000'
