-- Demo seed — Finance journal entries (GL) for B3 MACBIS.
-- Seeds journal_entries + journal_entry_lines with a 12-month business rhythm
-- (Oct 2025 .. Sep 2026): revenue recognition, material purchases, payroll,
-- rent & utilities, depreciation, quarterly income-tax accruals.
-- NOTE: journal_entries / journal_entry_lines carry no companyId column;
-- the :company anchor is kept for consistency with the other demo-seed files.
-- Idempotent: JE-DEMO-% rows are deleted (lines first) before re-insert.
-- Account ids are resolved from chart_of_accounts by accountCode (never invented).
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- 0. Financial year / periods coverage.
--    financial_periods currently ends at FY2025-26-P12 (Mar 2026); entries for
--    Apr–Sep 2026 need FY2026-27 periods. Insert idempotently (unique codes).
-- ---------------------------------------------------------------------------
INSERT INTO financial_years
  (id, "yearCode", "yearName", "startDate", "endDate", status, "isCurrent", description, "createdBy")
VALUES
  ('de3f0000-2026-4000-8000-000000000027', 'FY2026-27', 'Financial Year 2026-27',
   '2026-04-01', '2027-03-31', 'Open', false, 'Created by demo seed for demo journal entries', 'demo-seed')
ON CONFLICT ("yearCode") DO NOTHING;

INSERT INTO financial_periods
  ("financialYearId", "periodCode", "periodName", "periodType", "periodNumber",
   "startDate", "endDate", status, "isCurrent", "createdBy")
SELECT fy.id, v.code, v.name, 'Month', v.num, v.sd, v.ed, 'Open', false, 'demo-seed'
FROM financial_years fy
CROSS JOIN (VALUES
  ('FY2026-27-P01', 'April 2026',     1, '2026-04-01'::date, '2026-04-30'::date),
  ('FY2026-27-P02', 'May 2026',       2, '2026-05-01'::date, '2026-05-31'::date),
  ('FY2026-27-P03', 'June 2026',      3, '2026-06-01'::date, '2026-06-30'::date),
  ('FY2026-27-P04', 'July 2026',      4, '2026-07-01'::date, '2026-07-31'::date),
  ('FY2026-27-P05', 'August 2026',    5, '2026-08-01'::date, '2026-08-31'::date),
  ('FY2026-27-P06', 'September 2026', 6, '2026-09-01'::date, '2026-09-30'::date)
) v(code, name, num, sd, ed)
WHERE fy."yearCode" = 'FY2026-27'
ON CONFLICT ("periodCode") DO NOTHING;

-- ---------------------------------------------------------------------------
-- 1. Clear previous demo rows (lines via parent join, then headers).
-- ---------------------------------------------------------------------------
DELETE FROM journal_entry_lines
 WHERE "journalEntryId" IN (SELECT id FROM journal_entries WHERE "journalNumber" LIKE 'JE-DEMO-%');
DELETE FROM journal_entries WHERE "journalNumber" LIKE 'JE-DEMO-%';

-- ---------------------------------------------------------------------------
-- 2. Month driver table (session-local, dropped at end of file).
--    rev  = net domestic sales for the month (grows over the year)
--    mat  = raw-material purchases (~42% of revenue)
--    wage/sal/ded = production wages, office salaries, statutory deductions
--    util = factory + office utilities;  taxacc = quarterly income-tax accrual
--    18% GST is computed on rev and mat. mi=12 (Sep 2026) is the partial
--    current month: three of its entries stay in Draft.
-- ---------------------------------------------------------------------------
DROP TABLE IF EXISTS pg_temp.demo_je_months;
CREATE TEMP TABLE demo_je_months
  (mi int, yymm text, y int, mo int, pcode text,
   rev numeric, mat numeric, wage numeric, sal numeric, ded numeric,
   util numeric, taxacc numeric);
