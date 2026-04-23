import pytest
from django.db import connection, transaction
from optiforge.platform.tenancy.models import Tenant, TenantAwareModel
from optiforge.platform.tenancy.repository import BaseTenantRepository, MissingTenantContextException
from optiforge.platform.tenancy.context import tenant_context

# We need a concrete model to test the abstract TenantAwareModel
# Django allows creating models in tests but it's easier to just define one in the test file
# and let Django migrate it if we use pytest-django with --migrations, but wait,
# defining a model inside a test file is tricky for Django migrations.
# Let's just create a dummy model in models.py specifically for testing, or we can just test the repository logic using a mock model.

# Actually, let's create a test-only app or use a dummy model.
# Since we just want to prove the repository pattern:
class DummyQuerySet:
    def __init__(self, tenant_id=None):
        self.tenant_id = tenant_id

    def filter(self, **kwargs):
        return f"filtered for {self.tenant_id} with {kwargs}"

    def get(self, **kwargs):
        return f"got for {self.tenant_id} with {kwargs}"

class DummyObjects:
    def filter(self, **kwargs):
        return DummyQuerySet(tenant_id=kwargs.get('tenant_id'))

    def create(self, **kwargs):
        return f"created for {kwargs.get('tenant_id')} with {kwargs}"

class DummyModel:
    objects = DummyObjects()

class DummyRepository(BaseTenantRepository):
    model = DummyModel

def test_repository_requires_tenant_context():
    with pytest.raises(MissingTenantContextException):
        DummyRepository.filter()
        
    with pytest.raises(MissingTenantContextException):
        DummyRepository.create(name="test")

def test_repository_with_tenant_context():
    with tenant_context("123e4567-e89b-12d3-a456-426614174000"):
        res = DummyRepository.filter()
        assert res == "filtered for 123e4567-e89b-12d3-a456-426614174000 with {}"
        
        res_create = DummyRepository.create(name="test")
        assert res_create == "created for 123e4567-e89b-12d3-a456-426614174000 with {'name': 'test', 'tenant_id': '123e4567-e89b-12d3-a456-426614174000'}"

@pytest.mark.django_db
def test_tenant_provisioning():
    t1 = Tenant.objects.create(name="Tenant A")
    assert t1.status == "provisioning"
    assert t1.id is not None
