-- Demo seed — Production A (BOMs, planning, sustainability, monitoring) for B3 MACBIS.
-- companyId / company_id anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this file's demo rows first, then re-inserts.
-- Delete predicates used (tables without a company column):
--   boms/bom_items ........................ "bomCode" LIKE 'DEMO-BOM-%' (items cascade)
--   machine_maintenance_logs .............. "equipmentCode" LIKE 'DEMO-EQ-%'
--   production_entries .................... "entryNumber" LIKE 'DEMO-PE-%'
--   production_bom_templates .............. code LIKE 'DEMO-BTPL-%'
--   production_die_tool_assets ............ asset_code LIKE 'DEMO-DTA-%'
--   production_andon_lines ................ "lineName" LIKE 'DEMO-LINE-%'
--   production_bom_verifications .......... "bomCode" LIKE 'DEMO-BOM-%'
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- BOMs (5) + BOM items (19)
-- ============================================================================
DELETE FROM bom_items WHERE "bomId" IN (SELECT id FROM boms WHERE "bomCode" LIKE 'DEMO-BOM-%');
DELETE FROM boms WHERE "bomCode" LIKE 'DEMO-BOM-%';

INSERT INTO boms
  ("bomCode","bomName",description,"itemId","itemCode","itemName","bomType",status,version,
   "isActive","isDefault","effectiveFrom",quantity,uom,"materialCost","operationCost","overheadCost",
   "totalCost","costPerUnit","lastCostRollupDate","leadTimeDays","scrapPercentage","batchSize",
   "approvedBy","approvedAt",notes,"createdBy","createdAt","updatedAt")
VALUES
  ('DEMO-BOM-001','Industrial Motor 5HP — Production BOM','Standard manufacture BOM for 5HP industrial motor',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',
   'Manufacture','Active',2,true,true,'2025-10-01',1,'PCS',10220.00,1500.00,500.00,12220.00,12220.00,
   '2026-08-01 10:00:00',7,2.00,40,'Sanjay Malhotra','2025-10-05 11:30:00','Rev 2 after copper winding spec change.','Rajesh Kumar','2025-10-01 09:00:00','2026-08-01 10:00:00'),
  ('DEMO-BOM-002','Centrifugal Pump CP-200 — Production BOM','Manufacture BOM for CP-200 centrifugal pump',
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',
   'Manufacture','Active',1,true,true,'2025-10-01',1,'PCS',5840.00,1400.00,450.00,7690.00,7690.00,
   '2026-08-01 10:05:00',6,2.00,25,'Sanjay Malhotra','2025-10-06 15:00:00',NULL,'Rajesh Kumar','2025-10-02 09:10:00','2026-08-01 10:05:00'),
  ('DEMO-BOM-003','Precision Gearbox PG-50 — Assembly BOM','Assembly BOM for PG-50 with machined housing and shaft sub-assemblies',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',
   'Assembly','Active',1,true,true,'2025-10-15',1,'PCS',9585.00,6000.00,1800.00,17385.00,17385.00,
   '2026-08-01 10:10:00',10,1.50,15,'Sanjay Malhotra','2025-10-18 12:00:00','High-precision assembly; QC inspection mandatory.','Suresh Patel','2025-10-15 08:45:00','2026-08-01 10:10:00'),
  ('DEMO-BOM-004','Gearbox Housing (Machined) — WIP BOM','CNC machining BOM for gearbox housing from steel sheet',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',
   'Manufacture','Active',1,true,true,'2025-10-01',1,'PCS',1788.00,700.00,200.00,2688.00,2688.00,
   '2026-08-01 10:15:00',4,4.00,60,'Sanjay Malhotra','2025-10-04 10:00:00',NULL,'Suresh Patel','2025-10-01 10:20:00','2026-08-01 10:15:00'),
  ('DEMO-BOM-005','Drive Shaft Assembly — WIP BOM','Turning and grinding BOM for drive shaft assembly',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'WIP-SFT-001','Drive Shaft Assembly (WIP)',
   'Manufacture','Active',1,true,true,'2025-10-01',1,'PCS',970.00,220.00,60.00,1250.00,1250.00,
   '2026-08-01 10:20:00',3,3.00,80,'Sanjay Malhotra','2025-10-04 10:05:00',NULL,'Suresh Patel','2025-10-01 10:30:00','2026-08-01 10:20:00');

INSERT INTO bom_items
  ("bomId","itemId","itemCode","itemName","itemType","supplyType","sequenceNumber",level,quantity,uom,
   "scrapPercentage","netQuantity","unitCost","totalCost","leadTimeDays","isActive","createdBy","createdAt","updatedAt")
