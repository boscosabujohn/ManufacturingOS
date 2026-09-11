-- ============================================================================
-- 40_django_crm_sales_proc.sql
-- Demo seed for Django (OptiForge platform) CRM / Sales / Procurement tables,
-- plus the orphan TypeORM `boq` table.
--
-- Tables seeded (16):
--   crm_account, crm_contact, crm_lead, crm_opportunity
--   sales_customerrequirement, sales_pricebook, sales_pricebookentry,
--   sales_quotation, sales_quotationline, sales_salesorder
--   procurement_supplier, procurement_purchaseorder, procurement_rfq,
--   procurement_rfqinvitation, procurement_goodsreceiptnote
--   boq  (TypeORM table, no tenant_id — scoped by "boqNumber" LIKE 'BOQ-DEMO-%')
--
-- Strategy: mirror the NestJS demo twins via INSERT..SELECT where columns map
-- (crm_customers, crm_leads, vendors, sales_quotations(+items), sales_orders,
--  purchase_orders, goods_receipts); hand-authored rows for tables with no twin.
-- Source-row UUIDs are reused where the mapping is 1:1; derived rows use
-- deterministic md5(...)::uuid so the script is fully idempotent.
--
-- Idempotency: DELETE-then-INSERT.
--   * Django tables: DELETE ... WHERE tenant_id = :'tenant' (children first).
--   * boq:           DELETE ... WHERE "boqNumber" LIKE 'BOQ-DEMO-%'.
--
-- Foundation dependency: tenancy_tenant b3000000-0000-4000-8000-000000000001
-- must already exist (38_django_foundation.sql).
-- No BEGIN/COMMIT here — the caller owns the transaction.
-- ============================================================================

\set tenant b3000000-0000-4000-8000-000000000001

SET CONSTRAINTS ALL IMMEDIATE;

-- ============================================================================
-- DELETE (children before parents)
-- ============================================================================

-- CRM
DELETE FROM crm_contact               WHERE tenant_id = :'tenant'::uuid;
DELETE FROM crm_opportunity           WHERE tenant_id = :'tenant'::uuid;
DELETE FROM crm_lead                  WHERE tenant_id = :'tenant'::uuid;

-- Sales (salesorder -> quotation -> customerrequirement; line -> quotation)
DELETE FROM sales_salesorder          WHERE tenant_id = :'tenant'::uuid;
DELETE FROM sales_quotationline       WHERE tenant_id = :'tenant'::uuid;
DELETE FROM sales_quotation           WHERE tenant_id = :'tenant'::uuid;
DELETE FROM sales_customerrequirement WHERE tenant_id = :'tenant'::uuid;
DELETE FROM sales_pricebookentry      WHERE tenant_id = :'tenant'::uuid;
DELETE FROM sales_pricebook           WHERE tenant_id = :'tenant'::uuid;

-- Procurement (grn -> po -> supplier; invitation -> rfq/supplier)
DELETE FROM procurement_goodsreceiptnote WHERE tenant_id = :'tenant'::uuid;
DELETE FROM procurement_purchaseorder    WHERE tenant_id = :'tenant'::uuid;
DELETE FROM procurement_rfqinvitation    WHERE tenant_id = :'tenant'::uuid;
DELETE FROM procurement_rfq              WHERE tenant_id = :'tenant'::uuid;
DELETE FROM procurement_supplier         WHERE tenant_id = :'tenant'::uuid;

-- CRM account last (lead/contact/opportunity reference it)
DELETE FROM crm_account               WHERE tenant_id = :'tenant'::uuid;

-- boq has no tenant column: demo rows are scoped by number prefix
DELETE FROM boq WHERE "boqNumber" LIKE 'BOQ-DEMO-%';

-- ============================================================================
-- CRM
-- ============================================================================

-- crm_account (8) — mirrored from NestJS crm_customers (id reused 1:1).
-- Django status choices: active | dormant | lost.
WITH src AS (
    SELECT c.*, row_number() OVER (ORDER BY c."customerName") AS rn
    FROM crm_customers c
)
INSERT INTO crm_account
    (id, name, website, industry, annual_revenue, status,
     extensible_attributes, created_at, updated_at, tenant_id)
