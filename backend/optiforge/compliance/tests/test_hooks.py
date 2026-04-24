"""
Issue #86 — compliance-pack extension hooks verified via a throwaway CI
pack. Proves Layer 4 can stand up a 21-CFR-Part-11-ish regime without
any core change.
"""
import pytest

from optiforge.compliance import hooks
from optiforge.compliance.hooks import CompliancePackDescriptor


@pytest.fixture(autouse=True)
def clean_compliance():
    hooks.clear()
    yield
    hooks.clear()


def _throwaway_pack():
    return CompliancePackDescriptor(
        pack_id='ci-throwaway-regime',
        name='CI Throwaway Compliance Regime',
        regulatory_regime='ci-only',
        gates=[
            {'resource_type': 'quality.audit', 'action': 'approve'},
        ],
        validation_rules=[],
        audit_retention_override=10 * 365,  # 10 years
        electronic_signature_required=True,
    )


def test_install_and_list():
    hooks.install(_throwaway_pack())
    assert hooks.installed() == ['ci-throwaway-regime']


def test_cannot_install_twice():
    hooks.install(_throwaway_pack())
    with pytest.raises(hooks.CompliancePackAlreadyInstalled):
        hooks.install(_throwaway_pack())


def test_uninstall_removes_pack():
    hooks.install(_throwaway_pack())
    hooks.uninstall('ci-throwaway-regime')
    assert hooks.installed() == []


def test_esig_required_when_pack_demands_it():
    hooks.install(_throwaway_pack())
    assert hooks.is_esig_required('quality.audit', 'approve')
    assert not hooks.is_esig_required('quality.audit', 'read')


def test_esig_not_required_without_pack():
    assert not hooks.is_esig_required('any', 'any')


def test_retention_can_only_be_extended_by_packs():
    hooks.install(_throwaway_pack())
    assert hooks.effective_audit_retention_days(5 * 365) == 10 * 365
    # When the base is higher than the pack's override, the base wins.
    assert hooks.effective_audit_retention_days(20 * 365) == 20 * 365
