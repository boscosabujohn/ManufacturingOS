-- Demo seed — Production (planning, MRP, OEE, quality, maintenance, floor) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first, then re-inserts.
-- Delete predicates: company_id = :company where the column exists; otherwise a
--   DEMO- prefixed unique code/number (documented per table below).
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- 1. production_lines (delete: company_id)
-- ============================================================================
DELETE FROM production_lines WHERE company_id = :company;
INSERT INTO production_lines
  (company_id, code, name, description, line_type, status, location, building, floor,
   capacity_per_hour, capacity_uom, standard_cycle_time, takt_time, "workCenters",
   min_operators, max_operators, "operatingHours", capabilities, oee_target, current_oee,
   cost_per_hour, currency, supervisor_name, is_active, created_by, created_at, updated_at)
VALUES
  (:company,'DEMO-LN-FAB','Fabrication Line 1','Sheet metal fabrication: laser cutting, bending and CNC machining','fabrication','active','Bay A','Plant 1','Ground',
   12.5,'PCS',4.8,5.2,'["WC-CUT","WC-BEND","WC-CNC"]',
   4,8,'{"shifts":2,"start":"06:00","end":"22:00","days":6}','["laser_cutting","press_brake","cnc_milling"]',85.00,81.40,
   145.00,'USD','Rajesh Kumar',true,'Rajesh Kumar','2025-10-01 08:00:00','2026-09-01 09:15:00'),
  (:company,'DEMO-LN-ASM','Assembly Line 1','Final assembly of motors, pumps and gearboxes','assembly','active','Bay B','Plant 1','Ground',
   8.0,'PCS',7.5,8.0,'["WC-ASSY","WC-QC"]',
   6,12,'{"shifts":2,"start":"06:00","end":"22:00","days":6}','["mechanical_assembly","torque_control","leak_testing"]',85.00,84.20,
   120.00,'USD','Priya Sharma',true,'Rajesh Kumar','2025-10-01 08:10:00','2026-09-02 10:05:00'),
  (:company,'DEMO-LN-FIN','Finishing Line 1','Welding, powder coating and packing line','mixed','active','Bay C','Plant 1','Ground',
   10.0,'PCS',6.0,6.4,'["WC-WELD","WC-PAINT","WC-PACK"]',
   4,9,'{"shifts":2,"start":"06:00","end":"22:00","days":6}','["mig_welding","powder_coating","packing"]',82.00,77.60,
   132.00,'USD','Vikram Singh',true,'Rajesh Kumar','2025-10-01 08:20:00','2026-09-03 11:30:00');

-- ============================================================================
-- 2. production_line_configs (delete: code LIKE 'DEMO-LN-%')
-- ============================================================================
DELETE FROM production_line_configs WHERE code LIKE 'DEMO-LN-%';
INSERT INTO production_line_configs
  (code, name, department, location, line_type, work_centers, operators, capacity,
   efficiency, utilization, status, shift_schedule, supervisor, created_at, updated_at)
VALUES
  ('DEMO-LN-FAB','Fabrication Line 1','Production','Plant 1 - Bay A','Fabrication',3,8,100.00,86.50,78.20,'operational','2 Shifts (06:00-22:00)','Rajesh Kumar','2025-10-01 08:30:00','2026-09-01 09:20:00'),
  ('DEMO-LN-ASM','Assembly Line 1','Production','Plant 1 - Bay B','Assembly',2,12,64.00,89.10,83.40,'operational','2 Shifts (06:00-22:00)','Priya Sharma','2025-10-01 08:35:00','2026-09-02 10:10:00'),
  ('DEMO-LN-FIN','Finishing Line 1','Production','Plant 1 - Bay C','Mixed',3,9,80.00,82.70,75.90,'operational','2 Shifts (06:00-22:00)','Vikram Singh','2025-10-01 08:40:00','2026-09-03 11:35:00');

-- ============================================================================
-- 3. production_plans (delete: "planNumber" LIKE 'DEMO-PP-%')
-- ============================================================================
DELETE FROM production_plans WHERE "planNumber" LIKE 'DEMO-PP-%';
INSERT INTO production_plans
  ("planNumber","planName",description,status,"planningMethod","periodStartDate","periodEndDate","periodName","planningDate",
   "itemId","itemCode","itemName","itemCategory","demandQuantity","forecastQuantity","openOrderQuantity","currentStockQuantity",
   "plannedProductionQuantity","actualProductionQuantity",uom,"netRequirement","safetyStock","leadTimeDays","lotSize",
   "requiredCapacityHours","availableCapacityHours","capacityUtilizationPercentage","hasCapacityConstraint",
   "workCenterId","workCenterCode","workCenterName","mrpRunExecuted","mrpRunDate","mrpRunBy",
   "completionPercentage","isFrozen","submittedBy","submittedAt","approvedBy","approvedAt",notes,"createdBy","createdAt","updatedAt")
VALUES
  ('DEMO-PP-2606','Motors Plan - Jun 2026','Monthly production plan for Industrial Motor 5HP','Completed','MRP','2026-06-01','2026-06-30','Jun 2026','2026-05-20',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP','Finished Good',180,160,45,30,
   195,192,'PCS',195,25,10,50,
   340.00,380.00,89.47,false,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',true,'2026-05-22 09:00:00','Rajesh Kumar',
   98.46,true,'Priya Sharma','2026-05-23 10:00:00','Rajesh Kumar','2026-05-24 14:30:00','Completed with 3 units carried to July','Priya Sharma','2026-05-20 09:00:00','2026-07-02 08:30:00'),
  ('DEMO-PP-2607','Pumps Plan - Jul 2026','Monthly production plan for Centrifugal Pump CP-200','Completed','MRP','2026-07-01','2026-07-31','Jul 2026','2026-06-19',
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200','Finished Good',140,130,38,22,
   150,147,'PCS',150,20,12,50,
   295.00,360.00,81.94,false,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',true,'2026-06-21 09:30:00','Rajesh Kumar',
   98.00,true,'Priya Sharma','2026-06-22 11:00:00','Rajesh Kumar','2026-06-23 15:00:00',NULL,'Priya Sharma','2026-06-19 09:00:00','2026-08-03 08:45:00'),
  ('DEMO-PP-2608','Gearbox Plan - Aug 2026','Monthly production plan for Precision Gearbox PG-50','In Progress','MRP','2026-08-01','2026-08-31','Aug 2026','2026-07-20',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50','Finished Good',95,90,28,15,
   105,88,'PCS',105,15,15,25,
   420.00,440.00,95.45,true,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',true,'2026-07-22 08:45:00','Rajesh Kumar',
   83.81,false,'Priya Sharma','2026-07-23 10:15:00','Rajesh Kumar','2026-07-24 13:00:00','CNC capacity constrained; overtime authorised week 34','Priya Sharma','2026-07-20 09:00:00','2026-09-08 17:20:00'),
  ('DEMO-PP-2609','Motors Plan - Sep 2026','Monthly production plan for Industrial Motor 5HP','In Progress','Make to Stock','2026-09-01','2026-09-30','Sep 2026','2026-08-20',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP','Finished Good',200,185,52,28,
   210,55,'PCS',210,25,10,50,
   365.00,380.00,96.05,true,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',true,'2026-08-22 09:00:00','Rajesh Kumar',
   26.19,false,'Priya Sharma','2026-08-23 09:40:00','Rajesh Kumar','2026-08-24 12:10:00',NULL,'Priya Sharma','2026-08-20 09:00:00','2026-09-09 16:00:00'),
  ('DEMO-PP-2610','Gearbox Housings - Oct 2026','WIP housings plan feeding gearbox assembly','Approved','MRP','2026-10-01','2026-10-31','Oct 2026','2026-09-05',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)','Semi-Finished Good',120,110,0,18,
   125,0,'PCS',125,20,8,25,
   250.00,440.00,56.82,false,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',true,'2026-09-06 10:00:00','Rajesh Kumar',
   0.00,false,'Priya Sharma','2026-09-06 15:00:00','Rajesh Kumar','2026-09-08 09:30:00',NULL,'Priya Sharma','2026-09-05 09:00:00','2026-09-08 09:30:00'),
  ('DEMO-PP-2611','Pumps Plan - Oct 2026','Draft plan for Centrifugal Pump CP-200','Draft','MRP','2026-10-01','2026-10-31','Oct 2026','2026-09-08',
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200','Finished Good',135,128,30,25,
   140,0,'PCS',140,20,12,50,
   280.00,360.00,77.78,false,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',false,NULL,NULL,
   0.00,false,NULL,NULL,NULL,NULL,'Awaiting September sales forecast confirmation','Priya Sharma','2026-09-08 11:00:00','2026-09-08 11:00:00');

-- ============================================================================
-- 4. production_master_schedules (delete: company_id)
-- ============================================================================
DELETE FROM production_master_schedules WHERE company_id = :company;
INSERT INTO production_master_schedules
  (company_id, schedule_number, name, description, status, planning_horizon_weeks, frozen_horizon_weeks,
   start_date, end_date, "scheduleItems", "demandSources", time_fence_days, planning_time_fence_days,
   exceptions, created_by, released_by, released_at, created_at, updated_at)
VALUES
  (:company,'DEMO-MPS-2025-Q4','Master Schedule Q4 2025','MPS covering Oct-Dec 2025 for finished goods','closed',13,4,
   '2025-10-01','2025-12-31',
   '[{"itemCode":"FG-MTR-001","week":"2025-W41","plannedQty":45},{"itemCode":"FG-PMP-001","week":"2025-W43","plannedQty":35},{"itemCode":"FG-GBX-001","week":"2025-W45","plannedQty":20}]',
   '[{"type":"forecast","reference":"FC-2025-Q4"},{"type":"sales_order","reference":"SO-2025-0412"}]',
   30,60,NULL,'Priya Sharma','Rajesh Kumar','2025-09-28 14:00:00','2025-09-25 09:00:00','2026-01-05 08:30:00'),
  (:company,'DEMO-MPS-2026-Q1','Master Schedule Q1 2026','MPS covering Jan-Mar 2026 for finished goods','closed',13,4,
   '2026-01-01','2026-03-31',
   '[{"itemCode":"FG-MTR-001","week":"2026-W03","plannedQty":50},{"itemCode":"FG-PMP-001","week":"2026-W06","plannedQty":40},{"itemCode":"FG-GBX-001","week":"2026-W10","plannedQty":22}]',
   '[{"type":"forecast","reference":"FC-2026-Q1"}]',
   30,60,NULL,'Priya Sharma','Rajesh Kumar','2025-12-27 11:00:00','2025-12-20 09:30:00','2026-04-03 08:30:00'),
  (:company,'DEMO-MPS-2026-Q2','Master Schedule Q2 2026','MPS covering Apr-Jun 2026 for finished goods','closed',13,4,
   '2026-04-01','2026-06-30',
   '[{"itemCode":"FG-MTR-001","week":"2026-W15","plannedQty":55},{"itemCode":"FG-PMP-001","week":"2026-W18","plannedQty":42},{"itemCode":"FG-GBX-001","week":"2026-W22","plannedQty":25}]',
   '[{"type":"forecast","reference":"FC-2026-Q2"},{"type":"sales_order","reference":"SO-2026-0178"}]',
   30,60,'[{"week":"2026-W20","issue":"CNC capacity overload 8%","resolution":"overtime"}]',
   'Priya Sharma','Rajesh Kumar','2026-03-27 10:30:00','2026-03-20 09:00:00','2026-07-02 08:15:00'),
  (:company,'DEMO-MPS-2026-Q3','Master Schedule Q3 2026','MPS covering Jul-Sep 2026 for finished goods','released',13,4,
   '2026-07-01','2026-09-30',
   '[{"itemCode":"FG-MTR-001","week":"2026-W29","plannedQty":60},{"itemCode":"FG-PMP-001","week":"2026-W32","plannedQty":45},{"itemCode":"FG-GBX-001","week":"2026-W36","plannedQty":28}]',
   '[{"type":"forecast","reference":"FC-2026-Q3"},{"type":"sales_order","reference":"SO-2026-0455"}]',
   30,60,'[{"week":"2026-W34","issue":"Steel sheet supply delay 3 days","resolution":"expedite PO"}]',
   'Priya Sharma','Rajesh Kumar','2026-06-26 15:00:00','2026-06-20 09:00:00','2026-09-05 10:40:00');

