-- Demo seed — Django/OptiForge PLATFORM tables for B3 MACBIS (21 tables).
--   project_project, project_milestone, project_wbsnode, project_resourceallocation
--   support_kbarticle, support_supportticket
--   documents_documentclass, documents_document, documents_documentrevision,
--   documents_documentocrindex
--   notifications_notificationtemplate, notifications_notificationpreference,
--   notifications_notificationdelivery
--   workflow_workflowdefinition, workflow_workflowinstance, workflow_workflowinsertion
--   integration_scheduledsync, integration_webhookinboundlog
--   it_admin_adminauditlog, it_admin_tenantconfigsetting
--   api_gateway_idempotencyrecord
--
-- Depends on 38_django_foundation.sql (tenancy_tenant anchor + hr_employee) and
-- mirrors the NestJS demo rows where the two backends overlap:
--   * project_project mirrors "projects" rows PRJ-2026-0001/0005/0006
--   * support_supportticket mirrors the themes of NestJS support_tickets (TKT-SLA-*)
--     but uses its own TKT-DJ-* number series (separate table, separate sequence)
--
-- Idempotent: DELETE-then-INSERT, children before parents. Delete predicates:
--   * tenant-scoped tables ............... tenant_id = :tenant
--   * documents_documentrevision ......... via subselect on this tenant's documents
--   * documents_documentclass (global,
--     no tenant_id column) ............... code IN ('DRAWING','CONTRACT','CERTIFICATE')
--   * workflow_workflowdefinition and
--     workflow_workflowinsertion (global,
--     no tenant_id column) ............... workflow_id IN ('po-approval',
--                                          'ncr-disposition','leave-approval')
--
-- All ids are deterministic UUIDs (b3aX/b3bX prefixes) so re-runs are stable.
-- auth_user PKs are integers (9001-9003); the Django platform tables carry
-- free-standing UUID user refs, so the three demo users are represented by the
-- deterministic UUIDs b3900000-0000-4000-8000-00000000900{1,2,3} (admin, demo,
-- sarah.mitchell). Choice values come from the Django models (READ from
-- backend/optiforge): project.status planning|active|on_hold|completed|cancelled;
-- ticket priority p1..p4, status open|pending|resolved|closed|cancelled;
-- document status active|archived; sync status active|paused; notification
-- channels email|sms|push|in_app, delivery status queued|sent|failed|bounced|
-- suppressed; workflow instance status running|completed|failed.

\set tenant '''b3000000-0000-4000-8000-000000000001'''

SET CONSTRAINTS ALL IMMEDIATE;

-- ---------------------------------------------------------------------------
-- Deletes — children first
-- ---------------------------------------------------------------------------
DELETE FROM api_gateway_idempotencyrecord WHERE tenant_id = :tenant;
DELETE FROM it_admin_tenantconfigsetting  WHERE tenant_id = :tenant;
DELETE FROM it_admin_adminauditlog        WHERE tenant_id = :tenant;
DELETE FROM integration_webhookinboundlog WHERE tenant_id = :tenant;
DELETE FROM integration_scheduledsync     WHERE tenant_id = :tenant;
DELETE FROM workflow_workflowinsertion
  WHERE workflow_id IN ('po-approval','ncr-disposition','leave-approval');
DELETE FROM workflow_workflowinstance     WHERE tenant_id = :tenant;
DELETE FROM workflow_workflowdefinition
  WHERE workflow_id IN ('po-approval','ncr-disposition','leave-approval');
DELETE FROM notifications_notificationdelivery   WHERE tenant_id = :tenant;
DELETE FROM notifications_notificationpreference WHERE tenant_id = :tenant;
DELETE FROM notifications_notificationtemplate   WHERE tenant_id = :tenant;
DELETE FROM documents_documentocrindex    WHERE tenant_id = :tenant;
DELETE FROM documents_documentrevision
  WHERE document_id IN (SELECT id FROM documents_document WHERE tenant_id = :tenant);
DELETE FROM documents_document            WHERE tenant_id = :tenant;
DELETE FROM documents_documentclass
  WHERE code IN ('DRAWING','CONTRACT','CERTIFICATE');
DELETE FROM support_supportticket         WHERE tenant_id = :tenant;
DELETE FROM support_kbarticle             WHERE tenant_id = :tenant;
DELETE FROM project_resourceallocation    WHERE tenant_id = :tenant;
DELETE FROM project_milestone             WHERE tenant_id = :tenant;
DELETE FROM project_wbsnode               WHERE tenant_id = :tenant;
DELETE FROM project_project               WHERE tenant_id = :tenant;

-- ---------------------------------------------------------------------------
-- project_project — 3 projects mirroring NestJS "projects" rows
-- ---------------------------------------------------------------------------
INSERT INTO project_project
  (id, tenant_id, code, name, status, start_date, target_end_date, actual_end_date, created_at)
VALUES
  ('b3a10000-0000-4000-8000-000000000001', :tenant, 'PRJ-2026-0001', 'Industrial Kitchen 2026',        'active',   '2026-01-15', '2026-06-30', NULL, '2026-01-10 08:30:00+00'),
  ('b3a10000-0000-4000-8000-000000000002', :tenant, 'PRJ-2026-0005', 'Solar Panel Array Installation', 'active',   '2026-02-20', '2026-08-31', NULL, '2026-02-12 10:15:00+00'),
  ('b3a10000-0000-4000-8000-000000000003', :tenant, 'PRJ-2026-0006', 'Automation Line Upgrade',        'planning', '2026-05-04', '2026-12-15', NULL, '2026-03-25 09:33:00+00');

-- ---------------------------------------------------------------------------
-- project_wbsnode — 12 nodes (root + leaves per project); parents before children
-- ---------------------------------------------------------------------------
INSERT INTO project_wbsnode
  (id, tenant_id, project_id, parent_id, code, name, sequence, is_leaf, planned_effort_hours)
VALUES
  -- PRJ-2026-0001 Industrial Kitchen 2026 (root + 4 leaves)
  ('b3a20000-0000-4000-8000-000000000001', :tenant, 'b3a10000-0000-4000-8000-000000000001', NULL,                                   'WBS-1',   'Kitchen Fitout — Grand Hyatt New Wing', 1, false, 1520.00),
  ('b3a20000-0000-4000-8000-000000000002', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'b3a20000-0000-4000-8000-000000000001', 'WBS-1.1', 'Design & Shop Drawings',                1, true,   240.00),
  ('b3a20000-0000-4000-8000-000000000003', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'b3a20000-0000-4000-8000-000000000001', 'WBS-1.2', 'SS Fabrication — Cook Line & Counters', 2, true,   640.00),
  ('b3a20000-0000-4000-8000-000000000004', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'b3a20000-0000-4000-8000-000000000001', 'WBS-1.3', 'Site Installation & MEP Hook-up',       3, true,   480.00),
  ('b3a20000-0000-4000-8000-000000000005', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'b3a20000-0000-4000-8000-000000000001', 'WBS-1.4', 'Testing, Commissioning & Handover',     4, true,   160.00),
  -- PRJ-2026-0005 Solar Panel Array (root + 3 leaves)
  ('b3a20000-0000-4000-8000-000000000006', :tenant, 'b3a10000-0000-4000-8000-000000000002', NULL,                                   'WBS-1',   'Solar Array — Jebel Ali Rooftop',       1, false,  900.00),
  ('b3a20000-0000-4000-8000-000000000007', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'b3a20000-0000-4000-8000-000000000006', 'WBS-1.1', 'Structural Survey & Mounting Design',   1, true,   180.00),
  ('b3a20000-0000-4000-8000-000000000008', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'b3a20000-0000-4000-8000-000000000006', 'WBS-1.2', 'Panel Mounting & Cabling',              2, true,   520.00),
  ('b3a20000-0000-4000-8000-000000000009', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'b3a20000-0000-4000-8000-000000000006', 'WBS-1.3', 'Inverter Commissioning & Grid Sync',    3, true,   200.00),
  -- PRJ-2026-0006 Automation Line Upgrade (root + 2 leaves, planning)
  ('b3a20000-0000-4000-8000-000000000010', :tenant, 'b3a10000-0000-4000-8000-000000000003', NULL,                                   'WBS-1',   'Automation Line Upgrade — Sharjah',     1, false,  760.00),
  ('b3a20000-0000-4000-8000-000000000011', :tenant, 'b3a10000-0000-4000-8000-000000000003', 'b3a20000-0000-4000-8000-000000000010', 'WBS-1.1', 'Requirements & PLC Architecture',       1, true,   280.00),
  ('b3a20000-0000-4000-8000-000000000012', :tenant, 'b3a10000-0000-4000-8000-000000000003', 'b3a20000-0000-4000-8000-000000000010', 'WBS-1.2', 'Conveyor Retrofit Detailed Design',     2, true,   480.00);

