# ManufacturingOS — Dual-Backend Architecture (live system diagram)

This document is the canonical picture of *how the running system fits together today*, as accepted (proposed) in [ADR-0004](./adr/0004-dual-backend-django-and-nestjs.md). It complements [`architecture.md`](./architecture.md), which describes the **OptiForge layered architecture** inside the Django backend.

## High-level diagram

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          Browser / Next.js client                          │
│                                                                            │
│  /b3-erp/frontend  (Next.js 14, shadcn, 1,719 pages)                       │
│                                                                            │
│   ┌──────────────────────────┐      ┌──────────────────────────────────┐   │
│   │  Platform API client     │      │  Domain API client               │   │
│   │  NEXT_PUBLIC_PLATFORM_   │      │  NEXT_PUBLIC_DOMAIN_API_URL      │   │
│   │  API_URL                 │      │                                  │   │
│   └────────┬─────────────────┘      └──────────────┬───────────────────┘   │
└────────────┼──────────────────────────────────────┼────────────────────────┘
             │                                      │
             │  HTTPS / JWT (Keycloak-issued)       │  HTTPS / JWT (same)
             │                                      │
             ▼                                      ▼
┌──────────────────────────────┐    ┌──────────────────────────────────────┐
│  OptiForge (Django + DRF)    │    │  b3-erp (NestJS + TypeORM)           │
│  /backend/                   │    │  /b3-erp/backend/                    │
│                              │    │                                      │
│  Platform services (13):     │    │  Domain modules (29):                │
│   · tenancy + RLS            │    │   · HR (statutory, training, loans,  │
│   · identity                 │    │      bonuses, skills)                │
│   · audit (immutable)        │    │   · CRM, Sales, CPQ, Procurement     │
│   · extensions (pack loader) │    │   · Inventory, Logistics, Finance    │
│   · events                   │    │   · Production, Project-mgmt, QMS    │
│   · workflow                 │    │   · Approvals, Workflow, Notifs      │
│   · notifications            │    │   · Common-masters, IT-admin         │
│   · reporting                │    │   · Reports, Support                 │
│   · documents                │    │                                      │
│   · integration              │    │                                      │
│   · api_gateway              │    │                                      │
│   · observability            │    │                                      │
│   · localisation             │    │                                      │
│                              │    │                                      │
│  Core modules (21) under the │    │                                      │
│  five-layer architecture of  │    │                                      │
│  ADR-0001.                   │    │                                      │
│                              │    │                                      │
│  Port: 8000                  │    │  Port: 3001                          │
│  Schema: optiforge.*         │    │  Schema: b3_erp.*                    │
└──────────────┬───────────────┘    └──────────────────┬───────────────────┘
               │                                       │
               │  psycopg2                             │  pg (node-postgres)
               │                                       │
               ▼                                       ▼
          ┌─────────────────────────────────────────────────┐
          │  PostgreSQL 15  (single cluster, two schemas)   │
          │  ┌─────────────────┐  ┌────────────────────┐    │
          │  │  optiforge.*    │  │  b3_erp.*          │    │
          │  │  (Django owns)  │  │  (NestJS owns)     │    │
          │  └─────────────────┘  └────────────────────┘    │
          │                                                 │
          │  Cross-schema reads: allowed via read-only      │
          │  views. Cross-schema writes: forbidden.         │
          └─────────────────────────────────────────────────┘

          ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐
          │  Redis          │   │  RabbitMQ       │   │  Keycloak       │
          │  (cache,        │   │  (Celery broker,│   │  (OIDC IdP,     │
          │   Celery res.)  │   │   event bus)    │   │   ADR-0003)     │
          └─────────────────┘   └─────────────────┘   └─────────────────┘