VALUES
  -- DEMO-BOM-001 : Industrial Motor 5HP
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-001'),(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','Component','Purchase',10,1,30.0000,'KG',3.00,30.9000,85.00,2550.00,5,true,'Rajesh Kumar','2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-001'),(SELECT id::text FROM items WHERE "itemCode"='RM-COP-001'),'RM-COP-001','Copper Wire 2.5mm','Component','Purchase',20,1,120.0000,'MTR',2.00,122.4000,45.00,5400.00,7,true,'Rajesh Kumar','2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-001'),(SELECT id::text FROM items WHERE "itemCode"='RM-ALM-001'),'RM-ALM-001','Aluminum Rod 20mm','Component','Purchase',30,1,4.0000,'MTR',2.00,4.0800,320.00,1280.00,5,true,'Rajesh Kumar','2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-001'),(SELECT id::text FROM items WHERE "itemCode"='SP-BRG-001'),'SP-BRG-001','Ball Bearing 6205','Component','Purchase',40,1,2.0000,'PCS',0.00,2.0000,450.00,900.00,10,true,'Rajesh Kumar','2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-001'),(SELECT id::text FROM items WHERE "itemCode"='CON-LUB-001'),'CON-LUB-001','Industrial Lubricant Oil ISO VG 68','Consumable','Purchase',50,1,0.5000,'LTR',0.00,0.5000,180.00,90.00,3,true,'Rajesh Kumar','2025-10-01 09:05:00','2025-10-01 09:05:00'),
  -- DEMO-BOM-002 : Centrifugal Pump CP-200
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-002'),(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','Component','Purchase',10,1,18.0000,'KG',3.00,18.5400,85.00,1530.00,5,true,'Rajesh Kumar','2025-10-02 09:15:00','2025-10-02 09:15:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-002'),(SELECT id::text FROM items WHERE "itemCode"='RM-ALM-001'),'RM-ALM-001','Aluminum Rod 20mm','Component','Purchase',20,1,3.0000,'MTR',2.00,3.0600,320.00,960.00,5,true,'Rajesh Kumar','2025-10-02 09:15:00','2025-10-02 09:15:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-002'),(SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'WIP-SFT-001','Drive Shaft Assembly (WIP)','Sub-Assembly','Manufacture',30,1,1.0000,'PCS',0.00,1.0000,1250.00,1250.00,3,true,'Rajesh Kumar','2025-10-02 09:15:00','2025-10-02 09:15:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-002'),(SELECT id::text FROM items WHERE "itemCode"='SP-SL-001'),'SP-SL-001','Mechanical Seal MS-40','Component','Purchase',40,1,1.0000,'PCS',0.00,1.0000,1200.00,1200.00,12,true,'Rajesh Kumar','2025-10-02 09:15:00','2025-10-02 09:15:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-002'),(SELECT id::text FROM items WHERE "itemCode"='SP-BRG-001'),'SP-BRG-001','Ball Bearing 6205','Component','Purchase',50,1,2.0000,'PCS',0.00,2.0000,450.00,900.00,10,true,'Rajesh Kumar','2025-10-02 09:15:00','2025-10-02 09:15:00'),
  -- DEMO-BOM-003 : Precision Gearbox PG-50
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-003'),(SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)','Sub-Assembly','Manufacture',10,1,1.0000,'PCS',0.00,1.0000,2800.00,2800.00,4,true,'Suresh Patel','2025-10-15 09:00:00','2025-10-15 09:00:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-003'),(SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'WIP-SFT-001','Drive Shaft Assembly (WIP)','Sub-Assembly','Manufacture',20,1,2.0000,'PCS',0.00,2.0000,1250.00,2500.00,3,true,'Suresh Patel','2025-10-15 09:00:00','2025-10-15 09:00:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-003'),(SELECT id::text FROM items WHERE "itemCode"='SP-BRG-001'),'SP-BRG-001','Ball Bearing 6205','Component','Purchase',30,1,4.0000,'PCS',0.00,4.0000,450.00,1800.00,10,true,'Suresh Patel','2025-10-15 09:00:00','2025-10-15 09:00:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-003'),(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','Component','Purchase',40,1,25.0000,'KG',3.00,25.7500,85.00,2125.00,5,true,'Suresh Patel','2025-10-15 09:00:00','2025-10-15 09:00:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-003'),(SELECT id::text FROM items WHERE "itemCode"='CON-LUB-001'),'CON-LUB-001','Industrial Lubricant Oil ISO VG 68','Consumable','Purchase',50,1,2.0000,'LTR',0.00,2.0000,180.00,360.00,3,true,'Suresh Patel','2025-10-15 09:00:00','2025-10-15 09:00:00'),
  -- DEMO-BOM-004 : Gearbox Housing (Machined)
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-004'),(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','Component','Purchase',10,1,20.0000,'KG',4.00,20.8000,85.00,1700.00,5,true,'Suresh Patel','2025-10-01 10:25:00','2025-10-01 10:25:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-004'),(SELECT id::text FROM items WHERE "itemCode"='CON-CLT-001'),'CON-CLT-001','Cutting Coolant Concentrate','Consumable','Purchase',20,1,0.4000,'LTR',0.00,0.4000,220.00,88.00,3,true,'Suresh Patel','2025-10-01 10:25:00','2025-10-01 10:25:00'),
  -- DEMO-BOM-005 : Drive Shaft Assembly
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-005'),(SELECT id::text FROM items WHERE "itemCode"='RM-ALM-001'),'RM-ALM-001','Aluminum Rod 20mm','Component','Purchase',10,1,2.5000,'MTR',2.00,2.5500,320.00,800.00,5,true,'Suresh Patel','2025-10-01 10:35:00','2025-10-01 10:35:00'),
  ((SELECT id FROM boms WHERE "bomCode"='DEMO-BOM-005'),(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','Component','Purchase',20,1,2.0000,'KG',3.00,2.0600,85.00,170.00,5,true,'Suresh Patel','2025-10-01 10:35:00','2025-10-01 10:35:00');

-- ============================================================================
-- Business continuity plans (6)
-- ============================================================================
DELETE FROM business_continuities WHERE "companyId" = :company;
INSERT INTO business_continuities
  ("companyId","processName",category,"currentStatus",priority,"healthScore",rto,rpo,mtpd,
   dependencies,"lastReviewDate","nextReviewDate","lastDrillDate","nextDrillDate","planOwner",notes,"isActive","createdAt","updatedAt")
VALUES
  (:company,'CNC Machining Line Operations','production','operational','critical',92.50,4,1,24,
   '["Compressed air","CNC spare inserts","Skilled operators"]','2026-06-15','2026-12-15','2026-05-20','2026-11-20','Sanjay Malhotra','Backup VMC available at Bending Section bay.',true,'2025-10-10 09:00:00','2026-06-15 14:00:00'),
  (:company,'Welding & Fabrication Cell','production','operational','high',88.00,8,2,48,
   '["Argon gas supply","Welding consumables","Certified welders"]','2026-05-10','2026-11-10','2026-04-18','2026-10-18','Vikram Singh',NULL,true,'2025-10-10 09:05:00','2026-05-10 11:00:00'),
  (:company,'Powder Coating / Painting Booth','production','at_risk','high',71.00,12,4,72,
   '["Paint stock","Booth exhaust system","Compressor"]','2026-07-01','2027-01-01','2026-02-12','2026-10-12','Ganesh Patil','Exhaust blower nearing end-of-life; replacement PO raised.',true,'2025-10-10 09:10:00','2026-07-01 16:30:00'),
  (:company,'ERP & MES IT Systems','it_systems','operational','critical',95.00,2,1,12,
   '["Cloud database","Network links","Backup power"]','2026-08-01','2027-02-01','2026-07-15','2027-01-15','Arun Gupta','Daily offsite backups verified; failover tested quarterly.',true,'2025-10-10 09:15:00','2026-08-01 10:00:00'),
  (:company,'Steel Sheet Supply Chain','supply_chain','degraded','high',64.50,48,24,120,
   '["Prime Steel Suppliers","Bharat Metal Works","Inbound logistics"]','2026-08-20','2027-02-20','2026-06-05','2026-12-05','Priya Sharma','Single-source exposure on 2mm SS sheet; second vendor onboarding in progress.',true,'2025-10-10 09:20:00','2026-08-20 12:00:00'),
  (:company,'Plant Power & Utilities','utilities','operational','critical',90.00,1,0,8,
   '["Grid supply","DG set 500kVA","UPS for MES"]','2026-07-25','2027-01-25','2026-07-25','2027-01-25','Mohan Das','DG load test passed at 82% load.',true,'2025-10-10 09:25:00','2026-07-25 15:45:00');

-- ============================================================================
-- Capacity flexibility snapshots (10)
-- ============================================================================
DELETE FROM capacity_flexibilities WHERE "companyId" = :company;
INSERT INTO capacity_flexibilities
  ("companyId","recordDate","resourceId","resourceName","resourceType","baseCapacity","currentCapacity",
   "currentDemand","utilizationRate",status,"surgeCapacity","flexibilityIndex",notes,"isActive","createdAt","updatedAt")
VALUES
  (:company,'2026-09-01',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'Cutting Section','work_center',176.00,176.00,158.00,0.8977,'balanced',210.00,0.7200,NULL,true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-BEND'),'Bending Section','work_center',176.00,168.00,149.00,0.8869,'balanced',195.00,0.6800,'One press brake down for scheduled maintenance.',true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'CNC Machining','work_center',176.00,176.00,182.00,1.0341,'overloaded',205.00,0.5500,'Overtime authorised for gearbox housing backlog.',true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'Welding Section','work_center',176.00,176.00,141.00,0.8011,'balanced',200.00,0.7500,NULL,true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PAINT'),'Painting Section','work_center',176.00,160.00,102.00,0.6375,'underutilized',176.00,0.8200,'Booth exhaust derating limits throughput.',true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'Assembly Section','work_center',352.00,352.00,318.00,0.9034,'balanced',400.00,0.7000,NULL,true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-QC'),'Quality Check','work_center',176.00,176.00,120.00,0.6818,'underutilized',190.00,0.8500,NULL,true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PACK'),'Packing Section','work_center',176.00,176.00,134.00,0.7614,'balanced',210.00,0.8000,NULL,true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',NULL,'Certified Welders Pool','labor',704.00,660.00,612.00,0.9273,'balanced',740.00,0.6000,'Two welders on leave; contract welders on standby.',true,'2026-09-01 07:00:00','2026-09-01 07:00:00'),
  (:company,'2026-09-01',NULL,'Assembly Fitters Pool','labor',1056.00,1056.00,905.00,0.8570,'balanced',1150.00,0.7400,NULL,true,'2026-09-01 07:00:00','2026-09-01 07:00:00');

-- ============================================================================
-- Carbon footprint records (12)
-- ============================================================================
DELETE FROM carbon_footprints WHERE "companyId" = :company;
INSERT INTO carbon_footprints
  ("companyId","recordDate",scope,source,"facilityId","facilityName","emissionAmount","emissionUnit",
   "targetAmount","reductionPercentage","dataType","isVerified","verifiedBy","verifiedAt",notes,"createdAt","updatedAt")
VALUES
  (:company,'2025-10-31','scope2','purchased_electricity',NULL,'B3 MACBIS Plant 1',48.2000,'tCO2e',50.0000,3.6000,'actual',true,'Neha Agarwal','2025-11-10 10:00:00',NULL,'2025-11-05 09:00:00','2025-11-10 10:00:00'),
  (:company,'2025-11-30','scope2','purchased_electricity',NULL,'B3 MACBIS Plant 1',51.6000,'tCO2e',50.0000,-3.2000,'actual',true,'Neha Agarwal','2025-12-08 10:00:00','Higher load from second shift on CNC.','2025-12-04 09:00:00','2025-12-08 10:00:00'),
  (:company,'2025-12-31','scope2','purchased_electricity',NULL,'B3 MACBIS Plant 1',44.9000,'tCO2e',50.0000,10.2000,'actual',true,'Neha Agarwal','2026-01-09 10:00:00','Holiday shutdown week reduced demand.','2026-01-05 09:00:00','2026-01-09 10:00:00'),
  (:company,'2026-01-31','scope2','purchased_electricity',NULL,'B3 MACBIS Plant 1',49.8000,'tCO2e',48.0000,-3.7500,'actual',true,'Neha Agarwal','2026-02-09 10:00:00',NULL,'2026-02-04 09:00:00','2026-02-09 10:00:00'),
  (:company,'2026-02-28','scope2','purchased_electricity',NULL,'B3 MACBIS Plant 1',46.1000,'tCO2e',48.0000,3.9600,'actual',true,'Neha Agarwal','2026-03-09 10:00:00',NULL,'2026-03-04 09:00:00','2026-03-09 10:00:00'),
  (:company,'2026-03-31','scope2','purchased_electricity',NULL,'B3 MACBIS Plant 1',47.3000,'tCO2e',48.0000,1.4600,'actual',true,'Neha Agarwal','2026-04-08 10:00:00',NULL,'2026-04-03 09:00:00','2026-04-08 10:00:00'),
  (:company,'2026-06-30','scope2','purchased_electricity',NULL,'B3 MACBIS Plant 1',45.0000,'tCO2e',46.0000,2.1700,'actual',false,NULL,NULL,'Rooftop solar (120 kWp) commissioned in May offsetting grid draw.','2026-07-03 09:00:00','2026-07-03 09:00:00'),
  (:company,'2025-12-31','scope1','diesel_generator',NULL,'B3 MACBIS Plant 1',6.8000,'tCO2e',7.5000,9.3300,'actual',true,'Neha Agarwal','2026-01-15 10:00:00','Q4 DG usage during grid outages.','2026-01-08 09:00:00','2026-01-15 10:00:00'),
  (:company,'2026-03-31','scope1','diesel_generator',NULL,'B3 MACBIS Plant 1',5.9000,'tCO2e',7.0000,15.7100,'actual',true,'Neha Agarwal','2026-04-14 10:00:00','Q1 DG usage; fewer outages.','2026-04-07 09:00:00','2026-04-14 10:00:00'),
  (:company,'2026-06-30','scope1','lpg_forklift',NULL,'B3 MACBIS Plant 1',2.4000,'tCO2e',2.5000,4.0000,'actual',false,NULL,NULL,'Two LPG forklifts; electric replacement evaluation ongoing.','2026-07-06 09:00:00','2026-07-06 09:00:00'),
  (:company,'2026-03-31','scope3','inbound_logistics',NULL,'B3 MACBIS Plant 1',18.7000,'tCO2e',20.0000,6.5000,'estimated',false,NULL,NULL,'Q1 steel and component freight estimate.','2026-04-10 09:00:00','2026-04-10 09:00:00'),
  (:company,'2026-06-30','scope3','outbound_logistics',NULL,'B3 MACBIS Plant 1',21.3000,'tCO2e',20.0000,-6.5000,'estimated',false,NULL,NULL,'Q2 dispatch volume up 12% vs Q1.','2026-07-10 09:00:00','2026-07-10 09:00:00');

-- ============================================================================
-- Customer portal accesses (5)
-- ============================================================================
DELETE FROM customer_portal_accesses WHERE "companyId" = :company;
INSERT INTO customer_portal_accesses
  ("companyId","customerId","customerName","contactName","contactEmail","orderNumber","projectName",
   "accessLevel","currentPhase","overallProgress",milestones,"notificationsEnabled","lastAccessedAt","isActive","expiresAt","createdAt","updatedAt")
VALUES
  (:company,COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' LIMIT 1),'CUST-DEMO-001'),'Harbour Grill Restaurants','Marcus Lee','marcus@harbourgrill.com','SO-DEMO-1042','Harbour Grill — Kitchen Line Refit','view_and_approve','production',68.00,
   '[{"name":"Design sign-off","status":"completed","date":"2026-07-05"},{"name":"Fabrication","status":"in_progress","date":"2026-09-20"},{"name":"FAT","status":"pending","date":"2026-10-05"}]',true,'2026-09-08 16:42:00',true,'2026-12-31 23:59:59','2026-06-20 10:00:00','2026-09-08 16:42:00'),
  (:company,COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' LIMIT 1),'CUST-DEMO-002'),'Blue Fig Hotels Group','Amelia Torres','amelia@bluefighotels.com','SO-DEMO-1055','Blue Fig — Banquet Kitchen Build','view_and_approve','assembly',82.00,
   '[{"name":"Fabrication","status":"completed","date":"2026-08-12"},{"name":"Assembly","status":"in_progress","date":"2026-09-15"},{"name":"Dispatch","status":"pending","date":"2026-09-28"}]',true,'2026-09-09 11:20:00',true,'2026-11-30 23:59:59','2026-07-01 09:30:00','2026-09-09 11:20:00'),
  (:company,COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' LIMIT 1),'CUST-DEMO-003'),'Metro Hospital Kitchens','Dr. Karen Ng','karen@metrohospital.org','SO-DEMO-1061','Metro Hospital — Central Kitchen Upgrade','view_only','procurement',35.00,
   '[{"name":"Design sign-off","status":"completed","date":"2026-08-22"},{"name":"Material procurement","status":"in_progress","date":"2026-09-25"}]',true,'2026-09-05 09:10:00',true,'2027-01-31 23:59:59','2026-08-10 14:00:00','2026-09-05 09:10:00'),
  (:company,COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' LIMIT 1),'CUST-DEMO-004'),'Golden Spoon Franchises','Priya Shah','priya@goldenspoon.com','SO-DEMO-1038','Golden Spoon — Rollout Batch 3','view_and_approve','dispatch',95.00,
   '[{"name":"Assembly","status":"completed","date":"2026-08-30"},{"name":"QC & packing","status":"completed","date":"2026-09-04"},{"name":"Dispatch","status":"in_progress","date":"2026-09-12"}]',true,'2026-09-07 18:05:00',true,'2026-10-31 23:59:59','2026-05-15 10:45:00','2026-09-07 18:05:00'),
  (:company,COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' LIMIT 1),'CUST-DEMO-005'),'Lakeside Resort & Spa','Henrik Olsen','henrik@lakesideresort.com','SO-DEMO-1070','Lakeside — Poolside Pantry Kitchen','view_only','design',12.00,
   '[{"name":"Site survey","status":"completed","date":"2026-08-28"},{"name":"Design sign-off","status":"in_progress","date":"2026-09-18"}]',true,'2026-09-02 08:55:00',true,'2027-03-31 23:59:59','2026-08-25 11:15:00','2026-09-02 08:55:00');

-- ============================================================================
-- Energy consumption records (14)
-- ============================================================================
DELETE FROM energy_consumptions WHERE "companyId" = :company;
INSERT INTO energy_consumptions
  ("companyId","recordDate","energyType","zoneId","zoneName","consumptionAmount","consumptionUnit",cost,currency,
   "renewablePercentage","peakDemand","peakDemandUnit","carbonEquivalent",notes,"createdAt","updatedAt")
VALUES
  (:company,'2025-10-31','electricity',NULL,'Plant 1 — Whole Facility',60250.0000,'kWh',542250.00,'INR',0.0000,265.0000,'kW',48.2000,NULL,'2025-11-03 09:00:00','2025-11-03 09:00:00'),
  (:company,'2025-11-30','electricity',NULL,'Plant 1 — Whole Facility',64500.0000,'kWh',580500.00,'INR',0.0000,278.0000,'kW',51.6000,'Second shift added on CNC machining.','2025-12-02 09:00:00','2025-12-02 09:00:00'),
  (:company,'2025-12-31','electricity',NULL,'Plant 1 — Whole Facility',56100.0000,'kWh',504900.00,'INR',0.0000,252.0000,'kW',44.9000,'Year-end shutdown 25 Dec–1 Jan.','2026-01-02 09:00:00','2026-01-02 09:00:00'),
  (:company,'2026-01-31','electricity',NULL,'Plant 1 — Whole Facility',62250.0000,'kWh',560250.00,'INR',0.0000,271.0000,'kW',49.8000,NULL,'2026-02-02 09:00:00','2026-02-02 09:00:00'),
  (:company,'2026-02-28','electricity',NULL,'Plant 1 — Whole Facility',57600.0000,'kWh',518400.00,'INR',0.0000,259.0000,'kW',46.1000,NULL,'2026-03-02 09:00:00','2026-03-02 09:00:00'),
  (:company,'2026-03-31','electricity',NULL,'Plant 1 — Whole Facility',59100.0000,'kWh',531900.00,'INR',0.0000,262.0000,'kW',47.3000,NULL,'2026-04-02 09:00:00','2026-04-02 09:00:00'),
  (:company,'2026-04-30','electricity',NULL,'Plant 1 — Whole Facility',61800.0000,'kWh',556200.00,'INR',0.0000,268.0000,'kW',49.4000,NULL,'2026-05-04 09:00:00','2026-05-04 09:00:00'),
  (:company,'2026-05-31','electricity',NULL,'Plant 1 — Whole Facility',63400.0000,'kWh',549600.00,'INR',6.5000,272.0000,'kW',49.0000,'Rooftop solar 120 kWp commissioned 18 May.','2026-06-02 09:00:00','2026-06-02 09:00:00'),
  (:company,'2026-06-30','electricity',NULL,'Plant 1 — Whole Facility',62100.0000,'kWh',520300.00,'INR',12.4000,266.0000,'kW',45.0000,NULL,'2026-07-02 09:00:00','2026-07-02 09:00:00'),
  (:company,'2026-07-31','electricity',NULL,'Plant 1 — Whole Facility',64800.0000,'kWh',536800.00,'INR',13.1000,275.0000,'kW',46.6000,NULL,'2026-08-03 09:00:00','2026-08-03 09:00:00'),
  (:company,'2026-08-31','electricity',NULL,'Plant 1 — Whole Facility',66200.0000,'kWh',547300.00,'INR',12.8000,281.0000,'kW',47.7000,'Record month; gearbox line at full load.','2026-09-02 09:00:00','2026-09-02 09:00:00'),
  (:company,'2026-08-31','electricity',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'CNC Machining Zone',21400.0000,'kWh',176900.00,'INR',12.8000,98.0000,'kW',15.4000,'Zone submeter reading.','2026-09-02 09:05:00','2026-09-02 09:05:00'),
  (:company,'2026-08-31','electricity',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'Welding Zone',11800.0000,'kWh',97600.00,'INR',12.8000,64.0000,'kW',8.5000,'Zone submeter reading.','2026-09-02 09:05:00','2026-09-02 09:05:00'),
  (:company,'2026-08-31','diesel',NULL,'Plant 1 — DG Set 500kVA',820.0000,'litres',77900.00,'INR',0.0000,NULL,NULL,2.2000,'Grid outage backup running hours: 14.5 h.','2026-09-02 09:10:00','2026-09-02 09:10:00');

-- ============================================================================
-- ESG scores (4)
-- ============================================================================
DELETE FROM esg_scores WHERE "companyId" = :company;
INSERT INTO esg_scores
  ("companyId","periodStartDate","periodEndDate","reportingPeriod","overallScore","environmentalScore",
   "socialScore","governanceScore",kpis,certifications,"executiveSummary","isPublished","publishedAt","approvedBy","createdAt","updatedAt")
VALUES
  (:company,'2025-01-01','2025-12-31','annual',71.40,66.00,74.50,73.80,
   '{"energyIntensity_kWh_per_unit":41.2,"waterRecycled_pct":34,"ltifr":0.8,"womenInWorkforce_pct":18}',
   '["ISO 9001:2015","ISO 14001:2015"]','FY2025 baseline ESG assessment for Plant 1. Key gaps: renewable energy share and scope 3 tracking.',true,'2026-02-15 12:00:00','Sanjay Malhotra','2026-01-20 10:00:00','2026-02-15 12:00:00'),
  (:company,'2025-10-01','2025-12-31','quarterly',69.80,63.50,73.00,73.00,
   '{"energyIntensity_kWh_per_unit":42.6,"scrapRate_pct":3.4,"ltifr":1.1}',
   '["ISO 9001:2015","ISO 14001:2015"]','Q4 FY2025: DG dependency during outages pulled environmental score down.',true,'2026-01-25 12:00:00','Sanjay Malhotra','2026-01-10 10:00:00','2026-01-25 12:00:00'),
  (:company,'2026-01-01','2026-03-31','quarterly',72.60,68.20,75.00,74.50,
   '{"energyIntensity_kWh_per_unit":40.8,"scrapRate_pct":3.1,"ltifr":0.6}',
   '["ISO 9001:2015","ISO 14001:2015"]','Q1 FY2026: improved outage profile and lower scrap on CNC line.',true,'2026-04-20 12:00:00','Sanjay Malhotra','2026-04-08 10:00:00','2026-04-20 12:00:00'),
  (:company,'2026-04-01','2026-06-30','quarterly',75.10,72.40,76.00,76.50,
   '{"energyIntensity_kWh_per_unit":39.5,"renewableShare_pct":12.4,"scrapRate_pct":2.8,"ltifr":0.6}',
   '["ISO 9001:2015","ISO 14001:2015"]','Q2 FY2026: rooftop solar commissioning lifted environmental score by 4.2 points.',false,NULL,NULL,'2026-07-12 10:00:00','2026-07-12 10:00:00');

-- ============================================================================
-- Green suppliers (8)
-- ============================================================================
DELETE FROM green_suppliers WHERE "companyId" = :company;
INSERT INTO green_suppliers
  ("companyId","vendorId","vendorName",tier,"sustainabilityScore","environmentalScore","socialScore","governanceScore",
   certifications,"assessmentStatus","lastAssessmentDate","nextAssessmentDate","isPreferred",notes,"isActive","createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','gold',82.50,80.00,84.00,84.50,'["ISO 14001:2015","ResponsibleSteel"]','completed','2026-05-12','2027-05-12',true,'EAF-route steel with 38% recycled content.',true,'2025-11-01 10:00:00','2026-05-12 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','silver',68.00,64.00,70.00,71.00,'["ISO 9001:2015"]','completed','2026-04-08','2027-04-08',false,NULL,true,'2025-11-01 10:05:00','2026-04-08 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','silver',71.30,69.00,72.50,73.00,'["ISO 14001:2015"]','completed','2026-06-20','2027-06-20',true,'RoHS-compliant component range.',true,'2025-11-01 10:10:00','2026-06-20 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','bronze',54.00,50.00,57.00,56.50,'[]','in_progress','2025-12-15','2026-12-15',false,'Improvement plan issued: effluent treatment and worker PPE compliance.',true,'2025-11-01 10:15:00','2026-08-01 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-005'),'ProTool Equipment Inc.','silver',66.80,62.00,69.50,70.00,'["ISO 9001:2015"]','completed','2026-03-18','2027-03-18',false,NULL,true,'2025-11-01 10:20:00','2026-03-18 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','gold',79.40,81.00,77.00,79.00,'["FSC Chain of Custody","ISO 14001:2015"]','completed','2026-07-02','2027-07-02',true,'100% recyclable packaging; FSC-certified corrugates.',true,'2025-11-01 10:25:00','2026-07-02 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-007'),'MaintainPro Services','bronze',58.20,55.00,61.00,59.50,'[]','pending',NULL,'2026-11-15',false,'First sustainability assessment scheduled Nov 2026.',true,'2025-11-01 10:30:00','2025-11-01 10:30:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','gold',84.10,86.00,81.00,84.00,'["ISO 14001:2015","EcoVadis Gold"]','completed','2026-02-25','2027-02-25',true,'Low-VOC coating chemistry supplier.',true,'2025-11-01 10:35:00','2026-02-25 15:00:00');

-- ============================================================================
-- Machine maintenance logs (10)
-- ============================================================================
DELETE FROM machine_maintenance_logs WHERE "equipmentCode" LIKE 'DEMO-EQ-%';
INSERT INTO machine_maintenance_logs
  ("workCenterId","equipmentCode","equipmentName","maintenanceType",status,description,"actionTaken",
   "scheduledDate","startDate","endDate","durationHours",cost,"performedBy","technicianNotes","createdBy","createdAt","updatedAt")
VALUES
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-CNC'),'DEMO-EQ-VMC-01','CNC Milling Machine VMC-850','Preventive','Completed','Quarterly PM: spindle lubrication, way cover inspection, coolant flush.','Replaced coolant, greased ball screws, verified spindle runout 0.004mm.','2026-07-12 08:00:00','2026-07-12 08:10:00','2026-07-12 14:30:00',6.33,18500.00,'MaintainPro Services','Spindle bearings healthy; next PM Oct 2026.','Mohan Das','2026-07-01 09:00:00','2026-07-12 15:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-CNC'),'DEMO-EQ-VMC-01','CNC Milling Machine VMC-850','Breakdown','Completed','ATC arm jammed mid tool-change; alarm 1021.','Realigned ATC arm, replaced worn gripper spring, ran 50 dry tool-change cycles.','2026-08-19 10:15:00','2026-08-19 10:30:00','2026-08-19 16:45:00',6.25,32400.00,'MaintainPro Services','Recommend gripper set replacement at next PM.','Mohan Das','2026-08-19 10:20:00','2026-08-19 17:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-CUT'),'DEMO-EQ-LSR-01','Fiber Laser Cutter 3kW','Preventive','Completed','Monthly PM: lens/nozzle inspection, chiller filter clean, rail lubrication.','Replaced protective lens, cleaned chiller condenser, calibrated capacitive height sensor.','2026-08-05 07:00:00','2026-08-05 07:05:00','2026-08-05 11:20:00',4.25,12800.00,'Ramesh Yadav',NULL,'Mohan Das','2026-07-28 09:00:00','2026-08-05 12:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-BEND'),'DEMO-EQ-PBR-01','Press Brake 110T','Corrective','Completed','Back gauge positioning drift ±0.3mm detected during QC audit.','Re-tensioned drive belt, recalibrated back gauge encoder, verified to ±0.05mm.','2026-08-11 09:00:00','2026-08-11 09:10:00','2026-08-11 13:40:00',4.50,9600.00,'Ramesh Yadav','Encoder coupling shows wear; monitor monthly.','Mohan Das','2026-08-10 16:00:00','2026-08-11 14:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-WELD'),'DEMO-EQ-WLD-01','MIG Welding Station 400A','Preventive','Completed','Quarterly PM: torch liner change, earth clamp check, wire feeder service.','Replaced torch liner and contact tips, cleaned feeder rollers.','2026-07-22 08:00:00','2026-07-22 08:00:00','2026-07-22 10:30:00',2.50,4200.00,'Ganesh Patil',NULL,'Mohan Das','2026-07-15 09:00:00','2026-07-22 11:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-PAINT'),'DEMO-EQ-PCB-01','Powder Coating Booth Line','Breakdown','Completed','Booth exhaust blower tripping on thermal overload.','Replaced blower motor bearings, balanced impeller, reset overload relay to nameplate FLA.','2026-08-27 11:00:00','2026-08-27 11:20:00','2026-08-28 09:30:00',10.17,45200.00,'MaintainPro Services','Blower motor at end of life; replacement PO recommended.','Mohan Das','2026-08-27 11:05:00','2026-08-28 10:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-QC'),'DEMO-EQ-CMM-01','Coordinate Measuring Machine','Calibration','Completed','Annual accredited calibration of CMM per ISO 10360-2.','Full volumetric verification; certificate CAL-2026-0847 issued.','2026-06-10 09:00:00','2026-06-10 09:00:00','2026-06-10 17:00:00',8.00,28000.00,'Instrument Calibration Service','MPEe 2.9+L/250 um confirmed within spec.','Mohan Das','2026-05-25 09:00:00','2026-06-11 09:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'DEMO-EQ-TRQ-01','Pneumatic Torque Tool Bank','Calibration','Completed','Semi-annual torque tool calibration for assembly line.','12 tools calibrated; 2 adjusted, all within +/-4% of set torque.','2026-08-14 08:00:00','2026-08-14 08:00:00','2026-08-14 12:00:00',4.00,6500.00,'Instrument Calibration Service',NULL,'Mohan Das','2026-08-01 09:00:00','2026-08-14 13:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-CUT'),'DEMO-EQ-LSR-01','Fiber Laser Cutter 3kW','Predictive','In Progress','Chiller vibration trend rising over 6 weeks (4.2 -> 6.8 mm/s RMS).','Vibration analysis scheduled; compressor mounts on order.','2026-09-09 08:00:00','2026-09-09 08:30:00',NULL,0.00,0.00,'MaintainPro Services',NULL,'Mohan Das','2026-09-05 09:00:00','2026-09-09 09:00:00'),
  ((SELECT id FROM work_centers WHERE "workCenterCode"='WC-BEND'),'DEMO-EQ-PBR-01','Press Brake 110T','Preventive','Scheduled','Quarterly PM: hydraulic oil analysis, ram guide adjustment, safety light curtain test.',NULL,'2026-09-25 08:00:00',NULL,NULL,0.00,0.00,NULL,NULL,'Mohan Das','2026-09-01 09:00:00','2026-09-01 09:00:00');

