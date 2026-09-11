-- Demo seed — Inventory extended (balances, transfers, adjustments, cycle counts,
-- replenishment, batch & serial tracking) for B3 MACBIS.
-- References demo master data: items (18), core_warehouses (7), hr_employees,
-- adjustment_reasons, and the STE-DEMO-* stock entries seeded by 05_inventory_stock_entries.sql.
-- NOTE: none of these 12 tables carry a companyId column (verified via \d+), so no company anchor.
-- Idempotent delete predicates:
--   stock_transfers        -> "transferNumber"  LIKE 'STT-DEMO-%'   (lines cascade)
--   stock_adjustments      -> "adjustmentNumber" LIKE 'STA-DEMO-%'  (lines cascade)
--   cycle_count_plans      -> "planNumber"      LIKE 'CC-DEMO-%'    (items deleted first; FK has no cascade)
--   stock_balances         -> "updatedBy" = 'demo-seed'
--   reorder_rules          -> "ruleName"        LIKE 'DEMO-%'
--   auto_replenishment_configs -> "configName"  LIKE 'DEMO-%'
--   replenishment_requests -> "requestNumber"   LIKE 'RPL-DEMO-%'
--   batch_numbers          -> "batchNumber"     LIKE 'BATCH-DEMO-%'
--   serial_numbers         -> "serialNumber"    LIKE 'SN-DEMO-%'

-- ============================================================================
-- 1. STOCK BALANCES — computed from the seeded STE-DEMO-* stock entries so the
--    on-hand figures reconcile with movement history. Only positive nets kept.
-- ============================================================================
DELETE FROM stock_balances WHERE "updatedBy" = 'demo-seed';

INSERT INTO stock_balances
  ("itemId","itemCode","itemName","warehouseId","warehouseName",
   "availableQuantity",uom,"totalQuantity","freeQuantity",
   "valuationRate","stockValue","valuationMethod",currency,
   "lastReceiptDate","lastUpdatedTime","updatedBy","createdAt","updatedAt")
SELECT
  mov."itemId", mov."itemCode", mov."itemName", mov.wid, mov.wname,
  mov.net, mov.uom, mov.net, mov.net,
  COALESCE(i."standardCost", 0),
  ROUND(mov.net * COALESCE(i."standardCost", 0), 2),
  'Weighted Average', 'INR',
  DATE '2026-08-31', TIMESTAMP '2026-09-01 09:00:00', 'demo-seed',
  TIMESTAMP '2026-09-01 09:00:00', TIMESTAMP '2026-09-01 09:00:00'
FROM (
  SELECT m."itemId", m."itemCode", m."itemName", m.uom, m.wid, m.wname,
         SUM(m.qty) AS net
  FROM (
    SELECT l."itemId", l."itemCode", l."itemName", l.uom,
           e."toWarehouseId" AS wid, e."toWarehouseName" AS wname, l.quantity AS qty
    FROM stock_entry_lines l
    JOIN stock_entries e ON e.id = l."stockEntryId"
    WHERE e."entryNumber" LIKE 'STE-DEMO-%' AND e."toWarehouseId" IS NOT NULL
    UNION ALL
    SELECT l."itemId", l."itemCode", l."itemName", l.uom,
           e."fromWarehouseId", e."fromWarehouseName", -l.quantity
    FROM stock_entry_lines l
    JOIN stock_entries e ON e.id = l."stockEntryId"
    WHERE e."entryNumber" LIKE 'STE-DEMO-%' AND e."fromWarehouseId" IS NOT NULL
  ) m
  GROUP BY m."itemId", m."itemCode", m."itemName", m.uom, m.wid, m.wname
  HAVING SUM(m.qty) > 0
) mov
JOIN items i ON i."itemCode" = mov."itemCode";

-- ============================================================================
-- 2. STOCK TRANSFERS + LINES
-- ============================================================================
DELETE FROM stock_transfers WHERE "transferNumber" LIKE 'STT-DEMO-%';

INSERT INTO stock_transfers
  (id,"transferNumber","transferType",status,"transferDate","expectedReceiptDate","actualReceiptDate",
   "fromWarehouseId","fromWarehouseName","toWarehouseId","toWarehouseName",
   "requestedBy","requestedByName","requiresApproval","approvedBy","approvedByName","approvedAt",
   "dispatchedAt","dispatchedByName","receivedAt","receivedByName",
   "transportMode","vehicleNumber",currency,"totalValue",purpose,
   "createdBy","updatedBy","createdAt","updatedAt")
