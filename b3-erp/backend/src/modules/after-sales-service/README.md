# After Sales Service Module

## Overview

The After Sales Service module is a comprehensive customer service and support system that manages the complete lifecycle of post-sale activities including warranty, AMC/CMC contracts, service requests, field service operations, spare parts management, and preventive maintenance.

## Module Structure

```
after-sales-service/
├── entities/                          # All entity definitions
│   ├── service-contract.entity.ts    # Service contracts (AMC/CMC)
│   ├── warranty.entity.ts            # Warranties & claims
│   ├── service-request.entity.ts     # Service requests & tickets
│   ├── installation.entity.ts        # Installation jobs & site surveys
│   ├── field-service.entity.ts       # Field service jobs & reports
│   ├── service-billing.entity.ts     # Service invoicing & revenue
│   ├── equipment-registry.entity.ts  # Equipment tracking & history
│   ├── service-performance.entity.ts # Performance metrics & SLA
│   ├── customer-feedback.entity.ts   # Feedback & complaints
│   └── index.ts                      # Entity exports
├── dto/                              # Data Transfer Objects
├── service-contracts/                # Service Contract sub-module
│   ├── service-contracts.controller.ts
│   └── service-contracts.service.ts
├── warranties/                       # Warranty sub-module
│   ├── warranties.controller.ts
│   └── warranties.service.ts
├── service-requests/                 # Service Request sub-module
│   ├── service-requests.controller.ts
│   └── service-requests.service.ts
├── installations/                    # Installation sub-module
│   ├── installations.controller.ts
│   └── installations.service.ts
├── field-service/                    # Field Service sub-module
│   ├── field-service.controller.ts
│   └── field-service.service.ts
├── service-billing/                  # Service Billing sub-module
│   ├── service-billing.controller.ts
│   └── service-billing.service.ts
├── after-sales-service.module.ts    # Main module
└── README.md                         # This file
```

## Entities Created

### 1. Service Contract Management

#### ServiceContract Entity
- **Purpose**: Manage AMC/CMC and other service contracts
- **Key Fields**:
  - Contract types: AMC, CMC, Pay-per-visit, Parts & Labor, Extended Warranty
  - Customer and equipment coverage
  - SLA definitions (response & resolution times)
  - Pricing tiers: Silver, Gold, Platinum, Custom
  - Auto-renewal configuration
  - Visit frequency and service coverage
  - Inclusions/exclusions
- **Features**:
  - Contract lifecycle tracking
  - Renewal alerts (90, 60, 30 days)
  - Multi-equipment coverage
  - Financial tracking (billing, payments)

### 2. Warranty Management

#### Warranty Entity
- **Purpose**: Track equipment warranties
- **Key Fields**:
  - Warranty types: Standard, Extended, Manufacturer, Dealer, Comprehensive
  - Coverage: Parts only, Labor only, Parts & Labor, Comprehensive
  - Equipment and customer linkage
  - Warranty period and expiry alerts
  - Transfer capabilities
  - OEM/Manufacturer details
- **Features**:
  - Automatic activation on installation
  - Expiry alerts (90, 60, 30 days)
  - Extension offers
  - Transfer management

#### WarrantyClaim Entity
- **Purpose**: Process warranty claims
- **Key Fields**:
  - Fault description and categorization
  - Eligibility verification
  - Approval workflow
  - Parts replacement tracking
  - Cost tracking (customer vs company bearing)
  - OEM coordination
- **Features**:
  - Multi-step approval workflow
  - Parts and labor cost tracking
  - OEM claim processing
  - Customer satisfaction tracking

### 3. Service Request & Ticketing

#### ServiceRequest Entity
- **Purpose**: Multi-channel service request logging
- **Key Fields**:
  - Priority levels: P1 (Critical), P2 (High), P3 (Medium), P4 (Low)
  - Request channels: Phone, Email, Web, Mobile, WhatsApp, Chat
  - Service types: Installation, Repair, PM, Breakdown, Inspection
  - SLA tracking (response & resolution deadlines)
  - Assignment (auto/manual)
  - Escalation management
- **Features**:
  - Multi-channel intake
  - Auto-assignment based on skills, location, workload
  - SLA monitoring and breach alerts
  - Communication log

#### ServiceTicket Entity
- **Purpose**: Track service ticket lifecycle
- **Key Fields**:
  - Ticket status workflow
  - Engineer assignment
  - Work log and progress tracking
  - Parts requirements
  - Customer acceptance
- **Features**:
  - SLA compliance tracking
  - Parts availability checking
  - Reopen capability
  - Customer sign-off

### 4. Installation Services