-- ---------------------------------------------------------------------------
-- project_milestone — 9 milestones (invoice % totals 100 per project)
-- ---------------------------------------------------------------------------
INSERT INTO project_milestone
  (id, tenant_id, project_id, name, target_date, achieved_date, invoice_percentage)
VALUES
  ('b3a30000-0000-4000-8000-000000000001', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'Design sign-off',                '2026-02-15', '2026-02-18', 10.00),
  ('b3a30000-0000-4000-8000-000000000002', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'Fabrication complete',           '2026-04-15', '2026-04-22', 40.00),
  ('b3a30000-0000-4000-8000-000000000003', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'Delivery & installation done',   '2026-06-01', NULL,         30.00),
  ('b3a30000-0000-4000-8000-000000000004', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'Commissioning & handover',       '2026-06-30', NULL,         20.00),
  ('b3a30000-0000-4000-8000-000000000005', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'Mounting design approved',       '2026-03-20', '2026-03-19', 20.00),
  ('b3a30000-0000-4000-8000-000000000006', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'All panels mounted',             '2026-06-30', NULL,         50.00),
  ('b3a30000-0000-4000-8000-000000000007', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'Grid synchronisation complete',  '2026-08-31', NULL,         30.00),
  ('b3a30000-0000-4000-8000-000000000008', :tenant, 'b3a10000-0000-4000-8000-000000000003', 'PLC architecture frozen',        '2026-07-15', NULL,         30.00),
  ('b3a30000-0000-4000-8000-000000000009', :tenant, 'b3a10000-0000-4000-8000-000000000003', 'Retrofit design package issued', '2026-10-30', NULL,         70.00);

-- ---------------------------------------------------------------------------
-- project_resourceallocation — 8 allocations to hr_employee (resource_ref
-- carries the employee_number + name; wbs_node_id always a leaf node)
-- ---------------------------------------------------------------------------
INSERT INTO project_resourceallocation
  (id, tenant_id, project_id, wbs_node_id, resource_ref, hours, start_date, end_date)
VALUES
  ('b3a40000-0000-4000-8000-000000000001', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'b3a20000-0000-4000-8000-000000000002', 'EMP0003 Anita Desai',    240.00, '2026-01-15', '2026-02-15'),
  ('b3a40000-0000-4000-8000-000000000002', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'b3a20000-0000-4000-8000-000000000003', 'EMP0005 Suresh Patel',   320.00, '2026-02-20', '2026-04-15'),
  ('b3a40000-0000-4000-8000-000000000003', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'b3a20000-0000-4000-8000-000000000003', 'EMP0007 Amit Verma',     320.00, '2026-02-20', '2026-04-15'),
  ('b3a40000-0000-4000-8000-000000000004', :tenant, 'b3a10000-0000-4000-8000-000000000001', 'b3a20000-0000-4000-8000-000000000004', 'EMP0010 Ravi Menon',     480.00, '2026-04-25', '2026-06-01'),
  ('b3a40000-0000-4000-8000-000000000005', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'b3a20000-0000-4000-8000-000000000007', 'EMP0004 Vikram Singh',   180.00, '2026-02-20', '2026-03-20'),
  ('b3a40000-0000-4000-8000-000000000006', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'b3a20000-0000-4000-8000-000000000008', 'EMP0013 Mohan Das',      520.00, '2026-03-25', '2026-06-30'),
  ('b3a40000-0000-4000-8000-000000000007', :tenant, 'b3a10000-0000-4000-8000-000000000002', 'b3a20000-0000-4000-8000-000000000009', 'EMP0015 Arun Gupta',     200.00, '2026-07-01', '2026-08-31'),
  ('b3a40000-0000-4000-8000-000000000008', :tenant, 'b3a10000-0000-4000-8000-000000000003', 'b3a20000-0000-4000-8000-000000000011', 'EMP0017 Sanjay Malhotra',280.00, '2026-05-04', '2026-07-15');

-- ---------------------------------------------------------------------------
-- support_kbarticle — 8 kitchen-equipment troubleshooting articles
-- ---------------------------------------------------------------------------
INSERT INTO support_kbarticle
  (id, tenant_id, slug, title, body, category, is_published, updated_at)
VALUES
  ('b3a50000-0000-4000-8000-000000000001', :tenant, 'combi-oven-e04-steam-fault',       'Combi Oven E04 steam generator fault',           'E04 indicates scale build-up in the steam generator. Run the descale cycle (menu > service > descale), check inlet water hardness is below 7 dGH, and replace the boiler gasket if the fault persists after two cycles.', 'troubleshooting', true,  '2025-10-06 09:12:00+00'),
  ('b3a50000-0000-4000-8000-000000000002', :tenant, 'blast-chiller-slow-pulldown',      'Blast chiller slow pull-down diagnosis',         'If a 90-minute pull-down exceeds spec: 1) clean the condenser coil, 2) verify door gasket seal with the paper test, 3) confirm ambient is below 32 C, 4) check refrigerant sight glass for bubbles and call service if flashing.', 'troubleshooting', true,  '2025-11-14 14:40:00+00'),
  ('b3a50000-0000-4000-8000-000000000003', :tenant, 'dishwasher-rinse-temp-low',        'Hood dishwasher final rinse below 82 C',         'Low rinse temperature is usually the booster heater contactor or a scaled heating element. Check the booster breaker, measure element resistance (18-22 ohm expected), and descale with the recommended solution quarterly.', 'troubleshooting', true,  '2025-12-02 11:05:00+00'),
  ('b3a50000-0000-4000-8000-000000000004', :tenant, 'griddle-uneven-heating',           'Griddle plate heating unevenly',                 'Uneven browning across the plate points to a failed element zone or a drifted thermostat. Map cold zones with an IR gun at 200 C setpoint; a >25 C spread means the affected element or its thermostat needs replacement.', 'troubleshooting', true,  '2026-01-09 10:22:00+00'),
  ('b3a50000-0000-4000-8000-000000000005', :tenant, 'walkin-cold-room-ice-buildup',     'Walk-in cold room ice build-up on evaporator',   'Ice on the evaporator means a defrost failure or door left ajar. Verify defrost timer settings (4 cycles/day, 30 min), test the defrost heater continuity, and inspect door closer and strip curtains.', 'troubleshooting', true,  '2026-02-18 16:30:00+00'),
  ('b3a50000-0000-4000-8000-000000000006', :tenant, 'exhaust-hood-low-airflow',         'Exhaust hood low airflow checklist',             'Low capture at the hood: clean baffle filters (weekly), check belt tension on the extract fan, confirm make-up air unit is running, and re-balance if duct static exceeds design by 20%.', 'maintenance',     true,  '2026-04-07 08:55:00+00'),
  ('b3a50000-0000-4000-8000-000000000007', :tenant, 'fryer-oil-life-best-practice',     'Extending fryer oil life',                       'Filter oil twice daily, hold idle temperature at 130 C, top up rather than fully replace, and use test strips to change oil at 25% total polar materials. Never salt food over the vat.', 'best-practice',   true,  '2026-06-12 13:15:00+00'),
  ('b3a50000-0000-4000-8000-000000000008', :tenant, 'ss-counter-corrosion-prevention',  'Preventing corrosion on SS-304 counters',        'Draft: chloride-based cleaners attack SS-304 welds. Recommend neutral pH cleaner, immediate rinse after sanitiser contact, and passivation of field welds during installation.', 'best-practice',   false, '2026-08-20 15:48:00+00');

