---
description: Comprehensive workflow for integrating a full-stack feature (Prisma, NestJS, React)
---

# Full-Stack Feature Integration Workflow

Follow these steps to integrate a new feature from database to UI.

### 1. Database Layer (Prisma)
- Define new models in `prisma/schema.prisma`.
- Ensure multi-tenancy by adding `companyId String` and connecting to `Company` model.
- Run migrations: `npx prisma migrate dev --name <feature_name>`.
- Update `prisma/seed.ts` with mock data for the new models.
- Seed the database: `npx prisma db seed`.

### 2. Backend Layer (NestJS)
- Generate resource: `nest generate resource modules/<module_name>`.
- Update the Service:
  - Inject `PrismaService`.
  - Implement CRUD methods with `companyId` filtering.
- Update the Controller:
  - Add necessary endpoints (GET, POST, PATCH, DELETE).
  - Use `@Query('companyId')` where applicable.

### 3. Frontend Service Layer
- Update existing or create new frontend services in `src/services/`.
- Add TypeScript interfaces matching the backend models.
- Implement API call methods using `apiClient`.

### 4. Frontend UI Layer
- Create or update components in `src/components/`.
- Replace mock data states with API calls inside `useEffect`.
- Handle loading and error states.
- Ensure consistent styling using Tailwind CSS and Lucide icons.

### 5. Verification
- Verify data flows correctly from DB to UI.
- Run build check: `npm run build` (backend) or `next build` (frontend).
- Document changes in `walkthrough.md`.
