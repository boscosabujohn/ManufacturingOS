-- Demo seed — Sales extended masters & operations for B3 MACBIS.
-- Tables: sales_tax_rates, sales_terms_templates, sales_shipping_methods,
--         sales_discounts, sales_promotions, sales_price_list_items,
--         sales_special_prices, sales_targets, sales_reports,
--         sales_handovers, sales_handover_package_documents
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: every table is cleared by "companyId" = :company (this file is the
-- sole seeder of these 11 tables), then re-inserted. Unique-ish codes carry a
-- DEMO- prefix (discount codes, promotion codes, HO-DEMO-*, PRJ-DEMO-*).
-- References: accepted sales_quotations (QT-DEMO-*), crm_customers names,
-- items.standardSellingPrice (via subselects), hr_employees names.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- 1. sales_tax_rates — Indian GST slabs (5/12/18/28, CGST/SGST/IGST) + US state sales tax
-- ---------------------------------------------------------------------------
DELETE FROM sales_tax_rates WHERE "companyId" = :company;
INSERT INTO sales_tax_rates
  ("companyId", name, "taxType", rate, "cgstRate", "sgstRate", "igstRate", "hsnCode", "sacCode",
   category, "applicableProducts", description, status, "effectiveDate", "usageCount",
   "createdAt", "updatedAt")
VALUES
  (:company,'GST 5% — Packaged Food & Consumables','GST',5.00,2.50,2.50,5.00,'2106',NULL,
   'Consumables','["CON-LUB-001","CON-CLT-001"]','Lowest GST slab for consumable supplies shipped with kitchen installations.','active','2025-10-01',14,'2025-10-01 09:00:00','2026-06-15 11:20:00'),
  (:company,'GST 12% — Commercial Kitchen Utensils','GST',12.00,6.00,6.00,12.00,'7323',NULL,
   'Utensils','["SP-BLT-001","SP-BRG-001"]','Table, kitchen and household articles of iron or steel.','active','2025-10-01',22,'2025-10-01 09:00:00','2026-07-02 10:05:00'),
  (:company,'GST 18% — Commercial Cooking Equipment','GST',18.00,9.00,9.00,18.00,'8419',NULL,
   'Cooking Equipment','["FG-PMP-001","FG-MTR-001","FG-GBX-001"]','Standard slab for combi ovens, cooking ranges and machinery for treatment of materials by heat.','active','2025-10-01',86,'2025-10-01 09:00:00','2026-08-20 16:40:00'),
  (:company,'GST 18% — Installation & AMC Services','GST',18.00,9.00,9.00,18.00,NULL,'998717',
   'Services','["SVC-MNT-001","SVC-CAL-001"]','Maintenance, repair and installation services for commercial kitchen equipment.','active','2025-10-01',41,'2025-10-01 09:00:00','2026-08-01 09:30:00'),
  (:company,'GST 28% — Refrigeration & Dishwashing Lines','GST',28.00,14.00,14.00,28.00,'8418',NULL,
   'Refrigeration','["FG-GBX-001"]','Top slab for blast chillers, cold rooms and dishwashing machinery.','active','2025-10-01',33,'2025-10-01 09:00:00','2026-05-11 14:10:00'),
  (:company,'California Sales Tax','Sales Tax',7.25,NULL,NULL,NULL,NULL,NULL,
   'US State Tax','[]','Statewide base rate applied to San Francisco and San Diego installations.','active','2025-10-01',18,'2025-10-01 09:00:00','2026-06-30 12:00:00'),
  (:company,'New York Sales Tax (NYC combined)','Sales Tax',8.88,NULL,NULL,NULL,NULL,NULL,
   'US State Tax','[]','Combined state + city rate for New York City hotel projects.','active','2025-10-01',12,'2025-10-01 09:00:00','2026-04-18 15:45:00'),
  (:company,'Texas Sales Tax','Sales Tax',6.25,NULL,NULL,NULL,NULL,NULL,
   'US State Tax','[]','Statewide base rate for Texas franchise roll-outs.','active','2025-11-15',5,'2025-11-15 09:00:00','2026-03-22 10:25:00');

