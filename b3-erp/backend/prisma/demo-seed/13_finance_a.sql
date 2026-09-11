-- Demo seed — Finance A (treasury, budgeting, cash flow, AR/AP summaries, finance extras) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001 (where the column exists).
-- Idempotent: clears demo rows first (DEMO- prefixed codes / company_id marker), then re-inserts.
-- Delete predicates:
--   bank_statements            -> bankAccountId of BNK-DEMO-% accounts
--   bank_reconciliations       -> reconciliationNumber LIKE 'RECON-DEMO-%'
--   bank_accounts              -> accountCode LIKE 'BNK-DEMO-%'
--   budget_lines               -> budgetId of BUD-DEMO-% budgets
--   budgets                    -> budgetCode LIKE 'BUD-DEMO-%'
--   cash_flow_transactions     -> transactionNumber LIKE 'CFT-DEMO-%'
--   anticipated_receipts       -> receiptNumber LIKE 'AREC-DEMO-%'
--   anticipated_payments       -> paymentNumber LIKE 'APAY-DEMO-%'
--   finance_ar_customer_account-> customerCode LIKE 'CUS-DEMO-%'
--   finance_ap_vendor_account  -> vendorCode LIKE 'VEN-DEMO-%'
--   finance_* extras tables    -> company_id = :company
-- SKIPPED (hard NOT NULL FK to fixed_assets, seeded by another file): asset_depreciation, asset_maintenance.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- Bank accounts (delete dependents first: statements -> reconciliations -> accounts)
-- ---------------------------------------------------------------------------
DELETE FROM bank_statements WHERE "bankAccountId" IN
  (SELECT id::text FROM bank_accounts WHERE "accountCode" LIKE 'BNK-DEMO-%');
DELETE FROM bank_reconciliations WHERE "reconciliationNumber" LIKE 'RECON-DEMO-%';
DELETE FROM bank_accounts WHERE "accountCode" LIKE 'BNK-DEMO-%';

INSERT INTO bank_accounts
  ("accountCode","accountName","bankName","branchName","branchCode","accountNumber","ifscCode","swiftCode",
   "accountType",currency,status,"openingBalance","currentBalance","balanceAsOfDate","overdraftLimit","minimumBalance",
   "isReconciledUptoDate","lastReconciledDate","lastReconciledBalance","contactPerson","contactPhone","contactEmail",
   city,state,country,"hasOnlineBanking","isDefault",notes,"createdBy","createdAt","updatedAt")
VALUES
  ('BNK-DEMO-001','B3 MACBIS Operations Account','HDFC Bank','Peenya Industrial Area','HDFC0001234','50200045678901','HDFC0001234','HDFCINBB',
   'Current','INR','Active',4250000.00,6182437.00,'2026-08-31',NULL,100000.00,
   true,'2026-07-31',5731210.00,'Ramesh Iyer','+91-80-4455-1234','peenya.branch@hdfcbank.com',
   'Bengaluru','Karnataka','India',true,true,'Primary operating account for collections and vendor payments','finance.admin','2025-10-01 09:00:00','2026-08-31 18:00:00'),
  ('BNK-DEMO-002','B3 MACBIS Payroll Account','ICICI Bank','Yeshwanthpur','ICIC0002210','000405112233','ICIC0002210','ICICINBB',
   'Current','INR','Active',1500000.00,912560.00,'2026-08-31',NULL,50000.00,
   false,'2026-06-30',1104320.00,'Kavita Menon','+91-80-2233-8899','yeshwanthpur@icicibank.com',
   'Bengaluru','Karnataka','India',true,false,'Dedicated salary disbursement account','finance.admin','2025-10-01 09:05:00','2026-08-31 18:00:00'),
  ('BNK-DEMO-003','B3 MACBIS Cash Credit Facility','State Bank of India','Industrial Finance Branch','SBIN0007601','38765412098','SBIN0007601','SBININBB',
   'Cash Credit','INR','Active',-1800000.00,-2450000.00,'2026-08-31',10000000.00,NULL,
   false,'2026-05-31',-2100000.00,'Arun Prasad','+91-80-2559-6600','ifb.blr@sbi.co.in',
   'Bengaluru','Karnataka','India',true,false,'Working-capital cash credit line against stock and receivables','finance.admin','2025-10-05 10:00:00','2026-08-31 18:00:00'),
  ('BNK-DEMO-004','B3 MACBIS Export Collections (USD)','HDFC Bank','Peenya Industrial Area','HDFC0001234','50200099887702','HDFC0001234','HDFCINBB',
   'Current','USD','Active',85000.00,142650.00,'2026-08-31',NULL,10000.00,
   false,'2026-04-30',118400.00,'Ramesh Iyer','+91-80-4455-1234','peenya.branch@hdfcbank.com',
   'Bengaluru','Karnataka','India',true,false,'EEFC account for export invoice collections','finance.admin','2025-11-01 09:30:00','2026-08-31 18:00:00'),
  ('BNK-DEMO-005','B3 MACBIS Fixed Deposit','Axis Bank','MG Road','UTIB0000042','917040012345678','UTIB0000042','AXISINBB',
   'Fixed Deposit','INR','Active',5000000.00,5262500.00,'2026-06-30',NULL,NULL,
   true,'2026-06-30',5262500.00,'Sneha Rao','+91-80-2555-0142','mgroad.ops@axisbank.com',
   'Bengaluru','Karnataka','India',false,false,'12-month FD at 7.1% maturing 2026-11-15; surplus funds parked','finance.admin','2025-11-15 11:00:00','2026-06-30 18:00:00');

-- ---------------------------------------------------------------------------
-- Bank reconciliations
-- ---------------------------------------------------------------------------
INSERT INTO bank_reconciliations
  ("reconciliationNumber","bankAccountId","reconciliationDate","statementStartDate","statementEndDate",
   "openingBalancePerBooks","closingBalancePerBooks","openingBalancePerBank","closingBalancePerBank",
   "totalTransactions","matchedTransactions","unmatchedBookTransactions","unmatchedBankTransactions",
   "totalDifference","unreconciledDebits","unreconciledCredits",status,"isBalanced",
   "reconciledBy","reconciledAt","reviewedBy","reviewedAt","approvedBy","approvedAt",adjustments,notes,"createdBy","createdAt","updatedAt")
