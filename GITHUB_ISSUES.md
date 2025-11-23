# GitHub Issues for ManufacturingOS Improvements

This file contains all issues to be created in GitHub for tracking project improvements.
Each issue can be copied and created manually in GitHub Issues.

---

## Critical Priority Issues

### Issue #1: Implement Authentication & Authorization System

**Labels**: `critical`, `security`, `backend`

**Description**:
Currently, 0 out of 89 controllers have authentication guards, leaving 491 modification endpoints (POST/PUT/DELETE) completely unprotected. The `accounts` module is empty with no login/logout implementation.

**Tasks**:

#### Backend Authentication Setup
- [ ] Create `AuthModule` in `/backend/src/modules/auth/`
- [ ] Implement `AuthService` with login/logout methods
- [ ] Create `JwtStrategy` for Passport.js
- [ ] Create `LocalStrategy` for username/password auth
- [ ] Implement `JwtAuthGuard` decorator
- [ ] Create `RolesGuard` for role-based access
- [ ] Implement `@Roles()` decorator for controller methods
- [ ] Create `@CurrentUser()` parameter decorator
- [ ] Implement password hashing with bcrypt
- [ ] Create password reset functionality
- [ ] Implement refresh token mechanism
- [ ] Add session management

#### Apply Guards to Controllers (89 controllers)
- [ ] Add `@UseGuards(JwtAuthGuard)` to all controllers
- [ ] Apply role decorators to Production module controllers (12)
- [ ] Apply role decorators to Sales module controllers (8)
- [ ] Apply role decorators to Procurement module controllers (10)
- [ ] Apply role decorators to Finance module controllers (15)
- [ ] Apply role decorators to HR module controllers (12)
- [ ] Apply role decorators to Inventory module controllers (8)
- [ ] Apply role decorators to Logistics module controllers (10)
- [ ] Apply role decorators to Quality module controllers (4)
- [ ] Apply role decorators to CRM module controllers (6)
- [ ] Apply role decorators to Workflow module controllers (4)

#### Permission System
- [ ] Create Permission entity and migration
- [ ] Create Role-Permission mapping
- [ ] Implement `@RequirePermission()` decorator
- [ ] Create permission check middleware
- [ ] Implement resource-level access control
- [ ] Add permission management UI

**Acceptance Criteria**:
- All 491 modification endpoints require authentication
- Role-based access control implemented
- Permission system functional

---

### Issue #2: Implement Test Coverage

**Labels**: `critical`, `testing`, `quality`

**Description**:
The project has zero test coverage. Backend has 0 test files for 131 services, and frontend has 0 test files for 456 components. Target is 80% coverage.

**Tasks**:

#### Backend Testing Setup
- [ ] Verify Jest configuration in `package.json`
- [ ] Create `test/` directory structure
- [ ] Set up test database configuration
- [ ] Create test utilities and helpers
- [ ] Set up mock factories for entities

#### Backend Service Tests (131 services)
- [ ] Write tests for Production module services (12)
- [ ] Write tests for Sales module services (11)
- [ ] Write tests for Procurement module services (13)
- [ ] Write tests for Finance module services (20)
- [ ] Write tests for HR module services (18)
- [ ] Write tests for Inventory module services (12)
- [ ] Write tests for Logistics module services (13)
- [ ] Write tests for Quality module services (10)
- [ ] Write tests for CRM module services (2)
- [ ] Write tests for Workflow module services (11)
- [ ] Write tests for Support module services (2)
- [ ] Write tests for IT-Admin module services (7)

#### Backend Controller Tests (89 controllers)
- [ ] Write integration tests for all GET endpoints
- [ ] Write integration tests for all POST endpoints
- [ ] Write integration tests for all PUT endpoints
- [ ] Write integration tests for all DELETE endpoints
- [ ] Test authentication/authorization on endpoints

#### Frontend Testing Setup
- [ ] Install Jest and React Testing Library
- [ ] Configure Jest for Next.js
- [ ] Create test utilities and custom renders
- [ ] Set up MSW for API mocking

