# OptiForge — Layered Multi-Industry Architecture

**Date:** 2026-04-23
**Status:** Brainstormed — ready for PRD
**Author:** Bosco (B3 MACBIS / KreupAI Technologies LLC)

---

## Context and problem

OptiForge (also referred to in the project as ManufacturingOS and B3 MACBIS ERP) today is a kitchen-equipment manufacturer's ERP structured into 14 modules: CRM, Sales, Estimation & Costing, PPG/Production, Procurement, Stores/Warehouse (PPS), Projects (PPC), Logistics, Commissioning, HRM, Support, IT-Admin, Finance, Workflow. The UI additionally surfaces "Quality" and an "Industry 4.0 / Digital Twin" layer, but neither has a matching Business Requirements Specification. Business framing, pain points (ACERO design/production issues, INTEGRA logistics issues), customer profile (restaurants, hospitals, food courts, corporate cafeterias), and vocabulary (BOQ, fascia, cladding tile, isometric drawings) are deeply tied to commercial kitchen cabinetry as an engineer-to-order business.

The user's stated ambition is for OptiForge to be usable for **any manufacturing industry** — covering discrete, process, job-shop, ETO, and repetitive modes — not just commercial kitchen equipment. This brainstorm pressure-tests that ambition, identifies the gaps between the current documentation and that goal, and agrees on the structural shape that honours the ambition without discarding the work already done.

The real problem, surfaced during Socratic dialogue, is that **the existing 14-module scope is simultaneously too narrow (missing entire domains like QMS, PLM, CMMS, EHS, MES, S&OP, Field Service) and too kitchen-specific (BOQ, fascia, finishing QC baked into what should be generic core)**. Expanding without re-architecting would produce a 22-module kitchen-shaped system. The user committed to a strict core/pack boundary: zero industry-specific logic in core, everything industry-specific in pluggable packs. That commitment drives the rest of the design.

---

## Expert lens

Approached as a manufacturing ERP/MES solution architect with cross-industry experience (discrete, process, job-shop, ETO, repetitive) and familiarity with how mature systems cover the ground: SAP S/4HANA Manufacturing, Infor CloudSuite Industrial, Plex MES, Odoo MRP, Microsoft Dynamics 365 Manufacturing, NetSuite SuiteSuccess. The frame used throughout: a manufacturing ERP becomes a *product* (as opposed to a bespoke build) only when its core is industry-agnostic and its industry-specific behaviour lives in composable extension layers. The frame was proposed at the start of the conversation and the user agreed.

---

## Decisions made during the brainstorm

| # | Question | Decision |
|---|---|---|
| Q1 | Industry scope ambition | **All manufacturing modes** (discrete + process + job-shop + ETO + repetitive) |
| Q2 | Depth of re-abstraction | **Industry-pack layer** — core stays generic, each industry gets a pluggable pack |
| Q3 | Strictness of core/pack seam | **Strict seam** — core has zero industry-specific fields or logic |
| Q4 | Gap analysis shape | **Complete gap list**, prioritised by severity (P0–P3) |
| Q5 | Structural shape | **Alternative B — Layered architecture** (Platform → Core → Modes → Compliance Packs → Industry Packs) |
| Q6 | Final design approval | **Save brainstorm, hand off to `kreupai-write-prd`** |

---

## Alternatives considered

### Alternative A — Flat module expansion (14 → 22 modules)
Add missing domains as peer modules; handle industry-specificity with flags and custom fields sprinkled across modules.
- *Trade-off:* Ships fastest and is easiest to explain. **Violates the strict seam within 18 months** because kitchen-specific logic leaks into QMS, pharma-specific logic leaks into MES, and the code ends up worse than the status quo even if the nav looks cleaner.
- *Right for:* A team that has quietly abandoned the strict-seam commitment. **Rejected** given the user's Q3 answer.

