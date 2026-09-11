-- Demo seed — CPQ part A (products, bundles, quotes, configuration, pricing) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first (children before parents), then re-inserts.
-- Stable literal UUIDs so CPQ part B can reference by id:
--   products dc9a0000-0000-4000-8000-0000000000NN (01..12)
--   bundles  dc9b0000-0000-4000-8000-0000000000NN (01..04)
--   quotes   dc9c0000-0000-4000-8000-0000000000NN (01..10)
--   configs  dc9d0000-0000-4000-8000-0000000000NN (01..08)
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------- deletes ---
DELETE FROM cpq_quote_items WHERE "quoteId" IN (SELECT id FROM cpq_quotes WHERE "companyId" = :company);
DELETE FROM cpq_quote_versions WHERE "companyId" = :company;
DELETE FROM cpq_quote_versions_list WHERE "companyId" = :company;
DELETE FROM cpq_quote_analytics WHERE "companyId" = :company;
DELETE FROM cpq_quotes WHERE "companyId" = :company;
DELETE FROM cpq_quote_templates WHERE "companyId" = :company;
DELETE FROM cpq_bundle_items WHERE "bundleId" IN (SELECT id FROM cpq_product_bundles WHERE "companyId" = :company);
DELETE FROM cpq_product_bundles WHERE "companyId" = :company;
DELETE FROM cpq_configurations WHERE "companyId" = :company;
DELETE FROM cpq_config_rules WHERE "companyId" = :company;
DELETE FROM cpq_config_steps WHERE "companyId" = :company;
DELETE FROM cpq_configuration_rules WHERE "companyId" = :company;
DELETE FROM cpq_compatibility_matrix WHERE "companyId" = :company;
DELETE FROM cpq_compatibility_entries WHERE "companyId" = :company;
DELETE FROM cpq_product_options WHERE "companyId" = :company;
DELETE FROM cpq_products WHERE "companyId" = :company;
DELETE FROM cpq_code_lists WHERE "companyId" = :company;
DELETE FROM cpq_pricing_rules WHERE "companyId" = :company;
DELETE FROM cpq_pricing_versions WHERE "companyId" = :company;
DELETE FROM cpq_pricing_analytics WHERE "companyId" = :company;
DELETE FROM cpq_dynamic_pricing WHERE "companyId" = :company;
DELETE FROM cpq_customer_pricing WHERE "companyId" = :company;
DELETE FROM cpq_contract_pricing WHERE "companyId" = :company;
DELETE FROM cpq_volume_discounts WHERE "companyId" = :company;
DELETE FROM cpq_promotional_pricing WHERE "companyId" = :company;
DELETE FROM cpq_margin_guardrails WHERE "companyId" = :company;
DELETE FROM cpq_discount_analytics WHERE "companyId" = :company;
DELETE FROM cpq_cross_sell_rules WHERE "companyId" = :company;
DELETE FROM cpq_guided_selling_questions WHERE "companyId" = :company;

-- --------------------------------------------------------------- products ---
INSERT INTO cpq_products
  (id, "companyId", sku, name, description, category, "subCategory", "basePrice", currency, unit,
   "isConfigurable", "isActive", "leadTimeDays", weight, "createdBy", "createdAt", "updatedAt")
VALUES
  ('dc9a0000-0000-4000-8000-000000000001', :company, 'DEMO-CMB-E06', 'ProChef Combi Oven 6-Tray Electric', 'Compact 6-tray electric combi oven with touch controls and 250 stored programs.', 'Combi Ovens', 'Electric', 12500, 'USD', 'unit', true, true, 21, 118, 'Sarah Mitchell', '2025-10-02 09:00:00', '2025-10-02 09:00:00'),
  ('dc9a0000-0000-4000-8000-000000000002', :company, 'DEMO-CMB-G06', 'ProChef Combi Oven 6-Tray Gas', 'Compact 6-tray gas combi oven for sites without 3-phase supply.', 'Combi Ovens', 'Gas', 13200, 'USD', 'unit', true, true, 28, 126, 'Sarah Mitchell', '2025-10-02 09:05:00', '2025-10-02 09:05:00'),
  ('dc9a0000-0000-4000-8000-000000000003', :company, 'DEMO-CMB-E10', 'ProChef Combi Oven 10-Tray Electric', 'Mid-size 10-tray electric combi oven, the volume seller for hotel banqueting.', 'Combi Ovens', 'Electric', 18900, 'USD', 'unit', true, true, 21, 158, 'Sarah Mitchell', '2025-10-02 09:10:00', '2025-10-02 09:10:00'),
  ('dc9a0000-0000-4000-8000-000000000004', :company, 'DEMO-CMB-G10', 'ProChef Combi Oven 10-Tray Gas', 'Mid-size 10-tray gas combi oven with lambda-sensor humidity control.', 'Combi Ovens', 'Gas', 19800, 'USD', 'unit', true, true, 28, 171, 'Sarah Mitchell', '2025-10-02 09:15:00', '2025-10-02 09:15:00'),
  ('dc9a0000-0000-4000-8000-000000000005', :company, 'DEMO-CMB-E20', 'ProChef Combi Oven 20-Tray Electric', 'High-volume 20-tray electric combi oven for banquet and institutional kitchens.', 'Combi Ovens', 'Electric', 32500, 'USD', 'unit', true, true, 35, 262, 'Sarah Mitchell', '2025-10-02 09:20:00', '2025-10-02 09:20:00'),
  ('dc9a0000-0000-4000-8000-000000000006', :company, 'DEMO-CMB-G20', 'ProChef Combi Oven 20-Tray Gas', 'High-volume 20-tray gas combi oven with roll-in trolley system.', 'Combi Ovens', 'Gas', 34200, 'USD', 'unit', true, true, 35, 281, 'Sarah Mitchell', '2025-10-02 09:25:00', '2025-10-02 09:25:00'),
  ('dc9a0000-0000-4000-8000-000000000007', :company, 'DEMO-BCF-050', 'ArcticLine Blast Chiller 50kg', '50 kg/cycle blast chiller, +90C to +3C in 90 minutes, HACCP data logging.', 'Refrigeration', 'Blast Chillers', 15400, 'USD', 'unit', true, true, 21, 145, 'David Williams', '2025-10-03 10:00:00', '2025-10-03 10:00:00'),
  ('dc9a0000-0000-4000-8000-000000000008', :company, 'DEMO-BCF-100', 'ArcticLine Blast Chiller/Freezer 100kg', '100 kg/cycle blast chiller-freezer with roll-in trolley compatibility.', 'Refrigeration', 'Blast Chillers', 24800, 'USD', 'unit', true, true, 28, 238, 'David Williams', '2025-10-03 10:05:00', '2025-10-03 10:05:00'),
  ('dc9a0000-0000-4000-8000-000000000009', :company, 'DEMO-MCS-2400', 'ModuLine Cooking Suite 2400mm', 'Bespoke 2400mm modular island cooking suite: ranges, fryers, bratt pan, plancha.', 'Cooking Suites', 'Modular Island', 46500, 'USD', 'unit', true, true, 56, 640, 'Sarah Mitchell', '2025-10-03 10:10:00', '2025-10-03 10:10:00'),
  ('dc9a0000-0000-4000-8000-000000000010', :company, 'DEMO-DWL-RACK', 'HydroJet Rack Conveyor Dishwashing Line', 'Rack conveyor dishwashing line, 200 racks/hr, with sorting and exit tabling.', 'Warewashing', 'Rack Conveyor', 38900, 'USD', 'unit', true, true, 42, 520, 'David Williams', '2025-10-03 10:15:00', '2025-10-03 10:15:00'),
  ('dc9a0000-0000-4000-8000-000000000011', :company, 'DEMO-WIC-201', 'ColdStore Walk-In Cold Room 20m3', 'Modular 20 m3 walk-in cold room, 80mm panels, remote condensing unit.', 'Refrigeration', 'Walk-In', 21700, 'USD', 'unit', true, true, 35, 890, 'David Williams', '2025-10-03 10:20:00', '2025-10-03 10:20:00'),
  ('dc9a0000-0000-4000-8000-000000000012', :company, 'DEMO-RPC-3D', 'ChefBase Refrigerated Prep Counter 3-Door', '3-door refrigerated prep counter with granite top and GN pan wells.', 'Refrigeration', 'Counters', 6800, 'USD', 'unit', true, true, 14, 132, 'David Williams', '2025-10-03 10:25:00', '2025-10-03 10:25:00');

