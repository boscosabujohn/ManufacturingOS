"""
Workflow runtime: resolves core definition + active-pack insertions into a
frozen definition snapshot, then drives instances through their state
machines via advance().
"""
import copy
import logging
from datetime import datetime, timezone as _tz

from .exceptions import (
    DuplicateInsertionError,
    InstanceTerminalError,
    InvalidTransitionError,
    UnknownStepError,
    UnknownWorkflowError,
)
from .models import WorkflowDefinition, WorkflowInsertion, WorkflowInstance
from .registry import workflow_registry
from .schema import validate_definition

logger = logging.getLogger(__name__)


def _get_active_definition(workflow_id):
    try:
        return WorkflowDefinition.objects.get(
            workflow_id=workflow_id, owner='core', is_active=True,
        )
    except WorkflowDefinition.DoesNotExist:
        raise UnknownWorkflowError(f"No active core definition for workflow_id='{workflow_id}'")


def resolve_definition(workflow_id, active_pack_ids):
    """
    Merge the active core definition with insertions owned by the given
    active packs. Returns a new dict — the stored definition is not mutated.

    Insertion semantics:
      - Each insertion point is a named anchor on an existing step
        ('after': <step_id>) or ('before': <step_id>).
      - The inserted step is placed into the steps list adjacent to its
        anchor, then the anchor's transitions are redirected through it
        with an implicit 'next' transition back to the original target.
    """
    core = _get_active_definition(workflow_id)
    resolved = copy.deepcopy(core.definition)

    insertions = list(
        WorkflowInsertion.objects.filter(
            workflow_id=workflow_id,
            pack_id__in=list(active_pack_ids),
            is_active=True,
        ).order_by('load_order', 'created_at')
    )

    ip_by_id = {ip['id']: ip for ip in resolved.get('insertion_points', [])}
    steps_by_id = {s['id']: s for s in resolved['steps']}

    seen_inserted_ids = set()
    for ins in insertions:
        anchor_meta = ip_by_id.get(ins.insertion_point)
        if not anchor_meta:
            logger.warning(
                "[WorkflowRuntime] pack '%s' references unknown insertion_point '%s' on workflow '%s'; skipped",
                ins.pack_id, ins.insertion_point, workflow_id,
            )
            continue

        step = copy.deepcopy(ins.step)
        step_id = step['id']
        if step_id in seen_inserted_ids or step_id in steps_by_id:
            raise DuplicateInsertionError(
                f"workflow '{workflow_id}': step id '{step_id}' is duplicated "
                f"(pack '{ins.pack_id}' at '{ins.insertion_point}')"
            )
        step.setdefault('owner_pack', ins.pack_id)

        anchor_step_id = anchor_meta.get('after') or anchor_meta.get('before')
        anchor_step = steps_by_id[anchor_step_id]
        on_event = anchor_meta.get('on_event')

        if 'after' in anchor_meta:
            # Intercept the named event's transition (or the first one, if unnamed)
            # so the inserted step sits between the anchor and the original target.
            transitions = anchor_step.get('transitions', [])
            target_idx = next(
                (i for i, t in enumerate(transitions) if on_event is None or t['on'] == on_event),
                None,
            )
            if target_idx is None:
                raise DuplicateInsertionError(
                    f"insertion_point '{ins.insertion_point}' names event '{on_event}' "
                    f"but step '{anchor_step_id}' has no such transition"
                )
            original_target = transitions[target_idx]['to']
            step.setdefault('transitions', [{'on': 'next', 'to': original_target}])
            transitions[target_idx] = {'on': transitions[target_idx]['on'], 'to': step_id}
        else:
            # Before: the anchor is reached via the inserted step's 'next' transition.
            # Any predecessors that used to target the anchor on this event now go through us.
            step.setdefault('transitions', [{'on': 'next', 'to': anchor_step_id}])
            for other in resolved['steps']:
                if other['id'] == anchor_step_id:
                    continue
                for i, t in enumerate(other.get('transitions', [])):
                    if t['to'] == anchor_step_id and (on_event is None or t['on'] == on_event):
                        other['transitions'][i] = {'on': t['on'], 'to': step_id}

        resolved['steps'].append(step)
        steps_by_id[step_id] = step
        seen_inserted_ids.add(step_id)

    # Re-validate the merged graph so pack insertions can't produce a bad resolved definition.
    validate_definition(resolved)
    return resolved, core.version


def start_instance(workflow_id, active_pack_ids=None, tenant_id=None, context=None):
    """Create a new WorkflowInstance with a frozen resolved definition snapshot."""
    active_pack_ids = list(active_pack_ids or [])
    resolved, version = resolve_definition(workflow_id, active_pack_ids)

    return WorkflowInstance.objects.create(
        workflow_id=workflow_id,
        definition_version=version,
        resolved_definition=resolved,
        tenant_id=tenant_id,
        current_step=resolved['initial_step'],
        status='running',
        history=[],
        context=context or {},
        active_packs=active_pack_ids,
    )


def _find_step(definition, step_id):
    for step in definition['steps']:
        if step['id'] == step_id:
            return step
    raise UnknownStepError(f"step '{step_id}' not found in resolved definition")


def _record_history(instance, from_step, event, to_step, note=None):
    instance.history = list(instance.history) + [{
        'from': from_step,
        'event': event,
        'to': to_step,
        'note': note,
        'at': datetime.now(_tz.utc).isoformat(),
    }]


def advance(instance, event):
    """
    Fire a transition on the instance. Invokes the target step's handler if
    one is registered. On pack-step failure the instance is marked 'failed'
    and the original PackStepFailedError is re-raised so callers can decide
    how to surface the pack attribution.
    """
    if instance.status != 'running':
        raise InstanceTerminalError(
            f"instance {instance.id} is '{instance.status}', cannot advance"
        )

    current_step = _find_step(instance.resolved_definition, instance.current_step)
    transition = next(
        (t for t in current_step.get('transitions', []) if t['on'] == event),
        None,
    )
    if not transition:
        raise InvalidTransitionError(
            f"no transition for event '{event}' on step '{instance.current_step}'"
        )

    target_step = _find_step(instance.resolved_definition, transition['to'])
    step_type = target_step.get('step_type')

    if step_type:
        try:
            workflow_registry.invoke(step_type, target_step['id'], instance.context)
        except Exception:
            _record_history(
                instance, instance.current_step, event, target_step['id'],
                note=f"handler failed on step_type='{step_type}'",
            )
            instance.status = 'failed'
            instance.save()
            raise

    _record_history(instance, instance.current_step, event, target_step['id'])
    instance.current_step = target_step['id']
    if target_step.get('terminal'):
        instance.status = 'completed'
    instance.save()
    return instance


def upsert_core_definition(definition, deactivate_previous=True):
    """
    Publish a new core definition version. Existing active version for the
    same workflow_id is deactivated (but not deleted — running instances
    don't care, they carry their own snapshot).
    """
    validate_definition(definition)
    if deactivate_previous:
        WorkflowDefinition.objects.filter(
            workflow_id=definition['workflow_id'], owner='core', is_active=True,
        ).update(is_active=False)
    return WorkflowDefinition.objects.create(
        workflow_id=definition['workflow_id'],
        version=definition['version'],
        owner='core',
        definition=definition,
        is_active=True,
    )