VALUES
  ('d3100000-0000-4000-8000-000000000001','STT-DEMO-0001',
   'Warehouse to Warehouse'::stock_transfers_transfertype_enum,'Received'::stock_transfers_status_enum,
   DATE '2025-10-14',DATE '2025-10-15',DATE '2025-10-15',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-RM'),'Raw Material Store',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-WIP'),'Work in Progress',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0005'),'Suresh Patel',true,
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'Vikram Singh',TIMESTAMP '2025-10-14 11:00:00',
   TIMESTAMP '2025-10-14 15:30:00','Suresh Patel',TIMESTAMP '2025-10-15 09:20:00','Meera Nair',
   'Forklift','FL-02','INR',33000.00,'Raw material issue to machining line',
   'demo-seed','demo-seed',TIMESTAMP '2025-10-14 10:05:00',TIMESTAMP '2025-10-15 09:20:00'),
  ('d3100000-0000-4000-8000-000000000002','STT-DEMO-0002',
   'Warehouse to Warehouse'::stock_transfers_transfertype_enum,'Received'::stock_transfers_status_enum,
   DATE '2025-11-20',DATE '2025-11-21',DATE '2025-11-21',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-MAIN'),'Main Warehouse',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-SPARE'),'Spare Parts Store',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0006'),'Meera Nair',false,
   NULL,NULL,NULL,
   TIMESTAMP '2025-11-20 14:00:00','Rajesh Kumar',TIMESTAMP '2025-11-21 10:45:00','Meera Nair',
   'Hand Truck',NULL,'INR',15720.00,'Restock maintenance spares crib',
   'demo-seed','demo-seed',TIMESTAMP '2025-11-20 09:40:00',TIMESTAMP '2025-11-21 10:45:00'),
  ('d3100000-0000-4000-8000-000000000003','STT-DEMO-0003',
   'Warehouse to Warehouse'::stock_transfers_transfertype_enum,'In Transit'::stock_transfers_status_enum,
   DATE '2026-02-10',DATE '2026-02-12',NULL,
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-FG'),'Finished Goods Store',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-MAIN'),'Main Warehouse',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),'Rajesh Kumar',true,
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'Vikram Singh',TIMESTAMP '2026-02-10 10:15:00',
   TIMESTAMP '2026-02-10 16:00:00','Rajesh Kumar',NULL,NULL,
   'Road','KA-01-MN-4521','INR',109000.00,'Stage finished goods for dispatch consolidation',
   'demo-seed','demo-seed',TIMESTAMP '2026-02-10 09:10:00',TIMESTAMP '2026-02-10 16:00:00'),
  ('d3100000-0000-4000-8000-000000000004','STT-DEMO-0004',
   'Warehouse to Warehouse'::stock_transfers_transfertype_enum,'Approved'::stock_transfers_status_enum,
   DATE '2026-05-05',DATE '2026-05-06',NULL,
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-WIP'),'Work in Progress',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-FG'),'Finished Goods Store',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0005'),'Suresh Patel',true,
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'Vikram Singh',TIMESTAMP '2026-05-05 12:30:00',
   NULL,NULL,NULL,NULL,
   'Forklift','FL-01','INR',220000.00,'Move completed gearboxes to FG store',
   'demo-seed','demo-seed',TIMESTAMP '2026-05-05 11:00:00',TIMESTAMP '2026-05-05 12:30:00'),
  ('d3100000-0000-4000-8000-000000000005','STT-DEMO-0005',
   'Warehouse to Warehouse'::stock_transfers_transfertype_enum,'Submitted'::stock_transfers_status_enum,
   DATE '2026-07-18',DATE '2026-07-19',NULL,
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-MAIN'),'Main Warehouse',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-QC'),'QC Hold Area',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0006'),'Meera Nair',true,
   NULL,NULL,NULL,NULL,NULL,NULL,NULL,
   'Hand Truck',NULL,'INR',11000.00,'Inserts held for incoming quality verification',
   'demo-seed','demo-seed',TIMESTAMP '2026-07-18 10:20:00',TIMESTAMP '2026-07-18 10:20:00'),
  ('d3100000-0000-4000-8000-000000000006','STT-DEMO-0006',
   'Warehouse to Warehouse'::stock_transfers_transfertype_enum,'Draft'::stock_transfers_status_enum,
   DATE '2026-09-02',DATE '2026-09-04',NULL,
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-SPARE'),'Spare Parts Store',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-MAIN'),'Main Warehouse',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),'Rajesh Kumar',false,
   NULL,NULL,NULL,NULL,NULL,NULL,NULL,
   'Hand Truck',NULL,'INR',14100.00,'Return surplus spares to main warehouse',
   'demo-seed','demo-seed',TIMESTAMP '2026-09-02 09:05:00',TIMESTAMP '2026-09-02 09:05:00');

INSERT INTO stock_transfer_lines
  ("stockTransferId","lineNumber","itemId","itemCode","itemName",
   "requestedQuantity","dispatchedQuantity","receivedQuantity","acceptedQuantity",
   uom,rate,amount,"createdAt","updatedAt")
