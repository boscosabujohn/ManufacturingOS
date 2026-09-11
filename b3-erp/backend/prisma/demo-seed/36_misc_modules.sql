-- Demo seed — Misc modules (approvals, collaboration, accounts, reports,
-- proposals, cms, portal, iot, attachments) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this file's demo rows first, then re-inserts.
-- Delete predicates:
--   approvals:      approval_requests.reference_number IN demo docs (children cascade);
--                   user_tasks.reference_number LIKE '%-DEMO-%'
--   collaboration:  companyId = :company
--   accounts:       accounts_bank_accounts.accountNumber LIKE 'ACB-DEMO-%' (txns deleted first);
--                   expense_claims.claimNumber LIKE 'EXP-DEMO-%'; petty_cash.receiptNumber LIKE 'PC-DEMO-%'
--   reports:        companyId = :company
--   proposals:      proposals.proposalNumber LIKE 'PROP-DEMO-%'; proposal_templates.name LIKE 'DEMO %'
--   cms:            slug LIKE 'demo-%'
--   portal/iot:     companyId = :company
--   attachments:    storageKey LIKE 'demo/%'
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================================
-- APPROVALS
-- ============================================================================

DELETE FROM user_tasks WHERE reference_number LIKE '%-DEMO-%';
DELETE FROM approval_requests WHERE reference_number LIKE 'PO-DEMO-%'
   OR reference_number LIKE 'QT-DEMO-%' OR reference_number LIKE 'EXP-DEMO-%';

INSERT INTO approval_requests
  (entity_type, entity_id, reference_number, title, description, requested_by, amount,
   priority, status, current_level, total_levels, chain_id, deadline, completed_at, created_at, updated_at)
VALUES
  ('purchase_order','PO-DEMO-0001','PO-DEMO-0001','PO approval — SS304 sheet stock','Bulk stainless sheet purchase for Q4 production run','EMP0005',233640.00,
   'high','approved',5,5,(SELECT id FROM approval_chains WHERE name='Purchase Order Approval Chain' LIMIT 1),'2025-10-20 17:00:00','2025-10-18 11:42:00','2025-10-12 09:15:00','2025-10-18 11:42:00'),
  ('purchase_order','PO-DEMO-0004','PO-DEMO-0004','PO approval — compressor units','Refrigeration compressors for blast chiller line','EMP0005',83780.00,
   'medium','approved',5,5,(SELECT id FROM approval_chains WHERE name='Purchase Order Approval Chain' LIMIT 1),'2025-11-25 17:00:00','2025-11-21 15:10:00','2025-11-14 10:05:00','2025-11-21 15:10:00'),
  ('purchase_order','PO-DEMO-0008','PO-DEMO-0008','PO approval — combi oven imports','Imported combi oven cores, high value','EMP0009',277300.00,
   'urgent','pending',3,5,(SELECT id FROM approval_chains WHERE name='Purchase Order Approval Chain' LIMIT 1),'2026-08-30 17:00:00',NULL,'2026-08-18 08:40:00','2026-08-26 09:20:00'),
  ('purchase_order','PO-DEMO-0009','PO-DEMO-0009','PO approval — packing consumables','Cartons, strapping and stretch film restock','EMP0009',23600.00,
   'low','approved',5,5,(SELECT id FROM approval_chains WHERE name='Purchase Order Approval Chain' LIMIT 1),'2026-01-15 17:00:00','2026-01-09 16:25:00','2026-01-05 11:30:00','2026-01-09 16:25:00'),
  ('purchase_order','PO-DEMO-0012','PO-DEMO-0012','PO approval — CNC tooling package','CNC machining tooling and fixtures for WC-CNC','EMP0005',330636.00,
   'urgent','rejected',4,5,(SELECT id FROM approval_chains WHERE name='Purchase Order Approval Chain' LIMIT 1),'2026-03-10 17:00:00','2026-03-06 10:18:00','2026-02-24 14:00:00','2026-03-06 10:18:00'),
  ('sales_quotation','QT-DEMO-2026-0010','QT-DEMO-2026-0010','Quote approval — Campus Dining Co-op','Discounted dishwashing systems quote, margin below floor','EMP0002',148500.00,
   'high','approved',4,4,(SELECT id FROM approval_chains WHERE name='Sales Order Approval Chain' LIMIT 1),'2026-02-14 17:00:00','2026-02-11 12:05:00','2026-02-06 09:45:00','2026-02-11 12:05:00'),
  ('sales_quotation','QT-DEMO-2026-0017','QT-DEMO-2026-0017','Quote approval — Silverline Cruises galley','Full galley fitout quote, special payment terms','EMP0002',318000.00,
   'urgent','pending',2,4,(SELECT id FROM approval_chains WHERE name='Sales Order Approval Chain' LIMIT 1),'2026-09-18 17:00:00',NULL,'2026-09-04 10:30:00','2026-09-08 14:12:00'),
  ('sales_quotation','QT-DEMO-2026-0024','QT-DEMO-2026-0024','Quote approval — Bayside banquet line','Banquet kitchen line quote with extended warranty','EMP0007',402000.00,
   'medium','approved',4,4,(SELECT id FROM approval_chains WHERE name='Sales Order Approval Chain' LIMIT 1),'2026-06-05 17:00:00','2026-06-02 17:40:00','2026-05-27 08:55:00','2026-06-02 17:40:00'),
  ('expense_claim','EXP-DEMO-0003','EXP-DEMO-0003','Expense approval — site survey travel','Travel and lodging for Metro Hospital site survey','EMP0011',1840.00,
   'low','approved',3,3,(SELECT id FROM approval_chains WHERE name='Expense Claim Approval Chain' LIMIT 1),'2026-04-15 17:00:00','2026-04-11 09:35:00','2026-04-07 13:20:00','2026-04-11 09:35:00'),
  ('expense_claim','EXP-DEMO-0007','EXP-DEMO-0007','Expense approval — trade show booth','GulfHost trade show booth incidentals','EMP0016',3260.00,
   'medium','pending',2,3,(SELECT id FROM approval_chains WHERE name='Expense Claim Approval Chain' LIMIT 1),'2026-09-20 17:00:00',NULL,'2026-09-07 11:10:00','2026-09-09 16:05:00');

INSERT INTO approval_history (request_id, level, approver_id, action, comment, "timestamp")
VALUES
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),1,'EMP0004','approved','Quantities match MRP plan.','2025-10-13 10:02:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),2,'EMP0003','approved','Vendor rates verified against contract.','2025-10-14 15:30:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),3,'EMP0017','approved','Budget available under RM-Q4.','2025-10-16 09:12:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),4,'EMP0001','approved','OK to proceed.','2025-10-17 14:45:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),5,'EMP0013','approved','Final sign-off.','2025-10-18 11:42:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0008' LIMIT 1),1,'EMP0004','approved','Import license attached and valid.','2026-08-20 10:20:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0008' LIMIT 1),2,'EMP0003','approved','Freight terms CIF confirmed.','2026-08-24 16:00:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0008' LIMIT 1),3,'EMP0017','pending','Awaiting FX rate confirmation from treasury.','2026-08-26 09:20:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0012' LIMIT 1),1,'EMP0004','approved','Tooling list matches WC-CNC upgrade plan.','2026-02-26 11:05:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0012' LIMIT 1),2,'EMP0003','approved','Single-source justified, OEM tooling.','2026-03-02 10:00:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0012' LIMIT 1),3,'EMP0017','approved','Capex budget line confirmed.','2026-03-04 14:30:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0012' LIMIT 1),4,'EMP0001','rejected','Defer to FY27 capex; re-scope to critical tools only.','2026-03-06 10:18:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='QT-DEMO-2026-0017' LIMIT 1),1,'EMP0007','approved','Scope and BOQ verified with estimation.','2026-09-05 12:40:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='QT-DEMO-2026-0017' LIMIT 1),2,'EMP0002','pending','Reviewing 90-day payment term exposure.','2026-09-08 14:12:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='EXP-DEMO-0003' LIMIT 1),1,'EMP0006','approved','Receipts complete.','2026-04-08 09:10:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='EXP-DEMO-0003' LIMIT 1),2,'EMP0017','approved','Within travel policy caps.','2026-04-09 15:22:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='EXP-DEMO-0003' LIMIT 1),3,'EMP0013','approved','Approved for payout.','2026-04-11 09:35:00');

