-- Demo seed — Support desk (agents, categories, automation, knowledge, assets, reports) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: every table is cleared for this company first (delete predicate: "companyId" = :company),
-- then re-inserted. No table here carries a hard FK; agent references are resolved via scalar subselects.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- support_agent_skills (child of support_agents by name) — delete child first
-- ---------------------------------------------------------------------------
DELETE FROM support_agent_skills WHERE "companyId" = :company;
DELETE FROM support_agents WHERE "companyId" = :company;

-- ---------------------------------------------------------------------------
-- support_agents — 8 agents drawn from hr_employees names
-- ---------------------------------------------------------------------------
INSERT INTO support_agents
  ("companyId", name, email, phone, role, team, status, "joinDate", location, shift,
   "activeTickets", "resolvedToday", "resolvedThisMonth", "avgResolutionTime", satisfaction,
   "responseTime", "slaCompliance", skills, specializations, certifications, performance,
   "createdAt", "updatedAt")
VALUES
  (:company,'Rajesh Kumar','rajesh.kumar@manufacturingos.com','+91-98450-11001','Senior Support Engineer','Combi Ovens','Online','2025-10-01','Bengaluru','Day (08:00-17:00)',6,3,41,'4.2h',4.70,'12m',96.50,
   '["Combi Oven Diagnostics","Steam Systems","Control Boards"]'::json,'["MagiCook Combi 6/10/20 GN"]'::json,'["B3 Certified Combi Technician L3"]'::json,'{"thisMonth": 41, "lastMonth": 38, "trend": "up"}'::json,
   '2025-10-01 09:00:00','2026-09-08 10:15:00'),
  (:company,'Priya Sharma','priya.sharma@manufacturingos.com','+91-98450-11002','Support Engineer','Refrigeration','Online','2025-10-15','Bengaluru','Day (08:00-17:00)',4,2,33,'5.1h',4.50,'18m',93.20,
   '["Blast Chillers","Walk-in Cold Rooms","Refrigerant Handling"]'::json,'["ChillRapid BC-40","ColdCore WR series"]'::json,'["EPA 608 Universal","B3 Refrigeration L2"]'::json,'{"thisMonth": 33, "lastMonth": 35, "trend": "down"}'::json,
   '2025-10-15 09:00:00','2026-09-08 10:15:00'),
  (:company,'Anita Desai','anita.desai@manufacturingos.com','+91-98450-11003','Support Engineer','Dishwashing','Away','2025-11-03','Mumbai','Evening (13:00-22:00)',5,1,29,'3.8h',4.60,'15m',95.10,
   '["Rack Conveyor Dishwashers","Booster Heaters","Detergent Dosing"]'::json,'["WashLine RC-200 conveyor"]'::json,'["B3 Warewash Specialist"]'::json,'{"thisMonth": 29, "lastMonth": 27, "trend": "up"}'::json,
   '2025-11-03 09:00:00','2026-09-08 10:15:00'),
  (:company,'Vikram Singh','vikram.singh@manufacturingos.com','+91-98450-11004','Field Service Engineer','Field Service','Busy','2025-11-20','Delhi NCR','Day (08:00-17:00)',7,2,36,'6.4h',4.40,'25m',91.80,
   '["On-site Commissioning","Gas Lines","Exhaust Hoods"]'::json,'["Full galley fit-outs","Banquet kitchen lines"]'::json,'["Gas Safe Commercial","B3 Field Service L3"]'::json,'{"thisMonth": 36, "lastMonth": 31, "trend": "up"}'::json,
   '2025-11-20 09:00:00','2026-09-08 10:15:00'),
  (:company,'Suresh Patel','suresh.patel@manufacturingos.com','+91-98450-11005','Support Engineer','Cooking Lines','Online','2025-12-08','Ahmedabad','Day (08:00-17:00)',3,2,24,'4.9h',4.30,'20m',92.40,
   '["Induction Ranges","Deep Fryers","Tilting Bratt Pans"]'::json,'["HeatMax fryer family"]'::json,'["B3 Cooking Line L2"]'::json,'{"thisMonth": 24, "lastMonth": 26, "trend": "down"}'::json,
   '2025-12-08 09:00:00','2026-09-08 10:15:00'),
  (:company,'Meera Nair','meera.nair@manufacturingos.com','+91-98450-11006','Support Analyst','Remote Support','Online','2026-01-12','Kochi','Night (22:00-07:00)',2,4,45,'1.6h',4.80,'6m',98.10,
   '["IoT Telemetry","Remote Diagnostics","Firmware Updates"]'::json,'["B3 Connect cloud monitoring"]'::json,'["B3 Connect Administrator"]'::json,'{"thisMonth": 45, "lastMonth": 42, "trend": "up"}'::json,
   '2026-01-12 09:00:00','2026-09-08 10:15:00'),
  (:company,'Amit Verma','amit.verma@manufacturingos.com','+91-98450-11007','Support Engineer','Combi Ovens','Offline','2026-02-02','Pune','Evening (13:00-22:00)',4,0,21,'5.5h',4.20,'22m',90.60,
   '["Combi Oven Diagnostics","Water Treatment","Descaling"]'::json,'["MagiCook Combi 6/10 GN"]'::json,'["B3 Certified Combi Technician L1"]'::json,'{"thisMonth": 21, "lastMonth": 19, "trend": "up"}'::json,
   '2026-02-02 09:00:00','2026-09-08 10:15:00'),
  (:company,'Kiran Reddy','kiran.reddy@manufacturingos.com','+91-98450-11008','Team Lead','Escalations','Busy','2025-10-01','Hyderabad','Day (08:00-17:00)',5,1,26,'7.2h',4.60,'10m',94.70,
   '["Escalation Management","Root Cause Analysis","Customer Communication"]'::json,'["Enterprise accounts","Hospital kitchens"]'::json,'["ITIL v4 Foundation","B3 Field Service L3"]'::json,'{"thisMonth": 26, "lastMonth": 28, "trend": "down"}'::json,
   '2025-10-01 09:00:00','2026-09-08 10:15:00');

-- ---------------------------------------------------------------------------
-- support_agent_skills — one skill-matrix row per agent (agentId via subselect)
-- ---------------------------------------------------------------------------
INSERT INTO support_agent_skills
  ("companyId", "agentId", "agentName", team, skills, "totalSkills", "expertLevel", certifications,
   "createdAt", "updatedAt")
