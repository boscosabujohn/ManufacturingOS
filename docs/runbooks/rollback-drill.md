# Rollback Drill (Issue #72)

Reverse-migrate one module in staging within the 2-h time budget.

## Module under drill

For v1 launch, the CRM module (issue #64) is the designated drill
target. Its reverse adapters live at
`optiforge.migrations.legacy_bridge.reverse.crm_*` (stubs to be shipped
alongside real legacy data imports).

## Budget

| Stage | Target time |
|---|---|
| Snapshot-and-freeze | 15 min |
| Adapter run (reverse direction) | 45 min |
| Smoke tests | 30 min |
| Traffic flip (feature flag) | 15 min |
| Documentation + runbook entry | 15 min |
| **Total** | **2 h** |

If any stage exceeds its budget, the drill is halted and documented as
a failure.

## Pass criteria

- Module data written to the legacy row shape for 100% of sampled
  tenants.
- Zero audit-hash-chain breaks.
- Core module continues to serve read traffic during the drill.
- Feature flag flips traffic without a deploy.
