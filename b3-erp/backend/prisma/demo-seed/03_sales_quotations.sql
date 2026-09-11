-- Demo seed — Sales Quotations (headers + items) for B3 MACBIS.
-- 36 quotations spread 2025-10-01 .. 2026-09-10 (heavier recent months) so the
-- sales-quotation dashboards show realistic pipeline / win-rate trends.
-- Status mix: draft 4, sent 10, accepted 12, rejected 6, expired 4.
-- Customers come from crm_customers (seeded by 01_crm.sql, companyId-scoped);
-- products come from the real `items` master (never invented UUIDs).
-- Note: sales_quotations has NO companyId column, so demo rows are scoped by
-- the QT-DEMO- quotationNumber prefix.
-- Idempotent: clears QT-DEMO-% rows first (items via parent join), re-inserts,
-- then rolls line totals up into the headers so amounts are coherent.
\set company '''b3000000-0000-4000-8000-000000000001'''

DELETE FROM sales_quotation_items WHERE "quotationId" IN (
  SELECT id FROM sales_quotations WHERE "quotationNumber" LIKE 'QT-DEMO-%');
DELETE FROM sales_quotations WHERE "quotationNumber" LIKE 'QT-DEMO-%';

-- ---------------------------------------------------------------------------
-- Headers. customerId / customerName / contactPerson / paymentTerms come from
-- crm_customers; amounts start at 0 and are rolled up from items at the end.
-- Expired quotes have validUntil in the past; sent/draft ones are still open.
-- ---------------------------------------------------------------------------
INSERT INTO sales_quotations
  ("quotationNumber", "customerId", "customerName", "contactPerson",
   "quotationDate", "validUntil", status, currency, "paymentTerms",
   "deliveryTerms", notes, "createdAt", "updatedAt")
SELECT
  v.qno, c.id::text, c."customerName", c."contactPerson",
  v.qdate::date, v.valid::date, v.status::sales_quotations_status_enum,
  'USD', c."paymentTerms", v.dterms, v.note,
  v.qdate::timestamp + interval '9 hours 30 minutes',
  v.qdate::timestamp + interval '13 hours 30 minutes'
