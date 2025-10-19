# Complete Route Mapping for ManufacturingOS ERP

## Summary Statistics

- **Total Modules**: 18
- **Total Pages**: 403
- **Base Path**: `D:\KreupAI\ManufacturingOS-1\b3-erp\frontend\src\app\(modules)`

---

## Module Overview

| Module | Total Pages | Subsections | Route Prefix |
|--------|-------------|-------------|--------------|
| After-Sales Service | 30 | 8 | `/after-sales-service` |
| Common Masters | 55 | 55 | `/common-masters` |
| CRM | 21 | 6 | `/crm` |
| Estimation | 13 | 4 | `/estimation` |
| Finance | 100 | 34 | `/finance` |
| HR | 20 | 6 | `/hr` |
| Inventory | 11 | 5 | `/inventory` |
| IT Admin | 4 | 4 | `/it-admin` |
| Logistics | 18 | 11 | `/logistics` |
| Procurement | 50 | 36 | `/procurement` |
| Production | 25 | 12 | `/production` |
| Project Management | 34 | 34 | `/project-management` |
| Projects | 5 | 5 | `/projects` |
| Reports | 3 | 3 | `/reports` |
| RFQ | 3 | 3 | `/rfq` |
| Sales | 5 | 5 | `/sales` |
| Support | 3 | 3 | `/support` |
| Workflow | 3 | 3 | `/workflow` |

---

## Detailed Route Mappings

### 1. AFTER-SALES SERVICE (30 pages)

**Module Dashboard**: `/after-sales-service`

#### Billing (4 pages)
- `/after-sales-service/billing` - Billing list
- `/after-sales-service/billing/create` - Create new billing
- `/after-sales-service/billing/payments` - Billing payments
- `/after-sales-service/billing/view/:id` - View billing details

#### Dashboard (3 pages)
- `/after-sales-service/dashboard` - Main dashboard
- `/after-sales-service/dashboard/analytics` - Analytics dashboard
- `/after-sales-service/dashboard/reports` - Dashboard reports

#### Field Service (4 pages)
- `/after-sales-service/field-service` - Field service list
- `/after-sales-service/field-service/dispatch` - Dispatch management
- `/after-sales-service/field-service/schedule` - Service scheduling
- `/after-sales-service/field-service/view/:id` - View field service

#### Installations (4 pages)
- `/after-sales-service/installations` - Installations list
- `/after-sales-service/installations/add` - Add new installation
- `/after-sales-service/installations/calendar` - Installation calendar
- `/after-sales-service/installations/view/:id` - View installation

#### Service Contracts (5 pages)
- `/after-sales-service/service-contracts` - Service contracts list
- `/after-sales-service/service-contracts/add` - Add service contract
- `/after-sales-service/service-contracts/renew/:id` - Renew contract
- `/after-sales-service/service-contracts/terms` - Contract terms
- `/after-sales-service/service-contracts/view/:id` - View contract

#### Service Requests (4 pages)
- `/after-sales-service/service-requests` - Service requests list
- `/after-sales-service/service-requests/add` - Create service request
- `/after-sales-service/service-requests/sla-dashboard` - SLA dashboard
- `/after-sales-service/service-requests/view/:id` - View service request

#### Warranties (5 pages)
- `/after-sales-service/warranties` - Warranties list
- `/after-sales-service/warranties/add` - Add warranty
- `/after-sales-service/warranties/claims` - Warranty claims
- `/after-sales-service/warranties/claims/:id` - View claim
- `/after-sales-service/warranties/view/:id` - View warranty

---

### 2. COMMON MASTERS (55 pages)

**Module Dashboard**: `/common-masters`

All master data management pages (one page per master):

