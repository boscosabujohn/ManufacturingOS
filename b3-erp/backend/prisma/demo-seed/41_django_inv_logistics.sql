-- Demo seed — Django-platform inventory / WMS / logistics tables + orphan
-- NestJS-manual-SQL warehouse/logistics/packaging tables, for B3 MACBIS.
--
-- Django tables (tenant-scoped, deferrable FKs; tenant b3000000-...-0001 must exist):
--   inventory_item, inventory_stockunit, wms_warehouse, wms_bin, wms_rftask,
--   logistics_carrier, logistics_shipment, logistics_shipmentline
-- Orphan camelCase tables (NO tenant_id, no FKs — TypeORM/manual-SQL side):
--   warehouses, logistics_cross_dock_operations, logistics_dock_doors,
--   logistics_yard_vehicles, packaging_jobs, packaging_materials,
--   packaging_shipping_bills, packaging_staging
--
-- Mirroring strategy (INSERT..SELECT from live NestJS tables so both backends agree):
--   inventory_item        <- items            (demo codes ^(RM|FG|WIP|SP|CON|TOOL)-)
--   inventory_stockunit   <- stock_balances   (39 rows; joined by item code)
--   wms_warehouse         <- core_warehouses  (7 rows)
--   warehouses            <- core_warehouses  (same 7, camelCase mirror)
--   logistics_carrier     <- logistics_transport_companies (7 rows)
--   logistics_shipment(+line) <- logistics_shipments SHP-DEMO-0001..0006 (+items)
--
-- Idempotency predicates (documented; children deleted before parents):
--   Django tables:                DELETE ... WHERE tenant_id = :tenant
--   warehouses:                   "warehouseCode" IN (the 7 mirrored codes)
--   logistics_cross_dock_ops:     "operationNo" LIKE 'XD-DEMO-%'
--   logistics_dock_doors:         "doorNo" LIKE 'DD-DEMO-%'
--   logistics_yard_vehicles:      "vehicleNo" IN (5 controlled plate numbers)
--   packaging_jobs:               "woNumber" LIKE 'WO-DEMO-%'
--   packaging_materials:          "projectId" = 'PRJ-DEMO-PKG'
--   packaging_shipping_bills:     "billNumber" LIKE 'SB-DEMO-%'
--   packaging_staging:            "woNumber" LIKE 'WO-DEMO-%'
--
-- All ids are deterministic md5-derived UUIDs so re-runs produce identical keys.
\set tenant '''b3000000-0000-4000-8000-000000000001'''
SET CONSTRAINTS ALL IMMEDIATE;

-- ============================================================================
-- DELETES (children before parents)
-- ============================================================================
DELETE FROM wms_rftask             WHERE tenant_id = :tenant;
DELETE FROM wms_bin                WHERE tenant_id = :tenant;
DELETE FROM wms_warehouse          WHERE tenant_id = :tenant;
DELETE FROM inventory_stockunit    WHERE tenant_id = :tenant;
DELETE FROM inventory_item         WHERE tenant_id = :tenant;
DELETE FROM logistics_shipmentline WHERE tenant_id = :tenant;
DELETE FROM logistics_shipment     WHERE tenant_id = :tenant;
DELETE FROM logistics_carrier      WHERE tenant_id = :tenant;

DELETE FROM warehouses WHERE "warehouseCode" IN
  ('WH-MAIN','WH-RM','WH-FG','WH-WIP','WH-QC','WH-REJ','WH-SPARE');
DELETE FROM logistics_cross_dock_operations WHERE "operationNo" LIKE 'XD-DEMO-%';
DELETE FROM logistics_dock_doors            WHERE "doorNo" LIKE 'DD-DEMO-%';
DELETE FROM logistics_yard_vehicles         WHERE "vehicleNo" IN
  ('KA-51-KE-4471','KA-51-KE-4472','MH-04-CT-8890','TN-22-DX-1105','KA-05-RF-6634');
DELETE FROM packaging_jobs           WHERE "woNumber" LIKE 'WO-DEMO-%';
DELETE FROM packaging_materials      WHERE "projectId" = 'PRJ-DEMO-PKG';
DELETE FROM packaging_shipping_bills WHERE "billNumber" LIKE 'SB-DEMO-%';
DELETE FROM packaging_staging        WHERE "woNumber" LIKE 'WO-DEMO-%';

-- ============================================================================
-- inventory_item — mirror of NestJS `items` demo set (code/name/uom/cost)
-- item_class: Raw Material/Consumable -> raw, Semi-Finished -> wip, else finished
-- tracking:   serial > batch > none (from track* flags)
-- ============================================================================
INSERT INTO inventory_item
  (id, code, description, uom, item_class, tracking, is_active,
   extensible_attributes, created_at, tenant_id)
