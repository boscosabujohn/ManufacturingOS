# PRD Open Questions Resolution (Issue #24)

The PRD left eight open questions; #24 gates Phase 5 release on
resolution of the five remaining commercial + ownership opens.
Four were committed during architecture work; four remained open
heading into Phase 5.

## Resolutions taken in Phase 5

| # | Question | Resolution | Owner |
|---|---|---|---|
| Q4 | "OptiForge Generic" SKU | **Deferred to post-GA.** v1 goes to market as **OptiForge (KitchenEquipment)** branded specifically for B3 MACBIS. A horizontal SKU lands when the second industry pack ships. | Bosco |
| Q7 | Commercial model for packs | **Pack licensing bundled with core for v1.** Packs are not individually billable in v1; pricing is a per-tenant subscription that implicitly includes the one active industry pack. A per-pack billing SKU lands at the same time as Q4's horizontal SKU. | Bosco |
| — | Integration priority | **Priority set:** (1) QuickBooks (Finance export), (2) Shopify (demand inflow), (3) Stripe (AR capture), (4) FedEx (Logistics dispatch). PayPal deferred. | Bosco |
| — | Named platform owner | **Bosco (KreupAI Technologies LLC)** named as platform owner of record. | Bosco |
| — | ACERO suite ownership | **QA team with review from platform owner.** ACERO test ownership rotates quarterly among the QA leads; platform owner reviews additions to the harness. | Bosco |

## Cross-reference

- Q1 (mode combinations), Q2 (BRS disposition), Q3 (compliance packs),
  Q5 (tenancy), Q6 (MES / Digital Twin), Q8 (core module count) were
  resolved during the original PRD — see the resolution table in
  `docs/new_changes/optiforge-layered-multi-industry-architecture.md`.

## Gate

Phase 5 issue #24 is closed once every row above has a non-"TBD"
resolution and a named owner. As of 2026-04-24 this is complete.
