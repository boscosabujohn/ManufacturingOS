-- Demo seed — After-Sales Service + Project (BOQ / surveys / approvals) for B3 MACBIS.
-- Context: installed commercial kitchen equipment at customer sites (combi ovens,
-- blast chillers, dishwashers) plus the three seeded projects
-- (PRJ-2026-0001 Grand Hyatt kitchen, PRJ-2026-0005 solar, PRJ-2026-0006 automation).
-- Idempotent: clears demo rows first, then re-inserts.
-- Delete predicates (documented per table):
--   complaint                  "complaintNumber" LIKE 'DEMO-CMP-%'
--   customer_feedback          "feedbackNumber"  LIKE 'DEMO-FB-%'
--   feedback_analytics         "generatedBy" = 'demo-seed'
--   after_sales_knowledge_base title IN (explicit list)
--   after_sales_spare_parts    "partNumber" LIKE 'DEMO-SP-%'
--   as_knowledge_faqs          question IN (explicit list)
--   as_knowledge_manuals       title IN (explicit list)
--   as_parts_movement          reference LIKE 'DEMO-PM-%'
--   as_service_analytics       data->>'seed' = 'demo'
--   as_service_feedback        reference LIKE 'DEMO-SF-%'
--   as_troubleshooting_guides  title IN (explicit list)
--   boqs / boq_items / site_surveys / discrepancy_logs / external_approvals /
--   project_attachments        keyed to demo projects PRJ-2026-0001/0005/0006
-- Note: none of these 17 tables carries a companyId column.

-- ============================================================================
-- AFTER-SALES: spare parts catalog (before as_parts_movement)
-- ============================================================================
DELETE FROM after_sales_spare_parts WHERE "partNumber" LIKE 'DEMO-SP-%';
INSERT INTO after_sales_spare_parts
  ("partNumber", name, description, category, price, "stockLevel", compatibility, "leadTimeDays", "isActive", "createdAt", "updatedAt")
VALUES
  ('DEMO-SP-001','Combi Oven Door Gasket','Silicone door gasket for 10-tray combi ovens, high-temp rated','Gaskets & Seals',185.00,42,'CV-Pro 10,CV-Pro 20,SteamMax 10',5,true,'2025-10-05 09:00:00','2026-06-10 09:00:00'),
  ('DEMO-SP-002','Combi Oven Heating Element 9kW','Immersion heating element 9kW / 400V for combi steam generator','Heating Elements',640.00,14,'CV-Pro 10,CV-Pro 20',10,true,'2025-10-05 09:05:00','2026-05-18 09:00:00'),
  ('DEMO-SP-003','Combi Oven Control PCB','Main controller PCB with display driver, firmware v4.2','Electronics',1250.00,8,'CV-Pro 10,CV-Pro 20,CV-Pro 6',15,true,'2025-10-12 10:00:00','2026-07-02 09:00:00'),
  ('DEMO-SP-004','Blast Chiller Compressor 1.5HP','Hermetic R452A compressor for blast chillers up to 50kg','Compressors',980.00,6,'ChillRapid 50,ChillRapid 80',20,true,'2025-10-12 10:10:00','2026-08-14 09:00:00'),
  ('DEMO-SP-005','Chiller Evaporator Fan Motor','Axial fan motor 230V 34W with 300mm blade','Motors & Fans',145.00,25,'ChillRapid 50,ChillRapid 80,ColdStore 400',7,true,'2025-11-02 09:00:00','2026-04-20 09:00:00'),
  ('DEMO-SP-006','Dishwasher Rinse Pump','Rinse booster pump 0.37kW for hood-type dishwashers','Pumps',420.00,11,'WashPro H500,WashPro C900',12,true,'2025-11-02 09:15:00','2026-06-25 09:00:00'),
  ('DEMO-SP-007','Dishwasher Wash Arm Assembly','Stainless rotating wash arm with jets, upper position','Wash System',95.00,30,'WashPro H500',5,true,'2025-11-20 09:00:00','2026-03-15 09:00:00'),
  ('DEMO-SP-008','Solenoid Water Inlet Valve','Dual water inlet solenoid valve 3/4in 230V','Valves',68.00,48,'CV-Pro 10,WashPro H500,SteamMax 10',4,true,'2025-12-01 09:00:00','2026-05-05 09:00:00'),
  ('DEMO-SP-009','Fryer Thermostat 0-200C','Capillary thermostat with safety cut-out for gas fryers','Controls',110.00,22,'FryMaster G20,FryMaster G40',6,true,'2025-12-15 09:00:00','2026-07-19 09:00:00'),
  ('DEMO-SP-010','Griddle Plate Scraper Kit','Consumable scraper blades and handle kit for chrome griddles','Consumables',35.00,60,'GrillChef 900,GrillChef 600',3,true,'2026-01-10 09:00:00','2026-08-01 09:00:00');

-- ============================================================================
-- AFTER-SALES: parts movement (requisition / consumption / return)
-- ============================================================================
DELETE FROM as_parts_movement WHERE reference LIKE 'DEMO-PM-%';
INSERT INTO as_parts_movement
  (movement_type, reference, job_number, engineer, customer_name, status, priority, total_items, total_value, warehouse, reason, items, created_at, updated_at)
VALUES
  ('requisition','DEMO-PM-REQ-001','FSJ-2026-0142','Vikram Singh','Blue Fig Hotels Group','issued','high',2,825.00,'Main Service Store','Combi oven E03 steam fault — gasket + element','[{"part":"DEMO-SP-001","qty":1,"value":185.00},{"part":"DEMO-SP-002","qty":1,"value":640.00}]'::jsonb,'2026-02-03 08:40:00','2026-02-03 14:10:00'),
  ('requisition','DEMO-PM-REQ-002','FSJ-2026-0158','Suresh Patel','Metro Hospital Kitchens','issued','critical',1,980.00,'Main Service Store','Blast chiller compressor seized — replacement unit','[{"part":"DEMO-SP-004","qty":1,"value":980.00}]'::jsonb,'2026-03-11 09:15:00','2026-03-11 11:30:00'),
  ('requisition','DEMO-PM-REQ-003','FSJ-2026-0171','Amit Verma','Harbour Grill Restaurants','pending','medium',2,163.00,'West Coast Depot','Dishwasher wash arm + inlet valve for PM visit','[{"part":"DEMO-SP-007","qty":1,"value":95.00},{"part":"DEMO-SP-008","qty":1,"value":68.00}]'::jsonb,'2026-06-18 10:00:00','2026-06-18 10:00:00'),
  ('requisition','DEMO-PM-REQ-004','FSJ-2026-0180','Deepak Joshi','Golden Spoon Franchises','approved','low',1,110.00,'Main Service Store','Fryer thermostat drift beyond tolerance','[{"part":"DEMO-SP-009","qty":1,"value":110.00}]'::jsonb,'2026-07-22 09:30:00','2026-07-23 08:00:00'),
  ('consumption','DEMO-PM-CON-001','FSJ-2026-0142','Vikram Singh','Blue Fig Hotels Group','completed','high',2,825.00,'Main Service Store','Fitted on-site; old parts scrapped','[{"part":"DEMO-SP-001","qty":1},{"part":"DEMO-SP-002","qty":1}]'::jsonb,'2026-02-04 16:20:00','2026-02-04 16:20:00'),
  ('consumption','DEMO-PM-CON-002','FSJ-2026-0158','Suresh Patel','Metro Hospital Kitchens','completed','critical',1,980.00,'Main Service Store','Compressor swapped, system regassed R452A','[{"part":"DEMO-SP-004","qty":1}]'::jsonb,'2026-03-12 17:45:00','2026-03-12 17:45:00'),
  ('consumption','DEMO-PM-CON-003','FSJ-2026-0163','Ravi Menon','Lakeside Resort & Spa','completed','medium',2,213.00,'East Depot','PM kit consumed — fan motor + griddle scraper kit','[{"part":"DEMO-SP-005","qty":1},{"part":"DEMO-SP-010","qty":2}]'::jsonb,'2026-04-09 15:00:00','2026-04-09 15:00:00'),
  ('return','DEMO-PM-RET-001','FSJ-2026-0149','Kiran Reddy','Campus Dining Co-op','completed','low',1,1250.00,'Main Service Store','Control PCB not required — fault was wiring loom','[{"part":"DEMO-SP-003","qty":1,"condition":"unused"}]'::jsonb,'2026-02-25 12:00:00','2026-02-26 09:00:00'),
  ('return','DEMO-PM-RET-002','FSJ-2026-0171','Amit Verma','Harbour Grill Restaurants','pending','low',1,68.00,'West Coast Depot','Inlet valve wrong variant (1/2in needed)','[{"part":"DEMO-SP-008","qty":1,"condition":"unused"}]'::jsonb,'2026-06-21 09:40:00','2026-06-21 09:40:00');

