-- Demo seed — Production (part C): shifts, schedules, shop-floor, routing,
-- sustainability and team-collaboration tables for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this file's demo rows first, then re-inserts.
-- Delete predicates: DEMO- prefixed code/number columns where a unique/code
-- column exists; otherwise companyId = :company; production_shopfloor_attendance
-- and production_schedule_lines use employee_code LIKE 'EMP00%' / schedule_code
-- LIKE 'DEMO-%' markers respectively.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- Shift definitions (A/B/C)
-- ============================================================================
DELETE FROM production_shift_definitions WHERE code LIKE 'DEMO-%';
INSERT INTO production_shift_definitions
  (code, name, shift_type, start_time, end_time, duration, break_time, working_days,
   effective_from, effective_to, assigned_workers, status, allow_overtime_after, shift_premium,
   created_at, updated_at)
VALUES
  ('DEMO-SHIFT-A','Shift A (Morning)','day','06:00','14:00',8,45,'["Mon","Tue","Wed","Thu","Fri","Sat"]'::jsonb,
   '2025-10-01',NULL,8,'active',8,0,'2025-10-01 08:00:00+00','2026-09-01 08:00:00+00'),
  ('DEMO-SHIFT-B','Shift B (Afternoon)','evening','14:00','22:00',8,45,'["Mon","Tue","Wed","Thu","Fri","Sat"]'::jsonb,
   '2025-10-01',NULL,7,'active',8,150,'2025-10-01 08:00:00+00','2026-09-01 08:00:00+00'),
  ('DEMO-SHIFT-C','Shift C (Night)','night','22:00','06:00',8,60,'["Mon","Tue","Wed","Thu","Fri"]'::jsonb,
   '2025-10-01',NULL,5,'active',8,300,'2025-10-01 08:00:00+00','2026-09-01 08:00:00+00');

-- ============================================================================
-- Shifts (operational shift master; assignments FK onto this)
-- ============================================================================
DELETE FROM production_shift_assignments
  WHERE shift_id IN (SELECT id FROM production_shifts WHERE code LIKE 'DEMO-%');
DELETE FROM production_shifts WHERE code LIKE 'DEMO-%';
INSERT INTO production_shifts
  (company_id, code, name, description, shift_type, status, start_time, end_time,
   duration_hours, breaks, total_break_minutes, effective_hours, "workingDays",
   overtime_multiplier, night_shift_premium, min_staff, max_staff, supervisor_required,
   "requiredSkills", color_code, is_active, created_by, created_at, updated_at)
VALUES
  (:company,'DEMO-SH-A','Shift A','Morning production shift covering fabrication and assembly','day','active',
   '06:00','14:00',8.00,'[{"name":"Tea Break","minutes":15},{"name":"Lunch","minutes":30}]'::jsonb,45,7.25,
   '["Mon","Tue","Wed","Thu","Fri","Sat"]'::jsonb,1.5,1.00,6,10,true,
   '["sheet-metal","welding","assembly"]'::jsonb,'#2563eb',true,'EMP0001',
   '2025-10-01 08:00:00','2026-09-01 08:00:00'),
  (:company,'DEMO-SH-B','Shift B','Afternoon shift covering machining, painting and packing','evening','active',
   '14:00','22:00',8.00,'[{"name":"Tea Break","minutes":15},{"name":"Dinner","minutes":30}]'::jsonb,45,7.25,
   '["Mon","Tue","Wed","Thu","Fri","Sat"]'::jsonb,1.5,1.00,5,9,true,
   '["cnc","painting","packing"]'::jsonb,'#f59e0b',true,'EMP0001',
   '2025-10-01 08:00:00','2026-09-01 08:00:00'),
  (:company,'DEMO-SH-C','Shift C','Night shift for continuous CNC runs and maintenance windows','night','active',
   '22:00','06:00',8.00,'[{"name":"Midnight Break","minutes":30},{"name":"Tea Break","minutes":30}]'::jsonb,60,7.00,
   '["Mon","Tue","Wed","Thu","Fri"]'::jsonb,1.5,1.25,4,6,true,
   '["cnc","maintenance"]'::jsonb,'#7c3aed',true,'EMP0001',
   '2025-10-01 08:00:00','2026-09-01 08:00:00');

-- ============================================================================
-- Shift assignments (employees onto DEMO shifts, week of 2026-09-07)
-- ============================================================================
INSERT INTO production_shift_assignments
  (company_id, shift_id, work_center_id, employee_id, employee_name, assignment_date, status, role,
   is_supervisor, scheduled_start, scheduled_end, actual_start, actual_end, planned_hours, actual_hours,
   overtime_hours, break_duration_minutes, is_overtime, absence_reason, notes, assigned_by, created_at, updated_at)
VALUES
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-A'),'WC-CUT','EMP0004','Vikram Singh','2026-09-07','completed','Cutting Operator',
   false,'2026-09-07 06:00:00','2026-09-07 14:00:00','2026-09-07 05:55:00','2026-09-07 14:05:00',7.25,7.40,0,45,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-07 14:10:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-A'),'WC-WELD','EMP0005','Suresh Patel','2026-09-07','completed','Welder',
   false,'2026-09-07 06:00:00','2026-09-07 14:00:00','2026-09-07 06:02:00','2026-09-07 14:00:00',7.25,7.20,0,45,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-07 14:10:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-A'),'WC-ASSY','EMP0007','Amit Verma','2026-09-07','completed','Assembly Lead',
   true,'2026-09-07 06:00:00','2026-09-07 14:00:00','2026-09-07 05:50:00','2026-09-07 15:30:00',7.25,8.90,1.50,45,true,NULL,'Stayed back for WO-DEMO-0029 assembly close-out','EMP0001','2026-09-05 10:00:00','2026-09-07 15:35:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-B'),'WC-CNC','EMP0009','Deepak Joshi','2026-09-07','completed','CNC Operator',
   false,'2026-09-07 14:00:00','2026-09-07 22:00:00','2026-09-07 13:58:00','2026-09-07 22:00:00',7.25,7.25,0,45,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-07 22:05:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-B'),'WC-PAINT','EMP0010','Ravi Menon','2026-09-07','absent','Paint Booth Operator',
   false,'2026-09-07 14:00:00','2026-09-07 22:00:00',NULL,NULL,7.25,NULL,0,45,false,'Sick leave','Cover arranged from Shift A','EMP0001','2026-09-05 10:00:00','2026-09-07 14:30:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-B'),'WC-PACK','EMP0012','Ajay Pillai','2026-09-07','completed','Packer',
   false,'2026-09-07 14:00:00','2026-09-07 22:00:00','2026-09-07 14:05:00','2026-09-07 22:10:00',7.25,7.30,0,45,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-07 22:15:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-C'),'WC-CNC','EMP0013','Mohan Das','2026-09-07','completed','CNC Operator (Night)',
   false,'2026-09-07 22:00:00','2026-09-08 06:00:00','2026-09-07 21:55:00','2026-09-08 06:00:00',7.00,7.10,0,60,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-08 06:05:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-C'),'WC-QC','EMP0014','Lakshmi Iyer','2026-09-07','completed','Night QC Inspector',
   true,'2026-09-07 22:00:00','2026-09-08 06:00:00','2026-09-07 22:00:00','2026-09-08 06:00:00',7.00,7.00,0,60,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-08 06:05:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-A'),'WC-CUT','EMP0004','Vikram Singh','2026-09-08','completed','Cutting Operator',
   false,'2026-09-08 06:00:00','2026-09-08 14:00:00','2026-09-08 05:57:00','2026-09-08 14:00:00',7.25,7.25,0,45,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-08 14:05:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-A'),'WC-BEND','EMP0015','Arun Gupta','2026-09-08','completed','Press Brake Operator',
   false,'2026-09-08 06:00:00','2026-09-08 14:00:00','2026-09-08 06:00:00','2026-09-08 14:00:00',7.25,7.25,0,45,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-08 14:05:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-B'),'WC-CNC','EMP0009','Deepak Joshi','2026-09-08','active','CNC Operator',
   false,'2026-09-08 14:00:00','2026-09-08 22:00:00','2026-09-08 13:55:00',NULL,7.25,NULL,0,45,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-08 14:00:00'),
  (:company,(SELECT id FROM production_shifts WHERE code='DEMO-SH-C'),'WC-CNC','EMP0019','Ramesh Yadav','2026-09-09','scheduled','CNC Operator (Night)',
   false,'2026-09-09 22:00:00','2026-09-10 06:00:00',NULL,NULL,7.00,NULL,0,60,false,NULL,NULL,'EMP0001','2026-09-05 10:00:00','2026-09-05 10:00:00');

-- ============================================================================
-- Shop-floor attendance (clock-in/out per operator per shift)
-- ============================================================================
DELETE FROM production_shopfloor_attendance WHERE employee_code LIKE 'EMP00%';
INSERT INTO production_shopfloor_attendance
  (operator_id, operator_name, employee_code, work_center_id, work_center_name, shift, shift_date,
   clock_in, clock_out, total_produced, total_rejected, total_rework, downtime_minutes, status, notes,
   created_at, updated_at)
VALUES
  ('EMP0004','Vikram Singh','EMP0004','WC-CUT','Cutting Section','A','2026-09-07','2026-09-07 05:55:00+00','2026-09-07 14:05:00+00',120,2,1,15,'closed',NULL,'2026-09-07 05:55:00+00','2026-09-07 14:05:00+00'),
  ('EMP0005','Suresh Patel','EMP0005','WC-WELD','Welding Section','A','2026-09-07','2026-09-07 06:02:00+00','2026-09-07 14:00:00+00',48,1,2,0,'closed',NULL,'2026-09-07 06:02:00+00','2026-09-07 14:00:00+00'),
  ('EMP0007','Amit Verma','EMP0007','WC-ASSY','Assembly Section','A','2026-09-07','2026-09-07 05:50:00+00','2026-09-07 15:30:00+00',22,0,0,0,'closed','1.5h overtime for WO-DEMO-0029','2026-09-07 05:50:00+00','2026-09-07 15:30:00+00'),
  ('EMP0009','Deepak Joshi','EMP0009','WC-CNC','CNC Machining','B','2026-09-07','2026-09-07 13:58:00+00','2026-09-07 22:00:00+00',36,1,0,25,'closed','Tool change on VMC-850','2026-09-07 13:58:00+00','2026-09-07 22:00:00+00'),
  ('EMP0012','Ajay Pillai','EMP0012','WC-PACK','Packing Section','B','2026-09-07','2026-09-07 14:05:00+00','2026-09-07 22:10:00+00',54,0,0,0,'closed',NULL,'2026-09-07 14:05:00+00','2026-09-07 22:10:00+00'),
  ('EMP0013','Mohan Das','EMP0013','WC-CNC','CNC Machining','C','2026-09-07','2026-09-07 21:55:00+00','2026-09-08 06:00:00+00',30,0,1,0,'closed',NULL,'2026-09-07 21:55:00+00','2026-09-08 06:00:00+00'),
  ('EMP0014','Lakshmi Iyer','EMP0014','WC-QC','Quality Check','C','2026-09-07','2026-09-07 22:00:00+00','2026-09-08 06:00:00+00',85,3,2,0,'closed','Inspection lots for WO-DEMO-0027/0028','2026-09-07 22:00:00+00','2026-09-08 06:00:00+00'),
  ('EMP0004','Vikram Singh','EMP0004','WC-CUT','Cutting Section','A','2026-09-08','2026-09-08 05:57:00+00','2026-09-08 14:00:00+00',115,1,0,10,'closed',NULL,'2026-09-08 05:57:00+00','2026-09-08 14:00:00+00'),
  ('EMP0015','Arun Gupta','EMP0015','WC-BEND','Bending Section','A','2026-09-08','2026-09-08 06:00:00+00','2026-09-08 14:00:00+00',96,2,3,20,'closed','Press brake die changeover','2026-09-08 06:00:00+00','2026-09-08 14:00:00+00'),
  ('EMP0009','Deepak Joshi','EMP0009','WC-CNC','CNC Machining','B','2026-09-08','2026-09-08 13:55:00+00','2026-09-08 22:02:00+00',38,0,0,0,'closed',NULL,'2026-09-08 13:55:00+00','2026-09-08 22:02:00+00'),
  ('EMP0005','Suresh Patel','EMP0005','WC-WELD','Welding Section','A','2026-09-09','2026-09-09 06:00:00+00','2026-09-09 14:00:00+00',50,1,1,0,'closed',NULL,'2026-09-09 06:00:00+00','2026-09-09 14:00:00+00'),
  ('EMP0007','Amit Verma','EMP0007','WC-ASSY','Assembly Section','A','2026-09-10','2026-09-10 05:58:00+00',NULL,8,0,0,0,'open','Shift in progress','2026-09-10 05:58:00+00','2026-09-10 05:58:00+00');

-- ============================================================================
-- Shop-floor material requests
-- ============================================================================
DELETE FROM production_shopfloor_material_requests WHERE request_number LIKE 'DEMO-%';
INSERT INTO production_shopfloor_material_requests
  (request_number, work_order_id, work_order_number, work_center_id, work_center_name,
   operator_id, operator_name, item_code, item_name, quantity, uom, urgency, status, notes,
   requested_at, created_at, updated_at)
