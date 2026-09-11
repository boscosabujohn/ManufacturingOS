-- Demo seed — Django/OptiForge CMMS + PLM + S&OP + Field Service for B3 MACBIS.
-- Tables (19): cmms_asset, cmms_maintenanceworkorder, cmms_permittowork,
--   cmms_preventivemaintenance, cmms_reliabilitymetric, plm_part,
--   plm_partrevision, plm_changerequest, plm_changeorder, plm_changenotice,
--   sop_demandforecast, sop_consensusround, sop_masterproductionschedule,
--   sop_roughcutcapacityplan, sop_atpquote, field_service_installedbaseunit,
--   field_service_servicecontract, field_service_servicedispatch,
--   field_service_rma
-- Story alignment:
--   * CMMS assets mirror NestJS fixed_assets FA-DEMO-001..009 (laser, press
--     brake, welding robots, powder-coat line, compressor, DG set, forklift).
--   * PLM parts mirror NestJS `items` codes (FG-MTR-001 Industrial Motor 5HP,
--     FG-PMP-001 Centrifugal Pump CP-200, FG-GBX-001 Precision Gearbox PG-50,
--     SP-*/RM-* spares and raw materials).
--   * Field service mirrors the after-sales story: combi ovens / blast
--     chillers / dishwashers installed at Harbour Grill, Blue Fig Hotels and
--     Metro Hospital sites; customer_account_id resolves to crm_customers ids
--     when present (bare UUID column, no FK) with a stable literal fallback.
--   * approved_by_user_id / technician_user_id / customer_requirement_id are
--     bare UUID columns (no FK; Django auth_user PKs are integers), so they
--     carry stable synthetic UUIDs.
-- Choices verified against backend/optiforge/core/{cmms,plm,sop,field_service}/models.py.
-- Idempotent: DELETE by tenant_id (children before parents), then re-insert.
-- Delete predicates: every table below is tenant-scoped -> tenant_id = :tenant.
-- Django FKs are DEFERRABLE INITIALLY DEFERRED; force immediate checking so a
-- BEGIN/ROLLBACK validation run still exercises every FK (no-op outside a txn).

\set tenant '''b3000000-0000-4000-8000-000000000001'''

SET CONSTRAINTS ALL IMMEDIATE;

-- ---------------------------------------------------------------------------
-- Deletes — children first
-- ---------------------------------------------------------------------------
DELETE FROM cmms_maintenanceworkorder        WHERE tenant_id = :tenant;
DELETE FROM cmms_permittowork                WHERE tenant_id = :tenant;
DELETE FROM cmms_preventivemaintenance       WHERE tenant_id = :tenant;
DELETE FROM cmms_reliabilitymetric           WHERE tenant_id = :tenant;
DELETE FROM cmms_asset                       WHERE tenant_id = :tenant;

DELETE FROM plm_changenotice                 WHERE tenant_id = :tenant;
DELETE FROM plm_changeorder                  WHERE tenant_id = :tenant;
DELETE FROM plm_changerequest                WHERE tenant_id = :tenant;
DELETE FROM plm_partrevision                 WHERE tenant_id = :tenant;
DELETE FROM plm_part                         WHERE tenant_id = :tenant;

DELETE FROM sop_atpquote                     WHERE tenant_id = :tenant;
DELETE FROM sop_roughcutcapacityplan         WHERE tenant_id = :tenant;
DELETE FROM sop_masterproductionschedule     WHERE tenant_id = :tenant;
DELETE FROM sop_consensusround               WHERE tenant_id = :tenant;
DELETE FROM sop_demandforecast               WHERE tenant_id = :tenant;

DELETE FROM field_service_servicedispatch    WHERE tenant_id = :tenant;
DELETE FROM field_service_rma                WHERE tenant_id = :tenant;
DELETE FROM field_service_installedbaseunit  WHERE tenant_id = :tenant;
DELETE FROM field_service_servicecontract    WHERE tenant_id = :tenant;

-- ===========================================================================
-- CMMS
-- ===========================================================================

-- cmms_asset — 8 plant assets, mirrored from fixed_assets FA-DEMO rows.
-- status choices: in_service | out_of_service | retired
INSERT INTO cmms_asset
  (id, code, name, location_code, status, commissioned_on, extensible_attributes, tenant_id)