-- ---------------------------------------------------------------------------
-- 2. sales_terms_templates
-- ---------------------------------------------------------------------------
DELETE FROM sales_terms_templates WHERE "companyId" = :company;
INSERT INTO sales_terms_templates
  ("companyId", name, type, category, content, status, "applicableTo", "usageCount",
   "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Standard Payment Terms','payment','Commercial',
   '30% advance with purchase order, 60% against delivery, 10% on commissioning sign-off. Payments beyond due date attract 1.5% interest per month.','active','["Quotations","Orders"]',48,'2025-10-02 10:00:00','2026-07-14 09:10:00'),
  (:company,'DEMO Delivery & Installation Terms','delivery','Operations',
   'Delivery within 6-8 weeks from technically and commercially clear order. Site must provide power, water and drainage points per approved layout before installation crew mobilises.','active','["Quotations","Handover"]',36,'2025-10-02 10:05:00','2026-06-25 11:30:00'),
  (:company,'DEMO 12-Month Warranty Terms','warranty','After-Sales',
   'All equipment warranted for 12 months from commissioning or 15 months from dispatch, whichever is earlier. Warranty covers manufacturing defects; consumables, gaskets and glass excluded.','active','["Quotations","Orders","Handover"]',52,'2025-10-02 10:10:00','2026-08-09 16:20:00'),
  (:company,'DEMO Commissioning & Training Terms','general','Operations',
   'Commissioning includes performance run of combi ovens, blast chillers and dishwashing lines against rated capacity, plus one day of operator training for up to 8 kitchen staff.','active','["Handover"]',21,'2025-11-10 09:30:00','2026-05-30 14:00:00'),
  (:company,'DEMO Annual Maintenance Contract Terms','general','After-Sales',
   'AMC covers 4 preventive visits per year, priority breakdown response within 24 hours, and 10% discount on spares. Refrigerant top-up charged at actuals.','active','["After-Sales"]',17,'2025-12-01 09:00:00','2026-07-28 10:45:00'),
  (:company,'DEMO General Terms & Conditions','general','Legal',
   'Prices are ex-works unless stated otherwise. Quotation validity 30 days. Taxes as applicable at the time of billing. Disputes subject to arbitration at the seat of the seller.','active','["Quotations","Orders"]',64,'2025-10-02 10:15:00','2026-08-18 12:35:00');

-- ---------------------------------------------------------------------------
-- 3. sales_shipping_methods
-- ---------------------------------------------------------------------------
DELETE FROM sales_shipping_methods WHERE "companyId" = :company;
INSERT INTO sales_shipping_methods
  ("companyId", name, carrier, type, "deliveryDays", "baseRate", "perKgRate", "minWeight",
   "maxWeight", "freeShippingThreshold", zones, "applicableProducts", "insuranceIncluded",
   "trackingAvailable", status, "usageCount", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Standard Freight','B3 Logistics Fleet','standard','7-10',450.00,1.80,50.00,2000.00,50000.00,
   '["West","Central","East"]','[]',false,true,'active',34,'2025-10-03 09:00:00','2026-08-12 10:00:00'),
  (:company,'DEMO Express Freight','FedEx Freight','express','2-4',1200.00,3.50,10.00,800.00,NULL,
   '["West","East"]','[]',true,true,'active',18,'2025-10-03 09:05:00','2026-07-19 15:20:00'),
  (:company,'DEMO White-Glove Installation Delivery','B3 Logistics Fleet','white-glove','10-14',2500.00,2.20,100.00,5000.00,NULL,
   '["West","Central","East"]','["FG-GBX-001","FG-MTR-001"]',true,true,'active',26,'2025-10-03 09:10:00','2026-08-25 09:40:00'),
  (:company,'DEMO Refrigerated Transport','ColdChain Express','refrigerated','3-6',1800.00,4.00,50.00,1500.00,NULL,
   '["West","East"]','["FG-PMP-001"]',true,true,'active',9,'2025-11-20 10:00:00','2026-06-08 11:15:00'),
  (:company,'DEMO Small Parts Courier','DHL Express','courier','1-3',150.00,6.50,0.50,30.00,5000.00,
   '["West","Central","East"]','["SP-BRG-001","SP-BLT-001","SP-SL-001","TOOL-INS-001","TOOL-DRL-001"]',false,true,'active',57,'2025-10-03 09:15:00','2026-09-01 08:50:00'),
  (:company,'DEMO Project Cargo (Oversized)','Maersk Inland','freight','21-30',6500.00,1.20,2000.00,20000.00,NULL,
   '["East"]','[]',true,false,'inactive',3,'2026-01-15 10:30:00','2026-04-10 13:00:00');