VALUES
  (:company,(SELECT id::text FROM support_agents WHERE "companyId" = :company AND name = 'Rajesh Kumar'),'Rajesh Kumar','Combi Ovens',
   '[{"category": "Cooking Equipment", "skillName": "Combi Oven Diagnostics", "level": "Expert", "yearsExperience": 8, "certifications": ["B3 Certified Combi Technician L3"], "lastUpdated": "2026-06-15"}, {"category": "Cooking Equipment", "skillName": "Steam Generator Service", "level": "Expert", "yearsExperience": 6, "certifications": [], "lastUpdated": "2026-06-15"}, {"category": "Electronics", "skillName": "Control Board Repair", "level": "Advanced", "yearsExperience": 5, "certifications": [], "lastUpdated": "2026-04-02"}]'::json,3,2,1,
   '2025-10-01 09:30:00','2026-06-15 11:00:00'),
  (:company,(SELECT id::text FROM support_agents WHERE "companyId" = :company AND name = 'Priya Sharma'),'Priya Sharma','Refrigeration',
   '[{"category": "Refrigeration", "skillName": "Blast Chiller Service", "level": "Expert", "yearsExperience": 7, "certifications": ["B3 Refrigeration L2"], "lastUpdated": "2026-05-20"}, {"category": "Refrigeration", "skillName": "Refrigerant Recovery", "level": "Expert", "yearsExperience": 7, "certifications": ["EPA 608 Universal"], "lastUpdated": "2026-05-20"}, {"category": "Refrigeration", "skillName": "Cold Room Commissioning", "level": "Intermediate", "yearsExperience": 3, "certifications": [], "lastUpdated": "2026-02-10"}]'::json,3,2,2,
   '2025-10-15 09:30:00','2026-05-20 14:00:00'),
  (:company,(SELECT id::text FROM support_agents WHERE "companyId" = :company AND name = 'Anita Desai'),'Anita Desai','Dishwashing',
   '[{"category": "Warewashing", "skillName": "Rack Conveyor Dishwashers", "level": "Expert", "yearsExperience": 6, "certifications": ["B3 Warewash Specialist"], "lastUpdated": "2026-07-01"}, {"category": "Warewashing", "skillName": "Chemical Dosing Systems", "level": "Advanced", "yearsExperience": 4, "certifications": [], "lastUpdated": "2026-07-01"}]'::json,2,1,1,
   '2025-11-03 09:30:00','2026-07-01 10:00:00'),
  (:company,(SELECT id::text FROM support_agents WHERE "companyId" = :company AND name = 'Vikram Singh'),'Vikram Singh','Field Service',
   '[{"category": "Installation", "skillName": "Galley Commissioning", "level": "Expert", "yearsExperience": 9, "certifications": ["B3 Field Service L3"], "lastUpdated": "2026-03-18"}, {"category": "Gas Systems", "skillName": "Commercial Gas Lines", "level": "Expert", "yearsExperience": 9, "certifications": ["Gas Safe Commercial"], "lastUpdated": "2026-03-18"}, {"category": "Ventilation", "skillName": "Exhaust Hood Balancing", "level": "Advanced", "yearsExperience": 5, "certifications": [], "lastUpdated": "2025-12-04"}]'::json,3,2,2,
   '2025-11-20 09:30:00','2026-03-18 16:30:00'),
  (:company,(SELECT id::text FROM support_agents WHERE "companyId" = :company AND name = 'Suresh Patel'),'Suresh Patel','Cooking Lines',
   '[{"category": "Cooking Equipment", "skillName": "Induction Range Service", "level": "Advanced", "yearsExperience": 4, "certifications": ["B3 Cooking Line L2"], "lastUpdated": "2026-08-11"}, {"category": "Cooking Equipment", "skillName": "Fryer Oil Management Systems", "level": "Advanced", "yearsExperience": 4, "certifications": [], "lastUpdated": "2026-08-11"}]'::json,2,0,1,
   '2025-12-08 09:30:00','2026-08-11 09:45:00'),
  (:company,(SELECT id::text FROM support_agents WHERE "companyId" = :company AND name = 'Meera Nair'),'Meera Nair','Remote Support',
   '[{"category": "Digital", "skillName": "IoT Telemetry Analysis", "level": "Expert", "yearsExperience": 5, "certifications": ["B3 Connect Administrator"], "lastUpdated": "2026-09-01"}, {"category": "Digital", "skillName": "Remote Firmware Updates", "level": "Expert", "yearsExperience": 5, "certifications": [], "lastUpdated": "2026-09-01"}, {"category": "Digital", "skillName": "Predictive Fault Alerts", "level": "Advanced", "yearsExperience": 3, "certifications": [], "lastUpdated": "2026-06-22"}]'::json,3,2,1,
   '2026-01-12 09:30:00','2026-09-01 12:00:00'),
  (:company,(SELECT id::text FROM support_agents WHERE "companyId" = :company AND name = 'Amit Verma'),'Amit Verma','Combi Ovens',
   '[{"category": "Cooking Equipment", "skillName": "Combi Oven Diagnostics", "level": "Intermediate", "yearsExperience": 2, "certifications": ["B3 Certified Combi Technician L1"], "lastUpdated": "2026-07-19"}, {"category": "Water Systems", "skillName": "Descaling and Water Treatment", "level": "Advanced", "yearsExperience": 3, "certifications": [], "lastUpdated": "2026-07-19"}]'::json,2,0,1,
   '2026-02-02 09:30:00','2026-07-19 15:20:00'),
  (:company,(SELECT id::text FROM support_agents WHERE "companyId" = :company AND name = 'Kiran Reddy'),'Kiran Reddy','Escalations',
   '[{"category": "Process", "skillName": "Escalation Management", "level": "Expert", "yearsExperience": 10, "certifications": ["ITIL v4 Foundation"], "lastUpdated": "2026-04-30"}, {"category": "Process", "skillName": "Root Cause Analysis", "level": "Expert", "yearsExperience": 8, "certifications": [], "lastUpdated": "2026-04-30"}]'::json,2,2,1,
   '2025-10-01 09:30:00','2026-04-30 17:00:00');

-- ---------------------------------------------------------------------------
-- support_ticket_categories — equipment-domain categories (before rules)
-- ---------------------------------------------------------------------------
DELETE FROM support_ticket_categories WHERE "companyId" = :company;
INSERT INTO support_ticket_categories
  ("companyId", name, description, color, "ticketCount", "avgResolutionTime", "slaTarget", active,
   "createdAt", "updatedAt")
VALUES
  (:company,'Combi Ovens','Faults on MagiCook combi ovens: steam generation, door seals, control boards, error codes','#EF4444',48,'4.5h','8h',true,'2025-10-02 10:00:00','2026-08-15 09:00:00'),
  (:company,'Blast Chillers & Refrigeration','ChillRapid blast chillers, walk-in cold rooms, undercounter refrigeration and compressor faults','#3B82F6',36,'5.8h','8h',true,'2025-10-02 10:05:00','2026-08-15 09:00:00'),
  (:company,'Dishwashing Lines','WashLine rack conveyor and hood-type dishwashers: wash pumps, booster heaters, dosing','#10B981',29,'4.1h','12h',true,'2025-10-02 10:10:00','2026-08-15 09:00:00'),
  (:company,'Cooking Ranges & Fryers','Induction ranges, gas ranges, HeatMax fryers, bratt pans and griddles','#F59E0B',31,'5.2h','12h',true,'2025-10-02 10:15:00','2026-08-15 09:00:00'),
  (:company,'Exhaust & Ventilation','Hood extraction, make-up air, fire suppression interlocks and duct issues','#8B5CF6',12,'9.5h','24h',true,'2025-10-02 10:20:00','2026-08-15 09:00:00'),
  (:company,'Installation & Commissioning','New site fit-outs, equipment commissioning, handover snags','#06B6D4',18,'2.1d','3d',true,'2025-10-02 10:25:00','2026-08-15 09:00:00'),
  (:company,'Preventive Maintenance','Scheduled PM visits, descaling, filter changes, calibration','#84CC16',44,'1.2d','5d',true,'2025-10-02 10:30:00','2026-08-15 09:00:00'),
  (:company,'Spare Parts & Warranty','Spare part requests, warranty claims and replacements','#EC4899',26,'2.6d','5d',true,'2025-10-02 10:35:00','2026-08-15 09:00:00');

-- ---------------------------------------------------------------------------
-- support_assignment_rules — routing to teams/agents by category & customer
-- ---------------------------------------------------------------------------
DELETE FROM support_assignment_rules WHERE "companyId" = :company;
INSERT INTO support_assignment_rules
  ("companyId", name, description, priority, conditions, "assignmentLogic", "assignTo", active,
   "matchedTickets", "avgAssignmentTime", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Combi Oven Faults to Combi Team','Route all combi oven fault tickets to the Combi Ovens team',10,
   '[{"field": "category", "operator": "equals", "value": "Combi Ovens"}]'::json,'Skill Based','Combi Ovens Team',true,48,'2.4m','2025-10-05 09:00:00','2026-07-10 11:00:00'),
  (:company,'DEMO Refrigeration to Certified Techs','Blast chiller and cold room tickets require EPA-certified refrigeration engineers',10,
   '[{"field": "category", "operator": "equals", "value": "Blast Chillers & Refrigeration"}]'::json,'Skill Based','Refrigeration Team',true,36,'3.1m','2025-10-05 09:05:00','2026-07-10 11:00:00'),
  (:company,'DEMO Critical Tickets to Team Lead','Any critical-priority ticket is assigned directly to the escalations lead',5,
   '[{"field": "priority", "operator": "equals", "value": "critical"}]'::json,'Direct Assignment','Kiran Reddy',true,9,'1.2m','2025-10-05 09:10:00','2026-07-10 11:00:00'),
  (:company,'DEMO Enterprise Accounts Priority Queue','Tickets from enterprise customers (Blue Fig Hotels, Golden Spoon, Metro Hospital) jump the queue',20,
   '[{"field": "customerSegment", "operator": "equals", "value": "Enterprise"}]'::json,'Load Balanced','Senior Engineers Pool',true,57,'2.8m','2025-10-05 09:15:00','2026-07-10 11:00:00'),
  (:company,'DEMO Night Telemetry Alerts to Remote Support','B3 Connect IoT alerts raised outside business hours go to the night-shift remote analyst',30,
   '[{"field": "source", "operator": "equals", "value": "iot-telemetry"}, {"field": "businessHours", "operator": "equals", "value": "false"}]'::json,'Direct Assignment','Meera Nair',true,63,'0.8m','2025-10-05 09:20:00','2026-07-10 11:00:00'),
  (:company,'DEMO Default Round Robin','Fallback: distribute unmatched tickets round-robin across all online agents',100,
   '[{"field": "assignee", "operator": "is_empty", "value": ""}]'::json,'Round Robin','All Agents',true,112,'4.5m','2025-10-05 09:25:00','2026-07-10 11:00:00');

