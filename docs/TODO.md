# OptiForge ERP: Hyper-Granular implementation Roadmap (100% Coverage)

This document represents the absolute technical blueprint for the completion of OptiForge. Every feature, sub-feature, and workflow step is mapped to a set of mandatory 5-point technical requirements.

---

## 🛠️ THE MANDATORY 5-POINT TECHNICAL CHECKLIST
For every line item in this document:
1.  **[M] Model**: Prisma schema definition with relations, unique constraints, and audit trails.
2.  **[A] API**: NestJS Controller, DTO validation, and Service logic with transaction safety.
3.  **[S] Seed**: High-fidelity, idempotent seeder data for testing and demonstration.
4.  **[W] Wiring**: Real frontend-to-backend integration (Axios services, typed API calls).
5.  **[U] UX & Events**: Premium high-density UI components, state management, and real-time SSE/Webhook triggers.

---

## 🏗️ 0. CORE INFRASTRUCTURE & FOUNDATIONS

### 0.1 Cross-Cutting Capabilities
- [ ] **Unified Search & AI Foundation**
  - [ ] [M] Vector store integration (Prisma field or separate DB).
  - [ ] [A] Semantic Search API for Drawings and Item Master.
  - [ ] [S] Sample vector embeddings for 100+ items.
  - [ ] [W] Global search service integrated in Header.
  - [ ] [U] AI-powered suggestions in Search UI.
- [ ] **SSE & Real-Time Event Bus**
  - [ ] [M] EventLog table for system-wide activity tracking.
  - [ ] [A] SSE Controller for broadcasting Task/Approval changes.
  - [ ] [S] Sample event logs for diverse actions.
  - [ ] [W] React `useEventSource` hook for live updates.
  - [ ] [U] Notification Toast system for real-time alerts.

### 0.2 Common Masters (Foundation for All Modules)
- [ ] **Geographic Entities (Country/State/City)**
  - [ ] [M] Full relational mapping for global address support.
  - [ ] [A] Hierarchical lookup APIs.
  - [ ] [S] ISO-standard data for 250+ countries.
  - [ ] [W] Address autocomplete services.
  - [ ] [U] Cascading dropdown components in all forms.
- [ ] **UOM & Currency Masters**
  - [ ] [M] Conversion factor table for multi-UOM handling.
  - [ ] [A] Real-time currency exchange rate service integration.
  - [ ] [S] 50+ manufacturing-specific UOMs (Kg, Sheet, Linear Meter).
  - [ ] [W] Unified UOM formatting utility.
  - [ ] [U] Integrated calculator in line-item grids.

---

## 🚀 1. MANUFACTURING WORKFLOW (THE 8-PHASE ENGINE)

### Phase 1: Project Initiation & Handover
- [x] **1.1 Record Work Awarded Date**
  - [x] [M] `awardDate` field in Project entity.
  - [x] [A] Project creation service with auto-ID generation.
  - [x] [S] Awards for past 12 months.
  - [x] [W] Sales conversion API wired to Dashboard.
  - [x] [U] "Project Created" milestone in timeline.
- [x] **1.2 Attach Confirmation Mail/Docs**
  - [x] [M] `ProjectAttachment` table with category "CONFIRMATION".
  - [x] [A] Multi-file S3 upload with metadata tracking.
  - [x] [S] Sample PDF email confirmations.
  - [x] [W] Document control widget for Project Start.
  - [x] [U] Document preview and metadata display.
- [x] **1.6 Create/Upload BOQ Document**
  - [x] [M] `ProjectBOQ` schema linked to `ProjectItem` master.
  - [x] [A] Excel/CSV BOQ parser service.
  - [x] [S] Sample BOQ for "Industrial Kitchen 2026".
  - [x] [W] Line-item grid with bulk upload capability.
  - [x] [U] Validation UI for missing/incorrect item codes.
- [x] **1.7-1.9 Design Assets (Drawings, 3D Renders)**
  - [x] [M] Media library mapping for Project ID.
  - [x] [A] Version tracking for CAD/3D files.
  - [x] [S] Sample DWG and OBJ files.
  - [x] [W] Asset gallery component for Project page.
  - [x] [U] Deep-zoom preview for industrial drawings.
- [x] **1.10-1.11 Sales-to-Project Handover Gate**
  - [x] [M] `HandoverStatus` in Workflow Engine.
  - [x] [A] Mandatory field validation script for Handover.
  - [x] [S] Handover logs with approval comments.
  - [x] [W] Notification trigger to Project Team.
  - [x] [U] Handover Wizard with "Checklist Gate" enforcement.
