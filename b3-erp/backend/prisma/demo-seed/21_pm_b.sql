-- Demo seed — Project Management (part B) for B3 MACBIS.
-- Covers: project types/categories/templates, plans, documents + approvals,
-- earned value, progress, costs, profitability, kanban, labor, materials,
-- MRP, machine status, designer tasks, dispatch/equipment catalogs,
-- installation activities, layout briefings, project issues.
-- Anchor projects (commercial-kitchen fitouts):
--   PRJ-DEMO-001  Harbour Grill Flagship Kitchen Fitout   (Harbour Grill Restaurants)
--   PRJ-DEMO-002  Blue Fig Central Production Kitchen     (Blue Fig Hotels Group)
--   PRJ-DEMO-003  Metro Hospital Kitchens Modernization   (Metro Hospital Kitchens)
-- Idempotent: clears this company's demo rows first, then re-inserts.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------- pm_project_types
DELETE FROM pm_project_types WHERE company_id = :company;
INSERT INTO pm_project_types
  (company_id, type_name, type_code, category, description, industry, default_duration,
   budget_range, required_approvals, default_workflow, project_count, active_projects,
   avg_success_rate, total_revenue, is_active, created_date, last_modified, created_at, updated_at)
VALUES
  (:company,'Commercial Kitchen Fitout','DEMO-PT-01','Turnkey','Full design-supply-install of commercial kitchens','Hospitality','24 weeks','$500K - $2.5M',3,'MACBIS Standard',14,4,92.50,18750000,true,'2025-10-01','2026-08-15','2025-10-01T09:00:00Z','2026-08-15T10:00:00Z'),
  (:company,'Cold Room Installation','DEMO-PT-02','Installation','Walk-in cold rooms and freezer complexes','Hospitality','8 weeks','$80K - $400K',2,'MACBIS Standard',9,2,95.00,2860000,true,'2025-10-01','2026-07-20','2025-10-01T09:05:00Z','2026-07-20T10:00:00Z'),
  (:company,'Healthcare Kitchen Upgrade','DEMO-PT-03','Retrofit','Hospital and care-facility kitchen modernization','Healthcare','16 weeks','$300K - $1.2M',4,'Healthcare Compliance',5,1,88.00,4120000,true,'2025-10-05','2026-06-30','2025-10-05T09:00:00Z','2026-06-30T10:00:00Z'),
  (:company,'Bakery & Pastry Line','DEMO-PT-04','Turnkey','Production bakery lines with proofing and baking suites','Food Production','12 weeks','$150K - $600K',2,'MACBIS Standard',4,0,90.00,1480000,true,'2025-11-10','2026-05-12','2025-11-10T09:00:00Z','2026-05-12T10:00:00Z'),
  (:company,'Service & Maintenance Retainer','DEMO-PT-05','Service','Planned preventive maintenance contracts for installed base','Hospitality','52 weeks','$20K - $120K',1,'Service Desk',11,6,97.00,860000,true,'2025-12-01','2026-09-01','2025-12-01T09:00:00Z','2026-09-01T10:00:00Z');

-- ------------------------------------------------------------ pm_project_categories
DELETE FROM pm_project_categories WHERE company_id = :company;
INSERT INTO pm_project_categories
  (company_id, category_name, category_code, description, parent_category, project_types,
   color, icon, sort_order, is_active, created_at, updated_at)
VALUES
  (:company,'Turnkey Fitouts','DEMO-PC-01','End-to-end kitchen fitout projects',NULL,'["Commercial Kitchen Fitout","Bakery & Pastry Line"]','#2563EB','Building2',1,true,'2025-10-01T09:10:00Z','2025-10-01T09:10:00Z'),
  (:company,'Refrigeration','DEMO-PC-02','Cold rooms, freezers and chiller plants','Turnkey Fitouts','["Cold Room Installation"]','#0EA5E9','Snowflake',2,true,'2025-10-01T09:12:00Z','2025-10-01T09:12:00Z'),
  (:company,'Healthcare','DEMO-PC-03','Regulated healthcare catering facilities',NULL,'["Healthcare Kitchen Upgrade"]','#16A34A','HeartPulse',3,true,'2025-10-05T09:15:00Z','2025-10-05T09:15:00Z'),
  (:company,'Retrofit & Upgrade','DEMO-PC-04','Upgrades to existing operational kitchens',NULL,'["Healthcare Kitchen Upgrade","Commercial Kitchen Fitout"]','#F59E0B','Wrench',4,true,'2025-11-02T09:00:00Z','2026-03-14T10:00:00Z'),
  (:company,'After-Sales Service','DEMO-PC-05','Maintenance retainers and warranty work',NULL,'["Service & Maintenance Retainer"]','#8B5CF6','Headset',5,true,'2025-12-01T09:20:00Z','2025-12-01T09:20:00Z');

-- ------------------------------------------------------------- pm_project_templates
DELETE FROM pm_project_templates WHERE company_id = :company;
INSERT INTO pm_project_templates
  (company_id, template_name, project_type, description, category, complexity,
   estimated_duration, estimated_budget, phases, milestones, tasks, resources, deliverables,
   default_settings, tags, usage_count, last_used, created_by, is_active, is_favorite, created_at, updated_at)
VALUES
  (:company,'DEMO Standard Kitchen Fitout','Commercial Kitchen Fitout','Baseline WBS for restaurant kitchen fitouts','Standard','Medium','24 weeks','$850,000',
   '["Design & Approvals","Fabrication","Site Prep & MEP","Installation","Commissioning & Handover"]',8,64,
   '["Project Manager","Site Supervisor","Install Crew x6","MEP Specialist"]',
   '["Approved layout","Fabrication drawings","Installed equipment","Commissioning report","Handover certificate"]',
   '{"currency":"USD","billing":"milestone","retention_percent":5}','["kitchen","fitout","turnkey"]',
   9,'2026-07-02','Sarah Mitchell',true,true,'2025-10-02T10:00:00Z','2026-07-02T11:00:00Z'),
  (:company,'DEMO Hotel Central Kitchen','Commercial Kitchen Fitout','Large-format hotel production kitchen with cold rooms','Premium','High','36 weeks','$2,400,000',
   '["Design & Approvals","Long-lead Procurement","Fabrication","Cold Rooms","Installation","MEP Hookups","Commissioning"]',12,110,
   '["Project Manager","Design Lead","Site Supervisor x2","Install Crew x12","Refrigeration Crew x4"]',
   '["BOQ","Cold room certification","Installed line","Training pack","O&M manuals"]',
   '{"currency":"USD","billing":"milestone","retention_percent":10}','["hotel","central-kitchen","cold-room"]',
   3,'2026-04-18','Sarah Mitchell',true,false,'2025-10-20T10:00:00Z','2026-04-18T11:00:00Z'),
  (:company,'DEMO Healthcare Compliance Refit','Healthcare Kitchen Upgrade','HACCP-driven hospital kitchen retrofit with phased shutdowns','Regulated','High','16 weeks','$890,000',
   '["Compliance Audit","Phased Demolition","Installation","Validation","Handover"]',6,52,
   '["Project Manager","Compliance Officer","Install Crew x5"]',
   '["HACCP validation report","Phase completion certificates","As-built drawings"]',
   '{"currency":"USD","billing":"phase","retention_percent":5}','["healthcare","haccp","retrofit"]',
   2,'2026-01-12','David Williams',true,false,'2025-11-08T10:00:00Z','2026-01-12T11:00:00Z'),
  (:company,'DEMO Cold Room Express','Cold Room Installation','Fast-track modular cold room package','Standard','Low','8 weeks','$180,000',
   '["Survey","Panel Fabrication","Erection","Refrigeration & Controls","Commissioning"]',4,26,
   '["Site Supervisor","Refrigeration Crew x3"]',
   '["Temperature mapping report","Commissioning certificate"]',
   '{"currency":"USD","billing":"50-40-10","retention_percent":0}','["cold-room","modular"]',
   5,'2026-06-25','David Williams',true,true,'2025-12-05T10:00:00Z','2026-06-25T11:00:00Z');

-- ----------------------------------------------------------- pm_milestone_templates
DELETE FROM pm_milestone_templates WHERE company_id = :company;
INSERT INTO pm_milestone_templates
  (company_id, template_name, project_type, description, total_milestones, estimated_duration,
   milestones, usage_count, last_used, created_by, is_active, created_at, updated_at)
