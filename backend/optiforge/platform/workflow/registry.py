"""
Step-handler registry for the workflow engine.

Packs register handlers by (step_type, pack_id). The runtime looks up the
handler when a step with that step_type is entered. Handler failures are
wrapped in PackStepFailedError so the owning pack is surfaced in logs
and error envelopes.
"""
import logging

from .exceptions import PackStepFailedError

logger = logging.getLogger(__name__)


class _StepHandlerRegistry:
    """Singleton registry mapping step_type -> (pack_id, handler_callable)."""

    def __init__(self):
        self._handlers = {}

    def register(self, step_type, pack_id, handler):
        """
        Register a step handler. Last registration wins — packs can be reloaded
        without crashing — but we log a warning when a re-registration replaces
        a different pack's handler.
        """
        existing = self._handlers.get(step_type)
        if existing and existing[0] != pack_id:
            logger.warning(
                "[WorkflowRegistry] step_type '%s' was owned by '%s'; now replaced by '%s'",
                step_type, existing[0], pack_id,
            )
        self._handlers[step_type] = (pack_id, handler)

    def get(self, step_type):
        """Return (pack_id, handler) or None when nothing is registered."""
        return self._handlers.get(step_type)

    def invoke(self, step_type, step_id, context):
        """
        Invoke the handler for a step_type. Returns the handler result.
        Core step_types (e.g. 'core.noop') need no handler — absence is fine.
        Pack-owned step_types raise PackStepFailedError on failure so the
        pack attribution survives through the call stack.
        """
        entry = self._handlers.get(step_type)
        if entry is None:
            return None
        pack_id, handler = entry
        try:
            from optiforge.platform.extensions.context import pack_caller
            with pack_caller(pack_id):
                return handler(step_id=step_id, step_type=step_type, context=context)
        except Exception as exc:
            logger.error(
                "[WorkflowRegistry] step handler failed: pack=%s step=%s type=%s err=%s",
                pack_id, step_id, step_type, exc,
            )
            raise PackStepFailedError(
                pack_id=pack_id, step_id=step_id, step_type=step_type, cause=exc,
            ) from exc

    def clear(self):
        self._handlers.clear()

    def registered_types(self):
        return list(self._handlers.keys())


workflow_registry = _StepHandlerRegistry()
