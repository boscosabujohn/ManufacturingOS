-- Demo seed — Procurement (purchase requisitions, purchase orders, goods receipts) for B3 MACBIS.
-- Coherent procure-to-pay flow over 2025-10-01 .. 2026-09-10:
--   20 PRs -> 24 POs (18 PR-linked, 6 direct) -> 18 GRNs (14 full, 4 partial receipts).
-- NOTE: procurement tables carry no companyId column; idempotency is via the
-- PR-DEMO- / PO-DEMO- / GR-DEMO- number prefixes. Existing rows (e.g. the 3
-- PO-PRJ-* purchase orders) are never touched.
-- Header money fields are derived from line aggregates at the end of this file,
-- so totals are always consistent (18% GST on all lines).
\set company '''b3000000-0000-4000-8000-000000000001'''

-- Real master-data ids (never invent FK UUIDs).
SELECT
  (SELECT id::text FROM vendors WHERE "vendorCode" = 'VND-001') AS v01,
  (SELECT id::text FROM vendors WHERE "vendorCode" = 'VND-002') AS v02,
  (SELECT id::text FROM vendors WHERE "vendorCode" = 'VND-003') AS v03,
  (SELECT id::text FROM vendors WHERE "vendorCode" = 'VND-004') AS v04,
  (SELECT id::text FROM vendors WHERE "vendorCode" = 'VND-005') AS v05,
  (SELECT id::text FROM vendors WHERE "vendorCode" = 'VND-006') AS v06,
  (SELECT id::text FROM vendors WHERE "vendorCode" = 'VND-007') AS v07,
  (SELECT id::text FROM vendors WHERE "vendorCode" = 'VND-008') AS v08,
  (SELECT id::text FROM items WHERE "itemCode" = 'RM-STL-001')  AS i_stl,
  (SELECT id::text FROM items WHERE "itemCode" = 'RM-ALM-001')  AS i_alm,
  (SELECT id::text FROM items WHERE "itemCode" = 'RM-COP-001')  AS i_cop,
  (SELECT id::text FROM items WHERE "itemCode" = 'FG-MTR-001')  AS i_mtr,
  (SELECT id::text FROM items WHERE "itemCode" = 'SP-BRG-001')  AS i_brg,
  (SELECT id::text FROM items WHERE "itemCode" = 'SP-BLT-001')  AS i_blt,
  (SELECT id::text FROM items WHERE "itemCode" = 'SP-SL-001')   AS i_sl,
  (SELECT id::text FROM items WHERE "itemCode" = 'TOOL-DRL-001') AS i_drl,
  (SELECT id::text FROM items WHERE "itemCode" = 'TOOL-INS-001') AS i_ins,
  (SELECT id::text FROM items WHERE "itemCode" = 'CON-CLT-001') AS i_clt,
  (SELECT id::text FROM items WHERE "itemCode" = 'CON-LUB-001') AS i_lub,
  (SELECT id::text FROM items WHERE "itemCode" = 'SVC-MNT-001') AS i_mnt,
  (SELECT id::text FROM items WHERE "itemCode" = 'SVC-CAL-001') AS i_cal
\gset

-- ---------------------------------------------------------------------------
-- Idempotent cleanup (children first, headers by demo prefix).
-- ---------------------------------------------------------------------------
DELETE FROM goods_receipt_items
 WHERE "goodsReceiptId" IN (SELECT id FROM goods_receipts WHERE "grnNumber" LIKE 'GR-DEMO-%');
DELETE FROM goods_receipts WHERE "grnNumber" LIKE 'GR-DEMO-%';
DELETE FROM purchase_order_items
 WHERE "purchaseOrderId" IN (SELECT id FROM purchase_orders WHERE "poNumber" LIKE 'PO-DEMO-%');
DELETE FROM purchase_orders WHERE "poNumber" LIKE 'PO-DEMO-%';
DELETE FROM purchase_requisitions WHERE "prNumber" LIKE 'PR-DEMO-%';

-- ---------------------------------------------------------------------------
-- Purchase requisitions (20).
-- Statuses: 16 Fully Ordered, 1 Partially Ordered, 1 Approved, 1 Submitted, 1 Rejected.
-- ---------------------------------------------------------------------------
INSERT INTO purchase_requisitions
  (id, "prNumber", "prDate", "requiredByDate", status, priority, "prType",
   "requesterId", "requesterName", department, items, "totalAmount", purpose,
   "isApproved", "approvedBy", "approverName", "approvedAt",
   "rejectedBy", "rejectedAt", "rejectionReason",
   "createdBy", "createdAt", "updatedAt")