INSERT INTO approval_comments (request_id, user_id, comment, created_at)
VALUES
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),'EMP0005','Attached the revised vendor quote with 2% early-payment discount.','2025-10-12 09:20:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),'EMP0003','Please confirm delivery is split across two lots as discussed.','2025-10-14 15:35:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0008' LIMIT 1),'EMP0009','Customs broker confirmed HS codes; docs uploaded.','2026-08-19 12:00:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0008' LIMIT 1),'EMP0017','Treasury FX desk will confirm forward cover by Friday.','2026-08-26 09:25:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0012' LIMIT 1),'EMP0005','Re-submitting in April with reduced scope per MD comments.','2026-03-06 11:00:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='QT-DEMO-2026-0010' LIMIT 1),'EMP0002','Discount justified by 3-year service contract attachment.','2026-02-07 10:15:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='QT-DEMO-2026-0017' LIMIT 1),'EMP0007','Customer requested milestone billing; draft schedule attached.','2026-09-04 11:00:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='QT-DEMO-2026-0024' LIMIT 1),'EMP0007','Warranty extension priced at 4.5% of contract value.','2026-05-28 09:30:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='EXP-DEMO-0003' LIMIT 1),'EMP0011','Hotel invoice was in USD; converted at card statement rate.','2026-04-07 13:25:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='EXP-DEMO-0007' LIMIT 1),'EMP0016','Booth power surcharge receipt added, was missing earlier.','2026-09-09 16:00:00');

INSERT INTO approval_attachments (request_id, file_name, file_url, file_size, mime_type, uploaded_by, uploaded_at)
VALUES
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),'vendor-quote-ss304-rev2.pdf','/files/demo/approvals/vendor-quote-ss304-rev2.pdf',482113,'application/pdf','EMP0005','2025-10-12 09:18:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0001' LIMIT 1),'mrp-requirement-q4.xlsx','/files/demo/approvals/mrp-requirement-q4.xlsx',88410,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','EMP0004','2025-10-13 10:00:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0008' LIMIT 1),'import-license-2026.pdf','/files/demo/approvals/import-license-2026.pdf',231770,'application/pdf','EMP0009','2026-08-18 08:50:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0008' LIMIT 1),'cif-freight-terms.pdf','/files/demo/approvals/cif-freight-terms.pdf',129004,'application/pdf','EMP0009','2026-08-19 12:05:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='PO-DEMO-0012' LIMIT 1),'cnc-tooling-boq.xlsx','/files/demo/approvals/cnc-tooling-boq.xlsx',157220,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','EMP0005','2026-02-24 14:05:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='QT-DEMO-2026-0010' LIMIT 1),'service-contract-draft.pdf','/files/demo/approvals/service-contract-draft.pdf',340552,'application/pdf','EMP0002','2026-02-07 10:12:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='QT-DEMO-2026-0017' LIMIT 1),'milestone-billing-schedule.pdf','/files/demo/approvals/milestone-billing-schedule.pdf',96780,'application/pdf','EMP0007','2026-09-04 11:02:00'),
  ((SELECT id FROM approval_requests WHERE reference_number='EXP-DEMO-0003' LIMIT 1),'travel-receipts-bundle.pdf','/files/demo/approvals/travel-receipts-bundle.pdf',1204330,'application/pdf','EMP0011','2026-04-07 13:22:00');

INSERT INTO user_tasks
  (user_id, task_type, title, description, module, module_url, reference_number,
   priority, status, due_date, sla_status, metadata, created_at, completed_at, updated_at)
VALUES
  ('EMP0017','approval','Approve PO-DEMO-0008 (level 3)','Finance review of imported combi oven cores PO','procurement','/procurement/purchase-orders','PO-DEMO-0008','critical','in-progress','2026-08-30 17:00:00','warning','{"amount":277300,"level":3}','2026-08-24 16:05:00',NULL,'2026-08-26 09:20:00'),
  ('EMP0002','approval','Approve QT-DEMO-2026-0017 (level 2)','Review special payment terms on Silverline galley quote','sales','/sales/quotations','QT-DEMO-2026-0017','high','pending','2026-09-18 17:00:00','on-track','{"amount":318000,"level":2}','2026-09-05 12:45:00',NULL,'2026-09-08 14:12:00'),
  ('EMP0017','approval','Approve EXP-DEMO-0007 (level 2)','Trade show booth expense claim review','accounts','/accounts/expense-claims','EXP-DEMO-0007','medium','pending','2026-09-20 17:00:00','on-track','{"amount":3260,"level":2}','2026-09-08 10:00:00',NULL,'2026-09-09 16:05:00'),
  ('EMP0013','approval','Approve PO-DEMO-0001 (level 5)','Final sign-off on SS304 sheet stock PO','procurement','/procurement/purchase-orders','PO-DEMO-0001','high','completed','2025-10-20 17:00:00','on-track','{"amount":233640,"level":5}','2025-10-17 14:50:00','2025-10-18 11:42:00','2025-10-18 11:42:00'),
  ('EMP0001','approval','Approve PO-DEMO-0012 (level 4)','MD review of CNC tooling capex PO','procurement','/procurement/purchase-orders','PO-DEMO-0012','critical','completed','2026-03-10 17:00:00','on-track','{"amount":330636,"level":4,"outcome":"rejected"}','2026-03-04 14:35:00','2026-03-06 10:18:00','2026-03-06 10:18:00'),
  ('EMP0005','action','Re-scope CNC tooling PO','Reduce PO-DEMO-0012 to critical tools only and resubmit','procurement','/procurement/purchase-orders','PO-DEMO-0012','medium','in-progress','2026-04-30 17:00:00','breached','{"reason":"capex deferred to FY27"}','2026-03-06 11:05:00',NULL,'2026-05-02 09:00:00'),
  ('EMP0009','action','Confirm FX forward cover','Coordinate with treasury on PO-DEMO-0008 EUR exposure','procurement','/procurement/purchase-orders','PO-DEMO-0008','high','pending','2026-08-29 17:00:00','warning','{"currency":"EUR"}','2026-08-26 09:30:00',NULL,'2026-08-26 09:30:00'),
  ('EMP0007','review','Review banquet line warranty terms','Verify extended warranty costing on QT-DEMO-2026-0024','sales','/sales/quotations','QT-DEMO-2026-0024','low','completed','2026-06-01 17:00:00','on-track','{"warrantyPct":4.5}','2026-05-27 09:00:00','2026-05-29 15:20:00','2026-05-29 15:20:00'),
  ('EMP0006','review','Verify expense receipts EXP-DEMO-0003','Check converted USD hotel invoice against policy','accounts','/accounts/expense-claims','EXP-DEMO-0003','low','completed','2026-04-10 17:00:00','on-track','{"amount":1840}','2026-04-07 13:30:00','2026-04-08 09:10:00','2026-04-08 09:10:00'),
  ('EMP0011','action','Submit survey report — Metro Hospital','Upload site survey findings tied to travel claim EXP-DEMO-0003','crm','/crm/customers','EXP-DEMO-0003','medium','completed','2026-04-20 17:00:00','on-track','{"customer":"Metro Hospital Kitchens"}','2026-04-11 10:00:00','2026-04-15 16:40:00','2026-04-15 16:40:00');

-- ============================================================================
-- COLLABORATION
-- ============================================================================

DELETE FROM collab_messages WHERE "companyId" = :company;
DELETE FROM collab_files WHERE "companyId" = :company;
DELETE FROM collab_folders WHERE "companyId" = :company;
DELETE FROM collab_channels WHERE "companyId" = :company;

INSERT INTO collab_channels
  ("companyId", name, "channelType", "lastMessage", "lastMessageAt", "unreadCount", "memberCount", status, meta, "createdAt", "updatedAt")
VALUES
  (:company,'#production','channel','Welding fixture for BC-300 arrives Thursday.','2026-09-10 16:42:00+00',3,14,'active','{"topic":"Shop floor coordination"}','2025-10-02 09:00:00+00','2026-09-10 16:42:00+00'),
  (:company,'#projects','channel','Silverline galley kickoff moved to Monday 10am.','2026-09-09 14:05:00+00',1,11,'active','{"topic":"Project delivery"}','2025-10-02 09:05:00+00','2026-09-09 14:05:00+00'),
  (:company,'#sales','channel','Bayside PO expected this week per GM call.','2026-09-08 11:30:00+00',0,9,'active','{"topic":"Pipeline and quotes"}','2025-10-02 09:10:00+00','2026-09-08 11:30:00+00'),
  (:company,'#quality','channel','QC hold released on batch WELD-2609.','2026-09-05 10:12:00+00',0,7,'active','{"topic":"QC alerts and holds"}','2025-11-10 08:30:00+00','2026-09-05 10:12:00+00'),
  (:company,'#general','channel','Reminder: safety audit walk-through Friday 9am.','2026-09-10 08:00:00+00',5,26,'active','{"topic":"Company-wide announcements"}','2025-10-01 08:00:00+00','2026-09-10 08:00:00+00');

