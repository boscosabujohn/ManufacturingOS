-- Demo seed — Workflow module (instances, builder graphs, quality gates, phases,
-- approvals, order tracking, notifications) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears demo rows first, then re-inserts. Delete predicates:
--   notification_templates          code LIKE 'DEMO-%'
--   notification_preferences        "userId" IN (EMP0001..EMP0006)
--   workflow_config_templates       "companyId" = :company
--   workflow_automation_rules       "companyId" = :company
--   workflow_pending_approvals      "companyId" = :company
--   workflow_rules                  name IN (explicit demo list)
--   workflow_builder_graphs         "createdBy" = 'demo-seed'
--   workflow_nodes / workflow_edges data->>'seed' = 'DEMO'
--   workflow_instances              "instanceNumber" LIKE 'WFI-DEMO-%' (steps/history via subselect first)
--   workflow_approvals              metadata->>'seed' = 'DEMO' (approval_steps cascade)
--   workflow_approval_comments      metadata->>'seed' = 'DEMO'
--   workflow_documents              metadata->>'seed' = 'DEMO'
--   defects / quality_gates         metadata->>'seed' = 'DEMO' (gate items cascade; defects deleted before gates)
--   project_phases/phase_transitions metadata->>'seed' = 'DEMO'
--   order_tracking                  order_number LIKE 'SO-DEMO-%'
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- notification_templates (unique on code+channel; DEMO- prefix)
-- ---------------------------------------------------------------------------
DELETE FROM notification_templates WHERE code LIKE 'DEMO-%';
INSERT INTO notification_templates
  (code, channel, "subjectTemplate", "bodyTemplate", "isActive", "createdAt", "updatedAt")
VALUES
  ('DEMO-WF-APPROVAL-REQ','email','Approval required: {{referenceNo}}','Hello {{approverName}}, {{requesterName}} has requested your approval on {{referenceNo}} ({{module}}). Amount: {{amount}}. Due by {{dueDate}}.',true,'2025-10-02 09:00:00','2025-10-02 09:00:00'),
  ('DEMO-WF-APPROVAL-REQ','in_app','Approval required','{{referenceNo}} awaits your approval (step {{step}} of {{totalSteps}}).',true,'2025-10-02 09:05:00','2025-10-02 09:05:00'),
  ('DEMO-WF-SLA-BREACH','email','SLA breached: {{referenceNo}}','Approval {{referenceNo}} has exceeded its SLA of {{slaHours}} hours and has been escalated to {{escalatedTo}}.',true,'2025-10-02 09:10:00','2025-10-02 09:10:00'),
  ('DEMO-QC-GATE-FAIL','email','QC gate failed: {{projectCode}} phase {{phase}}','Quality gate {{gateType}} for project {{projectCode}} failed inspection. {{defectCount}} defect(s) logged. Inspector: {{inspectorName}}.',true,'2025-10-03 10:00:00','2025-10-03 10:00:00'),
  ('DEMO-ORDER-STATUS','email','Order {{orderNumber}} update: {{status}}','Dear {{customerName}}, your order {{orderNumber}} moved to status {{status}} on {{eventDate}}. Expected delivery: {{expectedDelivery}}.',true,'2025-10-03 10:15:00','2025-10-03 10:15:00'),
  ('DEMO-PHASE-ADVANCE','in_app','Project phase advanced','Project {{projectCode}} advanced from phase {{fromPhase}} to phase {{toPhase}} ({{phaseName}}).',true,'2025-10-04 11:00:00','2025-10-04 11:00:00'),
  ('DEMO-DEFECT-ASSIGNED','in_app','Defect assigned to you','Defect {{defectCode}} ({{severity}}) on project {{projectCode}} has been assigned to you for rework.',true,'2025-10-04 11:20:00','2025-10-04 11:20:00'),
  ('DEMO-DOC-REVIEW','email','Document pending review: {{fileName}}','{{uploaderName}} uploaded {{documentType}} v{{version}} for project {{projectCode}}. Please review and approve.',true,'2025-10-05 09:30:00','2025-10-05 09:30:00');

-- ---------------------------------------------------------------------------
-- notification_preferences (unique on userId+channel)
-- ---------------------------------------------------------------------------
DELETE FROM notification_preferences WHERE "userId" IN ('EMP0001','EMP0002','EMP0003','EMP0004','EMP0005','EMP0006');
INSERT INTO notification_preferences
  ("userId", channel, enabled, settings, "createdAt", "updatedAt")