VALUES
  ('de100000-0000-4000-8000-000000000001','PR-DEMO-0001','2025-10-01','2025-10-25','Fully Ordered','Medium','Standard',
   'EMP-101','Ramesh Iyer','Production',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_stl','itemCode','RM-STL-001','itemName','Steel Sheet 2mm','uom','KG','quantity',1200,'estimatedUnitPrice',85,'estimatedTotal',102000),
     json_build_object('lineNumber',2,'itemId',:'i_alm','itemCode','RM-ALM-001','itemName','Aluminum Rod 20mm','uom','MTR','quantity',300,'estimatedUnitPrice',320,'estimatedTotal',96000)),
   198000,'SS-304 sheets and trim sections for October cooking-range build',
   true,'EMP-301','Rajesh Kumar','2025-10-03 11:00:00',NULL,NULL,NULL,
   'demo-seed','2025-10-01 09:30:00','2025-10-07 10:00:00'),
  ('de100000-0000-4000-8000-000000000002','PR-DEMO-0002','2025-10-13','2025-11-08','Fully Ordered','Medium','Standard',
   'EMP-102','Kavitha Nair','Assembly',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_mtr','itemCode','FG-MTR-001','itemName','Industrial Motor 5HP','uom','PCS','quantity',6,'estimatedUnitPrice',12500,'estimatedTotal',75000),
     json_build_object('lineNumber',2,'itemId',:'i_brg','itemCode','SP-BRG-001','itemName','Ball Bearing 6205','uom','PCS','quantity',40,'estimatedUnitPrice',450,'estimatedTotal',18000)),
   93000,'Compressor drive motors and glass-door hinge bearings for refrigeration line',
   true,'EMP-301','Rajesh Kumar','2025-10-15 11:00:00',NULL,NULL,NULL,
   'demo-seed','2025-10-13 09:30:00','2025-10-21 10:00:00'),
  ('de100000-0000-4000-8000-000000000003','PR-DEMO-0003','2025-10-28','2025-11-22','Fully Ordered','Medium','Standard',
   'EMP-104','Anita Desai','Electrical',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_cop','itemCode','RM-COP-001','itemName','Copper Wire 2.5mm','uom','MTR','quantity',2000,'estimatedUnitPrice',45,'estimatedTotal',90000)),
   90000,'Control panel wiring harness stock for cooking-range control units',
   true,'EMP-301','Rajesh Kumar','2025-10-30 11:00:00',NULL,NULL,NULL,
   'demo-seed','2025-10-28 09:30:00','2025-11-05 10:00:00'),
  ('de100000-0000-4000-8000-000000000004','PR-DEMO-0004','2025-11-10','2025-12-06','Fully Ordered','High','Standard',
   'EMP-103','Suresh Menon','Maintenance',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_clt','itemCode','CON-CLT-001','itemName','Cutting Coolant Concentrate','uom','LTR','quantity',200,'estimatedUnitPrice',220,'estimatedTotal',44000),
     json_build_object('lineNumber',2,'itemId',:'i_lub','itemCode','CON-LUB-001','itemName','Industrial Lubricant Oil ISO VG 68','uom','LTR','quantity',150,'estimatedUnitPrice',180,'estimatedTotal',27000)),
   71000,'Coolant and lubricant replenishment for press shop and machining cell',
   true,'EMP-301','Rajesh Kumar','2025-11-12 11:00:00',NULL,NULL,NULL,
   'demo-seed','2025-11-10 09:30:00','2025-11-18 10:00:00'),
  ('de100000-0000-4000-8000-000000000005','PR-DEMO-0005','2025-11-24','2025-12-20','Rejected','Medium','Standard',
   'EMP-103','Suresh Menon','Maintenance',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_drl','itemCode','TOOL-DRL-001','itemName','HSS Drill Bit Set 1-13mm','uom','SET','quantity',10,'estimatedUnitPrice',1800,'estimatedTotal',18000),
     json_build_object('lineNumber',2,'itemId',:'i_ins','itemCode','TOOL-INS-001','itemName','Carbide Insert CNMG 120408','uom','BOX','quantity',20,'estimatedUnitPrice',2200,'estimatedTotal',44000)),
   62000,'Additional tooling for CNC cell expansion',
   false,NULL,NULL,NULL,'EMP-301','2025-11-27 15:00:00','FY26 tooling budget exhausted; re-raise in Q4 with revised quantities',
   'demo-seed','2025-11-24 09:30:00','2025-11-27 15:00:00'),
  ('de100000-0000-4000-8000-000000000006','PR-DEMO-0006','2025-12-08','2026-01-07','Fully Ordered','Medium','Standard',
   'EMP-101','Ramesh Iyer','Production',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_drl','itemCode','TOOL-DRL-001','itemName','HSS Drill Bit Set 1-13mm','uom','SET','quantity',5,'estimatedUnitPrice',1800,'estimatedTotal',9000),
     json_build_object('lineNumber',2,'itemId',:'i_ins','itemCode','TOOL-INS-001','itemName','Carbide Insert CNMG 120408','uom','BOX','quantity',10,'estimatedUnitPrice',2200,'estimatedTotal',22000)),
   31000,'Tooling replenishment for fabrication shop',
   true,'EMP-301','Rajesh Kumar','2025-12-10 11:00:00',NULL,NULL,NULL,
   'demo-seed','2025-12-08 09:30:00','2025-12-16 10:00:00'),
  ('de100000-0000-4000-8000-000000000007','PR-DEMO-0007','2025-12-30','2026-01-24','Fully Ordered','Medium','Standard',
   'EMP-102','Kavitha Nair','Assembly',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_sl','itemCode','SP-SL-001','itemName','Mechanical Seal MS-40','uom','PCS','quantity',60,'estimatedUnitPrice',1200,'estimatedTotal',72000)),
   72000,'Door gasket seals for insulated cabinet line',
   true,'EMP-301','Rajesh Kumar','2026-01-02 11:00:00',NULL,NULL,NULL,
   'demo-seed','2025-12-30 09:30:00','2026-01-08 10:00:00'),
  ('de100000-0000-4000-8000-000000000008','PR-DEMO-0008','2026-01-14','2026-09-30','Fully Ordered','Medium','Blanket',
   'EMP-101','Ramesh Iyer','Production',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_stl','itemCode','RM-STL-001','itemName','Steel Sheet 2mm','uom','KG','quantity',3600,'estimatedUnitPrice',86,'estimatedTotal',309600),
     json_build_object('lineNumber',2,'itemId',:'i_alm','itemCode','RM-ALM-001','itemName','Aluminum Rod 20mm','uom','MTR','quantity',200,'estimatedUnitPrice',315,'estimatedTotal',63000)),
   372600,'Blanket requisition — SS sheet and rod call-offs for FY26 production plan',
   true,'EMP-301','Rajesh Kumar','2026-01-16 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-01-14 09:30:00','2026-07-02 10:00:00'),
  ('de100000-0000-4000-8000-000000000009','PR-DEMO-0009','2026-01-28','2026-02-28','Fully Ordered','Medium','Service',
   'EMP-103','Suresh Menon','Maintenance',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_mnt','itemCode','SVC-MNT-001','itemName','Preventive Maintenance Service','uom','PCS','quantity',4,'estimatedUnitPrice',5000,'estimatedTotal',20000)),
   20000,'Quarterly preventive maintenance — press shop and welding bays',
   true,'EMP-301','Rajesh Kumar','2026-01-30 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-01-28 09:30:00','2026-02-05 10:00:00'),
  ('de100000-0000-4000-8000-000000000010','PR-DEMO-0010','2026-02-11','2026-03-11','Fully Ordered','Medium','Standard',
   'EMP-102','Kavitha Nair','Assembly',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_mtr','itemCode','FG-MTR-001','itemName','Industrial Motor 5HP','uom','PCS','quantity',8,'estimatedUnitPrice',12250,'estimatedTotal',98000),
     json_build_object('lineNumber',2,'itemId',:'i_blt','itemCode','SP-BLT-001','itemName','V-Belt A68','uom','PCS','quantity',50,'estimatedUnitPrice',280,'estimatedTotal',14000)),
   112000,'Compressor motors and drive belts for March refrigeration build',
   true,'EMP-301','Rajesh Kumar','2026-02-13 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-02-11 09:30:00','2026-02-19 10:00:00'),
  ('de100000-0000-4000-8000-000000000011','PR-DEMO-0011','2026-02-25','2026-03-25','Fully Ordered','Medium','Standard',
   'EMP-104','Anita Desai','Electrical',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_cop','itemCode','RM-COP-001','itemName','Copper Wire 2.5mm','uom','MTR','quantity',2500,'estimatedUnitPrice',44,'estimatedTotal',110000)),
   110000,'Panel wiring for banquet kitchen order backlog',
   true,'EMP-301','Rajesh Kumar','2026-02-27 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-02-25 09:30:00','2026-03-05 10:00:00'),
  ('de100000-0000-4000-8000-000000000012','PR-DEMO-0012','2026-03-11','2026-04-08','Fully Ordered','Medium','Standard',
   'EMP-101','Ramesh Iyer','Production',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_stl','itemCode','RM-STL-001','itemName','Steel Sheet 2mm','uom','KG','quantity',1800,'estimatedUnitPrice',85,'estimatedTotal',153000),
     json_build_object('lineNumber',2,'itemId',:'i_alm','itemCode','RM-ALM-001','itemName','Aluminum Rod 20mm','uom','MTR','quantity',400,'estimatedUnitPrice',318,'estimatedTotal',127200)),
   280200,'Sheet and rod stock for counter fabrication',
   true,'EMP-301','Rajesh Kumar','2026-03-13 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-03-11 09:30:00','2026-03-19 10:00:00'),
  ('de100000-0000-4000-8000-000000000013','PR-DEMO-0013','2026-04-01','2026-04-29','Fully Ordered','Low','Standard',
   'EMP-103','Suresh Menon','Maintenance',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_clt','itemCode','CON-CLT-001','itemName','Cutting Coolant Concentrate','uom','LTR','quantity',250,'estimatedUnitPrice',225,'estimatedTotal',56250)),
   56250,'Coolant top-up for machining cell',
   true,'EMP-301','Rajesh Kumar','2026-04-03 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-04-01 09:30:00','2026-04-09 10:00:00'),
  ('de100000-0000-4000-8000-000000000014','PR-DEMO-0014','2026-04-15','2026-05-13','Fully Ordered','Medium','Standard',
   'EMP-101','Ramesh Iyer','Production',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_stl','itemCode','RM-STL-001','itemName','Steel Sheet 2mm','uom','KG','quantity',2200,'estimatedUnitPrice',87,'estimatedTotal',191400)),
   191400,'SS sheets for display counter order',
   true,'EMP-301','Rajesh Kumar','2026-04-17 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-04-15 09:30:00','2026-04-23 10:00:00'),
  ('de100000-0000-4000-8000-000000000015','PR-DEMO-0015','2026-04-29','2026-06-02','Fully Ordered','Urgent','Standard',
   'EMP-102','Kavitha Nair','Assembly',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_mtr','itemCode','FG-MTR-001','itemName','Industrial Motor 5HP','uom','PCS','quantity',10,'estimatedUnitPrice',12400,'estimatedTotal',124000),
     json_build_object('lineNumber',2,'itemId',:'i_brg','itemCode','SP-BRG-001','itemName','Ball Bearing 6205','uom','PCS','quantity',60,'estimatedUnitPrice',455,'estimatedTotal',27300)),
   151300,'Urgent — compressor motor shortage on refrigeration line',
   true,'EMP-301','Rajesh Kumar','2026-04-30 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-04-29 09:30:00','2026-05-07 10:00:00'),
  ('de100000-0000-4000-8000-000000000016','PR-DEMO-0016','2026-05-13','2026-06-13','Fully Ordered','Medium','Standard',
   'EMP-101','Ramesh Iyer','Production',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_ins','itemCode','TOOL-INS-001','itemName','Carbide Insert CNMG 120408','uom','BOX','quantity',20,'estimatedUnitPrice',2150,'estimatedTotal',43000)),
   43000,'Carbide inserts for CNC cell',
   true,'EMP-301','Rajesh Kumar','2026-05-15 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-05-13 09:30:00','2026-05-21 10:00:00'),
  ('de100000-0000-4000-8000-000000000017','PR-DEMO-0017','2026-05-27','2026-06-27','Fully Ordered','Medium','Standard',
   'EMP-102','Kavitha Nair','Assembly',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_sl','itemCode','SP-SL-001','itemName','Mechanical Seal MS-40','uom','PCS','quantity',80,'estimatedUnitPrice',1180,'estimatedTotal',94400)),
   94400,'Gasket seals for glass-door chiller batch',
   true,'EMP-301','Rajesh Kumar','2026-05-29 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-05-27 09:30:00','2026-06-04 10:00:00'),
  ('de100000-0000-4000-8000-000000000018','PR-DEMO-0018','2026-06-10','2026-07-16','Partially Ordered','High','Standard',
   'EMP-101','Ramesh Iyer','Production',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_stl','itemCode','RM-STL-001','itemName','Steel Sheet 2mm','uom','KG','quantity',4000,'estimatedUnitPrice',86,'estimatedTotal',344000)),
   344000,'SS sheets for Q3 export order — phased delivery, first call-off ordered',
   true,'EMP-301','Rajesh Kumar','2026-06-12 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-06-10 09:30:00','2026-06-18 10:00:00'),
  ('de100000-0000-4000-8000-000000000019','PR-DEMO-0019','2026-08-20','2026-10-01','Approved','Medium','Standard',
   'EMP-102','Kavitha Nair','Assembly',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_mtr','itemCode','FG-MTR-001','itemName','Industrial Motor 5HP','uom','PCS','quantity',4,'estimatedUnitPrice',12500,'estimatedTotal',50000)),
   50000,'Compressor motors for October refrigeration build — awaiting PO',
   true,'EMP-301','Rajesh Kumar','2026-08-24 11:00:00',NULL,NULL,NULL,
   'demo-seed','2026-08-20 09:30:00','2026-08-24 11:00:00'),
  ('de100000-0000-4000-8000-000000000020','PR-DEMO-0020','2026-09-02','2026-10-10','Submitted','Medium','Standard',
   'EMP-104','Anita Desai','Electrical',
   json_build_array(
     json_build_object('lineNumber',1,'itemId',:'i_sl','itemCode','SP-SL-001','itemName','Mechanical Seal MS-40','uom','PCS','quantity',100,'estimatedUnitPrice',1180,'estimatedTotal',118000)),
   118000,'Gasket seals — glass-door retrofit program, pending approval',
   false,NULL,NULL,NULL,NULL,NULL,NULL,
   'demo-seed','2026-09-02 09:30:00','2026-09-02 09:30:00');

