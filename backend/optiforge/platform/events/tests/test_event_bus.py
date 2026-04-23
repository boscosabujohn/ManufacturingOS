import uuid
import pytest
from optiforge.platform.events.bus import event_bus


@pytest.fixture(autouse=True)
def clean_bus():
    event_bus.clear()
    yield
    event_bus.clear()


def test_publish_to_single_subscriber():
    received = []

    def handler(event_type, payload, tenant_id):
        received.append({'event_type': event_type, 'payload': payload, 'tenant_id': tenant_id})
        return 'ok'

    event_bus.subscribe('CustomerRequirementCreated', 'kitchen-equipment', handler)
    results = event_bus.publish('CustomerRequirementCreated', {'cr_id': '123'}, tenant_id=uuid.uuid4())

    assert len(received) == 1
    assert received[0]['payload']['cr_id'] == '123'
    assert results['kitchen-equipment']['status'] == 'delivered'


def test_publish_to_two_subscribers():
    received_a = []
    received_b = []

    def handler_a(event_type, payload, tenant_id):
        received_a.append(payload)
        return 'a-ok'

    def handler_b(event_type, payload, tenant_id):
        received_b.append(payload)
        return 'b-ok'

    event_bus.subscribe('CustomerRequirementCreated', 'kitchen-equipment', handler_a)
    event_bus.subscribe('CustomerRequirementCreated', 'test-industry', handler_b)

    results = event_bus.publish('CustomerRequirementCreated', {'cr_id': '456'})

    assert len(received_a) == 1
    assert len(received_b) == 1
    assert results['kitchen-equipment']['status'] == 'delivered'
    assert results['test-industry']['status'] == 'delivered'


def test_subscriber_failure_does_not_block_others():
    received = []

    def failing_handler(event_type, payload, tenant_id):
        raise ValueError("Intentional failure")

    def good_handler(event_type, payload, tenant_id):
        received.append(payload)
        return 'ok'

    event_bus.subscribe('CustomerRequirementCreated', 'failing-pack', failing_handler)
    event_bus.subscribe('CustomerRequirementCreated', 'good-pack', good_handler)

    results = event_bus.publish('CustomerRequirementCreated', {'cr_id': '789'})

    # Good pack received the event despite failing pack
    assert len(received) == 1
    assert results['failing-pack']['status'] == 'failed'
    assert results['good-pack']['status'] == 'delivered'


def test_publish_with_no_subscribers():
    results = event_bus.publish('UnknownEvent', {})
    assert results == {}


def test_subscriber_count():
    event_bus.subscribe('TestEvent', 'pack-a', lambda *a: None)
    event_bus.subscribe('TestEvent', 'pack-b', lambda *a: None)
    assert event_bus.subscriber_count('TestEvent') == 2
    assert event_bus.subscriber_count('OtherEvent') == 0