SELECT
  md5('demo-inv-item-' || i."itemCode")::uuid,
  i."itemCode",
  i."itemName",
  i."baseUOM",
  CASE i."itemType"::text
    WHEN 'Raw Material'       THEN 'raw'
    WHEN 'Consumable'         THEN 'raw'
    WHEN 'Semi-Finished Good' THEN 'wip'
    ELSE 'finished'
  END,
  CASE WHEN i."trackSerialNumber" THEN 'serial'
       WHEN i."trackBatchNumber"  THEN 'batch'
       ELSE 'none' END,
  true,
  jsonb_build_object('standard_cost', i."standardCost",
                     'item_type', i."itemType"::text,
                     'source', 'b3_items'),
  timestamptz '2025-10-01 09:00:00+00'
    + (row_number() OVER (ORDER BY i."itemCode")) * interval '2 days',
  :tenant
FROM items i
WHERE i."itemCode" ~ '^(RM|FG|WIP|SP|CON|TOOL)-';

-- ============================================================================
-- inventory_stockunit — derived from NestJS `stock_balances` (item x warehouse)
-- tracking 'none' has no StockUnit choice -> coerced to 'lot'
-- status: QC Hold Area -> quarantine, Rejection Store -> scrapped, else available
-- ============================================================================
INSERT INTO inventory_stockunit
  (id, identifier, tracking, qty, location_code, status, received_at,
   item_id, parent_unit_id, tenant_id)
SELECT
  md5('demo-stockunit-' || sb."itemCode" || '-' || wh.code)::uuid,
  'DEMO-' || sb."itemCode" || '-' || wh.code,
  CASE ii.tracking WHEN 'none' THEN 'lot' ELSE ii.tracking END,
  sb."totalQuantity",
  wh.code,
  CASE sb."warehouseName"
    WHEN 'QC Hold Area'    THEN 'quarantine'
    WHEN 'Rejection Store' THEN 'scrapped'
    ELSE 'available'
  END,
  timestamptz '2025-10-10 08:00:00+00'
    + (row_number() OVER (ORDER BY sb."itemCode", wh.code)) * interval '4 days',
  ii.id,
  NULL,
  :tenant
FROM stock_balances sb
JOIN (VALUES
    ('Main Warehouse','WH-MAIN'),
    ('Raw Material Store','WH-RM'),
    ('Finished Goods Store','WH-FG'),
    ('Work in Progress','WH-WIP'),
    ('QC Hold Area','WH-QC'),
    ('Rejection Store','WH-REJ'),
    ('Spare Parts Store','WH-SPARE')
  ) AS wh(name, code) ON wh.name = sb."warehouseName"
JOIN inventory_item ii
  ON ii.tenant_id = :tenant AND ii.code = sb."itemCode";

-- ============================================================================
-- wms_warehouse — mirror of NestJS `core_warehouses` (7)
-- ============================================================================
INSERT INTO wms_warehouse (id, code, name, address, tenant_id)
SELECT
  md5('demo-wms-wh-' || cw."warehouseCode")::uuid,
  cw."warehouseCode",
  cw."warehouseName",
  concat_ws(', ', cw."addressLine1", cw.city, cw.country),
  :tenant
FROM core_warehouses cw
WHERE cw."warehouseCode" IN
  ('WH-MAIN','WH-RM','WH-FG','WH-WIP','WH-QC','WH-REJ','WH-SPARE');

-- ============================================================================
-- wms_bin — 20 bins across WH-MAIN (8), WH-FG (6), WH-RM (6)
-- Zone naming follows the NestJS stock_locations convention ("Zone F" etc.)
-- ============================================================================
INSERT INTO wms_bin
  (id, code, aisle, rack, level, position, zone, capacity, status, tenant_id, warehouse_id)
