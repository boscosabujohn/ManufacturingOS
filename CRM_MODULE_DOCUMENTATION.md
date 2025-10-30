# CRM Module - Complete Documentation

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

The CRM (Customer Relationship Management) module is a comprehensive system for managing customer interactions, sales processes, marketing campaigns, and customer support. It consists of 12 major feature areas with 100+ pages.

### Key Capabilities
- **Lead Management**: Capture, qualify, score, and convert leads
- **Opportunity Management**: Track sales pipeline and forecast revenue
- **Contact & Customer Management**: Maintain customer relationships and hierarchies
- **Quote & Proposal Management**: Generate quotes and proposals with pricing rules
- **Contract Management**: Manage contracts, amendments, and renewals
- **Activity Tracking**: Log calls, meetings, emails, and tasks
- **Campaign Management**: Execute marketing campaigns with automation
- **Analytics & Reporting**: Track performance and generate insights
- **Support Management**: Handle tickets, SLAs, and knowledge base
- **Advanced Features**: AI scoring, workflow automation, collaboration tools

---

## Feature Modules

### 1. LEADS Module
**Purpose**: Manage potential customers from initial contact to qualification

**Pages**:
- `/crm/leads` - Lead listing with filters and search
- `/crm/leads/add` - Create new lead
- `/crm/leads/edit/[id]` - Edit existing lead
- `/crm/leads/view/[id]` - View lead details (tabs: overview, activities, notes, documents)
- `/crm/leads/scoring` - AI-powered lead scoring dashboard
- `/crm/leads/sources` - Manage lead sources
- `/crm/leads/assignment` - Lead assignment rules

**Key Features**:
- Lead capture from multiple sources (web forms, imports, manual)
- Lead scoring based on demographic and behavioral data
- Lead qualification criteria (BANT framework)
- Lead assignment to sales reps based on rules
- Lead conversion to opportunities

**Entities**:
- `leads` - Main lead records
- `lead_sources` - Lead origin tracking
- `lead_scores` - AI-powered scoring history
- `lead_assignments` - Assignment audit trail
- `lead_activities` - Activity logs for leads

---

### 2. OPPORTUNITIES Module
**Purpose**: Track sales pipeline and manage deals

**Pages**:
- `/crm/opportunities` - Opportunity listing with pipeline view
- `/crm/opportunities/add` - Create opportunity
- `/crm/opportunities/edit/[id]` - Edit opportunity
- `/crm/opportunities/view/[id]` - View opportunity details (tabs: overview, products, quotes, activities, competitors)
- `/crm/opportunities/pipeline` - Visual pipeline management (Kanban)
- `/crm/opportunities/forecast` - Revenue forecasting
- `/crm/opportunities/won` - Closed-won opportunities
- `/crm/opportunities/lost` - Closed-lost opportunities with loss reasons

**Key Features**:
- Multi-stage pipeline (qualification, needs analysis, proposal, negotiation, closed)
- Weighted pipeline forecasting
- Win/loss analysis
- Product/service association
- Competitive tracking
- Probability-based revenue projections

**Entities**:
- `opportunities` - Main opportunity records
- `opportunity_stages` - Pipeline stages (master)
- `opportunity_products` - Products/services in opportunity
- `opportunity_competitors` - Competitor tracking
- `opportunity_stage_history` - Stage movement audit
- `win_loss_reasons` - Reasons for won/lost deals (master)

---

### 3. CONTACTS Module
**Purpose**: Manage individual contacts within customer organizations

**Pages**:
- `/crm/contacts` - Contact listing
- `/crm/contacts/add` - Create contact
- `/crm/contacts/edit/[id]` - Edit contact
- `/crm/contacts/view/[id]` - View contact details (tabs: overview, interactions, opportunities, notes)
- `/crm/contacts/lists` - Contact segmentation lists
- `/crm/contacts/roles` - Contact roles and job functions (master)

**Key Features**:
- Multi-level contact hierarchy (decision maker, influencer, user, etc.)
- Contact role classification
- Social media integration
- Contact lists for targeted campaigns
- Communication preferences tracking

**Entities**:
- `contacts` - Main contact records
- `contact_roles` - Job roles (master)
- `contact_preferences` - Communication preferences
- `contact_lists` - Segmentation lists
- `contact_list_members` - List membership association
- `contact_social_profiles` - Social media links

---

### 4. CUSTOMERS Module
**Purpose**: Manage customer accounts and relationships

**Pages**:
- `/crm/customers` - Customer listing
- `/crm/customers/add` - Create customer
- `/crm/customers/edit/[id]` - Edit customer
- `/crm/customers/view/[id]` - View customer 360° (tabs: overview, contacts, opportunities, contracts, support, activities, financials)
- `/crm/customers/segments/[id]` - View segment details
- `/crm/customers/segments` - Customer segmentation
- `/crm/customers/segments/edit/[id]` - Edit segment
- `/crm/customers/hierarchy` - Account hierarchy visualization
- `/crm/customers/portal` - Customer self-service portal

**Key Features**:
- Account hierarchy (parent-subsidiary-branch)
- Customer segmentation (RFM analysis, industry, size, etc.)
- Customer 360° view (all interactions, financials, support)
- Customer health scoring
- Customer portal for self-service

**Entities**:
- `customers` - Main customer/account records
- `customer_hierarchy` - Parent-child relationships
- `customer_segments` - Segment definitions
- `customer_segment_members` - Segment membership
- `customer_health_scores` - Health scoring history
- `customer_types` - Customer classification (master)
- `industries` - Industry classifications (master)

---

### 5. INTERACTIONS Module
**Purpose**: Track all customer touchpoints and communications

**Pages**:
- `/crm/interactions` - Interaction history
- `/crm/interactions/add` - Log new interaction
- `/crm/interactions/edit/[id]` - Edit interaction
- `/crm/interactions/view/[id]` - View interaction details (tabs: overview, participants, notes, follow-ups)
- `/crm/interactions/timeline` - Timeline view of all interactions
- `/crm/interactions/analysis` - Interaction analytics

**Key Features**:
- Multi-channel interaction tracking (email, call, meeting, chat, social)
- Interaction sentiment analysis
- Follow-up task generation
- Email integration (sync from email client)
- Call recording integration

**Entities**:
- `interactions` - Main interaction records
- `interaction_types` - Interaction channels (master)
- `interaction_participants` - Who was involved
- `interaction_outcomes` - Results of interaction
- `interaction_sentiments` - Sentiment scores

---

### 6. ACTIVITIES Module
**Purpose**: Manage tasks, calls, meetings, and emails

**Pages**:
- `/crm/activities` - Activity dashboard
- `/crm/activities/tasks` - Task management
- `/crm/activities/calls` - Call log
- `/crm/activities/meetings` - Meeting scheduler
- `/crm/activities/emails` - Email tracking
- `/crm/activities/calendar` - Calendar view

**Key Features**:
- Task assignment and tracking
- Meeting scheduling with calendar sync
- Call logging with duration and outcomes
- Email tracking (opens, clicks)
- Activity reminders and notifications

**Entities**:
- `activities` - Main activity records
- `activity_types` - Activity categories (master)
- `activity_participants` - Meeting/call participants
- `activity_reminders` - Scheduled reminders
- `activity_recurrence` - Recurring activity patterns

---