VALUES
  ('RECON-DEMO-001',(SELECT id FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-08-04','2026-07-01','2026-07-31',
   5214380.00,5731210.00,5216880.00,5731210.00,
   8,8,0,0,0.00,0.00,0.00,'Approved',true,
   'anita.krishnan','2026-08-04 15:30:00','vikram.shetty','2026-08-05 10:15:00','suresh.nair','2026-08-05 16:40:00',
   '[{"type":"Bank Charges","description":"July account maintenance charges booked on reconciliation","amount":2500,"date":"2026-07-31"}]',
   'July 2026 statement fully reconciled; single adjustment for bank charges','anita.krishnan','2026-08-04 15:30:00','2026-08-05 16:40:00'),
  ('RECON-DEMO-002',(SELECT id FROM bank_accounts WHERE "accountCode"='BNK-DEMO-002'),
   '2026-09-03','2026-08-01','2026-08-31',
   1104320.00,912560.00,1104320.00,948120.00,
   4,2,1,1,35560.00,35560.00,0.00,'In Progress',false,
   'anita.krishnan','2026-09-03 12:00:00',NULL,NULL,NULL,NULL,
   NULL,
   'August 2026 payroll account: one salary reversal on bank not yet booked; one cheque un-presented','anita.krishnan','2026-09-03 12:00:00','2026-09-03 12:00:00');

-- ---------------------------------------------------------------------------
-- Bank statements (statement lines against the two reconciliations)
-- ---------------------------------------------------------------------------
INSERT INTO bank_statements
  ("reconciliationId","bankAccountId","transactionDate","valueDate",description,"referenceNumber","chequeNumber",
   "debitAmount","creditAmount",balance,status,"isMatched",notes,"createdAt","updatedAt")
VALUES
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-07-03','2026-07-03','NEFT CR GOLDEN SPOON FRANCHISES INV-DEMO SETTLEMENT','NEFT-N186260071234',NULL,
   0.00,310000.00,5526880.00,'Matched',true,NULL,'2026-08-04 14:00:00','2026-08-04 15:30:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-07-07','2026-07-07','RTGS DR PRIME STEEL SUPPLIERS PO-2026-118','RTGS-R2026070755',NULL,
   485600.00,0.00,5041280.00,'Matched',true,NULL,'2026-08-04 14:00:00','2026-08-04 15:30:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-07-11','2026-07-11','NEFT CR BLUE FIG HOTELS GROUP PART PAYMENT','NEFT-N186260112044',NULL,
   0.00,225000.00,5266280.00,'Matched',true,NULL,'2026-08-04 14:00:00','2026-08-04 15:30:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-07-15','2026-07-16','CHQ DR MAINTAINPRO SERVICES AMC Q2','','000482',
   118000.00,0.00,5148280.00,'Manually Matched',true,'Cheque cleared with one-day value-date lag','2026-08-04 14:00:00','2026-08-04 15:30:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-07-18','2026-07-18','NEFT CR METRO HOSPITAL KITCHENS ON ACCOUNT','NEFT-N186260183310',NULL,
   0.00,204000.00,5352280.00,'Matched',true,NULL,'2026-08-04 14:00:00','2026-08-04 15:30:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-07-22','2026-07-22','RTGS DR ELECTROTECH SUPPLIES PO-2026-131','RTGS-R2026072218',NULL,
   264500.00,0.00,5087780.00,'Matched',true,NULL,'2026-08-04 14:00:00','2026-08-04 15:30:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-07-28','2026-07-28','NEFT CR HARBOUR GRILL RESTAURANTS INV SETTLEMENT','NEFT-N186260284421',NULL,
   0.00,645930.00,5733710.00,'Matched',true,NULL,'2026-08-04 14:00:00','2026-08-04 15:30:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),
   '2026-07-31','2026-07-31','ACCOUNT MAINTENANCE CHARGES JUL 2026','CHG-2026-07',NULL,
   2500.00,0.00,5731210.00,'Manually Matched',true,'Booked via reconciliation adjustment','2026-08-04 14:00:00','2026-08-04 15:30:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-002'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-002'),
   '2026-08-01','2026-08-01','FUND TRANSFER FROM OPERATIONS A/C FOR PAYROLL','TRF-2026-08-01',NULL,
   0.00,1500000.00,2604320.00,'Matched',true,NULL,'2026-09-03 11:00:00','2026-09-03 12:00:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-002'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-002'),
   '2026-08-05','2026-08-05','SALARY BATCH AUG 2026 92 EMPLOYEES','SAL-2026-08',NULL,
   1656200.00,0.00,948120.00,'Matched',true,NULL,'2026-09-03 11:00:00','2026-09-03 12:00:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-002'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-002'),
   '2026-08-12','2026-08-12','SALARY REVERSAL INVALID ACCOUNT EMP B3-0417','SALREV-2026-08',NULL,
   0.00,35560.00,983680.00,'Unmatched',false,'Reversal credited by bank; re-payment not yet booked in books','2026-09-03 11:00:00','2026-09-03 12:00:00'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-002'),
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-002'),
   '2026-08-28','2026-08-28','CHQ DR REIMBURSEMENT F&F SETTLEMENT','','000119',
   35560.00,0.00,948120.00,'Suggested Match',false,'Suggested match against pending F&F voucher','2026-09-03 11:00:00','2026-09-03 12:00:00');

-- ---------------------------------------------------------------------------
-- Budgets (FY2026-27) + budget lines
-- ---------------------------------------------------------------------------
DELETE FROM budget_lines WHERE "budgetId" IN (SELECT id FROM budgets WHERE "budgetCode" LIKE 'BUD-DEMO-%');
DELETE FROM budgets WHERE "budgetCode" LIKE 'BUD-DEMO-%';

INSERT INTO budgets
  ("budgetCode","budgetName","financialYearId","budgetType","startDate","endDate",status,
   department,"costCenter",location,"totalBudgetedAmount","totalActualAmount","totalVariance","utilizationPercentage",
   description,"submittedBy","submittedAt","approvedBy","approvedAt",version,notes,"createdBy","createdAt","updatedAt")
VALUES
  ('BUD-DEMO-001','Production Operating Budget FY2026-27',(SELECT id FROM financial_years WHERE "yearCode"='FY2026-27'),
   'Operating Budget','2026-04-01','2027-03-31','Active','Production','CC-PROD','Peenya Plant',
   18500000.00,7362400.00,11137600.00,39.80,
   'Annual operating budget for the production department: wages, factory rent, utilities, consumables and QC',
   'rajesh.kumar','2026-03-10 11:00:00','suresh.nair','2026-03-18 16:30:00',1,NULL,'rajesh.kumar','2026-03-05 10:00:00','2026-08-31 18:00:00'),
  ('BUD-DEMO-002','Sales & Marketing Operating Budget FY2026-27',(SELECT id FROM financial_years WHERE "yearCode"='FY2026-27'),
   'Operating Budget','2026-04-01','2027-03-31','Active','Sales & Marketing','CC-SALES','Bengaluru HO',
   6200000.00,2308500.00,3891500.00,37.23,
   'Sales salaries and commission, marketing campaigns, business promotion and outbound freight',
   'sarah.mitchell','2026-03-11 09:30:00','suresh.nair','2026-03-18 16:35:00',1,NULL,'sarah.mitchell','2026-03-06 10:00:00','2026-08-31 18:00:00'),
  ('BUD-DEMO-003','Administration Operating Budget FY2026-27',(SELECT id FROM financial_years WHERE "yearCode"='FY2026-27'),
   'Operating Budget','2026-04-01','2027-03-31','Active','Administration','CC-ADMIN','Bengaluru HO',
   4800000.00,1976300.00,2823700.00,41.17,
   'Office salaries, rent, professional fees and insurance for the admin function',
   'kavita.menon','2026-03-11 14:00:00','suresh.nair','2026-03-18 16:40:00',1,NULL,'kavita.menon','2026-03-06 11:00:00','2026-08-31 18:00:00'),
  ('BUD-DEMO-004','R&D Operating Budget FY2026-27',(SELECT id FROM financial_years WHERE "yearCode"='FY2026-27'),
   'Operating Budget','2026-04-01','2027-03-31','Approved','Research & Development','CC-RND','Peenya Plant',
   2400000.00,742600.00,1657400.00,30.94,
   'Prototype materials, testing and certification for new combi-oven and blast-chiller lines',
   'deepak.rao','2026-03-12 10:00:00','suresh.nair','2026-03-19 11:00:00',1,NULL,'deepak.rao','2026-03-07 09:00:00','2026-08-31 18:00:00'),
  ('BUD-DEMO-005','Capital Budget FY2026-27 - Plant & Machinery',(SELECT id FROM financial_years WHERE "yearCode"='FY2026-27'),
   'Capital Budget','2026-04-01','2027-03-31','Active','Production','CC-PROD','Peenya Plant',
   12000000.00,2850000.00,9150000.00,23.75,
   'Capex plan: CNC press brake (acquired Apr 2026), laser cutter, powder-coating line upgrade',
   'rajesh.kumar','2026-03-12 15:00:00','suresh.nair','2026-03-20 10:00:00',1,'Laser cutter procurement slipped to Q3','rajesh.kumar','2026-03-07 10:00:00','2026-08-31 18:00:00'),
  ('BUD-DEMO-006','Cash Budget FY2026-27',(SELECT id FROM financial_years WHERE "yearCode"='FY2026-27'),
   'Cash Budget','2026-04-01','2027-03-31','Draft','Finance & Accounts','CC-FIN','Bengaluru HO',
   9000000.00,0.00,9000000.00,0.00,
   'Monthly cash inflow/outflow plan supporting the working-capital facility review',
   NULL,NULL,NULL,NULL,1,'Pending treasury committee review','anita.krishnan','2026-03-09 12:00:00','2026-03-09 12:00:00');