-- ============================================================================
-- AFTER-SALES: knowledge base
-- ============================================================================
DELETE FROM after_sales_knowledge_base WHERE title IN (
  'CV-Pro Combi Oven Error Code Reference',
  'ChillRapid Blast Chiller Pull-Down Failure Checklist',
  'WashPro H500 Daily Cleaning Procedure',
  'Steam Generator Descaling Guide (CV-Pro Series)',
  'FryMaster Gas Fryer Pilot & Thermostat Service Notes',
  'Preventive Maintenance Schedule — Commercial Kitchen Line');
INSERT INTO after_sales_knowledge_base
  (title, content, category, tags, "productModel", "fileUrl", author, "viewCount", "isActive", "createdAt", "updatedAt")
VALUES
  ('CV-Pro Combi Oven Error Code Reference','Full listing of CV-Pro fault codes. E01 temperature probe open circuit, E03 steam generator low water / scale, E05 fan motor overtemp, E09 door switch fault, E12 control PCB communication loss. Each code includes probable cause, field checks and part numbers.','Troubleshooting','combi-oven,error-codes,cv-pro','CV-Pro 10/20','/kb/demo/cv-pro-error-codes.pdf','Sanjay Malhotra',412,true,'2025-10-08 09:00:00','2026-06-01 09:00:00'),
  ('ChillRapid Blast Chiller Pull-Down Failure Checklist','Step-by-step diagnosis when a blast chiller fails the 90-minute pull-down test: condenser coil blockage, evaporator fan rotation, refrigerant charge, compressor start relay, door gasket integrity.','Troubleshooting','blast-chiller,compressor,refrigeration','ChillRapid 50/80','/kb/demo/chillrapid-pulldown.pdf','Suresh Patel',287,true,'2025-10-20 09:00:00','2026-05-12 09:00:00'),
  ('WashPro H500 Daily Cleaning Procedure','Operator-facing daily routine: drain and flush wash tank, remove and rinse wash/rinse arms, clean strainer baskets, wipe door seals, check rinse-aid and detergent levels.','Manual','dishwasher,cleaning,operator','WashPro H500','/kb/demo/washpro-daily-clean.pdf','Meera Nair',530,true,'2025-11-05 09:00:00','2026-04-22 09:00:00'),
  ('Steam Generator Descaling Guide (CV-Pro Series)','Quarterly descaling procedure for hard-water sites: isolate supply, dose descaler through fill port, run generator flush cycle twice, verify E03 counter reset. Mandatory for warranty retention above 200 ppm CaCO3.','Repair Guide','descaling,steam-generator,warranty','CV-Pro 10/20','/kb/demo/cv-pro-descale.pdf','Vikram Singh',198,true,'2025-12-02 09:00:00','2026-07-08 09:00:00'),
  ('FryMaster Gas Fryer Pilot & Thermostat Service Notes','Service notes covering pilot outage, thermocouple replacement, thermostat calibration against a reference probe at 180C, and gas pressure checks at the combination valve.','Repair Guide','fryer,gas,thermostat','FryMaster G20/G40','/kb/demo/frymaster-service.pdf','Deepak Joshi',154,true,'2026-01-15 09:00:00','2026-08-03 09:00:00'),
  ('Preventive Maintenance Schedule — Commercial Kitchen Line','Recommended PM intervals for the installed base: combi ovens quarterly, refrigeration six-monthly coil clean, dishwashers monthly limescale check, gas equipment annual combustion check.','Technical Specification','preventive-maintenance,schedule','All models','/kb/demo/pm-schedule.pdf','Sanjay Malhotra',345,true,'2026-02-01 09:00:00','2026-08-20 09:00:00');

-- ============================================================================
-- AFTER-SALES: knowledge FAQs
-- ============================================================================
DELETE FROM as_knowledge_faqs WHERE question IN (
  'What does error code E03 on my CV-Pro combi oven mean?',
  'How often should the combi oven steam generator be descaled?',
  'Why is my blast chiller not reaching -18C in freeze mode?',
  'The dishwasher leaves streaks on glassware — what should I check?',
  'Is compressor replacement covered under the standard warranty?',
  'How do I order spare parts for out-of-warranty equipment?',
  'What is the response time for a critical breakdown call?',
  'Can I get operator training for new kitchen staff?');
INSERT INTO as_knowledge_faqs
  (question, answer, category, helpful, unhelpful, views, featured, status, "createdAt", "updatedAt")
VALUES
  ('What does error code E03 on my CV-Pro combi oven mean?','E03 indicates low water or scale build-up in the steam generator. Check the water supply valve is open, then run the descale cycle. If the code returns, log a service call — the level probe or fill solenoid may need replacement.','Combi Ovens',96,4,820,true,'active','2025-10-10 09:00:00','2026-06-15 09:00:00'),
  ('How often should the combi oven steam generator be descaled?','Quarterly for water hardness above 200 ppm, six-monthly otherwise. Descaling is mandatory for warranty retention on hard-water sites.','Combi Ovens',61,2,455,false,'active','2025-10-10 09:05:00','2026-05-01 09:00:00'),
  ('Why is my blast chiller not reaching -18C in freeze mode?','Most common causes: blocked condenser coil, evaporator fan failure, or a worn door gasket letting warm air in. Clean the condenser first; if pull-down still fails, request an engineer visit for a refrigerant and compressor check.','Refrigeration',74,5,610,true,'active','2025-10-25 09:00:00','2026-07-11 09:00:00'),
  ('The dishwasher leaves streaks on glassware — what should I check?','Check rinse-aid level and dosing rate, clean the rinse arm jets, and confirm rinse temperature reaches 82C. Persistent streaking usually indicates limescale — book a descale service.','Dishwashers',48,3,390,false,'active','2025-11-08 09:00:00','2026-04-28 09:00:00'),
  ('Is compressor replacement covered under the standard warranty?','Yes — compressors are covered for 24 months from commissioning under the standard warranty, provided PM visits were completed on schedule. Extended warranty plans cover up to 60 months.','Warranty',82,6,700,true,'active','2025-11-18 09:00:00','2026-08-05 09:00:00'),
  ('How do I order spare parts for out-of-warranty equipment?','Raise a parts request through the customer portal or call the service desk with the equipment serial number. Genuine parts ship from the main service store; typical lead time is 3-15 working days.','Spare Parts',39,1,280,false,'active','2025-12-05 09:00:00','2026-06-30 09:00:00'),
  ('What is the response time for a critical breakdown call?','Critical calls (equipment down in a live kitchen) are dispatched within 4 business hours in metro areas and 24 hours elsewhere, per the standard SLA. AMC customers get priority routing.','Service & SLA',57,2,512,true,'active','2026-01-08 09:00:00','2026-08-18 09:00:00'),
  ('Can I get operator training for new kitchen staff?','Yes. On-site operator refresher sessions are free within the first year after commissioning and chargeable thereafter. Contact your account manager to schedule.','Training',22,0,150,false,'active','2026-02-12 09:00:00','2026-07-25 09:00:00');