VALUES
  -- Main Warehouse (Building A) — Zone M
  (md5('demo-wms-bin-WH-MAIN-A01-R01-L1-P1')::uuid,'A01-R01-L1-P1','A01','R01','L1','P1','ZONE-M',500.0,'active',:tenant,md5('demo-wms-wh-WH-MAIN')::uuid),
  (md5('demo-wms-bin-WH-MAIN-A01-R01-L2-P1')::uuid,'A01-R01-L2-P1','A01','R01','L2','P1','ZONE-M',500.0,'active',:tenant,md5('demo-wms-wh-WH-MAIN')::uuid),
  (md5('demo-wms-bin-WH-MAIN-A01-R02-L1-P1')::uuid,'A01-R02-L1-P1','A01','R02','L1','P1','ZONE-M',500.0,'active',:tenant,md5('demo-wms-wh-WH-MAIN')::uuid),
  (md5('demo-wms-bin-WH-MAIN-A01-R02-L2-P1')::uuid,'A01-R02-L2-P1','A01','R02','L2','P1','ZONE-M',500.0,'active',:tenant,md5('demo-wms-wh-WH-MAIN')::uuid),
  (md5('demo-wms-bin-WH-MAIN-A02-R01-L1-P1')::uuid,'A02-R01-L1-P1','A02','R01','L1','P1','ZONE-M',750.0,'active',:tenant,md5('demo-wms-wh-WH-MAIN')::uuid),
  (md5('demo-wms-bin-WH-MAIN-A02-R01-L2-P1')::uuid,'A02-R01-L2-P1','A02','R01','L2','P1','ZONE-M',750.0,'active',:tenant,md5('demo-wms-wh-WH-MAIN')::uuid),
  (md5('demo-wms-bin-WH-MAIN-A02-R02-L1-P1')::uuid,'A02-R02-L1-P1','A02','R02','L1','P1','ZONE-M',750.0,'full',:tenant,md5('demo-wms-wh-WH-MAIN')::uuid),
  (md5('demo-wms-bin-WH-MAIN-A02-R02-L2-P1')::uuid,'A02-R02-L2-P1','A02','R02','L2','P1','ZONE-M',750.0,'active',:tenant,md5('demo-wms-wh-WH-MAIN')::uuid),
  -- Finished Goods Store (Building C) — Zone F (matches stock_locations WH-FG-F1-xx-xx)
  (md5('demo-wms-bin-WH-FG-F01-R01-L1-P1')::uuid,'F01-R01-L1-P1','F01','R01','L1','P1','ZONE-F',200.0,'active',:tenant,md5('demo-wms-wh-WH-FG')::uuid),
  (md5('demo-wms-bin-WH-FG-F01-R01-L1-P2')::uuid,'F01-R01-L1-P2','F01','R01','L1','P2','ZONE-F',200.0,'active',:tenant,md5('demo-wms-wh-WH-FG')::uuid),
  (md5('demo-wms-bin-WH-FG-F01-R02-L1-P1')::uuid,'F01-R02-L1-P1','F01','R02','L1','P1','ZONE-F',200.0,'active',:tenant,md5('demo-wms-wh-WH-FG')::uuid),
  (md5('demo-wms-bin-WH-FG-F02-R01-L1-P1')::uuid,'F02-R01-L1-P1','F02','R01','L1','P1','ZONE-F',200.0,'active',:tenant,md5('demo-wms-wh-WH-FG')::uuid),
  (md5('demo-wms-bin-WH-FG-F02-R02-L1-P1')::uuid,'F02-R02-L1-P1','F02','R02','L1','P1','ZONE-F',200.0,'blocked',:tenant,md5('demo-wms-wh-WH-FG')::uuid),
  (md5('demo-wms-bin-WH-FG-DISPATCH')::uuid,'FG-DISPATCH','F00','R00','L0','P0','ZONE-DISPATCH',1000.0,'active',:tenant,md5('demo-wms-wh-WH-FG')::uuid),
  -- Raw Material Store (Building B) — Zone R
  (md5('demo-wms-bin-WH-RM-B01-R01-L1-P1')::uuid,'B01-R01-L1-P1','B01','R01','L1','P1','ZONE-R',400.0,'active',:tenant,md5('demo-wms-wh-WH-RM')::uuid),
  (md5('demo-wms-bin-WH-RM-B01-R01-L2-P1')::uuid,'B01-R01-L2-P1','B01','R01','L2','P1','ZONE-R',400.0,'active',:tenant,md5('demo-wms-wh-WH-RM')::uuid),
  (md5('demo-wms-bin-WH-RM-B01-R02-L1-P1')::uuid,'B01-R02-L1-P1','B01','R02','L1','P1','ZONE-R',400.0,'active',:tenant,md5('demo-wms-wh-WH-RM')::uuid),
  (md5('demo-wms-bin-WH-RM-B02-R01-L1-P1')::uuid,'B02-R01-L1-P1','B02','R01','L1','P1','ZONE-R',600.0,'active',:tenant,md5('demo-wms-wh-WH-RM')::uuid),
  (md5('demo-wms-bin-WH-RM-B02-R01-L2-P1')::uuid,'B02-R01-L2-P1','B02','R01','L2','P1','ZONE-R',600.0,'active',:tenant,md5('demo-wms-wh-WH-RM')::uuid),
  (md5('demo-wms-bin-WH-RM-B02-R02-L1-P1')::uuid,'B02-R02-L1-P1','B02','R02','L1','P1','ZONE-R',600.0,'full',:tenant,md5('demo-wms-wh-WH-RM')::uuid);

-- ============================================================================
-- wms_rftask — 8 RF tasks (3 putaway, 3 pick, 1 move, 1 count)
-- assigned_to_user_id is a bare UUID column (no FK); deterministic operator ids
-- ============================================================================
INSERT INTO wms_rftask
  (id, task_type, item_code, qty, status, assigned_to_user_id, completed_at,
   created_at, source_bin_id, target_bin_id, tenant_id)