### 7. QUOTES & PROPOSALS Module
**Purpose**: Generate and manage sales quotes and proposals

**Pages**:
- `/crm/quotes` - Quote listing
- `/crm/quotes/create` - Create quote with line items
- `/crm/quotes/edit/[id]` - Edit quote
- `/crm/quotes/view/[id]` - View quote with PDF generation
- `/crm/quotes/templates` - Quote templates
- `/crm/quotes/pricing` - Pricing rules engine
- `/crm/quotes/pricing/create` - Create pricing rule
- `/crm/quotes/pricing/edit/[id]` - Edit pricing rule
- `/crm/proposals` - Proposal listing
- `/crm/proposals/create` - Create proposal
- `/crm/proposals/edit/[id]` - Edit proposal
- `/crm/proposals/view/[id]` - View proposal with PDF

**Key Features**:
- Line-item quote generation
- Template-based quoting
- Dynamic pricing rules (volume discounts, time-based, customer-specific)
- Quote versioning
- E-signature integration
- Proposal builder with sections
- Quote-to-order conversion

**Entities**:
- `quotes` - Main quote records
- `quote_line_items` - Products/services in quote
- `quote_versions` - Quote revision history
- `quote_templates` - Reusable quote templates
- `pricing_rules` - Automated pricing logic
- `proposals` - Proposal documents
- `proposal_sections` - Proposal content sections
- `proposal_approvals` - Approval workflow

---

### 8. CONTRACTS Module
**Purpose**: Manage contracts, amendments, and renewals

**Pages**:
- `/crm/contracts` - Contract listing
- `/crm/contracts/create` - Create contract
- `/crm/contracts/edit/[id]` - Edit contract
- `/crm/contracts/view/[id]` - View contract details (tabs: overview, terms, deliverables, amendments, attachments)
- `/crm/contracts/templates` - Contract templates
- `/crm/contracts/templates/view/[id]` - View template
- `/crm/contracts/templates/edit/[id]` - Edit template
- `/crm/contracts/amendments` - Contract amendments
- `/crm/contracts/amendments/create` - Create amendment
- `/crm/contracts/renewals` - Contract renewals dashboard

**Key Features**:
- Contract lifecycle management (draft, review, approved, active, expired)
- Template-based contract generation
- Contract amendments with approval workflow
- Renewal tracking and automation
- Contract value tracking
- Term and deliverable management
- E-signature workflow

**Entities**:
- `contracts` - Main contract records
- `contract_templates` - Reusable templates
- `contract_terms` - Contract terms and conditions
- `contract_deliverables` - Deliverable tracking
- `contract_amendments` - Amendment records
- `contract_renewals` - Renewal tracking
- `contract_approvals` - Approval workflow
- `contract_types` - Contract classifications (master)

---

### 9. CAMPAIGNS Module
**Purpose**: Execute and track marketing campaigns

**Pages**:
- `/crm/campaigns` - Campaign listing
- `/crm/campaigns/view/[id]` - View campaign details (tabs: overview, members, performance, timeline)
- `/crm/campaigns/edit/[id]` - Edit campaign
- `/crm/campaigns/email` - Email campaigns
- `/crm/campaigns/automation` - Campaign automation workflows
- `/crm/campaigns/performance` - Campaign analytics
- `/crm/campaigns/templates` - Campaign templates

**Key Features**:
- Multi-channel campaigns (email, social, events)
- Campaign audience targeting
- A/B testing
- Campaign ROI tracking
- Automated drip campaigns
- Lead nurturing workflows

**Entities**:
- `campaigns` - Main campaign records
- `campaign_members` - Target audience
- `campaign_responses` - Member engagement
- `campaign_channels` - Distribution channels (master)
- `campaign_templates` - Reusable campaigns
- `email_templates` - Email content templates
- `campaign_metrics` - Performance tracking

---

### 10. SUPPORT Module
**Purpose**: Manage customer support tickets and knowledge base

**Pages**:
- `/crm/support/tickets` - Ticket listing
- `/crm/support/tickets/create` - Create support ticket
- `/crm/support/knowledge` - Knowledge base articles
- `/crm/support/knowledge/create` - Create article
- `/crm/support/sla` - SLA management
- `/crm/support/sla/create` - Create SLA policy
- `/crm/support/sla/edit/[id]` - Edit SLA policy

**Key Features**:
- Multi-priority ticket management
- SLA tracking and alerts
- Knowledge base with categories
- Ticket escalation rules
- Customer satisfaction surveys
- Support team assignment

**Entities**:
- `support_tickets` - Main ticket records
- `ticket_categories` - Ticket classifications (master)
- `ticket_priorities` - Priority levels (master)
- `sla_policies` - SLA definitions
- `sla_violations` - SLA breach tracking
- `knowledge_articles` - KB content
- `article_categories` - KB organization
- `ticket_resolutions` - Resolution tracking

---

### 11. ANALYTICS Module
**Purpose**: Business intelligence and reporting

**Pages**:
- `/crm/analytics` - Analytics dashboard
- `/crm/analytics/sales` - Sales performance metrics
- `/crm/analytics/revenue` - Revenue analytics
- `/crm/analytics/customers` - Customer analytics
- `/crm/analytics/team` - Team performance
- `/crm/analytics/custom` - Custom report builder

**Key Features**:
- Pre-built dashboards (sales, revenue, customer, team)
- Custom report builder
- Data visualization (charts, graphs, KPIs)
- Export capabilities (PDF, Excel, CSV)
- Scheduled report delivery

**Entities**:
- `reports` - Saved report definitions
- `report_schedules` - Automated report delivery
- `dashboards` - Custom dashboard layouts
- `kpis` - Key performance indicators

---

### 12. ADVANCED FEATURES Module
**Purpose**: AI-powered and enterprise-grade features

**Pages**:
- `/crm/advanced-features` - Feature showcase
- `/crm/advanced-features/ai-scoring` - AI lead scoring
- `/crm/advanced-features/lead-scoring` - Enterprise qualification framework
- `/crm/advanced-features/account-hierarchy` - Visual org charts
- `/crm/advanced-features/accounts` - Account management
- `/crm/advanced-features/pipeline-forecast` - AI forecasting
- `/crm/advanced-features/pipeline` - Pipeline management
- `/crm/advanced-features/activity-timeline` - Collaborative timeline
- `/crm/advanced-features/activity` - Activity tracking
- `/crm/advanced-features/workflow-automation` - Workflow builder
- `/crm/advanced-features/automation` - Sales automation
- `/crm/advanced-features/task-management` - Kanban task board
- `/crm/advanced-features/collaboration` - Team collaboration
- `/crm/advanced-features/customer360` - Customer 360° view

**Key Features**:
- AI/ML-powered lead scoring
- Predictive analytics
- Visual workflow builder
- Sales automation playbooks
- Team collaboration tools
- Customer 360° insights

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
├── role (sales_rep, manager, admin)
├── department
├── team_id (FK -> teams)
├── is_active
├── created_at
└── updated_at

-- Teams Table
teams
├── id (PK)
├── name
├── manager_id (FK -> users)
├── territory_id (FK -> territories)
├── created_at
└── updated_at
```

### 2. **Territory & Geography Masters**

```sql
-- Territories Table
territories
├── id (PK)
├── name
├── region
├── country
├── manager_id (FK -> users)
├── is_active
├── created_at
└── updated_at

