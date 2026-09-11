-- Demo seed — CPQ part B (approvals, contracts, proposals, documents, guided selling,
-- recommendations, integrations, notifications, permissions, analytics) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: every table is cleared for this company first (delete predicate is
-- "companyId" = :company), then re-inserted with fixed dcb000xx-* UUIDs.
-- Cross-file references: cpq_quotes (QTE-DEMO-*) and cpq_products (dc9a0000-*) are
-- seeded by 25_cpq_a and applied before this file; quote ids are resolved via
-- subselects with COALESCE fallbacks so this file also validates standalone.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- 1. Approval workflows
-- ============================================================================
DELETE FROM cpq_approval_workflows WHERE "companyId" = :company;
INSERT INTO cpq_approval_workflows
  (id, "companyId", name, description, "workflowType", "isActive", "isDefault", steps, conditions,
   "thresholdAmount", "thresholdDiscountPercentage", "createdBy", "createdAt", "updatedAt")
VALUES
  ('dcb00001-0000-4000-8000-000000000001', :company, 'Standard Quote Approval', 'Single-step manager sign-off for quotes up to 50k USD.', 'quote', true, true,
   '[{"step":1,"role":"Sales Manager","approver":"Rajesh Kumar","slaHours":24}]', '{"maxAmount":50000}', 50000, NULL, 'Rajesh Kumar', '2025-10-02 09:00:00', '2025-10-02 09:00:00'),
  ('dcb00001-0000-4000-8000-000000000002', :company, 'High-Value Quote Approval', 'Two-step approval for quotes above 50k USD; VP added above 150k.', 'quote', true, false,
   '[{"step":1,"role":"Sales Manager","approver":"Rajesh Kumar","slaHours":24},{"step":2,"role":"Sales Director","approver":"Priya Sharma","slaHours":48},{"step":3,"role":"VP Sales","approver":"Vikram Singh","slaHours":72,"condition":"amount>150000"}]',
   '{"minAmount":50000}', 150000, NULL, 'Priya Sharma', '2025-10-02 09:15:00', '2026-01-10 11:20:00'),
  ('dcb00001-0000-4000-8000-000000000003', :company, 'Discount Approval Ladder', 'Discounts over 10 percent need the sales manager; over 20 percent the director.', 'discount', true, true,
   '[{"step":1,"role":"Sales Manager","approver":"Rajesh Kumar","threshold":10},{"step":2,"role":"Sales Director","approver":"Priya Sharma","threshold":20}]',
   '{"minDiscountPercentage":10}', NULL, 10, 'Priya Sharma', '2025-10-02 09:30:00', '2025-10-02 09:30:00'),
  ('dcb00001-0000-4000-8000-000000000004', :company, 'Proposal Review', 'Content and pricing review before any proposal is sent to a customer.', 'proposal', true, true,
   '[{"step":1,"role":"Sales Manager","approver":"Anita Desai","slaHours":24}]', NULL, NULL, NULL, 'Anita Desai', '2025-10-03 10:00:00', '2025-10-03 10:00:00'),
  ('dcb00001-0000-4000-8000-000000000005', :company, 'Contract Sign-off', 'Legal and finance sign-off for all outbound contracts.', 'contract', true, true,
   '[{"step":1,"role":"Legal Counsel","approver":"Suresh Patel","slaHours":48},{"step":2,"role":"Finance Controller","approver":"Meera Nair","slaHours":48}]',
   NULL, NULL, NULL, 'Suresh Patel', '2025-10-03 10:30:00', '2025-10-03 10:30:00');

-- ============================================================================
-- 2. Approval matrix (discount / value escalation rules)
-- ============================================================================
DELETE FROM cpq_approval_matrix WHERE "companyId" = :company;
INSERT INTO cpq_approval_matrix
  (id, "companyId", name, description, condition, "requiredApprovers", priority,
   "autoEscalateAfterHours", "isActive", "createdAt", "updatedAt")
VALUES
  ('dcb00002-0000-4000-8000-000000000001', :company, 'Discount 10-20 percent', 'Any quote discount above 10 percent requires sales manager approval.',
   '{"field":"discountPercentage","operator":"between","min":10,"max":20}', '["Sales Manager"]', 'medium', 24, true, '2025-10-04 09:00:00', '2025-10-04 09:00:00'),
  ('dcb00002-0000-4000-8000-000000000002', :company, 'Discount above 20 percent', 'Discounts above 20 percent escalate to the sales director.',
   '{"field":"discountPercentage","operator":"gt","value":20}', '["Sales Manager","Sales Director"]', 'high', 12, true, '2025-10-04 09:05:00', '2025-10-04 09:05:00'),
  ('dcb00002-0000-4000-8000-000000000003', :company, 'Quote value above 150k', 'High-value quotes need VP sales visibility.',
   '{"field":"totalValue","operator":"gt","value":150000}', '["Sales Director","VP Sales"]', 'high', 24, true, '2025-10-04 09:10:00', '2026-02-15 14:00:00'),
  ('dcb00002-0000-4000-8000-000000000004', :company, 'Non-standard payment terms', 'Payment terms longer than Net 45 require finance review.',
   '{"field":"paymentTerms","operator":"in","values":["Net 60","Net 90"]}', '["Finance Controller"]', 'medium', 48, true, '2025-10-04 09:15:00', '2025-10-04 09:15:00'),
  ('dcb00002-0000-4000-8000-000000000005', :company, 'Custom fabrication line items', 'Quotes containing custom stainless fabrication go through engineering review.',
   '{"field":"hasCustomFabrication","operator":"eq","value":true}', '["Engineering Lead","Sales Manager"]', 'urgent', 12, true, '2025-10-04 09:20:00', '2025-10-04 09:20:00');

-- ============================================================================
-- 3. Approval requests (tied to demo quotes QTE-DEMO-*)
-- ============================================================================
DELETE FROM cpq_approval_requests WHERE "companyId" = :company;
INSERT INTO cpq_approval_requests
  (id, "companyId", "workflowId", "entityType", "entityId", "entityNumber", status, "currentStep",
   "stepHistory", "requestedBy", "requestNotes", "requestedAmount", "requestedDiscountPercentage",
   "finalApproverId", "completedAt", "finalComments", "createdAt", "updatedAt")
VALUES
  ('dcb0000c-0000-4000-8000-000000000001', :company, 'dcb00001-0000-4000-8000-000000000002', 'quote',
   COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0001' LIMIT 1),'QTE-DEMO-0001'), 'QTE-DEMO-0001', 'approved', 2,
   '[{"step":1,"approver":"Rajesh Kumar","action":"approved","at":"2025-11-06T10:30:00Z"},{"step":2,"approver":"Priya Sharma","action":"approved","at":"2025-11-07T09:15:00Z"}]',
   'Amit Verma', 'Full galley fitout for Fjordline Cruises; pricing per approved margin model.', 415000, 8.00,
   'Priya Sharma', '2025-11-07 09:15:00', 'Approved. Margin is healthy at this volume.', '2025-11-05 16:40:00', '2025-11-07 09:15:00'),
  ('dcb0000c-0000-4000-8000-000000000002', :company, 'dcb00001-0000-4000-8000-000000000003', 'discount',
   COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0002' LIMIT 1),'QTE-DEMO-0002'), 'QTE-DEMO-0002', 'approved', 1,
   '[{"step":1,"approver":"Rajesh Kumar","action":"approved","at":"2025-12-02T11:00:00Z"}]',
   'Kiran Reddy', 'Requesting 12 percent to match incumbent supplier pricing at Aurelia Grand Hotel.', 388000, 12.00,
   'Rajesh Kumar', '2025-12-02 11:00:00', 'Approved within manager band.', '2025-12-01 14:20:00', '2025-12-02 11:00:00'),
  ('dcb0000c-0000-4000-8000-000000000003', :company, 'dcb00001-0000-4000-8000-000000000003', 'discount',
   COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0003' LIMIT 1),'QTE-DEMO-0003'), 'QTE-DEMO-0003', 'rejected', 2,
   '[{"step":1,"approver":"Rajesh Kumar","action":"approved","at":"2026-01-13T15:30:00Z"},{"step":2,"approver":"Priya Sharma","action":"rejected","at":"2026-01-14T10:05:00Z"}]',
   'Deepak Joshi', '22 percent requested to win Big Sky Steakhouse against local competitor.', 36000, 22.00,
   'Priya Sharma', '2026-01-14 10:05:00', 'Rejected. Deal too small to justify sub-floor pricing; offer 15 percent max.', '2026-01-12 09:45:00', '2026-01-14 10:05:00'),
  ('dcb0000c-0000-4000-8000-000000000004', :company, 'dcb00001-0000-4000-8000-000000000001', 'quote',
   COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0004' LIMIT 1),'QTE-DEMO-0004'), 'QTE-DEMO-0004', 'approved', 1,
   '[{"step":1,"approver":"Rajesh Kumar","action":"approved","at":"2026-03-04T12:00:00Z"}]',
   'Ravi Menon', 'Standard combi oven and refrigeration package for St. Aldric Medical Center.', 265000, 5.00,
   'Rajesh Kumar', '2026-03-04 12:00:00', 'Approved.', '2026-03-03 10:10:00', '2026-03-04 12:00:00'),
  ('dcb0000c-0000-4000-8000-000000000005', :company, 'dcb00001-0000-4000-8000-000000000002', 'quote',
   COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0005' LIMIT 1),'QTE-DEMO-0005'), 'QTE-DEMO-0005', 'pending', 2,
   '[{"step":1,"approver":"Rajesh Kumar","action":"approved","at":"2026-08-21T09:30:00Z"}]',
   'Sunita Rao', 'Banquet kitchen line for Bayside Convention Center; step 2 with director.', 410000, 9.50,
   NULL, NULL, NULL, '2026-08-20 15:00:00', '2026-08-21 09:30:00'),
  ('dcb0000c-0000-4000-8000-000000000006', :company, 'dcb00001-0000-4000-8000-000000000003', 'discount',
   COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0006' LIMIT 1),'QTE-DEMO-0006'), 'QTE-DEMO-0006', 'pending', 1,
   NULL, 'Ajay Pillai', '14 percent requested for Campus Dining Co-op summer refresh bundle.', 96000, 14.00,
   NULL, NULL, NULL, '2026-09-08 11:25:00', '2026-09-08 11:25:00');

-- ============================================================================
-- 4. Approval items (generic approval queues)
-- ============================================================================
DELETE FROM cpq_approval_items WHERE "companyId" = :company;
INSERT INTO cpq_approval_items
  (id, "companyId", category, reference, title, "customerName", value, "requestedBy", status,
   priority, reason, "dueDate", payload, "createdAt", "updatedAt")
VALUES
  ('dcb0000e-0000-4000-8000-000000000001', :company, 'quote', 'QTE-DEMO-0005', 'Banquet kitchen line — final quote sign-off', 'Bayside Convention Center', 410000, 'Sunita Rao', 'pending', 'high',
   'Quote value exceeds 150k threshold; director approval outstanding.', '2026-09-12 17:00:00', '{"discountPercentage":9.5,"marginPercentage":24.1}', '2026-08-21 09:35:00', '2026-08-21 09:35:00'),
  ('dcb0000e-0000-4000-8000-000000000002', :company, 'discount', 'QTE-DEMO-0006', '14 percent discount — Campus Dining refresh', 'Campus Dining Co-op', 96000, 'Ajay Pillai', 'pending', 'medium',
   'Above the 10 percent manager band.', '2026-09-15 17:00:00', '{"requestedDiscount":14,"standardDiscount":10}', '2026-09-08 11:30:00', '2026-09-08 11:30:00'),
  ('dcb0000e-0000-4000-8000-000000000003', :company, 'contract', 'DEMO-CTR-2026-004', 'Master agreement renewal — Golden Spoon', 'Golden Spoon Franchises', 480000, 'Amit Verma', 'pending', 'high',
   'Renewal with revised rebate schedule; needs legal and finance.', '2026-09-20 17:00:00', '{"termMonths":24,"autoRenewal":true}', '2026-09-01 10:00:00', '2026-09-05 09:00:00'),
  ('dcb0000e-0000-4000-8000-000000000004', :company, 'legal', 'DEMO-CTR-2026-002', 'Liability cap redline — Metro Hospital', 'Metro Hospital Kitchens', 300000, 'Suresh Patel', 'approved', 'high',
   'Customer requested liability cap at 2x contract value; legal accepted with carve-outs.', '2026-02-10 17:00:00', '{"redlines":3,"acceptedRedlines":2}', '2026-02-02 09:00:00', '2026-02-09 16:30:00'),
  ('dcb0000e-0000-4000-8000-000000000005', :company, 'executive', 'QTE-DEMO-0001', 'Cruise galley fitout — exec visibility', 'Fjordline Cruises USA', 415000, 'Priya Sharma', 'approved', 'urgent',
   'Largest single quote of FY26 Q2; flagged for executive dashboard.', '2025-11-10 17:00:00', '{"vpNotified":true}', '2025-11-06 12:00:00', '2025-11-08 10:00:00'),
  ('dcb0000e-0000-4000-8000-000000000006', :company, 'discount', 'QTE-DEMO-0003', '22 percent discount — Big Sky Steakhouse', 'Big Sky Steakhouse', 36000, 'Deepak Joshi', 'rejected', 'low',
   'Requested discount breaches floor price.', '2026-01-16 17:00:00', '{"requestedDiscount":22,"maxOffered":15}', '2026-01-12 10:00:00', '2026-01-14 10:10:00'),
  ('dcb0000e-0000-4000-8000-000000000007', :company, 'proposal', 'DEMO-PRP-2026-003', 'Proposal review — Lakeside Resort spa cafe', 'Lakeside Resort & Spa', 118000, 'Anita Desai', 'approved', 'medium',
   'Content and pricing reviewed; case studies attached.', '2026-04-05 17:00:00', '{"sectionsReviewed":6}', '2026-04-01 09:30:00', '2026-04-03 15:45:00'),
  ('dcb0000e-0000-4000-8000-000000000008', :company, 'quote', 'QTE-DEMO-0002', 'Aurelia Grand Hotel kitchen refresh', 'Aurelia Grand Hotel', 388000, 'Kiran Reddy', 'escalated', 'high',
   'Manager SLA of 24h exceeded; auto-escalated to director.', '2025-12-03 17:00:00', '{"escalatedAt":"2025-12-02T09:00:00Z"}', '2025-12-01 14:25:00', '2025-12-02 09:00:00');

