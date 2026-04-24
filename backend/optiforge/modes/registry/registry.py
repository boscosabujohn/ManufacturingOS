"""
Mode registry. Layer 3 modes may be scaffolded-only (enum value declared but
no extensions loaded) or fully built. Activating a scaffolded mode raises
ModeNotAvailableError.
"""


class ModeState:
    SCAFFOLDED = 'scaffolded'
    BUILT = 'built'


class ModeNotAvailableError(RuntimeError):
    """Raised when a scaffolded mode is activated."""


class UnknownModeError(LookupError):
    pass


MODES = {
    'eto': ModeState.BUILT,
    'discrete': ModeState.BUILT,
    'process': ModeState.SCAFFOLDED,
    'job_shop': ModeState.SCAFFOLDED,
    'repetitive': ModeState.SCAFFOLDED,
    'mixed': ModeState.SCAFFOLDED,
}


def state_of(mode):
    if mode not in MODES:
        raise UnknownModeError(f"Unknown mode '{mode}'. Known: {sorted(MODES)}")
    return MODES[mode]


def activate(mode):
    """
    Called when a tenant requests a mode. BUILT modes return silently;
    SCAFFOLDED modes raise ModeNotAvailableError with the PRD-named
    'mode not available in this release' message.
    """
    state = state_of(mode)
    if state == ModeState.SCAFFOLDED:
        raise ModeNotAvailableError(
            f"Mode '{mode}' not available in this release "
            f"(scaffolded only — extensions not yet built)"
        )
    return state


def supported_modes():
    return sorted(MODES.keys())


def built_modes():
    return sorted(m for m, s in MODES.items() if s == ModeState.BUILT)