-- ---------------------------------------------------------------------------
-- support_supportticket — 6 tickets, themes mirroring NestJS support_tickets
-- (customer_account_id is a free UUID ref; deterministic demo account ids)
-- ---------------------------------------------------------------------------
INSERT INTO support_supportticket
  (id, tenant_id, number, customer_account_id, installed_unit_id, subject, description,
   priority, status, dispatched_service_id, created_at, resolved_at)
VALUES
  ('b3a60000-0000-4000-8000-000000000001', :tenant, 'TKT-DJ-0001', 'b3c00000-0000-4000-8000-000000000001', 'b3c10000-0000-4000-8000-000000000001', 'Production kitchen line down — main cook line no power',  'Entire cook line at Grand Hyatt banquet kitchen lost power during service. Breaker trips immediately on reset. Site electrician suspects the combi oven feed.', 'p1', 'pending',  'b3c20000-0000-4000-8000-000000000001', '2026-07-02 06:45:00+00', NULL),
  ('b3a60000-0000-4000-8000-000000000002', :tenant, 'TKT-DJ-0002', 'b3c00000-0000-4000-8000-000000000002', 'b3c10000-0000-4000-8000-000000000002', 'Blast chiller connection errors on HACCP logger',         'HACCP data logger drops connection to the blast chiller controller several times a day; temperature audit trail has gaps.', 'p2', 'open',     NULL,                                   '2026-07-18 09:20:00+00', NULL),
  ('b3a60000-0000-4000-8000-000000000003', :tenant, 'TKT-DJ-0003', 'b3c00000-0000-4000-8000-000000000003', NULL,                                   'Feature request: WhatsApp alerts for service dispatch',   'Customer asks for WhatsApp notification when a technician is dispatched, in addition to email.', 'p4', 'open',     NULL,                                   '2026-08-05 12:10:00+00', NULL),
  ('b3a60000-0000-4000-8000-000000000004', :tenant, 'TKT-DJ-0004', 'b3c00000-0000-4000-8000-000000000001', NULL,                                   'Portal login issue for site facilities team',             'Two facilities users cannot log into the customer portal after the password policy change; reset links expire before delivery.', 'p2', 'resolved', NULL,                                   '2026-08-12 08:05:00+00', '2026-08-13 15:30:00+00'),
  ('b3a60000-0000-4000-8000-000000000005', :tenant, 'TKT-DJ-0005', 'b3c00000-0000-4000-8000-000000000002', 'b3c10000-0000-4000-8000-000000000003', 'Monthly service report not generating',                   'The scheduled PDF service report for August did not arrive; on-demand generation from the portal times out.', 'p3', 'open',     NULL,                                   '2026-09-01 10:40:00+00', NULL),
  ('b3a60000-0000-4000-8000-000000000006', :tenant, 'TKT-DJ-0006', 'b3c00000-0000-4000-8000-000000000003', 'b3c10000-0000-4000-8000-000000000004', 'Dishwasher rinse temperature alarm — recurring',          'Final rinse temperature alarm triggers every morning on the flight-type dishwasher. Resolved after descaling booster heater and replacing element.', 'p2', 'closed',   'b3c20000-0000-4000-8000-000000000002', '2026-05-22 07:30:00+00', '2026-05-26 17:00:00+00');

-- ---------------------------------------------------------------------------
-- documents_documentclass — 3 classes (GLOBAL table: no tenant_id column)
-- ---------------------------------------------------------------------------
INSERT INTO documents_documentclass
  (id, code, name, retention_days, description)
VALUES
  ('b3a70000-0000-4000-8000-000000000001', 'DRAWING',     'Engineering Drawing',    3650, 'Shop drawings, GA drawings and fabrication drawings. Retained 10 years.'),
  ('b3a70000-0000-4000-8000-000000000002', 'CONTRACT',    'Contract & Agreement',   2555, 'Customer contracts, subcontracts and NDAs. Retained 7 years.'),
  ('b3a70000-0000-4000-8000-000000000003', 'CERTIFICATE', 'Certificate',            1825, 'Material, calibration, and compliance certificates. Retained 5 years.');

-- ---------------------------------------------------------------------------
-- documents_document — 8 documents (2 archived)
-- ---------------------------------------------------------------------------
INSERT INTO documents_document
  (id, tenant_id, document_class_id, title, status, checked_out_by, checked_out_until,
   archived_at, created_at, updated_at)
VALUES
  ('b3a80000-0000-4000-8000-000000000001', :tenant, 'b3a70000-0000-4000-8000-000000000001', 'PRJ-2026-0001 Kitchen GA drawing — Level 2 banquet',   'active',   NULL, NULL, NULL, '2026-01-20 09:00:00+00', '2026-02-18 11:30:00+00'),
  ('b3a80000-0000-4000-8000-000000000002', :tenant, 'b3a70000-0000-4000-8000-000000000001', 'PRJ-2026-0001 Cook line fabrication drawing set',      'active',   'b3900000-0000-4000-8000-000000009003', '2026-09-12 17:00:00+00', NULL, '2026-02-25 10:20:00+00', '2026-09-08 09:45:00+00'),
  ('b3a80000-0000-4000-8000-000000000003', :tenant, 'b3a70000-0000-4000-8000-000000000001', 'PRJ-2026-0005 Rooftop mounting layout',                'active',   NULL, NULL, NULL, '2026-03-05 14:10:00+00', '2026-03-19 16:00:00+00'),
  ('b3a80000-0000-4000-8000-000000000004', :tenant, 'b3a70000-0000-4000-8000-000000000002', 'Grand Hyatt Dubai — supply & install contract',        'active',   NULL, NULL, NULL, '2026-01-08 12:00:00+00', '2026-01-08 12:00:00+00'),
  ('b3a80000-0000-4000-8000-000000000005', :tenant, 'b3a70000-0000-4000-8000-000000000002', 'GreenEnergy Co — solar EPC subcontract',               'active',   NULL, NULL, NULL, '2026-02-15 09:30:00+00', '2026-02-16 08:10:00+00'),
  ('b3a80000-0000-4000-8000-000000000006', :tenant, 'b3a70000-0000-4000-8000-000000000003', 'SS-304 material test certificate — heat 88412',        'active',   NULL, NULL, NULL, '2026-03-12 11:45:00+00', '2026-03-12 11:45:00+00'),
  ('b3a80000-0000-4000-8000-000000000007', :tenant, 'b3a70000-0000-4000-8000-000000000003', 'Calibration certificate — combi oven probe kit 2025',  'archived', NULL, NULL, '2026-06-30 10:00:00+00', '2025-10-10 10:00:00+00', '2026-06-30 10:00:00+00'),
  ('b3a80000-0000-4000-8000-000000000008', :tenant, 'b3a70000-0000-4000-8000-000000000002', 'AutoParts Ltd — NDA (superseded draft)',               'archived', NULL, NULL, '2026-05-15 09:00:00+00', '2026-03-26 15:20:00+00', '2026-05-15 09:00:00+00');

