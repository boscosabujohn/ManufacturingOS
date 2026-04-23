# ADR-0002: Modular monolith deployment (defer microservices)

*Status: Accepted*
*Date: 2026-04-23*
*Deciders: Bosco*
*Related: [ADR-0001](./0001-five-layer-architecture.md), [PRD](../prds/optiforge-layered-multi-industry-architecture.md), [Hybrid Architecture doc](../../B3_MACBIS_ERP_-_Hybrid_Architecture__Django___Next_js_.md)*

## Context

ADR-0001 commits to a five-layer architecture with strict seam. A distinct question is *how the code is deployed.* Two ends of a spectrum:

1. **Modular monolith** — all layers ship as one process (Django project) with enforced module boundaries inside. Single deploy, single database. Layer separation is compile-time and policy-enforced, not runtime-enforced.
2. **Microservices** — each platform service, core module, and pack runs as a separate process communicating over HTTP/gRPC/events. Runtime-enforced boundaries. Independent deploys.

Microservices *appear* to align better with a layered architecture because runtime boundaries mirror code boundaries. But they come with operational cost: per-service CI/CD, service discovery, distributed tracing, network-level retries, per-service observability, separate data stores with synchronisation. KreupAI Technologies is a small team with a single initial customer (B3 MACBIS). The first tenant deploys to a single Linux server per existing infrastructure plans.

The tempting middle ground — "start as a monolith, extract services later" — is a real option as long as the monolith is *actually modular* (which ADR-0001 enforces). Started as modular monolith, it remains refactorable into services. Started as a sloppy monolith, extracting services is a multi-year exercise.

## Decision

OptiForge ships as a **modular monolith** on the existing tech stack (Django + DRF + PostgreSQL 15 + Celery + RabbitMQ + Redis + Elasticsearch; Next.js 14 + TypeScript + shadcn) through **all five phases of v1.** Layer boundaries are enforced at code level (cross-layer import linter from P1-01) and policy level (ADR-0001), not at runtime.

Service extraction is an explicit future exercise, not a v1 goal.

## Alternatives considered

### Alternative A — Modular monolith (**CHOSEN**)

Single Django project, multiple apps aligned to layers and modules. One deploy, one database (multi-tenant via row-level security). Celery handles async work.

**Trade-off.** Fastest path to v1. Lowest operational cost. Layer separation depends on code discipline + linter. Not horizontally scalable beyond what one Postgres + one set of app servers can handle, but that is vastly above B3 MACBIS's load.

### Alternative B — Microservices from day one

Each platform service and core module as a separate deployable. gRPC or HTTP between.

**Trade-off.** Runtime enforcement of boundaries. Independent scaling. Each service evolves separately. But: 12 platform services + 21 core modules + 2 packs = 35+ deployables before v1 ships. Service discovery, distributed tracing, per-service CI/CD, inter-service auth, data consistency across stores — all required before any user-visible feature. **Rejected** — the operational cost is larger than the architectural gain for a single-tenant deployment serving one customer.

### Alternative C — Hybrid (monolith for core, separate services for platform)

Platform services (Identity, Events, Workflow, etc.) as independent deploys; core and packs in one monolith.

**Trade-off.** Partial runtime enforcement where it matters most (platform). But: creates a two-shape deployment model, doubles CI/CD complexity immediately, and the platform-service boundary is the one most likely to be stable anyway, which reduces the benefit. **Rejected** as premature optimisation.

## Consequences

### Easier

- Single CI/CD pipeline.
- Single deploy, one Linux VM per tenant (matches existing infrastructure plans).
- Transactional consistency across modules (one database).
- Cross-module debugging and tracing are trivial (one process, one log stream).
- Test setup is straightforward.

### Harder

- One memory-hungry module (MRP, MES analytics) pressures the whole process.
- Horizontal scaling requires replicating the entire app; you cannot scale only the MES layer.
- Team coordination on deploy: two modules shipping in the same release must both be ready at deploy time.
- A bad migration or bad code in one module can affect the whole deploy.

### Obligations accepted

- The cross-layer import linter is treated as a first-class correctness tool, not a lint-style nice-to-have. Violations block merges.
- Every module's public API is explicit — called through a service-like interface within the monolith — so extracting it to a separate service later is a refactor, not a rewrite.
- Database access is always via the tenant-scoped repository pattern, never via direct ORM. This preserves the option to later split a module's data into its own store.

### No-longer-possible (in v1)

- Independent per-module deploys.
- Per-module horizontal scaling.
- Running parts of the system on different language stacks.
- Zero-downtime "canary one module at a time" rollouts.

### When to revisit

- Load exceeds what a single-node Postgres + tuned Django process can handle.
- A specific module (e.g., MES telemetry ingestion) has a qualitatively different scaling profile.
- Team grows past ~15 engineers and module boundaries become merge-conflict zones.
- A customer deployment requires a module to be independently updatable on a different cadence.

When any of those triggers fire, revisit. Rewrite this ADR as superseded by a new one that describes the specific extraction and its scope.

## References

- PRD: [`docs/prds/optiforge-layered-multi-industry-architecture.md`](../prds/optiforge-layered-multi-industry-architecture.md) — "Architectural shape" decision and Out-of-Scope section.
- Existing hybrid-architecture doc in the repo root describes the tech stack.
- Brainstorm: [`docs/brainstorms/2026-04-23-optiforge-layered-multi-industry.md`](../brainstorms/2026-04-23-optiforge-layered-multi-industry.md) — "Section 14 — Out of scope" explicitly defers microservices.