VALUES
  (md5('demo-rftask-0001')::uuid,'putaway','RM-STL-001',50.0,'completed',md5('demo-rf-operator-1')::uuid,'2025-11-04 11:20:00+00','2025-11-04 09:00:00+00',NULL,md5('demo-wms-bin-WH-RM-B01-R01-L1-P1')::uuid,:tenant),
  (md5('demo-rftask-0002')::uuid,'putaway','RM-ALM-001',200.0,'completed',md5('demo-rf-operator-1')::uuid,'2025-12-15 15:40:00+00','2025-12-15 14:00:00+00',NULL,md5('demo-wms-bin-WH-RM-B01-R02-L1-P1')::uuid,:tenant),
  (md5('demo-rftask-0003')::uuid,'pick','FG-MTR-001',10.0,'completed',md5('demo-rf-operator-2')::uuid,'2026-02-18 10:05:00+00','2026-02-18 08:30:00+00',md5('demo-wms-bin-WH-FG-F01-R01-L1-P1')::uuid,md5('demo-wms-bin-WH-FG-DISPATCH')::uuid,:tenant),
  (md5('demo-rftask-0004')::uuid,'pick','FG-GBX-001',8.0,'in_progress',md5('demo-rf-operator-2')::uuid,NULL,'2026-08-08 09:15:00+00',md5('demo-wms-bin-WH-FG-F01-R02-L1-P1')::uuid,md5('demo-wms-bin-WH-FG-DISPATCH')::uuid,:tenant),
  (md5('demo-rftask-0005')::uuid,'move','SP-BLT-001',20.0,'in_progress',md5('demo-rf-operator-3')::uuid,NULL,'2026-08-25 13:45:00+00',md5('demo-wms-bin-WH-MAIN-A02-R02-L1-P1')::uuid,md5('demo-wms-bin-WH-MAIN-A01-R02-L2-P1')::uuid,:tenant),
  (md5('demo-rftask-0006')::uuid,'putaway','TOOL-INS-001',4.0,'pending',NULL,NULL,'2026-09-05 10:00:00+00',NULL,md5('demo-wms-bin-WH-MAIN-A01-R01-L1-P1')::uuid,:tenant),
  (md5('demo-rftask-0007')::uuid,'pick','FG-PMP-001',12.0,'pending',NULL,NULL,'2026-09-09 08:20:00+00',md5('demo-wms-bin-WH-FG-F02-R01-L1-P1')::uuid,md5('demo-wms-bin-WH-FG-DISPATCH')::uuid,:tenant),
  (md5('demo-rftask-0008')::uuid,'count','RM-COP-001',0.0,'pending',NULL,NULL,'2026-09-10 07:30:00+00',md5('demo-wms-bin-WH-RM-B02-R01-L1-P1')::uuid,NULL,:tenant);

-- ============================================================================
-- logistics_carrier — mirror of NestJS `logistics_transport_companies` (7)
-- ============================================================================
INSERT INTO logistics_carrier (id, code, name, connector_id, tenant_id)
SELECT
  md5('demo-carrier-' || tc."companyCode")::uuid,
  tc."companyCode",
  tc."companyName",
  'connector.' || lower(replace(tc."companyCode", 'TC-', '')),
  :tenant
FROM logistics_transport_companies tc
WHERE tc."companyCode" LIKE 'TC-%';

-- ============================================================================
-- logistics_shipment — mirror of NestJS SHP-DEMO-0001..0006
-- status map: Delivered -> delivered, In Transit/Dispatched -> in_transit
-- ============================================================================
INSERT INTO logistics_shipment
  (id, number, direction, reference_type, reference_id, carrier_code,
   tracking_number, status, shipped_at, delivered_at, tenant_id)
VALUES
  (md5('demo-shp-SHP-DEMO-0001')::uuid,'SHP-DEMO-0001','outbound','sales_order','a4a80fde-1c8d-405c-9607-dccceaa54b76','TC-OWN','TRK-B3-2025-1001','delivered','2025-10-14 16:00:00+00','2025-11-20 14:30:00+00',:tenant),
  (md5('demo-shp-SHP-DEMO-0002')::uuid,'SHP-DEMO-0002','outbound','sales_order','9e18b0bf-6896-47ea-bbcf-c92166ce2f77','TC-OWN','TRK-B3-2025-1002','delivered','2025-12-09 08:30:00+00','2026-01-25 11:15:00+00',:tenant),
  (md5('demo-shp-SHP-DEMO-0003')::uuid,'SHP-DEMO-0003','outbound','sales_order','5a47da5e-bfae-46c8-aa25-78676b0ccb81','TC-DHL','TRK-B3-2026-1003','delivered','2026-01-16 11:00:00+00','2026-01-24 16:45:00+00',:tenant),
  (md5('demo-shp-SHP-DEMO-0004')::uuid,'SHP-DEMO-0004','outbound','sales_order','f598832b-cf0d-4d68-9bf1-f78ccda5f448','TC-OWN','TRK-B3-2026-1004','delivered','2026-02-20 16:50:00+00','2026-04-02 10:20:00+00',:tenant),
  (md5('demo-shp-SHP-DEMO-0005')::uuid,'SHP-DEMO-0005','outbound','sales_order','37362232-e93c-435e-a9ea-c4d9842b6792','TC-OWN','TRK-B3-2026-1005','in_transit','2026-08-10 16:00:00+00',NULL,:tenant),
  (md5('demo-shp-SHP-DEMO-0006')::uuid,'SHP-DEMO-0006','outbound','sales_order','85bcdb1f-640d-4241-bc3e-5cefcd0fd966','TC-OWN','TRK-B3-2026-1006','in_transit','2026-09-08 16:00:00+00',NULL,:tenant);

