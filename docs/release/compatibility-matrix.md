# Pack-Version Compatibility Matrix (Issue #33)

This file is the source of truth for which pack versions run against which
core versions. The manifest validator (`extensions/manifest.py`)
enforces `depends_on.core_version_range` on every pack activation and
fails fast on mismatch.

## v1 matrix

| Pack | Pack version | Supported core range | Mode requirement | Compliance requirement |
|---|---|---|---|---|
| KitchenEquipment | 0.1.0 | `>=0.1.0,<1.0.0` | ETO + Discrete active | none (pack owns NSF rules) |
| TestIndustry | 0.1.0 | `>=0.1.0,<1.0.0` | any | none |

## Fail-fast verification

- Unit: `optiforge/platform/extensions/tests/test_manifest.py::test_version_mismatch_rejected`
- Contract: `tests/contract/test_extension_points.py` (any new pack must
  appear here before it ships).

## Release cadence

1. Core minor-version bump → pack dependencies refresh; every active pack
   re-validated in CI.
2. Core major-version bump → every pack must publish a new version with
   the new range; activation of outdated packs fails with an
   `IncompatibleCoreVersion` error.