VALUES
  (:company,'DEMO Fitout Milestones','Commercial Kitchen Fitout','Standard milestone ladder for turnkey fitouts',8,'24 weeks',
   '[{"name":"Design Sign-off","offset_weeks":3,"billing_percent":10},{"name":"Fabrication Complete","offset_weeks":10,"billing_percent":25},{"name":"Site Ready","offset_weeks":12,"billing_percent":5},{"name":"Equipment Delivered","offset_weeks":14,"billing_percent":20},{"name":"Installation Complete","offset_weeks":20,"billing_percent":25},{"name":"MEP Hookups Done","offset_weeks":21,"billing_percent":5},{"name":"Commissioning Passed","offset_weeks":23,"billing_percent":5},{"name":"Handover","offset_weeks":24,"billing_percent":5}]',
   7,'2026-06-30','Sarah Mitchell',true,'2025-10-02T10:30:00Z','2026-06-30T09:00:00Z'),
  (:company,'DEMO Cold Room Milestones','Cold Room Installation','Milestones for modular cold room packages',4,'8 weeks',
   '[{"name":"Survey & Drawings","offset_weeks":1,"billing_percent":10},{"name":"Panels On Site","offset_weeks":4,"billing_percent":40},{"name":"Erection Complete","offset_weeks":6,"billing_percent":40},{"name":"Commissioning","offset_weeks":8,"billing_percent":10}]',
   4,'2026-05-22','David Williams',true,'2025-12-05T10:30:00Z','2026-05-22T09:00:00Z'),
  (:company,'DEMO Healthcare Phase Gates','Healthcare Kitchen Upgrade','Phase-gated milestones with compliance validation',6,'16 weeks',
   '[{"name":"Compliance Audit Done","offset_weeks":2,"billing_percent":10},{"name":"Phase 1 Handback","offset_weeks":6,"billing_percent":25},{"name":"Phase 2 Handback","offset_weeks":10,"billing_percent":25},{"name":"Phase 3 Handback","offset_weeks":13,"billing_percent":20},{"name":"HACCP Validation","offset_weeks":15,"billing_percent":10},{"name":"Final Handover","offset_weeks":16,"billing_percent":10}]',
   2,'2026-01-15','David Williams',true,'2025-11-08T10:30:00Z','2026-01-15T09:00:00Z'),
  (:company,'DEMO Service Retainer Cadence','Service & Maintenance Retainer','Quarterly PPM visit cadence for retainers',4,'52 weeks',
   '[{"name":"Q1 PPM Visit","offset_weeks":13,"billing_percent":25},{"name":"Q2 PPM Visit","offset_weeks":26,"billing_percent":25},{"name":"Q3 PPM Visit","offset_weeks":39,"billing_percent":25},{"name":"Q4 PPM Visit","offset_weeks":52,"billing_percent":25}]',
   6,'2026-08-10','Sarah Mitchell',true,'2025-12-10T10:30:00Z','2026-08-10T09:00:00Z');

-- ---------------------------------------------------------------- pm_project_plans
DELETE FROM pm_project_plans WHERE "companyId" = :company;
INSERT INTO pm_project_plans
  ("companyId", "projectCode", "projectName", client, "projectManager", "startDate", "endDate",
   "estimatedBudget", "actualBudget", status, priority, "progressPercentage", phase,
   milestones, "completedMilestones", "teamSize", location, "projectType", "riskLevel",
   "plannedHours", "actualHours", "createdAt", "updatedAt")
VALUES
  (:company,'PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Harbour Grill Restaurants','Sarah Mitchell','2025-10-15','2026-04-30',1250000,937500,'active','high',78,'Installation',8,6,14,'San Francisco, CA','Commercial Kitchen Fitout','medium',5200,4160,'2025-10-10T09:00:00','2026-09-01T10:00:00'),
  (:company,'PRJ-DEMO-002','Blue Fig Central Production Kitchen','Blue Fig Hotels Group','Sarah Mitchell','2025-11-01','2026-08-31',2400000,1435000,'active','critical',55,'Installation',12,6,22,'New York, NY','Commercial Kitchen Fitout','high',9800,5390,'2025-10-25T09:00:00','2026-09-05T10:00:00'),
  (:company,'PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Metro Hospital Kitchens','David Williams','2026-01-10','2026-07-15',890000,772500,'active','high',92,'Commissioning',6,5,11,'Chicago, IL','Healthcare Kitchen Upgrade','low',4100,3772,'2025-12-20T09:00:00','2026-09-08T10:00:00'),
  (:company,'PRJ-DEMO-004','Campus Dining Pantry Refit','Campus Dining Co-op','David Williams','2026-06-01','2026-11-15',320000,121700,'active','medium',35,'Fabrication',5,1,7,'Boston, MA','Commercial Kitchen Fitout','medium',1600,560,'2026-05-12T09:00:00','2026-09-02T10:00:00'),
  (:company,'PRJ-DEMO-005','Summit Catering Central Commissary','Summit Catering Services','Sarah Mitchell','2026-07-01','2027-01-31',540000,104000,'planning','medium',20,'Design & Approvals',6,1,5,'Denver, CO','Commercial Kitchen Fitout','low',2400,480,'2026-06-10T09:00:00','2026-09-06T10:00:00');

-- ------------------------------------------------------------------- pm_documents
DELETE FROM pm_documents WHERE company_id = :company;
INSERT INTO pm_documents
  (company_id, document_number, project_id, project_name, document_name, document_type, category,
   version, upload_date, uploaded_by, file_size, file_format, status, access_level,
   reviewed_by, approved_by, approval_date, expiry_date, tags, description, related_documents, created_at, updated_at)
VALUES
  (:company,'DEMO-DOC-001','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Kitchen Layout GA Drawing','Drawing','Design','Rev C','2025-11-08','Meera Nair','4.2 MB','DWG','Approved','Internal','Rajesh Kumar','Sarah Mitchell','2025-11-14',NULL,'["layout","GA","hot-kitchen"]','General arrangement for hot kitchen, cold prep and servery zones','["DEMO-DOC-002"]','2025-11-08T10:00:00Z','2025-11-14T15:00:00Z'),
  (:company,'DEMO-DOC-002','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Equipment Schedule & Specs','Specification','Design','Rev B','2025-11-20','Meera Nair','1.8 MB','PDF','Approved','Client','Rajesh Kumar','Marcus Lee','2025-12-02',NULL,'["equipment","specs"]','Line-item specification for 42 equipment positions','["DEMO-DOC-001"]','2025-11-20T10:00:00Z','2025-12-02T15:00:00Z'),
  (:company,'DEMO-DOC-003','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Extraction Ventilation Calcs','Report','Engineering','Rev A','2026-01-12','Deepak Joshi','2.6 MB','PDF','Approved','Internal','Vikram Singh','Sarah Mitchell','2026-01-19',NULL,'["ventilation","MEP"]','Airflow and make-up air calculations for hood package',NULL,'2026-01-12T10:00:00Z','2026-01-19T15:00:00Z'),
  (:company,'DEMO-DOC-004','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Cold Room Panel Layout','Drawing','Design','Rev D','2026-02-05','Meera Nair','5.1 MB','DWG','Under Review','Internal','Suresh Patel',NULL,NULL,NULL,'["cold-room","panels"]','Panel setting-out for freezer and chiller complexes','["DEMO-DOC-005"]','2026-02-05T10:00:00Z','2026-08-28T15:00:00Z'),
  (:company,'DEMO-DOC-005','PRJ-DEMO-002','Blue Fig Central Production Kitchen','MEP Services Coordination Plan','Drawing','Engineering','Rev B','2026-03-18','Deepak Joshi','6.4 MB','DWG','Approved','Internal','Vikram Singh','Sarah Mitchell','2026-03-27',NULL,'["MEP","coordination"]','Combined services drawing for drainage, gas, power and extract','["DEMO-DOC-004"]','2026-03-18T10:00:00Z','2026-03-27T15:00:00Z'),
  (:company,'DEMO-DOC-006','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Fitout Contract & SOW','Contract','Commercial','v1.0','2025-11-01','Sarah Mitchell','0.9 MB','PDF','Approved','Restricted','Anita Desai','Amelia Torres','2025-11-05','2026-12-31','["contract","commercial"]','Signed contract with scope of works and payment milestones',NULL,'2025-11-01T10:00:00Z','2025-11-05T15:00:00Z'),
  (:company,'DEMO-DOC-007','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','HACCP Compliance Validation Pack','Report','Quality','Rev A','2026-06-22','Kiran Reddy','3.3 MB','PDF','Approved','Client','Anita Desai','Dr. Karen Ng','2026-07-01',NULL,'["haccp","validation","healthcare"]','Validation evidence for HACCP-critical zones after refit',NULL,'2026-06-22T10:00:00Z','2026-07-01T15:00:00Z'),
  (:company,'DEMO-DOC-008','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','As-Built Drawings Package','Drawing','Handover','Rev A','2026-08-20','Meera Nair','12.7 MB','PDF','Draft','Internal',NULL,NULL,NULL,NULL,'["as-built","handover"]','Consolidated as-built set pending final markups',NULL,'2026-08-20T10:00:00Z','2026-09-04T15:00:00Z');

