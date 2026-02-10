---
description: How to migrate a module to Prisma with multi-tenancy and normalization
---

# Prisma Module Migration Workflow

This workflow defines the repeatable steps to migrate a module from mock data or TypeORM to Prisma within the OptiForge ecosystem.

## 1. Schema Definition
- Open `backend/prisma/schema.prisma`.
- Add the new model(s).
- **CRITICAL**: Ensure all tenant-specific models (e.g., Departments, Items) include a `companyId` field and a relation to the `Company` model.
- Use meaningful relations for normalization (e.g., `City` belongs to `State` belongs to `Country`).

## 2. Seed Data
- Extract mock data from `frontend/src/data/common-masters/`.
- Append to `backend/prisma/seed.ts`.
- Ensure IDs or unique keys are maintained to avoid duplication.

## 3. Backend Controller & Service
- Generate a new resource: `nest g resource modules/ModuleName`.
- Inject `PrismaService` into the service.
- Implement CRUD operations ensuring that every query includes `{ where: { companyId: tenantId } }`.

## 4. Frontend Wiring
- Update the corresponding service in `frontend/src/services/`.
- Set `USE_MOCK_DATA = false`.
- Update API URLs to match the new NestJS controllers.

## 5. Synchronization
- Run `npx prisma generate`.
- Run `npx prisma db push` (or migrations if in production).
- Run `npx prisma db seed`.
