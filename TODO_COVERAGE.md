# ManufacturingOS - Master Todo List for 100% Coverage

**Created:** 2026-01-26
**Target:** Close all gaps in Seeds, APIs, and Frontend-Backend Wiring

---

## Progress Tracker

| Area | Current | Target | Items | Progress |
|------|---------|--------|-------|----------|
| Seeder Services | 7% | 100% | 42 | [ ] 0/42 |
| Frontend Services | 46% | 100% | 25 | [ ] 0/25 |
| Frontend-Backend Wiring | 5% | 100% | 33 modules | [ ] 0/33 |

---

## Phase 1: Critical Foundation (Priority: CRITICAL)

### 1.1 Core Module Seeders

```
Location: b3-erp/backend/src/modules/core/services/
```

- [ ] **Create `uom-seeder.service.ts`**
  - [ ] Define UOM seed data (PCS, KG, MTR, LTR, SQM, BOX, SET, etc.)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to CoreModule providers
  - [ ] Test seeder execution

- [ ] **Create `category-seeder.service.ts`**
  - [ ] Define Category seed data (RM, FG, WIP, SPARE, CONS, SVC)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to CoreModule providers
  - [ ] Test seeder execution

- [ ] **Create `item-seeder.service.ts`**
  - [ ] Define demo Item seed data (10-20 items across categories)
  - [ ] Link to UOM and Category
  - [ ] Implement OnModuleInit hook
  - [ ] Add to CoreModule providers
  - [ ] Test seeder execution

- [ ] **Create `customer-seeder.service.ts`**
  - [ ] Define demo Customer seed data (5-10 customers)
  - [ ] Include contact details, payment terms
  - [ ] Implement OnModuleInit hook
  - [ ] Add to CoreModule providers
  - [ ] Test seeder execution

- [ ] **Create `vendor-seeder.service.ts`**
  - [ ] Define demo Vendor seed data (5-10 vendors)
  - [ ] Include contact details, payment terms, ratings
  - [ ] Implement OnModuleInit hook
  - [ ] Add to CoreModule providers
  - [ ] Test seeder execution

### 1.2 IT-Admin Module Seeders

```
Location: b3-erp/backend/src/modules/it-admin/services/
```

- [ ] **Create `role-seeder.service.ts`**
  - [ ] Define Role seed data (SUPER_ADMIN, ADMIN, MANAGER, SUPERVISOR, EXECUTIVE, OPERATOR, VIEWER)
  - [ ] Include role hierarchy levels
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ItAdminModule providers
  - [ ] Test seeder execution

- [ ] **Create `permission-seeder.service.ts`**
  - [ ] Define Permission seed data for ALL modules
  - [ ] Include VIEW, CREATE, EDIT, DELETE, APPROVE per module
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ItAdminModule providers
  - [ ] Test seeder execution

- [ ] **Create `role-permission-seeder.service.ts`**
  - [ ] Map default permissions to each role
  - [ ] Depends on: role-seeder, permission-seeder
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ItAdminModule providers
  - [ ] Test seeder execution

- [ ] **Create `admin-user-seeder.service.ts`**
  - [ ] Create default admin user
  - [ ] Hash password securely
  - [ ] Assign SUPER_ADMIN role
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ItAdminModule providers
  - [ ] Test seeder execution

- [ ] **Create `system-config-seeder.service.ts`**
  - [ ] Define default system configurations
  - [ ] Include company info, date formats, currency settings
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ItAdminModule providers
  - [ ] Test seeder execution

### 1.3 HR Module Seeders (Org Structure)

```
Location: b3-erp/backend/src/modules/hr/services/
```

- [ ] **Create `department-seeder.service.ts`**
  - [ ] Define Department seed data (10 departments)
  - [ ] Include parent-child hierarchy
  - [ ] Implement OnModuleInit hook
  - [ ] Add to HrModule providers
  - [ ] Test seeder execution

- [ ] **Create `designation-seeder.service.ts`**
  - [ ] Define Designation seed data (10+ designations)
  - [ ] Include hierarchy levels
  - [ ] Implement OnModuleInit hook
  - [ ] Add to HrModule providers
  - [ ] Test seeder execution

