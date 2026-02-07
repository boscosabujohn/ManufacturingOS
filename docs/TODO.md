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
- [ ] **1.1 Record Work Awarded Date**
  - [ ] [M] `awardDate` field in Project entity.
  - [ ] [A] Project creation service with auto-ID generation.
  - [ ] [S] Awards for past 12 months.
  - [ ] [W] Sales conversion API wired to Dashboard.
  - [ ] [U] "Project Created" milestone in timeline.
- [ ] **1.2 Attach Confirmation Mail/Docs**
  - [ ] [M] `ProjectAttachment` table with category "CONFIRMATION".
  - [ ] [A] Multi-file S3 upload with metadata tracking.
  - [ ] [S] Sample PDF email confirmations.
  - [ ] [W] Document control widget for Project Start.
  - [ ] [U] Document preview and metadata display.
- [ ] **1.6 Create/Upload BOQ Document**
  - [ ] [M] `ProjectBOQ` schema linked to `ProjectItem` master.
  - [ ] [A] Excel/CSV BOQ parser service.
  - [ ] [S] Sample BOQ for "Industrial Kitchen 2026".
  - [ ] [W] Line-item grid with bulk upload capability.
  - [ ] [U] Validation UI for missing/incorrect item codes.
- [ ] **1.7-1.9 Design Assets (Drawings, 3D Renders)**
  - [ ] [M] Media library mapping for Project ID.
  - [ ] [A] Version tracking for CAD/3D files.
  - [ ] [S] Sample DWG and OBJ files.
  - [ ] [W] Asset gallery component for Project page.
  - [ ] [U] Deep-zoom preview for industrial drawings.
- [ ] **1.10-1.11 Sales-to-Project Handover Gate**
  - [ ] [M] `HandoverStatus` in Workflow Engine.
  - [ ] [A] Mandatory field validation script for Handover.
  - [ ] [S] Handover logs with approval comments.
  - [ ] [W] Notification trigger to Project Team.
  - [ ] [U] Handover Wizard with "Checklist Gate" enforcement.

### Phase 2: Design Verification & Site Assessment
- [ ] **2.1-2.3 Comparison Tools (BOQ vs Drawings vs 3D)**
  - [ ] [M] `DiscrepancyLog` table per project.
  - [ ] [A] Automated mismatch detection logic.
  - [ ] [S] Sample discrepancy reports.
  - [ ] [W] Side-by-side comparison UI.
  - [ ] [U] Discrepancy highlights in visual viewer.
- [ ] **2.4-2.5 Site Visit & Measurements (Mobile Focused)**
  - [ ] [M] `SiteSurvey` table with lat/long and 50+ measurement fields.
  - [ ] [A] Mobile-first survey completion API.
  - [ ] [S] Survey data for 10 recent sites.
  - [ ] [W] Offline-sync capability for field engineers.
  - [ ] [U] Mobile measurement input with photo evidence.
- [ ] **2.7-2.8 Client Approval Portal**
  - [ ] [M] `ExternalApproval` table for Client interactions.
  - [ ] [A] Magic-link auth service for client signatures.
  - [ ] [S] Signed approval logs.
  - [ ] [W] Client-facing drawing approval UI.
  - [ ] [U] Digital E-signature widget.
- [ ] **2.14-2.16 Cabinet Marking & Photo Reporting**
  - [ ] [M] `MarkingReport` linked to Project Phase 2.
  - [ ] [A] Photo categorization and timestamping.
  - [ ] [S] Marking reports with site photos.
  - [ ] [W] Grid for multi-photo site status updates.
  - [ ] [U] Interactive site map with marking overlay.

### Phase 3: Technical Design & Detailed BOM
- [ ] **3.6 Technical Timeline Tracking**
  - [ ] [M] `TargetCompletion` field in ProjectTask.
  - [ ] [A] Auto-escalation service for design delays.
  - [ ] [S] Design task history for capacity planning.
  - [ ] [W] Designer workload dashboard.
  - [ ] [U] Gantt chart view for Design Phase.
- [ ] **3.8-3.9 Accessories & Fittings BOM Generation**
  - [ ] [M] `BOMHeader` and `BOMDetail` tables.
  - [ ] [A] Recursive component generator from Library.
  - [ ] [S] 50-item granular BOM for "Steel Shutter Unit".
  - [ ] [W] Multi-edit BOM grid with real-time totals.
  - [ ] [U] Visual BOM explosion tree.
- [ ] **3.10-3.11 BOM Verification Gate**
  - [ ] [M] `BOMStatus` field with "Verified" lock.
  - [ ] [A] Cross-reference check (BOM vs Inventory Master).
  - [ ] [S] Verification logs with designer sign-off.
  - [ ] [W] "Submit to Procurement" workflow trigger.
  - [ ] [U] Gap analysis report (BOM vs Stock).