-- Countries Table
countries
├── id (PK)
├── name
├── code (ISO 3166)
└── currency_code

-- States/Provinces Table
states
├── id (PK)
├── country_id (FK -> countries)
├── name
└── code

-- Cities Table
cities
├── id (PK)
├── state_id (FK -> states)
├── name
└── zip_code
```

### 3. **Industry & Classification Masters**

```sql
-- Industries Table
industries
├── id (PK)
├── name
├── parent_id (FK -> industries) -- for sub-industries
└── description

-- Company Sizes Table
company_sizes
├── id (PK)
├── name (e.g., "1-10 employees", "11-50 employees")
├── min_employees
└── max_employees

-- Revenue Ranges Table
revenue_ranges
├── id (PK)
├── name (e.g., "$0-$1M", "$1M-$10M")
├── min_revenue
└── max_revenue
```

### 4. **Status & Stage Masters**

```sql
-- Lead Statuses Table
lead_statuses
├── id (PK)
├── name (New, Contacted, Qualified, Disqualified)
├── sequence (display order)
├── is_active
└── is_final (indicates end state)

-- Opportunity Stages Table
opportunity_stages
├── id (PK)
├── name (Qualification, Needs Analysis, Proposal, Negotiation, Closed Won, Closed Lost)
├── sequence
├── probability (win probability %)
├── is_closed_won
├── is_closed_lost
└── is_active

-- Ticket Statuses Table
ticket_statuses
├── id (PK)
├── name (New, Open, Pending, Resolved, Closed)
├── sequence
├── is_final
└── is_active
```

### 5. **Priority & Importance Masters**

```sql
-- Priorities Table (universal)
priorities
├── id (PK)
├── name (Low, Medium, High, Critical)
├── level (1-4)
└── color_code (for UI)

-- Urgency Levels Table
urgency_levels
├── id (PK)
├── name (Not Urgent, Somewhat Urgent, Urgent, Very Urgent)
└── sla_hours (response time)
```

### 6. **Activity & Interaction Masters**

```sql
-- Activity Types Table
activity_types
├── id (PK)
├── name (Call, Meeting, Email, Task, Note)
├── icon
└── requires_duration

-- Interaction Types Table
interaction_types
├── id (PK)
├── name (Phone, Email, In-Person, Video Call, Chat, Social Media)
├── icon
└── is_trackable

-- Meeting Types Table
meeting_types
├── id (PK)
├── name (Discovery, Demo, Negotiation, Closing, Follow-up)
└── default_duration_minutes

-- Call Outcomes Table
call_outcomes
├── id (PK)
├── name (Connected, Voicemail, Busy, No Answer, Wrong Number)
└── is_successful
```

### 7. **Product & Pricing Masters**

```sql
-- Product Categories Table
product_categories
├── id (PK)
├── name
├── parent_id (FK -> product_categories)
└── description

-- Products Table
products
├── id (PK)
├── name
├── sku
├── category_id (FK -> product_categories)
├── description
├── unit_price
├── cost
├── is_active
├── created_at
└── updated_at

-- Price Books Table
price_books
├── id (PK)
├── name (Standard, Enterprise, Partner)
├── is_default
├── currency
└── is_active

-- Price Book Entries Table
price_book_entries
├── id (PK)
├── price_book_id (FK -> price_books)
├── product_id (FK -> products)
├── unit_price
└── is_active
```

### 8. **Document & Attachment Masters**

```sql
-- Document Types Table
document_types
├── id (PK)
├── name (Contract, Proposal, Quote, Invoice, Agreement)
├── file_extensions (allowed)
└── max_size_mb

-- Attachment Categories Table
attachment_categories
├── id (PK)
├── name (Legal, Financial, Technical, Marketing)
└── description
```

### 9. **Communication Masters**

```sql
-- Email Templates Table
email_templates
├── id (PK)
├── name
├── subject
├── body_html
├── body_text
├── category
└── is_active

-- Communication Preferences Table (master values)
communication_channels
├── id (PK)
├── name (Email, Phone, SMS, WhatsApp, LinkedIn)
└── is_opt_in_required
```

### 10. **Loss & Reason Masters**

```sql
-- Win Loss Reasons Table
win_loss_reasons
├── id (PK)
├── reason_type (won, lost)
├── reason (e.g., "Price too high", "Feature gap", "Competitor chosen")
├── category
└── requires_details

-- Churn Reasons Table
churn_reasons
├── id (PK)
├── reason
├── category (Price, Support, Product, Competition)
└── is_preventable
```

### 11. **Custom Fields Master**

```sql
-- Custom Field Definitions Table
custom_fields
├── id (PK)
├── entity_type (lead, opportunity, contact, customer)
├── field_name
├── field_label
├── field_type (text, number, date, picklist, checkbox, textarea)
├── is_required
├── picklist_values (JSON array for dropdown options)
├── default_value
├── is_active
└── created_at

