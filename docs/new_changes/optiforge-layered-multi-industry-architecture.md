# OptiForge — Layered Multi-Industry Manufacturing ERP Architecture — PRD

*Status: Draft | Owner: Bosco (B3 MACBIS / KreupAI Technologies LLC) | Last updated: 2026-04-23*

---

## Resolution of brainstorm open questions

The brainstorm doc at `/docs/brainstorms/2026-04-23-optiforge-layered-multi-industry.md` left eight questions open. This PRD resolves them as follows. Six are committed decisions for v1 scope; two remain open and are carried into the **Open Questions** section with Bosco as owner.

| # | Question | Resolution in this PRD | Status |
|---|---|---|---|
| Q1 | Mode combinations supported at launch | **ETO + Discrete bundled as a single supported combination.** Process, Job-Shop, Repetitive, and `mixed` are scaffolded in the mode registry (enum values exist, extension points declared) but their Layer 3 extensions are not built and activating them returns a "mode not available in this release" error. ETO-alone and Discrete-alone are not separately sold. | Committed |
| Q2 | Disposition of existing 14 BRSes | **Existing BRSes are treated as requirements for the KitchenEquipment pack + ETO mode.** Thin new core specs are authored that capture only the mode-agnostic, horizontal behaviour of each module. The split is performed BRS-by-BRS as the first activity of Phase 1. | Committed |
| Q3 | Compliance packs shipping in v1 | **Zero compliance packs ship in v1.** NSF-ANSI and food-safety/hazmat obligations ship *inside* the KitchenEquipment pack as pack-owned validation rules and workflow gates. Layer 4 is scaffolded (pack manifest parser, compliance-pack extension points declared) but no compliance pack is authored until a regulated industry is on the roadmap. | Committed |
| Q4 | "OptiForge Generic" SKU | **Undecided.** Commercial-positioning call; affects sales messaging. Carried forward. | Open — owner Bosco |
| Q5 | Tenancy model | **Multi-tenant in the data model, single-tenant per-customer in deployment for v1.** Platform Tenancy service exists from day one: `tenant_id` is a non-nullable column on every non-reference table, row-level-security policies are enforced in the database, tenant provisioning is an API from the start. Initial go-to-market remains per-customer Linux deployments (matching existing infra). When a SaaS product-ops capability comes online later, no schema migration is required. | Committed |
| Q6 | Fit of current "Industry 4.0 / Digital Twin" UI | **MES is a core module (Layer 2).** The Digital Twin visualization layer is a KitchenEquipment-pack screen extension in v1. Every manufacturing industry needs execution tracking; what is *visualized* (kitchen cabinetry assembly vs. pharma batch reactor vs. automotive line) is industry-specific and therefore pack-owned. | Committed |
| Q7 | Commercial model for packs | **Undecided.** Revenue-model call; technical boundary design does not block on it because the code enforces the seam regardless. Carried forward. | Open — owner Bosco |
| Q8 | Does "24 core modules" hold | **No — v1 ships 21 core modules.** Three extractions are deferred to v2: Routing folds into Production Planning; Costing remains folded into Finance + Estimation (no standalone Costing module yet); CPQ stays inside Sales. Each extraction is re-evaluated when a second industry pack arrives and can exercise the reuse justification (rule of two). | Committed |

---

## Problem Statement

B3 MACBIS Ltd operates an engineer-to-order commercial kitchen equipment manufacturing business. The OptiForge ERP has been scoped into 14 business modules (CRM, Sales, Estimation & Costing, PPG/Production, Procurement, Stores/Warehouse, Projects, Logistics, Commissioning, HRM, Support, IT-Admin, Finance, Workflow) with comprehensive BRS documentation and a chosen technology stack (Django 4.2 + DRF + PostgreSQL 15 on the backend; Next.js 14 + TypeScript + shadcn on the frontend).

Two problems are now apparent.

**Problem one: the 14-module scope is simultaneously too narrow and too kitchen-specific.** Entire manufacturing domains are missing: QMS (Quality Management System), PLM (Product Lifecycle Management), CMMS/EAM (maintenance), EHS (environment-health-safety), MES (manufacturing execution), S&OP (sales and operations planning), Field Service & Aftermarket. At the same time, kitchen-specific concepts — BOQ parsing, fascia/cladding/appliance attributes on the Item Master, finishing QC gates, NSF-ANSI compliance assumptions — are baked into what should be horizontal business modules. Expanding the current shape to cover the missing domains would produce a 22-module system that is still kitchen-shaped, and selling it to a pharma or automotive customer would be impossible without forking the codebase.

**Problem two: the stated commercial ambition is multi-industry, but there is no architectural mechanism to deliver it.** The user's intent is for OptiForge to serve *any manufacturing industry* — discrete, process, job-shop, engineer-to-order, repetitive — not just commercial kitchen equipment. Without a deliberate core/pack separation, every new industry would require forking or invasive modification of shared modules. Mature comparable systems (SAP S/4HANA Manufacturing, Infor CloudSuite Industrial, Plex MES, Microsoft Dynamics 365 Manufacturing) became *products* rather than bespoke builds precisely by separating an industry-agnostic core from pluggable industry extensions; the KreupAI team has committed to the same structural shape.

The people affected are the B3 MACBIS development team (the direct builders), B3 MACBIS Ltd as the current and primary customer, and KreupAI Technologies LLC as the product owner of OptiForge. The cost of not solving this problem now is: re-architecting after the first industry ships costs roughly four times more than building the core/pack seam up front; every non-kitchen industry pursued without the seam requires a parallel codebase; and the commercial positioning of OptiForge as a multi-industry product becomes rhetorical rather than real.

---

## Solution

After this PRD is executed, OptiForge is structured as a **five-layer architecture** in which each layer depends only on layers below it:

1. **Platform services** (Layer 1) — identity, tenancy, audit, events, API gateway, integration fabric, workflow engine, document store, notification, extension framework, localisation, reporting fabric.
2. **Core modules** (Layer 2) — 21 industry-agnostic business modules with zero industry-specific fields or logic.
3. **Mode extensions** (Layer 3) — pluggable manufacturing-mode behaviour: ETO + Discrete bundled and fully built in v1; Process, Job-Shop, Repetitive, `mixed` scaffolded but disabled.
4. **Compliance packs** (Layer 4) — orthogonal regulatory regimes. Scaffolded in v1; no packs authored yet.
5. **Industry packs** (Layer 5) — KitchenEquipment is the only pack in v1; it composes ETO + Discrete, adds kitchen-specific attributes via extension points, seeds kitchen taxonomy, inserts finishing-QC workflow steps, and provides NSF-ANSI and food-safety compliance rules *inside the pack*.