INSERT INTO budget_lines
  ("budgetId","accountId","accountName","accountCode","periodWiseBudget",
   "annualBudgetedAmount","annualActualAmount","annualVariance","utilizationPercentage",
   "costCenter",department,notes,"createdAt","updatedAt")
VALUES
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-001'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='5110'),'Production Wages','5110',
   '[{"periodId":"FY2026-27-P01","periodName":"April 2026","budgetedAmount":800000,"actualAmount":782400,"variance":17600},{"periodId":"FY2026-27-P02","periodName":"May 2026","budgetedAmount":800000,"actualAmount":794100,"variance":5900},{"periodId":"FY2026-27-P03","periodName":"June 2026","budgetedAmount":800000,"actualAmount":801250,"variance":-1250}]',
   9600000.00,3944750.00,5655250.00,41.09,'CC-PROD','Production',NULL,'2026-03-05 10:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-001'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='5210'),'Factory Rent','5210',
   '[{"periodId":"FY2026-27-P01","periodName":"April 2026","budgetedAmount":300000,"actualAmount":300000,"variance":0},{"periodId":"FY2026-27-P02","periodName":"May 2026","budgetedAmount":300000,"actualAmount":300000,"variance":0}]',
   3600000.00,1500000.00,2100000.00,41.67,'CC-PROD','Production','Fixed lease, escalation due Oct 2026','2026-03-05 10:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-001'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='5220'),'Factory Utilities','5220',
   NULL,2400000.00,1012400.00,1387600.00,42.18,'CC-PROD','Production',NULL,'2026-03-05 10:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-001'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='5240'),'Consumable Stores','5240',
   NULL,1700000.00,589250.00,1110750.00,34.66,'CC-PROD','Production',NULL,'2026-03-05 10:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-001'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='5260'),'Quality Control Expenses','5260',
   NULL,1200000.00,316000.00,884000.00,26.33,'CC-QC','Production',NULL,'2026-03-05 10:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-002'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='6310'),'Sales Salaries and Commission','6310',
   NULL,3400000.00,1387600.00,2012400.00,40.81,'CC-SALES','Sales & Marketing',NULL,'2026-03-06 10:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-002'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='6320'),'Marketing and Advertising','6320',
   NULL,1600000.00,512300.00,1087700.00,32.02,'CC-SALES','Sales & Marketing','Includes AAHAR 2027 trade-show reserve','2026-03-06 10:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-002'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='6340'),'Transportation and Freight','6340',
   NULL,1200000.00,408600.00,791400.00,34.05,'CC-SALES','Sales & Marketing',NULL,'2026-03-06 10:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-003'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='6110'),'Office Salaries','6110',
   NULL,2900000.00,1216700.00,1683300.00,41.96,'CC-ADMIN','Administration',NULL,'2026-03-06 11:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-003'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='6120'),'Office Rent','6120',
   NULL,960000.00,400000.00,560000.00,41.67,'CC-ADMIN','Administration',NULL,'2026-03-06 11:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-003'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='6180'),'Professional Fees','6180',
   NULL,540000.00,214600.00,325400.00,39.74,'CC-ADMIN','Administration',NULL,'2026-03-06 11:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-003'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='6210'),'Insurance','6210',
   NULL,400000.00,145000.00,255000.00,36.25,'CC-ADMIN','Administration','Plant + marine transit policies','2026-03-06 11:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-004'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='5260'),'Quality Control Expenses','5260',
   NULL,900000.00,288600.00,611400.00,32.07,'CC-RND','Research & Development','Certification and test-lab charges','2026-03-07 09:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-004'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='5011'),'Raw Material Purchases','5011',
   NULL,1500000.00,454000.00,1046000.00,30.27,'CC-RND','Research & Development','Prototype material purchases','2026-03-07 09:10:00','2026-08-31 18:00:00'),
  ((SELECT id FROM budgets WHERE "budgetCode"='BUD-DEMO-005'),
   (SELECT id::text FROM chart_of_accounts WHERE "accountCode"='6620'),'Machinery Maintenance','6620',
   NULL,12000000.00,2850000.00,9150000.00,23.75,'CC-PROD','Production','Capex line tracked against machinery account pending asset-class split','2026-03-07 10:10:00','2026-08-31 18:00:00');

-- ---------------------------------------------------------------------------
-- Cash flow transactions
-- ---------------------------------------------------------------------------
DELETE FROM cash_flow_transactions WHERE "transactionNumber" LIKE 'CFT-DEMO-%';

INSERT INTO cash_flow_transactions
  ("transactionNumber","periodId","transactionDate",category,"flowType",source,description,amount,
   "referenceNumber","referenceType","partyName","partyType",
   "bankAccountId","costCenter",department,notes,"createdBy","createdAt","updatedAt")
