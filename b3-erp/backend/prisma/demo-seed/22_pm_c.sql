-- Demo seed — Project Management (part C) for B3 MACBIS.
-- Covers: pm_site_surveys, pm_site_photos, pm_wbs_nodes, pm_scope_items,
--   project_tasks, project_milestones, project_budgets, project_resources,
--   pm_resource_requests, pm_resource_skills, pm_resource_utilization,
--   resource_capacity, pm_purchase_requisitions, production_logs, qc_records,
--   pm_quality_inspections, site_readiness, tool_deployments, trial_reports,
--   pm_reports, pm_report_templates, pm_site_issues.
-- Story: commercial-kitchen fitout (site survey -> WBS -> fabrication -> install -> QC)
--   across the 3 seeded projects; timeline 2025-10-01 .. 2026-09-10.
-- Idempotent: DELETE-then-INSERT.
--   * Tables with company_id: deleted by company_id = :company.
--   * Tables FK'd to projects: deleted by project_id in the 3 demo projects
--     (PRJ-2026-0001 / PRJ-2026-0005 / PRJ-2026-0006).
--   * resource_capacity: deleted by user_id in the demo EMP00xx codes.

\set company '''b3000000-0000-4000-8000-000000000001'''
\set p1 '(SELECT id FROM projects WHERE project_code = ''PRJ-2026-0001'')'
\set p2 '(SELECT id FROM projects WHERE project_code = ''PRJ-2026-0005'')'
\set p3 '(SELECT id FROM projects WHERE project_code = ''PRJ-2026-0006'')'

-- ============================================================================
-- pm_site_surveys (loosely-typed UI table; project_id stores the project code)
-- ============================================================================
DELETE FROM pm_site_surveys WHERE company_id = :company;
INSERT INTO pm_site_surveys
  (company_id, survey_number, project_id, project_name, project_type, survey_date,
   site_name, site_address, city, state, surveyor_name, surveyor_contact, status,
   measurements, accessibility, power_available, water_available, drainage_available,
   floor_level, ceiling_type, wall_condition, ventilation, natural_light,
   existing_equipment, obstacles, special_requirements, photos_count, drawings_count,
   issues, recommendations, estimated_budget, completion_percent, created_at, updated_at)
VALUES
  (:company,'DEMO-SRV-001','PRJ-2026-0001','Industrial Kitchen 2026','Commercial Kitchen Fitout','2025-11-10',
   'Grand Hyatt Dubai — Main Kitchen','Sheikh Rashid Rd, Oud Metha','Dubai','Dubai','Suresh Patel','+971-50-555-0105','Completed',
   '{"lengthM":24.5,"widthM":16.2,"heightM":3.4,"areaSqm":396.9}','Service elevator + loading dock',true,true,true,
   'Level B1','Suspended grid','Tiled, good condition','Existing exhaust hood undersized','None',
   'Legacy cook line (12 units) to be decommissioned','Structural column mid-span near wash area','Halal-compliant zoning; 3-phase 400A supply upgrade',
   14,3,'["Exhaust duct route conflicts with chilled water line"]','["Relocate wash-up to east wall","Upgrade MDB to 400A"]',
   1850000.00,100,'2025-11-10 09:00:00+04','2025-11-12 17:30:00+04'),
  (:company,'DEMO-SRV-002','PRJ-2026-0001','Industrial Kitchen 2026','Commercial Kitchen Fitout','2025-12-05',
   'Grand Hyatt Dubai — Banquet Kitchen','Sheikh Rashid Rd, Oud Metha','Dubai','Dubai','Suresh Patel','+971-50-555-0105','Completed',
   '{"lengthM":18.0,"widthM":11.5,"heightM":3.2,"areaSqm":207.0}','Rear service corridor only',true,true,false,
   'Level B1','Concrete slab','Repaint required','Fresh-air makeup adequate','None',
   'Two walk-in chillers to be retained','Low soffit at duct crossing (2.6m)','Drainage trench to be cut for combi line',
   9,2,'["No floor drain in banquet plating area"]','["Cut 6m drainage trench","Retain and service both walk-ins"]',
   620000.00,100,'2025-12-05 08:30:00+04','2025-12-07 16:00:00+04'),
  (:company,'DEMO-SRV-003','PRJ-2026-0005','Solar Panel Array Installation','Rooftop Installation','2026-02-12',
   'GreenEnergy Warehouse Roof','Jebel Ali Free Zone, Gate 4','Jebel Ali','Dubai','Vikram Singh','+971-50-555-0104','Completed',
   '{"roofAreaSqm":5200,"parapetHeightM":1.1,"loadKgSqm":38}','Crane access from north yard',true,false,false,
   'Roof +12m','Metal deck','N/A','Open air','Full',
   'HVAC condensers occupying 8% of roof','Skylight strips rows 4-6','Wind-load rated ballast mounting; no roof penetrations',
   22,4,'["Deck corrosion patches near gutter line"]','["Treat corrosion before ballast placement","Reroute cable tray around skylights"]',
   940000.00,100,'2026-02-12 07:00:00+04','2026-02-14 15:45:00+04'),
  (:company,'DEMO-SRV-004','PRJ-2026-0006','Automation Line Upgrade','Factory Retrofit','2026-08-18',
   'AutoParts Plant 2 — Line 3','Industrial Area 12','Sharjah','Sharjah','Suresh Patel','+971-50-555-0105','In Progress',
   '{"lengthM":42.0,"widthM":8.5,"heightM":6.0}','Forklift ramp, door 4',true,true,true,
   'Ground','Steel truss','Good','Roof extractors adequate','Partial',
   'Conveyor line 3 (to be upgraded in place)','Overhead crane rail limits lift height','Production must continue on lines 1-2 during works',
   6,1,'["As-built drawings outdated"]','["Laser-scan line 3 before detail design"]',
   2400000.00,65,'2026-08-18 08:00:00+04','2026-09-08 12:00:00+04'),
  (:company,'DEMO-SRV-005','PRJ-2026-0001','Industrial Kitchen 2026','Commercial Kitchen Fitout','2026-06-02',
   'Grand Hyatt Dubai — Main Kitchen (pre-install re-survey)','Sheikh Rashid Rd, Oud Metha','Dubai','Dubai','Vikram Singh','+971-50-555-0104','Completed',
   '{"verified":"MEP first-fix positions vs shop drawings"}','Service elevator + loading dock',true,true,true,
   'Level B1','Suspended grid','Tiled, good condition','New exhaust hood installed','None',
   'Site cleared; first-fix MEP complete','None','Confirm hood-to-duct flange alignment before cook line delivery',
   11,2,'["Two floor sockets 40mm off gridline"]','["Chase and reset sockets before island line install"]',
   0.00,100,'2026-06-02 09:00:00+04','2026-06-03 13:20:00+04');

-- ============================================================================
-- pm_site_photos (project_id varchar stores the project code)
-- ============================================================================
DELETE FROM pm_site_photos WHERE project_id IN ('PRJ-2026-0001','PRJ-2026-0005','PRJ-2026-0006');
INSERT INTO pm_site_photos (project_id, photo_url, description, created_at)
VALUES
  ('PRJ-2026-0001','https://demo.b3macbis.com/photos/ik26/survey-main-kitchen-01.jpg','Main kitchen before strip-out — legacy cook line in place','2025-11-10 10:15:00'),
  ('PRJ-2026-0001','https://demo.b3macbis.com/photos/ik26/drainage-trench-01.jpg','Drainage trench cut for combi line, banquet kitchen','2026-02-20 14:40:00'),
  ('PRJ-2026-0001','https://demo.b3macbis.com/photos/ik26/hood-install-01.jpg','New exhaust hood rigged and set on island line','2026-05-28 11:05:00'),
  ('PRJ-2026-0001','https://demo.b3macbis.com/photos/ik26/cookline-install-01.jpg','Stainless cook line positioned, awaiting gas connection','2026-06-25 16:30:00'),
  ('PRJ-2026-0005','https://demo.b3macbis.com/photos/solar/roof-corrosion-01.jpg','Deck corrosion patches near gutter line, pre-treatment','2026-02-13 09:50:00'),
  ('PRJ-2026-0005','https://demo.b3macbis.com/photos/solar/ballast-rows-01.jpg','Ballast mounting rows 1-8 complete, panels landing','2026-06-10 08:20:00');

