-- Demo seed — HR part A (assets, attendance, compliance, documents, expenses, L&D, cards) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: each table clears its demo rows first (predicate documented per DELETE), then re-inserts.
-- Only hard FK in this file: hr_attendance.employeeId -> hr_employees(id), satisfied via subselects on employeeCode.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- hr_asset_items (parent for allocations/returns/transfers/maintenance via assetTag)
-- delete predicate: DEMO- prefixed assetTag within the anchor company
-- ============================================================================
DELETE FROM hr_asset_items WHERE "companyId" = :company AND "assetTag" LIKE 'DEMO-%';
INSERT INTO hr_asset_items
  ("companyId","assetClass","assetTag",brand,model,item,category,"serialNumber",processor,ram,storage,os,
   "purchaseDate",warranty,cost,status,condition,"assignedTo","employeeCode",department,location,"createdAt","updatedAt")
VALUES
  (:company,'laptop','DEMO-IT-0001','Dell','Latitude 5440','Laptop','IT Hardware','DLL5440-88121','Intel i7-1355U','16GB','512GB SSD','Windows 11 Pro','2025-10-06','3 years',92000,'assigned','good','Arun Gupta','EMP0015','Information Technology','Mumbai HO','2025-10-06 10:00:00','2026-08-01 10:00:00'),
  (:company,'laptop','DEMO-IT-0002','Dell','Latitude 5440','Laptop','IT Hardware','DLL5440-88122','Intel i7-1355U','16GB','512GB SSD','Windows 11 Pro','2025-10-06','3 years',92000,'assigned','good','Neha Agarwal','EMP0016','Information Technology','Mumbai HO','2025-10-06 10:00:00','2026-08-01 10:00:00'),
  (:company,'laptop','DEMO-IT-0003','Lenovo','ThinkPad T14 Gen4','Laptop','IT Hardware','LNV-T14-40551','AMD Ryzen 7 PRO','16GB','512GB SSD','Windows 11 Pro','2025-11-12','3 years',88500,'assigned','good','Sanjay Malhotra','EMP0017','Sales & Marketing','Mumbai HO','2025-11-12 10:00:00','2026-08-01 10:00:00'),
  (:company,'laptop','DEMO-IT-0004','Lenovo','ThinkPad T14 Gen4','Laptop','IT Hardware','LNV-T14-40552','AMD Ryzen 7 PRO','16GB','512GB SSD','Windows 11 Pro','2025-11-12','3 years',88500,'available','good',NULL,NULL,NULL,'Mumbai HO IT Store','2025-11-12 10:00:00','2026-06-15 10:00:00'),
  (:company,'laptop','DEMO-IT-0005','HP','EliteBook 840 G10','Laptop','IT Hardware','HP840-77310','Intel i5-1335U','16GB','512GB SSD','Windows 11 Pro','2026-01-20','3 years',84000,'assigned','excellent','Suresh Patel','EMP0005','Finance & Accounts','Mumbai HO','2026-01-20 10:00:00','2026-08-01 10:00:00'),
  (:company,'mobile','DEMO-MB-0001','Samsung','Galaxy A55','Mobile Phone','IT Hardware','SGA55-90112',NULL,'8GB','128GB','Android 15','2025-12-01','2 years',32000,'assigned','good','Ganesh Patil','EMP0020','Dispatch & Logistics','Mumbai Plant','2025-12-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'mobile','DEMO-MB-0002','Samsung','Galaxy A55','Mobile Phone','IT Hardware','SGA55-90113',NULL,'8GB','128GB','Android 15','2025-12-01','2 years',32000,'assigned','good','Ramesh Yadav','EMP0019','Maintenance','Mumbai Plant','2025-12-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'desktop','DEMO-DT-0001','Dell','OptiPlex 7010','Desktop Workstation','IT Hardware','OPT7010-11540','Intel i5-13500','16GB','1TB HDD','Windows 11 Pro','2025-10-15','3 years',58000,'assigned','good','Mohan Das','EMP0013','Stores & Inventory','Mumbai Plant Stores','2025-10-15 10:00:00','2026-08-01 10:00:00'),
  (:company,'desktop','DEMO-DT-0002','Dell','OptiPlex 7010','Desktop Workstation','IT Hardware','OPT7010-11541','Intel i5-13500','16GB','1TB HDD','Windows 11 Pro','2025-10-15','3 years',58000,'assigned','good','Sunita Rao','EMP0011','Quality Control','Mumbai Plant QC Lab','2025-10-15 10:00:00','2026-08-01 10:00:00'),
  (:company,'printer','DEMO-PR-0001','Canon','imageRUNNER 2745','Multifunction Printer','Office Equipment','CNR2745-33021',NULL,NULL,NULL,NULL,'2025-10-20','2 years',185000,'available','good',NULL,NULL,NULL,'Mumbai HO 2nd Floor','2025-10-20 10:00:00','2026-05-10 10:00:00'),
  (:company,'other','DEMO-TL-0001','Fluke','179 Digital Multimeter','Test Instrument','Maintenance Tools','FLK179-55210',NULL,NULL,NULL,NULL,'2026-02-05','1 year',24500,'assigned','excellent','Ramesh Yadav','EMP0019','Maintenance','Mumbai Plant','2026-02-05 10:00:00','2026-08-01 10:00:00'),
  (:company,'other','DEMO-TL-0002','Bosch','GSB 180-LI Drill Kit','Power Tool','Maintenance Tools','BSH180-61177',NULL,NULL,NULL,NULL,'2026-02-05','1 year',13200,'in_repair','fair','Ramesh Yadav','EMP0019','Maintenance','Mumbai Plant','2026-02-05 10:00:00','2026-08-20 10:00:00');

