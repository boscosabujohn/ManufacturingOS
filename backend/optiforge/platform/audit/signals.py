"""
Django signals to automatically create audit records on model mutations.
"""
from django.db.models.signals import post_save, pre_delete
from django.dispatch import receiver
from django.forms.models import model_to_dict

from optiforge.platform.tenancy.context import get_current_tenant_id
from optiforge.platform.audit.models import AuditRecord


def _serialize(instance):
    """Serialize a model instance to a JSON-safe dict."""
    try:
        d = model_to_dict(instance)
        # Convert non-serializable types
        for k, v in d.items():
            if hasattr(v, 'isoformat'):
                d[k] = v.isoformat()
            elif hasattr(v, 'pk'):
                d[k] = str(v.pk)
            elif not isinstance(v, (str, int, float, bool, list, dict, type(None))):
                d[k] = str(v)
        return d
    except Exception:
        return {'id': str(getattr(instance, 'pk', 'unknown'))}


def create_audit_for_save(sender, instance, created, **kwargs):
    """Post-save signal handler: creates an audit record for CREATE or UPDATE."""
    # Don't audit the AuditRecord model itself
    if sender is AuditRecord:
        return

    # Only audit tenant-aware models
    tenant_id = get_current_tenant_id()
    if not tenant_id:
        tenant_id = getattr(instance, 'tenant_id', None)
    if not tenant_id:
        return

    entity_type = f"{sender._meta.app_label}.{sender._meta.model_name}"
    entity_id = str(instance.pk)
    operation = 'CREATE' if created else 'UPDATE'
    after_state = _serialize(instance)

    # For updates, we'd ideally have the before_state from a pre_save.
    # For Phase 1 we record after_state only on CREATE, and both on UPDATE
    # when available via the _audit_before_state attribute.
    before_state = getattr(instance, '_audit_before_state', None)

    AuditRecord.create_record(
        tenant_id=tenant_id,
        entity_type=entity_type,
        entity_id=entity_id,
        operation=operation,
        before_state=before_state,
        after_state=after_state,
        layer=getattr(instance, '_audit_layer', 'core'),
    )


def create_audit_for_delete(sender, instance, **kwargs):
    """Pre-delete signal handler: creates an audit record for DELETE."""
    if sender is AuditRecord:
        return

    tenant_id = get_current_tenant_id()
    if not tenant_id:
        tenant_id = getattr(instance, 'tenant_id', None)
    if not tenant_id:
        return

    entity_type = f"{sender._meta.app_label}.{sender._meta.model_name}"
    entity_id = str(instance.pk)
    before_state = _serialize(instance)

    AuditRecord.create_record(
        tenant_id=tenant_id,
        entity_type=entity_type,
        entity_id=entity_id,
        operation='DELETE',
        before_state=before_state,
        after_state=None,
        layer=getattr(instance, '_audit_layer', 'core'),
    )


# We connect these signals broadly; only tenant-aware models with a tenant context will actually produce records.
post_save.connect(create_audit_for_save)
pre_delete.connect(create_audit_for_delete)
