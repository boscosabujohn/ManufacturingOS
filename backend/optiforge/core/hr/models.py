from django.db import models
from optiforge.platform.tenancy.models import TenantAwareModel


class Department(TenantAwareModel):
    code = models.CharField(max_length=50)
    name = models.CharField(max_length=255)
    parent = models.ForeignKey('self', null=True, blank=True,
                               on_delete=models.SET_NULL, related_name='sub_departments')

    class Meta:
        unique_together = ('tenant', 'code')


class Employee(TenantAwareModel):
    employee_number = models.CharField(max_length=50, db_index=True)
    first_name = models.CharField(max_length=120)
    last_name = models.CharField(max_length=120)
    email = models.EmailField(blank=True, default='')
    department = models.ForeignKey(Department, null=True, blank=True, on_delete=models.SET_NULL)
    job_title = models.CharField(max_length=255, blank=True, default='')
    hire_date = models.DateField(null=True, blank=True)
    is_active = models.BooleanField(default=True)
    user_id = models.UUIDField(null=True, blank=True,
                               help_text="Link to platform.identity User; nullable for non-system staff")
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('tenant', 'employee_number')


class RoleAssignment(TenantAwareModel):
    """Employee ↔ platform role mapping (reflects but does not own identity data)."""
    employee = models.ForeignKey(Employee, on_delete=models.CASCADE, related_name='role_assignments')
    role_code = models.CharField(max_length=80)
    effective_from = models.DateField()
    effective_to = models.DateField(null=True, blank=True)
