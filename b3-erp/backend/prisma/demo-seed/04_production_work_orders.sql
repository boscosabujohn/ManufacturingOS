-- Demo seed — Production work orders (headers + material items) for B3 MACBIS.
-- Style follows 01_crm.sql: idempotent DELETE-then-INSERT, demo rows keyed by
-- workOrderNumber prefix 'WO-DEMO-'.
--
-- Schema notes (verified against live DDL 2026-09-10):
--   * work_orders / work_order_items have NO companyId column — the :company
--     variable is kept only for stylistic parity with the other seed files.
--   * work_orders.status is the native enum work_orders_status_enum
--     (Draft|Submitted|Released|In Progress|On Hold|Completed|Closed|Cancelled),
--     NOT a FK to the work_order_statuses master.
--   * itemId / workCenterId are varchar snapshots; we still resolve them from
--     the real `items` (18 rows) and `work_centers` (8 rows) masters so joins
--     stay coherent. work_order_items.workOrderId IS a real uuid FK (CASCADE).
--
-- Status mix (30 WOs): Completed 14, In Progress 6, Released 4, Submitted 2,
-- On Hold 2, Cancelled 2 — spread 2025-10-01 .. 2026-09-10.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ── Idempotency: children first (via parent join), then headers ──────────────
DELETE FROM work_order_items
 WHERE "workOrderId" IN (SELECT id FROM work_orders WHERE "workOrderNumber" LIKE 'WO-DEMO-%');
DELETE FROM work_orders
 WHERE "workOrderNumber" LIKE 'WO-DEMO-%';

-- ── Work order headers ───────────────────────────────────────────────────────
INSERT INTO work_orders
  ("workOrderNumber","workOrderName",description,"workOrderType",status,priority,
   "itemId","itemCode","itemName",uom,
   "plannedQuantity","producedQuantity","acceptedQuantity","rejectedQuantity","scrapQuantity","pendingQuantity",
   "plannedStartDate","plannedEndDate","actualStartDate","actualEndDate","requiredByDate",
   "workCenterId","workCenterCode","workCenterName",
   "customerName","jobNumber",
   "estimatedMaterialCost","estimatedLaborCost","estimatedOverheadCost","estimatedTotalCost",
   "actualMaterialCost","actualLaborCost","actualOverheadCost","actualTotalCost",
   "progressPercentage","materialsIssued","materialsConsumed","productionCompleted","qualityInspected","stockReceived",
   "submittedBy","submittedAt","releasedBy","releasedAt","startedBy","startedAt","completedBy","completedAt",
   "cancelledBy","cancelledAt","cancellationReason",
   "createdBy","createdAt","updatedAt")
