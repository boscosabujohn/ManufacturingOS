# Comprehensive Gap Analysis - ManufacturingOS (OptiForge ERP)

**Date:** March 5, 2026
**Scope:** Full-stack assessment across Architecture, Backend, Frontend, Testing, Security, DevOps, and Documentation
**Codebase Size:** 1,182 backend TS files | 2,582 frontend TS/TSX files | 1,719 pages | 641 components

---

## Executive Summary

ManufacturingOS is an ambitious, feature-rich ERP system with **27 backend modules** and **40+ frontend route modules** covering the full manufacturing lifecycle. The project has a solid architectural foundation with NestJS + TypeORM on the backend and Next.js 14 + TailwindCSS + Radix UI on the frontend. However, the assessment reveals **critical gaps** in testing, security enforcement, frontend-backend integration, and production readiness that must be addressed before deployment.

### Overall Health Score: **62/100**

| Dimension | Score | Rating |
|-----------|-------|--------|
| Architecture & Design | 85/100 | Strong |
| Backend Implementation | 78/100 | Good |
| Frontend Implementation | 72/100 | Good |
| Frontend-Backend Integration | 25/100 | Critical Gap |
| Testing & QA | 8/100 | Critical Gap |
| Security | 55/100 | Needs Work |
| DevOps & Deployment | 45/100 | Needs Work |
| Documentation | 60/100 | Moderate |

---

## 1. ARCHITECTURE GAPS

### 1.1 Dual ORM Inconsistency (HIGH)
- **Problem:** Both TypeORM and Prisma are used simultaneously across the codebase
  - TypeORM: Used in accounts, approvals, workflow, core, proposals, CMS, after-sales modules (via `@InjectRepository`)
  - Prisma: Used in support, common-masters, logistics, HR, IT-admin, CRM modules (via `PrismaService`)
- **Risk:** Inconsistent query patterns, double migration management, increased cognitive load, potential transaction boundary issues
- **Recommendation:** Consolidate to a single ORM. Given Prisma's 444KB schema file and growing adoption in the codebase, migrate remaining TypeORM modules to Prisma

### 1.2 Missing Modules in App Registration (MEDIUM)
- **Problem:** `notifications` and `project` (legacy) modules exist in the filesystem but are NOT registered in `app.module.ts`
- **Impact:** Notification entities/services exist but are unreachable; legacy project module is orphaned
- **Recommendation:** Register NotificationsModule or merge its functionality into WorkflowModule; remove or archive the legacy project module

### 1.3 Synchronize: true in Non-URL Database Config (HIGH)
- **Problem:** `b3-erp/backend/src/app.module.ts:63` has `synchronize: true` hardcoded for non-URL database connections
- **Risk:** In production, TypeORM will auto-alter database tables, potentially causing data loss
- **Recommendation:** Change to `synchronize: configService.get('DB_SYNCHRONIZE') === 'true'` (already done for URL-based config at line 50)

### 1.4 No Health Check Endpoint (MEDIUM)
- **Problem:** No dedicated `/health` endpoint exists, yet the CI pipeline expects one (`wait-on http://localhost:3001/health`)
- **Recommendation:** Add `@nestjs/terminus` health check module with database, Redis, and disk checks

### 1.5 Missing Global Error Filter (MEDIUM)
- **Problem:** No custom global exception filter exists. The app relies entirely on NestJS default error responses
- **Recommendation:** Implement a global `HttpExceptionFilter` for consistent error formatting, logging, and correlation IDs

### 1.6 Missing Middleware and Interceptors (MEDIUM)
- **Problem:** No request logging interceptor, no response transformation interceptor, no correlation ID middleware
- **Risk:** No observability into request/response lifecycle; difficult debugging in production
- **Recommendation:** Add a `LoggingInterceptor`, `ResponseTransformInterceptor`, and `CorrelationIdMiddleware`

---

## 2. BACKEND GAPS

### 2.1 Module Inventory & Completeness

| Module | Entities | Controllers | Services | DTOs | Status |
|--------|----------|-------------|----------|------|--------|
| **Accounts** | 4 | 4 | 4 | 0 | Good - Missing DTOs |
| **After-Sales Service** | 13 | 7 | 10 | 13 | Complete |
| **Approvals** | 7 | 2 | 6 | 2 | Gaps in API coverage |
| **Auth** | 0 | 1 | 1 | 0 | Minimal |
| **CMS** | 2 | 1 | 1 | 2 | Incomplete |
| **Common Masters** | 0 | 1 | 1 | 0 | DTO missing |
| **Core** | 6 | 6 | 12 | 15 | Complete |
| **CPQ** | 7 | 7 | 7 | 0 | No DTOs |
| **CRM** | 5 | 4 | 6 | 4 | Good |
| **Estimation** | 6 | 6 | 6 | 2 | Limited DTOs |
| **Finance** | 13 | 6 | 14 | 30 | Very Complete |
| **HR** | 18 | 21 | 44 | 57 | Excellent |
| **Inventory** | 10 | 9 | 18 | 24 | Very Complete |
| **IT-Admin** | 12 | 10 | 18 | 16 | Complete |
| **Logistics** | 10 | 10 | 17 | 27 | Complete |
| **Notifications** | 1 | **0** | 2 | 0 | **NO CONTROLLER** |
| **Prisma** | 0 | 0 | 1 | 0 | DB service only |
| **Procurement** | 14 | 12 | 17 | 12 | Complete |
| **Production** | 58 | 56 | 63 | 24 | Excellent |
| **Project-Management** | 25 | 20 | 23 | 7 | Limited DTOs |
| **Project** (legacy) | 7 | 1 | 1 | 0 | Severely under-implemented |
| **Proposals** | 2 | 1 | 1 | 2 | Minimal |
| **Quality** | 13 | 12 | 16 | 36 | Complete |
| **Reports** | 0 | **0** | 1 | 0 | **NO CONTROLLER, NO ENTITIES** |
| **Sales** | 4 | 4 | 10 | 3 | Limited API coverage |
| **Support** | 0 | **0** | 11 | 0 | **NO CONTROLLER, NO ENTITIES** |
| **Workflow** | 18 | 12 | 21 | 1 | Minimal DTOs |

**Totals:** 255 entities | 213 controllers | 332 services | 336 DTOs

### 2.2 Modules Without Controllers - Hidden Functionality

#### Notifications Module (`b3-erp/backend/src/modules/notifications/`)
| Service | File | Functionality |
|---------|------|---------------|
| NotificationService | `notification.service.ts` | Full lifecycle: create, mark-read, delete, bulk-mark, auto-cleanup (30-day TTL), priority routing (info/warning/urgent), approval-specific helpers |
| EmailService | `email.service.ts` | SMTP-based, HTML templates, daily digests, approval notifications |

**TODOs:**
- Line 27: `// TODO: Fetch user email from user service` - Email address lookup not connected
- Line 170: `// TODO: Integrate with user service` - Same issue

