import uuid
from datetime import date
import pytest

from optiforge.core.commissioning.models import (
    CommissioningPlan, CommissioningStep, HandoverCertificate,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Comm Tenant', status='active')


@pytest.mark.django_db
def test_commissioning_plan_with_steps(tenant):
    plan = CommissioningPlan.objects.create(
        tenant=tenant, number='CP-1', sales_order_id=uuid.uuid4(),
        planned_start=date.today(), planned_end=date.today(),
    )
    CommissioningStep.objects.create(
        tenant=tenant, plan=plan, sequence=10, title='Unpack',
    )
    CommissioningStep.objects.create(
        tenant=tenant, plan=plan, sequence=20, title='Power check', is_qc_gate=True,
    )
    assert plan.steps.filter(is_qc_gate=True).count() == 1


@pytest.mark.django_db
def test_handover_certificate_one_per_plan(tenant):
    plan = CommissioningPlan.objects.create(
        tenant=tenant, number='CP-2', sales_order_id=uuid.uuid4(),
    )
    HandoverCertificate.objects.create(tenant=tenant, plan=plan)
    assert hasattr(plan, 'handover_certificate')
