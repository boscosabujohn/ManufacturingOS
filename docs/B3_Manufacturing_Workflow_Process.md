# Manufacturing Workflow Process
## Kitchen Equipment Manufacturing - End-to-End Process Steps

**B3 MACBIS Ltd | ERP System Implementation**  
**Version 1.0 | Based on ACERO Work Structure**

---

## Executive Summary

This document defines the complete manufacturing workflow for kitchen equipment production at B3 MACBIS Ltd. The workflow spans from project award through final handover, encompassing **8 major phases** and **65+ discrete process steps**.

---

## Process Overview

### High-Level Process Flow

```
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 1          PHASE 2           PHASE 3           PHASE 4              │
│  Project          Design &          Technical         Procurement          │
│  Initiation       Site Assessment   Design & BOM      & Materials          │
│  ────────► ────────► ────────► ────────►               │
└─────────────────────────────────────────────────────────────────────────────┘
                                    │
┌─────────────────────────────────────────────────────────────────────────────┐
│  PHASE 5          PHASE 6           PHASE 7           PHASE 8              │
│  Production &     Quality Control   Logistics &       Installation         │
│  Fabrication      & Packaging       Delivery          & Handover           │
│  ────────► ────────► ────────► ────────►               │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Phase 1: Project Initiation & Handover

**Trigger:** New project/order awarded (confirmation email, signed PO, or CRM conversion)

| # | Step | Responsible | System Action | Output |
|---|------|-------------|---------------|--------|
| 1.1 | Record Work Awarded Date | Sales Team | Create Project Record | Project ID Generated |
| 1.2 | Attach Confirmation Mail | Sales Executive | Document Upload | Confirmation Attached |
| 1.3 | Capture Client Details | Sales Team | Link Customer Record | Client Profile Linked |
| 1.4 | Record Sales Person Details | System Auto | Auto-assign from CRM | Owner Assigned |
| 1.5 | Compile Handover Package | Sales Team | Document Checklist | Package Complete |
| 1.6 | Upload BOQ Document | Sales Team | BOQ Parser/Upload | BOQ Attached |
| 1.7 | Upload Drawings | Sales Team | Drawing Repository | Drawings Attached |
| 1.8 | Upload 3D Renders | Sales/Design | Media Upload | 3D Files Attached |
| 1.9 | Record Appliance Details | Sales Team | Appliance Spec Form | Specs Documented |
| 1.10 | Execute Sales-to-Project Handover | Sales Manager | Workflow Trigger | Handover Complete |
| 1.11 | Notify Project Team | System Auto | Auto-notification | Team Notified |
| 1.12 | Record Client Requested Date | Sales Team | Project Timeline | Target Date Set |

**Validation Gate:** Mandatory documents must be attached before handover proceeds.

---

## Phase 2: Design Verification & Site Assessment

**Trigger:** Successful Sales-to-Project handover

| # | Step | Responsible | System Action | Output |
|---|------|-------------|---------------|--------|
| 2.1 | Verify Drawings Against BOQ | Project Team | Verification Checklist | Verification Report |
| 2.2 | Verify 3D Against Drawings | Project Team | Comparison Tool | Discrepancy List |
| 2.3 | Check Client Comments | Project Team | Comment Review | Action Items |
| 2.4 | Schedule Site Visit | Project Supervisor | Calendar Booking | Visit Scheduled |
| 2.5 | Conduct Site Measurement | Site Engineer | Mobile App Entry | Site Dimensions |
| 2.6 | Revise Drawing per Site | Design Team | Drawing Update | Revised Drawings |
| 2.7 | Send Drawings for Approval | Project Team | Approval Workflow | Sent for Approval |
| 2.8 | Receive Client Approval | Client | E-signature/Portal | Approved Drawings |
| 2.9 | Create MEP Drawing | MEP Designer | MEP Module | MEP Drawing |
| 2.10 | Share MEP for Site Work | Project Team | Document Share | MEP Distributed |
| 2.11 | Track MEP Site Work Status | Site Supervisor | Status Update | MEP Status Log |
| 2.12 | Supervise Post-MEP Site | Project Supervisor | Inspection Form | Site Cleared |
| 2.13 | Confirm Site Ready Status | Project Manager | Readiness Gate | Site Ready Flag |
| 2.14 | Coordinate Cabinet Marking | Installation Team | Schedule Task | Marking Scheduled |
| 2.15 | Execute Cabinet Marking | Installation Team | Mark Checklist | Marking Complete |
| 2.16 | Report & Photograph Marking | Installation Team | Photo Upload | Marking Report |
| 2.17 | Calculate Completion Date | Project Manager | Timeline Calc | Project Timeline |
| 2.18 | Assign Project Supervisor | Project Manager | Resource Assignment | Supervisor Assigned |

**Decision Point:** If site not ready, materials route to godown storage.

---

## Phase 3: Technical Design & BOM Generation

**Trigger:** Client approval of drawings + Technical Design resource assignment

| # | Step | Responsible | System Action | Output |
|---|------|-------------|---------------|--------|
| 3.1 | Share BOQ to Technical Team | Project Team | Document Share | BOQ Received |
| 3.2 | Share Drawings to Technical | Project Team | Document Share | Drawings Received |
| 3.3 | Share 3D to Technical Team | Project Team | Document Share | 3D Received |
| 3.4 | Share Additional Information | Project Team | Notes/Comments | Info Shared |
| 3.5 | Conduct Layout Briefing | Project Manager | Meeting Record | Briefing Minutes |
| 3.6 | Calculate Drawing Completion Date | Technical Lead | Timeline Entry | Target Date Set |
| 3.7 | Create Technical Drawings | Technical Designer | CAD System | Tech Drawings |
| 3.8 | Generate Accessories BOM | Technical Team | BOM Generator | Accessories List |
| 3.9 | Generate Other Fittings BOM | Technical Team | BOM Generator | Fittings List |
| 3.10 | Submit BOM to Procurement | Technical Team | Workflow Trigger | BOM Submitted |
| 3.11 | Verify BOM Completeness | Technical Lead | Validation Check | BOM Verified |

**Shutter Specifications:** Glass, Wooden, Stone, Steel doors; Fascia materials; Handle types; SS tops with sink.

---

## Phase 4: Procurement & Material Management

**Trigger:** BOM submitted by Technical Team

| # | Step | Responsible | System Action | Output |
|---|------|-------------|---------------|--------|
| 4.1 | Receive BOM from Technical | Store/Purchase | BOM Receipt | BOM Logged |
| 4.2 | Check Stock Availability | Store Supervisor | Inventory Check | Stock Status |
| 4.3 | Generate Purchase Requisition | Store Team | PR Generation | PR Created |
| 4.4 | Approve Purchase Requisition | Purchase Manager | Approval Workflow | PR Approved |
| 4.5 | Create Purchase Order | Purchase Team | PO Generation | PO Created |
| 4.6 | Track Accessories Purchase | Purchase Team | PO Tracking | Status Updated |
| 4.7 | Track Other Fittings Purchase | Purchase Team | PO Tracking | Status Updated |
| 4.8 | Process Vendor Payments | Accounts Team | Payment Module | Payment Released |
| 4.9 | Receive Accessories at Store | Store Supervisor | GRN Entry | GRN Created |
| 4.10 | Verify Received Materials | Store Supervisor | QC Checklist | Verification Done |
| 4.11 | Report Mismatches | Store Supervisor | Discrepancy Log | Issue Raised |
| 4.12 | Notify Project & Technical | System Auto | Notification | Teams Informed |
| 4.13 | Update Material Availability | Store Team | Inventory Update | Stock Updated |

**Exception Routing:** Quality → QC, Specifications → Technical, Delivery → Logistics

---

## Phase 5: Production & Fabrication

**Trigger:** Drawings verified + Materials available + Capacity allocated

| # | Step | Responsible | System Action | Output |
|---|------|-------------|---------------|--------|
| 5.1 | Brief Technical Drawings to Production | Technical Team | Handover Form | Briefing Complete |
| 5.2 | Verify Drawings by Production | Production Manager | Verification Gate | Drawings Verified |
| 5.3 | Generate Nested/Bending Drawings | Technical Team | Nesting Software | Nested Drawings |
| 5.4 | Release to Production Floor | Production Manager | Work Order | WO Released |
| 5.5 | Execute Laser Cutting | Laser Operator | Machine Log | Cut Parts |
| 5.6 | Etch Company Logo | Laser Operator | Etching Queue | Logo Etched |
| 5.7 | Execute Bending Operations | Bending Operator | Machine Log | Bent Parts |
| 5.8 | Perform Fabrication | Fabrication Team | Progress Entry | Fabricated Parts |
| 5.9 | Perform Welding Work | Welding Team | Progress Entry | Welded Assembly |
| 5.10 | Perform Buffing/Finishing | Finishing Team | Progress Entry | Finished Parts |
| 5.11 | Process Shutters | Shutter Team | Shutter Tracker | Shutters Ready |
| 5.12 | Conduct Trial Wall Installation | Production Team | Trial Record | Trial Complete |
| 5.13 | Report Trial Results | Production Supervisor | Issue Log | Trial Report |
| 5.14 | Supervise Each Stage | Production Supervisor | Stage Sign-off | Stages Approved |

**Critical:** Logo MUST be etched BEFORE bending process.

---

## Phase 6: Quality Control & Packaging

**Trigger:** Production completion flag set

| # | Step | Responsible | System Action | Output |
|---|------|-------------|---------------|--------|
| 6.1 | Execute QC Inspection | QC Team | QC Checklist | Inspection Report |
| 6.2 | Record QC Findings | QC Inspector | Defect Log | Findings Logged |
| 6.3 | Route Defects for Rework | QC Team | Rework Workflow | Rework Assigned |
| 6.4 | Approve QC Clearance | QC Manager | Approval Gate | QC Approved |
| 6.5 | Flag Production Complete | Production Manager | Status Update | Production Done |
| 6.6 | Check Packing Material | Store Supervisor | Inventory Check | Materials Ready |
| 6.7 | Execute Packaging | Packing Team | Packing List | Items Packed |
| 6.8 | Apply Branding/Labels | Packing Team | Label Print | Labels Applied |
| 6.9 | Create Shipping Bill | Store Supervisor | Bill Generation | Shipping Bill |
| 6.10 | Stage for Dispatch | Store Team | Staging Entry | Ready for Ship |

**Packing Materials:** Wooden crates, Wrapping rolls, Branding stickers, Thermocol sheets

---

## Phase 7: Logistics & Delivery

**Trigger:** QC approved + Packaging done + Payments received/credit approved

| # | Step | Responsible | System Action | Output |
|---|------|-------------|---------------|--------|
| 7.1 | Verify Payment Status | Accounts Team | Payment Check | Payment Verified |
| 7.2 | Contact Sales for Pending | Project Team | Alert Trigger | Sales Notified |
| 7.3 | Receive Billing Details | Accounts Team | Billing Entry | Bill Created |
| 7.4 | Select Transport Method | Logistics Team | Transport Selector | Method Selected |
| 7.5 | Share Site Location Details | Project Team | Location Share | Details Shared |
| 7.6 | Share Site Contact Person | Project Team | Contact Entry | Contact Assigned |
| 7.7 | Share Delivery Timings | Project Team | Schedule Entry | Timing Set |
| 7.8 | Inform Transporter | Logistics Team | Dispatch Notice | Transporter Notified |
| 7.9 | Inform Site Contact | Logistics Team | SMS/Email Alert | Site Informed |
| 7.10 | Load with Proper Packing | Store Team | Loading Checklist | Loaded & Verified |
| 7.11 | Generate Dispatch Bill | Store Supervisor | Bill Print | Bill Generated |
| 7.12 | Execute Site Delivery | Transporter | GPS Tracking | Delivered |
| 7.13 | Confirm Unloading | Site Contact | Delivery Receipt | Unloaded |

**Payment Gate:** Requires payment confirmation, credit approval, or management override.

---

## Phase 8: Installation & Handover

**Trigger:** Confirmed site delivery and unloading

| # | Step | Responsible | System Action | Output |
|---|------|-------------|---------------|--------|
| 8.1 | Prepare Tool List per Site | Installation Lead | Tool Checklist | Tool List Ready |
| 8.2 | Verify Tool Availability | Store Team | Inventory Check | Tools Confirmed |
| 8.3 | Pack Tools for Site | Store Team | Tool Pack Log | Tools Packed |
| 8.4 | Assign Installation Team | Project Manager | Team Assignment | Team Assigned |
| 8.5 | Notify Team (1 Day Prior) | System Auto | Auto-notification | Team Notified |
| 8.6 | Send Tools to Site | Logistics Team | Dispatch Entry | Tools Dispatched |
| 8.7 | Begin Site Installation | Installation Team | Start Log | Installation Started |
| 8.8 | Align Cabinets | Installation Team | Progress Entry | Alignment Done |
| 8.9 | Report Trial Wall Installation | Installation Team | Photo Upload | Trial Report |
| 8.10 | Perform Site Buffing | Buffing Technician | Work Log | Buffing Complete |
| 8.11 | Fix Accessories & Doors | Installation Team | Install Checklist | Accessories Fixed |
| 8.12 | Final Door Alignment | Installation Team | Alignment Check | Doors Aligned |
| 8.13 | Upload Work Photographs | Installation Team | Photo Upload | Photos Uploaded |
| 8.14 | Clean Work Area Daily | Installation Team | Daily Checklist | Area Cleaned |
| 8.15 | Conduct Final Inspection | Project Supervisor | Inspection Form | Inspection Done |
| 8.16 | Clean Kitchen for Handover | Installation Team | Final Checklist | Kitchen Clean |
| 8.17 | Return Tools to Factory | Installation Team | Tool Return Log | Tools Returned |
| 8.18 | Execute Project Handover | Project Supervisor | Handover Form | Handover Complete |
| 8.19 | Capture Client Sign-off | Project Supervisor | E-signature | Client Signed |
| 8.20 | Close Project | Project Manager | Project Closure | Project Closed |

---

## Module Integration Map

```
┌────────────────────────────────────────────────────────────────────────────┐
│                        MANUFACTURING WORKFLOW                              │
├────────────────────────────────────────────────────────────────────────────┤
│                                                                            │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│   │  Sales &    │───►│  Production │───►│  Technical  │                   │
│   │    CRM      │    │  Planning   │    │   Design    │                   │
│   └─────────────┘    └─────────────┘    └─────────────┘                   │
│          │                  │                  │                           │
│          ▼                  ▼                  ▼                           │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│   │ Procurement │◄───│   Quality   │◄───│  Logistics  │                   │
│   │  & Stores   │    │   Control   │    │             │                   │
│   └─────────────┘    └─────────────┘    └─────────────┘                   │
│          │                  │                  │                           │
│          ▼                  ▼                  ▼                           │
│   ┌─────────────┐    ┌─────────────┐    ┌─────────────┐                   │
│   │  Finance &  │    │     HR      │    │Installation │                   │
│   │  Accounts   │    │   Module    │    │& Commission │                   │
│   └─────────────┘    └─────────────┘    └─────────────┘                   │
│                                                                            │
└────────────────────────────────────────────────────────────────────────────┘
```

---

## Key Performance Indicators

| KPI | Description | Target |
|-----|-------------|--------|
| Project Cycle Time | Award to Handover duration | As committed |
| First-Time-Right Rate | Projects without rework | >90% |
| QC Pass Rate | First-time QC approval | >95% |
| On-Time Delivery | Delivery vs. committed date | >95% |
| Installation Efficiency | Actual vs. estimated time | <110% |
| Customer Sign-off Time | Installation to handover | <3 days |
| Tool Utilization | Dispatch and return efficiency | 100% return |

---

## Document Control

| Field | Value |
|-------|-------|
| Document ID | B3-WF-MFG-001 |
| Version | 1.0 |
| Status | For Implementation |
| Based On | ACERO Work Structure (08-10-2024) |
| Created For | B3 MACBIS Ltd ERP Implementation |
| Developed By | KreupAI Technologies LLC |
| Review Cycle | Quarterly |

---

*A Solution for B3 MACBIS Ltd, Developed by KreupAI Technologies LLC © 2024*