-- ============================================================================
-- 5. Workflow requests (legal / executive / discount queues)
-- ============================================================================
DELETE FROM cpq_workflow_requests WHERE "companyId" = :company;
INSERT INTO cpq_workflow_requests
  (id, "companyId", "requestType", reference, "documentNumber", "customerName", value, "requestedBy",
   "assignedTo", priority, status, "requestDate", "dueDate", payload, "createdAt", "updatedAt")
VALUES
  ('dcb0000f-0000-4000-8000-000000000001', :company, 'legal', 'DEMO-CTR-2026-001', 'DEMO-CTR-2026-001', 'Fjordline Cruises USA', 415000, 'Amit Verma', 'Suresh Patel', 'high', 'completed',
   '2025-11-20', '2025-11-27', '{"reviewType":"maritime supply terms","clausesFlagged":2}', '2025-11-20 09:00:00', '2025-11-26 17:00:00'),
  ('dcb0000f-0000-4000-8000-000000000002', :company, 'legal', 'DEMO-CTR-2026-002', 'DEMO-CTR-2026-002', 'Metro Hospital Kitchens', 300000, 'Ravi Menon', 'Suresh Patel', 'high', 'completed',
   '2026-02-02', '2026-02-09', '{"reviewType":"liability cap redline","clausesFlagged":3}', '2026-02-02 09:05:00', '2026-02-09 16:35:00'),
  ('dcb0000f-0000-4000-8000-000000000003', :company, 'executive', 'QTE-DEMO-0001', 'QTE-DEMO-0001', 'Fjordline Cruises USA', 415000, 'Priya Sharma', 'Vikram Singh', 'urgent', 'approved',
   '2025-11-06', '2025-11-10', '{"reason":"largest FY26 Q2 quote"}', '2025-11-06 12:05:00', '2025-11-08 10:05:00'),
  ('dcb0000f-0000-4000-8000-000000000004', :company, 'discount', 'QTE-DEMO-0006', 'QTE-DEMO-0006', 'Campus Dining Co-op', 96000, 'Ajay Pillai', 'Rajesh Kumar', 'medium', 'pending',
   '2026-09-08', '2026-09-15', '{"requestedDiscount":14}', '2026-09-08 11:35:00', '2026-09-08 11:35:00'),
  ('dcb0000f-0000-4000-8000-000000000005', :company, 'legal', 'DEMO-CTR-2026-005', 'DEMO-CTR-2026-005', 'Harbour Grill Restaurants', 187500, 'Kiran Reddy', 'Suresh Patel', 'medium', 'in-review',
   '2026-08-28', '2026-09-11', '{"reviewType":"SOW for install services"}', '2026-08-28 10:20:00', '2026-09-04 14:00:00'),
  ('dcb0000f-0000-4000-8000-000000000006', :company, 'executive', 'DEMO-CTR-2026-004', 'DEMO-CTR-2026-004', 'Golden Spoon Franchises', 480000, 'Amit Verma', 'Vikram Singh', 'high', 'pending',
   '2026-09-02', '2026-09-20', '{"reason":"multi-year franchise master agreement renewal"}', '2026-09-02 09:40:00', '2026-09-02 09:40:00');

-- ============================================================================
-- 6. Contract templates
-- ============================================================================
DELETE FROM cpq_contract_templates WHERE "companyId" = :company;
INSERT INTO cpq_contract_templates
  (id, "companyId", name, description, "contractType", "isActive", "isDefault", clauses,
   "defaultTermMonths", "usageCount", "createdBy", "createdAt", "updatedAt")
VALUES
  ('dcb00003-0000-4000-8000-000000000001', :company, 'Standard Equipment Supply Agreement', 'Default supply contract for kitchen equipment orders.', 'standard', true, true,
   '["dcb00004-0000-4000-8000-000000000001","dcb00004-0000-4000-8000-000000000002","dcb00004-0000-4000-8000-000000000003","dcb00004-0000-4000-8000-000000000005","dcb00004-0000-4000-8000-000000000008"]',
   12, 14, 'Suresh Patel', '2025-10-06 09:00:00', '2026-03-01 10:00:00'),
  ('dcb00003-0000-4000-8000-000000000002', :company, 'Master Supply Agreement (Multi-Site)', 'Framework agreement for franchise and hotel groups with call-off orders.', 'master_agreement', true, false,
   '["dcb00004-0000-4000-8000-000000000001","dcb00004-0000-4000-8000-000000000002","dcb00004-0000-4000-8000-000000000004","dcb00004-0000-4000-8000-000000000005","dcb00004-0000-4000-8000-000000000006","dcb00004-0000-4000-8000-000000000008"]',
   24, 5, 'Suresh Patel', '2025-10-06 09:30:00', '2025-10-06 09:30:00'),
  ('dcb00003-0000-4000-8000-000000000003', :company, 'Installation Services SOW', 'Statement of work for site installation and commissioning services.', 'sow', true, false,
   '["dcb00004-0000-4000-8000-000000000003","dcb00004-0000-4000-8000-000000000005","dcb00004-0000-4000-8000-000000000007"]',
   6, 8, 'Anita Desai', '2025-10-07 11:00:00', '2025-10-07 11:00:00'),
  ('dcb00003-0000-4000-8000-000000000004', :company, 'Service Contract Renewal', 'Renewal template for annual maintenance and service contracts.', 'renewal', true, false,
   '["dcb00004-0000-4000-8000-000000000002","dcb00004-0000-4000-8000-000000000007","dcb00004-0000-4000-8000-000000000008"]',
   12, 6, 'Suresh Patel', '2025-10-08 10:00:00', '2025-10-08 10:00:00'),
  ('dcb00003-0000-4000-8000-000000000005', :company, 'Contract Amendment', 'Amendment template for scope or pricing changes on live contracts.', 'amendment', true, false,
   '["dcb00004-0000-4000-8000-000000000001","dcb00004-0000-4000-8000-000000000006"]',
   0, 3, 'Suresh Patel', '2025-10-08 10:30:00', '2025-10-08 10:30:00');

-- ============================================================================
-- 7. Contract clauses
-- ============================================================================
DELETE FROM cpq_contract_clauses WHERE "companyId" = :company;
INSERT INTO cpq_contract_clauses
  (id, "companyId", name, content, category, tags, "clauseType", "isActive", "usageCount",
   "createdBy", "approvedBy", "createdAt", "updatedAt")
VALUES
  ('dcb00004-0000-4000-8000-000000000001', :company, 'Payment Terms', 'Invoices are due within thirty (30) days of invoice date unless otherwise stated on the order form. Late payments accrue interest at 1.5 percent per month.', 'Commercial', '["payment","finance"]', 'standard', true, 22, 'Suresh Patel', 'Meera Nair', '2025-10-05 09:00:00', '2025-10-05 09:00:00'),
  ('dcb00004-0000-4000-8000-000000000002', :company, 'Equipment Warranty', 'Seller warrants all equipment against defects in material and workmanship for twelve (12) months from commissioning or fifteen (15) months from delivery, whichever occurs first.', 'Warranty', '["warranty","service"]', 'standard', true, 20, 'Suresh Patel', 'Priya Sharma', '2025-10-05 09:10:00', '2025-10-05 09:10:00'),
  ('dcb00004-0000-4000-8000-000000000003', :company, 'Delivery and Risk of Loss', 'Delivery is DAP customer site. Risk of loss transfers on delivery; title transfers on payment in full. Delivery dates are estimates and subject to site readiness.', 'Logistics', '["delivery","incoterms"]', 'standard', true, 18, 'Suresh Patel', 'Priya Sharma', '2025-10-05 09:20:00', '2025-10-05 09:20:00'),
  ('dcb00004-0000-4000-8000-000000000004', :company, 'Volume Rebate Schedule', 'Buyer earns a rebate of 2 percent on annual call-off volume above 250,000 USD and 4 percent above 500,000 USD, credited quarterly in arrears.', 'Commercial', '["rebate","master-agreement"]', 'optional', true, 4, 'Amit Verma', 'Meera Nair', '2025-10-05 09:30:00', '2026-01-20 12:00:00'),
  ('dcb00004-0000-4000-8000-000000000005', :company, 'Limitation of Liability', 'Except for gross negligence or willful misconduct, aggregate liability of either party shall not exceed the total contract value. Neither party is liable for indirect or consequential damages.', 'Legal', '["liability"]', 'legal_required', true, 25, 'Suresh Patel', 'Suresh Patel', '2025-10-05 09:40:00', '2026-02-09 16:00:00'),
  ('dcb00004-0000-4000-8000-000000000006', :company, 'Termination for Convenience', 'Either party may terminate on ninety (90) days written notice. Buyer shall pay for all equipment delivered and work performed through the effective date of termination.', 'Legal', '["termination"]', 'legal_required', true, 9, 'Suresh Patel', 'Suresh Patel', '2025-10-05 09:50:00', '2025-10-05 09:50:00'),
  ('dcb00004-0000-4000-8000-000000000007', :company, 'Service Level — Response Times', 'For active service contracts, Seller responds to critical equipment failures within four (4) business hours and provides on-site attendance within one (1) business day in metro areas.', 'Service', '["sla","after-sales"]', 'optional', true, 7, 'Anita Desai', 'Priya Sharma', '2025-10-05 10:00:00', '2025-10-05 10:00:00'),
  ('dcb00004-0000-4000-8000-000000000008', :company, 'Confidentiality', 'Each party shall keep the terms of this agreement and any non-public information received from the other party confidential for a period of three (3) years after termination.', 'Legal', '["confidentiality"]', 'legal_required', true, 24, 'Suresh Patel', 'Suresh Patel', '2025-10-05 10:10:00', '2025-10-05 10:10:00');

-- ============================================================================
-- 8. Contracts
-- ============================================================================
DELETE FROM cpq_contracts WHERE "companyId" = :company;
INSERT INTO cpq_contracts
  (id, "companyId", "contractNumber", name, "customerId", "customerName", "quoteId", "proposalId", status,
   "templateId", "contractType", "totalValue", currency, "startDate", "endDate", "termMonths", "autoRenewal",
   "renewalNoticeDays", clauses, signatories, "createdBy", "approvedBy", "approvedAt", "approvalNotes",
   version, "createdAt", "updatedAt")
VALUES
  ('dcb00009-0000-4000-8000-000000000001', :company, 'DEMO-CTR-2026-001', 'Fjordline Cruises — Galley Fitout Supply', COALESCE((SELECT id::text FROM crm_leads WHERE company='Fjordline Cruises USA' LIMIT 1),'demo-lead-fjordline'), 'Fjordline Cruises USA',
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0001' LIMIT 1), 'dcb0000a-0000-4000-8000-000000000001', 'Active', 'dcb00003-0000-4000-8000-000000000001', 'standard', 415000, 'USD',
   '2025-12-15', '2026-12-14', 12, false, 60, '["dcb00004-0000-4000-8000-000000000001","dcb00004-0000-4000-8000-000000000002","dcb00004-0000-4000-8000-000000000003","dcb00004-0000-4000-8000-000000000005"]',
   '[{"name":"Ingrid Sorensen","role":"F&B Director","party":"customer","signedAt":"2025-12-10"},{"name":"Priya Sharma","role":"Sales Director","party":"seller","signedAt":"2025-12-09"}]',
   'Amit Verma', 'Priya Sharma', '2025-12-05 15:00:00', 'Approved after legal review of maritime supply terms.', 1, '2025-11-28 10:00:00', '2025-12-15 09:00:00'),
  ('dcb00009-0000-4000-8000-000000000002', :company, 'DEMO-CTR-2026-002', 'Metro Hospital Kitchens — Equipment Supply', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' AND "companyId"=:company LIMIT 1),'demo-cust-metro'), 'Metro Hospital Kitchens',
   NULL, NULL, 'Fully Signed', 'dcb00003-0000-4000-8000-000000000001', 'standard', 300000, 'USD',
   '2026-03-01', '2027-02-28', 12, true, 90, '["dcb00004-0000-4000-8000-000000000001","dcb00004-0000-4000-8000-000000000002","dcb00004-0000-4000-8000-000000000005","dcb00004-0000-4000-8000-000000000008"]',
   '[{"name":"Dr. Karen Ng","role":"Facilities Director","party":"customer","signedAt":"2026-02-20"},{"name":"Priya Sharma","role":"Sales Director","party":"seller","signedAt":"2026-02-19"}]',
   'Ravi Menon', 'Suresh Patel', '2026-02-12 11:00:00', 'Liability cap amended to 2x contract value with carve-outs.', 2, '2026-02-01 09:00:00', '2026-02-20 16:00:00'),
  ('dcb00009-0000-4000-8000-000000000003', :company, 'DEMO-CTR-2026-003', 'St. Aldric Medical — Kitchen Modernisation', COALESCE((SELECT id::text FROM crm_leads WHERE company='St. Aldric Medical Center' LIMIT 1),'demo-lead-staldric'), 'St. Aldric Medical Center',
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0004' LIMIT 1), NULL, 'Active', 'dcb00003-0000-4000-8000-000000000001', 'standard', 265000, 'USD',
   '2026-04-01', '2027-03-31', 12, false, 60, '["dcb00004-0000-4000-8000-000000000001","dcb00004-0000-4000-8000-000000000002","dcb00004-0000-4000-8000-000000000003","dcb00004-0000-4000-8000-000000000005"]',
   '[{"name":"Grace Kim","role":"COO","party":"customer","signedAt":"2026-03-25"},{"name":"Rajesh Kumar","role":"Sales Manager","party":"seller","signedAt":"2026-03-24"}]',
   'Ravi Menon', 'Rajesh Kumar', '2026-03-18 14:00:00', 'Standard terms; healthcare hygiene addendum attached.', 1, '2026-03-10 09:30:00', '2026-04-01 08:00:00'),
  ('dcb00009-0000-4000-8000-000000000004', :company, 'DEMO-CTR-2026-004', 'Golden Spoon Franchises — Master Supply Renewal', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' AND "companyId"=:company LIMIT 1),'demo-cust-goldenspoon'), 'Golden Spoon Franchises',
   NULL, NULL, 'Pending Approval', 'dcb00003-0000-4000-8000-000000000002', 'master_agreement', 480000, 'USD',
   '2026-10-01', '2028-09-30', 24, true, 90, '["dcb00004-0000-4000-8000-000000000001","dcb00004-0000-4000-8000-000000000002","dcb00004-0000-4000-8000-000000000004","dcb00004-0000-4000-8000-000000000005","dcb00004-0000-4000-8000-000000000006","dcb00004-0000-4000-8000-000000000008"]',
   '[{"name":"Priya Shah","role":"Head of Procurement","party":"customer"},{"name":"Vikram Singh","role":"VP Sales","party":"seller"}]',
   'Amit Verma', NULL, NULL, NULL, 3, '2026-08-25 10:00:00', '2026-09-02 09:45:00'),
  ('dcb00009-0000-4000-8000-000000000005', :company, 'DEMO-CTR-2026-005', 'Harbour Grill — Installation Services SOW', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' AND "companyId"=:company LIMIT 1),'demo-cust-harbourgrill'), 'Harbour Grill Restaurants',
   NULL, NULL, 'Sent for Signature', 'dcb00003-0000-4000-8000-000000000003', 'sow', 187500, 'USD',
   '2026-10-01', '2027-03-31', 6, false, 30, '["dcb00004-0000-4000-8000-000000000003","dcb00004-0000-4000-8000-000000000005","dcb00004-0000-4000-8000-000000000007"]',
   '[{"name":"Marcus Lee","role":"Head of Operations","party":"customer"},{"name":"Rajesh Kumar","role":"Sales Manager","party":"seller","signedAt":"2026-09-05"}]',
   'Kiran Reddy', 'Rajesh Kumar', '2026-09-04 13:00:00', 'Install schedule confirmed with ops.', 1, '2026-08-27 09:00:00', '2026-09-05 10:30:00'),
  ('dcb00009-0000-4000-8000-000000000006', :company, 'DEMO-CTR-2026-006', 'Blue Fig Hotels — Service Contract Draft', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' AND "companyId"=:company LIMIT 1),'demo-cust-bluefig'), 'Blue Fig Hotels Group',
   NULL, NULL, 'Draft', 'dcb00003-0000-4000-8000-000000000004', 'renewal', 96000, 'USD',
   '2027-01-01', '2027-12-31', 12, true, 60, '["dcb00004-0000-4000-8000-000000000002","dcb00004-0000-4000-8000-000000000007","dcb00004-0000-4000-8000-000000000008"]',
   NULL, 'Sunita Rao', NULL, NULL, NULL, 1, '2026-09-08 14:20:00', '2026-09-08 14:20:00');