- `/common-masters/appliance-master` - Appliance Master
- `/common-masters/bank-master` - Bank Master
- `/common-masters/barcode-master` - Barcode Master
- `/common-masters/batch-lot-master` - Batch/Lot Master
- `/common-masters/branch-master` - Branch Master
- `/common-masters/brand-master` - Brand Master
- `/common-masters/cabinet-type-master` - Cabinet Type Master
- `/common-masters/chart-of-accounts-master` - Chart of Accounts Master
- `/common-masters/city-master` - City Master
- `/common-masters/company-master` - Company Master
- `/common-masters/cost-center-master` - Cost Center Master
- `/common-masters/counter-material-master` - Counter Material Master
- `/common-masters/country-master` - Country Master
- `/common-masters/currency-master` - Currency Master
- `/common-masters/customer-category-master` - Customer Category Master
- `/common-masters/customer-master` - Customer Master
- `/common-masters/department-master` - Department Master
- `/common-masters/designation-master` - Designation Master
- `/common-masters/document-type-master` - Document Type Master
- `/common-masters/employee-master` - Employee Master
- `/common-masters/exchange-rate-master` - Exchange Rate Master
- `/common-masters/finish-master` - Finish Master
- `/common-masters/hardware-master` - Hardware Master
- `/common-masters/holiday-master` - Holiday Master
- `/common-masters/hsn-sac-master` - HSN/SAC Master
- `/common-masters/installation-type-master` - Installation Type Master
- `/common-masters/item-category-master` - Item Category Master
- `/common-masters/item-group-master` - Item Group Master
- `/common-masters/item-master` - Item Master
- `/common-masters/kitchen-layout-master` - Kitchen Layout Master
- `/common-masters/location-master` - Location Master
- `/common-masters/machine-master` - Machine Master
- `/common-masters/material-grade-master` - Material Grade Master
- `/common-masters/number-series-master` - Number Series Master
- `/common-masters/operation-master` - Operation Master
- `/common-masters/payment-terms-master` - Payment Terms Master
- `/common-masters/plant-master` - Plant Master
- `/common-masters/price-list-master` - Price List Master
- `/common-masters/quality-parameter-master` - Quality Parameter Master
- `/common-masters/role-master` - Role Master
- `/common-masters/routing-master` - Routing Master
- `/common-masters/shift-master` - Shift Master
- `/common-masters/skill-master` - Skill Master
- `/common-masters/state-master` - State Master
- `/common-masters/tax-master` - Tax Master
- `/common-masters/territory-master` - Territory Master
- `/common-masters/tool-master` - Tool Master
- `/common-masters/uom-conversion-master` - UOM Conversion Master
- `/common-masters/uom-master` - UOM Master
- `/common-masters/user-master` - User Master
- `/common-masters/vendor-category-master` - Vendor Category Master
- `/common-masters/vendor-master` - Vendor Master
- `/common-masters/warehouse-master` - Warehouse Master
- `/common-masters/work-center-master` - Work Center Master

---

### 3. CRM (21 pages)

**Module Dashboard**: `/crm`

#### Contacts (4 pages)
- `/crm/contacts` - Contacts list
- `/crm/contacts/add` - Add new contact
- `/crm/contacts/edit/:id` - Edit contact
- `/crm/contacts/view/:id` - View contact

#### Customers (4 pages)
- `/crm/customers` - Customers list
- `/crm/customers/add` - Add new customer
- `/crm/customers/edit/:id` - Edit customer
- `/crm/customers/view/:id` - View customer

#### Interactions (4 pages)
- `/crm/interactions` - Interactions list
- `/crm/interactions/add` - Add new interaction
- `/crm/interactions/edit/:id` - Edit interaction
- `/crm/interactions/view/:id` - View interaction

#### Leads (4 pages)
- `/crm/leads` - Leads list
- `/crm/leads/add` - Add new lead
- `/crm/leads/edit/:id` - Edit lead
- `/crm/leads/view/:id` - View lead

#### Opportunities (4 pages)
- `/crm/opportunities` - Opportunities list
- `/crm/opportunities/add` - Add new opportunity
- `/crm/opportunities/edit/:id` - Edit opportunity
- `/crm/opportunities/view/:id` - View opportunity

---

### 4. ESTIMATION (13 pages)

**Module Dashboard**: `/estimation`

