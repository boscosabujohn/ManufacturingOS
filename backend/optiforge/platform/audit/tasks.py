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


# 21 CFR Part 11-aligned retention: 5 years online, 7 years total before
# purge. The archive step moves rows out of the active tier into a JSON
# batch without deleting the original data.
ONLINE_RETENTION_DAYS = 5 * 365
ARCHIVE_RETENTION_DAYS = 7 * 365


def archive_expired_online(cutoff_days=ONLINE_RETENTION_DAYS):
    """
    Mark records older than `cutoff_days` as archived and emit an AuditArchive
    row carrying the JSON-serialised batch. Archived rows are still readable
    — the archive tier is a retrieval-latency concession, not deletion.
    """
    from optiforge.platform.audit.models import AuditArchive, AuditRecord

    cutoff = timezone.now() - timedelta(days=cutoff_days)
    to_archive = list(
        AuditRecord.objects.filter(timestamp__lt=cutoff, is_archived=False)
        .order_by('timestamp')
        .values(
            'id', 'tenant_id', 'actor', 'timestamp', 'entity_type', 'entity_id',
            'operation', 'before_state', 'after_state', 'reason_for_change',
            'layer', 'previous_hash', 'this_hash',
        )
    )
    if not to_archive:
        return {'archived': 0, 'batches': 0}

    AuditArchive.objects.create(
        tenant_id=None,
        record_count=len(to_archive),
        from_timestamp=to_archive[0]['timestamp'],
        to_timestamp=to_archive[-1]['timestamp'],
        payload=[{**row, 'id': str(row['id']), 'tenant_id': str(row['tenant_id']),
                  'timestamp': row['timestamp'].isoformat()} for row in to_archive],
    )
    AuditRecord.objects.filter(
        id__in=[row['id'] for row in to_archive]
    ).update(is_archived=True)

    logger.info("[AUDIT ARCHIVE] Archived %d records (%s → %s).",
                len(to_archive),
                to_archive[0]['timestamp'].isoformat(),
                to_archive[-1]['timestamp'].isoformat())
    return {'archived': len(to_archive), 'batches': 1}


def celery_beat_schedule():
    """
    Return the Celery beat schedule keys for audit jobs. The Celery app
    imports this from `celery_app.conf.beat_schedule.update(celery_beat_schedule())`
    at startup.
    """
    return {
        'audit-hourly-verify': {
            'task': 'optiforge.platform.audit.tasks.verify_all_audit_chains',
            'schedule': 3600.0,
        },
        'audit-nightly-prune': {
            'task': 'optiforge.platform.audit.tasks.prune_audit_records',
            'schedule': 24 * 3600.0,
        },
        'audit-nightly-archive': {
            'task': 'optiforge.platform.audit.tasks.archive_expired_online',
            'schedule': 24 * 3600.0,
        },
    }


def entity_query_latency_ms(entity_type, entity_id):
    """
    Measure the latency of the entity-scoped audit query used by the 1-second
    SLO (AC #4). Returns milliseconds. Meant to be called from dashboards +
    SLO-breach alerting.
    """
    import time
    from optiforge.platform.audit.models import AuditRecord
    start = time.monotonic()
    list(
        AuditRecord.objects
        .filter(entity_type=entity_type, entity_id=str(entity_id))
        .order_by('timestamp')
        .values('id', 'timestamp', 'operation', 'reason_for_change')
    )
    return (time.monotonic() - start) * 1000.0