### Phase 4: Procurement & Material Management
- [ ] **4.2 Stock Availability Check (Real-time)**
  - [ ] [M] `InventoryReservation` table linked to BOM.
  - [ ] [A] Atomic stock locking for project items.
  - [ ] [S] Sample stock allocations for ongoing projects.
  - [ ] [W] Stock availability dashboard per project.
  - [ ] [U] Red/Green indicators in the BOM view.
- [ ] **4.3-4.5 PR to PO Workflow**
  - [ ] [M] Linked ID chain: BOM -> PR -> PO.
  - [ ] [A] Multi-vendor selection and comparison API.
  - [ ] [S] Complete procurement lifecycle for 10 POs.
  - [ ] [W] "Compare Vendors" UI with price/lead time.
  - [ ] [U] Visual status board for material inbound.
- [ ] **4.8 Vendor Payment Gate**
  - [ ] [M] `FinanceTrigger` linked to PO status.
  - [ ] [A] AP integration service for payment release.
  - [ ] [S] Payment history for top 5 vendors.
  - [ ] [W] Procurement-to-Finance status bridge.
  - [ ] [U] "Paid" badge in the Procurement dashboard.
- [ ] **4.9-4.11 Goods Receipt (GRN) with QC**
  - [ ] [M] `GRN` header-detail with matching PO IDs.
  - [ ] [A] Over-delivery and Under-delivery logic.
  - [ ] [S] GRN records for sample raw materials.
  - [ ] [W] Barcode-scanning receipt service.
  - [ ] [U] Inspection form for inward quality check.

### Phase 5: Production & Fabrication
- [ ] **5.3 Nesting & Bending Drawings**
  - [ ] [M] `NestingAsset` table with revision history.
  - [ ] [A] Integration with Nesting Software output (JSON/DXF).
  - [ ] [S] Samples for nested sheet layouts.
  - [ ] [W] Technical-to-Production asset bridge.
  - [ ] [U] 2D preview of nested parts list.
- [ ] **5.5-5.10 Machine Operations Tracking**
  - [ ] [M] `ProductionLog` with Start/Stop/Idle/Reject counts.
  - [ ] [A] OEE calculation API (Availability/Performance/Quality).
  - [ ] [S] Real shift data for Laser and CNC stations.
  - [ ] [W] IoT simulated bridge for machine status.
  - [ ] [U] Real-time "Factory Floor" dashboard.
- [ ] **5.6 Logo Etching Verification ✨**
  - [ ] [M] `LogoVerification` mandatory field in Operation 5.6.
  - [ ] [A] Hard "Gate" check before Bending (Stage 5.7).
  - [ ] [S] QC logs for branding verification.
  - [ ] [W] Production step enforcement logic.
  - [ ] [U] Visual alert: "Logo Required before Bending".
- [ ] **5.12-5.13 Trial Wall Installation**
  - [ ] [M] `TrialReport` with photo and checklist.
  - [ ] [A] Design discrepancy feedback trigger.
  - [ ] [S] Trial reports for 5 prototypes.
  - [ ] [W] Floor-to-Design communication loop.
  - [ ] [U] Trial completion photo gallery.

### Phase 6: Quality Control & Packaging
- [ ] **6.1-6.3 QC Inspection & Rework**
  - [ ] [M] `DefectLog` with severity P1/P2/P3.
  - [ ] [A] Rework routing service (Back to Stage X).
  - [ ] [S] 50+ defect samples with categorization.
  - [ ] [W] QC inspector tablet-friendly form.
  - [ ] [U] Defect heat-map (where are we failing most?).
- [ ] **6.7-6.8 Packaging & Labeling**
  - [ ] [M] `PackingList` and `BoxLabel` templates.
  - [ ] [A] Auto-generation of labels (QR/Barcode).
  - [ ] [S] Packing lists for complex projects.
  - [ ] [W] Printing service integration (Zebra/PDF).
  - [ ] [U] Packaging progress dashboard (By Box/Crate).

### Phase 7: Logistics & Delivery
- [ ] **7.1-7.3 Payment & Billing Gate**
  - [ ] [M] `BillingTrigger` in Finance module.
  - [ ] [A] Mandatory Payment Check API before Dispatch.
  - [ ] [S] Invoices and Payment receipts.
  - [ ] [W] Logistics-to-Finance gateway.
  - [ ] [U] Clear/Blocked status badge for dispatch.
- [ ] **7.12-7.13 Site Delivery & GPS Tracking**
  - [ ] [M] `DispatchTrip` with driver/vehicle/GPS logs.
  - [ ] [A] Google Maps tracking integration.
  - [ ] [S] Trip history for 50 deliveries.
  - [ ] [W] Live map view for Project Managers.
  - [ ] [U] Delivery confirmation (POD) with photo.