-- logistics_shipmentline — mirror of logistics_shipment_items for those 6 (11 lines)
INSERT INTO logistics_shipmentline (id, item_code, quantity, shipment_id, tenant_id)
VALUES
  (md5('demo-shpline-0001-FG-MTR-001')::uuid,'FG-MTR-001',10.0,md5('demo-shp-SHP-DEMO-0001')::uuid,:tenant),
  (md5('demo-shpline-0001-SP-BRG-001')::uuid,'SP-BRG-001',40.0,md5('demo-shp-SHP-DEMO-0001')::uuid,:tenant),
  (md5('demo-shpline-0002-FG-PMP-001')::uuid,'FG-PMP-001',14.0,md5('demo-shp-SHP-DEMO-0002')::uuid,:tenant),
  (md5('demo-shpline-0002-SP-SL-001')::uuid,'SP-SL-001',56.0,md5('demo-shp-SHP-DEMO-0002')::uuid,:tenant),
  (md5('demo-shpline-0003-FG-GBX-001')::uuid,'FG-GBX-001',5.0,md5('demo-shp-SHP-DEMO-0003')::uuid,:tenant),
  (md5('demo-shpline-0003-SP-BLT-001')::uuid,'SP-BLT-001',20.0,md5('demo-shp-SHP-DEMO-0003')::uuid,:tenant),
  (md5('demo-shpline-0004-FG-MTR-001')::uuid,'FG-MTR-001',16.0,md5('demo-shp-SHP-DEMO-0004')::uuid,:tenant),
  (md5('demo-shpline-0004-SP-BRG-001')::uuid,'SP-BRG-001',30.0,md5('demo-shp-SHP-DEMO-0004')::uuid,:tenant),
  (md5('demo-shpline-0005-FG-GBX-001')::uuid,'FG-GBX-001',8.0,md5('demo-shp-SHP-DEMO-0005')::uuid,:tenant),
  (md5('demo-shpline-0005-FG-PMP-001')::uuid,'FG-PMP-001',18.0,md5('demo-shp-SHP-DEMO-0005')::uuid,:tenant),
  (md5('demo-shpline-0006-FG-MTR-001')::uuid,'FG-MTR-001',10.0,md5('demo-shp-SHP-DEMO-0006')::uuid,:tenant);

-- ============================================================================
-- warehouses (orphan camelCase mirror of core_warehouses; enum cast via text)
-- ============================================================================
INSERT INTO warehouses
  (id, "warehouseCode", "warehouseName", "warehouseType", status,
   "addressLine1", "addressLine2", city, state, "postalCode", country,
   "contactPerson", phone, email, "totalArea", "areaUnit", "storageCapacity",
   "capacityUnit", "currentUtilization", "companyId", "branchId",
   "parentWarehouseId", "managerId", "managerName", "allowNegativeStock",
   "requiresBatchTracking", "requiresSerialTracking", "autoReplenishment",
   "temperatureMin", "temperatureMax", "humidityMin", "humidityMax",
   description, remarks, "workingHours", facilities, certifications,
   "createdBy", "updatedBy", "createdAt", "updatedAt")
SELECT
  md5('demo-warehouses-' || cw."warehouseCode")::uuid,
  cw."warehouseCode", cw."warehouseName",
  cw."warehouseType"::text::warehouses_warehousetype_enum,
  cw.status::text::warehouses_status_enum,
  cw."addressLine1", cw."addressLine2", cw.city, cw.state, cw."postalCode",
  cw.country, cw."contactPerson", cw.phone, cw.email, cw."totalArea",
  cw."areaUnit", cw."storageCapacity", cw."capacityUnit",
  cw."currentUtilization", cw."companyId", cw."branchId",
  cw."parentWarehouseId", cw."managerId", cw."managerName",
  cw."allowNegativeStock", cw."requiresBatchTracking",
  cw."requiresSerialTracking", cw."autoReplenishment", cw."temperatureMin",
  cw."temperatureMax", cw."humidityMin", cw."humidityMax", cw.description,
  cw.remarks, cw."workingHours", cw.facilities, cw.certifications,
  'demo-seed', 'demo-seed',
  timestamp '2025-10-01 09:00:00', timestamp '2025-10-01 09:00:00'
FROM core_warehouses cw
WHERE cw."warehouseCode" IN
  ('WH-MAIN','WH-RM','WH-FG','WH-WIP','WH-QC','WH-REJ','WH-SPARE');

-- ============================================================================
-- logistics_cross_dock_operations — 4 (kitchen-equipment export flavor)
-- ============================================================================
INSERT INTO logistics_cross_dock_operations
  (id, "operationNo", "inboundShipment", "outboundShipment", carrier, "dockDoor",
   status, priority, "itemCount", "dwellTime", "scheduledTime", "assignedTo",
   notes, "createdAt", "updatedAt")