-- ---------------------------------------------------------- pm_document_approvals
DELETE FROM pm_document_approvals WHERE company_id = :company;
INSERT INTO pm_document_approvals
  (company_id, document_number, document_name, version, document_type, project_name,
   sent_to_client, client_email, sent_date, due_date, status, approved_by, approval_date,
   signature_url, comments, reminders_sent, created_at, updated_at)
VALUES
  (:company,'DEMO-DOC-001','Kitchen Layout GA Drawing','Rev C','Drawing','Harbour Grill Flagship Kitchen Fitout','Marcus Lee','marcus@harbourgrill.com','2025-11-10','2025-11-17','Approved','Marcus Lee','2025-11-14','https://files.b3demo.local/sign/demo-doc-001.png','Approved with note to keep pass-through window at 1100mm',1,'2025-11-10T09:00:00Z','2025-11-14T16:00:00Z'),
  (:company,'DEMO-DOC-002','Equipment Schedule & Specs','Rev B','Specification','Harbour Grill Flagship Kitchen Fitout','Marcus Lee','marcus@harbourgrill.com','2025-11-24','2025-12-05','Approved','Marcus Lee','2025-12-02','https://files.b3demo.local/sign/demo-doc-002.png','Combi oven upsized to 10-GN per chef request',2,'2025-11-24T09:00:00Z','2025-12-02T16:00:00Z'),
  (:company,'DEMO-DOC-004','Cold Room Panel Layout','Rev D','Drawing','Blue Fig Central Production Kitchen','Amelia Torres','amelia@bluefighotels.com','2026-08-18','2026-09-15','Pending',NULL,NULL,NULL,'Rev D issued after door swing clash; awaiting client review',1,'2026-08-18T09:00:00Z','2026-09-05T16:00:00Z'),
  (:company,'DEMO-DOC-006','Fitout Contract & SOW','v1.0','Contract','Blue Fig Central Production Kitchen','Amelia Torres','amelia@bluefighotels.com','2025-11-02','2025-11-09','Approved','Amelia Torres','2025-11-05','https://files.b3demo.local/sign/demo-doc-006.png','Signed with 10% retention clause',0,'2025-11-02T09:00:00Z','2025-11-05T16:00:00Z'),
  (:company,'DEMO-DOC-007','HACCP Compliance Validation Pack','Rev A','Report','Metro Hospital Kitchens Modernization','Dr. Karen Ng','karen@metrohospital.org','2026-06-24','2026-07-08','Approved','Dr. Karen Ng','2026-07-01','https://files.b3demo.local/sign/demo-doc-007.png','Validation accepted; annual re-verification scheduled',1,'2026-06-24T09:00:00Z','2026-07-01T16:00:00Z');

-- ------------------------------------------------------------------ pm_earned_value
-- CPI = EV/AC, SPI = EV/PV kept within 0.85–1.10.
DELETE FROM pm_earned_value WHERE company_id = :company;
INSERT INTO pm_earned_value
  (company_id, project_code, project_name, budget_at_completion, planned_value, earned_value,
   actual_cost, progress_percent, start_date, end_date, status, created_at, updated_at)
VALUES
  (:company,'PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout',1250000,1010000,975000,937500,78,'2025-10-15','2026-04-30','on-track','2025-10-15T09:00:00','2026-09-01T09:00:00'),   -- CPI 1.04, SPI 0.97
  (:company,'PRJ-DEMO-002','Blue Fig Central Production Kitchen',2400000,1450000,1320000,1435000,55,'2025-11-01','2026-08-31','at-risk','2025-11-01T09:00:00','2026-09-05T09:00:00'),   -- CPI 0.92, SPI 0.91
  (:company,'PRJ-DEMO-003','Metro Hospital Kitchens Modernization',890000,800000,818800,772500,92,'2026-01-10','2026-07-15','on-track','2026-01-10T09:00:00','2026-09-08T09:00:00'),    -- CPI 1.06, SPI 1.02
  (:company,'PRJ-DEMO-004','Campus Dining Pantry Refit',320000,118000,112000,121700,35,'2026-06-01','2026-11-15','at-risk','2026-06-01T09:00:00','2026-09-02T09:00:00'),                -- CPI 0.92, SPI 0.95
  (:company,'PRJ-DEMO-005','Summit Catering Central Commissary',540000,100000,108000,104000,20,'2026-07-01','2027-01-31','on-track','2026-07-01T09:00:00','2026-09-06T09:00:00'),       -- CPI 1.04, SPI 1.08
  (:company,'PRJ-DEMO-006','Golden Spoon Store Rollout Phase 1',760000,520000,494000,470000,65,'2026-02-01','2026-10-31','on-track','2026-02-01T09:00:00','2026-09-04T09:00:00');       -- CPI 1.05, SPI 0.95

-- -------------------------------------------------------------- pm_progress_entries
DELETE FROM pm_progress_entries WHERE company_id = :company;
INSERT INTO pm_progress_entries
  (company_id, date, work_package, activity, planned_work, actual_work, completion_percent,
   labor_deployed, hours_worked, material_used, equipment_used, issues, photos, weather,
   safety_incidents, reported_by, status, created_at, updated_at)
VALUES
  (:company,'2026-02-10','PRJ-DEMO-001 / Hot Kitchen Line','Cook line benching and range install','Set 12 m of SS benching, position 4 ranges','Set 12 m benching, positioned 3 of 4 ranges (1 awaiting gas point)',70,6,52,'SS304 benching, flexi gas hoses','Pallet jack, laser level','Gas point G-07 mislocated by 300mm',6,'Indoor',0,'Rajesh Kumar','Approved','2026-02-10T18:00:00Z','2026-02-12T09:00:00Z'),
  (:company,'2026-02-11','PRJ-DEMO-001 / Hot Kitchen Line','Range connection and hood alignment','Connect ranges, align extraction hood','All 4 ranges connected; hood aligned and levelled',100,6,48,'Flexi gas hoses, hood filters','Scissor lift','None',8,'Indoor',0,'Rajesh Kumar','Approved','2026-02-11T18:00:00Z','2026-02-13T09:00:00Z'),
  (:company,'2026-03-05','PRJ-DEMO-001 / Extraction & Ventilation','Ductwork risers and make-up air','Install riser sections R1-R3','R1-R2 complete, R3 blocked by structural beam - rerouted',65,4,34,'Galvanized duct sections, fire dampers','Scissor lift, crimper','Reroute added 2 days to duct schedule',5,'Indoor',0,'Deepak Joshi','Approved','2026-03-05T18:00:00Z','2026-03-07T09:00:00Z'),
  (:company,'2026-04-14','PRJ-DEMO-002 / Cold Room Assembly','Freezer complex panel erection','Erect 60 wall panels, set 2 doors','58 panels erected; 2 damaged panels quarantined, doors set',88,8,78,'PIR panels 150mm, cam-lock fasteners','Panel lifter, genie hoist','2 panels damaged in transit - replacements ordered',10,'Indoor',0,'Suresh Patel','Approved','2026-04-14T18:00:00Z','2026-04-16T09:00:00Z'),
  (:company,'2026-05-20','PRJ-DEMO-002 / Stainless Benching Install','Prep area benching and shelving','Install 28 m benching and 14 shelving bays','Installed 28 m benching and 14 bays; site cleaned',100,5,40,'SS304 benching, wall shelving','Laser level, trolleys','None',7,'Indoor',0,'Suresh Patel','Approved','2026-05-20T18:00:00Z','2026-05-22T09:00:00Z'),
  (:company,'2026-06-09','PRJ-DEMO-002 / MEP Hookups','Power and drainage final connections','Terminate 22 power points, connect 9 floor drains','20 power points done; 2 await landlord DB upgrade; drains complete',82,3,27,'SWA cable, drain couplings','Test meter, core drill','Landlord DB upgrade pending - chased with client',4,'Indoor',0,'Vikram Singh','Submitted','2026-06-09T18:00:00Z','2026-06-09T18:30:00Z'),
  (:company,'2026-05-06','PRJ-DEMO-003 / Servery Counters','Ward servery counter installation','Install 4 servery counters with gantries','All 4 counters installed and levelled; gantries wired',100,4,32,'Heated gantries, SS counters','Pallet jack','None',6,'Indoor',0,'Kiran Reddy','Approved','2026-05-06T18:00:00Z','2026-05-08T09:00:00Z'),
  (:company,'2026-06-17','PRJ-DEMO-003 / Final Commissioning','Equipment commissioning run','Commission 18 equipment items with client engineer','16 of 18 commissioned; dishwasher awaiting water softener part',89,2,12,'Test media, temperature probes','Commissioning kit, data loggers','Softener cartridge on backorder (ETA 3 days)',9,'Indoor',0,'Kiran Reddy','Submitted','2026-06-17T18:00:00Z','2026-06-17T18:30:00Z');

