# HR Modules - Comprehensive Implementation Plan (UI/UX Focus)

## Overview
This plan outlines the phased implementation of 316 HR module pages across 18 major categories. We'll start with Common Masters to create foundational mock data that can be referenced across all other modules.

---

## PHASE 1: COMMON MASTERS (Priority: HIGHEST)
**Duration: Week 1-2 | Pages: 24**

These masters provide foundational data for all other HR modules.

### 1.1 Location & Geography Masters
```
✓ /common-masters/country-master
  - List view with search, sort, filter
  - Form: Country Name, Code, Currency, Dial Code, Flag
  - Mock: 10-15 countries

✓ /common-masters/state-master
  - List view with country filter
  - Form: State Name, Code, Country, Zone
  - Mock: 30+ states (India + others)

✓ /common-masters/city-master
  - List view with state/country cascading filter
  - Form: City Name, Code, State, Country, Tier
  - Mock: 50+ major cities

✓ /common-masters/territory-master
  - List view with hierarchy view
  - Form: Territory Name, Type, Parent Territory, Regions
  - Mock: 20+ territories
```

### 1.2 Organization Masters
```
✓ /common-masters/designation-master
  - List view with hierarchy
  - Form: Designation, Level, Department, Grade
  - Mock: 25+ designations (CEO to Trainee)

✓ /common-masters/role-master
  - List view with permissions preview
  - Form: Role Name, Description, Permissions Matrix
  - Mock: 15+ roles (Admin, Manager, Employee, etc.)

✓ /common-masters/user-master
  - List view with status filters
  - Form: Name, Email, Role, Department, Status
  - Mock: 30+ users across departments
```

### 1.3 Financial Masters
```
✓ /common-masters/currency-master
  - List view with exchange rate preview
  - Form: Currency Code, Symbol, Name, Decimals
  - Mock: 10 major currencies

✓ /common-masters/exchange-rate-master
  - List view with date range filter
  - Form: From/To Currency, Rate, Date, Auto-update toggle
  - Mock: Historical rates for major pairs

✓ /common-masters/bank-master
  - List view with bank type filter
  - Form: Bank Name, Code, Branch, IFSC, SWIFT
  - Mock: 15+ banks with multiple branches

✓ /common-masters/payment-terms-master
  - List view with credit days sort
  - Form: Term Name, Credit Days, Discount %, Due On
  - Mock: 10+ payment terms (Net 30, Net 45, etc.)
```

### 1.4 Document & Compliance Masters
```
✓ /common-masters/document-type-master
  - List view with category grouping
  - Form: Type Name, Category, Mandatory, Expiry Tracking
  - Mock: 30+ document types (Aadhaar, PAN, Passport, etc.)

✓ /common-masters/holiday-master
  - Calendar view + List view
  - Form: Holiday Name, Date, Type, Locations, Optional/Mandatory
  - Mock: 2025 holiday calendar (National + Regional)

✓ /common-masters/hsn-sac-master
  - List view with search
  - Form: HSN/SAC Code, Description, GST Rate, Category
  - Mock: 20+ common codes
```

### 1.5 Inventory & Production Masters
```
✓ /common-masters/item-group-master
  - Tree view hierarchy
  - Form: Group Name, Parent Group, Type, Attributes
  - Mock: 15+ groups (IT Assets, Furniture, Stationery, etc.)

✓ /common-masters/uom-conversion-master
  - List view with conversion calculator
  - Form: From UOM, To UOM, Conversion Factor
  - Mock: 20+ conversions

✓ /common-masters/machine-master
  - List view with status
  - Form: Machine Name, Code, Type, Location, Status
  - Mock: 15+ machines

✓ /common-masters/operation-master
  - List view with workflow view
  - Form: Operation Name, Code, Type, Standard Time
  - Mock: 20+ operations

✓ /common-masters/tool-master
  - List view with availability
  - Form: Tool Name, Code, Type, Location, Quantity
  - Mock: 25+ tools
```

### 1.6 Sales & Pricing Masters
```
✓ /common-masters/customer-category-master
  - List view with discount preview
  - Form: Category Name, Discount %, Credit Limit, Payment Terms
  - Mock: 10+ categories (Retail, Wholesale, VIP, etc.)

✓ /common-masters/vendor-category-master
  - List view with rating
  - Form: Category Name, Rating Criteria, Payment Terms
  - Mock: 10+ categories (Raw Material, Services, etc.)

✓ /common-masters/price-list-master
  - List view with validity filter
  - Form: Price List Name, Currency, Valid From/To, Items
  - Mock: 5+ price lists

✓ /common-masters/number-series-master
  - List view by module
  - Form: Prefix, Starting Number, Current Number, Padding
  - Mock: Number series for all modules
```

### 1.7 Tracking Masters
```
✓ /common-masters/barcode-master
  - List view with generator
  - Form: Barcode Type, Pattern, Auto-generate rules
  - Mock: Barcode templates for assets, products
```

**Phase 1 Deliverables:**
- 24 fully functional master data pages
- Comprehensive mock data for all masters
- Reusable components (DataTable, Form, Modal, etc.)
- Consistent UI patterns established

---

## PHASE 2: LEAVE MANAGEMENT (Priority: HIGH)
**Duration: Week 3 | Pages: 15**

### 2.1 Leave Configuration
```
✓ /hr/leave/types
  - List view with leave type cards
  - Form: Type, Max Days, Carry Forward, Encashable, Color
  - Mock: 8+ types (Sick, Casual, Earned, etc.)
  - Dependencies: designation-master, role-master

✓ /hr/leave/policies
  - List view with policy details
  - Form: Policy Name, Leave Types, Accrual Rules, Restrictions
  - Mock: 5+ policies for different employee categories
```

### 2.2 Leave Balances
```
✓ /hr/leave/balance/my
  - Dashboard with leave type cards
  - Charts: Usage trends, monthly breakdown
  - Quick apply button

✓ /hr/leave/balance/team
  - Team calendar view
  - Filter by leave type, date range
  - Export to PDF/Excel

✓ /hr/leave/balance/department
  - Department-wise summary table
  - Drill-down to employee level
  - Visual heat map
```

### 2.3 Leave Application & Approval
```
✓ /hr/leave/status (Apply Leave)
  - Multi-step form wizard
  - Calendar picker with team availability
  - File attachment for documents
  - Real-time balance check

✓ /hr/leave/approvals
  - Kanban board (Pending/Approved/Rejected)
  - Quick action buttons
  - Bulk approval
  - Comment thread

✓ /hr/leave/history
  - Timeline view + Table view
  - Filter: Date range, Type, Status
  - Export functionality
```