#### BOQ - Bill of Quantities (4 pages)
- `/estimation/boq` - BOQ list
- `/estimation/boq/add` - Add new BOQ
- `/estimation/boq/edit/:id` - Edit BOQ
- `/estimation/boq/view/:id` - View BOQ

#### Costing (4 pages)
- `/estimation/costing` - Costing list
- `/estimation/costing/add` - Add new costing
- `/estimation/costing/edit/:id` - Edit costing
- `/estimation/costing/view/:id` - View costing

#### Pricing (4 pages)
- `/estimation/pricing` - Pricing list
- `/estimation/pricing/add` - Add new pricing
- `/estimation/pricing/edit/:id` - Edit pricing
- `/estimation/pricing/view/:id` - View pricing

---

### 5. FINANCE (100 pages)

**Module Dashboard**: `/finance`

#### Accounting (10 pages)
- `/finance/accounting` - Accounting main page
- `/finance/accounting/add` - Add accounting entry
- `/finance/accounting/chart-of-accounts` - Chart of accounts
- `/finance/accounting/edit/:id` - Edit accounting entry
- `/finance/accounting/general-ledger` - General ledger
- `/finance/accounting/journal-entries` - Journal entries
- `/finance/accounting/ledger-report` - Ledger report
- `/finance/accounting/periods` - Accounting periods
- `/finance/accounting/trial-balance` - Trial balance
- `/finance/accounting/view/:id` - View accounting entry

#### Accounts Payable (1 page)
- `/finance/accounts-payable` - Accounts payable

#### Accounts Receivable (1 page)
- `/finance/accounts-receivable` - Accounts receivable

#### Analytics (4 pages)
- `/finance/analytics` - Analytics dashboard
- `/finance/analytics/financial-ratios` - Financial ratios
- `/finance/analytics/kpi-dashboard` - KPI dashboard
- `/finance/analytics/profitability-analysis` - Profitability analysis

#### Assets (4 pages)
- `/finance/assets` - Assets main page
- `/finance/assets/asset-disposal` - Asset disposal
- `/finance/assets/depreciation` - Depreciation
- `/finance/assets/fixed-assets` - Fixed assets

#### Automation (4 pages)
- `/finance/automation` - Automation main page
- `/finance/automation/alerts` - Automation alerts
- `/finance/automation/recurring-transactions` - Recurring transactions
- `/finance/automation/workflows` - Automation workflows

#### Bank Reconciliation (1 page)
- `/finance/bank-reconciliation` - Bank reconciliation

#### Budget (1 page)
- `/finance/budget` - Budget management

#### Budgeting (4 pages)
- `/finance/budgeting` - Budgeting main page
- `/finance/budgeting/budget-vs-actual` - Budget vs actual
- `/finance/budgeting/budgets` - Budgets list
- `/finance/budgeting/multi-year-planning` - Multi-year planning

#### Cash (6 pages)
- `/finance/cash` - Cash management
- `/finance/cash/anticipated-payments` - Anticipated payments
- `/finance/cash/anticipated-receipts` - Anticipated receipts
- `/finance/cash/bank-accounts` - Bank accounts
- `/finance/cash/bank-reconciliation` - Bank reconciliation
- `/finance/cash/cash-flow-forecast` - Cash flow forecast

#### Cash Flow (1 page)
- `/finance/cash-flow` - Cash flow

#### Consolidation (3 pages)
- `/finance/consolidation` - Consolidation main page
- `/finance/consolidation/financial-consolidation` - Financial consolidation
- `/finance/consolidation/intercompany` - Intercompany

#### Controls (4 pages)
- `/finance/controls` - Controls main page
- `/finance/controls/approval-workflows` - Approval workflows
- `/finance/controls/audit-trail` - Audit trail
- `/finance/controls/documents` - Documents

#### Cost Centers (1 page)
- `/finance/cost-centers` - Cost centers

#### Costing (7 pages)
- `/finance/costing` - Costing main page
- `/finance/costing/cost-centers` - Cost centers
- `/finance/costing/job-costing` - Job costing
- `/finance/costing/profit-centers` - Profit centers
- `/finance/costing/standard-costing` - Standard costing
- `/finance/costing/variance-analysis` - Variance analysis
- `/finance/costing/wip-accounting` - WIP accounting