INSERT INTO collab_folders
  ("companyId", name, "parentId", "itemCount", "sizeBytes", owner, meta, "createdAt", "updatedAt")
VALUES
  (:company,'Design Drawings',NULL,42,734003200,'Anita Desai','{"tags":["cad","production"]}','2025-10-05 10:00:00+00','2026-08-22 15:30:00+00'),
  (:company,'Customer Contracts',NULL,18,94371840,'Priya Sharma','{"tags":["legal","sales"]}','2025-10-05 10:05:00+00','2026-09-02 12:10:00+00'),
  (:company,'QC Reports',NULL,63,157286400,'Meera Nair','{"tags":["quality"]}','2025-11-12 09:00:00+00','2026-09-05 10:20:00+00'),
  (:company,'Marketing Assets',NULL,27,2147483648,'Neha Agarwal','{"tags":["brand","media"]}','2025-12-01 11:00:00+00','2026-07-14 16:45:00+00'),
  (:company,'SOPs & Manuals',NULL,31,52428800,'Vikram Singh','{"tags":["operations","training"]}','2026-01-08 09:30:00+00','2026-06-30 13:00:00+00');

INSERT INTO collab_files
  ("companyId", name, "folderId", "fileType", "sizeBytes", owner, "isStarred", "isShared", meta, "createdAt", "updatedAt")
VALUES
  (:company,'BC-300-blast-chiller-GA-rev4.dwg',(SELECT id::text FROM collab_folders WHERE name='Design Drawings' AND "companyId"=:company LIMIT 1),'file',18874368,'Anita Desai',true,true,'{"revision":"4"}','2026-02-10 10:15:00+00','2026-08-22 15:30:00+00'),
  (:company,'combi-oven-hood-detail.pdf',(SELECT id::text FROM collab_folders WHERE name='Design Drawings' AND "companyId"=:company LIMIT 1),'file',2411520,'Anita Desai',false,true,'{"revision":"2"}','2026-03-18 14:00:00+00','2026-03-18 14:00:00+00'),
  (:company,'silverline-msa-signed.pdf',(SELECT id::text FROM collab_folders WHERE name='Customer Contracts' AND "companyId"=:company LIMIT 1),'file',1843200,'Priya Sharma',true,false,'{"customer":"Silverline Cruises"}','2026-09-02 12:10:00+00','2026-09-02 12:10:00+00'),
  (:company,'bluefig-frame-agreement-2026.pdf',(SELECT id::text FROM collab_folders WHERE name='Customer Contracts' AND "companyId"=:company LIMIT 1),'file',1536000,'Priya Sharma',false,false,'{"customer":"Blue Fig Hotels Group"}','2026-01-20 09:40:00+00','2026-01-20 09:40:00+00'),
  (:company,'weld-batch-2609-inspection.xlsx',(SELECT id::text FROM collab_folders WHERE name='QC Reports' AND "companyId"=:company LIMIT 1),'file',204800,'Meera Nair',false,true,'{"batch":"WELD-2609"}','2026-09-05 10:20:00+00','2026-09-05 10:20:00+00'),
  (:company,'product-catalog-2026.pdf',(SELECT id::text FROM collab_folders WHERE name='Marketing Assets' AND "companyId"=:company LIMIT 1),'file',26214400,'Neha Agarwal',true,true,'{"edition":"2026"}','2026-01-15 11:30:00+00','2026-07-14 16:45:00+00'),
  (:company,'sop-passivation-line.docx',(SELECT id::text FROM collab_folders WHERE name='SOPs & Manuals' AND "companyId"=:company LIMIT 1),'file',358400,'Vikram Singh',false,true,'{"process":"passivation"}','2026-04-02 09:00:00+00','2026-06-30 13:00:00+00'),
  (:company,'cold-room-commissioning-checklist.pdf',(SELECT id::text FROM collab_folders WHERE name='SOPs & Manuals' AND "companyId"=:company LIMIT 1),'file',512000,'Vikram Singh',false,false,'{"process":"commissioning"}','2026-05-11 15:20:00+00','2026-05-11 15:20:00+00');

INSERT INTO collab_messages
  ("companyId", "channelId", "senderName", "senderId", content, "messageType", status, "sentAt", meta, "createdAt", "updatedAt")
VALUES
  (:company,(SELECT id::text FROM collab_channels WHERE name='#production' AND "companyId"=:company LIMIT 1),'Vikram Singh','EMP0004','WC-WELD is at 92% load this week — pulling forward the Bayside frames to WC-CNC where possible.','text','delivered','2026-09-08 09:12:00+00',NULL,'2026-09-08 09:12:00+00','2026-09-08 09:12:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#production' AND "companyId"=:company LIMIT 1),'Suresh Patel','EMP0005','SS304 lot from PO-DEMO-0001 cleared incoming inspection, moving to cutting.','text','delivered','2026-09-09 11:30:00+00',NULL,'2026-09-09 11:30:00+00','2026-09-09 11:30:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#production' AND "companyId"=:company LIMIT 1),'Vikram Singh','EMP0004','Welding fixture for BC-300 arrives Thursday.','text','delivered','2026-09-10 16:42:00+00',NULL,'2026-09-10 16:42:00+00','2026-09-10 16:42:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#projects' AND "companyId"=:company LIMIT 1),'Ravi Menon','EMP0010','Silverline drawings approved by class surveyor — releasing to production planning.','text','delivered','2026-09-08 10:05:00+00',NULL,'2026-09-08 10:05:00+00','2026-09-08 10:05:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#projects' AND "companyId"=:company LIMIT 1),'Sunita Rao','EMP0011','Metro Hospital phase-2 punch list down to 6 items, targeting close-out next week.','text','delivered','2026-09-09 13:20:00+00',NULL,'2026-09-09 13:20:00+00','2026-09-09 13:20:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#projects' AND "companyId"=:company LIMIT 1),'Ravi Menon','EMP0010','Silverline galley kickoff moved to Monday 10am.','text','delivered','2026-09-09 14:05:00+00',NULL,'2026-09-09 14:05:00+00','2026-09-09 14:05:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#sales' AND "companyId"=:company LIMIT 1),'Priya Sharma','EMP0002','QT-DEMO-2026-0017 is with finance for payment-term review — chasing today.','text','delivered','2026-09-08 09:45:00+00',NULL,'2026-09-08 09:45:00+00','2026-09-08 09:45:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#sales' AND "companyId"=:company LIMIT 1),'Amit Verma','EMP0007','Bayside PO expected this week per GM call.','text','delivered','2026-09-08 11:30:00+00',NULL,'2026-09-08 11:30:00+00','2026-09-08 11:30:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#quality' AND "companyId"=:company LIMIT 1),'Meera Nair','EMP0006','Batch WELD-2609 on hold — porosity found on 2 of 40 joints, re-inspecting full lot.','text','delivered','2026-09-04 15:30:00+00',NULL,'2026-09-04 15:30:00+00','2026-09-04 15:30:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#quality' AND "companyId"=:company LIMIT 1),'Meera Nair','EMP0006','QC hold released on batch WELD-2609.','text','delivered','2026-09-05 10:12:00+00',NULL,'2026-09-05 10:12:00+00','2026-09-05 10:12:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#general' AND "companyId"=:company LIMIT 1),'Rajesh Kumar','EMP0001','Great Q1 close, team — order book up 18% YoY. Details in the town hall deck.','text','delivered','2026-04-03 09:00:00+00',NULL,'2026-04-03 09:00:00+00','2026-04-03 09:00:00+00'),
  (:company,(SELECT id::text FROM collab_channels WHERE name='#general' AND "companyId"=:company LIMIT 1),'Kiran Reddy','EMP0008','Reminder: safety audit walk-through Friday 9am.','text','delivered','2026-09-10 08:00:00+00',NULL,'2026-09-10 08:00:00+00','2026-09-10 08:00:00+00');

-- ============================================================================
-- ACCOUNTS (bank accounts, transactions, expense claims, petty cash)
-- ============================================================================

DELETE FROM bank_transactions WHERE "bankAccountId" IN
  (SELECT id FROM accounts_bank_accounts WHERE "accountNumber" LIKE 'ACB-DEMO-%');
DELETE FROM accounts_bank_accounts WHERE "accountNumber" LIKE 'ACB-DEMO-%';
DELETE FROM expense_claims WHERE "claimNumber" LIKE 'EXP-DEMO-%';
DELETE FROM petty_cash WHERE "receiptNumber" LIKE 'PC-DEMO-%';