#### Installation Entity
- **Purpose**: Manage equipment installations
- **Key Fields**:
  - Installation status workflow
  - Site survey requirements
  - Readiness checklist (electrical, water, gas, space, etc.)
  - Team assignment
  - Resource planning
  - Installation checklist
  - Testing & commissioning
  - Customer training
  - Handover documentation
- **Features**:
  - Site readiness assessment
  - Multi-checkpoint installation process
  - Warranty activation
  - Post-installation support

#### SiteSurvey Entity
- **Purpose**: Document site survey findings
- **Key Fields**:
  - Infrastructure checks (electrical, water, gas, drainage, ventilation)
  - Site measurements
  - Safety assessment
  - Additional requirements
  - Recommendations
- **Features**:
  - Detailed infrastructure assessment
  - Photo documentation
  - Approval workflow

### 5. Field Service Management

#### FieldServiceJob Entity
- **Purpose**: Manage field service operations
- **Key Fields**:
  - Job status: Scheduled, Dispatched, En Route, On Site, In Progress, Completed
  - Job types: Installation, Repair, Maintenance, Inspection, Emergency
  - Engineer assignment and scheduling
  - Route optimization data
  - Check-in/Check-out with GPS
  - Parts consumption
  - Customer interaction tracking
  - Real-time status updates
- **Features**:
  - GPS-based location tracking
  - Mobile app integration
  - Parts and tools management
  - Digital service report
  - Customer signature capture
  - First-time fix tracking

#### EngineerSchedule Entity
- **Purpose**: Manage engineer daily schedules
- **Key Fields**:
  - Job assignments
  - Route optimization
  - Capacity and utilization tracking
  - Location tracking
  - Performance metrics
- **Features**:
  - Daily schedule planning
  - Real-time location updates
  - Performance tracking

#### ServiceReport Entity
- **Purpose**: Digital service completion reports
- **Key Fields**:
  - Problem diagnosis and root cause
  - Work performed documentation
  - Parts replaced tracking
  - Time and cost tracking
  - Customer feedback and signature
  - Quality checks
- **Features**:
  - Comprehensive service documentation
  - Customer sign-off
  - Quality validation

### 6. Service Billing

#### ServiceInvoice Entity
- **Purpose**: Service billing and invoicing
- **Key Fields**:
  - Invoice types: Service, AMC, Installation
  - Line items with charges (labor, parts, travel, emergency)
  - Tax calculation (GST: CGST, SGST, IGST)
  - Contract/Warranty adjustments
  - Payment tracking
  - Approval workflow
- **Features**:
  - Multi-charge type billing
  - Warranty/Contract discounts
  - Payment history tracking
  - Auto-delivery to customer

#### AMCInvoice Entity
- **Purpose**: AMC/CMC contract invoicing
- **Key Fields**:
  - Billing frequency: Upfront, Monthly, Quarterly, Half-yearly, Annual
  - Pro-rata adjustments
  - Equipment coverage details
  - Auto-renewal tracking
  - Services summary
- **Features**:
  - Recurring billing
  - Contract-based invoicing
  - Auto-renewal invoice generation

#### ServiceRevenue Entity
- **Purpose**: Service revenue tracking and analysis
- **Key Fields**:
  - Revenue by type (service calls, installation, AMC, parts, labor)
  - Cost analysis
  - Profitability metrics
  - Contract metrics
  - Collection efficiency
- **Features**:
  - Period-based analytics
  - Revenue vs cost analysis
  - Top performers tracking

#### PaymentCollection Entity
- **Purpose**: Track service payments
- **Key Fields**:
  - Payment modes: Cash, Cheque, Card, UPI, NEFT, RTGS
  - Payment allocation
  - Bank reconciliation
  - Receipt generation
- **Features**:
  - Multi-mode payment tracking
  - Excess/short payment handling
  - Automatic receipt generation

### 7. Equipment Registry & Health

#### EquipmentRegistry Entity
- **Purpose**: Equipment lifecycle and health tracking
- **Key Fields**:
  - Equipment details and specifications
  - Customer and location tracking
  - Warranty and contract linkage
  - Operational data (operating hours, usage)
  - Health status: Excellent, Good, Fair, Poor, Critical
  - Lifecycle stage: New, Prime, Mature, Aging, End-of-Life
  - Reliability metrics (MTBF, MTTR, availability)
  - Performance trends
  - Replacement planning
- **Features**:
  - Complete equipment history
  - Health score calculation (0-100)
  - Maintenance recommendations
  - Replacement alerts
  - IoT integration support

#### ServiceHistory Entity
- **Purpose**: Complete service history log
- **Key Fields**:
  - All service interactions
  - Parts replaced
  - Costs incurred
  - Resolution tracking
  - Quality metrics
- **Features**:
  - Chronological service log
  - Cost tracking
  - Repeat issue identification

