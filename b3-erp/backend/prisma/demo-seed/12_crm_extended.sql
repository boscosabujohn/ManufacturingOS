-- Demo seed — CRM extended (campaigns, activities, tasks, contracts, teams, config) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first, then re-inserts.
-- Delete predicates:
--   * Tables with "companyId": scoped DELETE on :company (these tables are empty outside demo data).
--   * crm_activity_likes (no companyId): deleted via activityId of this company's activity records.
--   * crm_sales_territories (no companyId): deleted by DEMO- name prefix.
\set company '''b3000000-0000-4000-8000-000000000001'''

-- ============================================================
-- Campaigns (before email campaigns / automations that reference them by name)
-- ============================================================
DELETE FROM crm_campaigns WHERE "companyId" = :company;
INSERT INTO crm_campaigns
  ("companyId", name, type, status, description, "startDate", "endDate", "targetAudience",
   budget, spent, metrics, goals, owner, tags, "createdAt", "updatedAt")
VALUES
  (:company,'NAFEM Trade Show 2026','event','active','Booth + demo kitchen at NAFEM Show, Orlando. Live combi-oven and blast-chiller demos.','2026-02-10','2026-02-13','{"segments":["Enterprise","Mid-Market"],"industries":["Hospitality","Catering"]}',85000,64200,'{"leadsGenerated":74,"meetingsBooked":31,"opportunities":12}','{"leadsTarget":80,"pipelineTarget":1200000}','Sarah Mitchell','trade-show,events,q1','2025-11-04 09:00:00','2026-02-14 17:30:00'),
  (:company,'Combi Oven Launch Email Nurture','email','active','Six-touch nurture introducing the new C-Line combi oven range to existing customers and warm leads.','2025-11-01','2026-01-31','{"lists":["Hospitality Decision Makers","Past Combi Buyers"]}',12000,9800,'{"emailsSent":4260,"opens":1918,"clicks":512,"leadsGenerated":38}','{"leadsTarget":40,"openRateTarget":40}','David Williams','email,nurture,product-launch','2025-10-20 10:15:00','2026-02-01 09:00:00'),
  (:company,'Healthcare Kitchens Webinar Series','webinar','completed','Three-part webinar on HACCP-compliant hospital kitchen design and equipment selection.','2025-10-14','2025-12-09','{"industries":["Healthcare","Education"]}',18000,16450,'{"registrations":412,"attendees":268,"leadsGenerated":52,"opportunities":9}','{"registrationsTarget":400,"leadsTarget":50}','Sarah Mitchell','webinar,healthcare,haccp','2025-09-28 08:30:00','2025-12-12 14:00:00'),
  (:company,'Franchise Expansion Direct Outreach','outbound','active','Targeted calling and LinkedIn outreach to franchise groups opening 3+ locations in 2026.','2026-01-05','2026-06-30','{"segments":["Franchise"],"minLocations":3}',22000,11300,'{"callsMade":640,"connects":187,"leadsGenerated":29,"meetingsBooked":22}','{"meetingsTarget":40}','David Williams','outbound,franchise','2025-12-15 11:00:00','2026-06-02 16:20:00'),
  (:company,'Spring Refresh Promo 2026','promotion','completed','Seasonal trade-in promotion: 12% off refrigeration lines with old-unit haul-away.','2026-03-01','2026-04-30','{"segments":["SMB","Mid-Market"]}',30000,28900,'{"quotesIssued":91,"ordersWon":34,"revenue":486000}','{"revenueTarget":450000}','Sarah Mitchell','promo,refrigeration,trade-in','2026-02-10 09:45:00','2026-05-05 10:00:00'),
  (:company,'Cruise & Marine Galley ABM','abm','active','Account-based campaign targeting five cruise and marine catering operators for full galley fitouts.','2026-04-01','2026-09-30','{"accounts":["Meridian Cruise Lines","Silverline Cruises"]}',45000,19750,'{"accountsEngaged":4,"executiveMeetings":7,"opportunities":3}','{"pipelineTarget":2000000}','Sarah Mitchell','abm,marine,galley','2026-03-12 13:30:00','2026-08-28 15:10:00'),
  (:company,'Customer Care Win-Back Q3','email','scheduled','Win-back sequence to accounts with no orders in 12 months; service-plan bundle offer.','2026-09-15','2026-10-31','{"criteria":"noOrdersMonths>=12"}',8000,0,'{}','{"reactivationsTarget":15}','David Williams','win-back,email,q3','2026-08-20 10:00:00','2026-08-20 10:00:00'),
  (:company,'Hospitality Expo Regional Roadshow','event','planning','Four-city roadshow (Chicago, Denver, Miami, Seattle) with mobile demo kitchen trailer.','2026-10-05','2026-11-20','{"regions":["Central","West","East"]}',60000,4500,'{}','{"leadsTarget":120}','Sarah Mitchell','roadshow,events,q4','2026-07-30 09:00:00','2026-09-01 12:00:00');

-- ============================================================
-- Campaign templates
-- ============================================================
DELETE FROM crm_campaign_templates WHERE "companyId" = :company;
INSERT INTO crm_campaign_templates
  ("companyId", name, category, description, subject, "previewText", "usageCount", "lastUsed",
   "isFavorite", tags, "contentPreview", "createdAt", "updatedAt")
VALUES
  (:company,'Trade Show Follow-Up','follow-up','Three-email sequence for booth visitors: thanks, demo recap, meeting ask.','Great meeting you at {{event_name}}','Your combi-oven demo recap inside',14,'2026-02-16',true,'trade-show,follow-up','Hi {{first_name}}, thanks for stopping by our booth...','2025-10-05 09:00:00','2026-02-16 11:00:00'),
  (:company,'Product Launch Announcement','promotional','Hero-image announcement template for new equipment lines.','Introducing the new {{product_line}}','Faster, smarter, 18% more efficient',9,'2025-11-01',true,'launch,promotional','The all-new {{product_line}} is here. Built for high-volume kitchens...','2025-10-08 10:30:00','2025-11-01 08:00:00'),
  (:company,'Webinar Invitation','event','Registration-driving invite with speaker bios and agenda block.','You are invited: {{webinar_title}}','Reserve your seat — limited capacity',11,'2025-11-20',false,'webinar,invite','Join our specialists for a live session on {{topic}}...','2025-10-02 14:00:00','2025-11-20 09:15:00'),
  (:company,'Quote Follow-Up Reminder','follow-up','Gentle nudge template sent 7 days after quotation issue.','Your B3 MACBIS quotation {{quote_number}}','Questions on your quote? We can help',22,'2026-08-14',true,'quote,follow-up','Hi {{first_name}}, just checking in on quotation {{quote_number}}...','2025-10-12 11:00:00','2026-08-14 10:40:00'),
  (:company,'Seasonal Promotion','promotional','Discount-forward template with countdown banner for seasonal offers.','{{discount}}% off ends {{end_date}}','Trade in your old units and save',7,'2026-03-03',false,'promo,seasonal','Spring refresh: save {{discount}}% on refrigeration lines...','2026-01-15 09:30:00','2026-03-03 08:00:00'),
  (:company,'Win-Back Reactivation','re-engagement','Sequence for dormant accounts: check-in, value recap, service-plan offer.','We miss you at {{company_name}}','A service-plan offer for your kitchens',3,'2026-08-22',false,'win-back,re-engagement','It has been a while since your last order...','2026-06-10 15:00:00','2026-08-22 09:00:00');

-- ============================================================
-- Campaign automations
-- ============================================================
DELETE FROM crm_campaign_automations WHERE "companyId" = :company;
INSERT INTO crm_campaign_automations
  ("companyId", name, description, status, "trigger", "triggerType", steps, "activeContacts",
   "completedContacts", "conversionRate", "avgCompletionTime", "createdDate", "lastTriggered",
   owner, "createdAt", "updatedAt")
VALUES
  (:company,'New Lead Welcome Sequence','Welcome email + rep intro + product catalogue, triggered on lead creation.','active','Lead created','event',4,86,342,12.40,'6 days','2025-10-15','2026-09-08','David Williams','2025-10-15 09:00:00','2026-09-08 07:45:00'),
  (:company,'Trade Show Booth Scan Follow-Up','Auto-enrolls badge scans from events into a 3-touch follow-up with rep hand-off.','active','Badge scanned at event','event',3,41,197,18.75,'4 days','2025-11-04','2026-02-14','Sarah Mitchell','2025-11-04 10:00:00','2026-02-14 18:00:00'),
  (:company,'Quote Aging Escalation','Notifies rep and sends customer nudge when a quotation is unactioned for 7 days.','active','Quote age > 7 days','schedule',2,23,164,31.10,'9 days','2025-12-01','2026-09-09','Sarah Mitchell','2025-12-01 08:30:00','2026-09-09 06:00:00'),
  (:company,'Webinar No-Show Re-Invite','Sends recording link and re-invite to registrants who missed the live session.','paused','Webinar attendance = no-show','event',2,0,118,9.30,'3 days','2025-10-20','2025-12-10','David Williams','2025-10-20 13:00:00','2025-12-10 16:30:00'),
  (:company,'Contract Renewal 90-Day Countdown','Kicks off renewal outreach 90 days before contract end date.','draft','Contract end date - 90 days','schedule',5,0,0,0.00,NULL,'2026-08-18',NULL,'Sarah Mitchell','2026-08-18 11:20:00','2026-08-18 11:20:00');

