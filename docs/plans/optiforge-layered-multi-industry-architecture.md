# OptiForge — Layered Multi-Industry Architecture — Implementation Plan

*Generated from PRD: `./prds/optiforge-layered-multi-industry-architecture.md`*

## Overview

OptiForge is being re-architected from a flat 14-module kitchen-ETO ERP into a five-layer multi-industry platform: Platform services → Core modules → Mode extensions → Compliance packs → Industry packs. The build is shaped around one uncompromisable constraint — the core/pack seam. If the seam leaks, the whole premise fails; if it holds, every future industry costs a fraction of the first. This plan reflects that constraint: Phase 1 is deliberately architecture-proving (not feature-delivering), and every phase is measured against seam integrity before feature completeness. Five phases take OptiForge from nothing to B3 MACBIS production cutover on the layered architecture, with the KitchenEquipment pack as the only authored industry pack and ETO + Discrete as the only supported mode combination at v1 go-live.

---

## Phase 1: Tracer Bullet — Seam-Proving Vertical Slice

**Goal**: Prove the core/pack seam works end-to-end by shipping the thinnest possible flow that requires it: a tenant-scoped user uploads a BOQ file to a CustomerRequirement, the KitchenEquipment pack's stub parser is invoked through the Extension Framework, pack-contributed attributes land on the resulting record, a domain event fires to both the pack and a "TestIndustry" dummy pack, and every mutation is captured in a hash-chained audit log with correct layer attribution. This phase flushes out integration problems in the pack contract while they are still cheap to fix. No feature completeness, no edge cases — just the critical path through every architectural layer once.

