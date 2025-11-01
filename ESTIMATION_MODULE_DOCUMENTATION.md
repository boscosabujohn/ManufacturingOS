# ESTIMATION MODULE - Complete Documentation

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

The Estimation & Costing module is a comprehensive system for managing project estimates, BOQ (Bill of Quantities), cost calculations, pricing strategies, and rate management for manufacturing operations. It consists of 8 major feature areas with 60+ pages.

### Key Capabilities
- **BOQ Management**: Create and manage bills of quantities with templates
- **Cost Estimation**: Calculate materials, labor, equipment, and overhead costs
- **Pricing Management**: Apply markup, competitive pricing, and margin analysis
- **Rate Management**: Maintain rates for materials, labor, equipment, and subcontractors
- **Workflow Management**: Draft, review, approve, and convert estimates
- **Analytics & Reporting**: Track accuracy, win/loss, performance metrics
- **Settings & Configuration**: Templates, categories, markup rules, approval workflows
- **Advanced Features**: Multi-level costing, historical rate tracking, custom reports

### Module Statistics
- **60+ Pages**: Comprehensive coverage of all estimation workflows
- **8 Feature Modules**: BOQ, Costing, Pricing, Rates, Workflow, Analytics, Settings, Advanced Features
- **40+ Entity Tables**: Normalized database design with proper relationships
- **100+ API Endpoints**: RESTful APIs for all CRUD operations and business logic

---

## Feature Modules

### 1. BOQ (BILL OF QUANTITIES) Module
**Purpose**: Manage detailed bills of quantities for project estimation

**Pages**:
- `/estimation/boq` - BOQ listing with search and filters
- `/estimation/boq/add` - Create new BOQ
- `/estimation/boq/edit/[id]` - Edit existing BOQ
- `/estimation/boq/view/[id]` - View BOQ details with items breakdown
- `/estimation/boq/templates` - BOQ template library
- `/estimation/boq/templates/create` - Create new template
- `/estimation/boq/templates/edit/[id]` - Edit template
- `/estimation/boq/templates/view/[id]` - View template details
- `/estimation/boq/analysis` - BOQ analysis dashboard
- `/estimation/boq/comparison` - Compare multiple BOQs

**Key Features**:
- Item-wise quantity breakdown by category
- Support for nested items and sub-assemblies
- Template-based BOQ generation
- Multi-unit support (pieces, meters, kg, etc.)
- Category grouping and subtotals
- BOQ versioning and comparison
- Export to Excel/PDF

**Entities**:
- `boqs` - Main BOQ records
- `boq_items` - Individual line items in BOQ
- `boq_categories` - Item categorization (master)
- `boq_templates` - Reusable BOQ templates
- `boq_template_items` - Template item definitions
- `boq_versions` - Version history tracking
- `units_of_measurement` - UOM master (master)

