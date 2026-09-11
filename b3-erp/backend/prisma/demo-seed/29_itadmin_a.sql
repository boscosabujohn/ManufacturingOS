-- Demo seed — IT Admin (part A) for B3 MACBIS.
-- Tables: it_access_policies, it_api_endpoints, it_audit_logs, it_automation_rules,
--         it_backup_records, it_cleanup_tasks, it_compliance_violations, it_custom_fields,
--         it_document_templates, it_email_test_logs, it_export_datasets, it_export_templates,
--         it_integration_configs, it_ip_whitelist_entries, it_license_features
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first, then re-inserts.
-- Exception: it_audit_logs has NO companyId column — its demo rows are marked with
--   sessionId LIKE 'DEMO-%' and deleted by that predicate.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- it_access_policies
-- ---------------------------------------------------------------------------
DELETE FROM it_access_policies WHERE "companyId" = :company;
INSERT INTO it_access_policies
  ("companyId", name, description, type, enabled, "appliedRoles", severity, config, "createdAt", "updatedAt")
VALUES
  (:company,'Password Complexity Policy','Minimum 12 characters with upper, lower, digit and symbol; 90-day rotation.','security',true,'Admin,Manager,User','high','{"minLength":12,"rotationDays":90,"historyCount":5}','2025-10-02 09:15:00','2026-03-14 11:20:00'),
  (:company,'Two-Factor Authentication','TOTP-based 2FA mandatory for admin and finance roles.','security',true,'Admin,Finance Manager','critical','{"method":"totp","gracePeriodDays":7}','2025-10-02 09:30:00','2026-01-08 16:45:00'),
  (:company,'Session Timeout Policy','Idle sessions terminated after 30 minutes; absolute limit 8 hours.','security',true,'Admin,Manager,User,Viewer','medium','{"idleMinutes":30,"absoluteHours":8}','2025-10-05 10:00:00','2025-12-19 14:10:00'),
  (:company,'Role-Based Module Access','Users may only access ERP modules granted to their assigned role.','access',true,'Admin,Manager,User','high','{"defaultDeny":true,"reviewCycle":"quarterly"}','2025-10-05 10:20:00','2026-06-02 09:05:00'),
  (:company,'Production Data Masking','PII columns masked for non-privileged roles in reports and exports.','data',true,'User,Viewer','high','{"maskedFields":["pan","aadhaar","salary","bankAccount"]}','2025-11-12 15:40:00','2026-04-22 10:30:00'),
  (:company,'Data Retention Policy','Transactional data retained 7 years; logs 12 months; temp files 30 days.','data',true,'Admin','medium','{"transactionYears":7,"logMonths":12,"tempDays":30}','2025-11-12 15:55:00','2026-02-11 12:00:00'),
  (:company,'Security Alert Escalation','Critical security alerts escalate to IT head via email + WhatsApp within 15 minutes.','notification',true,'Admin','critical','{"channels":["email","whatsapp"],"slaMinutes":15}','2026-01-20 11:25:00','2026-07-30 17:15:00'),
  (:company,'GDPR Data Subject Requests','Access/erasure requests processed within 30 days with audit trail.','compliance',true,'Admin,Data Protection Officer','high','{"slaDays":30,"auditTrail":true}','2026-02-03 09:45:00','2026-08-18 10:50:00');

-- ---------------------------------------------------------------------------
-- it_api_endpoints — the B3 ERP's own REST surface
-- ---------------------------------------------------------------------------
DELETE FROM it_api_endpoints WHERE "companyId" = :company;
INSERT INTO it_api_endpoints
  ("companyId", name, method, path, description, category, enabled, "authRequired", parameters, "rateLimit", "createdAt", "updatedAt")
VALUES
  (:company,'List Customers','GET','/api/crm/customers','Paginated customer master list with segment and status filters.','CRM',true,true,'{"query":["page","limit","status","segment"]}',120,'2025-10-03 08:00:00','2026-05-11 09:30:00'),
  (:company,'Create Lead','POST','/api/crm/leads','Create a CRM lead from web forms or manual entry.','CRM',true,true,'{"body":["firstName","lastName","company","email","leadSource"]}',60,'2025-10-03 08:05:00','2026-05-11 09:30:00'),
  (:company,'List Sales Orders','GET','/api/sales/orders','Sales order headers with customer, value and stage.','Sales',true,true,'{"query":["page","limit","status","customerId"]}',120,'2025-10-03 08:10:00','2026-03-25 14:00:00'),
  (:company,'Create Quotation','POST','/api/estimation/quotations','Generate MACBIS quotation from an approved estimation.','Sales',true,true,'{"body":["estimationId","validityDays","terms"]}',30,'2025-10-10 12:00:00','2026-03-25 14:00:00'),
  (:company,'Stock Levels','GET','/api/inventory/stock','Current stock by warehouse, item and batch.','Inventory',true,true,'{"query":["warehouseId","itemCode","belowReorder"]}',240,'2025-10-10 12:10:00','2026-06-17 10:45:00'),
  (:company,'Goods Receipt','POST','/api/procurement/grn','Post a goods receipt note against a purchase order.','Procurement',true,true,'{"body":["poId","items","receivedDate"]}',60,'2025-10-15 09:20:00','2026-06-17 10:45:00'),
  (:company,'Work Order Status','GET','/api/production/work-orders/:id','Work order progress, operations and material consumption.','Production',true,true,'{"path":["id"]}',180,'2025-11-01 10:30:00','2026-04-09 08:15:00'),
  (:company,'Employee Directory','GET','/api/hr/employees','Employee master with department and designation filters.','HR',true,true,'{"query":["department","status","page","limit"]}',120,'2025-11-01 10:35:00','2026-07-22 16:20:00'),
  (:company,'Payslip Download','GET','/api/hr/payroll/payslips/:id','Download generated payslip PDF for an employee period.','HR',true,true,'{"path":["id"]}',30,'2025-11-20 14:00:00','2026-07-22 16:20:00'),
  (:company,'Trial Balance','GET','/api/finance/reports/trial-balance','Trial balance for a fiscal period, drill-down to ledgers.','Finance',true,true,'{"query":["fromDate","toDate","costCenter"]}',60,'2025-12-05 11:00:00','2026-08-14 09:40:00'),
  (:company,'Health Check','GET','/api/health','Liveness/readiness probe for the NestJS backend.','System',true,false,'{}',600,'2025-10-01 07:00:00','2025-10-01 07:00:00'),
  (:company,'Webhook Receiver','POST','/api/integrations/webhooks/:provider','Inbound webhook receiver for WhatsApp and payment callbacks.','System',true,true,'{"path":["provider"],"headers":["x-signature"]}',300,'2026-01-15 13:30:00','2026-08-27 15:10:00');