-- ---------------------------------------------------------------------------
-- 4. sales_discounts (codes DEMO-*)
-- ---------------------------------------------------------------------------
DELETE FROM sales_discounts WHERE "companyId" = :company;
INSERT INTO sales_discounts
  ("companyId", code, name, type, category, value, "minQuantity", "minOrderValue",
   "maxDiscount", "applicableProducts", "validFrom", "validTo", status, "usageCount",
   "usageLimit", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-VOL10','Volume Discount 10% (5+ units)','percentage','volume',10.00,5,0.00,25000.00,
   '["FG-PMP-001","FG-MTR-001"]','2025-10-01','2026-09-30','active',14,100,'2025-10-01 09:30:00','2026-08-14 10:10:00'),
  (:company,'DEMO-VOL15','Volume Discount 15% (10+ units)','percentage','volume',15.00,10,0.00,60000.00,
   '["FG-PMP-001","FG-MTR-001","FG-GBX-001"]','2025-10-01','2026-09-30','active',6,50,'2025-10-01 09:32:00','2026-07-22 14:25:00'),
  (:company,'DEMO-KEYACC8','Key Account Loyalty 8%','percentage','customer',8.00,0,50000.00,40000.00,
   '[]','2025-10-01','2026-09-30','active',11,NULL,'2025-10-01 09:35:00','2026-08-30 09:05:00'),
  (:company,'DEMO-EDU12','Education & Healthcare 12%','percentage','segment',12.00,0,25000.00,30000.00,
   '[]','2025-10-01','2026-09-30','active',5,40,'2025-10-15 11:00:00','2026-05-26 16:30:00'),
  (:company,'DEMO-SEAS5','Holiday Season 5%','percentage','seasonal',5.00,0,10000.00,10000.00,
   '[]','2025-11-15','2026-01-15','expired',19,200,'2025-11-10 10:00:00','2026-01-16 08:00:00'),
  (:company,'DEMO-INSTALL2500','Free Installation Credit','fixed','promotional',2500.00,1,75000.00,2500.00,
   '["SVC-MNT-001"]','2026-02-01','2026-06-30','expired',8,25,'2026-01-25 09:45:00','2026-07-01 08:00:00'),
  (:company,'DEMO-CLEAR20','Showroom Clearance 20%','percentage','clearance',20.00,1,0.00,15000.00,
   '["SP-SL-001","SP-BRG-001","SP-BLT-001"]','2026-07-01','2026-09-30','active',4,30,'2026-06-24 12:00:00','2026-09-05 10:20:00');

-- ---------------------------------------------------------------------------
-- 5. sales_promotions (codes DEMO-*)
-- ---------------------------------------------------------------------------
DELETE FROM sales_promotions WHERE "companyId" = :company;
INSERT INTO sales_promotions
  ("companyId", name, code, type, description, category, "applicableProducts",
   "discountType", "discountValue", "startDate", "endDate", status, "targetAudience",
   "minPurchase", "maxDiscount", "claimedCount", "targetCount", revenue, "bannerImage",
   "createdAt", "updatedAt")
VALUES
  (:company,'Holiday Season Kitchen Refresh','DEMO-PROMO-HOL25','seasonal',
   'Year-end offer on combi ovens and cooking lines for hotels planning January refits.','Cooking Equipment',
   '["FG-PMP-001","FG-MTR-001"]','percentage',7.50,'2025-11-15','2026-01-10','completed','Hospitality',
   25000.00,20000.00,17,25,412000.00,NULL,'2025-11-01 09:00:00','2026-01-12 09:00:00'),
  (:company,'Spring Trade Show Special','DEMO-PROMO-NRA26','event',
   'Booth-exclusive pricing launched at the National Restaurant Association show.','All',
   '[]','percentage',5.00,'2026-03-01','2026-04-15','completed','Trade Show Leads',
   10000.00,12000.00,23,40,286500.00,NULL,'2026-02-18 10:30:00','2026-04-16 09:00:00'),
  (:company,'Summer Clearance — Refrigeration','DEMO-PROMO-SUMCLR','clearance',
   'Clearance on current-generation blast chillers ahead of the Gen-5 refrigeration launch.','Refrigeration',
   '["FG-GBX-001"]','percentage',15.00,'2026-07-01','2026-09-30','active','All Customers',
   15000.00,30000.00,9,20,168400.00,NULL,'2026-06-20 11:00:00','2026-09-04 15:10:00'),
  (:company,'Dishwashing Line + AMC Bundle','DEMO-PROMO-BUNDLE','bundle',
   'Buy any dishwashing line and get the first-year annual maintenance contract at 50% off.','Dishwashing',
   '["SVC-MNT-001"]','percentage',50.00,'2026-05-01','2026-10-31','active','Existing Customers',
   40000.00,4250.00,6,15,74800.00,NULL,'2026-04-22 14:00:00','2026-08-27 10:40:00'),
  (:company,'FY27 Launch — Combi Oven Gen-5','DEMO-PROMO-GEN5','launch',
   'Introductory pricing for the Gen-5 combi oven range; early-bird orders ship priority.','Cooking Equipment',
   '[]','fixed',3000.00,'2026-10-01','2026-12-31','scheduled','Key Accounts',
   50000.00,3000.00,0,30,0.00,NULL,'2026-08-15 09:20:00','2026-08-15 09:20:00'),
  (:company,'Campus Dining Winter Program','DEMO-PROMO-EDUWIN','segment',
   'Targeted refresh program for education-sector kitchens during winter break windows.','All',
   '[]','percentage',10.00,'2025-12-01','2026-02-28','completed','Education',
   20000.00,18000.00,4,10,92600.00,NULL,'2025-11-24 10:00:00','2026-03-02 09:00:00');

