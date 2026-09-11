-- Demo seed — Django/OptiForge platform FINANCE + AUDIT + REPORTING + ANALYTICS
-- tables for B3 MACBIS. 17 tables:
--   finance_chartofaccounts, finance_costcenter, finance_currency,
--   finance_exchangerate, finance_apinvoice, finance_arinvoice,
--   finance_bankreconciliation, finance_gljournal, finance_glentry,
--   audit_auditarchive, audit_auditreadergrant, audit_auditrecord,
--   reporting_scheduledreport, analytics_dashboard,
--   analytics_embedhookregistration, analytics_semanticmodel,
--   analytics_warehouseextract
--
-- Mirrors the NestJS twins where they exist (INSERT..SELECT, deterministic
-- md5-derived UUIDs keyed on natural codes so children can re-derive parents):
--   finance_chartofaccounts  <- chart_of_accounts (roots + JE-DEMO accounts + their parents)
--   finance_costcenter       <- cost_centers (all 11)
--   finance_currency         <- finance_currency_master (INR/USD/AED/EUR/GBP)
--   finance_gljournal/glentry<- journal_entries + journal_entry_lines (JE-DEMO Oct–Dec 2025)
--   finance_arinvoice        <- invoices (INV-DEMO-001..018, Sales Invoice subset)
--   finance_apinvoice        <- purchase_invoices (PINV-DEMO-*)
--
-- Idempotent: clears this tenant's demo rows first (children before parents),
-- then re-inserts. Delete predicates — every table here is tenant-scoped, so
-- ALL deletes are `tenant_id = :tenant` (b3 anchor tenant uuid); order below
-- respects FKs (glentry before gljournal/chartofaccounts/costcenter).
--
-- Django FKs are DEFERRABLE INITIALLY DEFERRED; force immediate checking so a
-- BEGIN/ROLLBACK validation run still exercises every FK (no-op outside a txn).

\set tenant '''b3000000-0000-4000-8000-000000000001'''

SET CONSTRAINTS ALL IMMEDIATE;

-- ---------------------------------------------------------------------------
-- Deletes — children first, all by tenant_id = :tenant
-- ---------------------------------------------------------------------------

DELETE FROM finance_glentry            WHERE tenant_id = :tenant;
DELETE FROM finance_gljournal          WHERE tenant_id = :tenant;
DELETE FROM finance_chartofaccounts    WHERE tenant_id = :tenant;  -- self-FK: whole set removed in one stmt
DELETE FROM finance_costcenter         WHERE tenant_id = :tenant;
DELETE FROM finance_exchangerate       WHERE tenant_id = :tenant;
DELETE FROM finance_currency           WHERE tenant_id = :tenant;
DELETE FROM finance_apinvoice          WHERE tenant_id = :tenant;
DELETE FROM finance_arinvoice          WHERE tenant_id = :tenant;
DELETE FROM finance_bankreconciliation WHERE tenant_id = :tenant;
DELETE FROM audit_auditrecord          WHERE tenant_id = :tenant;
DELETE FROM audit_auditreadergrant     WHERE tenant_id = :tenant;
DELETE FROM audit_auditarchive         WHERE tenant_id = :tenant;
DELETE FROM reporting_scheduledreport  WHERE tenant_id = :tenant;
DELETE FROM analytics_dashboard        WHERE tenant_id = :tenant;
DELETE FROM analytics_embedhookregistration WHERE tenant_id = :tenant;
DELETE FROM analytics_semanticmodel    WHERE tenant_id = :tenant;
DELETE FROM analytics_warehouseextract WHERE tenant_id = :tenant;

-- ---------------------------------------------------------------------------
-- finance_currency — mirror finance_currency_master (5 demo currencies)
-- ---------------------------------------------------------------------------

INSERT INTO finance_currency (id, code, name, is_base, tenant_id)
SELECT md5('dj-cur-' || code)::uuid, code, name, is_base_currency, :tenant
FROM finance_currency_master
WHERE code IN ('INR', 'USD', 'AED', 'EUR', 'GBP');

-- ---------------------------------------------------------------------------
-- finance_exchangerate — monthly USD/AED/EUR -> INR, Oct 2025 .. Sep 2026
-- ---------------------------------------------------------------------------

