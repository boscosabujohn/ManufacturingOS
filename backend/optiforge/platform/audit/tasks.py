"""
Celery tasks for audit and event bus production-grade features.
Phase 2: scheduled hash-chain verification, audit retention pruning, DLQ processing.
"""
import logging
from datetime import timedelta
from django.utils import timezone

logger = logging.getLogger(__name__)


def verify_all_audit_chains():
    """
    Scheduled task: verify hash chains for all entities that have been mutated recently.
    In production this would be a Celery beat task.
    """
    from optiforge.platform.audit.models import AuditRecord

    # Get distinct entity combinations with recent activity
    recent = AuditRecord.objects.filter(
        timestamp__gte=timezone.now() - timedelta(hours=24)
    ).values('entity_type', 'entity_id').distinct()

    failures = []
    verified = 0

    for entry in recent:
        is_valid, broken_id = AuditRecord.verify_chain(entry['entity_type'], entry['entity_id'])
        if not is_valid:
            failures.append({
                'entity_type': entry['entity_type'],
                'entity_id': entry['entity_id'],
                'broken_record_id': str(broken_id),
            })
            logger.error(
                f"[AUDIT CHAIN BREAK] entity_type={entry['entity_type']} "
                f"entity_id={entry['entity_id']} broken_record={broken_id}"
            )
        else:
            verified += 1

    logger.info(f"[AUDIT VERIFICATION] Verified {verified} chains, {len(failures)} failures.")
    return {'verified': verified, 'failures': failures}


def prune_audit_records(retention_days=365):
    """
    Scheduled task: delete audit records older than retention_days.
    """
    from optiforge.platform.audit.models import AuditRecord

    cutoff = timezone.now() - timedelta(days=retention_days)
    deleted_count, _ = AuditRecord.objects.filter(timestamp__lt=cutoff).delete()
    logger.info(f"[AUDIT PRUNING] Deleted {deleted_count} records older than {retention_days} days.")
    return {'deleted': deleted_count, 'cutoff': cutoff.isoformat()}