-- ---------------------------------------------------------------------------
-- 6. sales_price_list_items — priced off items.standardSellingPrice
--    (the 10 catalogue items with non-zero selling prices; +4% FY26 revision)
-- ---------------------------------------------------------------------------
DELETE FROM sales_price_list_items WHERE "companyId" = :company;
INSERT INTO sales_price_list_items
  ("companyId", "productCode", "productName", category, "basePrice", "currentPrice", unit,
   "effectiveFrom", "priceChange", "priceChangePercent", moq, stock, status,
   "createdAt", "updatedAt")
SELECT
  'b3000000-0000-4000-8000-000000000001',
  i."itemCode",
  i."itemName",
  CASE
    WHEN i."itemCode" LIKE 'FG-%'   THEN 'Finished Goods'
    WHEN i."itemCode" LIKE 'SVC-%'  THEN 'Services'
    WHEN i."itemCode" LIKE 'TOOL-%' THEN 'Tooling'
    WHEN i."itemCode" LIKE 'SP-%'   THEN 'Spare Parts'
    ELSE 'General'
  END,
  i."standardSellingPrice",
  ROUND(i."standardSellingPrice" * 1.04, 2),
  CASE WHEN i."itemCode" LIKE 'SVC-%' THEN 'service' ELSE 'piece' END,
  DATE '2026-04-01',
  ROUND(i."standardSellingPrice" * 0.04, 2),
  4.00,
  CASE
    WHEN i."itemCode" LIKE 'FG-%'   THEN 1
    WHEN i."itemCode" LIKE 'SVC-%'  THEN 1
    WHEN i."itemCode" LIKE 'TOOL-%' THEN 10
    ELSE 20
  END,
  CASE
    WHEN i."itemCode" LIKE 'FG-%'   THEN 12
    WHEN i."itemCode" LIKE 'SVC-%'  THEN 0
    WHEN i."itemCode" LIKE 'TOOL-%' THEN 150
    ELSE 400
  END,
  'active',
  TIMESTAMP '2026-03-20 09:00:00',
  TIMESTAMP '2026-04-01 09:00:00'
FROM items i
WHERE i."standardSellingPrice" > 0;

-- ---------------------------------------------------------------------------
-- 7. sales_special_prices — negotiated customer pricing off items.standardSellingPrice
-- ---------------------------------------------------------------------------
DELETE FROM sales_special_prices WHERE "companyId" = :company;
INSERT INTO sales_special_prices
  ("companyId", "customerName", "customerType", "productCode", "productName", category,
   "standardPrice", "specialPrice", "discountPercent", "minOrderQty", "validFrom", "validTo",
   status, "approvedBy", "contractRef", "orderCount", "totalRevenue", "createdAt", "updatedAt")