**Fields - boqs table**:
```sql
- boq_id (PK)
- boq_number (UNIQUE, VARCHAR(50))
- project_name (VARCHAR(200), NOT NULL)
- customer_id (FK -> customers.customer_id)
- project_description (TEXT)
- boq_date (DATE, NOT NULL)
- valid_until (DATE)
- total_quantity (DECIMAL(15,2))
- total_estimated_hours (DECIMAL(10,2))
- status (ENUM: draft, finalized, approved, archived)
- created_by (FK -> users.user_id)
- template_id (FK -> boq_templates.template_id, NULL)
- version_number (INT, DEFAULT 1)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Fields - boq_items table**:
```sql
- boq_item_id (PK)
- boq_id (FK -> boqs.boq_id, CASCADE DELETE)
- category_id (FK -> boq_categories.category_id)
- item_code (VARCHAR(50))
- item_name (VARCHAR(200), NOT NULL)
- description (TEXT)
- quantity (DECIMAL(15,2), NOT NULL)
- uom_id (FK -> units_of_measurement.uom_id)
- rate (DECIMAL(15,2))
- amount (DECIMAL(15,2), COMPUTED: quantity * rate)
- specifications (TEXT)
- parent_item_id (FK -> boq_items.boq_item_id, NULL) -- For nested items
- sort_order (INT)
- is_optional (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

### 2. COSTING Module
**Purpose**: Calculate detailed project costs across all cost components

**Pages**:
- `/estimation/costing` - Costing sheet listing
- `/estimation/costing/add` - Create new costing sheet
- `/estimation/costing/edit/[id]` - Edit costing sheet
- `/estimation/costing/view/[id]` - View detailed cost breakdown
- `/estimation/costing/materials` - Material cost analysis
- `/estimation/costing/labor` - Labor cost analysis
- `/estimation/costing/overhead` - Overhead cost allocation
- `/estimation/costing/breakdown` - Multi-level cost breakdown

**Key Features**:
- Multi-component costing (materials, labor, equipment, overhead, subcontractors)
- Activity-based costing (ABC)
- Cost allocation by department/project phase
- Variance analysis (estimated vs actual)
- Cost escalation factors
- Historical cost tracking
- What-if scenario analysis

**Entities**:
- `costing_sheets` - Main costing documents
- `material_costs` - Material cost components
- `labor_costs` - Labor cost components
- `equipment_costs` - Equipment rental/usage costs
- `overhead_costs` - Overhead allocation
- `subcontractor_costs` - Subcontractor costs
- `cost_allocation_rules` - Overhead allocation rules (master)
- `cost_centers` - Cost center definitions (master)

**Fields - costing_sheets table**:
```sql
- costing_sheet_id (PK)
- costing_number (UNIQUE, VARCHAR(50))
- boq_id (FK -> boqs.boq_id, NULL)
- project_name (VARCHAR(200), NOT NULL)
- customer_id (FK -> customers.customer_id)
- costing_date (DATE, NOT NULL)
- total_material_cost (DECIMAL(15,2))
- total_labor_cost (DECIMAL(15,2))
- total_equipment_cost (DECIMAL(15,2))
- total_overhead_cost (DECIMAL(15,2))
- total_subcontractor_cost (DECIMAL(15,2))
- total_direct_cost (DECIMAL(15,2), COMPUTED)
- total_indirect_cost (DECIMAL(15,2), COMPUTED)
- grand_total (DECIMAL(15,2), COMPUTED)
- cost_center_id (FK -> cost_centers.cost_center_id)
- status (ENUM: draft, under_review, approved, archived)
- prepared_by (FK -> users.user_id)
- approved_by (FK -> users.user_id, NULL)
- approved_date (TIMESTAMP, NULL)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Fields - material_costs table**:
```sql
- material_cost_id (PK)
- costing_sheet_id (FK -> costing_sheets.costing_sheet_id, CASCADE DELETE)
- boq_item_id (FK -> boq_items.boq_item_id, NULL)
- material_id (FK -> materials.material_id)
- material_name (VARCHAR(200), NOT NULL)
- quantity (DECIMAL(15,2), NOT NULL)
- uom_id (FK -> units_of_measurement.uom_id)
- rate (DECIMAL(15,2), NOT NULL)
- amount (DECIMAL(15,2), COMPUTED: quantity * rate)
- wastage_percentage (DECIMAL(5,2), DEFAULT 0)
- wastage_amount (DECIMAL(15,2), COMPUTED)
- total_amount (DECIMAL(15,2), COMPUTED: amount + wastage_amount)
- supplier_id (FK -> suppliers.supplier_id, NULL)
- rate_date (DATE)
- notes (TEXT)
- created_at (TIMESTAMP)
```

**Fields - labor_costs table**:
```sql
- labor_cost_id (PK)
- costing_sheet_id (FK -> costing_sheets.costing_sheet_id, CASCADE DELETE)
- labor_type_id (FK -> labor_types.labor_type_id)
- skill_level (ENUM: trainee, skilled, expert, supervisor)
- hours (DECIMAL(10,2), NOT NULL)
- rate_per_hour (DECIMAL(10,2), NOT NULL)
- regular_amount (DECIMAL(15,2), COMPUTED)
- overtime_hours (DECIMAL(10,2), DEFAULT 0)
- overtime_rate (DECIMAL(10,2))
- overtime_amount (DECIMAL(15,2), COMPUTED)
- total_amount (DECIMAL(15,2), COMPUTED)
- activity_description (VARCHAR(255))
- created_at (TIMESTAMP)
```

**Fields - equipment_costs table**:
```sql
- equipment_cost_id (PK)
- costing_sheet_id (FK -> costing_sheets.costing_sheet_id, CASCADE DELETE)
- equipment_id (FK -> equipment.equipment_id)
- equipment_name (VARCHAR(200), NOT NULL)
- usage_type (ENUM: hourly, daily, weekly, monthly)
- usage_quantity (DECIMAL(10,2), NOT NULL)
- rate (DECIMAL(15,2), NOT NULL)
- amount (DECIMAL(15,2), COMPUTED: usage_quantity * rate)
- operator_included (BOOLEAN, DEFAULT FALSE)
- fuel_included (BOOLEAN, DEFAULT FALSE)
- minimum_charge (DECIMAL(15,2))
- created_at (TIMESTAMP)
```

---

### 3. PRICING Module
**Purpose**: Apply pricing strategies and markup to convert costs to customer prices

**Pages**:
- `/estimation/pricing` - Pricing sheet listing
- `/estimation/pricing/add` - Create pricing sheet
- `/estimation/pricing/edit/[id]` - Edit pricing
- `/estimation/pricing/view/[id]` - View pricing details
- `/estimation/pricing/markup` - Markup configuration
- `/estimation/pricing/margins` - Margin analysis
- `/estimation/pricing/competitive` - Competitive pricing analysis

**Key Features**:
- Configurable markup rules (percentage, fixed amount, tiered)
- Category-wise markup application
- Competitive pricing analysis
- Margin target tracking
- Discount management
- Price variation scenarios
- Historical pricing trends

**Entities**:
- `pricing_sheets` - Main pricing documents
- `pricing_items` - Priced line items
- `markup_rules` - Markup configuration (master)
- `pricing_categories` - Category-based pricing (master)
- `discount_rules` - Discount policies (master)
- `competitor_prices` - Competitive price tracking

**Fields - pricing_sheets table**:
```sql
- pricing_sheet_id (PK)
- pricing_number (UNIQUE, VARCHAR(50))
- costing_sheet_id (FK -> costing_sheets.costing_sheet_id)
- estimate_id (FK -> estimates.estimate_id, NULL)
- pricing_date (DATE, NOT NULL)
- total_cost (DECIMAL(15,2), NOT NULL)
- total_markup_amount (DECIMAL(15,2))
- total_price_before_discount (DECIMAL(15,2), COMPUTED)
- discount_percentage (DECIMAL(5,2), DEFAULT 0)
- discount_amount (DECIMAL(15,2), COMPUTED)
- total_price (DECIMAL(15,2), COMPUTED)
- margin_percentage (DECIMAL(5,2), COMPUTED)
- margin_amount (DECIMAL(15,2), COMPUTED)
- pricing_strategy (ENUM: cost_plus, competitive, value_based, penetration)
- status (ENUM: draft, approved, sent_to_customer, archived)
- prepared_by (FK -> users.user_id)
- approved_by (FK -> users.user_id, NULL)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Fields - pricing_items table**:
```sql
- pricing_item_id (PK)
- pricing_sheet_id (FK -> pricing_sheets.pricing_sheet_id, CASCADE DELETE)
- item_name (VARCHAR(200), NOT NULL)
- item_description (TEXT)
- cost_amount (DECIMAL(15,2), NOT NULL)
- markup_rule_id (FK -> markup_rules.markup_rule_id, NULL)
- markup_percentage (DECIMAL(5,2))
- markup_amount (DECIMAL(15,2), COMPUTED)
- price (DECIMAL(15,2), COMPUTED: cost_amount + markup_amount)
- quantity (DECIMAL(15,2))
- uom_id (FK -> units_of_measurement.uom_id)
- total_price (DECIMAL(15,2), COMPUTED: price * quantity)
- category_id (FK -> pricing_categories.category_id)
- is_optional (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
```

**Fields - markup_rules table** (Master):
```sql
- markup_rule_id (PK)
- rule_name (VARCHAR(100), NOT NULL)
- rule_type (ENUM: percentage, fixed_amount, tiered)
- default_percentage (DECIMAL(5,2))
- default_amount (DECIMAL(15,2))
- applies_to (ENUM: all, category, item_type)
- category_id (FK -> pricing_categories.category_id, NULL)
- min_cost_threshold (DECIMAL(15,2), NULL)
- max_cost_threshold (DECIMAL(15,2), NULL)
- is_active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

### 4. RATES Module
**Purpose**: Maintain master rates for materials, labor, equipment, and subcontractors

**Pages**:
- `/estimation/rates/materials` - Material rate master
- `/estimation/rates/materials/add` - Add material rate
- `/estimation/rates/materials/history/[id]` - Rate history
- `/estimation/rates/labor` - Labor rate master
- `/estimation/rates/labor/add` - Add labor rate
- `/estimation/rates/equipment` - Equipment rate master
- `/estimation/rates/equipment/add` - Add equipment rate
- `/estimation/rates/subcontractors` - Subcontractor rate master
- `/estimation/rates/subcontractors/add` - Add subcontractor rate

**Key Features**:
- Historical rate tracking with effective dates
- Supplier-wise rate maintenance
- Automatic rate escalation
- Rate approval workflow
- Rate comparison across suppliers
- Validity period management
- Rate change notifications

**Entities**:
- `material_rates` - Material pricing master
- `labor_rates` - Labor hourly rates
- `equipment_rates` - Equipment rental rates
- `subcontractor_rates` - Subcontractor service rates
- `rate_history` - Historical rate tracking
- `suppliers` - Supplier master (master)
- `materials` - Material master (master)
- `labor_types` - Labor skill types (master)
- `equipment` - Equipment master (master)

**Fields - material_rates table**:
```sql
- material_rate_id (PK)
- material_id (FK -> materials.material_id)
- material_code (VARCHAR(50), NOT NULL)
- material_name (VARCHAR(200), NOT NULL)
- category_id (FK -> material_categories.category_id)
- uom_id (FK -> units_of_measurement.uom_id)
- current_rate (DECIMAL(15,2), NOT NULL)
- effective_from (DATE, NOT NULL)
- effective_to (DATE, NULL)
- supplier_id (FK -> suppliers.supplier_id)
- lead_time_days (INT)
- minimum_order_qty (DECIMAL(15,2))
- status (ENUM: active, inactive, discontinued)
- notes (TEXT)
- created_by (FK -> users.user_id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
INDEX: (material_id, effective_from)
UNIQUE: (material_id, supplier_id, effective_from)
```

**Fields - labor_rates table**:
```sql
- labor_rate_id (PK)
- skill_code (VARCHAR(50), NOT NULL)
- skill_name (VARCHAR(200), NOT NULL)
- department_id (FK -> departments.department_id)
- skill_level (ENUM: trainee, skilled, expert, supervisor)
- standard_rate (DECIMAL(10,2), NOT NULL)
- overtime_rate (DECIMAL(10,2), NOT NULL)
- holiday_rate (DECIMAL(10,2), NOT NULL)
- effective_from (DATE, NOT NULL)
- effective_to (DATE, NULL)
- certifications_required (TEXT)
- status (ENUM: active, inactive)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
UNIQUE: (skill_code, effective_from)
```

**Fields - equipment_rates table**:
```sql
- equipment_rate_id (PK)
- equipment_id (FK -> equipment.equipment_id)
- equipment_code (VARCHAR(50), NOT NULL)
- equipment_name (VARCHAR(200), NOT NULL)
- category_id (FK -> equipment_categories.category_id)
- hourly_rate (DECIMAL(10,2), NOT NULL)
- daily_rate (DECIMAL(10,2), NOT NULL)
- weekly_rate (DECIMAL(10,2), NOT NULL)
- monthly_rate (DECIMAL(10,2), NOT NULL)
- operator_included (BOOLEAN, DEFAULT FALSE)
- fuel_included (BOOLEAN, DEFAULT FALSE)
- minimum_hours (INT, DEFAULT 4)
- effective_from (DATE, NOT NULL)
- effective_to (DATE, NULL)
- status (ENUM: active, maintenance, inactive)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
UNIQUE: (equipment_id, effective_from)
```

**Fields - subcontractor_rates table**:
```sql
- subcontractor_rate_id (PK)
- contractor_code (VARCHAR(50), NOT NULL)
- contractor_name (VARCHAR(200), NOT NULL)
- service_type (VARCHAR(100), NOT NULL)
- specializations (JSON) -- Array of specialization areas
- rate_type (ENUM: per_hour, per_sqft, per_unit, fixed)
- rate (DECIMAL(15,2), NOT NULL)
- uom_id (FK -> units_of_measurement.uom_id, NULL)
- contact_person (VARCHAR(100))
- phone (VARCHAR(20))
- email (VARCHAR(100))
- minimum_order (DECIMAL(15,2))
- lead_time_days (INT)
- payment_terms (VARCHAR(200))
- rating (DECIMAL(3,2)) -- Out of 5.0
- projects_completed (INT, DEFAULT 0)
- effective_from (DATE, NOT NULL)
- effective_to (DATE, NULL)
- status (ENUM: active, inactive, blacklisted)
- gst_number (VARCHAR(50))
- pan_number (VARCHAR(20))
- company_address (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
UNIQUE: (contractor_code, service_type, effective_from)
```

**Fields - rate_history table**:
```sql
- rate_history_id (PK)
- entity_type (ENUM: material, labor, equipment, subcontractor)
- entity_id (INT, NOT NULL)
- old_rate (DECIMAL(15,2))
- new_rate (DECIMAL(15,2), NOT NULL)
- change_percentage (DECIMAL(5,2), COMPUTED)
- effective_from (DATE, NOT NULL)
- effective_to (DATE, NULL)
- change_reason (TEXT)
- changed_by (FK -> users.user_id)
- created_at (TIMESTAMP)
INDEX: (entity_type, entity_id, effective_from)
```

---

### 5. WORKFLOW Module
**Purpose**: Manage estimate lifecycle from draft to conversion

**Pages**:
- `/estimation/workflow/drafts` - Draft estimates
- `/estimation/workflow/drafts/create` - Create draft estimate
- `/estimation/workflow/drafts/edit/[id]` - Edit draft
- `/estimation/workflow/send/[id]` - Send estimate to customer
- `/estimation/workflow/pending` - Pending approvals
- `/estimation/workflow/pending/view/[id]` - View pending estimate
- `/estimation/workflow/pending/comments/[id]` - Approval comments
- `/estimation/workflow/approved` - Approved estimates
- `/estimation/workflow/rejected` - Rejected estimates
- `/estimation/workflow/converted` - Converted to orders

**Key Features**:
- Multi-stage workflow (draft → submit → review → approve)
- Approval hierarchy with delegation
- Conditional approval rules based on estimate value
- Comment and discussion threads
- Version control for revisions
- Email notifications at each stage
- Estimate validity tracking
- Conversion to sales order

**Entities**:
- `estimates` - Main estimate records
- `estimate_workflows` - Workflow state tracking
- `estimate_approvals` - Approval records
- `estimate_comments` - Discussion threads
- `estimate_versions` - Version history
- `workflow_stages` - Workflow stages (master)
- `approval_rules` - Conditional approval rules (master)

**Fields - estimates table**:
```sql
- estimate_id (PK)
- estimate_number (UNIQUE, VARCHAR(50))
- customer_id (FK -> customers.customer_id, NOT NULL)
- project_name (VARCHAR(200), NOT NULL)
- project_description (TEXT)
- boq_id (FK -> boqs.boq_id, NULL)
- costing_sheet_id (FK -> costing_sheets.costing_sheet_id, NULL)
- pricing_sheet_id (FK -> pricing_sheets.pricing_sheet_id, NULL)
- estimate_date (DATE, NOT NULL)
- valid_until (DATE, NOT NULL)
- total_cost (DECIMAL(15,2))
- total_price (DECIMAL(15,2), NOT NULL)
- margin_percentage (DECIMAL(5,2), COMPUTED)
- margin_amount (DECIMAL(15,2), COMPUTED)
- status (ENUM: draft, submitted, under_review, approved, rejected, sent_to_customer, converted, expired, cancelled)
- current_stage_id (FK -> workflow_stages.stage_id)
- priority (ENUM: low, medium, high, critical)
- category (VARCHAR(100)) -- Project category
- estimated_delivery_days (INT)
- payment_terms (TEXT)
- terms_and_conditions (TEXT)
- prepared_by (FK -> users.user_id)
- reviewed_by (FK -> users.user_id, NULL)
- approved_by (FK -> users.user_id, NULL)
- submitted_date (TIMESTAMP, NULL)
- approved_date (TIMESTAMP, NULL)
- sent_date (TIMESTAMP, NULL)
- converted_date (TIMESTAMP, NULL)
- sales_order_id (FK -> sales_orders.sales_order_id, NULL)
- version_number (INT, DEFAULT 1)
- completion_percentage (DECIMAL(5,2), DEFAULT 0)
- notes (TEXT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
INDEX: (customer_id, status)
INDEX: (estimate_date, status)
```

**Fields - estimate_workflows table**:
```sql
- workflow_id (PK)
- estimate_id (FK -> estimates.estimate_id, CASCADE DELETE)
- stage_id (FK -> workflow_stages.stage_id)
- entered_date (TIMESTAMP, NOT NULL)
- exited_date (TIMESTAMP, NULL)
- duration_hours (DECIMAL(10,2), COMPUTED)
- performed_by (FK -> users.user_id)
- action (VARCHAR(100)) -- e.g., "submitted", "approved", "rejected"
- comments (TEXT)
- created_at (TIMESTAMP)
INDEX: (estimate_id, entered_date)
```

**Fields - estimate_approvals table**:
```sql
- approval_id (PK)
- estimate_id (FK -> estimates.estimate_id, CASCADE DELETE)
- approval_level (INT, NOT NULL) -- 1, 2, 3 for multi-level approval
- approver_id (FK -> users.user_id, NOT NULL)
- approval_rule_id (FK -> approval_rules.approval_rule_id, NULL)
- status (ENUM: pending, approved, rejected, delegated)
- approved_date (TIMESTAMP, NULL)
- comments (TEXT)
- reason_for_rejection (TEXT, NULL)
- delegated_to (FK -> users.user_id, NULL)
- delegated_date (TIMESTAMP, NULL)
- created_at (TIMESTAMP)
INDEX: (estimate_id, approval_level)
UNIQUE: (estimate_id, approval_level, approver_id)
```

**Fields - estimate_comments table**:
```sql
- comment_id (PK)
- estimate_id (FK -> estimates.estimate_id, CASCADE DELETE)
- comment_type (ENUM: comment, query, approval_note, rejection_reason, revision_request)
- comment_text (TEXT, NOT NULL)
- commented_by (FK -> users.user_id)
- parent_comment_id (FK -> estimate_comments.comment_id, NULL) -- For threaded discussions
- is_internal (BOOLEAN, DEFAULT FALSE) -- Internal vs customer-visible
- created_at (TIMESTAMP)
INDEX: (estimate_id, created_at)
```

**Fields - workflow_stages table** (Master):
```sql
- stage_id (PK)
- stage_name (VARCHAR(100), NOT NULL)
- stage_order (INT, NOT NULL)
- stage_type (ENUM: draft, submission, review, approval, customer, conversion, closure)
- is_approval_required (BOOLEAN, DEFAULT FALSE)
- approval_levels (INT, DEFAULT 1)
- sla_hours (INT, NULL) -- SLA for this stage
- notification_template_id (FK -> notification_templates.template_id, NULL)
- is_active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
UNIQUE: (stage_name)
```

**Fields - approval_rules table** (Master):
```sql
- approval_rule_id (PK)
- rule_name (VARCHAR(100), NOT NULL)
- min_estimate_value (DECIMAL(15,2), NULL)
- max_estimate_value (DECIMAL(15,2), NULL)
- required_approval_levels (INT, NOT NULL)
- level_1_approvers (JSON) -- Array of user_ids
- level_2_approvers (JSON, NULL)
- level_3_approvers (JSON, NULL)
- auto_approve_below (DECIMAL(15,2), NULL)
- escalation_hours (INT, NULL)
- is_active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

### 6. ANALYTICS Module
**Purpose**: Track performance metrics and generate insights

**Pages**:
- `/estimation/analytics/reports` - Report library
- `/estimation/analytics/reports/custom` - Custom report builder
- `/estimation/analytics/reports/schedule` - Schedule reports
- `/estimation/analytics/reports/schedule/[id]` - Schedule specific report
- `/estimation/analytics/accuracy` - Estimation accuracy analysis
- `/estimation/analytics/performance` - Estimator performance metrics
- `/estimation/analytics/win-loss` - Win/loss analysis

**Key Features**:
- Estimation accuracy tracking (estimated vs actual)
- Win rate and conversion metrics
- Estimator productivity analysis
- Category-wise performance
- Turnaround time analysis
- Custom report builder with filters
- Scheduled report generation
- Export to multiple formats (PDF, Excel, PowerPoint)

**Entities**:
- `reports` - Saved report definitions
- `report_schedules` - Scheduled report jobs
- `accuracy_metrics` - Accuracy tracking
- `win_loss_analysis` - Win/loss reasons
- `performance_metrics` - Estimator KPIs

**Fields - reports table**:
```sql
- report_id (PK)
- report_name (VARCHAR(200), NOT NULL)
- report_type (ENUM: summary, performance, quality, financial, custom)
- report_category (VARCHAR(100))
- description (TEXT)
- filters (JSON) -- Report filter criteria
- metrics (JSON) -- Selected metrics
- grouping (JSON) -- Group by fields
- date_range_type (ENUM: last_7_days, last_30_days, last_quarter, this_year, custom)
- custom_start_date (DATE, NULL)
- custom_end_date (DATE, NULL)
- output_format (ENUM: pdf, excel, powerpoint, csv)
- include_charts (BOOLEAN, DEFAULT TRUE)
- include_raw_data (BOOLEAN, DEFAULT FALSE)
- created_by (FK -> users.user_id)
- is_public (BOOLEAN, DEFAULT FALSE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Fields - report_schedules table**:
```sql
- schedule_id (PK)
- report_id (FK -> reports.report_id, CASCADE DELETE)
- frequency (ENUM: daily, weekly, monthly, quarterly)
- day_of_week (ENUM: monday, tuesday, wednesday, thursday, friday, saturday, sunday, NULL)
- day_of_month (INT, NULL) -- 1-28 or "last"
- time_of_day (TIME, NOT NULL)
- recipients (JSON) -- Array of email addresses
- is_active (BOOLEAN, DEFAULT TRUE)
- last_run_date (TIMESTAMP, NULL)
- next_run_date (TIMESTAMP, NULL)
- created_by (FK -> users.user_id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Fields - accuracy_metrics table**:
```sql
- accuracy_metric_id (PK)
- estimate_id (FK -> estimates.estimate_id)
- sales_order_id (FK -> sales_orders.sales_order_id)
- project_id (FK -> projects.project_id, NULL)
- estimated_cost (DECIMAL(15,2), NOT NULL)
- actual_cost (DECIMAL(15,2), NOT NULL)
- cost_variance (DECIMAL(15,2), COMPUTED: actual_cost - estimated_cost)
- cost_variance_percentage (DECIMAL(5,2), COMPUTED)
- estimated_duration_days (INT)
- actual_duration_days (INT)
- duration_variance_days (INT, COMPUTED)
- estimated_materials (DECIMAL(15,2))
- actual_materials (DECIMAL(15,2))
- materials_variance (DECIMAL(15,2), COMPUTED)
- estimated_labor (DECIMAL(15,2))
- actual_labor (DECIMAL(15,2))
- labor_variance (DECIMAL(15,2), COMPUTED)
- accuracy_score (DECIMAL(5,2)) -- 0-100 score
- variance_reasons (TEXT)
- lessons_learned (TEXT)
- analyzed_by (FK -> users.user_id)
- analysis_date (DATE)
- created_at (TIMESTAMP)
INDEX: (estimate_id)
INDEX: (analysis_date)
```

**Fields - win_loss_analysis table**:
```sql
- win_loss_id (PK)
- estimate_id (FK -> estimates.estimate_id)
- outcome (ENUM: won, lost, no_decision)
- decision_date (DATE, NOT NULL)
- estimated_value (DECIMAL(15,2))
- final_value (DECIMAL(15,2), NULL) -- If won
- win_probability_initial (DECIMAL(5,2))
- competitor_count (INT, DEFAULT 0)
- primary_competitor (VARCHAR(200))
- decision_factors (JSON) -- Array of factors
- loss_reason_id (FK -> loss_reasons.loss_reason_id, NULL)
- loss_reason_details (TEXT)
- customer_feedback (TEXT)
- follow_up_actions (TEXT)
- analyzed_by (FK -> users.user_id)
- created_at (TIMESTAMP)
INDEX: (outcome, decision_date)
```

---

### 7. SETTINGS Module
**Purpose**: Configure templates, categories, markup rules, and workflows

**Pages**:
- `/estimation/settings/categories` - Manage estimation categories
- `/estimation/settings/templates` - Template management
- `/estimation/settings/markup` - Markup rule configuration
- `/estimation/settings/workflow` - Workflow configuration

**Key Features**:
- Category hierarchy management
- Template library with versioning
- Markup rule builder
- Workflow stage configuration
- Approval rule setup
- Notification templates
- System defaults configuration

**Entities**:
- `estimation_categories` - Category master
- `estimation_templates` - Template definitions
- `markup_rules` - Markup configuration (already covered)
- `workflow_stages` - Workflow stages (already covered)
- `approval_rules` - Approval rules (already covered)
- `notification_templates` - Email/SMS templates

**Fields - estimation_categories table** (Master):
```sql
- category_id (PK)
- category_name (VARCHAR(100), NOT NULL)
- category_code (VARCHAR(50), UNIQUE)
- parent_category_id (FK -> estimation_categories.category_id, NULL)
- category_type (ENUM: boq, costing, pricing, general)
- default_markup_percentage (DECIMAL(5,2))
- description (TEXT)
- is_active (BOOLEAN, DEFAULT TRUE)
- sort_order (INT)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
UNIQUE: (category_name, parent_category_id)
```

**Fields - estimation_templates table**:
```sql
- template_id (PK)
- template_name (VARCHAR(200), NOT NULL)
- template_type (ENUM: boq, costing, pricing, estimate)
- category_id (FK -> estimation_categories.category_id)
- template_data (JSON) -- Template structure and default values
- description (TEXT)
- usage_count (INT, DEFAULT 0)
- last_used_date (TIMESTAMP, NULL)
- version (VARCHAR(20))
- is_public (BOOLEAN, DEFAULT FALSE)
- is_active (BOOLEAN, DEFAULT TRUE)
- created_by (FK -> users.user_id)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

**Fields - notification_templates table** (Master):
```sql
- template_id (PK)
- template_name (VARCHAR(100), NOT NULL)
- template_type (ENUM: email, sms, in_app)
- event_trigger (VARCHAR(100)) -- e.g., "estimate_approved", "rate_changed"
- subject (VARCHAR(200))
- body_template (TEXT) -- With placeholders like {{estimate_number}}
- recipient_type (ENUM: user, role, custom)
- default_recipients (JSON)
- is_active (BOOLEAN, DEFAULT TRUE)
- created_at (TIMESTAMP)
- updated_at (TIMESTAMP)
```

---

### 8. ADVANCED FEATURES Module
**Purpose**: Advanced estimation capabilities and tools

**Pages**:
- `/estimation/advanced-features` - Advanced tools dashboard

**Key Features**:
- AI-powered cost prediction
- Parametric estimation
- Monte Carlo simulation for risk analysis
- Historical data analytics
- Bulk import/export
- Integration with ERP modules

**Entities**:
- `cost_prediction_models` - ML models for cost prediction
- `historical_data` - Historical project data
- `simulation_results` - Risk simulation outputs

---

## Common Masters (Lookup Tables)

These master tables are shared across the estimation module and potentially other ERP modules:

### 1. **units_of_measurement** (UOM Master)
```sql
- uom_id (PK)
- uom_code (VARCHAR(20), UNIQUE, NOT NULL)
- uom_name (VARCHAR(100), NOT NULL)
- uom_type (ENUM: length, area, volume, weight, quantity, time)
- conversion_factor (DECIMAL(15,6)) -- Conversion to base unit
- base_uom_id (FK -> units_of_measurement.uom_id, NULL)
- is_active (BOOLEAN, DEFAULT TRUE)
```

**Example Values**:
- KG, GRAM, TON (weight)
- METER, CM, MM, KM (length)
- SQ.M, SQ.FT, ACRE (area)
- LITER, ML, GALLON (volume)
- PCS, DOZEN, BOX (quantity)
- HOUR, DAY, WEEK (time)

### 2. **customers**
```sql
- customer_id (PK)
- customer_code (VARCHAR(50), UNIQUE)
- customer_name (VARCHAR(200), NOT NULL)
- customer_type (ENUM: residential, commercial, industrial, government)
- industry_id (FK -> industries.industry_id)
- credit_limit (DECIMAL(15,2))
- payment_terms (VARCHAR(100))
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 3. **suppliers**
```sql
- supplier_id (PK)
- supplier_code (VARCHAR(50), UNIQUE)
- supplier_name (VARCHAR(200), NOT NULL)
- supplier_type (ENUM: manufacturer, distributor, service_provider)
- rating (DECIMAL(3,2))
- payment_terms (VARCHAR(100))
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 4. **materials** (Material Master)
```sql
- material_id (PK)
- material_code (VARCHAR(50), UNIQUE, NOT NULL)
- material_name (VARCHAR(200), NOT NULL)
- category_id (FK -> material_categories.category_id)
- base_uom_id (FK -> units_of_measurement.uom_id)
- material_type (ENUM: raw_material, component, finished_good, consumable)
- specifications (TEXT)
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 5. **material_categories**
```sql
- category_id (PK)
- category_name (VARCHAR(100), NOT NULL)
- parent_category_id (FK -> material_categories.category_id, NULL)
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 6. **labor_types**
```sql
- labor_type_id (PK)
- labor_type_code (VARCHAR(50), UNIQUE)
- labor_type_name (VARCHAR(200), NOT NULL)
- department_id (FK -> departments.department_id)
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 7. **equipment** (Equipment Master)
```sql
- equipment_id (PK)
- equipment_code (VARCHAR(50), UNIQUE)
- equipment_name (VARCHAR(200), NOT NULL)
- category_id (FK -> equipment_categories.category_id)
- model_number (VARCHAR(100))
- manufacturer (VARCHAR(200))
- capacity (VARCHAR(100))
- status (ENUM: available, in_use, maintenance, retired)
```

### 8. **equipment_categories**
```sql
- category_id (PK)
- category_name (VARCHAR(100), NOT NULL)
- parent_category_id (FK -> equipment_categories.category_id, NULL)
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 9. **departments**
```sql
- department_id (PK)
- department_code (VARCHAR(50), UNIQUE)
- department_name (VARCHAR(200), NOT NULL)
- cost_center_code (VARCHAR(50))
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 10. **cost_centers**
```sql
- cost_center_id (PK)
- cost_center_code (VARCHAR(50), UNIQUE)
- cost_center_name (VARCHAR(200), NOT NULL)
- department_id (FK -> departments.department_id)
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 11. **users**
```sql
- user_id (PK)
- username (VARCHAR(100), UNIQUE)
- full_name (VARCHAR(200), NOT NULL)
- email (VARCHAR(200), UNIQUE)
- role (VARCHAR(100))
- department_id (FK -> departments.department_id)
- is_active (BOOLEAN, DEFAULT TRUE)
```

### 12. **loss_reasons** (Master for win/loss analysis)
```sql
- loss_reason_id (PK)
- reason_code (VARCHAR(50), UNIQUE)
- reason_name (VARCHAR(200), NOT NULL)
- reason_category (ENUM: price, competition, timing, quality, service, technical)
- is_active (BOOLEAN, DEFAULT TRUE)
```

---

## Normalized Database Schema

### Database Normalization Level: 3NF (Third Normal Form)

**Principles Applied**:
1. **1NF**: All tables have atomic values, no repeating groups
2. **2NF**: All non-key attributes fully dependent on primary key
3. **3NF**: No transitive dependencies

### Key Design Patterns:

#### 1. **Hierarchical Data** (Self-referencing tables)
- `material_categories` with `parent_category_id`
- `estimation_categories` with `parent_category_id`
- `boq_items` with `parent_item_id` for nested BOQ

#### 2. **Historical Data** (Effective Dating)
- All rate tables have `effective_from` and `effective_to`
- Enables point-in-time queries
- Maintains complete audit trail

#### 3. **Audit Trail**
- All tables have `created_at` and `updated_at`
- Action tables have `created_by` and `updated_by`
- `rate_history` table tracks all rate changes

#### 4. **Computed Fields** (Denormalized for performance)
```sql
-- Examples of computed fields:
amount = quantity * rate
total_amount = amount + wastage_amount
margin_percentage = ((price - cost) / cost) * 100
```

#### 5. **Status Management**
- ENUM types for controlled vocabularies
- Prevents invalid state transitions
- Enables efficient indexing

### Index Strategy

```sql
-- Performance-critical indexes
CREATE INDEX idx_estimates_customer_status ON estimates(customer_id, status);
CREATE INDEX idx_estimates_date_status ON estimates(estimate_date, status);
CREATE INDEX idx_material_rates_effective ON material_rates(material_id, effective_from);
CREATE INDEX idx_boq_items_boq ON boq_items(boq_id, category_id);
CREATE INDEX idx_costing_sheet ON material_costs(costing_sheet_id);
CREATE INDEX idx_estimate_workflow ON estimate_workflows(estimate_id, entered_date);

-- Foreign key indexes (automatic in most DBs, but explicit for clarity)
CREATE INDEX idx_boq_customer ON boqs(customer_id);
CREATE INDEX idx_costing_boq ON costing_sheets(boq_id);
CREATE INDEX idx_pricing_costing ON pricing_sheets(costing_sheet_id);
```

---

## Entity Relationships

### ER Diagram (Text Representation)

```
customers (1) ----< (many) boqs
customers (1) ----< (many) estimates
customers (1) ----< (many) costing_sheets

boqs (1) ----< (many) boq_items
boq_items (1) ----< (many) boq_items [self-referencing for nested items]
boq_categories (1) ----< (many) boq_items

boqs (1) ----o (0..1) costing_sheets
costing_sheets (1) ----< (many) material_costs
costing_sheets (1) ----< (many) labor_costs
costing_sheets (1) ----< (many) equipment_costs
costing_sheets (1) ----< (many) overhead_costs
costing_sheets (1) ----< (many) subcontractor_costs

costing_sheets (1) ----o (0..1) pricing_sheets
pricing_sheets (1) ----< (many) pricing_items

estimates (1) ----o (0..1) boqs
estimates (1) ----o (0..1) costing_sheets
estimates (1) ----o (0..1) pricing_sheets
estimates (1) ----< (many) estimate_workflows
estimates (1) ----< (many) estimate_approvals
estimates (1) ----< (many) estimate_comments

materials (1) ----< (many) material_rates
material_rates (many) ----< (1) suppliers
labor_types (1) ----< (many) labor_rates
equipment (1) ----< (many) equipment_rates

approval_rules (1) ----< (many) estimate_approvals
workflow_stages (1) ----< (many) estimate_workflows

units_of_measurement (1) ----< (many) boq_items
units_of_measurement (1) ----< (many) material_costs
units_of_measurement (1) ----< (many) materials
```

### Key Relationships Explained

1. **Customer → BOQ → Costing → Pricing → Estimate** (Main Flow)
   - One-to-many relationships cascading through the estimation process
   - Each stage can exist independently but typically follows this flow

2. **Historical Rate Tracking**
   - Materials, labor, equipment, and subcontractors have time-series rate data
   - `effective_from` and `effective_to` enable point-in-time pricing

3. **Estimate Workflow**
   - One estimate has many workflow state transitions
   - Each transition tracked with timestamp and user
   - Multi-level approval with approval_rules determining required approvers

4. **Cost Components**
   - One costing sheet has many cost line items across 5 categories
   - Each cost line can reference BOQ items (traceability)
   - Costs roll up to sheet-level totals

---

## API Endpoints

### RESTful API Design Pattern
Base URL: `/api/v1/estimation/`

All endpoints follow REST conventions:
- GET: Retrieve data
- POST: Create new records
- PUT: Update entire records
- PATCH: Partial updates
- DELETE: Soft delete (set is_active=false)

### Authentication & Authorization
```http
Authorization: Bearer <jwt_token>
X-User-Role: estimator | manager | approver | admin
```

---

### 1. BOQ Management APIs

#### BOQ CRUD Operations
```http
GET    /boqs                         # List all BOQs with pagination & filters
GET    /boqs/{id}                    # Get BOQ details with items
POST   /boqs                         # Create new BOQ
PUT    /boqs/{id}                    # Update BOQ
DELETE /boqs/{id}                    # Soft delete BOQ
PATCH  /boqs/{id}/status             # Update BOQ status

# BOQ Items
GET    /boqs/{id}/items              # Get all items for a BOQ
POST   /boqs/{id}/items              # Add item to BOQ
PUT    /boqs/{id}/items/{item_id}   # Update BOQ item
DELETE /boqs/{id}/items/{item_id}   # Delete BOQ item
POST   /boqs/{id}/items/bulk         # Bulk add items

# BOQ Categories
GET    /boq-categories               # List all categories
POST   /boq-categories               # Create category
PUT    /boq-categories/{id}          # Update category
```

#### BOQ Templates
```http
GET    /boq-templates                # List templates
GET    /boq-templates/{id}           # Get template details
POST   /boq-templates                # Create template
PUT    /boq-templates/{id}           # Update template
DELETE /boq-templates/{id}           # Delete template
POST   /boq-templates/{id}/use       # Create BOQ from template
```

#### BOQ Analysis
```http
GET    /boqs/{id}/comparison         # Compare with other BOQs
GET    /boqs/{id}/analysis           # BOQ analysis report
POST   /boqs/{id}/export             # Export BOQ (PDF/Excel)
```

**Request Example - Create BOQ**:
```json
POST /api/v1/estimation/boqs
{
  "boq_number": "BOQ-2025-001",
  "project_name": "Industrial Kitchen Installation",
  "customer_id": 1234,
  "project_description": "Complete kitchen setup with 50 seating capacity",
  "boq_date": "2025-10-30",
  "valid_until": "2025-12-30",
  "items": [
    {
      "category_id": 1,
      "item_code": "SS-SINK-001",
      "item_name": "Stainless Steel Sink",
      "quantity": 10,
      "uom_id": 1,
      "specifications": "304 grade, double bowl"
    }
  ]
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "boq_id": 5678,
    "boq_number": "BOQ-2025-001",
    "total_items": 1,
    "created_at": "2025-10-30T10:30:00Z"
  },
  "message": "BOQ created successfully"
}
```

---

### 2. Costing APIs

#### Costing Sheet Operations
```http
GET    /costing-sheets                    # List costing sheets
GET    /costing-sheets/{id}               # Get costing details
POST   /costing-sheets                    # Create costing sheet
PUT    /costing-sheets/{id}               # Update costing sheet
DELETE /costing-sheets/{id}               # Delete costing sheet
PATCH  /costing-sheets/{id}/approve       # Approve costing sheet

# Material Costs
GET    /costing-sheets/{id}/materials     # Get material costs
POST   /costing-sheets/{id}/materials     # Add material cost
PUT    /costing-sheets/{id}/materials/{material_cost_id}  # Update material cost
DELETE /costing-sheets/{id}/materials/{material_cost_id}  # Delete material cost

# Labor Costs
GET    /costing-sheets/{id}/labor         # Get labor costs
POST   /costing-sheets/{id}/labor         # Add labor cost
PUT    /costing-sheets/{id}/labor/{labor_cost_id}        # Update labor cost

# Equipment Costs
GET    /costing-sheets/{id}/equipment     # Get equipment costs
POST   /costing-sheets/{id}/equipment     # Add equipment cost

# Overhead Costs
GET    /costing-sheets/{id}/overhead      # Get overhead costs
POST   /costing-sheets/{id}/overhead      # Add overhead cost

# Subcontractor Costs
GET    /costing-sheets/{id}/subcontractors # Get subcontractor costs
POST   /costing-sheets/{id}/subcontractors # Add subcontractor cost
```

#### Costing Analysis
```http
GET    /costing-sheets/{id}/breakdown     # Multi-level cost breakdown
GET    /costing-sheets/{id}/comparison    # Compare with actuals
POST   /costing-sheets/{id}/export        # Export costing (Excel/PDF)
```

**Request Example - Create Costing Sheet**:
```json
POST /api/v1/estimation/costing-sheets
{
  "costing_number": "COST-2025-001",
  "boq_id": 5678,
  "project_name": "Industrial Kitchen Installation",
  "customer_id": 1234,
  "costing_date": "2025-10-30",
  "material_costs": [
    {
      "material_id": 101,
      "material_name": "Stainless Steel 304",
      "quantity": 100,
      "uom_id": 1,
      "rate": 285.00,
      "wastage_percentage": 5.0
    }
  ],
  "labor_costs": [
    {
      "labor_type_id": 201,
      "skill_level": "skilled",
      "hours": 80,
      "rate_per_hour": 485.00
    }
  ]
}
```

---

### 3. Pricing APIs

#### Pricing Sheet Operations
```http
GET    /pricing-sheets                # List pricing sheets
GET    /pricing-sheets/{id}           # Get pricing details
POST   /pricing-sheets                # Create pricing sheet
PUT    /pricing-sheets/{id}           # Update pricing
DELETE /pricing-sheets/{id}           # Delete pricing sheet
PATCH  /pricing-sheets/{id}/approve   # Approve pricing

# Pricing Items
GET    /pricing-sheets/{id}/items     # Get pricing items
POST   /pricing-sheets/{id}/items     # Add pricing item
PUT    /pricing-sheets/{id}/items/{item_id}  # Update item price
```

#### Markup Rules
```http
GET    /markup-rules                  # List markup rules
POST   /markup-rules                  # Create markup rule
PUT    /markup-rules/{id}             # Update markup rule
DELETE /markup-rules/{id}             # Delete markup rule
POST   /pricing-sheets/{id}/apply-markup  # Apply markup to pricing
```

#### Pricing Analysis
```http
GET    /pricing-sheets/{id}/margins   # Margin analysis
GET    /pricing-sheets/{id}/competitive  # Competitive pricing comparison
POST   /pricing-sheets/{id}/scenarios # What-if pricing scenarios
```

---

### 4. Rate Management APIs

#### Material Rates
```http
GET    /rates/materials               # List material rates
GET    /rates/materials/{id}          # Get rate details
POST   /rates/materials               # Add material rate
PUT    /rates/materials/{id}          # Update rate
DELETE /rates/materials/{id}          # Deactivate rate
GET    /rates/materials/{material_id}/history  # Rate history
GET    /rates/materials/effective?date=2025-10-30  # Get rates for specific date
```

#### Labor Rates
```http
GET    /rates/labor                   # List labor rates
POST   /rates/labor                   # Add labor rate
PUT    /rates/labor/{id}              # Update rate
GET    /rates/labor/{labor_type_id}/history  # Rate history
```

#### Equipment Rates
```http
GET    /rates/equipment               # List equipment rates
POST   /rates/equipment               # Add equipment rate
PUT    /rates/equipment/{id}          # Update rate
GET    /rates/equipment/{equipment_id}/history  # Rate history
```

#### Subcontractor Rates
```http
GET    /rates/subcontractors          # List subcontractor rates
POST   /rates/subcontractors          # Add subcontractor
PUT    /rates/subcontractors/{id}     # Update rate
DELETE /rates/subcontractors/{id}     # Deactivate subcontractor
GET    /rates/subcontractors/{id}/performance  # Performance metrics
```

**Request Example - Add Material Rate**:
```json
POST /api/v1/estimation/rates/materials
{
  "material_id": 101,
  "material_code": "SS304-18G",
  "material_name": "Stainless Steel 304 - 18 Gauge Sheet",
  "category_id": 1,
  "uom_id": 1,
  "current_rate": 285.00,
  "effective_from": "2025-11-01",
  "supplier_id": 501,
  "lead_time_days": 7,
  "minimum_order_qty": 500,
  "status": "active"
}
```

---

### 5. Workflow APIs

#### Estimate CRUD
```http
GET    /estimates                     # List estimates
GET    /estimates/{id}                # Get estimate details
POST   /estimates                     # Create estimate
PUT    /estimates/{id}                # Update estimate
DELETE /estimates/{id}                # Delete estimate
```

#### Workflow Management
```http
GET    /estimates/{id}/workflow       # Get workflow history
POST   /estimates/{id}/submit         # Submit estimate for review
POST   /estimates/{id}/approve        # Approve estimate
POST   /estimates/{id}/reject         # Reject estimate
POST   /estimates/{id}/send           # Send to customer
POST   /estimates/{id}/convert        # Convert to sales order
```

#### Approvals
```http
GET    /estimates/pending-approvals   # List pending approvals
GET    /estimates/{id}/approvals      # Get approval details
POST   /estimates/{id}/approvals/{approval_id}/approve  # Approve
POST   /estimates/{id}/approvals/{approval_id}/reject   # Reject
POST   /estimates/{id}/approvals/{approval_id}/delegate # Delegate
```

#### Comments & Discussions
```http
GET    /estimates/{id}/comments       # Get comments
POST   /estimates/{id}/comments       # Add comment
PUT    /estimates/{id}/comments/{comment_id}  # Edit comment
DELETE /estimates/{id}/comments/{comment_id}  # Delete comment
```

**Request Example - Submit Estimate**:
```json
POST /api/v1/estimation/estimates/{id}/submit
{
  "submission_notes": "All costs verified and pricing approved",
  "request_approval_from": [123, 456],
  "priority": "high",
  "send_notification": true
}
```

**Response Example**:
```json
{
  "success": true,
  "data": {
    "estimate_id": 7890,
    "status": "under_review",
    "workflow_stage": "Level 1 Approval",
    "approvers": [
      {"user_id": 123, "name": "Manager A", "level": 1},
      {"user_id": 456, "name": "Director B", "level": 2}
    ],
    "submitted_at": "2025-10-30T14:30:00Z"
  }
}
```

---

### 6. Analytics & Reporting APIs

#### Reports
```http
GET    /reports                       # List available reports
GET    /reports/{id}                  # Get report definition
POST   /reports                       # Create custom report
PUT    /reports/{id}                  # Update report
DELETE /reports/{id}                  # Delete report
POST   /reports/{id}/generate         # Generate report
GET    /reports/{id}/download         # Download generated report
```

#### Report Scheduling
```http
GET    /report-schedules              # List schedules
POST   /report-schedules              # Create schedule
PUT    /report-schedules/{id}         # Update schedule
DELETE /report-schedules/{id}         # Delete schedule
POST   /report-schedules/{id}/run     # Run schedule now
```

#### Analytics Metrics
```http
GET    /analytics/accuracy            # Estimation accuracy metrics
GET    /analytics/performance         # Estimator performance
GET    /analytics/win-loss            # Win/loss analysis
GET    /analytics/trends              # Trending metrics
GET    /analytics/dashboard           # Dashboard summary
```

**Request Example - Generate Custom Report**:
```json
POST /api/v1/estimation/reports/{id}/generate
{
  "date_range": "last_30_days",
  "filters": {
    "status": ["approved", "converted"],
    "category": "Industrial Kitchen",
    "min_value": 1000000
  },
  "metrics": ["total_estimates", "win_rate", "avg_value", "conversion_rate"],
  "group_by": ["customer_type", "month"],
  "output_format": "pdf",
  "include_charts": true
}
```

---

### 7. Settings APIs

#### Categories
```http
GET    /settings/categories           # List categories
POST   /settings/categories           # Create category
PUT    /settings/categories/{id}      # Update category
DELETE /settings/categories/{id}      # Delete category
```

#### Templates
```http
GET    /settings/templates            # List templates
POST   /settings/templates            # Create template
PUT    /settings/templates/{id}       # Update template
DELETE /settings/templates/{id}       # Delete template
```

#### Workflow Configuration
```http
GET    /settings/workflow-stages      # List workflow stages
POST   /settings/workflow-stages      # Create stage
PUT    /settings/workflow-stages/{id} # Update stage
GET    /settings/approval-rules       # List approval rules
POST   /settings/approval-rules       # Create rule
PUT    /settings/approval-rules/{id}  # Update rule
```

---

### API Response Format

**Success Response**:
```json
{
  "success": true,
  "data": { /* response data */ },
  "message": "Operation successful",
  "meta": {
    "page": 1,
    "per_page": 20,
    "total": 156,
    "total_pages": 8
  }
}
```

**Error Response**:
```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "material_code",
        "message": "Material code is required"
      }
    ]
  }
}
```

---

## Data Flow & Business Logic

### 1. Complete Estimation Flow

```
Step 1: BOQ Creation
├─ Create BOQ record
├─ Add BOQ items with quantities
├─ Categorize items
├─ Apply templates (optional)
└─ Finalize BOQ