VALUES
  ('CFT-DEMO-001',(SELECT id FROM financial_periods WHERE "periodCode"='FY2025-26-P07'),'2025-10-20',
   'Operating Activities','Inflow','Actual','Customer receipt - Summit Catering Services',13629.00,
   'PAY-DEMO-001','Payment','Summit Catering Services','Customer',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts',NULL,'anita.krishnan','2025-10-20 16:00:00','2025-10-20 16:00:00'),
  ('CFT-DEMO-002',(SELECT id FROM financial_periods WHERE "periodCode"='FY2025-26-P08'),'2025-11-18',
   'Operating Activities','Inflow','Actual','Customer receipt - Harbour Grill Restaurants',33630.00,
   'PAY-DEMO-002','Payment','Harbour Grill Restaurants','Customer',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts',NULL,'anita.krishnan','2025-11-18 16:00:00','2025-11-18 16:00:00'),
  ('CFT-DEMO-003',(SELECT id FROM financial_periods WHERE "periodCode"='FY2025-26-P09'),'2025-12-03',
   'Operating Activities','Inflow','Actual','Customer receipt - Campus Dining Co-op',26550.00,
   'PAY-DEMO-003','Payment','Campus Dining Co-op','Customer',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts',NULL,'anita.krishnan','2025-12-03 16:00:00','2025-12-03 16:00:00'),
  ('CFT-DEMO-004',(SELECT id FROM financial_periods WHERE "periodCode"='FY2025-26-P09'),'2025-12-16',
   'Operating Activities','Inflow','Actual','Customer receipt - Lakeside Resort & Spa',50858.00,
   'PAY-DEMO-004','Payment','Lakeside Resort & Spa','Customer',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts',NULL,'anita.krishnan','2025-12-16 16:00:00','2025-12-16 16:00:00'),
  ('CFT-DEMO-005',(SELECT id FROM financial_periods WHERE "periodCode"='FY2025-26-P10'),'2026-01-08',
   'Operating Activities','Outflow','Actual','Vendor payment - SteelCraft Metals Inc',12744.00,
   'PAY-DEMO-006','Payment','SteelCraft Metals Inc','Vendor',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-PROC','Procurement',NULL,'anita.krishnan','2026-01-08 16:00:00','2026-01-08 16:00:00'),
  ('CFT-DEMO-006',(SELECT id FROM financial_periods WHERE "periodCode"='FY2025-26-P10'),'2026-01-27',
   'Operating Activities','Inflow','Actual','Customer receipt - Blue Fig Hotels Group',79060.00,
   'PAY-DEMO-007','Payment','Blue Fig Hotels Group','Customer',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts',NULL,'anita.krishnan','2026-01-27 16:00:00','2026-01-27 16:00:00'),
  ('CFT-DEMO-007',(SELECT id FROM financial_periods WHERE "periodCode"='FY2025-26-P11'),'2026-02-28',
   'Operating Activities','Outflow','Actual','Monthly payroll disbursement - February 2026',1450000.00,
   'SAL-2026-02','Payroll','B3 MACBIS Employees','Employee',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-002'),'CC-HR','Human Resources',NULL,'anita.krishnan','2026-02-28 18:00:00','2026-02-28 18:00:00'),
  ('CFT-DEMO-008',(SELECT id FROM financial_periods WHERE "periodCode"='FY2025-26-P12'),'2026-03-06',
   'Operating Activities','Inflow','Actual','Customer receipt - Metro Hospital Kitchens',40474.00,
   'PAY-DEMO-008','Payment','Metro Hospital Kitchens','Customer',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts',NULL,'anita.krishnan','2026-03-06 16:00:00','2026-03-06 16:00:00'),
  ('CFT-DEMO-009',(SELECT id FROM financial_periods WHERE "periodCode"='FY2026-27-P01'),'2026-04-15',
   'Investing Activities','Outflow','Actual','Purchase of CNC press brake (capex, BUD-DEMO-005)',2850000.00,
   'PO-2026-089','Purchase Order','ProTool Equipment Inc.','Vendor',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-PROD','Production','Capitalised as plant & machinery','anita.krishnan','2026-04-15 15:00:00','2026-04-15 15:00:00'),
  ('CFT-DEMO-010',(SELECT id FROM financial_periods WHERE "periodCode"='FY2026-27-P02'),'2026-05-05',
   'Financing Activities','Inflow','Actual','Term loan drawdown - SBI machinery loan tranche 1',5000000.00,
   'TL-SBI-2026-01','Loan','State Bank of India','Bank',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts',NULL,'anita.krishnan','2026-05-05 12:00:00','2026-05-05 12:00:00'),
  ('CFT-DEMO-011',(SELECT id FROM financial_periods WHERE "periodCode"='FY2026-27-P03'),'2026-06-30',
   'Financing Activities','Outflow','Actual','Term loan EMI - SBI machinery loan (Jun 2026)',450000.00,
   'TL-SBI-EMI-002','Loan','State Bank of India','Bank',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts',NULL,'anita.krishnan','2026-06-30 12:00:00','2026-06-30 12:00:00'),
  ('CFT-DEMO-012',(SELECT id FROM financial_periods WHERE "periodCode"='FY2026-27-P06'),'2026-09-30',
   'Operating Activities','Inflow','Forecast','Forecast collections - September 2026 AR run',750000.00,
   'FCST-2026-09','Forecast','Sundry Customers','Customer',
   (SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),'CC-FIN','Finance & Accounts','From cash budget BUD-DEMO-006','anita.krishnan','2026-08-31 10:00:00','2026-08-31 10:00:00');

-- ---------------------------------------------------------------------------
-- Anticipated receipts (against open AR balances)
-- ---------------------------------------------------------------------------
DELETE FROM anticipated_receipts WHERE "receiptNumber" LIKE 'AREC-DEMO-%';

INSERT INTO anticipated_receipts
  ("receiptNumber","expectedDate","expectedAmount","receivedAmount",description,
   "customerId","customerName","referenceNumber","referenceType",status,"isReceived",
   "expectedPaymentMethod","bankAccountId","confidenceLevel",notes,"reminderSent","createdBy","createdAt","updatedAt")
VALUES
  ('AREC-DEMO-001','2026-09-15',467988.00,0.00,'Open invoice balance - Blue Fig Hotels Group',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' AND "companyId"=:company),
   'Blue Fig Hotels Group','INV-DEMO batch','Invoice','Pending',false,
   'NEFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),90,'Net 45 terms; payment run confirmed by AP contact',true,'anita.krishnan','2026-08-20 10:00:00','2026-09-01 10:00:00'),
  ('AREC-DEMO-002','2026-09-25',770646.20,0.00,'Open invoice balance - Golden Spoon Franchises',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' AND "companyId"=:company),
   'Golden Spoon Franchises','INV-DEMO batch','Invoice','Pending',false,
   'RTGS',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),80,'Largest open exposure; franchise HQ consolidating payments',true,'anita.krishnan','2026-08-20 10:05:00','2026-09-01 10:00:00'),
  ('AREC-DEMO-003','2026-08-30',292899.60,0.00,'Open invoice balance - Harbour Grill Restaurants',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' AND "companyId"=:company),
   'Harbour Grill Restaurants','INV-DEMO batch','Invoice','Overdue',false,
   'NEFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),70,'5 days overdue as of 2026-09-04; collection call logged',true,'anita.krishnan','2026-08-01 10:00:00','2026-09-04 10:00:00'),
  ('AREC-DEMO-004','2026-10-10',439432.00,0.00,'Open invoice balance - Metro Hospital Kitchens',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' AND "companyId"=:company),
   'Metro Hospital Kitchens','INV-DEMO batch','Invoice','Pending',false,
   'NEFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),85,'Net 60 terms; hospital board approval cycle',false,'anita.krishnan','2026-08-20 10:10:00','2026-08-20 10:10:00'),
  ('AREC-DEMO-005','2026-09-20',157152.40,0.00,'Open invoice balance - Lakeside Resort & Spa',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' AND "companyId"=:company),
   'Lakeside Resort & Spa','INV-DEMO batch','Invoice','Pending',false,
   'NEFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),85,NULL,false,'anita.krishnan','2026-08-20 10:15:00','2026-08-20 10:15:00'),
  ('AREC-DEMO-006','2026-09-12',87320.00,43660.00,'Open invoice balance - Campus Dining Co-op (part received)',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' AND "companyId"=:company),
   'Campus Dining Co-op','INV-DEMO batch','Invoice','Partially Received',false,
   'NEFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),95,'50% advance instalment received 2026-09-05',false,'anita.krishnan','2026-08-20 10:20:00','2026-09-05 14:00:00'),
  ('AREC-DEMO-007','2026-09-18',66434.00,0.00,'Open invoice balance - Summit Catering Services',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Summit Catering Services' AND "companyId"=:company),
   'Summit Catering Services','INV-DEMO batch','Invoice','Pending',false,
   'UPI',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),90,NULL,false,'anita.krishnan','2026-08-20 10:25:00','2026-08-20 10:25:00'),
  ('AREC-DEMO-008','2026-08-25',23364.00,23364.00,'Open invoice balance - Riverside Bistro Chain',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain' AND "companyId"=:company),
   'Riverside Bistro Chain','INV-DEMO batch','Invoice','Fully Received',true,
   'NEFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),100,'Received on time',true,'anita.krishnan','2026-08-01 10:30:00','2026-08-25 15:00:00');

-- ---------------------------------------------------------------------------
-- Anticipated payments (planned vendor outflows)
-- ---------------------------------------------------------------------------
DELETE FROM anticipated_payments WHERE "paymentNumber" LIKE 'APAY-DEMO-%';

INSERT INTO anticipated_payments
  ("paymentNumber","expectedDate","expectedAmount","paidAmount",description,
   "vendorId","vendorName","referenceNumber","referenceType",priority,urgency,status,"isPaid",
   "plannedPaymentMethod","bankAccountId","requiresApproval","isApproved","approvedBy","approvedAt",notes,"createdBy","createdAt","updatedAt")
VALUES
  ('APAY-DEMO-001','2026-09-15',485600.00,0.00,'Stainless sheet consignment - September delivery',
   (SELECT id::text FROM vendors WHERE "vendorName"='Prime Steel Suppliers'),'Prime Steel Suppliers',
   'PO-2026-142','Purchase Order',2,'High','Scheduled',false,
   'RTGS',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),true,true,'suresh.nair','2026-09-05 11:00:00','Early-payment discount 1% if paid by 15th','anita.krishnan','2026-09-01 10:00:00','2026-09-05 11:00:00'),
  ('APAY-DEMO-002','2026-09-20',264500.00,0.00,'Control panels and wiring harnesses',
   (SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies'),'ElectroTech Supplies',
   'PO-2026-145','Purchase Order',4,'Medium','Pending',false,
   'NEFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),true,false,NULL,NULL,NULL,'anita.krishnan','2026-09-01 10:05:00','2026-09-01 10:05:00'),
  ('APAY-DEMO-003','2026-09-10',118000.00,118000.00,'Quarterly AMC - Q2 FY2026-27',
   (SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services'),'MaintainPro Services',
   'AMC-2026-Q2','Contract',5,'Medium','Fully Paid',true,
   'Cheque',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),false,true,'anita.krishnan','2026-09-08 10:00:00','Paid via cheque 000482','anita.krishnan','2026-08-25 10:00:00','2026-09-10 12:00:00'),
  ('APAY-DEMO-004','2026-09-25',342200.00,0.00,'Compressor units for blast chiller line',
   (SELECT id::text FROM vendors WHERE "vendorName"='Industrial Components Ltd.'),'Industrial Components Ltd.',
   'PO-2026-148','Purchase Order',3,'High','Pending',false,
   'RTGS',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),true,false,NULL,NULL,'Awaiting GRN confirmation before release','anita.krishnan','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  ('APAY-DEMO-005','2026-09-30',1656200.00,0.00,'September 2026 payroll funding',
   NULL,'B3 MACBIS Payroll','SAL-2026-09','Payroll',1,'Critical','Scheduled',false,
   'Bank Transfer',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-002'),true,true,'suresh.nair','2026-09-06 09:00:00','Fund payroll account by 29th','anita.krishnan','2026-09-01 10:15:00','2026-09-06 09:00:00'),
  ('APAY-DEMO-006','2026-10-05',97350.00,0.00,'Packaging material - export crates',
   (SELECT id::text FROM vendors WHERE "vendorName"='PackRight Solutions'),'PackRight Solutions',
   'PO-2026-151','Purchase Order',6,'Low','Pending',false,
   'NEFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),false,false,NULL,NULL,NULL,'anita.krishnan','2026-09-04 10:00:00','2026-09-04 10:00:00'),
  ('APAY-DEMO-007','2026-08-31',450000.00,450000.00,'Term loan EMI - SBI machinery loan (Aug 2026)',
   NULL,'State Bank of India','TL-SBI-EMI-004','Loan',1,'Critical','Fully Paid',true,
   'Auto Debit',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-001'),false,true,'suresh.nair','2026-08-28 09:00:00',NULL,'anita.krishnan','2026-08-01 10:00:00','2026-08-31 12:00:00'),
  ('APAY-DEMO-008','2026-09-18',215940.00,0.00,'Powder-coating chemicals import - EUR settlement',
   (SELECT id::text FROM vendors WHERE "vendorName"='Chemical Solutions GmbH'),'Chemical Solutions GmbH',
   'PO-2026-139','Purchase Order',3,'High','Overdue',false,
   'SWIFT',(SELECT id::text FROM bank_accounts WHERE "accountCode"='BNK-DEMO-004'),true,true,'suresh.nair','2026-09-01 09:00:00','FX forward booked at 1 EUR = 96.40 INR','anita.krishnan','2026-08-15 10:00:00','2026-09-08 10:00:00');

-- ---------------------------------------------------------------------------
-- AR customer account summaries (consistent with seeded invoice balances)
-- ---------------------------------------------------------------------------
DELETE FROM finance_ar_customer_account WHERE "customerCode" LIKE 'CUS-DEMO-%';

INSERT INTO finance_ar_customer_account
  ("customerId","customerName","customerCode","gstNumber","customerCategory",
   "totalOutstanding","overdueAmount","dueThisWeek","dueThisMonth","lastCollectionAmount","lastCollectionDate",
   "creditLimit","creditUsed","availableCredit","creditStatus","paymentTerms",dso,"averageDaysDelayed",
   "accountStatus","riskRating","collectionAgent","collectionPriority","agingBuckets","customerContact",
   city,state,"customerSince","lastSaleDate","createdAt","updatedAt")
VALUES
  ((SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' AND "companyId"=:company),
   'Blue Fig Hotels Group','CUS-DEMO-001','29AABCB1234F1Z5','Enterprise',
   467988.00,102400.00,0.00,467988.00,79060.00,'2026-01-27',
   500000.00,467988.00,32012.00,'approved','Net 45',52,6,
   'active','low','Priya Nair','medium',
   '{"current":365588,"days1to30":102400,"days31to60":0,"days61to90":0,"over90":0}',
   '{"name":"Amelia Torres","email":"amelia@bluefighotels.com","phone":"+1-212-555-0132"}',
   'New York','NY','2024-06-12','2026-08-18','2026-09-01 09:00:00','2026-09-08 09:00:00'),
  ((SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' AND "companyId"=:company),
   'Golden Spoon Franchises','CUS-DEMO-002','29AAGCG5678K1Z2','Enterprise',
   770646.20,318200.00,145000.00,770646.20,310000.00,'2026-07-03',
   420000.00,770646.20,0.00,'on-watch','Net 45',68,14,
   'active','medium','Priya Nair','high',
   '{"current":452446.2,"days1to30":204600,"days31to60":113600,"days61to90":0,"over90":0}',
   '{"name":"Priya Shah","email":"priya@goldenspoon.com","phone":"+1-480-555-0214"}',
   'Phoenix','AZ','2024-03-08','2026-08-25','2026-09-01 09:05:00','2026-09-08 09:00:00'),
  ((SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' AND "companyId"=:company),
   'Harbour Grill Restaurants','CUS-DEMO-003','29AAHCH9012M1Z8','Enterprise',
   292899.60,292899.60,292899.60,292899.60,645930.00,'2026-07-28',
   250000.00,292899.60,0.00,'on-hold','Net 30',61,9,
   'active','medium','Rohit Verma','high',
   '{"current":0,"days1to30":292899.6,"days31to60":0,"days61to90":0,"over90":0}',
   '{"name":"Marcus Lee","email":"marcus@harbourgrill.com","phone":"+1-415-555-0110"}',
   'San Francisco','CA','2024-01-20','2026-07-15','2026-09-01 09:10:00','2026-09-08 09:00:00'),
  ((SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' AND "companyId"=:company),
   'Metro Hospital Kitchens','CUS-DEMO-004','29AAMCM3456P1Z1','Enterprise',
   439432.00,0.00,0.00,204000.00,204000.00,'2026-07-18',
   300000.00,439432.00,0.00,'approved','Net 60',74,3,
   'active','low','Rohit Verma','medium',
   '{"current":439432,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '{"name":"Dr. Karen Ng","email":"karen@metrohospital.org","phone":"+1-312-555-0193"}',
   'Chicago','IL','2024-09-02','2026-08-10','2026-09-01 09:15:00','2026-09-08 09:00:00'),
  ((SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' AND "companyId"=:company),
   'Lakeside Resort & Spa','CUS-DEMO-005','29AALCL7890R1Z4','Mid-Market',
   157152.40,0.00,157152.40,157152.40,50858.00,'2025-12-16',
   180000.00,157152.40,22847.60,'approved','Net 30',44,2,
   'active','low','Priya Nair','low',
   '{"current":157152.4,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '{"name":"Henrik Olsen","email":"henrik@lakesideresort.com","phone":"+1-305-555-0227"}',
   'Miami','FL','2024-11-14','2026-08-22','2026-09-01 09:20:00','2026-09-08 09:00:00'),
  ((SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' AND "companyId"=:company),
   'Campus Dining Co-op','CUS-DEMO-006','29AACCC2345T1Z7','Mid-Market',
   87320.00,0.00,0.00,87320.00,43660.00,'2026-09-05',
   120000.00,87320.00,32680.00,'approved','Net 30',38,1,
   'active','low','Rohit Verma','low',
   '{"current":87320,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '{"name":"Raj Patel","email":"raj@campusdining.edu","phone":"+1-617-555-0155"}',
   'Boston','MA','2025-02-18','2026-08-30','2026-09-01 09:25:00','2026-09-08 09:00:00'),
  ((SELECT id::text FROM crm_customers WHERE "customerName"='Summit Catering Services' AND "companyId"=:company),
   'Summit Catering Services','CUS-DEMO-007','29AASCS6789V1Z0','Mid-Market',
   66434.00,12800.00,66434.00,66434.00,13629.00,'2025-10-20',
   90000.00,66434.00,23566.00,'approved','Net 15',33,5,
   'active','low','Priya Nair','medium',
   '{"current":53634,"days1to30":12800,"days31to60":0,"days61to90":0,"over90":0}',
   '{"name":"Nina Alvarez","email":"nina@summitcatering.com","phone":"+1-303-555-0178"}',
   'Denver','CO','2025-01-10','2026-08-05','2026-09-01 09:30:00','2026-09-08 09:00:00'),
  ((SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain' AND "companyId"=:company),
   'Riverside Bistro Chain','CUS-DEMO-008','29AARCR0123X1Z3','SMB',
   23364.00,0.00,0.00,23364.00,17110.00,'2026-01-02',
   40000.00,23364.00,16636.00,'approved','Net 30',29,0,
   'active','low','Rohit Verma','low',
   '{"current":23364,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '{"name":"Tom Becker","email":"tom@riversidebistro.com","phone":"+1-206-555-0201"}',
   'Seattle','WA','2025-06-01','2026-08-12','2026-09-01 09:35:00','2026-09-08 09:00:00');

-- ---------------------------------------------------------------------------
-- AP vendor account summaries
-- ---------------------------------------------------------------------------
DELETE FROM finance_ap_vendor_account WHERE "vendorCode" LIKE 'VEN-DEMO-%';

INSERT INTO finance_ap_vendor_account
  ("vendorId","vendorName","vendorCode","gstNumber","panNumber","vendorCategory",
   "totalOutstanding","overdueAmount","dueThisWeek","dueThisMonth","lastPaymentAmount","lastPaymentDate",
   "creditPeriod","creditLimit","paymentTerms","accountStatus","riskRating",
   "agingBuckets",bills,"vendorContact",city,state,"vendorSince","lastPurchaseDate","createdAt","updatedAt")
VALUES
  ((SELECT id::text FROM vendors WHERE "vendorName"='Prime Steel Suppliers'),
   'Prime Steel Suppliers','VEN-DEMO-001','29AAPPS1234A1Z9','AAPPS1234A','Raw Material',
   485600.00,0.00,485600.00,485600.00,485600.00,'2026-07-07',
   30,1500000.00,'Net 30','active','low',
   '{"current":485600,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '[{"billNumber":"PO-2026-142","billDate":"2026-08-20","amount":485600,"dueDate":"2026-09-19","status":"open"}]',
   '{"name":"Mahesh Gupta","email":"accounts@primesteel.in","phone":"+91-80-2839-4455"}',
   'Bengaluru','Karnataka','2023-04-01','2026-08-20','2026-09-01 10:00:00','2026-09-08 10:00:00'),
  ((SELECT id::text FROM vendors WHERE "vendorName"='Industrial Components Ltd.'),
   'Industrial Components Ltd.','VEN-DEMO-002','27AAICL5678B1Z6','AAICL5678B','Components',
   342200.00,0.00,0.00,342200.00,298400.00,'2026-06-14',
   45,1000000.00,'Net 45','active','low',
   '{"current":342200,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '[{"billNumber":"PO-2026-148","billDate":"2026-08-28","amount":342200,"dueDate":"2026-10-12","status":"open"}]',
   '{"name":"Sunita Joshi","email":"finance@indcomp.co.in","phone":"+91-22-4056-7788"}',
   'Mumbai','Maharashtra','2023-07-15','2026-08-28','2026-09-01 10:05:00','2026-09-08 10:00:00'),
  ((SELECT id::text FROM vendors WHERE "vendorName"='ElectroTech Supplies'),
   'ElectroTech Supplies','VEN-DEMO-003','29AAETS9012C1Z3','AAETS9012C','Electricals',
   264500.00,0.00,0.00,264500.00,264500.00,'2026-07-22',
   30,800000.00,'Net 30','active','low',
   '{"current":264500,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '[{"billNumber":"PO-2026-145","billDate":"2026-08-25","amount":264500,"dueDate":"2026-09-24","status":"open"}]',
   '{"name":"Vijay Kulkarni","email":"billing@electrotech.in","phone":"+91-80-2665-3311"}',
   'Bengaluru','Karnataka','2024-01-10','2026-08-25','2026-09-01 10:10:00','2026-09-08 10:00:00'),
  ((SELECT id::text FROM vendors WHERE "vendorName"='Chemical Solutions GmbH'),
   'Chemical Solutions GmbH','VEN-DEMO-004',NULL,NULL,'Import - Chemicals',
   215940.00,215940.00,215940.00,215940.00,187600.00,'2026-05-30',
   60,600000.00,'Net 60 (SWIFT)','active','medium',
   '{"current":0,"days1to30":215940,"days31to60":0,"days61to90":0,"over90":0}',
   '[{"billNumber":"PO-2026-139","billDate":"2026-07-05","amount":215940,"dueDate":"2026-09-03","status":"overdue"}]',
   '{"name":"Klaus Werner","email":"ar@chemsolutions.de","phone":"+49-69-5550-2211"}',
   'Frankfurt','Hesse','2024-05-20','2026-07-05','2026-09-01 10:15:00','2026-09-08 10:00:00'),
  ((SELECT id::text FROM vendors WHERE "vendorName"='MaintainPro Services'),
   'MaintainPro Services','VEN-DEMO-005','29AAMPS3456D1Z0','AAMPS3456D','Services',
   0.00,0.00,0.00,0.00,118000.00,'2026-09-10',
   15,300000.00,'Net 15','active','low',
   '{"current":0,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '[{"billNumber":"AMC-2026-Q2","billDate":"2026-08-20","amount":118000,"dueDate":"2026-09-04","status":"paid"}]',
   '{"name":"Ganesh Hegde","email":"amc@maintainpro.in","phone":"+91-80-2447-9900"}',
   'Bengaluru','Karnataka','2023-10-01','2026-08-20','2026-09-01 10:20:00','2026-09-10 12:30:00'),
  ((SELECT id::text FROM vendors WHERE "vendorName"='PackRight Solutions'),
   'PackRight Solutions','VEN-DEMO-006','33AAPRS7890E1Z7','AAPRS7890E','Packaging',
   97350.00,0.00,0.00,0.00,84200.00,'2026-06-30',
   30,250000.00,'Net 30','active','low',
   '{"current":97350,"days1to30":0,"days31to60":0,"days61to90":0,"over90":0}',
   '[{"billNumber":"PO-2026-151","billDate":"2026-09-05","amount":97350,"dueDate":"2026-10-05","status":"open"}]',
   '{"name":"Lakshmi Srinivasan","email":"accounts@packright.in","phone":"+91-44-2852-6677"}',
   'Chennai','Tamil Nadu','2024-08-12','2026-09-05','2026-09-01 10:25:00','2026-09-08 10:00:00');

-- ---------------------------------------------------------------------------
-- Finance currency master
-- ---------------------------------------------------------------------------
DELETE FROM finance_currency_master WHERE company_id = :company;

INSERT INTO finance_currency_master
  (code,name,symbol,is_base_currency,is_active,decimal_places,company_id,created_at,updated_at)
VALUES
  ('INR','Indian Rupee','₹',true,true,2,:company,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('USD','US Dollar','$',false,true,2,:company,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('EUR','Euro','€',false,true,2,:company,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('GBP','Pound Sterling','£',false,true,2,:company,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  ('AED','UAE Dirham','د.إ',false,true,2,:company,'2025-11-10 09:00:00','2025-11-10 09:00:00'),
  ('JPY','Japanese Yen','¥',false,false,0,:company,'2025-11-10 09:00:00','2026-02-01 09:00:00');

-- ---------------------------------------------------------------------------
-- Finance advanced features (enterprise feature registry)
-- ---------------------------------------------------------------------------
DELETE FROM finance_advanced_features WHERE company_id = :company;

INSERT INTO finance_advanced_features
  (company_id,feature_key,name,description,category,is_enabled,sort_order,config,created_at,updated_at)
VALUES
  (:company,'general_ledger','Multi-dimensional General Ledger','GL postings tagged by cost center, department, project and location','ledger',true,1,'{"dimensions":["costCenter","department","project","location"]}','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'consolidation','Multi-entity Consolidation','Consolidated financial statements across group entities with elimination entries','ledger',false,2,'{"entities":1}','2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'audit_trail','Finance Audit Trail','Immutable change log on all finance documents with user, timestamp and IP capture','compliance',true,3,NULL,'2025-10-01 09:00:00','2025-10-01 09:00:00'),
  (:company,'compliance','Statutory Compliance Pack (India)','GST returns, TDS tracking and e-invoice readiness for Indian statutory filings','compliance',true,4,'{"gstin":"29AABCB3245K1ZD","einvoice":true}','2025-10-01 09:00:00','2026-04-01 09:00:00'),
  (:company,'treasury','Treasury Management','Bank account monitoring, FD tracking and working-capital facility utilisation','treasury',true,5,NULL,'2025-11-15 09:00:00','2025-11-15 09:00:00'),
  (:company,'cash_forecasting','Cash Flow Forecasting','13-week rolling cash forecast from anticipated receipts and payments','treasury',true,6,'{"horizonWeeks":13}','2025-11-15 09:00:00','2026-03-09 12:00:00'),
  (:company,'controls','Internal Financial Controls','Approval matrices, segregation of duties and threshold-based payment controls','controls',true,7,'{"sodEnforced":true}','2025-10-01 09:00:00','2025-10-01 09:00:00');

-- ---------------------------------------------------------------------------
-- Finance approval workflows
-- ---------------------------------------------------------------------------
DELETE FROM finance_approval_workflows WHERE company_id = :company;

INSERT INTO finance_approval_workflows
  (company_id,name,document_type,description,min_amount,max_amount,steps,status,is_active,created_at,updated_at)
VALUES
  (:company,'Vendor Payment - Tier 1','Payment','Payments up to 1 lakh: finance executive approval only',0.00,100000.00,
   '[{"step":1,"role":"Finance Executive","approver":"anita.krishnan","slaHours":24}]','active',true,'2025-10-05 10:00:00','2025-10-05 10:00:00'),
  (:company,'Vendor Payment - Tier 2','Payment','Payments 1-5 lakh: finance manager then finance controller',100000.01,500000.00,
   '[{"step":1,"role":"Finance Manager","approver":"vikram.shetty","slaHours":24},{"step":2,"role":"Finance Controller","approver":"suresh.nair","slaHours":48}]','active',true,'2025-10-05 10:05:00','2025-10-05 10:05:00'),
  (:company,'Vendor Payment - Tier 3','Payment','Payments above 5 lakh: controller plus CFO sign-off',500000.01,NULL,
   '[{"step":1,"role":"Finance Controller","approver":"suresh.nair","slaHours":24},{"step":2,"role":"CFO","approver":"meera.pillai","slaHours":72}]','active',true,'2025-10-05 10:10:00','2025-10-05 10:10:00'),
  (:company,'Annual Budget Approval','Budget','Departmental budgets: department head, controller, CFO',0.00,NULL,
   '[{"step":1,"role":"Department Head","slaHours":72},{"step":2,"role":"Finance Controller","approver":"suresh.nair","slaHours":72},{"step":3,"role":"CFO","approver":"meera.pillai","slaHours":120}]','active',true,'2026-02-15 10:00:00','2026-02-15 10:00:00'),
  (:company,'Manual Journal Entry Approval','Journal Entry','Manual JEs above 50k require controller review before posting',50000.00,NULL,
   '[{"step":1,"role":"Finance Controller","approver":"suresh.nair","slaHours":24}]','active',true,'2025-10-05 10:15:00','2025-10-05 10:15:00');

-- ---------------------------------------------------------------------------
-- Finance alerts
-- ---------------------------------------------------------------------------
DELETE FROM finance_alerts WHERE company_id = :company;

INSERT INTO finance_alerts
  (company_id,name,category,severity,condition_type,threshold_value,message,status,is_enabled,last_triggered_at,trigger_count,created_at,updated_at)
VALUES
  (:company,'Cash balance below minimum','treasury','critical','balance_below',1000000.00,'Operations account balance dropped below INR 10,00,000','active',true,'2026-02-27 08:00:00',2,'2025-10-10 09:00:00','2026-02-27 08:00:00'),
  (:company,'Receivable overdue > 30 days','receivables','high','aging_exceeds',30.00,'One or more customer invoices are overdue by more than 30 days','active',true,'2026-09-04 08:00:00',11,'2025-10-10 09:05:00','2026-09-04 08:00:00'),
  (:company,'Customer over credit limit','receivables','high','credit_limit_exceeded',100.00,'Customer exposure has crossed 100% of sanctioned credit limit','active',true,'2026-08-12 08:00:00',3,'2025-10-10 09:10:00','2026-08-12 08:00:00'),
  (:company,'Cash credit utilisation > 80%','treasury','medium','utilization_exceeds',80.00,'SBI cash credit facility utilisation crossed 80% of the sanctioned limit','active',true,NULL,0,'2025-11-01 09:00:00','2025-11-01 09:00:00'),
  (:company,'Budget utilisation > 90%','budgeting','medium','budget_utilization',90.00,'A budget line has consumed more than 90% of its annual allocation','active',true,'2026-08-20 08:00:00',1,'2026-04-01 09:00:00','2026-08-20 08:00:00'),
  (:company,'Unreconciled bank items > 7 days','banking','low','reconciliation_lag',7.00,'Bank statement lines unmatched for more than 7 days','active',true,'2026-09-10 08:00:00',4,'2025-12-01 09:00:00','2026-09-10 08:00:00');

-- ---------------------------------------------------------------------------
-- Finance audit trail
-- ---------------------------------------------------------------------------
DELETE FROM finance_audit_trail WHERE company_id = :company;

INSERT INTO finance_audit_trail
  (company_id,entity_type,entity_id,action,performed_by,description,ip_address,changes,created_at)
VALUES
  (:company,'Invoice','INV-DEMO-001','created','anita.krishnan','Sales invoice created for Summit Catering Services','10.20.4.15',NULL,'2025-10-06 10:12:00'),
  (:company,'Payment','PAY-DEMO-001','posted','anita.krishnan','Receipt posted against Summit Catering Services invoice','10.20.4.15','{"status":{"from":"Draft","to":"Posted"}}','2025-10-20 16:05:00'),
  (:company,'JournalEntry','JE-DEMO-012','posted','vikram.shetty','Month-end depreciation journal posted for November 2025','10.20.4.22','{"status":{"from":"Draft","to":"Posted"}}','2025-11-30 18:30:00'),
  (:company,'BankReconciliation','RECON-DEMO-001','approved','suresh.nair','July 2026 operations account reconciliation approved','10.20.4.8','{"status":{"from":"Reviewed","to":"Approved"}}','2026-08-05 16:40:00'),
  (:company,'Budget','BUD-DEMO-001','approved','suresh.nair','Production operating budget FY2026-27 approved','10.20.4.8','{"status":{"from":"Submitted","to":"Approved"}}','2026-03-18 16:30:00'),
  (:company,'Budget','BUD-DEMO-005','updated','rajesh.kumar','Capital budget note added: laser cutter slipped to Q3','10.20.4.31','{"notes":{"from":null,"to":"Laser cutter procurement slipped to Q3"}}','2026-06-10 11:20:00'),
  (:company,'Payment','APAY-DEMO-001','approved','suresh.nair','Tier-2 approval granted for Prime Steel Suppliers payment','10.20.4.8','{"isApproved":{"from":false,"to":true}}','2026-09-05 11:00:00'),
  (:company,'Invoice','INV-DEMO-028','updated','anita.krishnan','Due date extended by 15 days on customer request','10.20.4.15','{"dueDate":{"from":"2026-08-30","to":"2026-09-14"}}','2026-08-22 12:45:00'),
  (:company,'BankAccount','BNK-DEMO-005','created','anita.krishnan','Axis Bank fixed deposit account added to treasury','10.20.4.15',NULL,'2025-11-15 11:05:00'),
  (:company,'CashTransaction','CASH-DEMO-006','created','deepa.raman','Petty cash payment recorded for factory consumables','10.20.4.40',NULL,'2026-05-14 15:10:00');

-- ---------------------------------------------------------------------------
-- Finance cash transactions (petty cash book)
-- ---------------------------------------------------------------------------
DELETE FROM finance_cash_transaction WHERE company_id = :company;

INSERT INTO finance_cash_transaction
  (date,type,category,amount,currency,description,reference,balance,company_id,created_at,updated_at)
VALUES
  ('2025-10-01','receipt','Cash Withdrawal',50000.00,'INR','Petty cash float established from operations account','CASH-DEMO-001',50000.00,:company,'2025-10-01 10:00:00','2025-10-01 10:00:00'),
  ('2025-10-14','payment','Office Supplies',3450.00,'INR','Stationery and printer cartridges','CASH-DEMO-002',46550.00,:company,'2025-10-14 12:30:00','2025-10-14 12:30:00'),
  ('2025-11-22','payment','Travel',7800.00,'INR','Local conveyance - site measurement visits','CASH-DEMO-003',38750.00,:company,'2025-11-22 17:00:00','2025-11-22 17:00:00'),
  ('2026-01-09','payment','Staff Welfare',5200.00,'INR','Pongal celebration refreshments for factory staff','CASH-DEMO-004',33550.00,:company,'2026-01-09 13:00:00','2026-01-09 13:00:00'),
  ('2026-02-18','receipt','Cash Withdrawal',25000.00,'INR','Petty cash replenishment','CASH-DEMO-005',58550.00,:company,'2026-02-18 10:30:00','2026-02-18 10:30:00'),
  ('2026-05-14','payment','Consumables',9150.00,'INR','Factory consumables - abrasives and gloves','CASH-DEMO-006',49400.00,:company,'2026-05-14 15:00:00','2026-05-14 15:00:00'),
  ('2026-06-05','payment','Courier',1240.00,'INR','Sample dispatch to Blue Fig Hotels site office','CASH-DEMO-007',48160.00,:company,'2026-06-05 11:00:00','2026-06-05 11:00:00'),
  ('2026-07-21','payment','Repairs',6600.00,'INR','Emergency repair - canteen equipment spares','CASH-DEMO-008',41560.00,:company,'2026-07-21 16:20:00','2026-07-21 16:20:00'),
  ('2026-08-27','payment','Travel',4900.00,'INR','Auto and cab fares - bank and GST office visits','CASH-DEMO-009',36660.00,:company,'2026-08-27 18:00:00','2026-08-27 18:00:00'),
  ('2026-09-08','receipt','Misc Income',2500.00,'INR','Scrap carton sale proceeds deposited to cash box','CASH-DEMO-010',39160.00,:company,'2026-09-08 12:00:00','2026-09-08 12:00:00');

-- ---------------------------------------------------------------------------
-- Finance collection activities
-- ---------------------------------------------------------------------------
DELETE FROM finance_collection_activity WHERE company_id = :company;

INSERT INTO finance_collection_activity
  (receivable_id,activity_type,notes,follow_up_date,outcome,created_by,company_id,created_at,updated_at)
VALUES
  ('CUS-DEMO-002','call','Spoke with franchise HQ AP team; consolidated payment of full open balance promised by 25 Sep','2026-09-25','Payment promised','Priya Nair',:company,'2026-09-02 11:30:00','2026-09-02 11:30:00'),
  ('CUS-DEMO-003','email','Sent statement of account and overdue reminder for balance INR 292,899.60','2026-09-12','Awaiting response','Rohit Verma',:company,'2026-09-04 09:15:00','2026-09-04 09:15:00'),
  ('CUS-DEMO-003','call','Marcus confirmed invoice under dispute for installation snag list; QC report shared','2026-09-16','Dispute raised','Rohit Verma',:company,'2026-09-08 15:40:00','2026-09-08 15:40:00'),
  ('CUS-DEMO-001','call','AP contact confirmed payment run scheduled 15 Sep for full open balance','2026-09-15','Payment promised','Priya Nair',:company,'2026-09-01 10:20:00','2026-09-01 10:20:00'),
  ('CUS-DEMO-007','email','Reminder for INR 66,434 due on Net 15 terms; offered UPI collection link','2026-09-18','Awaiting response','Priya Nair',:company,'2026-09-05 12:00:00','2026-09-05 12:00:00'),
  ('CUS-DEMO-006','note','50% instalment of INR 43,660 received 5 Sep; balance committed with next semester budget release','2026-09-12','Partial payment received','Rohit Verma',:company,'2026-09-05 16:30:00','2026-09-05 16:30:00'),
  ('CUS-DEMO-004','meeting','Quarterly account review with hospital procurement board; Net 60 cycle reaffirmed','2026-10-10','Payment on schedule','Rohit Verma',:company,'2026-08-28 14:00:00','2026-08-28 14:00:00'),
  ('CUS-DEMO-002','email','Escalation to franchise CFO copied; credit status moved to on-watch pending 25 Sep payment','2026-09-26','Escalated','Priya Nair',:company,'2026-09-09 10:00:00','2026-09-09 10:00:00');

-- ---------------------------------------------------------------------------
-- Finance documents
-- ---------------------------------------------------------------------------
DELETE FROM finance_documents WHERE company_id = :company;

INSERT INTO finance_documents
  (company_id,name,category,document_type,reference_number,file_url,file_size,status,uploaded_by,tags,created_at,updated_at)
VALUES
  (:company,'HDFC Operations Account Statement - Jul 2026','Banking','Bank Statement','BNK-DEMO-001/2026-07','/documents/finance/demo/hdfc-ops-jul-2026.pdf','412 KB','active','anita.krishnan','["bank","statement","reconciliation"]','2026-08-02 10:00:00','2026-08-02 10:00:00'),
  (:company,'ICICI Payroll Account Statement - Aug 2026','Banking','Bank Statement','BNK-DEMO-002/2026-08','/documents/finance/demo/icici-payroll-aug-2026.pdf','268 KB','active','anita.krishnan','["bank","statement","payroll"]','2026-09-02 10:00:00','2026-09-02 10:00:00'),
  (:company,'SBI Cash Credit Sanction Letter FY2026-27','Banking','Sanction Letter','SBI-CC-2026-4471','/documents/finance/demo/sbi-cc-sanction-fy2627.pdf','1.2 MB','active','suresh.nair','["facility","working-capital"]','2026-04-08 11:00:00','2026-04-08 11:00:00'),
  (:company,'Board Resolution - FY2026-27 Budget Approval','Budgeting','Board Resolution','BR-2026-03','/documents/finance/demo/board-resolution-budget-fy2627.pdf','186 KB','active','suresh.nair','["budget","governance"]','2026-03-20 15:00:00','2026-03-20 15:00:00'),
  (:company,'GST Return GSTR-3B - Aug 2026','Compliance','Tax Filing','GSTR3B-2026-08','/documents/finance/demo/gstr3b-aug-2026.pdf','324 KB','active','anita.krishnan','["gst","statutory"]','2026-09-09 17:00:00','2026-09-09 17:00:00'),
  (:company,'Axis FD Receipt - INR 50 Lakh','Treasury','Deposit Receipt','FDR-917040-2025','/documents/finance/demo/axis-fd-receipt.pdf','98 KB','active','anita.krishnan','["fd","treasury"]','2025-11-16 10:00:00','2025-11-16 10:00:00'),
  (:company,'Statutory Audit Report FY2024-25','Compliance','Audit Report','AUD-FY2425-FINAL','/documents/finance/demo/statutory-audit-fy2425.pdf','2.8 MB','archived','suresh.nair','["audit","statutory"]','2025-10-18 12:00:00','2026-04-01 09:00:00'),
  (:company,'FX Forward Contract - EUR 2,240 Chemical Solutions','Treasury','Forward Contract','FXF-2026-0815','/documents/finance/demo/fx-forward-chemsolutions.pdf','142 KB','active','anita.krishnan','["fx","hedge","import"]','2026-08-15 14:00:00','2026-08-15 14:00:00');
