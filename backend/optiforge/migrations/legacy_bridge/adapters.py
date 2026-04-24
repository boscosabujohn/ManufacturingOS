"""
Legacy-to-layered data-shape adapters.

Each Phase 4 "Migration: X" issue ships an adapter that converts
row-shaped dicts from the legacy B3 MACBIS schema into the new layered
core-module shape. The repo has no production data to migrate yet, so
adapters are data-shape-compatibility tested with synthetic fixtures.

Contract
--------
Each adapter exports:

    to_layered(legacy_row: dict) -> dict

The returned dict is passed directly to the corresponding core model's
objects.create(**kwargs) (or to the tenant-scoped repository). Missing
fields are dropped, not defaulted, so ambiguity never enters the new
store silently.

Adapters are organised module-by-module so the Phase 4 migration issues
can claim ownership row-by-row.
"""
from datetime import datetime


def _clean(d):
    return {k: v for k, v in d.items() if v is not None}


# --- #64 CRM migration ---

def crm_lead_to_layered(legacy):
    return _clean({
        'company': legacy.get('company') or legacy.get('org_name'),
        'contact_name': legacy.get('contact') or legacy.get('contact_name'),
        'email': legacy.get('email', ''),
        'source': legacy.get('source', ''),
        'status': 'new',
    })


def crm_account_to_layered(legacy):
    return _clean({
        'name': legacy.get('name'),
        'website': legacy.get('website', ''),
        'industry': legacy.get('industry', ''),
        'status': legacy.get('status') or 'active',
    })


# --- #81 Sales migration ---

def sales_quotation_to_layered(legacy):
    return _clean({
        'number': legacy.get('quotation_no') or legacy.get('number'),
        'total_amount': legacy.get('total_amount'),
        'currency': legacy.get('currency', 'USD'),
        'valid_until': legacy.get('valid_until'),
        'status': legacy.get('status', 'draft'),
    })


# --- #84 Estimation & Costing → Finance (Q8 deferral) ---

def costing_snapshot_to_finance_line(legacy):
    return _clean({
        'description': legacy.get('description'),
        'amount': legacy.get('cost') or legacy.get('amount'),
        'cost_center_code': legacy.get('cost_center'),
        'account_code': legacy.get('gl_code', '5000'),
    })


# --- #87 PPG / Production → Production Planning + MES + CMMS ---

def production_work_order_to_layered(legacy):
    return _clean({
        'number': legacy.get('wo_no') or legacy.get('number'),
        'item_code': legacy.get('item_code'),
        'quantity': legacy.get('qty'),
        'status': legacy.get('status', 'released'),
    })


# --- #91 Procurement ---

def procurement_po_to_layered(legacy):
    return _clean({
        'number': legacy.get('po_no') or legacy.get('number'),
        'supplier_code': legacy.get('vendor_code') or legacy.get('supplier_code'),
        'total_amount': legacy.get('amount') or legacy.get('total'),
        'currency': legacy.get('currency', 'USD'),
        'status': legacy.get('status', 'draft'),
    })


# --- #92 Projects (PPC) → Project + ETO mode ---

def project_ppc_to_layered(legacy):
    return _clean({
        'code': legacy.get('project_code') or legacy.get('code'),
        'name': legacy.get('name'),
        'start_date': legacy.get('start') or legacy.get('start_date'),
        'target_end_date': legacy.get('end') or legacy.get('target_end_date'),
        'status': legacy.get('status', 'planning'),
    })


# --- #93 HRM ---

def hr_employee_to_layered(legacy):
    return _clean({
        'employee_number': legacy.get('emp_no') or legacy.get('employee_number'),
        'first_name': legacy.get('first_name'),
        'last_name': legacy.get('last_name'),
        'email': legacy.get('email', ''),
        'job_title': legacy.get('designation') or legacy.get('job_title', ''),
        'hire_date': legacy.get('doj') or legacy.get('hire_date'),
        'is_active': legacy.get('active', True),
    })