#### Frontend Component Tests (456 components)
- [ ] Write tests for Production components (28)
- [ ] Write tests for Sales components (8)
- [ ] Write tests for Procurement components (57)
- [ ] Write tests for Finance components (58)
- [ ] Write tests for HR components (27)
- [ ] Write tests for Inventory components (16)
- [ ] Write tests for Logistics components (15)
- [ ] Write tests for Quality components (4)
- [ ] Write tests for CRM components (14)
- [ ] Write tests for CPQ components (41)
- [ ] Write tests for Estimation components (9)
- [ ] Write tests for Project Management components (33)
- [ ] Write tests for Workflow components (9)
- [ ] Write tests for Common Masters components (59)
- [ ] Write tests for UI components (29)

#### E2E Testing
- [ ] Set up Playwright or Cypress
- [ ] Write E2E tests for authentication flow
- [ ] Write E2E tests for sales order workflow
- [ ] Write E2E tests for production workflow
- [ ] Write E2E tests for procurement workflow
- [ ] Write E2E tests for inventory operations

**Acceptance Criteria**:
- Minimum 80% code coverage
- All critical workflows have E2E tests
- CI/CD runs tests on every PR

---

### Issue #3: Fix N+1 Query Vulnerabilities

**Labels**: `critical`, `performance`, `database`

**Description**:
There are 1,225 database queries with only 2 caching instances, causing severe performance degradation under load.

**Tasks**:

#### Query Audit
- [ ] Identify all repository `find()` calls
- [ ] Identify all `createQueryBuilder()` usages
- [ ] Map entity relationships
- [ ] Document N+1 patterns per service

#### Fix Production Module Queries
- [ ] Optimize `work-order.service.ts` queries
- [ ] Optimize `bom.service.ts` queries
- [ ] Optimize `production-plan.service.ts` queries
- [ ] Optimize `mrp.service.ts` queries
- [ ] Add eager loading for work order items
- [ ] Add eager loading for BOM components

#### Fix Sales Module Queries
- [ ] Optimize `sales-order.service.ts` queries
- [ ] Optimize `quote.service.ts` queries
- [ ] Optimize `opportunity.service.ts` queries
- [ ] Add eager loading for order line items

#### Fix Procurement Module Queries
- [ ] Optimize `purchase-order.service.ts` queries
- [ ] Optimize `goods-receipt.service.ts` queries
- [ ] Optimize `vendor.service.ts` queries
- [ ] Add eager loading for PO items

#### Fix Finance Module Queries
- [ ] Optimize `journal-entry.service.ts` queries
- [ ] Optimize `invoice.service.ts` queries
- [ ] Optimize `payment.service.ts` queries

#### Fix HR Module Queries
- [ ] Optimize `employee.service.ts` queries
- [ ] Optimize `payroll.service.ts` queries
- [ ] Optimize `leave.service.ts` queries

#### Fix Inventory Module Queries
- [ ] Optimize `stock.service.ts` queries
- [ ] Optimize `stock-transfer.service.ts` queries

#### Fix Logistics Module Queries
- [ ] Optimize `shipment.service.ts` queries
- [ ] Optimize `trip.service.ts` queries

#### Implement Caching
- [ ] Configure Redis connection
- [ ] Implement caching for master data queries
- [ ] Implement caching for frequently accessed entities
- [ ] Add cache invalidation on updates
- [ ] Create cache service wrapper
- [ ] Add cache TTL configuration

**Acceptance Criteria**:
- All N+1 patterns eliminated
- Redis caching implemented for 50+ queries
- Query response time improved by 50%

---

### Issue #4: Fix XSS Vulnerabilities

**Labels**: `critical`, `security`, `frontend`

**Description**:
Multiple XSS vulnerabilities exist due to use of `dangerouslySetInnerHTML` and direct `innerHTML` assignments.

**Tasks**:

#### Fix dangerouslySetInnerHTML Usage
- [ ] Refactor `CommentModal.tsx:244` to use safe rendering
- [ ] Install DOMPurify package
- [ ] Create sanitization utility function
- [ ] Replace all `dangerouslySetInnerHTML` with sanitized content

#### Fix innerHTML Assignments
- [ ] Refactor `DragDropUpload.tsx:530` to use textContent
- [ ] Refactor `profit-loss/page.tsx:126` to use React rendering
- [ ] Refactor `profit-loss/page.tsx:298` to use React rendering
- [ ] Search for other innerHTML usages
- [ ] Replace all innerHTML with safe alternatives

#### Input Sanitization
- [ ] Create input sanitization middleware
- [ ] Apply sanitization to all user inputs
- [ ] Add CSP headers configuration
- [ ] Test for XSS vulnerabilities