-- ============================================================================
-- 5. production_mrp_runs (delete: children first, then company_id)
-- ============================================================================
DELETE FROM production_planned_orders WHERE company_id = :company;
DELETE FROM production_material_requirements WHERE company_id = :company;
DELETE FROM production_mrp_runs WHERE company_id = :company;
INSERT INTO production_mrp_runs
  (company_id, run_number, name, description, run_type, status, planning_horizon_days,
   start_date, end_date, run_started_at, run_completed_at, items_processed,
   planned_orders_created, action_messages_generated, parameters, summary, errors,
   created_by, created_at, updated_at)
VALUES
  (:company,'DEMO-MRP-2026-001','Regenerative Run - Jun 2026','Full regenerative MRP for June planning cycle','regenerative','completed',90,
   '2026-06-01','2026-08-30','2026-05-22 08:30:00','2026-05-22 09:12:00',18,
   3,7,'{"includeSafetyStock":true,"considerLotSize":true,"pegging":"full"}',
   '{"shortages":2,"expedite":3,"deExpedite":1,"cancel":1}',NULL,
   'Rajesh Kumar','2026-05-22 08:30:00','2026-05-22 09:12:00'),
  (:company,'DEMO-MRP-2026-002','Net Change Run - Jul 2026','Net change run after July demand update','net_change','completed',90,
   '2026-07-01','2026-09-28','2026-06-21 09:00:00','2026-06-21 09:25:00',11,
   3,4,'{"includeSafetyStock":true,"considerLotSize":true,"pegging":"single_level"}',
   '{"shortages":1,"expedite":2,"deExpedite":0,"cancel":0}',NULL,
   'Rajesh Kumar','2026-06-21 09:00:00','2026-06-21 09:25:00'),
  (:company,'DEMO-MRP-2026-003','Regenerative Run - Aug 2026','Full regenerative MRP for August planning cycle','regenerative','completed',90,
   '2026-08-01','2026-10-29','2026-07-22 08:15:00','2026-07-22 09:05:00',18,
   4,9,'{"includeSafetyStock":true,"considerLotSize":true,"pegging":"full"}',
   '{"shortages":3,"expedite":4,"deExpedite":1,"cancel":1}',NULL,
   'Rajesh Kumar','2026-07-22 08:15:00','2026-07-22 09:05:00'),
  (:company,'DEMO-MRP-2026-004','Selective Run - Sep 2026 Gearbox','Selective run for gearbox family after CNC constraint','selective','completed',60,
   '2026-09-01','2026-10-30','2026-08-22 08:45:00','2026-08-22 09:02:00',6,
   3,3,'{"includeSafetyStock":true,"considerLotSize":true,"itemFilter":["FG-GBX-001","WIP-GBX-001","WIP-SFT-001"]}',
   '{"shortages":1,"expedite":1,"deExpedite":0,"cancel":0}',NULL,
   'Rajesh Kumar','2026-08-22 08:45:00','2026-08-22 09:02:00');

-- ============================================================================
-- 6. production_planned_orders (delete: handled above with mrp_runs)
-- ============================================================================
INSERT INTO production_planned_orders
  (company_id, order_number, mrp_run_id, order_type, status, item_id, item_code, item_name,
   quantity, uom, planned_start_date, planned_end_date, due_date, lead_time_days,
   work_center_id, "estimatedCost", currency, priority, notes, firmed_by, firmed_at,
   released_order_id, created_by, created_at, updated_at)
VALUES
  (:company,'DEMO-PLO-0001',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-001'),'production','released',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',
   50,'PCS','2026-06-08','2026-06-18','2026-06-20',10,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),42500.00,'USD',3,'June motor batch 1','Rajesh Kumar','2026-05-25 10:00:00',
   'WO-DEMO-0021','Rajesh Kumar','2026-05-22 09:12:00','2026-06-08 08:00:00'),
  (:company,'DEMO-PLO-0002',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-001'),'production','released',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',
   25,'PCS','2026-06-10','2026-06-16','2026-06-18',8,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),11250.00,'USD',4,'Housings for July gearbox batch','Rajesh Kumar','2026-05-25 10:05:00',
   'WO-DEMO-0022','Rajesh Kumar','2026-05-22 09:12:00','2026-06-10 08:00:00'),
  (:company,'DEMO-PLO-0003',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-001'),'purchase','firmed',
   (SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm',
   1200,'KG','2026-06-05','2026-06-12','2026-06-14',7,
   NULL,3840.00,'USD',2,'Steel for June fabrication demand','Rajesh Kumar','2026-05-26 11:00:00',
   NULL,'Rajesh Kumar','2026-05-22 09:12:00','2026-05-26 11:00:00'),
  (:company,'DEMO-PLO-0004',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-002'),'production','released',
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',
   50,'PCS','2026-07-06','2026-07-17','2026-07-20',12,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),47500.00,'USD',3,'July pump batch 1','Rajesh Kumar','2026-06-24 09:30:00',
   'WO-DEMO-0025','Rajesh Kumar','2026-06-21 09:25:00','2026-07-06 08:00:00'),
  (:company,'DEMO-PLO-0005',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-002'),'purchase','released',
   (SELECT id::text FROM items WHERE "itemCode"='SP-BRG-001'),'SP-BRG-001','Ball Bearing 6205',
   400,'PCS','2026-07-02','2026-07-09','2026-07-10',7,
   NULL,1800.00,'USD',2,'Bearings for pump and motor assembly','Rajesh Kumar','2026-06-24 09:35:00',
   NULL,'Rajesh Kumar','2026-06-21 09:25:00','2026-07-02 08:30:00'),
  (:company,'DEMO-PLO-0006',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-002'),'transfer','planned',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'WIP-SFT-001','Drive Shaft Assembly (WIP)',
   30,'PCS','2026-07-13','2026-07-14','2026-07-15',1,
   NULL,5400.00,'USD',5,'Transfer WIP shafts from Plant 1 store to assembly buffer',NULL,NULL,
   NULL,'Rajesh Kumar','2026-06-21 09:25:00','2026-06-21 09:25:00'),
  (:company,'DEMO-PLO-0007',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-003'),'production','released',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',
   25,'PCS','2026-08-05','2026-08-20','2026-08-22',15,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),36250.00,'USD',2,'August gearbox batch 1','Rajesh Kumar','2026-07-25 10:00:00',
   'WO-DEMO-0028','Rajesh Kumar','2026-07-22 09:05:00','2026-08-05 08:00:00'),
  (:company,'DEMO-PLO-0008',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-003'),'purchase','firmed',
   (SELECT id::text FROM items WHERE "itemCode"='RM-ALM-001'),'RM-ALM-001','Aluminum Rod 20mm',
   600,'MTR','2026-08-03','2026-08-10','2026-08-12',7,
   NULL,2700.00,'USD',3,'Aluminum for gearbox shafts','Rajesh Kumar','2026-07-26 09:00:00',
   NULL,'Rajesh Kumar','2026-07-22 09:05:00','2026-07-26 09:00:00'),
  (:company,'DEMO-PLO-0009',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-004'),'production','firmed',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',
   25,'PCS','2026-09-14','2026-09-21','2026-09-23',8,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),11250.00,'USD',3,'Housings ahead of October gearbox plan','Rajesh Kumar','2026-08-28 14:00:00',
   NULL,'Rajesh Kumar','2026-08-22 09:02:00','2026-08-28 14:00:00'),
  (:company,'DEMO-PLO-0010',(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-004'),'production','planned',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',
   25,'PCS','2026-10-05','2026-10-20','2026-10-22',15,
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),36250.00,'USD',4,'October gearbox batch pending plan approval',NULL,NULL,
   NULL,'Rajesh Kumar','2026-08-22 09:02:00','2026-08-22 09:02:00');

-- ============================================================================
-- 7. production_material_requirements (delete: handled above with mrp_runs)
-- ============================================================================
INSERT INTO production_material_requirements
  (company_id, mrp_run_id, item_id, item_code, item_name, requirement_type, requirement_source,
   source_document_number, required_date, gross_requirement, scheduled_receipts, projected_available,
   net_requirement, planned_order_receipt, planned_order_release, uom, on_hand_quantity, safety_stock,
   lead_time_days, lot_size_type, lot_size_quantity, low_level_code, pegging, created_at, updated_at)