SELECT
  v.wonum, v.woname, v.descr,
  v.wotype::work_orders_workordertype_enum,
  v.status::work_orders_status_enum,
  v.priority::work_orders_priority_enum,
  i.id::text, i."itemCode", i."itemName", i."baseUOM",
  v.pqty, v.prodqty, v.prodqty - v.rejqty, v.rejqty, v.scrapqty,
  CASE WHEN v.status IN ('Completed','Closed','Cancelled') THEN 0 ELSE v.pqty - v.prodqty END,
  v.pstart::date, v.pend::date, v.astart::date, v.aend::date, (v.pend::date + 7),
  w.id::text, w."workCenterCode", w."workCenterName",
  v.customer, v.job,
  round(v.pqty::numeric * i."standardCost" * 0.62, 2),
  round(v.pqty::numeric * i."standardCost" * 0.18, 2),
  round(v.pqty::numeric * i."standardCost" * 0.08, 2),
  round(v.pqty::numeric * i."standardCost" * 0.88, 2),
  CASE WHEN v.status IN ('Completed','Closed') THEN round(v.pqty::numeric * i."standardCost" * 0.62 * 1.03, 2)
       WHEN v.status IN ('In Progress','On Hold') THEN round(v.prodqty::numeric * i."standardCost" * 0.62, 2)
       ELSE 0 END,
  CASE WHEN v.status IN ('Completed','Closed') THEN round(v.pqty::numeric * i."standardCost" * 0.18 * 1.06, 2)
       WHEN v.status IN ('In Progress','On Hold') THEN round(v.prodqty::numeric * i."standardCost" * 0.18, 2)
       ELSE 0 END,
  CASE WHEN v.status IN ('Completed','Closed') THEN round(v.pqty::numeric * i."standardCost" * 0.08, 2)
       WHEN v.status IN ('In Progress','On Hold') THEN round(v.prodqty::numeric * i."standardCost" * 0.08, 2)
       ELSE 0 END,
  CASE WHEN v.status IN ('Completed','Closed') THEN round(v.pqty::numeric * i."standardCost" * (0.62*1.03 + 0.18*1.06 + 0.08), 2)
       WHEN v.status IN ('In Progress','On Hold') THEN round(v.prodqty::numeric * i."standardCost" * 0.88, 2)
       ELSE 0 END,
  round(v.prodqty::numeric * 100.0 / v.pqty, 2),
  v.status IN ('In Progress','On Hold','Completed','Closed'),
  v.status IN ('Completed','Closed'),
  v.status IN ('Completed','Closed'),
  v.status IN ('Completed','Closed'),
  v.status IN ('Completed','Closed'),
  'Anita Menon',
  (LEAST(v.pstart::date - 6, DATE '2026-09-08'))::timestamp + interval '10 hours',
  CASE WHEN v.status IN ('Released','In Progress','On Hold','Completed','Closed')
       THEN 'Vikram Singh' END,
  CASE WHEN v.status IN ('Released','In Progress','On Hold','Completed','Closed')
       THEN (LEAST(v.pstart::date - 3, DATE '2026-09-09'))::timestamp + interval '14 hours' END,
  CASE WHEN v.astart IS NOT NULL THEN 'Suresh Babu' END,
  CASE WHEN v.astart IS NOT NULL THEN v.astart::date::timestamp + interval '8 hours' END,
  CASE WHEN v.status IN ('Completed','Closed') THEN 'Suresh Babu' END,
  CASE WHEN v.status IN ('Completed','Closed') THEN v.aend::date::timestamp + interval '16 hours' END,
  CASE WHEN v.status = 'Cancelled' THEN 'Vikram Singh' END,
  CASE WHEN v.status = 'Cancelled' THEN (v.pstart::date + 2)::timestamp + interval '11 hours' END,
  CASE v.wonum
    WHEN 'WO-DEMO-0029' THEN 'Customer cancelled purchase order after project scope reduction'
    WHEN 'WO-DEMO-0030' THEN 'Raised in error — duplicate of WO-DEMO-0025'
  END,
  'demo-seeder',
  (LEAST(v.pstart::date - 7, DATE '2026-09-08'))::timestamp + interval '9 hours',
  CASE WHEN v.status = 'Cancelled'
       THEN (v.pstart::date + 2)::timestamp + interval '11 hours'
       ELSE (LEAST(COALESCE(v.aend, v.astart, v.pstart)::date, DATE '2026-09-09'))::timestamp + interval '17 hours'
  END