VALUES
  ('b3ca0000-0000-4000-8000-000000000001', 'AST-001', 'CNC Laser Cutting Machine',
   'PLANT1-FAB', 'in_service', '2022-06-01',
   '{"manufacturer": "TRUMPF", "model": "TruLaser 3030", "serial": "TL3030-22-8841", "fixed_asset": "FA-DEMO-001"}'::jsonb, :tenant),
  ('b3ca0000-0000-4000-8000-000000000002', 'AST-002', 'CNC Press Brake',
   'PLANT1-FAB', 'in_service', '2022-06-01',
   '{"manufacturer": "AMADA", "model": "HFE 130-3", "serial": "HFE130-22-3327", "fixed_asset": "FA-DEMO-002"}'::jsonb, :tenant),
  ('b3ca0000-0000-4000-8000-000000000003', 'AST-003', 'Welding Robot Cell A',
   'PLANT1-WELD', 'out_of_service', '2023-09-01',
   '{"manufacturer": "FANUC", "model": "ARC Mate 100iD", "serial": "AM100-23-5512", "fixed_asset": "FA-DEMO-003", "note": "Torch liner replacement in progress"}'::jsonb, :tenant),
  ('b3ca0000-0000-4000-8000-000000000004', 'AST-004', 'Welding Robot Cell B',
   'PLANT1-WELD', 'in_service', '2024-03-01',
   '{"manufacturer": "FANUC", "model": "ARC Mate 100iD", "serial": "AM100-24-1078", "fixed_asset": "FA-DEMO-004"}'::jsonb, :tenant),
  ('b3ca0000-0000-4000-8000-000000000005', 'AST-005', 'Powder Coating Line',
   'PLANT1-FIN', 'in_service', '2023-02-01',
   '{"manufacturer": "Statfield", "model": "EcoCoat 3000", "serial": "EC3000-23-0455", "fixed_asset": "FA-DEMO-005"}'::jsonb, :tenant),
  ('b3ca0000-0000-4000-8000-000000000006', 'AST-006', 'Screw Air Compressor 30kW',
   'PLANT1-UTIL', 'in_service', '2021-06-15',
   '{"manufacturer": "Atlas Copco", "model": "GA 30", "serial": "GA30-21-4102"}'::jsonb, :tenant),
  ('b3ca0000-0000-4000-8000-000000000007', 'AST-007', 'Diesel Generator 250 kVA',
   'PLANT1-UTIL', 'in_service', '2021-04-01',
   '{"manufacturer": "Kirloskar", "model": "KG1-250WS", "serial": "KG250-21-0777", "fixed_asset": "FA-DEMO-009"}'::jsonb, :tenant),
  ('b3ca0000-0000-4000-8000-000000000008', 'AST-008', 'Forklift #1 (2.5T)',
   'PLANT1-STORES', 'in_service', '2022-12-01',
   '{"manufacturer": "Toyota", "model": "8FD25", "serial": "8FD25-22-6690", "fixed_asset": "FA-DEMO-006"}'::jsonb, :tenant);

-- cmms_maintenanceworkorder — 8 WOs, preventive/corrective/predictive mix.
-- wo_type: pm | cm | pdm; status: open | in_progress | completed | cancelled
INSERT INTO cmms_maintenanceworkorder
  (id, number, wo_type, status, ptw_reference, started_at, completed_at,
   downtime_minutes, asset_id, tenant_id)
VALUES
  ('b3cb0000-0000-4000-8000-000000000001', 'MWO-2025-0001', 'pm', 'completed', '',
   '2025-10-14 06:00:00+00', '2025-10-14 10:30:00+00', 120,
   'b3ca0000-0000-4000-8000-000000000001', :tenant),
  ('b3cb0000-0000-4000-8000-000000000002', 'MWO-2025-0002', 'cm', 'completed', '',
   '2025-11-21 09:15:00+00', '2025-11-21 15:45:00+00', 240,
   'b3ca0000-0000-4000-8000-000000000006', :tenant),
  ('b3cb0000-0000-4000-8000-000000000003', 'MWO-2026-0003', 'pm', 'completed', 'PTW-2026-0001',
   '2026-01-19 06:30:00+00', '2026-01-19 13:00:00+00', 180,
   'b3ca0000-0000-4000-8000-000000000005', :tenant),
  ('b3cb0000-0000-4000-8000-000000000004', 'MWO-2026-0004', 'cm', 'completed', '',
   '2026-03-09 11:20:00+00', '2026-03-10 08:00:00+00', 420,
   'b3ca0000-0000-4000-8000-000000000002', :tenant),
  ('b3cb0000-0000-4000-8000-000000000005', 'MWO-2026-0005', 'pdm', 'completed', '',
   '2026-05-22 07:00:00+00', '2026-05-22 11:00:00+00', 90,
   'b3ca0000-0000-4000-8000-000000000004', :tenant),
  ('b3cb0000-0000-4000-8000-000000000006', 'MWO-2026-0006', 'pm', 'completed', 'PTW-2026-0003',
   '2026-07-11 05:30:00+00', '2026-07-11 09:00:00+00', 60,
   'b3ca0000-0000-4000-8000-000000000007', :tenant),
  ('b3cb0000-0000-4000-8000-000000000007', 'MWO-2026-0007', 'cm', 'in_progress', 'PTW-2026-0004',
   '2026-09-02 08:00:00+00', NULL, 0,
   'b3ca0000-0000-4000-8000-000000000003', :tenant),
  ('b3cb0000-0000-4000-8000-000000000008', 'MWO-2026-0008', 'pm', 'open', '',
   NULL, NULL, 0,
   'b3ca0000-0000-4000-8000-000000000008', :tenant);

