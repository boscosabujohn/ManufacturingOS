from datetime import date
import pytest

from optiforge.core.qms.models import (
    CalibrationRecord, CAPA, DocumentControlItem, NonConformanceReport, QualityAudit,
    QualityChangeControl, QualityCheck, SPCMeasurement, SupplierCAR,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='QMS Tenant', status='active')


@pytest.mark.django_db
def test_quality_check_flow(tenant):
    qc = QualityCheck.objects.create(
        tenant=tenant, check_type='iqc', item_code='SKU-1', result='pending',
    )
    qc.result = 'fail'
    qc.save()

    ncr = NonConformanceReport.objects.create(
        tenant=tenant, number='NCR-1', quality_check=qc, description='Scratches',
    )
    CAPA.objects.create(
        tenant=tenant, number='CAPA-1', ncr=ncr,
        root_cause='supplier handling',
        corrective_action='tighten packaging spec',
    )
    assert ncr.capas.count() == 1


@pytest.mark.django_db
def test_spc_in_spec(tenant):
    m = SPCMeasurement.objects.create(
        tenant=tenant, characteristic='length_mm', value=10.05,
        lower_spec=9.9, upper_spec=10.1,
    )
    assert m.is_in_spec


@pytest.mark.django_db
def test_spc_out_of_spec(tenant):
    m = SPCMeasurement.objects.create(
        tenant=tenant, characteristic='length_mm', value=10.5,
        lower_spec=9.9, upper_spec=10.1,
    )
    assert not m.is_in_spec


@pytest.mark.django_db
def test_supplier_car_and_calibration(tenant):
    SupplierCAR.objects.create(
        tenant=tenant, number='SCAR-1', supplier_code='S-1',
        description='high reject rate',
    )
    cal = CalibrationRecord.objects.create(
        tenant=tenant, instrument_code='CAL-1',
        calibrated_on=date.today(), next_due_on=date.today(),
    )
    assert cal.instrument_code == 'CAL-1'


@pytest.mark.django_db
def test_quality_audit_and_doc_control(tenant):
    QualityAudit.objects.create(
        tenant=tenant, audit_type='internal', scheduled_date=date.today(),
    )
    DocumentControlItem.objects.create(
        tenant=tenant, code='SOP-001', title='General SOP', rev='A',
        effective_from=date.today(),
    )
    QualityChangeControl.objects.create(
        tenant=tenant, number='QCC-1', description='Tweak SOP-001',
    )
    assert QualityAudit.objects.count() == 1