VALUES
  (:company,'Blue Fig Hotels Group','key-account','FG-PMP-001','Centrifugal Pump CP-200','Finished Goods',
   (SELECT "standardSellingPrice" FROM items WHERE "itemCode"='FG-PMP-001'),
   ROUND((SELECT "standardSellingPrice" FROM items WHERE "itemCode"='FG-PMP-001')*0.90,2),10.00,4,
   '2025-10-01','2026-09-30','active','Rajesh Kumar','DEMO-CTR-2025-001',7,315000.00,'2025-10-05 10:00:00','2026-08-11 09:30:00'),
  (:company,'Golden Spoon Franchises','key-account','FG-MTR-001','Industrial Motor 5HP','Finished Goods',
   (SELECT "standardSellingPrice" FROM items WHERE "itemCode"='FG-MTR-001'),
   ROUND((SELECT "standardSellingPrice" FROM items WHERE "itemCode"='FG-MTR-001')*0.88,2),12.00,6,
   '2025-11-01','2026-10-31','active','Rajesh Kumar','DEMO-CTR-2025-002',9,439560.00,'2025-10-28 11:15:00','2026-08-25 14:00:00'),
  (:company,'Harbour Grill Restaurants','dealer','FG-GBX-001','Precision Gearbox PG-50','Finished Goods',
   (SELECT "standardSellingPrice" FROM items WHERE "itemCode"='FG-GBX-001'),
   ROUND((SELECT "standardSellingPrice" FROM items WHERE "itemCode"='FG-GBX-001')*0.92,2),8.00,2,
   '2025-10-15','2026-09-30','active','Rajesh Kumar','DEMO-CTR-2025-003',4,235520.00,'2025-10-12 09:40:00','2026-07-30 10:20:00'),
  (:company,'Metro Hospital Kitchens','institutional','SVC-MNT-001','Preventive Maintenance Service','Services',
   (SELECT "standardSellingPrice" FROM items WHERE "itemCode"='SVC-MNT-001'),
   ROUND((SELECT "standardSellingPrice" FROM items WHERE "itemCode"='SVC-MNT-001')*0.85,2),15.00,4,
   '2026-01-01','2026-12-31','active','Priya Sharma','DEMO-CTR-2026-004',3,86700.00,'2025-12-18 15:00:00','2026-08-05 11:45:00'),
  (:company,'Campus Dining Co-op','institutional','TOOL-DRL-001','HSS Drill Bit Set 1-13mm','Tooling',
   (SELECT "standardSellingPrice" FROM items WHERE "itemCode"='TOOL-DRL-001'),
   ROUND((SELECT "standardSellingPrice" FROM items WHERE "itemCode"='TOOL-DRL-001')*0.90,2),10.00,10,
   '2026-02-01','2026-09-30','active','Priya Sharma','DEMO-CTR-2026-005',2,45000.00,'2026-01-22 10:30:00','2026-06-14 09:15:00'),
  (:company,'Summit Catering Services','dealer','SP-BRG-001','Ball Bearing 6205','Spare Parts',
   (SELECT "standardSellingPrice" FROM items WHERE "itemCode"='SP-BRG-001'),
   ROUND((SELECT "standardSellingPrice" FROM items WHERE "itemCode"='SP-BRG-001')*0.88,2),12.00,50,
   '2025-12-01','2026-11-30','active','Rajesh Kumar','DEMO-CTR-2025-006',5,143000.00,'2025-11-26 14:20:00','2026-08-19 16:00:00'),
  (:company,'Lakeside Resort & Spa','key-account','SVC-CAL-001','Instrument Calibration Service','Services',
   (SELECT "standardSellingPrice" FROM items WHERE "itemCode"='SVC-CAL-001'),
   ROUND((SELECT "standardSellingPrice" FROM items WHERE "itemCode"='SVC-CAL-001')*0.90,2),10.00,2,
   '2026-03-01','2027-02-28','active','Priya Sharma','DEMO-CTR-2026-007',2,16200.00,'2026-02-20 09:50:00','2026-07-08 10:10:00'),
  (:company,'Golden Spoon Franchises','key-account','SP-SL-001','Mechanical Seal MS-40','Spare Parts',
   (SELECT "standardSellingPrice" FROM items WHERE "itemCode"='SP-SL-001'),
   ROUND((SELECT "standardSellingPrice" FROM items WHERE "itemCode"='SP-SL-001')*0.85,2),15.00,20,
   '2026-04-01','2026-12-31','pending','Rajesh Kumar','DEMO-CTR-2026-008',0,0.00,'2026-03-25 13:00:00','2026-03-25 13:00:00');

-- ---------------------------------------------------------------------------
-- 8. sales_targets — FY26 (Oct 2025–Sep 2026), quarterly + monthly per rep.
--    Achieved figures reconcile with the 12 accepted QT-DEMO-* quotations:
--    Sarah Mitchell $1,469,548.40 / David Williams $468,601.60 (by account ownership).
-- ---------------------------------------------------------------------------
DELETE FROM sales_targets WHERE "companyId" = :company;
INSERT INTO sales_targets
  ("companyId", name, type, period, target, achieved, progress, status, "assignedTo",
   category, region, "startDate", "endDate", "daysRemaining", "createdAt", "updatedAt")