-- ============================================================================
-- hr_asset_inventory — delete predicate: DEMO- prefixed assetCode within anchor company
-- ============================================================================
DELETE FROM hr_asset_inventory WHERE "companyId" = :company AND "assetCode" LIKE 'DEMO-%';
INSERT INTO hr_asset_inventory
  ("companyId","assetCode","assetName",category,brand,model,"totalQuantity",allocated,available,
   "minStockLevel","reorderLevel","unitCost","totalValue",location,supplier,status,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-INV-001','Laptop - Dell Latitude 5440','IT Hardware','Dell','Latitude 5440',12,10,2,2,3,92000,1104000,'Mumbai HO IT Store','Redington India','in_stock','2025-10-06 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-INV-002','Laptop - Lenovo ThinkPad T14','IT Hardware','Lenovo','ThinkPad T14 Gen4',8,7,1,2,2,88500,708000,'Mumbai HO IT Store','Ingram Micro','low_stock','2025-11-12 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-INV-003','Mobile - Samsung Galaxy A55','IT Hardware','Samsung','Galaxy A55',10,8,2,2,3,32000,320000,'Mumbai HO IT Store','Redington India','in_stock','2025-12-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-INV-004','Desktop - Dell OptiPlex 7010','IT Hardware','Dell','OptiPlex 7010',15,14,1,1,2,58000,870000,'Mumbai Plant IT Room','Redington India','low_stock','2025-10-15 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-INV-005','Safety Helmet - Karam PN521','Safety Gear','Karam','PN521',60,48,12,15,20,450,27000,'Mumbai Plant Stores','Karam Safety','in_stock','2025-10-10 10:00:00','2026-07-15 10:00:00'),
  (:company,'DEMO-INV-006','Welding Gloves - Leather 14in','Safety Gear','Honeywell','Weld-14',40,30,10,10,15,780,31200,'Mumbai Plant Stores','Honeywell India','in_stock','2025-10-10 10:00:00','2026-07-15 10:00:00'),
  (:company,'DEMO-INV-007','Office Chair - Featherlite Optima','Furniture','Featherlite','Optima HB',25,22,3,2,4,9800,245000,'Mumbai HO Facilities','Featherlite','in_stock','2025-11-03 10:00:00','2026-06-20 10:00:00'),
  (:company,'DEMO-INV-008','TIG Welding Machine - ESAB','Plant Equipment','ESAB','Buddy Tig 200',6,5,1,1,1,145000,870000,'Mumbai Plant Bay 2','ESAB India','low_stock','2025-12-18 10:00:00','2026-08-10 10:00:00');

-- ============================================================================
-- hr_asset_allocations — delete predicate: DEMO- prefixed allocationId within anchor company
-- ============================================================================
DELETE FROM hr_asset_allocations WHERE "companyId" = :company AND "allocationId" LIKE 'DEMO-%';
INSERT INTO hr_asset_allocations
  ("companyId","allocationId","assetTag","assetName",category,"employeeName","employeeCode",department,designation,
   location,"allocationDate","expectedReturnDate","actualReturnDate",status,condition,"allocatedBy",remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-ALL-001','DEMO-IT-0001','Dell Latitude 5440','IT Hardware','Arun Gupta','EMP0015','Information Technology','Manager','Mumbai HO','2025-10-08',NULL,NULL,'allocated','good','Neha Agarwal','Primary work laptop','2025-10-08 10:00:00','2025-10-08 10:00:00'),
  (:company,'DEMO-ALL-002','DEMO-IT-0002','Dell Latitude 5440','IT Hardware','Neha Agarwal','EMP0016','Information Technology','Senior Executive','Mumbai HO','2025-10-08',NULL,NULL,'allocated','good','Arun Gupta','Primary work laptop','2025-10-08 10:00:00','2025-10-08 10:00:00'),
  (:company,'DEMO-ALL-003','DEMO-IT-0003','Lenovo ThinkPad T14','IT Hardware','Sanjay Malhotra','EMP0017','Sales & Marketing','Manager','Mumbai HO','2025-11-14',NULL,NULL,'allocated','good','Arun Gupta','Field sales laptop with 4G dongle','2025-11-14 10:00:00','2025-11-14 10:00:00'),
  (:company,'DEMO-ALL-004','DEMO-IT-0005','HP EliteBook 840 G10','IT Hardware','Suresh Patel','EMP0005','Finance & Accounts','Manager','Mumbai HO','2026-01-22',NULL,NULL,'allocated','excellent','Arun Gupta','Replacement for aging desktop','2026-01-22 10:00:00','2026-01-22 10:00:00'),
  (:company,'DEMO-ALL-005','DEMO-MB-0001','Samsung Galaxy A55','IT Hardware','Ganesh Patil','EMP0020','Dispatch & Logistics','Executive','Mumbai Plant','2025-12-03',NULL,NULL,'allocated','good','Arun Gupta','Dispatch coordination SIM enabled','2025-12-03 10:00:00','2025-12-03 10:00:00'),
  (:company,'DEMO-ALL-006','DEMO-MB-0002','Samsung Galaxy A55','IT Hardware','Ramesh Yadav','EMP0019','Maintenance','Senior Executive','Mumbai Plant','2025-12-03',NULL,NULL,'allocated','good','Arun Gupta','On-call breakdown support phone','2025-12-03 10:00:00','2025-12-03 10:00:00'),
  (:company,'DEMO-ALL-007','DEMO-DT-0001','Dell OptiPlex 7010','IT Hardware','Mohan Das','EMP0013','Stores & Inventory','Executive','Mumbai Plant Stores','2025-10-18',NULL,NULL,'allocated','good','Neha Agarwal','Stores GRN terminal','2025-10-18 10:00:00','2025-10-18 10:00:00'),
  (:company,'DEMO-ALL-008','DEMO-DT-0002','Dell OptiPlex 7010','IT Hardware','Sunita Rao','EMP0011','Quality Control','Manager','Mumbai Plant QC Lab','2025-10-18',NULL,NULL,'allocated','good','Neha Agarwal','QC lab inspection terminal','2025-10-18 10:00:00','2025-10-18 10:00:00'),
  (:company,'DEMO-ALL-009','DEMO-TL-0001','Fluke 179 Multimeter','Maintenance Tools','Ramesh Yadav','EMP0019','Maintenance','Senior Executive','Mumbai Plant','2026-02-07',NULL,NULL,'allocated','excellent','Mohan Das','Electrical panel diagnostics','2026-02-07 10:00:00','2026-02-07 10:00:00'),
  (:company,'DEMO-ALL-010','DEMO-TL-0002','Bosch GSB 180-LI Drill Kit','Maintenance Tools','Ramesh Yadav','EMP0019','Maintenance','Senior Executive','Mumbai Plant','2026-02-07','2026-08-15','2026-08-18','returned','fair','Mohan Das','Returned for repair - chuck jam','2026-02-07 10:00:00','2026-08-18 10:00:00');

-- ============================================================================
-- hr_asset_requests — delete predicate: DEMO- prefixed requestId within anchor company
-- ============================================================================
DELETE FROM hr_asset_requests WHERE "companyId" = :company AND "requestId" LIKE 'DEMO-%';
INSERT INTO hr_asset_requests
  ("companyId","requestId","requestDate",requester,"employeeCode",department,designation,"assetCategory","assetName",
   quantity,priority,purpose,status,approver,"approvalDate","fulfillmentDate",remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-REQ-001','2025-11-05','Sanjay Malhotra','EMP0017','Sales & Marketing','Manager','IT Hardware','Laptop with 4G',1,'high','Field demos of MACBIS configurator at customer sites','fulfilled','Arun Gupta','2025-11-07','2025-11-14','Issued DEMO-IT-0003','2025-11-05 10:00:00','2025-11-14 10:00:00'),
  (:company,'DEMO-REQ-002','2026-01-12','Suresh Patel','EMP0005','Finance & Accounts','Manager','IT Hardware','Laptop',1,'medium','Desktop replacement for month-end close mobility','fulfilled','Arun Gupta','2026-01-15','2026-01-22','Issued DEMO-IT-0005','2026-01-12 10:00:00','2026-01-22 10:00:00'),
  (:company,'DEMO-REQ-003','2026-03-02','Kiran Reddy','EMP0008','Production','Senior Executive','Safety Gear','Welding helmets (auto-darkening)',6,'high','Bay 2 TIG stations upgrade per EHS audit','approved','Amit Verma','2026-03-04',NULL,'PO raised with Karam Safety','2026-03-02 10:00:00','2026-03-04 10:00:00'),
  (:company,'DEMO-REQ-004','2026-04-10','Pooja Mehta','EMP0018','Sales & Marketing','Senior Executive','IT Hardware','Mobile phone',1,'medium','Customer follow-up calls during travel','pending',NULL,NULL,NULL,NULL,'2026-04-10 10:00:00','2026-04-10 10:00:00'),
  (:company,'DEMO-REQ-005','2026-05-18','Deepak Joshi','EMP0009','Production','Executive','Plant Equipment','Digital vernier calipers',4,'medium','Fabrication line dimensional checks','fulfilled','Amit Verma','2026-05-20','2026-06-02',NULL,'2026-05-18 10:00:00','2026-06-02 10:00:00'),
  (:company,'DEMO-REQ-006','2026-06-25','Lakshmi Iyer','EMP0014','Stores & Inventory','Executive','Office Equipment','Barcode scanners',2,'high','GRN speed-up at stores inward dock','approved','Mohan Das','2026-06-27',NULL,'Awaiting vendor delivery','2026-06-25 10:00:00','2026-06-27 10:00:00'),
  (:company,'DEMO-REQ-007','2026-07-30','Neha Agarwal','EMP0016','Information Technology','Senior Executive','IT Hardware','27-inch monitor',2,'low','Dual-screen setup for ERP support desk','rejected','Arun Gupta','2026-08-01',NULL,'Deferred to next quarter budget','2026-07-30 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-REQ-008','2026-08-22','Ramesh Yadav','EMP0019','Maintenance','Senior Executive','Maintenance Tools','Thermal imaging camera',1,'high','Preventive checks on panel hotspots','pending',NULL,NULL,NULL,NULL,'2026-08-22 10:00:00','2026-08-22 10:00:00');

-- ============================================================================
-- hr_asset_returns — delete predicate: DEMO- prefixed returnId within anchor company
-- ============================================================================
DELETE FROM hr_asset_returns WHERE "companyId" = :company AND "returnId" LIKE 'DEMO-%';
INSERT INTO hr_asset_returns
  ("companyId","returnId","assetTag","assetType","assetCategory","returnedBy","employeeCode",department,
   "assignedDate","returnDate","returnReason",condition,status,"inspectedBy","inspectionDate","inspectionNotes","damageCharges",accessories,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-RET-001','DEMO-TL-0002','Power Tool','Maintenance Tools','Ramesh Yadav','EMP0019','Maintenance','2026-02-07','2026-08-18','Fault - chuck jammed','fair','inspected','Mohan Das','2026-08-19','Chuck assembly worn; sent to service vendor',0,'Case, 2 batteries, charger','2026-08-18 10:00:00','2026-08-19 10:00:00'),
  (:company,'DEMO-RET-002','DEMO-IT-0004','Laptop','IT Hardware','Vikram Singh','EMP0004','Human Resources','2025-11-14','2026-06-12','Project rollover - returned to pool','good','accepted','Neha Agarwal','2026-06-13','Battery health 91%, reimaged and returned to stock',0,'Charger, sleeve','2026-06-12 10:00:00','2026-06-13 10:00:00'),
  (:company,'DEMO-RET-003','DEMO-PR-0001','Printer','Office Equipment','Anita Desai','EMP0003','Human Resources','2025-10-22','2026-03-30','Floor relocation - reassignment','good','accepted','Arun Gupta','2026-03-31','Drum at 62%, relocated to shared bay',0,'Spare toner x1','2026-03-30 10:00:00','2026-03-31 10:00:00'),
  (:company,'DEMO-RET-004','DEMO-MB-0002','Mobile Phone','IT Hardware','Ramesh Yadav','EMP0019','Maintenance','2025-12-03','2026-07-05','Screen cracked - replacement issued','damaged','pending_inspection',NULL,NULL,NULL,2500,'Charger, cover','2026-07-05 10:00:00','2026-07-05 10:00:00'),
  (:company,'DEMO-RET-005','DEMO-DT-0001','Desktop','IT Hardware','Mohan Das','EMP0013','Stores & Inventory','2025-10-18','2026-08-28','OS upgrade cycle','good','pending_inspection',NULL,NULL,NULL,NULL,'Keyboard, mouse','2026-08-28 10:00:00','2026-08-28 10:00:00'),
  (:company,'DEMO-RET-006','DEMO-IT-0002','Laptop','IT Hardware','Neha Agarwal','EMP0016','Information Technology','2025-10-08','2026-09-02','Warranty service - hinge replacement','fair','inspected','Arun Gupta','2026-09-03','Hinge under warranty; no charge to employee',0,'Charger','2026-09-02 10:00:00','2026-09-03 10:00:00');

-- ============================================================================
-- hr_asset_transfers — delete predicate: DEMO- prefixed transferId within anchor company
-- ============================================================================
DELETE FROM hr_asset_transfers WHERE "companyId" = :company AND "transferId" LIKE 'DEMO-%';
INSERT INTO hr_asset_transfers
  ("companyId","transferId","assetTag","assetType","assetCategory","fromEmployee","fromEmployeeCode","fromDepartment","fromLocation",
   "toEmployee","toEmployeeCode","toDepartment","toLocation","initiatedBy","initiatedDate","transferReason",status,"approvedBy","approvalDate","completionDate","handoverNotes",condition,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-TRF-001','DEMO-DT-0002','Desktop','IT Hardware','Sunita Rao','EMP0011','Quality Control','Mumbai Plant QC Lab','Ajay Pillai','EMP0012','Quality Control','Mumbai Plant QC Lab','Sunita Rao','2026-02-10','Role handover within QC','completed','Arun Gupta','2026-02-11','2026-02-12','All QC templates and calibration sheets retained on D: drive','good','2026-02-10 10:00:00','2026-02-12 10:00:00'),
  (:company,'DEMO-TRF-002','DEMO-IT-0004','Laptop','IT Hardware','Vikram Singh','EMP0004','Human Resources','Mumbai HO','Pooja Mehta','EMP0018','Sales & Marketing','Mumbai HO','Anita Desai','2026-06-14','Pool reissue after HR project close','completed','Arun Gupta','2026-06-15','2026-06-16','Reimaged before handover','good','2026-06-14 10:00:00','2026-06-16 10:00:00'),
  (:company,'DEMO-TRF-003','DEMO-TL-0001','Test Instrument','Maintenance Tools','Ramesh Yadav','EMP0019','Maintenance','Mumbai Plant','Deepak Joshi','EMP0009','Production','Mumbai Plant Bay 2','Ramesh Yadav','2026-05-04','Shared use for line commissioning checks','completed','Amit Verma','2026-05-05','2026-05-06','Calibration valid till 2027-02','excellent','2026-05-04 10:00:00','2026-05-06 10:00:00'),
  (:company,'DEMO-TRF-004','DEMO-MB-0001','Mobile Phone','IT Hardware','Ganesh Patil','EMP0020','Dispatch & Logistics','Mumbai Plant','Lakshmi Iyer','EMP0014','Stores & Inventory','Mumbai Plant Stores','Ganesh Patil','2026-07-21','Dispatch SIM sharing during leave cover','pending',NULL,NULL,NULL,NULL,'good','2026-07-21 10:00:00','2026-07-21 10:00:00'),
  (:company,'DEMO-TRF-005','DEMO-PR-0001','Printer','Office Equipment','Anita Desai','EMP0003','Human Resources','Mumbai HO 3rd Floor','Meera Nair','EMP0006','Finance & Accounts','Mumbai HO 2nd Floor','Arun Gupta','2026-03-28','Floor relocation to shared finance bay','completed','Rajesh Kumar','2026-03-29','2026-03-31','Network re-pointed to FIN print queue','good','2026-03-28 10:00:00','2026-03-31 10:00:00'),
  (:company,'DEMO-TRF-006','DEMO-IT-0001','Laptop','IT Hardware','Arun Gupta','EMP0015','Information Technology','Mumbai HO','Arun Gupta','EMP0015','Information Technology','Bengaluru Site Office','Arun Gupta','2026-08-25','Location change - site office rollout support','approved','Rajesh Kumar','2026-08-26',NULL,NULL,'good','2026-08-25 10:00:00','2026-08-26 10:00:00');

-- ============================================================================
-- hr_asset_maintenance — delete predicate: DEMO- prefixed requestId within anchor company
-- ============================================================================
DELETE FROM hr_asset_maintenance WHERE "companyId" = :company AND "requestId" LIKE 'DEMO-%';
INSERT INTO hr_asset_maintenance
  ("companyId","recordType","requestId","ticketId","assetTag","assetName","assetCategory","issueType","issueDescription",
   "requestedBy","employeeCode",department,priority,status,"requestDate","startDate","completionDate","assignedTo",vendor,"estimatedCost",cost,"workDone","partsReplaced",location,remarks,"createdAt","updatedAt")
VALUES
  (:company,'request','DEMO-MNT-001','TKT-4101','DEMO-TL-0002','Bosch GSB 180-LI Drill Kit','Maintenance Tools','mechanical','Chuck jammed, does not grip bits','Ramesh Yadav','EMP0019','Maintenance','medium','in_progress','2026-08-19','2026-08-24',NULL,'Bosch Service Centre','Bosch Service Centre Andheri',3500,NULL,NULL,NULL,'Mumbai Plant',NULL,'2026-08-19 10:00:00','2026-08-24 10:00:00'),
  (:company,'request','DEMO-MNT-002','TKT-4102','DEMO-IT-0002','Dell Latitude 5440','IT Hardware','hardware','Left hinge loose, lid wobbles','Neha Agarwal','EMP0016','Information Technology','low','completed','2026-08-30','2026-09-02','2026-09-03','Dell Onsite','Dell ProSupport',0,0,'Hinge assembly replaced under warranty','Hinge assembly LH','Mumbai HO','Warranty claim, no cost','2026-08-30 10:00:00','2026-09-03 10:00:00'),
  (:company,'request','DEMO-MNT-003','TKT-4103','DEMO-PR-0001','Canon imageRUNNER 2745','Office Equipment','consumable','Streaks on printouts, drum warning','Meera Nair','EMP0006','Finance & Accounts','medium','completed','2026-04-14','2026-04-16','2026-04-16','Canon AMC Engineer','Canon Care India',6800,6200,'Drum unit replaced, rollers cleaned','Drum unit C-EXV','Mumbai HO 2nd Floor','Covered partially under AMC','2026-04-14 10:00:00','2026-04-16 10:00:00'),
  (:company,'request','DEMO-MNT-004','TKT-4104','DEMO-DT-0001','Dell OptiPlex 7010','IT Hardware','software','Windows 11 upgrade + SSD swap requested','Mohan Das','EMP0013','Stores & Inventory','low','pending','2026-08-28',NULL,NULL,'IT Helpdesk',NULL,4500,NULL,NULL,NULL,'Mumbai Plant Stores',NULL,'2026-08-28 10:00:00','2026-08-28 10:00:00'),
  (:company,'request','DEMO-MNT-005','TKT-4105','DEMO-MB-0002','Samsung Galaxy A55','IT Hardware','hardware','Screen cracked after drop on shop floor','Ramesh Yadav','EMP0019','Maintenance','high','completed','2026-07-05','2026-07-08','2026-07-10','Samsung Service Centre','Samsung Care Lower Parel',7000,6500,'Display module replaced','AMOLED display module','Mumbai Plant','Rs.2500 recovered as damage charge','2026-07-05 10:00:00','2026-07-10 10:00:00'),
  (:company,'request','DEMO-MNT-006','TKT-4106','DEMO-INV-008','ESAB Buddy Tig 200','Plant Equipment','electrical','Erratic arc, suspected HF board issue','Kiran Reddy','EMP0008','Production','high','in_progress','2026-09-01','2026-09-04',NULL,'ESAB Service','ESAB India Service',18000,NULL,NULL,NULL,'Mumbai Plant Bay 2','Line impact - spare machine deployed','2026-09-01 10:00:00','2026-09-04 10:00:00'),
  (:company,'request','DEMO-MNT-007','TKT-4107','DEMO-DT-0002','Dell OptiPlex 7010','IT Hardware','hardware','Random shutdowns, suspected PSU','Ajay Pillai','EMP0012','Quality Control','medium','completed','2026-05-22','2026-05-23','2026-05-24','IT Helpdesk',NULL,3200,2900,'PSU replaced 500W','SMPS 500W','Mumbai Plant QC Lab',NULL,'2026-05-22 10:00:00','2026-05-24 10:00:00'),
  (:company,'preventive','DEMO-MNT-008','TKT-4108','DEMO-PR-0001','Canon imageRUNNER 2745','Office Equipment','preventive','Quarterly AMC preventive service','Arun Gupta','EMP0015','Information Technology','low','scheduled','2026-09-08',NULL,NULL,'Canon AMC Engineer','Canon Care India',0,NULL,NULL,NULL,'Mumbai HO 2nd Floor','Q3 FY26-27 PM visit','2026-09-08 10:00:00','2026-09-08 10:00:00');

-- ============================================================================
-- hr_asset_audits — delete predicate: DEMO- prefixed auditId within anchor company
-- ============================================================================
DELETE FROM hr_asset_audits WHERE "companyId" = :company AND "auditId" LIKE 'DEMO-%';
INSERT INTO hr_asset_audits
  ("companyId","auditId","auditDate","auditType",location,auditor,"totalAssets",verified,missing,damaged,status,"completionDate",remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-AUD-001','2025-12-15','scheduled','Mumbai HO','Neha Agarwal',86,84,1,1,'completed','2025-12-18','H2 CY25 IT asset verification; one dongle untraced','2025-12-15 10:00:00','2025-12-18 10:00:00'),
  (:company,'DEMO-AUD-002','2026-01-20','scheduled','Mumbai Plant','Mohan Das',142,140,0,2,'completed','2026-01-24','Plant tools & equipment audit; 2 tools sent for repair','2026-01-20 10:00:00','2026-01-24 10:00:00'),
  (:company,'DEMO-AUD-003','2026-04-10','surprise','Mumbai Plant Stores','Ajay Pillai',54,54,0,0,'completed','2026-04-10','Spot check of safety gear issue registers - clean','2026-04-10 10:00:00','2026-04-10 10:00:00'),
  (:company,'DEMO-AUD-004','2026-06-16','scheduled','Mumbai HO','Neha Agarwal',91,89,0,1,'completed','2026-06-19','H1 CY26 IT audit; one laptop hinge damage logged','2026-06-16 10:00:00','2026-06-19 10:00:00'),
  (:company,'DEMO-AUD-005','2026-09-15','scheduled','Mumbai Plant','Mohan Das',150,0,0,0,'pending',NULL,'Q2 FY26-27 plant asset audit - planned','2026-09-05 10:00:00','2026-09-05 10:00:00');

-- ============================================================================
-- hr_amc_contracts — delete predicate: DEMO- prefixed contractId within anchor company
-- ============================================================================
DELETE FROM hr_amc_contracts WHERE "companyId" = :company AND "contractId" LIKE 'DEMO-%';
INSERT INTO hr_amc_contracts
  ("companyId","contractId","assetCategory",vendor,"vendorContact","startDate","endDate",duration,"numberOfAssets",
   "contractValue","paymentTerms",coverage,"responseTime",status,"renewalDate",location,"contactPerson",remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-AMC-001','printer','Canon Care India','+91-22-4066-3000','2025-10-01','2026-09-30',12,6,96000,'annual','Parts + labour + quarterly PM visits, consumables excluded','8 business hours','active','2026-09-01','Mumbai HO','Anil Deshpande','Covers all imageRUNNER units','2025-10-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-AMC-002','laptop','Dell ProSupport','+91-80-2535-0000','2025-11-01','2028-10-31',36,22,412000,'annual','NBD onsite, accidental damage excluded','Next business day','active','2028-10-01','Mumbai HO + Plant','Ritu Malhotra','3-year ProSupport on Latitude fleet','2025-11-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-AMC-003','other','ESAB India Service','+91-33-6602-1000','2026-01-01','2026-12-31',12,6,144000,'half_yearly','Welding machines: calibration, boards, torch service','24 hours','active','2026-12-01','Mumbai Plant','S. Krishnan','Covers TIG/MIG park in Bay 2','2026-01-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-AMC-004','hvac','Blue Star Ltd','+91-22-6668-4000','2025-10-15','2026-10-14',12,14,168000,'quarterly','VRF + ductable units, gas top-up included','12 hours','active','2026-09-14','Mumbai HO','Prakash Jain','Office floors 2-4','2025-10-15 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-AMC-005','ups','Numeric UPS Service','+91-44-4287-4287','2025-12-01','2026-11-30',12,4,72000,'annual','20kVA UPS x2, 10kVA x2, battery health checks','6 hours','active','2026-11-01','Mumbai Plant + HO','Farida Khan','Battery bank replacement quoted separately','2025-12-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'DEMO-AMC-006','biometric','eSSL Security','+91-80-6612-0000','2025-10-01','2026-09-30',12,5,36000,'annual','Attendance devices + door controllers, cloud sync support','24 hours','expiring_soon','2026-09-10','All locations','Vinod Kamble','Renewal negotiation in progress','2025-10-01 10:00:00','2026-09-01 10:00:00');

-- ============================================================================
-- hr_attendance (hard FK to hr_employees; UNIQUE(employeeId,date))
-- delete predicate: remarks='demo-seed' (table has no companyId column)
-- ============================================================================
DELETE FROM hr_attendance WHERE remarks = 'demo-seed';
INSERT INTO hr_attendance
  ("employeeId", date, "shiftId", "shiftStartTime", "shiftEndTime", "checkInTime", "checkOutTime",
   "workingHours", "overtimeHours", status, type, "isWeekOff", location, remarks, "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0007'),'2026-09-01','GENERAL','09:00','17:30','08:52','17:41',8.5,0,'Present','Regular',false,'Mumbai Plant','demo-seed','2026-09-01 18:00:00','2026-09-01 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0007'),'2026-09-02','GENERAL','09:00','17:30','08:58','19:35',8.5,2.0,'Present','Overtime',false,'Mumbai Plant','demo-seed','2026-09-02 20:00:00','2026-09-02 20:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0007'),'2026-09-03','GENERAL','09:00','17:30','09:24','17:35',8.1,0,'Late','Regular',false,'Mumbai Plant','demo-seed','2026-09-03 18:00:00','2026-09-03 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0007'),'2026-09-04','GENERAL','09:00','17:30','08:55','17:33',8.5,0,'Present','Regular',false,'Mumbai Plant','demo-seed','2026-09-04 18:00:00','2026-09-04 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0007'),'2026-09-05','GENERAL','09:00','17:30',NULL,NULL,0,0,'On Leave','Regular',false,'Mumbai Plant','demo-seed','2026-09-05 18:00:00','2026-09-05 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0011'),'2026-09-01','GENERAL','09:00','17:30','08:45','17:36',8.6,0,'Present','Regular',false,'Mumbai Plant QC Lab','demo-seed','2026-09-01 18:00:00','2026-09-01 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0011'),'2026-09-02','GENERAL','09:00','17:30','08:49','17:31',8.5,0,'Present','Regular',false,'Mumbai Plant QC Lab','demo-seed','2026-09-02 18:00:00','2026-09-02 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0011'),'2026-09-03','GENERAL','09:00','17:30',NULL,NULL,0,0,'Absent','Regular',false,'Mumbai Plant QC Lab','demo-seed','2026-09-03 18:00:00','2026-09-03 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0011'),'2026-09-04','GENERAL','09:00','17:30','08:47','13:05',4.2,0,'Half Day','Regular',false,'Mumbai Plant QC Lab','demo-seed','2026-09-04 18:00:00','2026-09-04 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0011'),'2026-09-05','GENERAL','09:00','17:30','08:50','17:32',8.5,0,'Present','Regular',false,'Mumbai Plant QC Lab','demo-seed','2026-09-05 18:00:00','2026-09-05 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0016'),'2026-09-01','GENERAL','09:00','17:30','09:02','17:45',8.5,0,'Present','Regular',false,'Mumbai HO','demo-seed','2026-09-01 18:00:00','2026-09-01 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0016'),'2026-09-02','GENERAL','09:00','17:30',NULL,NULL,8.0,0,'Work From Home','Regular',false,'Remote','demo-seed','2026-09-02 18:00:00','2026-09-02 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0016'),'2026-09-03','GENERAL','09:00','17:30','08:56','17:38',8.5,0,'Present','Regular',false,'Mumbai HO','demo-seed','2026-09-03 18:00:00','2026-09-03 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0020'),'2026-09-06','GENERAL','09:00','17:30',NULL,NULL,0,0,'Week Off','Regular',true,'Mumbai Plant','demo-seed','2026-09-06 18:00:00','2026-09-06 18:00:00'),
  ((SELECT id FROM hr_employees WHERE "employeeCode"='EMP0020'),'2026-09-08','GENERAL','09:00','17:30','08:41','20:10',8.5,2.5,'Present','Overtime',false,'Mumbai Plant','demo-seed','2026-09-08 21:00:00','2026-09-08 21:00:00');

-- ============================================================================
-- hr_attendance_policies — delete predicate: name suffix '(Demo)' within anchor company
-- ============================================================================
DELETE FROM hr_attendance_policies WHERE "companyId" = :company AND name LIKE '%(Demo)';
INSERT INTO hr_attendance_policies
  ("companyId",name,type,description,"applicableTo","effectiveFrom",status,rules,"createdBy","lastModified","createdAt","updatedAt")
VALUES
  (:company,'General Shift Attendance Policy (Demo)','attendance','Standard 9:00-17:30 shift with 30 min grace and half-day cutoff','All office staff','2025-10-01','active','{"graceMinutes":30,"halfDayAfterMinutes":240,"lateMarkAfter":3,"biometricMandatory":true}','Anita Desai','2026-04-01','2025-10-01 10:00:00','2026-04-01 10:00:00'),
  (:company,'Plant Shift & Overtime Policy (Demo)','overtime','OT beyond 8.5 hrs with prior supervisor approval; max 4 hrs/day per Factories Act','Production, Maintenance, Dispatch','2025-10-01','active','{"otMultiplier":2,"maxOtHoursPerDay":4,"maxOtHoursPerQuarter":50,"approvalRequired":true}','Anita Desai','2026-01-15','2025-10-01 10:00:00','2026-01-15 10:00:00'),
  (:company,'Work From Home Policy (Demo)','wfh','Up to 4 WFH days/month for eligible office roles with manager approval','IT, Finance, HR, Sales','2025-11-01','active','{"maxDaysPerMonth":4,"approvalRequired":true,"coreHours":"10:00-16:00"}','Anita Desai','2025-11-01','2025-11-01 10:00:00','2025-11-01 10:00:00'),
  (:company,'Attendance Regularization Policy (Demo)','regularization','Missed punch regularization within 3 working days, max 3 per month','All employees','2025-10-01','active','{"windowDays":3,"maxPerMonth":3,"approver":"reporting_manager"}','Vikram Singh','2026-02-20','2025-10-01 10:00:00','2026-02-20 10:00:00'),
  (:company,'Field Visit Attendance Policy (Demo)','field','Geo-tagged mobile check-in for sales and service field visits','Sales & Marketing, After-Sales','2026-01-01','active','{"geoTagRequired":true,"checkInRadiusMeters":500,"dailyVisitLog":true}','Anita Desai','2026-01-01','2026-01-01 10:00:00','2026-01-01 10:00:00');

-- ============================================================================
-- hr_attendance_records (summary rollups)
-- delete predicate: anchor-company rows carrying demo period tags below; scoped by companyId
-- (table is demo-owned for the anchor company; this file owns all its rows)
-- ============================================================================
DELETE FROM hr_attendance_records WHERE "companyId" = :company;
INSERT INTO hr_attendance_records
  ("companyId",category,"employeeId","employeeName","employeeCode",department,period,"presentDays","absentDays","totalHours",status,details,"createdAt","updatedAt")
VALUES
  (:company,'monthly',NULL,'Amit Verma','EMP0007','Production','2026-07',25,1,214.5,'active','{"late":2,"halfDays":0,"otHours":12.5,"wfh":0}','2026-08-02 10:00:00','2026-08-02 10:00:00'),
  (:company,'monthly',NULL,'Amit Verma','EMP0007','Production','2026-08',24,2,206.0,'active','{"late":1,"halfDays":1,"otHours":9.0,"wfh":0}','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'monthly',NULL,'Sunita Rao','EMP0011','Quality Control','2026-07',26,0,221.0,'active','{"late":0,"halfDays":0,"otHours":4.0,"wfh":0}','2026-08-02 10:00:00','2026-08-02 10:00:00'),
  (:company,'monthly',NULL,'Sunita Rao','EMP0011','Quality Control','2026-08',23,3,195.5,'active','{"late":0,"halfDays":1,"otHours":0,"wfh":0}','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'monthly',NULL,'Neha Agarwal','EMP0016','Information Technology','2026-07',24,0,204.0,'active','{"late":1,"halfDays":0,"otHours":0,"wfh":4}','2026-08-02 10:00:00','2026-08-02 10:00:00'),
  (:company,'monthly',NULL,'Neha Agarwal','EMP0016','Information Technology','2026-08',25,1,212.5,'active','{"late":0,"halfDays":0,"otHours":0,"wfh":3}','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'monthly',NULL,'Ganesh Patil','EMP0020','Dispatch & Logistics','2026-08',26,0,228.0,'active','{"late":0,"halfDays":0,"otHours":14.5,"wfh":0}','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'monthly',NULL,'Sanjay Malhotra','EMP0017','Sales & Marketing','2026-08',22,0,187.0,'active','{"late":0,"halfDays":0,"otHours":0,"fieldDays":9}','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'daily',NULL,'Amit Verma','EMP0007','Production','2026-09-08',1,0,8.5,'active','{"checkIn":"08:52","checkOut":"17:41"}','2026-09-08 18:00:00','2026-09-08 18:00:00'),
  (:company,'daily',NULL,'Ganesh Patil','EMP0020','Dispatch & Logistics','2026-09-08',1,0,11.0,'active','{"checkIn":"08:41","checkOut":"20:10","ot":2.5}','2026-09-08 21:00:00','2026-09-08 21:00:00');

-- ============================================================================
-- hr_biometric_devices — delete predicate: DEMO- prefixed deviceId within anchor company
-- ============================================================================
DELETE FROM hr_biometric_devices WHERE "companyId" = :company AND "deviceId" LIKE 'DEMO-%';
INSERT INTO hr_biometric_devices
  ("companyId","deviceId",name,model,location,"ipAddress",port,status,"lastSyncAt","enrolledUsers","batteryBackup","createdAt","updatedAt")
VALUES
  (:company,'DEMO-BIO-01','HO Main Entrance','eSSL X990','Mumbai HO Ground Floor','192.168.10.21',4370,'online','2026-09-10 08:45:00+05:30',148,true,'2025-10-01 10:00:00','2026-09-10 09:00:00'),
  (:company,'DEMO-BIO-02','HO 3rd Floor HR Wing','eSSL K30 Pro','Mumbai HO 3rd Floor','192.168.10.22',4370,'online','2026-09-10 08:45:00+05:30',62,false,'2025-10-01 10:00:00','2026-09-10 09:00:00'),
  (:company,'DEMO-BIO-03','Plant Main Gate','eSSL X990','Mumbai Plant Gate 1','192.168.20.21',4370,'online','2026-09-10 08:50:00+05:30',196,true,'2025-10-01 10:00:00','2026-09-10 09:00:00'),
  (:company,'DEMO-BIO-04','Plant Bay 2 Shop Floor','eSSL MB160','Mumbai Plant Bay 2','192.168.20.22',4370,'offline','2026-09-06 17:10:00+05:30',88,false,'2025-11-15 10:00:00','2026-09-08 09:00:00'),
  (:company,'DEMO-BIO-05','Stores Inward Dock','eSSL K30 Pro','Mumbai Plant Stores','192.168.20.23',4370,'online','2026-09-10 08:50:00+05:30',34,false,'2026-01-10 10:00:00','2026-09-10 09:00:00');

-- ============================================================================
-- hr_access_cards — delete predicate: DEMO- prefixed cardNumber within anchor company
-- ============================================================================
DELETE FROM hr_access_cards WHERE "companyId" = :company AND "cardNumber" LIKE 'DEMO-%';
INSERT INTO hr_access_cards
  ("companyId","cardNumber","cardType","issuedTo","employeeCode",department,designation,"issueDate","expiryDate",
   status,"accessLevel","accessZones",location,"issuedBy","lastUsed",remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-AC-0001','employee','Rajesh Kumar','EMP0001','Management','Chief Executive Officer','2025-10-01','2027-09-30','active','full','HO All Floors, Plant All Bays, Server Room','Mumbai HO','Vikram Singh','2026-09-09','','2025-10-01 10:00:00','2026-09-09 10:00:00'),
  (:company,'DEMO-AC-0002','employee','Anita Desai','EMP0003','Human Resources','Manager','2025-10-01','2027-09-30','active','elevated','HO All Floors, Plant Admin Block','Mumbai HO','Vikram Singh','2026-09-10','','2025-10-01 10:00:00','2026-09-10 10:00:00'),
  (:company,'DEMO-AC-0003','employee','Arun Gupta','EMP0015','Information Technology','Manager','2025-10-01','2027-09-30','active','elevated','HO All Floors, Server Room, Plant IT Room','Mumbai HO','Vikram Singh','2026-09-10','','2025-10-01 10:00:00','2026-09-10 10:00:00'),
  (:company,'DEMO-AC-0004','employee','Amit Verma','EMP0007','Production','Manager','2025-10-01','2027-09-30','active','standard','Plant All Bays, HO Ground Floor','Mumbai Plant','Vikram Singh','2026-09-10','','2025-10-01 10:00:00','2026-09-10 10:00:00'),
  (:company,'DEMO-AC-0005','employee','Mohan Das','EMP0013','Stores & Inventory','Executive','2025-10-01','2027-09-30','active','standard','Plant Stores, Inward Dock','Mumbai Plant','Vikram Singh','2026-09-09','','2025-10-01 10:00:00','2026-09-09 10:00:00'),
  (:company,'DEMO-AC-0006','employee','Ganesh Patil','EMP0020','Dispatch & Logistics','Executive','2025-10-01','2027-09-30','active','standard','Plant Dispatch Yard, Gate 2','Mumbai Plant','Vikram Singh','2026-09-08','','2025-10-01 10:00:00','2026-09-08 10:00:00'),
  (:company,'DEMO-AC-0007','contractor','Elite Facility Services - Supervisor',NULL,'Facilities',NULL,'2026-01-05','2026-12-31','active','basic','HO Common Areas','Mumbai HO','Vikram Singh','2026-09-10','Housekeeping contractor badge','2026-01-05 10:00:00','2026-09-10 10:00:00'),
  (:company,'DEMO-AC-0008','visitor','Visitor Pool Card 1',NULL,NULL,NULL,'2025-10-01','2027-09-30','active','basic','HO Reception, Meeting Rooms','Mumbai HO','Vikram Singh','2026-09-05','Returnable at reception','2025-10-01 10:00:00','2026-09-05 10:00:00'),
  (:company,'DEMO-AC-0009','employee','Neha Agarwal','EMP0016','Information Technology','Senior Executive','2025-10-01','2027-09-30','blocked','standard','HO All Floors','Mumbai HO','Vikram Singh','2026-08-30','Reported lost on 2026-08-30; replacement issued','2025-10-01 10:00:00','2026-08-31 10:00:00'),
  (:company,'DEMO-AC-0010','employee','Neha Agarwal','EMP0016','Information Technology','Senior Executive','2026-08-31','2027-09-30','active','standard','HO All Floors','Mumbai HO','Vikram Singh','2026-09-10','Replacement for DEMO-AC-0009','2026-08-31 10:00:00','2026-09-10 10:00:00');

-- ============================================================================
-- hr_id_cards — delete predicate: DEMO- prefixed cardNumber within anchor company
-- ============================================================================
DELETE FROM hr_id_cards WHERE "companyId" = :company AND "cardNumber" LIKE 'DEMO-%';
INSERT INTO hr_id_cards
  ("companyId","cardNumber","cardType","issuedTo","employeeCode",department,designation,"issueDate","expiryDate",
   status,"bloodGroup","emergencyContact",photo,location,"issuedBy",remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-ID-0001','employee','Rajesh Kumar','EMP0001','Management','Chief Executive Officer','2025-10-01','2028-09-30','active','B+','+91-98200-11001',true,'Mumbai HO','Vikram Singh',NULL,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-ID-0002','employee','Priya Sharma','EMP0002','Management','Chief Operating Officer','2025-10-01','2028-09-30','active','O+','+91-98200-11002',true,'Mumbai HO','Vikram Singh',NULL,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-ID-0003','employee','Anita Desai','EMP0003','Human Resources','Manager','2025-10-01','2028-09-30','active','A+','+91-98200-11003',true,'Mumbai HO','Vikram Singh',NULL,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-ID-0004','employee','Amit Verma','EMP0007','Production','Manager','2025-10-01','2028-09-30','active','AB+','+91-98200-11007',true,'Mumbai Plant','Vikram Singh',NULL,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-ID-0005','employee','Kiran Reddy','EMP0008','Production','Senior Executive','2025-10-01','2028-09-30','active','B-','+91-98200-11008',true,'Mumbai Plant','Vikram Singh',NULL,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-ID-0006','employee','Sunita Rao','EMP0011','Quality Control','Manager','2025-10-01','2028-09-30','active','O-','+91-98200-11011',true,'Mumbai Plant','Vikram Singh',NULL,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-ID-0007','employee','Sanjay Malhotra','EMP0017','Sales & Marketing','Manager','2025-10-01','2028-09-30','active','A-','+91-98200-11017',true,'Mumbai HO','Vikram Singh',NULL,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-ID-0008','employee','Ramesh Yadav','EMP0019','Maintenance','Senior Executive','2025-10-01','2028-09-30','lost','B+','+91-98200-11019',true,'Mumbai Plant','Vikram Singh','Lost during site visit 2026-06-20; FIR copy on file','2025-10-01 10:00:00','2026-06-22 10:00:00'),
  (:company,'DEMO-ID-0009','employee','Ramesh Yadav','EMP0019','Maintenance','Senior Executive','2026-06-23','2028-09-30','active','B+','+91-98200-11019',true,'Mumbai Plant','Vikram Singh','Replacement for DEMO-ID-0008','2026-06-23 10:00:00','2026-06-23 10:00:00'),
  (:company,'DEMO-ID-0010','trainee','Campus Trainee - Batch 26A',NULL,'Production','Trainee','2026-07-01','2026-12-31','active',NULL,'+91-98200-22001',true,'Mumbai Plant','Vikram Singh','6-month NEEM trainee badge','2026-07-01 10:00:00','2026-07-01 10:00:00');

-- ============================================================================
-- hr_certificate_requests — delete predicate: remarks='demo-seed' within anchor company
-- ============================================================================
DELETE FROM hr_certificate_requests WHERE "companyId" = :company AND remarks = 'demo-seed';
INSERT INTO hr_certificate_requests
  ("companyId","recordType","requestDate",purpose,"addressedTo",period,"includeBreakup","deliveryMode",
   status,"requestedBy","approvedBy","approvedOn","generatedOn","deliveredOn","rejectedReason",remarks,"createdAt","updatedAt")
VALUES
  (:company,'salary','2025-11-10','Home loan application','HDFC Bank Ltd','Apr 2025 - Oct 2025',true,'email','delivered','Suresh Patel','Anita Desai','2025-11-11','2025-11-12','2025-11-12',NULL,'demo-seed','2025-11-10 10:00:00','2025-11-12 10:00:00'),
  (:company,'employment','2025-12-18','Visa application - US B1 for trade show','US Consulate Mumbai',NULL,false,'physical','delivered','Sanjay Malhotra','Anita Desai','2025-12-19','2025-12-20','2025-12-22',NULL,'demo-seed','2025-12-18 10:00:00','2025-12-22 10:00:00'),
  (:company,'salary','2026-02-04','Rental agreement income proof','Landlord - Thane property','Nov 2025 - Jan 2026',true,'email','delivered','Neha Agarwal','Vikram Singh','2026-02-05','2026-02-05','2026-02-05',NULL,'demo-seed','2026-02-04 10:00:00','2026-02-05 10:00:00'),
  (:company,'experience','2026-03-15','Part-time MBA admission','NMIMS Mumbai',NULL,false,'email','delivered','Kiran Reddy','Anita Desai','2026-03-16','2026-03-17','2026-03-17',NULL,'demo-seed','2026-03-15 10:00:00','2026-03-17 10:00:00'),
  (:company,'employment','2026-05-08','Vehicle loan application','ICICI Bank Ltd',NULL,false,'email','delivered','Ganesh Patil','Vikram Singh','2026-05-09','2026-05-11','2026-05-11',NULL,'demo-seed','2026-05-08 10:00:00','2026-05-11 10:00:00'),
  (:company,'salary','2026-07-22','Credit card limit enhancement','Axis Bank Ltd','Jan 2026 - Jun 2026',true,'email','generated','Pooja Mehta','Anita Desai','2026-07-23','2026-07-24',NULL,NULL,'demo-seed','2026-07-22 10:00:00','2026-07-24 10:00:00'),
  (:company,'address','2026-08-14','Passport re-issue address proof','Passport Seva Kendra Lower Parel',NULL,false,'physical','approved','Deepak Joshi','Vikram Singh','2026-08-16',NULL,NULL,NULL,'demo-seed','2026-08-14 10:00:00','2026-08-16 10:00:00'),
  (:company,'employment','2026-09-05','Schengen visa - Host Milano exhibition','VFS Global Mumbai',NULL,false,'email','pending',NULL,NULL,NULL,NULL,NULL,NULL,'demo-seed','2026-09-05 10:00:00','2026-09-05 10:00:00');

-- ============================================================================
-- hr_certification_tracking (employee professional certs)
-- delete predicate: anchor company (table demo-owned for this companyId)
-- ============================================================================
DELETE FROM hr_certification_tracking WHERE "companyId" = :company;
INSERT INTO hr_certification_tracking
  ("companyId","employeeId","employeeName","employeeCode",name,issuer,"issueDate","expiryDate",status,"renewalHistory","createdAt","updatedAt")
VALUES
  (:company,NULL,'Kiran Reddy','EMP0008','Certified Welding Inspector (CWI)','American Welding Society','2024-06-15','2027-06-14','active',NULL,'2025-10-05 10:00:00','2025-10-05 10:00:00'),
  (:company,NULL,'Sunita Rao','EMP0011','ISO 9001:2015 Lead Auditor','IRCA / BSI','2023-09-20','2026-09-19','expiring_soon','[{"renewedOn":"2023-09-20","validTill":"2026-09-19"}]','2025-10-05 10:00:00','2026-08-20 10:00:00'),
  (:company,NULL,'Ajay Pillai','EMP0012','Six Sigma Green Belt','ASQ','2025-01-10',NULL,'active',NULL,'2025-10-05 10:00:00','2025-10-05 10:00:00'),
  (:company,NULL,'Arun Gupta','EMP0015','AWS Solutions Architect Associate','Amazon Web Services','2025-03-18','2028-03-17','active',NULL,'2025-10-05 10:00:00','2025-10-05 10:00:00'),
  (:company,NULL,'Neha Agarwal','EMP0016','Microsoft Azure Administrator (AZ-104)','Microsoft','2026-02-25','2027-02-24','active',NULL,'2026-02-26 10:00:00','2026-02-26 10:00:00'),
  (:company,NULL,'Ramesh Yadav','EMP0019','Certified Maintenance & Reliability Technician','SMRP','2024-11-05','2027-11-04','active',NULL,'2025-10-05 10:00:00','2025-10-05 10:00:00'),
  (:company,NULL,'Suresh Patel','EMP0005','GST Practitioner Certification','NACIN','2023-08-12','2026-08-11','expired','[{"renewedOn":"2023-08-12","validTill":"2026-08-11"}]','2025-10-05 10:00:00','2026-08-12 10:00:00'),
  (:company,NULL,'Ganesh Patil','EMP0020','Dangerous Goods Regulations (DGR) Cat 6','IATA','2025-12-01','2027-11-30','active',NULL,'2025-12-02 10:00:00','2025-12-02 10:00:00');

-- ============================================================================
-- hr_compliance_audits — delete predicate: DEMO- prefixed auditId within anchor company
-- ============================================================================
DELETE FROM hr_compliance_audits WHERE "companyId" = :company AND "auditId" LIKE 'DEMO-%';
INSERT INTO hr_compliance_audits
  ("companyId","auditId",title,"auditType",scope,auditor,"scheduledDate","completedDate",status,findings,"criticalFindings","complianceScore","nextAuditDue","createdAt","updatedAt")
VALUES
  (:company,'DEMO-CAUD-001','Annual Statutory Labour Compliance Audit FY25-26','statutory','["PF","ESI","PT","Gratuity","Bonus","Factories Act registers"]','Deloitte Haskins & Sells','2025-11-20','2025-11-28','completed',6,1,88.5,'2026-11-20','2025-11-20 10:00:00','2025-11-28 10:00:00'),
  (:company,'DEMO-CAUD-002','POSH Compliance Review CY2025','internal','["IC constitution","Annual report filing","Awareness training coverage"]','Anita Desai','2026-01-15','2026-01-18','completed',2,0,94.0,'2027-01-15','2026-01-15 10:00:00','2026-01-18 10:00:00'),
  (:company,'DEMO-CAUD-003','Contract Labour (CLRA) Compliance Audit','statutory','["Contractor licences","Wage registers","PF remittance of contractors"]','TeamLease RegTech','2026-04-08','2026-04-12','completed',4,1,82.0,'2026-10-08','2026-04-08 10:00:00','2026-04-12 10:00:00'),
  (:company,'DEMO-CAUD-004','Factory Safety & EHS Statutory Audit','safety','["Factories Act 1948","MSIH Rules","Fire NOC","Pressure vessels"]','Bureau Veritas','2026-06-10','2026-06-14','completed',7,2,79.5,'2027-06-10','2026-06-10 10:00:00','2026-06-14 10:00:00'),
  (:company,'DEMO-CAUD-005','Half-Yearly Payroll Statutory Health Check','internal','["TDS 24Q","PF ECR reconciliation","ESI contribution reconciliation"]','Suresh Patel','2026-10-05',NULL,'scheduled',0,0,NULL,'2027-04-05','2026-09-01 10:00:00','2026-09-01 10:00:00');

-- ============================================================================
-- hr_compliance_certificates — delete predicate: DEMO- prefixed certificateCode within anchor company
-- ============================================================================
DELETE FROM hr_compliance_certificates WHERE "companyId" = :company AND "certificateCode" LIKE 'DEMO-%';
INSERT INTO hr_compliance_certificates
  ("companyId","certificateCode","certificateName","certificateType","issuingAuthority","certificateNumber",
   "issueDate","validFrom","validTo",scope,description,status,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-CERT-001','ISO 9001:2015 Quality Management System','iso','TUV SUD South Asia','IN-QMS-118842','2024-07-01','2024-07-01','2027-06-30','Design and manufacture of commercial kitchen equipment','QMS certification for Mumbai plant and HO','active','2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-CERT-002','ISO 14001:2015 Environmental Management','iso','TUV SUD South Asia','IN-EMS-77120','2024-07-01','2024-07-01','2027-06-30','Manufacturing operations, Mumbai plant','EMS certification covering effluent and waste handling','active','2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-CERT-003','ISO 45001:2018 Occupational Health & Safety','iso','Bureau Veritas','IND-OHS-30455','2025-10-20','2025-10-20','2028-10-19','Fabrication, assembly and dispatch operations','OH&S management system for plant workforce','active','2025-10-20 10:00:00','2025-10-20 10:00:00'),
  (:company,'DEMO-CERT-004','CE Marking - Cooking Line Series','product','TUV Rheinland','CE-2861-KE-24','2025-02-14','2025-02-14',NULL,'Combi ovens and cooking ranges (export models)','EU conformity for exported cooking equipment','active','2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'DEMO-CERT-005','NSF/ANSI 2 Food Equipment Certification','product','NSF International','NSF-C0092841','2025-05-30','2025-05-30','2026-05-29','Food-contact stainless steel prep equipment (US market)','Required for US commercial kitchen sales','expired','2025-10-01 10:00:00','2026-06-01 10:00:00'),
  (:company,'DEMO-CERT-006','BIS Certification - Commercial Refrigeration','product','Bureau of Indian Standards','R-41200983','2026-01-08','2026-01-08','2028-01-07','Reach-in chillers and freezer cabinets','IS 17550 compliance for domestic market','active','2026-01-08 10:00:00','2026-01-08 10:00:00');

-- ============================================================================
-- hr_compliance_licenses — delete predicate: remarks='demo-seed' within anchor company
-- ============================================================================
DELETE FROM hr_compliance_licenses WHERE "companyId" = :company AND remarks = 'demo-seed';
INSERT INTO hr_compliance_licenses
  ("companyId","recordType",name,number,authority,category,status,location,"applicableTo",
   "issueDate","expiryDate","renewalFrequency","lastRenewalDate","contactPerson","renewalDueDate",priority,"assignedTo","renewalCost",remarks,"createdAt","updatedAt")
VALUES
  (:company,'license','Factory Licence','MH-FACT-2019-08841','Directorate of Industrial Safety & Health, Maharashtra','factory','active','Mumbai Plant','Manufacturing operations','2025-01-01','2026-12-31','annual','2025-12-10','Anita Desai','2026-11-30','high','Vikram Singh',45000,'demo-seed','2025-10-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'license','Shops & Establishment Registration','MUM-SE-761124','Municipal Corporation of Greater Mumbai','establishment','active','Mumbai HO','Head office staff','2025-04-01','2027-03-31','biennial','2025-03-20','Vikram Singh','2027-02-28','medium','Vikram Singh',8500,'demo-seed','2025-10-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'license','Contract Labour Registration (Principal Employer)','CLRA-PE-MH-30112','Labour Commissioner, Maharashtra','labour','active','Mumbai Plant','Contract workforce up to 120','2025-06-15','2026-06-14','annual','2026-06-10','Anita Desai','2027-05-15','high','Vikram Singh',12000,'demo-seed','2025-10-01 10:00:00','2026-06-10 10:00:00'),
  (:company,'license','Fire Safety NOC','MFB-NOC-2026-1187','Mumbai Fire Brigade','safety','active','Mumbai Plant','Plant + warehouse buildings','2026-02-01','2027-01-31','annual','2026-01-25','Ramesh Yadav','2026-12-31','critical','Ramesh Yadav',22000,'demo-seed','2026-02-01 10:00:00','2026-08-01 10:00:00'),
  (:company,'license','Consent to Operate (Air & Water)','MPCB-CTO-44120','Maharashtra Pollution Control Board','environmental','renewal_due','Mumbai Plant','Fabrication, powder coating shop','2023-10-01','2026-09-30','triennial','2023-09-20','Amit Verma','2026-08-31','critical','Anita Desai',85000,'demo-seed','2025-10-01 10:00:00','2026-08-25 10:00:00'),
  (:company,'license','PF Establishment Registration','MH/BAN/0112233','EPFO Regional Office Mumbai','statutory','active','All locations','All employees','2019-05-01',NULL,'one_time',NULL,'Suresh Patel',NULL,'medium','Suresh Patel',0,'demo-seed','2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'license','ESI Registration','31-00-112233-000-0001','ESIC Regional Office Mumbai','statutory','active','Mumbai Plant','Employees with gross <= 21000','2019-05-01',NULL,'one_time',NULL,'Suresh Patel',NULL,'medium','Suresh Patel',0,'demo-seed','2025-10-01 10:00:00','2025-10-01 10:00:00'),
  (:company,'license','Professional Tax Registration (PTRC)','PT-MH-27331100','Maharashtra GST Department','statutory','active','Mumbai HO','All Maharashtra employees','2019-06-01',NULL,'one_time',NULL,'Meera Nair',NULL,'low','Meera Nair',0,'demo-seed','2025-10-01 10:00:00','2025-10-01 10:00:00');

-- ============================================================================
-- hr_compliance_registers — delete predicate: anchor company (table demo-owned for this companyId)
-- ============================================================================
DELETE FROM hr_compliance_registers WHERE "companyId" = :company;
INSERT INTO hr_compliance_registers
  ("companyId","entryType","registerName",act,"formNumber",requirement,applicability,frequency,responsibility,
   "lastUpdated","nextDue",status,"totalEntries",format,"retentionPeriod",penalties,"createdAt","updatedAt")
VALUES
  (:company,'register','Register of Adult Workers','Factories Act, 1948','Form 12','Maintain particulars of all adult workers employed in the factory','Mumbai Plant','continuous','Anita Desai','2026-09-01','2026-10-01','compliant',196,'digital','3 years','Fine up to Rs.1 lakh under Sec 92','2025-10-01 10:00:00','2026-09-01 10:00:00'),
  (:company,'register','Muster Roll cum Wage Register','Factories Act, 1948 / Payment of Wages Act','Form 17','Daily attendance and monthly wage particulars of workers','Mumbai Plant','monthly','Vikram Singh','2026-09-01','2026-10-07','compliant',196,'digital','3 years','Fine and prosecution of occupier','2025-10-01 10:00:00','2026-09-01 10:00:00'),
  (:company,'register','Register of Overtime','Factories Act, 1948','Form 10','Record of OT hours and double-rate wage payment','Mumbai Plant','monthly','Vikram Singh','2026-09-01','2026-10-07','compliant',48,'digital','3 years','Sec 59 violation penalties','2025-10-01 10:00:00','2026-09-01 10:00:00'),
  (:company,'register','Register of Leave with Wages','Factories Act, 1948','Form 20','Annual leave entitlement and availment per worker','Mumbai Plant','annual','Anita Desai','2026-01-10','2027-01-31','compliant',196,'digital','3 years','Fine up to Rs.1 lakh','2025-10-01 10:00:00','2026-01-10 10:00:00'),
  (:company,'register','Register of Contractors','Contract Labour (R&A) Act, 1970','Form XII','Particulars of contractors, nature of work and workers deployed','Mumbai Plant','continuous','Anita Desai','2026-08-20','2026-09-20','attention_needed',7,'physical','3 years','Sec 23-25 fines and imprisonment','2025-10-01 10:00:00','2026-08-20 10:00:00'),
  (:company,'register','Accident Register','Factories Act, 1948','Form 26','Record of accidents and dangerous occurrences with Form 24 reporting','Mumbai Plant','continuous','Ramesh Yadav','2026-07-14','2026-10-14','compliant',3,'physical','5 years','Prosecution under Sec 92/96','2025-10-01 10:00:00','2026-07-14 10:00:00');

-- ============================================================================
-- hr_compliance_returns — delete predicate: remarks='demo-seed' within anchor company
-- ============================================================================
DELETE FROM hr_compliance_returns WHERE "companyId" = :company AND remarks = 'demo-seed';
INSERT INTO hr_compliance_returns
  ("companyId","returnType","returnMonth","financialYear",establishment,state,"registrationNumber","formType","dueDate","filingDate",
   status,"totalEmployees","coveredEmployees","grossWages","employeeContribution","employerContribution","totalContribution","challanNumber","challanDate","acknowledgmentNumber",remarks,"createdAt","updatedAt")
VALUES
  (:company,'pf','2026-05','2026-27','B3 MACBIS - Mumbai','Maharashtra','MH/BAN/0112233','ECR','2026-06-15','2026-06-12','filed',216,216,10680000,1281600,1379400,2661000,'PFC-260612-8841','2026-06-12','ACK-PF-2605-77120','demo-seed','2026-06-01 10:00:00','2026-06-12 10:00:00'),
  (:company,'pf','2026-06','2026-27','B3 MACBIS - Mumbai','Maharashtra','MH/BAN/0112233','ECR','2026-07-15','2026-07-13','filed',218,218,10820000,1298400,1397100,2695500,'PFC-260713-9022','2026-07-13','ACK-PF-2606-78455','demo-seed','2026-07-01 10:00:00','2026-07-13 10:00:00'),
  (:company,'pf','2026-07','2026-27','B3 MACBIS - Mumbai','Maharashtra','MH/BAN/0112233','ECR','2026-08-15','2026-08-12','filed',220,220,10950000,1314000,1413750,2727750,'PFC-260812-9316','2026-08-12','ACK-PF-2607-79811','demo-seed','2026-08-01 10:00:00','2026-08-12 10:00:00'),
  (:company,'pf','2026-08','2026-27','B3 MACBIS - Mumbai','Maharashtra','MH/BAN/0112233','ECR','2026-09-15',NULL,'draft',221,221,11020000,1322400,1422800,2745200,NULL,NULL,NULL,'demo-seed','2026-09-05 10:00:00','2026-09-05 10:00:00'),
  (:company,'esi','2026-07','2026-27','B3 MACBIS - Mumbai Plant','Maharashtra','31-00-112233-000-0001','MC','2026-08-15','2026-08-11','filed',220,84,1863000,13973,60548,74521,'ESI-260811-4410','2026-08-11','ACK-ESI-2607-30125','demo-seed','2026-08-01 10:00:00','2026-08-11 10:00:00'),
  (:company,'esi','2026-08','2026-27','B3 MACBIS - Mumbai Plant','Maharashtra','31-00-112233-000-0001','MC','2026-09-15',NULL,'draft',221,85,1890000,14175,61425,75600,NULL,NULL,NULL,'demo-seed','2026-09-05 10:00:00','2026-09-05 10:00:00'),
  (:company,'pt','2026-08','2026-27','B3 MACBIS - Mumbai','Maharashtra','PT-MH-27331100','Form III-B','2026-09-30','2026-09-08','filed',221,221,NULL,44200,NULL,44200,'PT-260908-1120','2026-09-08','ACK-PT-2608-66021','demo-seed','2026-09-01 10:00:00','2026-09-08 10:00:00'),
  (:company,'tds','2026-Q1','2026-27','B3 MACBIS - Mumbai','Maharashtra','MUMB08841F','24Q','2026-07-31','2026-07-28','filed',221,168,32400000,NULL,NULL,2916000,'TDS-260728-2210','2026-07-28','ACK-24Q-Q1-90218','demo-seed','2026-07-20 10:00:00','2026-07-28 10:00:00');

-- ============================================================================
-- hr_corporate_cards (parent for card transactions via cardNumber)
-- delete predicate: anchor company (table demo-owned for this companyId)
-- ============================================================================
DELETE FROM hr_corporate_cards WHERE "companyId" = :company;
INSERT INTO hr_corporate_cards
  ("companyId","cardNumber","cardType","cardholderName","employeeCode",department,designation,"cardProvider",
   "creditLimit","availableLimit","currentBalance","monthlySpend","issueDate","expiryDate","lastTransactionDate","billingCycle",status,"createdAt","updatedAt")
VALUES
  (:company,'XXXX-XXXX-XXXX-4521','travel','Rajesh Kumar','EMP0001','Management','Chief Executive Officer','HDFC Corporate',500000,392000,108000,64000,'2025-10-05','2028-10-31','2026-09-06','1st of month','active','2025-10-05 10:00:00','2026-09-06 10:00:00'),
  (:company,'XXXX-XXXX-XXXX-7738','travel','Sanjay Malhotra','EMP0017','Sales & Marketing','Manager','HDFC Corporate',200000,151500,48500,48500,'2025-10-05','2028-10-31','2026-09-04','1st of month','active','2025-10-05 10:00:00','2026-09-04 10:00:00'),
  (:company,'XXXX-XXXX-XXXX-2214','purchase','Mohan Das','EMP0013','Stores & Inventory','Executive','ICICI Business',150000,131800,18200,18200,'2025-11-12','2028-11-30','2026-08-29','5th of month','active','2025-11-12 10:00:00','2026-08-29 10:00:00'),
  (:company,'XXXX-XXXX-XXXX-9903','travel','Pooja Mehta','EMP0018','Sales & Marketing','Senior Executive','HDFC Corporate',100000,73200,26800,26800,'2026-01-15','2029-01-31','2026-09-02','1st of month','active','2026-01-15 10:00:00','2026-09-02 10:00:00'),
  (:company,'XXXX-XXXX-XXXX-5567','purchase','Arun Gupta','EMP0015','Information Technology','Manager','ICICI Business',250000,204000,46000,46000,'2025-12-01','2028-12-31','2026-09-01','5th of month','active','2025-12-01 10:00:00','2026-09-01 10:00:00'),
  (:company,'XXXX-XXXX-XXXX-1180','travel','Ravi Menon','EMP0010','Production','Executive','HDFC Corporate',80000,80000,0,0,'2026-03-10','2029-03-31',NULL,'1st of month','blocked','2026-03-10 10:00:00','2026-07-15 10:00:00');

-- ============================================================================
-- hr_corporate_card_transactions — delete predicate: DEMO- prefixed transactionId within anchor company
-- ============================================================================
DELETE FROM hr_corporate_card_transactions WHERE "companyId" = :company AND "transactionId" LIKE 'DEMO-%';
INSERT INTO hr_corporate_card_transactions
  ("companyId","transactionId","cardNumber","cardType","cardHolder","employeeCode",department,"merchantName",category,
   amount,currency,"transactionDate","transactionTime",location,status,"receiptUploaded",notes,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-TXN-001','XXXX-XXXX-XXXX-4521','travel','Rajesh Kumar','EMP0001','Management','IndiGo Airlines','airfare',28400,'INR','2026-08-18','09:42','Mumbai','reconciled',true,'BOM-DEL return - investor meet','2026-08-18 10:00:00','2026-09-01 10:00:00'),
  (:company,'DEMO-TXN-002','XXXX-XXXX-XXXX-4521','travel','Rajesh Kumar','EMP0001','Management','ITC Maurya New Delhi','hotel',35600,'INR','2026-08-19','14:10','New Delhi','reconciled',true,'2 nights - investor meet','2026-08-19 10:00:00','2026-09-01 10:00:00'),
  (:company,'DEMO-TXN-003','XXXX-XXXX-XXXX-7738','travel','Sanjay Malhotra','EMP0017','Sales & Marketing','MakeMyTrip','airfare',19200,'INR','2026-08-24','11:25','Mumbai','pending',true,'BOM-BLR for Host Bengaluru expo','2026-08-24 10:00:00','2026-08-24 10:00:00'),
  (:company,'DEMO-TXN-004','XXXX-XXXX-XXXX-7738','travel','Sanjay Malhotra','EMP0017','Sales & Marketing','Taj Vivanta Bengaluru','hotel',18700,'INR','2026-08-25','15:40','Bengaluru','pending',false,'3 nights expo stay - bill awaited','2026-08-25 10:00:00','2026-08-25 10:00:00'),
  (:company,'DEMO-TXN-005','XXXX-XXXX-XXXX-2214','purchase','Mohan Das','EMP0013','Stores & Inventory','Amazon Business','consumables',8200,'INR','2026-08-27','16:05','Online','reconciled',true,'Packing consumables - stretch film, labels','2026-08-27 10:00:00','2026-09-02 10:00:00'),
  (:company,'DEMO-TXN-006','XXXX-XXXX-XXXX-2214','purchase','Mohan Das','EMP0013','Stores & Inventory','Industrybuying.com','tools',10000,'INR','2026-08-29','10:18','Online','pending',true,'Torque wrench set for assembly','2026-08-29 10:00:00','2026-08-29 10:00:00'),
  (:company,'DEMO-TXN-007','XXXX-XXXX-XXXX-9903','travel','Pooja Mehta','EMP0018','Sales & Marketing','Uber India','local_travel',1450,'INR','2026-09-02','19:22','Mumbai','pending',true,'Client visits - Andheri to BKC circuit','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'DEMO-TXN-008','XXXX-XXXX-XXXX-9903','travel','Pooja Mehta','EMP0018','Sales & Marketing','Barbeque Nation BKC','client_entertainment',6800,'INR','2026-09-02','21:15','Mumbai','pending',true,'Dinner with Blue Fig Hotels procurement team','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'DEMO-TXN-009','XXXX-XXXX-XXXX-5567','purchase','Arun Gupta','EMP0015','Information Technology','Microsoft India','software',38500,'INR','2026-09-01','12:00','Online','reconciled',true,'M365 E3 true-up licences x11','2026-09-01 10:00:00','2026-09-05 10:00:00'),
  (:company,'DEMO-TXN-010','XXXX-XXXX-XXXX-5567','purchase','Arun Gupta','EMP0015','Information Technology','GoDaddy','software',7500,'INR','2026-07-15','09:30','Online','disputed',false,'Duplicate renewal charge - dispute raised','2026-07-15 10:00:00','2026-08-01 10:00:00');

-- ============================================================================
-- hr_elearning_courses (parent for hr_course_progress via fixed ids)
-- delete predicate: DEMO- prefixed code within anchor company
-- ============================================================================
DELETE FROM hr_course_progress WHERE "companyId" = :company; -- child first (demo-owned for anchor company)
DELETE FROM hr_elearning_courses WHERE "companyId" = :company AND code LIKE 'DEMO-%';
INSERT INTO hr_elearning_courses
  (id,"companyId",code,title,description,category,level,duration,modules,enrolled,rating,reviews,instructor,certification,language,status,"createdAt","updatedAt")
VALUES
  ('de100000-0000-4000-8000-000000000001',:company,'DEMO-LMS-001','TIG/MIG Welding Fundamentals for SS Fabrication','Weld prep, torch technique and finish standards for 304/316 stainless kitchen equipment','Technical','beginner',12,8,34,4.6,21,'Kiran Reddy',true,'Hindi/English','active','2025-10-10 10:00:00','2026-08-01 10:00:00'),
  ('de100000-0000-4000-8000-000000000002',:company,'DEMO-LMS-002','Factory Safety & PPE Essentials','Mandatory induction: machine guarding, LOTO basics, PPE discipline, emergency response','Safety','beginner',6,5,182,4.4,96,'Ramesh Yadav',true,'Hindi/English','active','2025-10-10 10:00:00','2026-08-01 10:00:00'),
  ('de100000-0000-4000-8000-000000000003',:company,'DEMO-LMS-003','ISO 9001:2015 Awareness for Shop Floor','Process approach, NC handling and audit readiness for production teams','Quality','beginner',4,4,88,4.2,40,'Sunita Rao',false,'Hindi/English','active','2025-11-05 10:00:00','2026-08-01 10:00:00'),
  ('de100000-0000-4000-8000-000000000004',:company,'DEMO-LMS-004','MACBIS ERP - Sales to Dispatch Flow','Enquiry, estimation, order booking, production handoff and dispatch in the ERP','Process','intermediate',8,6,52,4.5,27,'Arun Gupta',true,'English','active','2025-12-01 10:00:00','2026-08-01 10:00:00'),
  ('de100000-0000-4000-8000-000000000005',:company,'DEMO-LMS-005','POSH Awareness & Prevention','Mandatory annual training on prevention of sexual harassment at workplace','Compliance','beginner',2,3,214,4.3,112,'Anita Desai',true,'Hindi/English','active','2026-01-05 10:00:00','2026-08-01 10:00:00'),
  ('de100000-0000-4000-8000-000000000006',:company,'DEMO-LMS-006','Commercial Kitchen Design Basics','Airflow, workflow zoning, gas/electrical loads for kitchen layout proposals','Technical','intermediate',10,7,26,4.7,14,'Priya Sharma',false,'English','active','2026-02-10 10:00:00','2026-08-01 10:00:00'),
  ('de100000-0000-4000-8000-000000000007',:company,'DEMO-LMS-007','GST for Manufacturing Finance Teams','E-invoicing, ITC on capital goods, job-work provisions and returns calendar','Finance','intermediate',6,5,18,4.1,9,'Suresh Patel',false,'English','active','2026-03-15 10:00:00','2026-08-01 10:00:00'),
  ('de100000-0000-4000-8000-000000000008','b3000000-0000-4000-8000-000000000001','DEMO-LMS-008','First-Time Manager Toolkit','Delegation, feedback conversations, leave/attendance approvals and team KPIs','Leadership','intermediate',8,6,15,4.5,7,'Anita Desai',true,'English','active','2026-05-01 10:00:00','2026-08-01 10:00:00');

-- ============================================================================
-- hr_course_progress (child of hr_elearning_courses via courseId; delete handled above with parent)
-- ============================================================================
INSERT INTO hr_course_progress
  ("companyId","courseId","employeeId","employeeName","progressPct","completedLessons","totalLessons","timeSpentMinutes",status,"enrollmentDate","createdAt","updatedAt")
VALUES
  (:company,'de100000-0000-4000-8000-000000000001',NULL,'Deepak Joshi',100,8,8,610,'completed','2025-10-20','2025-10-20 10:00:00','2025-12-18 10:00:00'),
  (:company,'de100000-0000-4000-8000-000000000001',NULL,'Ravi Menon',62.5,5,8,340,'in_progress','2026-04-05','2026-04-05 10:00:00','2026-08-28 10:00:00'),
  (:company,'de100000-0000-4000-8000-000000000002',NULL,'Ganesh Patil',100,5,5,290,'completed','2025-10-15','2025-10-15 10:00:00','2025-11-02 10:00:00'),
  (:company,'de100000-0000-4000-8000-000000000002',NULL,'Lakshmi Iyer',100,5,5,275,'completed','2025-10-15','2025-10-15 10:00:00','2025-11-10 10:00:00'),
  (:company,'de100000-0000-4000-8000-000000000004',NULL,'Pooja Mehta',83.3,5,6,410,'in_progress','2026-06-10','2026-06-10 10:00:00','2026-09-04 10:00:00'),
  (:company,'de100000-0000-4000-8000-000000000005',NULL,'Amit Verma',100,3,3,95,'completed','2026-01-12','2026-01-12 10:00:00','2026-01-20 10:00:00'),
  (:company,'de100000-0000-4000-8000-000000000005',NULL,'Sanjay Malhotra',33.3,1,3,30,'in_progress','2026-07-01','2026-07-01 10:00:00','2026-08-15 10:00:00'),
  (:company,'de100000-0000-4000-8000-000000000008',NULL,'Kiran Reddy',0,0,6,0,'not_started','2026-08-20','2026-08-20 10:00:00','2026-08-20 10:00:00');

-- ============================================================================
-- hr_disciplinary_actions — delete predicate: anchor company (table demo-owned for this companyId)
-- ============================================================================
DELETE FROM hr_disciplinary_actions WHERE "companyId" = :company;
INSERT INTO hr_disciplinary_actions
  ("companyId","employeeId","employeeName",department,designation,"actionType","violationCategory","incidentDate","actionDate",
   "issuedBy",severity,description,justification,"appealStatus",status,"effectiveUntil",remarks,"createdAt","updatedAt")
VALUES
  (:company,NULL,'Ravi Menon','Production','Executive','verbal_warning','attendance','2025-12-08','2025-12-10','Amit Verma','minor','Repeated late arrival - 6 instances in November 2025','Pattern continued after informal counselling by supervisor','not_filed','closed','2026-03-10',NULL,'2025-12-10 10:00:00','2026-03-11 10:00:00'),
  (:company,NULL,'Deepak Joshi','Production','Executive','written_warning','safety_violation','2026-02-18','2026-02-20','Amit Verma','major','Operated shearing machine without safety guard engaged','CCTV-verified; second safety infraction in 12 months','not_filed','active','2026-08-20',NULL,'2026-02-20 10:00:00','2026-02-20 10:00:00'),
  (:company,NULL,'Ajay Pillai','Quality Control','Executive','verbal_warning','process_violation','2026-04-22','2026-04-24','Sunita Rao','minor','Released inspection lot without recording torque test values','Values later verified OK; documentation lapse only','not_filed','closed','2026-07-24',NULL,'2026-04-24 10:00:00','2026-07-25 10:00:00'),
  (:company,NULL,'Ganesh Patil','Dispatch & Logistics','Executive','written_warning','negligence','2026-06-11','2026-06-14','Priya Sharma','major','Dispatched order SO-2610 without final QC clearance tag','Customer complaint avoided by recall; process breach confirmed','filed','active','2026-12-14','Appeal filed 2026-06-20, review pending','2026-06-14 10:00:00','2026-06-21 10:00:00'),
  (:company,NULL,'Ravi Menon','Production','Executive','suspension','insubordination','2026-08-03','2026-08-07','Anita Desai','severe','Refused shift-change instruction and altercation with supervisor','Domestic enquiry concluded 2026-08-06; 3-day suspension without pay','not_filed','active','2027-02-07',NULL,'2026-08-07 10:00:00','2026-08-07 10:00:00');

-- ============================================================================
-- hr_documents — delete predicate: DEMO- prefixed documentNumber within anchor company
-- ============================================================================
DELETE FROM hr_documents WHERE "companyId" = :company AND "documentNumber" LIKE 'DEMO-%';
INSERT INTO hr_documents
  ("companyId","docCategory","documentType","documentNumber",title,"issuingAuthority","issueDate","expiryDate","uploadedOn","uploadedBy",
   status,"fileName","fileSize","verifiedBy","verifiedOn","employeeId","employeeName","employeeCode",department,"remindersSent",remarks,"createdAt","updatedAt")
VALUES
  (:company,'personal','aadhaar','DEMO-DOC-001','Aadhaar Card - Amit Verma','UIDAI','2018-03-12',NULL,'2025-10-05','Vikram Singh','verified','aadhaar_emp0007.pdf','412 KB','Vikram Singh','2025-10-06',NULL,'Amit Verma','EMP0007','Production',0,NULL,'2025-10-05 10:00:00','2025-10-06 10:00:00'),
  (:company,'personal','pan','DEMO-DOC-002','PAN Card - Amit Verma','Income Tax Department','2012-07-20',NULL,'2025-10-05','Vikram Singh','verified','pan_emp0007.pdf','188 KB','Vikram Singh','2025-10-06',NULL,'Amit Verma','EMP0007','Production',0,NULL,'2025-10-05 10:00:00','2025-10-06 10:00:00'),
  (:company,'personal','passport','DEMO-DOC-003','Passport - Sanjay Malhotra','Passport Office Mumbai','2019-11-02','2029-11-01','2025-10-08','Vikram Singh','verified','passport_emp0017.pdf','520 KB','Anita Desai','2025-10-09',NULL,'Sanjay Malhotra','EMP0017','Sales & Marketing',0,'Needed for overseas trade shows','2025-10-08 10:00:00','2025-10-09 10:00:00'),
  (:company,'education','degree','DEMO-DOC-004','BE Mechanical Degree - Kiran Reddy','JNTU Hyderabad','2014-06-30',NULL,'2025-10-12','Vikram Singh','verified','degree_emp0008.pdf','1.2 MB','Anita Desai','2025-10-15',NULL,'Kiran Reddy','EMP0008','Production',0,NULL,'2025-10-12 10:00:00','2025-10-15 10:00:00'),
  (:company,'employment','offer_letter','DEMO-DOC-005','Offer Letter - Neha Agarwal','B3 MACBIS HR','2022-04-18',NULL,'2025-10-20','Anita Desai','verified','offer_emp0016.pdf','96 KB','Anita Desai','2025-10-20',NULL,'Neha Agarwal','EMP0016','Information Technology',0,NULL,'2025-10-20 10:00:00','2025-10-20 10:00:00'),
  (:company,'personal','driving_license','DEMO-DOC-006','Driving Licence - Ganesh Patil','RTO Mumbai West','2020-02-14','2026-02-13','2025-11-02','Vikram Singh','expired','dl_emp0020.pdf','340 KB','Vikram Singh','2025-11-03',NULL,'Ganesh Patil','EMP0020','Dispatch & Logistics',2,'Renewal reminder sent; required for company vehicle use','2025-11-02 10:00:00','2026-08-14 10:00:00'),
  (:company,'personal','medical_fitness','DEMO-DOC-007','Annual Medical Fitness - Ramesh Yadav','Apollo Clinic Andheri','2026-01-09','2027-01-08','2026-01-12','Vikram Singh','verified','medical_emp0019.pdf','275 KB','Anita Desai','2026-01-13',NULL,'Ramesh Yadav','EMP0019','Maintenance',0,'Height-work fitness included','2026-01-12 10:00:00','2026-01-13 10:00:00'),
  (:company,'employment','experience_letter','DEMO-DOC-008','Previous Employer Letter - Pooja Mehta','Elgi Equipments Ltd','2023-12-31',NULL,'2026-02-01','Vikram Singh','pending','exp_letter_emp0018.pdf','150 KB',NULL,NULL,NULL,'Pooja Mehta','EMP0018','Sales & Marketing',1,'Background verification in progress','2026-02-01 10:00:00','2026-07-10 10:00:00'),
  (:company,'statutory','uan','DEMO-DOC-009','UAN Allotment - Lakshmi Iyer','EPFO','2021-08-25',NULL,'2026-03-05','Vikram Singh','verified','uan_emp0014.pdf','88 KB','Suresh Patel','2026-03-06',NULL,'Lakshmi Iyer','EMP0014','Stores & Inventory',0,NULL,'2026-03-05 10:00:00','2026-03-06 10:00:00'),
  (:company,'personal','aadhaar','DEMO-DOC-010','Aadhaar Card - Mohan Das','UIDAI','2017-05-19',NULL,'2026-06-15','Vikram Singh','rejected','aadhaar_emp0013.pdf','96 KB','Vikram Singh','2026-06-16',NULL,'Mohan Das','EMP0013','Stores & Inventory',1,'Scan illegible - re-upload requested','2026-06-15 10:00:00','2026-06-16 10:00:00');

-- ============================================================================
-- hr_document_audit_logs — delete predicate: anchor company (table demo-owned for this companyId)
-- ============================================================================
DELETE FROM hr_document_audit_logs WHERE "companyId" = :company;
INSERT INTO hr_document_audit_logs
  ("companyId","timestamp",action,"documentType","documentId","employeeId","employeeName","performedBy","performedByRole","ipAddress",remarks,"createdAt")
VALUES
  (:company,'2026-06-16 11:20:00','reject','aadhaar','DEMO-DOC-010',NULL,'Mohan Das','Vikram Singh','HR Executive','192.168.10.45','Scan illegible - re-upload requested','2026-06-16 11:20:00'),
  (:company,'2026-08-14 09:05:00','reminder','driving_license','DEMO-DOC-006',NULL,'Ganesh Patil','System','Scheduler','127.0.0.1','Expiry reminder #2 emailed to employee and manager','2026-08-14 09:05:00'),
  (:company,'2026-07-10 15:42:00','view','experience_letter','DEMO-DOC-008',NULL,'Pooja Mehta','Anita Desai','HR Manager','192.168.10.31','Reviewed during BGV follow-up','2026-07-10 15:42:00'),
  (:company,'2026-01-13 10:12:00','verify','medical_fitness','DEMO-DOC-007',NULL,'Ramesh Yadav','Anita Desai','HR Manager','192.168.10.31','Fitness certificate accepted','2026-01-13 10:12:00'),
  (:company,'2025-10-09 14:30:00','verify','passport','DEMO-DOC-003',NULL,'Sanjay Malhotra','Anita Desai','HR Manager','192.168.10.31','Verified against original','2025-10-09 14:30:00');

-- ============================================================================
-- hr_employee_movements — delete predicate: anchor company (table demo-owned for this companyId)
-- ============================================================================
DELETE FROM hr_employee_movements WHERE "companyId" = :company;
INSERT INTO hr_employee_movements
  ("companyId","employeeCode",name,type,"fromDesignation","toDesignation","fromDepartment","toDepartment","fromLocation","toLocation",
   "effectiveDate","requestDate","requestedBy","approvedBy",reason,"salaryIncrement",status,"createdAt","updatedAt")
VALUES
  (:company,'EMP0008','Kiran Reddy','promotion','Senior Executive','Assistant Manager','Production','Production','Mumbai Plant','Mumbai Plant','2026-04-01','2026-03-05','Amit Verma','Priya Sharma','Consistent A rating; led Bay 2 TIG line upgrade',18,'completed','2026-03-05 10:00:00','2026-04-01 10:00:00'),
  (:company,'EMP0016','Neha Agarwal','promotion','Senior Executive','Assistant Manager','Information Technology','Information Technology','Mumbai HO','Mumbai HO','2026-04-01','2026-03-05','Arun Gupta','Priya Sharma','ERP support ownership and Azure migration delivery',16,'completed','2026-03-05 10:00:00','2026-04-01 10:00:00'),
  (:company,'EMP0014','Lakshmi Iyer','transfer','Executive','Executive','Stores & Inventory','Dispatch & Logistics','Mumbai Plant Stores','Mumbai Plant Dispatch','2026-06-01','2026-05-10','Mohan Das','Priya Sharma','Cross-training for dispatch documentation backup',0,'completed','2026-05-10 10:00:00','2026-06-01 10:00:00'),
  (:company,'EMP0009','Deepak Joshi','transfer','Executive','Executive','Production','Quality Control','Mumbai Plant Bay 1','Mumbai Plant QC Lab','2026-07-15','2026-06-20','Amit Verma','Sunita Rao','Weld inspection aptitude; QC bench strength',0,'completed','2026-06-20 10:00:00','2026-07-15 10:00:00'),
  (:company,'EMP0018','Pooja Mehta','promotion','Senior Executive','Assistant Manager','Sales & Marketing','Sales & Marketing','Mumbai HO','Mumbai HO','2026-10-01','2026-08-25','Sanjay Malhotra',NULL,'Exceeded H1 target by 32%; key account wins',15,'pending','2026-08-25 10:00:00','2026-08-25 10:00:00'),
  (:company,'EMP0012','Ajay Pillai','lateral_move','Executive','Executive','Quality Control','Quality Control','Mumbai Plant QC Lab','Bengaluru Site Office','2026-09-20','2026-08-18','Sunita Rao','Priya Sharma','Site QC coverage for South region installations',5,'approved','2026-08-18 10:00:00','2026-09-01 10:00:00'),
  (:company,'EMP0010','Ravi Menon','demotion','Executive','Junior Executive','Production','Production','Mumbai Plant','Mumbai Plant','2026-08-10','2026-08-07','Anita Desai','Priya Sharma','Outcome of disciplinary enquiry dated 2026-08-06',-8,'completed','2026-08-07 10:00:00','2026-08-10 10:00:00'),
  (:company,'EMP0004','Vikram Singh','transfer','Senior Executive','Senior Executive','Human Resources','Human Resources','Mumbai HO','Mumbai Plant','2025-12-01','2025-11-02','Anita Desai','Rajesh Kumar','Plant HR desk for worker relations and compliance',0,'completed','2025-11-02 10:00:00','2025-12-01 10:00:00');

-- ============================================================================
-- hr_expense_budgets — delete predicate: anchor company (table demo-owned for this companyId)
-- ============================================================================
DELETE FROM hr_expense_budgets WHERE "companyId" = :company;
INSERT INTO hr_expense_budgets
  ("companyId",department,period,"budgetAmount","spentAmount","pendingAmount","availableAmount","utilizationPercent","categoryBreakdown",status,"createdAt","updatedAt")
VALUES
  (:company,'Sales & Marketing','FY2026-27 Q1',600000,412000,48000,140000,68.7,'{"travel":248000,"client_entertainment":86000,"exhibitions":78000}','active','2026-04-01 10:00:00','2026-07-05 10:00:00'),
  (:company,'Sales & Marketing','FY2026-27 Q2',600000,318500,75300,206200,53.1,'{"travel":198500,"client_entertainment":64000,"exhibitions":56000}','active','2026-07-01 10:00:00','2026-09-08 10:00:00'),
  (:company,'Production','FY2026-27 Q2',180000,92400,12800,74800,51.3,'{"local_travel":31400,"tools_consumables":48000,"training":13000}','active','2026-07-01 10:00:00','2026-09-05 10:00:00'),
  (:company,'Information Technology','FY2026-27 Q2',250000,164500,21000,64500,65.8,'{"software":118500,"travel":24000,"hardware_misc":22000}','active','2026-07-01 10:00:00','2026-09-05 10:00:00'),
  (:company,'Management','FY2026-27 Q2',400000,241600,0,158400,60.4,'{"travel":186600,"board_meetings":55000}','active','2026-07-01 10:00:00','2026-09-06 10:00:00'),
  (:company,'Human Resources','FY2026-27 Q2',120000,58200,9500,52300,48.5,'{"recruitment":26000,"training":22200,"welfare":10000}','active','2026-07-01 10:00:00','2026-09-01 10:00:00');

-- ============================================================================
-- hr_expense_claims — delete predicate: DEMO- prefixed claimNumber within anchor company
-- ============================================================================
DELETE FROM hr_expense_claims WHERE "companyId" = :company AND "claimNumber" LIKE 'DEMO-%';
INSERT INTO hr_expense_claims
  ("companyId",kind,"claimNumber","employeeCode","employeeName",department,designation,category,"claimType",description,
   amount,"advanceAmount","netPayable",destination,"travelDates","billDate","submissionDate","itemsCount","receiptAttached",priority,
   status,approver,"approvedDate","paidDate","paymentMethod","paymentReference","rejectionReason","createdAt","updatedAt")
VALUES
  (:company,'expense','DEMO-EXP-2025-001','EMP0017','Sanjay Malhotra','Sales & Marketing','Manager','travel','domestic_travel','Chennai customer visits - Harbour Grill India franchise',24800,10000,14800,'Chennai','2025-11-18 to 2025-11-20','2025-11-20','2025-11-24',6,true,'medium','paid','Priya Sharma','2025-11-26','2025-11-30','bank_transfer','NEFT-25113001',NULL,'2025-11-24 10:00:00','2025-11-30 10:00:00'),
  (:company,'expense','DEMO-EXP-2025-002','EMP0019','Ramesh Yadav','Maintenance','Senior Executive','tools','purchase','Emergency bearing purchase for press brake breakdown',6200,0,6200,NULL,NULL,'2025-12-14','2025-12-15',1,true,'high','paid','Amit Verma','2025-12-16','2025-12-19','bank_transfer','NEFT-25121901',NULL,'2025-12-15 10:00:00','2025-12-19 10:00:00'),
  (:company,'expense','DEMO-EXP-2026-003','EMP0018','Pooja Mehta','Sales & Marketing','Senior Executive','travel','domestic_travel','Pune site survey - Campus Dining kitchen retrofit',9400,0,9400,'Pune','2026-01-21 to 2026-01-22','2026-01-22','2026-01-27',4,true,'medium','paid','Sanjay Malhotra','2026-01-29','2026-02-03','bank_transfer','NEFT-26020301',NULL,'2026-01-27 10:00:00','2026-02-03 10:00:00'),
  (:company,'expense','DEMO-EXP-2026-004','EMP0015','Arun Gupta','Information Technology','Manager','communication','reimbursement','Broadband + mobile Feb-Apr 2026 (WFH support policy)',5400,0,5400,NULL,NULL,'2026-04-30','2026-05-04',3,true,'low','paid','Priya Sharma','2026-05-06','2026-05-12','payroll','PAY-2605-EMP0015',NULL,'2026-05-04 10:00:00','2026-05-12 10:00:00'),
  (:company,'expense','DEMO-EXP-2026-005','EMP0011','Sunita Rao','Quality Control','Manager','training','certification','ISO 9001 lead auditor renewal exam fee',21500,0,21500,NULL,NULL,'2026-06-08','2026-06-10',1,true,'medium','approved','Priya Sharma','2026-06-13',NULL,NULL,NULL,NULL,'2026-06-10 10:00:00','2026-06-13 10:00:00'),
  (:company,'expense','DEMO-EXP-2026-006','EMP0020','Ganesh Patil','Dispatch & Logistics','Executive','local_travel','reimbursement','Octroi/toll and loading labour for urgent Thane delivery',3150,0,3150,'Thane',NULL,'2026-07-09','2026-07-10',5,true,'low','paid','Priya Sharma','2026-07-11','2026-07-17','bank_transfer','NEFT-26071701',NULL,'2026-07-10 10:00:00','2026-07-17 10:00:00'),
  (:company,'expense','DEMO-EXP-2026-007','EMP0017','Sanjay Malhotra','Sales & Marketing','Manager','travel','domestic_travel','Bengaluru - Host expo booth duty and client meetings',31200,15000,16200,'Bengaluru','2026-08-24 to 2026-08-27','2026-08-27','2026-09-01',8,true,'high','pending_approval','Priya Sharma',NULL,NULL,NULL,NULL,NULL,'2026-09-01 10:00:00','2026-09-01 10:00:00'),
  (:company,'expense','DEMO-EXP-2026-008','EMP0009','Deepak Joshi','Production','Executive','food','reimbursement','Overtime meals for Bay 2 team - rush order SO-2688',1840,0,1840,NULL,NULL,'2026-08-30','2026-09-02',4,false,'low','rejected','Amit Verma','2026-09-03',NULL,NULL,NULL,'Receipts missing; resubmit with bills','2026-09-02 10:00:00','2026-09-03 10:00:00'),
  (:company,'advance','DEMO-ADV-2026-009','EMP0018','Pooja Mehta','Sales & Marketing','Senior Executive','travel','travel_advance','Advance for Hyderabad hotel chain kitchen audit trip',20000,0,20000,'Hyderabad','2026-09-15 to 2026-09-18',NULL,'2026-09-08',1,false,'medium','pending_approval','Sanjay Malhotra',NULL,NULL,NULL,NULL,NULL,'2026-09-08 10:00:00','2026-09-08 10:00:00'),
  (:company,'expense','DEMO-EXP-2026-010','EMP0016','Neha Agarwal','Information Technology','Senior Executive','software','purchase','Annual renewal - diagramming tool licences x4',14200,0,14200,NULL,NULL,'2026-09-04','2026-09-06',1,true,'medium','pending_approval','Arun Gupta',NULL,NULL,NULL,NULL,NULL,'2026-09-06 10:00:00','2026-09-06 10:00:00');

-- ============================================================================
-- hr_grievances — delete predicate: DEMO- prefixed caseNumber within anchor company
-- ============================================================================
DELETE FROM hr_grievances WHERE "companyId" = :company AND "caseNumber" LIKE 'DEMO-%';
INSERT INTO hr_grievances
  ("companyId","caseType","caseNumber","filedDate","employeeId","employeeName",department,category,subcategory,description,
   priority,status,"assignedTo","targetResolutionDate","actualResolutionDate","resolutionDetails","employeeSatisfaction","isAnonymous","evidenceProvided","incidentDate",severity,remarks,"createdAt","updatedAt")
VALUES
  (:company,'grievance','DEMO-GRV-001','2025-11-14',NULL,'Deepak Joshi','Production','facilities','canteen','Canteen food quality deteriorated; multiple workers reported stale items on night shift','medium','resolved','Vikram Singh','2025-11-28','2025-11-25','Canteen vendor issued warning; weekly quality checks by welfare committee instituted','satisfied',false,true,'2025-11-12','minor',NULL,'2025-11-14 10:00:00','2025-11-25 10:00:00'),
  (:company,'grievance','DEMO-GRV-002','2026-01-20',NULL,'Lakshmi Iyer','Stores & Inventory','payroll','overtime','OT hours for Dec 2025 stock-take weekend not reflected in January payslip','high','resolved','Suresh Patel','2026-02-03','2026-01-30','12.5 OT hours verified from biometric logs; arrears paid with Feb payroll','satisfied',false,true,'2026-01-18','minor',NULL,'2026-01-20 10:00:00','2026-01-30 10:00:00'),
  (:company,'grievance','DEMO-GRV-003','2026-03-08',NULL,'Anonymous','Production','work_environment','ventilation','Bay 1 exhaust inadequate during powder coating runs; fumes reaching assembly area','high','resolved','Ramesh Yadav','2026-03-31','2026-04-12','Additional axial exhaust fan installed; MPCB consent parameters rechecked','partially_satisfied',true,false,'2026-03-05','major','Resolution delayed by fan procurement lead time','2026-03-08 10:00:00','2026-04-12 10:00:00'),
  (:company,'grievance','DEMO-GRV-004','2026-05-19',NULL,'Ajay Pillai','Quality Control','interpersonal','supervisor_conduct','Public reprimand by shift supervisor in front of contractors; seeking mediation','medium','in_progress','Anita Desai','2026-06-05',NULL,NULL,NULL,false,false,'2026-05-16','moderate','Mediation session 1 held 2026-05-28; follow-up scheduled','2026-05-19 10:00:00','2026-05-29 10:00:00'),
  (:company,'grievance','DEMO-GRV-005','2026-07-24',NULL,'Neha Agarwal','Information Technology','policy','wfh','WFH request pattern rejected without stated reason despite policy eligibility','low','resolved','Anita Desai','2026-08-07','2026-08-01','Manager briefed on policy; alternate WFH schedule agreed','satisfied',false,true,'2026-07-20','minor',NULL,'2026-07-24 10:00:00','2026-08-01 10:00:00'),
  (:company,'grievance','DEMO-GRV-006','2026-09-03',NULL,'Ganesh Patil','Dispatch & Logistics','safety','equipment','Forklift #2 brakes spongy; reported twice to maintenance without closure','high','filed','Ramesh Yadav','2026-09-17',NULL,NULL,NULL,false,true,'2026-09-01','major','Forklift taken out of service pending inspection','2026-09-03 10:00:00','2026-09-03 10:00:00');

-- ============================================================================
-- hr_alumni (parent for hr_alumni_comments via fixed ids)
-- delete predicate: DEMO- prefixed employeeCode within anchor company (children deleted first)
-- ============================================================================
DELETE FROM hr_alumni_comments WHERE "companyId" = :company; -- child first (demo-owned for anchor company)
DELETE FROM hr_alumni WHERE "companyId" = :company AND "employeeCode" LIKE 'DEMO-%';
INSERT INTO hr_alumni
  (id,"companyId",kind,"employeeCode",name,designation,department,"joinDate","exitDate",tenure,"currentCompany","currentDesignation",
   location,email,phone,"linkedinUrl","willingToMentor","availableForRehire","reasonForLeaving","lastContactDate","performanceRating",status,"createdAt","updatedAt")
VALUES
  ('da100000-0000-4000-8000-000000000001',:company,'member','DEMO-EX-001','Nitin Kulkarni','Manager','Production','2016-07-11','2024-12-31','8.5 years','Middleby Celfrost','Plant Head','Pune','nitin.kulkarni@example.com','+91-98220-40011','https://linkedin.com/in/nitin-kulkarni-demo',true,true,'Career growth - plant head role','2026-06-15','A','active','2025-10-01 10:00:00','2026-06-15 10:00:00'),
  ('da100000-0000-4000-8000-000000000002',:company,'member','DEMO-EX-002','Shalini Menon','Senior Executive','Sales & Marketing','2019-02-18','2025-08-14','6.5 years','Rational India','Key Account Manager','Bengaluru','shalini.menon@example.com','+91-98450-40022','https://linkedin.com/in/shalini-menon-demo',true,false,'Relocation to Bengaluru','2026-04-20','A','active','2025-10-01 10:00:00','2026-04-20 10:00:00'),
  ('da100000-0000-4000-8000-000000000003',:company,'member','DEMO-EX-003','Imran Shaikh','Executive','Quality Control','2020-06-01','2025-11-30','5.5 years','TUV SUD South Asia','QMS Auditor','Mumbai','imran.shaikh@example.com','+91-98200-40033',NULL,false,true,'Auditor career track','2026-02-10','B+','active','2025-12-05 10:00:00','2026-02-10 10:00:00'),
  ('da100000-0000-4000-8000-000000000004',:company,'member','DEMO-EX-004','Rekha Nambiar','Assistant Manager','Finance & Accounts','2017-04-03','2026-01-31','8.8 years','Blue Star Ltd','Finance Manager','Thane','rekha.nambiar@example.com','+91-98190-40044','https://linkedin.com/in/rekha-nambiar-demo',true,true,'Higher role and compensation','2026-07-01','A','active','2026-02-05 10:00:00','2026-07-01 10:00:00'),
  ('da100000-0000-4000-8000-000000000005',:company,'member','DEMO-EX-005','Arvind Sawant','Senior Executive','Maintenance','2015-09-14','2026-03-31','10.5 years','Self-employed','Kitchen Equipment Service Contractor','Navi Mumbai','arvind.sawant@example.com','+91-98670-40055',NULL,false,true,'Started own service business','2026-08-12','B+','active','2026-04-02 10:00:00','2026-08-12 10:00:00'),
  ('da100000-0000-4000-8000-000000000006',:company,'member','DEMO-EX-006','Kavita Joshi','Executive','Human Resources','2021-01-05','2026-05-15','5.4 years','TeamLease','HR Consultant','Mumbai','kavita.joshi@example.com','+91-98330-40066',NULL,true,true,'Consulting opportunity','2026-08-30','B','active','2026-05-20 10:00:00','2026-08-30 10:00:00'),
  ('da100000-0000-4000-8000-000000000007',:company,'rehire_request','DEMO-EX-003','Imran Shaikh','Executive','Quality Control','2020-06-01','2025-11-30','5.5 years','TUV SUD South Asia','QMS Auditor','Mumbai','imran.shaikh@example.com','+91-98200-40033',NULL,false,true,'Auditor career track','2026-08-25','B+','under_review','2026-08-25 10:00:00','2026-09-02 10:00:00'),
  ('da100000-0000-4000-8000-000000000008',:company,'member','DEMO-EX-008','Farhan Qureshi','Junior Executive','Dispatch & Logistics','2022-08-22','2025-10-31','3.2 years','DHL Supply Chain','Operations Executive','Bhiwandi','farhan.qureshi@example.com','+91-97690-40088',NULL,false,false,'Logistics MNC opportunity','2025-12-20','B','inactive','2025-11-05 10:00:00','2025-12-20 10:00:00');

-- rehire_request row extras
UPDATE hr_alumni SET
  "proposedDesignation"='Senior Executive - QC', "proposedDepartment"='Quality Control', "proposedCTC"=780000,
  "requestedBy"='Sunita Rao', "requestDate"='2026-08-25', "eligibilityScore"=86, "backgroundCheckStatus"='in_progress',
  comments='Strong audit background; fills ISO lead auditor gap after renewal lapse'
WHERE id = 'da100000-0000-4000-8000-000000000007';

-- ============================================================================
-- hr_alumni_comments (child of hr_alumni; delete handled above with parent)
-- ============================================================================
INSERT INTO hr_alumni_comments
  ("companyId","postId","alumniId","authorName",body,status,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-POST-001','da100000-0000-4000-8000-000000000001','Nitin Kulkarni','Great to see the Bay 2 automation photos - proud of how far the plant has come!','active','2026-06-16 10:00:00','2026-06-16 10:00:00'),
  (:company,'DEMO-POST-001','da100000-0000-4000-8000-000000000002','Shalini Menon','Congratulations to the team on the Host Bengaluru booth. The new combi line looks world-class.','active','2026-08-28 10:00:00','2026-08-28 10:00:00'),
  (:company,'DEMO-POST-002','da100000-0000-4000-8000-000000000004','Rekha Nambiar','Happy to help anyone preparing for finance certifications - reach out anytime.','active','2026-07-02 10:00:00','2026-07-02 10:00:00'),
  (:company,'DEMO-POST-002','da100000-0000-4000-8000-000000000006','Kavita Joshi','Alumni meetup in Mumbai next month? Count me in for organizing.','active','2026-08-31 10:00:00','2026-08-31 10:00:00');