VALUES
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-001'),
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP','independent','sales_order',
   'SO-2026-0312','2026-06-20',180,45,30,130,150,150,'PCS',30,25,10,'fixed_quantity',50,0,
   '[{"demand":"SO-2026-0312","qty":120},{"demand":"FC-2026-06","qty":60}]','2026-05-22 09:12:00','2026-05-22 09:12:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-001'),
   (SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','dependent','work_order',
   'WO-DEMO-0021','2026-06-12',1500,300,180,1020,1200,1200,'KG',180,200,7,'fixed_quantity',600,1,
   '[{"demand":"WO-DEMO-0021","qty":900},{"demand":"WO-DEMO-0022","qty":600}]','2026-05-22 09:12:00','2026-05-22 09:12:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-001'),
   (SELECT id::text FROM items WHERE "itemCode"='RM-COP-001'),'RM-COP-001','Copper Wire 2.5mm','dependent','work_order',
   'WO-DEMO-0021','2026-06-10',800,200,150,450,450,450,'MTR',150,100,7,'lot_for_lot',NULL,1,
   '[{"demand":"WO-DEMO-0021","qty":800}]','2026-05-22 09:12:00','2026-05-22 09:12:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-002'),
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200','independent','sales_order',
   'SO-2026-0388','2026-07-20',140,38,22,80,100,100,'PCS',22,20,12,'fixed_quantity',50,0,
   '[{"demand":"SO-2026-0388","qty":95},{"demand":"FC-2026-07","qty":45}]','2026-06-21 09:25:00','2026-06-21 09:25:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-002'),
   (SELECT id::text FROM items WHERE "itemCode"='SP-BRG-001'),'SP-BRG-001','Ball Bearing 6205','dependent','work_order',
   'WO-DEMO-0025','2026-07-09',500,120,80,300,400,400,'PCS',80,60,7,'fixed_quantity',200,1,
   '[{"demand":"WO-DEMO-0025","qty":300},{"demand":"WO-DEMO-0026","qty":200}]','2026-06-21 09:25:00','2026-06-21 09:25:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-002'),
   (SELECT id::text FROM items WHERE "itemCode"='SP-SL-001'),'SP-SL-001','Mechanical Seal MS-40','dependent','work_order',
   'WO-DEMO-0025','2026-07-08',60,10,15,35,35,35,'PCS',15,10,10,'lot_for_lot',NULL,1,
   '[{"demand":"WO-DEMO-0025","qty":60}]','2026-06-21 09:25:00','2026-06-21 09:25:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-003'),
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50','independent','forecast',
   'FC-2026-08','2026-08-22',95,28,15,52,50,50,'PCS',15,15,15,'fixed_quantity',25,0,
   '[{"demand":"FC-2026-08","qty":95}]','2026-07-22 09:05:00','2026-07-22 09:05:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-003'),
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)','dependent','work_order',
   'WO-DEMO-0028','2026-08-15',50,10,8,32,50,50,'PCS',8,10,8,'fixed_quantity',25,1,
   '[{"demand":"WO-DEMO-0028","qty":50}]','2026-07-22 09:05:00','2026-07-22 09:05:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-003'),
   (SELECT id::text FROM items WHERE "itemCode"='RM-ALM-001'),'RM-ALM-001','Aluminum Rod 20mm','dependent','work_order',
   'WO-DEMO-0028','2026-08-10',750,150,120,480,600,600,'MTR',120,100,7,'fixed_quantity',300,2,
   '[{"demand":"WO-DEMO-0028","qty":450},{"demand":"WO-DEMO-0029","qty":300}]','2026-07-22 09:05:00','2026-07-22 09:05:00'),
  (:company,(SELECT id FROM production_mrp_runs WHERE run_number='DEMO-MRP-2026-004'),
   (SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'WIP-SFT-001','Drive Shaft Assembly (WIP)','dependent','safety_stock',
   NULL,'2026-09-21',40,12,10,18,25,25,'PCS',10,12,6,'lot_for_lot',NULL,1,
   '[{"demand":"SS-WIP-SFT","qty":40}]','2026-08-22 09:02:00','2026-08-22 09:02:00');

-- ============================================================================
-- 8. production_oee_records (delete: company_id)
-- ============================================================================
DELETE FROM production_oee_records WHERE company_id = :company;
INSERT INTO production_oee_records
  (company_id, record_date, shift_id, work_center_id, work_center_name, machine_id, machine_name,
   production_line_id, planned_production_time, operating_time, net_operating_time, fully_productive_time,
   availability, performance, quality, oee, total_count, good_count, reject_count,
   ideal_cycle_time, actual_cycle_time, "downtimeBreakdown", notes, recorded_by, created_at, updated_at)
VALUES
  (:company,'2026-08-24','SHIFT-A',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'Cutting Section','DEMO-LC-01','TruLaser 3030 Laser Cutter',
   'DEMO-LN-FAB',480.00,450.00,405.00,395.00,93.75,90.00,97.53,82.29,810,790,20,0.5000,0.5556,
   '[{"reason":"nozzle change","minutes":18},{"reason":"material load","minutes":12}]',NULL,'Suresh Patel','2026-08-24 22:15:00','2026-08-24 22:15:00'),
  (:company,'2026-08-24','SHIFT-A',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-BEND'),'Bending Section','DEMO-PB-01','AMADA HFE Press Brake',
   'DEMO-LN-FAB',480.00,430.00,376.25,370.23,89.58,87.50,98.40,77.14,752,740,12,0.5000,0.5714,
   '[{"reason":"tool setup","minutes":35},{"reason":"awaiting blanks","minutes":15}]',NULL,'Suresh Patel','2026-08-24 22:20:00','2026-08-24 22:20:00'),
  (:company,'2026-08-25','SHIFT-A',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'Welding Section','DEMO-WB-01','MIG Welding Bay 1',
   'DEMO-LN-FIN',480.00,410.00,340.00,328.00,85.42,82.93,96.47,68.34,680,656,24,0.5000,0.6029,
   '[{"reason":"wire feed jam","minutes":40},{"reason":"fixture change","minutes":30}]','Weld spatter rework on 24 pcs','Vikram Singh','2026-08-25 22:10:00','2026-08-25 22:10:00'),
  (:company,'2026-08-25','SHIFT-B',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PAINT'),'Painting Section','DEMO-PC-01','Powder Coat Booth 1',
   'DEMO-LN-FIN',480.00,440.00,390.00,370.50,91.67,88.64,95.00,77.19,780,741,39,0.5000,0.5641,
   '[{"reason":"colour change purge","minutes":25},{"reason":"oven ramp","minutes":15}]','Orange peel rejects on batch 2','Vikram Singh','2026-08-25 22:30:00','2026-08-25 22:30:00'),
  (:company,'2026-08-26','SHIFT-A',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'Assembly Section',NULL,NULL,
   'DEMO-LN-ASM',480.00,460.00,420.00,416.01,95.83,91.30,99.05,86.66,420,416,4,1.0000,1.0952,
   '[{"reason":"parts shortage","minutes":20}]',NULL,'Priya Sharma','2026-08-26 22:05:00','2026-08-26 22:05:00'),
  (:company,'2026-08-26','SHIFT-B',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'CNC Machining','DEMO-CNC-01','CNC Milling Machine VMC-850',
   'DEMO-LN-FAB',480.00,420.00,360.00,350.00,87.50,85.71,97.22,72.92,360,350,10,1.0000,1.1667,
   '[{"reason":"insert change","minutes":22},{"reason":"program proving","minutes":38}]',NULL,'Suresh Patel','2026-08-26 22:25:00','2026-08-26 22:25:00'),
  (:company,'2026-08-31','SHIFT-A',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'Cutting Section','DEMO-LC-01','TruLaser 3030 Laser Cutter',
   'DEMO-LN-FAB',480.00,460.00,425.00,417.01,95.83,92.39,98.12,86.87,850,834,16,0.5000,0.5412,
   NULL,NULL,'Suresh Patel','2026-08-31 22:15:00','2026-08-31 22:15:00'),
  (:company,'2026-08-31','SHIFT-B',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'Welding Section','DEMO-WB-01','MIG Welding Bay 1',
   'DEMO-LN-FIN',480.00,425.00,360.00,349.92,88.54,84.71,97.20,72.91,715,695,20,0.5000,0.5944,
   '[{"reason":"gas cylinder swap","minutes":15},{"reason":"fixture change","minutes":40}]',NULL,'Vikram Singh','2026-08-31 22:20:00','2026-08-31 22:20:00'),
  (:company,'2026-09-01','SHIFT-A',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PAINT'),'Painting Section','DEMO-PC-01','Powder Coat Booth 1',
   'DEMO-LN-FIN',480.00,450.00,405.00,390.02,93.75,90.00,96.30,81.25,810,780,30,0.5000,0.5556,
   '[{"reason":"colour change purge","minutes":30}]',NULL,'Vikram Singh','2026-09-01 22:10:00','2026-09-01 22:10:00'),
  (:company,'2026-09-02','SHIFT-A',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'Assembly Section',NULL,NULL,
   'DEMO-LN-ASM',480.00,455.00,405.00,402.00,94.79,89.01,99.26,83.76,405,402,3,1.0000,1.1235,
   '[{"reason":"torque tool calibration","minutes":25}]',NULL,'Priya Sharma','2026-09-02 22:05:00','2026-09-02 22:05:00'),
  (:company,'2026-09-03','SHIFT-B',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'CNC Machining','DEMO-CNC-01','CNC Milling Machine VMC-850',
   'DEMO-LN-FAB',480.00,435.00,380.00,370.00,90.62,87.36,97.37,77.08,380,370,10,1.0000,1.1447,
   '[{"reason":"chip conveyor fault","minutes":45}]','Maintenance request raised for chip conveyor','Suresh Patel','2026-09-03 22:25:00','2026-09-03 22:25:00'),
  (:company,'2026-09-04','SHIFT-A',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-QC'),'Quality Check',NULL,NULL,
   NULL,480.00,470.00,440.00,440.00,97.92,93.62,100.00,91.67,440,440,0,1.0000,1.0682,
   NULL,NULL,'Meera Nair','2026-09-04 22:00:00','2026-09-04 22:00:00');

-- ============================================================================
-- 9. production_ncrs (delete: ncr_number LIKE 'DEMO-NCR-%')
-- ============================================================================
DELETE FROM production_ncrs WHERE ncr_number LIKE 'DEMO-NCR-%';
INSERT INTO production_ncrs
  (ncr_number, title, product_code, product_name, work_order, lot_number, quantity_affected,
   detected_by, detected_date, detected_stage, severity, status, nonconformance_type,
   description, root_cause, corrective_action, preventive_action, assigned_to,
   target_close_date, actual_close_date, cost_impact, customer_impact, approved_by, verified_by,
   created_at, updated_at)
VALUES
  ('DEMO-NCR-0001','Weld porosity on motor base frames (DEF-WELD)','FG-MTR-001','Industrial Motor 5HP','WO-DEMO-0010','LOT-2606-014',8,
   'Meera Nair','2026-06-12','In-process inspection - Welding','major','closed','material',
   'Porosity found in 8 of 45 base frame welds during in-process inspection. Defect code DEF-WELD.',
   'Moisture contamination in flux-cored wire stored outside dry cabinet.',
   'Rewelded affected joints after grinding out porous sections; 100% re-inspection of lot.',
   'Wire storage moved to humidity-controlled cabinet; daily first-weld check added.',
   'Vikram Singh','2026-06-26','2026-06-24',1850.00,false,'Rajesh Kumar','Meera Nair',
   '2026-06-12 14:30:00','2026-06-24 16:00:00'),
  ('DEMO-NCR-0002','Housing bore oversize (DEF-DIM)','WIP-GBX-001','Gearbox Housing (Machined)','WO-DEMO-0008','LOT-2605-009',3,
   'Meera Nair','2026-05-28','Final inspection - CNC','major','closed','dimensional',
   'Bearing bore measured 0.04mm over tolerance on 3 housings. Defect code DEF-DIM.',
   'Worn boring insert not replaced at scheduled tool-life interval.',
   'Scrapped 2 housings, reworked 1 with sleeve; insert replaced.',
   'Tool-life counter enforced in CNC program with auto-stop.',
   'Suresh Patel','2026-06-11','2026-06-09',2400.00,false,'Rajesh Kumar','Meera Nair',
   '2026-05-28 11:15:00','2026-06-09 15:30:00'),
  ('DEMO-NCR-0003','Powder coat adhesion failure (DEF-PAINT)','FG-PMP-001','Centrifugal Pump CP-200','WO-DEMO-0012','LOT-2607-003',12,
   'Anita Desai','2026-07-15','Post powder-coat QC','minor','closed','visual',
   'Cross-hatch adhesion test failed on 12 pump casings from booth 1. Defect code DEF-PAINT.',
   'Degreasing bath concentration below spec after fluid top-up error.',
   'Stripped and re-coated all 12 casings.',
   'Twice-daily titration check of pretreatment bath logged in QC sheet.',
   'Vikram Singh','2026-07-29','2026-07-27',960.00,false,'Rajesh Kumar','Meera Nair',
   '2026-07-15 10:45:00','2026-07-27 14:00:00'),
  ('DEMO-NCR-0004','Missing seal kit in packed units (DEF-MISS)','FG-PMP-001','Centrifugal Pump CP-200','WO-DEMO-0016','LOT-2607-011',4,
   'Kiran Reddy','2026-07-30','Pre-dispatch audit','major','closed','functional',
   'Dispatch audit found 4 pumps packed without mechanical seal spares kit. Defect code DEF-MISS.',
   'Packing checklist skipped during overtime shift changeover.',
   'Kits added before dispatch; packing records corrected.',
   'Barcode scan of kit added as mandatory packing step.',
   'Priya Sharma','2026-08-13','2026-08-10',300.00,true,'Rajesh Kumar','Meera Nair',
   '2026-07-30 09:20:00','2026-08-10 12:00:00'),
  ('DEMO-NCR-0005','Shaft surface scratches (DEF-SURF)','WIP-SFT-001','Drive Shaft Assembly (WIP)','WO-DEMO-0019','LOT-2608-002',6,
   'Meera Nair','2026-08-06','In-process inspection - CNC','minor','corrective_action','visual',
   'Handling scratches on ground shaft journals, 6 pieces. Defect code DEF-SURF.',
   'Shafts stacked without separators in transfer trolley.',
   'Polished out scratches on 5 shafts; 1 scrapped.',
   'Foam-slotted transfer trolleys introduced for ground shafts.',
   'Suresh Patel','2026-09-20',NULL,720.00,false,NULL,NULL,
   '2026-08-06 13:40:00','2026-09-01 10:15:00'),
  ('DEMO-NCR-0006','Motor winding continuity failure (DEF-FUNC)','FG-MTR-001','Industrial Motor 5HP','WO-DEMO-0023','LOT-2608-007',2,
   'Anita Desai','2026-08-18','Final electrical test','critical','root_cause_analysis','functional',
   'Two motors failed winding continuity at final test bench. Defect code DEF-FUNC.',
   NULL,NULL,NULL,
   'Amit Verma','2026-09-25',NULL,3100.00,false,NULL,NULL,
   '2026-08-18 16:10:00','2026-09-05 09:30:00'),
  ('DEMO-NCR-0007','Wrong bearing grade fitted (DEF-WRONG)','FG-GBX-001','Precision Gearbox PG-50','WO-DEMO-0028','LOT-2608-012',5,
   'Meera Nair','2026-08-27','Assembly line audit','major','containment','material',
   'C3-clearance bearings fitted where CN grade specified on 5 gearboxes. Defect code DEF-WRONG.',
   NULL,NULL,NULL,
   'Priya Sharma','2026-09-30',NULL,1250.00,false,NULL,NULL,
   '2026-08-27 11:50:00','2026-09-08 14:20:00'),
  ('DEMO-NCR-0008','Surface rust on stored steel blanks (DEF-RUST)','RM-STL-001','Steel Sheet 2mm',NULL,'LOT-2609-001',150,
   'Suresh Patel','2026-09-04','Incoming material recheck','minor','open','material',
   'Surface rust found on 150kg of laser-cut blanks stored near shutter door. Defect code DEF-RUST.',
   NULL,NULL,NULL,
   'Suresh Patel','2026-10-02',NULL,480.00,false,NULL,NULL,
   '2026-09-04 08:55:00','2026-09-04 08:55:00');

-- ============================================================================
-- 10. production_root_cause_analyses (delete: company_id)
-- ============================================================================
DELETE FROM production_root_cause_analyses WHERE company_id = :company;
INSERT INTO production_root_cause_analyses
  (company_id, rca_number, title, "problemStatement", status, methodology, analysis_date,
   "fiveWhys", "contributingFactors", root_cause, "correctiveActions", "preventiveActions",
   "lessonsLearned", verification_status, verification_date, verified_by, "teamMembers",
   lead_investigator, created_by, created_at, updated_at)
VALUES
  (:company,'DEMO-RCA-0001','Weld porosity on motor base frames','8 of 45 motor base frame welds rejected for porosity in June lot LOT-2606-014.','closed','five_whys','2026-06-16',
   '[{"why":"Why porosity?","answer":"Gas shielding contaminated"},{"why":"Why contaminated?","answer":"Moisture in flux-cored wire"},{"why":"Why moisture?","answer":"Wire stored outside dry cabinet"},{"why":"Why outside?","answer":"Cabinet full"},{"why":"Why full?","answer":"No min-max control on wire stock"}]',
   '["humid monsoon storage conditions","no first-weld verification"]',
   'Flux-cored wire absorbed moisture because storage discipline broke down when the dry cabinet overflowed.',
   '[{"action":"Reweld and reinspect lot","owner":"Vikram Singh","status":"done"}]',
   '[{"action":"Humidity-controlled cabinet sized for full wire stock","owner":"Vikram Singh","status":"done"},{"action":"Daily first-weld check","owner":"Meera Nair","status":"done"}]',
   '["Consumable storage capacity must track consumption plans"]','verified','2026-07-10','Meera Nair',
   '["Vikram Singh","Meera Nair","Suresh Patel"]','Vikram Singh','Meera Nair','2026-06-16 09:00:00','2026-07-10 15:00:00'),
  (:company,'DEMO-RCA-0002','Chip conveyor fault stops VMC-850','45 minutes downtime on CNC VMC-850 on 03-Sep-2026 due to chip conveyor jam.','completed','fishbone','2026-09-05',
   NULL,'["chip volume increase from aluminium jobs","worn conveyor scraper","missed weekly clean"]',
   'Conveyor scraper wear combined with high aluminium chip volume caused recurring jams; weekly cleaning was skipped twice in August.',
   '[{"action":"Replace scraper and clean sump","owner":"Amit Verma","status":"done"}]',
   '[{"action":"Add scraper wear check to monthly PM","owner":"Amit Verma","status":"in_progress"}]',
   NULL,'pending',NULL,NULL,
   '["Amit Verma","Suresh Patel"]','Amit Verma','Suresh Patel','2026-09-05 10:30:00','2026-09-08 11:00:00'),
  (:company,'DEMO-RCA-0003','Motor winding continuity failures','Two motors from LOT-2608-007 failed continuity at final electrical test on 18-Aug-2026.','in_progress','fmea','2026-08-21',
   NULL,'["new winding wire supplier batch","hand-insertion at slot 7","test probe wear"]',
   NULL,
   '[{"action":"Quarantine remaining lot and 100% test","owner":"Anita Desai","status":"done"}]',
   NULL,NULL,NULL,NULL,NULL,
   '["Amit Verma","Anita Desai","Meera Nair"]','Amit Verma','Anita Desai','2026-08-21 09:15:00','2026-09-06 14:45:00'),
  (:company,'DEMO-RCA-0004','Powder coat adhesion failures in booth 1','12 pump casings failed cross-hatch adhesion after coating in booth 1 on 15-Jul-2026.','closed','five_whys','2026-07-18',
   '[{"why":"Why adhesion failure?","answer":"Poor surface pretreatment"},{"why":"Why poor pretreatment?","answer":"Degreaser concentration low"},{"why":"Why low?","answer":"Bath topped up with water only"},{"why":"Why water only?","answer":"Operator not trained on titration"},{"why":"Why not trained?","answer":"New operator missed chemical handling module"}]',
   '["training gap","no bath concentration log"]',
   'Pretreatment bath ran diluted because a new operator topped up with water without titration.',
   '[{"action":"Strip and recoat 12 casings","owner":"Vikram Singh","status":"done"}]',
   '[{"action":"Twice-daily titration log","owner":"Anita Desai","status":"done"},{"action":"Chemical handling training for finishing operators","owner":"HR","status":"done"}]',
   '["Bath chemistry checks belong on the shift checklist, not memory"]','verified','2026-08-12','Meera Nair',
   '["Vikram Singh","Anita Desai"]','Vikram Singh','Anita Desai','2026-07-18 10:00:00','2026-08-12 16:30:00');

-- ============================================================================
-- 11. production_routing_templates (delete: code LIKE 'DEMO-RT-%')
-- ============================================================================
DELETE FROM production_routing_templates WHERE code LIKE 'DEMO-RT-%';
INSERT INTO production_routing_templates
  (code, name, product_code, product_name, version, department, total_operations,
   total_setup_time, total_cycle_time, total_cost, status, effective_from, effective_to,
   operations, created_at, updated_at)
VALUES
  ('DEMO-RT-001','Motor 5HP Standard Routing','FG-MTR-001','Industrial Motor 5HP','v2.1','Production',5,
   95.00,185.00,412.50,'active','2026-01-15',NULL,
   '[{"seq":10,"operation":"Laser cut frame blanks","workCenter":"WC-CUT","setupMin":20,"cycleMin":18},{"seq":20,"operation":"Bend frame sections","workCenter":"WC-BEND","setupMin":25,"cycleMin":22},{"seq":30,"operation":"Weld base frame","workCenter":"WC-WELD","setupMin":15,"cycleMin":45},{"seq":40,"operation":"Assemble stator rotor and wiring","workCenter":"WC-ASSY","setupMin":20,"cycleMin":75},{"seq":50,"operation":"Final electrical test","workCenter":"WC-QC","setupMin":15,"cycleMin":25}]',
   '2026-01-15 09:00:00','2026-06-10 14:20:00'),
  ('DEMO-RT-002','Pump CP-200 Standard Routing','FG-PMP-001','Centrifugal Pump CP-200','v1.4','Production',5,
   105.00,210.00,478.00,'active','2026-02-01',NULL,
   '[{"seq":10,"operation":"Machine casing and impeller","workCenter":"WC-CNC","setupMin":40,"cycleMin":65},{"seq":20,"operation":"Weld volute joints","workCenter":"WC-WELD","setupMin":15,"cycleMin":30},{"seq":30,"operation":"Powder coat casing","workCenter":"WC-PAINT","setupMin":20,"cycleMin":35},{"seq":40,"operation":"Assemble pump and seal","workCenter":"WC-ASSY","setupMin":15,"cycleMin":55},{"seq":50,"operation":"Hydro and leak test","workCenter":"WC-QC","setupMin":15,"cycleMin":25}]',
   '2026-02-01 09:30:00','2026-07-22 10:10:00'),
  ('DEMO-RT-003','Gearbox PG-50 Precision Routing','FG-GBX-001','Precision Gearbox PG-50','v3.0','Production',5,
   130.00,265.00,685.00,'active','2026-03-01',NULL,
   '[{"seq":10,"operation":"Machine housing","workCenter":"WC-CNC","setupMin":45,"cycleMin":80},{"seq":20,"operation":"Machine shafts and gears","workCenter":"WC-CNC","setupMin":40,"cycleMin":70},{"seq":30,"operation":"Deburr and clean","workCenter":"WC-CUT","setupMin":10,"cycleMin":20},{"seq":40,"operation":"Assemble gear train","workCenter":"WC-ASSY","setupMin":20,"cycleMin":65},{"seq":50,"operation":"Backlash and noise test","workCenter":"WC-QC","setupMin":15,"cycleMin":30}]',
   '2026-03-01 08:45:00','2026-08-15 11:00:00'),
  ('DEMO-RT-004','Gearbox Housing Machining','WIP-GBX-001','Gearbox Housing (Machined)','v1.2','Production',3,
   60.00,115.00,215.00,'active','2026-01-10',NULL,
   '[{"seq":10,"operation":"Rough mill casting","workCenter":"WC-CNC","setupMin":30,"cycleMin":45},{"seq":20,"operation":"Finish bore bearing seats","workCenter":"WC-CNC","setupMin":20,"cycleMin":50},{"seq":30,"operation":"Dimensional inspection","workCenter":"WC-QC","setupMin":10,"cycleMin":20}]',
   '2026-01-10 10:00:00','2026-05-30 09:20:00'),
  ('DEMO-RT-005','Drive Shaft Assembly Routing','WIP-SFT-001','Drive Shaft Assembly (WIP)','v1.0','Production',4,
   70.00,130.00,238.00,'draft','2026-09-01',NULL,
   '[{"seq":10,"operation":"Turn shaft from rod","workCenter":"WC-CNC","setupMin":25,"cycleMin":40},{"seq":20,"operation":"Cut keyway","workCenter":"WC-CNC","setupMin":20,"cycleMin":25},{"seq":30,"operation":"Press-fit coupling","workCenter":"WC-ASSY","setupMin":15,"cycleMin":40},{"seq":40,"operation":"Runout inspection","workCenter":"WC-QC","setupMin":10,"cycleMin":25}]',
   '2026-09-01 11:30:00','2026-09-01 11:30:00');

-- ============================================================================
-- 12. production_gantt_tasks (delete: group_id LIKE 'DEMO-GRP-%')
-- ============================================================================
DELETE FROM production_gantt_tasks WHERE group_id LIKE 'DEMO-GRP-%';
INSERT INTO production_gantt_tasks
  (name, start_date, end_date, progress, status, priority, assignee, group_id, group_name,
   dependencies, created_at, updated_at)
VALUES
  ('Laser cut motor frame blanks - Sep batch','2026-09-01','2026-09-03',100,'completed','high','Suresh Patel','DEMO-GRP-FAB','Fabrication Line 1',NULL,'2026-08-28 09:00:00','2026-09-03 17:30:00'),
  ('Bend and form frame sections - Sep batch','2026-09-03','2026-09-05',100,'completed','high','Suresh Patel','DEMO-GRP-FAB','Fabrication Line 1','["Laser cut motor frame blanks - Sep batch"]','2026-08-28 09:05:00','2026-09-05 16:45:00'),
  ('Weld motor base frames - Sep batch','2026-09-05','2026-09-09',85,'in-progress','high','Vikram Singh','DEMO-GRP-FIN','Finishing Line 1','["Bend and form frame sections - Sep batch"]','2026-08-28 09:10:00','2026-09-09 15:20:00'),
  ('Powder coat motor frames - Sep batch','2026-09-09','2026-09-12',20,'in-progress','medium','Vikram Singh','DEMO-GRP-FIN','Finishing Line 1','["Weld motor base frames - Sep batch"]','2026-08-28 09:15:00','2026-09-10 08:30:00'),
  ('Assemble motors batch 1 - Sep plan','2026-09-12','2026-09-18',0,'not-started','high','Priya Sharma','DEMO-GRP-ASM','Assembly Line 1','["Powder coat motor frames - Sep batch"]','2026-08-28 09:20:00','2026-08-28 09:20:00'),
  ('Final test and pack motors - Sep plan','2026-09-18','2026-09-22',0,'not-started','medium','Meera Nair','DEMO-GRP-ASM','Assembly Line 1','["Assemble motors batch 1 - Sep plan"]','2026-08-28 09:25:00','2026-08-28 09:25:00'),
  ('Machine gearbox housings - Oct prep','2026-09-14','2026-09-21',0,'not-started','medium','Suresh Patel','DEMO-GRP-FAB','Fabrication Line 1',NULL,'2026-09-05 10:00:00','2026-09-05 10:00:00'),
  ('CNC preventive maintenance window','2026-09-13','2026-09-13',0,'not-started','critical','Amit Verma','DEMO-GRP-FAB','Fabrication Line 1',NULL,'2026-09-06 14:00:00','2026-09-06 14:00:00');

-- ============================================================================
-- 13. production_job_sequences (delete: company_id; schedule_id left NULL —
--     production_schedules is empty)
-- ============================================================================
DELETE FROM production_job_sequences WHERE company_id = :company;
INSERT INTO production_job_sequences
  (company_id, schedule_id, work_center_id, work_center_name, sequencing_rule, sequence_date,
   jobs, total_jobs, total_processing_time, total_setup_time, makespan, average_flow_time,
   average_lateness, jobs_on_time, jobs_late, status, is_locked, created_by, created_at, updated_at)
VALUES
  (:company,NULL,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'CNC Machining','edd','2026-09-08',
   '[{"seq":1,"workOrder":"WO-DEMO-0028","item":"FG-GBX-001","processingMin":320,"dueDate":"2026-09-10"},{"seq":2,"workOrder":"WO-DEMO-0029","item":"WIP-GBX-001","processingMin":250,"dueDate":"2026-09-12"},{"seq":3,"workOrder":"WO-DEMO-0030","item":"WIP-SFT-001","processingMin":180,"dueDate":"2026-09-15"}]',
   3,750.00,105.00,855.00,486.67,-0.70,3,0,'processing',true,'Rajesh Kumar','2026-09-07 16:00:00','2026-09-08 07:30:00'),
  (:company,NULL,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'Welding Section','spt','2026-09-08',
   '[{"seq":1,"workOrder":"WO-DEMO-0026","item":"FG-PMP-001","processingMin":150,"dueDate":"2026-09-11"},{"seq":2,"workOrder":"WO-DEMO-0027","item":"FG-MTR-001","processingMin":210,"dueDate":"2026-09-12"}]',
   2,360.00,30.00,390.00,255.00,-1.50,2,0,'in_queue',false,'Rajesh Kumar','2026-09-07 16:10:00','2026-09-08 07:35:00'),
  (:company,NULL,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'Assembly Section','priority','2026-09-09',
   '[{"seq":1,"workOrder":"WO-DEMO-0025","item":"FG-PMP-001","processingMin":275,"dueDate":"2026-09-12","priority":1},{"seq":2,"workOrder":"WO-DEMO-0021","item":"FG-MTR-001","processingMin":375,"dueDate":"2026-09-16","priority":2},{"seq":3,"workOrder":"WO-DEMO-0024","item":"FG-GBX-001","processingMin":325,"dueDate":"2026-09-18","priority":3}]',
   3,975.00,55.00,1030.00,610.00,-2.30,3,0,'pending',false,'Priya Sharma','2026-09-08 15:30:00','2026-09-08 15:30:00'),
  (:company,NULL,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'Cutting Section','fifo','2026-09-09',
   '[{"seq":1,"workOrder":"WO-DEMO-0027","item":"FG-MTR-001","processingMin":120,"dueDate":"2026-09-10"},{"seq":2,"workOrder":"WO-DEMO-0030","item":"WIP-SFT-001","processingMin":90,"dueDate":"2026-09-14"},{"seq":3,"workOrder":"WO-DEMO-0029","item":"WIP-GBX-001","processingMin":75,"dueDate":"2026-09-13"},{"seq":4,"workOrder":"WO-DEMO-0026","item":"FG-PMP-001","processingMin":110,"dueDate":"2026-09-11"}]',
   4,395.00,60.00,455.00,231.25,0.50,3,1,'pending',false,'Suresh Patel','2026-09-08 16:00:00','2026-09-08 16:00:00');

-- ============================================================================
-- 14. production_ergonomic_alerts (delete: company_id)
-- ============================================================================
DELETE FROM production_ergonomic_alerts WHERE company_id = :company;
INSERT INTO production_ergonomic_alerts
  (company_id, alert_number, title, description, category, severity, status, triggered_at,
   employee_id, employee_name, workstation_id, workstation_name, work_center_id,
   "triggerConditions", "riskFactors", "recommendedActions", acknowledged_by, acknowledged_at,
   resolution_action, resolved_by, resolved_at, follow_up_required, follow_up_date, notes,
   created_at, updated_at)
VALUES
  (:company,'DEMO-ERG-0001','Repetitive strain risk at winding station','Operator exceeded 4 hours of continuous coil winding without rotation.','repetition','high','resolved','2026-08-12 13:40:00',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0005'),'Suresh Patel','DEMO-WS-ASM-02','Motor Winding Station',
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),
   '{"continuousMinutes":245,"threshold":180}','["repetitive wrist motion","static shoulder posture"]',
   '["rotate operators every 2 hours","5-minute stretch break per hour"]',
   'Priya Sharma','2026-08-12 14:00:00','Job rotation roster updated for winding stations.','Priya Sharma','2026-08-13 10:00:00',false,NULL,NULL,
   '2026-08-12 13:40:00','2026-08-13 10:00:00'),
  (:company,'DEMO-ERG-0002','Heavy lift without hoist at press brake','Two-person manual lift of 48kg sheet pack detected instead of using scissor lift.','force','critical','resolved','2026-08-19 10:25:00',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007'),'Amit Verma','DEMO-WS-FAB-01','Press Brake Station 1',
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-BEND'),
   '{"loadKg":48,"limitKg":25}','["manual lifting above limit","awkward grip on sheet pack"]',
   '["mandatory scissor lift for packs over 25kg","toolbox talk on lifting"]',
   'Vikram Singh','2026-08-19 10:40:00','Scissor lift repositioned beside brake; lifting SOP re-briefed.','Vikram Singh','2026-08-20 09:00:00',true,'2026-09-20','Follow-up audit scheduled.',
   '2026-08-19 10:25:00','2026-08-20 09:00:00'),
  (:company,'DEMO-ERG-0003','Welding fume exposure trending high','Booth extraction airflow below target for third consecutive shift.','environment','medium','acknowledged','2026-09-02 15:10:00',
   NULL,NULL,'DEMO-WS-FIN-01','Welding Bay 1',
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),
   '{"airflowM3h":820,"targetM3h":1000}','["fume exposure","filter saturation"]',
   '["replace extraction filters","verify airflow after replacement"]',
   'Vikram Singh','2026-09-02 15:30:00',NULL,NULL,NULL,true,'2026-09-16',NULL,
   '2026-09-02 15:10:00','2026-09-02 15:30:00'),
  (:company,'DEMO-ERG-0004','Awkward posture at packing bench','Sustained forward bend over low packing bench flagged by observation round.','posture','medium','active','2026-09-07 11:20:00',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),'Kiran Reddy','DEMO-WS-PCK-01','Packing Bench 1',
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PACK'),
   '{"bendAngleDeg":45,"durationMin":35}','["forward trunk flexion","bench height below elbow"]',
   '["raise bench to 950mm","anti-fatigue mat"]',
   NULL,NULL,NULL,NULL,NULL,false,NULL,'Bench raiser kit on order.',
   '2026-09-07 11:20:00','2026-09-07 11:20:00'),
  (:company,'DEMO-ERG-0005','Fatigue indicator on night shift CNC','Operator on third consecutive night shift with overtime showing extended cycle times.','fatigue','high','active','2026-09-09 03:15:00',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'Vikram Singh','DEMO-WS-FAB-02','CNC Operating Console',
   (SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),
   '{"consecutiveNights":3,"overtimeHours":6}','["sleep deficit","monotonous monitoring task"]',
   '["limit consecutive nights to 2 with overtime","supervisor check-in each hour"]',
   NULL,NULL,NULL,NULL,NULL,true,'2026-09-12',NULL,
   '2026-09-09 03:15:00','2026-09-09 03:15:00');