Step 2: Costing
├─ Link BOQ to costing sheet
├─ Add material costs (fetch current rates)
├─ Add labor costs (calculate hours × rates)
├─ Add equipment costs (rental duration × rates)
├─ Add overhead costs (apply allocation rules)
├─ Add subcontractor costs
├─ Calculate wastage and contingencies
└─ Get total cost

Step 3: Pricing
├─ Link costing sheet to pricing sheet
├─ Apply markup rules by category
├─ Calculate margins
├─ Apply discounts (if applicable)
├─ Generate pricing scenarios
└─ Finalize customer price

Step 4: Estimate Creation
├─ Combine BOQ + Costing + Pricing
├─ Add project details
├─ Set validity period
├─ Add terms & conditions
└─ Save as draft

Step 5: Workflow
├─ Submit for internal review
├─ Route to approvers based on rules
├─ Multi-level approval process
├─ Address comments/queries
├─ Get final approval
└─ Send to customer

Step 6: Customer Interaction
├─ Send estimate via email/portal
├─ Track customer actions
├─ Handle negotiations (revisions)
├─ Record win/loss decision
└─ Convert to sales order (if won)

Step 7: Post-Execution Analysis
├─ Track actual costs
├─ Calculate variances
├─ Analyze accuracy
├─ Update rate models
└─ Generate insights
```

### 2. Rate Management Flow

```
Rate Addition/Update:
1. User enters new rate with effective date
2. System validates rate (check for duplicates, overlaps)
3. Auto-close previous rate (set effective_to)
4. Create rate history record
5. Send notification to estimators
6. Update dependent costing sheets (if configured)