-- ---------------------------------------------------------------------------
-- documents_documentrevision — 10 revisions (docs 1 and 2 have two revisions)
-- content holds tiny inline demo bytes (PDF/PNG/DWG magic headers)
-- ---------------------------------------------------------------------------
INSERT INTO documents_documentrevision
  (id, document_id, rev_number, mime_type, size_bytes, content, storage_key, created_by, created_at)
VALUES
  ('b3a90000-0000-4000-8000-000000000001', 'b3a80000-0000-4000-8000-000000000001', 1, 'application/pdf',  482133,  '\x255044462d312e34', 's3://b3-docs/prj-2026-0001/ga-l2-banquet-rev1.pdf',  'b3900000-0000-4000-8000-000000009003', '2026-01-20 09:00:00+00'),
  ('b3a90000-0000-4000-8000-000000000002', 'b3a80000-0000-4000-8000-000000000001', 2, 'application/pdf',  507220,  '\x255044462d312e34', 's3://b3-docs/prj-2026-0001/ga-l2-banquet-rev2.pdf',  'b3900000-0000-4000-8000-000000009003', '2026-02-18 11:30:00+00'),
  ('b3a90000-0000-4000-8000-000000000003', 'b3a80000-0000-4000-8000-000000000002', 1, 'application/acad', 1249850, '\x414331303332',     's3://b3-docs/prj-2026-0001/cookline-fab-rev1.dwg',   'b3900000-0000-4000-8000-000000009003', '2026-02-25 10:20:00+00'),
  ('b3a90000-0000-4000-8000-000000000004', 'b3a80000-0000-4000-8000-000000000002', 2, 'application/acad', 1301444, '\x414331303332',     's3://b3-docs/prj-2026-0001/cookline-fab-rev2.dwg',   'b3900000-0000-4000-8000-000000009001', '2026-09-08 09:45:00+00'),
  ('b3a90000-0000-4000-8000-000000000005', 'b3a80000-0000-4000-8000-000000000003', 1, 'application/pdf',  356098,  '\x255044462d312e35', 's3://b3-docs/prj-2026-0005/roof-mounting-rev1.pdf',  'b3900000-0000-4000-8000-000000009002', '2026-03-05 14:10:00+00'),
  ('b3a90000-0000-4000-8000-000000000006', 'b3a80000-0000-4000-8000-000000000004', 1, 'application/pdf',  918273,  '\x255044462d312e37', 's3://b3-docs/contracts/grand-hyatt-supply-install.pdf', 'b3900000-0000-4000-8000-000000009001', '2026-01-08 12:00:00+00'),
  ('b3a90000-0000-4000-8000-000000000007', 'b3a80000-0000-4000-8000-000000000005', 1, 'application/pdf',  654311,  '\x255044462d312e37', 's3://b3-docs/contracts/greenenergy-epc-sub.pdf',     'b3900000-0000-4000-8000-000000009001', '2026-02-15 09:30:00+00'),
  ('b3a90000-0000-4000-8000-000000000008', 'b3a80000-0000-4000-8000-000000000006', 1, 'application/pdf',  128455,  '\x255044462d312e34', 's3://b3-docs/certs/ss304-mtc-heat-88412.pdf',        'b3900000-0000-4000-8000-000000009002', '2026-03-12 11:45:00+00'),
  ('b3a90000-0000-4000-8000-000000000009', 'b3a80000-0000-4000-8000-000000000007', 1, 'image/png',        88214,   '\x89504e470d0a1a0a', 's3://b3-docs/certs/combi-probe-calibration-2025.png','b3900000-0000-4000-8000-000000009002', '2025-10-10 10:00:00+00'),
  ('b3a90000-0000-4000-8000-000000000010', 'b3a80000-0000-4000-8000-000000000008', 1, 'application/pdf',  74102,   '\x255044462d312e36', 's3://b3-docs/contracts/autoparts-nda-draft.pdf',     'b3900000-0000-4000-8000-000000009001', '2026-03-26 15:20:00+00');

-- ---------------------------------------------------------------------------
-- documents_documentocrindex — 4 rows (revision_id is UNIQUE)
-- ---------------------------------------------------------------------------
INSERT INTO documents_documentocrindex
  (id, tenant_id, revision_id, extracted_text, lang, created_at)
VALUES
  ('b3aa0000-0000-4000-8000-000000000001', :tenant, 'b3a90000-0000-4000-8000-000000000002', 'GENERAL ARRANGEMENT — LEVEL 2 BANQUET KITCHEN. Grand Hyatt Dubai new wing. Scale 1:50. Cook line, plating line, dishwash area, cold rooms. Rev 2 incorporates client comments dated 2026-02-10.', 'en', '2026-02-18 12:05:00+00'),
  ('b3aa0000-0000-4000-8000-000000000002', :tenant, 'b3a90000-0000-4000-8000-000000000006', 'SUPPLY AND INSTALLATION CONTRACT between Grand Hyatt Dubai and B3 MACBIS for the design, fabrication, delivery, installation and commissioning of commercial kitchen equipment. Contract value payable per milestone schedule Annex C.', 'en', '2026-01-08 12:30:00+00'),
  ('b3aa0000-0000-4000-8000-000000000003', :tenant, 'b3a90000-0000-4000-8000-000000000008', 'MATERIAL TEST CERTIFICATE EN 10204 3.1 — Stainless steel grade 304, heat number 88412. Chemical composition and mechanical properties conform to ASTM A240.', 'en', '2026-03-12 12:10:00+00'),
  ('b3aa0000-0000-4000-8000-000000000004', :tenant, 'b3a90000-0000-4000-8000-000000000009', 'CALIBRATION CERTIFICATE — Combi oven core temperature probe kit, serial CP-2025-114. Calibrated against reference thermometer traceable to NIST. Max deviation 0.3 C at 75 C.', 'en', '2025-10-10 10:30:00+00');

-- ---------------------------------------------------------------------------
-- notifications_notificationtemplate — 6 tenant-scoped templates
-- ---------------------------------------------------------------------------
INSERT INTO notifications_notificationtemplate
  (id, tenant_id, event_type, channel, locale, version, subject, body,
   is_transactional, is_active, created_at)