-- ============================================================================
-- 15. production_floor_activities (delete: activity_id LIKE 'DEMO-FA-%')
-- ============================================================================
DELETE FROM production_floor_activities WHERE activity_id LIKE 'DEMO-FA-%';
INSERT INTO production_floor_activities
  (activity_id, work_center, operator_name, employee_id, work_order_id, product_name, product_code,
   operation, start_time, duration_minutes, output_qty, target_qty, efficiency_percent, status, shift,
   created_at, updated_at)
VALUES
  ('DEMO-FA-0001','Cutting Section','Suresh Patel',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0005'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0027'),'Industrial Motor 5HP','FG-MTR-001',
   'Laser cutting frame blanks','2026-09-09 06:15',180,118,120,98.33,'completed','Shift A','2026-09-09 06:15:00','2026-09-09 09:20:00'),
  ('DEMO-FA-0002','Bending Section','Amit Verma',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0027'),'Industrial Motor 5HP','FG-MTR-001',
   'Press brake forming','2026-09-09 09:45',150,95,100,95.00,'completed','Shift A','2026-09-09 09:45:00','2026-09-09 12:20:00'),
  ('DEMO-FA-0003','Welding Section','Vikram Singh',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0027'),'Industrial Motor 5HP','FG-MTR-001',
   'Base frame welding','2026-09-09 13:00',240,42,48,87.50,'completed','Shift A','2026-09-09 13:00:00','2026-09-09 17:10:00'),
  ('DEMO-FA-0004','CNC Machining','Suresh Patel',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0005'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'Precision Gearbox PG-50','FG-GBX-001',
   'Housing finish boring','2026-09-09 14:30',210,11,12,91.67,'completed','Shift B','2026-09-09 14:30:00','2026-09-09 18:05:00'),
  ('DEMO-FA-0005','Assembly Section','Priya Sharma',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0025'),'Centrifugal Pump CP-200','FG-PMP-001',
   'Pump assembly and seal fit','2026-09-09 06:30',270,16,18,88.89,'completed','Shift A','2026-09-09 06:30:00','2026-09-09 11:05:00'),
  ('DEMO-FA-0006','Quality Check','Meera Nair',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0006'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0025'),'Centrifugal Pump CP-200','FG-PMP-001',
   'Hydro and leak test','2026-09-09 11:30',120,16,16,100.00,'completed','Shift A','2026-09-09 11:30:00','2026-09-09 13:35:00'),
  ('DEMO-FA-0007','Painting Section','Kiran Reddy',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0026'),'Centrifugal Pump CP-200','FG-PMP-001',
   'Powder coating casings','2026-09-10 06:20',195,52,60,86.67,'in-progress','Shift A','2026-09-10 06:20:00','2026-09-10 09:35:00'),
  ('DEMO-FA-0008','Assembly Section','Anita Desai',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0003'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0021'),'Industrial Motor 5HP','FG-MTR-001',
   'Stator and rotor assembly','2026-09-10 06:45',160,14,20,70.00,'in-progress','Shift A','2026-09-10 06:45:00','2026-09-10 09:30:00'),
  ('DEMO-FA-0009','CNC Machining','Rajesh Kumar',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0029'),'Gearbox Housing (Machined)','WIP-GBX-001',
   'Rough milling castings','2026-09-10 07:00',145,8,12,66.67,'in-progress','Shift A','2026-09-10 07:00:00','2026-09-10 09:25:00'),
  ('DEMO-FA-0010','Packing Section','Kiran Reddy',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),
   (SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0022'),'Gearbox Housing (Machined)','WIP-GBX-001',
   'Pack and label housings','2026-09-08 15:00',90,25,25,100.00,'completed','Shift B','2026-09-08 15:00:00','2026-09-08 16:35:00');

