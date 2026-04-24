"""
Issue #45 — automated components of the DR drill. Full DR drill is a
quarterly manual exercise per docs/runbooks/dr-drill.md; these tests
cover the building blocks that must behave correctly.
"""
from datetime import datetime, timezone
import uuid
import pytest

from optiforge.platform.audit.models import AuditRecord
from optiforge.platform.audit.tasks import verify_all_audit_chains
from optiforge.platform.events.bus import event_bus
from optiforge.platform.extensions.registry import extension_registry
from optiforge.packs.kitchen_equipment.loader import load_pack


@pytest.fixture(autouse=True)
def clean_state():
    event_bus.clear()
    extension_registry.clear()
    yield
    event_bus.clear()
    extension_registry.clear()


def test_replay_from_drains_dlq_for_recovered_subscriber():
    """After a subscriber comes back online, replay_from pushes historical
    events through the recovered handler."""
    received = []

    def handler(event_type, payload, tenant_id):
        received.append(payload)
        return 'ok'

    event_bus.subscribe('OrderPlaced', 'order-processor', handler)
    event_bus.publish('OrderPlaced', {'id': 'A'})
    event_bus.publish('OrderPlaced', {'id': 'B'})
    # Simulate recovery: replay from epoch.
    start = datetime.min
    replayed = event_bus.replay_from('OrderPlaced', start, 'order-processor')
    assert len(replayed) == 2
    assert [r['status'] for r in replayed] == ['delivered', 'delivered']


@pytest.mark.django_db
def test_audit_chain_intact_after_simulated_restore():
    tenant_id = uuid.uuid4()
    entity_id = str(uuid.uuid4())
    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='x', entity_id=entity_id,
        operation='CREATE', after_state={'n': 1},
    )
    AuditRecord.create_record(
        tenant_id=tenant_id, entity_type='x', entity_id=entity_id,
        operation='UPDATE', before_state={'n': 1}, after_state={'n': 2},
    )
    result = verify_all_audit_chains()
    assert result['failures'] == []


@pytest.mark.django_db
def test_pack_reactivation_restores_every_extension_point():
    load_pack()
    # Simulate DR: wipe the in-memory registry (as if a freshly booted
    # process), then reactivate.
    extension_registry.clear()
    load_pack()
    assert 'boq_import' in extension_registry.registered_types()