### Alternative B — Layered architecture (Platform → Core → Modes → Compliance Packs → Industry Packs) — **CHOSEN**
Five explicit layers, each depending only downward. Core is purely horizontal and industry-agnostic. Modes (Layer 3) add mode-specific masters and workflows. Compliance packs (Layer 4) are orthogonal add-ons. Industry packs (Layer 5) are thin compositions of mode + compliance + taxonomy + screen customisations.
- *Trade-off:* The architecturally cleanest answer that honours strict seam while preserving ~80% of existing BRS investment. **Slower to first revenue** because platform layer (Layer 1) must be built before any industry pack can ship cleanly. Payoff: each subsequent industry costs ~20% of the first, then ~10%.
- *Right for:* A product company with multi-industry ambition and runway to invest in the platform layer. **Selected.**

### Alternative C — Domain-driven bounded contexts
Abandon the module mental model; organise by bounded context (Customer & Demand, Product & Design, Supply, Inventory, Manufacturing Execution, Quality, Asset, Project, Field Service, People & Safety, Money, Orchestration, Intelligence, Platform). Each context owns data, exposes API, publishes events; cross-context communication via events/APIs only.
- *Trade-off:* Cleanest long-term shape; aligns with how SAP S/4HANA rebuilt from R/3 and Oracle Fusion from EBS. **Most disruptive now** — forces re-specification of ~14 BRSes into ~14 context specs with different boundaries, demands strongest engineering discipline, and without it produces a distributed monolith worse than a regular monolith.
- *Right for:* A team willing to pay the upfront re-spec cost and hire DDD/event-driven engineers. **Deferred** — too aggressive for the current BRS investment; remains the likely long-term destination reached by extracting contexts from Alternative B later.

---

## Chosen approach — Alternative B, Layered Architecture

### The five layers

```
 Layer 5  Industry Packs       Kitchen | Pharma | Auto | Aerospace | Food | …
 Layer 4  Compliance Packs     21 CFR Part 11 | IATF 16949 | AS9100 | HACCP | …
 Layer 3  Mode Extensions      Discrete | Process | Job-Shop | ETO | Repetitive
 Layer 2  Core Modules         24 industry-agnostic modules across 12 domains
 Layer 1  Platform             Identity, Tenancy, Audit, Events, API Gateway,
                               Integration Fabric, Workflow Engine,
                               Document Store, Notification, Extension Framework,
                               Localisation, Reporting Fabric
```

Every layer depends **only downward**. A core module cannot import from a mode extension. A mode cannot import from an industry pack. The platform depends on nothing above it. This is the contract that keeps the seam strict.

---

## Design

### Section 1 — P0 gaps (foundational; strict seam impossible without these)

1. **Item Master is not industry-agnostic.** Current Item Master treats kitchen-specific concepts as first-class. Required core shape: `item_type` enum (raw/semi/finished/service/consumable/asset/spare/tool/by-product/co-product/phantom), `valuation_method` (FIFO/LIFO/weighted_avg/standard/specific_id), `tracking_method` (none/batch_lot/serial/both), full `unit_of_measure` with conversion matrix, and `extensible_attributes` JSONB for pack-registered attributes. **This is the single most load-bearing entity.**
2. **No BOM / Recipe / Routing abstraction.** Core needs three parallel structures, pack-selectable: BOM (discrete), Recipe/Formula (process, with yield variance, co/by-products, substitution rules), Routing (operation sequence with work-center, setup, run, labor grade, tools, QC gates). Without routing, capacity planning and accurate costing are impossible.
3. **No lot/batch/serial genealogy.** Forward-and-backward traceability from supplier lot → GRN → work order → finished good → customer shipment is regulatory (21 CFR Part 11, IATF 16949, AS9100, HACCP). Three industry packs are impossible without this in core.
4. **"BOQ" is baked into Sales and Estimation.** Core needs a generic `CustomerRequirement` entity with `source_type` enum: catalog_order, configurator_order, bom_import, boq_import, rfq_spec, contract_release, forecast_plan. Each pack registers its own parser/intake handler.
5. **Workflows referenced but not truly pluggable.** Workflow BRS is solid on paper; the discipline of keeping state machines out of the other 13 modules' code is not yet enforced. Every business-process state machine must be data, not code.
6. **No manufacturing-mode flag.** `manufacturing_mode` enum on Plant / Product / WorkOrder (discrete | process | job_shop | eto | repetitive | mixed) drives which screens render, masters apply, and compliance rules fire. Every P0 above depends on this flag existing.

