-- Demo seed — Estimation (part B): rate cards, markup, overheads, pricing,
-- analytics (risk / what-if / win-loss), send records, schedules, workflow stages.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first, then re-inserts.
-- NOTE: estimation_cost_estimates (EST-DEMO-*) is seeded by 27_estimation_a.sql which
-- applies BEFORE this file. estimation_pricing below is INSERT..SELECT off those rows
-- (inserts 0 rows if none exist yet — validation-safe); other estimate references are
-- plain varchar columns and use COALESCE(subselect, 'DEMO-…') fallbacks.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- 1. Markup settings (category defaults; thresholds are markup percentages)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_markup_settings WHERE "companyId" = :company;
INSERT INTO estimation_markup_settings
  ("companyId", category, subcategory, "defaultMarkup", "minMarkup", "maxMarkup",
   "costBasis", "approvalRequired", "approvalThreshold", "updatedBy", status, "createdAt", "updatedAt")
VALUES
  (:company,'Material','SS304 Fabrication',18.00,12.00,28.00,'material-only',false,25.00,'Rajesh Kumar','active','2025-10-06 10:00:00','2026-04-02 09:30:00'),
  (:company,'Material','SS316 Fabrication',22.00,15.00,32.00,'material-only',false,28.00,'Rajesh Kumar','active','2025-10-06 10:05:00','2026-04-02 09:32:00'),
  (:company,'Labor','Workshop Fabrication',20.00,15.00,30.00,'material-labor',false,28.00,'Priya Sharma','active','2025-10-06 10:10:00','2026-04-02 09:35:00'),
  (:company,'Labor','Site Installation',25.00,18.00,35.00,'material-labor',true,30.00,'Priya Sharma','active','2025-10-06 10:15:00','2026-04-02 09:38:00'),
  (:company,'Equipment','Imported Line Equipment',15.00,10.00,22.00,'full-cost',true,20.00,'Deepak Joshi','active','2025-11-12 11:00:00','2026-04-02 09:40:00'),
  (:company,'Subcontractor','MEP Works',12.00,8.00,18.00,'full-cost',true,15.00,'Deepak Joshi','active','2025-11-12 11:05:00','2026-04-02 09:42:00'),
  (:company,'Overhead',NULL,10.00,8.00,14.00,'full-cost',false,14.00,'Anita Desai','active','2025-11-12 11:10:00','2026-04-02 09:44:00'),
  (:company,'Turnkey Project',NULL,16.00,12.00,24.00,'full-cost',true,22.00,'Anita Desai','active','2026-01-08 09:00:00','2026-04-02 09:46:00');