#### Reports Module (`b3-erp/backend/src/modules/reports/`)
| Service | File | Functionality |
|---------|------|---------------|
| ReportsManagementService | `reports-management.service.ts` | Report templates, saved reports, scheduling (daily/weekly/monthly), execution tracking, analytics dashboards, KPI management, module snapshots (Finance, Sales, Inventory, HR, Production, Quality), favorites |

**Gaps:** No entities in DB (in-memory only), `calculateNextRunTime()` doesn't handle cron expressions, no pagination on some queries

#### Support Module (`b3-erp/backend/src/modules/support/`)
| Service | File | Functionality |
|---------|------|---------------|
| TicketManagementService | `ticket-management.service.ts` | Ticket CRUD with typed interfaces |
| SupportManagementService | `support-management.service.ts` | Prisma-based ticket management |
| KnowledgeBaseService | `knowledge-base.service.ts` | Hierarchical categories, articles |
| SLATrackingService | `sla-tracking.service.ts` | First-response and resolution SLA monitoring |
| ITILService | `itil.service.ts` | ITIL-compliant ticket management |
| AIResponsesService | `ai-responses.service.ts` | AI-powered ticket response suggestions |
| ChannelRoutingService | `channel-routing.service.ts` | Multi-channel (email, phone, chat, web, social) |
| CSATService | `csat.service.ts` | Customer satisfaction scoring |
| BacklogService | `backlog.service.ts` | Ticket backlog management |
| SupportSettingsService | `support-settings.service.ts` | Module configuration |
| SupportSeederService | `support-seeder.service.ts` | Data initialization |

**Gaps:** No REST controllers, no entities in Prisma schema, no ticket audit trail

### 2.3 Stubbed Workflow & Notification Processors

#### Workflow Processor (`b3-erp/backend/src/modules/workflow/processors/workflow.processor.ts`)

| Queue Job | Status | Details |
|-----------|--------|---------|
| `create-order-from-rfp` | Stub | Line 20: `// TODO: Implement actual order creation from RFP` - Currently just logs |
| `create-work-orders-from-order` | Commented out | Logic isolated for module decoupling |
| `check-material-availability` | Commented out | No inventory integration |
| `reserve-materials` | Commented out | No stock reservation |
| `issue-materials` | Commented out | No material issue |
| `handle-material-shortage` | Commented out | No shortage handling |
| `schedule-production` | Commented out | No production scheduling |
| `start-production` | Commented out | No production start |
| `complete-production` | Commented out | No production completion |
| `quality-inspection` | Commented out | No QC integration |
| `handle-inspection-failure` | Commented out | No failure handling |
| `generate-ncr` | Commented out | No NCR generation |

**Assessment:** 12 of 12 workflow jobs are stubs (0% functional)

#### Notification Processor (`b3-erp/backend/src/modules/workflow/processors/notification.processor.ts`)

| Queue Job | Status | Line | Details |
|-----------|--------|------|---------|
| `send-team-notification` | Stub | 15 | `// TODO: Implement actual notification sending` |
| `send-user-notification` | Stub | 38 | `// TODO: Implement actual notification sending` |
| `create-in-app-notification` | Stub | 53 | `// TODO: Implement in-app notification storage` |
| `send-email` | Stub | 72 | `// TODO: Implement email sending` (needs nodemailer) |
| `send-sms` | Stub | 88 | `// TODO: Implement SMS sending` (needs Twilio/similar) |
| `send-push` | Stub | 104 | `// TODO: Implement push notification sending` |

### 2.4 Approval System TODOs

**File:** `b3-erp/backend/src/modules/approvals/services/approval-workflow.service.ts`

| Line | TODO | Impact |
|------|------|--------|
| 204 | Notify requester of rejection | User never knows their request was rejected |
| 205 | Update entity status (e.g., PO status = "rejected") | Rejected entities remain in pending state |
| 221 | Implement user role checking to filter approvals | Anyone can see any approval |
| 279 | Send notifications to next level approvers | Multi-level approval chain broken |
| 299 | Update entity status (e.g., PO status = "approved") | Approved entities not reflected |
| 300 | Notify requester of approval | User never knows approval succeeded |
| 317 | Implement role-based user lookup | Cannot route approvals to correct users |

**File:** `b3-erp/backend/src/modules/approvals/services/sla-monitoring.service.ts`
| Line | TODO | Impact |
|------|------|--------|
| 86 | Send summary email to managers | No SLA violation alerts |
| 144 | Implement auto-escalation logic | Overdue approvals never escalate |

**File:** `b3-erp/backend/src/modules/approvals/services/escalation.service.ts`
| Line | TODO | Impact |
|------|------|--------|
| 86 | Get actual approver name | Shows `Previous Approver` placeholder |

### 2.5 Seeder Coverage Gap
- **Present Seeders:** Core (Customer, Vendor, Item), HR masters, IT-admin roles/permissions (100+ permissions), Finance (tax config), Sales (payment terms), CRM data, After-sales types, Production (partial), Logistics, Quality, Support
- **Missing Seeders:** Inventory warehouses/bins, Production work centers/routings (full), Common masters (UOM, currencies, countries), Workflow templates, Report templates

### 2.6 Missing Rate Limiting Application (HIGH)
- **Problem:** Rate limiting is fully configured in `common/security/rate-limit.config.ts` with custom `CustomThrottlerGuard`:
  - Short: 10 requests/second
  - Medium: 50 requests/10 seconds
  - Long: 100 requests/minute
  - Login: 5 attempts/minute
  - Register: 10/hour
  - Password reset: 3/hour
- **But:** `ThrottlerModule` is **NOT registered** in `app.module.ts` and `CustomThrottlerGuard` is **NOT applied** globally
- **Impact:** All API endpoints are completely unprotected against brute-force and DoS attacks

### 2.7 Transaction Handling (MEDIUM)
- TypeORM modules use `QueryRunner` transactions in some services (Finance journal entries, Inventory stock)
- Prisma modules rely on `prisma.$transaction()` in some places
- **Gap:** Not all multi-step operations are wrapped in transactions (e.g., some approval state transitions, some stock adjustments)

---

## 3. FRONTEND GAPS

### 3.1 Frontend-Backend API Integration (CRITICAL)

**Architecture:**
- Two API clients exist: `services/api/client.ts` (fetch-based) and `lib/api-client.ts` (Axios with interceptors)
- 120 service files in `src/services/` totaling ~70,000 lines of code
- React Query (`@tanstack/react-query`) is in `package.json` but NOT used anywhere
- Services fall back to mock data on API failure (silent degradation)

**TODO Distribution by Module (242 actionable TODOs):**