### Section 2 — P1 gaps (competitive blockers; entire domains missing)

1. **QMS as a dedicated module** — IQC/IPQC/OQC, NCR, CAPA, SCAR, SPC, calibration, audit, document control, change control. Regulated industries legally require it.
2. **PLM / Engineering Change** — Part Master with revision control, engineering vs manufacturing BOM, ECR→ECO→ECN workflow, where-used analysis, drawing vault, alternates/substitutes, variant BOM. Solves B3 MACBIS's pain point #1 ("client changes opinion after design freeze") properly.
3. **CMMS / EAM** — Asset register with hierarchy/criticality, PM (time/meter/condition-based), PdM with IoT, maintenance WO, spare parts tie-in, MTBF/MTTR/OEE, PTW. Existing `ppg-maintenance` is a production-floor stub, not a CMMS.
4. **EHS** — Incident management, HIRA/JSA, PTW, PPE, hazmat/SDS, environmental monitoring, safety training, MoC. Legally mandatory for process/chemicals/pharma/oil & gas.
5. **S&OP / Demand Planning** — Forecasting (statistical + ML), MPS, RCCP, deep MRP, CRP, S&OP consensus cycle, ATP/CTP. MTS industries cannot operate without this; MTO needs a lighter version.
6. **WMS depth** — Bin-level locations, putaway/pick strategies (wave/zone/batch/cluster), cycle counting, cross-docking, FEFO, kitting, RF/handheld workflows, yard management.
7. **Field Service / Aftermarket** — Installed base, warranty, AMC/service contracts with SLA, dispatch with skills/location, technician mobile with offline, parts-in-truck, depot repair, aftermarket parts sales, RMA integrated with warranty.
8. **MES layer behind the Digital Twin screen** — Operator clock-in on operation, job dispatch list, scrap/rework/yield capture, ANDON, OEE, downtime reason codes, EBR (process), eDHR (medical devices), PLC/SCADA integration. Without MES the Digital Twin is a mockup.
9. **Costing depth beyond Estimation** — Standard + actual costing, variance analysis (material price/usage, labor rate/efficiency, overhead absorption), ABC, WIP valuation, cost-to-serve.
10. **Integration fabric** — API gateway (REST + GraphQL, OAuth2, rate limits), EDI engine (X12 + EDIFACT + AS2), event bus with DLQ, webhook management, iPaaS connectors, MES/PLC protocols (OPC-UA, MQTT, Modbus).

### Section 3 — P2 gaps (industry-pack or mode-specific candidates)