VALUES
  (md5('demo-xdock-0001')::uuid,'XD-DEMO-0001','GRN-2026-0412','SHP-DEMO-0005','Own Fleet','DD-DEMO-03','completed','high',24,95,'2026-08-09 07:00','Anil Kumar','SS cooking-range crates cross-docked for Blue Fig Hotels, New York consolidation.','2026-08-09 06:30:00','2026-08-09 10:45:00'),
  (md5('demo-xdock-0002')::uuid,'XD-DEMO-0002','GRN-2026-0438','SHP-DEMO-0006','Own Fleet','DD-DEMO-04','loading','high',10,60,'2026-09-08 08:00','Ravi Menon','Industrial motor pallets staged straight to outbound for Golden Spoon, Phoenix.','2026-09-08 07:40:00','2026-09-08 09:10:00'),
  (md5('demo-xdock-0003')::uuid,'XD-DEMO-0003','GRN-2026-0441','SHP-EXP-DXB-0012','DHL Express','DD-DEMO-02','staging','medium',16,40,'2026-09-09 10:30','Anil Kumar','Export crates (exhaust hoods) for Jebel Ali, Dubai — awaiting customs paperwork.','2026-09-09 10:00:00','2026-09-09 11:20:00'),
  (md5('demo-xdock-0004')::uuid,'XD-DEMO-0004','GRN-2026-0445','SHP-DEMO-0007','Safexpress','DD-DEMO-01','receiving','low',8,15,'2026-09-10 09:00','Deepa Nair','Refrigeration units inbound for Metro Hospital Kitchens, Chicago order.','2026-09-10 08:50:00','2026-09-10 09:05:00');

-- ============================================================================
-- logistics_dock_doors — 6
-- ============================================================================
INSERT INTO logistics_dock_doors
  (id, "doorNo", "doorName", type, status, "currentVehicle", carrier, "waitTime",
   "assignedTo", location, notes, "createdAt", "updatedAt")
VALUES
  (md5('demo-dockdoor-01')::uuid,'DD-DEMO-01','Inbound Door 1','inbound','occupied','KA-51-KE-4471','Safexpress',15,'Deepa Nair','North Dock, Building A','Receiving refrigeration units (XD-DEMO-0004).','2025-10-02 09:00:00','2026-09-10 09:05:00'),
  (md5('demo-dockdoor-02')::uuid,'DD-DEMO-02','Inbound Door 2','inbound','occupied','MH-04-CT-8890','DHL Express',40,'Anil Kumar','North Dock, Building A','Export staging for Dubai crates (XD-DEMO-0003).','2025-10-02 09:00:00','2026-09-09 11:20:00'),
  (md5('demo-dockdoor-03')::uuid,'DD-DEMO-03','Outbound Door 1','outbound','available',NULL,NULL,0,NULL,'South Dock, Building C','Primary FG dispatch door.','2025-10-02 09:00:00','2026-08-09 11:00:00'),
  (md5('demo-dockdoor-04')::uuid,'DD-DEMO-04','Outbound Door 2','outbound','occupied','KA-51-KE-4472','Own Fleet',10,'Ravi Menon','South Dock, Building C','Loading SHP-DEMO-0006 (Phoenix).','2025-10-02 09:00:00','2026-09-08 09:10:00'),
  (md5('demo-dockdoor-05')::uuid,'DD-DEMO-05','Cross-dock Door','both','available',NULL,NULL,0,NULL,'East Dock, Building A','Reserved for cross-dock operations.','2025-10-02 09:00:00','2026-09-01 08:00:00'),
  (md5('demo-dockdoor-06')::uuid,'DD-DEMO-06','Outbound Door 3','outbound','maintenance',NULL,NULL,0,NULL,'South Dock, Building C','Dock leveler under repair since 05-Sep.','2025-10-02 09:00:00','2026-09-05 14:00:00');

-- ============================================================================
-- logistics_yard_vehicles — 5 (plates listed in the DELETE predicate above)
-- ============================================================================
INSERT INTO logistics_yard_vehicles
  (id, "vehicleNo", "carrierName", "driverName", "driverPhone", "checkInTime",
   "parkingSpot", "vehicleType", status, "appointmentNo", "dockAssigned",
   "estimatedDeparture", "waitTime", "trailerNo", "sealNo", notes,
   "createdAt", "updatedAt")
VALUES
  (md5('demo-yardveh-01')::uuid,'KA-51-KE-4471','Safexpress','Suresh Babu','+91-98450-11223','2026-09-10 08:35','P-01','truck','at-dock','APT-DEMO-2031','DD-DEMO-01','2026-09-10 12:00',15,'TRL-2210','SL-88121','Inbound refrigeration units.','2026-09-10 08:35:00','2026-09-10 09:05:00'),
  (md5('demo-yardveh-02')::uuid,'KA-51-KE-4472','Own Fleet','Manoj Pillai','+91-98470-44556','2026-09-08 07:20','P-02','truck','at-dock','APT-DEMO-2032','DD-DEMO-04','2026-09-08 13:00',10,NULL,'SL-88134','Loading Phoenix shipment SHP-DEMO-0006.','2026-09-08 07:20:00','2026-09-08 09:10:00'),
  (md5('demo-yardveh-03')::uuid,'MH-04-CT-8890','DHL Express','Imran Shaikh','+91-99201-77889','2026-09-09 09:50','P-05','container','at-dock','APT-DEMO-2033','DD-DEMO-02','2026-09-09 16:30',40,'CNT-40FT-771','SL-88140','Export container for Jebel Ali, Dubai crates.','2026-09-09 09:50:00','2026-09-09 11:20:00'),
  (md5('demo-yardveh-04')::uuid,'TN-22-DX-1105','Gati Logistics','Karthik Raja','+91-98844-22110','2026-09-10 09:40','P-03','truck','checked-in','APT-DEMO-2034',NULL,'2026-09-10 15:00',25,NULL,NULL,'Waiting for dock assignment (spare-parts pickup).','2026-09-10 09:40:00','2026-09-10 09:40:00'),
  (md5('demo-yardveh-05')::uuid,'KA-05-RF-6634','Own Fleet','Joseph Thomas','+91-98460-99887','2026-09-06 06:15','P-04','trailer','departed','APT-DEMO-2035','DD-DEMO-03','2026-09-06 11:00',0,'TRL-2214','SL-88096','Departed with Miami consolidation load.','2026-09-06 06:15:00','2026-09-06 11:05:00');