-- ============================================================
-- Email templates (before email campaigns that reference them by name)
-- ============================================================
DELETE FROM crm_email_templates WHERE "companyId" = :company;
INSERT INTO crm_email_templates
  ("companyId", name, subject, category, description, "previewText", content, status, tags,
   "usageCount", "lastUsed", "createdBy", "openRate", "clickRate", "conversionRate", "createdAt", "updatedAt")
VALUES
  (:company,'C-Line Combi Intro','Meet the C-Line: combi cooking, reinvented','product','Launch email for the C-Line combi oven range.','18% faster preheat, 22% less energy','<p>Hi {{first_name}},</p><p>The new C-Line combi oven range is engineered for high-volume kitchens...</p>','active','launch,combi',6,'2025-12-02','David Williams',44.20,11.80,3.10,'2025-10-18 09:00:00','2025-12-02 08:00:00'),
  (:company,'Quotation Follow-Up 7-Day','Checking in on quotation {{quote_number}}','follow-up','Standard 7-day quote follow-up used by the aging automation.','Any questions on your quote?','<p>Hi {{first_name}},</p><p>Just following up on quotation {{quote_number}} we sent last week...</p>','active','quote,follow-up',48,'2026-09-05','Sarah Mitchell',52.60,17.40,8.90,'2025-10-10 10:00:00','2026-09-05 09:30:00'),
  (:company,'Webinar Recording Share','Recording: {{webinar_title}}','event','Post-webinar recording share with CTA to book a consultation.','Watch the session you missed','<p>Hi {{first_name}},</p><p>Here is the recording of {{webinar_title}} plus the slide deck...</p>','active','webinar,recording',12,'2025-12-11','David Williams',61.30,24.50,5.70,'2025-10-25 14:00:00','2025-12-11 10:00:00'),
  (:company,'Spring Promo Blast','Save 12% on refrigeration — ends April 30','promotional','Main promotional blast for the Spring Refresh trade-in offer.','Trade in and save on refrigeration','<p>Spring refresh time: save 12% on our refrigeration lines when you trade in old units...</p>','archived','promo,refrigeration',3,'2026-04-02','Sarah Mitchell',38.90,9.60,4.20,'2026-02-20 09:00:00','2026-05-01 09:00:00'),
  (:company,'Service Plan Win-Back','A service plan built for {{company_name}}','re-engagement','Win-back offer bundling preventive maintenance with priority support.','Keep every kitchen running','<p>Hi {{first_name}},</p><p>It has been a while — here is a service plan tailored to your sites...</p>','active','win-back,service',1,'2026-08-25','David Williams',29.40,6.10,2.00,'2026-06-15 11:00:00','2026-08-25 09:00:00'),
  (:company,'NAFEM Meeting Booker','Book your NAFEM 2026 demo slot','event','Pre-show email driving booth demo bookings for NAFEM 2026.','Live demos every hour, booth #2214','<p>We are bringing a full demo kitchen to NAFEM 2026. Book your slot...</p>','active','trade-show,nafem',5,'2026-02-02','Sarah Mitchell',47.80,19.20,7.40,'2025-12-20 10:00:00','2026-02-02 08:30:00');

-- ============================================================
-- Email campaigns
-- ============================================================
DELETE FROM crm_email_campaigns WHERE "companyId" = :company;
INSERT INTO crm_email_campaigns
  ("companyId", name, subject, status, audience, sent, delivered, opened, clicked, bounced,
   unsubscribed, "scheduledDate", "sentDate", template, "from", "createdAt", "updatedAt")
VALUES
  (:company,'C-Line Launch — Wave 1','Meet the C-Line: combi cooking, reinvented','sent',1850,1850,1804,798,212,46,9,'2025-11-03','2025-11-03','C-Line Combi Intro','marketing@b3macbis.com','2025-10-28 09:00:00','2025-11-04 08:00:00'),
  (:company,'C-Line Launch — Wave 2 (non-openers)','Still cooking the old way?','sent',1006,1006,988,402,96,18,4,'2025-11-17','2025-11-17','C-Line Combi Intro','marketing@b3macbis.com','2025-11-12 10:00:00','2025-11-18 08:00:00'),
  (:company,'Healthcare Webinar Invite — Part 3','You are invited: HACCP Kitchen Design, Part 3','sent',720,720,703,431,168,17,3,'2025-11-25','2025-11-25','Webinar Recording Share','events@b3macbis.com','2025-11-19 14:00:00','2025-11-26 09:00:00'),
  (:company,'NAFEM 2026 Demo Bookings','Book your NAFEM 2026 demo slot','sent',1420,1420,1391,665,273,29,6,'2026-01-27','2026-01-27','NAFEM Meeting Booker','events@b3macbis.com','2026-01-20 09:30:00','2026-01-28 08:00:00'),
  (:company,'Spring Refresh Promo Blast','Save 12% on refrigeration — ends April 30','sent',2210,2210,2144,834,206,66,14,'2026-03-04','2026-03-04','Spring Promo Blast','marketing@b3macbis.com','2026-02-26 09:00:00','2026-03-05 08:00:00'),
  (:company,'Q3 Win-Back — Wave 1','A service plan built for your kitchens','scheduled',340,0,0,0,0,0,0,'2026-09-16',NULL,'Service Plan Win-Back','care@b3macbis.com','2026-09-02 10:00:00','2026-09-02 10:00:00');

-- ============================================================
-- Contact lists
-- ============================================================
DELETE FROM crm_contact_lists WHERE "companyId" = :company;
INSERT INTO crm_contact_lists
  ("companyId", name, description, type, "contactCount", criteria, tags, owner, status,
   "isShared", "lastUsed", "createdAt", "updatedAt")
VALUES
  (:company,'Hospitality Decision Makers','F&B directors, executive chefs and GMs at hospitality accounts.','dynamic',412,'{"industry":["Hospitality"],"title":["F&B Director","Executive Chef","GM"]}','hospitality,decision-makers','Sarah Mitchell','active',true,'2026-09-01','2025-10-06 09:00:00','2026-09-01 10:00:00'),
  (:company,'Past Combi Buyers','Contacts at accounts that purchased combi ovens in the last 5 years.','static',187,NULL,'combi,customers','David Williams','active',true,'2025-11-17','2025-10-12 11:00:00','2025-11-17 09:00:00'),
  (:company,'Healthcare & Education Procurement','Procurement and facilities contacts in hospitals, schools and campuses.','dynamic',238,'{"industry":["Healthcare","Education"],"role":["Procurement","Facilities"]}','healthcare,education','Sarah Mitchell','active',false,'2025-11-25','2025-10-09 10:30:00','2025-11-25 14:00:00'),
  (:company,'NAFEM 2026 Booth Scans','Badge scans captured at NAFEM Show 2026, Orlando.','static',274,NULL,'trade-show,nafem','Sarah Mitchell','active',true,'2026-02-16','2026-02-13 18:00:00','2026-02-16 09:00:00'),
  (:company,'Dormant Accounts 12m+','Contacts at accounts with no orders in 12+ months — win-back target.','dynamic',96,'{"noOrdersMonths":{"gte":12}}','win-back,dormant','David Williams','active',false,'2026-09-02','2026-06-18 13:00:00','2026-09-02 10:00:00'),
  (:company,'Franchise Multi-Site Operators','Owners and ops heads at franchise groups with 3+ locations.','static',64,NULL,'franchise,abm','David Williams','active',false,'2026-06-02','2025-12-16 09:00:00','2026-06-02 16:00:00');

-- ============================================================
-- Contact roles
-- ============================================================
DELETE FROM crm_contact_roles WHERE "companyId" = :company;
INSERT INTO crm_contact_roles
  ("companyId", name, description, category, permissions, "contactCount", "influenceLevel",
   "isDecisionMaker", status, "createdAt", "updatedAt")
VALUES
  (:company,'Economic Buyer','Owns the budget and signs off on capital equipment purchases.','buying','view_quotes,approve_orders',54,95,true,'active','2025-10-03 09:00:00','2025-10-03 09:00:00'),
  (:company,'Executive Chef','Primary user and functional evaluator of cooking equipment.','influencer','view_quotes',88,80,false,'active','2025-10-03 09:05:00','2025-10-03 09:05:00'),
  (:company,'Facilities Manager','Owns installation, utilities and maintenance considerations.','technical','view_quotes,view_docs',61,60,false,'active','2025-10-03 09:10:00','2025-10-03 09:10:00'),
  (:company,'Procurement Lead','Runs the commercial process, negotiates terms and vendor onboarding.','buying','view_quotes,request_changes',47,75,true,'active','2025-10-03 09:15:00','2025-10-03 09:15:00'),
  (:company,'Finance Approver','Approves capex above threshold; involved late in the cycle.','approver','approve_orders',23,85,true,'active','2025-10-03 09:20:00','2025-10-03 09:20:00'),
  (:company,'Consultant / Kitchen Designer','External designer specifying equipment on new-build projects.','influencer','view_docs',19,70,false,'active','2025-10-03 09:25:00','2025-10-03 09:25:00');

