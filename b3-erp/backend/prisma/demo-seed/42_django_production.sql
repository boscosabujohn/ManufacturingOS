-- =============================================================================
-- 42_django_production.sql
-- Demo seed for Django (OptiForge platform) production tables:
--   production_planning_* (7), mes_* (4), commissioning_* (3), eto_mode_* (7)
--
-- Idempotent: DELETE-then-INSERT, scoped by tenant_id = :tenant.
--   Delete predicates: every table is purged with
--     DELETE FROM <table> WHERE tenant_id = :tenant::uuid
--   children first (bomline before bomheader, routingoperation before routing,
--   workorder before plannedorder before mrprun, mes children before
--   mes_workcenter, handovercertificate/step before commissioningplan).
--
-- Data mirrors the NestJS b3-erp demo seed already in this database:
--   work_centers (8)            -> mes_workcenter
--   boms (5) + bom_items (19)   -> production_planning_bomheader/_bomline
--   routings (5, operations json)-> production_planning_routing/_routingoperation (26 ops)
--   production_mrp_runs (4)     -> production_planning_mrprun
--   production_planned_orders(10)-> production_planning_plannedorder
--   work_orders (10 of 30 WO-DEMO, statuses mappable to Django choices)
--                               -> production_planning_workorder
--   production_oee_records (12) -> mes_oeesnapshot
--   sales_orders SO-DEMO-*      -> soft sales_order_id refs (COALESCE fallback,
--                                  columns are plain UUIDs, no FK constraint)
--
-- All status values come from the Django model choices (models.py is authoritative):
--   MRPRun: running|completed|failed        PlannedOrder: planned|released|cancelled
--   PlannedOrder.order_type: make|buy|transfer
--   WorkOrder: released|in_progress|completed|cancelled
--   ProductionRun: scheduled|running|paused|completed|aborted
--   AndonEvent.event_type: quality|maintenance|material|other; status: open|acknowledged|resolved
--   CommissioningPlan: draft|in_progress|completed|cancelled; Step.result: pending|pass|fail
--   ChangeOrderRequest: submitted|cost_impact_pending|approved|rejected|implemented|cancelled
--   SiteSurvey: scheduled|completed|cancelled
--
-- User-reference columns (issued_by_user_id, surveyor_user_id, locked_by,
-- submitted_by) are UUID columns but auth_user PKs are integers (9001-9003),
-- so deterministic synthetic UUIDs are used (no FK exists on these columns).
-- =============================================================================

\set tenant '''b3000000-0000-4000-8000-000000000001'''

SET CONSTRAINTS ALL IMMEDIATE;

-- =============================================================================
-- DELETE (children first)
-- =============================================================================

-- production_planning: workorder -> plannedorder -> mrprun; bomline -> bomheader; routingoperation -> routing
DELETE FROM production_planning_workorder        WHERE tenant_id = :tenant::uuid;
DELETE FROM production_planning_plannedorder     WHERE tenant_id = :tenant::uuid;
DELETE FROM production_planning_mrprun           WHERE tenant_id = :tenant::uuid;
DELETE FROM production_planning_bomline          WHERE tenant_id = :tenant::uuid;
DELETE FROM production_planning_bomheader        WHERE tenant_id = :tenant::uuid;
DELETE FROM production_planning_routingoperation WHERE tenant_id = :tenant::uuid;
DELETE FROM production_planning_routing          WHERE tenant_id = :tenant::uuid;

-- mes: andonevent/oeesnapshot/productionrun -> workcenter
DELETE FROM mes_andonevent    WHERE tenant_id = :tenant::uuid;
DELETE FROM mes_oeesnapshot   WHERE tenant_id = :tenant::uuid;
DELETE FROM mes_productionrun WHERE tenant_id = :tenant::uuid;
DELETE FROM mes_workcenter    WHERE tenant_id = :tenant::uuid;

-- commissioning: certificate/step -> plan
DELETE FROM commissioning_handovercertificate WHERE tenant_id = :tenant::uuid;
DELETE FROM commissioning_commissioningstep   WHERE tenant_id = :tenant::uuid;
DELETE FROM commissioning_commissioningplan   WHERE tenant_id = :tenant::uuid;

-- eto_mode: no inter-table FKs
DELETE FROM eto_mode_changeorderrequest       WHERE tenant_id = :tenant::uuid;
DELETE FROM eto_mode_designlock               WHERE tenant_id = :tenant::uuid;
DELETE FROM eto_mode_liquidateddamages        WHERE tenant_id = :tenant::uuid;
DELETE FROM eto_mode_milestonebillingschedule WHERE tenant_id = :tenant::uuid;
DELETE FROM eto_mode_projectworkorderlink     WHERE tenant_id = :tenant::uuid;
DELETE FROM eto_mode_retentionpolicy          WHERE tenant_id = :tenant::uuid;
DELETE FROM eto_mode_sitesurvey               WHERE tenant_id = :tenant::uuid;

-- =============================================================================
-- PRODUCTION PLANNING — BOM (mirrors boms/bom_items DEMO-BOM-001..005)
-- boms.version 2 -> rev 'B', version 1 -> rev 'A'
-- =============================================================================