SELECT
    s.id,
    s."customerName",
    CASE WHEN s.email IS NOT NULL
         THEN 'https://www.' || split_part(s.email, '@', 2)
         ELSE '' END,
    COALESCE(s.industry, ''),
    s."lifetimeValue",
    CASE lower(s.status)
        WHEN 'active'   THEN 'active'
        WHEN 'inactive' THEN 'dormant'
        WHEN 'churned'  THEN 'lost'
        ELSE 'active'                      -- 'Prospect' etc.
    END,
    jsonb_build_object(
        'segment',        s.segment,
        'region',         s.region,
        'account_manager', s."accountManager",
        'mirror_source',  'nestjs:crm_customers'
    ),
    timestamptz '2025-10-05 09:00:00+00' + (s.rn - 1) * interval '45 days',
    timestamptz '2025-10-05 09:00:00+00' + (s.rn - 1) * interval '45 days'
        + interval '18 days',
    :'tenant'::uuid
FROM src s;

-- crm_contact (8) — one primary contact per account, split from
-- crm_customers."contactPerson" (derived deterministic id).
WITH src AS (
    SELECT c.*, row_number() OVER (ORDER BY c."customerName") AS rn
    FROM crm_customers c
    WHERE c."contactPerson" IS NOT NULL
)
INSERT INTO crm_contact
    (id, first_name, last_name, email, phone, is_primary,
     created_at, account_id, tenant_id)
SELECT
    md5('django-crm-contact:' || s.id::text)::uuid,
    split_part(s."contactPerson", ' ', 1),
    COALESCE(NULLIF(btrim(substr(s."contactPerson",
             length(split_part(s."contactPerson", ' ', 1)) + 1)), ''), ''),
    COALESCE(s.email, ''),
    COALESCE(s.phone, ''),
    true,
    timestamptz '2025-10-06 10:30:00+00' + (s.rn - 1) * interval '45 days',
    s.id,                                  -- account reuses customer id
    :'tenant'::uuid
FROM src s;

-- crm_lead (20) — mirrored from the 20 oldest NestJS crm_leads (id reused).
-- Django status choices: new | qualified | disqualified | converted.
-- 'converted' leads get a round-robin converted_account.
WITH acc AS (
    SELECT id, row_number() OVER (ORDER BY name) AS rn
    FROM crm_account WHERE tenant_id = :'tenant'::uuid
),
picked AS (
    SELECT * FROM crm_leads ORDER BY "createdAt", id LIMIT 20
),
src AS (
    SELECT p.*, row_number() OVER (ORDER BY p."createdAt", p.id) AS rn
    FROM picked p
)
INSERT INTO crm_lead
    (id, company, contact_name, email, source, status,
     created_at, converted_account_id, tenant_id)
SELECT
    s.id,
    s.company,
    s."firstName" || ' ' || s."lastName",
    COALESCE(s.email, ''),
    left(s."leadSource", 80),
    CASE s.status::text
        WHEN 'new'         THEN 'new'
        WHEN 'contacted'   THEN 'new'
        WHEN 'qualified'   THEN 'qualified'
        WHEN 'proposal'    THEN 'qualified'
        WHEN 'negotiation' THEN 'qualified'
        WHEN 'lost'        THEN 'disqualified'
        WHEN 'won'         THEN 'converted'
        ELSE 'new'
    END,
    timestamptz '2025-10-03 08:15:00+00' + (s.rn - 1) * interval '17 days',
    CASE WHEN s.status::text = 'won'
         THEN (SELECT a.id FROM acc a WHERE a.rn = ((s.rn - 1) % 8) + 1)
         ELSE NULL END,
    :'tenant'::uuid
FROM src s;

-- crm_opportunity (12) — from NestJS crm_leads in pipeline stages
-- (qualified/proposal/negotiation/won); accounts assigned round-robin.
-- Django stage choices: discovery | proposal | negotiation | won | lost.
WITH acc AS (
    SELECT id, row_number() OVER (ORDER BY name) AS rn
    FROM crm_account WHERE tenant_id = :'tenant'::uuid
),
picked AS (
    SELECT * FROM crm_leads
    WHERE status::text IN ('qualified', 'proposal', 'negotiation', 'won')
    ORDER BY "createdAt", id
    LIMIT 12
),
src AS (
    SELECT p.*, row_number() OVER (ORDER BY p."createdAt", p.id) AS rn
    FROM picked p
)
INSERT INTO crm_opportunity
    (id, name, stage, amount, probability, expected_close_date,
     created_at, updated_at, account_id, tenant_id)