VALUES
  ('b3ab0000-0000-4000-8000-000000000001', :tenant, 'sales.order.confirmed',    'email',  'en', 1, 'Order {{order_number}} confirmed',                'Dear {{customer_name}}, your order {{order_number}} totalling {{amount}} has been confirmed. Expected delivery: {{delivery_date}}.', true,  true, '2025-10-02 09:00:00+00'),
  ('b3ab0000-0000-4000-8000-000000000002', :tenant, 'production.wo.released',   'in_app', 'en', 1, 'Work order {{wo_number}} released',               'Work order {{wo_number}} for {{item_name}} has been released to the shop floor. Planned start {{start_date}}.', true,  true, '2025-10-02 09:05:00+00'),
  ('b3ab0000-0000-4000-8000-000000000003', :tenant, 'finance.invoice.overdue',  'email',  'en', 1, 'Invoice {{invoice_number}} is overdue',           'Invoice {{invoice_number}} for {{amount}} was due on {{due_date}} and is now {{days_overdue}} days overdue. Please arrange payment.', true,  true, '2025-10-02 09:10:00+00'),
  ('b3ab0000-0000-4000-8000-000000000004', :tenant, 'hr.leave.approved',        'in_app', 'en', 1, 'Leave request approved',                          'Your leave request from {{from_date}} to {{to_date}} has been approved by {{approver_name}}.', true,  true, '2025-11-15 10:00:00+00'),
  ('b3ab0000-0000-4000-8000-000000000005', :tenant, 'support.ticket.assigned',  'email',  'en', 1, 'Ticket {{ticket_number}} assigned to you',        'Support ticket {{ticket_number}} ({{subject}}, priority {{priority}}) has been assigned to you. SLA response due {{sla_due}}.', true,  true, '2026-01-20 08:30:00+00'),
  ('b3ab0000-0000-4000-8000-000000000006', :tenant, 'procurement.po.approved',  'in_app', 'en', 1, 'PO {{po_number}} approved',                       'Purchase order {{po_number}} to {{vendor_name}} for {{amount}} has been approved and dispatched to the vendor.', true,  true, '2026-02-10 11:00:00+00');

-- ---------------------------------------------------------------------------
-- notifications_notificationpreference — 6 rows (3 demo users x 2 channels)
-- user_id UUIDs are the deterministic demo-user ids (auth_user PKs are ints)
-- ---------------------------------------------------------------------------
INSERT INTO notifications_notificationpreference
  (id, tenant_id, user_id, channel, event_type, opted_in, updated_at)
VALUES
  ('b3ac0000-0000-4000-8000-000000000001', :tenant, 'b3900000-0000-4000-8000-000000009001', 'email',  'finance.invoice.overdue',  true,  '2025-10-05 09:00:00+00'),
  ('b3ac0000-0000-4000-8000-000000000002', :tenant, 'b3900000-0000-4000-8000-000000009001', 'in_app', 'procurement.po.approved',  true,  '2025-10-05 09:01:00+00'),
  ('b3ac0000-0000-4000-8000-000000000003', :tenant, 'b3900000-0000-4000-8000-000000009002', 'email',  'sales.order.confirmed',    true,  '2025-12-01 14:20:00+00'),
  ('b3ac0000-0000-4000-8000-000000000004', :tenant, 'b3900000-0000-4000-8000-000000009002', 'in_app', 'production.wo.released',   false, '2026-03-14 10:45:00+00'),
  ('b3ac0000-0000-4000-8000-000000000005', :tenant, 'b3900000-0000-4000-8000-000000009003', 'email',  'support.ticket.assigned',  true,  '2026-01-22 08:00:00+00'),
  ('b3ac0000-0000-4000-8000-000000000006', :tenant, 'b3900000-0000-4000-8000-000000009003', 'in_app', 'hr.leave.approved',        true,  '2026-01-22 08:01:00+00');

-- ---------------------------------------------------------------------------
-- notifications_notificationdelivery — 10 deliveries (sent/failed/queued mix)
-- ---------------------------------------------------------------------------
INSERT INTO notifications_notificationdelivery
  (id, tenant_id, recipient_user_id, recipient_address, channel, event_type, locale,
   rendered_subject, rendered_body, status, error, template_version, created_at, completed_at)
VALUES
  ('b3ad0000-0000-4000-8000-000000000001', :tenant, 'b3900000-0000-4000-8000-000000009002', 'demo@b3macbis.com',            'email',  'sales.order.confirmed',   'en', 'Order SO-2026-0142 confirmed',              'Dear Grand Hyatt Dubai, your order SO-2026-0142 totalling AED 812,400 has been confirmed. Expected delivery: 2026-05-28.', 'sent',   '',                                              1, '2026-04-03 10:12:00+00', '2026-04-03 10:12:04+00'),
  ('b3ad0000-0000-4000-8000-000000000002', :tenant, 'b3900000-0000-4000-8000-000000009001', 'admin@b3macbis.com',           'email',  'finance.invoice.overdue', 'en', 'Invoice INV-2026-0088 is overdue',          'Invoice INV-2026-0088 for AED 245,000 was due on 2026-05-31 and is now 14 days overdue. Please arrange payment.', 'sent',   '',                                              1, '2026-06-14 08:00:00+00', '2026-06-14 08:00:06+00'),
  ('b3ad0000-0000-4000-8000-000000000003', :tenant, NULL,                                   'ap@greenenergy.example.com',   'email',  'finance.invoice.overdue', 'en', 'Invoice INV-2026-0104 is overdue',          'Invoice INV-2026-0104 for AED 96,500 was due on 2026-07-15 and is now 7 days overdue. Please arrange payment.', 'failed', 'SMTP 550: mailbox unavailable',                 1, '2026-07-22 08:00:00+00', '2026-07-22 08:00:09+00'),
  ('b3ad0000-0000-4000-8000-000000000004', :tenant, 'b3900000-0000-4000-8000-000000009003', 'sarah.mitchell@b3macbis.com',  'email',  'support.ticket.assigned', 'en', 'Ticket TKT-DJ-0001 assigned to you',        'Support ticket TKT-DJ-0001 (Production kitchen line down, priority p1) has been assigned to you. SLA response due 2026-07-02 08:45.', 'sent',   '',                                              1, '2026-07-02 06:46:00+00', '2026-07-02 06:46:03+00'),
  ('b3ad0000-0000-4000-8000-000000000005', :tenant, 'b3900000-0000-4000-8000-000000009003', 'sarah.mitchell@b3macbis.com',  'in_app', 'hr.leave.approved',       'en', 'Leave request approved',                    'Your leave request from 2026-08-24 to 2026-08-28 has been approved by Rajesh Kumar.', 'sent',   '',                                              1, '2026-08-10 12:30:00+00', '2026-08-10 12:30:01+00'),
  ('b3ad0000-0000-4000-8000-000000000006', :tenant, 'b3900000-0000-4000-8000-000000009001', 'admin@b3macbis.com',           'in_app', 'procurement.po.approved', 'en', 'PO PO-2026-0231 approved',                  'Purchase order PO-2026-0231 to Emirates Steel Trading for AED 184,200 has been approved and dispatched to the vendor.', 'sent',   '',                                              1, '2026-05-06 15:22:00+00', '2026-05-06 15:22:01+00'),
  ('b3ad0000-0000-4000-8000-000000000007', :tenant, 'b3900000-0000-4000-8000-000000009002', 'demo@b3macbis.com',            'in_app', 'production.wo.released',  'en', 'Work order WO-2026-057 released',           'Work order WO-2026-057 for SS Counter Assembly has been released to the shop floor. Planned start 2026-03-02.', 'suppressed', 'User opted out of production.wo.released on in_app', 1, '2026-03-01 09:15:00+00', '2026-03-01 09:15:00+00'),
  ('b3ad0000-0000-4000-8000-000000000008', :tenant, NULL,                                   'purchasing@hyatt.example.com', 'email',  'sales.order.confirmed',   'en', 'Order SO-2026-0165 confirmed',              'Dear Grand Hyatt Dubai, your order SO-2026-0165 totalling AED 96,750 has been confirmed. Expected delivery: 2026-09-30.', 'bounced', 'Hard bounce: recipient domain rejected message', 1, '2026-08-19 11:05:00+00', '2026-08-19 11:06:12+00'),
  ('b3ad0000-0000-4000-8000-000000000009', :tenant, 'b3900000-0000-4000-8000-000000009003', 'sarah.mitchell@b3macbis.com',  'email',  'support.ticket.assigned', 'en', 'Ticket TKT-DJ-0005 assigned to you',        'Support ticket TKT-DJ-0005 (Monthly service report not generating, priority p3) has been assigned to you. SLA response due 2026-09-01 14:40.', 'sent',   '',                                              1, '2026-09-01 10:41:00+00', '2026-09-01 10:41:02+00'),
  ('b3ad0000-0000-4000-8000-000000000010', :tenant, 'b3900000-0000-4000-8000-000000009001', 'admin@b3macbis.com',           'email',  'finance.invoice.overdue', 'en', 'Invoice INV-2026-0121 is overdue',          'Invoice INV-2026-0121 for AED 42,000 was due on 2026-08-31 and is now 10 days overdue. Please arrange payment.', 'queued', '',                                              1, '2026-09-10 08:00:00+00', NULL);

