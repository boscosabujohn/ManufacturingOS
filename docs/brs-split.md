# BRS Split: Existing 14 BRSes → Core vs KitchenEquipment Pack

Issue #46 — mapping of the existing B3 MACBIS Business Requirements
Specifications onto the new 5-layer architecture. Core-vs-pack split
follows PRD resolution Q2: existing BRSes are primarily *KitchenEquipment
pack + ETO mode* requirements; new thin core specs capture only the
horizontal, mode-agnostic behaviour.

## Split table

| # | Existing BRS | Core module | Pack additions (KitchenEquipment) | ETO-mode additions |
|---|---|---|---|---|
| 1 | CRM | `core.crm` — leads/opportunities/accounts/contacts | — | — |
| 2 | Sales | `core.sales` — CustomerRequirement, Quotation, SO, PriceBook | fascia/cladding on Item; kitchen-specific quote sidebar | ETO mode field on SO |
| 3 | Estimation & Costing | → folded into `core.finance` (Phase 4, Q8 deferral) | finishing-cost calculator | milestone billing |
| 4 | PPG / Production | `core.production_planning` (Phase 4) + `core.mes` (Phase 4) | — | project-WO link, retention |
| 5 | Procurement | `core.procurement` — RFQ, PO, GRN, supplier | approved supplier lists for NSF components | — |
| 6 | Stores / Warehouse | `core.inventory` + `core.wms` — lot/batch/serial, bins | — | — |
| 7 | Projects (PPC) | `core.project` — WBS, milestones | — | project-WO link |
| 8 | Logistics | `core.logistics` (Phase 4) | — | commissioning-aware dispatch |
| 9 | Commissioning | `core.commissioning` (Phase 4) | finishing QC gate, kitchen commissioning protocols | handover milestone |
| 10 | HRM | `core.hr` — employees, departments, role assignments | — | — |
| 11 | Support | `core.support` (Phase 4) | — | — |
| 12 | IT-Admin | `core.it_admin` — tenant settings, admin audit | — | — |
| 13 | Finance | `core.finance` (Phase 4) | — | milestone billing, LD, retention |
| 14 | Workflow | `platform.workflow` (platform, not core) | finishing_review_step insertion | (modes declare insertion points) |

## Coverage assertion (verified in ACERO)

- Every core module in rows 1, 2, 5, 6, 7, 10, 12 ships in Phase 3 with
  at least one tenant-scoped CRUD test passing.
- The KitchenEquipment pack registers through all ten Extension Framework
  points (verified in `tests/contract/test_extension_points.py`).
- ETO mode delivers Design Lock, Change Order with cost impact,
  project-WO link, milestone billing, retention, LD, site survey
  (verified in `optiforge/modes/eto/tests/test_eto.py`).

## Migration path (Phase 4)

The 14 existing BRSes have no production data in this repository yet; the
Phase 4 "Migration: <module>" issues ship a data-shape compatibility layer
(`core.<module>.migration.adapters.*`) that lets an eventual B3 MACBIS
production import land cleanly. The 30-day reverse-migration gate (issue
#72) exercises one module end-to-end as the safety net.