#### Credit (1 page)
- `/finance/credit` - Credit management

#### Currency (3 pages)
- `/finance/currency` - Currency main page
- `/finance/currency/exchange-rates` - Exchange rates
- `/finance/currency/management` - Currency management

#### Dashboard (1 page)
- `/finance/dashboard` - Finance dashboard

#### General Ledger (1 page)
- `/finance/general-ledger` - General ledger

#### Integration (3 pages)
- `/finance/integration` - Integration main page
- `/finance/integration/procurement` - Procurement integration
- `/finance/integration/production` - Production integration

#### Integrations (1 page)
- `/finance/integrations` - Integrations

#### Investments (1 page)
- `/finance/investments` - Investments

#### Invoices (4 pages)
- `/finance/invoices` - Invoices list
- `/finance/invoices/add` - Add invoice
- `/finance/invoices/edit/:id` - Edit invoice
- `/finance/invoices/view/:id` - View invoice

#### Multi Currency (1 page)
- `/finance/multi-currency` - Multi-currency management

#### Payables (5 pages)
- `/finance/payables` - Payables list
- `/finance/payables/add` - Add payable
- `/finance/payables/edit/:id` - Edit payable
- `/finance/payables/payments` - Payables payments
- `/finance/payables/view/:id` - View payable

#### Payments (4 pages)
- `/finance/payments` - Payments list
- `/finance/payments/add` - Add payment
- `/finance/payments/edit/:id` - Edit payment
- `/finance/payments/view/:id` - View payment

#### Period Operations (3 pages)
- `/finance/period-operations` - Period operations
- `/finance/period-operations/period-close` - Period close
- `/finance/period-operations/year-end` - Year end

#### Periods (1 page)
- `/finance/periods` - Periods management

#### Receivables (6 pages)
- `/finance/receivables` - Receivables list
- `/finance/receivables/add` - Add receivable
- `/finance/receivables/credit-management` - Credit management
- `/finance/receivables/edit/:id` - Edit receivable
- `/finance/receivables/invoices` - Receivables invoices
- `/finance/receivables/view/:id` - View receivable

#### Reporting (2 pages)
- `/finance/reporting` - Reporting main page
- `/finance/reporting/report-builder` - Report builder

#### Reports (5 pages)
- `/finance/reports` - Reports main page
- `/finance/reports/balance-sheet` - Balance sheet
- `/finance/reports/cash-flow` - Cash flow report
- `/finance/reports/profit-loss` - Profit & loss
- `/finance/reports/trial-balance` - Trial balance

#### Tax (4 pages)
- `/finance/tax` - Tax main page
- `/finance/tax/gst` - GST
- `/finance/tax/tax-reports` - Tax reports
- `/finance/tax/tds` - TDS

#### Workflows (1 page)
- `/finance/workflows` - Workflows

---

### 6. HR (20 pages)

**Module Dashboard**: `/hr`

#### Attendance (3 pages)
- `/hr/attendance` - Attendance list
- `/hr/attendance/add` - Add attendance
- `/hr/attendance/view/:id` - View attendance

#### Employees (4 pages)
- `/hr/employees` - Employees list
- `/hr/employees/add` - Add employee
- `/hr/employees/edit/:id` - Edit employee
- `/hr/employees/view/:id` - View employee

#### Leave (4 pages)
- `/hr/leave` - Leave list
- `/hr/leave/add` - Add leave
- `/hr/leave/edit/:id` - Edit leave
- `/hr/leave/view/:id` - View leave

#### Payroll (4 pages)
- `/hr/payroll` - Payroll list
- `/hr/payroll/add` - Add payroll
- `/hr/payroll/edit/:id` - Edit payroll
- `/hr/payroll/view/:id` - View payroll

#### Performance (4 pages)
- `/hr/performance` - Performance list
- `/hr/performance/add` - Add performance review
- `/hr/performance/edit/:id` - Edit performance review
- `/hr/performance/view/:id` - View performance review