Requested Completion: 100%

### Phase 2: Design Verification & Site Assessment
- [x] **2.1-2.3 Comparison Tools (BOQ vs Drawings vs 3D)**
  - [x] [M] `DiscrepancyLog` table per project.
  - [x] [A] Automated mismatch detection logic.
  - [x] [S] Sample discrepancy reports.
  - [x] [W] Side-by-side comparison UI.
  - [x] [U] Discrepancy highlights in visual viewer.
- [x] **2.4-2.5 Site Visit & Measurements (Mobile Focused)**
  - [x] [M] `SiteSurvey` table with lat/long and 50+ measurement fields.
  - [x] [A] Mobile-first survey completion API.
  - [x] [S] Survey data for 10 recent sites.
  - [x] [W] Offline-sync capability for field engineers.
  - [x] [U] Mobile measurement input with photo evidence.
- [x] **2.7-2.8 Client Approval Portal**
  - [x] [M] `ExternalApproval` table for Client interactions.
  - [x] [A] Magic-link auth service for client signatures.
  - [x] [S] Signed approval logs.
  - [x] [W] Client-facing drawing approval UI.
  - [x] [U] Digital E-signature widget.
- [x] **2.14-2.16 Cabinet Marking & Photo Reporting**
  - [x] [M] `MarkingReport` linked to Project Phase 2.
  - [x] [A] Photo categorization and timestamping.
  - [x] [S] Marking reports with site photos.
  - [x] [W] Grid for multi-photo site status updates.
  - [x] [U] Interactive site map with marking overlay.
Requested Completion: 100%

### Phase 3: Technical Design & Detailed BOM
- [x] **3.6 Technical Timeline Tracking**
  - [x] [M] `TargetCompletion` field in ProjectTask.
  - [x] [A] Auto-escalation service for design delays.
  - [x] [S] Design task history for capacity planning.
  - [x] [W] Designer workload dashboard.
  - [x] [U] Gantt chart view for Design Phase.
- [x] **3.8-3.9 Accessories & Fittings BOM Generation**
  - [x] [M] `BOMHeader` and `BOMDetail` tables.
  - [x] [A] Recursive component generator from Library.
  - [x] [S] 50-item granular BOM for "Steel Shutter Unit".
  - [x] [W] Multi-edit BOM grid with real-time totals.
  - [x] [U] Visual BOM explosion tree.
- [x] **3.10-3.11 BOM Verification Gate**
  - [x] [M] `BOMStatus` field with "Verified" lock.
  - [x] [A] Cross-reference check (BOM vs Inventory Master).
  - [x] [S] Verification logs with designer sign-off.
  - [x] [W] "Submit to Procurement" workflow trigger.
  - [x] [U] Gap analysis report (BOM vs Stock).

### Phase 4: Procurement & Material Management
- [x] **4.2 Stock Availability Check (Real-time)**
  - [x] [M] `InventoryReservation` table linked to BOM.
  - [x] [A] Atomic stock locking for project items.
  - [x] [S] Sample stock allocations for ongoing projects.
  - [x] [W] Stock availability dashboard per project.
  - [x] [U] Red/Green indicators in the BOM view.
- [x] **4.3-4.5 PR to PO Workflow**
  - [x] [M] Linked ID chain: BOM -> PR -> PO.
  - [x] [A] Multi-vendor selection and comparison API.
  - [x] [S] Complete procurement lifecycle for 10 POs.
  - [x] [W] "Compare Vendors" UI with price/lead time.
  - [x] [U] Visual status board for material inbound.
- [x] **4.8 Vendor Payment Gate**
  - [x] [M] `FinanceTrigger` linked to PO status.
  - [x] [A] AP integration service for payment release.
  - [x] [S] Payment history for top 5 vendors.
  - [x] [W] Procurement-to-Finance status bridge.
  - [x] [U] "Paid" badge in the Procurement dashboard.
- [x] **4.9-4.11 Goods Receipt (GRN) with QC**
  - [x] [M] `GRN` header-detail with matching PO IDs.
  - [x] [A] Over-delivery and Under-delivery logic.
  - [x] [S] GRN records for sample raw materials.
  - [x] [W] Barcode-scanning receipt service.
  - [x] [U] Inspection form for inward quality check.