-- ============================================================================
-- Aggregate production plans (4)
-- ============================================================================
DELETE FROM production_aggregate_plans WHERE plan_number LIKE 'DEMO-AGP-%';
INSERT INTO production_aggregate_plans
  (company_id,plan_number,name,description,status,planning_strategy,start_date,end_date,"periodData",
   total_demand,total_production,ending_inventory,costs,currency,created_by,approved_by,approved_at,created_at,updated_at)
VALUES
  (:company,'DEMO-AGP-001','FY2026 H1 Aggregate Plan (Oct 25 - Mar 26)','Level strategy across motors, pumps and gearboxes for H1.','archived','level','2025-10-01','2026-03-31',
   '[{"period":"2025-10","demand":210,"production":220,"inventory":38},{"period":"2025-11","demand":225,"production":220,"inventory":33},{"period":"2025-12","demand":180,"production":200,"inventory":53},{"period":"2026-01","demand":230,"production":220,"inventory":43},{"period":"2026-02","demand":215,"production":220,"inventory":48},{"period":"2026-03","demand":235,"production":220,"inventory":33}]',
   1295.00,1300.00,33.00,'{"regularTime":8450000,"overtime":420000,"inventoryHolding":185000,"total":9055000}','INR','Priya Sharma','Sanjay Malhotra','2025-09-24 14:00:00','2025-09-15 10:00:00','2026-04-02 10:00:00'),
  (:company,'DEMO-AGP-002','FY2026 H2 Aggregate Plan (Apr - Sep 26)','Hybrid strategy: level base load plus chase for gearbox demand spike.','active','hybrid','2026-04-01','2026-09-30',
   '[{"period":"2026-04","demand":240,"production":240,"inventory":33},{"period":"2026-05","demand":255,"production":250,"inventory":28},{"period":"2026-06","demand":248,"production":250,"inventory":30},{"period":"2026-07","demand":262,"production":260,"inventory":28},{"period":"2026-08","demand":270,"production":270,"inventory":28},{"period":"2026-09","demand":258,"production":260,"inventory":30}]',
   1533.00,1530.00,30.00,'{"regularTime":9120000,"overtime":610000,"subcontract":250000,"inventoryHolding":142000,"total":10122000}','INR','Priya Sharma','Sanjay Malhotra','2026-03-20 15:30:00','2026-03-05 10:00:00','2026-09-01 08:00:00'),
  (:company,'DEMO-AGP-003','FY2027 H1 Aggregate Plan (Oct 26 - Mar 27)','Chase strategy draft pending sales forecast freeze.','draft','chase','2026-10-01','2027-03-31',
   '[{"period":"2026-10","demand":265,"production":265,"inventory":30},{"period":"2026-11","demand":280,"production":280,"inventory":30},{"period":"2026-12","demand":230,"production":230,"inventory":30}]',
   775.00,775.00,30.00,'{"regularTime":5010000,"overtime":380000,"hiringTraining":220000,"total":5610000}','INR','Priya Sharma',NULL,NULL,'2026-08-28 11:00:00','2026-08-28 11:00:00'),
  (:company,'DEMO-AGP-004','Gearbox Line Capacity Expansion Scenario','What-if scenario: PG-50 demand +40% with second shift on CNC.','approved','chase','2026-07-01','2026-12-31',
   '[{"period":"2026-Q3","demand":120,"production":118,"inventory":10},{"period":"2026-Q4","demand":145,"production":146,"inventory":11}]',
   265.00,264.00,11.00,'{"regularTime":2140000,"overtime":520000,"total":2660000}','INR','Suresh Patel','Sanjay Malhotra','2026-06-25 16:00:00','2026-06-12 09:30:00','2026-06-25 16:00:00');

