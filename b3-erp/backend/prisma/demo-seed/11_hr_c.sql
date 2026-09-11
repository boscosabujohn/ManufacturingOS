-- Demo seed — HR part C (safety, salary, shifts, skills, teams, timesheets,
-- training, travel, vehicles, stationery, succession) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first, then re-inserts.
--
-- Delete predicates (idempotency):
--   * Tables with "companyId"                  -> DELETE WHERE "companyId" = :company
--   * hr_salary_structures (no companyId)      -> DELETE WHERE code LIKE 'DEMO-%'
--   * hr_salary_slips (no companyId)           -> DELETE WHERE "slipNumber" LIKE 'DEMO-%'
--   * hr_user_skills (no companyId)            -> DELETE WHERE "createdBy" = 'demo-seed'
--
-- Fixed literal UUIDs (only where child rows reference the parent):
--   * training programs   11110000-0000-4000-8000-00000000000{1..6}
--   * training schedules  22220000-0000-4000-8000-00000000000{1..6}
--   * training assessments 33330000-0000-4000-8000-00000000000{1..3}
--   * training enrollments 44440000-0000-4000-8000-0000000000{01..12}
--   * payroll-run ids on salary slips (hr_payrolls has NO FK constraint and is
--     seeded elsewhere/empty): ba3e2026-000{6,7,8}-4000-8000-000000000001
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- Clean-up (soft refs only — no DB-level FKs on these tables)
-- ---------------------------------------------------------------------------
DELETE FROM hr_training_assessment_attempts WHERE "companyId" = :company;
DELETE FROM hr_training_waitlist        WHERE "companyId" = :company;
DELETE FROM hr_training_feedback        WHERE "companyId" = :company;
DELETE FROM hr_training_attendance      WHERE "companyId" = :company;
DELETE FROM hr_training_assessments     WHERE "companyId" = :company;
DELETE FROM hr_training_enrollments     WHERE "companyId" = :company;
DELETE FROM hr_training_schedules       WHERE "companyId" = :company;
DELETE FROM hr_training_budgets         WHERE "companyId" = :company;
DELETE FROM hr_training_programs        WHERE "companyId" = :company;
DELETE FROM hr_safety_incidents         WHERE "companyId" = :company;
DELETE FROM hr_safety_inspections       WHERE "companyId" = :company;
DELETE FROM hr_safety_ppe               WHERE "companyId" = :company;
DELETE FROM hr_safety_reports           WHERE "companyId" = :company;
DELETE FROM hr_safety_trainings         WHERE "companyId" = :company;
DELETE FROM hr_safety_wellness          WHERE "companyId" = :company;
DELETE FROM hr_salary_components        WHERE "companyId" = :company;
DELETE FROM hr_salary_templates         WHERE "companyId" = :company;
DELETE FROM hr_salary_slips             WHERE "slipNumber" LIKE 'DEMO-%';
DELETE FROM hr_salary_structures        WHERE code LIKE 'DEMO-%';
DELETE FROM hr_shift_assignments        WHERE "companyId" = :company;
DELETE FROM hr_shift_roster_entries     WHERE "companyId" = :company;
DELETE FROM hr_shift_swaps              WHERE "companyId" = :company;
DELETE FROM hr_skill_assessments        WHERE "companyId" = :company;
DELETE FROM hr_stationery               WHERE "companyId" = :company;
DELETE FROM hr_succession_plans         WHERE "companyId" = :company;
DELETE FROM hr_teams                    WHERE "companyId" = :company;
DELETE FROM hr_timesheets               WHERE "companyId" = :company;
DELETE FROM hr_travel_advances          WHERE "companyId" = :company;
DELETE FROM hr_travel_requests          WHERE "companyId" = :company;
DELETE FROM hr_user_skills              WHERE "createdBy" = 'demo-seed';
DELETE FROM hr_vehicle_fuel             WHERE "companyId" = :company;
DELETE FROM hr_vehicle_assignments      WHERE "companyId" = :company;
DELETE FROM hr_vehicles                 WHERE "companyId" = :company;

-- ---------------------------------------------------------------------------
-- hr_safety_incidents — factory floor: SS fabrication, welding, assembly
-- ---------------------------------------------------------------------------
INSERT INTO hr_safety_incidents
  ("companyId","incidentNumber","reportedDate","incidentDate","incidentTime",location,department,
   severity,type,description,"reportedBy","employeeInvolved","witnessCount",status,investigator,
   "rootCause","daysLost","medicalAttention","createdAt","updatedAt")
VALUES
  (:company,'DEMO-INC-2025-001','2025-10-14','2025-10-14','10:35','Welding Bay 2','Production','moderate','injury','Welding flash burn on forearm while TIG welding SS sink bowl — sleeve rolled up under apron.','Amit Verma','Deepak Joshi',2,'closed','Sunita Rao','FR sleeves not worn; toolbox talk on full PPE reinforced.',2,true,TIMESTAMP '2025-10-14 11:00:00',TIMESTAMP '2025-10-28 17:00:00'),
  (:company,'DEMO-INC-2025-002','2025-11-03','2025-11-02','16:20','Sheet Metal Shearing Area','Production','minor','injury','Laceration on left thumb while de-burring 1.2 mm SS 304 blank at the shear exit table.','Kiran Reddy','Ravi Menon',1,'closed','Amit Verma','De-burring done bare-handed; cut-resistant gloves made mandatory at shear exit.',0,true,TIMESTAMP '2025-11-03 09:00:00',TIMESTAMP '2025-11-12 15:30:00'),
  (:company,'DEMO-INC-2025-003','2025-12-09','2025-12-09','14:05','Stores Aisle 3','Stores & Inventory','serious','near_miss','Forklift reversed close to a pedestrian carrying SS pipe stock; no contact — alarm audible but aisle mirror missing.','Mohan Das',NULL,3,'closed','Sunita Rao','Convex mirror not reinstated after racking change; mirror refitted, pedestrian walkway repainted.',0,false,TIMESTAMP '2025-12-09 15:00:00',TIMESTAMP '2025-12-20 12:00:00'),
  (:company,'DEMO-INC-2026-004','2026-01-22','2026-01-22','11:50','Polishing & Buffing Cell','Production','moderate','injury','Buffing wheel snagged cleaning rag; abrasion to right hand knuckles of operator.','Amit Verma','Kiran Reddy',1,'closed','Sunita Rao','Rag used near rotating wheel; lock-off cleaning procedure and guard checklist added.',1,true,TIMESTAMP '2026-01-22 12:30:00',TIMESTAMP '2026-02-05 16:00:00'),
  (:company,'DEMO-INC-2026-005','2026-03-11','2026-03-11','09:15','Pickling & Passivation Booth','Quality Control','moderate','chemical','Pickling paste splash on apron during passivation of welded counter tops; no skin contact, booth shower used as precaution.','Sunita Rao','Ajay Pillai',1,'closed','Anita Desai','Squeeze bottle nozzle cracked; nozzle inspection added to weekly checklist.',0,false,TIMESTAMP '2026-03-11 10:00:00',TIMESTAMP '2026-03-25 11:00:00'),
  (:company,'DEMO-INC-2026-006','2026-05-06','2026-05-05','18:40','Assembly Line 1','Production','minor','property_damage','Combi-oven trolley tipped while loading onto assembly bench; door glass panel cracked, no injury.','Deepak Joshi',NULL,2,'closed','Amit Verma','Trolley castor lock defective; castor replaced, pre-use check added.',0,false,TIMESTAMP '2026-05-06 09:00:00',TIMESTAMP '2026-05-15 14:00:00'),
  (:company,'DEMO-INC-2026-007','2026-07-18','2026-07-18','13:25','Welding Bay 1','Production','serious','fire','Sparks from MIG welding ignited packing foam stored too close to hot-work zone; extinguished with CO2 extinguisher in under a minute.','Ramesh Yadav',NULL,4,'investigating','Sunita Rao','Hot-work 5 m exclusion zone breached by staging material; investigation ongoing.',0,false,TIMESTAMP '2026-07-18 14:00:00',TIMESTAMP '2026-08-01 10:00:00'),
  (:company,'DEMO-INC-2026-008','2026-08-27','2026-08-27','15:10','Dispatch Yard','Dispatch & Logistics','minor','near_miss','Crated dishwasher shifted on pallet during truck loading; strapping held, load re-secured.','Ganesh Patil',NULL,1,'reported',NULL,NULL,0,false,TIMESTAMP '2026-08-27 16:00:00',TIMESTAMP '2026-08-27 16:00:00');

-- ---------------------------------------------------------------------------
-- hr_safety_inspections
-- ---------------------------------------------------------------------------
INSERT INTO hr_safety_inspections
  ("companyId","recordType",code,title,"auditType",area,department,auditor,"scheduledDate","completedDate",
   frequency,severity,priority,"assignedTo","dueDate",score,"findingsCount",description,status,remarks,"createdAt","updatedAt")