### 2.4 Leave Encashment
```
✓ /hr/leave/encashment/requests
  - Form with eligible leaves calculation
  - Approval workflow preview
  - Dependencies: payroll components

✓ /hr/leave/encashment/approval
  - Approval queue with filters
  - Financial impact preview
  - Batch processing

✓ /hr/leave/encashment/history
  - Transaction history table
  - Payment status tracking
```

### 2.5 Leave Reports & Analytics
```
✓ /hr/leave/team-calendar
  - Monthly calendar with team leaves
  - Color-coded by leave type
  - Filter by team/department
  - Who's Out Today widget

✓ /hr/leave/reports/summary
  - Executive dashboard
  - KPIs: Avg leaves, Peak months, Utilization %
  - Trend charts

✓ /hr/leave/reports/department
  - Department comparison charts
  - Leave pattern analysis
  - Export reports

✓ /hr/leave/reports/analytics
  - Advanced analytics with filters
  - Predictive analytics for leave patterns
  - Downloadable reports
```

**Phase 2 Deliverables:**
- Complete leave management system
- Calendar components
- Approval workflow UI
- Interactive dashboards

---

## PHASE 3: DOCUMENTS MANAGEMENT (Priority: HIGH)
**Duration: Week 4 | Pages: 26**

### 3.1 Document Repository
```
✓ /hr/documents/repository/browse
  - Folder tree navigation
  - Grid/List view toggle
  - File preview panel
  - Dependencies: document-type-master

✓ /hr/documents/repository/upload
  - Drag & drop upload
  - Bulk upload with metadata
  - Progress tracker
  - OCR integration (UI mockup)

✓ /hr/documents/repository/search
  - Advanced search filters
  - Full-text search results
  - Recent searches
  - Save search queries

✓ /hr/documents/repository/archive
  - Archived documents table
  - Restore functionality
  - Auto-archive rules setup
```

### 3.2 Employee Documents
```
✓ /hr/documents/personal
  - Document checklist by employee
  - Upload/Download/Preview
  - Version history
  - Dependencies: user-master

✓ /hr/documents/education
  - Education certificate manager
  - Verification status tracking
  - Timeline view

✓ /hr/documents/employment
  - Previous employment documents
  - Reference letters
  - Experience certificates

✓ /hr/documents/statutory
  - PAN, Aadhaar, PF, ESI
  - Verification status
  - Expiry alerts

✓ /hr/documents/insurance
  - Insurance documents
  - Nominee details
  - Claim history

✓ /hr/documents/nominations
  - Nominee forms
  - PF, Gratuity nominations
  - Update requests

✓ /hr/documents/declarations
  - Tax declarations
  - Form 12BB, HRA proofs
  - Annual submission
```

### 3.3 Policy Documents
```
✓ /hr/documents/policies/handbook
  - Employee handbook viewer
  - Version control
  - Acknowledgment tracking

✓ /hr/documents/policies/attendance
  - Attendance policy document
  - SOP downloads

✓ /hr/documents/policies/leave
  - Leave policy viewer
  - Rules & regulations

✓ /hr/documents/policies/expense
  - Expense policy & limits
  - Claim procedures

✓ /hr/documents/policies/conduct
  - Code of conduct
  - Ethics guidelines

✓ /hr/documents/policies/other
  - Miscellaneous policies
  - Department-specific SOPs
```

### 3.4 Certificates
```
✓ /hr/documents/certificates/employment
  - Employment certificate generator
  - Template customization
  - Digital signatures

✓ /hr/documents/certificates/experience
  - Experience certificate requests
  - Approval workflow
  - Download/Email

✓ /hr/documents/certificates/salary
  - Salary certificate generator
  - For visa, loans, etc.

✓ /hr/documents/certificates/status
  - Certificate request tracker
  - Status updates
```

### 3.5 Compliance Documents
```
✓ /hr/documents/compliance/audit
  - Compliance audit trail
  - Document verification logs

✓ /hr/documents/compliance/missing
  - Missing documents dashboard
  - Employee-wise checklist
  - Reminder system

✓ /hr/documents/compliance/expired
  - Expired documents alerts
  - Renewal tracking

✓ /hr/documents/compliance/renewals
  - Upcoming renewals calendar
  - Automated reminders
```

### 3.6 Upload Center
```
✓ /hr/documents/upload
  - Centralized upload interface
  - Category selection
  - Metadata tagging
```

**Phase 3 Deliverables:**
- Document management system
- File upload/preview components
- Search & filter functionality
- Compliance tracking

---

## PHASE 4: ONBOARDING (Priority: HIGH)
**Duration: Week 5 | Pages: 13**

### 4.1 Pre-Joining
```
✓ /hr/onboarding/offers
  - Offer letter dashboard
  - Generate/Send/Track
  - Acceptance status
  - Dependencies: designation-master, user-master

✓ /hr/onboarding/documents
  - Pre-joining document collection
  - Checklist tracker
  - Upload portal for candidates

✓ /hr/onboarding/verification
  - Background verification tracker
  - Vendor integration (UI)
  - Status updates
```

### 4.2 First Day Experience
```
✓ /hr/onboarding/welcome-kit
  - Welcome kit checklist
  - Asset assignment preview
  - Delivery tracking

✓ /hr/onboarding/first-day
  - First day schedule
  - Buddy assignment
  - Orientation checklist

✓ /hr/onboarding/id-card
  - ID card generation
  - Photo upload
  - Approval & printing

✓ /hr/onboarding/access
  - System access requests
  - Email, software, building access
  - IT ticketing integration
```

### 4.3 Onboarding Process
```
✓ /hr/onboarding/checklist
  - Master onboarding checklist
  - Multi-stakeholder tasks
  - Progress tracking
  - Dependencies: role-master

✓ /hr/onboarding/policies
  - Policy acknowledgment
  - Digital signature
  - Handbook acceptance

✓ /hr/onboarding/medical
  - Medical examination tracking
  - Fitness certificate
  - Health records
```

### 4.4 Induction Programs
```
✓ /hr/onboarding/induction/hr
  - HR induction schedule
  - Topics covered
  - Feedback form

✓ /hr/onboarding/induction/department
  - Department-specific induction
  - Team introduction
  - Role training
```

### 4.5 Training
```
✓ /hr/onboarding/training
  - Onboarding training programs
  - Enrollment & attendance
  - Certification tracking
```

