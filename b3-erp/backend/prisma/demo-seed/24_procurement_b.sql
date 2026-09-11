-- Demo seed — Procurement B (RFQs, quotations, vendor portal, AP invoices, returns,
-- contracts, evaluations, scorecards, sourcing rules, diversity) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears demo rows first (DEMO- prefixed numbers / companyId scope), then re-inserts.
-- References existing demo data: vendors (VND-001..008), PO-DEMO-*, GR-DEMO-*, hr_employees (EMP00xx).
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- 1. rfqs (delete children first: vendor_quotations, vendor_messages reference RFQ-DEMO)
-- ============================================================================
DELETE FROM vendor_messages WHERE "rfqNumber" LIKE 'RFQ-DEMO-%';
DELETE FROM vendor_quotations WHERE "quotationNumber" LIKE 'VQ-DEMO-%';
DELETE FROM rfqs WHERE "rfqNumber" LIKE 'RFQ-DEMO-%';

INSERT INTO rfqs
  ("rfqNumber","rfqDate","submissionDeadline","validUntil",status,"rfqType",title,description,
   "buyerId","buyerName",department,"buyerEmail",vendors,items,"estimatedTotal",
   "paymentTerms","deliveryTerms","awardedVendorName","awardedAmount","awardedDate","awardedPONumber",
   "quotationsReceived","quotationsPending","lowestQuotationAmount","highestQuotationAmount",
   "createdBy","createdAt","updatedAt")
VALUES
  ('RFQ-DEMO-0001','2025-09-25','2025-10-03','2025-11-02','Awarded','Standard',
   'SS-304 Sheets 18G — Oct 2025 Lot','Supply of SS-304 sheets 18 gauge, 2500x1250mm, kitchen-grade finish for fabrication line.',
   'EMP0015','Arun Gupta','Procurement','arun.gupta@b3macbis.com',
   '[{"vendorCode":"VND-001","vendorName":"Prime Steel Suppliers"},{"vendorCode":"VND-004","vendorName":"Bharat Metal Works Pvt. Ltd."}]',
   '[{"itemName":"SS-304 Sheet 18G 2500x1250","quantity":120,"uom":"Nos","estimatedRate":1700}]',
   204000,'Net 30','Ex-works, freight to B3 factory','Prime Steel Suppliers',198000,'2025-10-06','PO-DEMO-0001',
   2,0,198000,209500,'EMP0015','2025-09-25 09:30:00','2025-10-06 15:10:00'),
  ('RFQ-DEMO-0002','2025-10-10','2025-10-17','2025-11-16','Awarded','Standard',
   'Refrigeration Compressors 1.5HP','Hermetic compressors 1.5HP R404a for undercounter chiller assembly, with mounting kits.',
   'EMP0015','Arun Gupta','Procurement','arun.gupta@b3macbis.com',
   '[{"vendorCode":"VND-002","vendorName":"Industrial Components Ltd."},{"vendorCode":"VND-005","vendorName":"ProTool Equipment Inc."}]',
   '[{"itemName":"Compressor 1.5HP R404a","quantity":30,"uom":"Nos","estimatedRate":3200}]',
   96000,'Net 45','DDP B3 factory, Bengaluru','Industrial Components Ltd.',93000,'2025-10-20','PO-DEMO-0002',
   2,0,93000,101400,'EMP0015','2025-10-10 10:00:00','2025-10-20 11:45:00'),
  ('RFQ-DEMO-0003','2026-02-16','2026-02-25','2026-03-27','Evaluated','Standard',
   'Digital Control Panels — Combi Line','PLC-based digital control panels with touch interface for combi oven series, IP54 rated.',
   'EMP0007','Amit Verma','Procurement','amit.verma@b3macbis.com',
   '[{"vendorCode":"VND-003","vendorName":"ElectroTech Supplies"},{"vendorCode":"VND-002","vendorName":"Industrial Components Ltd."}]',
   '[{"itemName":"Digital Control Panel IP54","quantity":25,"uom":"Nos","estimatedRate":4500}]',
   112500,'Net 30','FOB origin',NULL,NULL,NULL,NULL,
   2,0,110000,118750,'EMP0007','2026-02-16 09:15:00','2026-03-02 16:30:00'),
  ('RFQ-DEMO-0004','2026-05-04','2026-05-14','2026-06-13','Quotes Received','Standard',
   'HP Gas Burners — Range Line','High-pressure brass gas burners 32kW with pilot assembly for commercial range line.',
   'EMP0015','Arun Gupta','Procurement','arun.gupta@b3macbis.com',
   '[{"vendorCode":"VND-008","vendorName":"Chemical Solutions GmbH"},{"vendorCode":"VND-004","vendorName":"Bharat Metal Works Pvt. Ltd."}]',
   '[{"itemName":"HP Gas Burner 32kW","quantity":60,"uom":"Nos","estimatedRate":1250}]',
   75000,'Net 30','CIF Chennai port',NULL,NULL,NULL,NULL,
   2,0,72600,76800,'EMP0015','2026-05-04 09:40:00','2026-05-15 10:20:00'),
  ('RFQ-DEMO-0005','2026-07-20','2026-07-30','2026-08-29','Sent','Standard',
   'Rockwool Insulation Panels 50mm','Rockwool insulation panels 50mm, foil-faced, for oven cavity and cold-room walls.',
   'EMP0007','Amit Verma','Procurement','amit.verma@b3macbis.com',
   '[{"vendorCode":"VND-001","vendorName":"Prime Steel Suppliers"},{"vendorCode":"VND-008","vendorName":"Chemical Solutions GmbH"}]',
   '[{"itemName":"Rockwool Panel 50mm foil-faced","quantity":400,"uom":"SqM","estimatedRate":160}]',
   64000,'Net 30','Ex-works',NULL,NULL,NULL,NULL,
   0,2,NULL,NULL,'EMP0007','2026-07-20 11:05:00','2026-07-21 09:00:00'),
  ('RFQ-DEMO-0006','2026-08-18','2026-08-28','2026-09-27','In Progress','Emergency',
   'Food-grade Degreaser & Passivation Chemicals','Urgent replenishment of food-grade degreaser and SS passivation chemicals for finishing shop.',
   'EMP0015','Arun Gupta','Procurement','arun.gupta@b3macbis.com',
   '[{"vendorCode":"VND-008","vendorName":"Chemical Solutions GmbH"}]',
   '[{"itemName":"Food-grade Degreaser 25L","quantity":40,"uom":"Can","estimatedRate":650},{"itemName":"SS Passivation Gel 5kg","quantity":25,"uom":"Pail","estimatedRate":480}]',
   38000,'Net 45','Air freight, DAP',NULL,NULL,NULL,NULL,
   0,1,NULL,NULL,'EMP0015','2026-08-18 08:50:00','2026-08-20 14:35:00'),
  ('RFQ-DEMO-0007','2025-12-01','2025-12-12','2026-01-11','Closed','Tender',
   'Annual Packaging Contract FY26','Annual rate tender for export-grade wooden crates, corrugated boxes and stretch film.',
   'EMP0015','Arun Gupta','Procurement','arun.gupta@b3macbis.com',
   '[{"vendorCode":"VND-006","vendorName":"PackRight Solutions"},{"vendorCode":"VND-001","vendorName":"Prime Steel Suppliers"}]',
   '[{"itemName":"Export wooden crate — large","quantity":500,"uom":"Nos","estimatedRate":900},{"itemName":"Corrugated box 5-ply","quantity":3000,"uom":"Nos","estimatedRate":85}]',
   705000,'Net 15','Delivered to B3 dispatch bay','PackRight Solutions',688000,'2026-01-05',NULL,
   2,0,688000,742500,'EMP0015','2025-12-01 09:00:00','2026-01-05 17:20:00');

-- ============================================================================
-- 2. vendor_quotations (references RFQ-DEMO rfqs and vendors)
-- ============================================================================
INSERT INTO vendor_quotations
  ("quotationNumber","quotationDate","validUntil",status,
   "rfqId","rfqNumber","rfqDate","vendorId","vendorName","vendorCode","vendorContactPerson","vendorEmail",
   items,currency,subtotal,"taxAmount","totalAmount","paymentTerms","deliveryDays",
   "isEvaluated","evaluationScore",rank,"isAwarded","awardedDate","purchaseOrderNumber",
   "isRejected","rejectedDate","rejectionReason","createdBy","createdAt","updatedAt")
