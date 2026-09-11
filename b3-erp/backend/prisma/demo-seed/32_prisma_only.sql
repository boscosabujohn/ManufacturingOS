-- Demo seed — 32 Prisma-only tables (geo masters, HR grades, item taxonomy, CRM quotes,
-- sales orders/lines, invoice lines, payroll loans/advances, overtime, inventory policies/kits,
-- ITIL, logistics masters, compliance) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this seed's demo rows first, then re-inserts.
-- Delete predicates: DEMO-prefixed codes/numbers where a natural key exists
-- (SO-DEMO-, CQ-DEMO-, KIT-DEMO-, KO-DEMO-, POL-DEMO-, INC/PRB/CHG-DEMO-, LCC-DEMO-,
--  PKG-DEMO-, DEMO- zones, port codes, ISO country codes, LOC-DEMO-, G1..G6 grades),
-- otherwise the anchor companyId.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- 1. Geographic masters (countries -> states -> cities), territories, locations
-- ============================================================================

DELETE FROM core_cities WHERE "stateId" IN (
  SELECT id FROM core_states WHERE "countryId" IN (
    SELECT id FROM core_countries WHERE code IN ('IN','US','AE','GB','SG')));
DELETE FROM core_states WHERE "countryId" IN (
  SELECT id FROM core_countries WHERE code IN ('IN','US','AE','GB','SG'));
DELETE FROM core_countries WHERE code IN ('IN','US','AE','GB','SG');

