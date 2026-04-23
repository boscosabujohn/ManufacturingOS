# OptiForge / ManufacturingOS

**A layered multi-industry manufacturing ERP.** OptiForge is structured as five layers — Platform → Core → Modes → Compliance → Industry Packs — with a strict core/pack seam: every layer depends only on layers below it, and industry-specific logic lives exclusively in packs. B3 MACBIS kitchen equipment is the first customer and the KitchenEquipment pack is the only industry pack shipping in v1.

This repo holds the monorepo: Django + DRF + PostgreSQL 15 backend, Next.js 14 + TypeScript + shadcn frontend, Celery + RabbitMQ + Redis for background work.

---

## For a new developer: read these, in order

1. [`docs/README.md`](./docs/README.md) — index of all project documentation.
2. [`docs/brainstorms/2026-04-23-optiforge-layered-multi-industry.md`](./docs/brainstorms/2026-04-23-optiforge-layered-multi-industry.md) — why the architecture is layered, what was rejected, open questions resolved.
3. [`docs/prds/optiforge-layered-multi-industry-architecture.md`](./docs/prds/optiforge-layered-multi-industry-architecture.md) — the Product Requirements Document. The source of truth every issue references.
4. [`docs/plans/optiforge-layered-multi-industry-architecture.md`](./docs/plans/optiforge-layered-multi-industry-architecture.md) — the phased build plan. Phase 1 is the tracer bullet; start there.
5. [`docs/adr/README.md`](./docs/adr/README.md) — decisions log. Read before making an architectural choice; add an ADR before committing one.
6. [`docs/runbooks/phase-1-kickoff-checklist.md`](./docs/runbooks/phase-1-kickoff-checklist.md) — what must be decided and done before anyone picks up issue P1-01.

The GitHub issues (labelled `phase:1`..`phase:5`) are the unit of work. Issues reference the PRD and plan; the PRD and plan reference the brainstorm. Nothing references code paths or file locations because those go stale.

---

## The Five-Layer Architecture

OptiForge is structured as **five explicit layers**, each depending only on layers below it:

1. **Layer 1: Platform** — Identity, Tenancy, Audit, API Gateway, Extensions Framework.
2. **Layer 2: Core Modules** — 21 industry-agnostic modules across 12 domains.
3. **Layer 3: Mode Extensions** — Discrete, Process, Job-Shop, ETO, Repetitive modes.
4. **Layer 4: Compliance Packs** — 21 CFR Part 11, IATF 16949, AS9100.
5. **Layer 5: Industry Packs** — KitchenEquipment, Pharma, Automotive, etc.

### The Strict Seam Rule
The load-bearing architectural contract is: **add an extension point, don't patch core.**
A pack may *read* core entities, *extend* them via declared extension points, and *observe* core events — but it may not write directly to core tables, override core logic, or fork core code. If a pack needs something core doesn't expose, you must add an extension point to core.

Cross-layer import violations are strictly forbidden and enforced by CI linters.
- Core cannot import from Packs
- Packs cannot import from other Packs
- Platform cannot import from Core, Modes, Compliance, or Packs

---

## Getting started

```bash
# Clone
git clone https://github.com/boscosabujohn/ManufacturingOS.git
cd ManufacturingOS

# Backend
cd backend
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt  # Or install dependencies manually as required
python manage.py runserver

# Frontend
cd ../frontend
npm install
npm run dev
```

---

## Where to ask questions

- **Architectural question:** open a GitHub Discussion under the "Architecture" category, or an ADR draft in `docs/adr/`.
- **Bug in an existing module:** file a GitHub issue with the relevant `module:*` or `pack:*` label.
- **Scope dispute on an existing issue:** comment on the issue. If the dispute is about cutting scope from Phase 1, the default answer is "no, add it to Phase 2+."

---

## Status

| | |
|---|---|
| **Phase 1 (Tracer Bullet)** | Not started |
| **Phase 2 (Platform Depth)** | Not started |
| **Phase 3 (Demand + Design Half)** | Not started |
| **Phase 4 (Execution Half + Migration)** | Not started |
| **Phase 5 (Hardening + Go-Live)** | Not started |

First milestone: complete P1-01 (scaffolding + cross-layer lint canary).