-- ---------------------------------------------------------------------------
-- support_automation_rules — trigger/action workflow automation
-- ---------------------------------------------------------------------------
DELETE FROM support_automation_rules WHERE "companyId" = :company;
INSERT INTO support_automation_rules
  ("companyId", "ruleId", name, description, trigger, actions, priority, active,
   "executionCount", "successRate", "lastExecuted", "createdBy", category, "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-AUT-001','Auto-acknowledge new tickets','Send acknowledgement with ticket number and SLA target when a ticket is created',
   '{"type": "ticket_created", "conditions": ["channel in (email, portal)"]}'::json,
   '[{"type": "send_email", "details": "Template: Ticket Acknowledgement"}, {"type": "set_field", "details": "status = Open"}]'::json,
   10,true,412,99.30,'2026-09-09 18:42:00','Kiran Reddy','Communication','2025-10-06 09:00:00','2026-09-09 18:42:00'),
  (:company,'DEMO-AUT-002','Tag combi oven error codes','Parse subject/body for MagiCook error codes (E-xx) and tag + categorise the ticket',
   '{"type": "ticket_created", "conditions": ["body matches E-[0-9]{2}"]}'::json,
   '[{"type": "add_tag", "details": "error-code"}, {"type": "set_category", "details": "Combi Ovens"}]'::json,
   20,true,86,97.70,'2026-09-07 14:10:00','Meera Nair','Classification','2025-10-06 09:10:00','2026-09-07 14:10:00'),
  (:company,'DEMO-AUT-003','SLA breach warning at 80%','Notify assignee and team lead when elapsed time reaches 80% of the resolution SLA',
   '{"type": "sla_threshold", "conditions": ["elapsed >= 80% of resolutionMinutes"]}'::json,
   '[{"type": "notify_agent", "details": "In-app + email to assignee"}, {"type": "notify_manager", "details": "Email to team lead"}]'::json,
   5,true,147,100.00,'2026-09-10 08:05:00','Kiran Reddy','SLA','2025-10-06 09:20:00','2026-09-10 08:05:00'),
  (:company,'DEMO-AUT-004','Auto-close resolved after 72h','Close resolved tickets automatically if the customer does not reopen within 72 hours',
   '{"type": "time_since_status", "conditions": ["status = Resolved", "hours >= 72"]}'::json,
   '[{"type": "set_field", "details": "status = Closed"}, {"type": "send_email", "details": "Template: Ticket Closed + CSAT survey"}]'::json,
   50,true,238,98.90,'2026-09-09 23:00:00','Meera Nair','Lifecycle','2025-10-06 09:30:00','2026-09-09 23:00:00'),
  (:company,'DEMO-AUT-005','Create PM ticket from telemetry','Open a preventive-maintenance ticket when B3 Connect reports scale build-up or filter alarms',
   '{"type": "iot_alert", "conditions": ["alert in (scale_warning, filter_clogged, door_seal_wear)"]}'::json,
   '[{"type": "create_ticket", "details": "Category: Preventive Maintenance, Priority: medium"}, {"type": "attach_telemetry", "details": "Last 24h sensor snapshot"}]'::json,
   30,true,54,94.40,'2026-09-08 03:15:00','Meera Nair','IoT','2026-01-20 09:00:00','2026-09-08 03:15:00'),
  (:company,'DEMO-AUT-006','Warranty check on parts requests','Look up asset warranty status when a Spare Parts & Warranty ticket is created and note it on the ticket',
   '{"type": "ticket_created", "conditions": ["category = Spare Parts & Warranty"]}'::json,
   '[{"type": "lookup_warranty", "details": "Match serial number to installed base"}, {"type": "add_note", "details": "Warranty status + entitlement"}]'::json,
   40,true,72,91.70,'2026-09-05 16:30:00','Kiran Reddy','Warranty','2025-11-14 09:00:00','2026-09-05 16:30:00');

-- ---------------------------------------------------------------------------
-- support_escalation_rules — tiered escalation tied to SLA policies
-- ---------------------------------------------------------------------------
DELETE FROM support_escalation_rules WHERE "companyId" = :company;
INSERT INTO support_escalation_rules
  ("companyId", name, description, level, trigger, "escalateTo", "notificationChannels", active,
   "executionCount", "avgResponseTime", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Critical response breach (SLA-CRIT)','Critical tickets with no first response inside the 15-minute SLA-CRIT window',1,
   '{"type": "response_sla_breach", "threshold": "15m without first response"}'::json,'Team Lead - Kiran Reddy','["email", "sms", "in-app"]'::json,true,14,'6m','2025-10-07 09:00:00','2026-08-20 10:00:00'),
  (:company,'DEMO Critical resolution at risk (SLA-CRIT)','Critical tickets open beyond 3h of the 4h SLA-CRIT resolution target',2,
   '{"type": "resolution_sla_risk", "threshold": "180m elapsed of 240m target"}'::json,'Support Manager','["email", "sms"]'::json,true,9,'11m','2025-10-07 09:05:00','2026-08-20 10:00:00'),
  (:company,'DEMO High-priority aging (SLA-HIGH)','High tickets unresolved past the 8h SLA-HIGH resolution window',1,
   '{"type": "resolution_sla_breach", "threshold": "480m without resolution"}'::json,'Team Lead - Kiran Reddy','["email", "in-app"]'::json,true,23,'19m','2025-10-07 09:10:00','2026-08-20 10:00:00'),
  (:company,'DEMO Enterprise kitchen down','Any equipment-down ticket at an enterprise site (hotel/hospital) escalates straight to management',1,
   '{"type": "keyword_and_segment", "threshold": "equipment down + segment Enterprise"}'::json,'Support Manager','["email", "sms", "phone"]'::json,true,6,'8m','2025-10-07 09:15:00','2026-08-20 10:00:00'),
  (:company,'DEMO Repeated reopen escalation','Ticket reopened more than twice escalates to problem management for RCA',3,
   '{"type": "reopen_count", "threshold": "reopens > 2"}'::json,'Problem Management','["email", "in-app"]'::json,true,4,'2.5h','2026-01-15 09:00:00','2026-08-20 10:00:00');

-- ---------------------------------------------------------------------------
-- support_response_templates — canned/automated responses
-- ---------------------------------------------------------------------------
DELETE FROM support_response_templates WHERE "companyId" = :company;
INSERT INTO support_response_templates
  ("companyId", name, category, subject, body, trigger, language, active,
   "usageCount", "effectivenessRate", "avgResponseTime", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Ticket Acknowledgement','Lifecycle','We have received your request [{{ticketNumber}}]',
   'Dear {{customerName}}, thank you for contacting B3 MACBIS Support. Your ticket {{ticketNumber}} has been logged and assigned to our {{team}} team. Target first response: {{slaResponse}}. You can track progress from the customer portal.',
   '{"type": "ticket_created", "conditions": ["all channels"]}'::json,'English',true,412,96.40,'instant','2025-10-06 10:00:00','2026-09-01 09:00:00'),
  (:company,'DEMO Combi Oven E-Code First Aid','Troubleshooting','Quick checks for error {{errorCode}} on your combi oven',
   'Hi {{customerName}}, while our engineer is assigned, please try: 1) Power-cycle the unit at the isolator for 60 seconds. 2) Check the water inlet valve is fully open. 3) Note the exact error code and any unusual sounds. Do not open the steam generator panel — a certified technician will handle internal checks.',
   '{"type": "category_matched", "conditions": ["category = Combi Ovens", "tag = error-code"]}'::json,'English',true,74,88.90,'instant','2025-10-06 10:10:00','2026-09-01 09:00:00'),
  (:company,'DEMO Blast Chiller Temperature Advisory','Troubleshooting','Preserving food safety while your blast chiller is serviced',
   'Dear {{customerName}}, until the engineer arrives: transfer product to your walk-in cold room, log core temperatures every 30 minutes per HACCP, and keep the chiller door closed to retain residual cooling. Our engineer ETA is {{eta}}.',
   '{"type": "category_matched", "conditions": ["category = Blast Chillers & Refrigeration", "priority in (critical, high)"]}'::json,'English',true,41,92.70,'instant','2025-10-06 10:20:00','2026-09-01 09:00:00'),
  (:company,'DEMO Engineer Dispatched','Field Service','Engineer {{engineerName}} is on the way',
   'Hello {{customerName}}, {{engineerName}} has been dispatched to {{siteName}} with an ETA of {{eta}}. Please ensure kitchen access and isolate the affected equipment. Carrying parts: {{partsList}}.',
   '{"type": "field_visit_scheduled", "conditions": ["visit confirmed"]}'::json,'English',true,156,95.50,'instant','2025-10-06 10:30:00','2026-09-01 09:00:00'),
  (:company,'DEMO Resolution Confirmation + CSAT','Lifecycle','Your ticket {{ticketNumber}} has been resolved',
   'Dear {{customerName}}, ticket {{ticketNumber}} ({{subject}}) is now resolved: {{resolutionSummary}}. If the issue recurs within 72 hours simply reply to reopen. We would love your feedback — the survey takes 30 seconds.',
   '{"type": "status_changed", "conditions": ["status = Resolved"]}'::json,'English',true,238,90.20,'instant','2025-10-06 10:40:00','2026-09-01 09:00:00'),
  (:company,'DEMO PM Visit Reminder','Maintenance','Preventive maintenance visit scheduled for {{visitDate}}',
   'Hello {{customerName}}, this is a reminder of your scheduled preventive maintenance on {{visitDate}} ({{visitWindow}}). Scope: descaling, gasket inspection, filter change and calibration for {{assetList}}. Expected duration {{duration}}; the equipment will be unavailable during service.',
   '{"type": "scheduled", "conditions": ["pm_visit in 48h"]}'::json,'English',true,88,94.10,'instant','2025-11-10 10:00:00','2026-09-01 09:00:00');