INSERT INTO demo_je_months VALUES
  ( 1, '2510', 2025, 10, 'FY2025-26-P07', 310000, 130000, 108000, 70000, 29500, 26500,     0),
  ( 2, '2511', 2025, 11, 'FY2025-26-P08', 325000, 136500, 109500, 70500, 29800, 27800,     0),
  ( 3, '2512', 2025, 12, 'FY2025-26-P09', 360000, 151000, 112000, 72000, 30400, 29400, 42000),
  ( 4, '2601', 2026,  1, 'FY2025-26-P10', 300000, 126000, 110000, 71000, 29900, 31000,     0),
  ( 5, '2602', 2026,  2, 'FY2025-26-P11', 335000, 140500, 111000, 71500, 30100, 30200,     0),
  ( 6, '2603', 2026,  3, 'FY2025-26-P12', 400000, 168000, 118000, 76000, 32000, 27500, 55000),
  ( 7, '2604', 2026,  4, 'FY2026-27-P01', 350000, 147000, 112000, 72500, 30500, 26000,     0),
  ( 8, '2605', 2026,  5, 'FY2026-27-P02', 370000, 155500, 113500, 73000, 30800, 25200,     0),
  ( 9, '2606', 2026,  6, 'FY2026-27-P03', 390000, 164000, 114000, 73500, 31000, 24800, 48000),
  (10, '2607', 2026,  7, 'FY2026-27-P04', 400000, 168000, 115000, 74000, 31200, 26400,     0),
  (11, '2608', 2026,  8, 'FY2026-27-P05', 410000, 172000, 116500, 74500, 31500, 28900,     0),
  (12, '2609', 2026,  9, 'FY2026-27-P06', 420000, 176500, 118000, 75000, 31900, 29600, 52000);

-- Deterministic header ids: de300000-<yymm>-4000-8000-00000000000<n>
-- where n = 1 sales, 2 purchases, 3 payroll, 4 rent/utilities, 5 depreciation, 6 tax accrual.