-- cmms_permittowork — 4 PTWs (hot work / electrical).
-- status: requested | approved | active | closed | rejected
-- approved_by_user_id: synthetic UUID for demo admin (auth_user PKs are ints).
INSERT INTO cmms_permittowork
  (id, number, hazards, controls, status, approved_by_user_id, approved_at,
   valid_from, valid_until, asset_id, tenant_id)
VALUES
  ('b3cc0000-0000-4000-8000-000000000001', 'PTW-2026-0001',
   '["hot work", "flammable powder residue", "confined curing oven"]'::jsonb,
   '["fire watch posted", "LEL gas test before entry", "extinguishers staged", "line purged"]'::jsonb,
   'closed', 'b3a00000-0000-4000-8000-000000009001', '2026-01-18 15:00:00+00',
   '2026-01-19 06:00:00+00', '2026-01-19 18:00:00+00',
   'b3ca0000-0000-4000-8000-000000000005', :tenant),
  ('b3cc0000-0000-4000-8000-000000000002', 'PTW-2026-0002',
   '["hot work", "laser radiation class 4"]'::jsonb,
   '["beam shutter locked", "welding screens", "fire watch posted", "hot-work permit board updated"]'::jsonb,
   'closed', 'b3a00000-0000-4000-8000-000000009001', '2026-04-06 10:00:00+00',
   '2026-04-07 06:00:00+00', '2026-04-07 14:00:00+00',
   'b3ca0000-0000-4000-8000-000000000001', :tenant),
  ('b3cc0000-0000-4000-8000-000000000003', 'PTW-2026-0003',
   '["electrical 415V", "stored energy in AMF panel", "diesel fuel"]'::jsonb,
   '["LOTO applied", "insulated tools", "voltage-absence test", "spill kit on hand"]'::jsonb,
   'closed', 'b3a00000-0000-4000-8000-000000009002', '2026-07-10 14:30:00+00',
   '2026-07-11 05:00:00+00', '2026-07-11 12:00:00+00',
   'b3ca0000-0000-4000-8000-000000000007', :tenant),
  ('b3cc0000-0000-4000-8000-000000000004', 'PTW-2026-0004',
   '["electrical 415V", "robot unexpected motion", "pinch points"]'::jsonb,
   '["LOTO applied", "teach-pendant deadman verified", "cell interlock tested", "second person outside cell"]'::jsonb,
   'active', 'b3a00000-0000-4000-8000-000000009002', '2026-09-01 16:00:00+00',
   '2026-09-02 07:00:00+00', '2026-09-12 18:00:00+00',
   'b3ca0000-0000-4000-8000-000000000003', :tenant);

-- cmms_preventivemaintenance — 6 PM plans.
-- frequency: daily | weekly | monthly | quarterly | yearly | running_hours
INSERT INTO cmms_preventivemaintenance
  (id, name, frequency, interval_value, instructions, last_executed, asset_id, tenant_id)