A **pack contract** is explicit and enforced: a pack may *read* core entities, *extend* them via ten declared extension points (entity attributes, workflow states, screen slots, master data seeds, workflow step handlers, validation rules, report templates, integration connectors, event subscriptions, permission scopes), and *observe* core events — but it may not write directly to core tables, override core logic, or fork core code. Cross-layer violations are caught automatically by import-boundary linting in CI.

From a user's perspective, three things change:

- A B3 MACBIS kitchen ETO order still flows end-to-end as before: CRM lead → BOQ-driven quotation → configurator → ETO design lock → MRP → MES work orders → finishing QC → logistics → on-site commissioning → installed base with AMC. Nothing in the happy-path UX is lost.
- The BOQ parser, the finishing QC gate, the NSF-ANSI compliance rules, the fascia/cladding item attributes, and the kitchen-specific screen tabs *now live in the KitchenEquipment pack* rather than scattered through Sales, Production, and QMS. From a developer standpoint, kitchen-specific behaviour is always findable in one place.
- A future pharma, automotive, or food-processing industry becomes a new pack composition rather than a codebase fork. The platform, core, and modes do not change; only the Layer 5 pack is authored.

---

## Actors & Personas

| Actor | Role | Permissions needed | Primary outcomes they care about |
|---|---|---|---|
| **Platform engineer** | Owns Layer 1 services | Full platform admin; pack registry manage; extension-point authoring | Every extension point a pack needs exists and is documented; platform services have SLOs and observability |
| **Core module engineer** | Owns one or more Layer 2 modules | Core module admin within their domain; cannot write to pack registries | Core modules stay industry-agnostic; no kitchen-specific code creeps in |
| **Pack author** | Builds Layer 3, 4, or 5 packs | Pack registry write; cannot modify core module code | Their pack installs cleanly, declares dependencies correctly, passes contract tests, and can be versioned independently |
| **Tenant administrator** | Configures an OptiForge deployment for a specific customer | Tenant admin within their tenant; can activate/deactivate packs | Pack activation is safe, reversible, and produces a working system |
| **Business end user (Kitchen ETO)** | CRM sales, estimator, designer, production planner, MES operator, finishing QC, site commissioning engineer, finance controller at B3 MACBIS | Role-based per their function, scoped by tenant | Their existing B3 MACBIS workflows work without regression |
| **Future industry customer** | Not a real user in v1, but a design constraint | — | When they buy an industry pack, the core does not have to change |
| **Compliance officer** | Not an end-user role in v1; anticipated once compliance packs ship | — | Audit trails are tamper-evident, electronic signatures work, regulatory reports are generable |
| **External integrator (third-party system)** | Shopify, QuickBooks, Stripe, FedEx, MES hardware, EDI partners | API client credentials, scoped per integration | APIs are versioned, rate-limited, events are reliably delivered |

---

## User Stories

Stories are grouped by layer. Each story includes 2–5 acceptance criteria in Given/When/Then form. Stories cover the mechanism of the layered architecture itself; end-user business stories for specific OptiForge features are captured in each module's downstream PRDs and are out of scope here.

### Layer 1 — Platform foundation

**1. As a platform engineer, I want a pack manifest parser, so that packs can declare what they extend in a structured, validatable way.**
  - **Given** a pack directory with a `pack.yaml` declaring id, version, depends_on (modes and compliance packs), and extends (entities, workflows, screens, seeds, reports, integrations), **when** the pack registry loads it, **then** the manifest is validated against a JSON schema and any schema violation is reported with the exact offending field.
  - **Given** a pack manifest that declares `depends_on.core_version_range: ">=1.0 <2.0"`, **when** activation is attempted against core v2.1, **then** activation fails with a clear incompatibility error and the pack is not loaded.
  - **Given** two packs that each declare the same workflow insertion point, **when** both are activated, **then** both extensions are applied in declared load order and the resolved workflow is displayable for inspection.

**2. As a platform engineer, I want a tamper-evident audit log covering every mutation on every entity, so that the substrate for 21 CFR Part 11 is in place from day one.**
  - **Given** any create, update, or delete on a core or pack entity, **when** the operation commits, **then** an audit record is written with actor, timestamp, entity type, entity id, tenant id, operation, before-state, after-state, and a hash chained to the previous audit record for the same entity.
  - **Given** an audit record, **when** any byte in the before/after/hash fields is modified post-write, **then** a chain-verification job detects the break within its next run and raises an alert.
  - **Given** an audit query, **when** an authorised user requests the full change history of a specific entity id, **then** the chronological chain is returned in under one second for entities with up to 10,000 audit records.

**3. As a platform engineer, I want an event bus with at-least-once delivery and replay, so that packs and integrations subscribe to core events without modifying core code.**
  - **Given** a core operation that emits a domain event (e.g., `OrderConfirmed`, `WorkOrderReleased`, `QualityCheckFailed`), **when** the event is published, **then** every registered subscriber receives it at least once and the subscriber's processing status is observable.
  - **Given** a subscriber that fails to acknowledge an event for longer than its configured timeout, **when** the retry budget is exhausted, **then** the event is moved to a dead-letter queue and an operator is notified.
  - **Given** a subscriber newly activated or recovering from downtime, **when** it requests replay from a prior timestamp, **then** all events for its subscribed types from that timestamp are delivered in original order.

**4. As a platform engineer, I want tenant isolation enforced at the database level, so that no pack or core module can accidentally leak data across tenants.**
  - **Given** any query against a tenant-scoped table, **when** the query is executed without a tenant context, **then** the database rejects it with a policy violation.
  - **Given** a user authenticated into tenant A, **when** they attempt to read an entity belonging to tenant B by id, **then** the read returns "not found" (not "access denied") to prevent enumeration.
  - **Given** a tenant is provisioned, **when** the provisioning completes, **then** reference/seed data from activated packs is loaded scoped to that tenant only.

**5. As a platform engineer, I want cross-layer import boundaries enforced automatically in CI, so that layer violations are caught before merge rather than discovered in production.**
  - **Given** a pull request that introduces an import from a core module into a Layer 5 pack module, **when** the linter runs, **then** the build fails with the specific import and a pointer to the extension-point alternative.
  - **Given** a pull request that adds an industry-specific field (e.g., `fascia_type`) to a core entity, **when** the linter runs, **then** the build fails and the author is directed to the `extensible_attributes` mechanism or to move the field into a pack.
  - **Given** a layer-boundary violation that is genuinely necessary and deliberate, **when** an architecture owner approves the exception with a documented rationale, **then** a suppress directive is accepted and the exception is logged in a quarterly audit report.