Rate Retrieval Logic:
- Query: Get rate for material X on date Y
- Search: material_rates WHERE material_id = X
          AND effective_from <= Y
          AND (effective_to IS NULL OR effective_to >= Y)
- Return: Most recent rate within validity
```

### 3. Approval Logic

```
Approval Rule Matching:
1. Get estimate value
2. Find matching approval_rule (value threshold)
3. Determine required approval levels
4. Identify approvers for each level
5. Create approval records
6. Send notifications

Approval Processing:
1. Approver reviews estimate
2. Approver can: Approve | Reject | Request Changes | Delegate
3. If approved at level N, move to level N+1
4. If all levels approved, status = "approved"
5. If any level rejects, status = "rejected"
6. Escalate if SLA breached
```

### 4. Costing Calculation Logic

```javascript
// Pseudo-code for total costing calculation

function calculateTotalCost(costingSheetId) {
  // 1. Material Costs
  materialCosts = SELECT SUM(
    (quantity * rate) + (quantity * rate * wastage_percentage / 100)
  ) FROM material_costs WHERE costing_sheet_id = costingSheetId;

  // 2. Labor Costs
  laborCosts = SELECT SUM(
    (hours * rate_per_hour) + (overtime_hours * overtime_rate)
  ) FROM labor_costs WHERE costing_sheet_id = costingSheetId;

  // 3. Equipment Costs
  equipmentCosts = SELECT SUM(
    usage_quantity * rate
  ) FROM equipment_costs WHERE costing_sheet_id = costingSheetId;

  // 4. Overhead Costs (apply allocation rule)
  directCosts = materialCosts + laborCosts + equipmentCosts;
  overheadRate = getOverheadRate(costCenter);
  overheadCosts = directCosts * (overheadRate / 100);

  // 5. Subcontractor Costs
  subcontractorCosts = SELECT SUM(amount)
                       FROM subcontractor_costs
                       WHERE costing_sheet_id = costingSheetId;

  // Total
  totalCost = materialCosts + laborCosts + equipmentCosts +
              overheadCosts + subcontractorCosts;

  return totalCost;
}
```

### 5. Pricing Calculation Logic

```javascript
// Pseudo-code for pricing calculation