VALUES
  ('b3cd0000-0000-4000-8000-000000000001', 'Laser optics clean + rail lubrication',
   'monthly', 1,
   'Clean protective lens and mirrors, lubricate X/Y guide rails, verify assist-gas pressure and nozzle condition.',
   '2026-08-14 06:00:00+00', 'b3ca0000-0000-4000-8000-000000000001', :tenant),
  ('b3cd0000-0000-4000-8000-000000000002', 'Press brake hydraulic system check',
   'quarterly', 1,
   'Check hydraulic oil level and contamination, inspect hoses and fittings, verify back-gauge calibration.',
   '2026-06-20 07:00:00+00', 'b3ca0000-0000-4000-8000-000000000002', :tenant),
  ('b3cd0000-0000-4000-8000-000000000003', 'Robot torch tip and liner inspection',
   'weekly', 1,
   'Inspect contact tip, nozzle and liner wear; clean spatter; verify TCP with calibration jig.',
   '2026-08-31 06:30:00+00', 'b3ca0000-0000-4000-8000-000000000004', :tenant),
  ('b3cd0000-0000-4000-8000-000000000004', 'Pretreatment bath titration + filter change',
   'monthly', 1,
   'Titrate 7-tank chemistry, top up degreaser and phosphate, replace booth cartridge filters, check oven burner.',
   '2026-08-18 06:00:00+00', 'b3ca0000-0000-4000-8000-000000000005', :tenant),
  ('b3cd0000-0000-4000-8000-000000000005', 'Compressor 2000-hour service',
   'running_hours', 2000,
   'Replace air/oil separator and oil filter, sample oil, check drive coupling and unloader valve operation.',
   '2026-05-06 08:00:00+00', 'b3ca0000-0000-4000-8000-000000000006', :tenant),
  ('b3cd0000-0000-4000-8000-000000000006', 'DG set monthly load test',
   'monthly', 1,
   'Run on 60% load for 30 minutes, log voltage/frequency, check coolant, battery electrolyte and fuel filters.',
   '2026-08-25 05:30:00+00', 'b3ca0000-0000-4000-8000-000000000007', :tenant);

-- cmms_reliabilitymetric — 6 monthly snapshots (period 2026-08-01), MTBF/MTTR/OEE.
INSERT INTO cmms_reliabilitymetric
  (id, period_start, mtbf_hours, mttr_hours, oee_percentage, availability,
   performance, quality, asset_id, tenant_id)
VALUES
  ('b3ce0000-0000-4000-8000-000000000001', '2026-08-01', 612.50, 2.10, 86.40, 95.20, 92.50, 98.10,
   'b3ca0000-0000-4000-8000-000000000001', :tenant),
  ('b3ce0000-0000-4000-8000-000000000002', '2026-08-01', 540.00, 3.40, 82.70, 93.10, 91.20, 97.40,
   'b3ca0000-0000-4000-8000-000000000002', :tenant),
  ('b3ce0000-0000-4000-8000-000000000003', '2026-08-01', 310.25, 6.80, 71.30, 84.60, 87.90, 95.90,
   'b3ca0000-0000-4000-8000-000000000003', :tenant),
  ('b3ce0000-0000-4000-8000-000000000004', '2026-08-01', 655.00, 1.90, 88.10, 96.40, 93.00, 98.30,
   'b3ca0000-0000-4000-8000-000000000004', :tenant),
  ('b3ce0000-0000-4000-8000-000000000005', '2026-08-01', 470.75, 4.20, 79.80, 91.50, 89.60, 97.30,
   'b3ca0000-0000-4000-8000-000000000005', :tenant),
  ('b3ce0000-0000-4000-8000-000000000006', '2026-08-01', 720.00, 2.60, 90.20, 97.10, 94.30, 98.50,
   'b3ca0000-0000-4000-8000-000000000006', :tenant);

-- ===========================================================================
-- PLM
-- ===========================================================================

-- plm_part — 8 parts mirroring NestJS `items` codes/names/UoMs.
INSERT INTO plm_part
  (id, part_number, name, description, uom, is_active, extensible_attributes,
   created_at, tenant_id)
VALUES
  ('b3d10000-0000-4000-8000-000000000001', 'FG-MTR-001', 'Industrial Motor 5HP',
   'Combi-oven convection fan motor, 5HP, hygienic duty option.', 'PCS', true,
   '{"family": "motors", "mirrors": "items.FG-MTR-001"}'::jsonb,
   '2025-10-03 09:00:00+00', :tenant),
  ('b3d10000-0000-4000-8000-000000000002', 'FG-PMP-001', 'Centrifugal Pump CP-200',
   'Centrifugal pump for dishwashing and rinse lines, 0.37-1.5kW range.', 'PCS', true,
   '{"family": "pumps", "mirrors": "items.FG-PMP-001"}'::jsonb,
   '2025-10-03 09:05:00+00', :tenant),
  ('b3d10000-0000-4000-8000-000000000003', 'FG-GBX-001', 'Precision Gearbox PG-50',
   'Precision gearbox for conveyor and rack-drive applications.', 'PCS', true,
   '{"family": "gearboxes", "mirrors": "items.FG-GBX-001"}'::jsonb,
   '2025-10-03 09:10:00+00', :tenant),
  ('b3d10000-0000-4000-8000-000000000004', 'SP-SL-001', 'Mechanical Seal MS-40',
   'Mechanical shaft seal, 40mm, for CP-200 pump family.', 'PCS', true,
   '{"family": "spares", "mirrors": "items.SP-SL-001"}'::jsonb,
   '2025-10-15 10:00:00+00', :tenant),
  ('b3d10000-0000-4000-8000-000000000005', 'SP-BRG-001', 'Ball Bearing 6205',
   'Deep-groove ball bearing 6205-2RS for motor and gearbox shafts.', 'PCS', true,
   '{"family": "spares", "mirrors": "items.SP-BRG-001"}'::jsonb,
   '2025-10-15 10:05:00+00', :tenant),
  ('b3d10000-0000-4000-8000-000000000006', 'SP-BLT-001', 'V-Belt A68',
   'Classical V-belt A68 for fan and pump drives.', 'PCS', true,
   '{"family": "spares", "mirrors": "items.SP-BLT-001"}'::jsonb,
   '2025-10-15 10:10:00+00', :tenant),
  ('b3d10000-0000-4000-8000-000000000007', 'RM-STL-001', 'Steel Sheet 2mm',
   'SS304 sheet 2mm for fabricated bodies and panels.', 'KG', true,
   '{"family": "raw-material", "mirrors": "items.RM-STL-001"}'::jsonb,
   '2025-11-02 09:00:00+00', :tenant),
  ('b3d10000-0000-4000-8000-000000000008', 'RM-COP-001', 'Copper Wire 2.5mm',
   'Enamelled copper winding wire 2.5mm for motor stators.', 'MTR', true,
   '{"family": "raw-material", "mirrors": "items.RM-COP-001"}'::jsonb,
   '2025-11-02 09:05:00+00', :tenant);