1. **Process Manufacturing pack** — Recipe, batch execution (EBR), yield variance, co/by-products, continuous manufacturing, tank/silo, sampling, quarantine, expiry, genealogy queries.
2. **Repetitive / Automotive pack** — Takt/rate-based scheduling, electronic Kanban, backflushing, JIS sequenced delivery, EDI 850/855/856/810 first-class, PPAP, APQP, Control Plans + FMEA, IATF 16949 compliance, tier supplier portal.
3. **Job-Shop pack** — Quote-from-routing, capacity-driven quoting, drawing-based RFQ intake, finite scheduling with setup minimisation, nesting optimisation, prototype-to-production handoff.
4. **ETO pack** (B3 MACBIS's natural home) — Project-based manufacturing, BOQ import/parsing, site survey, design-lock with change order + cost impact, milestone billing, retention, liquidated damages, handover documentation.
5. **KitchenEquipment vertical pack** (thin pack on top of ETO) — Kitchen product taxonomy, NSF/ANSI and food-safety compliance, fascia/cladding/glass/appliance attributes on Item Master, kitchen-specific installation checklists, commercial-kitchen commissioning protocols, restaurant/hospital/food-court site-survey templates.
6. **Regulated-industry compliance packs** — 21 CFR Part 11, GxP, HACCP, ISO 13485, AS9100, IATF 16949, REACH/RoHS/Conflict Minerals, ITAR/EAR, Organic/Kosher/Halal. Composable on top of industry packs.
7. **Multi-entity / multi-currency / multi-country finance depth** — Multi-book accounting (statutory/management/tax/IFRS), inter-company with elimination, transfer pricing, multi-currency with hedging, country-specific tax engines (GST, VAT, Sales Tax, ZATCA, e-invoicing mandates), localisation packs, consolidation, IFRS 15/ASC 606, IFRS 16/ASC 842.
8. **HR depth for different employment models** — Global payroll, contingent workforce, union CBAs, shift-based manufacturing HR, time & attendance integrated with MES clock-in, skills/certification matrix with expiry, LMS.
9. **Customer/supplier portals** — Customer order/shipment/invoice/spare-part self-service; supplier RFQ/PO/ASN/invoice/forecast self-service; dealer/distributor portal.
10. **Mobile apps beyond current scope** — Warehouse RF, shop-floor, maintenance, sales field, executive dashboard, field service technician.

### Section 4 — P3 gaps (polish and ecosystem)

1. **BI / Analytics / DW as first-class** — Unified warehouse/lakehouse, semantic layer, self-service BI, role-specific pre-built dashboards, embedded analytics, predictive analytics, NL query.
2. **Collaboration and DMS** — In-app chat/comments on records, full DMS (contracts, SOPs, policies with OCR + retention), meeting notes/action items, unified approval inbox.
3. **AI / ML features** — Demand forecasting ML, predictive quality, predictive maintenance, supplier risk scoring, anomaly detection, NLP document extraction, copilot.
4. **Developer ecosystem** — Public SDK, app marketplace, low-code/no-code customisation (arguably P2 — table stakes for modern ERP), sandbox/test envs, CLI + IaC.
5. **Sustainability / ESG** — Scope 1/2/3 carbon accounting, product carbon footprint, waste tracking, resource intensity, ESG reporting (GRI/SASB/TCFD). P3 today, P2 within 2 years for EU-serving manufacturers.
6. **Accessibility, i18n, themes** — WCAG 2.1 AA, RTL support, full i18n beyond labels, dark/high-contrast modes, white-labeling.

### Section 5 — Layer 1 Platform services (the foundation currently underspecified)

Platform is the layer the current docs under-invest in, and the one that determines whether the strict seam holds. Must exist as first-class infrastructure, not utilities scattered across modules:

- **Identity & Access** — OIDC/SAML SSO, MFA, RBAC with role hierarchies, ABAC policies, delegated admin
- **Tenancy** — multi-tenant data isolation, tenant provisioning and configuration
- **Audit** — every mutation on every entity logged with who/what/when/before/after, tamper-evident (hash-chained), queryable; substrate for 21 CFR Part 11
- **Events** — domain event bus (OrderConfirmed, BatchReleased, NCRRaised), at-least-once delivery, pack/integration subscriptions, replay capability
- **API Gateway** — versioned REST + GraphQL, OAuth2 client credentials, per-tenant rate limiting, request logging
- **Integration Fabric** — connector framework, EDI engine (X12 + EDIFACT + AS2), webhook engine, scheduled sync jobs, error handling with DLQ
- **Workflow Engine** — state machines defined as JSON data; consumed by every module and pack
- **Document Store** — binary storage (files, PDFs, drawings, images), versioned, check-in/check-out, retention policies, OCR indexing
- **Notification** — email/SMS/push/in-app, template library, routing rules, opt-out management
- **Extension Framework** — the single most important platform service (see Section 6)
- **Localisation** — i18n labels, l10n formats, RTL, country-specific validation
- **Reporting Fabric** — unified query layer, scheduled reports, export pipeline (PDF/Excel/CSV), embedded BI hooks

### Section 6 — The Extension Framework (the core/pack contract)

A pack is a declarative bundle:

```yaml
pack:
  id: kitchen-equipment
  name: Kitchen Equipment
  version: 1.0.0
  depends_on:
    - mode: eto
    - compliance: [nsf-ansi, food-safety]
  extends:
    entities:       # typed attributes on core entities via extensible_attributes
    workflows:      # states/transitions inserted into core state machines at named points
    screens:        # components registered into core UI slots (tabs, sidebars, actions)
    master_data_seeds:  # reference data loaded at pack activation
    reports:        # report definitions against core query layer
    integrations:   # parsers, exporters, webhook handlers
```

**Ten extension points the core must expose:**

1. Entity attribute extension (via `extensible_attributes` JSONB with typed pack schemas)
2. Workflow state/transition extension (named insertion points in core state machines)
3. Screen slot extension (tabs, sidebars, action menus, field groups)
4. Master data seeds (reference data loaded at pack activation)
5. Workflow step-type registration (pack-supplied step handlers)
6. Validation rule registration (packs register validators fired on core entity save)
7. Report template registration (against core query layer)
8. Integration connector registration (parsers, exporters, webhooks)
9. Domain event subscription (packs subscribe to core events and run pack-specific logic)
10. Permission scope registration (packs declare permissions slotted into RBAC tree)

**The load-bearing contract rule:** a pack can *read* core entities, *extend* them via declared points, and *observe* core events — but it cannot *write* directly to core tables, *override* core logic, or *fork* core code. If a pack needs something the core doesn't expose, the answer is to add an extension point to the core, not to patch the core.

### Section 7 — Layer 2 Core Modules (24 modules across 12 domains, up from 14)

**Demand & Customer** — (1) CRM, (2) Sales, (3) S&OP & Demand Planning *(new)*
**Product & Design** — (4) PLM *(new)*, (5) Configurator / CPQ *(new, extracted from Sales)*
**Supply** — (6) Procurement
**Inventory** — (7) Inventory / Stores, (8) Warehouse Management *(new depth)*
**Manufacturing** — (9) Production Planning, (10) Manufacturing Execution / MES *(new)*, (11) Routing & Work Centers *(new, may fold into Production Planning)*
**Quality** — (12) QMS *(new)*
**Asset** — (13) Asset / CMMS / EAM *(new)*
**Project** — (14) Project Management, (15) Commissioning & Installation
**Field Service** — (16) Field Service / Aftermarket *(new)*
**People & Safety** — (17) Human Resources, (18) EHS *(new)*
**Money** — (19) Finance, (20) Costing *(new, extracted from Finance + Estimation)*, (21) Logistics
**Intelligence** — (22) Analytics & BI *(promoted from feature to module)*
**Operational support** — (23) Support, (24) IT & Admin Services

**Net change:** +11 new core modules (S&OP, PLM, CPQ, WMS depth, MES, Routing, QMS, CMMS, Field Service, EHS, Costing, Analytics), -1 merged (Estimation moved into Costing + CPQ). Every kitchen-specific concept moves out of these modules into the KitchenEquipment pack.

### Section 8 — Layer 3 Mode Extensions

Each mode adds a small set of masters, workflows, and execution patterns. A deployment enables one or more modes.

- **Discrete** — BOM-based, serial-tracked; work orders are discrete jobs (the "default" core modules are shaped around)
- **Process** — Recipe/Formula, Batch, EBR, yield variance, co/by-products, tank/silo, sampling, quarantine
- **Job-Shop** — Quote-from-routing, capacity-based promising, nesting, setup-minimising sequencing, heavy CPQ
- **ETO** — BOQ import, Design-Lock, Change Order with cost impact, project-based work orders, milestone billing, retention, site survey
- **Repetitive** — Kanban, Rate/Takt scheduling, Backflushing, JIS sequenced delivery, EDI 850/856 first-class, ANDON at scale

Modes are combinable. B3 MACBIS = ETO + Discrete. Pharma CMO = Process (+ occasionally ETO). Auto Tier-1 = Repetitive + Discrete.

### Section 9 — Layer 4 Compliance Packs

Orthogonal regulatory regimes, composable across industry packs. Each pack bundles:
- Document control templates (SOPs required by the regime)
- Audit-trail enforcement rules (what must be logged, retention)
- Electronic signature requirements (who, when, identity assurance)
- Validation lifecycle (IQ/OQ/PQ)
- Training record requirements
- Workflow gates (e.g., Part 11's second-person verification)
- Regulatory reporting templates

**Key principle:** compliance packs add *restrictions and obligations* on top of core behaviour. If a compliance pack needs to change business logic, it's really an industry pack in disguise.

### Section 10 — Layer 5 Industry Packs

Industry pack = thin composition: mode selection + compliance pack(s) + industry taxonomy + seeded masters + screen/workflow extensions.

**KitchenEquipment pack (where B3 MACBIS lives):**
- Enables modes: ETO + Discrete
- Enables compliance: NSF-ANSI, food-safety-hazmat, regional health-dept
- Extends Item with: fascia_type, cladding_type, glass_spec, appliance_category, nsf_certified, temperature_rating, energy_rating
- Seeds: product taxonomy (cooking/refrigeration/food_prep/washing/ventilation/storage), work-center templates, QC plan library (finishing/pre-dispatch/site-installation), BOQ templates (restaurant/hospital/food_court/corporate), commissioning protocols
- Extends screens: Item.detail (+KitchenSpecTab), WorkOrder.floor (+FinishingQCPanel), Project.site (+SiteSurveyCapture)
- Extends workflows: QuotationApproval (+finishing_review_step), WorkOrder (+finishing_qc_gate, +installation_handover_gate)
- Reports: NSF compliance, installation completion certificate, warranty registration

**Parallel packs illustrated (not built in v1):** Pharma, Automotive Tier-1, Aerospace, Food Processing.

### Section 11 — Happy-path flow through the layers

A B3 MACBIS-style ETO kitchen order flows as:

1. Lead → CRM (core)
2. Opportunity → Quotation in Sales (core); Sales sees `source_type = boq_import` and calls KitchenEquipment pack's BOQ parser (L5); parser populates quotation lines with kitchen-specific attributes
3. Configurator (core) runs against kitchen taxonomy (L5 seed data)
4. Costing (core) rolls up using ETO mode rules (L3); KitchenEquipment pack adds finishing-cost calculator
5. Quotation Approval workflow (L1 Workflow Engine); pack injects finishing review step
6. Sales Order confirms → Design Lock (ETO mode, L3); post-lock changes require ECO (PLM core, L2)
7. MRP runs (Production Planning, L2)
8. Work Orders release to MES (L2); Discrete mode governs execution (L3)
9. Quality gates (QMS L2) with pack-inserted finishing QC (L5)
10. Finished goods → WMS; Logistics arranges outbound
11. Commissioning (L2) on-site; pack provides cooking/refrigeration test protocols (L5)
12. Handover creates Installed Base in Field Service (L2); warranty/AMC clock starts
13. Every step → Audit (L1); every state change → Events (L1)

### Section 12 — Failure modes and mitigations

| # | Failure mode | Mitigation |
|---|---|---|
| 1 | **Leaky pack** — writes to core table or adds `kitchen_` field to core "just this once" | Automated cross-layer import linting; quarterly architecture audit; layer-boundary-violation as blocking review issue |
| 2 | **Platform under-investment** — Extension Framework / Workflow Engine / Event Bus get neglected because "not customer-facing" | One engineer as dedicated platform owner from day one; platform work is a first-class sprint deliverable; every feature documents extension points added/used |
| 3 | **Core bloat** — "common" feature in core that a 4th industry can't extend | Rule of two: start in a pack, promote to core only when mode-agnostic + no reasonable pack-level variant |
| 4 | **Mode combinatorics** — ETO + Process hits untested combo | Declare supported mode combinations; CI tests those; warn/reject on unsupported combos at config time |
| 5 | **Pack version skew** — pack v1.2 needs core v3.0, customer on v2.8 | Semver on packs + core; pack manifest declares `core_version_range`; fail fast on mismatch; maintain compatibility matrix |
| 6 | **Data migration between modes** — customer adds Process mode later; existing data lacks process attributes | Mode activation is an explicit upgrade with migration script; mode-specific attributes nullable, populated lazily; maintain mode-pair migration playbooks |

### Section 13 — Rollback story

- **B → A (collapse layers into flat modules):** 18-month exercise. Collapse L3 and L5 into L2, merging masters/workflows into each module. Lose multi-industry cleanliness but retain functionality. Major refactor, no data loss.
- **B → C (extract contexts into services):** 2–3 year exercise. Redraw boundaries from modules to contexts, extract services, invert some dependencies. Likely long-term destination anyway.
- **Partial rollback of a specific pack:** Cheap. Rewrite the pack; core untouched. This is the point of strict seam.
- **Expensive mistake to avoid:** Shipping B with a sloppy platform layer produces a half-strict seam that rolls back to nothing clean. If committing to B, commit to the platform investment.

### Section 14 — Out of scope (explicitly deferred)

- Hard microservices split (ship as modular monolith on Django + Next.js as already chosen)
- Multi-tenant SaaS hosting operations (platform supports multi-tenancy in data model; product-ops is separate)
- Full industry pack build-out for non-kitchen industries (only KitchenEquipment ships in v1; other pack specs are informative stubs)
- Deep AI/ML features (predictive maintenance, demand forecasting ML, NL query are roadmap items)
- Mobile-first rewrite (mobile apps are deferred feature modules, not architectural reshapes)
- Blockchain / DLT for traceability (can be added later via Event Bus + Integration Fabric)
- BPM-style visual workflow authoring UI (Workflow Engine is API-first in v1)

---

## Open questions (need decisions before PRD)

These must be answered by the user before the PRD is written:

1. **Which mode combinations are officially supported at launch?** ETO + Discrete is obvious (B3 MACBIS). What else — Repetitive alone, Process alone, Process + ETO?
2. **Disposition of existing 14 BRSes.** Rewrite into core + KitchenEquipment pack specs, or treat existing BRSes as requirements for the KitchenEquipment pack and author thin new core specs?
3. **Which compliance packs ship with v1?** Suggested: none in core; NSF/ANSI + food-safety in KitchenEquipment pack. Broader scope shifts timeline.
4. **Is there an "OptiForge Generic" SKU** sold without any industry pack, or is the product always sold with at least one pack?
5. **Tenancy model.** Single-tenant per-customer Linux deployment (current infra doc implies this) or multi-tenant SaaS?
6. **Fit of current "Industry 4.0 / Digital Twin" UI.** Core MES capability, separate module, or KitchenEquipment-pack visualisation?
7. **Commercial model for packs.** Per-pack? Per-mode? Per-module? Shapes how strictly boundaries must be enforced technically.
8. **Does "24 core modules" hold, or should some (Routing, Costing, CPQ) fold back into their parents** (Production Planning, Finance, Sales) for v1 simplicity?

---

## Next step

**`kreupai-write-prd`** — use this brainstorm doc as the authoritative input to produce a full Product Requirements Document for OptiForge's layered multi-industry architecture. The PRD should open by resolving the eight open questions above (either by proposing defensible defaults or by flagging them as explicit input needed from the user), then proceed into the normal PRD structure with NFRs, compliance, security, and success metrics grounded in the layer model.