-- -------------------------------------------------------- product options ---
INSERT INTO cpq_product_options
  ("companyId", "productId", "optionGroupName", "optionName", description, "selectionType", "isRequired",
   "priceAdjustment", "priceAdjustmentType", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  (:company, 'dc9a0000-0000-4000-8000-000000000001', 'Voltage', '208V 3-Phase', 'US standard 3-phase supply.', 'single', true, 0, 'fixed', 1, true, '2025-10-04 09:00:00', '2025-10-04 09:00:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000001', 'Voltage', '480V 3-Phase', 'High-voltage supply with step-down kit.', 'single', true, 350, 'fixed', 2, true, '2025-10-04 09:01:00', '2025-10-04 09:01:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000003', 'Voltage', '208V 3-Phase', 'US standard 3-phase supply.', 'single', true, 0, 'fixed', 1, true, '2025-10-04 09:02:00', '2025-10-04 09:02:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000003', 'Accessories', 'Loading Trolley', 'GN 1/1 tray loading trolley.', 'multiple', false, 1200, 'fixed', 2, true, '2025-10-04 09:03:00', '2025-10-04 09:03:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000005', 'Steam System', 'Boiler Steam Generator', 'Dedicated boiler in place of injection steam.', 'single', false, 2800, 'fixed', 1, true, '2025-10-04 09:04:00', '2025-10-04 09:04:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000005', 'Cleaning', 'Automatic Wash System', 'Integrated auto-wash with tablet dosing.', 'single', false, 1950, 'fixed', 2, true, '2025-10-04 09:05:00', '2025-10-04 09:05:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000007', 'Capacity', '5-Tray Insert Rack', 'Extra GN 1/1 insert rack for mixed loads.', 'multiple', false, 480, 'fixed', 1, true, '2025-10-04 09:06:00', '2025-10-04 09:06:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000008', 'Finish', 'Marine-Grade SS316', 'SS316 shell for coastal / high-salinity sites.', 'single', false, 6, 'percentage', 1, true, '2025-10-04 09:07:00', '2025-10-04 09:07:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000009', 'Cooking Tops', 'Induction Tops Upgrade', 'Replace gas open burners with 5kW induction zones.', 'single', false, 5400, 'fixed', 1, true, '2025-10-04 09:08:00', '2025-10-04 09:08:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000010', 'Drying', 'Heat-Recovery Dryer Module', 'Exit dryer with heat-recovery condenser.', 'single', false, 7200, 'fixed', 1, true, '2025-10-04 09:09:00', '2025-10-04 09:09:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000011', 'Door', 'Glass Display Door', 'Heated glass display door section.', 'single', false, 1650, 'fixed', 1, true, '2025-10-04 09:10:00', '2025-10-04 09:10:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000012', 'Finish', 'SS304 Brushed', 'Standard brushed stainless finish.', 'single', true, 0, 'fixed', 1, true, '2025-10-04 09:11:00', '2025-10-04 09:11:00');

-- ---------------------------------------------------------------- bundles ---
INSERT INTO cpq_product_bundles
  (id, "companyId", "bundleCode", name, description, "bundleType", "basePrice", "discountPercentage",
   currency, "isActive", "validFrom", "validUntil", "createdBy", "createdAt", "updatedAt")
VALUES
  ('dc9b0000-0000-4000-8000-000000000001', :company, 'DEMO-BND-001', 'Complete Hotel Kitchen Package', '20-tray combi, modular suite and 100kg blast chiller for full-service hotel kitchens.', 'fixed', 103800, 10, 'USD', true, '2025-10-15 00:00:00', '2026-10-15 00:00:00', 'Sarah Mitchell', '2025-10-15 11:00:00', '2025-10-15 11:00:00'),
  ('dc9b0000-0000-4000-8000-000000000002', :company, 'DEMO-BND-002', 'QSR Starter Package', 'Compact combi, prep counter and 50kg blast chiller for quick-service outlets.', 'configurable', 34700, 8, 'USD', true, '2025-11-01 00:00:00', '2026-11-01 00:00:00', 'David Williams', '2025-11-01 11:00:00', '2025-11-01 11:00:00'),
  ('dc9b0000-0000-4000-8000-000000000003', :company, 'DEMO-BND-003', 'Hospital Cafeteria Package', '10-tray combi, rack conveyor warewashing and walk-in cold room for healthcare caterers.', 'fixed', 79500, 10, 'USD', true, '2025-12-01 00:00:00', '2026-12-01 00:00:00', 'Sarah Mitchell', '2025-12-01 11:00:00', '2025-12-01 11:00:00'),
  ('dc9b0000-0000-4000-8000-000000000004', :company, 'DEMO-BND-004', 'Catering Production Package', 'Gas 10-tray combi plus 50kg blast chiller for cook-chill catering production.', 'configurable', 35200, 5, 'USD', true, '2026-01-05 00:00:00', '2026-12-31 00:00:00', 'David Williams', '2026-01-05 11:00:00', '2026-01-05 11:00:00');

INSERT INTO cpq_bundle_items
  ("bundleId", "productId", quantity, "minQuantity", "maxQuantity", "isOptional", "allowQuantityChange",
   "itemDiscountPercentage", "sortOrder", "createdAt")
VALUES
  ('dc9b0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000005', 1, 1, 1, false, false, 0, 1, '2025-10-15 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000009', 1, 1, 1, false, false, 0, 2, '2025-10-15 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000008', 1, 1, 2, false, true, 0, 3, '2025-10-15 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000002', 'dc9a0000-0000-4000-8000-000000000001', 1, 1, 2, false, true, 0, 1, '2025-11-01 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000002', 'dc9a0000-0000-4000-8000-000000000012', 1, 1, 3, false, true, 0, 2, '2025-11-01 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000002', 'dc9a0000-0000-4000-8000-000000000007', 1, 0, 1, true, false, 5, 3, '2025-11-01 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000003', 'dc9a0000-0000-4000-8000-000000000003', 1, 1, 2, false, true, 0, 1, '2025-12-01 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000003', 'dc9a0000-0000-4000-8000-000000000010', 1, 1, 1, false, false, 0, 2, '2025-12-01 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000003', 'dc9a0000-0000-4000-8000-000000000011', 1, 1, 1, false, false, 0, 3, '2025-12-01 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000004', 'dc9a0000-0000-4000-8000-000000000004', 1, 1, 2, false, true, 0, 1, '2026-01-05 11:05:00'),
  ('dc9b0000-0000-4000-8000-000000000004', 'dc9a0000-0000-4000-8000-000000000007', 1, 1, 2, false, true, 0, 2, '2026-01-05 11:05:00');

-- ----------------------------------------------------------------- quotes ---
INSERT INTO cpq_quotes
  (id, "companyId", "quoteNumber", version, name, "customerId", "customerName", status, "quoteDate",
   "expirationDate", "validityDays", currency, subtotal, "totalDiscount", "discountPercentage",
   "taxAmount", "taxPercentage", "shippingAmount", "totalAmount", "marginAmount", "marginPercentage",
   "paymentTerms", "deliveryTerms", notes, "assignedTo", "createdBy", "sentAt", "customerResponseAt",
   "createdAt", "updatedAt")
VALUES
  ('dc9c0000-0000-4000-8000-000000000001', :company, 'QTE-DEMO-0001', 1, 'Harbour Grill — banquet line refresh',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-HARBOUR'),
   'Harbour Grill Restaurants', 'Accepted', '2025-10-20', '2025-11-19', 30, 'USD',
   60000, 3000, 5, 4560, 8, 1200, 62760, 15100, 26.49,
   'Net 30', 'DDP site, tailgate delivery', 'Includes commissioning and 2-day chef training.', 'Sarah Mitchell', 'Sarah Mitchell', '2025-10-22 14:30:00', '2025-11-03 10:15:00', '2025-10-20 09:30:00', '2025-11-03 10:15:00'),
  ('dc9c0000-0000-4000-8000-000000000002', :company, 'QTE-DEMO-0002', 2, 'Blue Fig Midtown — main kitchen fitout',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-BLUEFIG'),
   'Blue Fig Hotels Group', 'Sent to Customer', '2025-11-10', '2025-12-10', 30, 'USD',
   130300, 6515, 5, 9902.80, 8, 2500, 136187.80, 32485, 26.24,
   'Net 45', 'DDP site, crane offload by others', 'Rev 2: added second 100kg blast chiller per exec chef review.', 'Sarah Mitchell', 'Sarah Mitchell', '2025-11-14 16:00:00', NULL, '2025-11-10 10:00:00', '2025-11-14 16:00:00'),
  ('dc9c0000-0000-4000-8000-000000000003', :company, 'QTE-DEMO-0003', 1, 'Metro Hospital — warewash upgrade',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Metro Hospital Kitchens' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-METRO'),
   'Metro Hospital Kitchens', 'Draft', '2025-12-02', '2026-01-01', 30, 'USD',
   60600, 0, 0, 4848, 8, 0, 65448, 18200, 30.03,
   'Net 60', 'Delivery to loading dock, install by B3 team', 'Awaiting infection-control sign-off before sending.', 'David Williams', 'David Williams', NULL, NULL, '2025-12-02 11:20:00', '2025-12-02 11:20:00'),
  ('dc9c0000-0000-4000-8000-000000000004', :company, 'QTE-DEMO-0004', 1, 'Golden Spoon — 4-site franchise rollout',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Golden Spoon Franchises' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-GOLDEN'),
   'Golden Spoon Franchises', 'Accepted', '2026-01-12', '2026-02-11', 30, 'USD',
   77200, 7720, 10, 5558.40, 8, 1800, 76838.40, 15880, 22.85,
   'Net 45', 'Staggered delivery, one site per fortnight', 'Volume discount applied per franchise master agreement.', 'Sarah Mitchell', 'Sarah Mitchell', '2026-01-14 09:45:00', '2026-01-28 15:30:00', '2026-01-12 08:50:00', '2026-01-28 15:30:00'),
  ('dc9c0000-0000-4000-8000-000000000005', :company, 'QTE-DEMO-0005', 1, 'Campus Dining — production kitchen',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Campus Dining Co-op' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-CAMPUS'),
   'Campus Dining Co-op', 'Pending Approval', '2026-02-09', '2026-03-11', 30, 'USD',
   57300, 6876, 12, 4033.92, 8, 950, 55407.92, 10224, 20.28,
   'Net 30', 'DDP site during semester break', '12% education discount exceeds rep limit — escalated for approval.', 'David Williams', 'David Williams', NULL, NULL, '2026-02-09 13:10:00', '2026-02-10 09:00:00'),
  ('dc9c0000-0000-4000-8000-000000000006', :company, 'QTE-DEMO-0006', 1, 'Summit Catering — cook-chill starter',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Summit Catering Services' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-SUMMIT'),
   'Summit Catering Services', 'Declined', '2026-02-23', '2026-03-25', 30, 'USD',
   28600, 0, 0, 2288, 8, 600, 31488, 8600, 30.07,
   'Net 15', 'DDP site', 'Customer chose refurbished units from a competitor on price.', 'David Williams', 'David Williams', '2026-02-24 10:30:00', '2026-03-12 16:45:00', '2026-02-23 09:00:00', '2026-03-12 16:45:00'),
  ('dc9c0000-0000-4000-8000-000000000007', :company, 'QTE-DEMO-0007', 1, 'Riverside Bistro — pilot kitchen',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Riverside Bistro Chain' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-RIVERSIDE'),
   'Riverside Bistro Chain', 'Sent to Customer', '2026-04-06', '2026-05-06', 30, 'USD',
   19300, 579, 3, 1497.68, 8, 450, 20668.68, 5321, 28.42,
   'Net 30', 'DDP site', 'Pilot for potential 6-site rollout.', 'David Williams', 'David Williams', '2026-04-07 11:00:00', NULL, '2026-04-06 10:40:00', '2026-04-07 11:00:00'),
  ('dc9c0000-0000-4000-8000-000000000008', :company, 'QTE-DEMO-0008', 1, 'Lakeside Resort — spa cafe & banquet kitchen',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Lakeside Resort & Spa' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-LAKESIDE'),
   'Lakeside Resort & Spa', 'Rejected', '2026-05-11', '2026-06-10', 30, 'USD',
   107100, 19278, 18, 7025.76, 8, 2200, 97047.76, 12922, 14.71,
   'Net 30', 'DDP site, weekend install', 'Rejected in approval: 18% discount drives margin below the 18% guardrail.', 'Sarah Mitchell', 'Sarah Mitchell', NULL, NULL, '2026-05-11 09:15:00', '2026-05-13 17:20:00'),
  ('dc9c0000-0000-4000-8000-000000000009', :company, 'QTE-DEMO-0009', 1, 'Harbour Grill — cook-chill expansion',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-HARBOUR'),
   'Harbour Grill Restaurants', 'Draft', '2026-07-14', '2026-08-13', 30, 'USD',
   50600, 0, 0, 4048, 8, 900, 55548, 15150, 29.94,
   'Net 30', 'DDP site', 'Draft pending site survey for gas supply capacity.', 'Sarah Mitchell', 'Sarah Mitchell', NULL, NULL, '2026-07-14 14:00:00', '2026-07-14 14:00:00'),
  ('dc9c0000-0000-4000-8000-000000000010', :company, 'QTE-DEMO-0010', 1, 'Blue Fig Downtown — banquet expansion',
   COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-BLUEFIG'),
   'Blue Fig Hotels Group', 'Sent to Customer', '2026-08-18', '2026-09-17', 30, 'USD',
   103900, 7273, 7, 7730.16, 8, 2100, 106457.16, 23827, 24.66,
   'Net 45', 'DDP site, night delivery', 'Awaiting customer response; decision expected mid-September.', 'Sarah Mitchell', 'Sarah Mitchell', '2026-08-20 15:30:00', NULL, '2026-08-18 10:10:00', '2026-08-20 15:30:00');