INSERT INTO core_countries (code, name, "phoneCode", "isActive", "createdAt", "updatedAt") VALUES
  ('IN','India','+91',true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('US','United States','+1',true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('AE','United Arab Emirates','+971',true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('GB','United Kingdom','+44',true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('SG','Singapore','+65',true,'2025-10-01 09:00:00','2025-10-01 09:00:00');

INSERT INTO core_states (name, "countryId", "isActive", "createdAt", "updatedAt") VALUES
  ('Maharashtra',(SELECT id FROM core_countries WHERE code='IN'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('Karnataka',(SELECT id FROM core_countries WHERE code='IN'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('Tamil Nadu',(SELECT id FROM core_countries WHERE code='IN'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('Kerala',(SELECT id FROM core_countries WHERE code='IN'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('Gujarat',(SELECT id FROM core_countries WHERE code='IN'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('Delhi',(SELECT id FROM core_countries WHERE code='IN'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('Telangana',(SELECT id FROM core_countries WHERE code='IN'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('Haryana',(SELECT id FROM core_countries WHERE code='IN'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('California',(SELECT id FROM core_countries WHERE code='US'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00'),
  ('New York',(SELECT id FROM core_countries WHERE code='US'),true,'2025-10-01 09:05:00','2025-10-01 09:05:00');

INSERT INTO core_cities (name, "stateId", "isActive", "createdAt", "updatedAt") VALUES
  ('Mumbai',(SELECT id FROM core_states WHERE name='Maharashtra'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('Pune',(SELECT id FROM core_states WHERE name='Maharashtra'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('Bengaluru',(SELECT id FROM core_states WHERE name='Karnataka'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('Chennai',(SELECT id FROM core_states WHERE name='Tamil Nadu'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('Coimbatore',(SELECT id FROM core_states WHERE name='Tamil Nadu'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('Kochi',(SELECT id FROM core_states WHERE name='Kerala'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('Ahmedabad',(SELECT id FROM core_states WHERE name='Gujarat'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('New Delhi',(SELECT id FROM core_states WHERE name='Delhi'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('Hyderabad',(SELECT id FROM core_states WHERE name='Telangana'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('Gurugram',(SELECT id FROM core_states WHERE name='Haryana'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('San Francisco',(SELECT id FROM core_states WHERE name='California'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00'),
  ('New York City',(SELECT id FROM core_states WHERE name='New York'),true,'2025-10-01 09:10:00','2025-10-01 09:10:00');

DELETE FROM core_territories WHERE code IN ('T-NORTH','T-SOUTH','T-WEST','T-EAST','T-INTL') AND "companyId" = :company;
INSERT INTO core_territories (code, name, "companyId", "isActive", "createdAt", "updatedAt") VALUES
  ('T-NORTH','North India Territory',:company,true,'2025-10-02 10:00:00','2025-10-02 10:00:00'),
  ('T-SOUTH','South India Territory',:company,true,'2025-10-02 10:00:00','2025-10-02 10:00:00'),
  ('T-WEST','West India Territory',:company,true,'2025-10-02 10:00:00','2025-10-02 10:00:00'),
  ('T-EAST','East India Territory',:company,true,'2025-10-02 10:00:00','2025-10-02 10:00:00'),
  ('T-INTL','International Territory',:company,true,'2025-10-02 10:00:00','2025-10-02 10:00:00');

DELETE FROM core_locations WHERE code IN ('LOC-DEMO-IN','LOC-DEMO-MH','LOC-DEMO-MUM','LOC-DEMO-HQ','LOC-DEMO-PLANT1','LOC-DEMO-WHZ') AND "companyId" = :company;
INSERT INTO core_locations (code, name, type, "parentId", address, status, "companyId", "isActive", "createdAt", "updatedAt") VALUES
  ('LOC-DEMO-IN','India','Country',NULL,'{"country":"India"}','Active',:company,true,'2025-10-02 11:00:00','2025-10-02 11:00:00');
INSERT INTO core_locations (code, name, type, "parentId", address, status, "companyId", "isActive", "createdAt", "updatedAt") VALUES
  ('LOC-DEMO-MH','Maharashtra','State',(SELECT id FROM core_locations WHERE code='LOC-DEMO-IN' AND "companyId"=:company),'{"state":"Maharashtra","country":"India"}','Active',:company,true,'2025-10-02 11:01:00','2025-10-02 11:01:00');
INSERT INTO core_locations (code, name, type, "parentId", address, status, "companyId", "isActive", "createdAt", "updatedAt") VALUES
  ('LOC-DEMO-MUM','Mumbai','City',(SELECT id FROM core_locations WHERE code='LOC-DEMO-MH' AND "companyId"=:company),'{"city":"Mumbai","state":"Maharashtra","country":"India"}','Active',:company,true,'2025-10-02 11:02:00','2025-10-02 11:02:00');
INSERT INTO core_locations (code, name, type, "parentId", address, coordinates, facilities, status, "companyId", "isActive", "createdAt", "updatedAt") VALUES
  ('LOC-DEMO-HQ','B3 MACBIS Head Office','Site',(SELECT id FROM core_locations WHERE code='LOC-DEMO-MUM' AND "companyId"=:company),'{"street":"Plot 14, MIDC Andheri East","city":"Mumbai","postalCode":"400093","country":"India"}','{"lat":19.1136,"lng":72.8697}',ARRAY['office','showroom'],'Active',:company,true,'2025-10-02 11:03:00','2025-10-02 11:03:00'),
  ('LOC-DEMO-PLANT1','Taloja Manufacturing Plant','Site',(SELECT id FROM core_locations WHERE code='LOC-DEMO-MUM' AND "companyId"=:company),'{"street":"Plot A-22, Taloja MIDC","city":"Navi Mumbai","postalCode":"410208","country":"India"}','{"lat":19.0748,"lng":73.1004}',ARRAY['factory','warehouse','qc_lab'],'Active',:company,true,'2025-10-02 11:04:00','2025-10-02 11:04:00'),
  ('LOC-DEMO-WHZ','North Distribution Zone','Zone',(SELECT id FROM core_locations WHERE code='LOC-DEMO-IN' AND "companyId"=:company),'{"city":"Gurugram","country":"India"}',NULL,ARRAY['warehouse'],'Active',:company,true,'2025-10-02 11:05:00','2025-10-02 11:05:00');

-- ============================================================================
-- 2. HR grades
-- ============================================================================

DELETE FROM core_hr_grades WHERE "gradeCode" IN ('G1','G2','G3','G4','G5','G6') AND "companyId" = :company;
INSERT INTO core_hr_grades
  ("gradeCode","gradeName",level,category,"minSalary","maxSalary",currency,benefits,"leaveEntitlement",perks,"probationPeriod","noticePeriod","appraisalCycle","eligibleDesignations",description,"companyId","isActive","createdAt","updatedAt") VALUES
  ('G1','Executive Leadership',6,'executive',200000,400000,'INR','{"insurance":"family-floater-2500000","car":true}','{"earned":30,"sick":12,"casual":12}',ARRAY['company_car','club_membership','esop'],0,3,'annual',ARRAY['CEO','CFO','COO'],'C-suite and executive leadership',:company,true,'2025-10-03 09:00:00','2025-10-03 09:00:00'),
  ('G2','Senior Management',5,'management',120000,220000,'INR','{"insurance":"family-floater-1500000"}','{"earned":26,"sick":12,"casual":10}',ARRAY['fuel_allowance','esop'],3,3,'annual',ARRAY['General Manager','Head of Department'],'Senior management grade',:company,true,'2025-10-03 09:00:00','2025-10-03 09:00:00'),
  ('G3','Middle Management',4,'management',70000,130000,'INR','{"insurance":"family-floater-1000000"}','{"earned":24,"sick":10,"casual":10}',ARRAY['fuel_allowance'],3,2,'annual',ARRAY['Manager','Senior Engineer'],'Managers and senior specialists',:company,true,'2025-10-03 09:00:00','2025-10-03 09:00:00'),
  ('G4','Supervisory',3,'supervisory',45000,80000,'INR','{"insurance":"self-500000"}','{"earned":21,"sick":10,"casual":8}',ARRAY['shift_allowance'],6,2,'half-yearly',ARRAY['Supervisor','Team Lead'],'Shop-floor and office supervisors',:company,true,'2025-10-03 09:00:00','2025-10-03 09:00:00'),
  ('G5','Staff',2,'staff',25000,55000,'INR','{"insurance":"self-300000"}','{"earned":18,"sick":8,"casual":8}',ARRAY['meal_coupons'],6,1,'half-yearly',ARRAY['Engineer','Executive','Accountant'],'Staff and junior engineers',:company,true,'2025-10-03 09:00:00','2025-10-03 09:00:00'),
  ('G6','Worker',1,'worker',15000,32000,'INR','{"insurance":"esi"}','{"earned":15,"sick":8,"casual":6}',ARRAY['overtime_eligible','meal_coupons'],6,1,'annual',ARRAY['Operator','Technician','Helper'],'Shop-floor workers and operators',:company,true,'2025-10-03 09:00:00','2025-10-03 09:00:00');

-- ============================================================================
-- 3. Item taxonomy (categories -> groups), aligned with existing items
-- ============================================================================

DELETE FROM core_item_groups WHERE name IN ('Motors & Drives','Pumps & Gearboxes','Metals & Rods','Wires & Cables','Bearings & Seals','Belts & Transmission','Cutting Tools','Lubricants & Coolants') AND "companyId" = :company;
DELETE FROM core_item_categories WHERE name IN ('Raw Materials','Finished Goods','Consumables','Spare Parts','Tools','Services') AND "companyId" = :company;

INSERT INTO core_item_categories (name, "companyId", "isActive", "createdAt", "updatedAt") VALUES
  ('Raw Materials',:company,true,'2025-10-03 10:00:00','2025-10-03 10:00:00'),
  ('Finished Goods',:company,true,'2025-10-03 10:00:00','2025-10-03 10:00:00'),
  ('Consumables',:company,true,'2025-10-03 10:00:00','2025-10-03 10:00:00'),
  ('Spare Parts',:company,true,'2025-10-03 10:00:00','2025-10-03 10:00:00'),
  ('Tools',:company,true,'2025-10-03 10:00:00','2025-10-03 10:00:00'),
  ('Services',:company,true,'2025-10-03 10:00:00','2025-10-03 10:00:00');

INSERT INTO core_item_groups (name, "categoryId", "companyId", "isActive", "createdAt", "updatedAt") VALUES
  ('Motors & Drives',(SELECT id FROM core_item_categories WHERE name='Finished Goods' AND "companyId"=:company),:company,true,'2025-10-03 10:10:00','2025-10-03 10:10:00'),
  ('Pumps & Gearboxes',(SELECT id FROM core_item_categories WHERE name='Finished Goods' AND "companyId"=:company),:company,true,'2025-10-03 10:10:00','2025-10-03 10:10:00'),
  ('Metals & Rods',(SELECT id FROM core_item_categories WHERE name='Raw Materials' AND "companyId"=:company),:company,true,'2025-10-03 10:10:00','2025-10-03 10:10:00'),
  ('Wires & Cables',(SELECT id FROM core_item_categories WHERE name='Raw Materials' AND "companyId"=:company),:company,true,'2025-10-03 10:10:00','2025-10-03 10:10:00'),
  ('Bearings & Seals',(SELECT id FROM core_item_categories WHERE name='Spare Parts' AND "companyId"=:company),:company,true,'2025-10-03 10:10:00','2025-10-03 10:10:00'),
  ('Belts & Transmission',(SELECT id FROM core_item_categories WHERE name='Spare Parts' AND "companyId"=:company),:company,true,'2025-10-03 10:10:00','2025-10-03 10:10:00'),
  ('Cutting Tools',(SELECT id FROM core_item_categories WHERE name='Tools' AND "companyId"=:company),:company,true,'2025-10-03 10:10:00','2025-10-03 10:10:00'),
  ('Lubricants & Coolants',(SELECT id FROM core_item_categories WHERE name='Consumables' AND "companyId"=:company),:company,true,'2025-10-03 10:10:00','2025-10-03 10:10:00');

-- ============================================================================
-- 4. CRM quotes (referencing crm_customers / crm_leads contacts)
-- ============================================================================

DELETE FROM crm_quotes WHERE "quoteNumber" LIKE 'CQ-DEMO-%' AND "companyId" = :company;
INSERT INTO crm_quotes
  ("quoteNumber",title,description,status,"validUntil","customerId","customerName","contactName","contactEmail",items,subtotal,"taxAmount","totalAmount",currency,"paymentTerms","paymentTermDays","preparedByName","sentDate","acceptedDate","rejectedDate",notes,"companyId","isActive","createdAt","updatedAt") VALUES
  ('CQ-DEMO-0001','Combi Oven Line — Harbour Grill','Initial CRM quote for combi oven refresh','accepted','2025-11-15',(SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' LIMIT 1),'Harbour Grill Restaurants','Marcus Lee','marcus@harbourgrill.com','[{"name":"Combi Oven 10-tray","quantity":2,"unitPrice":18000,"total":36000},{"name":"Installation & Training","quantity":1,"unitPrice":4000,"total":4000}]',40000,7200,47200,'INR','Net 30',30,'Sarah Mitchell','2025-10-12 10:00:00','2025-10-20 15:30:00',NULL,'Converted to formal quotation',:company,true,'2025-10-10 09:30:00','2025-10-20 15:30:00'),
  ('CQ-DEMO-0002','Blast Chillers — Peak Performance','Quote from lead Peak Performance Gyms','sent','2026-01-10',NULL,'Peak Performance Gyms','Daniel Wu','daniel@peakgyms.com','[{"name":"Blast Chiller BC-30","quantity":3,"unitPrice":9500,"total":28500}]',28500,5130,33630,'INR','Net 15',15,'David Williams','2025-12-02 11:00:00',NULL,NULL,'Lead-stage budgetary quote',:company,true,'2025-11-28 14:00:00','2025-12-02 11:00:00'),
  ('CQ-DEMO-0003','Espresso Stations — Urban Roast','Espresso station bundle for Urban Roast','accepted','2026-01-31',NULL,'Urban Roast Coffee','Sophia Rossi','sophia@urbanroast.com','[{"name":"Espresso Station Pro","quantity":2,"unitPrice":11000,"total":22000},{"name":"Barista Bench","quantity":2,"unitPrice":3000,"total":6000}]',28000,5040,33040,'INR','Net 30',30,'David Williams','2025-12-18 10:00:00','2026-01-05 09:45:00',NULL,NULL,:company,true,'2025-12-15 10:30:00','2026-01-05 09:45:00'),
  ('CQ-DEMO-0004','Dishwashing Systems — Fairview SD','District-wide dishwashing systems','rejected','2026-02-28',NULL,'Fairview School District','James Carter','james@fairviewsd.edu','[{"name":"Rack Conveyor Dishwasher","quantity":4,"unitPrice":32000,"total":128000}]',128000,23040,151040,'INR','Net 45',45,'Sarah Mitchell','2026-01-15 12:00:00',NULL,'2026-02-10 16:00:00','Lost on budget cycle',:company,true,'2026-01-12 09:00:00','2026-02-10 16:00:00'),
  ('CQ-DEMO-0005','Galley Fitout Phase 1 — Silverline','Full galley fitout phase 1','sent','2026-05-31',NULL,'Silverline Cruises','Mia Nakamura','mia@silverlinecruises.com','[{"name":"Galley Cooking Suite","quantity":1,"unitPrice":210000,"total":210000},{"name":"Cold Room Package","quantity":1,"unitPrice":85000,"total":85000}]',295000,53100,348100,'INR','Net 45',45,'Sarah Mitchell','2026-04-08 10:00:00',NULL,NULL,'Large multi-phase opportunity',:company,true,'2026-04-02 11:15:00','2026-04-08 10:00:00'),
  ('CQ-DEMO-0006','Refrigeration Refresh — Blue Fig','Walk-in refrigeration refresh for two properties','accepted','2026-06-15',(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' LIMIT 1),'Blue Fig Hotels Group','Amelia Torres','amelia@bluefighotels.com','[{"name":"Walk-in Cooler 12m3","quantity":2,"unitPrice":26000,"total":52000},{"name":"Compressor Upgrade Kit","quantity":2,"unitPrice":7500,"total":15000}]',67000,12060,79060,'INR','Net 45',45,'Sarah Mitchell','2026-05-05 10:00:00','2026-05-18 14:20:00',NULL,NULL,:company,true,'2026-05-02 09:00:00','2026-05-18 14:20:00'),
  ('CQ-DEMO-0007','Pantry Kitchens — Nexus Coworking','Pantry kitchen pods for three floors','draft','2026-09-30',NULL,'Nexus Coworking','Ava Lindqvist','ava@nexuscowork.com','[{"name":"Pantry Kitchen Pod","quantity":3,"unitPrice":16000,"total":48000}]',48000,8640,56640,'INR','Net 30',30,'David Williams',NULL,NULL,NULL,'Awaiting internal review',:company,true,'2026-08-20 15:00:00','2026-08-20 15:00:00'),
  ('CQ-DEMO-0008','Banquet Line Upgrade — Bayside','Banquet kitchen line upgrade','sent','2026-10-15',NULL,'Bayside Convention Center','Noah Feldman','noah@baysideconvention.com','[{"name":"Banquet Cooking Line","quantity":1,"unitPrice":168000,"total":168000},{"name":"Holding Cabinets","quantity":6,"unitPrice":5500,"total":33000}]',201000,36180,237180,'INR','Net 45',45,'Sarah Mitchell','2026-09-05 10:30:00',NULL,NULL,NULL,:company,true,'2026-09-01 10:00:00','2026-09-05 10:30:00');

-- ============================================================================
-- 5. Sales orders (from accepted QT-DEMO quotations) + order items
-- ============================================================================

DELETE FROM sales_order_items WHERE "orderId" IN (SELECT id FROM sales_orders WHERE "orderNumber" LIKE 'SO-DEMO-%' AND "companyId" = :company);
DELETE FROM sales_orders WHERE "orderNumber" LIKE 'SO-DEMO-%' AND "companyId" = :company;

INSERT INTO sales_orders
  ("orderNumber","quotationId","quotationNumber","customerId","customerName","orderDate","requestedDeliveryDate","promisedDeliveryDate","orderType",priority,currency,subtotal,"taxAmount","totalAmount","paymentTerms","paymentStatus","paidAmount","balanceAmount",status,"confirmedAt","deliveredAt","completedAt","salesPersonName","companyId","createdBy","createdAt","updatedAt") VALUES
  ('SO-DEMO-0001',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2025-0001'),'QT-DEMO-2025-0001',(SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' LIMIT 1),'Harbour Grill Restaurants','2025-10-14 10:00:00','2025-12-05 00:00:00','2025-12-10 00:00:00','standard','normal','INR',73400,13212,86612,'Net 30','paid',86612,0,'completed','2025-10-15 09:00:00','2025-12-08 14:00:00','2025-12-20 10:00:00','Sarah Mitchell',:company,'demo-seed','2025-10-14 10:00:00','2025-12-20 10:00:00'),
  ('SO-DEMO-0002',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2025-0004'),'QT-DEMO-2025-0004',(SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','2025-11-25 11:00:00','2026-01-20 00:00:00','2026-01-25 00:00:00','standard','high','INR',158300,28494,186794,'Net 45','paid',186794,0,'completed','2025-11-26 09:30:00','2026-01-22 16:00:00','2026-02-05 11:00:00','Sarah Mitchell',:company,'demo-seed','2025-11-25 11:00:00','2026-02-05 11:00:00'),
  ('SO-DEMO-0003',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2025-0006'),'QT-DEMO-2025-0006',(SELECT id::text FROM crm_customers WHERE "customerName"='Summit Catering Services' LIMIT 1),'Summit Catering Services','2025-12-22 09:30:00','2026-02-10 00:00:00','2026-02-15 00:00:00','standard','normal','INR',77380,13928.40,91308.40,'Net 15','paid',91308.40,0,'completed','2025-12-23 10:00:00','2026-02-12 15:00:00','2026-02-25 09:00:00','David Williams',:company,'demo-seed','2025-12-22 09:30:00','2026-02-25 09:00:00'),
  ('SO-DEMO-0004',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0007'),'QT-DEMO-2026-0007',(SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' LIMIT 1),'Lakeside Resort & Spa','2026-01-15 10:00:00','2026-03-10 00:00:00','2026-03-15 00:00:00','standard','normal','INR',124000,22320,146320,'Net 30','partial',87792,58528,'delivered','2026-01-16 09:00:00','2026-03-12 14:30:00',NULL,'David Williams',:company,'demo-seed','2026-01-15 10:00:00','2026-03-12 14:30:00'),
  ('SO-DEMO-0005',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0010'),'QT-DEMO-2026-0010',(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' LIMIT 1),'Blue Fig Hotels Group','2026-02-19 11:30:00','2026-04-15 00:00:00','2026-04-20 00:00:00','standard','high','INR',206480,37166.40,243646.40,'Net 45','partial',146187.84,97458.56,'delivered','2026-02-20 09:00:00','2026-04-18 16:00:00',NULL,'Sarah Mitchell',:company,'demo-seed','2026-02-19 11:30:00','2026-04-18 16:00:00'),
  ('SO-DEMO-0006',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0011'),'QT-DEMO-2026-0011',(SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','2026-03-03 10:00:00','2026-04-28 00:00:00','2026-05-02 00:00:00','standard','normal','INR',121000,21780,142780,'Net 45','partial',85668,57112,'delivered','2026-03-04 09:30:00','2026-04-30 15:00:00',NULL,'Sarah Mitchell',:company,'demo-seed','2026-03-03 10:00:00','2026-04-30 15:00:00'),
  ('SO-DEMO-0007',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0013'),'QT-DEMO-2026-0013',(SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' LIMIT 1),'Metro Hospital Kitchens','2026-03-19 09:00:00','2026-05-30 00:00:00','2026-06-05 00:00:00','standard','high','INR',101100,18198,119298,'Net 60','partial',35789.40,83508.60,'in_production','2026-03-20 10:00:00',NULL,NULL,'Sarah Mitchell',:company,'demo-seed','2026-03-19 09:00:00','2026-05-15 10:00:00'),
  ('SO-DEMO-0008',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0015'),'QT-DEMO-2026-0015',(SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' LIMIT 1),'Lakeside Resort & Spa','2026-04-10 10:30:00','2026-06-25 00:00:00','2026-06-30 00:00:00','standard','normal','INR',119000,21420,140420,'Net 30','partial',42126,98294,'in_production','2026-04-11 09:00:00',NULL,NULL,'David Williams',:company,'demo-seed','2026-04-10 10:30:00','2026-06-10 11:00:00'),
  ('SO-DEMO-0009',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0017'),'QT-DEMO-2026-0017',(SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','2026-05-05 11:00:00','2026-07-20 00:00:00','2026-07-25 00:00:00','standard','high','INR',213100,38358,251458,'Net 45','partial',75437.40,176020.60,'in_production','2026-05-06 09:30:00',NULL,NULL,'Sarah Mitchell',:company,'demo-seed','2026-05-05 11:00:00','2026-07-01 10:00:00'),
  ('SO-DEMO-0010',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0018'),'QT-DEMO-2026-0018',(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' LIMIT 1),'Blue Fig Hotels Group','2026-05-14 10:00:00','2026-08-05 00:00:00','2026-08-10 00:00:00','standard','normal','INR',173500,31230,204730,'Net 45','pending',0,204730,'confirmed','2026-05-15 09:00:00',NULL,NULL,'Sarah Mitchell',:company,'demo-seed','2026-05-14 10:00:00','2026-05-15 09:00:00'),
  ('SO-DEMO-0011',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0020'),'QT-DEMO-2026-0020',(SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' LIMIT 1),'Campus Dining Co-op','2026-06-02 09:30:00','2026-08-20 00:00:00','2026-08-25 00:00:00','standard','normal','INR',76740,13813.20,90553.20,'Net 30','pending',0,90553.20,'confirmed','2026-06-03 10:00:00',NULL,NULL,'David Williams',:company,'demo-seed','2026-06-02 09:30:00','2026-06-03 10:00:00'),
  ('SO-DEMO-0012',(SELECT id::text FROM sales_quotations WHERE "quotationNumber"='QT-DEMO-2026-0021'),'QT-DEMO-2026-0021',(SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' LIMIT 1),'Metro Hospital Kitchens','2026-06-11 10:00:00','2026-09-01 00:00:00','2026-09-05 00:00:00','standard','high','INR',198500,35730,234230,'Net 60','pending',0,234230,'confirmed','2026-06-12 09:00:00',NULL,NULL,'Sarah Mitchell',:company,'demo-seed','2026-06-11 10:00:00','2026-06-12 09:00:00');

-- Order lines: 3 per order (50% / 30% / 20% of subtotal), delivered qty follows order status.
INSERT INTO sales_order_items
  ("orderId","lineNumber","itemId","itemCode","itemName",description,quantity,uom,"deliveredQuantity","pendingQuantity","unitPrice","taxRate","taxAmount","lineTotal","promisedDate","productionStatus","createdAt","updatedAt")
SELECT o.id, 1,
  (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'), 'FG-PMP-001', 'Centrifugal Pump CP-200', 'Primary equipment line',
  2, 'PCS',
  CASE WHEN o.status IN ('delivered','completed') THEN 2 ELSE 0 END,
  CASE WHEN o.status IN ('delivered','completed') THEN 0 ELSE 2 END,
  round((o.subtotal*0.5/2)::numeric,2), 18, round((o.subtotal*0.5*0.18)::numeric,2), round((o.subtotal*0.5*1.18)::numeric,2),
  o."promisedDeliveryDate",
  CASE WHEN o.status IN ('delivered','completed') THEN 'completed' WHEN o.status='in_production' THEN 'in_progress' ELSE 'pending' END,
  o."createdAt", o."updatedAt"
FROM sales_orders o WHERE o."orderNumber" LIKE 'SO-DEMO-%' AND o."companyId" = :company;

INSERT INTO sales_order_items
  ("orderId","lineNumber","itemId","itemCode","itemName",description,quantity,uom,"deliveredQuantity","pendingQuantity","unitPrice","taxRate","taxAmount","lineTotal","promisedDate","productionStatus","createdAt","updatedAt")
SELECT o.id, 2,
  (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'), 'FG-MTR-001', 'Industrial Motor 5HP', 'Drive package',
  1, 'PCS',
  CASE WHEN o.status IN ('delivered','completed') THEN 1 ELSE 0 END,
  CASE WHEN o.status IN ('delivered','completed') THEN 0 ELSE 1 END,
  round((o.subtotal*0.3)::numeric,2), 18, round((o.subtotal*0.3*0.18)::numeric,2), round((o.subtotal*0.3*1.18)::numeric,2),
  o."promisedDeliveryDate",
  CASE WHEN o.status IN ('delivered','completed') THEN 'completed' WHEN o.status='in_production' THEN 'in_progress' ELSE 'pending' END,
  o."createdAt", o."updatedAt"
FROM sales_orders o WHERE o."orderNumber" LIKE 'SO-DEMO-%' AND o."companyId" = :company;

INSERT INTO sales_order_items
  ("orderId","lineNumber","itemId","itemCode","itemName",description,quantity,uom,"deliveredQuantity","pendingQuantity","unitPrice","taxRate","taxAmount","lineTotal","promisedDate","productionStatus","createdAt","updatedAt")
SELECT o.id, 3,
  (SELECT id::text FROM items WHERE "itemCode"='SVC-MNT-001'), 'SVC-MNT-001', 'Preventive Maintenance Service', 'Commissioning and maintenance service',
  1, 'PCS',
  CASE WHEN o.status IN ('delivered','completed') THEN 1 ELSE 0 END,
  CASE WHEN o.status IN ('delivered','completed') THEN 0 ELSE 1 END,
  round((o.subtotal*0.2)::numeric,2), 18, round((o.subtotal*0.2*0.18)::numeric,2), round((o.subtotal*0.2*1.18)::numeric,2),
  o."promisedDeliveryDate",
  CASE WHEN o.status IN ('delivered','completed') THEN 'completed' WHEN o.status='in_production' THEN 'in_progress' ELSE 'pending' END,
  o."createdAt", o."updatedAt"
FROM sales_orders o WHERE o."orderNumber" LIKE 'SO-DEMO-%' AND o."companyId" = :company;

-- ============================================================================
-- 6. Sales invoice items: 2 lines per existing INV-DEMO invoice (60% / 40%),
--    line taxes sum exactly to the invoice's totalTax.
-- ============================================================================

DELETE FROM sales_invoice_items WHERE "invoiceId" IN (SELECT id FROM sales_invoices WHERE "invoiceNumber" LIKE 'INV-DEMO-%' AND "companyId" = :company);

INSERT INTO sales_invoice_items
  ("invoiceId","lineNumber","productCode","productName",description,quantity,uom,"unitPrice","taxRate","taxAmount","lineTotal","createdAt","updatedAt")
SELECT i.id, 1,
  CASE (right(i."invoiceNumber",1)::int % 3)
    WHEN 0 THEN 'FG-PMP-001' WHEN 1 THEN 'FG-MTR-001' ELSE 'FG-GBX-001' END,
  CASE (right(i."invoiceNumber",1)::int % 3)
    WHEN 0 THEN 'Centrifugal Pump CP-200' WHEN 1 THEN 'Industrial Motor 5HP' ELSE 'Precision Gearbox PG-50' END,
  'Equipment supply', 1, 'PCS',
  round((i.subtotal*0.6)::numeric,2), 18, round((i.subtotal*0.6*0.18)::numeric,2),
  round((i.subtotal*0.6)::numeric,2) + round((i.subtotal*0.6*0.18)::numeric,2),
  i."createdAt", i."updatedAt"
FROM sales_invoices i WHERE i."invoiceNumber" LIKE 'INV-DEMO-%' AND i."companyId" = :company;

INSERT INTO sales_invoice_items
  ("invoiceId","lineNumber","productCode","productName",description,quantity,uom,"unitPrice","taxRate","taxAmount","lineTotal","createdAt","updatedAt")
SELECT i.id, 2,
  'SVC-MNT-001', 'Preventive Maintenance Service', 'Installation, commissioning and service', 1, 'PCS',
  round((i.subtotal - round((i.subtotal*0.6)::numeric,2))::numeric,2), 18,
  round((i."totalTax" - round((i.subtotal*0.6*0.18)::numeric,2))::numeric,2),
  round((i.subtotal - round((i.subtotal*0.6)::numeric,2))::numeric,2) + round((i."totalTax" - round((i.subtotal*0.6*0.18)::numeric,2))::numeric,2),
  i."createdAt", i."updatedAt"
FROM sales_invoices i WHERE i."invoiceNumber" LIKE 'INV-DEMO-%' AND i."companyId" = :company;

-- ============================================================================
-- 7. Payroll: loan types -> employee loans -> repayments; advances -> recoveries
--    (text PKs with no default: deterministic demo ids)
-- ============================================================================

DELETE FROM payroll_loan_repayments WHERE "companyId" = :company;
DELETE FROM payroll_advance_recoveries WHERE "companyId" = :company;
DELETE FROM payroll_employee_loans WHERE "companyId" = :company;
DELETE FROM payroll_salary_advances WHERE "companyId" = :company;
DELETE FROM payroll_loan_types WHERE "companyId" = :company;

INSERT INTO payroll_loan_types
  (id, code, name, description, "maxAmount", "maxTenureMonths", "interestType", "defaultInterestRate", "processingFeePercent", "minServiceMonths", "maxLoanMultiplier", "requiresGuarantor", "isActive", "companyId", "createdAt", "updatedAt") VALUES
  ('demo-loantype-01','LN-PER','Personal Loan','General-purpose personal loan',500000,36,'Simple',10,1,12,6,false,true,:company,'2025-10-05 09:00:00','2025-10-05 09:00:00'),
  ('demo-loantype-02','LN-VEH','Vehicle Loan','Two/four-wheeler purchase loan',800000,60,'Simple',8.5,0.5,24,10,true,true,:company,'2025-10-05 09:00:00','2025-10-05 09:00:00'),
  ('demo-loantype-03','LN-EDU','Education Loan','Higher-education loan for self/children',400000,48,'Simple',6,0,24,8,false,true,:company,'2025-10-05 09:00:00','2025-10-05 09:00:00'),
  ('demo-loantype-04','LN-EMG','Emergency Loan','Interest-free emergency assistance',50000,12,'None',0,0,6,2,false,true,:company,'2025-10-05 09:00:00','2025-10-05 09:00:00');

INSERT INTO payroll_employee_loans
  (id,"loanNumber","loanTypeId","employeeId","requestDate","requestedAmount","approvedAmount","interestRate","tenureMonths","emiAmount","processingFee","totalRepayable","disbursementDate","repaymentStartDate","repaymentEndDate","outstandingBalance","paidEMIs","remainingEMIs",status,"approvedBy","approvedAt","rejectionReason",remarks,"companyId","createdAt","updatedAt") VALUES
  ('demo-loan-0001','LOAN-DEMO-0001','demo-loantype-01',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0004'),'2025-10-20 10:00:00',120000,120000,10,24,6000,1200,144000,'2025-11-01 00:00:00','2025-12-01 00:00:00','2027-11-01 00:00:00',90000,9,15,'Active','Rajesh Kumar','2025-10-25 11:00:00',NULL,'Home renovation',:company,'2025-10-20 10:00:00','2026-08-31 09:00:00'),
  ('demo-loan-0002','LOAN-DEMO-0002','demo-loantype-04',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'2026-01-20 09:30:00',30000,30000,0,10,3000,0,30000,'2026-02-01 00:00:00','2026-03-01 00:00:00','2026-12-01 00:00:00',18000,4,6,'Active','Priya Sharma','2026-01-24 15:00:00',NULL,'Medical emergency',:company,'2026-01-20 09:30:00','2026-06-30 09:00:00'),
  ('demo-loan-0003','LOAN-DEMO-0003','demo-loantype-02',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0006'),'2026-03-10 11:00:00',400000,350000,8.5,36,12200,1750,439200,'2026-04-01 00:00:00','2026-05-01 00:00:00','2029-04-01 00:00:00',414800,2,34,'Active','Rajesh Kumar','2026-03-18 10:00:00',NULL,'Car purchase; guarantor EMP0007',:company,'2026-03-10 11:00:00','2026-06-30 09:00:00'),
  ('demo-loan-0004','LOAN-DEMO-0004','demo-loantype-03',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'2026-08-25 10:00:00',200000,NULL,6,48,NULL,0,NULL,NULL,NULL,NULL,NULL,0,NULL,'Pending',NULL,NULL,NULL,'Awaiting HR committee review',:company,'2026-08-25 10:00:00','2026-08-25 10:00:00'),
  ('demo-loan-0005','LOAN-DEMO-0005','demo-loantype-01',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),'2026-05-15 09:00:00',80000,80000,10,12,7333.33,800,88000,'2026-06-01 00:00:00','2026-07-01 00:00:00','2027-06-01 00:00:00',73333.34,2,10,'Active','Priya Sharma','2026-05-20 14:00:00',NULL,NULL,:company,'2026-05-15 09:00:00','2026-08-31 09:00:00'),
  ('demo-loan-0006','LOAN-DEMO-0006','demo-loantype-04',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'2025-10-08 10:30:00',20000,20000,0,8,2500,0,20000,'2025-10-15 00:00:00','2025-11-01 00:00:00','2026-06-01 00:00:00',0,8,0,'Closed','Priya Sharma','2025-10-12 12:00:00',NULL,'Fully repaid',:company,'2025-10-08 10:30:00','2026-06-05 09:00:00'),
  ('demo-loan-0007','LOAN-DEMO-0007','demo-loantype-01',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0014'),'2026-04-05 11:30:00',60000,NULL,10,12,NULL,0,NULL,NULL,NULL,NULL,NULL,0,NULL,'Rejected','Rajesh Kumar','2026-04-12 10:00:00','Existing loan outstanding exceeds policy limit',NULL,:company,'2026-04-05 11:30:00','2026-04-12 10:00:00'),
  ('demo-loan-0008','LOAN-DEMO-0008','demo-loantype-02',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0016'),'2026-08-10 10:00:00',250000,250000,8.5,36,7910,1250,284760,NULL,NULL,NULL,284760,0,36,'Approved','Rajesh Kumar','2026-08-20 15:00:00',NULL,'Disbursement scheduled next payroll cycle',:company,'2026-08-10 10:00:00','2026-08-20 15:00:00');

INSERT INTO payroll_loan_repayments
  (id,"loanId","emiNumber","dueDate","principalAmount","interestAmount","emiAmount","paidAmount","balanceAfterEMI",status,"deductionDate","paymentMode","companyId","createdAt","updatedAt") VALUES
  ('demo-repay-0001','demo-loan-0001',1,'2025-12-01 00:00:00',5000,1000,6000,6000,138000,'Deducted','2025-12-01 00:00:00','Salary',:company,'2025-12-01 09:00:00','2025-12-01 09:00:00'),
  ('demo-repay-0002','demo-loan-0001',2,'2026-01-01 00:00:00',5000,1000,6000,6000,132000,'Deducted','2026-01-01 00:00:00','Salary',:company,'2026-01-01 09:00:00','2026-01-01 09:00:00'),
  ('demo-repay-0003','demo-loan-0001',3,'2026-02-01 00:00:00',5000,1000,6000,6000,126000,'Deducted','2026-02-01 00:00:00','Salary',:company,'2026-02-01 09:00:00','2026-02-01 09:00:00'),
  ('demo-repay-0004','demo-loan-0001',4,'2026-03-01 00:00:00',5000,1000,6000,6000,120000,'Deducted','2026-03-01 00:00:00','Salary',:company,'2026-03-01 09:00:00','2026-03-01 09:00:00'),
  ('demo-repay-0005','demo-loan-0001',5,'2026-04-01 00:00:00',5000,1000,6000,6000,114000,'Deducted','2026-04-01 00:00:00','Salary',:company,'2026-04-01 09:00:00','2026-04-01 09:00:00'),
  ('demo-repay-0006','demo-loan-0001',6,'2026-05-01 00:00:00',5000,1000,6000,6000,108000,'Deducted','2026-05-01 00:00:00','Salary',:company,'2026-05-01 09:00:00','2026-05-01 09:00:00'),
  ('demo-repay-0007','demo-loan-0002',1,'2026-03-01 00:00:00',3000,0,3000,3000,27000,'Deducted','2026-03-01 00:00:00','Salary',:company,'2026-03-01 09:00:00','2026-03-01 09:00:00'),
  ('demo-repay-0008','demo-loan-0002',2,'2026-04-01 00:00:00',3000,0,3000,3000,24000,'Deducted','2026-04-01 00:00:00','Salary',:company,'2026-04-01 09:00:00','2026-04-01 09:00:00'),
  ('demo-repay-0009','demo-loan-0002',3,'2026-05-01 00:00:00',3000,0,3000,3000,21000,'Deducted','2026-05-01 00:00:00','Salary',:company,'2026-05-01 09:00:00','2026-05-01 09:00:00'),
  ('demo-repay-0010','demo-loan-0002',4,'2026-06-01 00:00:00',3000,0,3000,3000,18000,'Deducted','2026-06-01 00:00:00','Salary',:company,'2026-06-01 09:00:00','2026-06-01 09:00:00'),
  ('demo-repay-0011','demo-loan-0003',1,'2026-05-01 00:00:00',9700,2500,12200,12200,427000,'Deducted','2026-05-01 00:00:00','Salary',:company,'2026-05-01 09:00:00','2026-05-01 09:00:00'),
  ('demo-repay-0012','demo-loan-0003',2,'2026-06-01 00:00:00',9700,2500,12200,12200,414800,'Deducted','2026-06-01 00:00:00','Salary',:company,'2026-06-01 09:00:00','2026-06-01 09:00:00');

INSERT INTO payroll_salary_advances
  (id,"advanceNumber","employeeId","requestDate","requestedAmount","approvedAmount",purpose,"repaymentMonths","monthlyDeduction","disbursementDate",status,"approvedBy","approvedAt","rejectionReason","paidAmount","balanceAmount",remarks,"companyId","createdAt","updatedAt") VALUES
  ('demo-adv-0001','ADV-DEMO-0001',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'2025-12-28 10:00:00',15000,15000,'School fees',3,5000,'2026-01-05 00:00:00','Repaying','Priya Sharma','2026-01-02 11:00:00',NULL,10000,5000,NULL,:company,'2025-12-28 10:00:00','2026-03-01 09:00:00'),
  ('demo-adv-0002','ADV-DEMO-0002',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0019'),'2026-02-25 09:30:00',24000,24000,'Family function',4,6000,'2026-03-05 00:00:00','Repaying','Priya Sharma','2026-03-01 10:00:00',NULL,12000,12000,NULL,:company,'2026-02-25 09:30:00','2026-05-01 09:00:00'),
  ('demo-adv-0003','ADV-DEMO-0003',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0020'),'2025-10-28 11:00:00',10000,10000,'Medical expense',2,5000,'2025-11-05 00:00:00','Closed','Priya Sharma','2025-11-01 09:30:00',NULL,10000,0,'Fully recovered',:company,'2025-10-28 11:00:00','2026-01-05 09:00:00'),
  ('demo-adv-0004','ADV-DEMO-0004',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0013'),'2026-08-28 10:30:00',18000,NULL,'House deposit',3,NULL,NULL,'Pending',NULL,NULL,NULL,0,NULL,NULL,:company,'2026-08-28 10:30:00','2026-08-28 10:30:00'),
  ('demo-adv-0005','ADV-DEMO-0005',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0005'),'2026-06-15 10:00:00',50000,NULL,'Personal',2,NULL,NULL,'Rejected','Rajesh Kumar','2026-06-18 12:00:00','Amount exceeds one month gross salary policy for advances',0,NULL,NULL,:company,'2026-06-15 10:00:00','2026-06-18 12:00:00'),
  ('demo-adv-0006','ADV-DEMO-0006',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0018'),'2026-09-02 09:00:00',12000,12000,'Festival advance',2,6000,NULL,'Approved','Priya Sharma','2026-09-05 11:00:00',NULL,0,12000,'Disbursement with September payroll',:company,'2026-09-02 09:00:00','2026-09-05 11:00:00');

INSERT INTO payroll_advance_recoveries
  (id,"advanceId","installmentNumber","dueDate",amount,"paidAmount","balanceAfter",status,"deductionDate",remarks,"companyId","createdAt","updatedAt") VALUES
  ('demo-advrec-0001','demo-adv-0001',1,'2026-02-01 00:00:00',5000,5000,10000,'Deducted','2026-02-01 00:00:00',NULL,:company,'2026-02-01 09:00:00','2026-02-01 09:00:00'),
  ('demo-advrec-0002','demo-adv-0001',2,'2026-03-01 00:00:00',5000,5000,5000,'Deducted','2026-03-01 00:00:00',NULL,:company,'2026-03-01 09:00:00','2026-03-01 09:00:00'),
  ('demo-advrec-0003','demo-adv-0001',3,'2026-04-01 00:00:00',5000,0,0,'Pending',NULL,NULL,:company,'2026-03-01 09:05:00','2026-03-01 09:05:00'),
  ('demo-advrec-0004','demo-adv-0002',1,'2026-04-01 00:00:00',6000,6000,18000,'Deducted','2026-04-01 00:00:00',NULL,:company,'2026-04-01 09:00:00','2026-04-01 09:00:00'),
  ('demo-advrec-0005','demo-adv-0002',2,'2026-05-01 00:00:00',6000,6000,12000,'Deducted','2026-05-01 00:00:00',NULL,:company,'2026-05-01 09:00:00','2026-05-01 09:00:00'),
  ('demo-advrec-0006','demo-adv-0002',3,'2026-06-01 00:00:00',6000,0,6000,'Pending',NULL,NULL,:company,'2026-05-01 09:05:00','2026-05-01 09:05:00'),
  ('demo-advrec-0007','demo-adv-0003',1,'2025-12-01 00:00:00',5000,5000,5000,'Deducted','2025-12-01 00:00:00',NULL,:company,'2025-12-01 09:00:00','2025-12-01 09:00:00'),
  ('demo-advrec-0008','demo-adv-0003',2,'2026-01-01 00:00:00',5000,5000,0,'Deducted','2026-01-01 00:00:00',NULL,:company,'2026-01-01 09:00:00','2026-01-01 09:00:00');

-- ============================================================================
-- 8. HR overtime settings + rates
-- ============================================================================

DELETE FROM hr_overtime_rates WHERE company_id = :company;
DELETE FROM hr_overtime_settings WHERE company_id = :company;

INSERT INTO hr_overtime_settings (company_id, ot_rules, comp_off_rules, created_at, updated_at) VALUES
  (:company,
   '{"weekdayMultiplier":1.5,"weekendMultiplier":2.0,"holidayMultiplier":2.5,"nightShiftMultiplier":1.75,"maxOtHoursPerDay":4,"maxOtHoursPerWeek":12,"approvalRequired":true,"eligibleGrades":["G4","G5","G6"]}',
   '{"enabled":true,"minHoursForHalfDay":4,"minHoursForFullDay":8,"expiryDays":90,"encashmentAllowed":false}',
   '2025-10-05 10:00:00','2025-10-05 10:00:00');

INSERT INTO hr_overtime_rates (company_id, grade, designation, hourly_rate, multiplier, effective_from, status, created_at, updated_at) VALUES
  (:company,'G6','Operator',180,1.5,'2025-10-01','active','2025-10-05 10:05:00','2025-10-05 10:05:00'),
  (:company,'G6','Operator',240,2.0,'2025-10-01','active','2025-10-05 10:05:00','2025-10-05 10:05:00'),
  (:company,'G5','Technician',250,1.5,'2025-10-01','active','2025-10-05 10:05:00','2025-10-05 10:05:00'),
  (:company,'G4','Supervisor',320,2.5,'2025-10-01','active','2025-10-05 10:05:00','2025-10-05 10:05:00');

-- ============================================================================
-- 9. Inventory policies, kits, kitting orders
-- ============================================================================

DELETE FROM inv_inventory_policies WHERE "policyCode" LIKE 'POL-DEMO-%' AND "companyId" = :company;
INSERT INTO inv_inventory_policies
  ("policyCode","policyName","policyType",category,description,parameters,"appliesTo",status,"companyId","createdAt","updatedAt") VALUES
  ('POL-DEMO-001','Standard Reorder Policy','reorder','Finished Goods','Min-max reorder for finished goods','{"method":"min_max","reorderLevel":10,"reorderQuantity":25,"safetyStockDays":14}','Finished Goods','active',:company,'2025-10-06 09:00:00','2025-10-06 09:00:00'),
  ('POL-DEMO-002','FIFO Valuation Policy','valuation','All Items','FIFO valuation across stock items','{"method":"FIFO","revaluationFrequency":"monthly"}','All Warehouses','active',:company,'2025-10-06 09:00:00','2025-10-06 09:00:00'),
  ('POL-DEMO-003','ABC Cycle Count Policy','cycle_count','All Items','Count A monthly, B quarterly, C half-yearly','{"classA":{"frequencyDays":30,"tolerance":0.5},"classB":{"frequencyDays":90,"tolerance":1},"classC":{"frequencyDays":180,"tolerance":2}}','Main Warehouse','active',:company,'2025-10-06 09:00:00','2025-10-06 09:00:00'),
  ('POL-DEMO-004','FEFO Shelf-Life Policy','shelf_life','Consumables','First-expiry-first-out for coolants and lubricants','{"method":"FEFO","alertDaysBeforeExpiry":30,"quarantineExpired":true}','Consumables','active',:company,'2025-10-06 09:00:00','2025-10-06 09:00:00'),
  ('POL-DEMO-005','Sales Order Reservation Policy','reservation','Finished Goods','Auto-reserve stock on sales order confirmation','{"autoReserve":true,"reservationPriority":"order_date","releaseAfterDays":30}','Finished Goods','active',:company,'2025-10-06 09:00:00','2025-10-06 09:00:00');

DELETE FROM inv_kits WHERE "kitNumber" LIKE 'KIT-DEMO-%' AND "companyId" = :company;
INSERT INTO inv_kits
  ("kitNumber","kitName",category,components,"componentCount","outputQuantity","outputUOM",status,"assemblyCount","lastAssembled","createdBy","companyId","createdAt","updatedAt") VALUES
  ('KIT-DEMO-001','Kitchen Pump & Motor Skid','Assembly','[{"itemCode":"FG-PMP-001","itemName":"Centrifugal Pump CP-200","quantity":1},{"itemCode":"FG-MTR-001","itemName":"Industrial Motor 5HP","quantity":1},{"itemCode":"SP-SL-001","itemName":"Mechanical Seal MS-40","quantity":2},{"itemCode":"SP-BLT-001","itemName":"V-Belt A68","quantity":2}]',4,1,'SET','active',6,'2026-08-12 14:00:00','Suresh Patel',:company,'2025-10-08 09:00:00','2026-08-12 14:00:00'),
  ('KIT-DEMO-002','Gearbox Drive Kit','Assembly','[{"itemCode":"FG-GBX-001","itemName":"Precision Gearbox PG-50","quantity":1},{"itemCode":"FG-MTR-001","itemName":"Industrial Motor 5HP","quantity":1},{"itemCode":"SP-BRG-001","itemName":"Ball Bearing 6205","quantity":4}]',3,1,'SET','active',3,'2026-06-20 11:00:00','Suresh Patel',:company,'2025-11-10 09:00:00','2026-06-20 11:00:00'),
  ('KIT-DEMO-003','Maintenance Spares Kit','Spares','[{"itemCode":"SP-BRG-001","itemName":"Ball Bearing 6205","quantity":6},{"itemCode":"SP-BLT-001","itemName":"V-Belt A68","quantity":4},{"itemCode":"SP-SL-001","itemName":"Mechanical Seal MS-40","quantity":2},{"itemCode":"CON-LUB-001","itemName":"Industrial Lubricant Oil ISO VG 68","quantity":5}]',4,1,'SET','active',9,'2026-09-01 10:00:00','Amit Verma',:company,'2025-12-01 09:00:00','2026-09-01 10:00:00'),
  ('KIT-DEMO-004','Machine Installation Kit','Installation','[{"itemCode":"TOOL-DRL-001","itemName":"HSS Drill Bit Set 1-13mm","quantity":1},{"itemCode":"RM-STL-001","itemName":"Steel Sheet 2mm","quantity":10},{"itemCode":"RM-ALM-001","itemName":"Aluminum Rod 20mm","quantity":6}]',3,1,'SET','draft',0,NULL,'Amit Verma',:company,'2026-07-15 09:00:00','2026-07-15 09:00:00');

DELETE FROM inv_kitting_orders WHERE "orderNumber" LIKE 'KO-DEMO-%' AND "companyId" = :company;
INSERT INTO inv_kitting_orders
  ("orderNumber","orderType","orderDate","kitNumber","kitName","quantityOrdered","quantityDone","handledBy",warehouse,reason,status,priority,"startDate","completionDate","expectedDate","companyId","createdAt","updatedAt") VALUES
  ('KO-DEMO-0001','assembly','2025-11-20 09:00:00','KIT-DEMO-001','Kitchen Pump & Motor Skid',4,4,'Ravi Menon','Main Warehouse','SO-DEMO-0001 delivery build','completed','high','2025-11-21 08:00:00','2025-11-26 16:00:00','2025-11-28 00:00:00',:company,'2025-11-20 09:00:00','2025-11-26 16:00:00'),
  ('KO-DEMO-0002','assembly','2026-02-10 10:00:00','KIT-DEMO-002','Gearbox Drive Kit',2,2,'Ganesh Patil','Main Warehouse','Stock build for Q1 dispatches','completed','normal','2026-02-11 08:00:00','2026-02-14 15:00:00','2026-02-16 00:00:00',:company,'2026-02-10 10:00:00','2026-02-14 15:00:00'),
  ('KO-DEMO-0003','assembly','2026-06-15 09:30:00','KIT-DEMO-003','Maintenance Spares Kit',6,3,'Ravi Menon','Spare Parts Store','AMC customer spares packs','in_progress','normal','2026-06-16 08:00:00',NULL,'2026-09-20 00:00:00',:company,'2026-06-15 09:30:00','2026-09-01 10:00:00'),
  ('KO-DEMO-0004','disassembly','2026-07-22 11:00:00','KIT-DEMO-001','Kitchen Pump & Motor Skid',1,1,'Ganesh Patil','Rejection Store','Customer return — recover serviceable components','completed','low','2026-07-23 08:00:00','2026-07-24 12:00:00','2026-07-27 00:00:00',:company,'2026-07-22 11:00:00','2026-07-24 12:00:00'),
  ('KO-DEMO-0005','assembly','2026-09-05 09:00:00','KIT-DEMO-002','Gearbox Drive Kit',3,0,'Ravi Menon','Main Warehouse','Build for SO-DEMO-0012','pending','high',NULL,NULL,'2026-09-25 00:00:00',:company,'2026-09-05 09:00:00','2026-09-05 09:00:00');

-- ============================================================================
-- 10. ITIL: incidents, problems, changes + approvals
-- ============================================================================

DELETE FROM itil_change_approvals WHERE "companyId" = :company;
DELETE FROM itil_changes WHERE "changeNumber" LIKE 'CHG-DEMO-%' AND "companyId" = :company;
DELETE FROM itil_problems WHERE "problemNumber" LIKE 'PRB-DEMO-%' AND "companyId" = :company;
DELETE FROM itil_incidents WHERE "incidentNumber" LIKE 'INC-DEMO-%' AND "companyId" = :company;

INSERT INTO itil_incidents
  ("incidentNumber",title,description,impact,urgency,priority,category,subcategory,"affectedService","affectedCI",status,"assignedGroup","assignedTo","reportedAt","reportedBy","acknowledgedAt","resolvedAt","closedAt","resolutionCode","resolutionNotes","rootCause","isMajorIncident","majorIncidentManager","companyId","isActive","createdAt","updatedAt") VALUES
  ('INC-DEMO-0001','ERP application outage','ERP web application unreachable for all plant users','high','high','P1','Application','Availability','ERP Portal','APP-ERP-PROD','closed','Infrastructure','Sanjay Malhotra','2025-10-15 08:12:00','Amit Verma','2025-10-15 08:20:00','2025-10-15 11:45:00','2025-10-16 10:00:00','fixed','Restarted app pool and increased DB connection pool size','Database connection pool exhaustion',true,'Sanjay Malhotra',:company,true,'2025-10-15 08:12:00','2025-10-16 10:00:00'),
  ('INC-DEMO-0002','Email delivery delays','Outbound notification emails delayed by over 2 hours','medium','medium','P3','Infrastructure','Email','Notification Service','SVC-SMTP-01','resolved','Infrastructure','Neha Agarwal','2025-11-20 14:30:00','Pooja Mehta','2025-11-20 15:00:00','2025-11-21 09:30:00',NULL,'workaround','Rerouted through secondary SMTP relay','Primary relay throttled by provider',false,NULL,:company,true,'2025-11-20 14:30:00','2025-11-21 09:30:00'),
  ('INC-DEMO-0003','Shop-floor terminal not booting','MES kiosk terminal 3 on assembly line fails to boot','low','medium','P4','Hardware','Workstation','MES Kiosks','HW-KIOSK-03','closed','IT Support','Kiran Reddy','2025-12-10 07:45:00','Ganesh Patil','2025-12-10 08:15:00','2025-12-10 12:00:00','2025-12-11 09:00:00','replaced','Replaced faulty SSD and re-imaged the terminal','SSD failure',false,NULL,:company,true,'2025-12-10 07:45:00','2025-12-11 09:00:00'),
  ('INC-DEMO-0004','VPN drops for remote users','Frequent VPN disconnects for remote sales team','medium','high','P2','Network','VPN','Remote Access','NET-FW-01','resolved','Network','Sanjay Malhotra','2026-02-03 10:20:00','Sarah Mitchell','2026-02-03 10:35:00','2026-02-04 16:00:00',NULL,'fixed','Upgraded firewall firmware to patched release','Firmware bug in SSL-VPN module',false,NULL,:company,true,'2026-02-03 10:20:00','2026-02-04 16:00:00'),
  ('INC-DEMO-0005','Payroll report timeout','Monthly payroll register report times out for periods over 6 months','medium','medium','P3','Application','Performance','Payroll Module','APP-ERP-PROD','in_progress','Application Support','Neha Agarwal','2026-05-04 11:00:00','Priya Sharma','2026-05-04 11:30:00',NULL,NULL,NULL,NULL,NULL,false,NULL,:company,true,'2026-05-04 11:00:00','2026-06-15 09:00:00'),
  ('INC-DEMO-0006','Barcode scanner pairing failures','Warehouse scanners randomly lose Bluetooth pairing','low','low','P4','Hardware','Peripheral','WMS','HW-SCAN-FLEET','pending','IT Support','Kiran Reddy','2026-06-18 09:15:00','Ravi Menon','2026-06-18 10:00:00',NULL,NULL,NULL,NULL,NULL,false,NULL,:company,true,'2026-06-18 09:15:00','2026-07-01 10:00:00'),
  ('INC-DEMO-0007','Finance dashboard shows stale data','AR aging dashboard not refreshed since overnight ETL','medium','high','P2','Data','ETL','Analytics','SVC-ETL-01','resolved','Data Engineering','Sanjay Malhotra','2026-08-11 08:05:00','Arun Gupta','2026-08-11 08:20:00','2026-08-11 13:40:00',NULL,'fixed','Re-ran failed ETL job after clearing lock; added retry alerting','Stuck table lock from aborted batch',false,NULL,:company,true,'2026-08-11 08:05:00','2026-08-11 13:40:00'),
  ('INC-DEMO-0008','Cannot upload attachments over 10MB','Users report upload failures for large CAD drawings','low','medium','P3','Application','File Upload','Document Service','APP-DOC-SVC','new','Application Support',NULL,'2026-09-08 15:20:00','Amit Verma',NULL,NULL,NULL,NULL,NULL,NULL,false,NULL,:company,true,'2026-09-08 15:20:00','2026-09-08 15:20:00');

INSERT INTO itil_problems
  ("problemNumber",title,description,impact,urgency,priority,category,"affectedService","affectedCIs",status,"assignedGroup","assignedTo","rootCause",workaround,"loggedAt","loggedBy","investigationStarted","resolvedAt","closedAt","relatedIncidents","incidentCount","companyId","isActive","createdAt","updatedAt") VALUES
  ('PRB-DEMO-0001','Recurring DB connection pool exhaustion','ERP outages recur under month-end load due to connection pool sizing','high','high','P1','Application','ERP Portal',ARRAY['APP-ERP-PROD','DB-PG-01'],'resolved','Infrastructure','Sanjay Malhotra','Connection pool sized for 200 users while month-end peak reaches 450 concurrent sessions','Restart app pool; stagger month-end batch jobs','2025-10-16 09:00:00','Sanjay Malhotra','2025-10-17 10:00:00','2025-11-05 16:00:00','2025-11-12 10:00:00',ARRAY['INC-DEMO-0001'],3,:company,true,'2025-10-16 09:00:00','2025-11-12 10:00:00'),
  ('PRB-DEMO-0002','SMTP relay throttling under bulk sends','Bulk notification bursts trigger provider rate limits','medium','medium','P3','Infrastructure','Notification Service',ARRAY['SVC-SMTP-01'],'known_error','Infrastructure','Neha Agarwal','Provider throttles above 500 mails per 10 minutes','Queue with 400/10min send window on secondary relay','2025-11-21 10:00:00','Neha Agarwal','2025-11-24 09:00:00',NULL,NULL,ARRAY['INC-DEMO-0002'],2,:company,true,'2025-11-21 10:00:00','2026-01-15 09:00:00'),
  ('PRB-DEMO-0003','Report engine degrades on large date ranges','Multiple report timeouts traced to unindexed date-range scans','medium','medium','P2','Application','Reporting',ARRAY['APP-ERP-PROD','DB-PG-01'],'investigating','Application Support','Neha Agarwal',NULL,'Advise users to run reports in 3-month windows','2026-05-05 10:00:00','Neha Agarwal','2026-05-08 09:00:00',NULL,NULL,ARRAY['INC-DEMO-0005'],1,:company,true,'2026-05-05 10:00:00','2026-06-20 11:00:00'),
  ('PRB-DEMO-0004','Warehouse scanner firmware instability','Fleet-wide Bluetooth stack crashes on scanner firmware v2.1','low','low','P4','Hardware','WMS',ARRAY['HW-SCAN-FLEET'],'logged','IT Support',NULL,NULL,'Power-cycle scanner to re-pair','2026-06-19 09:00:00','Kiran Reddy',NULL,NULL,NULL,ARRAY['INC-DEMO-0006'],1,:company,true,'2026-06-19 09:00:00','2026-06-19 09:00:00');

INSERT INTO itil_changes
  ("changeNumber",title,description,justification,"changeType",category,"riskLevel",impact,status,"plannedStartDate","plannedEndDate","actualStartDate","actualEndDate","requestedBy","assignedGroup","assignedTo","changeManager","implementationPlan","backoutPlan","testPlan","reviewNotes","reviewedBy","reviewedAt","relatedProblemId","relatedIncidents","affectedCIs","companyId","isActive","createdAt","updatedAt") VALUES
  ('CHG-DEMO-0001','Increase ERP DB connection pool and tune Postgres','Resize pool to 600 and tune max_connections/work_mem','Permanent fix for PRB-DEMO-0001 outages','normal','Database','medium','high','closed','2025-11-01 22:00:00','2025-11-02 02:00:00','2025-11-01 22:05:00','2025-11-02 01:30:00','Sanjay Malhotra','Infrastructure','Sanjay Malhotra','Rajesh Kumar','Apply pool config, restart app tier node by node','Revert config from git tag pre-change','Load test with 500 virtual users in staging','Implemented cleanly, no user impact','Rajesh Kumar','2025-11-04 10:00:00','PRB-DEMO-0001',ARRAY['INC-DEMO-0001'],ARRAY['APP-ERP-PROD','DB-PG-01'],:company,true,'2025-10-25 09:00:00','2025-11-04 10:00:00'),
  ('CHG-DEMO-0002','Firewall firmware upgrade to 7.2.5','Upgrade SSL-VPN module to patched firmware','Fixes VPN disconnect bug affecting sales team','emergency','Network','high','medium','closed','2026-02-04 21:00:00','2026-02-04 23:00:00','2026-02-04 21:10:00','2026-02-04 22:20:00','Sanjay Malhotra','Network','Sanjay Malhotra','Rajesh Kumar','Upload firmware, failover to secondary, upgrade primary','Boot previous firmware partition','Vendor-validated upgrade path; smoke test VPN tunnel','Emergency change executed successfully','Rajesh Kumar','2026-02-06 09:00:00',NULL,ARRAY['INC-DEMO-0004'],ARRAY['NET-FW-01'],:company,true,'2026-02-04 12:00:00','2026-02-06 09:00:00'),
  ('CHG-DEMO-0003','Add composite indexes for reporting queries','Create date-range composite indexes on payroll and finance tables','Resolves report timeout problem PRB-DEMO-0003','normal','Database','low','medium','implementing','2026-09-12 22:00:00','2026-09-13 01:00:00','2026-09-12 22:00:00',NULL,'Neha Agarwal','Application Support','Neha Agarwal','Sanjay Malhotra','CREATE INDEX CONCURRENTLY during low-usage window','DROP INDEX CONCURRENTLY','EXPLAIN ANALYZE before/after on top 10 slow queries',NULL,NULL,NULL,'PRB-DEMO-0003',ARRAY['INC-DEMO-0005'],ARRAY['DB-PG-01'],:company,true,'2026-08-28 10:00:00','2026-09-08 09:00:00'),
  ('CHG-DEMO-0004','Roll out scanner firmware v2.3 to warehouse fleet','Staged firmware rollout to 24 scanners','Fixes Bluetooth instability on v2.1','standard','Hardware','low','low','approval','2026-09-20 09:00:00','2026-09-22 17:00:00',NULL,NULL,'Kiran Reddy','IT Support','Kiran Reddy','Sanjay Malhotra','Update 4 pilot units, then batches of 10','Reflash v2.1 image','Pilot units run 48h in receiving area',NULL,NULL,NULL,'PRB-DEMO-0004',ARRAY['INC-DEMO-0006'],ARRAY['HW-SCAN-FLEET'],:company,true,'2026-09-02 11:00:00','2026-09-06 10:00:00'),
  ('CHG-DEMO-0005','Migrate notification service to transactional email provider','Move from shared SMTP relay to dedicated transactional API','Eliminates throttling known error PRB-DEMO-0002','normal','Infrastructure','medium','medium','assessment',NULL,NULL,NULL,NULL,'Neha Agarwal','Infrastructure',NULL,'Rajesh Kumar','Dual-send pilot, DNS/SPF cutover, decommission relay','Repoint to legacy relay config','Seed-list deliverability test across major providers',NULL,NULL,NULL,'PRB-DEMO-0002',ARRAY['INC-DEMO-0002'],ARRAY['SVC-SMTP-01'],:company,true,'2026-09-07 09:30:00','2026-09-09 14:00:00');

INSERT INTO itil_change_approvals
  ("changeId","approverId","approverName","approverRole",decision,comments,"requestedAt","decidedAt","companyId","createdAt","updatedAt") VALUES
  ((SELECT id FROM itil_changes WHERE "changeNumber"='CHG-DEMO-0001' AND "companyId"=:company),'EMP0001','Rajesh Kumar','Change Manager','approved','Approved for weekend maintenance window','2025-10-27 09:00:00','2025-10-28 11:00:00',:company,'2025-10-27 09:00:00','2025-10-28 11:00:00'),
  ((SELECT id FROM itil_changes WHERE "changeNumber"='CHG-DEMO-0001' AND "companyId"=:company),'EMP0017','Sanjay Malhotra','Technical Lead','approved','Config reviewed against staging load test','2025-10-27 09:00:00','2025-10-27 16:30:00',:company,'2025-10-27 09:00:00','2025-10-27 16:30:00'),
  ((SELECT id FROM itil_changes WHERE "changeNumber"='CHG-DEMO-0002' AND "companyId"=:company),'EMP0001','Rajesh Kumar','Change Manager','approved','Emergency CAB approval by phone','2026-02-04 13:00:00','2026-02-04 14:00:00',:company,'2026-02-04 13:00:00','2026-02-04 14:00:00'),
  ((SELECT id FROM itil_changes WHERE "changeNumber"='CHG-DEMO-0003' AND "companyId"=:company),'EMP0017','Sanjay Malhotra','Change Manager','approved','Low risk; concurrent index build only','2026-09-01 10:00:00','2026-09-03 15:00:00',:company,'2026-09-01 10:00:00','2026-09-03 15:00:00'),
  ((SELECT id FROM itil_changes WHERE "changeNumber"='CHG-DEMO-0003' AND "companyId"=:company),'EMP0015','Arun Gupta','CAB member','approved','Verify report SLAs post-change','2026-09-01 10:00:00','2026-09-04 09:30:00',:company,'2026-09-01 10:00:00','2026-09-04 09:30:00'),
  ((SELECT id FROM itil_changes WHERE "changeNumber"='CHG-DEMO-0004' AND "companyId"=:company),'EMP0017','Sanjay Malhotra','Change Manager','pending',NULL,'2026-09-06 10:00:00',NULL,:company,'2026-09-06 10:00:00','2026-09-06 10:00:00'),
  ((SELECT id FROM itil_changes WHERE "changeNumber"='CHG-DEMO-0004' AND "companyId"=:company),'EMP0007','Amit Verma','CAB member','approved','Pilot plan is adequate','2026-09-06 10:00:00','2026-09-08 12:00:00',:company,'2026-09-06 10:00:00','2026-09-08 12:00:00'),
  ((SELECT id FROM itil_changes WHERE "changeNumber"='CHG-DEMO-0005' AND "companyId"=:company),'EMP0001','Rajesh Kumar','Change Manager','pending','Awaiting cost comparison of providers','2026-09-09 14:00:00',NULL,:company,'2026-09-09 14:00:00','2026-09-09 14:00:00');

-- ============================================================================
-- 11. Logistics: packaging types, ports, carrier contracts, carrier rates
--     (NOTE: live DDL diverges from Prisma models — columns follow the DB)
-- ============================================================================

DELETE FROM logistics_packaging_types WHERE code LIKE 'PKG-DEMO-%';
INSERT INTO logistics_packaging_types
  (code, name, type, material, dimensions, "maxWeight", cost, reusable, recyclable, status, "createdAt", "updatedAt") VALUES
  ('PKG-DEMO-01','Export Wooden Crate Large','Crate','Heat-treated pine wood','180x120x140 cm',800,4500,true,true,'Active','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  ('PKG-DEMO-02','Corrugated Box 5-Ply Large','Box','5-ply corrugated cardboard','60x40x40 cm',25,120,false,true,'Active','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  ('PKG-DEMO-03','Standard Euro Pallet','Pallet','Hardwood','120x80x14.4 cm',1500,950,true,true,'Active','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  ('PKG-DEMO-04','Stretch Wrap Roll 23mu','Wrap','LLDPE film','50 cm x 300 m',0,380,false,true,'Active','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  ('PKG-DEMO-05','Foam Insert Set — Pump Skid','Insert','EPE foam','Custom cut for CP-200 skid',0,650,false,false,'Active','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  ('PKG-DEMO-06','Steel Drum 200L','Drum','Mild steel','58x88 cm',250,1800,true,true,'Active','2025-10-07 09:00:00','2025-10-07 09:00:00');

DELETE FROM logistics_ports WHERE code IN ('INNSA','INMUN','INMAA','AEJEA','USLAX','SGSIN');
INSERT INTO logistics_ports
  (code, name, "portCode", type, country, state, city, facilities, "customsAvailable", status, "createdAt", "updatedAt") VALUES
  ('INNSA','Jawaharlal Nehru Port (JNPT)','INNSA','Seaport','India','Maharashtra','Navi Mumbai','["container_yard","warehouse","cfs","rail_terminal"]',true,'Active','2025-10-07 10:00:00','2025-10-07 10:00:00'),
  ('INMUN','Mundra Port','INMUN','Seaport','India','Gujarat','Mundra','["container_yard","warehouse","cold_storage","rail_terminal"]',true,'Active','2025-10-07 10:00:00','2025-10-07 10:00:00'),
  ('INMAA','Chennai Port','INMAA','Seaport','India','Tamil Nadu','Chennai','["container_yard","warehouse"]',true,'Active','2025-10-07 10:00:00','2025-10-07 10:00:00'),
  ('AEJEA','Jebel Ali Port','AEJEA','Seaport','United Arab Emirates','Dubai','Dubai','["container_yard","warehouse","free_zone"]',true,'Active','2025-10-07 10:00:00','2025-10-07 10:00:00'),
  ('USLAX','Port of Los Angeles','USLAX','Seaport','United States','California','Los Angeles','["container_yard","warehouse","rail_terminal"]',true,'Active','2025-10-07 10:00:00','2025-10-07 10:00:00'),
  ('SGSIN','Port of Singapore','SGSIN','Seaport','Singapore',NULL,'Singapore','["container_yard","warehouse","transshipment_hub"]',true,'Active','2025-10-07 10:00:00','2025-10-07 10:00:00');

DELETE FROM logistics_carrier_contracts WHERE "contractNo" LIKE 'LCC-DEMO-%';
INSERT INTO logistics_carrier_contracts
  ("contractNo", carrier, type, "startDate", "endDate", value, status, routes, sla, "rateType", "baseRate", "renewalStatus", "createdAt", "updatedAt") VALUES
  ('LCC-DEMO-001','Blue Dart','Annual','2025-10-01','2026-09-30',1800000,'Active','["Mumbai-Delhi","Mumbai-Bengaluru","Mumbai-Hyderabad"]','98% on-time, 24-48h surface express','Per Kg',95,'Due for Review','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('LCC-DEMO-002','Gati Logistics','Annual','2025-11-01','2026-10-31',1200000,'Active','["Mumbai-Chennai","Mumbai-Kochi","Pune-Ahmedabad"]','95% on-time, 3-5 day surface','Per Kg',62,'Auto-Renew','2025-11-01 09:00:00','2025-11-01 09:00:00'),
  ('LCC-DEMO-003','Safexpress','Project','2026-01-15','2026-07-14',650000,'Expired','["Mumbai-Gurugram"]','Dedicated FTL within 72h of indent','Per Trip',48000,'Not Renewing','2026-01-15 09:00:00','2026-07-15 09:00:00'),
  ('LCC-DEMO-004','DHL Express','Annual','2026-02-01','2027-01-31',2400000,'Active','["Mumbai-Dubai","Mumbai-Singapore","Mumbai-Los Angeles"]','International express 3-5 business days, door-to-door','Per Shipment',8500,'Active','2026-02-01 09:00:00','2026-02-01 09:00:00'),
  ('LCC-DEMO-005','Delhivery','Spot','2026-06-01','2026-12-31',450000,'Active','["Mumbai-Pune","Mumbai-Ahmedabad"]','90% on-time, 2-4 day surface','Per Kg',38,'Active','2026-06-01 09:00:00','2026-06-01 09:00:00');

DELETE FROM logistics_carrier_rates WHERE zone LIKE 'DEMO-%';
INSERT INTO logistics_carrier_rates
  (carrier, "serviceType", zone, origin, destination, "baseRate", "perKgRate", "fuelSurcharge", "minWeight", "maxWeight", "volumetricDivisor", "transitTime", "effectiveFrom", "effectiveTo", currency, "isActive", "lastUpdated", "rateChange", "createdAt", "updatedAt") VALUES
  ('Blue Dart','express','DEMO-North','Mumbai','New Delhi',1200,95,12.5,10,500,5000,'24-48 hours','2025-10-01','2026-09-30','INR',true,'2025-10-01',0,'2025-10-01 09:30:00','2025-10-01 09:30:00'),
  ('Blue Dart','express','DEMO-South','Mumbai','Bengaluru',1100,88,12.5,10,500,5000,'24-48 hours','2025-10-01','2026-09-30','INR',true,'2025-10-01',0,'2025-10-01 09:30:00','2025-10-01 09:30:00'),
  ('Blue Dart','standard','DEMO-South','Mumbai','Hyderabad',900,72,12.5,10,1000,5000,'2-3 days','2025-10-01','2026-09-30','INR',true,'2026-04-01',3.5,'2025-10-01 09:30:00','2026-04-01 10:00:00'),
  ('Gati Logistics','standard','DEMO-South','Mumbai','Chennai',800,62,10,25,2000,5000,'3-4 days','2025-11-01','2026-10-31','INR',true,'2025-11-01',0,'2025-11-01 09:30:00','2025-11-01 09:30:00'),
  ('Gati Logistics','economy','DEMO-South','Mumbai','Kochi',700,55,10,25,2000,5000,'4-5 days','2025-11-01','2026-10-31','INR',true,'2025-11-01',0,'2025-11-01 09:30:00','2025-11-01 09:30:00'),
  ('Safexpress','standard','DEMO-North','Mumbai','Gurugram',1500,68,11,50,5000,4750,'3-4 days','2026-01-15','2026-07-14','INR',false,'2026-01-15',0,'2026-01-15 09:30:00','2026-07-15 09:00:00'),
  ('DHL Express','express','DEMO-Intl-ME','Mumbai','Dubai',8500,420,18,1,300,5000,'3-4 business days','2026-02-01','2027-01-31','INR',true,'2026-02-01',0,'2026-02-01 09:30:00','2026-02-01 09:30:00'),
  ('DHL Express','express','DEMO-Intl-APAC','Mumbai','Singapore',9200,460,18,1,300,5000,'3-4 business days','2026-02-01','2027-01-31','INR',true,'2026-02-01',0,'2026-02-01 09:30:00','2026-02-01 09:30:00'),
  ('DHL Express','express','DEMO-Intl-US','Mumbai','Los Angeles',14500,680,18,1,300,5000,'4-6 business days','2026-02-01','2027-01-31','INR',true,'2026-06-01',5,'2026-02-01 09:30:00','2026-06-01 10:00:00'),
  ('Delhivery','economy','DEMO-West','Mumbai','Ahmedabad',450,38,9,5,800,5000,'2-3 days','2026-06-01','2026-12-31','INR',true,'2026-06-01',0,'2026-06-01 09:30:00','2026-06-01 09:30:00');

-- ============================================================================
-- 12. Compliance: data-subject requests + regulatory reports
-- ============================================================================

DELETE FROM compliance_data_requests WHERE company_id = :company;
INSERT INTO compliance_data_requests
  (company_id, reference, subject_name, subject_email, request_type, status, received_at, deadline_at, completed_at, notes, created_at, updated_at) VALUES
  (:company,'DSR-DEMO-001','Olivia Grant','olivia@coastaleats.com','data_export','completed','2025-11-10','2025-12-10','2025-11-28','Full CRM contact-data export delivered via secure link','2025-11-10 10:00:00','2025-11-28 15:00:00'),
  (:company,'DSR-DEMO-002','Daniel Wu','daniel@peakgyms.com','data_deletion','completed','2026-01-08','2026-02-07','2026-01-30','Lead record anonymised; retention exceptions documented for invoices','2026-01-08 09:30:00','2026-01-30 14:00:00'),
  (:company,'DSR-DEMO-003','Grace Kim','grace.kim@demo-seed.b3macbis.com','data_correction','in_progress','2026-06-22','2026-07-22',NULL,'Contact phone and employer details correction in CRM','2026-06-22 11:00:00','2026-07-01 10:00:00'),
  (:company,'DSR-DEMO-004','Victor Mendes','victor.mendes@demo-seed.b3macbis.com','consent_withdrawal','completed','2026-07-15','2026-08-14','2026-07-20','Unsubscribed from all marketing campaigns','2026-07-15 09:00:00','2026-07-20 12:00:00'),
  (:company,'DSR-DEMO-005','Sophia Rossi','sophia@urbanroast.com','access_request','pending','2026-09-05','2026-10-05',NULL,'Requested summary of personal data processing purposes','2026-09-05 14:00:00','2026-09-05 14:00:00');

DELETE FROM compliance_reg_reports WHERE company_id = :company;
INSERT INTO compliance_reg_reports
  (company_id, name, report_type, status, report_date, file_size, file_url, generated_by, notes, created_at, updated_at) VALUES
  (:company,'GSTR-3B Monthly Return — Oct 2025','Statutory','Submitted','2025-11-18','1.2 MB','/reports/compliance/gstr3b-2025-10.pdf','Arun Gupta','Filed on GST portal, ARN received','2025-11-18 16:00:00','2025-11-18 16:00:00'),
  (:company,'PF & ESI Remittance Report — Q3 FY26','Statutory','Submitted','2026-01-12','860 KB','/reports/compliance/pf-esi-q3-fy26.pdf','Priya Sharma','Remittances reconciled with challans','2026-01-12 15:00:00','2026-01-12 15:00:00'),
  (:company,'Factory Safety Audit Report — H2 2025','Regulatory','Generated','2026-02-05','4.8 MB','/reports/compliance/factory-safety-h2-2025.pdf','Suresh Patel','Two minor observations, CAPA logged','2026-02-05 11:00:00','2026-02-05 11:00:00'),
  (:company,'GDPR Processing Activities Register — FY26','Internal','Generated','2026-04-20','640 KB','/reports/compliance/ropa-fy26.pdf','Sanjay Malhotra','Annual Article 30 register refresh','2026-04-20 10:00:00','2026-04-20 10:00:00'),
  (:company,'Environmental Consent Renewal Pack','Regulatory','Scheduled','2026-10-15',NULL,NULL,NULL,'MPCB consent-to-operate renewal due','2026-08-25 09:00:00','2026-08-25 09:00:00'),
  (:company,'Internal Data Privacy Audit — H1 FY27','Internal','Scheduled','2026-11-30',NULL,NULL,NULL,'Scope: CRM, HR and support ticket PII','2026-09-08 10:00:00','2026-09-08 10:00:00');