-- ---------------------------------------------------------------------------
-- 2. Markup rules (by cost head / project size / customer segment)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_markup_rules WHERE "companyId" = :company;
INSERT INTO estimation_markup_rules
  ("companyId", name, description, "isActive", "applyTo", "markupPercentage",
   "minAmount", "maxAmount", conditions, priority, "categoryId", "customerId",
   "effectiveFrom", "effectiveUntil", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Small project material markup','Material markup for projects under 10 lakh',true,'Material',24.00,0,1000000,'[{"field":"projectValue","operator":"lessThan","value":1000000}]',10,'CAT-SMALL',NULL,'2025-10-01','2027-03-31','Rajesh Kumar','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  (:company,'DEMO Mid project material markup','Material markup for projects 10-50 lakh',true,'Material',18.00,1000000,5000000,'[{"field":"projectValue","operator":"greaterThan","value":1000000}]',20,'CAT-MID',NULL,'2025-10-01','2027-03-31','Rajesh Kumar','2025-10-07 09:05:00','2025-10-07 09:05:00'),
  (:company,'DEMO Large project material markup','Negotiated material markup above 50 lakh',true,'Material',14.00,5000000,NULL,'[{"field":"projectValue","operator":"greaterThan","value":5000000}]',30,'CAT-LARGE',NULL,'2025-10-01','2027-03-31','Rajesh Kumar','2025-10-07 09:10:00','2025-10-07 09:10:00'),
  (:company,'DEMO Workshop labor markup','Standard labor markup on fabrication hours',true,'Labor',20.00,NULL,NULL,NULL,15,NULL,NULL,'2025-10-01','2027-03-31','Priya Sharma','2025-10-07 09:15:00','2025-10-07 09:15:00'),
  (:company,'DEMO Site installation labor markup','Higher markup for site crews incl. travel and stay',true,'Labor',26.00,NULL,NULL,'[{"field":"workLocation","operator":"equals","value":"site"}]',16,NULL,NULL,'2025-10-01','2027-03-31','Priya Sharma','2025-10-07 09:20:00','2025-10-07 09:20:00'),
  (:company,'DEMO MEP subcontract markup','Pass-through markup on MEP subcontract packages',true,'Subcontractor',12.00,NULL,NULL,NULL,18,NULL,NULL,'2025-11-15','2027-03-31','Deepak Joshi','2025-11-15 10:00:00','2025-11-15 10:00:00'),
  (:company,'DEMO Overhead recovery rule','Overhead recovery applied on direct cost',true,'Overhead',10.00,NULL,NULL,NULL,40,NULL,NULL,'2025-10-01','2027-03-31','Anita Desai','2025-11-15 10:05:00','2025-11-15 10:05:00'),
  (:company,'DEMO Repeat customer blanket cap','Blanket markup cap for repeat enterprise accounts',true,'All',15.00,NULL,NULL,'[{"field":"customerSegment","operator":"equals","value":"Enterprise"}]',50,NULL,(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' LIMIT 1),'2026-01-01','2027-03-31','Anita Desai','2026-01-09 11:30:00','2026-01-09 11:30:00');

-- ---------------------------------------------------------------------------
-- 3. Resource rates (labor / material / equipment / subcontractor unit rates)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_resource_rates WHERE "companyId" = :company;
INSERT INTO estimation_resource_rates
  ("companyId", code, name, description, "rateType", category, "subCategory", unit, currency,
   "standardRate", "minimumRate", "maximumRate", "overtimeRate", "overtimeMultiplier",
   "isActive", "effectiveFrom", "effectiveUntil", "supplierId", "supplierName",
   notes, "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-RR-001','TIG Welder (SS)','Certified TIG welder for SS304/SS316 sheet work','Labor','Fabrication','Welding','Hour','INR',650.0000,550.0000,780.0000,975.0000,1.50,true,'2025-10-01','2026-03-31',NULL,NULL,'FY25-26 workshop rate','Priya Sharma','2025-10-03 09:00:00','2025-10-03 09:00:00'),
  (:company,'DEMO-RR-002','Fitter / Assembler','Bench fitter for kitchen line assembly','Labor','Fabrication','Fitting','Hour','INR',550.0000,480.0000,650.0000,825.0000,1.50,true,'2025-10-01','2026-03-31',NULL,NULL,'FY25-26 workshop rate','Priya Sharma','2025-10-03 09:05:00','2025-10-03 09:05:00'),
  (:company,'DEMO-RR-003','Electrician (Commercial Kitchen)','Wiring, panels and equipment hook-up','Labor','Installation','Electrical','Hour','INR',700.0000,600.0000,850.0000,1050.0000,1.50,true,'2025-10-01','2026-03-31',NULL,NULL,'Site rate incl. tools','Priya Sharma','2025-10-03 09:10:00','2025-10-03 09:10:00'),
  (:company,'DEMO-RR-004','Helper / Rigger','General helper for material handling','Labor','Fabrication','Support','Hour','INR',450.0000,400.0000,520.0000,675.0000,1.50,true,'2025-10-01','2026-03-31',NULL,NULL,'FY25-26 workshop rate','Priya Sharma','2025-10-03 09:15:00','2025-10-03 09:15:00'),
  (:company,'DEMO-RR-005','Site Supervisor','Installation supervisor for site crews','Labor','Installation','Supervision','Hour','INR',950.0000,850.0000,1100.0000,1425.0000,1.50,true,'2025-10-01','2026-03-31',NULL,NULL,'Includes reporting duties','Priya Sharma','2025-10-03 09:20:00','2025-10-03 09:20:00'),
  (:company,'DEMO-RR-006','Design Engineer (Kitchen Layout)','CAD layout and shop drawing hours','Labor','Engineering','Design','Hour','INR',1200.0000,1000.0000,1400.0000,NULL,NULL,true,'2025-10-01','2026-03-31',NULL,NULL,'Billed against BOQ engineering line','Priya Sharma','2025-10-03 09:25:00','2025-10-03 09:25:00'),
  (:company,'DEMO-RR-007','SS304 Sheet 1.2mm (2B finish)','Food-grade SS304 sheet for counters and cladding','Material','Sheet Metal','SS304','Kilogram','INR',232.0000,218.0000,255.0000,NULL,NULL,true,'2025-10-01','2026-03-31',(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','Rate tracks mill price + 4%','Rajesh Kumar','2025-10-03 10:00:00','2026-02-14 10:00:00'),
  (:company,'DEMO-RR-008','SS316 Sheet 1.5mm (2B finish)','Marine-grade SS316 sheet for wash areas','Material','Sheet Metal','SS316','Kilogram','INR',342.0000,320.0000,375.0000,NULL,NULL,true,'2025-10-01','2026-03-31',(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','Rate tracks mill price + 4%','Rajesh Kumar','2025-10-03 10:05:00','2026-02-14 10:02:00'),
  (:company,'DEMO-RR-009','Copper Wire 2.5mm','Panel and hook-up wiring consumable','Material','Electrical','Wiring','Meter','INR',COALESCE((SELECT ROUND("standardCost"*1.04,4) FROM items WHERE "itemCode"='RM-COP-001'),46.8000),42.0000,52.0000,NULL,NULL,true,'2025-10-01','2026-03-31',(SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','Linked to items master RM-COP-001','Rajesh Kumar','2025-10-03 10:10:00','2026-02-14 10:04:00'),
  (:company,'DEMO-RR-010','CNC Punching (Job Work)','Per-hour CNC turret punching job work','Equipment','Machine Time','CNC','Hour','INR',1850.0000,1600.0000,2200.0000,NULL,NULL,true,'2025-10-01','2026-03-31',(SELECT id::text FROM vendors WHERE "vendorCode"='VND-005'),'ProTool Equipment Inc.','Includes tooling wear','Deepak Joshi','2025-10-03 10:15:00','2025-10-03 10:15:00'),
  (:company,'DEMO-RR-011','Exhaust Hood Ducting (Subcon)','Fabricated GI ducting supplied and installed','Subcontractor','MEP','HVAC','Square Meter','INR',2400.0000,2100.0000,2800.0000,NULL,NULL,true,'2025-10-01','2026-03-31',(SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'Bharat Metal Works Pvt. Ltd.','Rate per sq.m of duct surface','Deepak Joshi','2025-10-03 10:20:00','2025-10-03 10:20:00'),
  (:company,'DEMO-RR-012','Gas Line Piping (Subcon)','LPG/PNG piping with certification','Subcontractor','MEP','Gas','Meter','INR',1450.0000,1250.0000,1700.0000,NULL,NULL,true,'2025-10-01','2026-03-31',(SELECT id::text FROM vendors WHERE "vendorCode"='VND-007'),'MaintainPro Services','Includes pressure test certificate','Deepak Joshi','2025-10-03 10:25:00','2025-10-03 10:25:00');

-- ---------------------------------------------------------------------------
-- 4. Material cost rates (tracking sheet off items master, ±5% movement)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_material_cost_rates WHERE "companyId" = :company;
INSERT INTO estimation_material_cost_rates
  ("companyId", "materialCode", "materialName", category, unit,
   "currentPrice", "previousPrice", "variancePercent", supplier, "lastUpdated", status, "createdAt", "updatedAt")
VALUES
  (:company,'RM-STL-001','Steel Sheet 2mm','Raw Material','kg',COALESCE((SELECT ROUND("standardCost"*1.05,2) FROM items WHERE "itemCode"='RM-STL-001'),89.25),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='RM-STL-001'),85.00),5.00,'Prime Steel Suppliers','2026-08-18','active','2025-10-04 09:00:00','2026-08-18 09:00:00'),
  (:company,'RM-ALM-001','Aluminum Rod 20mm','Raw Material','kg',COALESCE((SELECT ROUND("standardCost"*1.03,2) FROM items WHERE "itemCode"='RM-ALM-001'),329.60),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='RM-ALM-001'),320.00),3.00,'Prime Steel Suppliers','2026-08-18','active','2025-10-04 09:05:00','2026-08-18 09:02:00'),
  (:company,'RM-COP-001','Copper Wire 2.5mm','Raw Material','m',COALESCE((SELECT ROUND("standardCost"*0.96,2) FROM items WHERE "itemCode"='RM-COP-001'),43.20),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='RM-COP-001'),45.00),-4.00,'ElectroTech Supplies','2026-07-22','active','2025-10-04 09:10:00','2026-07-22 09:00:00'),
  (:company,'SP-BRG-001','Ball Bearing 6205','Bought-out Part','pc',COALESCE((SELECT ROUND("standardCost"*1.02,2) FROM items WHERE "itemCode"='SP-BRG-001'),459.00),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='SP-BRG-001'),450.00),2.00,'Industrial Components Ltd.','2026-06-30','active','2025-10-04 09:15:00','2026-06-30 09:00:00'),
  (:company,'SP-SL-001','Mechanical Seal MS-40','Bought-out Part','pc',COALESCE((SELECT ROUND("standardCost"*1.04,2) FROM items WHERE "itemCode"='SP-SL-001'),1248.00),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='SP-SL-001'),1200.00),4.00,'Industrial Components Ltd.','2026-06-30','active','2025-10-04 09:20:00','2026-06-30 09:02:00'),
  (:company,'SP-BLT-001','V-Belt A68','Bought-out Part','pc',COALESCE((SELECT ROUND("standardCost"*0.98,2) FROM items WHERE "itemCode"='SP-BLT-001'),274.40),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='SP-BLT-001'),280.00),-2.00,'Industrial Components Ltd.','2026-05-15','active','2025-10-04 09:25:00','2026-05-15 09:00:00'),
  (:company,'CON-LUB-001','Industrial Lubricant Oil ISO VG 68','Consumable','ltr',COALESCE((SELECT ROUND("standardCost"*1.05,2) FROM items WHERE "itemCode"='CON-LUB-001'),189.00),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='CON-LUB-001'),180.00),5.00,'Chemical Solutions GmbH','2026-04-10','active','2025-10-04 09:30:00','2026-04-10 09:00:00'),
  (:company,'CON-CLT-001','Cutting Coolant Concentrate','Consumable','ltr',COALESCE((SELECT ROUND("standardCost"*1.01,2) FROM items WHERE "itemCode"='CON-CLT-001'),222.20),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='CON-CLT-001'),220.00),1.00,'Chemical Solutions GmbH','2026-04-10','active','2025-10-04 09:35:00','2026-04-10 09:02:00'),
  (:company,'TOOL-INS-001','Carbide Insert CNMG 120408','Tooling','pc',COALESCE((SELECT ROUND("standardCost"*1.03,2) FROM items WHERE "itemCode"='TOOL-INS-001'),2266.00),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='TOOL-INS-001'),2200.00),3.00,'ProTool Equipment Inc.','2026-03-05','active','2025-10-04 09:40:00','2026-03-05 09:00:00'),
  (:company,'TOOL-DRL-001','HSS Drill Bit Set 1-13mm','Tooling','set',COALESCE((SELECT ROUND("standardCost"*0.97,2) FROM items WHERE "itemCode"='TOOL-DRL-001'),1746.00),COALESCE((SELECT "standardCost" FROM items WHERE "itemCode"='TOOL-DRL-001'),1800.00),-3.00,'ProTool Equipment Inc.','2026-03-05','active','2025-10-04 09:45:00','2026-03-05 09:02:00'),
  (:company,'DEMO-SS304-12','SS304 Sheet 1.2mm 2B','Sheet Metal','kg',232.00,221.00,4.98,'Prime Steel Suppliers','2026-08-25','active','2025-10-04 09:50:00','2026-08-25 09:00:00'),
  (:company,'DEMO-SS316-15','SS316 Sheet 1.5mm 2B','Sheet Metal','kg',342.00,328.00,4.27,'Prime Steel Suppliers','2026-08-25','active','2025-10-04 09:55:00','2026-08-25 09:02:00');