-- Custom Field Values Table
custom_field_values
├── id (PK)
├── custom_field_id (FK -> custom_fields)
├── entity_id (polymorphic - lead_id, opportunity_id, etc.)
├── entity_type
├── value
└── updated_at
```

---

## Normalized Database Schema

### Core Entity Tables

#### 1. LEADS Table

```sql
CREATE TABLE leads (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    lead_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),

    -- Company Information
    company VARCHAR(255),
    job_title VARCHAR(100),
    industry_id UUID REFERENCES industries(id),
    company_size_id UUID REFERENCES company_sizes(id),
    annual_revenue_range_id UUID REFERENCES revenue_ranges(id),
    employee_count INT,
    website VARCHAR(255),

    -- Address
    street_address TEXT,
    city_id UUID REFERENCES cities(id),
    state_id UUID REFERENCES states(id),
    country_id UUID REFERENCES countries(id),
    postal_code VARCHAR(20),

    -- Lead Details
    lead_source_id UUID REFERENCES lead_sources(id),
    lead_status_id UUID REFERENCES lead_statuses(id) NOT NULL,
    rating VARCHAR(20), -- Hot, Warm, Cold
    lead_score INT DEFAULT 0,

    -- Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,
    territory_id UUID REFERENCES territories(id),

    -- Qualification
    budget DECIMAL(15,2),
    authority VARCHAR(100), -- Decision maker name
    need TEXT,
    timeline VARCHAR(100),
    is_qualified BOOLEAN DEFAULT FALSE,
    qualified_date TIMESTAMP,

    -- Conversion
    is_converted BOOLEAN DEFAULT FALSE,
    converted_date TIMESTAMP,
    converted_opportunity_id UUID REFERENCES opportunities(id),
    converted_contact_id UUID REFERENCES contacts(id),
    converted_customer_id UUID REFERENCES customers(id),

    -- Communication Preferences
    email_opt_out BOOLEAN DEFAULT FALSE,
    phone_opt_out BOOLEAN DEFAULT FALSE,

    -- Metadata
    description TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_date TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_lead_owner (owner_id),
    INDEX idx_lead_status (lead_status_id),
    INDEX idx_lead_source (lead_source_id),
    INDEX idx_lead_email (email),
    INDEX idx_lead_company (company),
    INDEX idx_lead_created (created_at)
);
```

#### 2. OPPORTUNITIES Table

```sql
CREATE TABLE opportunities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Associated Records
    customer_id UUID REFERENCES customers(id) NOT NULL,
    contact_id UUID REFERENCES contacts(id),
    lead_id UUID REFERENCES leads(id), -- Original lead if converted

    -- Stage & Status
    stage_id UUID REFERENCES opportunity_stages(id) NOT NULL,
    probability INT, -- Win probability percentage (0-100)

    -- Financial
    amount DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    expected_revenue DECIMAL(15,2), -- amount * probability

    -- Dates
    close_date DATE NOT NULL,
    next_step VARCHAR(255),
    next_step_date DATE,

    -- Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,
    territory_id UUID REFERENCES territories(id),

    -- Classification
    type VARCHAR(50), -- New Business, Upsell, Renewal, Cross-sell
    source_campaign_id UUID REFERENCES campaigns(id),

    -- Closure
    is_closed BOOLEAN DEFAULT FALSE,
    is_won BOOLEAN,
    closed_date DATE,
    win_loss_reason_id UUID REFERENCES win_loss_reasons(id),
    win_loss_notes TEXT,

    -- Forecast
    forecast_category VARCHAR(50), -- Pipeline, Best Case, Commit, Omitted

    -- Competitors
    has_competition BOOLEAN DEFAULT FALSE,

    -- Metadata
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_date TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_opp_customer (customer_id),
    INDEX idx_opp_owner (owner_id),
    INDEX idx_opp_stage (stage_id),
    INDEX idx_opp_close_date (close_date),
    INDEX idx_opp_amount (amount)
);
```

#### 3. CONTACTS Table

```sql
CREATE TABLE contacts (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    contact_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    mobile VARCHAR(50),
    fax VARCHAR(50),

    -- Professional Information
    job_title VARCHAR(100),
    department VARCHAR(100),
    contact_role_id UUID REFERENCES contact_roles(id),
    reports_to_id UUID REFERENCES contacts(id), -- Manager/supervisor

    -- Associated Account
    customer_id UUID REFERENCES customers(id) NOT NULL,
    is_primary BOOLEAN DEFAULT FALSE,

    -- Address (often same as customer, but can differ)
    street_address TEXT,
    city_id UUID REFERENCES cities(id),
    state_id UUID REFERENCES states(id),
    country_id UUID REFERENCES countries(id),
    postal_code VARCHAR(20),

    -- Communication Preferences
    email_opt_out BOOLEAN DEFAULT FALSE,
    phone_opt_out BOOLEAN DEFAULT FALSE,
    preferred_contact_method VARCHAR(50), -- Email, Phone, etc.

    -- Social Media
    linkedin_url VARCHAR(255),
    twitter_handle VARCHAR(100),

    -- Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,

    -- Classification
    is_decision_maker BOOLEAN DEFAULT FALSE,
    is_influencer BOOLEAN DEFAULT FALSE,
    contact_status VARCHAR(50), -- Active, Inactive, Former

    -- Birthday & Personal
    birthdate DATE,
    assistant_name VARCHAR(100),
    assistant_phone VARCHAR(50),

    -- Metadata
    description TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_date TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_contact_customer (customer_id),
    INDEX idx_contact_owner (owner_id),
    INDEX idx_contact_email (email),
    INDEX idx_contact_name (last_name, first_name)
);
```

#### 4. CUSTOMERS Table

```sql
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    name VARCHAR(255) NOT NULL,
    legal_name VARCHAR(255),
    website VARCHAR(255),

    -- Classification
    customer_type_id UUID REFERENCES customer_types(id),
    industry_id UUID REFERENCES industries(id),
    company_size_id UUID REFERENCES company_sizes(id),
    annual_revenue DECIMAL(15,2),
    employee_count INT,

    -- Hierarchy
    parent_customer_id UUID REFERENCES customers(id),
    hierarchy_level INT DEFAULT 0, -- 0=parent, 1=subsidiary, 2=branch
    account_type VARCHAR(50), -- Parent, Subsidiary, Branch, Division

    -- Address
    billing_street TEXT,
    billing_city_id UUID REFERENCES cities(id),
    billing_state_id UUID REFERENCES states(id),
    billing_country_id UUID REFERENCES countries(id),
    billing_postal_code VARCHAR(20),

    shipping_street TEXT,
    shipping_city_id UUID REFERENCES cities(id),
    shipping_state_id UUID REFERENCES states(id),
    shipping_country_id UUID REFERENCES countries(id),
    shipping_postal_code VARCHAR(20),

    -- Contact Information
    phone VARCHAR(50),
    fax VARCHAR(50),

    -- Financial
    credit_limit DECIMAL(15,2),
    payment_terms VARCHAR(100),
    tax_id VARCHAR(50),

    -- Status
    customer_status VARCHAR(50), -- Active, Inactive, Churned
    is_active BOOLEAN DEFAULT TRUE,
    customer_since DATE,

    -- Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,
    territory_id UUID REFERENCES territories(id),

    -- Customer Health
    health_score INT, -- 0-100
    risk_level VARCHAR(20), -- Low, Medium, High

    -- Segmentation
    tier VARCHAR(20), -- Bronze, Silver, Gold, Platinum

    -- Metadata
    description TEXT,
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_activity_date TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_customer_owner (owner_id),
    INDEX idx_customer_parent (parent_customer_id),
    INDEX idx_customer_status (customer_status),
    INDEX idx_customer_name (name)
);
```

#### 5. ACTIVITIES Table

```sql
CREATE TABLE activities (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    subject VARCHAR(255) NOT NULL,
    description TEXT,

    -- Type & Status
    activity_type_id UUID REFERENCES activity_types(id) NOT NULL,
    status VARCHAR(50), -- Not Started, In Progress, Completed, Cancelled
    priority_id UUID REFERENCES priorities(id),

    -- Related To (polymorphic)
    related_to_type VARCHAR(50), -- lead, opportunity, contact, customer
    related_to_id UUID NOT NULL,

    -- Assignment
    assigned_to_id UUID REFERENCES users(id) NOT NULL,
    created_by_id UUID REFERENCES users(id) NOT NULL,

    -- Timing
    due_date DATE,
    due_time TIME,
    start_datetime TIMESTAMP,
    end_datetime TIMESTAMP,
    duration_minutes INT,

    -- Call Specific
    call_outcome_id UUID REFERENCES call_outcomes(id),
    call_direction VARCHAR(20), -- Inbound, Outbound
    call_recording_url VARCHAR(500),

    -- Meeting Specific
    meeting_location VARCHAR(255),
    meeting_type_id UUID REFERENCES meeting_types(id),

    -- Email Specific
    email_subject VARCHAR(255),
    email_opened BOOLEAN,
    email_clicked BOOLEAN,

    -- Completion
    is_completed BOOLEAN DEFAULT FALSE,
    completed_datetime TIMESTAMP,
    completed_by_id UUID REFERENCES users(id),
    outcome TEXT,

    -- Recurrence
    is_recurring BOOLEAN DEFAULT FALSE,
    recurrence_pattern VARCHAR(50), -- Daily, Weekly, Monthly
    recurrence_end_date DATE,

    -- Reminders
    has_reminder BOOLEAN DEFAULT FALSE,
    reminder_datetime TIMESTAMP,

    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_activity_assigned (assigned_to_id),
    INDEX idx_activity_type (activity_type_id),
    INDEX idx_activity_due (due_date),
    INDEX idx_activity_related (related_to_type, related_to_id)
);
```

#### 6. QUOTES Table

```sql
CREATE TABLE quotes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Associated Records
    opportunity_id UUID REFERENCES opportunities(id),
    customer_id UUID REFERENCES customers(id) NOT NULL,
    contact_id UUID REFERENCES contacts(id),

    -- Status
    status VARCHAR(50), -- Draft, Sent, Presented, Accepted, Rejected, Expired

    -- Financial
    subtotal DECIMAL(15,2) DEFAULT 0,
    discount_amount DECIMAL(15,2) DEFAULT 0,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_amount DECIMAL(15,2) DEFAULT 0,
    shipping_amount DECIMAL(15,2) DEFAULT 0,
    total_amount DECIMAL(15,2) DEFAULT 0,
    currency VARCHAR(3) DEFAULT 'USD',

    -- Dates
    quote_date DATE NOT NULL,
    expiration_date DATE NOT NULL,
    accepted_date DATE,

    -- Terms
    payment_terms VARCHAR(255),
    delivery_terms VARCHAR(255),

    -- Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,

    -- Template
    template_id UUID REFERENCES quote_templates(id),

    -- Versioning
    version_number INT DEFAULT 1,
    is_primary BOOLEAN DEFAULT TRUE, -- Latest version
    previous_version_id UUID REFERENCES quotes(id),

    -- E-Signature
    requires_signature BOOLEAN DEFAULT FALSE,
    signature_url VARCHAR(500),
    signed_by VARCHAR(100),
    signed_date TIMESTAMP,

    -- Conversion
    is_converted_to_order BOOLEAN DEFAULT FALSE,
    order_id UUID, -- Reference to sales order

    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_quote_opportunity (opportunity_id),
    INDEX idx_quote_customer (customer_id),
    INDEX idx_quote_owner (owner_id),
    INDEX idx_quote_status (status)
);
```

#### 7. CONTRACTS Table

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
    opportunity_id UUID REFERENCES opportunities(id),
    quote_id UUID REFERENCES quotes(id),

    -- Classification
    contract_type_id UUID REFERENCES contract_types(id),

    -- Status
    status VARCHAR(50), -- Draft, Under Review, Pending Approval, Approved, Active, Expired, Terminated

    -- Financial
    contract_value DECIMAL(15,2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    billing_frequency VARCHAR(50), -- Monthly, Quarterly, Annually, One-time

    -- Term
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    duration_months INT,

    -- Renewal
    auto_renew BOOLEAN DEFAULT FALSE,
    renewal_notice_days INT DEFAULT 30,
    renewal_terms TEXT,

    -- Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,

    -- Template
    template_id UUID REFERENCES contract_templates(id),

    -- E-Signature
    requires_signature BOOLEAN DEFAULT TRUE,
    customer_signed BOOLEAN DEFAULT FALSE,
    customer_signed_by VARCHAR(100),
    customer_signed_date TIMESTAMP,
    company_signed BOOLEAN DEFAULT FALSE,
    company_signed_by VARCHAR(100),
    company_signed_date TIMESTAMP,

    -- Legal
    governing_law VARCHAR(100),
    jurisdiction VARCHAR(100),

    -- Amendment Tracking
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
    INDEX idx_contract_customer (customer_id),
    INDEX idx_contract_owner (owner_id),
    INDEX idx_contract_status (status),
    INDEX idx_contract_dates (start_date, end_date)
);
```