SELECT
    md5('django-crm-opportunity:' || s.id::text)::uuid,
    left(s.company || ' - Kitchen Equipment Deal', 255),
    CASE s.status::text
        WHEN 'qualified'   THEN 'discovery'
        WHEN 'proposal'    THEN 'proposal'
        WHEN 'negotiation' THEN 'negotiation'
        WHEN 'won'         THEN 'won'
        ELSE 'discovery'
    END,
    COALESCE(s."estimatedValue", 50000),
    COALESCE(s.probability, 20) / 100.0,
    COALESCE(s."estimatedCloseDate",
             date '2026-03-31' + (s.rn * 14)::int),
    timestamptz '2025-11-01 11:00:00+00' + (s.rn - 1) * interval '28 days',
    timestamptz '2025-11-01 11:00:00+00' + (s.rn - 1) * interval '28 days'
        + interval '9 days',
    (SELECT a.id FROM acc a WHERE a.rn = ((s.rn - 1) % 8) + 1),
    :'tenant'::uuid
FROM src s;

-- ============================================================================
-- SALES
-- ============================================================================

-- sales_customerrequirement (6) — hand-authored (no NestJS twin).
-- source_type choices: catalog_order|configurator_order|bom_import|boq_import|
--                      rfq_spec|contract_release|forecast_plan
-- status choices: draft|parsed|approved|rejected
INSERT INTO sales_customerrequirement
    (id, source_type, source_payload, extensible_attributes, parsed_lines,
     status, created_at, updated_at, tenant_id)
VALUES
    ('ddc50000-0000-4000-8000-000000000001', 'boq_import',
     '{"file": "harbour-grill-fitout-boq.xlsx", "sheets": 3}'::jsonb, '{}'::jsonb,
     '[{"item_code": "KIT-RANGE-6B", "qty": 4}, {"item_code": "KIT-HOOD-3M", "qty": 4}]'::jsonb,
     'approved', '2025-10-08 09:20:00+00', '2025-10-15 14:00:00+00', :'tenant'::uuid),
    ('ddc50000-0000-4000-8000-000000000002', 'rfq_spec',
     '{"rfq_ref": "BLUEFIG-RFQ-118", "scope": "central kitchen refit"}'::jsonb, '{}'::jsonb,
     '[{"item_code": "KIT-OVEN-CONV", "qty": 6}, {"item_code": "KIT-FRYER-DBL", "qty": 3}]'::jsonb,
     'approved', '2025-11-19 10:05:00+00', '2025-11-27 16:30:00+00', :'tenant'::uuid),
    ('ddc50000-0000-4000-8000-000000000003', 'catalog_order',
     '{"channel": "portal", "customer": "Campus Dining Co-op"}'::jsonb, '{}'::jsonb,
     '[{"item_code": "KIT-DISH-RACK", "qty": 24}]'::jsonb,
     'parsed', '2026-01-12 08:45:00+00', '2026-01-12 09:10:00+00', :'tenant'::uuid),
    ('ddc50000-0000-4000-8000-000000000004', 'configurator_order',
     '{"configurator_session": "CFG-2026-0142", "model": "island-suite"}'::jsonb, '{}'::jsonb,
     '[{"item_code": "KIT-ISLAND-CFG", "qty": 1, "options": {"finish": "SS304"}}]'::jsonb,
     'approved', '2026-03-04 13:25:00+00', '2026-03-10 09:00:00+00', :'tenant'::uuid),
    ('ddc50000-0000-4000-8000-000000000005', 'contract_release',
     '{"contract": "GOLDEN-SPOON-FY26", "release_no": 2}'::jsonb, '{}'::jsonb,
     '[{"item_code": "KIT-GRIDDLE-90", "qty": 10}]'::jsonb,
     'parsed', '2026-05-21 11:40:00+00', '2026-05-21 12:00:00+00', :'tenant'::uuid),
    ('ddc50000-0000-4000-8000-000000000006', 'forecast_plan',
     '{"horizon": "2026-H2", "planner": "S&OP"}'::jsonb, '{}'::jsonb,
     '[]'::jsonb,
     'draft', '2026-08-14 15:10:00+00', '2026-08-14 15:10:00+00', :'tenant'::uuid);

-- sales_quotation (12) — mirrored from the first 12 NestJS QT-DEMO
-- sales_quotations (id reused); customer_requirement round-robin over the 6 CRs.
-- Django status choices: draft|priced|submitted|accepted|declined|expired.
WITH cr AS (
    SELECT id, row_number() OVER (ORDER BY id) AS rn
    FROM sales_customerrequirement WHERE tenant_id = :'tenant'::uuid
),
picked AS (
    SELECT * FROM sales_quotations
    WHERE "quotationNumber" LIKE 'QT-DEMO%'
    ORDER BY "quotationNumber"
    LIMIT 12
),
src AS (
    SELECT p.*, row_number() OVER (ORDER BY p."quotationNumber") AS rn
    FROM picked p
)
INSERT INTO sales_quotation
    (id, number, total_amount, currency, valid_until, status,
     workflow_instance_id, created_at, customer_requirement_id, tenant_id)