---

### 7. INVENTORY (11 pages)

**Module Dashboard**: `/inventory`

#### Movements (3 pages)
- `/inventory/movements` - Stock movements list
- `/inventory/movements/add` - Add stock movement
- `/inventory/movements/view/:id` - View stock movement

#### Stock (4 pages)
- `/inventory/stock` - Stock list
- `/inventory/stock/add` - Add stock
- `/inventory/stock/edit/:id` - Edit stock
- `/inventory/stock/view/:id` - View stock

#### Transfers (1 page)
- `/inventory/transfers` - Stock transfers

#### Warehouse (2 pages)
- `/inventory/warehouse` - Warehouse list
- `/inventory/warehouse/view/:id` - View warehouse

---

### 8. IT ADMIN (4 pages)

#### Audit (1 page)
- `/it-admin/audit` - Audit logs

#### Roles (1 page)
- `/it-admin/roles` - Role management

#### System (1 page)
- `/it-admin/system` - System settings

#### Users (1 page)
- `/it-admin/users` - User management

---

### 9. LOGISTICS (18 pages)

**Module Dashboard**: `/logistics`

#### Carriers (4 pages)
- `/logistics/carriers` - Carriers list
- `/logistics/carriers/add` - Add carrier
- `/logistics/carriers/edit/:id` - Edit carrier
- `/logistics/carriers/view/:id` - View carrier

#### Driver Master (1 page)
- `/logistics/driver-master` - Driver master data

#### Freight Master (1 page)
- `/logistics/freight-master` - Freight master data

#### Packaging Master (1 page)
- `/logistics/packaging-master` - Packaging master data

#### Port Master (1 page)
- `/logistics/port-master` - Port master data

#### Route Master (1 page)
- `/logistics/route-master` - Route master data

#### Shipping (4 pages)
- `/logistics/shipping` - Shipping list
- `/logistics/shipping/add` - Add shipment
- `/logistics/shipping/edit/:id` - Edit shipment
- `/logistics/shipping/view/:id` - View shipment

#### Tracking (2 pages)
- `/logistics/tracking` - Tracking list
- `/logistics/tracking/view/:id` - View tracking

#### Transporter Master (1 page)
- `/logistics/transporter-master` - Transporter master data

#### Vehicle Master (1 page)
- `/logistics/vehicle-master` - Vehicle master data

---

### 10. PROCUREMENT (50 pages)

**Module Dashboard**: `/procurement`

#### Analytics (1 page)
- `/procurement/analytics` - Procurement analytics

#### Approvals (1 page)
- `/procurement/approvals` - Approval workflows

#### Automation (1 page)
- `/procurement/automation` - Procurement automation

#### Budget (1 page)
- `/procurement/budget` - Budget management

#### Budget Tracking (1 page)
- `/procurement/budget-tracking` - Budget tracking

#### Calendar (1 page)
- `/procurement/calendar` - Procurement calendar

#### Category Management (1 page)
- `/procurement/category-management` - Category management

#### Collaboration (1 page)
- `/procurement/collaboration` - Supplier collaboration

#### Compliance (1 page)
- `/procurement/compliance` - Compliance management

#### Contract Management (1 page)
- `/procurement/contract-management` - Contract management

#### Contracts (1 page)
- `/procurement/contracts` - Contracts list

#### E-Marketplace (1 page)
- `/procurement/e-marketplace` - E-marketplace

#### GRN - Goods Receipt Note (5 pages)
- `/procurement/grn` - GRN list
- `/procurement/grn/:id/inspect` - Inspect GRN
- `/procurement/grn/add` - Add GRN
- `/procurement/grn/edit/:id` - Edit GRN
- `/procurement/grn/view/:id` - View GRN

#### Invoices (1 page)
- `/procurement/invoices` - Procurement invoices

#### Notifications (1 page)
- `/procurement/notifications` - Notifications

#### Orders (3 pages)
- `/procurement/orders/add` - Add procurement order
- `/procurement/orders/edit/:id` - Edit procurement order
- `/procurement/orders/view/:id` - View procurement order