INSERT INTO production_planning_bomheader (id, parent_item_code, rev, is_active, tenant_id) VALUES
('b3d9b0b0-0000-4000-8000-000000000001', 'FG-MTR-001',  'B', true, :tenant::uuid),  -- DEMO-BOM-001 Industrial Motor 5HP (v2)
('b3d9b0b0-0000-4000-8000-000000000002', 'FG-PMP-001',  'A', true, :tenant::uuid),  -- DEMO-BOM-002 Centrifugal Pump CP-200
('b3d9b0b0-0000-4000-8000-000000000003', 'FG-GBX-001',  'A', true, :tenant::uuid),  -- DEMO-BOM-003 Precision Gearbox PG-50
('b3d9b0b0-0000-4000-8000-000000000004', 'WIP-GBX-001', 'A', true, :tenant::uuid),  -- DEMO-BOM-004 Gearbox Housing (Machined)
('b3d9b0b0-0000-4000-8000-000000000005', 'WIP-SFT-001', 'A', true, :tenant::uuid);  -- DEMO-BOM-005 Drive Shaft Assembly (WIP)

INSERT INTO production_planning_bomline (id, component_item_code, quantity_per, scrap_percentage, bom_id, tenant_id) VALUES
-- DEMO-BOM-001 (FG-MTR-001)
('b3d9b1b1-0000-4000-8000-000000000001', 'RM-STL-001',  30.000000,  3.00, 'b3d9b0b0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000002', 'RM-COP-001',  120.000000, 2.00, 'b3d9b0b0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000003', 'RM-ALM-001',  4.000000,   2.00, 'b3d9b0b0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000004', 'SP-BRG-001',  2.000000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000005', 'CON-LUB-001', 0.500000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000001', :tenant::uuid),
-- DEMO-BOM-002 (FG-PMP-001)
('b3d9b1b1-0000-4000-8000-000000000006', 'RM-STL-001',  18.000000,  3.00, 'b3d9b0b0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000007', 'RM-ALM-001',  3.000000,   2.00, 'b3d9b0b0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000008', 'WIP-SFT-001', 1.000000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000009', 'SP-SL-001',   1.000000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000010', 'SP-BRG-001',  2.000000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000002', :tenant::uuid),
-- DEMO-BOM-003 (FG-GBX-001)
('b3d9b1b1-0000-4000-8000-000000000011', 'WIP-GBX-001', 1.000000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000003', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000012', 'WIP-SFT-001', 2.000000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000003', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000013', 'SP-BRG-001',  4.000000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000003', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000014', 'RM-STL-001',  25.000000,  3.00, 'b3d9b0b0-0000-4000-8000-000000000003', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000015', 'CON-LUB-001', 2.000000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000003', :tenant::uuid),
-- DEMO-BOM-004 (WIP-GBX-001)
('b3d9b1b1-0000-4000-8000-000000000016', 'RM-STL-001',  20.000000,  4.00, 'b3d9b0b0-0000-4000-8000-000000000004', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000017', 'CON-CLT-001', 0.400000,   0.00, 'b3d9b0b0-0000-4000-8000-000000000004', :tenant::uuid),
-- DEMO-BOM-005 (WIP-SFT-001)
('b3d9b1b1-0000-4000-8000-000000000018', 'RM-ALM-001',  2.500000,   2.00, 'b3d9b0b0-0000-4000-8000-000000000005', :tenant::uuid),
('b3d9b1b1-0000-4000-8000-000000000019', 'RM-STL-001',  2.000000,   3.00, 'b3d9b0b0-0000-4000-8000-000000000005', :tenant::uuid);

-- =============================================================================
-- PRODUCTION PLANNING — Routing (mirrors routings DEMO-RTG-001..005;
-- operations json flattened to rows; routings.version 2 -> rev 'B')
-- =============================================================================

INSERT INTO production_planning_routing (id, item_code, rev, tenant_id) VALUES
('b3d9c0c0-0000-4000-8000-000000000001', 'FG-MTR-001',  'A', :tenant::uuid),  -- DEMO-RTG-001
('b3d9c0c0-0000-4000-8000-000000000002', 'FG-PMP-001',  'A', :tenant::uuid),  -- DEMO-RTG-002
('b3d9c0c0-0000-4000-8000-000000000003', 'FG-GBX-001',  'A', :tenant::uuid),  -- DEMO-RTG-003
('b3d9c0c0-0000-4000-8000-000000000004', 'WIP-GBX-001', 'A', :tenant::uuid),  -- DEMO-RTG-004
('b3d9c0c0-0000-4000-8000-000000000005', 'WIP-SFT-001', 'B', :tenant::uuid);  -- DEMO-RTG-005 (v2)

INSERT INTO production_planning_routingoperation (id, sequence, work_center_code, setup_minutes, run_minutes_per_unit, routing_id, tenant_id) VALUES
-- DEMO-RTG-001 FG-MTR-001 (7 ops)
('b3d9c1c1-0000-4000-8000-000000000001', 10, 'WC-CUT',   20.00,  6.0000, 'b3d9c0c0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000002', 20, 'WC-CNC',   35.00, 18.0000, 'b3d9c0c0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000003', 30, 'WC-WELD',  15.00, 12.0000, 'b3d9c0c0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000004', 40, 'WC-PAINT', 25.00,  8.0000, 'b3d9c0c0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000005', 50, 'WC-ASSY',  15.00, 25.0000, 'b3d9c0c0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000006', 60, 'WC-QC',     5.00, 10.0000, 'b3d9c0c0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000007', 70, 'WC-PACK',   5.00,  6.0000, 'b3d9c0c0-0000-4000-8000-000000000001', :tenant::uuid),
-- DEMO-RTG-002 FG-PMP-001 (6 ops)
('b3d9c1c1-0000-4000-8000-000000000008', 10, 'WC-CUT',   15.00,  5.0000, 'b3d9c0c0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000009', 20, 'WC-CNC',   40.00, 22.0000, 'b3d9c0c0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000010', 30, 'WC-WELD',  15.00, 10.0000, 'b3d9c0c0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000011', 40, 'WC-ASSY',  20.00, 30.0000, 'b3d9c0c0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000012', 50, 'WC-QC',    10.00, 15.0000, 'b3d9c0c0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000013', 60, 'WC-PACK',   5.00,  8.0000, 'b3d9c0c0-0000-4000-8000-000000000002', :tenant::uuid),
-- DEMO-RTG-003 FG-GBX-001 (5 ops; OP-GRIND runs on WC-CNC in source)
('b3d9c1c1-0000-4000-8000-000000000014', 10, 'WC-CNC',   45.00, 35.0000, 'b3d9c0c0-0000-4000-8000-000000000003', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000015', 20, 'WC-CNC',   20.00, 15.0000, 'b3d9c0c0-0000-4000-8000-000000000003', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000016', 30, 'WC-ASSY',  25.00, 40.0000, 'b3d9c0c0-0000-4000-8000-000000000003', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000017', 40, 'WC-QC',    10.00, 20.0000, 'b3d9c0c0-0000-4000-8000-000000000003', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000018', 50, 'WC-PACK',   5.00,  6.0000, 'b3d9c0c0-0000-4000-8000-000000000003', :tenant::uuid),
-- DEMO-RTG-004 WIP-GBX-001 (3 ops)
('b3d9c1c1-0000-4000-8000-000000000019', 10, 'WC-CNC',   45.00, 28.0000, 'b3d9c0c0-0000-4000-8000-000000000004', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000020', 20, 'WC-CNC',   15.00, 10.0000, 'b3d9c0c0-0000-4000-8000-000000000004', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000021', 30, 'WC-QC',     5.00,  8.0000, 'b3d9c0c0-0000-4000-8000-000000000004', :tenant::uuid),
-- DEMO-RTG-005 WIP-SFT-001 (5 ops)
('b3d9c1c1-0000-4000-8000-000000000022', 10, 'WC-CUT',   10.00,  4.0000, 'b3d9c0c0-0000-4000-8000-000000000005', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000023', 20, 'WC-CNC',   30.00, 16.0000, 'b3d9c0c0-0000-4000-8000-000000000005', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000024', 30, 'WC-CNC',   15.00,  8.0000, 'b3d9c0c0-0000-4000-8000-000000000005', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000025', 40, 'WC-WELD',  10.00,  6.0000, 'b3d9c0c0-0000-4000-8000-000000000005', :tenant::uuid),
('b3d9c1c1-0000-4000-8000-000000000026', 50, 'WC-QC',     5.00,  6.0000, 'b3d9c0c0-0000-4000-8000-000000000005', :tenant::uuid);

-- =============================================================================
-- PRODUCTION PLANNING — MRP runs (mirrors production_mrp_runs DEMO-MRP-2026-001..004)
-- =============================================================================

INSERT INTO production_planning_mrprun (id, run_number, horizon_days, started_at, completed_at, status, shortages_identified, planned_orders_created, tenant_id) VALUES
('b3d9d0d0-0000-4000-8000-000000000001', 'DEMO-MRP-2026-001', 90, '2026-05-22 08:30:00+05:30', '2026-05-22 09:12:00+05:30', 'completed', 5, 3, :tenant::uuid),
('b3d9d0d0-0000-4000-8000-000000000002', 'DEMO-MRP-2026-002', 90, '2026-06-21 09:00:00+05:30', '2026-06-21 09:25:00+05:30', 'completed', 3, 3, :tenant::uuid),
('b3d9d0d0-0000-4000-8000-000000000003', 'DEMO-MRP-2026-003', 90, '2026-07-22 08:15:00+05:30', '2026-07-22 09:05:00+05:30', 'completed', 6, 2, :tenant::uuid),
('b3d9d0d0-0000-4000-8000-000000000004', 'DEMO-MRP-2026-004', 60, '2026-08-22 08:45:00+05:30', '2026-08-22 09:02:00+05:30', 'completed', 2, 2, :tenant::uuid);

-- =============================================================================
-- PRODUCTION PLANNING — Planned orders (mirrors production_planned_orders DEMO-PLO-0001..0010)
-- order_type map: production->make, purchase->buy, transfer->transfer
-- status map:     released->released, firmed/planned->planned
-- =============================================================================

INSERT INTO production_planning_plannedorder (id, item_code, order_type, quantity, required_by, status, mrp_run_id, tenant_id) VALUES
('b3d9d1d1-0000-4000-8000-000000000001', 'FG-MTR-001',  'make',     50.0000,   '2026-06-20', 'released', 'b3d9d0d0-0000-4000-8000-000000000001', :tenant::uuid), -- DEMO-PLO-0001
('b3d9d1d1-0000-4000-8000-000000000002', 'WIP-GBX-001', 'make',     25.0000,   '2026-06-18', 'released', 'b3d9d0d0-0000-4000-8000-000000000001', :tenant::uuid), -- DEMO-PLO-0002
('b3d9d1d1-0000-4000-8000-000000000003', 'RM-STL-001',  'buy',      1200.0000, '2026-06-14', 'planned',  'b3d9d0d0-0000-4000-8000-000000000001', :tenant::uuid), -- DEMO-PLO-0003 (firmed)
('b3d9d1d1-0000-4000-8000-000000000004', 'FG-PMP-001',  'make',     50.0000,   '2026-07-20', 'released', 'b3d9d0d0-0000-4000-8000-000000000002', :tenant::uuid), -- DEMO-PLO-0004
('b3d9d1d1-0000-4000-8000-000000000005', 'SP-BRG-001',  'buy',      400.0000,  '2026-07-10', 'released', 'b3d9d0d0-0000-4000-8000-000000000002', :tenant::uuid), -- DEMO-PLO-0005
('b3d9d1d1-0000-4000-8000-000000000006', 'WIP-SFT-001', 'transfer', 30.0000,   '2026-07-15', 'planned',  'b3d9d0d0-0000-4000-8000-000000000002', :tenant::uuid), -- DEMO-PLO-0006
('b3d9d1d1-0000-4000-8000-000000000007', 'FG-GBX-001',  'make',     25.0000,   '2026-08-22', 'released', 'b3d9d0d0-0000-4000-8000-000000000003', :tenant::uuid), -- DEMO-PLO-0007
('b3d9d1d1-0000-4000-8000-000000000008', 'RM-ALM-001',  'buy',      600.0000,  '2026-08-12', 'planned',  'b3d9d0d0-0000-4000-8000-000000000003', :tenant::uuid), -- DEMO-PLO-0008 (firmed)
('b3d9d1d1-0000-4000-8000-000000000009', 'WIP-GBX-001', 'make',     25.0000,   '2026-09-23', 'planned',  'b3d9d0d0-0000-4000-8000-000000000004', :tenant::uuid), -- DEMO-PLO-0009 (firmed)
('b3d9d1d1-0000-4000-8000-000000000010', 'FG-GBX-001',  'make',     25.0000,   '2026-10-22', 'planned',  'b3d9d0d0-0000-4000-8000-000000000004', :tenant::uuid); -- DEMO-PLO-0010

-- =============================================================================
-- PRODUCTION PLANNING — Work orders
-- 10 of the 30 NestJS WO-DEMO work_orders whose statuses map onto Django
-- choices (Completed->completed, In Progress->in_progress, Released->released).
-- In-progress/released WOs are linked to matching released planned orders.
-- =============================================================================

INSERT INTO production_planning_workorder (id, number, item_code, quantity, status, released_at, completed_at, planned_order_id, tenant_id) VALUES
('b3d9d2d2-0000-4000-8000-000000000001', 'WO-DEMO-0001', 'FG-MTR-001',  40.0000, 'completed',   '2025-10-03 14:00:00+05:30', '2025-10-16 16:00:00+05:30', NULL, :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000002', 'WO-DEMO-0002', 'FG-PMP-001',  25.0000, 'completed',   '2025-10-10 14:00:00+05:30', '2025-10-28 16:00:00+05:30', NULL, :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000003', 'WO-DEMO-0005', 'FG-GBX-001',  15.0000, 'completed',   '2025-11-07 14:00:00+05:30', '2025-12-03 16:00:00+05:30', NULL, :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000004', 'WO-DEMO-0010', 'FG-MTR-001',  35.0000, 'completed',   '2026-02-06 14:00:00+05:30', '2026-02-20 16:00:00+05:30', NULL, :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000005', 'WO-DEMO-0014', 'FG-MTR-001',   6.0000, 'completed',   '2026-05-08 14:00:00+05:30', '2026-05-14 16:00:00+05:30', NULL, :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000006', 'WO-DEMO-0015', 'WIP-GBX-001', 55.0000, 'in_progress', '2026-08-07 14:00:00+05:30', NULL, 'b3d9d1d1-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000007', 'WO-DEMO-0016', 'FG-MTR-001',  45.0000, 'in_progress', '2026-08-14 14:00:00+05:30', NULL, 'b3d9d1d1-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000008', 'WO-DEMO-0019', 'FG-GBX-001',  16.0000, 'in_progress', '2026-08-29 14:00:00+05:30', NULL, 'b3d9d1d1-0000-4000-8000-000000000007', :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000009', 'WO-DEMO-0021', 'FG-MTR-001',  50.0000, 'released',    '2026-09-09 14:00:00+05:30', NULL, NULL, :tenant::uuid),
('b3d9d2d2-0000-4000-8000-000000000010', 'WO-DEMO-0022', 'FG-PMP-001',  22.0000, 'released',    '2026-09-09 14:00:00+05:30', NULL, 'b3d9d1d1-0000-4000-8000-000000000004', :tenant::uuid);

-- =============================================================================
-- MES — Work centers (mirrors NestJS work_centers, 8 rows)
-- plc_endpoint filled for machine centers, empty (manual) for people-driven ones
-- =============================================================================

INSERT INTO mes_workcenter (id, code, name, is_active, plc_endpoint, tenant_id) VALUES
('b3d9e0e0-0000-4000-8000-000000000001', 'WC-CUT',   'Cutting Section',  true, 'opc.tcp://plc-cut.b3.local:4840',   :tenant::uuid),
('b3d9e0e0-0000-4000-8000-000000000002', 'WC-BEND',  'Bending Section',  true, 'opc.tcp://plc-bend.b3.local:4840',  :tenant::uuid),
('b3d9e0e0-0000-4000-8000-000000000003', 'WC-CNC',   'CNC Machining',    true, 'opc.tcp://plc-cnc.b3.local:4840',   :tenant::uuid),
('b3d9e0e0-0000-4000-8000-000000000004', 'WC-WELD',  'Welding Section',  true, 'modbus://plc-weld.b3.local:502',    :tenant::uuid),
('b3d9e0e0-0000-4000-8000-000000000005', 'WC-PAINT', 'Painting Section', true, 'modbus://plc-paint.b3.local:502',   :tenant::uuid),
('b3d9e0e0-0000-4000-8000-000000000006', 'WC-ASSY',  'Assembly Section', true, '', :tenant::uuid),
('b3d9e0e0-0000-4000-8000-000000000007', 'WC-QC',    'Quality Check',    true, '', :tenant::uuid),
('b3d9e0e0-0000-4000-8000-000000000008', 'WC-PACK',  'Packing Section',  true, '', :tenant::uuid);

-- =============================================================================
-- MES — Production runs (8; execution slices for the mirrored WO-DEMO orders)
-- =============================================================================

INSERT INTO mes_productionrun (id, work_order_number, started_at, completed_at, planned_quantity, produced_quantity, scrap_quantity, status, tenant_id, work_center_id) VALUES
('b3d9e1e1-0000-4000-8000-000000000001', 'WO-DEMO-0001', '2025-10-06 08:00:00+05:30', '2025-10-16 16:00:00+05:30', 40.0000, 40.0000, 1.0000, 'completed', :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY
('b3d9e1e1-0000-4000-8000-000000000002', 'WO-DEMO-0002', '2025-10-13 08:00:00+05:30', '2025-10-28 16:00:00+05:30', 25.0000, 25.0000, 0.0000, 'completed', :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY
('b3d9e1e1-0000-4000-8000-000000000003', 'WO-DEMO-0005', '2025-11-10 08:00:00+05:30', '2025-12-03 16:00:00+05:30', 15.0000, 15.0000, 0.0000, 'completed', :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY
('b3d9e1e1-0000-4000-8000-000000000004', 'WO-DEMO-0010', '2026-02-09 08:00:00+05:30', '2026-02-20 16:00:00+05:30', 35.0000, 35.0000, 1.0000, 'completed', :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY
('b3d9e1e1-0000-4000-8000-000000000005', 'WO-DEMO-0015', '2026-08-10 08:00:00+05:30', NULL,                        55.0000, 30.0000, 1.0000, 'running',   :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000003'), -- WC-CNC
('b3d9e1e1-0000-4000-8000-000000000006', 'WO-DEMO-0016', '2026-08-17 08:00:00+05:30', NULL,                        45.0000, 20.0000, 0.0000, 'running',   :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY
('b3d9e1e1-0000-4000-8000-000000000007', 'WO-DEMO-0019', '2026-09-01 08:00:00+05:30', NULL,                        16.0000,  5.0000, 0.0000, 'paused',    :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY (paused on Andon material shortage)
('b3d9e1e1-0000-4000-8000-000000000008', 'WO-DEMO-0021', NULL,                        NULL,                        50.0000,  0.0000, 0.0000, 'scheduled', :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'); -- WC-ASSY

-- =============================================================================
-- MES — OEE snapshots (mirrors the 12 production_oee_records; one 06:00-14:00
-- shift per record_date; work_center_name mapped to Django work centers)
-- =============================================================================

INSERT INTO mes_oeesnapshot (id, period_start, period_end, availability, performance, quality, tenant_id, work_center_id) VALUES
('b3d9e2e2-0000-4000-8000-000000000001', '2026-08-24 06:00:00+05:30', '2026-08-24 14:00:00+05:30', 93.75, 90.00,  97.53, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000001'), -- WC-CUT
('b3d9e2e2-0000-4000-8000-000000000002', '2026-08-24 06:00:00+05:30', '2026-08-24 14:00:00+05:30', 89.58, 87.50,  98.40, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000002'), -- WC-BEND
('b3d9e2e2-0000-4000-8000-000000000003', '2026-08-25 06:00:00+05:30', '2026-08-25 14:00:00+05:30', 85.42, 82.93,  96.47, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000004'), -- WC-WELD
('b3d9e2e2-0000-4000-8000-000000000004', '2026-08-25 06:00:00+05:30', '2026-08-25 14:00:00+05:30', 91.67, 88.64,  95.00, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000005'), -- WC-PAINT
('b3d9e2e2-0000-4000-8000-000000000005', '2026-08-26 06:00:00+05:30', '2026-08-26 14:00:00+05:30', 95.83, 91.30,  99.05, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY
('b3d9e2e2-0000-4000-8000-000000000006', '2026-08-26 06:00:00+05:30', '2026-08-26 14:00:00+05:30', 87.50, 85.71,  97.22, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000003'), -- WC-CNC
('b3d9e2e2-0000-4000-8000-000000000007', '2026-08-31 06:00:00+05:30', '2026-08-31 14:00:00+05:30', 95.83, 92.39,  98.12, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000001'), -- WC-CUT
('b3d9e2e2-0000-4000-8000-000000000008', '2026-08-31 06:00:00+05:30', '2026-08-31 14:00:00+05:30', 88.54, 84.71,  97.20, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000004'), -- WC-WELD
('b3d9e2e2-0000-4000-8000-000000000009', '2026-09-01 06:00:00+05:30', '2026-09-01 14:00:00+05:30', 93.75, 90.00,  96.30, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000005'), -- WC-PAINT
('b3d9e2e2-0000-4000-8000-000000000010', '2026-09-02 06:00:00+05:30', '2026-09-02 14:00:00+05:30', 94.79, 89.01,  99.26, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY
('b3d9e2e2-0000-4000-8000-000000000011', '2026-09-03 06:00:00+05:30', '2026-09-03 14:00:00+05:30', 90.62, 87.36,  97.37, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000003'), -- WC-CNC
('b3d9e2e2-0000-4000-8000-000000000012', '2026-09-04 06:00:00+05:30', '2026-09-04 14:00:00+05:30', 97.92, 93.62, 100.00, :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000007'); -- WC-QC

-- =============================================================================
-- MES — Andon events (6)
-- =============================================================================

INSERT INTO mes_andonevent (id, event_type, description, raised_at, acknowledged_at, resolved_at, status, tenant_id, work_center_id) VALUES
('b3d9e3e3-0000-4000-8000-000000000001', 'maintenance', 'CNC spindle overheating alarm - coolant flow below threshold on VMC-2',            '2026-08-26 10:42:00+05:30', '2026-08-26 10:50:00+05:30', '2026-08-26 13:15:00+05:30', 'resolved',     :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000003'), -- WC-CNC
('b3d9e3e3-0000-4000-8000-000000000002', 'quality',     'Weld porosity detected on gearbox housing batch WO-DEMO-0015 - rework initiated',  '2026-08-31 11:20:00+05:30', '2026-08-31 11:26:00+05:30', '2026-08-31 15:40:00+05:30', 'resolved',     :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000004'), -- WC-WELD
('b3d9e3e3-0000-4000-8000-000000000003', 'material',    'SS-304 sheet stock (RM-STL-001) below shift requirement at laser bay',             '2026-09-02 08:35:00+05:30', '2026-09-02 08:41:00+05:30', '2026-09-02 12:05:00+05:30', 'resolved',     :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000001'), -- WC-CUT
('b3d9e3e3-0000-4000-8000-000000000004', 'maintenance', 'Paint booth exhaust filter differential pressure high - replacement scheduled',    '2026-09-08 09:10:00+05:30', '2026-09-08 09:25:00+05:30', NULL,                        'acknowledged', :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000005'), -- WC-PAINT
('b3d9e3e3-0000-4000-8000-000000000005', 'material',    'Bearing kit SP-BRG-001 shortage blocking assembly of WO-DEMO-0019',                '2026-09-10 08:55:00+05:30', NULL,                        NULL,                        'open',         :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000006'), -- WC-ASSY
('b3d9e3e3-0000-4000-8000-000000000006', 'other',       'CMM probe calibration certificate expires this week - recalibration due',          '2026-09-10 10:30:00+05:30', NULL,                        NULL,                        'open',         :tenant::uuid, 'b3d9e0e0-0000-4000-8000-000000000007'); -- WC-QC

-- =============================================================================
-- COMMISSIONING — Grand Hyatt Kochi kitchen story
-- Plan 1 (Main Kitchen): completed, all steps passed, handover certificate issued.
-- Plan 2 (Banquet Kitchen Phase 2): in progress.
-- sales_order_id soft-references NestJS sales_orders (no FK); COALESCE keeps
-- NOT NULL satisfied even if SO-DEMO rows are absent at apply time.
-- =============================================================================

INSERT INTO commissioning_commissioningplan (id, number, sales_order_id, site_location, planned_start, planned_end, status, tenant_id) VALUES
('b3d9f0f0-0000-4000-8000-000000000001', 'CP-DEMO-0001',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 'Grand Hyatt Kochi Bolgatty - Main Kitchen, Mulavukad', '2026-04-06', '2026-04-30', 'completed', :tenant::uuid),
('b3d9f0f0-0000-4000-8000-000000000002', 'CP-DEMO-0002',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0007'), 'b3d95000-0000-4000-8000-000000000007'::uuid),
 'Grand Hyatt Kochi Bolgatty - Banquet Kitchen (Phase 2)', '2026-08-24', '2026-09-25', 'in_progress', :tenant::uuid);

INSERT INTO commissioning_commissioningstep (id, sequence, title, instructions, is_qc_gate, completed_at, result, plan_id, tenant_id) VALUES
-- CP-DEMO-0001 (5 steps, all passed)
('b3d9f1f1-0000-4000-8000-000000000001', 10, 'Site readiness and utilities verification',
 'Verify kitchen floor levelling, drainage slopes, LPG line pressure (17.5 kPa), 3-phase power availability and exhaust duct clearances against the approved site survey.', true,  '2026-04-07 17:30:00+05:30', 'pass', 'b3d9f0f0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9f1f1-0000-4000-8000-000000000002', 20, 'Equipment positioning and levelling',
 'Position cooking ranges, tilting brat pans and dishwash line as per layout drawing GA-B3-1042 Rev C; level all units to within 2 mm/m.', false, '2026-04-12 18:00:00+05:30', 'pass', 'b3d9f0f0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9f1f1-0000-4000-8000-000000000003', 30, 'Gas and electrical hookup with leak test',
 'Connect LPG manifold and electrical feeds; soap-solution and manometer leak test on all gas joints; megger test on all circuits.', true,  '2026-04-18 16:45:00+05:30', 'pass', 'b3d9f0f0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9f1f1-0000-4000-8000-000000000004', 40, 'Burner calibration and performance test',
 'Calibrate burners to rated output, verify flame characteristics, thermostat accuracy (+/- 2 C) and hood extraction airflow at full load.', false, '2026-04-24 15:20:00+05:30', 'pass', 'b3d9f0f0-0000-4000-8000-000000000001', :tenant::uuid),
('b3d9f1f1-0000-4000-8000-000000000005', 50, 'Staff training and handover walkthrough',
 'Train kitchen staff on operation, cleaning and safety cut-offs; walk through O&M manuals and warranty terms with chief engineer.', false, '2026-04-29 17:00:00+05:30', 'pass', 'b3d9f0f0-0000-4000-8000-000000000001', :tenant::uuid),
-- CP-DEMO-0002 (3 steps, in progress)
('b3d9f1f1-0000-4000-8000-000000000006', 10, 'Site readiness and utilities verification',
 'Verify banquet kitchen slab loading, floor drains and utility stubs against Phase 2 survey; confirm cold-room condenser location.', true,  '2026-08-26 17:10:00+05:30', 'pass', 'b3d9f0f0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9f1f1-0000-4000-8000-000000000007', 20, 'Cold-room panel installation and refrigerant charging',
 'Erect PUF panels, fit doors and curtains, vacuum and charge refrigeration circuit, pull-down test to -18 C.', false, NULL, 'pending', 'b3d9f0f0-0000-4000-8000-000000000002', :tenant::uuid),
('b3d9f1f1-0000-4000-8000-000000000008', 30, 'Final QC and food-safety compliance check',
 'FSSAI-aligned hygiene inspection, surface temperature mapping, and punch-list closure before handover.', true,  NULL, 'pending', 'b3d9f0f0-0000-4000-8000-000000000002', :tenant::uuid);

-- Handover certificate for the completed Main Kitchen plan
-- (issued_by_user_id is a synthetic UUID for auth_user 9003 / sarah.mitchell;
--  auth_user PKs are integers so no direct reference is possible)
INSERT INTO commissioning_handovercertificate (id, issued_at, issued_by_user_id, customer_signature_document_id, installed_unit_id, plan_id, tenant_id) VALUES
('b3d9f2f2-0000-4000-8000-000000000001', '2026-04-30 16:30:00+05:30',
 'b3000000-0000-4000-8000-000000009003', NULL, NULL,
 'b3d9f0f0-0000-4000-8000-000000000001', :tenant::uuid);

-- =============================================================================
-- ETO MODE — sales_order_id is a plain UUID (no FK); soft-linked to the NestJS
-- SO-DEMO orders via COALESCE subselects. project_id on projectworkorderlink is
-- also a plain UUID: it soft-references project_project, which is seeded by a
-- later file (45); a deterministic UUID is used so the link is stable either way.
-- =============================================================================

-- Design locks (sales_order_id UNIQUE): frozen designs for the two active ETO orders
INSERT INTO eto_mode_designlock (id, sales_order_id, locked_at, locked_by, design_snapshot, unlocked_at, tenant_id) VALUES
('b3d9a1a1-0000-4000-8000-000000000001',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 '2026-02-16 11:00:00+05:30', 'b3000000-0000-4000-8000-000000009003',
 '{"bom": {"FG-GBX-001": "A"}, "routing": {"FG-GBX-001": "A"}, "drawings": ["GA-B3-1042-C", "EL-B3-2210-B"], "spec_rev": "C"}'::jsonb,
 NULL, :tenant::uuid),
('b3d9a1a1-0000-4000-8000-000000000002',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0005'), 'b3d95000-0000-4000-8000-000000000005'::uuid),
 '2026-05-04 10:30:00+05:30', 'b3000000-0000-4000-8000-000000009001',
 '{"bom": {"FG-MTR-001": "B", "WIP-SFT-001": "A"}, "routing": {"FG-MTR-001": "A", "WIP-SFT-001": "B"}, "drawings": ["GA-B3-1107-A"], "spec_rev": "A"}'::jsonb,
 NULL, :tenant::uuid);

-- Change order requests (3) - post-lock changes flowing through COR workflow
INSERT INTO eto_mode_changeorderrequest (id, sales_order_id, number, reason, status, submitted_by, submitted_at, cost_impact, schedule_impact_days, approved_at, tenant_id) VALUES
('b3d9a0a0-0000-4000-8000-000000000001',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 'COR-DEMO-0001', 'Client requested upgrade of hood extraction from 8000 to 11000 CMH after chef consultation; larger blower and duct rework needed.',
 'implemented', 'b3000000-0000-4000-8000-000000009002', '2026-03-02 09:40:00+05:30', 185000.00, 7, '2026-03-06 15:20:00+05:30', :tenant::uuid),
('b3d9a0a0-0000-4000-8000-000000000002',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 'COR-DEMO-0002', 'Change dishwash line from single to double rack conveyor per revised banquet capacity of 1200 covers.',
 'approved', 'b3000000-0000-4000-8000-000000009002', '2026-06-10 14:15:00+05:30', 320000.00, 14, '2026-06-18 11:05:00+05:30', :tenant::uuid),
('b3d9a0a0-0000-4000-8000-000000000003',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0005'), 'b3d95000-0000-4000-8000-000000000005'::uuid),
 'COR-DEMO-0003', 'Substitute imported burner assembly with BIS-certified local equivalent due to import lead time slip.',
 'cost_impact_pending', 'b3000000-0000-4000-8000-000000009003', '2026-08-28 16:50:00+05:30', NULL, NULL, NULL, :tenant::uuid);

-- Liquidated damages terms (1)
INSERT INTO eto_mode_liquidateddamages (id, sales_order_id, per_day_amount, cap_percentage, applied_amount, tenant_id) VALUES
('b3d9a2a2-0000-4000-8000-000000000001',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 25000.00, 10.00, 0.00, :tenant::uuid);

-- Milestone billing schedule (2 rows; unique on tenant+sales_order+milestone_code)
INSERT INTO eto_mode_milestonebillingschedule (id, sales_order_id, milestone_code, description, percentage, target_date, invoiced_at, invoice_ref, tenant_id) VALUES
('b3d9a3a3-0000-4000-8000-000000000001',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 'MS-ADVANCE', 'Advance on order confirmation and design sign-off', 30.00, '2026-02-20', '2026-02-21 12:00:00+05:30', 'INV-DEMO-2026-0119', :tenant::uuid),
('b3d9a3a3-0000-4000-8000-000000000002',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 'MS-HANDOVER', 'Balance on commissioning handover certificate', 20.00, '2026-05-05', NULL, '', :tenant::uuid);

-- Project <-> work order link (1); project_id soft-references project_project
-- (seeded by file 45; UUID column, no FK constraint, so ordering is safe)
INSERT INTO eto_mode_projectworkorderlink (id, sales_order_id, project_id, wbs_node_id, created_at, tenant_id) VALUES
('b3d9a6a6-0000-4000-8000-000000000001',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 'b3d97000-0000-4000-8000-000000000001', NULL, '2026-02-17 09:00:00+05:30', :tenant::uuid);

-- Retention policy (1)
INSERT INTO eto_mode_retentionpolicy (id, sales_order_id, retention_percentage, release_on_milestone, retention_amount, released_at, tenant_id) VALUES
('b3d9a4a4-0000-4000-8000-000000000001',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 5.00, 'MS-HANDOVER', 262500.00, NULL, :tenant::uuid);

-- Site surveys (3)
INSERT INTO eto_mode_sitesurvey (id, sales_order_id, scheduled_date, surveyed_at, surveyor_user_id, findings, status, tenant_id) VALUES
('b3d9a5a5-0000-4000-8000-000000000001',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'), 'b3d95000-0000-4000-8000-000000000003'::uuid),
 '2026-01-19', '2026-01-19 15:30:00+05:30', 'b3000000-0000-4000-8000-000000009003',
 '{"ceiling_height_mm": 3600, "floor": "kota stone, drainage OK", "lpg_bank": "existing 12x47.5kg manifold", "power": "3-phase 100A available", "constraints": ["service lift max 1.8m", "night-shift installation only"]}'::jsonb,
 'completed', :tenant::uuid),
('b3d9a5a5-0000-4000-8000-000000000002',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0005'), 'b3d95000-0000-4000-8000-000000000005'::uuid),
 '2026-04-14', '2026-04-14 12:00:00+05:30', 'b3000000-0000-4000-8000-000000009002',
 '{"ceiling_height_mm": 3200, "floor": "epoxy, minor regrading near drain", "power": "3-phase 63A, DG backup", "constraints": ["duct route crosses fire zone - damper required"]}'::jsonb,
 'completed', :tenant::uuid),
('b3d9a5a5-0000-4000-8000-000000000003',
 COALESCE((SELECT id FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0007'), 'b3d95000-0000-4000-8000-000000000007'::uuid),
 '2026-09-16', NULL, 'b3000000-0000-4000-8000-000000009003',
 '{}'::jsonb,
 'scheduled', :tenant::uuid);

-- =============================================================================
-- End of 42_django_production.sql
-- =============================================================================
