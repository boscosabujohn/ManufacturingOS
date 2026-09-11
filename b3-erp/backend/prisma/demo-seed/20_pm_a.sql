-- Demo seed — Project Management (part A) for B3 MACBIS.
-- Covers: BOM (headers/details), inventory reservations, nesting, packaging,
-- dispatch, GRNs, installation (tasks/team/checklists/daily reports), handover
-- (certificates/steps) and the pm_* planning/closure tables.
-- Anchors to the 3 existing projects:
--   PRJ-2026-0001  Industrial Kitchen 2026        (Grand Hyatt Dubai)  — full lifecycle
--   PRJ-2026-0005  Solar Panel Array Installation (GreenEnergy Co)     — installation in progress
--   PRJ-2026-0006  Automation Line Upgrade        (AutoParts Ltd)      — planning stage
-- Idempotent: DELETE-then-INSERT. Delete predicates:
--   * project-scoped FK tables → project_id IN (the 3 demo projects)
--   * pm_* tables              → company_id = :company
--   * grns                     → delivery_note_ref LIKE 'DEMO-DN-%'
--   * bom_headers/packaging_crates → 'DEMO-' name/number prefix
\set company '''b3000000-0000-4000-8000-000000000001'''
\set p1 '(SELECT id FROM projects WHERE project_code = ''PRJ-2026-0001'')'
\set p2 '(SELECT id FROM projects WHERE project_code = ''PRJ-2026-0005'')'
\set p3 '(SELECT id FROM projects WHERE project_code = ''PRJ-2026-0006'')'

-- ============================================================================
-- BOM: bom_headers → bom_details → inventory_reservations
-- (delete children first: reservations reference bom_details)
-- ============================================================================
DELETE FROM inventory_reservations WHERE project_id IN (:p1, :p2, :p3);
DELETE FROM bom_details WHERE header_id IN (SELECT id FROM bom_headers WHERE name LIKE 'DEMO-BOM%');
DELETE FROM bom_headers WHERE name LIKE 'DEMO-BOM%';

-- bom_headers: project_id is a bare varchar (stores the project uuid as text);
-- "projectId" is the actual uuid FK column — set both.
INSERT INTO bom_headers (project_id, "projectId", name, status, version, is_latest, verified_by, verified_at, created_at, updated_at)
VALUES
  ((:p1)::text, :p1, 'DEMO-BOM Hot Kitchen Line v1',  'archived', 1, false, 'Rajesh Kumar', '2026-02-20 10:00:00', '2026-02-10 09:00:00', '2026-03-05 09:00:00'),
  ((:p1)::text, :p1, 'DEMO-BOM Hot Kitchen Line v2',  'released', 2, true,  'Rajesh Kumar', '2026-03-06 14:30:00', '2026-03-04 11:00:00', '2026-03-06 14:30:00'),
  ((:p1)::text, :p1, 'DEMO-BOM Cold Room & Prep Area','released', 1, true,  'Anita Desai',  '2026-03-12 16:00:00', '2026-03-09 10:15:00', '2026-03-12 16:00:00'),
  ((:p2)::text, :p2, 'DEMO-BOM Rooftop Mounting Structures', 'verified', 1, true, 'Vikram Singh', '2026-05-18 12:00:00', '2026-05-12 09:30:00', '2026-05-18 12:00:00');