function calculatePricing(costingSheetId, pricingRules) {
  totalCost = calculateTotalCost(costingSheetId);

  // Get items with categories
  items = getItemsWithCategories(costingSheetId);

  totalPrice = 0;

  for (item in items) {
    // Find applicable markup rule
    markupRule = findMarkupRule(item.category, item.cost);

    if (markupRule.type == 'percentage') {
      itemPrice = item.cost * (1 + markupRule.percentage / 100);
    } else if (markupRule.type == 'fixed_amount') {
      itemPrice = item.cost + markupRule.amount;
    }

    totalPrice += itemPrice;
  }

  // Apply discount
  if (discount > 0) {
    totalPrice = totalPrice * (1 - discount / 100);
  }

  // Calculate margin
  margin = totalPrice - totalCost;
  marginPercentage = (margin / totalCost) * 100;

  return {
    totalCost,
    totalPrice,
    margin,
    marginPercentage
  };
}
```

### 6. Accuracy Tracking Logic

```
Post-Project Completion:
1. Retrieve estimate_id and sales_order_id
2. Get estimated costs from costing_sheet
3. Get actual costs from project_actuals table
4. Calculate variances:
   - Cost variance = actual_cost - estimated_cost
   - Cost variance % = (variance / estimated_cost) * 100