- [ ] **Create `shift-seeder.service.ts`**
  - [ ] Define Shift seed data (General, Morning, Evening, Night)
  - [ ] Include start/end times, break times
  - [ ] Implement OnModuleInit hook
  - [ ] Add to HrModule providers
  - [ ] Test seeder execution

- [ ] **Create `holiday-seeder.service.ts`**
  - [ ] Define Holiday seed data (national holidays for current year)
  - [ ] Include holiday types (public, optional, restricted)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to HrModule providers
  - [ ] Test seeder execution

- [ ] **Create `leave-type-seeder.service.ts`**
  - [ ] Define LeaveType seed data (CL, SL, EL, ML, PL, LWP, COMP)
  - [ ] Include quotas, carry forward rules
  - [ ] Implement OnModuleInit hook
  - [ ] Add to HrModule providers
  - [ ] Test seeder execution

- [ ] **Create `employee-seeder.service.ts`**
  - [ ] Define demo Employee seed data (10-20 employees)
  - [ ] Link to Department, Designation, Shift
  - [ ] Depends on: department-seeder, designation-seeder, shift-seeder
  - [ ] Implement OnModuleInit hook
  - [ ] Add to HrModule providers
  - [ ] Test seeder execution

### 1.4 Finance Module Seeders

```
Location: b3-erp/backend/src/modules/finance/services/
```

- [ ] **Update `chart-of-accounts-seeder.service.ts`**
  - [ ] Convert from manual trigger to OnModuleInit
  - [ ] Add idempotent check (skip if already seeded)
  - [ ] Test auto-seeding on module init

- [ ] **Create `financial-period-seeder.service.ts`**
  - [ ] Define FinancialPeriod seed data (current FY)
  - [ ] Include monthly periods with status
  - [ ] Implement OnModuleInit hook
  - [ ] Add to FinanceModule providers
  - [ ] Test seeder execution

- [ ] **Create `tax-config-seeder.service.ts`**
  - [ ] Define Tax seed data (GST 5%, 12%, 18%, 28%, IGST variants, TDS)
  - [ ] Include tax account mappings
  - [ ] Implement OnModuleInit hook
  - [ ] Add to FinanceModule providers
  - [ ] Test seeder execution

- [ ] **Create `cost-center-seeder.service.ts`**
  - [ ] Define CostCenter seed data (per department)
  - [ ] Include hierarchy
  - [ ] Implement OnModuleInit hook
  - [ ] Add to FinanceModule providers
  - [ ] Test seeder execution

---

## Phase 2: Operations Seeders (Priority: HIGH)

### 2.1 Inventory Module Seeders

```
Location: b3-erp/backend/src/modules/inventory/services/
```

- [ ] **Create `warehouse-seeder.service.ts`**
  - [ ] Define Warehouse seed data (6 warehouses)
  - [ ] Include types (STORAGE, PRODUCTION, QUALITY, REJECT)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to InventoryModule providers
  - [ ] Test seeder execution

- [ ] **Create `stock-location-seeder.service.ts`**
  - [ ] Define StockLocation seed data (locations per warehouse)
  - [ ] Include rack, bin, capacity
  - [ ] Depends on: warehouse-seeder
  - [ ] Implement OnModuleInit hook
  - [ ] Add to InventoryModule providers
  - [ ] Test seeder execution

- [ ] **Create `adjustment-reason-seeder.service.ts`**
  - [ ] Define AdjustmentReason seed data
  - [ ] Include types (DAMAGE, THEFT, EXPIRY, COUNT_ADJ, FOUND, QUALITY_REJ)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to InventoryModule providers
  - [ ] Test seeder execution

### 2.2 Production Module Seeders

```
Location: b3-erp/backend/src/modules/production/services/
```

- [ ] **Create `work-center-seeder.service.ts`**
  - [ ] Define WorkCenter seed data (6+ work centers)
  - [ ] Include capacity, cost per hour
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ProductionModule providers
  - [ ] Test seeder execution

- [ ] **Create `operation-seeder.service.ts`**
  - [ ] Define Operation seed data (10+ operations)
  - [ ] Link to WorkCenter
  - [ ] Include standard times
  - [ ] Depends on: work-center-seeder
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ProductionModule providers
  - [ ] Test seeder execution