-- ============================================================================
-- pm_wbs_nodes (hierarchy via fixed UUIDs in parent_id; no project FK column,
-- project association carried in the code prefix: IK26 / SOL26)
-- ============================================================================
DELETE FROM pm_wbs_nodes WHERE company_id = :company;
INSERT INTO pm_wbs_nodes
  (id, company_id, code, name, type, level, parent_id, progress, status, start_date, end_date,
   assigned_to, estimated_hours, actual_hours, budget, actual_cost, created_at, updated_at)
VALUES
  -- Industrial Kitchen 2026 tree
  ('d22a0000-0000-4000-8000-000000000001',:company,'IK26','Industrial Kitchen 2026','Project',0,NULL,88,'In Progress','2026-01-15','2026-09-30','Rajesh Kumar',9200.00,8410.00,4850000.00,4120000.00,'2026-01-10 09:00:00+04','2026-09-09 18:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000002',:company,'IK26.1','Design & Engineering','Phase',1,'d22a0000-0000-4000-8000-000000000001',100,'Completed','2026-01-15','2026-02-28','Priya Sharma',1400.00,1520.00,420000.00,455000.00,'2026-01-10 09:05:00+04','2026-03-02 10:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000003',:company,'IK26.2','Procurement','Phase',1,'d22a0000-0000-4000-8000-000000000001',100,'Completed','2026-02-01','2026-04-15','Suresh Patel',900.00,940.00,1650000.00,1598000.00,'2026-01-10 09:06:00+04','2026-04-16 15:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000004',:company,'IK26.3','Fabrication','Phase',1,'d22a0000-0000-4000-8000-000000000001',100,'Completed','2026-03-01','2026-05-31','Deepak Joshi',3200.00,3350.00,1150000.00,1187000.00,'2026-01-10 09:07:00+04','2026-06-02 09:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000005',:company,'IK26.3.1','Sheet Metal & Counters','Work Package',2,'d22a0000-0000-4000-8000-000000000004',100,'Completed','2026-03-01','2026-04-30','Deepak Joshi',1900.00,1980.00,680000.00,701000.00,'2026-01-10 09:08:00+04','2026-05-02 09:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000006',:company,'IK26.3.2','Hood & Ducting Assembly','Work Package',2,'d22a0000-0000-4000-8000-000000000004',100,'Completed','2026-04-01','2026-05-31','Ravi Menon',1300.00,1370.00,470000.00,486000.00,'2026-01-10 09:09:00+04','2026-06-02 09:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000007',:company,'IK26.4','Site Installation','Phase',1,'d22a0000-0000-4000-8000-000000000001',92,'In Progress','2026-06-01','2026-08-15','Vikram Singh',2600.00,2420.00,980000.00,842000.00,'2026-01-10 09:10:00+04','2026-09-09 18:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000008',:company,'IK26.5','Testing & Commissioning','Phase',1,'d22a0000-0000-4000-8000-000000000001',45,'In Progress','2026-08-10','2026-09-30','Amit Verma',1100.00,200.00,650000.00,38000.00,'2026-01-10 09:11:00+04','2026-09-09 18:00:00+04'),
  -- Solar Panel Array tree
  ('d22a0000-0000-4000-8000-000000000011',:company,'SOL26','Solar Panel Array Installation','Project',0,NULL,62,'In Progress','2026-03-01','2026-11-30','Rajesh Kumar',5400.00,3260.00,3100000.00,1870000.00,'2026-02-20 09:00:00+04','2026-09-09 18:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000012',:company,'SOL26.1','Roof Preparation & Ballast','Phase',1,'d22a0000-0000-4000-8000-000000000011',100,'Completed','2026-03-01','2026-05-31','Vikram Singh',1600.00,1690.00,760000.00,791000.00,'2026-02-20 09:05:00+04','2026-06-02 10:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000013',:company,'SOL26.2','Panel Mounting & Stringing','Phase',1,'d22a0000-0000-4000-8000-000000000011',70,'In Progress','2026-05-15','2026-09-30','Ganesh Patil',2600.00,1570.00,1650000.00,1079000.00,'2026-02-20 09:06:00+04','2026-09-09 18:00:00+04'),
  ('d22a0000-0000-4000-8000-000000000014',:company,'SOL26.3','Inverters & Grid Tie-in','Phase',1,'d22a0000-0000-4000-8000-000000000011',10,'Not Started','2026-09-15','2026-11-30','Arun Gupta',1200.00,0.00,690000.00,0.00,'2026-02-20 09:07:00+04','2026-09-01 09:00:00+04');

-- ============================================================================
-- pm_scope_items
-- ============================================================================
DELETE FROM pm_scope_items WHERE company_id = :company;
INSERT INTO pm_scope_items
  (company_id, item_code, item_name, description, project_code, project_name, category, type,
   status, wbs_reference, priority, estimated_cost, estimated_duration, dependencies,
   approved_by, approved_date, notes, created_at, updated_at)
VALUES
  (:company,'DEMO-SCP-001','Main cook line (island)','12-station stainless island cook line incl. ranges, fryers, griddles','PRJ-2026-0001','Industrial Kitchen 2026','deliverable','in-scope','approved','IK26.3.1','high',720000.00,45,'["DEMO-SCP-003"]','Rajesh Kumar','2026-01-28','Halal zoning applies to layout','2026-01-20 10:00:00','2026-01-28 16:00:00'),
  (:company,'DEMO-SCP-002','Exhaust hood + ducting','UL-listed hood, 24m duct run, make-up air unit','PRJ-2026-0001','Industrial Kitchen 2026','deliverable','in-scope','approved','IK26.3.2','high',470000.00,60,'[]','Rajesh Kumar','2026-01-28',NULL,'2026-01-20 10:05:00','2026-01-28 16:00:00'),
  (:company,'DEMO-SCP-003','MEP first-fix upgrade','400A MDB upgrade, gas line, drainage trench','PRJ-2026-0001','Industrial Kitchen 2026','work-package','in-scope','completed','IK26.4','critical',380000.00,40,'[]','Rajesh Kumar','2026-01-28','Subcontracted to GulfMEP LLC','2026-01-20 10:10:00','2026-05-30 12:00:00'),
  (:company,'DEMO-SCP-004','Banquet plating counters','Cold/hot plating counters, 18m run','PRJ-2026-0001','Industrial Kitchen 2026','deliverable','in-scope','in-progress','IK26.3.1','medium',260000.00,30,'["DEMO-SCP-003"]','Rajesh Kumar','2026-02-05',NULL,'2026-01-22 09:00:00','2026-08-20 11:00:00'),
  (:company,'DEMO-SCP-005','Cold room refurbishment','Service and re-gas the two retained walk-in chillers','PRJ-2026-0001','Industrial Kitchen 2026','deliverable','out-of-scope','defined',NULL,'low',85000.00,10,'[]',NULL,NULL,'Client opted to handle via FM contract','2026-02-10 09:00:00','2026-02-10 09:00:00'),
  (:company,'DEMO-SCP-006','Ballast mounting system','Wind-rated ballast frames, 5200 sqm roof, no penetrations','PRJ-2026-0005','Solar Panel Array Installation','deliverable','in-scope','completed','SOL26.1','high',760000.00,55,'[]','Rajesh Kumar','2026-02-25',NULL,'2026-02-18 09:00:00','2026-06-02 10:00:00'),
  (:company,'DEMO-SCP-007','PV panels + stringing (1.2 MWp)','2,900 bifacial panels, DC stringing and tray work','PRJ-2026-0005','Solar Panel Array Installation','deliverable','in-scope','in-progress','SOL26.2','critical',1650000.00,90,'["DEMO-SCP-006"]','Rajesh Kumar','2026-02-25',NULL,'2026-02-18 09:05:00','2026-09-05 17:00:00'),
  (:company,'DEMO-SCP-008','Line 3 conveyor retrofit','Replace drive units and add PLC-controlled diverters on line 3','PRJ-2026-0006','Automation Line Upgrade','deliverable','in-scope','defined',NULL,'high',1400000.00,120,'[]',NULL,NULL,'Pending laser scan of as-built line','2026-08-20 09:00:00','2026-09-08 12:00:00');