-- ============================================================================
-- 9. Proposal templates
-- ============================================================================
DELETE FROM cpq_proposal_templates WHERE "companyId" = :company;
INSERT INTO cpq_proposal_templates
  (id, "companyId", name, description, category, "isActive", "isDefault", sections, styling,
   "defaultCoverLetter", "defaultFooter", "usageCount", "createdBy", "createdAt", "updatedAt")
VALUES
  ('dcb00010-0000-4000-8000-000000000001', :company, 'Standard Kitchen Proposal', 'Default proposal layout for single-site kitchen equipment deals.', 'Standard', true, true,
   '[{"order":1,"title":"Executive Summary"},{"order":2,"title":"Proposed Solution"},{"order":3,"title":"Equipment Schedule"},{"order":4,"title":"Pricing"},{"order":5,"title":"Delivery and Installation"},{"order":6,"title":"Terms"}]',
   '{"primaryColor":"#1f4e79","font":"Inter","logoPosition":"top-left"}', 'Thank you for the opportunity to propose a complete kitchen solution for your site.', 'B3 MACBIS — Commercial Kitchen Solutions', 19, 'Anita Desai', '2025-10-10 09:00:00', '2026-02-01 10:00:00'),
  ('dcb00010-0000-4000-8000-000000000002', :company, 'Enterprise Multi-Site Proposal', 'Layout for hotel groups and franchise chains with rollout plans.', 'Enterprise', true, false,
   '[{"order":1,"title":"Executive Summary"},{"order":2,"title":"Rollout Plan"},{"order":3,"title":"Standardised Equipment Packages"},{"order":4,"title":"Volume Pricing"},{"order":5,"title":"Service and SLA"},{"order":6,"title":"Case Studies"},{"order":7,"title":"Terms"}]',
   '{"primaryColor":"#0e2a47","font":"Inter","logoPosition":"top-center"}', 'We are pleased to present a standardised multi-site kitchen program.', 'B3 MACBIS — Commercial Kitchen Solutions', 6, 'Anita Desai', '2025-10-10 09:30:00', '2025-10-10 09:30:00'),
  ('dcb00010-0000-4000-8000-000000000003', :company, 'Healthcare Facility Proposal', 'Includes hygiene compliance and HACCP sections for hospitals and senior living.', 'Healthcare', true, false,
   '[{"order":1,"title":"Executive Summary"},{"order":2,"title":"Hygiene and HACCP Compliance"},{"order":3,"title":"Proposed Solution"},{"order":4,"title":"Pricing"},{"order":5,"title":"Service and SLA"},{"order":6,"title":"Terms"}]',
   '{"primaryColor":"#0f6d5c","font":"Inter","logoPosition":"top-left"}', 'Our proposal addresses your clinical nutrition and food-safety requirements.', 'B3 MACBIS — Commercial Kitchen Solutions', 4, 'Anita Desai', '2025-10-11 11:00:00', '2025-10-11 11:00:00'),
  ('dcb00010-0000-4000-8000-000000000004', :company, 'Marine and Cruise Proposal', 'Galley fitout layout with marine certification and weight schedules.', 'Marine', true, false,
   '[{"order":1,"title":"Executive Summary"},{"order":2,"title":"Galley Layout"},{"order":3,"title":"Marine Certifications"},{"order":4,"title":"Equipment Schedule"},{"order":5,"title":"Pricing"},{"order":6,"title":"Terms"}]',
   '{"primaryColor":"#123b5e","font":"Inter","logoPosition":"top-left"}', 'A complete galley program engineered for marine service conditions.', 'B3 MACBIS — Commercial Kitchen Solutions', 2, 'Anita Desai', '2025-10-12 10:00:00', '2025-10-12 10:00:00'),
  ('dcb00010-0000-4000-8000-000000000005', :company, 'Quick Quote Cover Proposal', 'Lightweight two-page proposal wrapper for small SMB quotes.', 'SMB', true, false,
   '[{"order":1,"title":"Summary"},{"order":2,"title":"Pricing"},{"order":3,"title":"Terms"}]',
   '{"primaryColor":"#333333","font":"Inter","logoPosition":"top-left"}', 'Please find our quotation summary below.', 'B3 MACBIS — Commercial Kitchen Solutions', 11, 'Kiran Reddy', '2025-10-12 10:30:00', '2025-10-12 10:30:00');

-- ============================================================================
-- 10. Proposals
-- ============================================================================
DELETE FROM cpq_proposals WHERE "companyId" = :company;
INSERT INTO cpq_proposals
  (id, "companyId", "proposalNumber", name, "customerId", "customerName", "quoteId", status, "templateId",
   "coverLetter", "executiveSummary", sections, "totalValue", currency, "proposalDate", "expirationDate",
   "validityDays", "requiresSignature", "viewCount", "lastViewedAt", "createdBy", "approvedBy", "approvedAt",
   "sentAt", "sentBy", "customerResponseAt", "customerFeedback", "createdAt", "updatedAt")