-- ---------------------------------------------------------------------------
-- 5. Material rate cards (versioned FY25-26 / FY26-27 +8%)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_material_rate_cards WHERE "companyId" = :company;
INSERT INTO estimation_material_rate_cards
  ("companyId", name, description, "isActive", "isDefault", "effectiveFrom", "effectiveUntil",
   "supplierId", "supplierName", currency, items, "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Material Rate Card FY25-26','Standard fabrication material rates for FY 2025-26',true,false,'2025-04-01','2026-03-31',NULL,NULL,'INR',
   '[{"resourceRateId":"DEMO-RR-007","code":"DEMO-RR-007","name":"SS304 Sheet 1.2mm","unit":"kg","rate":232,"category":"Sheet Metal"},{"resourceRateId":"DEMO-RR-008","code":"DEMO-RR-008","name":"SS316 Sheet 1.5mm","unit":"kg","rate":342,"category":"Sheet Metal"},{"resourceRateId":"DEMO-RR-009","code":"DEMO-RR-009","name":"Copper Wire 2.5mm","unit":"m","rate":46.8,"category":"Electrical"}]',
   'Rajesh Kumar','2025-10-05 09:00:00','2025-10-05 09:00:00'),
  (:company,'DEMO Material Rate Card FY26-27','FY 2026-27 revision, +8% over FY25-26',true,true,'2026-04-01','2027-03-31',NULL,NULL,'INR',
   '[{"resourceRateId":"DEMO-RR-007","code":"DEMO-RR-007","name":"SS304 Sheet 1.2mm","unit":"kg","rate":250.56,"category":"Sheet Metal"},{"resourceRateId":"DEMO-RR-008","code":"DEMO-RR-008","name":"SS316 Sheet 1.5mm","unit":"kg","rate":369.36,"category":"Sheet Metal"},{"resourceRateId":"DEMO-RR-009","code":"DEMO-RR-009","name":"Copper Wire 2.5mm","unit":"m","rate":50.54,"category":"Electrical"}]',
   'Rajesh Kumar','2026-03-20 09:00:00','2026-04-01 09:00:00'),
  (:company,'DEMO Prime Steel Contract Rates','Negotiated annual contract with Prime Steel Suppliers',true,false,'2025-10-01','2026-09-30',(SELECT id::text FROM vendors WHERE "vendorCode"='VND-001'),'Prime Steel Suppliers','INR',
   '[{"resourceRateId":"DEMO-RR-007","code":"DEMO-RR-007","name":"SS304 Sheet 1.2mm","unit":"kg","rate":225,"category":"Sheet Metal"},{"resourceRateId":"DEMO-RR-008","code":"DEMO-RR-008","name":"SS316 Sheet 1.5mm","unit":"kg","rate":334,"category":"Sheet Metal"}]',
   'Rajesh Kumar','2025-10-05 09:10:00','2025-10-05 09:10:00'),
  (:company,'DEMO Electrical BOQ Rates','ElectroTech contract rates for panel and wiring BOQ lines',true,false,'2025-11-01','2026-10-31',(SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'ElectroTech Supplies','INR',
   '[{"resourceRateId":"DEMO-RR-009","code":"DEMO-RR-009","name":"Copper Wire 2.5mm","unit":"m","rate":44.5,"category":"Electrical"}]',
   'Deepak Joshi','2025-11-02 09:00:00','2025-11-02 09:00:00'),
  (:company,'DEMO Legacy Rate Card FY24-25','Superseded card kept for historical estimate comparison',false,false,'2024-04-01','2025-03-31',NULL,NULL,'INR',
   '[{"resourceRateId":"DEMO-RR-007","code":"DEMO-RR-007","name":"SS304 Sheet 1.2mm","unit":"kg","rate":214.8,"category":"Sheet Metal"},{"resourceRateId":"DEMO-RR-008","code":"DEMO-RR-008","name":"SS316 Sheet 1.5mm","unit":"kg","rate":316.7,"category":"Sheet Metal"}]',
   'Rajesh Kumar','2025-10-05 09:20:00','2025-10-05 09:20:00');

-- ---------------------------------------------------------------------------
-- 6. Labor rate cards (versioned FY25-26 / FY26-27 +8%)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_labor_rate_cards WHERE "companyId" = :company;
INSERT INTO estimation_labor_rate_cards
  ("companyId", name, description, "isActive", "isDefault", "effectiveFrom", "effectiveUntil",
   region, currency, roles, "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Workshop Labor Card FY25-26','Workshop fabrication labor rates FY 2025-26',true,false,'2025-04-01','2026-03-31','Bengaluru Works','INR',
   '[{"roleId":"WELD-SS","roleName":"TIG Welder (SS)","skillLevel":"Skilled","hourlyRate":650,"dailyRate":5200,"overtimeRate":975,"benefits":78,"totalHourlyRate":728},{"roleId":"FITTER","roleName":"Fitter / Assembler","skillLevel":"Skilled","hourlyRate":550,"dailyRate":4400,"overtimeRate":825,"benefits":66,"totalHourlyRate":616},{"roleId":"HELPER","roleName":"Helper / Rigger","skillLevel":"Semi-skilled","hourlyRate":450,"dailyRate":3600,"overtimeRate":675,"benefits":54,"totalHourlyRate":504}]',
   'Priya Sharma','2025-10-05 10:00:00','2025-10-05 10:00:00'),
  (:company,'DEMO Workshop Labor Card FY26-27','FY 2026-27 revision, +8% over FY25-26',true,true,'2026-04-01','2027-03-31','Bengaluru Works','INR',
   '[{"roleId":"WELD-SS","roleName":"TIG Welder (SS)","skillLevel":"Skilled","hourlyRate":702,"dailyRate":5616,"overtimeRate":1053,"benefits":84.24,"totalHourlyRate":786.24},{"roleId":"FITTER","roleName":"Fitter / Assembler","skillLevel":"Skilled","hourlyRate":594,"dailyRate":4752,"overtimeRate":891,"benefits":71.28,"totalHourlyRate":665.28},{"roleId":"HELPER","roleName":"Helper / Rigger","skillLevel":"Semi-skilled","hourlyRate":486,"dailyRate":3888,"overtimeRate":729,"benefits":58.32,"totalHourlyRate":544.32}]',
   'Priya Sharma','2026-03-20 10:00:00','2026-04-01 10:00:00'),
  (:company,'DEMO Site Installation Card FY25-26','Site crew rates incl. travel allowance FY 2025-26',true,false,'2025-04-01','2026-03-31','Pan-India Sites','INR',
   '[{"roleId":"ELEC","roleName":"Electrician (Commercial Kitchen)","skillLevel":"Skilled","hourlyRate":700,"dailyRate":5600,"overtimeRate":1050,"benefits":105,"totalHourlyRate":805},{"roleId":"SUPV","roleName":"Site Supervisor","skillLevel":"Supervisory","hourlyRate":950,"dailyRate":7600,"overtimeRate":1425,"benefits":142.5,"totalHourlyRate":1092.5},{"roleId":"HELPER","roleName":"Helper / Rigger","skillLevel":"Semi-skilled","hourlyRate":480,"dailyRate":3840,"overtimeRate":720,"benefits":72,"totalHourlyRate":552}]',
   'Priya Sharma','2025-10-05 10:10:00','2025-10-05 10:10:00'),
  (:company,'DEMO Site Installation Card FY26-27','FY 2026-27 revision, +8% over FY25-26',true,false,'2026-04-01','2027-03-31','Pan-India Sites','INR',
   '[{"roleId":"ELEC","roleName":"Electrician (Commercial Kitchen)","skillLevel":"Skilled","hourlyRate":756,"dailyRate":6048,"overtimeRate":1134,"benefits":113.4,"totalHourlyRate":869.4},{"roleId":"SUPV","roleName":"Site Supervisor","skillLevel":"Supervisory","hourlyRate":1026,"dailyRate":8208,"overtimeRate":1539,"benefits":153.9,"totalHourlyRate":1179.9},{"roleId":"HELPER","roleName":"Helper / Rigger","skillLevel":"Semi-skilled","hourlyRate":518.4,"dailyRate":4147.2,"overtimeRate":777.6,"benefits":77.76,"totalHourlyRate":596.16}]',
   'Priya Sharma','2026-03-20 10:10:00','2026-04-01 10:10:00'),
  (:company,'DEMO Engineering Services Card','Design and engineering billable rates',true,false,'2025-10-01','2027-03-31','Bengaluru HO','INR',
   '[{"roleId":"DESIGN","roleName":"Design Engineer (Kitchen Layout)","skillLevel":"Professional","hourlyRate":1200,"dailyRate":9600,"overtimeRate":0,"benefits":180,"totalHourlyRate":1380},{"roleId":"ESTIMATOR","roleName":"Cost Estimator","skillLevel":"Professional","hourlyRate":1100,"dailyRate":8800,"overtimeRate":0,"benefits":165,"totalHourlyRate":1265}]',
   'Priya Sharma','2025-10-05 10:20:00','2025-10-05 10:20:00');

-- ---------------------------------------------------------------------------
-- 7. Subcontractor rates (MEP and specialist trades, off vendors master)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_subcontractor_rates WHERE "companyId" = :company;
INSERT INTO estimation_subcontractor_rates
  ("companyId", "subcontractorId", "subcontractorName", "contactPerson", email, phone,
   services, certifications, "performanceRating", "isActive", "isPreferred", notes,
   "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,COALESCE((SELECT id::text FROM vendors WHERE "vendorCode"='VND-004'),'VND-004'),'Bharat Metal Works Pvt. Ltd.','Nitin Kulkarni','nitin@bharatmetal.in','+91-98450-11001',
   '[{"serviceId":"SVC-DUCT","serviceName":"Exhaust hood ducting","description":"GI ducting fabricate + install","unit":"sq.m","rate":2400,"minimumCharge":45000,"leadTime":"2 weeks"},{"serviceId":"SVC-CLAD","serviceName":"SS wall cladding","description":"SS304 cladding on site","unit":"sq.m","rate":3100,"minimumCharge":60000,"leadTime":"2 weeks"}]',
   '[{"name":"ISO 9001:2015","issuedBy":"TUV SUD","validUntil":"2027-06-30"}]',4.30,true,true,'Preferred for HVAC and cladding packages','Deepak Joshi','2025-10-08 09:00:00','2026-05-11 09:00:00'),
  (:company,COALESCE((SELECT id::text FROM vendors WHERE "vendorCode"='VND-007'),'VND-007'),'MaintainPro Services','Ashok Iyer','ashok@maintainpro.in','+91-98450-11002',
   '[{"serviceId":"SVC-GAS","serviceName":"Gas line piping","description":"LPG/PNG piping with test certificate","unit":"m","rate":1450,"minimumCharge":35000,"leadTime":"1 week"},{"serviceId":"SVC-PLUMB","serviceName":"Kitchen plumbing","description":"Water inlet/drain lines","unit":"point","rate":1850,"minimumCharge":25000,"leadTime":"1 week"}]',
   '[{"name":"PESO Gas Installer License","issuedBy":"PESO","validUntil":"2026-12-31"}]',4.10,true,true,'Only PESO-licensed gas partner','Deepak Joshi','2025-10-08 09:10:00','2026-05-11 09:05:00'),
  (:company,COALESCE((SELECT id::text FROM vendors WHERE "vendorCode"='VND-003'),'VND-003'),'ElectroTech Supplies','Farida Khan','farida@electrotech.in','+91-98450-11003',
   '[{"serviceId":"SVC-PANEL","serviceName":"Distribution panel build","description":"Kitchen DB with MCBs and metering","unit":"panel","rate":48000,"minimumCharge":48000,"leadTime":"3 weeks"},{"serviceId":"SVC-WIRE","serviceName":"Power wiring","description":"Equipment hook-up wiring","unit":"point","rate":2200,"minimumCharge":30000,"leadTime":"1 week"}]',
   '[{"name":"Electrical Contractor License Class A","issuedBy":"KSEB","validUntil":"2027-03-31"}]',3.90,true,false,'Good quality, occasionally late on panels','Deepak Joshi','2025-10-08 09:20:00','2026-05-11 09:10:00'),
  (:company,COALESCE((SELECT id::text FROM vendors WHERE "vendorCode"='VND-005'),'VND-005'),'ProTool Equipment Inc.','Gerald Tan','gerald@protool.com','+65-8100-2200',
   '[{"serviceId":"SVC-CNC","serviceName":"CNC punching job work","description":"Turret punching per programme hour","unit":"hour","rate":1850,"minimumCharge":15000,"leadTime":"3 days"},{"serviceId":"SVC-BEND","serviceName":"CNC bending job work","description":"Press brake bending","unit":"hour","rate":1600,"minimumCharge":12000,"leadTime":"3 days"}]',
   NULL,4.50,true,true,'Overflow capacity for sheet metal shop','Deepak Joshi','2025-11-20 09:00:00','2026-05-11 09:15:00'),
  (:company,COALESCE((SELECT id::text FROM vendors WHERE "vendorCode"='VND-006'),'VND-006'),'PackRight Solutions','Meenakshi Pillai','meenakshi@packright.in','+91-98450-11005',
   '[{"serviceId":"SVC-CRATE","serviceName":"Export crating","description":"Seaworthy crating for kitchen lines","unit":"cbm","rate":3200,"minimumCharge":20000,"leadTime":"4 days"}]',
   NULL,3.70,true,false,'Used for export and long-haul dispatches','Deepak Joshi','2025-11-20 09:10:00','2025-11-20 09:10:00'),
  (:company,COALESCE((SELECT id::text FROM vendors WHERE "vendorCode"='VND-008'),'VND-008'),'Chemical Solutions GmbH','Lena Fischer','lena@chemsolutions.de','+49-171-555-0101',
   '[{"serviceId":"SVC-PASSIV","serviceName":"SS passivation service","description":"Citric acid passivation of SS assemblies","unit":"sq.m","rate":950,"minimumCharge":18000,"leadTime":"1 week"}]',
   '[{"name":"ASTM A967 Compliance","issuedBy":"DEKRA","validUntil":"2026-11-30"}]',4.00,true,false,'Passivation for hospital and marine jobs','Deepak Joshi','2026-01-14 09:00:00','2026-01-14 09:00:00');

-- ---------------------------------------------------------------------------
-- 8. Overhead costs (monthly cost pool with allocation basis)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_overhead_costs WHERE "companyId" = :company;
INSERT INTO estimation_overhead_costs
  ("companyId", name, category, "costType", "monthlyAmount", "annualAmount",
   "allocationMethod", "allocationRate", status, "createdAt", "updatedAt")
VALUES
  (:company,'Factory Rent — Bengaluru Works','Facilities','fixed',850000.00,10200000.00,'percentage',3.20,'active','2025-10-02 09:00:00','2026-04-01 09:00:00'),
  (:company,'Electricity & Utilities','Facilities','semi-variable',320000.00,3840000.00,'per-unit',1.20,'active','2025-10-02 09:05:00','2026-04-01 09:02:00'),
  (:company,'Indirect Salaries Allocation','Staff','fixed',1450000.00,17400000.00,'percentage',5.50,'active','2025-10-02 09:10:00','2026-04-01 09:04:00'),
  (:company,'Plant & Machinery Depreciation','Depreciation','fixed',610000.00,7320000.00,'percentage',2.30,'active','2025-10-02 09:15:00','2026-04-01 09:06:00'),
  (:company,'Insurance — Works & Transit','Insurance','fixed',95000.00,1140000.00,'percentage',0.40,'active','2025-10-02 09:20:00','2026-04-01 09:08:00'),
  (:company,'IT & Software Subscriptions','Administration','fixed',140000.00,1680000.00,'percentage',0.50,'active','2025-10-02 09:25:00','2026-04-01 09:10:00'),
  (:company,'Quality & Testing Department','Quality','semi-variable',260000.00,3120000.00,'percentage',1.00,'active','2025-10-02 09:30:00','2026-04-01 09:12:00'),
  (:company,'Internal Transport & Forklifts','Logistics','variable',180000.00,2160000.00,'per-unit',0.70,'active','2025-10-02 09:35:00','2026-04-01 09:14:00'),
  (:company,'Statutory & Compliance Fees','Administration','fixed',75000.00,900000.00,'direct',0.30,'active','2025-10-02 09:40:00','2026-04-01 09:16:00');

-- ---------------------------------------------------------------------------
-- 9. Price lists
-- ---------------------------------------------------------------------------
DELETE FROM estimation_price_lists WHERE "companyId" = :company;
INSERT INTO estimation_price_lists
  ("companyId", "priceListName", description, currency, "effectiveFrom", "effectiveTo",
   status, "totalItems", "priceType", "customerSegment", "lastUpdated", "updatedBy",
   "averageMargin", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Standard Kitchen Equipment FY25-26','List prices for standard catalogue fabricated units','INR','2025-04-01','2026-03-31','expired',148,'standard',NULL,'2026-03-28','Rajesh Kumar',21.50,'2025-10-06 09:00:00','2026-03-28 09:00:00'),
  (:company,'DEMO Standard Kitchen Equipment FY26-27','FY26-27 list, +8% over FY25-26 on fabricated units','INR','2026-04-01','2027-03-31','active',152,'standard',NULL,'2026-08-30','Rajesh Kumar',22.10,'2026-03-25 09:00:00','2026-08-30 09:00:00'),
  (:company,'DEMO Enterprise Chains Price List','Negotiated pricing for multi-site enterprise accounts','INR','2026-04-01','2027-03-31','active',96,'custom','Enterprise','2026-07-15','Anita Desai',16.80,'2026-03-25 09:10:00','2026-07-15 09:00:00'),
  (:company,'DEMO Institutional / Tender Price List','Sharpened pricing for schools, hospitals and tenders','INR','2026-04-01','2027-03-31','active',88,'custom','Institutional','2026-06-20','Anita Desai',13.20,'2026-03-25 09:20:00','2026-06-20 09:00:00'),
  (:company,'DEMO Monsoon Promo — Refrigeration','Promotional pricing on refrigeration line, Jun-Sep 2026','INR','2026-06-01','2026-09-30','active',24,'promotional','SMB','2026-06-01','David Williams',11.50,'2026-05-18 09:00:00','2026-06-01 09:00:00'),
  (:company,'DEMO Dealer Bulk Price List','Bulk-quantity slab pricing for dealer channel','INR','2026-04-01','2027-03-31','draft',61,'bulk','Dealer','2026-08-12','Rajesh Kumar',14.70,'2026-08-01 09:00:00','2026-08-12 09:00:00');

-- ---------------------------------------------------------------------------
-- 10. Pricing worksheets — derived from EST-DEMO-* cost estimates.
--     Hard NOT NULL FK to estimation_cost_estimates: seeded as INSERT..SELECT so
--     this inserts 0 rows when estimates are absent (validation) and up to 8
--     rows once 27_estimation_a.sql has applied.
-- ---------------------------------------------------------------------------
DELETE FROM estimation_pricing WHERE "companyId" = :company;
INSERT INTO estimation_pricing
  ("companyId", "pricingNumber", title, description, "costEstimateId", "customerId", "customerName",
   status, "pricingStrategy", currency, "baseCost", "markupPercentage", "markupAmount",
   "targetMarginPercentage", "actualMarginPercentage", "actualMarginAmount",
   "discountPercentage", "discountAmount", "taxPercentage", "taxAmount",
   subtotal, "totalPrice", "quotationDate", "validUntil", "createdBy", "createdAt", "updatedAt")
SELECT
  :company,
  replace(q."estimateNumber", 'EST-', 'PRC-'),
  'Pricing — ' || q.title,
  'Cost-plus pricing worksheet derived from estimate ' || q."estimateNumber",
  q.id,
  q."customerId",
  q."customerName",
  (CASE q.rn % 4 WHEN 1 THEN 'Approved' WHEN 2 THEN 'Sent to Customer' WHEN 3 THEN 'Accepted' ELSE 'Draft' END)::estimation_pricing_status_enum,
  (CASE WHEN q.rn % 2 = 0 THEN 'Competitive' ELSE 'Cost Plus' END)::estimation_pricing_pricingstrategy_enum,
  q.currency,
  q.base,
  q.mkpct,
  q.mkamt,
  15.00,
  COALESCE(ROUND((q.mkamt - q.discamt) * 100.0 / NULLIF(q.base + q.mkamt - q.discamt, 0), 2), 0),
  ROUND(q.mkamt - q.discamt, 2),
  q.discpct,
  q.discamt,
  18.00,
  ROUND((q.base + q.mkamt - q.discamt) * 0.18, 2),
  ROUND(q.base + q.mkamt - q.discamt, 2),
  ROUND((q.base + q.mkamt - q.discamt) * 1.18, 2),
  COALESCE(q."estimateDate", DATE '2026-02-01'),
  COALESCE(q."estimateDate", DATE '2026-02-01') + 45,
  'Rajesh Kumar',
  COALESCE(q."createdAt", now()),
  COALESCE(q."createdAt", now())
FROM (
  SELECT p.*, ROUND(p.base * p.mkpct / 100.0, 2) AS mkamt,
         ROUND(p.base * p.mkpct / 100.0 * p.discpct / 100.0, 2)
           + ROUND(p.base * p.discpct / 100.0, 2) AS discamt
  FROM (
    SELECT ce.id, ce."estimateNumber", ce.title, ce."customerId", ce."customerName",
           ce.currency, ce."estimateDate", ce."createdAt",
           COALESCE(ce."totalCost", 0) AS base,
           (12 + (row_number() OVER (ORDER BY ce."estimateNumber") % 5) * 2)::numeric(5,2) AS mkpct,
           (CASE WHEN row_number() OVER (ORDER BY ce."estimateNumber") % 3 = 0 THEN 2.50 ELSE 0 END)::numeric(5,2) AS discpct,
           row_number() OVER (ORDER BY ce."estimateNumber") AS rn
    FROM estimation_cost_estimates ce
    WHERE ce."estimateNumber" LIKE 'EST-DEMO-%'
  ) p
) q
WHERE q.rn <= 8;

-- ---------------------------------------------------------------------------
-- 11. Send records (delivery audit; estimateId is plain varchar — subselect
--     resolves to real EST-DEMO id after 27_estimation_a.sql, else DEMO marker)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_send_records WHERE "companyId" = :company;
INSERT INTO estimation_send_records
  ("companyId", "estimateId", channel, recipient, subject, message,
   "includeTerms", "includePaymentSchedule", "validityDays", status, "sentAt", "sentBy", "createdAt")
VALUES
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 0),'DEMO-EST-REF-1'),'email','marcus@harbourgrill.com','Your kitchen fitout estimate from B3 MACBIS','Dear Marcus, please find attached the detailed estimate for the Harbour Grill kitchen refurbishment.',true,true,45,'sent','2026-02-10 11:15:00','Rajesh Kumar','2026-02-10 11:15:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 1),'DEMO-EST-REF-2'),'email','amelia@bluefighotels.com','Estimate — Blue Fig banquet kitchen line','Dear Amelia, attached is the revised estimate covering the banquet kitchen hot line and cold rooms.',true,true,60,'sent','2026-03-04 15:40:00','Rajesh Kumar','2026-03-04 15:40:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 2),'DEMO-EST-REF-3'),'whatsapp','+1-617-555-0155','Estimate ready — Campus Dining','Hi Raj, your estimate PDF is ready. Sharing the summary here; full document sent by email.',false,false,30,'sent','2026-03-18 10:05:00','David Williams','2026-03-18 10:05:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 3),'DEMO-EST-REF-4'),'email','karen@metrohospital.org','Estimate — Metro Hospital dietary kitchen (SS316 spec)','Dear Dr. Ng, estimate attached per the SS316 hygiene specification discussed on site.',true,true,60,'sent','2026-04-22 09:30:00','Anita Desai','2026-04-22 09:30:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 4),'DEMO-EST-REF-5'),'email','priya@goldenspoon.com','Estimate — Golden Spoon franchise kit (3 stores)','Dear Priya, bundled estimate for the three upcoming franchise stores as requested.',true,false,45,'sent','2026-06-09 14:20:00','Rajesh Kumar','2026-06-09 14:20:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 5),'DEMO-EST-REF-6'),'email','henrik@lakesideresort.com','Estimate — Lakeside spa cafe kitchen','Dear Henrik, sharing the estimate for the spa cafe kitchen; validity 30 days due to steel price volatility.',true,true,30,'sent','2026-08-13 16:45:00','David Williams','2026-08-13 16:45:00');