INSERT INTO finance_exchangerate (id, from_code, to_code, rate, effective_from, tenant_id)
SELECT
  md5('dj-fx-' || c.code || '-' || to_char(d, 'YYYY-MM-DD'))::uuid,
  c.code,
  'INR',
  (c.base + c.drift * (EXTRACT(YEAR FROM d) * 12 + EXTRACT(MONTH FROM d) - (2025 * 12 + 10)))::numeric(18,8),
  d::date,
  :tenant
FROM (VALUES
  ('USD', 88.10::numeric, 0.12::numeric),
  ('AED', 23.99::numeric, 0.03::numeric),
  ('EUR', 95.35::numeric, 0.18::numeric)
) AS c(code, base, drift)
CROSS JOIN generate_series('2025-10-01'::timestamp, '2026-09-01'::timestamp, interval '1 month') AS d;

-- ---------------------------------------------------------------------------
-- finance_costcenter — mirror cost_centers (all 11)
-- ---------------------------------------------------------------------------

INSERT INTO finance_costcenter (id, code, name, is_active, tenant_id)
SELECT md5('dj-cc-' || "costCenterCode")::uuid, "costCenterCode", "costCenterName", "isActive", :tenant
FROM cost_centers;

-- ---------------------------------------------------------------------------
-- finance_chartofaccounts — mirror chart_of_accounts:
--   level-0 roots  +  the 19 accounts used by JE-DEMO journal lines
--   +  those accounts' direct parents (so the tree hangs together).
-- account_type map: Asset->asset, Liability->liability, Equity->equity,
--                   Income->revenue, Expense->expense (Django choices).
-- parent_id only when the parent is itself in the mirrored set, else NULL.
-- ---------------------------------------------------------------------------

WITH je_accounts AS (
  SELECT DISTINCT jel."accountId" AS account_id
  FROM journal_entry_lines jel
  JOIN journal_entries je ON je.id = jel."journalEntryId"
  WHERE je."journalNumber" LIKE 'JE-DEMO%'
),
mirror AS (
  SELECT coa.id, coa."accountCode", coa."accountName",
         coa."accountType"::text AS atype, coa."isActive", coa."parentAccountId"
  FROM chart_of_accounts coa
  WHERE coa.level = 0
     OR coa.id::text IN (SELECT account_id FROM je_accounts)
     OR coa.id IN (
          SELECT c."parentAccountId" FROM chart_of_accounts c
          WHERE c.id::text IN (SELECT account_id FROM je_accounts)
            AND c."parentAccountId" IS NOT NULL
        )
)
INSERT INTO finance_chartofaccounts (id, code, name, account_type, is_active, parent_id, tenant_id)
SELECT
  md5('dj-coa-' || m."accountCode")::uuid,
  m."accountCode",
  m."accountName",
  CASE m.atype
    WHEN 'Asset'     THEN 'asset'
    WHEN 'Liability' THEN 'liability'
    WHEN 'Equity'    THEN 'equity'
    WHEN 'Income'    THEN 'revenue'
    ELSE 'expense'
  END,
  m."isActive",
  (SELECT md5('dj-coa-' || p."accountCode")::uuid FROM mirror p WHERE p.id = m."parentAccountId"),
  :tenant
FROM mirror m;

-- ---------------------------------------------------------------------------
-- finance_gljournal — mirror journal_entries JE-DEMO Oct/Nov/Dec 2025 (16
-- journals, all Posted). Books are INR. Status map: Posted->posted.
-- ---------------------------------------------------------------------------

INSERT INTO finance_gljournal (id, number, description, posting_date, status, currency_code, tenant_id)
SELECT
  md5('dj-glj-' || je."journalNumber")::uuid,
  je."journalNumber",
  LEFT(je.description, 255),
  je."postingDate",
  CASE je.status::text WHEN 'Posted' THEN 'posted' WHEN 'Reversed' THEN 'reversed' ELSE 'draft' END,
  'INR',
  :tenant
FROM journal_entries je
WHERE je."journalNumber" ~ '^JE-DEMO-25(10|11|12)-';

-- ---------------------------------------------------------------------------
-- finance_glentry — the balanced lines of those 16 journals; account joined
-- to the mirrored chartofaccounts by code, cost center mapped by code.
-- ---------------------------------------------------------------------------