-- ============================================================================
-- 16. production_machine_timelines (delete: machine_code LIKE 'DEMO-%')
-- ============================================================================
DELETE FROM production_machine_timelines WHERE machine_code LIKE 'DEMO-%';
INSERT INTO production_machine_timelines
  (machine_code, machine_name, machine_type, status, current_shift, utilization, events, created_at, updated_at)
VALUES
  ('DEMO-LC-01','TruLaser 3030 Laser Cutter','Laser Cutting','running','Shift A',87,
   '[{"time":"06:15","event":"job_start","detail":"WO-DEMO-0027 frame blanks"},{"time":"09:20","event":"job_complete","detail":"118 pcs"},{"time":"09:35","event":"setup","detail":"nozzle change"},{"time":"10:05","event":"job_start","detail":"WO-DEMO-0029 housing blanks"}]',
   '2026-09-09 06:15:00','2026-09-10 10:05:00'),
  ('DEMO-PB-01','AMADA HFE Press Brake','Press Brake','running','Shift A',78,
   '[{"time":"06:30","event":"setup","detail":"tooling for motor frames"},{"time":"07:10","event":"job_start","detail":"WO-DEMO-0027 forming"},{"time":"12:20","event":"job_complete","detail":"95 pcs"}]',
   '2026-09-09 06:30:00','2026-09-10 09:40:00'),
  ('DEMO-WB-01','MIG Welding Bay 1','Welding','idle','Shift A',72,
   '[{"time":"13:00","event":"job_start","detail":"WO-DEMO-0027 base frames"},{"time":"15:40","event":"stoppage","detail":"gas cylinder swap 15 min"},{"time":"17:10","event":"job_complete","detail":"42 frames"}]',
   '2026-09-09 13:00:00','2026-09-10 08:00:00'),
  ('DEMO-CNC-01','CNC Milling Machine VMC-850','CNC Machining','running','Shift A',84,
   '[{"time":"07:00","event":"job_start","detail":"WO-DEMO-0029 rough milling"},{"time":"08:45","event":"alarm","detail":"chip conveyor warning - cleared"},{"time":"09:25","event":"in_cycle","detail":"8 of 12 castings done"}]',
   '2026-09-10 07:00:00','2026-09-10 09:25:00'),
  ('DEMO-PC-01','Powder Coat Booth 1','Powder Coating','running','Shift A',69,
   '[{"time":"06:20","event":"job_start","detail":"WO-DEMO-0026 pump casings"},{"time":"08:10","event":"setup","detail":"colour change purge RAL5015"},{"time":"09:35","event":"in_cycle","detail":"52 of 60 casings coated"}]',
   '2026-09-10 06:20:00','2026-09-10 09:35:00'),
  ('DEMO-AL-01','Assembly Line 1 Conveyor','Assembly','maintenance','Shift A',0,
   '[{"time":"06:00","event":"maintenance_start","detail":"drive belt replacement"},{"time":"09:00","event":"maintenance_eta","detail":"expected back 11:00"}]',
   '2026-09-10 06:00:00','2026-09-10 09:00:00');

