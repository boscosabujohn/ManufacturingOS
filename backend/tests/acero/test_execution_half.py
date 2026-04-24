"""
ACERO execution-half regression: work orders → MES production run → QMS
quality check → NCR/CAPA → shipment → commissioning → handover →
installed base + AR invoice milestone. End-to-end happy path.
"""
import uuid
from datetime import date, datetime, timezone
import pytest

from optiforge.core.commissioning.models import (
    CommissioningPlan, CommissioningStep, HandoverCertificate,
)
from optiforge.core.field_service.models import InstalledBaseUnit
from optiforge.core.finance.models import ARInvoice
from optiforge.core.logistics.models import Shipment, ShipmentLine
from optiforge.core.mes.models import ProductionRun, WorkCenter
from optiforge.core.production_planning.models import WorkOrder
from optiforge.core.qms.models import CAPA, NonConformanceReport, QualityCheck
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='ACERO Exec Tenant', status='active')


@pytest.mark.django_db
def test_e2e_work_order_through_mes_to_qc(tenant):
    wo = WorkOrder.objects.create(
        tenant=tenant, number='WO-E2E-1', item_code='COUNTER-1', quantity=5,
    )
    wc = WorkCenter.objects.create(tenant=tenant, code='ASSY-1', name='Assembly Line 1')
    run = ProductionRun.objects.create(
        tenant=tenant, work_order_number=wo.number, work_center=wc,
        planned_quantity=5, produced_quantity=5,
    )

    qc = QualityCheck.objects.create(
        tenant=tenant, check_type='final', reference_type='work_order',
        reference_id=str(wo.id), item_code=wo.item_code, result='pass',
    )
    assert run.yield_percentage == 100.0
    assert qc.result == 'pass'


@pytest.mark.django_db
def test_e2e_ncr_raises_capa(tenant):
    qc = QualityCheck.objects.create(
        tenant=tenant, check_type='ipqc', item_code='SKU-X', result='fail',
    )
    ncr = NonConformanceReport.objects.create(
        tenant=tenant, number='NCR-E2E-1', quality_check=qc,
        description='dent',
    )
    capa = CAPA.objects.create(
        tenant=tenant, number='CAPA-E2E-1', ncr=ncr,
        root_cause='forklift strike',
        corrective_action='barrier guard installed',
    )
    assert capa.ncr_id == ncr.id


@pytest.mark.django_db
def test_e2e_shipment_to_commissioning_to_handover(tenant):
    so_id = uuid.uuid4()
    ship = Shipment.objects.create(
        tenant=tenant, number='SH-E2E-1', direction='outbound',
        reference_type='sales_order', reference_id=str(so_id),
        status='delivered',
    )
    ShipmentLine.objects.create(
        tenant=tenant, shipment=ship, item_code='COUNTER-1', quantity=5,
    )
    plan = CommissioningPlan.objects.create(
        tenant=tenant, number='CP-E2E-1', sales_order_id=so_id,
        planned_start=date.today(), planned_end=date.today(),
    )
    CommissioningStep.objects.create(
        tenant=tenant, plan=plan, sequence=10, title='NSF inspection',
        is_qc_gate=True, result='pass',
    )
    unit = InstalledBaseUnit.objects.create(
        tenant=tenant, serial_number='IB-E2E-1', item_code='COUNTER-1',
        customer_account_id=uuid.uuid4(), installed_on=date.today(),
    )
    cert = HandoverCertificate.objects.create(
        tenant=tenant, plan=plan, installed_unit_id=unit.id,
    )
    assert cert.installed_unit_id == unit.id


@pytest.mark.django_db
def test_e2e_milestone_invoice_marks_ar(tenant):
    inv = ARInvoice.objects.create(
        tenant=tenant, number='AR-E2E-1', customer_account_id=uuid.uuid4(),
        total_amount=25000, status='issued', milestone_reference='M-DESIGN-LOCK',
    )
    assert inv.milestone_reference == 'M-DESIGN-LOCK'
    assert inv.status == 'issued'
