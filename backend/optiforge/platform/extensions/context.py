"""
Pack-caller context.

When a pack-registered callable (event handler, step handler, validation rule,
connector, …) is about to run, the runtime wraps the invocation in
`with pack_caller(pack_id):`. Core repositories consult this context: when a
pack is the caller, writes to core tables are rejected with a clear error.
"""
import contextvars
import contextlib

_pack_caller = contextvars.ContextVar('optiforge_pack_caller', default=None)


def current_pack_caller():
    return _pack_caller.get()


@contextlib.contextmanager
def pack_caller(pack_id):
    """Mark the currently-running call as pack-originated."""
    token = _pack_caller.set(pack_id)
    try:
        yield
    finally:
        _pack_caller.reset(token)


class CoreWriteFromPackError(PermissionError):
    """Raised when a pack attempts to write directly to a core repository."""

    def __init__(self, pack_id, model_name):
        self.pack_id = pack_id
        self.model_name = model_name
        super().__init__(
            f"Pack '{pack_id}' attempted to write to core model '{model_name}'. "
            f"Packs must use extension points — not direct core-table writes."
        )
