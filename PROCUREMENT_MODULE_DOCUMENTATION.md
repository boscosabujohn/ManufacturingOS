# Procurement Module - Complete Documentation

## Table of Contents
1. [Module Overview](#module-overview)
2. [Feature Modules](#feature-modules)
3. [Common Masters (Lookup Tables)](#common-masters-lookup-tables)
4. [Normalized Database Schema](#normalized-database-schema)
5. [Entity Relationships](#entity-relationships)
6. [API Endpoints](#api-endpoints)
7. [Data Flow & Business Logic](#data-flow--business-logic)

---

## Module Overview

The Procurement module is a comprehensive system for managing the entire procure-to-pay lifecycle, from purchase requisitions through supplier management to strategic sourcing. It consists of 10 major feature areas with 80+ pages.

### Key Capabilities
- **Purchase Requisition Workflow**: Submit, approve, track, and convert requisitions to purchase orders
- **Purchase Order Management**: Create, manage, and track purchase orders with receiving and invoicing
- **Supplier Management**: Maintain supplier database, performance tracking, and collaboration
- **Contract Management**: Manage supplier contracts, agreements, and compliance
- **RFQ/RFP Management**: Run competitive bidding processes with quote comparison
- **Goods Receipt Note (GRN)**: Receive and inspect goods against purchase orders
- **Procurement Analytics**: Track spend, savings, supplier performance, and compliance
- **Approval Workflows**: Multi-level approval routing with configurable rules
- **Budget Tracking**: Monitor budget allocation, consumption, and variances
- **Automation & Integration**: Automated workflows, supplier portals, and system integrations

---

## Feature Modules

### 1. PURCHASE REQUISITIONS Module
**Purpose**: Manage internal purchase requests with approval workflows

**Pages**:
- `/procurement/purchase-requisition-workflow` - Main requisition dashboard with workflow tracking

**Key Features**:
- **Submit Requisition**: Create new purchase requisitions with multiple line items
  - Basic information (title, department, category, priority, due date)
  - Dynamic line items with quantities, unit prices, and specifications
  - Budget code allocation
  - Business justification
  - File attachments (quotes, specifications)
  - Save as draft or submit for approval

- **Approval/Rejection**: Multi-level approval workflow
  - Approve with conditions and budget impact notes
  - Reject with detailed reasoning and alternative suggestions
  - Request additional information from requestor
  - Approval expiry dates
  - Email notifications

- **Convert to PO**: Transform approved requisitions into purchase orders
  - Auto-generate or manual PO numbers
  - Supplier selection
  - Payment terms and shipping details
  - Tax and discount calculations
  - Incoterms and currency selection
  - Shipping and billing addresses

- **Track Status**: Monitor requisition progress through workflow
  - Visual status timeline
  - Key metrics dashboard
  - Activity history with user actions
  - Related documents
  - SLA tracking

**Entities**:
- `purchase_requisitions` - Main requisition records
- `requisition_items` - Line items in requisitions
- `requisition_approvals` - Approval workflow tracking
- `requisition_status_history` - Status change audit trail

---

### 2. PURCHASE ORDERS Module
**Purpose**: Manage purchase orders from creation to completion

**Pages**:
- `/procurement/purchase-orders` - PO listing and management
- `/procurement/purchase-orders/create` - Create new PO
- `/procurement/purchase-orders/edit/[id]` - Edit PO
- `/procurement/purchase-orders/view/[id]` - View PO details with tabs (overview, items, receiving, invoices, documents)
- `/procurement/purchase-orders/templates` - PO templates
- `/procurement/purchase-orders/receiving` - Goods receipt dashboard

**Key Features**:
- PO creation from requisitions or standalone
- Multi-line item support with specifications
- Delivery schedules and partial shipments
- PO amendments and change orders
- Three-way matching (PO, GRN, Invoice)
- PO acknowledgment tracking
- Supplier performance on PO delivery

**Entities**:
- `purchase_orders` - Main PO records
- `po_line_items` - Products/services ordered
- `po_amendments` - Change orders and modifications
- `po_delivery_schedules` - Planned delivery dates
- `po_acknowledgments` - Supplier confirmations

---

### 3. SUPPLIERS Module
**Purpose**: Maintain supplier database and relationships

**Pages**:
- `/procurement/suppliers` - Supplier listing
- `/procurement/suppliers/add` - Create supplier
- `/procurement/suppliers/edit/[id]` - Edit supplier
- `/procurement/suppliers/view/[id]` - Supplier profile (tabs: overview, contacts, contracts, POs, performance, documents)
- `/procurement/suppliers/categories` - Supplier categorization
- `/procurement/suppliers/onboarding` - New supplier onboarding workflow
- `/procurement/suppliers/performance` - Supplier scorecards

**Key Features**:
- Comprehensive supplier profiles
- Supplier categorization and segmentation
- Contact management per supplier
- Performance scorecards (quality, delivery, price, service)
- Supplier risk assessment
- Compliance and certification tracking
- Payment terms and banking details
- Supplier portal access

**Entities**:
- `suppliers` - Main supplier records
- `supplier_contacts` - Contact persons
- `supplier_categories` - Supplier classifications
- `supplier_performance_scores` - Performance tracking
- `supplier_certifications` - Compliance documents
- `supplier_bank_accounts` - Payment information

---

### 4. SUPPLIER COLLABORATION Module
**Purpose**: Enable collaborative processes with suppliers

**Pages**:
- `/procurement/supplier-collaboration` - Collaboration dashboard

**Key Features**:
- **Share Forecast**: Share demand forecasts with suppliers
  - Forecast periods and types (demand, capacity, revenue)
  - Dynamic forecast items with quantities and units
  - Historical data sharing options
  - Confidential forecast marking
  - Automatic notifications

- **Request Quotes**: Send RFQ to suppliers
  - RFQ title and deadlines
  - Multiple quote items with specifications
  - Target prices and quantities
  - Payment and delivery terms
  - Allow counter-offers
  - Multi-supplier quote requests

- **Collaborate on Design**: Joint product/service development
  - Design project initialization
  - Shared specifications and requirements
  - NDA agreements
  - Timeline and milestones
  - Resource allocation
  - IP rights management

- **Message Suppliers**: Direct communication channel
  - Subject-based messaging
  - Priority flagging
  - File attachments
  - Read receipts
  - Message threading

**Entities**:
- `supplier_forecasts` - Shared forecast data
- `supplier_rfqs` - Request for quotations
- `supplier_quotes` - Supplier quote responses
- `supplier_collaborations` - Design projects
- `supplier_messages` - Communication threads

---

### 5. STRATEGIC SOURCING Module
**Purpose**: Execute strategic procurement initiatives

**Pages**:
- `/procurement/strategic-sourcing` - Strategic sourcing dashboard

**Key Features**:
- **Create Sourcing Project**: Define strategic initiatives
  - Project title and objectives
  - Category and spend scope
  - Target savings goals
  - Project timeline and phases
  - Team member assignment
  - Stakeholder identification
  - Approval workflow configuration

- **Analyze Spend**: Comprehensive spend analysis
  - Analysis types (category, supplier, department, time-based)
  - Time range selection
  - Comparison periods
  - Savings opportunity identification
  - Spend categories and classifications
  - Variance analysis

- **Develop Strategy**: Create category sourcing strategies
  - Category selection
  - Strategy type (consolidation, competitive bidding, partnership, insourcing)
  - Market analysis
  - Risk assessment
  - Implementation plan
  - Success metrics

- **Track Implementation**: Monitor project progress
  - Project selection and overview
  - Milestone tracking with statuses
  - KPI monitoring (savings, supplier count, cycle time)
  - Risk and issue management
  - Status updates and notes

**Entities**:
- `sourcing_projects` - Strategic initiatives
- `sourcing_strategies` - Category strategies
- `spend_analysis` - Spend data and insights
- `sourcing_milestones` - Project milestones
- `savings_tracking` - Savings realization

---

### 6. RFQ/RFP Module
**Purpose**: Manage competitive bidding processes

**Pages**:
- `/procurement/rfq-rfp` - RFQ/RFP dashboard

**Key Features**:
- **Create RFQ/RFP**: Initiate bidding process
  - Title and description
  - RFQ vs RFP type selection
  - Category and budget
  - Submission deadlines
  - Item specifications with quantities
  - Evaluation criteria
  - Terms and conditions

- **Invite Suppliers**: Supplier selection for bidding
  - Multi-supplier invitation
  - Supplier categorization
  - Invitation emails
  - Access credentials
  - Deadline reminders

- **Compare Quotes**: Analyze supplier responses
  - Side-by-side comparison
  - Score calculation based on criteria
  - Price analysis
  - Technical evaluation
  - Recommendations

- **Award Contract**: Finalize supplier selection
  - Winner selection
  - Contract terms
  - Award notifications
  - Loser feedback

**Entities**:
- `rfqs` - Request for quotation records
- `rfp` - Request for proposal records
- `rfq_items` - Specification line items
- `rfq_invitations` - Supplier invites
- `rfq_responses` - Supplier quotes/proposals
- `quote_evaluations` - Scoring and comparison
- `contract_awards` - Winner selection

---

### 7. GOODS RECEIPT NOTE (GRN) Module
**Purpose**: Receive and inspect incoming goods

**Pages**:
- `/procurement/grn` - GRN dashboard

**Key Features**:
- **Create GRN**: Record goods receipt
  - PO selection and validation
  - Received quantities vs ordered
  - Batch and serial number tracking
  - Quality inspection results
  - Delivery note reference
  - Receiving location
  - Inspector assignment

- **Quality Inspection**: Assess received goods
  - Inspection criteria checklist
  - Pass/fail/partial acceptance
  - Defect documentation
  - Photos and attachments
  - Inspector notes
  - Disposition (accept, reject, return)

- **Create Discrepancy Report**: Document issues
  - Discrepancy type (quantity, quality, damage)
  - Affected items
  - Severity level
  - Root cause analysis
  - Corrective actions
  - Supplier notification

- **Schedule Return**: Process returns to supplier
  - Return reason
  - Items and quantities
  - RMA number
  - Pickup logistics
  - Credit note request

**Entities**:
- `goods_receipt_notes` - GRN records
- `grn_line_items` - Received items detail
- `quality_inspections` - Inspection results
- `grn_discrepancies` - Issue reports
- `supplier_returns` - Return shipments

---

### 8. CONTRACTS Module
**Purpose**: Manage supplier contracts and agreements

**Pages**:
- `/procurement/contracts` - Contract listing

**Key Features**:
- **Create Contract**: New supplier agreements
  - Contract type and category
  - Supplier selection
  - Contract value and currency
  - Term dates and duration
  - Payment terms
  - Service level agreements
  - Deliverables
  - Auto-renewal settings

- **Track Renewals**: Monitor expiring contracts
  - Renewal dashboard
  - Upcoming expirations
  - Renewal vs termination decisions
  - Renewal terms negotiation
  - Notification workflows

- **Manage Amendments**: Contract modifications
  - Amendment type
  - Change description
  - Financial impact
  - Approval workflow
  - Version control

- **Monitor Compliance**: Ensure contract adherence
  - Compliance checklist
  - Deliverable tracking
  - SLA monitoring
  - Penalty calculations
  - Performance obligations

**Entities**:
- `supplier_contracts` - Main contract records
- `contract_terms` - Specific clauses and conditions
- `contract_deliverables` - Obligations and milestones
- `contract_amendments` - Modifications
- `contract_renewals` - Renewal tracking
- `contract_compliance` - Adherence monitoring

---

### 9. ANALYTICS Module
**Purpose**: Procurement intelligence and reporting

**Pages**:
- `/procurement/analytics` - Analytics dashboard

**Key Features**:
- **Spend Analytics**: Comprehensive spend visibility
  - Spend by category, supplier, department
  - Time-series trend analysis
  - Budget vs actual comparison
  - Savings tracking
  - Maverick spend identification

- **Supplier Performance**: Scorecard metrics
  - On-time delivery rate
  - Quality acceptance rate
  - Price competitiveness
  - Responsiveness scores
  - Defect rates
  - Compliance ratings

- **Contract Analytics**: Contract portfolio analysis
  - Contract value distribution
  - Expiration calendar
  - Utilization rates
  - Savings from negotiations
  - Amendment frequency

- **Process Metrics**: Operational efficiency
  - Requisition cycle time
  - PO processing time
  - Approval bottlenecks
  - GRN turnaround time
  - Invoice matching rates

- **Compliance Reports**: Regulatory and policy adherence
  - Policy compliance rate
  - Unauthorized purchases
  - Preferred supplier usage
  - Contract compliance
  - Approval override tracking

**Entities**:
- `procurement_metrics` - KPI calculations
- `spend_analytics` - Spend data aggregations
- `supplier_scorecards` - Performance ratings
- `compliance_reports` - Audit trails

---

### 10. APPROVALS Module
**Purpose**: Workflow and approval management

**Pages**:
- `/procurement/approvals` - Approval dashboard

**Key Features**:
- **Approval Workflows**: Configure routing rules
  - Approval matrix by amount, category, department
  - Multi-level approval chains
  - Parallel vs sequential approvals
  - Escalation rules
  - Delegation settings

- **Pending Approvals**: Action required queue
  - Approve/reject/request info actions
  - Approval details and justifications
  - Supporting documents
  - Approval history
  - Bulk approval capabilities

- **Approval History**: Audit trail
  - All approval actions
  - Approver details
  - Timestamps
  - Comments and notes
  - Override tracking

**Entities**:
- `approval_workflows` - Workflow definitions
- `approval_rules` - Routing logic
- `approval_requests` - Pending approvals
- `approval_history` - Audit trail
- `approval_delegations` - Temporary delegates

---

### 11. BUDGET TRACKING Module
**Purpose**: Monitor procurement budget allocation and usage

**Pages**:
- `/procurement/budget-tracking` - Budget dashboard

**Key Features**:
- **Budget Allocation**: Set budget limits
  - Department/category budgets
  - Time period (monthly, quarterly, annual)
  - Budget owners
  - Carryover rules

- **Budget Consumption**: Track spending
  - Real-time budget usage
  - Committed vs actual spend
  - Available balance
  - Variance analysis
  - Burn rate calculation

- **Budget Alerts**: Proactive notifications
  - Threshold alerts (80%, 90%, 100%)
  - Overspend warnings
  - Forecast alerts

- **Budget Adjustments**: Reallocate budgets
  - Transfer between categories
  - Increase/decrease limits
  - Approval workflow
  - Audit trail

**Entities**:
- `procurement_budgets` - Budget definitions
- `budget_allocations` - Departmental allocations
- `budget_transactions` - Spending records
- `budget_adjustments` - Budget changes
- `budget_alerts` - Notification rules

---

### 12. AUTOMATION Module
**Purpose**: Automate procurement processes

**Pages**:
- `/procurement/automation` - Automation dashboard

**Key Features**:
- **Auto-Reordering**: Automatic replenishment
  - Reorder point setting
  - Lead time calculation
  - Safety stock levels
  - Preferred suppliers
  - Auto-PO generation

- **Workflow Automation**: Process automation
  - Trigger definitions
  - Action workflows
  - Email notifications
  - Data synchronization

- **Scheduled Tasks**: Recurring processes
  - Budget review reminders
  - Contract renewal alerts
  - Performance report generation
  - Data cleanup jobs

- **Integration Management**: External system sync
  - ERP integration
  - Accounting system sync
  - Supplier portal connections
  - Email integration
  - API management

**Entities**:
- `automation_rules` - Automation definitions
- `reorder_rules` - Auto-replenishment settings
- `scheduled_jobs` - Recurring tasks
- `integration_configs` - System connections
- `automation_logs` - Execution history

---

## Common Masters (Lookup Tables)

These are reference/lookup tables used across multiple features for data consistency and normalization.

### 1. **User & Organization Masters**

```sql
-- Users Table (from auth system)
users
├── id (PK)
├── email
├── first_name
├── last_name
├── role (buyer, approver, manager, admin)
├── department
├── cost_center
├── approval_limit
├── is_active
├── created_at
└── updated_at

-- Departments Table
departments
├── id (PK)
├── name
├── code
├── manager_id (FK -> users)
├── cost_center
├── budget_allocated
├── is_active
├── created_at
└── updated_at

-- Cost Centers Table
cost_centers
├── id (PK)
├── code
├── name
├── department_id (FK -> departments)
├── budget_owner_id (FK -> users)
└── is_active
```

### 2. **Supplier Masters**

```sql
-- Supplier Types Table
supplier_types
├── id (PK)
├── name (Manufacturer, Distributor, Service Provider, Contractor)
├── description
└── requires_certification

-- Supplier Categories Table
supplier_categories
├── id (PK)
├── name
├── parent_id (FK -> supplier_categories)
└── description

-- Supplier Status Table
supplier_statuses
├── id (PK)
├── name (Active, Inactive, Blocked, Pending Approval)
├── can_transact
└── is_active

-- Supplier Risk Levels Table
supplier_risk_levels
├── id (PK)
├── name (Low, Medium, High, Critical)
├── level (1-4)
└── color_code
```

### 3. **Product & Category Masters**

```sql
-- Procurement Categories Table
procurement_categories
├── id (PK)
├── name
├── code
├── parent_id (FK -> procurement_categories)
├── category_manager_id (FK -> users)
├── description
└── is_active

-- Unit of Measure Table
units_of_measure
├── id (PK)
├── name (Each, Box, Kg, Liter, Hour, etc.)
├── abbreviation
├── unit_type (quantity, weight, volume, time)
└── conversion_factor

-- Product/Service Catalog Table
procurement_catalog
├── id (PK)
├── item_code
├── description
├── category_id (FK -> procurement_categories)
├── unit_of_measure_id (FK -> units_of_measure)
├── standard_price
├── preferred_supplier_id (FK -> suppliers)
├── lead_time_days
├── is_active
├── created_at
└── updated_at
```

### 4. **Status & Workflow Masters**

```sql
-- Requisition Statuses Table
requisition_statuses
├── id (PK)
├── name (Draft, Pending Approval, Approved, Rejected, Cancelled, Converted)
├── sequence
├── is_final
├── status_type (open, closed, cancelled)
└── is_active

-- PO Statuses Table
po_statuses
├── id (PK)
├── name (Draft, Sent, Acknowledged, Partially Received, Received, Closed, Cancelled)
├── sequence
├── allows_editing
├── is_final
└── is_active

-- Contract Statuses Table
contract_statuses
├── id (PK)
├── name (Draft, Under Review, Approved, Active, Expired, Terminated)
├── sequence
├── is_active_status
└── allows_amendments

-- RFQ Statuses Table
rfq_statuses
├── id (PK)
├── name (Draft, Published, Quote Collection, Evaluation, Awarded, Cancelled)
├── sequence
└── is_active
```

### 5. **Priority & Urgency Masters**

```sql
-- Priorities Table
priorities
├── id (PK)
├── name (Low, Medium, High, Urgent, Critical)
├── level (1-5)
├── sla_hours
└── color_code

-- Urgency Levels Table
urgency_levels
├── id (PK)
├── name (Standard, Rush, Emergency)
├── multiplier (for lead time calculation)
└── additional_cost_percent
```

### 6. **Payment & Financial Masters**

```sql
-- Payment Terms Table
payment_terms
├── id (PK)
├── name (Net 30, Net 60, 2/10 Net 30, Immediate, COD)
├── days
├── discount_percent
├── discount_days
└── is_active

-- Currencies Table
currencies
├── id (PK)
├── code (USD, EUR, GBP, JPY)
├── name
├── symbol
├── exchange_rate
├── is_base_currency
└── updated_at

-- Tax Codes Table
tax_codes
├── id (PK)
├── code
├── description
├── rate_percent
├── is_inclusive
└── is_active

-- Incoterms Table
incoterms
├── id (PK)
├── code (FOB, CIF, DDP, EXW, FCA)
├── name
├── description
└── responsibility_transfer_point
```

### 7. **Location & Address Masters**

```sql
-- Delivery Locations Table
delivery_locations
├── id (PK)
├── name
├── location_code
├── address_line1
├── address_line2
├── city
├── state
├── country
├── postal_code
├── contact_name
├── contact_phone
├── is_active
└── is_default

-- Warehouses Table
warehouses
├── id (PK)
├── name
├── code
├── location_id (FK -> delivery_locations)
├── manager_id (FK -> users)
├── capacity
└── is_active
```

### 8. **Contract & Agreement Masters**

```sql
-- Contract Types Table
contract_types
├── id (PK)
├── name (Fixed Price, Time & Materials, Cost Plus, Blanket Order)
├── description
├── requires_deliverables
└── is_active

-- SLA Types Table
sla_types
├── id (PK)
├── name (Delivery Time, Response Time, Uptime, Quality)
├── measurement_unit
└── description

-- Amendment Types Table
amendment_types
├── id (PK)
├── name (Price Change, Scope Change, Term Extension, Deliverable Modification)
├── requires_approval
└── description
```

### 9. **Quality & Inspection Masters**

```sql
-- Inspection Types Table
inspection_types
├── id (PK)
├── name (Receiving Inspection, In-Process, Final, Sampling)
├── description
└── default_sample_size_percent

-- Quality Criteria Table
quality_criteria
├── id (PK)
├── name
├── category_id (FK -> procurement_categories)
├── measurement_type (visual, measurement, functional)
├── acceptance_criteria
└── is_mandatory

-- Defect Types Table
defect_types
├── id (PK)
├── name (Damaged, Wrong Item, Expired, Counterfeit, Substandard)
├── severity (Minor, Major, Critical)
└── default_action (Accept, Reject, Return)

-- Disposition Codes Table
disposition_codes
├── id (PK)
├── code
├── name (Accept, Reject, Return, Use As-Is, Rework)
├── creates_discrepancy
└── creates_return
```

### 10. **Document & Template Masters**

```sql
-- Document Types Table
document_types
├── id (PK)
├── name (Quote, Invoice, Contract, Specification, Certificate)
├── file_extensions_allowed
├── max_size_mb
└── is_mandatory

-- Template Categories Table
template_categories
├── id (PK)
├── name (PO Templates, Contract Templates, Email Templates)
└── description

-- Email Templates Table
email_templates
├── id (PK)
├── name
├── template_type (PO Sent, Approval Request, Contract Expiry)
├── subject
├── body_html
├── body_text
├── is_active
└── created_at
```

### 11. **Approval & Workflow Masters**

```sql
-- Approval Types Table
approval_types
├── id (PK)
├── name (Amount-Based, Category-Based, Department-Based, Custom)
└── description

-- Approval Levels Table
approval_levels
├── id (PK)
├── level_number (1, 2, 3, 4)
├── name (Supervisor, Manager, Director, VP)
└── default_sla_hours

-- Escalation Rules Table
escalation_rules
├── id (PK)
├── entity_type (requisition, po, contract)
├── trigger_condition
├── escalate_after_hours
├── escalate_to_role
└── is_active
```

### 12. **Performance & Metrics Masters**

```sql
-- Supplier Performance Metrics Table
performance_metrics
├── id (PK)
├── metric_name (On-Time Delivery, Quality Rate, Response Time, Price)
├── measurement_unit
├── weight_percent (for scorecard calculation)
├── target_value
└── is_active

-- KPI Definitions Table
kpi_definitions
├── id (PK)
├── kpi_name
├── kpi_category (Cost, Quality, Delivery, Efficiency)
├── calculation_formula
├── target_value
├── unit
└── is_active
```

---

## Normalized Database Schema

### Core Entity Tables

#### 1. PURCHASE_REQUISITIONS Table

```sql
CREATE TABLE purchase_requisitions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requisition_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    department_id UUID REFERENCES departments(id) NOT NULL,
    category_id UUID REFERENCES procurement_categories(id) NOT NULL,
    priority_id UUID REFERENCES priorities(id) NOT NULL,

    -- Dates
    requisition_date DATE DEFAULT CURRENT_DATE,
    required_by_date DATE NOT NULL,

    -- Requestor Information
    requestor_id UUID REFERENCES users(id) NOT NULL,
    requestor_department_id UUID REFERENCES departments(id) NOT NULL,

    -- Budget
    budget_code VARCHAR(50),
    cost_center_id UUID REFERENCES cost_centers(id),
    estimated_total DECIMAL(15,2),

    -- Delivery
    delivery_location_id UUID REFERENCES delivery_locations(id) NOT NULL,
    delivery_notes TEXT,

    -- Status & Workflow
    status_id UUID REFERENCES requisition_statuses(id) NOT NULL,
    current_approval_level INT DEFAULT 1,
    approval_level_required INT,

    -- Business Justification
    justification TEXT NOT NULL,

    -- Conversion
    is_converted BOOLEAN DEFAULT FALSE,
    converted_to_po_id UUID REFERENCES purchase_orders(id),
    converted_date TIMESTAMP,
    converted_by_id UUID REFERENCES users(id),

    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_requisition_requestor (requestor_id),
    INDEX idx_requisition_status (status_id),
    INDEX idx_requisition_department (department_id),
    INDEX idx_requisition_required_date (required_by_date),
    INDEX idx_requisition_number (requisition_number)
);
```

#### 2. REQUISITION_ITEMS Table

```sql
CREATE TABLE requisition_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requisition_id UUID REFERENCES purchase_requisitions(id) ON DELETE CASCADE,

    -- Item Details
    line_number INT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES procurement_categories(id),
    catalog_item_id UUID REFERENCES procurement_catalog(id),

    -- Quantity & Pricing
    quantity DECIMAL(15,3) NOT NULL,
    unit_of_measure_id UUID REFERENCES units_of_measure(id) NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,

    -- Supplier Preference
    preferred_supplier_id UUID REFERENCES suppliers(id),

    -- Delivery
    required_date DATE,
    delivery_location_id UUID REFERENCES delivery_locations(id),

    -- Specifications
    specifications TEXT,
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_req_item_requisition (requisition_id),
    INDEX idx_req_item_catalog (catalog_item_id)
);
```

#### 3. REQUISITION_APPROVALS Table

```sql
CREATE TABLE requisition_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    requisition_id UUID REFERENCES purchase_requisitions(id) ON DELETE CASCADE,

    -- Approval Level
    approval_level INT NOT NULL,
    approver_id UUID REFERENCES users(id) NOT NULL,

    -- Status
    status VARCHAR(50) NOT NULL, -- Pending, Approved, Rejected, Info Requested

    -- Action Details
    action_date TIMESTAMP,
    comments TEXT,
    conditions TEXT, -- Approval conditions

    -- For Info Requests
    requested_information TEXT[],

    -- For Rejections
    rejection_reason TEXT,
    alternative_suggestions TEXT,

    -- Metadata
    budget_impact_notes TEXT,
    notify_requestor BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_req_approval_requisition (requisition_id),
    INDEX idx_req_approval_approver (approver_id),
    INDEX idx_req_approval_status (status)
);
```

#### 4. PURCHASE_ORDERS Table

```sql
CREATE TABLE purchase_orders (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Source
    requisition_id UUID REFERENCES purchase_requisitions(id),
    rfq_id UUID REFERENCES rfqs(id),

    -- Supplier Information
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,
    supplier_contact_id UUID REFERENCES supplier_contacts(id),

    -- Classification
    po_type VARCHAR(50), -- Standard, Blanket, Contract, Service
    category_id UUID REFERENCES procurement_categories(id) NOT NULL,

    -- Dates
    po_date DATE DEFAULT CURRENT_DATE,
    expected_delivery_date DATE NOT NULL,
    delivery_deadline DATE,

    -- Financial
    subtotal DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) NOT NULL,
    currency_id UUID REFERENCES currencies(id) DEFAULT 'USD',

    -- Terms
    payment_terms_id UUID REFERENCES payment_terms(id) NOT NULL,
    incoterms_id UUID REFERENCES incoterms(id),
    delivery_terms TEXT,

    -- Addresses
    shipping_location_id UUID REFERENCES delivery_locations(id) NOT NULL,
    billing_location_id UUID REFERENCES delivery_locations(id) NOT NULL,

    -- Status
    status_id UUID REFERENCES po_statuses(id) NOT NULL,

    -- Acknowledgment
    is_acknowledged BOOLEAN DEFAULT FALSE,
    acknowledged_date TIMESTAMP,
    acknowledged_by VARCHAR(255),

    -- Receiving
    is_fully_received BOOLEAN DEFAULT FALSE,
    received_date DATE,

    -- Budget
    budget_code VARCHAR(50),
    cost_center_id UUID REFERENCES cost_centers(id),

    -- Assignment
    buyer_id UUID REFERENCES users(id) NOT NULL,
    department_id UUID REFERENCES departments(id) NOT NULL,

    -- Special Instructions
    special_instructions TEXT,
    internal_notes TEXT,

    -- Amendment Tracking
    has_amendments BOOLEAN DEFAULT FALSE,
    amendment_count INT DEFAULT 0,

    -- Metadata
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_po_supplier (supplier_id),
    INDEX idx_po_buyer (buyer_id),
    INDEX idx_po_status (status_id),
    INDEX idx_po_date (po_date),
    INDEX idx_po_number (po_number)
);
```

#### 5. PO_LINE_ITEMS Table

```sql
CREATE TABLE po_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    po_id UUID REFERENCES purchase_orders(id) ON DELETE CASCADE,

    -- Item Details
    line_number INT NOT NULL,
    description TEXT NOT NULL,
    category_id UUID REFERENCES procurement_categories(id),
    catalog_item_id UUID REFERENCES procurement_catalog(id),

    -- Quantity & Pricing
    quantity_ordered DECIMAL(15,3) NOT NULL,
    quantity_received DECIMAL(15,3) DEFAULT 0,
    quantity_pending DECIMAL(15,3) NOT NULL,
    unit_of_measure_id UUID REFERENCES units_of_measure(id) NOT NULL,

    -- Pricing
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL,

    -- Delivery
    required_date DATE,
    promised_date DATE,
    delivery_location_id UUID REFERENCES delivery_locations(id),

    -- Specifications
    specifications TEXT,
    part_number VARCHAR(100),
    manufacturer VARCHAR(255),

    -- Receiving Status
    is_fully_received BOOLEAN DEFAULT FALSE,
    last_received_date DATE,

    -- Notes
    notes TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_po_line_po (po_id),
    INDEX idx_po_line_catalog (catalog_item_id)
);
```

#### 6. SUPPLIERS Table

```sql
CREATE TABLE suppliers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_code VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    website VARCHAR(255),

    -- Classification
    supplier_type_id UUID REFERENCES supplier_types(id),
    supplier_category_id UUID REFERENCES supplier_categories(id),
    status_id UUID REFERENCES supplier_statuses(id) NOT NULL,

    -- Tax & Legal
    tax_id VARCHAR(50),
    vat_number VARCHAR(50),
    registration_number VARCHAR(100),

    -- Address
    address_line1 TEXT,
    address_line2 TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100),
    postal_code VARCHAR(20),

    -- Contact Information
    phone VARCHAR(50),
    fax VARCHAR(50),
    email VARCHAR(255),

    -- Financial
    payment_terms_id UUID REFERENCES payment_terms(id),
    currency_id UUID REFERENCES currencies(id),
    credit_limit DECIMAL(15,2),

    -- Performance
    performance_score DECIMAL(5,2), -- 0-100
    on_time_delivery_rate DECIMAL(5,2),
    quality_rating DECIMAL(5,2),
    last_evaluation_date DATE,

    -- Risk
    risk_level_id UUID REFERENCES supplier_risk_levels(id),
    is_approved BOOLEAN DEFAULT FALSE,
    approved_date DATE,
    approved_by_id UUID REFERENCES users(id),

    -- Categorization
    is_preferred BOOLEAN DEFAULT FALSE,
    is_minority_owned BOOLEAN DEFAULT FALSE,
    is_small_business BOOLEAN DEFAULT FALSE,

    -- Assignment
    category_manager_id UUID REFERENCES users(id),

    -- Supplier Portal
    portal_enabled BOOLEAN DEFAULT FALSE,
    portal_username VARCHAR(100),
    last_portal_login TIMESTAMP,

    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_supplier_name (name),
    INDEX idx_supplier_code (supplier_code),
    INDEX idx_supplier_status (status_id),
    INDEX idx_supplier_category (supplier_category_id)
);
```

#### 7. SUPPLIER_CONTACTS Table

```sql
CREATE TABLE supplier_contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,

    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    job_title VARCHAR(100),
    department VARCHAR(100),

    -- Contact Information
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(50),
    mobile VARCHAR(50),
    fax VARCHAR(50),

    -- Role
    is_primary BOOLEAN DEFAULT FALSE,
    is_decision_maker BOOLEAN DEFAULT FALSE,
    contact_type VARCHAR(50), -- Sales, Technical, Finance, Management

    -- Communication Preferences
    preferred_contact_method VARCHAR(50),
    language_preference VARCHAR(50),

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_supplier_contact_supplier (supplier_id),
    INDEX idx_supplier_contact_email (email)
);
```

#### 8. GOODS_RECEIPT_NOTES Table

```sql
CREATE TABLE goods_receipt_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_number VARCHAR(50) UNIQUE NOT NULL,

    -- Associated Records
    po_id UUID REFERENCES purchase_orders(id) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,

    -- Receipt Information
    receipt_date DATE DEFAULT CURRENT_DATE,
    delivery_note_number VARCHAR(100),
    delivery_date DATE,

    -- Location
    receiving_location_id UUID REFERENCES delivery_locations(id) NOT NULL,
    warehouse_id UUID REFERENCES warehouses(id),

    -- Status
    status VARCHAR(50), -- Draft, Pending Inspection, Accepted, Rejected, Partial

    -- Inspection
    requires_inspection BOOLEAN DEFAULT TRUE,
    inspection_completed BOOLEAN DEFAULT FALSE,
    inspection_date DATE,
    inspector_id UUID REFERENCES users(id),

    -- Overall Results
    total_items_ordered INT,
    total_items_received INT,
    total_items_accepted INT,
    total_items_rejected INT,

    -- Quality
    quality_passed BOOLEAN,
    has_discrepancies BOOLEAN DEFAULT FALSE,

    -- Transport
    carrier_name VARCHAR(255),
    tracking_number VARCHAR(100),
    vehicle_number VARCHAR(50),
    driver_name VARCHAR(100),

    -- Assignment
    received_by_id UUID REFERENCES users(id) NOT NULL,

    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_grn_po (po_id),
    INDEX idx_grn_supplier (supplier_id),
    INDEX idx_grn_date (receipt_date),
    INDEX idx_grn_number (grn_number)
);
```

#### 9. GRN_LINE_ITEMS Table

```sql
CREATE TABLE grn_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    grn_id UUID REFERENCES goods_receipt_notes(id) ON DELETE CASCADE,
    po_line_item_id UUID REFERENCES po_line_items(id) NOT NULL,

    -- Item Details
    line_number INT NOT NULL,
    description TEXT NOT NULL,

    -- Quantities
    quantity_ordered DECIMAL(15,3) NOT NULL,
    quantity_received DECIMAL(15,3) NOT NULL,
    quantity_accepted DECIMAL(15,3) DEFAULT 0,
    quantity_rejected DECIMAL(15,3) DEFAULT 0,
    unit_of_measure_id UUID REFERENCES units_of_measure(id) NOT NULL,

    -- Batch/Serial Tracking
    batch_number VARCHAR(100),
    serial_numbers TEXT[], -- Array of serial numbers
    expiry_date DATE,
    manufacture_date DATE,

    -- Inspection
    inspection_status VARCHAR(50), -- Pending, Passed, Failed, Partial
    quality_score DECIMAL(5,2),

    -- Disposition
    disposition_code_id UUID REFERENCES disposition_codes(id),

    -- Storage
    bin_location VARCHAR(100),
    warehouse_id UUID REFERENCES warehouses(id),

    -- Notes
    notes TEXT,
    defect_notes TEXT,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_grn_line_grn (grn_id),
    INDEX idx_grn_line_po_line (po_line_item_id)
);
```

#### 10. QUALITY_INSPECTIONS Table

```sql
CREATE TABLE quality_inspections (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_number VARCHAR(50) UNIQUE NOT NULL,

    -- Associated Records
    grn_id UUID REFERENCES goods_receipt_notes(id),
    grn_line_item_id UUID REFERENCES grn_line_items(id),
    po_id UUID REFERENCES purchase_orders(id),
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,

    -- Inspection Details
    inspection_type_id UUID REFERENCES inspection_types(id) NOT NULL,
    inspection_date DATE DEFAULT CURRENT_DATE,
    inspector_id UUID REFERENCES users(id) NOT NULL,

    -- Sampling
    lot_size DECIMAL(15,3),
    sample_size DECIMAL(15,3),
    sampling_method VARCHAR(100),

    -- Results
    overall_result VARCHAR(50), -- Pass, Fail, Conditional Pass
    defects_found INT DEFAULT 0,

    -- Scoring
    quality_score DECIMAL(5,2), -- 0-100
    pass_rate DECIMAL(5,2),

    -- Disposition
    disposition_code_id UUID REFERENCES disposition_codes(id) NOT NULL,

    -- Attachments
    has_photos BOOLEAN DEFAULT FALSE,
    has_test_reports BOOLEAN DEFAULT FALSE,

    -- Metadata
    notes TEXT,
    inspector_comments TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_quality_inspection_grn (grn_id),
    INDEX idx_quality_inspection_supplier (supplier_id),
    INDEX idx_quality_inspection_date (inspection_date)
);
```

#### 11. INSPECTION_CRITERIA_RESULTS Table

```sql
CREATE TABLE inspection_criteria_results (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    inspection_id UUID REFERENCES quality_inspections(id) ON DELETE CASCADE,
    criteria_id UUID REFERENCES quality_criteria(id) NOT NULL,

    -- Result
    result VARCHAR(50), -- Pass, Fail, NA
    measured_value VARCHAR(255),
    expected_value VARCHAR(255),
    tolerance VARCHAR(100),

    -- Details
    observations TEXT,
    is_critical BOOLEAN DEFAULT FALSE,

    -- Metadata
    checked_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_criteria_result_inspection (inspection_id),
    INDEX idx_criteria_result_criteria (criteria_id)
);
```

#### 12. GRN_DISCREPANCIES Table

```sql
CREATE TABLE grn_discrepancies (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discrepancy_number VARCHAR(50) UNIQUE NOT NULL,

    -- Associated Records
    grn_id UUID REFERENCES goods_receipt_notes(id) NOT NULL,
    grn_line_item_id UUID REFERENCES grn_line_items(id),
    po_id UUID REFERENCES purchase_orders(id) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,

    -- Discrepancy Details
    discrepancy_type VARCHAR(50), -- Quantity, Quality, Damage, Wrong Item, Missing Items
    severity VARCHAR(50), -- Minor, Major, Critical

    -- Description
    description TEXT NOT NULL,

    -- Impact
    affected_quantity DECIMAL(15,3),
    financial_impact DECIMAL(15,2),

    -- Status
    status VARCHAR(50), -- Reported, Under Investigation, Resolved, Closed

    -- Root Cause
    root_cause TEXT,
    supplier_fault BOOLEAN,

    -- Resolution
    corrective_action TEXT,
    preventive_action TEXT,
    resolution_date DATE,
    resolved_by_id UUID REFERENCES users(id),

    -- Supplier Response
    supplier_notified BOOLEAN DEFAULT FALSE,
    supplier_response TEXT,
    supplier_response_date DATE,

    -- Returns
    requires_return BOOLEAN DEFAULT FALSE,
    return_created BOOLEAN DEFAULT FALSE,

    -- Assignment
    reported_by_id UUID REFERENCES users(id) NOT NULL,
    assigned_to_id UUID REFERENCES users(id),

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_discrepancy_grn (grn_id),
    INDEX idx_discrepancy_supplier (supplier_id),
    INDEX idx_discrepancy_status (status)
);
```

#### 13. SUPPLIER_RETURNS Table

```sql
CREATE TABLE supplier_returns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    return_number VARCHAR(50) UNIQUE NOT NULL,

    -- Associated Records
    grn_id UUID REFERENCES goods_receipt_notes(id),
    discrepancy_id UUID REFERENCES grn_discrepancies(id),
    po_id UUID REFERENCES purchase_orders(id) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,

    -- Return Details
    return_reason VARCHAR(100) NOT NULL,
    return_type VARCHAR(50), -- Quality Issue, Wrong Item, Damaged, Excess Quantity

    -- Dates
    return_date DATE DEFAULT CURRENT_DATE,
    pickup_scheduled_date DATE,
    pickup_actual_date DATE,

    -- RMA
    rma_number VARCHAR(100),
    rma_issued_date DATE,

    -- Status
    status VARCHAR(50), -- Initiated, Approved, Picked Up, In Transit, Received by Supplier, Closed

    -- Financial
    return_value DECIMAL(15,2),
    credit_note_requested BOOLEAN DEFAULT FALSE,
    credit_note_number VARCHAR(100),
    credit_note_amount DECIMAL(15,2),

    -- Logistics
    carrier_name VARCHAR(255),
    tracking_number VARCHAR(100),
    pickup_location_id UUID REFERENCES delivery_locations(id),

    -- Assignment
    initiated_by_id UUID REFERENCES users(id) NOT NULL,
    approved_by_id UUID REFERENCES users(id),

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_return_grn (grn_id),
    INDEX idx_return_supplier (supplier_id),
    INDEX idx_return_status (status)
);
```

#### 14. SUPPLIER_CONTRACTS Table

```sql
CREATE TABLE supplier_contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Associated Records
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,
    supplier_contact_id UUID REFERENCES supplier_contacts(id),
    rfq_id UUID REFERENCES rfqs(id),

    -- Classification
    contract_type_id UUID REFERENCES contract_types(id) NOT NULL,
    category_id UUID REFERENCES procurement_categories(id),

    -- Status
    status_id UUID REFERENCES contract_statuses(id) NOT NULL,

    -- Financial
    contract_value DECIMAL(15,2) NOT NULL,
    currency_id UUID REFERENCES currencies(id) DEFAULT 'USD',
    billing_frequency VARCHAR(50), -- One-time, Monthly, Quarterly, Annually

    -- Term
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_months INT,
    notice_period_days INT DEFAULT 30,

    -- Renewal
    auto_renew BOOLEAN DEFAULT FALSE,
    renewal_notice_days INT DEFAULT 30,
    renewal_terms TEXT,
    next_renewal_date DATE,

    -- Payment Terms
    payment_terms_id UUID REFERENCES payment_terms(id) NOT NULL,

    -- Service Levels
    has_sla BOOLEAN DEFAULT FALSE,
    sla_terms TEXT,

    -- Assignment
    contract_owner_id UUID REFERENCES users(id) NOT NULL,
    department_id UUID REFERENCES departments(id),

    -- Signatures
    requires_signature BOOLEAN DEFAULT TRUE,
    supplier_signed BOOLEAN DEFAULT FALSE,
    supplier_signed_date DATE,
    supplier_signer_name VARCHAR(255),

    company_signed BOOLEAN DEFAULT FALSE,
    company_signed_date DATE,
    company_signer_id UUID REFERENCES users(id),

    -- Legal
    governing_law VARCHAR(100),
    jurisdiction VARCHAR(100),

    -- Compliance
    compliance_required BOOLEAN DEFAULT FALSE,
    last_compliance_check_date DATE,

    -- Amendments
    has_amendments BOOLEAN DEFAULT FALSE,
    amendment_count INT DEFAULT 0,

    -- Metadata
    terms_and_conditions TEXT,
    special_terms TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_contract_supplier (supplier_id),
    INDEX idx_contract_owner (contract_owner_id),
    INDEX idx_contract_status (status_id),
    INDEX idx_contract_dates (start_date, end_date),
    INDEX idx_contract_renewal (next_renewal_date)
);
```

#### 15. RFQs Table

```sql
CREATE TABLE rfqs (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Type
    rfq_type VARCHAR(50), -- RFQ (Quote), RFP (Proposal), RFI (Information)

    -- Category
    category_id UUID REFERENCES procurement_categories(id) NOT NULL,

    -- Dates
    issue_date DATE DEFAULT CURRENT_DATE,
    submission_deadline TIMESTAMP NOT NULL,
    expected_award_date DATE,

    -- Budget
    estimated_budget DECIMAL(15,2),
    currency_id UUID REFERENCES currencies(id) DEFAULT 'USD',

    -- Status
    status_id UUID REFERENCES rfq_statuses(id) NOT NULL,

    -- Evaluation
    evaluation_criteria TEXT,
    technical_weight_percent DECIMAL(5,2) DEFAULT 70,
    price_weight_percent DECIMAL(5,2) DEFAULT 30,

    -- Terms
    payment_terms_id UUID REFERENCES payment_terms(id),
    delivery_terms TEXT,
    contract_terms TEXT,

    -- Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,
    department_id UUID REFERENCES departments(id) NOT NULL,

    -- Supplier Invitation
    total_suppliers_invited INT DEFAULT 0,
    responses_received INT DEFAULT 0,

    -- Award
    is_awarded BOOLEAN DEFAULT FALSE,
    awarded_supplier_id UUID REFERENCES suppliers(id),
    awarded_date DATE,
    award_value DECIMAL(15,2),

    -- Metadata
    notes TEXT,
    terms_and_conditions TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_rfq_owner (owner_id),
    INDEX idx_rfq_status (status_id),
    INDEX idx_rfq_deadline (submission_deadline),
    INDEX idx_rfq_number (rfq_number)
);
```

#### 16. RFQ_ITEMS Table

```sql
CREATE TABLE rfq_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,

    -- Item Details
    line_number INT NOT NULL,
    description TEXT NOT NULL,
    specifications TEXT,

    -- Quantity
    quantity DECIMAL(15,3) NOT NULL,
    unit_of_measure_id UUID REFERENCES units_of_measure(id) NOT NULL,

    -- Category
    category_id UUID REFERENCES procurement_categories(id),

    -- Target
    target_price DECIMAL(15,2),
    target_delivery_days INT,

    -- Requirements
    technical_requirements TEXT,
    quality_requirements TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_rfq_item_rfq (rfq_id)
);
```

#### 17. RFQ_INVITATIONS Table

```sql
CREATE TABLE rfq_invitations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rfq_id UUID REFERENCES rfqs(id) ON DELETE CASCADE,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,

    -- Invitation
    invited_date DATE DEFAULT CURRENT_DATE,
    invited_by_id UUID REFERENCES users(id) NOT NULL,

    -- Communication
    invitation_sent BOOLEAN DEFAULT FALSE,
    invitation_sent_date TIMESTAMP,

    -- Response
    response_status VARCHAR(50), -- Pending, Viewed, Declined, Submitted
    response_date DATE,
    viewed_date TIMESTAMP,

    -- Decline
    declined BOOLEAN DEFAULT FALSE,
    decline_reason TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_rfq_invitation_rfq (rfq_id),
    INDEX idx_rfq_invitation_supplier (supplier_id)
);
```

#### 18. RFQ_RESPONSES Table

```sql
CREATE TABLE rfq_responses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_number VARCHAR(50) UNIQUE NOT NULL,

    -- Associated Records
    rfq_id UUID REFERENCES rfqs(id) NOT NULL,
    invitation_id UUID REFERENCES rfq_invitations(id) NOT NULL,
    supplier_id UUID REFERENCES suppliers(id) NOT NULL,

    -- Submission
    submission_date TIMESTAMP NOT NULL,
    submitted_by VARCHAR(255),

    -- Status
    status VARCHAR(50), -- Draft, Submitted, Under Evaluation, Accepted, Rejected

    -- Pricing
    total_quoted_price DECIMAL(15,2) NOT NULL,
    currency_id UUID REFERENCES currencies(id) DEFAULT 'USD',

    -- Terms
    payment_terms_proposed VARCHAR(255),
    delivery_time_days INT,
    warranty_terms TEXT,

    -- Validity
    quote_validity_days INT,
    quote_expiry_date DATE,

    -- Evaluation
    technical_score DECIMAL(5,2), -- 0-100
    price_score DECIMAL(5,2), -- 0-100
    overall_score DECIMAL(5,2), -- Weighted score
    evaluation_notes TEXT,

    -- Rank
    rank INT,
    is_shortlisted BOOLEAN DEFAULT FALSE,

    -- Award
    is_awarded BOOLEAN DEFAULT FALSE,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_rfq_response_rfq (rfq_id),
    INDEX idx_rfq_response_supplier (supplier_id),
    INDEX idx_rfq_response_score (overall_score)
);
```

#### 19. RFQ_RESPONSE_ITEMS Table

```sql
CREATE TABLE rfq_response_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    response_id UUID REFERENCES rfq_responses(id) ON DELETE CASCADE,
    rfq_item_id UUID REFERENCES rfq_items(id) NOT NULL,

    -- Item Details
    line_number INT NOT NULL,

    -- Pricing
    unit_price DECIMAL(15,2) NOT NULL,
    total_price DECIMAL(15,2) NOT NULL,

    -- Delivery
    delivery_time_days INT,

    -- Compliance
    meets_specifications BOOLEAN,
    technical_notes TEXT,

    -- Alternative Offer
    is_alternative_offer BOOLEAN DEFAULT FALSE,
    alternative_description TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_rfq_response_item_response (response_id),
    INDEX idx_rfq_response_item_rfq_item (rfq_item_id)
);
```

#### 20. PROCUREMENT_BUDGETS Table

```sql
CREATE TABLE procurement_budgets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_code VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Period
    fiscal_year INT NOT NULL,
    period_type VARCHAR(50), -- Annual, Quarterly, Monthly
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,

    -- Allocation
    department_id UUID REFERENCES departments(id),
    category_id UUID REFERENCES procurement_categories(id),
    cost_center_id UUID REFERENCES cost_centers(id),

    -- Budget Amounts
    allocated_amount DECIMAL(15,2) NOT NULL,
    adjusted_amount DECIMAL(15,2),
    committed_amount DECIMAL(15,2) DEFAULT 0,
    actual_spent DECIMAL(15,2) DEFAULT 0,
    available_amount DECIMAL(15,2),

    -- Thresholds
    warning_threshold_percent DECIMAL(5,2) DEFAULT 80,
    critical_threshold_percent DECIMAL(5,2) DEFAULT 90,

    -- Status
    status VARCHAR(50), -- Active, Frozen, Closed
    is_active BOOLEAN DEFAULT TRUE,

    -- Assignment
    budget_owner_id UUID REFERENCES users(id) NOT NULL,

    -- Alerts
    alert_on_threshold BOOLEAN DEFAULT TRUE,
    alert_on_overspend BOOLEAN DEFAULT TRUE,

    -- Carryover
    allows_carryover BOOLEAN DEFAULT FALSE,
    carryover_amount DECIMAL(15,2),
    carryover_from_budget_id UUID REFERENCES procurement_budgets(id),

    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_budget_department (department_id),
    INDEX idx_budget_category (category_id),
    INDEX idx_budget_owner (budget_owner_id),
    INDEX idx_budget_period (fiscal_year, start_date, end_date)
);
```

#### 21. BUDGET_TRANSACTIONS Table

```sql
CREATE TABLE budget_transactions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    budget_id UUID REFERENCES procurement_budgets(id) NOT NULL,

    -- Transaction Details
    transaction_type VARCHAR(50), -- Committed, Spent, Released, Adjusted
    transaction_date DATE DEFAULT CURRENT_DATE,

    -- Associated Records
    entity_type VARCHAR(50), -- requisition, po, invoice, adjustment
    entity_id UUID NOT NULL,

    -- Amounts
    amount DECIMAL(15,2) NOT NULL,
    running_balance DECIMAL(15,2),

    -- Description
    description TEXT,
    reference_number VARCHAR(100),

    -- Metadata
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_budget_transaction_budget (budget_id),
    INDEX idx_budget_transaction_entity (entity_type, entity_id),
    INDEX idx_budget_transaction_date (transaction_date)
);
```

### Junction/Relationship Tables

```sql
-- Supplier Performance Scores (time-series)
CREATE TABLE supplier_performance_records (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    supplier_id UUID REFERENCES suppliers(id) ON DELETE CASCADE,
    evaluation_period VARCHAR(50), -- Monthly, Quarterly, Annual
    evaluation_date DATE NOT NULL,

    -- Metrics
    on_time_delivery_rate DECIMAL(5,2), -- 0-100
    quality_acceptance_rate DECIMAL(5,2), -- 0-100
    response_time_hours DECIMAL(8,2),
    price_competitiveness_score DECIMAL(5,2), -- 0-100
    compliance_score DECIMAL(5,2), -- 0-100

    -- Overall
    overall_score DECIMAL(5,2), -- Weighted average

    -- Calculations
    total_pos INT,
    on_time_deliveries INT,
    late_deliveries INT,
    total_items_received INT,
    items_accepted INT,
    items_rejected INT,

    -- Evaluator
    evaluated_by_id UUID REFERENCES users(id),

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_supplier_perf_supplier (supplier_id),
    INDEX idx_supplier_perf_date (evaluation_date)
);

-- Contract Deliverables
CREATE TABLE contract_deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES supplier_contracts(id) ON DELETE CASCADE,

    -- Deliverable Details
    deliverable_name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Timeline
    due_date DATE NOT NULL,
    completed_date DATE,

    -- Status
    status VARCHAR(50), -- Pending, In Progress, Completed, Delayed, Cancelled

    -- Progress
    completion_percent DECIMAL(5,2) DEFAULT 0,

    -- Assignment
    responsible_supplier_contact_id UUID REFERENCES supplier_contacts(id),
    internal_owner_id UUID REFERENCES users(id),

    -- Acceptance
    is_accepted BOOLEAN DEFAULT FALSE,
    accepted_by_id UUID REFERENCES users(id),
    accepted_date DATE,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_deliverable_contract (contract_id),
    INDEX idx_deliverable_due_date (due_date)
);

-- Contract Amendments
CREATE TABLE contract_amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    amendment_number VARCHAR(50) UNIQUE NOT NULL,
    contract_id UUID REFERENCES supplier_contracts(id) ON DELETE CASCADE,

    -- Amendment Details
    amendment_type_id UUID REFERENCES amendment_types(id) NOT NULL,
    description TEXT NOT NULL,

    -- Dates
    amendment_date DATE DEFAULT CURRENT_DATE,
    effective_date DATE NOT NULL,

    -- Status
    status VARCHAR(50), -- Draft, Pending Approval, Approved, Rejected, Active

    -- Changes
    value_change DECIMAL(15,2),
    new_contract_value DECIMAL(15,2),
    term_extension_days INT,
    new_end_date DATE,

    -- Approval
    requires_approval BOOLEAN DEFAULT TRUE,
    approved_by_id UUID REFERENCES users(id),
    approved_date DATE,

    -- Signatures
    supplier_signed BOOLEAN DEFAULT FALSE,
    company_signed BOOLEAN DEFAULT FALSE,

    -- Metadata
    reason TEXT NOT NULL,
    impact_analysis TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_amendment_contract (contract_id),
    INDEX idx_amendment_status (status)
);

-- Attachments/Documents (polymorphic)
CREATE TABLE procurement_attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- requisition, po, grn, contract, supplier, rfq, etc.
    entity_id UUID NOT NULL,

    -- File Information
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT, -- in bytes
    file_type VARCHAR(100),
    file_path VARCHAR(500) NOT NULL,

    -- Classification
    document_type_id UUID REFERENCES document_types(id),
    category VARCHAR(100),

    -- Description
    description TEXT,

    -- Security
    is_confidential BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(50), -- Public, Internal, Restricted

    -- Metadata
    uploaded_by UUID REFERENCES users(id) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_attachment_entity (entity_type, entity_id),
    INDEX idx_attachment_uploaded (uploaded_at)
);

-- Notes/Comments (polymorphic)
CREATE TABLE procurement_notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,

    -- Note Details
    title VARCHAR(255),
    content TEXT NOT NULL,

    -- Classification
    note_type VARCHAR(50), -- General, Important, Issue, Follow-up

    -- Privacy
    is_private BOOLEAN DEFAULT FALSE,
    is_pinned BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_note_entity (entity_type, entity_id),
    INDEX idx_note_created (created_at)
);

-- Approval Workflow Instances
CREATE TABLE approval_workflow_instances (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES approval_workflows(id) NOT NULL,

    -- Entity
    entity_type VARCHAR(50) NOT NULL, -- requisition, po, contract, etc.
    entity_id UUID NOT NULL,

    -- Status
    status VARCHAR(50), -- In Progress, Approved, Rejected, Cancelled

    -- Levels
    current_level INT DEFAULT 1,
    total_levels INT NOT NULL,

    -- Timing
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,

    -- Metadata
    notes TEXT,

    INDEX idx_workflow_instance_entity (entity_type, entity_id),
    INDEX idx_workflow_instance_workflow (workflow_id)
);

-- Automation Rules
CREATE TABLE automation_rules (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(255) NOT NULL,

    -- Trigger
    trigger_entity VARCHAR(50), -- requisition, po, grn, etc.
    trigger_event VARCHAR(100), -- created, updated, approved, status_changed
    trigger_conditions JSON, -- Flexible conditions

    -- Action
    action_type VARCHAR(100), -- send_email, create_task, update_field, call_api
    action_config JSON, -- Flexible action parameters

    -- Status
    is_active BOOLEAN DEFAULT TRUE,

    -- Execution
    last_executed_at TIMESTAMP,
    execution_count INT DEFAULT 0,

    -- Metadata
    description TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_automation_rule_trigger (trigger_entity, trigger_event)
);
```

---

## Entity Relationships

### Relationship Diagram

```
Users/Departments
  ↓ owns
Purchase Requisitions → approves → Requisition Approvals
  ↓ converts to
  ↓
Purchase Orders → receives → Goods Receipt Notes → inspects → Quality Inspections
  ↓                              ↓                                    ↓
  ↓                              ↓                                    ↓
  ↓                         Creates                             Creates
  ↓                              ↓                                    ↓
  ↓                         GRN Line Items                    Inspection Results
  ↓                              ↓                                    ↓
  ↓                              └──────────────┬───────────────────┘
  ↓                                              ↓
  ↓                                        Discrepancies
  ↓                                              ↓
  ↓                                        Supplier Returns
  ↓
  └─→ awarded from ← RFQs → invites → Suppliers → manages → Supplier Contacts
                      ↓                    ↓                      ↓
                      ↓                    ↓                      ↓
                  RFQ Items          Supplier Contracts    Supplier Performance
                      ↓                    ↓
                      ↓                    ↓
                RFQ Responses        Contract Deliverables
                      ↓                    ↓
              Response Items          Contract Amendments

Budget Management:
Procurement Budgets → tracks → Budget Transactions
        ↓
        ↓
  Allocates to Departments/Categories
        ↓
        ↓
  Consumed by Requisitions/POs

Collaboration:
Suppliers ← collaborates → Supplier Forecasts
                        → Supplier RFQs
                        → Supplier Messages
                        → Design Collaborations
```

### Key Relationships

1. **Requisition → PO → GRN Flow**
   - A Purchase Requisition goes through approval workflow
   - Approved Requisition is converted to Purchase Order
   - Purchase Order receipt is recorded in Goods Receipt Note
   - GRN triggers Quality Inspection
   - Discrepancies may create Supplier Returns

2. **Supplier Management**
   - Suppliers have multiple Contacts (1:M)
   - Suppliers have Contracts with Deliverables and Amendments
   - Suppliers receive Performance Scores over time
   - Suppliers participate in RFQs

3. **RFQ/RFP Process**
   - RFQ contains multiple Items
   - RFQ sends Invitations to Suppliers
   - Suppliers submit Responses with Response Items
   - Responses are evaluated and ranked
   - Winner is awarded Contract

4. **Budget Tracking**
   - Budgets allocated by Department/Category/Cost Center
   - Budget Transactions record commits and spends
   - Requisitions and POs consume budget
   - Real-time budget availability calculations

5. **Quality Management**
   - GRN triggers Quality Inspection
   - Inspection evaluates against Quality Criteria
   - Results stored in Inspection Criteria Results
   - Failed inspections create Discrepancies
   - Discrepancies may trigger Returns

6. **Contract Lifecycle**
   - Contracts have Deliverables to track
   - Contracts can have Amendments
   - Contracts have renewal dates
   - Contracts linked to Suppliers and POs

---

## API Endpoints

### Authentication & Authorization
```
POST   /api/auth/login              - User login
POST   /api/auth/logout             - User logout
POST   /api/auth/refresh            - Refresh access token
GET    /api/auth/me                 - Get current user profile
```

### Purchase Requisitions API

```
GET    /api/requisitions                  - List requisitions (with filters, pagination)
POST   /api/requisitions                  - Create new requisition
GET    /api/requisitions/:id              - Get requisition details
PUT    /api/requisitions/:id              - Update requisition
DELETE /api/requisitions/:id              - Delete requisition (soft delete)
PATCH  /api/requisitions/:id/status       - Update requisition status
POST   /api/requisitions/:id/submit       - Submit for approval
POST   /api/requisitions/:id/approve      - Approve requisition
POST   /api/requisitions/:id/reject       - Reject requisition
POST   /api/requisitions/:id/request-info - Request additional information
POST   /api/requisitions/:id/convert-po   - Convert to purchase order
GET    /api/requisitions/:id/approvals    - Get approval history
GET    /api/requisitions/:id/items        - Get requisition items
POST   /api/requisitions/:id/items        - Add item to requisition
PUT    /api/requisitions/:id/items/:itemId - Update item
DELETE /api/requisitions/:id/items/:itemId - Remove item
GET    /api/requisitions/pending-approval - Get pending approvals for current user
POST   /api/requisitions/bulk-approve     - Bulk approve requisitions
```

**Query Parameters** (for GET /api/requisitions):
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 20, max: 100)
- `status` - Filter by status
- `department` - Filter by department
- `category` - Filter by category
- `priority` - Filter by priority
- `requestor` - Filter by requestor
- `date_from` - Filter by date range start
- `date_to` - Filter by date range end
- `search` - Search in title, description
- `sort` - Sort field
- `order` - Sort order (asc, desc)

### Purchase Orders API

```
GET    /api/purchase-orders               - List purchase orders
POST   /api/purchase-orders               - Create new PO
GET    /api/purchase-orders/:id           - Get PO details
PUT    /api/purchase-orders/:id           - Update PO
DELETE /api/purchase-orders/:id           - Delete PO
POST   /api/purchase-orders/:id/send      - Send PO to supplier
POST   /api/purchase-orders/:id/acknowledge - Acknowledge PO receipt
POST   /api/purchase-orders/:id/cancel    - Cancel PO
GET    /api/purchase-orders/:id/items     - Get PO line items
POST   /api/purchase-orders/:id/items     - Add line item
PUT    /api/purchase-orders/:id/items/:itemId - Update line item
DELETE /api/purchase-orders/:id/items/:itemId - Remove line item
GET    /api/purchase-orders/:id/grns      - Get related GRNs
POST   /api/purchase-orders/:id/amend     - Create PO amendment
GET    /api/purchase-orders/:id/amendments - Get PO amendments
GET    /api/purchase-orders/:id/pdf       - Generate PO PDF
```

### Suppliers API

```
GET    /api/suppliers                     - List suppliers
POST   /api/suppliers                     - Create supplier
GET    /api/suppliers/:id                 - Get supplier details
PUT    /api/suppliers/:id                 - Update supplier
DELETE /api/suppliers/:id                 - Delete supplier
GET    /api/suppliers/:id/contacts        - Get supplier contacts
POST   /api/suppliers/:id/contacts        - Add contact
PUT    /api/suppliers/:id/contacts/:contactId - Update contact
DELETE /api/suppliers/:id/contacts/:contactId - Remove contact
GET    /api/suppliers/:id/performance     - Get performance scorecard
POST   /api/suppliers/:id/performance     - Record performance evaluation
GET    /api/suppliers/:id/contracts       - Get supplier contracts
GET    /api/suppliers/:id/pos             - Get supplier POs
GET    /api/suppliers/:id/invoices        - Get supplier invoices
POST   /api/suppliers/:id/approve         - Approve supplier
POST   /api/suppliers/:id/block           - Block supplier
POST   /api/suppliers/import              - Bulk import suppliers
GET    /api/suppliers/categories          - Get supplier categories
```

### Goods Receipt Note (GRN) API

```
GET    /api/grns                          - List GRNs
POST   /api/grns                          - Create GRN
GET    /api/grns/:id                      - Get GRN details
PUT    /api/grns/:id                      - Update GRN
DELETE /api/grns/:id                      - Delete GRN
POST   /api/grns/:id/submit               - Submit GRN
POST   /api/grns/:id/inspect              - Create quality inspection
GET    /api/grns/:id/items                - Get GRN line items
POST   /api/grns/:id/items                - Add line item
PUT    /api/grns/:id/items/:itemId        - Update line item
GET    /api/grns/:id/inspections          - Get quality inspections
POST   /api/grns/:id/discrepancy          - Report discrepancy
GET    /api/grns/:id/discrepancies        - Get discrepancies
POST   /api/grns/:id/return               - Schedule supplier return
```

### Quality Inspections API

```
GET    /api/quality-inspections           - List inspections
POST   /api/quality-inspections           - Create inspection
GET    /api/quality-inspections/:id       - Get inspection details
PUT    /api/quality-inspections/:id       - Update inspection
POST   /api/quality-inspections/:id/complete - Complete inspection
GET    /api/quality-inspections/:id/criteria - Get inspection criteria results
POST   /api/quality-inspections/:id/criteria - Record criteria result
```

### Supplier Contracts API

```
GET    /api/contracts                     - List contracts
POST   /api/contracts                     - Create contract
GET    /api/contracts/:id                 - Get contract details
PUT    /api/contracts/:id                 - Update contract
DELETE /api/contracts/:id                 - Delete contract
POST   /api/contracts/:id/sign            - Sign contract
POST   /api/contracts/:id/activate        - Activate contract
POST   /api/contracts/:id/terminate       - Terminate contract
GET    /api/contracts/:id/deliverables    - Get deliverables
POST   /api/contracts/:id/deliverables    - Add deliverable
PUT    /api/contracts/:id/deliverables/:delivId - Update deliverable
GET    /api/contracts/:id/amendments      - Get amendments
POST   /api/contracts/:id/amendments      - Create amendment
PUT    /api/contracts/:id/amendments/:amendId - Update amendment
GET    /api/contracts/renewals            - Get upcoming renewals
POST   /api/contracts/:id/renew           - Renew contract
```

### RFQ/RFP API

```
GET    /api/rfqs                          - List RFQs
POST   /api/rfqs                          - Create RFQ
GET    /api/rfqs/:id                      - Get RFQ details
PUT    /api/rfqs/:id                      - Update RFQ
DELETE /api/rfqs/:id                      - Delete RFQ
POST   /api/rfqs/:id/publish              - Publish RFQ
POST   /api/rfqs/:id/cancel               - Cancel RFQ
GET    /api/rfqs/:id/items                - Get RFQ items
POST   /api/rfqs/:id/items                - Add item
PUT    /api/rfqs/:id/items/:itemId        - Update item
DELETE /api/rfqs/:id/items/:itemId        - Remove item
POST   /api/rfqs/:id/invite-suppliers     - Invite suppliers
GET    /api/rfqs/:id/invitations          - Get invitations
GET    /api/rfqs/:id/responses            - Get supplier responses
POST   /api/rfqs/:id/responses            - Submit response (supplier portal)
GET    /api/rfqs/:id/responses/:responseId - Get response details
POST   /api/rfqs/:id/evaluate             - Evaluate responses
POST   /api/rfqs/:id/award                - Award to supplier
GET    /api/rfqs/:id/comparison           - Get quote comparison
```

### Budget Tracking API

```
GET    /api/budgets                       - List budgets
POST   /api/budgets                       - Create budget
GET    /api/budgets/:id                   - Get budget details
PUT    /api/budgets/:id                   - Update budget
DELETE /api/budgets/:id                   - Delete budget
GET    /api/budgets/:id/transactions      - Get budget transactions
POST   /api/budgets/:id/adjust            - Adjust budget allocation
GET    /api/budgets/:id/consumption       - Get budget consumption report
GET    /api/budgets/:id/alerts            - Get budget alerts
POST   /api/budgets/:id/freeze            - Freeze budget
POST   /api/budgets/:id/unfreeze          - Unfreeze budget
GET    /api/budgets/summary               - Get budget summary dashboard
```

### Analytics API

```
GET    /api/analytics/spend               - Get spend analytics
GET    /api/analytics/spend/category      - Spend by category
GET    /api/analytics/spend/supplier      - Spend by supplier
GET    /api/analytics/spend/department    - Spend by department
GET    /api/analytics/spend/trend         - Spend trend over time
GET    /api/analytics/supplier-performance - Supplier performance metrics
GET    /api/analytics/contract-portfolio  - Contract analytics
GET    /api/analytics/process-metrics     - Process efficiency metrics
GET    /api/analytics/compliance          - Compliance reports
GET    /api/analytics/savings             - Savings tracking
GET    /api/analytics/budget-variance     - Budget vs actual variance
GET    /api/analytics/dashboard           - Main analytics dashboard
POST   /api/analytics/reports             - Create custom report
GET    /api/analytics/reports/:id         - Get report data
POST   /api/analytics/reports/:id/export  - Export report (PDF/Excel)
```

### Approvals API

```
GET    /api/approvals/pending             - Get pending approvals for user
GET    /api/approvals/history             - Get approval history
POST   /api/approvals/:id/approve         - Approve item
POST   /api/approvals/:id/reject          - Reject item
POST   /api/approvals/:id/request-info    - Request more information
POST   /api/approvals/bulk-action         - Bulk approve/reject
GET    /api/approvals/workflows           - Get approval workflows
POST   /api/approvals/workflows           - Create workflow
PUT    /api/approvals/workflows/:id       - Update workflow
GET    /api/approvals/workflows/:id/rules - Get workflow rules
POST   /api/approvals/delegate            - Delegate approvals
```

### Automation API

```
GET    /api/automation/rules              - List automation rules
POST   /api/automation/rules              - Create automation rule
GET    /api/automation/rules/:id          - Get rule details
PUT    /api/automation/rules/:id          - Update rule
DELETE /api/automation/rules/:id          - Delete rule
POST   /api/automation/rules/:id/activate - Activate rule
POST   /api/automation/rules/:id/deactivate - Deactivate rule
GET    /api/automation/rules/:id/logs     - Get execution logs
GET    /api/automation/reorder-rules      - Get auto-reorder rules
POST   /api/automation/reorder-rules      - Create reorder rule
GET    /api/automation/scheduled-jobs     - Get scheduled jobs
```

### Common Master Data APIs

```
GET    /api/masters/departments           - Get departments
GET    /api/masters/cost-centers          - Get cost centers
GET    /api/masters/categories            - Get procurement categories
GET    /api/masters/units-of-measure      - Get UOMs
GET    /api/masters/payment-terms         - Get payment terms
GET    /api/masters/currencies            - Get currencies
GET    /api/masters/incoterms             - Get incoterms
GET    /api/masters/priorities            - Get priorities
GET    /api/masters/statuses              - Get statuses by entity type
GET    /api/masters/delivery-locations    - Get delivery locations
GET    /api/masters/warehouses            - Get warehouses
GET    /api/masters/quality-criteria      - Get quality criteria
GET    /api/masters/defect-types          - Get defect types
```

### API Response Format

**Success Response**:
```json
{
  "success": true,
  "data": {
    // Response data
  },
  "meta": {
    "page": 1,
    "limit": 20,
    "total": 150,
    "totalPages": 8
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      {
        "field": "required_by_date",
        "message": "Required date must be in the future"
      }
    ]
  }
}
```

---

## Data Flow & Business Logic

### Purchase Requisition Approval Flow

```
1. Requisition Submission
   ├─ Validate all required fields
   ├─ Check budget availability
   ├─ Assign requisition number
   ├─ Determine approval levels based on amount/category
   └─ Create initial approval request

2. Approval Routing
   ├─ Check approval matrix rules
   │   ├─ Amount-based routing (< $5K, $5K-$50K, > $50K)
   │   ├─ Category-based routing (IT, Services, etc.)
   │   └─ Department-based routing
   ├─ Assign to appropriate approver(s)
   ├─ Send notification emails
   └─ Start SLA timer

3. Approval Actions
   ├─ Approve
   │   ├─ Record approval with comments/conditions
   │   ├─ Check if more levels required
   │   ├─ If yes: route to next level
   │   └─ If no: mark requisition as approved
   ├─ Reject
   │   ├─ Record rejection reason
   │   ├─ Notify requestor
   │   └─ Close requisition
   └─ Request Information
       ├─ Pause approval workflow
       ├─ Send info request to requestor
       └─ Wait for response

4. Post-Approval
   ├─ Update requisition status to "Approved"
   ├─ Make available for PO conversion
   ├─ Commit budget amount
   └─ Notify requestor and buyer
```

### PO Creation and Receipt Flow

```
1. PO Creation
   ├─ From Requisition
   │   ├─ Copy approved requisition items
   │   ├─ Auto-fill delivery details
   │   └─ Inherit budget allocation
   ├─ From RFQ
   │   ├─ Use awarded supplier
   │   ├─ Copy RFQ items and prices
   │   └─ Link to RFQ record
   └─ Standalone
       ├─ Manual entry
       └─ Template-based

2. PO Sending
   ├─ Generate PO PDF
   ├─ Send to supplier email
   ├─ Track email open/delivery
   ├─ Update status to "Sent"
   └─ Start delivery timeline

3. PO Acknowledgment
   ├─ Supplier confirms receipt
   ├─ Supplier provides promised delivery date
   ├─ System updates PO status
   └─ Calculate expected delivery

4. Goods Receipt (GRN)
   ├─ Create GRN from PO
   ├─ Record received quantities
   ├─ Capture batch/serial numbers
   ├─ Record delivery note details
   └─ Update PO line item quantities

5. Quality Inspection
   ├─ Trigger automatic or manual inspection
   ├─ Evaluate against quality criteria
   ├─ Record pass/fail results
   ├─ Take photos/attach reports
   └─ Update GRN with inspection results

6. Three-Way Matching
   ├─ Match PO ↔ GRN ↔ Invoice
   ├─ Validate quantities match
   ├─ Validate prices match
   ├─ Validate calculations
   └─ Approve for payment if all match

7. Discrepancy Handling
   ├─ Identify discrepancies
   │   ├─ Quantity mismatch
   │   ├─ Quality failure
   │   ├─ Damage
   │   └─ Wrong items
   ├─ Create discrepancy report
   ├─ Notify supplier
   ├─ Determine disposition (accept/reject/return)
   └─ If return needed: create return shipment
```

### RFQ/RFP Competitive Bidding Flow

```
1. RFQ Creation
   ├─ Define requirements and specifications
   ├─ Add line items with quantities
   ├─ Set evaluation criteria and weights
   ├─ Define submission deadline
   ├─ Set payment and delivery terms
   └─ Save as draft

2. Supplier Invitation
   ├─ Select suppliers from database
   ├─ Filter by category, performance, approval status
   ├─ Send invitation emails with RFQ details
   ├─ Provide supplier portal access
   ├─ Track invitation delivery and opens
   └─ Set up reminder notifications

3. Quote Collection
   ├─ Suppliers view RFQ in portal
   ├─ Suppliers submit quotes online
   ├─ System validates completeness
   ├─ Track submission timestamps
   ├─ Send acknowledgment to suppliers
   └─ Close submission at deadline

4. Quote Evaluation
   ├─ Technical Evaluation
   │   ├─ Check specification compliance
   │   ├─ Review technical proposals
   │   ├─ Score against criteria
   │   └─ Calculate technical score
   ├─ Price Evaluation
   │   ├─ Compare quoted prices
   │   ├─ Normalize to common currency
   │   ├─ Calculate total cost of ownership
   │   └─ Calculate price score
   └─ Overall Scoring
       ├─ Apply evaluation weights
       ├─ Calculate weighted score
       ├─ Rank suppliers
       └─ Shortlist top candidates

5. Award Process
   ├─ Review evaluation results
   ├─ Conduct negotiations if needed
   ├─ Select winning supplier
   ├─ Create contract or PO
   ├─ Notify winning supplier
   ├─ Send regret letters to others
   └─ Close RFQ
```

### Supplier Performance Evaluation

```
Scoring Algorithm (Monthly/Quarterly):

1. On-Time Delivery (30% weight)
   ├─ Count total deliveries
   ├─ Count on-time deliveries
   ├─ Calculate percentage: (on-time / total) * 100
   └─ Apply weight: score * 0.30

2. Quality Rating (30% weight)
   ├─ Count total items received
   ├─ Count items accepted (passed inspection)
   ├─ Calculate acceptance rate: (accepted / total) * 100
   └─ Apply weight: score * 0.30

3. Price Competitiveness (20% weight)
   ├─ Compare supplier prices to market average
   ├─ Calculate savings/premium percentage
   ├─ Convert to 0-100 score
   └─ Apply weight: score * 0.20

4. Responsiveness (10% weight)
   ├─ Track response time to RFQs, queries
   ├─ Average response time in hours
   ├─ Score based on thresholds:
   │   ├─ < 24 hours: 100
   │   ├─ 24-48 hours: 80
   │   ├─ 48-72 hours: 60
   │   └─ > 72 hours: 40
   └─ Apply weight: score * 0.10

5. Compliance (10% weight)
   ├─ Check certifications up-to-date
   ├─ Check contract compliance
   ├─ Check documentation completeness
   ├─ Calculate compliance rate
   └─ Apply weight: score * 0.10

Overall Score = Sum of weighted scores (0-100)

Performance Ratings:
├─ 90-100: Excellent (Preferred Supplier)
├─ 75-89: Good (Approved Supplier)
├─ 60-74: Satisfactory (Monitor)
├─ 40-59: Poor (Improvement Plan Required)
└─ < 40: Unacceptable (Block/Remove)
```

### Budget Consumption Tracking

```
1. Budget Allocation
   ├─ Create budget for period
   ├─ Allocate to department/category
   ├─ Set thresholds (warning, critical)
   └─ Activate budget

2. Budget Commitment (Requisition Approved)
   ├─ Check budget availability
   ├─ If available:
   │   ├─ Create "Committed" transaction
   │   ├─ Reduce available amount
   │   └─ Allow requisition to proceed
   └─ If not available:
       ├─ Block requisition
       ├─ Notify requestor
       └─ Suggest alternatives

3. Budget Actual Spend (PO Created)
   ├─ Create "Spent" transaction
   ├─ Release "Committed" amount
   ├─ Update actual spent
   ├─ Recalculate available
   └─ Check thresholds

4. Threshold Alerts
   ├─ 80% consumed: Warning alert
   ├─ 90% consumed: Critical alert
   ├─ 100% consumed: Overspend alert
   └─ Send notifications to budget owner

5. Budget Reallocation
   ├─ Request reallocation between categories
   ├─ Require approval
   ├─ Create "Adjusted" transaction
   ├─ Update allocated amounts
   └─ Log adjustment reason

6. Period Rollover
   ├─ Close current period
   ├─ Calculate carryover (if allowed)
   ├─ Create next period budget
   ├─ Transfer carryover amount
   └─ Reset spent amounts
```

### Contract Renewal Process

```
1. Renewal Identification (90 days before expiry)
   ├─ System identifies expiring contracts
   ├─ Create renewal notification
   ├─ Send alert to contract owner
   └─ Add to renewal dashboard

2. Renewal Decision (60 days before expiry)
   ├─ Contract owner reviews:
   │   ├─ Contract performance
   │   ├─ Supplier performance
   │   ├─ Spend analysis
   │   └─ Business need
   ├─ Decision:
   │   ├─ Renew: proceed to step 3
   │   ├─ Renegotiate: initiate RFQ
   │   └─ Terminate: plan exit

3. Renewal Execution (Renew decision)
   ├─ If auto-renew enabled:
   │   ├─ Automatically extend term
   │   ├─ Update end date
   │   ├─ Notify supplier
   │   └─ Create renewal record
   └─ If manual renew:
       ├─ Negotiate new terms
       ├─ Update contract
       ├─ Obtain signatures
       └─ Activate renewed contract

4. Contract Expiry (If not renewed)
   ├─ Update status to "Expired"
   ├─ Notify stakeholders
   ├─ Archive contract
   ├─ Block new POs against contract
   └─ Close related deliverables

5. Post-Renewal
   ├─ Update next renewal date
   ├─ Reset amendment count (if applicable)
   ├─ Update contract value
   └─ Schedule next review
```

### Approval Matrix Rules

```
Requisition Approval Rules (Example):

Amount-Based Routing:
├─ $0 - $1,000
│   └─ Level 1: Department Supervisor (auto-approve if < $500)
├─ $1,001 - $5,000
│   ├─ Level 1: Department Manager
│   └─ No additional approvals
├─ $5,001 - $25,000
│   ├─ Level 1: Department Manager
│   └─ Level 2: Finance Manager
├─ $25,001 - $100,000
│   ├─ Level 1: Department Manager
│   ├─ Level 2: Finance Manager
│   └─ Level 3: Director
└─ > $100,000
    ├─ Level 1: Department Manager
    ├─ Level 2: Finance Manager
    ├─ Level 3: Director
    └─ Level 4: CFO/CEO

Category-Based Overrides:
├─ IT Equipment (any amount)
│   └─ Require IT Manager approval
├─ Professional Services
│   └─ Require Legal review if > $50K
├─ Capital Equipment
│   └─ Require VP approval regardless of amount
└─ Marketing Spend
    └─ Require CMO approval

Special Conditions:
├─ Emergency Purchases
│   └─ Expedited approval (single level, any manager)
├─ Recurring Services
│   └─ Annual approval, monthly auto-approval
└─ Blanket Orders
    └─ Approve total value, auto-approve releases
```

---

## Implementation Recommendations

### 1. Database Indexing Strategy
- Index all foreign keys for join performance
- Index frequently filtered fields (status, dates, departments, suppliers)
- Create composite indexes for common query patterns:
  - `(department_id, status_id, created_at)` on requisitions
  - `(supplier_id, po_date)` on purchase orders
  - `(budget_id, transaction_date)` on budget transactions
- Use partial indexes for active records only
- Index full-text search fields (supplier name, item description)

### 2. Data Archival Strategy
- Soft delete all records (deleted_at timestamp)
- Archive closed/completed records older than 2 years
- Maintain separate archive tables for historical data
- Keep full audit trail for 7 years (compliance)
- Implement data retention policies by entity type

### 3. Performance Optimization
- Cache master data (categories, UOMs, payment terms) in Redis
- Use database materialized views for complex analytics
- Implement pagination on all list APIs (max 100 records)
- Use lazy loading for related data
- Background jobs for heavy calculations (budget rollup, performance scoring)
- Queue system for email notifications

### 4. Security & Access Control
- Row-level security based on department/cost center
- Buyer can only see own requisitions/POs unless manager
- Budget visibility restricted to budget owners
- Supplier data accessible only to procurement team
- API rate limiting (100 requests/minute per user)
- Encrypt sensitive fields (bank accounts, tax IDs)
- Comprehensive audit logging for all data changes

### 5. API Best Practices
- RESTful conventions with resource-based URLs
- API versioning (/api/v1/)
- Consistent error handling and status codes
- Filtering, sorting, searching on all list endpoints
- Field selection (?fields=id,name,status)
- Relationship expansion (?expand=supplier,items)
- HATEOAS links for navigation
- Rate limiting headers in responses

### 6. Business Rule Engine
- Externalize approval rules to database
- Configure thresholds without code changes
- Rule versioning for audit trail
- UI for business users to manage rules
- A/B testing for workflow variations

### 7. Integration Points
- ERP integration for budget sync
- Accounting system for invoice processing
- Supplier portal for quote submission
- Email system for notifications
- Document management system for attachments
- Analytics platform for BI reporting
- Payment gateway for supplier payments

### 8. Workflow Automation
- Auto-approval based on rules
- Auto-create PO from approved requisitions
- Auto-generate GRN from PO receipt
- Auto-escalate overdue approvals
- Auto-reorder for stock replenishment
- Budget alert automation
- Contract renewal reminders

### 9. Data Validation
- Required field validation at API level
- Business rule validation (e.g., delivery date > today)
- Cross-field validation (e.g., quantity > 0)
- Budget availability check before approval
- Duplicate detection (supplier name, PO number)
- Data type and format validation
- Custom validation rules per entity

### 10. Reporting & Analytics
- Pre-built dashboards (spend, supplier, budget)
- Custom report builder
- Scheduled report generation and delivery
- Export formats (PDF, Excel, CSV)
- Data visualization library integration
- Real-time vs. batch reporting
- Drill-down capabilities

---

## Conclusion

This Procurement module provides a complete, enterprise-grade procurement management system with:
- ✅ Normalized database schema (3NF)
- ✅ Comprehensive master data tables
- ✅ RESTful API design
- ✅ Proper entity relationships
- ✅ Business logic workflows
- ✅ Scalable architecture
- ✅ Complete approval workflows
- ✅ Budget tracking and control
- ✅ Supplier performance management
- ✅ Quality management system
- ✅ RFQ/competitive bidding
- ✅ Contract lifecycle management

The schema is designed to support 100+ concurrent users, millions of records, and can be deployed on PostgreSQL, MySQL, or SQL Server with minimal modifications. The system supports the complete procure-to-pay process from requisition through payment, with comprehensive analytics and automation capabilities.
