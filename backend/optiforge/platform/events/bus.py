"""
Hardened event bus with DLQ, retry, replay, and per-subscriber status tracking.

The actual delivery of `(event, payload, tenant_id) → handler` is delegated
to a pluggable Publisher (see publishers.py). Phase 6 introduces this
indirection so production can swap in a Celery publisher without touching
callers; tests + dev keep the synchronous InProcessPublisher.
"""
import logging
import uuid
from collections import defaultdict
from datetime import datetime, timezone

from .publishers import InProcessPublisher, Publisher

logger = logging.getLogger(__name__)


def _utcnow():
    return datetime.now(timezone.utc)


class DeadLetterEntry:
    """A failed event delivery stored in the DLQ."""
    def __init__(self, event_id, event_type, payload, tenant_id, pack_id, error, timestamp=None):
        self.event_id = event_id
        self.event_type = event_type
        self.payload = payload
        self.tenant_id = tenant_id
        self.pack_id = pack_id
        self.error = error
        self.timestamp = timestamp or _utcnow()
        self.retry_count = 0

    def __repr__(self):
        return f"DLQ({self.event_type} → {self.pack_id}: {self.error})"


class EventBus:
    """
    Production-grade event bus.
    Features: at-least-once delivery, DLQ, replay, per-subscriber status.
    Delivery is delegated to a pluggable Publisher.
    """
    def __init__(self, max_retries=3, publisher=None):
        self._subscribers = defaultdict(list)
        self._dlq = []
        self._event_log = []  # Ordered list of (event_id, event_type, payload, tenant_id, timestamp)
        self._subscriber_status = defaultdict(lambda: {'delivered': 0, 'failed': 0, 'last_event_id': None})
        self.max_retries = max_retries
        self._publisher = publisher or InProcessPublisher()

    @property
    def publisher(self):
        return self._publisher

    def set_publisher(self, publisher):
        """Swap publisher at runtime — used to flip from in-process to Celery."""
        if not isinstance(publisher, Publisher):
            raise TypeError("publisher must implement the Publisher interface")
        self._publisher = publisher

    def subscribe(self, event_type, pack_id, handler):
        self._subscribers[event_type].append((pack_id, handler))
        logger.info(f"[EventBus] Pack '{pack_id}' subscribed to '{event_type}'")

    def publish(self, event_type, payload, tenant_id=None):
        """Publish with at-least-once delivery and DLQ for failures after retries."""
        event_id = str(uuid.uuid4())
        timestamp = _utcnow()
        self._event_log.append((event_id, event_type, payload, tenant_id, timestamp))

        results = {}
        subscribers = self._subscribers.get(event_type, [])

        for pack_id, handler in subscribers:
            delivered = False
            last_error = None

            for attempt in range(1, self.max_retries + 1):
                try:
                    result = self._publisher.dispatch(
                        event_id=event_id, event_type=event_type, payload=payload,
                        tenant_id=tenant_id, pack_id=pack_id, handler=handler,
                    )
                    results[pack_id] = {'status': 'delivered', 'result': result, 'attempts': attempt}
                    self._subscriber_status[pack_id]['delivered'] += 1
                    self._subscriber_status[pack_id]['last_event_id'] = event_id
                    delivered = True
                    break
                except Exception as e:
                    last_error = str(e)
                    logger.warning(f"[EventBus] Attempt {attempt}/{self.max_retries} failed for '{pack_id}': {e}")

            if not delivered:
                results[pack_id] = {'status': 'failed', 'error': last_error, 'attempts': self.max_retries}
                self._subscriber_status[pack_id]['failed'] += 1
                self._dlq.append(DeadLetterEntry(
                    event_id=event_id, event_type=event_type, payload=payload,
                    tenant_id=tenant_id, pack_id=pack_id, error=last_error,
                    timestamp=timestamp,
                ))
                logger.error(f"[EventBus] Event '{event_type}' moved to DLQ for pack '{pack_id}'")

        return results

    def replay_from(self, event_type, from_timestamp, pack_id):
        """
        Replay events of a given type from a timestamp for a specific subscriber.
        Goes through the active publisher so Celery deployments replay into
        the broker just like first-time publishes.
        """
        handler = None
        for pid, h in self._subscribers.get(event_type, []):
            if pid == pack_id:
                handler = h
                break

        if not handler:
            raise ValueError(f"No subscriber '{pack_id}' found for event type '{event_type}'")

        if from_timestamp.tzinfo is None:
            from_timestamp = from_timestamp.replace(tzinfo=timezone.utc)

        results = []
        for event_id, etype, payload, tenant_id, timestamp in self._event_log:
            if etype == event_type and timestamp >= from_timestamp:
                try:
                    result = self._publisher.dispatch(
                        event_id=event_id, event_type=etype, payload=payload,
                        tenant_id=tenant_id, pack_id=pack_id, handler=handler,
                    )
                    results.append({'event_id': event_id, 'status': 'delivered', 'result': result})
                except Exception as e:
                    results.append({'event_id': event_id, 'status': 'failed', 'error': str(e)})

        return results

    def get_dlq(self):
        return list(self._dlq)

    def get_subscriber_status(self, pack_id=None):
        if pack_id:
            return dict(self._subscriber_status.get(pack_id, {}))
        return dict(self._subscriber_status)

    def dlq_depth(self):
        return len(self._dlq)

    def clear(self):
        self._subscribers.clear()
        self._dlq.clear()
        self._event_log.clear()
        self._subscriber_status.clear()

    def subscriber_count(self, event_type):
        return len(self._subscribers.get(event_type, []))


# Global singleton
event_bus = EventBus()