5. Calculate accuracy score:
   - accuracy_score = 100 - ABS(variance_percentage)
6. Store in accuracy_metrics table
7. Update estimator performance metrics
8. Trigger retraining of cost prediction models
```

---

## Business Rules & Validations

### 1. BOQ Business Rules
- BOQ must have at least one item
- Total quantity must be > 0
- Items within same category can be grouped
- Nested items (parent-child) must have valid parent_item_id
- Valid_until date must be >= boq_date
- Template usage increments usage_count

### 2. Costing Business Rules
- Material rates must be valid on costing_date
- Labor rates must be valid on costing_date
- Equipment rates must be valid on costing_date
- Wastage percentage: 0-100%
- Overtime rate >= standard rate
- All costs must be >= 0
- At least one cost component required

### 3. Pricing Business Rules
- Total price must be > total cost (positive margin)
- Discount cannot make price < cost (configurable)
- Markup percentage: -100% to 1000% (configurable)
- Valid_until must be >= pricing_date
- Competitive pricing must reference competitor data

### 4. Workflow Business Rules
- Draft → Submitted: Requires complete costing
- Submitted → Approved: Requires all approvals
- Approved → Sent: Generates customer-facing document
- Sent → Converted: Creates sales_order
- Cannot skip workflow stages
- Cannot edit after approval (requires revision)
- Estimate expires after valid_until date

### 5. Rate Management Rules
- New rate must have effective_from >= today
- Cannot have overlapping rates for same material/supplier
- Rate change triggers notification
- Historical rates cannot be deleted (soft delete only)
- Rate updates create audit trail in rate_history

---

## Performance Optimization

### 1. Database Indexes
- Create indexes on foreign keys
- Create composite indexes on frequently queried columns
- Index on (customer_id, status) for estimate listing
- Index on (material_id, effective_from) for rate queries
- Index on (estimate_id, entered_date) for workflow tracking

### 2. Caching Strategy
- Cache frequently accessed master data (UOM, categories)
- Cache current rates for materials, labor, equipment
- Cache user permissions and roles
- TTL: 1 hour for rates, 24 hours for masters

### 3. Query Optimization
- Use pagination for large result sets
- Implement lazy loading for related data
- Use materialized views for complex analytics
- Aggregate at database level, not in application

### 4. Batch Operations
- Bulk insert for BOQ items from templates
- Batch rate updates with single transaction
- Background jobs for report generation
- Async processing for accuracy calculations

---

## Security Considerations

### 1. Access Control
- Role-based permissions (Estimator, Manager, Approver, Admin)
- Estimate visibility based on department/team
- Sensitive data (costs, margins) restricted to authorized users
- Audit trail for all changes

### 2. Data Validation
- Input sanitization to prevent SQL injection
- XSS prevention in text fields
- File upload validation (PDF, Excel only)
- Rate limit API calls (100 requests/minute)

### 3. Approval Security
- Digital signatures for approvals (optional)
- Approval cannot be deleted, only superseded
- Delegation requires manager approval
- Approval bypass requires audit justification

---

## Integration Points

### 1. CRM Module Integration
- Customer data sync
- Opportunity → Estimate conversion
- Quote generation from estimate
- Win/loss data feedback to CRM

### 2. Procurement Module Integration
- Material master sync
- Supplier rate sync
- Purchase requisition from approved estimate
- Actual cost tracking

### 3. Project Management Integration
- Estimate → Project creation
- Budget allocation from estimate
- Actual cost tracking
- Variance reporting

### 4. Finance Module Integration
- Cost center data
- Overhead allocation rates
- Margin analysis
- Revenue recognition

### 5. Inventory Module Integration
- Material availability check
- Current inventory costs
- Lead time validation

---

## Deployment Considerations

### 1. Database Setup
```sql
-- Create schema
CREATE SCHEMA estimation;

