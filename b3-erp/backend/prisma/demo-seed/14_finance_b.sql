-- Demo seed — Finance B (fixed assets, GL mirror, GST/TDS statutory, cost accounting, finance extras).
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this file's demo rows first (see per-section DELETE predicates), then re-inserts.
--
-- Delete predicates used for idempotency:
--   fixed_assets                       assetCode LIKE 'FA-DEMO-%' (child rows in asset_depreciation /
--                                      asset_maintenance for those assets are cleared first for FK safety)
--   finance_forecast_scenario          company_id = :company
--   finance_intercompany_transaction   reference LIKE 'ICO-DEMO-%'
--   finance_payment_reminder           company_id = :company
--   finance_recurring_transactions     company_id = :company
--   finance_report_templates           company_id = :company
--   general_ledger                     transactionNumber LIKE 'GL-JE-DEMO-%'
--   gstr_periods                       periodCode LIKE 'DEMO-GSTR%'
--   gst_returns                        createdBy = 'demo-seed'
--   gst_transactions                   transactionNumber LIKE 'GSTT-DEMO-%'
--   job_cost_sheets                    costSheetNumber LIKE 'JCS-DEMO-%'
--   period_close_steps                 financialPeriodId of periods FY2025-26-P07 / FY2026-27-P05
--   standard_costs                     createdBy = 'demo-seed'
--   tds_challans                       challanNumber LIKE 'TDSCH-DEMO-%'
--   tds_returns                        createdBy = 'demo-seed'
--   tds_transactions                   tdsNumber LIKE 'TDS-DEMO-%'
--   variance_analysis                  varianceNumber LIKE 'VAR-DEMO-%'
--   wip_accounting                     wipNumber LIKE 'WIP-DEMO-%'
--
-- SKIPPED: reconciliation_matches — hard NOT NULL FK "reconciliationId" -> bank_reconciliations(id),
-- and bank_reconciliations is empty and outside this file's scope.

\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- 1. fixed_assets (stable literal UUIDs so other seed files may reference them)
-- ============================================================================
DELETE FROM asset_depreciation WHERE "assetId" IN (SELECT id FROM fixed_assets WHERE "assetCode" LIKE 'FA-DEMO-%');
DELETE FROM asset_maintenance  WHERE "assetId" IN (SELECT id FROM fixed_assets WHERE "assetCode" LIKE 'FA-DEMO-%');
DELETE FROM fixed_assets WHERE "assetCode" LIKE 'FA-DEMO-%';

INSERT INTO fixed_assets
  (id, "assetCode", "assetName", description, "assetCategory", "assetSubCategory", "glAccountId",
   "acquisitionDate", "acquisitionCost", supplier, "invoiceNumber",
   "depreciationMethod", "usefulLifeYears", "usefulLifeMonths", "depreciationRate", "salvageValue",
   "depreciationStartDate", "accumulatedDepreciation", "netBookValue",
   "lastDepreciationDate", "nextDepreciationDate",
   location, department, "costCenter", manufacturer, model, "serialNumber",
   status, "isDepreciable", "isInsured", "insuranceProvider", "insurancePolicyNumber", "insuranceExpiryDate", "insuredValue",
   notes, "createdBy", "createdAt", "updatedAt")
VALUES
  ('fa5e0000-0000-4000-8000-000000000001','FA-DEMO-001','CNC Laser Cutting Machine','TRUMPF TruLaser 3030 fiber laser, 4kW, sheet-metal cutting line','Plant & Machinery','CNC Machines',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1530'),
   '2022-05-10',8400000,'ProTool Equipment Inc.','PT-2022-0451','Straight Line',10,120,10.00,0,
   '2022-06-01',3570000,4830000,'2026-08-31','2026-09-30',
   'Plant 1 - Fabrication Bay','Production','CC-PROD','TRUMPF','TruLaser 3030','TL3030-22-8841',
   'Active',true,true,'New India Assurance','NIA-FA-88412','2027-03-31',8400000,
   'Primary sheet cutting asset for kitchen equipment fabrication','demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('fa5e0000-0000-4000-8000-000000000002','FA-DEMO-002','CNC Press Brake','AMADA HFE 130-3 hydraulic press brake, 130T bending capacity','Plant & Machinery','CNC Machines',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1530'),
   '2022-05-18',5200000,'ProTool Equipment Inc.','PT-2022-0466','Straight Line',10,120,10.00,0,
   '2022-06-01',2210000,2990000,'2026-08-31','2026-09-30',
   'Plant 1 - Fabrication Bay','Production','CC-PROD','AMADA','HFE 130-3','HFE130-22-3327',
   'Active',true,true,'New India Assurance','NIA-FA-88413','2027-03-31',5200000,
   'Bending cell paired with FA-DEMO-001 laser cutter','demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('fa5e0000-0000-4000-8000-000000000003','FA-DEMO-003','Welding Robot Cell A','FANUC ARC Mate 100iD robotic MIG welding cell with positioner','Plant & Machinery','Robotics',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1530'),
   '2023-08-01',3600000,'Industrial Components Ltd.','ICL-2023-1180','Straight Line',8,96,12.50,0,
   '2023-09-01',1350000,2250000,'2026-08-31','2026-09-30',
   'Plant 1 - Welding Bay','Production','CC-PROD','FANUC','ARC Mate 100iD','AM100-23-5512',
   'Under Maintenance',true,true,'ICICI Lombard','ICL-FA-40021','2026-12-31',3600000,
   'Torch liner replacement in progress; back online mid-Sep 2026','demo-seed','2025-10-01 09:00:00','2026-09-02 11:30:00'),
  ('fa5e0000-0000-4000-8000-000000000004','FA-DEMO-004','Welding Robot Cell B','FANUC ARC Mate 100iD robotic MIG welding cell, second line','Plant & Machinery','Robotics',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1530'),
   '2024-02-12',3840000,'Industrial Components Ltd.','ICL-2024-0233','Straight Line',8,96,12.50,0,
   '2024-03-01',1200000,2640000,'2026-08-31','2026-09-30',
   'Plant 1 - Welding Bay','Production','CC-PROD','FANUC','ARC Mate 100iD','AM100-24-1078',
   'Active',true,true,'ICICI Lombard','ICL-FA-40022','2026-12-31',3840000,
   NULL,'demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('fa5e0000-0000-4000-8000-000000000005','FA-DEMO-005','Powder Coating Line','7-tank pretreatment + electrostatic powder coating booth + curing oven','Plant & Machinery','Finishing',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1530'),
   '2023-01-20',6000000,'Prime Steel Suppliers','PSS-2023-0091','Straight Line',10,120,10.00,0,
   '2023-02-01',2150000,3850000,'2026-08-31','2026-09-30',
   'Plant 1 - Finishing Bay','Production','CC-PROD','Statfield','EcoCoat 3000','EC3000-23-0455',
   'Active',true,true,'New India Assurance','NIA-FA-88414','2027-03-31',6000000,
   NULL,'demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('fa5e0000-0000-4000-8000-000000000006','FA-DEMO-006','Forklift #1','Toyota 8FD25 diesel forklift, 2.5T capacity','Vehicles','Material Handling',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1550'),
   '2022-11-08',1200000,'ProTool Equipment Inc.','PT-2022-0912','Straight Line',8,96,12.50,0,
   '2022-12-01',562500,637500,'2026-08-31','2026-09-30',
   'Plant 1 - Stores','Warehouse','CC-WH','Toyota','8FD25','8FD25-22-6690',
   'Active',true,true,'Bajaj Allianz','BA-FA-71203','2026-11-30',1200000,
   NULL,'demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('fa5e0000-0000-4000-8000-000000000007','FA-DEMO-007','Forklift #2','Toyota 8FD25 diesel forklift, 2.5T capacity, dispatch yard','Vehicles','Material Handling',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1550'),
   '2024-06-14',1152000,'ProTool Equipment Inc.','PT-2024-0388','Straight Line',8,96,12.50,0,
   '2024-07-01',312000,840000,'2026-08-31','2026-09-30',
   'Plant 1 - Dispatch Yard','Logistics','CC-LOG','Toyota','8FD25','8FD25-24-2214',
   'Active',true,true,'Bajaj Allianz','BA-FA-71204','2027-06-30',1152000,
   NULL,'demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('fa5e0000-0000-4000-8000-000000000008','FA-DEMO-008','Factory & Office Building','Main manufacturing shed (4,200 sqm) with attached 2-floor office block','Buildings','Factory Building',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1520'),
   '2019-04-01',45000000,NULL,NULL,'Straight Line',30,360,3.33,0,
   '2019-04-01',11125000,33875000,'2026-08-31','2026-09-30',
   'Peenya Industrial Area, Bengaluru','Facilities','CC-ADMIN',NULL,NULL,NULL,
   'Active',true,true,'New India Assurance','NIA-FA-88401','2027-03-31',45000000,
   'Includes fire-suppression retrofit capitalised in FY2023-24','demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('fa5e0000-0000-4000-8000-000000000009','FA-DEMO-009','Diesel Generator 250 kVA','Kirloskar 250 kVA standby DG set with AMF panel','Plant & Machinery','Utilities',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1530'),
   '2021-03-22',1800000,'ElectroTech Supplies','ETS-2021-0140','Straight Line',10,120,10.00,0,
   '2021-04-01',975000,825000,'2026-08-31','2026-09-30',
   'Plant 1 - Utility Yard','Facilities','CC-ADMIN','Kirloskar','KG1-250WS','KG250-21-0777',
   'Active',true,true,'New India Assurance','NIA-FA-88405','2027-03-31',1800000,
   NULL,'demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('fa5e0000-0000-4000-8000-000000000010','FA-DEMO-010','ERP & CAD Workstation Batch','12x engineering workstations for design and ERP terminals','Office Equipment','IT Hardware',
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='1560'),
   '2024-01-25',960000,'ElectroTech Supplies','ETS-2024-0051','Straight Line',4,48,25.00,0,
   '2024-02-01',620000,340000,'2026-08-31','2026-09-30',
   'Office Block - Design Cell','Engineering','CC-ADMIN','Dell','Precision 3680','BATCH-24-DES12',
   'Active',true,false,NULL,NULL,NULL,NULL,
   NULL,'demo-seed','2025-10-01 09:00:00','2026-08-31 18:00:00');