- [ ] **Create `work-order-status-seeder.service.ts`**
  - [ ] Define WorkOrderStatus seed data
  - [ ] Include status flow sequence
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ProductionModule providers
  - [ ] Test seeder execution

### 2.3 Quality Module Seeders

```
Location: b3-erp/backend/src/modules/quality/services/
```

- [ ] **Create `qc-parameter-seeder.service.ts`**
  - [ ] Define QCParameter seed data (dimensional, visual, functional, material)
  - [ ] Include tolerances, UOMs
  - [ ] Implement OnModuleInit hook
  - [ ] Add to QualityModule providers
  - [ ] Test seeder execution

- [ ] **Create `qc-template-seeder.service.ts`**
  - [ ] Define QCTemplate seed data (incoming, in-process, final inspection)
  - [ ] Link to QCParameters
  - [ ] Depends on: qc-parameter-seeder
  - [ ] Implement OnModuleInit hook
  - [ ] Add to QualityModule providers
  - [ ] Test seeder execution

- [ ] **Create `defect-code-seeder.service.ts`**
  - [ ] Define DefectCode seed data
  - [ ] Include severity (CRITICAL, MAJOR, MINOR)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to QualityModule providers
  - [ ] Test seeder execution

### 2.4 CRM Module Seeders

```
Location: b3-erp/backend/src/modules/crm/services/
```

- [ ] **Create `lead-source-seeder.service.ts`**
  - [ ] Define LeadSource seed data (8 sources)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to CrmModule providers
  - [ ] Test seeder execution

- [ ] **Create `lead-status-seeder.service.ts`**
  - [ ] Define LeadStatus seed data (7 statuses)
  - [ ] Include colors, sequence
  - [ ] Implement OnModuleInit hook
  - [ ] Add to CrmModule providers
  - [ ] Test seeder execution

- [ ] **Create `interaction-type-seeder.service.ts`**
  - [ ] Define InteractionType seed data (Call, Email, Meeting, Visit, etc.)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to CrmModule providers
  - [ ] Test seeder execution

### 2.5 Sales Module Seeders

```
Location: b3-erp/backend/src/modules/sales/services/
```

- [ ] **Create `order-status-seeder.service.ts`**
  - [ ] Define OrderStatus seed data (10 statuses)
  - [ ] Include sequence, workflow triggers
  - [ ] Implement OnModuleInit hook
  - [ ] Add to SalesModule providers
  - [ ] Test seeder execution

- [ ] **Create `payment-terms-seeder.service.ts`**
  - [ ] Define PaymentTerms seed data (8 terms)
  - [ ] Include days, descriptions
  - [ ] Implement OnModuleInit hook
  - [ ] Add to SalesModule providers
  - [ ] Test seeder execution

- [ ] **Create `delivery-terms-seeder.service.ts`**
  - [ ] Define DeliveryTerms seed data (FOB, CIF, EXW, etc.)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to SalesModule providers
  - [ ] Test seeder execution

### 2.6 Procurement Module Seeders

```
Location: b3-erp/backend/src/modules/procurement/services/
```

- [ ] **Create `po-status-seeder.service.ts`**
  - [ ] Define POStatus seed data (10 statuses)
  - [ ] Include sequence, workflow triggers
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ProcurementModule providers
  - [ ] Test seeder execution

- [ ] **Create `approval-threshold-seeder.service.ts`**
  - [ ] Define ApprovalThreshold seed data (5 levels)
  - [ ] Include amount ranges, approver roles
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ProcurementModule providers
  - [ ] Test seeder execution

### 2.7 Logistics Module Seeders

```
Location: b3-erp/backend/src/modules/logistics/services/
```

- [ ] **Create `transport-company-seeder.service.ts`**
  - [ ] Define TransportCompany seed data (6 companies)
  - [ ] Include types (OWN, COURIER, FREIGHT)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to LogisticsModule providers
  - [ ] Test seeder execution