-- ============================================================================
-- AFTER-SALES: knowledge manuals
-- ============================================================================
DELETE FROM as_knowledge_manuals WHERE title IN (
  'CV-Pro 10 Combi Oven — Installation & Operation Manual',
  'CV-Pro 20 Combi Oven — Service Manual',
  'ChillRapid 50 Blast Chiller — User Guide',
  'WashPro H500 Hood Dishwasher — Installation Manual',
  'FryMaster G20 Gas Fryer — Operation & Safety Manual',
  'GrillChef 900 Griddle — Quick Start Guide');
INSERT INTO as_knowledge_manuals
  (title, "productModel", description, category, author, "datePublished", "fileSize", format, downloads, rating, views, language, pages, versions, featured, "createdAt", "updatedAt")
VALUES
  ('CV-Pro 10 Combi Oven — Installation & Operation Manual','CV-Pro 10','Installation clearances, water/drain/power connections, first commissioning and daily operation of the 10-tray combi oven.','Combi Ovens','B3 Technical Publications','2025-09-15','8.4 MB','pdf',342,4.6,1210,'English',86,3,true,'2025-10-01 09:00:00','2026-05-20 09:00:00'),
  ('CV-Pro 20 Combi Oven — Service Manual','CV-Pro 20','Engineer-level service manual: wiring diagrams, fault codes, component test values and exploded parts views.','Combi Ovens','B3 Technical Publications','2025-09-15','15.2 MB','pdf',187,4.8,640,'English',148,2,true,'2025-10-01 09:10:00','2026-06-14 09:00:00'),
  ('ChillRapid 50 Blast Chiller — User Guide','ChillRapid 50','Chill and freeze cycle operation, core probe use, HACCP data export and routine cleaning.','Refrigeration','B3 Technical Publications','2025-10-20','5.1 MB','pdf',256,4.4,890,'English',54,2,false,'2025-11-01 09:00:00','2026-04-10 09:00:00'),
  ('WashPro H500 Hood Dishwasher — Installation Manual','WashPro H500','Site requirements, water softener sizing, chemical dosing setup and commissioning checklist for the hood-type dishwasher.','Dishwashers','B3 Technical Publications','2025-11-10','6.7 MB','pdf',143,4.2,420,'English',62,1,false,'2025-11-25 09:00:00','2026-03-30 09:00:00'),
  ('FryMaster G20 Gas Fryer — Operation & Safety Manual','FryMaster G20','Gas safety notices, lighting procedure, oil management and boil-out cleaning instructions.','Fryers','B3 Technical Publications','2025-12-05','4.3 MB','pdf',98,4.1,310,'English',40,1,false,'2026-01-05 09:00:00','2026-07-15 09:00:00'),
  ('GrillChef 900 Griddle — Quick Start Guide','GrillChef 900','One-page start-up, temperature zoning and end-of-day scrape-down guide for the 900mm chrome griddle.','Griddles','B3 Technical Publications','2026-01-20','1.2 MB','pdf',77,4.0,205,'English',8,1,false,'2026-02-10 09:00:00','2026-08-08 09:00:00');

-- ============================================================================
-- AFTER-SALES: troubleshooting guides
-- ============================================================================
DELETE FROM as_troubleshooting_guides WHERE title IN (
  'Combi Oven Shows E03 and Stops Steaming',
  'Blast Chiller Runs but Fails 90-Minute Pull-Down',
  'Dishwasher Not Filling — WashPro H500',
  'Combi Oven Door Leaking Steam',
  'Gas Fryer Pilot Will Not Stay Lit',
  'Walk-In Chiller Temperature Creeping Above 5C');
INSERT INTO as_troubleshooting_guides
  (title, category, difficulty, estimated_time, symptom, steps, views, helpful, success_rate, status, created_at, updated_at)
VALUES
  ('Combi Oven Shows E03 and Stops Steaming','Combi Ovens','easy','20-30 min','Display shows E03, steam modes unavailable, convection still works','[{"step":1,"action":"Confirm water supply valve open and inlet strainer clear"},{"step":2,"action":"Run descale cycle per CV-Pro descaling guide"},{"step":3,"action":"Inspect level probe for scale; clean with descaler"},{"step":4,"action":"Test fill solenoid (DEMO-SP-008) coil resistance ~4k ohm"},{"step":5,"action":"If code persists, replace level probe and log service call"}]'::jsonb,742,131,86.50,'published','2025-10-15 09:00:00','2026-06-20 09:00:00'),
  ('Blast Chiller Runs but Fails 90-Minute Pull-Down','Refrigeration','medium','45-60 min','Compressor runs continuously, cabinet stalls around 4C, food fails chill cycle','[{"step":1,"action":"Clean condenser coil and verify airflow"},{"step":2,"action":"Check evaporator fan (DEMO-SP-005) spins freely and correct direction"},{"step":3,"action":"Inspect door gasket for tears and cold-air leaks"},{"step":4,"action":"Check sight glass for flash gas — possible low charge"},{"step":5,"action":"Measure compressor amps vs nameplate; replace (DEMO-SP-004) if seized"}]'::jsonb,455,89,78.25,'published','2025-10-28 09:00:00','2026-07-05 09:00:00'),
  ('Dishwasher Not Filling — WashPro H500','Dishwashers','easy','15-25 min','Cycle starts but tank stays empty, low-water alarm after 3 minutes','[{"step":1,"action":"Verify site stopcock open and supply pressure above 2 bar"},{"step":2,"action":"Clean inlet valve filter screen"},{"step":3,"action":"Test inlet solenoid valve (DEMO-SP-008) for coil continuity"},{"step":4,"action":"Check air-break/pressure switch tube for kinks or scale"}]'::jsonb,388,64,90.10,'published','2025-11-12 09:00:00','2026-05-15 09:00:00'),
  ('Combi Oven Door Leaking Steam','Combi Ovens','easy','10-15 min','Visible steam escaping around door edge during steam modes','[{"step":1,"action":"Inspect door gasket (DEMO-SP-001) for compression set or splits"},{"step":2,"action":"Check hinge adjustment and door alignment"},{"step":3,"action":"Replace gasket if hardened; torque hinge bolts to spec"}]'::jsonb,290,52,93.00,'published','2025-12-08 09:00:00','2026-04-18 09:00:00'),
  ('Gas Fryer Pilot Will Not Stay Lit','Fryers','medium','30-45 min','Pilot lights but goes out when knob released','[{"step":1,"action":"Hold pilot for full 30 seconds before releasing"},{"step":2,"action":"Check thermocouple tip position in pilot flame"},{"step":3,"action":"Measure thermocouple mV output (>15mV closed circuit)"},{"step":4,"action":"Replace thermocouple or gas valve magnet unit as indicated"}]'::jsonb,215,40,81.75,'published','2026-01-22 09:00:00','2026-08-12 09:00:00'),
  ('Walk-In Chiller Temperature Creeping Above 5C','Refrigeration','hard','60-90 min','Gradual temperature rise over days, compressor short-cycling','[{"step":1,"action":"Check evaporator for ice build-up; force defrost cycle"},{"step":2,"action":"Verify defrost heater continuity and timer settings"},{"step":3,"action":"Inspect door heater and strip curtains"},{"step":4,"action":"Leak-test system if charge low; repair and recharge"},{"step":5,"action":"Log HACCP temperature excursion with site manager"}]'::jsonb,168,29,72.40,'published','2026-02-18 09:00:00','2026-08-28 09:00:00');

