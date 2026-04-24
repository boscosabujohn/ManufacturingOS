"""
Pluggable publisher backends for the event bus.

Phase 2 shipped the in-process publisher. Phase 6 adds a Celery-ready
publisher that dispatches each subscriber invocation as a Celery task
(backed by Redis or RabbitMQ in production). Both publishers implement
the same narrow interface so `EventBus.publish()` does not care which
one is active.

Backend selection
-----------------
Set settings.EVENT_BUS_PUBLISHER to one of:
    'inprocess' — synchronous, default, used in tests + dev.
    'celery'    — enqueues a Celery task per (event, subscriber).

The Celery publisher is lazy-loaded: `celery` itself is not required
for tests or local dev.
"""
from __future__ import annotations

import logging

logger = logging.getLogger(__name__)


class Publisher:
    """Minimal interface every publisher implements."""

    def dispatch(self, event_id, event_type, payload, tenant_id, pack_id, handler):
        """
        Deliver `(event_type, payload, tenant_id)` to `handler` on behalf of
        `pack_id`. Must return the handler's result on success, raise on
        failure. The caller handles retries + DLQ routing.
        """
        raise NotImplementedError


class InProcessPublisher(Publisher):
    """Synchronous dispatch — the Phase 2 default."""

    def dispatch(self, event_id, event_type, payload, tenant_id, pack_id, handler):
        from optiforge.platform.extensions.context import pack_caller
        with pack_caller(pack_id):
            return handler(event_type, payload, tenant_id)


class CeleryPublisher(Publisher):
    """
    Enqueues each subscriber invocation onto the Celery broker. The
    subscribed handlers must be registered as Celery tasks beforehand
    via `register_celery_task(pack_id, event_type, task_name)`.

    On dispatch, instead of calling the Python callable directly we call
    `celery_app.send_task(task_name, kwargs=...)`. The result is a
    Celery `AsyncResult` the caller can ignore (fire-and-forget) or
    `.get()` for synchronous semantics.
    """

    def __init__(self, celery_app=None, synchronous=False, task_timeout_seconds=60):
        self._celery_app = celery_app
        self._synchronous = synchronous
        self._task_timeout = task_timeout_seconds
        self._task_registry = {}  # (pack_id, event_type) -> task_name

    def register_task(self, pack_id, event_type, task_name):
        self._task_registry[(pack_id, event_type)] = task_name

    def registered_tasks(self):
        return dict(self._task_registry)

    def dispatch(self, event_id, event_type, payload, tenant_id, pack_id, handler):
        task_name = self._task_registry.get((pack_id, event_type))
        if not task_name:
            # No Celery task registered — fall through to direct call so a
            # half-configured pack doesn't silently drop events.
            from optiforge.platform.extensions.context import pack_caller
            with pack_caller(pack_id):
                return handler(event_type, payload, tenant_id)

        if self._celery_app is None:
            raise RuntimeError(
                "CeleryPublisher requires celery_app; pass it at construction "
                "or set settings.CELERY_APP."
            )

        result = self._celery_app.send_task(
            task_name,
            kwargs={
                'event_id': str(event_id),
                'event_type': event_type,
                'payload': payload,
                'tenant_id': str(tenant_id) if tenant_id else None,
                'pack_id': pack_id,
            },
        )
        if self._synchronous:
            return result.get(timeout=self._task_timeout)
        return {'queued': True, 'task_id': result.id}


def build_publisher(name='inprocess', **kwargs):
    """Factory: build a publisher by name. Central switch for settings-driven choice."""
    if name == 'inprocess':
        return InProcessPublisher()
    if name == 'celery':
        return CeleryPublisher(**kwargs)
    raise ValueError(f"Unknown event bus publisher: '{name}'")