- [ ] **Create `vehicle-type-seeder.service.ts`**
  - [ ] Define VehicleType seed data (6 types)
  - [ ] Include capacities
  - [ ] Implement OnModuleInit hook
  - [ ] Add to LogisticsModule providers
  - [ ] Test seeder execution

- [ ] **Create `shipment-status-seeder.service.ts`**
  - [ ] Define ShipmentStatus seed data
  - [ ] Include sequence
  - [ ] Implement OnModuleInit hook
  - [ ] Add to LogisticsModule providers
  - [ ] Test seeder execution

### 2.8 After-Sales Module Seeders

```
Location: b3-erp/backend/src/modules/after-sales-service/services/
```

- [ ] **Create `service-type-seeder.service.ts`**
  - [ ] Define ServiceType seed data (7 types)
  - [ ] Include standard hours
  - [ ] Implement OnModuleInit hook
  - [ ] Add to AfterSalesModule providers
  - [ ] Test seeder execution

- [ ] **Create `warranty-type-seeder.service.ts`**
  - [ ] Define WarrantyType seed data (4 types)
  - [ ] Include durations, coverage
  - [ ] Implement OnModuleInit hook
  - [ ] Add to AfterSalesModule providers
  - [ ] Test seeder execution

### 2.9 Project Management Module Seeders

```
Location: b3-erp/backend/src/modules/project-management/services/
```

- [ ] **Create `project-status-seeder.service.ts`**
  - [ ] Define ProjectStatus seed data (6 statuses)
  - [ ] Include colors, sequence
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ProjectManagementModule providers
  - [ ] Test seeder execution

- [ ] **Create `project-type-seeder.service.ts`**
  - [ ] Define ProjectType seed data (5 types)
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ProjectManagementModule providers
  - [ ] Test seeder execution

### 2.10 Approvals Module Seeders

```
Location: b3-erp/backend/src/modules/approvals/services/
```

- [ ] **Create `approval-chain-seeder.service.ts`**
  - [ ] Define ApprovalChain templates per document type
  - [ ] Include levels, conditions
  - [ ] Implement OnModuleInit hook
  - [ ] Add to ApprovalsModule providers
  - [ ] Test seeder execution

---

## Phase 3: Frontend Services (Priority: HIGH)

### 3.1 Core Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `core.service.ts`**
  - [ ] Implement `getAllUOMs()` → GET `/core/uom`
  - [ ] Implement `getAllCategories()` → GET `/core/categories`
  - [ ] Implement `getAllItems()` → GET `/core/items`
  - [ ] Implement `getAllCustomers()` → GET `/core/customers`
  - [ ] Add mock data fallback for each method
  - [ ] Add TypeScript types
  - [ ] Export from services/index.ts

### 3.2 HR Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `employee.service.ts`**
  - [ ] Implement CRUD for employees → `/hr/employees`
  - [ ] Implement `getByDepartment()`, `getActive()`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `department.service.ts`**
  - [ ] Implement CRUD for departments → `/hr/departments`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `attendance.service.ts`**
  - [ ] Implement attendance endpoints → `/hr/attendance`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `leave.service.ts`**
  - [ ] Implement leave management → `/hr/leave-applications`, `/hr/leave-types`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `payroll.service.ts`**
  - [ ] Implement payroll endpoints → `/hr/payroll`, `/hr/salary-slips`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Update `skill.service.ts`**
  - [ ] Change `USE_MOCK_DATA` to environment variable
  - [ ] Test real API integration
  - [ ] Ensure mock fallback works

### 3.3 Finance Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `finance.service.ts`**
  - [ ] Implement dashboard endpoints
  - [ ] Implement chart of accounts → `/finance/chart-of-accounts`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `invoice.service.ts`**
  - [ ] Implement CRUD for invoices → `/finance/invoices`
  - [ ] Implement workflow actions (submit, approve, post)
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `payment.service.ts`**
  - [ ] Implement CRUD for payments → `/finance/payments`
  - [ ] Implement allocation
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `journal.service.ts`**
  - [ ] Implement CRUD for journal entries → `/finance/journal-entries`
  - [ ] Implement post, reverse actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `financial-reports.service.ts`**
  - [ ] Implement report endpoints → `/finance/balance-sheet`, `/finance/profit-loss`, etc.
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.4 Sales Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `sales-order.service.ts`**
  - [ ] Implement CRUD for orders → `/api/v1/sales/orders`
  - [ ] Implement workflow actions
  - [ ] Implement pricing endpoints
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Update `rfp.service.ts`**
  - [ ] Change `USE_MOCK_DATA` to environment variable
  - [ ] Test real API integration
  - [ ] Ensure mock fallback works

