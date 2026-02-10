---
description: Comprehensive workflow for integrating a full-stack feature (Prisma, NestJS, React)
---

# Full-Stack Feature Integration Workflow

This workflow provides a repeatable process for adding or migrating features in the B3 ERP system, ensuring multi-tenancy and high-density UI standards.

## 1. Database Schema (Prisma)
- Open `backend/prisma/schema.prisma`.
- Define the new models with appropriate scalar fields and relations.
- **CRITICAL**: Every tenant-specific model MUST include a `companyId` field for multi-tenancy.
```prisma
model NewFeature {
  id        String   @id @default(uuid())
  code      String   @unique
  name      String
  companyId String
  company   Company  @relation(fields: [companyId], references: [id])
  isActive  Boolean  @default(true)
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}
```

## 2. Database Sync & Seed
- Synchronize your schema with the database.
// turbo
- Run `npx prisma db push --schema=backend/prisma/schema.prisma`.
- Generate the Prisma Client.
// turbo
- Run `npx prisma generate --schema=backend/prisma/schema.prisma`.
- Add mock data to `backend/prisma/seed.ts`.
- Execute the seed script.
// turbo
- Run `npx prisma db seed`.

## 3. Backend Implementation (NestJS)
- Create a new module/resource if it doesn't exist.
// turbo
- Run `npx nest g resource modules/FeatureName`.
- Update the Service to use `PrismaService`.
- **IMPORTANT**: Ensure every query filters by `companyId` (extracted from the request context or query params).
- Update the Controller to expose necessary REST endpoints.

## 4. Frontend Service Layer
- Create or update the service in `frontend/src/services/`.
- Use `apiClient` or `coreService.request` to communicate with the backend.
- Ensure `USE_MOCK_DATA` is set to `false`.
- Include `companyId` in query parameters if required.

## 5. UI Component Wiring
- Update the React component to use the new service.
- Implement `useEffect` to fetch data on mount.
- Replace static mock data with state populated from the API.
- Ensure the UI adheres to the "High-Density UI" pattern for tables and forms.

## 6. Verification
- Run the build check to ensure type safety.
// turbo
- Run `npm run type-check` in the frontend.
- Verify the feature in the browser (Common Masters, etc.).
