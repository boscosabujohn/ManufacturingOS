"""
Compliance-pack extension hooks (Layer 4). Scaffolded — no compliance
packs ship in v1. The hooks exist so a future pack (21 CFR Part 11,
FDA, EU MDR, ISO 9001 audit trail, etc.) can install without a core
change.
"""
from collections import defaultdict


class CompliancePackAlreadyInstalled(RuntimeError):
    pass


class CompliancePackNotFoundError(LookupError):
    pass


_installed = {}  # pack_id -> descriptor


class CompliancePackDescriptor:
    __slots__ = ('pack_id', 'name', 'regulatory_regime', 'gates',
                 'validation_rules', 'audit_retention_override',
                 'electronic_signature_required')

    def __init__(self, pack_id, name, regulatory_regime,
                 gates=None, validation_rules=None,
                 audit_retention_override=None,
                 electronic_signature_required=False):
        self.pack_id = pack_id
        self.name = name
        self.regulatory_regime = regulatory_regime
        self.gates = list(gates or [])
        self.validation_rules = list(validation_rules or [])
        self.audit_retention_override = audit_retention_override
        self.electronic_signature_required = electronic_signature_required


def install(descriptor):
    if descriptor.pack_id in _installed:
        raise CompliancePackAlreadyInstalled(
            f"Compliance pack '{descriptor.pack_id}' is already installed"
        )
    _installed[descriptor.pack_id] = descriptor


def uninstall(pack_id):
    if pack_id not in _installed:
        raise CompliancePackNotFoundError(pack_id)
    del _installed[pack_id]


def installed():
    return sorted(_installed.keys())


def get(pack_id):
    if pack_id not in _installed:
        raise CompliancePackNotFoundError(pack_id)
    return _installed[pack_id]


def clear():
    _installed.clear()


def is_esig_required(resource_type, action):
    """Check whether any installed compliance pack demands an e-signature
    for this (resource_type, action) tuple. Used by workflow step handlers."""
    for desc in _installed.values():
        if not desc.electronic_signature_required:
            continue
        for gate in desc.gates:
            if gate.get('resource_type') == resource_type and gate.get('action') == action:
                return True
    return False


def effective_audit_retention_days(base_days):
    """Compliance packs can only *extend* the platform default retention,
    never shorten it. Returns the max of the base and any pack override."""
    overrides = [d.audit_retention_override
                 for d in _installed.values()
                 if d.audit_retention_override is not None]
    return max([base_days] + overrides)
