"""
In-process event bus for Phase 1.
Stubs RabbitMQ — provides at-least-once delivery semantics via synchronous dispatch.
In Phase 2 this will be replaced with a real message broker backend.
"""
import logging
from collections import defaultdict

logger = logging.getLogger(__name__)


class EventBus:
    """
    Simple in-process publish-subscribe event bus.
    Subscribers register by event_type; publish dispatches to all subscribers independently.
    """
    def __init__(self):
        # event_type -> list of (pack_id, handler_callable)
        self._subscribers = defaultdict(list)

    def subscribe(self, event_type, pack_id, handler):
        """
        Register a handler for an event type.
        """
        self._subscribers[event_type].append((pack_id, handler))
        logger.info(f"[EventBus] Pack '{pack_id}' subscribed to '{event_type}'")

    def publish(self, event_type, payload, tenant_id=None):
        """
        Publish an event. All subscribers are invoked independently.
        Failure of one subscriber does not prevent delivery to others (at-least-once).
        Returns a dict of {pack_id: result_or_error}.
        """
        results = {}
        subscribers = self._subscribers.get(event_type, [])

        for pack_id, handler in subscribers:
            try:
                result = handler(event_type, payload, tenant_id)
                results[pack_id] = {'status': 'delivered', 'result': result}
                logger.info(f"[EventBus] Event '{event_type}' delivered to pack '{pack_id}'")
            except Exception as e:
                results[pack_id] = {'status': 'failed', 'error': str(e)}
                logger.error(f"[EventBus] Event '{event_type}' failed for pack '{pack_id}': {e}")

        return results

    def clear(self):
        """Clear all subscriptions (for testing)."""
        self._subscribers.clear()

    def subscriber_count(self, event_type):
        """Return the number of subscribers for a given event type."""
        return len(self._subscribers.get(event_type, []))


# Global singleton
event_bus = EventBus()