#### EquipmentPerformance Entity
- **Purpose**: Equipment performance analytics
- **Key Fields**:
  - Operational metrics
  - Reliability metrics (MTBF, MTTR)
  - Maintenance metrics
  - Cost analysis
  - Trend analysis
- **Features**:
  - Period-based analysis
  - Benchmark comparison
  - Health score calculation

### 8. Service Performance & Analytics

#### ServicePerformanceMetrics Entity
- **Purpose**: Overall service performance tracking
- **Key Fields**:
  - Service volume metrics
  - Response and resolution times
  - SLA compliance rates
  - First-time fix rate
  - MTTR & MTBF averages
  - Engineer performance
  - Customer satisfaction (CSAT, NPS)
  - Cost efficiency metrics
- **Features**:
  - Comprehensive KPI tracking
  - Trend analysis
  - Top issues identification

#### EngineerPerformance Entity
- **Purpose**: Individual engineer performance
- **Key Fields**:
  - Job statistics
  - Time metrics and utilization
  - Quality metrics (first-time fix rate)
  - Customer satisfaction
  - SLA performance
  - Revenue generation
  - Cost efficiency
- **Features**:
  - Individual performance scoring
  - Skill tracking
  - Training recommendations

#### SLACompliance Entity
- **Purpose**: SLA tracking and compliance
- **Key Fields**:
  - SLA definitions by priority
  - Actual performance
  - Breach tracking
  - Escalation management
  - Pause/Resume capabilities
- **Features**:
  - Real-time SLA monitoring
  - Breach alerts
  - Exception handling

### 9. Customer Feedback & Complaints

#### CustomerFeedback Entity
- **Purpose**: Collect and analyze customer feedback
- **Key Fields**:
  - Multi-channel feedback collection
  - Rating scales (1-5) for various aspects
  - NPS rating (0-10)
  - Open-ended feedback
  - Sentiment analysis
  - Follow-up management
- **Features**:
  - Automated survey collection
  - Sentiment scoring
  - Engineer praise tracking
  - Issue identification

#### Complaint Entity
- **Purpose**: Complaint management and resolution
- **Key Fields**:
  - Complaint status workflow
  - Severity levels: Low, Medium, High, Critical
  - Investigation tracking
  - Root cause analysis
  - Action plan and resolution
  - Escalation management
  - Compensation tracking
- **Features**:
  - Multi-step resolution workflow
  - Communication log
  - Preventive measures tracking
  - Recurrence detection

#### FeedbackAnalytics Entity
- **Purpose**: Aggregate feedback analysis
- **Key Fields**:
  - Overall satisfaction trends
  - NPS and CSAT scores
  - Sentiment distribution
  - Channel performance
  - Top praise and improvement areas
  - Engineer rankings
  - Complaint rates
- **Features**:
  - Period-based analytics
  - Trend identification
  - Actionable insights

## API Endpoints (Planned)

### Service Contracts
- `POST /after-sales/contracts` - Create contract
- `GET /after-sales/contracts` - List contracts
- `GET /after-sales/contracts/:id` - Get contract details
- `PATCH /after-sales/contracts/:id` - Update contract
- `POST /after-sales/contracts/:id/renew` - Renew contract
- `GET /after-sales/contracts/expiring` - Get expiring contracts

### Warranties
- `POST /after-sales/warranties` - Register warranty
- `GET /after-sales/warranties` - List warranties
- `GET /after-sales/warranties/:id` - Get warranty details
- `POST /after-sales/warranties/:id/claim` - Create claim
- `GET /after-sales/warranties/expiring` - Get expiring warranties

### Service Requests
- `POST /after-sales/service-requests` - Create service request
- `GET /after-sales/service-requests` - List requests
- `GET /after-sales/service-requests/:id` - Get request details
- `PATCH /after-sales/service-requests/:id/assign` - Assign engineer
- `PATCH /after-sales/service-requests/:id/escalate` - Escalate request

### Installations
- `POST /after-sales/installations` - Schedule installation
- `GET /after-sales/installations` - List installations
- `POST /after-sales/installations/:id/site-survey` - Create site survey
- `PATCH /after-sales/installations/:id/complete` - Complete installation

### Field Service
- `POST /after-sales/field-service/jobs` - Create field service job
- `GET /after-sales/field-service/jobs` - List jobs
- `GET /after-sales/field-service/schedules/:engineerId` - Get engineer schedule
- `POST /after-sales/field-service/jobs/:id/check-in` - Engineer check-in
- `POST /after-sales/field-service/jobs/:id/check-out` - Engineer check-out
- `POST /after-sales/field-service/jobs/:id/report` - Submit service report

### Service Billing
- `POST /after-sales/invoices` - Create service invoice
- `GET /after-sales/invoices` - List invoices
- `GET /after-sales/invoices/:id` - Get invoice details
- `POST /after-sales/invoices/:id/send` - Send invoice to customer
- `POST /after-sales/payments` - Record payment