-- ============================================================================
-- packaging_jobs — 6 (kitchen-equipment export packing)
-- ============================================================================
INSERT INTO packaging_jobs
  (id, "projectId", "woNumber", "productName", quantity, status, "packingTeam",
   "startDate", "completionDate", "materialsUsed", "createdAt", "updatedAt")
VALUES
  (md5('demo-pkgjob-0001')::uuid,'PRJ-DEMO-DXB','WO-DEMO-0001','SS Cooking Range 6-Burner (Export Crate)',12,'Completed','Team A - Export','2025-11-03','2025-11-07','{"wooden_crate": 12, "bubble_wrap_m": 90, "silica_gel_pkts": 48}','2025-11-01 09:00:00','2025-11-07 17:30:00'),
  (md5('demo-pkgjob-0002')::uuid,'PRJ-DEMO-DXB','WO-DEMO-0002','Exhaust Hood 2400mm (Export Crate)',8,'Completed','Team A - Export','2026-01-12','2026-01-15','{"wooden_crate": 8, "epe_foam_sheets": 32, "corner_protectors": 64}','2026-01-10 09:00:00','2026-01-15 16:00:00'),
  (md5('demo-pkgjob-0003')::uuid,'PRJ-DEMO-US','WO-DEMO-0003','Precision Gearbox PG-50 (Sea-freight Pallet)',8,'Completed','Team B','2026-08-04','2026-08-06','{"pallet": 4, "stretch_film_rolls": 6, "strapping_m": 120}','2026-08-03 08:30:00','2026-08-06 15:45:00'),
  (md5('demo-pkgjob-0004')::uuid,'PRJ-DEMO-US','WO-DEMO-0004','Industrial Motor 5HP (Carton + Pallet)',10,'In Progress','Team B','2026-09-07',NULL,'{"cartons": 10, "pallet": 2, "vci_paper_m": 30}','2026-09-06 10:00:00','2026-09-09 12:00:00'),
  (md5('demo-pkgjob-0005')::uuid,'PRJ-DEMO-DXB','WO-DEMO-0005','Refrigerated Counter RC-1800 (Export Crate)',6,'In Progress','Team A - Export','2026-09-09',NULL,'{"wooden_crate": 6, "silica_gel_pkts": 36}','2026-09-08 09:00:00','2026-09-10 11:00:00'),
  (md5('demo-pkgjob-0006')::uuid,'PRJ-DEMO-US','WO-DEMO-0006','Centrifugal Pump CP-200 (Carton)',12,'In Queue','Team C',NULL,NULL,'{}','2026-09-10 08:00:00','2026-09-10 08:00:00');

-- ============================================================================
-- packaging_materials — 8 (shared demo pool, projectId PRJ-DEMO-PKG)
-- ============================================================================
INSERT INTO packaging_materials
  (id, "projectId", name, category, "currentStock", required, unit, status,
   "createdAt", "updatedAt")
VALUES
  (md5('demo-pkgmat-0001')::uuid,'PRJ-DEMO-PKG','Wooden Export Crate 1200x800','Container',34,26,'pcs','Available','2025-10-05 09:00:00','2026-09-10 09:00:00'),
  (md5('demo-pkgmat-0002')::uuid,'PRJ-DEMO-PKG','Heat-treated Pallet ISPM-15','Container',48,20,'pcs','Available','2025-10-05 09:00:00','2026-09-10 09:00:00'),
  (md5('demo-pkgmat-0003')::uuid,'PRJ-DEMO-PKG','Bubble Wrap Roll 1m x 100m','Protection',12,15,'rolls','Low Stock','2025-10-05 09:00:00','2026-09-10 09:00:00'),
  (md5('demo-pkgmat-0004')::uuid,'PRJ-DEMO-PKG','EPE Foam Sheet 10mm','Protection',220,180,'sheets','Available','2025-10-05 09:00:00','2026-09-10 09:00:00'),
  (md5('demo-pkgmat-0005')::uuid,'PRJ-DEMO-PKG','Corner Protector L-profile','Protection',380,256,'pcs','Available','2025-10-05 09:00:00','2026-09-10 09:00:00'),
  (md5('demo-pkgmat-0006')::uuid,'PRJ-DEMO-PKG','Silica Gel Desiccant 500g','Protection',60,120,'pkts','Low Stock','2025-10-05 09:00:00','2026-09-10 09:00:00'),
  (md5('demo-pkgmat-0007')::uuid,'PRJ-DEMO-PKG','PET Strapping Roll 19mm','Fastening',18,10,'rolls','Available','2025-10-05 09:00:00','2026-09-10 09:00:00'),
  (md5('demo-pkgmat-0008')::uuid,'PRJ-DEMO-PKG','VCI Anti-rust Paper Roll','Protection',9,12,'rolls','Low Stock','2025-10-05 09:00:00','2026-09-10 09:00:00');

