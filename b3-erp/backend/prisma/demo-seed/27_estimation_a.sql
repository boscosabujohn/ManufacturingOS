-- Demo seed — Estimation (part A) for B3 MACBIS.
-- Covers 17 tables: categories, cost categories, BOQs (+items, templates),
-- cost estimates (+items, templates, versions), accuracy records, approval
-- workflows, BOM import sessions, comments, equipment rates, estimator
-- performance, historical benchmarks, labor cost rates.
-- Domain: estimating commercial-kitchen fitout projects (equipment,
-- SS fabrication, MEP, installation). Timeline 2025-10-01 .. 2026-09-10.
-- Idempotent. Delete predicates:
--   * companyId = :company for every companyId-scoped table
--   * estimation_boqs / estimation_boq_items have NO companyId — scoped by
--     "boqNumber" LIKE 'BOQ-DEMO-%' (items via parent join)
--   * estimation_cost_estimate_items via parent estimates (companyId scope)
-- Amount coherence: BOQ estimatedValue and estimate cost buildup
-- (material/labor/overhead/equipment/subcontractor + contingency = total)
-- are rolled up from line items by the UPDATEs at the end of each section.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- Clear demo rows (children before parents)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_cost_estimate_items WHERE "costEstimateId" IN (
  SELECT id FROM estimation_cost_estimates WHERE "companyId" = :company);
DELETE FROM estimation_estimate_versions WHERE "companyId" = :company;
DELETE FROM estimation_comments WHERE "companyId" = :company;
DELETE FROM estimation_bom_import_sessions WHERE "companyId" = :company;
DELETE FROM estimation_accuracy_records WHERE "companyId" = :company;
DELETE FROM estimation_cost_estimates WHERE "companyId" = :company;
DELETE FROM estimation_boq_items WHERE "boqId" IN (
  SELECT id FROM estimation_boqs WHERE "boqNumber" LIKE 'BOQ-DEMO-%');
DELETE FROM estimation_boqs WHERE "boqNumber" LIKE 'BOQ-DEMO-%';
DELETE FROM estimation_boq_templates WHERE "companyId" = :company;
DELETE FROM estimation_estimate_templates WHERE "companyId" = :company;
DELETE FROM estimation_approval_workflows WHERE "companyId" = :company;
DELETE FROM estimation_categories WHERE "companyId" = :company;
DELETE FROM estimation_cost_categories WHERE "companyId" = :company;
DELETE FROM estimation_equipment_rates WHERE "companyId" = :company;
DELETE FROM estimation_estimator_performance WHERE "companyId" = :company;
DELETE FROM estimation_historical_benchmarks WHERE "companyId" = :company;
DELETE FROM estimation_labor_cost_rates WHERE "companyId" = :company;

-- ---------------------------------------------------------------------------
-- Item/category masters
-- ---------------------------------------------------------------------------
INSERT INTO estimation_categories
  ("companyId", code, name, description, "parentCategory", type, "defaultMarkup",
   "itemCount", "sortOrder", status, "createdAt", "updatedAt")
VALUES
  (:company,'CAT-DEMO-01','Cooking Equipment','Ranges, combi ovens, fryers, grills',NULL,'material',18.00,42,1,'active','2025-10-02 09:00:00','2026-01-15 11:20:00'),
  (:company,'CAT-DEMO-02','Refrigeration','Walk-in cold rooms, blast chillers, undercounters',NULL,'material',16.50,28,2,'active','2025-10-02 09:05:00','2026-01-15 11:20:00'),
  (:company,'CAT-DEMO-03','SS Fabrication','Custom SS304/316 tables, counters, hoods, shelving',NULL,'material',22.00,55,3,'active','2025-10-02 09:10:00','2026-03-04 10:05:00'),
  (:company,'CAT-DEMO-04','Exhaust & Ventilation','Hoods, ducting, fresh-air and extract systems','SS Fabrication','material',20.00,17,4,'active','2025-10-02 09:15:00','2025-12-10 15:40:00'),
  (:company,'CAT-DEMO-05','Installation Labor','Site installation, alignment and commissioning crews',NULL,'labor',25.00,9,5,'active','2025-10-02 09:20:00','2026-02-18 09:30:00'),
  (:company,'CAT-DEMO-06','MEP Services','Gas, water, drainage and electrical reticulation',NULL,'service',15.00,12,6,'active','2025-10-02 09:25:00','2026-02-18 09:30:00'),
  (:company,'CAT-DEMO-07','Rental Equipment','Lifts, cranes and site plant hired for installation',NULL,'equipment',10.00,8,7,'active','2025-11-06 10:00:00','2026-05-22 14:10:00'),
  (:company,'CAT-DEMO-08','Freight & Handling','Inbound freight, packing, site logistics',NULL,'service',8.00,4,8,'inactive','2025-11-06 10:05:00','2026-07-01 16:45:00');