FROM (VALUES
  -- (wonum, woname, descr, wotype, status, priority, icode, wccode,
  --  pqty, prodqty, rejqty, scrapqty, pstart, pend, astart, aend, customer, job)
  -- ── Completed (14) — actuals near plan, a few late for on-time-% realism ──
  ('WO-DEMO-0001','Combi Oven Convection Fan Motors — Harbour Grill','Batch of 5HP convection fan motors for combi oven line retrofit','Production','Completed','Normal','FG-MTR-001','WC-ASSY',40,40,1,1,'2025-10-06','2025-10-17','2025-10-06','2025-10-16','Harbour Grill Restaurants','JOB-DEMO-1001'),
  ('WO-DEMO-0002','Dishwashing Line Wash Pumps — Blue Fig Hotels','CP-200 wash/rinse pumps for flight-type dishwashing installation','Production','Completed','High','FG-PMP-001','WC-ASSY',25,25,0,0,'2025-10-13','2025-10-24','2025-10-14','2025-10-28','Blue Fig Hotels Group','JOB-DEMO-1002'),
  ('WO-DEMO-0003','SS Gearbox Housings — Fabrication Batch Q4','Stainless-steel machined housings for conveyor drive gearboxes','Production','Completed','Normal','WIP-GBX-001','WC-CNC',60,60,2,2,'2025-10-20','2025-11-07','2025-10-20','2025-11-06',NULL,'JOB-DEMO-1003'),
  ('WO-DEMO-0004','Drive Shaft Assemblies — Blast Chiller Line','Drive shafts for blast chiller trolley conveyor systems','Production','Completed','Normal','WIP-SFT-001','WC-CNC',80,78,0,2,'2025-11-03','2025-11-14','2025-11-03','2025-11-14',NULL,'JOB-DEMO-1004'),
  ('WO-DEMO-0005','Conveyor Dishwasher Drive Gearboxes — Golden Spoon','PG-50 gearbox assembly for rack-conveyor dishwashers','Assembly','Completed','High','FG-GBX-001','WC-ASSY',15,15,0,0,'2025-11-10','2025-11-28','2025-11-11','2025-12-03','Golden Spoon Franchises','JOB-DEMO-1005'),
  ('WO-DEMO-0006','Combi Oven Motors — Metro Hospital Kitchens','Hygienic-duty 5HP motors for hospital combi oven battery','Production','Completed','Urgent','FG-MTR-001','WC-ASSY',30,30,1,0,'2025-12-01','2025-12-12','2025-12-01','2025-12-11','Metro Hospital Kitchens','JOB-DEMO-1006'),
  ('WO-DEMO-0007','Wash Pumps — Stock Replenishment Batch','CP-200 pumps built to stock for dishwashing line spares','Production','Completed','Low','FG-PMP-001','WC-ASSY',20,20,0,1,'2025-12-08','2025-12-19','2025-12-08','2025-12-19',NULL,'JOB-DEMO-1007'),
  ('WO-DEMO-0008','SS Gearbox Housings — Welded Frame Batch','Welded SS housing sub-assemblies for kitchen conveyor drives','Production','Completed','Normal','WIP-GBX-001','WC-WELD',50,49,1,1,'2026-01-05','2026-01-23','2026-01-06','2026-01-27',NULL,'JOB-DEMO-1008'),
  ('WO-DEMO-0009','Drive Gearboxes — Lakeside Resort Banquet Kitchen','PG-50 gearboxes for banquet kitchen conveyor dishwasher','Assembly','Completed','Normal','FG-GBX-001','WC-ASSY',12,12,0,0,'2026-01-19','2026-02-06','2026-01-19','2026-02-05','Lakeside Resort & Spa','JOB-DEMO-1009'),
  ('WO-DEMO-0010','Combi Oven Motors — Campus Dining Co-op','Convection motors for campus dining combi oven rollout','Production','Completed','Normal','FG-MTR-001','WC-ASSY',35,35,0,1,'2026-02-09','2026-02-20','2026-02-09','2026-02-20','Campus Dining Co-op','JOB-DEMO-1010'),
  ('WO-DEMO-0011','Drive Shaft Assemblies — Spring Batch','Shaft assemblies for blast chiller and dishwasher drives','Production','Completed','Normal','WIP-SFT-001','WC-CNC',70,70,2,1,'2026-03-02','2026-03-13','2026-03-02','2026-03-17',NULL,'JOB-DEMO-1011'),
  ('WO-DEMO-0012','Wash Pumps — Summit Catering Central Kitchen','CP-200 pumps for central kitchen pot-wash line','Production','Completed','High','FG-PMP-001','WC-ASSY',18,18,0,0,'2026-03-23','2026-04-03','2026-03-23','2026-04-02','Summit Catering Services','JOB-DEMO-1012'),
  ('WO-DEMO-0013','Drive Gearboxes — Stock Build','PG-50 gearboxes to stock for after-sales exchange pool','Assembly','Completed','Low','FG-GBX-001','WC-ASSY',20,20,1,0,'2026-04-13','2026-05-01','2026-04-14','2026-04-30',NULL,'JOB-DEMO-1013'),
  ('WO-DEMO-0014','Rework — Combi Oven Motors (Harbour Grill Returns)','Rework of field-returned convection motors: bearing and seal replacement','Rework','Completed','High','FG-MTR-001','WC-QC',6,6,0,0,'2026-05-11','2026-05-15','2026-05-11','2026-05-14','Harbour Grill Restaurants','JOB-DEMO-1014'),
  -- ── In Progress (6) — actualStart set, no actualEnd, produced < planned ──
  ('WO-DEMO-0015','SS Gearbox Housings — CNC Batch 08/26','Machining of SS housings for Q4 gearbox assembly demand','Production','In Progress','High','WIP-GBX-001','WC-CNC',55,30,0,1,'2026-08-10','2026-09-04','2026-08-11',NULL,NULL,'JOB-DEMO-1015'),
  ('WO-DEMO-0016','Combi Oven Motors — Blue Fig Phase 2','Phase-2 combi oven motor batch for hotel group expansion','Production','In Progress','Normal','FG-MTR-001','WC-ASSY',45,20,1,0,'2026-08-17','2026-09-18','2026-08-18',NULL,'Blue Fig Hotels Group','JOB-DEMO-1016'),
  ('WO-DEMO-0017','Wash Pumps — Bayside Banquet Kitchen Line','CP-200 pumps for convention-center banquet dishwashing line','Production','In Progress','Urgent','FG-PMP-001','WC-ASSY',30,12,0,0,'2026-08-24','2026-09-25','2026-08-25',NULL,'Bayside Convention Center','JOB-DEMO-1017'),
  ('WO-DEMO-0018','Drive Shaft Assemblies — Autumn Batch','Shaft assemblies feeding gearbox assembly and spares','Production','In Progress','Normal','WIP-SFT-001','WC-CNC',90,35,1,1,'2026-08-31','2026-09-28','2026-09-01',NULL,NULL,'JOB-DEMO-1018'),
  ('WO-DEMO-0019','Drive Gearboxes — Golden Spoon Repeat Order','PG-50 gearboxes, repeat order for franchise store openings','Assembly','In Progress','Urgent','FG-GBX-001','WC-ASSY',16,5,0,0,'2026-09-01','2026-09-30','2026-09-02',NULL,'Golden Spoon Franchises','JOB-DEMO-1019'),
  ('WO-DEMO-0020','SS Gearbox Housings — Paint & Finish Batch','Surface finishing of machined housings before assembly','Production','In Progress','Normal','WIP-GBX-001','WC-PAINT',40,10,0,0,'2026-09-03','2026-09-24','2026-09-04',NULL,NULL,'JOB-DEMO-1020'),
  -- ── Released (4) — scheduled, not started ──
  ('WO-DEMO-0021','Combi Oven Motors — October Stock Batch','Build-to-stock motors ahead of winter combi oven season','Production','Released','Normal','FG-MTR-001','WC-ASSY',50,0,0,0,'2026-09-15','2026-10-09',NULL,NULL,NULL,'JOB-DEMO-1021'),
  ('WO-DEMO-0022','Wash Pumps — Riverside Bistro Pilot Kitchen','CP-200 pumps for pilot-store undercounter dishwashing','Production','Released','Normal','FG-PMP-001','WC-ASSY',22,0,0,0,'2026-09-21','2026-10-16',NULL,NULL,'Riverside Bistro Chain','JOB-DEMO-1022'),
  ('WO-DEMO-0023','SS Gearbox Housings — Cutting Batch 10/26','Sheet cutting and blanking for next housing batch','Production','Released','Low','WIP-GBX-001','WC-CUT',65,0,0,0,'2026-09-28','2026-10-23',NULL,NULL,NULL,'JOB-DEMO-1023'),
  ('WO-DEMO-0024','Drive Shaft Assemblies — Q4 Batch','Q4 shaft assembly batch for gearbox and chiller lines','Production','Released','Normal','WIP-SFT-001','WC-CNC',85,0,0,0,'2026-10-05','2026-10-30',NULL,NULL,NULL,'JOB-DEMO-1024'),
  -- ── Submitted (2) — planned, awaiting release ──
  ('WO-DEMO-0025','Drive Gearboxes — Lakeside Resort Expansion','PG-50 gearboxes for resort kitchen expansion wing','Assembly','Submitted','Normal','FG-GBX-001','WC-ASSY',14,0,0,0,'2026-10-12','2026-10-30',NULL,NULL,'Lakeside Resort & Spa','JOB-DEMO-1025'),
  ('WO-DEMO-0026','Combi Oven Motors — November Stock Batch','Stock motors for after-sales and retrofit demand','Production','Submitted','Low','FG-MTR-001','WC-ASSY',28,0,0,0,'2026-10-19','2026-11-06',NULL,NULL,NULL,'JOB-DEMO-1026'),
  -- ── On Hold (2) — started then paused ──
  ('WO-DEMO-0027','Wash Pumps — Metro Hospital (Spec Change)','On hold: hygiene spec revision awaiting customer sign-off','Production','On Hold','High','FG-PMP-001','WC-ASSY',24,8,0,0,'2026-07-06','2026-07-31','2026-07-06',NULL,'Metro Hospital Kitchens','JOB-DEMO-1027'),
  ('WO-DEMO-0028','SS Gearbox Housings — Weld Batch (Material Shortage)','On hold: SS sheet stock-out, purchase order in transit','Production','On Hold','Normal','WIP-GBX-001','WC-WELD',45,12,0,1,'2026-07-20','2026-08-14','2026-07-21',NULL,NULL,'JOB-DEMO-1028'),
  -- ── Cancelled (2) ──
  ('WO-DEMO-0029','Combi Oven Motors — Cancelled Customer Order','Cancelled before start: customer descoped combi oven package','Production','Cancelled','Normal','FG-MTR-001','WC-ASSY',20,0,0,0,'2026-01-26','2026-02-13',NULL,NULL,'Riverside Bistro Chain','JOB-DEMO-1029'),
  ('WO-DEMO-0030','Drive Gearboxes — Duplicate Order (Void)','Cancelled: duplicate of WO-DEMO-0025 raised in error','Assembly','Cancelled','Low','FG-GBX-001','WC-ASSY',10,0,0,0,'2026-05-18','2026-06-05',NULL,NULL,NULL,'JOB-DEMO-1030')
) AS v(wonum, woname, descr, wotype, status, priority, icode, wccode,
       pqty, prodqty, rejqty, scrapqty, pstart, pend, astart, aend, customer, job)