- [ ] **Create `quotation.service.ts`**
  - [ ] Implement quotation endpoints
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.5 CRM Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `lead.service.ts`**
  - [ ] Implement CRUD for leads → `/crm/leads`
  - [ ] Implement convert to customer
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `contact.service.ts`**
  - [ ] Implement CRUD for contacts
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `opportunity.service.ts`**
  - [ ] Implement CRUD for opportunities
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `campaign.service.ts`**
  - [ ] Implement campaign endpoints
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.6 Production Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `work-order.service.ts`**
  - [ ] Implement CRUD for work orders → `/production/work-orders`
  - [ ] Implement workflow actions (release, complete)
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `bom.service.ts`**
  - [ ] Implement CRUD for BOMs → `/production/bom`
  - [ ] Implement BOM explosion, cost rollup
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `work-center.service.ts`**
  - [ ] Implement CRUD for work centers → `/production/work-centers`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `shop-floor.service.ts`**
  - [ ] Implement shop floor endpoints → `/production/shop-floor-control`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.7 Inventory Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `warehouse.service.ts`**
  - [ ] Implement CRUD for warehouses → `/inventory/warehouses`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `stock-entry.service.ts`**
  - [ ] Implement CRUD for stock entries → `/inventory/stock-entries`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `stock-transfer.service.ts`**
  - [ ] Implement CRUD for transfers → `/inventory/stock-transfers`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Update `InventoryService.ts`**
  - [ ] Add missing endpoints
  - [ ] Ensure mock fallback pattern

### 3.8 Procurement Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `purchase-order.service.ts`**
  - [ ] Implement CRUD for POs → `/procurement/purchase-orders`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `purchase-requisition.service.ts`**
  - [ ] Implement CRUD for PRs → `/procurement/purchase-requisitions`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `goods-receipt.service.ts`**
  - [ ] Implement CRUD for GRs → `/procurement/goods-receipts`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `rfq.service.ts`** (Procurement)
  - [ ] Implement CRUD for RFQs → `/procurement/rfqs`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.9 Quality Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `inspection.service.ts`**
  - [ ] Implement CRUD for inspections → `/quality/inspection`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `ncr.service.ts`**
  - [ ] Implement CRUD for NCRs → `/quality/ncr`, `/quality/non-conformance`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `capa.service.ts`**
  - [ ] Implement CRUD for CAPAs → `/quality/capa`
  - [ ] Implement workflow actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `qc-template.service.ts`**
  - [ ] Implement CRUD for templates → `/quality/qc-template`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.10 Logistics Module Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `shipment.service.ts`**
  - [ ] Implement CRUD for shipments → `/logistics/shipments`
  - [ ] Implement workflow actions (dispatch, deliver)
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `delivery-note.service.ts`**
  - [ ] Implement CRUD for delivery notes → `/logistics/delivery-notes`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `fleet.service.ts`**
  - [ ] Implement vehicle/driver endpoints → `/logistics/vehicles`, `/logistics/drivers`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `route.service.ts`**
  - [ ] Implement route endpoints → `/logistics/routes`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.11 Project Management Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Update `ProjectManagementService.ts`**
  - [ ] Wire `getResources()` to real API
  - [ ] Wire `getBudgets()` to real API
  - [ ] Wire `getClaims()` to real API
  - [ ] Wire `getSpareRequests()` to real API
  - [ ] Remove simulated delays
  - [ ] Ensure mock fallback works

- [ ] **Update `projectFinancials.ts`**
  - [ ] Uncomment real API calls
  - [ ] Test API integration
  - [ ] Ensure mock fallback works

