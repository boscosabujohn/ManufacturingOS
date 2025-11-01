# Contract Management Module - Complete Documentation

## Table of Contents
1. [Module Overview](#module-overview)
2. [Feature Modules](#feature-modules)
3. [Common Masters (Lookup Tables)](#common-masters-lookup-tables)
4. [Normalized Database Schema](#normalized-database-schema)
5. [Entity Relationships](#entity-relationships)
6. [API Endpoints](#api-endpoints)
7. [Data Flow & Business Logic](#data-flow--business-logic)
8. [Integration with CPQ Module](#integration-with-cpq-module)

---

## Module Overview

The Contract Management module is a comprehensive system for managing the complete contract lifecycle, from template creation through execution, amendments, renewals, and compliance. It is tightly integrated with the CPQ (Configure, Price, Quote) module to enable seamless quote-to-contract conversion.

### Key Capabilities
- **Template Management**: Create reusable contract templates with pre-approved clauses
- **Contract Generation**: Generate contracts from templates or quotes with intelligent clause selection
- **Clause Library**: Maintain a centralized repository of legal clauses with version control
- **Contract Execution**: Track milestones, deliverables, payments, and obligations
- **Approval Workflows**: Multi-level approval chains for contracts and amendments
- **Amendment Management**: Track contract changes with full audit trail
- **Renewal Automation**: Automated renewal tracking and notifications
- **Compliance Tracking**: Monitor contract compliance, obligations, and SLA adherence
- **Document Management**: Store and version all contract-related documents
- **E-Signature Integration**: Digital signature workflow for contract execution

### Module Scope
- **Contract Types**: Sales contracts, Service agreements, NDAs, Partnership agreements, Employment contracts, MSAs (Master Service Agreements), SOWs (Statements of Work)
- **Contract States**: Draft → Under Review → Pending Approval → Approved → Active → Expired/Terminated/Renewed
- **User Roles**: Contract Creator, Legal Reviewer, Approver (multiple levels), Contract Manager, Finance Approver, Executive Approver

---

## Feature Modules

### 1. CONTRACT TEMPLATES Module
**Purpose**: Create and manage reusable contract templates with standardized clauses and terms

**Pages**:
- `/cpq/contracts/templates` - Template library with grid view
- Template cards show: name, category, type, clauses count, pages, usage count, avg contract value, avg duration
- Actions: Create Template, Use Template, View Details, Edit, Copy, Filter, Export

**Key Features**:
- **Template Creation**: Define template structure with placeholders for dynamic data
- **Clause Selection**: Choose clauses from clause library during template creation
- **Template Categories**: Sales, Service, Legal, Partnership, Employment
- **Template Types**: sales, service, nda, partnership, employment
- **Usage Analytics**: Track which templates are most effective (usage count, avg value)
- **Template Versioning**: Maintain template versions with approval workflow
- **Template Status**: Draft, Active, Archived
- **Favorites System**: Mark frequently used templates as favorites
- **Template Metrics**: Pages count, clauses count, average contract value, average duration

**Modals** (Created: ContractTemplateModals.tsx):
1. **TemplateModal**: Create/edit template with clause selection grid
2. **ViewTemplateModal**: Comprehensive template details with metrics
3. **UseTemplateModal**: Quick contract generation from template
4. **FilterModal**: Advanced filtering by category, type, status, usage

**Entities**:
- `contract_templates` - Template definitions
- `contract_template_clauses` - Clauses included in template
- `contract_template_versions` - Template version history
- `contract_template_usage` - Template usage tracking

---

### 2. CONTRACT GENERATION Module
**Purpose**: Generate new contracts from templates or from scratch with intelligent clause selection

**Pages**:
- `/cpq/contracts/generate` - Multi-step contract generation wizard
- Steps: 1) Select Template/Quote → 2) Fill Details → 3) Select Clauses → 4) Review → 5) Submit

**Key Features**:
- **Quote Integration**: Import contract details from approved quotes
- **Template-Based Generation**: Start from pre-defined templates
- **Blank Contract Creation**: Build contract from scratch
- **Intelligent Clause Recommendation**: AI-powered clause suggestions based on contract type, value, and customer
- **Dynamic Field Mapping**: Auto-populate fields from quote/customer data
- **Real-Time Preview**: Live preview of contract as it's being built
- **Save as Draft**: Save progress and continue later
- **Clause Search**: Search and filter from entire clause library
- **Clause Customization**: Modify standard clauses for specific contracts
- **Auto-Save**: Prevent data loss with periodic auto-save
- **Contract Metadata**: Title, description, contract type, customer, contact, value, dates, terms

**Modals Needed**:
1. **SelectTemplateModal**: Choose from template library with preview
2. **SelectQuoteModal**: Import data from approved quotes
3. **SelectClausesModal**: Browse and select clauses with search/filter
4. **PreviewContractModal**: Full-screen preview with edit capability
5. **SaveDraftModal**: Save progress with notes
6. **ClauseCustomizationModal**: Edit clause text for this contract only

**Entities**:
- `contracts` - Main contract records
- `contract_clauses_junction` - Clauses included in specific contract
- `contract_clause_customizations` - Contract-specific clause modifications
- `contract_drafts` - Saved draft contracts

---

### 3. CONTRACT CLAUSES Module
**Purpose**: Centralized clause library with version control, approval workflow, and categorization

**Pages**:
- `/cpq/contracts/clauses` - Clause library with list/grid view
- Clause cards show: title, category, subcategory, version, usage count, status, risk level

**Key Features**:
- **Clause Repository**: Centralized library of all legal clauses
- **Clause Categories**: Essential, Legal, Financial, Operational, Termination, IP Rights, Confidentiality, Warranties, Indemnity, Dispute Resolution, Force Majeure
- **Clause Subcategories**: More granular classification within categories
- **Version Control**: Track clause versions with change history
- **Approval Workflow**: Legal review and approval for new/modified clauses
- **Risk Level Classification**: High, Medium, Low risk clauses
- **Usage Tracking**: Monitor which clauses are used most frequently
- **Clause Status**: Draft, Under Review, Approved, Active, Deprecated, Archived
- **Clause Templates**: Standard language with placeholders
- **Clause Dependencies**: Some clauses require other clauses
- **Compliance Tags**: Tag clauses with regulatory compliance requirements (GDPR, SOX, HIPAA, etc.)
- **Clause Search**: Full-text search with filters

**Modals Needed**:
1. **CreateClauseModal**: Create new clause with rich text editor
2. **EditClauseModal**: Modify clause (creates new version)
3. **ViewClauseModal**: View clause details, version history, usage analytics
4. **ClauseVersionHistoryModal**: Compare clause versions side-by-side
5. **ClauseApprovalModal**: Submit clause for legal review with comments
6. **ClauseDependenciesModal**: Define which clauses require this clause
7. **FilterModal**: Advanced filtering by category, risk level, status, compliance tags

**Entities**:
- `contract_clauses` - Master clause library
- `clause_categories` - Clause categorization (master)
- `clause_versions` - Version history for each clause
- `clause_approvals` - Approval workflow tracking
- `clause_dependencies` - Clause interdependencies
- `clause_usage_tracking` - Usage analytics

---

### 4. CONTRACT EXECUTION Module
**Purpose**: Track active contracts, monitor milestones, deliverables, payments, and obligations

**Pages**:
- `/cpq/contracts/execution` - Active contracts dashboard
- Contract list with: customer, value, start/end dates, progress, status, milestones, payments
- Visual indicators: timeline progress bar, milestone completion, payment status

**Key Features**:
- **Milestone Tracking**: Define and track contract milestones with due dates
- **Deliverable Management**: Track deliverables with acceptance criteria
- **Payment Schedule**: Monitor payment milestones and due dates
- **Obligation Tracking**: Track both parties' contractual obligations
- **Performance Monitoring**: Track SLA compliance and performance metrics
- **Auto-Renewal Alerts**: Automated notifications for upcoming renewals
- **Expiration Warnings**: Alerts for contracts nearing expiration
- **Amendment Tracking**: Quick access to all contract amendments
- **Document Repository**: Centralized storage for all contract documents
- **Timeline View**: Visual timeline of contract lifecycle
- **Revenue Recognition**: Track revenue recognition based on milestones
- **Risk Alerts**: Flag contracts at risk (late deliverables, payment delays, SLA violations)

**Modals Needed**:
1. **ViewContractModal**: Comprehensive contract details with all tabs
2. **MilestoneModal**: Create/edit milestones with dates and dependencies
3. **DeliverableModal**: Add/update deliverables with acceptance criteria
4. **PaymentModal**: Record payment schedules and track payments
5. **ObligationModal**: Track contractual obligations for both parties
6. **DocumentUploadModal**: Upload and categorize contract documents
7. **RenewalModal**: Initiate contract renewal process
8. **AmendmentSummaryModal**: Quick view of all amendments
9. **PerformanceMetricsModal**: View SLA compliance and KPIs
10. **TerminationModal**: Terminate contract with reason and effective date

**Entities**:
- `contracts` - Active contract records
- `contract_milestones` - Milestone definitions and tracking
- `contract_deliverables` - Deliverable tracking
- `contract_payments` - Payment schedule and tracking
- `contract_obligations` - Obligation tracking
- `contract_performance_metrics` - SLA and KPI tracking
- `contract_documents` - Document repository
- `contract_renewal_tracking` - Renewal automation

---

### 5. CONTRACT APPROVALS Module
**Purpose**: Multi-level approval workflow for contracts, amendments, and renewals

**Pages**:
- `/cpq/contracts/approvals` - Approval queue and history
- Approval cards show: contract number, customer, value, approval level, pending with, due date, priority

**Key Features**:
- **Multi-Level Approval Chain**: Sequential or parallel approval routing
- **Approval Rules**: Route approvals based on contract value, type, risk level, discount
- **Approval Hierarchy**: Legal → Finance → Business → Executive approvals
- **Auto-Approval Rules**: Auto-approve based on criteria (e.g., < $10K, standard terms)
- **Delegation**: Approvers can delegate to others
- **Approval History**: Complete audit trail of all approvals
- **Approval SLA**: Track time spent at each approval level
- **Conditional Approvals**: Approve with conditions or modifications
- **Rejection Workflow**: Reject with comments, send back to creator
- **Escalation**: Auto-escalate if pending too long
- **Approval Notifications**: Email/SMS notifications to approvers
- **Bulk Approval**: Approve multiple contracts at once
- **Approval Templates**: Pre-defined approval chains for different scenarios

**Modals Needed**:
1. **ViewApprovalModal**: Detailed approval request with contract summary
2. **ApproveModal**: Approve with comments and optional conditions
3. **RejectModal**: Reject with reason and comments
4. **ApprovalChainModal**: View complete approval chain with status
5. **DelegateModal**: Delegate approval to another user
6. **EscalateModal**: Escalate to higher authority
7. **ApprovalHistoryModal**: View approval history with timeline
8. **BulkApprovalModal**: Review and approve multiple contracts
9. **ConditionalApprovalModal**: Approve with specific conditions
10. **FilterModal**: Filter by approval status, priority, value, date

**Entities**:
- `contract_approvals` - Approval requests
- `contract_approval_chain` - Approval workflow definition
- `contract_approval_history` - Approval audit trail
- `contract_approval_rules` - Auto-approval and routing rules
- `contract_approval_delegations` - Delegation tracking
- `contract_approval_sla` - SLA tracking for approvals

---

## Common Masters (Lookup Tables)

These are reference/lookup tables used across Contract Management features for data consistency and normalization.

### 1. **Contract Classification Masters**

```sql
-- Contract Types Table
contract_types
├── id (PK)
├── name (Sales Contract, Service Agreement, NDA, Partnership Agreement, MSA, SOW, Employment Contract)
├── code (SALES, SERVICE, NDA, PARTNER, MSA, SOW, EMP)
├── description
├── requires_legal_review (BOOLEAN)
├── default_duration_months
├── is_active
└── sequence (display order)

-- Contract Categories Table
contract_categories
├── id (PK)
├── name (Sales, Service, Legal, Partnership, Employment, Procurement)
├── code
├── description
└── is_active

-- Contract Statuses Table
contract_statuses
├── id (PK)
├── name (Draft, Under Review, Pending Approval, Approved, Active, Expired, Terminated, Renewed)
├── code
├── status_type (pre_active, active, post_active)
├── sequence
├── is_final
├── color_code (for UI)
└── is_active
```

### 2. **Clause Masters**

```sql
-- Clause Categories Table
clause_categories
├── id (PK)
├── name (Essential, Legal, Financial, Operational, Termination, IP Rights, Confidentiality, Warranties, Indemnity, Dispute Resolution)
├── code
├── parent_id (FK -> clause_categories) -- for subcategories
├── description
├── sequence
└── is_active

-- Clause Risk Levels Table
clause_risk_levels
├── id (PK)
├── name (Low, Medium, High, Critical)
├── level (1-4)
├── requires_legal_review (BOOLEAN)
├── requires_executive_approval (BOOLEAN)
└── color_code

-- Compliance Tags Table
compliance_tags
├── id (PK)
├── name (GDPR, SOX, HIPAA, PCI-DSS, ISO 27001, CCPA, etc.)
├── description
├── regulatory_body
├── jurisdiction
└── is_active
```

### 3. **Approval Masters**

```sql
-- Approval Levels Table
approval_levels
├── id (PK)
├── name (Legal Review, Finance Review, Business Review, Executive Approval, Board Approval)
├── level_number (1-5)
├── sequence
├── is_required (BOOLEAN)
└── default_sla_hours

-- Approval Statuses Table
approval_statuses
├── id (PK)
├── name (Pending, Approved, Rejected, Approved with Conditions, Delegated, Escalated)
├── code
├── is_final
└── color_code

-- Approval Priority Table
approval_priorities
├── id (PK)
├── name (Low, Medium, High, Urgent, Critical)
├── level (1-5)
├── sla_hours
└── color_code
```

### 4. **Milestone & Deliverable Masters**

```sql
-- Milestone Types Table
milestone_types
├── id (PK)
├── name (Kickoff, Design Phase, Development Phase, Testing Phase, Deployment, Go-Live, Project Closure)
├── description
├── typical_duration_days
└── is_active

-- Deliverable Types Table
deliverable_types
├── id (PK)
├── name (Document, Software, Hardware, Service, Training, Report, etc.)
├── description
├── requires_acceptance (BOOLEAN)
└── is_active

-- Deliverable Statuses Table
deliverable_statuses
├── id (PK)
├── name (Not Started, In Progress, Submitted, Under Review, Accepted, Rejected, Revised)
├── sequence
├── is_final
└── color_code
```

### 5. **Payment Masters**

```sql
-- Payment Types Table
payment_types
├── id (PK)
├── name (Advance Payment, Milestone Payment, Recurring Payment, Final Payment, Penalty, Incentive)
├── code
├── description
└── is_active

-- Payment Statuses Table
payment_statuses
├── id (PK)
├── name (Pending, Due, Partially Paid, Paid, Overdue, Waived, Disputed)
├── code
├── is_overdue
├── color_code
└── sequence

-- Payment Methods Table
payment_methods
├── id (PK)
├── name (Bank Transfer, Check, Credit Card, ACH, Wire Transfer, Cash, Cryptocurrency)
├── code
├── processing_days
└── is_active

-- Payment Terms Table
payment_terms
├── id (PK)
├── name (Net 15, Net 30, Net 45, Net 60, Due on Receipt, 50% Advance + 50% on Completion)
├── days
├── description
└── is_active
```

### 6. **Amendment Masters**

```sql
-- Amendment Types Table
amendment_types
├── id (PK)
├── name (Value Change, Scope Change, Term Extension, Term Reduction, Pricing Change, Party Change, Clause Addition, Clause Removal)
├── code
├── requires_legal_review (BOOLEAN)
├── requires_finance_approval (BOOLEAN)
└── is_active

-- Amendment Statuses Table
amendment_statuses
├── id (PK)
├── name (Draft, Under Review, Pending Approval, Approved, Rejected, Active, Superseded)
├── sequence
├── is_final
└── color_code
```

### 7. **Renewal & Termination Masters**

```sql
-- Renewal Types Table
renewal_types
├── id (PK)
├── name (Auto-Renewal, Manual Renewal, Renegotiation Required, Non-Renewable)
├── code
└── description

-- Termination Reasons Table
termination_reasons
├── id (PK)
├── reason (Mutual Agreement, Breach of Contract, Non-Performance, Budget Constraints, Business Closure, Force Majeure)
├── reason_type (internal, external, mutual)
├── requires_penalty (BOOLEAN)
└── notice_period_days

-- Notice Period Types Table
notice_period_types
├── id (PK)
├── name (30 Days, 60 Days, 90 Days, 6 Months, 12 Months, Immediate)
├── days
└── description
```

### 8. **Document Masters**

```sql
-- Document Types Table
document_types
├── id (PK)
├── name (Signed Contract, Amendment, SOW, Invoice, Receipt, Correspondence, Legal Notice, Compliance Certificate)
├── code
├── allowed_extensions (PDF, DOCX, XLSX, etc.)
├── max_size_mb
├── requires_signature (BOOLEAN)
└── is_active

-- Document Categories Table
document_categories
├── id (PK)
├── name (Legal, Financial, Technical, Operational, Compliance, Correspondence)
├── description
└── retention_period_years
```

---

## Normalized Database Schema

### Core Entity Tables

#### 1. CONTRACT_TEMPLATES Table

```sql
CREATE TABLE contract_templates (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    category VARCHAR(100) NOT NULL, -- Sales, Service, Legal, Partnership, Employment
    contract_type_id UUID REFERENCES contract_types(id) NOT NULL,

    -- Template Content
    template_content TEXT, -- Rich text with placeholders
    placeholders JSONB, -- {field_name: {type, label, default_value, required}}

    -- Metrics
    clauses_count INT DEFAULT 0,
    pages_count INT DEFAULT 0,
    usage_count INT DEFAULT 0,
    avg_contract_value DECIMAL(15,2),
    avg_duration_months INT,

    -- Status & Lifecycle
    status VARCHAR(50) DEFAULT 'draft', -- draft, active, archived
    is_favorite BOOLEAN DEFAULT FALSE,

    -- Ownership
    created_by_user_id UUID REFERENCES users(id) NOT NULL,
    created_by_team VARCHAR(100), -- Legal Team, Service Team, etc.
    created_date DATE NOT NULL,

    -- Metadata
    notes TEXT,
    tags TEXT[], -- Array of tags for search
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_template_type (contract_type_id),
    INDEX idx_template_category (category),
    INDEX idx_template_status (status),
    INDEX idx_template_created (created_date)
);
```

#### 2. CONTRACT_TEMPLATE_CLAUSES Junction Table

```sql
CREATE TABLE contract_template_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES contract_templates(id) ON DELETE CASCADE,
    clause_id UUID REFERENCES contract_clauses(id),

    -- Ordering
    sequence INT NOT NULL, -- Order of clauses in template
    section_number VARCHAR(20), -- e.g., "1.1", "2.3.4"
    section_title VARCHAR(255),

    -- Customization
    is_required BOOLEAN DEFAULT TRUE, -- Mandatory or optional clause
    is_editable BOOLEAN DEFAULT FALSE, -- Can be edited during contract generation
    custom_title VARCHAR(255), -- Override clause title for this template

    -- Metadata
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by UUID REFERENCES users(id),

    INDEX idx_template_clause_template (template_id),
    INDEX idx_template_clause_clause (clause_id),
    INDEX idx_template_clause_sequence (template_id, sequence)
);
```

#### 3. CONTRACT_CLAUSES Table

```sql
CREATE TABLE contract_clauses (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    clause_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Clause Content
    clause_text TEXT NOT NULL, -- Rich text content
    has_placeholders BOOLEAN DEFAULT FALSE,
    placeholders JSONB, -- {field_name: {type, label, default_value}}

    -- Classification
    category_id UUID REFERENCES clause_categories(id) NOT NULL,
    subcategory VARCHAR(100),
    risk_level_id UUID REFERENCES clause_risk_levels(id),

    -- Compliance
    compliance_tags UUID[], -- Array of compliance_tags IDs
    requires_legal_review BOOLEAN DEFAULT FALSE,

    -- Versioning
    version_number INT DEFAULT 1,
    is_current_version BOOLEAN DEFAULT TRUE,
    previous_version_id UUID REFERENCES contract_clauses(id),

    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, under_review, approved, active, deprecated, archived
    approved_date DATE,
    approved_by_user_id UUID REFERENCES users(id),

    -- Usage Tracking
    usage_count INT DEFAULT 0,
    last_used_date DATE,

    -- Dependencies
    requires_clauses UUID[], -- Array of clause IDs that this clause depends on
    conflicts_with_clauses UUID[], -- Array of clause IDs that conflict with this

    -- Metadata
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    notes TEXT,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_clause_category (category_id),
    INDEX idx_clause_status (status),
    INDEX idx_clause_risk (risk_level_id),
    INDEX idx_clause_version (version_number, is_current_version)
);
```

#### 4. CONTRACTS Table (Main Contract Records)

```sql
CREATE TABLE contracts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Associated Records
    customer_id UUID REFERENCES customers(id) NOT NULL,
    contact_id UUID REFERENCES contacts(id),
    opportunity_id UUID REFERENCES opportunities(id), -- Link to CRM opportunity
    quote_id UUID REFERENCES quotes(id), -- Link to CPQ quote

    -- Classification
    contract_type_id UUID REFERENCES contract_types(id) NOT NULL,
    contract_category_id UUID REFERENCES contract_categories(id),

    -- Template Reference
    template_id UUID REFERENCES contract_templates(id), -- If generated from template

    -- Status & Lifecycle
    status_id UUID REFERENCES contract_statuses(id) NOT NULL,

    -- Financial Details
    contract_value DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_terms_id UUID REFERENCES payment_terms(id),
    billing_frequency VARCHAR(50), -- One-time, Monthly, Quarterly, Annually

    -- Contract Term
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_months INT,

    -- Renewal
    auto_renew BOOLEAN DEFAULT FALSE,
    renewal_type_id UUID REFERENCES renewal_types(id),
    renewal_notice_days INT DEFAULT 30,
    renewal_date DATE, -- Calculated based on end_date and notice period

    -- Ownership & Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,
    contract_manager_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),

    -- E-Signature & Execution
    requires_signature BOOLEAN DEFAULT TRUE,

    -- Customer Signature
    customer_signed BOOLEAN DEFAULT FALSE,
    customer_signed_by VARCHAR(255),
    customer_signed_date TIMESTAMP,
    customer_signature_url VARCHAR(500),

    -- Company Signature
    company_signed BOOLEAN DEFAULT FALSE,
    company_signed_by_user_id UUID REFERENCES users(id),
    company_signed_date TIMESTAMP,
    company_signature_url VARCHAR(500),

    -- Both parties signed
    fully_executed BOOLEAN DEFAULT FALSE,
    execution_date TIMESTAMP,

    -- Legal Details
    governing_law VARCHAR(100), -- State/Country law
    jurisdiction VARCHAR(100),
    dispute_resolution VARCHAR(100), -- Arbitration, Litigation, Mediation

    -- Amendment Tracking
    has_amendments BOOLEAN DEFAULT FALSE,
    amendment_count INT DEFAULT 0,
    current_amendment_id UUID REFERENCES contract_amendments(id),

    -- Performance Tracking
    performance_score DECIMAL(5,2), -- 0-100
    compliance_score DECIMAL(5,2), -- 0-100
    risk_level VARCHAR(20), -- Low, Medium, High, Critical

    -- Termination
    is_terminated BOOLEAN DEFAULT FALSE,
    termination_date DATE,
    termination_reason_id UUID REFERENCES termination_reasons(id),
    termination_notes TEXT,

    -- Documents
    primary_document_id UUID REFERENCES contract_documents(id),
    document_count INT DEFAULT 0,

    -- Metadata
    terms_and_conditions TEXT,
    special_terms TEXT,
    internal_notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_contract_customer (customer_id),
    INDEX idx_contract_owner (owner_id),
    INDEX idx_contract_status (status_id),
    INDEX idx_contract_type (contract_type_id),
    INDEX idx_contract_dates (start_date, end_date),
    INDEX idx_contract_renewal (renewal_date),
    INDEX idx_contract_template (template_id)
);
```

#### 5. CONTRACT_CLAUSES_JUNCTION Table

```sql
CREATE TABLE contract_clauses_junction (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    clause_id UUID REFERENCES contract_clauses(id),

    -- Ordering
    sequence INT NOT NULL,
    section_number VARCHAR(20),
    section_title VARCHAR(255),

    -- Customization
    is_customized BOOLEAN DEFAULT FALSE,
    customized_text TEXT, -- If clause was modified for this contract
    customization_reason TEXT,

    -- Approval
    requires_approval BOOLEAN DEFAULT FALSE,
    is_approved BOOLEAN DEFAULT FALSE,
    approved_by_user_id UUID REFERENCES users(id),
    approved_date TIMESTAMP,

    -- Metadata
    added_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    added_by UUID REFERENCES users(id),
    modified_at TIMESTAMP,

    INDEX idx_contract_clause_contract (contract_id),
    INDEX idx_contract_clause_clause (clause_id),
    INDEX idx_contract_clause_sequence (contract_id, sequence)
);
```

#### 6. CONTRACT_MILESTONES Table

```sql
CREATE TABLE contract_milestones (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,

    -- Milestone Information
    milestone_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    milestone_type_id UUID REFERENCES milestone_types(id),

    -- Dates
    planned_start_date DATE,
    planned_end_date DATE,
    actual_start_date DATE,
    actual_end_date DATE,
    due_date DATE NOT NULL,

    -- Status
    status VARCHAR(50) DEFAULT 'not_started', -- not_started, in_progress, completed, delayed, cancelled
    completion_percentage DECIMAL(5,2) DEFAULT 0,

    -- Dependencies
    depends_on_milestone_id UUID REFERENCES contract_milestones(id),
    is_critical BOOLEAN DEFAULT FALSE, -- Critical path milestone

    -- Financial
    milestone_value DECIMAL(15,2), -- Portion of contract value tied to this milestone
    payment_on_completion BOOLEAN DEFAULT FALSE,

    -- Acceptance
    requires_acceptance BOOLEAN DEFAULT TRUE,
    accepted_by VARCHAR(255),
    acceptance_date TIMESTAMP,
    acceptance_notes TEXT,

    -- Alerts
    is_at_risk BOOLEAN DEFAULT FALSE,
    risk_reason TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_milestone_contract (contract_id),
    INDEX idx_milestone_due_date (due_date),
    INDEX idx_milestone_status (status)
);
```

#### 7. CONTRACT_DELIVERABLES Table

```sql
CREATE TABLE contract_deliverables (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES contract_milestones(id), -- Optional: link to milestone

    -- Deliverable Information
    deliverable_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    deliverable_type_id UUID REFERENCES deliverable_types(id),

    -- Status
    status_id UUID REFERENCES deliverable_statuses(id) NOT NULL,

    -- Dates
    due_date DATE NOT NULL,
    submitted_date DATE,
    accepted_date DATE,
    rejected_date DATE,

    -- Acceptance Criteria
    acceptance_criteria TEXT,
    requires_acceptance BOOLEAN DEFAULT TRUE,
    accepted_by VARCHAR(255),
    acceptance_notes TEXT,
    rejection_reason TEXT,

    -- Revision Tracking
    revision_number INT DEFAULT 1,
    has_revisions BOOLEAN DEFAULT FALSE,

    -- File/Document
    document_id UUID REFERENCES contract_documents(id),
    file_url VARCHAR(500),

    -- Quality Metrics
    quality_score DECIMAL(5,2), -- 0-100
    meets_criteria BOOLEAN,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_deliverable_contract (contract_id),
    INDEX idx_deliverable_milestone (milestone_id),
    INDEX idx_deliverable_due_date (due_date),
    INDEX idx_deliverable_status (status_id)
);
```

#### 8. CONTRACT_PAYMENTS Table

```sql
CREATE TABLE contract_payments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,
    milestone_id UUID REFERENCES contract_milestones(id), -- Optional: link to milestone

    -- Payment Information
    payment_number VARCHAR(50) NOT NULL,
    description TEXT,

    -- Classification
    payment_type_id UUID REFERENCES payment_types(id) NOT NULL,

    -- Financial
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'INR',
    payment_percentage DECIMAL(5,2), -- Percentage of total contract value

    -- Dates
    due_date DATE NOT NULL,
    scheduled_date DATE,
    payment_date DATE,

    -- Status
    status_id UUID REFERENCES payment_statuses(id) NOT NULL,

    -- Payment Details
    payment_method_id UUID REFERENCES payment_methods(id),
    payment_terms_id UUID REFERENCES payment_terms(id),
    invoice_number VARCHAR(50),
    invoice_date DATE,
    invoice_document_id UUID REFERENCES contract_documents(id),

    -- Payment Received
    amount_received DECIMAL(15,2),
    received_date DATE,
    transaction_reference VARCHAR(255),
    receipt_number VARCHAR(50),
    receipt_document_id UUID REFERENCES contract_documents(id),

    -- Late Payment
    is_overdue BOOLEAN DEFAULT FALSE,
    days_overdue INT,
    late_fee_amount DECIMAL(15,2),
    late_fee_percentage DECIMAL(5,2),

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_payment_contract (contract_id),
    INDEX idx_payment_milestone (milestone_id),
    INDEX idx_payment_due_date (due_date),
    INDEX idx_payment_status (status_id)
);
```

#### 9. CONTRACT_AMENDMENTS Table

```sql
CREATE TABLE contract_amendments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,

    -- Amendment Information
    amendment_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Classification
    amendment_type_id UUID REFERENCES amendment_types(id) NOT NULL,

    -- Status
    status_id UUID REFERENCES amendment_statuses(id) NOT NULL,

    -- Amendment Details
    reason TEXT NOT NULL,
    justification TEXT,
    impacted_clauses TEXT[], -- Array of clause IDs affected
    new_clauses_added UUID[], -- Array of new clause IDs
    clauses_removed UUID[], -- Array of removed clause IDs
    clauses_modified JSONB, -- {clause_id: {old_text, new_text}}

    -- Financial Impact
    original_value DECIMAL(15,2),
    amended_value DECIMAL(15,2),
    value_change DECIMAL(15,2),
    value_change_percentage DECIMAL(5,2),

    -- Term Impact
    original_end_date DATE,
    amended_end_date DATE,
    term_extension_months INT,

    -- Effective Date
    effective_date DATE NOT NULL,

    -- Approval
    requires_approval BOOLEAN DEFAULT TRUE,
    approval_status VARCHAR(50), -- pending, approved, rejected
    approved_by_user_id UUID REFERENCES users(id),
    approved_date TIMESTAMP,
    approval_notes TEXT,

    -- E-Signature
    requires_signature BOOLEAN DEFAULT TRUE,
    customer_signed BOOLEAN DEFAULT FALSE,
    customer_signed_by VARCHAR(255),
    customer_signed_date TIMESTAMP,
    company_signed BOOLEAN DEFAULT FALSE,
    company_signed_by_user_id UUID REFERENCES users(id),
    company_signed_date TIMESTAMP,

    -- Superseded Tracking
    is_superseded BOOLEAN DEFAULT FALSE,
    superseded_by_amendment_id UUID REFERENCES contract_amendments(id),

    -- Document
    document_id UUID REFERENCES contract_documents(id),

    -- Metadata
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_amendment_contract (contract_id),
    INDEX idx_amendment_type (amendment_type_id),
    INDEX idx_amendment_status (status_id),
    INDEX idx_amendment_effective_date (effective_date)
);
```

#### 10. CONTRACT_APPROVALS Table

```sql
CREATE TABLE contract_approvals (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),

    -- Polymorphic Reference (can approve contract, amendment, renewal)
    entity_type VARCHAR(50) NOT NULL, -- contract, amendment, renewal
    entity_id UUID NOT NULL,

    -- Approval Information
    approval_number VARCHAR(50) UNIQUE NOT NULL,

    -- What is being approved
    contract_id UUID REFERENCES contracts(id),
    amendment_id UUID REFERENCES contract_amendments(id),

    -- Requester
    requested_by_user_id UUID REFERENCES users(id) NOT NULL,
    requested_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    request_reason TEXT,

    -- Current Approver
    current_approval_level_id UUID REFERENCES approval_levels(id) NOT NULL,
    current_approver_user_id UUID REFERENCES users(id),
    current_approver_team_id UUID REFERENCES teams(id),

    -- Priority
    priority_id UUID REFERENCES approval_priorities(id) NOT NULL,

    -- Status
    approval_status_id UUID REFERENCES approval_statuses(id) NOT NULL,

    -- SLA
    sla_hours INT,
    due_date TIMESTAMP,
    is_overdue BOOLEAN DEFAULT FALSE,

    -- Contract Details (for quick reference)
    customer_name VARCHAR(255),
    contract_value DECIMAL(15,2),
    contract_type VARCHAR(100),
    discount_percentage DECIMAL(5,2),

    -- Risk Assessment
    risk_level VARCHAR(20), -- Low, Medium, High, Critical
    risk_factors JSONB, -- {factor: description}

    -- Approval Decision
    decision VARCHAR(50), -- pending, approved, rejected, approved_with_conditions, escalated
    decision_date TIMESTAMP,
    decision_by_user_id UUID REFERENCES users(id),
    decision_comments TEXT,
    approval_conditions TEXT, -- If approved with conditions

    -- Escalation
    is_escalated BOOLEAN DEFAULT FALSE,
    escalated_to_user_id UUID REFERENCES users(id),
    escalated_date TIMESTAMP,
    escalation_reason TEXT,

    -- Delegation
    is_delegated BOOLEAN DEFAULT FALSE,
    delegated_to_user_id UUID REFERENCES users(id),
    delegated_date TIMESTAMP,
    delegation_reason TEXT,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_approval_entity (entity_type, entity_id),
    INDEX idx_approval_contract (contract_id),
    INDEX idx_approval_current_approver (current_approver_user_id),
    INDEX idx_approval_status (approval_status_id),
    INDEX idx_approval_priority (priority_id),
    INDEX idx_approval_due_date (due_date)
);
```

#### 11. CONTRACT_APPROVAL_CHAIN Table

```sql
CREATE TABLE contract_approval_chain (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    approval_id UUID REFERENCES contract_approvals(id) ON DELETE CASCADE,

    -- Chain Information
    level_number INT NOT NULL, -- 1, 2, 3...
    approval_level_id UUID REFERENCES approval_levels(id) NOT NULL,

    -- Approver
    approver_user_id UUID REFERENCES users(id),
    approver_role VARCHAR(100), -- Legal, Finance, Executive, etc.
    is_required BOOLEAN DEFAULT TRUE,

    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, approved, rejected, skipped

    -- Dates
    started_at TIMESTAMP,
    completed_at TIMESTAMP,

    -- Decision
    decision VARCHAR(50), -- approved, rejected, approved_with_conditions, escalated
    decision_date TIMESTAMP,
    comments TEXT,
    conditions TEXT,

    -- SLA
    sla_hours INT,
    is_within_sla BOOLEAN,

    -- Sequence Control
    is_parallel BOOLEAN DEFAULT FALSE, -- Can run parallel with same level number
    previous_level_id UUID REFERENCES contract_approval_chain(id),
    next_level_id UUID REFERENCES contract_approval_chain(id),

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_approval_chain_approval (approval_id),
    INDEX idx_approval_chain_approver (approver_user_id),
    INDEX idx_approval_chain_level (level_number)
);
```

#### 12. CONTRACT_DOCUMENTS Table

```sql
CREATE TABLE contract_documents (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,

    -- Document Information
    document_number VARCHAR(50) UNIQUE NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    document_type_id UUID REFERENCES document_types(id) NOT NULL,
    document_category_id UUID REFERENCES document_categories(id),

    -- File Details
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT, -- in bytes
    file_type VARCHAR(100), -- MIME type
    file_extension VARCHAR(10),
    file_path VARCHAR(500) NOT NULL,
    file_url VARCHAR(500),

    -- Storage
    storage_location VARCHAR(100), -- local, s3, azure, gcp
    bucket_name VARCHAR(255),
    object_key VARCHAR(500),

    -- Version Control
    version_number INT DEFAULT 1,
    is_current_version BOOLEAN DEFAULT TRUE,
    previous_version_id UUID REFERENCES contract_documents(id),

    -- Status
    status VARCHAR(50) DEFAULT 'draft', -- draft, final, superseded, archived
    is_signed BOOLEAN DEFAULT FALSE,
    signature_count INT DEFAULT 0,

    -- Checksum for integrity
    checksum VARCHAR(255), -- SHA-256 hash

    -- Access Control
    is_public BOOLEAN DEFAULT FALSE,
    is_confidential BOOLEAN DEFAULT FALSE,
    access_level VARCHAR(50), -- public, internal, confidential, restricted

    -- Retention
    retention_years INT,
    retention_end_date DATE,

    -- Metadata
    tags TEXT[],
    uploaded_by UUID REFERENCES users(id) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed_at TIMESTAMP,
    download_count INT DEFAULT 0,

    -- Soft Delete
    deleted_at TIMESTAMP,

    INDEX idx_document_contract (contract_id),
    INDEX idx_document_type (document_type_id),
    INDEX idx_document_status (status),
    INDEX idx_document_uploaded (uploaded_at)
);
```

#### 13. CONTRACT_OBLIGATIONS Table

```sql
CREATE TABLE contract_obligations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,

    -- Obligation Information
    obligation_number VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Party Responsible
    responsible_party VARCHAR(50) NOT NULL, -- company, customer
    responsible_contact_id UUID REFERENCES contacts(id),

    -- Classification
    obligation_type VARCHAR(100), -- Deliverable, Payment, Compliance, Reporting, Performance

    -- Frequency
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50), -- One-time, Daily, Weekly, Monthly, Quarterly, Annually

    -- Dates
    start_date DATE,
    due_date DATE NOT NULL,
    completed_date DATE,

    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, in_progress, completed, overdue, waived
    completion_percentage DECIMAL(5,2) DEFAULT 0,

    -- Compliance
    is_compliant BOOLEAN,
    compliance_checked_date DATE,
    compliance_checked_by_user_id UUID REFERENCES users(id),
    non_compliance_reason TEXT,

    -- Penalties
    has_penalty BOOLEAN DEFAULT FALSE,
    penalty_amount DECIMAL(15,2),
    penalty_description TEXT,

    -- Reminder
    reminder_days_before INT DEFAULT 7,
    reminder_sent BOOLEAN DEFAULT FALSE,
    reminder_sent_date DATE,

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_obligation_contract (contract_id),
    INDEX idx_obligation_due_date (due_date),
    INDEX idx_obligation_status (status),
    INDEX idx_obligation_party (responsible_party)
);
```

#### 14. CONTRACT_PERFORMANCE_METRICS Table

```sql
CREATE TABLE contract_performance_metrics (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,

    -- Metric Information
    metric_name VARCHAR(255) NOT NULL,
    metric_description TEXT,
    metric_type VARCHAR(100), -- SLA, KPI, Quality, Performance

    -- Target Values
    target_value DECIMAL(15,2) NOT NULL,
    target_unit VARCHAR(50), -- percentage, count, days, hours, etc.

    -- Actual Values
    actual_value DECIMAL(15,2),
    actual_unit VARCHAR(50),

    -- Performance
    performance_percentage DECIMAL(5,2), -- (actual/target) * 100
    meets_target BOOLEAN,
    variance DECIMAL(15,2), -- actual - target

    -- Measurement Period
    measurement_period VARCHAR(50), -- Daily, Weekly, Monthly, Quarterly, Annually
    period_start_date DATE,
    period_end_date DATE,

    -- Status
    status VARCHAR(50), -- on_track, at_risk, behind, exceeded

    -- Thresholds
    warning_threshold DECIMAL(15,2),
    critical_threshold DECIMAL(15,2),

    -- Consequences
    has_penalty BOOLEAN DEFAULT FALSE,
    penalty_amount DECIMAL(15,2),
    has_incentive BOOLEAN DEFAULT FALSE,
    incentive_amount DECIMAL(15,2),

    -- Metadata
    measured_date DATE,
    measured_by_user_id UUID REFERENCES users(id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_metric_contract (contract_id),
    INDEX idx_metric_period (period_start_date, period_end_date),
    INDEX idx_metric_status (status)
);
```

#### 15. CONTRACT_RENEWAL_TRACKING Table

```sql
CREATE TABLE contract_renewal_tracking (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contract_id UUID REFERENCES contracts(id) ON DELETE CASCADE,

    -- Renewal Information
    renewal_number VARCHAR(50) UNIQUE NOT NULL,

    -- Renewal Type
    renewal_type_id UUID REFERENCES renewal_types(id) NOT NULL,
    is_auto_renewal BOOLEAN DEFAULT FALSE,

    -- Dates
    current_end_date DATE NOT NULL,
    renewal_notice_date DATE NOT NULL, -- When to send renewal notice
    renewal_due_date DATE, -- Decision deadline
    new_start_date DATE,
    new_end_date DATE,
    new_duration_months INT,

    -- Status
    status VARCHAR(50) DEFAULT 'pending', -- pending, notified, under_review, approved, rejected, renewed, not_renewed

    -- Decision
    decision VARCHAR(50), -- renew, renegotiate, terminate, extend
    decision_date DATE,
    decision_by_user_id UUID REFERENCES users(id),
    decision_reason TEXT,

    -- New Contract Terms
    new_contract_value DECIMAL(15,2),
    value_change_percentage DECIMAL(5,2),
    pricing_change_reason TEXT,

    -- Notifications
    notice_sent BOOLEAN DEFAULT FALSE,
    notice_sent_date DATE,
    reminder_count INT DEFAULT 0,
    last_reminder_date DATE,

    -- Renewed Contract
    renewed_contract_id UUID REFERENCES contracts(id), -- If renewal created new contract

    -- Metadata
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_renewal_contract (contract_id),
    INDEX idx_renewal_notice_date (renewal_notice_date),
    INDEX idx_renewal_status (status)
);
```

---

## Entity Relationships

### Relationship Diagram

```
contract_templates
  ↓ has_many (via contract_template_clauses)
contract_clauses
  ↑ used_in_many

contract_templates → generates → contracts
                                    ↓
                                    ↓
                           has_many_clauses (via contract_clauses_junction)
                                    ↓
                                    ↓
contracts → has_many → contract_milestones
         ↓                        ↓
         ↓                        ↓
         → has_many → contract_deliverables
         ↓
         ↓
         → has_many → contract_payments
         ↓
         ↓
         → has_many → contract_amendments
         ↓                        ↓
         ↓                        ↓
         ↓                requires_approval
         ↓                        ↓
         ↓                        ↓
         → requires_approval → contract_approvals
         ↓                        ↓
         ↓                        ↓
         ↓                   has_chain
         ↓                        ↓
         ↓                        ↓
         ↓              contract_approval_chain
         ↓
         ↓
         → has_many → contract_documents
         ↓
         ↓
         → has_many → contract_obligations
         ↓
         ↓
         → tracks → contract_performance_metrics
         ↓
         ↓
         → tracks_renewal → contract_renewal_tracking

CPQ Integration:
quotes (CPQ) → converts_to → contracts (Contract Management)
opportunities (CRM) → leads_to → contracts

customers (CRM) → has_many → contracts
contacts (CRM) → signs → contracts
```

### Key Relationships

1. **Template → Contract Flow**
   - A contract_template can generate multiple contracts
   - Templates contain clauses via contract_template_clauses junction
   - Templates are reusable blueprints with placeholders

2. **Clause Reusability**
   - contract_clauses are centralized in clause library
   - Used by multiple templates via contract_template_clauses
   - Used by multiple contracts via contract_clauses_junction
   - Clauses can be customized per contract

3. **Contract Lifecycle**
   - Contracts progress through statuses (Draft → Review → Approval → Active → Expired/Renewed)
   - Contracts have milestones, deliverables, payments, and obligations
   - Contracts can be amended via contract_amendments

4. **Approval Workflow**
   - Contracts and amendments require approvals via contract_approvals
   - Approvals follow multi-level chains via contract_approval_chain
   - Each approval level has SLA and routing rules

5. **CPQ Integration**
   - Quotes (from CPQ module) convert to contracts
   - Contract values, terms, and line items imported from quotes
   - Opportunities (from CRM) linked to contracts

6. **Performance & Execution**
   - Active contracts track milestones and deliverables
   - Payments tied to milestones or schedule
   - Performance metrics track SLA compliance
   - Obligations track commitments from both parties

7. **Renewal Automation**
   - contract_renewal_tracking monitors upcoming renewals
   - Auto-renewal or manual renewal workflows
   - Renewal creates new contract with updated terms

---

## API Endpoints

### Contract Templates API

```
GET    /api/contracts/templates              - List templates
POST   /api/contracts/templates              - Create template
GET    /api/contracts/templates/:id          - Get template details
PUT    /api/contracts/templates/:id          - Update template
DELETE /api/contracts/templates/:id          - Delete template
POST   /api/contracts/templates/:id/use      - Generate contract from template
GET    /api/contracts/templates/:id/clauses  - Get template clauses
POST   /api/contracts/templates/:id/clauses  - Add clause to template
DELETE /api/contracts/templates/:id/clauses/:clauseId - Remove clause from template
PUT    /api/contracts/templates/:id/clauses/:clauseId - Update clause order/settings
POST   /api/contracts/templates/:id/copy     - Duplicate template
GET    /api/contracts/templates/:id/usage    - Get usage analytics
PATCH  /api/contracts/templates/:id/favorite - Toggle favorite status
```

**Query Parameters** (for GET /api/contracts/templates):
- `page` - Page number
- `limit` - Records per page
- `category` - Filter by category (Sales, Service, Legal, etc.)
- `type` - Filter by contract type
- `status` - Filter by status (draft, active, archived)
- `is_favorite` - Filter favorites
- `search` - Search in name, description
- `sort` - Sort field (usage_count, avg_contract_value, created_date)
- `order` - Sort order (asc, desc)

### Contract Clauses API

```
GET    /api/contracts/clauses                - List clauses
POST   /api/contracts/clauses                - Create clause
GET    /api/contracts/clauses/:id            - Get clause details
PUT    /api/contracts/clauses/:id            - Update clause (creates new version)
DELETE /api/contracts/clauses/:id            - Delete clause
GET    /api/contracts/clauses/:id/versions   - Get clause version history
POST   /api/contracts/clauses/:id/approve    - Approve clause
POST   /api/contracts/clauses/:id/deprecate  - Deprecate clause
GET    /api/contracts/clauses/:id/usage      - Get clause usage analytics
GET    /api/contracts/clauses/:id/dependencies - Get clause dependencies
POST   /api/contracts/clauses/:id/dependencies - Set clause dependencies
GET    /api/contracts/clauses/categories     - Get clause categories
POST   /api/contracts/clauses/bulk-import    - Bulk import clauses
```

**Query Parameters**:
- `category` - Filter by category
- `risk_level` - Filter by risk level
- `status` - Filter by status
- `compliance_tag` - Filter by compliance tag
- `search` - Full-text search
- `is_current_version` - Show only current versions

### Contracts API

```
GET    /api/contracts                        - List contracts
POST   /api/contracts                        - Create contract
GET    /api/contracts/:id                    - Get contract details
PUT    /api/contracts/:id                    - Update contract
DELETE /api/contracts/:id                    - Delete contract
POST   /api/contracts/:id/submit-for-approval - Submit for approval
POST   /api/contracts/:id/approve            - Approve contract
POST   /api/contracts/:id/reject             - Reject contract
POST   /api/contracts/:id/activate           - Activate contract
POST   /api/contracts/:id/sign               - Sign contract (customer or company)
POST   /api/contracts/:id/terminate          - Terminate contract
GET    /api/contracts/:id/pdf                - Generate contract PDF
POST   /api/contracts/:id/send               - Send contract to customer
GET    /api/contracts/:id/clauses            - Get contract clauses
POST   /api/contracts/:id/clauses            - Add clause to contract
PUT    /api/contracts/:id/clauses/:clauseId  - Update/customize clause
DELETE /api/contracts/:id/clauses/:clauseId  - Remove clause
GET    /api/contracts/:id/timeline           - Get contract lifecycle timeline
GET    /api/contracts/:id/performance        - Get performance metrics
POST   /api/contracts/generate-from-quote/:quoteId - Generate contract from quote
```

**Query Parameters**:
- `status` - Filter by status
- `customer_id` - Filter by customer
- `contract_type` - Filter by type
- `owner_id` - Filter by owner
- `start_date_from` - Filter by start date range
- `start_date_to`
- `end_date_from` - Filter by end date range
- `end_date_to`
- `renewal_upcoming` - Show contracts with upcoming renewals
- `is_expired` - Show expired contracts
- `search` - Search in title, contract number

### Contract Milestones API

```
GET    /api/contracts/:contractId/milestones     - List milestones
POST   /api/contracts/:contractId/milestones     - Create milestone
GET    /api/contracts/:contractId/milestones/:id - Get milestone details
PUT    /api/contracts/:contractId/milestones/:id - Update milestone
DELETE /api/contracts/:contractId/milestones/:id - Delete milestone
PATCH  /api/contracts/:contractId/milestones/:id/status - Update milestone status
POST   /api/contracts/:contractId/milestones/:id/accept - Accept milestone
POST   /api/contracts/:contractId/milestones/:id/complete - Mark complete
GET    /api/contracts/:contractId/milestones/gantt - Get Gantt chart data
```

### Contract Deliverables API

```
GET    /api/contracts/:contractId/deliverables     - List deliverables
POST   /api/contracts/:contractId/deliverables     - Create deliverable
GET    /api/contracts/:contractId/deliverables/:id - Get deliverable details
PUT    /api/contracts/:contractId/deliverables/:id - Update deliverable
DELETE /api/contracts/:contractId/deliverables/:id - Delete deliverable
POST   /api/contracts/:contractId/deliverables/:id/submit - Submit deliverable
POST   /api/contracts/:contractId/deliverables/:id/accept - Accept deliverable
POST   /api/contracts/:contractId/deliverables/:id/reject - Reject deliverable
POST   /api/contracts/:contractId/deliverables/:id/revise - Request revision
```

### Contract Payments API

```
GET    /api/contracts/:contractId/payments     - List payments
POST   /api/contracts/:contractId/payments     - Create payment schedule
GET    /api/contracts/:contractId/payments/:id - Get payment details
PUT    /api/contracts/:contractId/payments/:id - Update payment
DELETE /api/contracts/:contractId/payments/:id - Delete payment
POST   /api/contracts/:contractId/payments/:id/record-payment - Record payment received
POST   /api/contracts/:contractId/payments/:id/generate-invoice - Generate invoice
GET    /api/contracts/:contractId/payments/schedule - Get payment schedule
GET    /api/contracts/:contractId/payments/overdue - Get overdue payments
```

### Contract Amendments API

```
GET    /api/contracts/:contractId/amendments     - List amendments
POST   /api/contracts/:contractId/amendments     - Create amendment
GET    /api/contracts/:contractId/amendments/:id - Get amendment details
PUT    /api/contracts/:contractId/amendments/:id - Update amendment
DELETE /api/contracts/:contractId/amendments/:id - Delete amendment
POST   /api/contracts/:contractId/amendments/:id/submit - Submit for approval
POST   /api/contracts/:contractId/amendments/:id/approve - Approve amendment
POST   /api/contracts/:contractId/amendments/:id/reject - Reject amendment
POST   /api/contracts/:contractId/amendments/:id/activate - Activate amendment
POST   /api/contracts/:contractId/amendments/:id/sign - Sign amendment
```

### Contract Approvals API

```
GET    /api/contracts/approvals                - List pending approvals
POST   /api/contracts/approvals                - Create approval request
GET    /api/contracts/approvals/:id            - Get approval details
PUT    /api/contracts/approvals/:id            - Update approval
POST   /api/contracts/approvals/:id/approve    - Approve request
POST   /api/contracts/approvals/:id/reject     - Reject request
POST   /api/contracts/approvals/:id/approve-with-conditions - Conditional approval
POST   /api/contracts/approvals/:id/escalate   - Escalate approval
POST   /api/contracts/approvals/:id/delegate   - Delegate to another approver
GET    /api/contracts/approvals/:id/chain      - Get approval chain
GET    /api/contracts/approvals/:id/history    - Get approval history
GET    /api/contracts/approvals/my-approvals   - Get approvals assigned to me
POST   /api/contracts/approvals/bulk-approve   - Bulk approve multiple
```

**Query Parameters**:
- `status` - Filter by approval status
- `priority` - Filter by priority
- `entity_type` - contract, amendment, renewal
- `current_approver` - Filter by current approver
- `is_overdue` - Show overdue approvals
- `min_value` - Filter by min contract value
- `max_value` - Filter by max contract value

### Contract Documents API

```
GET    /api/contracts/:contractId/documents     - List documents
POST   /api/contracts/:contractId/documents     - Upload document
GET    /api/contracts/:contractId/documents/:id - Get document details
PUT    /api/contracts/:contractId/documents/:id - Update document metadata
DELETE /api/contracts/:contractId/documents/:id - Delete document
GET    /api/contracts/:contractId/documents/:id/download - Download document
POST   /api/contracts/:contractId/documents/:id/new-version - Upload new version
GET    /api/contracts/:contractId/documents/:id/versions - Get document versions
```

### Contract Obligations API

```
GET    /api/contracts/:contractId/obligations     - List obligations
POST   /api/contracts/:contractId/obligations     - Create obligation
GET    /api/contracts/:contractId/obligations/:id - Get obligation details
PUT    /api/contracts/:contractId/obligations/:id - Update obligation
DELETE /api/contracts/:contractId/obligations/:id - Delete obligation
PATCH  /api/contracts/:contractId/obligations/:id/complete - Mark complete
POST   /api/contracts/:contractId/obligations/:id/check-compliance - Check compliance
GET    /api/contracts/:contractId/obligations/upcoming - Get upcoming obligations
GET    /api/contracts/:contractId/obligations/overdue - Get overdue obligations
```

### Contract Renewals API

```
GET    /api/contracts/renewals                 - List upcoming renewals
POST   /api/contracts/renewals                 - Create renewal tracking
GET    /api/contracts/renewals/:id             - Get renewal details
PUT    /api/contracts/renewals/:id             - Update renewal
POST   /api/contracts/renewals/:id/approve     - Approve renewal
POST   /api/contracts/renewals/:id/reject      - Reject renewal
POST   /api/contracts/renewals/:id/renew       - Execute renewal (create new contract)
POST   /api/contracts/renewals/:id/send-notice - Send renewal notice
GET    /api/contracts/renewals/dashboard       - Get renewals dashboard
```

### Contract Performance API

```
GET    /api/contracts/:contractId/performance/metrics - List performance metrics
POST   /api/contracts/:contractId/performance/metrics - Create metric
GET    /api/contracts/:contractId/performance/metrics/:id - Get metric details
PUT    /api/contracts/:contractId/performance/metrics/:id - Update metric
POST   /api/contracts/:contractId/performance/metrics/:id/measure - Record measurement
GET    /api/contracts/:contractId/performance/summary - Get performance summary
GET    /api/contracts/:contractId/performance/compliance - Get compliance status
```

### Common Master Data APIs

```
GET    /api/contracts/masters/types             - Get contract types
GET    /api/contracts/masters/categories        - Get contract categories
GET    /api/contracts/masters/statuses          - Get contract statuses
GET    /api/contracts/masters/clause-categories - Get clause categories
GET    /api/contracts/masters/risk-levels       - Get risk levels
GET    /api/contracts/masters/compliance-tags   - Get compliance tags
GET    /api/contracts/masters/approval-levels   - Get approval levels
GET    /api/contracts/masters/payment-types     - Get payment types
GET    /api/contracts/masters/payment-statuses  - Get payment statuses
GET    /api/contracts/masters/payment-terms     - Get payment terms
GET    /api/contracts/masters/amendment-types   - Get amendment types
GET    /api/contracts/masters/termination-reasons - Get termination reasons
GET    /api/contracts/masters/renewal-types     - Get renewal types
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
        "field": "contract_value",
        "message": "Contract value is required"
      }
    ]
  }
}
```

---

## Data Flow & Business Logic

### Contract Generation from Template Flow

```
1. Select Template
   ├─ User selects contract template from library
   ├─ System loads template with all clauses
   └─ Display template preview

2. Fill Contract Details
   ├─ Auto-populate from quote (if quote-to-contract conversion)
   │   ├─ Customer details
   │   ├─ Contact details
   │   ├─ Contract value
   │   ├─ Line items
   │   └─ Payment terms
   ├─ Manual entry for new contracts
   │   ├─ Contract title and description
   │   ├─ Contract type and category
   │   ├─ Customer and contact selection
   │   ├─ Financial details (value, currency, payment terms)
   │   ├─ Contract term (start date, end date, duration)
   │   └─ Renewal settings
   └─ Validate required fields

3. Select and Customize Clauses
   ├─ Display template's default clauses
   ├─ Allow adding additional clauses from library
   ├─ Allow removing optional clauses
   ├─ Allow customizing clause text (creates customization record)
   ├─ AI recommends additional clauses based on:
   │   ├─ Contract type and value
   │   ├─ Customer industry and location
   │   ├─ Historical similar contracts
   │   └─ Risk assessment
   └─ Validate clause dependencies

4. Review and Preview
   ├─ Generate live preview with actual data
   ├─ Replace all placeholders with contract details
   ├─ Display complete contract document
   ├─ Show warnings for missing required clauses
   └─ Calculate contract metrics

5. Save as Draft or Submit
   ├─ Save as draft (can edit later)
   ├─ OR submit for approval
   │   ├─ Determine approval chain based on:
   │   │   ├─ Contract value ($0-10K auto-approve, $10K-100K manager, $100K+ executive)
   │   │   ├─ Contract type (NDA auto, sales standard, partnership special)
   │   │   ├─ Risk level (high risk requires legal + executive)
   │   │   └─ Customized clauses (requires legal review)
   │   ├─ Create approval request
   │   ├─ Route to first approver
   │   └─ Send notifications

6. Post-Approval
   ├─ Generate final PDF document
   ├─ Initiate e-signature workflow
   ├─ Send to customer for signature
   └─ Track signature status
```

### Multi-Level Approval Workflow

```
1. Approval Request Creation
   ├─ Contract submitted for approval
   ├─ System determines approval chain:
   │   ├─ Check contract value
   │   ├─ Check contract type
   │   ├─ Check risk level
   │   ├─ Check for customized/high-risk clauses
   │   └─ Apply approval routing rules
   ├─ Create approval record
   ├─ Build approval chain with levels:
   │   Level 1: Legal Review (if high-risk clauses or customizations)
   │   Level 2: Finance Review (if value > $50K)
   │   Level 3: Business Approver (contract owner's manager)
   │   Level 4: Executive Approval (if value > $500K)
   │   Level 5: Board Approval (if value > $5M)
   └─ Set SLA for each level

2. Level 1: Legal Review
   ├─ Notify legal team
   ├─ Legal reviewer checks:
   │   ├─ Clause compliance
   │   ├─ Legal risks
   │   ├─ Jurisdiction issues
   │   └─ Regulatory requirements
   ├─ Legal can:
   │   ├─ Approve → Move to next level
   │   ├─ Approve with conditions → Add conditions, move to next level
   │   ├─ Reject → Send back to creator with comments
   │   └─ Request changes → Pause approval, request modifications
   └─ Log decision in approval chain

3. Level 2: Finance Review
   ├─ Notify finance team
   ├─ Finance reviewer checks:
   │   ├─ Contract value and pricing
   │   ├─ Payment terms
   │   ├─ Revenue recognition
   │   └─ Budget availability
   ├─ Finance can approve/reject/request changes
   └─ Move to next level if approved

4. Level 3: Business Approval
   ├─ Notify business approver (manager)
   ├─ Business approver checks:
   │   ├─ Strategic fit
   │   ├─ Resource availability
   │   ├─ Customer relationship
   │   └─ Overall business value
   ├─ Approve/reject/escalate
   └─ Move to next level if required

5. Level 4: Executive Approval (High-Value Contracts)
   ├─ Notify executive
   ├─ Executive reviews summary and recommendations
   ├─ Final approval decision
   └─ If approved, contract moves to active state

6. Approval Completion
   ├─ All levels approved
   ├─ Contract status → Approved
   ├─ Generate final contract document
   ├─ Initiate signature workflow
   └─ Notify contract creator

7. Approval Rejection Handling
   ├─ If any level rejects:
   │   ├─ Contract status → Rejected
   │   ├─ Log rejection reason
   │   ├─ Notify contract creator
   │   ├─ Creator can revise and resubmit
   │   └─ New approval cycle starts
   └─ Track rejection history

8. Approval Escalation
   ├─ Auto-escalate if:
   │   ├─ Approver hasn't responded within SLA
   │   ├─ Approver manually escalates
   │   └─ High priority urgent contracts
   ├─ Escalate to approver's manager
   └─ Log escalation in approval chain

9. Approval Delegation
   ├─ Approver can delegate to another user
   ├─ Delegate receives notification
   ├─ Delegation logged in approval chain
   └─ Original approver notified of delegate's decision
```

### Contract Amendment Process

```
1. Amendment Request Initiation
   ├─ User initiates amendment from active contract
   ├─ Select amendment type:
   │   ├─ Value Change (increase/decrease contract value)
   │   ├─ Scope Change (add/remove deliverables)
   │   ├─ Term Extension/Reduction (change end date)
   │   ├─ Pricing Change (modify payment terms)
   │   ├─ Clause Addition (add new clauses)
   │   ├─ Clause Removal (remove clauses)
   │   └─ Clause Modification (change clause text)
   └─ Provide reason and justification

2. Amendment Details
   ├─ Document changes:
   │   ├─ Original value → New value
   │   ├─ Original end date → New end date
   │   ├─ Clauses impacted (list IDs)
   │   ├─ New clauses to add
   │   └─ Clauses to remove
   ├─ Calculate impact:
   │   ├─ Value change percentage
   │   ├─ Term extension months
   │   └─ Financial impact
   ├─ Set effective date
   └─ Upload supporting documents

3. Amendment Approval
   ├─ Determine if approval required:
   │   ├─ Value increase > 20% → Requires approval
   │   ├─ Term extension > 6 months → Requires approval
   │   ├─ Scope changes → Requires approval
   │   └─ Minor updates → Auto-approve
   ├─ If approval required:
   │   ├─ Create amendment approval request
   │   ├─ Route through approval chain (similar to contract approval)
   │   ├─ Legal review for clause changes
   │   ├─ Finance review for value/payment changes
   │   └─ Business approval
   └─ If auto-approved, skip to execution

4. Amendment Execution
   ├─ Generate amendment document
   ├─ E-signature workflow:
   │   ├─ Company signs first
   │   ├─ Send to customer for signature
   │   └─ Both parties sign
   ├─ Update main contract record:
   │   ├─ Increment amendment_count
   │   ├─ Set has_amendments = TRUE
   │   ├─ Update contract_value (if changed)
   │   ├─ Update end_date (if changed)
   │   ├─ Add/remove/modify clauses
   │   └─ Update performance metrics (if applicable)
   ├─ Store amendment document
   └─ Link amendment to contract

5. Amendment Tracking
   ├─ Amendment becomes active on effective_date
   ├─ Audit trail maintained
   ├─ Stakeholders notified
   └─ Contract history updated
```

### Contract Renewal Automation

```
1. Renewal Detection
   ├─ System runs daily renewal scan:
   │   ├─ Find contracts with end_date approaching
   │   ├─ Calculate renewal_notice_date (end_date - renewal_notice_days)
   │   ├─ Filter contracts with renewal_notice_date = today or past
   │   └─ Exclude already processed renewals
   └─ Create renewal tracking record for each

2. Renewal Notification
   ├─ Send renewal notice email to:
   │   ├─ Contract owner
   │   ├─ Contract manager
   │   ├─ Customer primary contact
   │   └─ Finance team
   ├─ Email includes:
   │   ├─ Contract details (number, customer, value, dates)
   │   ├─ Renewal decision deadline
   │   ├─ Current terms summary
   │   ├─ Link to renewal form
   │   └─ Historical performance metrics
   └─ Log notification sent

3. Renewal Decision Process
   ├─ Contract owner reviews:
   │   ├─ Contract performance
   │   ├─ Customer satisfaction
   │   ├─ Profitability
   │   ├─ Strategic value
   │   └─ Market conditions
   ├─ Decision options:
   │   ├─ Renew (same terms) → Auto-renewal flow
   │   ├─ Renew (new terms) → Renegotiation flow
   │   ├─ Extend (short-term) → Extension flow
   │   └─ Terminate (non-renewal) → Termination flow
   └─ Enter decision in renewal tracking

4. Auto-Renewal Flow
   ├─ If contract has auto_renew = TRUE and no objections:
   │   ├─ Calculate new_start_date (current end_date + 1 day)
   │   ├─ Calculate new_end_date (based on renewal term)
   │   ├─ Apply price escalation (if configured)
   │   │   ├─ CPI-based adjustment
   │   │   ├─ Fixed percentage increase
   │   │   └─ Custom pricing
   │   ├─ Create new contract record:
   │   │   ├─ Copy all clauses from current contract
   │   │   ├─ Update dates and value
   │   │   ├─ Link to original contract (renewal chain)
   │   │   ├─ Status = Active (or Pending if approval required)
   │   │   └─ Contract_number with "-R1", "-R2" suffix
   │   ├─ Close original contract (status = Renewed)
   │   └─ Notify stakeholders

5. Renegotiation Flow
   ├─ Create new quote from existing contract
   ├─ Modify terms:
   │   ├─ Update pricing
   │   ├─ Adjust scope/deliverables
   │   ├─ Change payment terms
   │   └─ Update SLAs
   ├─ Send revised quote to customer
   ├─ Negotiate and finalize
   ├─ Once agreed, convert quote to contract
   ├─ Follow normal contract approval flow
   └─ Link new contract to original (renewal relationship)

6. Non-Renewal (Termination)
   ├─ Select termination reason
   ├─ Set termination_date (= end_date)
   ├─ Document reason and next steps
   ├─ Create transition plan:
   │   ├─ Knowledge transfer
   │   ├─ Data handover
   │   ├─ Final deliverables
   │   └─ Final payment settlement
   ├─ Update contract status = Terminated
   └─ Archive contract

7. Renewal Reminders
   ├─ Send periodic reminders if no decision:
   │   ├─ 90 days before expiry
   │   ├─ 60 days before expiry
   │   ├─ 30 days before expiry
   │   ├─ 15 days before expiry
   │   └─ 7 days before expiry
   ├─ Escalate if critical deadline approaching
   └─ Auto-terminate if no renewal by end_date
```

### Contract Performance & SLA Tracking

```
1. Performance Metric Definition
   ├─ Define KPIs for contract:
   │   ├─ Delivery timeliness (% on-time deliverables)
   │   ├─ Quality score (% accepted on first submission)
   │   ├─ Response time (average hours to respond)
   │   ├─ Uptime/Availability (% uptime for services)
   │   ├─ Customer satisfaction (CSAT score)
   │   └─ Custom metrics per contract type
   ├─ Set target values
   ├─ Define measurement period (daily, weekly, monthly)
   └─ Set warning and critical thresholds

2. Data Collection
   ├─ Automated data collection:
   │   ├─ Milestone completion dates
   │   ├─ Deliverable acceptance rates
   │   ├─ Payment receipt dates
   │   ├─ Obligation completion dates
   │   └─ System uptime logs
   ├─ Manual data entry:
   │   ├─ Quality assessments
   │   ├─ Customer feedback
   │   └─ Incident reports
   └─ Periodic measurement (daily/weekly/monthly)

3. Performance Calculation
   ├─ Calculate actual_value for each metric
   ├─ Compare actual vs target
   ├─ Calculate performance_percentage = (actual / target) * 100
   ├─ Calculate variance = actual - target
   ├─ Determine status:
   │   ├─ Exceeded: actual > target
   │   ├─ On Track: actual >= (target * 0.95)
   │   ├─ At Risk: actual >= (target * 0.80)
   │   └─ Behind: actual < (target * 0.80)
   └─ Update contract performance_score (weighted average of all metrics)

4. SLA Compliance Monitoring
   ├─ Track SLA metrics:
   │   ├─ Response time SLA (e.g., respond within 4 hours)
   │   ├─ Resolution time SLA (e.g., resolve within 24 hours)
   │   ├─ Delivery time SLA (e.g., deliver within 30 days)
   │   └─ Availability SLA (e.g., 99.9% uptime)
   ├─ Monitor in real-time
   ├─ Flag SLA violations
   └─ Calculate compliance_score = (met SLAs / total SLAs) * 100

5. Alert & Notification
   ├─ Trigger alerts when:
   │   ├─ Metric drops below warning threshold
   │   ├─ Metric drops below critical threshold
   │   ├─ SLA violation occurs
   │   ├─ Multiple consecutive periods below target
   │   └─ Negative trend detected
   ├─ Notify:
   │   ├─ Contract manager
   │   ├─ Contract owner
   │   ├─ Team lead
   │   └─ Customer (if contractually required)
   └─ Escalate if not addressed

6. Penalty & Incentive Calculation
   ├─ If performance below critical threshold:
   │   ├─ Calculate penalty amount (if defined in contract)
   │   ├─ Generate penalty invoice
   │   ├─ Adjust payment schedule
   │   └─ Document in contract performance record
   ├─ If performance exceeds targets:
   │   ├─ Calculate incentive amount
   │   ├─ Approve incentive payment
   │   ├─ Process incentive
   │   └─ Document achievement
   └─ Update financial records

7. Performance Reporting
   ├─ Generate performance dashboards:
   │   ├─ Real-time KPI metrics
   │   ├─ Trend charts (historical performance)
   │   ├─ SLA compliance summary
   │   ├─ At-risk contracts list
   │   └─ Top/bottom performers
   ├─ Periodic performance reports:
   │   ├─ Monthly performance summary
   │   ├─ Quarterly business review (QBR) data
   │   ├─ Annual performance report
   │   └─ Customer-facing reports
   └─ Export capabilities (PDF, Excel)
```

---

## Integration with CPQ Module

### Quote-to-Contract Conversion

```
1. Prerequisites
   ├─ Quote must be in "Accepted" status
   ├─ Quote must be signed by customer (if e-signature enabled)
   ├─ Quote must not be expired
   └─ Quote must not already be converted to contract

2. Conversion Trigger
   ├─ Manual: User clicks "Convert to Contract" on quote
   ├─ OR Automatic: Quote status changes to "Accepted"
   └─ System validates prerequisites

3. Data Mapping (Quote → Contract)
   ├─ Basic Information:
   │   ├─ quote.name → contract.title
   │   ├─ quote.description → contract.description
   │   ├─ quote.quote_number → contract reference
   │   └─ quote.id → contract.quote_id (foreign key)
   │
   ├─ Financial Data:
   │   ├─ quote.total_amount → contract.contract_value
   │   ├─ quote.currency → contract.currency
   │   ├─ quote.payment_terms → contract.payment_terms_id
   │   └─ quote.billing_frequency (if available)
   │
   ├─ Relationships:
   │   ├─ quote.customer_id → contract.customer_id
   │   ├─ quote.contact_id → contract.contact_id
   │   ├─ quote.opportunity_id → contract.opportunity_id
   │   └─ quote.owner_id → contract.owner_id
   │
   ├─ Dates:
   │   ├─ quote.accepted_date → contract.start_date (or user specified)
   │   ├─ Calculate contract.end_date (start_date + duration)
   │   └─ Calculate contract.duration_months
   │
   └─ Line Items → Deliverables/Milestones:
       ├─ For each quote line item:
       │   ├─ Create contract deliverable
       │   ├─ deliverable.title = line_item.product_name
       │   ├─ deliverable.description = line_item.description
       │   └─ deliverable.due_date (calculated or user input)
       └─ Create payment schedule from line items

4. Contract Type & Template Selection
   ├─ Determine contract type based on quote type:
   │   ├─ Sales Quote → Sales Contract
   │   ├─ Service Quote → Service Agreement
   │   └─ Custom Quote → Custom Contract
   ├─ Suggest appropriate contract template
   ├─ User can override template selection
   └─ Load template clauses

5. Clause Importation
   ├─ Load clauses from selected template
   ├─ Apply AI clause recommendations:
   │   ├─ Analyze quote line items
   │   ├─ Consider customer industry
   │   ├─ Review historical contracts with this customer
   │   └─ Suggest additional clauses (warranties, SLA, etc.)
   ├─ User reviews and approves clauses
   └─ Clauses added to contract via contract_clauses_junction

6. Payment Schedule Generation
   ├─ From quote line items, create payment milestones:
   │   ├─ Advance payment (if quote.payment_terms includes advance %)
   │   ├─ Milestone payments (tied to deliverables)
   │   └─ Final payment (on completion/acceptance)
   ├─ Calculate due dates based on contract timeline
   ├─ Create records in contract_payments table
   └─ Link payments to milestones

7. Milestone & Deliverable Creation
   ├─ From quote line items:
   │   ├─ Group related items into milestones
   │   ├─ Create milestone records
   │   ├─ Create deliverable records for each line item
   │   └─ Link deliverables to milestones
   ├─ Set tentative dates (user can adjust)
   ├─ Define acceptance criteria (from product descriptions)
   └─ Set dependencies (sequential or parallel)

8. Contract Document Generation
   ├─ Populate template with contract data
   ├─ Replace all placeholders:
   │   ├─ Customer name, address
   │   ├─ Contract value, dates
   │   ├─ Payment terms
   │   ├─ Deliverables list
   │   └─ Custom fields
   ├─ Generate preview PDF
   ├─ Allow user to review and edit
   └─ Finalize contract document

9. Approval Routing
   ├─ Determine if approval required:
   │   ├─ Check contract value threshold
   │   ├─ Check if quote had special discounts
   │   ├─ Check if custom clauses added
   │   └─ Check contract risk level
   ├─ If approval required:
   │   ├─ Create approval request
   │   ├─ Route through approval chain
   │   └─ Notify approvers
   └─ If auto-approved, move to signature

10. Post-Conversion
    ├─ Update quote record:
    │   ├─ Set is_converted_to_contract = TRUE
    │   ├─ Set contract_id reference
    │   └─ Prevent further edits to quote
    ├─ Update opportunity (if linked):
    │   ├─ Move opportunity to "Closed Won"
    │   ├─ Set won_date
    │   └─ Link contract to opportunity
    ├─ Notify stakeholders:
    │   ├─ Sales rep (quote owner)
    │   ├─ Contract manager
    │   ├─ Finance team
    │   └─ Delivery/operations team
    └─ Create initial contract activities/tasks

11. Error Handling
    ├─ If conversion fails:
    │   ├─ Rollback all database changes
    │   ├─ Log error details
    │   ├─ Notify user with error message
    │   └─ Provide option to retry or manual create
    └─ Maintain data integrity
```

---

## Implementation Recommendations

### 1. Database Indexing Strategy
- Index all foreign keys for fast joins
- Index frequently filtered fields (status, dates, owner, customer)
- Create composite indexes:
  - `contracts (customer_id, status_id, start_date)`
  - `contract_approvals (current_approver_user_id, approval_status_id, priority_id)`
  - `contract_milestones (contract_id, due_date, status)`
  - `contract_payments (contract_id, due_date, status_id)`
- Use partial indexes for active records:
  - `CREATE INDEX idx_active_contracts ON contracts (id) WHERE deleted_at IS NULL AND status_id IN (active_status_ids)`

### 2. Data Archival & Retention
- Soft delete all records (deleted_at timestamp)
- Archive expired contracts (> 2 years past end_date) to separate archive tables
- Maintain audit trail for compliance (7-10 years retention)
- Implement data purge policies for GDPR compliance

### 3. Performance Optimization
- Cache master data (contract types, statuses, clauses) in Redis
- Use database views for complex queries:
  - `v_contracts_with_performance` (contract + performance metrics)
  - `v_pending_approvals_summary` (approval queue with details)
  - `v_upcoming_renewals` (renewals dashboard)
- Implement pagination on all list APIs (default 20, max 100)
- Use lazy loading for related data (milestones, deliverables loaded on demand)
- Background jobs for:
  - Renewal scanning (daily cron)
  - SLA monitoring (hourly cron)
  - Performance metric calculation (nightly batch)
  - Email notifications (queue-based)

### 4. Security & Access Control
- Row-level security:
  - Users can only see contracts they own or are assigned to
  - Managers can see team contracts
  - Finance can see all contracts for reporting
  - Legal can see all contracts for compliance
- Encrypt sensitive fields:
  - Contract terms and pricing (at rest)
  - E-signature data
  - Customer financial information
- API authentication:
  - JWT-based authentication
  - Role-based access control (RBAC)
  - Rate limiting (100 requests/minute per user)
- Audit logging:
  - Log all contract modifications
  - Log all approval decisions
  - Log all document access
  - Maintain immutable audit trail

### 5. Document Management
- Store contract documents in secure object storage (S3, Azure Blob)
- Implement version control for all documents
- Calculate and store file checksums (SHA-256) for integrity verification
- Support document templates with placeholder replacement
- Implement document locking during signature process
- Provide document retention policies

### 6. E-Signature Integration
- Integrate with e-signature providers (DocuSign, Adobe Sign, HelloSign)
- Support multi-party signing workflow:
  - Company signs first (internal signature)
  - Customer signs second (external signature)
  - Track signature status in real-time
- Store signed document with embedded signatures
- Provide signature audit trail
- Support signature delegation

### 7. Notification & Alerting
- Implement notification engine:
  - Email notifications (SendGrid, AWS SES)
  - SMS notifications for urgent items (Twilio)
  - In-app notifications
  - Webhook notifications to external systems
- Configurable notification preferences per user
- Alert triggers:
  - Pending approvals (immediate + reminders)
  - Upcoming renewals (90, 60, 30, 15, 7 days before)
  - Overdue milestones/deliverables
  - SLA violations
  - Contract expirations
  - Payment overdue

### 8. Business Rule Engine
- Externalize business rules in database:
  - Approval routing rules (stored in config table)
  - Auto-approval thresholds (configurable)
  - Clause recommendation rules (ML-based or rule-based)
  - Renewal policies
  - SLA thresholds
- Provide admin UI for rule management
- Version control for rules
- A/B testing capability for rule changes

### 9. Reporting & Analytics
- Pre-built dashboards:
  - Contract portfolio overview (total value, count by type/status)
  - Approval queue summary (pending count, avg approval time)
  - Renewal pipeline (upcoming renewals by month)
  - Performance dashboard (SLA compliance, at-risk contracts)
  - Financial dashboard (payments due, revenue recognition)
- Custom report builder
- Scheduled report delivery (email PDF/Excel)
- Export capabilities (PDF, Excel, CSV)
- Integration with BI tools (Power BI, Tableau)

### 10. Integration Architecture
- RESTful APIs with versioning (/api/v1/)
- Webhook support for real-time events:
  - contract.created
  - contract.approved
  - contract.signed
  - contract.activated
  - contract.expired
  - contract.renewed
  - approval.requested
  - approval.completed
  - milestone.completed
  - payment.received
- Support for batch operations (bulk imports, bulk approvals)
- Message queue for async processing (RabbitMQ, AWS SQS)
- Event sourcing for audit trail

---

## Conclusion

This Contract Management module provides a complete, enterprise-grade solution for managing the entire contract lifecycle with:
- ✅ Normalized database schema (3NF)
- ✅ Comprehensive master data tables
- ✅ RESTful API design
- ✅ Proper entity relationships
- ✅ Business logic workflows
- ✅ Scalable architecture
- ✅ Integration with CPQ module
- ✅ Multi-level approval workflows
- ✅ E-signature integration
- ✅ Performance & SLA tracking
- ✅ Renewal automation
- ✅ Amendment management
- ✅ Document version control
- ✅ Compliance & audit trail

The schema is designed to support:
- **Users**: 500+ concurrent users
- **Records**: Millions of contracts and related records
- **Performance**: Sub-second API response times
- **Scalability**: Horizontal scaling with read replicas
- **Compliance**: SOC 2, GDPR, ISO 27001 ready
- **Deployment**: PostgreSQL (primary), MySQL, SQL Server (with minimal modifications)

This module seamlessly integrates with:
- **CPQ Module**: Quote-to-contract conversion
- **CRM Module**: Customer, contact, and opportunity linkage
- **Finance Module**: Invoicing, payment tracking, revenue recognition
- **Project Management**: Milestone and deliverable tracking