### Phase 8: Installation & Handover
- [ ] **8.1-8.3 Tool Management (Site Deployment)**
  - [ ] [M] `ToolDeployment` table (Tool ID -> Site ID).
  - [ ] [A] Issue/Return logic with asset depreciation.
  - [ ] [S] 100+ site-deployed tools.
  - [ ] [W] Tool requisition form for Install Teams.
  - [ ] [U] "Tools on Site" inventory view.
- [ ] **8.7-8.14 Daily Progress & Daily Cleaning**
  - [ ] [M] `DailyInstallReport` with status/photo.
  - [ ] [A] Automated daily digest to Client.
  - [ ] [S] 30 days of progress reports.
  - [ ] [W] Mobile photo update service.
  - [ ] [U] Client-facing progress view.
- [ ] **8.18-8.20 Project Handover & Sign-off**
  - [ ] [M] `HandoverDocument` with E-sign block.
  - [ ] [A] Closure script (Archive project, Release resources).
  - [ ] [S] Completed handovers for 2025 projects.
  - [ ] [W] E-signature portal for Client.
  - [ ] [U] "End of Project" celebration dashboard.

---

## 🛠️ 2. MODULE-SPECIFIC DEEP DIVE (13 MODULES)

### 2.1 CRM & SALES
- [ ] **Lead Management sub-features**
  - [ ] Source analytics.
  - [ ] Auto-assignment based on region.
  - [ ] Conversion success rate reports.
- [ ] **Quotation Engine sub-features**
  - [ ] Multi-currency quotes.
  - [ ] Tax engine for global jurisdictions.
  - [ ] Margin health check (Warning if <15%).

### 2.2 PURCHASE & STORES
- [ ] **Vendor Scorecard sub-features**
  - [ ] Delivery time accuracy.
  - [ ] Quality pass/fail stats.
  - [ ] Automated contract renewal alerts.

### 2.3 PRODUCTION sub-features
- [ ] **Work Center Management**
  - [ ] Shift planning (Day/Night).
  - [ ] Machine maintenance log.
  - [ ] Labor hours vs Machine hours analytics.

### 2.4 INVENTORY sub-features
- [ ] **Advanced Stock Valuation**
  - [ ] FIFO/LIFO/Weighted Average automation.
  - [ ] Obsolete stock flagging.
  - [ ] Cycle count scheduling.

### 2.5 PROJECT MANAGEMENT (PMO)
- [ ] **Income over Expenditure (IoE) Tracking ✨**
  - [ ] [M] Integrated Budget vs Actual P&L per project.
  - [ ] [A] Auto-update from PO and Payroll modules.
  - [ ] [S] IoE data for 5 diverse projects.
  - [ ] [W] Direct line to Finance ledger.
  - [ ] [U] Real-time profitability gauge on Dashboard.

### 2.6 FINANCE & HR sub-features
- [ ] **Finance**
  - [ ] Bank reconciliation.
  - [ ] Multi-entity consolidation.
  - [ ] Statutory compliance reports.
- [ ] **HR**
  - [ ] Attendance via biometric integration.
  - [ ] Payroll with tax auto-calc.
  - [ ] Employee self-service portal.

### 2.7 LOGISTICS & AFTER-SALES sub-features
- [ ] **Logistics**
  - [ ] Route optimization.
  - [ ] Freight cost tracking.
- [ ] **After-Sales**
  - [ ] Knowledge base for repair manuals.
  - [ ] Spare parts catalog with one-click order.
  - [ ] SLA tracking per ticket.

---

## 🔬 3. CROSS-CUTTING ADVANCED FEATURES (INDUSTRY 4.0/5.0)

- [ ] **Workflow Designer (Visual)**
  - [ ] [M] Node-Edge schema for process definitions.
  - [ ] [A] Dynamic execution engine for custom flows.
  - [ ] [S] Templates for PR, Leave, and Project gates.
  - [ ] [W] React Flow integration.
  - [ ] [U] Drag-and-drop workflow builder.
- [ ] **Interactive Roadmap / Gantt ✨**
  - [ ] [M] Task dependencies with lag/lead support.
  - [ ] [A] Critical path analysis service.
  - [ ] [S] Sample schedule for 5 large scale projects.
  - [ ] [W] Multi-project Gantt visualization.
  - [ ] [U] Real-time drag to reschedule.
- [ ] **High-Density UI Polish**
  - [ ] [M] User preference table for UI density (Compact/Relaxed).
  - [ ] [A] Responsive layout toggle API.
  - [ ] [S] Default themes (OptiForge Dark/Light/Glass).
  - [ ] [W] Global layout provider.
  - [ ] [U] Unified grid/table system for 100+ screens.

---
*The definitive roadmap for OptiForge 3.0 implementation | Last Updated Feb 6, 2026*