| Module | TODO Count | Key Missing Integrations |
|--------|-----------|--------------------------|
| **Procurement** | 27 | Contract CRUD, GRN creation, RFQ management, vendor portal |
| **Production - Downtime** | 23 | RCA analysis, event updates, resolution, export |
| **Inventory** | 15 | Movement fetch, stock updates, transfers, cycle counts |
| **Production - BOM** | 14 | Version create/update/copy, component search, auto-increment |
| **Shop Floor** | 5 | Action handlers, export functionality |
| **HR - Timesheets** | 3 | Bulk punch integration |
| **Quality** | 2 | Inspection data, NCR creation |
| **Workflow** | 2 | Approval API calls, auth context |
| **Other** | 151 | Scattered across settings, modals, reports |

**Mock Data Pervasiveness:**
- 32 mock data files in `src/data/common-masters/` (users, banks, cities, currencies, etc.)
- HR mock data in `src/data/hr/` (leave balances, onboarding)
- RFP mock data in `src/data/mock-rfps.ts`
- 691 files contain mock/hardcoded data
- Inventory dashboard (`src/app/(dashboard)/inventory/page.tsx`) uses `mockStockItems`, `mockWarehouses`, `mockRecentMovements`
- Production dashboard (`src/app/(dashboard)/production/page.tsx`) is connected to real services (positive exception)

### 3.2 No Frontend Route Protection (CRITICAL)
- **Problem:** No Next.js `middleware.ts` file exists at the application root
- **Current State:** `UserPreferenceContext` handles client-side preferences but there is no `AuthContext` or auth provider
- **Risk:** Unauthenticated users can access any page URL directly; no token validation, no role-based page access
- **Recommendation:** Add Next.js `middleware.ts` with JWT token validation and role-based route guards

### 3.3 State Management Inconsistency (MEDIUM)
- **Zustand v4.4.7** installed, `@/stores/*` path alias configured in tsconfig, but ZERO store files exist
- **React Query (`@tanstack/react-query`)** installed but NOT used in any component
- **Current State:** All state is managed via React Context API (7 contexts found):
  1. `UserPreferenceContext` - density, theme, sidebar (localStorage persistence)
  2. `ToastContext` - notifications
  3. `EnhancedToastContext` - advanced notifications (duplicate concern)
  4. `MultiStepFormContext` - multi-step form wizard
  5. `LanguageContext` - i18n language selection
  6. `TranslationContext` - translation system
  7. `LocaleContext` - locale formatting
- **Missing Contexts:** No AuthContext, no global app state, no notification context beyond toast

### 3.4 Custom Hooks Gap (MEDIUM)
**Present:**
- `useOfflineStorage` - Full IndexedDB-based offline support with caching, pending actions, form drafts
- `usePageVisitLogger` - Analytics/tracking
- `use-toast` - Toast notification management

**Missing:**
- `useAuth` - Authentication state and methods
- `usePagination` - Paginated list management
- `useFilters` - Filter state management
- `useDebounce` - Debounced search inputs
- `useLocalStorage` - Simple localStorage wrapper
- `useQuery`/`useMutation` wrappers around API services

### 3.5 NextAuth Installed but Unused (MEDIUM)
- NextAuth v4.24.13 installed with env configuration but the app uses custom localStorage token management
- **Risk:** Custom auth may miss CSRF protection, session rotation, token refresh patterns

### 3.6 Build Configuration Issues (MEDIUM)
- `next.config.js` has `eslint.ignoreDuringBuilds: true` and `typescript.ignoreBuildErrors: true`
- Build passes even with type errors and lint violations
- Custom build ID generation added to work around Next.js 14.1.0 bug

### 3.7 Code Organization Issues (LOW)
- Deprecated finance module at `src/app/_finance_deprecated/` still present
- Duplicate shop floor directories: `src/components/shop-floor/` and `src/components/shopfloor/`
- Two toast systems: `ToastContext` and `EnhancedToastContext`

---

## 4. TESTING GAPS (CRITICAL)

### 4.1 Backend Test Coverage: Near Zero

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Unit test files | 2 | 100+ | 98% |
| Services tested | 2/332 | All critical (~50) | 96% |
| Controllers tested | 0/213 | All (~30 critical) | 100% |
| E2E test files | 0 | 10+ | 100% |
| Coverage achieved | <1% | 80%+ | ~80% |

**Tested Services (good quality):**
- `UserService` (`it-admin/spec/user.service.spec.ts` - 346 lines)
- `ItemService` (`core/spec/item.service.spec.ts` - 394 lines)

**Critical Untested Services by Priority:**

| Priority | Module | Service | Risk if Untested |
|----------|--------|---------|------------------|
| P0 | Auth | AuthService | Authentication bypass |
| P0 | Finance | JournalEntryService | Financial data corruption |
| P0 | Finance | InvoiceService | Incorrect billing |
| P0 | Finance | PaymentService | Payment processing errors |
| P0 | Inventory | StockManagementService | Stock discrepancies |
| P0 | Production | BOMService | Incorrect material planning |
| P0 | Production | WorkOrderService | Production schedule errors |
| P1 | Approvals | ApprovalWorkflowService | Approval chain failures |
| P1 | Sales | QuotationService | Pricing errors |
| P1 | Sales | RFPService | Lost sales opportunities |
| P1 | Procurement | PurchaseOrderService | Supply chain disruption |
| P1 | Quality | InspectionService | Quality defects missed |
| P2 | HR | PayrollService | Employee payment errors |
| P2 | Workflow | WorkflowService | Process automation failures |
| P2 | CRM | LeadsService | Lead management issues |

### 4.2 Frontend Test Coverage: Minimal

| Metric | Current | Target | Gap |
|--------|---------|--------|-----|
| Component unit tests | 0 | 50+ | 100% |
| Hook tests | 0 | 10+ | 100% |
| E2E test files | 3 | 20+ | 85% |
| Visual regression tests | 0 | Key components | 100% |

**Existing E2E Tests:**
- `e2e/auth.spec.ts` - Login/logout flow
- `e2e/inventory.spec.ts` - Inventory operations
- `e2e/production.spec.ts` - Production operations

**Missing E2E Coverage:**
- Sales order workflow (RFP -> Quote -> Order -> Invoice)
- Procurement cycle (PR -> RFQ -> PO -> GRN)
- Finance operations (Journal entries, payments, reconciliation)
- HR/Payroll (Leave application, payroll run)
- Quality inspections (Incoming, in-process, final)
- Approval workflows (multi-level approval chain)
- Project management lifecycle

### 4.3 Test Infrastructure Assessment

**Present (Good):**
- Jest configured with `passWithNoTests: true`, 50% coverage thresholds
- Playwright configured for Chromium, Firefox, Safari, Pixel 5, iPhone 12
- CI runs tests with coverage reporting to Codecov
- Playwright supports retry (2 on CI), screenshots/videos on failure

**Missing:**
- Test factories/fixtures for entities (only manual object creation)
- Mock service generators (each test manually mocks)
- Integration test database setup (no test DB auto-creation)
- CI test parallelization
- Test data management strategy
- Contract testing between frontend and backend
- Performance/load testing framework