VALUES
  ('d3100000-0000-4000-8000-000000000001',1,(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm',200,200,200,200,'KG',85.00,17000.00,TIMESTAMP '2025-10-14 10:05:00',TIMESTAMP '2025-10-15 09:20:00'),
  ('d3100000-0000-4000-8000-000000000001',2,(SELECT id::text FROM items WHERE "itemCode"='RM-ALM-001'),'RM-ALM-001','Aluminum Rod 20mm',50,50,50,50,'MTR',320.00,16000.00,TIMESTAMP '2025-10-14 10:05:00',TIMESTAMP '2025-10-15 09:20:00'),
  ('d3100000-0000-4000-8000-000000000002',1,(SELECT id::text FROM items WHERE "itemCode"='SP-BRG-001'),'SP-BRG-001','Ball Bearing 6205',20,20,20,20,'PCS',450.00,9000.00,TIMESTAMP '2025-11-20 09:40:00',TIMESTAMP '2025-11-21 10:45:00'),
  ('d3100000-0000-4000-8000-000000000002',2,(SELECT id::text FROM items WHERE "itemCode"='SP-BLT-001'),'SP-BLT-001','V-Belt A68',24,24,24,24,'PCS',280.00,6720.00,TIMESTAMP '2025-11-20 09:40:00',TIMESTAMP '2025-11-21 10:45:00'),
  ('d3100000-0000-4000-8000-000000000003',1,(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',6,6,0,0,'PCS',12500.00,75000.00,TIMESTAMP '2026-02-10 09:10:00',TIMESTAMP '2026-02-10 16:00:00'),
  ('d3100000-0000-4000-8000-000000000003',2,(SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',4,4,0,0,'PCS',8500.00,34000.00,TIMESTAMP '2026-02-10 09:10:00',TIMESTAMP '2026-02-10 16:00:00'),
  ('d3100000-0000-4000-8000-000000000004',1,(SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',10,0,0,0,'PCS',22000.00,220000.00,TIMESTAMP '2026-05-05 11:00:00',TIMESTAMP '2026-05-05 12:30:00'),
  ('d3100000-0000-4000-8000-000000000005',1,(SELECT id::text FROM items WHERE "itemCode"='TOOL-INS-001'),'TOOL-INS-001','Carbide Insert CNMG 120408',5,0,0,0,'BOX',2200.00,11000.00,TIMESTAMP '2026-07-18 10:20:00',TIMESTAMP '2026-07-18 10:20:00'),
  ('d3100000-0000-4000-8000-000000000006',1,(SELECT id::text FROM items WHERE "itemCode"='SP-SL-001'),'SP-SL-001','Mechanical Seal MS-40',8,0,0,0,'PCS',1200.00,9600.00,TIMESTAMP '2026-09-02 09:05:00',TIMESTAMP '2026-09-02 09:05:00'),
  ('d3100000-0000-4000-8000-000000000006',2,(SELECT id::text FROM items WHERE "itemCode"='CON-LUB-001'),'CON-LUB-001','Industrial Lubricant Oil ISO VG 68',25,0,0,0,'LTR',180.00,4500.00,TIMESTAMP '2026-09-02 09:05:00',TIMESTAMP '2026-09-02 09:05:00');

-- ============================================================================
-- 3. STOCK ADJUSTMENTS + LINES
-- ============================================================================
DELETE FROM stock_adjustments WHERE "adjustmentNumber" LIKE 'STA-DEMO-%';

INSERT INTO stock_adjustments
  (id,"adjustmentNumber","adjustmentType",status,"adjustmentDate",
   "warehouseId","warehouseName","isCycleCount","isPhysicalInventory","countDate",
   "counterId","counterName","requiresApproval","approvedBy","approvedByName","approvedAt",
   "isPosted","postedAt","totalAdjustmentValue","positiveAdjustmentValue","negativeAdjustmentValue",
   currency,reason,justification,"createdBy","updatedBy","createdAt","updatedAt")
VALUES
  ('d3200000-0000-4000-8000-000000000001','STA-DEMO-0001',
   'Cycle Count'::stock_adjustments_adjustmenttype_enum,'Posted'::stock_adjustments_status_enum,
   DATE '2025-12-15',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-RM'),'Raw Material Store',
   true,false,DATE '2025-12-15',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0006'),'Meera Nair',true,
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'Vikram Singh',TIMESTAMP '2025-12-16 10:00:00',
   true,TIMESTAMP '2025-12-16 10:30:00',-245.00,180.00,425.00,
   'INR','Physical Count Adjustment','Q4 A-class cycle count variances within tolerance',
   'demo-seed','demo-seed',TIMESTAMP '2025-12-15 17:30:00',TIMESTAMP '2025-12-16 10:30:00'),
  ('d3200000-0000-4000-8000-000000000002','STA-DEMO-0002',
   'Damage'::stock_adjustments_adjustmenttype_enum,'Approved'::stock_adjustments_status_enum,
   DATE '2026-02-25',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-MAIN'),'Main Warehouse',
   false,false,NULL,NULL,NULL,true,
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'Vikram Singh',TIMESTAMP '2026-02-26 09:15:00',
   false,NULL,-840.00,0.00,840.00,
   'INR','Damaged Goods','V-belts crushed under fallen pallet during rack reorganisation',
   'demo-seed','demo-seed',TIMESTAMP '2026-02-25 15:10:00',TIMESTAMP '2026-02-26 09:15:00'),
  ('d3200000-0000-4000-8000-000000000003','STA-DEMO-0003',
   'Physical Inventory'::stock_adjustments_adjustmenttype_enum,'Posted'::stock_adjustments_status_enum,
   DATE '2026-03-31',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-FG'),'Finished Goods Store',
   false,true,DATE '2026-03-31',
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),'Rajesh Kumar',true,
   (SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'Vikram Singh',TIMESTAMP '2026-04-01 11:00:00',
   true,TIMESTAMP '2026-04-01 11:20:00',9500.00,22000.00,12500.00,
   'INR','Physical Count Adjustment','FY25-26 year-end wall-to-wall physical inventory',
   'demo-seed','demo-seed',TIMESTAMP '2026-03-31 18:45:00',TIMESTAMP '2026-04-01 11:20:00'),
  ('d3200000-0000-4000-8000-000000000004','STA-DEMO-0004',
   'Write Off'::stock_adjustments_adjustmenttype_enum,'Submitted'::stock_adjustments_status_enum,
   DATE '2026-06-30',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-REJ'),'Rejection Store',
   false,false,NULL,NULL,NULL,true,NULL,NULL,NULL,
   false,NULL,-5500.00,0.00,5500.00,
   'INR','Expired Stock','Coolant concentrate past shelf life; disposal per EHS procedure',
   'demo-seed','demo-seed',TIMESTAMP '2026-06-30 12:00:00',TIMESTAMP '2026-06-30 12:00:00'),
  ('d3200000-0000-4000-8000-000000000005','STA-DEMO-0005',
   'Correction'::stock_adjustments_adjustmenttype_enum,'Draft'::stock_adjustments_status_enum,
   DATE '2026-08-28',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-SPARE'),'Spare Parts Store',
   false,false,NULL,NULL,NULL,true,NULL,NULL,NULL,
   false,NULL,2400.00,2400.00,0.00,
   'INR','Data Correction','Two seals received against PO but GRN keyed short; correcting book stock',
   'demo-seed','demo-seed',TIMESTAMP '2026-08-28 10:30:00',TIMESTAMP '2026-08-28 10:30:00');

INSERT INTO stock_adjustment_lines
  ("stockAdjustmentId","lineNumber","itemId","itemCode","itemName",
   "systemQuantity","physicalQuantity","adjustmentQuantity",uom,
   "valuationRate","adjustmentValue","systemValue","physicalValue",
   "countedAt","countedByName","variancePercentage","isSignificantVariance",
   "adjustmentReason","createdAt","updatedAt")
VALUES
  ('d3200000-0000-4000-8000-000000000001',1,(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm',700,695,-5,'KG',85.00,-425.00,59500.00,59075.00,TIMESTAMP '2025-12-15 14:20:00','Meera Nair',-0.71,false,'Physical Count Adjustment',TIMESTAMP '2025-12-15 17:30:00',TIMESTAMP '2025-12-16 10:30:00'),
  ('d3200000-0000-4000-8000-000000000001',2,(SELECT id::text FROM items WHERE "itemCode"='RM-COP-001'),'RM-COP-001','Copper Wire 2.5mm',520,524,4,'MTR',45.00,180.00,23400.00,23580.00,TIMESTAMP '2025-12-15 15:05:00','Meera Nair',0.77,false,'Physical Count Adjustment',TIMESTAMP '2025-12-15 17:30:00',TIMESTAMP '2025-12-16 10:30:00'),
  ('d3200000-0000-4000-8000-000000000002',1,(SELECT id::text FROM items WHERE "itemCode"='SP-BLT-001'),'SP-BLT-001','V-Belt A68',40,37,-3,'PCS',280.00,-840.00,11200.00,10360.00,TIMESTAMP '2026-02-25 14:40:00','Rajesh Kumar',-7.50,true,'Damaged Goods',TIMESTAMP '2026-02-25 15:10:00',TIMESTAMP '2026-02-26 09:15:00'),
  ('d3200000-0000-4000-8000-000000000003',1,(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',10,9,-1,'PCS',12500.00,-12500.00,125000.00,112500.00,TIMESTAMP '2026-03-31 16:10:00','Rajesh Kumar',-10.00,true,'Physical Count Adjustment',TIMESTAMP '2026-03-31 18:45:00',TIMESTAMP '2026-04-01 11:20:00'),
  ('d3200000-0000-4000-8000-000000000003',2,(SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',28,29,1,'PCS',22000.00,22000.00,616000.00,638000.00,TIMESTAMP '2026-03-31 16:45:00','Rajesh Kumar',3.57,false,'Found Stock',TIMESTAMP '2026-03-31 18:45:00',TIMESTAMP '2026-04-01 11:20:00'),
  ('d3200000-0000-4000-8000-000000000004',1,(SELECT id::text FROM items WHERE "itemCode"='CON-CLT-001'),'CON-CLT-001','Cutting Coolant Concentrate',25,0,-25,'LTR',220.00,-5500.00,5500.00,0.00,NULL,NULL,-100.00,true,'Expired Stock',TIMESTAMP '2026-06-30 12:00:00',TIMESTAMP '2026-06-30 12:00:00'),
  ('d3200000-0000-4000-8000-000000000005',1,(SELECT id::text FROM items WHERE "itemCode"='SP-SL-001'),'SP-SL-001','Mechanical Seal MS-40',6,8,2,'PCS',1200.00,2400.00,7200.00,9600.00,NULL,NULL,33.33,true,'Data Correction',TIMESTAMP '2026-08-28 10:30:00',TIMESTAMP '2026-08-28 10:30:00');

-- ============================================================================
-- 4. CYCLE COUNT PLANS + ITEMS (items FK has no cascade -> delete children first)
-- ============================================================================
DELETE FROM cycle_count_items WHERE "planId" IN
  (SELECT id FROM cycle_count_plans WHERE "planNumber" LIKE 'CC-DEMO-%');
DELETE FROM cycle_count_plans WHERE "planNumber" LIKE 'CC-DEMO-%';

INSERT INTO cycle_count_plans
  (id,"planNumber",title,status,"scheduledDate","warehouseId","warehouseName",
   "abcClass","assignedTo","adjustmentId",remarks,"createdAt","updatedAt")
VALUES
  ('d3300000-0000-4000-8000-000000000001','CC-DEMO-0001','Q4 FY25 A-Class Cycle Count — Raw Material Store',
   'Completed'::cycle_count_plans_status_enum,DATE '2025-12-15',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-RM'),'Raw Material Store',
   'A',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0006'),
   'd3200000-0000-4000-8000-000000000001',
   'Variances posted via STA-DEMO-0001',TIMESTAMP '2025-12-01 09:00:00',TIMESTAMP '2025-12-16 10:30:00'),
  ('d3300000-0000-4000-8000-000000000002','CC-DEMO-0002','Spare Parts Crib Bin Count — August',
   'In Progress'::cycle_count_plans_status_enum,DATE '2026-08-20',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-SPARE'),'Spare Parts Store',
   'B',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0005'),NULL,
   'Two of four bins counted so far',TIMESTAMP '2026-08-14 09:30:00',TIMESTAMP '2026-08-21 16:00:00'),
  ('d3300000-0000-4000-8000-000000000003','CC-DEMO-0003','FG Store September Count',
   'Scheduled'::cycle_count_plans_status_enum,DATE '2026-09-25',
   (SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-FG'),'Finished Goods Store',
   'A',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),NULL,
   'Pre-dispatch verification of finished goods on hand',TIMESTAMP '2026-09-05 10:00:00',TIMESTAMP '2026-09-05 10:00:00');

INSERT INTO cycle_count_items
  ("planId","itemId","itemCode","itemName","systemQuantity","actualQuantity",
   "countedAt","isCounted",remarks)
VALUES
  ('d3300000-0000-4000-8000-000000000001',(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm',700,695,TIMESTAMP '2025-12-15 14:20:00',true,'Short 5 KG — offcut scrap not booked'),
  ('d3300000-0000-4000-8000-000000000001',(SELECT id::text FROM items WHERE "itemCode"='RM-ALM-001'),'RM-ALM-001','Aluminum Rod 20mm',200,200,TIMESTAMP '2025-12-15 14:45:00',true,NULL),
  ('d3300000-0000-4000-8000-000000000001',(SELECT id::text FROM items WHERE "itemCode"='RM-COP-001'),'RM-COP-001','Copper Wire 2.5mm',520,524,TIMESTAMP '2025-12-15 15:05:00',true,'Excess 4 MTR found in cut-length rack'),
  ('d3300000-0000-4000-8000-000000000001',(SELECT id::text FROM items WHERE "itemCode"='CON-LUB-001'),'CON-LUB-001','Industrial Lubricant Oil ISO VG 68',125,125,TIMESTAMP '2025-12-15 15:30:00',true,NULL),
  ('d3300000-0000-4000-8000-000000000002',(SELECT id::text FROM items WHERE "itemCode"='SP-BRG-001'),'SP-BRG-001','Ball Bearing 6205',44,44,TIMESTAMP '2026-08-20 11:10:00',true,NULL),
  ('d3300000-0000-4000-8000-000000000002',(SELECT id::text FROM items WHERE "itemCode"='SP-BLT-001'),'SP-BLT-001','V-Belt A68',4,3,TIMESTAMP '2026-08-20 11:35:00',true,'One belt short — pending recount'),
  ('d3300000-0000-4000-8000-000000000002',(SELECT id::text FROM items WHERE "itemCode"='SP-SL-001'),'SP-SL-001','Mechanical Seal MS-40',6,NULL,NULL,false,NULL),
  ('d3300000-0000-4000-8000-000000000002',(SELECT id::text FROM items WHERE "itemCode"='TOOL-DRL-001'),'TOOL-DRL-001','HSS Drill Bit Set 1-13mm',12,NULL,NULL,false,NULL),
  ('d3300000-0000-4000-8000-000000000003',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',10,NULL,NULL,false,NULL),
  ('d3300000-0000-4000-8000-000000000003',(SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',8,NULL,NULL,false,NULL),
  ('d3300000-0000-4000-8000-000000000003',(SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',28,NULL,NULL,false,NULL);

-- ============================================================================
-- 5. REORDER RULES
-- ============================================================================
DELETE FROM reorder_rules WHERE "ruleName" LIKE 'DEMO-%';

INSERT INTO reorder_rules
  ("ruleName",description,category,"itemFilter",method,"autoApprove",priority,
   supplier,"leadTimeDays","safetyStockDays","isActive","createdAt","updatedAt")
VALUES
  ('DEMO-Bearings Reorder Point','Reorder 6205 bearings when free stock falls below reorder point','Spare Parts','SP-BRG-%','reorder-point',false,'high','SKF Distributors India',7,5,true,TIMESTAMP '2025-10-06 10:00:00',TIMESTAMP '2026-04-12 09:00:00'),
  ('DEMO-V-Belts Min-Max','Maintain V-belt stock between min and max band','Spare Parts','SP-BLT-%','min-max',false,'medium','Fenner India',10,7,true,TIMESTAMP '2025-10-06 10:05:00',TIMESTAMP '2025-10-06 10:05:00'),
  ('DEMO-Lubricants Consumption','Replenish lubricant oil based on trailing 90-day consumption','Consumables','CON-LUB-%','consumption-based',true,'high','Castrol Industrial',5,3,true,TIMESTAMP '2025-11-12 11:30:00',TIMESTAMP '2026-06-01 08:45:00'),
  ('DEMO-Coolant Reorder','Coolant concentrate reorder-point rule for machining cells','Consumables','CON-CLT-%','reorder-point',false,'medium','Blaser Swisslube',5,4,true,TIMESTAMP '2025-11-12 11:35:00',TIMESTAMP '2025-11-12 11:35:00'),
  ('DEMO-Steel Sheet EOQ','Economic order quantity rule for 2mm steel sheet','Raw Material','RM-STL-%','economic-order-qty',false,'critical','Tata Steel Distribution',14,10,true,TIMESTAMP '2026-01-08 09:20:00',TIMESTAMP '2026-01-08 09:20:00'),
  ('DEMO-Carbide Inserts Min-Max','Insert stock band rule — suspended pending vendor renegotiation','Tooling','TOOL-INS-%','min-max',false,'low','Sandvik Coromant',21,7,false,TIMESTAMP '2026-03-02 14:00:00',TIMESTAMP '2026-07-15 10:10:00');

-- ============================================================================
-- 6. AUTO REPLENISHMENT CONFIGS
-- ============================================================================
DELETE FROM auto_replenishment_configs WHERE "configName" LIKE 'DEMO-%';

INSERT INTO auto_replenishment_configs
  ("configName",description,category,"itemPattern",enabled,schedule,"autoApprove",
   "maxOrderValue","notifyUsers","lastRun","nextRun","totalRequests","successRate",
   "createdAt","updatedAt")
VALUES
  ('DEMO-Consumables Daily Sweep','Daily check of coolant and lubricant levels across all stores','Consumables','CON-%',true,'daily',true,50000.00,'["stores@b3macbis.example","purchase@b3macbis.example"]',TIMESTAMP '2026-09-09 06:00:00',TIMESTAMP '2026-09-10 06:00:00',148,96.62,TIMESTAMP '2025-10-20 09:00:00',TIMESTAMP '2026-09-09 06:00:00'),
  ('DEMO-Spares Weekly Review','Weekly replenishment scan of maintenance spares crib','Spare Parts','SP-%',true,'weekly',false,150000.00,'["maintenance@b3macbis.example"]',TIMESTAMP '2026-09-07 07:00:00',TIMESTAMP '2026-09-14 07:00:00',44,90.91,TIMESTAMP '2025-10-20 09:10:00',TIMESTAMP '2026-09-07 07:00:00'),
  ('DEMO-Raw Material Hourly Watch','Hourly reorder-point watch on machining raw materials','Raw Material','RM-%',true,'hourly',false,500000.00,'["planning@b3macbis.example","purchase@b3macbis.example"]',TIMESTAMP '2026-09-10 08:00:00',TIMESTAMP '2026-09-10 09:00:00',612,98.20,TIMESTAMP '2026-01-15 10:00:00',TIMESTAMP '2026-09-10 08:00:00'),
  ('DEMO-Tooling Replenishment (Paused)','Insert and drill replenishment — paused during vendor changeover','Tooling','TOOL-%',false,'daily',false,80000.00,'["toolcrib@b3macbis.example"]',TIMESTAMP '2026-07-14 06:00:00',NULL,63,87.30,TIMESTAMP '2026-03-02 14:30:00',TIMESTAMP '2026-07-15 10:15:00');

-- ============================================================================
-- 7. REPLENISHMENT REQUESTS
-- ============================================================================
DELETE FROM replenishment_requests WHERE "requestNumber" LIKE 'RPL-DEMO-%';

INSERT INTO replenishment_requests
  ("requestNumber","itemCode","itemName",quantity,uom,priority,"requestDate","requiredBy",
   notes,status,"createdAt","updatedAt")
VALUES
  ('RPL-DEMO-0001','SP-BRG-001','Ball Bearing 6205',50,'PCS','high',DATE '2025-11-05',DATE '2025-11-15','Below reorder point after preventive maintenance drive','ordered',TIMESTAMP '2025-11-05 09:15:00',TIMESTAMP '2025-11-08 11:00:00'),
  ('RPL-DEMO-0002','CON-LUB-001','Industrial Lubricant Oil ISO VG 68',200,'LTR','medium',DATE '2025-12-02',DATE '2025-12-10','Auto-generated by daily consumables sweep','ordered',TIMESTAMP '2025-12-02 06:05:00',TIMESTAMP '2025-12-04 10:30:00'),
  ('RPL-DEMO-0003','RM-STL-001','Steel Sheet 2mm',500,'KG','critical',DATE '2026-02-18',DATE '2026-03-01','Machining schedule for gearbox housings doubles steel draw','approved',TIMESTAMP '2026-02-18 10:40:00',TIMESTAMP '2026-02-19 09:00:00'),
  ('RPL-DEMO-0004','TOOL-INS-001','Carbide Insert CNMG 120408',10,'BOX','high',DATE '2026-04-09',DATE '2026-04-20','Insert wear rate up on new alloy jobs','approved',TIMESTAMP '2026-04-09 14:25:00',TIMESTAMP '2026-04-10 09:45:00'),
  ('RPL-DEMO-0005','CON-CLT-001','Cutting Coolant Concentrate',100,'LTR','medium',DATE '2026-06-30',DATE '2026-07-08','Replace stock written off as expired (STA-DEMO-0004)','pending',TIMESTAMP '2026-06-30 12:30:00',TIMESTAMP '2026-06-30 12:30:00'),
  ('RPL-DEMO-0006','SP-BLT-001','V-Belt A68',30,'PCS','low',DATE '2026-07-22',DATE '2026-08-05','Top-up after damage write-off and count variance','pending',TIMESTAMP '2026-07-22 11:00:00',TIMESTAMP '2026-07-22 11:00:00'),
  ('RPL-DEMO-0007','RM-ALM-001','Aluminum Rod 20mm',300,'MTR','medium',DATE '2026-08-14',DATE '2026-08-28','Cancelled — requirement absorbed by open PO','cancelled',TIMESTAMP '2026-08-14 09:50:00',TIMESTAMP '2026-08-18 15:20:00'),
  ('RPL-DEMO-0008','SP-SL-001','Mechanical Seal MS-40',20,'PCS','high',DATE '2026-09-08',DATE '2026-09-18','Pump overhaul campaign scheduled for October','pending',TIMESTAMP '2026-09-08 10:05:00',TIMESTAMP '2026-09-08 10:05:00');

-- ============================================================================
-- 8. BATCH NUMBERS (lot-tracked raw materials & consumables)
-- ============================================================================
DELETE FROM batch_numbers WHERE "batchNumber" LIKE 'BATCH-DEMO-%';

INSERT INTO batch_numbers
  ("batchNumber","itemId","itemCode","itemName",status,
   "manufacturingDate","manufacturerName","expiryDate","shelfLifeDays","isExpired",
   "supplierName","purchaseDate","receiptDate",
   "initialQuantity","availableQuantity","issuedQuantity","quarantineQuantity",
   uom,"purchasePrice",currency,"fifoSequence","isPickable",
   "createdBy","updatedBy","createdAt","updatedAt")
VALUES
  ('BATCH-DEMO-0001',(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','Active'::batch_numbers_status_enum,DATE '2025-09-20','Tata Steel',NULL,NULL,false,'Tata Steel Distribution',DATE '2025-10-01',DATE '2025-10-06',500,320,180,0,'KG',85.00,'INR',1,true,'demo-seed','demo-seed',TIMESTAMP '2025-10-06 11:00:00',TIMESTAMP '2026-08-20 09:00:00'),
  ('BATCH-DEMO-0002',(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','Active'::batch_numbers_status_enum,DATE '2026-02-10','Tata Steel',NULL,NULL,false,'Tata Steel Distribution',DATE '2026-02-20',DATE '2026-03-02',500,455,45,0,'KG',88.00,'INR',2,true,'demo-seed','demo-seed',TIMESTAMP '2026-03-02 10:30:00',TIMESTAMP '2026-08-20 09:00:00'),
  ('BATCH-DEMO-0003',(SELECT id::text FROM items WHERE "itemCode"='RM-ALM-001'),'RM-ALM-001','Aluminum Rod 20mm','Active'::batch_numbers_status_enum,DATE '2025-10-15','Hindalco',NULL,NULL,false,'Hindalco Industries',DATE '2025-11-01',DATE '2025-11-07',400,240,160,0,'MTR',320.00,'INR',1,true,'demo-seed','demo-seed',TIMESTAMP '2025-11-07 12:00:00',TIMESTAMP '2026-07-30 14:00:00'),
  ('BATCH-DEMO-0004',(SELECT id::text FROM items WHERE "itemCode"='RM-COP-001'),'RM-COP-001','Copper Wire 2.5mm','Active'::batch_numbers_status_enum,DATE '2026-01-05','Polycab',NULL,NULL,false,'Polycab Wires',DATE '2026-01-18',DATE '2026-01-24',600,410,190,0,'MTR',45.00,'INR',1,true,'demo-seed','demo-seed',TIMESTAMP '2026-01-24 09:45:00',TIMESTAMP '2026-08-05 10:20:00'),
  ('BATCH-DEMO-0005',(SELECT id::text FROM items WHERE "itemCode"='CON-LUB-001'),'CON-LUB-001','Industrial Lubricant Oil ISO VG 68','Consumed'::batch_numbers_status_enum,DATE '2025-08-01','Castrol',DATE '2027-08-01',730,false,'Castrol Industrial',DATE '2025-10-10',DATE '2025-10-15',200,0,200,0,'LTR',180.00,'INR',1,false,'demo-seed','demo-seed',TIMESTAMP '2025-10-15 10:00:00',TIMESTAMP '2026-05-12 16:30:00'),
  ('BATCH-DEMO-0006',(SELECT id::text FROM items WHERE "itemCode"='CON-LUB-001'),'CON-LUB-001','Industrial Lubricant Oil ISO VG 68','Active'::batch_numbers_status_enum,DATE '2026-04-15','Castrol',DATE '2028-04-15',730,false,'Castrol Industrial',DATE '2026-05-20',DATE '2026-05-26',300,265,35,0,'LTR',185.00,'INR',2,true,'demo-seed','demo-seed',TIMESTAMP '2026-05-26 11:15:00',TIMESTAMP '2026-09-01 09:00:00'),
  ('BATCH-DEMO-0007',(SELECT id::text FROM items WHERE "itemCode"='CON-CLT-001'),'CON-CLT-001','Cutting Coolant Concentrate','Expired'::batch_numbers_status_enum,DATE '2025-06-10','Blaser',DATE '2026-06-10',365,true,'Blaser Swisslube',DATE '2025-10-05',DATE '2025-10-12',150,25,100,25,'LTR',220.00,'INR',1,false,'demo-seed','demo-seed',TIMESTAMP '2025-10-12 14:20:00',TIMESTAMP '2026-06-30 12:00:00'),
  ('BATCH-DEMO-0008',(SELECT id::text FROM items WHERE "itemCode"='TOOL-INS-001'),'TOOL-INS-001','Carbide Insert CNMG 120408','Quarantine'::batch_numbers_status_enum,DATE '2026-06-01','Sandvik',NULL,NULL,false,'Sandvik Coromant',DATE '2026-07-10',DATE '2026-07-18',5,0,0,5,'BOX',2200.00,'INR',1,false,'demo-seed','demo-seed',TIMESTAMP '2026-07-18 10:30:00',TIMESTAMP '2026-07-18 10:30:00');

-- ============================================================================
-- 9. SERIAL NUMBERS (serialised finished goods & assets)
-- ============================================================================
DELETE FROM serial_numbers WHERE "serialNumber" LIKE 'SN-DEMO-%';

INSERT INTO serial_numbers
  ("serialNumber","itemId","itemCode","itemName","warehouseId","warehouseName",status,
   "manufacturingDate","modelNumber","receiptDate",
   "warrantyStartDate","warrantyEndDate","warrantyPeriodMonths","isUnderWarranty",
   "customerName","salesDate","salesPrice","isInstalled","installationDate",
   "isFixedAsset","ownershipType",currency,
   "createdBy","updatedBy","createdAt","updatedAt")
VALUES
  ('SN-DEMO-0001',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',(SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-FG'),'Finished Goods Store','Available'::serial_numbers_status_enum,DATE '2026-06-12','IM-5HP-B3',DATE '2026-06-20',NULL,NULL,NULL,false,NULL,NULL,NULL,false,NULL,false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2026-06-20 10:00:00',TIMESTAMP '2026-06-20 10:00:00'),
  ('SN-DEMO-0002',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',(SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-FG'),'Finished Goods Store','Available'::serial_numbers_status_enum,DATE '2026-06-12','IM-5HP-B3',DATE '2026-06-20',NULL,NULL,NULL,false,NULL,NULL,NULL,false,NULL,false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2026-06-20 10:05:00',TIMESTAMP '2026-06-20 10:05:00'),
  ('SN-DEMO-0003',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',NULL,NULL,'Sold'::serial_numbers_status_enum,DATE '2025-11-08','IM-5HP-B3',DATE '2025-11-18',DATE '2026-01-12',DATE '2027-01-12',12,true,'Harbour Grill Restaurants',DATE '2026-01-12',14800.00,false,NULL,false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2025-11-18 09:30:00',TIMESTAMP '2026-01-12 15:00:00'),
  ('SN-DEMO-0004',(SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',NULL,NULL,'Installed'::serial_numbers_status_enum,DATE '2025-11-08','IM-5HP-B3',DATE '2025-11-18',DATE '2026-03-05',DATE '2027-03-05',12,true,'Blue Fig Hotels Group',DATE '2026-03-05',14800.00,true,DATE '2026-03-20',false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2025-11-18 09:35:00',TIMESTAMP '2026-03-20 12:00:00'),
  ('SN-DEMO-0005',(SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',(SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-FG'),'Finished Goods Store','Available'::serial_numbers_status_enum,DATE '2026-07-02','CP-200',DATE '2026-07-10',NULL,NULL,NULL,false,NULL,NULL,NULL,false,NULL,false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2026-07-10 11:20:00',TIMESTAMP '2026-07-10 11:20:00'),
  ('SN-DEMO-0006',(SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',(SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-MAIN'),'Main Warehouse','Issued'::serial_numbers_status_enum,DATE '2026-02-14','CP-200',DATE '2026-02-22',NULL,NULL,NULL,false,NULL,NULL,NULL,false,NULL,false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2026-02-22 10:10:00',TIMESTAMP '2026-08-11 09:00:00'),
  ('SN-DEMO-0007',(SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',NULL,NULL,'Sold'::serial_numbers_status_enum,DATE '2025-12-01','CP-200',DATE '2025-12-10',DATE '2026-02-02',DATE '2028-02-02',24,true,'Metro Hospital Kitchens',DATE '2026-02-02',9950.00,false,NULL,false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2025-12-10 14:00:00',TIMESTAMP '2026-02-02 16:30:00'),
  ('SN-DEMO-0008',(SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',(SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-FG'),'Finished Goods Store','Available'::serial_numbers_status_enum,DATE '2026-08-05','PG-50',DATE '2026-08-12',NULL,NULL,NULL,false,NULL,NULL,NULL,false,NULL,false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2026-08-12 09:40:00',TIMESTAMP '2026-08-12 09:40:00'),
  ('SN-DEMO-0009',(SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',(SELECT id::text FROM core_warehouses WHERE "warehouseCode"='WH-MAIN'),'Main Warehouse','In Store'::serial_numbers_status_enum,DATE '2026-04-18','PG-50',DATE '2026-04-27',NULL,NULL,NULL,false,NULL,NULL,NULL,false,NULL,false,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2026-04-27 13:15:00',TIMESTAMP '2026-04-27 13:15:00'),
  ('SN-DEMO-0010',(SELECT id::text FROM items WHERE "itemCode"='AST-CNC-001'),'AST-CNC-001','CNC Milling Machine VMC-850',NULL,NULL,'Installed'::serial_numbers_status_enum,DATE '2025-07-30','VMC-850',DATE '2025-10-08',DATE '2025-10-25',DATE '2028-10-25',36,true,NULL,NULL,NULL,true,DATE '2025-10-25',true,'Own','INR','demo-seed','demo-seed',TIMESTAMP '2025-10-08 10:00:00',TIMESTAMP '2025-10-25 17:00:00');