-- ---------------------------------------------------------------------------
-- 12. What-if scenarios
-- ---------------------------------------------------------------------------
DELETE FROM estimation_whatif_scenarios WHERE "companyId" = :company;
INSERT INTO estimation_whatif_scenarios
  ("companyId", "estimateId", name, "baseValue", variables, results, "createdAt", "updatedAt")
VALUES
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 0),'DEMO-EST-REF-1'),'DEMO SS304 price +10%',2450000.00,
   '[{"key":"ss304_rate","label":"SS304 Sheet Rate","baseValue":232,"adjustPct":10}]',
   '{"baseValue":2450000,"adjustedValue":2551800,"deltaValue":101800,"deltaPct":4.16,"perVariable":[{"key":"ss304_rate","contribution":101800}]}',
   '2026-02-12 10:00:00','2026-02-12 10:00:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 0),'DEMO-EST-REF-1'),'DEMO Labor +8% and SS304 +5%',2450000.00,
   '[{"key":"labor_rate","label":"Blended Labor Rate","baseValue":616,"adjustPct":8},{"key":"ss304_rate","label":"SS304 Sheet Rate","baseValue":232,"adjustPct":5}]',
   '{"baseValue":2450000,"adjustedValue":2549150,"deltaValue":99150,"deltaPct":4.05,"perVariable":[{"key":"labor_rate","contribution":48250},{"key":"ss304_rate","contribution":50900}]}',
   '2026-02-12 10:20:00','2026-02-12 10:20:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 1),'DEMO-EST-REF-2'),'DEMO Subcontract MEP -6% (renegotiated)',5320000.00,
   '[{"key":"mep_subcon","label":"MEP Subcontract Package","baseValue":1240000,"adjustPct":-6}]',
   '{"baseValue":5320000,"adjustedValue":5245600,"deltaValue":-74400,"deltaPct":-1.4,"perVariable":[{"key":"mep_subcon","contribution":-74400}]}',
   '2026-03-06 11:00:00','2026-03-06 11:00:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 3),'DEMO-EST-REF-4'),'DEMO SS316 substitution across wet areas',3870000.00,
   '[{"key":"ss316_share","label":"SS316 Share of Sheet Weight","baseValue":35,"adjustPct":40}]',
   '{"baseValue":3870000,"adjustedValue":4050300,"deltaValue":180300,"deltaPct":4.66,"perVariable":[{"key":"ss316_share","contribution":180300}]}',
   '2026-04-24 09:45:00','2026-04-24 09:45:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 4),'DEMO-EST-REF-5'),'DEMO Freight spike +15% (3-store bundle)',6120000.00,
   '[{"key":"freight","label":"Freight & Crating","baseValue":310000,"adjustPct":15}]',
   '{"baseValue":6120000,"adjustedValue":6166500,"deltaValue":46500,"deltaPct":0.76,"perVariable":[{"key":"freight","contribution":46500}]}',
   '2026-06-10 15:00:00','2026-06-10 15:00:00'),
  (:company,NULL,'DEMO Sandbox — FY26-27 rate card impact',1000000.00,
   '[{"key":"material","label":"Material Pool","baseValue":520000,"adjustPct":8},{"key":"labor","label":"Labor Pool","baseValue":280000,"adjustPct":8}]',
   '{"baseValue":1000000,"adjustedValue":1064000,"deltaValue":64000,"deltaPct":6.4,"perVariable":[{"key":"material","contribution":41600},{"key":"labor","contribution":22400}]}',
   '2026-03-30 09:00:00','2026-03-30 09:00:00');