INSERT INTO bom_details (header_id, item_id, quantity, uom, parent_detail_id, notes, created_at, updated_at)
VALUES
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Hot Kitchen Line v2'), (SELECT id FROM items WHERE "itemCode" = 'RM-STL-001'), 240.000, 'SQM', NULL, 'SS-304 sheet for cookline counters and splashbacks', '2026-03-04 11:05:00', '2026-03-04 11:05:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Hot Kitchen Line v2'), (SELECT id FROM items WHERE "itemCode" = 'FG-MTR-001'),   6.000, 'NOS', NULL, 'Exhaust hood blower motors',                        '2026-03-04 11:06:00', '2026-03-04 11:06:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Hot Kitchen Line v2'), (SELECT id FROM items WHERE "itemCode" = 'SP-BRG-001'),  24.000, 'NOS', NULL, 'Bearings for hood blower assemblies',               '2026-03-04 11:07:00', '2026-03-04 11:07:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Hot Kitchen Line v2'), (SELECT id FROM items WHERE "itemCode" = 'RM-COP-001'), 850.000, 'MTR', NULL, 'Power cabling for cookline equipment',              '2026-03-04 11:08:00', '2026-03-04 11:08:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Hot Kitchen Line v2'), (SELECT id FROM items WHERE "itemCode" = 'RM-ALM-001'),  60.000, 'MTR', NULL, 'Aluminium trims and edge profiles',                 '2026-03-04 11:09:00', '2026-03-04 11:09:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Cold Room & Prep Area'), (SELECT id FROM items WHERE "itemCode" = 'RM-STL-001'), 120.000, 'SQM', NULL, 'Cold-room panel cladding sheet',                  '2026-03-09 10:20:00', '2026-03-09 10:20:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Cold Room & Prep Area'), (SELECT id FROM items WHERE "itemCode" = 'FG-PMP-001'),   2.000, 'NOS', NULL, 'Condensate drain pumps',                          '2026-03-09 10:21:00', '2026-03-09 10:21:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Cold Room & Prep Area'), (SELECT id FROM items WHERE "itemCode" = 'SP-SL-001'),    4.000, 'NOS', NULL, 'Mechanical seals for drain pumps',                '2026-03-09 10:22:00', '2026-03-09 10:22:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Rooftop Mounting Structures'), (SELECT id FROM items WHERE "itemCode" = 'RM-ALM-001'), 480.000, 'MTR', NULL, 'Aluminium rails for panel mounting', '2026-05-12 09:35:00', '2026-05-12 09:35:00'),
  ((SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Rooftop Mounting Structures'), (SELECT id FROM items WHERE "itemCode" = 'SP-BLT-001'),  36.000, 'NOS', NULL, 'Drive belts for tracker gear units', '2026-05-12 09:36:00', '2026-05-12 09:36:00');

INSERT INTO inventory_reservations (project_id, bom_detail_id, item_id, "quantityReserved", status, created_at, updated_at)
VALUES
  (:p1, (SELECT d.id FROM bom_details d WHERE d.header_id = (SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Hot Kitchen Line v2') AND d.item_id = (SELECT id FROM items WHERE "itemCode" = 'RM-STL-001')),
       (SELECT id FROM items WHERE "itemCode" = 'RM-STL-001'), 240.000, 'fulfilled', '2026-03-10 09:00:00', '2026-04-02 15:00:00'),
  (:p1, (SELECT d.id FROM bom_details d WHERE d.header_id = (SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Hot Kitchen Line v2') AND d.item_id = (SELECT id FROM items WHERE "itemCode" = 'FG-MTR-001')),
       (SELECT id FROM items WHERE "itemCode" = 'FG-MTR-001'), 6.000, 'fulfilled', '2026-03-10 09:05:00', '2026-04-05 11:30:00'),
  (:p1, (SELECT d.id FROM bom_details d WHERE d.header_id = (SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Hot Kitchen Line v2') AND d.item_id = (SELECT id FROM items WHERE "itemCode" = 'RM-COP-001')),
       (SELECT id FROM items WHERE "itemCode" = 'RM-COP-001'), 850.000, 'fulfilled', '2026-03-10 09:10:00', '2026-04-08 10:00:00'),
  (:p1, (SELECT d.id FROM bom_details d WHERE d.header_id = (SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Cold Room & Prep Area') AND d.item_id = (SELECT id FROM items WHERE "itemCode" = 'FG-PMP-001')),
       (SELECT id FROM items WHERE "itemCode" = 'FG-PMP-001'), 2.000, 'pending', '2026-03-14 14:00:00', '2026-03-14 14:00:00'),
  (:p2, (SELECT d.id FROM bom_details d WHERE d.header_id = (SELECT id FROM bom_headers WHERE name = 'DEMO-BOM Rooftop Mounting Structures') AND d.item_id = (SELECT id FROM items WHERE "itemCode" = 'RM-ALM-001')),
       (SELECT id FROM items WHERE "itemCode" = 'RM-ALM-001'), 480.000, 'pending', '2026-05-20 10:00:00', '2026-05-20 10:00:00'),
  (:p2, NULL, (SELECT id FROM items WHERE "itemCode" = 'TOOL-DRL-001'), 2.000, 'cancelled', '2026-05-22 09:00:00', '2026-06-01 09:00:00');

-- ============================================================================
-- nesting_assets — CNC nesting files for fabrication (P1 kitchen + P2 rails)
-- ============================================================================
DELETE FROM nesting_assets WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO nesting_assets (project_id, file_name, file_type, revision, status, metadata, created_at, updated_at)
VALUES
  (:p1, 'DEMO-NEST-HK-counters-r1.dxf',   'dxf', 1, 'obsolete', '{"sheets": 18, "material": "SS-304 2mm", "utilization": 78.4}'::jsonb, '2026-03-16 10:00:00', '2026-03-20 09:00:00'),
  (:p1, 'DEMO-NEST-HK-counters-r2.dxf',   'dxf', 2, 'approved', '{"sheets": 16, "material": "SS-304 2mm", "utilization": 86.1}'::jsonb, '2026-03-20 09:05:00', '2026-03-21 15:30:00'),
  (:p1, 'DEMO-NEST-HK-hoods-r1.nc',       'nc',  1, 'approved', '{"sheets": 9, "material": "SS-304 1.5mm", "utilization": 82.7}'::jsonb, '2026-03-24 11:00:00', '2026-03-25 16:00:00'),
  (:p1, 'DEMO-NEST-coldroom-panels-r1.dxf','dxf', 1, 'approved', '{"sheets": 12, "material": "SS-304 2mm", "utilization": 80.9}'::jsonb, '2026-03-28 10:30:00', '2026-03-30 12:00:00'),
  (:p2, 'DEMO-NEST-solar-rail-brackets-r1.dxf', 'dxf', 1, 'pending', '{"sheets": 6, "material": "Alu 3mm", "utilization": 74.2}'::jsonb, '2026-06-02 09:00:00', '2026-06-02 09:00:00');

-- ============================================================================
-- Packaging: packaging_crates → packaging_items
-- ============================================================================
DELETE FROM packaging_items WHERE crate_id IN (SELECT id FROM packaging_crates WHERE crate_number LIKE 'DEMO-CRT%');
DELETE FROM packaging_crates WHERE crate_number LIKE 'DEMO-CRT%';

INSERT INTO packaging_crates (project_id, crate_number, dimensions, actual_weight, design_weight, status, qr_code, created_at, updated_at)
VALUES
  (:p1, 'DEMO-CRT-0001', '220x110x120 cm', 412.50, 400.00, 'dispatched', 'QR-DEMO-CRT-0001', '2026-05-04 09:00:00', '2026-05-12 08:30:00'),
  (:p1, 'DEMO-CRT-0002', '240x120x140 cm', 538.00, 520.00, 'dispatched', 'QR-DEMO-CRT-0002', '2026-05-04 10:00:00', '2026-05-12 08:30:00'),
  (:p1, 'DEMO-CRT-0003', '180x100x110 cm', 264.75, 280.00, 'sealed',     'QR-DEMO-CRT-0003', '2026-05-18 11:00:00', '2026-05-27 17:00:00'),
  (:p2, 'DEMO-CRT-0004', '300x80x60 cm',     0.00, 350.00, 'open',       'QR-DEMO-CRT-0004', '2026-06-15 09:30:00', '2026-06-15 09:30:00');

INSERT INTO packaging_items (crate_id, item_id, "quantityPacked")
VALUES
  ((SELECT id FROM packaging_crates WHERE crate_number = 'DEMO-CRT-0001'), (SELECT id FROM items WHERE "itemCode" = 'RM-STL-001'), 120.00),
  ((SELECT id FROM packaging_crates WHERE crate_number = 'DEMO-CRT-0001'), (SELECT id FROM items WHERE "itemCode" = 'RM-ALM-001'),  30.00),
  ((SELECT id FROM packaging_crates WHERE crate_number = 'DEMO-CRT-0002'), (SELECT id FROM items WHERE "itemCode" = 'FG-MTR-001'),   6.00),
  ((SELECT id FROM packaging_crates WHERE crate_number = 'DEMO-CRT-0002'), (SELECT id FROM items WHERE "itemCode" = 'SP-BRG-001'),  24.00),
  ((SELECT id FROM packaging_crates WHERE crate_number = 'DEMO-CRT-0003'), (SELECT id FROM items WHERE "itemCode" = 'FG-PMP-001'),   2.00),
  ((SELECT id FROM packaging_crates WHERE crate_number = 'DEMO-CRT-0003'), (SELECT id FROM items WHERE "itemCode" = 'SP-SL-001'),    4.00),
  ((SELECT id FROM packaging_crates WHERE crate_number = 'DEMO-CRT-0004'), (SELECT id FROM items WHERE "itemCode" = 'RM-ALM-001'), 240.00),
  ((SELECT id FROM packaging_crates WHERE crate_number = 'DEMO-CRT-0004'), (SELECT id FROM items WHERE "itemCode" = 'SP-BLT-001'),  18.00);

-- ============================================================================
-- dispatch_records — vehicle dispatches to site (note: column is dispatch_at)
-- ============================================================================
DELETE FROM dispatch_records WHERE project_id IN (:p1, :p2, :p3);
INSERT INTO dispatch_records (project_id, vehicle_no, driver_name, driver_phone, status, loading_photos, dispatch_at, delivered_at, created_at, updated_at)
VALUES
  (:p1, 'DXB-A-48213', 'Imran Shaikh',  '+971-50-555-0141', 'delivered',  '["demo/dispatch/crt1-loading-1.jpg","demo/dispatch/crt1-loading-2.jpg"]'::jsonb, '2026-05-12 07:45:00', '2026-05-12 10:20:00', '2026-05-11 16:00:00', '2026-05-12 10:20:00'),
  (:p1, 'DXB-B-77450', 'Yusuf Al Marri','+971-50-555-0162', 'delivered',  '["demo/dispatch/crt2-loading-1.jpg"]'::jsonb,                                     '2026-05-12 08:10:00', '2026-05-12 11:05:00', '2026-05-11 16:30:00', '2026-05-12 11:05:00'),
  (:p1, 'SHJ-C-10982', 'Ganesh Patil',  '+971-55-555-0177', 'in_transit', '["demo/dispatch/crt3-loading-1.jpg"]'::jsonb,                                     '2026-05-28 07:30:00', NULL,                  '2026-05-27 17:30:00', '2026-05-28 07:30:00'),
  (:p2, 'DXB-D-33107', 'Ravi Menon',    '+971-52-555-0193', 'loading',    NULL,                                                                              NULL,                  NULL,                  '2026-06-16 09:00:00', '2026-06-16 09:00:00');

-- ============================================================================
-- grns — goods receipts against demo POs (purchase_order_id is a bare varchar;
-- tied to PO-DEMO numbers). Delete predicate: delivery_note_ref LIKE 'DEMO-DN-%'.
-- ============================================================================
DELETE FROM grns WHERE delivery_note_ref LIKE 'DEMO-DN-%';
INSERT INTO grns (purchase_order_id, received_by, delivery_note_ref, status, qc_notes, qc_passed, created_at, updated_at)
VALUES
  ('PO-DEMO-0001', 'Suresh Patel',  'DEMO-DN-2026-0101', 'completed',  'SS-304 sheets — thickness verified with micrometer, finish OK.', true,  '2026-03-18 10:30:00', '2026-03-19 14:00:00'),
  ('PO-DEMO-0002', 'Suresh Patel',  'DEMO-DN-2026-0102', 'completed',  'Blower motors — insulation resistance test passed on all 6 units.', true, '2026-03-25 09:15:00', '2026-03-26 11:45:00'),
  ('PO-DEMO-0003', 'Deepak Joshi',  'DEMO-DN-2026-0103', 'rejected',   '2 of 24 bearings showed corrosion; lot rejected, replacement requested.', false, '2026-04-02 11:00:00', '2026-04-03 16:20:00'),
  ('PO-DEMO-0003', 'Deepak Joshi',  'DEMO-DN-2026-0104', 'completed',  'Replacement bearing lot inspected — all 24 OK.', true, '2026-04-14 10:00:00', '2026-04-15 09:30:00'),
  ('PO-DEMO-0004', 'Meera Nair',    'DEMO-DN-2026-0105', 'completed',  'Copper cabling — continuity and gauge checks passed.', true, '2026-04-08 13:30:00', '2026-04-09 10:15:00'),
  ('PO-DEMO-0005', 'Meera Nair',    'DEMO-DN-2026-0106', 'pending_qc', 'Aluminium rails received for solar project; awaiting dimensional QC.', false, '2026-06-10 09:45:00', '2026-06-10 09:45:00');

-- ============================================================================
-- Installation: installation_tasks → team assignments / checklist items,
-- then daily install reports
-- ============================================================================
DELETE FROM installation_team_assignments WHERE project_id IN (:p1, :p2, :p3);
DELETE FROM installation_checklist_items WHERE project_id IN ((:p1)::text, (:p2)::text, (:p3)::text);
DELETE FROM installation_tasks WHERE project_id IN (:p1, :p2, :p3);
DELETE FROM daily_install_reports WHERE project_id IN (:p1, :p2, :p3);

INSERT INTO installation_tasks (project_id, installer_id, task_name, progress, status, completion_photos, "snagNotes", created_at, updated_at)
VALUES
  (:p1, 'EMP0005', 'Mark out kitchen layout and set datum lines',        100.00, 'done',        '["demo/install/p1-markout-1.jpg"]'::jsonb, NULL, '2026-05-13 08:00:00', '2026-05-15 17:00:00'),
  (:p1, 'EMP0005', 'Install hot-line base units and counters',           100.00, 'done',        '["demo/install/p1-hotline-1.jpg","demo/install/p1-hotline-2.jpg"]'::jsonb, 'Minor scratch on counter edge — buffed on site.', '2026-05-16 08:00:00', '2026-06-02 17:30:00'),
  (:p1, 'EMP0009', 'Mount exhaust hoods and blower assemblies',          100.00, 'done',        '["demo/install/p1-hoods-1.jpg"]'::jsonb, NULL, '2026-06-03 08:00:00', '2026-06-18 16:45:00'),
  (:p1, 'EMP0009', 'Erect cold-room panels and fit drain pumps',          85.00, 'in_progress', NULL, 'Waiting on crate DEMO-CRT-0003 balance materials.', '2026-06-19 08:00:00', '2026-09-01 17:00:00'),
  (:p1, 'EMP0013', 'Final alignment and silicone sealing',                20.00, 'in_progress', NULL, NULL, '2026-08-20 08:00:00', '2026-09-05 17:00:00'),
  (:p2, 'EMP0010', 'Fix rooftop mounting rails — Zone A',                100.00, 'done',        '["demo/install/p2-zonea-1.jpg"]'::jsonb, NULL, '2026-07-01 07:30:00', '2026-07-22 16:00:00'),
  (:p2, 'EMP0010', 'Fix rooftop mounting rails — Zone B',                 60.00, 'in_progress', NULL, NULL, '2026-07-23 07:30:00', '2026-09-04 16:00:00'),
  (:p2, 'EMP0019', 'Cable tray routing to inverter room',                  0.00, 'blocked',     NULL, 'Blocked: inverter room civil works not handed over by main contractor.', '2026-08-10 08:00:00', '2026-08-28 12:00:00'),
  (:p3, 'EMP0020', 'Pre-install site survey of automation line area',      0.00, 'todo',        NULL, NULL, '2026-08-25 09:00:00', '2026-08-25 09:00:00');

INSERT INTO installation_team_assignments (project_id, installer_id, installer_name, role, skills, assigned_by, is_active, created_at, updated_at)
VALUES
  (:p1, 'EMP0005', 'Suresh Patel',  'lead',       '["stainless fabrication","site supervision"]'::jsonb, 'Rajesh Kumar', true,  '2026-05-10 09:00:00', '2026-05-10 09:00:00'),
  (:p1, 'EMP0009', 'Deepak Joshi',  'technician', '["hood installation","electrical"]'::jsonb,           'Rajesh Kumar', true,  '2026-05-10 09:05:00', '2026-05-10 09:05:00'),
  (:p1, 'EMP0013', 'Mohan Das',     'helper',     '["sealing","finishing"]'::jsonb,                      'Rajesh Kumar', true,  '2026-05-10 09:10:00', '2026-05-10 09:10:00'),
  (:p1, 'EMP0017', 'Sanjay Malhotra','technician','["refrigeration","cold rooms"]'::jsonb,               'Rajesh Kumar', false, '2026-05-10 09:15:00', '2026-07-15 10:00:00'),
  (:p2, 'EMP0010', 'Ravi Menon',    'lead',       '["structural mounting","rigging"]'::jsonb,            'Vikram Singh', true,  '2026-06-28 10:00:00', '2026-06-28 10:00:00'),
  (:p2, 'EMP0019', 'Ramesh Yadav',  'technician', '["cabling","tray work"]'::jsonb,                      'Vikram Singh', true,  '2026-06-28 10:05:00', '2026-06-28 10:05:00');

-- installation_checklist_items: project_id/company_id are varchar columns.
INSERT INTO installation_checklist_items (company_id, project_id, checklist_type, item_key, label, category, sub_label, status, deviation, notes, sort_order, created_at, updated_at)
VALUES
  (:company, (:p1)::text, 'cabinet-align',    'base-units-wall-a',   'Base Units - Wall A',        NULL, NULL, 'Aligned',  1.5,  NULL, 1, '2026-06-01 09:00:00', '2026-06-02 15:00:00'),
  (:company, (:p1)::text, 'cabinet-align',    'base-units-wall-b',   'Base Units - Wall B',        NULL, NULL, 'Aligned',  0.8,  NULL, 2, '2026-06-01 09:00:00', '2026-06-02 15:10:00'),
  (:company, (:p1)::text, 'cabinet-align',    'island-counter',      'Island Counter Run',         NULL, NULL, 'Issue',    4.2,  'Floor level dips 4mm near drain — shimming required.', 3, '2026-06-01 09:00:00', '2026-06-03 11:30:00'),
  (:company, (:p1)::text, 'trial-wall',       'hood-bracket-line',   'Hood Bracket Line-up',       NULL, NULL, 'Verified', NULL, NULL, 1, '2026-06-05 09:00:00', '2026-06-06 14:00:00'),
  (:company, (:p1)::text, 'trial-wall',       'splashback-panels',   'Splashback Panel Fit',       NULL, NULL, 'Adjustment Needed', NULL, 'Panel SB-04 fouls conduit; trim 6mm.', 2, '2026-06-05 09:00:00', '2026-06-06 16:20:00'),
  (:company, (:p1)::text, 'accessory-fix',    'shelving-hot-line',   'Overhead Shelving',          NULL, 'Hot Line',   'Installed', NULL, NULL, 1, '2026-06-20 09:00:00', '2026-06-25 12:00:00'),
  (:company, (:p1)::text, 'accessory-fix',    'faucets-prep-area',   'Pre-rinse Faucets',          NULL, 'Prep Area',  'Testing',   NULL, NULL, 2, '2026-06-20 09:00:00', '2026-07-02 10:30:00'),
  (:company, (:p1)::text, 'final-inspection', 'equipment-power-on',  'All Equipment Powers On',    'Functionality', NULL, 'Pass',    NULL, NULL, 1, '2026-08-22 09:00:00', '2026-08-24 15:00:00'),
  (:company, (:p1)::text, 'final-inspection', 'gas-leak-test',       'Gas Line Leak Test',         'Safety',        NULL, 'Pass',    NULL, 'Soap-bubble test on all joints, zero leaks.', 2, '2026-08-22 09:00:00', '2026-08-24 15:30:00'),
  (:company, (:p1)::text, 'kitchen-cleaning', 'degrease-hotline',    'Degrease Hot Line Surfaces', NULL, NULL, 'Cleaned',  NULL, NULL, 1, '2026-08-25 09:00:00', '2026-08-26 17:00:00'),
  (:company, (:p2)::text, 'final-align',      'zone-a-rail-torque',  'Zone A Rail Torque Check',   NULL, NULL, 'Perfect',  NULL, NULL, 1, '2026-07-20 09:00:00', '2026-07-22 14:00:00'),
  (:company, (:p2)::text, 'final-align',      'zone-b-rail-torque',  'Zone B Rail Torque Check',   NULL, NULL, 'Pending',  NULL, NULL, 2, '2026-07-20 09:00:00', '2026-07-20 09:00:00');

-- daily_install_reports: note the mixed-case "reportDate" column.
INSERT INTO daily_install_reports (project_id, "reportDate", overall_progress, work_done, planned_for_tomorrow, issues_encountered, is_site_cleaned, cleaning_photos, progress_photos, manpower_count, is_client_notified, client_feedback, created_at, updated_at)
VALUES
  (:p1, '2026-05-14', 12.00, 'Datum lines set for hot line and cold room; crate DEMO-CRT-0001 unpacked and staged.', 'Start base unit placement along Wall A.', NULL, true, '["demo/dir/p1-0514-clean.jpg"]'::jsonb, '["demo/dir/p1-0514-1.jpg"]'::jsonb, 5, true, NULL, '2026-05-14 18:00:00', '2026-05-14 18:00:00'),
  (:p1, '2026-06-02', 38.00, 'Hot-line base units levelled and bolted; counters seam-welded and polished.', 'Begin hood bracket marking.', 'Island counter floor dip logged for shimming.', true, NULL, '["demo/dir/p1-0602-1.jpg","demo/dir/p1-0602-2.jpg"]'::jsonb, 6, true, 'Client walked the line, happy with counter finish.', '2026-06-02 18:15:00', '2026-06-02 18:15:00'),
  (:p1, '2026-06-18', 55.00, 'All 6 exhaust hoods mounted; blower motors wired and test-run.', 'Start cold-room panel erection.', NULL, true, NULL, '["demo/dir/p1-0618-1.jpg"]'::jsonb, 7, true, NULL, '2026-06-18 18:00:00', '2026-06-18 18:00:00'),
  (:p1, '2026-09-01', 82.00, 'Cold-room panels 85% erected; drain pump bases grouted.', 'Fit condensate pumps and continue final sealing.', 'Balance material for cold room still in transit (DEMO-CRT-0003).', false, NULL, '["demo/dir/p1-0901-1.jpg"]'::jsonb, 6, true, NULL, '2026-09-01 18:10:00', '2026-09-01 18:10:00'),
  (:p2, '2026-07-22', 45.00, 'Zone A mounting rails complete and torque-checked.', 'Mobilize crew to Zone B.', NULL, true, '["demo/dir/p2-0722-clean.jpg"]'::jsonb, '["demo/dir/p2-0722-1.jpg"]'::jsonb, 4, true, 'GreenEnergy site engineer signed off Zone A.', '2026-07-22 17:30:00', '2026-07-22 17:30:00'),
  (:p2, '2026-09-04', 58.00, 'Zone B rails 60% fixed; brackets pre-assembled for remaining bays.', 'Continue Zone B; chase contractor on inverter room handover.', 'Cable tray task blocked — inverter room not released.', true, NULL, '["demo/dir/p2-0904-1.jpg"]'::jsonb, 5, false, NULL, '2026-09-04 17:45:00', '2026-09-04 17:45:00');

-- ============================================================================
-- Handover: handover_certificates → handover_checklist_steps
-- (P1 phase-1 hot kitchen signed; P2 pending)
-- ============================================================================
DELETE FROM handover_checklist_steps WHERE project_id IN (:p1, :p2, :p3);
DELETE FROM handover_certificates WHERE project_id IN (:p1, :p2, :p3);

INSERT INTO handover_certificates (project_id, client_signatory, signatory_title, signed_at, status, certificate_url, closure_rating, closure_feedback, created_at, updated_at)
VALUES
  (:p1, 'Andreas Weber', 'Director of Engineering, Grand Hyatt Dubai', '2026-08-28 15:30:00', 'signed', 'demo/handover/p1-phase1-certificate.pdf', 5, 'Hot kitchen phase delivered to spec; excellent site discipline from the B3 crew.', '2026-08-20 09:00:00', '2026-08-28 15:30:00'),
  (:p2, NULL, NULL, NULL, 'pending', NULL, NULL, NULL, '2026-09-05 10:00:00', '2026-09-05 10:00:00');

INSERT INTO handover_checklist_steps (project_id, step_no, title, status, notes, completed_at, created_at, updated_at)
VALUES
  (:p1, 1, 'Work Photos Uploaded',           'completed', 'Phase-1 hot kitchen photo set uploaded.',            '2026-08-24 10:00:00+00', '2026-08-20 09:05:00+00', '2026-08-24 10:00:00+00'),
  (:p1, 2, 'Client Daily Reviews Completed', 'completed', NULL,                                                 '2026-08-24 14:00:00+00', '2026-08-20 09:05:00+00', '2026-08-24 14:00:00+00'),
  (:p1, 3, 'Final Approval Obtained',        'completed', 'Final inspection checklist passed 2026-08-24.',      '2026-08-25 11:00:00+00', '2026-08-20 09:05:00+00', '2026-08-25 11:00:00+00'),
  (:p1, 4, 'Site Cleaning Complete',         'completed', NULL,                                                 '2026-08-26 17:00:00+00', '2026-08-20 09:05:00+00', '2026-08-26 17:00:00+00'),
  (:p1, 5, 'Tools Returned',                 'completed', NULL,                                                 '2026-08-27 09:30:00+00', '2026-08-20 09:05:00+00', '2026-08-27 09:30:00+00'),
  (:p1, 6, 'Handover Ceremony Done',         'completed', 'Ceremony held with hotel engineering team.',         '2026-08-28 15:00:00+00', '2026-08-20 09:05:00+00', '2026-08-28 15:00:00+00'),
  (:p1, 7, 'Client Signature Captured',      'completed', NULL,                                                 '2026-08-28 15:30:00+00', '2026-08-20 09:05:00+00', '2026-08-28 15:30:00+00'),
  (:p1, 8, 'Project Closed',                 'in_progress', 'Phase 2 (cold room) still running — full closure after phase 2.', NULL, '2026-08-20 09:05:00+00', '2026-09-01 09:00:00+00'),
  (:p2, 1, 'Work Photos Uploaded',           'in_progress', 'Zone A set uploaded; Zone B pending.',             NULL, '2026-09-05 10:05:00+00', '2026-09-05 10:05:00+00'),
  (:p2, 2, 'Client Daily Reviews Completed', 'pending',   NULL,                                                 NULL, '2026-09-05 10:05:00+00', '2026-09-05 10:05:00+00'),
  (:p2, 3, 'Final Approval Obtained',        'pending',   NULL,                                                 NULL, '2026-09-05 10:05:00+00', '2026-09-05 10:05:00+00'),
  (:p2, 4, 'Site Cleaning Complete',         'pending',   NULL,                                                 NULL, '2026-09-05 10:05:00+00', '2026-09-05 10:05:00+00');

-- ============================================================================
-- pm_charters — project charters (company_id is varchar; anchored to :company)
-- ============================================================================
DELETE FROM pm_charters WHERE company_id = :company;
INSERT INTO pm_charters (company_id, project_code, project_name, charter_number, version, project_manager, sponsor, client, department, category, status, priority, objectives, scope, deliverables, stakeholders, budget, start_date, end_date, duration, risks, assumptions, constraints, success_criteria, approvals, created_by, created_date, last_modified, approved_date, created_at, updated_at)
VALUES
  (:company, 'PRJ-2026-0001', 'Industrial Kitchen 2026', 'DEMO-CH-2026-001', '2.0', 'Rajesh Kumar', 'Priya Sharma', 'Grand Hyatt Dubai', 'Projects', 'construction', 'approved', 'high',
   '["Deliver full commercial kitchen fitout for main banquet kitchen","Achieve DM food-safety compliance at first inspection"]'::jsonb,
   '{"inScope":["Hot line","Cold room","Exhaust system","Prep areas"],"outOfScope":["Civil works","Gas utility connection"]}'::jsonb,
   '["Approved shop drawings","Fabricated SS counters and hoods","Installed and commissioned kitchen","Handover dossier"]'::jsonb,
   '[{"name":"Andreas Weber","role":"Client - Director of Engineering"},{"name":"Rajesh Kumar","role":"Project Manager"},{"name":"Suresh Patel","role":"Site Lead"}]'::jsonb,
   1850000.00, '2026-01-15', '2026-10-30', '9.5 months',
   '["Long-lead imported equipment delays","Hotel operations restricting site access hours"]'::jsonb,
   '["Site power and water available from 2026-04-01"]'::jsonb,
   '["Night-shift noise restrictions in operating hotel"]'::jsonb,
   '["Zero lost-time incidents","Phase-1 handover by end Aug 2026","Snag list under 15 items at final inspection"]'::jsonb,
   '[{"approver":"Priya Sharma","role":"Sponsor","date":"2026-01-20","status":"approved"}]'::jsonb,
   'Rajesh Kumar', '2026-01-10', '2026-03-06', '2026-01-20', '2026-01-10 09:00:00', '2026-03-06 15:00:00'),
  (:company, 'PRJ-2026-0005', 'Solar Panel Array Installation', 'DEMO-CH-2026-002', '1.0', 'Vikram Singh', 'Priya Sharma', 'GreenEnergy Co', 'Projects', 'installation', 'approved', 'medium',
   '["Install 1.2MW rooftop array mounting and cabling scope","Complete before Q4 grid-connection window"]'::jsonb,
   '{"inScope":["Mounting structures","Panel fixing","DC cabling"],"outOfScope":["Inverter supply","Grid liaison"]}'::jsonb,
   '["Zone A and B mounted arrays","Cable routing to inverter room","As-built drawings"]'::jsonb,
   '[{"name":"Vikram Singh","role":"Project Manager"},{"name":"Ravi Menon","role":"Installation Lead"}]'::jsonb,
   640000.00, '2026-06-15', '2026-11-15', '5 months',
   '["Summer heat limiting rooftop working hours","Main-contractor delays on inverter room"]'::jsonb,
   '["Roof structural certification supplied by client"]'::jsonb,
   '["Crane access limited to weekends"]'::jsonb,
   '["All rail torque checks passed","Zero panel breakage during install"]'::jsonb,
   '[{"approver":"Priya Sharma","role":"Sponsor","date":"2026-06-01","status":"approved"}]'::jsonb,
   'Vikram Singh', '2026-05-25', '2026-06-15', '2026-06-01', '2026-05-25 10:00:00', '2026-06-15 09:00:00'),
  (:company, 'PRJ-2026-0006', 'Automation Line Upgrade', 'DEMO-CH-2026-003', '1.0', 'Anita Desai', 'Priya Sharma', 'AutoParts Ltd', 'Projects', 'upgrade', 'draft', 'medium',
   '["Upgrade conveyor and robot-cell layout for 20% throughput gain"]'::jsonb,
   '{"inScope":["Line re-layout","New drive units","Commissioning"],"outOfScope":["PLC software rewrite"]}'::jsonb,
   '["Feasibility study","Re-layout drawings","Installed upgraded line"]'::jsonb,
   '[{"name":"Anita Desai","role":"Project Manager"}]'::jsonb,
   420000.00, '2026-10-01', '2027-02-28', '5 months',
   '["Production downtime window not yet confirmed by client"]'::jsonb,
   '["Existing line drawings are accurate"]'::jsonb,
   '["Shutdown window limited to 3 weeks"]'::jsonb,
   '["Throughput +20% verified over 2-week run"]'::jsonb,
   NULL,
   'Anita Desai', '2026-08-20', '2026-09-02', NULL, '2026-08-20 11:00:00', '2026-09-02 14:30:00');

-- ============================================================================
-- pm_bom_items — flattened planning BOM view (varchar refs)
-- ============================================================================
DELETE FROM pm_bom_items WHERE company_id = :company;
INSERT INTO pm_bom_items (company_id, project_id, parent_id, item_id, name, sku, quantity, uom, level, status, created_at, updated_at)
VALUES
  (:company, (:p1)::text, NULL, NULL, 'Hot Kitchen Line Assembly', 'DEMO-ASM-HKL', 1.00, 'SET', 0, 'In Production', '2026-03-06 15:00:00', '2026-05-02 10:00:00'),
  (:company, (:p1)::text, NULL, (SELECT id::text FROM items WHERE "itemCode" = 'RM-STL-001'), 'Steel Sheet 2mm (SS-304)', 'RM-STL-001', 240.00, 'SQM', 1, 'In Stock',   '2026-03-06 15:01:00', '2026-04-02 15:00:00'),
  (:company, (:p1)::text, NULL, (SELECT id::text FROM items WHERE "itemCode" = 'FG-MTR-001'), 'Industrial Motor 5HP (hood blowers)', 'FG-MTR-001', 6.00, 'NOS', 1, 'In Stock', '2026-03-06 15:02:00', '2026-04-05 11:30:00'),
  (:company, (:p1)::text, NULL, (SELECT id::text FROM items WHERE "itemCode" = 'RM-COP-001'), 'Copper Wire 2.5mm', 'RM-COP-001', 850.00, 'MTR', 1, 'In Stock', '2026-03-06 15:03:00', '2026-04-08 10:00:00'),
  (:company, (:p1)::text, NULL, NULL, 'Cold Room & Prep Assembly', 'DEMO-ASM-CRP', 1.00, 'SET', 0, 'Awaiting Material', '2026-03-12 16:05:00', '2026-09-01 09:00:00'),
  (:company, (:p1)::text, NULL, (SELECT id::text FROM items WHERE "itemCode" = 'FG-PMP-001'), 'Centrifugal Pump CP-200 (condensate)', 'FG-PMP-001', 2.00, 'NOS', 1, 'On Order', '2026-03-12 16:06:00', '2026-03-14 14:00:00'),
  (:company, (:p2)::text, NULL, (SELECT id::text FROM items WHERE "itemCode" = 'RM-ALM-001'), 'Aluminum Rod 20mm (mounting rails)', 'RM-ALM-001', 480.00, 'MTR', 0, 'Partially Received', '2026-05-18 12:05:00', '2026-06-10 09:45:00'),
  (:company, (:p2)::text, NULL, (SELECT id::text FROM items WHERE "itemCode" = 'SP-BLT-001'), 'V-Belt A68 (tracker units)', 'SP-BLT-001', 36.00, 'NOS', 0, 'In Stock', '2026-05-18 12:06:00', '2026-06-12 10:00:00');

-- ============================================================================
-- pm_boq_line_templates — reusable BOQ line library
-- ============================================================================
DELETE FROM pm_boq_line_templates WHERE company_id = :company;
INSERT INTO pm_boq_line_templates (company_id, item, description, unit, quantity, rate, amount, is_valid, created_at, updated_at)
VALUES
  (:company, 'SS Counter - Standard',    'SS-304 fabricated counter with under-shelf, per linear metre', 'MTR', 1.00, 1450.00, 1450.00, true,  '2025-11-05 10:00:00', '2025-11-05 10:00:00'),
  (:company, 'Exhaust Hood - Wall Type', 'SS wall-mounted exhaust hood with baffle filters and lights',  'NOS', 1.00, 8200.00, 8200.00, true,  '2025-11-05 10:05:00', '2025-11-05 10:05:00'),
  (:company, 'Cold Room Panel 100mm',    'PUF insulated panel 100mm, installed, per square metre',       'SQM', 1.00,  310.00,  310.00, true,  '2025-11-05 10:10:00', '2025-11-05 10:10:00'),
  (:company, 'Installation Labour Day',  'Skilled installation crew, per man-day inclusive of tools',    'DAY', 1.00,  480.00,  480.00, true,  '2025-11-05 10:15:00', '2025-11-05 10:15:00'),
  (:company, 'Site Supervision Week',    'Dedicated site supervisor, per week',                          'WK',  1.00, 3400.00, 3400.00, true,  '2025-12-01 09:00:00', '2025-12-01 09:00:00'),
  (:company, 'Hood Fire Suppression',    'Wet-chemical suppression system per hood (superseded rate)',   'NOS', 1.00, 5100.00, 5100.00, false, '2025-10-10 09:00:00', '2026-02-15 12:00:00');

-- ============================================================================
-- pm_change_orders
-- ============================================================================
DELETE FROM pm_change_orders WHERE company_id = :company;
INSERT INTO pm_change_orders (company_id, change_order_number, project_id, project_name, request_date, requested_by, requested_by_role, change_type, priority, title, description, reason, impact_on_cost, impact_on_schedule, original_budget, revised_budget, original_end_date, revised_end_date, status, approved_by, approval_date, implementation_date, completion_date, attachments, remarks, created_at, updated_at)
VALUES
  (:company, 'DEMO-CO-2026-001', (:p1)::text, 'Industrial Kitchen 2026', '2026-04-10', 'Andreas Weber', 'Client - Director of Engineering', 'Scope Addition', 'High',   'Add pastry section counters', 'Client requests 6 LM of additional refrigerated pastry counters in prep area.', 'Banquet menu expanded to include in-house patisserie.', 68000.00, 10, 1850000.00, 1918000.00, '2026-10-30', '2026-11-10', 'Approved', 'Priya Sharma', '2026-04-18', '2026-05-05', NULL, 2, 'Long-lead refrigerated cases ordered 2026-04-22.', '2026-04-10 11:00:00', '2026-05-05 09:00:00'),
  (:company, 'DEMO-CO-2026-002', (:p1)::text, 'Industrial Kitchen 2026', '2026-06-08', 'Rajesh Kumar',  'Project Manager', 'Design Change',  'Medium', 'Re-route hood ductwork over Wall B', 'Structural beam clash found during hood trial fit; duct path revised.', 'As-built structure differs from tender drawings.', 12500.00, 5, 1918000.00, 1930500.00, '2026-11-10', '2026-11-15', 'Approved', 'Priya Sharma', '2026-06-12', '2026-06-15', '2026-06-18', 3, NULL, '2026-06-08 09:30:00', '2026-06-18 16:00:00'),
  (:company, 'DEMO-CO-2026-003', (:p1)::text, 'Industrial Kitchen 2026', '2026-08-30', 'Andreas Weber', 'Client - Director of Engineering', 'Scope Addition', 'Low', 'Upgrade cold-room door to sliding type', 'Replace hinged cold-room door with heavy-duty sliding door.', 'Trolley traffic flow improvement requested by chef team.', 9800.00, 3, 1930500.00, 1940300.00, '2026-11-15', '2026-11-18', 'Pending', NULL, NULL, NULL, NULL, 1, 'Awaiting client PO amendment.', '2026-08-30 10:15:00', '2026-08-30 10:15:00'),
  (:company, 'DEMO-CO-2026-004', (:p2)::text, 'Solar Panel Array Installation', '2026-08-12', 'Ravi Menon', 'Installation Lead', 'Schedule Change', 'High', 'Re-sequence Zone B ahead of cable trays', 'Swap task order: complete Zone B rails before tray routing due to inverter-room delay.', 'Main contractor has not released inverter room.', 0.00, 14, 640000.00, 640000.00, '2026-11-15', '2026-11-29', 'Approved', 'Vikram Singh', '2026-08-14', '2026-08-15', NULL, 0, 'No cost impact; schedule risk logged.', '2026-08-12 14:00:00', '2026-08-15 09:00:00'),
  (:company, 'DEMO-CO-2026-005', (:p2)::text, 'Solar Panel Array Installation', '2026-09-02', 'GreenEnergy Co', 'Client', 'Scope Reduction', 'Medium', 'Remove optional walkway grating', 'Client removes maintenance walkway grating from scope.', 'Client will procure walkways under separate O&M contract.', -18500.00, -2, 640000.00, 621500.00, '2026-11-29', '2026-11-27', 'Under Review', NULL, NULL, NULL, NULL, 1, NULL, '2026-09-02 11:30:00', '2026-09-06 09:00:00');

-- ============================================================================
-- pm_commissioning_activities
-- ============================================================================
DELETE FROM pm_commissioning_activities WHERE company_id = :company;
INSERT INTO pm_commissioning_activities (company_id, activity_number, project_id, project_name, equipment_system, system_code, commissioning_type, scheduled_date, actual_date, duration, status, progress, engineer, client_rep, test_parameters, checklist_items, total_checks, passed_checks, failed_checks, observations, recommendations, certificate_issued, certificate_number, next_activity, dependencies, attachments, created_at, updated_at)
VALUES
  (:company, 'DEMO-COM-2026-001', (:p1)::text, 'Industrial Kitchen 2026', 'Exhaust Hood System',     'HK-EXH-01', 'Pre-Commissioning', '2026-08-05', '2026-08-05', 1, 'Completed',   100, 'Amit Verma',   'Andreas Weber', '{"airflow_m3h": {"target": 21600, "measured": 21150}}'::jsonb, '["Blower rotation check","Filter fitment","Damper operation"]'::jsonb, 12, 12, 0, 'All blowers within vibration limits.', NULL, false, NULL, 'DEMO-COM-2026-002', NULL, 1, '2026-08-01 09:00:00', '2026-08-05 17:00:00'),
  (:company, 'DEMO-COM-2026-002', (:p1)::text, 'Industrial Kitchen 2026', 'Exhaust Hood System',     'HK-EXH-01', 'Commissioning',     '2026-08-12', '2026-08-13', 2, 'Completed',   100, 'Amit Verma',   'Andreas Weber', '{"airflow_m3h": {"target": 21600, "measured": 21480}, "noise_dba": {"limit": 65, "measured": 61}}'::jsonb, '["Full-load airflow test","Noise level test","Interlock with make-up air"]'::jsonb, 18, 17, 1, 'One damper actuator sluggish; replaced on 2026-08-13 and retested OK.', 'Include damper actuators in AMC lubrication schedule.', true, 'DEMO-CERT-EXH-001', 'DEMO-COM-2026-003', '["DEMO-COM-2026-001"]'::jsonb, 2, '2026-08-08 09:00:00', '2026-08-13 18:00:00'),
  (:company, 'DEMO-COM-2026-003', (:p1)::text, 'Industrial Kitchen 2026', 'Hot Line Equipment Power', 'HK-PWR-01', 'Commissioning',     '2026-08-20', '2026-08-24', 3, 'Completed',   100, 'Amit Verma',   'Andreas Weber', '{"insulation_mohm": {"min": 1, "measured": 46}}'::jsonb, '["Insulation resistance","Earth continuity","Load trial per circuit"]'::jsonb, 22, 22, 0, 'All circuits passed load trial.', NULL, true, 'DEMO-CERT-PWR-001', NULL, '["DEMO-COM-2026-002"]'::jsonb, 1, '2026-08-15 09:00:00', '2026-08-24 17:30:00'),
  (:company, 'DEMO-COM-2026-004', (:p1)::text, 'Industrial Kitchen 2026', 'Cold Room Refrigeration', 'HK-REF-01', 'Pre-Commissioning', '2026-09-20', NULL, 2, 'Scheduled',   0, 'Sanjay Malhotra', 'Andreas Weber', '{"pulldown_target_c": -18}'::jsonb, '["Refrigerant charge check","Door heater test","Pull-down trial"]'::jsonb, 14, 0, 0, NULL, NULL, false, NULL, NULL, NULL, 0, '2026-09-05 10:00:00', '2026-09-05 10:00:00'),
  (:company, 'DEMO-COM-2026-005', (:p2)::text, 'Solar Panel Array Installation', 'Zone A Array Strings', 'SA-STR-A', 'Testing', '2026-08-18', '2026-08-18', 1, 'In Progress', 70, 'Ramesh Yadav', 'GreenEnergy Site Engineer', '{"voc_v": {"expected": 745, "measured": 738}}'::jsonb, '["String polarity","Open-circuit voltage","Insulation to frame"]'::jsonb, 16, 11, 1, 'One string shows low Voc; connector re-crimp planned.', 'Torque-mark all MC4 connectors after rework.', false, NULL, NULL, NULL, 1, '2026-08-15 09:00:00', '2026-09-03 12:00:00'),
  (:company, 'DEMO-COM-2026-006', (:p2)::text, 'Solar Panel Array Installation', 'Zone B Array Strings', 'SA-STR-B', 'Testing', '2026-10-05', NULL, 1, 'Scheduled', 0, 'Ramesh Yadav', 'GreenEnergy Site Engineer', NULL, '["String polarity","Open-circuit voltage","Insulation to frame"]'::jsonb, 16, 0, 0, NULL, NULL, false, NULL, NULL, '["DEMO-COM-2026-005"]'::jsonb, 0, '2026-09-04 10:00:00', '2026-09-04 10:00:00');

-- ============================================================================
-- pm_crates — planning-side crate register (varchar refs)
-- ============================================================================
DELETE FROM pm_crates WHERE company_id = :company;
INSERT INTO pm_crates (company_id, project_id, number, items, design_weight, actual_weight, status, created_at, updated_at)
VALUES
  (:company, (:p1)::text, 'DEMO-CRT-0001', 2, 400.00, 412.50, 'Dispatched', '2026-05-04 09:00:00', '2026-05-12 08:30:00'),
  (:company, (:p1)::text, 'DEMO-CRT-0002', 2, 520.00, 538.00, 'Dispatched', '2026-05-04 10:00:00', '2026-05-12 08:30:00'),
  (:company, (:p1)::text, 'DEMO-CRT-0003', 2, 280.00, 264.75, 'Sealed',     '2026-05-18 11:00:00', '2026-05-27 17:00:00'),
  (:company, (:p2)::text, 'DEMO-CRT-0004', 2, 350.00, NULL,   'Open',       '2026-06-15 09:30:00', '2026-06-15 09:30:00'),
  (:company, (:p1)::text, 'DEMO-CRT-0005', 0, 150.00, NULL,   'Open',       '2026-09-02 10:00:00', '2026-09-02 10:00:00');

-- ============================================================================
-- pm_customer_acceptances
-- ============================================================================
DELETE FROM pm_customer_acceptances WHERE company_id = :company;
INSERT INTO pm_customer_acceptances (company_id, acceptance_number, project_id, project_name, project_type, customer, customer_contact, customer_email, acceptance_date, acceptance_type, phase, deliverables, acceptance_criteria, total_criteria, criteria_met, criteria_pending, documentation, total_documents, docs_submitted, docs_pending, defects_list, punch_list_items, completed_punch_items, training_completed, warranty_period, warranty_start_date, amc_offered, amc_duration, signed_by, signed_by_designation, signed_date, witnessed_by, overall_status, remarks, attachments, created_at, updated_at)
VALUES
  (:company, 'DEMO-ACC-2026-001', (:p1)::text, 'Industrial Kitchen 2026', 'Turnkey Fitout', 'Grand Hyatt Dubai', 'Andreas Weber', 'andreas.weber@hyatt.com', '2026-08-28', 'Provisional', 'Phase 1 - Hot Kitchen',
   '["Hot line counters","Exhaust hood system","Equipment power distribution"]'::jsonb,
   '["All equipment powers on","Airflow within 5% of design","Gas leak test passed","Finish quality accepted"]'::jsonb,
   4, 4, 0,
   '["Test certificates","O&M manual (hot line)","As-built drawings (phase 1)"]'::jsonb,
   3, 3, 0,
   '[{"item":"Counter edge scratch (buffed)","status":"closed"},{"item":"Damper actuator replaced","status":"closed"}]'::jsonb,
   6, 6, true, '12 months', '2026-08-28', true, '24 months', 'Andreas Weber', 'Director of Engineering', '2026-08-28', 'Rajesh Kumar', 'Accepted', 'Phase-1 provisional acceptance signed at handover ceremony.', 3, '2026-08-25 09:00:00', '2026-08-28 16:00:00'),
  (:company, 'DEMO-ACC-2026-002', (:p2)::text, 'Solar Panel Array Installation', 'Installation', 'GreenEnergy Co', 'Site Engineering Office', 'projects@greenenergy.co', NULL, 'Provisional', 'Zone A Mounting',
   '["Zone A mounting rails","Zone A panel fixing"]'::jsonb,
   '["All rail torque checks passed","Panel alignment within tolerance","No panel damage"]'::jsonb,
   3, 2, 1,
   '["Torque check records","Zone A layout as-built"]'::jsonb,
   2, 1, 1,
   '[{"item":"String A-07 low Voc — connector re-crimp","status":"open"}]'::jsonb,
   3, 2, false, '12 months', NULL, false, NULL, NULL, NULL, NULL, NULL, 'Pending', 'Awaiting string test closure before Zone A sign-off.', 1, '2026-08-20 10:00:00', '2026-09-06 11:00:00'),
  (:company, 'DEMO-ACC-2026-003', (:p1)::text, 'Industrial Kitchen 2026', 'Turnkey Fitout', 'Grand Hyatt Dubai', 'Andreas Weber', 'andreas.weber@hyatt.com', NULL, 'Final', 'Phase 2 - Cold Room & Prep',
   '["Cold room","Prep area counters","Condensate pumps"]'::jsonb,
   '["Pull-down to -18C in 6h","Door heater operational","Drainage flow test passed"]'::jsonb,
   3, 0, 3,
   '["Refrigeration test certificates","O&M manual (cold room)"]'::jsonb,
   2, 0, 2,
   NULL, 0, 0, false, '12 months', NULL, true, '24 months', NULL, NULL, NULL, NULL, 'Pending', 'Scheduled after cold-room commissioning (Sep-Oct 2026).', 0, '2026-09-05 10:30:00', '2026-09-05 10:30:00');

-- ============================================================================
-- pm_deliverables
-- ============================================================================
DELETE FROM pm_deliverables WHERE company_id = :company;
INSERT INTO pm_deliverables (company_id, deliverable_number, deliverable_name, project_number, project_name, type, description, assigned_to, planned_date, actual_date, status, progress, dependencies, quantity, unit, notes, created_at, updated_at)
VALUES
  (:company, 'DEMO-DLV-2026-001', 'Approved Shop Drawings — Hot Kitchen',  'PRJ-2026-0001', 'Industrial Kitchen 2026', 'Drawing',    'Full shop-drawing set for hot line, hoods and services coordination.', 'Anita Desai',   '2026-02-28', '2026-03-04', 'Completed',   100, NULL, 1, 'SET', 'Rev C approved by client consultant.', '2026-01-20 09:00:00', '2026-03-04 15:00:00'),
  (:company, 'DEMO-DLV-2026-002', 'Fabricated SS Counters & Hoods',        'PRJ-2026-0001', 'Industrial Kitchen 2026', 'Fabrication','Workshop fabrication of all phase-1 stainless items.', 'Suresh Patel', '2026-04-30', '2026-05-02', 'Completed',   100, '["DEMO-DLV-2026-001"]'::jsonb, 42, 'NOS', NULL, '2026-03-10 09:00:00', '2026-05-02 17:00:00'),
  (:company, 'DEMO-DLV-2026-003', 'Phase-1 Installation & Commissioning',  'PRJ-2026-0001', 'Industrial Kitchen 2026', 'Installation','Site installation and commissioning of hot kitchen.', 'Rajesh Kumar', '2026-08-25', '2026-08-28', 'Completed',   100, '["DEMO-DLV-2026-002"]'::jsonb, 1, 'LOT', 'Provisional acceptance DEMO-ACC-2026-001 signed.', '2026-05-10 09:00:00', '2026-08-28 16:00:00'),
  (:company, 'DEMO-DLV-2026-004', 'Cold Room Installation',                'PRJ-2026-0001', 'Industrial Kitchen 2026', 'Installation','Cold-room panel erection, refrigeration and drainage.', 'Sanjay Malhotra', '2026-10-15', NULL, 'In Progress', 82, '["DEMO-DLV-2026-002"]'::jsonb, 1, 'LOT', NULL, '2026-06-19 09:00:00', '2026-09-01 17:00:00'),
  (:company, 'DEMO-DLV-2026-005', 'Handover Dossier — Phase 2',            'PRJ-2026-0001', 'Industrial Kitchen 2026', 'Documentation','O&M manuals, warranties and as-builts for phase 2.', 'Anita Desai', '2026-11-05', NULL, 'Not Started', 0, '["DEMO-DLV-2026-004"]'::jsonb, 1, 'SET', NULL, '2026-09-05 10:00:00', '2026-09-05 10:00:00'),
  (:company, 'DEMO-DLV-2026-006', 'Zone A Mounted Array',                  'PRJ-2026-0005', 'Solar Panel Array Installation', 'Installation','Zone A rails, panels and string terminations.', 'Ravi Menon', '2026-07-25', '2026-07-22', 'Completed', 100, NULL, 1, 'ZONE', 'Torque records filed.', '2026-06-28 09:00:00', '2026-07-22 16:00:00'),
  (:company, 'DEMO-DLV-2026-007', 'Zone B Mounted Array',                  'PRJ-2026-0005', 'Solar Panel Array Installation', 'Installation','Zone B rails, panels and string terminations.', 'Ravi Menon', '2026-10-10', NULL, 'In Progress', 60, '["DEMO-DLV-2026-006"]'::jsonb, 1, 'ZONE', 'Re-sequenced per DEMO-CO-2026-004.', '2026-07-23 09:00:00', '2026-09-04 16:00:00');

-- ============================================================================
-- pm_design_assets — design/drawing file register (varchar refs)
-- ============================================================================
DELETE FROM pm_design_assets WHERE company_id = :company;
INSERT INTO pm_design_assets (company_id, project_id, file_name, category, version, upload_date, status, thumbnail_url, file_url, comments, is_latest, created_at, updated_at)
VALUES
  (:company, (:p1)::text, 'DEMO-HK-layout-ga-r2.dwg',        'drawing',   2, '2026-02-18', 'approved', 'demo/design/hk-ga-thumb.png', 'demo/design/hk-layout-ga-r2.dwg', 'GA layout rev 2 — pastry section added per DEMO-CO-2026-001 markup.', true,  '2026-02-18 10:00:00', '2026-04-20 11:00:00'),
  (:company, (:p1)::text, 'DEMO-HK-layout-ga-r1.dwg',        'drawing',   1, '2026-01-28', 'superseded', NULL, 'demo/design/hk-layout-ga-r1.dwg', NULL, false, '2026-01-28 09:30:00', '2026-02-18 10:00:00'),
  (:company, (:p1)::text, 'DEMO-HK-hood-sections-r1.pdf',    'drawing',   1, '2026-03-02', 'approved', NULL, 'demo/design/hk-hood-sections-r1.pdf', 'Duct re-route per DEMO-CO-2026-002 shown as cloud A.', true, '2026-03-02 14:00:00', '2026-06-15 10:00:00'),
  (:company, (:p1)::text, 'DEMO-HK-3d-render-banquet.jpg',   'render',    1, '2026-02-05', 'approved', 'demo/design/hk-render-thumb.jpg', 'demo/design/hk-3d-render-banquet.jpg', 'Client presentation render.', true, '2026-02-05 16:00:00', '2026-02-12 09:00:00'),
  (:company, (:p2)::text, 'DEMO-SA-roof-layout-r1.dwg',      'drawing',   1, '2026-05-30', 'approved', NULL, 'demo/design/sa-roof-layout-r1.dwg', NULL, true, '2026-05-30 11:00:00', '2026-06-10 09:00:00'),
  (:company, (:p3)::text, 'DEMO-AL-concept-layout-r0.pdf',   'concept',   1, '2026-08-28', 'pending',  NULL, 'demo/design/al-concept-layout-r0.pdf', 'Concept for client review — throughput study attached.', true, '2026-08-28 15:00:00', '2026-08-28 15:00:00');