**Phase 4 Deliverables:**
- Complete onboarding workflow
- Checklist components
- Document collection UI
- Progress tracking dashboards

---

## PHASE 5: ASSETS MANAGEMENT (Priority: MEDIUM)
**Duration: Week 6-7 | Pages: 28**

### 5.1 Asset Inventory
```
✓ /hr/assets/inventory/stock
  - Asset inventory dashboard
  - Stock levels by category
  - Low stock alerts
  - Dependencies: item-group-master, barcode-master

✓ /hr/assets/inventory/allocation
  - Allocated vs Available view
  - Employee-wise allocation
  - Department summary

✓ /hr/assets/inventory/requests
  - Asset request form
  - Approval workflow
  - Fulfillment tracking

✓ /hr/assets/inventory/audit
  - Asset audit scheduler
  - Reconciliation interface
  - Discrepancy reporting
```

### 5.2 IT Assets
```
✓ /hr/assets/it/laptops
  - Laptop inventory
  - Specifications, Serial numbers
  - Assignment history
  - Dependencies: user-master

✓ /hr/assets/it/desktops
  - Desktop inventory
  - Configuration tracking
  - Location mapping

✓ /hr/assets/it/mobiles
  - Mobile device inventory
  - IMEI tracking
  - SIM card management

✓ /hr/assets/it/monitors
  - Monitor inventory
  - Size, resolution tracking
  - Multi-monitor setups

✓ /hr/assets/it/accessories
  - Accessories inventory
  - Mouse, keyboard, headsets
  - Bulk issuance
```

### 5.3 Office Assets
```
✓ /hr/assets/office/furniture
  - Furniture inventory
  - Location mapping
  - Condition tracking

✓ /hr/assets/office/stationery
  - Stationery stock
  - Request & issuance
  - Monthly consumption

✓ /hr/assets/office/id-cards
  - ID card inventory
  - Issuance tracking
  - Replacement requests

✓ /hr/assets/office/access-cards
  - Access card management
  - Access levels
  - Lost/Damaged tracking
```

### 5.4 Vehicles
```
✓ /hr/assets/vehicles/list
  - Vehicle fleet dashboard
  - Registration details
  - Insurance tracking
  - Dependencies: user-master

✓ /hr/assets/vehicles/assignment
  - Vehicle assignment
  - Driver allocation
  - Trip scheduling

✓ /hr/assets/vehicles/fuel
  - Fuel consumption tracking
  - Expense logs
  - Mileage analysis
```

### 5.5 Asset Transactions
```
✓ /hr/assets/requests
  - Asset request dashboard
  - New requests form
  - Approval queue

✓ /hr/assets/transfer
  - Inter-employee transfers
  - Location transfers
  - Transfer history

✓ /hr/assets/return
  - Asset return form
  - Condition assessment
  - Clearance process
```

### 5.6 Maintenance
```
✓ /hr/assets/maintenance/requests
  - Maintenance request form
  - Priority levels
  - Vendor assignment

✓ /hr/assets/maintenance/preventive
  - Preventive maintenance schedule
  - Checklist templates
  - Completion tracking

✓ /hr/assets/maintenance/amc
  - AMC contracts dashboard
  - Vendor details
  - Renewal alerts

✓ /hr/assets/maintenance/history
  - Maintenance history log
  - Cost tracking
  - Downtime analysis
```

### 5.7 Asset Reports
```
✓ /hr/assets/reports/register
  - Asset register report
  - Complete asset listing
  - Export to Excel

✓ /hr/assets/reports/employee
  - Employee-wise asset report
  - Allocation details
  - Accountability tracking

✓ /hr/assets/reports/department
  - Department-wise reports
  - Cost center allocation
  - Utilization metrics

✓ /hr/assets/reports/allocation
  - Allocation summary
  - Category-wise breakdown
  - Visual charts

✓ /hr/assets/reports/costs
  - Asset cost analysis
  - Depreciation tracking
  - Total cost of ownership
```

**Phase 5 Deliverables:**
- Asset tracking system
- Inventory management
- Barcode integration UI
- Comprehensive reports

---

## PHASE 6: PERFORMANCE MANAGEMENT (Priority: MEDIUM)
**Duration: Week 8-9 | Pages: 27**

### 6.1 Goal Management
```
✓ /hr/performance/goals/my
  - My goals dashboard
  - Progress tracking
  - Update & comments
  - Dependencies: user-master, designation-master

✓ /hr/performance/goals/set
  - Goal setting wizard
  - SMART goal template
  - Alignment to objectives

✓ /hr/performance/goals/team
  - Team goals view
  - Collaboration features
  - Shared objectives

✓ /hr/performance/goals/department
  - Department goals cascade
  - Hierarchy view
  - Progress rollup

✓ /hr/performance/goals/alignment
  - Goal alignment matrix
  - Company → Dept → Individual
  - Visual alignment map

✓ /hr/performance/goals/tracking
  - Goal tracking dashboard
  - Milestone tracking
  - At-risk goals alerts
```

### 6.2 KPI Management
```
✓ /hr/performance/kpi/master
  - KPI master library
  - KPI templates
  - Formula definitions

✓ /hr/performance/kpi/assignment
  - KPI assignment to roles
  - Weight allocation
  - Target setting

✓ /hr/performance/kpi/tracking
  - KPI tracking dashboard
  - Actual vs Target
  - Trend analysis

✓ /hr/performance/kpi/dashboard
  - Executive KPI dashboard
  - Department performance
  - Heat maps
```

### 6.3 Performance Reviews
```
✓ /hr/performance/reviews/cycles
  - Review cycle setup
  - Timeline configuration
  - Participant selection

✓ /hr/performance/reviews/self
  - Self-appraisal form
  - Achievement highlights
  - Goal review

✓ /hr/performance/reviews/manager
  - Manager review form
  - Rating scales
  - Comments & feedback

✓ /hr/performance/reviews/peer
  - Peer review nomination
  - Anonymous feedback
  - Competency ratings

✓ /hr/performance/reviews/rating
  - Rating normalization
  - Bell curve distribution
  - Final ratings approval

✓ /hr/performance/reviews/meetings
  - One-on-one scheduler
  - Meeting notes
  - Action items
```

### 6.4 Feedback & Recognition
```
✓ /hr/performance/feedback/give
  - Give feedback form
  - 360-degree feedback
  - Real-time feedback

✓ /hr/performance/feedback/received
  - Received feedback inbox
  - Acknowledge & respond
  - Feedback history

✓ /hr/performance/feedback/requests
  - Request feedback
  - Feedback reminders
  - Pending requests

✓ /hr/performance/feedback/recognition
  - Recognition wall
  - Badges & awards
  - Peer appreciation
```