-- plm_partrevision — 10 revisions (rev A for all 8 parts; rev B on FG-MTR-001
-- released via ECO-2026-0001 and rev B draft on FG-PMP-001).
-- status: draft | released | obsolete
INSERT INTO plm_partrevision
  (id, rev_code, status, released_at, drawing_document_id, part_id, tenant_id)
VALUES
  ('b3d20000-0000-4000-8000-000000000001', 'A', 'obsolete', '2025-10-10 09:00:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000001', :tenant),
  ('b3d20000-0000-4000-8000-000000000002', 'B', 'released', '2026-06-15 10:00:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000001', :tenant),
  ('b3d20000-0000-4000-8000-000000000003', 'A', 'released', '2025-10-10 09:10:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000002', :tenant),
  ('b3d20000-0000-4000-8000-000000000004', 'B', 'draft', NULL, NULL,
   'b3d10000-0000-4000-8000-000000000002', :tenant),
  ('b3d20000-0000-4000-8000-000000000005', 'A', 'released', '2025-10-10 09:20:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000003', :tenant),
  ('b3d20000-0000-4000-8000-000000000006', 'A', 'released', '2025-10-20 09:00:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000004', :tenant),
  ('b3d20000-0000-4000-8000-000000000007', 'A', 'released', '2025-10-20 09:05:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000005', :tenant),
  ('b3d20000-0000-4000-8000-000000000008', 'A', 'released', '2025-10-20 09:10:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000006', :tenant),
  ('b3d20000-0000-4000-8000-000000000009', 'A', 'released', '2025-11-05 09:00:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000007', :tenant),
  ('b3d20000-0000-4000-8000-000000000010', 'A', 'released', '2025-11-05 09:05:00+00', NULL,
   'b3d10000-0000-4000-8000-000000000008', :tenant);

-- plm_changerequest — 4 ECRs. status: open | approved | rejected | closed
INSERT INTO plm_changerequest
  (id, number, title, reason, status, created_at, tenant_id)
VALUES
  ('b3d30000-0000-4000-8000-000000000001', 'ECR-2026-0001',
   'Upgrade FG-MTR-001 insulation class B to F',
   'Field returns from Harbour Grill showed winding failures in high-ambient kitchens; class F insulation removes the failure mode.',
   'closed', '2026-04-02 09:30:00+00', :tenant),
  ('b3d30000-0000-4000-8000-000000000002', 'ECR-2026-0002',
   'Change CP-200 impeller material to SS316',
   'Chloride pitting observed on SS304 impellers in coastal installations; SS316 required for warranty cost reduction.',
   'approved', '2026-05-14 11:00:00+00', :tenant),
  ('b3d30000-0000-4000-8000-000000000003', 'ECR-2026-0003',
   'PG-50 housing casting porosity fix',
   'Foundry batch Q2-26 shows porosity at oil-seal bore; propose revised gating design and 100% pressure test.',
   'open', '2026-08-10 10:15:00+00', :tenant),
  ('b3d30000-0000-4000-8000-000000000004', 'ECR-2026-0004',
   'Qualify alternate vendor for bearing 6205',
   'Second-source request from procurement; sample lot failed noise test at 1.8x spec limit.',
   'rejected', '2026-06-25 14:00:00+00', :tenant);