SELECT
    s.id,
    s."quotationNumber",
    s."totalAmount",
    left(s.currency, 3),
    s."validUntil",
    CASE s.status::text
        WHEN 'draft'    THEN 'draft'
        WHEN 'sent'     THEN 'submitted'
        WHEN 'accepted' THEN 'accepted'
        WHEN 'rejected' THEN 'declined'
        WHEN 'expired'  THEN 'expired'
        ELSE 'draft'
    END,
    NULL,
    timestamptz '2025-10-20 09:30:00+00' + (s.rn - 1) * interval '28 days',
    (SELECT c.id FROM cr c WHERE c.rn = ((s.rn - 1) % 6) + 1),
    :'tenant'::uuid
FROM src s;

-- sales_quotationline — all NestJS sales_quotation_items belonging to the 12
-- mirrored quotations (item id reused 1:1).
INSERT INTO sales_quotationline
    (id, item_code, description, qty, unit_price, extensible_attributes,
     quotation_id, tenant_id)
SELECT
    i.id,
    left(i."productCode", 60),
    left(COALESCE(i."productName", ''), 255),
    i.quantity,
    i."unitPrice",
    jsonb_build_object(
        'tax_rate',            i."taxRate",
        'discount_percentage', i."discountPercentage",
        'mirror_source',       'nestjs:sales_quotation_items'
    ),
    q.id,
    :'tenant'::uuid
FROM sales_quotation_items i
JOIN sales_quotation q
  ON q.id = i."quotationId"
 AND q.tenant_id = :'tenant'::uuid;

-- sales_salesorder (8) — mirrored from the first 8 NestJS SO-DEMO sales_orders
-- (id reused); linked to the mirrored quotation when its number was among the
-- 12 seeded above (quotation_id is nullable, so LEFT JOIN).
-- Django status choices: draft|confirmed|in_production|shipped|invoiced|cancelled.
WITH picked AS (
    SELECT * FROM sales_orders
    WHERE "orderNumber" LIKE 'SO-DEMO%'
    ORDER BY "orderNumber"
    LIMIT 8
),
src AS (
    SELECT p.*, row_number() OVER (ORDER BY p."orderNumber") AS rn
    FROM picked p
)
INSERT INTO sales_salesorder
    (id, number, mode, status, promised_ship_date, created_at,
     quotation_id, tenant_id)
SELECT
    s.id,
    s."orderNumber",
    CASE WHEN s.rn % 3 = 0 THEN 'eto' ELSE 'discrete' END,
    CASE s.status
        WHEN 'confirmed'     THEN 'confirmed'
        WHEN 'in_production' THEN 'in_production'
        WHEN 'delivered'     THEN 'shipped'
        WHEN 'completed'     THEN 'invoiced'
        WHEN 'cancelled'     THEN 'cancelled'
        ELSE 'draft'
    END,
    COALESCE(s."promisedDeliveryDate"::date,
             date '2026-02-01' + (s.rn * 21)::int),
    timestamptz '2025-12-01 10:00:00+00' + (s.rn - 1) * interval '35 days',
    dq.id,
    :'tenant'::uuid
FROM src s
LEFT JOIN sales_quotation dq
  ON dq.number = s."quotationNumber"
 AND dq.tenant_id = :'tenant'::uuid;

-- sales_pricebook (2) — hand-authored.
INSERT INTO sales_pricebook (id, name, currency, is_active, tenant_id)
VALUES
    ('ddb00000-0000-4000-8000-000000000001', 'Standard List Prices FY26', 'USD', true,  :'tenant'::uuid),
    ('ddb00000-0000-4000-8000-000000000002', 'Contract / Franchise Pricing', 'USD', true, :'tenant'::uuid);