VALUES
  ('dcb0000a-0000-4000-8000-000000000001', :company, 'DEMO-PRP-2026-001', 'Fjordline Cruises — Full Galley Fitout', COALESCE((SELECT id::text FROM crm_leads WHERE company='Fjordline Cruises USA' LIMIT 1),'demo-lead-fjordline'), 'Fjordline Cruises USA',
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0001' LIMIT 1), 'Accepted', 'dcb00010-0000-4000-8000-000000000004',
   'Thank you for inviting B3 MACBIS to propose the galley program for your two refit vessels.', 'A complete marine-certified galley fitout covering hot line, cold rooms, warewashing and pastry sections, delivered dockside in two phases.',
   '[{"title":"Executive Summary"},{"title":"Galley Layout"},{"title":"Marine Certifications"},{"title":"Equipment Schedule"},{"title":"Pricing"},{"title":"Terms"}]',
   415000, 'USD', '2025-11-10', '2025-12-10', 30, true, 9, '2025-11-24 15:30:00', 'Amit Verma', 'Priya Sharma', '2025-11-09 17:00:00',
   '2025-11-10 09:00:00', 'Amit Verma', '2025-11-25 10:00:00', 'Accepted phase plan; requested dockside delivery windows be contractual.', '2025-11-07 09:00:00', '2025-11-25 10:05:00'),
  ('dcb0000a-0000-4000-8000-000000000002', :company, 'DEMO-PRP-2026-002', 'Aurelia Grand Hotel — Banquet Kitchen Refresh', COALESCE((SELECT id::text FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1),'demo-lead-aurelia'), 'Aurelia Grand Hotel',
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0002' LIMIT 1), 'Accepted', 'dcb00010-0000-4000-8000-000000000001',
   'We appreciate the walkthrough of your banquet operation and present the refreshed line below.', 'Replacement of the hot line and warewashing corridor with high-efficiency combi and conveyor systems, phased over closed weeks.',
   '[{"title":"Executive Summary"},{"title":"Proposed Solution"},{"title":"Equipment Schedule"},{"title":"Pricing"},{"title":"Delivery and Installation"},{"title":"Terms"}]',
   388000, 'USD', '2025-12-03', '2026-01-02', 30, true, 6, '2025-12-16 11:00:00', 'Kiran Reddy', 'Rajesh Kumar', '2025-12-02 16:00:00',
   '2025-12-03 09:30:00', 'Kiran Reddy', '2025-12-17 09:00:00', 'Signed after discount approval; install to start February.', '2025-12-01 15:00:00', '2025-12-17 09:05:00'),
  ('dcb0000a-0000-4000-8000-000000000003', :company, 'DEMO-PRP-2026-003', 'Lakeside Resort — Spa Cafe Kitchen', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' AND "companyId"=:company LIMIT 1),'demo-cust-lakeside'), 'Lakeside Resort & Spa',
   NULL, 'Viewed', 'dcb00010-0000-4000-8000-000000000001',
   'Following our site survey of the new spa wing, we propose the compact cafe kitchen below.', 'A compact all-electric cafe kitchen with induction line, blast chiller and undercounter refrigeration sized for the spa wing.',
   '[{"title":"Executive Summary"},{"title":"Proposed Solution"},{"title":"Equipment Schedule"},{"title":"Pricing"},{"title":"Delivery and Installation"},{"title":"Terms"}]',
   118000, 'USD', '2026-04-06', '2026-05-06', 30, false, 4, '2026-04-18 14:20:00', 'Anita Desai', 'Rajesh Kumar', '2026-04-03 16:00:00',
   '2026-04-06 10:00:00', 'Anita Desai', NULL, NULL, '2026-04-01 09:00:00', '2026-04-18 14:25:00'),
  ('dcb0000a-0000-4000-8000-000000000004', :company, 'DEMO-PRP-2026-004', 'St. Aldric Medical — Kitchen Modernisation', COALESCE((SELECT id::text FROM crm_leads WHERE company='St. Aldric Medical Center' LIMIT 1),'demo-lead-staldric'), 'St. Aldric Medical Center',
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0004' LIMIT 1), 'Accepted', 'dcb00010-0000-4000-8000-000000000003',
   'Thank you for the detailed brief on your patient meal service upgrade.', 'HACCP-compliant cook-chill line with combi ovens, blast chillers and tray-line refrigeration for 600 patient meals per service.',
   '[{"title":"Executive Summary"},{"title":"Hygiene and HACCP Compliance"},{"title":"Proposed Solution"},{"title":"Pricing"},{"title":"Service and SLA"},{"title":"Terms"}]',
   265000, 'USD', '2026-03-05', '2026-04-04', 30, true, 7, '2026-03-19 10:00:00', 'Ravi Menon', 'Rajesh Kumar', '2026-03-04 15:00:00',
   '2026-03-05 09:00:00', 'Ravi Menon', '2026-03-20 11:00:00', 'Accepted; contract signed late March.', '2026-03-02 10:00:00', '2026-03-20 11:05:00'),
  ('dcb0000a-0000-4000-8000-000000000005', :company, 'DEMO-PRP-2026-005', 'Northgate School District — Cafeteria Program', COALESCE((SELECT id::text FROM crm_leads WHERE company='Northgate School District' LIMIT 1),'demo-lead-northgate'), 'Northgate School District',
   NULL, 'Rejected', 'dcb00010-0000-4000-8000-000000000002',
   'We propose a standardised cafeteria equipment package across your six school sites.', 'Standardised serving lines, dishwashing systems and walk-in refrigeration across six sites with summer-break installation.',
   '[{"title":"Executive Summary"},{"title":"Rollout Plan"},{"title":"Standardised Equipment Packages"},{"title":"Volume Pricing"},{"title":"Service and SLA"},{"title":"Terms"}]',
   96000, 'USD', '2026-02-10', '2026-03-12', 30, false, 3, '2026-03-01 09:30:00', 'Ajay Pillai', 'Rajesh Kumar', '2026-02-09 14:00:00',
   '2026-02-10 08:30:00', 'Ajay Pillai', '2026-03-06 15:00:00', 'Lost to lower-priced regional bidder on the public tender.', '2026-02-05 11:00:00', '2026-03-06 15:05:00'),
  ('dcb0000a-0000-4000-8000-000000000006', :company, 'DEMO-PRP-2026-006', 'Bayside Convention Center — Banquet Kitchen Line', COALESCE((SELECT id::text FROM crm_leads WHERE company='Bayside Convention Center' LIMIT 1),'demo-lead-bayside'), 'Bayside Convention Center',
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0005' LIMIT 1), 'Sent', 'dcb00010-0000-4000-8000-000000000002',
   'Following the banquet capacity study, we present the full production kitchen line below.', 'High-throughput banquet production line rated for 3,000 covers, including cook-chill, holding and mobile service equipment.',
   '[{"title":"Executive Summary"},{"title":"Rollout Plan"},{"title":"Standardised Equipment Packages"},{"title":"Volume Pricing"},{"title":"Service and SLA"},{"title":"Terms"}]',
   410000, 'USD', '2026-08-24', '2026-09-23', 30, true, 2, '2026-09-02 16:40:00', 'Sunita Rao', 'Priya Sharma', '2026-08-23 17:00:00',
   '2026-08-24 09:00:00', 'Sunita Rao', NULL, NULL, '2026-08-20 10:00:00', '2026-09-02 16:45:00'),
  ('dcb0000a-0000-4000-8000-000000000007', :company, 'DEMO-PRP-2026-007', 'Riverside Bistro — Starter Kitchen Package', COALESCE((SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain' AND "companyId"=:company LIMIT 1),'demo-cust-riverside'), 'Riverside Bistro Chain',
   NULL, 'Draft', 'dcb00010-0000-4000-8000-000000000005',
   'Quotation summary for the Pike Street opening.', 'Starter package of range, fryer bank, prep refrigeration and warewashing for the new Pike Street location.',
   '[{"title":"Summary"},{"title":"Pricing"},{"title":"Terms"}]',
   52000, 'USD', '2026-09-09', '2026-10-09', 30, false, 0, NULL, 'Deepak Joshi', NULL, NULL,
   NULL, NULL, NULL, NULL, '2026-09-09 13:00:00', '2026-09-09 13:00:00');

-- ============================================================================
-- 11. Content library
-- ============================================================================
DELETE FROM cpq_content_library WHERE "companyId" = :company;
INSERT INTO cpq_content_library
  (id, "companyId", name, description, "contentType", category, tags, content, "fileUrl",
   "isActive", "usageCount", "createdBy", "createdAt", "updatedAt")
VALUES
  ('dcb00011-0000-4000-8000-000000000001', :company, 'Company Overview Block', 'Standard boilerplate introducing B3 MACBIS.', 'text_block', 'Boilerplate', '["intro","about"]',
   'B3 MACBIS designs, manufactures and installs commercial kitchen equipment for hospitality, healthcare, education and marine customers across North America.', NULL, true, 31, 'Anita Desai', '2025-10-14 09:00:00', '2025-10-14 09:00:00'),
  ('dcb00011-0000-4000-8000-000000000002', :company, 'Combi Oven Energy Savings Block', 'Value proposition for high-efficiency combi ovens.', 'text_block', 'Product', '["combi-oven","energy"]',
   'Our latest combi oven range reduces energy consumption by up to 28 percent versus conventional convection lines while cutting cook times by 15 percent.', NULL, true, 17, 'Anita Desai', '2025-10-14 09:20:00', '2026-01-15 10:00:00'),
  ('dcb00011-0000-4000-8000-000000000003', :company, 'Harbour Grill Case Study', 'Multi-site rollout case study with measured outcomes.', 'case_study', 'Case Study', '["hospitality","rollout"]',
   'Harbour Grill Restaurants standardised 12 kitchens on our combi and refrigeration platform, cutting service-call volume 34 percent in year one.', NULL, true, 12, 'Anita Desai', '2025-10-15 10:00:00', '2025-10-15 10:00:00'),
  ('dcb00011-0000-4000-8000-000000000004', :company, 'Metro Hospital Testimonial', 'Reference quote from healthcare facilities director.', 'testimonial', 'Testimonial', '["healthcare"]',
   'The cook-chill line was commissioned on schedule and passed our HACCP audit first time. — Dr. Karen Ng, Metro Hospital Kitchens', NULL, true, 8, 'Kiran Reddy', '2025-11-02 11:00:00', '2025-11-02 11:00:00'),
  ('dcb00011-0000-4000-8000-000000000005', :company, 'Warranty and Service Summary', 'One-paragraph summary of warranty and SLA coverage.', 'text_block', 'Service', '["warranty","sla"]',
   'All equipment carries a 12-month parts-and-labour warranty with optional service contracts offering 4-hour critical response in metro areas.', NULL, true, 23, 'Anita Desai', '2025-10-16 09:00:00', '2025-10-16 09:00:00'),
  ('dcb00011-0000-4000-8000-000000000006', :company, 'Stainless Fabrication Capability Sheet', 'PDF datasheet for custom stainless fabrication.', 'document', 'Product', '["fabrication","custom"]',
   NULL, '/demo-assets/cpq/fabrication-capability.pdf', true, 6, 'Anita Desai', '2025-10-20 14:00:00', '2025-10-20 14:00:00'),
  ('dcb00011-0000-4000-8000-000000000007', :company, 'Banquet Line Hero Image', 'Rendered hero image of the banquet production line.', 'image', 'Imagery', '["banquet","hero"]',
   NULL, '/demo-assets/cpq/banquet-line-hero.jpg', true, 14, 'Anita Desai', '2025-10-21 10:00:00', '2025-10-21 10:00:00'),
  ('dcb00011-0000-4000-8000-000000000008', :company, 'Galley Fitout Walkthrough Video', 'Three-minute walkthrough of a completed cruise galley.', 'video', 'Imagery', '["marine","galley"]',
   NULL, '/demo-assets/cpq/galley-walkthrough.mp4', true, 5, 'Amit Verma', '2025-11-28 15:00:00', '2025-11-28 15:00:00');

-- ============================================================================
-- 12. Document templates
-- ============================================================================
DELETE FROM cpq_document_templates WHERE "companyId" = :company;
INSERT INTO cpq_document_templates
  (id, "companyId", name, description, "documentType", content, sections, "isActive", "createdAt", "updatedAt")
VALUES
  ('dcb00005-0000-4000-8000-000000000001', :company, 'Quote PDF Layout', 'Default quote document with line items and totals.', 'quote',
   'Quote {{quoteNumber}} for {{customerName}} — total {{totalValue}} valid until {{expirationDate}}.',
   '[{"title":"Header","body":"{{companyLogo}} Quote {{quoteNumber}}"},{"title":"Line Items","body":"{{lineItemsTable}}"},{"title":"Totals","body":"{{totalsBlock}}"},{"title":"Terms","body":"{{standardTerms}}"}]',
   true, '2025-10-09 09:00:00', '2025-10-09 09:00:00'),
  ('dcb00005-0000-4000-8000-000000000002', :company, 'Proposal Document Layout', 'Long-form proposal document with cover letter.', 'proposal',
   'Proposal {{proposalNumber}} prepared for {{customerName}} on {{proposalDate}}.',
   '[{"title":"Cover Letter","body":"{{coverLetter}}"},{"title":"Executive Summary","body":"{{executiveSummary}}"},{"title":"Solution","body":"{{solutionSections}}"},{"title":"Pricing","body":"{{pricingTable}}"}]',
   true, '2025-10-09 09:30:00', '2025-10-09 09:30:00'),
  ('dcb00005-0000-4000-8000-000000000003', :company, 'Contract Document Layout', 'Contract rendering with clause library merge.', 'contract',
   'Agreement {{contractNumber}} between B3 MACBIS and {{customerName}} effective {{startDate}}.',
   '[{"title":"Parties","body":"{{partiesBlock}}"},{"title":"Clauses","body":"{{clauseList}}"},{"title":"Signatures","body":"{{signatureBlock}}"}]',
   true, '2025-10-09 10:00:00', '2026-02-01 09:00:00'),
  ('dcb00005-0000-4000-8000-000000000004', :company, 'Cover Letter', 'Standalone cover letter for printed packs.', 'cover_letter',
   'Dear {{contactName}}, please find enclosed our {{documentKind}} for {{customerName}}.',
   '[{"title":"Body","body":"{{letterBody}}"},{"title":"Signature","body":"{{senderBlock}}"}]',
   true, '2025-10-09 10:30:00', '2025-10-09 10:30:00'),
  ('dcb00005-0000-4000-8000-000000000005', :company, 'Site Survey Report', 'Custom template for pre-installation site survey output.', 'custom',
   'Site survey report for {{customerName}} — surveyed {{surveyDate}} by {{surveyorName}}.',
   '[{"title":"Site Conditions","body":"{{siteConditions}}"},{"title":"Utilities","body":"{{utilitiesTable}}"},{"title":"Recommendations","body":"{{recommendations}}"}]',
   true, '2025-11-05 11:00:00', '2025-11-05 11:00:00');

-- ============================================================================
-- 13. Generated documents
-- ============================================================================
DELETE FROM cpq_generated_documents WHERE "companyId" = :company;
INSERT INTO cpq_generated_documents
  (id, "companyId", "templateId", title, "documentType", "referenceId", "customerName", content, status,
   "generatedBy", "createdAt", "updatedAt")
VALUES
  ('dcb00012-0000-4000-8000-000000000001', :company, 'dcb00005-0000-4000-8000-000000000001', 'Quote QTE-DEMO-0001 — Fjordline Cruises', 'quote', 'QTE-DEMO-0001', 'Fjordline Cruises USA',
   'Quote QTE-DEMO-0001 for Fjordline Cruises USA — total 415,000 USD valid until 2025-12-10.', 'sent', 'Amit Verma', '2025-11-05 10:00:00', '2025-11-05 10:05:00'),
  ('dcb00012-0000-4000-8000-000000000002', :company, 'dcb00005-0000-4000-8000-000000000002', 'Proposal DEMO-PRP-2026-001 — Galley Fitout', 'proposal', 'DEMO-PRP-2026-001', 'Fjordline Cruises USA',
   'Proposal DEMO-PRP-2026-001 prepared for Fjordline Cruises USA on 2025-11-10.', 'signed', 'Amit Verma', '2025-11-10 08:45:00', '2025-11-25 10:10:00'),
  ('dcb00012-0000-4000-8000-000000000003', :company, 'dcb00005-0000-4000-8000-000000000003', 'Contract DEMO-CTR-2026-001 — Fjordline Supply', 'contract', 'DEMO-CTR-2026-001', 'Fjordline Cruises USA',
   'Agreement DEMO-CTR-2026-001 between B3 MACBIS and Fjordline Cruises USA effective 2025-12-15.', 'signed', 'Suresh Patel', '2025-12-08 14:00:00', '2025-12-10 16:00:00'),
  ('dcb00012-0000-4000-8000-000000000004', :company, 'dcb00005-0000-4000-8000-000000000002', 'Proposal DEMO-PRP-2026-004 — St. Aldric Medical', 'proposal', 'DEMO-PRP-2026-004', 'St. Aldric Medical Center',
   'Proposal DEMO-PRP-2026-004 prepared for St. Aldric Medical Center on 2026-03-05.', 'signed', 'Ravi Menon', '2026-03-05 08:30:00', '2026-03-20 11:10:00'),
  ('dcb00012-0000-4000-8000-000000000005', :company, 'dcb00005-0000-4000-8000-000000000005', 'Site Survey — Bayside Convention Center', 'custom', 'QTE-DEMO-0005', 'Bayside Convention Center',
   'Site survey report for Bayside Convention Center — surveyed 2026-08-12 by Ganesh Patil.', 'generated', 'Ganesh Patil', '2026-08-13 09:00:00', '2026-08-13 09:00:00'),
  ('dcb00012-0000-4000-8000-000000000006', :company, 'dcb00005-0000-4000-8000-000000000002', 'Proposal DEMO-PRP-2026-006 — Bayside Banquet Line', 'proposal', 'DEMO-PRP-2026-006', 'Bayside Convention Center',
   'Proposal DEMO-PRP-2026-006 prepared for Bayside Convention Center on 2026-08-24.', 'sent', 'Sunita Rao', '2026-08-24 08:50:00', '2026-08-24 09:05:00'),
  ('dcb00012-0000-4000-8000-000000000007', :company, 'dcb00005-0000-4000-8000-000000000004', 'Cover Letter — Riverside Bistro Pack', 'cover_letter', 'DEMO-PRP-2026-007', 'Riverside Bistro Chain',
   'Dear Tom Becker, please find enclosed our proposal for Riverside Bistro Chain.', 'draft', 'Deepak Joshi', '2026-09-09 13:10:00', '2026-09-09 13:10:00');

-- ============================================================================
-- 14. Sales playbooks
-- ============================================================================
DELETE FROM cpq_sales_playbooks WHERE "companyId" = :company;
INSERT INTO cpq_sales_playbooks
  (id, "companyId", name, description, industry, "customerSegment", "productCategory", stages,
   "talkingPoints", "competitiveInsights", "successMetrics", "isActive", "usageCount", "createdBy",
   "createdAt", "updatedAt")
VALUES
  ('dcb0000b-0000-4000-8000-000000000001', :company, 'Hotel and Resort Kitchen Playbook', 'Selling motion for hotel groups replacing banquet and all-day-dining kitchens.', 'Hospitality', 'Enterprise', 'Cooking Equipment',
   '[{"stage":"Discovery","goals":["map covers per service","identify closure windows"]},{"stage":"Site Survey","goals":["utilities audit","layout constraints"]},{"stage":"Proposal","goals":["phased install plan","energy savings model"]},{"stage":"Negotiation","goals":["service SLA","payment milestones"]},{"stage":"Close","goals":["contract signature","install kickoff"]}]',
   '["Lead with energy savings per cover","Phased installs avoid revenue loss during closures"]', '["Competitor X discounts hardware but charges premium install rates"]', '{"targetWinRate":45,"targetCycleDays":60}', true, 12, 'Priya Sharma', '2025-10-18 09:00:00', '2026-01-05 10:00:00'),
  ('dcb0000b-0000-4000-8000-000000000002', :company, 'Healthcare Cook-Chill Playbook', 'Motion for hospitals and senior living moving to cook-chill production.', 'Healthcare', 'Enterprise', 'Cook-Chill Systems',
   '[{"stage":"Discovery","goals":["patient meal volumes","HACCP audit dates"]},{"stage":"Compliance Review","goals":["hygiene requirements","dietitian sign-off"]},{"stage":"Proposal","goals":["tray-line design","SLA commitments"]},{"stage":"Close","goals":["board approval","contract signature"]}]',
   '["First-time HACCP pass rate is the strongest reference point"]', '["Regional integrators lack clinical references"]', '{"targetWinRate":50,"targetCycleDays":90}', true, 7, 'Priya Sharma', '2025-10-18 09:30:00', '2025-10-18 09:30:00'),
  ('dcb0000b-0000-4000-8000-000000000003', :company, 'Marine Galley Playbook', 'Cruise and ferry galley fitout selling motion with certification focus.', 'Cruise', 'Enterprise', 'Galley Systems',
   '[{"stage":"Discovery","goals":["vessel refit schedule","classification society"]},{"stage":"Engineering","goals":["weight schedule","certification matrix"]},{"stage":"Proposal","goals":["dockside logistics plan"]},{"stage":"Close","goals":["milestone payment plan"]}]',
   '["Certification paperwork turnaround is the differentiator"]', '["Few competitors hold marine certifications for full galley scope"]', '{"targetWinRate":40,"targetCycleDays":120}', true, 3, 'Amit Verma', '2025-10-19 10:00:00', '2025-10-19 10:00:00'),
  ('dcb0000b-0000-4000-8000-000000000004', :company, 'SMB Restaurant Quick-Close Playbook', 'Short-cycle motion for independent restaurants and small chains.', 'Restaurant', 'SMB', 'Cooking Equipment',
   '[{"stage":"Qualify","goals":["budget confirmed","opening date"]},{"stage":"Quote","goals":["same-week quote","financing options"]},{"stage":"Close","goals":["deposit collected"]}]',
   '["Offer financing early","Bundle install and first-year service"]', '["Online resellers win on price but not on install"]', '{"targetWinRate":35,"targetCycleDays":21}', true, 18, 'Rajesh Kumar', '2025-10-20 11:00:00', '2026-04-10 09:00:00'),
  ('dcb0000b-0000-4000-8000-000000000005', :company, 'Education Tender Playbook', 'Public tender motion for school districts and universities.', 'Education', 'Mid-Market', 'Serving Lines',
   '[{"stage":"Tender Watch","goals":["RFP monitoring"]},{"stage":"Bid","goals":["compliance matrix complete","references attached"]},{"stage":"Award","goals":["summer install window secured"]}]',
   '["Emphasise summer-break installation track record"]', '["Public tenders are price-weighted; keep spec-in strategy upstream"]', '{"targetWinRate":25,"targetCycleDays":150}', true, 4, 'Ajay Pillai', '2025-10-21 09:00:00', '2025-10-21 09:00:00');

-- ============================================================================
-- 15. Sales questionnaires
-- ============================================================================
DELETE FROM cpq_sales_questionnaires WHERE "companyId" = :company;
INSERT INTO cpq_sales_questionnaires
  (id, "companyId", name, description, industry, "productCategory", questions, "scoringRules",
   "outcomeMapping", "isActive", "completionCount", "createdBy", "createdAt", "updatedAt")
VALUES
  ('dcb00006-0000-4000-8000-000000000001', :company, 'Kitchen Needs Assessment', 'General discovery questionnaire for any commercial kitchen opportunity.', NULL, NULL,
   '[{"id":"q1","text":"How many covers per peak service?","type":"number"},{"id":"q2","text":"Gas, electric or mixed utilities?","type":"choice","options":["gas","electric","mixed"]},{"id":"q3","text":"Target installation window?","type":"text"},{"id":"q4","text":"Existing equipment brands on site?","type":"text"}]',
   '{"q1":{"gt":500,"score":30},"q2":{"electric":10}}', '{"scoreGte":30,"recommend":"high-capacity-line"}', true, 24, 'Anita Desai', '2025-10-22 09:00:00', '2025-10-22 09:00:00'),
  ('dcb00006-0000-4000-8000-000000000002', :company, 'Banquet Capacity Profiler', 'Sizes banquet production lines for hotels and convention centers.', 'Hospitality', 'Cooking Equipment',
   '[{"id":"q1","text":"Maximum simultaneous banquet covers?","type":"number"},{"id":"q2","text":"Number of function rooms?","type":"number"},{"id":"q3","text":"Cook-chill capability required?","type":"boolean"}]',
   '{"q1":{"gt":1000,"score":40},"q3":{"true":20}}', '{"scoreGte":40,"recommend":"banquet-production-line"}', true, 9, 'Anita Desai', '2025-10-22 10:00:00', '2025-10-22 10:00:00'),
  ('dcb00006-0000-4000-8000-000000000003', :company, 'Healthcare Meal Service Profiler', 'Captures clinical meal volumes and compliance needs.', 'Healthcare', 'Cook-Chill Systems',
   '[{"id":"q1","text":"Patient meals per day?","type":"number"},{"id":"q2","text":"Tray-line or room service model?","type":"choice","options":["tray-line","room-service","hybrid"]},{"id":"q3","text":"Next HACCP audit date?","type":"date"}]',
   '{"q1":{"gt":1000,"score":35}}', '{"scoreGte":35,"recommend":"cook-chill-line"}', true, 6, 'Ravi Menon', '2025-10-23 11:00:00', '2025-10-23 11:00:00'),
  ('dcb00006-0000-4000-8000-000000000004', :company, 'Marine Galley Scoping', 'Vessel-specific scoping for cruise and ferry galleys.', 'Cruise', 'Galley Systems',
   '[{"id":"q1","text":"Passenger capacity?","type":"number"},{"id":"q2","text":"Classification society?","type":"text"},{"id":"q3","text":"Refit window in days?","type":"number"}]',
   '{"q1":{"gt":2000,"score":50}}', '{"scoreGte":50,"recommend":"full-galley-fitout"}', true, 2, 'Amit Verma', '2025-10-24 09:00:00', '2025-10-24 09:00:00'),
  ('dcb00006-0000-4000-8000-000000000005', :company, 'SMB Opening Checklist', 'Quick qualifier for new restaurant openings.', 'Restaurant', 'Cooking Equipment',
   '[{"id":"q1","text":"Opening date?","type":"date"},{"id":"q2","text":"Equipment budget in USD?","type":"number"},{"id":"q3","text":"Financing required?","type":"boolean"}]',
   '{"q2":{"gt":50000,"score":20}}', '{"scoreGte":20,"recommend":"starter-package-plus"}', true, 15, 'Deepak Joshi', '2025-10-25 10:00:00', '2025-10-25 10:00:00');

-- ============================================================================
-- 16. Questionnaire responses
-- ============================================================================
DELETE FROM cpq_questionnaire_responses WHERE "companyId" = :company;
INSERT INTO cpq_questionnaire_responses
  (id, "companyId", "questionnaireId", "customerId", "quoteId", responses, "totalScore",
   "recommendedProducts", "recommendedBundles", "completedBy", "createdAt")
VALUES
  ('dcb00013-0000-4000-8000-000000000001', :company, 'dcb00006-0000-4000-8000-000000000004', (SELECT id::text FROM crm_leads WHERE company='Fjordline Cruises USA' LIMIT 1),
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0001' LIMIT 1),
   '{"q1":2400,"q2":"DNV","q3":45}', 50, '["dc9a0000-0000-4000-8000-000000000001","dc9a0000-0000-4000-8000-000000000003"]', '["full-galley-fitout"]', 'Amit Verma', '2025-10-28 14:00:00'),
  ('dcb00013-0000-4000-8000-000000000002', :company, 'dcb00006-0000-4000-8000-000000000002', (SELECT id::text FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1),
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0002' LIMIT 1),
   '{"q1":1500,"q2":6,"q3":true}', 60, '["dc9a0000-0000-4000-8000-000000000001","dc9a0000-0000-4000-8000-000000000002"]', '["banquet-production-line"]', 'Kiran Reddy', '2025-11-18 10:30:00'),
  ('dcb00013-0000-4000-8000-000000000003', :company, 'dcb00006-0000-4000-8000-000000000003', (SELECT id::text FROM crm_leads WHERE company='St. Aldric Medical Center' LIMIT 1),
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0004' LIMIT 1),
   '{"q1":1800,"q2":"tray-line","q3":"2026-06-15"}', 35, '["dc9a0000-0000-4000-8000-000000000002","dc9a0000-0000-4000-8000-000000000004"]', '["cook-chill-line"]', 'Ravi Menon', '2026-02-12 11:00:00'),
  ('dcb00013-0000-4000-8000-000000000004', :company, 'dcb00006-0000-4000-8000-000000000002', (SELECT id::text FROM crm_leads WHERE company='Bayside Convention Center' LIMIT 1),
   (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0005' LIMIT 1),
   '{"q1":3000,"q2":11,"q3":true}', 60, '["dc9a0000-0000-4000-8000-000000000001","dc9a0000-0000-4000-8000-000000000005"]', '["banquet-production-line"]', 'Sunita Rao', '2026-08-11 15:00:00'),
  ('dcb00013-0000-4000-8000-000000000005', :company, 'dcb00006-0000-4000-8000-000000000005', (SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain' AND "companyId"=:company LIMIT 1),
   NULL, '{"q1":"2026-11-01","q2":55000,"q3":true}', 20, '["dc9a0000-0000-4000-8000-000000000006"]', '["starter-package-plus"]', 'Deepak Joshi', '2026-09-05 09:40:00'),
  ('dcb00013-0000-4000-8000-000000000006', :company, 'dcb00006-0000-4000-8000-000000000001', (SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' AND "companyId"=:company LIMIT 1),
   NULL, '{"q1":350,"q2":"electric","q3":"Q2 2026","q4":"Legacy convection, aging walk-in"}', 10, '["dc9a0000-0000-4000-8000-000000000004"]', NULL, 'Anita Desai', '2026-03-15 13:20:00');

-- ============================================================================
-- 17. Recommendation rules
-- ============================================================================
DELETE FROM cpq_recommendation_rules WHERE "companyId" = :company;
INSERT INTO cpq_recommendation_rules
  (id, "companyId", name, description, "recommendationType", "sourceProductId", "sourceProductCategory",
   "recommendedProducts", conditions, "minConfidenceScore", priority, "isActive", "impressionCount",
   "clickCount", "conversionCount", "createdBy", "createdAt", "updatedAt")
VALUES
  ('dcb00007-0000-4000-8000-000000000001', :company, 'Combi Oven → Blast Chiller', 'Cook-chill pairing: combi oven buyers need rapid chilling.', 'cross_sell', 'dc9a0000-0000-4000-8000-000000000001', 'Cooking Equipment',
   '["dc9a0000-0000-4000-8000-000000000002"]', '{"minQuoteValue":25000}', 60.00, 10, true, 342, 88, 27, 'Anita Desai', '2025-10-26 09:00:00', '2026-06-01 10:00:00'),
  ('dcb00007-0000-4000-8000-000000000002', :company, 'Combi Oven Upgrade Path', 'Suggest the larger 20-grid unit when banquet covers exceed 800.', 'up_sell', 'dc9a0000-0000-4000-8000-000000000001', 'Cooking Equipment',
   '["dc9a0000-0000-4000-8000-000000000003"]', '{"minCovers":800}', 70.00, 20, true, 210, 45, 12, 'Anita Desai', '2025-10-26 09:15:00', '2025-10-26 09:15:00'),
  ('dcb00007-0000-4000-8000-000000000003', :company, 'Warewashing With Any Hot Line', 'Dish systems frequently bought with full cooking lines.', 'frequently_bought', NULL, 'Cooking Equipment',
   '["dc9a0000-0000-4000-8000-000000000005"]', NULL, 50.00, 30, true, 415, 96, 31, 'Rajesh Kumar', '2025-10-27 10:00:00', '2025-10-27 10:00:00'),
  ('dcb00007-0000-4000-8000-000000000004', :company, 'Refrigeration Alternative — Energy Class', 'Offer the high-efficiency walk-in as a similar product to the standard unit.', 'similar_products', 'dc9a0000-0000-4000-8000-000000000004', 'Refrigeration',
   '["dc9a0000-0000-4000-8000-000000000007"]', '{"customerSegment":["Enterprise","Mid-Market"]}', 55.00, 40, true, 128, 22, 6, 'Anita Desai', '2025-11-03 11:00:00', '2025-11-03 11:00:00'),
  ('dcb00007-0000-4000-8000-000000000005', :company, 'Service Contract Attach', 'Attach first-year service contract to every equipment quote above 50k.', 'custom', NULL, NULL,
   '["dc9a0000-0000-4000-8000-000000000008"]', '{"minQuoteValue":50000}', 40.00, 50, true, 505, 140, 58, 'Priya Sharma', '2025-11-04 09:00:00', '2026-03-01 12:00:00'),
  ('dcb00007-0000-4000-8000-000000000006', :company, 'Blast Chiller → Cold Room Cross-sell', 'Cold-chain completion for cook-chill adopters.', 'cross_sell', 'dc9a0000-0000-4000-8000-000000000002', 'Refrigeration',
   '["dc9a0000-0000-4000-8000-000000000004","dc9a0000-0000-4000-8000-000000000007"]', NULL, 45.00, 60, true, 96, 18, 4, 'Anita Desai', '2025-12-02 10:00:00', '2025-12-02 10:00:00');

-- ============================================================================
-- 18. Recommendations (customer-facing suggestion list)
-- ============================================================================
DELETE FROM cpq_recommendations WHERE "companyId" = :company;
INSERT INTO cpq_recommendations
  (id, "companyId", "customerId", "customerName", segment, "productCode", "productName", category,
   "recommendationType", "confidenceScore", "estimatedValue", reason, "basedOn", priority, "aiGenerated",
   "acceptanceRate", "expiresDate", "createdAt", "updatedAt")
VALUES
  ('dcb00014-0000-4000-8000-000000000001', :company, (SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' AND "companyId"=:company LIMIT 1), 'Harbour Grill Restaurants', 'Enterprise', 'DEMO-CPQ-P01', '20-Grid Combi Oven', 'Cooking Equipment',
   'upgrade', 82.50, 96000, 'Site 4 and 7 exceed 800 covers per service; larger grid capacity reduces batch count.', 'Order history and covers data', 'high', true, 64.00, '2026-11-30 00:00:00', '2026-06-10 09:00:00', '2026-06-10 09:00:00'),
  ('dcb00014-0000-4000-8000-000000000002', :company, (SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' AND "companyId"=:company LIMIT 1), 'Blue Fig Hotels Group', 'Enterprise', 'DEMO-CPQ-P05', 'Rack Conveyor Dishwasher', 'Warewashing',
   'frequently-bought', 74.00, 58000, 'Banquet line customers typically pair with rack conveyor warewashing.', 'Basket analysis of 40 similar deals', 'medium', true, 58.00, '2026-12-31 00:00:00', '2026-07-01 10:00:00', '2026-07-01 10:00:00'),
  ('dcb00014-0000-4000-8000-000000000003', :company, (SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' AND "companyId"=:company LIMIT 1), 'Metro Hospital Kitchens', 'Enterprise', 'DEMO-CPQ-P02', 'Roll-In Blast Chiller', 'Refrigeration',
   'best-match', 88.00, 42000, 'Cook-chill volumes from the tray-line profiler indicate a second blast chiller is needed.', 'Questionnaire response 2026-02', 'high', true, 71.00, '2026-10-31 00:00:00', '2026-03-01 11:00:00', '2026-03-01 11:00:00'),
  ('dcb00014-0000-4000-8000-000000000004', :company, (SELECT id::text FROM crm_customers WHERE "customerName"='Summit Catering Services' AND "companyId"=:company LIMIT 1), 'Summit Catering Services', 'Mid-Market', 'DEMO-CPQ-P08', 'Annual Service Contract', 'Services',
   'best-match', 65.00, 12000, 'Fleet of 31 installed units is out of warranty next quarter.', 'Install base warranty expiry', 'medium', false, 52.00, '2026-12-15 00:00:00', '2026-08-01 09:30:00', '2026-08-01 09:30:00'),
  ('dcb00014-0000-4000-8000-000000000005', :company, (SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' AND "companyId"=:company LIMIT 1), 'Golden Spoon Franchises', 'Enterprise', 'DEMO-CPQ-P06', 'Compact Fry Station', 'Cooking Equipment',
   'trending', 59.00, 84000, 'Franchise segment adoption of the compact fry station is up 40 percent this quarter.', 'Segment trend analysis', 'low', true, 38.00, '2026-11-15 00:00:00', '2026-08-20 14:00:00', '2026-08-20 14:00:00'),
  ('dcb00014-0000-4000-8000-000000000006', :company, (SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' AND "companyId"=:company LIMIT 1), 'Lakeside Resort & Spa', 'Mid-Market', 'DEMO-CPQ-P07', 'High-Efficiency Walk-In Cold Room', 'Refrigeration',
   'alternative', 61.50, 27000, 'Energy-class alternative to the standard walk-in quoted for the spa cafe.', 'Rule: refrigeration alternative energy class', 'medium', false, 44.00, '2026-10-15 00:00:00', '2026-04-10 10:00:00', '2026-04-10 10:00:00'),
  ('dcb00014-0000-4000-8000-000000000007', :company, (SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' AND "companyId"=:company LIMIT 1), 'Campus Dining Co-op', 'Mid-Market', 'DEMO-CPQ-P05', 'Rack Conveyor Dishwasher', 'Warewashing',
   'best-match', 79.00, 61000, 'Peak-hour tray volumes exceed current flight-type capacity at two dining halls.', 'Utilisation telemetry', 'high', true, 66.00, '2026-12-01 00:00:00', '2026-09-01 09:00:00', '2026-09-01 09:00:00'),
  ('dcb00014-0000-4000-8000-000000000008', :company, (SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain' AND "companyId"=:company LIMIT 1), 'Riverside Bistro Chain', 'SMB', 'DEMO-CPQ-P08', 'Annual Service Contract', 'Services',
   'frequently-bought', 55.00, 4800, 'SMB buyers attaching first-year service renew at 80 percent.', 'Basket analysis SMB cohort', 'low', false, 49.00, '2026-11-01 00:00:00', '2026-09-06 10:30:00', '2026-09-06 10:30:00');

-- ============================================================================
-- 19. Recommendation events (impression → click → add_to_quote → purchase funnel)
-- ============================================================================
DELETE FROM cpq_recommendation_events WHERE "companyId" = :company;
INSERT INTO cpq_recommendation_events
  (id, "companyId", "recommendationRuleId", "sourceProductId", "recommendedProductId", "recommendationType",
   "eventType", "customerId", "quoteId", "sessionId", "revenueGenerated", "userId", "createdAt")
VALUES
  ('dcb00015-0000-4000-8000-000000000001', :company, 'dcb00007-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000002', 'cross_sell', 'impression',
   (SELECT id::text FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0002' LIMIT 1), 'DEMO-SESS-1001', NULL, 'Kiran Reddy', '2025-11-20 10:12:00'),
  ('dcb00015-0000-4000-8000-000000000002', :company, 'dcb00007-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000002', 'cross_sell', 'click',
   (SELECT id::text FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0002' LIMIT 1), 'DEMO-SESS-1001', NULL, 'Kiran Reddy', '2025-11-20 10:13:30'),
  ('dcb00015-0000-4000-8000-000000000003', :company, 'dcb00007-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000002', 'cross_sell', 'add_to_quote',
   (SELECT id::text FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0002' LIMIT 1), 'DEMO-SESS-1001', NULL, 'Kiran Reddy', '2025-11-20 10:16:00'),
  ('dcb00015-0000-4000-8000-000000000004', :company, 'dcb00007-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000002', 'cross_sell', 'purchase',
   (SELECT id::text FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0002' LIMIT 1), 'DEMO-SESS-1001', 42000, 'Kiran Reddy', '2025-12-17 09:10:00'),
  ('dcb00015-0000-4000-8000-000000000005', :company, 'dcb00007-0000-4000-8000-000000000002', 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000003', 'up_sell', 'impression',
   (SELECT id::text FROM crm_leads WHERE company='Bayside Convention Center' LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0005' LIMIT 1), 'DEMO-SESS-1002', NULL, 'Sunita Rao', '2026-08-12 11:05:00'),
  ('dcb00015-0000-4000-8000-000000000006', :company, 'dcb00007-0000-4000-8000-000000000002', 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000003', 'up_sell', 'add_to_quote',
   (SELECT id::text FROM crm_leads WHERE company='Bayside Convention Center' LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0005' LIMIT 1), 'DEMO-SESS-1002', NULL, 'Sunita Rao', '2026-08-12 11:20:00'),
  ('dcb00015-0000-4000-8000-000000000007', :company, 'dcb00007-0000-4000-8000-000000000006', 'dc9a0000-0000-4000-8000-000000000002', 'dc9a0000-0000-4000-8000-000000000004', 'cross_sell', 'impression',
   (SELECT id::text FROM crm_leads WHERE company='St. Aldric Medical Center' LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0004' LIMIT 1), 'DEMO-SESS-1003', NULL, 'Ravi Menon', '2026-02-20 14:00:00'),
  ('dcb00015-0000-4000-8000-000000000008', :company, 'dcb00007-0000-4000-8000-000000000006', 'dc9a0000-0000-4000-8000-000000000002', 'dc9a0000-0000-4000-8000-000000000004', 'cross_sell', 'click',
   (SELECT id::text FROM crm_leads WHERE company='St. Aldric Medical Center' LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0004' LIMIT 1), 'DEMO-SESS-1003', NULL, 'Ravi Menon', '2026-02-20 14:02:00'),
  ('dcb00015-0000-4000-8000-000000000009', :company, 'dcb00007-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000002', 'cross_sell', 'impression',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' AND "companyId"=:company LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0006' LIMIT 1), 'DEMO-SESS-1004', NULL, 'Ajay Pillai', '2026-09-05 15:30:00'),
  ('dcb00015-0000-4000-8000-00000000000a', :company, 'dcb00007-0000-4000-8000-000000000002', 'dc9a0000-0000-4000-8000-000000000001', 'dc9a0000-0000-4000-8000-000000000003', 'up_sell', 'click',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' AND "companyId"=:company LIMIT 1), (SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0006' LIMIT 1), 'DEMO-SESS-1004', NULL, 'Ajay Pillai', '2026-09-05 15:34:00');

-- ============================================================================
-- 20. Integrations
-- ============================================================================
DELETE FROM cpq_integrations WHERE "companyId" = :company;
INSERT INTO cpq_integrations
  (id, "companyId", name, "integrationType", provider, "isActive", configuration, "fieldMappings",
   "lastSyncAt", "lastSyncStatus", "lastSyncError", "createdBy", "createdAt", "updatedAt")
VALUES
  ('dcb00008-0000-4000-8000-000000000001', :company, 'CRM Sync', 'crm', 'B3 CRM Module', true,
   '{"baseUrl":"/api/crm","syncIntervalMinutes":30,"entities":["customers","leads","opportunities"]}',
   '{"customerName":"crm.customerName","accountManager":"crm.accountManager"}', '2026-09-10 06:30:00', 'success', NULL, 'Sanjay Malhotra', '2025-10-15 09:00:00', '2026-09-10 06:30:00'),
  ('dcb00008-0000-4000-8000-000000000002', :company, 'ERP Order Push', 'erp', 'B3 ERP Core', true,
   '{"baseUrl":"/api/sales","pushOn":"quote_accepted","entities":["orders","invoices"]}',
   '{"quoteNumber":"erp.sourceQuoteRef","totalValue":"erp.orderValue"}', '2026-09-09 22:00:00', 'success', NULL, 'Sanjay Malhotra', '2025-10-15 09:30:00', '2026-09-09 22:00:00'),
  ('dcb00008-0000-4000-8000-000000000003', :company, 'CAD Layout Import', 'cad', 'KitchenCAD Pro', true,
   '{"importFormats":["dwg","dxf"],"autoBom":true}',
   '{"blockName":"cpq.productCode","quantity":"cpq.quantity"}', '2026-09-08 17:45:00', 'failed', 'Layout revision K-204 contains 3 unmapped equipment blocks.', 'Sanjay Malhotra', '2025-11-01 10:00:00', '2026-09-08 17:45:00'),
  ('dcb00008-0000-4000-8000-000000000004', :company, 'E-Signature Service', 'esignature', 'SignEasy Enterprise', true,
   '{"webhookUrl":"/api/cpq/esign/callback","reminderDays":3}',
   '{"proposalNumber":"envelope.reference","signedBy":"envelope.signerName"}', '2026-09-05 12:10:00', 'success', NULL, 'Sanjay Malhotra', '2025-11-10 11:00:00', '2026-09-05 12:10:00'),
  ('dcb00008-0000-4000-8000-000000000005', :company, 'Dealer Portal Storefront', 'ecommerce', 'B3 Dealer Portal', false,
   '{"catalogSync":true,"priceListId":"DEALER-2026"}',
   '{"productCode":"portal.sku","listPrice":"portal.price"}', NULL, 'never', NULL, 'Sanjay Malhotra', '2026-02-01 09:00:00', '2026-02-01 09:00:00');

-- ============================================================================
-- 21. Integration endpoints (per-system connected endpoints)
-- ============================================================================
DELETE FROM cpq_integration_endpoints WHERE "companyId" = :company;
INSERT INTO cpq_integration_endpoints
  (id, "companyId", system, name, type, status, version, "lastSync", "recordCount", metadata, "createdAt", "updatedAt")
VALUES
  ('dcb00016-0000-4000-8000-000000000001', :company, 'cad', 'KitchenCAD Layout Server', 'REST API', 'connected', 'v4.2', '2026-09-08 17:45', 152,
   '{"formats":["dwg","dxf"],"lastImport":"K-204"}', '2025-11-01 10:05:00', '2026-09-08 17:50:00'),
  ('dcb00016-0000-4000-8000-000000000002', :company, 'cad', 'BOM Extraction Service', 'Webhook', 'error', 'v1.8', '2026-09-08 17:45', 47,
   '{"lastError":"3 unmapped equipment blocks in K-204"}', '2025-11-01 10:10:00', '2026-09-08 17:50:00'),
  ('dcb00016-0000-4000-8000-000000000003', :company, 'erp', 'Sales Order Push', 'REST API', 'connected', 'v2.0', '2026-09-09 22:00', 89,
   '{"pushTrigger":"quote_accepted"}', '2025-10-15 09:35:00', '2026-09-09 22:05:00'),
  ('dcb00016-0000-4000-8000-000000000004', :company, 'erp', 'Inventory Availability Feed', 'GraphQL', 'connected', 'v2.0', '2026-09-10 05:00', 1240,
   '{"pollIntervalMinutes":60}', '2025-10-15 09:40:00', '2026-09-10 05:05:00'),
  ('dcb00016-0000-4000-8000-000000000005', :company, 'ecommerce', 'Dealer Portal Catalog', 'REST API', 'disconnected', 'v1.0', NULL, 0,
   '{"activation":"pending price list approval"}', '2026-02-01 09:05:00', '2026-02-01 09:05:00'),
  ('dcb00016-0000-4000-8000-000000000006', :company, 'ecommerce', 'Dealer Order Intake', 'Webhook', 'disconnected', 'v1.0', NULL, 0,
   '{"activation":"pending portal go-live"}', '2026-02-01 09:10:00', '2026-02-01 09:10:00');

-- ============================================================================
-- 22. Integration sync logs
-- ============================================================================
DELETE FROM cpq_integration_sync_logs WHERE "companyId" = :company;
INSERT INTO cpq_integration_sync_logs
  (id, "companyId", system, operation, records, status, duration, message, "createdAt", "updatedAt")
VALUES
  ('dcb00017-0000-4000-8000-000000000001', :company, 'crm', 'Customer sync', 8, 'success', '2.4s', 'Synced 8 customers, 0 conflicts.', '2026-09-10 06:30:00', '2026-09-10 06:30:00'),
  ('dcb00017-0000-4000-8000-000000000002', :company, 'crm', 'Lead sync', 60, 'success', '4.1s', 'Synced 60 leads including 11 closed records.', '2026-09-10 06:31:00', '2026-09-10 06:31:00'),
  ('dcb00017-0000-4000-8000-000000000003', :company, 'erp', 'Order push', 2, 'success', '1.2s', 'Pushed 2 accepted quotes as sales orders.', '2026-09-09 22:00:00', '2026-09-09 22:00:00'),
  ('dcb00017-0000-4000-8000-000000000004', :company, 'erp', 'Inventory feed poll', 1240, 'success', '6.8s', 'Availability refreshed for 1,240 SKUs.', '2026-09-10 05:00:00', '2026-09-10 05:00:00'),
  ('dcb00017-0000-4000-8000-000000000005', :company, 'cad', 'Layout import K-204', 47, 'error', '3.9s', 'Import aborted: 3 unmapped equipment blocks (FRY-STN-9, ICE-220, HOOD-3X).', '2026-09-08 17:45:00', '2026-09-08 17:45:00'),
  ('dcb00017-0000-4000-8000-000000000006', :company, 'cad', 'Layout import K-198', 63, 'success', '5.2s', 'BOM extracted: 63 line items mapped to catalog.', '2026-08-20 14:10:00', '2026-08-20 14:10:00'),
  ('dcb00017-0000-4000-8000-000000000007', :company, 'crm', 'Opportunity sync', 24, 'warning', '3.0s', '2 opportunities skipped: missing account owner.', '2026-09-09 06:30:00', '2026-09-09 06:30:00'),
  ('dcb00017-0000-4000-8000-000000000008', :company, 'erp', 'Order push', 1, 'error', '0.8s', 'Order rejected: credit hold on customer account.', '2026-08-30 22:00:00', '2026-08-30 22:00:00');

-- ============================================================================
-- 23. Notification settings (per-user channel preferences)
-- ============================================================================
DELETE FROM cpq_notification_settings WHERE "companyId" = :company;
INSERT INTO cpq_notification_settings
  (id, "companyId", "userId", "notificationType", "emailEnabled", "inAppEnabled", "smsEnabled", "createdAt", "updatedAt")
VALUES
  ('dcb00018-0000-4000-8000-000000000001', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001' LIMIT 1),'EMP0001'), 'approval_required', true, true, true, '2025-10-05 09:00:00', '2025-10-05 09:00:00'),
  ('dcb00018-0000-4000-8000-000000000002', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001' LIMIT 1),'EMP0001'), 'quote_expiring', true, true, false, '2025-10-05 09:01:00', '2025-10-05 09:01:00'),
  ('dcb00018-0000-4000-8000-000000000003', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002' LIMIT 1),'EMP0002'), 'approval_required', true, true, true, '2025-10-05 09:05:00', '2026-01-12 10:00:00'),
  ('dcb00018-0000-4000-8000-000000000004', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002' LIMIT 1),'EMP0002'), 'contract_signed', true, true, false, '2025-10-05 09:06:00', '2025-10-05 09:06:00'),
  ('dcb00018-0000-4000-8000-000000000005', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007' LIMIT 1),'EMP0007'), 'quote_approved', true, true, false, '2025-10-06 10:00:00', '2025-10-06 10:00:00'),
  ('dcb00018-0000-4000-8000-000000000006', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007' LIMIT 1),'EMP0007'), 'proposal_viewed', false, true, false, '2025-10-06 10:01:00', '2025-10-06 10:01:00'),
  ('dcb00018-0000-4000-8000-000000000007', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008' LIMIT 1),'EMP0008'), 'quote_rejected', true, true, false, '2025-10-07 11:00:00', '2025-10-07 11:00:00'),
  ('dcb00018-0000-4000-8000-000000000008', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0005' LIMIT 1),'EMP0005'), 'contract_expiring', true, true, false, '2025-10-08 09:00:00', '2025-10-08 09:00:00');

-- ============================================================================
-- 24. Notification prefs (templates / escalation rules / toggles / thresholds)
-- ============================================================================
DELETE FROM cpq_notification_prefs WHERE "companyId" = :company;
INSERT INTO cpq_notification_prefs
  (id, "companyId", "settingType", name, subject, enabled, config, "createdAt", "updatedAt")
VALUES
  ('dcb00019-0000-4000-8000-000000000001', :company, 'email-template', 'Approval Request Email', 'Action required: {{entityNumber}} awaits your approval', true,
   '{"body":"{{requesterName}} has requested approval for {{entityNumber}} ({{amount}}).","cc":["sales-ops@b3macbis.demo"]}', '2025-10-05 08:00:00', '2025-10-05 08:00:00'),
  ('dcb00019-0000-4000-8000-000000000002', :company, 'email-template', 'Quote Expiry Reminder', 'Quote {{quoteNumber}} expires in {{daysLeft}} days', true,
   '{"body":"Quote {{quoteNumber}} for {{customerName}} expires on {{expiryDate}}.","sendDaysBefore":[7,3,1]}', '2025-10-05 08:10:00', '2025-10-05 08:10:00'),
  ('dcb00019-0000-4000-8000-000000000003', :company, 'escalation-rule', 'Approval SLA Escalation', NULL, true,
   '{"afterHours":24,"escalateTo":"Sales Director","repeatEveryHours":12}', '2025-10-05 08:20:00', '2026-02-01 09:00:00'),
  ('dcb00019-0000-4000-8000-000000000004', :company, 'escalation-rule', 'Contract Signature Chase', NULL, true,
   '{"afterDays":5,"escalateTo":"Account Manager","channel":"email"}', '2025-10-05 08:30:00', '2025-10-05 08:30:00'),
  ('dcb00019-0000-4000-8000-000000000005', :company, 'toggle', 'Daily Digest', NULL, true,
   '{"sendAt":"07:30","timezone":"America/New_York","sections":["pending-approvals","expiring-quotes"]}', '2025-10-05 08:40:00', '2025-10-05 08:40:00'),
  ('dcb00019-0000-4000-8000-000000000006', :company, 'threshold', 'Large Deal Alert Threshold', NULL, true,
   '{"minQuoteValue":250000,"notifyRoles":["VP Sales","Sales Director"]}', '2025-10-05 08:50:00', '2025-10-05 08:50:00');

-- ============================================================================
-- 25. Permission roles
-- ============================================================================
DELETE FROM cpq_permission_roles WHERE "companyId" = :company;
INSERT INTO cpq_permission_roles
  (id, "companyId", name, description, "usersCount", permissions, "approvalLimit", "createdAt", "updatedAt")
VALUES
  ('dcb0000d-0000-4000-8000-000000000001', :company, 'Sales Rep', 'Creates quotes and proposals; discounts up to 10 percent without approval.', 8,
   '{"quotes":["create","edit-own","view-own"],"proposals":["create","send"],"maxDiscount":10}', 0, '2025-10-04 08:00:00', '2025-10-04 08:00:00'),
  ('dcb0000d-0000-4000-8000-000000000002', :company, 'Sales Manager', 'Approves quotes to 150k and discounts to 20 percent.', 2,
   '{"quotes":["create","edit-all","view-all","approve"],"discounts":["approve"],"maxDiscount":20}', 150000, '2025-10-04 08:10:00', '2025-10-04 08:10:00'),
  ('dcb0000d-0000-4000-8000-000000000003', :company, 'Sales Director', 'Approves all quotes and discounts; manages templates and playbooks.', 1,
   '{"quotes":["*"],"discounts":["*"],"templates":["manage"],"analytics":["view-all"]}', 1000000, '2025-10-04 08:20:00', '2026-03-01 09:00:00'),
  ('dcb0000d-0000-4000-8000-000000000004', :company, 'CPQ Administrator', 'Full settings, product, pricing-rule and integration administration.', 1,
   '{"settings":["*"],"products":["*"],"pricingRules":["*"],"integrations":["*"]}', NULL, '2025-10-04 08:30:00', '2025-10-04 08:30:00'),
  ('dcb0000d-0000-4000-8000-000000000005', :company, 'Finance Reviewer', 'Reviews payment terms and contract values; read-only on quotes.', 2,
   '{"quotes":["view-all"],"contracts":["approve"],"reports":["export"]}', 500000, '2025-10-04 08:40:00', '2025-10-04 08:40:00');

-- ============================================================================
-- 26. User permissions
-- ============================================================================
DELETE FROM cpq_user_permissions WHERE "companyId" = :company;
INSERT INTO cpq_user_permissions
  (id, "companyId", "userId", "roleId", "canCreateQuotes", "canApproveQuotes", "quoteApprovalLimit",
   "canViewAllQuotes", "canEditOwnQuotes", "canEditAllQuotes", "canDeleteQuotes", "canOverridePrice",
   "canApplyAnyDiscount", "maxDiscountPercentage", "canApproveDiscounts", "discountApprovalLimit",
   "canCreateConfigurations", "canOverrideRules", "canCreateProposals", "canApproveProposals",
   "canSendProposals", "canCreateContracts", "canApproveContracts", "contractApprovalLimit",
   "canModifyContractClauses", "canViewOwnAnalytics", "canViewAllAnalytics", "canExportReports",
   "canManageSettings", "canManageTemplates", "canManageProducts", "canManagePricingRules",
   "createdBy", "createdAt", "updatedAt")
VALUES
  ('dcb0001a-0000-4000-8000-000000000001', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0001' LIMIT 1),'EMP0001'), 'dcb0000d-0000-4000-8000-000000000002',
   true, true, 150000, true, true, true, false, true, false, 20.00, true, 150000, true, false, true, true, true, true, false, NULL, false, true, true, true, false, true, false, false,
   'Sanjay Malhotra', '2025-10-04 09:00:00', '2025-10-04 09:00:00'),
  ('dcb0001a-0000-4000-8000-000000000002', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0002' LIMIT 1),'EMP0002'), 'dcb0000d-0000-4000-8000-000000000003',
   true, true, 1000000, true, true, true, true, true, true, 100.00, true, 1000000, true, true, true, true, true, true, true, 1000000, true, true, true, true, false, true, true, true,
   'Sanjay Malhotra', '2025-10-04 09:05:00', '2026-03-01 09:05:00'),
  ('dcb0001a-0000-4000-8000-000000000003', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007' LIMIT 1),'EMP0007'), 'dcb0000d-0000-4000-8000-000000000001',
   true, false, NULL, true, true, false, false, false, false, 10.00, false, NULL, true, false, true, false, true, false, false, NULL, false, true, false, false, false, false, false, false,
   'Sanjay Malhotra', '2025-10-04 09:10:00', '2025-10-04 09:10:00'),
  ('dcb0001a-0000-4000-8000-000000000004', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008' LIMIT 1),'EMP0008'), 'dcb0000d-0000-4000-8000-000000000001',
   true, false, NULL, true, true, false, false, false, false, 10.00, false, NULL, true, false, true, false, true, false, false, NULL, false, true, false, false, false, false, false, false,
   'Sanjay Malhotra', '2025-10-04 09:15:00', '2025-10-04 09:15:00'),
  ('dcb0001a-0000-4000-8000-000000000005', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0006' LIMIT 1),'EMP0006'), 'dcb0000d-0000-4000-8000-000000000005',
   false, false, NULL, true, false, false, false, false, false, NULL, false, NULL, false, false, false, false, false, false, true, 500000, false, true, true, true, false, false, false, false,
   'Sanjay Malhotra', '2025-10-04 09:20:00', '2025-10-04 09:20:00'),
  ('dcb0001a-0000-4000-8000-000000000006', :company, COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0017' LIMIT 1),'EMP0017'), 'dcb0000d-0000-4000-8000-000000000004',
   true, false, NULL, true, true, true, true, true, false, NULL, false, NULL, true, true, true, false, true, true, false, NULL, true, true, true, true, true, true, true, true,
   'Sanjay Malhotra', '2025-10-04 09:25:00', '2025-10-04 09:25:00');

-- ============================================================================
-- 27. Win/loss records (aligned with CRM won/lost leads)
-- ============================================================================
DELETE FROM cpq_win_loss_records WHERE "companyId" = :company;
INSERT INTO cpq_win_loss_records
  (id, "companyId", "quoteId", "customerId", "customerName", outcome, "quoteValue", currency, industry,
   "productCategory", "salesRepId", region, "winFactors", "lossReasons", "competitorWon", "competitorPrice",
   "feedbackNotes", "priceDifferencePercentage", "leadTimeDifferenceDays", "recordedAt")
VALUES
  ('dcb0001b-0000-4000-8000-000000000001', :company, COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0001' LIMIT 1),'QTE-DEMO-0001'),
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Fjordline Cruises USA' LIMIT 1),'demo-lead-fjordline'), 'Fjordline Cruises USA', 'won', 415000, 'USD', 'Cruise', 'Galley Systems',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0007' LIMIT 1),'EMP0007'), 'East', '["marine certification scope","dockside delivery plan","phased milestones"]', NULL, NULL, NULL,
   'Certification paperwork turnaround cited as deciding factor.', NULL, NULL, '2025-11-25 10:30:00'),
  ('dcb0001b-0000-4000-8000-000000000002', :company, COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0002' LIMIT 1),'QTE-DEMO-0002'),
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Aurelia Grand Hotel' LIMIT 1),'demo-lead-aurelia'), 'Aurelia Grand Hotel', 'won', 388000, 'USD', 'Hospitality', 'Cooking Equipment',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0008' LIMIT 1),'EMP0008'), 'East', '["approved 12 percent discount","phased install during closed weeks"]', NULL, NULL, NULL,
   'Discount approval turnaround kept us ahead of incumbent.', -3.20, NULL, '2025-12-17 09:30:00'),
  ('dcb0001b-0000-4000-8000-000000000003', :company, COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0004' LIMIT 1),'QTE-DEMO-0004'),
   COALESCE((SELECT id::text FROM crm_leads WHERE company='St. Aldric Medical Center' LIMIT 1),'demo-lead-staldric'), 'St. Aldric Medical Center', 'won', 265000, 'USD', 'Healthcare', 'Cook-Chill Systems',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010' LIMIT 1),'EMP0010'), 'Central', '["HACCP first-pass references","clinical dietitian endorsement"]', NULL, NULL, NULL,
   'Metro Hospital reference visit sealed the decision.', NULL, NULL, '2026-03-20 11:30:00'),
  ('dcb0001b-0000-4000-8000-000000000004', :company, 'DEMO-WL-REF-004',
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Brookfield Senior Living' LIMIT 1),'demo-lead-brookfield'), 'Brookfield Senior Living', 'won', 152000, 'USD', 'Healthcare', 'Cook-Chill Systems',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0010' LIMIT 1),'EMP0010'), 'East', '["standardised three-site package","service SLA"]', NULL, NULL, NULL,
   'Won on bundled service contract across all three residences.', 2.10, NULL, '2026-01-22 14:00:00'),
  ('dcb0001b-0000-4000-8000-000000000005', :company, 'DEMO-WL-REF-005',
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Cedar & Salt Restaurant Group' LIMIT 1),'demo-lead-cedarsalt'), 'Cedar & Salt Restaurant Group', 'won', 118000, 'USD', 'Restaurant', 'Cooking Equipment',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009' LIMIT 1),'EMP0009'), 'West', '["quick-close financing offer","install and first-year service bundle"]', NULL, NULL, NULL,
   'Financing option closed the deal within three weeks.', NULL, NULL, '2026-04-14 10:00:00'),
  ('dcb0001b-0000-4000-8000-000000000006', :company, 'DEMO-WL-REF-006',
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Ferrante''s Trattoria' LIMIT 1),'demo-lead-ferrante'), 'Ferrante''s Trattoria', 'won', 47000, 'USD', 'Restaurant', 'Cooking Equipment',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009' LIMIT 1),'EMP0009'), 'East', '["same-week quote","chef demo of combi oven"]', NULL, NULL, NULL,
   'Chef demo converted the owner on the spot.', NULL, NULL, '2026-05-08 16:00:00'),
  ('dcb0001b-0000-4000-8000-000000000007', :company, COALESCE((SELECT id::text FROM cpq_quotes WHERE "quoteNumber"='QTE-DEMO-0003' LIMIT 1),'QTE-DEMO-0003'),
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Big Sky Steakhouse' LIMIT 1),'demo-lead-bigsky'), 'Big Sky Steakhouse', 'lost', 36000, 'USD', 'Restaurant', 'Cooking Equipment',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0009' LIMIT 1),'EMP0009'), 'West', NULL, '["price","discount request rejected internally"]', 'Regional Restaurant Supply Co', 30500,
   'Customer went with local supplier after our 22 percent discount was declined.', 15.30, NULL, '2026-01-28 09:00:00'),
  ('dcb0001b-0000-4000-8000-000000000008', :company, 'DEMO-WL-REF-008',
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Copperleaf Tavern' LIMIT 1),'demo-lead-copperleaf'), 'Copperleaf Tavern', 'lost', 32000, 'USD', 'Restaurant', 'Cooking Equipment',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0013' LIMIT 1),'EMP0013'), 'Central', NULL, '["lead time","competitor stock availability"]', 'QuickServe Equipment Outlet', 31000,
   'Competitor had the range in stock; our 6-week lead time lost it.', 3.10, 38, '2026-02-18 11:00:00'),
  ('dcb0001b-0000-4000-8000-000000000009', :company, 'DEMO-WL-REF-009',
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Northgate School District' LIMIT 1),'demo-lead-northgate'), 'Northgate School District', 'lost', 96000, 'USD', 'Education', 'Serving Lines',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0012' LIMIT 1),'EMP0012'), 'Central', NULL, '["price-weighted public tender","lower regional bid"]', 'Midwest Foodservice Installations', 83500,
   'Tender scored 70 percent on price; we ranked first on technical.', 13.00, NULL, '2026-03-06 15:30:00'),
  ('dcb0001b-0000-4000-8000-00000000000a', :company, 'DEMO-WL-REF-010',
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Shamrock Sports Bar' LIMIT 1),'demo-lead-shamrock'), 'Shamrock Sports Bar', 'lost', 21000, 'USD', 'Restaurant', 'Cooking Equipment',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0013' LIMIT 1),'EMP0013'), 'East', NULL, '["budget cut","project postponed"]', NULL, NULL,
   'Renovation postponed to 2027; keep warm for next cycle.', NULL, NULL, '2026-06-12 10:00:00'),
  ('dcb0001b-0000-4000-8000-00000000000b', :company, 'DEMO-WL-REF-011',
   COALESCE((SELECT id::text FROM crm_leads WHERE company='Whitaker''s Diner' LIMIT 1),'demo-lead-whitaker'), 'Whitaker''s Diner', 'lost', 18000, 'USD', 'Restaurant', 'Cooking Equipment',
   COALESCE((SELECT id::text FROM hr_employees WHERE "employeeCode"='EMP0013' LIMIT 1),'EMP0013'), 'Central', NULL, '["bought used equipment"]', 'Second-hand dealer', 9500,
   'Owner opted for refurbished units at roughly half price.', 47.00, NULL, '2026-07-03 13:30:00');

-- ============================================================================
-- 28. Product performance (references cpq_products dc9a0000-* seeded in 25_cpq_a)
-- ============================================================================
DELETE FROM cpq_product_performance WHERE "companyId" = :company;
INSERT INTO cpq_product_performance
  (id, "companyId", "productId", "productName", "productCategory", "periodStart", "periodEnd", "timesQuoted",
   "timesWon", "winRate", "totalRevenue", "totalQuantitySold", "avgSellingPrice", "configurationsCreated",
   "popularOptions", "timesSoldInBundle", "frequentlyBundledWith", "recommendationImpressions",
   "recommendationConversions", "createdAt", "updatedAt")
VALUES
  ('dcb0001c-0000-4000-8000-000000000001', :company, 'dc9a0000-0000-4000-8000-000000000001', '10-Grid Combi Oven', 'Cooking Equipment', '2025-10-01', '2026-09-10', 34, 15, 44.12, 486000, 27, 18000.0000, 21,
   '["steam-injection","auto-wash"]', 11, '["dc9a0000-0000-4000-8000-000000000002","dc9a0000-0000-4000-8000-000000000005"]', 342, 27, '2026-09-10 07:00:00', '2026-09-10 07:00:00'),
  ('dcb0001c-0000-4000-8000-000000000002', :company, 'dc9a0000-0000-4000-8000-000000000002', 'Roll-In Blast Chiller', 'Refrigeration', '2025-10-01', '2026-09-10', 22, 11, 50.00, 297000, 14, 21214.2857, 9,
   '["roll-in-trolley","haccp-logging"]', 9, '["dc9a0000-0000-4000-8000-000000000001"]', 210, 18, '2026-09-10 07:00:00', '2026-09-10 07:00:00'),
  ('dcb0001c-0000-4000-8000-000000000003', :company, 'dc9a0000-0000-4000-8000-000000000003', '20-Grid Combi Oven', 'Cooking Equipment', '2025-10-01', '2026-09-10', 12, 5, 41.67, 240000, 8, 30000.0000, 7,
   '["banquet-racking","dual-fuel"]', 4, '["dc9a0000-0000-4000-8000-000000000005"]', 128, 8, '2026-09-10 07:00:00', '2026-09-10 07:00:00'),
  ('dcb0001c-0000-4000-8000-000000000004', :company, 'dc9a0000-0000-4000-8000-000000000004', 'Walk-In Cold Room', 'Refrigeration', '2025-10-01', '2026-09-10', 18, 8, 44.44, 216000, 10, 21600.0000, 5,
   '["glass-door-section","remote-monitoring"]', 6, '["dc9a0000-0000-4000-8000-000000000002"]', 96, 6, '2026-09-10 07:00:00', '2026-09-10 07:00:00'),
  ('dcb0001c-0000-4000-8000-000000000005', :company, 'dc9a0000-0000-4000-8000-000000000005', 'Rack Conveyor Dishwasher', 'Warewashing', '2025-10-01', '2026-09-10', 20, 9, 45.00, 342000, 12, 28500.0000, 6,
   '["heat-recovery","dryer-module"]', 8, '["dc9a0000-0000-4000-8000-000000000001","dc9a0000-0000-4000-8000-000000000003"]', 415, 31, '2026-09-10 07:00:00', '2026-09-10 07:00:00'),
  ('dcb0001c-0000-4000-8000-000000000006', :company, 'dc9a0000-0000-4000-8000-000000000006', 'Compact Fry Station', 'Cooking Equipment', '2025-10-01', '2026-09-10', 15, 7, 46.67, 94500, 18, 5250.0000, 3,
   '["oil-filtration","basket-lift"]', 5, '["dc9a0000-0000-4000-8000-000000000005"]', 88, 5, '2026-09-10 07:00:00', '2026-09-10 07:00:00'),
  ('dcb0001c-0000-4000-8000-000000000007', :company, 'dc9a0000-0000-4000-8000-000000000007', 'High-Efficiency Walk-In Cold Room', 'Refrigeration', '2025-10-01', '2026-09-10', 8, 3, 37.50, 99000, 4, 24750.0000, 2,
   '["co2-refrigerant","remote-monitoring"]', 2, '["dc9a0000-0000-4000-8000-000000000004"]', 64, 3, '2026-09-10 07:00:00', '2026-09-10 07:00:00'),
  ('dcb0001c-0000-4000-8000-000000000008', :company, 'dc9a0000-0000-4000-8000-000000000008', 'Annual Service Contract', 'Services', '2025-10-01', '2026-09-10', 28, 17, 60.71, 156000, 17, 9176.4706, 0,
   '["4h-response","quarterly-pm"]', 14, '["dc9a0000-0000-4000-8000-000000000001","dc9a0000-0000-4000-8000-000000000002"]', 505, 58, '2026-09-10 07:00:00', '2026-09-10 07:00:00');

-- ============================================================================
-- 29. Sales cycle analytics (monthly, Oct 2025 – Aug 2026)
-- ============================================================================
DELETE FROM cpq_sales_cycle_analytics WHERE "companyId" = :company;
INSERT INTO cpq_sales_cycle_analytics
  (id, "companyId", "periodStart", "periodEnd", "salesRepId", region, "productCategory", "customerSegment",
   "avgCycleDays", "avgQuoteCreationDays", "avgApprovalDays", "avgCustomerDecisionDays", "minCycleDays",
   "maxCycleDays", "totalQuotes", "quotesConverted", "conversionRate", "stageMetrics", "createdAt", "updatedAt")
VALUES
  ('dcb0001d-0000-4000-8000-000000000001', :company, '2025-10-01', '2025-10-31', NULL, NULL, NULL, NULL,
   48.50, 3.20, 2.10, 21.40, 14, 92, 9, 3, 33.33, '{"discovery":12.4,"quoting":3.2,"approval":2.1,"decision":21.4}', '2025-11-01 06:00:00', '2025-11-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-000000000002', :company, '2025-11-01', '2025-11-30', NULL, NULL, NULL, NULL,
   45.10, 2.90, 1.80, 19.80, 12, 85, 11, 4, 36.36, '{"discovery":11.8,"quoting":2.9,"approval":1.8,"decision":19.8}', '2025-12-01 06:00:00', '2025-12-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-000000000003', :company, '2025-12-01', '2025-12-31', NULL, NULL, NULL, NULL,
   42.75, 2.60, 2.40, 18.20, 10, 78, 8, 4, 50.00, '{"discovery":10.9,"quoting":2.6,"approval":2.4,"decision":18.2}', '2026-01-01 06:00:00', '2026-01-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-000000000004', :company, '2026-01-01', '2026-01-31', NULL, NULL, NULL, NULL,
   51.20, 3.50, 2.80, 23.10, 16, 101, 10, 3, 30.00, '{"discovery":13.1,"quoting":3.5,"approval":2.8,"decision":23.1}', '2026-02-01 06:00:00', '2026-02-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-000000000005', :company, '2026-02-01', '2026-02-28', NULL, NULL, NULL, NULL,
   47.90, 3.10, 2.20, 20.60, 13, 88, 12, 4, 33.33, '{"discovery":12.6,"quoting":3.1,"approval":2.2,"decision":20.6}', '2026-03-01 06:00:00', '2026-03-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-000000000006', :company, '2026-03-01', '2026-03-31', NULL, NULL, NULL, NULL,
   44.30, 2.80, 1.90, 19.10, 11, 80, 13, 6, 46.15, '{"discovery":11.5,"quoting":2.8,"approval":1.9,"decision":19.1}', '2026-04-01 06:00:00', '2026-04-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-000000000007', :company, '2026-04-01', '2026-04-30', NULL, NULL, NULL, NULL,
   43.80, 2.70, 1.70, 18.90, 12, 76, 11, 5, 45.45, '{"discovery":11.2,"quoting":2.7,"approval":1.7,"decision":18.9}', '2026-05-01 06:00:00', '2026-05-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-000000000008', :company, '2026-05-01', '2026-05-31', NULL, NULL, NULL, NULL,
   46.60, 3.00, 2.00, 20.10, 13, 84, 10, 4, 40.00, '{"discovery":12.0,"quoting":3.0,"approval":2.0,"decision":20.1}', '2026-06-01 06:00:00', '2026-06-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-000000000009', :company, '2026-06-01', '2026-06-30', NULL, NULL, NULL, NULL,
   49.40, 3.30, 2.50, 22.00, 15, 95, 9, 3, 33.33, '{"discovery":12.8,"quoting":3.3,"approval":2.5,"decision":22.0}', '2026-07-01 06:00:00', '2026-07-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-00000000000a', :company, '2026-07-01', '2026-07-31', NULL, NULL, NULL, NULL,
   45.70, 2.90, 2.10, 19.60, 12, 82, 12, 5, 41.67, '{"discovery":11.9,"quoting":2.9,"approval":2.1,"decision":19.6}', '2026-08-01 06:00:00', '2026-08-01 06:00:00'),
  ('dcb0001d-0000-4000-8000-00000000000b', :company, '2026-08-01', '2026-08-31', NULL, NULL, NULL, NULL,
   44.90, 2.80, 2.30, 19.30, 11, 79, 14, 6, 42.86, '{"discovery":11.6,"quoting":2.8,"approval":2.3,"decision":19.3}', '2026-09-01 06:00:00', '2026-09-01 06:00:00');