-- plm_changeorder — 3 ECOs from the approved/closed ECRs.
-- status: planned | released | implemented | cancelled
INSERT INTO plm_changeorder
  (id, number, status, target_release_date, implemented_at, change_request_id, tenant_id)
VALUES
  ('b3d40000-0000-4000-8000-000000000001', 'ECO-2026-0001', 'implemented',
   '2026-06-15', '2026-06-15 10:00:00+00',
   'b3d30000-0000-4000-8000-000000000001', :tenant),
  ('b3d40000-0000-4000-8000-000000000002', 'ECO-2026-0002', 'released',
   '2026-09-30', NULL,
   'b3d30000-0000-4000-8000-000000000002', :tenant),
  ('b3d40000-0000-4000-8000-000000000003', 'ECO-2026-0003', 'planned',
   '2026-11-15', NULL,
   'b3d30000-0000-4000-8000-000000000002', :tenant);

-- plm_changenotice — 2 ECNs published from ECO-2026-0001 / ECO-2026-0002.
INSERT INTO plm_changenotice
  (id, number, issued_at, summary, change_order_id, tenant_id)
VALUES
  ('b3d50000-0000-4000-8000-000000000001', 'ECN-2026-0001', '2026-06-16 09:00:00+00',
   'FG-MTR-001 rev B released: class F insulation, new nameplate, rev A stock to be consumed by 2026-08-31. BOMs and service kits updated.',
   'b3d40000-0000-4000-8000-000000000001', :tenant),
  ('b3d50000-0000-4000-8000-000000000002', 'ECN-2026-0002', '2026-08-28 09:30:00+00',
   'Advance notice: CP-200 impeller changes to SS316 from serial CP200-2610-0001; interchangeable one-for-one with SS304, spares unaffected.',
   'b3d40000-0000-4000-8000-000000000002', :tenant);

-- ===========================================================================
-- S&OP
-- ===========================================================================

-- sop_demandforecast — 6 rows: 3 product families x 2 monthly periods.
-- method: moving_average | exp_smoothing | consensus | manual
INSERT INTO sop_demandforecast
  (id, period_start, item_code, forecast_qty, method, confidence, version,
   created_at, tenant_id)
VALUES
  ('b3f10000-0000-4000-8000-000000000001', '2026-09-01', 'FG-MTR-001', 55.00,
   'consensus', 0.82, 1, '2026-08-20 10:00:00+00', :tenant),
  ('b3f10000-0000-4000-8000-000000000002', '2026-09-01', 'FG-PMP-001', 32.00,
   'exp_smoothing', 0.74, 1, '2026-08-20 10:05:00+00', :tenant),
  ('b3f10000-0000-4000-8000-000000000003', '2026-09-01', 'FG-GBX-001', 18.00,
   'moving_average', 0.66, 1, '2026-08-20 10:10:00+00', :tenant),
  ('b3f10000-0000-4000-8000-000000000004', '2026-10-01', 'FG-MTR-001', 60.00,
   'consensus', 0.79, 1, '2026-09-05 10:00:00+00', :tenant),
  ('b3f10000-0000-4000-8000-000000000005', '2026-10-01', 'FG-PMP-001', 35.00,
   'exp_smoothing', 0.71, 1, '2026-09-05 10:05:00+00', :tenant),
  ('b3f10000-0000-4000-8000-000000000006', '2026-10-01', 'FG-GBX-001', 22.00,
   'manual', 0.60, 1, '2026-09-05 10:10:00+00', :tenant);

-- sop_consensusround — 2 rounds. status: open | locked
INSERT INTO sop_consensusround
  (id, cycle_name, forecast_version, status, locked_at, tenant_id)
VALUES
  ('b3f20000-0000-4000-8000-000000000001', 'S&OP Cycle 2026-08', 1, 'locked',
   '2026-08-28 16:00:00+00', :tenant),
  ('b3f20000-0000-4000-8000-000000000002', 'S&OP Cycle 2026-09', 1, 'open',
   NULL, :tenant);

-- sop_masterproductionschedule — 3 MPS lines. status: proposed | approved | frozen
INSERT INTO sop_masterproductionschedule
  (id, period_start, item_code, qty, status, tenant_id)
VALUES
  ('b3f30000-0000-4000-8000-000000000001', '2026-10-01', 'FG-MTR-001', 50.00, 'approved', :tenant),
  ('b3f30000-0000-4000-8000-000000000002', '2026-10-01', 'FG-PMP-001', 30.00, 'proposed', :tenant),
  ('b3f30000-0000-4000-8000-000000000003', '2026-11-01', 'FG-GBX-001', 20.00, 'proposed', :tenant);