-- ============================================================================
-- 2. finance_forecast_scenario
-- ============================================================================
DELETE FROM finance_forecast_scenario WHERE company_id = :company;

INSERT INTO finance_forecast_scenario
  (name, assumptions, horizon_months, growth_rate, company_id, created_at, updated_at)
VALUES
  ('FY2026-27 Base Case','{"revenueBasis":"trailing-12m","priceIncrease":0.03,"newCustomers":4,"note":"Steady demand from hospitality segment"}',12,0.0800,:company,'2026-04-05 10:00:00','2026-08-20 15:30:00'),
  ('FY2026-27 Optimistic','{"revenueBasis":"trailing-12m","priceIncrease":0.05,"newCustomers":9,"note":"Assumes Golden Spoon franchise rollout wins"}',12,0.1500,:company,'2026-04-05 10:10:00','2026-08-20 15:30:00'),
  ('FY2026-27 Conservative','{"revenueBasis":"trailing-12m","priceIncrease":0.00,"newCustomers":1,"note":"Flat pricing, defensive working-capital stance"}',12,0.0300,:company,'2026-04-05 10:20:00','2026-08-20 15:30:00'),
  ('Capacity Expansion 24M','{"capex":12500000,"newLine":"second powder-coating line","depreciationImpact":1250000,"note":"Requires FA-DEMO-005 duplicate line"}',24,0.2200,:company,'2026-06-12 11:00:00','2026-08-20 15:30:00'),
  ('Downturn Stress Test','{"revenueShock":-0.12,"dsoIncreaseDays":18,"note":"Hospitality capex freeze scenario"}',12,-0.0500,:company,'2026-07-01 09:30:00','2026-08-20 15:30:00');

-- ============================================================================
-- 3. finance_intercompany_transaction
-- ============================================================================
DELETE FROM finance_intercompany_transaction WHERE reference LIKE 'ICO-DEMO-%';

INSERT INTO finance_intercompany_transaction
  (entity_from, entity_to, transaction_type, amount, currency, date, status, description, reference, company_id, created_at, updated_at)
VALUES
  ('B3 MACBIS India','B3 MACBIS Gulf FZE','Goods Transfer',1850000,'INR','2025-11-14','settled','Export of 2 banquet kitchen lines at transfer price','ICO-DEMO-001',:company,'2025-11-14 12:00:00','2025-12-05 10:00:00'),
  ('B3 MACBIS Gulf FZE','B3 MACBIS India','Management Fee',240000,'INR','2025-12-31','settled','Q3 FY2025-26 shared-services management fee','ICO-DEMO-002',:company,'2025-12-31 17:00:00','2026-01-20 10:00:00'),
  ('B3 MACBIS India','B3 Kitchen Systems USA','Royalty',312000,'INR','2026-03-31','settled','FY2025-26 brand royalty at 1.5% of US net sales','ICO-DEMO-003',:company,'2026-03-31 17:00:00','2026-04-28 10:00:00'),
  ('B3 MACBIS India','B3 MACBIS Gulf FZE','Cost Allocation',96000,'INR','2026-06-30','approved','Q1 FY2026-27 ERP licence and IT cost allocation','ICO-DEMO-004',:company,'2026-06-30 17:00:00','2026-07-15 10:00:00'),
  ('B3 MACBIS Gulf FZE','B3 MACBIS India','Loan',2500000,'INR','2026-07-10','settled','Working-capital loan tranche, 3-year tenor at 9.5%','ICO-DEMO-005',:company,'2026-07-10 11:00:00','2026-07-12 10:00:00'),
  ('B3 MACBIS India','B3 Kitchen Systems USA','Goods Transfer',1420000,'INR','2026-08-22','pending','Export shipment of modular pantry units awaiting settlement','ICO-DEMO-006',:company,'2026-08-22 15:00:00','2026-08-22 15:00:00');

-- ============================================================================
-- 4. finance_payment_reminder
-- ============================================================================
DELETE FROM finance_payment_reminder WHERE company_id = :company;

INSERT INTO finance_payment_reminder
  (target_type, target_id, channel, message, sent_at, status, company_id, recipient_email, subject, attempts, created_at, updated_at)
