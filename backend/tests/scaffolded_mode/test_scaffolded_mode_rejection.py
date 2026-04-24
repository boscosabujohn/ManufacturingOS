"""
Issue #78 — scaffolded-mode rejection across API, UI, provisioning.
Backend surface covered here; frontend rejection is covered by a
`scaffoldedMode` prop in `apps/web/src/lib/mode-guard.ts` (not in this
repository's backend test harness).
"""
import pytest

from optiforge.modes.registry.registry import (
    MODES, ModeNotAvailableError, ModeState, activate, built_modes, state_of,
    supported_modes,
)


@pytest.mark.parametrize('mode', ['process', 'job_shop', 'repetitive', 'mixed'])
def test_provisioning_rejects_scaffolded_mode(mode):
    with pytest.raises(ModeNotAvailableError):
        activate(mode)


@pytest.mark.parametrize('mode', ['eto', 'discrete'])
def test_provisioning_accepts_built_modes(mode):
    assert activate(mode) == ModeState.BUILT


def test_api_surface_lists_only_six_modes():
    assert len(supported_modes()) == 6


def test_api_surface_built_set_is_eto_and_discrete_only():
    assert built_modes() == ['discrete', 'eto']


def test_registry_entries_split_evenly():
    built = sum(1 for v in MODES.values() if v == ModeState.BUILT)
    scaffolded = sum(1 for v in MODES.values() if v == ModeState.SCAFFOLDED)
    assert built == 2
    assert scaffolded == 4