-- ============================================================
-- Customer segments
-- ============================================================
DELETE FROM crm_customer_segments WHERE "companyId" = :company;
INSERT INTO crm_customer_segments
  ("companyId", name, description, criteria, "customerCount", "totalRevenue", "avgLifetimeValue",
   "growthRate", color, status, "createdAt", "updatedAt")
VALUES
  (:company,'Enterprise Hospitality','Hotel groups and restaurant chains with 10+ sites and central procurement.','{"segment":"Enterprise","industry":["Hospitality"]}',4,7445000,1861250,14.20,'blue','active','2025-10-04 09:00:00','2026-08-31 09:00:00'),
  (:company,'Healthcare & Institutional','Hospitals, campuses and institutional caterers with compliance-driven buying.','{"industry":["Healthcare","Education"]}',2,1620000,810000,9.60,'green','active','2025-10-04 09:05:00','2026-08-31 09:00:00'),
  (:company,'Growth SMB','Single and dual-site operators with expansion plans; high service-plan attach.','{"segment":"SMB"}',1,72000,72000,22.80,'orange','active','2025-10-04 09:10:00','2026-08-31 09:00:00'),
  (:company,'Franchise Operators','Multi-unit franchise groups standardising kitchen fitouts across locations.','{"industry":["Franchise"]}',1,2450000,2450000,17.50,'purple','active','2025-10-04 09:15:00','2026-08-31 09:00:00'),
  (:company,'Catering & Events','Catering companies and event venues with seasonal, project-based demand.','{"industry":["Catering","Events"]}',1,510000,510000,6.40,'teal','active','2025-10-04 09:20:00','2026-08-31 09:00:00');

-- ============================================================
-- Account relationships (references crm_customers by id)
-- ============================================================
DELETE FROM crm_account_relationships WHERE "companyId" = :company;
INSERT INTO crm_account_relationships
  ("companyId", "sourceAccountId", "targetAccountId", "targetAccountName", "relationshipType",
   bidirectional, "createdAt", "updatedAt")