-- Create tables in sequence (respecting foreign keys)
-- 1. Master tables (no dependencies)
-- 2. Transaction tables (with dependencies)
-- 3. Indexes
-- 4. Views
-- 5. Stored procedures
```

### 2. Initial Data Load
- Seed master tables (UOM, categories, workflow stages)
- Import material master
- Import customer data
- Setup default approval rules
- Create default templates

### 3. Migration Strategy
- Backup existing data
- Run schema updates
- Migrate data with transformation
- Validate data integrity
- Rollback plan ready

---

## Appendix

### A. Glossary
- **BOQ**: Bill of Quantities - Itemized list of materials and labor
- **Markup**: Percentage or amount added to cost to determine price
- **Margin**: Difference between price and cost
- **UOM**: Unit of Measurement
- **SLA**: Service Level Agreement
- **Escalation**: Moving up approval hierarchy
- **Variance**: Difference between estimated and actual
- **Wastage**: Material loss during production

### B. Sample Data

**Sample BOQ Categories**:
- Raw Materials
- Fabrication Components
- Finishing Items
- Electrical Components
- Plumbing Components
- Installation Services

**Sample Estimation Categories**:
- Industrial Kitchen
- Modular Kitchen
- Commercial Kitchen
- Residential Kitchen
- Custom Projects

**Sample Loss Reasons**:
- Price too high
- Lost to competition
- Customer budget constraints
- Timing issues
- Technical requirements not met
- Service concerns

---

## Document Metadata

**Version**: 1.0
**Last Updated**: 2025-10-30
**Author**: System Documentation Team
**Status**: Complete
**Related Documents**:
- CRM_MODULE_DOCUMENTATION.md
- DATABASE_SCHEMA.md
- API_REFERENCE.md

---

**END OF DOCUMENT**