-- ---------------------------------------------------------------- pm_project_costs
-- actual_cost matches pm_earned_value.actual_cost; forecast ≈ BAC / CPI.
DELETE FROM pm_project_costs WHERE company_id = :company;
INSERT INTO pm_project_costs
  (company_id, project_id, project_name, project_type, customer, start_date, end_date, progress,
   status, total_budget, actual_cost, committed_cost, forecasted_cost, variance, variance_percent,
   cost_breakdown, profit_margin, actual_profit, created_at, updated_at)
VALUES
  (:company,'PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Commercial Kitchen Fitout','Harbour Grill Restaurants','2025-10-15','2026-04-30',78,'In Progress',1250000,937500,165000,1201900,48100,3.85,'{"material":498000,"labor":236500,"equipment":128000,"subcontract":52000,"overhead":23000}',18.30,328100,'2025-10-15T09:00:00Z','2026-09-01T09:30:00Z'),
  (:company,'PRJ-DEMO-002','Blue Fig Central Production Kitchen','Commercial Kitchen Fitout','Blue Fig Hotels Group','2025-11-01','2026-08-31',55,'Over Budget',2400000,1435000,486000,2608700,-208700,-8.70,'{"material":792000,"labor":338000,"equipment":204000,"subcontract":76000,"overhead":25000}',16.70,271300,'2025-11-01T09:00:00Z','2026-09-05T09:30:00Z'),
  (:company,'PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Healthcare Kitchen Upgrade','Metro Hospital Kitchens','2026-01-10','2026-07-15',92,'In Progress',890000,772500,41000,839600,50400,5.66,'{"material":392500,"labor":221000,"equipment":94000,"subcontract":48000,"overhead":17000}',16.70,228400,'2026-01-10T09:00:00Z','2026-09-08T09:30:00Z'),
  (:company,'PRJ-DEMO-004','Campus Dining Pantry Refit','Commercial Kitchen Fitout','Campus Dining Co-op','2026-06-01','2026-11-15',35,'Over Budget',320000,121700,64000,347800,-27800,-8.69,'{"material":61700,"labor":38000,"equipment":16000,"subcontract":4000,"overhead":2000}',19.00,47200,'2026-06-01T09:00:00Z','2026-09-02T09:30:00Z'),
  (:company,'PRJ-DEMO-005','Summit Catering Central Commissary','Commercial Kitchen Fitout','Summit Catering Services','2026-07-01','2027-01-31',20,'In Progress',540000,104000,112000,519200,20800,3.85,'{"material":52000,"labor":31000,"equipment":15000,"subcontract":4000,"overhead":2000}',18.80,145800,'2026-07-01T09:00:00Z','2026-09-06T09:30:00Z'),
  (:company,'PRJ-DEMO-006','Golden Spoon Store Rollout Phase 1','Commercial Kitchen Fitout','Golden Spoon Franchises','2026-02-01','2026-10-31',65,'In Progress',760000,470000,98000,723100,36900,4.86,'{"material":249000,"labor":121000,"equipment":66000,"subcontract":24000,"overhead":10000}',19.10,216900,'2026-02-01T09:00:00Z','2026-09-04T09:30:00Z');

-- ---------------------------------------------------------- pm_project_profitability
-- revenue_recognized = contract_value * progress%; gross_profit = revenue_recognized - actual_cost.
DELETE FROM pm_project_profitability WHERE company_id = :company;
INSERT INTO pm_project_profitability
  (company_id, project_id, project_name, client_name, project_type, start_date, end_date, status,
   contract_value, actual_revenue, revenue_recognized, total_budget, actual_cost, direct_costs,
   indirect_costs, gross_profit, gross_margin, net_profit, net_margin, budget_variance,
   variance_percent, billed_amount, outstanding_amount, payment_status, risk_level, created_at, updated_at)
VALUES
  (:company,'PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Harbour Grill Restaurants','Commercial Kitchen Fitout','2025-10-15','2026-04-30','In Progress',1530000,1193400,1193400,1250000,937500,'{"material":498000,"labor":236500,"equipment":128000,"subcontract":52000}','{"site_overhead":23000,"pm_allocation":54000}',255900,21.44,178900,14.99,312500,25.00,1050000,143400,'Partially Paid','Low','2025-10-15T09:00:00Z','2026-09-01T10:00:00Z'),
  (:company,'PRJ-DEMO-002','Blue Fig Central Production Kitchen','Blue Fig Hotels Group','Commercial Kitchen Fitout','2025-11-01','2026-08-31','In Progress',2880000,1584000,1584000,2400000,1435000,'{"material":792000,"labor":338000,"equipment":204000,"subcontract":76000}','{"site_overhead":25000,"pm_allocation":71000}',149000,9.41,53000,3.35,965000,40.21,1400000,184000,'Partially Paid','Medium','2025-11-01T09:00:00Z','2026-09-05T10:00:00Z'),
  (:company,'PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Metro Hospital Kitchens','Healthcare Kitchen Upgrade','2026-01-10','2026-07-15','In Progress',1068000,982560,982560,890000,772500,'{"material":392500,"labor":221000,"equipment":94000,"subcontract":48000}','{"site_overhead":17000,"pm_allocation":41000}',210060,21.38,152060,15.48,117500,13.20,960000,22560,'Partially Paid','Low','2026-01-10T09:00:00Z','2026-09-08T10:00:00Z'),
  (:company,'PRJ-DEMO-004','Campus Dining Pantry Refit','Campus Dining Co-op','Commercial Kitchen Fitout','2026-06-01','2026-11-15','In Progress',395000,138250,138250,320000,121700,'{"material":61700,"labor":38000,"equipment":16000,"subcontract":4000}','{"site_overhead":2000,"pm_allocation":7500}',16550,11.97,7050,5.10,198300,61.97,118500,19750,'Partially Paid','Medium','2026-06-01T09:00:00Z','2026-09-02T10:00:00Z'),
  (:company,'PRJ-DEMO-005','Summit Catering Central Commissary','Summit Catering Services','Commercial Kitchen Fitout','2026-07-01','2027-01-31','In Progress',665000,133000,133000,540000,104000,'{"material":52000,"labor":31000,"equipment":15000,"subcontract":4000}','{"site_overhead":2000,"pm_allocation":6000}',29000,21.80,21000,15.79,436000,80.74,133000,0,'Paid','Low','2026-07-01T09:00:00Z','2026-09-06T10:00:00Z'),
  (:company,'PRJ-DEMO-006','Golden Spoon Store Rollout Phase 1','Golden Spoon Franchises','Commercial Kitchen Fitout','2026-02-01','2026-10-31','In Progress',940000,611000,611000,760000,470000,'{"material":249000,"labor":121000,"equipment":66000,"subcontract":24000}','{"site_overhead":10000,"pm_allocation":31000}',141000,23.08,100000,16.37,290000,38.16,564000,47000,'Partially Paid','Low','2026-02-01T09:00:00Z','2026-09-04T10:00:00Z');