### 6.5 Performance Improvement
```
✓ /hr/performance/pip/create
  - PIP creation form
  - Improvement areas
  - Timeline & milestones

✓ /hr/performance/pip/tracking
  - PIP progress tracking
  - Weekly check-ins
  - Support resources

✓ /hr/performance/pip/review
  - PIP review & closure
  - Outcome documentation
  - Success metrics
```

### 6.6 Performance Reports
```
✓ /hr/performance/reports/analytics
  - Performance analytics dashboard
  - Trends & patterns
  - Predictive insights

✓ /hr/performance/reports/department
  - Department performance reports
  - Comparative analysis
  - Best performers

✓ /hr/performance/reports/distribution
  - Rating distribution
  - Bell curve visualization
  - Normalization reports

✓ /hr/performance/reports/trends
  - Historical trends
  - Year-over-year comparison
  - Improvement tracking
```

**Phase 6 Deliverables:**
- Performance management system
- Goal tracking UI
- Review workflow
- Analytics dashboards

---

## PHASE 7: TRAINING & DEVELOPMENT (Priority: MEDIUM)
**Duration: Week 10 | Pages: 26**

### 7.1 Training Programs
```
✓ /hr/training/programs/catalog
  - Training catalog browser
  - Search & filter
  - Program details
  - Dependencies: user-master

✓ /hr/training/programs/create
  - Program creation form
  - Curriculum builder
  - Resource allocation

✓ /hr/training/programs/schedule
  - Training calendar
  - Batch scheduling
  - Trainer assignment

✓ /hr/training/programs/external
  - External training programs
  - Vendor management
  - Sponsorship requests
```

### 7.2 Enrollment
```
✓ /hr/training/enrollment/enroll
  - Program enrollment form
  - Prerequisites check
  - Seat availability

✓ /hr/training/enrollment/my
  - My training dashboard
  - Upcoming sessions
  - Completed programs

✓ /hr/training/enrollment/waiting
  - Waiting list management
  - Auto-enrollment on vacancy
  - Notification system

✓ /hr/training/enrollment/attendance
  - Attendance tracking
  - QR code check-in
  - Attendance reports
```

### 7.3 E-Learning
```
✓ /hr/training/elearning/library
  - E-learning content library
  - Video courses
  - Interactive modules

✓ /hr/training/elearning/my
  - My learning path
  - Progress tracking
  - Bookmarks

✓ /hr/training/elearning/progress
  - Learning progress dashboard
  - Course completion %
  - Time spent

✓ /hr/training/elearning/certifications
  - E-learning certifications
  - Certificate download
  - Validity tracking
```

### 7.4 Skills Management
```
✓ /hr/training/skills/matrix
  - Skills matrix viewer
  - Team skills heatmap
  - Competency levels

✓ /hr/training/skills/assessment
  - Skills assessment form
  - Self & manager assessment
  - Gap identification

✓ /hr/training/skills/gap
  - Skills gap analysis
  - Training recommendations
  - Development plans

✓ /hr/training/skills/certifications
  - Professional certifications
  - Renewal tracking
  - Organization-sponsored certs
```

### 7.5 Training Effectiveness
```
✓ /hr/training/effectiveness/feedback
  - Training feedback form
  - Trainer ratings
  - Facility ratings

✓ /hr/training/effectiveness/assessments
  - Pre & Post assessments
  - Knowledge gain measurement
  - Quiz interface

✓ /hr/training/effectiveness/impact
  - Training impact analysis
  - Behavioral changes
  - ROI measurement
```

### 7.6 Budget
```
✓ /hr/training/budget/allocation
  - Budget allocation by department
  - Annual budget planning
  - Approval workflow

✓ /hr/training/budget/costs
  - Training cost tracking
  - Actual vs Budget
  - Cost per employee

✓ /hr/training/budget/tracking
  - Budget utilization tracking
  - Variance analysis
  - Forecast vs Actual
```

### 7.7 Training Reports
```
✓ /hr/training/reports/summary
  - Training summary dashboard
  - KPIs: Hours, Participants, Programs
  - Trend charts

✓ /hr/training/reports/employee
  - Employee training history
  - Certifications earned
  - Training hours

✓ /hr/training/reports/department
  - Department-wise reports
  - Compliance training status
  - Investment analysis

✓ /hr/training/reports/hours
  - Training hours report
  - Mandatory vs Optional
  - Monthly breakdown
```

**Phase 7 Deliverables:**
- Training management system
- E-learning interface
- Skills matrix
- Training analytics

---

## PHASE 8: PAYROLL (Priority: HIGH)
**Duration: Week 11-13 | Pages: 38**

### 8.1 Payroll Configuration
```
✓ /hr/payroll/components
  - Salary components master
  - Earnings & Deductions
  - Formula builder
  - Dependencies: user-master, designation-master

✓ /hr/payroll/templates
  - Salary structure templates
  - Grade-wise templates
  - Component mapping

✓ /hr/payroll/assignments
  - Employee salary assignment
  - Bulk assignment
  - Revision history

✓ /hr/payroll/calendar
  - Payroll calendar
  - Cut-off dates
  - Processing schedule
```

### 8.2 Payroll Processing
```
✓ /hr/payroll/run
  - Payroll run dashboard
  - Month selection
  - Attendance integration
  - Process wizard

✓ /hr/payroll/verification
  - Payroll verification interface
  - Exception handling
  - Variance analysis

✓ /hr/payroll/disbursement
  - Salary disbursement
  - Bank file generation
  - Payment status tracking
```

### 8.3 Salary Revisions
```
✓ /hr/payroll/revisions
  - Salary revision form
  - Approval workflow
  - Effective date

✓ /hr/payroll/increment/annual
  - Annual increment processing
  - Percentage/Fixed amount
  - Bulk increment

✓ /hr/payroll/increment/performance
  - Performance-based increment
  - Rating-linked increments
  - Merit matrix

✓ /hr/payroll/increment/arrears
  - Arrears calculation
  - Retrospective payments
  - Arrears statement

✓ /hr/payroll/increment/letters
  - Increment letter generation
  - Template customization
  - Digital signatures
```

### 8.4 Bonus & Incentives
```
✓ /hr/payroll/bonus/schemes
  - Bonus scheme configuration
  - Eligibility criteria
  - Calculation rules

✓ /hr/payroll/bonus/annual
  - Annual bonus processing
  - Pro-rata calculation
  - Bulk processing

✓ /hr/payroll/bonus/performance
  - Performance bonus
  - Target vs Achievement
  - Payout matrix

✓ /hr/payroll/bonus/processing
  - Bonus processing dashboard
  - Approval workflow
  - Payment integration
```