-- ============================================================================
-- AFTER-SALES: complaints
-- ============================================================================
DELETE FROM complaint WHERE "complaintNumber" LIKE 'DEMO-CMP-%';
INSERT INTO complaint
  ("complaintNumber", status, severity, "customerId", "customerName", "contactPerson", "contactPhone", "contactEmail",
   "serviceTicketId", "engineerId", "complaintDate", "complaintChannel", "complaintCategory", "complaintSubject",
   "complaintDescription", "customerImpact", "businessImpact", "financialImpact", "serviceDate",
   acknowledged, "acknowledgedDate", "acknowledgedBy", "investigationStarted", "investigatedBy",
   "rootCauseIdentified", "rootCause", "actionPlan", "actionOwner",
   "resolutionNotes", "resolutionDate", "resolvedBy", "resolutionMethod",
   escalated, "escalationLevel", "escalatedTo",
   "compensationOffered", "compensationType", "compensationAmount",
   "closedDate", "closedBy", "createdBy", "createdAt", "updatedAt")
VALUES
  ('DEMO-CMP-2026-001','closed','high',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' LIMIT 1),'Blue Fig Hotels Group','Amelia Torres','+1-212-555-0132','amelia@bluefighotels.com',
   (SELECT id::text FROM support_tickets WHERE "ticketNumber"='TKT-SLA-004' LIMIT 1),'EMP0004','2026-02-05 10:30:00','email','product_issue','Combi oven E03 recurring within a week of repair',
   'CV-Pro 20 in the banquet kitchen threw E03 again five days after the gasket and element were replaced. Two banquet services were disrupted.','high','Two banquet events required menu changes',3500.00,'2026-02-04',
   true,'2026-02-05','Sanjay Malhotra',true,'Vikram Singh',
   true,'Descale cycle not run after element replacement; scale re-tripped the level probe','Re-descale on site, retrain engineers to close jobs only after descale verification','Vikram Singh',
   'Steam generator descaled, probe cleaned, 30-day monitoring showed no recurrence','2026-02-12','Vikram Singh','repair',
   false,NULL,NULL,
   true,'free_service',450.00,
   '2026-03-05','Sanjay Malhotra','service-desk','2026-02-05 10:30:00','2026-03-05 17:00:00'),
  ('DEMO-CMP-2026-002','resolved','critical',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' LIMIT 1),'Metro Hospital Kitchens','Dr. Karen Ng','+1-312-555-0193','karen@metrohospital.org',
   NULL,'EMP0005','2026-03-10 07:50:00','phone','product_issue','Blast chiller compressor failure — patient meal service at risk',
   'ChillRapid 80 compressor seized overnight. Hospital HACCP process blocked without functional blast chilling; loaner unit demanded.','high','Patient meal cook-chill workflow suspended for 48 hours',6200.00,'2026-03-11',
   true,'2026-03-10','Sanjay Malhotra',true,'Suresh Patel',
   true,'Compressor start relay failed, seizing compressor under repeated locked-rotor starts','Replace compressor and relay; add relay check to PM checklist for all ChillRapid units','Suresh Patel',
   'Compressor replaced within SLA, loaner chiller provided for 2 days, PM checklist updated','2026-03-12','Suresh Patel','repair',
   true,1,'Service Manager',
   true,'credit_note',1200.00,
   NULL,NULL,'service-desk','2026-03-10 07:50:00','2026-03-14 12:00:00'),
  ('DEMO-CMP-2026-003','action_in_progress','medium',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' LIMIT 1),'Harbour Grill Restaurants','Marcus Lee','+1-415-555-0110','marcus@harbourgrill.com',
   NULL,'EMP0007','2026-06-20 14:15:00','web_portal','delay','Spare part for dishwasher on backorder for three weeks',
   'Wash arm assembly for the WashPro H500 has been pending since the June PM visit; glassware quality degrading.','medium','Manual polishing adding labour cost',800.00,'2026-06-18',
   true,'2026-06-21','Meera Nair',true,'Amit Verma',
   true,'Depot stock-out; replenishment PO delayed at supplier','Expedite via air freight; raise depot min-stock for fast movers','Amit Verma',
   NULL,NULL,NULL,NULL,
   false,NULL,NULL,
   false,NULL,NULL,
   NULL,NULL,'service-desk','2026-06-20 14:15:00','2026-07-02 09:30:00'),
  ('DEMO-CMP-2026-004','under_investigation','low',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' LIMIT 1),'Campus Dining Co-op','Raj Patel','+1-617-555-0155','raj@campusdining.edu',
   NULL,'EMP0008','2026-07-08 11:00:00','email','billing','Charged for PCB that was returned unused',
   'Invoice for the February call-out includes a control PCB that engineer Kiran returned to stores unused (return DEMO-PM-RET-001).','low','Disputed invoice on hold',1250.00,'2026-02-25',
   true,'2026-07-09','Accounts Desk',true,'Neha Agarwal',
   false,NULL,NULL,NULL,
   NULL,NULL,NULL,NULL,
   false,NULL,NULL,
   false,NULL,NULL,
   NULL,NULL,'service-desk','2026-07-08 11:00:00','2026-07-15 10:00:00'),
  ('DEMO-CMP-2026-005','resolved','medium',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','Priya Shah','+1-480-555-0214','priya@goldenspoon.com',
   NULL,'EMP0009','2026-04-14 09:20:00','whatsapp','engineer_behavior','Engineer arrived outside agreed service window',
   'PM visit booked for 07:00-09:00 pre-service window; engineer arrived 11:30 during lunch prep at the flagship store.','medium','Kitchen access disruption during lunch service',NULL,'2026-04-14',
   true,'2026-04-14','Sanjay Malhotra',true,'Sanjay Malhotra',
   true,'Dispatch double-booked the morning slot','Route-planning rule added: franchise kitchens locked to pre-service windows','Sanjay Malhotra',
   'Apology issued, next PM visit scheduled 06:30 with named engineer','2026-04-18','Sanjay Malhotra','apology',
   false,NULL,NULL,
   false,NULL,NULL,
   NULL,NULL,'service-desk','2026-04-14 09:20:00','2026-04-18 16:00:00'),
  ('DEMO-CMP-2026-006','escalated','high',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' LIMIT 1),'Lakeside Resort & Spa','Henrik Olsen','+1-305-555-0227','henrik@lakesideresort.com',
   NULL,'EMP0010','2026-08-02 16:40:00','phone','service_quality','Walk-in chiller fault recurring after two visits',
   'Walk-in chiller temperature keeps creeping above 5C. Two visits in July replaced the fan motor but the underlying defrost fault persists.','high','Daily HACCP excursions logged; stock loss risk',2100.00,'2026-07-28',
   true,'2026-08-03','Sanjay Malhotra',true,'Ravi Menon',
   true,'Intermittent defrost timer fault missed on first two visits','Senior refrigeration engineer assigned; timer and heater replacement scheduled','Ravi Menon',
   NULL,NULL,NULL,NULL,
   true,2,'Head of After-Sales',
   false,NULL,NULL,
   NULL,NULL,'service-desk','2026-08-02 16:40:00','2026-08-20 10:00:00'),
  ('DEMO-CMP-2026-007','acknowledged','low',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Summit Catering Services' LIMIT 1),'Summit Catering Services','Nina Alvarez','+1-303-555-0178','nina@summitcatering.com',
   NULL,NULL,'2026-08-25 13:10:00','web_portal','product_issue','Griddle temperature uneven across the plate',
   'GrillChef 900 shows a 40C spread between left and right zones; affects batch consistency for event catering.','low',NULL,NULL,NULL,
   true,'2026-08-26','Meera Nair',false,NULL,
   false,NULL,NULL,NULL,
   NULL,NULL,NULL,NULL,
   false,NULL,NULL,
   false,NULL,NULL,
   NULL,NULL,'service-desk','2026-08-25 13:10:00','2026-08-26 09:00:00'),
  ('DEMO-CMP-2026-008','registered','medium',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain' LIMIT 1),'Riverside Bistro Chain','Tom Becker','+1-206-555-0201','tom@riversidebistro.com',
   NULL,NULL,'2026-09-08 10:05:00','email','delay','Commissioning of new dishwasher delayed twice',
   'WashPro C900 delivered three weeks ago but commissioning visit postponed twice; unit still not in service.','medium','Hand-washing overtime costs accruing',600.00,NULL,
   false,NULL,NULL,false,NULL,
   false,NULL,NULL,NULL,
   NULL,NULL,NULL,NULL,
   false,NULL,NULL,
   false,NULL,NULL,
   NULL,NULL,'service-desk','2026-09-08 10:05:00','2026-09-08 10:05:00');