-- ---------------------------------------------------------------------------
-- support_sla_settings — one row per company (UNIQUE companyId)
-- ---------------------------------------------------------------------------
DELETE FROM support_sla_settings WHERE "companyId" = :company;
INSERT INTO support_sla_settings
  ("companyId", "slaConfigs", "businessHours", "escalationRules", notifications, "createdAt", "updatedAt")
VALUES
  (:company,
   '[{"priority": "critical", "slaCode": "SLA-CRIT", "firstResponse": "15m", "resolution": "4h", "coverage": "24x7"}, {"priority": "high", "slaCode": "SLA-HIGH", "firstResponse": "1h", "resolution": "8h", "coverage": "business-hours"}, {"priority": "medium", "slaCode": "SLA-MED", "firstResponse": "4h", "resolution": "24h", "coverage": "business-hours"}, {"priority": "low", "slaCode": "SLA-LOW", "firstResponse": "8h", "resolution": "48h", "coverage": "business-hours"}]'::json,
   '[{"day": "Monday", "start": "08:00", "end": "18:00", "enabled": true}, {"day": "Tuesday", "start": "08:00", "end": "18:00", "enabled": true}, {"day": "Wednesday", "start": "08:00", "end": "18:00", "enabled": true}, {"day": "Thursday", "start": "08:00", "end": "18:00", "enabled": true}, {"day": "Friday", "start": "08:00", "end": "18:00", "enabled": true}, {"day": "Saturday", "start": "09:00", "end": "14:00", "enabled": true}, {"day": "Sunday", "start": "00:00", "end": "00:00", "enabled": false}]'::json,
   '[{"level": 1, "after": "80% of SLA", "notify": "Team Lead"}, {"level": 2, "after": "100% of SLA", "notify": "Support Manager"}, {"level": 3, "after": "150% of SLA", "notify": "Head of Service"}]'::json,
   '{"emailOnBreach": true, "smsOnCritical": true, "dailyDigest": true, "digestTime": "08:30", "escalationCc": ["service.head@manufacturingos.com"]}'::json,
   '2025-10-03 09:00:00','2026-08-01 10:00:00');