### 8.5 Loans & Advances
```
✓ /hr/payroll/loans/requests
  - Loan request form
  - Loan types
  - Repayment schedule preview

✓ /hr/payroll/loans/approval
  - Loan approval queue
  - Eligibility check
  - Approval workflow

✓ /hr/payroll/loans/emi
  - EMI schedule management
  - Installment tracking
  - Prepayment option

✓ /hr/payroll/loans/recovery
  - Loan recovery tracking
  - Outstanding balance
  - Settlement

✓ /hr/payroll/advances/requests
  - Salary advance requests
  - Limit configuration
  - Quick processing
```

### 8.6 Statutory Compliance
```
✓ /hr/payroll/pf/contribution
  - PF contribution calculator
  - Employee & Employer share
  - Monthly calculations

✓ /hr/payroll/pf/uan
  - UAN management
  - Employee UAN linking
  - Verification status

✓ /hr/payroll/pf/returns
  - PF return generation
  - ECR file generation
  - Challan management

✓ /hr/payroll/esi/contribution
  - ESI contribution calculator
  - Wage limit checks
  - Monthly processing

✓ /hr/payroll/esi/returns
  - ESI return generation
  - Employee-wise details
  - Challan generation

✓ /hr/payroll/pt
  - Professional tax calculator
  - State-wise PT slabs
  - Challan generation
```

### 8.7 Tax Management
```
✓ /hr/payroll/tax/declarations
  - Tax declaration portal
  - Investment proofs upload
  - HRA calculator

✓ /hr/payroll/tax/tds
  - TDS calculation
  - Regime comparison (Old vs New)
  - Monthly TDS

✓ /hr/payroll/tax/form16
  - Form 16 generation
  - Part A & Part B
  - Digital signatures

✓ /hr/payroll/tax/reports
  - Tax reports dashboard
  - TDS summary
  - Tax reconciliation
```

### 8.8 Payroll Reports
```
✓ /hr/payroll/reports/payslips
  - Payslip generation
  - Email payslips
  - Download PDF

✓ /hr/payroll/reports/register
  - Salary register
  - Month-wise comparison
  - Export to Excel

✓ /hr/payroll/reports/bank
  - Bank advice report
  - NEFT/RTGS file
  - Account verification

✓ /hr/payroll/reports/pf
  - PF reports
  - ECR summary
  - Contribution register

✓ /hr/payroll/reports/esi
  - ESI reports
  - Employee-wise contribution
  - Challan reports

✓ /hr/payroll/reports/tds
  - TDS reports
  - Form 24Q preparation
  - Quarterly summary

✓ /hr/payroll/reports/dept-cost
  - Department cost analysis
  - Cost center allocation
  - Budget vs Actual
```

**Phase 8 Deliverables:**
- Complete payroll system
- Statutory compliance
- Tax calculation engine UI
- Comprehensive reports

---

## PHASE 9: COMPLIANCE (Priority: HIGH)
**Duration: Week 14 | Pages: 24**

### 9.1 Statutory Returns
```
✓ /hr/compliance/returns/pf
  - PF return filing
  - ECR upload interface
  - Filing history
  - Dependencies: payroll modules

✓ /hr/compliance/returns/esi
  - ESI return filing
  - Monthly returns
  - Challan tracking

✓ /hr/compliance/returns/pt
  - PT return filing
  - State-wise returns
  - Payment tracking

✓ /hr/compliance/returns/lwf
  - LWF return filing
  - Annual returns
  - Compliance calendar

✓ /hr/compliance/returns/tds
  - TDS return filing
  - Quarterly returns (24Q)
  - Correction statements
```

### 9.2 Labor Law Compliance
```
✓ /hr/compliance/labor/registers
  - Statutory registers
  - Form A, B, C, etc.
  - Digital registers

✓ /hr/compliance/labor/calendar
  - Compliance calendar
  - Due date alerts
  - Submission tracking

✓ /hr/compliance/labor/tracker
  - Compliance tracker
  - Status by law
  - Non-compliance alerts
```

### 9.3 Licenses & Certificates
```
✓ /hr/compliance/licenses/master
  - License master data
  - Applicability rules
  - Authority details

✓ /hr/compliance/licenses/certificates
  - License repository
  - Document storage
  - Verification status

✓ /hr/compliance/licenses/renewals
  - Renewal calendar
  - Application tracking
  - Auto-reminders
```

### 9.4 Policy Compliance
```
✓ /hr/compliance/policy/acknowledgment
  - Policy acknowledgment tracker
  - Digital signatures
  - Pending acknowledgments

✓ /hr/compliance/policy/violations
  - Violation reporting
  - Investigation tracking
  - Disciplinary actions

✓ /hr/compliance/policy/disciplinary
  - Disciplinary action tracker
  - Show cause notices
  - Action history
```

### 9.5 Diversity & Inclusion
```
✓ /hr/compliance/diversity/metrics
  - Diversity metrics dashboard
  - Gender, Age, Ethnicity ratios
  - Trend analysis

✓ /hr/compliance/diversity/eeo
  - EEO compliance tracking
  - Representation reports
  - Gap analysis

✓ /hr/compliance/diversity/posh
  - POSH compliance
  - Committee management
  - Complaint tracking

✓ /hr/compliance/diversity/grievance
  - Grievance management
  - Anonymous reporting
  - Resolution tracking
```

### 9.6 Audit & Inspection
```
✓ /hr/compliance/audit/audits
  - Audit scheduler
  - Internal/External audits
  - Audit checklist

✓ /hr/compliance/audit/findings
  - Audit findings log
  - Severity classification
  - Evidence documentation

✓ /hr/compliance/audit/remediation
  - Remediation tracker
  - Action plans
  - Closure verification
```

### 9.7 Compliance Reports
```
✓ /hr/compliance/reports/dashboard
  - Compliance dashboard
  - Overall compliance score
  - Risk areas

✓ /hr/compliance/reports/statutory
  - Statutory compliance reports
  - Filing status
  - Pending actions

✓ /hr/compliance/reports/alerts
  - Compliance alerts
  - Upcoming deadlines
  - Critical alerts
```

**Phase 9 Deliverables:**
- Compliance management system
- Statutory filing interfaces
- Alert & notification system
- Audit tracking

---

