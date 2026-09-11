-- Demo seed — Inventory stock entries + lines (Prisma-managed tables).
-- ~50 entries spread over 2025-10-01 .. 2026-09-10 so movement-trend and
-- receipts-vs-issues dashboards look realistic.
--
-- Notes discovered from live DDL (TypeORM-created enums, despite Prisma model
-- declaring plain String):
--   entryType         : stock_entries_entrytype_enum  ('Material Receipt', 'Material Issue', ...)
--   movementDirection : stock_entries_movementdirection_enum ('In' | 'Out' | 'Internal')
--   status            : stock_entries_status_enum ('Draft' | 'Submitted' | 'Posted' | 'Cancelled')
--   stock_entries has NO companyId column; warehouse refs are plain varchar
--   (no FK) but we still use real core_warehouses / stock_locations UUIDs.
--
-- Idempotent: deletes rows whose entryNumber starts with 'STE-DEMO-' then re-inserts.

-- ---------------------------------------------------------------------------
-- 1. Clear previous demo rows (lines first via parent join, then headers).
-- ---------------------------------------------------------------------------
DELETE FROM stock_entry_lines
WHERE "stockEntryId" IN (
  SELECT id FROM stock_entries WHERE "entryNumber" LIKE 'STE-DEMO-%'
);

DELETE FROM stock_entries WHERE "entryNumber" LIKE 'STE-DEMO-%';

-- ---------------------------------------------------------------------------
-- 2. Headers: 50 entries, one every 7 days from 2025-10-01 (last = 2026-09-09).
--    Type mix per i%10 (5 rows per residue):
--      1,2,6 -> Material Receipt (In)      = 15
--      3,7,0 -> Material Issue   (Out)     = 15
--      4     -> Purchase Receipt (In)      =  5
--      8     -> Sales Issue      (Out)     =  5
--      5     -> Material Transfer (Internal)      = 5
--      9     -> Stock Reconciliation (Internal)   = 5
--    Status: entries older than ~1 month are Posted; 2 Submitted; 2 Draft.
-- ---------------------------------------------------------------------------
INSERT INTO stock_entries
  ("entryNumber", "entryType", "movementDirection", "postingDate", "postingTime",
   status, "isPosted", "postedAt", "postedBy",
   "fromWarehouseId", "fromWarehouseName", "toWarehouseId", "toWarehouseName",
   "supplierName", "customerName",
   "totalValue", currency, "additionalCosts", remarks,
   "createdBy", "createdAt", "updatedAt")
SELECT
  'STE-DEMO-' || lpad(g.i::text, 4, '0'),
  t.entry_type::stock_entries_entrytype_enum,
  t.direction::stock_entries_movementdirection_enum,
  d.pdate,
  d.ptime,
  (CASE WHEN g.i <= 46 THEN 'Posted'
        WHEN g.i <= 48 THEN 'Submitted'
        ELSE 'Draft' END)::stock_entries_status_enum,
  g.i <= 46,
  CASE WHEN g.i <= 46 THEN d.ptime + interval '2 hours' END,
  CASE WHEN g.i <= 46 THEN 'demo.storekeeper' END,
  -- from-warehouse for Out/Internal movements
  CASE WHEN t.direction IN ('Out', 'Internal') THEN wf.id::text END,
  CASE WHEN t.direction IN ('Out', 'Internal') THEN wf."warehouseName" END,
  -- to-warehouse for In/Internal movements
  CASE WHEN t.direction IN ('In', 'Internal') THEN wt.id::text END,
  CASE WHEN t.direction IN ('In', 'Internal') THEN wt."warehouseName" END,
  CASE WHEN t.entry_type = 'Purchase Receipt' THEN
    (ARRAY['Precision Metals & Alloys Pvt Ltd','Apex Bearings Co','Volt Electricals Trading',
           'Sterling Steel Suppliers','IndoTools Distribution'])[(g.i % 5) + 1] END,
  CASE WHEN t.entry_type = 'Sales Issue' THEN
    (ARRAY['Harbour Grill Restaurants','Blue Fig Hotels Group','Metro Hospital Kitchens',
           'Golden Spoon Franchises','Lakeside Resort & Spa'])[(g.i % 5) + 1] END,
  0,                       -- totalValue recomputed from lines in step 4
  'INR',
  0,
  'Demo seed — ' || t.entry_type,
  'demo.seed',
  d.ptime,
  d.ptime