JOIN items        i ON i."itemCode"       = v.icode
JOIN work_centers w ON w."workCenterCode" = v.wccode;

-- ── Work order material items (BOM components resolved from the items master)
INSERT INTO work_order_items
  ("workOrderId","itemId","itemCode","itemName","itemType","sequenceNumber",
   "requiredQuantity","issuedQuantity","consumedQuantity","pendingQuantity",
   uom,"unitCost","totalCost",backflush,
   "isMaterialIssued","issuedAt","issuedBy",
   "isMaterialConsumed","consumedAt","consumedBy",
   "createdBy","createdAt","updatedAt")
SELECT
  wo.id, c.id::text, c."itemCode", c."itemName",
  'Required'::work_order_items_itemtype_enum, m.seq,
  round(wo."plannedQuantity" * m.qty_per, 4),
  CASE WHEN wo.status IN ('In Progress','On Hold','Completed','Closed')
       THEN round(wo."plannedQuantity" * m.qty_per, 4) ELSE 0 END,
  CASE WHEN wo.status IN ('Completed','Closed') THEN round(wo."plannedQuantity" * m.qty_per, 4)
       WHEN wo.status IN ('In Progress','On Hold') THEN round(wo."producedQuantity" * m.qty_per, 4)
       ELSE 0 END,
  CASE WHEN wo.status IN ('Completed','Closed','Cancelled') THEN 0
       WHEN wo.status IN ('In Progress','On Hold')
       THEN round((wo."plannedQuantity" - wo."producedQuantity") * m.qty_per, 4)
       ELSE round(wo."plannedQuantity" * m.qty_per, 4) END,
  c."baseUOM", c."standardCost",
  round(wo."plannedQuantity" * m.qty_per * c."standardCost", 2),
  (c."itemCode" LIKE 'CON-%'),
  wo."materialsIssued",
  CASE WHEN wo."materialsIssued" THEN wo."startedAt" END,
  CASE WHEN wo."materialsIssued" THEN 'Store Keeper — Ramesh' END,
  wo."materialsConsumed",
  CASE WHEN wo."materialsConsumed" THEN wo."completedAt" END,
  CASE WHEN wo."materialsConsumed" THEN 'Suresh Babu' END,
  'demo-seeder', wo."createdAt", wo."updatedAt"
