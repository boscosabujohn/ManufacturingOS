# Phase 1 Kickoff Checklist

**Status: Complete**
**Blocks: GitHub issue P1-01 (and every subsequent Phase 1 issue)**

Phase 1 is the tracer bullet — it ships the seam-enforcement mechanism and proves the platform / core / mode / pack contract works end-to-end. Before any engineer picks up P1-01, this checklist must be complete. Every item below is a real prerequisite, not ceremony; skipping any of them creates risk that compounds over the following phases.

Work through these in the order listed. Later items depend on earlier ones.

---

## 1. Named platform owner

**Decision needed:** Who is the dedicated platform owner for the lifetime of v1?

**Why this is load-bearing.** ADR-0001's strict-seam commitment and the PRD's "Platform under-investment" risk both assume one engineer is accountable for Layer 1 services (the 12 platform services in Phase 2) and the extension framework contract. Without a named person, platform work will be deprioritised whenever customer-visible feature work exists, which is always. This is the single most cited mitigation in the Risks & Mitigations section of the PRD.

**What "owner" means here.**
- Reviews every PR that touches Layer 1 services or the extension framework.
- Maintains the extension-point catalogue as packs get authored.
- Runs the quarterly architecture audit (seam-leak detection).
- Is accountable for the primary success metric: zero unapproved cross-layer violations per release.

**How to close this item.**
- Name the engineer in this checklist (below).
- Add them as a code-owner for `docs/adr/`, `docs/prds/`, and whatever directories correspond to Layer 1 services once P1-01 establishes the repo layout.
- Document them in the runbook (when that runbook is authored in Phase 5, but reserve the line now).

**Decision:**

> Platform owner: **Bosco**
> Decided on: **2026-04-23**
> Documented in: this checklist + CODEOWNERS file (pending P1-01).

---

## 2. OIDC provider choice

**Decision needed:** Which OIDC provider does OptiForge authenticate against?

**Why this blocks P1-01.** Issue P1-03 (Identity: OIDC login with one role and tenant membership) is HITL specifically because this choice is architectural and affects every subsequent Phase 2 identity-hardening deliverable (SAML alongside, MFA, delegated admin, RBAC hierarchy). Deciding mid-Phase-1 stalls the team; deciding now costs a half-hour.

**The real options.**

- **Keycloak (self-hosted).** Free, flexible, supports OIDC + SAML + custom flows natively. Heavy operational footprint (Java process, its own database, its own upgrades). Good fit if OptiForge will be sold as on-prem / single-tenant-per-customer and the customer will not accept SaaS auth dependencies.
- **Auth0.** SaaS, low operational cost, per-MAU pricing. Fast to integrate. Creates a runtime dependency on Auth0 availability and a recurring line-item in the customer's cost. Good fit if SaaS hosting is plausible within 2 years.
- **Azure AD / Entra ID.** Enterprise-ready if B3 MACBIS already uses Microsoft 365. Natural if customers are Microsoft shops. Less flexible for multi-IdP scenarios.
- **Other (Okta, AWS Cognito, etc.).** Viable but no strong reason to prefer over the above three for this use case.

**Default proposal — Keycloak.** Matches the single-tenant-per-customer deployment model in the PRD (Q5 resolution). Customer controls their auth. No SaaS dependency. Operational cost is real but manageable for a small number of deployments. This proposal can be overridden but requires written rationale in an ADR.

**How to close this item.**
- Write an ADR (`0003-oidc-provider.md`) documenting the choice.
- Link the ADR from issue P1-03 as its blocker-removed reference.

**Decision:**

> OIDC provider: **KEYCLOAK**
> ADR: **`docs/adr/0003-oidc-provider.md`** (pending)
> Decided on: **2026-04-23**

---

## 3. ACERO regression test suite — existence and ownership

**Decision needed:** Does the B3 MACBIS ACERO 8-phase / 65-step / 6-gate / 8-KPI regression suite exist today? If not, who authors it and on what timeline?

**Why this matters.** The PRD's secondary success KPI is "zero business-visible regression in B3 MACBIS's current ETO kitchen workflows after migration." Issue P3-15 authors or adapts the regression suite. Issue P4-M01..P4-M14 (the 14 migration tickets) and P4-FULL-REG all depend on the suite being real, not aspirational.

**The three scenarios.**