-- ---------------------------------------------------------------------------
-- 13. Risk analysis
-- ---------------------------------------------------------------------------
DELETE FROM estimation_risk_analysis WHERE "companyId" = :company;
INSERT INTO estimation_risk_analysis
  ("companyId", "estimateId", "estimateNumber", "projectName", "overallRiskLevel", "overallRiskScore",
   risks, "totalMitigationCost", "recommendedContingency", "recommendedContingencyPercentage",
   "sensitivityAnalysis", "analysisBy", "analysisDate", recommendations, "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 0),'DEMO-EST-REF-1'),COALESCE((SELECT "estimateNumber" FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 0),'EST-DEMO-R01'),'Harbour Grill Kitchen Refurbishment','Medium',42.50,
   '[{"riskId":"R1","category":"Financial","description":"SS304 mill price volatility over 45-day validity","probability":"High","impact":"Medium","riskScore":60,"mitigationStrategy":"Lock supplier contract rate for 60 days","mitigationCost":35000,"residualRisk":"Low","owner":"Rajesh Kumar","status":"Mitigated"},{"riskId":"R2","category":"Schedule","description":"Night-shift-only site access window","probability":"Medium","impact":"Medium","riskScore":40,"mitigationStrategy":"Add 15% site labor premium","mitigationCost":85000,"residualRisk":"Low","owner":"Priya Sharma","status":"Accepted"}]',
   120000.00,122500.00,5.00,
   '[{"variable":"SS304 rate","baseValue":232,"minValue":218,"maxValue":260,"impactOnTotal":101800}]',
   'Deepak Joshi','2026-02-11 14:00:00','Proceed with 5% contingency; lock steel rate before submission.','Deepak Joshi','2026-02-11 14:00:00','2026-02-11 14:00:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 1),'DEMO-EST-REF-2'),COALESCE((SELECT "estimateNumber" FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 1),'EST-DEMO-R02'),'Blue Fig Banquet Kitchen Line','High',63.00,
   '[{"riskId":"R1","category":"Technical","description":"Imported combi ovens on 14-week lead time","probability":"High","impact":"High","riskScore":80,"mitigationStrategy":"Order long-lead equipment on LOI","mitigationCost":0,"residualRisk":"Medium","owner":"Deepak Joshi","status":"Identified"},{"riskId":"R2","category":"Resource","description":"Simultaneous mobilization with two other sites","probability":"Medium","impact":"High","riskScore":60,"mitigationStrategy":"Pre-book MEP subcontractor crews","mitigationCost":60000,"residualRisk":"Medium","owner":"Priya Sharma","status":"Identified"},{"riskId":"R3","category":"External","description":"Hotel operating floor above work area — noise limits","probability":"Medium","impact":"Medium","riskScore":40,"mitigationStrategy":"Prefabricate maximum scope in workshop","mitigationCost":45000,"residualRisk":"Low","owner":"Rajesh Kumar","status":"Mitigated"}]',
   105000.00,425600.00,8.00,
   '[{"variable":"MEP subcontract","baseValue":1240000,"minValue":1160000,"maxValue":1380000,"impactOnTotal":140000}]',
   'Deepak Joshi','2026-03-05 10:30:00','Raise contingency to 8%; secure LOI for long-lead imports before final pricing.','Deepak Joshi','2026-03-05 10:30:00','2026-03-05 10:30:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 2),'DEMO-EST-REF-3'),COALESCE((SELECT "estimateNumber" FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 2),'EST-DEMO-R03'),'Campus Dining Dishwash Upgrade','Low',22.00,
   '[{"riskId":"R1","category":"Schedule","description":"Work restricted to semester break window","probability":"Low","impact":"Medium","riskScore":25,"mitigationStrategy":"Two-shift installation plan","mitigationCost":40000,"residualRisk":"Low","owner":"Priya Sharma","status":"Mitigated"}]',
   40000.00,32000.00,3.00,
   NULL,
   'Deepak Joshi','2026-03-19 09:15:00','Low risk; standard 3% contingency adequate.','Deepak Joshi','2026-03-19 09:15:00','2026-03-19 09:15:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 3),'DEMO-EST-REF-4'),COALESCE((SELECT "estimateNumber" FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 3),'EST-DEMO-R04'),'Metro Hospital Dietary Kitchen','High',68.50,
   '[{"riskId":"R1","category":"Technical","description":"SS316 hygiene spec with weld passivation on all seams","probability":"High","impact":"High","riskScore":80,"mitigationStrategy":"Subcontract passivation to certified partner","mitigationCost":95000,"residualRisk":"Low","owner":"Deepak Joshi","status":"Mitigated"},{"riskId":"R2","category":"External","description":"Infection-control permits for working in live hospital","probability":"Medium","impact":"High","riskScore":60,"mitigationStrategy":"Dedicated compliance officer during installation","mitigationCost":120000,"residualRisk":"Medium","owner":"Anita Desai","status":"Identified"}]',
   215000.00,309600.00,8.00,
   '[{"variable":"SS316 rate","baseValue":342,"minValue":320,"maxValue":380,"impactOnTotal":180300}]',
   'Deepak Joshi','2026-04-23 11:00:00','Price SS316 at contract rate; include compliance officer as a priced line item.','Deepak Joshi','2026-04-23 11:00:00','2026-04-23 11:00:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 4),'DEMO-EST-REF-5'),COALESCE((SELECT "estimateNumber" FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 4),'EST-DEMO-R05'),'Golden Spoon 3-Store Franchise Kit','Medium',45.00,
   '[{"riskId":"R1","category":"Schedule","description":"Three parallel store handover dates","probability":"Medium","impact":"High","riskScore":60,"mitigationStrategy":"Stagger production in two batches","mitigationCost":0,"residualRisk":"Medium","owner":"Priya Sharma","status":"Accepted"},{"riskId":"R2","category":"Financial","description":"Freight cost volatility on interstate dispatch","probability":"Medium","impact":"Low","riskScore":30,"mitigationStrategy":"Fix freight with annual transport contract","mitigationCost":25000,"residualRisk":"Low","owner":"Anita Desai","status":"Mitigated"}]',
   25000.00,306000.00,5.00,
   '[{"variable":"Freight","baseValue":310000,"minValue":290000,"maxValue":365000,"impactOnTotal":46500}]',
   'Deepak Joshi','2026-06-10 12:30:00','Standard 5% contingency; batch production to protect handover dates.','Deepak Joshi','2026-06-10 12:30:00','2026-06-10 12:30:00'),
  (:company,COALESCE((SELECT id::text FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 5),'DEMO-EST-REF-6'),COALESCE((SELECT "estimateNumber" FROM estimation_cost_estimates WHERE "estimateNumber" LIKE 'EST-DEMO-%' ORDER BY "estimateNumber" LIMIT 1 OFFSET 5),'EST-DEMO-R06'),'Lakeside Spa Cafe Kitchen','Medium',38.00,
   '[{"riskId":"R1","category":"External","description":"Coastal humidity — corrosion on exposed fasteners","probability":"Medium","impact":"Medium","riskScore":40,"mitigationStrategy":"Specify SS316 fasteners and hinges throughout","mitigationCost":30000,"residualRisk":"Low","owner":"Rajesh Kumar","status":"Mitigated"}]',
   30000.00,94500.00,4.50,
   NULL,
   'Deepak Joshi','2026-08-12 10:00:00','Include SS316 hardware upgrade in base scope, not as option.','Deepak Joshi','2026-08-12 10:00:00','2026-08-12 10:00:00');