```

## Routing rules (frontend → backend)

The b3-erp frontend decides which backend to call per domain. The mapping is explicit:

| Domain path prefix | Target backend | Base URL env var |
|---|---|---|
| `/auth/*` (login, refresh, MFA) | Django platform | `NEXT_PUBLIC_PLATFORM_API_URL` |
| `/tenants/*`, `/users/*`, `/roles/*` | Django platform | `NEXT_PUBLIC_PLATFORM_API_URL` |
| `/audit/*`, `/workflows/*`, `/notifications/*` | Django platform | `NEXT_PUBLIC_PLATFORM_API_URL` |
| `/customer-requirements/*`, `/quotations/*` (OptiForge CPQ) | Django platform | `NEXT_PUBLIC_PLATFORM_API_URL` |
| `/hr/*`, `/crm/*`, `/sales/*`, `/inventory/*`, `/finance/*`, `/procurement/*`, `/production/*`, `/logistics/*`, `/projects/*`, `/quality/*`, `/approvals/*` | NestJS domain | `NEXT_PUBLIC_DOMAIN_API_URL` |
| `/common-masters/*` | NestJS domain | `NEXT_PUBLIC_DOMAIN_API_URL` |

**Rule:** `b3-erp/frontend/src/services/*.ts` uses exactly one of those two env vars. Any new service file using a different host gets caught in review.

## Auth flow

1. User logs in via Keycloak (federated via Django's `optiforge.platform.identity`).
2. Keycloak issues a JWT containing `sub`, `tenant_id`, `roles`, and standard OIDC claims.
3. Frontend stores the JWT (cookie, `HttpOnly`) and attaches it to both API clients.
4. Both backends validate the JWT against Keycloak's JWKS endpoint. Neither mints its own session token.
5. Tenant scoping:
   - Django enforces via RLS (`TenantMiddleware` sets `current_setting('app.tenant_id')`, Postgres policies filter).
   - NestJS enforces via `TenantGuard` on every controller, filtering by `tenantId` column on each TypeORM entity.

## Data contracts that must stay identical across both backends

These are the cross-cutting concerns that ADR-0004 §"Obligations accepted" pins to a single shared contract:

| Concern | Pattern | Django implementation | NestJS implementation |
|---|---|---|---|
| Audit columns | `created_at`, `updated_at`, `created_by`, `updated_by`, `deleted_at`, `deleted_by` | `optiforge.platform.tenancy.models.AuditedTenantModel` (see issue #113) | `b3-erp/backend/src/common/entities/base.entity.ts` (see issue #113) |
| Soft delete | `deleted_at IS NULL` default filter; `all_objects`/`withDeleted()` for explicit recovery | Custom manager on `AuditedTenantModel` | Subscriber + repo helper on `SoftDeletableAuditedEntity` |
| Pagination | Default 50, hard max 500. Cursor pagination for insert-heavy tables, page-number elsewhere | DRF `DEFAULT_PAGINATION_CLASS` + `PAGE_SIZE` | `@Query()` DTO + interceptor + response envelope (see issue #114) |
| Error envelope | `{ "error": { "code": str, "message": str, "details": object, "correlation_id": uuid } }` | `optiforge.platform.api_gateway` exception middleware | `b3-erp/backend/src/common/filters/global-exception.filter.ts` |
| JWT claims consumed | `sub`, `tenant_id`, `roles[]`, `email`, `exp`, `iat` | `optiforge.platform.identity` | `b3-erp/backend/src/modules/auth` |

If a new cross-cutting concern appears, it gets added here and implemented identically in both.

## What lives where (fast lookup table)

**Django owns:** Tenancy, Identity, Audit, Extensions, Events, Workflow, Notifications, Reporting, Documents, Integration, API Gateway, Observability, Localisation, OptiForge Core (CRM · Sales · Procurement · Inventory · WMS · Project · HR · PLM · IT-Admin · S&OP · CMMS · EHS · Production Planning · MES · Finance · QMS · Analytics · Field Service · Commissioning · Logistics · Support), OptiForge Modes (ETO, Discrete), OptiForge Packs (KitchenEquipment).

**NestJS owns:** HR (statutory/training/bonuses/loans/skills), CRM, Sales (MACBIS flow), CPQ, Procurement, Inventory, Logistics, Finance, Production, Project management, Quality, Approvals, Workflow (MACBIS-specific), Notifications (MACBIS-specific), Common-masters, Accounts, After-sales-service, CMS, Estimation, IT-admin, Proposals, Reports, Support.

**Overlap** (same domain in both): CRM, Sales, Procurement, Inventory, Finance, HR, Production, Logistics, Project. These are *known overlaps* — ADR-0004 §"Alternative D" flags them for a future ADR that picks one owner per domain.

## Links

- ADR-0001: [Five-layer architecture](./adr/0001-five-layer-architecture.md)
- ADR-0002: [Modular monolith deployment](./adr/0002-modular-monolith.md)
- ADR-0003: [Keycloak as OIDC Provider](./adr/0003-oidc-provider-keycloak.md)
- ADR-0004: [Dual-backend architecture — OptiForge (Django) + b3-erp (NestJS)](./adr/0004-dual-backend-django-and-nestjs.md) ← **this page's spec**
- [OptiForge layered architecture (Django-internal)](./architecture.md)
- [README](../README.md) — overview and getting-started
- [CLAUDE.md](../CLAUDE.md) — AI-assistant configuration
