import pytest

from optiforge.core.analytics.models import (
    Dashboard, EmbedHookRegistration, SemanticModel, WarehouseExtract,
)
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture
def tenant(db):
    return Tenant.objects.create(name='Analytics Tenant', status='active')


@pytest.mark.django_db
def test_semantic_model_versioning(tenant):
    SemanticModel.objects.create(
        tenant=tenant, name='sales_facts', version=1,
        dimensions=[{'name': 'date', 'source_column': 'created_at', 'data_type': 'date'}],
        measures=[{'name': 'revenue', 'aggregation': 'sum', 'source_column': 'amount'}],
    )
    SemanticModel.objects.create(
        tenant=tenant, name='sales_facts', version=2,
        dimensions=[], measures=[],
    )
    assert SemanticModel.objects.filter(name='sales_facts').count() == 2


@pytest.mark.django_db
def test_dashboard_unique_per_module(tenant):
    Dashboard.objects.create(
        tenant=tenant, name='Executive', module_code='finance',
        layout={'cards': []},
    )
    assert Dashboard.objects.filter(module_code='finance').count() == 1


@pytest.mark.django_db
def test_embed_hook_registration_is_active(tenant):
    EmbedHookRegistration.objects.create(
        tenant=tenant, tool_code='tableau', endpoint_url='https://embed.example/',
    )
    assert EmbedHookRegistration.objects.filter(is_active=True).count() == 1


@pytest.mark.django_db
def test_warehouse_extract(tenant):
    e = WarehouseExtract.objects.create(
        tenant=tenant, source_module='sales', status='completed', rows_exported=1000,
    )
    assert e.rows_exported == 1000