---

## 5. SECURITY GAPS

### 5.1 Security Headers NOT Applied (CRITICAL)

**Defined at:** `b3-erp/backend/src/common/security/security.config.ts` (lines 8-56)
```typescript
export function configureSecurityHeaders(app: INestApplication) {
  app.use(helmet({
    contentSecurityPolicy: { /* strict CSP directives */ },
    hsts: { maxAge: 31536000, includeSubDomains: true, preload: true },
    frameguard: { action: 'deny' },
    xssFilter: true,
    noSniff: true,
    // ...
  }));
}
```

**Not called at:** `b3-erp/backend/src/main.ts` - Function is imported nowhere
- No CSP headers -> XSS risk
- No HSTS -> Downgrade attack risk
- No X-Frame-Options -> Clickjacking risk
- No X-Content-Type-Options -> MIME sniffing risk

**Fix:** Add `configureSecurityHeaders(app)` after `app.enableCors()` in `main.ts:19`

### 5.2 CORS Misconfiguration (MEDIUM)

**Current (`main.ts:16-19`):**
```typescript
app.enableCors({
  origin: configService.get('FRONTEND_URL') || 'http://localhost:3000',
  credentials: true,
});
```

**Better function exists but unused (`security.config.ts:73-91`):**
```typescript
export function getCorsConfig(): CorsOptions {
  // Supports multiple origins, environment-based configuration,
  // method restrictions, header whitelisting, max-age caching
}
```

**Issues:**
- No method restrictions (all HTTP methods allowed from cross-origin)
- No header whitelisting
- `credentials: true` without proper origin validation
- CSRF token header listed in unused config but no CSRF middleware exists

### 5.3 XSS Vulnerabilities in Frontend (HIGH)

| File | Line | Context | Risk |
|------|------|---------|------|
| `components/modals/CommentModal.tsx` | 244 | `dangerouslySetInnerHTML={{ __html: renderPreview() }}` - User mentions converted to HTML without sanitization | User input directly rendered as HTML |
| `components/advanced-features/ChatbotAssistant.tsx` | 552 | `dangerouslySetInnerHTML={{ __html: message.content.replace(...) }}` - Chat message content rendered as HTML | Chat injection |
| `components/print/PrintStylesheet.tsx` | - | Print template rendering | Lower risk (print context) |
| `components/procurement/PrintLayouts.tsx` | - | Procurement print layouts | Lower risk (print context) |

**Root Cause:** No HTML sanitization library (DOMPurify, sanitize-html) in dependencies

### 5.4 Weak JWT Configuration (HIGH)

**File:** `b3-erp/backend/src/modules/auth/auth.module.ts:18`
```typescript
secret: configService.get<string>('JWT_SECRET', 'secretKey'),
```

**Same default in:** `auth/strategies/jwt.strategy.ts:12`
```typescript
secretOrKey: configService.get<string>('JWT_SECRET', 'secretKey'),
```

**Issues:**
- Default secret `'secretKey'` is trivially guessable
- No validation that JWT_SECRET is set in production
- Token expiry defaults to `'1d'` (acceptable)
- No refresh token mechanism

**Positive:** `ignoreExpiration: false` correctly enforces token expiry

### 5.5 Password Security (GOOD - with notes)

**File:** `b3-erp/backend/src/modules/it-admin/services/user.service.ts`
- Bcrypt with 10 salt rounds (line 46) - Acceptable
- Password history tracking (lines 268-272) - Good
- Password reuse prevention (lines 246-256) - Good
- Password change timestamp tracking (line 263) - Good
- **Gap:** No password complexity validation at the service level (relies on DTO validation)

### 5.6 Authorization Implementation (GOOD - with gaps)

**File:** `b3-erp/backend/src/common/guards/permissions.guard.ts`
- Decorator-based permission checks via `@Permissions()` decorator
- Fetches user with roles and permissions from DB
- Super admin bypass via wildcard `*` permission
- `isSystemAdmin` flag check