#### PO - Purchase Orders (1 page)
- `/procurement/po` - Purchase orders

#### Purchase Orders (2 pages)
- `/procurement/purchase-orders` - Purchase orders list
- `/procurement/purchase-orders/create` - Create purchase order

#### Purchase Requisition (1 page)
- `/procurement/purchase-requisition` - Purchase requisitions

#### Quality Assurance (1 page)
- `/procurement/quality-assurance` - Quality assurance

#### Requisitions (4 pages)
- `/procurement/requisitions` - Requisitions list
- `/procurement/requisitions/add` - Add requisition
- `/procurement/requisitions/edit/:id` - Edit requisition
- `/procurement/requisitions/view/:id` - View requisition

#### RFQ (2 pages)
- `/procurement/rfq` - RFQ list
- `/procurement/rfq/:id/compare` - Compare RFQ responses

#### RFQ/RFP (1 page)
- `/procurement/rfq-rfp` - RFQ/RFP management

#### Risk Management (1 page)
- `/procurement/risk-management` - Risk management

#### Savings Tracker (1 page)
- `/procurement/savings-tracker` - Savings tracker

#### Spend Analysis (1 page)
- `/procurement/spend-analysis` - Spend analysis

#### Strategic Sourcing (1 page)
- `/procurement/strategic-sourcing` - Strategic sourcing

#### Supplier Diversity (1 page)
- `/procurement/supplier-diversity` - Supplier diversity

#### Supplier Onboarding (1 page)
- `/procurement/supplier-onboarding` - Supplier onboarding

#### Supplier Portal (1 page)
- `/procurement/supplier-portal` - Supplier portal

#### Supplier Relationship (1 page)
- `/procurement/supplier-relationship` - Supplier relationship management

#### Supplier Scorecard (1 page)
- `/procurement/supplier-scorecard` - Supplier scorecard

#### Vendor Management (1 page)
- `/procurement/vendor-management` - Vendor management

#### Vendor Performance (1 page)
- `/procurement/vendor-performance` - Vendor performance

#### Vendors (4 pages)
- `/procurement/vendors` - Vendors list
- `/procurement/vendors/add` - Add vendor
- `/procurement/vendors/edit/:id` - Edit vendor
- `/procurement/vendors/view/:id` - View vendor

---

### 11. PRODUCTION (25 pages)

**Module Dashboard**: `/production`

#### Analytics (1 page)
- `/production/analytics` - Production analytics

#### BOM - Bill of Materials (3 pages)
- `/production/bom/add` - Add BOM
- `/production/bom/edit/:id` - Edit BOM
- `/production/bom/view/:id` - View BOM

#### Capacity Planning (1 page)
- `/production/capacity-planning` - Capacity planning

#### Floor (3 pages)
- `/production/floor` - Shop floor
- `/production/floor/edit/:id` - Edit floor
- `/production/floor/view/:id` - View floor

#### MRP - Material Requirements Planning (1 page)
- `/production/mrp` - MRP

#### Planning (1 page)
- `/production/planning` - Production planning

#### PPG (1 page)
- `/production/ppg` - Production planning and control

#### Quality (4 pages)
- `/production/quality` - Quality control list
- `/production/quality/add` - Add quality check
- `/production/quality/edit/:id` - Edit quality check
- `/production/quality/view/:id` - View quality check

#### Scheduling (4 pages)
- `/production/scheduling` - Scheduling list
- `/production/scheduling/add` - Add schedule
- `/production/scheduling/edit/:id` - Edit schedule
- `/production/scheduling/view/:id` - View schedule

#### Shop Floor (1 page)
- `/production/shopfloor` - Shop floor control

#### Work Orders (4 pages)
- `/production/work-orders` - Work orders list
- `/production/work-orders/add` - Add work order
- `/production/work-orders/edit/:id` - Edit work order
- `/production/work-orders/view/:id` - View work order

---

### 12. PROJECT MANAGEMENT (34 pages)