-- sales_pricebookentry (10) — 5 distinct item codes priced off NestJS
-- sales_quotation_items, once per price book (contract book at 5% off).
-- Unique key: (tenant, price_book, item_code, min_qty).
WITH items AS (
    SELECT DISTINCT ON (i."productCode")
           i."productCode" AS code, i."unitPrice" AS price
    FROM sales_quotation_items i
    JOIN sales_quotations q
      ON q.id = i."quotationId" AND q."quotationNumber" LIKE 'QT-DEMO%'
    ORDER BY i."productCode", i."unitPrice" DESC
    LIMIT 5
),
books AS (
    SELECT 'ddb00000-0000-4000-8000-000000000001'::uuid AS id,
           1.00 AS factor, date '2025-10-01' AS eff
    UNION ALL
    SELECT 'ddb00000-0000-4000-8000-000000000002'::uuid,
           0.95, date '2026-01-01'
)
INSERT INTO sales_pricebookentry
    (id, item_code, unit_price, min_qty, effective_from, price_book_id, tenant_id)
SELECT
    md5('django-pbe:' || b.id::text || ':' || it.code)::uuid,
    left(it.code, 60),
    round(it.price * b.factor, 4),
    1,
    b.eff,
    b.id,
    :'tenant'::uuid
FROM items it
CROSS JOIN books b;

-- ============================================================================
-- PROCUREMENT
-- ============================================================================

-- procurement_supplier (8) — mirrored from NestJS vendors (id reused 1:1).
-- Django status choices: approved | pending | blocked.
WITH src AS (
    SELECT v.*, row_number() OVER (ORDER BY v."vendorCode") AS rn
    FROM vendors v
)
INSERT INTO procurement_supplier
    (id, code, name, email, status, credit_terms_days,
     extensible_attributes, created_at, tenant_id)
SELECT
    s.id,
    left(s."vendorCode", 50),
    s."vendorName",
    COALESCE(s.email, ''),
    CASE
        WHEN s.status::text = 'Active' AND s."isApproved" THEN 'approved'
        WHEN s.status::text = 'Blacklisted'               THEN 'blocked'
        WHEN s.status::text = 'Active'                    THEN 'approved'
        ELSE 'pending'
    END,
    s."paymentTermsDays",
    jsonb_build_object(
        'vendor_type',   s."vendorType"::text,
        'category',      s.category,
        'country',       s.country,
        'mirror_source', 'nestjs:vendors'
    ),
    timestamptz '2025-10-02 08:00:00+00' + (s.rn - 1) * interval '40 days',
    :'tenant'::uuid
FROM src s;

-- procurement_purchaseorder (10) — mirrored from the first 10 NestJS PO-DEMO
-- purchase_orders (id reused); supplier via vendorId (verified to match
-- vendors.id for all PO-DEMO rows).
-- Django status choices: draft|approved|sent|closed|cancelled.
WITH picked AS (
    SELECT * FROM purchase_orders
    WHERE "poNumber" LIKE 'PO-DEMO%'
    ORDER BY "poNumber"
    LIMIT 10
),
src AS (
    SELECT p.*, row_number() OVER (ORDER BY p."poNumber") AS rn
    FROM picked p
)
INSERT INTO procurement_purchaseorder
    (id, number, total_amount, currency, status, approval_state,
     created_at, supplier_id, tenant_id)
SELECT
    s.id,
    s."poNumber",
    s."totalAmount",
    left(s.currency, 3),
    CASE s.status::text
        WHEN 'Draft'              THEN 'draft'
        WHEN 'Submitted'          THEN 'sent'
        WHEN 'Approved'           THEN 'approved'
        WHEN 'In Progress'        THEN 'sent'
        WHEN 'Partially Received' THEN 'sent'
        WHEN 'Fully Received'     THEN 'closed'
        WHEN 'Closed'             THEN 'closed'
        WHEN 'Cancelled'          THEN 'cancelled'
        ELSE 'draft'
    END,
    CASE WHEN s."isApproved" THEN 'approved' ELSE 'pending' END,
    timestamptz '2025-11-10 09:45:00+00' + (s.rn - 1) * interval '30 days',
    s."vendorId"::uuid,
    :'tenant'::uuid
FROM src s;

-- procurement_goodsreceiptnote (6) — mirrored from NestJS GR-DEMO
-- goods_receipts whose PO is among the 10 mirrored above (id reused).
WITH picked AS (
    SELECT g.*, po.id AS django_po_id,
           row_number() OVER (ORDER BY g."grnNumber") AS rn
    FROM goods_receipts g
    JOIN procurement_purchaseorder po
      ON po.number = g."purchaseOrderNumber"
     AND po.tenant_id = :'tenant'::uuid
    WHERE g."grnNumber" LIKE 'GR-DEMO%'
    ORDER BY g."grnNumber"
    LIMIT 6
)
INSERT INTO procurement_goodsreceiptnote
    (id, number, received_at, notes, purchase_order_id, tenant_id)
