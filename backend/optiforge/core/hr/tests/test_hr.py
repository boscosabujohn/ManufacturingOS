import pytest

from optiforge.core.hr.models import Department, Employee, RoleAssignment
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='HR Tenant', status='active')


@pytest.mark.django_db
def test_department_hierarchy(tenant):
    parent = Department.objects.create(tenant=tenant, code='OPS', name='Operations')
    child = Department.objects.create(
        tenant=tenant, code='PROD', name='Production', parent=parent,
    )
    assert child.parent_id == parent.id


@pytest.mark.django_db
def test_employee_in_department(tenant):
    dept = Department.objects.create(tenant=tenant, code='ENG', name='Engineering')
    emp = Employee.objects.create(
        tenant=tenant, employee_number='E-1001', first_name='Alice',
        last_name='Wong', department=dept,
    )
    assert emp.department.code == 'ENG'


@pytest.mark.django_db
def test_role_assignment_effective_dates(tenant):
    from datetime import date
    emp = Employee.objects.create(
        tenant=tenant, employee_number='E-2', first_name='Bob', last_name='M',
    )
    ra = RoleAssignment.objects.create(
        tenant=tenant, employee=emp, role_code='production_planner',
        effective_from=date(2026, 1, 1),
    )
    assert ra.role_code == 'production_planner'
