"""
Publisher-abstraction tests: the event bus now dispatches through a
pluggable Publisher. Verifies in-process + Celery paths without
requiring a real broker.
"""
import uuid
from unittest.mock import MagicMock
import pytest

from optiforge.platform.events.bus import EventBus
from optiforge.platform.events.publishers import (
    CeleryPublisher, InProcessPublisher, build_publisher,
)


def test_build_publisher_inprocess():
    p = build_publisher('inprocess')
    assert isinstance(p, InProcessPublisher)


def test_build_publisher_celery():
    p = build_publisher('celery')
    assert isinstance(p, CeleryPublisher)


def test_build_publisher_unknown():
    with pytest.raises(ValueError):
        build_publisher('carrier-pigeon')


def test_bus_defaults_to_inprocess_publisher():
    bus = EventBus()
    assert isinstance(bus.publisher, InProcessPublisher)


def test_set_publisher_swaps_the_backend():
    bus = EventBus()
    p = CeleryPublisher()
    bus.set_publisher(p)
    assert bus.publisher is p


def test_set_publisher_rejects_non_publisher():
    bus = EventBus()
    with pytest.raises(TypeError):
        bus.set_publisher("not a publisher")


def test_celery_publisher_falls_through_when_no_task_registered():
    """Unconfigured Celery — no task registered — falls through to direct call."""
    p = CeleryPublisher()
    called_with = []

    def handler(event_type, payload, tenant_id):
        called_with.append((event_type, payload, tenant_id))
        return 'ok'

    result = p.dispatch(
        event_id='eid-1', event_type='E', payload={'x': 1},
        tenant_id=None, pack_id='p', handler=handler,
    )
    assert result == 'ok'
    assert called_with == [('E', {'x': 1}, None)]


def test_celery_publisher_send_task_is_fire_and_forget_by_default():
    fake_result = MagicMock(id='task-123')
    fake_app = MagicMock()
    fake_app.send_task.return_value = fake_result

    p = CeleryPublisher(celery_app=fake_app)
    p.register_task('pack-a', 'E', 'mypack.handle_E')

    def handler(event_type, payload, tenant_id):
        raise AssertionError("handler should not be called when task is registered")

    out = p.dispatch(
        event_id='eid-2', event_type='E', payload={'k': 'v'},
        tenant_id=None, pack_id='pack-a', handler=handler,
    )
    assert out == {'queued': True, 'task_id': 'task-123'}
    fake_app.send_task.assert_called_once()
    args, kwargs = fake_app.send_task.call_args
    assert args[0] == 'mypack.handle_E'
    assert kwargs['kwargs']['payload'] == {'k': 'v'}
    assert kwargs['kwargs']['pack_id'] == 'pack-a'


def test_celery_publisher_synchronous_waits_for_result():
    fake_result = MagicMock()
    fake_result.get.return_value = 'done'
    fake_app = MagicMock()
    fake_app.send_task.return_value = fake_result

    p = CeleryPublisher(celery_app=fake_app, synchronous=True, task_timeout_seconds=5)
    p.register_task('pack-a', 'E', 'mypack.handle_E')

    out = p.dispatch(
        event_id='e', event_type='E', payload={},
        tenant_id=None, pack_id='pack-a', handler=lambda *a, **kw: None,
    )
    assert out == 'done'
    fake_result.get.assert_called_once_with(timeout=5)


def test_celery_publisher_without_app_raises_when_task_registered():
    p = CeleryPublisher()
    p.register_task('pack-a', 'E', 'mypack.handle_E')
    with pytest.raises(RuntimeError, match='celery_app'):
        p.dispatch(
            event_id='e', event_type='E', payload={},
            tenant_id=None, pack_id='pack-a', handler=lambda *a, **kw: None,
        )


def test_bus_publish_uses_swapped_publisher():
    """Publishes routed through a swapped-in publisher retain retry + DLQ behaviour."""
    bus = EventBus(max_retries=2)
    calls = []

    class RecordingPublisher(InProcessPublisher):
        def dispatch(self, **kwargs):
            calls.append(kwargs)
            return super().dispatch(**kwargs)

    bus.set_publisher(RecordingPublisher())

    def handler(event_type, payload, tenant_id):
        return {'ok': True}

    bus.subscribe('X', 'pack-a', handler)
    bus.publish('X', {'n': 1})

    assert len(calls) == 1
    assert calls[0]['pack_id'] == 'pack-a'
    assert calls[0]['event_type'] == 'X'


def test_bus_retry_through_publisher_lands_in_dlq():
    bus = EventBus(max_retries=2)

    def always_fail(event_type, payload, tenant_id):
        raise RuntimeError("nope")

    bus.subscribe('X', 'pack-a', always_fail)
    bus.publish('X', {})

    assert bus.dlq_depth() == 1
    dlq = bus.get_dlq()
    assert dlq[0].pack_id == 'pack-a'