-- ------------------------------------------------------------ quote items ---
INSERT INTO cpq_quote_items
  ("quoteId", "lineNumber", "productId", sku, name, quantity, unit, "listPrice", "unitPrice", "costPrice",
   "discountPercentage", "discountAmount", "extendedPrice", "isBundle", "leadTimeDays", "createdAt", "updatedAt")
VALUES
  ('dc9c0000-0000-4000-8000-000000000001', 1, 'dc9a0000-0000-4000-8000-000000000003', 'DEMO-CMB-E10', 'ProChef Combi Oven 10-Tray Electric', 2, 'unit', 18900, 18900, 13200, 0, 0, 37800, false, 21, '2025-10-20 09:35:00', '2025-10-20 09:35:00'),
  ('dc9c0000-0000-4000-8000-000000000001', 2, 'dc9a0000-0000-4000-8000-000000000007', 'DEMO-BCF-050', 'ArcticLine Blast Chiller 50kg', 1, 'unit', 15400, 15400, 10800, 0, 0, 15400, false, 21, '2025-10-20 09:35:00', '2025-10-20 09:35:00'),
  ('dc9c0000-0000-4000-8000-000000000001', 3, 'dc9a0000-0000-4000-8000-000000000012', 'DEMO-RPC-3D', 'ChefBase Refrigerated Prep Counter 3-Door', 1, 'unit', 6800, 6800, 4700, 0, 0, 6800, false, 14, '2025-10-20 09:35:00', '2025-10-20 09:35:00'),
  ('dc9c0000-0000-4000-8000-000000000002', 1, 'dc9a0000-0000-4000-8000-000000000009', 'DEMO-MCS-2400', 'ModuLine Cooking Suite 2400mm', 1, 'unit', 46500, 46500, 32500, 0, 0, 46500, false, 56, '2025-11-10 10:05:00', '2025-11-10 10:05:00'),
  ('dc9c0000-0000-4000-8000-000000000002', 2, 'dc9a0000-0000-4000-8000-000000000006', 'DEMO-CMB-G20', 'ProChef Combi Oven 20-Tray Gas', 1, 'unit', 34200, 34200, 24000, 0, 0, 34200, false, 35, '2025-11-10 10:05:00', '2025-11-10 10:05:00'),
  ('dc9c0000-0000-4000-8000-000000000002', 3, 'dc9a0000-0000-4000-8000-000000000008', 'DEMO-BCF-100', 'ArcticLine Blast Chiller/Freezer 100kg', 2, 'unit', 24800, 24800, 17400, 0, 0, 49600, false, 28, '2025-11-13 09:00:00', '2025-11-13 09:00:00'),
  ('dc9c0000-0000-4000-8000-000000000003', 1, 'dc9a0000-0000-4000-8000-000000000010', 'DEMO-DWL-RACK', 'HydroJet Rack Conveyor Dishwashing Line', 1, 'unit', 38900, 38900, 27200, 0, 0, 38900, false, 42, '2025-12-02 11:25:00', '2025-12-02 11:25:00'),
  ('dc9c0000-0000-4000-8000-000000000003', 2, 'dc9a0000-0000-4000-8000-000000000011', 'DEMO-WIC-201', 'ColdStore Walk-In Cold Room 20m3', 1, 'unit', 21700, 21700, 15200, 0, 0, 21700, false, 35, '2025-12-02 11:25:00', '2025-12-02 11:25:00'),
  ('dc9c0000-0000-4000-8000-000000000004', 1, 'dc9a0000-0000-4000-8000-000000000001', 'DEMO-CMB-E06', 'ProChef Combi Oven 6-Tray Electric', 4, 'unit', 12500, 12500, 8700, 0, 0, 50000, false, 21, '2026-01-12 09:00:00', '2026-01-12 09:00:00'),
  ('dc9c0000-0000-4000-8000-000000000004', 2, 'dc9a0000-0000-4000-8000-000000000012', 'DEMO-RPC-3D', 'ChefBase Refrigerated Prep Counter 3-Door', 4, 'unit', 6800, 6800, 4700, 0, 0, 27200, false, 14, '2026-01-12 09:00:00', '2026-01-12 09:00:00'),
  ('dc9c0000-0000-4000-8000-000000000005', 1, 'dc9a0000-0000-4000-8000-000000000005', 'DEMO-CMB-E20', 'ProChef Combi Oven 20-Tray Electric', 1, 'unit', 32500, 32500, 22800, 0, 0, 32500, false, 35, '2026-02-09 13:15:00', '2026-02-09 13:15:00'),
  ('dc9c0000-0000-4000-8000-000000000005', 2, 'dc9a0000-0000-4000-8000-000000000008', 'DEMO-BCF-100', 'ArcticLine Blast Chiller/Freezer 100kg', 1, 'unit', 24800, 24800, 17400, 0, 0, 24800, false, 28, '2026-02-09 13:15:00', '2026-02-09 13:15:00'),
  ('dc9c0000-0000-4000-8000-000000000006', 1, 'dc9a0000-0000-4000-8000-000000000002', 'DEMO-CMB-G06', 'ProChef Combi Oven 6-Tray Gas', 1, 'unit', 13200, 13200, 9200, 0, 0, 13200, false, 28, '2026-02-23 09:05:00', '2026-02-23 09:05:00'),
  ('dc9c0000-0000-4000-8000-000000000006', 2, 'dc9a0000-0000-4000-8000-000000000007', 'DEMO-BCF-050', 'ArcticLine Blast Chiller 50kg', 1, 'unit', 15400, 15400, 10800, 0, 0, 15400, false, 21, '2026-02-23 09:05:00', '2026-02-23 09:05:00'),
  ('dc9c0000-0000-4000-8000-000000000007', 1, 'dc9a0000-0000-4000-8000-000000000001', 'DEMO-CMB-E06', 'ProChef Combi Oven 6-Tray Electric', 1, 'unit', 12500, 12500, 8700, 0, 0, 12500, false, 21, '2026-04-06 10:45:00', '2026-04-06 10:45:00'),
  ('dc9c0000-0000-4000-8000-000000000007', 2, 'dc9a0000-0000-4000-8000-000000000012', 'DEMO-RPC-3D', 'ChefBase Refrigerated Prep Counter 3-Door', 1, 'unit', 6800, 6800, 4700, 0, 0, 6800, false, 14, '2026-04-06 10:45:00', '2026-04-06 10:45:00'),
  ('dc9c0000-0000-4000-8000-000000000008', 1, 'dc9a0000-0000-4000-8000-000000000009', 'DEMO-MCS-2400', 'ModuLine Cooking Suite 2400mm', 1, 'unit', 46500, 46500, 32500, 0, 0, 46500, false, 56, '2026-05-11 09:20:00', '2026-05-11 09:20:00'),
  ('dc9c0000-0000-4000-8000-000000000008', 2, 'dc9a0000-0000-4000-8000-000000000010', 'DEMO-DWL-RACK', 'HydroJet Rack Conveyor Dishwashing Line', 1, 'unit', 38900, 38900, 27200, 0, 0, 38900, false, 42, '2026-05-11 09:20:00', '2026-05-11 09:20:00'),
  ('dc9c0000-0000-4000-8000-000000000008', 3, 'dc9a0000-0000-4000-8000-000000000011', 'DEMO-WIC-201', 'ColdStore Walk-In Cold Room 20m3', 1, 'unit', 21700, 21700, 15200, 0, 0, 21700, false, 35, '2026-05-11 09:20:00', '2026-05-11 09:20:00'),
  ('dc9c0000-0000-4000-8000-000000000009', 1, 'dc9a0000-0000-4000-8000-000000000004', 'DEMO-CMB-G10', 'ProChef Combi Oven 10-Tray Gas', 1, 'unit', 19800, 19800, 13850, 0, 0, 19800, false, 28, '2026-07-14 14:05:00', '2026-07-14 14:05:00'),
  ('dc9c0000-0000-4000-8000-000000000009', 2, 'dc9a0000-0000-4000-8000-000000000007', 'DEMO-BCF-050', 'ArcticLine Blast Chiller 50kg', 2, 'unit', 15400, 15400, 10800, 0, 0, 30800, false, 21, '2026-07-14 14:05:00', '2026-07-14 14:05:00'),
  ('dc9c0000-0000-4000-8000-000000000010', 1, 'dc9a0000-0000-4000-8000-000000000005', 'DEMO-CMB-E20', 'ProChef Combi Oven 20-Tray Electric', 2, 'unit', 32500, 32500, 22800, 0, 0, 65000, false, 35, '2026-08-18 10:15:00', '2026-08-18 10:15:00'),
  ('dc9c0000-0000-4000-8000-000000000010', 2, 'dc9a0000-0000-4000-8000-000000000010', 'DEMO-DWL-RACK', 'HydroJet Rack Conveyor Dishwashing Line', 1, 'unit', 38900, 38900, 27200, 0, 0, 38900, false, 42, '2026-08-18 10:15:00', '2026-08-18 10:15:00');

-- --------------------------------------------------------- quote versions ---
INSERT INTO cpq_quote_versions
  ("companyId", "quoteId", "versionNumber", "changeDescription", snapshot, "previousTotal", "newTotal",
   "changePercentage", "createdBy", "createdByName", "createdAt")
VALUES
  (:company, 'dc9c0000-0000-4000-8000-000000000001', 1, 'Initial version.', '{"status":"Draft","subtotal":60000,"totalAmount":62760,"itemCount":3}', NULL, 62760, NULL, 'sarah.mitchell', 'Sarah Mitchell', '2025-10-20 09:40:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000002', 1, 'Initial version with single blast chiller.', '{"status":"Draft","subtotal":105500,"totalAmount":110147.80,"itemCount":3}', NULL, 110147.80, NULL, 'sarah.mitchell', 'Sarah Mitchell', '2025-11-10 10:10:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000002', 2, 'Added second 100kg blast chiller per exec chef review.', '{"status":"Sent to Customer","subtotal":130300,"totalAmount":136187.80,"itemCount":3}', 110147.80, 136187.80, 23.64, 'sarah.mitchell', 'Sarah Mitchell', '2025-11-13 09:05:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000005', 1, 'Initial version with 12% education discount.', '{"status":"Pending Approval","subtotal":57300,"totalAmount":55407.92,"itemCount":2}', NULL, 55407.92, NULL, 'david.williams', 'David Williams', '2026-02-09 13:20:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000008', 1, 'Initial version at 18% discount, sent to approval.', '{"status":"Pending Approval","subtotal":107100,"totalAmount":97047.76,"itemCount":3}', NULL, 97047.76, NULL, 'sarah.mitchell', 'Sarah Mitchell', '2026-05-11 09:25:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000010', 1, 'Initial version.', '{"status":"Draft","subtotal":103900,"totalAmount":106457.16,"itemCount":2}', NULL, 106457.16, NULL, 'sarah.mitchell', 'Sarah Mitchell', '2026-08-18 10:20:00');