INSERT INTO finance_glentry (id, debit, credit, description, account_id, cost_center_id, journal_id, tenant_id)
SELECT
  md5('dj-gle-' || je."journalNumber" || '-' || jel."lineNumber")::uuid,
  jel."debitAmount",
  jel."creditAmount",
  LEFT(jel.description, 255),
  md5('dj-coa-' || coa."accountCode")::uuid,
  CASE WHEN cc."costCenterCode" IS NOT NULL THEN md5('dj-cc-' || cc."costCenterCode")::uuid END,
  md5('dj-glj-' || je."journalNumber")::uuid,
  :tenant
FROM journal_entry_lines jel
JOIN journal_entries je  ON je.id = jel."journalEntryId"
JOIN chart_of_accounts coa ON coa.id::text = jel."accountId"
LEFT JOIN cost_centers cc  ON cc."costCenterCode" = jel."costCenter"
WHERE je."journalNumber" ~ '^JE-DEMO-25(10|11|12)-';

-- ---------------------------------------------------------------------------
-- finance_arinvoice — mirror invoices INV-DEMO-001..018, Sales Invoice
-- subset (16 rows). partyId is already a UUID -> customer_account_id.
-- Status map: Paid->paid, Overdue->overdue, Draft->draft, Cancelled->void,
--             Sent / Partially Paid / anything else outstanding -> issued.
-- ---------------------------------------------------------------------------

INSERT INTO finance_arinvoice (id, number, customer_account_id, total_amount, currency_code,
                               status, due_date, milestone_reference, tenant_id)
SELECT
  md5('dj-ar-' || i."invoiceNumber")::uuid,
  i."invoiceNumber",
  i."partyId"::uuid,
  i."totalAmount",
  i.currency,
  CASE i.status::text
    WHEN 'Paid'      THEN 'paid'
    WHEN 'Overdue'   THEN 'overdue'
    WHEN 'Draft'     THEN 'draft'
    WHEN 'Cancelled' THEN 'void'
    ELSE 'issued'
  END,
  i."dueDate",
  LEFT(COALESCE(i."referenceNumber", ''), 100),
  :tenant
FROM invoices i
WHERE i."invoiceType"::text = 'Sales Invoice'
  AND i."invoiceNumber" ~ '^INV-DEMO-0(0[1-9]|1[0-8])$';

-- ---------------------------------------------------------------------------
-- finance_apinvoice — mirror purchase_invoices PINV-DEMO-* (10 rows).
-- Status map: Paid->paid, Approved / Partially Paid->approved,
--             Cancelled->void, everything earlier in the flow->draft.
-- ---------------------------------------------------------------------------

INSERT INTO finance_apinvoice (id, number, supplier_code, total_amount, currency_code, status, due_date, tenant_id)
SELECT
  md5('dj-ap-' || p."internalInvoiceNumber")::uuid,
  p."internalInvoiceNumber",
  p."vendorCode",
  p."totalAmount",
  p.currency,
  CASE p.status::text
    WHEN 'Paid'           THEN 'paid'
    WHEN 'Approved'       THEN 'approved'
    WHEN 'Partially Paid' THEN 'approved'
    WHEN 'Cancelled'      THEN 'void'
    ELSE 'draft'
  END,
  p."dueDate",
  :tenant
FROM purchase_invoices p
WHERE p."internalInvoiceNumber" LIKE 'PINV-DEMO-%';

-- ---------------------------------------------------------------------------
-- finance_bankreconciliation — 2 statements on the current account (COA 1021)
-- ---------------------------------------------------------------------------

INSERT INTO finance_bankreconciliation
  (id, bank_account_code, statement_date, statement_balance, reconciled_balance, status, tenant_id)
VALUES
  ('d39b0001-0000-4000-8000-000000000001', '1021', '2026-07-31', 1842650.00, 1842650.00, 'reconciled', :tenant),
  ('d39b0001-0000-4000-8000-000000000002', '1021', '2026-08-31', 2015830.00, 1963410.00, 'pending',    :tenant);

-- ---------------------------------------------------------------------------
-- audit_auditrecord — 12 demo events (logins, creates, updates), actors are
-- the demo auth_user logins (9001 admin / 9002 demo / 9003 sarah.mitchell).
-- Hash chain: this_hash = sha256('b3-audit-'||seed); chained rows carry the
-- previous row's seed so previous_hash matches. Operation choices:
-- CREATE/UPDATE/DELETE (Django model). layer: platform|core.
-- ---------------------------------------------------------------------------