-- ============================================================================
-- 17. production_maintenance_requests (delete: request_number LIKE 'DEMO-MR-%')
-- ============================================================================
DELETE FROM production_maintenance_requests WHERE request_number LIKE 'DEMO-MR-%';
INSERT INTO production_maintenance_requests
  (request_number, equipment_code, equipment_name, location, request_type, priority, status,
   requested_by, request_date, description, assigned_to, estimated_cost, actual_cost,
   completion_date, downtime, created_at, updated_at)
VALUES
  ('DEMO-MR-0001','DEMO-CNC-01','CNC Milling Machine VMC-850','Plant 1 - Bay A','breakdown','high','completed',
   'Suresh Patel','2026-09-03','Chip conveyor jamming repeatedly during aluminium jobs.','Amit Verma',450.00,380.00,
   '2026-09-05',1.50,'2026-09-03 22:30:00','2026-09-05 16:00:00'),
  ('DEMO-MR-0002','DEMO-WB-01','MIG Welding Bay 1','Plant 1 - Bay C','corrective','medium','completed',
   'Vikram Singh','2026-08-20','Wire feeder motor running rough, intermittent feed slippage.','Amit Verma',280.00,265.00,
   '2026-08-22',0.75,'2026-08-20 14:15:00','2026-08-22 11:30:00'),
  ('DEMO-MR-0003','DEMO-PC-01','Powder Coat Booth 1','Plant 1 - Bay C','corrective','high','in-progress',
   'Vikram Singh','2026-09-02','Extraction airflow below target; filters suspected saturated.','Amit Verma',600.00,NULL,
   NULL,0.00,'2026-09-02 15:45:00','2026-09-08 09:00:00'),
  ('DEMO-MR-0004','DEMO-AL-01','Assembly Line 1 Conveyor','Plant 1 - Bay B','breakdown','critical','in-progress',
   'Priya Sharma','2026-09-10','Conveyor drive belt frayed; replaced under emergency stop.','Amit Verma',850.00,NULL,
   NULL,5.00,'2026-09-10 06:05:00','2026-09-10 09:00:00'),
  ('DEMO-MR-0005','DEMO-LC-01','TruLaser 3030 Laser Cutter','Plant 1 - Bay A','calibration','medium','pending',
   'Suresh Patel','2026-09-08','Annual beam alignment and cutting-head calibration due.',NULL,1200.00,NULL,
   NULL,0.00,'2026-09-08 10:20:00','2026-09-08 10:20:00'),
  ('DEMO-MR-0006','DEMO-PB-01','AMADA HFE Press Brake','Plant 1 - Bay A','breakdown','high','completed',
   'Amit Verma','2026-07-14','Hydraulic hose leak at ram cylinder; oil on floor contained.','Amit Verma',520.00,495.00,
   '2026-07-15',3.25,'2026-07-14 11:40:00','2026-07-15 15:20:00'),
  ('DEMO-MR-0007','DEMO-WS-QC-01','Final Test Bench','Plant 1 - Bay B','calibration','medium','completed',
   'Meera Nair','2026-08-25','Continuity tester reading drift; recalibrate against reference.','Amit Verma',300.00,300.00,
   '2026-08-27',0.00,'2026-08-25 09:10:00','2026-08-27 14:45:00'),
  ('DEMO-MR-0008','DEMO-PC-01','Powder Coat Booth 1','Plant 1 - Bay C','preventive','low','pending',
   'Vikram Singh','2026-09-09','Oven burner service and thermocouple check before October peak.',NULL,400.00,NULL,
   NULL,0.00,'2026-09-09 16:30:00','2026-09-09 16:30:00');

-- ============================================================================
-- 18. production_mes_integrations (delete: company_id)
-- ============================================================================
DELETE FROM production_mes_integrations WHERE company_id = :company;
INSERT INTO production_mes_integrations
  (company_id, integration_code, integration_name, description, integration_type, status,
   system_name, system_vendor, system_version, protocol, "connectionConfig", "syncConfig",
   "supportedOperations", last_sync_at, last_sync_status, records_synced, error_count,
   "healthMetrics", is_active, configured_by, last_modified_by, created_at, updated_at)
VALUES
  (:company,'DEMO-MES-001','Laser Cutter OPC-UA Feed','Live machine states and part counts from TruLaser 3030.','plc','active',
   'TRUMPF TruConnect','TRUMPF','4.2','opc_ua','{"endpoint":"opc.tcp://10.20.1.11:4840","secure":true}',
   '{"intervalSeconds":30,"mode":"push"}','["machine_status","part_count","alarm_feed"]',
   '2026-09-10 09:30:00','success',48210,3,'{"uptimePct":99.4,"avgLatencyMs":110}',true,'Rajesh Kumar','Amit Verma',
   '2025-11-10 10:00:00','2026-09-10 09:30:00'),
  (:company,'DEMO-MES-002','CNC MTConnect Bridge','Cycle and tool data from VMC-850 via MQTT broker.','scada','active',
   'FANUC MT-LINKi','FANUC','3.8','mqtt','{"broker":"mqtt://10.20.1.20:1883","topic":"plant1/cnc/#"}',
   '{"intervalSeconds":15,"mode":"push"}','["cycle_time","tool_life","spindle_load"]',
   '2026-09-10 09:28:00','success',102455,12,'{"uptimePct":98.7,"avgLatencyMs":85}',true,'Rajesh Kumar','Amit Verma',
   '2025-11-12 11:30:00','2026-09-10 09:28:00'),
  (:company,'DEMO-MES-003','Powder Line SCADA Link','Booth environment and oven temperature trend ingestion.','scada','error',
   'Siemens WinCC','Siemens','7.5','profinet','{"gateway":"10.20.1.35","rack":0,"slot":2}',
   '{"intervalSeconds":60,"mode":"pull"}','["oven_temp","airflow","humidity"]',
   '2026-09-09 18:45:00','failed',20780,41,'{"uptimePct":94.2,"avgLatencyMs":240,"lastError":"gateway timeout"}',true,'Rajesh Kumar','Amit Verma',
   '2026-01-08 09:15:00','2026-09-09 18:45:00'),
  (:company,'DEMO-MES-004','ERP Work Order Sync','Bidirectional work order and confirmation sync with ERP.','erp','active',
   'B3 MACBIS ERP','KreupAI','2026.3','rest_api','{"baseUrl":"https://erp.internal/api","auth":"oauth2"}',
   '{"intervalSeconds":300,"mode":"bidirectional"}','["work_order_pull","confirmation_push","material_issue"]',
   '2026-09-10 09:00:00','success',15620,5,'{"uptimePct":99.8,"avgLatencyMs":320}',true,'Rajesh Kumar','Rajesh Kumar',
   '2025-10-20 14:00:00','2026-09-10 09:00:00'),
  (:company,'DEMO-MES-005','QMS Inspection Results Feed','Push final test results into quality management system.','qms','pending',
   'B3 QMS Module','KreupAI','1.4','rest_api','{"baseUrl":"https://qms.internal/api","auth":"api_key"}',
   '{"intervalSeconds":600,"mode":"push"}','["inspection_results","ncr_create"]',
   NULL,NULL,0,0,NULL,true,'Rajesh Kumar',NULL,
   '2026-08-28 15:00:00','2026-08-28 15:00:00');

-- ============================================================================
-- 19. production_operation_tasks (delete: wo_number LIKE 'WO-DEMO-%')
-- ============================================================================
DELETE FROM production_operation_tasks WHERE wo_number LIKE 'WO-DEMO-%';
INSERT INTO production_operation_tasks
  (wo_number, product_name, operation_type, operator, machine, status, start_time, end_time,
   target_quantity, completed_quantity, notes, created_at, updated_at)
VALUES
  ('WO-DEMO-0027','Industrial Motor 5HP','Laser Cutting','Suresh Patel','TruLaser 3030','Completed','2026-09-09 06:15','2026-09-09 09:20',120,118,'2 blanks scrapped for edge dross','2026-09-08 17:00:00','2026-09-09 09:20:00'),
  ('WO-DEMO-0027','Industrial Motor 5HP','Bending','Amit Verma','AMADA HFE Press Brake','Completed','2026-09-09 09:45','2026-09-09 12:20',100,95,NULL,'2026-09-08 17:00:00','2026-09-09 12:20:00'),
  ('WO-DEMO-0027','Industrial Motor 5HP','Welding','Vikram Singh','MIG Welding Bay 1','Completed','2026-09-09 13:00','2026-09-09 17:10',48,42,'6 frames carried to next shift','2026-09-08 17:00:00','2026-09-09 17:10:00'),
  ('WO-DEMO-0028','Precision Gearbox PG-50','CNC Machining','Suresh Patel','CNC VMC-850','Completed','2026-09-09 14:30','2026-09-09 18:05',12,11,NULL,'2026-09-08 17:05:00','2026-09-09 18:05:00'),
  ('WO-DEMO-0025','Centrifugal Pump CP-200','Assembly','Priya Sharma','Assembly Line 1','Completed','2026-09-09 06:30','2026-09-09 11:05',18,16,NULL,'2026-09-08 17:10:00','2026-09-09 11:05:00'),
  ('WO-DEMO-0025','Centrifugal Pump CP-200','Testing','Meera Nair','Final Test Bench','Completed','2026-09-09 11:30','2026-09-09 13:35',16,16,'All passed hydro test','2026-09-08 17:10:00','2026-09-09 13:35:00'),
  ('WO-DEMO-0026','Centrifugal Pump CP-200','Powder Coating','Kiran Reddy','Powder Coat Booth 1','In Progress','2026-09-10 06:20',NULL,60,52,NULL,'2026-09-09 17:00:00','2026-09-10 09:35:00'),
  ('WO-DEMO-0021','Industrial Motor 5HP','Assembly','Anita Desai','Assembly Line 1','On Hold','2026-09-10 06:45',NULL,20,14,'Held: conveyor belt maintenance','2026-09-09 17:05:00','2026-09-10 09:30:00'),
  ('WO-DEMO-0029','Gearbox Housing (Machined)','CNC Machining','Rajesh Kumar','CNC VMC-850','In Progress','2026-09-10 07:00',NULL,12,8,NULL,'2026-09-09 17:10:00','2026-09-10 09:25:00'),
  ('WO-DEMO-0030','Drive Shaft Assembly (WIP)','CNC Machining','Suresh Patel','CNC VMC-850','Queued',NULL,NULL,30,0,'Queued behind WO-DEMO-0029','2026-09-09 17:15:00','2026-09-09 17:15:00');

-- ============================================================================
-- 20. production_operator_workstations (delete: company_id)
-- ============================================================================
DELETE FROM production_operator_workstations WHERE company_id = :company;
INSERT INTO production_operator_workstations
  (company_id, workstation_code, workstation_name, description, workstation_type, status,
   production_line_id, work_center_id, location, current_operator_id, current_operator_name,
   current_work_order_id, "equipmentAssigned", "toolsRequired", "performanceMetrics",
   "safetyChecklist", last_activity_at, is_active, created_by, created_at, updated_at)