-- ----------------------------------------------------------------- pm_kanban_cards
DELETE FROM pm_kanban_cards WHERE company_id = :company;
INSERT INTO pm_kanban_cards
  (company_id, task_number, title, description, project_code, project_name, assignee, priority,
   due_date, estimated_hours, tags, column_key, created_at, updated_at)
VALUES
  (:company,'DEMO-KB-001','Finalize servery gantry specs','Confirm heated gantry lengths with chef consultant','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Meera Nair','medium','2026-09-25',6,'["design","client-input"]','backlog','2026-08-28T09:00:00','2026-08-28T09:00:00'),
  (:company,'DEMO-KB-002','Order replacement freezer panels','Two PIR panels damaged in transit need reorder','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Anita Desai','high','2026-09-15',3,'["procurement","cold-room"]','todo','2026-09-01T09:00:00','2026-09-05T09:00:00'),
  (:company,'DEMO-KB-003','Chase landlord DB upgrade','2 power points blocked pending landlord distribution board work','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Vikram Singh','urgent','2026-09-18',4,'["MEP","blocker"]','todo','2026-09-02T09:00:00','2026-09-08T09:00:00'),
  (:company,'DEMO-KB-004','Prepare handover snag list','Walk site with client and log punch items','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Rajesh Kumar','high','2026-09-20',8,'["handover","quality"]','todo','2026-09-03T09:00:00','2026-09-03T09:00:00'),
  (:company,'DEMO-KB-005','Install water softener cartridge','Fit backordered cartridge and re-run dishwasher commissioning','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Kiran Reddy','high','2026-09-12',5,'["commissioning"]','in-progress','2026-08-30T09:00:00','2026-09-08T09:00:00'),
  (:company,'DEMO-KB-006','As-built drawing markups','Consolidate red-line markups into as-built package','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Meera Nair','medium','2026-09-22',16,'["handover","drawings"]','in-progress','2026-08-25T09:00:00','2026-09-06T09:00:00'),
  (:company,'DEMO-KB-007','Fabricate pantry benching','Cut and weld SS benching for Campus Dining refit','PRJ-DEMO-004','Campus Dining Pantry Refit','Suresh Patel','medium','2026-09-30',40,'["fabrication"]','in-progress','2026-08-20T09:00:00','2026-09-04T09:00:00'),
  (:company,'DEMO-KB-008','Commissary layout Rev B','Incorporate client comments into commissary layout','PRJ-DEMO-005','Summit Catering Central Commissary','Meera Nair','medium','2026-09-19',12,'["design"]','in-progress','2026-08-27T09:00:00','2026-09-05T09:00:00'),
  (:company,'DEMO-KB-009','Hood balancing report','Air balance test and report for extraction hoods','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Deepak Joshi','medium','2026-08-28',6,'["ventilation","report"]','done','2026-08-14T09:00:00','2026-08-27T09:00:00'),
  (:company,'DEMO-KB-010','HACCP validation submission','Compile and submit HACCP validation pack to client','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Kiran Reddy','high','2026-07-01',10,'["haccp","quality"]','done','2026-06-18T09:00:00','2026-07-01T09:00:00');

-- ---------------------------------------------------------------- pm_labor_entries
-- total_manhours = workers*hours + overtime; total_cost = manhours*rate + OT*OT-rate.
DELETE FROM pm_labor_entries WHERE company_id = :company;
INSERT INTO pm_labor_entries
  (company_id, date, project_id, project_name, work_package, labor_category, workers_deployed,
   hours_worked, overtime_hours, total_manhours, planned_manhours, variance, hourly_rate,
   overtime_rate, total_cost, work_description, shift, efficiency, supervisor, remarks, created_at, updated_at)
VALUES
  (:company,'2026-02-10','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Hot Kitchen Line','Skilled',6,8.00,4.00,52.00,50.00,-2.00,32.00,48.00,1728.00,'Cook line benching set and range positioning','Day',96.15,'Rajesh Kumar','OT to recover gas point relocation','2026-02-10T19:00:00Z','2026-02-10T19:00:00Z'),
  (:company,'2026-02-11','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Hot Kitchen Line','Skilled',6,8.00,0.00,48.00,50.00,2.00,32.00,48.00,1536.00,'Range connections and hood alignment','Day',104.17,'Rajesh Kumar',NULL,'2026-02-11T19:00:00Z','2026-02-11T19:00:00Z'),
  (:company,'2026-03-05','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Extraction & Ventilation','Semi-Skilled',4,8.00,2.00,34.00,32.00,-2.00,24.00,36.00,840.00,'Duct riser installation with beam reroute','Day',94.12,'Deepak Joshi','Reroute around structural beam','2026-03-05T19:00:00Z','2026-03-05T19:00:00Z'),
  (:company,'2026-04-14','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Cold Room Assembly','Skilled',8,9.00,6.00,78.00,72.00,-6.00,35.00,52.50,2835.00,'Freezer complex panel erection','Day',92.31,'Suresh Patel','Damaged panels slowed sequence','2026-04-14T19:00:00Z','2026-04-14T19:00:00Z'),
  (:company,'2026-05-20','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Stainless Benching Install','Skilled',5,8.00,0.00,40.00,42.00,2.00,34.00,51.00,1360.00,'Prep area benching and shelving bays','Day',105.00,'Suresh Patel',NULL,'2026-05-20T19:00:00Z','2026-05-20T19:00:00Z'),
  (:company,'2026-06-09','PRJ-DEMO-002','Blue Fig Central Production Kitchen','MEP Hookups','Specialist',3,8.00,3.00,27.00,25.00,-2.00,48.00,72.00,1368.00,'Power terminations and drainage connections','Day',92.59,'Vikram Singh','2 points blocked by landlord DB','2026-06-09T19:00:00Z','2026-06-09T19:00:00Z'),
  (:company,'2026-05-06','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Servery Counters','Skilled',4,8.00,0.00,32.00,34.00,2.00,33.00,49.50,1056.00,'Ward servery counters and gantry wiring','Day',106.25,'Kiran Reddy',NULL,'2026-05-06T19:00:00Z','2026-05-06T19:00:00Z'),
  (:company,'2026-06-17','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Final Commissioning','Specialist',2,6.00,0.00,12.00,12.00,0.00,50.00,75.00,600.00,'Equipment commissioning with client engineer','Day',100.00,'Kiran Reddy','Dishwasher pending softener part','2026-06-17T19:00:00Z','2026-06-17T19:00:00Z');

-- --------------------------------------------------------- pm_material_consumption
-- variance = planned - consumed; total_cost = consumed * unit_cost.
DELETE FROM pm_material_consumption WHERE company_id = :company;
INSERT INTO pm_material_consumption
  (company_id, date, project_id, project_name, work_package, material_code, material_name,
   category, unit, planned_qty, consumed_qty, variance, variance_percent, unit_cost, total_cost,
   source, issued_by, received_by, warehouse_location, remarks, status, created_at, updated_at)