INSERT INTO cpq_quote_versions_list
  ("companyId", "quoteNumber", version, "customerName", value, changes, "changeType", "createdBy",
   "createdDate", status, "createdAt", "updatedAt")
VALUES
  (:company, 'QTE-DEMO-0001', 'v1', 'Harbour Grill Restaurants', 62760, '["Initial quote issued"]', 'items-added', 'Sarah Mitchell', '2025-10-20', 'current', '2025-10-20 09:40:00', '2025-10-20 09:40:00'),
  (:company, 'QTE-DEMO-0002', 'v1', 'Blue Fig Hotels Group', 110147.80, '["Initial quote issued"]', 'items-added', 'Sarah Mitchell', '2025-11-10', 'superseded', '2025-11-10 10:10:00', '2025-11-13 09:05:00'),
  (:company, 'QTE-DEMO-0002', 'v2', 'Blue Fig Hotels Group', 136187.80, '["Added 1x ArcticLine Blast Chiller/Freezer 100kg"]', 'items-added', 'Sarah Mitchell', '2025-11-13', 'sent', '2025-11-13 09:05:00', '2025-11-14 16:00:00'),
  (:company, 'QTE-DEMO-0005', 'v1', 'Campus Dining Co-op', 55407.92, '["12% education discount applied"]', 'price-decrease', 'David Williams', '2026-02-09', 'draft', '2026-02-09 13:20:00', '2026-02-09 13:20:00'),
  (:company, 'QTE-DEMO-0008', 'v1', 'Lakeside Resort & Spa', 97047.76, '["18% discount applied","Weekend install terms added"]', 'terms-updated', 'Sarah Mitchell', '2026-05-11', 'draft', '2026-05-11 09:25:00', '2026-05-13 17:20:00'),
  (:company, 'QTE-DEMO-0010', 'v1', 'Blue Fig Hotels Group', 106457.16, '["Initial quote issued"]', 'items-added', 'Sarah Mitchell', '2026-08-18', 'sent', '2026-08-18 10:20:00', '2026-08-20 15:30:00');

-- -------------------------------------------------------- quote templates ---
INSERT INTO cpq_quote_templates
  ("companyId", name, description, category, "isActive", "isDefault", "defaultPaymentTerms",
   "defaultDeliveryTerms", "defaultTermsAndConditions", "defaultValidityDays", "usageCount",
   "lastUsedAt", "isFavorite", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, 'Standard Equipment Quote', 'Default template for single-site equipment quotes.', 'Equipment', true, true, 'Net 30', 'DDP site, tailgate delivery', 'Prices valid for stated validity period. Installation per attached scope. Warranty 12 months parts and labour.', 30, 46, '2026-08-18 10:10:00', true, 'Sarah Mitchell', '2025-10-05 09:00:00', '2026-08-18 10:10:00'),
  (:company, 'Bundle Package Quote', 'Template for pre-priced kitchen package bundles.', 'Bundles', true, false, 'Net 30', 'DDP site, staged delivery', 'Bundle pricing applies only to complete packages. Component substitutions re-price at list.', 45, 18, '2026-06-22 14:00:00', false, 'Sarah Mitchell', '2025-10-18 09:00:00', '2026-06-22 14:00:00'),
  (:company, 'Institutional / Government Quote', 'Extended-validity template for tender and institutional buyers.', 'Institutional', true, false, 'Net 60', 'DDP site, delivery windows per tender schedule', 'Pricing held for 90 days per tender conditions. Performance bond available on request.', 90, 9, '2026-02-09 13:10:00', false, 'David Williams', '2025-11-02 09:00:00', '2026-02-09 13:10:00'),
  (:company, 'Service & Installation Quote', 'Labour, commissioning and training scope template.', 'Services', true, false, 'Net 15', 'On-site services scheduled on PO', 'Site must provide utilities at agreed points. Out-of-hours work billed at 1.5x.', 21, 12, '2026-05-19 10:00:00', false, 'David Williams', '2025-11-20 09:00:00', '2026-05-19 10:00:00'),
  (:company, 'Express Quote', 'Short-form template for small ex-stock orders.', 'Equipment', true, false, 'Payment before dispatch', 'Ex-works, freight quoted separately', 'Ex-stock items only, subject to prior sale.', 14, 27, '2026-07-30 11:30:00', true, 'Sarah Mitchell', '2026-01-08 09:00:00', '2026-07-30 11:30:00');

-- -------------------------------------------------------- quote analytics ---
INSERT INTO cpq_quote_analytics
  ("companyId", "quoteId", "quoteNumber", "customerId", "salesRepId", "daysToCreate", "daysToSend",
   "daysToResponse", "totalCycleDays", "revisionCount", "approvalAttempts", "initialValue", "finalValue",
   "valueChangePercentage", "totalDiscount", "discountPercentage", "marginPercentage", outcome,
   "lossReason", "customerViewCount", "avgViewDuration", "createdAt", "updatedAt")
VALUES
  (:company, 'dc9c0000-0000-4000-8000-000000000001', 'QTE-DEMO-0001', 'Harbour Grill Restaurants', 'Sarah Mitchell', 1, 2, 12, 14, 1, 0, 62760, 62760, 0, 3000, 5, 26.49, 'won', NULL, 6, 240, '2025-11-03 10:20:00', '2025-11-03 10:20:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000002', 'QTE-DEMO-0002', 'Blue Fig Hotels Group', 'Sarah Mitchell', 1, 4, NULL, NULL, 2, 0, 110147.80, 136187.80, 23.64, 6515, 5, 26.24, 'pending', NULL, 9, 310, '2025-11-14 16:05:00', '2026-01-05 09:00:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000004', 'QTE-DEMO-0004', 'Golden Spoon Franchises', 'Sarah Mitchell', 1, 2, 14, 16, 1, 0, 76838.40, 76838.40, 0, 7720, 10, 22.85, 'won', NULL, 11, 285, '2026-01-28 15:35:00', '2026-01-28 15:35:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000005', 'QTE-DEMO-0005', 'Campus Dining Co-op', 'David Williams', 1, NULL, NULL, NULL, 1, 1, 55407.92, 55407.92, 0, 6876, 12, 20.28, 'pending', NULL, 0, NULL, '2026-02-10 09:05:00', '2026-02-10 09:05:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000006', 'QTE-DEMO-0006', 'Summit Catering Services', 'David Williams', 1, 1, 16, 17, 1, 0, 31488, 31488, 0, 0, 0, 30.07, 'lost', 'Lost on price to refurbished competitor units.', 4, 150, '2026-03-12 16:50:00', '2026-03-12 16:50:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000007', 'QTE-DEMO-0007', 'Riverside Bistro Chain', 'David Williams', 1, 1, NULL, NULL, 1, 0, 20668.68, 20668.68, 0, 579, 3, 28.42, 'pending', NULL, 3, 190, '2026-04-07 11:05:00', '2026-06-01 09:00:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000008', 'QTE-DEMO-0008', 'Lakeside Resort & Spa', 'Sarah Mitchell', 1, NULL, NULL, 2, 1, 1, 97047.76, 97047.76, 0, 19278, 18, 14.71, 'cancelled', 'Internal rejection: discount breached margin guardrail.', 0, NULL, '2026-05-13 17:25:00', '2026-05-13 17:25:00'),
  (:company, 'dc9c0000-0000-4000-8000-000000000010', 'QTE-DEMO-0010', 'Blue Fig Hotels Group', 'Sarah Mitchell', 1, 2, NULL, NULL, 1, 0, 106457.16, 106457.16, 0, 7273, 7, 24.66, 'pending', NULL, 5, 260, '2026-08-20 15:35:00', '2026-09-05 09:00:00');

-- --------------------------------------------------------- configurations ---
INSERT INTO cpq_configurations
  (id, "companyId", "configurationNumber", name, "productId", "customerId", "quoteId", "selectedOptions",
   "basePrice", "optionsTotal", "totalPrice", currency, status, "createdBy", "expiresAt", "createdAt", "updatedAt")
VALUES
  ('dc9d0000-0000-4000-8000-000000000001', :company, 'CFG-DEMO-0001', 'Harbour Grill E10 banquet spec', 'dc9a0000-0000-4000-8000-000000000003', 'Harbour Grill Restaurants', 'dc9c0000-0000-4000-8000-000000000001', '{"Voltage":"208V 3-Phase","Accessories":["Loading Trolley"]}', 18900, 1200, 20100, 'USD', 'valid', 'Sarah Mitchell', '2025-12-31 00:00:00', '2025-10-18 15:00:00', '2025-10-19 09:00:00'),
  ('dc9d0000-0000-4000-8000-000000000002', :company, 'CFG-DEMO-0002', 'Blue Fig E20 banquet oven', 'dc9a0000-0000-4000-8000-000000000005', 'Blue Fig Hotels Group', NULL, '{"Steam System":"Boiler Steam Generator","Cleaning":"Automatic Wash System"}', 32500, 4750, 37250, 'USD', 'valid', 'Sarah Mitchell', '2026-01-31 00:00:00', '2025-11-06 11:00:00', '2025-11-06 11:30:00'),
  ('dc9d0000-0000-4000-8000-000000000003', :company, 'CFG-DEMO-0003', 'Metro Hospital warewash line', 'dc9a0000-0000-4000-8000-000000000010', 'Metro Hospital Kitchens', 'dc9c0000-0000-4000-8000-000000000003', '{"Drying":"Heat-Recovery Dryer Module"}', 38900, 7200, 46100, 'USD', 'draft', 'David Williams', '2026-02-28 00:00:00', '2025-12-01 14:00:00', '2025-12-01 14:00:00'),
  ('dc9d0000-0000-4000-8000-000000000004', :company, 'CFG-DEMO-0004', 'Golden Spoon standard E06 site kit', 'dc9a0000-0000-4000-8000-000000000001', 'Golden Spoon Franchises', 'dc9c0000-0000-4000-8000-000000000004', '{"Voltage":"208V 3-Phase"}', 12500, 0, 12500, 'USD', 'valid', 'Sarah Mitchell', '2026-03-31 00:00:00', '2026-01-09 10:00:00', '2026-01-10 10:00:00'),
  ('dc9d0000-0000-4000-8000-000000000005', :company, 'CFG-DEMO-0005', 'Lakeside coastal-spec chiller', 'dc9a0000-0000-4000-8000-000000000008', 'Lakeside Resort & Spa', NULL, '{"Finish":"Marine-Grade SS316"}', 24800, 1488, 26288, 'USD', 'valid', 'Sarah Mitchell', '2026-07-31 00:00:00', '2026-05-08 09:30:00', '2026-05-08 10:00:00'),
  ('dc9d0000-0000-4000-8000-000000000006', :company, 'CFG-DEMO-0006', 'Blue Fig induction cooking suite', 'dc9a0000-0000-4000-8000-000000000009', 'Blue Fig Hotels Group', NULL, '{"Cooking Tops":"Induction Tops Upgrade"}', 46500, 5400, 51900, 'USD', 'draft', 'Sarah Mitchell', '2026-10-31 00:00:00', '2026-08-12 13:00:00', '2026-08-12 13:00:00'),
  ('dc9d0000-0000-4000-8000-000000000007', :company, 'CFG-DEMO-0007', 'Summit cook-chill 50kg chiller', 'dc9a0000-0000-4000-8000-000000000007', 'Summit Catering Services', 'dc9c0000-0000-4000-8000-000000000006', '{"Capacity":["5-Tray Insert Rack"]}', 15400, 480, 15880, 'USD', 'expired', 'David Williams', '2026-04-30 00:00:00', '2026-02-20 10:00:00', '2026-05-01 00:00:00'),
  ('dc9d0000-0000-4000-8000-000000000008', :company, 'CFG-DEMO-0008', 'Riverside display cold room', 'dc9a0000-0000-4000-8000-000000000011', 'Riverside Bistro Chain', NULL, '{"Door":"Glass Display Door"}', 21700, 1650, 23350, 'USD', 'invalid', 'David Williams', '2026-09-30 00:00:00', '2026-06-15 11:00:00', '2026-06-16 09:00:00');