-- ---------------------------------------------------------------------------
-- workflow_workflowdefinition — 3 definitions (GLOBAL table: no tenant_id)
-- ---------------------------------------------------------------------------
INSERT INTO workflow_workflowdefinition
  (id, workflow_id, version, owner, definition, is_active, created_at)
VALUES
  ('b3ae0000-0000-4000-8000-000000000001', 'po-approval', '1.0.0', 'procurement',
   '{"start": "draft", "steps": [{"id": "draft", "type": "task", "next": "manager_review"}, {"id": "manager_review", "type": "approval", "role": "procurement_manager", "next": "finance_review"}, {"id": "finance_review", "type": "approval", "role": "finance_controller", "condition": "amount > 50000", "next": "approved"}, {"id": "approved", "type": "end"}], "insertion_points": ["before_finance_review", "after_approval"]}'::jsonb,
   true, '2025-10-03 09:00:00+00'),
  ('b3ae0000-0000-4000-8000-000000000002', 'ncr-disposition', '1.0.0', 'quality',
   '{"start": "raised", "steps": [{"id": "raised", "type": "task", "next": "containment"}, {"id": "containment", "type": "task", "role": "quality_engineer", "next": "disposition"}, {"id": "disposition", "type": "decision", "options": ["rework", "use_as_is", "scrap"], "next": "ca_review"}, {"id": "ca_review", "type": "approval", "role": "quality_manager", "next": "closed"}, {"id": "closed", "type": "end"}], "insertion_points": ["before_disposition", "before_close"]}'::jsonb,
   true, '2025-11-12 10:30:00+00'),
  ('b3ae0000-0000-4000-8000-000000000003', 'leave-approval', '1.0.0', 'hr',
   '{"start": "submitted", "steps": [{"id": "submitted", "type": "task", "next": "supervisor_approval"}, {"id": "supervisor_approval", "type": "approval", "role": "supervisor", "next": "hr_validation"}, {"id": "hr_validation", "type": "task", "role": "hr_officer", "next": "approved"}, {"id": "approved", "type": "end"}], "insertion_points": ["before_hr_validation"]}'::jsonb,
   true, '2026-01-05 08:45:00+00');

-- ---------------------------------------------------------------------------
-- workflow_workflowinstance — 6 instances (running/completed mix)
-- ---------------------------------------------------------------------------
INSERT INTO workflow_workflowinstance
  (id, workflow_id, definition_version, resolved_definition, tenant_id, current_step,
   status, history, context, active_packs, created_at, updated_at)
VALUES
  ('b3af0000-0000-4000-8000-000000000001', 'po-approval', '1.0.0',
   '{"start": "draft", "steps": [{"id": "draft", "type": "task", "next": "manager_review"}, {"id": "manager_review", "type": "approval", "role": "procurement_manager", "next": "finance_review"}, {"id": "finance_review", "type": "approval", "role": "finance_controller", "condition": "amount > 50000", "next": "approved"}, {"id": "approved", "type": "end"}]}'::jsonb,
   :tenant, 'approved', 'completed',
   '[{"step": "draft", "at": "2026-05-04T09:00:00Z", "actor": "demo"}, {"step": "manager_review", "at": "2026-05-05T10:15:00Z", "actor": "sarah.mitchell", "outcome": "approved"}, {"step": "finance_review", "at": "2026-05-06T14:00:00Z", "actor": "admin", "outcome": "approved"}, {"step": "approved", "at": "2026-05-06T15:20:00Z"}]'::jsonb,
   '{"po_number": "PO-2026-0231", "vendor": "Emirates Steel Trading", "amount": 184200, "currency": "AED"}'::jsonb,
   '["kitchen-equipment"]'::jsonb, '2026-05-04 09:00:00+00', '2026-05-06 15:20:00+00'),
  ('b3af0000-0000-4000-8000-000000000002', 'po-approval', '1.0.0',
   '{"start": "draft", "steps": [{"id": "draft", "type": "task", "next": "manager_review"}, {"id": "manager_review", "type": "approval", "role": "procurement_manager", "next": "finance_review"}, {"id": "finance_review", "type": "approval", "role": "finance_controller", "condition": "amount > 50000", "next": "approved"}, {"id": "approved", "type": "end"}]}'::jsonb,
   :tenant, 'finance_review', 'running',
   '[{"step": "draft", "at": "2026-09-08T11:30:00Z", "actor": "demo"}, {"step": "manager_review", "at": "2026-09-09T09:05:00Z", "actor": "sarah.mitchell", "outcome": "approved"}]'::jsonb,
   '{"po_number": "PO-2026-0312", "vendor": "Gulf Refrigeration Supplies", "amount": 96400, "currency": "AED"}'::jsonb,
   '["kitchen-equipment"]'::jsonb, '2026-09-08 11:30:00+00', '2026-09-09 09:05:00+00'),
  ('b3af0000-0000-4000-8000-000000000003', 'ncr-disposition', '1.0.0',
   '{"start": "raised", "steps": [{"id": "raised", "type": "task", "next": "containment"}, {"id": "containment", "type": "task", "role": "quality_engineer", "next": "disposition"}, {"id": "disposition", "type": "decision", "options": ["rework", "use_as_is", "scrap"], "next": "ca_review"}, {"id": "ca_review", "type": "approval", "role": "quality_manager", "next": "closed"}, {"id": "closed", "type": "end"}]}'::jsonb,
   :tenant, 'closed', 'completed',
   '[{"step": "raised", "at": "2026-04-18T08:20:00Z", "actor": "demo"}, {"step": "containment", "at": "2026-04-18T13:00:00Z", "actor": "quality"}, {"step": "disposition", "at": "2026-04-21T10:40:00Z", "outcome": "rework"}, {"step": "ca_review", "at": "2026-04-24T09:10:00Z", "outcome": "approved"}, {"step": "closed", "at": "2026-04-24T09:11:00Z"}]'::jsonb,
   '{"ncr_number": "NCR-2026-0034", "item": "SS counter weld porosity", "work_order": "WO-2026-0057", "disposition": "rework"}'::jsonb,
   '["kitchen-equipment"]'::jsonb, '2026-04-18 08:20:00+00', '2026-04-24 09:11:00+00'),
  ('b3af0000-0000-4000-8000-000000000004', 'ncr-disposition', '1.0.0',
   '{"start": "raised", "steps": [{"id": "raised", "type": "task", "next": "containment"}, {"id": "containment", "type": "task", "role": "quality_engineer", "next": "disposition"}, {"id": "disposition", "type": "decision", "options": ["rework", "use_as_is", "scrap"], "next": "ca_review"}, {"id": "ca_review", "type": "approval", "role": "quality_manager", "next": "closed"}, {"id": "closed", "type": "end"}]}'::jsonb,
   :tenant, 'disposition', 'running',
   '[{"step": "raised", "at": "2026-08-30T14:00:00Z", "actor": "demo"}, {"step": "containment", "at": "2026-08-31T09:30:00Z", "actor": "quality"}]'::jsonb,
   '{"ncr_number": "NCR-2026-0071", "item": "Combi oven door hinge misalignment", "supplier": "Gulf Refrigeration Supplies"}'::jsonb,
   '["kitchen-equipment"]'::jsonb, '2026-08-30 14:00:00+00', '2026-08-31 09:30:00+00'),
  ('b3af0000-0000-4000-8000-000000000005', 'leave-approval', '1.0.0',
   '{"start": "submitted", "steps": [{"id": "submitted", "type": "task", "next": "supervisor_approval"}, {"id": "supervisor_approval", "type": "approval", "role": "supervisor", "next": "hr_validation"}, {"id": "hr_validation", "type": "task", "role": "hr_officer", "next": "approved"}, {"id": "approved", "type": "end"}]}'::jsonb,
   :tenant, 'approved', 'completed',
   '[{"step": "submitted", "at": "2026-08-08T10:00:00Z", "actor": "sarah.mitchell"}, {"step": "supervisor_approval", "at": "2026-08-09T11:20:00Z", "outcome": "approved"}, {"step": "hr_validation", "at": "2026-08-10T12:25:00Z"}, {"step": "approved", "at": "2026-08-10T12:30:00Z"}]'::jsonb,
   '{"employee": "EMP0011 Sunita Rao", "from_date": "2026-08-24", "to_date": "2026-08-28", "leave_type": "annual"}'::jsonb,
   '["kitchen-equipment"]'::jsonb, '2026-08-08 10:00:00+00', '2026-08-10 12:30:00+00'),
  ('b3af0000-0000-4000-8000-000000000006', 'leave-approval', '1.0.0',
   '{"start": "submitted", "steps": [{"id": "submitted", "type": "task", "next": "supervisor_approval"}, {"id": "supervisor_approval", "type": "approval", "role": "supervisor", "next": "hr_validation"}, {"id": "hr_validation", "type": "task", "role": "hr_officer", "next": "approved"}, {"id": "approved", "type": "end"}]}'::jsonb,
   :tenant, 'supervisor_approval', 'running',
   '[{"step": "submitted", "at": "2026-09-09T16:45:00Z", "actor": "demo"}]'::jsonb,
   '{"employee": "EMP0018 Pooja Mehta", "from_date": "2026-09-21", "to_date": "2026-09-23", "leave_type": "casual"}'::jsonb,
   '["kitchen-equipment"]'::jsonb, '2026-09-09 16:45:00+00', '2026-09-09 16:45:00+00');