VALUES
  (:company,(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' AND "companyId"=:company LIMIT 1),(SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' AND "companyId"=:company LIMIT 1),'Lakeside Resort & Spa','partner',true,'2025-10-20 09:00:00','2025-10-20 09:00:00'),
  (:company,(SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' AND "companyId"=:company LIMIT 1),(SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain' AND "companyId"=:company LIMIT 1),'Riverside Bistro Chain','competitor',false,'2025-11-02 10:00:00','2025-11-02 10:00:00'),
  (:company,(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' AND "companyId"=:company LIMIT 1),(SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' AND "companyId"=:company LIMIT 1),'Harbour Grill Restaurants','parent',false,'2025-11-15 11:30:00','2025-11-15 11:30:00'),
  (:company,(SELECT id::text FROM crm_customers WHERE "customerName"='Summit Catering Services' AND "companyId"=:company LIMIT 1),(SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' AND "companyId"=:company LIMIT 1),'Metro Hospital Kitchens','partner',true,'2026-01-12 14:00:00','2026-01-12 14:00:00'),
  (:company,(SELECT id::text FROM crm_customers WHERE "customerName"='Campus Dining Co-op' AND "companyId"=:company LIMIT 1),(SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' AND "companyId"=:company LIMIT 1),'Metro Hospital Kitchens','partner',false,'2026-03-08 09:45:00','2026-03-08 09:45:00'),
  (:company,(SELECT id::text FROM crm_customers WHERE "customerName"='Harbour Grill Restaurants' AND "companyId"=:company LIMIT 1),(SELECT id::text FROM crm_customers WHERE "customerName"='Riverside Bistro Chain' AND "companyId"=:company LIMIT 1),'Riverside Bistro Chain','competitor',true,'2026-05-22 16:00:00','2026-05-22 16:00:00');

-- ============================================================
-- Activity records (before likes; relatedTo references real lead/customer ids)
-- ============================================================
-- Delete likes first (they point at this company's activity ids).
DELETE FROM crm_activity_likes WHERE "activityId" IN
  (SELECT id::text FROM crm_activity_records WHERE "companyId" = :company);
DELETE FROM crm_activity_records WHERE "companyId" = :company;
INSERT INTO crm_activity_records
  ("companyId", type, subject, description, status, priority, "relatedTo", "relatedType",
   "contactName", "assignedTo", "dueDate", "scheduledAt", "completedAt", "durationMinutes",
   outcome, direction, location, "meetingLink", tags, like_count, "createdAt", "updatedAt")
VALUES
  (:company,'call','Discovery call — Meridian Cruise Lines galley refit','Scoped 4-vessel galley refit; budget confirmed at board level.','completed','high',(SELECT id::text FROM crm_leads WHERE company='Meridian Cruise Lines' LIMIT 1),'lead','Charles Osei','Sarah Mitchell',NULL,'2025-10-21 14:00:00','2025-10-21 14:47:00',47,'qualified','outbound',NULL,NULL,'discovery,marine',2,'2025-10-20 09:00:00','2025-10-21 15:00:00'),
  (:company,'email','C-Line spec sheet sent — Lang Hospitality','Sent C-Line combi spec sheets and ROI calculator per request.','completed','medium',(SELECT id::text FROM crm_leads WHERE company='Lang Hospitality Group' LIMIT 1),'lead','Beatrice Lang','David Williams',NULL,NULL,'2025-11-06 10:12:00',NULL,'replied','outbound',NULL,NULL,'combi,spec',1,'2025-11-06 10:00:00','2025-11-07 08:30:00'),
  (:company,'meeting','Site survey — Maison Claire Catering kitchen','Walked production kitchen; measured for dishwashing line and blast chillers.','completed','high',(SELECT id::text FROM crm_leads WHERE company=$$Maison Claire Catering$$ LIMIT 1),'lead','Andre Boucher','David Williams',NULL,'2025-11-18 10:00:00','2025-11-18 12:10:00',130,'proposal-requested',NULL,'Client site — Montreal',NULL,'site-survey',2,'2025-11-14 09:00:00','2025-11-18 13:00:00'),
  (:company,'call','Quarterly check-in — Blue Fig Hotels Group','Reviewed open service tickets and 2026 refurbishment pipeline across 6 properties.','completed','medium',(SELECT id::text FROM crm_customers WHERE "customerName"='Blue Fig Hotels Group' AND "companyId"=:company LIMIT 1),'customer','Amelia Torres','Sarah Mitchell',NULL,'2025-12-09 11:00:00','2025-12-09 11:38:00',38,'positive','outbound',NULL,NULL,'account-review',1,'2025-12-08 09:00:00','2025-12-09 12:00:00'),
  (:company,'meeting','NAFEM booth demo — Taco Verde Franchising','Live demo of ventless fryer line; strong interest for 12-store rollout.','completed','high',(SELECT id::text FROM crm_leads WHERE company='Taco Verde Franchising' LIMIT 1),'lead','Miguel Santana','Sarah Mitchell',NULL,'2026-02-11 15:00:00','2026-02-11 15:40:00',40,'demo-completed',NULL,'NAFEM Show, Orlando — Booth 2214',NULL,'nafem,demo',3,'2026-02-11 08:00:00','2026-02-11 16:00:00'),
  (:company,'email','Renewal notice — Metro Hospital Kitchens service contract','Sent 90-day renewal notice with updated preventive-maintenance schedule.','completed','medium',(SELECT id::text FROM crm_customers WHERE "customerName"='Metro Hospital Kitchens' AND "companyId"=:company LIMIT 1),'customer','Dr. Karen Ng','Sarah Mitchell',NULL,NULL,'2026-03-02 09:05:00',NULL,'acknowledged','outbound',NULL,NULL,'renewal,service',0,'2026-03-02 09:00:00','2026-03-03 08:00:00'),
  (:company,'call','Trade-in promo follow-up — Shamrock Sports Bar','Discussed spring refrigeration promo; price sensitivity high, lost to used-equipment dealer.','completed','low',(SELECT id::text FROM crm_leads WHERE company='Shamrock Sports Bar' LIMIT 1),'lead','Kevin O''Rourke','David Williams',NULL,'2026-03-19 16:00:00','2026-03-19 16:12:00',12,'lost','outbound',NULL,NULL,'promo,refrigeration',0,'2026-03-18 09:00:00','2026-03-20 08:00:00'),
  (:company,'meeting','Executive review — Golden Spoon 2026 rollout','Half-year review of franchise fitout program; 8 stores delivered, 6 scheduled.','completed','high',(SELECT id::text FROM crm_customers WHERE "customerName"='Golden Spoon Franchises' AND "companyId"=:company LIMIT 1),'customer','Priya Shah','Sarah Mitchell',NULL,'2026-06-17 13:00:00','2026-06-17 14:25:00',85,'expansion-confirmed',NULL,'Golden Spoon HQ, Phoenix','https://meet.b3macbis.com/gsf-review','qbr,franchise',2,'2026-06-10 09:00:00','2026-06-17 15:00:00'),
  (:company,'email','Webinar recording — Brookfield Senior Living','Shared HACCP webinar recording and dietary-kitchen equipment checklist.','completed','low',(SELECT id::text FROM crm_leads WHERE company='Brookfield Senior Living' LIMIT 1),'lead','Danielle Hart','David Williams',NULL,NULL,'2025-12-11 11:20:00',NULL,'opened','outbound',NULL,NULL,'webinar,healthcare',0,'2025-12-11 11:00:00','2025-12-12 09:00:00'),
  (:company,'call','Negotiation call — Ferrante''s Trattoria espresso stations','Final pricing on two espresso stations plus install; verbal commit received.','completed','high',(SELECT id::text FROM crm_leads WHERE company=$$Ferrante's Trattoria$$ LIMIT 1),'lead','Lucia Ferrante','David Williams',NULL,'2026-04-08 10:00:00','2026-04-08 10:33:00',33,'verbal-commit','outbound',NULL,NULL,'negotiation',1,'2026-04-07 09:00:00','2026-04-08 11:00:00'),
  (:company,'task','Prepare ABM deck for Silverline Cruises','Build tailored galley-fitout capability deck with marine compliance references.','in_progress','high',(SELECT id::text FROM crm_leads WHERE company='Silverline Cruises' LIMIT 1),'lead','Mia Nakamura','Sarah Mitchell','2026-09-12 17:00:00',NULL,NULL,NULL,NULL,NULL,NULL,NULL,'abm,marine',0,'2026-09-04 09:00:00','2026-09-08 10:00:00'),
  (:company,'meeting','Kick-off — Lakeside Resort spa café refresh','Scoping meeting for pool-side café equipment refresh ahead of winter season.','scheduled','medium',(SELECT id::text FROM crm_customers WHERE "customerName"='Lakeside Resort & Spa' AND "companyId"=:company LIMIT 1),'customer','Henrik Olsen','David Williams',NULL,'2026-09-18 10:00:00',NULL,NULL,NULL,NULL,'Lakeside Resort, Miami','https://meet.b3macbis.com/lakeside-kickoff','scoping',0,'2026-09-09 09:00:00','2026-09-09 09:00:00');

-- ============================================================
-- Activity likes (after activity records; unique on activityId+userId)
-- ============================================================
INSERT INTO crm_activity_likes ("activityId", "userId", "createdAt")
VALUES
  ((SELECT id::text FROM crm_activity_records WHERE subject='Discovery call — Meridian Cruise Lines galley refit' AND "companyId"=:company LIMIT 1),'user-david-williams','2025-10-21 16:00:00'),
  ((SELECT id::text FROM crm_activity_records WHERE subject='Discovery call — Meridian Cruise Lines galley refit' AND "companyId"=:company LIMIT 1),'user-priya-menon','2025-10-22 09:10:00'),
  ((SELECT id::text FROM crm_activity_records WHERE subject='NAFEM booth demo — Taco Verde Franchising' AND "companyId"=:company LIMIT 1),'user-david-williams','2026-02-11 17:00:00'),
  ((SELECT id::text FROM crm_activity_records WHERE subject='NAFEM booth demo — Taco Verde Franchising' AND "companyId"=:company LIMIT 1),'user-priya-menon','2026-02-12 08:30:00'),
  ((SELECT id::text FROM crm_activity_records WHERE subject='Executive review — Golden Spoon 2026 rollout' AND "companyId"=:company LIMIT 1),'user-david-williams','2026-06-17 16:00:00');

-- ============================================================
-- Tasks (spread across the year, tied to leads/customers via relatedTo JSON)
-- ============================================================
DELETE FROM crm_tasks WHERE "companyId" = :company;
INSERT INTO crm_tasks
  ("companyId", title, description, status, priority, "assignedToId", "assignedToName", "dueDate",
   "createdById", "createdByName", "relatedTo", tags, comments, attachments, "createdAt", "updatedAt")
VALUES
  (:company,'Send Meridian Cruise galley proposal','Compile 4-vessel refit proposal with marine-grade spec options.','done','high','user-sarah-mitchell','Sarah Mitchell','2025-10-31','user-sarah-mitchell','Sarah Mitchell','{"type":"lead","name":"Meridian Cruise Lines"}','proposal,marine',4,2,'2025-10-22 09:00:00','2025-10-30 16:00:00'),
  (:company,'Book Q4 webinar speakers','Confirm HACCP consultant and hospital dietitian for webinar part 2 and 3.','done','medium','user-david-williams','David Williams','2025-10-28','user-sarah-mitchell','Sarah Mitchell','{"type":"campaign","name":"Healthcare Kitchens Webinar Series"}','webinar',2,0,'2025-10-15 10:00:00','2025-10-27 14:00:00'),
  (:company,'Follow up Maison Claire site-survey quote','Issue quotation for dishwashing line + 2 blast chillers from survey measurements.','done','high','user-david-williams','David Williams','2025-11-25','user-david-williams','David Williams','{"type":"lead","name":"Maison Claire Catering"}','quote',3,1,'2025-11-19 09:00:00','2025-11-24 15:30:00'),
  (:company,'Reserve NAFEM booth logistics','Freight, rigging and demo kitchen utilities for booth 2214.','done','high','user-sarah-mitchell','Sarah Mitchell','2026-01-15','user-sarah-mitchell','Sarah Mitchell','{"type":"campaign","name":"NAFEM Trade Show 2026"}','events,logistics',6,3,'2025-12-02 11:00:00','2026-01-14 17:00:00'),
  (:company,'Qualify NAFEM badge scans','Score and route 274 booth scans; assign hot leads within 48h.','done','high','user-david-williams','David Williams','2026-02-18','user-sarah-mitchell','Sarah Mitchell','{"type":"list","name":"NAFEM 2026 Booth Scans"}','trade-show,leads',5,0,'2026-02-14 09:00:00','2026-02-17 18:00:00'),
  (:company,'Prepare Taco Verde 12-store rollout quote','Standardised ventless fryer package pricing across 12 locations.','done','high','user-sarah-mitchell','Sarah Mitchell','2026-03-06','user-sarah-mitchell','Sarah Mitchell','{"type":"lead","name":"Taco Verde Franchising"}','franchise,quote',7,2,'2026-02-20 09:00:00','2026-03-05 16:45:00'),
  (:company,'Metro Hospital renewal paperwork','Draft renewal contract with updated PM schedule and 3% uplift.','done','medium','user-sarah-mitchell','Sarah Mitchell','2026-04-15','user-sarah-mitchell','Sarah Mitchell','{"type":"customer","name":"Metro Hospital Kitchens"}','renewal,contract',2,1,'2026-03-03 09:00:00','2026-04-12 11:00:00'),
  (:company,'Close out Spring Refresh promo reporting','Final revenue attribution and trade-in unit disposal reconciliation.','done','low','user-david-williams','David Williams','2026-05-15','user-sarah-mitchell','Sarah Mitchell','{"type":"campaign","name":"Spring Refresh Promo 2026"}','promo,reporting',1,1,'2026-05-02 10:00:00','2026-05-14 15:00:00'),
  (:company,'Draft Silverline Cruises ABM deck','Marine compliance references, galley layouts, lifecycle costing.','in_progress','high','user-sarah-mitchell','Sarah Mitchell','2026-09-12','user-sarah-mitchell','Sarah Mitchell','{"type":"lead","name":"Silverline Cruises"}','abm,marine',3,1,'2026-09-04 09:00:00','2026-09-09 10:00:00'),
  (:company,'Plan roadshow city schedule','Lock venues and demo-trailer routing for Chicago, Denver, Miami, Seattle.','in_progress','medium','user-david-williams','David Williams','2026-09-20','user-sarah-mitchell','Sarah Mitchell','{"type":"campaign","name":"Hospitality Expo Regional Roadshow"}','roadshow,events',2,0,'2026-08-25 09:00:00','2026-09-08 12:00:00'),
  (:company,'Launch Q3 win-back wave 1','Final list scrub and send approval for 340-contact win-back blast.','todo','medium','user-david-williams','David Williams','2026-09-15','user-david-williams','David Williams','{"type":"campaign","name":"Customer Care Win-Back Q3"}','win-back,email',0,0,'2026-09-05 10:00:00','2026-09-05 10:00:00'),
  (:company,'Lakeside spa café scoping prep','Pull past order history and prepare equipment refresh options ahead of kick-off.','todo','medium','user-david-williams','David Williams','2026-09-17','user-david-williams','David Williams','{"type":"customer","name":"Lakeside Resort & Spa"}','scoping',0,0,'2026-09-09 09:30:00','2026-09-09 09:30:00');

-- ============================================================
-- Approval workflows
-- ============================================================
DELETE FROM crm_approval_workflows WHERE "companyId" = :company;
INSERT INTO crm_approval_workflows
  ("companyId", name, description, type, active, stages, conditions, "totalApprovals",
   pending, approved, rejected, "createdAt", "updatedAt")
VALUES
  (:company,'Quote Discount > 10%','Sales manager approval required for quotations discounted beyond 10%.','discount',true,'[{"order":1,"role":"Sales Manager"},{"order":2,"role":"Sales Director"}]','{"discountPercent":{"gt":10}}',64,3,55,6,'2025-10-05 09:00:00','2026-09-08 11:00:00'),
  (:company,'Enterprise Deal Review','Director + finance sign-off on opportunities above 250k.','deal',true,'[{"order":1,"role":"Sales Director"},{"order":2,"role":"Finance Controller"}]','{"dealValue":{"gte":250000}}',18,2,15,1,'2025-10-05 09:10:00','2026-09-02 14:00:00'),
  (:company,'Contract Amendment Approval','Legal review for amendments touching liability, SLA or termination clauses.','contract',true,'[{"order":1,"role":"Legal Counsel"},{"order":2,"role":"Sales Director"}]','{"clauses":["liability","sla","termination"]}',11,1,9,1,'2025-10-05 09:20:00','2026-08-20 10:00:00'),
  (:company,'Campaign Budget Release','Marketing spend above 25k requires CMO release before commit.','budget',true,'[{"order":1,"role":"CMO"}]','{"budget":{"gt":25000}}',7,1,6,0,'2025-11-10 10:00:00','2026-07-30 09:30:00'),
  (:company,'Credit Limit Increase','Finance approval chain for customer credit-limit raises.','credit',false,'[{"order":1,"role":"Finance Controller"},{"order":2,"role":"CFO"}]','{"creditIncrease":{"gt":50000}}',5,0,4,1,'2025-10-05 09:30:00','2026-04-15 12:00:00');

-- ============================================================
-- Assignment rules
-- ============================================================
DELETE FROM crm_assignment_rules WHERE "companyId" = :company;
INSERT INTO crm_assignment_rules
  ("companyId", name, description, type, active, priority, criteria, assignees, "lastRun",
   "totalAssignments", "createdAt", "updatedAt")
VALUES
  (:company,'Enterprise Accounts to Sarah','Leads with estimated value above 150k route directly to Sarah Mitchell.','criteria',true,1,'{"estimatedValue":{"gte":150000}}','["Sarah Mitchell"]','2026-09-09',41,'2025-10-06 09:00:00','2026-09-09 07:00:00'),
  (:company,'West Region Round Robin','West-region leads rotate between the two field reps.','round_robin',true,2,'{"region":"West"}','["Sarah Mitchell","David Williams"]','2026-09-08',118,'2025-10-06 09:05:00','2026-09-08 07:00:00'),
  (:company,'Healthcare Vertical to Sarah','Healthcare and institutional leads to the vertical specialist.','criteria',true,3,'{"industry":["Healthcare","Education"]}','["Sarah Mitchell"]','2026-09-05',36,'2025-10-06 09:10:00','2026-09-05 07:00:00'),
  (:company,'SMB Default to David','Leads under 50k estimated value default to David Williams.','criteria',true,4,'{"estimatedValue":{"lt":50000}}','["David Williams"]','2026-09-09',92,'2025-10-06 09:15:00','2026-09-09 07:00:00'),
  (:company,'Weekend Web Leads Queue','Weekend website leads held in queue for Monday round robin.','load_balanced',false,5,'{"source":"Website","dayOfWeek":["Sat","Sun"]}','["Sarah Mitchell","David Williams"]','2026-06-28',23,'2025-10-06 09:20:00','2026-06-28 07:00:00');

-- ============================================================
-- Pipeline stage configs
-- ============================================================
DELETE FROM crm_pipeline_stage_configs WHERE "companyId" = :company;
INSERT INTO crm_pipeline_stage_configs
  ("companyId", name, description, "pipelineType", "orderIndex", probability, color,
   "isWon", "isLost", active, "createdAt", "updatedAt")
VALUES
  (:company,'New','Untouched inbound or imported lead.','sales',1,5,'gray',false,false,true,'2025-10-02 09:00:00','2025-10-02 09:00:00'),
  (:company,'Contacted','First outreach made; awaiting qualification call.','sales',2,10,'blue',false,false,true,'2025-10-02 09:01:00','2025-10-02 09:01:00'),
  (:company,'Qualified','BANT confirmed; requirement and budget validated.','sales',3,25,'teal',false,false,true,'2025-10-02 09:02:00','2025-10-02 09:02:00'),
  (:company,'Proposal','Quotation or proposal issued and under review.','sales',4,50,'orange',false,false,true,'2025-10-02 09:03:00','2025-10-02 09:03:00'),
  (:company,'Negotiation','Commercial terms and pricing under negotiation.','sales',5,75,'purple',false,false,true,'2025-10-02 09:04:00','2025-10-02 09:04:00'),
  (:company,'Won','Order received; hand-off to production planning.','sales',6,100,'green',true,false,true,'2025-10-02 09:05:00','2025-10-02 09:05:00'),
  (:company,'Lost','Closed lost; reason captured for analysis.','sales',7,0,'red',false,true,true,'2025-10-02 09:06:00','2025-10-02 09:06:00');

-- ============================================================
-- Portal users (tied to customer accounts)
-- ============================================================
DELETE FROM crm_portal_users WHERE "companyId" = :company;
INSERT INTO crm_portal_users
  ("companyId", name, email, customer, role, status, "lastLogin", "accessLevel",
   "ticketsCreated", "documentsAccessed", permissions, "createdAt", "updatedAt")
VALUES
  (:company,'Marcus Lee','marcus@harbourgrill.com','Harbour Grill Restaurants','Operations Head','active','2026-09-08','full',7,34,'orders,invoices,tickets,documents','2025-10-10 09:00:00','2026-09-08 08:12:00'),
  (:company,'Amelia Torres','amelia@bluefighotels.com','Blue Fig Hotels Group','Procurement Director','active','2026-09-09','full',12,58,'orders,invoices,tickets,documents','2025-10-10 09:05:00','2026-09-09 10:44:00'),
  (:company,'Raj Patel','raj@campusdining.edu','Campus Dining Co-op','Facilities Manager','active','2026-08-27','standard',5,21,'orders,tickets,documents','2025-10-12 10:00:00','2026-08-27 15:03:00'),
  (:company,'Nina Alvarez','nina@summitcatering.com','Summit Catering Services','Owner','active','2026-09-02','full',3,17,'orders,invoices,tickets,documents','2025-10-15 11:00:00','2026-09-02 09:21:00'),
  (:company,'Dr. Karen Ng','karen@metrohospital.org','Metro Hospital Kitchens','Food Services Director','active','2026-09-05','standard',9,42,'orders,tickets,documents','2025-10-18 09:30:00','2026-09-05 13:37:00'),
  (:company,'Tom Becker','tom@riversidebistro.com','Riverside Bistro Chain','GM','invited','2026-08-30','view',1,4,'documents','2026-08-15 14:00:00','2026-08-30 11:00:00'),
  (:company,'Priya Shah','priya@goldenspoon.com','Golden Spoon Franchises','Expansion Lead','active','2026-09-09','full',6,61,'orders,invoices,tickets,documents','2025-11-01 10:00:00','2026-09-09 14:52:00'),
  (:company,'Henrik Olsen','henrik@lakesideresort.com','Lakeside Resort & Spa','F&B Director','inactive','2026-05-14','standard',2,12,'orders,tickets','2025-11-20 09:00:00','2026-06-01 09:00:00');

-- ============================================================
-- Pricing rules
-- ============================================================
DELETE FROM crm_pricing_rules WHERE "companyId" = :company;
INSERT INTO crm_pricing_rules
  ("companyId", name, description, "ruleType", "discountType", "discountValue", conditions,
   priority, "isActive", "applicableProducts", "applicableCustomers", "validFrom", "validUntil",
   "usageCount", "totalSavings", "createdAt", "updatedAt")
VALUES
  (:company,'Enterprise Volume Tier','8% off orders above 100k list value for enterprise accounts.','volume','percentage',8,'{"orderValue":{"gte":100000},"segment":"Enterprise"}',1,true,'["all"]','["Enterprise"]','2025-10-01','2026-12-31',27,214500,'2025-10-05 09:00:00','2026-09-01 10:00:00'),
  (:company,'Franchise Standard Fitout Bundle','Fixed bundle price on the standard franchise kitchen package.','bundle','fixed_price',86500,'{"bundle":"franchise-standard-fitout"}',2,true,'["fryer-line","prep-line","refrigeration"]','["Golden Spoon Franchises","Taco Verde Franchising"]','2025-11-01','2026-12-31',14,168000,'2025-10-28 10:00:00','2026-08-15 09:00:00'),
  (:company,'Spring Refresh Trade-In','12% off refrigeration lines with qualifying trade-in unit.','promotional','percentage',12,'{"category":"refrigeration","tradeIn":true}',3,false,'["refrigeration"]','["all"]','2026-03-01','2026-04-30',34,97200,'2026-02-15 09:00:00','2026-05-01 09:00:00'),
  (:company,'Healthcare GPO Contract Pricing','Contracted 6% discount for group-purchasing healthcare members.','contract','percentage',6,'{"industry":"Healthcare","gpoMember":true}',4,true,'["all"]','["Metro Hospital Kitchens"]','2025-10-01','2027-09-30',11,58300,'2025-10-06 11:00:00','2026-07-20 14:00:00'),
  (:company,'Service Plan Attach Discount','5% off equipment when a 3-year service plan is attached.','cross_sell','percentage',5,'{"attach":"service-plan-3yr"}',5,true,'["all"]','["all"]','2025-12-01','2026-12-31',19,44650,'2025-11-25 10:00:00','2026-09-05 09:00:00'),
  (:company,'Roadshow Booking Incentive','Flat 2,500 off orders confirmed within 14 days of a roadshow demo.','promotional','fixed_amount',2500,'{"source":"roadshow","daysSinceDemo":{"lte":14}}',6,true,'["all"]','["all"]','2026-10-05','2026-12-05',0,0,'2026-08-30 09:00:00','2026-08-30 09:00:00');

-- ============================================================
-- Proposals
-- ============================================================
DELETE FROM crm_proposals WHERE "companyId" = :company;
INSERT INTO crm_proposals
  ("companyId", "proposalNumber", title, customer, "customerCompany", "contactPerson", status,
   "totalValue", sections, pages, "submittedDate", "viewedDate", "respondedDate", "validUntil",
   probability, "assignedTo", tags, notes, attachments, "lastActivity", "createdDate", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-PROP-2025-001','Meridian Cruise Lines — 4-Vessel Galley Refit','Charles Osei','Meridian Cruise Lines','Charles Osei','under_review',1240000,9,42,'2025-11-05','2025-11-07',NULL,'2026-01-31',70,'Sarah Mitchell','marine,galley,enterprise','Board review scheduled December; marine-grade spec confirmed.',5,'2026-08-28','2025-10-24','2025-10-24 09:00:00','2026-08-28 15:00:00'),
  (:company,'DEMO-PROP-2025-002','Maison Claire Catering — Dishwashing Line & Blast Chillers','Andre Boucher','Maison Claire Catering','Andre Boucher','accepted',96500,5,18,'2025-11-24','2025-11-25','2025-12-08','2026-01-15',100,'David Williams','catering,dishwashing','Accepted with 5% negotiated discount; install booked for January.',2,'2025-12-08','2025-11-20','2025-11-20 10:00:00','2025-12-08 14:00:00'),
  (:company,'DEMO-PROP-2026-003','Taco Verde — 12-Store Ventless Fryer Rollout','Miguel Santana','Taco Verde Franchising','Miguel Santana','under_review',734000,7,31,'2026-03-05','2026-03-06',NULL,'2026-10-31',65,'Sarah Mitchell','franchise,fryer,rollout','Phased delivery proposal: 4 stores per quarter.',4,'2026-09-02','2026-02-21','2026-02-21 09:00:00','2026-09-02 11:00:00'),
  (:company,'DEMO-PROP-2026-004','Ferrante''s Trattoria — Espresso Stations','Lucia Ferrante','Ferrante''s Trattoria','Lucia Ferrante','accepted',28400,3,9,'2026-04-02','2026-04-03','2026-04-09','2026-05-31',100,'David Williams','espresso,cafe','Verbal commit on 8 Apr converted to order.',1,'2026-04-09','2026-03-30','2026-03-30 10:00:00','2026-04-09 12:00:00'),
  (:company,'DEMO-PROP-2026-005','Blue Fig Hotels — 2026 Property Refurbishment Package','Amelia Torres','Blue Fig Hotels Group','Amelia Torres','draft',412000,8,36,NULL,NULL,NULL,'2026-11-30',40,'Sarah Mitchell','hotel,refurbishment','Draft pending final equipment counts from property surveys.',3,'2026-09-07','2026-08-12','2026-08-12 09:00:00','2026-09-07 16:00:00'),
  (:company,'DEMO-PROP-2026-006','Northgate School District — Cafeteria Modernisation','Tina Volkov','Northgate School District','Tina Volkov','rejected',186000,6,24,'2026-01-20','2026-01-22','2026-02-28','2026-04-30',0,'David Williams','education,cafeteria','Lost to budget freeze; revisit next fiscal year.',2,'2026-02-28','2026-01-12','2026-01-12 09:00:00','2026-02-28 10:00:00'),
  (:company,'DEMO-PROP-2026-007','Lakeside Resort — Spa Café Equipment Refresh','Henrik Olsen','Lakeside Resort & Spa','Henrik Olsen','draft',54800,4,12,NULL,NULL,NULL,'2026-12-15',50,'David Williams','resort,cafe','Being drafted ahead of 18 Sep kick-off meeting.',0,'2026-09-09','2026-09-09','2026-09-09 10:00:00','2026-09-09 10:00:00');

-- ============================================================
-- Quote templates
-- ============================================================
DELETE FROM crm_quote_templates WHERE "companyId" = :company;
INSERT INTO crm_quote_templates
  ("companyId", name, description, category, items, "estimatedValue", "validityDays", "usageCount",
   "lastUsed", "isFavorite", tags, discount, "includesTax", "termsPreview", "createdAt", "updatedAt")
VALUES
  (:company,'Standard Restaurant Kitchen Package','Cook line, prep, refrigeration and dishwashing for a 100-cover restaurant.','standard',24,145000,30,31,'2026-09-03',true,'restaurant,full-kitchen',0,true,'Net 30. Delivery 8-10 weeks from order confirmation. Installation included.','2025-10-08 09:00:00','2026-09-03 10:00:00'),
  (:company,'Franchise Fitout — Standard Store','Standardised franchise package: fryer line, prep line, refrigeration.','bundle',18,86500,45,14,'2026-08-15',true,'franchise,bundle',5,true,'Bundle pricing per store. Multi-store schedules quoted separately.','2025-10-28 10:00:00','2026-08-15 09:00:00'),
  (:company,'Hospital Dietary Kitchen','HACCP-compliant dietary kitchen: combi ovens, blast chillers, tray line.','specialized',29,262000,60,6,'2026-04-20',false,'healthcare,haccp',0,true,'Compliance documentation pack included. Net 60 for institutional buyers.','2025-10-15 11:00:00','2026-04-20 14:00:00'),
  (:company,'Café / Espresso Station','Espresso stations, under-counter refrigeration and pastry display.','standard',9,31500,30,17,'2026-07-22',false,'cafe,espresso',0,true,'Net 15. Barista onboarding session included with installation.','2025-11-05 09:30:00','2026-07-22 11:00:00'),
  (:company,'Service Plan Add-On (3-Year)','Preventive maintenance, priority response and parts coverage add-on.','service',3,18900,30,22,'2026-09-05',true,'service,maintenance',0,false,'Billed annually in advance. Covers all B3-supplied equipment on site.','2025-11-25 10:00:00','2026-09-05 09:00:00');

-- ============================================================
-- Contract templates (before renewals/amendments)
-- ============================================================
DELETE FROM crm_contract_templates WHERE "companyId" = :company;
INSERT INTO crm_contract_templates
  ("companyId", name, description, category, "defaultDuration", "defaultValue", "billingCycle",
   "autoRenew", "renewalNoticeDays", "paymentTerms", clauses, "usageCount", "lastUsed", "isFavorite",
   tags, "includesSLA", "includesTermination", "includesIPRights", "includesConfidentiality",
   "createdAt", "updatedAt")
VALUES
  (:company,'Equipment Supply & Installation','Master template for one-off supply and installation projects.','supply',6,150000,'milestone',false,30,'40/40/20 milestone','scope,delivery,installation,warranty,termination',26,'2026-09-01',true,'supply,install',false,true,false,true,'2025-10-05 09:00:00','2026-09-01 10:00:00'),
  (:company,'Preventive Maintenance Service Plan','Annual service plan with PM visits, priority response and parts.','service',12,18900,'annual',true,60,'Annual in advance','sla,response-times,parts,exclusions,termination',18,'2026-08-20',true,'service,maintenance',true,true,false,true,'2025-10-05 09:10:00','2026-08-20 09:00:00'),
  (:company,'Franchise Rollout Master Agreement','Multi-store rollout MSA with per-store schedules and volume tiers.','framework',24,900000,'per-milestone',false,90,'Per store schedule','volume-tiers,schedules,change-control,termination,confidentiality',4,'2026-03-05',false,'franchise,msa',false,true,true,true,'2025-10-28 10:00:00','2026-03-05 11:00:00'),
  (:company,'Institutional Supply Agreement','GPO/tender-aligned template for hospitals, schools and public buyers.','supply',12,250000,'quarterly',false,60,'Net 60','compliance,gpo-pricing,reporting,termination',7,'2026-04-15',false,'healthcare,institutional',false,true,false,true,'2025-10-15 11:00:00','2026-04-15 09:00:00'),
  (:company,'Equipment Rental & Lease','Short-term rental template for events and temporary kitchens.','rental',3,12000,'monthly',true,15,'Monthly in advance','condition,insurance,return,termination',9,'2026-06-10',false,'rental,events',true,true,false,false,'2025-11-12 09:00:00','2026-06-10 14:00:00');

-- ============================================================
-- Contract renewals
-- ============================================================
DELETE FROM crm_contract_renewals WHERE "companyId" = :company;
INSERT INTO crm_contract_renewals
  ("companyId", "contractNumber", "contractTitle", customer, "customerCompany", "contactPerson",
   "contactEmail", "contactPhone", "currentValue", "proposedValue", "valueChange", "changePercent",
   "currentEndDate", "proposedStartDate", "proposedDuration", "daysUntilExpiry", "renewalProbability",
   status, "lastContactDate", "nextFollowUpDate", "assignedTo", tags, notes, "autoRenew",
   "renewalNoticeSent", "customerResponse", "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-CTR-2023-014','Metro Hospital Kitchens — PM Service Plan','Dr. Karen Ng','Metro Hospital Kitchens','Dr. Karen Ng','karen@metrohospital.org','+1-312-555-0193',42000,43260,1260,3.00,'2026-06-30','2026-07-01',12,-72,100,'renewed','2026-04-12','2026-06-01','Sarah Mitchell','service,healthcare','Renewed with 3% uplift and updated PM schedule.',false,true,'accepted','2026-03-02 09:00:00','2026-06-15 10:00:00'),
  (:company,'DEMO-CTR-2024-021','Blue Fig Hotels — Multi-Property Service Plan','Amelia Torres','Blue Fig Hotels Group','Amelia Torres','amelia@bluefighotels.com','+1-212-555-0132',96000,104000,8000,8.33,'2026-11-30','2026-12-01',24,81,85,'in_negotiation','2026-08-27','2026-09-17','Sarah Mitchell','service,hotel','Proposing 24-month term with 2 additional properties.',false,true,'considering','2026-08-01 09:00:00','2026-08-27 14:00:00'),
  (:company,'DEMO-CTR-2024-008','Golden Spoon — Franchise Rollout MSA','Priya Shah','Golden Spoon Franchises','Priya Shah','priya@goldenspoon.com','+1-480-555-0214',900000,1150000,250000,27.78,'2026-12-31','2027-01-01',24,112,90,'upcoming','2026-06-17','2026-09-25','Sarah Mitchell','franchise,msa','Expansion to 14 stores confirmed at June executive review.',false,false,NULL,'2026-06-18 09:00:00','2026-08-30 09:00:00'),
  (:company,'DEMO-CTR-2023-031','Campus Dining Co-op — Institutional Supply','Raj Patel','Campus Dining Co-op','Raj Patel','raj@campusdining.edu','+1-617-555-0155',120000,120000,0,0.00,'2027-01-15','2027-01-16',12,127,70,'upcoming','2026-08-27',NULL,'David Williams','education,institutional','Flat renewal expected; tender window opens October.',false,false,NULL,'2026-08-05 09:00:00','2026-08-27 15:00:00'),
  (:company,'DEMO-CTR-2025-006','Summit Catering — Event Equipment Rental','Nina Alvarez','Summit Catering Services','Nina Alvarez','nina@summitcatering.com','+1-303-555-0178',14400,14400,0,0.00,'2026-09-30','2026-10-01',12,20,95,'notice_sent','2026-09-02','2026-09-20','David Williams','rental,catering','Auto-renew in place; confirmation courtesy call scheduled.',true,true,'accepted','2026-08-15 09:00:00','2026-09-02 09:30:00'),
  (:company,'DEMO-CTR-2024-017','Harbour Grill — PM Service Plan','Marcus Lee','Harbour Grill Restaurants','Marcus Lee','marcus@harbourgrill.com','+1-415-555-0110',37800,37800,0,0.00,'2026-10-31','2026-11-01',12,51,60,'at_risk','2026-08-19','2026-09-12','Sarah Mitchell','service,restaurant','Customer comparing third-party service providers; retention offer prepared.',false,true,'considering','2026-07-20 09:00:00','2026-08-19 16:00:00');

-- ============================================================
-- Contract amendments
-- ============================================================
DELETE FROM crm_contract_amendments WHERE "companyId" = :company;
INSERT INTO crm_contract_amendments
  ("companyId", "amendmentNumber", "contractNumber", "contractTitle", customer, "customerCompany",
   "amendmentType", status, description, "originalValue", "newValue", "valueImpact",
   "originalEndDate", "newEndDate", "effectiveDate", "requestedDate", "approvedDate", "executedDate",
   "requestedBy", "approverName", "assignedTo", priority, reason, "impactedClauses",
   "requiresLegalReview", "requiresCustomerApproval", "customerApprovalStatus",
   "internalApprovalStatus", tags, attachments, notes, "createdAt", "updatedAt")
VALUES
  (:company,'DEMO-AMD-2025-001','DEMO-CTR-2024-008','Golden Spoon — Franchise Rollout MSA','Priya Shah','Golden Spoon Franchises','scope_change','executed','Add 2 stores (Tucson, Mesa) to the 2026 rollout schedule.',900000,1030000,130000,'2026-12-31','2026-12-31','2025-12-01','2025-11-10','2025-11-21','2025-11-28','Priya Shah','James Holloway','Sarah Mitchell','high','Customer accelerated expansion plan after strong Q3 openings.','schedules,volume-tiers',false,true,'approved','approved','franchise,scope',3,'Store schedules 9 and 10 appended.','2025-11-10 09:00:00','2025-11-28 16:00:00'),
  (:company,'DEMO-AMD-2026-002','DEMO-CTR-2024-021','Blue Fig Hotels — Multi-Property Service Plan','Amelia Torres','Blue Fig Hotels Group','sla_change','executed','Upgrade response SLA from next-business-day to 8 business hours for flagship property.',96000,101500,5500,'2026-11-30','2026-11-30','2026-02-01','2026-01-08','2026-01-19','2026-01-26','Amelia Torres','James Holloway','Sarah Mitchell','medium','Flagship kitchen downtime tolerance reduced after banquet expansion.','sla,response-times',true,true,'approved','approved','sla,hotel',2,'Legal reviewed liability cap wording.','2026-01-08 09:00:00','2026-01-26 15:00:00'),
  (:company,'DEMO-AMD-2026-003','DEMO-CTR-2023-031','Campus Dining Co-op — Institutional Supply','Raj Patel','Campus Dining Co-op','value_change','executed','Apply GPO price adjustment per annual index review.',120000,116400,-3600,'2027-01-15','2027-01-15','2026-04-01','2026-03-05','2026-03-18','2026-03-25','Raj Patel','Elena Cruz','David Williams','low','Contracted annual index adjustment clause invoked.','gpo-pricing',false,false,NULL,'approved','institutional,pricing',1,NULL,'2026-03-05 09:00:00','2026-03-25 11:00:00'),
  (:company,'DEMO-AMD-2026-004','DEMO-CTR-2023-014','Metro Hospital Kitchens — PM Service Plan','Dr. Karen Ng','Metro Hospital Kitchens','term_extension','executed','Bridge extension of 1 month to align renewal with hospital fiscal year.',42000,45500,3500,'2026-05-31','2026-06-30','2026-05-15','2026-04-20','2026-04-28','2026-05-05','Dr. Karen Ng','Elena Cruz','Sarah Mitchell','medium','Hospital procurement requested fiscal-year alignment.','term,termination',true,true,'approved','approved','healthcare,extension',2,'Superseded by full renewal effective 1 July.','2026-04-20 09:00:00','2026-05-05 14:00:00'),
  (:company,'DEMO-AMD-2026-005','DEMO-CTR-2024-017','Harbour Grill — PM Service Plan','Marcus Lee','Harbour Grill Restaurants','value_change','pending_approval','Retention offer: 8% service-plan discount for 24-month commitment.',37800,34776,-3024,'2026-10-31','2028-10-31','2026-11-01','2026-08-20',NULL,NULL,'Sarah Mitchell','James Holloway','Sarah Mitchell','high','Counter third-party service provider bid; retain at-risk account.','pricing,term',false,true,'pending','pending','retention,service',1,'Awaiting sales director approval before customer presentation.','2026-08-20 09:00:00','2026-09-08 10:00:00');

-- ============================================================
-- Sales teams
-- ============================================================
DELETE FROM crm_sales_teams WHERE "companyId" = :company;
INSERT INTO crm_sales_teams
  ("companyId", name, description, type, manager, members, status, performance, territories,
   "createdAt", "updatedAt")
VALUES
  (:company,'Enterprise & Strategic Accounts','Owns enterprise hospitality, franchise MSAs and ABM programs.','sales','Sarah Mitchell',4,'active','{"quota":5200000,"attained":3890000,"attainmentPct":74.8,"openPipeline":2450000}','DEMO-West Coast,DEMO-East Coast','2025-10-02 09:00:00','2026-09-01 10:00:00'),
  (:company,'Mid-Market & SMB','Covers mid-market, SMB and inbound web leads across all regions.','sales','David Williams',5,'active','{"quota":2800000,"attained":2140000,"attainmentPct":76.4,"openPipeline":980000}','DEMO-Central,DEMO-Mountain','2025-10-02 09:05:00','2026-09-01 10:00:00'),
  (:company,'Healthcare & Institutional','Vertical team for hospitals, education and public-sector tenders.','vertical','Sarah Mitchell',3,'active','{"quota":1600000,"attained":1210000,"attainmentPct":75.6,"openPipeline":540000}','DEMO-Midwest Institutional','2025-10-02 09:10:00','2026-09-01 10:00:00'),
  (:company,'Inside Sales & Renewals','Handles service-plan renewals, win-back and quote follow-up.','inside_sales','David Williams',3,'active','{"quota":900000,"attained":720000,"attainmentPct":80.0,"openPipeline":260000}','DEMO-National Remote','2026-01-05 09:00:00','2026-09-01 10:00:00');

-- ============================================================
-- Sales territories (no companyId — idempotent via DEMO- name prefix)
-- ============================================================
DELETE FROM crm_sales_territories WHERE name LIKE 'DEMO-%';
INSERT INTO crm_sales_territories
  (name, country, state, city, "assignedUserId", "assignedTeamId", priority, "isActive",
   "createdAt", "updatedAt")
VALUES
  ('DEMO-West Coast','USA','CA',NULL,'user-sarah-mitchell',NULL,1,true,'2025-10-02 09:00:00','2025-10-02 09:00:00'),
  ('DEMO-East Coast','USA','NY',NULL,'user-sarah-mitchell',NULL,1,true,'2025-10-02 09:01:00','2025-10-02 09:01:00'),
  ('DEMO-Central','USA','IL',NULL,'user-david-williams',NULL,2,true,'2025-10-02 09:02:00','2025-10-02 09:02:00'),
  ('DEMO-Mountain','USA','CO',NULL,'user-david-williams',NULL,3,true,'2025-10-02 09:03:00','2025-10-02 09:03:00'),
  ('DEMO-Midwest Institutional','USA','IL','Chicago','user-sarah-mitchell',NULL,2,true,'2025-10-02 09:04:00','2025-10-02 09:04:00'),
  ('DEMO-National Remote','USA',NULL,NULL,'user-david-williams',NULL,4,true,'2026-01-05 09:00:00','2026-01-05 09:00:00');

-- ============================================================
-- Saved reports
-- ============================================================
DELETE FROM crm_saved_reports WHERE "companyId" = :company;
INSERT INTO crm_saved_reports
  ("companyId", name, description, "reportType", module, category, definition, schedule,
   "isFavorite", "isShared", "createdBy", "lastRun", "createdAt", "updatedAt")
VALUES
  (:company,'Pipeline by Stage — Weekly','Open pipeline value and count grouped by stage, week over week.','bar','sales','pipeline','{"groupBy":"stage","measure":"estimatedValue","filters":{"status":"open"}}','weekly',true,true,'Sarah Mitchell','2026-09-08','2025-10-07 09:00:00','2026-09-08 07:00:00'),
  (:company,'Lead Source Conversion','Lead-to-won conversion rate by source over trailing 12 months.','funnel','crm','leads','{"groupBy":"leadSource","measure":"conversionRate","window":"12m"}','monthly',true,true,'David Williams','2026-09-01','2025-10-07 09:05:00','2026-09-01 07:00:00'),
  (:company,'Campaign ROI Summary','Budget vs spend vs attributed revenue per campaign.','table','marketing','campaigns','{"columns":["name","budget","spent","leadsGenerated","revenue"],"sort":"revenue desc"}','monthly',false,true,'Sarah Mitchell','2026-09-01','2025-11-10 10:00:00','2026-09-01 07:00:00'),
  (:company,'Renewals at Risk','Contracts expiring in 90 days with probability under 70%.','table','crm','contracts','{"filters":{"daysUntilExpiry":{"lte":90},"renewalProbability":{"lt":70}}}','weekly',true,false,'Sarah Mitchell','2026-09-08','2026-02-15 09:00:00','2026-09-08 07:00:00'),
  (:company,'Rep Activity Scorecard','Calls, emails and meetings logged per rep per week.','table','crm','activities','{"groupBy":["assignedTo","type"],"measure":"count","window":"1w"}','weekly',false,true,'David Williams','2026-09-08','2025-10-20 11:00:00','2026-09-08 07:00:00'),
  (:company,'Win-Back Cohort Tracking','Reactivation status of dormant-account cohorts by month.','line','marketing','win-back','{"cohort":"dormant-12m","measure":"reactivations","groupBy":"month"}','monthly',false,false,'David Williams','2026-09-02','2026-06-20 10:00:00','2026-09-02 07:00:00');

-- ============================================================
-- Social accounts
-- ============================================================
DELETE FROM crm_social_accounts WHERE "companyId" = :company;
INSERT INTO crm_social_accounts
  ("companyId", platform, handle, status, followers, posts, engagement, leads, "lastSync",
   "createdAt", "updatedAt")
VALUES
  (:company,'linkedin','@b3-macbis','connected',12840,214,4.60,38,'2026-09-09','2025-10-05 09:00:00','2026-09-09 06:00:00'),
  (:company,'instagram','@b3macbis.kitchens','connected',8460,187,3.90,12,'2026-09-09','2025-10-05 09:05:00','2026-09-09 06:00:00'),
  (:company,'youtube','@B3MACBIS','connected',5320,64,2.80,9,'2026-09-08','2025-10-05 09:10:00','2026-09-08 06:00:00'),
  (:company,'facebook','@B3MACBISEquipment','connected',6910,201,1.70,6,'2026-09-09','2025-10-05 09:15:00','2026-09-09 06:00:00'),
  (:company,'x','@b3macbis','disconnected',2140,96,0.90,1,'2026-05-14','2025-10-05 09:20:00','2026-05-14 06:00:00');

-- ============================================================
-- Social integrations
-- ============================================================
DELETE FROM crm_social_integrations WHERE "companyId" = :company;
INSERT INTO crm_social_integrations
  ("companyId", platform, "accountName", "accountHandle", connected, followers, engagement,
   "lastSync", stats, config, "createdAt", "updatedAt")
VALUES
  (:company,'linkedin','B3 MACBIS Kitchen Equipment','@b3-macbis',true,12840,4.60,'2026-09-09 06:00:00','{"impressions":184000,"clicks":6120,"leads":38}','{"syncFrequency":"hourly","leadForms":true}','2025-10-05 09:00:00','2026-09-09 06:00:00'),
  (:company,'instagram','B3 MACBIS Kitchens','@b3macbis.kitchens',true,8460,3.90,'2026-09-09 06:00:00','{"impressions":96000,"clicks":2140,"leads":12}','{"syncFrequency":"daily","leadForms":false}','2025-10-05 09:05:00','2026-09-09 06:00:00'),
  (:company,'youtube','B3 MACBIS','@B3MACBIS',true,5320,2.80,'2026-09-08 06:00:00','{"views":412000,"watchHours":18400,"leads":9}','{"syncFrequency":"daily","leadForms":false}','2025-10-05 09:10:00','2026-09-08 06:00:00'),
  (:company,'facebook','B3 MACBIS Equipment','@B3MACBISEquipment',true,6910,1.70,'2026-09-09 06:00:00','{"impressions":74000,"clicks":1890,"leads":6}','{"syncFrequency":"daily","leadForms":true}','2025-10-05 09:15:00','2026-09-09 06:00:00'),
  (:company,'x','B3 MACBIS','@b3macbis',false,2140,0.90,'2026-05-14 06:00:00','{"impressions":21000,"clicks":340,"leads":1}','{"syncFrequency":"paused","leadForms":false}','2025-10-05 09:20:00','2026-05-14 06:00:00');

-- ============================================================
-- Custom fields
-- ============================================================
DELETE FROM crm_custom_fields WHERE "companyId" = :company;
INSERT INTO crm_custom_fields
  ("companyId", name, "apiName", label, description, "fieldType", module, category, "dataType",
   "isRequired", "isUnique", "isActive", "isSearchable", "isEditable", "defaultValue", "helpText",
   validation, usage, "createdBy", "createdAt", "updatedAt")
VALUES
  (:company,'Kitchen Size (sq ft)','kitchen_size_sqft','Kitchen Size (sq ft)','Approximate production kitchen floor area.','number','lead','qualification','number',false,false,true,true,true,NULL,'Used for capacity sizing and hood/ventilation estimates.','{"min":50,"max":50000}','leads:412','Sarah Mitchell','2025-10-08 09:00:00','2025-10-08 09:00:00'),
  (:company,'Gas or Electric','energy_type','Gas / Electric','Primary energy type available at site.','picklist','lead','qualification','string',false,false,true,true,true,'gas','Determines eligible cook-line models.','{"options":["gas","electric","dual"]}','leads:389','Sarah Mitchell','2025-10-08 09:05:00','2025-10-08 09:05:00'),
  (:company,'Number of Locations','location_count','Number of Locations','Total operating locations for multi-site accounts.','number','customer','profile','number',false,false,true,true,true,'1','Drives franchise/multi-site pricing tiers.','{"min":1,"max":500}','customers:8','David Williams','2025-10-08 09:10:00','2025-10-08 09:10:00'),
  (:company,'HACCP Certification Required','haccp_required','HACCP Required','Whether the buyer requires HACCP compliance documentation.','checkbox','opportunity','compliance','boolean',false,false,true,true,true,'false','Institutional and healthcare deals usually require this.',NULL,'opportunities:44','Sarah Mitchell','2025-10-08 09:15:00','2025-10-08 09:15:00'),
  (:company,'Install Window','install_window','Preferred Install Window','Customer-preferred installation period.','date','opportunity','fulfilment','date',false,false,true,true,true,NULL,'Coordinates production scheduling with site readiness.',NULL,'opportunities:61','David Williams','2025-10-08 09:20:00','2025-10-08 09:20:00'),
  (:company,'Existing Equipment Brand','incumbent_brand','Incumbent Brand','Brand of equipment currently installed at the site.','text','lead','qualification','string',false,false,true,true,true,NULL,'Useful for trade-in offers and competitive positioning.',NULL,'leads:274','David Williams','2025-10-08 09:25:00','2025-10-08 09:25:00'),
  (:company,'GPO Membership','gpo_membership','GPO Membership','Group purchasing organisation the account belongs to.','picklist','customer','commercial','string',false,false,true,true,true,NULL,'Triggers contracted GPO pricing rules.','{"options":["Premier","Vizient","HPS","None"]}','customers:3','Sarah Mitchell','2025-10-08 09:30:00','2025-10-08 09:30:00'),
  (:company,'Demo Attended','demo_attended','Demo Attended','Whether the contact attended a live or virtual equipment demo.','checkbox','lead','engagement','boolean',false,false,true,true,true,'false','Set automatically by event and webinar integrations.',NULL,'leads:198','David Williams','2025-10-08 09:35:00','2025-10-08 09:35:00');
