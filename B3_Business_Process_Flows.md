# B3 MACBIS ERP - Business Process Flows
## Complete End-to-End Process Documentation

**Based on:** Soffit BRS v2.0 (SIS/B3/0316/001, February 2016)  
**Updated by:** KreupAI Technologies LLC  
**Version:** 3.0 | **Status:** For Implementation

---

## Table of Contents

1. [Business Domain Overview](#1-business-domain-overview)
2. [Sales & Marketing Process](#2-sales--marketing-process)
3. [Production Process](#3-production-process)
4. [Purchase & Stores Process](#4-purchase--stores-process)
5. [Logistics Process](#5-logistics-process)
6. [Project & Commissioning Process](#6-project--commissioning-process)
7. [Support & Incident Management](#7-support--incident-management)
8. [HR & Financial Accounting](#8-hr--financial-accounting)

---

## 1. Business Domain Overview

### Three Primary Domains

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                        BUSINESS DOMAIN LIFECYCLE                            │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                             │
│  ┌─────────────────┐   ┌─────────────────┐   ┌─────────────────┐           │
│  │   RAW MATERIAL  │   │   PRODUCTION    │   │    CUSTOMER     │           │
│  │    SUPPLIER     │ → │     DOMAIN      │ → │     SUPPLY      │           │
│  │     DOMAIN      │   │                 │   │     DOMAIN      │           │
│  └─────────────────┘   └─────────────────┘   └─────────────────┘           │
│                                                                             │
│  • Direct delivery      • PPG Control       • Forward Logistics            │
│  • 3rd party transport  • PCG Operations    • Delivery & Install           │
│  • Ad-hoc procurement   • Floor Production  • Commissioning                │
│                         • QC & Stores       • Customer Handover            │
└─────────────────────────────────────────────────────────────────────────────┘
```

### End-to-End Business Flow

```
Customer   →   RFP/      →   Purchase   →   Production   →   Delivery   →   Commission   →   Invoice/
   BOQ         Proposal       Order                                                          Payment
```

| Stage | Department | Key Activity |
|-------|------------|--------------|
| Customer BOQ | Sales | Receive requirement document |
| RFP/Proposal | Sales | Prepare commercial proposal |
| Purchase Order | Sales | Confirm customer order |
| Production | Production | Manufacture products |
| Delivery | Logistics | Ship to customer site |
| Commission | Project | Install and test |
| Invoice/Payment | Finance | Bill and collect |

---

## 2. Sales & Marketing Process

### Process Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         SALES & MARKETING PROCESS                          │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐   ┌─────────┐     │
│  │  Lead   │ → │ Receive │ → │ Prepare │ → │Negotiate│ → │ Receive │     │
│  │Generate │   │   BOQ   │   │   RFP   │   │  Terms  │   │   PO    │     │
│  └─────────┘   └─────────┘   └─────────┘   └─────────┘   └─────────┘     │
│                                                              │             │
│                                                              ▼             │
│                                                    ┌─────────────────┐    │
│                                                    │  Handover to    │    │
│                                                    │      PPG        │    │
│                                                    └─────────────────┘    │
└────────────────────────────────────────────────────────────────────────────┘
```

### Key Activities

| Step | Activity | Responsible | System Action |
|------|----------|-------------|---------------|
| 1 | Lead Generation | Sales Team | CRM entry |
| 2 | Receive BOQ | Sales Executive | Document upload |
| 3 | Prepare RFP | Sales + Technical | Proposal generation |
| 4 | Negotiate Terms | Sales Manager | Version control |
| 5 | Receive PO | Sales Team | PO validation |
| 6 | Handover to PPG | Sales Manager | Workflow trigger |

### Control Points

- **Discount Approval:** Maker/checker workflow for deviations from standard pricing
- **Documentation:** Mandatory attachment at each stage
- **Version Control:** All proposal revisions tracked
- **High-Value Verification:** Secondary review for strategic orders

---

## 3. Production Process

### 3.1 Production Planning Group (PPG)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                              PPG WORKFLOW                                  │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Receive    →   Evaluate   →   Check      →   Purchase   →   Create      │
│    PO           BOQ/WBS       Materials       Requisition     Drawing     │
│                                                                            │
│     ↓                                                                      │
│                                                                            │
│  Approve    →   Create     →   Schedule   →   Release to                  │
│  Drawing        Work Order     Production       PCG                       │
└────────────────────────────────────────────────────────────────────────────┘
```

### PPG Core Team Composition

| Role | Responsibility |
|------|----------------|
| CEO/Director | Strategic decisions, escalation handling |
| Floor Manager | Production capacity assessment |
| Project Person | Customer timeline coordination |
| FA Person | Cost and budget control |
| R&D Representative | New product/design inputs |

### 3.2 Production Control Group (PCG)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                         PCG & FLOOR OPERATIONS                             │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Receive    →   Indent     →   Raw        →   Production  →   Semi-       │
│    WO          Resources      Material       (Multi-Stage)    Finished    │
│                               Store                            Store      │
│                                                                   ↓       │
│                                                                            │
│                              Finished   ←   QC Check   ←─────────┘        │
│                              Goods Store                                   │
└────────────────────────────────────────────────────────────────────────────┘
```

### 3.3 Production Floor Stages

| Stage | Process | Key Output |
|-------|---------|------------|
| 1 | Cutting | Sheet metal parts |
| 2 | Bending | Formed components |
| 3 | Fabrication | Assembled structures |
| 4 | Welding | Joined assemblies |
| 5 | Buffing/Finishing | Polished surfaces |
| 6 | QC | Quality-approved products |
| 7 | Finished Goods | Dispatch-ready items |

### Store Types

| Store | Contents | Control |
|-------|----------|---------|
| Raw Material Store | Steel sheets, fittings | PPG surveillance |
| Dies & Tools Store | Production tooling | PCG control |
| Semi-Finished Goods | WIP during pause | Critical tracking |
| Finished Goods | Pre-billing products | Dispatch section |

---

## 4. Purchase & Stores Process

### Purchase Workflow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                           PURCHASE PROCESS                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Requisition  →  Approval   →  PO        →  Track      →  GRN    →  Payment│
│  (PPG/Admin)    (Maker/      Generation    Delivery     (Stores)  (FA)    │
│                 Checker)                                                   │
└────────────────────────────────────────────────────────────────────────────┘
```

### Payment Methods

| Method | Use Case | Control |
|--------|----------|---------|
| NEFT | Standard vendor payments | Bank reconciliation |
| Cheque | Credit vendors (30+ days) | Cheque register |
| Cash | Emergency/ad-hoc purchases | Cash book entry |

### Item Master Requirements

| Field | Description |
|-------|-------------|
| Part Number | Unique identifier |
| Inward Date | Receipt date |
| Description | Item details |
| Quantity | Stock level |
| Supplier Details | Vendor information |
| Reorder Level | Minimum stock threshold |

---

## 5. Logistics Process

### 5.1 Forward Logistics (Product Delivery)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          FORWARD LOGISTICS                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Production  →  Site     →  Site    →  Billing  →  Dispatch  →  Security  │
│  Complete      Survey      Ready                   Documents     Gate Pass │
│                                                                            │
│       ↓                                                                    │
│                                                                            │
│  Transport  →  Fleet     →  Client    →  Unload   →  Document  →  FA      │
│  Arrange      Tracking     Delivery                 Submission   Close    │
└────────────────────────────────────────────────────────────────────────────┘
```

### 5.2 Reverse Logistics (Returns/Repairs)

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          REVERSE LOGISTICS                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Incident   →  Fault     →  Return   →  Security  →  Transport  →  OEM/   │
│  Ticket       Assess       Docs       Clearance     Pickup       Factory  │
│                                                                            │
│       ↓                                                                    │
│                                                                            │
│  Repair    →  Return     →  Client   →  Replace   →  Close                │
│              Ship          Delivery    Part        Ticket                  │
└────────────────────────────────────────────────────────────────────────────┘
```

### 5.3 Inward Supply Logistics

```
┌────────────────────────────────────────────────────────────────────────────┐
│                       INWARD SUPPLY LOGISTICS                              │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Multiple   →  Transporter  →  Source  →  Fleet   →  Destination          │
│  POs           Coordinate      WH        Track      WH                     │
│                                                                            │
│       ↓                                                                    │
│                                                                            │
│  Local     →  Gate Entry  →  Store    →  GRN     →  FA                    │
│  Pickup       Factory       Inward      Create     Documents              │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## 6. Project & Commissioning Process

### Commissioning Workflow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                      PROJECT & COMMISSIONING                               │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Production  →  Schedule  →  Approval  →  Notify   →  Receive  →  Verify  │
│  Ready         Visit       Workflow     Team        Goods      Checklist  │
│                                                                            │
│       ↓                                                                    │
│                                                                            │
│  Commission  →  Install   →  Test     →  Training  →  Handover  →  Close  │
│                                          (If req)    Client      Project  │
└────────────────────────────────────────────────────────────────────────────┘
```

### Key Features

| Feature | Description |
|---------|-------------|
| Mobile App | Field team access via handheld devices |
| TA Settlement | Travel allowance linked to approved schedule |
| Emergency Travel | Top management approval required |
| IoE Tracking | Income over Expenditure per project |
| Spare Requisition | Emergency parts via maker/checker |

### Project Team SOPs

1. Project rep must be aware of finished goods status
2. Commissioning team informed of dispatch/delivery details
3. Product verified against checklist at receipt
4. Damage/short-shipment reported immediately to HQ
5. All activities tracked in system via mobile app

---

## 7. Support & Incident Management

### Incident Flow

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        INCIDENT MANAGEMENT                                 │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  Incident   →  Helpdesk  →  Categorize  →  Assign   →  Schedule  →        │
│  (Ph/Em/Web)   Ack         Priority      Resolver    Engineer            │
│                                                                            │
│       ↓                                                                    │
│                                                                            │
│  Troubleshoot  →  Spare   →  Resolve   →  Verify   →  Close    →  Feedback│
│                   Check      Issue       Restoration  Ticket             │
└────────────────────────────────────────────────────────────────────────────┘
```

### Incident Sources

| Channel | Description |
|---------|-------------|
| Phone | Direct helpdesk call |
| Email | Support email address |
| Self-Service | Customer portal/web |

### Spare Availability Check Sequence

```
Site Inventory → Factory Store → OEM Procurement
       ↓              ↓                ↓
   If Found       If Found         If Required
   Use Local      Ship to Site     Purchase & Ship
```

### Incident Categories

| Category | Source | Resolution Team |
|----------|--------|-----------------|
| Product Issues | Customer | Project/Support |
| IT Asset Issues | Internal | IT Department |
| Facility Issues | Internal | Admin Department |

---

## 8. HR & Financial Accounting

### 8.1 HR Employee Lifecycle

```
┌────────────────────────────────────────────────────────────────────────────┐
│                          HR EMPLOYEE LIFECYCLE                             │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│  ┌─────────────┐                                                           │
│  │  Resource   │ → Hiring → Recruitment → Selection                       │
│  │  Planning   │                            ↓                             │
│  └─────────────┘                                                           │
│                                                                            │
│  Remuneration ← Training ← Performance ← Onboarding                       │
│  & Benefits     Development  Management                                    │
│       │                                                                    │
│       └─────────────────→ Separation                                       │
└────────────────────────────────────────────────────────────────────────────┘
```

### HR Process Steps

| Step | Activity | Responsibility |
|------|----------|----------------|
| 1 | Resource Planning | Department Head + Approval |
| 2 | Hiring | HM creates JD, HR coordinates |
| 3 | Recruitment | HR collects resumes per JD |
| 4 | Selection | Interview board (HM, HRM, Tech, Mgmt) |
| 5 | Remuneration | HR + Management fix package |
| 6 | Training | HM identifies needs, schedules |
| 7 | Performance | Functional head reviews |
| 8 | Separation | As per HR policy |

### 8.2 Financial Accounting Types

| Type | Flow | Key Control |
|------|------|-------------|
| Purchase Accounting | PO → GRN → Invoice → Match → Payment | Three-way matching |
| Sales Accounting | PO → Production → Bill → Follow-up | Production linkage |
| Expense Accounting | Claim → Approval → Payroll → Disburse | Maker/checker |
| Tax & Statutory | Excise, CST/VAT, TDS, Professional | Compliance calendar |

### Tax Components

| Tax | Applicability |
|-----|---------------|
| Excise Duty | On finished goods |
| CST | Interstate purchase (2% with Form-C) |
| VAT | Local purchase (14.5%) |
| Customs | Import purchase (33%) |
| TDS | Employee salary, Professional fees |

---

## Document Control

| Field | Value |
|-------|-------|
| Document ID | B3-PF-ERP-001 |
| Version | 3.0 |
| Original Reference | SIS/B3/0316/001 |
| Status | For Implementation |
| Created For | B3 MACBIS Ltd |
| Developed By | KreupAI Technologies LLC |
| Classification | Confidential |

---

*A Solution for B3 MACBIS Ltd, Developed by KreupAI Technologies LLC © 2024*