VALUES
  (:company,'inspection','DEMO-SI-001','Welding bay hot-work compliance walk','internal','Welding Bays 1-3','Production','Sunita Rao','2025-11-10','2025-11-10','monthly','medium','high','Amit Verma','2025-11-20',88,3,'Monthly hot-work permit, flashback arrestor and cylinder storage inspection.','completed','Two flashback arrestors past test date — replaced.',TIMESTAMP '2025-11-01 09:00:00',TIMESTAMP '2025-11-12 17:00:00'),
  (:company,'inspection','DEMO-SI-002','Press brake & shear guarding audit','internal','Sheet Metal Shop','Production','Ajay Pillai','2026-01-15','2026-01-16','quarterly','high','high','Kiran Reddy','2026-01-30',82,4,'Guard interlocks, light curtains and two-hand controls on shear, press brake and punching machines.','completed','Light curtain alignment corrected on press brake PB-02.',TIMESTAMP '2026-01-05 09:00:00',TIMESTAMP '2026-01-18 15:00:00'),
  (:company,'inspection','DEMO-SI-003','Fire extinguisher & hydrant round','statutory','Entire Factory','Administration','External - Marshal Fire Services','2026-03-20','2026-03-20','half-yearly','medium','medium','Anita Desai','2026-03-31',95,1,'Statutory check of 42 extinguishers, 6 hydrant points and 2 hose reels.','completed','One CO2 extinguisher under-weight — refilled.',TIMESTAMP '2026-03-01 09:00:00',TIMESTAMP '2026-03-22 12:00:00'),
  (:company,'inspection','DEMO-SI-004','LPG manifold & gas line leak test','statutory','Test Kitchen & Burner Assembly','Quality Control','External - PESO approved agency','2026-05-12','2026-05-12','quarterly','high','high','Sunita Rao','2026-05-25',91,2,'Soap-solution and manometer leak test on LPG manifold feeding burner test rigs.','completed','Regulator on rig TR-3 replaced as precaution.',TIMESTAMP '2026-05-02 09:00:00',TIMESTAMP '2026-05-14 16:00:00'),
  (:company,'inspection','DEMO-SI-005','Forklift & pallet truck pre-monsoon check','internal','Stores & Dispatch Yard','Stores & Inventory','Ramesh Yadav','2026-06-08','2026-06-09','yearly','medium','medium','Mohan Das','2026-06-20',86,3,'Brakes, horns, mast chains, hydraulics and charging bay ventilation.','completed','Charging bay exhaust fan bearing noisy — replaced.',TIMESTAMP '2026-06-01 09:00:00',TIMESTAMP '2026-06-10 17:00:00'),
  (:company,'inspection','DEMO-SI-006','Polishing cell dust extraction audit','internal','Polishing & Buffing Cell','Production','Sunita Rao','2026-09-15',NULL,'quarterly','medium','high','Amit Verma','2026-09-25',NULL,NULL,'Extraction airflow measurement and filter condition at buffing stations.','scheduled',NULL,TIMESTAMP '2026-08-20 09:00:00',TIMESTAMP '2026-08-20 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_safety_ppe — stock records + issue records
-- ---------------------------------------------------------------------------
INSERT INTO hr_safety_ppe
  ("companyId","recordType","itemCode","itemName",category,size,quantity,"inStock","reorderLevel",
   "employeeId","employeeName",department,"issuedDate","expiryDate","nextReplacement",condition,supplier,status,remarks,"createdAt","updatedAt")
VALUES
  (:company,'stock','DEMO-PPE-001','Auto-darkening welding helmet','head_face',NULL,25,18,5,NULL,NULL,'Production',NULL,NULL,NULL,NULL,'3M India','available',NULL,TIMESTAMP '2025-10-05 10:00:00',TIMESTAMP '2026-08-10 10:00:00'),
  (:company,'stock','DEMO-PPE-002','Leather welding gauntlets','hand',NULL,60,34,15,NULL,NULL,'Production',NULL,NULL,NULL,NULL,'Udyogi Safety','available',NULL,TIMESTAMP '2025-10-05 10:00:00',TIMESTAMP '2026-08-10 10:00:00'),
  (:company,'stock','DEMO-PPE-003','Cut-resistant gloves (Level 5)','hand',NULL,120,78,30,NULL,NULL,'Production',NULL,NULL,NULL,NULL,'Honeywell','available','Mandatory at shear and de-burring stations.',TIMESTAMP '2025-11-05 10:00:00',TIMESTAMP '2026-08-10 10:00:00'),
  (:company,'stock','DEMO-PPE-004','Safety goggles - anti-splash','eye',NULL,40,12,10,NULL,NULL,'Quality Control',NULL,NULL,NULL,NULL,'Karam','low_stock','Reorder raised for pickling booth stock.',TIMESTAMP '2025-10-05 10:00:00',TIMESTAMP '2026-09-01 10:00:00'),
  (:company,'stock','DEMO-PPE-005','Steel-toe safety shoes','foot','UK 6-11',80,52,20,NULL,NULL,'All',NULL,NULL,NULL,NULL,'Bata Industrials','available',NULL,TIMESTAMP '2025-10-05 10:00:00',TIMESTAMP '2026-08-10 10:00:00'),
  (:company,'stock','DEMO-PPE-006','FR welding apron & sleeves set','body','Free',30,21,8,NULL,NULL,'Production',NULL,NULL,NULL,NULL,'Udyogi Safety','available',NULL,TIMESTAMP '2025-10-20 10:00:00',TIMESTAMP '2026-08-10 10:00:00'),
  (:company,'issue','DEMO-PPE-001','Auto-darkening welding helmet','head_face',NULL,1,NULL,NULL,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'Deepak Joshi','Production','2026-04-02',NULL,'2027-04-02','good','3M India','issued',NULL,TIMESTAMP '2026-04-02 09:30:00',TIMESTAMP '2026-04-02 09:30:00'),
  (:company,'issue','DEMO-PPE-002','Leather welding gauntlets','hand','L',2,NULL,NULL,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon','Production','2026-06-15',NULL,'2026-12-15','good','Udyogi Safety','issued',NULL,TIMESTAMP '2026-06-15 09:30:00',TIMESTAMP '2026-06-15 09:30:00'),
  (:company,'issue','DEMO-PPE-005','Steel-toe safety shoes','foot','UK 8',1,NULL,NULL,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0020'),'Ganesh Patil','Dispatch & Logistics','2026-02-10',NULL,'2027-02-10','good','Bata Industrials','issued',NULL,TIMESTAMP '2026-02-10 09:30:00',TIMESTAMP '2026-02-10 09:30:00'),
  (:company,'issue','DEMO-PPE-004','Safety goggles - anti-splash','eye',NULL,1,NULL,NULL,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'Ajay Pillai','Quality Control','2026-03-12','2027-03-12','2027-03-12','good','Karam','issued','For pickling & passivation booth work.',TIMESTAMP '2026-03-12 09:30:00',TIMESTAMP '2026-03-12 09:30:00');

-- ---------------------------------------------------------------------------
-- hr_safety_reports — KPI/analytics rows
-- ---------------------------------------------------------------------------
INSERT INTO hr_safety_reports
  ("companyId","recordType","metricKey",label,category,period,department,value,target,unit,trend,framework,"dueDate",severity,description,status,"createdAt","updatedAt")
VALUES
  (:company,'analytics','ltifr','Lost Time Injury Frequency Rate','lagging','FY2026-Q1','Production',1.8,1.0,'per million hrs','down',NULL,NULL,NULL,'LTIFR across fabrication, welding and assembly.','active',TIMESTAMP '2026-07-05 10:00:00',TIMESTAMP '2026-07-05 10:00:00'),
  (:company,'analytics','trir','Total Recordable Incident Rate','lagging','FY2026-Q1','All',3.2,2.5,'per 200k hrs','flat',NULL,NULL,NULL,'All recordable incidents company-wide.','active',TIMESTAMP '2026-07-05 10:00:00',TIMESTAMP '2026-07-05 10:00:00'),
  (:company,'analytics','near_miss_count','Near-misses reported','leading','2026-08','All',6,8,'count','up',NULL,NULL,NULL,'Near-miss reporting encouraged via floor QR cards.','active',TIMESTAMP '2026-09-02 10:00:00',TIMESTAMP '2026-09-02 10:00:00'),
  (:company,'analytics','ppe_compliance','PPE compliance on floor rounds','leading','2026-08','Production',93,98,'%','up',NULL,NULL,NULL,'Weekly PPE spot checks in welding and polishing cells.','active',TIMESTAMP '2026-09-02 10:00:00',TIMESTAMP '2026-09-02 10:00:00'),
  (:company,'analytics','training_compliance','Safety training compliance','leading','2026-08','All',87,95,'%','up',NULL,NULL,NULL,'Employees current on mandatory safety modules.','active',TIMESTAMP '2026-09-02 10:00:00',TIMESTAMP '2026-09-02 10:00:00'),
  (:company,'analytics','first_aid_cases','First-aid cases','lagging','2026-08','All',2,0,'count','down',NULL,NULL,NULL,'Minor cuts and abrasions treated on site.','active',TIMESTAMP '2026-09-02 10:00:00',TIMESTAMP '2026-09-02 10:00:00'),
  (:company,'compliance','factory_license','Factories Act license renewal','statutory','FY2026',NULL,NULL,NULL,NULL,NULL,'Factories Act 1948','2026-12-31','high','Annual renewal with state factory inspectorate.','on_track',TIMESTAMP '2026-04-01 10:00:00',TIMESTAMP '2026-08-15 10:00:00'),
  (:company,'compliance','peso_lpg','PESO LPG storage compliance','statutory','FY2026','Quality Control',NULL,NULL,NULL,NULL,'PESO / Gas Cylinder Rules','2026-11-15','high','LPG manifold and cylinder storage for burner test rigs.','on_track',TIMESTAMP '2026-04-01 10:00:00',TIMESTAMP '2026-08-15 10:00:00');

-- ---------------------------------------------------------------------------
-- hr_safety_trainings
-- ---------------------------------------------------------------------------
INSERT INTO hr_safety_trainings
  ("companyId","recordType",code,title,category,trainer,department,"scheduledDate","completedDate",
   participants,duration,"compliancePercent",description,status,"createdAt","updatedAt")
VALUES
  (:company,'training','DEMO-ST-001','Hot work permit & welding safety','hot_work','Sunita Rao','Production','2025-10-20','2025-10-20',14,'4 hrs',100,'Permit-to-work, fire watch duty and flashback arrestor checks for welders and helpers.','completed',TIMESTAMP '2025-10-10 09:00:00',TIMESTAMP '2025-10-21 17:00:00'),
  (:company,'training','DEMO-ST-002','Fire extinguisher hands-on drill','fire','External - Marshal Fire Services','All','2026-01-28','2026-01-28',32,'2 hrs',94,'Live PASS-method practice on CO2 and DCP extinguishers; evacuation route walk-through.','completed',TIMESTAMP '2026-01-10 09:00:00',TIMESTAMP '2026-01-29 17:00:00'),
  (:company,'training','DEMO-ST-003','Forklift operator refresher','material_handling','External - Godrej Material Handling','Stores & Inventory','2026-03-05','2026-03-05',6,'6 hrs',100,'Load charts, pedestrian zones, ramp handling and daily pre-use checks.','completed',TIMESTAMP '2026-02-15 09:00:00',TIMESTAMP '2026-03-06 17:00:00'),
  (:company,'training','DEMO-ST-004','First aid & CPR certification','first_aid','External - St. John Ambulance','All','2026-04-16','2026-04-16',12,'8 hrs',100,'Certified first-aider training covering burns, cuts, CPR and eye-wash use.','completed',TIMESTAMP '2026-03-25 09:00:00',TIMESTAMP '2026-04-17 17:00:00'),
  (:company,'training','DEMO-ST-005','LOTO for machine maintenance','electrical','Ramesh Yadav','Maintenance','2026-06-22','2026-06-22',8,'3 hrs',100,'Lockout-tagout on press brake, shear and polishing machines before maintenance.','completed',TIMESTAMP '2026-06-01 09:00:00',TIMESTAMP '2026-06-23 17:00:00'),
  (:company,'training','DEMO-ST-006','Chemical handling — pickling & passivation','chemical','Sunita Rao','Quality Control','2026-09-18',NULL,10,'3 hrs',NULL,'Safe handling of pickling paste, acids, spill kit and booth shower use.','scheduled',TIMESTAMP '2026-08-25 09:00:00',TIMESTAMP '2026-08-25 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_safety_wellness
-- ---------------------------------------------------------------------------
INSERT INTO hr_safety_wellness
  ("companyId","recordType",code,title,category,"employeeId","employeeName",department,"scheduledDate","completedDate",
   provider,result,"riskLevel",participants,score,"exposureType","nextDue",description,status,"createdAt","updatedAt")
VALUES
  (:company,'checkup','DEMO-WL-001','Annual audiometry — welding & fabrication','occupational_health',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'Deepak Joshi','Production','2026-02-12','2026-02-12','Apollo Occupational Health','Normal hearing thresholds','low',NULL,NULL,'noise','2027-02-12','Noise exposure surveillance for grinding and fabrication area.','completed',TIMESTAMP '2026-01-20 09:00:00',TIMESTAMP '2026-02-13 12:00:00'),
  (:company,'checkup','DEMO-WL-002','Annual audiometry — welding & fabrication','occupational_health',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon','Production','2026-02-12','2026-02-12','Apollo Occupational Health','Mild threshold shift left ear','medium',NULL,NULL,'noise','2026-08-12','Repeat test in 6 months; ear plug fit re-checked.','follow_up',TIMESTAMP '2026-01-20 09:00:00',TIMESTAMP '2026-02-13 12:00:00'),
  (:company,'checkup','DEMO-WL-003','Spirometry — polishing & buffing cell','occupational_health',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),'Kiran Reddy','Production','2026-02-13','2026-02-13','Apollo Occupational Health','Normal lung function','low',NULL,NULL,'dust','2027-02-13','Metal dust exposure surveillance for buffing operators.','completed',TIMESTAMP '2026-01-20 09:00:00',TIMESTAMP '2026-02-14 12:00:00'),
  (:company,'checkup','DEMO-WL-004','Vision screening — QC inspectors','occupational_health',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'Ajay Pillai','Quality Control','2026-02-13','2026-02-13','Apollo Occupational Health','20/20 corrected','low',NULL,NULL,NULL,'2027-02-13','Annual vision check for weld-seam and finish inspection staff.','completed',TIMESTAMP '2026-01-20 09:00:00',TIMESTAMP '2026-02-14 12:00:00'),
  (:company,'campaign','DEMO-WL-005','Monsoon health camp & flu vaccination','wellness_campaign',NULL,NULL,'All','2026-06-25','2026-06-25','Aster MIMS',NULL,NULL,46,NULL,NULL,NULL,'General health screening, BP/sugar checks and voluntary flu shots on site.','completed',TIMESTAMP '2026-06-01 09:00:00',TIMESTAMP '2026-06-26 12:00:00'),
  (:company,'campaign','DEMO-WL-006','Ergonomics week — assembly benches','wellness_campaign',NULL,NULL,'Production','2026-09-21',NULL,'Internal HR',NULL,NULL,25,NULL,'ergonomic',NULL,'Bench height audit, lifting technique demos and stretch breaks pilot on Assembly Line 1.','scheduled',TIMESTAMP '2026-08-28 09:00:00',TIMESTAMP '2026-08-28 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_salary_components
-- ---------------------------------------------------------------------------
INSERT INTO hr_salary_components
  ("companyId",code,name,type,category,"calculationType",taxable,"pfApplicable","esiApplicable","displayOrder",status,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-BASIC','Basic Salary','earning','fixed','fixed',true,true,true,1,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-HRA','House Rent Allowance','earning','fixed','percentage',true,false,true,2,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-CONV','Conveyance Allowance','earning','fixed','fixed',true,false,true,3,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-SPL','Special Allowance','earning','fixed','balance',true,false,true,4,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-OT','Overtime Wages','earning','variable','formula',true,false,true,5,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-SHIFT','Night Shift Allowance','earning','variable','fixed',true,false,true,6,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-PF-EE','Provident Fund (Employee)','deduction','statutory','percentage',false,false,false,7,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-ESI-EE','ESI (Employee)','deduction','statutory','percentage',false,false,false,8,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-PT','Professional Tax','deduction','statutory','slab',false,false,false,9,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00'),
  (:company,'DEMO-TDS','Income Tax (TDS)','deduction','statutory','formula',false,false,false,10,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2025-10-01 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_salary_structures (no companyId — DEMO- code prefix is the delete key)
-- ---------------------------------------------------------------------------
INSERT INTO hr_salary_structures
  (code,name,description,"effectiveFrom","applicableDesignations","applicableDepartments","applicableEmployeeTypes",
   components,"isPFApplicable","pfCeiling","isESIApplicable","esiCeiling",status,"createdBy","createdAt","updatedAt")
VALUES
  ('DEMO-SS-WORKER','Factory Workmen Structure','Fabricators, welders, polishers and helpers on the shop floor.','2026-04-01','Executive,Junior Executive,Trainee','Production,Stores & Inventory,Dispatch & Logistics,Maintenance','Full-Time,Contract',
   '[{"code":"BASIC","name":"Basic Salary","type":"earning","calc":"50% of gross"},{"code":"HRA","name":"House Rent Allowance","type":"earning","calc":"30% of basic"},{"code":"CONV","name":"Conveyance","type":"earning","calc":"1600 fixed"},{"code":"SPL","name":"Special Allowance","type":"earning","calc":"balance"},{"code":"OT","name":"Overtime","type":"earning","calc":"2x hourly basic"}]',
   true,15000,true,21000,'Active','demo-seed',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00'),
  ('DEMO-SS-STAFF','Staff & Supervisory Structure','Senior executives, assistant managers and supervisors.','2026-04-01','Senior Executive,Assistant Manager','All','Full-Time',
   '[{"code":"BASIC","name":"Basic Salary","type":"earning","calc":"50% of gross"},{"code":"HRA","name":"House Rent Allowance","type":"earning","calc":"30% of basic"},{"code":"CONV","name":"Conveyance","type":"earning","calc":"1600 fixed"},{"code":"SPL","name":"Special Allowance","type":"earning","calc":"balance"}]',
   true,15000,false,NULL,'Active','demo-seed',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00'),
  ('DEMO-SS-MGR','Managerial Structure','Managers, AGMs and GMs.','2026-04-01','Manager,Assistant General Manager,General Manager','All','Full-Time',
   '[{"code":"BASIC","name":"Basic Salary","type":"earning","calc":"50% of gross"},{"code":"HRA","name":"House Rent Allowance","type":"earning","calc":"30% of basic"},{"code":"CONV","name":"Conveyance","type":"earning","calc":"1600 fixed"},{"code":"SPL","name":"Special Allowance","type":"earning","calc":"balance"},{"code":"LTA","name":"Leave Travel Allowance","type":"earning","calc":"8.33% of basic"}]',
   true,15000,false,NULL,'Active','demo-seed',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00'),
  ('DEMO-SS-CXO','Leadership Structure','CXO band with flexi-benefits.','2026-04-01','Chief Executive Officer,Chief Operating Officer,Chief Financial Officer,Chief Technology Officer','Management','Full-Time',
   '[{"code":"BASIC","name":"Basic Salary","type":"earning","calc":"50% of gross"},{"code":"HRA","name":"House Rent Allowance","type":"earning","calc":"30% of basic"},{"code":"FLEXI","name":"Flexi Benefits","type":"earning","calc":"balance"},{"code":"CAR","name":"Car Lease","type":"benefit","calc":"as per policy"}]',
   true,15000,false,NULL,'Active','demo-seed',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_salary_templates
-- ---------------------------------------------------------------------------
INSERT INTO hr_salary_templates
  ("companyId","templateCode","templateName",grade,"employmentType","ctcRange",components,"assignedCount",status,"createdBy","createdOn","createdAt","updatedAt")
VALUES
  (:company,'DEMO-TPL-W1','Workman Grade W1','W1','Full-Time','3.0L - 5.0L','[{"name":"Basic","pct":50},{"name":"HRA","pct":15},{"name":"Conveyance","amount":1600},{"name":"Special Allowance","pct":"balance"}]',5,'active','Anita Desai','2026-03-20',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00'),
  (:company,'DEMO-TPL-S1','Staff Grade S1','S1','Full-Time','5.0L - 9.0L','[{"name":"Basic","pct":50},{"name":"HRA","pct":15},{"name":"Conveyance","amount":1600},{"name":"Special Allowance","pct":"balance"}]',6,'active','Anita Desai','2026-03-20',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00'),
  (:company,'DEMO-TPL-M1','Manager Grade M1','M1','Full-Time','9.0L - 16.0L','[{"name":"Basic","pct":50},{"name":"HRA","pct":15},{"name":"LTA","pct":4},{"name":"Special Allowance","pct":"balance"}]',5,'active','Anita Desai','2026-03-20',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00'),
  (:company,'DEMO-TPL-M2','Senior Manager Grade M2','M2','Full-Time','16.0L - 26.0L','[{"name":"Basic","pct":50},{"name":"HRA","pct":15},{"name":"LTA","pct":4},{"name":"Special Allowance","pct":"balance"}]',2,'active','Anita Desai','2026-03-20',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00'),
  (:company,'DEMO-TPL-L1','Leadership Grade L1','L1','Full-Time','26.0L+','[{"name":"Basic","pct":50},{"name":"HRA","pct":15},{"name":"Flexi Benefits","pct":"balance"},{"name":"Car Lease","note":"as per policy"}]',2,'active','Anita Desai','2026-03-20',TIMESTAMP '2026-03-20 09:00:00',TIMESTAMP '2026-03-20 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_salary_slips — 20 employees x Jun/Jul/Aug 2026, derived from hr_employees
-- NOTE: "payrollId" has an enforced NOT NULL FK to hr_payrolls (seeded by the
-- payroll demo-seed file, not this one). The insert therefore joins to the
-- matching monthly payroll run: months with no hr_payrolls row are skipped
-- gracefully (0 rows) instead of failing.
-- ---------------------------------------------------------------------------
INSERT INTO hr_salary_slips
  ("slipNumber","payrollId","employeeId","employeeCode","employeeName",designation,department,"joiningDate",
   "bankAccount","panNumber","pfNumber","esiNumber",month,year,"paymentDate",
   "workingDays","presentDays","absentDays","leaveDays","paidDays","lopDays","overtimeHours",
   earnings,"grossSalary",deductions,"totalDeductions","netSalary",
   "pfEmployeeContribution","pfEmployerContribution","professionalTax",tds,
   status,"isPaid","paidAt","paymentMode","createdBy","createdAt","updatedAt")
SELECT
  'DEMO-SLP-'||m.yr||lpad(m.mo::text,2,'0')||'-'||e."employeeCode",
  p.id,
  e.id, e."employeeCode", e."firstName"||' '||e."lastName",
  dg.title, dp.name, e."joiningDate",
  e."accountNumber", e."panNumber", e."pfNumber", e."esiNumber",
  m.mo, m.yr, m.payday,
  26, 25, 0, 1, 26, 0, 0,
  json_build_object(
    'Basic', e."basicSalary",
    'HRA', round(e."basicSalary"*0.30,2),
    'Conveyance', 1600,
    'Special Allowance', round(e."grossSalary"-e."basicSalary"*1.30-1600,2)),
  e."grossSalary",
  json_build_object('PF', 1800, 'Professional Tax', 200, 'TDS', t.tds),
  1800 + 200 + t.tds,
  e."grossSalary" - (1800 + 200 + t.tds),
  1800, 1800, 200, t.tds,
  CASE WHEN m.mo = 8 THEN 'Generated'::hr_salary_slips_status_enum ELSE 'Paid'::hr_salary_slips_status_enum END,
  m.mo <> 8,
  CASE WHEN m.mo <> 8 THEN m.payday::timestamp + interval '11 hours' END,
  'Bank Transfer', 'demo-seed',
  m.payday::timestamp + interval '9 hours', m.payday::timestamp + interval '9 hours'
FROM hr_employees e
JOIN hr_departments dp ON dp.id = e."departmentId"
JOIN hr_designations dg ON dg.id = e."designationId"
CROSS JOIN (VALUES
  (6, 2026, DATE '2026-06-30'),
  (7, 2026, DATE '2026-07-31'),
  (8, 2026, DATE '2026-08-31')
) AS m(mo, yr, payday)
JOIN LATERAL (
  SELECT id FROM hr_payrolls
  WHERE month = m.mo AND year = m.yr
  ORDER BY "createdAt" LIMIT 1
) p ON true
CROSS JOIN LATERAL (SELECT round(greatest(0, (e."grossSalary"-100000)*0.10), 0) AS tds) t
WHERE e.status = 'Active';

-- ---------------------------------------------------------------------------
-- hr_shift_assignments — first 12 employees mapped to their master shift
-- ---------------------------------------------------------------------------
INSERT INTO hr_shift_assignments
  ("companyId","employeeId","employeeName",department,"shiftCode","shiftName","effectiveFrom","effectiveTo",
   status,"assignedBy","assignedDate","createdAt","updatedAt")
SELECT
  :company, e.id::text, e."firstName"||' '||e."lastName", d.name, s.code, s.name,
  '2026-04-01', NULL, 'Active', 'Anita Desai', '2026-03-25',
  TIMESTAMP '2026-03-25 10:00:00', TIMESTAMP '2026-03-25 10:00:00'
FROM hr_employees e
JOIN hr_shifts s ON s.id::text = e."shiftId"
JOIN hr_departments d ON d.id = e."departmentId"
ORDER BY e."employeeCode"
LIMIT 12;

-- ---------------------------------------------------------------------------
-- hr_shift_roster_entries — week of 07 Sep 2026 for factory-floor employees
-- ---------------------------------------------------------------------------
INSERT INTO hr_shift_roster_entries
  ("companyId","employeeId","employeeName",department,"weekStart",shifts,"createdAt","updatedAt")
SELECT
  :company, e.id::text, e."firstName"||' '||e."lastName", d.name, '2026-09-07',
  json_build_object('mon',s.code,'tue',s.code,'wed',s.code,'thu',s.code,'fri',s.code,'sat',s.code,'sun','OFF'),
  TIMESTAMP '2026-09-04 17:00:00', TIMESTAMP '2026-09-04 17:00:00'
FROM hr_employees e
JOIN hr_shifts s ON s.id::text = e."shiftId"
JOIN hr_departments d ON d.id = e."departmentId"
WHERE e."employeeCode" IN ('EMP0007','EMP0008','EMP0009','EMP0010','EMP0011','EMP0012','EMP0013','EMP0014')
ORDER BY e."employeeCode";

-- ---------------------------------------------------------------------------
-- hr_shift_swaps
-- ---------------------------------------------------------------------------
INSERT INTO hr_shift_swaps
  ("companyId","requesterId","requesterName","requesterDepartment","requesterShift","requesterDate",
   "targetId","targetName","targetDepartment","targetShift","targetDate",
   reason,status,"requestDate","approvedBy","approvedDate","createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'Deepak Joshi','Production','EVENING','2026-08-14',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),'Kiran Reddy','Production','MORNING','2026-08-14','Family function in the evening; swap requested for Independence Day eve.','Approved','2026-08-10','Amit Verma','2026-08-11',TIMESTAMP '2026-08-10 11:00:00',TIMESTAMP '2026-08-11 09:30:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon','Production','NIGHT','2026-08-21',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'Deepak Joshi','Production','EVENING','2026-08-21','Medical appointment next morning after night shift.','Approved','2026-08-17','Amit Verma','2026-08-18',TIMESTAMP '2026-08-17 14:00:00',TIMESTAMP '2026-08-18 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'Ajay Pillai','Quality Control','MORNING','2026-09-04',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0011'),'Sunita Rao','Quality Control','GENERAL','2026-09-04','Early customer FAT witness at site; needs general shift cover in QC lab.','Rejected','2026-08-30','Sunita Rao','2026-08-31',TIMESTAMP '2026-08-30 09:00:00',TIMESTAMP '2026-08-31 12:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0019'),'Ramesh Yadav','Maintenance','MORNING','2026-09-11',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0020'),'Ganesh Patil','Dispatch & Logistics','MORNING','2026-09-12','Preventive maintenance window moved to Saturday; day swap requested.','Pending','2026-09-08',NULL,NULL,TIMESTAMP '2026-09-08 10:00:00',TIMESTAMP '2026-09-08 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),'Kiran Reddy','Production','MORNING','2026-09-15',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon','Production','NIGHT','2026-09-15','Covering night-shift supervision during festival week staffing gap.','Pending','2026-09-09',NULL,NULL,TIMESTAMP '2026-09-09 15:00:00',TIMESTAMP '2026-09-09 15:00:00');

-- ---------------------------------------------------------------------------
-- hr_skill_assessments — skill codes/names taken from hr_skills master
-- ---------------------------------------------------------------------------
INSERT INTO hr_skill_assessments
  ("companyId","employeeId","employeeName","skillCode","skillName",category,"assessmentDate",assessor,
   "currentLevel","targetLevel",score,feedback,status,"createdAt","updatedAt")
VALUES
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0016'),'Neha Agarwal','backend-engineer','Backend Engineer','Engineering','2026-05-18','Arun Gupta','Intermediate','Advanced',72,'Solid NestJS module work on the plant MES connector; needs depth on query optimisation.','completed',TIMESTAMP '2026-05-18 10:00:00',TIMESTAMP '2026-05-20 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0015'),'Arun Gupta','ai-automation','AI Automation','Engineering','2026-05-18','Priya Sharma','Advanced','Expert',86,'Led the quotation OCR automation pilot; ready for expert-level certification.','completed',TIMESTAMP '2026-05-18 10:00:00',TIMESTAMP '2026-05-20 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0011'),'Sunita Rao','quality-assurance-engineer','Quality Assurance Engineer','Engineering','2026-06-02','Priya Sharma','Advanced','Expert',88,'Strong incoming-inspection SOP design; excellent weld-seam defect classification.','completed',TIMESTAMP '2026-06-02 10:00:00',TIMESTAMP '2026-06-04 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'Ajay Pillai','quality-assurance-engineer','Quality Assurance Engineer','Engineering','2026-06-02','Sunita Rao','Intermediate','Advanced',68,'Good on dimensional checks; assign passivation-test cross-training.','completed',TIMESTAMP '2026-06-02 10:00:00',TIMESTAMP '2026-06-04 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007'),'Amit Verma','workflow-manager','Workflow Manager','Operations','2026-06-15','Priya Sharma','Advanced','Expert',81,'Runs production order routing well; extend to CPQ-to-production handoff flows.','completed',TIMESTAMP '2026-06-15 10:00:00',TIMESTAMP '2026-06-17 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0017'),'Sanjay Malhotra','business-ops-marketing-manager','Business Ops & Marketing Manager','Business','2026-07-06','Priya Sharma','Intermediate','Advanced',74,'Strong dealer-channel play; sharpen digital lead-gen for institutional kitchens.','completed',TIMESTAMP '2026-07-06 10:00:00',TIMESTAMP '2026-07-08 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0003'),'Anita Desai','platform-capabilities','Platform Capabilities','Operations','2026-08-10','Priya Sharma','Beginner','Intermediate',58,'HRMS module rollout owner; schedule platform admin deep-dive.','completed',TIMESTAMP '2026-08-10 10:00:00',TIMESTAMP '2026-08-12 10:00:00'),
  (:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0018'),'Pooja Mehta','linkedin-expert','LinkedIn Expert','Business','2026-09-07','Sanjay Malhotra','Beginner','Intermediate',0,'Assessment scheduled with marketing case submission.','pending',TIMESTAMP '2026-09-07 10:00:00',TIMESTAMP '2026-09-07 10:00:00');

-- ---------------------------------------------------------------------------
-- hr_stationery
-- ---------------------------------------------------------------------------
INSERT INTO hr_stationery
  ("companyId","itemCode","itemName",category,brand,unit,"totalQuantity",issued,available,"minStockLevel","reorderLevel",
   "unitCost","totalValue",location,supplier,"lastPurchaseDate",status,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-STN-001','A4 Copier Paper 75gsm (ream)','paper','JK Copier','ream',60,38,22,10,15,285,17100,'Admin Store Cabinet A','Lulu Office Supplies','2026-08-02','in_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-02 09:00:00'),
  (:company,'DEMO-STN-002','Ball Pen Blue','writing','Cello','pcs',200,146,54,30,50,10,2000,'Admin Store Cabinet A','Lulu Office Supplies','2026-07-15','in_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-07-15 09:00:00'),
  (:company,'DEMO-STN-003','Permanent Marker (metal marking)','writing','Camlin','pcs',80,64,16,15,20,32,2560,'Shop Floor Tool Crib','Lulu Office Supplies','2026-06-20','low_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-06-20 09:00:00'),
  (:company,'DEMO-STN-004','Job Card Pads (50 leaf)','forms','Custom Print','pad',40,29,11,8,10,95,3800,'Production Office','Sree Printers','2026-05-11','in_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-05-11 09:00:00'),
  (:company,'DEMO-STN-005','Delivery Challan Books','forms','Custom Print','book',30,22,8,5,8,140,4200,'Dispatch Office','Sree Printers','2026-07-28','low_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-07-28 09:00:00'),
  (:company,'DEMO-STN-006','Box File A4','filing','Solo','pcs',50,41,9,8,10,110,5500,'Admin Store Cabinet B','Lulu Office Supplies','2026-04-19','low_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-04-19 09:00:00'),
  (:company,'DEMO-STN-007','Stapler No.10 with pins','desk','Kangaro','set',25,18,7,4,5,85,2125,'Admin Store Cabinet B','Lulu Office Supplies','2026-03-22','in_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-03-22 09:00:00'),
  (:company,'DEMO-STN-008','Whiteboard Marker Set','writing','Luxor','set',35,24,11,6,8,120,4200,'Meeting Rooms','Lulu Office Supplies','2026-08-18','in_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-18 09:00:00'),
  (:company,'DEMO-STN-009','Visitor Pass Lanyards','other','Generic','pcs',100,72,28,20,25,28,2800,'Security Gate','Lulu Office Supplies','2026-02-14','in_stock',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-02-14 09:00:00'),
  (:company,'DEMO-STN-010','Inspection Tag Rolls (QC)','forms','Custom Print','roll',20,17,3,4,5,260,5200,'QC Lab','Sree Printers','2026-08-30','reorder',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-30 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_succession_plans
-- ---------------------------------------------------------------------------
INSERT INTO hr_succession_plans
  ("companyId","recordType",title,status,data,"createdAt","updatedAt")
VALUES
  (:company,'plan','Production GM succession','active','{"role":"General Manager - Production","incumbent":"Amit Verma","riskOfLoss":"low","candidates":[{"name":"Kiran Reddy","readiness":"1-2 years","developmentActions":["Lead Assembly Line 2 expansion","Finance for non-finance managers"]},{"name":"Sunita Rao","readiness":"ready now","developmentActions":["Cross-exposure to production planning"]}]}',TIMESTAMP '2026-04-10 10:00:00',TIMESTAMP '2026-07-15 10:00:00'),
  (:company,'plan','QC Manager succession','active','{"role":"Manager - Quality Control","incumbent":"Sunita Rao","riskOfLoss":"medium","candidates":[{"name":"Ajay Pillai","readiness":"1-2 years","developmentActions":["NABL audit exposure","Weld procedure qualification training"]}]}',TIMESTAMP '2026-04-10 10:00:00',TIMESTAMP '2026-07-15 10:00:00'),
  (:company,'plan','CFO succession','active','{"role":"Chief Financial Officer","incumbent":"Suresh Patel","riskOfLoss":"low","candidates":[{"name":"Meera Nair","readiness":"2-3 years","developmentActions":["Treasury rotation","Board reporting ownership from FY27"]}]}',TIMESTAMP '2026-04-10 10:00:00',TIMESTAMP '2026-07-15 10:00:00'),
  (:company,'plan','Stores lead succession','draft','{"role":"Assistant Manager - Stores","incumbent":"Mohan Das","riskOfLoss":"medium","candidates":[{"name":"Lakshmi Iyer","readiness":"1-2 years","developmentActions":["WMS super-user certification","Cycle-count program ownership"]}]}',TIMESTAMP '2026-06-05 10:00:00',TIMESTAMP '2026-06-05 10:00:00'),
  (:company,'plan','Sales AGM succession','active','{"role":"AGM - Sales & Marketing","incumbent":"Sanjay Malhotra","riskOfLoss":"high","candidates":[{"name":"Pooja Mehta","readiness":"2-3 years","developmentActions":["Key-account rotation on hotel chains","CPQ certification"]}],"notes":"Incumbent flagged as retention risk after competitor approach."}',TIMESTAMP '2026-06-05 10:00:00',TIMESTAMP '2026-08-20 10:00:00');

-- ---------------------------------------------------------------------------
-- hr_teams
-- ---------------------------------------------------------------------------
INSERT INTO hr_teams
  ("companyId",code,name,department,"teamLead","teamLeadId","memberCount","activeProjects","completedProjects",
   "avgPerformance","budgetUtilization","establishedDate",location,shift,members,status,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-TM-001','SS Fabrication Cell A','Production','Kiran Reddy',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),6,3,14,84.5,78.0,'2024-04-01','Bay 1 - Sheet Metal Shop','MORNING','[{"name":"Kiran Reddy","role":"Cell Lead"},{"name":"Ravi Menon","role":"Fabricator"},{"name":"Deepak Joshi","role":"Welder"}]','active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  (:company,'DEMO-TM-002','Welding & Polishing Cell','Production','Deepak Joshi',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),5,2,11,81.0,74.5,'2024-04-01','Bays 2-3','EVENING','[{"name":"Deepak Joshi","role":"Lead Welder"},{"name":"Ravi Menon","role":"Polisher"}]','active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  (:company,'DEMO-TM-003','Assembly Line 1','Production','Amit Verma',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007'),8,4,22,87.2,82.0,'2023-10-01','Assembly Hall','GENERAL','[{"name":"Amit Verma","role":"Line Manager"},{"name":"Kiran Reddy","role":"Supervisor"}]','active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  (:company,'DEMO-TM-004','QC & Testing','Quality Control','Sunita Rao',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0011'),4,3,18,90.1,69.0,'2023-10-01','QC Lab & Test Kitchen','GENERAL','[{"name":"Sunita Rao","role":"QC Manager"},{"name":"Ajay Pillai","role":"Inspector"}]','active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  (:company,'DEMO-TM-005','Install & Commissioning Crew','Dispatch & Logistics','Ganesh Patil',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0020'),5,5,31,83.7,88.0,'2024-01-15','Field / Customer Sites','GENERAL','[{"name":"Ganesh Patil","role":"Crew Lead"},{"name":"Ramesh Yadav","role":"Technician"}]','active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  (:company,'DEMO-TM-006','Plant Maintenance Crew','Maintenance','Ramesh Yadav',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0019'),4,2,26,85.9,71.5,'2023-10-01','Maintenance Workshop','MORNING','[{"name":"Ramesh Yadav","role":"Maintenance Lead"}]','active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_timesheets — 10 factory/office employees x 2 recent weeks
-- ---------------------------------------------------------------------------
INSERT INTO hr_timesheets
  ("companyId","employeeCode","employeeId","employeeName",department,week,"weekPeriod",
   "totalHours","regularHours","overtimeHours","projectCount","submittedDate",entries,status,"createdAt","updatedAt")
SELECT
  :company, e."employeeCode", e.id::text, e."firstName"||' '||e."lastName", d.name,
  w.week, w.period,
  45 + w.ot, 45, w.ot, 2, w.submitted,
  jsonb_build_array(
    jsonb_build_object('project','WO-2026-118 SS Counter Line - Grand Hyatt','hours',30),
    jsonb_build_object('project','WO-2026-121 Combi Oven Batch 7','hours',15 + w.ot)),
  w.status,
  (w.submitted||' 18:00:00')::timestamp, (w.submitted||' 18:00:00')::timestamp
FROM hr_employees e
JOIN hr_departments d ON d.id = e."departmentId"
CROSS JOIN (VALUES
  ('2026-W35','Aug 24 - Aug 30, 2026','2026-08-31',3,'approved'),
  ('2026-W36','Aug 31 - Sep 06, 2026','2026-09-07',2,'submitted')
) AS w(week, period, submitted, ot, status)
WHERE e."employeeCode" IN ('EMP0007','EMP0008','EMP0009','EMP0010','EMP0011','EMP0012','EMP0013','EMP0014','EMP0019','EMP0020');

-- ---------------------------------------------------------------------------
-- hr_training_programs (fixed ids — referenced by schedules/enrollments etc.)
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_programs
  (id,"companyId",code,title,description,category,level,duration,mode,instructor,department,
   capacity,enrolled,cost,"nextBatch",location,certification,status,"createdAt","updatedAt")
VALUES
  ('11110000-0000-4000-8000-000000000001',:company,'DEMO-TP-001','TIG/MIG Welding Certification (SS 304/316)','Hands-on certification for TIG and MIG welding of food-grade stainless steel, including weld-seam finishing and distortion control.','technical','intermediate',40,'classroom+practical','External - Ador Welding Academy','Production',12,10,85000,'2026-10-05','Welding Bays 1-2',true,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  ('11110000-0000-4000-8000-000000000002',:company,'DEMO-TP-002','Food-grade Hygiene & Finishing Standards','NSF/HACCP-aligned surface finishing, passivation and hygienic design rules for commercial kitchen equipment.','quality','intermediate',16,'classroom','Sunita Rao','Quality Control',15,12,25000,'2026-09-22','QC Lab',true,'active',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  ('11110000-0000-4000-8000-000000000003',:company,'DEMO-TP-003','Sheet Metal CNC & Press Brake Operations','Programming and safe operation of CNC punching, laser cutting and press brake for SS sheet fabrication.','technical','beginner',24,'practical','Amit Verma','Production',10,8,40000,'2026-11-10','Sheet Metal Shop',false,'active',TIMESTAMP '2025-11-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  ('11110000-0000-4000-8000-000000000004',:company,'DEMO-TP-004','5S & Kaizen for the Shop Floor','Workplace organisation, visual management and small-group improvement projects across fabrication and assembly.','lean','beginner',8,'workshop','External - CII Institute of Quality','All',25,18,30000,'2026-10-19','Training Hall',false,'active',TIMESTAMP '2026-01-05 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  ('11110000-0000-4000-8000-000000000005',:company,'DEMO-TP-005','Field Installation & Commissioning Excellence','Site safety, LPG/electrical hookup checks, commissioning protocol and customer handover for kitchen equipment installs.','technical','intermediate',20,'classroom+field','Ganesh Patil','Dispatch & Logistics',8,6,20000,'2026-09-28','Training Hall + Site',false,'active',TIMESTAMP '2026-02-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00'),
  ('11110000-0000-4000-8000-000000000006',:company,'DEMO-TP-006','Leadership Essentials for Supervisors','Shift planning, feedback conversations and daily performance dialogues for first-line supervisors.','behavioural','intermediate',12,'classroom','External - Dale Carnegie','All',15,9,55000,'2026-12-07','Training Hall',false,'active',TIMESTAMP '2026-03-01 09:00:00',TIMESTAMP '2026-08-01 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_training_schedules (fixed ids — referenced by attendance/feedback/waitlist)
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_schedules
  (id,"companyId","programId",title,trainer,"startDate","endDate",location,capacity,enrolled,status,"createdAt","updatedAt")
VALUES
  ('22220000-0000-4000-8000-000000000001',:company,'11110000-0000-4000-8000-000000000001','TIG/MIG Welding Certification — Batch 3','Ador Welding Academy','2026-06-08','2026-06-12','Welding Bays 1-2',12,10,'completed',TIMESTAMP '2026-05-10 09:00:00',TIMESTAMP '2026-06-15 09:00:00'),
  ('22220000-0000-4000-8000-000000000002',:company,'11110000-0000-4000-8000-000000000002','Food-grade Hygiene & Finishing — Q2 batch','Sunita Rao','2026-05-19','2026-05-20','QC Lab',15,12,'completed',TIMESTAMP '2026-04-25 09:00:00',TIMESTAMP '2026-05-22 09:00:00'),
  ('22220000-0000-4000-8000-000000000003',:company,'11110000-0000-4000-8000-000000000003','CNC & Press Brake Ops — Batch 2','Amit Verma','2026-07-14','2026-07-17','Sheet Metal Shop',10,8,'completed',TIMESTAMP '2026-06-20 09:00:00',TIMESTAMP '2026-07-20 09:00:00'),
  ('22220000-0000-4000-8000-000000000004',:company,'11110000-0000-4000-8000-000000000004','5S & Kaizen — wave 1','CII Institute of Quality','2026-08-24','2026-08-25','Training Hall',25,18,'completed',TIMESTAMP '2026-07-30 09:00:00',TIMESTAMP '2026-08-27 09:00:00'),
  ('22220000-0000-4000-8000-000000000005',:company,'11110000-0000-4000-8000-000000000005','Install & Commissioning — Sep batch','Ganesh Patil','2026-09-28','2026-09-30','Training Hall + Site',8,6,'scheduled',TIMESTAMP '2026-08-28 09:00:00',TIMESTAMP '2026-08-28 09:00:00'),
  ('22220000-0000-4000-8000-000000000006',:company,'11110000-0000-4000-8000-000000000006','Leadership Essentials — Dec cohort','Dale Carnegie','2026-12-07','2026-12-09','Training Hall',15,9,'scheduled',TIMESTAMP '2026-08-28 09:00:00',TIMESTAMP '2026-08-28 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_training_enrollments (fixed ids — referenced by attendance/feedback/attempts)
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_enrollments
  (id,"companyId","employeeId","employeeName","programCode","programTitle",category,"startDate","endDate",
   duration,progress,attendance,instructor,location,mode,certification,status,"createdAt","updatedAt")
VALUES
  ('44440000-0000-4000-8000-000000000001',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'Deepak Joshi','DEMO-TP-001','TIG/MIG Welding Certification (SS 304/316)','technical','2026-06-08','2026-06-12',40,100,100,'Ador Welding Academy','Welding Bays 1-2','classroom+practical',true,'completed',TIMESTAMP '2026-05-12 09:00:00',TIMESTAMP '2026-06-15 09:00:00'),
  ('44440000-0000-4000-8000-000000000002',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon','DEMO-TP-001','TIG/MIG Welding Certification (SS 304/316)','technical','2026-06-08','2026-06-12',40,100,80,'Ador Welding Academy','Welding Bays 1-2','classroom+practical',true,'completed',TIMESTAMP '2026-05-12 09:00:00',TIMESTAMP '2026-06-15 09:00:00'),
  ('44440000-0000-4000-8000-000000000003',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),'Kiran Reddy','DEMO-TP-001','TIG/MIG Welding Certification (SS 304/316)','technical','2026-06-08','2026-06-12',40,100,100,'Ador Welding Academy','Welding Bays 1-2','classroom+practical',true,'completed',TIMESTAMP '2026-05-12 09:00:00',TIMESTAMP '2026-06-15 09:00:00'),
  ('44440000-0000-4000-8000-000000000004',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0011'),'Sunita Rao','DEMO-TP-002','Food-grade Hygiene & Finishing Standards','quality','2026-05-19','2026-05-20',16,100,100,'Sunita Rao','QC Lab','classroom',true,'completed',TIMESTAMP '2026-04-28 09:00:00',TIMESTAMP '2026-05-22 09:00:00'),
  ('44440000-0000-4000-8000-000000000005',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'Ajay Pillai','DEMO-TP-002','Food-grade Hygiene & Finishing Standards','quality','2026-05-19','2026-05-20',16,100,100,'Sunita Rao','QC Lab','classroom',true,'completed',TIMESTAMP '2026-04-28 09:00:00',TIMESTAMP '2026-05-22 09:00:00'),
  ('44440000-0000-4000-8000-000000000006',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007'),'Amit Verma','DEMO-TP-002','Food-grade Hygiene & Finishing Standards','quality','2026-05-19','2026-05-20',16,100,50,'Sunita Rao','QC Lab','classroom',true,'completed',TIMESTAMP '2026-04-28 09:00:00',TIMESTAMP '2026-05-22 09:00:00'),
  ('44440000-0000-4000-8000-000000000007',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon','DEMO-TP-003','Sheet Metal CNC & Press Brake Operations','technical','2026-07-14','2026-07-17',24,100,100,'Amit Verma','Sheet Metal Shop','practical',false,'completed',TIMESTAMP '2026-06-25 09:00:00',TIMESTAMP '2026-07-20 09:00:00'),
  ('44440000-0000-4000-8000-000000000008',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0013'),'Mohan Das','DEMO-TP-004','5S & Kaizen for the Shop Floor','lean','2026-08-24','2026-08-25',8,100,100,'CII Institute of Quality','Training Hall','workshop',false,'completed',TIMESTAMP '2026-08-05 09:00:00',TIMESTAMP '2026-08-27 09:00:00'),
  ('44440000-0000-4000-8000-000000000009',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0014'),'Lakshmi Iyer','DEMO-TP-004','5S & Kaizen for the Shop Floor','lean','2026-08-24','2026-08-25',8,100,100,'CII Institute of Quality','Training Hall','workshop',false,'completed',TIMESTAMP '2026-08-05 09:00:00',TIMESTAMP '2026-08-27 09:00:00'),
  ('44440000-0000-4000-8000-000000000010',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0020'),'Ganesh Patil','DEMO-TP-005','Field Installation & Commissioning Excellence','technical','2026-09-28','2026-09-30',20,0,0,'Ganesh Patil','Training Hall + Site','classroom+field',false,'upcoming',TIMESTAMP '2026-09-01 09:00:00',TIMESTAMP '2026-09-01 09:00:00'),
  ('44440000-0000-4000-8000-000000000011',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0019'),'Ramesh Yadav','DEMO-TP-005','Field Installation & Commissioning Excellence','technical','2026-09-28','2026-09-30',20,0,0,'Ganesh Patil','Training Hall + Site','classroom+field',false,'upcoming',TIMESTAMP '2026-09-01 09:00:00',TIMESTAMP '2026-09-01 09:00:00'),
  ('44440000-0000-4000-8000-000000000012',:company,(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),'Kiran Reddy','DEMO-TP-006','Leadership Essentials for Supervisors','behavioural','2026-12-07','2026-12-09',12,0,0,'Dale Carnegie','Training Hall','classroom',false,'upcoming',TIMESTAMP '2026-09-05 09:00:00',TIMESTAMP '2026-09-05 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_training_attendance
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_attendance
  ("companyId","scheduleId","enrollmentId","employeeId","employeeName",status,note,date,"createdAt","updatedAt")
VALUES
  (:company,'22220000-0000-4000-8000-000000000001','44440000-0000-4000-8000-000000000001',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'Deepak Joshi','present',NULL,'2026-06-08',TIMESTAMP '2026-06-08 09:30:00',TIMESTAMP '2026-06-08 09:30:00'),
  (:company,'22220000-0000-4000-8000-000000000001','44440000-0000-4000-8000-000000000002',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon','present',NULL,'2026-06-08',TIMESTAMP '2026-06-08 09:30:00',TIMESTAMP '2026-06-08 09:30:00'),
  (:company,'22220000-0000-4000-8000-000000000001','44440000-0000-4000-8000-000000000002',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon','absent','On approved sick leave; practical session rescheduled.','2026-06-09',TIMESTAMP '2026-06-09 09:30:00',TIMESTAMP '2026-06-09 09:30:00'),
  (:company,'22220000-0000-4000-8000-000000000002','44440000-0000-4000-8000-000000000004',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0011'),'Sunita Rao','present',NULL,'2026-05-19',TIMESTAMP '2026-05-19 09:30:00',TIMESTAMP '2026-05-19 09:30:00'),
  (:company,'22220000-0000-4000-8000-000000000002','44440000-0000-4000-8000-000000000006',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007'),'Amit Verma','partial','Attended day 1 only; production escalation on day 2.','2026-05-20',TIMESTAMP '2026-05-20 09:30:00',TIMESTAMP '2026-05-20 09:30:00'),
  (:company,'22220000-0000-4000-8000-000000000004','44440000-0000-4000-8000-000000000008',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0013'),'Mohan Das','present',NULL,'2026-08-24',TIMESTAMP '2026-08-24 09:30:00',TIMESTAMP '2026-08-24 09:30:00');

-- ---------------------------------------------------------------------------
-- hr_training_budgets
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_budgets
  ("companyId","budgetCode","budgetType","departmentId","departmentName","fiscalYear","periodType",
   "periodStart","periodEnd","allocatedAmount","utilizedAmount","remainingAmount","reservedAmount",
   breakdown,status,"approvedBy","approvedAt",notes,"isActive","createdAt","updatedAt")
VALUES
  (:company,'DEMO-TB-2627-PROD','department',(SELECT id::text FROM hr_departments WHERE name='Production'),'Production','2026-27','annual',TIMESTAMP '2026-04-01 00:00:00',TIMESTAMP '2027-03-31 23:59:59',450000,213000,222000,15000,'{"technical":300000,"safety":100000,"behavioural":50000}','active','Priya Sharma',TIMESTAMP '2026-03-28 11:00:00','Welding certification and CNC batches are the priority lines.',true,TIMESTAMP '2026-03-28 11:00:00',TIMESTAMP '2026-08-30 11:00:00'),
  (:company,'DEMO-TB-2627-QC','department',(SELECT id::text FROM hr_departments WHERE name='Quality Control'),'Quality Control','2026-27','annual',TIMESTAMP '2026-04-01 00:00:00',TIMESTAMP '2027-03-31 23:59:59',180000,62000,118000,0,'{"quality":120000,"technical":40000,"behavioural":20000}','active','Priya Sharma',TIMESTAMP '2026-03-28 11:00:00',NULL,true,TIMESTAMP '2026-03-28 11:00:00',TIMESTAMP '2026-08-30 11:00:00'),
  (:company,'DEMO-TB-2627-DISP','department',(SELECT id::text FROM hr_departments WHERE name='Dispatch & Logistics'),'Dispatch & Logistics','2026-27','annual',TIMESTAMP '2026-04-01 00:00:00',TIMESTAMP '2027-03-31 23:59:59',120000,20000,90000,10000,'{"technical":80000,"safety":40000}','active','Priya Sharma',TIMESTAMP '2026-03-28 11:00:00','Reservation held for Sep install & commissioning batch.',true,TIMESTAMP '2026-03-28 11:00:00',TIMESTAMP '2026-08-30 11:00:00'),
  (:company,'DEMO-TB-2627-HR','department',(SELECT id::text FROM hr_departments WHERE name='Human Resources'),'Human Resources','2026-27','annual',TIMESTAMP '2026-04-01 00:00:00',TIMESTAMP '2027-03-31 23:59:59',90000,28000,62000,0,'{"behavioural":60000,"compliance":30000}','active','Priya Sharma',TIMESTAMP '2026-03-28 11:00:00',NULL,true,TIMESTAMP '2026-03-28 11:00:00',TIMESTAMP '2026-08-30 11:00:00'),
  (:company,'DEMO-TB-2627-IT','department',(SELECT id::text FROM hr_departments WHERE name='Information Technology'),'Information Technology','2026-27','annual',TIMESTAMP '2026-04-01 00:00:00',TIMESTAMP '2027-03-31 23:59:59',150000,45000,105000,0,'{"technical":120000,"security":30000}','active','Priya Sharma',TIMESTAMP '2026-03-28 11:00:00',NULL,true,TIMESTAMP '2026-03-28 11:00:00',TIMESTAMP '2026-08-30 11:00:00'),
  (:company,'DEMO-TB-2627-LEAD','company',NULL,'All Departments','2026-27','annual',TIMESTAMP '2026-04-01 00:00:00',TIMESTAMP '2027-03-31 23:59:59',200000,55000,136000,9000,'{"leadership":150000,"lean":50000}','active','Rajesh Kumar',TIMESTAMP '2026-03-28 11:00:00','Company-wide leadership and 5S/Kaizen pool.',true,TIMESTAMP '2026-03-28 11:00:00',TIMESTAMP '2026-08-30 11:00:00');

-- ---------------------------------------------------------------------------
-- hr_training_feedback
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_feedback
  ("companyId","scheduleId","programId","enrollmentId","employeeId","employeeName",
   rating,"contentRating","instructorRating","relevanceRating","paceRating",
   comments,strengths,improvements,"isAnonymous","wouldRecommend","createdAt","updatedAt")
VALUES
  (:company,'22220000-0000-4000-8000-000000000001','11110000-0000-4000-8000-000000000001','44440000-0000-4000-8000-000000000001',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'Deepak Joshi',5,5,5,5,4,'Best welding course I have attended; the SS 316 distortion-control module was directly usable on the sink line.','Hands-on booth time, real job coupons','More time on orbital welding demo',false,true,TIMESTAMP '2026-06-13 10:00:00',TIMESTAMP '2026-06-13 10:00:00'),
  (:company,'22220000-0000-4000-8000-000000000001','11110000-0000-4000-8000-000000000001','44440000-0000-4000-8000-000000000003',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008'),'Kiran Reddy',4,4,5,4,4,'Good refresher; certification test was rigorous.','Excellent instructor, clear WPS walkthroughs','Course notes could be bilingual',false,true,TIMESTAMP '2026-06-13 10:30:00',TIMESTAMP '2026-06-13 10:30:00'),
  (:company,'22220000-0000-4000-8000-000000000002','11110000-0000-4000-8000-000000000002','44440000-0000-4000-8000-000000000005',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'Ajay Pillai',5,5,4,5,5,'Passivation test demo cleared up a lot of rework questions from the counter-top line.','Very relevant to daily QC checks','Add a customer-audit mock round',false,true,TIMESTAMP '2026-05-21 10:00:00',TIMESTAMP '2026-05-21 10:00:00'),
  (:company,'22220000-0000-4000-8000-000000000003','11110000-0000-4000-8000-000000000003','44440000-0000-4000-8000-000000000007',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon',4,4,4,5,3,'Press brake programming section was slightly rushed for beginners.','Live machine practice from day one','Slow down the bend-allowance math module',false,true,TIMESTAMP '2026-07-18 10:00:00',TIMESTAMP '2026-07-18 10:00:00'),
  (:company,'22220000-0000-4000-8000-000000000004','11110000-0000-4000-8000-000000000004',NULL,NULL,NULL,4,4,4,4,4,'Good energy; would like follow-up gemba audits to keep momentum.','Practical red-tag exercise on our own bays','Monthly follow-up audits',true,true,TIMESTAMP '2026-08-26 10:00:00',TIMESTAMP '2026-08-26 10:00:00');

-- ---------------------------------------------------------------------------
-- hr_training_assessments (fixed ids — referenced by attempts)
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_assessments
  (id,"companyId","programId","scheduleId",title,"assessmentType",description,"totalMarks","passingMarks",
   "durationMinutes","attemptsAllowed",questions,"isActive","createdAt","updatedAt")
VALUES
  ('33330000-0000-4000-8000-000000000001',:company,'11110000-0000-4000-8000-000000000001','22220000-0000-4000-8000-000000000001','Welding certification — theory & WPS test','exam','Theory paper covering SS metallurgy, WPS parameters, defects and safety.',100,70,90,2,'[{"q":"Recommended shielding gas for TIG on SS 304?","type":"mcq","marks":5},{"q":"Name three causes of weld distortion in thin SS sheet.","type":"short","marks":10},{"q":"Max interpass temperature for SS 316 food-contact welds?","type":"mcq","marks":5}]',true,TIMESTAMP '2026-06-01 09:00:00',TIMESTAMP '2026-06-01 09:00:00'),
  ('33330000-0000-4000-8000-000000000002',:company,'11110000-0000-4000-8000-000000000002','22220000-0000-4000-8000-000000000002','Hygienic design & finishing quiz','quiz','Short quiz on surface roughness limits, passivation and hygienic design rules.',50,35,30,3,'[{"q":"Target Ra value for food-contact SS surfaces?","type":"mcq","marks":5},{"q":"Purpose of passivation after welding?","type":"short","marks":10}]',true,TIMESTAMP '2026-05-15 09:00:00',TIMESTAMP '2026-05-15 09:00:00'),
  ('33330000-0000-4000-8000-000000000003',:company,'11110000-0000-4000-8000-000000000003','22220000-0000-4000-8000-000000000003','Press brake operations practical','practical','Scored practical: program, set up and bend a 4-bend SS enclosure within tolerance.',100,60,120,1,'[{"q":"Bend a 1.5 mm SS 304 enclosure to drawing D-2214 within +/-0.5 mm","type":"practical","marks":100}]',true,TIMESTAMP '2026-07-10 09:00:00',TIMESTAMP '2026-07-10 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_training_assessment_attempts
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_assessment_attempts
  ("companyId","assessmentId","enrollmentId","employeeId","employeeName","attemptNumber",
   "startTime","endTime",status,answers,"totalMarks","obtainedMarks",percentage,"isPassed","createdAt","updatedAt")
VALUES
  (:company,'33330000-0000-4000-8000-000000000001','44440000-0000-4000-8000-000000000001',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009'),'Deepak Joshi',1,TIMESTAMP '2026-06-12 10:00:00',TIMESTAMP '2026-06-12 11:20:00','completed','[{"q":1,"answer":"Argon"},{"q":2,"answer":"Excess heat input, poor clamping, no back-step sequence"}]',100,88,88.0,true,TIMESTAMP '2026-06-12 11:20:00',TIMESTAMP '2026-06-12 11:20:00'),
  (:company,'33330000-0000-4000-8000-000000000001','44440000-0000-4000-8000-000000000002',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon',1,TIMESTAMP '2026-06-12 10:00:00',TIMESTAMP '2026-06-12 11:25:00','completed','[{"q":1,"answer":"CO2"},{"q":2,"answer":"Heat, clamping"}]',100,64,64.0,false,TIMESTAMP '2026-06-12 11:25:00',TIMESTAMP '2026-06-12 11:25:00'),
  (:company,'33330000-0000-4000-8000-000000000001','44440000-0000-4000-8000-000000000002',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon',2,TIMESTAMP '2026-06-19 10:00:00',TIMESTAMP '2026-06-19 11:10:00','completed','[{"q":1,"answer":"Argon"},{"q":2,"answer":"Excess heat input, poor fixturing, wrong sequence"}]',100,76,76.0,true,TIMESTAMP '2026-06-19 11:10:00',TIMESTAMP '2026-06-19 11:10:00'),
  (:company,'33330000-0000-4000-8000-000000000002','44440000-0000-4000-8000-000000000005',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'Ajay Pillai',1,TIMESTAMP '2026-05-20 15:00:00',TIMESTAMP '2026-05-20 15:25:00','completed','[{"q":1,"answer":"0.8 micron"},{"q":2,"answer":"Restores chromium-oxide passive layer removed by welding heat"}]',50,46,92.0,true,TIMESTAMP '2026-05-20 15:25:00',TIMESTAMP '2026-05-20 15:25:00'),
  (:company,'33330000-0000-4000-8000-000000000003','44440000-0000-4000-8000-000000000007',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010'),'Ravi Menon',1,TIMESTAMP '2026-07-17 09:00:00',TIMESTAMP '2026-07-17 10:45:00','completed','[{"q":1,"answer":"Enclosure within tolerance on 3 of 4 bends; one bend re-struck"}]',100,72,72.0,true,TIMESTAMP '2026-07-17 10:45:00',TIMESTAMP '2026-07-17 10:45:00');

-- ---------------------------------------------------------------------------
-- hr_training_waitlist
-- ---------------------------------------------------------------------------
INSERT INTO hr_training_waitlist
  ("companyId","programId","scheduleId","employeeId","employeeName",position,status,"notifiedAt","createdAt","updatedAt")
VALUES
  (:company,'11110000-0000-4000-8000-000000000005','22220000-0000-4000-8000-000000000005',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0013'),'Mohan Das',1,'notified',TIMESTAMP '2026-09-05 10:00:00',TIMESTAMP '2026-09-02 10:00:00',TIMESTAMP '2026-09-05 10:00:00'),
  (:company,'11110000-0000-4000-8000-000000000005','22220000-0000-4000-8000-000000000005',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0014'),'Lakshmi Iyer',2,'waiting',NULL,TIMESTAMP '2026-09-03 10:00:00',TIMESTAMP '2026-09-03 10:00:00'),
  (:company,'11110000-0000-4000-8000-000000000006','22220000-0000-4000-8000-000000000006',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012'),'Ajay Pillai',1,'waiting',NULL,TIMESTAMP '2026-09-06 10:00:00',TIMESTAMP '2026-09-06 10:00:00'),
  (:company,'11110000-0000-4000-8000-000000000006','22220000-0000-4000-8000-000000000006',(SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0016'),'Neha Agarwal',2,'waiting',NULL,TIMESTAMP '2026-09-08 10:00:00',TIMESTAMP '2026-09-08 10:00:00');

-- ---------------------------------------------------------------------------
-- hr_travel_requests
-- ---------------------------------------------------------------------------
INSERT INTO hr_travel_requests
  ("companyId","requestNumber","employeeCode","employeeName",department,designation,"travelType",purpose,
   "fromLocation","toLocation","startDate","endDate",duration,"estimatedCost","totalCost","advanceAmount",
   "expensesClaimed",status,"submittedDate",approver,"approvedDate","rejectionReason","createdAt","updatedAt")
VALUES
  (:company,'DEMO-TRV-2025-001','EMP0020','Ganesh Patil','Dispatch & Logistics','Executive','domestic','Installation & commissioning of banquet kitchen line at Grand Hyatt Kochi.','Kochi','Kochi (site)','2025-11-10','2025-11-14',5,18000,17250,10000,17250,'settled','2025-11-03','Priya Sharma','2025-11-04',NULL,TIMESTAMP '2025-11-03 10:00:00',TIMESTAMP '2025-11-25 10:00:00'),
  (:company,'DEMO-TRV-2026-002','EMP0017','Sanjay Malhotra','Sales & Marketing','Assistant General Manager','domestic','AAHAR International Food & Hospitality Fair — booth duty and dealer meets.','Kochi','New Delhi','2026-03-03','2026-03-07',5,85000,91200,50000,91200,'settled','2026-02-16','Priya Sharma','2026-02-18',NULL,TIMESTAMP '2026-02-16 10:00:00',TIMESTAMP '2026-03-20 10:00:00'),
  (:company,'DEMO-TRV-2026-003','EMP0018','Pooja Mehta','Sales & Marketing','Executive','domestic','Customer kitchen audits at three cloud-kitchen sites in Bengaluru.','Kochi','Bengaluru','2026-04-14','2026-04-16',3,26000,24800,15000,24800,'settled','2026-04-06','Sanjay Malhotra','2026-04-07',NULL,TIMESTAMP '2026-04-06 10:00:00',TIMESTAMP '2026-04-28 10:00:00'),
  (:company,'DEMO-TRV-2026-004','EMP0007','Amit Verma','Production','General Manager','domestic','Vendor audit — SS sheet supplier and polishing consumables vendor, Coimbatore.','Kochi','Coimbatore','2026-05-21','2026-05-22',2,14000,13100,8000,13100,'settled','2026-05-12','Priya Sharma','2026-05-13',NULL,TIMESTAMP '2026-05-12 10:00:00',TIMESTAMP '2026-06-02 10:00:00'),
  (:company,'DEMO-TRV-2026-005','EMP0019','Ramesh Yadav','Maintenance','Assistant Manager','domestic','OEM training on laser-cutter preventive maintenance at supplier works, Pune.','Kochi','Pune','2026-06-15','2026-06-18',4,32000,NULL,20000,NULL,'approved','2026-06-05','Amit Verma','2026-06-06',NULL,TIMESTAMP '2026-06-05 10:00:00',TIMESTAMP '2026-06-06 10:00:00'),
  (:company,'DEMO-TRV-2026-006','EMP0020','Ganesh Patil','Dispatch & Logistics','Executive','domestic','Site survey and installation of cook line for Campus Dining project, Manipal.','Kochi','Manipal','2026-08-24','2026-08-27',4,22000,NULL,12000,NULL,'in_progress','2026-08-14','Priya Sharma','2026-08-16',NULL,TIMESTAMP '2026-08-14 10:00:00',TIMESTAMP '2026-08-24 10:00:00'),
  (:company,'DEMO-TRV-2026-007','EMP0016','Neha Agarwal','Information Technology','Senior Executive','domestic','ERP go-live support workshop with implementation partner, Chennai.','Kochi','Chennai','2026-09-16','2026-09-17',2,15000,NULL,NULL,NULL,'pending','2026-09-08',NULL,NULL,NULL,TIMESTAMP '2026-09-08 10:00:00',TIMESTAMP '2026-09-08 10:00:00'),
  (:company,'DEMO-TRV-2026-008','EMP0018','Pooja Mehta','Sales & Marketing','Executive','domestic','Weekend expo booth at hotel investment summit, Goa.','Kochi','Goa','2026-07-11','2026-07-12',2,28000,NULL,NULL,NULL,'rejected','2026-06-29','Sanjay Malhotra','2026-06-30','Covered by regional dealer; attendance not required.',TIMESTAMP '2026-06-29 10:00:00',TIMESTAMP '2026-06-30 10:00:00');

-- ---------------------------------------------------------------------------
-- hr_travel_advances
-- ---------------------------------------------------------------------------
INSERT INTO hr_travel_advances
  ("companyId","advanceNumber","employeeName",department,"tripNumber",destination,"travelDates",
   "advanceAmount","requestedDate",purpose,status,approver,"approvedDate","disbursedDate","settledDate",
   "expensesSubmitted","balanceAmount","createdAt","updatedAt")
VALUES
  (:company,'DEMO-ADV-2025-001','Ganesh Patil','Dispatch & Logistics','DEMO-TRV-2025-001','Kochi (site)','2025-11-10 to 2025-11-14',10000,'2025-11-04','Site expenses for Grand Hyatt banquet kitchen installation.','settled','Priya Sharma','2025-11-04','2025-11-06','2025-11-25',17250,-7250,TIMESTAMP '2025-11-04 10:00:00',TIMESTAMP '2025-11-25 10:00:00'),
  (:company,'DEMO-ADV-2026-002','Sanjay Malhotra','Sales & Marketing','DEMO-TRV-2026-002','New Delhi','2026-03-03 to 2026-03-07',50000,'2026-02-18','AAHAR fair travel, stay and booth incidentals.','settled','Priya Sharma','2026-02-18','2026-02-25','2026-03-20',91200,-41200,TIMESTAMP '2026-02-18 10:00:00',TIMESTAMP '2026-03-20 10:00:00'),
  (:company,'DEMO-ADV-2026-003','Pooja Mehta','Sales & Marketing','DEMO-TRV-2026-003','Bengaluru','2026-04-14 to 2026-04-16',15000,'2026-04-07','Customer kitchen audit travel advance.','settled','Sanjay Malhotra','2026-04-07','2026-04-10','2026-04-28',24800,-9800,TIMESTAMP '2026-04-07 10:00:00',TIMESTAMP '2026-04-28 10:00:00'),
  (:company,'DEMO-ADV-2026-004','Ramesh Yadav','Maintenance','DEMO-TRV-2026-005','Pune','2026-06-15 to 2026-06-18',20000,'2026-06-06','OEM maintenance training travel advance.','disbursed','Amit Verma','2026-06-06','2026-06-10',NULL,NULL,20000,TIMESTAMP '2026-06-06 10:00:00',TIMESTAMP '2026-06-10 10:00:00'),
  (:company,'DEMO-ADV-2026-005','Ganesh Patil','Dispatch & Logistics','DEMO-TRV-2026-006','Manipal','2026-08-24 to 2026-08-27',12000,'2026-08-16','Campus Dining cook-line installation advance.','disbursed','Priya Sharma','2026-08-16','2026-08-20',NULL,NULL,12000,TIMESTAMP '2026-08-16 10:00:00',TIMESTAMP '2026-08-20 10:00:00');

-- ---------------------------------------------------------------------------
-- hr_user_skills — employee/skill/proficiency masters joined by code
-- ---------------------------------------------------------------------------
INSERT INTO hr_user_skills
  ("employeeId","skillId","proficiencyLevelId","proficiencyLevel","yearsOfExperience","lastAssessmentDate",
   status,"verifiedByName","verifiedAt","createdBy","createdAt","updatedAt")
SELECT
  e.id, s.id, pl.id::text, v.level_num, v.years, v.assessed::date,
  v.status::hr_user_skills_status_enum, v.verifier, v.verified::date,
  'demo-seed', (v.assessed||' 10:00:00')::timestamp, (v.assessed||' 10:00:00')::timestamp
FROM (VALUES
  ('EMP0015','ai-automation','EXPERT',4,6.0,'2026-05-18','Verified','Priya Sharma','2026-05-20'),
  ('EMP0015','backend-engineer','EXPERT',4,10.0,'2026-05-18','Verified','Priya Sharma','2026-05-20'),
  ('EMP0016','backend-engineer','INTERMEDIATE',2,3.5,'2026-05-18','Verified','Arun Gupta','2026-05-20'),
  ('EMP0016','developer-guidelines','INTERMEDIATE',2,3.0,'2026-05-18','Active',NULL,NULL),
  ('EMP0011','quality-assurance-engineer','ADVANCED',3,9.0,'2026-06-02','Verified','Priya Sharma','2026-06-04'),
  ('EMP0012','quality-assurance-engineer','INTERMEDIATE',2,4.0,'2026-06-02','Verified','Sunita Rao','2026-06-04'),
  ('EMP0007','workflow-manager','ADVANCED',3,8.0,'2026-06-15','Verified','Priya Sharma','2026-06-17'),
  ('EMP0003','platform-capabilities','BEGINNER',1,1.0,'2026-08-10','Active',NULL,NULL),
  ('EMP0017','business-ops-marketing-manager','INTERMEDIATE',2,7.0,'2026-07-06','Verified','Priya Sharma','2026-07-08'),
  ('EMP0018','linkedin-expert','BEGINNER',1,1.5,'2026-09-07','Pending Verification',NULL,NULL),
  ('EMP0002','kreupai-solution-architect','ADVANCED',3,12.0,'2026-04-20','Verified','Rajesh Kumar','2026-04-22'),
  ('EMP0004','facility-management-expert','INTERMEDIATE',2,3.0,'2026-07-22','Active',NULL,NULL)
) AS v(emp_code, skill_code, prof_code, level_num, years, assessed, status, verifier, verified)
JOIN hr_employees e ON e."employeeCode" = v.emp_code
JOIN hr_skills s ON s.code = v.skill_code
JOIN hr_proficiency_levels pl ON pl.code = v.prof_code;

-- ---------------------------------------------------------------------------
-- hr_vehicles (children reference vehicleNumber / registrationNumber strings)
-- ---------------------------------------------------------------------------
INSERT INTO hr_vehicles
  ("companyId","vehicleNumber","vehicleType",make,model,year,"purchaseDate","purchaseCost","registrationNumber",
   "insuranceExpiry","pucExpiry","fitnessExpiry","currentOdometer","fuelType",status,"assignedTo",location,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-VEH-001','pickup','Mahindra','Bolero Pik-Up 1.7T',2023,'2023-06-12',985000,'KL-07-CN-4521','2027-06-11','2026-12-10','2028-06-11',48250,'diesel','assigned','Ganesh Patil','Dispatch Yard',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-09-01 09:00:00'),
  (:company,'DEMO-VEH-002','mini_truck','Tata','Ace Gold',2022,'2022-02-18',652000,'KL-07-BQ-8874','2027-02-17','2026-10-05','2027-02-17',71430,'diesel','assigned','Mohan Das','Stores Bay',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-09-01 09:00:00'),
  (:company,'DEMO-VEH-003','truck','Ashok Leyland','Dost+ LS',2024,'2024-01-25',1240000,'KL-07-CT-1198','2027-01-24','2026-11-20','2029-01-24',29870,'diesel','available',NULL,'Dispatch Yard',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-09-01 09:00:00'),
  (:company,'DEMO-VEH-004','forklift','Godrej','GX 300 (3T)',2021,'2021-09-30',1450000,'N/A - plant equipment','2026-09-29',NULL,'2027-09-29',6120,'diesel','available',NULL,'Stores & Dispatch Yard',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-09-01 09:00:00'),
  (:company,'DEMO-VEH-005','van','Maruti Suzuki','Eeco Cargo',2023,'2023-11-08',565000,'KL-07-CR-3306','2026-11-07','2026-09-30','2028-11-07',33540,'petrol','assigned','Ramesh Yadav','Maintenance Workshop',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-09-01 09:00:00'),
  (:company,'DEMO-VEH-006','car','Maruti Suzuki','Ertiga ZXi',2024,'2024-05-14',1195000,'KL-07-CU-7742','2027-05-13','2027-05-13','2039-05-13',18960,'petrol','maintenance',NULL,'Service Center - Popular Motors',TIMESTAMP '2025-10-01 09:00:00',TIMESTAMP '2026-09-05 09:00:00');

-- ---------------------------------------------------------------------------
-- hr_vehicle_assignments
-- ---------------------------------------------------------------------------
INSERT INTO hr_vehicle_assignments
  ("companyId","assignmentId","vehicleNumber","vehicleName","registrationNumber","assignedTo","employeeCode",
   department,designation,"assignmentDate","returnDate",purpose,status,"odometerReadingStart","odometerReadingEnd",
   location,remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-VAS-001','DEMO-VEH-001','Mahindra Bolero Pik-Up','KL-07-CN-4521','Ganesh Patil','EMP0020','Dispatch & Logistics','Executive','2026-04-01',NULL,'Daily delivery runs and installation-crew transport.','active',41200,NULL,'Dispatch Yard',NULL,TIMESTAMP '2026-04-01 09:00:00',TIMESTAMP '2026-04-01 09:00:00'),
  (:company,'DEMO-VAS-002','DEMO-VEH-002','Tata Ace Gold','KL-07-BQ-8874','Mohan Das','EMP0013','Stores & Inventory','Assistant Manager','2026-04-01',NULL,'Local raw-material pickup — SS sheets, fittings and consumables.','active',65100,NULL,'Stores Bay',NULL,TIMESTAMP '2026-04-01 09:00:00',TIMESTAMP '2026-04-01 09:00:00'),
  (:company,'DEMO-VAS-003','DEMO-VEH-005','Maruti Eeco Cargo','KL-07-CR-3306','Ramesh Yadav','EMP0019','Maintenance','Assistant Manager','2026-06-10',NULL,'AMC site visits and spares runs for installed equipment.','active',30800,NULL,'Maintenance Workshop',NULL,TIMESTAMP '2026-06-10 09:00:00',TIMESTAMP '2026-06-10 09:00:00'),
  (:company,'DEMO-VAS-004','DEMO-VEH-003','Ashok Leyland Dost+','KL-07-CT-1198','Ganesh Patil','EMP0020','Dispatch & Logistics','Executive','2026-08-24','2026-08-28','Manipal cook-line delivery and installation trip.','completed',28900,29870,'Manipal','Returned after Campus Dining installation.',TIMESTAMP '2026-08-24 09:00:00',TIMESTAMP '2026-08-28 18:00:00'),
  (:company,'DEMO-VAS-005','DEMO-VEH-006','Maruti Ertiga','KL-07-CU-7742','Sanjay Malhotra','EMP0017','Sales & Marketing','Assistant General Manager','2026-05-01','2026-09-04','Customer visits and dealer meets in Kerala region.','completed',15200,18960,'Head Office','Returned for scheduled service; will re-assign after maintenance.',TIMESTAMP '2026-05-01 09:00:00',TIMESTAMP '2026-09-04 18:00:00');

-- ---------------------------------------------------------------------------
-- hr_vehicle_fuel
-- ---------------------------------------------------------------------------
INSERT INTO hr_vehicle_fuel
  ("companyId","recordId","vehicleNumber","vehicleName","registrationNumber","fuelDate","fuelType",
   quantity,"pricePerLiter","totalCost",odometer,"fuelStation","billNumber","filledBy",location,remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-FUEL-001','DEMO-VEH-001','Mahindra Bolero Pik-Up','KL-07-CN-4521','2026-06-04','diesel',38.50,92.40,3557.40,44980,'IOCL Kalamassery','F-88214','Ganesh Patil','Kalamassery',NULL,TIMESTAMP '2026-06-04 18:00:00',TIMESTAMP '2026-06-04 18:00:00'),
  (:company,'DEMO-FUEL-002','DEMO-VEH-001','Mahindra Bolero Pik-Up','KL-07-CN-4521','2026-07-18','diesel',40.00,92.85,3714.00,46610,'IOCL Kalamassery','F-90152','Ganesh Patil','Kalamassery',NULL,TIMESTAMP '2026-07-18 18:00:00',TIMESTAMP '2026-07-18 18:00:00'),
  (:company,'DEMO-FUEL-003','DEMO-VEH-001','Mahindra Bolero Pik-Up','KL-07-CN-4521','2026-08-29','diesel',41.20,93.10,3835.72,48250,'HPCL Edappally','H-33471','Ganesh Patil','Edappally','Filled before Manipal trip support runs.',TIMESTAMP '2026-08-29 18:00:00',TIMESTAMP '2026-08-29 18:00:00'),
  (:company,'DEMO-FUEL-004','DEMO-VEH-002','Tata Ace Gold','KL-07-BQ-8874','2026-07-02','diesel',30.00,92.85,2785.50,69480,'IOCL Kalamassery','F-89310','Mohan Das','Kalamassery',NULL,TIMESTAMP '2026-07-02 18:00:00',TIMESTAMP '2026-07-02 18:00:00'),
  (:company,'DEMO-FUEL-005','DEMO-VEH-002','Tata Ace Gold','KL-07-BQ-8874','2026-08-21','diesel',32.40,93.10,3016.44,71430,'IOCL Kalamassery','F-91587','Mohan Das','Kalamassery',NULL,TIMESTAMP '2026-08-21 18:00:00',TIMESTAMP '2026-08-21 18:00:00'),
  (:company,'DEMO-FUEL-006','DEMO-VEH-003','Ashok Leyland Dost+','KL-07-CT-1198','2026-08-24','diesel',45.00,93.10,4189.50,28950,'BPCL Aluva','B-55190','Ganesh Patil','Aluva','Long-haul fill for Manipal delivery.',TIMESTAMP '2026-08-24 18:00:00',TIMESTAMP '2026-08-24 18:00:00'),
  (:company,'DEMO-FUEL-007','DEMO-VEH-005','Maruti Eeco Cargo','KL-07-CR-3306','2026-08-11','petrol',28.00,105.60,2956.80,32890,'HPCL Edappally','H-32988','Ramesh Yadav','Edappally',NULL,TIMESTAMP '2026-08-11 18:00:00',TIMESTAMP '2026-08-11 18:00:00'),
  (:company,'DEMO-FUEL-008','DEMO-VEH-004','Godrej GX 300 Forklift','N/A - plant equipment','2026-09-01','diesel',25.00,93.10,2327.50,6120,'Bulk barrel - plant store','PLANT-0926','Ramesh Yadav','Factory','Monthly forklift top-up from plant diesel barrel.',TIMESTAMP '2026-09-01 18:00:00',TIMESTAMP '2026-09-01 18:00:00');
