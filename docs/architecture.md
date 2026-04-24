# OptiForge Architecture (Phase 5 frozen version)

Issue #47 deliverable. This document is the single architecture reference
for v1. It supersedes the Phase 1 tracer-bullet README section.

## Layer model

```
┌─────────────────────────── Layer 5: Industry packs ───────────────────────┐
│  KitchenEquipment (B3 MACBIS, v1 only)                                    │
└─────────────────────────── depends on ────────────────────────────────────┘
┌─────────────────────────── Layer 4: Compliance packs ─────────────────────┐
│  Scaffolded only in v1 — no packs authored.                               │
└─────────────────────────── depends on ────────────────────────────────────┘
┌─────────────────────────── Layer 3: Mode extensions ──────────────────────┐
│  ETO + Discrete (BUILT) | Process, Job-Shop, Repetitive, Mixed (SCAFFOLDED)│
└─────────────────────────── depends on ────────────────────────────────────┘
┌─────────────────────────── Layer 2: Core modules (21 total) ──────────────┐
│ CRM · Sales (+CPQ) · Procurement · Inventory · WMS · Project · HR · PLM   │
│ IT-Admin · S&OP · CMMS · EHS · Production Planning (+Routing)             │
│ MES · Finance (+Estimation) · QMS · Analytics · Field Service             │
│ Commissioning · Logistics · Support                                       │
└─────────────────────────── depends on ────────────────────────────────────┘
┌─────────────────────────── Layer 1: Platform services ────────────────────┐
│ tenancy · identity · audit · extensions · events · workflow · notifications│
│ reporting · documents · integration · api_gateway · observability         │
│ localisation                                                              │
└───────────────────────────────────────────────────────────────────────────┘
```

## Load-bearing rule

A pack (Layer 5) may:
- **Read** core entities.
- **Extend** core via the ten declared extension points.
- **Observe** core events.

A pack may NOT:
- **Write** to core tables — enforced at the repository layer via
  `optiforge.platform.extensions.context.pack_caller` and
  `BaseTenantRepository.core_owned`. Violations raise
  `CoreWriteFromPackError`.
- **Override** core logic.
- **Fork** core code.

## Extension-point catalogue

Ten declared points, all covered by TestIndustry in CI:

| # | Point | Purpose | Example (KitchenEquipment) |
|---|---|---|---|
| 1 | `entity_attributes` | Per-entity JSON fields | `Item.fascia_type`, `Item.cladding_type` |
| 2 | `workflow_state` | Workflow state insertions | finishing_review_step |
| 3 | `screen_slot` | UI region + component | FinishingQCPanel, SiteSurveyCapture |
| 4 | `master_data_seed` | Per-tenant seed data | kitchen_categories, kitchen_commissioning_protocols |
| 5 | `workflow_step_handler` | Runtime callable for a step_type | kitchen.finishing_review |
| 6 | `validation_rule` | Entity validators | NSF fascia validator, NSF execution rules |
| 7 | `report_template` | BI / PDF / XLSX reports | kitchen_warranty_registration |
| 8 | `integration_connector` | Source-type parsers & external connectors | boq_import parser |
| 9 | `event_subscription` | Subscriber for domain events | CustomerRequirementCreated |
| 10 | `permission_scope` | ABAC scope declarations | kitchen.restricted_action |

## Pack authoring

1. Manifest: `packs/<pack_id>/manifest.py` with `id`, `version`,
   `depends_on.core_version_range`, `extends`.
2. Loader: `packs/<pack_id>/loader.py::load_pack()` is idempotent, called
   from app startup + tenant pack activation.
3. Every pack must have a contract test under `tests/contract/` exercising
   at least the extension points it declares.

## Versioning + compatibility matrix

See [release/compatibility-matrix.md](./release/compatibility-matrix.md).