**Module Dashboard**: `/project-management`

- `/project-management/analytics` - Project analytics
- `/project-management/budget` - Project budget
- `/project-management/change-orders` - Change orders
- `/project-management/commissioning` - Commissioning
- `/project-management/create` - Create project
- `/project-management/customer-acceptance` - Customer acceptance
- `/project-management/dashboard` - Project dashboard
- `/project-management/deliverables` - Deliverables
- `/project-management/documents` - Project documents
- `/project-management/installation-tracking` - Installation tracking
- `/project-management/issues` - Project issues
- `/project-management/labor-tracking` - Labor tracking
- `/project-management/material-consumption` - Material consumption
- `/project-management/milestone-templates` - Milestone templates
- `/project-management/mrp` - Project MRP
- `/project-management/profitability` - Profitability analysis
- `/project-management/progress` - Project progress
- `/project-management/project-costing` - Project costing
- `/project-management/project-types` - Project types
- `/project-management/quality-inspection` - Quality inspection
- `/project-management/reports` - Project reports
- `/project-management/resource-allocation` - Resource allocation
- `/project-management/resource-utilization` - Resource utilization
- `/project-management/resources` - Resources
- `/project-management/schedule` - Project schedule
- `/project-management/settings` - Project settings
- `/project-management/site-issues` - Site issues
- `/project-management/site-survey` - Site survey
- `/project-management/tasks` - Project tasks
- `/project-management/templates` - Project templates
- `/project-management/timeline` - Project timeline
- `/project-management/view/:id` - View project
- `/project-management/wbs` - Work breakdown structure

---

### 13. PROJECTS (5 pages)

**Module Dashboard**: `/projects`

- `/projects/commissioning` - Project commissioning
- `/projects/planning` - Project planning
- `/projects/resources` - Project resources
- `/projects/tracking` - Project tracking

---

### 14. REPORTS (3 pages)

- `/reports/analytics` - Analytics reports
- `/reports/custom` - Custom reports
- `/reports/dashboards` - Report dashboards

---

### 15. RFQ (3 pages)

- `/rfq/add` - Create RFQ
- `/rfq/edit/:id` - Edit RFQ
- `/rfq/view/:id` - View RFQ

---

### 16. SALES (5 pages)

**Module Dashboard**: `/sales`

- `/sales/handover` - Sales handover
- `/sales/orders` - Sales orders
- `/sales/quotations` - Sales quotations
- `/sales/rfp` - RFP management

---

### 17. SUPPORT (3 pages)

- `/support/incidents` - Support incidents
- `/support/knowledge` - Knowledge base
- `/support/tickets` - Support tickets

---

### 18. WORKFLOW (3 pages)

- `/workflow/approvals` - Workflow approvals
- `/workflow/automation` - Workflow automation
- `/workflow/templates` - Workflow templates

---

## Navigation Structure Recommendations

### Recommended Sidebar Organization:

1. **Dashboard** (Main overview)

2. **CRM**
   - Leads
   - Opportunities
   - Customers
   - Contacts
   - Interactions

3. **Sales**
   - Quotations
   - Orders
   - RFP
   - Handover

4. **Estimation**
   - BOQ
   - Costing
   - Pricing

5. **Procurement**
   - Vendors
   - Purchase Requisitions
   - Purchase Orders
   - RFQ/RFP
   - GRN
   - Vendor Management
   - Analytics & Reporting
   - Advanced Features (collapsed by default)

6. **Production**
   - Work Orders
   - BOM
   - Scheduling
   - Shop Floor
   - Quality Control
   - MRP
   - Planning & Capacity

7. **Inventory**
   - Stock
   - Movements
   - Transfers
   - Warehouse

8. **Project Management**
   - Dashboard
   - Projects
   - Tasks & Timeline
   - Resources
   - Budget & Costing
   - Quality & Commissioning
   - Reports & Analytics

9. **Finance**
   - Dashboard
   - Accounting
   - Invoices & Payments
   - Receivables & Payables
   - Banking & Cash
   - Budgeting
   - Reports
   - Advanced (Assets, Tax, Consolidation, etc.)

