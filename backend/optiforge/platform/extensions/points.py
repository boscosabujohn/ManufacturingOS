"""
Ten extension points the PRD requires packs to reach core through.
Each point has a typed registration record and a discovery API.

The existing parser registry (Phase 1) is preserved as-is under the
INTEGRATION_CONNECTOR point; the rest are added here.
"""
from collections import defaultdict


class ExtensionPoint:
    ENTITY_ATTRIBUTES = 'entity_attributes'
    WORKFLOW_STATE = 'workflow_state'
    SCREEN_SLOT = 'screen_slot'
    MASTER_DATA_SEED = 'master_data_seed'
    WORKFLOW_STEP_HANDLER = 'workflow_step_handler'
    VALIDATION_RULE = 'validation_rule'
    REPORT_TEMPLATE = 'report_template'
    INTEGRATION_CONNECTOR = 'integration_connector'
    EVENT_SUBSCRIPTION = 'event_subscription'
    PERMISSION_SCOPE = 'permission_scope'

    ALL = (
        ENTITY_ATTRIBUTES, WORKFLOW_STATE, SCREEN_SLOT, MASTER_DATA_SEED,
        WORKFLOW_STEP_HANDLER, VALIDATION_RULE, REPORT_TEMPLATE,
        INTEGRATION_CONNECTOR, EVENT_SUBSCRIPTION, PERMISSION_SCOPE,
    )


class ExtensionRegistration:
    __slots__ = ('point', 'pack_id', 'key', 'spec')

    def __init__(self, point, pack_id, key, spec):
        self.point = point
        self.pack_id = pack_id
        self.key = key
        self.spec = spec

    def __repr__(self):
        return f"ExtensionRegistration({self.point}, {self.pack_id}, {self.key})"


class ExtensionPointRegistry:
    """
    Catalogue of registrations across all 10 extension points. Each point
    is keyed by `key` (whatever identifier makes sense for that point:
    entity name, screen slot id, source_type, event_type, …). A pack may
    register more than one entry per point.
    """

    def __init__(self):
        self._entries = defaultdict(dict)

    def register(self, point, pack_id, key, spec):
        """
        Register or re-register. Same-pack re-registration is idempotent
        (loader reruns stay safe). Cross-pack collisions are rejected.
        """
        if point not in ExtensionPoint.ALL:
            raise ValueError(f"Unknown extension point: '{point}'")
        existing = self._entries[point].get(key)
        if existing and existing.pack_id != pack_id:
            raise DuplicateRegistrationError(
                f"Extension point '{point}' key '{key}' is already registered "
                f"by pack '{existing.pack_id}'. Cannot register again from '{pack_id}'."
            )
        self._entries[point][key] = ExtensionRegistration(point, pack_id, key, spec)

    def get(self, point, key):
        return self._entries[point].get(key)

    def list_for_point(self, point):
        return list(self._entries[point].values())

    def list_for_pack(self, pack_id):
        result = []
        for _point, by_key in self._entries.items():
            for reg in by_key.values():
                if reg.pack_id == pack_id:
                    result.append(reg)
        return result

    def catalogue(self):
        """Return {point: [registrations]} across the entire registry."""
        return {point: list(by_key.values()) for point, by_key in self._entries.items()}

    def registered_packs(self, point=None):
        if point:
            return sorted({reg.pack_id for reg in self._entries[point].values()})
        return sorted({reg.pack_id for by_key in self._entries.values() for reg in by_key.values()})

    def clear(self):
        self._entries.clear()


class DuplicateRegistrationError(Exception):
    """Raised when two packs try to register for the same extension point key."""


extension_points = ExtensionPointRegistry()