-- ============================================================================
-- AI insights (8)
-- ============================================================================
DELETE FROM production_ai_insights WHERE insight_number LIKE 'DEMO-AII-%';
INSERT INTO production_ai_insights
  (company_id,insight_number,title,description,insight_type,category,status,priority,confidence_score,
   generated_at,expires_at,"recommendedActions","predictedImpact",model_name,model_version,acknowledged_by,acknowledged_at,action_taken,action_by,action_at,created_at,updated_at)
VALUES
  (:company,'DEMO-AII-001','Laser chiller failure predicted within 3 weeks','Vibration and temperature trends on the fiber laser chiller indicate compressor bearing degradation. Failure probability 78% within 21 days.','prediction','maintenance','acted_upon','critical',87.50,'2026-08-30 06:00:00','2026-09-30 06:00:00',
   '["Schedule predictive maintenance within 7 days","Order compressor mounting kit","Shift laser-heavy jobs earlier in week"]','{"avoidedDowntimeHours":18,"avoidedCost":260000}','equipment-failure-lstm','2.3.1','Mohan Das','2026-08-30 09:15:00','Predictive maintenance work order raised; chiller service scheduled 09 Sep.','Mohan Das','2026-09-05 10:00:00','2026-08-30 06:00:00','2026-09-05 10:00:00'),
  (:company,'DEMO-AII-002','CNC utilization exceeding sustainable threshold','CNC Machining has averaged 103% utilization for 3 consecutive weeks. Overtime fatigue risk and quality drift likely.','alert','capacity','acknowledged','high',92.00,'2026-09-02 06:00:00','2026-10-02 06:00:00',
   '["Offload gearbox housing roughing to subcontractor","Approve weekend shift for 2 weeks","Re-sequence WO backlog by margin"]','{"utilizationTarget":0.92,"backlogReductionDays":6}','capacity-monitor-v2','1.8.0','Priya Sharma','2026-09-02 11:30:00',NULL,NULL,NULL,'2026-09-02 06:00:00','2026-09-02 11:30:00'),
  (:company,'DEMO-AII-003','Weld rework rate trending up on pump casings','Rework rate on CP-200 pump casings rose from 2.1% to 4.8% over 4 weeks, correlated with new wire batch WB-2287.','trend','quality','acted_upon','high',81.00,'2026-08-18 06:00:00','2026-09-18 06:00:00',
   '["Quarantine wire batch WB-2287","Run weld coupon tests","Review gas flow settings on MIG station 2"]','{"scrapCostAtRisk":94000}','quality-drift-detector','3.1.0','Kiran Reddy','2026-08-18 10:00:00','Wire batch quarantined; supplier corrective action requested. Rework back to 2.3%.','Kiran Reddy','2026-08-25 14:00:00','2026-08-18 06:00:00','2026-08-25 14:00:00'),
  (:company,'DEMO-AII-004','Energy saving opportunity: idle spindle power','CNC spindles idle-run 14% of shift time drawing ~11 kW. Auto-sleep after 5 min idle would save ~1,850 kWh/month.','recommendation','cost','new','medium',74.00,'2026-09-06 06:00:00','2026-11-06 06:00:00',
   '["Enable spindle auto-sleep macro","Add idle-time KPI to andon board"]','{"monthlySavingKWh":1850,"monthlySavingINR":15540}','energy-optimizer','1.2.4',NULL,NULL,NULL,NULL,NULL,'2026-09-06 06:00:00','2026-09-06 06:00:00'),
  (:company,'DEMO-AII-005','Anomalous scrap spike on bending operation','Scrap on press brake jumped to 6.2% on 2026-09-04 vs 1.9% baseline. Correlated with operator change and new steel coil lot.','anomaly','quality','acknowledged','high',88.50,'2026-09-05 06:00:00','2026-10-05 06:00:00',
   '["Verify coil certificate for lot STL-26-0912","Refresher training on K-factor settings","Add first-article check for new lots"]','{"scrapCost":21800}','anomaly-scan-v4','4.0.2','Kiran Reddy','2026-09-05 08:45:00',NULL,NULL,NULL,'2026-09-05 06:00:00','2026-09-05 08:45:00'),
  (:company,'DEMO-AII-006','Motor line takt vs demand mismatch forecast','Forecast demand for Industrial Motor 5HP in Oct 2026 exceeds current takt capability by 9%. Bottleneck: winding station.','prediction','capacity','new','medium',79.00,'2026-09-07 06:00:00','2026-10-15 06:00:00',
   '["Add temp operator to winding station","Pre-build 40 stators in Sep slack window"]','{"potentialLateOrders":3,"revenueAtRisk":1500000}','demand-capacity-forecaster','2.0.0',NULL,NULL,NULL,NULL,NULL,'2026-09-07 06:00:00','2026-09-07 06:00:00'),
  (:company,'DEMO-AII-007','Safety: near-miss cluster at packing aisle','Vision analytics flagged 5 forklift/pedestrian near-miss events near the packing aisle crossing in 2 weeks.','alert','safety','acted_upon','critical',90.00,'2026-08-12 06:00:00','2026-09-12 06:00:00',
   '["Install pedestrian barrier and mirror at crossing","Repaint floor markings","Restrict forklift speed to 5 km/h in zone"]','{"incidentRiskReduction_pct":70}','safety-vision','1.5.2','Ganesh Patil','2026-08-12 09:00:00','Barrier installed 20 Aug; forklift speed limiters configured.','Ganesh Patil','2026-08-21 16:00:00','2026-08-12 06:00:00','2026-08-21 16:00:00'),
  (:company,'DEMO-AII-008','Obsolete insight: July paint booth humidity drift','Humidity drift in paint booth during July monsoon peak affected powder adhesion. Condition has normalised.','trend','quality','expired','low',70.00,'2026-07-08 06:00:00','2026-08-08 06:00:00',
   '["Monitor booth dehumidifier runtime"]','{}','quality-drift-detector','3.1.0','Kiran Reddy','2026-07-09 10:00:00',NULL,NULL,NULL,'2026-07-08 06:00:00','2026-08-08 06:05:00');

-- ============================================================================
-- Andon lines (6)
-- ============================================================================
DELETE FROM production_andon_lines WHERE "lineName" LIKE 'DEMO-LINE-%' OR line_name LIKE 'DEMO-LINE-%';
INSERT INTO production_andon_lines
  ("lineName",line_name,status,"currentProduct",current_product,"workOrderNumber",work_order_number,
   target,actual,oee,"cycleTime",cycle_time,operator,shift,alerts,created_at,updated_at)
VALUES
  ('DEMO-LINE-01 Motor Assembly','DEMO-LINE-01 Motor Assembly','running','Industrial Motor 5HP','Industrial Motor 5HP','WO-DEMO-0028','WO-DEMO-0028',40,31,78.5,11.5,11.5,'Rajesh Kumar','Shift A','[]','2026-09-10 06:00:00','2026-09-10 14:05:00'),
  ('DEMO-LINE-02 Pump Assembly','DEMO-LINE-02 Pump Assembly','running','Centrifugal Pump CP-200','Centrifugal Pump CP-200','WO-DEMO-0029','WO-DEMO-0029',25,18,72.1,16.8,16.8,'Amit Verma','Shift A','[{"type":"quality","message":"Seal seating check flagged on unit 12","raisedAt":"2026-09-10 11:42:00","status":"open"}]','2026-09-10 06:00:00','2026-09-10 14:05:00'),
  ('DEMO-LINE-03 Gearbox Cell','DEMO-LINE-03 Gearbox Cell','stopped','Precision Gearbox PG-50','Precision Gearbox PG-50','WO-DEMO-0030','WO-DEMO-0030',12,7,61.4,38.2,38.2,'Suresh Patel','Shift A','[{"type":"material","message":"Waiting for bearing kit from stores","raisedAt":"2026-09-10 13:20:00","status":"open"},{"type":"maintenance","message":"Torque tool 7 drifting, swapped to spare","raisedAt":"2026-09-10 09:05:00","status":"closed"}]','2026-09-10 06:00:00','2026-09-10 13:20:00'),
  ('DEMO-LINE-04 Laser Cutting','DEMO-LINE-04 Laser Cutting','running','Gearbox Housing Blanks','Gearbox Housing Blanks','WO-DEMO-0026','WO-DEMO-0026',60,52,84.7,4.6,4.6,'Ramesh Yadav','Shift A','[]','2026-09-10 06:00:00','2026-09-10 14:05:00'),
  ('DEMO-LINE-05 Welding Cell','DEMO-LINE-05 Welding Cell','running','Pump Casing Weldments','Pump Casing Weldments','WO-DEMO-0027','WO-DEMO-0027',30,24,76.3,13.4,13.4,'Ganesh Patil','Shift A','[]','2026-09-10 06:00:00','2026-09-10 14:05:00'),
  ('DEMO-LINE-06 Powder Coating','DEMO-LINE-06 Powder Coating','idle','—','—',NULL,NULL,0,0,55.0,0,0,'Vikram Singh','Shift A','[{"type":"maintenance","message":"Booth blower PM in progress, line idle till 15:30","raisedAt":"2026-09-10 12:00:00","status":"open"}]','2026-09-10 06:00:00','2026-09-10 12:00:00');

-- ============================================================================
-- Anomaly records (6)
-- ============================================================================
DELETE FROM production_anomaly_records WHERE anomaly_number LIKE 'DEMO-ANM-%';
INSERT INTO production_anomaly_records
  (company_id,anomaly_number,title,description,anomaly_type,status,severity,detected_at,metric_name,metric_value,
   expected_value,deviation_percentage,anomaly_score,"possibleCauses",detection_model,model_confidence,
   investigated_by,investigation_notes,root_cause,resolution_action,resolved_by,resolved_at,created_at,updated_at)
