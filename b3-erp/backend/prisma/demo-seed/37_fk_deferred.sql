-- Demo seed — FK-deferred finance children for B3 MACBIS.
-- Seeds tables skipped in earlier passes because their NOT NULL FK parents were empty:
--   asset_depreciation     → fixed_assets        (FA-DEMO-001..010, ids fa5e0000-...-001..010)
--   asset_maintenance      → fixed_assets
--   reconciliation_matches → bank_reconciliations (RECON-DEMO-001/002)
-- None of these three tables carries a companyId column; tenancy flows through the parents.
-- Idempotency predicates (documented):
--   asset_depreciation:     parent-scoped — assetId IN (fixed_assets WHERE assetCode LIKE 'FA-DEMO-%')
--   asset_maintenance:      marker-scoped — maintenanceNumber LIKE 'MNT-DEMO-%'
--   reconciliation_matches: parent-scoped — reconciliationId IN (bank_reconciliations WHERE reconciliationNumber LIKE 'RECON-DEMO-%')
-- Parents are referenced via subselects on their business keys (assetCode / reconciliationNumber /
-- financial_periods.periodName / bank_statements.description), never hardcoded ids.

-- ---------------------------------------------------------------------------
-- 1) asset_depreciation — July 2026 + August 2026 monthly SLM run for all 10 demo assets.
--    Arithmetic is coherent with fixed_assets: monthly amount = acquisitionCost × rate% ÷ 12,
--    and each asset's August closingBookValue / accumulatedDepreciation equal the
--    netBookValue / accumulatedDepreciation stored on the fixed_assets row
--    (schedules posted through Aug 2026). FA-DEMO-002 carries a 1-paisa rounding
--    split (43,333.34 / 43,333.33) so the running total stays exact.
-- ---------------------------------------------------------------------------
DELETE FROM asset_depreciation
 WHERE "assetId" IN (SELECT id FROM fixed_assets WHERE "assetCode" LIKE 'FA-DEMO-%');

INSERT INTO asset_depreciation
  ("assetId", "depreciationNumber", "periodId", "depreciationDate", "depreciationAmount",
   "openingBookValue", "closingBookValue", "accumulatedDepreciation",
   "isPosted", "postedBy", "postedAt", notes, "createdBy")
VALUES
  -- July 2026 run (posted 2026-08-05)
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-001'),'DEP-DEMO-001',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',70000.00,4970000.00,4900000.00,3500000.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 10.00% p.a. — CNC Laser Cutting Machine','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-002'),'DEP-DEMO-002',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',43333.34,3076666.67,3033333.33,2166666.67,true,'finance.controller','2026-08-05 10:15:00','SLM @ 10.00% p.a. — CNC Press Brake (rounding month)','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-003'),'DEP-DEMO-003',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',37500.00,2325000.00,2287500.00,1312500.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 12.50% p.a. — Welding Robot Cell A','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-004'),'DEP-DEMO-004',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',40000.00,2720000.00,2680000.00,1160000.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 12.50% p.a. — Welding Robot Cell B','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-005'),'DEP-DEMO-005',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',50000.00,3950000.00,3900000.00,2100000.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 10.00% p.a. — Powder Coating Line','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-006'),'DEP-DEMO-006',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',12500.00,662500.00,650000.00,550000.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 12.50% p.a. — Forklift #1','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-007'),'DEP-DEMO-007',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',12000.00,864000.00,852000.00,300000.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 12.50% p.a. — Forklift #2','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-008'),'DEP-DEMO-008',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',125000.00,34125000.00,34000000.00,11000000.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 3.33% p.a. (30-yr life) — Factory & Office Building','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-009'),'DEP-DEMO-009',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',15000.00,855000.00,840000.00,960000.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 10.00% p.a. — Diesel Generator 250 kVA','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-010'),'DEP-DEMO-010',(SELECT id::text FROM financial_periods WHERE "periodName"='July 2026' LIMIT 1),'2026-07-31',20000.00,380000.00,360000.00,600000.00,true,'finance.controller','2026-08-05 10:15:00','SLM @ 25.00% p.a. — ERP & CAD Workstation Batch','demo-seed'),
  -- August 2026 run (posted 2026-09-02); closing values tie back to fixed_assets book values
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-001'),'DEP-DEMO-011',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',70000.00,4900000.00,4830000.00,3570000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 10.00% p.a. — CNC Laser Cutting Machine','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-002'),'DEP-DEMO-012',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',43333.33,3033333.33,2990000.00,2210000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 10.00% p.a. — CNC Press Brake','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-003'),'DEP-DEMO-013',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',37500.00,2287500.00,2250000.00,1350000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 12.50% p.a. — Welding Robot Cell A','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-004'),'DEP-DEMO-014',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',40000.00,2680000.00,2640000.00,1200000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 12.50% p.a. — Welding Robot Cell B','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-005'),'DEP-DEMO-015',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',50000.00,3900000.00,3850000.00,2150000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 10.00% p.a. — Powder Coating Line','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-006'),'DEP-DEMO-016',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',12500.00,650000.00,637500.00,562500.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 12.50% p.a. — Forklift #1','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-007'),'DEP-DEMO-017',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',12000.00,852000.00,840000.00,312000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 12.50% p.a. — Forklift #2','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-008'),'DEP-DEMO-018',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',125000.00,34000000.00,33875000.00,11125000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 3.33% p.a. (30-yr life) — Factory & Office Building','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-009'),'DEP-DEMO-019',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',15000.00,840000.00,825000.00,975000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 10.00% p.a. — Diesel Generator 250 kVA','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-010'),'DEP-DEMO-020',(SELECT id::text FROM financial_periods WHERE "periodName"='August 2026' LIMIT 1),'2026-08-31',20000.00,360000.00,340000.00,620000.00,true,'finance.controller','2026-09-02 09:40:00','SLM @ 25.00% p.a. — ERP & CAD Workstation Batch','demo-seed');