VALUES
  ('EMP0001','email',true,'{"seed":"DEMO","digest":"daily","quietHours":"22:00-07:00"}','2025-10-06 08:00:00','2026-01-12 10:00:00'),
  ('EMP0001','in_app',true,'{"seed":"DEMO","sound":true}','2025-10-06 08:00:00','2025-10-06 08:00:00'),
  ('EMP0002','email',true,'{"seed":"DEMO","digest":"immediate"}','2025-10-06 08:10:00','2025-10-06 08:10:00'),
  ('EMP0002','sms',false,'{"seed":"DEMO","reason":"opted-out"}','2025-10-06 08:10:00','2026-02-03 09:15:00'),
  ('EMP0003','email',true,'{"seed":"DEMO","digest":"daily"}','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  ('EMP0003','push',true,'{"seed":"DEMO","device":"android"}','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  ('EMP0004','email',true,'{"seed":"DEMO","digest":"weekly"}','2025-10-08 09:30:00','2026-03-20 14:00:00'),
  ('EMP0004','in_app',true,'{"seed":"DEMO","sound":false}','2025-10-08 09:30:00','2025-10-08 09:30:00'),
  ('EMP0005','email',true,'{"seed":"DEMO","digest":"immediate"}','2025-10-09 10:00:00','2025-10-09 10:00:00'),
  ('EMP0005','sms',true,'{"seed":"DEMO","criticalOnly":true}','2025-10-09 10:00:00','2026-04-15 11:30:00'),
  ('EMP0006','in_app',true,'{"seed":"DEMO","sound":true}','2025-10-10 10:30:00','2025-10-10 10:30:00'),
  ('EMP0006','push',false,'{"seed":"DEMO","reason":"no-device"}','2025-10-10 10:30:00','2026-05-02 16:45:00');

-- ---------------------------------------------------------------------------
-- workflow_config_templates
-- ---------------------------------------------------------------------------
DELETE FROM workflow_config_templates WHERE "companyId" = :company;
INSERT INTO workflow_config_templates
  ("companyId", name, description, category, "triggerType", steps, "activeInstances", status, "stepDetails", "createdAt", "updatedAt")
VALUES
  (:company,'Sales Order Approval','Two-tier approval for sales orders above threshold','Sales','record_created',4,3,'active','[{"step":1,"name":"Sales Manager Review","sla":4},{"step":2,"name":"Finance Credit Check","sla":8},{"step":3,"name":"GM Approval","sla":24},{"step":4,"name":"Order Confirmation","sla":48}]','2025-10-05 09:00:00','2026-06-11 10:00:00'),
  (:company,'Purchase Order Release','Value-banded PO release workflow','Procurement','record_created',5,2,'active','[{"step":1,"name":"Buyer Review","sla":4},{"step":2,"name":"Procurement Head","sla":8},{"step":3,"name":"Finance Review","sla":12},{"step":4,"name":"CFO Approval","sla":24},{"step":5,"name":"PO Dispatch","sla":48}]','2025-10-05 09:20:00','2026-05-20 15:30:00'),
  (:company,'Design Sign-off','Client drawing and BOQ sign-off before production','Engineering','manual',3,1,'active','[{"step":1,"name":"Internal Design Review","sla":24},{"step":2,"name":"Client Approval","sla":72},{"step":3,"name":"BOQ Freeze","sla":24}]','2025-10-12 11:00:00','2026-04-18 09:00:00'),
  (:company,'NCR Disposition','Non-conformance review and disposition','Quality','record_created',3,1,'active','[{"step":1,"name":"QC Engineer Triage","sla":8},{"step":2,"name":"MRB Review","sla":24},{"step":3,"name":"Disposition & Rework","sla":48}]','2025-11-02 10:00:00','2026-03-14 12:00:00'),
  (:company,'Leave Approval','Standard leave request routing','HR','record_created',3,0,'active','[{"step":1,"name":"Reporting Manager","sla":24},{"step":2,"name":"Department Head","sla":48},{"step":3,"name":"HR Confirmation","sla":72}]','2025-11-15 09:30:00','2025-11-15 09:30:00'),
  (:company,'Installation Handover','Site installation completion and client handover','Projects','manual',4,1,'draft','[{"step":1,"name":"Installation QC","sla":24},{"step":2,"name":"Snag Closure","sla":72},{"step":3,"name":"Client Walkthrough","sla":48},{"step":4,"name":"Handover Pack Sign-off","sla":24}]','2026-01-20 14:00:00','2026-07-01 10:00:00');

-- ---------------------------------------------------------------------------
-- workflow_automation_rules
-- ---------------------------------------------------------------------------
DELETE FROM workflow_automation_rules WHERE "companyId" = :company;
INSERT INTO workflow_automation_rules
  ("companyId", name, description, trigger, "triggerDetails", action, status, frequency,
   "lastRun", "nextRun", "executionCount", "successRate", "avgExecutionTime", category, priority,
   "createdByName", conditions, actions, "createdAt", "updatedAt")
VALUES
  (:company,'Auto-create WO on SO confirmation','Creates production work orders when a sales order is confirmed','record_updated','sales_orders.status = confirmed','create_work_order','active','event','2026-06-11 10:05:00','','214',98.60,'1.8s','Sales','high','Rajesh Kumar','[{"field":"status","operator":"equals","value":"Confirmed"}]','[{"type":"create_record","target":"work_orders"},{"type":"notify","template":"DEMO-ORDER-STATUS"}]','2025-10-06 09:00:00','2026-06-11 10:05:00'),
  (:company,'Escalate stale approvals','Escalates approvals pending beyond SLA to the next level','schedule','every 1 hour','escalate_approval','active','hourly','2026-09-10 09:00:00','2026-09-10 10:00:00',7412,99.20,'0.4s','Approvals','critical','Priya Sharma','[{"field":"slaStatus","operator":"equals","value":"breached"}]','[{"type":"escalate","levels":1},{"type":"notify","template":"DEMO-WF-SLA-BREACH"}]','2025-10-06 09:30:00','2026-09-10 09:00:00'),
  (:company,'QC failure defect logging','Opens defect records automatically when a quality gate fails','record_updated','quality_gates.status = failed','create_defect','active','event','2026-04-03 14:22:00','',38,94.70,'1.1s','Quality','high','Anita Desai','[{"field":"status","operator":"equals","value":"failed"}]','[{"type":"create_record","target":"defects"},{"type":"notify","template":"DEMO-QC-GATE-FAIL"}]','2025-11-03 10:00:00','2026-04-03 14:22:00'),
  (:company,'Low-stock purchase requisition','Raises a PR when stock falls below reorder level','record_updated','inventory.quantity < reorderLevel','create_purchase_requisition','active','event','2026-08-28 16:40:00','',126,96.80,'2.3s','Procurement','medium','Vikram Singh','[{"field":"quantityAvailable","operator":"less_than","value":"reorderLevel"}]','[{"type":"create_record","target":"purchase_requisitions"}]','2025-12-01 11:00:00','2026-08-28 16:40:00'),
  (:company,'Dispatch notification to customer','Emails the customer when an order is dispatched','record_updated','order_tracking.status = dispatched','send_notification','active','event','2026-07-18 12:10:00','',54,100.00,'0.7s','Logistics','medium','Suresh Patel','[{"field":"status","operator":"equals","value":"dispatched"}]','[{"type":"notify","template":"DEMO-ORDER-STATUS","channel":"email"}]','2026-01-10 09:00:00','2026-07-18 12:10:00'),
  (:company,'Weekly workflow health digest','Sends a weekly digest of stuck workflow instances to admins','schedule','every Monday 08:00','send_digest','paused','weekly','2026-08-31 08:00:00','2026-09-14 08:00:00',44,100.00,'3.5s','Operations','low','Meera Nair','[{"field":"status","operator":"in","value":["running","paused"]},{"field":"ageDays","operator":"greater_than","value":7}]','[{"type":"notify","recipients":"workflow-admins","channel":"email"}]','2026-02-02 08:00:00','2026-08-31 08:00:00');

-- ---------------------------------------------------------------------------
-- workflow_rules (engine rules)
-- ---------------------------------------------------------------------------
DELETE FROM workflow_rules WHERE name IN (
  'High-value SO needs GM approval','PO above 50k routes to CFO','Critical defect blocks phase advance',
  'Auto-skip credit check for prepaid','Design docs need dual review','Urgent instances jump the queue');
INSERT INTO workflow_rules
  (name, description, conditions, actions, priority, enabled, "triggerEvent", "createdAt", "updatedAt")
VALUES
  ('High-value SO needs GM approval','Sales orders above 150,000 require the GM approval step','{"all":[{"fact":"totalAmount","operator":"greaterThan","value":150000},{"fact":"sourceType","operator":"equals","value":"sales_order"}]}','[{"type":"insert_step","stepId":"gm-approval","after":"finance-credit-check"}]',10,true,'instance.created','2025-10-07 09:00:00','2025-10-07 09:00:00'),
  ('PO above 50k routes to CFO','Purchase orders above 50,000 add a CFO approval step','{"all":[{"fact":"totalAmount","operator":"greaterThan","value":50000},{"fact":"sourceType","operator":"equals","value":"purchase_order"}]}','[{"type":"insert_step","stepId":"cfo-approval","after":"finance-review"}]',10,true,'instance.created','2025-10-07 09:15:00','2025-10-07 09:15:00'),
  ('Critical defect blocks phase advance','A project with open critical defects cannot advance phases','{"any":[{"fact":"openCriticalDefects","operator":"greaterThan","value":0}]}','[{"type":"block_transition","reason":"open critical defects"},{"type":"notify","template":"DEMO-QC-GATE-FAIL"}]',5,true,'phase.transition.requested','2025-11-04 10:00:00','2026-03-14 12:30:00'),
  ('Auto-skip credit check for prepaid','Skip the finance credit check when payment terms are Advance','{"all":[{"fact":"paymentTerms","operator":"equals","value":"Advance"}]}','[{"type":"skip_step","stepId":"finance-credit-check"}]',20,true,'step.entered','2025-12-10 11:00:00','2025-12-10 11:00:00'),
  ('Design docs need dual review','Drawings and MEP documents require two reviewers before approval','{"all":[{"fact":"documentType","operator":"in","value":["drawing","mep"]}]}','[{"type":"require_approvers","count":2}]',15,true,'document.submitted','2026-01-08 09:30:00','2026-01-08 09:30:00'),
  ('Urgent instances jump the queue','Urgent-priority instances are processed before all others','{"all":[{"fact":"priority","operator":"equals","value":"urgent"}]}','[{"type":"set_queue_weight","value":100}]',1,false,'instance.created','2026-02-14 10:00:00','2026-06-30 09:00:00');

-- ---------------------------------------------------------------------------
-- workflow_builder_graphs (self-contained designer graphs, jsonb nodes/edges)
-- ---------------------------------------------------------------------------
DELETE FROM workflow_builder_graphs WHERE "createdBy" = 'demo-seed';
INSERT INTO workflow_builder_graphs
  (name, description, nodes, edges, status, "createdBy", "updatedBy", "createdAt", "updatedAt")
VALUES
  ('Sales Order Approval Flow','Designed approval flow: sales manager -> finance -> GM -> confirm',
   '[{"id":"n1","type":"start","position":{"x":80,"y":200},"data":{"label":"SO Submitted"}},{"id":"n2","type":"approval","position":{"x":280,"y":200},"data":{"label":"Sales Manager Review","role":"sales_manager","slaHours":4}},{"id":"n3","type":"condition","position":{"x":480,"y":200},"data":{"label":"Amount > 150k?"}},{"id":"n4","type":"approval","position":{"x":680,"y":120},"data":{"label":"GM Approval","role":"general_manager","slaHours":24}},{"id":"n5","type":"action","position":{"x":680,"y":280},"data":{"label":"Confirm Order","action":"confirm_sales_order"}},{"id":"n6","type":"end","position":{"x":880,"y":200},"data":{"label":"Done"}}]',
   '[{"id":"e1","source":"n1","target":"n2"},{"id":"e2","source":"n2","target":"n3","label":"approved"},{"id":"e3","source":"n3","target":"n4","label":"yes"},{"id":"e4","source":"n3","target":"n5","label":"no"},{"id":"e5","source":"n4","target":"n5","label":"approved"},{"id":"e6","source":"n5","target":"n6"}]',
   'published','demo-seed','demo-seed','2025-10-15 10:00:00','2026-02-10 14:30:00'),
  ('NCR Disposition Flow','Designed non-conformance flow: triage -> MRB -> rework/scrap -> close',
   '[{"id":"n1","type":"start","position":{"x":80,"y":180},"data":{"label":"NCR Raised"}},{"id":"n2","type":"action","position":{"x":260,"y":180},"data":{"label":"QC Triage","action":"classify_severity"}},{"id":"n3","type":"condition","position":{"x":440,"y":180},"data":{"label":"Severity?"}},{"id":"n4","type":"approval","position":{"x":620,"y":100},"data":{"label":"MRB Review","role":"mrb_board","slaHours":24}},{"id":"n5","type":"action","position":{"x":620,"y":260},"data":{"label":"Rework","action":"create_rework_order"}},{"id":"n6","type":"notification","position":{"x":800,"y":180},"data":{"label":"Notify Owner","template":"DEMO-DEFECT-ASSIGNED"}},{"id":"n7","type":"end","position":{"x":960,"y":180},"data":{"label":"Closed"}}]',
   '[{"id":"e1","source":"n1","target":"n2"},{"id":"e2","source":"n2","target":"n3"},{"id":"e3","source":"n3","target":"n4","label":"critical/major"},{"id":"e4","source":"n3","target":"n5","label":"minor"},{"id":"e5","source":"n4","target":"n5","label":"rework"},{"id":"e6","source":"n5","target":"n6"},{"id":"e7","source":"n6","target":"n7"}]',
   'draft','demo-seed','demo-seed','2026-03-05 11:00:00','2026-03-05 11:00:00');

-- ---------------------------------------------------------------------------
-- workflow_nodes / workflow_edges (canvas persisted against workflow_definitions)
-- ---------------------------------------------------------------------------
DELETE FROM workflow_edges WHERE data->>'seed' = 'DEMO';
DELETE FROM workflow_nodes WHERE data->>'seed' = 'DEMO';
INSERT INTO workflow_nodes
  ("workflowDefinitionId", type, "positionX", "positionY", data, "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'start',80,200,'{"seed":"DEMO","key":"stp-start","label":"Sales Order Confirmed"}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'action',280,200,'{"seed":"DEMO","key":"stp-boq","label":"Generate BOQ","action":"generate_boq"}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'approval',480,200,'{"seed":"DEMO","key":"stp-design","label":"Design Sign-off","role":"design_head","slaHours":72}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'action',680,200,'{"seed":"DEMO","key":"stp-wo","label":"Create Work Orders","action":"create_work_orders"}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'end',880,200,'{"seed":"DEMO","key":"stp-end","label":"In Production"}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'start',80,160,'{"seed":"DEMO","key":"qi-start","label":"WO Reaches QC"}','2025-11-06 10:00:00','2025-11-06 10:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'action',280,160,'{"seed":"DEMO","key":"qi-inspect","label":"Run Checklist","action":"run_qc_checklist"}','2025-11-06 10:00:00','2025-11-06 10:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'condition',480,160,'{"seed":"DEMO","key":"qi-passfail","label":"All Items Pass?"}','2025-11-06 10:00:00','2025-11-06 10:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'action',680,80,'{"seed":"DEMO","key":"qi-release","label":"Release to Dispatch","action":"release_to_dispatch"}','2025-11-06 10:00:00','2025-11-06 10:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'action',680,240,'{"seed":"DEMO","key":"qi-ncr","label":"Raise NCR","action":"create_defect"}','2025-11-06 10:00:00','2025-11-06 10:00:00');

INSERT INTO workflow_edges
  ("workflowDefinitionId", source, target, label, data, "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'stp-start','stp-boq',NULL,'{"seed":"DEMO"}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'stp-boq','stp-design',NULL,'{"seed":"DEMO"}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'stp-design','stp-wo','approved','{"seed":"DEMO"}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'stp-design','stp-boq','rejected','{"seed":"DEMO","loop":true}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'stp-wo','stp-end',NULL,'{"seed":"DEMO"}','2025-10-16 09:00:00','2025-10-16 09:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'qi-start','qi-inspect',NULL,'{"seed":"DEMO"}','2025-11-06 10:00:00','2025-11-06 10:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'qi-inspect','qi-passfail',NULL,'{"seed":"DEMO"}','2025-11-06 10:00:00','2025-11-06 10:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'qi-passfail','qi-release','pass','{"seed":"DEMO"}','2025-11-06 10:00:00','2025-11-06 10:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'qi-passfail','qi-ncr','fail','{"seed":"DEMO"}','2025-11-06 10:00:00','2025-11-06 10:00:00'),
  ((SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'qi-ncr','qi-inspect','re-inspect','{"seed":"DEMO","loop":true}','2025-11-06 10:00:00','2025-11-06 10:00:00');

-- ---------------------------------------------------------------------------
-- workflow_instances (children workflow_steps + workflow_history deleted first)
-- ---------------------------------------------------------------------------
DELETE FROM workflow_history WHERE "instanceId" IN (SELECT id FROM workflow_instances WHERE "instanceNumber" LIKE 'WFI-DEMO-%');
DELETE FROM workflow_steps   WHERE "instanceId" IN (SELECT id FROM workflow_instances WHERE "instanceNumber" LIKE 'WFI-DEMO-%');
DELETE FROM workflow_instances WHERE "instanceNumber" LIKE 'WFI-DEMO-%';
INSERT INTO workflow_instances
  ("instanceNumber", "definitionId", status, priority, "currentStepId", "currentStepName",
   "sourceType", "sourceId", "sourceNumber", context, "startedAt", "completedAt", "dueDate",
   "totalSteps", "completedSteps", "progressPercentage", "createdBy", "createdAt", "updatedAt")
VALUES
  ('WFI-DEMO-0001',(SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'completed','normal',NULL,NULL,'sales_order',(SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0001'),'SO-DEMO-0001','{"customer":"Harbour Grill Restaurants","amount":86612}','2025-10-14 10:30:00','2025-10-21 16:00:00','2025-10-28 17:00:00',4,4,100.00,'EMP0001','2025-10-14 10:30:00','2025-10-21 16:00:00'),
  ('WFI-DEMO-0002',(SELECT id FROM workflow_definitions WHERE name = 'Sales to Production'),'completed','high',NULL,NULL,'sales_order',(SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0005'),'SO-DEMO-0005','{"customer":"Blue Fig Hotels Group","amount":243646.4}','2026-02-19 12:00:00','2026-03-02 15:30:00','2026-03-05 17:00:00',4,4,100.00,'EMP0001','2026-02-19 12:00:00','2026-03-02 15:30:00'),
  ('WFI-DEMO-0003',(SELECT id FROM workflow_definitions WHERE name = 'Quality Inspection'),'completed','normal',NULL,NULL,'work_order',(SELECT id::text FROM work_orders WHERE "workOrderNumber" = 'WO-DEMO-0003'),'WO-DEMO-0003','{"checklist":"final-qc-kitchen-line"}','2025-12-08 09:00:00','2025-12-09 14:00:00','2025-12-12 17:00:00',3,3,100.00,'EMP0003','2025-12-08 09:00:00','2025-12-09 14:00:00'),
  ('WFI-DEMO-0004',(SELECT id FROM workflow_definitions WHERE name = 'Order Fulfillment'),'running','high','step-dispatch','Dispatch & Shipping','sales_order',(SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0009'),'SO-DEMO-0009','{"customer":"Golden Spoon Franchises","amount":251458}','2026-05-05 11:30:00',NULL,'2026-09-25 17:00:00',5,3,60.00,'EMP0002','2026-05-05 11:30:00','2026-08-30 10:15:00'),
  ('WFI-DEMO-0005',(SELECT id FROM workflow_definitions WHERE name = 'Purchase Requisition'),'completed','normal',NULL,NULL,'purchase_requisition','PR-DEMO-0107','PR-DEMO-0107','{"requestedBy":"EMP0005","items":6}','2026-01-12 09:30:00','2026-01-14 11:00:00','2026-01-16 17:00:00',3,3,100.00,'EMP0005','2026-01-12 09:30:00','2026-01-14 11:00:00'),
  ('WFI-DEMO-0006',(SELECT id FROM workflow_definitions WHERE name = 'Goods Receipt'),'running','normal','step-grn-qc','GRN Quality Check','purchase_order',(SELECT id::text FROM purchase_orders ORDER BY "createdAt" LIMIT 1),'PO-GRN-DEMO-01','{"dockDoor":"D2","pallets":4}','2026-08-22 10:00:00',NULL,'2026-09-15 17:00:00',3,1,33.33,'EMP0004','2026-08-22 10:00:00','2026-09-09 08:45:00'),
  ('WFI-DEMO-0007',(SELECT id FROM workflow_definitions WHERE name = 'Procurement to Inventory'),'paused','low','step-putaway','Putaway Confirmation','purchase_order',(SELECT id::text FROM purchase_orders ORDER BY "createdAt" OFFSET 1 LIMIT 1),'PO-P2I-DEMO-02','{"pauseReason":"bin capacity review"}','2026-07-30 09:00:00',NULL,'2026-09-20 17:00:00',4,2,50.00,'EMP0004','2026-07-30 09:00:00','2026-08-15 13:20:00'),
  ('WFI-DEMO-0008',(SELECT id FROM workflow_definitions WHERE name = 'Order Fulfillment'),'running','urgent','step-production','Production Execution','sales_order',(SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0012'),'SO-DEMO-0012','{"customer":"Metro Hospital Kitchens","amount":234230,"expedite":true}','2026-06-11 10:30:00',NULL,'2026-10-10 17:00:00',5,2,40.00,'EMP0002','2026-06-11 10:30:00','2026-09-08 17:40:00');

-- ---------------------------------------------------------------------------
-- workflow_steps
-- ---------------------------------------------------------------------------
INSERT INTO workflow_steps
  ("instanceId", "stepDefinitionId", "stepName", description, "stepType", status, "order",
   input, output, "retryCount", "maxRetries", "startedAt", "completedAt", "durationMs", "executedBy", "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0001'),'stp-boq','Generate BOQ','Auto-generate bill of quantities from SO lines','action','completed',1,'{"soNumber":"SO-DEMO-0001"}','{"boqLines":18}',0,3,'2025-10-14 10:31:00','2025-10-14 10:31:04',4200,'system','2025-10-14 10:30:00','2025-10-14 10:31:04'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0001'),'stp-design','Design Sign-off','Design head approval of drawings and BOQ','approval','completed',2,'{"approver":"EMP0003"}','{"decision":"approved"}',0,3,'2025-10-14 10:32:00','2025-10-17 15:00:00',NULL,'EMP0003','2025-10-14 10:30:00','2025-10-17 15:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0001'),'stp-wo','Create Work Orders','Spawn production work orders','action','completed',3,'{"soNumber":"SO-DEMO-0001"}','{"workOrders":["WO-DEMO-0001","WO-DEMO-0002"]}',0,3,'2025-10-17 15:05:00','2025-10-17 15:05:06',6100,'system','2025-10-14 10:30:00','2025-10-17 15:05:06'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0002'),'stp-boq','Generate BOQ','Auto-generate bill of quantities from SO lines','action','completed',1,'{"soNumber":"SO-DEMO-0005"}','{"boqLines":42}',1,3,'2026-02-19 12:01:00','2026-02-19 12:04:30',8900,'system','2026-02-19 12:00:00','2026-02-19 12:04:30'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0002'),'stp-design','Design Sign-off','Design head approval of drawings and BOQ','approval','completed',2,'{"approver":"EMP0003"}','{"decision":"approved","conditions":"revised hood layout"}',0,3,'2026-02-19 12:05:00','2026-02-27 11:30:00',NULL,'EMP0003','2026-02-19 12:00:00','2026-02-27 11:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0002'),'stp-wo','Create Work Orders','Spawn production work orders','action','completed',3,'{"soNumber":"SO-DEMO-0005"}','{"workOrders":["WO-DEMO-0009","WO-DEMO-0010"]}',0,3,'2026-03-02 15:20:00','2026-03-02 15:20:05',5400,'system','2026-02-19 12:00:00','2026-03-02 15:20:05'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0003'),'qi-inspect','Run Checklist','Execute final QC checklist','action','completed',1,'{"checklistId":"final-qc-kitchen-line"}','{"itemsChecked":22,"failed":0}',0,3,'2025-12-08 09:05:00','2025-12-08 16:30:00',NULL,'EMP0008','2025-12-08 09:00:00','2025-12-08 16:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0003'),'qi-passfail','All Items Pass?','Evaluate checklist outcome','condition','completed',2,'{"failedItems":0}','{"branch":"pass"}',0,3,'2025-12-08 16:31:00','2025-12-08 16:31:01',300,'system','2025-12-08 09:00:00','2025-12-08 16:31:01'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0003'),'qi-release','Release to Dispatch','Mark WO ready for dispatch','action','completed',3,'{"woNumber":"WO-DEMO-0003"}','{"released":true}',0,3,'2025-12-09 13:55:00','2025-12-09 14:00:00',NULL,'EMP0008','2025-12-08 09:00:00','2025-12-09 14:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0004'),'step-confirm','Order Confirmation','Confirm order and payment terms','action','completed',1,'{"soNumber":"SO-DEMO-0009"}','{"confirmed":true}',0,3,'2026-05-05 11:35:00','2026-05-05 14:00:00',NULL,'EMP0002','2026-05-05 11:30:00','2026-05-05 14:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0004'),'step-production','Production Execution','Manufacture ordered line items','action','completed',2,'{"workOrders":["WO-DEMO-0021"]}','{"completedOn":"2026-08-10"}',0,3,'2026-05-08 08:00:00','2026-08-10 17:00:00',NULL,'EMP0010','2026-05-05 11:30:00','2026-08-10 17:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0004'),'step-qc','Final QC','Final quality inspection before dispatch','approval','completed',3,'{"inspector":"EMP0008"}','{"decision":"passed"}',0,3,'2026-08-11 09:00:00','2026-08-12 15:00:00',NULL,'EMP0008','2026-05-05 11:30:00','2026-08-12 15:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0004'),'step-dispatch','Dispatch & Shipping','Arrange packing and carrier pickup','action','running',4,'{"carrier":"pending-selection"}',NULL,0,3,'2026-08-30 10:15:00',NULL,NULL,NULL,'2026-05-05 11:30:00','2026-08-30 10:15:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0004'),'step-install','Installation & Handover','On-site installation and client sign-off','wait','pending',5,NULL,NULL,0,3,NULL,NULL,NULL,NULL,'2026-05-05 11:30:00','2026-05-05 11:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0005'),'step-mgr','Manager Approval','Reporting manager approves the PR','approval','completed',1,'{"approver":"EMP0007"}','{"decision":"approved"}',0,3,'2026-01-12 09:35:00','2026-01-12 16:20:00',NULL,'EMP0007','2026-01-12 09:30:00','2026-01-12 16:20:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0005'),'step-budget','Budget Check','Verify budget availability','condition','completed',2,'{"costCenter":"CC-PROD"}','{"withinBudget":true}',0,3,'2026-01-12 16:21:00','2026-01-12 16:21:02',450,'system','2026-01-12 09:30:00','2026-01-12 16:21:02'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0005'),'step-po','Convert to PO','Create purchase order from approved PR','action','completed',3,'{"prNumber":"PR-DEMO-0107"}','{"poCreated":true}',0,3,'2026-01-14 10:50:00','2026-01-14 11:00:00',NULL,'EMP0005','2026-01-12 09:30:00','2026-01-14 11:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0006'),'step-grn-create','Create GRN','Register goods receipt against PO','action','completed',1,'{"pallets":4}','{"grnNumber":"GRN-DEMO-0311"}',0,3,'2026-08-22 10:05:00','2026-08-22 11:30:00',NULL,'EMP0004','2026-08-22 10:00:00','2026-08-22 11:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0006'),'step-grn-qc','GRN Quality Check','Incoming material inspection','action','running',2,'{"sampleSize":12}',NULL,0,3,'2026-08-25 09:00:00',NULL,NULL,'EMP0008','2026-08-22 10:00:00','2026-09-09 08:45:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0006'),'step-grn-post','Post to Inventory','Post accepted quantity to stock','action','pending',3,NULL,NULL,0,3,NULL,NULL,NULL,NULL,'2026-08-22 10:00:00','2026-08-22 10:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0007'),'step-receive','Receive Material','Receive PO material at dock','action','completed',1,'{"dockDoor":"D2"}','{"received":true}',0,3,'2026-07-30 09:05:00','2026-07-30 12:00:00',NULL,'EMP0004','2026-07-30 09:00:00','2026-07-30 12:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0007'),'step-inspect','Incoming Inspection','Inspect received material','action','completed',2,'{"sampleSize":8}','{"accepted":8,"rejected":0}',0,3,'2026-07-31 09:00:00','2026-08-01 15:00:00',NULL,'EMP0008','2026-07-30 09:00:00','2026-08-01 15:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0007'),'step-putaway','Putaway Confirmation','Confirm bin putaway of accepted stock','wait','waiting',3,'{"suggestedBin":"A-12-3"}',NULL,0,3,'2026-08-02 09:00:00',NULL,NULL,NULL,'2026-07-30 09:00:00','2026-08-15 13:20:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0008'),'step-confirm','Order Confirmation','Confirm order and payment terms','action','completed',1,'{"soNumber":"SO-DEMO-0012"}','{"confirmed":true}',0,3,'2026-06-11 10:35:00','2026-06-11 12:00:00',NULL,'EMP0002','2026-06-11 10:30:00','2026-06-11 12:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0008'),'step-production','Production Execution','Manufacture ordered line items','action','running',2,'{"workOrders":["WO-DEMO-0029","WO-DEMO-0030"]}',NULL,0,3,'2026-06-15 08:00:00',NULL,NULL,'EMP0010','2026-06-11 10:30:00','2026-09-08 17:40:00');

-- ---------------------------------------------------------------------------
-- workflow_history
-- ---------------------------------------------------------------------------
INSERT INTO workflow_history
  ("instanceId", "stepId", "eventType", severity, message, details, "eventData", "userId", "userName", "createdAt")
VALUES
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0001'),NULL,'instance_created','info','Instance WFI-DEMO-0001 created from SO-DEMO-0001','Triggered by sales order confirmation','{"sourceNumber":"SO-DEMO-0001"}','EMP0001','Rajesh Kumar','2025-10-14 10:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0001'),'stp-design','approval_granted','info','Design sign-off approved',NULL,'{"approver":"EMP0003"}','EMP0003','Anita Desai','2025-10-17 15:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0001'),NULL,'instance_completed','info','Instance completed; work orders created','2 work orders spawned','{"workOrders":["WO-DEMO-0001","WO-DEMO-0002"]}',NULL,'system','2025-10-21 16:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0002'),'stp-boq','step_retried','warning','BOQ generation retried after timeout','First attempt timed out at 120s','{"retryCount":1}',NULL,'system','2026-02-19 12:03:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0002'),'stp-design','approval_granted','info','Design sign-off approved with conditions','Hood layout revision requested','{"conditions":"revised hood layout"}','EMP0003','Anita Desai','2026-02-27 11:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0002'),NULL,'instance_completed','info','Instance completed; work orders created',NULL,'{"workOrders":["WO-DEMO-0009","WO-DEMO-0010"]}',NULL,'system','2026-03-02 15:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0003'),'qi-inspect','step_completed','info','QC checklist completed: 22/22 passed',NULL,'{"itemsChecked":22,"failed":0}','EMP0008','Kiran Reddy','2025-12-08 16:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0003'),NULL,'instance_completed','info','WO-DEMO-0003 released to dispatch',NULL,NULL,'EMP0008','Kiran Reddy','2025-12-09 14:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0004'),NULL,'instance_started','info','Order fulfillment started for SO-DEMO-0009',NULL,'{"amount":251458}','EMP0002','Priya Sharma','2026-05-05 11:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0004'),'step-qc','approval_granted','info','Final QC passed',NULL,'{"inspector":"EMP0008"}','EMP0008','Kiran Reddy','2026-08-12 15:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0004'),'step-dispatch','step_started','info','Dispatch step started; awaiting carrier selection',NULL,NULL,NULL,'system','2026-08-30 10:15:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0005'),'step-mgr','approval_granted','info','PR approved by reporting manager',NULL,'{"approver":"EMP0007"}','EMP0007','Amit Verma','2026-01-12 16:20:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0005'),NULL,'instance_completed','info','PR converted to purchase order',NULL,'{"prNumber":"PR-DEMO-0107"}','EMP0005','Suresh Patel','2026-01-14 11:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0006'),'step-grn-create','step_completed','info','GRN GRN-DEMO-0311 registered',NULL,'{"pallets":4}','EMP0004','Vikram Singh','2026-08-22 11:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0006'),'step-grn-qc','step_started','info','Incoming inspection started','Sample size 12 per AQL plan',NULL,'EMP0008','Kiran Reddy','2026-08-25 09:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0007'),NULL,'instance_paused','warning','Instance paused: bin capacity review','Aisle A-12 over capacity; awaiting reslotting','{"pauseReason":"bin capacity review"}','EMP0004','Vikram Singh','2026-08-15 13:20:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0008'),NULL,'instance_started','info','Urgent order fulfillment started for SO-DEMO-0012',NULL,'{"expedite":true}','EMP0002','Priya Sharma','2026-06-11 10:30:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0008'),'step-production','step_started','info','Production started on WO-DEMO-0029 / WO-DEMO-0030',NULL,'{"workOrders":["WO-DEMO-0029","WO-DEMO-0030"]}','EMP0010','Ravi Menon','2026-06-15 08:00:00'),
  ((SELECT id FROM workflow_instances WHERE "instanceNumber" = 'WFI-DEMO-0008'),'step-production','error_occurred','error','SS-304 sheet shortage flagged during nesting','Procurement notified; expected replenishment 2026-09-14','{"material":"SS-304 1.2mm"}',NULL,'system','2026-09-02 11:25:00');

-- ---------------------------------------------------------------------------
-- workflow_approvals (approval_steps cascade on delete)
-- ---------------------------------------------------------------------------
DELETE FROM workflow_approvals WHERE metadata->>'seed' = 'DEMO';
INSERT INTO workflow_approvals
  ("projectId", "approvalType", "referenceId", "workflowType", "currentStep", status,
   "createdBy", "completedAt", description, metadata, "createdAt")
VALUES
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'design','DRW-DEMO-A101','sequential',2,'approved','EMP0003','2026-01-20 15:00:00','Kitchen line GA drawing rev B sign-off','{"seed":"DEMO","chain":"Sales Order Approval Chain"}','2026-01-12 10:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'boq','BOQ-DEMO-0114','sequential',2,'approved','EMP0002','2026-02-02 11:30:00','BOQ freeze for Grand Hyatt kitchen line','{"seed":"DEMO"}','2026-01-25 09:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'qc','QG-DEMO-P4-FINAL','sequential',1,'in_review','EMP0008',NULL,'Final QC gate approval for phase 4','{"seed":"DEMO"}','2026-08-20 09:30:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'payment','INV-DEMO-MS2','sequential',2,'pending','EMP0002',NULL,'Milestone 2 invoice release (40%)','{"seed":"DEMO","amount":58528}','2026-08-25 10:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'design','DRW-DEMO-S201','sequential',2,'approved','EMP0003','2026-03-10 14:00:00','Solar array mounting layout sign-off','{"seed":"DEMO"}','2026-03-02 09:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'qc','QG-DEMO-P4-PROD','sequential',1,'rejected','EMP0008','2026-04-03 14:00:00','Production QC gate — weld porosity found','{"seed":"DEMO","defects":2}','2026-04-01 09:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0006'),'client_drawing','DRW-DEMO-AL01','sequential',1,'pending','EMP0003',NULL,'Automation line concept drawing for client review','{"seed":"DEMO"}','2026-08-18 11:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0006'),'document','PLAN-DEMO-AL-EXEC','sequential',1,'cancelled','EMP0001','2026-09-01 10:00:00','Execution plan v1 — superseded by v2','{"seed":"DEMO","supersededBy":"v2"}','2026-08-20 09:00:00');

-- ---------------------------------------------------------------------------
-- approval_steps
-- ---------------------------------------------------------------------------
INSERT INTO approval_steps
  ("approvalId", "stepNumber", "approverId", "approverRole", status, "decidedAt", comments, "createdAt")
VALUES
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'DRW-DEMO-A101' AND metadata->>'seed' = 'DEMO'),1,'EMP0003','design_head','approved','2026-01-15 16:00:00','Dimensions verified against site survey.','2026-01-12 10:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'DRW-DEMO-A101' AND metadata->>'seed' = 'DEMO'),2,'EMP0001','project_manager','approved','2026-01-20 15:00:00','Approved for client submission.','2026-01-12 10:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'BOQ-DEMO-0114' AND metadata->>'seed' = 'DEMO'),1,'EMP0002','sales_manager','approved','2026-01-28 12:00:00','Margins within band.','2026-01-25 09:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'BOQ-DEMO-0114' AND metadata->>'seed' = 'DEMO'),2,'EMP0015','finance_manager','approved','2026-02-02 11:30:00','Costing verified; freeze confirmed.','2026-01-25 09:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'QG-DEMO-P4-FINAL' AND metadata->>'seed' = 'DEMO'),1,'EMP0008','qc_inspector','pending',NULL,NULL,'2026-08-20 09:30:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'QG-DEMO-P4-FINAL' AND metadata->>'seed' = 'DEMO'),2,'EMP0003','quality_head','pending',NULL,NULL,'2026-08-20 09:30:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'INV-DEMO-MS2' AND metadata->>'seed' = 'DEMO'),1,'EMP0015','finance_manager','approved','2026-08-27 15:30:00','Milestone completion evidence attached.','2026-08-25 10:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'INV-DEMO-MS2' AND metadata->>'seed' = 'DEMO'),2,'EMP0017','general_manager','pending',NULL,NULL,'2026-08-25 10:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'DRW-DEMO-S201' AND metadata->>'seed' = 'DEMO'),1,'EMP0003','design_head','approved','2026-03-06 10:00:00','Wind-load calcs attached and verified.','2026-03-02 09:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'DRW-DEMO-S201' AND metadata->>'seed' = 'DEMO'),2,'EMP0001','project_manager','approved','2026-03-10 14:00:00','Proceed to fabrication.','2026-03-02 09:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'QG-DEMO-P4-PROD' AND metadata->>'seed' = 'DEMO'),1,'EMP0008','qc_inspector','rejected','2026-04-03 14:00:00','Weld porosity on frames F-03 and F-07; rework required.','2026-04-01 09:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'DRW-DEMO-AL01' AND metadata->>'seed' = 'DEMO'),1,'EMP0003','design_head','pending',NULL,NULL,'2026-08-18 11:00:00'),
  ((SELECT id FROM workflow_approvals WHERE "referenceId" = 'PLAN-DEMO-AL-EXEC' AND metadata->>'seed' = 'DEMO'),1,'EMP0001','project_manager','skipped','2026-09-01 10:00:00','Cancelled — plan superseded by v2.','2026-08-20 09:00:00');

-- ---------------------------------------------------------------------------
-- workflow_approval_comments
-- ---------------------------------------------------------------------------
DELETE FROM workflow_approval_comments WHERE metadata->>'seed' = 'DEMO';
INSERT INTO workflow_approval_comments
  ("approvalId", "authorId", "authorName", body, metadata, "createdAt")
VALUES
  ((SELECT id::text FROM workflow_approvals WHERE "referenceId" = 'DRW-DEMO-A101' AND metadata->>'seed' = 'DEMO'),'EMP0003','Anita Desai','Rev B incorporates the revised extraction hood clearance. Ready for PM review.','{"seed":"DEMO"}','2026-01-15 16:05:00'),
  ((SELECT id::text FROM workflow_approvals WHERE "referenceId" = 'DRW-DEMO-A101' AND metadata->>'seed' = 'DEMO'),'EMP0001','Rajesh Kumar','Confirmed with site team — clearance is fine. Approving.','{"seed":"DEMO"}','2026-01-20 14:55:00'),
  ((SELECT id::text FROM workflow_approvals WHERE "referenceId" = 'BOQ-DEMO-0114' AND metadata->>'seed' = 'DEMO'),'EMP0015','Arun Gupta','SS-316 line items repriced per Q1 vendor contract before freeze.','{"seed":"DEMO"}','2026-02-01 10:20:00'),
  ((SELECT id::text FROM workflow_approvals WHERE "referenceId" = 'QG-DEMO-P4-FINAL' AND metadata->>'seed' = 'DEMO'),'EMP0008','Kiran Reddy','Checklist 20/22 complete; awaiting burner calibration certificates.','{"seed":"DEMO"}','2026-09-01 09:40:00'),
  ((SELECT id::text FROM workflow_approvals WHERE "referenceId" = 'INV-DEMO-MS2' AND metadata->>'seed' = 'DEMO'),'EMP0002','Priya Sharma','Client PO amendment attached covering the milestone scope change.','{"seed":"DEMO"}','2026-08-26 11:15:00'),
  ((SELECT id::text FROM workflow_approvals WHERE "referenceId" = 'QG-DEMO-P4-PROD' AND metadata->>'seed' = 'DEMO'),'EMP0008','Kiran Reddy','Porosity exceeds AWS D1.1 limits on two frames. NCR raised; rework routed to weld cell 2.','{"seed":"DEMO"}','2026-04-03 14:10:00'),
  ((SELECT id::text FROM workflow_approvals WHERE "referenceId" = 'QG-DEMO-P4-PROD' AND metadata->>'seed' = 'DEMO'),'EMP0010','Ravi Menon','Rework completed 2026-04-08; re-inspection requested.','{"seed":"DEMO"}','2026-04-08 16:30:00'),
  ((SELECT id::text FROM workflow_approvals WHERE "referenceId" = 'DRW-DEMO-AL01' AND metadata->>'seed' = 'DEMO'),'EMP0002','Priya Sharma','Client asked for conveyor pitch options at 400mm and 450mm — please include both in the concept.','{"seed":"DEMO"}','2026-08-24 09:50:00');

-- ---------------------------------------------------------------------------
-- workflow_pending_approvals (inbox projection)
-- ---------------------------------------------------------------------------
DELETE FROM workflow_pending_approvals WHERE "companyId" = :company;
INSERT INTO workflow_pending_approvals
  ("companyId", "referenceNo", title, description, module, "moduleUrl", "requestedBy", "requestedAt",
   amount, priority, "dueDate", "slaStatus", step, "totalSteps", "currentStep", status, payload, "createdAt", "updatedAt")
VALUES
  (:company,'QG-DEMO-P4-FINAL','Final QC gate — Industrial Kitchen 2026','Phase 4 final quality gate sign-off','Quality','/quality/gates','Kiran Reddy','2026-08-20 09:30',NULL,'high','2026-09-12','at_risk','QC Inspector Review',2,1,'pending','{"projectCode":"PRJ-2026-0001","gateType":"final_qc"}','2026-08-20 09:30:00','2026-09-09 08:00:00'),
  (:company,'INV-DEMO-MS2','Milestone 2 invoice release','40% milestone billing for Grand Hyatt kitchen line','Finance','/finance/invoices','Priya Sharma','2026-08-25 10:00',58528.00,'high','2026-09-15','on_track','GM Approval',2,2,'pending','{"projectCode":"PRJ-2026-0001"}','2026-08-25 10:00:00','2026-09-08 12:00:00'),
  (:company,'DRW-DEMO-AL01','Automation line concept drawing','Client-facing concept drawing for AutoParts Ltd','Projects','/projects/documents','Anita Desai','2026-08-18 11:00',NULL,'medium','2026-09-18','on_track','Design Head Review',1,1,'pending','{"projectCode":"PRJ-2026-0006"}','2026-08-18 11:00:00','2026-08-18 11:00:00'),
  (:company,'SO-DEMO-0012','Sales order confirmation — Metro Hospital','Urgent hospital kitchen order awaiting GM confirmation','Sales','/sales/orders','Priya Sharma','2026-06-11 10:30',234230.00,'critical','2026-09-11','breached','GM Approval',4,3,'pending','{"orderNumber":"SO-DEMO-0012"}','2026-06-11 10:30:00','2026-09-10 09:00:00'),
  (:company,'PO-DEMO-EXP-118','PO release — expedited SS-304 sheets','Expedited raw material PO to cover WFI-DEMO-0008 shortage','Procurement','/procurement/purchase-orders','Vikram Singh','2026-09-03 10:15',46800.00,'critical','2026-09-12','at_risk','CFO Approval',5,4,'pending','{"linkedInstance":"WFI-DEMO-0008"}','2026-09-03 10:15:00','2026-09-09 17:30:00'),
  (:company,'LV-DEMO-0442','Leave request — Deepak Joshi','5-day annual leave 2026-09-21 to 2026-09-25','HR','/hr/leave','Deepak Joshi','2026-09-05 09:00',NULL,'low','2026-09-14','on_track','Department Head',3,2,'pending','{"leaveType":"annual","days":5}','2026-09-05 09:00:00','2026-09-08 10:00:00'),
  (:company,'EXP-DEMO-0287','Expense claim — site visit Dubai','Travel and lodging for PRJ-2026-0001 site inspection','HR','/hr/expenses','Mohan Das','2026-08-30 14:00',2350.00,'medium','2026-09-13','on_track','Finance Review',3,3,'pending','{"costCenter":"CC-PRJ-0001"}','2026-08-30 14:00:00','2026-09-07 15:20:00'),
  (:company,'BOQ-DEMO-0114','BOQ freeze — Grand Hyatt kitchen line','Bill of quantities freeze after client sign-off','Sales','/sales/boq','Priya Sharma','2026-01-25 09:00',146320.00,'medium','2026-02-03','on_track','Completed',2,2,'approved','{"projectCode":"PRJ-2026-0001"}','2026-01-25 09:00:00','2026-02-02 11:30:00');

-- ---------------------------------------------------------------------------
-- project_phases (MACBIS: 1 order, 2 design, 3 production, 4 QC, 5 dispatch, 6 install, 7 handover)
-- ---------------------------------------------------------------------------
DELETE FROM phase_transitions WHERE metadata->>'seed' = 'DEMO';
DELETE FROM project_phases WHERE metadata->>'seed' = 'DEMO';
INSERT INTO project_phases
  ("projectId", "currentPhase", "currentStep", status, "blockingReasons", metadata,
   "targetCompletionDate", "actualCompletionDate", "createdBy", "createdAt", "updatedAt")
VALUES
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),4,'final_qc','active',NULL,'{"seed":"DEMO","projectCode":"PRJ-2026-0001","phaseName":"Quality Gates"}','2026-11-30',NULL,'EMP0001','2026-01-05 09:00:00','2026-08-20 09:30:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),3,'fabrication','blocked','["Rework of frames F-03/F-07 pending re-inspection"]','{"seed":"DEMO","projectCode":"PRJ-2026-0005","phaseName":"Production"}','2026-10-31',NULL,'EMP0001','2026-02-10 09:00:00','2026-04-03 14:30:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0006'),1,'requirements_capture','active',NULL,'{"seed":"DEMO","projectCode":"PRJ-2026-0006","phaseName":"Order & Requirements"}','2027-03-31',NULL,'EMP0001','2026-08-10 10:00:00','2026-09-05 11:00:00');

-- ---------------------------------------------------------------------------
-- phase_transitions
-- ---------------------------------------------------------------------------
INSERT INTO phase_transitions
  ("projectId", "fromPhase", "toPhase", "fromStep", "toStep", "transitionType", "triggeredBy", "conditionsMet", metadata, "triggeredAt")
VALUES
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'1',2,'order_confirmation','design_kickoff','automatic','system','{"orderConfirmed":true,"advanceReceived":true}','{"seed":"DEMO"}','2026-01-12 10:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'2',3,'boq_freeze','production_kickoff','automatic','system','{"designApproved":true,"boqFrozen":true}','{"seed":"DEMO"}','2026-02-03 09:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'3',4,'fabrication_complete','material_qa','manual','EMP0010','{"workOrdersCompleted":true}','{"seed":"DEMO"}','2026-08-14 16:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'1',2,'order_confirmation','design_kickoff','automatic','system','{"orderConfirmed":true}','{"seed":"DEMO"}','2026-02-18 10:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'2',3,'design_signoff','fabrication','manual','EMP0001','{"designApproved":true}','{"seed":"DEMO"}','2026-03-12 09:30:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'4',3,'production_qc','rework','rollback','EMP0008','{"qcFailed":true,"defects":2}','{"seed":"DEMO","reason":"weld porosity NCR"}','2026-04-03 14:30:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0006'),NULL,1,NULL,'requirements_capture','automatic','system','{"projectCreated":true}','{"seed":"DEMO"}','2026-08-10 10:00:00');

-- ---------------------------------------------------------------------------
-- quality_gates (defects deleted first — FK without cascade; items cascade)
-- ---------------------------------------------------------------------------
DELETE FROM defects WHERE metadata->>'seed' = 'DEMO';
DELETE FROM quality_gates WHERE metadata->>'seed' = 'DEMO';
INSERT INTO quality_gates
  ("projectId", phase, "gateType", "checklistTemplateId", "inspectorId", status,
   "inspectionDate", passed, comments, metadata, "createdAt")
VALUES
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),3,'material_qa','CHK-MAT-SS','EMP0008','passed','2026-02-20 10:00:00','true','All SS-304/316 sheets within spec; mill certs on file.','{"seed":"DEMO","projectCode":"PRJ-2026-0001"}','2026-02-18 09:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),4,'production_qc','CHK-PROD-KITCHEN','EMP0008','passed','2026-08-16 14:00:00','true','Line assembly checks complete; minor scratch polished out.','{"seed":"DEMO","projectCode":"PRJ-2026-0001"}','2026-08-14 16:30:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),4,'final_qc','CHK-FINAL-KITCHEN','EMP0008','in_progress',NULL,NULL,'Awaiting burner calibration certificates.','{"seed":"DEMO","projectCode":"PRJ-2026-0001"}','2026-08-20 09:30:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),3,'material_qa','CHK-MAT-STRUCT','EMP0008','passed','2026-03-18 11:00:00','true','Structural sections and fasteners verified.','{"seed":"DEMO","projectCode":"PRJ-2026-0005"}','2026-03-16 09:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),4,'production_qc','CHK-PROD-WELD','EMP0008','failed','2026-04-03 13:30:00','false','Weld porosity beyond AWS D1.1 on frames F-03, F-07.','{"seed":"DEMO","projectCode":"PRJ-2026-0005"}','2026-04-01 09:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),5,'final_qc','CHK-FINAL-STRUCT','EMP0008','pending',NULL,NULL,NULL,'{"seed":"DEMO","projectCode":"PRJ-2026-0005"}','2026-04-01 09:05:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0006'),3,'material_qa','CHK-MAT-AUTO','EMP0008','pending',NULL,NULL,NULL,'{"seed":"DEMO","projectCode":"PRJ-2026-0006"}','2026-09-01 10:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),6,'installation_review','CHK-INSTALL-KITCHEN','EMP0013','pending',NULL,NULL,NULL,'{"seed":"DEMO","projectCode":"PRJ-2026-0001"}','2026-08-28 10:00:00');

-- ---------------------------------------------------------------------------
-- quality_gate_items ("passed" is a varchar-backed boolean: 'true'/'false')
-- ---------------------------------------------------------------------------
INSERT INTO quality_gate_items
  ("qualityGateId", "itemDescription", passed, comments, metadata)
VALUES
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 3 AND "gateType" = 'material_qa' AND metadata->>'seed' = 'DEMO'),'Verify SS-304 sheet thickness 1.2mm +/- 0.05','true','Measured 1.19-1.22mm across 10 samples.','{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 3 AND "gateType" = 'material_qa' AND metadata->>'seed' = 'DEMO'),'Mill test certificates match heat numbers','true',NULL,'{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 3 AND "gateType" = 'material_qa' AND metadata->>'seed' = 'DEMO'),'Surface free of rust and deep scratches','true','One sheet with light scuff, accepted for concealed panel.','{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),'Counter tops level within 2mm/m','true',NULL,'{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),'Weld seams ground and passivated','true',NULL,'{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),'Door alignment and gasket seating','true','Minor scratch on unit 4 door polished out.','{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 4 AND "gateType" = 'final_qc' AND metadata->>'seed' = 'DEMO'),'Electrical safety test (earth continuity, insulation)','true','All units passed at 500V DC.','{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 4 AND "gateType" = 'final_qc' AND metadata->>'seed' = 'DEMO'),'Burner calibration certificates on file',NULL,'Awaiting calibration lab results.','{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 4 AND "gateType" = 'final_qc' AND metadata->>'seed' = 'DEMO'),'Functional run test 30 min at full load','true',NULL,'{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005') AND phase = 3 AND "gateType" = 'material_qa' AND metadata->>'seed' = 'DEMO'),'Structural section dimensions per drawing','true',NULL,'{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005') AND phase = 3 AND "gateType" = 'material_qa' AND metadata->>'seed' = 'DEMO'),'Galvanising coating thickness >= 85 microns','true','Averaged 92 microns.','{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),'Visual weld inspection per AWS D1.1','false','Porosity clusters on frames F-03 and F-07.','{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),'Frame squareness within 3mm diagonal','true',NULL,'{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),'Fastener torque per spec sheet','true',NULL,'{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 6 AND "gateType" = 'installation_review' AND metadata->>'seed' = 'DEMO'),'Site utilities (gas, power, drainage) ready',NULL,'Site visit scheduled 2026-09-20.','{"seed":"DEMO"}'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 6 AND "gateType" = 'installation_review' AND metadata->>'seed' = 'DEMO'),'Clear access route for equipment move-in',NULL,NULL,'{"seed":"DEMO"}');