## PHASE 10: SAFETY MANAGEMENT (Priority: MEDIUM)
**Duration: Week 15-16 | Pages: 29**

### 10.1 Risk Management
```
✓ /hr/safety/risk/hazards
  - Hazard identification form
  - Hazard categorization
  - Photo documentation
  - Dependencies: user-master

✓ /hr/safety/risk/register
  - Risk register
  - Risk matrix (Likelihood x Impact)
  - Risk priority number

✓ /hr/safety/risk/evaluation
  - Risk assessment form
  - HIRA methodology
  - Evaluation reports

✓ /hr/safety/risk/controls
  - Control measures
  - Hierarchy of controls
  - Effectiveness tracking
```

### 10.2 Incident Management
```
✓ /hr/safety/incidents/report
  - Incident reporting form
  - Immediate actions taken
  - Witness statements

✓ /hr/safety/incidents/near-miss
  - Near-miss reporting
  - Preventive actions
  - Learning database

✓ /hr/safety/incidents/investigation
  - Investigation tracker
  - Root cause analysis
  - 5 Why analysis

✓ /hr/safety/incidents/tracking
  - Incident tracking dashboard
  - Closure status
  - Repeat incidents
```

### 10.3 Safety Audits
```
✓ /hr/safety/audits/schedule
  - Audit schedule calendar
  - Frequency configuration
  - Auditor assignment

✓ /hr/safety/audits/inspections
  - Inspection checklist
  - Mobile-friendly interface
  - Photo/Video capture

✓ /hr/safety/audits/findings
  - Audit findings log
  - Criticality rating
  - Corrective actions

✓ /hr/safety/audits/actions
  - Action tracker
  - Responsibility assignment
  - Due date monitoring
```

### 10.4 PPE Management
```
✓ /hr/safety/ppe/inventory
  - PPE inventory
  - Stock levels
  - Reorder points

✓ /hr/safety/ppe/issuance
  - PPE issuance form
  - Employee-wise tracking
  - Return/Replacement

✓ /hr/safety/ppe/tracking
  - PPE tracking dashboard
  - Compliance monitoring
  - Expiry management
```

### 10.5 Emergency Management
```
✓ /hr/safety/emergency/plans
  - Emergency response plans
  - Evacuation procedures
  - Floor plans

✓ /hr/safety/emergency/drills
  - Drill scheduler
  - Drill execution tracker
  - Effectiveness reports

✓ /hr/safety/emergency/contacts
  - Emergency contact directory
  - First-aiders
  - Hospital/Fire station contacts
```

### 10.6 Safety Management System
```
✓ /hr/safety/management/policies
  - Safety policy repository
  - Version control
  - Acknowledgment tracking

✓ /hr/safety/management/procedures
  - Safe work procedures
  - SOP library
  - Training linkage

✓ /hr/safety/management/training
  - Safety training programs
  - Mandatory training tracker
  - Certification management

✓ /hr/safety/management/committee
  - Safety committee management
  - Meeting scheduler
  - Minutes of meeting
```

### 10.7 Wellness Programs
```
✓ /hr/safety/wellness/checkups
  - Health checkup scheduler
  - Annual medical checkups
  - Report repository

✓ /hr/safety/wellness/occupational
  - Occupational health monitoring
  - Exposure tracking
  - Medical surveillance

✓ /hr/safety/wellness/ergonomics
  - Ergonomic assessment
  - Workstation evaluation
  - Improvement recommendations

✓ /hr/safety/wellness/programs
  - Wellness program catalog
  - Participation tracking
  - Health challenges
```

### 10.8 Safety Reports
```
✓ /hr/safety/reports/analytics
  - Safety analytics dashboard
  - Leading & lagging indicators
  - Trend analysis

✓ /hr/safety/reports/compliance
  - Safety compliance reports
  - Regulatory requirements
  - Compliance score

✓ /hr/safety/reports/kpi
  - Safety KPI dashboard
  - LTIFR, TRIFR calculations
  - Benchmarking
```

**Phase 10 Deliverables:**
- Safety management system
- Incident reporting
- Risk assessment tools
- Safety analytics

---

## PHASE 11: EXPENSES & REIMBURSEMENT (Priority: MEDIUM)
**Duration: Week 17 | Pages: 17**

### 11.1 Expense Management
```
✓ /hr/expenses/submit
  - Expense submission form
  - Multi-line items
  - Receipt upload (OCR)
  - Dependencies: user-master, currency-master

✓ /hr/expenses/my
  - My expenses dashboard
  - Draft/Submitted/Paid
  - Quick resubmit

✓ /hr/expenses/pending
  - Pending approvals
  - Approval queue
  - Bulk approval

✓ /hr/expenses/approved
  - Approved expenses
  - Payment status
  - Download claims

✓ /hr/expenses/rejected
  - Rejected expenses
  - Rejection reasons
  - Resubmit option
```

### 11.2 Expense Settings
```
✓ /hr/expenses/settings/categories
  - Expense category master
  - Limits per category
  - Tax implications

✓ /hr/expenses/settings/policies
  - Expense policy setup
  - Grade-wise limits
  - Approval matrix

✓ /hr/expenses/settings/approval
  - Approval workflow configuration
  - Multi-level approvals
  - Delegation rules

✓ /hr/expenses/settings/per-diem
  - Per-diem rates
  - City/Country-wise
  - Grade-based rates
```

### 11.3 Expense Reports
```
✓ /hr/expenses/reports/summary
  - Expense summary dashboard
  - Monthly trends
  - Top categories

✓ /hr/expenses/reports/department
  - Department expense reports
  - Budget vs Actual
  - Cost center analysis

✓ /hr/expenses/reports/travel
  - Travel expense analysis
  - Destination-wise costs
  - Travel patterns

✓ /hr/expenses/reports/budget
  - Budget utilization
  - Variance analysis
  - Forecasting
```

### 11.4 Reimbursement
```
✓ /hr/reimbursement/pending
  - Pending reimbursements
  - Submission date
  - Expected payout

✓ /hr/reimbursement/processing
  - Processing queue
  - Batch processing
  - Payment file generation

✓ /hr/reimbursement/paid
  - Paid reimbursements
  - Payment history
  - Tax deductions

✓ /hr/reimbursement/settlement
  - Settlement summary
  - Bank transfer details
  - Acknowledgment
```

**Phase 11 Deliverables:**
- Expense management system
- Receipt upload & OCR (UI)
- Approval workflows
- Reimbursement processing

---

## PHASE 12: OFFBOARDING (Priority: MEDIUM)
**Duration: Week 18 | Pages: 17**