-- ============================================================================
-- project_tasks (parents first, then children; self-FK on parent_task_id)
-- ============================================================================
DELETE FROM project_tasks WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO project_tasks
  (id, project_id, name, description, start_date, end_date, planned_duration, actual_duration,
   progress, status, priority, assigned_to, parent_task_id, dependencies, estimated_hours,
   actual_hours, milestone, target_completion, created_at, updated_at)
VALUES
  ('d22b0000-0000-4000-8000-000000000001',:p1,'Design & shop drawings','Kitchen layout, shop drawings, MEP coordination','2026-01-15','2026-02-28','32d','34d',100.00,'completed','high',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0002','EMP0014')),NULL,'[]',1400.00,1520.00,false,'2026-02-28','2026-01-12 09:00:00','2026-03-02 10:00:00'),
  ('d22b0000-0000-4000-8000-000000000002',:p1,'Fabrication — cook line & counters','Sheet metal fabrication of island line and plating counters','2026-03-01','2026-05-31','65d','67d',100.00,'completed','high',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0009','EMP0013')),NULL,'["d22b0000-0000-4000-8000-000000000001"]',3200.00,3350.00,false,'2026-05-31','2026-01-12 09:05:00','2026-06-02 09:00:00'),
  ('d22b0000-0000-4000-8000-000000000003',:p1,'Site installation','Deliver, position and connect all kitchen equipment','2026-06-01','2026-08-15','54d',NULL,92.00,'in_progress','critical',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0004','EMP0020')),NULL,'["d22b0000-0000-4000-8000-000000000002"]',2600.00,2420.00,false,'2026-08-15','2026-01-12 09:10:00','2026-09-09 18:00:00'),
  ('d22b0000-0000-4000-8000-000000000004',:p2,'Roof preparation & ballast','Corrosion treatment, ballast frames rows 1-16','2026-03-01','2026-05-31','64d','66d',100.00,'completed','high',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0004','EMP0019')),NULL,'[]',1600.00,1690.00,false,'2026-05-31','2026-02-22 09:00:00','2026-06-02 10:00:00'),
  ('d22b0000-0000-4000-8000-000000000011',:p1,'Laser cutting & bending','Cut and form stainless panels for cook line','2026-03-01','2026-04-10','28d','30d',100.00,'completed','high',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0009')),'d22b0000-0000-4000-8000-000000000002','[]',1100.00,1160.00,false,'2026-04-10','2026-01-12 09:06:00','2026-04-12 09:00:00'),
  ('d22b0000-0000-4000-8000-000000000012',:p1,'Welding & assembly','Weld frames, assemble hood modules and counters','2026-04-01','2026-05-20','36d','37d',100.00,'completed','high',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0013','EMP0019')),'d22b0000-0000-4000-8000-000000000002','["d22b0000-0000-4000-8000-000000000011"]',1500.00,1560.00,false,'2026-05-20','2026-01-12 09:07:00','2026-05-22 09:00:00'),
  ('d22b0000-0000-4000-8000-000000000013',:p1,'Powder coating & finishing','Powder-coat support frames, polish stainless surfaces','2026-05-10','2026-05-31','16d','17d',100.00,'completed','medium',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0010')),'d22b0000-0000-4000-8000-000000000002','["d22b0000-0000-4000-8000-000000000012"]',600.00,630.00,false,'2026-05-31','2026-01-12 09:08:00','2026-06-02 09:00:00'),
  ('d22b0000-0000-4000-8000-000000000014',:p1,'Hood & duct installation','Rig hood, run 24m duct, connect make-up air unit','2026-06-01','2026-06-30','22d','24d',100.00,'completed','critical',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0004')),'d22b0000-0000-4000-8000-000000000003','[]',700.00,760.00,false,'2026-06-30','2026-01-12 09:11:00','2026-07-02 09:00:00'),
  ('d22b0000-0000-4000-8000-000000000015',:p1,'Cook line hookup & snagging','Gas/electrical hookup, level and seal, snag list closure','2026-07-01','2026-08-15','33d',NULL,85.00,'in_progress','critical',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0004','EMP0020')),'d22b0000-0000-4000-8000-000000000003','["d22b0000-0000-4000-8000-000000000014"]',900.00,810.00,false,'2026-08-15','2026-01-12 09:12:00','2026-09-09 18:00:00'),
  ('d22b0000-0000-4000-8000-000000000016',:p1,'Testing & commissioning','Performance trials, hygiene certification, handover pack','2026-08-10','2026-09-30','36d',NULL,45.00,'in_progress','high',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0007')),NULL,'["d22b0000-0000-4000-8000-000000000015"]',1100.00,200.00,true,'2026-09-30','2026-01-12 09:13:00','2026-09-09 18:00:00'),
  ('d22b0000-0000-4000-8000-000000000017',:p2,'Panel mounting & DC stringing','Land 2,900 panels, string and tray to combiner boxes','2026-05-15','2026-09-30','98d',NULL,70.00,'in_progress','high',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0020','EMP0019')),'d22b0000-0000-4000-8000-000000000004','[]',2600.00,1570.00,false,'2026-09-30','2026-02-22 09:05:00','2026-09-09 18:00:00'),
  ('d22b0000-0000-4000-8000-000000000018',:p3,'Detail design — line 3 retrofit','Laser scan, drive selection, PLC architecture','2026-09-15','2026-11-15','44d',NULL,0.00,'not_started','medium',(SELECT array_agg(id) FROM hr_employees WHERE "employeeCode" IN ('EMP0002')),NULL,'[]',800.00,0.00,false,'2026-11-15','2026-08-25 09:00:00','2026-08-25 09:00:00');

-- ============================================================================
-- project_milestones
-- ============================================================================
DELETE FROM project_milestones WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO project_milestones
  (project_id, name, description, due_date, completed_date, status, deliverables, created_at, updated_at)
VALUES
  (:p1,'Design sign-off','Client approval of layout and shop drawings','2026-02-28','2026-03-02','completed','["Approved GA drawings","MEP coordination set"]','2026-01-12 09:20:00','2026-03-02 10:00:00'),
  (:p1,'Fabrication complete','All cook line and counter modules ex-works','2026-05-31','2026-06-01','completed','["QC release notes","Packing list"]','2026-01-12 09:21:00','2026-06-01 15:00:00'),
  (:p1,'Hood & ducting installed','Exhaust system installed and pressure-tested','2026-06-30','2026-07-02','completed','["Duct pressure test report"]','2026-01-12 09:22:00','2026-07-02 12:00:00'),
  (:p1,'Cook line operational','All stations connected and fired up','2026-08-15',NULL,'in_progress','["Gas safety certificate","Snag list closure"]','2026-01-12 09:23:00','2026-09-09 18:00:00'),
  (:p1,'Handover & hygiene certification','Municipality hygiene cert and client handover pack','2026-09-30',NULL,'pending','["Hygiene certificate","O&M manuals","Training records"]','2026-01-12 09:24:00','2026-01-12 09:24:00'),
  (:p2,'Roof preparation complete','Corrosion treated, ballast frames installed','2026-05-31','2026-06-01','completed','["Roof load verification report"]','2026-02-22 09:10:00','2026-06-01 10:00:00'),
  (:p2,'50% panels mounted','1,450 panels landed and strung','2026-08-15','2026-08-12','completed','["String continuity log rows 1-8"]','2026-02-22 09:11:00','2026-08-12 16:00:00'),
  (:p2,'Grid tie-in energised','Inverters commissioned, DEWA meter live','2026-11-30',NULL,'pending','["Commissioning certificate","DEWA NOC"]','2026-02-22 09:12:00','2026-02-22 09:12:00'),
  (:p3,'Retrofit design freeze','Line 3 retrofit design approved by AutoParts','2026-11-15',NULL,'pending','["Signed design dossier"]','2026-08-25 09:10:00','2026-08-25 09:10:00');

-- ============================================================================
-- project_budgets
-- ============================================================================
DELETE FROM project_budgets WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO project_budgets
  (project_id, category, budget_allocated, budget_spent, forecast_cost, actual_spent, variance, notes, created_at, updated_at)
VALUES
  (:p1,'Equipment & Materials',2100000.00,1985000.00,2075000.00,1985000.00,25000.00,'Stainless price locked in Feb 2026','2026-01-15 09:00:00','2026-09-05 12:00:00'),
  (:p1,'Fabrication Labour',1150000.00,1187000.00,1187000.00,1187000.00,-37000.00,'Overtime on hood assembly in May','2026-01-15 09:01:00','2026-06-05 12:00:00'),
  (:p1,'Site Installation',980000.00,842000.00,955000.00,842000.00,25000.00,NULL,'2026-01-15 09:02:00','2026-09-05 12:00:00'),
  (:p1,'MEP Subcontract',380000.00,380000.00,380000.00,380000.00,0.00,'GulfMEP LLC — final account settled','2026-01-15 09:03:00','2026-06-15 12:00:00'),
  (:p1,'Contingency',240000.00,38000.00,120000.00,38000.00,120000.00,'Floor socket rework drawn from contingency','2026-01-15 09:04:00','2026-09-05 12:00:00'),
  (:p2,'Mounting & Structure',760000.00,791000.00,791000.00,791000.00,-31000.00,'Extra corrosion treatment on deck','2026-03-01 09:00:00','2026-06-05 12:00:00'),
  (:p2,'PV Panels & Electrical',1650000.00,1079000.00,1640000.00,1079000.00,10000.00,NULL,'2026-03-01 09:01:00','2026-09-05 12:00:00'),
  (:p2,'Commissioning & Grid',690000.00,0.00,690000.00,0.00,0.00,'Starts mid-September','2026-03-01 09:02:00','2026-09-01 12:00:00'),
  (:p3,'Design & Engineering',450000.00,0.00,450000.00,0.00,0.00,'Planning stage — no spend yet','2026-08-25 09:00:00','2026-08-25 09:00:00');

-- ============================================================================
-- project_resources (user_id stores employee code)
-- ============================================================================
DELETE FROM project_resources WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO project_resources
  (project_id, user_id, role, allocation_percentage, start_date, end_date, hourly_rate,
   total_hours_allocated, total_hours_spent, created_at, updated_at)
VALUES
  (:p1,'EMP0001','Project Manager',60,'2026-01-15','2026-09-30',180.00,1240.00,1105.00,'2026-01-12 09:00:00','2026-09-09 18:00:00'),
  (:p1,'EMP0002','Design Engineer',100,'2026-01-15','2026-03-15',140.00,340.00,362.00,'2026-01-12 09:01:00','2026-03-16 09:00:00'),
  (:p1,'EMP0009','Fabrication Lead',100,'2026-03-01','2026-05-31',120.00,520.00,545.00,'2026-01-12 09:02:00','2026-06-02 09:00:00'),
  (:p1,'EMP0004','Site Engineer',100,'2026-06-01','2026-09-30',130.00,700.00,565.00,'2026-01-12 09:03:00','2026-09-09 18:00:00'),
  (:p1,'EMP0007','QC Inspector',50,'2026-04-01','2026-09-30',110.00,420.00,305.00,'2026-01-12 09:04:00','2026-09-09 18:00:00'),
  (:p2,'EMP0004','Site Engineer',0,'2026-03-01','2026-05-31',130.00,480.00,492.00,'2026-02-22 09:00:00','2026-06-02 09:00:00'),
  (:p2,'EMP0020','Installation Supervisor',100,'2026-05-15','2026-11-30',115.00,980.00,610.00,'2026-02-22 09:01:00','2026-09-09 18:00:00'),
  (:p3,'EMP0002','Design Engineer',40,'2026-09-15','2026-12-15',140.00,290.00,0.00,'2026-08-25 09:00:00','2026-08-25 09:00:00');

-- ============================================================================
-- pm_resource_requests
-- ============================================================================
DELETE FROM pm_resource_requests WHERE company_id = :company;
INSERT INTO pm_resource_requests
  (company_id, project_id, resource_type, skills_required, quantity, start_date, end_date,
   allocation_percentage, priority, justification, status, requested_by, created_at, updated_at)
VALUES
  (:company,'PRJ-2026-0001','TIG Welder','SS304 food-grade TIG welding, kitchen equipment experience',2,'2026-04-01','2026-05-20',100,'high','Hood module assembly peak — two extra welders needed','approved','Deepak Joshi','2026-03-18 10:00:00+04','2026-03-22 15:00:00+04'),
  (:company,'PRJ-2026-0001','Commissioning Engineer','Gas appliance commissioning, Dubai Municipality certification',1,'2026-08-10','2026-09-30',100,'high','Hygiene certification requires certified commissioning engineer','approved','Rajesh Kumar','2026-07-20 09:00:00+04','2026-07-25 11:00:00+04'),
  (:company,'PRJ-2026-0005','Rooftop Rigger','Working-at-height certified, ballast handling',4,'2026-05-15','2026-09-30',100,'medium','Panel landing rate must double to hold September date','approved','Ganesh Patil','2026-05-02 08:00:00+04','2026-05-08 14:00:00+04'),
  (:company,'PRJ-2026-0005','HV Electrician','LV/MV switchgear, DEWA grid tie-in experience',2,'2026-09-15','2026-11-30',100,'high','Inverter and grid tie-in phase starting','pending','Arun Gupta','2026-09-01 09:30:00+04','2026-09-01 09:30:00+04'),
  (:company,'PRJ-2026-0006','PLC Programmer','Siemens S7-1500, conveyor control, SCADA',1,'2026-10-01','2027-01-31',80,'medium','Line 3 retrofit control system design and FAT','pending','Priya Sharma','2026-09-05 10:00:00+04','2026-09-05 10:00:00+04');

-- ============================================================================
-- pm_resource_skills (resource_id is unique -> employee codes)
-- ============================================================================
DELETE FROM pm_resource_skills WHERE company_id = :company;
INSERT INTO pm_resource_skills
  (company_id, resource_id, resource_name, skills, created_at, updated_at)
VALUES
  (:company,'EMP0002','Priya Sharma','[{"skill":"AutoCAD","level":"Expert"},{"skill":"Kitchen Layout Design","level":"Expert"},{"skill":"Revit MEP","level":"Intermediate"}]','2026-01-05 09:00:00+04','2026-01-05 09:00:00+04'),
  (:company,'EMP0004','Vikram Singh','[{"skill":"Site Supervision","level":"Expert"},{"skill":"MEP Coordination","level":"Advanced"},{"skill":"Working at Height","level":"Certified"}]','2026-01-05 09:01:00+04','2026-01-05 09:01:00+04'),
  (:company,'EMP0007','Amit Verma','[{"skill":"QC Inspection","level":"Expert"},{"skill":"Weld Inspection (CSWIP)","level":"Certified"},{"skill":"Hygiene Standards HACCP","level":"Advanced"}]','2026-01-05 09:02:00+04','2026-01-05 09:02:00+04'),
  (:company,'EMP0009','Deepak Joshi','[{"skill":"Sheet Metal Fabrication","level":"Expert"},{"skill":"Laser Cutting Programming","level":"Advanced"},{"skill":"TIG Welding SS304","level":"Expert"}]','2026-01-05 09:03:00+04','2026-01-05 09:03:00+04'),
  (:company,'EMP0019','Ramesh Yadav','[{"skill":"TIG Welding SS304","level":"Advanced"},{"skill":"Ballast Installation","level":"Intermediate"}]','2026-01-05 09:04:00+04','2026-01-05 09:04:00+04'),
  (:company,'EMP0020','Ganesh Patil','[{"skill":"Solar PV Installation","level":"Expert"},{"skill":"DC Stringing","level":"Advanced"},{"skill":"Installation Supervision","level":"Advanced"}]','2026-01-05 09:05:00+04','2026-01-05 09:05:00+04');

-- ============================================================================
-- pm_resource_utilization
-- ============================================================================
DELETE FROM pm_resource_utilization WHERE company_id = :company;
INSERT INTO pm_resource_utilization
  (company_id, resource_id, resource_name, role, department, employee_type, total_capacity,
   allocated_hours, actual_hours, utilization, efficiency, billable_hours, non_billable_hours,
   overtime_hours, leave_hours, idle_hours, active_projects, cost_per_hour, total_revenue,
   total_cost, availability, status, current_projects, created_at, updated_at)
VALUES
  (:company,'EMP0001','Rajesh Kumar','Project Manager','Projects','Full-time',176.00,150.00,158.00,89.77,105.33,132.00,26.00,6.00,0.00,12.00,3,180.00,47400.00,28440.00,'Partially Available','Active','["PRJ-2026-0001","PRJ-2026-0005","PRJ-2026-0006"]','2026-08-31 18:00:00+04','2026-09-01 09:00:00+04'),
  (:company,'EMP0002','Priya Sharma','Design Engineer','Engineering','Full-time',176.00,120.00,112.00,63.64,93.33,96.00,16.00,0.00,16.00,32.00,2,140.00,26880.00,15680.00,'Available','Active','["PRJ-2026-0006"]','2026-08-31 18:00:00+04','2026-09-01 09:00:00+04'),
  (:company,'EMP0004','Vikram Singh','Site Engineer','Projects','Full-time',176.00,176.00,184.00,104.55,95.65,168.00,16.00,8.00,0.00,0.00,2,130.00,47840.00,23920.00,'Overloaded','Active','["PRJ-2026-0001","PRJ-2026-0005"]','2026-08-31 18:00:00+04','2026-09-01 09:00:00+04'),
  (:company,'EMP0007','Amit Verma','QC Inspector','Quality','Full-time',176.00,96.00,90.00,51.14,93.75,78.00,12.00,0.00,8.00,72.00,1,110.00,15840.00,9900.00,'Available','Active','["PRJ-2026-0001"]','2026-08-31 18:00:00+04','2026-09-01 09:00:00+04'),
  (:company,'EMP0009','Deepak Joshi','Fabrication Lead','Production','Full-time',176.00,140.00,148.00,79.55,105.71,140.00,8.00,12.00,0.00,20.00,1,120.00,32160.00,17760.00,'Partially Available','Active','["PRJ-2026-0001"]','2026-08-31 18:00:00+04','2026-09-01 09:00:00+04'),
  (:company,'EMP0020','Ganesh Patil','Installation Supervisor','Projects','Full-time',176.00,168.00,172.00,95.45,102.38,164.00,8.00,4.00,0.00,0.00,1,115.00,37260.00,19780.00,'Fully Allocated','Active','["PRJ-2026-0005"]','2026-08-31 18:00:00+04','2026-09-01 09:00:00+04');

-- ============================================================================
-- resource_capacity (user_id stores employee code; one working week snapshot)
-- ============================================================================
DELETE FROM resource_capacity WHERE user_id IN ('EMP0001','EMP0004','EMP0007','EMP0009','EMP0020');
INSERT INTO resource_capacity
  (user_id, date, available_hours, allocated_hours, utilization_percentage, created_at, updated_at)
VALUES
  ('EMP0001','2026-09-07',8.00,6.00,75.00,'2026-09-06 18:00:00','2026-09-07 18:00:00'),
  ('EMP0001','2026-09-08',8.00,7.00,87.50,'2026-09-07 18:00:00','2026-09-08 18:00:00'),
  ('EMP0004','2026-09-07',8.00,8.00,100.00,'2026-09-06 18:00:00','2026-09-07 18:00:00'),
  ('EMP0004','2026-09-08',8.00,9.00,112.50,'2026-09-07 18:00:00','2026-09-08 18:00:00'),
  ('EMP0007','2026-09-07',8.00,4.00,50.00,'2026-09-06 18:00:00','2026-09-07 18:00:00'),
  ('EMP0007','2026-09-08',8.00,6.00,75.00,'2026-09-07 18:00:00','2026-09-08 18:00:00'),
  ('EMP0009','2026-09-07',8.00,7.00,87.50,'2026-09-06 18:00:00','2026-09-07 18:00:00'),
  ('EMP0009','2026-09-08',8.00,6.50,81.25,'2026-09-07 18:00:00','2026-09-08 18:00:00'),
  ('EMP0020','2026-09-07',8.00,8.00,100.00,'2026-09-06 18:00:00','2026-09-07 18:00:00'),
  ('EMP0020','2026-09-08',8.00,8.00,100.00,'2026-09-07 18:00:00','2026-09-08 18:00:00');

-- ============================================================================
-- pm_purchase_requisitions (bom_header_id left NULL)
-- ============================================================================
DELETE FROM pm_purchase_requisitions WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO pm_purchase_requisitions
  (project_id, bom_header_id, status, requested_by, total_estimated_amount, notes, created_at, updated_at)
VALUES
  (:p1,NULL,'po_generated','Suresh Patel',412000.00,'[DEMO] SS304 sheet 2mm + 1.5mm for cook line fabrication','2026-02-10 10:00:00','2026-02-18 15:00:00'),
  (:p1,NULL,'po_generated','Suresh Patel',186500.00,'[DEMO] Exhaust fan, make-up air unit, VCD dampers','2026-03-05 09:30:00','2026-03-12 14:00:00'),
  (:p1,NULL,'approved','Vikram Singh',48200.00,'[DEMO] Site consumables — sealants, gas fittings, anchor bolts','2026-06-08 11:00:00','2026-06-10 16:30:00'),
  (:p2,NULL,'po_generated','Ganesh Patil',1236000.00,'[DEMO] 2,900 bifacial PV panels + DC cabling and trays','2026-03-20 09:00:00','2026-04-02 12:00:00'),
  (:p2,NULL,'pending_approval','Arun Gupta',402000.00,'[DEMO] 8x 125kW string inverters + AC combiner panels','2026-09-02 10:15:00','2026-09-02 10:15:00');

-- ============================================================================
-- production_logs (fabrication story for the kitchen cook line)
-- ============================================================================
DELETE FROM production_logs WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO production_logs
  (project_id, machine_id, operator_id, "operationType", start_time, end_time,
   yield_count, reject_count, idle_reason, created_at)
VALUES
  (:p1,'LASER-01','EMP0009','laser','2026-03-03 07:30:00','2026-03-03 15:45:00',48,2,NULL,'2026-03-03 16:00:00'),
  (:p1,'LASER-01','EMP0009','laser','2026-03-10 07:30:00','2026-03-10 12:10:00',26,1,'Nozzle change + material wait 45min','2026-03-10 12:30:00'),
  (:p1,'BEND-02','EMP0013','bending','2026-03-17 08:00:00','2026-03-17 16:30:00',44,3,NULL,'2026-03-17 16:45:00'),
  (:p1,'ETCH-01','EMP0010','etching','2026-03-24 09:00:00','2026-03-24 13:20:00',30,0,NULL,'2026-03-24 13:30:00'),
  (:p1,'WELD-03','EMP0019','welding','2026-04-08 07:30:00','2026-04-08 17:00:00',18,1,NULL,'2026-04-08 17:15:00'),
  (:p1,'WELD-03','EMP0019','welding','2026-04-22 07:30:00','2026-04-22 16:00:00',16,2,'Argon supply changeover 30min','2026-04-22 16:15:00'),
  (:p1,'PCOAT-01','EMP0010','powder_coating','2026-05-12 08:00:00','2026-05-12 16:45:00',35,1,NULL,'2026-05-12 17:00:00'),
  (:p1,'ASSY-01','EMP0013','assembly','2026-05-20 07:30:00','2026-05-20 17:30:00',12,0,NULL,'2026-05-20 17:45:00');

-- ============================================================================
-- qc_records (defect_category aligned to defect_codes; items by itemCode)
-- ============================================================================
DELETE FROM qc_records WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO qc_records
  (project_id, item_id, inspected_by, result, defect_category, rework_operation, notes, created_at, updated_at)
VALUES
  (:p1,(SELECT id FROM items WHERE "itemCode"='RM-STL-001'),'Amit Verma','pass',NULL,NULL,'Incoming inspection per TMPL-INCOMING — SS304 2mm sheet lot A, thickness within DIM-THK tolerance','2026-02-20 10:00:00','2026-02-20 10:00:00'),
  (:p1,(SELECT id FROM items WHERE "itemCode"='RM-STL-001'),'Amit Verma','fail','Rust/Corrosion',NULL,'Lot B rejected at incoming — surface oxidation beyond acceptance; returned to supplier','2026-03-02 09:30:00','2026-03-02 14:00:00'),
  (:p1,(SELECT id FROM items WHERE "itemCode"='WIP-SFT-001'),'Amit Verma','pass',NULL,NULL,'In-process check per TMPL-INPROCESS — hood support frame welds visually accepted','2026-04-15 11:00:00','2026-04-15 11:00:00'),
  (:p1,(SELECT id FROM items WHERE "itemCode"='WIP-GBX-001'),'Kiran Reddy','rework','Dimensional Out of Spec','Re-bend flange to 90.0 +/-0.5 deg','Counter flange bend at 92.1 deg (DIM-LEN/DIM-WID ok); sent back to BEND-02','2026-04-28 15:20:00','2026-05-04 10:00:00'),
  (:p1,(SELECT id FROM items WHERE "itemCode"='WIP-GBX-001'),'Kiran Reddy','pass',NULL,NULL,'Post-rework verification — flange angle 90.2 deg, accepted','2026-05-05 09:00:00','2026-05-05 09:00:00'),
  (:p1,(SELECT id FROM items WHERE "itemCode"='FG-PMP-001'),'Amit Verma','pass',NULL,NULL,'Final inspection per TMPL-FINAL — booster pump set for wash line, run test 30min OK','2026-05-29 14:00:00','2026-05-29 14:00:00'),
  (:p1,(SELECT id FROM items WHERE "itemCode"='FG-MTR-001'),'Amit Verma','fail','Surface Defect',NULL,'Exhaust fan motor housing scratched in handling (VIS-SCRATCH); replacement requested','2026-06-12 10:30:00','2026-06-12 16:00:00'),
  (:p2,(SELECT id FROM items WHERE "itemCode"='RM-ALM-001'),'Kiran Reddy','pass',NULL,NULL,'Ballast frame aluminium rods — incoming sample per TMPL-INCOMING, hardness MAT-HARD in spec','2026-03-25 09:00:00','2026-03-25 09:00:00');

-- ============================================================================
-- pm_quality_inspections
-- ============================================================================
DELETE FROM pm_quality_inspections WHERE company_id = :company;
INSERT INTO pm_quality_inspections
  (company_id, inspection_number, project_id, project_name, inspection_date, inspection_type,
   phase, work_package, inspector_name, inspector_id, checklist, total_check_points, passed,
   failed, not_applicable, pending, overall_status, defects, critical_defects, photos,
   signed_off, sign_off_by, sign_off_date, next_inspection_date, remarks, created_at, updated_at)
VALUES
  (:company,'DEMO-QCI-001','PRJ-2026-0001','Industrial Kitchen 2026','2026-04-16','In-Process','Fabrication','IK26.3.2 Hood & Ducting',
   'Amit Verma','EMP0007','[{"point":"Weld seams continuous","result":"pass"},{"point":"Flange squareness","result":"pass"},{"point":"Grease trap fitment","result":"pass"}]',
   12,11,1,0,0,'Passed',1,0,6,true,'Rajesh Kumar','2026-04-17','2026-05-15','One minor grinding mark, buffed on the spot','2026-04-16 10:00:00+04','2026-04-17 15:00:00+04'),
  (:company,'DEMO-QCI-002','PRJ-2026-0001','Industrial Kitchen 2026','2026-05-29','Final','Fabrication','IK26.3.1 Cook Line Modules',
   'Amit Verma','EMP0007','[{"point":"Surface finish 4B","result":"pass"},{"point":"Dimensional check vs GA","result":"pass"},{"point":"Door alignment","result":"fail"}]',
   18,16,2,0,0,'Conditional Pass',2,0,10,true,'Rajesh Kumar','2026-05-31','2026-06-20','Two under-counter doors realigned before dispatch','2026-05-29 09:00:00+04','2026-05-31 14:00:00+04'),
  (:company,'DEMO-QCI-003','PRJ-2026-0001','Industrial Kitchen 2026','2026-06-28','Installation','Site Installation','IK26.4 Hood & Duct Install',
   'Amit Verma','EMP0007','[{"point":"Duct pressure test 500Pa","result":"pass"},{"point":"Hood level +/-2mm","result":"pass"},{"point":"Fire suppression nozzle spacing","result":"pass"}]',
   9,9,0,0,0,'Passed',0,0,8,true,'Vikram Singh','2026-06-29','2026-08-20','Pressure held 15min, no measurable leakage','2026-06-28 11:00:00+04','2026-06-29 12:00:00+04'),
  (:company,'DEMO-QCI-004','PRJ-2026-0001','Industrial Kitchen 2026','2026-08-25','Commissioning','Testing & Commissioning','IK26.5 Performance Trials',
   'Amit Verma','EMP0007','[{"point":"Burner output all stations","result":"pass"},{"point":"Extract airflow balance","result":"pending"},{"point":"Combi oven calibration","result":"pass"}]',
   15,10,1,0,4,'In Progress',1,0,4,false,NULL,NULL,'2026-09-15','Airflow rebalance scheduled with MEP contractor','2026-08-25 09:30:00+04','2026-09-08 17:00:00+04'),
  (:company,'DEMO-QCI-005','PRJ-2026-0005','Solar Panel Array Installation','2026-05-30','In-Process','Roof Preparation','SOL26.1 Ballast Frames',
   'Kiran Reddy','EMP0008','[{"point":"Ballast weight per frame","result":"pass"},{"point":"Frame torque check","result":"pass"},{"point":"Corrosion treatment coverage","result":"pass"}]',
   10,10,0,0,0,'Passed',0,0,12,true,'Vikram Singh','2026-05-31','2026-08-30','Rows 1-16 released for panel landing','2026-05-30 08:00:00+04','2026-05-31 10:00:00+04'),
  (:company,'DEMO-QCI-006','PRJ-2026-0005','Solar Panel Array Installation','2026-08-28','In-Process','Panel Mounting','SOL26.2 String Continuity Rows 1-8',
   'Kiran Reddy','EMP0008','[{"point":"String polarity","result":"pass"},{"point":"Voc within 3% of nominal","result":"pass"},{"point":"Cable tray earthing","result":"fail"}]',
   14,12,2,0,0,'Conditional Pass',2,1,9,false,NULL,NULL,'2026-09-20','Earth bonding jumpers missing on tray joints rows 5-6; rectification in progress','2026-08-28 08:30:00+04','2026-09-05 16:00:00+04');

-- ============================================================================
-- site_readiness
-- ============================================================================
DELETE FROM site_readiness WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO site_readiness
  (project_id, item, status, verified_by, photos, notes, created_at, updated_at)
VALUES
  (:p1,'3-phase 400A power supply at MDB','ready','Vikram Singh','["https://demo.b3macbis.com/photos/ik26/mdb-400a.jpg"]','Upgraded MDB energised and load-tested 2026-05-20','2026-05-20 14:00:00','2026-05-20 14:00:00'),
  (:p1,'Water supply & drainage trench','ready','Vikram Singh','["https://demo.b3macbis.com/photos/ik26/drainage-trench-01.jpg"]','6m trench cut, graded and pressure-tested','2026-05-22 10:00:00','2026-05-22 10:00:00'),
  (:p1,'Gas line with solenoid shut-off','ready','Vikram Singh',NULL,'Civil Defence pre-approval obtained','2026-06-18 11:30:00','2026-06-18 11:30:00'),
  (:p1,'Floor finishing & sockets on gridline','ready','Vikram Singh',NULL,'Two off-grid sockets chased and reset after re-survey','2026-06-20 15:00:00','2026-06-20 15:00:00'),
  (:p1,'Fire suppression system charge','waiting','Amit Verma',NULL,'Awaiting suppression contractor charge visit w/c 2026-09-14','2026-09-05 09:00:00','2026-09-05 09:00:00'),
  (:p2,'Roof deck corrosion treatment','ready','Ganesh Patil','["https://demo.b3macbis.com/photos/solar/roof-corrosion-01.jpg"]','Treated and coated before ballast placement','2026-04-10 12:00:00','2026-04-10 12:00:00'),
  (:p2,'Crane access permit (north yard)','ready','Ganesh Patil',NULL,'JAFZA lifting permit valid to 2026-10-31','2026-05-12 08:30:00','2026-05-12 08:30:00'),
  (:p3,'Line 3 shutdown window agreement','not_ready',NULL,NULL,'AutoParts production planning yet to confirm December shutdown window','2026-09-01 10:00:00','2026-09-08 12:00:00');

-- ============================================================================
-- tool_deployments (tool_id is free-text tool code)
-- ============================================================================
DELETE FROM tool_deployments WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO tool_deployments
  (tool_id, project_id, status, issued_at, returned_at, condition_at_issue, condition_at_return,
   depreciation_value, issued_by, returned_by, created_at, updated_at)
VALUES
  ('TOOL-DRL-001',:p1,'RETURNED','2026-06-01 08:00:00','2026-08-20 17:00:00','Good','Good — 2 bits worn',120.00,'Mohan Das','Vikram Singh','2026-06-01 08:00:00','2026-08-20 17:10:00'),
  ('TOOL-TIG-014',:p1,'RETURNED','2026-03-01 08:00:00','2026-06-05 16:00:00','Good','Good',450.00,'Mohan Das','Deepak Joshi','2026-03-01 08:00:00','2026-06-05 16:15:00'),
  ('TOOL-LVL-007',:p1,'ISSUED','2026-06-01 08:00:00',NULL,'Good — calibrated 2026-05-15',NULL,80.00,'Mohan Das',NULL,'2026-06-01 08:05:00','2026-06-01 08:05:00'),
  ('TOOL-GAS-003',:p1,'DAMAGED','2026-07-01 08:00:00','2026-08-12 14:00:00','Good','Regulator gauge cracked on site',350.00,'Mohan Das','Vikram Singh','2026-07-01 08:00:00','2026-08-12 14:30:00'),
  ('TOOL-TRQ-009',:p2,'ISSUED','2026-05-15 07:30:00',NULL,'Good — calibrated 2026-05-01',NULL,95.00,'Mohan Das',NULL,'2026-05-15 07:30:00','2026-05-15 07:30:00'),
  ('TOOL-MMT-021',:p2,'ISSUED','2026-06-10 07:30:00',NULL,'Good',NULL,60.00,'Mohan Das',NULL,'2026-06-10 07:30:00','2026-06-10 07:30:00');

-- ============================================================================
-- trial_reports (commissioning trials for the kitchen)
-- ============================================================================
DELETE FROM trial_reports WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO trial_reports
  (project_id, inspected_by, result, photos, checklist, notes, created_at, updated_at)
VALUES
  (:p1,'Amit Verma','pass','["https://demo.b3macbis.com/photos/ik26/trial-hood-airflow.jpg"]','[{"item":"Hood capture test (smoke)","result":"pass"},{"item":"Make-up air balance","result":"pass"}]','Hood capture trial — smoke fully captured at all 12 stations','2026-08-12 10:00:00','2026-08-12 15:00:00'),
  (:p1,'Amit Verma','fail',NULL,'[{"item":"Combi oven steam cycle","result":"pass"},{"item":"Fryer recovery time <90s","result":"fail"}]','Fryer bank 2 recovery at 128s — burner jets cleaned, retrial booked','2026-08-19 09:30:00','2026-08-19 16:00:00'),
  (:p1,'Amit Verma','pass',NULL,'[{"item":"Fryer recovery time <90s","result":"pass"},{"item":"Thermostat calibration +/-2C","result":"pass"}]','Retrial after burner service — recovery 76s, accepted','2026-08-26 09:00:00','2026-08-26 12:30:00'),
  (:p1,'Kiran Reddy','pending',NULL,'[{"item":"Full-load cook line trial (service simulation)","result":"pending"},{"item":"Extract airflow rebalance verification","result":"pending"}]','Full-service simulation scheduled 2026-09-16 with hotel culinary team','2026-09-08 11:00:00','2026-09-08 11:00:00');

-- ============================================================================
-- pm_report_templates
-- ============================================================================
DELETE FROM pm_report_templates WHERE company_id = :company;
INSERT INTO pm_report_templates
  (company_id, template_name, report_type, description, data_points, filters, charts, is_active, created_at, updated_at)
VALUES
  (:company,'Weekly Project Status','status','Standard weekly progress report per project','["progress","milestones","risks","spend_vs_budget"]','["project","date_range"]','["s_curve","milestone_timeline"]',true,'2026-01-08 09:00:00+04','2026-01-08 09:00:00+04'),
  (:company,'Site QC Summary','quality','Inspection pass/fail summary with open defects','["inspections","defects","sign_offs"]','["project","phase","inspector"]','["pass_fail_pie","defects_by_severity"]',true,'2026-01-08 09:05:00+04','2026-01-08 09:05:00+04'),
  (:company,'Resource Utilization Monthly','resource','Utilization, overtime and idle hours by department','["utilization","overtime","idle_hours","billable_ratio"]','["department","month"]','["utilization_bar","trend_line"]',true,'2026-01-08 09:10:00+04','2026-01-08 09:10:00+04'),
  (:company,'Budget Variance','financial','Allocated vs actual by cost category with variance flags','["budget_allocated","actual_spent","variance","forecast"]','["project","category"]','["variance_waterfall"]',true,'2026-01-08 09:15:00+04','2026-01-08 09:15:00+04'),
  (:company,'Site Issue Log','issues','Open site issues with cost and schedule impact','["issues","severity","cost_impact","schedule_impact"]','["project","status","severity"]','["issues_by_type"]',false,'2026-01-08 09:20:00+04','2026-03-15 10:00:00+04');

-- ============================================================================
-- pm_reports
-- ============================================================================
DELETE FROM pm_reports WHERE company_id = :company;
INSERT INTO pm_reports
  (company_id, report_name, report_type, category, description, frequency, format,
   last_generated, generated_by, project_scope, project_count, file_size, status, created_at, updated_at)
VALUES
  (:company,'Weekly Status — Industrial Kitchen 2026 (W36)','status','Progress','Week 36 status: installation 92%, commissioning underway','Weekly','PDF','2026-09-07','Rajesh Kumar','PRJ-2026-0001',1,'1.4 MB','Available','2026-09-07 17:00:00+04','2026-09-07 17:00:00+04'),
  (:company,'Weekly Status — Solar Array (W36)','status','Progress','Week 36 status: 70% panels mounted, earthing rectification open','Weekly','PDF','2026-09-07','Rajesh Kumar','PRJ-2026-0005',1,'1.1 MB','Available','2026-09-07 17:10:00+04','2026-09-07 17:10:00+04'),
  (:company,'QC Summary — Kitchen Fabrication Phase','quality','Quality','All fabrication inspections closed; 2 conditional passes resolved','On Demand','PDF','2026-06-05','Amit Verma','PRJ-2026-0001',1,'2.3 MB','Available','2026-06-05 15:00:00+04','2026-06-05 15:00:00+04'),
  (:company,'Resource Utilization — August 2026','resource','Resources','Aug 2026 utilization across active projects; Vikram Singh overloaded','Monthly','XLSX','2026-09-01','Priya Sharma','All Projects',3,'640 KB','Available','2026-09-01 10:00:00+04','2026-09-01 10:00:00+04'),
  (:company,'Budget Variance — Q2 2026','financial','Finance','Q2 variance: fabrication labour -37k offset by materials +25k','Quarterly','PDF','2026-07-05','Rajesh Kumar','All Projects',3,'980 KB','Available','2026-07-05 11:00:00+04','2026-07-05 11:00:00+04'),
  (:company,'Weekly Status — All Projects (W37)','status','Progress','Week 37 consolidated report','Weekly','PDF',NULL,NULL,'All Projects',3,NULL,'Scheduled','2026-09-09 09:00:00+04','2026-09-09 09:00:00+04');

-- ============================================================================
-- pm_site_issues
-- ============================================================================
DELETE FROM pm_site_issues WHERE company_id = :company;
INSERT INTO pm_site_issues
  (company_id, issue_number, project_id, project_name, issue_title, issue_type, severity, priority,
   reported_date, reported_by, reported_by_role, location, description, impact_on_work, root_cause,
   proposed_solution, assigned_to, target_date, actual_resolution_date, status, resolution_details,
   cost_impact, schedule_impact, preventive_measures, attachments, related_issues, created_at, updated_at)
VALUES
  (:company,'DEMO-ISS-001','PRJ-2026-0001','Industrial Kitchen 2026','Exhaust duct route clashes with chilled water line','Design Clash','High','P2',
   '2025-11-11','Suresh Patel','Surveyor','Level B1 ceiling void','Planned 24m duct run intersects existing chilled water main at gridline C4','Duct fabrication on hold for revised route','Chilled water main not shown on client as-builts',
   'Reroute duct 600mm south with two additional bends','Priya Sharma','2026-01-20','2026-01-18','Resolved','Route revised in shop drawings rev B; client approved',
   28000.00,5,'Request full MEP as-built verification during survey stage','2',NULL,'2025-11-11 15:00:00+04','2026-01-18 12:00:00+04'),
  (:company,'DEMO-ISS-002','PRJ-2026-0001','Industrial Kitchen 2026','Floor sockets 40mm off gridline','Installation','Medium','P3',
   '2026-06-02','Vikram Singh','Site Engineer','Main kitchen island zone','Two floor power sockets cast 40mm off gridline vs coordination drawing','Island cook line cannot sit flush over sockets','Setting-out error by MEP subcontractor',
   'Chase and reset both sockets before island line install','Vikram Singh','2026-06-15','2026-06-12','Resolved','Sockets chased, reset and re-terminated; floor made good',
   9500.00,3,'Joint setting-out survey before first-fix sign-off','3',NULL,'2026-06-02 13:00:00+04','2026-06-12 17:00:00+04'),
  (:company,'DEMO-ISS-003','PRJ-2026-0001','Industrial Kitchen 2026','Exhaust fan motor housing damaged in handling','Material Damage','Medium','P3',
   '2026-06-12','Amit Verma','QC Inspector','Loading dock','Deep scratches on fan motor housing found at delivery inspection','Hood commissioning at risk if replacement delayed','Inadequate crate padding by freight forwarder',
   'Claim against forwarder; expedite replacement motor','Suresh Patel','2026-07-10','2026-07-08','Resolved','Replacement motor delivered and installed; claim recovered 80%',
   12400.00,0,'Switch to foam-in-place packing for motorised units','4','["DEMO-ISS-002"]','2026-06-12 11:00:00+04','2026-07-08 16:00:00+04'),
  (:company,'DEMO-ISS-004','PRJ-2026-0001','Industrial Kitchen 2026','Extract airflow imbalance across stations','Commissioning','High','P2',
   '2026-08-25','Amit Verma','QC Inspector','Main kitchen','Airflow at stations 9-12 reads 18% below design; capture marginal','Hygiene certification blocked until balanced','Balancing dampers left fully open on branch 3',
   'MEP contractor to rebalance VCDs and re-measure','Vikram Singh','2026-09-15',NULL,'In Progress',NULL,
   0.00,7,'Include airflow balancing in duct installer scope explicitly','1',NULL,'2026-08-25 14:00:00+04','2026-09-08 17:00:00+04'),
  (:company,'DEMO-ISS-005','PRJ-2026-0005','Solar Panel Array Installation','Missing earth bonding jumpers on cable tray joints','Electrical','Critical','P1',
   '2026-08-28','Kiran Reddy','QC Inspector','Roof rows 5-6','Tray joints rows 5-6 lack earth bonding jumpers per SLD note 7','Strings 41-58 cannot be energised','Bonding jumpers omitted from tray installation kit',
   'Install bonding jumpers and re-test earth continuity','Ganesh Patil','2026-09-20',NULL,'In Progress',NULL,
   6800.00,4,'Add earthing check to tray installation ITP hold point','2',NULL,'2026-08-28 10:00:00+04','2026-09-05 16:00:00+04'),
  (:company,'DEMO-ISS-006','PRJ-2026-0005','Solar Panel Array Installation','High winds halting panel landing','Weather','Medium','P3',
   '2026-07-14','Ganesh Patil','Installation Supervisor','Roof','Shamal winds above 38km/h; crane lifts suspended for 3 days','Panel landing rate behind plan for July','Seasonal weather',
   'Extend working hours on calm days; add second landing crew','Ganesh Patil','2026-07-31','2026-07-25','Resolved','Recovered schedule by 2026-08-12 with double crews',
   14200.00,3,'Build wind allowance into rooftop lift programmes','0',NULL,'2026-07-14 09:00:00+04','2026-07-25 18:00:00+04'),
  (:company,'DEMO-ISS-007','PRJ-2026-0006','Automation Line Upgrade','As-built drawings for line 3 outdated','Documentation','Medium','P3',
   '2026-08-18','Suresh Patel','Surveyor','Plant 2 — Line 3','2019 as-builts do not reflect 2023 conveyor modifications','Detail design cannot start from drawings alone','Client modification history not documented',
   'Commission laser scan of line 3 before design freeze','Priya Sharma','2026-10-05',NULL,'Open',NULL,
   18000.00,10,'Mandate laser scan for all retrofit projects at survey stage','1',NULL,'2026-08-18 16:00:00+04','2026-09-08 12:00:00+04');
