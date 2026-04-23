# Architecture Decision Records

An **ADR** is a short document capturing one architectural decision, the context that forced it, the alternatives considered, and the consequences accepted. ADRs are immutable once accepted; decisions are changed by *superseding* an ADR with a new one, not by editing the old one.

## Why we use ADRs

Three months from now, nobody will remember why the core/pack seam is strict, why compliance packs are Layer 4 instead of inside industry packs, or why a specific third-party integration was chosen. ADRs are the memory.

## Format

Each ADR lives in this directory as `NNNN-short-title.md`, numbered sequentially, with this structure:

```
# ADR-NNNN: Short title

*Status: Proposed | Accepted | Superseded by ADR-XXXX | Deprecated*
*Date: YYYY-MM-DD*
*Deciders: <names>*

## Context
What pressure forced this decision? What constraints are in play? What would
happen if we didn't decide?

## Decision
The choice we are making, stated unambiguously.

## Alternatives considered
Each alternative with a one-paragraph trade-off summary.

## Consequences
What becomes easier, what becomes harder, what obligations we now carry,
what we can no longer do.

## References
Links to PRDs, brainstorms, issues, external sources.
```

## Current ADRs

| # | Title | Status | Date |
|---|---|---|---|
| 0001 | [Five-layer architecture (Platform → Core → Modes → Compliance → Industry)](./0001-five-layer-architecture.md) | Accepted | 2026-04-23 |
| 0002 | [Modular monolith deployment (defer microservices)](./0002-modular-monolith.md) | Accepted | 2026-04-23 |

_Add new ADRs at the bottom. Do not renumber existing ones._

## When to write an ADR

Write one when you are about to make a decision that:

- Affects code you don't own (public APIs, shared schemas, platform services).
- Is hard to reverse (schema changes, framework choices, auth model).
- Will surprise a reader six months from now if it's not written down.
- Was contested — you considered a real alternative before choosing.

Do **not** write one for:

- Local refactors that don't cross module boundaries.
- Choosing between two equivalent utility libraries where the choice is trivially reversible.
- Style/formatting decisions (those belong in a style guide, not an ADR).

## Procedure

1. Copy the format above into `NNNN-short-title.md` (use the next free number).
2. Set status to `Proposed`.
3. Open a PR. ADRs get the same review scrutiny as code.
4. On merge, change status to `Accepted` and add the row to the table above.
5. To change a previously-accepted decision: write a new ADR, reference the old one, and change the old one's status to `Superseded by ADR-XXXX` in a separate PR.