-- ---------------------------------------------------------------------------
-- Purchase orders (24). Money fields are filled from line aggregates below.
-- Statuses: 10 Closed, 4 Fully Received, 4 Partially Received, 3 Approved,
--           2 In Progress, 1 Submitted.
-- ---------------------------------------------------------------------------
INSERT INTO purchase_orders
  (id, "poNumber", "poDate", "deliveryDate", status, "poType", "prNumber", "prId",
   "vendorId", "vendorName", "vendorCode",
   "deliveryAddress", "deliveryLocation", "paymentTerms",
   "buyerId", "buyerName", department,
   "isApproved", "approvedBy", "approverName", "approvedAt",
   "createdBy", "createdAt", "updatedAt")
VALUES
  ('de200000-0000-4000-8000-000000000001','PO-DEMO-0001','2025-10-07','2025-10-24','Closed','Standard','PR-DEMO-0001','de100000-0000-4000-8000-000000000001',
   :'v01','Prime Steel Suppliers','VND-001','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2025-10-08 11:00:00','demo-seed','2025-10-07 10:00:00','2025-10-27 10:00:00'),
  ('de200000-0000-4000-8000-000000000002','PO-DEMO-0002','2025-10-21','2025-11-07','Closed','Standard','PR-DEMO-0002','de100000-0000-4000-8000-000000000002',
   :'v02','Industrial Components Ltd.','VND-002','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 45',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2025-10-22 11:00:00','demo-seed','2025-10-21 10:00:00','2025-11-10 10:00:00'),
  ('de200000-0000-4000-8000-000000000003','PO-DEMO-0003','2025-11-05','2025-11-21','Closed','Standard','PR-DEMO-0003','de100000-0000-4000-8000-000000000003',
   :'v03','ElectroTech Supplies','VND-003','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2025-11-06 11:00:00','demo-seed','2025-11-05 10:00:00','2025-11-24 10:00:00'),
  ('de200000-0000-4000-8000-000000000004','PO-DEMO-0004','2025-11-18','2025-12-05','Closed','Standard','PR-DEMO-0004','de100000-0000-4000-8000-000000000004',
   :'v08','Chemical Solutions GmbH','VND-008','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 60',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2025-11-19 11:00:00','demo-seed','2025-11-18 10:00:00','2025-12-08 10:00:00'),
  ('de200000-0000-4000-8000-000000000005','PO-DEMO-0005','2025-12-03','2025-12-19','Closed','Standard',NULL,NULL,
   :'v04','Bharat Metal Works Pvt. Ltd.','VND-004','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2025-12-04 11:00:00','demo-seed','2025-12-03 10:00:00','2025-12-22 10:00:00'),
  ('de200000-0000-4000-8000-000000000006','PO-DEMO-0006','2025-12-16','2026-01-06','Closed','Standard','PR-DEMO-0006','de100000-0000-4000-8000-000000000006',
   :'v05','ProTool Equipment Inc.','VND-005','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 15',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2025-12-17 11:00:00','demo-seed','2025-12-16 10:00:00','2026-01-09 10:00:00'),
  ('de200000-0000-4000-8000-000000000007','PO-DEMO-0007','2026-01-08','2026-01-23','Closed','Standard','PR-DEMO-0007','de100000-0000-4000-8000-000000000007',
   :'v06','PackRight Solutions','VND-006','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-01-09 11:00:00','demo-seed','2026-01-08 10:00:00','2026-01-26 10:00:00'),
  ('de200000-0000-4000-8000-000000000008','PO-DEMO-0008','2026-01-22','2026-02-10','Closed','Blanket','PR-DEMO-0008','de100000-0000-4000-8000-000000000008',
   :'v01','Prime Steel Suppliers','VND-001','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-01-23 11:00:00','demo-seed','2026-01-22 10:00:00','2026-02-13 10:00:00'),
  ('de200000-0000-4000-8000-000000000009','PO-DEMO-0009','2026-02-05','2026-02-27','Closed','Service','PR-DEMO-0009','de100000-0000-4000-8000-000000000009',
   :'v07','MaintainPro Services','VND-007','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 15',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2026-02-06 11:00:00','demo-seed','2026-02-05 10:00:00','2026-03-02 10:00:00'),
  ('de200000-0000-4000-8000-000000000010','PO-DEMO-0010','2026-02-19','2026-03-10','Closed','Standard','PR-DEMO-0010','de100000-0000-4000-8000-000000000010',
   :'v02','Industrial Components Ltd.','VND-002','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 45',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2026-02-20 11:00:00','demo-seed','2026-02-19 10:00:00','2026-03-13 10:00:00'),
  ('de200000-0000-4000-8000-000000000011','PO-DEMO-0011','2026-03-05','2026-03-24','Fully Received','Standard','PR-DEMO-0011','de100000-0000-4000-8000-000000000011',
   :'v03','ElectroTech Supplies','VND-003','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-03-06 11:00:00','demo-seed','2026-03-05 10:00:00','2026-03-23 15:00:00'),
  ('de200000-0000-4000-8000-000000000012','PO-DEMO-0012','2026-03-19','2026-04-07','Fully Received','Standard','PR-DEMO-0012','de100000-0000-4000-8000-000000000012',
   :'v04','Bharat Metal Works Pvt. Ltd.','VND-004','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-03-20 11:00:00','demo-seed','2026-03-19 10:00:00','2026-04-06 15:00:00'),
  ('de200000-0000-4000-8000-000000000013','PO-DEMO-0013','2026-04-09','2026-04-28','Fully Received','Standard','PR-DEMO-0013','de100000-0000-4000-8000-000000000013',
   :'v08','Chemical Solutions GmbH','VND-008','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 60',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2026-04-10 11:00:00','demo-seed','2026-04-09 10:00:00','2026-04-27 15:00:00'),
  ('de200000-0000-4000-8000-000000000014','PO-DEMO-0014','2026-04-23','2026-05-12','Fully Received','Standard','PR-DEMO-0014','de100000-0000-4000-8000-000000000014',
   :'v01','Prime Steel Suppliers','VND-001','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-04-24 11:00:00','demo-seed','2026-04-23 10:00:00','2026-05-11 15:00:00'),
  ('de200000-0000-4000-8000-000000000015','PO-DEMO-0015','2026-05-07','2026-06-01','Partially Received','Standard','PR-DEMO-0015','de100000-0000-4000-8000-000000000015',
   :'v02','Industrial Components Ltd.','VND-002','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 45',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2026-05-08 11:00:00','demo-seed','2026-05-07 10:00:00','2026-06-01 15:00:00'),
  ('de200000-0000-4000-8000-000000000016','PO-DEMO-0016','2026-05-21','2026-06-12','Partially Received','Standard','PR-DEMO-0016','de100000-0000-4000-8000-000000000016',
   :'v05','ProTool Equipment Inc.','VND-005','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 15',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2026-05-22 11:00:00','demo-seed','2026-05-21 10:00:00','2026-06-11 15:00:00'),
  ('de200000-0000-4000-8000-000000000017','PO-DEMO-0017','2026-06-04','2026-06-26','Partially Received','Standard','PR-DEMO-0017','de100000-0000-4000-8000-000000000017',
   :'v06','PackRight Solutions','VND-006','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-06-05 11:00:00','demo-seed','2026-06-04 10:00:00','2026-06-25 15:00:00'),
  ('de200000-0000-4000-8000-000000000018','PO-DEMO-0018','2026-06-18','2026-07-15','Partially Received','Standard','PR-DEMO-0018','de100000-0000-4000-8000-000000000018',
   :'v04','Bharat Metal Works Pvt. Ltd.','VND-004','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-06-19 11:00:00','demo-seed','2026-06-18 10:00:00','2026-07-14 15:00:00'),
  ('de200000-0000-4000-8000-000000000019','PO-DEMO-0019','2026-07-02','2026-09-20','Approved','Blanket','PR-DEMO-0008','de100000-0000-4000-8000-000000000008',
   :'v01','Prime Steel Suppliers','VND-001','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-07-03 11:00:00','demo-seed','2026-07-02 10:00:00','2026-07-03 11:00:00'),
  ('de200000-0000-4000-8000-000000000020','PO-DEMO-0020','2026-07-16','2026-09-25','Approved','Standard',NULL,NULL,
   :'v03','ElectroTech Supplies','VND-003','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 30',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-07-17 11:00:00','demo-seed','2026-07-16 10:00:00','2026-07-17 11:00:00'),
  ('de200000-0000-4000-8000-000000000021','PO-DEMO-0021','2026-07-30','2026-09-15','In Progress','Service',NULL,NULL,
   :'v07','MaintainPro Services','VND-007','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 15',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2026-07-31 11:00:00','demo-seed','2026-07-30 10:00:00','2026-08-15 10:00:00'),
  ('de200000-0000-4000-8000-000000000022','PO-DEMO-0022','2026-08-13','2026-09-30','In Progress','Standard',NULL,NULL,
   :'v02','Industrial Components Ltd.','VND-002','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 45',
   'EMP-202','Meera Krishnan','Procurement',true,'EMP-301','Rajesh Kumar','2026-08-14 11:00:00','demo-seed','2026-08-13 10:00:00','2026-08-20 10:00:00'),
  ('de200000-0000-4000-8000-000000000023','PO-DEMO-0023','2026-08-27','2026-10-05','Approved','Standard',NULL,NULL,
   :'v08','Chemical Solutions GmbH','VND-008','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 60',
   'EMP-201','Vikram Singh','Procurement',true,'EMP-301','Rajesh Kumar','2026-08-28 11:00:00','demo-seed','2026-08-27 10:00:00','2026-08-28 11:00:00'),
  ('de200000-0000-4000-8000-000000000024','PO-DEMO-0024','2026-09-05','2026-10-12','Submitted','Standard',NULL,NULL,
   :'v05','ProTool Equipment Inc.','VND-005','B3 MACBIS Plant, SIDCO Industrial Estate, Coimbatore 641021, Tamil Nadu','B3 Main Stores','Net 15',
   'EMP-202','Meera Krishnan','Procurement',false,NULL,NULL,NULL,'demo-seed','2026-09-05 10:00:00','2026-09-05 10:00:00');

-- ---------------------------------------------------------------------------
-- Purchase order items (32 lines). lineTotal/tax/total computed at 18% GST;
-- pendingQuantity = ordered - received.
-- ---------------------------------------------------------------------------
INSERT INTO purchase_order_items
  (id, "purchaseOrderId", "lineNumber", status, "itemId", "itemCode", "itemName",
   description, uom, "orderedQuantity", "receivedQuantity", "pendingQuantity",
   "rejectedQuantity", "acceptedQuantity", "unitPrice", "netUnitPrice",
   "lineTotal", "taxRate", "taxAmount", "totalAmount", "requiredDate",
   "createdBy", "createdAt", "updatedAt")
SELECT v.id::uuid, v.poid::uuid, v.ln, v.st::purchase_order_items_status_enum,
       v.itemid, v.code, v.nm, v.descr, v.uom,
       v.qty, v.recv, v.qty - v.recv, v.rej, v.acc,
       v.pr, v.pr, round(v.qty * v.pr, 2), 18,
       round(v.qty * v.pr * 0.18, 2), round(v.qty * v.pr * 1.18, 2),
       v.reqd::date, 'demo-seed', v.ts::timestamp, v.ts::timestamp
FROM (VALUES
  ('de300000-0000-4000-8000-000000000101','de200000-0000-4000-8000-000000000001',1,'Fully Received',:'i_stl','RM-STL-001','Steel Sheet 2mm','SS-304 sheets — cooking range and counter bodies','KG',1200::numeric,1200::numeric,0::numeric,1200::numeric,85.00::numeric,'2025-10-24','2025-10-07 10:00:00'),
  ('de300000-0000-4000-8000-000000000102','de200000-0000-4000-8000-000000000001',2,'Fully Received',:'i_alm','RM-ALM-001','Aluminum Rod 20mm','Trim and frame sections','MTR',300,300,0,300,320.00,'2025-10-24','2025-10-07 10:00:00'),
  ('de300000-0000-4000-8000-000000000201','de200000-0000-4000-8000-000000000002',1,'Fully Received',:'i_mtr','FG-MTR-001','Industrial Motor 5HP','Compressor drive motors — refrigeration line','PCS',6,6,0,6,12500.00,'2025-11-07','2025-10-21 10:00:00'),
  ('de300000-0000-4000-8000-000000000202','de200000-0000-4000-8000-000000000002',2,'Fully Received',:'i_brg','SP-BRG-001','Ball Bearing 6205','Glass-door hinge and fan bearings','PCS',40,40,0,40,450.00,'2025-11-07','2025-10-21 10:00:00'),
  ('de300000-0000-4000-8000-000000000301','de200000-0000-4000-8000-000000000003',1,'Fully Received',:'i_cop','RM-COP-001','Copper Wire 2.5mm','Control panel wiring harness','MTR',2000,2000,0,2000,45.00,'2025-11-21','2025-11-05 10:00:00'),
  ('de300000-0000-4000-8000-000000000401','de200000-0000-4000-8000-000000000004',1,'Fully Received',:'i_clt','CON-CLT-001','Cutting Coolant Concentrate','Press shop coolant replenishment','LTR',200,200,0,200,220.00,'2025-12-05','2025-11-18 10:00:00'),
  ('de300000-0000-4000-8000-000000000402','de200000-0000-4000-8000-000000000004',2,'Fully Received',:'i_lub','CON-LUB-001','Industrial Lubricant Oil ISO VG 68','Machine lubrication stock','LTR',150,150,0,150,180.00,'2025-12-05','2025-11-18 10:00:00'),
  ('de300000-0000-4000-8000-000000000501','de200000-0000-4000-8000-000000000005',1,'Fully Received',:'i_stl','RM-STL-001','Steel Sheet 2mm','SS sheets — burner assembly deck plates','KG',1500,1500,0,1500,84.00,'2025-12-19','2025-12-03 10:00:00'),
  ('de300000-0000-4000-8000-000000000601','de200000-0000-4000-8000-000000000006',1,'Fully Received',:'i_drl','TOOL-DRL-001','HSS Drill Bit Set 1-13mm','Fabrication shop tooling','SET',5,5,0,5,1800.00,'2026-01-06','2025-12-16 10:00:00'),
  ('de300000-0000-4000-8000-000000000602','de200000-0000-4000-8000-000000000006',2,'Fully Received',:'i_ins','TOOL-INS-001','Carbide Insert CNMG 120408','CNC cell inserts','BOX',10,10,0,10,2200.00,'2026-01-06','2025-12-16 10:00:00'),
  ('de300000-0000-4000-8000-000000000701','de200000-0000-4000-8000-000000000007',1,'Fully Received',:'i_sl','SP-SL-001','Mechanical Seal MS-40','Door gasket seals — insulated cabinets','PCS',60,60,0,60,1200.00,'2026-01-23','2026-01-08 10:00:00'),
  ('de300000-0000-4000-8000-000000000801','de200000-0000-4000-8000-000000000008',1,'Fully Received',:'i_stl','RM-STL-001','Steel Sheet 2mm','Blanket call-off 1 — SS-304 sheets','KG',2000,2000,0,2000,86.00,'2026-02-10','2026-01-22 10:00:00'),
  ('de300000-0000-4000-8000-000000000802','de200000-0000-4000-8000-000000000008',2,'Fully Received',:'i_alm','RM-ALM-001','Aluminum Rod 20mm','Blanket call-off 1 — trim rod','MTR',200,200,0,200,315.00,'2026-02-10','2026-01-22 10:00:00'),
  ('de300000-0000-4000-8000-000000000901','de200000-0000-4000-8000-000000000009',1,'Fully Received',:'i_mnt','SVC-MNT-001','Preventive Maintenance Service','Quarterly PM — press shop and welding bays','PCS',4,4,0,4,5000.00,'2026-02-27','2026-02-05 10:00:00'),
  ('de300000-0000-4000-8000-000000001001','de200000-0000-4000-8000-000000000010',1,'Fully Received',:'i_mtr','FG-MTR-001','Industrial Motor 5HP','Compressor drive motors — March build','PCS',8,8,0,8,12250.00,'2026-03-10','2026-02-19 10:00:00'),
  ('de300000-0000-4000-8000-000000001002','de200000-0000-4000-8000-000000000010',2,'Fully Received',:'i_blt','SP-BLT-001','V-Belt A68','Drive belts for exhaust hoods','PCS',50,50,0,50,280.00,'2026-03-10','2026-02-19 10:00:00'),
  ('de300000-0000-4000-8000-000000001101','de200000-0000-4000-8000-000000000011',1,'Fully Received',:'i_cop','RM-COP-001','Copper Wire 2.5mm','Panel wiring — banquet kitchen backlog','MTR',2500,2500,0,2500,44.00,'2026-03-24','2026-03-05 10:00:00'),
  ('de300000-0000-4000-8000-000000001201','de200000-0000-4000-8000-000000000012',1,'Fully Received',:'i_stl','RM-STL-001','Steel Sheet 2mm','SS-304 sheets — 30 kg rejected (surface scratches)','KG',1800,1800,30,1770,85.00,'2026-04-07','2026-03-19 10:00:00'),
  ('de300000-0000-4000-8000-000000001202','de200000-0000-4000-8000-000000000012',2,'Fully Received',:'i_alm','RM-ALM-001','Aluminum Rod 20mm','Counter frame rod stock','MTR',400,400,0,400,318.00,'2026-04-07','2026-03-19 10:00:00'),
  ('de300000-0000-4000-8000-000000001301','de200000-0000-4000-8000-000000000013',1,'Fully Received',:'i_clt','CON-CLT-001','Cutting Coolant Concentrate','Machining cell coolant top-up','LTR',250,250,0,250,225.00,'2026-04-28','2026-04-09 10:00:00'),
  ('de300000-0000-4000-8000-000000001401','de200000-0000-4000-8000-000000000014',1,'Fully Received',:'i_stl','RM-STL-001','Steel Sheet 2mm','SS sheets — display counter order','KG',2200,2200,0,2200,87.00,'2026-05-12','2026-04-23 10:00:00'),
  ('de300000-0000-4000-8000-000000001501','de200000-0000-4000-8000-000000000015',1,'Partially Received',:'i_mtr','FG-MTR-001','Industrial Motor 5HP','Compressor motors — 6 of 10 received, balance promised','PCS',10,6,0,6,12400.00,'2026-06-01','2026-05-07 10:00:00'),
  ('de300000-0000-4000-8000-000000001502','de200000-0000-4000-8000-000000000015',2,'Fully Received',:'i_brg','SP-BRG-001','Ball Bearing 6205','Fan and hinge bearings','PCS',60,60,0,60,455.00,'2026-06-01','2026-05-07 10:00:00'),
  ('de300000-0000-4000-8000-000000001601','de200000-0000-4000-8000-000000000016',1,'Partially Received',:'i_ins','TOOL-INS-001','Carbide Insert CNMG 120408','CNC inserts — 12 of 20 boxes received','BOX',20,12,0,12,2150.00,'2026-06-12','2026-05-21 10:00:00'),
  ('de300000-0000-4000-8000-000000001701','de200000-0000-4000-8000-000000000017',1,'Partially Received',:'i_sl','SP-SL-001','Mechanical Seal MS-40','Gasket seals — 50 of 80 received, under inspection','PCS',80,50,0,0,1180.00,'2026-06-26','2026-06-04 10:00:00'),
  ('de300000-0000-4000-8000-000000001801','de200000-0000-4000-8000-000000000018',1,'Partially Received',:'i_stl','RM-STL-001','Steel Sheet 2mm','Q3 export order — first phase 1500 kg received','KG',2500,1500,0,1500,86.00,'2026-07-15','2026-06-18 10:00:00'),
  ('de300000-0000-4000-8000-000000001901','de200000-0000-4000-8000-000000000019',1,'Pending',:'i_stl','RM-STL-001','Steel Sheet 2mm','Blanket call-off 2 — SS-304 sheets','KG',1600,0,0,0,88.00,'2026-09-20','2026-07-02 10:00:00'),
  ('de300000-0000-4000-8000-000000002001','de200000-0000-4000-8000-000000000020',1,'Pending',:'i_cop','RM-COP-001','Copper Wire 2.5mm','Panel wiring stock for Q4','MTR',3000,0,0,0,43.00,'2026-09-25','2026-07-16 10:00:00'),
  ('de300000-0000-4000-8000-000000002101','de200000-0000-4000-8000-000000000021',1,'In Progress',:'i_cal','SVC-CAL-001','Instrument Calibration Service','Annual calibration — QC lab instruments','PCS',6,0,0,0,2500.00,'2026-09-15','2026-07-30 10:00:00'),
  ('de300000-0000-4000-8000-000000002201','de200000-0000-4000-8000-000000000022',1,'In Progress',:'i_mtr','FG-MTR-001','Industrial Motor 5HP','Compressor motors — September build','PCS',5,0,0,0,12600.00,'2026-09-30','2026-08-13 10:00:00'),
  ('de300000-0000-4000-8000-000000002202','de200000-0000-4000-8000-000000000022',2,'In Progress',:'i_blt','SP-BLT-001','V-Belt A68','Drive belts — exhaust hood line','PCS',40,0,0,0,285.00,'2026-09-30','2026-08-13 10:00:00'),
  ('de300000-0000-4000-8000-000000002301','de200000-0000-4000-8000-000000000023',1,'Pending',:'i_lub','CON-LUB-001','Industrial Lubricant Oil ISO VG 68','Lubricant stock for H2','LTR',200,0,0,0,185.00,'2026-10-05','2026-08-27 10:00:00'),
  ('de300000-0000-4000-8000-000000002401','de200000-0000-4000-8000-000000000024',1,'Pending',:'i_drl','TOOL-DRL-001','HSS Drill Bit Set 1-13mm','Drill sets — pending PO approval','SET',8,0,0,0,1850.00,'2026-10-12','2026-09-05 10:00:00')
) AS v(id, poid, ln, st, itemid, code, nm, descr, uom, qty, recv, rej, acc, pr, reqd, ts);

-- Derive PO header money from line aggregates (subtotal + 18% tax; balance = total).
UPDATE purchase_orders po SET
  subtotal          = agg.sub,
  "taxAmount"       = agg.tax,
  "totalAmount"     = agg.tot,
  "balanceAmount"   = agg.tot,
  "receivedAmount"  = agg.recv,
  "receivedPercentage" = CASE WHEN agg.sub > 0 THEN round(agg.recv / agg.sub * 100, 2) ELSE 0 END
FROM (
  SELECT "purchaseOrderId" AS pid,
         SUM("lineTotal") AS sub,
         SUM("taxAmount") AS tax,
         SUM("totalAmount") AS tot,
         SUM(round("receivedQuantity" * "netUnitPrice", 2)) AS recv
  FROM purchase_order_items
  WHERE "purchaseOrderId" IN (SELECT id FROM purchase_orders WHERE "poNumber" LIKE 'PO-DEMO-%')
  GROUP BY 1
) agg
WHERE po.id = agg.pid AND po."poNumber" LIKE 'PO-DEMO-%';

-- ---------------------------------------------------------------------------
-- Goods receipts (18): GR-01..14 full receipts for PO-01..14, GR-15..18 partial
-- receipts for PO-15..18. Money fields derived from lines below.
-- ---------------------------------------------------------------------------
INSERT INTO goods_receipts
  (id, "grnNumber", "grnDate", "receiptDateTime", status, "grnType",
   "purchaseOrderId", "purchaseOrderNumber", "purchaseOrderDate",
   "vendorId", "vendorName", "vendorCode", "deliveryNoteNumber", "vehicleNumber",
   "warehouseId", "warehouseName", "receivedBy", "receivedByName",
   "inspectedBy", "inspectedByName", "inspectionDateTime",
   "requiresQualityCheck", "qualityCheckCompleted", "qualityCheckPassed",
   "isPostedToInventory", "inventoryPostedAt", "inventoryPostedBy",
   "createdBy", "createdAt", "updatedAt")
VALUES
  ('de400000-0000-4000-8000-000000000001','GR-DEMO-0001','2025-10-23','2025-10-23 11:15:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000001','PO-DEMO-0001','2025-10-07',:'v01','Prime Steel Suppliers','VND-001','DN-PSS-4471','TN-38-AB-1234',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2025-10-23 14:00:00',
   true,true,true,true,'2025-10-24 10:00:00','EMP-401','demo-seed','2025-10-23 11:15:00','2025-10-24 10:00:00'),
  ('de400000-0000-4000-8000-000000000002','GR-DEMO-0002','2025-11-06','2025-11-06 10:40:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000002','PO-DEMO-0002','2025-10-21',:'v02','Industrial Components Ltd.','VND-002','DN-ICL-2210','TN-38-CD-5678',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2025-11-06 13:30:00',
   true,true,true,true,'2025-11-07 10:00:00','EMP-401','demo-seed','2025-11-06 10:40:00','2025-11-07 10:00:00'),
  ('de400000-0000-4000-8000-000000000003','GR-DEMO-0003','2025-11-20','2025-11-20 12:05:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000003','PO-DEMO-0003','2025-11-05',:'v03','ElectroTech Supplies','VND-003','DN-ETS-8834',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2025-11-20 15:00:00',
   true,true,true,true,'2025-11-21 10:00:00','EMP-401','demo-seed','2025-11-20 12:05:00','2025-11-21 10:00:00'),
  ('de400000-0000-4000-8000-000000000004','GR-DEMO-0004','2025-12-04','2025-12-04 09:50:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000004','PO-DEMO-0004','2025-11-18',:'v08','Chemical Solutions GmbH','VND-008','DN-CSG-1187',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das',NULL,NULL,NULL,
   false,false,false,true,'2025-12-05 10:00:00','EMP-401','demo-seed','2025-12-04 09:50:00','2025-12-05 10:00:00'),
  ('de400000-0000-4000-8000-000000000005','GR-DEMO-0005','2025-12-18','2025-12-18 11:30:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000005','PO-DEMO-0005','2025-12-03',:'v04','Bharat Metal Works Pvt. Ltd.','VND-004','DN-BMW-6642','TN-38-EF-9012',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2025-12-18 14:30:00',
   true,true,true,true,'2025-12-19 10:00:00','EMP-401','demo-seed','2025-12-18 11:30:00','2025-12-19 10:00:00'),
  ('de400000-0000-4000-8000-000000000006','GR-DEMO-0006','2026-01-05','2026-01-05 10:20:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000006','PO-DEMO-0006','2025-12-16',:'v05','ProTool Equipment Inc.','VND-005','DN-PTE-3319',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das',NULL,NULL,NULL,
   false,false,false,true,'2026-01-06 10:00:00','EMP-401','demo-seed','2026-01-05 10:20:00','2026-01-06 10:00:00'),
  ('de400000-0000-4000-8000-000000000007','GR-DEMO-0007','2026-01-22','2026-01-22 12:45:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000007','PO-DEMO-0007','2026-01-08',:'v06','PackRight Solutions','VND-006','DN-PRS-9921',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-01-22 15:30:00',
   true,true,true,true,'2026-01-23 10:00:00','EMP-401','demo-seed','2026-01-22 12:45:00','2026-01-23 10:00:00'),
  ('de400000-0000-4000-8000-000000000008','GR-DEMO-0008','2026-02-09','2026-02-09 11:10:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000008','PO-DEMO-0008','2026-01-22',:'v01','Prime Steel Suppliers','VND-001','DN-PSS-4652','TN-38-AB-1234',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-02-09 14:00:00',
   true,true,true,true,'2026-02-10 10:00:00','EMP-401','demo-seed','2026-02-09 11:10:00','2026-02-10 10:00:00'),
  ('de400000-0000-4000-8000-000000000009','GR-DEMO-0009','2026-02-26','2026-02-26 16:00:00','Accepted','Against PO',
   'de200000-0000-4000-8000-000000000009','PO-DEMO-0009','2026-02-05',:'v07','MaintainPro Services','VND-007','SVC-CERT-0142',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-103','Suresh Menon',NULL,NULL,NULL,
   false,false,false,false,NULL,NULL,'demo-seed','2026-02-26 16:00:00','2026-02-27 10:00:00'),
  ('de400000-0000-4000-8000-000000000010','GR-DEMO-0010','2026-03-09','2026-03-09 10:35:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000010','PO-DEMO-0010','2026-02-19',:'v02','Industrial Components Ltd.','VND-002','DN-ICL-2384','TN-38-CD-5678',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-03-09 13:00:00',
   true,true,true,true,'2026-03-10 10:00:00','EMP-401','demo-seed','2026-03-09 10:35:00','2026-03-10 10:00:00'),
  ('de400000-0000-4000-8000-000000000011','GR-DEMO-0011','2026-03-23','2026-03-23 11:50:00','Accepted','Against PO',
   'de200000-0000-4000-8000-000000000011','PO-DEMO-0011','2026-03-05',:'v03','ElectroTech Supplies','VND-003','DN-ETS-9107',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-03-23 14:30:00',
   true,true,true,false,NULL,NULL,'demo-seed','2026-03-23 11:50:00','2026-03-23 15:00:00'),
  ('de400000-0000-4000-8000-000000000012','GR-DEMO-0012','2026-04-06','2026-04-06 10:15:00','Partially Accepted','Against PO',
   'de200000-0000-4000-8000-000000000012','PO-DEMO-0012','2026-03-19',:'v04','Bharat Metal Works Pvt. Ltd.','VND-004','DN-BMW-6890','TN-38-EF-9012',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-04-06 13:45:00',
   true,true,false,false,NULL,NULL,'demo-seed','2026-04-06 10:15:00','2026-04-06 15:00:00'),
  ('de400000-0000-4000-8000-000000000013','GR-DEMO-0013','2026-04-27','2026-04-27 12:30:00','Quality Check Passed','Against PO',
   'de200000-0000-4000-8000-000000000013','PO-DEMO-0013','2026-04-09',:'v08','Chemical Solutions GmbH','VND-008','DN-CSG-1290',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-04-27 15:15:00',
   true,true,true,false,NULL,NULL,'demo-seed','2026-04-27 12:30:00','2026-04-27 15:15:00'),
  ('de400000-0000-4000-8000-000000000014','GR-DEMO-0014','2026-05-11','2026-05-11 11:00:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000014','PO-DEMO-0014','2026-04-23',:'v01','Prime Steel Suppliers','VND-001','DN-PSS-4810','TN-38-AB-1234',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-05-11 14:00:00',
   true,true,true,true,'2026-05-12 10:00:00','EMP-401','demo-seed','2026-05-11 11:00:00','2026-05-12 10:00:00'),
  ('de400000-0000-4000-8000-000000000015','GR-DEMO-0015','2026-06-01','2026-06-01 10:45:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000015','PO-DEMO-0015','2026-05-07',:'v02','Industrial Components Ltd.','VND-002','DN-ICL-2501','TN-38-CD-5678',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-06-01 13:30:00',
   true,true,true,true,'2026-06-02 10:00:00','EMP-401','demo-seed','2026-06-01 10:45:00','2026-06-02 10:00:00'),
  ('de400000-0000-4000-8000-000000000016','GR-DEMO-0016','2026-06-11','2026-06-11 11:25:00','Posted','Against PO',
   'de200000-0000-4000-8000-000000000016','PO-DEMO-0016','2026-05-21',:'v05','ProTool Equipment Inc.','VND-005','DN-PTE-3502',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das',NULL,NULL,NULL,
   false,false,false,true,'2026-06-12 10:00:00','EMP-401','demo-seed','2026-06-11 11:25:00','2026-06-12 10:00:00'),
  ('de400000-0000-4000-8000-000000000017','GR-DEMO-0017','2026-06-25','2026-06-25 12:10:00','Quality Check Pending','Against PO',
   'de200000-0000-4000-8000-000000000017','PO-DEMO-0017','2026-06-04',:'v06','PackRight Solutions','VND-006','DN-PRS-9975',NULL,
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das',NULL,NULL,NULL,
   true,false,false,false,NULL,NULL,'demo-seed','2026-06-25 12:10:00','2026-06-25 12:10:00'),
  ('de400000-0000-4000-8000-000000000018','GR-DEMO-0018','2026-07-14','2026-07-14 10:55:00','Accepted','Against PO',
   'de200000-0000-4000-8000-000000000018','PO-DEMO-0018','2026-06-18',:'v04','Bharat Metal Works Pvt. Ltd.','VND-004','DN-BMW-7011','TN-38-EF-9012',
   'WH-001','B3 Main Stores - Coimbatore','EMP-401','Mohan Das','EMP-402','Lakshmi Priya','2026-07-14 14:20:00',
   true,true,true,false,NULL,NULL,'demo-seed','2026-07-14 10:55:00','2026-07-14 15:00:00');

-- ---------------------------------------------------------------------------
-- Goods receipt items (26 lines). Received quantities <= PO ordered quantities;
-- lineTotal = received * unitPrice, 18% tax.
-- ---------------------------------------------------------------------------
INSERT INTO goods_receipt_items
  (id, "goodsReceiptId", "lineNumber", status, "purchaseOrderItemId", "poLineNumber",
   "itemId", "itemCode", "itemName", uom,
   "orderedQuantity", "receivedQuantity", "acceptedQuantity", "rejectedQuantity",
   "unitPrice", "lineTotal", "taxAmount", "totalAmount",
   "rejectionReason", "warehouseId", "warehouseName",
   "createdBy", "createdAt", "updatedAt")
SELECT v.id::uuid, v.gid::uuid, v.ln, v.st::goods_receipt_items_status_enum,
       v.poiid, v.ln, v.itemid, v.code, v.nm, v.uom,
       v.oq, v.rq, v.aq, v.jq,
       v.pr, round(v.rq * v.pr, 2), round(v.rq * v.pr * 0.18, 2), round(v.rq * v.pr * 1.18, 2),
       v.rejr, 'WH-001', 'B3 Main Stores - Coimbatore',
       'demo-seed', v.ts::timestamp, v.ts::timestamp
FROM (VALUES
  ('de500000-0000-4000-8000-000000000101','de400000-0000-4000-8000-000000000001',1,'Accepted','de300000-0000-4000-8000-000000000101',:'i_stl','RM-STL-001','Steel Sheet 2mm','KG',1200::numeric,1200::numeric,1200::numeric,0::numeric,85.00::numeric,NULL,'2025-10-23 11:15:00'),
  ('de500000-0000-4000-8000-000000000102','de400000-0000-4000-8000-000000000001',2,'Accepted','de300000-0000-4000-8000-000000000102',:'i_alm','RM-ALM-001','Aluminum Rod 20mm','MTR',300,300,300,0,320.00,NULL,'2025-10-23 11:15:00'),
  ('de500000-0000-4000-8000-000000000201','de400000-0000-4000-8000-000000000002',1,'Accepted','de300000-0000-4000-8000-000000000201',:'i_mtr','FG-MTR-001','Industrial Motor 5HP','PCS',6,6,6,0,12500.00,NULL,'2025-11-06 10:40:00'),
  ('de500000-0000-4000-8000-000000000202','de400000-0000-4000-8000-000000000002',2,'Accepted','de300000-0000-4000-8000-000000000202',:'i_brg','SP-BRG-001','Ball Bearing 6205','PCS',40,40,40,0,450.00,NULL,'2025-11-06 10:40:00'),
  ('de500000-0000-4000-8000-000000000301','de400000-0000-4000-8000-000000000003',1,'Accepted','de300000-0000-4000-8000-000000000301',:'i_cop','RM-COP-001','Copper Wire 2.5mm','MTR',2000,2000,2000,0,45.00,NULL,'2025-11-20 12:05:00'),
  ('de500000-0000-4000-8000-000000000401','de400000-0000-4000-8000-000000000004',1,'Accepted','de300000-0000-4000-8000-000000000401',:'i_clt','CON-CLT-001','Cutting Coolant Concentrate','LTR',200,200,200,0,220.00,NULL,'2025-12-04 09:50:00'),
  ('de500000-0000-4000-8000-000000000402','de400000-0000-4000-8000-000000000004',2,'Accepted','de300000-0000-4000-8000-000000000402',:'i_lub','CON-LUB-001','Industrial Lubricant Oil ISO VG 68','LTR',150,150,150,0,180.00,NULL,'2025-12-04 09:50:00'),
  ('de500000-0000-4000-8000-000000000501','de400000-0000-4000-8000-000000000005',1,'Accepted','de300000-0000-4000-8000-000000000501',:'i_stl','RM-STL-001','Steel Sheet 2mm','KG',1500,1500,1500,0,84.00,NULL,'2025-12-18 11:30:00'),
  ('de500000-0000-4000-8000-000000000601','de400000-0000-4000-8000-000000000006',1,'Accepted','de300000-0000-4000-8000-000000000601',:'i_drl','TOOL-DRL-001','HSS Drill Bit Set 1-13mm','SET',5,5,5,0,1800.00,NULL,'2026-01-05 10:20:00'),
  ('de500000-0000-4000-8000-000000000602','de400000-0000-4000-8000-000000000006',2,'Accepted','de300000-0000-4000-8000-000000000602',:'i_ins','TOOL-INS-001','Carbide Insert CNMG 120408','BOX',10,10,10,0,2200.00,NULL,'2026-01-05 10:20:00'),
  ('de500000-0000-4000-8000-000000000701','de400000-0000-4000-8000-000000000007',1,'Accepted','de300000-0000-4000-8000-000000000701',:'i_sl','SP-SL-001','Mechanical Seal MS-40','PCS',60,60,60,0,1200.00,NULL,'2026-01-22 12:45:00'),
  ('de500000-0000-4000-8000-000000000801','de400000-0000-4000-8000-000000000008',1,'Accepted','de300000-0000-4000-8000-000000000801',:'i_stl','RM-STL-001','Steel Sheet 2mm','KG',2000,2000,2000,0,86.00,NULL,'2026-02-09 11:10:00'),
  ('de500000-0000-4000-8000-000000000802','de400000-0000-4000-8000-000000000008',2,'Accepted','de300000-0000-4000-8000-000000000802',:'i_alm','RM-ALM-001','Aluminum Rod 20mm','MTR',200,200,200,0,315.00,NULL,'2026-02-09 11:10:00'),
  ('de500000-0000-4000-8000-000000000901','de400000-0000-4000-8000-000000000009',1,'Accepted','de300000-0000-4000-8000-000000000901',:'i_mnt','SVC-MNT-001','Preventive Maintenance Service','PCS',4,4,4,0,5000.00,NULL,'2026-02-26 16:00:00'),
  ('de500000-0000-4000-8000-000000001001','de400000-0000-4000-8000-000000000010',1,'Accepted','de300000-0000-4000-8000-000000001001',:'i_mtr','FG-MTR-001','Industrial Motor 5HP','PCS',8,8,8,0,12250.00,NULL,'2026-03-09 10:35:00'),
  ('de500000-0000-4000-8000-000000001002','de400000-0000-4000-8000-000000000010',2,'Accepted','de300000-0000-4000-8000-000000001002',:'i_blt','SP-BLT-001','V-Belt A68','PCS',50,50,50,0,280.00,NULL,'2026-03-09 10:35:00'),
  ('de500000-0000-4000-8000-000000001101','de400000-0000-4000-8000-000000000011',1,'Accepted','de300000-0000-4000-8000-000000001101',:'i_cop','RM-COP-001','Copper Wire 2.5mm','MTR',2500,2500,2500,0,44.00,NULL,'2026-03-23 11:50:00'),
  ('de500000-0000-4000-8000-000000001201','de400000-0000-4000-8000-000000000012',1,'Partially Accepted','de300000-0000-4000-8000-000000001201',:'i_stl','RM-STL-001','Steel Sheet 2mm','KG',1800,1800,1770,30,85.00,'Surface scratches beyond acceptance limit on 30 kg','2026-04-06 10:15:00'),
  ('de500000-0000-4000-8000-000000001202','de400000-0000-4000-8000-000000000012',2,'Accepted','de300000-0000-4000-8000-000000001202',:'i_alm','RM-ALM-001','Aluminum Rod 20mm','MTR',400,400,400,0,318.00,NULL,'2026-04-06 10:15:00'),
  ('de500000-0000-4000-8000-000000001301','de400000-0000-4000-8000-000000000013',1,'Accepted','de300000-0000-4000-8000-000000001301',:'i_clt','CON-CLT-001','Cutting Coolant Concentrate','LTR',250,250,250,0,225.00,NULL,'2026-04-27 12:30:00'),
  ('de500000-0000-4000-8000-000000001401','de400000-0000-4000-8000-000000000014',1,'Accepted','de300000-0000-4000-8000-000000001401',:'i_stl','RM-STL-001','Steel Sheet 2mm','KG',2200,2200,2200,0,87.00,NULL,'2026-05-11 11:00:00'),
  ('de500000-0000-4000-8000-000000001501','de400000-0000-4000-8000-000000000015',1,'Accepted','de300000-0000-4000-8000-000000001501',:'i_mtr','FG-MTR-001','Industrial Motor 5HP','PCS',10,6,6,0,12400.00,NULL,'2026-06-01 10:45:00'),
  ('de500000-0000-4000-8000-000000001502','de400000-0000-4000-8000-000000000015',2,'Accepted','de300000-0000-4000-8000-000000001502',:'i_brg','SP-BRG-001','Ball Bearing 6205','PCS',60,60,60,0,455.00,NULL,'2026-06-01 10:45:00'),
  ('de500000-0000-4000-8000-000000001601','de400000-0000-4000-8000-000000000016',1,'Accepted','de300000-0000-4000-8000-000000001601',:'i_ins','TOOL-INS-001','Carbide Insert CNMG 120408','BOX',20,12,12,0,2150.00,NULL,'2026-06-11 11:25:00'),
  ('de500000-0000-4000-8000-000000001701','de400000-0000-4000-8000-000000000017',1,'Under Inspection','de300000-0000-4000-8000-000000001701',:'i_sl','SP-SL-001','Mechanical Seal MS-40','PCS',80,50,0,0,1180.00,NULL,'2026-06-25 12:10:00'),
  ('de500000-0000-4000-8000-000000001801','de400000-0000-4000-8000-000000000018',1,'Accepted','de300000-0000-4000-8000-000000001801',:'i_stl','RM-STL-001','Steel Sheet 2mm','KG',2500,1500,1500,0,86.00,NULL,'2026-07-14 10:55:00')
) AS v(id, gid, ln, st, poiid, itemid, code, nm, uom, oq, rq, aq, jq, pr, rejr, ts);

-- Derive GRN header money from line aggregates.
UPDATE goods_receipts gr SET
  "totalOrderedAmount"  = a.o,
  "totalReceivedAmount" = a.r,
  "totalAcceptedAmount" = a.acc,
  "totalRejectedAmount" = a.rej
FROM (
  SELECT "goodsReceiptId" AS gid,
         SUM(round("orderedQuantity" * "unitPrice", 2)) AS o,
         SUM("lineTotal") AS r,
         SUM(round("acceptedQuantity" * "unitPrice", 2)) AS acc,
         SUM(round("rejectedQuantity" * "unitPrice", 2)) AS rej
  FROM goods_receipt_items
  WHERE "goodsReceiptId" IN (SELECT id FROM goods_receipts WHERE "grnNumber" LIKE 'GR-DEMO-%')
  GROUP BY 1
) a
WHERE gr.id = a.gid AND gr."grnNumber" LIKE 'GR-DEMO-%';

-- Cross-reference JSON: PO -> its GRNs (after GRN totals are set).
UPDATE purchase_orders po SET "goodsReceipts" = g.js
FROM (
  SELECT gr."purchaseOrderId" AS pid,
         json_agg(json_build_object(
           'grnId', gr.id, 'grnNumber', gr."grnNumber",
           'receivedDate', gr."grnDate", 'receivedAmount', gr."totalReceivedAmount")
           ORDER BY gr."grnNumber") AS js
  FROM goods_receipts gr
  WHERE gr."grnNumber" LIKE 'GR-DEMO-%'
  GROUP BY 1
) g
WHERE po.id::text = g.pid AND po."poNumber" LIKE 'PO-DEMO-%';

-- Cross-reference JSON: PR -> the POs raised against it.
UPDATE purchase_requisitions pr SET "purchaseOrders" = p.js
FROM (
  SELECT po."prNumber" AS prn,
         json_agg(json_build_object(
           'poId', po.id, 'poNumber', po."poNumber", 'createdAt', po."createdAt")
           ORDER BY po."poNumber") AS js
  FROM purchase_orders po
  WHERE po."poNumber" LIKE 'PO-DEMO-%' AND po."prNumber" IS NOT NULL
  GROUP BY 1
) p
WHERE pr."prNumber" = p.prn AND pr."prNumber" LIKE 'PR-DEMO-%';
