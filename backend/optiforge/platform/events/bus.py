"""
Hardened event bus with DLQ, retry, replay, and per-subscriber status tracking.
Phase 2 upgrade from the Phase 1 in-process stub.
"""
import logging
import uuid
from collections import defaultdict
from datetime import datetime, timezone

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
    Production-grade in-process event bus (Phase 2).
    Features: at-least-once delivery, DLQ, replay, per-subscriber status.
    """
    def __init__(self, max_retries=3):
        self._subscribers = defaultdict(list)
        self._dlq = []
        self._event_log = []  # Ordered list of (event_id, event_type, payload, tenant_id, timestamp)
        self._subscriber_status = defaultdict(lambda: {'delivered': 0, 'failed': 0, 'last_event_id': None})
        self.max_retries = max_retries

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
                    from optiforge.platform.extensions.context import pack_caller
                    with pack_caller(pack_id):
                        result = handler(event_type, payload, tenant_id)
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
        Returns results of the replay.
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
                    result = handler(etype, payload, tenant_id)
                    results.append({'event_id': event_id, 'status': 'delivered', 'result': result})
                except Exception as e:
                    results.append({'event_id': event_id, 'status': 'failed', 'error': str(e)})

        return results

    def get_dlq(self):
        """Return all DLQ entries."""
        return list(self._dlq)

    def get_subscriber_status(self, pack_id=None):
        """Return per-subscriber delivery status."""
        if pack_id:
            return dict(self._subscriber_status.get(pack_id, {}))
        return dict(self._subscriber_status)

    def dlq_depth(self):
        """Return the number of entries in the DLQ."""
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
