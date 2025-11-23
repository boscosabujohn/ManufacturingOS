# ManufacturingOS - B3 ERP
## Complete Feature Documentation

---

## Table of Contents

1. [Project Overview](#project-overview)
2. [Technology Stack](#technology-stack)
3. [System Architecture](#system-architecture)
4. [Module Documentation](#module-documentation)
   - [After-Sales Service](#1-after-sales-service-module)
   - [Sales](#2-sales-module)
   - [CRM](#3-crm-module)
   - [Finance](#4-finance-module)
   - [Production](#5-production-module)
   - [Inventory](#6-inventory-module)
   - [Procurement](#7-procurement-module)
   - [Human Resources](#8-human-resources-module)
   - [Quality](#9-quality-module)
   - [Logistics](#10-logistics-module)
   - [CPQ](#11-cpq-module)
   - [Estimation](#12-estimation-module)
   - [Project Management](#13-project-management-module)
   - [Workflow & Automation](#14-workflow--automation-module)
   - [Support](#15-support-module)
   - [IT Administration](#16-it-administration-module)
   - [Reports & Analytics](#17-reports--analytics-module)
5. [Common Masters](#common-masters)
6. [Cross-Module Features](#cross-module-features)
7. [Key Statistics](#key-statistics)

---

## Project Overview

**ManufacturingOS - B3 ERP** is a comprehensive, enterprise-grade Enterprise Resource Planning (ERP) system designed specifically for manufacturing organizations. The system provides end-to-end coverage of all business processes including manufacturing, sales, HR, finance, supply chain, quality management, and operations.

### Key Highlights

- **Full-stack Architecture**: Monorepo with separate Frontend (Next.js) and Backend (NestJS)
- **Scale**: 1,273+ frontend pages, 131 backend services, 109+ database entities
- **Modular Design**: 18 major functional modules
- **Real-time Capabilities**: WebSocket support for live updates
- **Multi-entity Support**: Supports multiple companies, plants, and branches

---

## Technology Stack

### Frontend Technologies

| Category | Technology | Version |
|----------|------------|---------|
| Framework | Next.js | 14.1.0 |
| UI Framework | React | 18.2.0 |
| UI Components | Radix UI | - |
| State Management | Zustand | 4.4.7 |
| Data Fetching | TanStack React Query | 5.17.19 |
| Tables | TanStack React Table | 8.11.6 |
| Forms | React Hook Form | 7.49.3 |
| Validation | Zod | - |
| Charts | Recharts | 2.10.4 |
| Styling | Tailwind CSS | 3.4.1 |
| Drag & Drop | React Beautiful DND | 13.1.1 |
| Real-time | Socket.io Client | 4.6.0 |
| PDF Generation | jsPDF | 3.0.3 |
| Barcodes | jsbarcode | 3.12.1 |
| QR Codes | QRCode | 1.5.4 |
| Excel | XLSX | 0.18.5 |
| Icons | Lucide React | 0.312.0 |
| Dates | date-fns | 3.1.0 |
| HTTP Client | Axios | 1.6.5 |
| Authentication | NextAuth | 4.24.5 |

### Backend Technologies

| Category | Technology | Version |
|----------|------------|---------|
| Framework | NestJS | 10.3.0 |
| Database | PostgreSQL | 8.11.3 |
| ORM | TypeORM | 0.3.19 |
| Authentication | Passport.js (JWT, Local) | - |
| Event System | @nestjs/event-emitter | 2.0.4 |
| Real-time | Socket.io | 4.6.0 |
| Task Queue | Bull | 4.12.0 |
| Cache | Redis | 4.6.12 |
| PDF Generation | pdfkit | 0.14.0 |
| Excel Export | exceljs | 4.4.0 |
| Email | nodemailer | 6.9.8 |
| Logging | Winston | 3.11.0 |
| Validation | class-validator | 0.14.1 |
| API Documentation | Swagger/OpenAPI | - |

---

## System Architecture

```
ManufacturingOS/
├── b3-erp/
│   ├── frontend/                 # Next.js Frontend Application
│   │   ├── src/
│   │   │   ├── app/              # 1,273+ pages/routes
│   │   │   ├── components/       # 472 React components
│   │   │   ├── lib/              # Utilities & API client
│   │   │   ├── hooks/            # Custom React hooks
│   │   │   ├── types/            # TypeScript definitions
│   │   │   ├── data/             # Mock/seed data
│   │   │   └── services/         # API service layer
│   │   └── ...
│   │
│   └── backend/                  # NestJS Backend Application
│       └── src/
│           ├── modules/          # 18 major modules
│           │   ├── after-sales/
│           │   ├── sales/
│           │   ├── crm/
│           │   ├── finance/
│           │   ├── production/
│           │   ├── inventory/
│           │   ├── procurement/
│           │   ├── hr/
│           │   ├── quality/
│           │   ├── logistics/
│           │   └── ...
│           └── database/         # Migrations
```

---

## Module Documentation

---

### 1. After-Sales Service Module

**Components**: 8 | **Backend Services**: 6

A comprehensive module for managing post-sale customer support, service delivery, and customer satisfaction.

#### Service Requests
- Create, manage, track, and resolve service tickets
- Status management: Open, In-Progress, Resolved
- SLA Dashboard with performance tracking
- Priority-based queue management

#### Installations
- Schedule and track product installations
- Calendar view for installation planning
- Pending/completed status tracking
- Installation history and details

#### Service Contracts
- Manage service agreements and terms
- Active contract monitoring
- Expiration alerts and renewal management
- Contract terms and conditions management

#### Warranties
- Active warranty tracking and management
- Warranty expiration alerts
- Claims submission and processing
- Approval workflow for warranty claims
- Claim status tracking

#### Field Service
- Mobile field technician operations
- Dispatch management and job scheduling
- GPS tracking with real-time updates
- Mobile app support for field teams

#### Service Billing
- Invoice creation for services
- Payment tracking and processing
- Pending payments management
- Service cost tracking

#### Parts Management
- Service parts inventory management
- Parts requisition workflow
- Consumption tracking
- Parts return management

#### Analytics & Reporting
- First-time-fix (FTF) analytics
- Technician performance metrics
- Dashboard analytics and reports
- Service efficiency tracking

#### Feedback & Surveys
- NPS (Net Promoter Score) tracking
- Complaints and ratings management
- Customer satisfaction surveys
- Feedback analysis

#### Knowledge Base
- FAQs and technical articles
- Product manuals and guides
- Troubleshooting documentation

---

### 2. Sales Module

**Components**: 8 | **Backend Services**: 11

End-to-end sales management from lead generation to order fulfillment.

#### Leads Management
- B2B/B2C lead generation and tracking
- Lead creation and assignment
- AI-powered lead scoring
- Lead source tracking and qualification

#### Opportunities
- Sales pipeline management
- Pipeline stage tracking
- Won/Lost analysis
- Forecast capability
- Opportunity-to-Quote conversion

#### Quotes
- Quote template management
- Quote creation and editing
- Pricing and comparison tools
- Quote-to-Order conversion workflow

#### Sales Orders
- Order creation and modification
- Status tracking: Pending, Confirmed, Delivered, Cancelled
- Order line item management
- Order history and tracking

#### Invoicing
- Invoice generation and management
- Payment tracking
- Credit notes processing
- Overdue invoice management

#### Delivery/Handover
- Delivery note creation
- Installation coordination
- Handover acceptance and approval
- Delivery confirmation

#### RFP Management
- Request for Proposal tracking
- Proposal generation and submission
- Response management

#### Analytics
- Customer analytics
- Revenue reports and trends
- Product performance metrics
- Sales targets and forecasting
- AI/ML sales pipeline forecasting

#### Approvals
- Multi-level approval routing
- Approval notifications and tracking
- Configurable approval matrix

---

### 3. CRM Module

**Components**: 14 | **Backend Services**: 2

Complete customer relationship management with 360-degree customer view.

#### Contacts Management
- Contact database with add/edit/view
- Contact lists and grouping
- Role-based contact management

#### Customers
- Customer profiles and segments
- Customer hierarchy (parent-subsidiary)
- Customer 360 view (unified data)
- Customer portal access
- Customer segmentation

#### Activities Management
- Calendar view for activities
- Calls, emails, meetings tracking
- Task management
- Activity timeline
- Collaborative notes

#### Interactions
- Customer interaction logging
- Automated logging of touch-points
- Interaction analysis and timeline

#### Contracts
- Contract lifecycle management
- Templates and amendments
- Renewal tracking
- Contract execution monitoring

#### Campaigns
- Marketing campaign creation
- Email campaign automation
- Campaign performance tracking
- Campaign templates

#### Analytics
- Customer analytics and insights
- Revenue metrics
- Sales team analytics
- Custom analytics dashboards

#### Advanced Features
- Account hierarchy visualization
- AI-powered lead scoring
- Sales automation workflows
- Collaboration intelligence
- Pipeline forecasting
- Social media integration

#### Settings & Configuration
- Approval workflows
- Assignment rules
- Field customization
- Pipeline stage configuration
- Territory management
- Team setup

---

### 4. Finance Module

**Components**: 58 | **Backend Services**: 20+

Comprehensive financial management with full accounting capabilities.

#### Chart of Accounts
- COA setup and management
- Account hierarchies and categorization
- Multi-level account structure

#### Journal Entries
- Create, edit, approve entries
- Multi-currency support
- Recurring entries

#### General Ledger
- GL reports and queries
- Trial balance generation
- Ledger analysis

#### Accounts Receivable
- Invoice management
- Customer collections
- Aging analysis
- Credit management
- Collection workflows

#### Accounts Payable
- Bill management
- Payment tracking
- Vendor aging analysis
- Payment scheduling and approval

#### Bank Reconciliation
- Bank account management
- Check reconciliation
- Bank feed integration
- Automatic matching

#### Payments
- Payment creation and tracking
- Multi-currency payments
- Payment approval workflows
- Batch payment processing

#### Financial Reports
- Profit & Loss (P&L) reports
- Balance Sheet reports
- Cash Flow statements
- Trial Balance reports
- Custom financial reporting

#### Budgeting
- Budget creation and allocation
- Budget vs. Actual analysis
- Multi-year planning
- Department budget tracking
- Variance analysis

#### Costing
- Cost centers and profit centers
- Job costing for projects
- Standard costing
- Variance analysis
- WIP (Work in Progress) accounting

#### Cash Flow Management
- Cash flow forecasting
- Anticipated payments and receipts
- Cash position analysis
- Liquidity management

#### Multi-Currency
- Exchange rate management
- Multi-currency transactions
- Currency conversion
- Realized/unrealized gains

#### Tax Management
- GST (Goods & Service Tax)
- TDS (Tax Deducted at Source)
- Tax report generation
- Tax compliance

#### Fixed Assets
- Asset registration
- Depreciation management
- Asset disposal tracking
- Asset lifecycle management

#### Consolidation
- Multi-entity consolidation
- Intercompany elimination
- Consolidated reporting

#### Financial Analytics
- KPI dashboards
- Ratio analysis
- Profitability analysis
- Trend analysis

#### Period Operations
- Period/Month closing
- Year-end closing procedures
- Period lock and unlock

#### Automation & Controls
- Recurring transactions
- Workflow automation
- Approval workflows
- Audit trails
- Document management

---

### 5. Production Module

**Components**: 28 | **Backend Services**: 12+

Complete manufacturing execution and planning system.

#### Work Orders
- Work order creation and tracking
- Status: Pending, In-Progress, Completed
- Scheduling and assignment
- Real-time progress tracking
- Resource allocation

#### Bill of Materials (BOM)
- Multi-level BOM support
- BOM costing and variance analysis
- Version control
- BOM comparison and validation

#### Routing
- Operation sequence setup
- Resource allocation per operation
- Operation time tracking
- Alternative routings

#### Work Centers
- Work center master management
- Capacity planning and scheduling
- Resource allocation
- Efficiency tracking

#### MRP (Material Requirements Planning)
- MRP run execution
- Planned order generation
- Requirements calculation
- Shortage identification and reporting
- Action messages

#### Demand Forecasting
- Demand forecast generation
- Forecast accuracy tracking
- S&OP integration
- Historical analysis

#### Production Scheduling
- Gantt chart scheduling
- Schedule optimization
- Resource sequencing
- Capacity leveling
- Finite scheduling

#### Maintenance
- Preventive maintenance scheduling
- Maintenance requests and tracking
- History and analysis
- RCA (Root Cause Analysis)
- Spare parts management

#### Downtime Management
- Downtime logging and tracking
- Downtime analysis and RCA
- Event tracking
- Export capabilities

#### Quality Control
- Quality inspections
- NCR management
- Quality plan execution
- Performance reports

#### Shop Floor Control
- Real-time tracking
- Operator interfaces
- Production status updates
- Material management

#### Analytics
- OEE (Overall Equipment Effectiveness)
- Productivity metrics
- Efficiency analysis
- Variance reports

#### Capacity Planning
- Capacity analysis
- Bottleneck identification
- Load balancing

#### Traceability
- Batch/Lot traceability
- Serial number tracking
- Quality trace-back

---

### 6. Inventory Module

**Components**: 16 | **Backend Services**: 12+

Complete inventory and warehouse management.

#### Stock Management
- Stock level monitoring
- Low stock alerts
- Stock aging reports
- Stock valuation methods

#### Stock Transactions
- Stock receipt, issue, transfer
- Entry creation and tracking
- Inter-location transfers
- Transfer approval workflow

#### Stock Balance
- Real-time balance tracking
- Multi-location balance view
- Balance aging analysis

#### Stock Adjustment
- Quantity and value adjustments
- Write-off management
- Adjustment reasons and approvals

#### Cycle Count
- Cycle count planning and execution
- Physical count reconciliation
- Variance investigation

#### Serial Number Tracking
- Serial number assignment
- Cross-transaction tracking
- Serial retirement

#### Batch/Lot Management
- Batch number assignment
- Batch traceability
- Expiry tracking and alerts
- Batch costing

#### Storage Location Management
- Warehouse/location master
- Location hierarchy (Zone > Bin > Rack)
- Capacity tracking
- Assignment policies

#### Putaway Strategy
- Automated putaway suggestions
- Putaway rule management
- Directive allocation

#### VED Analysis
- Vital, Essential, Desirable classification
- Classification-based policies

#### Kitting/Disassembly
- Kit assembly management
- Disassembly operations
- Kit costing

#### Replenishment
- Min-Max replenishment rules
- Auto-replenishment suggestions
- Reorder point calculation

#### Optimization
- ABC analysis
- Demand forecasting integration
- Inventory optimization
- Turnover analysis

#### Analytics
- Dead stock identification
- Carrying cost analysis
- Velocity analysis
- Custom inventory reports

---

### 7. Procurement Module

**Components**: 57 | **Backend Services**: 13+

End-to-end procurement and supplier management.

#### Purchase Requisitions
- Requisition creation and approval
- Requisition to PO conversion
- Bulk requisition management

#### RFQ (Request for Quotation)
- RFQ creation and distribution
- Comparison and analysis
- Vendor quotation management

#### Purchase Orders
- PO creation, editing, approval
- Status tracking
- Receipt and matching
- Amendment and cancellation

#### Goods Receipt
- GRN creation
- Receipt inspection
- Quality inspection
- Approval workflow

#### Invoice Management
- Purchase invoice matching
- 3-way matching (PO-GRN-Invoice)
- Approval and payment

#### Purchase Returns
- Return authorization
- Credit note processing
- Quality inspection

#### Vendor Management
- Vendor master setup
- Categorization
- Onboarding workflow
- Portal access
- Contact management

#### Vendor Evaluation
- Scorecard tracking
- Performance metrics
- Compliance tracking
- Audit management

#### Contract Management
- Purchase contracts
- Terms and conditions
- Amendments and renewals
- Blanket agreements

#### Strategic Sourcing
- Supplier relationship management
- Diversity programs
- Strategic analysis

#### Compliance
- Quality assurance
- Compliance tracking
- Regulatory requirements
- Audit trails

#### Budget Tracking
- Allocation and tracking
- Spend tracking
- Forecasting

#### Spend Analysis
- Category, vendor, location analysis
- Trend analysis
- Savings tracking
- Cost reduction reporting

#### Approval Workflows
- Multi-level approvals
- Approval matrix setup
- Routing and notifications

#### Risk Management
- Risk identification
- Mitigation planning
- Supplier risk assessment

---

### 8. Human Resources Module

**Components**: 27 | **Backend Services**: 18+

Comprehensive HR management system covering the complete employee lifecycle.

#### Employee Management
- Employee directory with filters
- Profiles and personal information
- Organizational hierarchy
- Department and team management
- Designation master

#### Onboarding Workflow
- Offer letter management
- Pre-boarding activities
- First-day setup checklist
- Induction (HR, Department)
- Medical check-ups
- Access provisioning
- IT setup and ID card generation
- Document uploads
- Welcome kit distribution
- Policy acknowledgment
- Training assignment

#### Probation Management
- Probation period tracking
- Confirmation process
- Performance reviews
- Feedback collection
- Extension management

#### Attendance Management
- Daily punch entry (login/logout)
- Bulk punch management
- Attendance reports
- Shift tracking

#### Leave Management
- Leave policy and type setup
- Application and approval workflow
- Balance tracking
- Team calendar view
- Leave encashment
- Reports and analytics

#### Overtime Management
- Overtime requests and approvals
- Comp-off management
- Reports and analytics
- Policy settings

#### Payroll (20+ pages)

**Salary Structure**
- Component setup
- Deduction management

**Salary Processing**
- Payslip generation
- Batch payroll processing
- Disbursement tracking

**Payroll Reports**
- Payslip reports
- Register reports
- Department cost reports
- Bank transfer reports

**Bonus Management**
- Scheme setup
- Performance and annual bonus
- Bonus processing

**Advances & Loans**
- Advance requests and approvals
- Recovery tracking
- Loan EMI management

**Increments**
- Annual and performance increments
- Increment letters
- Arrears management

**Tax Management**
- TDS calculation
- Tax declarations
- Form 16 generation

**Statutory Compliance**
- PF (Provident Fund)
- ESI (Employee State Insurance)
- PT (Professional Tax)

#### Performance Management (15+ pages)
- Goals and objectives setting
- KPI assignment and tracking
- Self, manager, and peer reviews
- 360-degree feedback
- PIP (Performance Improvement Plan)
- Recognition programs
- Performance analytics

#### Training & Development (15+ pages)
- Training program catalog
- External training management
- E-learning library
- Certifications
- Budget and cost tracking
- Effectiveness assessment
- Skills gap analysis
- Skills matrix

#### Travel Management (15+ pages)
- Travel requests and approvals
- Advance requests
- Flight, hotel, cab bookings
- Expense submission
- Travel card management

#### Reimbursement
- Request submission
- Approval workflow
- Payment processing
- Settlement tracking

#### Documents Management
- Document repository
- Categories: Personal, Education, Employment, Insurance, Statutory
- Archive management
- Certificate management

#### Separation/Offboarding (12+ pages)
- Resignation management
- Notice period tracking
- Exit interviews
- Clearance management (HR, IT, Finance, Asset)
- F&F Settlement
- Documentation

#### Safety & Wellness (20+ pages)
- Safety audits and inspections
- Incident management
- Emergency management
- Risk management
- PPE Management
- Safety training
- Occupational health
- Wellness programs

#### Shift Management
- Shift master setup
- Shift assignment
- Roster management
- Shift swaps

#### Succession Planning (12+ pages)
- Position identification
- Talent profiles
- Readiness assessment
- Bench strength analysis
- Development programs
- Analytics and reports

#### Timesheet Management (6+ pages)
- Daily timesheet entry
- Project hour tracking
- Approval workflows
- Reports and analytics

---

### 9. Quality Module

**Components**: 4 | **Backend Services**: 10+

Quality control and assurance management.

#### Quality Control (QC)
- QC template master
- QC parameter master
- Inspection execution
- Results recording

#### Audits
- Audit plan scheduling
- Findings documentation
- Audit tracking
- Compliance verification

#### Non-Conformance
- NCR creation and investigation
- NCR closure workflow
- Root cause analysis

#### CAPA
- Corrective action planning
- Preventive action planning
- Implementation tracking
- Effectiveness verification

#### Quality Alerts
- Alert creation
- Escalation management
- Resolution tracking

---

### 10. Logistics Module

**Components**: 15 | **Backend Services**: 13+

Complete transportation and distribution management.

#### Shipping Operations
- Outbound/inbound shipping
- Shipping creation and tracking
- Schedule management
- Loading operations

#### Shipment Management
- Creation and tracking
- Status monitoring
- Multiple shipment types

#### Tracking & Tracing
- Real-time GPS tracking
- Status tracking
- Exception handling
- Proof of Delivery (POD)

#### Delivery Notes
- Note creation
- Delivery confirmation
- Documentation

#### Route Management
- Route planning and optimization
- Route master maintenance
- Route assignment
- Trip planning

#### Trip Management
- Trip creation and scheduling
- Trip tracking
- Trip completion

#### Driver Management
- Driver master
- Assignments
- Compliance tracking
- Performance metrics

#### Fleet Management
- Vehicle master
- Maintenance tracking
- Fuel management
- Fleet utilization analytics
- GPS tracking

#### Carrier Management
- Carrier/Transporter master
- Contracts and rate cards
- Performance tracking

#### Freight Management
- Charge calculation
- Invoicing and quotation
- Booking and audit

#### Consolidation
- Consolidation planning
- Multi-shipment consolidation

#### Returns Management
- Return shipments
- Return tracking
- Reverse logistics

#### Warehouse Operations
- Dock management
- Cross-dock operations
- Yard management

#### Analytics
- Delivery analytics
- Optimization analytics
- Spend analytics
- Custom reports

---

### 11. CPQ Module

**Components**: 41

Configure, Price, Quote system for complex product configuration.

#### Products
- Product catalog
- Bundles and configurator
- Options and variants
- Compatibility rules

#### Quotes
- Quote creation and templates
- Versioning
- Approvals
- Quote-to-Order conversion

#### Pricing
- Dynamic pricing engine
- Volume-based pricing
- Customer-specific pricing
- Promotional pricing
- Contract pricing

#### Guided Selling
- Sales playbooks
- Questionnaire-based selling
- Cross-sell recommendations

#### Proposals
- Proposal builder
- Templates
- Content management
- Digital signature

#### Contracts
- Templates and generation
- Clauses management
- Execution tracking
- Approval workflow

#### Analytics
- Quote and pricing analytics
- Product analytics
- Win rate analysis
- Sales cycle analysis

---

### 12. Estimation Module

**Components**: 9 | **Backend Services**: 1

Project estimation and costing management.

#### Quotes/Estimates
- Quote creation and templates
- Status: Draft, Pending, Approved, Rejected, Converted
- Quote-to-Order conversion

#### Bill of Quantities (BOQ)
- BOQ creation and editing
- Templates
- Comparison and analysis

#### Costing
- Material, labor, equipment costing
- Overhead allocation
- Cost breakdown analysis
- Cost templates

#### Pricing
- Competitive pricing analysis
- Markup calculation
- Margin management

#### Rates Management
- Material and labor rates
- Equipment rates
- Subcontractor rates
- Rate history

#### Analytics
- Win/loss analysis
- Estimation accuracy
- Performance analytics

---

### 13. Project Management Module

**Components**: 33

Complete project lifecycle management.

#### Project Planning
- Project creation and setup
- Charter and scope (WBS)
- Schedule planning (Gantt)
- Milestone planning

#### Project Execution
- Task management
- Kanban board view
- Issues tracking
- Change order management

#### Resource Management
- Resource allocation
- Calendar and availability
- Team composition
- Utilization tracking

#### Financial Management
- Project budgeting
- Cost tracking
- Profitability analysis
- Variance analysis

#### Quality Management
- Inspection plans
- Checkpoints
- Defect tracking

#### Delivery & Commissioning
- Installation tracking
- Site issues
- Customer acceptance
- Commissioning procedures
- Project handover

#### Material & Labor
- Material consumption tracking
- Material planning
- Labor hour tracking
- Timesheet integration

#### Documentation
- Project documents
- Drawing management
- Material reports

#### Analytics & Reporting
- Project dashboard
- Progress reports
- Earned value analysis
- Profitability metrics

---

### 14. Workflow & Automation Module

**Components**: 9 | **Backend Services**: 11+

Central workflow and automation engine powering cross-module business processes.

#### Core Backend Services
- **Event Bus Service** - Central event processing and distribution
- **Email Gateway Service** - Automated email notifications and communications
- **Notification Service** - Multi-channel notification delivery (email, in-app, SMS)
- **Intelligent Routing Service** - Smart workflow routing based on rules and conditions
- **Parallel Approval Service** - Multiple concurrent approvers with configurable logic
- **Order Tracking Service** - Cross-module order status tracking
- **Workflow Repository Service** - Reusable workflow definition management
- **Workflow Seeder Service** - Template initialization and setup

#### Business Process Workflows
- **Sales-Production Workflow** - End-to-end sales order to production integration
- **Procurement-Inventory Workflow** - Purchase to inventory receipt automation
- **Approval Workflow Automation** - Multi-level approval routing
- **Escalation Management** - Automatic escalation on SLA breach

#### Workflow Designer Components
- **Orchestration Engine** - Visual workflow orchestration and management
- **Conditional Branching** - If/else logic and decision nodes
- **Version Control** - Workflow versioning and history
- **Error Handling** - Exception handling and retry logic
- **Testing Sandbox** - Test workflows before deployment
- **Execution Logs** - Detailed workflow execution history
- **KPI Monitoring** - Workflow performance metrics and dashboards
- **Integration Catalog** - Pre-built integrations with external systems

#### Workflow Entities
- Workflow Definition - Workflow templates and schemas
- Workflow Instance - Running workflow instances
- Workflow Step - Individual workflow steps/nodes
- Workflow History - Execution audit trail
- Order Tracking - Cross-module order status

#### Configuration & Management
- Workflow repository for reusable definitions
- Workflow templates and versioning
- Custom trigger configuration
- Action and condition setup
- Variable and context management

---

### 15. Support Module

**Components**: 8 | **Backend Services**: 2

Customer support and ticketing system.

#### Ticket Management
- Ticket creation and tracking
- Assignment and routing
- Status management
- Priority handling

#### SLA Tracking
- SLA configuration
- Compliance tracking
- Escalation on breach
- Performance metrics

---

### 16. IT Administration Module

System configuration and administration.

#### Users Management
- User creation and management
- Active/inactive status
- Bulk operations
- User groups

#### Roles & Permissions
- Role creation and hierarchy
- Permission management
- Role-based access
- Policy configuration

#### Security
- Password management
- Two-factor authentication (2FA)
- IP whitelist
- Session management
- Security alerts

#### Audit & Compliance
- Login audit trail
- Change tracking
- Compliance reports
- System audit logs

#### System Configuration
- Company information
- Email configuration
- Integration settings
- Notification settings

#### Monitoring
- System health
- Performance monitoring
- Error tracking

#### Database Management
- Backup management
- Data export/import
- Data cleanup

#### Scheduler & Automation
- Scheduled jobs
- Automation execution
- Job history

#### Customization
- Field customization
- Workflow customization
- Template management
- Branding configuration

#### License Management
- License tracking
- Feature licenses
- User allocation
- Utilization reporting

---

### 17. Reports & Analytics Module

**Components**: 8 | **Backend Services**: 1+

Enterprise reporting and business intelligence.

#### Report Builder
- Custom report creation
- Pre-built templates
- Drag-and-drop designer

#### Standard Reports
- Financial: P&L, Balance Sheet, Cash Flow
- HR: Employee, attendance, payroll
- Sales: Revenue, customer, product
- Procurement: Spend, vendor, order
- Production: OEE, efficiency, variance
- Inventory: Stock, aging, turnover

#### Dashboards
- Interactive KPI dashboards
- Real-time data visualization
- Drill-through analysis

#### Analytics
- Advanced analytics
- Self-service BI
- ML forecasting
- KPI alerts
- Role-based insights

#### Export & Distribution
- Multi-format export (PDF, Excel)
- Scheduled distribution
- Email reports

---

## Common Masters

The system includes 56 master data records for essential setup and configuration:

### Organization Masters
- Company Master
- Plant Master
- Branch Master
- Department Master
- Location Master

### People Masters
- Employee Master
- Customer Master
- Vendor/Supplier Master
- User Master

### Product Masters
- Item Master
- Item Category Master
- Item Group Master
- Brand Master
- Material Grade Master

### Measurement & Pricing
- UOM Master
- UOM Conversion Master
- Price List Master
- Currency Master
- Exchange Rate Master

### Accounting Masters
- Chart of Accounts Master
- Cost Center Master
- Bank Master
- Tax Master
- HSN/SAC Master
- Payment Terms Master

### Location Masters
- Warehouse Master
- City Master
- State Master
- Country Master
- Territory Master

### Manufacturing Masters
- Work Center Master
- Operation Master
- Routing Master
- Machine Master
- Tool Master
- Batch/Lot Master

### HR Masters
- Designation Master
- Skill Master
- Shift Master
- Holiday Master
- Role Master

### Quality Masters
- Quality Parameter Master

### Document Masters
- Document Type Master
- Number Series Master
- Barcode Master

### Product-Specific Masters
- Kitchen Layout Master
- Cabinet Type Master
- Hardware Master
- Counter Material Master
- Appliance Master
- Installation Type Master
- Finish Master
- Grade Master

### Classification Masters
- Vendor Category Master
- Customer Category Master

---

## Cross-Module Features

### Authentication & Authorization
- NextAuth integration for frontend
- Passport.js with JWT for backend
- Role-based access control (RBAC)
- Multi-level permissions

### Real-time Capabilities
- WebSocket support via Socket.io
- Live notifications
- Real-time dashboard updates
- Collaborative features

### Document Management
- File upload and storage
- Document categorization
- Version control
- Archive management

### Data Operations
- Bulk imports and exports
- Batch processing
- Data validation
- Error handling

### Export Capabilities
- Excel export (XLSX)
- PDF generation (jsPDF, pdfkit)
- CSV export
- Custom report formats

### Barcode & QR Support
- Barcode generation (jsbarcode)
- QR code generation
- Scanning support
- Label printing

### Audit & Compliance
- Complete audit trails
- Change history tracking
- User activity logging
- Compliance reporting

### Multi-Entity Support
- Multiple companies
- Multiple plants
- Multiple branches
- Multi-currency

### UI Components (29 reusable components)
- Data tables with sorting/filtering/pagination
- Modal dialogs
- Forms with validation
- Charts and visualizations
- Timeline views
- Kanban boards
- Gantt charts
- Tree views
- Step wizards
- Navigation components

---

## Key Statistics

| Metric | Count |
|--------|-------|
| Frontend Pages/Routes | 1,273+ |
| Backend Services | 131 |
| Database Entities | 109+ |
| UI Components | 472 |
| Backend Controllers | 89 |
| Major Modules | 18 |
| Master Data Records | 56 |
| Cross-Module Features | 14+ |

---

## Deployment

The project supports multiple deployment options:

- **Docker Support**: Dockerfile and docker-compose.yml included
- **Platform Support**: Windows, Linux, macOS
- **Database**: PostgreSQL with TypeORM migrations
- **Configuration**: Environment-based via .env files
- **Caching**: Redis for performance optimization
- **Queue**: Bull for background job processing

---

## Getting Started

### Prerequisites
- Node.js (LTS version)
- PostgreSQL
- Redis
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>

# Install frontend dependencies
cd b3-erp/frontend
npm install

# Install backend dependencies
cd ../backend
npm install

# Set up environment variables
cp .env.example .env

# Run database migrations
npm run migration:run

# Start the development servers
# Frontend
cd frontend && npm run dev

# Backend
cd backend && npm run start:dev
```

---

## License

This software is proprietary. All rights reserved.

---

## Contact

For support or inquiries, please contact the B3 ERP team.

---

*Documentation generated on 2025-11-23*
*ManufacturingOS - B3 ERP v1.0*