-- ---------------------------------------------------------------------------
-- 2) asset_maintenance — 9 records, preventive/breakdown/corrective mix.
--    Service providers are real vendors rows; MNT-DEMO-007 (₹118,000 AMC) matches
--    the "CHQ DR MAINTAINPRO SERVICES AMC Q2" bank statement line reconciled below.
-- ---------------------------------------------------------------------------
DELETE FROM asset_maintenance WHERE "maintenanceNumber" LIKE 'MNT-DEMO-%';

INSERT INTO asset_maintenance
  ("assetId", "maintenanceNumber", "maintenanceDate", "maintenanceType", description,
   "serviceProvider", cost, "invoiceNumber", "nextMaintenanceDate", notes, "performedBy", "createdBy")
VALUES
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-001'),'MNT-DEMO-001','2025-11-14','Preventive','Quarterly service: laser optics cleaning, lens calibration, chiller coolant replacement.','MaintainPro Services',85000.00,'MPS/2025/2214','2026-02-14','Cutting accuracy verified to 0.05 mm post-service.','Ravi Shankar','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-005'),'MNT-DEMO-002','2025-12-09','Preventive','Half-yearly service: curing-oven burner tuning, conveyor chain lubrication, booth filter change.','MaintainPro Services',64000.00,'MPS/2025/2307','2026-06-09','Oven temperature profile within +/- 5 deg C.','Ravi Shankar','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-006'),'MNT-DEMO-003','2026-01-21','Breakdown','Hydraulic pump seal failure; pump rebuilt and hoses replaced. 2 days downtime.','ProTool Equipment Inc.',38500.00,'PTE/2026/0142',NULL,'Root cause: contaminated hydraulic oil; filtration interval tightened.','Suresh Kumar','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-003'),'MNT-DEMO-004','2026-02-17','Preventive','Annual overhaul: torch liner and wire-feeder replacement, TCP recalibration, cable dressing.','ElectroTech Supplies',52000.00,'ETS/2026/0388','2027-02-17','Weld-seam repeatability re-baselined after TCP calibration.','Anil Mehta','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-009'),'MNT-DEMO-005','2026-03-05','Preventive','250-hour service: oil and filter change, fuel injector cleaning, load-bank test at 80%.','MaintainPro Services',22500.00,'MPS/2026/0451','2026-09-05','Load test passed; AVR output stable.','Ravi Shankar','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-002'),'MNT-DEMO-006','2026-04-28','Corrective','Back-gauge servo drive replaced after positioning drift; axes re-referenced and crowning table recalibrated.','ProTool Equipment Inc.',74800.00,'PTE/2026/0517',NULL,'Bend-angle deviation restored to spec (< 0.5 deg).','Suresh Kumar','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-008'),'MNT-DEMO-007','2026-06-30','Preventive','Q2 AMC: HVAC servicing, fire hydrant and sprinkler inspection, roof waterproofing check.','MaintainPro Services',118000.00,'MPS/AMC/Q2-2026','2026-09-30','Paid by cheque; appears on July 2026 bank statement (RECON-DEMO-001).','Facilities Team','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-007'),'MNT-DEMO-008','2026-07-19','Breakdown','Mast lift chain snapped under load; chain and rollers replaced, mast alignment checked.','ProTool Equipment Inc.',26400.00,'PTE/2026/0733',NULL,'Operator load-limit refresher conducted.','Suresh Kumar','demo-seed'),
  ((SELECT id FROM fixed_assets WHERE "assetCode"='FA-DEMO-004'),'MNT-DEMO-009','2026-08-22','Preventive','Annual calibration: TCP verification, gearbox backlash check, controller battery replacement.','ElectroTech Supplies',55000.00,'ETS/2026/1104','2027-08-22','No corrective action needed; all axes within tolerance.','Anil Mehta','demo-seed');