-- ============================================================================
-- AFTER-SALES: customer feedback (post-service surveys)
-- ============================================================================
DELETE FROM customer_feedback WHERE "feedbackNumber" LIKE 'DEMO-FB-%';
INSERT INTO customer_feedback
  ("feedbackNumber", "serviceTicketId", "customerId", "customerName", "contactPerson", "contactEmail",
   "feedbackChannel", "feedbackDate", "collectedBy", "serviceDate", "serviceType", "engineerId", "engineerName",
   "overallSatisfaction", "serviceQuality", "engineerProfessionalism", "responseTime", "problemResolution", communication,
   "npsRating", "npsCategory", "whatWentWell", "areasOfImprovement", sentiment, "sentimentScore", "keyPhrases",
   "actionRequired", "followUpRequired", "issueResolved", "engineerPraise", "likelyToRecommend", "repeatCustomer",
   "contractRenewalIntent", "createdAt", "updatedAt")
VALUES
  ('DEMO-FB-2026-001',NULL,
   (SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' LIMIT 1),'Blue Fig Hotels Group','Amelia Torres','amelia@bluefighotels.com',
   'email','2026-02-15 10:00:00','Auto Survey','2026-02-12 00:00:00','Breakdown Repair','EMP0004','Vikram Singh',
   4,4,5,3,5,4,8,'passive',
   'Vikram explained the descaling root cause clearly and fixed it for good','Initial repair should have caught the scale issue','positive',0.55,'clear explanation,root cause,fixed',
   false,false,true,true,true,true,'yes','2026-02-15 10:00:00','2026-02-15 10:00:00'),
  ('DEMO-FB-2026-002',NULL,
   (SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' LIMIT 1),'Metro Hospital Kitchens','Dr. Karen Ng','karen@metrohospital.org',
   'web_portal','2026-03-16 09:30:00','Auto Survey','2026-03-12 00:00:00','Breakdown Repair','EMP0005','Suresh Patel',
   5,5,5,5,5,5,10,'promoter',
   'Loaner chiller within hours and full repair inside the SLA — outstanding response','Nothing, keep it up','very_positive',0.92,'loaner unit,SLA,outstanding',
   false,false,true,true,true,true,'yes','2026-03-16 09:30:00','2026-03-16 09:30:00'),
  ('DEMO-FB-2026-003',NULL,
   (SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' LIMIT 1),'Lakeside Resort & Spa','Henrik Olsen','henrik@lakesideresort.com',
   'email','2026-04-12 11:00:00','Auto Survey','2026-04-09 00:00:00','Preventive Maintenance','EMP0010','Ravi Menon',
   4,4,4,4,4,4,8,'passive',
   'PM visit thorough, griddle refurbished nicely','Would like PM reports emailed same day','positive',0.48,'thorough,PM report',
   false,false,true,false,true,true,'yes','2026-04-12 11:00:00','2026-04-12 11:00:00'),
  ('DEMO-FB-2026-004',NULL,
   (SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','Priya Shah','priya@goldenspoon.com',
   'mobile_app','2026-04-20 15:20:00','Auto Survey','2026-04-14 00:00:00','Preventive Maintenance','EMP0009','Deepak Joshi',
   3,4,4,2,4,3,6,'detractor',
   'Work quality itself was fine','Timing — engineer arrived during lunch service despite the agreed window','neutral',-0.10,'late arrival,service window',
   true,true,true,false,false,true,'maybe','2026-04-20 15:20:00','2026-05-02 09:00:00'),
  ('DEMO-FB-2026-005',
   (SELECT id::text FROM support_tickets WHERE "ticketNumber"='TKT-SLA-005' LIMIT 1),
   (SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' LIMIT 1),'Campus Dining Co-op','Raj Patel','raj@campusdining.edu',
   'phone','2026-03-02 14:00:00','Meera Nair','2026-02-25 00:00:00','Breakdown Repair','EMP0008','Kiran Reddy',
   4,4,5,4,4,4,9,'promoter',
   'Kiran diagnosed a wiring loom fault instead of blindly swapping the PCB — saved us money','Billing later charged for the unused PCB anyway','positive',0.40,'honest diagnosis,billing issue',
   true,true,true,true,true,true,'yes','2026-03-02 14:00:00','2026-07-09 09:00:00'),
  ('DEMO-FB-2026-006',NULL,
   (SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' LIMIT 1),'Harbour Grill Restaurants','Marcus Lee','marcus@harbourgrill.com',
   'email','2026-06-25 10:40:00','Auto Survey','2026-06-18 00:00:00','Preventive Maintenance','EMP0007','Amit Verma',
   3,3,4,3,2,3,5,'detractor',
   'Engineer was professional and tidy','Job left open — wash arm part still on backorder three weeks later','neutral',-0.20,'backorder,parts delay',
   true,true,false,false,false,true,'maybe','2026-06-25 10:40:00','2026-07-02 09:00:00'),
  ('DEMO-FB-2026-007',NULL,
   (SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','Priya Shah','priya@goldenspoon.com',
   'web_portal','2026-07-28 09:10:00','Auto Survey','2026-07-24 00:00:00','Breakdown Repair','EMP0009','Deepak Joshi',
   5,5,5,4,5,5,9,'promoter',
   'Fryer thermostat replaced and calibrated in one visit before opening','None','very_positive',0.85,'one visit,calibrated,before opening',
   false,false,true,true,true,true,'yes','2026-07-28 09:10:00','2026-07-28 09:10:00'),
  ('DEMO-FB-2026-008',NULL,
   (SELECT id::text FROM crm_customers WHERE "customerName"='Summit Catering Services' LIMIT 1),'Summit Catering Services','Nina Alvarez','nina@summitcatering.com',
   'in_person','2026-08-30 12:00:00','Ravi Menon','2026-08-28 00:00:00','Inspection','EMP0010','Ravi Menon',
   4,4,4,4,3,5,8,'passive',
   'Griddle zoning issue inspected quickly and options explained well','Awaiting quote for burner rebalancing','positive',0.35,'quick inspection,clear options',
   false,true,false,false,true,true,'yes','2026-08-30 12:00:00','2026-08-30 12:00:00');

-- ============================================================================
-- AFTER-SALES: feedback analytics (monthly rollups)
-- ============================================================================
DELETE FROM feedback_analytics WHERE "generatedBy" = 'demo-seed';
INSERT INTO feedback_analytics
  ("periodStart", "periodEnd", "periodType", "totalFeedbackReceived", "feedbackResponseRate",
   "averageOverallSatisfaction", "satisfactionTrend", "averageServiceQuality", "averageEngineerProfessionalism",
   "averageResponseTime", "averageProblemResolution", "averageCommunication",
   "totalNPSResponses", "promotersCount", "passivesCount", "detractorsCount", "npsScore", "npsTrend",
   "csatScore", "csatTrend", "veryPositiveCount", "positiveCount", "neutralCount", "negativeCount", "veryNegativeCount",
   "sentimentScore", "totalComplaints", "complaintRate", "criticalComplaints", "complaintResolutionRate",
   "followUpsPending", "issuesUnresolved", "escalationsRequired", "strengthAreas", "improvementAreas",
   "generatedBy", "generatedAt")
VALUES
  ('2026-02-01 00:00:00','2026-02-28 23:59:59','monthly',14,58.30,4.10,'stable',4.20,4.50,3.60,4.30,4.10,
   12,5,5,2,25,'stable',82.50,'improving',3,7,3,1,0,0.42,2,6.80,0,50.00,2,1,0,
   'engineer professionalism,root-cause diagnosis','response time,parts availability','demo-seed','2026-03-02 08:00:00'),
  ('2026-03-01 00:00:00','2026-03-31 23:59:59','monthly',16,61.50,4.40,'improving',4.50,4.60,4.20,4.50,4.40,
   14,8,4,2,43,'improving',87.50,'improving',5,7,3,1,0,0.55,2,5.90,1,100.00,1,0,1,
   'SLA compliance,loaner equipment,honest diagnosis','billing accuracy','demo-seed','2026-04-02 08:00:00'),
  ('2026-06-01 00:00:00','2026-06-30 23:59:59','monthly',12,52.00,3.70,'declining',3.80,4.30,3.50,3.40,3.80,
   10,3,4,3,0,'declining',70.00,'declining',1,5,4,2,0,0.18,3,9.10,0,33.30,3,2,0,
   'engineer courtesy,tidiness','spare-parts stock,open-job closure','demo-seed','2026-07-02 08:00:00'),
  ('2026-07-01 00:00:00','2026-07-31 23:59:59','monthly',15,60.00,4.20,'improving',4.30,4.40,4.00,4.20,4.30,
   13,7,4,2,38,'improving',84.60,'improving',4,7,2,0,0,0.51,2,6.20,0,50.00,2,1,1,
   'first-visit fix,calibration quality','recurring-fault escalation speed','demo-seed','2026-08-03 08:00:00');

-- ============================================================================
-- AFTER-SALES: service feedback (page-level discriminator table)
-- ============================================================================
DELETE FROM as_service_feedback WHERE reference LIKE 'DEMO-SF-%';
INSERT INTO as_service_feedback
  (feedback_type, reference, customer_name, subject, description, category, priority, status, score, service_type, region, assigned_to, meta, created_at, updated_at)
VALUES
  ('complaint','DEMO-SF-001','Blue Fig Hotels Group','Combi oven E03 recurred after repair','E03 returned five days after gasket/element replacement; descale had been skipped.','Product Issue','high','closed',NULL,'breakdown','East','Vikram Singh','{"complaintRef":"DEMO-CMP-2026-001"}'::jsonb,'2026-02-05 10:30:00','2026-03-05 17:00:00'),
  ('complaint','DEMO-SF-002','Harbour Grill Restaurants','Dishwasher spare on backorder','Wash arm assembly pending three weeks after PM visit.','Parts Delay','medium','in_progress',NULL,'maintenance','West','Amit Verma','{"complaintRef":"DEMO-CMP-2026-003"}'::jsonb,'2026-06-20 14:15:00','2026-07-02 09:30:00'),
  ('rating','DEMO-SF-003','Metro Hospital Kitchens','Blast chiller emergency repair','Loaner unit and full repair inside SLA.','Breakdown Repair',NULL,'closed',5.00,'breakdown','Central','Suresh Patel','{"engineer":"Suresh Patel"}'::jsonb,'2026-03-16 09:30:00','2026-03-16 09:30:00'),
  ('rating','DEMO-SF-004','Lakeside Resort & Spa','Quarterly PM visit','Thorough PM, requested same-day reports.','Preventive Maintenance',NULL,'closed',4.00,'maintenance','East','Ravi Menon','{"engineer":"Ravi Menon"}'::jsonb,'2026-04-12 11:00:00','2026-04-12 11:00:00'),
  ('rating','DEMO-SF-005','Golden Spoon Franchises','Fryer thermostat replacement','Fixed and calibrated in one visit before opening.','Breakdown Repair',NULL,'closed',5.00,'breakdown','West','Deepak Joshi','{"engineer":"Deepak Joshi"}'::jsonb,'2026-07-28 09:10:00','2026-07-28 09:10:00'),
  ('nps','DEMO-SF-006','Metro Hospital Kitchens','Post-repair NPS','Would recommend — outstanding emergency response.','NPS',NULL,'closed',10.00,'breakdown','Central',NULL,'{"npsCategory":"promoter"}'::jsonb,'2026-03-16 09:35:00','2026-03-16 09:35:00'),
  ('nps','DEMO-SF-007','Harbour Grill Restaurants','Post-PM NPS','Parts delay dragged the score down.','NPS',NULL,'closed',5.00,'maintenance','West',NULL,'{"npsCategory":"detractor"}'::jsonb,'2026-06-25 10:45:00','2026-06-25 10:45:00'),
  ('survey','DEMO-SF-008','Summit Catering Services','Annual service satisfaction survey','Overall satisfied; wants faster quotes for chargeable repairs.','Annual Survey',NULL,'open',4.00,'inspection','West','Ravi Menon','{"surveyYear":2026,"responses":12}'::jsonb,'2026-08-30 12:00:00','2026-08-30 12:00:00');

-- ============================================================================
-- AFTER-SALES: service analytics (technician + first-time-fix)
-- ============================================================================
DELETE FROM as_service_analytics WHERE data->>'seed' = 'demo';
INSERT INTO as_service_analytics
  (metric_type, name, region, category, data, created_at, updated_at)
VALUES
  ('technician','Vikram Singh','East','Combi Ovens','{"seed":"demo","jobsCompleted":38,"avgRating":4.6,"ftfRate":86.8,"avgResponseHours":5.2,"reworkJobs":2,"period":"2026-H1"}'::jsonb,'2026-07-01 08:00:00','2026-07-01 08:00:00'),
  ('technician','Suresh Patel','Central','Refrigeration','{"seed":"demo","jobsCompleted":41,"avgRating":4.8,"ftfRate":90.2,"avgResponseHours":4.1,"reworkJobs":1,"period":"2026-H1"}'::jsonb,'2026-07-01 08:00:00','2026-07-01 08:00:00'),
  ('technician','Amit Verma','West','Dishwashers','{"seed":"demo","jobsCompleted":29,"avgRating":4.1,"ftfRate":75.9,"avgResponseHours":7.4,"reworkJobs":4,"period":"2026-H1"}'::jsonb,'2026-07-01 08:00:00','2026-07-01 08:00:00'),
  ('technician','Ravi Menon','East','Refrigeration','{"seed":"demo","jobsCompleted":33,"avgRating":4.3,"ftfRate":78.8,"avgResponseHours":6.0,"reworkJobs":3,"period":"2026-H1"}'::jsonb,'2026-07-01 08:00:00','2026-07-01 08:00:00'),
  ('ftf','First-Time-Fix — 2026 Q1','All','Overall','{"seed":"demo","totalJobs":124,"firstTimeFixed":102,"ftfRate":82.3,"topFailureReason":"parts not on van","trend":"improving"}'::jsonb,'2026-04-05 08:00:00','2026-04-05 08:00:00'),
  ('ftf','First-Time-Fix — 2026 Q2','All','Overall','{"seed":"demo","totalJobs":131,"firstTimeFixed":104,"ftfRate":79.4,"topFailureReason":"parts backorder","trend":"declining"}'::jsonb,'2026-07-05 08:00:00','2026-07-05 08:00:00');

-- ============================================================================
-- PROJECT: BOQs (before boq_items; keyed to demo projects)
-- ============================================================================
DELETE FROM boq_items WHERE "boqId" IN (
  SELECT id FROM boqs WHERE "projectId" IN (
    SELECT id FROM projects WHERE project_code IN ('PRJ-2026-0001','PRJ-2026-0005','PRJ-2026-0006')));
DELETE FROM boqs WHERE "projectId" IN (
  SELECT id FROM projects WHERE project_code IN ('PRJ-2026-0001','PRJ-2026-0005','PRJ-2026-0006'));
INSERT INTO boqs
  ("projectId", name, status, "totalAmount", "createdBy", "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DEMO-BOQ-KIT-MAIN — Hot Kitchen & Prep Line','approved',412500.00,'Lakshmi Iyer','2025-11-10 09:00:00','2026-01-20 09:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DEMO-BOQ-KIT-TENDER — Tender Stage Estimate','draft',398000.00,'Lakshmi Iyer','2025-10-15 09:00:00','2025-11-05 09:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0005'),'DEMO-BOQ-SOLAR — Array Structure & Cabling','pending_approval',186400.00,'Arun Gupta','2026-02-12 09:00:00','2026-03-01 09:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0006'),'DEMO-BOQ-AUTO — Conveyor & Drive Package','approved',148900.00,'Arun Gupta','2026-03-18 09:00:00','2026-04-10 09:00:00');

-- ============================================================================
-- PROJECT: BOQ items
-- ============================================================================
INSERT INTO boq_items
  ("boqId", "itemId", "itemCode", "itemName", description, quantity, unit, rate, amount, category, specifications)
VALUES
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-MAIN%' LIMIT 1),NULL,'KE-COMBI-20','CV-Pro 20 Combi Oven','20-tray electric combi oven with steam generator',2,'PCS',48500.00,97000.00,'material','400V 3ph, boiler-based, HACCP logging'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-MAIN%' LIMIT 1),NULL,'KE-CHILL-80','ChillRapid 80 Blast Chiller','80kg blast chiller/freezer cabinet',1,'PCS',32000.00,32000.00,'material','R452A, core probe, printer port'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-MAIN%' LIMIT 1),NULL,'KE-WASH-C900','WashPro C900 Rack Conveyor Dishwasher','Rack conveyor dishwasher with heat recovery',1,'PCS',54500.00,54500.00,'material','200 racks/hr, integral softener'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-MAIN%' LIMIT 1),
   (SELECT id FROM items WHERE "itemCode"='RM-STL-001' LIMIT 1),'RM-STL-001','Steel Sheet 2mm','SS304 sheet for benching and wall cladding fabrication',1800,'KG',6.50,11700.00,'material','SS304 brushed finish'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-MAIN%' LIMIT 1),NULL,'FAB-BENCH','Fabricated SS Benching & Shelving','Custom stainless benches, sinks and overshelves per drawings',1,'LOT',86300.00,86300.00,'material','Per drawing DWG-KIT-201 rev C'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-MAIN%' LIMIT 1),
   (SELECT id FROM items WHERE "itemCode"='SVC-MNT-001' LIMIT 1),'SVC-MNT-001','Preventive Maintenance Service','First-year PM package for installed line',4,'PCS',2750.00,11000.00,'labor','Quarterly visits, consumables included'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-MAIN%' LIMIT 1),NULL,'INST-COMM','Installation & Commissioning','Site installation, utilities hook-up and commissioning',1,'LOT',120000.00,120000.00,'labor','Includes crane day and site supervision'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-TENDER%' LIMIT 1),NULL,'KE-COMBI-20','CV-Pro 20 Combi Oven','Tender allowance — combi ovens',2,'PCS',47000.00,94000.00,'material','Tender-stage pricing'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-TENDER%' LIMIT 1),NULL,'FAB-BENCH','Fabricated SS Benching (allowance)','Provisional sum for stainless fabrication',1,'LOT',90000.00,90000.00,'material','Provisional — pending survey'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-KIT-TENDER%' LIMIT 1),NULL,'INST-COMM','Installation & Commissioning (allowance)','Provisional installation allowance',1,'LOT',115000.00,115000.00,'labor','Tender-stage estimate'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-SOLAR%' LIMIT 1),
   (SELECT id FROM items WHERE "itemCode"='RM-ALM-001' LIMIT 1),'RM-ALM-001','Aluminum Rod 20mm','Aluminium for panel mounting structure',2400,'MTR',12.00,28800.00,'material','6063-T6 anodised'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-SOLAR%' LIMIT 1),
   (SELECT id FROM items WHERE "itemCode"='RM-COP-001' LIMIT 1),'RM-COP-001','Copper Wire 2.5mm','DC string cabling runs',5200,'MTR',3.20,16640.00,'material','PV1-F rated'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-SOLAR%' LIMIT 1),NULL,'SOL-INV-50','String Inverter 50kW','Grid-tie string inverters',2,'PCS',38500.00,77000.00,'material','IP65, 4 MPPT'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-AUTO%' LIMIT 1),
   (SELECT id FROM items WHERE "itemCode"='FG-MTR-001' LIMIT 1),'FG-MTR-001','Industrial Motor 5HP','Conveyor drive motors',6,'PCS',1850.00,11100.00,'material','IE3, foot-mounted'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-AUTO%' LIMIT 1),
   (SELECT id FROM items WHERE "itemCode"='FG-GBX-001' LIMIT 1),'FG-GBX-001','Precision Gearbox PG-50','Inline helical gearboxes for conveyor drives',6,'PCS',2400.00,14400.00,'material','Ratio 25:1'),
  ((SELECT id FROM boqs WHERE name LIKE 'DEMO-BOQ-AUTO%' LIMIT 1),NULL,'AUTO-PLC','PLC Control Panel','Line control panel with HMI and safety relays',1,'LOT',46800.00,46800.00,'material','Per spec AUTO-CTRL-07');

-- ============================================================================
-- PROJECT: site surveys
-- ============================================================================
DELETE FROM site_surveys WHERE "projectId" IN (
  SELECT id FROM projects WHERE project_code IN ('PRJ-2026-0001','PRJ-2026-0005','PRJ-2026-0006'));
INSERT INTO site_surveys
  ("projectId", "performedBy", date, measurements, notes, "photoIds", "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'Vikram Singh','2025-10-22','{"kitchen_wall_north_mm":14350,"kitchen_wall_east_mm":9800,"ceiling_height_mm":3200,"extract_duct_dia_mm":600,"gas_point_dist_mm":2400,"drainage_falls_ok":true}'::jsonb,'Initial dimensional survey of the banquet kitchen shell. Extract riser position differs from tender drawings by ~400mm.','{}','2025-10-22 16:00:00','2025-10-22 16:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'Amit Verma','2026-01-14','{"floor_level_dev_mm":18,"power_supply_confirmed":"400V TPN 250A","water_hardness_ppm":260,"softener_required":true,"cold_room_slab_recess_mm":80}'::jsonb,'Pre-installation survey. Water hardness above 200 ppm — softener added to scope; floor screed deviation within tolerance.','{}','2026-01-14 15:30:00','2026-01-14 15:30:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'Amit Verma','2026-04-08','{"benching_fit_check":"pass","services_alignment":"pass","snag_count":6,"extract_velocity_ms":8.2}'::jsonb,'Mid-installation verification survey. Six minor snags logged; extract airflow within design range.','{}','2026-04-08 17:00:00','2026-04-08 17:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0005'),'Arun Gupta','2026-02-20','{"roof_area_sqm":2150,"roof_pitch_deg":5,"parapet_height_mm":900,"structural_load_kg_sqm":38,"shading_obstructions":2}'::jsonb,'Roof survey for array layout. Two AHU plinths cause partial afternoon shading on strings 7-8; layout adjusted.','{}','2026-02-20 14:00:00','2026-02-20 14:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0006'),'Ganesh Patil','2026-03-25','{"line_length_mm":42000,"floor_flatness_mm_per_3m":4,"power_available":"400V 3ph 160A","air_supply_bar":6.5,"clearance_overhead_mm":4100}'::jsonb,'Baseline survey of the automation hall. Compressed air header adequate; overhead clearance confirmed for conveyor gantry.','{}','2026-03-25 13:00:00','2026-03-25 13:00:00');

-- ============================================================================
-- PROJECT: discrepancy logs
-- ============================================================================
DELETE FROM discrepancy_logs WHERE "projectId" IN (
  SELECT id FROM projects WHERE project_code IN ('PRJ-2026-0001','PRJ-2026-0005','PRJ-2026-0006'));
INSERT INTO discrepancy_logs
  ("projectId", type, description, status, severity, "resolvedBy", "resolvedAt", "resolutionNotes", "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DWG_VS_SITE','Extract riser located ~400mm east of position shown on tender drawing DWG-KIT-101; hood connection needs offset section.','RESOLVED','MEDIUM','Lakshmi Iyer','2025-11-18 10:00:00','Drawing revised to rev B with offset duct section; no cost impact absorbed in fabrication.','2025-10-23 09:00:00','2025-11-18 10:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'BOQ_VS_DWG','BOQ lists 2 combi ovens but drawing DWG-KIT-201 rev B shows 3 positions on the hot line.','RESOLVED','HIGH','Lakshmi Iyer','2026-01-25 11:00:00','Client confirmed 2 ovens; third position kept as future provision with capped services. BOQ unchanged.','2026-01-16 09:30:00','2026-01-25 11:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'SPEC_MISMATCH','Specified dishwasher heat-recovery model requires 90mm drain; site drainage is 75mm.','OPEN','MEDIUM',NULL,NULL,NULL,'2026-04-09 10:00:00','2026-04-09 10:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DWG_VS_SITE','Cold room slab recess measured 80mm vs 100mm on drawing; floor insulation build-up affected.','OPEN','LOW',NULL,NULL,NULL,'2026-01-15 09:00:00','2026-01-15 09:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0005'),'DWG_VS_SITE','Two AHU plinths on roof not shown on layout drawing; strings 7-8 partially shaded after 14:00.','RESOLVED','HIGH','Arun Gupta','2026-03-05 12:00:00','Array layout re-optimised; 6 panels relocated to west bay, yield model updated (-0.8%).','2026-02-21 09:00:00','2026-03-05 12:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0006'),'BOQ_VS_DWG','Conveyor drive count in BOQ (6) does not match P&ID (7 — includes reject-lane drive).','OPEN','MEDIUM',NULL,NULL,NULL,'2026-04-12 09:00:00','2026-04-12 09:00:00');

-- ============================================================================
-- PROJECT: attachments (before external_approvals, which reference them)
-- ============================================================================
DELETE FROM external_approvals WHERE "projectId" IN (
  SELECT id FROM projects WHERE project_code IN ('PRJ-2026-0001','PRJ-2026-0005','PRJ-2026-0006'));
DELETE FROM project_attachments WHERE "projectId" IN (
  SELECT id FROM projects WHERE project_code IN ('PRJ-2026-0001','PRJ-2026-0005','PRJ-2026-0006'));
INSERT INTO project_attachments
  ("projectId", "fileName", "fileUrl", category, "mimeType", "fileSize", version, "isLatest", comments, "uploadedAt")
VALUES
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DEMO-DWG-KIT-101-revB.pdf','/files/demo/prj-2026-0001/DWG-KIT-101-revB.pdf','drawing','application/pdf',2456120,2,true,'Kitchen services layout — rev B with relocated extract riser','2025-11-18 10:30:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DEMO-DWG-KIT-201-revC.pdf','/files/demo/prj-2026-0001/DWG-KIT-201-revC.pdf','drawing','application/pdf',3180400,3,true,'Benching and equipment GA — rev C issued for construction','2026-01-26 09:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DEMO-BOQ-KIT-MAIN-v2.xlsx','/files/demo/prj-2026-0001/BOQ-KIT-MAIN-v2.xlsx','boq','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',184300,2,true,'Approved BOQ export','2026-01-20 14:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DEMO-RENDER-hotline.png','/files/demo/prj-2026-0001/render-hotline.png','render','image/png',5242880,1,true,'3D render of hot line for client sign-off','2025-12-05 11:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DEMO-SPEC-extract-hood.pdf','/files/demo/prj-2026-0001/spec-extract-hood.pdf','specification','application/pdf',912000,1,true,'Extract hood technical specification','2025-11-25 10:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),'DEMO-CONF-client-po.pdf','/files/demo/prj-2026-0001/client-po-confirmation.pdf','confirmation','application/pdf',221000,1,true,'Signed client purchase order confirmation','2025-11-12 09:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0005'),'DEMO-DWG-SOLAR-array-revA.pdf','/files/demo/prj-2026-0005/DWG-SOLAR-array-revA.pdf','drawing','application/pdf',1890000,1,true,'Array layout after shading re-optimisation','2026-03-05 13:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0006'),'DEMO-DWG-AUTO-conveyor-GA.pdf','/files/demo/prj-2026-0006/DWG-AUTO-conveyor-GA.pdf','drawing','application/pdf',2740000,1,true,'Conveyor general arrangement for client review','2026-04-02 10:00:00');