VALUES
  (:company,'DEMO-WS-FAB-01','Press Brake Station 1','Forming station on fabrication line','machining','active',
   (SELECT id::text FROM production_lines WHERE code='DEMO-LN-FAB'),(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-BEND'),
   '{"building":"Plant 1","bay":"A","position":"A-03"}',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007'),'Amit Verma','WO-DEMO-0027',
   '["AMADA HFE Press Brake","scissor lift"]','["V-die set 25mm","angle gauge"]',
   '{"todayOutput":95,"efficiencyPct":95.0}','["guard check","foot pedal test","lift inspection"]',
   '2026-09-09 12:20:00',true,'Rajesh Kumar','2025-10-05 09:00:00','2026-09-09 12:20:00'),
  (:company,'DEMO-WS-FAB-02','CNC Operating Console','VMC-850 operator console','machining','active',
   (SELECT id::text FROM production_lines WHERE code='DEMO-LN-FAB'),(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),
   '{"building":"Plant 1","bay":"A","position":"A-07"}',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),'Rajesh Kumar','WO-DEMO-0029',
   '["CNC VMC-850","tool presetter"]','["insert kit CNMG","boring bar set"]',
   '{"todayOutput":8,"efficiencyPct":66.7}','["door interlock","coolant level","chip bin"]',
   '2026-09-10 09:25:00',true,'Rajesh Kumar','2025-10-05 09:10:00','2026-09-10 09:25:00'),
  (:company,'DEMO-WS-ASM-01','Pump Assembly Station','Main pump build bench with torque tooling','assembly','active',
   (SELECT id::text FROM production_lines WHERE code='DEMO-LN-ASM'),(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),
   '{"building":"Plant 1","bay":"B","position":"B-01"}',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002'),'Priya Sharma','WO-DEMO-0025',
   '["torque station","press-fit jig"]','["torque wrench 40Nm","seal driver kit"]',
   '{"todayOutput":16,"efficiencyPct":88.9}','["torque tool calibration tag","ESD strap"]',
   '2026-09-09 11:05:00',true,'Rajesh Kumar','2025-10-05 09:20:00','2026-09-09 11:05:00'),
  (:company,'DEMO-WS-ASM-02','Motor Winding Station','Coil winding and insertion bench','assembly','idle',
   (SELECT id::text FROM production_lines WHERE code='DEMO-LN-ASM'),(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),
   '{"building":"Plant 1","bay":"B","position":"B-04"}',
   NULL,NULL,NULL,
   '["winding machine WM-2","slot insulation cutter"]','["winding former set","crimp tool"]',
   '{"todayOutput":0,"efficiencyPct":0}','["rotation roster posted","guard check"]',
   '2026-09-09 18:00:00',true,'Rajesh Kumar','2025-10-05 09:30:00','2026-09-09 18:00:00'),
  (:company,'DEMO-WS-QC-01','Final Test Bench','Electrical and hydro test workstation','testing','active',
   (SELECT id::text FROM production_lines WHERE code='DEMO-LN-ASM'),(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-QC'),
   '{"building":"Plant 1","bay":"B","position":"B-08"}',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0006'),'Meera Nair','WO-DEMO-0025',
   '["continuity tester","hydro test rig"]','["reference resistor set","pressure gauge 16bar"]',
   '{"todayOutput":16,"efficiencyPct":100.0}','["tester calibration valid","relief valve check"]',
   '2026-09-09 13:35:00',true,'Rajesh Kumar','2025-10-05 09:40:00','2026-09-09 13:35:00'),
  (:company,'DEMO-WS-FIN-01','Welding Bay 1','MIG welding bay with extraction','assembly','maintenance',
   (SELECT id::text FROM production_lines WHERE code='DEMO-LN-FIN'),(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),
   '{"building":"Plant 1","bay":"C","position":"C-02"}',
   NULL,NULL,NULL,
   '["MIG welder 350A","fume extractor"]','["welding fixture MF-3","spatter guard"]',
   '{"todayOutput":0,"efficiencyPct":0}','["extraction airflow check","gas line inspection"]',
   '2026-09-09 17:10:00',true,'Rajesh Kumar','2025-10-05 09:50:00','2026-09-10 08:00:00');

-- ============================================================================
-- 21. production_preventive_maintenance (delete: equipment_code LIKE 'DEMO-%')
-- ============================================================================
DELETE FROM production_preventive_maintenance WHERE equipment_code LIKE 'DEMO-%';
INSERT INTO production_preventive_maintenance
  (equipment_code, equipment_name, task_type, frequency, last_completed, next_due,
   estimated_duration, assigned_to, status, priority, checklist_items, completed_items,
   created_at, updated_at)
VALUES
  ('DEMO-LC-01','TruLaser 3030 Laser Cutter','inspection','monthly','2026-08-15','2026-09-15',3.00,'Amit Verma','scheduled','high',12,0,'2025-10-10 09:00:00','2026-08-15 16:00:00'),
  ('DEMO-LC-01','TruLaser 3030 Laser Cutter','calibration','annual','2025-10-05','2026-10-05',8.00,'Amit Verma','scheduled','high',18,0,'2025-10-10 09:05:00','2026-09-08 10:25:00'),
  ('DEMO-PB-01','AMADA HFE Press Brake','lubrication','monthly','2026-08-20','2026-09-20',2.00,'Amit Verma','scheduled','medium',8,0,'2025-10-10 09:10:00','2026-08-20 15:30:00'),
  ('DEMO-CNC-01','CNC Milling Machine VMC-850','inspection','weekly','2026-09-06','2026-09-13',1.50,'Amit Verma','scheduled','high',10,0,'2025-10-10 09:15:00','2026-09-06 14:00:00'),
  ('DEMO-CNC-01','CNC Milling Machine VMC-850','replacement','quarterly','2026-06-28','2026-09-28',4.00,'Amit Verma','scheduled','medium',6,0,'2025-10-10 09:20:00','2026-06-28 16:45:00'),
  ('DEMO-WB-01','MIG Welding Bay 1','inspection','monthly','2026-08-10','2026-09-10',2.50,'Amit Verma','in-progress','high',9,5,'2025-10-10 09:25:00','2026-09-10 08:30:00'),
  ('DEMO-PC-01','Powder Coat Booth 1','cleaning','weekly','2026-08-30','2026-09-06',3.00,'Kiran Reddy','overdue','high',7,0,'2025-10-10 09:30:00','2026-09-07 08:00:00'),
  ('DEMO-AL-01','Assembly Line 1 Conveyor','replacement','quarterly','2026-05-18','2026-08-18',5.00,'Amit Verma','completed','critical',5,5,'2025-10-10 09:35:00','2026-09-10 09:00:00');

-- ============================================================================
-- 22. production_productivity_metrics (delete: company_id)
-- ============================================================================
DELETE FROM production_productivity_metrics WHERE company_id = :company;
INSERT INTO production_productivity_metrics
  (company_id, metric_date, period_type, metric_type, work_center_id, production_line_id,
   shift_id, planned_output, actual_output, output_variance, output_variance_percentage,
   output_uom, planned_hours, actual_hours, productive_hours, non_productive_hours,
   efficiency_percentage, utilization_percentage, output_per_hour, output_per_labor_hour,
   "laborMetrics", "qualityMetrics", currency, benchmark_productivity, recorded_by,
   created_at, updated_at)
VALUES
  (:company,'2026-09-01','daily','machine',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'DEMO-LN-FAB','SHIFT-A',
   820,795,-25,-3.05,'PCS',16.00,15.50,14.20,1.30,91.61,88.75,51.29,NULL,
   NULL,'{"rejectRate":1.9}','USD',90.00,'Suresh Patel','2026-09-01 22:30:00','2026-09-01 22:30:00'),
  (:company,'2026-09-01','daily','labor',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'DEMO-LN-ASM','SHIFT-A',
   40,38,-2,-5.00,'PCS',96.00,92.00,84.50,7.50,91.85,87.98,0.41,0.4130,
   '{"operators":12,"overtimeHours":4}','{"rejectRate":0.8}','USD',88.00,'Priya Sharma','2026-09-01 22:35:00','2026-09-01 22:35:00'),
  (:company,'2026-09-02','daily','machine',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'DEMO-LN-FAB','SHIFT-B',
   36,33,-3,-8.33,'PCS',16.00,14.50,13.10,1.40,90.34,81.88,2.28,NULL,
   NULL,'{"rejectRate":2.6}','USD',85.00,'Suresh Patel','2026-09-02 22:30:00','2026-09-02 22:30:00'),
  (:company,'2026-09-03','daily','machine',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),'DEMO-LN-FIN','SHIFT-A',
   70,64,-6,-8.57,'PCS',16.00,15.00,12.80,2.20,85.33,80.00,4.27,NULL,
   NULL,'{"rejectRate":3.1}','USD',84.00,'Vikram Singh','2026-09-03 22:30:00','2026-09-03 22:30:00'),
  (:company,'2026-09-04','daily','labor',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-QC'),NULL,'SHIFT-A',
   44,44,0,0.00,'PCS',24.00,23.50,22.00,1.50,93.62,97.92,1.87,1.8723,
   '{"operators":3,"overtimeHours":0}','{"rejectRate":0.0}','USD',92.00,'Meera Nair','2026-09-04 22:00:00','2026-09-04 22:00:00'),
  (:company,'2026-08-31','weekly','overall',NULL,'DEMO-LN-FAB',NULL,
   4200,3960,-240,-5.71,'PCS',192.00,184.00,164.50,19.50,89.40,84.17,21.52,NULL,
   '{"operators":8,"overtimeHours":12}','{"rejectRate":2.2}','USD',87.00,'Rajesh Kumar','2026-09-01 09:00:00','2026-09-01 09:00:00'),
  (:company,'2026-08-31','weekly','overall',NULL,'DEMO-LN-ASM',NULL,
   230,221,-9,-3.91,'PCS',576.00,558.00,512.00,46.00,91.76,88.19,0.40,0.3961,
   '{"operators":12,"overtimeHours":18}','{"rejectRate":1.0}','USD',88.00,'Rajesh Kumar','2026-09-01 09:05:00','2026-09-01 09:05:00'),
  (:company,'2026-08-31','weekly','overall',NULL,'DEMO-LN-FIN',NULL,
   1500,1372,-128,-8.53,'PCS',192.00,180.00,155.00,25.00,86.11,80.73,7.62,NULL,
   '{"operators":9,"overtimeHours":10}','{"rejectRate":3.4}','USD',84.00,'Rajesh Kumar','2026-09-01 09:10:00','2026-09-01 09:10:00'),
  (:company,'2026-08-01','monthly','overall',NULL,'DEMO-LN-ASM',NULL,
   960,912,-48,-5.00,'PCS',2304.00,2250.00,2040.00,210.00,90.67,88.54,0.41,0.4053,
   '{"operators":12,"overtimeHours":64}','{"rejectRate":1.2}','USD',88.00,'Rajesh Kumar','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'2026-08-01','monthly','material',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'DEMO-LN-FAB',NULL,
   18500,17820,-680,-3.68,'KG',352.00,340.00,310.00,30.00,91.18,88.07,52.41,NULL,
   NULL,'{"scrapPct":3.7,"nestingYieldPct":91.5}','USD',90.00,'Rajesh Kumar','2026-09-02 10:15:00','2026-09-02 10:15:00');

-- ============================================================================
-- 23. production_quality_forecasts (delete: company_id)
-- ============================================================================
DELETE FROM production_quality_forecasts WHERE company_id = :company;
INSERT INTO production_quality_forecasts
  (company_id, forecast_number, title, description, forecast_type, status,
   forecast_period_start, forecast_period_end, product_id, product_category,
   production_line_id, work_center_id, "forecastData", "inputFactors", "historicalBaseline",
   model_name, model_version, confidence_score, accuracy_rating, "riskAssessment",
   recommendations, created_by, validated_by, validated_at, created_at, updated_at)