VALUES
  ('receivable',(SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-033'),'email','Invoice INV-DEMO-033 is overdue. Kindly arrange payment at the earliest to avoid service interruption.','2026-08-18 09:15:00','sent',:company,'tom@riversidebistro.com','Payment overdue: INV-DEMO-033',1,'2026-08-18 09:15:00','2026-08-18 09:15:00'),
  ('receivable',(SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-033'),'email','Second reminder: invoice INV-DEMO-033 remains unpaid 30+ days past due. Account placed on credit watch.','2026-09-02 09:15:00','sent',:company,'tom@riversidebistro.com','Second reminder: INV-DEMO-033 overdue 30+ days',2,'2026-09-02 09:15:00','2026-09-02 09:15:00'),
  ('receivable',(SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-034'),'email','Part payment received against INV-DEMO-034. Balance amount remains outstanding, due on receipt.','2026-08-25 10:30:00','sent',:company,'nina@summitcatering.com','Balance due: INV-DEMO-034',1,'2026-08-25 10:30:00','2026-08-25 10:30:00'),
  ('receivable',(SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-035'),'email','Gentle reminder: invoice INV-DEMO-035 falls due this week as per Net 30 terms.','2026-08-28 11:00:00','sent',:company,'henrik@lakesideresort.com','Upcoming due date: INV-DEMO-035',1,'2026-08-28 11:00:00','2026-08-28 11:00:00'),
  ('receivable',(SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-036'),'email','Invoice INV-DEMO-036 issued; payment due per Net 45 terms.','2026-08-30 14:00:00','sent',:company,'amelia@bluefighotels.com','Invoice issued: INV-DEMO-036',1,'2026-08-30 14:00:00','2026-08-30 14:00:00'),
  ('receivable',(SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-037'),'whatsapp','Hi Marcus, sharing invoice INV-DEMO-037 for the combi-oven order. Payment link enclosed.','2026-09-01 16:45:00','failed',:company,'marcus@harbourgrill.com','Invoice INV-DEMO-037',2,'2026-09-01 16:45:00','2026-09-01 17:05:00'),
  ('receivable',(SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-038'),'email','Scheduled reminder for INV-DEMO-038 ahead of due date.',NULL,'scheduled',:company,'raj@campusdining.edu','Payment reminder: INV-DEMO-038',0,'2026-09-05 08:00:00','2026-09-05 08:00:00'),
  ('receivable',(SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-040'),'email','Scheduled reminder for INV-DEMO-040 ahead of due date.',NULL,'scheduled',:company,'karen@metrohospital.org','Payment reminder: INV-DEMO-040',0,'2026-09-08 08:00:00','2026-09-08 08:00:00');

-- ============================================================================
-- 5. finance_recurring_transactions
-- ============================================================================
DELETE FROM finance_recurring_transactions WHERE company_id = :company;

INSERT INTO finance_recurring_transactions
  (company_id, name, type, amount, frequency, next_run_date, end_date, status, account_name, party_name, occurrences_generated, description, created_at, updated_at)
VALUES
  (:company,'Factory Rent - Peenya Unit 2','expense',45000,'monthly','2026-10-01',NULL,'active','Factory Rent','Peenya Industrial Estates LLP',11,'Monthly rent for leased annex fabrication shed','2025-10-01 09:00:00','2026-09-01 09:00:00'),
  (:company,'Office Rent - City Sales Office','expense',28000,'monthly','2026-10-01',NULL,'active','Office Rent','Brigade Commercial Spaces',11,'Monthly rent for Bengaluru sales office','2025-10-01 09:00:00','2026-09-01 09:00:00'),
  (:company,'Equipment AMC - CNC Machines','expense',15000,'monthly','2026-10-05',NULL,'active','Repairs and Maintenance','MaintainPro Services',11,'Annual maintenance contract billed monthly for CNC assets','2025-10-05 09:00:00','2026-09-05 09:00:00'),
  (:company,'Software Subscriptions','expense',12500,'monthly','2026-10-07','2027-03-31','active','IT and Software Expenses','SaaS Vendors (consolidated)',11,'ERP, CAD and email suite subscriptions','2025-10-07 09:00:00','2026-09-07 09:00:00'),
  (:company,'Insurance Premium - Asset Policy','expense',18000,'monthly','2026-10-10',NULL,'active','Insurance Expense','New India Assurance',11,'Monthly instalment of composite asset insurance policy','2025-10-10 09:00:00','2026-08-10 09:00:00'),
  (:company,'Term Loan EMI - Machinery Loan','payment',62000,'monthly','2026-10-15','2028-09-15','active','Term Loan - HDFC','HDFC Bank Ltd.',11,'EMI on machinery term loan (welding robot cells)','2025-10-15 09:00:00','2026-08-15 09:00:00');

-- ============================================================================
-- 6. finance_report_templates
-- ============================================================================
DELETE FROM finance_report_templates WHERE company_id = :company;

INSERT INTO finance_report_templates
  (company_id, name, category, description, report_type, columns, filters, group_by, is_shared, created_by, created_at, updated_at)
VALUES
  (:company,'Monthly P&L by Cost Center','Profitability','Profit and loss with cost-center drill-down, month vs prior month','profit-and-loss','["account","costCenter","currentMonth","priorMonth","variance"]','{"period":"current-month","status":"Posted"}','costCenter',true,'demo-seed','2025-10-12 10:00:00','2026-07-01 12:00:00'),
  (:company,'Balance Sheet - Schedule III','Statutory','Balance sheet grouped per Companies Act Schedule III heads','balance-sheet','["head","subHead","currentYear","priorYear"]','{"asOf":"period-end"}','head',true,'demo-seed','2025-10-12 10:05:00','2026-07-01 12:00:00'),
  (:company,'Cash Flow - Indirect Method','Liquidity','Operating, investing and financing cash flows from GL movements','cash-flow','["section","lineItem","amount"]','{"period":"current-quarter"}','section',true,'demo-seed','2025-11-02 10:00:00','2026-07-01 12:00:00'),
  (:company,'GST Liability Summary','Statutory','Output vs input tax by month with net payable','tax-summary','["period","outputTax","inputTax","netPayable","status"]','{"taxType":"GST","fy":"2026-27"}','period',true,'demo-seed','2025-11-02 10:10:00','2026-07-01 12:00:00'),
  (:company,'AR Ageing by Customer','Receivables','Outstanding receivables bucketed 0-30/31-60/61-90/90+','ar-ageing','["customer","current","b30","b60","b90","b90plus","total"]','{"status":["Sent","Overdue","Partially Paid"]}','customer',true,'demo-seed','2026-01-15 09:00:00','2026-07-01 12:00:00'),
  (:company,'Job Costing Margin Report','Costing','Estimated vs actual cost and margin per job cost sheet','job-costing','["jobNumber","customer","estimatedCost","actualCost","margin"]','{"status":["In Progress","Completed"]}','jobNumber',false,'demo-seed','2026-03-20 09:00:00','2026-07-01 12:00:00');

-- ============================================================================
-- 7. general_ledger — mirror of posted JE-DEMO journal lines for Jul–Sep 2026
--    (derived row-for-row from journal_entries + journal_entry_lines)
-- ============================================================================
DELETE FROM general_ledger WHERE "transactionNumber" LIKE 'GL-JE-DEMO-%';

INSERT INTO general_ledger
  ("accountId", "periodId", "transactionNumber", "transactionType", "postingDate", "transactionDate",
   "debitAmount", "creditAmount", "netAmount", description,
   "referenceNumber", "referenceType", "referenceId",
   "costCenter", department, project,
   "partyId", "partyName", "partyType",
   currency, "exchangeRate", "baseCurrencyAmount",
   status, "postedBy", "postedAt", "journalEntryId", "lineNumber",
   "createdBy", "createdAt", "updatedAt", "companyId")
SELECT
  jel."accountId"::uuid,
  je."periodId",
  'GL-' || je."journalNumber" || '-L' || jel."lineNumber",
  'Journal Entry'::general_ledger_transactiontype_enum,
  COALESCE(je."postingDate", je."journalDate"),
  je."journalDate",
  jel."debitAmount",
  jel."creditAmount",
  jel."debitAmount" - jel."creditAmount",
  jel.description,
  je."journalNumber",
  'JournalEntry',
  je.id::text,
  jel."costCenter", jel.department, jel.project,
  jel."partyId", jel."partyName", jel."partyType",
  'INR', 1, jel."debitAmount" - jel."creditAmount",
  'Posted'::general_ledger_status_enum,
  'demo-seed',
  COALESCE(je."postingDate", je."journalDate")::timestamp + interval '18 hours',
  je.id::text,
  jel."lineNumber",
  'demo-seed',
  je."journalDate"::timestamp + interval '18 hours',
  je."journalDate"::timestamp + interval '18 hours',
  :company::uuid
FROM journal_entry_lines jel
JOIN journal_entries je ON je.id = jel."journalEntryId"
WHERE je."journalNumber" LIKE 'JE-DEMO-%'
  AND je."journalDate" >= DATE '2026-07-01';

-- ============================================================================
-- 8. gstr_periods — GSTR-1 + GSTR-3B monthly, Oct 2025 .. Aug 2026
-- ============================================================================
DELETE FROM gstr_periods WHERE "periodCode" LIKE 'DEMO-GSTR%';

INSERT INTO gstr_periods
  ("periodCode", month, year, "returnType", "periodStartDate", "periodEndDate", "dueDate",
   status, "isFiled", "filedDate", "acknowledgementNumber", notes, "createdBy", "createdAt", "updatedAt")
SELECT
  'DEMO-' || replace(rt.t,'-','') || '-' || to_char(m.d,'YYYY-MM'),
  EXTRACT(MONTH FROM m.d)::int,
  EXTRACT(YEAR FROM m.d)::int,
  rt.t,
  m.d::date,
  (m.d + interval '1 month - 1 day')::date,
  (m.d + interval '1 month' + CASE WHEN rt.t = 'GSTR-1' THEN interval '10 days' ELSE interval '19 days' END)::date,
  CASE WHEN m.d < DATE '2026-08-01' THEN 'Filed' ELSE 'Open' END,
  m.d < DATE '2026-08-01',
  CASE WHEN m.d < DATE '2026-08-01'
       THEN (m.d + interval '1 month' + CASE WHEN rt.t = 'GSTR-1' THEN interval '9 days' ELSE interval '18 days' END)::date END,
  CASE WHEN m.d < DATE '2026-08-01'
       THEN 'AA290925' || to_char(m.d,'MMYY') || lpad((EXTRACT(MONTH FROM m.d)::int)::text,2,'0') END,
  'Demo GST period for ' || to_char(m.d,'Mon YYYY'),
  'demo-seed',
  m.d::timestamp + interval '1 month 2 days',
  m.d::timestamp + interval '1 month 2 days'
FROM generate_series(DATE '2025-10-01', DATE '2026-08-01', interval '1 month') m(d)
CROSS JOIN (VALUES ('GSTR-1'), ('GSTR-3B')) rt(t);

-- ============================================================================
-- 9. gst_returns — monthly GSTR-3B, Oct 2025 .. Aug 2026
--    (sales ~= monthly Domestic Sales credits in JE-DEMO journals, 18% GST)
-- ============================================================================
DELETE FROM gst_returns WHERE "createdBy" = 'demo-seed';

INSERT INTO gst_returns
  ("returnType", period, "dueDate", status, "filedDate", "ackNo",
   "totalSales", "totalPurchases", "outputTax", "inputTax", "netTax",
   notes, "createdBy", "createdAt", "updatedAt")
VALUES
  ('GSTR-3B','Oct-2025','2025-11-20','Filed','2025-11-18 15:30:00','DEMO-ACK3B-202510',365000,205000,365000*0.18,205000*0.18,(365000-205000)*0.18,NULL,'demo-seed','2025-11-10 10:00:00','2025-11-18 15:30:00'),
  ('GSTR-3B','Nov-2025','2025-12-20','Filed','2025-12-18 15:30:00','DEMO-ACK3B-202511',383000,210000,383000*0.18,210000*0.18,(383000-210000)*0.18,NULL,'demo-seed','2025-12-10 10:00:00','2025-12-18 15:30:00'),
  ('GSTR-3B','Dec-2025','2026-01-20','Filed','2026-01-19 12:10:00','DEMO-ACK3B-202512',402000,224000,402000*0.18,224000*0.18,(402000-224000)*0.18,NULL,'demo-seed','2026-01-10 10:00:00','2026-01-19 12:10:00'),
  ('GSTR-3B','Jan-2026','2026-02-20','Filed','2026-02-18 15:30:00','DEMO-ACK3B-202601',371000,198000,371000*0.18,198000*0.18,(371000-198000)*0.18,NULL,'demo-seed','2026-02-10 10:00:00','2026-02-18 15:30:00'),
  ('GSTR-3B','Feb-2026','2026-03-20','Filed','2026-03-19 11:00:00','DEMO-ACK3B-202602',388000,212000,388000*0.18,212000*0.18,(388000-212000)*0.18,NULL,'demo-seed','2026-03-10 10:00:00','2026-03-19 11:00:00'),
  ('GSTR-3B','Mar-2026','2026-04-20','Filed','2026-04-18 15:30:00','DEMO-ACK3B-202603',395000,230000,395000*0.18,230000*0.18,(395000-230000)*0.18,'Year-end month; includes annual reconciliation entries','demo-seed','2026-04-10 10:00:00','2026-04-18 15:30:00'),
  ('GSTR-3B','Apr-2026','2026-05-20','Filed','2026-05-19 16:00:00','DEMO-ACK3B-202604',410000,226000,410000*0.18,226000*0.18,(410000-226000)*0.18,NULL,'demo-seed','2026-05-10 10:00:00','2026-05-19 16:00:00'),
  ('GSTR-3B','May-2026','2026-06-20','Filed','2026-06-18 15:30:00','DEMO-ACK3B-202605',378000,205000,378000*0.18,205000*0.18,(378000-205000)*0.18,NULL,'demo-seed','2026-06-10 10:00:00','2026-06-18 15:30:00'),
  ('GSTR-3B','Jun-2026','2026-07-20','Filed','2026-07-18 15:30:00','DEMO-ACK3B-202606',392000,215000,392000*0.18,215000*0.18,(392000-215000)*0.18,NULL,'demo-seed','2026-07-10 10:00:00','2026-07-18 15:30:00'),
  ('GSTR-3B','Jul-2026','2026-08-20','Filed','2026-08-19 14:20:00','DEMO-ACK3B-202607',405000,228000,405000*0.18,228000*0.18,(405000-228000)*0.18,NULL,'demo-seed','2026-08-10 10:00:00','2026-08-19 14:20:00'),
  ('GSTR-3B','Aug-2026','2026-09-20','Ready to File',NULL,NULL,368000,201000,368000*0.18,201000*0.18,(368000-201000)*0.18,'Awaiting final ITC reconciliation before filing','demo-seed','2026-09-08 10:00:00','2026-09-08 10:00:00');

-- ============================================================================
-- 10. gst_transactions — sales legs of INV-DEMO-001..008 (18% GST, taxable = total/1.18)
--     plus 4 purchase legs from vendors
-- ============================================================================
DELETE FROM gst_transactions WHERE "transactionNumber" LIKE 'GSTT-DEMO-%';

INSERT INTO gst_transactions
  ("transactionNumber", "transactionDate", "transactionType", "partyId", "partyName", "partyGSTIN", "partyState",
   "invoiceId", "invoiceNumber", "taxableAmount", "cgstAmount", "sgstAmount", "igstAmount", "cessAmount",
   "totalTaxAmount", "totalAmount", "gstRate", "placeOfSupply", "isInterstate", "isReverseCharge", "hsnSacCode",
   "gstrPeriodId", "isFiledInGSTR", "filedDate", "createdBy", "createdAt", "updatedAt")
VALUES
  ('GSTT-DEMO-001','2025-10-06','Sales',(SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants'),'Harbour Grill Restaurants','29AAHCH1234K1Z6','Karnataka',
   (SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-001'),'INV-DEMO-001',11550,1039.50,1039.50,0,0,2079,13629,18.00,'Karnataka',false,false,'8419',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR1-2025-10'),true,'2025-11-10','demo-seed','2025-10-06 12:00:00','2025-11-10 12:00:00'),
  ('GSTT-DEMO-002','2025-10-21','Sales',(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group'),'Blue Fig Hotels Group','27AABCB5678M1Z4','Maharashtra',
   (SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-002'),'INV-DEMO-002',28500,0,0,5130,0,5130,33630,18.00,'Maharashtra',true,false,'8419',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR1-2025-10'),true,'2025-11-10','demo-seed','2025-10-21 12:00:00','2025-11-10 12:00:00'),
  ('GSTT-DEMO-003','2025-11-05','Sales',(SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op'),'Campus Dining Co-op','29AACCC9012P1Z8','Karnataka',
   (SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-003'),'INV-DEMO-003',22500,2025,2025,0,0,4050,26550,18.00,'Karnataka',false,false,'7321',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR1-2025-11'),true,'2025-12-10','demo-seed','2025-11-05 12:00:00','2025-12-10 12:00:00'),
  ('GSTT-DEMO-004','2025-11-18','Sales',(SELECT id::text FROM crm_customers WHERE "customerName"='Summit Catering Services'),'Summit Catering Services','36AADCS3456Q1Z2','Telangana',
   (SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-004'),'INV-DEMO-004',43100,0,0,7758,0,7758,50858,18.00,'Telangana',true,false,'8419',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR1-2025-11'),true,'2025-12-10','demo-seed','2025-11-18 12:00:00','2025-12-10 12:00:00'),
  ('GSTT-DEMO-005','2025-12-02','Sales',(SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens'),'Metro Hospital Kitchens','29AAECM7890R1Z0','Karnataka',
   (SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-005'),'INV-DEMO-005',14500,1305,1305,0,0,2610,17110,18.00,'Karnataka',false,false,'7321',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR1-2025-12'),true,'2026-01-10','demo-seed','2025-12-02 12:00:00','2026-01-10 12:00:00'),
  ('GSTT-DEMO-006','2025-12-10','Sales',(SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain'),'Riverside Bistro Chain','29AAFCR2345S1Z9','Karnataka',
   (SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-006'),'INV-DEMO-006',10800,972,972,0,0,1944,12744,18.00,'Karnataka',false,false,'8419',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR1-2025-12'),true,'2026-01-10','demo-seed','2025-12-10 12:00:00','2026-01-10 12:00:00'),
  ('GSTT-DEMO-007','2025-12-15','Sales',(SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises'),'Golden Spoon Franchises','33AAGCG6789T1Z7','Tamil Nadu',
   (SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-007'),'INV-DEMO-007',67000,0,0,12060,0,12060,79060,18.00,'Tamil Nadu',true,false,'8419',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR1-2025-12'),true,'2026-01-10','demo-seed','2025-12-15 12:00:00','2026-01-10 12:00:00'),
  ('GSTT-DEMO-008','2026-01-08','Sales',(SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa'),'Lakeside Resort & Spa','32AAHCL0123U1Z5','Kerala',
   (SELECT id::text FROM invoices WHERE "invoiceNumber"='INV-DEMO-008'),'INV-DEMO-008',34300,0,0,6174,0,6174,40474,18.00,'Kerala',true,false,'7321',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR1-2026-01'),true,'2026-02-10','demo-seed','2026-01-08 12:00:00','2026-02-10 12:00:00'),
  ('GSTT-DEMO-009','2025-10-09','Purchase',(SELECT id::text FROM vendors WHERE "vendorName"='Prime Steel Suppliers'),'Prime Steel Suppliers','29AAACP4567V1Z3','Karnataka',
   NULL,'PSS/2025/1042',150000,13500,13500,0,0,27000,177000,18.00,'Karnataka',false,false,'7219',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR3B-2025-10'),true,'2025-11-18','demo-seed','2025-10-09 12:00:00','2025-11-18 12:00:00'),
  ('GSTT-DEMO-010','2025-11-12','Purchase',(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.'),'Bharat Metal Works Pvt. Ltd.','27AABCB8901W1Z1','Maharashtra',
   NULL,'BMW/2025/0788',180000,0,0,32400,0,32400,212400,18.00,'Karnataka',true,false,'7318',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR3B-2025-11'),true,'2025-12-18','demo-seed','2025-11-12 12:00:00','2025-12-18 12:00:00'),
  ('GSTT-DEMO-011','2026-01-20','Purchase',(SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies'),'ElectroTech Supplies','29AADCE2345X1Z8','Karnataka',
   NULL,'ETS/2026/0119',95000,8550,8550,0,0,17100,112100,18.00,'Karnataka',false,false,'8536',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR3B-2026-01'),true,'2026-02-18','demo-seed','2026-01-20 12:00:00','2026-02-18 12:00:00'),
  ('GSTT-DEMO-012','2026-08-19','Purchase',(SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services'),'MaintainPro Services','29AAFCM6789Y1Z6','Karnataka',
   NULL,'MPS/2026/0561',120000,10800,10800,0,0,21600,141600,18.00,'Karnataka',false,false,'9987',
   (SELECT id::text FROM gstr_periods WHERE "periodCode"='DEMO-GSTR3B-2026-08'),false,NULL,'demo-seed','2026-08-19 12:00:00','2026-08-19 12:00:00');

-- ============================================================================
-- 11. job_cost_sheets
-- ============================================================================
DELETE FROM job_cost_sheets WHERE "costSheetNumber" LIKE 'JCS-DEMO-%';

INSERT INTO job_cost_sheets
  ("costSheetNumber", "jobNumber", "jobName", "projectType", customer, "costingDate", status,
   "materialCost", "laborCost", "overheadCost", "totalEstimatedCost", "totalActualCost", "profitMargin",
   "costEngineer", notes, "createdBy", "createdAt", "updatedAt")
VALUES
  ('JCS-DEMO-001','WO-DEMO-0001','Banquet Kitchen Line - Blue Fig Mumbai','Turnkey Kitchen','Blue Fig Hotels Group','2025-10-20','Completed',
   612000,148000,96000,856000,871500,18.50,'Anita Rao','Actuals closed with 1.8% overrun on SS sheet consumption','demo-seed','2025-10-20 10:00:00','2026-01-15 17:00:00'),
  ('JCS-DEMO-002','WO-DEMO-0002','Combi Oven Battery - Harbour Grill','Equipment Build','Harbour Grill Restaurants','2025-11-10','Completed',
   284000,72000,45000,401000,396200,22.00,'Anita Rao',NULL,'demo-seed','2025-11-10 10:00:00','2026-02-05 17:00:00'),
  ('JCS-DEMO-003','WO-DEMO-0003','Hospital Tray-Line System - Metro','Institutional','Metro Hospital Kitchens','2026-01-12','Approved',
   455000,118000,74000,647000,0,16.00,'Vikram Nair','Approved estimate; production in progress','demo-seed','2026-01-12 10:00:00','2026-06-01 17:00:00'),
  ('JCS-DEMO-004','WO-DEMO-0004','Franchise Kit Standard Pack x6','Franchise Rollout','Golden Spoon Franchises','2026-03-05','In Progress',
   702000,164000,105000,971000,512300,20.00,'Vikram Nair','Batch 3 of 6 in fabrication; actuals at 52%','demo-seed','2026-03-05 10:00:00','2026-08-28 17:00:00'),
  ('JCS-DEMO-005','WO-DEMO-0005','Resort Buffet Counters - Lakeside','Custom Fabrication','Lakeside Resort & Spa','2026-05-18','In Progress',
   238000,64000,41000,343000,187400,19.50,'Anita Rao',NULL,'demo-seed','2026-05-18 10:00:00','2026-09-01 17:00:00'),
  ('JCS-DEMO-006','WO-DEMO-0006','Campus Dishwash Retrofit','Retrofit','Campus Dining Co-op','2026-07-22','Draft',
   126000,38000,22000,186000,0,15.00,'Vikram Nair','Pending customer sign-off on revised scope','demo-seed','2026-07-22 10:00:00','2026-09-05 17:00:00');

-- ============================================================================
-- 12. period_close_steps — Oct 2025 fully closed; Aug 2026 close in progress
-- ============================================================================
DELETE FROM period_close_steps WHERE "financialPeriodId" IN
  (SELECT id::text FROM financial_periods WHERE "periodCode" IN ('FY2025-26-P07','FY2026-27-P05'));

INSERT INTO period_close_steps
  ("financialPeriodId", "stepKey", "stepName", description, "sortOrder", status, "completedBy", "completedAt", "createdAt", "updatedAt")
SELECT
  p.id::text,
  s.key,
  s.name,
  s.descr,
  s.ord,
  CASE WHEN p."periodCode" = 'FY2025-26-P07' THEN 'completed'
       WHEN s.ord <= 3 THEN 'completed'
       WHEN s.ord = 4 THEN 'in-progress'
       ELSE 'not-started' END,
  CASE WHEN p."periodCode" = 'FY2025-26-P07' OR s.ord <= 3 THEN 'finance.controller' END,
  CASE WHEN p."periodCode" = 'FY2025-26-P07' THEN TIMESTAMP '2025-11-05 15:00:00' + (s.ord || ' hours')::interval
       WHEN s.ord <= 3 THEN TIMESTAMP '2026-09-04 15:00:00' + (s.ord || ' hours')::interval END,
  CASE WHEN p."periodCode" = 'FY2025-26-P07' THEN TIMESTAMP '2025-11-01 09:00:00' ELSE TIMESTAMP '2026-09-01 09:00:00' END,
  CASE WHEN p."periodCode" = 'FY2025-26-P07' THEN TIMESTAMP '2025-11-05 18:00:00' ELSE TIMESTAMP '2026-09-08 18:00:00' END
FROM financial_periods p
CROSS JOIN (VALUES
  ('subledger-close','Close AR/AP Subledgers','Ensure all invoices, payments and credit notes for the month are posted',1),
  ('bank-reconciliation','Complete Bank Reconciliations','Reconcile all bank accounts against statements',2),
  ('depreciation-run','Run Monthly Depreciation','Post depreciation for all active fixed assets',3),
  ('accrual-postings','Post Accruals & Provisions','Book expense accruals, provisions and prepaid amortisation',4),
  ('gst-reconciliation','Reconcile GST Liability','Match output/input tax GL balances to GSTR workings',5),
  ('trial-balance-review','Review Trial Balance & Lock Period','Controller sign-off and period lock',6)
) s(key, name, descr, ord)
WHERE p."periodCode" IN ('FY2025-26-P07','FY2026-27-P05');

-- ============================================================================
-- 13. standard_costs — per manufactured item, tied to items.standardCost
-- ============================================================================
DELETE FROM standard_costs WHERE "createdBy" = 'demo-seed';

INSERT INTO standard_costs
  ("productId", "productName", "productCode", "effectiveFromDate", "effectiveToDate",
   "materialCost", "laborCost", "overheadCost", "otherCost", "totalStandardCost",
   "materialComponents", "laborComponents", "overheadComponents",
   notes, "isActive", "createdBy", "createdAt", "updatedAt")
VALUES
  ((SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'Precision Gearbox PG-50','FG-GBX-001','2025-10-01',NULL,
   14000,5000,2600,400,22000,
   '[{"component":"Gearbox Housing (Machined)","cost":2800},{"component":"Gear set & shafts","cost":9400},{"component":"Bearings & seals","cost":1800}]',
   '[{"operation":"Assembly","hours":6,"rate":550},{"operation":"Testing","hours":2.9,"rate":586}]',
   '[{"basis":"Machine hours","cost":2600}]',
   'Matches items.standardCost = 22000',true,'demo-seed','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ((SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'Industrial Motor 5HP','FG-MTR-001','2025-10-01',NULL,
   8200,2800,1300,200,12500,
   '[{"component":"Stator & rotor","cost":5400},{"component":"Copper windings","cost":1900},{"component":"Housing & fittings","cost":900}]',
   '[{"operation":"Winding & assembly","hours":4,"rate":700}]',
   '[{"basis":"Machine hours","cost":1300}]',
   'Matches items.standardCost = 12500',true,'demo-seed','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ((SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'Centrifugal Pump CP-200','FG-PMP-001','2025-10-01',NULL,
   5600,1900,850,150,8500,
   '[{"component":"Impeller & volute","cost":3100},{"component":"Mechanical Seal MS-40","cost":1200},{"component":"Baseplate & hardware","cost":1300}]',
   '[{"operation":"Assembly & balancing","hours":3,"rate":633}]',
   '[{"basis":"Machine hours","cost":850}]',
   'Matches items.standardCost = 8500',true,'demo-seed','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ((SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'Gearbox Housing (Machined)','WIP-GBX-001','2025-10-01',NULL,
   1900,600,280,20,2800,
   '[{"component":"Aluminum Rod 20mm","cost":960},{"component":"Steel Sheet 2mm","cost":940}]',
   '[{"operation":"CNC machining","hours":1.2,"rate":500}]',
   '[{"basis":"Machine hours","cost":280}]',
   'Matches items.standardCost = 2800',true,'demo-seed','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ((SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'Drive Shaft Assembly (WIP)','WIP-SFT-001','2025-10-01',NULL,
   800,300,140,10,1250,
   '[{"component":"Aluminum Rod 20mm","cost":640},{"component":"Ball Bearing 6205","cost":160}]',
   '[{"operation":"Turning & keyway","hours":0.6,"rate":500}]',
   '[{"basis":"Machine hours","cost":140}]',
   'Matches items.standardCost = 1250',true,'demo-seed','2025-10-01 09:00:00','2025-10-01 09:00:00');

-- ============================================================================
-- 14. tds_challans — monthly TDS deposits (due 7th of following month)
-- ============================================================================
DELETE FROM tds_challans WHERE "challanNumber" LIKE 'TDSCH-DEMO-%';

INSERT INTO tds_challans
  ("challanNumber", "challanDate", amount, section, "bankName", "bsrCode", status, quarter, notes, "createdBy", "createdAt", "updatedAt")
VALUES
  ('TDSCH-DEMO-001','2025-11-06',3600,'194C','State Bank of India','0004329','Paid','Q3 FY2025-26','TDS on contractor payments deducted Oct 2025','demo-seed','2025-11-06 11:00:00','2025-11-06 11:00:00'),
  ('TDSCH-DEMO-002','2025-12-05',11400,'194C','State Bank of India','0004329','Paid','Q3 FY2025-26','TDS on contractor payments deducted Nov 2025','demo-seed','2025-12-05 11:00:00','2025-12-05 11:00:00'),
  ('TDSCH-DEMO-003','2026-01-06',8500,'194J','State Bank of India','0004329','Paid','Q3 FY2025-26','TDS on professional fees deducted Dec 2025','demo-seed','2026-01-06 11:00:00','2026-01-06 11:00:00'),
  ('TDSCH-DEMO-004','2026-02-05',14500,'192','State Bank of India','0004329','Paid','Q4 FY2025-26','TDS on salaries deducted Jan 2026','demo-seed','2026-02-05 11:00:00','2026-02-05 11:00:00'),
  ('TDSCH-DEMO-005','2026-04-06',6400,'194C','State Bank of India','0004329','Paid','Q4 FY2025-26','TDS on contractor payments deducted Mar 2026','demo-seed','2026-04-06 11:00:00','2026-04-06 11:00:00'),
  ('TDSCH-DEMO-006','2026-05-06',5000,'194C','State Bank of India','0004329','Paid','Q1 FY2026-27','TDS on contractor payments deducted Apr 2026','demo-seed','2026-05-06 11:00:00','2026-05-06 11:00:00'),
  ('TDSCH-DEMO-007','2026-07-06',9200,'194J','State Bank of India','0004329','Paid','Q1 FY2026-27','TDS on professional fees deducted Jun 2026','demo-seed','2026-07-06 11:00:00','2026-07-06 11:00:00'),
  ('TDSCH-DEMO-008','2026-09-05',7300,'194C','State Bank of India','0004329','Pending','Q2 FY2026-27','TDS deducted Aug 2026; challan generated, payment scheduled','demo-seed','2026-09-05 11:00:00','2026-09-05 11:00:00');

-- ============================================================================
-- 15. tds_returns — quarterly 24Q (salary) + 26Q (non-salary)
-- ============================================================================
DELETE FROM tds_returns WHERE "createdBy" = 'demo-seed';

INSERT INTO tds_returns
  ("formType", quarter, "dueDate", status, "filedDate", "acknowledgementNumber",
   "totalDeductions", "totalDeposited", "deducteeCount", notes, "createdBy", "createdAt", "updatedAt")
VALUES
  ('24Q','Q3 FY2025-26','2026-01-31','Filed','2026-01-24 14:00:00','DEMO-TDSACK-24Q-Q3',43500,43500,12,NULL,'demo-seed','2026-01-15 10:00:00','2026-01-24 14:00:00'),
  ('26Q','Q3 FY2025-26','2026-01-31','Filed','2026-01-24 14:30:00','DEMO-TDSACK-26Q-Q3',23500,23500,5,'Contractor and professional payments Oct-Dec 2025','demo-seed','2026-01-15 10:00:00','2026-01-24 14:30:00'),
  ('24Q','Q4 FY2025-26','2026-05-31','Filed','2026-05-22 15:00:00','DEMO-TDSACK-24Q-Q4',43500,43500,12,NULL,'demo-seed','2026-05-12 10:00:00','2026-05-22 15:00:00'),
  ('26Q','Q4 FY2025-26','2026-05-31','Filed','2026-05-22 15:30:00','DEMO-TDSACK-26Q-Q4',19800,19800,4,NULL,'demo-seed','2026-05-12 10:00:00','2026-05-22 15:30:00'),
  ('24Q','Q1 FY2026-27','2026-07-31','Filed','2026-07-28 12:00:00','DEMO-TDSACK-24Q-Q1',44800,44800,13,NULL,'demo-seed','2026-07-15 10:00:00','2026-07-28 12:00:00'),
  ('26Q','Q1 FY2026-27','2026-07-31','Filed','2026-07-28 12:30:00','DEMO-TDSACK-26Q-Q1',21400,21400,5,NULL,'demo-seed','2026-07-15 10:00:00','2026-07-28 12:30:00');

-- ============================================================================
-- 16. tds_transactions — deduction-level detail (Indian FY: quarter 1 = Apr-Jun)
-- ============================================================================
DELETE FROM tds_transactions WHERE "tdsNumber" LIKE 'TDS-DEMO-%';

INSERT INTO tds_transactions
  ("tdsNumber", "transactionDate", "deductionDate", "partyId", "partyName", "partyPAN", "partyType",
   "tdsSection", "grossAmount", "tdsRate", "tdsAmount", "netPayableAmount", surcharge, "educationCess", "totalTDSAmount",
   "certificateNumber", "certificateDate", "certificateIssued", "financialYear", quarter,
   "isFiledInReturn", "filedDate", "challanNumber", "challanDate", "bsrCode", "isPaid", "paidDate",
   notes, "createdBy", "createdAt", "updatedAt")
VALUES
  ('TDS-DEMO-001','2025-10-18','2025-10-18',(SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services'),'MaintainPro Services','AAFCM6789J','Vendor',
   '194C',180000,2.00,3600,176400,0,0,3600,
   'TDSC-DEMO-001','2026-01-30',true,2025,3,true,'2026-01-24','TDSCH-DEMO-001','2025-11-06','0004329',true,'2025-11-06',
   'AMC charges for CNC machines','demo-seed','2025-10-18 12:00:00','2026-01-30 12:00:00'),
  ('TDS-DEMO-002','2025-11-08','2025-11-08',(SELECT id::text FROM vendors WHERE "vendorName"='ProTool Equipment Inc.'),'ProTool Equipment Inc.','AABCP4321K','Vendor',
   '194C',250000,2.00,5000,245000,0,0,5000,
   'TDSC-DEMO-002','2026-01-30',true,2025,3,true,'2026-01-24','TDSCH-DEMO-002','2025-12-05','0004329',true,'2025-12-05',
   'Machine relocation and installation works','demo-seed','2025-11-08 12:00:00','2026-01-30 12:00:00'),
  ('TDS-DEMO-003','2025-11-20','2025-11-20',(SELECT id::text FROM vendors WHERE "vendorName"='Bharat Metal Works Pvt. Ltd.'),'Bharat Metal Works Pvt. Ltd.','AAACB1234L','Vendor',
   '194C',320000,2.00,6400,313600,0,0,6400,
   'TDSC-DEMO-003','2026-01-30',true,2025,3,true,'2026-01-24','TDSCH-DEMO-002','2025-12-05','0004329',true,'2025-12-05',
   'Job-work fabrication of SS counters','demo-seed','2025-11-20 12:00:00','2026-01-30 12:00:00'),
  ('TDS-DEMO-004','2025-12-12','2025-12-12',(SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services'),'MaintainPro Services','AAFCM6789J','Vendor',
   '194J',85000,10.00,8500,76500,0,0,8500,
   'TDSC-DEMO-004','2026-01-30',true,2025,3,true,'2026-01-24','TDSCH-DEMO-003','2026-01-06','0004329',true,'2026-01-06',
   'Instrument calibration consultancy (professional fee)','demo-seed','2025-12-12 12:00:00','2026-01-30 12:00:00'),
  ('TDS-DEMO-005','2026-01-31','2026-01-31','demo-employee-ramesh-iyer','Ramesh Iyer','ABCPI4567M','Employee',
   '192',145000,10.00,14500,130500,0,0,14500,
   'TDSC-DEMO-005','2026-06-10',true,2025,4,true,'2026-05-22','TDSCH-DEMO-004','2026-02-05','0004329',true,'2026-02-05',
   'Monthly salary TDS - plant manager (slab-averaged)','demo-seed','2026-01-31 12:00:00','2026-06-10 12:00:00'),
  ('TDS-DEMO-006','2026-03-15','2026-03-15',(SELECT id::text FROM vendors WHERE "vendorName"='PackRight Solutions'),'PackRight Solutions','AAJCP8765N','Vendor',
   '194C',320000,2.00,6400,313600,0,0,6400,
   'TDSC-DEMO-006','2026-06-10',true,2025,4,true,'2026-05-22','TDSCH-DEMO-005','2026-04-06','0004329',true,'2026-04-06',
   'Annual packaging materials contract','demo-seed','2026-03-15 12:00:00','2026-06-10 12:00:00'),
  ('TDS-DEMO-007','2026-04-22','2026-04-22',(SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies'),'ElectroTech Supplies','AADCE3456P','Vendor',
   '194C',250000,2.00,5000,245000,0,0,5000,
   'TDSC-DEMO-007','2026-08-05',true,2026,1,true,'2026-07-28','TDSCH-DEMO-006','2026-05-06','0004329',true,'2026-05-06',
   'Electrical panel installation works','demo-seed','2026-04-22 12:00:00','2026-08-05 12:00:00'),
  ('TDS-DEMO-008','2026-06-18','2026-06-18',(SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services'),'MaintainPro Services','AAFCM6789J','Vendor',
   '194J',92000,10.00,9200,82800,0,0,9200,
   NULL,NULL,false,2026,1,true,'2026-07-28','TDSCH-DEMO-007','2026-07-06','0004329',true,'2026-07-06',
   'Energy audit professional fees; certificate pending','demo-seed','2026-06-18 12:00:00','2026-07-28 12:00:00');

-- ============================================================================
-- 17. variance_analysis — standard vs actual per product batch
--     (actualCost = standardCost + totalVariance; totals = sum of components)
-- ============================================================================
DELETE FROM variance_analysis WHERE "varianceNumber" LIKE 'VAR-DEMO-%';

INSERT INTO variance_analysis
  ("varianceNumber", "periodId", "productId", "productName", "analysisDate",
   "materialPriceVariance", "materialQuantityVariance", "totalMaterialVariance",
   "laborRateVariance", "laborEfficiencyVariance", "totalLaborVariance",
   "overheadSpendingVariance", "overheadEfficiencyVariance", "overheadVolumeVariance", "totalOverheadVariance",
   "totalVariance", "variancePercentage", "standardCost", "actualCost",
   explanation, "correctiveActions", "analyzedBy", "createdBy", "createdAt", "updatedAt")
VALUES
  ('VAR-DEMO-001',(SELECT id::text FROM financial_periods WHERE "periodCode"='FY2025-26-P07'),
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'Precision Gearbox PG-50','2025-11-04',
   9200,3400,12600, 1800,1200,3000, 800,300,100,1200,
   16800,3.82,440000,456800,
   'SS input price spike drove material price variance on 20-unit batch','Negotiated quarterly price lock with Prime Steel Suppliers','Anita Rao','demo-seed','2025-11-04 15:00:00','2025-11-04 15:00:00'),
  ('VAR-DEMO-002',(SELECT id::text FROM financial_periods WHERE "periodCode"='FY2025-26-P07'),
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'Industrial Motor 5HP','2025-11-04',
   -2400,1100,-1300, 900,-600,300, 400,-200,0,200,
   -800,-0.21,375000,374200,
   'Copper price dip offset minor rework on winding line','None required; favourable overall','Anita Rao','demo-seed','2025-11-04 15:30:00','2025-11-04 15:30:00'),
  ('VAR-DEMO-003',(SELECT id::text FROM financial_periods WHERE "periodCode"='FY2025-26-P10'),
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'Centrifugal Pump CP-200','2026-02-03',
   3100,900,4000, 1200,800,2000, 500,200,300,1000,
   7000,2.74,255000,262000,
   'Seal supplier changeover caused quantity variance and extra fitting time','Qualify second seal vendor; update routing time standards','Vikram Nair','demo-seed','2026-02-03 15:00:00','2026-02-03 15:00:00'),
  ('VAR-DEMO-004',(SELECT id::text FROM financial_periods WHERE "periodCode"='FY2025-26-P10'),
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'Gearbox Housing (Machined)','2026-02-03',
   1500,-400,1100, 600,400,1000, 300,100,0,400,
   2500,2.98,84000,86500,
   'Aluminium rod price increase; partly offset by lower scrap','Scrap-rate improvement sustained from new fixturing','Vikram Nair','demo-seed','2026-02-03 15:30:00','2026-02-03 15:30:00'),
  ('VAR-DEMO-005',(SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P04'),
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'Precision Gearbox PG-50','2026-08-05',
   4200,-1500,2700, 2100,1400,3500, 900,400,200,1500,
   7700,1.75,440000,447700,
   'Overtime premium during Golden Spoon rollout drove labor variances','Level-load schedule for Sep; added second shift on assembly','Anita Rao','demo-seed','2026-08-05 15:00:00','2026-08-05 15:00:00'),
  ('VAR-DEMO-006',(SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P04'),
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'Centrifugal Pump CP-200','2026-08-05',
   -1800,600,-1200, 700,500,1200, 400,-300,100,200,
   200,0.08,255000,255200,
   'Near-standard performance; minor mixed variances','None required','Anita Rao','demo-seed','2026-08-05 15:30:00','2026-08-05 15:30:00');

-- ============================================================================
-- 18. wip_accounting — WIP valuation against open work orders
--     (totalWIPValue = material + labor + overhead)
-- ============================================================================
DELETE FROM wip_accounting WHERE "wipNumber" LIKE 'WIP-DEMO-%';

INSERT INTO wip_accounting
  ("wipNumber", "productionOrderId", "productionOrderNumber", "periodId", "valuationDate",
   "productId", "productName", quantity, unit,
   "materialCost", "laborCost", "overheadCost", "totalWIPValue", "completionPercentage",
   status, department, notes, "createdBy", "createdAt", "updatedAt")
VALUES
  ('WIP-DEMO-001',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0001'),'WO-DEMO-0001',
   (SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P04'),'2026-07-31',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'Precision Gearbox PG-50',12,'Nos',
   142000,38000,19500,199500,72.00,'In Progress','Production','Batch held at testing stage awaiting bearings','demo-seed','2026-07-31 18:00:00','2026-07-31 18:00:00'),
  ('WIP-DEMO-002',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0002'),'WO-DEMO-0002',
   (SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P04'),'2026-07-31',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'Industrial Motor 5HP',25,'Nos',
   168000,44000,22000,234000,80.00,'In Progress','Production',NULL,'demo-seed','2026-07-31 18:00:00','2026-07-31 18:00:00'),
  ('WIP-DEMO-003',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0003'),'WO-DEMO-0003',
   (SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P05'),'2026-08-31',
   (SELECT id::text FROM items WHERE "itemCode"='FG-PMP-001'),'Centrifugal Pump CP-200',30,'Nos',
   126000,31500,16800,174300,65.00,'In Progress','Production',NULL,'demo-seed','2026-08-31 18:00:00','2026-08-31 18:00:00'),
  ('WIP-DEMO-004',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0004'),'WO-DEMO-0004',
   (SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P05'),'2026-08-31',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-GBX-001'),'Gearbox Housing (Machined)',60,'Nos',
   96000,21000,11400,128400,55.00,'In Progress','Production','Machining complete; deburr and inspection pending','demo-seed','2026-08-31 18:00:00','2026-08-31 18:00:00'),
  ('WIP-DEMO-005',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0005'),'WO-DEMO-0005',
   (SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P05'),'2026-08-31',
   (SELECT id::text FROM items WHERE "itemCode"='WIP-SFT-001'),'Drive Shaft Assembly (WIP)',80,'Nos',
   58000,14500,7800,80300,40.00,'In Progress','Production',NULL,'demo-seed','2026-08-31 18:00:00','2026-08-31 18:00:00'),
  ('WIP-DEMO-006',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0006'),'WO-DEMO-0006',
   (SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P04'),'2026-07-31',
   (SELECT id::text FROM items WHERE "itemCode"='FG-GBX-001'),'Precision Gearbox PG-50',8,'Nos',
   118000,32000,16200,166200,100.00,'Completed','Production','Transferred to FG on 2026-08-02','demo-seed','2026-07-31 18:00:00','2026-08-02 10:00:00'),
  ('WIP-DEMO-007',(SELECT id::text FROM work_orders WHERE "workOrderNumber"='WO-DEMO-0007'),'WO-DEMO-0007',
   (SELECT id::text FROM financial_periods WHERE "periodCode"='FY2026-27-P05'),'2026-08-31',
   (SELECT id::text FROM items WHERE "itemCode"='FG-MTR-001'),'Industrial Motor 5HP',15,'Nos',
   99000,26000,13500,138500,30.00,'In Progress','Production',NULL,'demo-seed','2026-08-31 18:00:00','2026-08-31 18:00:00');

-- ============================================================================
-- SKIPPED: reconciliation_matches
-- "reconciliationId" is a NOT NULL uuid FK to bank_reconciliations(id), which has
-- 0 rows and is not part of this seed file's table list. Seed bank_reconciliations
-- first, then this table can be populated.
-- ============================================================================
