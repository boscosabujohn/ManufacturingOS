# ADR-0001: Five-layer architecture (Platform → Core → Modes → Compliance → Industry)

*Status: Accepted*
*Date: 2026-04-23*
*Deciders: Bosco*
*Related: [Brainstorm 2026-04-23](../brainstorms/2026-04-23-optiforge-layered-multi-industry.md), [PRD](../prds/optiforge-layered-multi-industry-architecture.md)*

## Context

OptiForge began as a 14-module ERP shaped around B3 MACBIS's commercial-kitchen-equipment ETO manufacturing. Two forces combine:

1. The current module set is **simultaneously too narrow** (missing QMS, PLM, CMMS/EAM, EHS, MES, S&OP, Field Service as distinct modules) **and too kitchen-specific** (BOQ, fascia, finishing QC, NSF-ANSI are baked into what should be horizontal modules).
2. The stated commercial ambition is **multi-industry** — discrete, process, job-shop, ETO, repetitive — not just commercial kitchen equipment.

Expanding the current shape without re-architecting produces a 22-module ERP that is still kitchen-shaped. Selling it to a pharma or automotive customer would require forking. Mature comparable systems (SAP S/4HANA Manufacturing, Infor CloudSuite Industrial, Plex MES, MS Dynamics 365 Manufacturing) became *products* rather than bespoke builds precisely by separating industry-agnostic core from pluggable industry extensions.

Not deciding now means every future industry costs roughly what the first one cost. Deciding now means the second industry costs ~20% of the first, and the third ~10%.

## Decision

OptiForge is structured as **five explicit layers, each depending only on layers below it:**

```
Layer 5  Industry Packs       Kitchen | Pharma | Auto | Aerospace | Food | …
Layer 4  Compliance Packs     21 CFR Part 11 | IATF 16949 | AS9100 | HACCP | …
Layer 3  Mode Extensions      Discrete | Process | Job-Shop | ETO | Repetitive
Layer 2  Core Modules         21 industry-agnostic modules across 12 domains (v1)
Layer 1  Platform             Identity, Tenancy, Audit, Events, API Gateway,
                              Integration Fabric, Workflow Engine, Document Store,
                              Notification, Extension Framework, Localisation,
                              Reporting Fabric
```

**The load-bearing contract:** a pack may *read* core entities, *extend* them via ten declared extension points, and *observe* core events — but it may not write directly to core tables, override core logic, or fork core code. If a pack needs something core doesn't expose, the answer is to add an extension point to core, not to patch core.

Cross-layer import violations are caught automatically by a CI linter (issue P1-01).

## Alternatives considered

### Alternative A — Flat module expansion (14 → 22 modules)

Add missing domains as peer modules; handle industry-specificity with flags and custom fields sprinkled across modules.

**Trade-off.** Ships fastest and is easiest to explain. **Violates the strict seam within 18 months** because kitchen-specific logic leaks into QMS, pharma-specific logic leaks into MES, and the code ends up worse than the status quo. Right for a team that has quietly abandoned the strict-seam commitment. **Rejected** — we have not abandoned the commitment.

### Alternative B — Five-layer architecture (**CHOSEN**)

Described above. Architecturally cleanest answer that honours strict seam while preserving ~80% of existing BRS investment.

**Trade-off.** Slower to first revenue because Layer 1 (platform) must be built before any industry pack can ship cleanly. Payoff: each subsequent industry costs ~20% of the first. Right for a product company with multi-industry ambition and runway to invest in the platform layer.

### Alternative C — Domain-driven bounded contexts

Abandon the module mental model; organise by bounded context (Customer & Demand, Product & Design, Supply, Inventory, Manufacturing Execution, Quality, Asset, Project, Field Service, People & Safety, Money, Orchestration, Intelligence, Platform). Each context owns data, exposes API, publishes events; cross-context communication via events/APIs only.

**Trade-off.** Cleanest long-term shape. Most disruptive now — forces re-specification of ~14 BRSes into ~14 context specs with different boundaries, demands strongest engineering discipline, without which it produces a distributed monolith worse than a regular monolith. **Deferred** — too aggressive for current BRS investment; remains the likely long-term destination reached by extracting contexts from Alternative B later.

## Consequences

### Easier

- A second industry pack (pharma, automotive, aerospace, food processing) does not require changes to platform or core — authored as a new Layer 5 composition.
- Kitchen-specific behaviour is discoverable in one place (the KitchenEquipment pack) rather than scattered across 14 modules.
- Compliance regimes (21 CFR Part 11, IATF 16949, AS9100, HACCP) compose orthogonally as Layer 4 packs without modifying core.
- Core refactoring is safe: as long as extension-point APIs stay stable, packs don't break.

### Harder

- Phase 1 (tracer bullet) must invest in platform services before any customer-visible feature ships. This is tempting to skip and politically costly to defend.
- Every module engineer must understand the seam rule. The cross-layer linter helps but does not substitute for understanding.
- Adding a new extension point to core costs a coordinated release; a pack cannot self-service this.
- The first industry pack (KitchenEquipment) bears the cost of proving the platform works.

### Obligations accepted

- A dedicated platform owner is named and funded from day one.
- The cross-layer lint canary (P1-01) is merge-blocking from commit zero.
- A "dummy industry pack" (TestIndustry) exists in the codebase to exercise extension points in CI — not optional.
- The architecture is re-audited quarterly for seam leaks.

### No-longer-possible

- Writing kitchen-specific fields directly onto core entities "just this once."
- Shipping a customer with kitchen-specific assumptions by editing core code.
- Shipping a v1 without platform services (they are not optional).

## References

- Brainstorm: [`docs/brainstorms/2026-04-23-optiforge-layered-multi-industry.md`](../brainstorms/2026-04-23-optiforge-layered-multi-industry.md) — sections "Alternatives considered" and "Chosen approach".
- PRD: [`docs/prds/optiforge-layered-multi-industry-architecture.md`](../prds/optiforge-layered-multi-industry-architecture.md) — opening resolution table (Q5 architecture commitment).
- Issue P1-01 ships the enforcement mechanism for this decision.