10. **HR**
    - Employees
    - Attendance
    - Leave
    - Payroll
    - Performance

11. **Logistics**
    - Shipping
    - Tracking
    - Carriers
    - Master Data (collapsed)

12. **After-Sales Service**
    - Dashboard
    - Service Requests
    - Field Service
    - Installations
    - Service Contracts
    - Warranties
    - Billing

13. **Reports**
    - Analytics
    - Custom Reports
    - Dashboards

14. **Common Masters**
    - All master data (sub-menu or separate section)

15. **Workflow**
    - Approvals
    - Automation
    - Templates

16. **Support**
    - Tickets
    - Incidents
    - Knowledge Base

17. **IT Admin**
    - Users
    - Roles
    - System
    - Audit

---

## Implementation Notes

### For Sidebar Menu:

1. **Top-level items** should link to module dashboards (e.g., `/finance`, `/crm`, etc.)

2. **Sub-menu items** should link to main list pages (e.g., `/finance/invoices`, `/crm/leads`)

3. **Detail pages** (add, edit, view) should NOT be in the sidebar - they are navigated to via buttons/links from list pages

4. **Dynamic routes** use `:id` parameter (e.g., `/crm/leads/view/:id`)

5. **Grouping strategy**:
   - Group related subsections under their module
   - Use collapsible sections for modules with many subsections (Finance, Procurement, Project Management)
   - Consider "favorite" or "recent" sections for frequently accessed pages

### Priority Routes (Most likely to be accessed):

1. Module dashboards (all `/module-name` routes)
2. Main list pages (all `/module/feature` routes without additional segments)
3. Common workflows: add/create, view, edit pages

### Route Pattern Guidelines:

- **List pages**: `/module/feature`
- **Add/Create**: `/module/feature/add` or `/module/feature/create`
- **View details**: `/module/feature/view/:id`
- **Edit**: `/module/feature/edit/:id`
- **Special actions**: `/module/feature/action/:id` (e.g., `/after-sales-service/service-contracts/renew/:id`)

---

## Missing from Sidebar Analysis

Based on the comprehensive scan, the following pages exist but may not be in the current sidebar:

### High Priority (Core Operations):
- All After-Sales Service pages (30 pages)
- Project Management detailed pages (34 pages)
- Common Masters (55 master data pages)
- Finance advanced features (Analytics, Assets, Consolidation, etc.)
- Procurement advanced features (Strategic Sourcing, Supplier Scorecard, etc.)
- Logistics master data pages

### Medium Priority:
- Reports module (Analytics, Custom Reports, Dashboards)
- Workflow module (Approvals, Automation, Templates)
- Support module (Tickets, Incidents, Knowledge Base)

### Navigation Improvements Needed:

1. **Add complete After-Sales Service section** to sidebar
2. **Expand Finance module** with all subsections
3. **Add Procurement advanced features** (currently missing)
4. **Create Common Masters section** with all 55 master data pages
5. **Add Project Management** comprehensive navigation
6. **Include Logistics master data** pages
7. **Add Reports, Workflow, and Support** modules

---

## JSON Structure Available

A complete JSON structure has been created at:
`D:\KreupAI\ManufacturingOS-1\complete_routes_structure.json`

This file contains:
- Module names and routes
- Subsections with pages
- Page types (list, add, edit, view, detail)
- Route depth information

Use this file to programmatically generate your sidebar navigation menu.

---

## Files Generated

1. **all_pages.txt** - Complete list of all 403 page.tsx files with absolute paths
2. **routes_mapping.txt** - Organized route mapping by module and subsection
3. **complete_routes_structure.json** - Structured JSON for sidebar implementation
4. **COMPLETE_ROUTES_DOCUMENTATION.md** - This comprehensive documentation (this file)

---

**Generated**: 2025-10-19
**Total Pages Scanned**: 403
**Total Modules**: 18
**Base Directory**: `D:\KreupAI\ManufacturingOS-1\b3-erp\frontend\src\app\(modules)`