**Acceptance Criteria**:
- No `dangerouslySetInnerHTML` without sanitization
- No direct `innerHTML` assignments
- CSP headers configured
- XSS vulnerability tests pass

---

## High Priority Issues

### Issue #5: Implement Incomplete Workflow Features

**Labels**: `high`, `feature`, `workflow`

**Description**:
Workflow processor has 12 unimplemented TODO features, notification processor is not connected, and 3 workflow services use mock data.

**Tasks**:

#### Implement Workflow Processor Actions
- [ ] Implement order creation from RFP (`workflow.processor.ts:25`)
- [ ] Implement shipment creation (`workflow.processor.ts:398`)
- [ ] Implement invoice creation (`workflow.processor.ts:415`)
- [ ] Implement automatic purchase request creation (`workflow.processor.ts:432`)
- [ ] Implement affected work order check (`workflow.processor.ts:452`)
- [ ] Implement PO expedition (`workflow.processor.ts:469`)
- [ ] Implement vendor communication (`workflow.processor.ts:486`)
- [ ] Implement delivery tracking reminders (`workflow.processor.ts:503`)
- [ ] Implement inspection creation for goods receipt (`workflow.processor.ts:554`)
- [ ] Implement PO completion check (`workflow.processor.ts:570`)
- [ ] Implement reservation release for waiting work orders (`workflow.processor.ts:586`)

#### Implement Notification Processor
- [ ] Implement actual notification sending (`notification.processor.ts:15`)
- [ ] Connect to email service
- [ ] Connect to SMS service
- [ ] Connect to in-app notification system
- [ ] Add notification templates
- [ ] Implement notification preferences

#### Replace Workflow Mock Data
- [ ] Replace mock data in `intelligent-routing.service.ts`
  - [ ] Create routing rules entity
  - [ ] Create migration for routing rules
  - [ ] Implement CRUD for routing rules
  - [ ] Connect service to database
- [ ] Replace mock data in `parallel-approval.service.ts`
  - [ ] Create approval configuration entity
  - [ ] Create migration for approvals
  - [ ] Implement approval workflow persistence
  - [ ] Connect service to database
- [ ] Replace mock data in `email-gateway.service.ts`
  - [ ] Create email account entity
  - [ ] Create email template entity
  - [ ] Create migrations
  - [ ] Connect to actual email server (SMTP)
  - [ ] Implement email queue

**Acceptance Criteria**:
- All 12 workflow processor actions implemented
- Notifications delivered via email, SMS, and in-app
- All workflow services use database persistence

---

### Issue #6: Restructure Database Migrations

**Labels**: `high`, `database`, `infrastructure`

**Description**:
Currently there is a single migration file for 109 entities, making it impossible to rollback individual features.

**Tasks**:

#### Analyze Current Migration
- [ ] Document all entities in current migration
- [ ] Group entities by module
- [ ] Identify dependencies between entities

#### Create Module-Specific Migrations
- [ ] Create migration for common/shared entities
- [ ] Create migration for Production module entities
- [ ] Create migration for Sales module entities
- [ ] Create migration for Procurement module entities
- [ ] Create migration for Finance module entities
- [ ] Create migration for HR module entities
- [ ] Create migration for Inventory module entities
- [ ] Create migration for Logistics module entities
- [ ] Create migration for Quality module entities
- [ ] Create migration for CRM module entities
- [ ] Create migration for Workflow module entities
- [ ] Create migration for Support module entities
- [ ] Create migration for IT-Admin module entities
- [ ] Create migration for CPQ module entities
- [ ] Create migration for Estimation module entities
- [ ] Create migration for Project Management module entities

#### Migration Testing
- [ ] Test each migration runs successfully
- [ ] Test each migration rollback works
- [ ] Create migration order documentation
- [ ] Add migration tests to CI/CD

**Acceptance Criteria**:
- 20-30 module-specific migrations
- Each migration can rollback independently
- Migration documentation complete

---

### Issue #7: Add Missing Database Indexes

**Labels**: `high`, `performance`, `database`

**Description**:
Only IT-Admin entities have indexes (9 total). Missing indexes on Sales, Inventory, Production, Procurement, Logistics, Finance, and HR entities.

**Tasks**:

#### Sales Module Indexes
- [ ] Add index on `sales_order.customer_id`
- [ ] Add index on `sales_order.order_date`
- [ ] Add index on `sales_order.status`
- [ ] Add composite index on `sales_order(customer_id, order_date)`
- [ ] Add index on `quote.customer_id`
- [ ] Add index on `opportunity.status`

#### Inventory Module Indexes
- [ ] Add index on `stock.item_id`
- [ ] Add index on `stock.warehouse_id`
- [ ] Add composite index on `stock(item_id, warehouse_id)`
- [ ] Add index on `stock_transfer.status`
- [ ] Add index on `batch.expiry_date`

#### Production Module Indexes
- [ ] Add index on `work_order.item_id`
- [ ] Add index on `work_order.work_center_id`
- [ ] Add index on `work_order.status`
- [ ] Add index on `work_order.start_date`
- [ ] Add composite index on `work_order(status, start_date)`
- [ ] Add index on `bom.item_id`

#### Procurement Module Indexes
- [ ] Add index on `purchase_order.vendor_id`
- [ ] Add index on `purchase_order.order_number`
- [ ] Add index on `purchase_order.status`
- [ ] Add index on `goods_receipt.po_id`
- [ ] Add index on `purchase_requisition.status`

#### Logistics Module Indexes
- [ ] Add index on `shipment.status`
- [ ] Add index on `shipment.delivery_date`
- [ ] Add index on `trip.vehicle_id`
- [ ] Add index on `delivery_note.shipment_id`

#### Finance Module Indexes
- [ ] Add index on `journal_entry.date`
- [ ] Add index on `invoice.customer_id`
- [ ] Add index on `invoice.due_date`
- [ ] Add index on `payment.status`

#### HR Module Indexes
- [ ] Add index on `employee.department_id`
- [ ] Add index on `employee.status`
- [ ] Add index on `leave.employee_id`
- [ ] Add index on `attendance.employee_id`
- [ ] Add index on `payroll.month`

**Acceptance Criteria**:
- 100+ indexes added across all modules
- Query performance improved
- Index usage documented

---

### Issue #8: Replace Mock Data with Real Implementations

**Labels**: `high`, `data`, `backend`, `frontend`

**Description**:
101 mock data imports in frontend and 37 backend services using in-memory mock data. Data is lost on server restart.

**Tasks**:

#### Identify All Mock Data Services
- [ ] List all 37 backend services with seedMockData()
- [ ] List all 101 frontend mock data imports
- [ ] Prioritize by business criticality

#### Backend - Replace Mock Data (37 services)
- [ ] Replace mock data in `escalation-management.service.ts`
- [ ] Replace mock data in `mrp-requisition.service.ts`
- [ ] Replace mock data in `demand-forecasting.service.ts`
- [ ] Replace mock data in `gps-tracking.service.ts`
- [ ] Replace mock data in `consolidation.service.ts`
- [ ] Replace mock data in `separation.service.ts`
- [ ] Replace mock data in remaining 31 services

#### Frontend - Connect to Real APIs
- [ ] Remove mock imports from Production components
- [ ] Remove mock imports from Sales components
- [ ] Remove mock imports from Procurement components
- [ ] Remove mock imports from Finance components
- [ ] Remove mock imports from HR components
- [ ] Remove mock imports from Inventory components
- [ ] Remove mock imports from Logistics components
- [ ] Remove mock imports from Common Masters
- [ ] Update all API calls to use real endpoints
- [ ] Add error handling for API failures

**Acceptance Criteria**:
- All 37 backend services use database persistence
- All 101 frontend mock imports removed
- Data persists across server restarts

---

### Issue #9: Set Up CI/CD Pipeline

**Labels**: `high`, `devops`, `infrastructure`

**Description**:
No CI/CD pipeline exists. Need GitHub Actions for testing, building, and deployment.

**Tasks**:

#### GitHub Actions Setup
- [ ] Create `.github/workflows/` directory
- [ ] Create `ci.yml` workflow file

#### Test Workflow
- [ ] Add job for backend unit tests
- [ ] Add job for frontend unit tests
- [ ] Add job for E2E tests
- [ ] Configure test coverage reporting
- [ ] Add coverage threshold checks

#### Build Workflow
- [ ] Add job for backend build
- [ ] Add job for frontend build
- [ ] Add TypeScript type checking
- [ ] Configure build caching