FROM (VALUES
  -- Oct 2025
  ('QT-DEMO-2025-0001','Harbour Grill Restaurants','2025-10-06','2025-11-05','accepted','DDP - Site Delivery','Pump-line refresh for two flagship kitchens'),
  ('QT-DEMO-2025-0002','Blue Fig Hotels Group',    '2025-10-21','2025-11-20','expired', 'Ex-Works',           'Spares top-up; customer did not respond in validity window'),
  -- Nov 2025
  ('QT-DEMO-2025-0003','Campus Dining Co-op',      '2025-11-05','2025-12-05','rejected','DDP - Site Delivery','Lost on price to incumbent vendor'),
  ('QT-DEMO-2025-0004','Golden Spoon Franchises',  '2025-11-18','2025-12-18','accepted','FOB Factory',        'Franchise expansion phase 1 equipment package'),
  -- Dec 2025
  ('QT-DEMO-2025-0005','Metro Hospital Kitchens',  '2025-12-04','2026-01-03','expired', 'DDP - Site Delivery','AMC + spares proposal; lapsed over year-end freeze'),
  ('QT-DEMO-2025-0006','Summit Catering Services', '2025-12-15','2026-01-14','accepted','Ex-Works',           'Gearbox and consumables bundle for event fleet'),
  -- Jan 2026
  ('QT-DEMO-2026-0007','Lakeside Resort & Spa',    '2026-01-08','2026-02-07','accepted','DDP - Site Delivery','Motor upgrade across spa kitchens'),
  ('QT-DEMO-2026-0008','Riverside Bistro Chain',   '2026-01-22','2026-02-21','expired', 'FOB Factory',        'Tooling starter kit; prospect went quiet'),
  -- Feb 2026
  ('QT-DEMO-2026-0009','Harbour Grill Restaurants','2026-02-05','2026-03-07','rejected','Ex-Works',           'Budget cut on their side; revisit in Q3'),
  ('QT-DEMO-2026-0010','Blue Fig Hotels Group',    '2026-02-12','2026-03-14','accepted','DDP - Site Delivery','Multi-property maintenance package renewal'),
  ('QT-DEMO-2026-0011','Golden Spoon Franchises',  '2026-02-24','2026-03-26','accepted','FOB Factory',        'Gearbox retrofit for legacy stores'),
  -- Mar 2026
  ('QT-DEMO-2026-0012','Campus Dining Co-op',      '2026-03-05','2026-04-04','expired', 'Ex-Works',           'Calibration services; semester timing missed'),
  ('QT-DEMO-2026-0013','Metro Hospital Kitchens',  '2026-03-12','2026-04-11','accepted','DDP - Site Delivery','Pump replacement program, ward kitchens'),
  ('QT-DEMO-2026-0014','Summit Catering Services', '2026-03-25','2026-04-24','rejected','FOB Factory',        'Chose refurbished units elsewhere'),
  -- Apr 2026
  ('QT-DEMO-2026-0015','Lakeside Resort & Spa',    '2026-04-03','2026-05-03','accepted','DDP - Site Delivery','Pre-season readiness bundle'),
  ('QT-DEMO-2026-0016','Harbour Grill Restaurants','2026-04-15','2026-05-15','rejected','Ex-Works',           'Deferred to next fiscal year'),
  ('QT-DEMO-2026-0017','Golden Spoon Franchises',  '2026-04-27','2026-05-27','accepted','DDP - Site Delivery','Franchise expansion phase 2 equipment package'),
  -- May 2026
  ('QT-DEMO-2026-0018','Blue Fig Hotels Group',    '2026-05-07','2026-06-06','accepted','DDP - Site Delivery','Summer season capacity build-out'),
  ('QT-DEMO-2026-0019','Riverside Bistro Chain',   '2026-05-14','2026-06-13','rejected','FOB Factory',        'Tooling quote lost on lead time'),
  ('QT-DEMO-2026-0020','Campus Dining Co-op',      '2026-05-26','2026-06-25','accepted','Ex-Works',           'Summer refurbishment window order'),
  -- Jun 2026
  ('QT-DEMO-2026-0021','Metro Hospital Kitchens',  '2026-06-04','2026-07-04','accepted','DDP - Site Delivery','Gearbox + AMC combo, central kitchen'),
  ('QT-DEMO-2026-0022','Summit Catering Services', '2026-06-11','2026-07-11','rejected','Ex-Works',           'Small pump quote; postponed purchase'),
  ('QT-DEMO-2026-0023','Lakeside Resort & Spa',    '2026-06-18','2026-09-18','sent',    'DDP - Site Delivery','Awaiting board sign-off; 90-day validity granted'),
  ('QT-DEMO-2026-0024','Golden Spoon Franchises',  '2026-06-29','2026-09-27','sent',    'FOB Factory',        'Phase 3 rollout proposal under franchisee review'),
  -- Jul 2026
  ('QT-DEMO-2026-0025','Harbour Grill Restaurants','2026-07-08','2026-10-06','sent',    'DDP - Site Delivery','Q4 refresh proposal; follow-up scheduled'),
  ('QT-DEMO-2026-0026','Blue Fig Hotels Group',    '2026-07-16','2026-09-14','sent',    'Ex-Works',           'Motor fleet standardisation proposal'),
  ('QT-DEMO-2026-0027','Riverside Bistro Chain',   '2026-07-23','2026-09-21','sent',    'FOB Factory',        'Revised tooling quote after feedback'),
  ('QT-DEMO-2026-0028','Metro Hospital Kitchens',  '2026-07-30','2026-09-28','sent',    'DDP - Site Delivery','Annual calibration + spares contract'),
  -- Aug 2026
  ('QT-DEMO-2026-0029','Campus Dining Co-op',      '2026-08-06','2026-10-05','sent',    'DDP - Site Delivery','Fall semester pump + maintenance quote'),
  ('QT-DEMO-2026-0030','Summit Catering Services', '2026-08-13','2026-09-12','sent',    'Ex-Works',           'Wedding-season spares replenishment'),
  ('QT-DEMO-2026-0031','Golden Spoon Franchises',  '2026-08-20','2026-09-19','sent',    'DDP - Site Delivery','Gearbox bulk order under negotiation'),
  ('QT-DEMO-2026-0032','Lakeside Resort & Spa',    '2026-08-27','2026-09-26','draft',   'DDP - Site Delivery','Drafting winter maintenance scope'),
  ('QT-DEMO-2026-0033','Harbour Grill Restaurants','2026-08-31','2026-09-30','draft',   'Ex-Works',           'Pump + seal package, pending engineering review'),
  -- Sep 2026
  ('QT-DEMO-2026-0034','Blue Fig Hotels Group',    '2026-09-03','2026-10-03','draft',   'DDP - Site Delivery','New property fit-out, scope being finalised'),
  ('QT-DEMO-2026-0035','Metro Hospital Kitchens',  '2026-09-07','2026-10-07','sent',    'DDP - Site Delivery','Urgent motor + bearing replacement quote'),
  ('QT-DEMO-2026-0036','Golden Spoon Franchises',  '2026-09-09','2026-10-09','draft',   'FOB Factory',        'Pilot store equipment trial quote')
) AS v(qno, cust, qdate, valid, status, dterms, note)
JOIN crm_customers c
  ON c."customerName" = v.cust AND c."companyId" = :company;

