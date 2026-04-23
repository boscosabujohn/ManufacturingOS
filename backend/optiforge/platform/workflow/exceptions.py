"""Workflow engine exceptions with pack attribution."""


class WorkflowValidationError(ValueError):
    """Raised when a workflow definition or insertion fails schema validation."""


class UnknownWorkflowError(LookupError):
    """Raised when no active definition exists for a workflow_id."""


class UnknownStepError(LookupError):
    """Raised when the runtime cannot resolve a step id on the resolved definition."""


class InvalidTransitionError(ValueError):
    """Raised when an event does not correspond to any transition on the current step."""


class InstanceTerminalError(ValueError):
    """Raised when advance() is called on an instance already in a terminal step."""


class PackStepFailedError(RuntimeError):
    """
    Raised when a pack-inserted step handler fails. Carries the owning pack_id
    so failures are attributable in logs, metrics, and error envelopes.
    """

    def __init__(self, pack_id, step_id, step_type, cause):
        self.pack_id = pack_id
        self.step_id = step_id
        self.step_type = step_type
        self.cause = cause
        super().__init__(
            f"Pack '{pack_id}' step '{step_id}' (type={step_type}) failed: {cause}"
        )


class DuplicateInsertionError(ValueError):
    """Raised when two packs insert a step with the same id at the same insertion point."""