INSERT INTO estimation_cost_categories
  ("companyId", code, name, description, "costType", "parentCategoryId", level,
   "isActive", "defaultMarkupPercentage", "sortOrder", "glAccountCode",
   "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'CC-DEMO-MAT','Equipment & Materials','Bought-out kitchen equipment and materials','Material',NULL,0,true,18.00,1,'5100','Arun Gupta','2025-10-03 09:00:00','2025-10-03 09:00:00'),
  (:company,'CC-DEMO-SSF','SS Fabrication Materials','SS sheet, sections and consumables for fabrication','Material',NULL,0,true,22.00,2,'5110','Arun Gupta','2025-10-03 09:05:00','2026-02-11 10:30:00'),
  (:company,'CC-DEMO-LAB','Direct Labor','Fabrication shop labor','Labor',NULL,0,true,25.00,3,'5200','Arun Gupta','2025-10-03 09:10:00','2025-10-03 09:10:00'),
  (:company,'CC-DEMO-INST','Installation Labor','Site installation and commissioning labor','Labor',NULL,0,true,25.00,4,'5210','Meera Nair','2025-10-03 09:15:00','2026-04-08 12:00:00'),
  (:company,'CC-DEMO-EQP','Site Equipment','Cranes, lifts and plant used on site','Equipment',NULL,0,true,10.00,5,'5300','Meera Nair','2025-10-03 09:20:00','2025-10-03 09:20:00'),
  (:company,'CC-DEMO-OVH','Site Overheads','Supervision, site establishment, insurances','Overhead',NULL,0,true,12.00,6,'5400','Meera Nair','2025-10-03 09:25:00','2025-10-03 09:25:00'),
  (:company,'CC-DEMO-SUB','Subcontracted MEP','Gas, plumbing, electrical and ventilation subcontracts','Subcontractor',NULL,0,true,15.00,7,'5500','Deepak Joshi','2025-10-03 09:30:00','2026-06-19 09:45:00'),
  (:company,'CC-DEMO-OTH','Freight & Miscellaneous','Freight, permits and sundry costs','Other',NULL,0,true,8.00,8,'5600','Deepak Joshi','2025-11-12 11:00:00','2025-11-12 11:00:00');

INSERT INTO estimation_labor_cost_rates
  ("companyId", skill, department, level, "standardRate", "overtimeRate", unit,
   efficiency, utilization, status, "createdAt", "updatedAt")
VALUES
  (:company,'SS Fabricator','Fabrication','Senior',32.00,48.00,'hour',92.00,85.00,'active','2025-10-04 09:00:00','2026-01-10 10:00:00'),
  (:company,'SS Fabricator','Fabrication','Junior',21.00,31.50,'hour',80.00,82.00,'active','2025-10-04 09:05:00','2026-01-10 10:00:00'),
  (:company,'TIG Welder','Fabrication','Senior',36.00,54.00,'hour',94.00,88.00,'active','2025-10-04 09:10:00','2026-01-10 10:00:00'),
  (:company,'Installation Fitter','Installation','Mid',28.00,42.00,'hour',88.00,78.00,'active','2025-10-04 09:15:00','2026-04-02 14:30:00'),
  (:company,'MEP Technician','MEP','Mid',30.00,45.00,'hour',85.00,75.00,'active','2025-10-04 09:20:00','2026-04-02 14:30:00'),
  (:company,'Electrician','MEP','Senior',34.00,51.00,'hour',90.00,80.00,'active','2025-10-04 09:25:00','2026-04-02 14:30:00'),
  (:company,'Site Supervisor','Installation','Senior',42.00,63.00,'hour',95.00,90.00,'active','2025-10-04 09:30:00','2026-07-15 09:00:00'),
  (:company,'Draughtsman','Engineering','Mid',26.00,39.00,'hour',87.00,72.00,'inactive','2025-10-04 09:35:00','2026-08-20 16:20:00');

INSERT INTO estimation_equipment_rates
  ("companyId", code, name, description, category, manufacturer, model, currency,
   "hourlyRate", "dailyRate", "weeklyRate", "monthlyRate", "fuelCostPerHour",
   "operatorCostPerHour", "maintenanceCostPerHour", "mobilizationCost",
   "demobilizationCost", "isActive", "supplierName", specifications,
   "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'EQR-DEMO-001','Scissor Lift 19ft','Electric scissor lift for hood and duct installation','Access','Genie','GS-1932','USD',18.00,120.00,540.00,1750.00,NULL,NULL,2.50,180.00,180.00,true,'CityLift Rentals','19ft platform, 227kg capacity','Meera Nair','2025-10-05 09:00:00','2026-02-01 10:00:00'),
  (:company,'EQR-DEMO-002','TIG Welding Set 300A','Site TIG set for SS pipe and counter welding','Welding','Miller','Dynasty 300','USD',9.50,62.00,280.00,900.00,NULL,NULL,1.20,60.00,60.00,true,'ProWeld Hire','300A AC/DC, water-cooled torch','Meera Nair','2025-10-05 09:05:00','2026-02-01 10:00:00'),
  (:company,'EQR-DEMO-003','Plasma Cutter 85A','Plasma cutting of SS sheet on site','Cutting','Hypertherm','Powermax 85','USD',11.00,72.00,320.00,1050.00,NULL,NULL,1.50,60.00,60.00,true,'ProWeld Hire','85A, 25mm cut capacity','Meera Nair','2025-10-05 09:10:00','2025-10-05 09:10:00'),
  (:company,'EQR-DEMO-004','Pickup Crane 3T','Truck-mounted crane for equipment offloading','Lifting','Hiab','X-CL 12','USD',48.00,340.00,1550.00,5200.00,7.50,32.00,4.00,350.00,350.00,true,'Metro Crane Services','3T at 6m reach, incl. rigging gear','Deepak Joshi','2025-10-05 09:15:00','2026-05-12 11:30:00'),
  (:company,'EQR-DEMO-005','Material Hoist 500kg','Goods hoist for multi-floor hotel kitchens','Lifting','Alimak','TPL 500','USD',22.00,150.00,680.00,2200.00,NULL,NULL,3.00,420.00,420.00,true,'CityLift Rentals','500kg, 30m lift height','Deepak Joshi','2025-10-05 09:20:00','2025-10-05 09:20:00'),
  (:company,'EQR-DEMO-006','Sheet Bender 2.5m','Portable press brake for site rework of SS panels','Fabrication','Baileigh','BB-9616','USD',14.00,95.00,430.00,1400.00,NULL,NULL,2.00,120.00,120.00,true,'FabTool Hire','2.5m bed, 16ga SS capacity','Arun Gupta','2025-11-14 10:00:00','2025-11-14 10:00:00'),
  (:company,'EQR-DEMO-007','Pipe Threading Machine','Threading for gas and water reticulation','MEP','RIDGID','300 Compact','USD',7.50,50.00,225.00,720.00,NULL,NULL,1.00,40.00,40.00,true,'FabTool Hire','1/2in to 2in BSPT','Arun Gupta','2025-11-14 10:05:00','2026-03-20 15:00:00'),
  (:company,'EQR-DEMO-008','Floor Grinder','Surface prep before epoxy flooring under equipment','Finishing','Husqvarna','PG 450','USD',13.00,88.00,400.00,1280.00,NULL,NULL,2.20,90.00,90.00,false,'CityLift Rentals','450mm head, dust extraction','Priya Sharma','2026-01-08 09:30:00','2026-08-01 12:00:00');

-- ---------------------------------------------------------------------------
-- Templates & approval workflows
-- ---------------------------------------------------------------------------
INSERT INTO estimation_boq_templates
  ("companyId", name, description, category, "isActive", "isDefault", sections,
   "usageCount", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'Commercial Kitchen Full Fitout','Standard sections for a complete commercial kitchen project','Kitchen Fitout',true,true,
   '[{"sectionNumber":"1","sectionName":"Equipment","description":"Bought-out cooking and refrigeration equipment","items":[{"itemNumber":"1.1","description":"Combi oven","unit":"ea","defaultQuantity":2,"defaultRate":18500},{"itemNumber":"1.2","description":"6-burner range with oven","unit":"ea","defaultQuantity":4,"defaultRate":4200}]},{"sectionNumber":"2","sectionName":"SS Fabrication","description":"Custom stainless steel work","items":[{"itemNumber":"2.1","description":"SS304 work table with undershelf","unit":"m","defaultQuantity":20,"defaultRate":380}]},{"sectionNumber":"3","sectionName":"MEP","description":"Gas, water, drainage, electrical","items":[{"itemNumber":"3.1","description":"Kitchen services reticulation","unit":"lot","defaultQuantity":1,"defaultRate":40000}]},{"sectionNumber":"4","sectionName":"Installation","description":"Installation and commissioning","items":[{"itemNumber":"4.1","description":"Install and commission all equipment","unit":"lot","defaultQuantity":1,"defaultRate":30000}]}]'::json,
   6,'Arun Gupta','2025-10-06 09:00:00','2026-06-10 10:00:00'),
  (:company,'SS Fabrication Package','Counters, tables, shelving and hoods only','SS Fabrication',true,false,
   '[{"sectionNumber":"1","sectionName":"Counters & Tables","description":"SS304 counters and tables","items":[{"itemNumber":"1.1","description":"SS304 counter with splashback","unit":"m","defaultQuantity":12,"defaultRate":420},{"itemNumber":"1.2","description":"Wall shelf SS304","unit":"m","defaultQuantity":10,"defaultRate":95}]},{"sectionNumber":"2","sectionName":"Hoods","description":"Exhaust hoods with filters","items":[{"itemNumber":"2.1","description":"Island hood with baffle filters","unit":"sqm","defaultQuantity":8,"defaultRate":620}]}]'::json,
   4,'Arun Gupta','2025-10-06 09:10:00','2026-04-15 11:00:00'),
  (:company,'MEP Works Package','Gas, water, drainage and electrical for kitchens','MEP',true,false,
   '[{"sectionNumber":"1","sectionName":"Gas","description":"LPG reticulation and manifold","items":[{"itemNumber":"1.1","description":"LPG line with regulators","unit":"point","defaultQuantity":10,"defaultRate":650}]},{"sectionNumber":"2","sectionName":"Water & Drainage","description":"Hot/cold water and floor drains","items":[{"itemNumber":"2.1","description":"Water point hot and cold","unit":"point","defaultQuantity":14,"defaultRate":380},{"itemNumber":"2.2","description":"Floor drain with grease trap connection","unit":"ea","defaultQuantity":8,"defaultRate":540}]}]'::json,
   3,'Deepak Joshi','2025-10-06 09:20:00','2026-02-25 14:30:00'),
  (:company,'Cold Room Installation','Walk-in cold and freezer room supply and install','Refrigeration',true,false,
   '[{"sectionNumber":"1","sectionName":"Cold Rooms","description":"Panels, doors, refrigeration units","items":[{"itemNumber":"1.1","description":"Walk-in cold room 4x3x2.4m","unit":"ea","defaultQuantity":1,"defaultRate":21500},{"itemNumber":"1.2","description":"Walk-in freezer room 3x3x2.4m","unit":"ea","defaultQuantity":1,"defaultRate":26800}]}]'::json,
   2,'Meera Nair','2025-11-20 10:00:00','2026-01-30 09:15:00'),
  (:company,'Servery Counter Package','Front-of-house servery and display counters','Servery',false,false,
   '[{"sectionNumber":"1","sectionName":"Servery","description":"Heated and chilled display counters","items":[{"itemNumber":"1.1","description":"Heated bain-marie counter 1.8m","unit":"ea","defaultQuantity":2,"defaultRate":5600},{"itemNumber":"1.2","description":"Chilled display counter 1.5m","unit":"ea","defaultQuantity":2,"defaultRate":6200}]}]'::json,
   1,'Priya Sharma','2026-02-12 11:00:00','2026-02-12 11:00:00');

INSERT INTO estimation_estimate_templates
  ("companyId", name, description, "templateType", category, "isActive",
   "isDefault", "defaultCurrency", sections, "defaultMarkups", "defaultOverheads",
   "defaultContingencyPercentage", "defaultPaymentTerms", "defaultValidityDays",
   "usageCount", "lastUsedAt", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'Kitchen Fitout — Detailed Estimate','Full material/labor/overhead buildup for kitchen fitout jobs','Cost Estimate','Kitchen Fitout',true,true,'USD',
   '[{"name":"Equipment","costType":"Material"},{"name":"SS Fabrication","costType":"Material"},{"name":"Labor","costType":"Labor"},{"name":"MEP Subcontract","costType":"Subcontractor"},{"name":"Site Overheads","costType":"Overhead"}]'::json,
   '{"Material":18,"Labor":25,"Subcontractor":15,"Equipment":10,"Overhead":12}'::json,
   '{"supervision":5,"siteEstablishment":3,"insurance":1.5}'::json,
   5.00,'[{"milestone":"Advance","percent":30},{"milestone":"Delivery","percent":50},{"milestone":"Commissioning","percent":20}]'::json,
   45,9,'2026-08-20 15:00:00','Arun Gupta','2025-10-07 09:00:00','2026-08-20 15:00:00'),
  (:company,'BOQ Take-off Standard','Section-wise BOQ take-off for fitout tenders','BOQ','Kitchen Fitout',true,false,'USD',
   '[{"name":"Equipment"},{"name":"SS Fabrication"},{"name":"MEP"},{"name":"Installation"}]'::json,
   NULL,NULL,0.00,NULL,30,6,'2026-08-18 10:30:00','Arun Gupta','2025-10-07 09:10:00','2026-08-18 10:30:00'),
  (:company,'Quick Budget Estimate','Preliminary budget figure from historical benchmarks','Cost Estimate','Budgetary',true,false,'USD',
   '[{"name":"Equipment","costType":"Material"},{"name":"Works","costType":"Labor"}]'::json,
   '{"Material":15,"Labor":20}'::json,'{"allInOverhead":10}'::json,
   7.50,NULL,21,4,'2026-09-02 09:45:00','Meera Nair','2025-11-03 10:00:00','2026-09-02 09:45:00'),
  (:company,'Pricing & Margin Worksheet','Cost-to-price conversion with margin scenarios','Pricing','Commercial',true,false,'USD',
   '[{"name":"Cost Summary"},{"name":"Margin Scenarios"},{"name":"Final Price"}]'::json,
   '{"targetMargin":22}'::json,NULL,0.00,
   '[{"milestone":"Advance","percent":40},{"milestone":"Handover","percent":60}]'::json,
   30,3,'2026-06-15 14:20:00','Sanjay Malhotra','2025-12-01 09:30:00','2026-06-15 14:20:00'),
  (:company,'Turnkey Full Estimate','BOQ + cost + pricing in one pass for turnkey bids','Full Estimate','Turnkey',false,false,'USD',
   '[{"name":"BOQ"},{"name":"Cost Buildup"},{"name":"Pricing"}]'::json,
   '{"Material":18,"Labor":25,"Subcontractor":15}'::json,
   '{"supervision":5,"siteEstablishment":3}'::json,
   6.00,NULL,60,1,'2026-03-11 16:00:00','Deepak Joshi','2026-01-20 11:00:00','2026-03-11 16:00:00');

INSERT INTO estimation_approval_workflows
  ("companyId", name, description, "isActive", "isDefault", "entityType", steps,
   conditions, "thresholdAmount", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'Standard BOQ Approval','Single-step review by estimation head for all BOQs',true,true,'BOQ',
   '[{"stepNumber":1,"stepName":"Estimation Head Review","approverRole":"Estimation Head","isRequired":true,"timeoutDays":3}]'::json,
   NULL,NULL,'Arun Gupta','2025-10-08 09:00:00','2025-10-08 09:00:00'),
  (:company,'Cost Estimate Two-Step','Estimation head then commercial manager for standard estimates',true,true,'CostEstimate',
   '[{"stepNumber":1,"stepName":"Estimation Head Review","approverRole":"Estimation Head","isRequired":true,"timeoutDays":2},{"stepNumber":2,"stepName":"Commercial Approval","approverRole":"Commercial Manager","minAmount":0,"maxAmount":500000,"isRequired":true,"timeoutDays":3}]'::json,
   '[{"field":"totalCost","operator":"<=","value":500000,"action":"route"}]'::json,
   100000.00,'Sanjay Malhotra','2025-10-08 09:10:00','2026-02-14 10:20:00'),
  (:company,'High-Value Estimate Review','Adds GM sign-off above 500k',true,false,'CostEstimate',
   '[{"stepNumber":1,"stepName":"Estimation Head Review","approverRole":"Estimation Head","isRequired":true,"timeoutDays":2},{"stepNumber":2,"stepName":"Commercial Approval","approverRole":"Commercial Manager","isRequired":true,"timeoutDays":3},{"stepNumber":3,"stepName":"GM Sign-off","approverRole":"General Manager","minAmount":500000,"isRequired":true,"timeoutDays":5}]'::json,
   '[{"field":"totalCost","operator":">","value":500000,"action":"route"}]'::json,
   500000.00,'Sanjay Malhotra','2025-10-08 09:20:00','2025-10-08 09:20:00'),
  (:company,'Pricing Sign-off','Commercial manager approves final customer pricing',true,true,'Pricing',
   '[{"stepNumber":1,"stepName":"Margin Check","approverRole":"Commercial Manager","isRequired":true,"timeoutDays":2}]'::json,
   '[{"field":"marginPercentage","operator":"<","value":18,"action":"escalate"}]'::json,
   NULL,'Sanjay Malhotra','2025-10-08 09:30:00','2026-05-05 12:00:00'),
  (:company,'Universal Fast-Track','Single approver for small works under 25k',true,false,'All',
   '[{"stepNumber":1,"stepName":"Estimation Head Fast-Track","approverRole":"Estimation Head","maxAmount":25000,"isRequired":true,"timeoutDays":1}]'::json,
   '[{"field":"totalCost","operator":"<=","value":25000,"action":"route"}]'::json,
   25000.00,'Arun Gupta','2026-01-12 10:00:00','2026-01-12 10:00:00');

-- ---------------------------------------------------------------------------
-- BOQs + items (estimatedValue rolled up from items below)
-- ---------------------------------------------------------------------------
INSERT INTO estimation_boqs
  ("boqNumber", "projectName", "clientName", "projectLocation", "projectDuration",
   currency, "estimatedValue", notes, status, "createdAt", "updatedAt")
VALUES
  ('BOQ-DEMO-2025-001','Blue Fig Hotels — Flagship Kitchen Fitout','Blue Fig Hotels Group','New York, NY','16 weeks','USD',0,'Full back-of-house fitout for flagship property','Approved'::estimation_boqs_status_enum,'2025-10-08 10:00:00','2025-10-20 16:30:00'),
  ('BOQ-DEMO-2025-002','Harbour Grill — Central Production Kitchen','Harbour Grill Restaurants','San Francisco, CA','12 weeks','USD',0,'Central production kitchen serving two flagship sites','Approved'::estimation_boqs_status_enum,'2025-11-12 09:30:00','2025-11-25 14:00:00'),
  ('BOQ-DEMO-2025-003','Metro Hospital — Dietary Kitchen Upgrade','Metro Hospital Kitchens','Chicago, IL','20 weeks','USD',0,'Phased upgrade; hospital kitchen must stay live during works','Under Review'::estimation_boqs_status_enum,'2025-12-15 11:00:00','2026-01-08 10:15:00'),
  ('BOQ-DEMO-2026-004','Golden Spoon — Franchise Store Package','Golden Spoon Franchises','Phoenix, AZ','8 weeks','USD',0,'Repeatable store package; basis for franchise rollout pricing','Approved'::estimation_boqs_status_enum,'2026-02-10 09:00:00','2026-02-21 15:45:00'),
  ('BOQ-DEMO-2026-005','Campus Dining — Servery Refresh','Campus Dining Co-op','Boston, MA','10 weeks','USD',0,'Rejected by client committee; scope to be re-tendered smaller','Rejected'::estimation_boqs_status_enum,'2026-04-22 10:30:00','2026-05-14 09:20:00'),
  ('BOQ-DEMO-2026-006','Lakeside Resort — Banquet Kitchen Expansion','Lakeside Resort & Spa','Miami, FL','14 weeks','USD',0,'Draft take-off from site survey 2026-08-12','Draft'::estimation_boqs_status_enum,'2026-08-18 14:00:00','2026-09-05 11:10:00');

INSERT INTO estimation_boq_items
  ("boqId", "itemNo", description, unit, quantity, "unitRate", "totalAmount",
   specifications, category)
SELECT b.id, v.itemno, v.descr, v.unit, v.qty, v.rate,
       round((v.qty * v.rate)::numeric, 2), v.spec, v.cat
FROM (VALUES
  -- BOQ-DEMO-2025-001 — Blue Fig flagship
  ('BOQ-DEMO-2025-001','1.1','Combi oven 20-tray electric','ea',4,18500,'3-phase, boiler type, incl. hood connection','Equipment'),
  ('BOQ-DEMO-2025-001','1.2','6-burner gas range with oven','ea',6,4200,'SS304 body, pilot ignition','Equipment'),
  ('BOQ-DEMO-2025-001','1.3','Walk-in cold room 4x3x2.4m','ea',2,21500,'100mm PUF panels, remote condensing unit','Equipment'),
  ('BOQ-DEMO-2025-001','2.1','SS304 work table with undershelf','m',42,380,'1.2mm top, 40x40 legs','SS Fabrication'),
  ('BOQ-DEMO-2025-001','2.2','Exhaust hood with baffle filters','sqm',28,620,'SS304, integral lighting, fire-rated','SS Fabrication'),
  ('BOQ-DEMO-2025-001','3.1','Kitchen gas, water and drainage reticulation','lot',1,48000,'Incl. grease trap connection and test certificates','MEP'),
  ('BOQ-DEMO-2025-001','4.1','Installation and commissioning — all equipment','lot',1,36500,'Incl. alignment, start-up and operator training','Installation'),
  -- BOQ-DEMO-2025-002 — Harbour Grill CPU
  ('BOQ-DEMO-2025-002','1.1','Combi oven 10-tray electric','ea',2,12800,'Boilerless, 3-phase','Equipment'),
  ('BOQ-DEMO-2025-002','1.2','Blast chiller 50kg','ea',2,9800,'Roll-in trolley compatible','Equipment'),
  ('BOQ-DEMO-2025-002','1.3','Cook-chill kettle 200L','ea',1,24500,'Steam jacketed, agitator','Equipment'),
  ('BOQ-DEMO-2025-002','2.1','SS304 prep counters with sinks','m',26,450,'Incl. 2 double-bowl sinks','SS Fabrication'),
  ('BOQ-DEMO-2025-002','3.1','MEP services for production line','lot',1,32000,'Steam, water, drainage, power','MEP'),
  ('BOQ-DEMO-2025-002','4.1','Installation and commissioning','lot',1,21500,'Incl. HACCP layout verification','Installation'),
  -- BOQ-DEMO-2025-003 — Metro Hospital
  ('BOQ-DEMO-2025-003','1.1','Bulk cooking kettles 150L','ea',3,19800,'Tilting, steam jacketed','Equipment'),
  ('BOQ-DEMO-2025-003','1.2','Conveyor dishwasher 200 racks/hr','ea',1,38500,'Rack conveyor with heat recovery','Equipment'),
  ('BOQ-DEMO-2025-003','1.3','Tray-line conveyor 12m','ea',1,27500,'Variable speed, SS304','Equipment'),
  ('BOQ-DEMO-2025-003','2.1','SS304 tray assembly counters','m',18,520,'Refrigerated wells, sneeze guards','SS Fabrication'),
  ('BOQ-DEMO-2025-003','3.1','Phased MEP diversion works','lot',1,56000,'Night-shift working, live hospital kitchen','MEP'),
  ('BOQ-DEMO-2025-003','4.1','Phased installation over 4 stages','lot',1,44000,'Temporary partitions and dust control','Installation'),
  -- BOQ-DEMO-2026-004 — Golden Spoon store package
  ('BOQ-DEMO-2026-004','1.1','Griddle 900mm gas','ea',2,3400,'Chrome plate, splash guard','Equipment'),
  ('BOQ-DEMO-2026-004','1.2','Twin-basket fryer','ea',2,2900,'Gas, filtration ready','Equipment'),
  ('BOQ-DEMO-2026-004','1.3','Undercounter chiller 3-door','ea',3,3100,'GN compatible','Equipment'),
  ('BOQ-DEMO-2026-004','2.1','SS304 counter run with splashback','m',14,420,'Franchise standard profile','SS Fabrication'),
  ('BOQ-DEMO-2026-004','3.1','Store MEP package','lot',1,14500,'Gas, water, power, extract','MEP'),
  ('BOQ-DEMO-2026-004','4.1','Installation and store commissioning','lot',1,8800,'3-day install window per store','Installation'),
  -- BOQ-DEMO-2026-005 — Campus Dining servery
  ('BOQ-DEMO-2026-005','1.1','Heated bain-marie counter 1.8m','ea',3,5600,'Wet heat, glass gantry','Equipment'),
  ('BOQ-DEMO-2026-005','1.2','Chilled display counter 1.5m','ea',3,6200,'Ventilated, front glass','Equipment'),
  ('BOQ-DEMO-2026-005','2.1','SS304 servery counters and tray rails','m',22,480,'Solid surface top over SS carcass','SS Fabrication'),
  ('BOQ-DEMO-2026-005','3.1','Servery power and drainage modifications','lot',1,12800,'Weekend working only','MEP'),
  ('BOQ-DEMO-2026-005','4.1','Installation during semester break','lot',1,9500,'10-day window','Installation'),
  -- BOQ-DEMO-2026-006 — Lakeside banquet kitchen
  ('BOQ-DEMO-2026-006','1.1','Combi oven 40-tray roll-in','ea',2,29500,'Banquet trolley system','Equipment'),
  ('BOQ-DEMO-2026-006','1.2','Banquet holding trolleys','ea',6,4800,'Heated, roll-in','Equipment'),
  ('BOQ-DEMO-2026-006','1.3','Walk-in freezer room 4x3x2.4m','ea',1,26800,'120mm PUF panels, floor insulated','Equipment'),
  ('BOQ-DEMO-2026-006','2.1','SS304 banquet plating counters','m',30,460,'Heated cupboards under','SS Fabrication'),
  ('BOQ-DEMO-2026-006','2.2','Island exhaust hood','sqm',22,650,'UV filtration option priced separately','SS Fabrication'),
  ('BOQ-DEMO-2026-006','3.1','Banquet kitchen MEP extension','lot',1,38000,'Tie-in to resort central plant','MEP'),
  ('BOQ-DEMO-2026-006','4.1','Installation and commissioning','lot',1,26500,'Resort operational; night moves','Installation')
) AS v(boqno, itemno, descr, unit, qty, rate, spec, cat)
JOIN estimation_boqs b ON b."boqNumber" = v.boqno;

-- Roll item totals up into BOQ headers
UPDATE estimation_boqs b
SET "estimatedValue" = s.total
FROM (SELECT "boqId", sum("totalAmount") AS total
      FROM estimation_boq_items GROUP BY "boqId") s
WHERE s."boqId" = b.id AND b."boqNumber" LIKE 'BOQ-DEMO-%';

-- ---------------------------------------------------------------------------
-- Cost estimates + items. Headers start at 0; component costs, direct/indirect
-- split, contingency and total are rolled up from items afterwards.
-- ---------------------------------------------------------------------------
INSERT INTO estimation_cost_estimates
  ("companyId", "estimateNumber", title, description, "boqId", "projectId",
   "customerId", "customerName", "estimateType", status, version,
   currency, "contingencyPercentage", "estimateDate", "validUntil",
   "expectedStartDate", "expectedEndDate", "submittedBy", "submittedAt",
   "approvedBy", "approvedAt", "approvalNotes", "createdBy", "updatedBy",
   "createdAt", "updatedAt")
SELECT
  :company, v.eno, v.title, v.descr, bq.id, p.id::text,
  c.id::text, v.custname,
  v.etype::estimation_cost_estimates_estimatetype_enum,
  v.status::estimation_cost_estimates_status_enum, v.ver,
  'USD', v.contpct, v.edate::date, v.valid::date,
  v.startd::date, v.endd::date, v.subby, v.subat::timestamp,
  v.appby, v.appat::timestamp, v.appnotes, v.createdby, v.createdby,
  v.cts::timestamp, v.uts::timestamp
FROM (VALUES
  ('EST-DEMO-2025-001','Blue Fig Flagship Kitchen — Detailed Estimate','Detailed cost buildup against BOQ-DEMO-2025-001','BOQ-DEMO-2025-001','Blue Fig Hotels Group','Industrial Kitchen 2026','Detailed','Converted to Order',2,5.00,'2025-10-14','2025-11-30','2026-01-05','2026-04-24','Arun Gupta','2025-10-16 11:00:00','Sanjay Malhotra','2025-10-20 15:30:00','Approved at revised rates; convert on customer PO','Arun Gupta','2025-10-14 09:30:00','2025-10-21 10:00:00'),
  ('EST-DEMO-2025-002','Harbour Grill CPU — Detailed Estimate','Central production kitchen cost estimate','BOQ-DEMO-2025-002','Harbour Grill Restaurants',NULL,'Detailed','Converted to Order',2,5.00,'2025-11-18','2025-12-31','2026-02-02','2026-04-24','Arun Gupta','2025-11-20 10:30:00','Sanjay Malhotra','2025-11-25 14:00:00','Margin acceptable after labor re-take-off','Arun Gupta','2025-11-18 09:00:00','2025-11-26 09:45:00'),
  ('EST-DEMO-2025-003','Metro Hospital Dietary Kitchen — Preliminary','Phased upgrade; preliminary while MEP survey completes','BOQ-DEMO-2025-003','Metro Hospital Kitchens',NULL,'Preliminary','Pending Approval',2,7.50,'2025-12-18','2026-02-28','2026-05-04','2026-09-18','Meera Nair','2026-01-09 16:00:00',NULL,NULL,NULL,'Meera Nair','2025-12-18 10:00:00','2026-01-09 16:00:00'),
  ('EST-DEMO-2026-004','Golden Spoon Store Package — Final Estimate','Per-store franchise package; basis for rollout pricing','BOQ-DEMO-2026-004','Golden Spoon Franchises',NULL,'Final','Approved',2,4.00,'2026-02-14','2026-03-31','2026-04-06','2026-05-29','Deepak Joshi','2026-02-17 09:30:00','Sanjay Malhotra','2026-02-21 15:00:00','Locked as franchise standard cost','Deepak Joshi','2026-02-14 09:00:00','2026-02-21 15:10:00'),
  ('EST-DEMO-2026-005','Campus Dining Servery — Detailed Estimate','Servery refresh; lost to budget cut','BOQ-DEMO-2026-005','Campus Dining Co-op',NULL,'Detailed','Rejected',1,5.00,'2026-04-28','2026-06-15','2026-06-22','2026-08-28','Priya Sharma','2026-04-30 11:00:00',NULL,NULL,'Client committee rejected; over allocated budget','Priya Sharma','2026-04-28 09:30:00','2026-05-14 09:20:00'),
  ('EST-DEMO-2026-006','Lakeside Banquet Kitchen — Preliminary','Draft buildup from site survey; awaiting resort capex window','BOQ-DEMO-2026-006','Lakeside Resort & Spa',NULL,'Preliminary','Draft',2,6.00,'2026-08-20','2026-10-15','2026-11-02','2027-02-05',NULL,NULL,NULL,NULL,NULL,'Meera Nair','2026-08-20 10:00:00','2026-09-05 11:15:00'),
  ('EST-DEMO-2026-007','Summit Catering Commissary — Budget Estimate','Budgetary figure requested for board approval',NULL,'Summit Catering Services',NULL,'Preliminary','Draft',1,5.00,'2026-09-02','2026-10-02','2026-11-16','2027-01-29',NULL,NULL,NULL,NULL,NULL,'Priya Sharma','2026-09-02 09:00:00','2026-09-08 14:30:00'),
  ('EST-DEMO-2026-008','Riverside Bistro Rollout — Concept Estimate','Revised concept estimate for 3-store rollout',NULL,'Riverside Bistro Chain',NULL,'Revised','Approved',1,3.50,'2026-06-10','2026-07-31','2026-08-10','2026-09-30','Deepak Joshi','2026-06-12 10:00:00','Sanjay Malhotra','2026-06-18 11:30:00','Approved for customer proposal','Deepak Joshi','2026-06-10 09:00:00','2026-06-18 11:35:00')
) AS v(eno, title, descr, boqno, custname, projname, etype, status, ver,
       contpct, edate, valid, startd, endd, subby, subat, appby, appat,
       appnotes, createdby, cts, uts)
LEFT JOIN estimation_boqs bq ON bq."boqNumber" = v.boqno
LEFT JOIN crm_customers c ON c."customerName" = v.custname
LEFT JOIN projects p ON p.name = v.projname;

INSERT INTO estimation_cost_estimate_items
  ("costEstimateId", "itemNumber", description, category, "costType", unit,
   quantity, "unitCost", "totalCost", notes, "createdAt")
SELECT e.id, v.itemno, v.descr, v.cat, v.ctype, v.unit, v.qty, v.ucost,
       round((v.qty * v.ucost)::numeric, 2), v.note, e."createdAt"
FROM (VALUES
  -- EST-DEMO-2025-001 (Blue Fig)
  ('EST-DEMO-2025-001','1','Cooking and refrigeration equipment package','Equipment','Material','lot',1,185000,'Supplier quotes: combi ovens, ranges, cold rooms'),
  ('EST-DEMO-2025-001','2','SS304 sheet, sections and consumables','SS Fabrication','Material','kg',3800,6.50,'Tables, hoods, shelving fabrication material'),
  ('EST-DEMO-2025-001','3','Fabrication and installation labor','Installation','Labor','hour',1450,32,'Shop fabrication + 16-week site crew'),
  ('EST-DEMO-2025-001','4','MEP subcontract works','MEP','Subcontractor','lot',1,52000,'Gas, water, drainage, extract tie-ins'),
  ('EST-DEMO-2025-001','5','Crane, lift and site plant rental','Site Equipment','Equipment','day',12,650,'Hoist + scissor lift for hood install'),
  ('EST-DEMO-2025-001','6','Site overheads and supervision','Overheads','Overhead','month',4,8500,'Supervisor, site establishment, insurances'),
  -- EST-DEMO-2025-002 (Harbour Grill)
  ('EST-DEMO-2025-002','1','Production equipment package','Equipment','Material','lot',1,88000,'Combi ovens, blast chillers, kettle'),
  ('EST-DEMO-2025-002','2','SS304 material for prep counters','SS Fabrication','Material','kg',2100,6.50,'Counters with integral sinks'),
  ('EST-DEMO-2025-002','3','Fabrication and installation labor','Installation','Labor','hour',920,32,'12-week program'),
  ('EST-DEMO-2025-002','4','MEP subcontract works','MEP','Subcontractor','lot',1,34500,'Steam, water, drainage, power'),
  ('EST-DEMO-2025-002','5','Site overheads and supervision','Overheads','Overhead','month',3,7800,'Supervisor and site costs'),
  -- EST-DEMO-2025-003 (Metro Hospital)
  ('EST-DEMO-2025-003','1','Bulk cooking and warewash equipment','Equipment','Material','lot',1,142000,'Kettles, conveyor dishwasher, tray line'),
  ('EST-DEMO-2025-003','2','SS304 material for tray-line counters','SS Fabrication','Material','kg',1600,6.80,'Refrigerated wells, sneeze guards'),
  ('EST-DEMO-2025-003','3','Phased installation labor (night shifts)','Installation','Labor','hour',1850,38,'Night-shift premium included'),
  ('EST-DEMO-2025-003','4','Phased MEP diversion subcontract','MEP','Subcontractor','lot',1,61000,'Live hospital kitchen; 4 stages'),
  ('EST-DEMO-2025-003','5','Site overheads, hoarding and dust control','Overheads','Overhead','month',5,9200,'Temporary partitions, infection control'),
  -- EST-DEMO-2026-004 (Golden Spoon)
  ('EST-DEMO-2026-004','1','Store equipment package','Equipment','Material','lot',1,24800,'Griddles, fryers, undercounter chillers'),
  ('EST-DEMO-2026-004','2','SS304 material for counter run','SS Fabrication','Material','kg',520,6.50,'Franchise standard profile'),
  ('EST-DEMO-2026-004','3','Installation labor (3-day window)','Installation','Labor','hour',220,30,'2 crews x 3 days + commissioning'),
  ('EST-DEMO-2026-004','4','Store MEP subcontract','MEP','Subcontractor','lot',1,15200,'Gas, water, power, extract'),
  ('EST-DEMO-2026-004','5','Project overheads (per store)','Overheads','Overhead','lot',1,4200,'PM allocation and logistics'),
  -- EST-DEMO-2026-005 (Campus Dining)
  ('EST-DEMO-2026-005','1','Servery display equipment','Equipment','Material','lot',1,36200,'Bain-marie and chilled counters'),
  ('EST-DEMO-2026-005','2','SS304 and solid surface material','SS Fabrication','Material','kg',780,7.20,'Solid surface tops over SS carcass'),
  ('EST-DEMO-2026-005','3','Installation labor (semester break)','Installation','Labor','hour',360,30,'10-day window, single crew'),
  ('EST-DEMO-2026-005','4','Power and drainage modifications','MEP','Subcontractor','lot',1,13600,'Weekend working only'),
  ('EST-DEMO-2026-005','5','Site overheads','Overheads','Overhead','lot',1,5400,'Supervision and protection'),
  -- EST-DEMO-2026-006 (Lakeside)
  ('EST-DEMO-2026-006','1','Banquet equipment package','Equipment','Material','lot',1,118000,'Roll-in combis, holding trolleys, freezer room'),
  ('EST-DEMO-2026-006','2','SS304 material for plating counters and hood','SS Fabrication','Material','kg',2900,6.60,'Heated cupboards, island hood'),
  ('EST-DEMO-2026-006','3','Installation labor (night moves)','Installation','Labor','hour',1240,34,'Resort operational; premium rates'),
  ('EST-DEMO-2026-006','4','MEP extension subcontract','MEP','Subcontractor','lot',1,41000,'Tie-in to resort central plant'),
  ('EST-DEMO-2026-006','5','Hoist and access equipment rental','Site Equipment','Equipment','day',18,420,'Material hoist for service floor'),
  ('EST-DEMO-2026-006','6','Site overheads and supervision','Overheads','Overhead','month',4,7600,'Supervisor plus resort compliance'),
  -- EST-DEMO-2026-007 (Summit Catering, budgetary)
  ('EST-DEMO-2026-007','1','Commissary equipment allowance','Equipment','Material','lot',1,96000,'Benchmark rate: mid-size commissary'),
  ('EST-DEMO-2026-007','2','SS fabrication allowance','SS Fabrication','Material','lot',1,28500,'Benchmark USD/m applied to layout'),
  ('EST-DEMO-2026-007','3','Installation labor allowance','Installation','Labor','hour',760,31,'From historical hours per equipment item'),
  ('EST-DEMO-2026-007','4','MEP allowance','MEP','Subcontractor','lot',1,26000,'Benchmark percentage of equipment'),
  ('EST-DEMO-2026-007','5','Overheads allowance','Overheads','Overhead','lot',1,12500,'10 percent all-in'),
  -- EST-DEMO-2026-008 (Riverside Bistro, 3 stores)
  ('EST-DEMO-2026-008','1','Equipment package x3 stores','Equipment','Material','lot',3,21500,'Compact bistro line per store'),
  ('EST-DEMO-2026-008','2','SS fabrication material x3 stores','SS Fabrication','Material','kg',1050,6.50,'Counter runs and shelving'),
  ('EST-DEMO-2026-008','3','Installation labor x3 stores','Installation','Labor','hour',540,30,'Rolling crew, one store at a time'),
  ('EST-DEMO-2026-008','4','MEP subcontract x3 stores','MEP','Subcontractor','lot',3,9800,'Standardized store MEP kit'),
  ('EST-DEMO-2026-008','5','Rollout overheads','Overheads','Overhead','lot',1,9600,'Shared PM and logistics across stores')
) AS v(eno, itemno, descr, cat, ctype, unit, qty, ucost, note)
JOIN estimation_cost_estimates e
  ON e."estimateNumber" = v.eno AND e."companyId" = :company;

-- Roll item totals up into estimate headers (buildup + contingency = total)
UPDATE estimation_cost_estimates e
SET "materialCost"      = s.mat,
    "laborCost"         = s.lab,
    "overheadCost"      = s.ovh,
    "equipmentCost"     = s.eqp,
    "subcontractorCost" = s.sub,
    "directCost"        = s.mat + s.lab + s.eqp + s.sub,
    "indirectCost"      = s.ovh,
    "contingency"       = round((s.mat + s.lab + s.eqp + s.sub + s.ovh) * e."contingencyPercentage" / 100, 2),
    "totalCost"         = s.mat + s.lab + s.eqp + s.sub + s.ovh
                          + round((s.mat + s.lab + s.eqp + s.sub + s.ovh) * e."contingencyPercentage" / 100, 2)
FROM (SELECT "costEstimateId",
             coalesce(sum("totalCost") FILTER (WHERE "costType" = 'Material'), 0)      AS mat,
             coalesce(sum("totalCost") FILTER (WHERE "costType" = 'Labor'), 0)         AS lab,
             coalesce(sum("totalCost") FILTER (WHERE "costType" = 'Overhead'), 0)      AS ovh,
             coalesce(sum("totalCost") FILTER (WHERE "costType" = 'Equipment'), 0)     AS eqp,
             coalesce(sum("totalCost") FILTER (WHERE "costType" = 'Subcontractor'), 0) AS sub
      FROM estimation_cost_estimate_items GROUP BY "costEstimateId") s
WHERE s."costEstimateId" = e.id AND e."companyId" = :company;

-- ---------------------------------------------------------------------------
-- Estimate versions: v1 (initial, ~94% of final) and v2 (current total) for
-- the five estimates that carry version = 2.
-- ---------------------------------------------------------------------------
INSERT INTO estimation_estimate_versions
  ("companyId", "estimateId", "estimateType", "versionNumber",
   "changeDescription", snapshot, "changedFields", "previousTotal", "newTotal",
   "changePercentage", "createdBy", "createdByName", "createdAt")
SELECT :company, e.id::text, 'CostEstimate', 1,
       'Initial estimate drafted from BOQ take-off',
       json_build_object('estimateNumber', e."estimateNumber", 'title', e.title,
                         'totalCost', round(e."totalCost" * 0.94, 2)),
       NULL, NULL, round(e."totalCost" * 0.94, 2), NULL,
       e."createdBy", e."createdBy", e."createdAt"
FROM estimation_cost_estimates e
WHERE e."companyId" = :company AND e.version = 2
  AND e."estimateNumber" LIKE 'EST-DEMO-%';

INSERT INTO estimation_estimate_versions
  ("companyId", "estimateId", "estimateType", "versionNumber",
   "changeDescription", snapshot, "changedFields", "previousTotal", "newTotal",
   "changePercentage", "createdBy", "createdByName", "createdAt")
SELECT :company, e.id::text, 'CostEstimate', 2,
       'Revised rates after supplier quotes and labor re-take-off',
       json_build_object('estimateNumber', e."estimateNumber", 'title', e.title,
                         'totalCost', e."totalCost"),
       json_build_array(json_build_object(
         'field', 'totalCost',
         'previousValue', round(e."totalCost" * 0.94, 2),
         'newValue', e."totalCost")),
       round(e."totalCost" * 0.94, 2), e."totalCost",
       round((e."totalCost" - round(e."totalCost" * 0.94, 2))
             / round(e."totalCost" * 0.94, 2) * 100, 2),
       e."createdBy", e."createdBy", e."createdAt" + interval '7 days'
FROM estimation_cost_estimates e
WHERE e."companyId" = :company AND e.version = 2
  AND e."estimateNumber" LIKE 'EST-DEMO-%';

-- ---------------------------------------------------------------------------
-- Comments on estimates
-- ---------------------------------------------------------------------------
INSERT INTO estimation_comments
  ("companyId", "estimateId", "authorId", "authorName", message, "commentType",
   "createdAt", "updatedAt")
SELECT :company, e.id::text, emp.id::text,
       emp."firstName" || ' ' || emp."lastName", v.msg, v.ctype,
       v.cts::timestamp, v.cts::timestamp
FROM (VALUES
  ('EST-DEMO-2025-001','Sanjay','Malhotra','Material markup looks thin on the cold rooms — confirm supplier quote validity before I approve.','question','2025-10-17 10:15:00'),
  ('EST-DEMO-2025-001','Arun','Gupta','Cold room quote reconfirmed for 60 days; labor re-take-off added 6 percent. Revised to v2.','revision','2025-10-18 14:40:00'),
  ('EST-DEMO-2025-001','Sanjay','Malhotra','Approved at revised rates. Convert on receipt of customer PO.','approval','2025-10-20 15:30:00'),
  ('EST-DEMO-2025-002','Sanjay','Malhotra','Approved — margin acceptable after labor correction.','approval','2025-11-25 14:00:00'),
  ('EST-DEMO-2025-003','Meera','Nair','MEP survey found asbestos lagging in riser; phased diversion cost raised, contingency held at 7.5 percent.','comment','2026-01-08 09:50:00'),
  ('EST-DEMO-2025-003','Sanjay','Malhotra','Hold approval until hospital confirms stage-2 shutdown dates.','comment','2026-01-12 11:20:00'),
  ('EST-DEMO-2026-004','Deepak','Joshi','This becomes the franchise standard cost — do not edit without commercial sign-off.','comment','2026-02-21 15:20:00'),
  ('EST-DEMO-2026-005','Priya','Sharma','Client committee rejected on budget; propose descoped servery-only option next term.','comment','2026-05-14 09:25:00'),
  ('EST-DEMO-2026-006','Meera','Nair','Night-move labor premium included at 34/hr; recheck once resort confirms working windows.','comment','2026-09-05 11:20:00'),
  ('EST-DEMO-2026-008','Sanjay','Malhotra','Approved for proposal — rollout overheads shared across 3 stores keeps unit cost competitive.','approval','2026-06-18 11:30:00')
) AS v(eno, fn, ln, msg, ctype, cts)
JOIN estimation_cost_estimates e
  ON e."estimateNumber" = v.eno AND e."companyId" = :company
JOIN hr_employees emp
  ON emp."firstName" = v.fn AND emp."lastName" = v.ln;

-- ---------------------------------------------------------------------------
-- BOM import sessions
-- ---------------------------------------------------------------------------
INSERT INTO estimation_bom_import_sessions
  ("companyId", "estimateId", "fileName", status, "rowCount", rows, errors,
   "totalValue", "createdAt")
SELECT :company, e.id::text, v.fname, v.status, v.rcount,
       v.rws::jsonb, v.errs::jsonb, v.tval, v.cts::timestamp
FROM (VALUES
  ('EST-DEMO-2025-001','bluefig-flagship-bom-v2.xlsx','completed',3,
   '[{"itemCode":"CMB-20T","description":"Combi oven 20-tray","qty":4,"unitCost":18500},{"itemCode":"RNG-6B","description":"6-burner range","qty":6,"unitCost":4200},{"itemCode":"CLR-4X3","description":"Walk-in cold room","qty":2,"unitCost":21500}]',
   '[]',142200.00,'2025-10-14 10:20:00'),
  ('EST-DEMO-2025-002','harbourgrill-cpu-bom.xlsx','completed',3,
   '[{"itemCode":"CMB-10T","description":"Combi oven 10-tray","qty":2,"unitCost":12800},{"itemCode":"BLC-50","description":"Blast chiller 50kg","qty":2,"unitCost":9800},{"itemCode":"KTL-200","description":"Cook-chill kettle 200L","qty":1,"unitCost":24500}]',
   '[]',69700.00,'2025-11-18 09:40:00'),
  ('EST-DEMO-2025-003','metro-hospital-equipment-list.csv','completed',3,
   '[{"itemCode":"KTL-150T","description":"Tilting kettle 150L","qty":3,"unitCost":19800},{"itemCode":"DW-C200","description":"Conveyor dishwasher","qty":1,"unitCost":38500},{"itemCode":"TLC-12","description":"Tray-line conveyor 12m","qty":1,"unitCost":27500}]',
   '[]',125400.00,'2025-12-18 10:30:00'),
  ('EST-DEMO-2026-004','goldenspoon-store-package.xlsx','completed',3,
   '[{"itemCode":"GRD-900","description":"Griddle 900mm","qty":2,"unitCost":3400},{"itemCode":"FRY-2B","description":"Twin-basket fryer","qty":2,"unitCost":2900},{"itemCode":"UCC-3D","description":"Undercounter chiller 3-door","qty":3,"unitCost":3100}]',
   '[]',21900.00,'2026-02-14 09:20:00'),
  ('EST-DEMO-2026-006','lakeside-banquet-bom-draft.xlsx','failed',0,
   '[]',
   '[{"row":4,"message":"Missing unit cost for item BQT-TRL"},{"row":9,"message":"Unknown unit code EA/SET"}]',
   0.00,'2026-08-20 10:25:00'),
  ('EST-DEMO-2026-006','lakeside-banquet-bom-rev1.xlsx','completed',3,
   '[{"itemCode":"CMB-40R","description":"Combi oven 40-tray roll-in","qty":2,"unitCost":29500},{"itemCode":"BQT-TRL","description":"Banquet holding trolley","qty":6,"unitCost":4800},{"itemCode":"FRZ-4X3","description":"Walk-in freezer room","qty":1,"unitCost":26800}]',
   '[]',114600.00,'2026-08-21 09:10:00')
) AS v(eno, fname, status, rcount, rws, errs, tval, cts)
JOIN estimation_cost_estimates e
  ON e."estimateNumber" = v.eno AND e."companyId" = :company;

-- ---------------------------------------------------------------------------
-- Accuracy records: estimated vs actual (variances computed, +/-5..15%).
-- First 3 reference live EST-DEMO estimates; last 3 are pre-system historical
-- projects (estimateId falls back to the estimate number string — no FK).
-- ---------------------------------------------------------------------------
INSERT INTO estimation_accuracy_records
  ("companyId", "estimateId", "estimateNumber", "projectId", "projectName",
   currency, "estimatedMaterialCost", "estimatedLaborCost",
   "estimatedOverheadCost", "estimatedTotalCost", "actualMaterialCost",
   "actualLaborCost", "actualOverheadCost", "actualTotalCost",
   "materialVariance", "materialVariancePercentage", "laborVariance",
   "laborVariancePercentage", "overheadVariance", "overheadVariancePercentage",
   "totalVariance", "totalVariancePercentage", "accuracyScore",
   "varianceReasons", "estimatorId", "estimatorName", "estimateDate",
   "projectCompletionDate", "createdBy", "createdAt", "updatedAt")
SELECT :company,
       coalesce(ce.id::text, v.eno), v.eno, p.id::text, v.projname, 'USD',
       v.em, v.el, v.eo, v.em + v.el + v.eo,
       v.am, v.al, v.ao, v.am + v.al + v.ao,
       v.am - v.em, round(((v.am - v.em) / v.em * 100)::numeric, 2),
       v.al - v.el, round(((v.al - v.el) / v.el * 100)::numeric, 2),
       v.ao - v.eo, round(((v.ao - v.eo) / v.eo * 100)::numeric, 2),
       (v.am + v.al + v.ao) - (v.em + v.el + v.eo),
       round((((v.am + v.al + v.ao) - (v.em + v.el + v.eo))
              / (v.em + v.el + v.eo) * 100)::numeric, 2),
       round((100 - abs(((v.am + v.al + v.ao) - (v.em + v.el + v.eo))
              / (v.em + v.el + v.eo) * 100))::numeric, 2),
       v.reasons::json,
       emp.id::text, emp."firstName" || ' ' || emp."lastName",
       v.edate::date, v.cdate::date, 'Sanjay Malhotra',
       v.cdate::timestamp + interval '10 days',
       v.cdate::timestamp + interval '10 days'
FROM (VALUES
  ('EST-DEMO-2025-001','Industrial Kitchen 2026',234700.00,46400.00,34000.00,251200.00,50900.00,35600.00,
   '[{"category":"Material","reason":"SS sheet price increase on reorder","amount":9800,"preventable":false},{"category":"Labor","reason":"Hood install rework after duct clash","amount":4500,"preventable":true}]',
   'Arun','Gupta','2025-10-14','2026-04-30'),
  ('EST-DEMO-2025-002','Industrial Kitchen 2026',136150.00,29440.00,23400.00,128300.00,31200.00,22100.00,
   '[{"category":"Material","reason":"Kettle supplier discount at PO stage","amount":-6200,"preventable":false}]',
   'Arun','Gupta','2025-11-18','2026-05-08'),
  ('EST-DEMO-2026-008','Automation Line Upgrade',100725.00,16200.00,9600.00,108400.00,18100.00,10400.00,
   '[{"category":"Material","reason":"Store 3 layout change added counter run","amount":5100,"preventable":true},{"category":"Labor","reason":"Crew idle time between store handovers","amount":1900,"preventable":true}]',
   'Deepak','Joshi','2026-06-10','2026-09-04'),
  ('EST-DEMO-2024-H01','Solar Panel Array Installation',82000.00,24000.00,11000.00,88600.00,27400.00,11900.00,
   '[{"category":"Labor","reason":"Roof access constraints extended program","amount":3400,"preventable":false}]',
   'Meera','Nair','2025-02-10','2025-08-22'),
  ('EST-DEMO-2024-H02','Industrial Kitchen 2026',148000.00,38500.00,17800.00,141200.00,36100.00,16900.00,
   '[{"category":"Material","reason":"Negotiated equipment package discount","amount":-6800,"preventable":false}]',
   'Arun','Gupta','2025-04-15','2025-11-28'),
  ('EST-DEMO-2024-H03','Automation Line Upgrade',64500.00,21000.00,8200.00,71800.00,24600.00,9300.00,
   '[{"category":"Material","reason":"Controls scope grew after client audit","amount":7300,"preventable":true},{"category":"Labor","reason":"Overtime to hold handover date","amount":3600,"preventable":true}]',
   'Deepak','Joshi','2025-06-20','2026-01-16')
) AS v(eno, projname, em, el, eo, am, al, ao, reasons, fn, ln, edate, cdate)
LEFT JOIN estimation_cost_estimates ce
  ON ce."estimateNumber" = v.eno AND ce."companyId" = :company
JOIN projects p ON p.name = v.projname
JOIN hr_employees emp ON emp."firstName" = v.fn AND emp."lastName" = v.ln;

-- ---------------------------------------------------------------------------
-- Estimator performance (monthly; winRate computed from won/total)
-- ---------------------------------------------------------------------------
INSERT INTO estimation_estimator_performance
  ("companyId", "estimatorId", "estimatorName", year, month, "totalEstimates",
   "wonEstimates", "lostEstimates", "winRate", "totalEstimatedValue",
   "totalWonValue", "averageAccuracy", "averageMargin", "averageTurnaroundDays",
   "categoryBreakdown", "monthlyTrend", "createdAt", "updatedAt")
SELECT :company, emp.id::text, emp."firstName" || ' ' || emp."lastName",
       v.yr, v.mo, v.total, v.won, v.lost,
       round((v.won::numeric / v.total) * 100, 2),
       v.estval, v.wonval, v.acc, v.marg, v.tat,
       v.catbrk::json, NULL,
       make_date(v.yr, v.mo, 28)::timestamp + interval '18 hours',
       make_date(v.yr, v.mo, 28)::timestamp + interval '18 hours'
FROM (VALUES
  ('Arun','Gupta',2025,12,6,3,2,1420000.00,798000.00,91.50,23.40,6.20,'[{"category":"Kitchen Fitout","count":4,"winRate":75,"accuracy":92.1},{"category":"SS Fabrication","count":2,"winRate":0,"accuracy":90.2}]'),
  ('Meera','Nair',2025,12,4,2,1,610000.00,286000.00,88.70,21.10,7.80,'[{"category":"Refrigeration","count":2,"winRate":50,"accuracy":89.4},{"category":"Kitchen Fitout","count":2,"winRate":50,"accuracy":88.0}]'),
  ('Deepak','Joshi',2025,12,3,1,2,340000.00,96000.00,86.20,19.80,5.40,'[{"category":"MEP","count":2,"winRate":50,"accuracy":85.5},{"category":"Kitchen Fitout","count":1,"winRate":0,"accuracy":87.6}]'),
  ('Priya','Sharma',2025,12,2,1,1,150000.00,72000.00,84.90,18.60,8.10,'[{"category":"Servery","count":2,"winRate":50,"accuracy":84.9}]'),
  ('Arun','Gupta',2026,6,8,5,2,1980000.00,1240000.00,92.80,24.10,5.60,'[{"category":"Kitchen Fitout","count":5,"winRate":80,"accuracy":93.2},{"category":"SS Fabrication","count":3,"winRate":33,"accuracy":92.1}]'),
  ('Meera','Nair',2026,6,5,2,2,880000.00,310000.00,89.30,20.70,7.10,'[{"category":"Refrigeration","count":2,"winRate":50,"accuracy":90.1},{"category":"Kitchen Fitout","count":3,"winRate":33,"accuracy":88.8}]'),
  ('Deepak','Joshi',2026,6,6,4,1,760000.00,452000.00,90.10,21.90,4.90,'[{"category":"Franchise Rollout","count":3,"winRate":67,"accuracy":91.0},{"category":"MEP","count":3,"winRate":67,"accuracy":89.3}]'),
  ('Priya','Sharma',2026,6,4,1,2,290000.00,68000.00,85.40,18.20,7.60,'[{"category":"Servery","count":3,"winRate":33,"accuracy":85.0},{"category":"Kitchen Fitout","count":1,"winRate":0,"accuracy":86.5}]')
) AS v(fn, ln, yr, mo, total, won, lost, estval, wonval, acc, marg, tat, catbrk)
JOIN hr_employees emp ON emp."firstName" = v.fn AND emp."lastName" = v.ln;

-- ---------------------------------------------------------------------------
-- Historical benchmarks
-- ---------------------------------------------------------------------------
INSERT INTO estimation_historical_benchmarks
  ("companyId", category, "subCategory", "metricName", unit, currency,
   "averageValue", "minValue", "maxValue", "medianValue", "standardDeviation",
   "sampleSize", "periodStart", "periodEnd", trend, region, notes, "updatedBy",
   "createdAt", "updatedAt")
VALUES
  (:company,'SS Fabrication','Work Tables','Fabricated cost per meter of SS304 table','USD/m','USD',392.5000,340.0000,468.0000,388.0000,31.2000,24,'2025-01-01','2025-12-31','[{"period":"2025-H1","value":381.2,"changePercentage":2.1},{"period":"2025-H2","value":403.8,"changePercentage":5.9}]'::json,'US West','Includes undershelf; excludes sinks','Arun Gupta','2026-01-10 09:00:00','2026-01-10 09:00:00'),
  (:company,'SS Fabrication','Exhaust Hoods','Installed hood cost per square meter','USD/sqm','USD',618.0000,540.0000,715.0000,610.0000,44.5000,16,'2025-01-01','2025-12-31',NULL,'US West','Baffle filter type; UV systems excluded','Arun Gupta','2026-01-10 09:05:00','2026-01-10 09:05:00'),
  (:company,'Equipment','Combi Ovens','Purchase cost per 20-tray combi oven','USD/ea','USD',18250.0000,16800.0000,19900.0000,18100.0000,820.0000,12,'2025-01-01','2026-06-30','[{"period":"2025","value":17900,"changePercentage":1.8},{"period":"2026-H1","value":18600,"changePercentage":3.9}]'::json,'US','Electric boiler type, 3-phase','Meera Nair','2026-07-05 10:00:00','2026-07-05 10:00:00'),
  (:company,'MEP','Kitchen Services','MEP cost as percentage of equipment value','percent','USD',24.6000,18.0000,32.0000,24.0000,3.8000,18,'2025-01-01','2026-06-30',NULL,'US','Higher end for hospital / phased projects','Deepak Joshi','2026-07-05 10:10:00','2026-07-05 10:10:00'),
  (:company,'Installation','Commercial Kitchen','Install labor hours per equipment item','hour/item','USD',9.4000,6.5000,14.0000,9.0000,1.9000,31,'2025-01-01','2026-06-30','[{"period":"2025","value":9.8,"changePercentage":-1.5},{"period":"2026-H1","value":9.1,"changePercentage":-7.1}]'::json,'US','Excludes MEP tie-ins','Meera Nair','2026-07-05 10:20:00','2026-07-05 10:20:00'),
  (:company,'Commercial','Margin','Realized gross margin on kitchen fitout jobs','percent','USD',22.3000,17.5000,27.8000,22.0000,2.6000,22,'2025-01-01','2026-06-30',NULL,'US','Target band 18-28 percent','Sanjay Malhotra','2026-07-05 10:30:00','2026-07-05 10:30:00'),
  (:company,'Refrigeration','Cold Rooms','Installed cost per cubic meter of walk-in cold room','USD/cbm','USD',742.0000,650.0000,860.0000,730.0000,52.0000,14,'2025-01-01','2025-12-31',NULL,'US','100mm PUF panels, remote condensing','Meera Nair','2026-01-10 09:15:00','2026-01-10 09:15:00'),
  (:company,'Commercial','Estimate Accuracy','Estimate-to-actual accuracy score','percent','USD',89.6000,84.9000,94.3000,90.1000,2.4000,20,'2025-01-01','2026-06-30','[{"period":"2025","value":88.4,"changePercentage":1.2},{"period":"2026-H1","value":91.0,"changePercentage":2.9}]'::json,'US','From accuracy records, completed projects only','Sanjay Malhotra','2026-07-05 10:40:00','2026-07-05 10:40:00');