-- ---------------------------------------------------------------------------
-- 3a. Headers — monthly revenue recognition (Posted).
-- ---------------------------------------------------------------------------
INSERT INTO journal_entries
  (id, "journalNumber", "journalType", "periodId", "journalDate", "postingDate", description,
   "referenceNumber", status, "totalDebit", "totalCredit", "isBalanced",
   "postedBy", "postedAt", "createdBy", "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000001')::uuid,
       'JE-DEMO-' || m.yymm || '-01', 'Standard',
       (SELECT id FROM financial_periods WHERE "periodCode" = m.pcode),
       d.jd, d.jd,
       'Revenue recognition — customer invoices billed for ' || to_char(d.jd, 'Mon YYYY'),
       'INV-BATCH-' || m.yymm, 'Posted',
       m.rev * 1.18, m.rev * 1.18, true,
       'finance.demo', d.jd + time '18:00', 'demo-seed', d.jd + time '09:00', d.jd + time '18:00'
FROM demo_je_months m
CROSS JOIN LATERAL (SELECT CASE WHEN m.mi = 12 THEN date '2026-09-08'
                                ELSE make_date(m.y, m.mo, 24) END AS jd) d;

-- 3b. Headers — raw-material purchases (Posted).
INSERT INTO journal_entries
  (id, "journalNumber", "journalType", "periodId", "journalDate", "postingDate", description,
   "referenceNumber", status, "totalDebit", "totalCredit", "isBalanced",
   "postedBy", "postedAt", "createdBy", "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000002')::uuid,
       'JE-DEMO-' || m.yymm || '-02', 'Standard',
       (SELECT id FROM financial_periods WHERE "periodCode" = m.pcode),
       d.jd, d.jd,
       'Raw material purchases on credit — stainless steel, compressors, fittings (' || to_char(d.jd, 'Mon YYYY') || ')',
       'GRN-BATCH-' || m.yymm, 'Posted',
       m.mat * 1.18, m.mat * 1.18, true,
       'finance.demo', d.jd + time '18:00', 'demo-seed', d.jd + time '09:00', d.jd + time '18:00'
FROM demo_je_months m
CROSS JOIN LATERAL (SELECT CASE WHEN m.mi = 12 THEN date '2026-09-04'
                                ELSE make_date(m.y, m.mo, 6) END AS jd) d;

-- 3c. Headers — monthly payroll (~$180k gross; Sep 2026 still Draft).
INSERT INTO journal_entries
  (id, "journalNumber", "journalType", "periodId", "journalDate", "postingDate", description,
   "referenceNumber", status, "totalDebit", "totalCredit", "isBalanced",
   "postedBy", "postedAt", "createdBy", "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000003')::uuid,
       'JE-DEMO-' || m.yymm || '-03', 'Standard',
       (SELECT id FROM financial_periods WHERE "periodCode" = m.pcode),
       d.jd, d.jd,
       'Payroll accrual — ' || to_char(d.jd, 'Mon YYYY') || ' (production wages + office salaries)',
       'PAY-' || m.yymm, CASE WHEN m.mi = 12 THEN 'Draft' ELSE 'Posted' END::journal_entries_status_enum,
       m.wage + m.sal, m.wage + m.sal, true,
       CASE WHEN m.mi = 12 THEN NULL ELSE 'finance.demo' END,
       CASE WHEN m.mi = 12 THEN NULL ELSE d.jd + time '18:00' END,
       'demo-seed', d.jd + time '09:00',
       CASE WHEN m.mi = 12 THEN d.jd + time '09:00' ELSE d.jd + time '18:00' END
FROM demo_je_months m
CROSS JOIN LATERAL (SELECT CASE WHEN m.mi = 12 THEN date '2026-09-10'
                                ELSE (make_date(m.y, m.mo, 1) + interval '1 month' - interval '1 day')::date END AS jd) d;

-- 3d. Headers — rent & utilities paid from bank (Posted).
INSERT INTO journal_entries
  (id, "journalNumber", "journalType", "periodId", "journalDate", "postingDate", description,
   "referenceNumber", status, "totalDebit", "totalCredit", "isBalanced",
   "postedBy", "postedAt", "createdBy", "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000004')::uuid,
       'JE-DEMO-' || m.yymm || '-04', 'Standard',
       (SELECT id FROM financial_periods WHERE "periodCode" = m.pcode),
       d.jd, d.jd,
       'Rent and utilities — ' || to_char(d.jd, 'Mon YYYY') || ' (factory + office)',
       'RENT-' || m.yymm, 'Posted',
       63000 + m.util, 63000 + m.util, true,
       'finance.demo', d.jd + time '18:00', 'demo-seed', d.jd + time '09:00', d.jd + time '18:00'
FROM demo_je_months m
CROSS JOIN LATERAL (SELECT make_date(m.y, m.mo, 2) AS jd) d;

-- 3e. Headers — monthly depreciation (Recurring; Sep 2026 still Draft).
INSERT INTO journal_entries
  (id, "journalNumber", "journalType", "periodId", "journalDate", "postingDate", description,
   "referenceNumber", status, "totalDebit", "totalCredit", "isBalanced",
   "isRecurring", "recurrencePattern",
   "postedBy", "postedAt", "createdBy", "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000005')::uuid,
       'JE-DEMO-' || m.yymm || '-05', 'Recurring',
       (SELECT id FROM financial_periods WHERE "periodCode" = m.pcode),
       d.jd, d.jd,
       'Monthly depreciation — plant & machinery and buildings (' || to_char(d.jd, 'Mon YYYY') || ')',
       'DEP-' || m.yymm, CASE WHEN m.mi = 12 THEN 'Draft' ELSE 'Posted' END::journal_entries_status_enum,
       38500, 38500, true,
       true, 'Monthly',
       CASE WHEN m.mi = 12 THEN NULL ELSE 'finance.demo' END,
       CASE WHEN m.mi = 12 THEN NULL ELSE d.jd + time '18:00' END,
       'demo-seed', d.jd + time '09:00',
       CASE WHEN m.mi = 12 THEN d.jd + time '09:00' ELSE d.jd + time '18:00' END
FROM demo_je_months m
CROSS JOIN LATERAL (SELECT CASE WHEN m.mi = 12 THEN date '2026-09-10'
                                ELSE (make_date(m.y, m.mo, 1) + interval '1 month' - interval '1 day')::date END AS jd) d;

-- 3f. Headers — quarterly income-tax accrual (Accrual; Sep 2026 still Draft).
INSERT INTO journal_entries
  (id, "journalNumber", "journalType", "periodId", "journalDate", "postingDate", description,
   "referenceNumber", status, "totalDebit", "totalCredit", "isBalanced",
   "postedBy", "postedAt", "createdBy", "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000006')::uuid,
       'JE-DEMO-' || m.yymm || '-06', 'Accrual',
       (SELECT id FROM financial_periods WHERE "periodCode" = m.pcode),
       d.jd, d.jd,
       'Quarterly income-tax provision — quarter ending ' || to_char(d.jd, 'Mon YYYY'),
       'TAX-' || m.yymm, CASE WHEN m.mi = 12 THEN 'Draft' ELSE 'Posted' END::journal_entries_status_enum,
       m.taxacc, m.taxacc, true,
       CASE WHEN m.mi = 12 THEN NULL ELSE 'finance.demo' END,
       CASE WHEN m.mi = 12 THEN NULL ELSE d.jd + time '18:00' END,
       'demo-seed', d.jd + time '09:00',
       CASE WHEN m.mi = 12 THEN d.jd + time '09:00' ELSE d.jd + time '18:00' END
FROM demo_je_months m
CROSS JOIN LATERAL (SELECT CASE WHEN m.mi = 12 THEN date '2026-09-09'
                                ELSE (make_date(m.y, m.mo, 1) + interval '1 month' - interval '1 day')::date END AS jd) d
WHERE m.taxacc > 0;

-- ---------------------------------------------------------------------------
-- 4. Lines. accountId resolved from chart_of_accounts by accountCode.
--    Every entry balances by construction (debits and credits derive from the
--    same driver amounts).
-- ---------------------------------------------------------------------------

-- 4a. Sales: Dr Trade Receivables 1110; Cr Domestic Sales 4011; Cr GST Payable IGST 2112.
INSERT INTO journal_entry_lines
  ("journalEntryId", "lineNumber", "accountId", description,
   "debitAmount", "creditAmount", "costCenter", department, "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000001')::uuid,
       l.ln, l.acct, l.descr, l.dr, l.cr, 'CC-SALES', 'Sales',
       make_date(m.y, m.mo, 1) + time '10:30', make_date(m.y, m.mo, 1) + time '10:30'
FROM demo_je_months m
CROSS JOIN LATERAL (VALUES
  (1, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '1110'),
      'Trade receivables — invoices raised to customers', m.rev * 1.18, 0::numeric),
  (2, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '4011'),
      'Domestic sales — kitchen equipment', 0::numeric, m.rev),
  (3, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '2112'),
      'Output GST (IGST 18%) on sales', 0::numeric, m.rev * 0.18)
) l(ln, acct, descr, dr, cr);

-- 4b. Purchases: Dr Raw Material Purchases 5011; Dr GST Input Credit 1340; Cr Trade Payables 2011.
INSERT INTO journal_entry_lines
  ("journalEntryId", "lineNumber", "accountId", description,
   "debitAmount", "creditAmount", "costCenter", department, "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000002')::uuid,
       l.ln, l.acct, l.descr, l.dr, l.cr, 'CC-PROD', 'Procurement',
       make_date(m.y, m.mo, 1) + time '10:30', make_date(m.y, m.mo, 1) + time '10:30'
FROM demo_je_months m
CROSS JOIN LATERAL (VALUES
  (1, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '5011'),
      'Raw material purchases — steel sheets, burners, compressors', m.mat, 0::numeric),
  (2, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '1340'),
      'GST input tax credit (18%) on purchases', m.mat * 0.18, 0::numeric),
  (3, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '2011'),
      'Supplier invoices payable — domestic vendors', 0::numeric, m.mat * 1.18)
) l(ln, acct, descr, dr, cr);

-- 4c. Payroll: Dr Production Wages 5110 + Office Salaries 6110; Cr Salary Payable 2210 (net); Cr TDS Payable 2120.
INSERT INTO journal_entry_lines
  ("journalEntryId", "lineNumber", "accountId", description,
   "debitAmount", "creditAmount", "costCenter", department, "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000003')::uuid,
       l.ln, l.acct, l.descr, l.dr, l.cr, 'CC-HR', l.dept,
       make_date(m.y, m.mo, 1) + time '10:30', make_date(m.y, m.mo, 1) + time '10:30'
FROM demo_je_months m
CROSS JOIN LATERAL (VALUES
  (1, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '5110'),
      'Production wages — factory floor', m.wage, 0::numeric, 'Production'),
  (2, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '6110'),
      'Office and admin salaries', m.sal, 0::numeric, 'Admin'),
  (3, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '2210'),
      'Net salaries payable to employees', 0::numeric, m.wage + m.sal - m.ded, 'HR'),
  (4, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '2120'),
      'TDS and statutory deductions withheld', 0::numeric, m.ded, 'HR')
) l(ln, acct, descr, dr, cr, dept);