### Layer 2 — Core modules (industry-agnostic shape)

**6. As a core module engineer, I want the Item Master to carry an `item_type`, `valuation_method`, `tracking_method`, a unit-of-measure conversion matrix, and an `extensible_attributes` JSONB, so that any industry pack can describe its item shape without modifying core.**
  - **Given** a new item, **when** it is created with `item_type` in (raw, semi, finished, service, consumable, asset, spare, tool, by-product, co-product, phantom), **then** it is persisted and the pack-specific attributes in `extensible_attributes` are validated against the registering pack's typed schema.
  - **Given** the KitchenEquipment pack has registered `fascia_type`, `cladding_type`, `nsf_certified`, and `temperature_rating` as extension attributes, **when** a kitchen-pack-scoped item is saved without `fascia_type`, **then** the save fails with the pack-defined validation error — not a core error.
  - **Given** an item with unit-of-measure `each`, **when** a conversion is requested to `kg`, **then** the UoM conversion matrix returns the correct factor or a clear "no conversion defined" error.

**7. As a core module engineer, I want three parallel product-structure abstractions — BOM, Recipe/Formula, and Routing — with the mode flag selecting which applies, so that discrete, process, and ETO manufacturing can coexist in the same core.**
  - **Given** a plant configured with `manufacturing_mode` in (discrete, eto), **when** a product is created, **then** only BOM is offered and Recipe/Formula is hidden; Routing is always available.
  - **Given** a product with a BOM, **when** costing is rolled up, **then** the roll-up traverses BOM lines recursively and applies UoM conversions and the item's valuation method.
  - **Given** a Routing with operations, work centers, setup minutes, run minutes, labor grades, and QC gates, **when** capacity planning runs, **then** the routing drives finite capacity calculations correctly.

**8. As a core module engineer, I want forward-and-backward lot/batch/serial genealogy in core, so that any future regulated industry pack can satisfy traceability obligations without core changes.**
  - **Given** a supplier lot received against a GRN, consumed into a work order, yielding a finished good, shipped to a customer, **when** a backward-trace query is issued from the customer shipment, **then** the full chain back to the supplier lot is returned.
  - **Given** a defect notice on a supplier lot, **when** a forward-trace query is issued, **then** every work order that consumed the lot and every finished good / customer shipment downstream is returned.
  - **Given** an item with `tracking_method = serial`, **when** a work order consumes two units, **then** both serial numbers must be captured or the consumption is rejected.

**9. As a core module engineer, I want a generic `CustomerRequirement` entity with a `source_type` enum, so that any input shape (BOQ, catalog order, configurator order, RFQ, contract release, forecast) can be a first-class citizen without special-casing BOQ.**
  - **Given** a CustomerRequirement with `source_type = boq_import`, **when** the requirement is created, **then** the KitchenEquipment pack's BOQ parser is invoked to populate line items.
  - **Given** a CustomerRequirement with `source_type = catalog_order`, **when** it is created, **then** the core catalog order flow runs and no pack parser is invoked.
  - **Given** an unregistered `source_type`, **when** a requirement is created with it, **then** creation fails with a clear "no parser registered for this source_type" error.

**10. As a core module engineer, I want every business-process state machine defined as data (workflow JSON), not code, so that packs can insert, skip, or add states at named insertion points without editing core.**
  - **Given** a core workflow (e.g., QuotationApproval) with declared insertion points (`after_initial_review`, `before_final_approval`), **when** a pack registers an additional step at `after_initial_review`, **then** the step is inserted into that workflow when the pack is active and absent when it is not.
  - **Given** an active workflow instance, **when** the underlying workflow definition is modified, **then** the running instance completes on the definition version it started with (no mid-flight migration).
  - **Given** a pack-inserted step that fails, **when** the failure is recorded, **then** the failure is attributed to the pack (not core) in logs, metrics, and error surfaces.

### Layer 3 — Mode extensions

