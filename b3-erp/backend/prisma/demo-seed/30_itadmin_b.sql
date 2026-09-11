-- Demo seed — IT Admin (part B) for B3 MACBIS.
-- Tables: it_user_groups, it_security_policies, it_license_users, it_monitored_servers,
--         it_notification_settings, it_notification_rules, it_notification_preferences,
--         it_notifications, it_password_history, it_scheduled_jobs, it_security_alerts,
--         it_two_factor_enrollments, it_two_factor_settings, it_webhook_endpoints,
--         user_preferences
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first, then re-inserts.
--   * companyId-scoped tables delete by "companyId" = :company
--   * it_notifications / it_notification_preferences delete by "createdBy" = 'demo-seed'
--   * it_password_history deletes by metadata->>'seed' = 'demo'
--   * user_preferences deletes by the admin user's id (singleton row per user)
\set company '''b3000000-0000-4000-8000-000000000001'''

-- Resolve the single seeded IT admin user (it_users has exactly one row: admin).
SELECT id AS admin_id FROM it_users WHERE username = 'admin' LIMIT 1 \gset

-- ---------------------------------------------------------------------------
-- it_user_groups — department-aligned access groups
-- ---------------------------------------------------------------------------
DELETE FROM it_user_groups WHERE "companyId" = :company;
INSERT INTO it_user_groups
  ("companyId", name, description, "memberCount", permissions, members, "createdDate", status, "createdAt", "updatedAt")
VALUES
  (:company,'IT Administrators','Full platform administration and configuration access',2,'users.manage,roles.manage,system.configure,security.manage','["Rajesh Kumar","Deepak Joshi"]','2025-10-02','Active','2025-10-02 09:15:00','2026-08-14 11:20:00'),
  (:company,'Finance Team','Access to finance, invoicing and payment modules',4,'finance.read,finance.write,reports.finance','["Priya Sharma","Sunita Rao","Ajay Pillai","Amit Verma"]','2025-10-05','Active','2025-10-05 10:00:00','2026-07-22 16:05:00'),
  (:company,'HR Team','Employee records, payroll and statutory compliance',3,'hr.read,hr.write,payroll.process','["Anita Desai","Meera Nair","Kiran Reddy"]','2025-10-05','Active','2025-10-05 10:10:00','2026-06-30 09:45:00'),
  (:company,'Production Supervisors','Work orders, MES dashboards and shop-floor reporting',4,'production.read,production.write,workorders.approve','["Vikram Singh","Suresh Patel","Ravi Menon","Deepak Joshi"]','2025-10-12','Active','2025-10-12 08:30:00','2026-08-01 14:10:00'),
  (:company,'Sales & CRM','Leads, quotations and customer account management',3,'crm.read,crm.write,quotations.create','["Amit Verma","Kiran Reddy","Priya Sharma"]','2025-10-20','Active','2025-10-20 11:00:00','2026-05-18 10:30:00'),
  (:company,'Procurement Team','Purchase requisitions, orders and vendor management',2,'procurement.read,procurement.write,po.approve','["Suresh Patel","Sunita Rao"]','2025-11-03','Active','2025-11-03 09:00:00','2026-04-09 15:25:00'),
  (:company,'Quality Inspectors','Inspection plans, NCRs and quality certificates',2,'quality.read,quality.write,ncr.raise','["Meera Nair","Ravi Menon"]','2025-11-15','Active','2025-11-15 13:40:00','2026-03-27 12:00:00'),
  (:company,'Warehouse Operators','Stock entries, transfers and dispatch confirmation',3,'inventory.read,inventory.write,dispatch.confirm','["Ajay Pillai","Vikram Singh","Anita Desai"]','2025-12-01','Active','2025-12-01 08:00:00','2026-02-11 17:30:00');

-- ---------------------------------------------------------------------------
-- it_security_policies
-- ---------------------------------------------------------------------------
DELETE FROM it_security_policies WHERE "companyId" = :company;
INSERT INTO it_security_policies
  ("companyId", name, description, type, enabled, "appliedRoles", severity, config, "createdAt", "updatedAt")