### 3.12 Workflow & Admin Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `workflow.service.ts`**
  - [ ] Implement workflow template endpoints → `/api/workflow/templates`
  - [ ] Implement workflow instance endpoints → `/workflow-repository/instances`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `user-task.service.ts`**
  - [ ] Implement task inbox → `/api/workflow/tasks/inbox/:userId`
  - [ ] Implement task actions
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.13 After-Sales Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `service-request.service.ts`**
  - [ ] Implement CRUD → `/after-sales/service-requests`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `warranty.service.ts`**
  - [ ] Implement CRUD → `/after-sales/warranties`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `service-contract.service.ts`**
  - [ ] Implement CRUD → `/after-sales/service-contracts`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

### 3.14 IT-Admin Services

```
Location: b3-erp/frontend/src/services/
```

- [ ] **Create `user-management.service.ts`**
  - [ ] Implement CRUD for users → `/it-admin/users`
  - [ ] Implement password change
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `role.service.ts`**
  - [ ] Implement CRUD for roles → `/it-admin/roles`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `permission.service.ts`**
  - [ ] Implement permission endpoints → `/it-admin/permissions`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

- [ ] **Create `audit-log.service.ts`**
  - [ ] Implement audit log endpoints → `/it-admin/audit-logs`
  - [ ] Add mock data fallback
  - [ ] Add TypeScript types

---

## Phase 4: Frontend-Backend Wiring (Priority: HIGH)

### 4.1 Dashboard Module Wiring

- [ ] Wire main dashboard to real statistics endpoints
- [ ] Wire inventory dashboard to inventory service
- [ ] Wire production dashboard to production service

### 4.2 CRM Module Wiring

- [ ] **Wire `/crm/leads/*` pages**
  - [ ] Import and use LeadService
  - [ ] Replace mock data with service calls
  - [ ] Add loading states
  - [ ] Add error handling

- [ ] **Wire `/crm/contacts/*` pages**
  - [ ] Import and use ContactService
  - [ ] Replace mock data with service calls
  - [ ] Add loading states
  - [ ] Add error handling

- [ ] **Wire `/crm/opportunities/*` pages**
  - [ ] Import and use OpportunityService
  - [ ] Replace mock data with service calls
  - [ ] Add loading states
  - [ ] Add error handling

- [ ] **Wire `/crm/campaigns/*` pages**
  - [ ] Import and use CampaignService
  - [ ] Replace mock data with service calls
  - [ ] Add loading states
  - [ ] Add error handling

- [ ] **Wire `/crm` dashboard**
  - [ ] Create CRM dashboard aggregation
  - [ ] Wire to statistics endpoints

### 4.3 Sales Module Wiring

- [ ] **Wire `/sales/orders/*` pages**
  - [ ] Import and use SalesOrderService
  - [ ] Replace mock data with service calls
  - [ ] Add loading states
  - [ ] Add error handling