#### 8. CAMPAIGNS Table

```sql
CREATE TABLE campaigns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    name VARCHAR(255) NOT NULL,
    description TEXT,

    -- Classification
    type VARCHAR(50), -- Email, Social, Event, Webinar, Content, Advertising
    status VARCHAR(50), -- Planning, In Progress, Completed, On Hold, Cancelled

    -- Dates
    start_date DATE NOT NULL,
    end_date DATE,

    -- Financial
    budget DECIMAL(15,2),
    actual_cost DECIMAL(15,2),
    expected_revenue DECIMAL(15,2),
    expected_response_rate DECIMAL(5,2),

    -- Targeting
    target_audience TEXT,
    target_size INT,

    -- Assignment
    owner_id UUID REFERENCES users(id) NOT NULL,

    -- Template
    template_id UUID REFERENCES campaign_templates(id),

    -- Metrics
    leads_generated INT DEFAULT 0,
    opportunities_generated INT DEFAULT 0,
    revenue_generated DECIMAL(15,2) DEFAULT 0,
    response_count INT DEFAULT 0,
    response_rate DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    roi DECIMAL(10,2),

    -- Parent Campaign (for hierarchical campaigns)
    parent_campaign_id UUID REFERENCES campaigns(id),

    -- Metadata
    notes TEXT,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_campaign_owner (owner_id),
    INDEX idx_campaign_status (status),
    INDEX idx_campaign_dates (start_date, end_date)
);
```

#### 9. SUPPORT_TICKETS Table

```sql
CREATE TABLE support_tickets (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    ticket_number VARCHAR(50) UNIQUE NOT NULL,

    -- Basic Information
    subject VARCHAR(255) NOT NULL,
    description TEXT NOT NULL,

    -- Classification
    category_id UUID REFERENCES ticket_categories(id),
    priority_id UUID REFERENCES priorities(id) NOT NULL,
    status_id UUID REFERENCES ticket_statuses(id) NOT NULL,

    -- Associated Records
    customer_id UUID REFERENCES customers(id) NOT NULL,
    contact_id UUID REFERENCES contacts(id),
    contract_id UUID REFERENCES contracts(id),

    -- Assignment
    assigned_to_id UUID REFERENCES users(id),
    team_id UUID REFERENCES teams(id),

    -- SLA
    sla_policy_id UUID REFERENCES sla_policies(id),
    first_response_due TIMESTAMP,
    first_response_at TIMESTAMP,
    resolution_due TIMESTAMP,
    resolved_at TIMESTAMP,
    sla_violated BOOLEAN DEFAULT FALSE,

    -- Communication
    channel VARCHAR(50), -- Email, Phone, Chat, Portal, Social

    -- Resolution
    is_resolved BOOLEAN DEFAULT FALSE,
    resolution TEXT,
    resolution_time_minutes INT,

    -- Customer Satisfaction
    satisfaction_rating INT, -- 1-5
    satisfaction_comments TEXT,

    -- Escalation
    is_escalated BOOLEAN DEFAULT FALSE,
    escalated_to_id UUID REFERENCES users(id),
    escalated_at TIMESTAMP,
    escalation_reason TEXT,

    -- Related Tickets
    parent_ticket_id UUID REFERENCES support_tickets(id),

    -- Metadata
    tags TEXT[], -- Array of tags
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    -- Soft Delete
    deleted_at TIMESTAMP,

    -- Indexes
    INDEX idx_ticket_customer (customer_id),
    INDEX idx_ticket_assigned (assigned_to_id),
    INDEX idx_ticket_status (status_id),
    INDEX idx_ticket_priority (priority_id),
    INDEX idx_ticket_created (created_at)
);
```

### Junction/Relationship Tables