SELECT
    p.id,
    p."grnNumber",
    timestamptz '2026-01-15 14:30:00+00' + (p.rn - 1) * interval '45 days',
    COALESCE(p.notes, ''),
    p.django_po_id,
    :'tenant'::uuid
FROM picked p;

-- procurement_rfq (4) — hand-authored.
-- Django status choices: draft | sent | received | closed.
INSERT INTO procurement_rfq
    (id, number, title, status, closes_on, created_at, tenant_id)
VALUES
    ('dd0f0000-0000-4000-8000-000000000001', 'RFQ-DEMO-2025-001',
     'Stainless steel sheets & tube stock — Q4 replenishment', 'closed',
     '2025-11-30', '2025-10-22 09:00:00+00', :'tenant'::uuid),
    ('dd0f0000-0000-4000-8000-000000000002', 'RFQ-DEMO-2026-001',
     'Commercial oven burner assemblies (annual rate contract)', 'received',
     '2026-02-28', '2026-01-20 10:15:00+00', :'tenant'::uuid),
    ('dd0f0000-0000-4000-8000-000000000003', 'RFQ-DEMO-2026-002',
     'Export packaging & crating services', 'sent',
     '2026-07-15', '2026-06-02 11:30:00+00', :'tenant'::uuid),
    ('dd0f0000-0000-4000-8000-000000000004', 'RFQ-DEMO-2026-003',
     'Control panels and wiring harnesses for island suites', 'draft',
     '2026-10-31', '2026-09-01 08:45:00+00', :'tenant'::uuid);

-- procurement_rfqinvitation (8) — 2 suppliers per RFQ, paired round-robin;
-- sent_at only for RFQs already sent (draft RFQ invitations not yet sent).
WITH s AS (
    SELECT id, row_number() OVER (ORDER BY code) AS rn
    FROM procurement_supplier WHERE tenant_id = :'tenant'::uuid
),
r AS (
    SELECT id, number, status, created_at,
           row_number() OVER (ORDER BY number) AS rn
    FROM procurement_rfq WHERE tenant_id = :'tenant'::uuid
)
INSERT INTO procurement_rfqinvitation (id, sent_at, rfq_id, supplier_id, tenant_id)
SELECT
    md5('django-rfq-invite:' || r.id::text || ':' || s.id::text)::uuid,
    CASE WHEN r.status <> 'draft' THEN r.created_at + interval '2 days' END,
    r.id,
    s.id,
    :'tenant'::uuid
FROM r
JOIN s ON s.rn IN (2 * r.rn - 1, 2 * r.rn);

-- ============================================================================
-- BOQ (TypeORM table — camelCase columns, no tenant_id)
-- ============================================================================
-- boq_status_enum: 'Draft' | 'Under Review' | 'Approved' | 'Rejected'
INSERT INTO boq
    (id, "boqNumber", "projectName", "clientName", "projectLocation",
     "projectDuration", currency, "estimatedValue", notes, status,
     "createdAt", "updatedAt")
VALUES
    ('b0c00000-0000-4000-8000-000000000001', 'BOQ-DEMO-2025-001',
     'Harbour Grill Flagship Kitchen Fit-out', 'Harbour Grill Restaurants',
     'San Francisco, CA', '16 weeks', 'USD', 486500.00,
     'Full back-of-house fit-out: cooking line, extraction, cold rooms.',
     'Approved', '2025-10-12 09:00:00', '2025-11-05 15:20:00'),
    ('b0c00000-0000-4000-8000-000000000002', 'BOQ-DEMO-2026-001',
     'Blue Fig Central Production Kitchen', 'Blue Fig Hotels Group',
     'New York, NY', '24 weeks', 'USD', 912750.00,
     'Central kitchen refit including blast chillers and conveyor dishwash.',
     'Under Review', '2026-02-18 10:30:00', '2026-03-02 12:00:00'),
    ('b0c00000-0000-4000-8000-000000000003', 'BOQ-DEMO-2026-002',
     'Campus Dining Hall Modernisation - Phase 2', 'Campus Dining Co-op',
     'Boston, MA', '12 weeks', 'USD', 268300.00,
     'Servery counters, dish return line, and ventilation upgrade.',
     'Draft', '2026-08-25 14:10:00', '2026-08-25 14:10:00');

-- ============================================================================
-- End of 40_django_crm_sales_proc.sql
-- ============================================================================