-- ---------------------------------------------------- config rules (list) ---
INSERT INTO cpq_config_rules
  ("companyId", name, type, condition, action, priority, status, "affectedProducts", "createdAt", "updatedAt")
VALUES
  (:company, 'Gas models require gas supply check', 'constraint', 'product.subCategory == "Gas"', 'Require site gas survey document before quote approval.', 1, 'active', 3, '2025-10-06 09:00:00', '2025-10-06 09:00:00'),
  (:company, '20-tray combi requires trolley system', 'dependency', 'product.sku IN ("DEMO-CMB-E20","DEMO-CMB-G20")', 'Auto-add roll-in trolley accessory line.', 2, 'active', 2, '2025-10-06 09:05:00', '2025-10-06 09:05:00'),
  (:company, 'Blast chiller pairing suggestion', 'compatibility', 'category == "Combi Ovens" AND quantity >= 2', 'Suggest ArcticLine blast chiller for cook-chill compliance.', 3, 'active', 6, '2025-10-06 09:10:00', '2025-10-06 09:10:00'),
  (:company, 'Marine finish for coastal sites', 'compatibility', 'customer.region == "Coastal"', 'Recommend SS316 marine-grade finish option.', 4, 'active', 4, '2025-11-12 10:00:00', '2025-11-12 10:00:00'),
  (:company, 'Bundle re-price on substitution', 'pricing', 'bundle.componentChanged == true', 'Re-price substituted components at list price.', 5, 'active', 4, '2026-01-20 10:00:00', '2026-01-20 10:00:00'),
  (:company, 'Legacy 480V step-down kit', 'dependency', 'option.Voltage == "480V 3-Phase"', 'Add step-down transformer kit to configuration.', 6, 'inactive', 2, '2026-03-02 10:00:00', '2026-03-02 10:00:00');

-- ------------------------------------------------------------ config steps ---
INSERT INTO cpq_config_steps
  ("companyId", title, "stepOrder", completed, active, options, "createdAt", "updatedAt")
VALUES
  (:company, 'Select Base Model', 1, true, false, '["Combi Ovens","Refrigeration","Cooking Suites","Warewashing"]', '2025-10-06 10:00:00', '2025-10-06 10:00:00'),
  (:company, 'Power & Utilities', 2, true, false, '["208V 3-Phase","480V 3-Phase","Natural Gas","LPG"]', '2025-10-06 10:01:00', '2025-10-06 10:01:00'),
  (:company, 'Capacity & Accessories', 3, true, false, '["Loading Trolley","Insert Racks","Trolley System"]', '2025-10-06 10:02:00', '2025-10-06 10:02:00'),
  (:company, 'Finish & Options', 4, false, true, '["SS304 Brushed","Marine-Grade SS316","Glass Display Door"]', '2025-10-06 10:03:00', '2025-10-06 10:03:00'),
  (:company, 'Installation & Services', 5, false, false, '["Commissioning","Chef Training","Extended Warranty"]', '2025-10-06 10:04:00', '2025-10-06 10:04:00'),
  (:company, 'Review & Price', 6, false, false, '["Summary","Margin Check","Generate Quote"]', '2025-10-06 10:05:00', '2025-10-06 10:05:00');

-- ---------------------------------------------- configuration rules (engine) ---
INSERT INTO cpq_configuration_rules
  ("companyId", name, description, "ruleType", "productId", "productCategory", conditions, actions,
   priority, "isActive", "effectiveFrom", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, 'Boiler steam excludes injection descaler', 'Boiler-steam ovens use the boiler descale kit, not the injection descaler.', 'exclusion', 'dc9a0000-0000-4000-8000-000000000005', NULL, '{"if":{"option":"Steam System","equals":"Boiler Steam Generator"}}', '{"exclude":{"optionGroup":"Cleaning","option":"Injection Descaler Kit"}}', 1, true, '2025-10-10 00:00:00', 'Sarah Mitchell', '2025-10-10 09:00:00', '2025-10-10 09:00:00'),
  (:company, '20-tray combi includes trolley', 'Roll-in trolley is mandatory with 20-tray combi ovens.', 'inclusion', NULL, 'Combi Ovens', '{"if":{"sku":["DEMO-CMB-E20","DEMO-CMB-G20"]}}', '{"include":{"accessory":"Roll-in Trolley","quantity":1}}', 2, true, '2025-10-10 00:00:00', 'Sarah Mitchell', '2025-10-10 09:05:00', '2025-10-10 09:05:00'),
  (:company, 'Gas models depend on gas survey', 'A completed gas survey is required before a gas model configuration is valid.', 'dependency', NULL, 'Combi Ovens', '{"if":{"subCategory":"Gas"}}', '{"require":{"document":"Gas Site Survey"}}', 3, true, '2025-10-10 00:00:00', 'David Williams', '2025-10-10 09:10:00', '2025-10-10 09:10:00'),
  (:company, 'Walk-in room volume validation', 'Cold room volume must match condensing unit rating.', 'validation', 'dc9a0000-0000-4000-8000-000000000011', NULL, '{"if":{"attribute":"volumeM3","greaterThan":25}}', '{"error":"Selected condensing unit undersized for room volume"}', 4, true, '2025-11-15 00:00:00', 'David Williams', '2025-11-15 09:00:00', '2025-11-15 09:00:00'),
  (:company, 'Marine finish surcharge', 'SS316 finish applies a 6% surcharge on refrigeration shells.', 'pricing', NULL, 'Refrigeration', '{"if":{"option":"Finish","equals":"Marine-Grade SS316"}}', '{"price":{"adjustType":"percentage","value":6}}', 5, true, '2025-11-15 00:00:00', 'Sarah Mitchell', '2025-11-15 09:05:00', '2025-11-15 09:05:00'),
  (:company, 'Induction upgrade excludes gas manifold', 'Induction top upgrade removes the gas manifold from modular suites.', 'exclusion', 'dc9a0000-0000-4000-8000-000000000009', NULL, '{"if":{"option":"Cooking Tops","equals":"Induction Tops Upgrade"}}', '{"exclude":{"component":"Gas Manifold Assembly"}}', 6, true, '2026-02-01 00:00:00', 'Sarah Mitchell', '2026-02-01 09:00:00', '2026-02-01 09:00:00');