-- ---------------------------------------------------------------------------
-- workflow_workflowinsertion — 4 pack-injected steps (GLOBAL: no tenant_id;
-- unique on workflow_id + pack_id + insertion_point)
-- ---------------------------------------------------------------------------
INSERT INTO workflow_workflowinsertion
  (id, workflow_id, pack_id, insertion_point, step, load_order, is_active, created_at)
VALUES
  ('b3b10000-0000-4000-8000-000000000001', 'po-approval',     'kitchen-equipment', 'before_finance_review',
   '{"id": "gas-compliance-check", "type": "task", "role": "compliance_officer", "description": "Verify gas-fired equipment lines carry LPG compliance certificates before finance review"}'::jsonb, 10, true,  '2025-10-04 09:30:00+00'),
  ('b3b10000-0000-4000-8000-000000000002', 'po-approval',     'kitchen-equipment', 'after_approval',
   '{"id": "vendor-portal-publish", "type": "system", "action": "publish_po_to_vendor_portal", "description": "Push approved PO to the kitchen-equipment vendor portal"}'::jsonb, 20, true,  '2025-10-04 09:31:00+00'),
  ('b3b10000-0000-4000-8000-000000000003', 'ncr-disposition', 'kitchen-equipment', 'before_disposition',
   '{"id": "food-safety-assessment", "type": "task", "role": "quality_engineer", "description": "Assess food-contact-surface impact (NSF/EN 1672-2) before disposition decision"}'::jsonb, 10, true,  '2025-11-13 10:00:00+00'),
  ('b3b10000-0000-4000-8000-000000000004', 'ncr-disposition', 'kitchen-equipment', 'before_close',
   '{"id": "haccp-record-update", "type": "system", "action": "append_haccp_register", "description": "Append disposition outcome to the HACCP register before closing the NCR"}'::jsonb, 20, false, '2025-11-13 10:01:00+00');

-- ---------------------------------------------------------------------------
-- integration_scheduledsync — 3 connectors (Tally, Keycloak, S3 archive)
-- ---------------------------------------------------------------------------
INSERT INTO integration_scheduledsync
  (id, tenant_id, connector_id, cron_expression, params, status, last_run_at, last_error, created_at)
VALUES
  ('b3b20000-0000-4000-8000-000000000001', :tenant, 'tally-erp',           '0 22 * * *',   '{"company": "B3 MACBIS", "sync": ["ledgers", "vouchers"], "direction": "outbound"}'::jsonb, 'active', '2026-09-09 22:00:14+00', '', '2025-10-06 12:00:00+00'),
  ('b3b20000-0000-4000-8000-000000000002', :tenant, 'keycloak-scim',       '*/30 * * * *', '{"realm": "b3-macbis", "sync": ["users", "groups"], "direction": "inbound"}'::jsonb,        'active', '2026-09-10 07:30:02+00', '', '2025-10-06 12:05:00+00'),
  ('b3b20000-0000-4000-8000-000000000003', :tenant, 's3-document-archive', '0 3 * * 0',    '{"bucket": "b3-docs-archive", "retention_policy": "documentclass", "direction": "outbound"}'::jsonb, 'paused', '2026-08-30 03:00:41+00', 'AccessDenied: archive bucket policy changed on 2026-08-30; awaiting new IAM role', '2026-01-11 09:20:00+00');

-- ---------------------------------------------------------------------------
-- integration_webhookinboundlog — 6 inbound webhook audit rows
-- ---------------------------------------------------------------------------
INSERT INTO integration_webhookinboundlog
  (id, tenant_id, connector_id, body_sha256, accepted, error, received_at)
VALUES
  ('b3b30000-0000-4000-8000-000000000001', :tenant, 'keycloak-scim', '4b227777d4dd1fc61c6f884f48641d02b4d121d3fd328cb08b5531fcacdabf8a', true,  '', '2026-06-02 09:14:11+00'),
  ('b3b30000-0000-4000-8000-000000000002', :tenant, 'keycloak-scim', 'ef2d127de37b942baad06145e54b0c619a1f22327b2ebbcfbec78f5564afe39d', true,  '', '2026-07-11 15:42:37+00'),
  ('b3b30000-0000-4000-8000-000000000003', :tenant, 'tally-erp',     'e7f6c011776e8db7cd330b54174fd76f7d0216b612387a5ffcfb81e6f0919683', true,  '', '2026-08-01 22:05:09+00'),
  ('b3b30000-0000-4000-8000-000000000004', :tenant, 'tally-erp',     '7902699be42c8a8e46fbbb4501726517e86b22c56a189f7625a6da49081b2451', false, 'Signature mismatch: X-Tally-Signature header failed HMAC verification', '2026-08-15 22:04:55+00'),
  ('b3b30000-0000-4000-8000-000000000005', :tenant, 'stripe-payments', '2c624232cdd221771294dfbb310aca000a0df6ac8b66b696d90ef06fdefb64a3', false, 'Unknown connector: no active registration for stripe-payments on this tenant', '2026-09-03 11:19:44+00'),
  ('b3b30000-0000-4000-8000-000000000006', :tenant, 'keycloak-scim', '19581e27de7ced00ff1ce50b2047e7a567c76b1cbaebabe5ef03f7c3017bb5b7', true,  '', '2026-09-10 07:31:26+00');