**Deliverables**:
- [ ] Schema: `tenant_id` column and PostgreSQL row-level-security policies on every table created in this phase; `audit_record` table with hash-chain fields; `pack_registry` table; a single core entity (`CustomerRequirement`) with `source_type` enum and `extensible_attributes` JSONB; a minimal `workflow_instance` table recording definition version
- [ ] Platform service — Identity & Access (minimal — OIDC login only, one role, tenant membership enforced)
- [ ] Platform service — Tenancy (provisioning API, tenant-scoped query repository, RLS enforcement)
- [ ] Platform service — Audit (hash-chained write on every mutation in this phase's scope; one reader API)
- [ ] Platform service — Events (publish-subscribe via RabbitMQ; at-least-once delivery; one event type — `CustomerRequirementCreated`; no replay or DLQ yet)
- [ ] Platform service — Extension Framework (pack manifest parser; pack registry; one extension point working end-to-end — integration connector registration for `source_type` parsers)
- [ ] Platform service — API Gateway (one versioned endpoint `POST /api/v1/customer-requirements`; OAuth2 client credentials scaffolding only, interactive auth via OIDC)
- [ ] Core module — Sales (stub): only the `CustomerRequirement` create endpoint and its list/read siblings
- [ ] Mode extension — ETO (stub): registers itself as active; contributes nothing beyond presence in this phase
- [ ] Industry pack — KitchenEquipment (stub): manifest declares a single BOQ parser registered against `source_type = boq_import`; parser is a hardcoded function that accepts a fake BOQ payload and emits two parsed lines with `fascia_type` and `cladding_type` in `extensible_attributes`
- [ ] Industry pack — TestIndustry (the dummy pack): manifest subscribes to `CustomerRequirementCreated` and logs receipt; used to prove the event bus feeds two packs equally
- [ ] UI — one Next.js page behind auth that lets an authenticated user upload a BOQ file and see the parsed result; uses one pack-contributed screen slot (a tab) to render the kitchen attributes
- [ ] CI — cross-layer import linter that fails the build if a core module imports from a pack, a pack imports from another pack, or a platform service imports upward; one canary test that deliberately violates the rule and is expected to fail
- [ ] Tests — unit tests on the manifest parser, tenant-scoped repository, and audit hash-chain; integration test on the full BOQ-upload → parse → audit → event path; a cross-tenant isolation test proving tenant A cannot read tenant B's CustomerRequirement; the cross-layer linter canary test

**Done when**: A developer runs the system locally with two tenants and two packs (KitchenEquipment + TestIndustry) both activated; logs in as a user in tenant A; uploads a fake BOQ file through the UI; sees the parsed lines with kitchen-specific attributes; can query the audit log and see every mutation attributed to the correct layer; can query the event log and confirm both packs received the domain event; attempts to read the same CustomerRequirement while logged in as a tenant-B user and receives a not-found response; and pushes a deliberate layer-violation to a branch and watches CI fail.

---

## Phase 2: Platform Depth

**Goal**: Bring every one of the 12 platform services to production-grade, because every subsequent phase trusts them. Phase 1 built the minimum viable platform; Phase 2 makes it load-bearing. Nothing in the core or packs changes in this phase — it is pure platform investment. The "TestIndustry" dummy pack is extended to exercise every platform capability added here, so any gap in platform is caught by its contract tests before real packs depend on it.

**Deliverables**:
- [ ] Identity & Access — SAML in addition to OIDC; MFA for administrator roles; full RBAC with role hierarchy; ABAC policy engine; delegated admin
- [ ] Tenancy — full provisioning lifecycle (create, suspend, archive); tenant-scoped pack activation with transactional rollback on failure; seed-data scoping verified per tenant
- [ ] Audit — reader role separated from tenant admin; hash-chain verification job running on schedule; audit query latency SLO met on entities with 10,000+ records; retention policy configured
- [ ] Events — at-least-once delivery hardened; DLQ with alerting; subscriber-initiated replay from timestamp; subscriber processing status observable per-subscriber
- [ ] API Gateway — GraphQL alongside REST; per-tenant rate limiting; request logging with correlation IDs; idempotency via `Idempotency-Key` header on all writes; standard error envelope
- [ ] Integration Fabric — connector framework (the shape packs and future connectors plug into); EDI engine stubbed with X12 + EDIFACT + AS2 codecs; webhook engine with signature verification; scheduled sync jobs; DLQ per connector
- [ ] Workflow Engine — state machines as JSON; named insertion points; pack-registered step handlers; definition versioning (running instances complete on the version they started); API-first authoring (no visual UI — out of scope per PRD)
- [ ] Document Store — versioned binary storage; check-in / check-out; retention policies; OCR indexing for uploaded drawings and PDFs
- [ ] Notification — email, SMS, push, in-app channels; template library; routing rules; opt-out management
- [ ] Extension Framework — all ten extension points from the PRD implemented and documented; TestIndustry pack extended to exercise each one; contract tests per extension point
- [ ] Localisation — i18n label extraction pipeline; l10n formatters (date, number, currency); RTL layout support in the frontend (structural only, no validated locale yet); country-validator extension hook
- [ ] Reporting Fabric — unified query layer; scheduled reports; PDF / Excel / CSV export pipeline; hooks for embedded BI later
- [ ] Observability — structured logs with layer attribution on every service; per-module metrics; distributed tracing across Celery boundaries; alert rules for DLQ depth, hash-chain verification failure, cross-tenant query attempt, pack activation rollback, SLO breach
- [ ] Tests — per-service unit + integration tests; contract tests driven by TestIndustry pack exercising every extension point; cross-tenant isolation suite expanded to cover every new platform write path; chaos test on event bus recovery and DLQ replay

**Done when**: The TestIndustry dummy pack uses every one of the ten extension points successfully in CI; the platform passes a 24-hour soak test without hash-chain breaks, cross-tenant leaks, or event loss; an operator can provision a new tenant via API, activate packs on it, and see all seed data scoped correctly; alerts fire correctly on the chaos tests; and the observability dashboards show healthy state for every platform service.

---

## Phase 3: Core — Demand & Design Half + ETO Mode

**Goal**: Build the upstream half of the core manufacturing flow (lead → design-locked sales order) as real, industry-agnostic modules, and layer ETO mode alongside the modules that require it (Sales needs BOQ, PLM needs design lock with change-order-with-cost-impact). The KitchenEquipment pack grows to feature parity for this slice only. Phase 3 is shippable: at its end, a B3 MACBIS estimator can take a lead through quotation to a design-locked sales order using the real system, even though downstream (production, MES, logistics, finance) is not yet on the new shape.

**Deliverables**:
- [ ] Core module — CRM (leads, opportunities, contacts, accounts; fully industry-agnostic — no kitchen taxonomy in core)
- [ ] Core module — Sales (quotations, sales orders, CPQ staying folded in per Q8; `CustomerRequirement` with full `source_type` set wired through; mode-aware behaviour gated on `manufacturing_mode`)
- [ ] Core module — PLM (Part Master with revision control; engineering vs manufacturing BOM; ECR → ECO → ECN workflow; where-used analysis; drawing vault integrated with Document Store; alternates / substitutes; variant BOM)
- [ ] Core module — S&OP & Demand Planning (forecasting statistical-only in this phase; MPS; RCCP; MRP deep-run deferred to Phase 4; ATP/CTP; S&OP consensus cycle; ML-based forecasting is out of scope per PRD)
- [ ] Core module — Procurement (RFQ, PO, GRN, supplier master, approvals through Workflow Engine)
- [ ] Core module — Inventory / Stores (item lifecycle, stock transactions, valuation methods, UoM conversion matrix, lot/batch/serial genealogy — the full traceability substrate from PRD Story 8)
- [ ] Core module — Warehouse Management (bin-level locations; putaway / pick strategies — wave / zone / batch / cluster; cycle counting; cross-docking; FEFO; kitting; RF / handheld workflow endpoints; yard management)
- [ ] Core module — Project Management (project structure, WBS, milestones, resource allocation; the foundation Commissioning and ETO build on top of)
- [ ] Core module — Human Resources (employee master, org structure, role-to-user mapping; payroll / T&A deep features deferred)
- [ ] Core module — IT & Admin Services (user admin, tenant admin surfaces; consumes Identity & Access platform service)
- [ ] Mode extension — ETO (real, production-grade): BOQ-aware `CustomerRequirement` handling wired end-to-end through Sales; Design Lock on sales orders after commitment; Change Order with cost-impact calculation; project-based work order shape; milestone billing schema; retention schema; liquidated damages schema; site survey entity; handover documentation entity
- [ ] Mode extension — Discrete stays as the "default" core shape (no separate module needed; the core modules are already shaped around it per the brainstorm)
- [ ] Mode extensions — Process, Job-Shop, Repetitive, `mixed`: registered in the mode registry with `status: scaffolded`; activation attempts rejected at config time with the PRD-defined error; no behavioural code
- [ ] Industry pack — KitchenEquipment grows to cover this half: full BOQ parser (real formats, not the stub) with row/column error reporting; kitchen product taxonomy seeded; BOQ templates (restaurant, hospital, food_court, corporate); finishing-cost calculator registered into costing roll-up; `Item.detail` tab with kitchen spec extension live; `QuotationApproval` workflow with finishing-review step inserted at its named insertion point; NSF compliance rules as pack-internal validators; installation completion certificate report
- [ ] Regression harness — the existing B3 MACBIS ACERO 8-phase / 65-step / 6-gate / 8-KPI test suite (or authoring it if it does not exist — see Open Questions) runs against the new shape for the demand & design half only; green before phase is called done
- [ ] Tests — per-module unit + integration tests; E2E test of the demand-through-design-lock happy path with KitchenEquipment pack active; cross-tenant isolation extended to every new endpoint; a "kitchen-concept-finder" lint rule catches references to `fascia`, `cladding`, `BOQ`, `NSF`, etc. anywhere in core code

**Done when**: A B3 MACBIS estimator can take a CRM lead, convert it to an opportunity, upload a real BOQ, have the KitchenEquipment pack parse it into quotation lines with kitchen attributes, route the quotation through approval (including the pack-inserted finishing review step), convert to a sales order, Design-Lock it, issue a change order that recomputes cost impact, and see the resulting data correctly in both the UI and downstream reporting — with the demand-half regression suite green and zero cross-layer linter violations.

---

## Phase 4: Core — Execution Half + KitchenEquipment Pack to Parity + B3 MACBIS Migration

**Goal**: Build the downstream half of the core flow (work order release → MES execution → quality → logistics → commissioning → field service → finance), complete the KitchenEquipment pack to full B3 MACBIS parity, and run the module-by-module migration that moves B3 MACBIS data from the current 14-module shape to the new layered shape. This is the heaviest phase by volume, but each module is shipped behind a feature flag and each migration is reversible for 30 days per the PRD — so the phase remains shippable in increments, not as a single big-bang.

**Deliverables**:
- [ ] Core module — Production Planning (MRP full deep-run; Routing stays folded in per Q8; capacity planning against routings; work order release; integration with S&OP Phase 3)
- [ ] Core module — Manufacturing Execution (MES): operator clock-in on operation; job dispatch list; scrap / rework / yield capture; ANDON; OEE; downtime reason codes; EBR scaffolding (for future Process mode); eDHR scaffolding (for future medical-devices pack); PLC / SCADA integration protocols (OPC-UA, MQTT, Modbus) via Integration Fabric connectors
- [ ] Core module — QMS: IQC / IPQC / OQC; NCR; CAPA; SCAR; SPC; calibration; audit; document control integrated with Document Store; change control integrated with PLM
- [ ] Core module — Asset / CMMS / EAM: asset register with hierarchy / criticality; PM (time, meter, condition-based); PdM hooks for IoT; maintenance WO; spare parts tie-in with Inventory; MTBF / MTTR / OEE; Permit-to-Work
- [ ] Core module — EHS: incident management; HIRA / JSA; PTW; PPE; hazmat / SDS; environmental monitoring; safety training; Management of Change
- [ ] Core module — Field Service / Aftermarket: installed base; warranty; AMC / service contracts with SLA; dispatch with skills / location; technician mobile surface with offline support (the surface — the native mobile app is out of scope per PRD); parts-in-truck; depot repair; aftermarket parts sales; RMA integrated with warranty
- [ ] Core module — Commissioning & Installation: on-site commissioning workflow; handover; installed-base creation at handover; warranty / AMC clock start
- [ ] Core module — Finance: GL, AP, AR, bank reconciliation, cost centers, profit centers; Costing and Estimation stay folded in per Q8; multi-currency basics; tax-engine extension hook for future localisation packs; IFRS 15 / ASC 606 revenue recognition for milestone billing from ETO mode
- [ ] Core module — Logistics: inward, outward, reverse; integration with Field Service returns; carrier-connector extension points (actual connectors — FedEx etc. — depend on Q-carrier-integration resolution)
- [ ] Core module — Support: customer support tickets; integrated with Field Service for aftermarket issues; knowledge base
- [ ] Core module — Analytics & BI: unified data warehouse / semantic layer; role-specific pre-built dashboards for each core module; embedded analytics hooks on every core screen; NL query and predictive analytics are out of scope per PRD
- [ ] Industry pack — KitchenEquipment completes full B3 MACBIS parity: `WorkOrder.floor` with FinishingQCPanel; `Project.site` with SiteSurveyCapture; `WorkOrder` workflow with `finishing_qc_gate` and `installation_handover_gate` inserted at named points; commissioning protocols for cooking / refrigeration / food-prep / washing / ventilation / storage seeded; site-survey templates for restaurant / hospital / food-court / corporate; warranty-registration report; NSF-ANSI compliance rules covering execution-half workflows
- [ ] Migration — module-by-module migration of existing B3 MACBIS production data from the current 14-module shape to the new layered shape, following the PRD migration procedure: split BRS → implement core + pack → migrate on staging → validate against regression harness → cut over in production with a parallel-run window → keep the reverse migration available for 30 days
- [ ] Regression harness — full ACERO 8-phase / 65-step / 6-gate / 8-KPI suite green end-to-end (not just the demand half from Phase 3); zero business-visible regressions per the PRD's secondary KPI
- [ ] Tests — per-module unit + integration tests; full E2E test covering the PRD's "Section 11" happy-path flow (lead → CRM → BOQ quotation → configurator → costing → approval → sales order → design lock → MRP → work order → MES → QMS gates → WMS → logistics → commissioning → installed base); migration tests on a production-shape dataset for every module; the "kitchen-concept-finder" linter covers the execution half

**Done when**: B3 MACBIS is running entirely on the layered architecture in production; the full ACERO regression suite is green; the primary success KPI (zero unapproved cross-layer import violations) is clean for every release inside this phase; the full end-to-end happy path demos successfully from lead capture to installed-base creation; and the 30-day reverse-migration window on the last-migrated module has either been exercised successfully in a drill or passed without needing to be used.

---

## Phase 5: Go-Live Readiness, Scaffolding Verification, and Seam Hardening

**Goal**: Close the gap between "code is complete" and "we can defend this architecture under pressure." Phase 5 proves every guardrail actually works — the rejection paths for scaffolded modes, the compliance-pack extension hooks, the second-pack readiness, the SLOs, the rollback stories — and resolves the remaining Open Questions that do not block core delivery but do block confident go-live. This phase is about *not shipping a half-strict seam that rolls back to nothing clean*, which the brainstorm named as the most expensive mistake to avoid.

**Deliverables**:
- [ ] Scaffolded-mode rejection verified — automated test per mode (Process, Job-Shop, Repetitive, `mixed`) confirming the "mode not available in this release" error is returned at config time with the PRD-defined message and compatibility-matrix link; UI does not offer scaffolded modes as options
- [ ] Compliance-pack extension hooks verified — a throwaway compliance pack written and installed purely in CI that exercises the document-control, e-signature-gate, validation-lifecycle, training-record, and regulatory-reporting hooks declared in Phase 2; no compliance pack ships to customers (per PRD Q3)
- [ ] Second-pack readiness drill — a non-kitchen dummy industry pack (distinct from the TestIndustry platform-testing pack) authored end-to-end against the current core, proving the platform and core do not require changes to accept a second industry; drill timed and documented
- [ ] Pack version compatibility matrix published; fail-fast on pack-to-core version mismatch verified; semver discipline confirmed on both pack and core release processes
- [ ] Mode-pair migration playbook authored (even though no customer needs it yet) — the template for how a future customer adds Process mode on top of existing ETO + Discrete data; dry-run on staging data
- [ ] Disaster-recovery drill — audit hash-chain verification survives a point-in-time database restore; tenant provisioning survives a platform restart; event replay successfully reconstructs subscriber state from DLQ
- [ ] Performance and scalability validation — p95 latency, throughput, MRP runtime, BOQ parse time, audit write overhead all measured against the PRD NFRs under realistic load; SLOs confirmed
- [ ] Accessibility compliance — WCAG 2.1 AA audit on core and KitchenEquipment pack screens; keyboard navigation and screen-reader paths verified; accessibility CI check now merge-blocking
- [ ] Localisation readiness — English labels fully extracted; l10n formatters verified; RTL structural support verified on a staging build (no RTL locale shipped yet)
- [ ] Security hardening — third-party penetration test pass; threat-model top-three mitigations verified by red-team exercise; OAuth2 client credentials rotation tested; MFA enforcement confirmed on admin roles; encryption at rest and in transit verified
- [ ] Resolution of remaining Open Questions from the PRD that this phase surfaces to the owner: Q4 (Generic SKU commercial decision), Q7 (commercial model for packs), third-party integration prioritisation, named platform owner documented in the runbook, ACERO regression suite ownership assigned
- [ ] Runbook — operator runbook for pack activation / deactivation, tenant provisioning, incident response for the alert list from Phase 2, restore-from-backup, and migration reversal; owner named for each section
- [ ] Rollback drill — deliberately roll back one migrated module in a staging environment using the PRD's reverse-migration path; confirm no data loss; confirm the time budget matches what was committed to B3 MACBIS
- [ ] Documentation — architecture layer model, extension-point catalogue, pack authoring guide, migration playbook, compatibility matrix, all published to the KreupAI internal doc site
- [ ] Tests — the full end-to-end regression suite green on release-candidate builds; primary KPI (zero unapproved cross-layer violations) green for the four weeks leading up to go-live; guardrail metrics (p95 latency, error rate, support ticket volume) trending as the PRD requires

**Done when**: B3 MACBIS is stable in production on the layered architecture for four weeks with no architecture-attributable incidents; the primary success KPI has been continuously green since go-live; the second-pack readiness drill produced a working non-kitchen pack without platform or core changes; the rollback drill completed successfully in staging within its committed time budget; and the runbook, documentation, and compatibility matrix are complete and have named owners.

---

## Out of Scope

Carried from the PRD and re-stated here because they shape the plan's shippability story:

- Microservices extraction — OptiForge ships as a modular monolith throughout all five phases; service boundaries are documented but not enforced at process level.
- Multi-tenant SaaS product-ops — the data model is multi-tenant from Phase 1 onward, but deployment remains per-customer Linux in all phases; SaaS operations are a separate product.
- Authoring non-kitchen industry packs for customers — only KitchenEquipment is a production pack. TestIndustry (Phase 1+2) and the second-pack-readiness drill pack (Phase 5) are internal-only.
- Authoring compliance packs for customers — Layer 4 is scaffolded and verified via a throwaway CI pack; no compliance pack ships.
- Building out scaffolded modes' behaviour (Process, Job-Shop, Repetitive, `mixed`) — rejection paths verified only.
- Deep AI/ML features, mobile-first rewrites, blockchain traceability, BPM visual workflow authoring UI — all out per PRD.
- Native mobile apps for warehouse RF, shop-floor, maintenance, field service — Phase 4 delivers the *surfaces* these apps would consume (offline-capable endpoints, RF workflows); the apps themselves are a later program.
- Localisation beyond English plus ready-but-unvalidated RTL — per-country tax engines and fully validated RTL locales are deferred.
- A dedicated Costing module, a dedicated Routing module, a dedicated CPQ module — all three remain folded into their parents (Finance, Production Planning, Sales respectively) per PRD Q8. Extracting them is future work when a second industry pack justifies it.

## Open Questions

Carried from the PRD with their phase-blocking status clarified:

1. **Q4 — "OptiForge Generic" SKU.** *Owner: Bosco. Does not block any phase.* Commercial-positioning decision; resolve before any external customer messaging. Flagged in Phase 5 for explicit resolution.
2. **Q7 — Commercial model for packs.** *Owner: Bosco. Does not block any phase.* Engineering enforces the seam regardless of commercial model. Flagged in Phase 5 for explicit resolution before any non-B3-MACBIS pack sale.
3. **Which third-party integrations (Stripe, PayPal, FedEx, QuickBooks, Shopify) ship in v1?** *Owner: Bosco. Blocks sequencing within Phase 2 (Integration Fabric connector priority) and Phase 4 (Logistics carrier connectors, Finance payment connectors).* Needs resolution before the Integration Fabric work in Phase 2 begins, or the connector framework ships without exercised connectors.
4. **Is the TestIndustry dummy pack part of the shipped codebase or CI-only?** *Owner: Platform engineering. Blocks start of Phase 1.* Recommendation: keep it in the shipped repo under a non-activatable flag — that way platform contract tests run against it in every environment, not just CI.
5. **Named platform owner.** *Owner: Bosco / KreupAI leadership. Blocks start of Phase 1.* Per the PRD's risk mitigation, the "dedicated platform owner from day one" commitment is credible only with a named engineer in the role. This needs a name before Phase 1 kicks off.
6. **Does the ACERO regression test suite exist today, or must it be authored?** *Owner: Bosco / QA lead. Blocks the Phase 3 "demand-half regression" checkpoint and Phase 4 "full regression" checkpoint.* If the suite does not exist, authoring it is itself a work item that must run in parallel with Phase 3 delivery; the plan assumes it exists or is authored alongside Phase 3, not after.
7. **Migration cutover windows and parallel-run durations for B3 MACBIS.** *Owner: Bosco + B3 MACBIS operations. Blocks Phase 4 migration execution, not Phase 4 build.* Needs a production-calendar conversation before cutover of the first migrated module, not before Phase 4 starts.