#### Lint Workflow
- [ ] Add ESLint check for backend
- [ ] Add ESLint check for frontend
- [ ] Add Prettier format check
- [ ] Add commit message linting

#### Security Workflow
- [ ] Add npm audit check
- [ ] Add secret scanning
- [ ] Add dependency vulnerability check
- [ ] Add SAST scanning

#### Deploy Workflow
- [ ] Create staging deployment job
- [ ] Create production deployment job
- [ ] Add environment variables management
- [ ] Configure deployment approvals

**Acceptance Criteria**:
- Tests run on every PR
- Build passes before merge
- Automated deployment to staging/production

---

### Issue #10: Remove Console.log Statements

**Labels**: `high`, `code-quality`, `cleanup`

**Description**:
3 console.log instances in backend and 20+ in frontend need to be removed and replaced with proper logging.

**Tasks**:

#### Backend Cleanup
- [ ] Remove console.log from `main.ts:54-55`
- [ ] Remove console.log from `interactions.service.ts:23`
- [ ] Replace with Winston logger calls
- [ ] Configure log levels per environment

#### Frontend Cleanup
- [ ] Remove console.log from `DowntimeExportModals.tsx` (7 instances)
- [ ] Remove console.log from `QualityChecks.tsx` (5 instances)
- [ ] Remove console.log from `FiniteScheduling.tsx` (8 instances)
- [ ] Search and remove all remaining console.log
- [ ] Implement error tracking service (Sentry/Rollbar)

#### Add Linter Rule
- [ ] Add ESLint rule to prevent console statements
- [ ] Configure rule to error on console.log
- [ ] Allow console.warn and console.error in development

**Acceptance Criteria**:
- No console.log in production code
- Winston logging configured
- Error tracking service integrated

---

## Medium Priority Issues

### Issue #11: Implement Accessibility (A11Y)

**Labels**: `medium`, `accessibility`, `frontend`

**Description**:
0 ARIA attributes in 456 components. Missing semantic HTML, keyboard navigation, and alt text.

**Tasks**:

#### Setup Accessibility Testing
- [ ] Install axe-core for testing
- [ ] Add accessibility testing to CI/CD
- [ ] Set up screen reader testing environment

#### Add ARIA Attributes
- [ ] Add `role` attributes to interactive divs
- [ ] Add `aria-label` to icon buttons
- [ ] Add `aria-labelledby` to form inputs
- [ ] Add `aria-describedby` for error messages
- [ ] Add `aria-expanded` for dropdowns
- [ ] Add `aria-selected` for tabs
- [ ] Add `aria-checked` for checkboxes

#### Semantic HTML
- [ ] Add proper heading hierarchy (h1-h6)
- [ ] Use `<main>`, `<nav>`, `<aside>` landmarks
- [ ] Use `<button>` instead of clickable divs
- [ ] Use `<table>` with proper headers

#### Keyboard Navigation
- [ ] Add `tabIndex` to interactive elements
- [ ] Implement focus management in modals
- [ ] Add keyboard shortcuts documentation
- [ ] Ensure focus visible styles

#### Images and Media
- [ ] Add `alt` text to all images
- [ ] Add captions to videos
- [ ] Ensure color contrast ratios (4.5:1)

#### Component Updates (456 components)
- [ ] Update Production components for a11y
- [ ] Update Sales components for a11y
- [ ] Update Procurement components for a11y
- [ ] Update Finance components for a11y
- [ ] Update HR components for a11y
- [ ] Update all remaining components

**Acceptance Criteria**:
- WCAG 2.1 AA compliance
- All interactive elements keyboard accessible
- Screen reader compatible

---

### Issue #12: Optimize Frontend Performance

**Labels**: `medium`, `performance`, `frontend`

**Description**:
Only 27% of components use useCallback/useMemo. 333 components have unnecessary re-renders.

**Tasks**:

#### Add useCallback to Event Handlers
- [ ] Update Production components with useCallback
- [ ] Update Sales components with useCallback
- [ ] Update Procurement components with useCallback
- [ ] Update Finance components with useCallback
- [ ] Update HR components with useCallback
- [ ] Update Inventory components with useCallback
- [ ] Update all remaining components

#### Add useMemo for Derived Data
- [ ] Memoize filtered lists
- [ ] Memoize sorted data
- [ ] Memoize calculated values
- [ ] Memoize complex transformations