### 12.1 Resignation Management
```
✓ /hr/offboarding/resignations
  - Resignation tracker
  - Resignation letter upload
  - Acceptance workflow
  - Dependencies: user-master

✓ /hr/offboarding/acceptance
  - Resignation acceptance
  - Counter-offer process
  - Acceptance letter

✓ /hr/offboarding/notice-period
  - Notice period tracker
  - Buyout requests
  - Working days calculation

✓ /hr/offboarding/early-release
  - Early release requests
  - Replacement status
  - Approval workflow
```

### 12.2 Exit Process
```
✓ /hr/offboarding/exit-interview
  - Exit interview scheduler
  - Questionnaire
  - Feedback analysis

✓ /hr/offboarding/clearance/checklist
  - Exit checklist dashboard
  - Multi-department clearance
  - Pending items tracking

✓ /hr/offboarding/clearance/hr
  - HR clearance form
  - Documents received
  - Policy compliance

✓ /hr/offboarding/clearance/it
  - IT asset return
  - Email/System access revoke
  - Data handover

✓ /hr/offboarding/clearance/finance
  - Finance clearance
  - Loan recovery
  - Advance settlement

✓ /hr/offboarding/clearance/assets
  - Asset return checklist
  - Condition verification
  - Damage assessment
```

### 12.3 Exit Documents
```
✓ /hr/offboarding/docs/relieving
  - Relieving letter generation
  - Template customization
  - Digital signatures

✓ /hr/offboarding/docs/experience
  - Experience certificate
  - Service details
  - Responsibilities mentioned

✓ /hr/offboarding/docs/service
  - Service certificate
  - Tenure details
  - Character certificate
```

### 12.4 Final Settlement
```
✓ /hr/offboarding/fnf/salary
  - Final salary calculation
  - Working days pro-rata
  - Deductions

✓ /hr/offboarding/fnf/leave
  - Leave encashment
  - Eligible leave balance
  - Calculation sheet

✓ /hr/offboarding/fnf/gratuity
  - Gratuity calculation
  - Eligibility check
  - Payment processing

✓ /hr/offboarding/fnf/payment
  - FnF statement
  - Payment breakdown
  - Bank transfer
```

**Phase 12 Deliverables:**
- Offboarding workflow
- Clearance tracking
- FnF calculation
- Exit documentation

---

## PHASE 13: SUCCESSION PLANNING (Priority: LOW)
**Duration: Week 19 | Pages: 16**

### 13.1 Critical Positions
```
✓ /hr/succession/positions/identify
  - Critical position identification
  - Business impact analysis
  - Risk assessment
  - Dependencies: designation-master

✓ /hr/succession/positions/profiles
  - Position profile builder
  - Competency requirements
  - Success criteria

✓ /hr/succession/positions/risk
  - Position risk analysis
  - Vacancy risk score
  - Succession coverage
```

### 13.2 Talent Identification
```
✓ /hr/succession/talent/identify
  - High-potential identification
  - Assessment criteria
  - Nomination process

✓ /hr/succession/talent/profiles
  - Talent profile cards
  - Competency assessment
  - Career aspirations

✓ /hr/succession/talent/readiness
  - Succession readiness matrix
  - Ready Now/1-2 Years/3+ Years
  - Development needs

✓ /hr/succession/talent/development
  - Individual development plans
  - Skill gap closure
  - Progress tracking
```

### 13.3 Succession Plans
```
✓ /hr/succession/plans/create
  - Succession plan builder
  - Primary/Secondary successors
  - Timeline

✓ /hr/succession/plans/matrix
  - 9-box grid visualization
  - Performance vs Potential
  - Talent distribution

✓ /hr/succession/plans/tracking
  - Plan execution tracker
  - Milestone completion
  - Effectiveness metrics
```

### 13.4 Development Programs
```
✓ /hr/succession/development/leadership
  - Leadership development programs
  - Fast-track programs
  - Executive coaching

✓ /hr/succession/development/mentoring
  - Mentoring program
  - Mentor-mentee matching
  - Progress tracking

✓ /hr/succession/development/rotation
  - Job rotation program
  - Cross-functional exposure
  - Assignment tracking
```

### 13.5 Succession Reports
```
✓ /hr/succession/reports/analytics
  - Succession analytics
  - Pipeline strength
  - Risk areas

✓ /hr/succession/reports/coverage
  - Succession coverage report
  - Positions with/without successors
  - Gap analysis

✓ /hr/succession/reports/bench-strength
  - Bench strength analysis
  - Depth of talent
  - Department comparison
```

**Phase 13 Deliverables:**
- Succession planning system
- 9-box grid visualization
- Talent profiles
- Development tracking

---

## PHASE 14: MISCELLANEOUS MODULES (Priority: LOW)
**Duration: Week 20 | Pages: 16**

### 14.1 Travel Management
```
✓ /hr/travel/requests
  - Travel request form
  - Multi-city itinerary
  - Approval workflow
  - Dependencies: user-master, currency-master

✓ /hr/travel/booking/flight
  - Flight booking interface
  - Integration with travel portal (UI)
  - Booking confirmations

✓ /hr/travel/booking/hotel
  - Hotel booking
  - Budget compliance
  - Booking management

✓ /hr/travel/booking/cab
  - Cab booking
  - Airport transfers
  - Trip tracking

✓ /hr/travel/advances
  - Travel advance requests
  - Amount calculation
  - Settlement

✓ /hr/travel/history
  - Travel history
  - Expense summary
  - Destination analytics
```

### 14.2 Probation Management
```
✓ /hr/probation/tracking
  - Probation period tracker
  - Completion dates
  - Extension requests

✓ /hr/probation/feedback
  - Probation feedback form
  - Monthly check-ins
  - Manager assessment

✓ /hr/probation/reviews
  - Probation review scheduler
  - Mid-term & Final review
  - Evaluation criteria

✓ /hr/probation/confirmation
  - Confirmation letter generation
  - Approval workflow
  - Effective date
```

### 14.3 Alumni Network
```
✓ /hr/alumni/directory
  - Alumni directory
  - Search & filter
  - Contact information

✓ /hr/alumni/network
  - Alumni networking platform
  - Events & meetups
  - Discussion forums

✓ /hr/alumni/rehire
  - Rehire program
  - Boomerang employees
  - Fast-track onboarding
```