-- ---------------------------------------------------- compatibility matrix ---
INSERT INTO cpq_compatibility_matrix
  ("companyId", "sourceProductId", "targetProductId", "compatibilityType", notes, "isActive", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000012', 'compatible', 'Standard QSR pairing: compact combi with refrigerated prep counter.', true, 'Sarah Mitchell', '2025-10-08 09:00:00', '2025-10-08 09:00:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000005', 'dc9a0000-0000-4000-8000-000000000008', 'optional_recommended', 'Recommend 100kg blast chiller with 20-tray combi for HACCP cook-chill.', true, 'Sarah Mitchell', '2025-10-08 09:05:00', '2025-10-08 09:05:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000006', 'dc9a0000-0000-4000-8000-000000000008', 'required', 'Gas 20-tray combi sold for cook-chill sites requires matched-capacity chiller.', true, 'Sarah Mitchell', '2025-10-08 09:10:00', '2025-10-08 09:10:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000006', 'dc9a0000-0000-4000-8000-000000000007', 'incompatible', '50kg chiller undersized for 20-tray combi output; capacity mismatch.', true, 'David Williams', '2025-10-08 09:15:00', '2025-10-08 09:15:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000003', 'dc9a0000-0000-4000-8000-000000000007', 'compatible', '10-tray combi and 50kg chiller are a matched cook-chill pair.', true, 'David Williams', '2025-10-08 09:20:00', '2025-10-08 09:20:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000009', 'dc9a0000-0000-4000-8000-000000000010', 'compatible', 'Modular suite and rack conveyor line share utility corridor layout.', true, 'Sarah Mitchell', '2025-11-18 09:00:00', '2025-11-18 09:00:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000010', 'dc9a0000-0000-4000-8000-000000000011', 'compatible', 'Warewash exit tabling aligns with cold room service door.', true, 'David Williams', '2025-11-18 09:05:00', '2025-11-18 09:05:00'),
  (:company, 'dc9a0000-0000-4000-8000-000000000004', 'dc9a0000-0000-4000-8000-000000000008', 'optional_recommended', 'Recommend 100kg chiller for catering production with gas 10-tray combi.', true, 'David Williams', '2026-01-22 09:00:00', '2026-01-22 09:00:00');

-- --------------------------------------------------- compatibility entries ---
INSERT INTO cpq_compatibility_entries
  ("companyId", product1, product2, compatible, reason, severity, "createdAt", "updatedAt")
VALUES
  (:company, 'ProChef Combi Oven 6-Tray Electric', 'ChefBase Refrigerated Prep Counter 3-Door', true, 'Standard QSR line pairing.', NULL, '2025-10-09 09:00:00', '2025-10-09 09:00:00'),
  (:company, 'ProChef Combi Oven 20-Tray Electric', 'ArcticLine Blast Chiller/Freezer 100kg', true, 'Matched cook-chill capacity.', NULL, '2025-10-09 09:01:00', '2025-10-09 09:01:00'),
  (:company, 'ProChef Combi Oven 20-Tray Gas', 'ArcticLine Blast Chiller 50kg', false, 'Chiller capacity below combi output; fails HACCP throughput check.', 'error', '2025-10-09 09:02:00', '2025-10-09 09:02:00'),
  (:company, 'ModuLine Cooking Suite 2400mm', 'HydroJet Rack Conveyor Dishwashing Line', true, 'Shared utility corridor layout.', NULL, '2025-10-09 09:03:00', '2025-10-09 09:03:00'),
  (:company, 'ColdStore Walk-In Cold Room 20m3', 'ChefBase Refrigerated Prep Counter 3-Door', true, 'Complementary storage and prep cold chain.', NULL, '2025-10-09 09:04:00', '2025-10-09 09:04:00'),
  (:company, 'ProChef Combi Oven 6-Tray Gas', 'ModuLine Cooking Suite 2400mm', false, 'Compact gas combi duplicates suite range function; review scope.', 'warning', '2025-12-04 09:00:00', '2025-12-04 09:00:00'),
  (:company, 'HydroJet Rack Conveyor Dishwashing Line', 'ChefBase Refrigerated Prep Counter 3-Door', false, 'Counter must not sit in warewash wet zone.', 'warning', '2025-12-04 09:01:00', '2025-12-04 09:01:00'),
  (:company, 'ProChef Combi Oven 10-Tray Electric', 'ArcticLine Blast Chiller 50kg', true, 'Matched cook-chill pair for mid-size kitchens.', NULL, '2026-02-14 09:00:00', '2026-02-14 09:00:00');

-- ------------------------------------------------------------- code lists ---
INSERT INTO cpq_code_lists
  ("companyId", "listType", name, code, active, "createdAt", "updatedAt")
VALUES
  (:company, 'branch', 'Main Works', 'DEMO-HQ', true, '2025-10-01 09:00:00', '2025-10-01 09:00:00'),
  (:company, 'branch', 'Coastal Showroom', 'DEMO-CST', true, '2025-10-01 09:01:00', '2025-10-01 09:01:00'),
  (:company, 'branch', 'Northern Depot', 'DEMO-NTH', true, '2025-10-01 09:02:00', '2025-10-01 09:02:00'),
  (:company, 'category', 'Combi Ovens', 'DEMO-CMB', true, '2025-10-01 09:03:00', '2025-10-01 09:03:00'),
  (:company, 'category', 'Refrigeration', 'DEMO-REF', true, '2025-10-01 09:04:00', '2025-10-01 09:04:00'),
  (:company, 'category', 'Warewashing', 'DEMO-DWL', true, '2025-10-01 09:05:00', '2025-10-01 09:05:00');

-- ---------------------------------------------------------- pricing rules ---
INSERT INTO cpq_pricing_rules
  ("companyId", name, description, "ruleType", "applyTo", "targetId", conditions, value, "valueType",
   priority, "isActive", "effectiveFrom", "effectiveUntil", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, 'Combi oven list markup', 'Standard 38% markup over landed cost for combi ovens.', 'markup', 'category', 'Combi Ovens', '{"basis":"landedCost"}', 38, 'percentage', 1, true, '2025-10-01 00:00:00', NULL, 'Sarah Mitchell', '2025-10-01 10:00:00', '2025-10-01 10:00:00'),
  (:company, 'Refrigeration list markup', 'Standard 35% markup over landed cost for refrigeration.', 'markup', 'category', 'Refrigeration', '{"basis":"landedCost"}', 35, 'percentage', 2, true, '2025-10-01 00:00:00', NULL, 'Sarah Mitchell', '2025-10-01 10:05:00', '2025-10-01 10:05:00'),
  (:company, 'Education channel markdown', '5% markdown for education-sector customers.', 'markdown', 'channel', 'Education', '{"customerIndustry":"Education"}', 5, 'percentage', 3, true, '2025-10-01 00:00:00', NULL, 'David Williams', '2025-10-01 10:10:00', '2025-10-01 10:10:00'),
  (:company, 'Golden Spoon framework price', 'Fixed contract price for E06 combi under franchise framework.', 'fixed_price', 'customer', 'Golden Spoon Franchises', '{"sku":"DEMO-CMB-E06"}', 11800, 'fixed', 4, true, '2026-01-01 00:00:00', '2026-12-31 00:00:00', 'Sarah Mitchell', '2026-01-02 10:00:00', '2026-01-02 10:00:00'),
  (:company, 'Multi-unit tiered discount', 'Tiered pricing on 3+ identical units in one quote.', 'tiered', 'global', NULL, '{"minQuantity":3}', 4, 'percentage', 5, true, '2025-10-01 00:00:00', NULL, 'Sarah Mitchell', '2025-10-01 10:15:00', '2025-10-01 10:15:00'),
  (:company, 'Install labour formula', 'Install price computed from equipment value.', 'formula', 'global', NULL, '{"scope":"installation"}', NULL, 'percentage', 6, true, '2025-10-01 00:00:00', NULL, 'David Williams', '2025-10-01 10:20:00', '2025-10-01 10:20:00'),
  (:company, 'Winter warewash markdown', 'Seasonal 3% markdown on warewashing lines.', 'markdown', 'category', 'Warewashing', '{"season":"Q1"}', 3, 'percentage', 7, false, '2026-01-01 00:00:00', '2026-03-31 00:00:00', 'David Williams', '2025-12-15 10:00:00', '2026-04-01 09:00:00');

-- -------------------------------------------------------- pricing versions ---
INSERT INTO cpq_pricing_versions
  ("companyId", version, name, description, status, "changeType", changes, "totalItems", "avgPriceChange",
   notes, "createdBy", "approvedBy", "approvedAt", "activatedAt", "scheduledFor", "createdAt", "updatedAt")
VALUES
  (:company, '2025.3', 'FY25 Q3 baseline', 'Baseline price book at demo data start.', 'superseded', 'restructure', NULL, 12, 0, 'Initial import of price book.', 'Sarah Mitchell', 'Priya Shah', '2025-09-20 10:00:00', '2025-10-01 00:00:00', NULL, '2025-09-18 09:00:00', '2026-01-02 00:00:00'),
  (:company, '2025.4', 'FY25 Q4 steel surcharge', 'Pass-through of stainless steel cost increases.', 'archived', 'price_increase', '[{"productId":"DEMO-CMB-E10","productName":"ProChef Combi Oven 10-Tray Electric","oldPrice":18400,"newPrice":18900,"changePercent":2.7,"reason":"Steel surcharge"}]', 8, 2.40, 'Applied to ovens and suites only.', 'Sarah Mitchell', 'Priya Shah', '2025-11-25 10:00:00', '2025-12-01 00:00:00', NULL, '2025-11-20 09:00:00', '2026-01-02 00:00:00'),
  (:company, '2026.1', 'FY26 annual price book', 'Annual list price update, average +3.1%.', 'active', 'price_increase', '[{"productId":"DEMO-BCF-100","productName":"ArcticLine Blast Chiller/Freezer 100kg","oldPrice":24100,"newPrice":24800,"changePercent":2.9,"reason":"Annual update"}]', 12, 3.10, 'Effective from January 2nd.', 'Sarah Mitchell', 'Priya Shah', '2025-12-28 10:00:00', '2026-01-02 00:00:00', NULL, '2025-12-20 09:00:00', '2026-01-02 00:00:00'),
  (:company, '2026.2', 'Warewash line addition', 'Adds heat-recovery dryer module SKUs to the price book.', 'scheduled', 'new_product', '[{"productId":"DEMO-DWL-RACK","productName":"HydroJet Rack Conveyor Dishwashing Line","oldPrice":38900,"newPrice":38900,"changePercent":0,"reason":"New accessory SKUs"}]', 3, 0, 'Scheduled with October catalogue refresh.', 'David Williams', NULL, NULL, NULL, '2026-10-01 00:00:00', '2026-08-25 09:00:00', '2026-08-25 09:00:00'),
  (:company, '2026.3', 'FY27 draft price book', 'Working draft for next annual update.', 'draft', 'price_increase', NULL, 12, 2.75, 'Pending supplier cost confirmations.', 'Sarah Mitchell', NULL, NULL, NULL, NULL, '2026-09-05 09:00:00', '2026-09-08 14:00:00');

-- ------------------------------------------------------- pricing analytics ---
INSERT INTO cpq_pricing_analytics
  ("companyId", "productId", "productCategory", "periodStart", "periodEnd", "periodType", "avgListPrice",
   "avgSoldPrice", "avgDiscountPercentage", "minSoldPrice", "maxSoldPrice", "priceVariance",
   "quotesGenerated", "quotesWon", "totalRevenue", "totalQuantitySold", "avgMarginPercentage",
   "totalMarginAmount", "createdAt", "updatedAt")
VALUES
  (:company, 'DEMO-CMB-E10', 'Combi Ovens', '2025-10-01', '2025-10-31', 'monthly', 18900, 17955, 5.00, 17955, 18900, 2.60, 4, 2, 71820, 4, 26.40, 18960, '2025-11-02 08:00:00', '2025-11-02 08:00:00'),
  (:company, 'DEMO-BCF-050', 'Refrigeration', '2025-10-01', '2025-10-31', 'monthly', 15400, 14930, 3.05, 14630, 15400, 2.80, 3, 2, 44790, 3, 27.70, 12405, '2025-11-02 08:01:00', '2025-11-02 08:01:00'),
  (:company, 'DEMO-CMB-G20', 'Combi Ovens', '2025-11-01', '2025-11-30', 'monthly', 34200, 32490, 5.00, 32490, 34200, 2.50, 2, 0, 0, 0, NULL, NULL, '2025-12-02 08:00:00', '2025-12-02 08:00:00'),
  (:company, 'DEMO-CMB-E06', 'Combi Ovens', '2026-01-01', '2026-01-31', 'monthly', 12500, 11250, 10.00, 11250, 12500, 4.10, 5, 4, 45000, 4, 22.70, 10215, '2026-02-02 08:00:00', '2026-02-02 08:00:00'),
  (:company, 'DEMO-RPC-3D', 'Refrigeration', '2026-01-01', '2026-01-31', 'monthly', 6800, 6120, 10.00, 6120, 6800, 3.90, 5, 4, 24480, 4, 23.10, 5655, '2026-02-02 08:01:00', '2026-02-02 08:01:00'),
  (:company, 'DEMO-DWL-RACK', 'Warewashing', '2026-01-01', '2026-03-31', 'quarterly', 38900, 37733, 3.00, 36567, 38900, 3.20, 3, 1, 37733, 1, 27.90, 10533, '2026-04-02 08:00:00', '2026-04-02 08:00:00'),
  (:company, 'DEMO-CMB-E20', 'Combi Ovens', '2026-04-01', '2026-06-30', 'quarterly', 32500, 31038, 4.50, 28600, 32500, 6.10, 4, 1, 31038, 1, 25.20, 7822, '2026-07-02 08:00:00', '2026-07-02 08:00:00'),
  (:company, 'DEMO-MCS-2400', 'Cooking Suites', '2026-04-01', '2026-06-30', 'quarterly', 46500, 43013, 7.50, 38130, 46500, 9.70, 3, 0, 0, 0, NULL, NULL, '2026-07-02 08:01:00', '2026-07-02 08:01:00');

-- --------------------------------------------------------- dynamic pricing ---
INSERT INTO cpq_dynamic_pricing
  ("companyId", name, description, "pricingStrategy", "productId", "productCategory", rules,
   "minPriceFloor", "maxPriceCeiling", "updateFrequencyMinutes", "isActive", "lastExecutedAt",
   "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, 'Combi oven demand pricing', 'Lift combi prices when open quote pipeline exceeds capacity.', 'demand_based', NULL, 'Combi Ovens', '{"metric":"openQuotes","threshold":10,"adjustPercent":2}', 92.00, 106.00, 1440, true, '2026-09-08 06:00:00', 'Sarah Mitchell', '2025-11-01 09:00:00', '2026-09-08 06:00:00'),
  (:company, 'Quarter-end close incentive', 'Automatic 3% incentive in the final two weeks of each quarter.', 'time_based', NULL, NULL, '{"window":"lastTwoWeeksOfQuarter","adjustPercent":-3}', 90.00, 100.00, 1440, true, '2026-06-30 06:00:00', 'Sarah Mitchell', '2025-11-01 09:05:00', '2026-06-30 06:00:00'),
  (:company, 'Slow-stock chiller clearance', 'Discount 50kg chillers when depot stock exceeds 8 units.', 'inventory_based', 'DEMO-BCF-050', NULL, '{"metric":"stockOnHand","threshold":8,"adjustPercent":-4}', 88.00, 100.00, 720, true, '2026-09-07 18:00:00', 'David Williams', '2026-01-15 09:00:00', '2026-09-07 18:00:00'),
  (:company, 'Warewash competitor tracking', 'Track two competitor list prices on rack conveyor lines.', 'competitor_based', 'DEMO-DWL-RACK', NULL, '{"competitors":["AquaWash Pro","CleanStream"],"matchPercent":98}', 90.00, 104.00, 10080, false, '2026-05-04 06:00:00', 'David Williams', '2026-02-10 09:00:00', '2026-06-01 09:00:00'),
  (:company, 'Bundle attach-rate booster', 'Custom rule: improve bundle pricing when attach rate drops.', 'custom', NULL, 'Bundles', '{"metric":"bundleAttachRate","threshold":0.25,"adjustPercent":-2}', 90.00, 100.00, 4320, true, '2026-08-22 06:00:00', 'Sarah Mitchell', '2026-03-18 09:00:00', '2026-08-22 06:00:00');

-- -------------------------------------------------------- customer pricing ---
INSERT INTO cpq_customer_pricing
  ("companyId", "customerId", "customerName", "productId", "productCategory", "pricingType", value,
   currency, priority, "isActive", "effectiveFrom", "effectiveUntil", notes, "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Golden Spoon Franchises' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-GOLDEN'), 'Golden Spoon Franchises', 'DEMO-CMB-E06', NULL, 'fixed_price', 11800, 'USD', 1, true, '2026-01-01 00:00:00', '2026-12-31 00:00:00', 'Franchise framework fixed price.', 'Sarah Mitchell', '2026-01-02 09:00:00', '2026-01-02 09:00:00'),
  (:company, COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-BLUEFIG'), 'Blue Fig Hotels Group', NULL, 'Combi Ovens', 'discount_percentage', 7, 'USD', 2, true, '2025-11-01 00:00:00', '2026-10-31 00:00:00', 'Group-wide combi oven discount.', 'Sarah Mitchell', '2025-11-01 09:00:00', '2025-11-01 09:00:00'),
  (:company, COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Metro Hospital Kitchens' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-METRO'), 'Metro Hospital Kitchens', NULL, NULL, 'discount_percentage', 5, 'USD', 3, true, '2025-10-01 00:00:00', NULL, 'Healthcare sector standing discount.', 'David Williams', '2025-10-05 09:00:00', '2025-10-05 09:00:00'),
  (:company, COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Campus Dining Co-op' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-CAMPUS'), 'Campus Dining Co-op', NULL, NULL, 'discount_percentage', 6, 'USD', 4, true, '2025-10-01 00:00:00', NULL, 'Education co-op member pricing.', 'David Williams', '2025-10-05 09:05:00', '2025-10-05 09:05:00'),
  (:company, COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-HARBOUR'), 'Harbour Grill Restaurants', NULL, 'Refrigeration', 'cost_plus', 30, 'USD', 5, true, '2026-02-01 00:00:00', '2027-01-31 00:00:00', 'Cost-plus 30% on refrigeration after banquet win.', 'Sarah Mitchell', '2026-02-01 09:00:00', '2026-02-01 09:00:00'),
  (:company, COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Summit Catering Services' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-SUMMIT'), 'Summit Catering Services', 'DEMO-BCF-050', NULL, 'discount_percentage', 8, 'USD', 6, false, '2026-02-01 00:00:00', '2026-04-30 00:00:00', 'Win-back offer; expired unused.', 'David Williams', '2026-02-15 09:00:00', '2026-05-01 09:00:00');

-- -------------------------------------------------------- contract pricing ---
INSERT INTO cpq_contract_pricing
  ("companyId", "contractId", "contractNumber", "customerId", "productId", "productCategory",
   "contractPrice", "discountPercentage", currency, "minimumQuantity", "maximumQuantity",
   "committedVolume", "utilizedVolume", "startDate", "endDate", "isActive", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, 'DEMO-CNT-2026-001', 'CNT-DEMO-2026-001', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Golden Spoon Franchises' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-GOLDEN'), 'DEMO-CMB-E06', NULL, 11800, NULL, 'USD', 4, 24, 283200, 47200, '2026-01-01 00:00:00', '2026-12-31 00:00:00', true, 'Sarah Mitchell', '2026-01-02 09:30:00', '2026-06-30 09:00:00'),
  (:company, 'DEMO-CNT-2026-001', 'CNT-DEMO-2026-001', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Golden Spoon Franchises' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-GOLDEN'), 'DEMO-RPC-3D', NULL, 6350, NULL, 'USD', 4, 24, 152400, 25400, '2026-01-01 00:00:00', '2026-12-31 00:00:00', true, 'Sarah Mitchell', '2026-01-02 09:31:00', '2026-06-30 09:00:00'),
  (:company, 'DEMO-CNT-2026-002', 'CNT-DEMO-2026-002', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-BLUEFIG'), NULL, 'Combi Ovens', NULL, 7, 'USD', 2, NULL, 400000, 136187.80, '2025-11-01 00:00:00', '2026-10-31 00:00:00', true, 'Sarah Mitchell', '2025-11-01 09:30:00', '2026-08-20 16:00:00'),
  (:company, 'DEMO-CNT-2026-003', 'CNT-DEMO-2026-003', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Metro Hospital Kitchens' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-METRO'), NULL, 'Warewashing', NULL, 6, 'USD', 1, NULL, 120000, 0, '2026-01-01 00:00:00', '2027-12-31 00:00:00', true, 'David Williams', '2026-01-10 09:30:00', '2026-01-10 09:30:00'),
  (:company, 'DEMO-CNT-2025-009', 'CNT-DEMO-2025-009', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName" = 'Campus Dining Co-op' AND "companyId" = :company LIMIT 1), 'DEMO-CUST-CAMPUS'), NULL, NULL, NULL, 6, 'USD', 1, NULL, 150000, 88400, '2025-07-01 00:00:00', '2026-06-30 00:00:00', false, 'David Williams', '2025-10-02 09:30:00', '2026-07-01 09:00:00');

-- --------------------------------------------------------- volume discounts ---
INSERT INTO cpq_volume_discounts
  ("companyId", name, description, "discountBasis", "productId", "productCategory", tiers,
   "isCumulative", "isActive", "effectiveFrom", "effectiveUntil", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, 'Combi oven multi-unit tiers', 'Quantity breaks on identical combi oven models.', 'quantity', NULL, 'Combi Ovens', '[{"minQty":2,"maxQty":3,"discountPercent":3},{"minQty":4,"maxQty":7,"discountPercent":6},{"minQty":8,"discountPercent":9}]', false, true, '2025-10-01 00:00:00', NULL, 'Sarah Mitchell', '2025-10-01 11:00:00', '2025-10-01 11:00:00'),
  (:company, 'Order value tiers', 'Whole-order discount by quote value.', 'value', NULL, NULL, '[{"minValue":50000,"maxValue":99999,"discountPercent":2},{"minValue":100000,"maxValue":199999,"discountPercent":4},{"minValue":200000,"discountPercent":6}]', false, true, '2025-10-01 00:00:00', NULL, 'Sarah Mitchell', '2025-10-01 11:05:00', '2025-10-01 11:05:00'),
  (:company, 'Prep counter fleet tiers', 'Quantity breaks on refrigerated prep counters for chains.', 'quantity', 'DEMO-RPC-3D', NULL, '[{"minQty":3,"maxQty":5,"discountPercent":4},{"minQty":6,"discountPercent":8}]', false, true, '2025-11-01 00:00:00', NULL, 'David Williams', '2025-11-01 11:00:00', '2025-11-01 11:00:00'),
  (:company, 'Freight weight bands', 'Freight-share discount by total shipment weight.', 'weight', NULL, NULL, '[{"minWeightKg":500,"maxWeightKg":999,"discountPercent":1},{"minWeightKg":1000,"discountPercent":2}]', true, true, '2026-01-01 00:00:00', NULL, 'David Williams', '2026-01-05 11:00:00', '2026-01-05 11:00:00'),
  (:company, 'FY25 legacy value tiers', 'Superseded FY25 order-value discount grid.', 'value', NULL, NULL, '[{"minValue":40000,"maxValue":79999,"discountPercent":2},{"minValue":80000,"discountPercent":3}]', false, false, '2025-01-01 00:00:00', '2025-09-30 00:00:00', 'Sarah Mitchell', '2025-10-01 11:10:00', '2025-10-01 11:10:00');

-- ------------------------------------------------------ promotional pricing ---
INSERT INTO cpq_promotional_pricing
  ("companyId", "promoCode", name, description, "promotionType", "discountValue", "productId",
   "productCategory", "bundleId", "minimumOrderValue", "minimumQuantity", "maxUsageCount",
   "currentUsageCount", "maxUsagePerCustomer", "startDate", "endDate", "isActive", "isStackable",
   "createdBy", "createdAt", "updatedAt")
VALUES
  (:company, 'DEMO-LAUNCH25', 'FY26 price book launch offer', '5% off any order placed in launch month.', 'percentage', 5, NULL, NULL, NULL, 25000, NULL, 40, 12, 1, '2026-01-02 00:00:00', '2026-01-31 23:59:59', false, false, 'Sarah Mitchell', '2025-12-28 10:00:00', '2026-02-01 09:00:00'),
  (:company, 'DEMO-CHILL1000', 'Blast chiller season saver', '$1,000 off any 100kg blast chiller/freezer.', 'fixed_amount', 1000, 'DEMO-BCF-100', NULL, NULL, NULL, 1, 25, 6, 2, '2026-02-01 00:00:00', '2026-04-30 23:59:59', false, true, 'David Williams', '2026-01-25 10:00:00', '2026-05-01 09:00:00'),
  (:company, 'DEMO-PREP3FOR2', 'Prep counter 3-for-2 racks', 'Buy 3 prep counters, get insert rack kits free.', 'buy_x_get_y', NULL, 'DEMO-RPC-3D', NULL, NULL, NULL, 3, 15, 2, 1, '2026-03-01 00:00:00', '2026-06-30 23:59:59', false, false, 'David Williams', '2026-02-20 10:00:00', '2026-07-01 09:00:00'),
  (:company, 'DEMO-HOTELPKG', 'Hotel package bonus discount', 'Extra 2% off the Complete Hotel Kitchen Package.', 'bundle_discount', 2, NULL, NULL, 'dc9b0000-0000-4000-8000-000000000001', NULL, 1, 10, 1, 1, '2026-06-01 00:00:00', '2026-09-30 23:59:59', true, false, 'Sarah Mitchell', '2026-05-20 10:00:00', '2026-08-15 09:00:00'),
  (:company, 'DEMO-COMBI4Q', 'Combi oven quarter-end push', '4% off combi ovens until quarter end.', 'percentage', 4, NULL, 'Combi Ovens', NULL, 15000, NULL, 30, 3, 2, '2026-09-01 00:00:00', '2026-09-30 23:59:59', true, false, 'Sarah Mitchell', '2026-08-28 10:00:00', '2026-09-06 09:00:00'),
  (:company, 'DEMO-WAREWASH26', 'Warewash trade-in promo', '$2,500 trade-in credit on rack conveyor lines.', 'fixed_amount', 2500, 'DEMO-DWL-RACK', NULL, NULL, 30000, 1, 12, 0, 1, '2026-09-01 00:00:00', '2026-12-31 23:59:59', true, false, 'David Williams', '2026-08-28 10:05:00', '2026-08-28 10:05:00');

-- -------------------------------------------------------- margin guardrails ---
INSERT INTO cpq_margin_guardrails
  ("companyId", name, "guardrailType", threshold, enabled, action, "notifyRoles", description, "createdAt", "updatedAt")
VALUES
  (:company, 'Minimum quote margin — warn', 'min_margin', 18, true, 'warn', '["sales_manager"]', 'Warn the rep when blended quote margin drops below 18%.', '2025-10-02 12:00:00', '2025-10-02 12:00:00'),
  (:company, 'Minimum quote margin — block', 'min_margin', 12, true, 'block', '["sales_manager","finance_controller"]', 'Hard stop: quotes below 12% blended margin cannot be sent.', '2025-10-02 12:01:00', '2025-10-02 12:01:00'),
  (:company, 'Maximum discount approval gate', 'max_discount', 15, true, 'require_approval', '["sales_director"]', 'Discounts above 15% route to sales director approval.', '2025-10-02 12:02:00', '2025-10-02 12:02:00'),
  (:company, 'Target margin tracking', 'target_margin', 28, true, 'warn', '["sales_manager"]', 'Flag quotes landing below the 28% target margin for coaching.', '2026-01-15 12:00:00', '2026-01-15 12:00:00'),
  (:company, 'Floor price protection', 'floor_price', 0, true, 'block', '["finance_controller"]', 'Never allow unit price below landed cost.', '2025-10-02 12:03:00', '2025-10-02 12:03:00');

-- ------------------------------------------------------- discount analytics ---
INSERT INTO cpq_discount_analytics
  ("companyId", "periodStart", "periodEnd", "salesRepId", "productCategory", "customerSegment",
   "avgDiscountPercentage", "totalDiscountAmount", "discountApprovalCount", "discountRejectionCount",
   "discountDistribution", "revenueImpact", "marginImpact", "createdAt", "updatedAt")
VALUES
  (:company, '2025-10-01', '2025-12-31', 'Sarah Mitchell', 'Combi Ovens', 'Enterprise', 5.00, 9515, 2, 0, '{"0-5":6,"5-10":3,"10-15":0,"15+":0}', 190300, -9515, '2026-01-05 08:00:00', '2026-01-05 08:00:00'),
  (:company, '2025-10-01', '2025-12-31', 'David Williams', 'Refrigeration', 'Mid-Market', 2.10, 1840, 1, 0, '{"0-5":5,"5-10":1,"10-15":0,"15+":0}', 87500, -1840, '2026-01-05 08:01:00', '2026-01-05 08:01:00'),
  (:company, '2026-01-01', '2026-03-31', 'Sarah Mitchell', NULL, 'Enterprise', 10.00, 7720, 1, 0, '{"0-5":1,"5-10":2,"10-15":2,"15+":0}', 77200, -7720, '2026-04-05 08:00:00', '2026-04-05 08:00:00'),
  (:company, '2026-01-01', '2026-03-31', 'David Williams', NULL, 'Mid-Market', 6.00, 6876, 0, 1, '{"0-5":2,"5-10":1,"10-15":1,"15+":0}', 86850, -6876, '2026-04-05 08:01:00', '2026-04-05 08:01:00'),
  (:company, '2026-04-01', '2026-06-30', 'Sarah Mitchell', NULL, 'Enterprise', 10.50, 19857, 0, 1, '{"0-5":1,"5-10":1,"10-15":0,"15+":1}', 126400, -19857, '2026-07-05 08:00:00', '2026-07-05 08:00:00'),
  (:company, '2026-04-01', '2026-06-30', 'David Williams', NULL, 'SMB', 3.00, 579, 1, 0, '{"0-5":2,"5-10":0,"10-15":0,"15+":0}', 19300, -579, '2026-07-05 08:01:00', '2026-07-05 08:01:00');

-- -------------------------------------------------------- cross-sell rules ---
INSERT INTO cpq_cross_sell_rules
  ("companyId", "primaryProduct", "suggestedProduct", relationship, "coOccurrenceRate",
   "avgAdditionalRevenue", "conversionRate", "customersCount", "totalOpportunityValue",
   "recommendationStrength", "activeCampaigns", "createdAt", "updatedAt")
VALUES
  (:company, '{"code":"DEMO-CMB-E10","name":"ProChef Combi Oven 10-Tray Electric","category":"Combi Ovens","value":18900}', '{"code":"DEMO-BCF-050","name":"ArcticLine Blast Chiller 50kg","category":"Refrigeration","value":15400}', 'essential', 64.00, 15400, 41.00, 14, 215600, 'high', 1, '2025-11-05 09:00:00', '2026-06-01 09:00:00'),
  (:company, '{"code":"DEMO-CMB-E20","name":"ProChef Combi Oven 20-Tray Electric","category":"Combi Ovens","value":32500}', '{"code":"DEMO-BCF-100","name":"ArcticLine Blast Chiller/Freezer 100kg","category":"Refrigeration","value":24800}', 'essential', 71.00, 24800, 48.00, 9, 223200, 'high', 1, '2025-11-05 09:01:00', '2026-06-01 09:00:00'),
  (:company, '{"code":"DEMO-CMB-E06","name":"ProChef Combi Oven 6-Tray Electric","category":"Combi Ovens","value":12500}', '{"code":"DEMO-RPC-3D","name":"ChefBase Refrigerated Prep Counter 3-Door","category":"Refrigeration","value":6800}', 'complement', 52.00, 6800, 35.00, 18, 122400, 'medium', 1, '2025-11-05 09:02:00', '2026-06-01 09:00:00'),
  (:company, '{"code":"DEMO-DWL-RACK","name":"HydroJet Rack Conveyor Dishwashing Line","category":"Warewashing","value":38900}', '{"code":"DEMO-WIC-201","name":"ColdStore Walk-In Cold Room 20m3","category":"Refrigeration","value":21700}', 'complement', 38.00, 21700, 22.00, 6, 130200, 'medium', 0, '2025-12-10 09:00:00', '2026-06-01 09:00:00'),
  (:company, '{"code":"DEMO-CMB-G06","name":"ProChef Combi Oven 6-Tray Gas","category":"Combi Ovens","value":13200}', '{"code":"DEMO-CMB-G10","name":"ProChef Combi Oven 10-Tray Gas","category":"Combi Ovens","value":19800}', 'upgrade', 24.00, 6600, 18.00, 7, 46200, 'low', 0, '2026-01-20 09:00:00', '2026-06-01 09:00:00'),
  (:company, '{"code":"DEMO-MCS-2400","name":"ModuLine Cooking Suite 2400mm","category":"Cooking Suites","value":46500}', '{"code":"DEMO-BND-001","name":"Complete Hotel Kitchen Package","category":"Bundles","value":93420}', 'bundle', 31.00, 46920, 26.00, 5, 234600, 'medium', 1, '2026-02-14 09:00:00', '2026-06-01 09:00:00');

-- ------------------------------------------------- guided selling questions ---
INSERT INTO cpq_guided_selling_questions
  ("companyId", title, description, "questionType", required, "displayOrder", options, "helpText",
   "isActive", "createdAt", "updatedAt")
VALUES
  (:company, 'What type of operation is the kitchen for?', 'Segment drives base product family recommendation.', 'single', true, 1, '[{"label":"Restaurant / Bistro","value":"restaurant"},{"label":"Hotel / Banquet","value":"hotel","recommended":true},{"label":"Healthcare / Institutional","value":"healthcare"},{"label":"QSR / Franchise","value":"qsr"},{"label":"Catering / Cook-Chill","value":"catering"}]', 'Pick the closest match to the customer''s primary service model.', true, '2025-10-12 09:00:00', '2025-10-12 09:00:00'),
  (:company, 'How many covers per service?', 'Peak covers determine combi oven capacity.', 'range', true, 2, '[{"label":"Up to 100","value":"0-100","productIds":["dc9a0000-0000-4000-8000-000000000001"]},{"label":"100-300","value":"100-300","productIds":["dc9a0000-0000-4000-8000-000000000003"],"recommended":true},{"label":"300+","value":"300+","productIds":["dc9a0000-0000-4000-8000-000000000005"]}]', 'Use peak service covers, not daily totals.', true, '2025-10-12 09:01:00', '2025-10-12 09:01:00'),
  (:company, 'Which utilities are available on site?', 'Gas availability decides gas vs electric models.', 'multiple', true, 3, '[{"label":"3-Phase Power","value":"3phase"},{"label":"Natural Gas","value":"gas"},{"label":"LPG","value":"lpg"},{"label":"Single Phase Only","value":"1phase"}]', 'If only single phase is available, flag for site survey.', true, '2025-10-12 09:02:00', '2025-10-12 09:02:00'),
  (:company, 'Is cook-chill production planned?', 'Cook-chill workflows require blast chilling capacity.', 'boolean', true, 4, '[{"label":"Yes","value":"yes","productIds":["dc9a0000-0000-4000-8000-000000000007","dc9a0000-0000-4000-8000-000000000008"],"recommended":true},{"label":"No","value":"no"}]', 'HACCP cook-chill requires +90C to +3C within 90 minutes.', true, '2025-10-12 09:03:00', '2025-10-12 09:03:00'),
  (:company, 'What is the warewashing volume?', 'Rack volume decides undercounter vs rack conveyor.', 'single', false, 5, '[{"label":"Under 40 racks/hr","value":"low"},{"label":"40-120 racks/hr","value":"mid"},{"label":"120+ racks/hr","value":"high","productIds":["dc9a0000-0000-4000-8000-000000000010"],"recommended":true}]', 'Estimate from covers x 1.6 rack factor.', true, '2025-10-12 09:04:00', '2025-10-12 09:04:00'),
  (:company, 'What is the equipment budget?', 'Budget band steers bundle vs itemised proposal.', 'number', false, 6, NULL, 'Enter the customer''s stated budget in USD.', true, '2025-10-12 09:05:00', '2025-10-12 09:05:00'),
  (:company, 'Is the site coastal or high-salinity?', 'Coastal sites should be offered marine-grade SS316 finish.', 'boolean', false, 7, '[{"label":"Yes","value":"yes"},{"label":"No","value":"no","recommended":true}]', 'Salt air corrodes SS304 shells within 3-4 years.', true, '2026-01-18 09:00:00', '2026-01-18 09:00:00');