#### React.memo for Pure Components
- [ ] Identify pure/presentational components
- [ ] Wrap with React.memo
- [ ] Add custom comparison functions where needed

#### Code Splitting
- [ ] Implement dynamic imports for routes
- [ ] Lazy load heavy components
- [ ] Add loading fallbacks

#### Bundle Optimization
- [ ] Analyze bundle size with webpack-bundle-analyzer
- [ ] Remove unused dependencies
- [ ] Optimize large library imports

**Acceptance Criteria**:
- 100% of components optimized
- Bundle size reduced by 30%
- Lighthouse performance score > 90

---

### Issue #13: Implement Complete Error Handling

**Labels**: `medium`, `error-handling`, `quality`

**Description**:
Only 3 error boundaries for 1,273 pages and 52 try-catch blocks in frontend.

**Tasks**:

#### Add Error Boundaries
- [ ] Create error boundary for Production module
- [ ] Create error boundary for Sales module
- [ ] Create error boundary for Procurement module
- [ ] Create error boundary for Finance module
- [ ] Create error boundary for HR module
- [ ] Create error boundary for Inventory module
- [ ] Create error boundary for Logistics module
- [ ] Create error boundary for Quality module
- [ ] Create error boundary for CRM module
- [ ] Create error boundary for CPQ module
- [ ] Create error boundary for Estimation module
- [ ] Create error boundary for Project Management module
- [ ] Create error boundary for Workflow module
- [ ] Create error boundary for IT-Admin module
- [ ] Create error boundary for Reports module

#### Backend Error Handling
- [ ] Create custom exception classes
- [ ] Implement global exception filter
- [ ] Standardize error response format
- [ ] Add error codes for all exceptions

#### Frontend Error Handling
- [ ] Add try-catch to all async operations
- [ ] Implement global error handler
- [ ] Create user-friendly error messages
- [ ] Add error recovery strategies

#### Error Monitoring
- [ ] Set up Sentry or Rollbar
- [ ] Configure source maps upload
- [ ] Set up error alerts
- [ ] Create error dashboards

**Acceptance Criteria**:
- Error boundary in each module
- Standardized error responses
- Error monitoring dashboard functional

---

### Issue #14: Configure Code Quality Tools

**Labels**: `medium`, `code-quality`, `tooling`

**Description**:
No ESLint/Prettier configuration and no pre-commit hooks. 357 TODO/FIXME comments in frontend.

**Tasks**:

#### ESLint Setup
- [ ] Create `.eslintrc.json` for backend
- [ ] Create `.eslintrc.json` for frontend
- [ ] Configure TypeScript ESLint rules
- [ ] Add React-specific rules
- [ ] Add accessibility rules (eslint-plugin-jsx-a11y)

#### Prettier Setup
- [ ] Create `.prettierrc` configuration
- [ ] Create `.prettierignore` file
- [ ] Configure editor integration
- [ ] Run Prettier on entire codebase

#### Pre-commit Hooks
- [ ] Install Husky
- [ ] Configure pre-commit hook for linting
- [ ] Configure pre-commit hook for formatting
- [ ] Configure pre-commit hook for tests
- [ ] Add commit message linting (commitlint)

#### Resolve TODOs (357 comments)
- [ ] Create GitHub issues for each TODO
- [ ] Prioritize TODOs by impact
- [ ] Assign TODOs to sprints
- [ ] Remove resolved TODO comments

**Acceptance Criteria**:
- ESLint and Prettier configured
- Pre-commit hooks running
- All TODOs tracked in issues

---

### Issue #15: Implement Comprehensive Form Validation

**Labels**: `medium`, `validation`, `forms`

**Description**:
12,117 form/input references without consistent validation. No server-side validation enforcement.

**Tasks**:

#### Backend Validation
- [ ] Review all DTOs for validation decorators
- [ ] Add missing class-validator decorators
- [ ] Implement custom validators
- [ ] Add validation error messages

#### Frontend Validation with Zod
- [ ] Install Zod package
- [ ] Create validation schemas for all forms
- [ ] Integrate Zod with React Hook Form
- [ ] Add custom validation messages

#### Form Components
- [ ] Add inline error display
- [ ] Add field-level validation
- [ ] Add form-level validation
- [ ] Add async validation (email exists, etc.)
- [ ] Add cross-field validation

