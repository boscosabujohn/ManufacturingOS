from datetime import datetime, timezone
import pytest

from optiforge.core.ehs.models import (
    EnvMonitoringReading, HIRAEntry, Incident, JSA, ManagementOfChange, PPEAllocation, SDS,
    TrainingRecord,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='EHS Tenant', status='active')


@pytest.mark.django_db
def test_incident_severity(tenant):
    i = Incident.objects.create(
        tenant=tenant, number='INC-1', occurred_at=datetime.now(timezone.utc),
        severity='recordable', description='slip',
    )
    assert i.severity == 'recordable'


@pytest.mark.django_db
def test_hira_risk_score(tenant):
    h = HIRAEntry.objects.create(
        tenant=tenant, activity='welding', hazard='spark burn',
        likelihood=3, severity=4,
    )
    assert h.risk_score == 12


@pytest.mark.django_db
def test_env_monitoring_exceedance(tenant):
    r = EnvMonitoringReading.objects.create(
        tenant=tenant, parameter='noise_db', value=92,
        unit='dB', recorded_at=datetime.now(timezone.utc),
        limit_value=85, is_exceedance=True,
    )
    assert r.is_exceedance


@pytest.mark.django_db
def test_jsa_and_ppe_and_moc(tenant):
    JSA.objects.create(tenant=tenant, job_title='Welder',
                       steps=[{'step': 'ignite torch', 'hazards': [], 'controls': []}])
    PPEAllocation.objects.create(tenant=tenant, employee_ref='E-1', ppe_code='HELMET')
    moc = ManagementOfChange.objects.create(
        tenant=tenant, number='MOC-1', title='New process',
        change_summary='Use robots',
    )
    assert moc.status == 'draft'


@pytest.mark.django_db
def test_sds_supersedes_chain(tenant):
    old = SDS.objects.create(tenant=tenant, substance_code='X', substance_name='Thing v1')
    new = SDS.objects.create(tenant=tenant, substance_code='X', substance_name='Thing v2',
                             supersedes=old)
    assert new.supersedes_id == old.id


@pytest.mark.django_db
def test_training_record(tenant):
    from datetime import date
    t = TrainingRecord.objects.create(
        tenant=tenant, employee_ref='E-1', course_code='SAFETY-101',
        completed_on=date(2026, 1, 1),
    )
    assert t.course_code == 'SAFETY-101'
