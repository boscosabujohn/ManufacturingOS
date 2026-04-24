# Operator Runbook (Issue #68)

Cookbook for tenant provisioning, pack activation, incident response,
restore, and migration reversal. Intended for the on-call operator.

## 1. Provisioning a new tenant

1. `POST /api/v1/tenants/ { "name": "Acme Food Co" }` — creates a tenant
   in `provisioning` state.
2. `PATCH /api/v1/tenants/<id>/lifecycle/ { "action": "activate" }` —
   transitions to `active`. Must happen before pack activation.
3. Seed baseline master data:
   - ChartOfAccounts: run `core.finance.seed_base_coa(tenant_id)`.
   - Currencies: activate at least one `is_base=True` currency.
4. Create tenant admin via `optiforge.platform.identity.delegated_admin.create_tenant_user`.
5. Verify the tenant's RLS policy: `SELECT * FROM any_table` from a
   shell scoped to the new tenant returns zero rows (no data leakage
   from other tenants).

## 2. Activating a pack

`POST /api/v1/tenants/<tenant_id>/packs/activate/ { "pack_id": "kitchen-equipment", "pack_version": "0.1.0" }`

Contract: the activation endpoint is transactional — any step failure
rolls back. On failure the alert `pack_activation_rollback` fires; check
logs tagged `layer=platform module=tenancy operation=pack_activate`.

If activation repeatedly fails with `IncompatibleCoreVersion`, consult
[docs/release/compatibility-matrix.md](../release/compatibility-matrix.md).

## 3. Incident response (PRD-named alerts)

| Alert | Triage |
|---|---|
| `dlq_depth_exceeded` | Check the per-connector / per-channel DLQ. Identify the subscriber that's failing and drain manually via `event_bus.replay_from(...)` once root cause is fixed. |
| `hash_chain_break` | **Compliance-grade — page security lead.** Read `optiforge.platform.audit.tasks.verify_all_audit_chains()` output. Do not overwrite any audit rows. |
| `cross_tenant_query` | Dump the correlation_id + stack trace. Roll back the offending change; the tenancy seam is non-negotiable. |
| `pack_activation_rollback` | The pack activation already rolled back. Examine the stored last_error and the telemetry for the tenant. |
| `p95_latency_slo_breach` | Check `metrics.snapshot()['histograms']` for the module's latency; compare against SLO. Scale the bottleneck service. |
| `pack_error_rate_slo_breach` | Identify the pack from the pack_id label. Ship a point fix or deactivate the pack temporarily. |

## 4. Disaster recovery (issue #45)

See [dr-drill.md](./dr-drill.md) for the full drill. Sequence:

1. Restore Postgres from PITR (Point-In-Time Recovery) to timestamp T.
2. Restart tenancy service.
3. Drain the event-bus DLQ via `event_bus.replay_from(<event_type>, T, <pack_id>)`.
4. Verify the audit hash chain is intact:
   `verify_all_audit_chains()` must return `{'verified': N, 'failures': []}`.
5. Reactivate each tenant's packs from the TenantPackActivation table.

## 5. Migration reversal (issue #72)

1. Tag the release as `rollback_candidate`.
2. Run the module-specific reverse adapter:
   `optiforge.migrations.legacy_bridge.reverse.<module>_reverse_migrate`.
3. Archive the current-layer rows instead of deleting (retention policy).
4. Switch traffic back to legacy via feature flag
   `legacy_<module>_primary=True`.

## 6. Known-safe boundaries

- **Never** run `DELETE` directly on the `audit_auditrecord` table. Use
  `prune_audit_records()` which respects retention + archival.
- **Never** roll back a tenant past `archived` status. That state is
  terminal by design.
- **Never** commit a pack version bump without updating
  `docs/release/compatibility-matrix.md`.