VALUES
  (:company,'2026-02-08','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Hot Kitchen Line','RM-STL-001','Steel Sheet 2mm','Raw Material','Sheet',120.00,126.00,-6.00,-5.00,85.00,10710.00,'Stock','Ravi Menon','Rajesh Kumar','WH-A / Rack 3','Extra sheets for splashback rework','Over Budget','2026-02-08T17:00:00Z','2026-02-08T17:00:00Z'),
  (:company,'2026-02-12','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Hot Kitchen Line','RM-ALM-001','Aluminum Rod 20mm','Raw Material','Pc',40.00,36.00,4.00,10.00,22.00,792.00,'Stock','Ravi Menon','Rajesh Kumar','WH-A / Rack 5',NULL,'Within Budget','2026-02-12T17:00:00Z','2026-02-12T17:00:00Z'),
  (:company,'2026-03-06','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Extraction & Ventilation','RM-COP-001','Copper Wire 2.5mm','Electrical','m',500.00,480.00,20.00,4.00,3.50,1680.00,'Stock','Ravi Menon','Deepak Joshi','WH-B / Bin 12',NULL,'Within Budget','2026-03-06T17:00:00Z','2026-03-06T17:00:00Z'),
  (:company,'2026-04-10','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Fabrication','RM-STL-001','Steel Sheet 2mm','Raw Material','Sheet',300.00,315.00,-15.00,-5.00,85.00,26775.00,'Purchase','Ravi Menon','Suresh Patel','WH-A / Rack 3','Rework on benching gussets','Over Budget','2026-04-10T17:00:00Z','2026-04-10T17:00:00Z'),
  (:company,'2026-04-15','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Cold Room Assembly','INS-PNL-150','PIR Insulated Panel 150mm','Cold Room','Panel',220.00,218.00,2.00,0.91,46.00,10028.00,'Purchase','Ravi Menon','Suresh Patel','Site Laydown 2','2 damaged panels excluded','Within Budget','2026-04-15T17:00:00Z','2026-04-15T17:00:00Z'),
  (:company,'2026-06-10','PRJ-DEMO-002','Blue Fig Central Production Kitchen','MEP Hookups','RM-COP-001','Copper Wire 2.5mm','Electrical','m',800.00,840.00,-40.00,-5.00,3.50,2940.00,'Stock','Ravi Menon','Vikram Singh','WH-B / Bin 12','Longer runs to landlord DB','Over Budget','2026-06-10T17:00:00Z','2026-06-10T17:00:00Z'),
  (:company,'2026-05-04','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Servery Counters','RM-STL-001','Steel Sheet 2mm','Raw Material','Sheet',90.00,88.00,2.00,2.22,85.00,7480.00,'Stock','Ravi Menon','Kiran Reddy','WH-A / Rack 3',NULL,'Within Budget','2026-05-04T17:00:00Z','2026-05-04T17:00:00Z'),
  (:company,'2026-05-05','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Servery Counters','WLD-ROD-316','Welding Rod SS316','Consumable','kg',60.00,63.00,-3.00,-5.00,12.00,756.00,'Stock','Ravi Menon','Kiran Reddy','WH-B / Bin 4','Extra passes on visible seams','Over Budget','2026-05-05T17:00:00Z','2026-05-05T17:00:00Z');

-- ------------------------------------------------------------- pm_material_status
DELETE FROM pm_material_status WHERE company_id = :company;
INSERT INTO pm_material_status
  (company_id, project_id, name, total_qty, reserved, ordered, received, status, created_at, updated_at)
VALUES
  (:company,'PRJ-DEMO-001','Steel Sheet 2mm (SS304)',260.00,20.00,0.00,260.00,'Ready','2026-01-20T09:00:00Z','2026-08-30T09:00:00Z'),
  (:company,'PRJ-DEMO-001','Extraction Hood Filters',48.00,48.00,0.00,48.00,'Ready','2026-02-01T09:00:00Z','2026-03-10T09:00:00Z'),
  (:company,'PRJ-DEMO-002','PIR Insulated Panel 150mm',240.00,218.00,22.00,218.00,'Procuring','2026-03-15T09:00:00Z','2026-09-05T09:00:00Z'),
  (:company,'PRJ-DEMO-002','SS304 Benching Sections',96.00,80.00,16.00,80.00,'Partial','2026-03-20T09:00:00Z','2026-08-22T09:00:00Z'),
  (:company,'PRJ-DEMO-003','Heated Gantry Units',4.00,4.00,0.00,4.00,'Ready','2026-03-28T09:00:00Z','2026-05-02T09:00:00Z'),
  (:company,'PRJ-DEMO-004','Pantry Shelving Kits',18.00,6.00,12.00,6.00,'Procuring','2026-08-05T09:00:00Z','2026-09-02T09:00:00Z');

-- --------------------------------------------------------------- pm_mrp_materials
DELETE FROM pm_mrp_materials WHERE company_id = :company;
INSERT INTO pm_mrp_materials
  (company_id, item_code, item_name, category, required_quantity, unit, available_stock,
   required_date, status, supplier, unit_cost, total_cost, lead_time, project_phase, created_at, updated_at)
VALUES
  (:company,'RM-STL-001','Steel Sheet 2mm','Raw Material',180.00,'Sheet',240.00,'2026-09-20','Available','Apex Steel Supply',85.00,15300.00,7,'Fabrication','2026-08-25T09:00:00Z','2026-09-05T09:00:00Z'),
  (:company,'RM-ALM-001','Aluminum Rod 20mm','Raw Material',60.00,'Pc',44.00,'2026-09-25','Ordered','Apex Steel Supply',22.00,1320.00,10,'Fabrication','2026-08-25T09:05:00Z','2026-09-05T09:00:00Z'),
  (:company,'RM-COP-001','Copper Wire 2.5mm','Electrical',1200.00,'m',350.00,'2026-09-18','Shortage','Volt Electricals',3.50,4200.00,5,'MEP Hookups','2026-08-26T09:00:00Z','2026-09-06T09:00:00Z'),
  (:company,'INS-PNL-150','PIR Insulated Panel 150mm','Cold Room',22.00,'Panel',0.00,'2026-09-22','Ordered','ColdShield Panels',46.00,1012.00,14,'Cold Room Assembly','2026-08-28T09:00:00Z','2026-09-04T09:00:00Z'),
  (:company,'WLD-ROD-316','Welding Rod SS316','Consumable',80.00,'kg',95.00,'2026-09-15','Available','WeldPro Traders',12.00,960.00,3,'Fabrication','2026-08-28T09:10:00Z','2026-09-04T09:00:00Z'),
  (:company,'FG-MTR-001','Industrial Motor 5HP','Bought-out',2.00,'Unit',3.00,'2026-10-01','Available','Dynamo Drives Inc',640.00,1280.00,21,'MEP Hookups','2026-08-29T09:00:00Z','2026-09-06T09:00:00Z'),
  (:company,'HNG-DR-CR','Cold Room Hinged Door 800mm','Cold Room',2.00,'Unit',0.00,'2026-09-28','Ordered','ColdShield Panels',1450.00,2900.00,18,'Cold Room Assembly','2026-08-30T09:00:00Z','2026-09-07T09:00:00Z'),
  (:company,'GSK-FLX-01','Flexible Gas Hose Kit','Consumable',12.00,'Kit',4.00,'2026-09-16','Shortage','GasSafe Fittings',38.00,456.00,6,'Installation','2026-09-01T09:00:00Z','2026-09-08T09:00:00Z');

-- -------------------------------------------------------------- pm_machine_status
DELETE FROM pm_machine_status WHERE company_id = :company;
INSERT INTO pm_machine_status
  (company_id, project_id, name, type, status, oee, current_job, created_at, updated_at)
VALUES
  (:company,'PRJ-DEMO-002','CNC Laser Cutter','Cutting Section','Running',87,'LJ-002','2026-07-20T09:00:00Z','2026-09-08T08:00:00Z'),
  (:company,'PRJ-DEMO-002','Press Brake 120T','Bending Section','Running',82,'BJ-101','2026-07-20T09:05:00Z','2026-09-08T08:00:00Z'),
  (:company,'PRJ-DEMO-001','TIG Welding Bay 1','Welding Section','Idle',74,NULL,'2026-07-20T09:10:00Z','2026-09-07T16:00:00Z'),
  (:company,'PRJ-DEMO-004','TIG Welding Bay 2','Welding Section','Running',79,'WJ-204','2026-07-20T09:12:00Z','2026-09-08T08:00:00Z'),
  (:company,'PRJ-DEMO-004','Assembly Line A','Assembly Section','Running',85,'AS-330','2026-07-20T09:15:00Z','2026-09-08T08:00:00Z'),
  (:company,NULL,'Powder Coating Booth','Painting Section','Maintenance',61,NULL,'2026-07-20T09:20:00Z','2026-09-06T11:00:00Z'),
  (:company,'PRJ-DEMO-002','Polishing Station','Quality Check','Idle',68,NULL,'2026-07-20T09:25:00Z','2026-09-05T15:00:00Z'),
  (:company,'PRJ-DEMO-001','Packing & Crating Line','Packing Section','Running',90,'PK-118','2026-07-20T09:30:00Z','2026-09-08T08:00:00Z');