VALUES
  ('DEMO-MR-0001',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0026'),'WO-DEMO-0026','WC-CUT','Cutting Section','EMP0004','Vikram Singh','RM-STL-001','Steel Sheet 2mm',40,'PCS','high','issued','Sheet stock for motor housings','2026-09-07 06:30:00','2026-09-07 06:30:00+00','2026-09-07 08:10:00+00'),
  ('DEMO-MR-0002',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0026'),'WO-DEMO-0026','WC-CNC','CNC Machining','EMP0009','Deepak Joshi','TOOL-INS-001','Carbide Insert CNMG 120408',10,'PCS','normal','issued',NULL,'2026-09-07 14:20:00','2026-09-07 14:20:00+00','2026-09-07 15:00:00+00'),
  ('DEMO-MR-0003',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0027'),'WO-DEMO-0027','WC-ASSY','Assembly Section','EMP0007','Amit Verma','SP-SL-001','Mechanical Seal MS-40',24,'PCS','urgent','issued','Pump seals for CP-200 batch','2026-09-07 07:10:00','2026-09-07 07:10:00+00','2026-09-07 07:45:00+00'),
  ('DEMO-MR-0004',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'WO-DEMO-0028','WC-CNC','CNC Machining','EMP0013','Mohan Das','CON-CLT-001','Cutting Coolant Concentrate',2,'CAN','normal','issued','Night-shift coolant top-up','2026-09-07 22:40:00','2026-09-07 22:40:00+00','2026-09-08 00:15:00+00'),
  ('DEMO-MR-0005',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0029'),'WO-DEMO-0029','WC-WELD','Welding Section','EMP0005','Suresh Patel','RM-ALM-001','Aluminum Rod 20mm',30,'PCS','high','approved',NULL,'2026-09-08 06:45:00','2026-09-08 06:45:00+00','2026-09-08 09:00:00+00'),
  ('DEMO-MR-0006',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0029'),'WO-DEMO-0029','WC-ASSY','Assembly Section','EMP0007','Amit Verma','SP-BRG-001','Ball Bearing 6205',40,'PCS','urgent','pending','Bearing stock low at line-side rack','2026-09-09 08:05:00','2026-09-09 08:05:00+00','2026-09-09 08:05:00+00'),
  ('DEMO-MR-0007',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0030'),'WO-DEMO-0030','WC-CUT','Cutting Section','EMP0004','Vikram Singh','RM-STL-001','Steel Sheet 2mm',18,'PCS','normal','pending',NULL,'2026-09-09 10:30:00','2026-09-09 10:30:00+00','2026-09-09 10:30:00+00'),
  ('DEMO-MR-0008',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0025'),'WO-DEMO-0025','WC-PAINT','Painting Section','EMP0010','Ravi Menon','CON-LUB-001','Industrial Lubricant Oil ISO VG 68',1,'CAN','low','rejected','Duplicate of an earlier request','2026-09-06 15:00:00','2026-09-06 15:00:00+00','2026-09-06 16:30:00+00');

-- ============================================================================
-- Shortage records
-- ============================================================================
DELETE FROM production_shortage_records WHERE shortage_number LIKE 'DEMO-%';
INSERT INTO production_shortage_records
  (company_id, shortage_number, status, severity, item_id, item_code, item_name, shortage_date,
   required_quantity, available_quantity, shortage_quantity, uom, "affectedOrders", "resolutionOptions",
   selected_resolution, resolution_notes, resolved_by, resolved_at, escalated_to, escalated_at,
   estimated_impact_cost, currency, created_by, created_at, updated_at)
VALUES
  (:company,'DEMO-SHRT-0001','resolved','high',(SELECT id::text FROM items WHERE "itemCode"='SP-BRG-001'),'SP-BRG-001','Ball Bearing 6205','2026-08-12',
   120,45,75,'PCS','[{"workOrder":"WO-DEMO-0026","qty":40},{"workOrder":"WO-DEMO-0029","qty":35}]'::jsonb,
   '[{"option":"expedite_po","leadDays":3},{"option":"alternate_vendor","leadDays":5}]'::jsonb,
   'expedite_po','Expedited PO with Industrial Components Ltd., air freight','EMP0002','2026-08-15 11:00:00',NULL,NULL,45000,'INR','EMP0003','2026-08-12 09:30:00','2026-08-15 11:00:00'),
  (:company,'DEMO-SHRT-0002','resolved','medium',(SELECT id::text FROM items WHERE "itemCode"='RM-STL-001'),'RM-STL-001','Steel Sheet 2mm','2026-08-20',
   300,210,90,'PCS','[{"workOrder":"WO-DEMO-0028","qty":90}]'::jsonb,
   '[{"option":"partial_release","note":"release 210 now"},{"option":"expedite_po","leadDays":4}]'::jsonb,
   'partial_release','Released 210 sheets; balance covered by scheduled delivery 24-Aug','EMP0002','2026-08-24 10:00:00',NULL,NULL,18000,'INR','EMP0003','2026-08-20 08:45:00','2026-08-24 10:00:00'),
  (:company,'DEMO-SHRT-0003','open','critical',(SELECT id::text FROM items WHERE "itemCode"='SP-SL-001'),'SP-SL-001','Mechanical Seal MS-40','2026-09-05',
   60,12,48,'PCS','[{"workOrder":"WO-DEMO-0027","qty":24},{"workOrder":"WO-DEMO-0030","qty":24}]'::jsonb,
   '[{"option":"alternate_vendor","leadDays":7},{"option":"substitute_item","note":"MS-42 pending QC approval"}]'::jsonb,
   NULL,NULL,NULL,NULL,NULL,NULL,92000,'INR','EMP0003','2026-09-05 09:00:00','2026-09-05 09:00:00'),
  (:company,'DEMO-SHRT-0004','escalated','high',(SELECT id::text FROM items WHERE "itemCode"='RM-COP-001'),'RM-COP-001','Copper Wire 2.5mm','2026-09-07',
   500,180,320,'MTR','[{"workOrder":"WO-DEMO-0029","qty":320}]'::jsonb,
   '[{"option":"expedite_po","leadDays":6},{"option":"spot_buy","note":"local market premium 12%"}]'::jsonb,
   NULL,NULL,NULL,NULL,'EMP0002','2026-09-08 14:00:00',68000,'INR','EMP0003','2026-09-07 10:15:00','2026-09-08 14:00:00'),
  (:company,'DEMO-SHRT-0005','open','low',(SELECT id::text FROM items WHERE "itemCode"='TOOL-DRL-001'),'TOOL-DRL-001','HSS Drill Bit Set 1-13mm','2026-09-08',
   6,2,4,'SET','[]'::jsonb,'[{"option":"standard_po","leadDays":10}]'::jsonb,
   NULL,NULL,NULL,NULL,NULL,NULL,6500,'INR','EMP0003','2026-09-08 11:20:00','2026-09-08 11:20:00'),
  (:company,'DEMO-SHRT-0006','cancelled','medium',(SELECT id::text FROM items WHERE "itemCode"='CON-CLT-001'),'CON-CLT-001','Cutting Coolant Concentrate','2026-07-15',
   20,8,12,'CAN','[]'::jsonb,'[{"option":"standard_po","leadDays":5}]'::jsonb,
   NULL,'Duplicate — stock located in secondary store during cycle count','EMP0002','2026-07-16 09:00:00',NULL,NULL,0,'INR','EMP0003','2026-07-15 13:00:00','2026-07-16 09:00:00');

-- ============================================================================
-- Shutter orders (kitchen-equipment shutter fabrication)
-- ============================================================================
DELETE FROM production_shutter_orders WHERE wo_number LIKE 'DEMO-%';
INSERT INTO production_shutter_orders
  (wo_number, product_name, shutter_type, quantity, completed_quantity, status, assigned_to,
   start_date, target_date, dimensions, finish, notes, created_at, updated_at)
VALUES
  ('DEMO-SHUT-0001','Wall Cabinet Glass Shutter Set','Glass',24,24,'Installed','Suresh Patel','2026-07-01','2026-07-18','600x720 mm','Frosted glass, satin frame','Harbour Grill kitchen refit','2026-06-28 09:00:00+00','2026-07-20 10:00:00+00'),
  ('DEMO-SHUT-0002','Base Cabinet Steel Shutter','Steel',36,36,'Ready','Arun Gupta','2026-07-22','2026-08-08','450x680 mm','Brushed SS-304','Awaiting dispatch to Blue Fig Hotels site','2026-07-20 09:00:00+00','2026-08-08 16:00:00+00'),
  ('DEMO-SHUT-0003','Pantry Unit Wood Shutter','Wood',18,12,'In Production','Ganesh Patil','2026-08-18','2026-09-15','500x700 mm','Teak laminate, matte','Edge banding in progress','2026-08-15 09:00:00+00','2026-09-08 11:00:00+00'),
  ('DEMO-SHUT-0004','Display Counter Glass Shutter','Glass',12,4,'In Production','Suresh Patel','2026-08-25','2026-09-20','900x500 mm','Clear toughened glass','Toughening batch 2 due 12-Sep','2026-08-22 09:00:00+00','2026-09-07 15:00:00+00'),
  ('DEMO-SHUT-0005','Utility Rack Steel Shutter','Steel',20,0,'Pending','Arun Gupta','2026-09-12','2026-09-30','400x600 mm','Powder coat RAL 7035','Material reserved, start after WO-DEMO-0030','2026-09-05 09:00:00+00','2026-09-05 09:00:00+00'),
  ('DEMO-SHUT-0006','Chef Station Wood Shutter','Wood',10,10,'Installed','Ganesh Patil','2026-06-05','2026-06-25','550x650 mm','Walnut veneer, PU gloss','Campus Dining Co-op order','2026-06-01 09:00:00+00','2026-06-27 12:00:00+00'),
  ('DEMO-SHUT-0007','Cold Room Steel Shutter','Steel',8,8,'Ready','Arun Gupta','2026-08-01','2026-08-20','700x900 mm','Insulated SS panel','QC cleared 21-Aug','2026-07-29 09:00:00+00','2026-08-21 10:00:00+00'),
  ('DEMO-SHUT-0008','Bar Counter Glass Shutter','Glass',15,0,'Pending','Suresh Patel','2026-09-20','2026-10-10','800x450 mm','Tinted bronze glass','Glass sheets on order','2026-09-08 09:00:00+00','2026-09-08 09:00:00+00');

-- ============================================================================
-- Simulation scenarios
-- ============================================================================
DELETE FROM production_simulation_scenarios WHERE scenario_number LIKE 'DEMO-%';
INSERT INTO production_simulation_scenarios
  (company_id, scenario_number, name, description, simulation_type, status, simulation_start, simulation_end,
   time_horizon_days, "baselineScenario", "inputParameters", "simulationResults", "comparisonWithBaseline",
   recommendations, currency, created_by, run_by, run_at, created_at, updated_at)
VALUES
  (:company,'DEMO-SIM-0001','Q3 Capacity Stress Test','What happens to on-time delivery if demand rises 25% across FG lines','capacity','completed',
   '2026-07-01 00:00:00','2026-09-30 00:00:00',90,
   '{"otd":94.2,"utilization":78.5}'::jsonb,'{"demandUplift":0.25,"overtimeAllowed":true,"maxOvertimeHoursWeek":12}'::jsonb,
   '{"otd":88.1,"utilization":93.4,"bottleneck":"WC-CNC"}'::jsonb,'{"otdDelta":-6.1,"utilizationDelta":14.9}'::jsonb,
   '["Add weekend CNC shift","Offload gearbox housings to subcontractor"]'::jsonb,'INR','EMP0002','EMP0002','2026-07-05 14:30:00','2026-07-03 10:00:00','2026-07-05 14:30:00'),
  (:company,'DEMO-SIM-0002','Night Shift Consolidation','Impact of merging Shift C into extended B shift','scheduling','completed',
   '2026-08-01 00:00:00','2026-08-31 00:00:00',30,
   '{"laborCost":1850000,"otd":94.2}'::jsonb,'{"shiftsRemoved":["C"],"shiftBExtendedHours":2}'::jsonb,
   '{"laborCost":1690000,"otd":91.5,"cncQueueHours":18}'::jsonb,'{"laborCostDelta":-160000,"otdDelta":-2.7}'::jsonb,
   '["Keep Shift C for CNC only","Cross-train 2 Shift B operators"]'::jsonb,'INR','EMP0002','EMP0002','2026-08-03 16:00:00','2026-08-01 09:00:00','2026-08-03 16:00:00'),
  (:company,'DEMO-SIM-0003','Pump Line What-If: New Fixture','Cycle-time reduction from hydraulic assembly fixture on CP-200 line','what_if','completed',
   '2026-08-15 00:00:00','2026-09-15 00:00:00',31,
   '{"cycleTimeMin":42,"outputPerShift":10}'::jsonb,'{"fixtureCost":450000,"cycleTimeReductionPct":18}'::jsonb,
   '{"cycleTimeMin":34.4,"outputPerShift":12.2,"paybackMonths":7.5}'::jsonb,'{"outputDelta":2.2}'::jsonb,
   '["Approve fixture CAPEX","Re-rate CP-200 routing after install"]'::jsonb,'INR','EMP0002','EMP0009','2026-08-18 12:00:00','2026-08-15 09:00:00','2026-08-18 12:00:00'),
  (:company,'DEMO-SIM-0004','Festive Season Demand Surge','Demand scenario for Oct-Nov festive orders on motor line','demand','running',
   '2026-10-01 00:00:00','2026-11-30 00:00:00',61,
   '{"forecastUnits":420}'::jsonb,'{"surgeFactor":1.4,"priorityCustomers":["Golden Spoon Franchises"]}'::jsonb,
   NULL,NULL,NULL,'INR','EMP0002','EMP0002','2026-09-08 10:00:00','2026-09-06 09:00:00','2026-09-08 10:00:00'),
  (:company,'DEMO-SIM-0005','Welder Resource Rebalance','Resource simulation moving one welder from Shift A to Shift B','resource','draft',
   NULL,NULL,30,'{"weldQueueHoursA":4,"weldQueueHoursB":11}'::jsonb,
   '{"moveOperators":1,"fromShift":"A","toShift":"B"}'::jsonb,NULL,NULL,NULL,'INR','EMP0002',NULL,NULL,'2026-09-09 11:00:00','2026-09-09 11:00:00');

-- ============================================================================
-- Skill matrices
-- ============================================================================
DELETE FROM production_skill_matrices WHERE company_id = :company;
INSERT INTO production_skill_matrices
  (company_id, employee_id, employee_name, employee_code, department, job_title, skills, certifications,
   "trainingHistory", "trainingNeeds", "equipmentCertifications", "processQualifications",
   overall_skill_score, versatility_index, last_assessment_date, next_assessment_due, assessed_by,
   is_active, created_at, updated_at)
VALUES
  (:company,'EMP0004','Vikram Singh','EMP0004','Production','Cutting Operator',
   '[{"skill":"Laser Cutting","category":"technical","level":"expert"},{"skill":"Shearing","category":"technical","level":"proficient"},{"skill":"5S","category":"process","level":"competent"}]'::jsonb,
   '[{"name":"Laser Safety Level 2","validTill":"2027-03-31"}]'::jsonb,
   '[{"course":"Advanced Nesting Software","date":"2026-02-10"}]'::jsonb,'[]'::jsonb,
   '[{"equipment":"CNC Laser LC-3015","certified":true}]'::jsonb,'[{"process":"Sheet Cutting","qualified":true}]'::jsonb,
   86.5,72.0,'2026-06-15','2026-12-15','EMP0001',true,'2025-10-10 09:00:00','2026-06-15 10:00:00'),
  (:company,'EMP0005','Suresh Patel','EMP0005','Production','Welder',
   '[{"skill":"MIG Welding","category":"technical","level":"expert"},{"skill":"TIG Welding","category":"technical","level":"proficient"},{"skill":"Weld Inspection","category":"quality","level":"competent"}]'::jsonb,
   '[{"name":"AWS D1.1 Structural","validTill":"2027-01-31"}]'::jsonb,
   '[{"course":"SS-304 TIG Refresher","date":"2026-04-22"}]'::jsonb,
   '[{"skill":"Robot Welding","priority":"high"}]'::jsonb,
   '[{"equipment":"MIG Station W-02","certified":true}]'::jsonb,'[{"process":"Frame Welding","qualified":true}]'::jsonb,
   88.0,65.0,'2026-06-15','2026-12-15','EMP0001',true,'2025-10-10 09:00:00','2026-06-15 10:00:00'),
  (:company,'EMP0007','Amit Verma','EMP0007','Production','Assembly Lead',
   '[{"skill":"Mechanical Assembly","category":"technical","level":"expert"},{"skill":"Team Leadership","category":"leadership","level":"proficient"},{"skill":"Torque Control","category":"quality","level":"expert"}]'::jsonb,
   '[{"name":"Certified Assembly Technician","validTill":"2028-05-31"}]'::jsonb,
   '[{"course":"Line Balancing Workshop","date":"2026-01-18"}]'::jsonb,'[]'::jsonb,
   '[{"equipment":"Torque Station T-01","certified":true}]'::jsonb,'[{"process":"Motor Assembly","qualified":true},{"process":"Pump Assembly","qualified":true}]'::jsonb,
   91.0,84.0,'2026-06-16','2026-12-16','EMP0001',true,'2025-10-10 09:00:00','2026-06-16 10:00:00'),
  (:company,'EMP0009','Deepak Joshi','EMP0009','Production','CNC Operator',
   '[{"skill":"CNC Milling","category":"technical","level":"expert"},{"skill":"CAM Programming","category":"technical","level":"competent"},{"skill":"Tool Setting","category":"equipment","level":"proficient"}]'::jsonb,
   '[{"name":"Fanuc Operator Level 2","validTill":"2027-08-31"}]'::jsonb,
   '[{"course":"Macro Programming Basics","date":"2026-03-05"}]'::jsonb,
   '[{"skill":"5-Axis Machining","priority":"medium"}]'::jsonb,
   '[{"equipment":"VMC-850","certified":true}]'::jsonb,'[{"process":"Gearbox Housing Machining","qualified":true}]'::jsonb,
   84.0,58.0,'2026-06-16','2026-12-16','EMP0001',true,'2025-10-10 09:00:00','2026-06-16 10:00:00'),
  (:company,'EMP0010','Ravi Menon','EMP0010','Production','Paint Booth Operator',
   '[{"skill":"Powder Coating","category":"technical","level":"proficient"},{"skill":"Surface Prep","category":"process","level":"proficient"},{"skill":"Booth Maintenance","category":"equipment","level":"competent"}]'::jsonb,
   '[]'::jsonb,'[{"course":"Powder Coat Thickness Control","date":"2026-05-12"}]'::jsonb,
   '[{"skill":"Wet Paint Application","priority":"low"}]'::jsonb,
   '[{"equipment":"Paint Booth PB-01","certified":true}]'::jsonb,'[{"process":"Powder Coating","qualified":true}]'::jsonb,
   74.5,49.0,'2026-06-17','2026-12-17','EMP0001',true,'2025-10-10 09:00:00','2026-06-17 10:00:00'),
  (:company,'EMP0012','Ajay Pillai','EMP0012','Production','Packer',
   '[{"skill":"Export Packing","category":"process","level":"proficient"},{"skill":"Forklift Operation","category":"equipment","level":"competent"},{"skill":"Labeling & Marking","category":"process","level":"proficient"}]'::jsonb,
   '[{"name":"Forklift License","validTill":"2027-06-30"}]'::jsonb,'[]'::jsonb,'[]'::jsonb,
   '[{"equipment":"Forklift F-02","certified":true}]'::jsonb,'[{"process":"FG Packing","qualified":true}]'::jsonb,
   70.0,55.0,'2026-06-17','2026-12-17','EMP0001',true,'2025-10-10 09:00:00','2026-06-17 10:00:00'),
  (:company,'EMP0013','Mohan Das','EMP0013','Production','CNC Operator (Night)',
   '[{"skill":"CNC Milling","category":"technical","level":"proficient"},{"skill":"CNC Turning","category":"technical","level":"competent"},{"skill":"Lockout-Tagout","category":"safety","level":"proficient"}]'::jsonb,
   '[{"name":"Fanuc Operator Level 1","validTill":"2027-02-28"}]'::jsonb,
   '[{"course":"Night Shift Safety Induction","date":"2025-11-02"}]'::jsonb,
   '[{"skill":"CAM Programming","priority":"high"}]'::jsonb,
   '[{"equipment":"VMC-850","certified":true}]'::jsonb,'[{"process":"Shaft Machining","qualified":true}]'::jsonb,
   76.0,61.0,'2026-06-18','2026-12-18','EMP0001',true,'2025-10-10 09:00:00','2026-06-18 10:00:00'),
  (:company,'EMP0014','Lakshmi Iyer','EMP0014','Quality','QC Inspector',
   '[{"skill":"CMM Inspection","category":"quality","level":"expert"},{"skill":"GD&T","category":"quality","level":"proficient"},{"skill":"Incoming Inspection","category":"quality","level":"expert"}]'::jsonb,
   '[{"name":"Certified Quality Inspector (ASQ)","validTill":"2027-10-31"}]'::jsonb,
   '[{"course":"MSA Refresher","date":"2026-02-25"}]'::jsonb,'[]'::jsonb,
   '[{"equipment":"CMM Zeiss Contura","certified":true}]'::jsonb,'[{"process":"Final Inspection","qualified":true}]'::jsonb,
   89.5,66.0,'2026-06-18','2026-12-18','EMP0001',true,'2025-10-10 09:00:00','2026-06-18 10:00:00'),
  (:company,'EMP0015','Arun Gupta','EMP0015','Production','Press Brake Operator',
   '[{"skill":"Press Brake Bending","category":"technical","level":"proficient"},{"skill":"Die Setup","category":"equipment","level":"proficient"},{"skill":"Machine Guarding","category":"safety","level":"competent"}]'::jsonb,
   '[]'::jsonb,'[{"course":"Bend Allowance Calculations","date":"2026-04-08"}]'::jsonb,
   '[{"skill":"Laser Cutting","priority":"medium"}]'::jsonb,
   '[{"equipment":"Press Brake PB-110","certified":true}]'::jsonb,'[{"process":"Sheet Bending","qualified":true}]'::jsonb,
   77.5,57.0,'2026-06-19','2026-12-19','EMP0001',true,'2025-10-10 09:00:00','2026-06-19 10:00:00'),
  (:company,'EMP0019','Ramesh Yadav','EMP0019','Production','CNC Operator (Trainee)',
   '[{"skill":"CNC Milling","category":"technical","level":"beginner"},{"skill":"Deburring","category":"technical","level":"competent"},{"skill":"Housekeeping","category":"process","level":"competent"}]'::jsonb,
   '[]'::jsonb,'[{"course":"CNC Basics Bootcamp","date":"2026-07-14"}]'::jsonb,
   '[{"skill":"Tool Setting","priority":"high"},{"skill":"Blueprint Reading","priority":"high"}]'::jsonb,
   '[]'::jsonb,'[]'::jsonb,
   52.0,34.0,'2026-07-20','2026-10-20','EMP0009',true,'2026-07-01 09:00:00','2026-07-20 10:00:00');

-- ============================================================================
-- Spare parts
-- ============================================================================
DELETE FROM production_spare_parts WHERE part_number LIKE 'DEMO-%';
INSERT INTO production_spare_parts
  (part_number, part_name, category, equipment_compatibility, quantity_in_stock, minimum_stock,
   reorder_point, unit, unit_cost, location, supplier, lead_time, last_purchase_date, usage_rate,
   status, created_at, updated_at)
VALUES
  ('DEMO-SP-0001','Spindle Bearing Set VMC-850','mechanical','["CNC Milling Machine VMC-850"]'::jsonb,4,2,3,'SET',18500.00,'Store A / Rack 3','ProTool Equipment Inc.',21,'2026-06-14',0.30,'adequate','2025-10-05 09:00:00+00','2026-06-14 10:00:00+00'),
  ('DEMO-SP-0002','Servo Drive 2kW','electrical','["CNC Milling Machine VMC-850","Press Brake PB-110"]'::jsonb,1,1,2,'PCS',42000.00,'Store A / Rack 5','ElectroTech Supplies',30,'2026-03-20',0.10,'low','2025-10-05 09:00:00+00','2026-08-30 10:00:00+00'),
  ('DEMO-SP-0003','Hydraulic Seal Kit PB-110','hydraulic','["Press Brake PB-110"]'::jsonb,6,3,4,'KIT',3200.00,'Store A / Rack 2','MaintainPro Services',14,'2026-07-02',0.50,'adequate','2025-10-05 09:00:00+00','2026-07-02 10:00:00+00'),
  ('DEMO-SP-0004','Laser Focusing Lens','optical','["CNC Laser LC-3015"]'::jsonb,2,2,3,'PCS',9800.00,'Store B / Cabinet 1','ProTool Equipment Inc.',18,'2026-05-11',0.25,'low','2025-10-05 09:00:00+00','2026-08-25 10:00:00+00'),
  ('DEMO-SP-0005','Welding Torch Liner','consumable','["MIG Station W-01","MIG Station W-02"]'::jsonb,25,10,15,'PCS',450.00,'Line-side / Weld Bay','Industrial Components Ltd.',7,'2026-08-18',4.00,'adequate','2025-10-05 09:00:00+00','2026-08-18 10:00:00+00'),
  ('DEMO-SP-0006','Paint Booth Filter Pad','consumable','["Paint Booth PB-01"]'::jsonb,8,12,16,'PCS',780.00,'Store B / Rack 1','Chemical Solutions GmbH',10,'2026-08-01',3.00,'critical','2025-10-05 09:00:00+00','2026-09-05 10:00:00+00'),
  ('DEMO-SP-0007','Conveyor Drive Belt','mechanical','["Assembly Conveyor AC-01"]'::jsonb,3,2,2,'PCS',2600.00,'Store A / Rack 4','Prime Steel Suppliers',12,'2026-04-27',0.40,'adequate','2025-10-05 09:00:00+00','2026-04-27 10:00:00+00'),
  ('DEMO-SP-0008','Pneumatic Solenoid Valve 24V','pneumatic','["Torque Station T-01","Assembly Conveyor AC-01"]'::jsonb,0,2,3,'PCS',1850.00,'Store A / Rack 5','ElectroTech Supplies',15,'2026-02-09',0.20,'stockout','2025-10-05 09:00:00+00','2026-09-01 10:00:00+00'),
  ('DEMO-SP-0009','Coolant Pump Impeller','mechanical','["CNC Milling Machine VMC-850"]'::jsonb,5,2,3,'PCS',1200.00,'Store A / Rack 3','MaintainPro Services',9,'2026-06-30',0.35,'adequate','2025-10-05 09:00:00+00','2026-06-30 10:00:00+00'),
  ('DEMO-SP-0010','Control Panel Contactor 32A','electrical','["Press Brake PB-110","Paint Booth PB-01"]'::jsonb,7,3,4,'PCS',950.00,'Store A / Rack 5','ElectroTech Supplies',8,'2026-07-25',0.60,'adequate','2025-10-05 09:00:00+00','2026-07-25 10:00:00+00');

-- ============================================================================
-- System health checks
-- ============================================================================
DELETE FROM production_system_health_checks WHERE check_number LIKE 'DEMO-%';
INSERT INTO production_system_health_checks
  (company_id, check_number, check_timestamp, overall_status, overall_health_score,
   "componentStatuses", "databaseHealth", "apiHealth", "resourceUsage", "performanceMetrics",
   "activeAlerts", issues_detected, critical_issues, recommendations, check_duration_ms,
   initiated_by, created_at, updated_at)
VALUES
  (:company,'DEMO-HC-0001','2026-09-04 06:00:00','healthy',97.5,
   '[{"component":"database","status":"healthy"},{"component":"api","status":"healthy"},{"component":"mes-gateway","status":"healthy"}]'::jsonb,
   '{"connections":42,"latencyMs":11,"replicationLagSec":0}'::jsonb,'{"p95Ms":180,"errorRatePct":0.1}'::jsonb,
   '{"cpuPct":38,"memPct":54,"diskPct":61}'::jsonb,'{"throughputRps":85}'::jsonb,'[]'::jsonb,0,0,'[]'::jsonb,4200,'system','2026-09-04 06:00:05','2026-09-04 06:00:05'),
  (:company,'DEMO-HC-0002','2026-09-05 06:00:00','healthy',96.8,
   '[{"component":"database","status":"healthy"},{"component":"api","status":"healthy"},{"component":"mes-gateway","status":"healthy"}]'::jsonb,
   '{"connections":40,"latencyMs":12,"replicationLagSec":0}'::jsonb,'{"p95Ms":195,"errorRatePct":0.2}'::jsonb,
   '{"cpuPct":41,"memPct":55,"diskPct":62}'::jsonb,'{"throughputRps":82}'::jsonb,'[]'::jsonb,0,0,'[]'::jsonb,4100,'system','2026-09-05 06:00:05','2026-09-05 06:00:05'),
  (:company,'DEMO-HC-0003','2026-09-06 06:00:00','degraded',82.0,
   '[{"component":"database","status":"healthy"},{"component":"api","status":"degraded"},{"component":"mes-gateway","status":"healthy"}]'::jsonb,
   '{"connections":55,"latencyMs":14,"replicationLagSec":1}'::jsonb,'{"p95Ms":640,"errorRatePct":1.8}'::jsonb,
   '{"cpuPct":78,"memPct":71,"diskPct":62}'::jsonb,'{"throughputRps":60}'::jsonb,
   '[{"alert":"API p95 above 500ms","severity":"warning"}]'::jsonb,2,0,
   '["Scale API workers from 4 to 6","Review slow query on schedule board"]'::jsonb,5600,'system','2026-09-06 06:00:06','2026-09-06 06:00:06'),
  (:company,'DEMO-HC-0004','2026-09-07 06:00:00','healthy',95.2,
   '[{"component":"database","status":"healthy"},{"component":"api","status":"healthy"},{"component":"mes-gateway","status":"healthy"}]'::jsonb,
   '{"connections":44,"latencyMs":12,"replicationLagSec":0}'::jsonb,'{"p95Ms":210,"errorRatePct":0.3}'::jsonb,
   '{"cpuPct":45,"memPct":58,"diskPct":63}'::jsonb,'{"throughputRps":80}'::jsonb,'[]'::jsonb,0,0,
   '["Disk usage trending up; schedule archive job"]'::jsonb,4300,'system','2026-09-07 06:00:05','2026-09-07 06:00:05'),
  (:company,'DEMO-HC-0005','2026-09-08 06:00:00','unhealthy',61.4,
   '[{"component":"database","status":"healthy"},{"component":"api","status":"healthy"},{"component":"mes-gateway","status":"unhealthy"}]'::jsonb,
   '{"connections":43,"latencyMs":13,"replicationLagSec":0}'::jsonb,'{"p95Ms":230,"errorRatePct":0.4}'::jsonb,
   '{"cpuPct":47,"memPct":60,"diskPct":63}'::jsonb,'{"throughputRps":78}'::jsonb,
   '[{"alert":"MES gateway heartbeat missed 3x","severity":"critical"}]'::jsonb,3,1,
   '["Restart MES gateway service","Check PLC network switch in Bay 2"]'::jsonb,7100,'system','2026-09-08 06:00:07','2026-09-08 06:00:07'),
  (:company,'DEMO-HC-0006','2026-09-08 09:30:00','healthy',94.0,
   '[{"component":"database","status":"healthy"},{"component":"api","status":"healthy"},{"component":"mes-gateway","status":"healthy"}]'::jsonb,
   '{"connections":46,"latencyMs":12,"replicationLagSec":0}'::jsonb,'{"p95Ms":205,"errorRatePct":0.2}'::jsonb,
   '{"cpuPct":44,"memPct":57,"diskPct":63}'::jsonb,'{"throughputRps":81}'::jsonb,'[]'::jsonb,0,0,
   '["MES gateway recovered after switch reboot"]'::jsonb,4400,'EMP0002','2026-09-08 09:30:05','2026-09-08 09:30:05'),
  (:company,'DEMO-HC-0007','2026-09-09 06:00:00','healthy',97.1,
   '[{"component":"database","status":"healthy"},{"component":"api","status":"healthy"},{"component":"mes-gateway","status":"healthy"}]'::jsonb,
   '{"connections":41,"latencyMs":11,"replicationLagSec":0}'::jsonb,'{"p95Ms":185,"errorRatePct":0.1}'::jsonb,
   '{"cpuPct":39,"memPct":54,"diskPct":64}'::jsonb,'{"throughputRps":84}'::jsonb,'[]'::jsonb,0,0,'[]'::jsonb,4150,'system','2026-09-09 06:00:05','2026-09-09 06:00:05');

-- ============================================================================
-- Trial installations (kitchen mock-ups before dispatch)
-- ============================================================================
DELETE FROM production_trial_installations WHERE wo_number LIKE 'DEMO-%';
INSERT INTO production_trial_installations
  (wo_number, product_name, installation_type, status, scheduled_date, completion_date, supervisor,
   location, checklist, issues_found, approved, notes, created_at, updated_at)
VALUES
  ('DEMO-TI-0001','Harbour Grill Wall Cabinet Run','Wall Cabinet','Completed','2026-07-20','2026-07-21','Amit Verma','Trial Bay 1',
   '[{"item":"Level & alignment","done":true},{"item":"Shutter operation","done":true},{"item":"Load test 40kg","done":true}]'::jsonb,0,true,'Cleared for dispatch','2026-07-15 09:00:00+00','2026-07-21 16:00:00+00'),
  ('DEMO-TI-0002','Blue Fig Base Cabinet Line','Base Cabinet','Completed','2026-08-10','2026-08-12','Amit Verma','Trial Bay 2',
   '[{"item":"Plumb & square","done":true},{"item":"Drawer runners","done":true},{"item":"SS seam finish","done":true}]'::jsonb,2,true,'Two drawer runners realigned during trial','2026-08-05 09:00:00+00','2026-08-12 17:00:00+00'),
  ('DEMO-TI-0003','Campus Dining Full Kitchen Mock-up','Full Kitchen','Issues Found','2026-08-25','2026-08-28','Sanjay Malhotra','Trial Bay 1',
   '[{"item":"Layout per drawing","done":true},{"item":"Utility hookup dry-fit","done":true},{"item":"Hood clearance","done":false}]'::jsonb,3,false,'Hood clearance 40mm short; rework bracket set','2026-08-20 09:00:00+00','2026-08-28 15:00:00+00'),
  ('DEMO-TI-0004','Golden Spoon Partition Screens','Partition','In Progress','2026-09-08',NULL,'Sanjay Malhotra','Trial Bay 3',
   '[{"item":"Frame squareness","done":true},{"item":"Panel fit","done":false},{"item":"Powder coat check","done":false}]'::jsonb,1,false,'Panel gap at joint 3 under review','2026-09-04 09:00:00+00','2026-09-09 11:00:00+00'),
  ('DEMO-TI-0005','Lakeside Resort Wall Cabinet Set','Wall Cabinet','Scheduled','2026-09-16',NULL,'Amit Verma','Trial Bay 1',
   '[{"item":"Level & alignment","done":false},{"item":"Shutter operation","done":false}]'::jsonb,0,false,NULL,'2026-09-08 09:00:00+00','2026-09-08 09:00:00+00'),
  ('DEMO-TI-0006','Metro Hospital Utility Rack Trial','Other','Completed','2026-06-12','2026-06-12','Amit Verma','Trial Bay 2',
   '[{"item":"Load test 80kg","done":true},{"item":"Caster lock check","done":true}]'::jsonb,0,true,'Single-day trial, no issues','2026-06-08 09:00:00+00','2026-06-12 15:00:00+00');

-- ============================================================================
-- Workload assignments
-- ============================================================================
DELETE FROM production_workload_assignments WHERE assignment_number LIKE 'DEMO-%';
INSERT INTO production_workload_assignments
  (company_id, assignment_number, employee_id, employee_name, assignment_date, shift_id, workstation_id,
   status, "assignedTasks", total_planned_hours, total_actual_hours, available_hours, utilization_rate,
   balance_status, "capacityBreakdown", notes, assigned_by, approved_by, created_at, updated_at)
VALUES
  (:company,'DEMO-WL-0001','EMP0004','Vikram Singh','2026-09-07','DEMO-SH-A','WC-CUT','completed',
   '[{"task":"Cut blanks WO-DEMO-0026","hours":4.5,"type":"production"},{"task":"Cut blanks WO-DEMO-0030","hours":2.5,"type":"production"}]'::jsonb,
   7.00,7.20,7.25,96.55,'balanced','{"production":7.0,"setup":0.2}'::jsonb,NULL,'EMP0001','EMP0002','2026-09-05 10:00:00','2026-09-07 14:10:00'),
  (:company,'DEMO-WL-0002','EMP0005','Suresh Patel','2026-09-07','DEMO-SH-A','WC-WELD','completed',
   '[{"task":"Frame welds WO-DEMO-0029","hours":6.0,"type":"production"},{"task":"Torch liner change","hours":0.5,"type":"maintenance"}]'::jsonb,
   6.50,6.80,7.25,89.66,'balanced','{"production":6.0,"maintenance":0.5,"setup":0.3}'::jsonb,NULL,'EMP0001','EMP0002','2026-09-05 10:00:00','2026-09-07 14:10:00'),
  (:company,'DEMO-WL-0003','EMP0007','Amit Verma','2026-09-07','DEMO-SH-A','WC-ASSY','completed',
   '[{"task":"Motor assembly WO-DEMO-0029","hours":7.5,"type":"production"},{"task":"Line audit","hours":1.0,"type":"quality"}]'::jsonb,
   8.50,8.90,7.25,117.24,'overloaded','{"production":7.5,"quality":1.0,"overtime":1.5}'::jsonb,'Overtime approved for close-out','EMP0001','EMP0002','2026-09-05 10:00:00','2026-09-07 15:35:00'),
  (:company,'DEMO-WL-0004','EMP0009','Deepak Joshi','2026-09-07','DEMO-SH-B','WC-CNC','completed',
   '[{"task":"Housing machining WO-DEMO-0028","hours":6.5,"type":"production"},{"task":"Tool change","hours":0.5,"type":"setup"}]'::jsonb,
   7.00,7.10,7.25,96.55,'balanced','{"production":6.5,"setup":0.5}'::jsonb,NULL,'EMP0001','EMP0002','2026-09-05 10:00:00','2026-09-07 22:05:00'),
  (:company,'DEMO-WL-0005','EMP0012','Ajay Pillai','2026-09-07','DEMO-SH-B','WC-PACK','completed',
   '[{"task":"Pack FG WO-DEMO-0025","hours":4.0,"type":"production"},{"task":"Bay cleanup","hours":1.0,"type":"cleanup"}]'::jsonb,
   5.00,5.10,7.25,68.97,'underutilized','{"production":4.0,"cleanup":1.0}'::jsonb,'Pulled forward labeling work to fill idle time','EMP0001','EMP0002','2026-09-05 10:00:00','2026-09-07 22:15:00'),
  (:company,'DEMO-WL-0006','EMP0013','Mohan Das','2026-09-07','DEMO-SH-C','WC-CNC','completed',
   '[{"task":"Shaft machining WO-DEMO-0024","hours":6.5,"type":"production"}]'::jsonb,
   6.50,6.60,7.00,92.86,'balanced','{"production":6.5}'::jsonb,NULL,'EMP0001','EMP0002','2026-09-05 10:00:00','2026-09-08 06:05:00'),
  (:company,'DEMO-WL-0007','EMP0004','Vikram Singh','2026-09-08','DEMO-SH-A','WC-CUT','completed',
   '[{"task":"Cut blanks WO-DEMO-0030","hours":5.0,"type":"production"},{"task":"Nesting review","hours":1.5,"type":"setup"}]'::jsonb,
   6.50,6.70,7.25,89.66,'balanced','{"production":5.0,"setup":1.5}'::jsonb,NULL,'EMP0001','EMP0002','2026-09-06 10:00:00','2026-09-08 14:05:00'),
  (:company,'DEMO-WL-0008','EMP0015','Arun Gupta','2026-09-08','DEMO-SH-A','WC-BEND','completed',
   '[{"task":"Bend panels WO-DEMO-0030","hours":5.5,"type":"production"},{"task":"Die changeover","hours":1.0,"type":"setup"}]'::jsonb,
   6.50,6.90,7.25,89.66,'balanced','{"production":5.5,"setup":1.0}'::jsonb,NULL,'EMP0001','EMP0002','2026-09-06 10:00:00','2026-09-08 14:05:00'),
  (:company,'DEMO-WL-0009','EMP0009','Deepak Joshi','2026-09-09','DEMO-SH-B','WC-CNC','in_progress',
   '[{"task":"Housing machining WO-DEMO-0028","hours":7.0,"type":"production"}]'::jsonb,
   7.00,3.50,7.25,96.55,'balanced','{"production":7.0}'::jsonb,NULL,'EMP0001',NULL,'2026-09-07 10:00:00','2026-09-09 18:00:00'),
  (:company,'DEMO-WL-0010','EMP0019','Ramesh Yadav','2026-09-10','DEMO-SH-C','WC-CNC','planned',
   '[{"task":"Deburr shafts WO-DEMO-0024","hours":4.0,"type":"production"},{"task":"CNC shadowing with EMP0013","hours":3.0,"type":"production"}]'::jsonb,
   7.00,0,7.00,100.00,'balanced','{"production":7.0}'::jsonb,'Trainee paired with night lead','EMP0001',NULL,'2026-09-08 10:00:00','2026-09-08 10:00:00');

-- ============================================================================
-- Routings (FG / WIP items through the 8 work centers)
-- ============================================================================
DELETE FROM routings WHERE "routingCode" LIKE 'DEMO-%';
INSERT INTO routings
  ("routingCode", "routingName", description, status, "itemId", "itemCode", "itemName", version,
   "isActive", "isDefault", "effectiveFrom", operations, "totalSetupTime", "totalRunTimePerUnit",
   "totalTeardownTime", "totalTimePerUnit", "totalOperations", "totalCostPerUnit", "laborCostPerUnit",
   "overheadCostPerUnit", "leadTimeDays", "batchSize", uom, "requiresQualityInspection",
   "qualityCheckpoints", "approvedBy", "approvedAt", notes, "createdBy", "createdAt", "updatedAt")
VALUES
  ('DEMO-RTG-001','Industrial Motor 5HP — Standard Route','Full route: cut, machine, weld, paint, assemble, inspect, pack','Active',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',1,true,true,'2025-10-01',
   '[{"sequence":10,"operationCode":"OP-CUT","operationName":"Cutting","workCenterCode":"WC-CUT","setupMinutes":20,"runMinutesPerUnit":6,"teardownMinutes":5},
     {"sequence":20,"operationCode":"OP-CNC","operationName":"CNC Operation","workCenterCode":"WC-CNC","setupMinutes":35,"runMinutesPerUnit":18,"teardownMinutes":10},
     {"sequence":30,"operationCode":"OP-WELD","operationName":"Welding","workCenterCode":"WC-WELD","setupMinutes":15,"runMinutesPerUnit":12,"teardownMinutes":5},
     {"sequence":40,"operationCode":"OP-PAINT","operationName":"Painting","workCenterCode":"WC-PAINT","setupMinutes":25,"runMinutesPerUnit":8,"teardownMinutes":10},
     {"sequence":50,"operationCode":"OP-ASSY","operationName":"Assembly","workCenterCode":"WC-ASSY","setupMinutes":15,"runMinutesPerUnit":25,"teardownMinutes":5},
     {"sequence":60,"operationCode":"OP-INSP","operationName":"Inspection","workCenterCode":"WC-QC","setupMinutes":5,"runMinutesPerUnit":10,"teardownMinutes":0},
     {"sequence":70,"operationCode":"OP-PACK","operationName":"Packing","workCenterCode":"WC-PACK","setupMinutes":5,"runMinutesPerUnit":6,"teardownMinutes":5}]'::json,
   120.00,85.00,40.00,85.00,7,1450.00,620.00,830.00,4,1,'PCS',true,2,'EMP0002','2025-10-05 10:00:00',NULL,'EMP0009','2025-10-01 09:00:00','2025-10-05 10:00:00'),
  ('DEMO-RTG-002','Centrifugal Pump CP-200 — Standard Route','Pump body machining, welded base, assembly with seal, test, pack','Active',
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',1,true,true,'2025-10-01',
   '[{"sequence":10,"operationCode":"OP-CUT","operationName":"Cutting","workCenterCode":"WC-CUT","setupMinutes":15,"runMinutesPerUnit":5,"teardownMinutes":5},
     {"sequence":20,"operationCode":"OP-CNC","operationName":"CNC Operation","workCenterCode":"WC-CNC","setupMinutes":40,"runMinutesPerUnit":22,"teardownMinutes":10},
     {"sequence":30,"operationCode":"OP-WELD","operationName":"Welding","workCenterCode":"WC-WELD","setupMinutes":15,"runMinutesPerUnit":10,"teardownMinutes":5},
     {"sequence":40,"operationCode":"OP-ASSY","operationName":"Assembly","workCenterCode":"WC-ASSY","setupMinutes":20,"runMinutesPerUnit":30,"teardownMinutes":5},
     {"sequence":50,"operationCode":"OP-INSP","operationName":"Inspection","workCenterCode":"WC-QC","setupMinutes":10,"runMinutesPerUnit":15,"teardownMinutes":0},
     {"sequence":60,"operationCode":"OP-PACK","operationName":"Packing","workCenterCode":"WC-PACK","setupMinutes":5,"runMinutesPerUnit":8,"teardownMinutes":5}]'::json,
   105.00,90.00,30.00,90.00,6,1680.00,710.00,970.00,4,1,'PCS',true,2,'EMP0002','2025-10-05 10:00:00','Hydro test at inspection step','EMP0009','2025-10-01 09:00:00','2025-10-05 10:00:00'),
  ('DEMO-RTG-003','Precision Gearbox PG-50 — Standard Route','Housing machining, gear assembly, backlash inspection, pack','Active',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',1,true,true,'2025-10-01',
   '[{"sequence":10,"operationCode":"OP-CNC","operationName":"CNC Operation","workCenterCode":"WC-CNC","setupMinutes":45,"runMinutesPerUnit":35,"teardownMinutes":10},
     {"sequence":20,"operationCode":"OP-GRIND","operationName":"Grinding","workCenterCode":"WC-CNC","setupMinutes":20,"runMinutesPerUnit":15,"teardownMinutes":5},
     {"sequence":30,"operationCode":"OP-ASSY","operationName":"Assembly","workCenterCode":"WC-ASSY","setupMinutes":25,"runMinutesPerUnit":40,"teardownMinutes":5},
     {"sequence":40,"operationCode":"OP-INSP","operationName":"Inspection","workCenterCode":"WC-QC","setupMinutes":10,"runMinutesPerUnit":20,"teardownMinutes":0},
     {"sequence":50,"operationCode":"OP-PACK","operationName":"Packing","workCenterCode":"WC-PACK","setupMinutes":5,"runMinutesPerUnit":6,"teardownMinutes":5}]'::json,
   105.00,116.00,25.00,116.00,5,2250.00,980.00,1270.00,5,1,'PCS',true,2,'EMP0002','2025-10-05 10:00:00','Backlash spec 0.05-0.08mm','EMP0009','2025-10-01 09:00:00','2025-10-05 10:00:00'),
  ('DEMO-RTG-004','Gearbox Housing (Machined) — WIP Route','Casting to machined housing: CNC, grind, inspect','Active',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',1,true,true,'2025-10-01',
   '[{"sequence":10,"operationCode":"OP-CNC","operationName":"CNC Operation","workCenterCode":"WC-CNC","setupMinutes":45,"runMinutesPerUnit":28,"teardownMinutes":10},
     {"sequence":20,"operationCode":"OP-GRIND","operationName":"Grinding","workCenterCode":"WC-CNC","setupMinutes":15,"runMinutesPerUnit":10,"teardownMinutes":5},
     {"sequence":30,"operationCode":"OP-INSP","operationName":"Inspection","workCenterCode":"WC-QC","setupMinutes":5,"runMinutesPerUnit":8,"teardownMinutes":0}]'::json,
   65.00,46.00,15.00,46.00,3,720.00,310.00,410.00,2,5,'PCS',true,1,'EMP0002','2025-10-05 10:00:00',NULL,'EMP0009','2025-10-01 09:00:00','2025-10-05 10:00:00'),
  ('DEMO-RTG-005','Drive Shaft Assembly (WIP) — Rev B Route','Cut, turn, weld flange, inspect; Rev B adds grinding pass','Submitted',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'WIP-SFT-001','Drive Shaft Assembly (WIP)',2,true,false,'2026-09-01',
   '[{"sequence":10,"operationCode":"OP-CUT","operationName":"Cutting","workCenterCode":"WC-CUT","setupMinutes":10,"runMinutesPerUnit":4,"teardownMinutes":5},
     {"sequence":20,"operationCode":"OP-CNC","operationName":"CNC Operation","workCenterCode":"WC-CNC","setupMinutes":30,"runMinutesPerUnit":16,"teardownMinutes":10},
     {"sequence":30,"operationCode":"OP-GRIND","operationName":"Grinding","workCenterCode":"WC-CNC","setupMinutes":15,"runMinutesPerUnit":8,"teardownMinutes":5},
     {"sequence":40,"operationCode":"OP-WELD","operationName":"Welding","workCenterCode":"WC-WELD","setupMinutes":10,"runMinutesPerUnit":6,"teardownMinutes":5},
     {"sequence":50,"operationCode":"OP-INSP","operationName":"Inspection","workCenterCode":"WC-QC","setupMinutes":5,"runMinutesPerUnit":6,"teardownMinutes":0}]'::json,
   70.00,40.00,25.00,40.00,5,540.00,240.00,300.00,2,10,'PCS',true,1,NULL,NULL,'Rev B awaiting approval; Rev A remains default','EMP0009','2026-09-01 09:00:00','2026-09-01 09:00:00');

-- ============================================================================
-- Production schedules + schedule lines
-- ============================================================================
DELETE FROM production_schedule_lines WHERE schedule_code LIKE 'DEMO-%';
DELETE FROM production_schedules WHERE schedule_number LIKE 'DEMO-%';
INSERT INTO production_schedules
  (company_id, schedule_number, name, description, schedule_type, status, start_date, end_date,
   work_center_id, "scheduleItems", total_scheduled_hours, total_work_orders, utilization_percentage,
   conflicts, is_optimized, optimization_score, created_by, published_by, published_at, created_at, updated_at)
VALUES
  (:company,'DEMO-PS-0001','Week 36 Master Schedule','Plant-wide schedule for week of 31-Aug-2026','weekly','completed',
   '2026-08-31 00:00:00','2026-09-05 23:59:59',NULL,
   '[{"workOrder":"WO-DEMO-0025","workCenter":"WC-PAINT"},{"workOrder":"WO-DEMO-0026","workCenter":"WC-CUT"},{"workOrder":"WO-DEMO-0027","workCenter":"WC-ASSY"}]'::jsonb,
   212.50,3,81.30,'[]'::jsonb,true,87.5,'EMP0002','EMP0002','2026-08-28 16:00:00','2026-08-27 10:00:00','2026-09-06 08:00:00'),
  (:company,'DEMO-PS-0002','Week 37 Master Schedule','Plant-wide schedule for week of 7-Sep-2026','weekly','in_progress',
   '2026-09-07 00:00:00','2026-09-12 23:59:59',NULL,
   '[{"workOrder":"WO-DEMO-0028","workCenter":"WC-CNC"},{"workOrder":"WO-DEMO-0029","workCenter":"WC-ASSY"},{"workOrder":"WO-DEMO-0030","workCenter":"WC-CUT"}]'::jsonb,
   248.00,3,88.60,'[{"type":"capacity","workCenter":"WC-CNC","note":"Queue exceeds 90% on 09-Sep"}]'::jsonb,true,84.2,'EMP0002','EMP0002','2026-09-04 16:00:00','2026-09-03 10:00:00','2026-09-09 08:00:00'),
  (:company,'DEMO-PS-0003','Week 38 Master Schedule','Plant-wide schedule for week of 14-Sep-2026','weekly','published',
   '2026-09-14 00:00:00','2026-09-19 23:59:59',NULL,
   '[{"workOrder":"WO-DEMO-0030","workCenter":"WC-ASSY"}]'::jsonb,
   164.00,1,64.10,'[]'::jsonb,false,NULL,'EMP0002','EMP0002','2026-09-09 15:00:00','2026-09-08 10:00:00','2026-09-09 15:00:00'),
  (:company,'DEMO-PS-0004','CNC Cell Daily Plan 09-Sep','Machine-level day plan for the CNC cell','daily','completed',
   '2026-09-09 00:00:00','2026-09-09 23:59:59','WC-CNC',
   '[{"workOrder":"WO-DEMO-0028","operation":"OP-CNC"},{"workOrder":"WO-DEMO-0024","operation":"OP-GRIND"}]'::jsonb,
   21.50,2,92.40,'[]'::jsonb,true,90.1,'EMP0002','EMP0002','2026-09-08 17:00:00','2026-09-08 14:00:00','2026-09-10 06:00:00');

INSERT INTO production_schedule_lines
  (schedule_code, work_order_id, product_name, product_code, work_center, planned_start, planned_end,
   actual_start, actual_end, quantity, unit, status, priority, assigned_to, sequence_no, published_at,
   created_at, updated_at)
VALUES
  ('DEMO-PS-0001',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0025'),'Precision Gearbox PG-50','FG-GBX-001','WC-PAINT','2026-08-31 06:00','2026-09-01 14:00','2026-08-31 06:10','2026-09-01 13:40',14,'PCS','completed','medium','Ravi Menon',1,'2026-08-28 16:00:00+00','2026-08-27 10:00:00+00','2026-09-01 14:00:00+00'),
  ('DEMO-PS-0001',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0026'),'Industrial Motor 5HP','FG-MTR-001','WC-CUT','2026-09-01 06:00','2026-09-02 14:00','2026-09-01 06:00','2026-09-02 15:20',28,'PCS','completed','high','Vikram Singh',2,'2026-08-28 16:00:00+00','2026-08-27 10:00:00+00','2026-09-02 15:30:00+00'),
  ('DEMO-PS-0001',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0027'),'Centrifugal Pump CP-200','FG-PMP-001','WC-ASSY','2026-09-03 06:00','2026-09-05 14:00','2026-09-03 06:05','2026-09-05 13:55',24,'PCS','completed','high','Amit Verma',3,'2026-08-28 16:00:00+00','2026-08-27 10:00:00+00','2026-09-05 14:00:00+00'),
  ('DEMO-PS-0002',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'Gearbox Housing (Machined)','WIP-GBX-001','WC-CNC','2026-09-07 14:00','2026-09-10 22:00','2026-09-07 14:10',NULL,45,'PCS','in_progress','high','Deepak Joshi',1,'2026-09-04 16:00:00+00','2026-09-03 10:00:00+00','2026-09-09 18:00:00+00'),
  ('DEMO-PS-0002',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0029'),'Industrial Motor 5HP','FG-MTR-001','WC-ASSY','2026-09-07 06:00','2026-09-09 14:00','2026-09-07 05:50','2026-09-09 12:30',20,'PCS','completed','urgent','Amit Verma',2,'2026-09-04 16:00:00+00','2026-09-03 10:00:00+00','2026-09-09 12:35:00+00'),
  ('DEMO-PS-0002',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0030'),'Precision Gearbox PG-50','FG-GBX-001','WC-CUT','2026-09-09 06:00','2026-09-10 14:00','2026-09-09 06:00',NULL,10,'PCS','in_progress','medium','Vikram Singh',3,'2026-09-04 16:00:00+00','2026-09-03 10:00:00+00','2026-09-10 06:00:00+00'),
  ('DEMO-PS-0002',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0024'),'Drive Shaft Assembly (WIP)','WIP-SFT-001','WC-CNC','2026-09-07 22:00','2026-09-09 06:00','2026-09-07 21:55','2026-09-09 05:40',85,'PCS','completed','medium','Mohan Das',4,'2026-09-04 16:00:00+00','2026-09-03 10:00:00+00','2026-09-09 06:00:00+00'),
  ('DEMO-PS-0003',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0030'),'Precision Gearbox PG-50','FG-GBX-001','WC-ASSY','2026-09-14 06:00','2026-09-16 14:00',NULL,NULL,10,'PCS','scheduled','medium','Amit Verma',1,'2026-09-09 15:00:00+00','2026-09-08 10:00:00+00','2026-09-09 15:00:00+00'),
  ('DEMO-PS-0003',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0030'),'Precision Gearbox PG-50','FG-GBX-001','WC-QC','2026-09-17 06:00','2026-09-17 14:00',NULL,NULL,10,'PCS','scheduled','medium','Lakshmi Iyer',2,'2026-09-09 15:00:00+00','2026-09-08 10:00:00+00','2026-09-09 15:00:00+00'),
  ('DEMO-PS-0003',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0030'),'Precision Gearbox PG-50','FG-GBX-001','WC-PACK','2026-09-18 06:00','2026-09-18 14:00',NULL,NULL,10,'PCS','scheduled','low','Ajay Pillai',3,'2026-09-09 15:00:00+00','2026-09-08 10:00:00+00','2026-09-09 15:00:00+00'),
  ('DEMO-PS-0004',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'Gearbox Housing (Machined)','WIP-GBX-001','WC-CNC','2026-09-09 14:00','2026-09-09 22:00','2026-09-09 14:05','2026-09-09 21:50',15,'PCS','completed','high','Deepak Joshi',1,'2026-09-08 17:00:00+00','2026-09-08 14:00:00+00','2026-09-09 22:00:00+00'),
  ('DEMO-PS-0004',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0024'),'Drive Shaft Assembly (WIP)','WIP-SFT-001','WC-CNC','2026-09-09 22:00','2026-09-10 06:00','2026-09-09 22:00','2026-09-10 05:30',30,'PCS','completed','medium','Mohan Das',2,'2026-09-08 17:00:00+00','2026-09-08 14:00:00+00','2026-09-10 06:00:00+00');

-- ============================================================================
-- Scenario plannings (disruption scenarios)
-- ============================================================================
DELETE FROM scenario_plannings WHERE "companyId" = :company;
INSERT INTO scenario_plannings
  ("companyId", "scenarioName", description, "disruptionType", severity, probability, parameters,
   "impactAnalysis", "affectedResources", "mitigationStrategies", "recoveryPlan",
   "estimatedFinancialImpact", "estimatedRecoveryDays", status, "createdBy", "approvedBy", "approvedAt",
   "lastReviewDate", "nextReviewDate", "createdAt", "updatedAt")
VALUES
  (:company,'Steel Supplier Failure — Prime Steel','Primary sheet-steel supplier halts deliveries for 4+ weeks','supplier_failure','significant',18.00,
   '{"supplier":"Prime Steel Suppliers","itemCodes":["RM-STL-001"],"durationWeeks":4}'::jsonb,
   '{"affectedWOsPerWeek":6,"otdDropPct":12}'::jsonb,'["WC-CUT","WC-BEND"]'::jsonb,
   '["Qualify Bharat Metal Works as second source","Hold 3-week safety stock of RM-STL-001"]'::jsonb,
   '{"steps":["Activate alternate PO within 48h","Re-sequence non-steel WOs forward"]}'::jsonb,
   1250000,21,'approved','EMP0002','EMP0001','2026-02-10 11:00:00','2026-08-01','2026-11-01','2026-01-20 10:00:00','2026-08-01 10:00:00'),
  (:company,'Festive Demand Spike 40%','Oct-Nov order surge beyond capacity on motor and gearbox lines','demand_spike','moderate',55.00,
   '{"surgePct":40,"months":["2026-10","2026-11"]}'::jsonb,
   '{"backlogDays":9,"overtimeCostIncrease":220000}'::jsonb,'["WC-CNC","WC-ASSY"]'::jsonb,
   '["Pre-build FG-MTR-001 buffer in September","Approve weekend CNC shift"]'::jsonb,
   '{"steps":["Trigger pre-build plan by 15-Sep","Notify key accounts of lead-time window"]}'::jsonb,
   480000,14,'approved','EMP0002','EMP0001','2026-08-20 15:00:00','2026-08-20','2026-10-05','2026-08-10 10:00:00','2026-08-20 15:00:00'),
  (:company,'VMC-850 Spindle Failure','Catastrophic spindle failure takes primary CNC down for 3 weeks','capacity_loss','severe',10.00,
   '{"asset":"AST-CNC-001","downWeeks":3}'::jsonb,
   '{"lostMachineHoursPerWeek":110,"affectedItems":["WIP-GBX-001","FG-GBX-001","WIP-SFT-001"]}'::jsonb,
   '["WC-CNC"]'::jsonb,
   '["Keep spindle bearing set in stock (DEMO-SP-0001)","Retain subcontract machining agreement"]'::jsonb,
   '{"steps":["Divert housings to subcontractor within 72h","Expedite spindle rebuild with OEM"]}'::jsonb,
   1900000,21,'analyzed','EMP0002',NULL,NULL,'2026-06-15','2026-12-15','2026-06-01 10:00:00','2026-06-15 10:00:00'),
  (:company,'Port Congestion — Export Shipments','Logistics disruption delaying export FG dispatches by 2 weeks','logistics_disruption','moderate',30.00,
   '{"lane":"Mundra-EU","delayDays":14}'::jsonb,
   '{"delayedShipments":4,"penaltyExposure":150000}'::jsonb,'["WC-PACK"]'::jsonb,
   '["Pre-book alternate carrier slots","Shift 20% volume to air freight for penalty orders"]'::jsonb,
   '{"steps":["Weekly carrier review during peak","Customer comms template ready"]}'::jsonb,
   350000,10,'draft','EMP0002',NULL,NULL,NULL,'2026-10-15','2026-09-05 10:00:00','2026-09-05 10:00:00'),
  (:company,'Monsoon Flooding — Plant Access','Severe monsoon flooding blocks plant access roads and delays shifts','natural_disaster','significant',15.00,
   '{"season":"Jun-Sep","accessBlockedDays":3}'::jsonb,
   '{"lostShifts":6,"absenteeismPct":35}'::jsonb,'["WC-CUT","WC-WELD","WC-ASSY","WC-PACK"]'::jsonb,
   '["Stagger shift starts during red alerts","Arrange company transport from high ground pickup points"]'::jsonb,
   '{"steps":["Activate transport plan on IMD red alert","Catch-up overtime plan within 1 week"]}'::jsonb,
   420000,7,'approved','EMP0002','EMP0001','2026-05-25 12:00:00','2026-05-25','2027-04-30','2026-05-10 10:00:00','2026-05-25 12:00:00');

-- ============================================================================
-- Shift handoffs
-- ============================================================================
DELETE FROM shift_handoffs WHERE "companyId" = :company;
INSERT INTO shift_handoffs
  ("companyId", "handoffDate", "outgoingShiftType", "incomingShiftType", "outgoingShiftId", "incomingShiftId",
   "outgoingUserId", "outgoingUserName", "incomingUserId", "incomingUserName", "workstationId", "workstationName",
   status, "checklistItems", "activeIssues", "productionStatus", "pendingTasks", "safetyNotes", "generalNotes",
   "handoffStartedAt", "handoffCompletedAt", "acknowledgedAt", "acknowledgementNotes", "createdAt", "updatedAt")
VALUES
  (:company,'2026-09-07','morning','afternoon','DEMO-SH-A','DEMO-SH-B','EMP0007','Amit Verma','EMP0009','Deepak Joshi','WC-CNC','CNC Machining','acknowledged',
   '[{"item":"Machine status logged","category":"production","done":true},{"item":"Coolant level checked","category":"maintenance","done":true},{"item":"Walkway clear","category":"safety","done":true}]'::jsonb,
   '[{"issue":"Tool wear on T12 insert","priority":"medium"}]'::jsonb,
   '{"activeWO":"WO-DEMO-0028","completedQty":12,"targetQty":15}'::jsonb,
   '[{"task":"Change T12 insert before next batch","assignee":"EMP0009"}]'::jsonb,
   '[]'::jsonb,'Smooth shift, no downtime','2026-09-07 13:45:00','2026-09-07 14:00:00','2026-09-07 14:05:00','Insert changed at 14:20','2026-09-07 13:45:00','2026-09-07 14:05:00'),
  (:company,'2026-09-07','afternoon','night','DEMO-SH-B','DEMO-SH-C','EMP0009','Deepak Joshi','EMP0013','Mohan Das','WC-CNC','CNC Machining','acknowledged',
   '[{"item":"Program loaded for shaft batch","category":"production","done":true},{"item":"Chip bin emptied","category":"maintenance","done":true}]'::jsonb,
   '[]'::jsonb,'{"activeWO":"WO-DEMO-0024","completedQty":55,"targetQty":85}'::jsonb,
   '[{"task":"Complete remaining 30 shafts","assignee":"EMP0013"}]'::jsonb,
   '[{"note":"Night crew: coolant mist extractor filter due for check","category":"safety"}]'::jsonb,
   NULL,'2026-09-07 21:45:00','2026-09-07 22:00:00','2026-09-07 22:10:00',NULL,'2026-09-07 21:45:00','2026-09-07 22:10:00'),
  (:company,'2026-09-08','night','morning','DEMO-SH-C','DEMO-SH-A','EMP0013','Mohan Das','EMP0004','Vikram Singh','WC-CNC','CNC Machining','acknowledged',
   '[{"item":"Batch completed and staged","category":"production","done":true},{"item":"Machine wiped down","category":"maintenance","done":true}]'::jsonb,
   '[{"issue":"MES gateway offline 02:10-02:40, manual entries pending sync","priority":"high"}]'::jsonb,
   '{"activeWO":"WO-DEMO-0024","completedQty":85,"targetQty":85}'::jsonb,
   '[{"task":"Verify manual MES entries after gateway restore","assignee":"EMP0002"}]'::jsonb,
   '[]'::jsonb,'Shaft batch done overnight','2026-09-08 05:45:00','2026-09-08 06:00:00','2026-09-08 06:12:00','MES entries reconciled 09:45','2026-09-08 05:45:00','2026-09-08 06:12:00'),
  (:company,'2026-09-08','morning','afternoon','DEMO-SH-A','DEMO-SH-B','EMP0005','Suresh Patel','EMP0009','Deepak Joshi','WC-WELD','Welding Section','completed',
   '[{"item":"Torch liners replaced","category":"maintenance","done":true},{"item":"Weld fixtures locked","category":"quality","done":true}]'::jsonb,
   '[]'::jsonb,'{"activeWO":"WO-DEMO-0029","completedQty":18,"targetQty":20}'::jsonb,
   '[{"task":"Final 2 frames then release to paint","assignee":"EMP0009"}]'::jsonb,
   '[]'::jsonb,NULL,'2026-09-08 13:50:00','2026-09-08 14:00:00',NULL,NULL,'2026-09-08 13:50:00','2026-09-08 14:00:00'),
  (:company,'2026-09-09','afternoon','night','DEMO-SH-B','DEMO-SH-C','EMP0009','Deepak Joshi','EMP0019','Ramesh Yadav','WC-CNC','CNC Machining','in_progress',
   '[{"item":"Housing program paused at op 20","category":"production","done":true},{"item":"Trainee briefing","category":"general","done":false}]'::jsonb,
   '[{"issue":"Coolant concentration low, top-up requested (DEMO-MR-0004 pattern)","priority":"low"}]'::jsonb,
   '{"activeWO":"WO-DEMO-0028","completedQty":30,"targetQty":45}'::jsonb,
   '[{"task":"Resume housing batch after trainee briefing","assignee":"EMP0019"}]'::jsonb,
   '[{"note":"Trainee must not run unattended spindle warm-up","category":"safety"}]'::jsonb,
   NULL,'2026-09-09 21:45:00',NULL,NULL,NULL,'2026-09-09 21:45:00','2026-09-09 21:45:00'),
  (:company,'2026-09-10','night','morning','DEMO-SH-C','DEMO-SH-A','EMP0019','Ramesh Yadav',NULL,NULL,'WC-CNC','CNC Machining','pending',
   '[{"item":"Deburr count logged","category":"production","done":false}]'::jsonb,
   '[]'::jsonb,'{"activeWO":"WO-DEMO-0028","completedQty":38,"targetQty":45}'::jsonb,
   '[]'::jsonb,'[]'::jsonb,NULL,NULL,NULL,NULL,NULL,'2026-09-10 05:40:00','2026-09-10 05:40:00');

-- ============================================================================
-- Shop floor control entries
-- ============================================================================
DELETE FROM shop_floor_control WHERE "entryNumber" LIKE 'DEMO-%';
INSERT INTO shop_floor_control
  ("entryNumber", "activityType", status, "workOrderId", "workOrderNumber", "itemId", "itemCode", "itemName",
   "operationCode", "operationName", "operationSequence", "workCenterId", "workCenterCode", "workCenterName",
   "operatorId", "operatorName", "employeeCode", shift, "startTime", "endTime", "durationMinutes",
   "setupTimeMinutes", "runTimeMinutes", "targetQuantity", "completedQuantity", "acceptedQuantity",
   "rejectedQuantity", "scrapQuantity", "reworkQuantity", uom, "efficiencyPercentage", "yieldPercentage",
   "hasDowntime", "downtimeCategory", "downtimeMinutes", "downtimeReason",
   "qualityInspectionRequired", "qualityInspectionCompleted", "qualityStatus", remarks, "createdBy",
   "createdAt", "updatedAt")
VALUES
  ('DEMO-SFC-0001','Setup Start','Completed',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'WO-DEMO-0028',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',
   'OP-CNC','CNC Operation',10,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',
   'EMP0009','Deepak Joshi','EMP0009','B','2026-09-07 14:10:00','2026-09-07 14:55:00',45,45.00,0.00,0,0,0,0,0,0,'PCS',100.00,0.00,
   false,NULL,0,NULL,false,false,NULL,'Fixture and program setup for housing batch','EMP0009','2026-09-07 14:10:00','2026-09-07 14:55:00'),
  ('DEMO-SFC-0002','Operation Start','Completed',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'WO-DEMO-0028',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',
   'OP-CNC','CNC Operation',10,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',
   'EMP0009','Deepak Joshi','EMP0009','B','2026-09-07 14:55:00','2026-09-07 21:50:00',415,0.00,390.00,15,12,12,0,0,0,'PCS',94.20,100.00,
   true,'Tool Failure',25,'Insert chipped on T12, replaced mid-run',true,false,'Pending','12 of 15 housings machined','EMP0009','2026-09-07 14:55:00','2026-09-07 21:50:00'),
  ('DEMO-SFC-0003','Operation Complete','Completed',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0024'),'WO-DEMO-0024',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'WIP-SFT-001','Drive Shaft Assembly (WIP)',
   'OP-CNC','CNC Operation',20,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',
   'EMP0013','Mohan Das','EMP0013','C','2026-09-07 22:15:00','2026-09-08 05:40:00',445,30.00,400.00,30,30,29,1,0,1,'PCS',97.50,96.67,
   false,NULL,0,NULL,true,true,'Passed','Night batch complete; 1 shaft to rework','EMP0013','2026-09-07 22:15:00','2026-09-08 05:40:00'),
  ('DEMO-SFC-0004','Material Issue','Completed',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0029'),'WO-DEMO-0029',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',
   'OP-ASSY','Assembly',50,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',
   'EMP0007','Amit Verma','EMP0007','A','2026-09-07 06:30:00','2026-09-07 06:45:00',15,0.00,0.00,0,0,0,0,0,0,'PCS',100.00,0.00,
   false,NULL,0,NULL,false,false,NULL,'Bearings and copper wire issued to line','EMP0007','2026-09-07 06:30:00','2026-09-07 06:45:00'),
  ('DEMO-SFC-0005','Operation Start','Completed',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0029'),'WO-DEMO-0029',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'FG-MTR-001','Industrial Motor 5HP',
   'OP-ASSY','Assembly',50,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-ASSY'),'WC-ASSY','Assembly Section',
   'EMP0007','Amit Verma','EMP0007','A','2026-09-07 06:45:00','2026-09-07 15:20:00',515,15.00,480.00,12,11,11,0,0,0,'PCS',95.80,100.00,
   false,NULL,0,NULL,false,false,NULL,'11 motors assembled incl. 1.5h overtime','EMP0007','2026-09-07 06:45:00','2026-09-07 15:20:00'),
  ('DEMO-SFC-0006','Downtime','Completed',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0030'),'WO-DEMO-0030',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',
   'OP-CUT','Cutting',10,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'WC-CUT','Cutting Section',
   'EMP0004','Vikram Singh','EMP0004','A','2026-09-09 09:20:00','2026-09-09 09:50:00',30,0.00,0.00,0,0,0,0,0,0,'PCS',0.00,0.00,
   true,'Material Shortage',30,'Waiting for steel sheets from store (see DEMO-MR-0007)',false,false,NULL,NULL,'EMP0004','2026-09-09 09:20:00','2026-09-09 09:50:00'),
  ('DEMO-SFC-0007','Quality Check','Completed',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0027'),'WO-DEMO-0027',
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'FG-PMP-001','Centrifugal Pump CP-200',
   'OP-INSP','Inspection',50,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-QC'),'WC-QC','Quality Check',
   'EMP0014','Lakshmi Iyer','EMP0014','C','2026-09-07 23:00:00','2026-09-08 03:30:00',270,10.00,255.00,24,24,23,1,0,1,'PCS',98.00,95.83,
   false,NULL,0,NULL,true,true,'Passed','Hydro test: 1 pump seal leak, sent to rework','EMP0014','2026-09-07 23:00:00','2026-09-08 03:30:00'),
  ('DEMO-SFC-0008','Operation Start','In Progress',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'WO-DEMO-0028',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',
   'OP-CNC','CNC Operation',10,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',
   'EMP0009','Deepak Joshi','EMP0009','B','2026-09-09 14:05:00',NULL,0,20.00,0.00,15,8,8,0,0,0,'PCS',0.00,100.00,
   false,NULL,0,NULL,true,false,NULL,'Second housing batch in progress','EMP0009','2026-09-09 14:05:00','2026-09-09 18:00:00'),
  ('DEMO-SFC-0009','Tool Change','Completed',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'WO-DEMO-0028',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'WIP-GBX-001','Gearbox Housing (Machined)',
   'OP-CNC','CNC Operation',10,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CNC'),'WC-CNC','CNC Machining',
   'EMP0009','Deepak Joshi','EMP0009','B','2026-09-07 18:20:00','2026-09-07 18:45:00',25,0.00,0.00,0,0,0,0,0,0,'PCS',100.00,0.00,
   false,NULL,0,NULL,false,false,NULL,'T12 insert replaced (CNMG 120408)','EMP0009','2026-09-07 18:20:00','2026-09-07 18:45:00'),
  ('DEMO-SFC-0010','Operation Pause','Paused',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0030'),'WO-DEMO-0030',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'FG-GBX-001','Precision Gearbox PG-50',
   'OP-CUT','Cutting',10,(SELECT id::text FROM work_centers WHERE "workCenterCode"='WC-CUT'),'WC-CUT','Cutting Section',
   'EMP0004','Vikram Singh','EMP0004','A','2026-09-10 06:15:00',NULL,0,10.00,45.00,10,6,6,0,0,0,'PCS',88.00,100.00,
   false,NULL,0,NULL,false,false,NULL,'Paused at shift-tea break; resuming after material top-up','EMP0004','2026-09-10 06:15:00','2026-09-10 09:00:00');

-- ============================================================================
-- Supply chain risks
-- ============================================================================
DELETE FROM supply_chain_risks WHERE "companyId" = :company;
INSERT INTO supply_chain_risks
  ("companyId", "riskName", category, "riskLevel", "probabilityScore", "impactScore", "overallRiskScore",
   "supplierId", "supplierName", "sourceType", "affectedItems", "alternateSuppliers", "mitigationActions",
   description, "identifiedDate", "reviewDate", status, "isActive", "createdAt", "updatedAt")
VALUES
  (:company,'Single-source dependency: steel sheets','supply','high',3.50,4.20,3.85,NULL,'Prime Steel Suppliers','single',
   '["RM-STL-001"]'::jsonb,'[{"name":"Bharat Metal Works Pvt. Ltd.","qualified":false,"leadDays":18}]'::jsonb,
   '[{"action":"Qualify second source by Q4","owner":"EMP0002","due":"2026-11-30"}]'::jsonb,
   'All 2mm sheet steel flows through one supplier; a 2-week outage stops cutting within 5 working days.',
   '2026-02-15','2026-11-15','mitigating',true,'2026-02-15 10:00:00','2026-08-10 10:00:00'),
  (:company,'Copper price volatility','financial','medium',4.00,2.80,3.40,NULL,'ElectroTech Supplies','dual',
   '["RM-COP-001"]'::jsonb,'[{"name":"Industrial Components Ltd.","qualified":true,"leadDays":10}]'::jsonb,
   '[{"action":"Quarterly price-lock contracts","owner":"EMP0003","due":"2026-10-01"}]'::jsonb,
   'LME copper swings of 15%+ pass straight into motor winding cost; margin erosion on fixed-price orders.',
   '2026-01-10','2026-10-10','open',true,'2026-01-10 10:00:00','2026-07-10 10:00:00'),
  (:company,'German seal imports — customs delays','geopolitical','medium',3.00,3.20,3.10,NULL,'Chemical Solutions GmbH','single',
   '["SP-SL-001"]'::jsonb,'[]'::jsonb,
   '[{"action":"Increase seal safety stock to 6 weeks","owner":"EMP0003","due":"2026-09-30"}]'::jsonb,
   'Mechanical seals imported via EU route; recent customs rule changes added 5-8 day clearance variance.',
   '2026-06-20','2026-12-20','mitigating',true,'2026-06-20 10:00:00','2026-09-05 10:00:00'),
  (:company,'Bearing counterfeit risk in spot market','operational','high',2.50,4.50,3.50,NULL,'Industrial Components Ltd.','multi',
   '["SP-BRG-001"]'::jsonb,'[{"name":"ProTool Equipment Inc.","qualified":true,"leadDays":12}]'::jsonb,
   '[{"action":"Buy only through authorized distributors","owner":"EMP0003","due":"2026-09-15"},{"action":"Incoming authenticity checks on bearing lots","owner":"EMP0014","due":"2026-09-15"}]'::jsonb,
   'Spot-market 6205 bearings show counterfeit incidence; failure in field units would trigger warranty claims.',
   '2026-07-05','2027-01-05','mitigating',true,'2026-07-05 10:00:00','2026-09-01 10:00:00'),
  (:company,'Monsoon flooding of access roads','environmental','medium',3.20,3.00,3.10,NULL,NULL,NULL,
   '[]'::jsonb,'[]'::jsonb,
   '[{"action":"Transport plan for red-alert days","owner":"EMP0001","due":"2027-05-31"}]'::jsonb,
   'Seasonal flooding blocks inbound trucks and workforce commute; linked to scenario plan "Monsoon Flooding — Plant Access".',
   '2026-05-10','2027-04-30','monitoring',true,'2026-05-10 10:00:00','2026-05-25 10:00:00'),
  (:company,'Coolant chemical regulatory change','operational','low',2.00,2.20,2.10,NULL,'Chemical Solutions GmbH','dual',
   '["CON-CLT-001"]'::jsonb,'[{"name":"MaintainPro Services","qualified":true,"leadDays":7}]'::jsonb,
   '[{"action":"Track CPCB notification drafts","owner":"EMP0002","due":"2026-12-31"}]'::jsonb,
   'Proposed boron restrictions may force reformulation of cutting coolant; substitute already identified.',
   '2026-08-01','2027-02-01','open',true,'2026-08-01 10:00:00','2026-08-01 10:00:00');

-- ============================================================================
-- Team activities
-- ============================================================================
DELETE FROM team_activities WHERE "companyId" = :company;
INSERT INTO team_activities
  ("companyId", "userId", "userName", "userStatus", "activityType", "activityDescription",
   "resourceType", "resourceId", "resourceName", "teamId", "teamName", "shiftId", "workstationId",
   "isImportant", "isSystemGenerated", "activityAt", "createdAt", "updatedAt")
VALUES
  (:company,'EMP0007','Amit Verma','online','task_completed','Completed motor assembly for WO-DEMO-0029 (20/20 units)','work_order',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0029'),'WO-DEMO-0029','TEAM-ASSY','Assembly Team','DEMO-SH-A','WC-ASSY',true,false,'2026-09-09 12:30:00','2026-09-09 12:30:00','2026-09-09 12:30:00'),
  (:company,'EMP0014','Lakshmi Iyer','offline','status_changed','Hydro test batch for WO-DEMO-0027 marked Passed (23 accepted, 1 rework)','quality_check',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0027'),'WO-DEMO-0027 Final Inspection','TEAM-QC','Quality Team','DEMO-SH-C','WC-QC',true,false,'2026-09-08 03:35:00','2026-09-08 03:35:00','2026-09-08 03:35:00'),
  (:company,'EMP0009','Deepak Joshi','busy','issue_reported','Reported chipped T12 insert on VMC-850 during housing batch','work_order',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0028'),'WO-DEMO-0028','TEAM-CNC','CNC Cell Team','DEMO-SH-B','WC-CNC',false,false,'2026-09-07 18:15:00','2026-09-07 18:15:00','2026-09-07 18:15:00'),
  (:company,'EMP0002','Priya Sharma','online','approval_given','Approved Week 38 master schedule DEMO-PS-0003 for publication','document','DEMO-PS-0003','Week 38 Master Schedule','TEAM-PLAN','Planning Team',NULL,NULL,true,false,'2026-09-09 15:00:00','2026-09-09 15:00:00','2026-09-09 15:00:00'),
  (:company,'EMP0004','Vikram Singh','away','issue_reported','Raised material shortage at cutting: steel sheets awaited for WO-DEMO-0030','work_order',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0030'),'WO-DEMO-0030','TEAM-FAB','Fabrication Team','DEMO-SH-A','WC-CUT',false,false,'2026-09-09 09:25:00','2026-09-09 09:25:00','2026-09-09 09:25:00'),
  (:company,'EMP0013','Mohan Das','offline','handoff_started','Started night-to-morning handoff at CNC cell','work_order',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0024'),'WO-DEMO-0024','TEAM-CNC','CNC Cell Team','DEMO-SH-C','WC-CNC',false,false,'2026-09-08 05:45:00','2026-09-08 05:45:00','2026-09-08 05:45:00'),
  (:company,'SYSTEM','MES Gateway','online','status_changed','MES gateway connection restored after switch reboot in Bay 2',NULL,NULL,NULL,NULL,NULL,NULL,NULL,true,true,'2026-09-08 09:20:00','2026-09-08 09:20:00','2026-09-08 09:20:00'),
  (:company,'EMP0001','Rajesh Kumar','online','milestone_reached','Plant crossed 95% OTD for August — best month this year','document',NULL,'August OTD Report','TEAM-PLAN','Planning Team',NULL,NULL,true,false,'2026-09-02 10:00:00','2026-09-02 10:00:00','2026-09-02 10:00:00');

-- ============================================================================
-- Team messages
-- ============================================================================
DELETE FROM team_messages WHERE "companyId" = :company;
INSERT INTO team_messages
  ("companyId", "channelId", "channelType", "channelName", "senderId", "senderName", "messageType",
   content, mentions, "replyToId", "replyCount", status, "readBy", "isPinned", "createdAt", "updatedAt")
VALUES
  (:company,'CH-SHOPFLOOR','group','Shop Floor','EMP0009','Deepak Joshi','text',
   'T12 insert chipped mid-run on VMC-850, swapped in a new CNMG 120408. Batch back on track, ~25 min lost.',
   '[]'::jsonb,NULL,1,'read','[{"userId":"EMP0002","at":"2026-09-07T18:30:00Z"},{"userId":"EMP0001","at":"2026-09-07T19:00:00Z"}]'::jsonb,false,'2026-09-07 18:25:00','2026-09-07 18:25:00'),
  (:company,'CH-SHOPFLOOR','group','Shop Floor','EMP0002','Priya Sharma','text',
   'Thanks @Deepak — log the insert against DEMO-SP consumption and keep an eye on tool life this batch.',
   '["EMP0009"]'::jsonb,NULL,0,'read','[{"userId":"EMP0009","at":"2026-09-07T18:40:00Z"}]'::jsonb,false,'2026-09-07 18:35:00','2026-09-07 18:35:00'),
  (:company,'CH-SHIFT-C','shift','Night Shift','EMP0013','Mohan Das','alert',
   'MES gateway went offline 02:10. Logging production manually on paper till it is back.',
   '[]'::jsonb,NULL,2,'read','[{"userId":"EMP0002","at":"2026-09-08T06:05:00Z"}]'::jsonb,true,'2026-09-08 02:15:00','2026-09-08 02:15:00'),
  (:company,'CH-PLANNING','department','Planning','EMP0002','Priya Sharma','text',
   'Week 38 schedule (DEMO-PS-0003) is published. WO-DEMO-0030 moves to assembly Monday — QC and packing slots booked Thu/Fri.',
   '[]'::jsonb,NULL,0,'delivered','[]'::jsonb,true,'2026-09-09 15:05:00','2026-09-09 15:05:00'),
  (:company,'CH-QC','department','Quality','EMP0014','Lakshmi Iyer','text',
   'WO-DEMO-0027 hydro test done: 23 passed, 1 seal leak sent to rework. Seal stock is critically low — see shortage DEMO-SHRT-0003.',
   '[]'::jsonb,NULL,1,'read','[{"userId":"EMP0003","at":"2026-09-08T08:00:00Z"}]'::jsonb,false,'2026-09-08 03:40:00','2026-09-08 03:40:00'),
  (:company,'CH-SHOPFLOOR','group','Shop Floor','EMP0004','Vikram Singh','text',
   'Cutting idle 30 min waiting on steel sheets for WO-DEMO-0030. Store says release after lunch.',
   '["EMP0003"]'::jsonb,NULL,0,'read','[{"userId":"EMP0003","at":"2026-09-09T09:45:00Z"}]'::jsonb,false,'2026-09-09 09:30:00','2026-09-09 09:30:00');

-- ============================================================================
-- Waste records (monthly, Oct-2025 .. Sep-2026)
-- ============================================================================
DELETE FROM waste_records WHERE "companyId" = :company;
INSERT INTO waste_records
  ("companyId", "recordDate", "wasteType", "disposalMethod", "sourceAreaId", "sourceAreaName",
   "wasteAmount", "wasteUnit", "recycledAmount", "recyclingRate", "disposalCost", "recyclingRevenue",
   currency, "materialBreakdown", "vendorName", "manifestNumber", notes, "isCompliant", "createdAt", "updatedAt")
VALUES
  (:company,'2025-10-31','recyclable','recycled','WC-CUT','Cutting Section',1850.0,'kg',1850.0,100.0,0,42550,'INR','{"steelOffcuts":1520,"aluminum":330}'::jsonb,'Prime Steel Suppliers','DEMO-WM-2510','Steel and aluminium offcuts sold to scrap processor',true,'2025-11-02 10:00:00','2025-11-02 10:00:00'),
  (:company,'2025-11-30','recyclable','recycled','WC-CUT','Cutting Section',1720.0,'kg',1720.0,100.0,0,39560,'INR','{"steelOffcuts":1450,"aluminum":270}'::jsonb,'Prime Steel Suppliers','DEMO-WM-2511',NULL,true,'2025-12-02 10:00:00','2025-12-02 10:00:00'),
  (:company,'2025-12-31','hazardous','treated','WC-PAINT','Painting Section',240.0,'kg',0,0,28800,0,'INR','{"paintSludge":180,"usedThinner":60}'::jsonb,'Chemical Solutions GmbH','DEMO-WM-2512','Quarterly paint sludge disposal via authorized TSDF',true,'2026-01-03 10:00:00','2026-01-03 10:00:00'),
  (:company,'2026-01-31','recyclable','recycled','WC-CNC','CNC Machining',980.0,'kg',980.0,100.0,0,26460,'INR','{"machiningChips":980}'::jsonb,'Prime Steel Suppliers','DEMO-WM-2601','Briquetted chips after coolant recovery',true,'2026-02-02 10:00:00','2026-02-02 10:00:00'),
  (:company,'2026-02-28','non_hazardous','landfill','WC-PACK','Packing Section',420.0,'kg',110.0,26.19,6300,0,'INR','{"mixedPackaging":310,"strapping":110}'::jsonb,'PackRight Solutions','DEMO-WM-2602',NULL,true,'2026-03-02 10:00:00','2026-03-02 10:00:00'),
  (:company,'2026-03-31','hazardous','treated','WC-CNC','CNC Machining',310.0,'ltr',0,0,21700,0,'INR','{"spentCoolant":310}'::jsonb,'MaintainPro Services','DEMO-WM-2603','Coolant change-out on VMC-850',true,'2026-04-02 10:00:00','2026-04-02 10:00:00'),
  (:company,'2026-04-30','recyclable','recycled','WC-CUT','Cutting Section',1940.0,'kg',1940.0,100.0,0,44620,'INR','{"steelOffcuts":1610,"aluminum":330}'::jsonb,'Prime Steel Suppliers','DEMO-WM-2604',NULL,true,'2026-05-02 10:00:00','2026-05-02 10:00:00'),
  (:company,'2026-05-31','organic','composted','CANTEEN','Plant Canteen',260.0,'kg',260.0,100.0,1500,0,'INR','{"foodWaste":260}'::jsonb,NULL,'DEMO-WM-2605','On-site compost pit commissioned in May',true,'2026-06-02 10:00:00','2026-06-02 10:00:00'),
  (:company,'2026-06-30','electronic','recycled','IT-STORE','IT Store',85.0,'kg',85.0,100.0,0,3400,'INR','{"scrapPanels":60,"cables":25}'::jsonb,'ElectroTech Supplies','DEMO-WM-2606','Obsolete control panels from PB-110 retrofit',true,'2026-07-02 10:00:00','2026-07-02 10:00:00'),
  (:company,'2026-07-31','recyclable','recycled','WC-CUT','Cutting Section',2010.0,'kg',2010.0,100.0,0,48240,'INR','{"steelOffcuts":1700,"aluminum":310}'::jsonb,'Prime Steel Suppliers','DEMO-WM-2607','Highest scrap month — shutter order ramp',true,'2026-08-02 10:00:00','2026-08-02 10:00:00'),
  (:company,'2026-08-31','hazardous','treated','WC-PAINT','Painting Section',195.0,'kg',0,0,23400,0,'INR','{"paintSludge":150,"usedThinner":45}'::jsonb,'Chemical Solutions GmbH','DEMO-WM-2608',NULL,true,'2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'2026-09-08','non_hazardous','landfill','WC-PACK','Packing Section',150.0,'kg',40.0,26.67,2250,0,'INR','{"mixedPackaging":110,"strapping":40}'::jsonb,'PackRight Solutions','DEMO-WM-2609','Month-to-date figure',true,'2026-09-09 10:00:00','2026-09-09 10:00:00');

-- ============================================================================
-- Water usages (monthly, Oct-2025 .. Sep-2026)
-- ============================================================================
DELETE FROM water_usages WHERE "companyId" = :company;
INSERT INTO water_usages
  ("companyId", "recordDate", "waterSource", "useType", "zoneId", "zoneName", "consumptionAmount",
   "consumptionUnit", "recycledAmount", "recyclingRate", "dischargeAmount", cost, currency,
   "targetConsumption", "efficiencyRate", notes, "isCompliant", "createdAt", "updatedAt")
VALUES
  (:company,'2025-10-31','municipal','process','ZONE-PAINT','Paint Shop Pretreatment',48.5,'kiloliters',9.2,18.97,32.0,21825,'INR',50.0,97.0,NULL,true,'2025-11-02 10:00:00','2025-11-02 10:00:00'),
  (:company,'2025-11-30','municipal','process','ZONE-PAINT','Paint Shop Pretreatment',45.8,'kiloliters',9.0,19.65,30.1,20610,'INR',50.0,91.6,NULL,true,'2025-12-02 10:00:00','2025-12-02 10:00:00'),
  (:company,'2025-12-31','municipal','cooling','ZONE-CNC','CNC Coolant Make-up',12.4,'kiloliters',3.1,25.0,2.2,5580,'INR',14.0,88.6,NULL,true,'2026-01-03 10:00:00','2026-01-03 10:00:00'),
  (:company,'2026-01-31','groundwater','sanitary','ZONE-ADMIN','Admin & Welfare Block',38.0,'kiloliters',0,0,34.0,7600,'INR',40.0,95.0,NULL,true,'2026-02-02 10:00:00','2026-02-02 10:00:00'),
  (:company,'2026-02-28','municipal','process','ZONE-PAINT','Paint Shop Pretreatment',44.2,'kiloliters',10.5,23.76,28.4,19890,'INR',48.0,92.1,'RO reject reuse loop commissioned',true,'2026-03-02 10:00:00','2026-03-02 10:00:00'),
  (:company,'2026-03-31','municipal','cleaning','ZONE-SHOP','Shop Floor Washdown',16.8,'kiloliters',4.2,25.0,11.9,7560,'INR',18.0,93.3,NULL,true,'2026-04-02 10:00:00','2026-04-02 10:00:00'),
  (:company,'2026-04-30','municipal','process','ZONE-PAINT','Paint Shop Pretreatment',47.1,'kiloliters',12.8,27.18,29.5,21195,'INR',48.0,98.1,NULL,true,'2026-05-02 10:00:00','2026-05-02 10:00:00'),
  (:company,'2026-05-31','groundwater','landscape','ZONE-GREEN','Green Belt',22.0,'kiloliters',22.0,100.0,0,2200,'INR',25.0,88.0,'Fully fed from treated effluent in summer',true,'2026-06-02 10:00:00','2026-06-02 10:00:00'),
  (:company,'2026-06-30','rainwater','process','ZONE-PAINT','Paint Shop Pretreatment',18.6,'kiloliters',18.6,100.0,0,0,'INR',NULL,NULL,'Monsoon harvest offsetting municipal draw',true,'2026-07-02 10:00:00','2026-07-02 10:00:00'),
  (:company,'2026-07-31','rainwater','process','ZONE-PAINT','Paint Shop Pretreatment',24.2,'kiloliters',24.2,100.0,0,0,'INR',NULL,NULL,'Peak monsoon harvest month',true,'2026-08-02 10:00:00','2026-08-02 10:00:00'),
  (:company,'2026-08-31','municipal','process','ZONE-PAINT','Paint Shop Pretreatment',41.5,'kiloliters',11.9,28.67,25.6,18675,'INR',46.0,90.2,NULL,true,'2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'2026-09-08','municipal','cooling','ZONE-CNC','CNC Coolant Make-up',3.6,'kiloliters',0.9,25.0,0.6,1620,'INR',13.0,NULL,'Month-to-date figure',true,'2026-09-09 10:00:00','2026-09-09 10:00:00');
