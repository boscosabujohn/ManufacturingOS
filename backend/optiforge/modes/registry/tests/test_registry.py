import pytest

from optiforge.modes.registry.registry import (
    MODES, ModeNotAvailableError, ModeState, UnknownModeError,
    activate, built_modes, state_of, supported_modes,
)


def test_six_modes_declared():
    assert set(MODES.keys()) == {'eto', 'discrete', 'process', 'job_shop',
                                  'repetitive', 'mixed'}


def test_supported_returns_sorted_modes():
    assert supported_modes() == sorted(MODES.keys())


def test_eto_and_discrete_are_built():
    assert state_of('eto') == ModeState.BUILT
    assert state_of('discrete') == ModeState.BUILT


def test_other_four_are_scaffolded():
    for m in ('process', 'job_shop', 'repetitive', 'mixed'):
        assert state_of(m) == ModeState.SCAFFOLDED


def test_activate_built_modes_silently():
    assert activate('eto') == ModeState.BUILT
    assert activate('discrete') == ModeState.BUILT


@pytest.mark.parametrize('m', ['process', 'job_shop', 'repetitive', 'mixed'])
def test_activate_scaffolded_mode_rejected(m):
    with pytest.raises(ModeNotAvailableError, match="not available in this release"):
        activate(m)


def test_unknown_mode_raises():
    with pytest.raises(UnknownModeError):
        state_of('quantum')


def test_built_modes_returns_exactly_eto_and_discrete():
    assert built_modes() == ['discrete', 'eto']