```sql
-- Opportunity Products (many-to-many)
CREATE TABLE opportunity_products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    total_price DECIMAL(15,2) NOT NULL,
    description TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_opp_prod_opp (opportunity_id),
    INDEX idx_opp_prod_prod (product_id)
);

-- Quote Line Items (many-to-many)
CREATE TABLE quote_line_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(id),
    quantity INT NOT NULL,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percent DECIMAL(5,2) DEFAULT 0,
    tax_percent DECIMAL(5,2) DEFAULT 0,
    line_total DECIMAL(15,2) NOT NULL,
    description TEXT,
    sequence INT, -- Line order
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_quote_line_quote (quote_id),
    INDEX idx_quote_line_prod (product_id)
);

-- Campaign Members (many-to-many)
CREATE TABLE campaign_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_id UUID REFERENCES campaigns(id) ON DELETE CASCADE,
    lead_id UUID REFERENCES leads(id),
    contact_id UUID REFERENCES contacts(id),
    status VARCHAR(50), -- Sent, Responded, Opened, Clicked, Converted, Bounced
    response_date TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_campaign_member_campaign (campaign_id),
    INDEX idx_campaign_member_lead (lead_id),
    INDEX idx_campaign_member_contact (contact_id)
);

-- Activity Participants (many-to-many)
CREATE TABLE activity_participants (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    activity_id UUID REFERENCES activities(id) ON DELETE CASCADE,
    contact_id UUID REFERENCES contacts(id),
    user_id UUID REFERENCES users(id),
    participant_type VARCHAR(50), -- Organizer, Required, Optional
    response_status VARCHAR(50), -- Accepted, Declined, Tentative, No Response
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_activity_part_activity (activity_id),
    INDEX idx_activity_part_contact (contact_id)
);

-- Customer Segments (many-to-many)
CREATE TABLE customer_segment_members (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    segment_id UUID REFERENCES customer_segments(id) ON DELETE CASCADE,
    customer_id UUID REFERENCES customers(id) ON DELETE CASCADE,
    added_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_manual BOOLEAN DEFAULT FALSE, -- Manually added vs auto-added by criteria

    INDEX idx_segment_member_segment (segment_id),
    INDEX idx_segment_member_customer (customer_id)
);

-- Opportunity Competitors (many-to-many)
CREATE TABLE opportunity_competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_id UUID REFERENCES opportunities(id) ON DELETE CASCADE,
    competitor_name VARCHAR(255) NOT NULL,
    strengths TEXT,
    weaknesses TEXT,
    is_primary_competitor BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_opp_comp_opp (opportunity_id)
);

-- Attachments/Documents (polymorphic)
CREATE TABLE attachments (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL, -- lead, opportunity, contact, customer, etc.
    entity_id UUID NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_size BIGINT, -- in bytes
    file_type VARCHAR(100),
    file_path VARCHAR(500) NOT NULL,
    document_type_id UUID REFERENCES document_types(id),
    description TEXT,
    uploaded_by UUID REFERENCES users(id) NOT NULL,
    uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_attachment_entity (entity_type, entity_id)
);

-- Notes (polymorphic)
CREATE TABLE notes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    entity_type VARCHAR(50) NOT NULL,
    entity_id UUID NOT NULL,
    title VARCHAR(255),
    content TEXT NOT NULL,
    is_private BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(id) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    INDEX idx_note_entity (entity_type, entity_id)
);
```

---

## Entity Relationships

### Relationship Diagram

```
Users
  ↓ owns
Leads → converts to → Opportunities → creates → Quotes → converts to → Contracts
  ↓                         ↓                      ↓                        ↓
  ↓                         ↓                      ↓                        ↓
Creates                 Creates                Creates                 Creates
  ↓                         ↓                      ↓                        ↓
Contacts ← belongs to ← Customers ← has ← CustomerHierarchy
  ↓                         ↓
  ↓                         ↓
Participates in      Has interactions
  ↓                         ↓
Activities ← related to ← Interactions
  ↓
  ↓
Related to Campaigns
  ↓
  ↓
Has members (Leads/Contacts)

Support System:
Customers → creates → SupportTickets
            ↓
         follows SLA Policies
            ↓
         tracked by Knowledge Base
```

### Key Relationships

1. **Lead → Opportunity → Customer Flow**
   - A Lead can be converted to an Opportunity
   - An Opportunity is always associated with a Customer
   - Lead conversion creates Contact, Customer, and Opportunity

2. **Customer → Contact Hierarchy**
   - A Customer can have multiple Contacts (1:M)
   - Contacts have roles (decision maker, influencer, etc.)
   - One Contact can be marked as primary

3. **Customer Hierarchy**
   - Customers can have parent-child relationships
   - Supports multi-level hierarchies (parent → subsidiary → branch)
   - Recursive relationship on customers table

4. **Opportunity → Quote → Contract**
   - An Opportunity can have multiple Quotes (versions)
   - A Quote can be converted to a Contract
   - Contracts can have Amendments

5. **Activities Polymorphic Relations**
   - Activities can be related to Leads, Opportunities, Contacts, or Customers
   - Uses polymorphic pattern (related_to_type, related_to_id)

6. **Campaign → Lead/Contact**
   - Campaigns have members (Leads or Contacts)
   - Campaign responses tracked separately
   - Can generate new Leads

---

## API Endpoints

### Authentication & Authorization
```
POST   /api/auth/login              - User login
POST   /api/auth/logout             - User logout
POST   /api/auth/refresh            - Refresh access token
GET    /api/auth/me                 - Get current user profile
```

### Leads API

```
GET    /api/leads                   - List leads (with filters, pagination, search)
POST   /api/leads                   - Create new lead
GET    /api/leads/:id               - Get lead details
PUT    /api/leads/:id               - Update lead
DELETE /api/leads/:id               - Delete lead (soft delete)
PATCH  /api/leads/:id/status        - Update lead status
POST   /api/leads/:id/convert       - Convert lead to opportunity
GET    /api/leads/:id/activities    - Get lead activities
POST   /api/leads/:id/activities    - Log activity for lead
GET    /api/leads/:id/score         - Get lead score and factors
POST   /api/leads/:id/score         - Update lead score
POST   /api/leads/import            - Bulk import leads (CSV/Excel)
POST   /api/leads/assign            - Bulk assign leads
GET    /api/leads/sources           - Get lead sources
POST   /api/leads/sources           - Create lead source
```

**Query Parameters** (for GET /api/leads):
- `page` - Page number (default: 1)
- `limit` - Records per page (default: 20, max: 100)
- `status` - Filter by status ID
- `source` - Filter by source ID
- `owner` - Filter by owner ID
- `rating` - Filter by rating (hot, warm, cold)
- `min_score` - Minimum lead score
- `search` - Search in name, email, company
- `sort` - Sort field (e.g., created_at, lead_score)
- `order` - Sort order (asc, desc)
- `is_converted` - Filter by conversion status (true/false)

### Opportunities API