**11. As a core module engineer, I want `manufacturing_mode` as a first-class flag on Plant, Product, and WorkOrder with a controlled enum, so that mode-specific behaviour is discoverable and testable.**
  - **Given** a Plant with `manufacturing_mode = [eto, discrete]`, **when** a Product is created on that plant, **then** only ETO and Discrete mode options are offered for the product.
  - **Given** a WorkOrder, **when** its mode is set to a scaffolded-but-disabled value (process, job_shop, repetitive, mixed) in v1, **then** creation is rejected with "mode not available in this release" and a link to the compatibility matrix.
  - **Given** a mode-specific behaviour (e.g., ETO's Design Lock), **when** the WorkOrder's mode does not include ETO, **then** the Design Lock action is not offered on the UI and is rejected by the API.

**12. As a pack author, I want mode-specific master data and workflows to live in a mode extension module (Layer 3), so that ETO-specific things like Design Lock, Change Order with cost impact, BOQ import, milestone billing, and retention are not in core.**
  - **Given** ETO mode is active, **when** a design is committed to a sales order, **then** Design Lock is enforceable, and post-lock changes trigger the Change-Order workflow with a cost-impact calculation.
  - **Given** Discrete mode is active, **when** a work order is released, **then** standard serial tracking, operation sequencing, and routing apply (the core "default" behaviour).
  - **Given** both ETO and Discrete are active on the same plant, **when** an order flows from quotation to work order to shipment, **then** ETO rules govern pre-release and Discrete rules govern execution without conflict.

### Layer 5 — KitchenEquipment pack

**13. As a pack author, I want the KitchenEquipment pack to declare all of its extensions in a single manifest, so that its footprint on the core is explicit and auditable.**
  - **Given** the KitchenEquipment pack manifest, **when** it is read, **then** it lists every core entity it extends, every workflow step it inserts, every screen slot it fills, every seed data it loads, every report it defines, every integration (e.g., BOQ parser) it registers, and every permission scope it declares.
  - **Given** the KitchenEquipment pack is activated on a tenant, **when** the activation completes, **then** the kitchen product taxonomy, work-center templates, QC plan library, BOQ templates, and commissioning protocols are seeded for that tenant only.
  - **Given** the KitchenEquipment pack is deactivated, **when** deactivation completes, **then** pack-specific screens disappear, pack-registered validation rules stop firing, and pack seed data is flagged as orphaned but not deleted (deletion is a separate, confirmed operation).

**14. As a B3 MACBIS estimator, I want a BOQ file uploaded to a quotation to be parsed into line items automatically, so that I do not re-type BOQ contents.**
  - **Given** a quotation with `source_type = boq_import` and a BOQ file in a supported format, **when** the file is uploaded, **then** the KitchenEquipment pack's BOQ parser produces quotation lines with kitchen-specific attributes populated.
  - **Given** a malformed BOQ file, **when** parsing fails, **then** the user sees row/column-level error messages, the quotation remains editable, and no partial lines are persisted.
  - **Given** a BOQ line referencing an item not in the catalog, **when** parsing completes, **then** the line is created as a non-catalog entry with a warning flag for estimator review.

**15. As a B3 MACBIS production planner, I want a finishing-QC gate inserted into the WorkOrder workflow automatically when KitchenEquipment is active, so that no kitchen work order bypasses finishing inspection.**
  - **Given** the KitchenEquipment pack is active and a WorkOrder completes its final production operation, **when** the WorkOrder progresses, **then** the finishing-QC gate fires and blocks progression until a finishing-QC result is recorded.
  - **Given** a failed finishing-QC result, **when** it is recorded, **then** the WorkOrder is routed to rework per the pack's workflow definition (not a core-level rework path).
  - **Given** the KitchenEquipment pack is *not* active on a tenant, **when** a WorkOrder completes its final operation, **then** no finishing-QC gate fires.

### Cross-cutting

**16. As a tenant administrator, I want pack activation and deactivation to be a controlled, reversible operation, so that mistakes do not corrupt tenant data.**
  - **Given** a pack activation request, **when** the request is issued, **then** the system verifies the pack's declared dependencies, runs a dry-run compatibility check, and shows a summary of extension points that will activate before committing.
  - **Given** a pack deactivation request, **when** the request is issued, **then** the system identifies all tenant data created under the pack's extensions and warns the administrator before proceeding.
  - **Given** an activation or deactivation in progress, **when** it fails part-way, **then** the system rolls back to the prior state and leaves the tenant in a working configuration.

**17. As a compliance officer (future), I want the platform's audit and electronic-signature substrate to be in place from v1, so that when a compliance pack (e.g., 21 CFR Part 11) is authored later, the platform does not need to change.**
  - **Given** an entity mutation, **when** it is committed, **then** the audit record format includes the fields required by 21 CFR Part 11 (actor identity, timestamp with timezone, before/after state, reason-for-change field present even if empty).
  - **Given** a workflow step that *would* require an electronic signature, **when** the platform is queried for e-signature readiness, **then** it reports the fields, identity-assurance mechanism, and retention support available.
  - **Given** a 21 CFR Part 11 pack is authored later, **when** it activates the second-person verification gate on a workflow, **then** no changes to platform or core are needed to support it.

---

## Implementation Decisions

Decisions made during the brainstorm and this PRD's resolution section, committed here.

### Architectural shape

- **Five-layer architecture** (Platform → Core → Modes → Compliance → Industry). Each layer depends only downward. Cross-layer dependency in the wrong direction is a build-blocking CI failure.
- **Modular monolith deployment** on Django + DRF + PostgreSQL 15 + Celery + RabbitMQ + Redis + Elasticsearch (backend) and Next.js 14 + TypeScript + shadcn (frontend), as already chosen in the existing architecture doc. No microservices extraction in v1.
- **Multi-tenancy in the data model from day one**, single-tenant per-customer deployment as the v1 go-to-market.

### Layer 1 — Platform services (twelve)

All twelve must exist as first-class services, not as utilities scattered across modules:

Identity & Access (OIDC/SAML SSO, MFA, RBAC with role hierarchy, ABAC policies, delegated admin); Tenancy (multi-tenant data isolation via `tenant_id` + row-level security, provisioning API, tenant-scoped pack activation); Audit (hash-chained tamper-evident log on every mutation, queryable); Events (domain event bus, at-least-once delivery, DLQ, replay); API Gateway (versioned REST + GraphQL, OAuth2 client credentials, per-tenant rate limiting, request logging); Integration Fabric (connector framework, EDI engine for X12/EDIFACT/AS2, webhook engine, scheduled sync, DLQ error handling); Workflow Engine (JSON state machines, insertion points, pack-registered step handlers); Document Store (versioned binary storage, check-in/out, retention, OCR indexing); Notification (email/SMS/push/in-app with template library and routing); Extension Framework (the pack contract — detailed below); Localisation (i18n labels, l10n formats, RTL, country validators); Reporting Fabric (unified query layer, scheduled reports, PDF/Excel/CSV export, embedded BI hooks).

### Layer 2 — Core modules (twenty-one for v1)

Grouped by domain; the three deferred extractions (Routing, Costing, CPQ) are noted explicitly.

- **Demand & Customer** — CRM; Sales (CPQ stays inside Sales for v1); S&OP & Demand Planning.
- **Product & Design** — PLM.
- **Supply** — Procurement.
- **Inventory** — Inventory / Stores; Warehouse Management.
- **Manufacturing** — Production Planning (Routing stays inside Production Planning for v1); Manufacturing Execution (MES).
- **Quality** — QMS.
- **Asset** — Asset / CMMS / EAM.
- **Project** — Project Management; Commissioning & Installation.
- **Field Service** — Field Service / Aftermarket.
- **People & Safety** — Human Resources; EHS.
- **Money** — Finance (Costing and Estimation stay folded into Finance for v1); Logistics.
- **Intelligence** — Analytics & BI.
- **Operational support** — Support; IT & Admin Services.

Every kitchen-specific concept currently in the 14 existing BRSes moves out of these core modules and into the KitchenEquipment pack. The disposition rule: if the concept is mode-agnostic and industry-agnostic, it stays in core; everything else moves to a pack.

### Layer 3 — Mode extensions

- **ETO + Discrete** — bundled as the single supported combination in v1. Fully built. ETO adds: BOQ-aware CustomerRequirement handling, Design Lock, Change Order with cost impact, project-based work orders, milestone billing, retention, liquidated damages, site survey, handover documentation. Discrete is the "default" shape — BOM-based, serial-tracked, discrete work orders.
- **Process, Job-Shop, Repetitive, `mixed`** — scaffolded only. Enum values exist; mode registry accepts them; mode-specific extension points are declared. Attempting to activate them returns "mode not available in this release". No Layer 3 module code is written for them in v1.

### Layer 4 — Compliance packs

- Scaffolded only. Pack manifest parser supports the compliance-pack shape. Compliance-specific extension hooks (document control, e-signature gates, validation lifecycle, training record, regulatory reporting) are declared in core. No compliance pack is authored in v1.
- NSF-ANSI and food-safety/hazmat obligations live inside the KitchenEquipment pack (Layer 5) instead, as pack-owned validation rules and workflow gates. If and when these need to be composable with other industry packs, they are promoted to Layer 4.

### Layer 5 — KitchenEquipment pack (the only industry pack in v1)

- Composes: ETO mode + Discrete mode + KitchenEquipment taxonomy + kitchen seeds + screen customisations + NSF-ANSI and food-safety compliance rules (pack-internal, not a Layer 4 pack).
- Extends Item with: `fascia_type`, `cladding_type`, `glass_spec`, `appliance_category`, `nsf_certified`, `temperature_rating`, `energy_rating`.
- Seeds: product taxonomy (cooking, refrigeration, food_prep, washing, ventilation, storage); work-center templates; QC plan library (finishing, pre-dispatch, site-installation); BOQ templates (restaurant, hospital, food_court, corporate); commissioning protocols.
- Extends screens: Item detail (+ KitchenSpecTab); WorkOrder floor (+ FinishingQCPanel); Project site (+ SiteSurveyCapture).
- Extends workflows: QuotationApproval (+ finishing_review_step); WorkOrder (+ finishing_qc_gate, + installation_handover_gate).
- Provides: BOQ parser registered against `source_type = boq_import`; finishing-cost calculator registered into costing roll-up; kitchen-specific reports (NSF compliance, installation completion certificate, warranty registration).

### The Extension Framework contract (load-bearing)

Ten extension points the core exposes to packs:

1. Entity attribute extension via `extensible_attributes` JSONB with typed pack schemas.
2. Workflow state/transition extension at named insertion points in core state machines.
3. Screen slot extension (tabs, sidebars, action menus, field groups).
4. Master data seeds loaded at pack activation, scoped per tenant.
5. Workflow step-type registration (pack-supplied step handlers).
6. Validation rule registration (packs register validators fired on core entity save).
7. Report template registration against the core query layer.
8. Integration connector registration (parsers, exporters, webhook handlers).
9. Domain event subscription (packs subscribe to core events, run pack-specific logic).
10. Permission scope registration (packs declare permissions slotted into the RBAC tree).

The contract rule: a pack may *read* core entities, *extend* them via the ten points, and *observe* events — but may not write directly to core tables, override core logic, or fork core code. If a pack needs something core does not expose, the answer is to add an extension point to core, not to patch it.

### Schema shape (entities that anchor the architecture)

- **Item** — id, tenant_id, item_type enum, valuation_method enum, tracking_method enum, uom, extensible_attributes JSONB, lifecycle status, audit fields.
- **CustomerRequirement** — id, tenant_id, source_type enum (catalog_order, configurator_order, bom_import, boq_import, rfq_spec, contract_release, forecast_plan), source_payload JSONB, parsed_lines relation, lifecycle status.
- **Plant / Product / WorkOrder** — each carries `manufacturing_mode` as an array of enum values (eto, discrete, process, job_shop, repetitive, mixed); the mode set is validated at write time against the pack's enabled modes.
- **Lot / Batch / Serial** — genealogy tracked via parent-child relationships spanning supplier lot → GRN → work order consumption → work order production → customer shipment.
- **Workflow Definition / Workflow Instance** — definitions are JSON documents; instances record the definition version they started on and complete on that version.
- **Pack Registry** — pack manifest, version, depends_on (modes, compliance packs, core version range), enabled extension points, activation status per tenant.
- **Audit Record** — actor, timestamp (with timezone), tenant_id, entity type, entity id, operation, before_state JSONB, after_state JSONB, reason_for_change, previous_hash, this_hash.

### API contract

- REST + GraphQL, both versioned (`/api/v1/...`); breaking changes bump the version.
- Standard error envelope: `{ error_code, message, details, correlation_id }`.
- Pagination, filtering, sorting standardised across all list endpoints.
- Every write endpoint is idempotent when called with the same `Idempotency-Key` header.
- OAuth2 client credentials for service-to-service; OIDC for interactive.

### Third-party integrations (contract shape, not v1 build)

The following integrations are planned per existing memory; each must route through the Integration Fabric, never direct from a module:

Stripe, PayPal (Finance / payments); FedEx, other carriers (Logistics / shipping); QuickBooks (Finance / accounting sync); Shopify (Sales / e-commerce inbound). Failure modes: each integration has a DLQ, retries with exponential backoff, and circuit breakers; inbound webhooks are signature-verified.

---

## Non-Functional Requirements

- **Performance.** Core CRUD p95 under 300 ms at 100 concurrent tenant users per deployment. BOQ parse of a 500-line document under 10 seconds. MRP run on a 10,000-item catalog under 60 seconds. Audit log write adds under 20 ms to any mutation.
- **Scalability.** Per single-tenant deployment: up to 500 concurrent users, 10 million line-level transactions per year, 1 TB of document storage, 5-year audit retention online. Multi-tenant SaaS scalability targets are deferred (per Q5 resolution).
- **Availability.** 99.5% per single-tenant deployment in v1 (allowing for planned maintenance windows). Degraded states: if Elasticsearch is down, search returns a clear degraded-state message and CRUD still works; if the event bus is degraded, mutations still commit and events are queued for replay when the bus recovers.
- **Reliability.** All write endpoints idempotent with `Idempotency-Key`. Events delivered at-least-once with DLQ. Pack activation is transactional — partial activations roll back. Audit log durability matches database durability (synchronous commit).
- **Accessibility.** WCAG 2.1 AA targeted for all core screens and KitchenEquipment pack screens. Keyboard navigation and screen-reader labels on every interactive control. Accessibility is a PR-blocking CI check on the frontend.
- **Localization / i18n.** Labels are i18n-ready from v1 (extraction infrastructure in place). Shipping languages in v1: English. RTL layout supported but not visually validated in v1 (deferred to the first RTL locale rollout). Date/number/currency formatting per l10n. Country-specific validation (e.g., tax ID formats) is a Localisation platform service.
- **Browser / device support.** Baseline: latest Chrome, Firefox, Safari, Edge on desktop; latest Chrome and Safari on mobile. Tested matrix: Chrome + Safari desktop; Chrome Android + Safari iOS. IE is not supported.

---

## Security & Privacy

- **Authentication & authorization.** OIDC/SAML SSO via Identity platform service. MFA required for all administrator roles and recommended for all users. RBAC with role hierarchy; ABAC for attribute-driven policies (e.g., "user can only see items in their plant"). Pack-declared permission scopes are slotted into the RBAC tree at activation time.
- **Data classification.** PII: employee records (HR), customer contacts (CRM), supplier contacts (Procurement). Financial data: all of Finance, costing roll-ups. No PHI in v1. No cardholder data stored (payment integrations tokenise).
- **Data at rest & in transit.** AES-256 at rest for database and document store. TLS 1.2+ in transit; TLS 1.3 preferred. Encrypted backups.
- **Audit logging.** Every mutation on every entity logged with actor, timestamp, before/after, hash-chained. Retention five years online, seven years archived. Log readers require a dedicated audit-reader role distinct from tenant admin.
- **Threat model (top three).** (a) Cross-tenant data leak via query bug — mitigated by row-level-security in the database plus tenant enforcement in ORM plus automated cross-tenant test suite. (b) Leaky pack writes kitchen-specific field to a core entity under time pressure — mitigated by CI linting, code review discipline, and quarterly architecture audits. (c) Audit log tampering by insider — mitigated by hash-chain verification job and separation of audit-reader role from tenant admin.
- **Tenancy isolation.** `tenant_id` is a non-nullable column on every non-reference table. Row-level-security policies enforced in PostgreSQL. Every application-layer query routes through a tenant-scoped repository that rejects queries without tenant context. Automated cross-tenant test suite runs on every PR.

---

## Compliance

This PRD is *architectural groundwork* for compliance, not a compliance deliverable in itself. The substrate that compliance packs later depend on is required in v1; no compliance pack is authored in v1 (per Q3).

| Regime | v1 obligation | Who owns |
|---|---|---|
| **GDPR / DPDP** | PII fields identified; consent capture placeholder exists on HR and CRM entities; right-to-erasure and right-to-access APIs available as platform services; data-processing-addendum fields on customer/supplier records | Platform + HR + CRM |
| **21 CFR Part 11** | Substrate only — hash-chained audit, reason-for-change field, e-signature readiness. No pack authored | Platform |
| **IATF 16949, AS9100** | Substrate only — lot/batch/serial genealogy in core. No pack authored | Core + Platform |
| **HACCP, NSF-ANSI, food-safety / hazmat** | KitchenEquipment pack ships these as pack-internal validation and workflow rules (per Q3) | KitchenEquipment pack |
| **ISO 41001, OSHA, ADA, LEED/BREEAM** | N/A — this PRD does not target facility-management scope; OptiForge is manufacturing | — |
| **HIPAA, HITECH** | N/A — healthcare is not a v1 industry | — |
| **SOC 2** | Control mapping begun at the platform level (access control, audit, encryption, tenancy isolation all map to SOC 2 CC-series controls). Full certification is an operational exercise outside this PRD's scope | Platform |
| **Local tax, e-invoicing mandates (GST, VAT, ZATCA, etc.)** | Finance core module exposes tax engine extension points; localisation packs author specific country rules. UAE/KSA/India tax engines deferred to localisation-pack work | Finance + Localisation |

---

## Observability

- **Logs.** Structured JSON logs on every service. Fields: timestamp, correlation_id, tenant_id, actor_id, operation, layer (platform/core/mode/compliance/pack), module, duration_ms, outcome, error_code if any. Layer attribution on every log line is required to make pack vs. core failure separation clean.
- **Metrics.** Per-module counters for operations executed; histograms for operation latency; gauges for queue depth (event bus, Celery), DLQ size, active workflow instances, active pack count per tenant. Pack-specific metrics namespaced by pack id.
- **Traces.** End-to-end tracing for (a) CustomerRequirement → Quotation → Sales Order → Work Order → Shipment pipeline; (b) pack activation and deactivation flows; (c) event publish → subscriber processing. Trace context propagates across Celery boundaries.
- **Alerts.** DLQ size > threshold; audit hash-chain verification failure; cross-tenant query attempt; pack activation rollback; p95 latency SLO breach; core error rate SLO breach; pack-attributed error rate SLO breach (separately tracked).
- **Dashboards.** Platform health (uptime, latency, error rate per layer). Tenant health (active users, operations, pack mix). Pack health (per-pack error rate, extension-point invocation counts). Seam health — the count of cross-layer import violations suppressed, trending over time.

---

## Success Metrics

- **Primary KPI — seam integrity.** **Zero unapproved cross-layer import violations per release.** Measured by CI linter output. This is *the* metric that tells us the architecture commitment is holding. If this drifts above zero, the architecture has failed regardless of any other outcome.
- **Secondary KPIs.**
  - *Pack isolation* — percentage of kitchen-specific code residing in the KitchenEquipment pack vs. core. Target: ≥ 98% of kitchen-specific lines in pack; remaining ≤ 2% must be justified exceptions with tickets to resolve.
  - *Second-pack readiness* — time-to-first-commit for a second industry pack (measured when a second industry customer is signed). Target: the platform, core, and extension framework do not require changes to accept the second pack. Demonstrated via a "dummy pack" exercise before the second real pack starts.
  - *B3 MACBIS regression* — zero business-visible regressions in B3 MACBIS's current ETO kitchen workflows after migration from the current 14-module shape to the layered architecture. Measured via a regression test suite covering the 65+ process steps, 6 validation gates, and 8 KPIs of the existing ACERO structure.
- **Guardrail metrics (must not get worse).**
  - p95 core API latency: ≤ 300 ms (baseline established at v1 go-live).
  - Core error rate: ≤ 0.1%.
  - Support ticket volume attributable to architecture churn: trending down quarter-over-quarter.
  - Build time: < 10 minutes for the full monorepo CI run including cross-layer linting.
- **Measurement window.** Primary KPI measured per release, continuously. Secondary KPIs measured at six months and twelve months post v1 go-live. Second-pack readiness measured when a second industry customer is on the pipeline.

---

## Testing Decisions

- **Test external behaviour, not implementation.** Tests target the layer's contract — the extension-point API, the workflow insertion behaviour, the audit log format, the cross-tenant isolation guarantee — rather than internal structure. When a pack is refactored, its tests stay green.
- **Per-layer test coverage.**
  - *Platform services* — every service has unit tests for its API, integration tests for its persistence, contract tests for its consumer (an example "dummy pack" exercises every extension point as a canary). Platform is the highest-coverage layer because it is what other layers trust.
  - *Core modules* — unit tests on domain logic; integration tests on the end-to-end ETO + Discrete happy path (CRM → Sales → PLM → Production → MES → QMS → Logistics → Commissioning → Finance); cross-tenant isolation tests on every list and fetch endpoint.
  - *Mode extensions* — integration tests that specifically exercise ETO-only behaviours (Design Lock, Change Order cost impact) and Discrete-only behaviours (serial tracking). Scaffolded modes have a single "mode not available in this release" rejection test.
  - *KitchenEquipment pack* — full E2E tests of the B3 MACBIS happy-path flow, including BOQ parse, finishing QC gate, installation handover. Pack contract tests verify no forbidden writes to core tables.
  - *Cross-layer discipline* — automated architecture test (equivalent to ArchUnit-style discipline in Python) runs in CI and fails the build on any cross-layer import violation.
- **Modules explicitly not getting tests in v1.** The scaffolded-but-disabled modes (Process, Job-Shop, Repetitive, mixed) get only the "rejected at config time" test; no behavioural tests until their Layer 3 code is written. Compliance-pack extension points get readiness tests but no end-to-end compliance tests (no pack authored in v1).
- **Prior art in the codebase.** The existing Workflow Management BRS and Support/Ticketing BRS are closest to the kind of state-machine-driven behaviour the layered architecture makes pervasive. Their test patterns are a reasonable starting point; expand them with the cross-layer discipline requirement.

---

## Dependencies

- **Upstream.**
  - Commercial decisions on Q4 (Generic SKU) and Q7 (licensing model) — they do not block engineering but they shape customer-facing packaging of what engineering delivers.
  - Resolution of the existing-BRS split activity (Q2 committed) — must happen before Layer 2 core specs can be finalised.
- **Downstream.**
  - B3 MACBIS's go-live on the layered architecture depends on the KitchenEquipment pack reaching feature parity with the current shape.
  - Any future industry pack (pharma, automotive, aerospace, food processing) depends on the Layer 1 extension framework and the Layer 2 core shape being stable.
  - `kreupai-prd-to-plan` (downstream skill) will consume this PRD to generate the phased, tracer-bullet implementation plan.
- **External.**
  - PostgreSQL 15+ (for row-level security and JSONB features used in `extensible_attributes`).
  - Celery + RabbitMQ + Redis for background processing and event infrastructure.
  - Elasticsearch for search (optional — degraded state documented if absent).
  - Third-party integrations per existing plan: Stripe, PayPal, FedEx, QuickBooks, Shopify. None are on the critical path of the architecture work; they are integrated through the Integration Fabric as needed.

---

## Risks & Mitigations

| Risk | Likelihood | Impact | Mitigation |
|---|---|---|---|
| **Leaky pack** — pack writes directly to a core table or adds a kitchen-specific field to a core entity "just this once" under deadline pressure | High | High | Automated cross-layer import linting on every PR; quarterly architecture audit; layer-boundary violations block merge; suppressions require documented architecture-owner approval and are audited |
| **Platform under-investment** — Extension Framework, Workflow Engine, Event Bus neglected because they are "not customer-facing" | High | High | One engineer is dedicated platform owner from day one; platform work is a first-class sprint deliverable, not overhead; every feature documents which extension points it adds or consumes |
| **Core bloat** — a "common" feature is added to core that the fourth industry cannot extend | Medium | Medium | Rule of two: a feature starts in a pack; it is promoted to core only when it is demonstrably mode-agnostic and no reasonable pack-level variant exists |
| **Mode combinatorics explode** — the ETO + Discrete pair hits an untested combination with a future third mode | Medium | Medium (now); High (at v2) | Supported mode combinations are declared explicitly; CI tests those combinations; unsupported combinations are rejected at config time rather than producing broken behaviour |
| **Pack version skew** — pack v1.2 requires core v3.0, customer is on core v2.8 | Medium | Medium | Semver on packs and core; pack manifest declares `core_version_range`; fail-fast on mismatch with clear error; maintain compatibility matrix published to customers |
| **Data migration between modes** — a customer adds Process mode later and existing data lacks process-specific attributes | Low (v1) | High (when it happens) | Mode activation is an explicit upgrade with a migration script; mode-specific attributes are nullable and populated lazily; maintain a mode-pair migration playbook authored when the second mode ships |
| **B3 MACBIS regresses during migration** from current 14-module shape to layered architecture | Medium | High (business-critical customer) | Regression test suite covers existing ACERO 8-phase / 65-step / 6-gate / 8-KPI structure; migration is phased, not big-bang; parallel-run period before cut-over |
| **"Dummy pack" canary is neglected** — without a second pack in v1, the extension framework's real shape is untested | High | High | A synthetic second pack ("TestIndustry") is built as part of Layer 1 platform work solely to exercise every extension point; it is not customer-facing but is part of the CI test matrix |
| **Kitchen-specific concepts in existing BRSes are incompletely identified**, leaving residue in core | Medium | Medium | The BRS split activity (Q2) is performed module-by-module with an explicit checklist; a kitchen-concept-finder linter catches obvious residues (fascia, cladding, BOQ, NSF references) in core code |

---

## Migration & Rollout

### Migration from current 14-module shape

- **Scope of migration.** All existing B3 MACBIS data (masters, transactions, workflows) under the current 14-module shape moves to the new Layer 2 core + KitchenEquipment pack shape.
- **Approach.** Module-by-module, not big-bang. For each existing module:
  1. Split the module's BRS into (a) mode-agnostic core spec and (b) KitchenEquipment pack spec (per Q2 committed resolution).
  2. Implement the core shape; implement the pack shape; implement the migration script that moves existing data.
  3. Run the migration on a staging copy of production; validate via regression tests; iterate.
  4. Cut over one module at a time in production, with a parallel-run period.
- **Reversibility.** Every migration step is reversible via a reverse migration for the first 30 days after cutover of each module. After 30 days, reverse is possible but manual.
- **Data loss policy.** Zero data loss tolerated. Any migration that cannot preserve data is blocked until a lossless path is found.

### Rollout

- **Feature flags.** Layer 3 scaffolded modes, Layer 4 scaffolded compliance extension hooks, and KitchenEquipment pack extensions are all individually flaggable. A flag off returns the pre-flag behaviour.
- **Staged rollout.** Platform (Layer 1) is built first; a minimal core (Layer 2) + ETO+Discrete mode (Layer 3) + KitchenEquipment pack (Layer 5) come online together as the tracer-bullet v1. B3 MACBIS is the first and only customer in v1. Subsequent industry packs are their own rollouts.
- **Communication.** Internal — KreupAI engineering and product. External — B3 MACBIS business stakeholders get a migration plan and a parallel-run schedule. No public product announcement in v1; OptiForge is positioned as a B3 MACBIS internal system until a second customer is signed.
- **Rollback.** Per-module rollback is supported via reverse migrations (see above). Architecture-level rollback stories from the brainstorm:
  - *B → A (collapse layers into flat modules):* 18-month exercise. Possible but loses the multi-industry cleanliness. No data loss.
  - *B → C (extract contexts into services):* 2–3 year exercise. Likely long-term destination regardless.
  - *Partial rollback of a specific pack:* cheap — rewrite the pack, core is untouched. This is the payoff of strict seam.
- **Rollback triggers.** Primary KPI (seam integrity) drifting above zero unapproved violations for two consecutive releases. Secondary — B3 MACBIS business-visible regression that cannot be fixed within its migration window.

---

## Out of Scope

Explicitly not covered by this PRD, even though a reader might expect them:

- **Hard microservices split.** OptiForge ships as a modular monolith on Django + Next.js. Service extraction is a later exercise, if and when it becomes justified.
- **Multi-tenant SaaS product-ops.** The data model is multi-tenant; deployment remains single-tenant per-customer in v1. The ops capability to run a SaaS fleet is a separate product and is not in scope.
- **Full industry pack build-out for non-kitchen industries.** Only KitchenEquipment ships in v1. Pharma, Automotive, Aerospace, Food Processing pack designs remain informative stubs in the brainstorm; authoring them is future work.
- **Scaffolded modes' Layer 3 module code.** Process, Job-Shop, Repetitive, and `mixed` have registry enum values and extension points; their mode-specific masters and workflows are not built.
- **Compliance pack authoring.** Layer 4 is scaffolded; zero compliance packs are authored in v1.
- **OptiForge Generic SKU.** Commercial positioning question (Q4) — carried to Open Questions. No engineering work to build a "generic" shippable product is in v1 scope.
- **Deep AI/ML features.** Predictive maintenance, demand-forecasting ML, NL query, copilot — all roadmap items, not v1.
- **Mobile-first rewrite.** Mobile apps (warehouse RF, shop-floor, maintenance, sales field, field-service technician) are deferred feature modules, not architectural reshapes of this PRD.
- **Blockchain / DLT for traceability.** Can be added later via the Event Bus and Integration Fabric; not planned.
- **BPM-style visual workflow authoring UI.** The Workflow Engine is API-first in v1; a visual authoring UI is a later layer on top.
- **End-user business stories for each core module.** This PRD is about the *architecture* that enables those modules. Per-module PRDs describe their own user stories; they depend on this one but are separate deliverables.
- **Localisation beyond English and ready-but-unvalidated RTL.** Per-country tax engines, regional payroll rules, and fully validated RTL are deferred to localisation-pack work.

---

## Open Questions

Decisions that remain unresolved. Each has an owner and a needed-by point. The two starred items do not block the tracer-bullet phase; the remainder must be resolved before the phases that depend on them.

1. **Q4 — "OptiForge Generic" SKU.** *Owner: Bosco. Needed by: before Layer 5 go-to-market communications are drafted.* Commercial-positioning call. Engineering is unaffected either way; sales messaging and pricing pages are. Carried from brainstorm.
2. **Q7 — Commercial model for packs.** *Owner: Bosco. Needed by: before first pack sale to an external customer (i.e., before any second-industry customer contract).* Per-pack vs. per-module vs. per-mode licensing. Engineering enforces the seam regardless; commercial model determines how sales describes the product. Carried from brainstorm.
3. **Which existing third-party integrations (Stripe, PayPal, FedEx, QuickBooks, Shopify) are in v1 scope vs. deferred?** *Owner: Bosco. Needed by: start of Integration Fabric phase.* The Integration Fabric is in scope; which concrete connectors are authored first is a prioritisation question not answered by this PRD.
4. **Is the "TestIndustry" dummy pack part of the shipped codebase or a test-only artifact?** *Owner: Platform engineering. Needed by: start of Layer 1 platform work.* Architecturally it must exist; the question is whether it is in the production repo or lives in CI-only.
5. **Who is the dedicated platform owner named in the risk-mitigation plan?** *Owner: Bosco / KreupAI. Needed by: start of Layer 1 work.* The mitigation is credible only if a named engineer exists in the role.
6. **Regression test suite for the existing ACERO 8-phase / 65-step / 6-gate / 8-KPI structure — does it exist today or must it be authored?** *Owner: Bosco / QA lead. Needed by: start of migration of the first core module.* The success-metric commitment of "zero B3 MACBIS regression" relies on this suite; if it does not exist, authoring it is itself a prerequisite work item.

---

## Further Notes

- The brainstorm's Section 2 (P1 gaps) lists ten missing competitive domains. Nine of them (QMS, PLM, CMMS/EAM, EHS, S&OP, WMS depth, Field Service, MES, Integration Fabric) are in Layer 2 core scope for v1. The tenth (Costing depth beyond Estimation) is folded back into Finance + Estimation per Q8, to be extracted in v2.
- The "Industry 4.0 / Digital Twin" UI that exists in the current OptiForge screens has no matching BRS. Per Q6 resolution, its backing capability (MES) is in core; its visualization is a KitchenEquipment-pack screen. When other industry packs ship, each authors its own visualization appropriate to that industry.
- The phrase "24 core modules" appears throughout the brainstorm. Per Q8 resolution, v1 ships **21** — the three extractions (Routing, Costing, CPQ) are deferred. The brainstorm's count should be read as a medium-term target, not a v1 commitment.
- The hybrid architecture document already in the project (`/mnt/project/B3_MACBIS_ERP_-_Hybrid_Architecture__Django___Next_js_.md`) describes the concrete tech stack. Nothing in this PRD contradicts it; this PRD is the architectural layering that sits on top of that stack.
- The existing ERP Project Structure doc describes a modular folder layout. That structure remains valid for the Layer 2 core modules; Layer 3 mode extensions, Layer 4 compliance packs, and Layer 5 industry packs are new top-level directories that the structure doc does not yet describe. Updating the project-structure doc to reflect the layers is a small, follow-on task and is not in this PRD.