-- 4d. Rent & utilities: Dr Factory Rent 5210 + Office Rent 6120 + Factory Utilities 5220; Cr Bank 1021.
INSERT INTO journal_entry_lines
  ("journalEntryId", "lineNumber", "accountId", description,
   "debitAmount", "creditAmount", "costCenter", department, "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000004')::uuid,
       l.ln, l.acct, l.descr, l.dr, l.cr, 'CC-ADMIN', 'Facilities',
       make_date(m.y, m.mo, 2) + time '10:30', make_date(m.y, m.mo, 2) + time '10:30'
FROM demo_je_months m
CROSS JOIN LATERAL (VALUES
  (1, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '5210'),
      'Factory rent — monthly lease', 45000::numeric, 0::numeric),
  (2, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '6120'),
      'Office rent — monthly lease', 18000::numeric, 0::numeric),
  (3, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '5220'),
      'Factory and office utilities — power and water', m.util, 0::numeric),
  (4, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '1021'),
      'Paid from current account', 0::numeric, 63000 + m.util)
) l(ln, acct, descr, dr, cr);

-- 4e. Depreciation: Dr Depreciation Expense 6710; Cr Accum Dep — Plant 1531; Cr Accum Dep — Buildings 1521.
INSERT INTO journal_entry_lines
  ("journalEntryId", "lineNumber", "accountId", description,
   "debitAmount", "creditAmount", "costCenter", department, "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000005')::uuid,
       l.ln, l.acct, l.descr, l.dr, l.cr, 'CC-FIN', 'Finance',
       make_date(m.y, m.mo, 1) + time '10:30', make_date(m.y, m.mo, 1) + time '10:30'
FROM demo_je_months m
CROSS JOIN LATERAL (VALUES
  (1, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '6710'),
      'Monthly depreciation charge', 38500::numeric, 0::numeric),
  (2, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '1531'),
      'Accumulated depreciation — plant and machinery', 0::numeric, 29500::numeric),
  (3, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '1521'),
      'Accumulated depreciation — buildings', 0::numeric, 9000::numeric)
) l(ln, acct, descr, dr, cr);

-- 4f. Tax accrual: Dr Income Tax Expense 8010; Cr Accrued Expenses 2310.
INSERT INTO journal_entry_lines
  ("journalEntryId", "lineNumber", "accountId", description,
   "debitAmount", "creditAmount", "costCenter", department, "createdAt", "updatedAt")
SELECT ('de300000-' || m.yymm || '-4000-8000-000000000006')::uuid,
       l.ln, l.acct, l.descr, l.dr, l.cr, 'CC-FIN', 'Finance',
       make_date(m.y, m.mo, 1) + time '10:30', make_date(m.y, m.mo, 1) + time '10:30'
FROM demo_je_months m
CROSS JOIN LATERAL (VALUES
  (1, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '8010'),
      'Provision for income tax — quarterly estimate', m.taxacc, 0::numeric),
  (2, (SELECT id::text FROM chart_of_accounts WHERE "accountCode" = '2310'),
      'Accrued income-tax liability', 0::numeric, m.taxacc)
) l(ln, acct, descr, dr, cr)
WHERE m.taxacc > 0;

DROP TABLE IF EXISTS pg_temp.demo_je_months;