VALUES
  (:company,'DEMO-QF-0001','Weld defect rate forecast Sep-Oct 2026','Projected DEF-WELD rate on finishing line from seasonal humidity model.','defect_rate','active',
   '2026-09-01','2026-10-31',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'Finished Good',
   'DEMO-LN-FIN',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-WELD'),
   '{"weeks":[{"week":"2026-W37","predictedDefectPct":2.8},{"week":"2026-W38","predictedDefectPct":2.5},{"week":"2026-W39","predictedDefectPct":2.2}]}',
   '{"humidityPct":78,"newOperators":1,"wireLotChanges":2}','{"trailing12wAvgPct":3.1}',
   'quality-lstm','1.3',82.50,'medium','{"level":"medium","drivers":["monsoon humidity","operator change"]}',
   '["keep dry-cabinet discipline","first-weld verification each shift"]','Meera Nair','Rajesh Kumar','2026-08-30 11:00:00',
   '2026-08-28 10:00:00','2026-08-30 11:00:00'),
  (:company,'DEMO-QF-0002','CNC machining yield forecast Q4 2026','First-pass yield projection for gearbox housing machining.','yield','validated',
   '2026-10-01','2026-12-31',(SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'Semi-Finished Good',
   'DEMO-LN-FAB',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),
   '{"months":[{"month":"2026-10","predictedYieldPct":96.8},{"month":"2026-11","predictedYieldPct":97.2},{"month":"2026-12","predictedYieldPct":97.4}]}',
   '{"toolLifeEnforcement":true,"newInsertGrade":"CNMG-KC5010"}','{"trailing6mYieldPct":95.9}',
   'yield-gbm','2.0',88.00,'high','{"level":"low","drivers":["tool-life auto-stop now active"]}',
   '["retain auto-stop","monthly capability study on bore diameter"]','Meera Nair','Rajesh Kumar','2026-09-05 14:30:00',
   '2026-09-03 09:30:00','2026-09-05 14:30:00'),
  (:company,'DEMO-QF-0003','Powder coat scrap forecast Sep 2026','Scrap projection for coating line while extraction issue persists.','scrap','active',
   '2026-09-01','2026-09-30',(SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'Finished Good',
   'DEMO-LN-FIN',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-PAINT'),
   '{"weeks":[{"week":"2026-W37","predictedScrapPct":4.2},{"week":"2026-W38","predictedScrapPct":3.6}]}',
   '{"airflowBelowTarget":true,"filterReplacementPlanned":"2026-09-12"}','{"trailing8wScrapPct":3.4}',
   'quality-lstm','1.3',74.00,'medium','{"level":"high","drivers":["extraction airflow low"]}',
   '["expedite filter replacement","hold gloss-critical jobs until airflow restored"]','Meera Nair',NULL,NULL,
   '2026-09-06 10:45:00','2026-09-06 10:45:00'),
  (:company,'DEMO-QF-0004','Motor rework forecast Q3 2026','Rework hours projection for motor line, validated against actuals.','rework','expired',
   '2026-07-01','2026-09-30',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'Finished Good',
   'DEMO-LN-ASM',(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),
   '{"months":[{"month":"2026-07","predictedReworkHrs":42},{"month":"2026-08","predictedReworkHrs":38},{"month":"2026-09","predictedReworkHrs":35}]}',
   '{"windingSupplierChange":true}','{"trailing6mAvgReworkHrs":45}',
   'rework-arima','1.1',79.00,'medium','{"level":"medium","drivers":["new winding wire supplier"]}',
   '["100% continuity test until supplier PPAP closed"]','Meera Nair','Rajesh Kumar','2026-07-05 10:00:00',
   '2026-06-28 09:00:00','2026-09-01 08:00:00'),
  (:company,'DEMO-QF-0005','Compliance readiness forecast ISO audit','Predicted audit-finding likelihood by area ahead of ISO 9001 surveillance.','compliance','draft',
   '2026-10-01','2026-11-30',NULL,NULL,
   NULL,NULL,
   '{"areas":[{"area":"calibration","riskPct":12},{"area":"training records","riskPct":22},{"area":"NCR closure","riskPct":18}]}',
   '{"openNcrs":3,"overduePm":1,"trainingGapCount":2}','{"lastAuditFindings":4}',
   'compliance-score','0.9',65.00,'low','{"level":"medium","drivers":["overdue PM","open NCR aging"]}',
   '["close DEMO-NCR-0006 and 0007 before audit","clear overdue booth cleaning PM"]','Meera Nair',NULL,NULL,
   '2026-09-08 16:20:00','2026-09-08 16:20:00');

-- ============================================================================
-- 24. production_quality_plans (delete: plan_number LIKE 'DEMO-QP-%')
-- ============================================================================
DELETE FROM production_quality_plans WHERE plan_number LIKE 'DEMO-QP-%';
INSERT INTO production_quality_plans
  (plan_number, plan_name, product_code, product_name, category, version, status,
   created_by, created_date, last_updated, approved_by, approval_date,
   inspection_points, acceptance_criteria, testing_frequency, sampling_size, quality_standard,
   created_at, updated_at)
VALUES
  ('DEMO-QP-001','Motor 5HP Quality Plan','FG-MTR-001','Industrial Motor 5HP','Finished Good','v2.0','active',
   'Meera Nair','2026-01-20','2026-06-15','Rajesh Kumar','2026-01-25',
   '[{"point":"Frame weld visual","stage":"Welding","method":"visual + gauge"},{"point":"Winding resistance","stage":"Assembly","method":"milliohm meter"},{"point":"Final electrical test","stage":"Test","method":"continuity + hipot"}]',
   '[{"characteristic":"Winding resistance","spec":"2.1 ± 0.1 ohm"},{"characteristic":"Insulation resistance","spec":">100 Mohm at 500V"},{"characteristic":"Vibration","spec":"<2.8 mm/s RMS"}]',
   'Every unit',100,'IS 12615 / IEC 60034','2026-01-20 10:00:00','2026-06-15 14:30:00'),
  ('DEMO-QP-002','Pump CP-200 Quality Plan','FG-PMP-001','Centrifugal Pump CP-200','Finished Good','v1.3','active',
   'Meera Nair','2026-02-10','2026-07-28','Rajesh Kumar','2026-02-14',
   '[{"point":"Casing coating adhesion","stage":"Coating","method":"cross-hatch"},{"point":"Impeller balance","stage":"Assembly","method":"dynamic balancer"},{"point":"Hydro test","stage":"Test","method":"1.5x rated pressure"}]',
   '[{"characteristic":"Hydro pressure","spec":"no leak at 24 bar for 10 min"},{"characteristic":"Flow at duty point","spec":"200 m3/h ± 5%"},{"characteristic":"Coating DFT","spec":"60-90 micron"}]',
   'Every unit',100,'ISO 5199','2026-02-10 09:30:00','2026-07-28 11:15:00'),
  ('DEMO-QP-003','Gearbox PG-50 Quality Plan','FG-GBX-001','Precision Gearbox PG-50','Finished Good','v2.2','active',
   'Meera Nair','2026-03-05','2026-08-20','Rajesh Kumar','2026-03-10',
   '[{"point":"Housing bore dimension","stage":"CNC","method":"CMM"},{"point":"Gear backlash","stage":"Assembly","method":"dial indicator"},{"point":"Noise test","stage":"Test","method":"sound meter at 1m"}]',
   '[{"characteristic":"Bore diameter","spec":"62.000 +0.019/-0 mm"},{"characteristic":"Backlash","spec":"0.08-0.15 mm"},{"characteristic":"Noise","spec":"<72 dBA at rated speed"}]',
   'Every unit',100,'AGMA 2015','2026-03-05 10:45:00','2026-08-20 16:00:00'),
  ('DEMO-QP-004','Gearbox Housing Machining Plan','WIP-GBX-001','Gearbox Housing (Machined)','Semi-Finished Good','v1.1','active',
   'Meera Nair','2026-01-12','2026-06-10','Rajesh Kumar','2026-01-16',
   '[{"point":"First article dimensional","stage":"CNC setup","method":"CMM full layout"},{"point":"In-process bore check","stage":"CNC","method":"bore gauge each 5th part"}]',
   '[{"characteristic":"Bearing seat bore","spec":"62.000 +0.019/-0 mm"},{"characteristic":"Face flatness","spec":"0.02 mm"},{"characteristic":"Surface finish","spec":"Ra 1.6 max"}]',
   'First article + every 5th',20,'ISO 2768-mK','2026-01-12 11:00:00','2026-06-10 09:45:00'),
  ('DEMO-QP-005','Incoming Steel Sheet Plan','RM-STL-001','Steel Sheet 2mm','Raw Material','v1.0','draft',
   'Meera Nair','2026-09-05','2026-09-05',NULL,NULL,
   '[{"point":"Mill certificate review","stage":"Receiving","method":"document check"},{"point":"Thickness sampling","stage":"Receiving","method":"micrometer 5 points"},{"point":"Surface condition","stage":"Receiving","method":"visual per DEF-RUST criteria"}]',
   '[{"characteristic":"Thickness","spec":"2.0 ± 0.05 mm"},{"characteristic":"Surface","spec":"no rust, scale or pitting"},{"characteristic":"Grade","spec":"CR4 per IS 513"}]',
   'Per lot',8,'IS 513','2026-09-05 14:00:00','2026-09-05 14:00:00');

-- ============================================================================
-- 25. production_resource_allocations (delete: company_id; schedule_id left NULL —
--     production_schedules is empty)
-- ============================================================================
DELETE FROM production_resource_allocations WHERE company_id = :company;
INSERT INTO production_resource_allocations
  (company_id, schedule_id, work_order_id, operation_id, resource_type, resource_id, resource_name,
   status, start_time, end_time, allocated_hours, actual_hours, quantity, uom, cost_per_hour,
   total_cost, currency, priority, is_overtime, notes, allocated_by, created_at, updated_at)
VALUES
  (:company,NULL,'WO-DEMO-0027','OP-CUT-10','machine','DEMO-LC-01','TruLaser 3030 Laser Cutter',
   'released','2026-09-09 06:15:00','2026-09-09 09:30:00',3.25,3.08,1,'EA',95.00,308.75,'USD',2,false,
   'Frame blank cutting','Rajesh Kumar','2026-09-08 16:30:00','2026-09-09 09:30:00'),
  (:company,NULL,'WO-DEMO-0027','OP-WELD-30','labor',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'Vikram Singh',
   'released','2026-09-09 13:00:00','2026-09-09 17:15:00',4.25,4.17,1,'EA',28.00,119.00,'USD',2,false,
   'Base frame welding','Rajesh Kumar','2026-09-08 16:35:00','2026-09-09 17:15:00'),
  (:company,NULL,'WO-DEMO-0028','OP-CNC-10','machine','DEMO-CNC-01','CNC Milling Machine VMC-850',
   'released','2026-09-09 14:30:00','2026-09-09 18:15:00',3.75,3.58,1,'EA',110.00,412.50,'USD',1,false,
   'Housing finish boring','Rajesh Kumar','2026-09-08 16:40:00','2026-09-09 18:15:00'),
  (:company,NULL,'WO-DEMO-0025','OP-ASSY-40','labor',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002'),'Priya Sharma',
   'released','2026-09-09 06:30:00','2026-09-09 11:15:00',4.75,4.50,1,'EA',26.00,123.50,'USD',2,false,
   'Pump assembly bench lead','Rajesh Kumar','2026-09-08 16:45:00','2026-09-09 11:15:00'),
  (:company,NULL,'WO-DEMO-0025','OP-TEST-50','tool','DEMO-HYDRO-RIG','Hydro Test Rig 16bar',
   'released','2026-09-09 11:30:00','2026-09-09 13:45:00',2.25,2.08,1,'EA',35.00,78.75,'USD',3,false,
   'Hydro and leak test','Rajesh Kumar','2026-09-08 16:50:00','2026-09-09 13:45:00'),
  (:company,NULL,'WO-DEMO-0026','OP-PAINT-30','machine','DEMO-PC-01','Powder Coat Booth 1',
   'in_use','2026-09-10 06:20:00','2026-09-10 12:00:00',5.67,NULL,1,'EA',88.00,498.96,'USD',2,false,
   'Pump casing coating','Rajesh Kumar','2026-09-09 16:00:00','2026-09-10 06:20:00'),
  (:company,NULL,'WO-DEMO-0029','OP-CNC-10','machine','DEMO-CNC-01','CNC Milling Machine VMC-850',
   'in_use','2026-09-10 07:00:00','2026-09-10 14:30:00',7.50,NULL,1,'EA',110.00,825.00,'USD',3,false,
   'Housing rough milling','Rajesh Kumar','2026-09-09 16:05:00','2026-09-10 07:00:00'),
  (:company,NULL,'WO-DEMO-0030','OP-CNC-10','machine','DEMO-CNC-01','CNC Milling Machine VMC-850',
   'allocated','2026-09-11 06:00:00','2026-09-11 12:00:00',6.00,NULL,1,'EA',110.00,660.00,'USD',4,true,
   'Shaft turning - Saturday overtime slot','Rajesh Kumar','2026-09-09 16:10:00','2026-09-09 16:10:00');