-- ============================================================================
-- PROJECT: external approvals (fire NOC, health dept, client sign-offs)
-- ============================================================================
INSERT INTO external_approvals
  ("projectId", "attachmentId", "clientEmail", "magicToken", status, "signatureUrl", comments, "expiresAt", "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),
   (SELECT id::text FROM project_attachments WHERE "fileName"='DEMO-DWG-KIT-101-revB.pdf' LIMIT 1),
   'fireandsafety@dcd.gov.demo','DEMO-TOK-FIRENOC-0001','APPROVED','/files/demo/signatures/fire-noc-0001.png','Fire NOC granted for kitchen suppression and extract layout, subject to annual inspection.','2026-01-31 23:59:59','2025-12-02 09:00:00','2025-12-19 15:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),
   (SELECT id::text FROM project_attachments WHERE "fileName"='DEMO-DWG-KIT-201-revC.pdf' LIMIT 1),
   'foodsafety@dm-health.gov.demo','DEMO-TOK-HEALTH-0001','APPROVED','/files/demo/signatures/health-0001.png','Health department approval of food-flow layout; handwash station count verified.','2026-03-15 23:59:59','2026-02-02 09:00:00','2026-02-20 12:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0001'),
   (SELECT id::text FROM project_attachments WHERE "fileName"='DEMO-RENDER-hotline.png' LIMIT 1),
   'projects@grandhyatt.demo','DEMO-TOK-CLIENT-0001','APPROVED','/files/demo/signatures/client-0001.png','Client approved hot-line aesthetics and finish selection.','2026-01-10 23:59:59','2025-12-06 09:00:00','2025-12-11 10:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0005'),
   (SELECT id::text FROM project_attachments WHERE "fileName"='DEMO-DWG-SOLAR-array-revA.pdf' LIMIT 1),
   'facilities@mallmgmt.demo','DEMO-TOK-MALL-0001','VIEWED',NULL,'Mall management reviewing rooftop works method statement alongside layout.','2026-10-15 23:59:59','2026-03-10 09:00:00','2026-03-14 16:00:00'),
  ((SELECT id FROM projects WHERE project_code='PRJ-2026-0006'),
   (SELECT id::text FROM project_attachments WHERE "fileName"='DEMO-DWG-AUTO-conveyor-GA.pdf' LIMIT 1),
   'engineering@autoparts.demo','DEMO-TOK-CLIENT-0002','SENT',NULL,NULL,'2026-10-01 23:59:59','2026-04-03 09:00:00','2026-04-03 09:00:00');
