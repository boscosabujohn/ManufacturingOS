-- Demo seed — Procurement (part A): categories, budgets, inspections/NCRs, RFQ bids,
-- sourcing strategies, savings initiatives, compliance/risk, calendar, notifications,
-- automation rules, report templates, BOM receipts, audit trail — for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first (all 17 tables here are owned by
-- this file; delete predicate is "companyId" = :company), then re-inserts.
-- References vendors / purchase_orders (PO-DEMO-*) / purchase_requisitions (PR-DEMO-*)
-- / goods_receipts (GR-DEMO-*) via scalar subselects; rfqId values use the RFQ-DEMO-*
-- convention (varchar reference, no hard FK).
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- 1. procurement_categories (referenced by name/category elsewhere in this file)
-- ---------------------------------------------------------------------------
DELETE FROM procurement_categories WHERE "companyId" = :company;
INSERT INTO procurement_categories
  ("companyId", code, name, description, budget, spent, suppliers, items, manager,
   priority, "savingsTarget", "actualSavings", status, "createdAt", "updatedAt")
VALUES
  (:company,'CAT-DEMO-001','Raw Materials - Steel','SS-304/316 sheets, coils and structural steel for fabrication',1200000,742500,2,5,'Rajesh Kumar','high',60000,38400,'active','2025-10-01 09:00:00','2026-08-14 10:30:00'),
  (:company,'CAT-DEMO-002','Components & Fittings','Hinges, handles, castors, shelving clips and general fittings',480000,296300,2,4,'Priya Sharma','medium',24000,15200,'active','2025-10-01 09:05:00','2026-08-14 10:30:00'),
  (:company,'CAT-DEMO-003','Electrical & Controls','Control panels, thermostats, wiring harnesses and switchgear',420000,268100,1,3,'Amit Verma','high',21000,12600,'active','2025-10-01 09:10:00','2026-08-14 10:30:00'),
  (:company,'CAT-DEMO-004','Refrigeration & Compressors','Hermetic compressors, condensers and refrigeration kits',520000,331200,2,2,'Anita Desai','critical',26000,19800,'active','2025-10-01 09:15:00','2026-08-14 10:30:00'),
  (:company,'CAT-DEMO-005','Insulation & Chemicals','PU foam, mineral wool insulation and food-safe cleaning chemicals',260000,143800,1,2,'Vikram Singh','medium',13000,7100,'active','2025-10-01 09:20:00','2026-08-14 10:30:00'),
  (:company,'CAT-DEMO-006','Burners & Gas Train','Burner assemblies, gas manifolds and pilot kits',310000,188400,1,2,'Meera Nair','high',15500,9300,'active','2025-10-01 09:25:00','2026-08-14 10:30:00'),
  (:company,'CAT-DEMO-007','Glass Doors & Packaging','Tempered glass doors, gaskets, crating and packaging material',180000,96500,1,2,'Kiran Reddy','low',9000,4400,'active','2025-10-01 09:30:00','2026-08-14 10:30:00'),
  (:company,'CAT-DEMO-008','Services & Maintenance','AMC, calibration, machine maintenance and jobwork services',150000,71300,1,1,'Deepak Joshi','low',7500,5100,'active','2025-10-01 09:35:00','2026-08-14 10:30:00');

-- ---------------------------------------------------------------------------
-- 2. procurement_budgets (per category per quarter, FY2025-26 H2 + FY2026-27 H1)
-- ---------------------------------------------------------------------------
DELETE FROM procurement_budgets WHERE "companyId" = :company;
INSERT INTO procurement_budgets
  ("companyId", "fiscalYear", name, "budgetType", budget, spent, committed, available,
   "createdAt", "updatedAt")
VALUES
  (:company,'FY2025-26','Raw Materials - Steel - Q3 FY2025-26','category',300000,286400,0,13600,'2025-10-01 10:00:00','2025-12-31 18:00:00'),
  (:company,'FY2025-26','Raw Materials - Steel - Q4 FY2025-26','category',300000,271900,12500,15600,'2026-01-02 10:00:00','2026-03-31 18:00:00'),
  (:company,'FY2026-27','Raw Materials - Steel - Q1 FY2026-27','category',320000,184200,86000,49800,'2026-04-01 10:00:00','2026-06-30 18:00:00'),
  (:company,'FY2026-27','Raw Materials - Steel - Q2 FY2026-27','category',320000,98700,124300,97000,'2026-07-01 10:00:00','2026-09-08 18:00:00'),
  (:company,'FY2025-26','Electrical & Controls - Q4 FY2025-26','category',110000,96300,4200,9500,'2026-01-02 10:05:00','2026-03-31 18:00:00'),
  (:company,'FY2026-27','Electrical & Controls - Q1 FY2026-27','category',115000,71800,22600,20600,'2026-04-01 10:05:00','2026-06-30 18:00:00'),
  (:company,'FY2026-27','Refrigeration & Compressors - Q1 FY2026-27','category',135000,88400,31200,15400,'2026-04-01 10:10:00','2026-06-30 18:00:00'),
  (:company,'FY2026-27','Refrigeration & Compressors - Q2 FY2026-27','category',135000,52100,46800,36100,'2026-07-01 10:10:00','2026-09-08 18:00:00'),
  (:company,'FY2026-27','Insulation & Chemicals - Q2 FY2026-27','category',68000,29400,18700,19900,'2026-07-01 10:15:00','2026-09-08 18:00:00'),
  (:company,'FY2026-27','Procurement Department - Annual FY2026-27','department',2450000,1042600,486300,921100,'2026-04-01 10:20:00','2026-09-08 18:00:00');

-- ---------------------------------------------------------------------------
-- 3. procurement_inspection_templates (referenced by procurement_inspections)
-- ---------------------------------------------------------------------------
DELETE FROM procurement_inspection_templates WHERE "companyId" = :company;
INSERT INTO procurement_inspection_templates
  ("companyId", name, category, checkpoints, usage, "lastUsed", description,
   "createdAt", "updatedAt")
VALUES
  (:company,'Incoming SS Sheet Inspection','Raw Materials - Steel',12,14,'2026-07-14','Surface finish, gauge thickness, grade certificate (SS-304/316), flatness and edge condition checks','2025-10-02 11:00:00','2026-07-14 15:00:00'),
  (:company,'Compressor Receiving QC','Refrigeration & Compressors',10,6,'2026-04-06','Model/serial verification, insulation resistance, no-load current draw and mounting kit completeness','2025-10-02 11:10:00','2026-04-06 15:00:00'),
  (:company,'Control Panel Electrical Check','Electrical & Controls',15,7,'2026-06-25','IP rating verification, wiring continuity, earth bonding, HMI function test and label conformity','2025-10-02 11:20:00','2026-06-25 15:00:00'),
  (:company,'Burner Assembly Verification','Burners & Gas Train',8,4,'2026-05-11','Nozzle bore check, gas-train leak test at 1.5x working pressure, pilot ignition and flame stability','2025-10-02 11:30:00','2026-05-11 15:00:00'),
  (:company,'Packaging & Glass Door Check','Glass Doors & Packaging',6,3,'2026-06-25','Tempering stamp, glass edgework, gasket seating, crate integrity and moisture barrier verification','2025-10-02 11:40:00','2026-06-25 15:00:00');