#### Validation for Each Module
- [ ] Add validation to Production forms
- [ ] Add validation to Sales forms
- [ ] Add validation to Procurement forms
- [ ] Add validation to Finance forms
- [ ] Add validation to HR forms
- [ ] Add validation to Inventory forms
- [ ] Add validation to all remaining forms

**Acceptance Criteria**:
- All forms have client-side validation
- Server-side validation enforced
- Inline error messages displayed

---

### Issue #16: Expand Environment Configuration

**Labels**: `medium`, `configuration`, `infrastructure`

**Description**:
Only 15 environment variable usages in backend. Missing feature flags, rate limiting, and CORS configuration. `synchronize: true` in database config is risky.

**Tasks**:

#### Expand Environment Variables
- [ ] Add feature flag variables
- [ ] Add rate limiting configuration
- [ ] Add CORS whitelist configuration
- [ ] Add session configuration
- [ ] Add API timeout values
- [ ] Add logging level configuration
- [ ] Add cache TTL configuration

#### Create Configuration Service
- [ ] Create centralized config module
- [ ] Implement typed configuration
- [ ] Add configuration validation
- [ ] Add configuration documentation

#### Security Configurations
- [ ] Set `synchronize: false` for all environments
- [ ] Configure strong JWT secrets
- [ ] Add secret rotation support
- [ ] Configure rate limiting
- [ ] Add IP whitelist support

#### Environment Files
- [ ] Update `.env.example` with all variables
- [ ] Create `.env.development` template
- [ ] Create `.env.production` template
- [ ] Document all environment variables

**Acceptance Criteria**:
- Centralized configuration service
- All configurations documented
- Security settings hardened

---

## Low Priority Issues

### Issue #17: Complete Documentation

**Labels**: `low`, `documentation`

**Description**:
1,584 Swagger decorators exist but missing example payloads, ADRs, deployment runbook, and database schema documentation.

**Tasks**:

#### API Documentation
- [ ] Add example request bodies to Swagger
- [ ] Add example response bodies to Swagger
- [ ] Document error responses
- [ ] Add authentication documentation
- [ ] Document rate limiting

#### Architecture Documentation
- [ ] Create Architecture Decision Records (ADRs)
- [ ] Document system architecture diagram
- [ ] Document database schema
- [ ] Document API design patterns
- [ ] Document module dependencies

#### Development Documentation
- [ ] Create detailed setup guide
- [ ] Document coding standards
- [ ] Create contribution guidelines
- [ ] Document Git workflow
- [ ] Create troubleshooting guide

#### Deployment Documentation
- [ ] Create deployment runbook
- [ ] Document environment setup
- [ ] Document rollback procedures
- [ ] Create monitoring guide
- [ ] Document backup procedures

#### Code Documentation
- [ ] Add JSDoc to all public methods
- [ ] Document complex business logic
- [ ] Add inline comments for algorithms
- [ ] Create API changelog

**Acceptance Criteria**:
- Complete API documentation with examples
- ADRs for all major decisions
- Deployment runbook complete

---

## Summary

| Priority | Issue Count | Total Tasks |
|----------|-------------|-------------|
| Critical | 4 | ~130 |
| High | 6 | ~150 |
| Medium | 6 | ~100 |
| Low | 1 | ~20 |
| **Total** | **17** | **~400** |

---

## Labels to Create

- `critical` - Critical priority issues
- `high` - High priority issues
- `medium` - Medium priority issues
- `low` - Low priority issues
- `security` - Security related
- `performance` - Performance related
- `testing` - Testing related
- `database` - Database related
- `frontend` - Frontend related
- `backend` - Backend related
- `infrastructure` - Infrastructure/DevOps
- `documentation` - Documentation related
- `code-quality` - Code quality improvements
- `accessibility` - Accessibility (A11Y)
- `feature` - New feature implementation
- `workflow` - Workflow module related

---

## Milestones

### Milestone 1: Security & Testing (Weeks 1-4)
- Issues: #1, #2, #4

### Milestone 2: Performance (Weeks 5-8)
- Issues: #3, #7

### Milestone 3: Feature Completion (Weeks 9-12)
- Issues: #5, #6, #8

### Milestone 4: Quality & DevOps (Weeks 13-16)
- Issues: #9, #10, #14

### Milestone 5: Polish & Documentation (Weeks 17-20)
- Issues: #11, #12, #13, #15, #16, #17