-- ---------------------------------------------------------------------------
-- support_known_errors — documented equipment faults with workarounds
-- ---------------------------------------------------------------------------
DELETE FROM support_known_errors WHERE "companyId" = :company;
INSERT INTO support_known_errors
  ("companyId", "errorId", title, description, workaround, status, category, "affectedSystems",
   "relatedProblems", "documentedBy", "documentedDate", "lastUpdated", "affectedUsers", severity,
   "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-KE-001','MagiCook E-14: steam generator scale lockout','Combi ovens in hard-water sites trip error E-14 when scale build-up on the steam generator probes exceeds the conductivity threshold, locking out steam modes.','Run the built-in descale cycle (Menu > Service > Descale) with B3 descaler cartridge; if lockout persists, short-cycle power and run again. Permanent fix: fit inline water softener.','Active','Combi Ovens','["MagiCook Combi 6 GN", "MagiCook Combi 10 GN", "MagiCook Combi 20 GN"]'::json,'["PRB-2025-014"]'::json,'Rajesh Kumar','2025-11-12','2026-06-20',14,'high','2025-11-12 11:00:00','2026-06-20 09:30:00'),
  (:company,'DEMO-KE-002','ChillRapid F3: evaporator sensor drift after defrost','BC-40 blast chillers intermittently report F3 (evaporator probe fault) immediately after a hot-gas defrost; the probe reads 8-10C high for up to 20 minutes.','Acknowledge the alarm and allow one full chill cycle; readings normalise. Replace probe kit P/N BC40-EVP-02 at next PM visit.','Active','Blast Chillers & Refrigeration','["ChillRapid BC-40"]'::json,'["PRB-2025-021"]'::json,'Priya Sharma','2025-12-03','2026-05-14',9,'medium','2025-12-03 14:00:00','2026-05-14 10:00:00'),
  (:company,'DEMO-KE-003','WashLine RC-200 booster heater trips at >55C inlet','Rack conveyor booster heaters trip the high-limit stat when incoming rinse water already exceeds 55C, typically where site pre-heat loops are miscalibrated.','Reset the high-limit stat behind the lower front panel and reduce site calorifier setpoint to 50C. Firmware 2.4.1 widens the tolerance.','Active','Dishwashing Lines','["WashLine RC-200"]'::json,'["PRB-2026-003"]'::json,'Anita Desai','2026-01-22','2026-07-08',6,'medium','2026-01-22 10:30:00','2026-07-08 15:00:00'),
  (:company,'DEMO-KE-004','HeatMax fryer HL-2 nuisance trips with high-melt shortening','HeatMax 25L fryers trip the HL-2 high-limit during cold starts with solid shortening because the element locally overheats before melt-out.','Use melt-cycle mode (hold MELT 3s) for solid fats; never bypass the high-limit. Advisory label kit available under warranty.','Active','Cooking Ranges & Fryers','["HeatMax FR-25", "HeatMax FR-25D"]'::json,'[]'::json,'Suresh Patel','2026-02-18','2026-04-25',11,'high','2026-02-18 09:00:00','2026-04-25 11:45:00'),
  (:company,'DEMO-KE-005','B3 Connect gateway drops offline on hotel guest Wi-Fi','IoT gateways installed on shared guest networks lose MQTT connection when captive portals re-authenticate, showing units offline for 30-90 minutes daily.','Move the gateway to a dedicated SSID or wired VLAN; as interim, enable the 4G failover SIM shipped with the gateway.','Active','Remote Monitoring','["B3 Connect Gateway v2"]'::json,'["PRB-2026-007"]'::json,'Meera Nair','2026-03-05','2026-08-19',7,'low','2026-03-05 16:00:00','2026-08-19 09:00:00'),
  (:company,'DEMO-KE-006','Combi door seal wear on 20 GN units under banquet load','High-cycle banquet kitchens wear the lower door seal in 4-5 months instead of 12, causing steam leakage and longer cook times.','Inspect seals monthly in high-usage sites; carry P/N MC20-DSL-01 on PM visits. Engineering has released a reinforced seal (rev C).','Resolved','Combi Ovens','["MagiCook Combi 20 GN"]'::json,'["PRB-2025-014"]'::json,'Rajesh Kumar','2025-10-20','2026-02-28',5,'medium','2025-10-20 10:00:00','2026-02-28 13:00:00'),
  (:company,'DEMO-KE-007','Walk-in cold room door heater failure causes ice dam','ColdCore walk-in rooms in humid coastal sites suffer frame-heater element failure, icing the door shut overnight.','Thaw with warm (not boiling) water along the frame; do not force the door. Replace heater element P/N WR-FH-230 and check door gasket alignment.','Active','Blast Chillers & Refrigeration','["ColdCore WR-10", "ColdCore WR-20"]'::json,'[]'::json,'Priya Sharma','2026-04-10','2026-08-02',4,'medium','2026-04-10 11:30:00','2026-08-02 10:15:00');

-- ---------------------------------------------------------------------------
-- support_troubleshooting_articles — step-by-step fault resolution KB
-- ---------------------------------------------------------------------------
DELETE FROM support_troubleshooting_articles WHERE "companyId" = :company;
INSERT INTO support_troubleshooting_articles
  ("companyId", "articleId", title, problem, solution, category, severity, steps, causes, prevention,
   tags, views, helpful, "lastUpdated", author, "relatedArticles", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-TSA-001','Combi oven shows E-14 and refuses steam mode','Unit displays error E-14, steam and combi modes are locked out, convection-only still works.','Descale the steam generator and verify water conductivity; fit a softener where hardness exceeds 7 dH.','Combi Ovens','high',
   '["Isolate power for 60 seconds and restart", "Check water supply valve fully open and inlet filter clean", "Run Menu > Service > Descale with B3 descaler cartridge", "Test water hardness; above 7 dH recommend softener", "If E-14 persists, replace generator probe kit MC-SGP-01"]'::json,
   '["Scale build-up on steam generator probes", "Hard water supply without treatment", "Blocked inlet strainer"]'::json,
   '["Quarterly descale in hard-water areas", "Install inline softener at commissioning", "Add site to B3 Connect scale-warning telemetry"]'::json,
   '["combi-oven", "E-14", "descaling", "steam"]'::json,342,58,'2026-06-20','Rajesh Kumar','["DEMO-TSA-006"]'::json,'2025-10-10 10:00:00','2026-06-20 09:30:00'),
  (:company,'DEMO-TSA-002','Blast chiller fails 90-minute chill cycle','ChillRapid BC-40 raises a cycle-timeout alarm; food core temperature stays above 8C after 90 minutes.','Clean the condenser, verify door seal integrity, and confirm the unit is not overloaded beyond 40 kg per cycle.','Blast Chillers & Refrigeration','high',
   '["Check condenser filter and coil for grease/dust; clean with soft brush", "Inspect door gasket for splits and cold-air leakage", "Verify load is under 40 kg and trays allow airflow between them", "Confirm ambient temperature at unit is below 32C", "If compressor short-cycles, check refrigerant charge (certified tech only)"]'::json,
   '["Blocked condenser", "Worn door gasket", "Overloading beyond rated capacity", "High ambient in plant room"]'::json,
   '["Monthly condenser clean", "Gasket check on every PM visit", "Train kitchen staff on load limits"]'::json,
   '["blast-chiller", "chill-cycle", "condenser", "HACCP"]'::json,287,49,'2026-05-14','Priya Sharma','["DEMO-TSA-007"]'::json,'2025-10-25 11:00:00','2026-05-14 10:00:00'),
  (:company,'DEMO-TSA-003','Dishwasher rinse temperature below 82C','WashLine conveyor final rinse fails the 82C sanitising threshold; plates come out with residue and HACCP log flags the wash.','Reset or replace the booster heater high-limit stat and descale the rinse jets; verify incoming water pressure 2-4 bar.','Dishwashing Lines','medium',
   '["Read rinse temperature on the HMI during a full rack pass", "Check booster heater breaker and high-limit reset behind lower panel", "Descale rinse arm jets and check for blocked nozzles", "Verify inlet pressure between 2 and 4 bar", "Replace booster element WL-BH-09 if recovery exceeds 4 minutes"]'::json,
   '["Tripped booster high-limit", "Scaled rinse jets", "Low site water pressure", "Failed booster element"]'::json,
   '["Weekly jet inspection", "Descale on PM schedule", "Log rinse temps daily per HACCP"]'::json,
   '["dishwasher", "rinse-temperature", "booster-heater", "sanitising"]'::json,231,41,'2026-07-08','Anita Desai','[]'::json,'2025-11-05 09:30:00','2026-07-08 15:00:00'),
  (:company,'DEMO-TSA-004','Induction range not detecting pans','InduCook hob powers on but shows the flashing pan symbol and delivers no heat.','Confirm ferromagnetic cookware of at least 12 cm base diameter; if detection still fails, the coil-board connector needs reseating.','Cooking Ranges & Fryers','low',
   '["Test with a known ferromagnetic pan (magnet sticks to base)", "Ensure pan base is flat and at least 12 cm diameter", "Clean glass surface; burned-on residue can disturb detection", "Power-cycle at the wall isolator", "If unresolved, reseat coil-board ribbon connector (service task)"]'::json,
   '["Non-induction cookware", "Warped or undersized pan base", "Soiled ceramic surface", "Loose coil-board connector"]'::json,
   '["Kitchen induction-ready cookware audit at handover", "Include connector check in annual PM"]'::json,
   '["induction", "pan-detection", "cookware"]'::json,164,29,'2026-04-25','Suresh Patel','[]'::json,'2025-12-01 14:00:00','2026-04-25 11:45:00'),
  (:company,'DEMO-TSA-005','Walk-in cold room temperature creeping above 5C','ColdCore room drifts to 6-8C during service hours then recovers overnight.','Usually traffic/loading related: verify door closer, strip curtains and evaporator defrost schedule before suspecting refrigerant issues.','Blast Chillers & Refrigeration','medium',
   '["Review door-open events on B3 Connect (target < 4 min/hour)", "Check strip curtains are intact and door closer engages fully", "Inspect evaporator coil for icing; review defrost schedule (4-6/day)", "Confirm product loaded warm is pre-chilled elsewhere", "If superheat abnormal, escalate to refrigeration engineer"]'::json,
   '["Excessive door openings", "Missing strip curtains", "Iced evaporator from defrost misconfiguration", "Warm product loading"]'::json,
   '["Staff training on door discipline", "Telemetry alerts on door-open time", "Seasonal defrost schedule review"]'::json,
   '["cold-room", "temperature-drift", "defrost"]'::json,198,35,'2026-08-02','Priya Sharma','["DEMO-TSA-002"]'::json,'2026-01-08 10:00:00','2026-08-02 10:15:00'),
  (:company,'DEMO-TSA-006','Combi oven door leaking steam at the bottom','Visible steam escaping from the lower door edge; longer cook times and water pooling on the floor.','Replace the lower door seal (rev C reinforced part for 20 GN units) and check hinge alignment.','Combi Ovens','medium',
   '["Inspect seal for compression set, nicks or hardening", "Clean seal channel; re-seat the existing seal and retest", "Check door micro-adjustment: gap must be even top to bottom", "Fit reinforced seal MC20-DSL-01 rev C on 20 GN banquet units", "Verify drain is clear so condensate is not forced past the seal"]'::json,
   '["Worn or compression-set door seal", "Hinge misalignment", "Blocked drain back-pressure"]'::json,
   '["Monthly seal inspection in high-cycle kitchens", "Carry rev C seals on PM visits"]'::json,
   '["combi-oven", "door-seal", "steam-leak"]'::json,176,31,'2026-02-28','Rajesh Kumar','["DEMO-TSA-001"]'::json,'2025-10-22 15:00:00','2026-02-28 13:00:00'),
  (:company,'DEMO-TSA-007','Blast chiller F3 probe alarm after defrost','F3 evaporator-probe alarm appears right after hot-gas defrost, then clears on its own.','Known error DEMO-KE-002: probe drift after defrost. Acknowledge, allow one cycle, replace probe kit at next PM.','Blast Chillers & Refrigeration','low',
   '["Acknowledge the F3 alarm on the controller", "Allow one complete chill cycle and confirm readings normalise", "Log occurrence frequency in the asset record", "Schedule probe kit BC40-EVP-02 replacement at next PM", "If alarm persists beyond 30 minutes, treat as genuine probe failure"]'::json,
   '["Thermal lag in probe after hot-gas defrost", "Aging probe insulation"]'::json,
   '["Replace probe kits proactively at 24-month PM", "Firmware 3.2 adds post-defrost alarm suppression"]'::json,
   '["blast-chiller", "F3", "probe", "defrost"]'::json,143,26,'2026-05-14','Priya Sharma','["DEMO-TSA-002"]'::json,'2025-12-05 09:00:00','2026-05-14 10:05:00'),
  (:company,'DEMO-TSA-008','Exhaust hood extraction weak, smoke rollout at capture edge','Cooking smoke escapes the hood front edge during peak service; filters whistle.','Clean or replace baffle filters, verify make-up air is running, and check belt tension on the extract fan.','Exhaust & Ventilation','medium',
   '["Remove and degrease baffle filters (or swap with clean set)", "Confirm make-up air unit runs interlocked with extract fan", "Measure face velocity: target 0.25-0.4 m/s at capture edge", "Inspect fan belt tension and impeller for grease build-up", "Check fire-suppression interlock has not derated fan speed"]'::json,
   '["Grease-laden filters", "Make-up air not running (negative pressure)", "Slipping fan belt", "Duct grease accumulation"]'::json,
   '["Weekly filter wash rotation", "Quarterly duct inspection", "Annual airflow re-balancing"]'::json,
   '["exhaust-hood", "extraction", "airflow", "filters"]'::json,121,22,'2026-03-30','Vikram Singh','[]'::json,'2026-01-15 11:00:00','2026-03-30 14:20:00');

-- ---------------------------------------------------------------------------
-- support_guides — knowledge-base guides
-- ---------------------------------------------------------------------------
DELETE FROM support_guides WHERE "companyId" = :company;
INSERT INTO support_guides
  ("companyId", "guideId", title, description, category, difficulty, "readTime", views, helpful,
   "lastUpdated", author, tags, sections, featured, format, "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-GDE-001','MagiCook Combi Oven: Daily Care & Cleaning','End-of-service cleaning routine, automatic wash programs, and what kitchen staff should never do to a combi oven.','Combi Ovens','Beginner','8 min',412,67,'2026-07-15','Rajesh Kumar','["cleaning", "daily-care", "combi-oven"]'::json,6,true,'Article','2025-10-12 10:00:00','2026-07-15 09:00:00'),
  (:company,'DEMO-GDE-002','Blast Chilling 101: HACCP-Compliant Cycles','Choosing soft vs hard chill, loading patterns, core-probe placement and HACCP logging on ChillRapid units.','Blast Chillers & Refrigeration','Beginner','10 min',356,61,'2026-06-10','Priya Sharma','["haccp", "blast-chilling", "food-safety"]'::json,7,true,'Article','2025-10-18 10:00:00','2026-06-10 11:30:00'),
  (:company,'DEMO-GDE-003','Commissioning Checklist: New Kitchen Handover','Step-by-step site acceptance for full galley fit-outs: utilities verification, equipment burn-in, staff orientation and snag capture.','Installation & Commissioning','Advanced','25 min',189,38,'2026-04-22','Vikram Singh','["commissioning", "handover", "checklist"]'::json,12,false,'Checklist','2025-11-08 10:00:00','2026-04-22 16:00:00'),
  (:company,'DEMO-GDE-004','Water Quality for Steam Equipment','Why water hardness kills steam generators, how to read a water test, and selecting filtration/softening for each site.','Preventive Maintenance','Intermediate','12 min',274,52,'2026-05-30','Amit Verma','["water-treatment", "descaling", "steam"]'::json,8,true,'Article','2025-12-14 10:00:00','2026-05-30 10:45:00'),
  (:company,'DEMO-GDE-005','Using B3 Connect Remote Monitoring','Enrolling equipment, reading telemetry dashboards, configuring alerts and acting on predictive maintenance warnings.','Remote Monitoring','Intermediate','15 min',231,44,'2026-08-25','Meera Nair','["iot", "b3-connect", "telemetry"]'::json,9,false,'Video','2026-02-05 10:00:00','2026-08-25 14:00:00'),
  (:company,'DEMO-GDE-006','Warranty Claims: What Is Covered and How to File','Coverage matrix by product family, exclusions (scale damage, misuse), required evidence and claim turnaround expectations.','Spare Parts & Warranty','Beginner','6 min',308,55,'2026-03-12','Kiran Reddy','["warranty", "claims", "coverage"]'::json,5,false,'Article','2025-10-30 10:00:00','2026-03-12 09:15:00');

-- ---------------------------------------------------------------------------
-- support_hardware_assets — service-department tooling & equipment
-- ---------------------------------------------------------------------------
DELETE FROM support_hardware_assets WHERE "companyId" = :company;
INSERT INTO support_hardware_assets
  ("companyId", "assetTag", name, category, manufacturer, model, "serialNumber", status, condition,
   location, "assignedTo", purchase, specifications, maintenance, lifecycle, "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-HW-001','Service Diagnostic Laptop 01','Laptop','Dell','Latitude 5450','DL5450-8842-A','Active','Good',
   '{"building": "Service HQ", "floor": "1", "room": "Dispatch"}'::json,
   '{"name": "Rajesh Kumar", "department": "Support - Combi Ovens", "email": "rajesh.kumar@manufacturingos.com"}'::json,
   '{"date": "2025-10-05", "cost": 95000, "vendor": "Dell India", "warrantyExpiry": "2028-10-04"}'::json,
   '{"cpu": "Core Ultra 5", "ram": "16 GB", "storage": "512 GB SSD", "software": "MagiCook Service Suite 4.2"}'::json,
   '{"lastService": "2026-06-01", "nextService": "2026-12-01", "serviceCount": 2}'::json,
   '{"age": "11 months", "expectedLife": "4 years", "remainingLife": "3.1 years", "depreciation": 22}'::json,
   '2025-10-05 10:00:00','2026-06-01 09:00:00'),
  (:company,'DEMO-HW-002','Thermal Imaging Camera','Diagnostic Tool','FLIR','E8 Pro','FLIR-E8-77120','Active','Good',
   '{"building": "Service HQ", "floor": "1", "room": "Tool Crib"}'::json,
   '{"name": "Priya Sharma", "department": "Support - Refrigeration", "email": "priya.sharma@manufacturingos.com"}'::json,
   '{"date": "2025-11-12", "cost": 285000, "vendor": "FLIR Systems", "warrantyExpiry": "2027-11-11"}'::json,
   '{"resolution": "320x240", "tempRange": "-20C to 550C", "accuracy": "+/-2%"}'::json,
   '{"lastService": "2026-05-15", "nextService": "2026-11-15", "serviceCount": 1}'::json,
   '{"age": "10 months", "expectedLife": "6 years", "remainingLife": "5.2 years", "depreciation": 14}'::json,
   '2025-11-12 10:00:00','2026-05-15 11:00:00'),
  (:company,'DEMO-HW-003','Refrigerant Recovery Unit','Field Equipment','Robinair','RG3','RG3-2025-4471','Active','Good',
   '{"building": "Service HQ", "floor": "G", "room": "Van Stock Bay 2"}'::json,
   '{"name": "Priya Sharma", "department": "Support - Refrigeration", "email": "priya.sharma@manufacturingos.com"}'::json,
   '{"date": "2025-10-20", "cost": 165000, "vendor": "Robinair India", "warrantyExpiry": "2027-10-19"}'::json,
   '{"refrigerants": "R404A, R134a, R290-safe", "recoveryRate": "0.25 kg/min vapour"}'::json,
   '{"lastService": "2026-04-10", "nextService": "2026-10-10", "serviceCount": 2}'::json,
   '{"age": "11 months", "expectedLife": "8 years", "remainingLife": "7.1 years", "depreciation": 11}'::json,
   '2025-10-20 10:00:00','2026-04-10 14:00:00'),
  (:company,'DEMO-HW-004','Combustion Analyzer','Diagnostic Tool','Testo','300 LL','T300-99321','Active','Excellent',
   '{"building": "Service HQ", "floor": "1", "room": "Tool Crib"}'::json,
   '{"name": "Vikram Singh", "department": "Support - Field Service", "email": "vikram.singh@manufacturingos.com"}'::json,
   '{"date": "2026-01-15", "cost": 145000, "vendor": "Testo India", "warrantyExpiry": "2028-01-14"}'::json,
   '{"sensors": "O2, CO (H2-compensated)", "use": "Gas range and fryer commissioning"}'::json,
   '{"lastService": "2026-07-15", "nextService": "2027-01-15", "serviceCount": 1}'::json,
   '{"age": "8 months", "expectedLife": "5 years", "remainingLife": "4.3 years", "depreciation": 13}'::json,
   '2026-01-15 10:00:00','2026-07-15 10:30:00'),
  (:company,'DEMO-HW-005','Anemometer / Airflow Meter','Diagnostic Tool','TSI','9535-A VelociCalc','TSI-9535-1188','Active','Good',
   '{"building": "Service HQ", "floor": "1", "room": "Tool Crib"}'::json,
   '{"name": "Vikram Singh", "department": "Support - Field Service", "email": "vikram.singh@manufacturingos.com"}'::json,
   '{"date": "2025-12-01", "cost": 88000, "vendor": "TSI Instruments", "warrantyExpiry": "2027-11-30"}'::json,
   '{"range": "0-30 m/s", "use": "Hood face-velocity and make-up air balancing"}'::json,
   '{"lastService": "2026-06-01", "nextService": "2026-12-01", "serviceCount": 1}'::json,
   '{"age": "9 months", "expectedLife": "7 years", "remainingLife": "6.2 years", "depreciation": 10}'::json,
   '2025-12-01 10:00:00','2026-06-01 09:30:00'),
  (:company,'DEMO-HW-006','Water Hardness Test Kit (Digital)','Diagnostic Tool','Hanna','HI97735','HI-97735-5520','Active','Good',
   '{"building": "Service HQ", "floor": "G", "room": "Van Stock Bay 1"}'::json,
   '{"name": "Amit Verma", "department": "Support - Combi Ovens", "email": "amit.verma@manufacturingos.com"}'::json,
   '{"date": "2026-02-10", "cost": 32000, "vendor": "Hanna Instruments", "warrantyExpiry": "2028-02-09"}'::json,
   '{"range": "0-750 mg/L CaCO3", "use": "Pre-install water survey for steam equipment"}'::json,
   '{"lastService": "2026-08-10", "nextService": "2027-02-10", "serviceCount": 1}'::json,
   '{"age": "7 months", "expectedLife": "5 years", "remainingLife": "4.4 years", "depreciation": 12}'::json,
   '2026-02-10 10:00:00','2026-08-10 10:00:00'),
  (:company,'DEMO-HW-007','Service Van 03 - Delhi NCR','Vehicle','Tata','Ace EV','TAEV-DL-3307','Active','Fair',
   '{"building": "Delhi Depot", "floor": "G", "room": "Parking"}'::json,
   '{"name": "Vikram Singh", "department": "Support - Field Service", "email": "vikram.singh@manufacturingos.com"}'::json,
   '{"date": "2025-10-15", "cost": 1250000, "vendor": "Tata Motors", "warrantyExpiry": "2028-10-14"}'::json,
   '{"payload": "600 kg", "range": "154 km", "fitout": "Racking + parts bins + 230V inverter"}'::json,
   '{"lastService": "2026-07-20", "nextService": "2027-01-20", "serviceCount": 3}'::json,
   '{"age": "11 months", "expectedLife": "8 years", "remainingLife": "7.1 years", "depreciation": 15}'::json,
   '2025-10-15 10:00:00','2026-07-20 12:00:00'),
  (:company,'DEMO-HW-008','Demo Kitchen Combi Oven (Training)','Training Equipment','B3 MACBIS','MagiCook Combi 10 GN','MC10-TRN-0001','Active','Good',
   '{"building": "Service HQ", "floor": "2", "room": "Training Kitchen"}'::json,
   null,
   '{"date": "2025-10-01", "cost": 850000, "vendor": "Internal Transfer", "warrantyExpiry": "2027-09-30"}'::json,
   '{"capacity": "10x GN 1/1", "power": "18.6 kW", "use": "Technician certification training rig"}'::json,
   '{"lastService": "2026-08-01", "nextService": "2026-11-01", "serviceCount": 4}'::json,
   '{"age": "11 months", "expectedLife": "10 years", "remainingLife": "9.1 years", "depreciation": 9}'::json,
   '2025-10-01 10:00:00','2026-08-01 09:00:00');

-- ---------------------------------------------------------------------------
-- support_software_assets — service-desk software licences
-- ---------------------------------------------------------------------------
DELETE FROM support_software_assets WHERE "companyId" = :company;
INSERT INTO support_software_assets
  ("companyId", name, vendor, category, version, "licenseType", licenses, cost, deployment,
   contract, compliance, support, "createdAt", "updatedAt")
VALUES
  (:company,'MagiCook Service Suite','B3 MACBIS','Diagnostics','4.2.1','Perpetual',
   '{"total": 15, "used": 12, "available": 3}'::json,'{"perLicense": 0, "totalAnnual": 120000, "billingCycle": "annual-maintenance"}'::json,
   '{"type": "On-Premise", "installCount": 12, "lastDeployed": "2026-07-02"}'::json,
   '{"startDate": "2025-10-01", "renewalDate": "2026-10-01", "vendor": "B3 MACBIS", "contactPerson": "Product Engineering", "contactEmail": "servicesuite@b3macbis.com"}'::json,
   '{"status": "Compliant", "lastAudit": "2026-04-15", "nextAudit": "2027-04-15"}'::json,
   '{"level": "Internal", "expiryDate": "2026-10-01", "supportHours": "24x7"}'::json,
   '2025-10-01 10:00:00','2026-07-02 09:00:00'),
  (:company,'B3 Connect Cloud Monitoring','B3 MACBIS','IoT Platform','2.8','Subscription',
   '{"total": 500, "used": 322, "available": 178}'::json,'{"perLicense": 1200, "totalAnnual": 600000, "billingCycle": "annual"}'::json,
   '{"type": "SaaS", "installCount": 322, "lastDeployed": "2026-09-01"}'::json,
   '{"startDate": "2026-01-01", "renewalDate": "2027-01-01", "vendor": "B3 MACBIS Digital", "contactPerson": "Cloud Ops", "contactEmail": "connect@b3macbis.com"}'::json,
   '{"status": "Compliant", "lastAudit": "2026-06-20", "nextAudit": "2026-12-20"}'::json,
   '{"level": "Premium", "expiryDate": "2027-01-01", "supportHours": "24x7"}'::json,
   '2026-01-01 10:00:00','2026-09-01 08:30:00'),
  (:company,'FieldRoute Dispatch','RouteWorks','Field Service Management','7.4','Subscription',
   '{"total": 20, "used": 18, "available": 2}'::json,'{"perLicense": 9500, "totalAnnual": 190000, "billingCycle": "annual"}'::json,
   '{"type": "SaaS", "installCount": 18, "lastDeployed": "2026-05-11"}'::json,
   '{"startDate": "2025-11-01", "renewalDate": "2026-11-01", "vendor": "RouteWorks", "contactPerson": "Asha Kulkarni", "contactEmail": "accounts@routeworks.io"}'::json,
   '{"status": "Compliant", "lastAudit": "2026-05-01", "nextAudit": "2026-11-01"}'::json,
   '{"level": "Standard", "expiryDate": "2026-11-01", "supportHours": "Business hours"}'::json,
   '2025-11-01 10:00:00','2026-05-11 10:00:00'),
  (:company,'FLIR Thermal Studio','FLIR','Diagnostics','2.1','Subscription',
   '{"total": 5, "used": 4, "available": 1}'::json,'{"perLicense": 18000, "totalAnnual": 90000, "billingCycle": "annual"}'::json,
   '{"type": "Desktop", "installCount": 4, "lastDeployed": "2026-02-18"}'::json,
   '{"startDate": "2025-12-01", "renewalDate": "2026-12-01", "vendor": "FLIR Systems", "contactPerson": "Sales Desk", "contactEmail": "india@flir.com"}'::json,
   '{"status": "Compliant", "lastAudit": "2026-03-10", "nextAudit": "2026-09-10"}'::json,
   '{"level": "Standard", "expiryDate": "2026-12-01", "supportHours": "Business hours"}'::json,
   '2025-12-01 10:00:00','2026-02-18 15:00:00'),
  (:company,'HACCP LogBook Pro','FoodSafe Digital','Compliance','5.0','Subscription',
   '{"total": 40, "used": 31, "available": 9}'::json,'{"perLicense": 2400, "totalAnnual": 96000, "billingCycle": "annual"}'::json,
   '{"type": "SaaS", "installCount": 31, "lastDeployed": "2026-06-05"}'::json,
   '{"startDate": "2026-02-01", "renewalDate": "2027-02-01", "vendor": "FoodSafe Digital", "contactPerson": "Rohit Bansal", "contactEmail": "sales@foodsafedigital.com"}'::json,
   '{"status": "Review Due", "lastAudit": "2026-02-15", "nextAudit": "2026-09-15"}'::json,
   '{"level": "Standard", "expiryDate": "2027-02-01", "supportHours": "Business hours"}'::json,
   '2026-02-01 10:00:00','2026-06-05 11:20:00'),
  (:company,'RemoteAssist AR Glasses Software','ViewSync','Remote Support','3.3','Subscription',
   '{"total": 8, "used": 5, "available": 3}'::json,'{"perLicense": 22000, "totalAnnual": 176000, "billingCycle": "annual"}'::json,
   '{"type": "Hybrid", "installCount": 5, "lastDeployed": "2026-08-14"}'::json,
   '{"startDate": "2026-03-01", "renewalDate": "2027-03-01", "vendor": "ViewSync", "contactPerson": "Elena Marsh", "contactEmail": "success@viewsync.io"}'::json,
   '{"status": "Compliant", "lastAudit": "2026-07-01", "nextAudit": "2027-01-01"}'::json,
   '{"level": "Premium", "expiryDate": "2027-03-01", "supportHours": "24x7"}'::json,
   '2026-03-01 10:00:00','2026-08-14 09:45:00');

-- ---------------------------------------------------------------------------
-- support_scheduled_changes — change-management calendar
-- ---------------------------------------------------------------------------
DELETE FROM support_scheduled_changes WHERE "companyId" = :company;
INSERT INTO support_scheduled_changes
  ("companyId", "ticketNumber", title, type, category, priority, implementer, "implementationDate",
   "implementationTime", duration, status, "affectedSystems", downtime, "backupCompleted",
   "stakeholdersNotified", "changeWindow", "approvedBy", "approvalDate", "rollbackPlan",
   "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-CHG-001','Combi oven firmware rollout v3.2 (fleet-wide via B3 Connect)','Normal','Firmware','P2','Meera Nair','2026-09-18','02:00','3h','Scheduled',
   '["MagiCook Combi fleet (84 units)", "B3 Connect Gateway"]'::json,false,true,true,'02:00-05:00 IST','Kiran Reddy','2026-09-02',true,'2026-08-25 10:00:00','2026-09-05 09:00:00'),
  (:company,'DEMO-CHG-002','Blue Fig Hotels: replace walk-in cold room compressor rack','Normal','Field Hardware','P2','Priya Sharma','2026-09-22','22:00','6h','Scheduled',
   '["ColdCore WR-20 - Blue Fig Mumbai Central Kitchen"]'::json,true,true,true,'22:00-04:00 IST','Kiran Reddy','2026-09-08',true,'2026-08-30 11:00:00','2026-09-08 14:00:00'),
  (:company,'DEMO-CHG-003','Ticketing portal upgrade to v6 (customer self-service)','Major','Software','P3','Meera Nair','2026-10-04','01:00','4h','Pending Approval',
   '["Customer Portal", "Support API"]'::json,true,false,false,'01:00-05:00 IST',null,null,true,'2026-09-01 09:30:00','2026-09-09 16:00:00'),
  (:company,'DEMO-CHG-004','Emergency: Harbour Grill dishwasher booster replacement','Emergency','Field Hardware','P1','Anita Desai','2026-09-11','06:00','2h','Approved',
   '["WashLine RC-200 - Harbour Grill Main Site"]'::json,true,true,true,'06:00-08:00 local','Kiran Reddy','2026-09-10',true,'2026-09-10 15:00:00','2026-09-10 16:30:00'),
  (:company,'DEMO-CHG-005','Descale program update for hard-water sites (batch config push)','Standard','Configuration','P3','Amit Verma','2026-09-25','03:00','1h','Scheduled',
   '["MagiCook Combi units - 22 hard-water sites"]'::json,false,true,true,'03:00-04:00 IST','Rajesh Kumar','2026-09-06',true,'2026-09-03 10:00:00','2026-09-06 11:00:00'),
  (:company,'DEMO-CHG-006','Metro Hospital: annual fire-suppression interlock test','Normal','Compliance','P2','Vikram Singh','2026-08-16','14:00','3h','Completed',
   '["Exhaust hoods - Metro Hospital Kitchens", "Ansul interlock"]'::json,true,true,true,'14:00-17:00 local','Kiran Reddy','2026-08-05',true,'2026-07-28 09:00:00','2026-08-16 18:00:00');

-- ---------------------------------------------------------------------------
-- support_report_templates — report catalog
-- ---------------------------------------------------------------------------
DELETE FROM support_report_templates WHERE "companyId" = :company;
INSERT INTO support_report_templates
  ("companyId", name, category, description, frequency, format, recipients, scheduled, popularity,
   "lastGenerated", meta, "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Ticket Volume & Backlog','Operations','Open/closed ticket counts, backlog age buckets and channel mix by category and team.','Daily','["PDF", "Excel"]'::json,6,true,92,'2026-09-10','{"defaultRange": "last_7_days"}'::json,'2025-10-08 10:00:00','2026-09-10 08:00:00'),
  (:company,'DEMO SLA Compliance Summary','Compliance','First-response and resolution SLA attainment vs SLA-CRIT/HIGH/MED/LOW policies, with breach root causes.','Weekly','["PDF", "Excel"]'::json,4,true,88,'2026-09-08','{"defaultRange": "last_week"}'::json,'2025-10-08 10:10:00','2026-09-08 08:00:00'),
  (:company,'DEMO Agent Performance Scorecard','Performance','Per-agent resolution times, CSAT, SLA compliance and workload balance.','Monthly','["PDF", "PowerPoint"]'::json,3,true,79,'2026-09-01','{"defaultRange": "last_month"}'::json,'2025-10-08 10:20:00','2026-09-01 08:00:00'),
  (:company,'DEMO Equipment Fault Trends','Operations','Fault frequency by product family (combi, chiller, warewash) and top error codes across the installed base.','Monthly','["PDF", "Excel", "CSV"]'::json,5,true,84,'2026-09-01','{"groupBy": "productFamily"}'::json,'2025-11-02 10:00:00','2026-09-01 08:05:00'),
  (:company,'DEMO Customer Satisfaction (CSAT) Deep Dive','Customer','CSAT and NPS trends by customer segment with verbatim highlights from survey comments.','Monthly','["PDF"]'::json,4,false,66,'2026-08-01','{"survey": "post-resolution"}'::json,'2025-12-01 10:00:00','2026-08-01 08:00:00'),
  (:company,'DEMO Executive Service Overview','Executive','One-page KPI summary: volumes, SLA, CSAT, warranty cost and PM completion for leadership review.','Weekly','["PDF", "PowerPoint"]'::json,2,true,74,'2026-09-08','{"audience": "leadership"}'::json,'2026-01-05 10:00:00','2026-09-08 08:10:00');

-- ---------------------------------------------------------------------------
-- support_report_schedules — automated delivery configs
-- ---------------------------------------------------------------------------
DELETE FROM support_report_schedules WHERE "companyId" = :company;
INSERT INTO support_report_schedules
  ("companyId", "reportName", "reportType", frequency, "dayOfWeek", time, format, recipients,
   "isActive", "lastRunAt", "nextRunAt", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Ticket Volume & Backlog','tickets','daily',null,'07:30','pdf','["kiran.reddy@manufacturingos.com", "support-leads@manufacturingos.com"]'::json,true,'2026-09-10 07:30:00','2026-09-11 07:30:00','2025-10-08 11:00:00','2026-09-10 07:30:00'),
  (:company,'DEMO SLA Compliance Summary','sla','weekly','Monday','08:00','excel','["kiran.reddy@manufacturingos.com", "service.head@manufacturingos.com"]'::json,true,'2026-09-08 08:00:00','2026-09-15 08:00:00','2025-10-08 11:10:00','2026-09-08 08:00:00'),
  (:company,'DEMO Agent Performance Scorecard','agents','monthly',null,'09:00','pdf','["service.head@manufacturingos.com", "hr.partners@manufacturingos.com"]'::json,true,'2026-09-01 09:00:00','2026-10-01 09:00:00','2025-10-08 11:20:00','2026-09-01 09:00:00'),
  (:company,'DEMO Executive Service Overview','analytics','weekly','Monday','08:30','powerpoint','["leadership@manufacturingos.com"]'::json,true,'2026-09-08 08:30:00','2026-09-15 08:30:00','2026-01-05 11:00:00','2026-09-08 08:30:00'),
  (:company,'DEMO CSAT Deep Dive','csat','quarterly',null,'10:00','pdf','["service.head@manufacturingos.com", "sales.directors@manufacturingos.com"]'::json,false,'2026-07-01 10:00:00','2026-10-01 10:00:00','2025-12-01 11:00:00','2026-07-01 10:00:00');

-- ---------------------------------------------------------------------------
-- support_custom_reports — saved report-builder definitions
-- ---------------------------------------------------------------------------
DELETE FROM support_custom_reports WHERE "companyId" = :company;
INSERT INTO support_custom_reports
  ("companyId", name, description, "dataSource", columns, filters, "chartType", "isShared",
   "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO Combi Oven Faults by Error Code','Breakdown of combi oven tickets by parsed E-code over the selected period.','tickets','["errorCode", "ticketCount", "avgResolutionHours", "topSites"]'::jsonb,'[{"field": "category", "operator": "equals", "value": "Combi Ovens"}, {"field": "tag", "operator": "contains", "value": "error-code"}]'::jsonb,'bar',true,'Rajesh Kumar','2025-11-20 10:00:00','2026-07-30 09:00:00'),
  (:company,'DEMO Enterprise SLA Breaches','SLA breaches limited to enterprise-segment customers with breach reason coding.','sla','["customer", "ticketNumber", "priority", "breachType", "minutesOver", "reason"]'::jsonb,'[{"field": "customerSegment", "operator": "equals", "value": "Enterprise"}, {"field": "breached", "operator": "equals", "value": "true"}]'::jsonb,'table',true,'Kiran Reddy','2025-12-10 10:00:00','2026-08-22 14:00:00'),
  (:company,'DEMO Night-Shift Telemetry Alert Load','Volume and disposition of IoT-originated tickets handled outside business hours.','analytics','["date", "alertType", "ticketsCreated", "autoResolved", "escalated"]'::jsonb,'[{"field": "source", "operator": "equals", "value": "iot-telemetry"}, {"field": "businessHours", "operator": "equals", "value": "false"}]'::jsonb,'line',false,'Meera Nair','2026-02-14 10:00:00','2026-09-03 08:00:00'),
  (:company,'DEMO CSAT by Product Family','Customer satisfaction split across combi, refrigeration, warewash and cooking-line tickets.','csat','["productFamily", "responses", "avgScore", "promoters", "detractors"]'::jsonb,'[{"field": "surveyType", "operator": "equals", "value": "post-resolution"}]'::jsonb,'pie',true,'Kiran Reddy','2026-03-01 10:00:00','2026-08-01 10:30:00'),
  (:company,'DEMO PM Visit Completion vs Plan','Planned vs completed preventive-maintenance visits per month per region.','agents','["month", "region", "planned", "completed", "completionRate"]'::jsonb,'[{"field": "category", "operator": "equals", "value": "Preventive Maintenance"}]'::jsonb,'bar',false,'Vikram Singh','2026-04-05 10:00:00','2026-09-01 11:00:00');