-- ---------------------------------------------------------------------------
-- 4. procurement_inspections (tied to GR-DEMO receipts / PO-DEMO orders)
--    2 failures (PO-DEMO-0012 burners, PO-DEMO-0017 glass doors) feed the NCRs below.
-- ---------------------------------------------------------------------------
DELETE FROM procurement_inspections WHERE "companyId" = :company;
INSERT INTO procurement_inspections
  ("companyId", "poNumber", "supplierId", supplier, items, quantity, priority, "dueDate",
   status, inspector, "riskLevel", "templateId", result, "defectsFound", "resultNotes",
   "rejectionReason", "createdAt", "updatedAt")
VALUES
  (:company,'PO-DEMO-0001',(SELECT id::text FROM vendors WHERE "vendorName"='Prime Steel Suppliers' LIMIT 1),'Prime Steel Suppliers','SS-304 Sheets 1.2mm (GR-DEMO-0001)',120,'high','2025-10-24','completed','Suresh Patel','medium',(SELECT id::text FROM procurement_inspection_templates WHERE name='Incoming SS Sheet Inspection' AND "companyId" = :company),'pass',0,'All 12 checkpoints cleared; mill test certificates match heat numbers.',NULL,'2025-10-23 14:00:00','2025-10-24 11:30:00'),
  (:company,'PO-DEMO-0002',(SELECT id::text FROM vendors WHERE "vendorName"='Industrial Components Ltd.' LIMIT 1),'Industrial Components Ltd.','Hinges & castor sets (GR-DEMO-0002)',450,'medium','2025-11-07','completed','Suresh Patel','low',NULL,'pass',2,'Two castors with cosmetic scuffs accepted under concession; functionally OK.',NULL,'2025-11-06 14:00:00','2025-11-07 10:15:00'),
  (:company,'PO-DEMO-0003',(SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies' LIMIT 1),'ElectroTech Supplies','Control panels 3-phase (GR-DEMO-0003)',30,'high','2025-11-21','completed','Amit Verma','medium',(SELECT id::text FROM procurement_inspection_templates WHERE name='Control Panel Electrical Check' AND "companyId" = :company),'pass',0,'Continuity and earth bonding within limits; HMI firmware v2.4 verified.',NULL,'2025-11-20 14:00:00','2025-11-21 16:45:00'),
  (:company,'PO-DEMO-0005',(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.' LIMIT 1),'Bharat Metal Works Pvt. Ltd.','SS-316 sheets & channel stock (GR-DEMO-0005)',85,'high','2025-12-19','completed','Suresh Patel','medium',(SELECT id::text FROM procurement_inspection_templates WHERE name='Incoming SS Sheet Inspection' AND "companyId" = :company),'pass',1,'One sheet with minor edge burr, reworked in-house; balance accepted.',NULL,'2025-12-18 14:00:00','2025-12-19 12:00:00'),
  (:company,'PO-DEMO-0011',(SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies' LIMIT 1),'ElectroTech Supplies','Thermostats & wiring harnesses (GR-DEMO-0011)',260,'medium','2026-03-24','completed','Amit Verma','low',(SELECT id::text FROM procurement_inspection_templates WHERE name='Control Panel Electrical Check' AND "companyId" = :company),'pass',0,'Sample plan AQL 1.0 passed on 32-piece sample.',NULL,'2026-03-23 14:00:00','2026-03-24 09:40:00'),
  (:company,'PO-DEMO-0012',(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.' LIMIT 1),'Bharat Metal Works Pvt. Ltd.','Burner assemblies 4-ring (GR-DEMO-0012)',48,'high','2026-04-07','completed','Meera Nair','high',(SELECT id::text FROM procurement_inspection_templates WHERE name='Burner Assembly Verification' AND "companyId" = :company),'fail',6,'6 of 48 burner assemblies failed gas-train leak test at 1.5x working pressure.','Leak at manifold brazing joint on 6 units; partial acceptance of 42 units, 6 rejected to vendor.','2026-04-06 14:00:00','2026-04-07 17:20:00'),
  (:company,'PO-DEMO-0013',(SELECT id::text FROM vendors WHERE "vendorName"='Chemical Solutions GmbH' LIMIT 1),'Chemical Solutions GmbH','PU foam & food-safe degreaser (GR-DEMO-0013)',140,'medium','2026-04-28','completed','Vikram Singh','low',NULL,'pass',0,'Batch COA verified; shelf-life > 18 months on all lots.',NULL,'2026-04-27 14:00:00','2026-04-28 10:05:00'),
  (:company,'PO-DEMO-0014',(SELECT id::text FROM vendors WHERE "vendorName"='Prime Steel Suppliers' LIMIT 1),'Prime Steel Suppliers','SS-304 sheets 1.5mm (GR-DEMO-0014)',95,'high','2026-05-12','completed','Suresh Patel','medium',(SELECT id::text FROM procurement_inspection_templates WHERE name='Incoming SS Sheet Inspection' AND "companyId" = :company),'pass',0,'Gauge and flatness within tolerance across all bundles.',NULL,'2026-05-11 14:00:00','2026-05-12 11:10:00'),
  (:company,'PO-DEMO-0017',(SELECT id::text FROM vendors WHERE "vendorName"='PackRight Solutions' LIMIT 1),'PackRight Solutions','Tempered glass doors & crating (GR-DEMO-0017)',60,'medium','2026-06-26','completed','Kiran Reddy','medium',(SELECT id::text FROM procurement_inspection_templates WHERE name='Packaging & Glass Door Check' AND "companyId" = :company),'fail',4,'4 glass doors with edge chips beyond acceptance limit; crate moisture barrier torn on one pallet.','Edge chipping > 2mm on 4 doors; transit damage suspected. Rejected 4 units, debit note raised.','2026-06-25 14:00:00','2026-06-26 16:30:00'),
  (:company,'PO-DEMO-0018',(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.' LIMIT 1),'Bharat Metal Works Pvt. Ltd.','Gas manifolds & fasteners (GR-DEMO-0018)',310,'medium','2026-07-16','in-progress','Meera Nair','medium',(SELECT id::text FROM procurement_inspection_templates WHERE name='Burner Assembly Verification' AND "companyId" = :company),NULL,NULL,NULL,NULL,'2026-07-14 14:00:00','2026-07-15 09:00:00'),
  (:company,'PO-DEMO-0020',(SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies' LIMIT 1),'ElectroTech Supplies','Switchgear & contactors (upcoming receipt)',75,'medium','2026-09-18','pending','Amit Verma','low',(SELECT id::text FROM procurement_inspection_templates WHERE name='Control Panel Electrical Check' AND "companyId" = :company),NULL,NULL,NULL,NULL,'2026-09-05 14:00:00','2026-09-05 14:00:00');

-- ---------------------------------------------------------------------------
-- 5. procurement_ncrs (raised from the two failed inspections above)
-- ---------------------------------------------------------------------------
DELETE FROM procurement_ncrs WHERE "companyId" = :company;
INSERT INTO procurement_ncrs
  ("companyId", "ncrNumber", "inspectionId", "supplierId", supplier, title, description,
   severity, status, "rootCause", "correctiveAction", "createdAt", "updatedAt")
VALUES
  (:company,'NCR-DEMO-0001',(SELECT id::text FROM procurement_inspections WHERE "poNumber"='PO-DEMO-0012' AND "companyId" = :company LIMIT 1),(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.' LIMIT 1),'Bharat Metal Works Pvt. Ltd.','Gas leak at burner manifold brazing','6 of 48 four-ring burner assemblies from GR-DEMO-0012 failed the 1.5x pressure leak test at the manifold brazing joint.','major','closed','Vendor changed brazing alloy batch without requalification; joint porosity under pressure.','Vendor to 100% leak-test at source and submit test log with each lot; replacement 6 units received and passed on 2026-04-21.','2026-04-07 18:00:00','2026-04-22 12:00:00'),
  (:company,'NCR-DEMO-0002',(SELECT id::text FROM procurement_inspections WHERE "poNumber"='PO-DEMO-0017' AND "companyId" = :company LIMIT 1),(SELECT id::text FROM vendors WHERE "vendorName"='PackRight Solutions' LIMIT 1),'PackRight Solutions','Glass door edge chipping beyond limit','4 tempered glass doors from GR-DEMO-0017 with edge chips exceeding 2mm; one pallet had a torn moisture barrier.','major','in_progress','Insufficient edge protection foam in crate design; forklift handling damage in transit.','Revised crate design with corner blocks and thicker edge foam under trial; debit note DN-2026-014 raised for 4 rejected doors.','2026-06-26 17:00:00','2026-08-30 10:00:00'),
  (:company,'NCR-DEMO-0003',(SELECT id::text FROM procurement_inspections WHERE "poNumber"='PO-DEMO-0002' AND "companyId" = :company LIMIT 1),(SELECT id::text FROM vendors WHERE "vendorName"='Industrial Components Ltd.' LIMIT 1),'Industrial Components Ltd.','Cosmetic scuffing on castor housings','2 castor sets from GR-DEMO-0002 showed cosmetic scuffs; accepted under concession, logged for supplier trend tracking.','minor','closed','Loose parts packed without individual poly-bagging.','Vendor agreed to poly-bag castor sets individually from next lot onward.','2025-11-07 11:00:00','2025-11-14 09:30:00'),
  (:company,'NCR-DEMO-0004',(SELECT id::text FROM procurement_inspections WHERE "poNumber"='PO-DEMO-0005' AND "companyId" = :company LIMIT 1),(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.' LIMIT 1),'Bharat Metal Works Pvt. Ltd.','Edge burr on SS-316 sheet','Single SS-316 sheet in GR-DEMO-0005 with edge burr from shearing; reworked in-house, cost recovery not pursued.','minor','closed','Worn shear blade at vendor slitting line.','Vendor confirmed blade replacement schedule moved from 6 to 4 weeks.','2025-12-19 13:00:00','2026-01-05 10:00:00');

-- ---------------------------------------------------------------------------
-- 6. procurement_rfq_templates (before rfq_bids)
-- ---------------------------------------------------------------------------
DELETE FROM procurement_rfq_templates WHERE "companyId" = :company;
INSERT INTO procurement_rfq_templates
  ("companyId", name, category, type, description, content, "createdAt", "updatedAt")
VALUES
  (:company,'Standard RFQ - Stainless Steel Sheets','Raw Materials - Steel','RFQ','Quarterly RFQ template for SS-304/316 sheet and coil requirements with mill certificate clauses.','{"sections":["Scope","Specifications","Quantity Schedule","Quality & Certificates","Delivery Terms","Payment Terms"],"validityDays":30,"requiredDocs":["Mill Test Certificate","ISO 9001"]}','2025-10-03 09:00:00','2026-04-02 11:00:00'),
  (:company,'Standard RFQ - Compressors & Refrigeration','Refrigeration & Compressors','RFQ','RFQ template for hermetic compressors and refrigeration kits including warranty and spares clauses.','{"sections":["Scope","Technical Specs","Warranty","Spares & Service","Delivery Terms","Payment Terms"],"validityDays":45,"requiredDocs":["Type Test Report","Warranty Card"]}','2025-10-03 09:10:00','2026-02-10 11:00:00'),
  (:company,'Standard RFQ - Electrical Panels','Electrical & Controls','RFQ','RFQ template for control panels and switchgear with IP-rating and CE/IS compliance requirements.','{"sections":["Scope","Panel Schedule","Compliance","Testing & FAT","Delivery Terms","Payment Terms"],"validityDays":30,"requiredDocs":["Routine Test Certificate","CE/IS Declaration"]}','2025-10-03 09:20:00','2026-05-18 11:00:00'),
  (:company,'RFP - Annual Maintenance Services','Services & Maintenance','RFP','Request-for-proposal template for AMC and calibration service contracts with SLA scoring matrix.','{"sections":["Scope of Services","SLA Matrix","Team & Escalation","Pricing Model","References"],"validityDays":60,"evaluation":{"technical":60,"commercial":40}}','2025-10-03 09:30:00','2026-01-20 11:00:00'),
  (:company,'Standard RFQ - Packaging & Crating','Glass Doors & Packaging','RFQ','RFQ template for export-grade crating, glass door packaging and moisture barrier specs.','{"sections":["Scope","Crate Drawings","Material Specs","Delivery Terms","Payment Terms"],"validityDays":21,"requiredDocs":["ISPM-15 Certificate"]}','2025-10-03 09:40:00','2026-06-30 11:00:00');

-- ---------------------------------------------------------------------------
-- 7. procurement_rfq_bids (rfqId uses RFQ-DEMO-* convention; varchar ref, no FK)
-- ---------------------------------------------------------------------------
DELETE FROM procurement_rfq_bids WHERE "companyId" = :company;
INSERT INTO procurement_rfq_bids
  ("companyId", "rfqId", "supplierId", "supplierName", amount, status, notes,
   "createdAt", "updatedAt")
VALUES
  (:company,'RFQ-DEMO-0001',(SELECT id::text FROM vendors WHERE "vendorName"='Prime Steel Suppliers' LIMIT 1),'Prime Steel Suppliers',238500,'awarded','Best landed cost for SS-304 1.2/1.5mm mix; 14-day delivery committed.','2025-10-08 10:00:00','2025-10-16 15:00:00'),
  (:company,'RFQ-DEMO-0001',(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.' LIMIT 1),'Bharat Metal Works Pvt. Ltd.',246200,'shortlisted','Competitive on SS-316; retained as secondary source.','2025-10-08 14:30:00','2025-10-16 15:00:00'),
  (:company,'RFQ-DEMO-0001',(SELECT id::text FROM vendors WHERE "vendorName"='Industrial Components Ltd.' LIMIT 1),'Industrial Components Ltd.',259800,'rejected','8% above lowest bid; no mill certificate for SS-316 offered.','2025-10-09 09:15:00','2025-10-16 15:00:00'),
  (:company,'RFQ-DEMO-0002',(SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies' LIMIT 1),'ElectroTech Supplies',131400,'awarded','Panel FAT included at no extra cost; 3-year warranty on contactors.','2026-01-12 11:00:00','2026-01-23 16:00:00'),
  (:company,'RFQ-DEMO-0002',(SELECT id::text FROM vendors WHERE "vendorName"='Industrial Components Ltd.' LIMIT 1),'Industrial Components Ltd.',127900,'rejected','Lowest price but quoted non-IP65 enclosures against spec.','2026-01-13 10:20:00','2026-01-23 16:00:00'),
  (:company,'RFQ-DEMO-0002',(SELECT id::text FROM vendors WHERE "vendorName"='ProTool Equipment Inc.' LIMIT 1),'ProTool Equipment Inc.',139750,'shortlisted','Compliant offer; held as backup for overflow demand.','2026-01-14 15:45:00','2026-01-23 16:00:00'),
  (:company,'RFQ-DEMO-0003',(SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services' LIMIT 1),'MaintainPro Services',54000,'awarded','Best SLA score (92/100) on annual maintenance RFP; includes quarterly calibration.','2026-02-05 09:30:00','2026-02-19 14:00:00'),
  (:company,'RFQ-DEMO-0003',(SELECT id::text FROM vendors WHERE "vendorName"='ProTool Equipment Inc.' LIMIT 1),'ProTool Equipment Inc.',49500,'rejected','Cheaper but 48h response SLA vs required 24h.','2026-02-06 13:00:00','2026-02-19 14:00:00'),
  (:company,'RFQ-DEMO-0004',(SELECT id::text FROM vendors WHERE "vendorName"='PackRight Solutions' LIMIT 1),'PackRight Solutions',88300,'submitted','Revised crate design with corner blocks per NCR-DEMO-0002 learnings; under evaluation.','2026-08-24 10:00:00','2026-09-04 17:00:00'),
  (:company,'RFQ-DEMO-0004',(SELECT id::text FROM vendors WHERE "vendorName"='Chemical Solutions GmbH' LIMIT 1),'Chemical Solutions GmbH',91600,'submitted','Offer includes VCI moisture barrier film upgrade; under evaluation.','2026-08-25 12:30:00','2026-09-04 17:00:00');

-- ---------------------------------------------------------------------------
-- 8. procurement_sourcing_strategies
-- ---------------------------------------------------------------------------
DELETE FROM procurement_sourcing_strategies WHERE "companyId" = :company;
INSERT INTO procurement_sourcing_strategies
  ("companyId", "strategyCode", name, description, category, "strategyType", status,
   progress, "targetSavings", "achievedSavings", "spendUnderManagement", "startDate",
   "targetDate", owner, details, notes, "createdAt", "updatedAt")
VALUES
  (:company,'SRC-DEMO-001','Dual-source SS sheet supply','Qualify Bharat Metal Works as secondary source for SS-304/316 to de-risk Prime Steel dependency and gain price leverage.','Raw Materials - Steel','sourcing_project','in_progress',65,48000,31200,1200000,'2025-11-01','2026-10-31','Rajesh Kumar','{"suppliers":["Prime Steel Suppliers","Bharat Metal Works Pvt. Ltd."],"splitTarget":"70/30","riskDriver":"single-source dependency"}','Secondary source qualified for SS-316; SS-304 trial lots in progress.','2025-11-01 09:00:00','2026-08-20 14:00:00'),
  (:company,'SRC-DEMO-002','Compressor spend analysis FY2026','Consolidated spend-cube analysis on refrigeration category to identify bundling opportunity across compressor and condenser buys.','Refrigeration & Compressors','spend_analysis','completed',100,26000,19800,520000,'2025-12-01','2026-03-31','Anita Desai','{"spendCube":{"vendors":2,"skus":9},"finding":"bundling compressors+condensers yields 6.2% discount"}','Findings rolled into RFQ-DEMO-0002 negotiation.','2025-12-01 09:00:00','2026-04-02 10:00:00'),
  (:company,'SRC-DEMO-003','Control panel VAVE program','Value-analysis workshop with ElectroTech to standardise panel variants from 11 to 6 and reduce copper content.','Electrical & Controls','sourcing_project','in_progress',40,21000,8400,420000,'2026-02-01','2026-12-31','Amit Verma','{"variantsBefore":11,"variantsAfter":6,"leverArm":"standardisation"}','Three variants merged so far; drawings under revision for the rest.','2026-02-01 09:00:00','2026-08-28 16:00:00'),
  (:company,'SRC-DEMO-004','Packaging redesign & freight bundle','Redesign export crating (post NCR-DEMO-0002) and bundle domestic freight lanes for packaging category.','Glass Doors & Packaging','sourcing_project','planned',10,9000,0,180000,'2026-09-01','2027-03-31','Kiran Reddy','{"trigger":"NCR-DEMO-0002","lanes":4}','Awaiting RFQ-DEMO-0004 bid evaluation to finalise crate spec.','2026-09-01 09:00:00','2026-09-08 11:00:00'),
  (:company,'SRC-DEMO-005','AMC consolidation','Consolidate machine maintenance, calibration and utility AMC under a single service partner with SLA-linked pricing.','Services & Maintenance','sourcing_project','completed',100,7500,5100,150000,'2025-12-15','2026-03-15','Deepak Joshi','{"contractsBefore":4,"contractsAfter":1,"slaModel":"penalty-linked"}','Awarded to MaintainPro Services via RFQ-DEMO-0003.','2025-12-15 09:00:00','2026-03-16 10:00:00'),
  (:company,'SRC-DEMO-006','Fastener e-catalog buying','Move low-value fastener purchases to a punch-out catalog with quarterly price locks to cut PO transaction cost.','Components & Fittings','sourcing_project','in_progress',55,12000,6600,96000,'2026-03-01','2026-11-30','Priya Sharma','{"transactionCostBefore":1450,"transactionCostAfter":420,"catalogSkus":140}','Catalog live for 140 SKUs; adoption at 55% of eligible spend.','2026-03-01 09:00:00','2026-08-31 15:00:00');

-- ---------------------------------------------------------------------------
-- 9. procurement_savings_initiatives (baseline vs achieved)
-- ---------------------------------------------------------------------------
DELETE FROM procurement_savings_initiatives WHERE "companyId" = :company;
INSERT INTO procurement_savings_initiatives
  ("companyId", title, description, category, type, "targetSavings", "actualSavings",
   owner, "startDate", "endDate", status, baseline_cost, current_cost,
   realized_savings, projected_savings, "createdAt", "updatedAt")
VALUES
  (:company,'DEMO: SS sheet price renegotiation','Annual price renegotiation on SS-304/316 sheets leveraging dual-source competition from SRC-DEMO-001.','Raw Materials - Steel','negotiation',48000,31200,'Rajesh Kumar','2025-11-01','2026-10-31','active',1200000,1168800,31200,48000,'2025-11-01 10:00:00','2026-08-20 14:30:00'),
  (:company,'DEMO: Compressor bundle discount','Bundled compressor + condenser volumes into single award to unlock 6.2% slab discount.','Refrigeration & Compressors','demand_bundling',26000,19800,'Anita Desai','2026-01-05','2026-06-30','completed',331200,311400,19800,19800,'2026-01-05 10:00:00','2026-07-02 09:00:00'),
  (:company,'DEMO: Panel variant standardisation','Reduce control panel variants 11 to 6 through VAVE; lower copper content and setup cost.','Electrical & Controls','value_engineering',21000,8400,'Amit Verma','2026-02-01','2026-12-31','active',268100,259700,8400,21000,'2026-02-01 10:00:00','2026-08-28 16:30:00'),
  (:company,'DEMO: AMC consolidation savings','Four AMC contracts merged into one SLA-linked contract with MaintainPro Services.','Services & Maintenance','contract_consolidation',7500,5100,'Deepak Joshi','2025-12-15','2026-03-15','completed',71300,66200,5100,5100,'2025-12-15 10:00:00','2026-03-16 10:30:00'),
  (:company,'DEMO: Fastener catalog transaction savings','Punch-out catalog cuts PO processing cost on low-value fastener buys.','Components & Fittings','process_improvement',12000,6600,'Priya Sharma','2026-03-01','2026-11-30','active',96000,89400,6600,12000,'2026-03-01 10:00:00','2026-08-31 15:30:00'),
  (:company,'DEMO: Insulation chemical spec rationalisation','Switch to higher-yield PU foam grade reducing kg-per-unit consumption by 7%.','Insulation & Chemicals','specification_change',13000,7100,'Vikram Singh','2026-04-01','2027-03-31','active',143800,136700,7100,13000,'2026-04-01 10:00:00','2026-09-05 12:00:00');

-- ---------------------------------------------------------------------------
-- 10. procurement_compliance_records
-- ---------------------------------------------------------------------------
DELETE FROM procurement_compliance_records WHERE "companyId" = :company;
INSERT INTO procurement_compliance_records
  ("companyId", supplier_id, requirement, status, evidence, due_date, completed_date,
   "createdAt", "updatedAt")
VALUES
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='Prime Steel Suppliers' LIMIT 1),'ISO 9001:2015 certificate renewal','compliant','Certificate no. QMS-88412 valid to 2027-06-30 on vendor file.','2026-06-30','2026-05-18','2025-10-05 09:00:00','2026-05-18 14:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.' LIMIT 1),'Mill test certificate submission per lot','compliant','MTCs received with GR-DEMO-0005, 0012, 0018; heat numbers reconciled.','2026-03-31','2026-03-28','2025-10-05 09:10:00','2026-03-28 11:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies' LIMIT 1),'CE/IS declaration for switchgear range','compliant','Declaration DOC-CE-2214 covering contactor and MCB series.','2026-01-31','2026-01-15','2025-10-05 09:20:00','2026-01-15 10:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='Chemical Solutions GmbH' LIMIT 1),'Food-safe chemical MSDS + FDA/FSSAI compliance','compliant','MSDS pack v6 and FSSAI-compatible formulation letter on file.','2026-02-28','2026-02-10','2025-10-05 09:30:00','2026-02-10 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='PackRight Solutions' LIMIT 1),'ISPM-15 heat treatment certification for export crates','pending','Renewal application submitted; current cert expired 2026-08-31.','2026-09-30',NULL,'2025-10-05 09:40:00','2026-09-02 10:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services' LIMIT 1),'Technician electrical safety licence verification','compliant','Licences of 4 field technicians verified against state registry.','2026-04-30','2026-04-12','2025-10-05 09:50:00','2026-04-12 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='Industrial Components Ltd.' LIMIT 1),'RoHS declaration for plated fittings','overdue','Reminder sent 2026-08-20; declaration not yet received.','2026-08-15',NULL,'2025-10-05 10:00:00','2026-08-20 16:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='ProTool Equipment Inc.' LIMIT 1),'Calibration certificates for supplied test equipment','pending','Due with next AMC quarterly visit in September 2026.','2026-09-25',NULL,'2025-10-05 10:10:00','2026-09-01 12:00:00');

-- ---------------------------------------------------------------------------
-- 11. procurement_risk_assessments
-- ---------------------------------------------------------------------------
DELETE FROM procurement_risk_assessments WHERE "companyId" = :company;
INSERT INTO procurement_risk_assessments
  ("companyId", supplier_id, category, risk_level, likelihood, impact, mitigation_plan,
   status, review_date, "createdAt", "updatedAt")
VALUES
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='Prime Steel Suppliers' LIMIT 1),'Raw Materials - Steel','high',3,5,'Dual-sourcing program SRC-DEMO-001; maintain 3-week SS sheet buffer stock for top 5 gauges.','mitigating','2026-10-15','2025-11-10 09:00:00','2026-08-20 14:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.' LIMIT 1),'Burners & Gas Train','medium',3,3,'Source leak-test logs mandatory per lot after NCR-DEMO-0001; skip-lot inspection only after 5 clean lots.','mitigating','2026-11-30','2026-04-10 09:00:00','2026-08-25 11:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies' LIMIT 1),'Electrical & Controls','medium',2,4,'Hold 4-week safety stock of long-lead contactors; qualify alternate brand for MCB series.','identified','2026-12-15','2026-01-20 09:00:00','2026-07-15 10:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='Chemical Solutions GmbH' LIMIT 1),'Insulation & Chemicals','high',3,4,'Import lead-time exposure (8 weeks, EUR-denominated); build 10-week cover and hedge quarterly volumes.','mitigating','2026-10-31','2025-12-05 09:00:00','2026-08-18 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='PackRight Solutions' LIMIT 1),'Glass Doors & Packaging','medium',3,3,'Transit-damage exposure per NCR-DEMO-0002; revised crate spec in trial, insurance claim SOP updated.','mitigating','2026-11-15','2026-06-28 09:00:00','2026-09-01 09:30:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services' LIMIT 1),'Services & Maintenance','low',2,2,'Single AMC partner concentration accepted; SLA penalties and 60-day exit clause in contract.','accepted','2027-03-15','2026-03-20 09:00:00','2026-03-20 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorName"='Industrial Components Ltd.' LIMIT 1),'Components & Fittings','low',2,2,'RoHS documentation gap tracked via compliance record; no supply continuity impact expected.','identified','2026-10-01','2026-08-20 09:00:00','2026-08-20 09:00:00'),
  (:company,NULL,'Raw Materials - Steel','critical',4,5,'Nickel price volatility on SS-316: indexed pricing clause negotiated; quarterly price-review gate with both steel vendors.','mitigating','2026-09-30','2026-02-15 09:00:00','2026-09-05 16:00:00');

-- ---------------------------------------------------------------------------
-- 12. procurement_calendar_events
-- ---------------------------------------------------------------------------
DELETE FROM procurement_calendar_events WHERE "companyId" = :company;
INSERT INTO procurement_calendar_events
  ("companyId", title, type, "eventDate", time, vendor, description, location, items,
   value, status, priority, "createdAt", "updatedAt")
VALUES
  (:company,'RFQ-DEMO-0004 bid opening','deadline','2026-09-12','15:00','PackRight Solutions','Commercial bid opening for packaging & crating RFQ; two bids received.','Conference Room B',12,90000,'scheduled','high','2026-08-24 11:00:00','2026-09-04 17:30:00'),
  (:company,'Delivery: PO-DEMO-0019 SS sheets','delivery','2026-09-16','10:00','Prime Steel Suppliers','Scheduled receipt of SS-304 sheet lot against PO-DEMO-0019.','Warehouse Gate 2',95,166144,'scheduled','high','2026-09-01 09:00:00','2026-09-01 09:00:00'),
  (:company,'Delivery: PO-DEMO-0020 switchgear','delivery','2026-09-18','11:30','ElectroTech Supplies','Switchgear and contactor delivery; incoming inspection booked same day.','Warehouse Gate 1',75,152220,'scheduled','medium','2026-09-01 09:10:00','2026-09-01 09:10:00'),
  (:company,'Quarterly business review - Prime Steel','meeting','2026-09-24','14:00','Prime Steel Suppliers','QBR covering OTIF, quality PPM and Q3 indexed price review per nickel clause.','Vendor Meeting Room',NULL,NULL,'scheduled','medium','2026-08-28 10:00:00','2026-08-28 10:00:00'),
  (:company,'Supplier audit - Bharat Metal Works','audit','2026-10-08','09:30','Bharat Metal Works Pvt. Ltd.','On-site process audit of brazing line following NCR-DEMO-0001 corrective actions.','Vendor Site - Pune',NULL,NULL,'scheduled','high','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'AMC quarterly service visit','service','2026-09-22','09:00','MaintainPro Services','Quarterly maintenance and calibration visit under consolidated AMC; collect calibration certificates.','Production Floor',NULL,13500,'scheduled','medium','2026-08-30 10:00:00','2026-08-30 10:00:00'),
  (:company,'Contract renewal review - Chemical Solutions','meeting','2025-12-10','11:00','Chemical Solutions GmbH','Annual supply contract review; agreed EUR hedge bands and 10-week cover policy.','Conference Room A',NULL,260000,'completed','medium','2025-11-25 10:00:00','2025-12-10 17:00:00'),
  (:company,'Crate design trial inspection','inspection','2026-08-27','10:30','PackRight Solutions','Joint inspection of revised crate design with corner blocks (NCR-DEMO-0002 corrective action).','Warehouse Gate 2',6,NULL,'completed','high','2026-08-18 10:00:00','2026-08-27 16:00:00');

-- ---------------------------------------------------------------------------
-- 13. procurement_notifications
-- ---------------------------------------------------------------------------
DELETE FROM procurement_notifications WHERE "companyId" = :company;
INSERT INTO procurement_notifications
  ("companyId", type, priority, title, message, read, action, "actionUrl",
   "createdAt", "updatedAt")
VALUES
  (:company,'alert','high','ISPM-15 certificate expired - PackRight Solutions','Export crating supplier''s ISPM-15 heat treatment certificate expired on 2026-08-31. Renewal is pending; export shipments may be blocked.',false,'View compliance record','/procurement/compliance','2026-09-01 08:30:00','2026-09-01 08:30:00'),
  (:company,'warning','high','RoHS declaration overdue - Industrial Components Ltd.','RoHS declaration for plated fittings was due 2026-08-15 and has not been received. Second reminder sent.',false,'Follow up','/procurement/compliance','2026-08-20 16:05:00','2026-08-20 16:05:00'),
  (:company,'info','medium','RFQ-DEMO-0004 bids received','Two bids received for packaging & crating RFQ. Bid opening scheduled for 2026-09-12 15:00.',false,'Open RFQ','/procurement/rfq','2026-09-04 17:35:00','2026-09-04 17:35:00'),
  (:company,'approval','high','PO-DEMO-0024 awaiting approval','Purchase order PO-DEMO-0024 (ProTool Equipment Inc., 17,464.00) submitted and pending approval for 5 days.',false,'Approve PO','/procurement/purchase-orders','2026-09-05 09:00:00','2026-09-05 09:00:00'),
  (:company,'warning','medium','Budget threshold: Raw Materials Q2 FY2026-27','Raw Materials - Steel Q2 budget is 70% consumed (spent + committed) with 3 weeks remaining in the quarter.',true,'View budget','/procurement/budgets','2026-08-25 10:00:00','2026-08-26 09:15:00'),
  (:company,'info','low','NCR-DEMO-0001 closed','Non-conformance for burner manifold gas leak closed after replacement units passed inspection on 2026-04-21.',true,'View NCR','/procurement/ncr','2026-04-22 12:05:00','2026-04-23 08:40:00'),
  (:company,'alert','high','Inspection failed - GR-DEMO-0017','Incoming inspection for tempered glass doors (PO-DEMO-0017) failed: 4 units rejected for edge chipping. NCR-DEMO-0002 raised.',true,'View inspection','/procurement/inspections','2026-06-26 16:35:00','2026-06-27 09:00:00'),
  (:company,'info','medium','Delivery due: PO-DEMO-0019','SS-304 sheet delivery from Prime Steel Suppliers expected 2026-09-16 at Warehouse Gate 2. Inspection slot reserved.',false,'View calendar','/procurement/calendar','2026-09-08 08:00:00','2026-09-08 08:00:00');

-- ---------------------------------------------------------------------------
-- 14. procurement_automation_rules
-- ---------------------------------------------------------------------------
DELETE FROM procurement_automation_rules WHERE "companyId" = :company;
INSERT INTO procurement_automation_rules
  ("companyId", name, description, trigger, conditions, actions, is_active,
   "createdAt", "updatedAt", last_evaluated_at)
VALUES
  (:company,'DEMO: Auto-approve low-value PRs','Automatically approve purchase requisitions below 10,000 for pre-approved categories.','pr.submitted','{"all":[{"field":"totalAmount","op":"lt","value":10000},{"field":"category","op":"in","value":["Components & Fittings","Tools & Consumables"]}]}','[{"type":"approve","level":"auto"},{"type":"notify","target":"requester","template":"pr_auto_approved"}]',true,'2025-10-10 09:00:00','2026-06-15 10:00:00','2026-09-08 06:00:00'),
  (:company,'DEMO: Escalate stale PO approvals','Escalate purchase orders pending approval for more than 3 business days to the procurement head.','po.approval_pending','{"all":[{"field":"pendingDays","op":"gte","value":3}]}','[{"type":"escalate","to":"procurement_head"},{"type":"notify","target":"approver","template":"po_approval_reminder"}]',true,'2025-10-10 09:10:00','2026-06-15 10:00:00','2026-09-08 06:00:00'),
  (:company,'DEMO: Auto-create inspection on GRN','Create an incoming inspection task automatically when a goods receipt is posted for quality-flagged categories.','grn.posted','{"all":[{"field":"category","op":"in","value":["Raw Materials - Steel","Refrigeration & Compressors","Electrical & Controls","Burners & Gas Train"]}]}','[{"type":"create_inspection","templateBy":"category"},{"type":"assign","roleBy":"category"}]',true,'2025-10-10 09:20:00','2026-04-08 11:00:00','2026-09-08 06:00:00'),
  (:company,'DEMO: NCR on failed inspection','Raise a non-conformance report automatically when an inspection result is recorded as fail.','inspection.failed','{"all":[{"field":"result","op":"eq","value":"fail"}]}','[{"type":"create_ncr","severityBy":"defectRate"},{"type":"notify","target":"quality_manager","template":"inspection_failed"}]',true,'2025-10-10 09:30:00','2026-04-08 11:00:00','2026-09-08 06:00:00'),
  (:company,'DEMO: Budget threshold alert at 70%','Send a warning notification when category budget consumption (spent + committed) crosses 70%.','budget.updated','{"all":[{"field":"consumedPct","op":"gte","value":70}]}','[{"type":"notify","target":"category_manager","template":"budget_threshold"},{"type":"flag","entity":"budget","flag":"watch"}]',true,'2025-10-10 09:40:00','2026-08-25 10:05:00','2026-09-08 06:00:00'),
  (:company,'DEMO: Compliance expiry reminder','Notify vendor manager 30 days before a supplier compliance document expires.','compliance.expiry_window','{"all":[{"field":"daysToExpiry","op":"lte","value":30}]}','[{"type":"notify","target":"vendor_manager","template":"compliance_expiry"},{"type":"email","target":"supplier_contact","template":"document_renewal_request"}]',false,'2025-10-10 09:50:00','2026-07-20 14:00:00','2026-08-31 06:00:00');

-- ---------------------------------------------------------------------------
-- 15. procurement_report_templates
-- ---------------------------------------------------------------------------
DELETE FROM procurement_report_templates WHERE "companyId" = :company;
INSERT INTO procurement_report_templates
  ("companyId", name, description, report_type, config, schedule, created_by,
   recipients, last_run_at, next_run_at, is_active, "createdAt", "updatedAt")
VALUES
  (:company,'DEMO: Monthly Spend by Category','Category-wise spend vs budget with month-on-month trend and top 10 POs.','spend_analysis','{"groupBy":"category","period":"month","charts":["bar","trend"],"includeTop":10}','monthly','Rajesh Kumar','["procurement-head@b3macbis.demo","cfo@b3macbis.demo"]','2026-09-01 07:00:00','2026-10-01 07:00:00',true,'2025-10-15 09:00:00','2026-09-01 07:05:00'),
  (:company,'DEMO: Supplier Scorecard','OTIF, quality PPM, NCR count and price variance per vendor, quarterly.','supplier_performance','{"metrics":["otif","ppm","ncrCount","priceVariance"],"period":"quarter","threshold":{"otif":95,"ppm":2500}}','quarterly','Priya Sharma','["procurement-head@b3macbis.demo","quality@b3macbis.demo"]','2026-07-01 07:00:00','2026-10-01 07:00:00',true,'2025-10-15 09:10:00','2026-07-01 07:05:00'),
  (:company,'DEMO: PO Cycle Time Report','Requisition-to-PO and PO-to-receipt cycle time distribution with bottleneck stages.','cycle_time','{"stages":["pr_to_approval","approval_to_po","po_to_grn"],"percentiles":[50,90]}','monthly','Amit Verma','["procurement-head@b3macbis.demo"]','2026-09-01 07:10:00','2026-10-01 07:10:00',true,'2025-10-15 09:20:00','2026-09-01 07:15:00'),
  (:company,'DEMO: Savings Tracker','Initiative-level realized vs projected savings rollup against annual target.','savings','{"rollup":"initiative","target":150000,"compare":["realized","projected"]}','monthly','Anita Desai','["cfo@b3macbis.demo","procurement-head@b3macbis.demo"]','2026-09-01 07:20:00','2026-10-01 07:20:00',true,'2025-10-15 09:30:00','2026-09-01 07:25:00'),
  (:company,'DEMO: Compliance Status Register','Open, pending and overdue supplier compliance items with ageing buckets.','compliance','{"buckets":[30,60,90],"includeExpired":true}',NULL,'Vikram Singh','["vendor-management@b3macbis.demo"]',NULL,NULL,false,'2025-10-15 09:40:00','2026-02-12 10:00:00');

-- ---------------------------------------------------------------------------
-- 16. procurement_bom_receipts
-- ---------------------------------------------------------------------------
DELETE FROM procurement_bom_receipts WHERE "companyId" = :company;
INSERT INTO procurement_bom_receipts
  ("companyId", "bomCode", "productName", "submittedBy", "submittedDate", status,
   "itemsCount", "totalValue", "accessoriesCount", "fittingsCount", "materialsCount",
   "prNumber", "poNumber", "createdAt", "updatedAt")
VALUES
  (:company,'BOM-DEMO-0001','4-Burner Commercial Range CR-400','Ravi Menon','2025-10-06','Converted to PO',24,148680,6,8,10,'PR-DEMO-0005','PO-DEMO-0005','2025-10-06 10:00:00','2025-10-14 12:00:00'),
  (:company,'BOM-DEMO-0002','Upright Chiller UC-650 (Glass Door)','Ravi Menon','2025-11-03','Converted to PO',31,129800,9,10,12,'PR-DEMO-0011','PO-DEMO-0011','2025-11-03 10:00:00','2025-11-12 12:00:00'),
  (:company,'BOM-DEMO-0003','Island Suite Kitchen Line IS-2200','Deepak Joshi','2026-01-19','Converted to PO',42,330636,12,14,16,'PR-DEMO-0012','PO-DEMO-0012','2026-01-19 10:00:00','2026-01-28 12:00:00'),
  (:company,'BOM-DEMO-0004','Blast Chiller BC-300','Deepak Joshi','2026-04-13','Converted to PO',27,178534,7,9,11,'PR-DEMO-0015','PO-DEMO-0015','2026-04-13 10:00:00','2026-04-22 12:00:00'),
  (:company,'BOM-DEMO-0005','Display Counter DC-180 (Glass Front)','Ravi Menon','2026-06-08','PR Created',19,111392,5,6,8,'PR-DEMO-0017',NULL,'2026-06-08 10:00:00','2026-06-12 12:00:00'),
  (:company,'BOM-DEMO-0006','Salamander Grill SG-90','Meera Nair','2026-08-31','Received',15,52000,4,5,6,NULL,NULL,'2026-08-31 10:00:00','2026-08-31 10:00:00');

-- ---------------------------------------------------------------------------
-- 17. procurement_audit_trail
-- ---------------------------------------------------------------------------
DELETE FROM procurement_audit_trail WHERE "companyId" = :company;
INSERT INTO procurement_audit_trail
  ("companyId", "entityType", "entityId", "entityNumber", action, "actionDescription",
   "userId", "userName", "userEmail", "userRole", "previousValues", "newValues",
   "changedFields", "previousStatus", "newStatus", comments, metadata, "createdAt")
VALUES
  (:company,'purchase_requisition',(SELECT id::text FROM purchase_requisitions WHERE "prNumber"='PR-DEMO-0005' LIMIT 1),'PR-DEMO-0005','create','Purchase requisition created from BOM-DEMO-0001','demo-user-ravi','Ravi Menon','ravi.menon@b3macbis.demo','Planner',NULL,'{"totalAmount":148680,"lines":24}',NULL,NULL,'Draft','Generated from engineering BOM for CR-400 range.','{"source":"bom_receipt","bomCode":"BOM-DEMO-0001"}','2025-10-06 10:30:00'),
  (:company,'purchase_requisition',(SELECT id::text FROM purchase_requisitions WHERE "prNumber"='PR-DEMO-0005' LIMIT 1),'PR-DEMO-0005','approval','Purchase requisition approved','demo-user-rajesh','Rajesh Kumar','rajesh.kumar@b3macbis.demo','Procurement Head',NULL,NULL,NULL,'Submitted','Approved','Within category budget; approved for RFQ-free direct PO to contracted vendor.',NULL,'2025-10-08 15:20:00'),
  (:company,'purchase_order',(SELECT id::text FROM purchase_orders WHERE "poNumber"='PO-DEMO-0005' LIMIT 1),'PO-DEMO-0005','create','Purchase order created against PR-DEMO-0005','demo-user-priya','Priya Sharma','priya.sharma@b3macbis.demo','Buyer',NULL,'{"vendor":"Bharat Metal Works Pvt. Ltd.","totalAmount":148680}',NULL,NULL,'Draft',NULL,'{"prNumber":"PR-DEMO-0005"}','2025-10-09 11:00:00'),
  (:company,'purchase_order',(SELECT id::text FROM purchase_orders WHERE "poNumber"='PO-DEMO-0005' LIMIT 1),'PO-DEMO-0005','send','Purchase order sent to vendor','demo-user-priya','Priya Sharma','priya.sharma@b3macbis.demo','Buyer',NULL,NULL,NULL,'Approved','Sent','Sent via vendor portal with delivery schedule attachment.','{"channel":"vendor_portal"}','2025-10-10 09:45:00'),
  (:company,'goods_receipt',(SELECT id::text FROM goods_receipts WHERE "grnNumber"='GR-DEMO-0012' LIMIT 1),'GR-DEMO-0012','receive','Goods receipt recorded for PO-DEMO-0012','demo-user-suresh','Suresh Patel','suresh.patel@b3macbis.demo','Store Keeper',NULL,'{"receivedQty":48,"warehouse":"Main Store"}',NULL,NULL,'Received','Burner assemblies received; routed to incoming inspection.',NULL,'2026-04-06 13:30:00'),
  (:company,'goods_receipt',(SELECT id::text FROM goods_receipts WHERE "grnNumber"='GR-DEMO-0012' LIMIT 1),'GR-DEMO-0012','status_change','Goods receipt partially accepted after inspection','demo-user-meera','Meera Nair','meera.nair@b3macbis.demo','Quality Inspector','{"acceptedQty":48}','{"acceptedQty":42,"rejectedQty":6}','["acceptedQty","rejectedQty"]','Received','Partially Accepted','6 units failed gas-train leak test; NCR-DEMO-0001 raised.','{"ncrNumber":"NCR-DEMO-0001"}','2026-04-07 17:30:00'),
  (:company,'purchase_order',(SELECT id::text FROM purchase_orders WHERE "poNumber"='PO-DEMO-0019' LIMIT 1),'PO-DEMO-0019','approval','Purchase order approved','demo-user-rajesh','Rajesh Kumar','rajesh.kumar@b3macbis.demo','Procurement Head',NULL,NULL,NULL,'Submitted','Approved','Approved under indexed pricing clause; Q2 nickel band applied.',NULL,'2026-08-18 10:15:00'),
  (:company,'rfq','RFQ-DEMO-0002','RFQ-DEMO-0002','award','RFQ awarded to ElectroTech Supplies','demo-user-amit','Amit Verma','amit.verma@b3macbis.demo','Category Manager','{"status":"evaluation"}','{"status":"awarded","awardedTo":"ElectroTech Supplies","amount":131400}','["status","awardedTo","amount"]','Evaluation','Awarded','Awarded on total-cost basis; lowest bid rejected for non-IP65 enclosures.','{"bids":3}','2026-01-23 16:10:00'),
  (:company,'purchase_order',(SELECT id::text FROM purchase_orders WHERE "poNumber"='PO-DEMO-0024' LIMIT 1),'PO-DEMO-0024','submit','Purchase order submitted for approval','demo-user-kiran','Kiran Reddy','kiran.reddy@b3macbis.demo','Buyer',NULL,'{"vendor":"ProTool Equipment Inc.","totalAmount":17464}',NULL,'Draft','Submitted',NULL,NULL,'2026-08-31 14:00:00'),
  (:company,'purchase_order',(SELECT id::text FROM purchase_orders WHERE "poNumber"='PO-DEMO-0010' LIMIT 1),'PO-DEMO-0010','status_change','Purchase order closed','demo-user-priya','Priya Sharma','priya.sharma@b3macbis.demo','Buyer',NULL,NULL,'["status"]','Fully Received','Closed','All lines received and invoiced; three-way match complete.',NULL,'2026-03-20 11:40:00');

-- ---------------------------------------------------------------------------
-- Sync category rollups with seeded savings initiatives (keeps demo consistent)
-- ---------------------------------------------------------------------------
UPDATE procurement_categories c
SET "actualSavings" = s.total
FROM (
  SELECT category, SUM(realized_savings) AS total
  FROM procurement_savings_initiatives
  WHERE "companyId" = :company
  GROUP BY category
) s
WHERE c."companyId" = :company AND c.name = s.category;