INSERT INTO accounts_bank_accounts
  ("accountNumber", "accountName", "bankName", branch, "ifscCode", "swiftCode", currency,
   "currentBalance", "openingBalance", "openingDate", "accountType", status, "companyId", "createdAt", "updatedAt", "createdBy")
VALUES
  ('ACB-DEMO-0001','B3 MACBIS Operating Account','HDFC Bank','Andheri East, Mumbai','HDFC0000432','HDFCINBB','USD',842650.00,500000.00,'2025-10-01','current','active',:company,'2025-10-01 09:00:00','2026-09-10 09:00:00','EMP0013'),
  ('ACB-DEMO-0002','B3 MACBIS Payroll Account','ICICI Bank','BKC, Mumbai','ICIC0000221','ICICINBB','USD',96200.00,120000.00,'2025-10-01','current','active',:company,'2025-10-01 09:05:00','2026-09-01 10:00:00','EMP0013'),
  ('ACB-DEMO-0003','B3 MACBIS EEFC (EUR)','Axis Bank','Fort, Mumbai','UTIB0000007','AXISINBB','EUR',158400.00,0.00,'2025-11-15','current','active',:company,'2025-11-15 11:00:00','2026-08-28 14:00:00','EMP0017'),
  ('ACB-DEMO-0004','B3 MACBIS Fixed Deposit','HDFC Bank','Andheri East, Mumbai','HDFC0000432','HDFCINBB','USD',250000.00,250000.00,'2026-01-10','fixed-deposit','active',:company,'2026-01-10 10:00:00','2026-01-10 10:00:00','EMP0013'),
  ('ACB-DEMO-0005','B3 MACBIS Corporate Card','ICICI Bank','BKC, Mumbai','ICIC0000221','ICICINBB','USD',-12480.00,0.00,'2025-10-20','credit-card','active',:company,'2025-10-20 09:30:00','2026-09-08 18:00:00','EMP0017');

INSERT INTO bank_transactions
  ("bankAccountId", "transactionDate", description, "referenceNumber", debit, credit, balance,
   reconciled, "reconciledDate", "reconciledBy", "createdAt")
VALUES
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2025-10-25','Customer receipt — Harbour Grill (INV-DEMO-001)','INV-DEMO-001',0.00,86400.00,586400.00,true,'2025-11-02','EMP0018','2025-10-25 15:00:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2025-11-05','Vendor payment — SS304 sheet stock (PO-DEMO-0001)','PO-DEMO-0001',233640.00,0.00,352760.00,true,'2025-11-12','EMP0018','2025-11-05 12:30:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2025-12-08','Customer receipt — Blue Fig Hotels (INV-DEMO-002)','INV-DEMO-002',0.00,145200.00,497960.00,true,'2025-12-15','EMP0018','2025-12-08 10:20:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2026-01-12','Vendor payment — packing consumables (PO-DEMO-0009)','PO-DEMO-0009',23600.00,0.00,474360.00,true,'2026-01-20','EMP0018','2026-01-12 14:10:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2026-02-18','Customer receipt — Metro Hospital (INV-DEMO-004)','INV-DEMO-004',0.00,192800.00,667160.00,true,'2026-02-25','EMP0018','2026-02-18 11:45:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2026-04-14','Expense claim payout — EXP-DEMO-0003','EXP-DEMO-0003',1840.00,0.00,665320.00,true,'2026-04-20','EMP0018','2026-04-14 16:00:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2026-06-10','Customer receipt — Golden Spoon (INV-DEMO-006)','INV-DEMO-006',0.00,138900.00,804220.00,true,'2026-06-17','EMP0018','2026-06-10 09:50:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2026-08-22','Customer receipt — Lakeside Resort (INV-DEMO-008)','INV-DEMO-008',0.00,62430.00,866650.00,false,NULL,NULL,'2026-08-22 13:15:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2026-09-03','Bank charges — August','BC-2026-08',240.00,0.00,866410.00,false,NULL,NULL,'2026-09-03 08:00:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0001' LIMIT 1),'2026-09-08','Transfer to payroll account','TRF-PAY-2609',23760.00,0.00,842650.00,false,NULL,NULL,'2026-09-08 17:30:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0002' LIMIT 1),'2026-08-31','Payroll run — August 2026','PAYRUN-2026-08',118400.00,0.00,72440.00,true,'2026-09-05','EMP0018','2026-08-31 18:00:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0002' LIMIT 1),'2026-09-08','Transfer from operating account','TRF-PAY-2609',0.00,23760.00,96200.00,false,NULL,NULL,'2026-09-08 17:35:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0003' LIMIT 1),'2026-08-27','EUR advance — combi oven cores (PO-DEMO-0008)','PO-DEMO-0008',83190.00,0.00,158400.00,false,NULL,NULL,'2026-08-27 12:00:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0005' LIMIT 1),'2026-09-06','GulfHost booth incidentals — corporate card','EXP-DEMO-0007',3260.00,0.00,-11020.00,false,NULL,NULL,'2026-09-06 20:10:00'),
  ((SELECT id FROM accounts_bank_accounts WHERE "accountNumber"='ACB-DEMO-0005' LIMIT 1),'2026-09-08','Software subscription — CAD licenses','SUB-CAD-2609',1460.00,0.00,-12480.00,false,NULL,NULL,'2026-09-08 18:00:00');

INSERT INTO expense_claims
  ("claimNumber", "employeeId", "employeeName", "claimDate", "totalAmount", category, description,
   receipts, status, "approvedBy", "approvedDate", "paidDate", "paidBy", "paymentReference", "rejectionReason", "createdAt", "updatedAt")