VALUES
  (:company,'DEMO-ANM-001','Press brake scrap rate spike','Scrap rate on bending operation exceeded 3-sigma control limit.','statistical','resolved','high','2026-09-04 10:32:00','scrap_rate_pct',6.2000,1.9000,226.32,91.00,
   '["New steel coil lot with different springback","Operator change on Shift A","Worn V-die"]','anomaly-scan-v4',88.50,'Kiran Reddy','Coil lot STL-26-0912 mill certificate shows yield strength at upper end of spec.','Springback variation from harder coil lot; K-factor not adjusted.','K-factor table updated per lot yield strength; first-article check added for new lots.','Kiran Reddy','2026-09-06 15:00:00','2026-09-04 10:32:00','2026-09-06 15:00:00'),
  (:company,'DEMO-ANM-002','CNC spindle load pattern shift','Spindle load signature on VMC-850 deviated from learned pattern during housing finishing pass.','pattern','resolved','medium','2026-08-19 09:50:00','spindle_load_pct',78.4000,62.0000,26.45,76.00,
   '["Tool wear","Incorrect tool offset","Material hardness variation"]','equipment-failure-lstm',82.00,'Suresh Patel','Insert wear beyond limit on T12 finishing tool.','Carbide insert exceeded wear limit; tool life counter misconfigured.','Insert replaced; tool life counter corrected to 45 min cutting time.','Suresh Patel','2026-08-19 14:20:00','2026-08-19 09:50:00','2026-08-19 14:20:00'),
  (:company,'DEMO-ANM-003','Paint booth energy consumption threshold breach','Booth energy per part exceeded threshold of 3.5 kWh/part for 3 consecutive days.','threshold','resolved','medium','2026-08-25 18:00:00','energy_per_part_kwh',4.6000,3.2000,43.75,71.50,
   '["Blower motor bearing drag","Extended curing cycles","Door left open during cure"]','energy-optimizer',77.00,'Mohan Das','Coincides with blower thermal overload trips on 27 Aug.','Failing blower motor bearings increased load current.','Blower motor bearings replaced during breakdown maintenance on 27-28 Aug.','Mohan Das','2026-08-28 10:00:00','2026-08-25 18:00:00','2026-08-28 10:00:00'),
  (:company,'DEMO-ANM-004','Cycle time drift on motor assembly','Rolling 4-hour average cycle time drifting up in context of unchanged product mix.','contextual','investigating','medium','2026-09-08 13:15:00','avg_cycle_time_min',13.2000,11.5000,14.78,68.00,
   '["Operator fatigue in heat wave","Parts presentation change after 5S re-layout","Torque tool swap"]','cycle-time-monitor',72.00,'Rajesh Kumar','Reviewing station video and hourly output logs.',NULL,NULL,NULL,NULL,'2026-09-08 13:15:00','2026-09-09 09:00:00'),
  (:company,'DEMO-ANM-005','Correlated quality dips across weld and QC stations','Simultaneous rise in weld rework and QC dimensional rejects suggests common upstream cause.','collective','investigating','high','2026-09-07 08:40:00','combined_defect_rate_pct',5.4000,2.5000,116.00,84.00,
   '["Fixture wear on welding jig 3","Steel lot variation","Laser cut edge quality drift"]','anomaly-scan-v4',80.00,'Kiran Reddy','Jig 3 locating pins measured 0.4mm undersize; laser edge dross normal.',NULL,NULL,NULL,NULL,'2026-09-07 08:40:00','2026-09-09 11:30:00'),
  (:company,'DEMO-ANM-006','False positive: OEE dip during planned changeover','OEE drop flagged on packing line was a scheduled changeover not entered in the planning calendar.','statistical','false_positive','low','2026-08-15 11:00:00','oee_pct',48.0000,74.0000,-35.14,62.00,
   '["Unrecorded planned changeover"]','anomaly-scan-v4',65.00,'Priya Sharma','Changeover WO existed but calendar sync job had failed overnight.','Planning calendar sync failure caused missing context.','Calendar sync job monitoring alert added.','Priya Sharma','2026-08-15 16:30:00','2026-08-15 11:00:00','2026-08-15 16:30:00');

-- ============================================================================
-- Asset trackers (8)
-- ============================================================================
DELETE FROM production_asset_trackers WHERE asset_code LIKE 'DEMO-AST-%';
INSERT INTO production_asset_trackers
  (company_id,asset_code,asset_name,asset_type,status,serial_number,rfid_tag,"currentLocation",
   assigned_to_work_center,assigned_to_operator,current_work_order,total_usage_hours,
   last_maintenance_date,next_maintenance_date,maintenance_interval_hours,purchase_date,purchase_cost,
   current_value,currency,depreciation_rate,warranty_expiry,is_active,created_by,created_at,updated_at)
VALUES
  (:company,'DEMO-AST-001','CNC Milling Machine VMC-850','machine','in_use','VMC850-2023-1147','RFID-0001','{"zone":"CNC Machining","bay":"B1"}','CNC Machining','Suresh Patel','WO-DEMO-0026',6840.50,'2026-07-12','2026-10-12',500,'2023-04-15',4500000.00,3150000.00,'INR',10.00,'2026-04-14',true,'Mohan Das','2025-10-05 09:00:00','2026-09-08 10:00:00'),
  (:company,'DEMO-AST-002','Fiber Laser Cutter 3kW','machine','in_use','FLC3K-2024-0332','RFID-0002','{"zone":"Cutting Section","bay":"A1"}','Cutting Section','Ramesh Yadav','WO-DEMO-0026',4120.00,'2026-08-05','2026-11-05',400,'2024-01-20',6200000.00,4960000.00,'INR',10.00,'2027-01-19',true,'Mohan Das','2025-10-05 09:05:00','2026-09-08 10:00:00'),
  (:company,'DEMO-AST-003','Press Brake 110T','machine','in_use','PB110-2022-0781','RFID-0003','{"zone":"Bending Section","bay":"A2"}','Bending Section','Ajay Pillai',NULL,8965.25,'2026-08-11','2026-09-25',450,'2022-08-10',3800000.00,2280000.00,'INR',10.00,'2025-08-09',true,'Mohan Das','2025-10-05 09:10:00','2026-09-08 10:00:00'),
  (:company,'DEMO-AST-004','Welding Jig — Pump Casing #3','fixture','maintenance','JIG-PC-003','RFID-0004','{"zone":"Tool Room","rack":"R4"}',NULL,NULL,NULL,2210.00,'2026-09-08',NULL,NULL,'2024-06-01',185000.00,120000.00,'INR',15.00,NULL,true,'Mohan Das','2025-10-05 09:15:00','2026-09-08 14:00:00'),
  (:company,'DEMO-AST-005','Hydraulic Die Set — Motor End Shield','tool','idle','DIE-MES-011','RFID-0005','{"zone":"Tool Room","rack":"R2"}',NULL,NULL,NULL,1480.75,'2026-06-30','2026-12-30',600,'2023-11-12',420000.00,294000.00,'INR',12.00,NULL,true,'Mohan Das','2025-10-05 09:20:00','2026-08-20 10:00:00'),
  (:company,'DEMO-AST-006','Electric Forklift 2T #1','vehicle','in_use','EFL2T-2025-0090','RFID-0006','{"zone":"Packing Section","aisle":"P1"}','Packing Section','Ganesh Patil',NULL,1955.00,'2026-07-28','2026-10-28',250,'2025-02-18',1450000.00,1233000.00,'INR',15.00,'2028-02-17',true,'Mohan Das','2025-10-05 09:25:00','2026-09-08 10:00:00'),
  (:company,'DEMO-AST-007','Steel Transport Container Rack A','container','transit','CNT-RACK-A17',NULL,'{"zone":"Inbound","truck":"KL-07-AX-2214"}',NULL,NULL,NULL,0.00,NULL,NULL,NULL,'2024-03-05',65000.00,48750.00,'INR',10.00,NULL,true,'Mohan Das','2025-10-05 09:30:00','2026-09-09 07:30:00'),
  (:company,'DEMO-AST-008','CMM — Coordinate Measuring Machine','equipment','in_use','CMM-2021-4456','RFID-0008','{"zone":"Quality Check","room":"Metrology Lab"}','Quality Check','Meera Nair',NULL,5320.00,'2026-06-10','2027-06-10',2000,'2021-09-30',2850000.00,1425000.00,'INR',10.00,'2024-09-29',true,'Mohan Das','2025-10-05 09:35:00','2026-09-08 10:00:00');

-- ============================================================================
-- Automation workflows (6)
-- ============================================================================
DELETE FROM production_automation_workflows WHERE workflow_code LIKE 'DEMO-AWF-%';
INSERT INTO production_automation_workflows
  (company_id,workflow_code,workflow_name,description,workflow_type,status,trigger_type,"triggerConfig",steps,
   notifications,execution_count,success_count,failure_count,last_execution_at,last_execution_status,
   next_scheduled_run,is_active,created_by,updated_by,created_at,updated_at)
VALUES
  (:company,'DEMO-AWF-001','Auto-release work orders on material availability','Releases planned work orders automatically when all BOM materials show available stock.','production','active','event','{"event":"stock.updated","filter":"wo.status=Planned"}',
   '[{"step":1,"action":"checkMaterialAvailability"},{"step":2,"action":"releaseWorkOrder"},{"step":3,"action":"notifyPlanner"}]',
   '{"channels":["email"],"recipients":["priya.sharma@b3macbis.demo"]}',148,141,7,'2026-09-09 16:20:00','success',NULL,true,'Priya Sharma','Priya Sharma','2025-11-12 10:00:00','2026-09-09 16:20:00'),
  (:company,'DEMO-AWF-002','Nightly OEE rollup and andon reset','Aggregates shift OEE, posts daily summary, resets andon counters at day change.','reporting','active','schedule','{"cron":"0 23 * * *","timezone":"Asia/Kolkata"}',
   '[{"step":1,"action":"aggregateShiftOEE"},{"step":2,"action":"postDailySummary"},{"step":3,"action":"resetAndonCounters"}]',
   '{"channels":["email","dashboard"],"recipients":["production-leads@b3macbis.demo"]}',312,309,3,'2026-09-09 23:00:00','success','2026-09-10 23:00:00',true,'Arun Gupta','Arun Gupta','2025-10-20 10:00:00','2026-09-09 23:01:00'),
  (:company,'DEMO-AWF-003','Auto-create maintenance WO on health score drop','Creates a corrective maintenance work order when equipment health score falls below 60.','maintenance','active','condition','{"metric":"health_score","operator":"<","threshold":60}',
   '[{"step":1,"action":"createMaintenanceWorkOrder"},{"step":2,"action":"assignTechnician"},{"step":3,"action":"notifyMaintenanceLead"}]',
   '{"channels":["email","sms"],"recipients":["mohan.das@b3macbis.demo"]}',9,9,0,'2026-08-27 11:05:00','success',NULL,true,'Mohan Das','Mohan Das','2026-01-15 10:00:00','2026-08-27 11:05:00'),
  (:company,'DEMO-AWF-004','QC hold on rejection threshold','Puts a work order on quality hold and alerts QC lead when in-process rejection exceeds 5%.','quality','active','condition','{"metric":"rejection_rate_pct","operator":">","threshold":5}',
   '[{"step":1,"action":"setWorkOrderQualityHold"},{"step":2,"action":"raiseNCR"},{"step":3,"action":"notifyQCLead"}]',
   '{"channels":["email"],"recipients":["kiran.reddy@b3macbis.demo"]}',14,13,1,'2026-09-04 10:35:00','success',NULL,true,'Kiran Reddy','Kiran Reddy','2026-02-10 10:00:00','2026-09-04 10:35:00'),
  (:company,'DEMO-AWF-005','Weekly slow-moving WIP report','Emails a report of WIP inventory idle for more than 14 days, every Monday 07:00.','inventory','paused','schedule','{"cron":"0 7 * * 1","timezone":"Asia/Kolkata"}',
   '[{"step":1,"action":"querySlowMovingWIP"},{"step":2,"action":"generateReport"},{"step":3,"action":"emailReport"}]',
   '{"channels":["email"],"recipients":["stores@b3macbis.demo"]}',38,36,2,'2026-08-24 07:00:00','success',NULL,false,'Priya Sharma','Arun Gupta','2025-12-01 10:00:00','2026-08-26 09:00:00'),
  (:company,'DEMO-AWF-006','Draft: auto-dispatch note on QC pass','On final QC pass, generate dispatch note draft and notify logistics. Pending approval.','production','draft','event','{"event":"qc.final.passed"}',
   '[{"step":1,"action":"generateDispatchNoteDraft"},{"step":2,"action":"notifyLogistics"}]',
   '{"channels":["email"],"recipients":["logistics@b3macbis.demo"]}',0,0,0,NULL,NULL,NULL,true,'Ganesh Patil',NULL,'2026-08-30 15:00:00','2026-08-30 15:00:00');

-- ============================================================================
-- BOM templates (5)
-- ============================================================================
DELETE FROM production_bom_templates WHERE code LIKE 'DEMO-BTPL-%';
INSERT INTO production_bom_templates
  (code,name,category,description,bom_type,uom,components,component_count,status,created_by,created_at,updated_at)