-- ---------------------------------------------------------------------------
-- Items. productId/code/name, unitPrice (standardSellingPrice), unitCost
-- (standardCost) and taxRate are pulled straight from the `items` master so
-- denormalized values always match. totalAmount = qty * unitPrice.
-- ---------------------------------------------------------------------------
INSERT INTO sales_quotation_items
  ("quotationId", "productId", "productCode", "productName", description,
   quantity, "unitPrice", "unitCost", "discountPercentage", "taxRate",
   "totalAmount", "marginPercentage")
SELECT
  q.id, i.id::text, i."itemCode", i."itemName", i."itemDescription",
  v.qty, i."standardSellingPrice", i."standardCost", 0, i."taxRate",
  round(v.qty * i."standardSellingPrice", 2),
  round((i."standardSellingPrice" - i."standardCost")
        / i."standardSellingPrice" * 100, 2)
FROM (VALUES
  ('QT-DEMO-2025-0001','FG-PMP-001', 4), ('QT-DEMO-2025-0001','SP-SL-001',   8), ('QT-DEMO-2025-0001','SVC-CAL-001', 2),
  ('QT-DEMO-2025-0002','FG-MTR-001', 2), ('QT-DEMO-2025-0002','SP-BRG-001', 12),
  ('QT-DEMO-2025-0003','FG-GBX-001', 1), ('QT-DEMO-2025-0003','SVC-MNT-001', 1), ('QT-DEMO-2025-0003','SP-BLT-001', 10),
  ('QT-DEMO-2025-0004','FG-PMP-001', 6), ('QT-DEMO-2025-0004','FG-MTR-001',  3), ('QT-DEMO-2025-0004','SP-SL-001',   6), ('QT-DEMO-2025-0004','SVC-MNT-001', 2),
  ('QT-DEMO-2025-0005','SVC-MNT-001',4), ('QT-DEMO-2025-0005','SP-BRG-001', 20),
  ('QT-DEMO-2025-0006','FG-GBX-001', 2), ('QT-DEMO-2025-0006','SP-BLT-001', 14), ('QT-DEMO-2025-0006','TOOL-DRL-001',3),
  ('QT-DEMO-2026-0007','FG-MTR-001', 5), ('QT-DEMO-2026-0007','SP-SL-001',  10), ('QT-DEMO-2026-0007','SVC-CAL-001', 3),
  ('QT-DEMO-2026-0008','TOOL-INS-001',20),('QT-DEMO-2026-0008','TOOL-DRL-001',5),
  ('QT-DEMO-2026-0009','FG-PMP-001', 3), ('QT-DEMO-2026-0009','FG-GBX-001',  1), ('QT-DEMO-2026-0009','SP-BRG-001', 16),
  ('QT-DEMO-2026-0010','FG-MTR-001', 8), ('QT-DEMO-2026-0010','SVC-MNT-001', 4), ('QT-DEMO-2026-0010','SP-BLT-001', 24), ('QT-DEMO-2026-0010','SP-SL-001',   8),
  ('QT-DEMO-2026-0011','FG-GBX-001', 3), ('QT-DEMO-2026-0011','FG-PMP-001',  2),
  ('QT-DEMO-2026-0012','SVC-CAL-001',6), ('QT-DEMO-2026-0012','TOOL-INS-001',15),
  ('QT-DEMO-2026-0013','FG-PMP-001', 5), ('QT-DEMO-2026-0013','SP-SL-001',  12), ('QT-DEMO-2026-0013','SVC-MNT-001', 2),
  ('QT-DEMO-2026-0014','FG-MTR-001', 4), ('QT-DEMO-2026-0014','SP-BRG-001', 24), ('QT-DEMO-2026-0014','TOOL-DRL-001',4),
  ('QT-DEMO-2026-0015','FG-GBX-001', 2), ('QT-DEMO-2026-0015','FG-MTR-001',  2), ('QT-DEMO-2026-0015','SVC-CAL-001', 4),
  ('QT-DEMO-2026-0016','FG-PMP-001', 8), ('QT-DEMO-2026-0016','SP-SL-001',  16),
  ('QT-DEMO-2026-0017','FG-MTR-001', 6), ('QT-DEMO-2026-0017','FG-GBX-001',  2), ('QT-DEMO-2026-0017','SP-BLT-001', 30), ('QT-DEMO-2026-0017','SVC-MNT-001', 3),
  ('QT-DEMO-2026-0018','FG-PMP-001',10), ('QT-DEMO-2026-0018','SP-BRG-001', 40), ('QT-DEMO-2026-0018','SVC-CAL-001', 5),
  ('QT-DEMO-2026-0019','TOOL-DRL-001',6),('QT-DEMO-2026-0019','TOOL-INS-001',25),
  ('QT-DEMO-2026-0020','FG-MTR-001', 3), ('QT-DEMO-2026-0020','SP-SL-001',   9), ('QT-DEMO-2026-0020','SP-BLT-001', 12),
  ('QT-DEMO-2026-0021','FG-GBX-001', 4), ('QT-DEMO-2026-0021','SVC-MNT-001', 6), ('QT-DEMO-2026-0021','SP-BRG-001', 30),
  ('QT-DEMO-2026-0022','FG-PMP-001', 2), ('QT-DEMO-2026-0022','SVC-CAL-001', 2),
  ('QT-DEMO-2026-0023','FG-MTR-001', 7), ('QT-DEMO-2026-0023','FG-PMP-001',  4), ('QT-DEMO-2026-0023','SP-SL-001',  14),
  ('QT-DEMO-2026-0024','FG-GBX-001', 5), ('QT-DEMO-2026-0024','SP-BLT-001', 40), ('QT-DEMO-2026-0024','TOOL-INS-001',30), ('QT-DEMO-2026-0024','SVC-MNT-001', 4),
  ('QT-DEMO-2026-0025','FG-PMP-001', 6), ('QT-DEMO-2026-0025','SP-BRG-001', 36), ('QT-DEMO-2026-0025','SVC-CAL-001', 4),
  ('QT-DEMO-2026-0026','FG-MTR-001',10), ('QT-DEMO-2026-0026','SP-SL-001',  20), ('QT-DEMO-2026-0026','SVC-MNT-001', 5),
  ('QT-DEMO-2026-0027','TOOL-DRL-001',8),('QT-DEMO-2026-0027','TOOL-INS-001',18), ('QT-DEMO-2026-0027','SP-BLT-001', 16),
  ('QT-DEMO-2026-0028','FG-GBX-001', 3), ('QT-DEMO-2026-0028','FG-MTR-001',  4), ('QT-DEMO-2026-0028','SP-BRG-001', 24), ('QT-DEMO-2026-0028','SVC-CAL-001', 6),
  ('QT-DEMO-2026-0029','FG-PMP-001', 5), ('QT-DEMO-2026-0029','SVC-MNT-001', 3),
  ('QT-DEMO-2026-0030','FG-MTR-001', 2), ('QT-DEMO-2026-0030','SP-SL-001',   6), ('QT-DEMO-2026-0030','SP-BLT-001',  8),
  ('QT-DEMO-2026-0031','FG-GBX-001', 6), ('QT-DEMO-2026-0031','FG-PMP-001',  3), ('QT-DEMO-2026-0031','SVC-CAL-001', 3),
  ('QT-DEMO-2026-0032','FG-MTR-001', 5), ('QT-DEMO-2026-0032','SP-BRG-001', 18), ('QT-DEMO-2026-0032','TOOL-DRL-001',2),
  ('QT-DEMO-2026-0033','FG-PMP-001', 7), ('QT-DEMO-2026-0033','SP-SL-001',  10), ('QT-DEMO-2026-0033','SVC-MNT-001', 2), ('QT-DEMO-2026-0033','SP-BLT-001', 20),
  ('QT-DEMO-2026-0034','FG-GBX-001', 2), ('QT-DEMO-2026-0034','SVC-CAL-001', 2),
  ('QT-DEMO-2026-0035','FG-MTR-001', 6), ('QT-DEMO-2026-0035','FG-PMP-001',  2), ('QT-DEMO-2026-0035','SP-BRG-001', 30),
  ('QT-DEMO-2026-0036','FG-GBX-001', 1), ('QT-DEMO-2026-0036','SP-SL-001',   4), ('QT-DEMO-2026-0036','TOOL-INS-001',10)
) AS v(qno, code, qty)
JOIN sales_quotations q ON q."quotationNumber" = v.qno
JOIN items i ON i."itemCode" = v.code;

-- ---------------------------------------------------------------------------
-- Roll line totals up into the headers so subtotal/tax/total and margin are
-- coherent by construction. Flat 18% tax (matches items.taxRate), no discount.
-- ---------------------------------------------------------------------------
UPDATE sales_quotations q
SET subtotal      = s.sub,
    "taxAmount"   = round(s.sub * 0.18, 2),
    "discountAmount" = 0,
    "totalAmount" = s.sub + round(s.sub * 0.18, 2),
    "overallMarginPercentage" = s.margin,
    "marginStatus" = CASE
        WHEN s.margin >= 30 THEN 'healthy'
        WHEN s.margin >= 20 THEN 'warning'
        ELSE 'critical'
      END::sales_quotations_marginstatus_enum
FROM (
  SELECT "quotationId",
         sum("totalAmount")                            AS sub,
         round(avg("marginPercentage"), 2)             AS margin
  FROM sales_quotation_items
  GROUP BY "quotationId"
) s
WHERE s."quotationId" = q.id
  AND q."quotationNumber" LIKE 'QT-DEMO-%';