FROM work_orders wo
JOIN (VALUES
  -- (parent finished/semi-finished itemCode, seq, component itemCode, qty per unit)
  ('FG-MTR-001', 1, 'RM-COP-001', 12.0),   -- copper winding wire (MTR)
  ('FG-MTR-001', 2, 'RM-STL-001',  3.5),   -- steel laminations/body (KG)
  ('FG-MTR-001', 3, 'SP-BRG-001',  2.0),   -- ball bearings
  ('FG-PMP-001', 1, 'RM-STL-001',  5.0),   -- SS volute/body (KG)
  ('FG-PMP-001', 2, 'SP-SL-001',   1.0),   -- mechanical seal
  ('FG-PMP-001', 3, 'SP-BRG-001',  2.0),   -- ball bearings
  ('FG-GBX-001', 1, 'WIP-GBX-001', 1.0),   -- machined housing
  ('FG-GBX-001', 2, 'WIP-SFT-001', 1.0),   -- drive shaft assembly
  ('FG-GBX-001', 3, 'SP-BRG-001',  4.0),   -- ball bearings
  ('FG-GBX-001', 4, 'CON-LUB-001', 0.5),   -- gear oil fill (LTR)
  ('WIP-GBX-001',1, 'RM-STL-001',  6.0),   -- SS sheet (KG)
  ('WIP-GBX-001',2, 'RM-ALM-001',  2.4),   -- aluminum rod (MTR)
  ('WIP-GBX-001',3, 'CON-CLT-001', 0.3),   -- cutting coolant (LTR)
  ('WIP-SFT-001',1, 'RM-ALM-001',  1.8),   -- aluminum rod (MTR)
  ('WIP-SFT-001',2, 'SP-BRG-001',  2.0)    -- ball bearings
) AS m(parent_code, seq, comp_code, qty_per)
  ON m.parent_code = wo."itemCode"
JOIN items c ON c."itemCode" = m.comp_code
WHERE wo."workOrderNumber" LIKE 'WO-DEMO-%';