VALUES
  (:company,'Password Complexity','Minimum 12 characters with upper, lower, digit and symbol','password',true,'All Roles','high','{"minLength":12,"requireUpper":true,"requireLower":true,"requireDigit":true,"requireSymbol":true,"historyCount":5}','2025-10-01 09:00:00','2026-01-15 10:30:00'),
  (:company,'Account Lockout','Lock account after 5 failed login attempts for 30 minutes','authentication',true,'All Roles','high','{"maxAttempts":5,"lockoutMinutes":30,"resetCounterMinutes":15}','2025-10-01 09:05:00','2025-10-01 09:05:00'),
  (:company,'Session Timeout','Idle sessions expire after 30 minutes; absolute cap 12 hours','session',true,'All Roles','medium','{"idleMinutes":30,"absoluteHours":12,"concurrentSessions":3}','2025-10-01 09:10:00','2026-03-04 14:20:00'),
  (:company,'Two-Factor Rollout','2FA mandatory for admins now; all staff by 2026-10-01','authentication',true,'Administrator,Finance Manager,HR Manager','high','{"enforcedRoles":["Administrator"],"deadline":"2026-10-01","gracePeriodDays":30}','2025-11-10 11:00:00','2026-06-20 09:15:00'),
  (:company,'IP Access Restriction','API and admin console restricted to office and VPN ranges','network',true,'Administrator','high','{"mode":"allowlist","enforceFor":["admin-console","api"]}','2025-11-18 10:00:00','2026-02-02 16:40:00'),
  (:company,'Data Export Approval','Bulk exports above 5,000 rows require manager approval','data',true,'All Roles','medium','{"rowThreshold":5000,"approverRole":"Department Manager","auditAll":true}','2025-12-05 13:30:00','2026-05-11 10:00:00'),
  (:company,'Audit Log Retention','Retain audit and access logs for 365 days, archived to cold storage','security',true,'All Roles','low','{"retentionDays":365,"archiveAfterDays":90,"storage":"s3-cold"}','2026-01-08 09:45:00','2026-01-08 09:45:00'),
  (:company,'Privileged Access Review','Quarterly review of admin and elevated role assignments','security',true,'Administrator','medium','{"cadence":"quarterly","nextReview":"2026-10-15","reviewer":"IT Administrators"}','2026-02-14 10:20:00','2026-07-15 11:50:00');

-- ---------------------------------------------------------------------------
-- it_license_users — named ERP licence assignments
-- ---------------------------------------------------------------------------
DELETE FROM it_license_users WHERE "companyId" = :company;
INSERT INTO it_license_users
  ("companyId", name, email, role, department, "licenseType", status, "assignedDate", "lastActive", "validUntil", "createdAt", "updatedAt")
VALUES
  (:company,'Rajesh Kumar','rajesh.kumar@manufacturingos.com','System Administrator','IT','Named','active','2025-10-01','2026-09-10','2026-12-31','2025-10-01 09:00:00','2026-09-10 08:15:00'),
  (:company,'Priya Sharma','priya.sharma@manufacturingos.com','Finance Manager','Finance','Named','active','2025-10-03','2026-09-09','2026-12-31','2025-10-03 10:00:00','2026-09-09 17:40:00'),
  (:company,'Anita Desai','anita.desai@manufacturingos.com','HR Manager','Human Resources','Named','active','2025-10-03','2026-09-10','2026-12-31','2025-10-03 10:05:00','2026-09-10 09:05:00'),
  (:company,'Vikram Singh','vikram.singh@manufacturingos.com','Production Supervisor','Production','Named','active','2025-10-10','2026-09-08','2026-12-31','2025-10-10 08:30:00','2026-09-08 18:20:00'),
  (:company,'Suresh Patel','suresh.patel@manufacturingos.com','Procurement Lead','Procurement','Named','active','2025-10-15','2026-09-05','2026-12-31','2025-10-15 11:00:00','2026-09-05 16:10:00'),
  (:company,'Meera Nair','meera.nair@manufacturingos.com','Quality Engineer','Quality','Named','active','2025-11-01','2026-09-04','2026-12-31','2025-11-01 09:20:00','2026-09-04 12:35:00'),
  (:company,'Amit Verma','amit.verma@manufacturingos.com','Sales Executive','Sales','Named','active','2025-11-12','2026-09-09','2026-12-31','2025-11-12 10:45:00','2026-09-09 15:55:00'),
  (:company,'Kiran Reddy','kiran.reddy@manufacturingos.com','CRM Coordinator','Sales','Concurrent','active','2025-12-02','2026-08-28','2026-12-31','2025-12-02 09:10:00','2026-08-28 11:25:00'),
  (:company,'Deepak Joshi','deepak.joshi@manufacturingos.com','IT Support Analyst','IT','Named','active','2026-01-05','2026-09-10','2026-12-31','2026-01-05 08:50:00','2026-09-10 10:00:00'),
  (:company,'Ravi Menon','ravi.menon@manufacturingos.com','Warehouse In-Charge','Warehouse','Concurrent','suspended','2026-02-10','2026-07-19','2026-12-31','2026-02-10 09:30:00','2026-07-20 09:00:00');

