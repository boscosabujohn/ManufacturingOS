"""
Connector framework. Modules and packs register connectors declaratively
via a Connector descriptor. Runtime looks up by connector_id and invokes
the declared capability (sync_in / sync_out / webhook_in).
"""
from collections import defaultdict


class ConnectorAlreadyRegistered(Exception):
    pass


class ConnectorNotRegisteredError(LookupError):
    pass


class Connector:
    """
    Declarative connector spec. Callbacks are optional — a connector may
    handle webhooks only, or be outbound-only.
    """
    __slots__ = ('connector_id', 'owner', 'direction', 'sync_in', 'sync_out',
                 'webhook_in', 'edi_codecs', 'metadata')

    def __init__(self, connector_id, owner, direction='bidirectional',
                 sync_in=None, sync_out=None, webhook_in=None,
                 edi_codecs=None, metadata=None):
        self.connector_id = connector_id
        self.owner = owner
        self.direction = direction
        self.sync_in = sync_in
        self.sync_out = sync_out
        self.webhook_in = webhook_in
        self.edi_codecs = edi_codecs or ()
        self.metadata = metadata or {}


class ConnectorRegistry:
    def __init__(self):
        self._connectors = {}

    def register(self, connector):
        if connector.connector_id in self._connectors:
            raise ConnectorAlreadyRegistered(
                f"Connector '{connector.connector_id}' already registered by "
                f"'{self._connectors[connector.connector_id].owner}'"
            )
        self._connectors[connector.connector_id] = connector

    def get(self, connector_id):
        if connector_id not in self._connectors:
            raise ConnectorNotRegisteredError(f"Connector '{connector_id}' not registered")
        return self._connectors[connector_id]

    def list_all(self):
        return sorted(self._connectors.keys())

    def clear(self):
        self._connectors.clear()


connectors = ConnectorRegistry()


_DLQ = defaultdict(list)


def record_dlq(connector_id, attempt, error):
    _DLQ[connector_id].append({'attempt': attempt, 'error': str(error)})


def get_dlq(connector_id=None):
    if connector_id:
        return list(_DLQ[connector_id])
    return {cid: list(entries) for cid, entries in _DLQ.items()}


def clear_dlq():
    _DLQ.clear()