VALUES
  (:company,'Q1 FY26 Revenue — Sarah Mitchell','individual','Q1 FY26 (Oct-Dec 2025)',300000.00,273406.00,91.14,'missed','Sarah Mitchell','Revenue','West','2025-10-01','2025-12-31',0,'2025-10-01 08:00:00','2026-01-02 09:00:00'),
  (:company,'Q2 FY26 Revenue — Sarah Mitchell','individual','Q2 FY26 (Jan-Mar 2026)',450000.00,505724.40,112.38,'achieved','Sarah Mitchell','Revenue','West','2026-01-01','2026-03-31',0,'2025-12-20 08:00:00','2026-04-01 09:00:00'),
  (:company,'Q3 FY26 Revenue — Sarah Mitchell','individual','Q3 FY26 (Apr-Jun 2026)',600000.00,690418.00,115.07,'achieved','Sarah Mitchell','Revenue','West','2026-04-01','2026-06-30',0,'2026-03-24 08:00:00','2026-07-01 09:00:00'),
  (:company,'Q4 FY26 Revenue — Sarah Mitchell','individual','Q4 FY26 (Jul-Sep 2026)',500000.00,0.00,0.00,'behind','Sarah Mitchell','Revenue','West','2026-07-01','2026-09-30',20,'2026-06-25 08:00:00','2026-09-10 08:00:00'),
  (:company,'Q1 FY26 Revenue — David Williams','individual','Q1 FY26 (Oct-Dec 2025)',150000.00,91308.40,60.87,'missed','David Williams','Revenue','East','2025-10-01','2025-12-31',0,'2025-10-01 08:00:00','2026-01-02 09:00:00'),
  (:company,'Q2 FY26 Revenue — David Williams','individual','Q2 FY26 (Jan-Mar 2026)',160000.00,146320.00,91.45,'missed','David Williams','Revenue','East','2026-01-01','2026-03-31',0,'2025-12-20 08:00:00','2026-04-01 09:00:00'),
  (:company,'Q3 FY26 Revenue — David Williams','individual','Q3 FY26 (Apr-Jun 2026)',220000.00,230973.20,104.99,'achieved','David Williams','Revenue','East','2026-04-01','2026-06-30',0,'2026-03-24 08:00:00','2026-07-01 09:00:00'),
  (:company,'Q4 FY26 Revenue — David Williams','individual','Q4 FY26 (Jul-Sep 2026)',250000.00,0.00,0.00,'behind','David Williams','Revenue','East','2026-07-01','2026-09-30',20,'2026-06-25 08:00:00','2026-09-10 08:00:00'),
  (:company,'May 2026 Revenue — Sarah Mitchell','individual','May 2026',200000.00,204730.00,102.37,'achieved','Sarah Mitchell','Revenue','West','2026-05-01','2026-05-31',0,'2026-04-27 08:00:00','2026-06-01 09:00:00'),
  (:company,'June 2026 Revenue — Sarah Mitchell','individual','June 2026',220000.00,234230.00,106.47,'achieved','Sarah Mitchell','Revenue','West','2026-06-01','2026-06-30',0,'2026-05-27 08:00:00','2026-07-01 09:00:00'),
  (:company,'April 2026 Revenue — David Williams','individual','April 2026',130000.00,140420.00,108.02,'achieved','David Williams','Revenue','East','2026-04-01','2026-04-30',0,'2026-03-27 08:00:00','2026-05-01 09:00:00'),
  (:company,'May 2026 Revenue — David Williams','individual','May 2026',100000.00,90553.20,90.55,'missed','David Williams','Revenue','East','2026-05-01','2026-05-31',0,'2026-04-27 08:00:00','2026-06-01 09:00:00');

-- ---------------------------------------------------------------------------
-- 9. sales_reports
-- ---------------------------------------------------------------------------
DELETE FROM sales_reports WHERE "companyId" = :company;
INSERT INTO sales_reports
  ("companyId", name, type, description, period, "generatedDate", "generatedBy", "fileSize",
   format, "keyMetrics", status, "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Monthly Sales Summary — June 2026','sales',
   'Bookings, billings and backlog for June 2026 across all regions.','June 2026','2026-07-02','Sarah Mitchell','1.4 MB','PDF',
   '[{"label":"Bookings","value":"$234,230"},{"label":"Quotes Sent","value":"5"},{"label":"Win Rate","value":"40%"}]','ready','2026-07-02 10:00:00','2026-07-02 10:00:00'),
  (:company,'DEMO Quarterly Performance — Q3 FY26','performance',
   'Rep-wise quota attainment for April-June 2026.','Q3 FY26','2026-07-05','Rajesh Kumar','2.1 MB','PDF',
   '[{"label":"Team Attainment","value":"112%"},{"label":"Accepted Quotes","value":"5"},{"label":"Revenue","value":"$921,391"}]','ready','2026-07-05 09:30:00','2026-07-05 09:30:00'),
  (:company,'DEMO Pipeline & Funnel Analysis — H1 FY26','pipeline',
   'Stage-wise conversion from lead to accepted quotation, Oct 2025-Mar 2026.','H1 FY26','2026-04-10','David Williams','3.2 MB','XLSX',
   '[{"label":"Open Pipeline","value":"$2.04M"},{"label":"Accepted","value":"$1.06M"},{"label":"Avg Deal Size","value":"$161,512"}]','ready','2026-04-10 14:20:00','2026-04-10 14:20:00'),
  (:company,'DEMO Discount Utilization Report — FY26 YTD','discount',
   'Usage and margin impact of DEMO-VOL, DEMO-KEYACC and seasonal discount schemes.','FY26 YTD','2026-08-01','Priya Sharma','860 KB','PDF',
   '[{"label":"Discounts Redeemed","value":"67"},{"label":"Margin Impact","value":"-2.3%"},{"label":"Top Scheme","value":"DEMO-SEAS5"}]','ready','2026-08-01 11:00:00','2026-08-01 11:00:00'),
  (:company,'DEMO Regional Sales Breakdown — FY26 YTD','regional',
   'West vs East vs Central revenue split with customer segment overlay.','FY26 YTD','2026-08-15','Sarah Mitchell','1.9 MB','XLSX',
   '[{"label":"West","value":"$1.02M"},{"label":"East","value":"$0.68M"},{"label":"Central","value":"$0.24M"}]','ready','2026-08-15 09:45:00','2026-08-15 09:45:00'),
  (:company,'DEMO Q4 FY26 Forecast','forecast',
   'Weighted pipeline forecast for July-September 2026; generation in progress.','Q4 FY26','2026-09-08','Rajesh Kumar',NULL,'PDF',
   '[]','generating','2026-09-08 16:30:00','2026-09-08 16:30:00');