INSERT INTO audit_auditrecord
  (id, tenant_id, actor, "timestamp", entity_type, entity_id, operation,
   before_state, after_state, reason_for_change, layer, previous_hash, this_hash, is_archived)
SELECT
  md5('dj-audit-' || v.seed)::uuid,
  :tenant,
  v.actor,
  v.ts::timestamptz,
  v.entity_type,
  v.entity_id,
  v.op,
  v.before_state::jsonb,
  v.after_state::jsonb,
  v.reason,
  v.layer,
  COALESCE(encode(sha256(convert_to('b3-audit-' || v.prev_seed, 'UTF8')), 'hex'), ''),
  encode(sha256(convert_to('b3-audit-' || v.seed, 'UTF8')), 'hex'),
  false
FROM (VALUES
  ('01', NULL, 'admin',          '2025-10-01 08:02:11+00', 'identity.session',          'sess-admin-2025-10-01', 'CREATE', NULL, '{"login": "admin", "user_id": 9001, "ip": "10.20.4.11"}', 'User login', 'platform'),
  ('02', NULL, 'demo',           '2025-11-12 09:15:40+00', 'identity.session',          'sess-demo-2025-11-12',  'CREATE', NULL, '{"login": "demo", "user_id": 9002, "ip": "10.20.4.52"}', 'User login', 'platform'),
  ('03', NULL, 'sarah.mitchell', '2026-01-05 07:48:03+00', 'identity.session',          'sess-sarah-2026-01-05', 'CREATE', NULL, '{"login": "sarah.mitchell", "user_id": 9003, "ip": "10.20.5.14"}', 'User login', 'platform'),
  ('04', NULL, 'sarah.mitchell', '2026-02-11 10:22:19+00', 'finance.APInvoice',         'PINV-DEMO-0008',        'CREATE', NULL, '{"number": "PINV-DEMO-0008", "status": "draft", "total_amount": "277300.00"}', 'AP invoice captured from vendor bill', 'core'),
  ('05', '04', 'sarah.mitchell', '2026-02-13 14:05:52+00', 'finance.APInvoice',         'PINV-DEMO-0008',        'UPDATE', '{"status": "draft"}', '{"status": "approved"}', 'Three-way match passed; approved for payment', 'core'),
  ('06', NULL, 'demo',           '2026-02-20 11:31:07+00', 'finance.ARInvoice',         'INV-DEMO-013',          'CREATE', NULL, '{"number": "INV-DEMO-013", "status": "issued", "total_amount": "146320.00"}', 'AR invoice issued to Golden Spoon Franchises', 'core'),
  ('07', '06', 'admin',          '2026-03-16 06:00:00+00', 'finance.ARInvoice',         'INV-DEMO-013',          'UPDATE', '{"status": "issued"}', '{"status": "overdue"}', 'Past due date; dunning cycle started', 'core'),
  ('08', NULL, 'admin',          '2026-04-02 12:44:30+00', 'hr.Employee',               'EMP-2024-0007',         'UPDATE', '{"designation": "Accountant"}', '{"designation": "Senior Accountant"}', 'Annual promotion cycle', 'core'),
  ('09', NULL, 'sarah.mitchell', '2025-12-31 18:12:45+00', 'finance.GLJournal',         'JE-DEMO-2512-06',       'CREATE', NULL, '{"number": "JE-DEMO-2512-06", "status": "posted", "total": "42000.00"}', 'Quarterly income-tax provision posted', 'core'),
  ('10', NULL, 'admin',          '2026-06-18 09:09:27+00', 'analytics.Dashboard',       'Finance Overview',      'UPDATE', '{"widgets": 4}', '{"widgets": 6}', 'Added AR ageing and cash-position widgets', 'core'),
  ('11', NULL, 'admin',          '2026-07-24 15:37:58+00', 'reporting.ScheduledReport', 'AR Ageing Weekly',      'CREATE', NULL, '{"name": "AR Ageing Weekly", "cron": "0 6 * * 1", "format": "xlsx"}', 'Scheduled weekly AR ageing for finance team', 'platform'),
  ('12', NULL, 'demo',           '2026-09-10 17:55:20+00', 'identity.session',          'sess-demo-2025-11-12',  'DELETE', '{"login": "demo", "user_id": 9002}', NULL, 'User logout', 'platform')
) AS v(seed, prev_seed, actor, ts, entity_type, entity_id, op, before_state, after_state, reason, layer);

