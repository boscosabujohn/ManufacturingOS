# OptiForge Documentation Index

Everything architecturally important about OptiForge lives here. Code comments, module docstrings, and test names cover the local stuff; this directory covers the cross-cutting stuff.

## Structure

```
docs/
├── README.md              ← you are here
├── brainstorms/           Early-stage thinking that led to decisions
├── prds/                  Product Requirements Documents (one per feature/epic)
├── plans/                 Phased implementation plans (one per PRD)
├── adr/                   Architecture Decision Records (one per decision)
└── runbooks/              Operational procedures and checklists
```

## How the documents relate

```
brainstorm     →    PRD     →     plan     →    GitHub issues    →    ADRs (as decisions land)
(exploration)      (spec)       (sequencing)     (unit of work)        (what we chose, why)
```

A new feature starts as a brainstorm, matures into a PRD, gets sequenced into a plan, broken into issues. Architectural decisions that emerge during execution are captured as ADRs.

## Current documents

### Brainstorms

- [**2026-04-23 OptiForge layered multi-industry**](./brainstorms/2026-04-23-optiforge-layered-multi-industry.md) — the dialogue that produced the layered architecture. Establishes why Alternative B was chosen over flat module expansion (A) and bounded contexts (C). Identifies P0–P3 gaps, defines the five layers, names the 10 extension points, lists 8 open questions.

### PRDs

- [**OptiForge layered multi-industry architecture**](./prds/optiforge-layered-multi-industry-architecture.md) — resolves 6 of the 8 brainstorm open questions as committed decisions; carries 2 forward as open. Defines: 21 core modules for v1, ETO+Discrete as the only supported mode combination, KitchenEquipment as the only industry pack in v1, zero compliance packs in v1 with Layer 4 scaffolded only. Primary success metric: zero unapproved cross-layer import violations per release.

### Plans

- [**OptiForge layered multi-industry architecture — implementation plan**](./plans/optiforge-layered-multi-industry-architecture.md) — 5 phases. Phase 1 is the tracer bullet (ships the seam-enforcement mechanism before any feature code). Phases 2–5 each remain shippable. Total 83 GitHub issues.

### ADRs

- [**ADR Index**](./adr/README.md) — start here. Explains the ADR format and lists every decision recorded so far.

### Runbooks

- [**Phase 1 kickoff checklist**](./runbooks/phase-1-kickoff-checklist.md) — must be completed before P1-01 is picked up.

_More runbooks (pack activation, tenant provisioning, incident response, restore from backup, migration reversal) arrive in Phase 5 per the PRD._

## Conventions

- **Filenames.** Kebab-case; for time-ordered docs (brainstorms, ADRs) prefix with ISO date `YYYY-MM-DD-`.
- **Markdown only.** No binary formats (no Word, no PDF as source-of-truth); binary artefacts sit in `/artefacts/` if they must exist at all.
- **No file paths or line numbers inside documents.** Refer to modules and responsibilities, not code locations. Code moves; docs that reference line 423 of `foo.py` go stale instantly.
- **No code snippets in PRDs/plans.** Illustrate interfaces in prose or minimal pseudo-signatures. Code is authoritative where it is; docs paraphrasing it only creates drift.
- **Every PRD must have a matching plan.** Every plan must trace back to a PRD. ADRs may stand alone but should reference the PRD section they decide.

## Who maintains what

- **PRDs and plans** are owned by the feature/epic owner (listed in the document header).
- **Brainstorms** are append-only history — never edit after the PRD is written; they're the archaeology.
- **ADRs** are owned by whoever proposed the decision; after acceptance they become immutable (supersede with a new ADR rather than editing).
- **Runbooks** are owned by the operations team.

## When a document is wrong

Open a PR updating it. Architecture-relevant changes (PRD scope shifts, ADR supersession) require review from the named platform owner (see [Phase 1 kickoff checklist](./runbooks/phase-1-kickoff-checklist.md#1-named-platform-owner)).