## Integration Points

### With Other Modules

1. **CRM Module**
   - Customer master data
   - Contact information
   - Equipment installation details

2. **Sales Module**
   - Sales orders → Installation jobs
   - Equipment delivery → Warranty activation
   - Service contract sales

3. **Commissioning Module**
   - Installation completion
   - Equipment handover
   - Warranty start date

4. **Warehouse/Inventory Module**
   - Spare parts inventory
   - Parts requisition
   - Parts consumption tracking

5. **Finance Module**
   - Service invoice generation
   - Payment processing
   - Revenue recognition
   - Cost allocation

6. **HR Module**
   - Engineer master data
   - Skill matrix
   - Performance evaluation
   - Attendance (site visits)

7. **Logistics Module**
   - Spare parts delivery
   - Engineer dispatch
   - Route planning

### External Integrations

1. **SMS Gateway** - Customer notifications
2. **Email Service** - Automated communications
3. **WhatsApp Business API** - Customer interactions
4. **GPS/Maps API** - Route optimization, location tracking
5. **Payment Gateway** - Online payments
6. **OEM Systems** - Warranty claims, parts ordering

## Key Workflows

### 1. Service Request Workflow
```
Customer Request → Ticket Creation → Priority Assignment →
Engineer Assignment → Site Visit → Diagnosis → Repair →
Parts Replacement → Testing → Customer Sign-off → Ticket Closure
```

### 2. Contract Renewal Workflow
```
90 Days Alert → 60 Days Alert → 30 Days Alert →
Sales Follow-up → Renewal Quote → Approval → Contract Renewal →
Invoice Generation → Payment
```

### 3. Warranty Claim Workflow
```
Fault Report → Warranty Verification → Claim Initiation →
Eligibility Check → Approval → Service/Parts Replacement →
OEM Coordination (if needed) → Cost Tracking → Claim Closure
```

### 4. Installation Workflow
```
Sales Order → Installation Scheduling → Site Survey →
Resource Planning → Installation Execution → Testing →
Customer Demo → Sign-off → Warranty Activation → Handover
```

### 5. Field Service Workflow
```
Job Assignment → Route Planning → Dispatch → En Route →
Check-in → Diagnosis → Repair → Parts Replacement →
Testing → Customer Signature → Check-out → Report Submission
```

## Performance Metrics

### Service Quality KPIs
- First-Time Fix Rate: >85%
- MTTR (Mean Time To Repair): <4 hours
- SLA Compliance: >95%
- Customer Satisfaction (CSAT): >4.5/5
- Net Promoter Score (NPS): >50

### Operational KPIs
- Engineer Utilization: 70-80%
- Average Jobs per Engineer: 4-6 per day
- Spare Parts Availability: >95%
- PM Compliance: 100%

### Financial KPIs
- Service Revenue Growth: 15% YoY
- AMC Renewal Rate: >80%
- Service Profitability: >30% margin
- Collection Efficiency: >90%

## Implementation Status

### ✅ Completed
- [x] All entity definitions (10 entities)
- [x] Module structure setup
- [x] Entity relationships defined
- [x] Main module configuration

### 🚧 In Progress
- [ ] Controllers implementation
- [ ] Services implementation
- [ ] DTOs creation
- [ ] Validation rules

### 📋 Pending
- [ ] Database migrations
- [ ] API documentation (Swagger)
- [ ] Unit tests
- [ ] Integration tests
- [ ] Frontend integration

## Next Steps

1. **Immediate** (Week 13-14):
   - Implement Service Contract controller & service
   - Implement Warranty controller & service
   - Implement Service Request controller & service
   - Create DTOs for all entities

2. **Short Term** (Week 15-16):
   - Implement Field Service controller & service
   - Implement Installation controller & service
   - Implement Service Billing controller & service
   - Database migrations
   - API testing

3. **Medium Term**:
   - Frontend integration
   - Mobile app APIs
   - Real-time notifications
   - Analytics dashboard
   - Report generation

## Notes for Developers

### Spare Parts Management
- Spare Parts Management has been integrated with the Inventory module
- Use the Inventory module's API for spare parts catalog and stock management
- Field Service module references spare parts from inventory

### Mobile App Support
- Field Service Job entity supports mobile app integration
- Offline mode support via sync status tracking
- GPS location tracking for check-in/check-out

### SLA Monitoring
- Automatic SLA breach detection
- Escalation triggers on SLA breach
- Pause/Resume capability for valid reasons

### Real-time Updates
- Status updates tracked with timestamps
- Location history maintained
- Communication log for customer interactions

---

**Last Updated**: October 17, 2025
**Version**: 1.0
**Status**: Entities Complete | APIs Pending