### Phase 5: Production & Fabrication
- [x] **5.3 Nesting & Bending Drawings**
  - [x] [M] `NestingAsset` table with revision history.
  - [x] [A] Integration with Nesting Software output (JSON/DXF).
  - [x] [S] Samples for nested sheet layouts.
  - [x] [W] Technical-to-Production asset bridge.
  - [x] [U] 2D preview of nested parts list.
- [x] **5.5-5.10 Machine Operations Tracking**
  - [x] [M] `ProductionLog` with Start/Stop/Idle/Reject counts.
  - [x] [A] OEE calculation API (Availability/Performance/Quality).
  - [x] [S] Real shift data for Laser and CNC stations.
  - [x] [W] IoT simulated bridge for machine status.
  - [x] [U] Real-time "Factory Floor" dashboard.
- [x] **5.6 Logo Etching Verification ✨**
  - [x] [M] `LogoVerification` mandatory field in Operation 5.6.
  - [x] [A] Hard "Gate" check before Bending (Stage 5.7).
  - [x] [S] QC logs for branding verification.
  - [x] [W] Production step enforcement logic.
  - [x] [U] Visual alert: "Logo Required before Bending".
- [x] **5.12-5.13 Trial Wall Installation**
  - [x] [M] `TrialReport` with photo and checklist.
  - [x] [A] Design discrepancy feedback trigger.
  - [x] [S] Trial reports for 5 prototypes.
  - [x] [W] Floor-to-Design communication loop.
  - [x] [U] Trial completion photo gallery.

### Phase 6: Quality Control & Packaging
- [x] **6.1-6.3 QC Inspection & Rework**
  - [x] [M] `DefectLog` with severity P1/P2/P3.
  - [x] [A] Rework routing service (Back to Stage X).
  - [x] [S] 50+ defect samples with categorization.
  - [x] [W] QC inspector tablet-friendly form.
  - [x] [U] Defect heat-map (where are we failing most?).
- [x] **6.7-6.8 Packaging & Labeling**
  - [x] [M] `PackingList` and `BoxLabel` templates.
  - [x] [A] Auto-generation of labels (QR/Barcode).
  - [x] [S] Packing lists for complex projects.
  - [x] [W] Printing service integration (Zebra/PDF).
  - [x] [U] Packaging progress dashboard (By Box/Crate).

### Phase 7: Logistics & Delivery
- [x] **7.1-7.3 Payment & Billing Gate**
  - [x] [M] `BillingTrigger` in Finance module.
  - [x] [A] Mandatory Payment Check API before Dispatch.
  - [x] [S] Invoices and Payment receipts.
  - [x] [W] Logistics-to-Finance gateway.
  - [x] [U] Clear/Blocked status badge for dispatch.
- [x] **7.12-7.13 Site Delivery & GPS Tracking**
  - [x] [M] `DispatchTrip` with driver/vehicle/GPS logs.
  - [x] [A] Google Maps tracking integration.
  - [x] [S] Trip history for 50 deliveries.
  - [x] [W] Live map view for Project Managers.
  - [x] [U] Delivery confirmation (POD) with photo.

### Phase 8: Installation & Handover
- [x] **8.1-8.3 Tool Management (Site Deployment)**
  - [x] [M] `ToolDeployment` table (Tool ID -> Site ID).
  - [x] [A] Issue/Return logic with asset depreciation.
  - [x] [S] 100+ site-deployed tools.
  - [x] [W] Tool requisition form for Install Teams.
  - [x] [U] "Tools on Site" inventory view.
- [x] **8.7-8.14 Daily Progress & Daily Cleaning**
  - [x] [M] `DailyInstallReport` with status/photo.
  - [x] [A] Automated daily digest to Client.
  - [x] [S] 30 days of progress reports.
  - [x] [W] Mobile photo update service.
  - [x] [U] Client-facing progress view.
- [x] **8.18-8.20 Project Handover & Sign-off**
  - [x] [M] `HandoverDocument` with E-sign block.
  - [x] [A] Closure script (Archive project, Release resources).
  - [x] [S] Completed handovers for 2025 projects.
  - [x] [W] E-signature portal for Client.
  - [x] [U] "End of Project" celebration dashboard.

---

## 🛠️ 2. MODULE-SPECIFIC DEEP DIVE (13 MODULES)

