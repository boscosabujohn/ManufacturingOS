# CI / workflows — trigger matrix and required checks

Two GitHub Actions workflows run against `main` and pull requests. This page documents which one fires when, what each job is for, and which ones should be branch-protection `required` checks.

## Workflows

| Workflow | File | Scope | Triggers |
|---|---|---|---|
| **OptiForge CI** | [`.github/workflows/optiforge-ci.yml`](../.github/workflows/optiforge-ci.yml) | Django backend at `/backend/` and top-level Next.js scaffold at `/frontend/` | push/PR to `main` |
| **CI Pipeline** | [`.github/workflows/ci.yml`](../.github/workflows/ci.yml) | NestJS backend and Next.js UI at `/b3-erp/` | push/PR to `main`, `develop`, `feature/*`, `claude/*` |

They are intentionally independent — neither backend blocks the other's CI when unrelated files change. This matches ADR-0004 §"Obligations accepted" which treats the two backends as parallel systems that must be kept in contract-level sync but not lifecycle-coupled.

## OptiForge CI — jobs

| Job | What it does | Should be `required`? |
|---|---|---|
| `optiforge-backend-lint` | Runs `lint-imports` (ADR-0001 layer-seam contract) | ✅ Yes — violating the layer seam breaks the core architectural promise. |
| `optiforge-backend-tests` | Runs the full `pytest tests/` suite (36+ tests across `canary/`, `contract/`, `performance/`, `dr_drill/`, `second_pack/`, `scaffolded_mode/`) with coverage | ✅ Yes — protects cross-tenant isolation, audit immutability, extension-point coverage, pack-write guard, and mode rejection. |
| `optiforge-frontend` | ESLint + typecheck for the top-level `/frontend/` scaffold | 🟡 Optional — the top-level frontend is a scaffold (see ADR-0004 Q5). Don't block merges on it. |

## CI Pipeline (b3-erp) — jobs

| Job | What it does | Should be `required`? |
|---|---|---|
| `backend-test` | Jest unit tests against a Postgres service container | ✅ Yes |
| `backend-build` | Compiles NestJS | ✅ Yes |
| `frontend-lint` | ESLint + typecheck | ✅ Yes |
| `frontend-test` | Jest unit tests | ✅ Yes |
| `frontend-build` | Builds `.next/` | ✅ Yes |
| `e2e-tests` | Playwright E2E (main/develop only) | 🟡 Optional — gate on nightly, not every PR |
| `security-audit` | `npm audit --audit-level=high` | ✅ Yes |
| `docker-build-scan` | Builds images + Trivy vuln scan | ✅ Yes |
| `ci-summary` | Aggregates results | Informational |

## Branch-protection recommendations

For the `main` branch, require these checks to pass:

```
optiforge-backend-lint
optiforge-backend-tests
backend-test
backend-build
frontend-lint
frontend-test
frontend-build
security-audit
docker-build-scan
```

If a PR only touches `/backend/` the `b3-erp` checks still run (workflow fires on any push to `main` per its current trigger config) and may be skipped by GitHub automatically if no relevant files change. To make this explicit, the workflows can be narrowed with `paths:` filters in a follow-up.

## Coverage

OptiForge backend coverage is uploaded as `optiforge-coverage.xml` (artifact, 14-day retention). No threshold gate yet — visibility first. When coverage stabilises above 80%, we add a threshold in the same workflow.

NestJS and Next.js coverage is already uploaded to Codecov via `codecov/codecov-action@v3` in `ci.yml`.

## When to edit a workflow

- Adding a new platform service in Django → nothing to do, pytest picks it up when the module has tests.
- Adding a new core module or pack → add a contract test under `backend/tests/contract/` and a canary under `backend/tests/canary/`.
- Adding a new long-running or browser-based test → put it under a separate `@pytest.mark.slow` or Playwright project and exclude from the gating workflow; wire to a nightly cron instead.

## Adding a new required check

1. Add the job to the workflow.
2. Push the workflow and run it once on `main` so GitHub sees the check name.
3. In the repo's branch-protection rules for `main`, toggle the new check to `required`.

## See also

- [ADR-0001](./adr/0001-five-layer-architecture.md) — why `lint-imports` is a first-class gate.
- [ADR-0004](./adr/0004-dual-backend-django-and-nestjs.md) — why two workflows, not one.