-- ---------------------------------------------------------------------------
-- it_admin_adminauditlog — 8 admin actions
-- ---------------------------------------------------------------------------
INSERT INTO it_admin_adminauditlog
  (id, tenant_id, actor_user_id, action, target_type, target_id, details, created_at)
VALUES
  ('b3b40000-0000-4000-8000-000000000001', :tenant, 'b3900000-0000-4000-8000-000000009001', 'tenant.provisioned',   'tenant',        'b3000000-0000-4000-8000-000000000001', '{"plan": "enterprise", "region": "me-central"}'::jsonb, '2025-10-01 08:00:00+00'),
  ('b3b40000-0000-4000-8000-000000000002', :tenant, 'b3900000-0000-4000-8000-000000009001', 'pack.activated',       'pack',          'kitchen-equipment',                    '{"version": "1.4.0", "activated_for": "b3-macbis"}'::jsonb, '2025-10-01 08:30:00+00'),
  ('b3b40000-0000-4000-8000-000000000003', :tenant, 'b3900000-0000-4000-8000-000000009001', 'user.created',         'user',          'sarah.mitchell',                       '{"email": "sarah.mitchell@b3macbis.com", "groups": ["Operations"]}'::jsonb, '2025-10-02 10:15:00+00'),
  ('b3b40000-0000-4000-8000-000000000004', :tenant, 'b3900000-0000-4000-8000-000000009001', 'role.assigned',        'user',          'sarah.mitchell',                       '{"role": "support_manager", "scope": "tenant"}'::jsonb, '2025-10-02 10:16:00+00'),
  ('b3b40000-0000-4000-8000-000000000005', :tenant, 'b3900000-0000-4000-8000-000000009002', 'config.updated',       'config',        'notifications.email_sender',           '{"old": "no-reply@optiforge.local", "new": "notifications@b3macbis.com"}'::jsonb, '2026-01-15 11:40:00+00'),
  ('b3b40000-0000-4000-8000-000000000006', :tenant, 'b3900000-0000-4000-8000-000000009001', 'integration.paused',   'scheduledsync', 's3-document-archive',                  '{"reason": "IAM role rotation broke bucket access", "paused_by": "admin"}'::jsonb, '2026-08-30 09:05:00+00'),
  ('b3b40000-0000-4000-8000-000000000007', :tenant, 'b3900000-0000-4000-8000-000000009001', 'user.password_reset',  'user',          'demo',                                 '{"initiated_via": "admin_console", "notified": true}'::jsonb, '2026-08-12 14:22:00+00'),
  ('b3b40000-0000-4000-8000-000000000008', :tenant, 'b3900000-0000-4000-8000-000000009002', 'config.updated',       'config',        'security.session_timeout_minutes',     '{"old": 60, "new": 30}'::jsonb, '2026-09-05 16:10:00+00');

-- ---------------------------------------------------------------------------
-- it_admin_tenantconfigsetting — 6 settings (unique on tenant_id + key)
-- ---------------------------------------------------------------------------
INSERT INTO it_admin_tenantconfigsetting
  (id, tenant_id, key, value, description, updated_by, updated_at)
VALUES
  ('b3b50000-0000-4000-8000-000000000001', :tenant, 'branding.logo_url',                '"https://cdn.b3macbis.com/branding/logo-2026.svg"'::jsonb, 'Tenant logo shown in portal header and PDF reports.', 'b3900000-0000-4000-8000-000000009001', '2025-10-01 09:00:00+00'),
  ('b3b50000-0000-4000-8000-000000000002', :tenant, 'locale.default',                   '{"language": "en", "timezone": "Asia/Dubai", "currency": "AED"}'::jsonb, 'Default locale bundle applied to new users.', 'b3900000-0000-4000-8000-000000009001', '2025-10-01 09:01:00+00'),
  ('b3b50000-0000-4000-8000-000000000003', :tenant, 'fiscal.year_start',                '"01-01"'::jsonb, 'Fiscal year start (MM-DD) used by finance reports.', 'b3900000-0000-4000-8000-000000009001', '2025-10-01 09:02:00+00'),
  ('b3b50000-0000-4000-8000-000000000004', :tenant, 'notifications.email_sender',       '"notifications@b3macbis.com"'::jsonb, 'From-address for all outbound notification email.', 'b3900000-0000-4000-8000-000000009002', '2026-01-15 11:40:00+00'),
  ('b3b50000-0000-4000-8000-000000000005', :tenant, 'security.session_timeout_minutes', '30'::jsonb, 'Idle session timeout enforced by the API gateway.', 'b3900000-0000-4000-8000-000000009002', '2026-09-05 16:10:00+00'),
  ('b3b50000-0000-4000-8000-000000000006', :tenant, 'integration.tally_enabled',        'true'::jsonb, 'Master switch for the nightly Tally ERP ledger/voucher sync.', 'b3900000-0000-4000-8000-000000009001', '2025-10-06 12:00:00+00');

-- ---------------------------------------------------------------------------
-- api_gateway_idempotencyrecord — 4 replay-protection records
-- ---------------------------------------------------------------------------
INSERT INTO api_gateway_idempotencyrecord
  (id, tenant_id, key, method, path, request_fingerprint, response_status, response_body, created_at)
VALUES
  ('b3b60000-0000-4000-8000-000000000001', :tenant, 'idem-7c1f0a44-so-create-0142',  'POST', '/api/v1/sales/orders',        '9f86d081884c7d659a2feaa0c55ad015a3bf4f1b2b0b822cd15d6c15b0f00a08', 201, '{"id": "so-2026-0142", "number": "SO-2026-0142", "status": "confirmed"}'::jsonb, '2026-04-03 10:11:58+00'),
  ('b3b60000-0000-4000-8000-000000000002', :tenant, 'idem-3ba92e10-po-approve-0231', 'POST', '/api/v1/procurement/purchase-orders/PO-2026-0231/approve', '60303ae22b998861bce3b28f33eec1be758a213c86c93c076dbe9f558c11c752', 200, '{"po_number": "PO-2026-0231", "status": "approved", "approved_by": "admin"}'::jsonb, '2026-05-06 15:21:55+00'),
  ('b3b60000-0000-4000-8000-000000000003', :tenant, 'idem-b8d4c771-ticket-0001',     'POST', '/api/v1/support/tickets',     'fd61a03af4f77d870fc21e05e7e80678095c92d808cfb3b5c279ee04c74aca13', 201, '{"id": "b3a60000-0000-4000-8000-000000000001", "number": "TKT-DJ-0001", "status": "open"}'::jsonb, '2026-07-02 06:44:52+00'),
  ('b3b60000-0000-4000-8000-000000000004', :tenant, 'idem-e02aa5f9-doc-checkin-r2',  'POST', '/api/v1/documents/b3a80000-0000-4000-8000-000000000001/revisions', 'a4e624d686e03ed2767c0abd85c14426b0b1157d2ce81d27bb4fe4f6f01d688a', 201, '{"document_id": "b3a80000-0000-4000-8000-000000000001", "rev_number": 2, "status": "stored"}'::jsonb, '2026-02-18 11:29:50+00');