-- ---------------------------------------------------------------------------
-- it_audit_logs — no companyId column; demo rows carry sessionId 'DEMO-...'
-- action/severity are native enum types; userId FK -> it_users(id).
-- ---------------------------------------------------------------------------
DELETE FROM it_audit_logs WHERE "sessionId" LIKE 'DEMO-%';
INSERT INTO it_audit_logs
  ("userId", username, module, action, description, "entityType", "entityId", "entityName",
   "oldValues", "newValues", "changedFields", severity, "ipAddress", "userAgent", "sessionId",
   "requestUrl", "httpMethod", "statusCode", "responseTime", success, "errorMessage",
   "additionalData", location, device, browser, os, tags, "createdAt")
VALUES
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','auth','Login','Successful administrator login',NULL,NULL,NULL,NULL,NULL,NULL,'Low','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0001','/api/auth/login','POST','200','142',true,NULL,'{"mfa":"totp"}','Kochi, IN','Desktop','Chrome','macOS','["auth","login"]','2026-08-28 08:02:11'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','it-admin','Update','Changed SMTP relay host in email settings','SystemConfig','smtp.host','Email Settings','{"host":"smtp.old-relay.local"}','{"host":"smtp.zeptomail.in"}','["host"]','Medium','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0001','/api/it-admin/system-configs/smtp.host','PUT','200','96',true,NULL,NULL,'Kochi, IN','Desktop','Chrome','macOS','["config","email"]','2026-08-28 08:15:47'),
  (NULL,'jthomas','auth','Login Failed','Failed login attempt — invalid password (3rd attempt)',NULL,NULL,NULL,NULL,NULL,NULL,'High','198.51.100.77','Mozilla/5.0 (Windows NT 10.0; Win64; x64) Edge/127.0','DEMO-sess-0002','/api/auth/login','POST','401','88',false,'Invalid credentials','{"attempt":3,"lockoutIn":2}','Chennai, IN','Desktop','Edge','Windows','["auth","security"]','2026-08-30 22:41:03'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','it-admin','Unlock','Unlocked user account after failed-login lockout','User','u-jthomas','Joseph Thomas',NULL,'{"status":"active"}','["status"]','Medium','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0003','/api/it-admin/users/u-jthomas/unlock','POST','200','110',true,NULL,NULL,'Kochi, IN','Desktop','Chrome','macOS','["user","unlock"]','2026-08-31 09:05:29'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','hr','Export','Exported employee master to Excel (20 records)','Dataset','hr_employees','Employee Master',NULL,NULL,NULL,'Medium','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0003','/api/it-admin/exports/run','POST','200','1840',true,NULL,'{"format":"excel","rows":20}','Kochi, IN','Desktop','Chrome','macOS','["export","hr"]','2026-09-01 11:32:54'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','it-admin','Create','Added IP range 10.20.0.0/24 to whitelist','IpWhitelistEntry','wl-branch-blr','Bengaluru Branch Range',NULL,'{"ipAddress":"10.20.0.0/24","status":"Active"}','["ipAddress","status"]','Medium','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0004','/api/it-admin/security/ip-whitelist','POST','201','75',true,NULL,NULL,'Kochi, IN','Desktop','Chrome','macOS','["security","network"]','2026-09-02 15:18:36'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','finance','View','Viewed trial balance report for FY26 Q1','Report','trial-balance','Trial Balance',NULL,NULL,NULL,'Low','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0004','/api/finance/reports/trial-balance','GET','200','620',true,NULL,'{"period":"2026-Q1"}','Kochi, IN','Desktop','Chrome','macOS','["report","finance"]','2026-09-03 10:07:12'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','it-admin','Custom','Nightly backup completed and verified','BackupRecord','bkp-2026-09-04','Nightly Full Backup',NULL,NULL,NULL,'Low','127.0.0.1','node-cron/3.0','DEMO-sess-sys','/api/it-admin/backups','POST','200','412',true,NULL,'{"size":"9.2 GB","target":"s3"}','Data Center','Server','N/A','Linux','["backup","automated"]','2026-09-04 02:31:40'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','it-admin','Update','Deactivated legacy Tally sync (v1) integration','IntegrationConfig','int-tally-v1','Tally ERP 9 Sync','{"status":"active"}','{"status":"inactive"}','["status"]','Medium','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0005','/api/it-admin/integrations/int-tally-v1','PUT','200','132',true,NULL,NULL,'Kochi, IN','Desktop','Chrome','macOS','["integration","config"]','2026-09-05 16:44:08'),
  (NULL,'system','it-admin','Custom','Nightly backup FAILED — S3 connection timeout',NULL,NULL,NULL,NULL,NULL,NULL,'Critical','127.0.0.1','node-cron/3.0','DEMO-sess-sys','/api/it-admin/backups','POST','500','30012',false,'ETIMEDOUT: connect to s3.ap-south-1.amazonaws.com','{"retryScheduled":true}','Data Center','Server','N/A','Linux','["backup","failure"]','2026-09-06 02:30:55'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','it-admin','Password Change','Administrator rotated own password per 90-day policy',NULL,NULL,NULL,NULL,NULL,NULL,'Medium','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0006','/api/auth/change-password','POST','200','204',true,NULL,NULL,'Kochi, IN','Desktop','Chrome','macOS','["auth","password"]','2026-09-08 09:12:26'),
  ((SELECT id FROM it_users WHERE username='admin' LIMIT 1),'admin','auth','Logout','Administrator logged out',NULL,NULL,NULL,NULL,NULL,NULL,'Low','203.0.113.24','Mozilla/5.0 (Macintosh; Intel Mac OS X 14_5) Chrome/128.0','DEMO-sess-0006','/api/auth/logout','POST','200','54',true,NULL,NULL,'Kochi, IN','Desktop','Chrome','macOS','["auth","logout"]','2026-09-08 18:30:02');

-- ---------------------------------------------------------------------------
-- it_automation_rules
-- ---------------------------------------------------------------------------
DELETE FROM it_automation_rules WHERE "companyId" = :company;
INSERT INTO it_automation_rules
  ("companyId", name, description, category, trigger, "triggerType", conditions, actions, status, enabled,
   priority, "lastTriggered", "executionCount", "successCount", "failureCount", "successRate", "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'Auto-lock After Failed Logins','Lock a user account after 5 consecutive failed login attempts.','Security','5 failed logins within 15 minutes','event','failedAttempts >= 5,windowMinutes <= 15','lock account,notify admin,write audit log','Active',true,'High','2026-08-30 22:41','23','23','0',100,'admin','2025-10-06 10:00:00','2026-08-30 22:41:10'),
  (:company,'Nightly Backup Kickoff','Trigger the full database backup to S3 every night at 02:30 IST.','Maintenance','Cron 30 2 * * *','schedule','always','run backup job,verify checksum,upload to S3,notify on failure','Active',true,'Critical','2026-09-10 02:30','345','339','6',98.26,'admin','2025-10-01 08:00:00','2026-09-10 02:32:00'),
  (:company,'Low Stock Reorder Alert','Notify procurement when stock falls below reorder level.','Inventory','Stock level below reorder point','event','availableQty < reorderLevel,itemActive = true','create notification,email procurement head','Active',true,'Medium','2026-09-09 14:12','412','410','2',99.51,'admin','2025-10-18 11:30:00','2026-09-09 14:12:30'),
  (:company,'Quotation Approval Escalation','Escalate quotations pending approval for more than 48 hours.','Sales','Quotation pending > 48h','schedule','status = pending_approval,ageHours > 48','escalate to sales head,send WhatsApp reminder','Active',true,'Medium','2026-09-08 09:00','67','67','0',100,'admin','2025-11-05 09:45:00','2026-09-08 09:00:15'),
  (:company,'Session Cleanup','Purge expired user sessions and stale refresh tokens hourly.','Maintenance','Cron 0 * * * *','schedule','expiredAt < now()','delete expired sessions,vacuum session table','Active',true,'Low','2026-09-10 06:00','2140','2140','0',100,'admin','2025-10-06 10:15:00','2026-09-10 06:00:05'),
  (:company,'New Employee Provisioning','Create ERP user, assign role and send welcome email on employee onboarding.','HR','Employee record created','event','status = active,email is present','create user account,assign default role,send welcome email','Active',true,'High','2026-07-14 10:22','20','19','1',95,'admin','2025-12-01 14:20:00','2026-07-14 10:22:40'),
  (:company,'Certificate Expiry Watch','Warn 30 days before TLS/SSL certificates expire.','Security','Daily certificate scan','schedule','daysToExpiry <= 30','notify IT head,create ticket','Active',true,'High','2026-09-10 07:00','120','120','0',100,'admin','2026-01-10 09:00:00','2026-09-10 07:00:20'),
  (:company,'Tally Ledger Sync Retry','Retry failed Tally voucher pushes up to 3 times with backoff.','Integration','Tally push failure','event','failureCount < 3,integration = tally','requeue voucher,exponential backoff,alert after 3rd failure','Paused',false,'Medium','2026-09-05 16:40','58','49','9',84.48,'admin','2026-02-15 12:10:00','2026-09-05 16:44:30');

-- ---------------------------------------------------------------------------
-- it_backup_records — nightly S3 backups for the last two weeks (one failure)
-- ---------------------------------------------------------------------------
DELETE FROM it_backup_records WHERE "companyId" = :company;
INSERT INTO it_backup_records
  ("companyId", name, type, status, size, location, "startedAt", "completedAt", duration, automated, "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'Nightly Full Backup 2026-08-28','full','completed','9.1 GB','s3://b3-erp-backups/nightly','2026-08-28 02:30','2026-08-28 02:54','24m 12s',true,'system','2026-08-28 02:54:12','2026-08-28 02:54:12'),
  (:company,'Nightly Full Backup 2026-08-29','full','completed','9.1 GB','s3://b3-erp-backups/nightly','2026-08-29 02:30','2026-08-29 02:53','23m 41s',true,'system','2026-08-29 02:53:41','2026-08-29 02:53:41'),
  (:company,'Nightly Full Backup 2026-08-30','full','completed','9.2 GB','s3://b3-erp-backups/nightly','2026-08-30 02:30','2026-08-30 02:55','25m 02s',true,'system','2026-08-30 02:55:02','2026-08-30 02:55:02'),
  (:company,'Nightly Full Backup 2026-08-31','full','completed','9.2 GB','s3://b3-erp-backups/nightly','2026-08-31 02:30','2026-08-31 02:54','24m 30s',true,'system','2026-08-31 02:54:30','2026-08-31 02:54:30'),
  (:company,'Nightly Full Backup 2026-09-01','full','completed','9.2 GB','s3://b3-erp-backups/nightly','2026-09-01 02:30','2026-09-01 02:56','26m 08s',true,'system','2026-09-01 02:56:08','2026-09-01 02:56:08'),
  (:company,'Nightly Full Backup 2026-09-02','full','completed','9.3 GB','s3://b3-erp-backups/nightly','2026-09-02 02:30','2026-09-02 02:55','25m 17s',true,'system','2026-09-02 02:55:17','2026-09-02 02:55:17'),
  (:company,'Nightly Full Backup 2026-09-03','full','completed','9.3 GB','s3://b3-erp-backups/nightly','2026-09-03 02:30','2026-09-03 02:54','24m 55s',true,'system','2026-09-03 02:54:55','2026-09-03 02:54:55'),
  (:company,'Nightly Full Backup 2026-09-04','full','completed','9.2 GB','s3://b3-erp-backups/nightly','2026-09-04 02:30','2026-09-04 02:31','1m 40s',true,'system','2026-09-04 02:31:40','2026-09-04 02:31:40'),
  (:company,'Nightly Full Backup 2026-09-05','full','completed','9.4 GB','s3://b3-erp-backups/nightly','2026-09-05 02:30','2026-09-05 02:57','27m 03s',true,'system','2026-09-05 02:57:03','2026-09-05 02:57:03'),
  (:company,'Nightly Full Backup 2026-09-06','full','failed',NULL,'s3://b3-erp-backups/nightly','2026-09-06 02:30','2026-09-06 02:30','30s (timeout)',true,'system','2026-09-06 02:30:55','2026-09-06 02:30:55'),
  (:company,'Retry Full Backup 2026-09-06','full','completed','9.4 GB','s3://b3-erp-backups/nightly','2026-09-06 06:15','2026-09-06 06:41','26m 22s',false,'admin','2026-09-06 06:41:22','2026-09-06 06:41:22'),
  (:company,'Nightly Full Backup 2026-09-07','full','completed','9.4 GB','s3://b3-erp-backups/nightly','2026-09-07 02:30','2026-09-07 02:56','26m 40s',true,'system','2026-09-07 02:56:40','2026-09-07 02:56:40'),
  (:company,'Nightly Full Backup 2026-09-08','full','completed','9.5 GB','s3://b3-erp-backups/nightly','2026-09-08 02:30','2026-09-08 02:57','27m 11s',true,'system','2026-09-08 02:57:11','2026-09-08 02:57:11'),
  (:company,'Nightly Full Backup 2026-09-09','full','completed','9.5 GB','s3://b3-erp-backups/nightly','2026-09-09 02:30','2026-09-09 02:58','28m 05s',true,'system','2026-09-09 02:58:05','2026-09-09 02:58:05'),
  (:company,'Nightly Full Backup 2026-09-10','full','completed','9.5 GB','s3://b3-erp-backups/nightly','2026-09-10 02:30','2026-09-10 02:57','27m 30s',true,'system','2026-09-10 02:57:30','2026-09-10 02:57:30'),
  (:company,'Pre-Upgrade Snapshot v2.4','full','completed','9.0 GB','s3://b3-erp-backups/adhoc','2026-08-15 21:00','2026-08-15 21:26','26m 18s',false,'admin','2026-08-15 21:26:18','2026-08-15 21:26:18');

-- ---------------------------------------------------------------------------
-- it_cleanup_tasks
-- ---------------------------------------------------------------------------
DELETE FROM it_cleanup_tasks WHERE "companyId" = :company;
INSERT INTO it_cleanup_tasks
  ("companyId", name, description, category, impact, "estimatedSpace", "recordCount", automated, enabled,
   "lastRunAt", "recordsAffected", "createdAt", "updatedAt")
VALUES
  (:company,'Purge Audit Logs > 12 Months','Delete audit log entries older than the 12-month retention window.','logs','low','1.8 GB',245000,true,true,'2026-09-01 03:10:00',18240,'2025-10-06 10:30:00','2026-09-01 03:10:00'),
  (:company,'Clear API Request Logs','Truncate raw API request/response logs older than 90 days.','logs','low','950 MB',612000,true,true,'2026-09-07 03:15:00',88400,'2025-10-06 10:32:00','2026-09-07 03:15:00'),
  (:company,'Remove Temp Export Files','Delete generated export files (CSV/Excel/PDF) older than 30 days.','temp','low','2.4 GB',1830,true,true,'2026-09-08 03:20:00',214,'2025-10-06 10:35:00','2026-09-08 03:20:00'),
  (:company,'Clean Orphaned Attachments','Remove document attachments whose parent records were deleted.','orphaned','medium','620 MB',412,false,true,'2026-08-20 15:00:00',97,'2025-11-14 09:00:00','2026-08-20 15:00:00'),
  (:company,'Deduplicate CRM Leads','Merge duplicate leads matched on email + phone signature.','duplicates','high','12 MB',86,false,true,'2026-07-29 11:45:00',31,'2025-12-03 14:20:00','2026-07-29 11:45:00'),
  (:company,'Archive Closed Work Orders','Move work orders closed > 24 months to the archive partition.','archived','medium','3.1 GB',5240,true,true,'2026-09-01 04:00:00',420,'2026-01-08 10:10:00','2026-09-01 04:00:00'),
  (:company,'Expire Stale Draft Quotations','Delete draft quotations untouched for over 180 days.','archived','medium','45 MB',134,false,false,NULL,0,'2026-02-19 16:30:00','2026-02-19 16:30:00'),
  (:company,'Vacuum Session Store','Reclaim space from the expired-session table after hourly purges.','temp','low','300 MB',0,true,true,'2026-09-10 05:00:00',0,'2025-10-06 10:40:00','2026-09-10 05:00:00');

-- ---------------------------------------------------------------------------
-- it_compliance_violations — linked to seeded it_compliance_requirements
-- ---------------------------------------------------------------------------
DELETE FROM it_compliance_violations WHERE "companyId" = :company;
INSERT INTO it_compliance_violations
  ("companyId", "requirementId", category, requirement, description, severity, status,
   "affectedEntity", "detectedBy", "assignedTo", "detectedAt", "dueDate", "resolvedAt", "createdAt", "updatedAt")
VALUES
  (:company,(SELECT id::text FROM it_compliance_requirements WHERE standard='ISO 27001' AND requirement='Access Control' LIMIT 1),'ISO 27001','Access Control','3 users hold both maker and checker roles in Finance, violating segregation of duties.','High','In Progress','Finance module role assignments','Quarterly access review','IT Security Team','2026-07-15 10:00:00','2026-09-30 00:00:00',NULL,'2026-07-15 10:05:00','2026-08-12 14:30:00'),
  (:company,(SELECT id::text FROM it_compliance_requirements WHERE standard='ISO 27001' AND requirement='Access Control' LIMIT 1),'ISO 27001','Access Control','5 dormant accounts (no login > 90 days) still enabled with active permissions.','Medium','Resolved','it_users dormant accounts','Automated access scan','IT Security Team','2026-05-20 09:30:00','2026-06-30 00:00:00','2026-06-18 16:20:00','2026-05-20 09:35:00','2026-06-18 16:20:00'),
  (:company,(SELECT id::text FROM it_compliance_requirements WHERE standard='GDPR' AND requirement='Data Protection' LIMIT 1),'GDPR','Data Protection','Employee PII exported to Excel without masking by a non-privileged user.','High','Resolved','HR export pipeline','Audit log review','Data Protection Officer','2026-04-10 11:15:00','2026-05-10 00:00:00','2026-04-28 10:00:00','2026-04-10 11:20:00','2026-04-28 10:00:00'),
  (:company,(SELECT id::text FROM it_compliance_requirements WHERE standard='GDPR' AND requirement='Right to Access' LIMIT 1),'GDPR','Right to Access','One data-subject access request exceeded the 30-day SLA (took 34 days).','Medium','Resolved','DSAR ticket #DSAR-2026-004','Compliance monthly review','Data Protection Officer','2026-03-05 14:00:00','2026-04-05 00:00:00','2026-03-22 12:40:00','2026-03-05 14:05:00','2026-03-22 12:40:00'),
  (:company,(SELECT id::text FROM it_compliance_requirements WHERE standard='SOC 2' AND requirement='Incident Response' LIMIT 1),'SOC 2','Incident Response','Backup failure on 2026-09-06 was not escalated within the documented 15-minute SLA.','High','Open','Backup escalation runbook','Post-incident review','IT Operations','2026-09-06 09:00:00','2026-10-06 00:00:00',NULL,'2026-09-06 09:10:00','2026-09-06 09:10:00'),
  (:company,(SELECT id::text FROM it_compliance_requirements WHERE standard='ISO 27001' AND requirement='Encryption' LIMIT 1),'ISO 27001','Encryption','Legacy Tally v1 sync channel transferred vouchers over plain HTTP.','Critical','Resolved','Tally ERP 9 integration','Network security scan','IT Security Team','2026-08-28 16:30:00','2026-09-15 00:00:00','2026-09-05 16:44:00','2026-08-28 16:35:00','2026-09-05 16:44:00'),
  (:company,(SELECT id::text FROM it_compliance_requirements WHERE standard='PCI DSS' AND requirement='Payment Security' LIMIT 1),'PCI DSS','Payment Security','Payment-gateway webhook secret unchanged for over 12 months.','Low','In Progress','Payment webhook configuration','Annual PCI self-assessment','Finance Security','2026-08-01 10:45:00','2026-10-31 00:00:00',NULL,'2026-08-01 10:50:00','2026-08-25 09:15:00');

-- ---------------------------------------------------------------------------
-- it_custom_fields
-- ---------------------------------------------------------------------------
DELETE FROM it_custom_fields WHERE "companyId" = :company;
INSERT INTO it_custom_fields
  ("companyId", name, label, module, "fieldType", required, "defaultValue", options, validation,
   "helpText", "createdAtLabel", active, "createdAt", "updatedAt")
VALUES
  (:company,'kitchen_type','Kitchen Type','crm','dropdown',false,NULL,'Commercial,Cloud Kitchen,Institutional,QSR,Hotel',NULL,'Type of kitchen the customer operates.','2025-10-12',true,'2025-10-12 10:00:00','2026-02-04 11:30:00'),
  (:company,'gst_number','GSTIN','crm','text',true,NULL,NULL,'^[0-9]{2}[A-Z]{5}[0-9]{4}[A-Z]{1}[1-9A-Z]{1}Z[0-9A-Z]{1}$','15-character GST identification number.','2025-10-12',true,'2025-10-12 10:05:00','2025-10-12 10:05:00'),
  (:company,'site_survey_done','Site Survey Completed','sales','boolean',false,'false',NULL,NULL,'Whether a site measurement survey has been completed before quotation.','2025-10-20',true,'2025-10-20 09:30:00','2025-10-20 09:30:00'),
  (:company,'installation_deadline','Installation Deadline','sales','date',false,NULL,NULL,NULL,'Customer-committed installation completion date.','2025-11-02',true,'2025-11-02 14:15:00','2026-01-19 10:00:00'),
  (:company,'gas_type','Gas Supply Type','estimation','dropdown',false,'LPG','LPG,PNG,Electric Only',NULL,'Fuel type available at the customer site, drives burner selection.','2025-11-18',true,'2025-11-18 11:40:00','2025-11-18 11:40:00'),
  (:company,'warranty_months','Warranty Period (Months)','after-sales','number',false,'12',NULL,'min:0;max:60','Warranty coverage in months for the installed equipment.','2025-12-09',true,'2025-12-09 15:20:00','2026-03-11 09:45:00'),
  (:company,'uniform_size','Uniform Size','hr','dropdown',false,NULL,'XS,S,M,L,XL,XXL',NULL,'Factory uniform size for the employee.','2026-01-22',true,'2026-01-22 10:10:00','2026-01-22 10:10:00'),
  (:company,'amc_reference_url','AMC Contract Link','after-sales','url',false,NULL,NULL,NULL,'Link to the signed AMC contract document.','2026-02-14',true,'2026-02-14 12:00:00','2026-02-14 12:00:00');

-- ---------------------------------------------------------------------------
-- it_document_templates
-- ---------------------------------------------------------------------------
DELETE FROM it_document_templates WHERE "companyId" = :company;
INSERT INTO it_document_templates
  ("companyId", name, description, type, category, content, variables, format, "lastModified",
   "usageCount", "isDefault", active, "createdAt", "updatedAt")
VALUES
  (:company,'Quotation Cover Letter','Standard cover letter accompanying MACBIS quotations.','document','Sales','<h1>Quotation {{quotationNumber}}</h1><p>Dear {{customerName}},</p><p>Please find our detailed quotation for {{projectName}} valid until {{validUntil}}.</p>','quotationNumber,customerName,projectName,validUntil','pdf','2026-06-12',148,true,true,'2025-10-08 09:00:00','2026-06-12 10:30:00'),
  (:company,'Proforma Invoice','Proforma invoice generated ahead of advance payment.','invoice','Finance','<h1>Proforma Invoice {{invoiceNumber}}</h1><p>Bill To: {{customerName}}</p><p>Amount: {{amount}} due by {{dueDate}}.</p>','invoiceNumber,customerName,amount,dueDate','pdf','2026-04-03',96,true,true,'2025-10-08 09:10:00','2026-04-03 15:20:00'),
  (:company,'Order Confirmation Email','Email sent to customers when a sales order is confirmed.','email','Sales','<p>Hi {{contactPerson}},</p><p>Your order {{orderNumber}} worth {{orderValue}} is confirmed. Expected delivery: {{deliveryDate}}.</p>','contactPerson,orderNumber,orderValue,deliveryDate','html','2026-02-25',322,true,true,'2025-10-15 11:00:00','2026-02-25 09:40:00'),
  (:company,'Delivery Challan','Goods delivery challan for dispatches from the factory.','document','Logistics','<h2>Delivery Challan {{challanNumber}}</h2><p>Vehicle: {{vehicleNumber}} | Driver: {{driverName}}</p><p>Items: {{itemSummary}}</p>','challanNumber,vehicleNumber,driverName,itemSummary','pdf','2026-05-18',210,true,true,'2025-10-22 14:30:00','2026-05-18 16:10:00'),
  (:company,'Installation Completion Report','Report signed off after on-site installation and commissioning.','report','After-Sales','<h2>Installation Report — {{projectName}}</h2><p>Site: {{siteAddress}}</p><p>Completed on {{completionDate}} by {{engineerName}}.</p>','projectName,siteAddress,completionDate,engineerName','pdf','2026-07-09',74,false,true,'2025-11-10 10:20:00','2026-07-09 12:00:00'),
  (:company,'AMC Renewal Reminder','Email reminding customers of upcoming AMC expiry.','email','After-Sales','<p>Dear {{customerName}},</p><p>Your AMC {{contractNumber}} expires on {{expiryDate}}. Renew now to keep priority support.</p>','customerName,contractNumber,expiryDate','html','2026-08-02',41,false,true,'2026-01-05 09:50:00','2026-08-02 11:25:00'),
  (:company,'Offer Letter','HR offer letter for new hires.','document','HR','<p>Dear {{candidateName}},</p><p>We are pleased to offer you the role of {{designation}} at a CTC of {{ctc}}, joining on {{joiningDate}}.</p>','candidateName,designation,ctc,joiningDate','docx','2026-03-17',12,true,true,'2025-12-14 13:00:00','2026-03-17 10:15:00'),
  (:company,'Equipment Serial Label','Printable label with serial number and QR for manufactured units.','label','Production','SN: {{serialNumber}} | Model: {{modelCode}} | Mfg: {{mfgDate}} | QR: {{qrPayload}}','serialNumber,modelCode,mfgDate,qrPayload','plain','2026-06-28',865,true,true,'2025-11-25 15:40:00','2026-06-28 08:55:00');

-- ---------------------------------------------------------------------------
-- it_email_test_logs
-- ---------------------------------------------------------------------------
DELETE FROM it_email_test_logs WHERE "companyId" = :company;
INSERT INTO it_email_test_logs
  ("companyId", "toAddress", "smtpHost", success, message, "createdAt")
VALUES
  (:company,'admin@manufacturingos.com','smtp.old-relay.local',false,'Connection refused: relay host unreachable on port 587.','2026-08-27 17:05:00'),
  (:company,'admin@manufacturingos.com','smtp.zeptomail.in',true,'Test email accepted by relay (250 OK), delivered in 1.2s.','2026-08-28 08:18:00'),
  (:company,'it-support@b3macbis.com','smtp.zeptomail.in',true,'Test email accepted by relay (250 OK), delivered in 0.9s.','2026-08-28 08:20:00'),
  (:company,'sales@b3macbis.com','smtp.zeptomail.in',true,'Test email accepted by relay (250 OK), delivered in 1.1s.','2026-09-01 10:12:00'),
  (:company,'noreply@b3macbis.com','smtp.zeptomail.in',false,'554 sender address not verified for this domain.','2026-09-03 15:47:00'),
  (:company,'noreply@b3macbis.com','smtp.zeptomail.in',true,'Sender verified; test email accepted (250 OK).','2026-09-03 16:30:00');

-- ---------------------------------------------------------------------------
-- it_export_datasets
-- ---------------------------------------------------------------------------
DELETE FROM it_export_datasets WHERE "companyId" = :company;
INSERT INTO it_export_datasets
  ("companyId", name, category, "recordCount", size, exportable, "createdAt", "updatedAt")
VALUES
  (:company,'Customer Master','CRM',186,'2.1 MB',true,'2025-10-09 09:00:00','2026-09-01 03:00:00'),
  (:company,'Lead Pipeline','CRM',342,'1.4 MB',true,'2025-10-09 09:02:00','2026-09-01 03:00:00'),
  (:company,'Sales Orders','Sales',1240,'8.6 MB',true,'2025-10-09 09:05:00','2026-09-01 03:00:00'),
  (:company,'Quotations','Sales',890,'12.3 MB',true,'2025-10-09 09:07:00','2026-09-01 03:00:00'),
  (:company,'Item Master','Inventory',3480,'5.2 MB',true,'2025-10-09 09:10:00','2026-09-01 03:00:00'),
  (:company,'Stock Ledger','Inventory',48200,'64.8 MB',true,'2025-10-09 09:12:00','2026-09-01 03:00:00'),
  (:company,'Purchase Orders','Procurement',760,'4.9 MB',true,'2025-10-09 09:15:00','2026-09-01 03:00:00'),
  (:company,'Employee Master','HR',20,'180 KB',true,'2025-10-09 09:18:00','2026-09-01 03:00:00'),
  (:company,'General Ledger','Finance',15600,'22.4 MB',true,'2025-10-09 09:20:00','2026-09-01 03:00:00'),
  (:company,'Audit Trail','System',245000,'310 MB',false,'2025-10-09 09:22:00','2026-09-01 03:00:00');

-- ---------------------------------------------------------------------------
-- it_export_templates
-- ---------------------------------------------------------------------------
DELETE FROM it_export_templates WHERE "companyId" = :company;
INSERT INTO it_export_templates
  ("companyId", name, description, dataset, format, tables, columns, filters, "lastUsedAt", "createdAt", "updatedAt")
VALUES
  (:company,'Monthly Sales Pack','Sales orders + quotations for the monthly review deck.','Sales Orders','excel','["sales_orders","quotations","crm_customers"]','["orderNumber","customerName","orderValue","status","orderDate"]','["date_range:current_month"]','2026-09-01 10:05:00','2025-10-20 11:00:00','2026-09-01 10:05:00'),
  (:company,'GST Filing Export','Ledger and invoice data formatted for monthly GST filing.','General Ledger','csv','["finance_invoices","finance_gl_entries"]','["invoiceNumber","gstin","taxableValue","cgst","sgst","igst"]','["date_range:previous_month","status:posted"]','2026-09-05 09:30:00','2025-11-02 09:15:00','2026-09-05 09:30:00'),
  (:company,'Inventory Valuation Snapshot','Stock ledger with item costs for quarter-end valuation.','Stock Ledger','excel','["inventory_stock","inventory_items"]','["itemCode","itemName","warehouse","qty","avgCost","value"]','["date_range:quarter_end"]','2026-07-01 08:45:00','2025-12-10 14:30:00','2026-07-01 08:45:00'),
  (:company,'HR Statutory Export','Employee master with PF/ESI fields for statutory filings.','Employee Master','csv','["hr_employees","hr_statutory_details"]','["employeeCode","name","pfNumber","esiNumber","uan","grossSalary"]','["status:active"]','2026-08-31 17:20:00','2026-01-15 10:00:00','2026-08-31 17:20:00'),
  (:company,'CRM Full Dump','All CRM entities for the marketing analytics warehouse.','Customer Master','json','["crm_customers","crm_leads","crm_contacts","crm_opportunities"]',NULL,NULL,'2026-08-15 22:00:00','2026-02-20 16:40:00','2026-08-15 22:00:00'),
  (:company,'Audit Evidence Package','System configs + audit trail extract for external auditors.','Audit Trail','sql','["it_audit_logs","it_system_configs","it_access_policies"]',NULL,'["date_range:fiscal_year"]',NULL,'2026-03-30 11:10:00','2026-03-30 11:10:00');

-- ---------------------------------------------------------------------------
-- it_integration_configs
-- ---------------------------------------------------------------------------
DELETE FROM it_integration_configs WHERE "companyId" = :company;
INSERT INTO it_integration_configs
  ("companyId", name, category, description, status, icon, config, "lastSync", "syncFrequency", features, "createdAt", "updatedAt")
VALUES
  (:company,'Keycloak SSO','erp','OpenID Connect identity provider issuing JWTs for both ERP backends.','active','shield','{"realm":"b3-macbis","authUrl":"https://auth.b3macbis.com","clientId":"erp-frontend"}','2026-09-10 07:00','realtime','Single Sign-On,Token Refresh,Role Mapping','2025-10-01 08:30:00','2026-09-10 07:00:10'),
  (:company,'ZeptoMail SMTP','communication','Transactional email relay for order confirmations, payslips and alerts.','active','mail','{"host":"smtp.zeptomail.in","port":587,"secure":"starttls","fromDomain":"b3macbis.com"}','2026-09-10 06:45','realtime','Transactional Email,Bounce Tracking','2025-10-04 10:15:00','2026-09-10 06:45:30'),
  (:company,'Tally Prime Sync','erp','Pushes sales/purchase vouchers and ledger masters to Tally Prime for statutory books.','active','book','{"endpoint":"http://tally-bridge.local:9000","companyName":"B3 MACBIS Pvt Ltd","voucherTypes":["Sales","Purchase","Payment","Receipt"]}','2026-09-10 06:00','hourly','Voucher Push,Ledger Sync,Error Requeue','2025-10-25 12:00:00','2026-09-10 06:00:45'),
  (:company,'Tally ERP 9 Sync (Legacy)','erp','Deprecated v1 Tally channel over plain HTTP; replaced by Tally Prime Sync.','inactive','book','{"endpoint":"http://192.168.1.50:9000","deprecated":true}','2026-09-05 16:00','manual','Voucher Push','2025-10-10 09:00:00','2026-09-05 16:44:20'),
  (:company,'WhatsApp Business API','communication','Customer notifications: order status, delivery ETA, AMC renewal reminders.','active','message-circle','{"provider":"Meta Cloud API","phoneNumberId":"1044XXXXXX","templateNamespace":"b3_macbis"}','2026-09-10 07:10','realtime','Template Messages,Delivery Receipts,Opt-out Handling','2025-11-08 14:20:00','2026-09-10 07:10:05'),
  (:company,'AWS S3 Backup Store','storage','Encrypted S3 bucket receiving nightly database and document backups.','active','database','{"bucket":"b3-erp-backups","region":"ap-south-1","encryption":"SSE-KMS","lifecycleDays":90}','2026-09-10 02:57','daily','Nightly Backups,Lifecycle Policies,Checksum Verify','2025-10-01 08:45:00','2026-09-10 02:57:35'),
  (:company,'Razorpay Payment Gateway','payment','Collects advance payments against proforma invoices via payment links.','configured','credit-card','{"mode":"live","webhookPath":"/api/integrations/webhooks/razorpay"}','2026-09-08 18:00','realtime','Payment Links,Webhooks,Settlement Reports','2026-01-18 11:30:00','2026-09-08 18:00:50'),
  (:company,'Google Analytics 4','analytics','Tracks customer-portal usage for the after-sales self-service site.','inactive','bar-chart','{"measurementId":"G-XXXX0000"}',NULL,'daily','Pageview Tracking,Event Funnels','2026-03-12 15:00:00','2026-03-12 15:00:00');

-- ---------------------------------------------------------------------------
-- it_ip_whitelist_entries
-- ---------------------------------------------------------------------------
DELETE FROM it_ip_whitelist_entries WHERE "companyId" = :company;
INSERT INTO it_ip_whitelist_entries
  ("companyId", "ipAddress", type, description, category, "addedBy", "addedDate", "lastAccess",
   "accessCount", status, "expiresAt", "createdAt", "updatedAt")
VALUES
  (:company,'203.0.113.24','Single','Head office static IP — admin console access.','Office','admin','2025-10-02','2026-09-10 07:00',18420,'Active',NULL,'2025-10-02 09:00:00','2026-09-10 07:00:00'),
  (:company,'203.0.113.0/28','Range','Head office network range (Kochi).','Office','admin','2025-10-02','2026-09-10 08:15',96240,'Active',NULL,'2025-10-02 09:05:00','2026-09-10 08:15:00'),
  (:company,'10.20.0.0/24','Range','Bengaluru branch office LAN.','Branch','admin','2026-09-02','2026-09-09 18:40',3120,'Active',NULL,'2026-09-02 15:18:00','2026-09-09 18:40:00'),
  (:company,'198.51.100.140','Single','Factory floor kiosk — production terminal.','Factory','admin','2025-10-20','2026-09-10 06:30',45210,'Active',NULL,'2025-10-20 10:30:00','2026-09-10 06:30:00'),
  (:company,'192.0.2.55','Single','External auditor VPN endpoint (fiscal-year audit).','Vendor','admin','2026-03-25','2026-04-18 17:00',312,'Expired','2026-04-30','2026-03-25 09:45:00','2026-05-01 00:00:00'),
  (:company,'192.0.2.88','Single','Tally bridge server (on-prem) calling voucher APIs.','Integration','admin','2025-10-25','2026-09-10 06:00',88760,'Active',NULL,'2025-10-25 12:10:00','2026-09-10 06:00:00'),
  (:company,'198.51.100.200','Single','IT support vendor remote-maintenance window.','Vendor','admin','2026-08-18','2026-08-30 21:00',145,'Active','2026-09-30','2026-08-18 11:00:00','2026-08-30 21:00:00'),
  (:company,'203.0.113.99','Single','MD home office for after-hours approvals.','Remote','admin','2025-12-01','2026-09-07 22:10',1480,'Active',NULL,'2025-12-01 16:20:00','2026-09-07 22:10:00');

-- ---------------------------------------------------------------------------
-- it_license_features — ERP module licensing for the B3 deployment
-- ---------------------------------------------------------------------------
DELETE FROM it_license_features WHERE "companyId" = :company;
INSERT INTO it_license_features
  ("companyId", name, description, category, enabled, included, tier, "usageLimit", "usageCount", "createdAt", "updatedAt")
VALUES
  (:company,'CRM & Lead Management','Customer, lead and opportunity management.','Core Features',true,true,'Enterprise',NULL,342,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'Sales & Quotations (MACBIS)','MACBIS sales flow with estimation-driven quotations.','Core Features',true,true,'Enterprise',NULL,890,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'Procurement & Inventory','Purchase orders, GRN, multi-warehouse stock.','Core Features',true,true,'Enterprise',NULL,4240,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'Production & Work Orders','Work order planning, routing and shop-floor tracking.','Core Features',true,true,'Enterprise',NULL,1260,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'Finance & Accounting','GL, AR/AP, GST-compliant invoicing and reports.','Core Features',true,true,'Enterprise',NULL,15600,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'HR & Payroll','Employee lifecycle, attendance, Indian statutory payroll.','Core Features',true,true,'Enterprise',50,20,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'After-Sales & AMC','Service tickets, AMC contracts and renewal tracking.','Add-ons',true,true,'Enterprise',NULL,74,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'API Access','REST API access for external integrations.','Add-ons',true,true,'Enterprise',100000,68450,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'WhatsApp Notifications','Customer notifications via WhatsApp Business API.','Add-ons',true,false,'Metered',5000,2140,'2025-11-08 14:20:00','2026-09-01 00:00:00'),
  (:company,'Advanced Analytics','Dashboards, KPI builder and scheduled report packs.','Add-ons',false,false,'Premium',NULL,0,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'Multi-Company Consolidation','Consolidated reporting across group companies.','Enterprise',false,false,'Premium',3,0,'2025-10-01 08:00:00','2026-09-01 00:00:00'),
  (:company,'Named User Licenses','Concurrent named-user seats on the ERP.','Licensing',true,true,'Enterprise',60,38,'2025-10-01 08:00:00','2026-09-01 00:00:00');