VALUES
  ('DEMO-BTPL-001','SS Cabinet Base Frame Template','Fabrication','Standard template for stainless steel cabinet base frames — cut, bend, weld sequence.','manufacturing','PCS',
   '[{"itemCode":"RM-STL-001","itemName":"Steel Sheet 2mm","qty":12,"uom":"KG"},{"itemCode":"CON-CLT-001","itemName":"Cutting Coolant Concentrate","qty":0.2,"uom":"LTR"}]',2,'active','Suresh Patel','2025-10-08 10:00:00+00','2026-05-14 09:00:00+00'),
  ('DEMO-BTPL-002','5HP Motor Build Template','Assembly','Template BOM for 5HP motor family; copper winding gauge parameterised.','manufacturing','PCS',
   '[{"itemCode":"RM-STL-001","qty":30,"uom":"KG"},{"itemCode":"RM-COP-001","qty":120,"uom":"MTR"},{"itemCode":"RM-ALM-001","qty":4,"uom":"MTR"},{"itemCode":"SP-BRG-001","qty":2,"uom":"PCS"},{"itemCode":"CON-LUB-001","qty":0.5,"uom":"LTR"}]',5,'active','Rajesh Kumar','2025-10-08 10:10:00+00','2026-08-01 10:00:00+00'),
  ('DEMO-BTPL-003','Pump Family Assembly Template','Assembly','Base template for CP-series centrifugal pumps with shaft sub-assembly.','assembly','PCS',
   '[{"itemCode":"RM-STL-001","qty":18,"uom":"KG"},{"itemCode":"RM-ALM-001","qty":3,"uom":"MTR"},{"itemCode":"WIP-SFT-001","qty":1,"uom":"PCS"},{"itemCode":"SP-SL-001","qty":1,"uom":"PCS"},{"itemCode":"SP-BRG-001","qty":2,"uom":"PCS"}]',5,'active','Rajesh Kumar','2025-10-08 10:20:00+00','2026-08-01 10:05:00+00'),
  ('DEMO-BTPL-004','Gearbox Housing Machining Template','Machining','CNC machining template for gearbox housing variants from plate stock.','manufacturing','PCS',
   '[{"itemCode":"RM-STL-001","qty":20,"uom":"KG"},{"itemCode":"CON-CLT-001","qty":0.4,"uom":"LTR"},{"itemCode":"TOOL-INS-001","qty":0.1,"uom":"BOX"}]',3,'active','Suresh Patel','2025-10-08 10:30:00+00','2026-08-01 10:10:00+00'),
  ('DEMO-BTPL-005','Legacy Kit Packing Template','Packing','Obsolete kit-packing template retained for reference; superseded by DEMO-BTPL-001.','kit','SET',
   '[{"itemCode":"SP-BLT-001","qty":2,"uom":"PCS"},{"itemCode":"SP-BRG-001","qty":2,"uom":"PCS"}]',2,'inactive','Ganesh Patil','2025-10-08 10:40:00+00','2026-03-01 09:00:00+00');

-- ============================================================================
-- BOM verifications (5)
-- ============================================================================
DELETE FROM production_bom_verifications WHERE "bomCode" LIKE 'DEMO-BOM-%' OR bom_code LIKE 'DEMO-BOM-%';
INSERT INTO production_bom_verifications
  ("bomCode",bom_code,"productName",product_name,"verificationDate",verification_date,"verifiedBy",verified_by,
   status,completeness,"submittedToProcurement",submitted_to_procurement,checks,created_at,updated_at)
VALUES
  ('DEMO-BOM-001','DEMO-BOM-001','Industrial Motor 5HP','Industrial Motor 5HP','2026-08-02','2026-08-02','Kiran Reddy','Kiran Reddy','verified',100,true,true,
   '[{"check":"All components have valid item codes","result":"pass"},{"check":"Costs rolled up within 2% of standard","result":"pass"},{"check":"Lead times populated","result":"pass"}]','2026-08-02 10:00:00','2026-08-02 12:00:00'),
  ('DEMO-BOM-002','DEMO-BOM-002','Centrifugal Pump CP-200','Centrifugal Pump CP-200','2026-08-02','2026-08-02','Kiran Reddy','Kiran Reddy','verified',100,true,true,
   '[{"check":"All components have valid item codes","result":"pass"},{"check":"Sub-assembly BOM active","result":"pass"}]','2026-08-02 10:30:00','2026-08-02 12:10:00'),
  ('DEMO-BOM-003','DEMO-BOM-003','Precision Gearbox PG-50','Precision Gearbox PG-50','2026-08-03','2026-08-03','Meera Nair','Meera Nair','verified',96,true,true,
   '[{"check":"All components have valid item codes","result":"pass"},{"check":"QC template attached","result":"warning","note":"Inspection plan reference pending"}]','2026-08-03 09:00:00','2026-08-03 11:00:00'),
  ('DEMO-BOM-004','DEMO-BOM-004','Gearbox Housing (Machined)','Gearbox Housing (Machined)','2026-08-03','2026-08-03','Meera Nair','Meera Nair','verified',100,true,true,
   '[{"check":"Scrap percentage validated against 90-day actuals","result":"pass"}]','2026-08-03 09:30:00','2026-08-03 11:05:00'),
  ('DEMO-BOM-005','DEMO-BOM-005','Drive Shaft Assembly (WIP)','Drive Shaft Assembly (WIP)','2026-09-05','2026-09-05','Kiran Reddy','Kiran Reddy','in_review',80,false,false,
   '[{"check":"All components have valid item codes","result":"pass"},{"check":"Alternate material approval","result":"pending","note":"EN8 substitute under evaluation"}]','2026-09-05 14:00:00','2026-09-05 14:00:00');

-- ============================================================================
-- Capacity plans (8)
-- ============================================================================
DELETE FROM production_capacity_plans WHERE plan_number LIKE 'DEMO-CAP-%';
INSERT INTO production_capacity_plans
  (company_id,plan_number,name,description,"planType",status,start_date,end_date,work_center_id,
   available_capacity,required_capacity,utilization_percentage,capacity_unit,is_bottleneck,
   created_by,approved_by,approved_at,is_optimized,optimization_score,optimized_at,total_overtime_hours,created_at,updated_at)
VALUES
  (:company,'DEMO-CAP-001','Sep 2026 — CNC Machining','Detailed finite plan for CNC cell, gearbox housing heavy month.','detailed','active','2026-09-01','2026-09-30',(SELECT id FROM work_centers WHERE "workCenterCode"='WC-CNC'),352.00,364.00,103.41,'hours',true,'Priya Sharma','Sanjay Malhotra','2026-08-28 15:00:00',true,74.50,'2026-08-28 16:00:00+00',24.00,'2026-08-25 10:00:00','2026-09-01 08:00:00'),
  (:company,'DEMO-CAP-002','Sep 2026 — Cutting Section','Laser and shear capacity for September order book.','detailed','active','2026-09-01','2026-09-30',(SELECT id FROM work_centers WHERE "workCenterCode"='WC-CUT'),352.00,316.00,89.77,'hours',false,'Priya Sharma','Sanjay Malhotra','2026-08-28 15:00:00',true,88.00,'2026-08-28 16:00:00+00',0.00,'2026-08-25 10:05:00','2026-09-01 08:00:00'),
  (:company,'DEMO-CAP-003','Sep 2026 — Welding Section','Weld cell load including pump casing rework buffer.','detailed','active','2026-09-01','2026-09-30',(SELECT id FROM work_centers WHERE "workCenterCode"='WC-WELD'),352.00,282.00,80.11,'hours',false,'Priya Sharma','Sanjay Malhotra','2026-08-28 15:00:00',false,NULL,NULL,0.00,'2026-08-25 10:10:00','2026-09-01 08:00:00'),
  (:company,'DEMO-CAP-004','Sep 2026 — Assembly Section','Two-shift assembly plan for motors, pumps and gearboxes.','detailed','active','2026-09-01','2026-09-30',(SELECT id FROM work_centers WHERE "workCenterCode"='WC-ASSY'),704.00,636.00,90.34,'hours',false,'Priya Sharma','Sanjay Malhotra','2026-08-28 15:00:00',true,81.20,'2026-08-28 16:00:00+00',12.00,'2026-08-25 10:15:00','2026-09-01 08:00:00'),
  (:company,'DEMO-CAP-005','Sep 2026 — Painting Section','Derated plan while booth blower awaits replacement.','detailed','active','2026-09-01','2026-09-30',(SELECT id FROM work_centers WHERE "workCenterCode"='WC-PAINT'),320.00,204.00,63.75,'hours',false,'Priya Sharma','Sanjay Malhotra','2026-08-28 15:00:00',false,NULL,NULL,0.00,'2026-08-25 10:20:00','2026-09-01 08:00:00'),
  (:company,'DEMO-CAP-006','Q4 2026 Rough-Cut — Plant 1','Rough-cut capacity check for Oct-Dec demand plan across all centers.','rough_cut','draft','2026-10-01','2026-12-31',NULL,4224.00,4030.00,95.41,'hours',false,'Priya Sharma',NULL,NULL,false,NULL,NULL,0.00,'2026-09-02 11:00:00','2026-09-02 11:00:00'),
  (:company,'DEMO-CAP-007','Aug 2026 — CNC Machining','Completed August finite plan; actual utilization 101%.','detailed','completed','2026-08-01','2026-08-31',(SELECT id FROM work_centers WHERE "workCenterCode"='WC-CNC'),352.00,349.00,99.15,'hours',true,'Priya Sharma','Sanjay Malhotra','2026-07-28 15:00:00',true,79.00,'2026-07-28 16:00:00+00',18.00,'2026-07-25 10:00:00','2026-09-01 09:00:00'),
  (:company,'DEMO-CAP-008','Aug 2026 — Quality Check','Completed August QC bench and CMM loading plan.','detailed','completed','2026-08-01','2026-08-31',(SELECT id FROM work_centers WHERE "workCenterCode"='WC-QC'),352.00,238.00,67.61,'hours',false,'Priya Sharma','Sanjay Malhotra','2026-07-28 15:00:00',false,NULL,NULL,0.00,'2026-07-25 10:05:00','2026-09-01 09:00:00');

-- ============================================================================
-- Demand plans (4)
-- ============================================================================
DELETE FROM production_demand_plans WHERE plan_number LIKE 'DEMO-DMP-%';
INSERT INTO production_demand_plans
  (company_id,plan_number,name,description,status,forecast_method,planning_horizon_months,start_date,end_date,
   "demandItems","seasonalFactors",total_forecast_quantity,total_forecast_value,currency,confidence_level,
   assumptions,created_by,approved_by,approved_at,created_at,updated_at)
VALUES
  (:company,'DEMO-DMP-001','FY2026 Annual Demand Plan','12-month demand plan across motor, pump and gearbox families.','approved','exponential_smoothing',12,'2025-10-01','2026-09-30',
   '[{"itemCode":"FG-MTR-001","annualQty":1450,"unitPrice":12500},{"itemCode":"FG-PMP-001","annualQty":890,"unitPrice":8500},{"itemCode":"FG-GBX-001","annualQty":410,"unitPrice":22000}]',
   '{"Q1":0.96,"Q2":1.02,"Q3":1.05,"Q4":0.97}',2750.00,34715000.00,'INR',95.00,
   '["No major price revisions in FY2026","Golden Spoon rollout continues at batch cadence","Export orders excluded"]','Priya Sharma','Sanjay Malhotra','2025-09-22 14:00:00','2025-09-10 10:00:00','2025-09-22 14:00:00'),
  (:company,'DEMO-DMP-002','Gearbox PG-50 Demand Uplift Plan','Revised PG-50 forecast after two OEM frame agreements signed in June.','active','regression',6,'2026-07-01','2026-12-31',
   '[{"itemCode":"FG-GBX-001","periodQty":[38,42,45,48,50,47],"unitPrice":22000}]',
   '{"monsoon_dip":0.95}',270.00,5940000.00,'INR',90.00,
   '["OEM offtake per signed MOU","CNC second shift approved from Sep"]','Priya Sharma','Sanjay Malhotra','2026-06-28 12:00:00','2026-06-20 09:00:00','2026-09-01 08:30:00'),
  (:company,'DEMO-DMP-003','Spares & Service Parts Forecast H2-2026','Moving-average forecast for bearings, seals and belt spares demand.','active','moving_average',6,'2026-07-01','2026-12-31',
   '[{"itemCode":"SP-BRG-001","monthlyAvgQty":120,"unitPrice":450},{"itemCode":"SP-SL-001","monthlyAvgQty":35,"unitPrice":1200},{"itemCode":"SP-BLT-001","monthlyAvgQty":60,"unitPrice":280}]',
   NULL,1290.00,677400.00,'INR',85.00,
   '["3-month trailing window","Service contract renewals assumed flat"]','Ravi Menon',NULL,NULL,'2026-06-25 10:00:00','2026-06-25 10:00:00'),
  (:company,'DEMO-DMP-004','FY2027 Preliminary Demand Plan','Draft seasonal forecast pending sales input freeze on 30 Sep.','draft','seasonal',12,'2026-10-01','2027-09-30',
   '[{"itemCode":"FG-MTR-001","annualQty":1600},{"itemCode":"FG-PMP-001","annualQty":950},{"itemCode":"FG-GBX-001","annualQty":520}]',
   '{"Q1":0.95,"Q2":1.03,"Q3":1.06,"Q4":0.96}',3070.00,39515000.00,'INR',75.00,
   '["Assumes 8% market growth","New export channel not included"]','Priya Sharma',NULL,NULL,'2026-09-01 11:00:00','2026-09-01 11:00:00');