-- -------------------------------------------------------------- pm_designer_tasks
DELETE FROM pm_designer_tasks WHERE company_id = :company;
INSERT INTO pm_designer_tasks
  (company_id, name, project, assignee, target_date, status, progress, created_at, updated_at)
VALUES
  (:company,'Commissary layout Rev B','Summit Catering Central Commissary','Meera Nair','2026-09-19','In Progress',60,'2026-08-27T09:00:00Z','2026-09-05T09:00:00Z'),
  (:company,'Cold room panel shop drawings Rev E','Blue Fig Central Production Kitchen','Meera Nair','2026-09-26','Pending Review',35,'2026-09-01T09:00:00Z','2026-09-08T09:00:00Z'),
  (:company,'As-built drawings consolidation','Metro Hospital Kitchens Modernization','Meera Nair','2026-09-22','In Progress',70,'2026-08-25T09:00:00Z','2026-09-06T09:00:00Z'),
  (:company,'Pantry benching fabrication drawings','Campus Dining Pantry Refit','Deepak Joshi','2026-09-12','Approved',100,'2026-08-10T09:00:00Z','2026-09-02T09:00:00Z'),
  (:company,'Servery 3D visualization for client','Blue Fig Central Production Kitchen','Deepak Joshi','2026-10-03','Pending Review',15,'2026-09-04T09:00:00Z','2026-09-08T09:00:00Z'),
  (:company,'Handover O&M drawing index','Harbour Grill Flagship Kitchen Fitout','Meera Nair','2026-09-17','In Progress',80,'2026-08-30T09:00:00Z','2026-09-07T09:00:00Z');

-- ------------------------------------------------------------- pm_dispatch_catalog
DELETE FROM pm_dispatch_catalog WHERE company_id = :company;
INSERT INTO pm_dispatch_catalog
  (company_id, code, name, weight, volume, is_active, created_at, updated_at)
VALUES
  (:company,'DEMO-DSP-001','Crate A - Benching Sections (3m)',420.00,4.80,true,'2025-12-10T09:00:00Z','2025-12-10T09:00:00Z'),
  (:company,'DEMO-DSP-002','Crate B - Combi Oven 10-GN',310.00,2.20,true,'2025-12-10T09:05:00Z','2025-12-10T09:05:00Z'),
  (:company,'DEMO-DSP-003','Crate C - Extraction Hood Modules',260.00,3.60,true,'2025-12-10T09:10:00Z','2025-12-10T09:10:00Z'),
  (:company,'DEMO-DSP-004','Pallet D - Cold Room Panels (x10)',540.00,5.40,true,'2026-01-08T09:00:00Z','2026-01-08T09:00:00Z'),
  (:company,'DEMO-DSP-005','Crate E - Servery Counter w/ Gantry',380.00,3.10,true,'2026-02-14T09:00:00Z','2026-02-14T09:00:00Z'),
  (:company,'DEMO-DSP-006','Box F - Small Wares & Fittings',85.00,0.90,true,'2026-02-14T09:05:00Z','2026-06-20T09:00:00Z');

-- ------------------------------------------------------------ pm_equipment_catalog
DELETE FROM pm_equipment_catalog WHERE company_id = :company;
INSERT INTO pm_equipment_catalog
  (company_id, code, name, category, is_active, created_at, updated_at)
VALUES
  (:company,'DEMO-EQ-001','Combi Oven 10-GN','Cooking',true,'2025-10-10T09:00:00Z','2025-10-10T09:00:00Z'),
  (:company,'DEMO-EQ-002','6-Burner Gas Range with Oven','Cooking',true,'2025-10-10T09:02:00Z','2025-10-10T09:02:00Z'),
  (:company,'DEMO-EQ-003','Blast Chiller 5-Tray','Refrigeration',true,'2025-10-10T09:04:00Z','2025-10-10T09:04:00Z'),
  (:company,'DEMO-EQ-004','Walk-in Cold Room 20sqm','Refrigeration',true,'2025-10-10T09:06:00Z','2025-10-10T09:06:00Z'),
  (:company,'DEMO-EQ-005','Hood-Type Dishwasher','Warewashing',true,'2025-10-10T09:08:00Z','2025-10-10T09:08:00Z'),
  (:company,'DEMO-EQ-006','SS Work Table 1800mm','Fabrication',true,'2025-10-10T09:10:00Z','2025-10-10T09:10:00Z'),
  (:company,'DEMO-EQ-007','Extraction Hood 3000mm','Ventilation',true,'2025-10-10T09:12:00Z','2025-10-10T09:12:00Z'),
  (:company,'DEMO-EQ-008','Heated Servery Gantry 1500mm','Servery',true,'2025-10-10T09:14:00Z','2026-03-01T09:00:00Z');

-- ------------------------------------------------------ pm_installation_activities
DELETE FROM pm_installation_activities WHERE company_id = :company;
INSERT INTO pm_installation_activities
  (company_id, activity_number, project_id, project_name, equipment_item, equipment_code,
   location, zone, installation_type, planned_start_date, planned_end_date, actual_start_date,
   actual_end_date, status, progress, assigned_team, team_size, supervisor, dependencies,
   prerequisites_completed, material_availability, tools_required, safety_checklist,
   quality_checkpoint, photos, remarks, issues, delay_reason, created_at, updated_at)
VALUES
  (:company,'DEMO-INST-001','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','6-Burner Gas Range with Oven','DEMO-EQ-002','Main Kitchen','Hot Kitchen','Fixed - Gas','2026-02-09','2026-02-12','2026-02-10','2026-02-11','Completed',100,'Install Crew A',6,'Rajesh Kumar','["Benching set","Gas point G-07 relocated"]',true,'Available','["Pallet jack","Laser level","Gas tightness kit"]',true,true,14,'Completed one day early after gas point fix','[]',NULL,'2026-01-28T09:00:00Z','2026-02-11T18:00:00Z'),
  (:company,'DEMO-INST-002','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Extraction Hood 3000mm','DEMO-EQ-007','Main Kitchen','Hot Kitchen','Suspended','2026-02-11','2026-02-14','2026-02-11','2026-02-14','Completed',100,'Install Crew A',4,'Deepak Joshi','["DEMO-INST-001"]',true,'Available','["Scissor lift","Chain hoist"]',true,true,10,NULL,'[]',NULL,'2026-01-28T09:05:00Z','2026-02-14T18:00:00Z'),
  (:company,'DEMO-INST-003','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Combi Oven 10-GN','DEMO-EQ-001','Main Kitchen','Hot Kitchen','Fixed - Electric','2026-02-16','2026-02-17','2026-02-16','2026-02-17','Completed',100,'Install Crew A',3,'Rajesh Kumar','["DEMO-INST-002"]',true,'Available','["Stair climber trolley","Test meter"]',true,true,8,NULL,'[]',NULL,'2026-01-28T09:10:00Z','2026-02-17T18:00:00Z'),
  (:company,'DEMO-INST-004','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Walk-in Cold Room 20sqm','DEMO-EQ-004','Basement Level','Cold Storage','Modular Build','2026-04-08','2026-04-22','2026-04-10',NULL,'In Progress',85,'Refrigeration Crew',8,'Suresh Patel','["Slab cured","Drainage in"]',true,'Partial','["Panel lifter","Genie hoist","Cam-lock tool"]',true,false,22,'Awaiting 2 replacement panels for final wall','["2 panels damaged in transit"]','Replacement panel lead time','2026-03-25T09:00:00Z','2026-09-05T18:00:00Z'),
  (:company,'DEMO-INST-005','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Hood-Type Dishwasher','DEMO-EQ-005','Ground Floor','Warewash','Fixed - Plumbed','2026-06-15','2026-06-17',NULL,NULL,'On Hold',0,'Install Crew B',3,'Vikram Singh','["Landlord DB upgrade","Water softener install"]',false,'Available','["Test meter","Plumbing kit"]',false,false,0,'Blocked until landlord DB upgrade completes','["Power supply pending landlord works"]','Landlord DB upgrade pending','2026-05-30T09:00:00Z','2026-09-08T18:00:00Z'),
  (:company,'DEMO-INST-006','PRJ-DEMO-002','Blue Fig Central Production Kitchen','SS Work Table 1800mm','DEMO-EQ-006','Ground Floor','Prep Area','Freestanding','2026-05-18','2026-05-21','2026-05-19','2026-05-20','Completed',100,'Install Crew B',5,'Suresh Patel','[]',true,'Available','["Laser level","Trolleys"]',true,true,7,NULL,'[]',NULL,'2026-05-02T09:00:00Z','2026-05-20T18:00:00Z'),
  (:company,'DEMO-INST-007','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Heated Servery Gantry 1500mm','DEMO-EQ-008','Ward Block C','Servery','Counter-mounted','2026-05-04','2026-05-08','2026-05-05','2026-05-06','Completed',100,'Install Crew C',4,'Kiran Reddy','["Counters installed"]',true,'Available','["Pallet jack","Test meter"]',true,true,12,NULL,'[]',NULL,'2026-04-20T09:00:00Z','2026-05-06T18:00:00Z'),
  (:company,'DEMO-INST-008','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Blast Chiller 5-Tray','DEMO-EQ-003','Main Kitchen','Cold Prep','Fixed - Electric','2026-06-01','2026-06-03','2026-06-02','2026-06-03','Completed',100,'Install Crew C',3,'Kiran Reddy','[]',true,'Available','["Stair climber trolley"]',true,true,6,NULL,'[]',NULL,'2026-05-18T09:00:00Z','2026-06-03T18:00:00Z');