-- sop_roughcutcapacityplan — 2 RCCP lines (assembly overloaded, fabrication OK).
INSERT INTO sop_roughcutcapacityplan
  (id, period_start, resource_code, required_hours, available_hours, tenant_id)
VALUES
  ('b3f40000-0000-4000-8000-000000000001', '2026-10-01', 'WC-ASSY', 640.00, 600.00, :tenant),
  ('b3f40000-0000-4000-8000-000000000002', '2026-10-01', 'WC-FAB', 480.00, 520.00, :tenant);

-- sop_atpquote — 4 promises; customer_requirement_id is a bare UUID (no FK),
-- stable synthetic values used.
INSERT INTO sop_atpquote
  (id, customer_requirement_id, promise_date, promise_qty, is_ctp, created_at, tenant_id)
VALUES
  ('b3f50000-0000-4000-8000-000000000001', 'b3a10000-0000-4000-8000-000000000001',
   '2026-09-25', 10.00, false, '2026-09-04 11:00:00+00', :tenant),
  ('b3f50000-0000-4000-8000-000000000002', 'b3a10000-0000-4000-8000-000000000002',
   '2026-10-12', 25.00, false, '2026-09-06 09:30:00+00', :tenant),
  ('b3f50000-0000-4000-8000-000000000003', 'b3a10000-0000-4000-8000-000000000003',
   '2026-11-06', 40.00, true, '2026-09-08 15:20:00+00', :tenant),
  ('b3f50000-0000-4000-8000-000000000004', 'b3a10000-0000-4000-8000-000000000004',
   '2026-10-30', 8.00, true, '2026-09-09 10:45:00+00', :tenant);

-- ===========================================================================
-- Field Service (after-sales story: combi ovens / chillers / dishwashers at
-- Harbour Grill, Blue Fig Hotels and Metro Hospital sites)
-- ===========================================================================

-- field_service_installedbaseunit — 8 units. status: active | retired | lost
-- customer_account_id resolves live crm_customers ids when seeded, else falls
-- back to a stable literal (column is a bare UUID, no FK).
INSERT INTO field_service_installedbaseunit
  (id, serial_number, item_code, customer_account_id, location, installed_on,
   warranty_until, status, tenant_id)
VALUES
  ('b3fa0000-0000-4000-8000-000000000001', 'CVP10-2025-1101', 'CV-PRO-10',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000001'),
   'Harbour Grill Flagship, Embarcadero, San Francisco, CA', '2025-11-10', '2026-11-09',
   'active', :tenant),
  ('b3fa0000-0000-4000-8000-000000000002', 'WPH500-2025-1102', 'WASHPRO-H500',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000001'),
   'Harbour Grill Flagship, Embarcadero, San Francisco, CA', '2025-11-12', '2026-11-11',
   'active', :tenant),
  ('b3fa0000-0000-4000-8000-000000000003', 'CVP20-2026-0201', 'CV-PRO-20',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000002'),
   'Blue Fig Manhattan, Banquet Kitchen, New York, NY', '2026-02-05', '2027-02-04',
   'active', :tenant),
  ('b3fa0000-0000-4000-8000-000000000004', 'CVP20-2026-0202', 'CV-PRO-20',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000002'),
   'Blue Fig Brooklyn, Main Kitchen, New York, NY', '2026-02-07', '2027-02-06',
   'active', :tenant),
  ('b3fa0000-0000-4000-8000-000000000005', 'CR80-2026-0203', 'CHILLRAPID-80',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000002'),
   'Blue Fig Manhattan, Cold Prep, New York, NY', '2026-02-10', '2027-02-09',
   'active', :tenant),
  ('b3fa0000-0000-4000-8000-000000000006', 'CVP10-2025-1201', 'CV-PRO-10',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Metro Hospital Kitchens' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000003'),
   'Metro Hospital, Central Kitchen, Chicago, IL', '2025-12-15', '2026-12-14',
   'active', :tenant),
  ('b3fa0000-0000-4000-8000-000000000007', 'CR50-2026-0301', 'CHILLRAPID-50',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Metro Hospital Kitchens' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000003'),
   'Metro Hospital, Ward Kitchen B, Chicago, IL', '2026-03-10', '2027-03-09',
   'active', :tenant),
  ('b3fa0000-0000-4000-8000-000000000008', 'CR50-2026-0601', 'CHILLRAPID-50',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000001'),
   'Harbour Grill Marina Branch, San Francisco, CA', '2026-06-20', '2027-06-19',
   'active', :tenant);