-- ============================================================================
-- packaging_shipping_bills — 4 (export to Dubai + US customer sites)
-- ============================================================================
INSERT INTO packaging_shipping_bills
  (id, "projectId", "billNumber", "orderNumber", "customerName", destination,
   items, "totalPackages", "totalWeight", status, "createdAt", "updatedAt")
VALUES
  (md5('demo-pkgbill-0001')::uuid,'PRJ-DEMO-DXB','SB-DEMO-0001','SO-DEMO-0002','Golden Spoon Franchises','Jebel Ali Port, Dubai, UAE','[{"item": "SS Cooking Range 6-Burner", "crates": 12}, {"item": "Exhaust Hood 2400mm", "crates": 8}]',20,'6400 kg','Cleared','2026-01-18 10:00:00','2026-01-25 12:00:00'),
  (md5('demo-pkgbill-0002')::uuid,'PRJ-DEMO-US','SB-DEMO-0002','SO-DEMO-0004','Lakeside Resort & Spa','Port of Miami, FL, USA','[{"item": "Industrial Motor 5HP", "pallets": 4}, {"item": "Ball Bearing 6205", "cartons": 3}]',7,'2150 kg','Cleared','2026-02-22 09:30:00','2026-04-02 11:00:00'),
  (md5('demo-pkgbill-0003')::uuid,'PRJ-DEMO-US','SB-DEMO-0003','SO-DEMO-0005','Blue Fig Hotels Group','Port of New York/New Jersey, USA','[{"item": "Precision Gearbox PG-50", "pallets": 4}, {"item": "Centrifugal Pump CP-200", "pallets": 5}]',9,'3800 kg','Submitted','2026-08-08 14:00:00','2026-08-10 16:30:00'),
  (md5('demo-pkgbill-0004')::uuid,'PRJ-DEMO-DXB','SB-DEMO-0004',NULL,'Al Noor Kitchens LLC','Jebel Ali Port, Dubai, UAE','[{"item": "Refrigerated Counter RC-1800", "crates": 6}]',6,'2700 kg','Draft','2026-09-09 11:00:00','2026-09-10 09:30:00');

-- ============================================================================
-- packaging_staging — 5 (staged for dispatch)
-- ============================================================================
INSERT INTO packaging_staging
  (id, "projectId", "woNumber", "productName", quantity, "packingComplete",
   "shippingBillNumber", status, "stagedDate", "customerName",
   "deliveryAddress", "transportMethod", "createdAt", "updatedAt")
VALUES
  (md5('demo-pkgstg-0001')::uuid,'PRJ-DEMO-DXB','WO-DEMO-0001','SS Cooking Range 6-Burner (Export Crate)',12,true,'SB-DEMO-0001','Dispatched','2026-01-20','Golden Spoon Franchises','Jebel Ali Free Zone, Dubai, UAE','Sea Freight','2026-01-19 09:00:00','2026-01-25 12:00:00'),
  (md5('demo-pkgstg-0002')::uuid,'PRJ-DEMO-DXB','WO-DEMO-0002','Exhaust Hood 2400mm (Export Crate)',8,true,'SB-DEMO-0001','Dispatched','2026-01-20','Golden Spoon Franchises','Jebel Ali Free Zone, Dubai, UAE','Sea Freight','2026-01-19 10:30:00','2026-01-25 12:00:00'),
  (md5('demo-pkgstg-0003')::uuid,'PRJ-DEMO-US','WO-DEMO-0003','Precision Gearbox PG-50 (Sea-freight Pallet)',8,true,'SB-DEMO-0003','Loaded','2026-08-09','Blue Fig Hotels Group','425 Park Avenue, New York, NY, USA','Sea Freight','2026-08-07 08:00:00','2026-08-10 16:00:00'),
  (md5('demo-pkgstg-0004')::uuid,'PRJ-DEMO-US','WO-DEMO-0004','Industrial Motor 5HP (Carton + Pallet)',10,false,NULL,'Staging','2026-09-09','Golden Spoon Franchises','2200 E Camelback Rd, Phoenix, AZ, USA','Own Vehicle','2026-09-09 09:00:00','2026-09-10 08:30:00'),
  (md5('demo-pkgstg-0005')::uuid,'PRJ-DEMO-DXB','WO-DEMO-0005','Refrigerated Counter RC-1800 (Export Crate)',6,false,'SB-DEMO-0004','Staging','2026-09-10','Al Noor Kitchens LLC','Al Quoz Industrial Area 3, Dubai, UAE','Sea Freight','2026-09-10 09:00:00','2026-09-10 11:00:00');