VALUES
  ('EXP-DEMO-0001','EMP0002','Priya Sharma','2025-11-18',920.00,'Travel','Client visits — Blue Fig Hotels contract negotiation, NYC','2 receipts attached','paid','EMP0017','2025-11-21','2025-11-28','EMP0018','PAY-EXP-25-118',NULL,'2025-11-18 10:00:00','2025-11-28 15:00:00'),
  ('EXP-DEMO-0002','EMP0010','Ravi Menon','2026-01-22',640.00,'Site Expenses','Tools and consumables for Campus Dining install punch list','3 receipts attached','paid','EMP0017','2026-01-26','2026-02-02','EMP0018','PAY-EXP-26-014',NULL,'2026-01-22 14:30:00','2026-02-02 11:00:00'),
  ('EXP-DEMO-0003','EMP0011','Sunita Rao','2026-04-07',1840.00,'Travel','Travel and lodging for Metro Hospital site survey','Bundle uploaded','paid','EMP0013','2026-04-11','2026-04-14','EMP0018','PAY-EXP-26-041',NULL,'2026-04-07 13:20:00','2026-04-14 16:05:00'),
  ('EXP-DEMO-0004','EMP0007','Amit Verma','2026-05-14',380.00,'Entertainment','Client dinner — Bayside Convention Center GM','1 receipt attached','approved','EMP0017','2026-05-18',NULL,NULL,NULL,NULL,'2026-05-14 20:00:00','2026-05-18 09:30:00'),
  ('EXP-DEMO-0005','EMP0004','Vikram Singh','2026-06-09',215.00,'Training','Welding certification exam fee — AWS D18.1 refresher','1 receipt attached','rejected','EMP0017','2026-06-12',NULL,NULL,NULL,'Covered under training budget; route via HR training request','2026-06-09 09:15:00','2026-06-12 14:00:00'),
  ('EXP-DEMO-0006','EMP0009','Deepak Joshi','2026-07-21',540.00,'Travel','Vendor audit trip — compressor supplier, Pune','2 receipts attached','pending','EMP0017',NULL,NULL,NULL,NULL,NULL,'2026-07-21 17:40:00','2026-07-21 17:40:00'),
  ('EXP-DEMO-0007','EMP0016','Neha Agarwal','2026-09-07',3260.00,'Marketing','GulfHost trade show booth incidentals','4 receipts attached','pending',NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-07 11:10:00','2026-09-09 16:05:00'),
  ('EXP-DEMO-0008','EMP0006','Meera Nair','2026-09-09',180.00,'Office Supplies','Calibration labels and QC stationery','1 receipt attached','draft',NULL,NULL,NULL,NULL,NULL,NULL,'2026-09-09 12:00:00','2026-09-09 12:00:00');

INSERT INTO petty_cash
  (custodian, amount, date, purpose, category, "receiptNumber", "approvedBy", status, remarks, "createdAt", "updatedAt")
VALUES
  ('Pooja Mehta',85.00,'2025-10-14','Courier — drawing prints to Harbour Grill site','Courier','PC-DEMO-0001','EMP0017','approved',NULL,'2025-10-14 11:00:00','2025-10-15 09:00:00'),
  ('Pooja Mehta',120.00,'2025-11-03','Pantry supplies for shop floor','Office','PC-DEMO-0002','EMP0017','approved',NULL,'2025-11-03 10:30:00','2025-11-04 09:00:00'),
  ('Pooja Mehta',60.00,'2025-12-12','Local transport — customs document pickup','Transport','PC-DEMO-0003','EMP0017','approved',NULL,'2025-12-12 15:20:00','2025-12-13 09:00:00'),
  ('Pooja Mehta',210.00,'2026-01-28','Emergency hardware — anchor bolts for install crew','Site Expenses','PC-DEMO-0004','EMP0017','approved','Reimbursed same week','2026-01-28 09:45:00','2026-01-29 10:00:00'),
  ('Pooja Mehta',95.00,'2026-03-05','Printer cartridges — accounts office','Office','PC-DEMO-0005','EMP0017','approved',NULL,'2026-03-05 14:00:00','2026-03-06 09:00:00'),
  ('Pooja Mehta',150.00,'2026-04-22','Refreshments — customer factory visit (Golden Spoon)','Hospitality','PC-DEMO-0006','EMP0017','approved',NULL,'2026-04-22 12:30:00','2026-04-23 09:00:00'),
  ('Pooja Mehta',75.00,'2026-06-02','Courier — warranty replacement thermostat to Lakeside','Courier','PC-DEMO-0007','EMP0017','approved',NULL,'2026-06-02 16:10:00','2026-06-03 09:00:00'),
  ('Pooja Mehta',300.00,'2026-07-16','Float replenishment request','Float','PC-DEMO-0008','EMP0013','approved','Quarterly float top-up','2026-07-16 10:00:00','2026-07-17 09:00:00'),
  ('Pooja Mehta',48.00,'2026-08-25','Keys cut for new store room locks','Facilities','PC-DEMO-0009',NULL,'pending',NULL,'2026-08-25 11:20:00','2026-08-25 11:20:00'),
  ('Pooja Mehta',260.00,'2026-09-08','Taxi and porterage — GulfHost booth teardown','Transport','PC-DEMO-0010',NULL,'rejected','Should go through expense claim EXP-DEMO-0007','2026-09-08 19:00:00','2026-09-09 10:00:00');

-- ============================================================================
-- REPORTS
-- ============================================================================

DELETE FROM report_saved_items WHERE "companyId" = :company;
DELETE FROM report_catalog_items WHERE "companyId" = :company;
DELETE FROM report_datasets WHERE "companyId" = :company;

INSERT INTO report_datasets
  ("companyId", "reportKey", title, category, payload, "isActive", "createdAt", "updatedAt")
VALUES
  (:company,'sales_orders','Sales Orders','sales','{"rowCount":312,"columns":["orderNumber","customer","amount","status","orderDate"],"period":"2025-10-01..2026-09-10"}',true,'2025-10-10 09:00:00','2026-09-10 06:00:00'),
  (:company,'sales_pipeline','Sales Pipeline','sales','{"rowCount":60,"columns":["lead","stage","estimatedValue","owner"],"period":"2025-10-01..2026-09-10"}',true,'2025-10-10 09:05:00','2026-09-10 06:00:00'),
  (:company,'production_output','Production Output','production','{"rowCount":184,"columns":["workOrder","workCenter","qtyGood","qtyScrap","date"],"period":"2025-10-01..2026-09-10"}',true,'2025-10-10 09:10:00','2026-09-10 06:00:00'),
  (:company,'inventory_valuation','Inventory Valuation','inventory','{"rowCount":97,"columns":["warehouse","itemCode","qtyOnHand","unitCost","value"],"asOf":"2026-09-10"}',true,'2025-11-01 09:00:00','2026-09-10 06:00:00'),
  (:company,'ar_aging','AR Aging','finance','{"rowCount":42,"columns":["customer","invoice","dueDate","bucket","amount"],"asOf":"2026-09-10"}',true,'2025-11-01 09:05:00','2026-09-10 06:00:00'),
  (:company,'expense_summary','Expense Summary','finance','{"rowCount":28,"columns":["category","month","amount"],"period":"2025-10..2026-09"}',true,'2026-01-05 09:00:00','2026-09-01 06:00:00');

INSERT INTO report_catalog_items
  ("companyId", module, name, description, category, frequency, href, "lastGenerated", "sortOrder", "isActive", "createdAt", "updatedAt")
VALUES
  (:company,'sales','Monthly Sales Summary','Bookings, billings and backlog by month and region','Sales','Monthly','/reports/sales/monthly-summary','2026-09-01',1,true,'2025-10-10 10:00:00','2026-09-01 06:10:00'),
  (:company,'sales','Quotation Win/Loss Analysis','Win rate by segment, product line and sales owner','Sales','Monthly','/reports/sales/win-loss','2026-09-01',2,true,'2025-10-10 10:05:00','2026-09-01 06:10:00'),
  (:company,'production','Work Center Utilization','Load vs capacity per work center with bottleneck flags','Production','Weekly','/reports/production/utilization','2026-09-08',3,true,'2025-10-10 10:10:00','2026-09-08 06:10:00'),
  (:company,'production','Scrap & Rework Report','Scrap quantity and cost by work center and reason code','Production','Weekly','/reports/production/scrap-rework','2026-09-08',4,true,'2025-11-05 10:00:00','2026-09-08 06:10:00'),
  (:company,'finance','AR Aging Report','Receivables by aging bucket with DSO trend','Finance','Weekly','/reports/finance/ar-aging','2026-09-08',5,true,'2025-11-05 10:05:00','2026-09-08 06:10:00'),
  (:company,'finance','Cash Flow Statement','Operating, investing and financing cash flows','Finance','Monthly','/reports/finance/cash-flow','2026-09-01',6,true,'2025-11-05 10:10:00','2026-09-01 06:10:00'),
  (:company,'inventory','Stock Valuation by Warehouse','Inventory value by warehouse and item category','Inventory','Monthly','/reports/inventory/valuation','2026-09-01',7,true,'2026-01-08 10:00:00','2026-09-01 06:10:00'),
  (:company,'procurement','Purchase Spend Analysis','Spend by vendor, category and PO status','Procurement','Monthly','/reports/procurement/spend','2026-09-01',8,true,'2026-01-08 10:05:00','2026-09-01 06:10:00');

INSERT INTO report_saved_items
  ("companyId", name, description, category, "dataSource", config, "outputFormat", "createdByName",
   "isFavorite", "isShared", "runCount", "lastRunAt", "isActive", "createdAt", "updatedAt")
VALUES
  (:company,'Exec KPI Pack','Board-ready KPI extract for Executive Overview dashboard','executive','sales_orders','{"dashboardId":"a1e5c0d1-1111-4a11-9a11-000000000001","dashboard":"Executive Overview","filters":{"period":"last_quarter"}}','pdf','Rajesh Kumar',true,true,34,'2026-09-01',true,'2025-11-20 09:00:00','2026-09-01 07:00:00'),
  (:company,'Weekly Sales Flash','Pipeline and bookings flash tied to Sales Performance dashboard','sales','sales_pipeline','{"dashboardId":"a1e5c0d1-1111-4a11-9a11-000000000002","dashboard":"Sales Performance","filters":{"period":"last_7_days"}}','xlsx','Priya Sharma',true,true,58,'2026-09-08',true,'2025-12-01 09:00:00','2026-09-08 07:00:00'),
  (:company,'Ops Bottleneck Watch','Work-center load extract for Operations Monitor dashboard','production','production_output','{"dashboardId":"a1e5c0d1-1111-4a11-9a11-000000000003","dashboard":"Operations Monitor","filters":{"workCenters":["WC-WELD","WC-CNC","WC-ASSY"]}}','pdf','Vikram Singh',false,true,41,'2026-09-08',true,'2026-01-12 09:00:00','2026-09-08 07:00:00'),
  (:company,'Month-End AR Pack','AR aging with collector notes for finance close','finance','ar_aging','{"dashboardId":"a1e5c0d1-1111-4a11-9a11-000000000001","dashboard":"Executive Overview","filters":{"buckets":["30","60","90+"]}}','xlsx','Sanjay Malhotra',false,false,12,'2026-09-01',true,'2026-02-02 09:00:00','2026-09-01 07:00:00'),
  (:company,'Inventory Snapshot','Warehouse valuation snapshot for S&OP meeting','inventory','inventory_valuation','{"filters":{"warehouses":"all"},"groupBy":"warehouse"}','csv','Ganesh Patil',false,true,19,'2026-09-01',true,'2026-03-10 09:00:00','2026-09-01 07:00:00'),
  (:company,'Travel Spend Tracker','Expense category trend for travel policy review','finance','expense_summary','{"filters":{"category":"Travel"},"groupBy":"month"}','pdf','Sanjay Malhotra',false,false,7,'2026-08-15',true,'2026-05-04 09:00:00','2026-08-15 07:00:00');

-- ============================================================================
-- PROPOSALS
-- ============================================================================

DELETE FROM proposals WHERE "proposalNumber" LIKE 'PROP-DEMO-%';
DELETE FROM proposal_templates WHERE name LIKE 'DEMO %';

INSERT INTO proposal_templates
  (name, description, type, structure, "defaultContent", styling, "isActive", "isDefault", "createdById", "createdAt", "updatedAt")
VALUES
  ('DEMO Standard Kitchen Proposal','Default template for commercial kitchen fitout proposals','standard',
   '{"sections":["executive_summary","scope_of_work","deliverables","pricing","timeline","terms"]}',
   '{"executive_summary":"B3 MACBIS proposes a turnkey commercial kitchen solution...","terms":"Prices valid 45 days. 40% advance, 40% on delivery, 20% on commissioning."}',
   '{"primaryColor":"#0f4c81","font":"Inter","logoPosition":"top-left"}',true,true,'EMP0002','2025-10-08 09:00:00','2026-02-14 10:00:00'),
  ('DEMO Technical Compliance Response','Template for technical-spec-heavy tenders (hospitals, marine)','technical',
   '{"sections":["executive_summary","technical_specifications","compliance_matrix","deliverables","timeline"]}',
   '{"technical_specifications":"All equipment fabricated in SS304 to NSF/ANSI 2 standards..."}',
   '{"primaryColor":"#1a1a2e","font":"Inter","logoPosition":"top-center"}',true,false,'EMP0003','2025-10-08 09:10:00','2026-01-20 11:00:00'),
  ('DEMO Commercial Terms Sheet','Lightweight commercial proposal for repeat franchise customers','commercial',
   '{"sections":["executive_summary","pricing","timeline","terms"]}',
   '{"terms":"Frame-agreement pricing. Net 45. Freight included within metro limits."}',
   '{"primaryColor":"#b8860b","font":"Inter","logoPosition":"top-left"}',true,false,'EMP0007','2025-11-12 09:00:00','2025-11-12 09:00:00'),
  ('DEMO RFP Response Pack','Full RFP response with team CVs and case studies','rfp_response',
   '{"sections":["executive_summary","company_profile","scope_of_work","technical_specifications","team","case_studies","pricing","terms"]}',
   '{"company_profile":"B3 MACBIS is a leading kitchen equipment manufacturer serving hospitality, healthcare and marine segments..."}',
   '{"primaryColor":"#0f4c81","font":"Georgia","logoPosition":"cover"}',true,false,'EMP0002','2026-01-15 09:00:00','2026-06-01 12:00:00');

INSERT INTO proposals
  ("proposalNumber", title, description, type, status, "customerId", "customerName", "customerContact", "customerEmail",
   "rfpNumber", "executiveSummary", "scopeOfWork", pricing, timeline, "templateId", "createdById", "assignedToId",
   "validUntil", "sentAt", "respondedAt", version, "createdAt", "updatedAt")
VALUES
  ('PROP-DEMO-0001','Coastal Eats — Combi Oven Line Proposal','Combi oven package for 3 San Diego locations','standard','accepted',
   NULL,'Coastal Eats','Olivia Grant','olivia@coastaleats.com',NULL,
   '{"text":"Three-site combi oven rollout with installation and staff training."}','{"items":["6x combi ovens","hood modifications","install & training"]}',
   '{"subtotal":78000,"tax":6240,"total":84240,"currency":"USD"}','{"weeks":8,"milestones":["order","delivery","install","training"]}',
   (SELECT id::text FROM proposal_templates WHERE name='DEMO Standard Kitchen Proposal' LIMIT 1),'EMP0002','EMP0007',
   '2025-12-31 00:00:00','2025-11-10 10:00:00','2025-12-02 15:30:00',1,'2025-11-04 09:00:00','2025-12-02 15:30:00'),
  ('PROP-DEMO-0002','Fairview School District — Dishwashing Systems','District-wide dishwashing systems RFP response','rfp_response','sent',
   NULL,'Fairview School District','James Carter','james@fairviewsd.edu','RFP-FSD-2026-014',
   '{"text":"Standardized dishwashing systems across 12 school kitchens with 5-year service."}','{"items":["12x rack conveyor dishwashers","water treatment","5-year AMC"]}',
   '{"subtotal":142000,"tax":11360,"total":153360,"currency":"USD"}','{"weeks":16,"milestones":["award","phased delivery","summer install window"]}',
   (SELECT id::text FROM proposal_templates WHERE name='DEMO RFP Response Pack' LIMIT 1),'EMP0002','EMP0002',
   '2026-10-15 00:00:00','2026-08-20 11:00:00',NULL,2,'2026-07-28 09:00:00','2026-08-20 11:00:00'),
  ('PROP-DEMO-0003','Silverline Cruises — Full Galley Fitout','Marine-grade galley fitout for two vessels','technical','pending_review',
   NULL,'Silverline Cruises','Mia Nakamura','mia@silverlinecruises.com',NULL,
   '{"text":"Marine-certified galley fitout for MV Aurora and MV Borealis, class-approved materials."}','{"items":["galley line fabrication","cold rooms","class documentation"]}',
   '{"subtotal":318000,"tax":0,"total":318000,"currency":"USD"}','{"weeks":22,"milestones":["drawings","class approval","fabrication","dockside install"]}',
   (SELECT id::text FROM proposal_templates WHERE name='DEMO Technical Compliance Response' LIMIT 1),'EMP0003','EMP0010',
   '2026-11-30 00:00:00',NULL,NULL,1,'2026-09-02 09:00:00','2026-09-09 14:00:00'),
  ('PROP-DEMO-0004','Golden Spoon — FY27 Franchise Refresh Terms','Frame-agreement refresh for franchise kitchen packages','commercial','approved',
   (SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','Priya Shah','priya@goldenspoon.com',NULL,
   '{"text":"Updated frame-agreement pricing for FY27 franchise rollouts, 12-16 stores."}','{"items":["standard store kitchen package","spare kits","priority service SLA"]}',
   '{"perStore":38500,"estimatedStores":14,"total":539000,"currency":"USD"}','{"weeks":52,"milestones":["quarterly store batches"]}',
   (SELECT id::text FROM proposal_templates WHERE name='DEMO Commercial Terms Sheet' LIMIT 1),'EMP0007','EMP0007',
   '2027-03-31 00:00:00',NULL,NULL,1,'2026-06-18 09:00:00','2026-07-01 10:30:00'),
  ('PROP-DEMO-0005','Bayside Convention Center — Banquet Kitchen Line','Banquet kitchen line with extended warranty','standard','sent',
   NULL,'Bayside Convention Center','Noah Feldman','noah@baysideconvention.com',NULL,
   '{"text":"High-throughput banquet kitchen line for 2,000-cover events."}','{"items":["cook line","blast chillers","banquet trolleys","extended warranty"]}',
   '{"subtotal":402000,"tax":32160,"total":434160,"currency":"USD"}','{"weeks":18,"milestones":["design freeze","fabrication","install","commissioning"]}',
   (SELECT id::text FROM proposal_templates WHERE name='DEMO Standard Kitchen Proposal' LIMIT 1),'EMP0007','EMP0007',
   '2026-09-30 00:00:00','2026-06-05 09:30:00',NULL,1,'2026-05-27 09:00:00','2026-06-05 09:30:00'),
  ('PROP-DEMO-0006','Urban Roast Coffee — Espresso Station Buildout','Espresso stations for flagship cafe','standard','rejected',
   NULL,'Urban Roast Coffee','Sophia Rossi','sophia@urbanroast.com',NULL,
   '{"text":"Two custom espresso stations with undercounter refrigeration."}','{"items":["2x espresso stations","undercounter fridges","install"]}',
   '{"subtotal":28000,"tax":2240,"total":30240,"currency":"USD"}','{"weeks":6,"milestones":["order","fabrication","install"]}',
   (SELECT id::text FROM proposal_templates WHERE name='DEMO Standard Kitchen Proposal' LIMIT 1),'EMP0002','EMP0002',
   '2026-03-31 00:00:00','2026-02-10 10:00:00','2026-03-05 12:00:00',1,'2026-02-03 09:00:00','2026-03-05 12:00:00');

-- ============================================================================
-- CMS
-- ============================================================================

DELETE FROM cms_contents WHERE slug LIKE 'demo-%';
DELETE FROM cms_content_categories WHERE slug LIKE 'demo-%';

INSERT INTO cms_content_categories
  (name, slug, description, "parentId", "sortOrder", "isActive", icon, color, "metaTitle", "metaDescription", "createdAt", "updatedAt")
VALUES
  ('Products','demo-products','Product pages for the B3 MACBIS equipment range',NULL,1,true,'package','#0f4c81','Commercial Kitchen Equipment | B3 MACBIS','Explore combi ovens, blast chillers, cook lines and refrigeration built for commercial kitchens.','2025-10-06 09:00:00','2025-10-06 09:00:00'),
  ('Case Studies','demo-case-studies','Customer success stories and project write-ups',NULL,2,true,'award','#b8860b','Case Studies | B3 MACBIS','See how hotels, hospitals and cruise lines run their kitchens on B3 MACBIS equipment.','2025-10-06 09:05:00','2025-10-06 09:05:00'),
  ('Company News','demo-company-news','Announcements, events and press releases',NULL,3,true,'megaphone','#1a7f5a','News | B3 MACBIS','Latest announcements and events from B3 MACBIS.','2025-10-06 09:10:00','2025-10-06 09:10:00'),
  ('Knowledge Base','demo-knowledge-base','Care guides, maintenance docs and how-tos',NULL,4,true,'book-open','#555577','Knowledge Base | B3 MACBIS','Maintenance guides and best practices for commercial kitchen equipment.','2025-11-20 09:00:00','2025-11-20 09:00:00'),
  ('Insights Blog','demo-insights-blog','Industry trends and thought leadership',NULL,5,true,'pen-tool','#8b2252','Insights | B3 MACBIS','Trends and insights for commercial kitchen operators.','2025-12-15 09:00:00','2025-12-15 09:00:00');

INSERT INTO cms_contents
  (title, slug, excerpt, content, type, status, "featuredImage", tags, "categoryId", "authorId", "authorName",
   "metaTitle", "metaDescription", indexable, "publishedAt", "scheduledAt", "viewCount", "shareCount", version, "createdAt", "updatedAt")
VALUES
  ('BC-300 Blast Chiller Series','demo-bc-300-blast-chiller','Rapid chilling from +90C to +3C in under 90 minutes.','<h1>BC-300 Blast Chiller Series</h1><p>The BC-300 series delivers HACCP-compliant rapid chilling for high-volume kitchens, with SS304 chambers and touch-screen cycle control.</p>','page','published','/media/demo/bc-300-hero.jpg','blast chiller,refrigeration,haccp',(SELECT id::text FROM cms_content_categories WHERE slug='demo-products' LIMIT 1),'EMP0016','Neha Agarwal','BC-300 Blast Chiller Series | B3 MACBIS','HACCP-compliant blast chillers with SS304 chambers and programmable cycles.',true,'2025-10-20 10:00:00',NULL,4210,86,2,'2025-10-15 09:00:00','2026-03-12 11:00:00'),
  ('CV-Pro Combi Oven Range','demo-cv-pro-combi-oven','Steam, convection and combi modes with 120-recipe memory.','<h1>CV-Pro Combi Oven Range</h1><p>From 6-tray to 40-tray roll-in models, the CV-Pro range covers cafes to banquet operations with automatic wash and boilerless steam.</p>','page','published','/media/demo/cv-pro-hero.jpg','combi oven,cooking',(SELECT id::text FROM cms_content_categories WHERE slug='demo-products' LIMIT 1),'EMP0016','Neha Agarwal','CV-Pro Combi Ovens | B3 MACBIS','Combi ovens from 6 to 40 trays with recipe memory and auto-wash.',true,'2025-10-22 10:00:00',NULL,5830,124,3,'2025-10-16 09:00:00','2026-05-20 14:00:00'),
  ('Modular Cook Line System','demo-modular-cook-line','Configure ranges, fryers and griddles on a common chassis.','<h1>Modular Cook Line System</h1><p>Build your line from 400mm modules — gas or induction — with a continuous hygienic worktop and plinth or castor mounting.</p>','page','published','/media/demo/cook-line-hero.jpg','cook line,modular',(SELECT id::text FROM cms_content_categories WHERE slug='demo-products' LIMIT 1),'EMP0016','Neha Agarwal','Modular Cook Lines | B3 MACBIS','Modular commercial cook lines in gas and induction configurations.',true,'2025-11-03 10:00:00',NULL,3120,54,1,'2025-10-28 09:00:00','2025-11-03 10:00:00'),
  ('Blue Fig Hotels: 12 Kitchens, One Standard','demo-case-blue-fig-hotels','How a hotel group standardized 12 kitchens on B3 MACBIS equipment.','<h1>Blue Fig Hotels Case Study</h1><p>Blue Fig standardized combi ovens, cook lines and cold rooms across 12 properties, cutting service costs 23% and training time in half.</p>','case_study','published','/media/demo/case-bluefig.jpg','case study,hospitality',(SELECT id::text FROM cms_content_categories WHERE slug='demo-case-studies' LIMIT 1),'EMP0002','Priya Sharma','Blue Fig Hotels Case Study | B3 MACBIS','12 hotel kitchens standardized on one equipment platform.',true,'2026-02-05 10:00:00',NULL,1980,73,1,'2026-01-22 09:00:00','2026-02-05 10:00:00'),
  ('Metro Hospital: HACCP at 4,000 Meals a Day','demo-case-metro-hospital','A hospital kitchen rebuilt for traceability and throughput.','<h1>Metro Hospital Case Study</h1><p>Cook-chill workflow with BC-300 blast chillers and tray-line integration delivers 4,000 traceable meals daily.</p>','case_study','published','/media/demo/case-metro.jpg','case study,healthcare,haccp',(SELECT id::text FROM cms_content_categories WHERE slug='demo-case-studies' LIMIT 1),'EMP0011','Sunita Rao','Metro Hospital Case Study | B3 MACBIS','Cook-chill hospital kitchen serving 4,000 traceable meals a day.',true,'2026-05-14 10:00:00',NULL,1240,41,1,'2026-04-30 09:00:00','2026-05-14 10:00:00'),
  ('B3 MACBIS to Exhibit at GulfHost 2026','demo-news-gulfhost-2026','Visit us at Hall 4, Stand C-12 this September.','<h1>GulfHost 2026</h1><p>We are showcasing the new CV-Pro 40-tray roll-in combi and the marine galley range at GulfHost, Dubai World Trade Centre.</p>','announcement','published','/media/demo/gulfhost-2026.jpg','events,trade show',(SELECT id::text FROM cms_content_categories WHERE slug='demo-company-news' LIMIT 1),'EMP0016','Neha Agarwal','GulfHost 2026 | B3 MACBIS','Meet B3 MACBIS at GulfHost 2026, Hall 4 Stand C-12.',true,'2026-08-12 10:00:00',NULL,860,38,1,'2026-08-08 09:00:00','2026-08-12 10:00:00'),
  ('Daily Care Guide: Stainless Steel Surfaces','demo-kb-stainless-care','Keep SS304 surfaces passivated and streak-free.','<h1>Stainless Steel Care</h1><p>Daily wipe-down with neutral detergent, weekly passivation check, and what never to use (chlorides, steel wool).</p>','documentation','published',NULL,'maintenance,stainless steel',(SELECT id::text FROM cms_content_categories WHERE slug='demo-knowledge-base' LIMIT 1),'EMP0006','Meera Nair','Stainless Steel Care Guide | B3 MACBIS','Daily and weekly care routines for commercial stainless steel.',true,'2025-12-02 10:00:00',NULL,2650,112,2,'2025-11-25 09:00:00','2026-06-10 09:00:00'),
  ('Five Trends Shaping Commercial Kitchens in 2027','demo-blog-kitchen-trends-2027','Electrification, ventless cooking and data-driven maintenance.','<h1>Kitchen Trends 2027</h1><p>Draft: induction-first lines, ventless combi placement, IoT-monitored refrigeration, labour-saving automation, and circular refurbishment programs.</p>','blog_post','draft',NULL,'trends,industry',(SELECT id::text FROM cms_content_categories WHERE slug='demo-insights-blog' LIMIT 1),'EMP0016','Neha Agarwal',NULL,NULL,true,NULL,'2026-09-25 08:00:00',0,0,1,'2026-09-06 09:00:00','2026-09-09 15:00:00');

-- ============================================================================
-- PORTAL DOCUMENTS
-- ============================================================================

DELETE FROM portal_documents WHERE "companyId" = :company;

INSERT INTO portal_documents
  ("companyId", name, "docType", "customerId", "parentId", category, "sizeBytes", "itemCount", "downloadUrl", meta, "createdAt", "updatedAt")
VALUES
  (:company,'Manuals & Datasheets','folder',NULL,NULL,'manuals',0,4,NULL,'{"visibility":"all-customers"}','2025-10-10 09:00:00+00','2026-08-01 10:00:00+00'),
  (:company,'Contracts & Certificates','folder',NULL,NULL,'contracts',0,2,NULL,'{"visibility":"per-customer"}','2025-10-10 09:05:00+00','2026-09-02 12:20:00+00');

INSERT INTO portal_documents
  ("companyId", name, "docType", "customerId", "parentId", category, "sizeBytes", "itemCount", "downloadUrl", meta, "createdAt", "updatedAt")
VALUES
  (:company,'BC-300 Operating Manual (EN).pdf','file',NULL,(SELECT id::text FROM portal_documents WHERE name='Manuals & Datasheets' AND "companyId"=:company LIMIT 1),'manuals',5242880,0,'/portal/files/demo/bc-300-manual-en.pdf','{"language":"en","product":"BC-300"}','2025-10-12 10:00:00+00','2025-10-12 10:00:00+00'),
  (:company,'CV-Pro Combi Oven Datasheet.pdf','file',NULL,(SELECT id::text FROM portal_documents WHERE name='Manuals & Datasheets' AND "companyId"=:company LIMIT 1),'manuals',1048576,0,'/portal/files/demo/cv-pro-datasheet.pdf','{"product":"CV-Pro"}','2025-10-12 10:05:00+00','2026-02-01 09:00:00+00'),
  (:company,'Cold Room Maintenance Schedule.pdf','file',NULL,(SELECT id::text FROM portal_documents WHERE name='Manuals & Datasheets' AND "companyId"=:company LIMIT 1),'manuals',786432,0,'/portal/files/demo/cold-room-maintenance.pdf','{"product":"Cold Rooms"}','2025-11-08 10:00:00+00','2025-11-08 10:00:00+00'),
  (:company,'Warranty Terms 2026.pdf','file',NULL,(SELECT id::text FROM portal_documents WHERE name='Manuals & Datasheets' AND "companyId"=:company LIMIT 1),'warranty',524288,0,'/portal/files/demo/warranty-terms-2026.pdf','{"validFrom":"2026-01-01"}','2026-01-05 10:00:00+00','2026-01-05 10:00:00+00'),
  (:company,'Blue Fig Frame Agreement (signed).pdf','file',(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' LIMIT 1),(SELECT id::text FROM portal_documents WHERE name='Contracts & Certificates' AND "companyId"=:company LIMIT 1),'contracts',1536000,0,'/portal/files/demo/bluefig-frame-agreement.pdf','{"confidential":true}','2026-01-20 10:00:00+00','2026-01-20 10:00:00+00'),
  (:company,'Metro Hospital Commissioning Certificate.pdf','file',(SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' LIMIT 1),(SELECT id::text FROM portal_documents WHERE name='Contracts & Certificates' AND "companyId"=:company LIMIT 1),'certificates',358400,0,'/portal/files/demo/metro-commissioning-cert.pdf','{"issuedOn":"2026-06-28"}','2026-06-28 10:00:00+00','2026-06-28 10:00:00+00');

-- ============================================================================
-- IOT DEVICES
-- ============================================================================

DELETE FROM iot_devices WHERE "companyId" = :company;

INSERT INTO iot_devices
  ("companyId", code, name, type, status, temperature, vibration, power, uptime, "lastPing", meta, "createdAt", "updatedAt")
VALUES
  (:company,'IOT-DEMO-001','Cold Room 1 Temp Sensor','temperature-sensor','online','2.8 C','n/a','3 W','99.2%','2026-09-10 16:58','{"location":"WH-FG cold room 1","alarmHigh":"5 C","alarmLow":"0 C"}','2025-10-15 09:00:00+00','2026-09-10 16:58:00+00'),
  (:company,'IOT-DEMO-002','Cold Room 2 Temp Sensor','temperature-sensor','online','-18.4 C','n/a','3 W','98.7%','2026-09-10 16:58','{"location":"WH-FG cold room 2 (freezer)","alarmHigh":"-15 C"}','2025-10-15 09:05:00+00','2026-09-10 16:58:00+00'),
  (:company,'IOT-DEMO-003','CNC Spindle Vibration Monitor','vibration-sensor','online','41 C','2.1 mm/s','5 W','97.5%','2026-09-10 16:57','{"workCenter":"WC-CNC","alertThreshold":"4.5 mm/s"}','2025-11-20 09:00:00+00','2026-09-10 16:57:00+00'),
  (:company,'IOT-DEMO-004','Welding Bay Power Meter','power-meter','online','n/a','n/a','18.6 kW','99.8%','2026-09-10 16:58','{"workCenter":"WC-WELD","phases":3}','2025-11-20 09:10:00+00','2026-09-10 16:58:00+00'),
  (:company,'IOT-DEMO-005','Paint Booth Airflow Sensor','airflow-sensor','maintenance','24 C','n/a','4 W','91.3%','2026-09-08 11:20','{"workCenter":"WC-PAINT","note":"filter replacement scheduled"}','2026-01-12 09:00:00+00','2026-09-08 11:20:00+00'),
  (:company,'IOT-DEMO-006','Compressor Room Monitor','multi-sensor','online','38 C','1.4 mm/s','7.2 kW','99.1%','2026-09-10 16:56','{"asset":"air compressor bank","dewPoint":"3 C"}','2026-02-08 09:00:00+00','2026-09-10 16:56:00+00'),
  (:company,'IOT-DEMO-007','Assembly Line Energy Meter','power-meter','offline','n/a','n/a','0 kW','88.9%','2026-09-09 22:14','{"workCenter":"WC-ASSY","note":"gateway fault, technician assigned"}','2026-03-15 09:00:00+00','2026-09-09 22:14:00+00'),
  (:company,'IOT-DEMO-008','Test Kitchen Combi Telemetry','equipment-telemetry','online','162 C','n/a','11.4 kW','96.4%','2026-09-10 16:55','{"asset":"CV-Pro demo unit","cyclesToday":14}','2026-05-02 09:00:00+00','2026-09-10 16:55:00+00');

-- ============================================================================
-- ATTACHMENTS (generic)
-- ============================================================================

DELETE FROM attachments WHERE "storageKey" LIKE 'demo/%';

INSERT INTO attachments
  ("entityType", "entityId", "fileName", "mimeType", size, "storageKey", "uploadedBy", "createdAt")
VALUES
  ('invoice','INV-DEMO-001','inv-demo-001-signed-copy.pdf','application/pdf',214560,'demo/attachments/inv-demo-001-signed-copy.pdf','EMP0018','2025-10-24 10:00:00+00'),
  ('invoice','INV-DEMO-004','inv-demo-004-po-reference.pdf','application/pdf',186220,'demo/attachments/inv-demo-004-po-reference.pdf','EMP0018','2026-02-15 11:30:00+00'),
  ('purchase_order','PO-DEMO-0001','po-demo-0001-vendor-ack.pdf','application/pdf',98770,'demo/attachments/po-demo-0001-vendor-ack.pdf','EMP0005','2025-10-19 09:15:00+00'),
  ('purchase_order','PO-DEMO-0008','po-demo-0008-proforma-invoice.pdf','application/pdf',245880,'demo/attachments/po-demo-0008-proforma-invoice.pdf','EMP0009','2026-08-21 14:00:00+00'),
  ('purchase_order','PO-DEMO-0008','po-demo-0008-packing-list.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',44210,'demo/attachments/po-demo-0008-packing-list.xlsx','EMP0009','2026-09-01 10:20:00+00'),
  ('project','PRJ-DEMO-SILVERLINE','silverline-galley-ga-drawing.pdf','application/pdf',3145728,'demo/attachments/silverline-galley-ga-drawing.pdf','EMP0010','2026-09-05 15:00:00+00'),
  ('project','PRJ-DEMO-METRO','metro-hospital-punchlist.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',58900,'demo/attachments/metro-hospital-punchlist.xlsx','EMP0011','2026-09-02 12:40:00+00'),
  ('quotation','QT-DEMO-2026-0017','qt-2026-0017-boq.xlsx','application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',132480,'demo/attachments/qt-2026-0017-boq.xlsx','EMP0007','2026-09-04 10:45:00+00'),
  ('expense_claim','EXP-DEMO-0007','gulfhost-booth-receipts.pdf','application/pdf',884120,'demo/attachments/gulfhost-booth-receipts.pdf','EMP0016','2026-09-07 11:15:00+00'),
  ('proposal','PROP-DEMO-0003','silverline-compliance-matrix.pdf','application/pdf',412300,'demo/attachments/silverline-compliance-matrix.pdf','EMP0003','2026-09-03 16:30:00+00');
