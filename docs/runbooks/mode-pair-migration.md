# Mode-Pair Migration Playbook — ETO + Discrete → add Process (Issue #79)

When a customer currently running the ETO + Discrete pair needs to
activate a third manufacturing mode (e.g., Process), this is the dry-run.

## Preconditions

- [ ] Target mode is BUILT (not SCAFFOLDED). Verify via
      `optiforge.modes.registry.registry.state_of(mode)`.
- [ ] Pack compatibility confirmed against the new mode in the
      compatibility matrix.
- [ ] Staging tenant fully seeded with production-like data.

## Dry-run sequence (staging)

1. **Freeze:** Pause tenant onboarding + pack activation endpoints.
2. **Snapshot:** Capture a Postgres dump + `tenant.status` + every
   `TenantPackActivation` row.
3. **Register the new mode in the tenant's settings**:
   `TenantConfigSetting.objects.update_or_create(
       tenant=t, key='active_modes', value={'value': ['eto', 'discrete', 'process']})`
4. **Provision mode-specific master data** (e.g., Process recipes
   as BOM variants, batch-numbering rules).
5. **Replay the last 30 days of `SalesOrderCreated` events through the
   new mode handler** to validate no routing regression.
6. **Smoke test:** Run ACERO demand-half + execution-half with a
   Process-flavoured sales order.
7. **Thaw:** Resume onboarding. Record any findings.

## Rollback plan

- Decommission the mode via
  `TenantConfigSetting.update(value={'value': ['eto', 'discrete']})`
- No schema migration is required (modes are data, not code).
- Running instances binding to the new mode finish on their pinned
  workflow versions; new instances revert to the old mode pair
  immediately.

## Pass criteria

- All ACERO tests green.
- Zero audit-hash-chain breaks.
- p95 latency for `sales.so.create` within SLO band through the new
  mode.
- Rollback drill (see [rollback-drill.md](./rollback-drill.md)) passes
  within its 2-h budget.
