-- Demo seed — HR batch B (leave, payroll, performance, policies, safety) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first, then re-inserts.
-- Delete predicates:
--   * companyId tables            -> "companyId" = :company
--   * hr_leave_applications       -> "applicationNumber" LIKE 'DEMO-%'
--   * hr_leave_balances           -> "createdBy" = 'demo-seed'
--   * hr_payrolls                 -> "payrollNumber" LIKE 'DEMO-%' (child hr_salary_slips guarded first)
--   * hr_performance_reviews      -> "reviewNumber" LIKE 'DEMO-%'
--   * hr_recognition_comments     -> "recognitionId" IN (fixed demo recognition UUIDs)
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================ CLEANUP
DELETE FROM hr_recognition_comments WHERE "recognitionId" IN
  ('d1ec0000-0000-4000-8000-000000000001','d1ec0000-0000-4000-8000-000000000002','d1ec0000-0000-4000-8000-000000000003');
DELETE FROM hr_recognitions WHERE "companyId" = :company;
DELETE FROM hr_kpi_assignments WHERE "companyId" = :company;
DELETE FROM hr_kpi_master WHERE "companyId" = :company;
DELETE FROM hr_leave_encashments WHERE "companyId" = :company;
DELETE FROM hr_offboarding_tasks WHERE "companyId" = :company;
DELETE FROM hr_onboarding_tasks WHERE "companyId" = :company;
DELETE FROM hr_overtime_requests WHERE "companyId" = :company;
DELETE FROM hr_payroll_bonus_records WHERE "companyId" = :company;
DELETE FROM hr_payroll_bonus_schemes WHERE "companyId" = :company;
DELETE FROM hr_payroll_calendar_events WHERE "companyId" = :company;
DELETE FROM hr_payroll_disbursements WHERE "companyId" = :company;
DELETE FROM hr_payroll_loan_recoveries WHERE "companyId" = :company;
DELETE FROM hr_payroll_reports WHERE "companyId" = :company;
DELETE FROM hr_payroll_salary_revisions WHERE "companyId" = :company;
DELETE FROM hr_payroll_statutory_filings WHERE "companyId" = :company;
DELETE FROM hr_payroll_tax_records WHERE "companyId" = :company;
DELETE FROM hr_per_diem_rates WHERE "companyId" = :company;
DELETE FROM hr_performance_goals WHERE "companyId" = :company;
DELETE FROM hr_performance_pips WHERE "companyId" = :company;
DELETE FROM hr_performance_review_cycles WHERE "companyId" = :company;
DELETE FROM hr_policies WHERE "companyId" = :company;
DELETE FROM hr_policy_acknowledgments WHERE "companyId" = :company;
DELETE FROM hr_policy_violations WHERE "companyId" = :company;
DELETE FROM hr_posh_complaints WHERE "companyId" = :company;
DELETE FROM hr_preventive_maintenance WHERE "companyId" = :company;
DELETE FROM hr_probation_reviews WHERE "companyId" = :company;
DELETE FROM hr_remediation_plans WHERE "companyId" = :company;
DELETE FROM hr_review_meetings WHERE "companyId" = :company;
DELETE FROM hr_safety_drills WHERE "companyId" = :company;
DELETE FROM hr_safety_hazards WHERE "companyId" = :company;
DELETE FROM hr_leave_applications WHERE "applicationNumber" LIKE 'DEMO-%';
DELETE FROM hr_leave_balances WHERE "createdBy" = 'demo-seed';
DELETE FROM hr_performance_reviews WHERE "reviewNumber" LIKE 'DEMO-%';
-- guard: hr_salary_slips FK-references hr_payrolls; clear any children of demo payrolls first
DELETE FROM hr_salary_slips WHERE "payrollId" IN (SELECT id FROM hr_payrolls WHERE "payrollNumber" LIKE 'DEMO-%');
DELETE FROM hr_payrolls WHERE "payrollNumber" LIKE 'DEMO-%';

-- ============================================================ KPI MASTER (fixed ids: referenced by hr_kpi_assignments)
INSERT INTO hr_kpi_master
  (id,"kpiCode","kpiName",description,category,"kpiType","measurementUnit","measurementFrequency","targetType",
   "defaultTarget","minValue","maxValue","dataSource","applicableTo","applicableDepartments","companyId","isActive","createdAt","updatedAt")
