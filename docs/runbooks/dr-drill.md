# Disaster-Recovery Drill (Issue #45)

**Scope:** Postgres PITR + tenancy restart + DLQ replay. Runs quarterly
in staging.

## Pre-drill checklist

- [ ] Confirm `archive_expired_online` ran in the last 24 h (audit
      retention is clean before drilling).
- [ ] Dump a snapshot of `tenant.status` distribution — compare after.
- [ ] Note current `dlq_depth` across every subscriber + connector.

## Drill steps

### Step 1 — Postgres PITR

1. Identify a target timestamp T (typically 15 min ago).
2. Trigger PITR restore on the staging cluster.
3. Record restore duration. SLO: under 30 minutes for a 50 GB db.

### Step 2 — Tenancy restart

1. Restart all Django app processes against the restored DB.
2. Verify tenant context middleware initialises cleanly for every
   tenant by hitting `GET /api/v1/tenants/<id>/` for a sample of five.

### Step 3 — DLQ replay

For each (event_type, subscriber) that had queued messages at time T:

```python
event_bus.replay_from(event_type, from_timestamp=T, pack_id=pack_id)
```

Verify the subscriber's status shows `delivered` for each replayed
event. DLQ should drain to zero. Record replay duration.

### Step 4 — Audit integrity

```python
from optiforge.platform.audit.tasks import verify_all_audit_chains
result = verify_all_audit_chains()
assert result['failures'] == []
```

### Step 5 — Pack reactivation

For every `TenantPackActivation(is_active=True)`, confirm the pack's
registered extension points still appear via
`extension_points.list_for_pack(pack_id)`. If anything is missing,
rerun `packs.<pack_id>.loader.load_pack()`.

## Post-drill

- Record all timings in the drill log (DR SLO target: 2 h end-to-end).
- File any failure modes as GitHub issues with the `resilience` label.
- Archive the drill output under `/docs/runbooks/dr-drills/<date>.md`.

## Automated harness

See `backend/tests/dr_drill/test_dr_drill_components.py` — individual
components of the drill (replay, audit verification, pack
reactivation) are covered by programmatic tests.