- [ ] **Wire `/sales/quotations/*` pages**
  - [ ] Import and use QuotationService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/sales/rfp/*` pages**
  - [ ] Update rfp.service.ts USE_MOCK_DATA flag
  - [ ] Test real API integration

- [ ] **Wire `/sales` dashboard**
  - [ ] Wire to order statistics
  - [ ] Wire to revenue analytics

### 4.4 Finance Module Wiring

- [ ] **Wire `/finance/invoices/*` pages**
  - [ ] Import and use InvoiceService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/finance/payments/*` pages**
  - [ ] Import and use PaymentService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/finance/journal/*` pages**
  - [ ] Import and use JournalService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/finance/reports/*` pages**
  - [ ] Import and use FinancialReportsService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/finance` dashboard**
  - [ ] Wire to finance aggregation APIs
  - [ ] Wire to cash position, receivables, payables

### 4.5 Production Module Wiring

- [ ] **Wire `/production/work-orders/*` pages**
  - [ ] Import and use WorkOrderService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/production/bom/*` pages**
  - [ ] Import and use BOMService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/production/scheduling/*` pages**
  - [ ] Wire to scheduling APIs

- [ ] **Wire `/production/shopfloor/*` pages**
  - [ ] Import and use ShopFloorService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/production/settings/*` pages**
  - [ ] Wire work centers, operations, routing

### 4.6 Inventory Module Wiring

- [ ] **Wire `/inventory/stock/*` pages**
  - [ ] Extend existing InventoryService usage
  - [ ] Wire additional endpoints

- [ ] **Wire `/inventory/warehouses/*` pages**
  - [ ] Import and use WarehouseService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/inventory/transfers/*` pages**
  - [ ] Import and use StockTransferService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/inventory/adjustments/*` pages**
  - [ ] Wire to adjustment APIs

### 4.7 Procurement Module Wiring

- [ ] **Wire `/procurement/purchase-orders/*` pages**
  - [ ] Import and use PurchaseOrderService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/procurement/requisitions/*` pages**
  - [ ] Import and use PurchaseRequisitionService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/procurement/rfq/*` pages**
  - [ ] Import and use RFQService (Procurement)
  - [ ] Replace mock data with service calls

- [ ] **Wire `/procurement/goods-receipt/*` pages**
  - [ ] Import and use GoodsReceiptService
  - [ ] Replace mock data with service calls

### 4.8 Quality Module Wiring

- [ ] **Wire `/quality/inspections/*` pages**
  - [ ] Import and use InspectionService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/quality/ncr/*` pages**
  - [ ] Import and use NCRService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/quality/capa/*` pages**
  - [ ] Import and use CAPAService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/quality/audits/*` pages**
  - [ ] Wire to audit APIs

### 4.9 Logistics Module Wiring

- [ ] **Wire `/logistics/shipments/*` pages**
  - [ ] Import and use ShipmentService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/logistics/delivery/*` pages**
  - [ ] Import and use DeliveryNoteService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/logistics/fleet/*` pages**
  - [ ] Import and use FleetService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/logistics/tracking/*` pages**
  - [ ] Wire to tracking APIs

### 4.10 HR Module Wiring

- [ ] **Wire `/hr/employees/*` pages**
  - [ ] Import and use EmployeeService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/hr/departments/*` pages**
  - [ ] Import and use DepartmentService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/hr/attendance/*` pages**
  - [ ] Import and use AttendanceService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/hr/leave/*` pages**
  - [ ] Import and use LeaveService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/hr/payroll/*` pages**
  - [ ] Import and use PayrollService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/hr/skills/*` pages**
  - [ ] Update skill.service.ts mock flag
  - [ ] Test real API integration

### 4.11 Project Management Wiring

- [ ] **Wire `/project-management/*` pages**
  - [ ] Update ProjectManagementService
  - [ ] Remove mock data dependencies
  - [ ] Wire all remaining endpoints

- [ ] **Wire project financials**
  - [ ] Uncomment real API calls in projectFinancials.ts
  - [ ] Test integration

### 4.12 Admin/Workflow Wiring

- [ ] **Wire `/admin/workflows/*` pages**
  - [ ] Import and use WorkflowService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/admin/workflow-overview` page**
  - [ ] Wire to workflow analytics

- [ ] **Wire `/admin/sla-analytics` page**
  - [ ] Wire to SLA metrics

### 4.13 Settings/IT-Admin Wiring

- [ ] **Wire `/settings/users/*` pages**
  - [ ] Import and use UserManagementService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/settings/roles/*` pages**
  - [ ] Import and use RoleService
  - [ ] Replace mock data with service calls

- [ ] **Wire `/admin/audit-logs` page**
  - [ ] Import and use AuditLogService
  - [ ] Replace mock data with service calls

### 4.14 After-Sales Wiring

- [ ] **Wire `/after-sales/*` pages**
  - [ ] Import and use AfterSales services
  - [ ] Replace mock data with service calls

- [ ] **Wire `/service/*` pages**
  - [ ] Wire service requests, contracts, warranties

### 4.15 Common Masters Wiring

- [ ] **Wire `/common-masters/uom` page**
  - [ ] Use CoreService.getAllUOMs()
  - [ ] Replace mock data

- [ ] **Wire `/common-masters/categories` page**
  - [ ] Use CoreService.getAllCategories()
  - [ ] Replace mock data

- [ ] **Wire `/common-masters/skill-master` page**
  - [ ] Already has service, update mock flag

---

## Phase 5: Testing & Validation (Priority: HIGH)

### 5.1 Seeder Testing

- [ ] Test all seeders run on fresh database
- [ ] Test seeders are idempotent (safe to run multiple times)
- [ ] Test seeder dependency order
- [ ] Document seeder execution order

### 5.2 API Integration Testing

- [ ] Test all CRUD operations for each module
- [ ] Test workflow state transitions
- [ ] Test cross-module integrations
- [ ] Test error handling and fallbacks

### 5.3 Frontend Integration Testing

- [ ] Test all pages load without errors
- [ ] Test mock fallback works when API unavailable
- [ ] Test CRUD operations from UI
- [ ] Test form validations

### 5.4 End-to-End Flow Testing

- [ ] Test RFP → Sales Order → Work Order flow
- [ ] Test PR → PO → GR → Stock Entry flow
- [ ] Test Invoice → Payment flow
- [ ] Test Quality Inspection → NCR → CAPA flow

---

## Phase 6: Documentation & Cleanup (Priority: MEDIUM)

### 6.1 Update Documentation

- [ ] Update CLAUDE.md with new services
- [ ] Document API endpoints per module
- [ ] Document seeder data
- [ ] Create developer setup guide

### 6.2 Code Cleanup

- [ ] Remove unused mock data from pages
- [ ] Standardize service patterns
- [ ] Add TypeScript strict mode compliance
- [ ] Add JSDoc comments to services

### 6.3 Environment Configuration

- [ ] Add `NEXT_PUBLIC_USE_MOCK_DATA` env variable
- [ ] Add `NEXT_PUBLIC_API_URL` configuration
- [ ] Document environment setup

---

## Summary Checklist

### Seeders (42 items)
- [ ] Core: 5 seeders
- [ ] IT-Admin: 5 seeders
- [ ] HR: 6 seeders (1 exists)
- [ ] Finance: 4 seeders (1 exists, needs update)
- [ ] Inventory: 3 seeders
- [ ] Production: 3 seeders
- [ ] Quality: 3 seeders
- [ ] CRM: 3 seeders
- [ ] Sales: 3 seeders
- [ ] Procurement: 2 seeders
- [ ] Logistics: 3 seeders
- [ ] After-Sales: 2 seeders
- [ ] Project Management: 2 seeders
- [ ] Approvals: 1 seeder

### Frontend Services (25 items)
- [ ] Core: 1 service
- [ ] HR: 6 services (1 exists, needs update)
- [ ] Finance: 5 services
- [ ] Sales: 3 services (1 exists, needs update)
- [ ] CRM: 4 services (1 exists)
- [ ] Production: 4 services (1 exists)
- [ ] Inventory: 3 services (1 exists)
- [ ] Procurement: 4 services (1 exists)
- [ ] Quality: 4 services
- [ ] Logistics: 4 services (1 exists)
- [ ] Project: 2 updates needed
- [ ] Workflow: 2 services (1 exists)
- [ ] After-Sales: 3 services
- [ ] IT-Admin: 4 services

### Frontend Wiring (33 module areas)
- [ ] Dashboard: 3 areas
- [ ] CRM: 5 areas
- [ ] Sales: 4 areas
- [ ] Finance: 5 areas
- [ ] Production: 5 areas
- [ ] Inventory: 4 areas
- [ ] Procurement: 4 areas
- [ ] Quality: 4 areas
- [ ] Logistics: 4 areas
- [ ] HR: 6 areas
- [ ] Project: 2 areas
- [ ] Admin/Workflow: 3 areas
- [ ] Settings: 3 areas
- [ ] After-Sales: 2 areas
- [ ] Common Masters: 3 areas

---

## Estimated Effort

| Phase | Items | Est. Days |
|-------|-------|-----------|
| Phase 1: Critical Foundation | 20 seeders | 5 days |
| Phase 2: Operations Seeders | 22 seeders | 4 days |
| Phase 3: Frontend Services | 25 services | 8 days |
| Phase 4: Frontend Wiring | 33 module areas | 10 days |
| Phase 5: Testing | All | 5 days |
| Phase 6: Documentation | All | 2 days |
| **Total** | **~180 items** | **~34 days** |

---

*Last Updated: 2026-01-26*