-- ---------------------------------------------------------------------------
-- 10. sales_handovers — sales-to-projects handover for accepted QT-DEMO-* quotations
--     (insert before sales_handover_package_documents)
-- ---------------------------------------------------------------------------
DELETE FROM sales_handovers WHERE "companyId" = :company;
INSERT INTO sales_handovers
  ("companyId", "handoverNumber", "projectNumber", "projectName", customer, "salesPerson",
   "projectManager", "handoverDate", status, "completionPercentage", "documentsAttached",
   "requiredDocuments", "clientRequestDate", "createdAt", "updatedAt")
VALUES
  (:company,'HO-DEMO-2025-0001','PRJ-DEMO-2025-001','Harbour Grill — Main Kitchen Combi Oven Line',
   'Harbour Grill Restaurants','Sarah Mitchell','Deepak Joshi','2025-11-03','Completed',100,5,5,'2025-10-20','2025-10-22 09:00:00','2025-11-03 17:00:00'),
  (:company,'HO-DEMO-2025-0002','PRJ-DEMO-2025-002','Golden Spoon — Central Kitchen Fitout (Phoenix)',
   'Golden Spoon Franchises','Sarah Mitchell','Ravi Menon','2025-12-19','Completed',100,6,6,'2025-12-01','2025-12-02 10:30:00','2025-12-19 16:30:00'),
  (:company,'HO-DEMO-2026-0003','PRJ-DEMO-2026-003','Summit Catering — Blast Chiller Installation',
   'Summit Catering Services','David Williams','Ganesh Patil','2026-01-19','Completed',100,5,5,'2026-01-05','2026-01-06 09:15:00','2026-01-19 15:45:00'),
  (:company,'HO-DEMO-2026-0004','PRJ-DEMO-2026-004','Lakeside Resort — Dishwashing Line Upgrade',
   'Lakeside Resort & Spa','David Williams','Deepak Joshi','2026-02-10','In Progress',75,3,4,'2026-01-26','2026-01-27 11:00:00','2026-08-28 10:20:00'),
  (:company,'HO-DEMO-2026-0005','PRJ-DEMO-2026-005','Blue Fig — Banquet Kitchen Line (NYC)',
   'Blue Fig Hotels Group','Sarah Mitchell','Ravi Menon','2026-03-18','In Progress',67,4,6,'2026-03-02','2026-03-03 09:40:00','2026-09-02 14:05:00'),
  (:company,'HO-DEMO-2026-0006','PRJ-DEMO-2026-006','Metro Hospital — Cold Room & Refrigeration Package',
   'Metro Hospital Kitchens','Sarah Mitchell','Ganesh Patil','2026-04-15','Pending',67,2,3,'2026-04-01','2026-04-02 10:10:00','2026-09-05 09:30:00');

-- ---------------------------------------------------------------------------
-- 11. sales_handover_package_documents — document checklists for three handovers
-- ---------------------------------------------------------------------------
DELETE FROM sales_handover_package_documents WHERE "companyId" = :company;
INSERT INTO sales_handover_package_documents
  ("companyId", "projectId", "projectNumber", "projectName", customer, name, type, status,
   "uploadDate", "uploadedBy", content, "sortOrder", "createdAt", "updatedAt")
