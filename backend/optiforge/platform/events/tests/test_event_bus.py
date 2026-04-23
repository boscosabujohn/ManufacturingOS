import uuid
from datetime import datetime, timedelta
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
        received.append(payload)
        return 'ok'

    event_bus.subscribe('CustomerRequirementCreated', 'kitchen-equipment', handler)
    results = event_bus.publish('CustomerRequirementCreated', {'cr_id': '123'}, tenant_id=uuid.uuid4())

    assert len(received) == 1
    assert results['kitchen-equipment']['status'] == 'delivered'


def test_publish_to_two_subscribers():
    received_a, received_b = [], []
    def handler_a(et, p, t): received_a.append(p); return 'a-ok'
    def handler_b(et, p, t): received_b.append(p); return 'b-ok'

    event_bus.subscribe('CustomerRequirementCreated', 'kitchen-equipment', handler_a)
    event_bus.subscribe('CustomerRequirementCreated', 'test-industry', handler_b)
    results = event_bus.publish('CustomerRequirementCreated', {'cr_id': '456'})

    assert len(received_a) == 1
    assert len(received_b) == 1
    assert results['kitchen-equipment']['status'] == 'delivered'
    assert results['test-industry']['status'] == 'delivered'


def test_subscriber_failure_retries_then_dlq():
    """Failing subscriber is retried max_retries times, then sent to DLQ."""
    call_count = [0]
    def failing_handler(et, p, t):
        call_count[0] += 1
        raise ValueError("Intentional failure")

    event_bus.subscribe('TestEvent', 'failing-pack', failing_handler)
    results = event_bus.publish('TestEvent', {'data': 'test'})

    assert results['failing-pack']['status'] == 'failed'
    assert results['failing-pack']['attempts'] == event_bus.max_retries
    assert call_count[0] == event_bus.max_retries
    assert event_bus.dlq_depth() == 1


def test_subscriber_failure_does_not_block_others():
    received = []
    def failing(et, p, t): raise ValueError("Fail")
    def good(et, p, t): received.append(p); return 'ok'

    event_bus.subscribe('TestEvent', 'failing-pack', failing)
    event_bus.subscribe('TestEvent', 'good-pack', good)
    results = event_bus.publish('TestEvent', {'cr_id': '789'})

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


def test_dlq_entries():
    def failing(et, p, t): raise ValueError("DLQ test")
    event_bus.subscribe('DLQEvent', 'dlq-pack', failing)
    event_bus.publish('DLQEvent', {'test': True})

    dlq = event_bus.get_dlq()
    assert len(dlq) == 1
    assert dlq[0].pack_id == 'dlq-pack'
    assert dlq[0].event_type == 'DLQEvent'
    assert 'DLQ test' in dlq[0].error


def test_per_subscriber_status():
    def good(et, p, t): return 'ok'
    event_bus.subscribe('StatusEvent', 'status-pack', good)
    event_bus.publish('StatusEvent', {'a': 1})
    event_bus.publish('StatusEvent', {'b': 2})

    status = event_bus.get_subscriber_status('status-pack')
    assert status['delivered'] == 2
    assert status['failed'] == 0


def test_replay_from_timestamp():
    received = []
    def handler(et, p, t):
        received.append(p)
        return 'replayed'

    event_bus.subscribe('ReplayEvent', 'replay-pack', handler)
    event_bus.publish('ReplayEvent', {'seq': 1})
    event_bus.publish('ReplayEvent', {'seq': 2})

    # Replay all from epoch (captures everything)
    results = event_bus.replay_from('ReplayEvent', datetime.min, 'replay-pack')
    # 2 original deliveries + 2 replays = 4 total received
    assert len(results) == 2
    assert all(r['status'] == 'delivered' for r in results)