-- ---------------------------------------------------------------------------
-- it_monitored_servers — ERP deployment topology
-- ---------------------------------------------------------------------------
DELETE FROM it_monitored_servers WHERE "companyId" = :company;
INSERT INTO it_monitored_servers
  ("companyId", name, host, role, status, "cpuPct", "memPct", "diskPct", "networkPct", uptime, location, "lastRestartAt", "lastCheckAt", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-APP-01','app01.b3macbis.internal','Application Server','Healthy',42.5,61.3,48.0,22.7,'184 days','Mumbai DC-1','2026-03-10 02:15:00','2026-09-10 07:55:00','2025-10-01 08:00:00','2026-09-10 07:55:00'),
  (:company,'DEMO-DB-01','db01.b3macbis.internal','Database Server','Warning',68.9,82.4,71.5,18.2,'251 days','Mumbai DC-1','2026-01-02 03:00:00','2026-09-10 07:55:00','2025-10-01 08:05:00','2026-09-10 07:55:00'),
  (:company,'DEMO-CACHE-01','redis01.b3macbis.internal','Cache Server','Healthy',12.1,44.6,21.0,9.4,'97 days','Mumbai DC-1','2026-06-05 01:30:00','2026-09-10 07:56:00','2025-10-01 08:10:00','2026-09-10 07:56:00'),
  (:company,'DEMO-MQ-01','rabbitmq01.b3macbis.internal','Message Queue','Healthy',18.7,52.9,33.2,27.8,'97 days','Mumbai DC-1','2026-06-05 01:35:00','2026-09-10 07:56:00','2025-10-01 08:15:00','2026-09-10 07:56:00'),
  (:company,'DEMO-BKP-01','backup01.b3macbis.internal','Backup Server','Healthy',6.3,28.1,86.4,4.9,'342 days','Pune DR Site','2025-10-03 04:00:00','2026-09-10 07:50:00','2025-10-01 08:20:00','2026-09-10 07:50:00'),
  (:company,'DEMO-WRK-01','worker01.b3macbis.internal','Job Worker','Critical',91.2,88.7,55.3,41.0,'12 days','Mumbai DC-1','2026-08-29 22:10:00','2026-09-10 07:57:00','2025-11-20 09:00:00','2026-09-10 07:57:00');

-- ---------------------------------------------------------------------------
-- it_notification_settings — per-category channel/priority defaults
-- ---------------------------------------------------------------------------
DELETE FROM it_notification_settings WHERE "companyId" = :company;
INSERT INTO it_notification_settings
  ("companyId", category, name, description, channels, priority, roles, "createdAt", "updatedAt")
VALUES
  (:company,'security','Security Alerts','Failed logins, lockouts and suspicious activity','["In-App","Email","SMS"]','critical','Administrator,IT Support','2025-10-02 09:00:00','2026-04-12 10:15:00'),
  (:company,'system','System Health','Server status changes and resource threshold breaches','["In-App","Email"]','high','Administrator,IT Support','2025-10-02 09:05:00','2025-10-02 09:05:00'),
  (:company,'approvals','Approval Requests','Pending purchase, quotation and leave approvals','["In-App","Email","Push"]','high','Department Manager','2025-10-06 10:30:00','2026-02-18 14:40:00'),
  (:company,'workflow','Workflow Updates','Stage transitions on orders, work orders and projects','["In-App"]','medium','All Roles','2025-10-06 10:35:00','2025-10-06 10:35:00'),
  (:company,'reports','Scheduled Reports','Daily and weekly digest report delivery','["Email"]','low','Department Manager,Finance Manager','2025-10-20 11:00:00','2026-06-01 09:20:00'),
  (:company,'inventory','Stock Alerts','Reorder level and expiry warnings','["In-App","Email"]','medium','Warehouse Operators,Procurement Team','2025-11-08 09:15:00','2025-11-08 09:15:00'),
  (:company,'hr','HR Announcements','Policy updates, holidays and payroll notifications','["In-App","Email"]','low','All Roles','2025-11-25 13:00:00','2026-01-30 10:10:00'),
  (:company,'maintenance','Maintenance Windows','Planned downtime and deployment notices','["In-App","Email","SMS"]','high','All Roles','2026-01-12 10:00:00','2026-01-12 10:00:00');

-- ---------------------------------------------------------------------------
-- it_notification_rules — event → channel routing rules
-- ---------------------------------------------------------------------------
DELETE FROM it_notification_rules WHERE "companyId" = :company;
INSERT INTO it_notification_rules
  ("companyId", name, description, event_type, channel, recipients, conditions, is_active, created_at, updated_at)
VALUES
  (:company,'Failed Login Burst','Notify IT when a user exceeds 3 failed logins in 10 minutes','security.login.failed','email','["it-admins@manufacturingos.com"]','{"threshold":3,"windowMinutes":10}',true,'2025-10-02 09:30:00','2026-03-15 11:00:00'),
  (:company,'Server Critical Status','Page IT support when any monitored server turns Critical','system.server.critical','sms','["+91-98200-11001","+91-98200-11002"]','{"statuses":["Critical"]}',true,'2025-10-02 09:35:00','2025-10-02 09:35:00'),
  (:company,'Backup Job Failure','Email IT and CFO when the nightly backup job fails','job.backup.failed','email','["it-admins@manufacturingos.com","priya.sharma@manufacturingos.com"]','{"jobName":"Nightly Database Backup"}',true,'2025-10-05 10:00:00','2025-10-05 10:00:00'),
  (:company,'High-Value PO Approval','In-app alert to finance for POs above 5 lakh','procurement.po.submitted','in-app','["Finance Team"]','{"minAmount":500000,"currency":"INR"}',true,'2025-10-22 14:20:00','2026-05-09 09:45:00'),
  (:company,'Bulk Data Export','Notify security channel on exports above 5,000 rows','data.export.bulk','webhook','["https://hooks.b3macbis.internal/security"]','{"rowThreshold":5000}',true,'2025-12-05 13:45:00','2025-12-05 13:45:00'),
  (:company,'2FA Enrollment Reminder','Weekly email nudge to staff not yet enrolled in 2FA','security.2fa.reminder','email','["All Unenrolled Users"]','{"cadence":"weekly","day":"Monday"}',true,'2026-02-01 09:00:00','2026-06-20 09:20:00'),
  (:company,'License Expiry Warning','Alert admins 30 days before licence renewals lapse','license.expiry.approaching','email','["it-admins@manufacturingos.com"]','{"daysBefore":30}',true,'2026-03-18 10:10:00','2026-03-18 10:10:00'),
  (:company,'Disk Usage Threshold','In-app warning when any server disk crosses 85%','system.disk.threshold','in-app','["IT Administrators"]','{"diskPctAbove":85}',false,'2026-04-02 11:30:00','2026-08-14 15:00:00');

-- ---------------------------------------------------------------------------
-- it_notification_preferences — per-category preferences for the admin user
-- (userId is varchar; unique on (userId, category))
-- ---------------------------------------------------------------------------
DELETE FROM it_notification_preferences WHERE "createdBy" = 'demo-seed';
INSERT INTO it_notification_preferences
  ("userId", category, enabled, "enabledChannels", frequency, "emailEnabled", "smsEnabled", "pushEnabled", "inAppEnabled",
   "quietHours", "soundEnabled", "desktopNotifications", "mobileNotifications", "createdBy", "createdAt", "updatedAt")
VALUES
  (:'admin_id','security',true,'{In-App,Email,SMS}','Realtime',true,true,true,true,'{"enabled":true,"start":"23:00","end":"06:00","timezone":"Asia/Kolkata"}',true,true,true,'demo-seed','2025-10-02 09:40:00','2026-06-20 09:30:00'),
  (:'admin_id','system',true,'{In-App,Email}','Realtime',true,false,true,true,NULL,true,true,true,'demo-seed','2025-10-02 09:41:00','2025-10-02 09:41:00'),
  (:'admin_id','approvals',true,'{In-App,Push}','Realtime',false,false,true,true,NULL,true,true,true,'demo-seed','2025-10-06 10:40:00','2026-02-18 14:45:00'),
  (:'admin_id','workflow',true,'{In-App}','Hourly',false,false,false,true,NULL,false,true,false,'demo-seed','2025-10-06 10:42:00','2025-10-06 10:42:00'),
  (:'admin_id','reports',true,'{Email}','Daily',true,false,false,false,NULL,false,false,false,'demo-seed','2025-10-20 11:10:00','2026-06-01 09:25:00'),
  (:'admin_id','hr',false,'{In-App}','Weekly',false,false,false,true,NULL,false,true,false,'demo-seed','2025-11-25 13:10:00','2026-01-30 10:15:00');

-- ---------------------------------------------------------------------------
-- it_notifications — inbox for the admin user (FK → it_users)
-- ---------------------------------------------------------------------------
DELETE FROM it_notifications WHERE "createdBy" = 'demo-seed';
INSERT INTO it_notifications
  ("userId", type, priority, status, title, message, category, module, "relatedEntityType", "relatedEntityId",
   "actionUrl", "actionLabel", channels, "sentAt", "readAt", "isRead", "isArchived", "createdBy", "createdAt", "updatedAt")
VALUES
  (:'admin_id','Alert','Urgent','Unread','Worker node DEMO-WRK-01 critical','CPU at 91% and memory at 89% on worker01 for over 15 minutes.','system','it-admin','monitored_server','DEMO-WRK-01','/it-admin/monitoring','View Server','{In-App,Email,SMS}','2026-09-10 07:58:00',NULL,false,false,'demo-seed','2026-09-10 07:58:00','2026-09-10 07:58:00'),
  (:'admin_id','Warning','High','Unread','Repeated failed logins for vikram.singh','4 failed login attempts from 203.0.113.44 within 8 minutes.','security','it-admin','security_alert','DEMO-SA-001','/it-admin/security','Review Alert','{In-App,Email}','2026-09-09 22:41:00',NULL,false,false,'demo-seed','2026-09-09 22:41:00','2026-09-09 22:41:00'),
  (:'admin_id','Success','Medium','Read','Nightly backup completed','Database backup finished in 22m 14s; 48.2 GB archived to Pune DR.','system','it-admin','scheduled_job','DEMO-JOB-BACKUP','/it-admin/jobs','View Job','{In-App,Email}','2026-09-09 03:25:00','2026-09-09 08:05:00',true,false,'demo-seed','2026-09-09 03:25:00','2026-09-09 08:05:00'),
  (:'admin_id','Warning','High','Read','Unusual data export flagged','12,400 customer rows exported by kiran.reddy outside business hours.','security','it-admin','security_alert','DEMO-SA-004','/it-admin/security','Investigate','{In-App,Email}','2026-09-05 21:12:00','2026-09-06 09:00:00',true,false,'demo-seed','2026-09-05 21:12:00','2026-09-06 09:00:00'),
  (:'admin_id','Reminder','Medium','Unread','2FA rollout at 60% enrollment','8 of 20 staff have not enrolled. Deadline 2026-10-01.','security','it-admin','two_factor','DEMO-2FA-ROLLOUT','/it-admin/two-factor','View Enrollment','{In-App}','2026-09-08 09:00:00',NULL,false,false,'demo-seed','2026-09-08 09:00:00','2026-09-08 09:00:00'),
  (:'admin_id','Info','Low','Read','Weekly report digest sent','Finance and production weekly digests delivered to 6 recipients.','reports','it-admin','scheduled_job','DEMO-JOB-DIGEST','/it-admin/jobs','View Log','{In-App,Email}','2026-09-08 07:02:00','2026-09-08 10:15:00',true,false,'demo-seed','2026-09-08 07:02:00','2026-09-08 10:15:00'),
  (:'admin_id','Error','High','Read','Webhook delivery failing','Endpoint "Slack Ops Channel" failed 5 consecutive deliveries (HTTP 500).','system','it-admin','webhook_endpoint','DEMO-WH-SLACK','/it-admin/webhooks','Check Endpoint','{In-App,Email}','2026-08-28 14:33:00','2026-08-28 15:10:00',true,false,'demo-seed','2026-08-28 14:33:00','2026-08-28 15:10:00'),
  (:'admin_id','System','Medium','Read','Maintenance window scheduled','ERP upgrade window: 2026-09-14 01:00–03:00 IST. Users will be logged out.','maintenance','it-admin',NULL,NULL,'/it-admin/settings','Details','{In-App,Email,SMS}','2026-08-25 10:00:00','2026-08-25 11:22:00',true,false,'demo-seed','2026-08-25 10:00:00','2026-08-25 11:22:00'),
  (:'admin_id','Warning','Medium','Archived','Disk usage 86% on DEMO-BKP-01','Backup server disk crossed the 85% threshold; rotation cleaned 120 GB.','system','it-admin','monitored_server','DEMO-BKP-01','/it-admin/monitoring','View Server','{In-App}','2026-07-14 05:40:00','2026-07-14 09:12:00',true,true,'demo-seed','2026-07-14 05:40:00','2026-07-15 09:00:00'),
  (:'admin_id','Info','Low','Archived','New licence assigned','Named licence assigned to Deepak Joshi (IT Support Analyst).','system','it-admin','license_user','EMP0009','/it-admin/licenses','View Licenses','{In-App}','2026-01-05 09:00:00','2026-01-05 09:30:00',true,true,'demo-seed','2026-01-05 09:00:00','2026-01-06 08:00:00'),
  (:'admin_id','Success','Low','Read','Session purge completed','214 expired sessions purged by the daily cleanup job.','system','it-admin','scheduled_job','DEMO-JOB-CLEANUP','/it-admin/jobs','View Job','{In-App}','2026-09-07 02:05:00','2026-09-07 08:45:00',true,false,'demo-seed','2026-09-07 02:05:00','2026-09-07 08:45:00'),
  (:'admin_id','Reminder','High','Unread','Quarterly privileged access review due','Q3 review of Administrator and elevated roles due by 2026-10-15.','security','it-admin','security_policy','DEMO-POL-PAR','/it-admin/security','Start Review','{In-App,Email}','2026-09-01 09:00:00',NULL,false,false,'demo-seed','2026-09-01 09:00:00','2026-09-01 09:00:00');

-- ---------------------------------------------------------------------------
-- it_password_history — change trail for the admin user (FK → it_users)
-- ---------------------------------------------------------------------------
DELETE FROM it_password_history WHERE metadata->>'seed' = 'demo';
INSERT INTO it_password_history
  ("userId", "passwordHash", "changeReason", "changedByIp", "changedBy", "isTemporary", metadata, "createdAt")
VALUES
  (:'admin_id','$2b$10$DEMOxxhash0000000000000000000000000000000000000001','First Login','10.20.1.15','admin',false,'{"seed":"demo","device":"Chrome / macOS"}','2025-10-01 09:12:00'),
  (:'admin_id','$2b$10$DEMOxxhash0000000000000000000000000000000000000002','User Initiated','10.20.1.15','admin',false,'{"seed":"demo","device":"Chrome / macOS"}','2026-01-04 10:05:00'),
  (:'admin_id','$2b$10$DEMOxxhash0000000000000000000000000000000000000003','Password Expired','10.20.1.22','admin',false,'{"seed":"demo","device":"Edge / Windows"}','2026-04-06 08:47:00'),
  (:'admin_id','$2b$10$DEMOxxhash0000000000000000000000000000000000000004','Security Policy','10.20.1.15','admin',false,'{"seed":"demo","device":"Chrome / macOS","policy":"Password Complexity"}','2026-07-07 09:30:00');

-- ---------------------------------------------------------------------------
-- it_scheduled_jobs
-- ---------------------------------------------------------------------------
DELETE FROM it_scheduled_jobs WHERE "companyId" = :company;
INSERT INTO it_scheduled_jobs
  ("companyId", name, description, type, schedule, "cronExpression", status, "lastRun", "lastRunStatus", "nextRun",
   duration, "successRate", "totalRuns", "failedRuns", enabled, priority, "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'Nightly Database Backup','Full pg_dump of ERP database shipped to Pune DR site','Backup','Daily at 03:00','0 3 * * *','Active','2026-09-10 03:00','Success','2026-09-11 03:00','22m 14s',99.1,344,3,true,'Critical','admin','2025-10-01 09:30:00','2026-09-10 03:25:00'),
  (:company,'Weekly Report Digest','Compile and email finance and production weekly digests','Report','Mondays at 07:00','0 7 * * 1','Active','2026-09-08 07:00','Success','2026-09-15 07:00','4m 02s',100.0,49,0,true,'Medium','admin','2025-10-06 10:00:00','2026-09-08 07:05:00'),
  (:company,'Session & Temp Cleanup','Purge expired sessions, temp uploads and stale locks','Maintenance','Daily at 02:00','0 2 * * *','Active','2026-09-10 02:00','Success','2026-09-11 02:00','3m 41s',98.5,344,5,true,'Low','admin','2025-10-01 09:35:00','2026-09-10 02:04:00'),
  (:company,'License Usage Sync','Reconcile named/concurrent licence usage against assignments','Sync','Daily at 06:30','30 6 * * *','Active','2026-09-10 06:30','Success','2026-09-11 06:30','1m 12s',97.8,270,6,true,'Medium','admin','2025-12-14 11:00:00','2026-09-10 06:31:00'),
  (:company,'Server Health Poll','Poll monitored servers and record CPU/mem/disk metrics','Monitoring','Every 5 minutes','*/5 * * * *','Active','2026-09-10 07:55','Success','2026-09-10 08:00','8s',99.7,96480,290,true,'High','admin','2025-10-01 09:40:00','2026-09-10 07:55:10'),
  (:company,'Invoice Payment Reminders','Email customers with invoices overdue by 7+ days','Notification','Weekdays at 09:00','0 9 * * 1-5','Active','2026-09-10 09:00','Success','2026-09-11 09:00','2m 30s',96.4,246,9,true,'Medium','admin','2025-11-03 10:15:00','2026-09-10 09:03:00'),
  (:company,'Search Index Maintenance','Rebuild product and document search indexes','Maintenance','Sundays at 04:00','0 4 * * 0','Active','2026-09-07 04:00','Failed','2026-09-14 04:00','18m 55s',93.9,49,3,true,'Low','admin','2025-10-19 14:00:00','2026-09-07 04:19:00'),
  (:company,'Audit Log Archival','Move audit logs older than 90 days to cold storage','Archival','1st of month at 05:00','0 5 1 * *','Paused','2026-09-01 05:00','Success','2026-10-01 05:00','11m 08s',100.0,11,0,false,'Low','admin','2026-01-08 10:00:00','2026-09-02 09:00:00');

-- ---------------------------------------------------------------------------
-- it_security_alerts
-- ---------------------------------------------------------------------------
DELETE FROM it_security_alerts WHERE "companyId" = :company;
INSERT INTO it_security_alerts
  ("companyId", type, severity, title, description, timestamp, source, "ipAddress", "userId", "userName", status, "actionTaken", "assignedTo", "createdAt", "updatedAt")
VALUES
  (:company,'failed_login','high','Repeated failed logins for vikram.singh','4 failed login attempts within 8 minutes from an external IP.','2026-09-09 22:40','auth-service','203.0.113.44','EMP0004','Vikram Singh','investigating',NULL,'Deepak Joshi','2026-09-09 22:41:00','2026-09-10 08:10:00'),
  (:company,'data_export','medium','Unusual after-hours bulk export','12,400 customer rows exported at 21:08 IST, outside business hours.','2026-09-05 21:08','audit-service','10.20.3.61','EMP0008','Kiran Reddy','investigating','User contacted; export justification requested','Rajesh Kumar','2026-09-05 21:12:00','2026-09-08 11:30:00'),
  (:company,'account_lockout','medium','Account locked: suresh.patel','Account locked after 5 consecutive failed attempts.','2026-08-21 10:22','auth-service','10.20.2.34','EMP0005','Suresh Patel','resolved','Password reset issued after identity verification','Deepak Joshi','2026-08-21 10:23:00','2026-08-21 11:05:00'),
  (:company,'new_device','low','New device sign-in for priya.sharma','First sign-in from a new Windows device in Pune.','2026-08-11 09:14','auth-service','10.30.1.88','EMP0002','Priya Sharma','resolved','Confirmed by user as company laptop','Deepak Joshi','2026-08-11 09:15:00','2026-08-11 12:40:00'),
  (:company,'suspicious_activity','critical','Login attempt from blocked geography','Sign-in attempt for admin account from an IP geolocated outside allowed regions.','2026-07-30 03:47','firewall','198.51.100.23','26c8cce0-f215-4ebc-b887-db7d48547802','admin','resolved','IP blocked at perimeter; credentials rotated','Rajesh Kumar','2026-07-30 03:48:00','2026-07-30 10:20:00'),
  (:company,'privilege_change','medium','Role elevation for deepak.joshi','User granted IT Support role with user-management permissions.','2026-01-05 09:05','iam-service','10.20.1.15','EMP0009','Deepak Joshi','resolved','Approved change request CHG-2026-0009','Rajesh Kumar','2026-01-05 09:06:00','2026-01-05 15:00:00'),
  (:company,'failed_login','low','Single failed login for meera.nair','One failed attempt followed by successful login.','2026-06-17 08:59','auth-service','10.20.2.71','EMP0006','Meera Nair','dismissed','Typo confirmed; no action needed','Deepak Joshi','2026-06-17 09:00:00','2026-06-17 09:30:00'),
  (:company,'policy_violation','high','Password shared via support ticket','Plaintext password detected in support ticket body; scrubbed automatically.','2026-05-22 14:37','dlp-scanner','10.20.3.12','EMP0011','Sunita Rao','resolved','Password force-reset; user re-briefed on policy','Rajesh Kumar','2026-05-22 14:38:00','2026-05-23 09:10:00');

-- ---------------------------------------------------------------------------
-- it_two_factor_enrollments — rollout in progress (userId is varchar; using employee codes)
-- ---------------------------------------------------------------------------
DELETE FROM it_two_factor_enrollments WHERE "companyId" = :company;
INSERT INTO it_two_factor_enrollments
  ("companyId", "userId", "userName", "userEmail", department, role, method, enrolled, "backupCodes", "lastVerifiedAt", "lastReminderAt", "createdAt", "updatedAt")
VALUES
  (:company,'EMP0001','Rajesh Kumar','rajesh.kumar@manufacturingos.com','IT','System Administrator','Authenticator App',true,'{"remaining":8,"generatedAt":"2025-11-12"}','2026-09-10 08:02:00',NULL,'2025-11-12 09:00:00','2026-09-10 08:02:00'),
  (:company,'EMP0009','Deepak Joshi','deepak.joshi@manufacturingos.com','IT','IT Support Analyst','Authenticator App',true,'{"remaining":10,"generatedAt":"2026-01-06"}','2026-09-10 09:15:00',NULL,'2026-01-06 10:00:00','2026-09-10 09:15:00'),
  (:company,'EMP0002','Priya Sharma','priya.sharma@manufacturingos.com','Finance','Finance Manager','Authenticator App',true,'{"remaining":9,"generatedAt":"2026-02-03"}','2026-09-09 17:38:00',NULL,'2026-02-03 11:20:00','2026-09-09 17:38:00'),
  (:company,'EMP0003','Anita Desai','anita.desai@manufacturingos.com','Human Resources','HR Manager','SMS',true,'{"remaining":10,"generatedAt":"2026-02-10"}','2026-09-10 09:04:00',NULL,'2026-02-10 09:45:00','2026-09-10 09:04:00'),
  (:company,'EMP0007','Amit Verma','amit.verma@manufacturingos.com','Sales','Sales Executive','SMS',true,'{"remaining":7,"generatedAt":"2026-03-14"}','2026-09-09 15:50:00',NULL,'2026-03-14 10:30:00','2026-09-09 15:50:00'),
  (:company,'EMP0011','Sunita Rao','sunita.rao@manufacturingos.com','Finance','Accounts Executive','Email',true,'{"remaining":10,"generatedAt":"2026-05-24"}','2026-09-08 12:20:00',NULL,'2026-05-24 09:00:00','2026-09-08 12:20:00'),
  (:company,'EMP0004','Vikram Singh','vikram.singh@manufacturingos.com','Production','Production Supervisor','Not Set',false,NULL,NULL,'2026-09-08 09:00:00','2026-02-01 09:00:00','2026-09-08 09:00:00'),
  (:company,'EMP0005','Suresh Patel','suresh.patel@manufacturingos.com','Procurement','Procurement Lead','Not Set',false,NULL,NULL,'2026-09-08 09:00:00','2026-02-01 09:00:00','2026-09-08 09:00:00'),
  (:company,'EMP0006','Meera Nair','meera.nair@manufacturingos.com','Quality','Quality Engineer','Not Set',false,NULL,NULL,'2026-09-08 09:00:00','2026-02-01 09:00:00','2026-09-08 09:00:00'),
  (:company,'EMP0008','Kiran Reddy','kiran.reddy@manufacturingos.com','Sales','CRM Coordinator','Not Set',false,NULL,NULL,'2026-09-08 09:00:00','2026-02-01 09:00:00','2026-09-08 09:00:00'),
  (:company,'EMP0010','Ravi Menon','ravi.menon@manufacturingos.com','Warehouse','Warehouse In-Charge','Not Set',false,NULL,NULL,'2026-09-08 09:00:00','2026-02-01 09:00:00','2026-09-08 09:00:00');

-- ---------------------------------------------------------------------------
-- it_two_factor_settings — company-level 2FA configuration (singleton)
-- ---------------------------------------------------------------------------
DELETE FROM it_two_factor_settings WHERE "companyId" = :company;
INSERT INTO it_two_factor_settings
  ("companyId", enabled, required, "allowedMethods", "gracePeriodDays", config, "createdAt", "updatedAt")
VALUES
  (:company,true,false,'["Authenticator App","SMS","Email"]',30,'{"enforcementDeadline":"2026-10-01","requiredRoles":["Administrator"],"reminderCadence":"weekly","backupCodeCount":10}','2025-11-10 11:05:00','2026-06-20 09:18:00');

-- ---------------------------------------------------------------------------
-- it_webhook_endpoints
-- ---------------------------------------------------------------------------
DELETE FROM it_webhook_endpoints WHERE "companyId" = :company;
INSERT INTO it_webhook_endpoints
  ("companyId", name, url, events, status, secret, "lastTriggered", "successCount", "failureCount", "createdAt", "updatedAt")
VALUES
  (:company,'Slack Ops Channel','https://hooks.slack.com/services/T00B3/DEMO/ops','system.server.critical,job.backup.failed','failing','whsec_DEMO_slack_ops_001','2026-08-28 14:33',412,15,'2025-10-03 10:00:00','2026-08-28 14:35:00'),
  (:company,'Security SIEM Feed','https://hooks.b3macbis.internal/security','security.login.failed,security.alert.created,data.export.bulk','active','whsec_DEMO_siem_002','2026-09-09 22:41',1874,6,'2025-10-02 09:50:00','2026-09-09 22:41:30'),
  (:company,'Finance ERP Bridge','https://finance-bridge.b3macbis.internal/webhooks/erp','finance.invoice.created,finance.payment.received','active','whsec_DEMO_finbridge_003','2026-09-10 09:02',3260,22,'2025-11-05 11:30:00','2026-09-10 09:02:15'),
  (:company,'Customer Portal Sync','https://portal.b3macbis.com/api/webhooks/orders','sales.order.confirmed,logistics.dispatch.created','active','whsec_DEMO_portal_004','2026-09-09 16:44',982,4,'2026-01-20 10:00:00','2026-09-09 16:44:20'),
  (:company,'MS Teams IT Alerts','https://outlook.office.com/webhook/DEMO-teams-it','system.disk.threshold,license.expiry.approaching','paused','whsec_DEMO_teams_005','2026-07-14 05:41',156,2,'2026-02-12 09:20:00','2026-08-14 15:05:00'),
  (:company,'Uptime Status Page','https://status.b3macbis.com/api/ingest','system.server.critical,system.server.recovered','active','whsec_DEMO_status_006','2026-09-10 07:57',5241,11,'2026-03-01 08:00:00','2026-09-10 07:57:40');

-- ---------------------------------------------------------------------------
-- user_preferences — UI preferences (FK → it_users, UNIQUE(userId): only the
-- single seeded admin user exists, so exactly one row is possible)
-- ---------------------------------------------------------------------------
DELETE FROM user_preferences WHERE "userId" = :'admin_id';
INSERT INTO user_preferences
  ("userId", theme, density, "sidebarOpen", "createdAt", "updatedAt")
VALUES
  (:'admin_id','dark','compact',true,'2025-10-01 09:20:00','2026-08-02 19:45:00');