### 14.4 Card Management
```
✓ /hr/cards/management
  - Corporate card inventory
  - Card assignment
  - Limit management

✓ /hr/cards/transactions
  - Card transaction tracking
  - Expense reconciliation
  - Statement download

✓ /hr/cards/reconciliation
  - Monthly reconciliation
  - Dispute management
  - Settlement
```

**Phase 14 Deliverables:**
- Travel management
- Probation tracking
- Alumni portal
- Card management

---

## DESIGN SYSTEM & REUSABLE COMPONENTS

### Core Components (Build First)
```
1. DataTable
   - Sortable columns
   - Filters
   - Pagination
   - Export (CSV, Excel, PDF)
   - Column visibility toggle
   - Row selection

2. FormBuilder
   - Dynamic form generation
   - Validation
   - Multi-step wizard
   - File upload
   - Auto-save drafts

3. Modal/Drawer
   - Side drawer for forms
   - Modal for confirmations
   - Quick view drawer

4. Calendar
   - Month/Week/Day view
   - Event creation
   - Color coding
   - Filters

5. Charts & Graphs
   - Line, Bar, Pie charts
   - Interactive dashboards
   - Drill-down capability

6. Timeline
   - Vertical/Horizontal timeline
   - Status indicators
   - Comments thread

7. Kanban Board
   - Drag & drop
   - Status columns
   - Card customization

8. File Upload
   - Drag & drop
   - Multiple files
   - Preview
   - Progress bar

9. Search & Filter
   - Global search
   - Advanced filters
   - Saved filters
   - Filter chips

10. Approval Workflow UI
    - Status stepper
    - Action buttons
    - Comment section
    - Audit trail
```

### UI/UX Patterns
```
1. List-Detail Pattern
   - List on left, details on right
   - Quick preview on hover
   - Breadcrumb navigation

2. Dashboard Pattern
   - KPI cards
   - Quick actions
   - Recent activity
   - Alerts/Notifications

3. Wizard Pattern
   - Multi-step forms
   - Progress indicator
   - Save & continue later
   - Validation per step

4. Master-Detail Pattern
   - Master grid
   - Detail form/drawer
   - Inline editing

5. Card Layout
   - Grid of cards
   - Filter & sort
   - Status badges
   - Quick actions
```

### Color Coding Strategy
```
- Leave Types: Different colors
- Asset Categories: Color-coded
- Priority Levels: Red/Orange/Green
- Status: Pending/Approved/Rejected
- Departments: Unique colors
```

---

## MOCK DATA STRATEGY

### Phase 1 Mock Data (Common Masters)
```
1. Users: 30-50 employees
   - Mix of departments
   - Various designations
   - Active/Inactive status

2. Departments: 10-12
   - Engineering, Sales, HR, Finance, etc.

3. Locations:
   - 3-4 office locations
   - Multiple cities/states

4. Assets:
   - 100+ IT assets
   - 50+ office furniture
   - 10+ vehicles

5. Documents:
   - Sample PDFs
   - Image placeholders
   - Various document types

6. Financial:
   - Realistic salary ranges
   - Tax slabs
   - Expense limits
```

### Mock Data Generators
```
- Use Faker.js for names, addresses
- Realistic Indian names & locations
- Date ranges (current year)
- Status distributions (70% active, 20% pending, 10% inactive)
- Hierarchical data (manager-employee relationships)
```

---

## TECHNICAL IMPLEMENTATION NOTES

### Frontend Stack
```
- React/Next.js
- TypeScript
- Tailwind CSS
- Shadcn UI components
- React Hook Form
- Zod validation
- React Query (data fetching)
- Recharts (charts)
- React Big Calendar
```

### State Management
```
- Context API for global state
- React Query for server state
- Local storage for preferences
```

### Routing Strategy
```
- File-based routing (Next.js App Router)
- Dynamic routes for IDs
- Route groups for organization
```

### Performance Optimization
```
- Lazy loading
- Code splitting
- Virtualization for long lists
- Image optimization
- Debounced search
```

---

## MILESTONES & DELIVERABLES

### Weekly Deliverables
```
Week 1-2:   24 Common Master pages + Core components
Week 3:     15 Leave Management pages
Week 4:     26 Document Management pages
Week 5:     13 Onboarding pages
Week 6-7:   28 Assets Management pages
Week 8-9:   27 Performance Management pages
Week 10:    26 Training pages
Week 11-13: 38 Payroll pages
Week 14:    24 Compliance pages
Week 15-16: 29 Safety pages
Week 17:    17 Expenses pages
Week 18:    17 Offboarding pages
Week 19:    16 Succession Planning pages
Week 20:    16 Miscellaneous pages
```

### Quality Checkpoints
```
✓ Responsive design (Mobile, Tablet, Desktop)
✓ Accessibility (WCAG 2.1 AA)
✓ Browser compatibility
✓ Loading states
✓ Error states
✓ Empty states
✓ Success messages
✓ Confirmation dialogs
✓ Form validation
✓ Consistent spacing & typography
```

---

## TOTAL SCOPE SUMMARY

| Phase | Module | Pages | Priority | Duration |
|-------|--------|-------|----------|----------|
| 1 | Common Masters | 24 | HIGHEST | Week 1-2 |
| 2 | Leave Management | 15 | HIGH | Week 3 |
| 3 | Documents | 26 | HIGH | Week 4 |
| 4 | Onboarding | 13 | HIGH | Week 5 |
| 5 | Assets | 28 | MEDIUM | Week 6-7 |
| 6 | Performance | 27 | MEDIUM | Week 8-9 |
| 7 | Training | 26 | MEDIUM | Week 10 |
| 8 | Payroll | 38 | HIGH | Week 11-13 |
| 9 | Compliance | 24 | HIGH | Week 14 |
| 10 | Safety | 29 | MEDIUM | Week 15-16 |
| 11 | Expenses & Reimbursement | 17 | MEDIUM | Week 17 |
| 12 | Offboarding | 17 | MEDIUM | Week 18 |
| 13 | Succession Planning | 16 | LOW | Week 19 |
| 14 | Miscellaneous | 16 | LOW | Week 20 |
| **TOTAL** | **18 Modules** | **316 Pages** | - | **20 Weeks** |

---

## NEXT STEPS

1. **Review & Approval**: Get stakeholder approval on this plan
2. **Design System**: Set up Shadcn UI + Tailwind config
3. **Project Setup**: Initialize Next.js project with folder structure
4. **Start Phase 1**: Begin with Common Masters (highest priority)
5. **Iterate**: Build → Review → Refine for each phase

---

**Document Version**: 1.0
**Last Updated**: 2025-10-25
**Status**: Ready for Implementation
