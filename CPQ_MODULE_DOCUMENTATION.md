# CPQ Module - Complete Documentation

## Table of Contents
1. [Module Overview](#module-overview)
2. [Feature Modules](#feature-modules)
3. [Common Masters (Lookup Tables)](#common-masters-lookup-tables)
4. [Normalized Database Schema](#normalized-database-schema)
5. [Entity Relationships](#entity-relationships)
6. [API Endpoints](#api-endpoints)
7. [Data Flow & Business Logic](#data-flow--business-logic)
8. [Integration Points](#integration-points)

---

## Module Overview

The CPQ (Configure, Price, Quote) module is a comprehensive system for managing product configurations, pricing rules, quote generation, and proposal management. It consists of 4 major feature areas with 50+ modals and 20+ pages.

### Key Capabilities
- **Product Configuration**: Build complex product bundles with rules and constraints
- **Advanced Pricing**: Tier pricing, discounts, approval workflows, margin analysis
- **Quote Management**: Generate quotes with automated pricing and approvals
- **Proposal Generation**: Create professional proposals with templates, content library, and e-signatures
- **Guided Selling**: AI-powered recommendations and playbooks
- **Workflow Automation**: Approval routing, notifications, and SLA management

### Module Structure
```
/cpq
├── /products              # Product catalog and configuration
│   ├── /catalog          # Product catalog management
│   ├── /bundles          # Product bundling
│   ├── /configurator     # Product configuration engine
│   ├── /options          # Product options and variants
│   └── /rules            # Configuration rules and constraints
├── /pricing               # Pricing engine and rules
│   ├── /tiers            # Tiered pricing models
│   ├── /discounts        # Discount management
│   ├── /approvals        # Pricing approval workflow
│   └── /margin-analysis  # Margin calculation and analysis
├── /guided-selling        # AI-powered selling assistance
│   ├── /questionnaire    # Customer needs assessment
│   ├── /recommendations  # Product recommendations
│   ├── /cross-sell       # Cross-sell opportunities
│   └── /playbooks        # Sales playbooks
├── /proposals             # Proposal generation and management
│   ├── /builder          # Proposal builder (drag-and-drop)
│   ├── /templates        # Proposal templates
│   ├── /content          # Content library
│   └── /signatures       # E-signature tracking
└── /advanced-features     # Advanced CPQ capabilities
    ├── /versioning       # Price versioning
    ├── /documents        # Document generation
    ├── /esignature       # E-signature integration
    └── /collaboration    # Team collaboration tools
```

---

## Feature Modules

### 1. PRODUCTS Module
**Purpose**: Manage product catalog, configurations, bundles, and rules

#### 1.1 Product Catalog (`/cpq/products/catalog`)
**Purpose**: Central repository for all products and services

**Key Features**:
- Product hierarchy (categories, subcategories)
- Product attributes (SKU, name, description, pricing)
- Product lifecycle management (active, discontinued, draft)
- Multi-currency support
- Product search and filtering
- Bulk import/export

**Database Tables**:

```sql
-- Products Table
CREATE TABLE products (
    product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_code VARCHAR(50) UNIQUE NOT NULL,
    product_name VARCHAR(255) NOT NULL,
    description TEXT,
    category_id UUID REFERENCES product_categories(category_id),
    product_type VARCHAR(50) NOT NULL, -- 'standard', 'bundle', 'configurable', 'service'
    base_price DECIMAL(15,2),
    cost_price DECIMAL(15,2),
    currency_code VARCHAR(3) REFERENCES currencies(currency_code),
    unit_of_measure VARCHAR(20),
    is_configurable BOOLEAN DEFAULT FALSE,
    is_bundleable BOOLEAN DEFAULT TRUE,
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'discontinued', 'draft'
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_code (product_code),
    INDEX idx_category (category_id),
    INDEX idx_status (status)
);

-- Product Categories (Master)
CREATE TABLE product_categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_code VARCHAR(50) UNIQUE NOT NULL,
    category_name VARCHAR(255) NOT NULL,
    parent_category_id UUID REFERENCES product_categories(category_id),
    level INT DEFAULT 1,
    sort_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Attributes
CREATE TABLE product_attributes (
    attribute_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    attribute_name VARCHAR(100) NOT NULL,
    attribute_value TEXT,
    attribute_type VARCHAR(50), -- 'text', 'number', 'boolean', 'list'
    is_searchable BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product (product_id)
);

-- Product Pricing History
CREATE TABLE product_price_history (
    history_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    old_price DECIMAL(15,2),
    new_price DECIMAL(15,2),
    effective_date DATE NOT NULL,
    changed_by UUID REFERENCES users(user_id),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_date (product_id, effective_date)
);
```

**API Endpoints**:
```
GET    /api/cpq/products                    # List all products
GET    /api/cpq/products/:id                # Get product details
POST   /api/cpq/products                    # Create product
PUT    /api/cpq/products/:id                # Update product
DELETE /api/cpq/products/:id                # Delete product
GET    /api/cpq/products/search             # Search products
GET    /api/cpq/products/:id/price-history  # Get price history
POST   /api/cpq/products/bulk-import        # Bulk import products
GET    /api/cpq/products/categories         # Get product categories
```

---

#### 1.2 Product Bundles (`/cpq/products/bundles`)
**Purpose**: Create and manage product bundles with pricing rules

**Key Features**:
- Bundle composition (parent-child relationships)
- Bundle pricing strategies (sum of parts, fixed price, percentage discount)
- Quantity-based rules
- Required vs optional components
- Bundle versioning

**Database Tables**:

```sql
-- Product Bundles
CREATE TABLE product_bundles (
    bundle_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_code VARCHAR(50) UNIQUE NOT NULL,
    bundle_name VARCHAR(255) NOT NULL,
    description TEXT,
    parent_product_id UUID REFERENCES products(product_id),
    pricing_method VARCHAR(50) NOT NULL, -- 'sum', 'fixed', 'percentage_discount'
    bundle_price DECIMAL(15,2),
    discount_percentage DECIMAL(5,2),
    min_quantity INT DEFAULT 1,
    max_quantity INT,
    is_mandatory BOOLEAN DEFAULT FALSE,
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_parent_product (parent_product_id)
);

-- Bundle Components
CREATE TABLE bundle_components (
    component_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id UUID REFERENCES product_bundles(bundle_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id),
    quantity INT DEFAULT 1,
    is_required BOOLEAN DEFAULT TRUE,
    is_default_selected BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    unit_price_override DECIMAL(15,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bundle (bundle_id),
    INDEX idx_product (product_id),
    UNIQUE KEY unique_bundle_product (bundle_id, product_id)
);

-- Bundle Rules
CREATE TABLE bundle_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    bundle_id UUID REFERENCES product_bundles(bundle_id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- 'inclusion', 'exclusion', 'dependency', 'quantity'
    rule_logic JSONB NOT NULL, -- Flexible rule definition
    error_message TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_bundle (bundle_id)
);
```

**API Endpoints**:
```
GET    /api/cpq/bundles                # List all bundles
GET    /api/cpq/bundles/:id            # Get bundle details
POST   /api/cpq/bundles                # Create bundle
PUT    /api/cpq/bundles/:id            # Update bundle
DELETE /api/cpq/bundles/:id            # Delete bundle
GET    /api/cpq/bundles/:id/components # Get bundle components
POST   /api/cpq/bundles/:id/validate   # Validate bundle configuration
GET    /api/cpq/bundles/:id/price      # Calculate bundle price
```

---

#### 1.3 Product Configurator (`/cpq/products/configurator`)
**Purpose**: Configure complex products with options and constraints

**Key Features**:
- Step-by-step configuration wizard
- Real-time price calculation
- Visual configuration preview
- Configuration validation
- Save and resume configurations
- Configuration versioning

**Database Tables**:

```sql
-- Product Configurations
CREATE TABLE product_configurations (
    config_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    config_code VARCHAR(50) UNIQUE NOT NULL,
    product_id UUID REFERENCES products(product_id),
    customer_id UUID REFERENCES customers(customer_id),
    opportunity_id UUID REFERENCES opportunities(opportunity_id),
    configuration_data JSONB NOT NULL, -- Stores selected options
    total_price DECIMAL(15,2),
    is_valid BOOLEAN DEFAULT TRUE,
    validation_errors JSONB,
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'submitted', 'approved', 'rejected'
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product (product_id),
    INDEX idx_customer (customer_id),
    INDEX idx_opportunity (opportunity_id)
);

-- Configuration Steps
CREATE TABLE configuration_steps (
    step_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    step_name VARCHAR(100) NOT NULL,
    step_description TEXT,
    step_order INT NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    display_type VARCHAR(50), -- 'dropdown', 'radio', 'checkbox', 'text'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product (product_id)
);

-- Configuration Options
CREATE TABLE configuration_options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    step_id UUID REFERENCES configuration_steps(step_id) ON DELETE CASCADE,
    option_code VARCHAR(50) NOT NULL,
    option_name VARCHAR(255) NOT NULL,
    option_description TEXT,
    price_impact DECIMAL(15,2) DEFAULT 0,
    impact_type VARCHAR(20) DEFAULT 'add', -- 'add', 'multiply', 'replace'
    is_default BOOLEAN DEFAULT FALSE,
    display_order INT DEFAULT 0,
    image_url TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_step (step_id)
);

-- Configuration Rules Engine
CREATE TABLE configuration_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- 'constraint', 'recommendation', 'pricing', 'validation'
    condition_logic JSONB NOT NULL, -- IF conditions
    action_logic JSONB NOT NULL, -- THEN actions
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_type (product_id, rule_type)
);
```

**API Endpoints**:
```
GET    /api/cpq/configurator/products/:id/steps     # Get configuration steps
POST   /api/cpq/configurator/configure              # Start new configuration
PUT    /api/cpq/configurator/:configId              # Update configuration
POST   /api/cpq/configurator/:configId/validate     # Validate configuration
POST   /api/cpq/configurator/:configId/calculate    # Calculate price
GET    /api/cpq/configurator/:configId              # Get configuration
POST   /api/cpq/configurator/:configId/submit       # Submit for approval
GET    /api/cpq/configurator/:configId/rules        # Get applicable rules
```

---

#### 1.4 Product Options (`/cpq/products/options`)
**Purpose**: Manage product variants, options, and add-ons

**Database Tables**:

```sql
-- Product Options
CREATE TABLE product_options (
    option_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id) ON DELETE CASCADE,
    option_group VARCHAR(100) NOT NULL, -- 'size', 'color', 'material', etc.
    option_name VARCHAR(255) NOT NULL,
    option_code VARCHAR(50),
    price_modifier DECIMAL(15,2) DEFAULT 0,
    cost_modifier DECIMAL(15,2) DEFAULT 0,
    lead_time_impact INT DEFAULT 0, -- days
    is_available BOOLEAN DEFAULT TRUE,
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product_group (product_id, option_group)
);

-- Option Dependencies
CREATE TABLE option_dependencies (
    dependency_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    parent_option_id UUID REFERENCES product_options(option_id) ON DELETE CASCADE,
    child_option_id UUID REFERENCES product_options(option_id) ON DELETE CASCADE,
    dependency_type VARCHAR(50) NOT NULL, -- 'requires', 'excludes', 'recommends'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_parent (parent_option_id)
);
```

---

#### 1.5 Configuration Rules (`/cpq/products/rules`)
**Purpose**: Define and manage configuration constraints and business rules

**Database Tables**:

```sql
-- Rule Categories (Master)
CREATE TABLE rule_categories (
    category_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    category_name VARCHAR(100) UNIQUE NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Rules
CREATE TABLE product_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_code VARCHAR(50) UNIQUE NOT NULL,
    rule_name VARCHAR(255) NOT NULL,
    category_id UUID REFERENCES rule_categories(category_id),
    rule_description TEXT,
    applies_to VARCHAR(50) NOT NULL, -- 'product', 'bundle', 'configuration'
    target_products JSONB, -- Array of product IDs
    rule_definition JSONB NOT NULL,
    error_message TEXT,
    warning_message TEXT,
    severity VARCHAR(20) DEFAULT 'error', -- 'error', 'warning', 'info'
    is_active BOOLEAN DEFAULT TRUE,
    effective_from DATE,
    effective_to DATE,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_applies_to (applies_to),
    INDEX idx_active (is_active)
);

-- Rule Execution Log
CREATE TABLE rule_execution_log (
    log_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_id UUID REFERENCES product_rules(rule_id),
    config_id UUID REFERENCES product_configurations(config_id),
    execution_result VARCHAR(20), -- 'passed', 'failed', 'warning'
    execution_details JSONB,
    executed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_config (config_id),
    INDEX idx_executed_at (executed_at)
);
```

---

### 2. PRICING Module
**Purpose**: Manage pricing strategies, discounts, and approvals

#### 2.1 Tiered Pricing (`/cpq/pricing/tiers`)
**Purpose**: Implement volume-based and tier-based pricing

**Database Tables**:

```sql
-- Price Books
CREATE TABLE price_books (
    price_book_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_book_code VARCHAR(50) UNIQUE NOT NULL,
    price_book_name VARCHAR(255) NOT NULL,
    description TEXT,
    currency_code VARCHAR(3) REFERENCES currencies(currency_code),
    is_standard BOOLEAN DEFAULT FALSE,
    effective_from DATE NOT NULL,
    effective_to DATE,
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_status (status)
);

-- Price Book Entries
CREATE TABLE price_book_entries (
    entry_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    price_book_id UUID REFERENCES price_books(price_book_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id),
    list_price DECIMAL(15,2) NOT NULL,
    unit_cost DECIMAL(15,2),
    minimum_price DECIMAL(15,2),
    maximum_discount_percent DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_price_book_product (price_book_id, product_id),
    UNIQUE KEY unique_price_book_product (price_book_id, product_id)
);

-- Tiered Pricing
CREATE TABLE pricing_tiers (
    tier_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID REFERENCES products(product_id),
    price_book_id UUID REFERENCES price_books(price_book_id),
    tier_name VARCHAR(100) NOT NULL,
    min_quantity INT NOT NULL,
    max_quantity INT,
    unit_price DECIMAL(15,2) NOT NULL,
    discount_percentage DECIMAL(5,2),
    effective_from DATE,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_product (product_id),
    INDEX idx_price_book (price_book_id)
);

-- Customer-Specific Pricing
CREATE TABLE customer_pricing (
    customer_price_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(customer_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id),
    special_price DECIMAL(15,2) NOT NULL,
    discount_percentage DECIMAL(5,2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    approval_status VARCHAR(20) DEFAULT 'approved',
    approved_by UUID REFERENCES users(user_id),
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer_product (customer_id, product_id)
);
```

**API Endpoints**:
```
GET    /api/cpq/pricing/price-books              # List price books
POST   /api/cpq/pricing/price-books              # Create price book
GET    /api/cpq/pricing/price-books/:id          # Get price book
PUT    /api/cpq/pricing/price-books/:id          # Update price book
GET    /api/cpq/pricing/tiers                    # List pricing tiers
POST   /api/cpq/pricing/tiers                    # Create tier
POST   /api/cpq/pricing/calculate                # Calculate price
GET    /api/cpq/pricing/customer/:id/products    # Get customer pricing
```

---

#### 2.2 Discounts (`/cpq/pricing/discounts`)
**Purpose**: Manage discount rules and promotions

**Database Tables**:

```sql
-- Discount Types (Master)
CREATE TABLE discount_types (
    discount_type_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    type_code VARCHAR(50) UNIQUE NOT NULL,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    calculation_method VARCHAR(50), -- 'percentage', 'fixed_amount', 'tiered'
    is_stackable BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Discounts
CREATE TABLE discounts (
    discount_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discount_code VARCHAR(50) UNIQUE NOT NULL,
    discount_name VARCHAR(255) NOT NULL,
    discount_type_id UUID REFERENCES discount_types(discount_type_id),
    description TEXT,
    discount_value DECIMAL(15,2) NOT NULL,
    discount_type VARCHAR(50) NOT NULL, -- 'percentage', 'fixed'
    applies_to VARCHAR(50) NOT NULL, -- 'product', 'category', 'total', 'bundle'
    target_products JSONB,
    min_order_value DECIMAL(15,2),
    max_discount_amount DECIMAL(15,2),
    requires_approval BOOLEAN DEFAULT FALSE,
    approval_threshold DECIMAL(15,2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    usage_limit INT,
    usage_count INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_code (discount_code),
    INDEX idx_active_dates (is_active, effective_from, effective_to)
);

-- Discount Rules
CREATE TABLE discount_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discount_id UUID REFERENCES discounts(discount_id) ON DELETE CASCADE,
    rule_type VARCHAR(50) NOT NULL, -- 'customer_segment', 'order_value', 'quantity', 'product_mix'
    rule_condition JSONB NOT NULL,
    priority INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_discount (discount_id)
);

-- Discount Applications
CREATE TABLE discount_applications (
    application_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    discount_id UUID REFERENCES discounts(discount_id),
    quote_id UUID REFERENCES quotes(quote_id),
    applied_by UUID REFERENCES users(user_id),
    discount_amount DECIMAL(15,2),
    approval_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected'
    approved_by UUID REFERENCES users(user_id),
    approval_notes TEXT,
    applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_quote (quote_id),
    INDEX idx_approval_status (approval_status)
);
```

**API Endpoints**:
```
GET    /api/cpq/discounts                        # List discounts
POST   /api/cpq/discounts                        # Create discount
GET    /api/cpq/discounts/:id                    # Get discount
PUT    /api/cpq/discounts/:id                    # Update discount
DELETE /api/cpq/discounts/:id                    # Deactivate discount
POST   /api/cpq/discounts/validate               # Validate discount code
POST   /api/cpq/discounts/apply                  # Apply discount to quote
GET    /api/cpq/discounts/available/:quoteId     # Get available discounts
```

---

#### 2.3 Pricing Approvals (`/cpq/pricing/approvals`)
**Purpose**: Manage pricing approval workflows

**Database Tables**:

```sql
-- Approval Workflows
CREATE TABLE approval_workflows (
    workflow_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_name VARCHAR(255) NOT NULL,
    workflow_type VARCHAR(50) NOT NULL, -- 'pricing', 'discount', 'contract', 'custom'
    description TEXT,
    trigger_conditions JSONB NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_workflow_type (workflow_type)
);

-- Approval Steps
CREATE TABLE approval_steps (
    step_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES approval_workflows(workflow_id) ON DELETE CASCADE,
    step_name VARCHAR(100) NOT NULL,
    step_order INT NOT NULL,
    approver_role VARCHAR(100),
    approver_user_id UUID REFERENCES users(user_id),
    approval_type VARCHAR(50) DEFAULT 'any', -- 'any', 'all', 'majority'
    escalation_hours INT,
    is_mandatory BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_workflow (workflow_id)
);

-- Approval Requests
CREATE TABLE approval_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    workflow_id UUID REFERENCES approval_workflows(workflow_id),
    reference_type VARCHAR(50) NOT NULL, -- 'quote', 'discount', 'contract'
    reference_id UUID NOT NULL,
    request_data JSONB NOT NULL,
    requested_by UUID REFERENCES users(user_id),
    current_step_id UUID REFERENCES approval_steps(step_id),
    overall_status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'approved', 'rejected', 'cancelled'
    priority VARCHAR(20) DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
    deadline TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    INDEX idx_reference (reference_type, reference_id),
    INDEX idx_status (overall_status),
    INDEX idx_requested_by (requested_by)
);

-- Approval Actions
CREATE TABLE approval_actions (
    action_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES approval_requests(request_id) ON DELETE CASCADE,
    step_id UUID REFERENCES approval_steps(step_id),
    approver_id UUID REFERENCES users(user_id),
    action VARCHAR(20) NOT NULL, -- 'approved', 'rejected', 'delegated', 'recalled'
    comments TEXT,
    delegate_to UUID REFERENCES users(user_id),
    action_taken_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_request (request_id),
    INDEX idx_approver (approver_id)
);

-- Approval Notifications
CREATE TABLE approval_notifications (
    notification_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES approval_requests(request_id) ON DELETE CASCADE,
    recipient_id UUID REFERENCES users(user_id),
    notification_type VARCHAR(50) NOT NULL, -- 'pending', 'approved', 'rejected', 'escalated'
    message TEXT,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recipient_unread (recipient_id, is_read)
);
```

**API Endpoints**:
```
GET    /api/cpq/approvals/workflows             # List workflows
POST   /api/cpq/approvals/workflows             # Create workflow
GET    /api/cpq/approvals/requests              # List approval requests
POST   /api/cpq/approvals/requests              # Create approval request
GET    /api/cpq/approvals/requests/:id          # Get request details
POST   /api/cpq/approvals/requests/:id/approve  # Approve request
POST   /api/cpq/approvals/requests/:id/reject   # Reject request
POST   /api/cpq/approvals/requests/:id/delegate # Delegate approval
GET    /api/cpq/approvals/pending               # Get pending approvals
GET    /api/cpq/approvals/history/:referenceId  # Get approval history
```

---

#### 2.4 Margin Analysis (`/cpq/pricing/margin-analysis`)
**Purpose**: Analyze profit margins and pricing strategies

**Database Tables**:

```sql
-- Margin Targets (Master)
CREATE TABLE margin_targets (
    target_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    target_name VARCHAR(100) NOT NULL,
    product_category_id UUID REFERENCES product_categories(category_id),
    customer_segment VARCHAR(100),
    min_margin_percentage DECIMAL(5,2) NOT NULL,
    target_margin_percentage DECIMAL(5,2) NOT NULL,
    alert_threshold_percentage DECIMAL(5,2),
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category_segment (product_category_id, customer_segment)
);

-- Quote Margins
CREATE TABLE quote_margins (
    margin_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(quote_id) ON DELETE CASCADE,
    line_item_id UUID REFERENCES quote_line_items(line_item_id),
    cost_price DECIMAL(15,2) NOT NULL,
    selling_price DECIMAL(15,2) NOT NULL,
    margin_amount DECIMAL(15,2) NOT NULL,
    margin_percentage DECIMAL(5,2) NOT NULL,
    target_margin_percentage DECIMAL(5,2),
    is_within_target BOOLEAN,
    calculation_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_quote (quote_id)
);

-- Margin Alerts
CREATE TABLE margin_alerts (
    alert_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    quote_id UUID REFERENCES quotes(quote_id),
    alert_type VARCHAR(50) NOT NULL, -- 'below_minimum', 'below_target', 'negative'
    alert_message TEXT,
    margin_percentage DECIMAL(5,2),
    threshold_percentage DECIMAL(5,2),
    alerted_users JSONB, -- Array of user IDs
    is_acknowledged BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_quote (quote_id)
);
```

---

### 3. GUIDED SELLING Module
**Purpose**: AI-powered sales assistance and product recommendations

#### 3.1 Questionnaire (`/cpq/guided-selling/questionnaire`)
**Purpose**: Assess customer needs through structured questions

**Database Tables**:

```sql
-- Questionnaires
CREATE TABLE questionnaires (
    questionnaire_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_code VARCHAR(50) UNIQUE NOT NULL,
    questionnaire_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    target_segment VARCHAR(100),
    avg_completion_time INT, -- minutes
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Questions
CREATE TABLE questions (
    question_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID REFERENCES questionnaires(questionnaire_id) ON DELETE CASCADE,
    question_text TEXT NOT NULL,
    question_type VARCHAR(50) NOT NULL, -- 'text', 'multiple_choice', 'rating', 'yes_no', 'number'
    question_order INT NOT NULL,
    is_required BOOLEAN DEFAULT TRUE,
    options JSONB, -- For multiple choice questions
    scoring_weight DECIMAL(3,2) DEFAULT 1.0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questionnaire (questionnaire_id)
);

-- Question Responses
CREATE TABLE question_responses (
    response_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID REFERENCES questionnaires(questionnaire_id),
    question_id UUID REFERENCES questions(question_id),
    customer_id UUID REFERENCES customers(customer_id),
    opportunity_id UUID REFERENCES opportunities(opportunity_id),
    response_value TEXT NOT NULL,
    response_score DECIMAL(5,2),
    responded_by UUID REFERENCES users(user_id),
    responded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_customer (customer_id),
    INDEX idx_opportunity (opportunity_id)
);

-- Questionnaire Analytics
CREATE TABLE questionnaire_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    questionnaire_id UUID REFERENCES questionnaires(questionnaire_id),
    completion_rate DECIMAL(5,2),
    avg_score DECIMAL(5,2),
    qualified_leads_count INT,
    total_responses INT,
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_questionnaire (questionnaire_id)
);
```

**API Endpoints**:
```
GET    /api/cpq/guided-selling/questionnaires           # List questionnaires
POST   /api/cpq/guided-selling/questionnaires           # Create questionnaire
GET    /api/cpq/guided-selling/questionnaires/:id       # Get questionnaire
PUT    /api/cpq/guided-selling/questionnaires/:id       # Update questionnaire
POST   /api/cpq/guided-selling/questionnaires/:id/start # Start session
POST   /api/cpq/guided-selling/responses                # Submit responses
GET    /api/cpq/guided-selling/responses/:opportunityId # Get responses
GET    /api/cpq/guided-selling/analytics/:id            # Get analytics
```

---

#### 3.2 Recommendations (`/cpq/guided-selling/recommendations`)
**Purpose**: AI-powered product recommendations

**Database Tables**:

```sql
-- Recommendation Engine Rules
CREATE TABLE recommendation_rules (
    rule_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    rule_name VARCHAR(255) NOT NULL,
    rule_type VARCHAR(50) NOT NULL, -- 'collaborative', 'content_based', 'rule_based', 'ai_ml'
    rule_logic JSONB NOT NULL,
    confidence_threshold DECIMAL(3,2) DEFAULT 0.7,
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Product Recommendations
CREATE TABLE product_recommendations (
    recommendation_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(customer_id),
    product_id UUID REFERENCES products(product_id),
    recommended_product_id UUID REFERENCES products(product_id),
    recommendation_type VARCHAR(50) NOT NULL, -- 'best_match', 'upgrade', 'alternative', 'frequently_bought', 'trending'
    confidence_score DECIMAL(3,2) NOT NULL,
    estimated_value DECIMAL(15,2),
    reason TEXT,
    based_on TEXT, -- What triggered the recommendation
    priority VARCHAR(20) DEFAULT 'medium',
    acceptance_rate DECIMAL(5,2),
    is_ai_generated BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP,
    INDEX idx_customer (customer_id),
    INDEX idx_product (product_id)
);

-- Recommendation Feedback
CREATE TABLE recommendation_feedback (
    feedback_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    recommendation_id UUID REFERENCES product_recommendations(recommendation_id) ON DELETE CASCADE,
    feedback_type VARCHAR(50) NOT NULL, -- 'accepted', 'rejected', 'deferred'
    feedback_reason TEXT,
    quote_id UUID REFERENCES quotes(quote_id),
    provided_by UUID REFERENCES users(user_id),
    provided_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_recommendation (recommendation_id)
);
```

---

#### 3.3 Cross-Sell (`/cpq/guided-selling/cross-sell`)
**Purpose**: Identify and manage cross-sell opportunities

**Database Tables**:

```sql
-- Cross-Sell Opportunities
CREATE TABLE cross_sell_opportunities (
    opportunity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    primary_product_id UUID REFERENCES products(product_id),
    suggested_product_id UUID REFERENCES products(product_id),
    relationship_type VARCHAR(50) NOT NULL, -- 'complement', 'essential', 'upgrade', 'bundle'
    co_occurrence_rate DECIMAL(5,2),
    avg_additional_revenue DECIMAL(15,2),
    conversion_rate DECIMAL(5,2),
    customers_count INT,
    total_opportunity_value DECIMAL(15,2),
    recommendation_strength VARCHAR(20), -- 'strong', 'medium', 'weak'
    is_active BOOLEAN DEFAULT TRUE,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_primary_product (primary_product_id),
    UNIQUE KEY unique_cross_sell (primary_product_id, suggested_product_id)
);

-- Cross-Sell Campaigns
CREATE TABLE cross_sell_campaigns (
    campaign_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    campaign_name VARCHAR(255) NOT NULL,
    opportunity_id UUID REFERENCES cross_sell_opportunities(opportunity_id),
    target_segment JSONB,
    campaign_message TEXT,
    discount_offered DECIMAL(5,2),
    start_date DATE NOT NULL,
    end_date DATE,
    budget DECIMAL(15,2),
    actual_spend DECIMAL(15,2),
    leads_generated INT DEFAULT 0,
    conversions INT DEFAULT 0,
    revenue_generated DECIMAL(15,2),
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_opportunity (opportunity_id)
);
```

---

#### 3.4 Sales Playbooks (`/cpq/guided-selling/playbooks`)
**Purpose**: Structured sales processes and best practices

**Database Tables**:

```sql
-- Sales Playbooks
CREATE TABLE sales_playbooks (
    playbook_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playbook_code VARCHAR(50) UNIQUE NOT NULL,
    playbook_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    target_segment VARCHAR(100),
    product_focus VARCHAR(255),
    avg_deal_size DECIMAL(15,2),
    win_rate DECIMAL(5,2),
    avg_cycle_time INT, -- days
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category)
);

-- Playbook Stages
CREATE TABLE playbook_stages (
    stage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playbook_id UUID REFERENCES sales_playbooks(playbook_id) ON DELETE CASCADE,
    stage_name VARCHAR(100) NOT NULL,
    stage_description TEXT,
    stage_order INT NOT NULL,
    duration_days INT,
    success_criteria TEXT,
    required_actions JSONB,
    exit_criteria TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_playbook (playbook_id)
);

-- Playbook Usage
CREATE TABLE playbook_usage (
    usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    playbook_id UUID REFERENCES sales_playbooks(playbook_id),
    opportunity_id UUID REFERENCES opportunities(opportunity_id),
    current_stage_id UUID REFERENCES playbook_stages(stage_id),
    started_by UUID REFERENCES users(user_id),
    started_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    completed_at TIMESTAMP,
    outcome VARCHAR(20), -- 'won', 'lost', 'abandoned'
    actual_deal_value DECIMAL(15,2),
    actual_cycle_time INT,
    INDEX idx_opportunity (opportunity_id)
);

-- Stage Completions
CREATE TABLE stage_completions (
    completion_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    usage_id UUID REFERENCES playbook_usage(usage_id) ON DELETE CASCADE,
    stage_id UUID REFERENCES playbook_stages(stage_id),
    completed_by UUID REFERENCES users(user_id),
    completion_notes TEXT,
    completed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_usage (usage_id)
);
```

---

### 4. PROPOSALS Module
**Purpose**: Create, manage, and track professional proposals

#### 4.1 Proposal Builder (`/cpq/proposals/builder`)
**Purpose**: Visual proposal builder with drag-and-drop sections

**Database Tables**:

```sql
-- Proposals
CREATE TABLE proposals (
    proposal_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_number VARCHAR(50) UNIQUE NOT NULL,
    proposal_title VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES customers(customer_id),
    contact_id UUID REFERENCES contacts(contact_id),
    opportunity_id UUID REFERENCES opportunities(opportunity_id),
    quote_id UUID REFERENCES quotes(quote_id),
    status VARCHAR(20) DEFAULT 'draft', -- 'draft', 'sent', 'viewed', 'signed', 'expired', 'rejected'
    total_value DECIMAL(15,2),
    valid_from DATE NOT NULL,
    valid_until DATE NOT NULL,
    sent_date TIMESTAMP,
    viewed_date TIMESTAMP,
    signed_date TIMESTAMP,
    branding_config JSONB, -- Logo, colors, fonts
    page_settings JSONB, -- Page size, orientation, margins
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_proposal_number (proposal_number),
    INDEX idx_customer (customer_id),
    INDEX idx_status (status)
);

-- Proposal Sections
CREATE TABLE proposal_sections (
    section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(proposal_id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL, -- 'cover', 'text', 'quote', 'table', 'image', 'terms'
    section_title VARCHAR(255) NOT NULL,
    section_content TEXT,
    section_order INT NOT NULL,
    is_visible BOOLEAN DEFAULT TRUE,
    is_editable BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_proposal (proposal_id)
);

-- Proposal Versions
CREATE TABLE proposal_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    proposal_id UUID REFERENCES proposals(proposal_id) ON DELETE CASCADE,
    version_number VARCHAR(20) NOT NULL,
    version_data JSONB NOT NULL, -- Complete proposal snapshot
    change_summary TEXT,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_proposal (proposal_id)
);
```

**API Endpoints**:
```
GET    /api/cpq/proposals                    # List proposals
POST   /api/cpq/proposals                    # Create proposal
GET    /api/cpq/proposals/:id                # Get proposal
PUT    /api/cpq/proposals/:id                # Update proposal
DELETE /api/cpq/proposals/:id                # Delete proposal
POST   /api/cpq/proposals/:id/send           # Send proposal
POST   /api/cpq/proposals/:id/preview        # Generate preview
POST   /api/cpq/proposals/:id/export-pdf     # Export as PDF
GET    /api/cpq/proposals/:id/sections       # Get sections
POST   /api/cpq/proposals/:id/sections       # Add section
PUT    /api/cpq/proposals/:id/sections/:sid  # Update section
DELETE /api/cpq/proposals/:id/sections/:sid  # Delete section
```

---

#### 4.2 Proposal Templates (`/cpq/proposals/templates`)
**Purpose**: Manage reusable proposal templates

**Database Tables**:

```sql
-- Proposal Templates
CREATE TABLE proposal_templates (
    template_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_code VARCHAR(50) UNIQUE NOT NULL,
    template_name VARCHAR(255) NOT NULL,
    description TEXT,
    category VARCHAR(100),
    template_data JSONB NOT NULL, -- Sections, layout, styling
    thumbnail_url TEXT,
    usage_count INT DEFAULT 0,
    success_rate DECIMAL(5,2),
    avg_deal_size DECIMAL(15,2),
    avg_closure_time INT, -- days
    tags JSONB,
    status VARCHAR(20) DEFAULT 'active',
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_category (category),
    INDEX idx_status (status)
);

-- Template Sections
CREATE TABLE template_sections (
    section_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES proposal_templates(template_id) ON DELETE CASCADE,
    section_type VARCHAR(50) NOT NULL,
    section_title VARCHAR(255) NOT NULL,
    section_content TEXT,
    section_order INT NOT NULL,
    is_editable BOOLEAN DEFAULT TRUE,
    is_required BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_template (template_id)
);

-- Template Usage Analytics
CREATE TABLE template_usage_analytics (
    analytics_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    template_id UUID REFERENCES proposal_templates(template_id),
    usage_count INT DEFAULT 0,
    view_rate DECIMAL(5,2),
    conversion_rate DECIMAL(5,2),
    avg_time_to_send INT, -- hours
    avg_time_to_sign INT, -- hours
    calculated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_template (template_id)
);
```

---

#### 4.3 Content Library (`/cpq/proposals/content`)
**Purpose**: Centralized content repository for proposals

**Database Tables**:

```sql
-- Content Items
CREATE TABLE content_items (
    content_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_code VARCHAR(50) UNIQUE NOT NULL,
    content_title VARCHAR(255) NOT NULL,
    content_type VARCHAR(50) NOT NULL, -- 'text', 'image', 'video', 'document', 'case_study', 'specification'
    content_category VARCHAR(100),
    description TEXT,
    file_url TEXT,
    file_size BIGINT,
    file_format VARCHAR(50),
    thumbnail_url TEXT,
    usage_count INT DEFAULT 0,
    tags JSONB,
    version VARCHAR(20) DEFAULT '1.0',
    status VARCHAR(20) DEFAULT 'active', -- 'active', 'archived', 'pending_approval'
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_content_type (content_type),
    INDEX idx_category (content_category),
    INDEX idx_status (status)
);

-- Content Folders
CREATE TABLE content_folders (
    folder_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    folder_name VARCHAR(255) NOT NULL,
    parent_folder_id UUID REFERENCES content_folders(folder_id),
    folder_path TEXT,
    level INT DEFAULT 1,
    is_shared BOOLEAN DEFAULT FALSE,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_parent (parent_folder_id)
);

-- Content Usage
CREATE TABLE content_usage (
    usage_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    content_id UUID REFERENCES content_items(content_id),
    proposal_id UUID REFERENCES proposals(proposal_id),
    used_by UUID REFERENCES users(user_id),
    used_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_content (content_id),
    INDEX idx_proposal (proposal_id)
);
```

---

#### 4.4 E-Signatures (`/cpq/proposals/signatures`)
**Purpose**: Track digital signatures and document status

**Database Tables**:

```sql
-- Signature Requests
CREATE TABLE signature_requests (
    request_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    signature_code VARCHAR(50) UNIQUE NOT NULL,
    proposal_id UUID REFERENCES proposals(proposal_id) ON DELETE CASCADE,
    signer_name VARCHAR(255) NOT NULL,
    signer_email VARCHAR(255) NOT NULL,
    signer_title VARCHAR(100),
    status VARCHAR(20) DEFAULT 'pending', -- 'pending', 'sent', 'viewed', 'signed', 'declined', 'expired'
    sent_date TIMESTAMP,
    viewed_date TIMESTAMP,
    signed_date TIMESTAMP,
    expires_date TIMESTAMP NOT NULL,
    reminders_sent INT DEFAULT 0,
    last_reminder_date TIMESTAMP,
    signature_image_url TEXT,
    ip_address VARCHAR(45),
    device_info TEXT,
    location TEXT,
    decline_reason TEXT,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_proposal (proposal_id),
    INDEX idx_status (status),
    INDEX idx_signer_email (signer_email)
);

-- Signature Audit Trail
CREATE TABLE signature_audit_trail (
    audit_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    request_id UUID REFERENCES signature_requests(request_id) ON DELETE CASCADE,
    event_type VARCHAR(50) NOT NULL, -- 'created', 'sent', 'viewed', 'signed', 'declined', 'reminder_sent'
    event_data JSONB,
    ip_address VARCHAR(45),
    user_agent TEXT,
    occurred_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_request (request_id),
    INDEX idx_occurred_at (occurred_at)
);

-- Signature Settings
CREATE TABLE signature_settings (
    setting_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    organization_id UUID,
    require_authentication BOOLEAN DEFAULT FALSE,
    allow_decline BOOLEAN DEFAULT TRUE,
    auto_reminder_enabled BOOLEAN DEFAULT TRUE,
    reminder_interval_days INT DEFAULT 3,
    expiry_days INT DEFAULT 30,
    legal_notice TEXT,
    terms_and_conditions TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

### 5. ADVANCED FEATURES Module

#### 5.1 Price Versioning (`/cpq/advanced-features/versioning`)
**Purpose**: Manage multiple versions of pricing

**Database Tables**:

```sql
-- Price Versions
CREATE TABLE price_versions (
    version_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_code VARCHAR(50) UNIQUE NOT NULL,
    version_name VARCHAR(255) NOT NULL,
    description TEXT,
    effective_from DATE NOT NULL,
    effective_to DATE,
    is_active BOOLEAN DEFAULT FALSE,
    approval_status VARCHAR(20) DEFAULT 'draft',
    approved_by UUID REFERENCES users(user_id),
    approved_at TIMESTAMP,
    created_by UUID REFERENCES users(user_id),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_effective_dates (effective_from, effective_to)
);

-- Version Products
CREATE TABLE version_products (
    version_product_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    version_id UUID REFERENCES price_versions(version_id) ON DELETE CASCADE,
    product_id UUID REFERENCES products(product_id),
    version_price DECIMAL(15,2) NOT NULL,
    version_cost DECIMAL(15,2),
    change_type VARCHAR(50), -- 'increase', 'decrease', 'no_change'
    change_percentage DECIMAL(5,2),
    reason TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_version (version_id),
    UNIQUE KEY unique_version_product (version_id, product_id)
);
```

---

## Common Masters (Lookup Tables)

### Global Masters

```sql
-- Currencies (Master)
CREATE TABLE currencies (
    currency_code VARCHAR(3) PRIMARY KEY,
    currency_name VARCHAR(100) NOT NULL,
    symbol VARCHAR(10),
    decimal_places INT DEFAULT 2,
    is_active BOOLEAN DEFAULT TRUE,
    exchange_rate DECIMAL(15,6) DEFAULT 1.0,
    last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Countries (Master)
CREATE TABLE countries (
    country_code VARCHAR(3) PRIMARY KEY,
    country_name VARCHAR(100) NOT NULL,
    region VARCHAR(100),
    is_active BOOLEAN DEFAULT TRUE
);

-- Units of Measure (Master)
CREATE TABLE units_of_measure (
    uom_code VARCHAR(20) PRIMARY KEY,
    uom_name VARCHAR(100) NOT NULL,
    uom_category VARCHAR(50), -- 'length', 'weight', 'volume', 'quantity'
    conversion_factor DECIMAL(15,6) DEFAULT 1.0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Tax Codes (Master)
CREATE TABLE tax_codes (
    tax_code VARCHAR(20) PRIMARY KEY,
    tax_name VARCHAR(100) NOT NULL,
    tax_rate DECIMAL(5,2) NOT NULL,
    tax_type VARCHAR(50), -- 'sales_tax', 'vat', 'gst', 'excise'
    country_code VARCHAR(3) REFERENCES countries(country_code),
    is_active BOOLEAN DEFAULT TRUE
);

-- Users (Reference)
CREATE TABLE users (
    user_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    username VARCHAR(100) UNIQUE NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    full_name VARCHAR(255) NOT NULL,
    role VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Customers (Reference from CRM)
CREATE TABLE customers (
    customer_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_code VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_type VARCHAR(50), -- 'enterprise', 'smb', 'individual'
    industry VARCHAR(100),
    segment VARCHAR(100),
    credit_limit DECIMAL(15,2),
    payment_terms VARCHAR(50),
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contacts (Reference from CRM)
CREATE TABLE contacts (
    contact_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID REFERENCES customers(customer_id),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(50),
    title VARCHAR(100),
    is_primary BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Opportunities (Reference from CRM)
CREATE TABLE opportunities (
    opportunity_id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    opportunity_name VARCHAR(255) NOT NULL,
    customer_id UUID REFERENCES customers(customer_id),
    stage VARCHAR(50),
    probability DECIMAL(5,2),
    expected_value DECIMAL(15,2),
    close_date DATE,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### CPQ-Specific Masters

```sql
-- Quote Statuses (Master)
CREATE TABLE quote_statuses (
    status_code VARCHAR(50) PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
    status_type VARCHAR(50), -- 'draft', 'active', 'won', 'lost', 'expired'
    display_order INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Proposal Statuses (Master)
CREATE TABLE proposal_statuses (
    status_code VARCHAR(50) PRIMARY KEY,
    status_name VARCHAR(100) NOT NULL,
    display_order INT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Configuration Constraint Types (Master)
CREATE TABLE constraint_types (
    constraint_type VARCHAR(50) PRIMARY KEY,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE
);

-- Recommendation Types (Master)
CREATE TABLE recommendation_types (
    type_code VARCHAR(50) PRIMARY KEY,
    type_name VARCHAR(100) NOT NULL,
    description TEXT,
    priority INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE
);

-- Discount Reasons (Master)
CREATE TABLE discount_reasons (
    reason_code VARCHAR(50) PRIMARY KEY,
    reason_name VARCHAR(255) NOT NULL,
    requires_approval BOOLEAN DEFAULT FALSE,
    max_discount_percentage DECIMAL(5,2),
    is_active BOOLEAN DEFAULT TRUE
);
```

---

## Entity Relationships

### Key Relationships

```
Products → Product Categories (Many-to-One)
Products → Product Options (One-to-Many)
Products → Product Bundles (One-to-Many)
Products → Product Configurations (One-to-Many)
Product Bundles → Bundle Components (One-to-Many)
Product Configurations → Configuration Steps (Many-to-One)
Configuration Steps → Configuration Options (One-to-Many)
Quotes → Quote Line Items (One-to-Many)
Quote Line Items → Products (Many-to-One)
Quotes → Discounts (Many-to-Many via discount_applications)
Quotes → Approval Requests (One-to-Many)
Proposals → Proposal Sections (One-to-Many)
Proposals → Signature Requests (One-to-Many)
Proposals → Quotes (Many-to-One)
Customers → Opportunities → Quotes → Proposals (Linear flow)
Products → Recommendations → Cross-Sell Opportunities (Complex)
```

---

## API Endpoints Summary

### Product Management APIs
```
GET    /api/cpq/products
POST   /api/cpq/products
GET    /api/cpq/products/:id
PUT    /api/cpq/products/:id
DELETE /api/cpq/products/:id
GET    /api/cpq/products/categories
GET    /api/cpq/bundles
POST   /api/cpq/bundles
GET    /api/cpq/configurator/products/:id/steps
POST   /api/cpq/configurator/configure
```

### Pricing APIs
```
GET    /api/cpq/pricing/price-books
POST   /api/cpq/pricing/calculate
GET    /api/cpq/pricing/tiers
POST   /api/cpq/discounts
POST   /api/cpq/discounts/apply
GET    /api/cpq/approvals/pending
POST   /api/cpq/approvals/requests/:id/approve
```

### Guided Selling APIs
```
GET    /api/cpq/guided-selling/questionnaires
POST   /api/cpq/guided-selling/responses
GET    /api/cpq/guided-selling/recommendations/:customerId
POST   /api/cpq/guided-selling/cross-sell/opportunities
GET    /api/cpq/guided-selling/playbooks
```

### Proposal APIs
```
GET    /api/cpq/proposals
POST   /api/cpq/proposals
POST   /api/cpq/proposals/:id/send
POST   /api/cpq/proposals/:id/export-pdf
GET    /api/cpq/proposals/templates
POST   /api/cpq/signatures/requests
GET    /api/cpq/signatures/requests/:id/status
```

---

## Data Flow & Business Logic

### 1. Product Configuration Flow
```
1. User selects configurable product
2. System loads configuration steps and options
3. User makes selections for each step
4. System validates selections against rules
5. System calculates price based on selections
6. Configuration saved to database
7. Configuration can be added to quote
```

### 2. Quote to Proposal Flow
```
1. Quote created with products and pricing
2. Discounts applied (with approvals if needed)
3. Margin analysis performed
4. Quote approved through workflow
5. Proposal created from quote
6. Template applied to proposal
7. Content added from library
8. Proposal sent to customer
9. Signature requested
10. Customer signs electronically
11. Deal closed
```

### 3. Guided Selling Flow
```
1. Questionnaire presented to sales rep
2. Responses recorded for customer/opportunity
3. AI analyzes responses and generates score
4. System generates product recommendations
5. Cross-sell opportunities identified
6. Sales playbook activated
7. Rep follows playbook stages
8. Products added to quote
9. Quote converted to proposal
```

### 4. Approval Workflow
```
1. Trigger condition met (discount > threshold)
2. Approval request created
3. Workflow steps determined
4. Notifications sent to approvers
5. Approvers review and take action
6. System escalates if no response
7. Final decision recorded
8. Quote/discount status updated
```

---

## Integration Points

### CRM Integration
- Customer data sync
- Opportunity linkage
- Activity logging
- Contact management
- Pipeline updates

### ERP Integration
- Product master sync
- Pricing updates
- Inventory checks
- Order creation
- Invoice generation

### E-Signature Integration
- DocuSign API
- Adobe Sign API
- HelloSign API

### Document Generation
- PDF generation engine
- Template rendering
- Merge field population

### Email Integration
- Proposal sending
- Signature reminders
- Approval notifications

### Analytics Integration
- Usage metrics
- Performance KPIs
- Margin analysis
- Win/loss tracking

---

## Database Normalization Notes

### Third Normal Form (3NF) Compliance

**1. First Normal Form (1NF)**
- All tables have primary keys
- No repeating groups
- Atomic values only
- JSONB used only for truly variable data (rules, configurations)

**2. Second Normal Form (2NF)**
- All non-key attributes depend on entire primary key
- No partial dependencies
- Composite keys properly structured

**3. Third Normal Form (3NF)**
- No transitive dependencies
- All non-key attributes depend only on primary key
- Master tables for lookup data
- Proper foreign key relationships

### Denormalization for Performance
- Calculated fields (margin_percentage, usage_count) for reporting
- Cached analytics in separate tables
- JSONB for flexible, schema-less data (configuration_data, rule_logic)

---

## Implementation Priorities

### Phase 1: Core CPQ (MVP)
1. Product catalog
2. Basic pricing (price books)
3. Quote creation
4. Simple bundles

### Phase 2: Advanced Pricing
1. Tiered pricing
2. Discounts
3. Approval workflows
4. Margin analysis

### Phase 3: Configuration
1. Product configurator
2. Configuration rules
3. Options management
4. Validation engine

### Phase 4: Proposals
1. Proposal builder
2. Templates
3. Content library
4. E-signatures

### Phase 5: Guided Selling
1. Questionnaires
2. Recommendations
3. Cross-sell
4. Playbooks

---

## Performance Considerations

### Indexing Strategy
- Index all foreign keys
- Index frequently queried fields (status, dates)
- Composite indexes for common query patterns
- GIN indexes for JSONB fields

### Caching Strategy
- Cache product catalog
- Cache pricing rules
- Cache configuration rules
- Cache templates and content

### Scalability
- Partition large tables by date
- Archive old quotes and proposals
- Asynchronous processing for complex calculations
- Queue-based approval notifications

---

*End of CPQ Module Documentation*