-- ============================================================================
-- Die & tool assets (8)
-- ============================================================================
DELETE FROM production_die_tool_assets WHERE asset_code LIKE 'DEMO-DTA-%';
INSERT INTO production_die_tool_assets
  (asset_code,name,type,status,life_used,max_life,location,current_work_order,created_at,updated_at)
VALUES
  ('DEMO-DTA-001','Blanking Die — Motor End Shield','Die','In Use',41200,100000,'Press Brake Bay A2','WO-DEMO-0028','2025-10-06 09:00:00+00','2026-09-09 10:00:00+00'),
  ('DEMO-DTA-002','Forming Die — Pump Volute Half','Die','Available',67800,90000,'Tool Room Rack R1',NULL,'2025-10-06 09:05:00+00','2026-08-30 10:00:00+00'),
  ('DEMO-DTA-003','V-Die 86deg x 835mm','Tool','In Use',18450,60000,'Press Brake Bay A2','WO-DEMO-0027','2025-10-06 09:10:00+00','2026-09-09 10:00:00+00'),
  ('DEMO-DTA-004','Punch Set — Louvre 40mm','Tool','Maintenance',52300,55000,'Tool Room — Regrind Bench',NULL,'2025-10-06 09:15:00+00','2026-09-07 14:00:00+00'),
  ('DEMO-DTA-005','Welding Fixture — Gearbox Housing','Fixture','In Use',12800,80000,'Welding Section Jig Station 1','WO-DEMO-0030','2025-10-06 09:20:00+00','2026-09-09 10:00:00+00'),
  ('DEMO-DTA-006','Casting Mold — Impeller CP-200','Mold','Available',8900,40000,'Tool Room Rack R3',NULL,'2025-10-06 09:25:00+00','2026-07-15 10:00:00+00'),
  ('DEMO-DTA-007','Trim Die — Cabinet Door Edge','Die','Worn',58800,60000,'Tool Room — Quarantine Shelf',NULL,'2025-10-06 09:30:00+00','2026-08-22 11:00:00+00'),
  ('DEMO-DTA-008','Drill Jig — Base Frame 8-hole','Fixture','Available',21500,120000,'Tool Room Rack R2',NULL,'2025-10-06 09:35:00+00','2026-06-18 10:00:00+00');

-- ============================================================================
-- Digital twins (5)
-- ============================================================================
DELETE FROM production_digital_twins WHERE code LIKE 'DEMO-DTW-%';
INSERT INTO production_digital_twins
  (company_id,code,name,description,twin_type,status,physical_asset_id,physical_asset_name,last_sync_at,
   sync_interval_seconds,"currentState",sensors,"performanceMetrics",is_active,created_by,created_at,updated_at)
VALUES
  (:company,'DEMO-DTW-001','VMC-850 Machine Twin','Real-time twin of the CNC vertical machining center with spindle and axis telemetry.','machine','connected','DEMO-AST-001','CNC Milling Machine VMC-850','2026-09-10 13:58:00',30,
   '{"mode":"auto","program":"O4512-HOUSING-FIN","spindleRPM":6400,"spindleLoadPct":58,"feedOverridePct":100}',
   '[{"id":"spindle_temp","type":"temperature","unit":"C","value":52.4},{"id":"vib_x","type":"vibration","unit":"mm/s","value":2.1},{"id":"coolant_flow","type":"flow","unit":"L/min","value":18.6}]',
   '{"oee":0.79,"availability":0.91,"performance":0.88,"quality":0.985}',true,'Arun Gupta','2026-02-01 10:00:00','2026-09-10 13:58:00'),
  (:company,'DEMO-DTW-002','Fiber Laser Twin','Twin of the 3kW fiber laser with chiller health model attached.','machine','connected','DEMO-AST-002','Fiber Laser Cutter 3kW','2026-09-10 13:59:00',30,
   '{"mode":"cutting","material":"SS304 2mm","powerPct":82,"cutSpeed_mm_min":4200}',
   '[{"id":"chiller_vib","type":"vibration","unit":"mm/s","value":6.8},{"id":"lens_temp","type":"temperature","unit":"C","value":41.0}]',
   '{"oee":0.85,"availability":0.93,"performance":0.94,"quality":0.972}',true,'Arun Gupta','2026-02-01 10:10:00','2026-09-10 13:59:00'),
  (:company,'DEMO-DTW-003','Assembly Line Twin','Line-level twin aggregating station takt, buffer levels and andon events.','production_line','connected','DEMO-LINE-01','Motor Assembly Line','2026-09-10 13:55:00',60,
   '{"taktTime_min":11.5,"activeStations":6,"bufferUnits":9,"openAndonAlerts":0}',
   '[{"id":"line_counter","type":"counter","unit":"pcs","value":31}]',
   '{"oee":0.785,"availability":0.90,"performance":0.89,"quality":0.98}',true,'Arun Gupta','2026-03-15 10:00:00','2026-09-10 13:55:00'),
  (:company,'DEMO-DTW-004','Powder Coating Booth Twin','Booth environment twin: temperature, humidity and blower condition.','work_center','syncing','DEMO-EQ-PCB-01','Powder Coating Booth Line','2026-09-10 12:02:00',120,
   '{"boothTemp_C":34.2,"humidityPct":61,"blowerState":"maintenance"}',
   '[{"id":"booth_rh","type":"humidity","unit":"%","value":61},{"id":"blower_current","type":"current","unit":"A","value":0}]',
   '{"oee":0.55,"availability":0.68,"performance":0.85,"quality":0.95}',true,'Arun Gupta','2026-04-10 10:00:00','2026-09-10 12:02:00'),
  (:company,'DEMO-DTW-005','Plant 1 Factory Twin','Factory-level twin: energy, throughput and zone status rollup. Edge gateway offline since panel rewiring.','factory','disconnected','PLANT-1','B3 MACBIS Plant 1','2026-09-08 22:14:00',300,
   '{"zonesOnline":7,"zonesTotal":8,"todayThroughputUnits":86,"energyToday_kWh":2140}',
   NULL,'{"oee":0.76}',true,'Arun Gupta','2026-05-20 10:00:00','2026-09-09 06:00:00');

-- ============================================================================
-- Downtime records (12)
-- ============================================================================
DELETE FROM production_downtime_records WHERE downtime_number LIKE 'DEMO-DTR-%';
INSERT INTO production_downtime_records
  (company_id,downtime_number,status,downtime_type,category,work_center_id,work_center_name,machine_name,
   work_order_id,start_time,end_time,duration_minutes,reason,description,root_cause,corrective_action,
   currency,reported_by,resolved_by,shift_id,created_at,updated_at)