VALUES
  ('d1a00000-0000-4000-8000-000000000001','DEMO-KPI-001','Production Output Efficiency','Actual vs planned fabrication output for kitchen equipment lines','production','quantitative','%','monthly','higher_better',92,0,100,'MES production log','{Employee,Department}','{Production}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000002','DEMO-KPI-002','First Pass Yield','Units passing QC without rework (SS fabrication + assembly)','quality','quantitative','%','monthly','higher_better',95,0,100,'QC inspection records','{Employee,Department}','{"Quality Control",Production}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000003','DEMO-KPI-003','On-Time Delivery','Orders dispatched on or before committed date','delivery','quantitative','%','monthly','higher_better',95,0,100,'Dispatch register','{Department}','{"Dispatch & Logistics"}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000004','DEMO-KPI-004','Sales Order Conversion','Quotations converted to confirmed orders','sales','quantitative','%','monthly','higher_better',25,0,100,'CRM pipeline','{Employee}','{"Sales & Marketing"}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000005','DEMO-KPI-005','Complaint Resolution TAT','Average days to close customer complaints','quality','quantitative','days','monthly','lower_better',3,0,30,'Support tickets','{Employee,Department}','{"Quality Control","Sales & Marketing"}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000006','DEMO-KPI-006','Machine Downtime Hours','Unplanned downtime across CNC, press brake and welding bays','maintenance','quantitative','hours','monthly','lower_better',20,0,200,'CMMS log','{Department}','{Maintenance}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000007','DEMO-KPI-007','Inventory Accuracy','Cycle-count accuracy of SS sheets, motors and bought-outs','stores','quantitative','%','quarterly','higher_better',98,0,100,'WMS cycle counts','{Department}','{"Stores & Inventory"}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000008','DEMO-KPI-008','Days Sales Outstanding','Average receivable collection days','finance','quantitative','days','monthly','lower_better',45,0,180,'AR ageing','{Department}','{"Finance & Accounts"}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000009','DEMO-KPI-009','Employee Attrition Rate','Annualised voluntary attrition','hr','quantitative','%','quarterly','lower_better',10,0,100,'HRMS','{Department}','{"Human Resources"}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('d1a00000-0000-4000-8000-000000000010','DEMO-KPI-010','Safety Incident Count','Recordable incidents on the shop floor','safety','quantitative','count','monthly','lower_better',0,0,50,'EHS register','{Department}','{Production,Maintenance}',:company,true,'2025-10-01 09:00:00','2025-10-01 09:00:00');

-- ============================================================ KPI ASSIGNMENTS
INSERT INTO hr_kpi_assignments
  ("companyId","kpiMasterId","employeeId","employeeName",title,description,target,weightage,period,"dueDate",status,"createdAt","updatedAt")
SELECT :company, v.kpi, e.id::text, e."firstName"||' '||e."lastName", v.title, v.descr, v.target, v.wt, 'FY2025-26', v.due, v.status,
       '2025-10-10 10:00:00'::timestamp, v.upd::timestamp
FROM (VALUES
  ('EMP0007','d1a00000-0000-4000-8000-000000000001','Production Output Efficiency','Hit 92% line efficiency across fabrication bays','92%',30,'2026-03-31','achieved','2026-04-05 11:00:00'),
  ('EMP0008','d1a00000-0000-4000-8000-000000000001','Production Output Efficiency','Shift-level output efficiency','90%',25,'2026-03-31','achieved','2026-04-05 11:00:00'),
  ('EMP0009','d1a00000-0000-4000-8000-000000000002','First Pass Yield','Reduce weld rework on counters and sinks','95%',25,'2026-03-31','in_progress','2026-07-01 09:30:00'),
  ('EMP0011','d1a00000-0000-4000-8000-000000000002','First Pass Yield','FPY across incoming + final inspection','96%',35,'2026-03-31','achieved','2026-04-05 11:00:00'),
  ('EMP0012','d1a00000-0000-4000-8000-000000000005','Complaint Resolution TAT','Close customer complaints within 3 days','3 days',20,'2026-03-31','in_progress','2026-07-01 09:30:00'),
  ('EMP0020','d1a00000-0000-4000-8000-000000000003','On-Time Delivery','OTD for project and dealer orders','95%',40,'2026-03-31','in_progress','2026-07-01 09:30:00'),
  ('EMP0017','d1a00000-0000-4000-8000-000000000004','Sales Order Conversion','Quote-to-order conversion, hotels & QSR segment','28%',35,'2026-03-31','achieved','2026-04-05 11:00:00'),
  ('EMP0018','d1a00000-0000-4000-8000-000000000004','Sales Order Conversion','Conversion on inbound leads','22%',30,'2026-03-31','in_progress','2026-07-01 09:30:00'),
  ('EMP0019','d1a00000-0000-4000-8000-000000000006','Machine Downtime Hours','Keep unplanned downtime under 20 hrs/month','< 20 hrs',40,'2026-03-31','achieved','2026-04-05 11:00:00'),
  ('EMP0013','d1a00000-0000-4000-8000-000000000007','Inventory Accuracy','Quarterly cycle-count accuracy','98%',35,'2026-03-31','achieved','2026-04-05 11:00:00'),
  ('EMP0005','d1a00000-0000-4000-8000-000000000008','Days Sales Outstanding','Bring DSO down from 58 to 45 days','45 days',30,'2026-09-30','assigned','2026-04-15 10:00:00'),
  ('EMP0003','d1a00000-0000-4000-8000-000000000009','Employee Attrition Rate','Hold voluntary attrition under 10%','< 10%',25,'2026-09-30','assigned','2026-04-15 10:00:00')
) AS v(emp,kpi,title,descr,target,wt,due,status,upd)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ LEAVE BALANCES (20 employees x CL/SL/EL/WFH/COMP, year 2026)
INSERT INTO hr_leave_balances
  ("employeeId","leaveTypeId",year,"openingBalance",allocated,earned,used,pending,lapsed,"carriedForward",encashed,available,
   "createdBy","createdAt","updatedAt")
SELECT e.id, lt.id, 2026,
  CASE WHEN lt.code = 'EL' THEN mod(rnd.r,6) ELSE 0 END,
  CASE lt.code WHEN 'CL' THEN 12 WHEN 'SL' THEN 12 WHEN 'EL' THEN 15 WHEN 'WFH' THEN 52 ELSE 0 END,
  CASE WHEN lt.code = 'COMP' THEN mod(rnd.r,4) ELSE 0 END,
  CASE lt.code WHEN 'CL' THEN mod(rnd.r,8) WHEN 'SL' THEN mod(rnd.r,6) WHEN 'EL' THEN mod(rnd.r,9)
               WHEN 'WFH' THEN mod(rnd.r,20) ELSE least(mod(rnd.r,4), mod(rnd.r,2)) END,
  CASE WHEN lt.code = 'EL' AND mod(rnd.r,5) = 0 THEN 2 ELSE 0 END,
  0,
  CASE WHEN lt.code = 'EL' THEN mod(rnd.r,6) ELSE 0 END,
  0,
  (CASE WHEN lt.code = 'EL' THEN mod(rnd.r,6) ELSE 0 END)
    + (CASE lt.code WHEN 'CL' THEN 12 WHEN 'SL' THEN 12 WHEN 'EL' THEN 15 WHEN 'WFH' THEN 52 ELSE 0 END)
    + (CASE WHEN lt.code = 'COMP' THEN mod(rnd.r,4) ELSE 0 END)
    - (CASE lt.code WHEN 'CL' THEN mod(rnd.r,8) WHEN 'SL' THEN mod(rnd.r,6) WHEN 'EL' THEN mod(rnd.r,9)
                    WHEN 'WFH' THEN mod(rnd.r,20) ELSE least(mod(rnd.r,4), mod(rnd.r,2)) END)
    - (CASE WHEN lt.code = 'EL' AND mod(rnd.r,5) = 0 THEN 2 ELSE 0 END),
  'demo-seed','2026-01-01 06:00:00','2026-08-31 18:00:00'
FROM hr_employees e
CROSS JOIN hr_leave_types lt
CROSS JOIN LATERAL (SELECT ('x'||substr(md5(e."employeeCode"||lt.code),1,2))::bit(8)::int AS r) rnd
WHERE lt.code IN ('CL','SL','EL','WFH','COMP');

-- ============================================================ LEAVE APPLICATIONS
INSERT INTO hr_leave_applications
  ("applicationNumber","employeeId","leaveTypeId","fromDate","toDate","totalDays",reason,"applicationDate",status,
   "approver1Name","approver1Date","createdBy","createdAt","updatedAt")
SELECT 'DEMO-LA-'||v.n, e.id, lt.id, v.fdate::date, v.tdate::date, v.days, v.reason, v.adate::date,
       v.status::hr_leave_applications_status_enum,
       v.approver,
       CASE WHEN v.status IN ('Approved','Rejected') THEN (v.adate::date + 2)::timestamp ELSE NULL END,
       'demo-seed', (v.adate::date)::timestamp + interval '9 hours', (v.adate::date + 2)::timestamp + interval '11 hours'
FROM (VALUES
  ('0001','EMP0003','CL','2025-10-20','2025-10-21',2,'Family function at native place','2025-10-13','Approved','Rajesh Kumar'),
  ('0002','EMP0007','EL','2025-10-27','2025-10-31',5,'Diwali vacation with family','2025-10-10','Approved','Rajesh Kumar'),
  ('0003','EMP0009','SL','2025-11-05','2025-11-06',2,'Viral fever, doctor advised rest','2025-11-05','Approved','Amit Verma'),
  ('0004','EMP0011','CL','2025-11-14','2025-11-14',1,'Personal work - bank formalities','2025-11-10','Approved','Rajesh Kumar'),
  ('0005','EMP0015','WFH','2025-11-24','2025-11-28',5,'ERP cutover support from home office','2025-11-17','Approved','Rajesh Kumar'),
  ('0006','EMP0004','EL','2025-12-22','2025-12-26',5,'Year-end family trip to Kerala','2025-12-01','Approved','Anita Desai'),
  ('0007','EMP0013','CL','2025-12-29','2025-12-30',2,'House shifting','2025-12-20','Approved','Rajesh Kumar'),
  ('0008','EMP0017','SL','2026-01-08','2026-01-09',2,'Back pain, physiotherapy sessions','2026-01-08','Approved','Rajesh Kumar'),
  ('0009','EMP0002','EL','2026-01-19','2026-01-23',5,'Attending cousin''s wedding in Jaipur','2026-01-05','Approved','Rajesh Kumar'),
  ('0010','EMP0010','COMP','2026-02-02','2026-02-02',1,'Comp-off against Republic Day dispatch support','2026-01-28','Approved','Amit Verma'),
  ('0011','EMP0016','WFH','2026-02-09','2026-02-13',5,'Focused sprint on payroll module rollout','2026-02-02','Approved','Arun Gupta'),
  ('0012','EMP0019','SL','2026-02-18','2026-02-20',3,'Minor hand injury during maintenance work','2026-02-18','Approved','Rajesh Kumar'),
  ('0013','EMP0005','CL','2026-03-06','2026-03-06',1,'Personal errand','2026-03-04','Rejected','Rajesh Kumar'),
  ('0014','EMP0008','EL','2026-03-16','2026-03-20',5,'Village visit for annual temple festival','2026-02-25','Approved','Amit Verma'),
  ('0015','EMP0012','CL','2026-04-10','2026-04-10',1,'Vehicle registration work','2026-04-06','Cancelled','Sunita Rao'),
  ('0016','EMP0018','SL','2026-04-21','2026-04-22',2,'Food poisoning','2026-04-21','Approved','Sanjay Malhotra'),
  ('0017','EMP0006','EL','2026-05-11','2026-05-15',5,'Summer vacation with children','2026-04-20','Approved','Suresh Patel'),
  ('0018','EMP0014','CL','2026-06-04','2026-06-05',2,'Daughter''s school admission','2026-05-28','Approved','Mohan Das'),
  ('0019','EMP0020','SL','2026-07-01','2026-07-02',2,'Seasonal flu','2026-07-01','Approved','Rajesh Kumar'),
  ('0020','EMP0001','EL','2026-07-20','2026-07-24',5,'Annual family holiday','2026-06-30','Approved','Board Secretary'),
  ('0021','EMP0009','CL','2026-08-24','2026-08-25',2,'Attending panchayat land registration','2026-08-18','Submitted','Amit Verma'),
  ('0022','EMP0016','WFH','2026-09-07','2026-09-09',3,'Internet upgrade at office bay, working remotely','2026-09-01','Submitted','Arun Gupta')
) AS v(n,emp,lt,fdate,tdate,days,reason,adate,status,approver)
JOIN hr_employees e ON e."employeeCode" = v.emp
JOIN hr_leave_types lt ON lt.code = v.lt;

-- ============================================================ LEAVE ENCASHMENTS (EL)
INSERT INTO hr_leave_encashments
  ("companyId","employeeId","employeeName","financialYear","requestDate","leaveType","leaveTypeCode","encashedDays",
   "perDayRate","grossAmount","tdsDeducted","netAmount","submittedOn","approvedBy","approvedOn","processedOn",
   "paymentMode","paymentReference","paymentMonth",remarks,status,"createdAt","updatedAt")
SELECT :company, e.id::text, e."firstName"||' '||e."lastName", 'FY2025-26', v.req, 'Earned Leave','EL', v.days,
       v.rate, v.days*v.rate, round(v.days*v.rate*0.10,2), round(v.days*v.rate*0.90,2), v.req, 'Anita Desai', v.appr, v.proc,
       'bank-transfer', v.ref, v.month, 'Year-end EL encashment as per policy', v.status,
       v.req::timestamp + interval '10 hours', coalesce(v.proc,v.req)::timestamp + interval '15 hours'
FROM (VALUES
  ('EMP0005','2026-03-10',8, 8400.00,'2026-03-14','2026-03-31','DEMO-ENC-0001','Mar-2026','processed'),
  ('EMP0007','2026-03-11',6, 5600.00,'2026-03-14','2026-03-31','DEMO-ENC-0002','Mar-2026','processed'),
  ('EMP0011','2026-03-12',5, 3266.67,'2026-03-16','2026-03-31','DEMO-ENC-0003','Mar-2026','processed'),
  ('EMP0013','2026-03-12',4, 2333.33,'2026-03-16','2026-03-31','DEMO-ENC-0004','Mar-2026','processed'),
  ('EMP0015','2026-08-05',5, 7000.00,'2026-08-08',NULL,'DEMO-ENC-0005','Sep-2026','approved'),
  ('EMP0019','2026-08-20',4, 2240.00,NULL,NULL,'DEMO-ENC-0006',NULL,'pending')
) AS v(emp,req,days,rate,appr,proc,ref,month,status)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ ONBOARDING TASKS (recent joiners)
INSERT INTO hr_onboarding_tasks
  ("companyId",feature,"employeeCode","employeeName",designation,department,"joiningDate",status,items,"createdAt","updatedAt")
VALUES
  (:company,'checklist','EMP0018','Pooja Mehta','Sales Executive','Sales & Marketing','2026-06-01','completed',
   '[{"task":"Offer letter signed","done":true},{"task":"ID card issued","done":true},{"task":"Bank account details collected","done":true},{"task":"PF/UAN mapping","done":true}]',
   '2026-05-25 09:00:00','2026-06-05 17:00:00'),
  (:company,'induction','EMP0018','Pooja Mehta','Sales Executive','Sales & Marketing','2026-06-01','completed',
   '[{"session":"Company overview & MACBIS product walk","done":true},{"session":"Factory floor tour","done":true},{"session":"CRM & CPQ tools training","done":true}]',
   '2026-06-01 09:00:00','2026-06-07 17:00:00'),
  (:company,'documents','EMP0018','Pooja Mehta','Sales Executive','Sales & Marketing','2026-06-01','completed',
   '[{"doc":"PAN","received":true},{"doc":"Aadhaar","received":true},{"doc":"Previous employer relieving letter","received":true},{"doc":"Education certificates","received":true}]',
   '2026-05-25 09:00:00','2026-06-02 12:00:00'),
  (:company,'assets','EMP0018','Pooja Mehta','Sales Executive','Sales & Marketing','2026-06-01','completed',
   '[{"asset":"Laptop DELL-5440","issued":true},{"asset":"SIM + mobile","issued":true},{"asset":"Visiting cards","issued":true}]',
   '2026-06-01 09:00:00','2026-06-03 16:00:00'),
  (:company,'checklist','EMP0020','Ganesh Patil','Dispatch Assistant','Dispatch & Logistics','2026-07-15','in-progress',
   '[{"task":"Offer letter signed","done":true},{"task":"ID card issued","done":true},{"task":"Bank account details collected","done":true},{"task":"ESI/PF enrolment","done":false}]',
   '2026-07-10 09:00:00','2026-08-01 11:00:00'),
  (:company,'induction','EMP0020','Ganesh Patil','Dispatch Assistant','Dispatch & Logistics','2026-07-15','completed',
   '[{"session":"Company overview","done":true},{"session":"Safety induction & PPE issue","done":true},{"session":"Dispatch SOP walkthrough","done":true}]',
   '2026-07-15 09:00:00','2026-07-20 17:00:00'),
  (:company,'documents','EMP0020','Ganesh Patil','Dispatch Assistant','Dispatch & Logistics','2026-07-15','in-progress',
   '[{"doc":"PAN","received":true},{"doc":"Aadhaar","received":true},{"doc":"Education certificates","received":false}]',
   '2026-07-10 09:00:00','2026-08-05 10:00:00'),
  (:company,'assets','EMP0020','Ganesh Patil','Dispatch Assistant','Dispatch & Logistics','2026-07-15','pending',
   '[{"asset":"Rugged handheld scanner","issued":false},{"asset":"Safety shoes","issued":false}]',
   '2026-07-15 09:00:00','2026-07-15 09:00:00');

-- ============================================================ OFFBOARDING TASKS (planned exit: Lakshmi Iyer, LWD 2026-09-30)
INSERT INTO hr_offboarding_tasks
  ("companyId",feature,"employeeCode","employeeName",designation,department,status,data,items,"createdAt","updatedAt")
VALUES
  (:company,'exit-interview','EMP0014','Lakshmi Iyer','Store Assistant','Stores & Inventory','completed',
   '{"lastWorkingDay":"2026-09-30","resignationDate":"2026-08-14","interviewDate":"2026-09-02","interviewer":"Anita Desai","reason":"Relocation to Chennai","rehireEligible":true}',NULL,
   '2026-08-14 10:00:00','2026-09-02 16:00:00'),
  (:company,'clearance-checklist','EMP0014','Lakshmi Iyer','Store Assistant','Stores & Inventory','in-progress',
   '{"lastWorkingDay":"2026-09-30"}',
   '[{"item":"Stores handover to Mohan Das","done":true},{"item":"Cycle-count sign-off","done":true},{"item":"Knowledge transfer document","done":false}]',
   '2026-08-20 10:00:00','2026-09-08 12:00:00'),
  (:company,'clearance-it','EMP0014','Lakshmi Iyer','Store Assistant','Stores & Inventory','pending',
   '{"lastWorkingDay":"2026-09-30"}',
   '[{"item":"WMS access revocation","done":false},{"item":"Email deactivation scheduled","done":false}]',
   '2026-08-20 10:00:00','2026-08-20 10:00:00'),
  (:company,'clearance-hr','EMP0014','Lakshmi Iyer','Store Assistant','Stores & Inventory','in-progress',
   '{"lastWorkingDay":"2026-09-30"}',
   '[{"item":"Leave balance reconciliation","done":true},{"item":"Relieving letter draft","done":false}]',
   '2026-08-20 10:00:00','2026-09-05 15:00:00'),
  (:company,'clearance-finance','EMP0014','Lakshmi Iyer','Store Assistant','Stores & Inventory','pending',
   '{"lastWorkingDay":"2026-09-30","pendingAdvance":0}',
   '[{"item":"Full & final settlement computation","done":false}]',
   '2026-08-20 10:00:00','2026-08-20 10:00:00'),
  (:company,'clearance-assets','EMP0014','Lakshmi Iyer','Store Assistant','Stores & Inventory','in-progress',
   '{"lastWorkingDay":"2026-09-30"}',
   '[{"item":"Handheld scanner HHT-04","done":true},{"item":"ID card & access fob","done":false}]',
   '2026-08-20 10:00:00','2026-09-08 12:00:00');

-- ============================================================ OVERTIME REQUESTS
INSERT INTO hr_overtime_requests
  ("companyId","requestId","employeeCode","employeeName",department,designation,date,"shiftType","regularHours","overtimeHours",
   reason,"requestDate",status,"approvedBy","approvedDate","calculatedAmount","createdAt","updatedAt")
VALUES
  (:company,'DEMO-OT-0001','EMP0009','Deepak Joshi','Production','Welder','2025-10-18','General',8,3,'Urgent Blue Fig Hotels order - counter fabrication','2025-10-19','approved','Amit Verma','2025-10-20',1050,'2025-10-19 08:30:00','2025-10-20 10:00:00'),
  (:company,'DEMO-OT-0002','EMP0010','Ravi Menon','Production','Helper','2025-10-18','General',8,3,'Urgent Blue Fig Hotels order - polishing support','2025-10-19','approved','Amit Verma','2025-10-20',750,'2025-10-19 08:30:00','2025-10-20 10:00:00'),
  (:company,'DEMO-OT-0003','EMP0019','Ramesh Yadav','Maintenance','Technician','2025-11-08','General',8,4,'Press brake hydraulic seal replacement after shift','2025-11-09','approved','Rajesh Kumar','2025-11-10',1920,'2025-11-09 09:00:00','2025-11-10 09:30:00'),
  (:company,'DEMO-OT-0004','EMP0008','Kiran Reddy','Production','Supervisor','2025-12-20','General',8,2,'Year-end dispatch push - Golden Spoon order','2025-12-21','approved','Amit Verma','2025-12-22',1100,'2025-12-21 08:30:00','2025-12-22 10:00:00'),
  (:company,'DEMO-OT-0005','EMP0020','Ganesh Patil','Dispatch & Logistics','Dispatch Assistant','2026-01-25','General',8,3,'Container loading for US export shipment','2026-01-26','approved','Rajesh Kumar','2026-01-27',1050,'2026-01-26 08:30:00','2026-01-27 10:00:00'),
  (:company,'DEMO-OT-0006','EMP0009','Deepak Joshi','Production','Welder','2026-02-14','General',8,4,'Rework batch for Metro Hospital kitchens','2026-02-15','approved','Amit Verma','2026-02-16',1400,'2026-02-15 08:30:00','2026-02-16 10:00:00'),
  (:company,'DEMO-OT-0007','EMP0013','Mohan Das','Stores & Inventory','Storekeeper','2026-03-30','General',8,3,'Year-end physical stock verification','2026-03-31','approved','Suresh Patel','2026-04-01',1500,'2026-03-31 08:30:00','2026-04-01 10:00:00'),
  (:company,'DEMO-OT-0008','EMP0014','Lakshmi Iyer','Stores & Inventory','Store Assistant','2026-03-30','General',8,3,'Year-end physical stock verification','2026-03-31','approved','Suresh Patel','2026-04-01',960,'2026-03-31 08:30:00','2026-04-01 10:00:00'),
  (:company,'DEMO-OT-0009','EMP0010','Ravi Menon','Production','Helper','2026-05-16','General',8,2,'Powder coating booth deep clean','2026-05-17','rejected','Amit Verma','2026-05-18',NULL,'2026-05-17 08:30:00','2026-05-18 10:00:00'),
  (:company,'DEMO-OT-0010','EMP0019','Ramesh Yadav','Maintenance','Technician','2026-06-21','General',8,5,'DG set breakdown during monsoon outage','2026-06-22','approved','Rajesh Kumar','2026-06-23',2400,'2026-06-22 09:00:00','2026-06-23 09:30:00'),
  (:company,'DEMO-OT-0011','EMP0009','Deepak Joshi','Production','Welder','2026-08-22','General',8,3,'Summit Catering rush order - display counters','2026-08-23','approved','Amit Verma','2026-08-24',1050,'2026-08-23 08:30:00','2026-08-24 10:00:00'),
  (:company,'DEMO-OT-0012','EMP0020','Ganesh Patil','Dispatch & Logistics','Dispatch Assistant','2026-09-05','General',8,2,'Weekend dispatch - Lakeside Resort fitout','2026-09-06','pending',NULL,NULL,NULL,'2026-09-06 08:30:00','2026-09-06 08:30:00');

-- ============================================================ PAYROLL BONUS SCHEMES
INSERT INTO hr_payroll_bonus_schemes
  ("companyId","schemeName","schemeType","applicableTo","eligibilityCriteria","calculationMethod","bonusPercentage","fixedAmount",
   "paymentFrequency",status,"effectiveFrom","effectiveTo","createdBy",description,"createdAt","updatedAt")
VALUES
  (:company,'Annual Performance Bonus','performance','all','Rating >= Meets Expectations in annual review','percentage-of-ctc',8.33,NULL,'annual','active','2025-04-01',NULL,'Anita Desai','Paid with April payroll after appraisal sign-off','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Diwali Festival Bonus','festival','all','On rolls as of 30-Sep','fixed-amount',NULL,10000,'annual','active','2025-04-01',NULL,'Anita Desai','Flat festival bonus paid with October payroll','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Sales Incentive Scheme','performance','department','Sales & Marketing, on order booking targets','slab-on-order-value',2.00,NULL,'quarterly','active','2025-04-01',NULL,'Sanjay Malhotra','Quarterly incentive on confirmed order value above target','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Key Talent Retention Bonus','retention','individual','Named critical roles approved by MD','fixed-amount',NULL,100000,'annual','active','2025-04-01','2027-03-31','Rajesh Kumar','Retention payout for critical engineering and IT roles','2025-10-01 09:00:00','2025-10-01 09:00:00');

-- ============================================================ PAYROLL BONUS RECORDS
INSERT INTO hr_payroll_bonus_records
  ("companyId",category,"employeeId","employeeName","employeeCode",designation,department,"financialYear","bonusAmount",status,details,"createdAt","updatedAt")
SELECT :company, v.cat, e.id::text, e."firstName"||' '||e."lastName", e."employeeCode", v.desig, v.dept, v.fy, v.amt, v.status,
       jsonb_build_object('scheme',v.scheme,'paymentMonth',v.pm), v.crt::timestamp, v.crt::timestamp
FROM (VALUES
  ('EMP0007','annual','Production Manager','Production','FY2025-26',167832,'paid','Annual Performance Bonus','Apr-2026','2026-04-28 12:00:00'),
  ('EMP0011','annual','QC Engineer','Quality Control','FY2025-26',97902,'paid','Annual Performance Bonus','Apr-2026','2026-04-28 12:00:00'),
  ('EMP0015','annual','IT Manager','Information Technology','FY2025-26',209790,'paid','Annual Performance Bonus','Apr-2026','2026-04-28 12:00:00'),
  ('EMP0005','annual','Finance Manager','Finance & Accounts','FY2025-26',251748,'paid','Annual Performance Bonus','Apr-2026','2026-04-28 12:00:00'),
  ('EMP0003','annual','HR Manager','Human Resources','FY2025-26',111888,'paid','Annual Performance Bonus','Apr-2026','2026-04-28 12:00:00'),
  ('EMP0017','performance','Sales Manager','Sales & Marketing','FY2025-26',84500,'paid','Sales Incentive Scheme','Q3 FY2025-26','2026-01-31 12:00:00'),
  ('EMP0018','performance','Sales Executive','Sales & Marketing','FY2026-27',22400,'approved','Sales Incentive Scheme','Q1 FY2026-27','2026-07-31 12:00:00'),
  ('EMP0009','festival','Welder','Production','FY2025-26',10000,'paid','Diwali Festival Bonus','Oct-2025','2025-10-25 12:00:00'),
  ('EMP0010','festival','Helper','Production','FY2025-26',10000,'paid','Diwali Festival Bonus','Oct-2025','2025-10-25 12:00:00'),
  ('EMP0019','festival','Technician','Maintenance','FY2025-26',10000,'paid','Diwali Festival Bonus','Oct-2025','2025-10-25 12:00:00'),
  ('EMP0013','festival','Storekeeper','Stores & Inventory','FY2025-26',10000,'paid','Diwali Festival Bonus','Oct-2025','2025-10-25 12:00:00'),
  ('EMP0016','retention','Software Engineer','Information Technology','FY2026-27',100000,'pending','Key Talent Retention Bonus','Mar-2027','2026-08-10 12:00:00')
) AS v(emp,cat,desig,dept,fy,amt,status,scheme,pm,crt)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ PAYROLL CALENDAR EVENTS (Oct-2025 .. Sep-2026)
INSERT INTO hr_payroll_calendar_events
  ("companyId","monthYear","cutoffDate","attendanceFreeze","salaryProcessing","verificationDeadline","approvalDeadline",
   "disbursementDate",status,notes,"createdAt","updatedAt")
VALUES
  (:company,'Oct-2025','2025-10-25','2025-10-26','2025-10-27','2025-10-28','2025-10-29','2025-10-31','completed','Includes Diwali festival bonus payout','2025-10-01 09:00:00','2025-10-31 18:00:00'),
  (:company,'Nov-2025','2025-11-25','2025-11-26','2025-11-27','2025-11-28','2025-11-29','2025-11-30','completed',NULL,'2025-11-01 09:00:00','2025-11-30 18:00:00'),
  (:company,'Dec-2025','2025-12-24','2025-12-26','2025-12-27','2025-12-29','2025-12-30','2025-12-31','completed','Early cutoff for year-end holidays','2025-12-01 09:00:00','2025-12-31 18:00:00'),
  (:company,'Jan-2026','2026-01-25','2026-01-27','2026-01-28','2026-01-29','2026-01-30','2026-01-31','completed',NULL,'2026-01-01 09:00:00','2026-01-31 18:00:00'),
  (:company,'Feb-2026','2026-02-23','2026-02-24','2026-02-25','2026-02-26','2026-02-27','2026-02-28','completed',NULL,'2026-02-01 09:00:00','2026-02-28 18:00:00'),
  (:company,'Mar-2026','2026-03-25','2026-03-26','2026-03-27','2026-03-28','2026-03-30','2026-03-31','completed','FY close - EL encashment processed','2026-03-01 09:00:00','2026-03-31 18:00:00'),
  (:company,'Apr-2026','2026-04-24','2026-04-25','2026-04-27','2026-04-28','2026-04-29','2026-04-30','completed','Annual bonus + increment arrears','2026-04-01 09:00:00','2026-04-30 18:00:00'),
  (:company,'May-2026','2026-05-25','2026-05-26','2026-05-27','2026-05-28','2026-05-29','2026-05-30','completed',NULL,'2026-05-01 09:00:00','2026-05-30 18:00:00'),
  (:company,'Jun-2026','2026-06-25','2026-06-26','2026-06-27','2026-06-29','2026-06-29','2026-06-30','completed',NULL,'2026-06-01 09:00:00','2026-06-30 18:00:00'),
  (:company,'Jul-2026','2026-07-24','2026-07-27','2026-07-28','2026-07-29','2026-07-30','2026-07-31','completed',NULL,'2026-07-01 09:00:00','2026-07-31 18:00:00'),
  (:company,'Aug-2026','2026-08-25','2026-08-26','2026-08-27','2026-08-28','2026-08-29','2026-08-31','in-progress','Disbursement batch under bank processing','2026-08-01 09:00:00','2026-09-08 12:00:00'),
  (:company,'Sep-2026','2026-09-25','2026-09-26','2026-09-27','2026-09-28','2026-09-29','2026-09-30','upcoming',NULL,'2026-09-01 09:00:00','2026-09-01 09:00:00');

-- ============================================================ PAYROLLS (monthly runs Oct-2025 .. Aug-2026)
INSERT INTO hr_payrolls
  ("payrollNumber",title,period,month,year,"startDate","endDate","paymentDate","totalEmployees","processedEmployees",
   "totalGrossSalary","totalDeductions","totalNetSalary","totalEmployerContributions","totalCTC",status,
   "isPosted","postedAt","postedBy","isPaid","paidAt","paidBy","paymentReferenceNumber","processedBy","processedAt",
   "approvedBy","approvedAt",remarks,"createdBy","createdAt","updatedAt")
VALUES
  ('DEMO-PAY-2025-10','Salary - October 2025','Monthly',10,2025,'2025-10-01','2025-10-31','2025-10-31',20,20,2381500,548200,1833300,209000,2590500,'Paid',true,'2025-10-31 17:00:00','Suresh Patel',true,'2025-10-31 16:00:00','Suresh Patel','DEMO-UTR-2510','Meera Nair','2025-10-27 15:00:00','Rajesh Kumar','2025-10-29 11:00:00','Includes festival OT for dispatch push','demo-seed','2025-10-27 09:00:00','2025-10-31 17:00:00'),
  ('DEMO-PAY-2025-11','Salary - November 2025','Monthly',11,2025,'2025-11-01','2025-11-30','2025-11-30',20,20,2366000,545000,1821000,209000,2575000,'Paid',true,'2025-11-30 17:00:00','Suresh Patel',true,'2025-11-30 16:00:00','Suresh Patel','DEMO-UTR-2511','Meera Nair','2025-11-27 15:00:00','Rajesh Kumar','2025-11-29 11:00:00',NULL,'demo-seed','2025-11-27 09:00:00','2025-11-30 17:00:00'),
  ('DEMO-PAY-2025-12','Salary - December 2025','Monthly',12,2025,'2025-12-01','2025-12-31','2025-12-31',20,20,2402300,551600,1850700,209000,2611300,'Paid',true,'2025-12-31 17:00:00','Suresh Patel',true,'2025-12-31 16:00:00','Suresh Patel','DEMO-UTR-2512','Meera Nair','2025-12-27 15:00:00','Rajesh Kumar','2025-12-30 11:00:00','Year-end OT included','demo-seed','2025-12-27 09:00:00','2025-12-31 17:00:00'),
  ('DEMO-PAY-2026-01','Salary - January 2026','Monthly',1,2026,'2026-01-01','2026-01-31','2026-01-31',20,20,2366000,545000,1821000,209000,2575000,'Paid',true,'2026-01-31 17:00:00','Suresh Patel',true,'2026-01-31 16:00:00','Suresh Patel','DEMO-UTR-2601','Meera Nair','2026-01-28 15:00:00','Rajesh Kumar','2026-01-30 11:00:00',NULL,'demo-seed','2026-01-28 09:00:00','2026-01-31 17:00:00'),
  ('DEMO-PAY-2026-02','Salary - February 2026','Monthly',2,2026,'2026-02-01','2026-02-28','2026-02-28',20,20,2371800,546100,1825700,209000,2580800,'Paid',true,'2026-02-28 17:00:00','Suresh Patel',true,'2026-02-28 16:00:00','Suresh Patel','DEMO-UTR-2602','Meera Nair','2026-02-25 15:00:00','Rajesh Kumar','2026-02-27 11:00:00',NULL,'demo-seed','2026-02-25 09:00:00','2026-02-28 17:00:00'),
  ('DEMO-PAY-2026-03','Salary - March 2026','Monthly',3,2026,'2026-03-01','2026-03-31','2026-03-31',20,20,2398600,550900,1847700,209000,2607600,'Paid',true,'2026-03-31 17:00:00','Suresh Patel',true,'2026-03-31 16:00:00','Suresh Patel','DEMO-UTR-2603','Meera Nair','2026-03-27 15:00:00','Rajesh Kumar','2026-03-30 11:00:00','FY close: EL encashment paid alongside','demo-seed','2026-03-27 09:00:00','2026-03-31 17:00:00'),
  ('DEMO-PAY-2026-04','Salary - April 2026','Monthly',4,2026,'2026-04-01','2026-04-30','2026-04-30',20,20,2412000,553400,1858600,209000,2621000,'Paid',true,'2026-04-30 17:00:00','Suresh Patel',true,'2026-04-30 16:00:00','Suresh Patel','DEMO-UTR-2604','Meera Nair','2026-04-27 15:00:00','Rajesh Kumar','2026-04-29 11:00:00','Annual bonus paid via separate batch','demo-seed','2026-04-27 09:00:00','2026-04-30 17:00:00'),
  ('DEMO-PAY-2026-05','Salary - May 2026','Monthly',5,2026,'2026-05-01','2026-05-31','2026-05-30',20,20,2412000,553400,1858600,209000,2621000,'Paid',true,'2026-05-30 17:00:00','Suresh Patel',true,'2026-05-30 16:00:00','Suresh Patel','DEMO-UTR-2605','Meera Nair','2026-05-27 15:00:00','Rajesh Kumar','2026-05-29 11:00:00',NULL,'demo-seed','2026-05-27 09:00:00','2026-05-30 17:00:00'),
  ('DEMO-PAY-2026-06','Salary - June 2026','Monthly',6,2026,'2026-06-01','2026-06-30','2026-06-30',20,20,2431500,557000,1874500,209000,2640500,'Paid',true,'2026-06-30 17:00:00','Suresh Patel',true,'2026-06-30 16:00:00','Suresh Patel','DEMO-UTR-2606','Meera Nair','2026-06-27 15:00:00','Rajesh Kumar','2026-06-29 11:00:00','Monsoon breakdown OT included','demo-seed','2026-06-27 09:00:00','2026-06-30 17:00:00'),
  ('DEMO-PAY-2026-07','Salary - July 2026','Monthly',7,2026,'2026-07-01','2026-07-31','2026-07-31',20,20,2412000,553400,1858600,209000,2621000,'Paid',true,'2026-07-31 17:00:00','Suresh Patel',true,'2026-07-31 16:00:00','Suresh Patel','DEMO-UTR-2607','Meera Nair','2026-07-28 15:00:00','Rajesh Kumar','2026-07-30 11:00:00',NULL,'demo-seed','2026-07-28 09:00:00','2026-07-31 17:00:00'),
  ('DEMO-PAY-2026-08','Salary - August 2026','Monthly',8,2026,'2026-08-01','2026-08-31','2026-08-31',20,20,2428700,556300,1872400,209000,2637700,'Approved',false,NULL,NULL,false,NULL,NULL,NULL,'Meera Nair','2026-08-27 15:00:00','Rajesh Kumar','2026-08-29 11:00:00','Awaiting bank batch confirmation','demo-seed','2026-08-27 09:00:00','2026-09-08 12:00:00');

-- ============================================================ PAYROLL DISBURSEMENTS (Aug-2026 bank batch, one per employee)
INSERT INTO hr_payroll_disbursements
  ("companyId",category,"employeeId","employeeName","employeeCode",department,period,"paymentMethod","bankName","accountNumber",
   "netPay",status,details,"createdAt","updatedAt")
SELECT :company,'disbursement', e.id::text, e."firstName"||' '||e."lastName", e."employeeCode", d.name, 'Aug-2026',
       'bank-transfer', coalesce(e."bankName",'HDFC Bank'), coalesce(e."accountNumber",'XXXXXX'||right(e."employeeCode",4)),
       round(e."grossSalary" - e."basicSalary"*0.12 - 200
             - CASE WHEN e."grossSalary" >= 200000 THEN e."grossSalary"*0.15
                    WHEN e."grossSalary" >= 100000 THEN e."grossSalary"*0.08
                    WHEN e."grossSalary" >= 60000  THEN e."grossSalary"*0.04
                    ELSE 0 END, 0),
       CASE WHEN e."employeeCode" IN ('EMP0019','EMP0020') THEN 'pending' ELSE 'processed' END,
       jsonb_build_object('payrollNumber','DEMO-PAY-2026-08','utr','DEMO-UTR-2608-'||e."employeeCode"),
       '2026-08-31 10:00:00'::timestamp,'2026-09-01 10:00:00'::timestamp
FROM hr_employees e
LEFT JOIN hr_departments d ON d.id = e."departmentId";

-- ============================================================ PAYROLL LOAN RECOVERIES
INSERT INTO hr_payroll_loan_recoveries
  ("companyId","employeeId","employeeName","loanId","loanType","amountRecovered","recoveryDate",method,status,reference,details,"createdAt","updatedAt")
SELECT :company, e.id::text, e."firstName"||' '||e."lastName", v.loan, v.ltype, v.amt, v.rdate, 'salary_deduction', v.status, v.ref,
       jsonb_build_object('installmentNo',v.inst,'totalInstallments',v.tot), v.rdate::timestamp + interval '17 hours', v.rdate::timestamp + interval '17 hours'
FROM (VALUES
  ('EMP0009','DEMO-LN-001','personal',5000,'2026-07-31','completed','DEMO-PAY-2026-07',7,24),
  ('EMP0009','DEMO-LN-001','personal',5000,'2026-08-31','completed','DEMO-PAY-2026-08',8,24),
  ('EMP0013','DEMO-LN-002','emergency',4000,'2026-07-31','completed','DEMO-PAY-2026-07',3,12),
  ('EMP0013','DEMO-LN-002','emergency',4000,'2026-08-31','completed','DEMO-PAY-2026-08',4,12),
  ('EMP0019','DEMO-LN-003','vehicle',6500,'2026-08-31','completed','DEMO-PAY-2026-08',1,36),
  ('EMP0019','DEMO-LN-003','vehicle',6500,'2026-09-30','pending',NULL,2,36)
) AS v(emp,loan,ltype,amt,rdate,status,ref,inst,tot)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ PAYROLL REPORTS (monthly salary register summaries)
INSERT INTO hr_payroll_reports
  ("companyId",category,period,amount,status,details,"createdAt","updatedAt")
VALUES
  (:company,'register','Oct-2025',1833300,'active','{"payrollNumber":"DEMO-PAY-2025-10","employees":20,"gross":2381500,"deductions":548200}','2025-10-31 18:00:00','2025-10-31 18:00:00'),
  (:company,'register','Nov-2025',1821000,'active','{"payrollNumber":"DEMO-PAY-2025-11","employees":20,"gross":2366000,"deductions":545000}','2025-11-30 18:00:00','2025-11-30 18:00:00'),
  (:company,'register','Dec-2025',1850700,'active','{"payrollNumber":"DEMO-PAY-2025-12","employees":20,"gross":2402300,"deductions":551600}','2025-12-31 18:00:00','2025-12-31 18:00:00'),
  (:company,'register','Jan-2026',1821000,'active','{"payrollNumber":"DEMO-PAY-2026-01","employees":20,"gross":2366000,"deductions":545000}','2026-01-31 18:00:00','2026-01-31 18:00:00'),
  (:company,'register','Feb-2026',1825700,'active','{"payrollNumber":"DEMO-PAY-2026-02","employees":20,"gross":2371800,"deductions":546100}','2026-02-28 18:00:00','2026-02-28 18:00:00'),
  (:company,'register','Mar-2026',1847700,'active','{"payrollNumber":"DEMO-PAY-2026-03","employees":20,"gross":2398600,"deductions":550900}','2026-03-31 18:00:00','2026-03-31 18:00:00'),
  (:company,'register','Apr-2026',1858600,'active','{"payrollNumber":"DEMO-PAY-2026-04","employees":20,"gross":2412000,"deductions":553400}','2026-04-30 18:00:00','2026-04-30 18:00:00'),
  (:company,'register','May-2026',1858600,'active','{"payrollNumber":"DEMO-PAY-2026-05","employees":20,"gross":2412000,"deductions":553400}','2026-05-30 18:00:00','2026-05-30 18:00:00'),
  (:company,'register','Jun-2026',1874500,'active','{"payrollNumber":"DEMO-PAY-2026-06","employees":20,"gross":2431500,"deductions":557000}','2026-06-30 18:00:00','2026-06-30 18:00:00'),
  (:company,'register','Jul-2026',1858600,'active','{"payrollNumber":"DEMO-PAY-2026-07","employees":20,"gross":2412000,"deductions":553400}','2026-07-31 18:00:00','2026-07-31 18:00:00'),
  (:company,'register','Aug-2026',1872400,'active','{"payrollNumber":"DEMO-PAY-2026-08","employees":20,"gross":2428700,"deductions":556300}','2026-08-31 18:00:00','2026-08-31 18:00:00');

-- ============================================================ SALARY REVISIONS (annual increment cycle, effective Apr-2026)
INSERT INTO hr_payroll_salary_revisions
  ("companyId",category,"employeeId","employeeName","employeeCode",designation,department,"effectiveDate",
   "currentSalary","revisedSalary","incrementPercent",status,details,"createdAt","updatedAt")
SELECT :company,'revision', e.id::text, e."firstName"||' '||e."lastName", e."employeeCode", v.desig, v.dept, '2026-04-01',
       v.cur, v.rev, v.pct, v.status, jsonb_build_object('cycle','Annual Increment FY2026-27','approver','Rajesh Kumar'),
       '2026-03-20 10:00:00'::timestamp, v.upd::timestamp
FROM (VALUES
  ('EMP0007','Production Manager','Production',168000,186480,11.00,'approved','2026-04-10 12:00:00'),
  ('EMP0011','QC Engineer','Quality Control',98000,107800,10.00,'approved','2026-04-10 12:00:00'),
  ('EMP0015','IT Manager','Information Technology',210000,235200,12.00,'approved','2026-04-10 12:00:00'),
  ('EMP0009','Welder','Production',49000,53410,9.00,'approved','2026-04-10 12:00:00'),
  ('EMP0017','Sales Manager','Sales & Marketing',126000,138600,10.00,'approved','2026-04-10 12:00:00'),
  ('EMP0006','Accountant','Finance & Accounts',105000,113400,8.00,'approved','2026-04-10 12:00:00'),
  ('EMP0016','Software Engineer','Information Technology',84000,94080,12.00,'pending','2026-03-20 10:00:00'),
  ('EMP0019','Technician','Maintenance',67200,72576,8.00,'pending','2026-03-20 10:00:00')
) AS v(emp,desig,dept,cur,rev,pct,status,upd)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ STATUTORY FILINGS (PF ECR, PT, LWF, annual returns)
INSERT INTO hr_payroll_statutory_filings
  ("companyId",category,period,amount,status,details,"createdAt","updatedAt")
VALUES
  (:company,'pf-contribution','Apr-2026',405600,'filed','{"ecrRef":"DEMO-ECR-2604","employeeShare":202800,"employerShare":202800,"dueDate":"2026-05-15","filedOn":"2026-05-12"}','2026-05-12 11:00:00','2026-05-12 11:00:00'),
  (:company,'pf-contribution','May-2026',405600,'filed','{"ecrRef":"DEMO-ECR-2605","employeeShare":202800,"employerShare":202800,"dueDate":"2026-06-15","filedOn":"2026-06-11"}','2026-06-11 11:00:00','2026-06-11 11:00:00'),
  (:company,'pf-contribution','Jun-2026',405600,'filed','{"ecrRef":"DEMO-ECR-2606","employeeShare":202800,"employerShare":202800,"dueDate":"2026-07-15","filedOn":"2026-07-13"}','2026-07-13 11:00:00','2026-07-13 11:00:00'),
  (:company,'pf-contribution','Jul-2026',405600,'filed','{"ecrRef":"DEMO-ECR-2607","employeeShare":202800,"employerShare":202800,"dueDate":"2026-08-15","filedOn":"2026-08-12"}','2026-08-12 11:00:00','2026-08-12 11:00:00'),
  (:company,'pf-contribution','Aug-2026',405600,'pending','{"employeeShare":202800,"employerShare":202800,"dueDate":"2026-09-15"}','2026-09-01 11:00:00','2026-09-01 11:00:00'),
  (:company,'pt','May-2026',4000,'filed','{"state":"Maharashtra","dueDate":"2026-06-30","filedOn":"2026-06-25"}','2026-06-25 11:00:00','2026-06-25 11:00:00'),
  (:company,'pt','Jun-2026',4000,'filed','{"state":"Maharashtra","dueDate":"2026-07-31","filedOn":"2026-07-28"}','2026-07-28 11:00:00','2026-07-28 11:00:00'),
  (:company,'pt','Jul-2026',4000,'filed','{"state":"Maharashtra","dueDate":"2026-08-31","filedOn":"2026-08-27"}','2026-08-27 11:00:00','2026-08-27 11:00:00'),
  (:company,'pt','Aug-2026',4000,'pending','{"state":"Maharashtra","dueDate":"2026-09-30"}','2026-09-01 11:00:00','2026-09-01 11:00:00'),
  (:company,'lwf','H2-2025',1440,'filed','{"state":"Maharashtra","dueDate":"2026-01-15","filedOn":"2026-01-10"}','2026-01-10 11:00:00','2026-01-10 11:00:00'),
  (:company,'pf-returns','FY2025-26',NULL,'filed','{"form":"Annual PF Return","filedOn":"2026-04-25"}','2026-04-25 11:00:00','2026-04-25 11:00:00');

-- ============================================================ TAX RECORDS (TDS deposits + Form 16)
INSERT INTO hr_payroll_tax_records
  ("companyId",category,"employeeId","employeeName","employeeCode",department,"financialYear",period,amount,status,details,"createdAt","updatedAt")
SELECT :company, v.cat, e.id::text, e."firstName"||' '||e."lastName", e."employeeCode", v.dept, v.fy, v.period, v.amt, v.status,
       v.details::jsonb, v.crt::timestamp, v.crt::timestamp
FROM (VALUES
  ('EMP0001','form16','Management','FY2025-26',NULL,630000,'issued','{"issuedOn":"2026-06-10","assessmentYear":"AY2026-27"}','2026-06-10 12:00:00'),
  ('EMP0002','form16','Management','FY2025-26',NULL,504000,'issued','{"issuedOn":"2026-06-10","assessmentYear":"AY2026-27"}','2026-06-10 12:00:00'),
  ('EMP0005','form16','Finance & Accounts','FY2025-26',NULL,453600,'issued','{"issuedOn":"2026-06-10","assessmentYear":"AY2026-27"}','2026-06-10 12:00:00'),
  ('EMP0015','form16','Information Technology','FY2025-26',NULL,378000,'issued','{"issuedOn":"2026-06-10","assessmentYear":"AY2026-27"}','2026-06-10 12:00:00'),
  ('EMP0007','form16','Production','FY2025-26',NULL,161280,'issued','{"issuedOn":"2026-06-10","assessmentYear":"AY2026-27"}','2026-06-10 12:00:00'),
  ('EMP0017','form16','Sales & Marketing','FY2025-26',NULL,120960,'issued','{"issuedOn":"2026-06-10","assessmentYear":"AY2026-27"}','2026-06-10 12:00:00')
) AS v(emp,cat,dept,fy,period,amt,status,details,crt)
JOIN hr_employees e ON e."employeeCode" = v.emp;

INSERT INTO hr_payroll_tax_records
  ("companyId",category,"financialYear",period,amount,status,details,"createdAt","updatedAt")
VALUES
  (:company,'tds','FY2025-26','Q3 (Oct-Dec 2025)',511800,'deposited','{"challan":"DEMO-CHLN-Q3-2526","depositedOn":"2026-01-06","form":"24Q"}','2026-01-06 12:00:00','2026-01-06 12:00:00'),
  (:company,'tds','FY2025-26','Q4 (Jan-Mar 2026)',513200,'deposited','{"challan":"DEMO-CHLN-Q4-2526","depositedOn":"2026-04-06","form":"24Q"}','2026-04-06 12:00:00','2026-04-06 12:00:00'),
  (:company,'tds','FY2026-27','Q1 (Apr-Jun 2026)',519400,'deposited','{"challan":"DEMO-CHLN-Q1-2627","depositedOn":"2026-07-06","form":"24Q"}','2026-07-06 12:00:00','2026-07-06 12:00:00'),
  (:company,'tds','FY2026-27','Q2 (Jul-Sep 2026)',346200,'pending','{"note":"Jul+Aug accrued; deposit due 2026-10-07","form":"24Q"}','2026-09-01 12:00:00','2026-09-01 12:00:00');

-- ============================================================ PER DIEM RATES
INSERT INTO hr_per_diem_rates
  ("companyId","locationName","locationType",country,state,city,currency,"accommodationRate","mealsRate","incidentalsRate",
   "transportRate","totalDailyRate","effectiveFrom",notes,status,"createdAt","updatedAt")
VALUES
  (:company,'Mumbai Metro','metro','India','Maharashtra','Mumbai','INR',6000,1200,500,800,8500,'2025-10-01','Client visits and exhibition duty','active','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Delhi NCR','metro','India','Delhi','New Delhi','INR',5500,1200,500,800,8000,'2025-10-01','Aahar expo and north dealer network','active','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Bengaluru','metro','India','Karnataka','Bengaluru','INR',5000,1100,500,700,7300,'2025-10-01',NULL,'active','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Chennai','metro','India','Tamil Nadu','Chennai','INR',4500,1000,400,700,6600,'2025-10-01',NULL,'active','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Kochi','tier-1','India','Kerala','Kochi','INR',4000,900,400,600,5900,'2025-10-01','Site commissioning - resort projects','active','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Tier-2 India','tier-2','India',NULL,NULL,'INR',3000,800,300,500,4600,'2025-10-01','All other Indian cities','active','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'Chicago (NAFEM)','international','USA','Illinois','Chicago','USD',180,60,25,40,305,'2025-10-01','NAFEM show and US distributor visits','active','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'New York','international','USA','New York','New York','USD',220,70,30,50,370,'2025-10-01','Blue Fig Hotels account service','active','2025-10-01 09:00:00','2025-10-01 09:00:00');

-- ============================================================ PERFORMANCE REVIEW CYCLES
INSERT INTO hr_performance_review_cycles
  ("cycleCode","cycleName",description,"cycleType","fiscalYear","startDate","endDate",
   "goalSettingStart","goalSettingEnd","selfAppraisalStart","selfAppraisalEnd","managerReviewStart","managerReviewEnd",
   status,"companyId","isActive","createdAt","updatedAt")
VALUES
  ('DEMO-CYC-FY26-ANNUAL','Annual Appraisal FY2025-26','Company-wide annual appraisal covering Apr-2025 to Mar-2026','annual','FY2025-26',
   '2025-04-01 00:00:00','2026-03-31 23:59:59','2025-04-01 00:00:00','2025-04-30 23:59:59','2026-03-01 00:00:00','2026-03-15 23:59:59',
   '2026-03-16 00:00:00','2026-04-05 23:59:59','completed',:company,true,'2025-10-01 09:00:00','2026-04-15 12:00:00'),
  ('DEMO-CYC-FY27-H1','Mid-Year Check-in H1 FY2026-27','Half-yearly progress check for Apr-Sep 2026','half_yearly','FY2026-27',
   '2026-04-01 00:00:00','2026-09-30 23:59:59','2026-04-01 00:00:00','2026-04-20 23:59:59','2026-09-01 00:00:00','2026-09-15 23:59:59',
   '2026-09-16 00:00:00','2026-09-30 23:59:59','active',:company,true,'2026-04-01 09:00:00','2026-09-01 09:00:00'),
  ('DEMO-CYC-FY27-ANNUAL','Annual Appraisal FY2026-27','Company-wide annual appraisal covering Apr-2026 to Mar-2027','annual','FY2026-27',
   '2026-04-01 00:00:00','2027-03-31 23:59:59','2026-04-01 00:00:00','2026-04-30 23:59:59',NULL,NULL,NULL,NULL,
   'draft',:company,true,'2026-04-01 09:00:00','2026-04-01 09:00:00');

-- ============================================================ PERFORMANCE REVIEWS (fixed ids; first 3 referenced by hr_review_meetings)
INSERT INTO hr_performance_reviews
  (id,"reviewNumber","employeeId","reviewerName","reviewType",cycle,"reviewPeriodFrom","reviewPeriodTo","reviewDate",status,
   "selfRating","managerRating","finalRating","overallRating",strengths,"areasOfImprovement",
   "isPromotionRecommended","isSalaryRevisionRecommended","recommendedSalaryIncrease",
   "totalWorkingDays","presentDays","absentDays","leavesTaken","isSelfAssessmentCompleted","isManagerReviewCompleted",
   "createdBy","createdAt","updatedAt")
SELECT v.id::uuid, v.num, e.id, v.reviewer, v.rtype::hr_performance_reviews_reviewtype_enum, v.cyc::hr_performance_reviews_cycle_enum,
       v.pfrom::date, v.pto::date, v.rdate::date, v.status::hr_performance_reviews_status_enum,
       v.self, v.mgr, v.fin, NULLIF(v.overall,'')::hr_performance_reviews_overallrating_enum,
       v.strengths, v.areas, v.promo, v.salrec, v.pct,
       248, 240, 8, 8.0, v.selfdone, v.mgrdone,
       'demo-seed', v.crt::timestamp, v.crt::timestamp
FROM (VALUES
  ('d1fe0000-0000-4000-8000-000000000001','DEMO-REV-0001','EMP0007','Rajesh Kumar','Appraisal','Annual','2025-04-01','2026-03-31','2026-03-25','Completed',4.2,4.5,4.4,'Exceeds Expectations','Line efficiency up 6%; strong crew leadership','Delegation of shift reporting',false,true,11.00,true,true,'2026-03-25 15:00:00'),
  ('d1fe0000-0000-4000-8000-000000000002','DEMO-REV-0002','EMP0011','Rajesh Kumar','Appraisal','Annual','2025-04-01','2026-03-31','2026-03-26','Completed',4.0,4.3,4.2,'Exceeds Expectations','FPY at 96.2%; drove supplier quality audits','Cross-training on incoming inspection',false,true,10.00,true,true,'2026-03-26 15:00:00'),
  ('d1fe0000-0000-4000-8000-000000000003','DEMO-REV-0003','EMP0015','Rajesh Kumar','Appraisal','Annual','2025-04-01','2026-03-31','2026-03-26','Completed',4.5,4.6,4.6,'Outstanding','ERP rollout on schedule; zero P1 outages','Documentation of infra runbooks',true,true,12.00,true,true,'2026-03-26 16:00:00'),
  ('d1fe0000-0000-4000-8000-000000000004','DEMO-REV-0004','EMP0005','Priya Sharma','Appraisal','Annual','2025-04-01','2026-03-31','2026-03-27','Completed',4.1,4.2,4.2,'Exceeds Expectations','Clean statutory record; DSO improved 8 days','Automation of MIS pack',false,true,9.00,true,true,'2026-03-27 15:00:00'),
  ('d1fe0000-0000-4000-8000-000000000005','DEMO-REV-0005','EMP0017','Rajesh Kumar','Appraisal','Annual','2025-04-01','2026-03-31','2026-03-27','Completed',4.0,4.1,4.1,'Exceeds Expectations','Hotel segment orders up 22%','Pipeline hygiene in CRM',false,true,10.00,true,true,'2026-03-27 16:00:00'),
  ('d1fe0000-0000-4000-8000-000000000006','DEMO-REV-0006','EMP0009','Amit Verma','Appraisal','Annual','2025-04-01','2026-03-31','2026-03-28','Completed',3.6,3.8,3.7,'Meets Expectations','Reliable weld quality on SS counters','Reduce rework on custom jobs',false,true,9.00,true,true,'2026-03-28 15:00:00'),
  ('d1fe0000-0000-4000-8000-000000000007','DEMO-REV-0007','EMP0010','Amit Verma','Appraisal','Annual','2025-04-01','2026-03-31','2026-03-28','Completed',3.0,2.8,2.9,'Needs Improvement','Willing attitude, flexible on shifts','Attendance consistency; finishing quality',false,false,NULL,true,true,'2026-03-28 16:00:00'),
  ('d1fe0000-0000-4000-8000-000000000008','DEMO-REV-0008','EMP0018','Sanjay Malhotra','Probation Review','Quarterly','2026-06-01','2026-08-31','2026-09-01','Completed',3.8,4.0,4.0,'Meets Expectations','Quick ramp-up on CPQ; two dealer wins','Product depth on refrigeration line',false,false,NULL,true,true,'2026-09-01 15:00:00'),
  ('d1fe0000-0000-4000-8000-000000000009','DEMO-REV-0009','EMP0020','Rajesh Kumar','Probation Review','Quarterly','2026-07-15','2026-09-10','2026-09-20','Scheduled',NULL,NULL,NULL,'','','',false,false,NULL,false,false,'2026-09-05 10:00:00'),
  ('d1fe0000-0000-4000-8000-000000000010','DEMO-REV-0010','EMP0014','Mohan Das','Exit Review','Quarterly','2026-04-01','2026-09-30','2026-09-15','Manager Review',3.5,NULL,NULL,'','Accurate GRN and bin management','',false,false,NULL,true,false,'2026-09-05 10:00:00')
) AS v(id,num,emp,reviewer,rtype,cyc,pfrom,pto,rdate,status,self,mgr,fin,overall,strengths,areas,promo,salrec,pct,selfdone,mgrdone,crt)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ REVIEW MEETINGS
INSERT INTO hr_review_meetings
  ("companyId","reviewId","employeeId","employeeName",role,"meetingType",type,"scheduledDate","scheduledTime",duration,location,
   "meetingLink",status,agenda,notes,"createdAt","updatedAt")
SELECT :company, v.rev, e.id::text, e."firstName"||' '||e."lastName", v.role, 'review_discussion', v.type, v.sdate, v.stime, '45 min',
       v.loc, v.link, v.status, v.agenda, v.notes, v.crt::timestamp, v.crt::timestamp
FROM (VALUES
  ('EMP0007','d1fe0000-0000-4000-8000-000000000001','Production Manager','annual-review','2026-03-25','14:00','MD Cabin',NULL,'completed','FY2025-26 appraisal discussion and rating sign-off','Rating agreed at 4.4; increment recommended','2026-03-20 10:00:00'),
  ('EMP0011','d1fe0000-0000-4000-8000-000000000002','QC Engineer','annual-review','2026-03-26','11:00','MD Cabin',NULL,'completed','FY2025-26 appraisal discussion','Rating agreed at 4.2','2026-03-20 10:00:00'),
  ('EMP0015','d1fe0000-0000-4000-8000-000000000003','IT Manager','annual-review','2026-03-26','15:00','MD Cabin',NULL,'completed','FY2025-26 appraisal + promotion case','Promotion to Senior IT Manager endorsed','2026-03-20 10:00:00'),
  ('EMP0020','d1fe0000-0000-4000-8000-000000000009','Dispatch Assistant','probation-review','2026-09-20','10:30','HR Meeting Room',NULL,'scheduled','Probation assessment - dispatch accuracy and attendance',NULL,'2026-09-05 10:00:00'),
  ('EMP0014','d1fe0000-0000-4000-8000-000000000010','Store Assistant','exit-review','2026-09-15','16:00',NULL,'https://meet.demo.b3macbis.com/exit-emp0014','scheduled','Exit review and knowledge transfer confirmation',NULL,'2026-09-05 10:00:00')
) AS v(emp,rev,role,type,sdate,stime,loc,link,status,agenda,notes,crt)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ PERFORMANCE GOALS (discriminator table)
INSERT INTO hr_performance_goals
  ("companyId","recordType",title,status,data,"createdAt","updatedAt")
VALUES
  (:company,'my-goal','Reduce weld rework below 3%','in-progress','{"employeeCode":"EMP0009","employeeName":"Deepak Joshi","target":"3%","current":"4.1%","weightage":30,"dueDate":"2026-12-31","category":"quality"}','2026-04-15 10:00:00','2026-08-30 10:00:00'),
  (:company,'my-goal','Close 12 dealer accounts in west region','in-progress','{"employeeCode":"EMP0018","employeeName":"Pooja Mehta","target":12,"current":7,"weightage":40,"dueDate":"2027-03-31","category":"sales"}','2026-06-10 10:00:00','2026-09-01 10:00:00'),
  (:company,'my-goal','Complete NPD costing templates','completed','{"employeeCode":"EMP0006","employeeName":"Meera Nair","target":"100%","current":"100%","weightage":25,"dueDate":"2026-06-30","category":"finance"}','2026-04-15 10:00:00','2026-06-28 10:00:00'),
  (:company,'my-goal','Zero stock-out on fast-moving SS sheets','in-progress','{"employeeCode":"EMP0013","employeeName":"Mohan Das","target":"0 incidents","current":"1 incident","weightage":35,"dueDate":"2027-03-31","category":"stores"}','2026-04-15 10:00:00','2026-08-15 10:00:00'),
  (:company,'team-goal','Production: 94% line efficiency for H2','in-progress','{"owner":"Amit Verma","department":"Production","target":"94%","current":"92.5%","members":4,"dueDate":"2027-03-31"}','2026-04-20 10:00:00','2026-09-01 10:00:00'),
  (:company,'team-goal','Sales: Rs 9 Cr order booking H1 FY27','completed','{"owner":"Sanjay Malhotra","department":"Sales & Marketing","target":"Rs 9 Cr","current":"Rs 9.4 Cr","members":2,"dueDate":"2026-09-30"}','2026-04-20 10:00:00','2026-09-08 10:00:00'),
  (:company,'department-goal','QC: sustain FPY above 95%','in-progress','{"department":"Quality Control","owner":"Sunita Rao","target":"95%","current":"96.1%","dueDate":"2027-03-31"}','2026-04-20 10:00:00','2026-09-01 10:00:00'),
  (:company,'department-goal','Maintenance: downtime under 18 hrs/month','in-progress','{"department":"Maintenance","owner":"Ramesh Yadav","target":"18 hrs","current":"21 hrs","dueDate":"2027-03-31"}','2026-04-20 10:00:00','2026-09-01 10:00:00'),
  (:company,'kpi','On-Time Delivery - monthly tracking','active','{"kpiCode":"DEMO-KPI-003","owner":"Ganesh Patil","target":"95%","actuals":{"Jun-2026":93,"Jul-2026":96,"Aug-2026":95}}','2026-04-20 10:00:00','2026-09-01 10:00:00'),
  (:company,'kpi','First Pass Yield - monthly tracking','active','{"kpiCode":"DEMO-KPI-002","owner":"Sunita Rao","target":"95%","actuals":{"Jun-2026":95.8,"Jul-2026":96.4,"Aug-2026":96.1}}','2026-04-20 10:00:00','2026-09-01 10:00:00'),
  (:company,'feedback-target','Peer feedback - Deepak Joshi','pending','{"targetEmployeeCode":"EMP0009","requestedBy":"Amit Verma","cycle":"DEMO-CYC-FY27-H1","dueDate":"2026-09-15"}','2026-09-01 10:00:00','2026-09-01 10:00:00'),
  (:company,'feedback-target','Peer feedback - Pooja Mehta','submitted','{"targetEmployeeCode":"EMP0018","requestedBy":"Sanjay Malhotra","cycle":"DEMO-CYC-FY27-H1","submittedOn":"2026-09-06"}','2026-09-01 10:00:00','2026-09-06 10:00:00');

-- ============================================================ PERFORMANCE PIPs
INSERT INTO hr_performance_pips
  ("companyId","employeeId","employeeName",role,"managerId","managerName",reason,goals,"startDate","endDate",status,
   "actionItems",progress,"reviewNotes",outcome,"createdAt","updatedAt")
SELECT :company, e.id::text, e."firstName"||' '||e."lastName", v.role, m.id::text, v.mgr, v.reason, v.goals, v.sdate, v.edate, v.status,
       v.items::jsonb, v.prog, v.notes, v.outcome, v.sdate::timestamp + interval '9 hours', v.upd::timestamp
FROM (VALUES
  ('EMP0010','Helper','EMP0007','Amit Verma','Attendance below 85% and repeated finishing-quality escalations in Q4 FY2025-26',
   'Attendance >= 95%; zero finishing rejects on assigned batches; complete polishing re-training','2026-04-15','2026-07-15','completed',
   '[{"item":"Polishing & buffing re-training","done":true},{"item":"Weekly attendance check-in with supervisor","done":true},{"item":"Batch-wise quality sign-off","done":true}]',
   100,'Attendance 96% across PIP window; no rejects in June batches','Successfully closed; continued in role','2026-07-20 12:00:00'),
  ('EMP0012','QC Inspector','EMP0011','Sunita Rao','Complaint resolution TAT averaging 6.5 days against 3-day standard',
   'Bring average complaint TAT to 3 days; clear backlog of 14 open complaints','2026-07-01','2026-09-30','active',
   '[{"item":"Daily complaint triage stand-up","done":true},{"item":"Backlog burn-down plan","done":true},{"item":"TAT dashboard review with manager","done":false}]',
   60,'TAT down to 4.2 days as of Aug-end; backlog at 5',NULL,'2026-09-01 12:00:00'),
  ('EMP0014','Store Assistant','EMP0013','Mohan Das','Bin accuracy variances found in two consecutive cycle counts',
   'Zero variance in next two cycle counts; complete WMS refresher','2026-05-01','2026-06-30','completed',
   '[{"item":"WMS refresher training","done":true},{"item":"Supervised cycle counts","done":true}]',
   100,'Both June counts clean','Closed successfully; note - employee later resigned (relocation)','2026-07-05 12:00:00')
) AS v(emp,role,mgrcode,mgr,reason,goals,sdate,edate,status,items,prog,notes,outcome,upd)
JOIN hr_employees e ON e."employeeCode" = v.emp
JOIN hr_employees m ON m."employeeCode" = v.mgrcode;

-- ============================================================ PROBATION REVIEWS (discriminator table)
INSERT INTO hr_probation_reviews
  ("companyId","recordType","employeeCode",status,data,"createdAt","updatedAt")
VALUES
  (:company,'tracking','EMP0018','confirmed','{"employeeName":"Pooja Mehta","department":"Sales & Marketing","joiningDate":"2026-06-01","probationEndDate":"2026-09-01","daysRemaining":0,"mentor":"Sanjay Malhotra"}','2026-06-01 09:00:00','2026-09-02 10:00:00'),
  (:company,'tracking','EMP0020','on-track','{"employeeName":"Ganesh Patil","department":"Dispatch & Logistics","joiningDate":"2026-07-15","probationEndDate":"2026-10-15","daysRemaining":35,"mentor":"Rajesh Kumar"}','2026-07-15 09:00:00','2026-09-08 10:00:00'),
  (:company,'review','EMP0018','completed','{"employeeName":"Pooja Mehta","reviewDate":"2026-09-01","reviewer":"Sanjay Malhotra","rating":4.0,"recommendation":"Confirm","linkedReview":"DEMO-REV-0008"}','2026-09-01 15:00:00','2026-09-01 15:00:00'),
  (:company,'review','EMP0020','scheduled','{"employeeName":"Ganesh Patil","reviewDate":"2026-09-20","reviewer":"Rajesh Kumar","linkedReview":"DEMO-REV-0009"}','2026-09-05 10:00:00','2026-09-05 10:00:00'),
  (:company,'feedback','EMP0018','submitted','{"employeeName":"Pooja Mehta","from":"Sanjay Malhotra","summary":"Fast learner, strong client rapport, needs product depth on refrigeration","submittedOn":"2026-08-28"}','2026-08-28 11:00:00','2026-08-28 11:00:00'),
  (:company,'confirmation','EMP0018','confirmed','{"employeeName":"Pooja Mehta","confirmationDate":"2026-09-01","letterRef":"DEMO-CONF-2026-018","approvedBy":"Anita Desai"}','2026-09-02 10:00:00','2026-09-02 10:00:00');

-- ============================================================ POLICIES
INSERT INTO hr_policies
  ("companyId",title,category,version,summary,status,"effectiveDate","publishedAt","publishedBy","createdAt","updatedAt")
VALUES
  (:company,'Leave & Attendance Policy','hr','2.1','Leave types, accrual, carry-forward, comp-off and encashment rules','published','2025-10-01','2025-09-25 10:00:00','Anita Desai','2025-09-20 09:00:00','2025-09-25 10:00:00'),
  (:company,'Code of Conduct','compliance','1.4','Ethics, conflicts of interest, gifts and anti-bribery expectations','published','2025-10-01','2025-09-25 10:00:00','Anita Desai','2025-09-20 09:00:00','2025-09-25 10:00:00'),
  (:company,'POSH Policy','compliance','1.2','Prevention of sexual harassment; IC constitution and complaint process','published','2025-10-01','2025-09-25 10:00:00','Anita Desai','2025-09-20 09:00:00','2025-09-25 10:00:00'),
  (:company,'IT & Information Security Policy','it','3.0','Acceptable use, access control, password and data handling rules','published','2026-01-01','2025-12-20 10:00:00','Arun Gupta','2025-12-10 09:00:00','2025-12-20 10:00:00'),
  (:company,'Travel & Per Diem Policy','finance','2.0','Travel classes, per-diem grid (India + international) and claims process','published','2025-10-01','2025-09-25 10:00:00','Suresh Patel','2025-09-20 09:00:00','2025-09-25 10:00:00'),
  (:company,'Overtime & Comp-Off Policy','hr','1.1','OT authorisation, rates and comp-off credit rules for shop floor','published','2025-10-01','2025-09-25 10:00:00','Anita Desai','2025-09-20 09:00:00','2025-09-25 10:00:00'),
  (:company,'Factory Safety & PPE Policy','safety','2.3','Mandatory PPE zones, hot-work permits, incident reporting duty','published','2025-10-01','2025-09-25 10:00:00','Amit Verma','2025-09-20 09:00:00','2025-09-25 10:00:00'),
  (:company,'Work From Home Policy','hr','1.0','WFH eligibility (office roles), approval flow and 52-day annual cap','draft','2026-10-01',NULL,NULL,'2026-08-20 09:00:00','2026-08-20 09:00:00');

-- ============================================================ POLICY ACKNOWLEDGMENTS
INSERT INTO hr_policy_acknowledgments
  ("companyId","employeeId","employeeName",department,designation,"policyName","policyVersion","policyCategory",
   "assignedDate","dueDate","acknowledgmentDate","acknowledgedVia","remindersSent",remarks,status,"createdAt","updatedAt")
SELECT :company, e.id::text, e."firstName"||' '||e."lastName", v.dept, v.desig, v.policy, v.ver, v.cat,
       v.adate, v.due, v.ack, CASE WHEN v.ack IS NOT NULL THEN 'portal' END, v.rem, NULL, v.status,
       v.adate::timestamp + interval '9 hours', coalesce(v.ack,v.adate)::timestamp + interval '12 hours'
FROM (VALUES
  ('EMP0003','Human Resources','HR Manager','Code of Conduct','1.4','compliance','2025-10-01','2025-10-15','2025-10-03',0,'acknowledged'),
  ('EMP0005','Finance & Accounts','Finance Manager','Code of Conduct','1.4','compliance','2025-10-01','2025-10-15','2025-10-05',0,'acknowledged'),
  ('EMP0007','Production','Production Manager','Factory Safety & PPE Policy','2.3','safety','2025-10-01','2025-10-15','2025-10-02',0,'acknowledged'),
  ('EMP0009','Production','Welder','Factory Safety & PPE Policy','2.3','safety','2025-10-01','2025-10-15','2025-10-08',1,'acknowledged'),
  ('EMP0010','Production','Helper','Factory Safety & PPE Policy','2.3','safety','2025-10-01','2025-10-15','2025-10-14',2,'acknowledged'),
  ('EMP0019','Maintenance','Technician','Factory Safety & PPE Policy','2.3','safety','2025-10-01','2025-10-15','2025-10-06',0,'acknowledged'),
  ('EMP0015','Information Technology','IT Manager','IT & Information Security Policy','3.0','it','2026-01-02','2026-01-16','2026-01-03',0,'acknowledged'),
  ('EMP0016','Information Technology','Software Engineer','IT & Information Security Policy','3.0','it','2026-01-02','2026-01-16','2026-01-05',0,'acknowledged'),
  ('EMP0017','Sales & Marketing','Sales Manager','Travel & Per Diem Policy','2.0','finance','2025-10-01','2025-10-15','2025-10-04',0,'acknowledged'),
  ('EMP0018','Sales & Marketing','Sales Executive','Code of Conduct','1.4','compliance','2026-06-01','2026-06-15','2026-06-02',0,'acknowledged'),
  ('EMP0020','Dispatch & Logistics','Dispatch Assistant','Factory Safety & PPE Policy','2.3','safety','2026-07-15','2026-07-29',NULL,2,'pending'),
  ('EMP0013','Stores & Inventory','Storekeeper','Overtime & Comp-Off Policy','1.1','hr','2025-10-01','2025-10-15',NULL,3,'overdue')
) AS v(emp,dept,desig,policy,ver,cat,adate,due,ack,rem,status)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ POLICY VIOLATIONS
INSERT INTO hr_policy_violations
  ("companyId","employeeId","employeeName",department,designation,"policyName","violationType",category,severity,
   "violationDate","reportedDate","reportedBy",description,"actionTaken",status,remarks,"createdAt","updatedAt")
SELECT :company, e.id::text, e."firstName"||' '||e."lastName", v.dept, v.desig, v.policy, v.vtype, v.cat, v.sev,
       v.vdate, v.rdate, v.rep, v.descr, v.action, v.status, v.remarks,
       v.rdate::timestamp + interval '10 hours', v.rdate::timestamp + interval '10 hours'
FROM (VALUES
  ('EMP0010','Production','Helper','Factory Safety & PPE Policy','ppe-non-compliance','safety','medium','2025-11-12','2025-11-12','Amit Verma','Observed without safety goggles at buffing station','Verbal warning + PPE refresher','closed','Second occurrence triggers written warning'),
  ('EMP0009','Production','Welder','Factory Safety & PPE Policy','hot-work-permit','safety','high','2026-02-06','2026-02-06','Sunita Rao','Started welding on dispatch dock without hot-work permit','Written warning; permit process retraining','closed',NULL),
  ('EMP0016','Information Technology','Software Engineer','IT & Information Security Policy','credential-sharing','it','medium','2026-03-18','2026-03-19','Arun Gupta','Shared ERP admin credentials with contractor over chat','Password rotation; advisory issued','closed',NULL),
  ('EMP0012','Quality Control','QC Inspector','Code of Conduct','late-disclosure','compliance','low','2026-05-22','2026-05-25','Anita Desai','Delayed disclosure of relative employed at supplier firm','Disclosure recorded; recusal from that supplier audits','closed',NULL),
  ('EMP0020','Dispatch & Logistics','Dispatch Assistant','Overtime & Comp-Off Policy','unauthorised-overtime','hr','low','2026-08-29','2026-09-01','Anita Desai','Worked OT without prior supervisor authorisation','Pending review with supervisor','open',NULL)
) AS v(emp,dept,desig,policy,vtype,cat,sev,vdate,rdate,rep,descr,action,status,remarks)
JOIN hr_employees e ON e."employeeCode" = v.emp;

-- ============================================================ POSH COMPLAINTS
INSERT INTO hr_posh_complaints
  ("companyId","complaintCode",subject,description,"isAnonymous","complainantName","complainantEmployeeId","complainantDepartment",
   "respondentName","respondentDepartment","incidentDate","filingDate",severity,"assignedToName","icMembersInvolved",
   "inquiryStartDate","inquiryCompletionDate",findings,"actionTaken",status,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-POSH-001','Inappropriate remarks during shift briefing','Complainant reported repeated inappropriate comments by a co-worker during morning shift briefings.',
   false,'[Confidential - IC records]',NULL,'Production','[Confidential - IC records]','Production','2025-11-20','2025-11-24','high',
   'Anita Desai (Presiding Officer)','Anita Desai; Sunita Rao; External NGO member','2025-11-28','2026-01-20',
   'Allegation substantiated for two of three instances','Written warning; transfer to different shift; sensitisation training mandated','closed',
   '2025-11-24 10:00:00','2026-01-22 16:00:00'),
  (:company,'DEMO-POSH-002','Unwelcome messages outside work hours','Complainant reported unwelcome personal messages from a colleague on personal phone after work hours.',
   true,NULL,NULL,NULL,'[Confidential - IC records]','Sales & Marketing','2026-05-10','2026-05-13','normal',
   'Anita Desai (Presiding Officer)','Anita Desai; Meera Nair; External NGO member','2026-05-18','2026-07-02',
   'Conciliation requested by complainant under Sec 10; terms recorded','Conciliation concluded; conduct undertaking on record','closed',
   '2026-05-13 10:00:00','2026-07-03 16:00:00'),
  (:company,'DEMO-POSH-003','Discomfort over repeated personal questions','Complainant reported persistent personal questioning by a senior making them uncomfortable.',
   false,'[Confidential - IC records]',NULL,'Finance & Accounts','[Confidential - IC records]','Finance & Accounts','2026-08-18','2026-08-21','normal',
   'Anita Desai (Presiding Officer)','Anita Desai; Sunita Rao; External NGO member','2026-08-28',NULL,
   NULL,NULL,'inquiry','2026-08-21 10:00:00','2026-08-28 09:00:00');

-- ============================================================ PREVENTIVE MAINTENANCE (factory assets)
INSERT INTO hr_preventive_maintenance
  ("companyId","scheduleId","assetTag","assetName","assetCategory","maintenanceType",frequency,"lastMaintenanceDate",
   "nextMaintenanceDate","assignedTo","estimatedDuration",status,location,checklist,priority,remarks,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-PM-0001','B3-CNC-01','CNC Laser Cutting Machine','machinery','servicing','monthly','2026-08-12','2026-09-12','Ramesh Yadav',240,'upcoming','Fabrication Bay 1','Lens cleaning; rail lubrication; coolant check; nesting software backup','high',NULL,'2025-10-01 09:00:00','2026-08-12 17:00:00'),
  (:company,'DEMO-PM-0002','B3-PB-01','Hydraulic Press Brake 100T','machinery','inspection','monthly','2026-08-20','2026-09-20','Ramesh Yadav',180,'upcoming','Fabrication Bay 1','Hydraulic oil level; seal inspection; back-gauge calibration','high','Seal replaced during Nov-2025 OT job','2025-10-01 09:00:00','2026-08-20 17:00:00'),
  (:company,'DEMO-PM-0003','B3-WLD-03','TIG Welding Station Bank (6 units)','machinery','inspection','quarterly','2026-07-05','2026-10-05','Ramesh Yadav',120,'upcoming','Welding Bay','Torch consumables; gas line leak test; earthing check','medium',NULL,'2025-10-01 09:00:00','2026-07-05 17:00:00'),
  (:company,'DEMO-PM-0004','B3-PCB-01','Powder Coating Booth','machinery','servicing','quarterly','2026-06-15','2026-09-15','External - CoatTech Services',360,'upcoming','Finishing Shop','Filter replacement; gun calibration; oven temperature profile','medium',NULL,'2025-10-01 09:00:00','2026-06-15 17:00:00'),
  (:company,'DEMO-PM-0005','B3-CMP-01','Screw Air Compressor 75HP','electrical','servicing','quarterly','2026-08-01','2026-11-01','Ramesh Yadav',150,'completed','Utility Room','Oil change; air filter; belt tension; dryer check','medium','Aug-2026 service completed on schedule','2025-10-01 09:00:00','2026-08-01 17:00:00'),
  (:company,'DEMO-PM-0006','B3-DG-01','Diesel Generator 250 kVA','electrical','inspection','monthly','2026-08-25','2026-09-25','External - PowerServ AMC',90,'upcoming','Utility Yard','Load test; battery health; fuel filter; coolant','high','Breakdown in Jun-2026; AMC vendor changed','2025-10-01 09:00:00','2026-08-25 17:00:00'),
  (:company,'DEMO-PM-0007','B3-FL-02','Forklift 3T (Diesel)','vehicle','servicing','quarterly','2026-05-30','2026-08-30','External - GodrejService',120,'overdue','Dispatch Yard','Hydraulic lines; brakes; mast chain lubrication','high','Vendor slot awaited - escalated 2026-09-05','2025-10-01 09:00:00','2026-09-05 17:00:00'),
  (:company,'DEMO-PM-0008','B3-EOT-01','EOT Crane 5T','machinery','inspection','quarterly','2026-07-20','2026-10-20','External - CraneCare',180,'upcoming','Fabrication Bay 2','Wire rope inspection; limit switches; load test (annual)','high','Statutory Form 9 due with Oct inspection','2025-10-01 09:00:00','2026-07-20 17:00:00');

-- ============================================================ RECOGNITIONS (first 3 fixed ids: referenced by comments)
INSERT INTO hr_recognitions
  (id,"companyId","fromEmployeeId","fromEmployeeName","toEmployeeId","toEmployeeName","recognitionType",category,title,message,
   visibility,likes,"likedBy","createdAt","updatedAt")
SELECT v.id::uuid, :company, f.id::text, f."firstName"||' '||f."lastName", t.id::text, t."firstName"||' '||t."lastName",
       v.rtype, v.cat, v.title, v.msg, 'public', v.likes, v.likedby::text[], v.crt::timestamp, v.crt::timestamp
FROM (VALUES
  ('d1ec0000-0000-4000-8000-000000000001','EMP0001','EMP0015','star-performer','excellence','ERP go-live hero','Flawless cutover of the new ERP with zero downtime for production planning. Outstanding ownership, Arun!',14,'{EMP0002,EMP0003,EMP0005,EMP0016}','2025-12-05 11:00:00'),
  ('d1ec0000-0000-4000-8000-000000000002','EMP0007','EMP0009','spot-award','quality','Zero-defect Blue Fig batch','42 counter units delivered with zero weld rework on the Blue Fig Hotels order. Textbook craftsmanship.',9,'{EMP0008,EMP0010,EMP0011}','2026-02-20 15:00:00'),
  ('d1ec0000-0000-4000-8000-000000000003','EMP0017','EMP0018','kudos','sales','First big dealer win','Pooja closed the Golden Spoon regional dealer account within her first quarter. Great hustle!',11,'{EMP0001,EMP0002,EMP0017}','2026-08-18 10:00:00'),
  ('d1ec0000-0000-4000-8000-000000000004','EMP0005','EMP0006','kudos','finance','Clean statutory year','Zero notices, zero late fees across PF, PT and GST for FY2025-26. Quiet, consistent excellence.',7,'{EMP0001,EMP0003}','2026-04-10 10:00:00'),
  ('d1ec0000-0000-4000-8000-000000000005','EMP0011','EMP0012','team-award','quality','Complaint backlog crushed','Open complaints brought down from 14 to 5 in eight weeks. Keep the momentum.',5,'{EMP0011}','2026-08-31 10:00:00'),
  ('d1ec0000-0000-4000-8000-000000000006','EMP0001','EMP0019','spot-award','commitment','Monsoon night save','Restored the DG set at 2 AM during the June outage and saved the powder-coating batch.',12,'{EMP0007,EMP0008,EMP0009,EMP0010}','2026-06-23 09:00:00'),
  ('d1ec0000-0000-4000-8000-000000000007','EMP0003','EMP0020','kudos','onboarding','Fastest safety induction','Completed full safety induction and dispatch SOP certification within first week.',4,'{EMP0003}','2026-07-22 10:00:00'),
  ('d1ec0000-0000-4000-8000-000000000008','EMP0002','EMP0013','star-performer','operations','Year-end stock count champion','Physical verification of 2,800 SKUs closed in two days with 99.2% accuracy.',8,'{EMP0005,EMP0014}','2026-04-03 10:00:00')
) AS v(id,fromc,toc,rtype,cat,title,msg,likes,likedby,crt)
JOIN hr_employees f ON f."employeeCode" = v.fromc
JOIN hr_employees t ON t."employeeCode" = v.toc;

-- ============================================================ RECOGNITION COMMENTS
INSERT INTO hr_recognition_comments
  ("recognitionId","authorId","authorName",body,"createdAt")
SELECT v.rec, a.id::text, a."firstName"||' '||a."lastName", v.body, v.crt::timestamp
FROM (VALUES
  ('d1ec0000-0000-4000-8000-000000000001','EMP0002','Well deserved! The cutover weekend was seamless.','2025-12-05 13:00:00'),
  ('d1ec0000-0000-4000-8000-000000000001','EMP0016','Proud to be on this team. Congrats Arun!','2025-12-05 14:30:00'),
  ('d1ec0000-0000-4000-8000-000000000002','EMP0008','Deepak sets the bar for the whole welding bay.','2026-02-20 16:00:00'),
  ('d1ec0000-0000-4000-8000-000000000002','EMP0011','QC had literally nothing to flag. Superb.','2026-02-21 09:30:00'),
  ('d1ec0000-0000-4000-8000-000000000003','EMP0001','Great start Pooja - keep them coming!','2026-08-18 11:00:00'),
  ('d1ec0000-0000-4000-8000-000000000003','EMP0003','Fantastic first quarter. Congratulations!','2026-08-18 12:15:00')
) AS v(rec,author,body,crt)
JOIN hr_employees a ON a."employeeCode" = v.author;

-- ============================================================ REMEDIATION PLANS (audit findings)
INSERT INTO hr_remediation_plans
  ("companyId","planCode","planTitle",description,"findingCode","auditName",priority,"correctiveAction","rootCause",
   "responsiblePersonName","startDate","targetCompletionDate","actualCompletionDate","progressPercent","verificationNotes",status,"createdAt","updatedAt")
VALUES
  (:company,'DEMO-RP-001','Timely PF ECR filing controls','PF ECR for Sep-2025 filed 4 days late attracting interest','DEMO-FND-001','Statutory Compliance Audit FY2025-26','high',
   'Payroll calendar with T-5 alert to Finance; ECR prepared on cutoff+2','Single-person dependency in payroll processing','Meera Nair','2025-12-01','2026-01-31','2026-01-20',100,'Apr-Aug 2026 ECRs all filed before due date','closed','2025-12-01 10:00:00','2026-02-01 10:00:00'),
  (:company,'DEMO-RP-002','Contractor safety records','Contract workmen induction records incomplete for 6 of 18 workers','DEMO-FND-002','EHS Internal Audit H2-2025','high',
   'Gate-entry blocked without induction card; digital register in HRMS','No gate-level verification step','Amit Verma','2026-01-10','2026-03-31','2026-03-15',100,'Spot check on 2026-04-02: 18/18 compliant','closed','2026-01-10 10:00:00','2026-04-02 10:00:00'),
  (:company,'DEMO-RP-003','OT register vs payroll reconciliation','Overtime register hours mismatch with payroll OT payout in Dec-2025','DEMO-FND-003','Internal Payroll Audit Q3 FY2025-26','medium',
   'Monthly three-way reconciliation: biometric vs OT requests vs payroll','Manual OT entry without biometric cross-check','Anita Desai','2026-02-01','2026-04-30','2026-04-25',100,'Mar-Jun 2026 reconciliations clean','closed','2026-02-01 10:00:00','2026-04-28 10:00:00'),
  (:company,'DEMO-RP-004','EOT crane statutory test records','Form 9 load-test certificate for EOT crane nearing expiry without renewal plan','DEMO-FND-004','EHS Internal Audit H1-2026','high',
   'AMC vendor scope extended to include statutory testing; renewal tracker in CMMS','Statutory renewals tracked on spreadsheet only','Ramesh Yadav','2026-08-01','2026-10-31',NULL,55,NULL,'in-progress','2026-08-01 10:00:00','2026-09-05 10:00:00'),
  (:company,'DEMO-RP-005','Exit clearance turnaround','Full & final settlements averaging 62 days against 45-day policy','DEMO-FND-005','HR Process Audit FY2025-26','medium',
   'Parallel clearance workflow in HRMS with 7-day SLA per function','Sequential paper-based clearance routing','Anita Desai','2026-08-15','2026-11-30',NULL,30,NULL,'in-progress','2026-08-15 10:00:00','2026-09-08 10:00:00');

-- ============================================================ SAFETY DRILLS (recordType: drill + emergency contacts)
INSERT INTO hr_safety_drills
  ("companyId","recordType",code,name,"drillType",location,department,"conductedDate","scheduledDate",participants,duration,
   coordinator,"contactName",role,phone,"serviceType",effectiveness,description,status,remarks,"createdAt","updatedAt")
VALUES
  (:company,'drill','DEMO-DRL-001','Fire Evacuation Drill Q3','fire-evacuation','Factory + Admin Block',NULL,'2025-11-15',NULL,74,'22 min','Amit Verma',NULL,NULL,NULL,NULL,'good','Full evacuation to assembly point; two blocked-exit observations logged','completed','Exit B signage improved after drill','2025-11-10 09:00:00','2025-11-15 17:00:00'),
  (:company,'drill','DEMO-DRL-002','Fire Evacuation Drill Q4','fire-evacuation','Factory + Admin Block',NULL,'2026-02-21',NULL,78,'17 min','Amit Verma',NULL,NULL,NULL,NULL,'excellent','Evacuation time improved by 5 minutes over Q3 drill','completed',NULL,'2026-02-15 09:00:00','2026-02-21 17:00:00'),
  (:company,'drill','DEMO-DRL-003','First-Aid & CPR Response Drill','first-aid','Welding Bay','Production','2026-05-16',NULL,26,'45 min','Anita Desai',NULL,NULL,NULL,NULL,'good','Simulated arc-flash casualty; stretcher team response tested','completed','Two more first-aiders to be certified','2026-05-10 09:00:00','2026-05-16 17:00:00'),
  (:company,'drill','DEMO-DRL-004','Fire Evacuation Drill Q2 FY27','fire-evacuation','Factory + Admin Block',NULL,NULL,'2026-09-26',NULL,NULL,'Amit Verma',NULL,NULL,NULL,NULL,NULL,'Scheduled quarterly evacuation drill','scheduled',NULL,'2026-09-01 09:00:00','2026-09-01 09:00:00'),
  (:company,'contact','DEMO-EC-001','Fire Brigade - MIDC Station',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Station Officer','fire-response','101 / +91-22-2582-0101','fire',NULL,'Nearest fire station, 4.5 km from plant','active',NULL,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'contact','DEMO-EC-002','Lifeline Multi-speciality Hospital',NULL,NULL,NULL,NULL,NULL,NULL,NULL,NULL,'Emergency Desk','medical-emergency','+91-22-4890-6600','hospital',NULL,'24x7 trauma care; company tie-up for employee emergencies','active',NULL,'2025-10-01 09:00:00','2025-10-01 09:00:00');

-- ============================================================ SAFETY HAZARDS
INSERT INTO hr_safety_hazards
  ("companyId","recordType",code,title,category,location,department,"identifiedBy",date,severity,likelihood,"riskLevel","riskScore",
   owner,"controlMeasures",status,remarks,"createdAt","updatedAt")
VALUES
  (:company,'hazard','DEMO-HAZ-001','Weld fume accumulation in Bay 2','health','Welding Bay 2','Production','Sunita Rao','2025-10-22','high','likely','high',16,'Amit Verma','LEV extraction units installed at 4 stations; fume masks upgraded to P2','mitigated','Air quality re-test passed 2026-01-15','2025-10-22 10:00:00','2026-01-15 10:00:00'),
  (:company,'hazard','DEMO-HAZ-002','SS sheet offcuts - laceration risk','physical','Fabrication Bay 1','Production','Kiran Reddy','2025-12-04','medium','likely','medium',9,'Kiran Reddy','Dedicated offcut bins at each shear station; cut-resistant gloves mandatory','closed',NULL,'2025-12-04 10:00:00','2026-02-01 10:00:00'),
  (:company,'hazard','DEMO-HAZ-003','Forklift-pedestrian interface at dispatch','physical','Dispatch Yard','Dispatch & Logistics','Ganesh Patil','2026-01-19','high','possible','high',12,'Rajesh Kumar','Painted pedestrian walkways; forklift speed limit 5 km/h; reversing beacons','mitigated','Zebra marking refresh due Oct-2026','2026-01-19 10:00:00','2026-03-01 10:00:00'),
  (:company,'hazard','DEMO-HAZ-004','Powder coating booth - flammable dust','fire','Finishing Shop','Production','Amit Verma','2026-03-08','high','possible','high',12,'Amit Verma','ATEX-rated extraction; daily booth cleaning log; no hot work within 10 m','open','Awaiting ATEX motor upgrade quote','2026-03-08 10:00:00','2026-09-01 10:00:00'),
  (:company,'hazard','DEMO-HAZ-005','Wet floor near dishwash test rig','physical','Testing Area','Quality Control','Ajay Pillai','2026-04-14','low','likely','medium',6,'Sunita Rao','Anti-skid matting; floor drain regraded','closed',NULL,'2026-04-14 10:00:00','2026-05-10 10:00:00'),
  (:company,'hazard','DEMO-HAZ-006','Noise above 85 dB at polishing stations','health','Finishing Shop','Production','Anita Desai','2026-05-20','medium','likely','medium',9,'Amit Verma','Ear muffs mandatory; annual audiometry added to health checkup','mitigated',NULL,'2026-05-20 10:00:00','2026-07-01 10:00:00'),
  (:company,'hazard','DEMO-HAZ-007','Overloaded cable tray in server room','electrical','IT Server Room','Information Technology','Arun Gupta','2026-07-09','medium','possible','medium',8,'Arun Gupta','Cable tray extension installed; thermal scan quarterly','closed',NULL,'2026-07-09 10:00:00','2026-08-20 10:00:00'),
  (:company,'hazard','DEMO-HAZ-008','LPG manifold leak-test overdue','fire','Utility Yard','Maintenance','Ramesh Yadav','2026-08-27','high','possible','high',12,'Ramesh Yadav','Leak test scheduled with vendor; interim daily soap-solution checks','open','Vendor visit booked 2026-09-14','2026-08-27 10:00:00','2026-09-05 10:00:00');