### 2.1 CRM & SALES
- [x] **Lead Management sub-features**
  - [x] Source analytics.
  - [x] Auto-assignment based on region.
  - [x] Conversion success rate reports.
- [x] **Quotation Engine sub-features**
  - [x] Multi-currency quotes.
  - [x] Tax engine for global jurisdictions.
  - [x] Margin health check (Warning if <15%).

### 2.2 PURCHASE & STORES
- [x] **Vendor Scorecard sub-features**
  - [x] Delivery time accuracy.
  - [x] Quality pass/fail stats.
  - [x] Automated contract renewal alerts.

### 2.3 PRODUCTION sub-features
- [x] **Work Center Management**
  - [x] Shift planning (Day/Night).
  - [x] Machine maintenance log.
  - [x] Labor hours vs Machine hours analytics.

### 2.4 INVENTORY sub-features
- [x] **Advanced Stock Valuation**
  - [x] FIFO/LIFO/Weighted Average automation.
  - [x] Obsolete stock flagging.
  - [x] Cycle count scheduling.

### 2.5 PROJECT MANAGEMENT (PMO)
- [x] **Income over Expenditure (IoE) Tracking ✨**
  - [x] [M] Integrated Budget vs Actual P&L per project.
  - [x] [A] Auto-update from PO and Payroll modules.
  - [x] [S] IoE data for 5 diverse projects.
  - [x] [W] Direct line to Finance ledger.
  - [x] [U] Real-time profitability gauge on Dashboard.

### 2.6 FINANCE & HR sub-features
- [ ] **Finance**
  - [x] **Bank Reconciliation Engine**
    - [x] [M] `BankStatement`, `BankReconciliation`, `ReconciliationMatch` entities.
    - [x] [A] `BankReconciliationService` with auto-matching logic.
    - [x] [S] Multi-bank sample statements and GL matches.
    - [x] [W] Statement upload and matching UI wiring.
    - [x] [U] Manual match/unmatch interactive interface.
  - [x] **Multi-entity Consolidation**
    - [x] [M] `Company` entity and multi-entity GL mapping.
    - [x] [A] `ConsolidationService` for cross-entity balance aggregation.
    - [x] [S] Inter-company transaction samples for elimination testing.
    - [ ] [W] Consolidated reporting API integration.
    - [ ] [U] Comparison dashboard for Parent vs. Subsidy performance.
  - [x] **Statutory Compliance & Tax Reporting**
    - [x] [M] Tax-specific ledger accounts and GST/TDS metadata.
    - [x] [A] Statutory report generation (GST, TDS, P&L, Balance Sheet).
    - [x] [S] Compliance data for current fiscal year.
    - [x] [W] Export to Excel/PDF for statutory filings.
    - [x] [U] Real-time tax liability monitor.
- [ ] **HR**
  - [x] Attendance via biometric integration.
  - [x] Payroll with tax auto-calc.
  - [x] Employee self-service portal.

### 2.7 LOGISTICS & AFTER-SALES sub-features
- [x] **Logistics**
  - [x] Route optimization.
  - [x] Freight cost tracking.
- [x] **After-Sales**
  - [x] Knowledge base for repair manuals.
  - [x] Spare parts catalog with one-click order.
  - [x] SLA tracking per ticket.

---

## 🔬 3. CROSS-CUTTING ADVANCED FEATURES (INDUSTRY 4.0/5.0)

- [/] **Workflow Designer (Visual)**
  - [x] [M] Node-Edge schema for process definitions.
  - [ ] [A] Dynamic execution engine for custom flows.
  - [ ] [S] Templates for PR, Leave, and Project gates.
  - [x] [W] React Flow integration.
  - [x] [U] Drag-and-drop workflow builder.
- [x] **Interactive Roadmap / Gantt ✨**
  - [x] [M] Task dependencies with lag/lead support.
  - [x] [A] Critical path analysis service.
  - [x] [S] Sample schedule for 5 large scale projects.
  - [x] [W] Multi-project Gantt visualization.
  - [x] [U] Real-time drag to reschedule.
- [x] **High-Density UI Polish**
  - [x] [M] User preference table for UI density (Compact/Relaxed).
  - [x] [A] Responsive layout toggle API.
  - [x] [S] Default themes (OptiForge Dark/Light/Glass).
  - [x] [W] Global layout provider.
  - [x] [U] Unified grid/table system for 100+ screens.

---
*The definitive roadmap for OptiForge 3.0 implementation | Last Updated Feb 7, 2026*