VALUES
  (:company,'DEMO-DTR-001','resolved','unplanned','breakdown',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'CNC Machining','CNC Milling Machine VMC-850',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0026'),'2026-08-19 10:15:00','2026-08-19 16:45:00',390.00,'ATC arm jammed during tool change','Alarm 1021; spindle stopped mid cycle.','Worn gripper spring caused misalignment.','Gripper spring replaced; 50 dry cycles verified.','INR','Suresh Patel','MaintainPro Services','SHIFT-A','2026-08-19 10:20:00','2026-08-19 17:00:00'),
  (:company,'DEMO-DTR-002','resolved','unplanned','breakdown',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PAINT'),'Painting Section','Powder Coating Booth Line',NULL,'2026-08-27 11:00:00','2026-08-28 09:30:00',1350.00,'Booth exhaust blower thermal overload trips','Repeated trips; booth unusable for cure cycles.','Blower motor bearing failure increasing load current.','Bearings replaced, impeller balanced.','INR','Ganesh Patil','MaintainPro Services','SHIFT-A','2026-08-27 11:05:00','2026-08-28 10:00:00'),
  (:company,'DEMO-DTR-003','resolved','planned','maintenance',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'Cutting Section','Fiber Laser Cutter 3kW',NULL,'2026-08-05 07:00:00','2026-08-05 11:20:00',260.00,'Monthly preventive maintenance','Scheduled PM window per maintenance calendar.',NULL,NULL,'INR','Mohan Das','Ramesh Yadav','SHIFT-A','2026-08-05 07:00:00','2026-08-05 12:00:00'),
  (:company,'DEMO-DTR-004','resolved','unplanned','material_shortage',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'Assembly Section',NULL,(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0025'),'2026-08-12 13:30:00','2026-08-12 15:10:00',100.00,'Bearing kit stockout at line','SP-BRG-001 bin empty; stores replenishment delayed.','Kanban card not scanned at previous replenishment.','Kanban scan compliance audit; min level raised to 40.','INR','Rajesh Kumar','Ravi Menon','SHIFT-A','2026-08-12 13:35:00','2026-08-12 15:30:00'),
  (:company,'DEMO-DTR-005','resolved','planned','changeover',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-BEND'),'Bending Section','Press Brake 110T',NULL,'2026-08-15 09:00:00','2026-08-15 10:25:00',85.00,'Die changeover: cabinet panel to motor end shield','Scheduled changeover between product families.',NULL,NULL,'INR','Ajay Pillai','Ajay Pillai','SHIFT-A','2026-08-15 09:00:00','2026-08-15 10:30:00'),
  (:company,'DEMO-DTR-006','resolved','unplanned','quality_issue',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'Welding Section','MIG Welding Station 2',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0027'),'2026-08-20 11:10:00','2026-08-20 13:00:00',110.00,'Weld porosity found in-process; line stopped for containment','Porosity cluster on pump casing seam welds.','Contaminated wire batch WB-2287.','Batch quarantined; feeder and liner cleaned.','INR','Ganesh Patil','Kiran Reddy','SHIFT-A','2026-08-20 11:15:00','2026-08-20 13:30:00'),
  (:company,'DEMO-DTR-007','resolved','unplanned','operator_unavailable',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-QC'),'Quality Check','Coordinate Measuring Machine',NULL,'2026-08-24 08:00:00','2026-08-24 09:40:00',100.00,'CMM operator absent; inspections queued','Certified CMM operator on unplanned leave.',NULL,'Second operator certification fast-tracked.','INR','Meera Nair','Meera Nair','SHIFT-A','2026-08-24 08:05:00','2026-08-24 10:00:00'),
  (:company,'DEMO-DTR-008','resolved','planned','setup',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'CNC Machining','CNC Milling Machine VMC-850',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0029'),'2026-09-01 07:00:00','2026-09-01 08:05:00',65.00,'Fixture and program setup for new housing revision','First-off approved by QC at 08:05.',NULL,NULL,'INR','Suresh Patel','Suresh Patel','SHIFT-A','2026-09-01 07:00:00','2026-09-01 08:10:00'),
  (:company,'DEMO-DTR-009','resolved','unplanned','breakdown',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PACK'),'Packing Section','Strapping Machine',NULL,'2026-09-03 14:20:00','2026-09-03 15:35:00',75.00,'Strapping machine feed jam','Strap coil telescoped inside dispenser.','Incorrect coil loading after replenishment.','Loading instruction card posted at station.','INR','Ganesh Patil','Mohan Das','SHIFT-B','2026-09-03 14:25:00','2026-09-03 15:40:00'),
  (:company,'DEMO-DTR-010','resolved','unplanned','breakdown',NULL,'Plant 1 — Utilities','Grid Supply / DG Set',NULL,'2026-09-05 12:40:00','2026-09-05 13:05:00',25.00,'Grid power outage; DG changeover','Production paused during changeover to DG.','Utility-side feeder fault.',NULL,'INR','Mohan Das','Mohan Das','SHIFT-A','2026-09-05 12:42:00','2026-09-05 13:10:00'),
  (:company,'DEMO-DTR-011','pending_analysis','unplanned','quality_issue',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-BEND'),'Bending Section','Press Brake 110T',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'2026-09-04 10:30:00','2026-09-04 11:45:00',75.00,'Scrap spike stop — bend angle out of tolerance','Line stopped after 5 consecutive out-of-tolerance parts.',NULL,NULL,'INR','Ajay Pillai',NULL,'SHIFT-A','2026-09-04 10:32:00','2026-09-04 12:00:00'),
  (:company,'DEMO-DTR-012','ongoing','planned','maintenance',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PAINT'),'Painting Section','Powder Coating Booth Line',NULL,'2026-09-10 12:00:00',NULL,NULL,'Booth blower PM — line idle until 15:30','Planned PM slot for exhaust blower inspection after August failure.',NULL,NULL,'INR','Mohan Das',NULL,'SHIFT-A','2026-09-10 12:00:00','2026-09-10 12:00:00');

-- ============================================================================
-- Production entries (10)
-- ============================================================================
DELETE FROM production_entries WHERE "entryNumber" LIKE 'DEMO-PE-%';
INSERT INTO production_entries
  ("entryNumber","entryType",status,"postingDate","postingTime","workOrderId","workOrderNumber","itemId","itemCode","itemName",
   "operationId","operationCode","operationName","workCenterId","workCenterCode","workCenterName",
   quantity,"acceptedQuantity","rejectedQuantity","scrapQuantity",uom,
   "totalMaterialCost","totalLaborCost","overheadCost","totalCost","costPerUnit",
   "setupTimeMinutes","runTimeMinutes","totalTimeMinutes","operatorName","employeeCode",shift,
   "inventoryPosted","inventoryPostedAt","submittedBy","submittedAt","postedBy","createdBy","createdAt","updatedAt")
VALUES
  ('DEMO-PE-0001','Production','Posted','2026-07-08','2026-07-08 17:10:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0001'),'WO-DEMO-0001',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',(SELECT id::text FROM operations WHERE "operationCode"='OP-ASSY'),'OP-ASSY','Assembly',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',40.0000,39.0000,1.0000,0.0000,'PCS',408800.00,42000.00,20000.00,470800.00,11770.00,45.00,460.00,505.00,'Rajesh Kumar','EMP-001','Shift A',true,'2026-07-08 17:30:00','Rajesh Kumar','2026-07-08 17:15:00','Priya Sharma','Rajesh Kumar','2026-07-08 17:00:00','2026-07-08 17:30:00'),
  ('DEMO-PE-0002','Production','Posted','2026-07-15','2026-07-15 16:40:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0002'),'WO-DEMO-0002',(SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',(SELECT id::text FROM operations WHERE "operationCode"='OP-ASSY'),'OP-ASSY','Assembly',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',25.0000,25.0000,0.0000,0.0000,'PCS',146000.00,24500.00,11250.00,181750.00,7270.00,30.00,420.00,450.00,'Amit Verma','EMP-004','Shift A',true,'2026-07-15 17:00:00','Amit Verma','2026-07-15 16:45:00','Priya Sharma','Amit Verma','2026-07-15 16:30:00','2026-07-15 17:00:00'),
  ('DEMO-PE-0003','Production','Posted','2026-07-22','2026-07-22 15:55:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0003'),'WO-DEMO-0003',(SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',(SELECT id::text FROM operations WHERE "operationCode"='OP-CNC'),'OP-CNC','CNC Operation',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',60.0000,57.0000,1.0000,2.0000,'PCS',107280.00,39000.00,12000.00,158280.00,2638.00,65.00,1180.00,1245.00,'Suresh Patel','EMP-003','Shift A',true,'2026-07-22 16:20:00','Suresh Patel','2026-07-22 16:00:00','Priya Sharma','Suresh Patel','2026-07-22 15:45:00','2026-07-22 16:20:00'),
  ('DEMO-PE-0004','Production','Posted','2026-07-29','2026-07-29 16:05:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0004'),'WO-DEMO-0004',(SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'WIP-SFT-001','Drive Shaft Assembly (WIP)',(SELECT id::text FROM operations WHERE "operationCode"='OP-GRIND'),'OP-GRIND','Grinding',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',80.0000,78.0000,2.0000,0.0000,'PCS',77600.00,17600.00,4800.00,100000.00,1250.00,40.00,640.00,680.00,'Vikram Singh','EMP-006','Shift B',true,'2026-07-29 16:30:00','Vikram Singh','2026-07-29 16:10:00','Priya Sharma','Vikram Singh','2026-07-29 15:55:00','2026-07-29 16:30:00'),
  ('DEMO-PE-0005','Production','Posted','2026-08-06','2026-08-06 17:20:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0005'),'WO-DEMO-0005',(SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',(SELECT id::text FROM operations WHERE "operationCode"='OP-ASSY'),'OP-ASSY','Assembly',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',15.0000,15.0000,0.0000,0.0000,'PCS',143775.00,90000.00,27000.00,260775.00,17385.00,60.00,570.00,630.00,'Suresh Patel','EMP-003','Shift A',true,'2026-08-06 17:45:00','Suresh Patel','2026-08-06 17:25:00','Priya Sharma','Suresh Patel','2026-08-06 17:10:00','2026-08-06 17:45:00'),
  ('DEMO-PE-0006','Production','Posted','2026-08-13','2026-08-13 16:50:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0006'),'WO-DEMO-0006',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',(SELECT id::text FROM operations WHERE "operationCode"='OP-ASSY'),'OP-ASSY','Assembly',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',30.0000,29.0000,0.0000,1.0000,'PCS',306600.00,31500.00,15000.00,353100.00,11770.00,45.00,345.00,390.00,'Rajesh Kumar','EMP-001','Shift A',true,'2026-08-13 17:10:00','Rajesh Kumar','2026-08-13 16:55:00','Priya Sharma','Rajesh Kumar','2026-08-13 16:40:00','2026-08-13 17:10:00'),
  ('DEMO-PE-0007','Rework','Posted','2026-08-21','2026-08-21 15:30:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0007'),'WO-DEMO-0007',(SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',(SELECT id::text FROM operations WHERE "operationCode"='OP-WELD'),'OP-WELD','Welding',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'WC-WELD','Welding Section',3.0000,3.0000,0.0000,0.0000,'PCS',2400.00,3600.00,900.00,6900.00,2300.00,20.00,140.00,160.00,'Ganesh Patil','EMP-020','Shift A',true,'2026-08-21 15:50:00','Ganesh Patil','2026-08-21 15:35:00','Priya Sharma','Ganesh Patil','2026-08-21 15:20:00','2026-08-21 15:50:00'),
  ('DEMO-PE-0008','Scrap','Posted','2026-09-04','2026-09-04 12:15:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0008'),'WO-DEMO-0008',(SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',(SELECT id::text FROM operations WHERE "operationCode"='OP-BEND'),'OP-BEND','Bending',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-BEND'),'WC-BEND','Bending Section',5.0000,0.0000,0.0000,5.0000,'PCS',8940.00,0.00,0.00,8940.00,1788.00,0.00,0.00,0.00,'Ajay Pillai','EMP-012','Shift A',true,'2026-09-04 12:30:00','Ajay Pillai','2026-09-04 12:18:00','Priya Sharma','Ajay Pillai','2026-09-04 12:10:00','2026-09-04 12:30:00'),
  ('DEMO-PE-0009','Production','Posted','2026-09-05','2026-09-05 17:00:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0009'),'WO-DEMO-0009',(SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',(SELECT id::text FROM operations WHERE "operationCode"='OP-ASSY'),'OP-ASSY','Assembly',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',12.0000,12.0000,0.0000,0.0000,'PCS',115020.00,72000.00,21600.00,208620.00,17385.00,55.00,456.00,511.00,'Suresh Patel','EMP-003','Shift A',true,'2026-09-05 17:20:00','Suresh Patel','2026-09-05 17:05:00','Priya Sharma','Suresh Patel','2026-09-05 16:50:00','2026-09-05 17:20:00'),
  ('DEMO-PE-0010','Production','Submitted','2026-09-09','2026-09-09 16:45:00',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0010'),'WO-DEMO-0010',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',(SELECT id::text FROM operations WHERE "operationCode"='OP-ASSY'),'OP-ASSY','Assembly',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',35.0000,34.0000,1.0000,0.0000,'PCS',357700.00,36750.00,17500.00,411950.00,11770.00,45.00,402.00,447.00,'Rajesh Kumar','EMP-001','Shift A',false,NULL,'Rajesh Kumar','2026-09-09 16:50:00',NULL,'Rajesh Kumar','2026-09-09 16:40:00','2026-09-09 16:50:00');

-- ============================================================================
-- Equipment health assessments (8)
-- ============================================================================
DELETE FROM production_equipment_health WHERE company_id = :company;
INSERT INTO production_equipment_health
  (company_id,equipment_id,equipment_code,equipment_name,equipment_type,work_center_id,assessment_date,
   health_score,health_status,"sensorReadings","predictedFailures",mtbf_hours,mttr_hours,total_operating_hours,
   hours_since_maintenance,next_maintenance_due,"maintenanceRecommendations",recorded_by,created_at,updated_at)
VALUES
  (:company,'DEMO-AST-001','DEMO-EQ-VMC-01','CNC Milling Machine VMC-850','cnc_machine',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'2026-09-08 06:00:00',86.50,'good',
   '{"spindle_temp_C":52.4,"vib_mm_s":2.1,"coolant_ph":8.9}','[]',612.00,5.80,6840.50,410.00,'2026-10-12 08:00:00','["Replace ATC gripper set at next PM"]','Mohan Das','2026-09-08 06:05:00','2026-09-08 06:05:00'),
  (:company,'DEMO-AST-002','DEMO-EQ-LSR-01','Fiber Laser Cutter 3kW','laser_cutter',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'2026-09-08 06:00:00',58.00,'poor',
   '{"chiller_vib_mm_s":6.8,"chiller_temp_C":24.8,"lens_temp_C":41.0}','[{"component":"chiller compressor bearing","probability":0.78,"window_days":21}]',540.00,6.20,4120.00,250.00,'2026-09-09 08:00:00','["Immediate chiller compressor service","Order mounting kit","Reduce continuous-cut duty until serviced"]','Mohan Das','2026-09-08 06:10:00','2026-09-08 06:10:00'),
  (:company,'DEMO-AST-003','DEMO-EQ-PBR-01','Press Brake 110T','press_brake',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-BEND'),'2026-09-08 06:00:00',78.00,'good',
   '{"hyd_oil_temp_C":48.2,"ram_drift_mm":0.05}','[]',720.00,4.50,8965.25,200.00,'2026-09-25 08:00:00','["Monitor back gauge encoder coupling monthly"]','Mohan Das','2026-09-08 06:15:00','2026-09-08 06:15:00'),
  (:company,'DEMO-EQ-WLD-01','DEMO-EQ-WLD-01','MIG Welding Station 400A','welding_station',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'2026-09-08 06:00:00',88.00,'good',
   '{"duty_cycle_pct":54,"gas_flow_lpm":14.2}','[]',980.00,2.10,3320.00,340.00,'2026-10-22 08:00:00','[]','Mohan Das','2026-09-08 06:20:00','2026-09-08 06:20:00'),
  (:company,'DEMO-EQ-PCB-01','DEMO-EQ-PCB-01','Powder Coating Booth Line','coating_booth',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PAINT'),'2026-09-08 06:00:00',64.00,'fair',
   '{"blower_current_A":11.8,"booth_temp_C":34.2,"humidity_pct":61}','[{"component":"exhaust blower motor","probability":0.45,"window_days":90}]',450.00,12.50,7210.00,95.00,'2026-11-27 08:00:00','["Replace blower motor before Q1 2027","Keep spare belt set in stores"]','Mohan Das','2026-09-08 06:25:00','2026-09-08 06:25:00'),
  (:company,'DEMO-AST-008','DEMO-EQ-CMM-01','Coordinate Measuring Machine','metrology',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-QC'),'2026-09-08 06:00:00',92.00,'excellent',
   '{"lab_temp_C":20.1,"lab_rh_pct":45}','[]',2100.00,3.00,5320.00,720.00,'2027-06-10 08:00:00','[]','Mohan Das','2026-09-08 06:30:00','2026-09-08 06:30:00'),
  (:company,'DEMO-AST-006','DEMO-EQ-EFL-01','Electric Forklift 2T #1','material_handling',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PACK'),'2026-09-08 06:00:00',81.50,'good',
   '{"battery_soh_pct":91,"hyd_pressure_bar":162}','[]',830.00,3.40,1955.00,290.00,'2026-10-28 08:00:00','["Battery equalization charge monthly"]','Mohan Das','2026-09-08 06:35:00','2026-09-08 06:35:00'),
  (:company,'DEMO-EQ-CMP-01','DEMO-EQ-CMP-01','Screw Air Compressor 75kW','utility',NULL,'2026-09-08 06:00:00',43.00,'critical',
   '{"discharge_temp_C":98.5,"vibration_mm_s":8.9,"oil_carryover_ppm":9}','[{"component":"airend bearings","probability":0.85,"window_days":14}]',380.00,9.00,15200.00,610.00,'2026-09-12 08:00:00','["Immediate airend overhaul","Arrange rental compressor for overhaul window"]','Mohan Das','2026-09-08 06:40:00','2026-09-08 06:40:00');