-- ---------------------------------------------------------------------------
-- defects
-- ---------------------------------------------------------------------------
INSERT INTO defects
  ("qualityGateId", "projectId", severity, description, location, "assignedTo", status,
   photos, "resolutionNotes", "resolvedAt", "resolvedBy", metadata, "createdAt", "updatedAt")
VALUES
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),(SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'major','DEF-WELD: porosity cluster on frame F-03 lower chord weld, exceeds AWS D1.1 acceptance.','Weld cell 2, frame F-03','EMP0010','resolved','s3://demo/defects/f03-porosity-1.jpg','Gouged, re-welded with fresh E7018 rods, re-inspected clean.','2026-04-08 16:00:00','EMP0010','{"seed":"DEMO","defectCode":"DEF-WELD"}','2026-04-03 14:00:00','2026-04-08 16:00:00'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),(SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'major','DEF-WELD: lack of fusion on frame F-07 gusset joint.','Weld cell 2, frame F-07','EMP0010','in_rework','s3://demo/defects/f07-fusion-1.jpg',NULL,NULL,NULL,'{"seed":"DEMO","defectCode":"DEF-WELD"}','2026-04-03 14:05:00','2026-09-01 10:00:00'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 4 AND "gateType" = 'production_qc' AND metadata->>'seed' = 'DEMO'),(SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'minor','DEF-SURF: light scratch on refrigerated counter door, unit 4.','Assembly bay 1, unit 4','EMP0012','closed',NULL,'Polished out with 400-grit and passivation; visual re-check OK.','2026-08-16 12:00:00','EMP0012','{"seed":"DEMO","defectCode":"DEF-SURF"}','2026-08-15 10:30:00','2026-08-16 12:00:00'),
  (NULL,(SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'minor','DEF-MISS: castor lock kits missing from hardware pack for prep tables (qty 6).','Packing area','EMP0006','resolved',NULL,'Kits pulled from stock and added to shipment manifest.','2026-08-29 11:00:00','EMP0006','{"seed":"DEMO","defectCode":"DEF-MISS"}','2026-08-27 09:15:00','2026-08-29 11:00:00'),
  (NULL,(SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'critical','DEF-FUNC: combi oven unit 2 fails to hold set temperature above 220C during burn-in.','Test bench 3','EMP0009','open','s3://demo/defects/oven2-temp-log.png',NULL,NULL,NULL,'{"seed":"DEMO","defectCode":"DEF-FUNC"}','2026-09-04 15:40:00','2026-09-04 15:40:00'),
  (NULL,(SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'minor','DEF-PAINT: orange peel on two mounting rail sections.','Paint shop rack B','EMP0012','closed',NULL,'Sections sanded and recoated in batch 26-114.','2026-05-06 14:00:00','EMP0012','{"seed":"DEMO","defectCode":"DEF-PAINT"}','2026-05-02 10:00:00','2026-05-06 14:00:00'),
  (NULL,(SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0006'),'minor','DEF-WRONG: vendor shipped M10 anchor bolts against M12 specification on advance material.','Receiving dock','EMP0004','rejected',NULL,'Rejected at receipt; return material authorisation issued to vendor.','2026-09-06 12:30:00','EMP0004','{"seed":"DEMO","defectCode":"DEF-WRONG"}','2026-09-05 11:20:00','2026-09-06 12:30:00'),
  ((SELECT id FROM quality_gates WHERE "projectId" = (SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001') AND phase = 3 AND "gateType" = 'material_qa' AND metadata->>'seed' = 'DEMO'),(SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'minor','DEF-DIM: one SS sheet 1.14mm, below 1.15mm lower tolerance.','Raw material store','EMP0004','closed',NULL,'Sheet quarantined and returned; replacement within spec.','2026-02-24 10:00:00','EMP0004','{"seed":"DEMO","defectCode":"DEF-DIM"}','2026-02-20 10:30:00','2026-02-24 10:00:00');

-- ---------------------------------------------------------------------------
-- workflow_documents
-- ---------------------------------------------------------------------------
DELETE FROM workflow_documents WHERE metadata->>'seed' = 'DEMO';
INSERT INTO workflow_documents
  ("projectId", "documentType", version, "fileName", "fileUrl", "fileSize", "mimeType", status,
   "uploadedBy", "reviewedBy", "approvedBy", "approvedAt", "reviewComments", metadata, "uploadedAt", "updatedAt")
VALUES
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'drawing','B','GA-KitchenLine-RevB.pdf','s3://demo/docs/prj0001/GA-KitchenLine-RevB.pdf',4718234,'application/pdf','approved','EMP0003','EMP0001','EMP0001','2026-01-20 15:00:00','Clearance verified with site team.','{"seed":"DEMO","drawingNo":"DRW-DEMO-A101"}','2026-01-12 09:45:00','2026-01-20 15:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'boq','1.0','BOQ-GrandHyatt-Frozen.xlsx','s3://demo/docs/prj0001/BOQ-GrandHyatt-Frozen.xlsx',382144,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','approved','EMP0002','EMP0015','EMP0015','2026-02-02 11:30:00','Costing verified against Q1 vendor contracts.','{"seed":"DEMO","boqNo":"BOQ-DEMO-0114"}','2026-01-25 08:50:00','2026-02-02 11:30:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'mep','A','MEP-Services-Layout.dwg','s3://demo/docs/prj0001/MEP-Services-Layout.dwg',9120345,'application/acad','pending_review','EMP0003','EMP0001',NULL,NULL,NULL,'{"seed":"DEMO"}','2026-08-18 14:20:00','2026-08-18 14:20:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0001'),'3d_render','1','Kitchen-3D-Walkthrough.mp4','s3://demo/docs/prj0001/Kitchen-3D-Walkthrough.mp4',88123456,'video/mp4','approved','EMP0016','EMP0002','EMP0002','2026-01-30 10:00:00','Shared with client for marketing pack.','{"seed":"DEMO"}','2026-01-28 16:00:00','2026-01-30 10:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'drawing','A','Solar-Mounting-Layout.pdf','s3://demo/docs/prj0005/Solar-Mounting-Layout.pdf',2814592,'application/pdf','approved','EMP0003','EMP0001','EMP0001','2026-03-10 14:00:00','Wind-load calculations verified.','{"seed":"DEMO","drawingNo":"DRW-DEMO-S201"}','2026-03-02 08:40:00','2026-03-10 14:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0005'),'boq','2.1','BOQ-SolarArray-v2.1.xlsx','s3://demo/docs/prj0005/BOQ-SolarArray-v2.1.xlsx',298401,'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet','draft','EMP0002',NULL,NULL,NULL,NULL,'{"seed":"DEMO","note":"pending rework cost adjustment"}','2026-04-10 11:30:00','2026-09-02 09:15:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0006'),'drawing','concept-1','AutomationLine-Concept.pdf','s3://demo/docs/prj0006/AutomationLine-Concept.pdf',5230118,'application/pdf','pending_review','EMP0003','EMP0002',NULL,NULL,'Client wants 400mm and 450mm conveyor pitch options shown.','{"seed":"DEMO","drawingNo":"DRW-DEMO-AL01"}','2026-08-18 10:50:00','2026-08-24 10:00:00'),
  ((SELECT id::text FROM projects WHERE project_code = 'PRJ-2026-0006'),'handover_package','draft','Handover-Pack-Template.docx','s3://demo/docs/prj0006/Handover-Pack-Template.docx',148230,'application/vnd.openxmlformats-officedocument.wordprocessingml.document','draft','EMP0001',NULL,NULL,NULL,NULL,'{"seed":"DEMO"}','2026-09-01 15:00:00','2026-09-01 15:00:00');

-- ---------------------------------------------------------------------------
-- order_tracking (order_number unique, SO-DEMO-% used as delete predicate)
-- ---------------------------------------------------------------------------
DELETE FROM order_tracking WHERE order_number LIKE 'SO-DEMO-%';
INSERT INTO order_tracking
  (order_id, order_number, customer_id, customer_name, status, total_amount, item_count,
   expected_delivery_date, actual_delivery_date, completed_date, events, work_orders, shipments, invoices, payments, metadata, created_at, updated_at)
VALUES
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0001'),'SO-DEMO-0001',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Harbour Grill Restaurants' LIMIT 1),'Harbour Grill Restaurants','completed',86612.00,6,'2025-12-05 00:00:00','2025-12-03 14:30:00','2025-12-15 17:00:00','[{"status":"order_placed","at":"2025-10-14T10:00:00Z"},{"status":"in_production","at":"2025-10-22T08:00:00Z"},{"status":"dispatched","at":"2025-11-28T09:30:00Z"},{"status":"delivered","at":"2025-12-03T14:30:00Z"},{"status":"completed","at":"2025-12-15T17:00:00Z"}]','["WO-DEMO-0001","WO-DEMO-0002"]','[{"shipmentNo":"SHP-DEMO-0001","carrier":"West Coast Freight"}]','[{"invoiceNo":"INV-DEMO-0001"}]','[{"paymentNo":"PAY-DEMO-0001","amount":86612}]','{"seed":"DEMO"}','2025-10-14 10:00:00','2025-12-15 17:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0002'),'SO-DEMO-0002',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','completed',186794.00,11,'2026-02-10 00:00:00','2026-02-06 11:00:00','2026-02-20 17:00:00','[{"status":"order_placed","at":"2025-11-25T11:00:00Z"},{"status":"in_production","at":"2025-12-04T08:00:00Z"},{"status":"delivered","at":"2026-02-06T11:00:00Z"},{"status":"completed","at":"2026-02-20T17:00:00Z"}]','["WO-DEMO-0003","WO-DEMO-0004"]','[{"shipmentNo":"SHP-DEMO-0002","carrier":"Sunbelt Logistics"}]','[{"invoiceNo":"INV-DEMO-0002"}]','[{"paymentNo":"PAY-DEMO-0002","amount":186794}]','{"seed":"DEMO"}','2025-11-25 11:00:00','2026-02-20 17:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0003'),'SO-DEMO-0003',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Summit Catering Services' LIMIT 1),'Summit Catering Services','completed',91308.40,7,'2026-03-01 00:00:00','2026-02-26 10:15:00','2026-03-10 17:00:00','[{"status":"order_placed","at":"2025-12-22T09:30:00Z"},{"status":"in_production","at":"2026-01-05T08:00:00Z"},{"status":"delivered","at":"2026-02-26T10:15:00Z"},{"status":"completed","at":"2026-03-10T17:00:00Z"}]','["WO-DEMO-0005"]','[{"shipmentNo":"SHP-DEMO-0003","carrier":"Rocky Mountain Express"}]','[{"invoiceNo":"INV-DEMO-0003"}]','[{"paymentNo":"PAY-DEMO-0003","amount":91308.4}]','{"seed":"DEMO"}','2025-12-22 09:30:00','2026-03-10 17:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0004'),'SO-DEMO-0004',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Lakeside Resort & Spa' LIMIT 1),'Lakeside Resort & Spa','delivered',146320.00,9,'2026-04-20 00:00:00','2026-04-22 13:00:00',NULL,'[{"status":"order_placed","at":"2026-01-15T10:00:00Z"},{"status":"in_production","at":"2026-01-28T08:00:00Z"},{"status":"dispatched","at":"2026-04-15T09:00:00Z"},{"status":"delivered","at":"2026-04-22T13:00:00Z"}]','["WO-DEMO-0007","WO-DEMO-0008"]','[{"shipmentNo":"SHP-DEMO-0004","carrier":"Gulf Coast Carriers"}]','[{"invoiceNo":"INV-DEMO-0004"}]','[]','{"seed":"DEMO","note":"final invoice pending installation sign-off"}','2026-01-15 10:00:00','2026-04-22 13:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0005'),'SO-DEMO-0005',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' LIMIT 1),'Blue Fig Hotels Group','delivered',243646.40,15,'2026-06-15 00:00:00','2026-06-12 10:30:00',NULL,'[{"status":"order_placed","at":"2026-02-19T11:30:00Z"},{"status":"in_production","at":"2026-03-03T08:00:00Z"},{"status":"quality_check","at":"2026-05-20T09:00:00Z"},{"status":"dispatched","at":"2026-06-05T08:30:00Z"},{"status":"delivered","at":"2026-06-12T10:30:00Z"}]','["WO-DEMO-0009","WO-DEMO-0010"]','[{"shipmentNo":"SHP-DEMO-0005","carrier":"Atlantic Freightways"}]','[{"invoiceNo":"INV-DEMO-0005"}]','[{"paymentNo":"PAY-DEMO-0005","amount":121823.2,"type":"advance"}]','{"seed":"DEMO"}','2026-02-19 11:30:00','2026-06-12 10:30:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0006'),'SO-DEMO-0006',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','in_transit',142780.00,8,'2026-09-18 00:00:00',NULL,NULL,'[{"status":"order_placed","at":"2026-03-03T10:00:00Z"},{"status":"in_production","at":"2026-03-16T08:00:00Z"},{"status":"ready_for_dispatch","at":"2026-08-25T15:00:00Z"},{"status":"dispatched","at":"2026-09-04T08:00:00Z"},{"status":"in_transit","at":"2026-09-05T06:00:00Z"}]','["WO-DEMO-0011","WO-DEMO-0012"]','[{"shipmentNo":"SHP-DEMO-0006","carrier":"Sunbelt Logistics","eta":"2026-09-18"}]','[{"invoiceNo":"INV-DEMO-0006"}]','[]','{"seed":"DEMO"}','2026-03-03 10:00:00','2026-09-05 06:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0007'),'SO-DEMO-0007',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Metro Hospital Kitchens' LIMIT 1),'Metro Hospital Kitchens','ready_for_dispatch',119298.00,7,'2026-09-25 00:00:00',NULL,NULL,'[{"status":"order_placed","at":"2026-03-19T09:00:00Z"},{"status":"in_production","at":"2026-04-01T08:00:00Z"},{"status":"quality_check","at":"2026-08-20T09:00:00Z"},{"status":"ready_for_dispatch","at":"2026-09-08T14:00:00Z"}]','["WO-DEMO-0013","WO-DEMO-0014"]','[]','[{"invoiceNo":"INV-DEMO-0007","status":"draft"}]','[]','{"seed":"DEMO"}','2026-03-19 09:00:00','2026-09-08 14:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0008'),'SO-DEMO-0008',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Lakeside Resort & Spa' LIMIT 1),'Lakeside Resort & Spa','quality_check',140420.00,9,'2026-10-05 00:00:00',NULL,NULL,'[{"status":"order_placed","at":"2026-04-10T10:30:00Z"},{"status":"material_procurement","at":"2026-04-20T08:00:00Z"},{"status":"in_production","at":"2026-05-12T08:00:00Z"},{"status":"quality_check","at":"2026-09-01T09:00:00Z"}]','["WO-DEMO-0015","WO-DEMO-0016"]','[]','[]','[]','{"seed":"DEMO"}','2026-04-10 10:30:00','2026-09-01 09:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0009'),'SO-DEMO-0009',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Golden Spoon Franchises' LIMIT 1),'Golden Spoon Franchises','in_production',251458.00,14,'2026-10-20 00:00:00',NULL,NULL,'[{"status":"order_placed","at":"2026-05-05T11:00:00Z"},{"status":"production_planning","at":"2026-05-08T08:00:00Z"},{"status":"in_production","at":"2026-05-15T08:00:00Z"}]','["WO-DEMO-0021"]','[]','[]','[{"paymentNo":"PAY-DEMO-0009","amount":125729,"type":"advance"}]','{"seed":"DEMO","linkedInstance":"WFI-DEMO-0004"}','2026-05-05 11:00:00','2026-08-30 10:15:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0010'),'SO-DEMO-0010',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Blue Fig Hotels Group' LIMIT 1),'Blue Fig Hotels Group','material_procurement',204730.00,12,'2026-11-15 00:00:00',NULL,NULL,'[{"status":"order_placed","at":"2026-05-14T10:00:00Z"},{"status":"order_confirmed","at":"2026-05-18T09:00:00Z"},{"status":"production_planning","at":"2026-06-01T08:00:00Z"},{"status":"material_procurement","at":"2026-06-20T08:00:00Z"}]','[]','[]','[]','[{"paymentNo":"PAY-DEMO-0010","amount":61419,"type":"advance"}]','{"seed":"DEMO"}','2026-05-14 10:00:00','2026-06-20 08:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0011'),'SO-DEMO-0011',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Campus Dining Co-op' LIMIT 1),'Campus Dining Co-op','on_hold',90553.20,5,'2026-11-30 00:00:00',NULL,NULL,'[{"status":"order_placed","at":"2026-06-02T09:30:00Z"},{"status":"order_confirmed","at":"2026-06-05T10:00:00Z"},{"status":"on_hold","at":"2026-07-15T14:00:00Z"}]','[]','[]','[]','[]','{"seed":"DEMO","holdReason":"campus renovation delayed to Q1 2027"}','2026-06-02 09:30:00','2026-07-15 14:00:00'),
  ((SELECT id::text FROM sales_orders WHERE "orderNumber" = 'SO-DEMO-0012'),'SO-DEMO-0012',(SELECT id::text FROM crm_customers WHERE "customerName" = 'Metro Hospital Kitchens' LIMIT 1),'Metro Hospital Kitchens','in_production',234230.00,13,'2026-10-30 00:00:00',NULL,NULL,'[{"status":"order_placed","at":"2026-06-11T10:00:00Z"},{"status":"order_confirmed","at":"2026-06-11T12:00:00Z"},{"status":"in_production","at":"2026-06-15T08:00:00Z"}]','["WO-DEMO-0029","WO-DEMO-0030"]','[]','[]','[{"paymentNo":"PAY-DEMO-0012","amount":117115,"type":"advance"}]','{"seed":"DEMO","expedite":true,"linkedInstance":"WFI-DEMO-0008"}','2026-06-11 10:00:00','2026-09-08 17:40:00');