FROM generate_series(1, 50) AS g(i)
CROSS JOIN LATERAL (
  SELECT
    DATE '2025-10-01' + ((g.i - 1) * 7)                                        AS pdate,
    (DATE '2025-10-01' + ((g.i - 1) * 7))::timestamp
      + make_interval(hours => 9 + (g.i % 7), mins => (g.i * 13) % 60)         AS ptime
) d
CROSS JOIN LATERAL (
  SELECT
    CASE g.i % 10
      WHEN 1 THEN 'Material Receipt'
      WHEN 2 THEN 'Material Receipt'
      WHEN 6 THEN 'Material Receipt'
      WHEN 3 THEN 'Material Issue'
      WHEN 7 THEN 'Material Issue'
      WHEN 0 THEN 'Material Issue'
      WHEN 4 THEN 'Purchase Receipt'
      WHEN 8 THEN 'Sales Issue'
      WHEN 5 THEN 'Material Transfer'
      ELSE        'Stock Reconciliation'
    END AS entry_type,
    CASE g.i % 10
      WHEN 1 THEN 'In' WHEN 2 THEN 'In' WHEN 6 THEN 'In' WHEN 4 THEN 'In'
      WHEN 3 THEN 'Out' WHEN 7 THEN 'Out' WHEN 0 THEN 'Out' WHEN 8 THEN 'Out'
      ELSE 'Internal'
    END AS direction
) t
LEFT JOIN LATERAL (
  SELECT id, "warehouseName" FROM core_warehouses
  ORDER BY "warehouseCode" OFFSET (g.i % 7) LIMIT 1
) wf ON true
LEFT JOIN LATERAL (
  SELECT id, "warehouseName" FROM core_warehouses
  ORDER BY "warehouseCode" OFFSET ((g.i + 3) % 7) LIMIT 1
) wt ON true;

-- ---------------------------------------------------------------------------
-- 3. Lines: 1..4 per entry, referencing the real items master (stocked
--    materials/spares only — services and capital assets excluded).
--    Rate = item standardCost with a small deterministic variation (95%..105%).
-- ---------------------------------------------------------------------------
INSERT INTO stock_entry_lines
  ("stockEntryId", "lineNumber", "itemId", "itemCode", "itemName", description,
   quantity, uom, "stockUom", "stockQuantity",
   "fromLocationId", "fromLocationName", "toLocationId", "toLocationName",
   rate, amount, "valuationMethod", "qualityStatus",
   "createdAt", "updatedAt")
SELECT
  se.id,
  ln.n,
  it.id::text,
  it."itemCode",
  it."itemName",
  'Demo movement of ' || it."itemName",
  q.qty,
  it."baseUOM",
  it."baseUOM",
  q.qty,
  lf.id::text,
  lf."locationName",
  lt.id::text,
  lt."locationName",
  r.rate,
  round(q.qty * r.rate, 2),
  'Weighted Average',
  CASE WHEN se."entryType" IN ('Material Receipt', 'Purchase Receipt') THEN 'Accepted' END,
  se."createdAt",
  se."updatedAt"
FROM stock_entries se
CROSS JOIN LATERAL (SELECT right(se."entryNumber", 4)::int AS i) v
CROSS JOIN LATERAL generate_series(1, 1 + (v.i % 4)) AS ln(n)
CROSS JOIN LATERAL (
  SELECT id, "itemCode", "itemName", "baseUOM", "standardCost"
  FROM items
  WHERE "itemCode" NOT LIKE 'SVC-%'   -- services: not stock-movable
    AND "itemCode" NOT LIKE 'AST-%'   -- capital assets: would skew totals
  ORDER BY "itemCode"
  OFFSET ((v.i * 3 + ln.n * 5) % (SELECT count(*) FROM items
                                  WHERE "itemCode" NOT LIKE 'SVC-%'
                                    AND "itemCode" NOT LIKE 'AST-%'))
  LIMIT 1
) it
CROSS JOIN LATERAL (
  SELECT CASE
    WHEN it."baseUOM" IN ('KG', 'MTR', 'LTR')
      THEN (25 + ((v.i * 7 + ln.n * 13) % 8) * 25)::numeric   -- bulk: 25..200
    ELSE (2 + ((v.i + ln.n * 3) % 9) * 2)::numeric            -- units: 2..18
  END AS qty
) q
CROSS JOIN LATERAL (
  SELECT round(it."standardCost" * (0.95 + ((v.i + ln.n) % 11) * 0.01), 2) AS rate
) r
LEFT JOIN LATERAL (
  SELECT id, "locationName" FROM stock_locations
  WHERE "warehouseId" = se."fromWarehouseId"::uuid
  ORDER BY "locationCode" OFFSET ((v.i + ln.n) % 5) LIMIT 1
) lf ON se."fromWarehouseId" IS NOT NULL
LEFT JOIN LATERAL (
  SELECT id, "locationName" FROM stock_locations
  WHERE "warehouseId" = se."toWarehouseId"::uuid
  ORDER BY "locationCode" OFFSET ((v.i + ln.n) % 5) LIMIT 1
) lt ON se."toWarehouseId" IS NOT NULL
WHERE se."entryNumber" LIKE 'STE-DEMO-%';

-- ---------------------------------------------------------------------------
-- 4. Header totalValue = sum of line amounts.
-- ---------------------------------------------------------------------------
UPDATE stock_entries se
SET "totalValue" = agg.total
FROM (
  SELECT "stockEntryId", sum(amount) AS total
  FROM stock_entry_lines
  GROUP BY "stockEntryId"
) agg
WHERE agg."stockEntryId" = se.id
  AND se."entryNumber" LIKE 'STE-DEMO-%';