VALUES
  ('VQ-DEMO-0001','2025-10-02','2025-11-01','Awarded',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0001'),'RFQ-DEMO-0001','2025-09-25',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','VND-001','Robert Anderson','randerson@primesteel.com',
   '[{"itemName":"SS-304 Sheet 18G 2500x1250","quantity":120,"uom":"Nos","rate":1650,"amount":198000}]',
   'INR',198000,35640,233640,'Net 30',15,true,92.50,1,true,'2025-10-06','PO-DEMO-0001',
   false,NULL,NULL,'EMP0015','2025-10-02 14:20:00','2025-10-06 15:10:00'),
  ('VQ-DEMO-0002','2025-10-03','2025-11-02','Rejected',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0001'),'RFQ-DEMO-0001','2025-09-25',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','VND-004','Arun Sharma','asharma@bharatmetal.in',
   '[{"itemName":"SS-304 Sheet 18G 2500x1250","quantity":120,"uom":"Nos","rate":1745.83,"amount":209500}]',
   'INR',209500,37710,247210,'Net 30',21,true,84.00,2,false,NULL,NULL,
   true,'2025-10-06','Higher landed cost and longer lead time than L1.','EMP0015','2025-10-03 10:05:00','2025-10-06 15:12:00'),
  ('VQ-DEMO-0003','2025-10-15','2025-11-14','Awarded',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0002'),'RFQ-DEMO-0002','2025-10-10',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','VND-002','Jennifer White','jwhite@indcomponents.com',
   '[{"itemName":"Compressor 1.5HP R404a","quantity":30,"uom":"Nos","rate":3100,"amount":93000}]',
   'INR',93000,16740,109740,'Net 45',18,true,90.00,1,true,'2025-10-20','PO-DEMO-0002',
   false,NULL,NULL,'EMP0015','2025-10-15 11:30:00','2025-10-20 11:45:00'),
  ('VQ-DEMO-0004','2025-10-16','2025-11-15','Rejected',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0002'),'RFQ-DEMO-0002','2025-10-10',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-005'),'ProTool Equipment Inc.','VND-005','Mark Thompson','mthompson@protool.com',
   '[{"itemName":"Compressor 1.5HP R404a","quantity":30,"uom":"Nos","rate":3380,"amount":101400}]',
   'INR',101400,18252,119652,'Net 30',25,true,78.50,2,false,NULL,NULL,
   true,'2025-10-20','L2 on price; delivery window exceeded requirement.','EMP0015','2025-10-16 09:45:00','2025-10-20 11:47:00'),
  ('VQ-DEMO-0005','2026-02-23','2026-03-25','Under Review',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0003'),'RFQ-DEMO-0003','2026-02-16',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','VND-003','David Lee','dlee@electrotech.com',
   '[{"itemName":"Digital Control Panel IP54","quantity":25,"uom":"Nos","rate":4400,"amount":110000}]',
   'INR',110000,19800,129800,'Net 15',20,true,88.00,1,false,NULL,NULL,
   false,NULL,NULL,'EMP0007','2026-02-23 15:00:00','2026-03-02 16:30:00'),
  ('VQ-DEMO-0006','2026-02-24','2026-03-26','Under Review',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0003'),'RFQ-DEMO-0003','2026-02-16',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','VND-002','Jennifer White','jwhite@indcomponents.com',
   '[{"itemName":"Digital Control Panel IP54","quantity":25,"uom":"Nos","rate":4750,"amount":118750}]',
   'INR',118750,21375,140125,'Net 45',24,true,81.25,2,false,NULL,NULL,
   false,NULL,NULL,'EMP0007','2026-02-24 10:10:00','2026-03-02 16:32:00'),
  ('VQ-DEMO-0007','2026-05-12','2026-06-11','Submitted',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0004'),'RFQ-DEMO-0004','2026-05-04',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','VND-008','Klaus Weber','kweber@chemsolutions.de',
   '[{"itemName":"HP Gas Burner 32kW","quantity":60,"uom":"Nos","rate":1210,"amount":72600}]',
   'INR',72600,13068,85668,'Net 45',30,false,NULL,NULL,false,NULL,NULL,
   false,NULL,NULL,'EMP0015','2026-05-12 13:25:00','2026-05-12 13:25:00'),
  ('VQ-DEMO-0008','2026-05-13','2026-06-12','Submitted',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0004'),'RFQ-DEMO-0004','2026-05-04',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','VND-004','Arun Sharma','asharma@bharatmetal.in',
   '[{"itemName":"HP Gas Burner 32kW","quantity":60,"uom":"Nos","rate":1280,"amount":76800}]',
   'INR',76800,13824,90624,'Net 30',14,false,NULL,NULL,false,NULL,NULL,
   false,NULL,NULL,'EMP0015','2026-05-13 09:55:00','2026-05-13 09:55:00'),
  ('VQ-DEMO-0009','2025-12-10','2026-01-09','Accepted',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0007'),'RFQ-DEMO-0007','2025-12-01',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','VND-006','Amanda Brown','abrown@packright.com',
   '[{"itemName":"Export wooden crate — large","quantity":500,"uom":"Nos","rate":880,"amount":440000},{"itemName":"Corrugated box 5-ply","quantity":3000,"uom":"Nos","rate":82.67,"amount":248000}]',
   'INR',688000,123840,811840,'Net 15',10,true,93.00,1,false,'2026-01-05',NULL,
   false,NULL,NULL,'EMP0015','2025-12-10 16:40:00','2026-01-05 17:20:00'),
  ('VQ-DEMO-0010','2025-12-11','2026-01-10','Expired',
   (SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0007'),'RFQ-DEMO-0007','2025-12-01',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','VND-001','Robert Anderson','randerson@primesteel.com',
   '[{"itemName":"Export wooden crate — large","quantity":500,"uom":"Nos","rate":945,"amount":472500},{"itemName":"Corrugated box 5-ply","quantity":3000,"uom":"Nos","rate":90,"amount":270000}]',
   'INR',742500,133650,876150,'Net 30',15,true,79.00,2,false,NULL,NULL,
   false,NULL,NULL,'EMP0015','2025-12-11 10:20:00','2026-01-11 00:05:00');

-- ============================================================================
-- 3. vendor_messages (buyer<->vendor threads on RFQ-DEMO rfqs)
-- ============================================================================
INSERT INTO vendor_messages
  ("companyId","rfqId","rfqNumber","vendorId","vendorName","vendorEmail","vendorContactPerson",
   "messageType",priority,subject,message,status,"isOutbound",
   "sentAt","readAt","repliedAt","requiresResponse","responseDeadline","isResponded",
   "createdBy","createdByName","createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0001'),'RFQ-DEMO-0001',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','randerson@primesteel.com','Robert Anderson',
   'inquiry','normal','RFQ-DEMO-0001: SS-304 sheet finish clarification',
   'Please confirm whether the 18G sheets are required in 2B finish or No.4 brushed finish for the fabrication lot.',
   'replied',false,'2025-09-27 10:15:00','2025-09-27 11:00:00','2025-09-27 14:30:00',true,'2025-09-30',true,
   'EMP0015','Arun Gupta','2025-09-27 10:15:00','2025-09-27 14:30:00'),
  (:company,(SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0001'),'RFQ-DEMO-0001',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','randerson@primesteel.com','Robert Anderson',
   'award_notification','high','RFQ-DEMO-0001 awarded — PO-DEMO-0001 to follow',
   'Your quotation VQ-DEMO-0001 has been accepted at INR 1,650/sheet. Purchase order PO-DEMO-0001 is being released; please acknowledge within 2 working days.',
   'read',true,'2025-10-06 15:30:00','2025-10-06 16:05:00',NULL,true,'2025-10-08',true,
   'EMP0015','Arun Gupta','2025-10-06 15:30:00','2025-10-06 16:05:00'),
  (:company,(SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0002'),'RFQ-DEMO-0002',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','jwhite@indcomponents.com','Jennifer White',
   'clarification','normal','RFQ-DEMO-0002: compressor mounting kit inclusion',
   'Kindly confirm the quoted rate of INR 3,100 includes vibration-damping mounting kits and start capacitors as per spec sheet section 4.',
   'replied',true,'2025-10-13 09:20:00','2025-10-13 10:40:00','2025-10-14 08:55:00',true,'2025-10-16',true,
   'EMP0015','Arun Gupta','2025-10-13 09:20:00','2025-10-14 08:55:00'),
  (:company,(SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0002'),'RFQ-DEMO-0002',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-005'),'ProTool Equipment Inc.','mthompson@protool.com','Mark Thompson',
   'rejection_notification','normal','RFQ-DEMO-0002 — regret notification',
   'Thank you for quotation VQ-DEMO-0004. We regret to inform that the order has been placed with an alternate supplier based on landed cost and delivery.',
   'delivered',true,'2025-10-20 12:10:00',NULL,NULL,false,NULL,false,
   'EMP0015','Arun Gupta','2025-10-20 12:10:00','2025-10-20 12:10:00'),
  (:company,(SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0003'),'RFQ-DEMO-0003',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','dlee@electrotech.com','David Lee',
   'negotiation','high','RFQ-DEMO-0003: request for improved pricing on control panels',
   'Your technical bid scores highest. Requesting a 3% commercial improvement on VQ-DEMO-0005 to close the award this quarter.',
   'sent',true,'2026-03-03 11:25:00',NULL,NULL,true,'2026-03-10',false,
   'EMP0007','Amit Verma','2026-03-03 11:25:00','2026-03-03 11:25:00'),
  (:company,(SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0004'),'RFQ-DEMO-0004',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','kweber@chemsolutions.de','Klaus Weber',
   'deadline_extension','normal','RFQ-DEMO-0004: submission deadline extension request',
   'We request a 5-day extension on the burner RFQ to complete CE conformity documentation for the 32kW burner assembly.',
   'replied',false,'2026-05-09 08:30:00','2026-05-09 09:10:00','2026-05-09 12:00:00',true,'2026-05-11',true,
   'EMP0015','Arun Gupta','2026-05-09 08:30:00','2026-05-09 12:00:00'),
  (:company,(SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0006'),'RFQ-DEMO-0006',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','kweber@chemsolutions.de','Klaus Weber',
   'document_request','urgent','RFQ-DEMO-0006: MSDS and food-grade certificates required',
   'For the emergency chemicals RFQ please upload MSDS sheets and NSF/food-grade certification for both line items before quoting.',
   'sent',true,'2026-08-19 10:00:00',NULL,NULL,true,'2026-08-24',false,
   'EMP0015','Arun Gupta','2026-08-19 10:00:00','2026-08-19 10:00:00'),
  (:company,(SELECT id::text FROM rfqs WHERE "rfqNumber"='RFQ-DEMO-0007'),'RFQ-DEMO-0007',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','abrown@packright.com','Amanda Brown',
   'general','low','Annual packaging tender — kickoff meeting notes',
   'Sharing the minutes of the FY26 packaging tender kickoff. Rate validity is 12 months from award with quarterly volume reviews.',
   'read',true,'2026-01-06 14:45:00','2026-01-07 09:30:00',NULL,false,NULL,false,
   'EMP0015','Arun Gupta','2026-01-06 14:45:00','2026-01-07 09:30:00');

-- ============================================================================
-- 4. procurement_vendors (portal-side vendor master mirroring the 8 vendors)
-- ============================================================================
DELETE FROM procurement_vendors WHERE "companyId" = :company;
INSERT INTO procurement_vendors
  ("companyId","vendorCode","legalName","tradeName","gstNumber","panNumber",rating,status,
   "contactPersons",addresses,"paymentTerms",categories,"specificMaterials",certifications,
   "totalPOs","totalSpendYTD","registeredDate","lastOrderDate",notes,"createdAt","updatedAt")
VALUES
  (:company,'VND-001','Prime Steel Suppliers','Prime Steel',NULL,NULL,4.6,'active',
   '[{"name":"Robert Anderson","email":"randerson@primesteel.com","phone":"+1-555-1001","role":"Sales Manager"}]',
   '[{"type":"registered","city":"Cleveland","country":"USA"}]',
   '{"terms":"Net 30","days":30}','["Raw Materials","Sheet Metal"]','["SS-304 sheets","SS-316 sheets","Insulation panels"]','["ISO 9001"]',
   6,902936,'2023-04-12','2026-07-02','Primary SS sheet supplier for fabrication line.','2025-10-01 09:00:00','2026-09-01 10:00:00'),
  (:company,'VND-002','Industrial Components Ltd.','IndComponents',NULL,NULL,4.4,'active',
   '[{"name":"Jennifer White","email":"jwhite@indcomponents.com","phone":"+1-555-2001","role":"Key Account Manager"}]',
   '[{"type":"registered","city":"Indianapolis","country":"USA"}]',
   '{"terms":"Net 45","days":45}','["Components","Refrigeration"]','["Compressors","Motors","Control panels"]','["ISO 9001","UL"]',
   5,508226,'2023-06-20','2026-08-13','Compressor and component supplier; strong OTD record.','2025-10-01 09:00:00','2026-09-01 10:00:00'),
  (:company,'VND-003','ElectroTech Supplies','ElectroTech',NULL,NULL,4.2,'active',
   '[{"name":"David Lee","email":"dlee@electrotech.com","phone":"+1-555-3001","role":"Regional Sales"}]',
   '[{"type":"registered","city":"San Francisco","country":"USA"}]',
   '{"terms":"Net 15","days":15}','["Electronics","Controls"]','["Digital control panels","PLC modules","Sensors"]','["ISO 9001","CE"]',
   3,388220,'2023-09-05','2026-07-16','Control panel specialist; pending price negotiation on combi line.','2025-10-01 09:00:00','2026-09-01 10:00:00'),
  (:company,'VND-004','Bharat Metal Works Pvt. Ltd.','Bharat Metal','24AABCB1234D1ZY','AABCB1234D',4.0,'active',
   '[{"name":"Arun Sharma","email":"asharma@bharatmetal.in","phone":"+91-22-44556677","role":"Director Sales"}]',
   '[{"type":"registered","city":"Ahmedabad","state":"Gujarat","country":"India"}]',
   '{"terms":"Net 30","days":30}','["Raw Materials","Burners"]','["SS sheets","Gas burners","Brass fittings"]','["ISO 9001","MSME"]',
   4,733016,'2024-01-18','2026-06-18','Domestic MSME alternative for SS and burner assemblies; one quality return in Dec-25.','2025-10-01 09:00:00','2026-09-01 10:00:00'),
  (:company,'VND-005','ProTool Equipment Inc.','ProTool',NULL,NULL,3.9,'active',
   '[{"name":"Mark Thompson","email":"mthompson@protool.com","phone":"+1-555-5001","role":"Sales Executive"}]',
   '[{"type":"registered","city":"Milwaukee","country":"USA"}]',
   '{"terms":"Net 30","days":30}','["Tools"]','["Press tooling","Welding consumables","Fixtures"]','["ISO 9001"]',
   3,88800,'2024-03-22','2026-09-05','Tooling and shop-floor equipment supplier.','2025-10-01 09:00:00','2026-09-01 10:00:00'),
  (:company,'VND-006','PackRight Solutions','PackRight',NULL,NULL,4.3,'active',
   '[{"name":"Amanda Brown","email":"abrown@packright.com","phone":"+1-555-6001","role":"Account Manager"}]',
   '[{"type":"registered","city":"Memphis","country":"USA"}]',
   '{"terms":"Net 15","days":15}','["Packaging"]','["Wooden crates","Corrugated boxes","Stretch film"]','["ISO 9001","ISPM-15"]',
   2,166400,'2024-05-10','2026-06-04','Annual packaging contract holder FY26 (RFQ-DEMO-0007).','2025-10-01 09:00:00','2026-09-01 10:00:00'),
  (:company,'VND-007','MaintainPro Services','MaintainPro',NULL,NULL,4.1,'active',
   '[{"name":"Kevin Martinez","email":"kmartinez@maintainpro.com","phone":"+1-555-7001","role":"Service Head"}]',
   '[{"type":"registered","city":"Houston","country":"USA"}]',
   '{"terms":"Net 30","days":30}','["Services","Maintenance"]','["AMC services","Calibration","Breakdown support"]','["ISO 9001"]',
   2,35000,'2024-08-01','2026-07-30','AMC partner for plant utilities and compressors.','2025-10-01 09:00:00','2026-09-01 10:00:00'),
  (:company,'VND-008','Chemical Solutions GmbH','ChemSolutions',NULL,NULL,3.8,'active',
   '[{"name":"Klaus Weber","email":"kweber@chemsolutions.de","phone":"+49-69-11223344","role":"Export Manager"}]',
   '[{"type":"registered","city":"Frankfurt","country":"Germany"}]',
   '{"terms":"Net 45","days":45}','["Consumables","Chemicals"]','["Degreasers","Passivation chemicals","Polishing compounds"]','["ISO 9001","ISO 14001","REACH"]',
   3,164250,'2024-02-14','2026-08-27','Import supplier for finishing chemicals; MSDS docs on portal.','2025-10-01 09:00:00','2026-09-01 10:00:00');

-- ============================================================================
-- 5. procurement_supplier_portal_catalog_items
-- ============================================================================
DELETE FROM procurement_supplier_portal_catalog_items WHERE "companyId" = :company;
INSERT INTO procurement_supplier_portal_catalog_items
  ("companyId","supplierId","supplierName",sku,name,category,uom,"unitPrice",currency,"leadTimeDays",status,description,"createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','DEMO-SS304-18G','SS-304 Sheet 18G 2500x1250','Raw Materials','Nos',1650.00,'INR',15,'active','Kitchen-grade SS-304 sheet, 18 gauge, 2B finish.','2025-10-05 09:00:00','2026-04-25 10:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','DEMO-SS316-16G','SS-316 Sheet 16G 2500x1250','Raw Materials','Nos',2350.00,'INR',18,'active','Marine-grade SS-316 sheet for corrosive environments.','2025-10-05 09:05:00','2026-04-25 10:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','DEMO-COMP-15HP','Compressor 1.5HP R404a','Refrigeration','Nos',3100.00,'INR',18,'active','Hermetic compressor with mounting kit and start capacitor.','2025-10-18 11:00:00','2026-05-10 09:30:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','DEMO-COMP-20HP','Compressor 2.0HP R404a','Refrigeration','Nos',3900.00,'INR',18,'active','Hermetic compressor for upright chiller series.','2025-10-18 11:05:00','2026-05-10 09:30:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','DEMO-CTRL-IP54','Digital Control Panel IP54','Controls','Nos',4400.00,'INR',20,'active','PLC-based touch control panel for combi ovens, IP54.','2026-02-20 14:00:00','2026-03-05 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','DEMO-TSENS-PT100','Temperature Sensor PT100','Controls','Nos',480.00,'INR',10,'active','PT100 probe with food-safe SS sheath, 3m lead.','2026-02-20 14:05:00','2026-03-05 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','DEMO-BURN-32KW','HP Gas Burner 32kW','Burners','Nos',1280.00,'INR',14,'active','High-pressure brass burner with pilot assembly.','2026-05-10 10:00:00','2026-05-14 12:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','DEMO-CRATE-L','Export Wooden Crate — Large','Packaging','Nos',880.00,'INR',10,'active','ISPM-15 compliant heat-treated export crate.','2026-01-06 09:00:00','2026-06-05 10:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','DEMO-DEGR-25L','Food-grade Degreaser 25L','Consumables','Can',650.00,'INR',30,'active','NSF-listed degreaser for finishing shop.','2026-08-19 09:00:00','2026-08-25 10:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','DEMO-PASS-5KG','SS Passivation Gel 5kg','Consumables','Pail',480.00,'INR',30,'inactive','Passivation gel; superseded by spray variant pending re-listing.','2026-08-19 09:05:00','2026-09-02 15:30:00');

-- ============================================================================
-- 6. procurement_supplier_portal_documents
-- ============================================================================
DELETE FROM procurement_supplier_portal_documents WHERE "companyId" = :company;
INSERT INTO procurement_supplier_portal_documents
  ("companyId","supplierId","supplierName","documentType","fileName","fileUrl",size,"expiryDate",status,"createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','ISO 9001 Certificate','primesteel-iso9001-2025.pdf','/uploads/portal/primesteel-iso9001-2025.pdf','1.2 MB','2027-03-31','valid','2025-10-02 09:00:00','2025-10-02 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','Mill Test Certificate','mtc-ss304-lot-oct25.pdf','/uploads/portal/mtc-ss304-lot-oct25.pdf','860 KB',NULL,'valid','2025-10-22 14:20:00','2025-10-22 14:20:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','UL Certification','indcomp-ul-compressors.pdf','/uploads/portal/indcomp-ul-compressors.pdf','2.4 MB','2026-11-30','valid','2025-10-14 10:30:00','2025-10-14 10:30:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','GST Registration Certificate','bharatmetal-gst-cert.pdf','/uploads/portal/bharatmetal-gst-cert.pdf','540 KB',NULL,'valid','2025-12-01 11:00:00','2025-12-01 11:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','MSME Udyam Certificate','bharatmetal-udyam.pdf','/uploads/portal/bharatmetal-udyam.pdf','310 KB','2026-10-15','expiring','2025-12-01 11:05:00','2026-08-20 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','ISPM-15 Accreditation','packright-ispm15.pdf','/uploads/portal/packright-ispm15.pdf','720 KB','2026-12-31','valid','2026-01-05 15:00:00','2026-01-05 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-007'),'MaintainPro Services','Liability Insurance Certificate','maintainpro-insurance-fy25.pdf','/uploads/portal/maintainpro-insurance-fy25.pdf','1.1 MB','2026-03-31','expired','2025-10-10 12:00:00','2026-04-01 08:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','MSDS — Degreaser 25L','chemsol-msds-degreaser.pdf','/uploads/portal/chemsol-msds-degreaser.pdf','980 KB','2028-06-30','valid','2026-08-20 10:30:00','2026-08-20 10:30:00');

-- ============================================================================
-- 7. procurement_supplier_portal_invoices (supplier-submitted view of AP invoices)
-- ============================================================================
DELETE FROM procurement_supplier_portal_invoices WHERE "companyId" = :company;
INSERT INTO procurement_supplier_portal_invoices
  ("companyId","supplierId","supplierName","invoiceNumber","poNumber","invoiceDate","dueDate",amount,currency,status,notes,"createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','PSS-8841','PO-DEMO-0001','2025-10-25','2025-11-24',233640.00,'INR','paid','SS-304 sheet lot against GR-DEMO-0001.','2025-10-25 10:00:00','2025-11-20 16:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','ICL-2210','PO-DEMO-0002','2025-11-08','2025-12-23',109740.00,'INR','paid','Compressor supply, 30 units.','2025-11-08 09:30:00','2025-12-18 14:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','ETS-5527','PO-DEMO-0003','2025-11-22','2025-12-07',106200.00,'INR','paid','Control components against GR-DEMO-0003.','2025-11-22 11:15:00','2025-12-05 10:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','CSG-77012','PO-DEMO-0004','2025-12-06','2026-01-20',83780.00,'INR','paid','Import consignment; BOE attached.','2025-12-06 08:45:00','2026-01-16 12:30:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','BMW-1090','PO-DEMO-0005','2025-12-20','2026-01-19',148680.00,'INR','approved','Approved net of debit note for quality return PRET-DEMO-0001.','2025-12-20 10:20:00','2026-01-10 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','PSS-9102','PO-DEMO-0008','2026-02-11','2026-03-13',277300.00,'INR','approved','Partially paid; balance scheduled next payment run.','2026-02-11 09:00:00','2026-03-20 15:45:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','ICL-2544','PO-DEMO-0010','2026-03-11','2026-04-25',132160.00,'INR','submitted','Awaiting 3-way match completion.','2026-03-11 13:40:00','2026-03-11 13:40:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','BMW-1201','PO-DEMO-0012','2026-04-08','2026-05-08',330636.00,'INR','disputed','Quantity mismatch vs GR-DEMO-0012 under review.','2026-04-08 10:10:00','2026-04-20 11:00:00');

-- ============================================================================
-- 8. procurement_supplier_portal_messages
-- ============================================================================
DELETE FROM procurement_supplier_portal_messages WHERE "companyId" = :company;
INSERT INTO procurement_supplier_portal_messages
  ("companyId","supplierId","supplierName",type,subject,message,status,priority,attachments,"respondedAt","createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','general','Diwali holiday dispatch schedule','Our plant will observe holidays 2025-10-20 to 2025-10-23; dispatches against PO-DEMO-0001 resume 24th.','responded','medium',0,'2025-10-16 15:00:00','2025-10-15 09:30:00','2025-10-16 15:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','payment','Payment status — invoice ICL-2544','Requesting payment status update for invoice ICL-2544 against PO-DEMO-0010, due 2026-04-25.','unread','high',1,NULL,'2026-04-28 10:15:00','2026-04-28 10:15:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','quote','Revised pricing for combi control panels','Submitting 2.5% improved pricing on control panels as discussed for RFQ-DEMO-0003.','read','medium',1,NULL,'2026-03-06 14:20:00','2026-03-07 09:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','dispute','Debit note clarification — PRET-DEMO-0001','Requesting inspection report backing the quality return debit of INR 21,240 on invoice BMW-1090.','responded','high',2,'2025-12-30 11:30:00','2025-12-28 16:40:00','2025-12-30 11:30:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-005'),'ProTool Equipment Inc.','general','New press tooling catalog available','FY26 tooling catalog uploaded to the portal with updated fixture range for SS fabrication.','read','low',1,NULL,'2026-05-25 09:00:00','2026-05-26 10:10:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','delivery','Crate delivery slot confirmation','Confirming delivery slot 2026-06-24 AM for wooden crates against PO-DEMO-0017.','responded','medium',0,'2026-06-22 12:00:00','2026-06-21 15:30:00','2026-06-22 12:00:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-007'),'MaintainPro Services','document','Renewed insurance certificate pending upload','Our FY27 liability insurance renewal is in progress; certificate will be uploaded by 2026-09-20.','unread','medium',0,NULL,'2026-09-05 08:50:00','2026-09-05 08:50:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','quote','Quote submitted — emergency chemicals RFQ','Quotation for degreaser and passivation gel submitted against RFQ-DEMO-0006 with air-freight option.','unread','urgent',2,NULL,'2026-09-08 11:20:00','2026-09-08 11:20:00');

-- ============================================================================
-- 9. procurement_supplier_portal_quotes
-- ============================================================================
DELETE FROM procurement_supplier_portal_quotes WHERE "companyId" = :company;
INSERT INTO procurement_supplier_portal_quotes
  ("companyId","supplierId","supplierName","itemName",reference,quantity,"unitPrice",currency,"leadTimeDays","validUntil",status,notes,"createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','SS-304 Sheet 18G 2500x1250','RFQ-DEMO-0001',120,1650.00,'INR',15,'2025-11-01','accepted','Awarded as VQ-DEMO-0001; PO-DEMO-0001 released.','2025-10-02 14:20:00','2025-10-06 15:10:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','SS-304 Sheet 18G 2500x1250','RFQ-DEMO-0001',120,1745.83,'INR',21,'2025-11-02','rejected','L2 on landed cost.','2025-10-03 10:05:00','2025-10-06 15:12:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','Compressor 1.5HP R404a','RFQ-DEMO-0002',30,3100.00,'INR',18,'2025-11-14','accepted','Awarded as VQ-DEMO-0003.','2025-10-15 11:30:00','2025-10-20 11:45:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-005'),'ProTool Equipment Inc.','Compressor 1.5HP R404a','RFQ-DEMO-0002',30,3380.00,'INR',25,'2025-11-15','rejected','Regret letter sent 2025-10-20.','2025-10-16 09:45:00','2025-10-20 11:47:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','Digital Control Panel IP54','RFQ-DEMO-0003',25,4400.00,'INR',20,'2026-03-25','under_review','Technical L1; commercial negotiation in progress.','2026-02-23 15:00:00','2026-03-03 11:25:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','Digital Control Panel IP54','RFQ-DEMO-0003',25,4750.00,'INR',24,'2026-03-26','under_review','Technical L2.','2026-02-24 10:10:00','2026-03-02 16:32:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','HP Gas Burner 32kW','RFQ-DEMO-0004',60,1210.00,'INR',30,'2026-06-11','submitted','CIF Chennai; CE docs attached.','2026-05-12 13:25:00','2026-05-12 13:25:00'),
  (:company,(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','HP Gas Burner 32kW','RFQ-DEMO-0004',60,1280.00,'INR',14,'2026-06-12','submitted','Domestic supply, faster lead time.','2026-05-13 09:55:00','2026-05-13 09:55:00');

-- ============================================================================
-- 10. procurement_vendor_scorecards (one per vendor)
-- ============================================================================
DELETE FROM procurement_vendor_scorecards WHERE "companyId" = :company;
INSERT INTO procurement_vendor_scorecards
  ("companyId","vendorCode","vendorName",category,"overallScore","qualityScore","deliveryScore","costScore","serviceScore",
   tier,"riskScore","riskLevel","totalSpend","totalOrders","lastEvaluated",status,"createdAt","updatedAt")
VALUES
  (:company,'VND-001','Prime Steel Suppliers','Raw Materials',91.20,93.00,92.00,88.50,91.00,'strategic',12.00,'low',902936.00,6,'2026-07-05','active','2025-10-05 09:00:00','2026-07-05 10:00:00'),
  (:company,'VND-002','Industrial Components Ltd.','Components',89.40,90.50,91.00,86.00,90.00,'strategic',15.00,'low',508226.00,5,'2026-07-05','active','2025-10-05 09:00:00','2026-07-05 10:00:00'),
  (:company,'VND-003','ElectroTech Supplies','Electronics',85.60,88.00,84.00,82.50,88.00,'preferred',22.00,'low',388220.00,3,'2026-07-05','active','2025-10-05 09:00:00','2026-07-05 10:00:00'),
  (:company,'VND-004','Bharat Metal Works Pvt. Ltd.','Raw Materials',79.80,74.00,85.00,84.00,76.00,'preferred',38.00,'medium',733016.00,4,'2026-07-05','active','2025-10-05 09:00:00','2026-07-05 10:00:00'),
  (:company,'VND-005','ProTool Equipment Inc.','Tools',77.50,80.00,75.00,76.00,79.00,'approved',30.00,'medium',88800.00,3,'2026-04-05','active','2025-10-05 09:00:00','2026-04-05 10:00:00'),
  (:company,'VND-006','PackRight Solutions','Packaging',86.30,85.00,90.00,87.00,83.00,'preferred',18.00,'low',166400.00,2,'2026-07-05','active','2025-10-05 09:00:00','2026-07-05 10:00:00'),
  (:company,'VND-007','MaintainPro Services','Services',82.10,81.00,83.00,80.50,84.00,'approved',35.00,'medium',35000.00,2,'2026-04-05','active','2025-10-05 09:00:00','2026-04-05 10:00:00'),
  (:company,'VND-008','Chemical Solutions GmbH','Consumables',78.90,84.00,72.00,79.00,80.00,'approved',42.00,'medium',164250.00,3,'2026-07-05','active','2025-10-05 09:00:00','2026-07-05 10:00:00');

-- ============================================================================
-- 11. purchase_invoices (AP; tied to PO-DEMO / GR-DEMO with 18% GST)
-- ============================================================================
DELETE FROM purchase_invoices WHERE "internalInvoiceNumber" LIKE 'PINV-DEMO-%';
INSERT INTO purchase_invoices
  ("internalInvoiceNumber","vendorInvoiceNumber","invoiceDate","dueDate","receivedDate",status,"invoiceType",
   "purchaseOrderNumber","purchaseOrderDate","goodsReceipts",
   "vendorId","vendorName","vendorCode","vendorGSTIN",
   items,currency,subtotal,"taxableAmount","cgstAmount","sgstAmount","igstAmount","totalTaxAmount","totalAmount",
   "paidAmount","balanceAmount","matchingStatus","isMatched","matchedAt","matchedBy",
   "isApproved","approvedBy","approverName","approvedAt",
   "paymentTerms","paymentTermsDays","lastPaymentDate","isPostedToAccounting","accountingPostedAt",
   "isImportInvoice","billOfEntryNumber","billOfEntryDate",notes,"createdBy","createdAt","updatedAt")
VALUES
  ('PINV-DEMO-0001','PSS-8841','2025-10-25','2025-11-24','2025-10-27','Paid','Standard',
   'PO-DEMO-0001','2025-10-07','[{"grnNumber":"GR-DEMO-0001","grnDate":"2025-10-23"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','VND-001',NULL,
   '[{"itemName":"SS-304 Sheet 18G 2500x1250","quantity":120,"uom":"Nos","rate":1650,"amount":198000,"gstRate":18}]',
   'INR',198000,198000,0,0,35640,35640,233640,233640,0,'3-Way Matched',true,'2025-10-28 11:00:00','EMP0015',
   true,'EMP0007','Amit Verma','2025-10-29 10:00:00','Net 30',30,'2025-11-20',true,'2025-10-30 09:00:00',
   false,NULL,NULL,'SS sheet lot; matched against GR-DEMO-0001.','EMP0015','2025-10-27 09:30:00','2025-11-20 16:00:00'),
  ('PINV-DEMO-0002','ICL-2210','2025-11-08','2025-12-23','2025-11-10','Paid','Standard',
   'PO-DEMO-0002','2025-10-21','[{"grnNumber":"GR-DEMO-0002","grnDate":"2025-11-06"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','VND-002',NULL,
   '[{"itemName":"Compressor 1.5HP R404a","quantity":30,"uom":"Nos","rate":3100,"amount":93000,"gstRate":18}]',
   'INR',93000,93000,0,0,16740,16740,109740,109740,0,'3-Way Matched',true,'2025-11-11 14:00:00','EMP0015',
   true,'EMP0007','Amit Verma','2025-11-12 09:30:00','Net 45',45,'2025-12-18',true,'2025-11-13 10:00:00',
   false,NULL,NULL,'Compressor supply, 30 units.','EMP0015','2025-11-10 10:15:00','2025-12-18 14:00:00'),
  ('PINV-DEMO-0003','ETS-5527','2025-11-22','2025-12-07','2025-11-24','Paid','Standard',
   'PO-DEMO-0003','2025-11-05','[{"grnNumber":"GR-DEMO-0003","grnDate":"2025-11-20"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','VND-003',NULL,
   '[{"itemName":"Control components — combi line","quantity":1,"uom":"Lot","rate":90000,"amount":90000,"gstRate":18}]',
   'INR',90000,90000,0,0,16200,16200,106200,106200,0,'3-Way Matched',true,'2025-11-25 10:30:00','EMP0007',
   true,'EMP0007','Amit Verma','2025-11-26 09:00:00','Net 15',15,'2025-12-05',true,'2025-11-27 09:00:00',
   false,NULL,NULL,'Electronics lot against GR-DEMO-0003.','EMP0007','2025-11-24 11:45:00','2025-12-05 10:00:00'),
  ('PINV-DEMO-0004','CSG-77012','2025-12-06','2026-01-20','2025-12-09','Paid','Standard',
   'PO-DEMO-0004','2025-11-18','[{"grnNumber":"GR-DEMO-0004","grnDate":"2025-12-04"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','VND-008',NULL,
   '[{"itemName":"Finishing chemicals — import consignment","quantity":1,"uom":"Lot","rate":71000,"amount":71000,"gstRate":18}]',
   'INR',71000,71000,0,0,12780,12780,83780,83780,0,'3-Way Matched',true,'2025-12-10 15:00:00','EMP0015',
   true,'EMP0007','Amit Verma','2025-12-11 10:00:00','Net 45',45,'2026-01-16',true,'2025-12-12 09:00:00',
   true,'BOE-INMAA-448812','2025-12-03','Import invoice; IGST on assessable value per BOE.','EMP0015','2025-12-09 09:20:00','2026-01-16 12:30:00'),
  ('PINV-DEMO-0005','BMW-1090','2025-12-20','2026-01-19','2025-12-22','Paid','Standard',
   'PO-DEMO-0005','2025-12-03','[{"grnNumber":"GR-DEMO-0005","grnDate":"2025-12-18"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','VND-004','24AABCB1234D1ZY',
   '[{"itemName":"SS sheets and burner castings","quantity":1,"uom":"Lot","rate":126000,"amount":126000,"gstRate":18}]',
   'INR',126000,126000,0,0,22680,22680,148680,127440,21240,'3-Way Matched',true,'2025-12-23 11:30:00','EMP0015',
   true,'EMP0007','Amit Verma','2025-12-24 09:15:00','Net 30',30,'2026-01-15',true,'2025-12-26 09:00:00',
   false,NULL,NULL,'Settled net of INR 21,240 debit for quality return PRET-DEMO-0001.','EMP0015','2025-12-22 10:40:00','2026-01-15 14:20:00'),
  ('PINV-DEMO-0006','PTE-3321','2026-01-07','2026-02-06','2026-01-09','Paid','Standard',
   'PO-DEMO-0006','2025-12-16','[{"grnNumber":"GR-DEMO-0006","grnDate":"2026-01-05"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-005'),'ProTool Equipment Inc.','VND-005',NULL,
   '[{"itemName":"Press tooling and welding consumables","quantity":1,"uom":"Lot","rate":31000,"amount":31000,"gstRate":18}]',
   'INR',31000,31000,0,0,5580,5580,36580,36580,0,'3-Way Matched',true,'2026-01-10 10:00:00','EMP0015',
   true,'EMP0007','Amit Verma','2026-01-12 09:00:00','Net 30',30,'2026-02-04',true,'2026-01-13 09:00:00',
   false,NULL,NULL,'Tooling replenishment.','EMP0015','2026-01-09 09:10:00','2026-02-04 15:30:00'),
  ('PINV-DEMO-0007','PRS-9904','2026-01-24','2026-02-08','2026-01-27','Paid','Standard',
   'PO-DEMO-0007','2026-01-08','[{"grnNumber":"GR-DEMO-0007","grnDate":"2026-01-22"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','VND-006',NULL,
   '[{"itemName":"Export crates and corrugated boxes","quantity":1,"uom":"Lot","rate":72000,"amount":72000,"gstRate":18}]',
   'INR',72000,72000,0,0,12960,12960,84960,84960,0,'3-Way Matched',true,'2026-01-28 11:00:00','EMP0015',
   true,'EMP0007','Amit Verma','2026-01-29 10:00:00','Net 15',15,'2026-02-06',true,'2026-01-30 09:00:00',
   false,NULL,NULL,'Packaging supply under annual contract.','EMP0015','2026-01-27 10:00:00','2026-02-06 12:00:00'),
  ('PINV-DEMO-0008','PSS-9102','2026-02-11','2026-03-13','2026-02-13','Partially Paid','Standard',
   'PO-DEMO-0008','2026-01-22','[{"grnNumber":"GR-DEMO-0008","grnDate":"2026-02-09"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','VND-001',NULL,
   '[{"itemName":"SS-304 and SS-316 sheet mix","quantity":1,"uom":"Lot","rate":235000,"amount":235000,"gstRate":18}]',
   'INR',235000,235000,0,0,42300,42300,277300,150000,127300,'3-Way Matched',true,'2026-02-14 10:30:00','EMP0015',
   true,'EMP0007','Amit Verma','2026-02-16 09:00:00','Net 30',30,'2026-03-20',true,'2026-02-17 09:00:00',
   false,NULL,NULL,'Part payment released; balance in next AP run.','EMP0015','2026-02-13 09:25:00','2026-03-20 15:45:00'),
  ('PINV-DEMO-0009','ICL-2544','2026-03-11','2026-04-25','2026-03-13','Approved','Standard',
   'PO-DEMO-0010','2026-02-19','[{"grnNumber":"GR-DEMO-0010","grnDate":"2026-03-09"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','VND-002',NULL,
   '[{"itemName":"Compressors and fan motors","quantity":1,"uom":"Lot","rate":112000,"amount":112000,"gstRate":18}]',
   'INR',112000,112000,0,0,20160,20160,132160,0,132160,'3-Way Matched',true,'2026-03-14 14:00:00','EMP0015',
   true,'EMP0007','Amit Verma','2026-03-16 09:30:00','Net 45',45,NULL,false,NULL,
   false,NULL,NULL,'Approved; queued for payment before due date.','EMP0015','2026-03-13 10:50:00','2026-03-16 09:30:00'),
  ('PINV-DEMO-0010','BMW-1201','2026-04-08','2026-05-08','2026-04-10','Under Verification','Standard',
   'PO-DEMO-0012','2026-03-19','[{"grnNumber":"GR-DEMO-0012","grnDate":"2026-04-06"}]',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','VND-004','24AABCB1234D1ZY',
   '[{"itemName":"SS sheets and burner assemblies","quantity":1,"uom":"Lot","rate":280200,"amount":280200,"gstRate":18}]',
   'INR',280200,280200,0,0,50436,50436,330636,0,330636,'Quantity Mismatch',false,NULL,NULL,
   false,NULL,NULL,NULL,'Net 30',30,NULL,false,NULL,
   false,NULL,NULL,'Invoiced quantity exceeds GR-DEMO-0012 receipt; vendor asked to issue credit note.','EMP0015','2026-04-10 09:35:00','2026-04-20 11:00:00');

-- ============================================================================
-- 12. purchase_returns (rejected material against GR-DEMO receipts)
-- ============================================================================
DELETE FROM purchase_returns WHERE "returnNumber" LIKE 'PRET-DEMO-%';
INSERT INTO purchase_returns
  ("returnNumber","returnDate",status,"goodsReceiptNumber","purchaseOrderNumber",
   "vendorId","vendorName","vendorCode","vendorContactPerson","vendorEmail",
   "returnReason","returnReasonDescription",items,currency,subtotal,"taxAmount","totalAmount",
   "dispatchDate","transporterName","lrNumber","eWayBillNumber",
   "isAcknowledgedByVendor","vendorAcknowledgmentDate","isCreditNoteReceived","creditNoteNumber","creditNoteDate","creditNoteAmount",
   "isApproved","approvedBy","approverName","approvedAt","isInventoryAdjusted","inventoryAdjustedAt",
   notes,"createdBy","createdAt","updatedAt")
VALUES
  ('PRET-DEMO-0001','2025-12-22','Credit Note Received','GR-DEMO-0005','PO-DEMO-0005',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','VND-004','Arun Sharma','asharma@bharatmetal.in',
   'Quality Issue','Surface pitting and weld porosity found on 12 SS sheets during incoming inspection of GR-DEMO-0005.',
   '[{"itemName":"SS-304 Sheet 18G 2500x1250","quantity":12,"uom":"Nos","rate":1500,"amount":18000}]',
   'INR',18000,3240,21240,
   '2025-12-27','SafeTrans Logistics','LR-88213','EWB-291100482213',
   true,'2025-12-30',true,'CN-BMW-0042','2026-01-08',21240,
   true,'EMP0007','Amit Verma','2025-12-24 10:00:00',true,'2025-12-27 16:00:00',
   'Debit adjusted against invoice PINV-DEMO-0005.','EMP0015','2025-12-22 11:30:00','2026-01-08 15:00:00'),
  ('PRET-DEMO-0002','2026-03-26','Dispatched','GR-DEMO-0011','PO-DEMO-0011',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','VND-003','David Lee','dlee@electrotech.com',
   'Defective','3 digital control panels failed power-on self-test during pre-fit bench check.',
   '[{"itemName":"Digital Control Panel IP54","quantity":3,"uom":"Nos","rate":4400,"amount":13200}]',
   'INR',13200,2376,15576,
   '2026-03-30','BlueDart Surface','LR-90455',NULL,
   false,NULL,false,NULL,NULL,NULL,
   true,'EMP0007','Amit Verma','2026-03-27 09:45:00',true,'2026-03-30 14:20:00',
   'Replacement units requested under warranty.','EMP0007','2026-03-26 10:20:00','2026-03-30 14:20:00'),
  ('PRET-DEMO-0003','2026-06-28','Approved','GR-DEMO-0017','PO-DEMO-0017',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','VND-006','Amanda Brown','abrown@packright.com',
   'Damaged','40 corrugated boxes received water-damaged; crates unaffected.',
   '[{"itemName":"Corrugated box 5-ply","quantity":40,"uom":"Nos","rate":85,"amount":3400}]',
   'INR',3400,612,4012,
   NULL,NULL,NULL,NULL,
   false,NULL,false,NULL,NULL,NULL,
   true,'EMP0015','Arun Gupta','2026-06-29 11:00:00',false,NULL,
   'Awaiting vendor pickup slot for damaged boxes.','EMP0015','2026-06-28 09:15:00','2026-06-29 11:00:00');

-- ============================================================================
-- 13. sourcing_rules
-- ============================================================================
DELETE FROM sourcing_rules WHERE "ruleCode" LIKE 'SRC-DEMO-%';
INSERT INTO sourcing_rules
  ("companyId","ruleCode","ruleName",description,"ruleType",status,priority,"triggerType",
   "triggerConditions",actions,"vendorCriteria","effectiveFrom","effectiveTo",
   "createdBy","approvedBy","approvedAt","createdAt","updatedAt")
VALUES
  (:company,'SRC-DEMO-001','Preferred vendor — SS sheets','Route all SS sheet purchase requisitions to Prime Steel Suppliers as preferred source.',
   'preferred_vendor','active',10,'item_category',
   '{"itemCategory":"Raw Materials","itemGroup":"SS Sheets"}',
   '{"action":"assign_vendor","vendorCode":"VND-001","fallbackVendorCode":"VND-004"}',
   '{"minRating":4.0,"requiredCertifications":["ISO 9001"]}',
   '2025-10-01',NULL,'EMP0015','EMP0007','2025-10-02 10:00:00','2025-10-01 09:00:00','2025-10-02 10:00:00'),
  (:company,'SRC-DEMO-002','Single source — compressors','Compressors are single-sourced from Industrial Components Ltd. under quality agreement QA-118.',
   'single_source','active',20,'item_category',
   '{"itemCategory":"Refrigeration","itemGroup":"Compressors"}',
   '{"action":"assign_vendor","vendorCode":"VND-002"}',
   '{"minRating":4.0,"requiredCertifications":["UL"]}',
   '2025-10-15',NULL,'EMP0015','EMP0007','2025-10-16 09:30:00','2025-10-15 09:00:00','2025-10-16 09:30:00'),
  (:company,'SRC-DEMO-003','Competitive bidding above 1L','Any PR line above INR 100,000 must go through RFQ with minimum 2 vendors.',
   'competitive_bidding','active',5,'amount_threshold',
   '{"minAmount":100000,"currency":"INR"}',
   '{"action":"create_rfq","minVendors":2,"evaluationMethod":"weighted_score"}',
   NULL,'2025-10-01',NULL,'EMP0015','EMP0007','2025-10-02 10:05:00','2025-10-01 09:05:00','2025-10-02 10:05:00'),
  (:company,'SRC-DEMO-004','Framework agreement — packaging','Packaging items procured against annual rate contract with PackRight (RFQ-DEMO-0007 award).',
   'framework_agreement','active',15,'item_category',
   '{"itemCategory":"Packaging"}',
   '{"action":"release_against_contract","contractNumber":"VC-DEMO-0003","vendorCode":"VND-006"}',
   NULL,'2026-01-05','2026-12-31','EMP0015','EMP0007','2026-01-06 09:00:00','2026-01-05 17:30:00','2026-01-06 09:00:00'),
  (:company,'SRC-DEMO-005','Emergency sourcing — line-down','Line-down criticality allows direct PO up to INR 50,000 bypassing RFQ, with post-facto approval.',
   'emergency','active',1,'criticality',
   '{"criticality":"line_down","maxAmount":50000}',
   '{"action":"direct_po","approvalMode":"post_facto","notifyRole":"procurement_head"}',
   NULL,'2025-10-01',NULL,'EMP0015','EMP0007','2025-10-02 10:10:00','2025-10-01 09:10:00','2025-10-02 10:10:00'),
  (:company,'SRC-DEMO-006','Spot purchase — consumables under 25K','Low-value consumables may be spot-purchased from any approved vendor.',
   'spot_purchase','inactive',50,'amount_threshold',
   '{"maxAmount":25000,"itemCategory":"Consumables"}',
   '{"action":"allow_spot_purchase","approvedVendorsOnly":true}',
   NULL,'2025-10-01','2026-03-31','EMP0015',NULL,NULL,'2025-10-01 09:15:00','2026-04-01 08:00:00');

-- ============================================================================
-- 14. supplier_diversity_programs
-- ============================================================================
DELETE FROM supplier_diversity_programs WHERE "companyId" = :company;
INSERT INTO supplier_diversity_programs
  ("companyId",supplier_id,category,certification_type,status,spend_amount,goal_percent,"createdAt","updatedAt")
VALUES
  (:company,'VND-004','MSME','Udyam Registration','enrolled',733016.00,15.00,'2025-10-10 09:00:00','2026-07-05 10:00:00'),
  (:company,'VND-006','Women-Owned Business','WBENC','enrolled',166400.00,5.00,'2026-01-10 09:00:00','2026-07-05 10:00:00'),
  (:company,'VND-005','Small Business','SBA Small Business','enrolled',88800.00,10.00,'2025-11-15 09:00:00','2026-04-05 10:00:00'),
  (:company,'VND-007','Minority-Owned Business','NMSDC','prospect',35000.00,5.00,'2026-02-01 09:00:00','2026-02-01 09:00:00'),
  (:company,'VND-003','Veteran-Owned Business','NVBDC','prospect',388220.00,3.00,'2026-03-15 09:00:00','2026-03-15 09:00:00'),
  (:company,NULL,'Local Supplier Development','State Industries Registration','planned',0.00,8.00,'2026-06-01 09:00:00','2026-06-01 09:00:00');

-- ============================================================================
-- 15. vendor_contracts
-- ============================================================================
DELETE FROM vendor_contracts WHERE "contractNumber" LIKE 'VC-DEMO-%';
INSERT INTO vendor_contracts
  ("contractNumber",title,description,"contractType",status,
   "vendorId","vendorName","vendorCode","startDate","endDate","effectiveDate",
   "totalValue",currency,"paymentTerms",items,"autoRenewal","renewalNoticeDays",
   "totalOrdered","totalDelivered","utilizationPercentage",
   "approvedBy","approvedAt","createdBy","createdAt","updatedAt")
VALUES
  ('VC-DEMO-0001','SS Sheet Rate Contract FY26','Annual rate contract for SS-304/316 sheets with quarterly price review linked to LME index.',
   'rate','active',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','VND-001',
   '2025-10-01 00:00:00','2026-09-30 00:00:00','2025-10-01 00:00:00',
   1200000,'INR','Net 30','[{"itemName":"SS-304 Sheet 18G","rate":1650,"uom":"Nos"},{"itemName":"SS-316 Sheet 16G","rate":2350,"uom":"Nos"}]',
   true,60,765200,765200,63.77,
   'EMP0007','2025-09-28 15:00:00','EMP0015','2025-09-25 10:00:00','2026-07-02 09:00:00'),
  ('VC-DEMO-0002','Compressor Supply Framework','Framework agreement for hermetic compressors 1.5–2.0HP with quality agreement QA-118 annexed.',
   'framework','active',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','VND-002',
   '2025-10-15 00:00:00','2026-10-14 00:00:00','2025-10-15 00:00:00',
   600000,'INR','Net 45','[{"itemName":"Compressor 1.5HP R404a","rate":3100,"uom":"Nos"},{"itemName":"Compressor 2.0HP R404a","rate":3900,"uom":"Nos"}]',
   false,45,430400,430400,71.73,
   'EMP0007','2025-10-12 11:00:00','EMP0015','2025-10-08 09:30:00','2026-08-13 10:00:00'),
  ('VC-DEMO-0003','Annual Packaging Contract FY26','Quantity contract from tender RFQ-DEMO-0007: crates, corrugated boxes, stretch film at fixed rates.',
   'quantity','active',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'PackRight Solutions','VND-006',
   '2026-01-05 00:00:00','2026-12-31 00:00:00','2026-01-05 00:00:00',
   688000,'INR','Net 15','[{"itemName":"Export wooden crate — large","rate":880,"uom":"Nos","contractedQty":500},{"itemName":"Corrugated box 5-ply","rate":82.67,"uom":"Nos","contractedQty":3000}]',
   false,30,166400,166400,24.19,
   'EMP0007','2026-01-04 16:00:00','EMP0015','2025-12-20 10:00:00','2026-06-04 09:00:00'),
  ('VC-DEMO-0004','Plant Utilities AMC','Annual maintenance contract for compressed air, refrigeration test rigs and shop utilities.',
   'maintenance','active',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-007'),'MaintainPro Services','VND-007',
   '2025-11-01 00:00:00','2026-10-31 00:00:00','2025-11-01 00:00:00',
   48000,'INR','Net 30','[{"itemName":"Quarterly preventive maintenance visit","rate":12000,"uom":"Visit","contractedQty":4}]',
   true,30,35000,35000,72.92,
   'EMP0007','2025-10-28 14:00:00','EMP0015','2025-10-20 09:00:00','2026-07-30 10:00:00'),
  ('VC-DEMO-0005','Finishing Chemicals Rate Contract','Rate contract for degreasers and passivation chemicals; expired pending renewal negotiation.',
   'rate','expired',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','VND-008',
   '2025-04-01 00:00:00','2026-03-31 00:00:00','2025-04-01 00:00:00',
   250000,'INR','Net 45','[{"itemName":"Food-grade Degreaser 25L","rate":640,"uom":"Can"},{"itemName":"SS Passivation Gel 5kg","rate":470,"uom":"Pail"}]',
   false,60,127750,127750,51.10,
   'EMP0007','2025-03-25 10:00:00','EMP0015','2025-03-15 09:00:00','2026-04-01 08:00:00'),
  ('VC-DEMO-0006','Control Panel Supply Agreement','Proposed value contract for combi-line control panels pending award of RFQ-DEMO-0003.',
   'value','pending_approval',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','VND-003',
   '2026-04-01 00:00:00','2027-03-31 00:00:00',NULL,
   450000,'INR','Net 15','[{"itemName":"Digital Control Panel IP54","rate":4400,"uom":"Nos"}]',
   false,30,0,0,0,
   NULL,NULL,'EMP0007','2026-03-10 11:00:00','2026-03-10 11:00:00');

-- ============================================================================
-- 16. vendor_evaluations (quarterly: Q4-2025 and Q1-2026 for top 4 vendors)
-- ============================================================================
DELETE FROM vendor_evaluations WHERE "evaluationNumber" LIKE 'VE-DEMO-%';
INSERT INTO vendor_evaluations
  ("evaluationNumber","evaluationDate","evaluationPeriodStart","evaluationPeriodEnd","evaluationPeriod",status,
   "vendorId","vendorName","vendorCode","vendorCategory","evaluatorId","evaluatorName",department,
   "qualityScore","totalDeliveries","defectiveDeliveries","defectRate",
   "deliveryScore","totalOrders","onTimeDeliveries","lateDeliveries","onTimeDeliveryPercentage",
   "priceScore","totalPurchaseValue","responsivenessScore","complianceScore","certificationsValid","serviceScore",
   "qualityWeightage","deliveryWeightage","priceWeightage","responsivenessWeightage","complianceWeightage","serviceWeightage",
   "overallScore","performanceGrade",ranking,recommendations,"recommendForFutureBusiness",
   "isApproved","approvedBy","approverName","approvedAt","createdBy","createdAt","updatedAt")
VALUES
  ('VE-DEMO-0001','2026-01-10','2025-10-01','2025-12-31','Quarterly','Approved',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','VND-001','Raw Materials','EMP0015','Arun Gupta','Procurement',
   93.00,3,0,0.00,92.00,3,3,0,100.00,
   88.00,510940,90.00,95.00,true,91.00,
   30.00,25.00,20.00,10.00,10.00,5.00,
   91.20,'A+',1,'Retain as strategic SS sheet source; extend rate contract into FY27.',true,
   true,'EMP0007','Amit Verma','2026-01-12 10:00:00','EMP0015','2026-01-10 09:00:00','2026-01-12 10:00:00'),
  ('VE-DEMO-0002','2026-01-10','2025-10-01','2025-12-31','Quarterly','Approved',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','VND-002','Components','EMP0015','Arun Gupta','Procurement',
   90.00,2,0,0.00,91.00,2,2,0,100.00,
   85.00,109740,89.00,92.00,true,90.00,
   30.00,25.00,20.00,10.00,10.00,5.00,
   89.10,'A',2,'Continue single-source for compressors; negotiate 2% volume rebate.',true,
   true,'EMP0007','Amit Verma','2026-01-12 10:05:00','EMP0015','2026-01-10 09:10:00','2026-01-12 10:05:00'),
  ('VE-DEMO-0003','2026-01-10','2025-10-01','2025-12-31','Quarterly','Approved',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','VND-004','Raw Materials','EMP0015','Arun Gupta','Procurement',
   72.00,1,1,100.00,86.00,1,1,0,100.00,
   84.00,126000,78.00,88.00,true,75.00,
   30.00,25.00,20.00,10.00,10.00,5.00,
   78.90,'B',4,'Quality return PRET-DEMO-0001 in Dec-25; require pre-dispatch inspection for next two lots.',true,
   true,'EMP0007','Amit Verma','2026-01-12 10:10:00','EMP0015','2026-01-10 09:20:00','2026-01-12 10:10:00'),
  ('VE-DEMO-0004','2026-01-10','2025-10-01','2025-12-31','Quarterly','Approved',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'Chemical Solutions GmbH','VND-008','Consumables','EMP0007','Amit Verma','Procurement',
   85.00,1,0,0.00,74.00,1,0,1,0.00,
   80.00,71000,76.00,90.00,true,79.00,
   30.00,25.00,20.00,10.00,10.00,5.00,
   80.30,'B+',3,'Delivery slipped 2 days on import lot; build 1-week buffer into reorder point.',true,
   true,'EMP0007','Amit Verma','2026-01-12 10:15:00','EMP0007','2026-01-10 09:30:00','2026-01-12 10:15:00'),
  ('VE-DEMO-0005','2026-04-08','2026-01-01','2026-03-31','Quarterly','Approved',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','VND-001','Raw Materials','EMP0015','Arun Gupta','Procurement',
   92.00,2,0,0.00,90.00,2,2,0,100.00,
   87.00,277300,91.00,95.00,true,92.00,
   30.00,25.00,20.00,10.00,10.00,5.00,
   90.50,'A+',1,'Consistent performance; shortlist for SS-316 marine-grade expansion.',true,
   true,'EMP0007','Amit Verma','2026-04-10 10:00:00','EMP0015','2026-04-08 09:00:00','2026-04-10 10:00:00'),
  ('VE-DEMO-0006','2026-04-08','2026-01-01','2026-03-31','Quarterly','Approved',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-002'),'Industrial Components Ltd.','VND-002','Components','EMP0015','Arun Gupta','Procurement',
   91.00,1,0,0.00,92.00,1,1,0,100.00,
   86.00,132160,90.00,92.00,true,90.00,
   30.00,25.00,20.00,10.00,10.00,5.00,
   89.90,'A',2,'OTD held at 100%; evaluate for control panel dual-sourcing with VND-003.',true,
   true,'EMP0007','Amit Verma','2026-04-10 10:05:00','EMP0015','2026-04-08 09:10:00','2026-04-10 10:05:00'),
  ('VE-DEMO-0007','2026-04-08','2026-01-01','2026-03-31','Quarterly','Completed',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','VND-003','Electronics','EMP0007','Amit Verma','Procurement',
   80.00,1,1,100.00,84.00,1,1,0,100.00,
   82.00,129800,88.00,90.00,true,88.00,
   30.00,25.00,20.00,10.00,10.00,5.00,
   83.30,'B+',3,'3 defective panels returned (PRET-DEMO-0002); monitor warranty replacements before award of RFQ-DEMO-0003.',true,
   false,NULL,NULL,NULL,'EMP0007','2026-04-08 09:20:00','2026-04-08 09:20:00'),
  ('VE-DEMO-0008','2026-07-06','2026-04-01','2026-06-30','Quarterly','Completed',
   (SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','VND-004','Raw Materials','EMP0015','Arun Gupta','Procurement',
   76.00,2,0,0.00,85.00,2,2,0,100.00,
   83.00,468336,74.00,88.00,true,76.00,
   30.00,25.00,20.00,10.00,10.00,5.00,
   79.60,'B',4,'Quantity billing mismatch on PINV-DEMO-0010; tighten dispatch documentation controls.',true,
   false,NULL,NULL,NULL,'EMP0015','2026-07-06 09:00:00','2026-07-06 09:00:00');