-- ---------------------------------------------------------------------------
-- 3) reconciliation_matches — 10 matches (8 for RECON-DEMO-001, 2 for RECON-DEMO-002),
--    consistent with the parents' matchedTransactions counters (8 and 2) and with the
--    12 bank_statements rows: every statement line flagged isMatched gets exactly one
--    match; the two unmatched Aug lines (salary reversal / F&F cheque) get none.
--    bankStatementId is a varchar column (no FK) — filled with bank_statements.id::text
--    via description-scoped subselects. paymentId/generalLedgerId left NULL: the demo
--    payments rows do not correspond to these statement amounts.
-- ---------------------------------------------------------------------------
DELETE FROM reconciliation_matches
 WHERE "reconciliationId" IN (SELECT id FROM bank_reconciliations WHERE "reconciliationNumber" LIKE 'RECON-DEMO-%');

INSERT INTO reconciliation_matches
  ("reconciliationId", "bankStatementId", "matchType", amount, "matchedDate", "matchedBy", "confidenceScore", notes)
VALUES
  -- RECON-DEMO-001 (July 2026 statement, reconciled 2026-08-04)
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),(SELECT id::text FROM bank_statements WHERE description LIKE 'NEFT CR GOLDEN SPOON%' LIMIT 1),'Automatic',310000.00,'2026-08-04','finance.controller',98,'Auto-matched on NEFT reference to customer receipt — Golden Spoon Franchises.'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),(SELECT id::text FROM bank_statements WHERE description LIKE 'RTGS DR PRIME STEEL%' LIMIT 1),'Automatic',485600.00,'2026-08-04','finance.controller',97,'Auto-matched on RTGS UTR to vendor payment — Prime Steel Suppliers, PO-2026-118.'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),(SELECT id::text FROM bank_statements WHERE description LIKE 'NEFT CR BLUE FIG%' LIMIT 1),'Automatic',225000.00,'2026-08-04','finance.controller',96,'Auto-matched to part-payment receipt — Blue Fig Hotels Group.'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),(SELECT id::text FROM bank_statements WHERE description LIKE 'CHQ DR MAINTAINPRO%' LIMIT 1),'Manual',118000.00,'2026-08-04','Meera Krishnan',NULL,'Cheque matched manually to MaintainPro AMC Q2 invoice MPS/AMC/Q2-2026 (asset maintenance MNT-DEMO-007).'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),(SELECT id::text FROM bank_statements WHERE description LIKE 'NEFT CR METRO HOSPITAL%' LIMIT 1),'Automatic',204000.00,'2026-08-04','finance.controller',92,'Auto-matched to on-account receipt — Metro Hospital Kitchens.'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),(SELECT id::text FROM bank_statements WHERE description LIKE 'RTGS DR ELECTROTECH%' LIMIT 1),'Automatic',264500.00,'2026-08-04','finance.controller',97,'Auto-matched on RTGS UTR to vendor payment — ElectroTech Supplies, PO-2026-131.'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),(SELECT id::text FROM bank_statements WHERE description LIKE 'NEFT CR HARBOUR GRILL%' LIMIT 1),'Automatic',645930.00,'2026-08-04','finance.controller',99,'Auto-matched to invoice settlement receipt — Harbour Grill Restaurants.'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-001'),(SELECT id::text FROM bank_statements WHERE description LIKE 'ACCOUNT MAINTENANCE CHARGES%' LIMIT 1),'Manual',2500.00,'2026-08-04','Meera Krishnan',NULL,'Bank charges journalised and matched manually during reconciliation.'),
  -- RECON-DEMO-002 (August 2026 statement, reconciled 2026-09-03)
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-002'),(SELECT id::text FROM bank_statements WHERE description LIKE 'FUND TRANSFER FROM OPERATIONS%' LIMIT 1),'Automatic',1500000.00,'2026-09-03','finance.controller',95,'Auto-matched to inter-account transfer for payroll funding.'),
  ((SELECT id FROM bank_reconciliations WHERE "reconciliationNumber"='RECON-DEMO-002'),(SELECT id::text FROM bank_statements WHERE description LIKE 'SALARY BATCH AUG 2026%' LIMIT 1),'Automatic',1656200.00,'2026-09-03','finance.controller',94,'Auto-matched to August 2026 payroll disbursement batch (92 employees).');