VALUES
  -- PRJ-DEMO-2025-001 (Harbour Grill) — complete package, 5/5 uploaded
  (:company,'PRJ-DEMO-2025-001','PRJ-DEMO-2025-001','Harbour Grill — Main Kitchen Combi Oven Line','Harbour Grill Restaurants',
   'Signed Quotation & Purchase Order','Commercial','Uploaded','2025-10-23','Sarah Mitchell','Accepted quotation QT-DEMO-2025-0001 with customer PO attached.',1,'2025-10-23 10:00:00','2025-10-23 10:00:00'),
  (:company,'PRJ-DEMO-2025-001','PRJ-DEMO-2025-001','Harbour Grill — Main Kitchen Combi Oven Line','Harbour Grill Restaurants',
   'Approved Kitchen Layout Drawings','Technical','Uploaded','2025-10-27','Deepak Joshi','Rev C layout with combi oven line utility points.',2,'2025-10-27 15:20:00','2025-10-27 15:20:00'),
  (:company,'PRJ-DEMO-2025-001','PRJ-DEMO-2025-001','Harbour Grill — Main Kitchen Combi Oven Line','Harbour Grill Restaurants',
   'Bill of Quantities','Commercial','Uploaded','2025-10-28','Sarah Mitchell','Line-item BOQ matching quotation revision 1.',3,'2025-10-28 11:05:00','2025-10-28 11:05:00'),
  (:company,'PRJ-DEMO-2025-001','PRJ-DEMO-2025-001','Harbour Grill — Main Kitchen Combi Oven Line','Harbour Grill Restaurants',
   'Factory Test Certificates','Quality','Uploaded','2025-11-01','Ganesh Patil','FAT reports for combi ovens and extraction canopies.',4,'2025-11-01 09:30:00','2025-11-01 09:30:00'),
  (:company,'PRJ-DEMO-2025-001','PRJ-DEMO-2025-001','Harbour Grill — Main Kitchen Combi Oven Line','Harbour Grill Restaurants',
   'Warranty & O&M Manuals','After-Sales','Uploaded','2025-11-03','Deepak Joshi','12-month warranty certificates and operator manuals.',5,'2025-11-03 14:45:00','2025-11-03 14:45:00'),
  -- PRJ-DEMO-2026-004 (Lakeside Resort) — 3 of 4 uploaded
  (:company,'PRJ-DEMO-2026-004','PRJ-DEMO-2026-004','Lakeside Resort — Dishwashing Line Upgrade','Lakeside Resort & Spa',
   'Signed Quotation & Purchase Order','Commercial','Uploaded','2026-01-28','David Williams','Accepted quotation QT-DEMO-2026-0007 with customer PO.',1,'2026-01-28 10:15:00','2026-01-28 10:15:00'),
  (:company,'PRJ-DEMO-2026-004','PRJ-DEMO-2026-004','Lakeside Resort — Dishwashing Line Upgrade','Lakeside Resort & Spa',
   'Site Survey Report','Technical','Uploaded','2026-02-04','Deepak Joshi','Drainage and power audit for dishwashing line replacement.',2,'2026-02-04 13:40:00','2026-02-04 13:40:00'),
  (:company,'PRJ-DEMO-2026-004','PRJ-DEMO-2026-004','Lakeside Resort — Dishwashing Line Upgrade','Lakeside Resort & Spa',
   'Bill of Quantities','Commercial','Uploaded','2026-02-06','David Williams','BOQ including rack conveyor and water softener.',3,'2026-02-06 09:50:00','2026-02-06 09:50:00'),
  (:company,'PRJ-DEMO-2026-004','PRJ-DEMO-2026-004','Lakeside Resort — Dishwashing Line Upgrade','Lakeside Resort & Spa',
   'Commissioning & Training Plan','Operations','Missing',NULL,NULL,NULL,4,'2026-02-06 09:55:00','2026-08-28 10:20:00'),
  -- PRJ-DEMO-2026-006 (Metro Hospital) — 2 of 3 uploaded
  (:company,'PRJ-DEMO-2026-006','PRJ-DEMO-2026-006','Metro Hospital — Cold Room & Refrigeration Package','Metro Hospital Kitchens',
   'Signed Quotation & Purchase Order','Commercial','Uploaded','2026-04-03','Sarah Mitchell','Accepted quotation QT-DEMO-2026-0013 with hospital procurement order.',1,'2026-04-03 11:25:00','2026-04-03 11:25:00'),
  (:company,'PRJ-DEMO-2026-006','PRJ-DEMO-2026-006','Metro Hospital — Cold Room & Refrigeration Package','Metro Hospital Kitchens',
   'HACCP Compliance Checklist','Quality','Uploaded','2026-04-12','Ganesh Patil','Cold-chain temperature mapping plan for hospital kitchen.',2,'2026-04-12 16:10:00','2026-04-12 16:10:00'),
  (:company,'PRJ-DEMO-2026-006','PRJ-DEMO-2026-006','Metro Hospital — Cold Room & Refrigeration Package','Metro Hospital Kitchens',
   'Refrigeration Load Calculations','Technical','Missing',NULL,NULL,NULL,3,'2026-04-12 16:15:00','2026-09-05 09:30:00');
