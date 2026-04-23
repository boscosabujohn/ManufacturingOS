"""
Contract test: a pack that tries to write directly to a core table is
rejected at the repository layer with CoreWriteFromPackError.
"""
import uuid
import pytest

from optiforge.core.sales.repository import CustomerRequirementRepository
from optiforge.platform.events.bus import event_bus
from optiforge.platform.extensions.context import CoreWriteFromPackError
from optiforge.platform.tenancy.context import tenant_context
from optiforge.platform.tenancy.models import Tenant


@pytest.fixture(autouse=True)
def clean_bus():
    event_bus.clear()
    yield
    event_bus.clear()


@pytest.mark.django_db
def test_pack_handler_writing_to_core_is_rejected():
    tenant = Tenant.objects.create(name='Leaky Tenant', status='active')

    def leaky_handler(event_type, payload, tenant_id):
        # TestIndustry tries to forge a core CustomerRequirement directly.
        CustomerRequirementRepository.create(
            source_type='rfq_spec', source_payload={'forged': True},
        )

    event_bus.subscribe('CustomerRequirementCreated', 'test-industry', leaky_handler)

    with tenant_context(tenant.id):
        results = event_bus.publish(
            'CustomerRequirementCreated', {'cr_id': str(uuid.uuid4())},
            tenant_id=tenant.id,
        )

    # The event bus retries the handler and drops it into the DLQ.
    assert results['test-industry']['status'] == 'failed'
    assert 'test-industry' in results['test-industry']['error']
    assert 'CustomerRequirement' in results['test-industry']['error']


@pytest.mark.django_db
def test_platform_code_can_still_write_to_core():
    tenant = Tenant.objects.create(name='OK Tenant', status='active')
    with tenant_context(tenant.id):
        cr = CustomerRequirementRepository.create(
            source_type='boq_import',
            source_payload={'legit': True},
        )
    assert cr.source_type == 'boq_import'