-- ------------------------------------------------------------- pm_layout_briefings
DELETE FROM pm_layout_briefings WHERE company_id = :company;
INSERT INTO pm_layout_briefings
  (company_id, briefing_number, project_id, project_name, briefing_date, briefing_time,
   location, organizer, status, attendees, agenda, minutes, action_items, attachments,
   duration, created_at, updated_at)
VALUES
  (:company,'DEMO-BRF-001','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','2025-11-05','10:00','Client HQ - San Francisco','Sarah Mitchell','Completed','["Sarah Mitchell","Meera Nair","Marcus Lee","Head Chef A. Romano"]','Review Rev B layout; confirm hot kitchen flow and pass-through window','Chef requested 10-GN combi upsize; pass window agreed at 1100mm','Update GA to Rev C; reissue equipment schedule','["DEMO-DOC-001"]','90 min','2025-11-01T09:00:00Z','2025-11-05T14:00:00Z'),
  (:company,'DEMO-BRF-002','PRJ-DEMO-002','Blue Fig Central Production Kitchen','2026-01-20','14:00','Site Office - New York','Sarah Mitchell','Completed','["Sarah Mitchell","Suresh Patel","Amelia Torres","F&B Director"]','Cold room capacity split; panel delivery logistics; crane slots','Freezer/chiller split revised 60/40; night deliveries approved','Issue panel layout Rev C; book crane for w/c 06-Apr','["DEMO-DOC-004"]','120 min','2026-01-14T09:00:00Z','2026-01-20T17:00:00Z'),
  (:company,'DEMO-BRF-003','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','2026-02-02','09:00','Metro Hospital - Facilities Room','David Williams','Completed','["David Williams","Kiran Reddy","Dr. Karen Ng","Infection Control Officer"]','Phasing plan to keep patient meals running; HACCP hold points','3-phase handback agreed; temporary servery in Ward B corridor','Publish phasing programme; submit HACCP hold-point register','[]','75 min','2026-01-26T09:00:00Z','2026-02-02T12:00:00Z'),
  (:company,'DEMO-BRF-004','PRJ-DEMO-005','Summit Catering Central Commissary','2026-08-21','11:00','Video Call','Sarah Mitchell','Completed','["Sarah Mitchell","Meera Nair","Nina Alvarez"]','First-pass commissary layout walkthrough','Client wants bakery corner enlarged; dispatch airlock added','Produce layout Rev B by 19-Sep','[]','60 min','2026-08-17T09:00:00Z','2026-08-21T13:00:00Z'),
  (:company,'DEMO-BRF-005','PRJ-DEMO-002','Blue Fig Central Production Kitchen','2026-09-16','10:30','Site Office - New York','Sarah Mitchell','Scheduled','["Sarah Mitchell","Vikram Singh","Amelia Torres","Landlord FM"]','Unblock landlord DB upgrade; agree warewash install window',NULL,NULL,'[]','60 min','2026-09-05T09:00:00Z','2026-09-05T09:00:00Z');

-- --------------------------------------------------------------- pm_project_issues
DELETE FROM pm_project_issues WHERE company_id = :company;
INSERT INTO pm_project_issues
  (company_id, number, title, type, category, project_number, project_name, description,
   impact, probability, status, priority, raised_by, assigned_to, raised_date, target_date,
   resolved_date, mitigation_plan, cost_impact, schedule_impact, created_at, updated_at)
VALUES
  (:company,'DEMO-ISS-001','Gas point G-07 mislocated','Issue','Site Services','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Builder-installed gas point 300mm off layout position, blocking range set','Medium','High','Resolved','P2','Rajesh Kumar','Rajesh Kumar','2026-02-10','2026-02-12','2026-02-11','Relocated flexi connection with certified fitter; OT shift to recover',1728.00,1,'2026-02-10T12:00:00Z','2026-02-11T18:00:00Z'),
  (:company,'DEMO-ISS-002','Duct riser R3 clash with structural beam','Issue','Design','PRJ-DEMO-001','Harbour Grill Flagship Kitchen Fitout','Riser R3 route clashes with unmapped steel beam above ceiling','Medium','High','Resolved','P2','Deepak Joshi','Deepak Joshi','2026-03-05','2026-03-10','2026-03-09','Rerouted duct with two additional bends; airflow recalculated',4200.00,2,'2026-03-05T12:00:00Z','2026-03-09T18:00:00Z'),
  (:company,'DEMO-ISS-003','Cold room panels damaged in transit','Issue','Logistics','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Two PIR panels crushed on delivery truck; final freezer wall incomplete','High','Medium','In Progress','P1','Suresh Patel','Anita Desai','2026-04-14','2026-09-22',NULL,'Replacements ordered from ColdShield; carrier claim lodged',2100.00,6,'2026-04-14T12:00:00Z','2026-09-05T18:00:00Z'),
  (:company,'DEMO-ISS-004','Landlord DB upgrade delay','Risk','External Dependency','PRJ-DEMO-002','Blue Fig Central Production Kitchen','Warewash power depends on landlord distribution board upgrade with no confirmed date','High','High','Open','P1','Vikram Singh','Sarah Mitchell','2026-06-09','2026-09-30',NULL,'Escalated via client; briefing DEMO-BRF-005 booked with landlord FM; temp supply option costed',8500.00,14,'2026-06-09T12:00:00Z','2026-09-08T18:00:00Z'),
  (:company,'DEMO-ISS-005','Dishwasher softener cartridge backorder','Issue','Procurement','PRJ-DEMO-003','Metro Hospital Kitchens Modernization','Water softener cartridge on supplier backorder, delaying final commissioning item','Low','High','In Progress','P3','Kiran Reddy','Ravi Menon','2026-06-17','2026-09-12',NULL,'Alternative supplier sourced; part in transit',180.00,3,'2026-06-17T12:00:00Z','2026-09-08T18:00:00Z'),
  (:company,'DEMO-ISS-006','Steel price escalation on rework','Risk','Commercial','PRJ-DEMO-002','Blue Fig Central Production Kitchen','SS sheet consumption running 5% over plan; further rework could erode margin','Medium','Medium','Open','P2','Anita Desai','Sarah Mitchell','2026-07-02','2026-10-15',NULL,'Weekly consumption review; nesting optimization on remaining fabrication',12000.00,0,'2026-07-02T12:00:00Z','2026-09-04T18:00:00Z'),
  (:company,'DEMO-ISS-007','Campus term-time site access limits','Risk','Site Access','PRJ-DEMO-004','Campus Dining Pantry Refit','University restricts noisy works to 06:00-09:00 during term, compressing install windows','Medium','High','Open','P2','David Williams','David Williams','2026-08-20','2026-10-01',NULL,'Resequence to prefabricate off-site; weekend working approval requested',6400.00,7,'2026-08-20T12:00:00Z','2026-09-02T18:00:00Z');