**Gaps:**
- Not all controllers apply `@UseGuards(PermissionsGuard)` - some endpoints are unprotected
- No row-level security (e.g., user A can see user B's data)
- No API key authentication for service-to-service calls

### 5.7 SQL Injection (GOOD)
- TypeORM `createQueryBuilder` uses parameterized queries (`:paramName` pattern)
- Prisma uses parameterized queries by default
- No raw SQL queries found in audited services

### 5.8 CSRF Protection (MISSING)
- `X-CSRF-Token` header listed in CORS config but no middleware generates or validates CSRF tokens
- Frontend uses Bearer tokens in Authorization header (partially mitigates CSRF for API calls)
- **Risk:** Cookie-based session operations (if any) are vulnerable

---

## 6. DEVOPS & DEPLOYMENT GAPS

### 6.1 Docker Configuration Assessment

**Backend Dockerfile** (`b3-erp/docker/backend/Dockerfile`):
```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install          # Should be npm ci
COPY . .
EXPOSE 8000
CMD ["npm", "run", "start:dev"]  # Development mode!
```

| Issue | Severity | Fix |
|-------|----------|-----|
| Runs `start:dev` (hot-reload) | Critical | Change to `start:prod` with prior `npm run build` |
| No multi-stage build | High | Add builder stage, copy only `dist/` to runtime |
| Runs as root | High | Add `USER node` |
| No `.dockerignore` | Medium | Add to exclude node_modules, .git, tests |
| No health check | Medium | Add `HEALTHCHECK CMD curl -f http://localhost:8000/health` |
| `npm install` instead of `npm ci` | Medium | Use `npm ci` for reproducible builds |

**Frontend Dockerfile** (`b3-erp/docker/frontend/Dockerfile`):
- Same issues as backend
- Runs `npm run dev` instead of building and serving production Next.js

**Docker Compose** (`b3-erp/docker-compose.yml`):
| Issue | Fix |
|-------|-----|
| Weak DB password (`b3_password`) | Use secrets or strong generated password |
| No resource limits | Add `deploy.resources.limits` |
| No restart policies | Add `restart: unless-stopped` |
| No health checks | Add `healthcheck` for each service |
| No production compose file | Create `docker-compose.prod.yml` |
| Nginx config present but not in compose | Add nginx service for production |

### 6.2 CI/CD Pipeline Assessment

**Present (`/.github/workflows/ci.yml`):**
- Backend: lint -> test (with coverage) -> build
- Frontend: lint + type-check -> build
- E2E: Playwright (main/develop only)
- Security audit (npm audit, non-blocking)
- Artifact upload (7-day retention)

| Gap | Severity | Recommendation |
|-----|----------|----------------|
| Security audit uses `\|\| true` | High | Remove `\|\| true`; allow high-severity to fail build |
| E2E only on main/develop | Medium | Run on all PRs (at least smoke tests) |
| No SAST scanning | High | Add CodeQL or Semgrep |
| No container image scanning | Medium | Add Trivy or Snyk container scanning |
| No deployment stage (CD missing) | High | Add deploy jobs for staging/production |
| No staging environment | High | Add staging pipeline with approval gate |
| No database migration step | Medium | Add migration job before deployment |
| `passWithNoTests: true` in Jest | Medium | Remove once tests exist |

### 6.3 Environment Configuration

**Backend `.env.example`:**
- DB connection settings, SSL toggle, logging
- Includes DigitalOcean PostgreSQL example
- **Missing:** JWT_SECRET, REDIS_URL, SMTP settings, API keys, Bull queue config

**Frontend `.env.example`:**
- API URL, mock data flag, analytics flag, notifications flag
- **Missing:** NextAuth settings, Sentry DSN, feature flags

### 6.4 Development Tooling

**Makefile** (`b3-erp/Makefile`) - Good:
- `make setup` - Install deps and copy .env files
- `make dev` - Start Docker db/redis then npm servers
- `make build` - Build both services
- `make test` - Run tests for both
- `make docker-up/down/logs/restart`

**Missing:**
- Pre-commit hooks (no `.husky/` or `.githooks/` directory)
- Commit message linting (no commitlint)
- Branch naming conventions enforcement
- Auto-formatting on commit

### 6.5 Missing Production Infrastructure

| Category | Status | What's Needed |
|----------|--------|---------------|
| Container Orchestration | Missing | Kubernetes manifests or Docker Swarm config |
| Infrastructure as Code | Missing | Terraform for cloud resources (VPC, RDS, EKS, S3) |
| Monitoring | Missing | Prometheus + Grafana or Datadog |
| Centralized Logging | Missing | ELK Stack or CloudWatch Logs |
| APM | Missing | New Relic, Datadog APM, or OpenTelemetry |
| CDN | Missing | CloudFront or similar for static assets |
| Backup/Restore | Missing | Automated DB backup scripts, point-in-time recovery |
| Secrets Management | Missing | AWS Secrets Manager, HashiCorp Vault |
| SSL/TLS | Partial | Nginx config exists but no cert management |
| Alerting | Missing | PagerDuty, OpsGenie, or Slack alerts |

---

## 7. DOCUMENTATION GAPS

### 7.1 Present Documentation
| Document | Location | Quality |
|----------|----------|---------|
| Business Process Flows | `docs/B3_Business_Process_Flows.md` | Comprehensive |
| Manufacturing Workflow | `docs/B3_Manufacturing_Workflow_Process.md` | Comprehensive |
| Code Review Guidelines | `docs/CODE_REVIEW_GUIDELINES.md` | Good |
| Contributing Guide | `docs/CONTRIBUTING.md` | Good |
| Implementation Plan | `docs/IMPLEMENTATION_PLAN.md` | Good |
| Module Integration Guide | `docs/MODULE_INTEGRATION_GUIDE.md` | Good |
| Module Status Report | `docs/MODULE_STATUS_REPORT.md` | Needs update |
| Product Features | `docs/PRODUCT_FEATURES.md` | Comprehensive |
| UI/UX Improvement Roadmap | `docs/UI_UX_IMPROVEMENT_ROADMAP.md` | Good |
| Swagger/OpenAPI | `/api/docs` (runtime) | Auto-generated |

### 7.2 Missing Documentation
| Document | Priority | Purpose |
|----------|----------|---------|
| **API Reference Guide** | Critical | Complete endpoint documentation with examples, beyond Swagger |
| **Deployment Guide** | Critical | Step-by-step production deployment with infrastructure setup |
| **Security Policy** | Critical | Threat model, security requirements, incident response plan |
| **Database Schema Docs** | High | ER diagrams, relationship documentation, migration strategy |
| **Architecture Decision Records** | High | ADRs for ORM choice, module boundaries, auth strategy |
| **Testing Strategy** | High | What to test, how, coverage targets per module |
| **Environment Setup Guide** | High | Developer onboarding: prerequisites, local setup, troubleshooting |
| **Runbook** | High | Operational procedures for common issues, alerts, deployments |
| **Component Library/Storybook** | Medium | Visual component documentation with usage examples |
| **Performance Benchmarks** | Medium | Load testing results, capacity planning, bottleneck analysis |
| **Disaster Recovery Plan** | Medium | Backup, restore, failover, RTO/RPO targets |
| **Data Dictionary** | Medium | Business glossary mapping to technical entities |

---

## 8. MODULE-SPECIFIC GAPS

### 8.1 Workflow & Approvals
- **12/12 workflow processor jobs are stubs** (0% functional)
- Event listeners defined but not connected (`// TODO: EventEmitter listener setup`)
- Approval notifications never sent (7 notification TODOs in approval-workflow.service.ts)
- SLA auto-escalation not implemented
- Entity status not updated on approval/rejection

### 8.2 Finance
- 13 entities, 14 services - well-structured
- **Gap:** Financial reporting service is scaffold-only
- **Gap:** Tax computation lacks country-specific rules
- **Gap:** No audit trail for financial transactions (critical for compliance)
- **Good:** Journal entries use QueryRunner transactions

### 8.3 Production
- Largest module: 58 entities, 56 controllers, 63 services
- Industry 4.0 features (Digital Twin, IoT, AI/ML) are interface-defined
- **Gap:** AI anomaly detection needs actual ML model integration
- **Gap:** IoT features need hardware integration points
- **Gap:** Real-time shop floor data needs WebSocket implementation

### 8.4 HR & Payroll
- 18 entities, 21 controllers, 44 services - excellent coverage
- **Gap:** Statutory compliance needs country-specific rules (PF, ESI, TDS for India)
- **Gap:** Payroll calculation needs validation against labor laws
- **Good:** Comprehensive onboarding/offboarding, attendance, leave, shift management

### 8.5 Internationalization
- Translation system for 7 languages with `LanguageContext` and `TranslationContext`
- RTL support component exists
- **Gap:** Only English translations are complete; other languages are partial
- **Gap:** No currency/date locale formatting tied to user preference
- **Gap:** RTL layout needs comprehensive testing

### 8.6 Inventory
- Dashboard uses mock data (not connected to backend services)
- **Gap:** No real-time stock level updates
- **Gap:** Movement tracking has TODO for data fetching
- **Good:** Backend services are comprehensive (stock management, transfers, cycle counts)

---

## 9. DETAILED REMEDIATION PLAN

### Phase 1: Critical Security Hardening (Week 1-2)

#### Sprint 1.1 - Security Headers & Auth (Week 1)

| Task | File(s) to Modify | Effort | Priority |
|------|--------------------|--------|----------|
| **1.1.1** Apply security headers | `b3-erp/backend/src/main.ts` - Add `import { configureSecurityHeaders } from './common/security/security.config'` and call `configureSecurityHeaders(app)` after CORS setup | 1h | P0 |
| **1.1.2** Apply enhanced CORS config | `b3-erp/backend/src/main.ts` - Replace inline CORS with `getCorsConfig()` from security.config.ts | 1h | P0 |
| **1.1.3** Remove JWT default secret | `b3-erp/backend/src/modules/auth/auth.module.ts:18` and `auth/strategies/jwt.strategy.ts:12` - Remove `'secretKey'` fallback, throw startup error if not configured | 2h | P0 |
| **1.1.4** Register ThrottlerModule | `b3-erp/backend/src/app.module.ts` - Import and register `ThrottlerModule.forRoot()` with config from `rate-limit.config.ts`; apply `CustomThrottlerGuard` globally in `main.ts` | 3h | P0 |
| **1.1.5** Fix synchronize:true | `b3-erp/backend/src/app.module.ts:63` - Change `synchronize: true` to `synchronize: configService.get('DB_SYNCHRONIZE') === 'true'` | 30min | P0 |
| **1.1.6** Add Next.js middleware | Create `b3-erp/frontend/middleware.ts` - JWT token validation, protected route patterns, public route whitelist | 4h | P0 |

**Acceptance Criteria:**
- [ ] All responses include CSP, HSTS, X-Frame-Options headers
- [ ] API returns 429 after exceeding rate limits
- [ ] App fails to start without JWT_SECRET env var
- [ ] Database schema never auto-syncs unless explicitly enabled
- [ ] Unauthenticated users are redirected to login from protected routes

#### Sprint 1.2 - XSS Prevention & CSRF (Week 2)

| Task | File(s) to Modify | Effort | Priority |
|------|--------------------|--------|----------|
| **1.2.1** Add DOMPurify | `b3-erp/frontend/package.json` - `npm install dompurify @types/dompurify` | 30min | P0 |
| **1.2.2** Sanitize CommentModal | `b3-erp/frontend/src/components/modals/CommentModal.tsx:244` - Wrap `renderPreview()` with `DOMPurify.sanitize()` | 1h | P0 |
| **1.2.3** Sanitize ChatbotAssistant | `b3-erp/frontend/src/components/advanced-features/ChatbotAssistant.tsx:552` - Sanitize `message.content` before rendering | 1h | P0 |
| **1.2.4** Sanitize print components | `PrintStylesheet.tsx`, `PrintLayouts.tsx` - Add DOMPurify | 1h | P1 |
| **1.2.5** Add health check endpoint | Create `b3-erp/backend/src/modules/health/health.module.ts` using `@nestjs/terminus` with DB, Redis, and disk indicators | 3h | P1 |
| **1.2.6** Add global exception filter | Create `b3-erp/backend/src/common/filters/http-exception.filter.ts` - Consistent error response format with correlation IDs | 3h | P1 |

**Acceptance Criteria:**
- [ ] All `dangerouslySetInnerHTML` usages pass through DOMPurify
- [ ] `/health` endpoint returns DB, Redis, disk status
- [ ] All API errors return consistent JSON format with correlation IDs

---

### Phase 2: Testing Foundation (Week 3-6)

#### Sprint 2.1 - Test Infrastructure (Week 3)

| Task | Details | Effort |
|------|---------|--------|
| **2.1.1** Create test database setup | `b3-erp/backend/test/test-setup.ts` - Auto-create test DB, run migrations, seed test data, teardown | 8h |
| **2.1.2** Create entity factories | `b3-erp/backend/test/factories/` - Factories for User, Customer, Item, PO, WorkOrder, Invoice using `@jorgebodega/typeorm-seeding` or custom builder pattern | 12h |
| **2.1.3** Create mock service generators | `b3-erp/backend/test/mocks/` - Auto-mock generators for PrismaService, Repository pattern | 6h |
| **2.1.4** Set up frontend testing | Configure `jest.config.ts` for React component testing with `@testing-library/react`, mock Next.js router | 4h |
| **2.1.5** Add test coverage reporting | Configure `jest --coverage` with per-module thresholds, integrate with CI coverage badge | 2h |

#### Sprint 2.2 - Critical Backend Tests (Week 4-5)

| Service | Test File | Key Test Cases | Effort |
|---------|-----------|----------------|--------|
| **AuthService** | `auth/spec/auth.service.spec.ts` | Login with valid/invalid credentials, token generation, token refresh, password change | 8h |
| **JournalEntryService** | `finance/spec/journal-entry.service.spec.ts` | Double-entry validation, period locking, reversal, balance calculation | 10h |
| **InvoiceService** | `finance/spec/invoice.service.spec.ts` | Creation, tax calculation, payment application, credit notes | 8h |
| **StockManagementService** | `inventory/spec/stock.service.spec.ts` | Stock in/out, transfer, adjustment, negative stock prevention, concurrent access | 10h |
| **BOMService** | `production/spec/bom.service.spec.ts` | BOM creation, version management, cost rollup, circular dependency detection | 8h |
| **WorkOrderService** | `production/spec/work-order.service.spec.ts` | Creation from BOM, status transitions, material reservation, completion | 8h |
| **ApprovalWorkflowService** | `approvals/spec/approval-workflow.service.spec.ts` | Submit, approve, reject, escalate, multi-level chain | 8h |
| **QuotationService** | `sales/spec/quotation.service.spec.ts` | Price calculation, margin validation, version management | 6h |
| **PurchaseOrderService** | `procurement/spec/po.service.spec.ts` | Creation, approval flow, goods receipt, invoice matching | 8h |
| **PayrollService** | `hr/spec/payroll.service.spec.ts` | Salary calculation, deductions, tax withholding, payslip generation | 10h |

**Target:** 60% backend coverage on critical services

#### Sprint 2.3 - E2E Tests & Frontend Tests (Week 6)

| Test File | Coverage | Key Scenarios |
|-----------|----------|---------------|
| `e2e/sales-workflow.spec.ts` | Sales | RFP creation -> Quote generation -> Order placement -> Invoice |
| `e2e/procurement-cycle.spec.ts` | Procurement | PR -> RFQ -> Vendor comparison -> PO -> GRN |
| `e2e/finance-operations.spec.ts` | Finance | Journal entry -> Invoice -> Payment -> Reconciliation |
| `e2e/approval-chain.spec.ts` | Approvals | Submit PO -> L1 approve -> L2 approve -> Auto-update status |
| `e2e/hr-leave.spec.ts` | HR | Apply leave -> Manager approval -> Balance update |
| Frontend unit: `DataTable.spec.tsx` | Component | Sorting, filtering, pagination, selection |
| Frontend unit: `Sidebar.spec.tsx` | Component | Navigation, collapse, active state |
| Frontend unit: `useOfflineStorage.spec.ts` | Hook | Cache, expiry, pending actions |

**Target:** 20 E2E tests, 10 component tests, 5 hook tests

---

### Phase 3: Backend Completeness (Week 7-10)

#### Sprint 3.1 - Expose Hidden Modules (Week 7-8)

| Task | Details | Effort |
|------|---------|--------|
| **3.1.1** Create NotificationsController | `b3-erp/backend/src/modules/notifications/notifications.controller.ts` - CRUD endpoints: GET /notifications, PATCH /notifications/:id/read, DELETE /notifications/:id, POST /notifications/:id/mark-read, GET /notifications/unread-count | 6h |
| **3.1.2** Create NotificationsModule | `notifications.module.ts` - Register controller, services, entities; add to `app.module.ts` imports | 2h |
| **3.1.3** Create ReportsController | `b3-erp/backend/src/modules/reports/reports.controller.ts` - Endpoints for templates, saved reports, scheduling, execution, dashboards, KPIs | 8h |
| **3.1.4** Create Report entities | Create Prisma models or TypeORM entities for Report, Dashboard, KPI, ReportExecution | 6h |
| **3.1.5** Create SupportController | `b3-erp/backend/src/modules/support/support.controller.ts` - Ticket CRUD, knowledge base, SLA tracking, CSAT endpoints | 10h |
| **3.1.6** Create Support entities | Add Ticket, KnowledgeArticle, SLAPolicy models to Prisma schema | 6h |

#### Sprint 3.2 - Notification System (Week 8-9)

| Task | Details | Effort |
|------|---------|--------|
| **3.2.1** Implement email sending | `notification.processor.ts:72` - Integrate nodemailer with SMTP config, HTML templates | 8h |
| **3.2.2** Implement in-app notifications | `notification.processor.ts:53` - Save to DB via NotificationService, emit WebSocket event | 6h |
| **3.2.3** Connect user email lookup | `email.service.ts:27,170` - Wire to UserService to fetch email by userId | 2h |
| **3.2.4** Set up WebSocket gateway | Create `b3-erp/backend/src/modules/notifications/notifications.gateway.ts` - Socket.IO gateway for real-time notifications | 6h |
| **3.2.5** Implement SMS sending (optional) | `notification.processor.ts:88` - Twilio integration | 4h |
| **3.2.6** Connect approval notifications | Wire `approval-workflow.service.ts` TODOs (lines 204, 279, 299, 300, 317) to NotificationService | 6h |

#### Sprint 3.3 - Workflow & Business Logic (Week 9-10)

| Task | Details | Effort |
|------|---------|--------|
| **3.3.1** Implement RFP-to-Order | `workflow.processor.ts:20` - Create SalesOrder from RFP data, update RFP status | 8h |
| **3.3.2** Implement SLA auto-escalation | `sla-monitoring.service.ts:144` - Auto-escalate overdue approvals to next level, send alerts | 6h |
| **3.3.3** Implement approval status updates | `approval-workflow.service.ts:205,299` - Update source entity status on approval/rejection | 6h |
| **3.3.4** Add missing DTOs | Create request/response DTOs for CPQ (7 controllers), Accounts (4 controllers), Estimation (6 controllers) | 8h |
| **3.3.5** ORM Consolidation Plan | Document which modules use TypeORM vs Prisma; create migration plan for consolidation | 4h |

---

### Phase 4: Frontend Integration (Week 11-16)

#### Sprint 4.1 - Auth & State Management (Week 11-12)

| Task | Details | Effort |
|------|---------|--------|
| **4.1.1** Create AuthContext | `b3-erp/frontend/src/contexts/AuthContext.tsx` - Login, logout, token refresh, user profile, role-based access | 8h |
| **4.1.2** Create useAuth hook | `b3-erp/frontend/src/hooks/useAuth.ts` - Wrapper around AuthContext with convenience methods | 3h |
| **4.1.3** Implement React Query | Replace direct API calls with `useQuery`/`useMutation` hooks for caching, refetching, optimistic updates | 12h |
| **4.1.4** Create API service layer | Standardize all 120 service files to use React Query patterns with consistent error handling | 16h |
| **4.1.5** Remove unused dependencies | Remove Zustand (or implement stores), evaluate NextAuth usage | 2h |
| **4.1.6** Consolidate toast systems | Merge `ToastContext` and `EnhancedToastContext` into single system | 3h |

#### Sprint 4.2 - Critical API Integrations (Week 12-14)

**Priority 1 - Procurement (27 TODOs):**

| Component | TODO Description | Backend Endpoint |
|-----------|-----------------|-----------------|
| `ContractModals.tsx` | Contract CRUD operations | `POST/PUT/DELETE /api/v1/procurement/contracts` |
| `GRNModals.tsx` | Goods Receipt creation | `POST /api/v1/procurement/goods-receipts` |
| `RFQModals.tsx` | RFQ management | `POST/PUT /api/v1/procurement/rfqs` |
| `VendorModals.tsx` | Vendor management | `POST/PUT /api/v1/procurement/vendors` |
| `POModals.tsx` | Purchase order actions | `POST/PUT /api/v1/procurement/purchase-orders` |

**Priority 2 - Production (37 TODOs):**

| Component | TODO Description | Backend Endpoint |
|-----------|-----------------|-----------------|
| `DowntimeRCAModals.tsx` | Root cause analysis CRUD | `POST /api/v1/production/downtime/rca` |
| `DowntimeEventModals.tsx` | Event update/resolution | `PUT /api/v1/production/downtime/events` |
| `DowntimeExportModals.tsx` | Export API, preview | `GET /api/v1/production/downtime/export` |
| `BOMVersionModals.tsx` | Version create/update/copy | `POST/PUT /api/v1/production/bom/versions` |
| `BOMCoreModals.tsx` | BOM CRUD, component search | `POST/PUT /api/v1/production/bom` |

**Priority 3 - Inventory (15 TODOs):**

| Component | TODO Description | Backend Endpoint |
|-----------|-----------------|-----------------|
| `InventoryMovementModals.tsx` | Fetch issue data, print | `GET /api/v1/inventory/movements` |
| `InventoryTransferModals.tsx` | Validation, item details | `POST /api/v1/inventory/transfers` |
| Dashboard `inventory/page.tsx` | Replace mock data with API | `GET /api/v1/inventory/dashboard` |

#### Sprint 4.3 - Remaining Integrations & Cleanup (Week 15-16)

| Task | Details | Effort |
|------|---------|--------|
| **4.3.1** HR module API integration | Connect overtime, timesheet, shift components (10 TODOs) | 8h |
| **4.3.2** Quality module API integration | Connect inspection and NCR components (2 TODOs) | 4h |
| **4.3.3** Shop floor integration | Connect action handlers and export (5 TODOs) | 6h |
| **4.3.4** Enable TypeScript strict builds | Remove `ignoreBuildErrors: true` from `next.config.js`, fix type errors | 12h |
| **4.3.5** Enable ESLint in builds | Remove `ignoreDuringBuilds: true` from `next.config.js`, fix lint errors | 8h |
| **4.3.6** Remove deprecated code | Delete `_finance_deprecated/`, consolidate `shop-floor/` and `shopfloor/` | 2h |
| **4.3.7** Replace mock data files | Remove 32 files in `src/data/common-masters/` once API integration is complete | 4h |

---

### Phase 5: Production Readiness (Week 17-20)

#### Sprint 5.1 - Docker & Deployment (Week 17-18)

| Task | Details | Effort |
|------|---------|--------|
| **5.1.1** Production backend Dockerfile | Multi-stage build: builder (npm ci, build) -> runtime (copy dist, node user, health check) | 4h |
| **5.1.2** Production frontend Dockerfile | Multi-stage: builder (npm ci, build) -> runner (standalone Next.js, node user) | 4h |
| **5.1.3** Production docker-compose | `docker-compose.prod.yml` with resource limits, restart policies, health checks, secrets, nginx | 4h |
| **5.1.4** Nginx production config | SSL termination, gzip, caching headers, rate limiting, WebSocket proxy | 4h |
| **5.1.5** Add pre-commit hooks | Install Husky, configure lint-staged for TypeScript, ESLint, Prettier | 3h |
| **5.1.6** Add commitlint | Conventional commits enforcement | 2h |

#### Sprint 5.2 - Observability (Week 18-19)

| Task | Details | Effort |
|------|---------|--------|
| **5.2.1** Add structured logging | Install Winston or Pino, configure log levels, JSON format, correlation IDs | 6h |
| **5.2.2** Add LoggingInterceptor | `b3-erp/backend/src/common/interceptors/logging.interceptor.ts` - Request/response logging with timing | 3h |
| **5.2.3** Add Prometheus metrics | `/metrics` endpoint with request count, latency histograms, business KPIs | 6h |
| **5.2.4** Create Grafana dashboards | Request rate, error rate, latency P50/P95/P99, DB query time, queue depth | 4h |
| **5.2.5** Set up alerting rules | Alert on error rate >5%, P99 >2s, queue depth >100, DB connection pool exhaustion | 3h |
| **5.2.6** Add Sentry integration | Frontend and backend error tracking with source maps | 4h |

#### Sprint 5.3 - CI/CD & Documentation (Week 19-20)

| Task | Details | Effort |
|------|---------|--------|
| **5.3.1** Add deployment pipeline | `.github/workflows/deploy.yml` - Build images, push to registry, deploy to staging/production with approval gates | 8h |
| **5.3.2** Add database migration step | Migration job runs before deployment, with rollback on failure | 4h |
| **5.3.3** Add container scanning | Trivy scan in CI, fail on critical/high CVEs | 3h |
| **5.3.4** Add SAST scanning | CodeQL or Semgrep analysis on PRs | 3h |
| **5.3.5** Write deployment guide | Step-by-step: infrastructure setup, env config, first deploy, rollback | 8h |
| **5.3.6** Write security policy | Threat model, security headers rationale, incident response, vulnerability disclosure | 6h |
| **5.3.7** Write API documentation | Complete endpoint reference with examples, authentication, error codes | 12h |
| **5.3.8** Write runbook | Common operational procedures, troubleshooting, scaling guide | 6h |
| **5.3.9** Add backup procedures | Automated PostgreSQL backup scripts, S3 upload, point-in-time recovery documentation | 4h |

---

## 10. RESOURCE ESTIMATION

### Team Size & Timeline

| Phase | Duration | Dev Resources | QA Resources | DevOps |
|-------|----------|---------------|--------------|--------|
| Phase 1: Security | 2 weeks | 1 senior backend + 1 senior frontend | 0.5 | 0 |
| Phase 2: Testing | 4 weeks | 2 backend + 1 frontend | 1 dedicated | 0 |
| Phase 3: Backend | 4 weeks | 2 backend | 0.5 | 0 |
| Phase 4: Frontend | 6 weeks | 2 frontend + 1 backend (API support) | 1 | 0 |
| Phase 5: Production | 4 weeks | 1 backend + 1 frontend | 0.5 | 1 dedicated |
| **Total** | **20 weeks** | **~5 devs** | **~2.5 QA** | **1 DevOps** |

### Effort Summary

| Category | Estimated Hours | Story Points (approx) |
|----------|----------------|----------------------|
| Security hardening | 40h | 20 |
| Test infrastructure | 32h | 16 |
| Backend unit tests | 86h | 43 |
| E2E + frontend tests | 40h | 20 |
| Backend module completion | 88h | 44 |
| Notification system | 32h | 16 |
| Workflow completion | 32h | 16 |
| Frontend auth & state | 44h | 22 |
| Frontend API integration | 60h | 30 |
| Frontend cleanup | 30h | 15 |
| Docker & deployment | 21h | 11 |
| Observability | 26h | 13 |
| CI/CD & docs | 54h | 27 |
| **Total** | **~585h** | **~293 SP** |

---

## 11. RISK REGISTER

| Risk | Probability | Impact | Mitigation |
|------|------------|--------|------------|
| ORM consolidation causes data migration issues | Medium | High | Start with read-only Prisma adoption for TypeORM modules; migrate writes module-by-module |
| Frontend type errors block build enable | High | Medium | Fix incrementally per module; use `// @ts-expect-error` temporarily for non-critical |
| Rate limiting blocks legitimate users | Low | High | Start with generous limits; monitor 429 rate; add per-user exceptions |
| WebSocket notifications cause connection storms | Medium | Medium | Implement connection pooling, heartbeat, and reconnect backoff |
| Mock data removal breaks existing features | Medium | High | Feature-flag API vs mock data using `NEXT_PUBLIC_USE_MOCK_DATA` env var |
| Test environment diverges from production | Medium | High | Use Docker-based test environment matching production config |
| JWT secret rotation causes mass logout | Low | Medium | Implement dual-secret validation during rotation period |

---

## 12. SUMMARY STATISTICS

| Metric | Value |
|--------|-------|
| Backend Modules | 27 (3 without controllers) |
| Backend Entities | 255 |
| Backend Services | 332 |
| Backend Controllers | 213 |
| Backend DTOs | 336 |
| Backend Test Files | 2 (<1% coverage) |
| Frontend Pages | 1,719 |
| Frontend Components | 641 |
| Frontend Services | 120 (~70,000 lines) |
| Frontend Mock Data Files | 691 |
| Frontend E2E Tests | 3 |
| Backend TODOs | 26 |
| Frontend TODOs | 395 (242 actionable) |
| Workflow Jobs Functional | 0/12 (0%) |
| Notification Jobs Functional | 0/6 (0%) |
| Security Headers Applied | No |
| Rate Limiting Active | No |
| Route Protection | No |
| Production Docker Ready | No |
| Estimated Remediation | 585 hours / 20 weeks |

---

*This analysis was generated through automated codebase scanning and manual code review of all 27 backend modules, 641 frontend components, CI/CD pipeline, Docker configuration, and security implementation on March 5, 2026.*
