# ManufacturingOS - Comprehensive Gap Analysis

**Analysis Date:** 2026-01-26
**Assessed By:** Backend Engineer, Solution Architect, QA Engineer, Workflow Manager
**Scope:** Seeds, APIs, Frontend-Backend Wiring

---

## Executive Summary

| Category | Total Items | Complete | Gaps | Coverage |
|----------|-------------|----------|------|----------|
| **Backend Modules** | 23 | 23 | 0 | 100% |
| **Seeder Services** | 23 needed | 3 | **20** | 13% |
| **API Endpoints** | 500+ | 500+ | Varies | ~85% |
| **Frontend Services** | 14 | 8 | **6** | 57% |
| **Frontend-Backend Wiring** | ~33 modules | ~8 | **~25** | 24% |

**Critical Finding:** The system has comprehensive backend APIs but **95% of frontend pages operate on mock data only**.

---

## Table of Contents

1. [Core Module](#1-core-module)
2. [HR Module](#2-hr-module)
3. [Finance Module](#3-finance-module)
4. [Sales Module](#4-sales-module)
5. [CRM Module](#5-crm-module)
6. [Production Module](#6-production-module)
7. [Inventory Module](#7-inventory-module)
8. [Procurement Module](#8-procurement-module)
9. [Quality Module](#9-quality-module)
10. [Logistics Module](#10-logistics-module)
11. [Project Management Module](#11-project-management-module)
12. [Workflow Module](#12-workflow-module)
13. [After-Sales Service Module](#13-after-sales-service-module)
14. [IT-Admin Module](#14-it-admin-module)
15. [Accounts Module](#15-accounts-module)
16. [Approvals Module](#16-approvals-module)
17. [CMS Module](#17-cms-module)
18. [Notifications Module](#18-notifications-module)
19. [Proposals Module](#19-proposals-module)
20. [Estimation Module](#20-estimation-module)
21. [Reports Module](#21-reports-module)
22. [Support Module](#22-support-module)
23. [Cross-Module Integration Gaps](#23-cross-module-integration-gaps)

---

## 1. Core Module

### Overview
**Path:** `b3-erp/backend/src/modules/core/`
**Entities:** Category, Customer, Item, UOM, Vendor
**Frontend Pages:** Common Masters

### 1.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| UnitOfMeasure | NO | **CRITICAL** | Required for all inventory/production |
| Category | NO | **CRITICAL** | Required for item classification |
| Customer | NO | HIGH | Required for sales flow |
| Vendor | NO | HIGH | Required for procurement flow |
| Item | NO | **CRITICAL** | Required for all operations |

**Required Seed Data:**

```typescript
// UOM Seeds Required
const UOM_SEEDS = [
  { code: 'PCS', name: 'Pieces', baseUnit: true },
  { code: 'KG', name: 'Kilograms', baseUnit: true },
  { code: 'MTR', name: 'Meters', baseUnit: true },
  { code: 'LTR', name: 'Liters', baseUnit: true },
  { code: 'SQM', name: 'Square Meters', baseUnit: false, conversionFactor: 1 },
  { code: 'BOX', name: 'Box', baseUnit: false, conversionFactor: 1 },
  { code: 'SET', name: 'Set', baseUnit: false, conversionFactor: 1 },
];

// Category Seeds Required
const CATEGORY_SEEDS = [
  { code: 'RM', name: 'Raw Materials', type: 'INVENTORY' },
  { code: 'FG', name: 'Finished Goods', type: 'INVENTORY' },
  { code: 'WIP', name: 'Work in Progress', type: 'INVENTORY' },
  { code: 'SPARE', name: 'Spare Parts', type: 'INVENTORY' },
  { code: 'CONS', name: 'Consumables', type: 'INVENTORY' },
  { code: 'SVC', name: 'Services', type: 'SERVICE' },
];
```

### 1.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /core/categories` | YES | NO | **Missing service** |
| `GET /core/customers` | YES | NO | **Missing service** |
| `GET /core/items` | YES | NO | **Missing service** |
| `GET /core/uom` | YES | NO | **Missing service** |
| `GET /core/vendors` | YES | VendorService | Wired |

### 1.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/common-masters/uom` | NO | YES | Wire to `/core/uom` |
| `/common-masters/categories` | NO | YES | Wire to `/core/categories` |
| `/common-masters/items` | NO | YES | Wire to `/core/items` |
| `/common-masters/customers` | NO | YES | Wire to `/core/customers` |
| `/common-masters/vendors` | PARTIAL | YES | Complete wiring |

---

## 2. HR Module

### Overview
**Path:** `b3-erp/backend/src/modules/hr/`
**Entities:** 18 entities
**Frontend Pages:** 364 pages (HR directory + modules)
**Existing Seeder:** skill-seeder.service.ts

### 2.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| ProficiencyLevel | YES | - | Complete |
| SkillCategory | YES | - | Complete |
| Skill | YES | - | Complete |
| SkillGap | YES | - | Complete |
| Department | NO | **CRITICAL** | Required for org structure |
| Designation | NO | **CRITICAL** | Required for employee setup |
| Shift | NO | HIGH | Required for attendance |
| Holiday | NO | HIGH | Required for leave calculation |
| LeaveType | NO | HIGH | Required for leave management |
| Employee | NO | HIGH | Demo data needed |
| SalaryStructure | NO | MEDIUM | Required for payroll |

**Required Seed Data:**

```typescript
// Department Seeds Required
const DEPARTMENT_SEEDS = [
  { code: 'MGMT', name: 'Management', parentId: null },
  { code: 'HR', name: 'Human Resources', parentId: null },
  { code: 'FIN', name: 'Finance & Accounts', parentId: null },
  { code: 'SALES', name: 'Sales & Marketing', parentId: null },
  { code: 'PROD', name: 'Production', parentId: null },
  { code: 'QC', name: 'Quality Control', parentId: null },
  { code: 'STORE', name: 'Stores & Inventory', parentId: null },
  { code: 'MAINT', name: 'Maintenance', parentId: null },
  { code: 'IT', name: 'Information Technology', parentId: null },
  { code: 'ADMIN', name: 'Administration', parentId: null },
];

// Designation Seeds Required
const DESIGNATION_SEEDS = [
  { code: 'CEO', name: 'Chief Executive Officer', level: 1 },
  { code: 'CFO', name: 'Chief Financial Officer', level: 2 },
  { code: 'COO', name: 'Chief Operating Officer', level: 2 },
  { code: 'GM', name: 'General Manager', level: 3 },
  { code: 'MGR', name: 'Manager', level: 4 },
  { code: 'ASST_MGR', name: 'Assistant Manager', level: 5 },
  { code: 'SR_EXEC', name: 'Senior Executive', level: 6 },
  { code: 'EXEC', name: 'Executive', level: 7 },
  { code: 'JR_EXEC', name: 'Junior Executive', level: 8 },
  { code: 'TRAINEE', name: 'Trainee', level: 9 },
];

// LeaveType Seeds Required
const LEAVE_TYPE_SEEDS = [
  { code: 'CL', name: 'Casual Leave', annualQuota: 12, carryForward: false },
  { code: 'SL', name: 'Sick Leave', annualQuota: 12, carryForward: true },
  { code: 'EL', name: 'Earned Leave', annualQuota: 15, carryForward: true },
  { code: 'ML', name: 'Maternity Leave', annualQuota: 180, carryForward: false },
  { code: 'PL', name: 'Paternity Leave', annualQuota: 15, carryForward: false },
  { code: 'LWP', name: 'Leave Without Pay', annualQuota: 0, carryForward: false },
  { code: 'COMP', name: 'Compensatory Off', annualQuota: 0, carryForward: false },
];
```

### 2.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /hr/skills` | YES | skill.service.ts | **Mock only** (USE_MOCK_DATA=true) |
| `GET /hr/skill-categories` | YES | skill.service.ts | **Mock only** |
| `GET /hr/employees` | YES | NO | **Missing service** |
| `GET /hr/departments` | YES | NO | **Missing service** |
| `GET /hr/designations` | YES | NO | **Missing service** |
| `GET /hr/attendance` | YES | NO | **Missing service** |
| `GET /hr/leave-applications` | YES | NO | **Missing service** |
| `GET /hr/payroll` | YES | NO | **Missing service** |

### 2.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/hr/employees` | NO | YES | Create EmployeeService, wire API |
| `/hr/departments` | NO | YES | Create DepartmentService |
| `/hr/attendance` | NO | YES | Create AttendanceService |
| `/hr/leave/*` | NO | YES | Create LeaveService |
| `/hr/payroll/*` | NO | YES | Create PayrollService |
| `/hr/skills/*` | NO | YES | Set USE_MOCK_DATA=false |
| `/hr/training/*` | NO | YES | Create TrainingService |
| `/hr/performance/*` | NO | YES | Create PerformanceService |

---

## 3. Finance Module

### Overview
**Path:** `b3-erp/backend/src/modules/finance/`
**Entities:** 13 entities
**Frontend Pages:** 117 pages
**Existing Seeder:** chart-of-accounts-seeder.service.ts (manual trigger)

### 3.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| ChartOfAccounts | YES (manual) | - | Needs auto-run on init |
| FinancialPeriod | NO | **CRITICAL** | Required for all transactions |
| CostCenter | NO | HIGH | Required for cost accounting |
| TaxConfig | NO | HIGH | Required for invoicing |
| BankAccount | NO | MEDIUM | Required for payments |
| Budget | NO | MEDIUM | For budget management |

**Required Seed Data:**

```typescript
// FinancialPeriod Seeds Required
const FINANCIAL_PERIOD_SEEDS = [
  {
    code: 'FY2025-26',
    name: 'Financial Year 2025-26',
    startDate: '2025-04-01',
    endDate: '2026-03-31',
    status: 'ACTIVE',
    periods: [
      { month: 4, year: 2025, status: 'CLOSED' },
      { month: 5, year: 2025, status: 'CLOSED' },
      // ... months 6-12, 1-3
      { month: 1, year: 2026, status: 'OPEN' },
    ]
  }
];

// TaxConfig Seeds Required
const TAX_CONFIG_SEEDS = [
  { code: 'GST_5', name: 'GST 5%', rate: 5, type: 'GST' },
  { code: 'GST_12', name: 'GST 12%', rate: 12, type: 'GST' },
  { code: 'GST_18', name: 'GST 18%', rate: 18, type: 'GST' },
  { code: 'GST_28', name: 'GST 28%', rate: 28, type: 'GST' },
  { code: 'IGST_5', name: 'IGST 5%', rate: 5, type: 'IGST' },
  { code: 'IGST_12', name: 'IGST 12%', rate: 12, type: 'IGST' },
  { code: 'IGST_18', name: 'IGST 18%', rate: 18, type: 'IGST' },
  { code: 'IGST_28', name: 'IGST 28%', rate: 28, type: 'IGST' },
  { code: 'TDS_194C', name: 'TDS 194C', rate: 2, type: 'TDS' },
  { code: 'TDS_194J', name: 'TDS 194J', rate: 10, type: 'TDS' },
];
```

### 3.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /finance/invoices` | YES | NO | **Missing service** |
| `GET /finance/payments` | YES | NO | **Missing service** |
| `GET /finance/journal-entries` | YES | NO | **Missing service** |
| `GET /finance/chart-of-accounts` | YES | NO | **Missing service** |
| `GET /finance/balance-sheet` | YES | NO | **Missing service** |
| `GET /finance/profit-loss` | YES | NO | **Missing service** |

### 3.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/finance` (dashboard) | NO | YES (extensive) | Create FinanceService |
| `/finance/invoices/*` | NO | YES | Create InvoiceService |
| `/finance/payments/*` | NO | YES | Create PaymentService |
| `/finance/journal/*` | NO | YES | Create JournalService |
| `/finance/reports/*` | NO | YES | Create ReportService |
| `/finance/receivables/*` | NO | YES | Wire to accounts-receivable |
| `/finance/payables/*` | NO | YES | Wire to accounts-payable |

---

## 4. Sales Module

### Overview
**Path:** `b3-erp/backend/src/modules/sales/`
**Entities:** Order, RFP
**Frontend Pages:** 54 pages

### 4.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| OrderStatus | NO | HIGH | Required for workflow |
| PaymentTerms | NO | HIGH | Required for orders |
| DeliveryTerms | NO | MEDIUM | Required for logistics |
| PriceList | NO | MEDIUM | Required for quotations |

**Required Seed Data:**

```typescript
// OrderStatus Seeds Required
const ORDER_STATUS_SEEDS = [
  { code: 'DRAFT', name: 'Draft', sequence: 1 },
  { code: 'SUBMITTED', name: 'Submitted', sequence: 2 },
  { code: 'APPROVED', name: 'Approved', sequence: 3 },
  { code: 'IN_PRODUCTION', name: 'In Production', sequence: 4 },
  { code: 'READY_TO_SHIP', name: 'Ready to Ship', sequence: 5 },
  { code: 'SHIPPED', name: 'Shipped', sequence: 6 },
  { code: 'DELIVERED', name: 'Delivered', sequence: 7 },
  { code: 'INVOICED', name: 'Invoiced', sequence: 8 },
  { code: 'CLOSED', name: 'Closed', sequence: 9 },
  { code: 'CANCELLED', name: 'Cancelled', sequence: 99 },
];

// PaymentTerms Seeds Required
const PAYMENT_TERMS_SEEDS = [
  { code: 'IMMEDIATE', name: 'Immediate', days: 0 },
  { code: 'NET15', name: 'Net 15 Days', days: 15 },
  { code: 'NET30', name: 'Net 30 Days', days: 30 },
  { code: 'NET45', name: 'Net 45 Days', days: 45 },
  { code: 'NET60', name: 'Net 60 Days', days: 60 },
  { code: 'COD', name: 'Cash on Delivery', days: 0 },
  { code: 'ADVANCE', name: '100% Advance', days: -1 },
  { code: 'ADV50_DEL50', name: '50% Advance, 50% on Delivery', days: 0 },
];
```

### 4.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /api/v1/sales/orders` | YES | NO | **Missing service** |
| `GET /sales/rfp` | YES | rfp.service.ts | **Mock only** |
| `POST /sales/orders/pricing/calculate` | YES | NO | **Missing service** |
| `GET /sales/orders/statistics` | YES | NO | **Missing service** |

### 4.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/sales` (dashboard) | NO | YES | Create SalesService |
| `/sales/orders/*` | NO | YES | Create OrderService |
| `/sales/quotations/*` | NO | YES | Create QuotationService |
| `/sales/rfp/*` | NO | YES | Set USE_MOCK_DATA=false in rfp.service |
| `/sales/delivery/*` | NO | YES | Create DeliveryService |

---

## 5. CRM Module

### Overview
**Path:** `b3-erp/backend/src/modules/crm/`
**Entities:** Lead, Interaction
**Frontend Pages:** 120 pages

### 5.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| LeadSource | NO | HIGH | Required for lead tracking |
| LeadStatus | NO | HIGH | Required for pipeline |
| InteractionType | NO | HIGH | Required for logging |
| CampaignType | NO | MEDIUM | Required for marketing |

**Required Seed Data:**

```typescript
// LeadSource Seeds Required
const LEAD_SOURCE_SEEDS = [
  { code: 'WEBSITE', name: 'Website Inquiry' },
  { code: 'REFERRAL', name: 'Customer Referral' },
  { code: 'COLD_CALL', name: 'Cold Call' },
  { code: 'TRADE_SHOW', name: 'Trade Show' },
  { code: 'SOCIAL', name: 'Social Media' },
  { code: 'EMAIL', name: 'Email Campaign' },
  { code: 'PARTNER', name: 'Partner Referral' },
  { code: 'ADVERTISEMENT', name: 'Advertisement' },
];

// LeadStatus Seeds Required
const LEAD_STATUS_SEEDS = [
  { code: 'NEW', name: 'New', sequence: 1, color: '#3B82F6' },
  { code: 'CONTACTED', name: 'Contacted', sequence: 2, color: '#8B5CF6' },
  { code: 'QUALIFIED', name: 'Qualified', sequence: 3, color: '#10B981' },
  { code: 'PROPOSAL', name: 'Proposal Sent', sequence: 4, color: '#F59E0B' },
  { code: 'NEGOTIATION', name: 'Negotiation', sequence: 5, color: '#EF4444' },
  { code: 'WON', name: 'Won', sequence: 6, color: '#22C55E' },
  { code: 'LOST', name: 'Lost', sequence: 7, color: '#6B7280' },
];
```

### 5.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /crm/leads` | YES | NO | **Missing service** |
| `GET /crm/interactions` | YES | interactions.service.ts | Wired |
| `POST /crm/leads/:id/convert-to-customer` | YES | NO | **Missing service** |

### 5.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/crm` (dashboard) | NO | YES | Create CRMDashboardService |
| `/crm/leads/*` | NO | YES (4 records) | Create LeadService |
| `/crm/contacts/*` | NO | YES (5 records) | Create ContactService |
| `/crm/opportunities/*` | NO | YES (4 records) | Create OpportunityService |
| `/crm/interactions/*` | YES | Fallback | Complete |
| `/crm/campaigns/*` | NO | YES | Create CampaignService |
| `/crm/analytics/*` | NO | YES | Create CRMAnalyticsService |

---

## 6. Production Module

### Overview
**Path:** `b3-erp/backend/src/modules/production/`
**Entities:** 10 entities (BOM, Work Order, Work Center, etc.)
**Frontend Pages:** 86 pages

### 6.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| WorkCenter | NO | **CRITICAL** | Required for scheduling |
| Operation | NO | **CRITICAL** | Required for routing |
| WorkOrderStatus | NO | HIGH | Required for workflow |
| ProductionLine | NO | HIGH | Required for shop floor |
| ShiftSchedule | NO | HIGH | Required for capacity planning |

**Required Seed Data:**

```typescript
// WorkCenter Seeds Required
const WORK_CENTER_SEEDS = [
  { code: 'WC-CUT', name: 'Cutting Section', capacity: 8, capacityUom: 'HOURS', costPerHour: 500 },
  { code: 'WC-WELD', name: 'Welding Section', capacity: 8, capacityUom: 'HOURS', costPerHour: 600 },
  { code: 'WC-ASSY', name: 'Assembly Section', capacity: 8, capacityUom: 'HOURS', costPerHour: 450 },
  { code: 'WC-PAINT', name: 'Painting Section', capacity: 8, capacityUom: 'HOURS', costPerHour: 400 },
  { code: 'WC-QC', name: 'Quality Check', capacity: 8, capacityUom: 'HOURS', costPerHour: 350 },
  { code: 'WC-PACK', name: 'Packing Section', capacity: 8, capacityUom: 'HOURS', costPerHour: 300 },
];

// Operation Seeds Required
const OPERATION_SEEDS = [
  { code: 'OP-CUT', name: 'Cutting', workCenterId: 'WC-CUT', standardTime: 30, timeUom: 'MINUTES' },
  { code: 'OP-BEND', name: 'Bending', workCenterId: 'WC-CUT', standardTime: 20, timeUom: 'MINUTES' },
  { code: 'OP-WELD', name: 'Welding', workCenterId: 'WC-WELD', standardTime: 45, timeUom: 'MINUTES' },
  { code: 'OP-GRIND', name: 'Grinding', workCenterId: 'WC-WELD', standardTime: 15, timeUom: 'MINUTES' },
  { code: 'OP-ASSY', name: 'Assembly', workCenterId: 'WC-ASSY', standardTime: 60, timeUom: 'MINUTES' },
  { code: 'OP-PAINT', name: 'Painting', workCenterId: 'WC-PAINT', standardTime: 90, timeUom: 'MINUTES' },
  { code: 'OP-DRY', name: 'Drying', workCenterId: 'WC-PAINT', standardTime: 120, timeUom: 'MINUTES' },
  { code: 'OP-INSP', name: 'Inspection', workCenterId: 'WC-QC', standardTime: 30, timeUom: 'MINUTES' },
  { code: 'OP-PACK', name: 'Packing', workCenterId: 'WC-PACK', standardTime: 20, timeUom: 'MINUTES' },
];
```

### 6.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /production/work-orders` | YES | NO | **Missing service** |
| `GET /production/bom` | YES | NO | **Missing service** |
| `GET /production/work-centers` | YES | NO | **Missing service** |
| `GET /production/shop-floor-control` | YES | NO | **Missing service** |
| `GET /production/production-plans` | YES | NO | **Missing service** |
| `GET /production/dies-tools` | YES | diesTools.ts | Wired |

### 6.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/production` (dashboard) | NO | YES | Create ProductionService |
| `/production/work-orders/*` | NO | YES | Create WorkOrderService |
| `/production/bom/*` | NO | YES | Create BOMService |
| `/production/scheduling/*` | NO | YES | Create SchedulingService |
| `/production/shopfloor/*` | NO | YES | Create ShopFloorService |
| `/production/settings/work-centers` | NO | YES | Create WorkCenterService |

---

## 7. Inventory Module

### Overview
**Path:** `b3-erp/backend/src/modules/inventory/`
**Entities:** 8 entities
**Frontend Pages:** 66 pages

### 7.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| Warehouse | NO | **CRITICAL** | Required for stock management |
| StockLocation | NO | **CRITICAL** | Required for putaway/picking |
| StockEntryType | NO | HIGH | Required for transactions |
| AdjustmentReason | NO | HIGH | Required for audits |

**Required Seed Data:**

```typescript
// Warehouse Seeds Required
const WAREHOUSE_SEEDS = [
  { code: 'WH-MAIN', name: 'Main Warehouse', type: 'STORAGE', address: 'Factory Premises' },
  { code: 'WH-RM', name: 'Raw Material Store', type: 'STORAGE', address: 'Factory Premises' },
  { code: 'WH-FG', name: 'Finished Goods Store', type: 'STORAGE', address: 'Factory Premises' },
  { code: 'WH-WIP', name: 'Work in Progress', type: 'PRODUCTION', address: 'Shop Floor' },
  { code: 'WH-QC', name: 'QC Hold Area', type: 'QUALITY', address: 'QC Section' },
  { code: 'WH-REJ', name: 'Rejection Store', type: 'REJECT', address: 'Factory Premises' },
];

// StockLocation Seeds Required (per warehouse)
const STOCK_LOCATION_SEEDS = [
  { code: 'LOC-A1-01', warehouse: 'WH-MAIN', rack: 'A1', bin: '01', capacity: 100 },
  { code: 'LOC-A1-02', warehouse: 'WH-MAIN', rack: 'A1', bin: '02', capacity: 100 },
  // ... more locations
];

// AdjustmentReason Seeds Required
const ADJUSTMENT_REASON_SEEDS = [
  { code: 'DAMAGE', name: 'Damaged Goods', type: 'NEGATIVE' },
  { code: 'THEFT', name: 'Theft/Pilferage', type: 'NEGATIVE' },
  { code: 'EXPIRY', name: 'Expired Stock', type: 'NEGATIVE' },
  { code: 'COUNT_ADJ', name: 'Physical Count Adjustment', type: 'BOTH' },
  { code: 'FOUND', name: 'Found Stock', type: 'POSITIVE' },
  { code: 'QUALITY_REJ', name: 'Quality Rejection', type: 'NEGATIVE' },
];
```

### 7.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /inventory/warehouses` | YES | NO | **Missing service** |
| `GET /inventory/stock-balances` | YES | InventoryService | Wired |
| `GET /inventory/stock-entries` | YES | NO | **Missing service** |
| `GET /inventory/stock-transfers` | YES | NO | **Missing service** |
| `GET /inventory/stock-adjustments` | YES | NO | **Missing service** |
| `GET /inventory/batch-numbers` | YES | NO | **Missing service** |
| `GET /inventory/serial-numbers` | YES | NO | **Missing service** |

### 7.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/inventory` (dashboard) | PARTIAL | YES | Extend InventoryService |
| `/inventory/stock/*` | PARTIAL | YES | Wire remaining endpoints |
| `/inventory/warehouses/*` | NO | YES | Create WarehouseService |
| `/inventory/transfers/*` | NO | YES | Create TransferService |
| `/inventory/adjustments/*` | NO | YES | Create AdjustmentService |

---

## 8. Procurement Module

### Overview
**Path:** `b3-erp/backend/src/modules/procurement/`
**Entities:** 10 entities
**Frontend Pages:** 59 pages

### 8.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| PurchaseOrderStatus | NO | HIGH | Required for workflow |
| ApprovalThreshold | NO | HIGH | Required for approvals |
| VendorCategory | NO | MEDIUM | Required for classification |

**Required Seed Data:**

```typescript
// PO Status Seeds Required
const PO_STATUS_SEEDS = [
  { code: 'DRAFT', name: 'Draft', sequence: 1 },
  { code: 'SUBMITTED', name: 'Submitted for Approval', sequence: 2 },
  { code: 'APPROVED', name: 'Approved', sequence: 3 },
  { code: 'SENT', name: 'Sent to Vendor', sequence: 4 },
  { code: 'ACKNOWLEDGED', name: 'Acknowledged by Vendor', sequence: 5 },
  { code: 'PARTIAL', name: 'Partially Received', sequence: 6 },
  { code: 'RECEIVED', name: 'Fully Received', sequence: 7 },
  { code: 'INVOICED', name: 'Invoice Received', sequence: 8 },
  { code: 'CLOSED', name: 'Closed', sequence: 9 },
  { code: 'CANCELLED', name: 'Cancelled', sequence: 99 },
];

// Approval Threshold Seeds Required
const APPROVAL_THRESHOLD_SEEDS = [
  { minAmount: 0, maxAmount: 50000, approverRole: 'PURCHASE_EXEC', level: 1 },
  { minAmount: 50001, maxAmount: 200000, approverRole: 'PURCHASE_MGR', level: 2 },
  { minAmount: 200001, maxAmount: 500000, approverRole: 'FINANCE_MGR', level: 3 },
  { minAmount: 500001, maxAmount: 1000000, approverRole: 'GM', level: 4 },
  { minAmount: 1000001, maxAmount: null, approverRole: 'CEO', level: 5 },
];
```

### 8.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /procurement/purchase-orders` | YES | NO | **Missing service** |
| `GET /procurement/purchase-requisitions` | YES | NO | **Missing service** |
| `GET /procurement/goods-receipts` | YES | NO | **Missing service** |
| `GET /procurement/rfqs` | YES | NO | **Missing service** |
| `GET /procurement/vendor-quotations` | YES | NO | **Missing service** |
| `GET /procurement/vendor-evaluations` | YES | VendorService | Partial |

### 8.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/procurement` (dashboard) | NO | YES | Create ProcurementService |
| `/procurement/purchase-orders/*` | NO | YES | Create PurchaseOrderService |
| `/procurement/requisitions/*` | NO | YES | Create RequisitionService |
| `/procurement/rfq/*` | NO | YES | Create RFQService |
| `/procurement/goods-receipt/*` | NO | YES | Create GoodsReceiptService |
| `/procurement/vendors/*` | PARTIAL | YES | Extend VendorService |

---

## 9. Quality Module

### Overview
**Path:** `b3-erp/backend/src/modules/quality/`
**Entities:** 12 entities
**Frontend Pages:** 11 pages

### 9.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| QCParameter | NO | **CRITICAL** | Required for inspections |
| QCTemplate | NO | **CRITICAL** | Required for inspections |
| DefectCode | NO | HIGH | Required for NCR |
| InspectionType | NO | HIGH | Required for QC flow |

**Required Seed Data:**

```typescript
// QC Parameter Seeds Required
const QC_PARAMETER_SEEDS = [
  { code: 'DIM-LEN', name: 'Length', type: 'DIMENSIONAL', uom: 'MM', tolerancePlus: 0.5, toleranceMinus: 0.5 },
  { code: 'DIM-WID', name: 'Width', type: 'DIMENSIONAL', uom: 'MM', tolerancePlus: 0.5, toleranceMinus: 0.5 },
  { code: 'DIM-THK', name: 'Thickness', type: 'DIMENSIONAL', uom: 'MM', tolerancePlus: 0.1, toleranceMinus: 0.1 },
  { code: 'VIS-SURF', name: 'Surface Finish', type: 'VISUAL', checkType: 'PASS_FAIL' },
  { code: 'VIS-COLOR', name: 'Color Match', type: 'VISUAL', checkType: 'PASS_FAIL' },
  { code: 'FUNC-OP', name: 'Operational Test', type: 'FUNCTIONAL', checkType: 'PASS_FAIL' },
  { code: 'MAT-HARD', name: 'Hardness', type: 'MATERIAL', uom: 'HRC', tolerancePlus: 2, toleranceMinus: 2 },
];

// Defect Code Seeds Required
const DEFECT_CODE_SEEDS = [
  { code: 'DEF-DIM', name: 'Dimensional Out of Spec', severity: 'MAJOR', category: 'DIMENSIONAL' },
  { code: 'DEF-SURF', name: 'Surface Defect', severity: 'MINOR', category: 'VISUAL' },
  { code: 'DEF-CRACK', name: 'Crack/Fracture', severity: 'CRITICAL', category: 'STRUCTURAL' },
  { code: 'DEF-RUST', name: 'Rust/Corrosion', severity: 'MAJOR', category: 'SURFACE' },
  { code: 'DEF-PAINT', name: 'Paint Defect', severity: 'MINOR', category: 'COATING' },
  { code: 'DEF-WELD', name: 'Welding Defect', severity: 'MAJOR', category: 'FABRICATION' },
  { code: 'DEF-FUNC', name: 'Functional Failure', severity: 'CRITICAL', category: 'FUNCTIONAL' },
];
```

### 9.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /quality/inspection` | YES | NO | **Missing service** |
| `GET /quality/qc-parameter` | YES | NO | **Missing service** |
| `GET /quality/qc-template` | YES | NO | **Missing service** |
| `GET /quality/non-conformance` | YES | NO | **Missing service** |
| `GET /quality/capa` | YES | NO | **Missing service** |
| `GET /quality/audit-plan` | YES | NO | **Missing service** |

### 9.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/quality/inspections/*` | NO | YES | Create InspectionService |
| `/quality/ncr/*` | NO | YES | Create NCRService |
| `/quality/capa/*` | NO | YES | Create CAPAService |
| `/quality/audits/*` | NO | YES | Create AuditService |

---

## 10. Logistics Module

### Overview
**Path:** `b3-erp/backend/src/modules/logistics/`
**Entities:** 10 entities
**Frontend Pages:** 61 pages

### 10.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| TransportCompany | NO | HIGH | Required for shipping |
| VehicleType | NO | HIGH | Required for fleet |
| Route | NO | MEDIUM | Required for planning |
| ShipmentStatus | NO | HIGH | Required for tracking |

**Required Seed Data:**

```typescript
// TransportCompany Seeds Required
const TRANSPORT_COMPANY_SEEDS = [
  { code: 'TC-OWN', name: 'Own Fleet', type: 'OWN', contactPerson: 'Transport Manager' },
  { code: 'TC-DHL', name: 'DHL Express', type: 'COURIER', contactPerson: 'Account Manager' },
  { code: 'TC-FDX', name: 'FedEx', type: 'COURIER', contactPerson: 'Account Manager' },
  { code: 'TC-BW', name: 'Blue Dart', type: 'COURIER', contactPerson: 'Account Manager' },
  { code: 'TC-GATI', name: 'Gati Logistics', type: 'FREIGHT', contactPerson: 'Account Manager' },
  { code: 'TC-SAFE', name: 'Safexpress', type: 'FREIGHT', contactPerson: 'Account Manager' },
];

// VehicleType Seeds Required
const VEHICLE_TYPE_SEEDS = [
  { code: 'VT-BIKE', name: 'Delivery Bike', capacity: 20, capacityUom: 'KG' },
  { code: 'VT-VAN', name: 'Delivery Van', capacity: 500, capacityUom: 'KG' },
  { code: 'VT-TATA407', name: 'Tata 407', capacity: 2500, capacityUom: 'KG' },
  { code: 'VT-14FT', name: '14ft Container', capacity: 7000, capacityUom: 'KG' },
  { code: 'VT-20FT', name: '20ft Container', capacity: 20000, capacityUom: 'KG' },
  { code: 'VT-TRAILER', name: 'Trailer', capacity: 30000, capacityUom: 'KG' },
];
```

### 10.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /logistics/shipments` | YES | NO | **Missing service** |
| `GET /logistics/delivery-notes` | YES | NO | **Missing service** |
| `GET /logistics/vehicles` | YES | NO | **Missing service** |
| `GET /logistics/drivers` | YES | NO | **Missing service** |
| `GET /logistics/routes` | YES | NO | **Missing service** |
| `GET /logistics/trips` | YES | NO | **Missing service** |
| `GET /logistics/gate-passes` | YES | gatePass.ts | Wired |

### 10.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/logistics` (dashboard) | NO | YES | Create LogisticsService |
| `/logistics/shipments/*` | NO | YES | Create ShipmentService |
| `/logistics/delivery/*` | NO | YES | Create DeliveryService |
| `/logistics/fleet/*` | NO | YES | Create FleetService |
| `/logistics/routes/*` | NO | YES | Create RouteService |
| `/logistics/tracking/*` | NO | YES | Create TrackingService |

---

## 11. Project Management Module

### Overview
**Path:** `b3-erp/backend/src/modules/project-management/`
**Entities:** 6 entities
**Frontend Pages:** 101 pages
**Existing Service:** ProjectManagementService.ts (partial)

### 11.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| ProjectStatus | NO | HIGH | Required for tracking |
| ProjectType | NO | MEDIUM | Required for classification |
| TaskStatus | NO | HIGH | Required for tasks |
| MilestoneType | NO | MEDIUM | Required for milestones |

**Required Seed Data:**

```typescript
// Project Status Seeds Required
const PROJECT_STATUS_SEEDS = [
  { code: 'PLANNING', name: 'Planning', sequence: 1, color: '#3B82F6' },
  { code: 'IN_PROGRESS', name: 'In Progress', sequence: 2, color: '#8B5CF6' },
  { code: 'ON_HOLD', name: 'On Hold', sequence: 3, color: '#F59E0B' },
  { code: 'DELAYED', name: 'Delayed', sequence: 4, color: '#EF4444' },
  { code: 'COMPLETED', name: 'Completed', sequence: 5, color: '#22C55E' },
  { code: 'CANCELLED', name: 'Cancelled', sequence: 6, color: '#6B7280' },
];

// Project Type Seeds Required
const PROJECT_TYPE_SEEDS = [
  { code: 'INSTALLATION', name: 'Installation Project' },
  { code: 'MANUFACTURING', name: 'Manufacturing Project' },
  { code: 'SERVICE', name: 'Service Project' },
  { code: 'TURNKEY', name: 'Turnkey Project' },
  { code: 'AMC', name: 'Annual Maintenance Contract' },
];
```

### 11.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /projects` | YES | ProjectManagementService | Partial (fallback to mock) |
| `GET /project-management/tasks` | YES | ProjectManagementService | Partial |
| `GET /project-management/resources` | YES | ProjectManagementService | **Mock only** |
| `GET /project-management/budgets` | YES | ProjectManagementService | **Mock only** |
| `GET /project-management/milestones` | YES | ProjectManagementService | Partial |
| `GET /project-management/time-logs` | YES | ProjectManagementService | Partial |
| `GET /project-management/financials` | YES | projectFinancials.ts | **Mock only** |
| `GET /project-management/ta-settlement` | YES | taSettlement.ts | Wired |
| `GET /project-management/emergency-spares` | YES | emergencySpares.ts | Wired |

### 11.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/project-management` (list) | PARTIAL | YES (10 projects) | Remove mock fallback |
| `/project-management/[id]/dashboard` | PARTIAL | YES | Complete API wiring |
| `/project-management/analytics` | NO | YES | Wire to analytics API |
| `/project-management/resources` | NO | YES | Wire to resources API |
| `/project-management/financials` | NO | YES | Uncomment real API calls |

---

## 12. Workflow Module

### Overview
**Path:** `b3-erp/backend/src/modules/workflow/`
**Entities:** 17 entities
**Frontend Pages:** Admin workflows
**Existing Seeder:** workflow-seeder.service.ts

### 12.1 Seed Status

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| WorkflowDefinition | YES | - | 6 workflows seeded |
| WorkflowStep | YES | - | Steps seeded with definitions |
| NotificationTemplate | NO | HIGH | Required for alerts |
| EscalationRule | NO | HIGH | Required for SLA |

**Currently Seeded Workflows:**
1. Sales to Production
2. Procurement to Inventory
3. Quality Inspection
4. Order Fulfillment
5. Purchase Requisition
6. Goods Receipt

### 12.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /api/workflow/templates` | YES | NO | **Missing service** |
| `GET /workflow/approvals` | YES | ApprovalService | Wired |
| `GET /workflow-repository/definitions` | YES | NO | **Missing service** |
| `GET /workflow-repository/instances` | YES | NO | **Missing service** |
| `GET /api/workflow/tasks/inbox/:userId` | YES | NO | **Missing service** |
| `GET /api/workflow/analytics/metrics` | YES | NO | **Missing service** |

### 12.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/admin/workflows` | NO | YES | Create WorkflowService |
| `/admin/workflows/builder` | NO | YES | Wire to workflow-repository |
| `/admin/workflow-overview` | NO | YES | Wire to analytics |
| `/admin/sla-analytics` | NO | YES | Wire to SLA metrics |

---

## 13. After-Sales Service Module

### Overview
**Path:** `b3-erp/backend/src/modules/after-sales-service/`
**Entities:** 9 entities
**Frontend Pages:** Multiple service pages

### 13.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| ServiceType | NO | HIGH | Required for requests |
| WarrantyType | NO | HIGH | Required for claims |
| ServicePriority | NO | HIGH | Required for SLA |
| ContractType | NO | MEDIUM | Required for contracts |

**Required Seed Data:**

```typescript
// ServiceType Seeds Required
const SERVICE_TYPE_SEEDS = [
  { code: 'INSTALLATION', name: 'Installation', standardHours: 8 },
  { code: 'REPAIR', name: 'Repair', standardHours: 4 },
  { code: 'MAINTENANCE', name: 'Preventive Maintenance', standardHours: 2 },
  { code: 'INSPECTION', name: 'Annual Inspection', standardHours: 4 },
  { code: 'CALIBRATION', name: 'Calibration', standardHours: 2 },
  { code: 'UPGRADE', name: 'Upgrade/Modification', standardHours: 8 },
  { code: 'TRAINING', name: 'Customer Training', standardHours: 4 },
];

// WarrantyType Seeds Required
const WARRANTY_TYPE_SEEDS = [
  { code: 'STANDARD', name: 'Standard Warranty', durationMonths: 12, coverage: 'PARTS_LABOR' },
  { code: 'EXTENDED', name: 'Extended Warranty', durationMonths: 24, coverage: 'PARTS_LABOR' },
  { code: 'PARTS_ONLY', name: 'Parts Only', durationMonths: 12, coverage: 'PARTS' },
  { code: 'COMPREHENSIVE', name: 'Comprehensive', durationMonths: 36, coverage: 'ALL' },
];
```

### 13.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /after-sales/service-requests` | YES | NO | **Missing service** |
| `GET /after-sales/field-service` | YES | NO | **Missing service** |
| `GET /after-sales/installations` | YES | NO | **Missing service** |
| `GET /after-sales/warranties` | YES | NO | **Missing service** |
| `GET /after-sales/service-contracts` | YES | NO | **Missing service** |
| `GET /after-sales/service-billing` | YES | NO | **Missing service** |

### 13.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/after-sales/*` | NO | YES | Create AfterSalesService |
| `/service/requests/*` | NO | YES | Wire to service-requests |
| `/service/contracts/*` | NO | YES | Wire to service-contracts |
| `/service/warranties/*` | NO | YES | Wire to warranties |

---

## 14. IT-Admin Module

### Overview
**Path:** `b3-erp/backend/src/modules/it-admin/`
**Entities:** 11 entities
**Frontend Pages:** Settings, Admin pages

### 14.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| Role | NO | **CRITICAL** | Required for RBAC |
| Permission | NO | **CRITICAL** | Required for RBAC |
| User (Admin) | NO | **CRITICAL** | Required for login |
| SystemConfig | NO | HIGH | Required for settings |

**Required Seed Data:**

```typescript
// Role Seeds Required
const ROLE_SEEDS = [
  { code: 'SUPER_ADMIN', name: 'Super Administrator', level: 1 },
  { code: 'ADMIN', name: 'Administrator', level: 2 },
  { code: 'MANAGER', name: 'Manager', level: 3 },
  { code: 'SUPERVISOR', name: 'Supervisor', level: 4 },
  { code: 'EXECUTIVE', name: 'Executive', level: 5 },
  { code: 'OPERATOR', name: 'Operator', level: 6 },
  { code: 'VIEWER', name: 'Viewer (Read-Only)', level: 7 },
];

// Permission Seeds Required (per module)
const PERMISSION_SEEDS = [
  // HR Module Permissions
  { code: 'HR_VIEW', name: 'View HR Data', module: 'HR' },
  { code: 'HR_CREATE', name: 'Create HR Records', module: 'HR' },
  { code: 'HR_EDIT', name: 'Edit HR Records', module: 'HR' },
  { code: 'HR_DELETE', name: 'Delete HR Records', module: 'HR' },
  { code: 'HR_APPROVE', name: 'Approve HR Requests', module: 'HR' },
  // Sales Module Permissions
  { code: 'SALES_VIEW', name: 'View Sales Data', module: 'SALES' },
  { code: 'SALES_CREATE', name: 'Create Sales Orders', module: 'SALES' },
  { code: 'SALES_EDIT', name: 'Edit Sales Orders', module: 'SALES' },
  { code: 'SALES_DELETE', name: 'Delete Sales Orders', module: 'SALES' },
  { code: 'SALES_APPROVE', name: 'Approve Sales Orders', module: 'SALES' },
  // ... permissions for all modules
];

// Default Admin User Seed
const ADMIN_USER_SEED = {
  username: 'admin',
  email: 'admin@manufacturingos.com',
  password: 'hashed_password', // Will be hashed
  roleId: 'SUPER_ADMIN',
  status: 'ACTIVE',
};
```

### 14.2 API Gaps

| Endpoint | Backend | Frontend Service | Gap |
|----------|---------|-----------------|-----|
| `GET /it-admin/users` | YES | NO | **Missing service** |
| `GET /it-admin/roles` | YES | NO | **Missing service** |
| `GET /it-admin/permissions` | YES | NO | **Missing service** |
| `GET /it-admin/audit-logs` | YES | NO | **Missing service** |
| `GET /it-admin/system-config` | YES | NO | **Missing service** |

### 14.3 Frontend Wiring Gaps

| Page | API Connected | Mock Data | Action Required |
|------|--------------|-----------|-----------------|
| `/settings/users/*` | NO | YES | Create UserManagementService |
| `/settings/roles/*` | NO | YES | Create RoleService |
| `/settings/permissions/*` | NO | YES | Create PermissionService |
| `/admin/audit-logs` | NO | YES | Create AuditService |
| `/settings/system/*` | NO | YES | Create SystemConfigService |

---

## 15. Accounts Module

### Overview
**Path:** `b3-erp/backend/src/modules/accounts/`
**Entities:** Bank Account, Bank Transaction, Expense Claim, Petty Cash
**Frontend Pages:** Finance sub-pages

### 15.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| ExpenseCategory | NO | HIGH | Required for claims |
| PettyCashLimit | NO | MEDIUM | Required for approvals |

### 15.2 API Gaps - All services missing frontend wiring

---

## 16. Approvals Module

### Overview
**Path:** `b3-erp/backend/src/modules/approvals/`
**Entities:** 7 entities
**Existing Service:** ApprovalService.ts (wired)

### 16.1 Seed Gaps

| Entity | Seeder Exists | Priority | Status |
|--------|--------------|----------|--------|
| ApprovalChain | NO | HIGH | Required for multi-level |
| ApprovalLevel | NO | HIGH | Required for hierarchy |

### 16.2 API Status - Mostly wired via ApprovalService

---

## 17-22. Other Modules Summary

| Module | Seed Gaps | API Gaps | Wiring Gaps |
|--------|-----------|----------|-------------|
| **CMS** | ContentCategory | Minor | Complete service needed |
| **Notifications** | Templates | No controller | Service-only module |
| **Proposals** | Templates | Minor | Complete service needed |
| **Estimation** | BOQ templates | Minor | Complete service needed |
| **Reports** | Report configs | **Empty module** | Create entire module |
| **Support** | Ticket categories | No controller | Service-only module |

---

## 23. Cross-Module Integration Gaps

### 23.1 Document Flow Integration

| Flow | Status | Gap |
|------|--------|-----|
| RFP → Sales Order | Partial | Frontend not wired |
| Sales Order → Work Order | Backend ready | Frontend not wired |
| Work Order → Production Entry | Backend ready | Frontend not wired |
| Goods Receipt → Stock Entry | Backend ready | Frontend not wired |
| Invoice → Payment | Backend ready | Frontend not wired |

### 23.2 Workflow Triggers

| Trigger | Workflow | Status |
|---------|----------|--------|
| Sales Order Approved | Create Work Order | Backend ready, not tested |
| Stock Below Reorder | Create PR | Backend ready, not tested |
| Quality Fail | Create NCR | Backend ready, not tested |
| Payment Received | Update Invoice | Backend ready, not tested |

---

## Priority Action Matrix

### CRITICAL (Must Fix First)

1. **Core Seeders** - UOM, Category, Item (all operations depend on these)
2. **IT-Admin Seeders** - Role, Permission, Admin User (security)
3. **HR Seeders** - Department, Designation (org structure)
4. **Finance Seeder Auto-Run** - Make Chart of Accounts auto-seed

### HIGH (Required for Operations)

5. **Inventory Seeders** - Warehouse, Stock Location
6. **Production Seeders** - Work Center, Operation
7. **Quality Seeders** - QC Parameter, QC Template
8. **Frontend Services** - Create missing services for all modules

### MEDIUM (Enhanced Functionality)

9. **CRM Seeders** - Lead Source, Lead Status
10. **Sales Seeders** - Order Status, Payment Terms
11. **Procurement Seeders** - PO Status, Approval Thresholds
12. **Logistics Seeders** - Transport Company, Vehicle Type

### LOW (Nice to Have)

13. **After-Sales Seeders** - Service Types, Warranty Types
14. **Notification Templates**
15. **Report Configurations**

---

## Recommended Implementation Order

### Phase 1: Foundation (Week 1)
1. Create Core module seeders (UOM, Category)
2. Create IT-Admin seeders (Role, Permission, User)
3. Make Finance COA seeder auto-run
4. Create HR org structure seeders (Department, Designation)

### Phase 2: Operations (Week 2)
5. Create Inventory seeders (Warehouse, Location)
6. Create Production seeders (Work Center, Operation)
7. Create Quality seeders (QC Parameter, Template)
8. Create remaining HR seeders (Leave Type, Holiday, Shift)

### Phase 3: Frontend Services (Week 3-4)
9. Create missing frontend services for each module
10. Wire services to backend APIs
11. Implement mock data fallback pattern
12. Test end-to-end flows

### Phase 4: Integration (Week 5)
13. Test cross-module workflows
14. Verify document flow integration
15. Performance testing
16. User acceptance testing

---

## Mock Data Fallback Pattern

All frontend services should implement this pattern:

```typescript
// Example: skill.service.ts pattern
const USE_MOCK_DATA = process.env.NEXT_PUBLIC_USE_MOCK_DATA === 'true';

async function getData() {
  if (USE_MOCK_DATA) {
    return MOCK_DATA;
  }

  try {
    const response = await apiClient.get('/api/endpoint');
    if (response.data && response.data.length > 0) {
      return response.data;
    }
    // Fallback to mock if API returns empty
    console.warn('API returned empty, using mock data');
    return MOCK_DATA;
  } catch (error) {
    console.error('API error, falling back to mock:', error);
    return MOCK_DATA;
  }
}
```

---

## Summary Statistics

| Category | Count |
|----------|-------|
| **Total Modules Analyzed** | 23 |
| **Seeders Needed** | 45+ |
| **Seeders Existing** | 3 |
| **Seeder Gap** | 42 |
| **Frontend Services Needed** | 30+ |
| **Frontend Services Existing** | 14 |
| **Frontend Service Gap** | 16+ |
| **API Endpoints (Backend)** | 500+ |
| **API Endpoints Wired** | ~50 |
| **Wiring Gap** | ~450 |
| **Frontend Pages** | 1,579 |
| **Pages Using Mock Only** | ~1,500 (95%) |

---

*This gap analysis should be reviewed and updated as implementation progresses.*