-- ---------------------------------------------------------------------------
-- 14. Win/loss records (aligned with CRM won/lost leads)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_win_loss_records WHERE "companyId" = :company;
INSERT INTO estimation_win_loss_records
  ("companyId", "estimateId", "estimateNumber", "projectName", "customerId", "customerName",
   status, currency, "estimatedAmount", "actualAmount", "competitorPrice", "competitorName",
   "priceVariancePercentage", "submissionDate", "decisionDate", "winLossReason",
   "lossFactors", "lessonsLearned", "estimatorId", "estimatorName", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-WL-01','EST-DEMO-WL01','Aurelia Grand Hotel — Banquet Kitchen',(SELECT id::text FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1),'Aurelia Grand Hotel','Won','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1),388000.00),401500.00,NULL,NULL,3.48,'2025-11-10','2025-12-02','Won on turnkey scope and 10-week delivery commitment',NULL,'["Bundling MEP works into one contract shortened negotiation"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),'Rajesh Kumar','Rajesh Kumar','2025-12-02 10:00:00','2025-12-02 10:00:00'),
  (:company,'DEMO-WL-02','EST-DEMO-WL02','Fjordline Cruises — Galley Retrofit',(SELECT id::text FROM crm_leads WHERE company='Fjordline Cruises USA' LIMIT 1),'Fjordline Cruises USA','Won','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Fjordline Cruises USA' LIMIT 1),415000.00),432000.00,455000.00,'Marine Galley Systems Inc.',4.10,'2025-12-08','2026-01-15','Won on marine-grade SS316 experience and certification pack',NULL,'["Certification portfolio is a differentiator in marine segment"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),'Rajesh Kumar','Rajesh Kumar','2026-01-15 10:00:00','2026-01-15 10:00:00'),
  (:company,'DEMO-WL-03','EST-DEMO-WL03','St. Aldric Medical Center — Dietary Kitchen',(SELECT id::text FROM crm_leads WHERE company='St. Aldric Medical Center' LIMIT 1),'St. Aldric Medical Center','Won','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='St. Aldric Medical Center' LIMIT 1),265000.00),265000.00,NULL,NULL,0.00,'2026-01-20','2026-02-25','Won on hygiene spec compliance and passivation capability',NULL,'["SS316 + passivation package resonates with healthcare buyers"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0003'),'Anita Desai','Anita Desai','2026-02-25 10:00:00','2026-02-25 10:00:00'),
  (:company,'DEMO-WL-04','EST-DEMO-WL04','Cedar & Salt — Central Production Kitchen',(SELECT id::text FROM crm_leads WHERE company='Cedar & Salt Restaurant Group' LIMIT 1),'Cedar & Salt Restaurant Group','Won','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Cedar & Salt Restaurant Group' LIMIT 1),118000.00),121500.00,NULL,NULL,2.97,'2026-02-14','2026-03-10','Won as repeat account; matched FY25-26 rate card',NULL,'["Repeat customers respond well to held rate cards"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002'),'Priya Sharma','Priya Sharma','2026-03-10 10:00:00','2026-03-10 10:00:00'),
  (:company,'DEMO-WL-05','EST-DEMO-WL05','Brookfield Senior Living — Kitchen Modernization',(SELECT id::text FROM crm_leads WHERE company='Brookfield Senior Living' LIMIT 1),'Brookfield Senior Living','Won','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Brookfield Senior Living' LIMIT 1),152000.00),149000.00,158000.00,'CaterFit Solutions',-1.97,'2026-03-22','2026-04-30','Won on phased installation plan that kept dining operational',NULL,'["Phased installation plans win occupied-facility projects"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0003'),'Anita Desai','Anita Desai','2026-04-30 10:00:00','2026-04-30 10:00:00'),
  (:company,'DEMO-WL-06','EST-DEMO-WL06','Ferrante''s Trattoria — Compact Kitchen Line',(SELECT id::text FROM crm_leads WHERE company='Ferrante''s Trattoria' LIMIT 1),'Ferrante''s Trattoria','Won','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Ferrante''s Trattoria' LIMIT 1),47000.00),47000.00,NULL,NULL,0.00,'2026-05-05','2026-05-28','Won on standard catalogue pricing with quick 4-week delivery',NULL,NULL,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002'),'Priya Sharma','Priya Sharma','2026-05-28 10:00:00','2026-05-28 10:00:00'),
  (:company,'DEMO-WL-07','EST-DEMO-WL07','Northgate School District — Cafeteria Kitchens',(SELECT id::text FROM crm_leads WHERE company='Northgate School District' LIMIT 1),'Northgate School District','Lost','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Northgate School District' LIMIT 1),96000.00),NULL,84500.00,'EduKitchen Contracts LLC',13.60,'2025-11-25','2026-01-08','Lost on price in L1 tender; competitor bid 13.6% lower','[{"factor":"Price","impact":"High","notes":"Tender was pure L1; our overhead recovery rate uncompetitive for institutional work"},{"factor":"Specification","impact":"Low","notes":"Spec compliance was equal"}]','["Use institutional price list with reduced overhead allocation for L1 tenders"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),'Rajesh Kumar','Rajesh Kumar','2026-01-08 10:00:00','2026-01-08 10:00:00'),
  (:company,'DEMO-WL-08','EST-DEMO-WL08','Big Sky Steakhouse — Grill Line Upgrade',(SELECT id::text FROM crm_leads WHERE company='Big Sky Steakhouse' LIMIT 1),'Big Sky Steakhouse','Lost','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Big Sky Steakhouse' LIMIT 1),36000.00),NULL,33000.00,'Local fabricator',9.09,'2026-01-30','2026-02-20','Lost on price; customer chose local fabricator without SS certification','[{"factor":"Price","impact":"High","notes":"SMB segment highly price sensitive"},{"factor":"Timeline","impact":"Medium","notes":"Our 6-week lead vs competitor 3-week"}]','["Offer express lane for small standard jobs"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002'),'Priya Sharma','Priya Sharma','2026-02-20 10:00:00','2026-02-20 10:00:00'),
  (:company,'DEMO-WL-09','EST-DEMO-WL09','Copperleaf Tavern — Kitchen Refresh',(SELECT id::text FROM crm_leads WHERE company='Copperleaf Tavern' LIMIT 1),'Copperleaf Tavern','Lost','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Copperleaf Tavern' LIMIT 1),32000.00),NULL,NULL,NULL,NULL,'2026-03-15','2026-04-18','Lost — project deferred after customer budget review','[{"factor":"Budget","impact":"High","notes":"Customer postponed capex; not a competitive loss"}]','["Track deferred projects for FY27 re-engagement"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0003'),'Anita Desai','Anita Desai','2026-04-18 10:00:00','2026-04-18 10:00:00'),
  (:company,'DEMO-WL-10','EST-DEMO-WL10','Shamrock Sports Bar — Fry Station Package',(SELECT id::text FROM crm_leads WHERE company='Shamrock Sports Bar' LIMIT 1),'Shamrock Sports Bar','Lost','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Shamrock Sports Bar' LIMIT 1),21000.00),NULL,19500.00,'QuickKitch Supply',7.69,'2026-05-12','2026-06-05','Lost on timeline; customer needed installation before season opening','[{"factor":"Timeline","impact":"High","notes":"Production slots full in May; quoted 8 weeks"},{"factor":"Price","impact":"Low","notes":"Price gap was minor"}]','["Reserve monthly capacity buffer for quick-turn SMB work"]',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002'),'Priya Sharma','Priya Sharma','2026-06-05 10:00:00','2026-06-05 10:00:00'),
  (:company,'DEMO-WL-11','EST-DEMO-WL11','Whitaker''s Diner — Counter and Cold Line',(SELECT id::text FROM crm_leads WHERE company='Whitaker''s Diner' LIMIT 1),'Whitaker''s Diner','Lost','INR',COALESCE((SELECT "estimatedValue" FROM crm_leads WHERE company='Whitaker''s Diner' LIMIT 1),18000.00),NULL,16200.00,'Used-equipment dealer',11.11,'2026-06-25','2026-07-20','Lost to refurbished equipment alternative; spec downgraded by customer','[{"factor":"Specification","impact":"High","notes":"Customer accepted used equipment; new-build could not compete"},{"factor":"Price","impact":"Medium","notes":"11% gap vs refurbished"}]',NULL,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001'),'Rajesh Kumar','Rajesh Kumar','2026-07-20 10:00:00','2026-07-20 10:00:00');

-- ---------------------------------------------------------------------------
-- 15. Report schedules
-- ---------------------------------------------------------------------------
DELETE FROM estimation_report_schedules WHERE "companyId" = :company;
INSERT INTO estimation_report_schedules
  ("companyId", "reportType", frequency, "dayOfWeek", "dayOfMonth", time, format,
   recipients, "isActive", "lastRunAt", "nextRunAt", "createdAt", "updatedAt")
VALUES
  (:company,'win-loss-summary','monthly',NULL,'1','08:00','pdf','["rajesh.kumar@b3macbis.com","anita.desai@b3macbis.com"]',true,'2026-09-01 08:00:00','2026-10-01 08:00:00','2025-10-10 09:00:00','2026-09-01 08:00:05'),
  (:company,'estimate-accuracy','quarterly',NULL,'5','09:00','excel','["rajesh.kumar@b3macbis.com","cfo@b3macbis.com"]',true,'2026-07-05 09:00:00','2026-10-05 09:00:00','2025-10-10 09:05:00','2026-07-05 09:00:04'),
  (:company,'pipeline-value','weekly','Monday',NULL,'08:30','pdf','["sales-leads@b3macbis.com"]',true,'2026-09-07 08:30:00','2026-09-14 08:30:00','2025-10-10 09:10:00','2026-09-07 08:30:03'),
  (:company,'markup-compliance','monthly',NULL,'3','10:00','excel','["anita.desai@b3macbis.com"]',true,'2026-09-03 10:00:00','2026-10-03 10:00:00','2025-11-05 09:00:00','2026-09-03 10:00:06'),
  (:company,'cost-variance','weekly','Friday',NULL,'17:00','csv','["deepak.joshi@b3macbis.com","priya.sharma@b3macbis.com"]',true,'2026-09-04 17:00:00','2026-09-11 17:00:00','2025-11-05 09:05:00','2026-09-04 17:00:02'),
  (:company,'monthly-estimation-kpi','monthly',NULL,'2','09:30','powerpoint','["md@b3macbis.com","rajesh.kumar@b3macbis.com"]',false,'2026-06-02 09:30:00',NULL,'2026-01-12 09:00:00','2026-06-15 11:00:00');

-- ---------------------------------------------------------------------------
-- 16. Workflow stage settings (estimate lifecycle)
-- ---------------------------------------------------------------------------
DELETE FROM estimation_workflow_stage_settings WHERE "companyId" = :company;
INSERT INTO estimation_workflow_stage_settings
  ("companyId", "stageCode", "stageName", "stageOrder", description, "approverRole",
   "approvalRequired", "autoAdvance", "notifyOnEntry", "notifyOnApproval",
   "maxDaysInStage", "escalationEnabled", "escalationDays", "escalateTo",
   "allowReject", "allowRevision", status, "createdAt", "updatedAt")
VALUES
  (:company,'DRAFT','Draft',1,'Estimator builds BOQ and cost lines','Estimator',false,false,false,false,5,false,0,NULL,false,true,'active','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'BOQ_REVIEW','BOQ Review',2,'Senior estimator checks quantities against drawings','Senior Estimator',true,false,true,true,3,true,2,'Estimation Manager',true,true,'active','2025-10-01 09:05:00','2025-10-01 09:05:00'),
  (:company,'COSTING','Costing & Rate Application',3,'Apply rate cards, overheads and subcontract quotes','Estimator',false,true,false,false,4,true,3,'Estimation Manager',false,true,'active','2025-10-01 09:10:00','2025-10-01 09:10:00'),
  (:company,'MARKUP_REVIEW','Markup & Pricing Review',4,'Markup within category bands; exceptions flagged','Estimation Manager',true,false,true,true,2,true,2,'GM Sales',true,true,'active','2025-10-01 09:15:00','2025-10-01 09:15:00'),
  (:company,'MGMT_APPROVAL','Management Approval',5,'Required above approval threshold or below min markup','GM Sales',true,false,true,true,3,true,2,'Managing Director',true,true,'active','2025-10-01 09:20:00','2025-10-01 09:20:00'),
  (:company,'SENT','Sent to Customer',6,'Estimate issued; validity tracking active','Sales Executive',false,false,true,false,45,true,30,'Sales Manager',false,true,'active','2025-10-01 09:25:00','2025-10-01 09:25:00'),
  (:company,'CLOSED','Closed (Won/Lost)',7,'Outcome recorded to win-loss register','Sales Executive',false,false,true,false,0,false,0,NULL,false,false,'active','2025-10-01 09:30:00','2025-10-01 09:30:00');