```
GET    /api/opportunities            - List opportunities
POST   /api/opportunities            - Create opportunity
GET    /api/opportunities/:id        - Get opportunity details
PUT    /api/opportunities/:id        - Update opportunity
DELETE /api/opportunities/:id        - Delete opportunity
PATCH  /api/opportunities/:id/stage  - Move to different stage
POST   /api/opportunities/:id/win    - Mark as won
POST   /api/opportunities/:id/lose   - Mark as lost
GET    /api/opportunities/:id/products - Get opportunity products
POST   /api/opportunities/:id/products - Add product to opportunity
PUT    /api/opportunities/:id/products/:productId - Update product line
DELETE /api/opportunities/:id/products/:productId - Remove product
GET    /api/opportunities/:id/activities - Get opportunity activities
GET    /api/opportunities/:id/quotes - Get related quotes
GET    /api/opportunities/pipeline   - Get pipeline view data
GET    /api/opportunities/forecast   - Get forecast data
GET    /api/opportunities/stages     - Get opportunity stages
POST   /api/opportunities/stages     - Create custom stage
```

### Contacts API

```
GET    /api/contacts                 - List contacts
POST   /api/contacts                 - Create contact
GET    /api/contacts/:id             - Get contact details
PUT    /api/contacts/:id             - Update contact
DELETE /api/contacts/:id             - Delete contact
GET    /api/contacts/:id/activities  - Get contact activities
GET    /api/contacts/:id/opportunities - Get related opportunities
POST   /api/contacts/:id/merge       - Merge duplicate contacts
GET    /api/contacts/roles           - Get contact roles
POST   /api/contacts/import          - Bulk import contacts
```

### Customers API

```
GET    /api/customers                - List customers
POST   /api/customers                - Create customer
GET    /api/customers/:id            - Get customer details
PUT    /api/customers/:id            - Update customer
DELETE /api/customers/:id            - Delete customer
GET    /api/customers/:id/contacts   - Get customer contacts
GET    /api/customers/:id/opportunities - Get customer opportunities
GET    /api/customers/:id/contracts  - Get customer contracts
GET    /api/customers/:id/tickets    - Get customer support tickets
GET    /api/customers/:id/360        - Get customer 360 view (all data)
GET    /api/customers/:id/hierarchy  - Get account hierarchy
POST   /api/customers/:id/hierarchy  - Add child account
GET    /api/customers/segments       - Get customer segments
POST   /api/customers/segments       - Create segment
GET    /api/customers/segments/:id/members - Get segment members
POST   /api/customers/:id/health-score - Update health score
```

### Activities API

```
GET    /api/activities               - List activities
POST   /api/activities               - Create activity
GET    /api/activities/:id           - Get activity details
PUT    /api/activities/:id           - Update activity
DELETE /api/activities/:id           - Delete activity
PATCH  /api/activities/:id/complete  - Mark as completed
GET    /api/activities/calendar      - Get calendar view
GET    /api/activities/upcoming      - Get upcoming activities
GET    /api/activities/overdue       - Get overdue activities
POST   /api/activities/:id/participants - Add participant
DELETE /api/activities/:id/participants/:participantId - Remove participant
```

### Quotes API

```
GET    /api/quotes                   - List quotes
POST   /api/quotes                   - Create quote
GET    /api/quotes/:id               - Get quote details
PUT    /api/quotes/:id               - Update quote
DELETE /api/quotes/:id               - Delete quote
POST   /api/quotes/:id/send          - Send quote to customer
POST   /api/quotes/:id/accept        - Accept quote
POST   /api/quotes/:id/reject        - Reject quote
GET    /api/quotes/:id/pdf           - Generate quote PDF
POST   /api/quotes/:id/convert       - Convert to contract/order
GET    /api/quotes/:id/line-items    - Get quote line items
POST   /api/quotes/:id/line-items    - Add line item
PUT    /api/quotes/:id/line-items/:lineId - Update line item
DELETE /api/quotes/:id/line-items/:lineId - Remove line item
POST   /api/quotes/:id/version       - Create new version
GET    /api/quotes/templates         - Get quote templates
POST   /api/quotes/pricing-rules     - Create pricing rule
GET    /api/quotes/pricing-rules     - Get pricing rules
```

### Contracts API

```
GET    /api/contracts                - List contracts
POST   /api/contracts                - Create contract
GET    /api/contracts/:id            - Get contract details
PUT    /api/contracts/:id            - Update contract
DELETE /api/contracts/:id            - Delete contract
POST   /api/contracts/:id/sign       - Sign contract
POST   /api/contracts/:id/activate   - Activate contract
POST   /api/contracts/:id/terminate  - Terminate contract
GET    /api/contracts/:id/amendments - Get contract amendments
POST   /api/contracts/:id/amendments - Create amendment
PUT    /api/contracts/:id/amendments/:amendmentId - Update amendment
POST   /api/contracts/:id/amendments/:amendmentId/approve - Approve amendment
GET    /api/contracts/:id/deliverables - Get deliverables
POST   /api/contracts/:id/deliverables - Add deliverable
GET    /api/contracts/renewals       - Get upcoming renewals
POST   /api/contracts/:id/renew      - Renew contract
GET    /api/contracts/templates      - Get contract templates
```

### Campaigns API

```
GET    /api/campaigns                - List campaigns
POST   /api/campaigns                - Create campaign
GET    /api/campaigns/:id            - Get campaign details
PUT    /api/campaigns/:id            - Update campaign
DELETE /api/campaigns/:id            - Delete campaign
POST   /api/campaigns/:id/activate   - Activate campaign
POST   /api/campaigns/:id/complete   - Complete campaign
GET    /api/campaigns/:id/members    - Get campaign members
POST   /api/campaigns/:id/members    - Add members to campaign
DELETE /api/campaigns/:id/members/:memberId - Remove member
GET    /api/campaigns/:id/performance - Get campaign metrics
GET    /api/campaigns/:id/responses  - Get campaign responses
POST   /api/campaigns/:id/send-email - Send campaign email
GET    /api/campaigns/templates      - Get campaign templates
```

### Support API

```
GET    /api/support/tickets          - List tickets
POST   /api/support/tickets          - Create ticket
GET    /api/support/tickets/:id      - Get ticket details
PUT    /api/support/tickets/:id      - Update ticket
DELETE /api/support/tickets/:id      - Delete ticket
POST   /api/support/tickets/:id/assign - Assign ticket
POST   /api/support/tickets/:id/escalate - Escalate ticket
POST   /api/support/tickets/:id/resolve - Resolve ticket
POST   /api/support/tickets/:id/close - Close ticket
POST   /api/support/tickets/:id/comments - Add comment
GET    /api/support/tickets/:id/comments - Get comments
GET    /api/support/knowledge        - List KB articles
POST   /api/support/knowledge        - Create article
GET    /api/support/knowledge/:id    - Get article
PUT    /api/support/knowledge/:id    - Update article
POST   /api/support/knowledge/:id/publish - Publish article
GET    /api/support/sla              - List SLA policies
POST   /api/support/sla              - Create SLA policy
GET    /api/support/sla/violations   - Get SLA violations
```

### Analytics API

```
GET    /api/analytics/dashboard      - Get dashboard data
GET    /api/analytics/sales          - Get sales metrics
GET    /api/analytics/revenue        - Get revenue analytics
GET    /api/analytics/pipeline       - Get pipeline analytics
GET    /api/analytics/conversion-rates - Get conversion rates
GET    /api/analytics/team-performance - Get team metrics
GET    /api/analytics/customer-health - Get customer health metrics
GET    /api/analytics/forecast       - Get forecast data
POST   /api/analytics/reports        - Create custom report
GET    /api/analytics/reports/:id    - Get report data
POST   /api/analytics/reports/:id/export - Export report (PDF/Excel)
```