-- ---------------------------------------------------------------------------
-- audit_auditarchive — 2 archived batches (payload kept inline per model doc)
-- ---------------------------------------------------------------------------

INSERT INTO audit_auditarchive (id, tenant_id, record_count, from_timestamp, to_timestamp, payload, created_at)
VALUES
  ('d39a0001-0000-4000-8000-000000000001', :tenant, 148,
   '2025-10-01 00:00:00+00', '2025-12-31 23:59:59+00',
   '{"format": "jsonl", "note": "Q4-2025 audit batch, exported for cold storage", "entity_types": ["finance.APInvoice", "finance.ARInvoice", "finance.GLJournal", "identity.session"]}',
   '2026-01-15 02:00:00+00'),
  ('d39a0001-0000-4000-8000-000000000002', :tenant, 231,
   '2026-01-01 00:00:00+00', '2026-03-31 23:59:59+00',
   '{"format": "jsonl", "note": "Q1-2026 audit batch, exported for cold storage", "entity_types": ["finance.APInvoice", "finance.ARInvoice", "hr.Employee", "identity.session"]}',
   '2026-04-15 02:00:00+00');

-- ---------------------------------------------------------------------------
-- audit_auditreadergrant — audit-reader role for admin (9001) and
-- sarah.mitchell (9003); granted_by unknown -> NULL (nullable UUID)
-- ---------------------------------------------------------------------------

INSERT INTO audit_auditreadergrant (id, tenant_id, granted_by, is_active, created_at, user_id)
VALUES
  ('d39c0001-0000-4000-8000-000000000001', :tenant, NULL, true, '2025-10-02 09:00:00+00', 9001),
  ('d39c0001-0000-4000-8000-000000000002', :tenant, NULL, true, '2026-02-01 10:30:00+00', 9003);

-- ---------------------------------------------------------------------------
-- reporting_scheduledreport — 4 schedules
-- export_format choices: csv|xlsx|pdf|json; status choices: active|paused
-- ---------------------------------------------------------------------------

INSERT INTO reporting_scheduledreport
  (id, tenant_id, name, view_name, params, cron_expression, export_format,
   delivery_channel, delivery_recipient, notification_event_type, status, last_run_at, created_at)
VALUES
  ('d39d0001-0000-4000-8000-000000000001', :tenant, 'AR Ageing Weekly',        'finance.ar_ageing',
   '{"buckets": [30, 60, 90], "currency": "INR"}', '0 6 * * 1', 'xlsx',
   'email', 'finance@b3macbis.example',    'report.scheduled_delivery', 'active', '2026-09-07 06:00:12+00', '2026-07-24 15:37:58+00'),
  ('d39d0001-0000-4000-8000-000000000002', :tenant, 'GL Trial Balance Monthly', 'finance.trial_balance',
   '{"period": "previous_month"}',                 '0 5 1 * *', 'pdf',
   'email', 'controller@b3macbis.example', 'report.scheduled_delivery', 'active', '2026-09-01 05:00:41+00', '2025-11-03 11:20:00+00'),
  ('d39d0001-0000-4000-8000-000000000003', :tenant, 'AP Due Invoices Daily',    'finance.ap_due',
   '{"horizon_days": 7}',                          '30 7 * * *', 'csv',
   'email', 'payables@b3macbis.example',   'report.scheduled_delivery', 'active', '2026-09-10 07:30:05+00', '2026-01-12 09:45:00+00'),
  ('d39d0001-0000-4000-8000-000000000004', :tenant, 'Production KPI Summary',   'production.kpi_summary',
   '{"lines": ["fabrication", "assembly"]}',       '0 8 * * 5', 'json',
   'email', 'ops@b3macbis.example',        'report.scheduled_delivery', 'paused', NULL,                     '2026-05-20 14:10:00+00');

-- ---------------------------------------------------------------------------
-- analytics_dashboard — 3 dashboards (unique per tenant+module_code+name)
-- ---------------------------------------------------------------------------