-- field_service_servicecontract — 4 contracts (AMC gold/silver + warranty).
-- contract_type: amc | sla | warranty
INSERT INTO field_service_servicecontract
  (id, number, customer_account_id, contract_type, start_date, end_date,
   response_sla_hours, resolution_sla_hours, tenant_id)
VALUES
  ('b3fb0000-0000-4000-8000-000000000001', 'SC-AMC-2026-0001',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000002'),
   'amc', '2026-01-01', '2026-12-31', 4, 24, :tenant),
  ('b3fb0000-0000-4000-8000-000000000002', 'SC-AMC-2026-0002',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Metro Hospital Kitchens' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000003'),
   'amc', '2026-04-01', '2027-03-31', 4, 24, :tenant),
  ('b3fb0000-0000-4000-8000-000000000003', 'SC-AMC-2026-0003',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000001'),
   'amc', '2026-07-01', '2027-06-30', 8, 48, :tenant),
  ('b3fb0000-0000-4000-8000-000000000004', 'SC-WTY-2025-0004',
   coalesce((SELECT id FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' LIMIT 1),
            'b3a20000-0000-4000-8000-000000000001'),
   'warranty', '2025-11-10', '2026-11-09', 24, 72, :tenant);

-- field_service_servicedispatch — 6 dispatches (4 done, 2 open).
-- status: scheduled | en_route | on_site | completed | cancelled
-- technician_user_id: stable synthetic UUIDs (bare UUID column, no FK).
INSERT INTO field_service_servicedispatch
  (id, number, scheduled_at, technician_user_id, status, completed_at,
   installed_unit_id, tenant_id)
VALUES
  ('b3fc0000-0000-4000-8000-000000000001', 'FSD-2026-0001', '2026-02-04 09:00:00+00',
   'b3a30000-0000-4000-8000-000000000001', 'completed', '2026-02-04 16:20:00+00',
   'b3fa0000-0000-4000-8000-000000000003', :tenant),
  ('b3fc0000-0000-4000-8000-000000000002', 'FSD-2026-0002', '2026-03-12 08:00:00+00',
   'b3a30000-0000-4000-8000-000000000002', 'completed', '2026-03-12 17:45:00+00',
   'b3fa0000-0000-4000-8000-000000000007', :tenant),
  ('b3fc0000-0000-4000-8000-000000000003', 'FSD-2026-0003', '2026-06-19 10:00:00+00',
   'b3a30000-0000-4000-8000-000000000003', 'completed', '2026-06-19 14:30:00+00',
   'b3fa0000-0000-4000-8000-000000000002', :tenant),
  ('b3fc0000-0000-4000-8000-000000000004', 'FSD-2026-0004', '2026-08-12 09:30:00+00',
   'b3a30000-0000-4000-8000-000000000001', 'completed', '2026-08-12 13:00:00+00',
   'b3fa0000-0000-4000-8000-000000000005', :tenant),
  ('b3fc0000-0000-4000-8000-000000000005', 'FSD-2026-0005', '2026-09-15 09:00:00+00',
   'b3a30000-0000-4000-8000-000000000003', 'scheduled', NULL,
   'b3fa0000-0000-4000-8000-000000000001', :tenant),
  ('b3fc0000-0000-4000-8000-000000000006', 'FSD-2026-0006', '2026-09-11 08:30:00+00',
   'b3a30000-0000-4000-8000-000000000002', 'en_route', NULL,
   'b3fa0000-0000-4000-8000-000000000006', :tenant);

-- field_service_rma — 3 RMAs.
-- status: requested | approved | returned | refunded | rejected
INSERT INTO field_service_rma
  (id, number, reason, status, raised_at, installed_unit_id, tenant_id)
VALUES
  ('b3fd0000-0000-4000-8000-000000000001', 'RMA-2026-0001',
   'Evaporator fan motor dead on arrival after installation at Marina branch; replacement shipped, defective unit returned for vendor claim.',
   'returned', '2026-06-25 11:00:00+00',
   'b3fa0000-0000-4000-8000-000000000008', :tenant),
  ('b3fd0000-0000-4000-8000-000000000002', 'RMA-2026-0002',
   'Combi oven control PCB intermittent display fault under warranty; return authorised for factory diagnostics.',
   'approved', '2026-08-20 09:40:00+00',
   'b3fa0000-0000-4000-8000-000000000004', :tenant),
  ('b3fd0000-0000-4000-8000-000000000003', 'RMA-2026-0003',
   'Wrong-variant water inlet valve shipped with spares order (3/4in supplied, 1/2in required); unused part return.',
   'requested', '2026-09-05 10:15:00+00',
   NULL, :tenant);