### Common Master Data APIs

```
GET    /api/masters/industries       - Get industries
GET    /api/masters/territories      - Get territories
GET    /api/masters/teams            - Get teams
GET    /api/masters/priorities       - Get priorities
GET    /api/masters/statuses         - Get statuses by entity type
GET    /api/masters/stages           - Get stages by entity type
GET    /api/masters/products         - Get products
GET    /api/masters/price-books      - Get price books
GET    /api/masters/currencies       - Get supported currencies
GET    /api/masters/countries        - Get countries
GET    /api/masters/states           - Get states by country
GET    /api/masters/cities           - Get cities by state
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
        "field": "email",
        "message": "Email is required"
      }
    ]
  }
}
```

---

## Data Flow & Business Logic

### Lead Conversion Flow

```
1. Lead Qualification
   ├─ Check BANT criteria (Budget, Authority, Need, Timeline)
   ├─ Verify lead score threshold (e.g., > 70)
   └─ Validate required fields (email, company, etc.)

2. Conversion Process
   ├─ Create Customer record (if doesn't exist)
   ├─ Create Contact record from Lead
   ├─ Create Opportunity record
   ├─ Link all three records
   ├─ Mark Lead as converted
   └─ Transfer all lead activities to new records

3. Post-Conversion
   ├─ Notify opportunity owner
   ├─ Create initial follow-up task
   └─ Update dashboard metrics
```

### Opportunity Stage Movement

```
1. Stage Change Validation
   ├─ Check required fields for new stage
   ├─ Validate probability update
   └─ Check if stage sequence is valid (no skipping stages)

2. Update Process
   ├─ Update opportunity stage
   ├─ Update probability percentage
   ├─ Recalculate expected revenue (amount * probability)
   ├─ Log stage history
   └─ Update forecast category

3. Automation Triggers
   ├─ Send stage-specific email templates
   ├─ Create next-step tasks
   ├─ Update customer health score
   └─ Notify team members
```

### Quote Approval Workflow

```
1. Quote Creation
   ├─ Select products/services
   ├─ Apply pricing rules
   ├─ Calculate totals
   └─ Save as draft

2. Approval Routing
   ├─ Check if approval required (based on discount %, amount)
   ├─ Route to appropriate approver(s)
   │   ├─ < 10% discount: Auto-approve
   │   ├─ 10-20% discount: Manager approval
   │   └─ > 20% discount: Director approval
   └─ Send approval notifications

3. Approved Quote
   ├─ Generate PDF
   ├─ Send to customer
   ├─ Track opens/views
   └─ Set expiration reminder

4. Acceptance
   ├─ Customer accepts (e-signature)
   ├─ Convert to contract/order
   └─ Update opportunity stage to "Closed Won"
```

### Contract Amendment Process

```
1. Amendment Request
   ├─ Create amendment record
   ├─ Specify type (value, scope, term, pricing)
   ├─ Document reason and justification
   └─ List impacted clauses

2. Approval Workflow
   ├─ Check if legal review required
   ├─ Route to internal approvers
   ├─ Send to customer for approval
   └─ Track approval status

3. Amendment Execution
   ├─ Both parties sign amendment
   ├─ Update main contract record
   ├─ Increment amendment count
   ├─ Store amendment as separate document
   └─ Set effective date

4. Contract Update
   ├─ Update contract value (if applicable)
   ├─ Update end date (if term extended)
   ├─ Update deliverables (if scope changed)
   └─ Notify stakeholders
```

### Lead Scoring Algorithm

```
Demographic Scoring (40 points):
├─ Company Size: 0-10 points
├─ Industry Fit: 0-10 points
├─ Revenue Range: 0-10 points
└─ Job Title/Role: 0-10 points

Behavioral Scoring (60 points):
├─ Website Visits: 0-15 points
├─ Email Engagement: 0-15 points
├─ Content Downloads: 0-15 points
└─ Form Submissions: 0-15 points

Total Score: 0-100 points
Rating Assignment:
├─ 80-100: Hot (high priority)
├─ 60-79: Warm (medium priority)
├─ 40-59: Cold (low priority)
└─ 0-39: Disqualified
```

### Campaign Response Tracking

```
1. Campaign Member Addition
   ├─ Add leads/contacts to campaign
   ├─ Set initial status (Sent)
   └─ Track send timestamp

2. Engagement Tracking
   ├─ Email Opened → Update status
   ├─ Link Clicked → Update status
   ├─ Form Submitted → Update status to "Responded"
   └─ Log response timestamp

3. Conversion Tracking
   ├─ If lead converted from campaign
   ├─ Link opportunity to campaign
   ├─ Increment campaign metrics
   └─ Calculate campaign ROI

4. Campaign Metrics Update
   ├─ Response Rate = Responses / Sent * 100
   ├─ Conversion Rate = Conversions / Responses * 100
   ├─ ROI = (Revenue - Cost) / Cost * 100
   └─ Update campaign record
```

### SLA Tracking

```
1. Ticket Creation
   ├─ Assign SLA policy based on priority/category
   ├─ Calculate first response due time
   ├─ Calculate resolution due time
   └─ Set SLA timers

2. Timer Management
   ├─ Pause timer when status = "Waiting on Customer"
   ├─ Resume timer when status changes back
   ├─ Account for business hours only (if configured)
   └─ Exclude weekends/holidays

3. SLA Violation Detection
   ├─ Check if first response sent before due time
   ├─ Check if resolved before resolution due time
   ├─ Log violations in sla_violations table
   └─ Trigger escalation if violated

4. Escalation Process
   ├─ Notify ticket owner
   ├─ Notify team manager
   ├─ If still unresolved, escalate to next level
   └─ Track escalation in ticket record
```

---

## Implementation Recommendations

### 1. Database Indexing Strategy
- Index all foreign keys
- Index frequently filtered fields (status, owner, dates)
- Create composite indexes for common query patterns
- Use partial indexes for active records only

### 2. Data Archival
- Soft delete records (deleted_at timestamp)
- Archive old records (> 2 years) to separate tables
- Maintain full audit trail for compliance

### 3. Performance Optimization
- Implement caching for master data (Redis)
- Use database views for complex joins
- Implement pagination on all list APIs
- Use lazy loading for related data

### 4. Security
- Row-level security based on ownership and team
- API rate limiting (100 requests/minute per user)
- Encrypt sensitive fields (SSN, credit card, etc.)
- Audit log for all data changes

### 5. API Best Practices
- Use RESTful conventions
- Implement API versioning (/api/v1/)
- Provide filtering, sorting, searching on all list endpoints
- Return meaningful HTTP status codes
- Include HATEOAS links in responses

### 6. Business Rule Engine
- Externalize business rules (approval thresholds, scoring criteria)
- Store rules in database for runtime configuration
- Implement rule versioning
- Provide UI for rule management

---

## Conclusion

This CRM module provides a complete, enterprise-grade customer relationship management system with:
- ✅ Normalized database schema (3NF)
- ✅ Comprehensive master data tables
- ✅ RESTful API design
- ✅ Proper entity relationships
- ✅ Business logic workflows
- ✅ Scalable architecture

The schema is designed to support 100+ concurrent users, millions of records, and can be deployed on PostgreSQL, MySQL, or SQL Server with minimal modifications.