INSERT INTO analytics_dashboard (id, name, module_code, layout, is_default, tenant_id)
VALUES
  ('d39e0001-0000-4000-8000-000000000001', 'Finance Overview', 'finance',
   '{"columns": 12, "widgets": [{"type": "kpi", "metric": "ar_outstanding", "pos": [0, 0, 3, 2]}, {"type": "kpi", "metric": "ap_due_7d", "pos": [3, 0, 3, 2]}, {"type": "chart", "metric": "gl_expense_by_costcenter", "pos": [0, 2, 6, 4]}, {"type": "table", "metric": "ar_ageing", "pos": [6, 2, 6, 4]}]}',
   true, :tenant),
  ('d39e0001-0000-4000-8000-000000000002', 'Sales Pipeline', 'crm',
   '{"columns": 12, "widgets": [{"type": "funnel", "metric": "pipeline_by_stage", "pos": [0, 0, 6, 4]}, {"type": "chart", "metric": "won_revenue_monthly", "pos": [6, 0, 6, 4]}]}',
   true, :tenant),
  ('d39e0001-0000-4000-8000-000000000003', 'Production Floor', 'production',
   '{"columns": 12, "widgets": [{"type": "kpi", "metric": "wo_on_time_pct", "pos": [0, 0, 4, 2]}, {"type": "chart", "metric": "output_by_line_daily", "pos": [0, 2, 8, 4]}]}',
   false, :tenant);

-- ---------------------------------------------------------------------------
-- analytics_semanticmodel — 3 models (unique per tenant+name+version)
-- ---------------------------------------------------------------------------

INSERT INTO analytics_semanticmodel (id, name, version, dimensions, measures, created_at, tenant_id)
VALUES
  ('d39f0001-0000-4000-8000-000000000001', 'FinanceGL', 1,
   '[{"name": "account", "source_column": "account_code", "data_type": "string"}, {"name": "cost_center", "source_column": "cost_center_code", "data_type": "string"}, {"name": "posting_month", "source_column": "posting_date", "data_type": "date"}]',
   '[{"name": "debit_total", "aggregation": "sum", "source_column": "debit"}, {"name": "credit_total", "aggregation": "sum", "source_column": "credit"}]',
   '2025-11-10 10:00:00+00', :tenant),
  ('d39f0001-0000-4000-8000-000000000002', 'SalesOrders', 1,
   '[{"name": "customer", "source_column": "customer_name", "data_type": "string"}, {"name": "order_month", "source_column": "order_date", "data_type": "date"}, {"name": "status", "source_column": "status", "data_type": "string"}]',
   '[{"name": "order_value", "aggregation": "sum", "source_column": "total_amount"}, {"name": "order_count", "aggregation": "count", "source_column": "id"}]',
   '2026-02-18 12:30:00+00', :tenant),
  ('d39f0001-0000-4000-8000-000000000003', 'InventoryStock', 1,
   '[{"name": "warehouse", "source_column": "warehouse_code", "data_type": "string"}, {"name": "item_category", "source_column": "category", "data_type": "string"}]',
   '[{"name": "on_hand_qty", "aggregation": "sum", "source_column": "quantity"}, {"name": "stock_value", "aggregation": "sum", "source_column": "value"}]',
   '2026-06-05 09:15:00+00', :tenant);

-- ---------------------------------------------------------------------------
-- analytics_warehouseextract — 2 extract runs (status: running|completed|failed)
-- ---------------------------------------------------------------------------

INSERT INTO analytics_warehouseextract (id, source_module, started_at, completed_at, rows_exported, status, tenant_id)
VALUES
  ('d3a00001-0000-4000-8000-000000000001', 'finance',    '2026-09-09 01:00:00+00', '2026-09-09 01:07:42+00', 15230, 'completed', :tenant),
  ('d3a00001-0000-4000-8000-000000000002', 'production', '2026-09-10 01:00:00+00', NULL,                         0, 'running',   :tenant);

-- ---------------------------------------------------------------------------
-- analytics_embedhookregistration — 1 external BI embed hook
-- ---------------------------------------------------------------------------

INSERT INTO analytics_embedhookregistration (id, tool_code, endpoint_url, shared_secret_cipher, is_active, tenant_id)
VALUES
  ('d3a10001-0000-4000-8000-000000000001', 'metabase', 'https://bi.b3macbis.example/embed/hook', '', true, :tenant);