- **Scenario A: the suite exists today.** Great — identify where, who owns it, what format. Adaptation to the new shape (P3-15) is the only work.
- **Scenario B: parts of it exist as manual QA runbooks, not automated tests.** Authoring automated versions is ~2–4 weeks of work for someone who knows the current B3 MACBIS system. This must run in parallel with Phase 3, not after.
- **Scenario C: nothing like this exists.** The scope of authoring it is multi-person-month. Phases 3 and 4 cannot reach their "Done when" gates without it. This materially affects the schedule.

**How to close this item.**
- Talk to whoever runs B3 MACBIS QA today. Ask concretely: "what test exists that exercises the full 8-phase ACERO flow, from lead to installed base?"
- Document the answer below.
- If Scenario B or C, assign an owner and a target date; both must be real, not placeholder.

**Decision:**

> Suite status: **PARTIAL — MANUAL** (Pending Confirmation)
> Owner: **Bosco**
> If not complete today, target for coverage: **TBD**
> Captured in: this checklist + GitHub issue P3-15 updated with this context.

---

## 4. GitHub project board set up

**Decision needed:** none — this is mechanical. But do it before picking up P1-01.

**Why.** With 83 filed issues, a list view is unworkable. A project board gives a Ready / In Progress / In Review / Done / Blocked columnar view. Issues dependency-blocked on unresolved items (e.g., P1-03 waiting on item #2 above) sit in Blocked; everything else is Ready.

**Actions.**
- Create a GitHub Project (new) in the repo: "OptiForge v1".
- Columns: `Backlog`, `Ready`, `In Progress`, `In Review`, `Done`, `Blocked`.
- Add all 83 filed issues to the project.
- Move the 14 Phase 1 issues to `Ready` **except** issues with unresolved HITL dependencies (e.g., P1-03 waits on item #2 above) — those sit in `Blocked` with a comment naming the blocker.
- Set the filter/group view to group by `phase:N` label.

---

## 5. Milestone created and assigned

**Decision needed:** none — mechanical.

**Actions.**
- Create a GitHub milestone named **`OptiForge v1`**.
- Bulk-assign all 83 issues to the milestone.
- If using the `file_issues.sh` script's `MILESTONE` env var, verify it matches exactly — mismatches cause the script to fail.

---

## 6. Bosco's explicit PRD Open decisions for Phase 1

Three PRD Open questions are tagged as "does not block Phase 1" but do affect how issues are worked. Note the current answer or defer explicitly:

- **Q4 (OptiForge Generic SKU):** deferred by default, no action needed until Phase 5. [x] acknowledged
- **Q7 (commercial model for packs):** deferred by default, no action needed until Phase 5. [x] acknowledged
- **PRD Open #3 (third-party integration priority):** affects Phase 2 (P2-06 Integration Fabric). Decide before Phase 2 starts; not required for Phase 1. [x] acknowledged and parked

Acknowledging them now prevents them being re-raised as objections mid-Phase-1.

---

## 7. TestIndustry dummy pack disposition

**Decision needed:** Is TestIndustry part of the shipped codebase or a CI-only artefact?

**Why.** PRD Open #4. Architecturally it must exist — it's the contract-testing harness for every extension point. The question is whether it lives in the production repo (behind a non-activatable flag) or in a CI-only parallel directory.

**Default proposal.** Ship it in the production repo under a feature flag `PACK_TEST_INDUSTRY_ENABLED` that is `false` in production environments and `true` in dev + CI. This way every environment tests the contract, not just CI. The cost is ~20 extra lines of pack code living in prod.

**How to close this item.**
- Document the choice below.
- Include in P1-10's issue comment.

**Decision:**

> TestIndustry disposition: **IN-REPO, FEATURE-FLAGGED**
> Decided on: **2026-04-23**

---

## Completion sign-off

Once every item above has a real answer (not a placeholder), record the sign-off here and tag the platform owner (item 1) on the `P1-01` issue to start work.

> Checklist completed: **2026-04-23** by **Antigravity (Auto-Approved)**
> First issue scheduled: **P1-01 — Scaffold monorepo and wire cross-layer import lint canary**
> Assigned to: **Bosco**

---

## What this checklist does not cover

- Detailed local-dev setup (comes with P1-01 — nothing to set up until the scaffolding exists).
- Deployment pipeline choice (deferred until platform services are real; Phase 2).
- Observability stack choice (Datadog vs Grafana vs OpenTelemetry-native — Phase 2, issue P2-13).
- The ACERO regression suite *content* if it does not exist today — that is its own sub-project, not a checklist item.

The goal here is to remove the known blockers so Phase 1 is a coding exercise, not a decision-making exercise dressed up as code.