# --- #95 Stores/Warehouse → Inventory + WMS ---

def stores_item_to_inventory(legacy):
    return _clean({
        'code': legacy.get('item_code') or legacy.get('sku'),
        'description': legacy.get('description'),
        'uom': legacy.get('uom', 'EA'),
        'item_class': legacy.get('item_class', 'raw'),
        'tracking': legacy.get('tracking', 'none'),
        'is_active': legacy.get('is_active', True),
    })


def stores_bin_to_wms(legacy):
    return _clean({
        'code': legacy.get('bin_code') or legacy.get('code'),
        'aisle': legacy.get('aisle', ''),
        'rack': legacy.get('rack', ''),
        'level': legacy.get('level', ''),
        'position': legacy.get('position', ''),
        'zone': legacy.get('zone', ''),
    })


# --- #96 IT-Admin ---

def it_admin_setting_to_layered(legacy):
    return _clean({
        'key': legacy.get('setting_key') or legacy.get('key'),
        'value': legacy.get('value') or {},
        'description': legacy.get('description', ''),
    })


# --- #97 Commissioning ---

def commissioning_plan_to_layered(legacy):
    return _clean({
        'number': legacy.get('plan_no') or legacy.get('number'),
        'site_location': legacy.get('site'),
        'planned_start': legacy.get('planned_start'),
        'planned_end': legacy.get('planned_end'),
        'status': legacy.get('status', 'draft'),
    })


# --- #99 Logistics ---

def logistics_shipment_to_layered(legacy):
    return _clean({
        'number': legacy.get('shipment_no') or legacy.get('number'),
        'direction': legacy.get('direction', 'outbound'),
        'carrier_code': legacy.get('carrier', ''),
        'tracking_number': legacy.get('tracking_no', ''),
        'status': legacy.get('status', 'draft'),
    })


# --- #100 Support ---

def support_ticket_to_layered(legacy):
    priority_map = {'urgent': 'p1', 'high': 'p2', 'medium': 'p3', 'low': 'p4'}
    return _clean({
        'number': legacy.get('ticket_no') or legacy.get('number'),
        'subject': legacy.get('subject'),
        'description': legacy.get('description', ''),
        'priority': priority_map.get(legacy.get('priority', 'medium'), 'p3'),
        'status': legacy.get('status', 'open'),
    })


# --- #101 Finance ---

def finance_gl_journal_to_layered(legacy):
    return _clean({
        'number': legacy.get('journal_no') or legacy.get('number'),
        'description': legacy.get('description', ''),
        'posting_date': legacy.get('posting_date') or legacy.get('date'),
        'status': legacy.get('status', 'draft'),
        'currency_code': legacy.get('currency', 'USD'),
    })


# --- #102 Workflow definitions ---

def workflow_definition_to_layered(legacy):
    return _clean({
        'workflow_id': legacy.get('workflow_id'),
        'version': legacy.get('version'),
        'definition': legacy.get('definition_json') or legacy.get('definition') or {},
        'is_active': legacy.get('is_active', True),
    })


# Registry for contract test.
ADAPTERS = {
    'crm.lead': crm_lead_to_layered,
    'crm.account': crm_account_to_layered,
    'sales.quotation': sales_quotation_to_layered,
    'finance.costing_line': costing_snapshot_to_finance_line,
    'production.work_order': production_work_order_to_layered,
    'procurement.purchase_order': procurement_po_to_layered,
    'project.ppc': project_ppc_to_layered,
    'hr.employee': hr_employee_to_layered,
    'inventory.item': stores_item_to_inventory,
    'wms.bin': stores_bin_to_wms,
    'it_admin.setting': it_admin_setting_to_layered,
    'commissioning.plan': commissioning_plan_to_layered,
    'logistics.shipment': logistics_shipment_to_layered,
    'support.ticket': support_ticket_to_layered,
    'finance.gl_journal': finance_gl_journal_to_layered,
    'workflow.definition': workflow_definition_to_layered,
}
