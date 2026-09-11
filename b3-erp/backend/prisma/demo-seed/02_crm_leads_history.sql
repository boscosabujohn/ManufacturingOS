-- Demo seed — CRM lead history for B3 MACBIS (extends 01_crm.sql).
-- Adds 52 leads spread over Oct 2025 .. Sep 2026 (heavier in recent months) so the
-- pipeline/funnel charts and the derived opportunity views (crm-opportunities.service.ts)
-- show a realistic funnel: many new/contacted, fewer qualified/proposal/negotiation,
-- some won, some lost.
--
-- NOTE: crm_leads has NO "companyId" column (unlike crm_customers) — the :company
-- variable is kept for consistency with 01_crm.sql but is not used in this file.
-- Idempotency marker: every row inserted here has an email ending in
-- @demo-seed.b3macbis.com; we delete by that marker only, never touching the
-- 8 leads seeded by 01_crm.sql.
\set company '''b3000000-0000-4000-8000-000000000001'''

DELETE FROM crm_leads WHERE email LIKE '%@demo-seed.b3macbis.com';

INSERT INTO crm_leads
  ("firstName","lastName",title,company,email,phone,industry,city,country,
   status,rating,"leadSource","estimatedValue","estimatedCloseDate",probability,
   "leadScore","productInterest","assignedTo","createdAt","updatedAt","lastContactDate")
VALUES
  -- ============ Oct 2025 ============
  ('Grace','Kim','Purchasing Director','St. Aldric Medical Center','grace.kim@demo-seed.b3macbis.com','+1-216-555-0401','Healthcare','Cleveland, OH','USA','won','hot','Referral',265000,'2025-12-18',100,92,'Dishwashing Systems','Sarah Mitchell','2025-10-03 09:15:00','2025-12-18 16:40:00','2025-12-15 11:00:00'),
  ('Victor','Mendes','Owner','Copperleaf Tavern','victor.mendes@demo-seed.b3macbis.com','+1-615-555-0402','Restaurant','Nashville, TN','USA','lost','cold','Cold Call',32000,'2025-11-30',0,30,'Cook Line Retrofit','David Williams','2025-10-09 14:20:00','2025-11-21 10:05:00','2025-11-18 15:30:00'),
  ('Helen','Marsh','F&B Director','Aurelia Grand Hotel','helen.marsh@demo-seed.b3macbis.com','+1-504-555-0403','Hospitality','New Orleans, LA','USA','won','hot','Trade Show',388000,'2026-01-09',100,95,'Banquet Kitchen Line','Sarah Mitchell','2025-10-21 10:30:00','2026-01-09 17:10:00','2026-01-06 14:00:00'),

  -- ============ Nov 2025 ============
  ('Omar','Haddad','Operations Manager','Cedar & Salt Restaurant Group','omar.haddad@demo-seed.b3macbis.com','+1-512-555-0404','Restaurant','Austin, TX','USA','won','hot','Website',118000,'2026-01-16',100,88,'Combi Ovens','David Williams','2025-11-04 08:45:00','2026-01-16 12:20:00','2026-01-14 09:30:00'),
  ('Tina','Volkov','Procurement Officer','Northgate School District','tina.volkov@demo-seed.b3macbis.com','+1-612-555-0405','Education','Minneapolis, MN','USA','lost','warm','Email Campaign',96000,'2026-01-31',0,55,'Servery Counters','David Williams','2025-11-12 11:10:00','2026-02-02 09:50:00','2026-01-28 13:15:00'),
  ('Charles','Osei','VP Operations','Meridian Cruise Lines','charles.osei@demo-seed.b3macbis.com','+1-305-555-0406','Cruise','Miami, FL','USA','negotiation','hot','Trade Show',450000,'2026-10-15',80,91,'Full Galley Fitout','Sarah Mitchell','2025-11-19 15:00:00','2026-08-28 16:30:00','2026-08-28 16:30:00'),

  -- ============ Dec 2025 ============
  ('Lucia','Ferrante','Owner','Ferrante''s Trattoria','lucia.ferrante@demo-seed.b3macbis.com','+1-401-555-0407','Restaurant','Providence, RI','USA','won','warm','Referral',47000,'2026-02-12',100,76,'Refrigeration','David Williams','2025-12-02 09:30:00','2026-02-12 14:45:00','2026-02-10 10:20:00'),
  ('Andre','Boucher','Executive Chef','Maison Claire Catering','andre.boucher@demo-seed.b3macbis.com','+1-225-555-0408','Catering','Baton Rouge, LA','USA','qualified','warm','Webinar',62000,'2026-11-20',45,63,'Blast Chillers','David Williams','2025-12-10 13:25:00','2026-07-30 11:00:00','2026-07-30 11:00:00'),
  ('Kevin','O''Rourke','General Manager','Shamrock Sports Bar','kevin.orourke@demo-seed.b3macbis.com','+1-617-555-0409','Restaurant','Boston, MA','USA','lost','cold','Social Media',21000,'2026-01-15',0,28,'Ice Machines','David Williams','2025-12-16 16:05:00','2026-01-20 09:15:00','2026-01-17 14:40:00'),

  -- ============ Jan 2026 ============
  ('Danielle','Hart','Director of Dining Services','Brookfield Senior Living','danielle.hart@demo-seed.b3macbis.com','+1-614-555-0410','Healthcare','Columbus, OH','USA','won','hot','Referral',152000,'2026-03-27',100,89,'Dishwashing Systems','Sarah Mitchell','2026-01-06 10:00:00','2026-03-27 15:30:00','2026-03-25 11:45:00'),
  ('Miguel','Santana','Franchise Development Lead','Taco Verde Franchising','miguel.santana@demo-seed.b3macbis.com','+1-210-555-0411','Franchise','San Antonio, TX','USA','proposal','hot','Partner',275000,'2026-10-30',65,84,'Cook Line Retrofit','Sarah Mitchell','2026-01-13 09:40:00','2026-08-19 14:10:00','2026-08-19 14:10:00'),
  ('Beatrice','Lang','COO','Lang Hospitality Group','beatrice.lang@demo-seed.b3macbis.com','+1-502-555-0412','Hospitality','Louisville, KY','USA','negotiation','hot','Trade Show',340000,'2026-09-30',78,90,'Banquet Kitchen Line','Sarah Mitchell','2026-01-21 11:20:00','2026-09-03 16:00:00','2026-09-03 16:00:00'),
  ('Sam','Whitaker','Owner','Whitaker''s Diner','sam.whitaker@demo-seed.b3macbis.com','+1-918-555-0413','Restaurant','Tulsa, OK','USA','lost','warm','Website',18000,'2026-02-28',0,42,'Refrigeration','David Williams','2026-01-28 14:55:00','2026-03-05 10:30:00','2026-03-02 09:00:00'),

  -- ============ Feb 2026 ============
  ('Ingrid','Sorensen','F&B Manager','Fjordline Cruises USA','ingrid.sorensen@demo-seed.b3macbis.com','+1-206-555-0414','Cruise','Seattle, WA','USA','won','hot','Trade Show',415000,'2026-05-22',100,94,'Full Galley Fitout','Sarah Mitchell','2026-02-03 08:50:00','2026-05-22 17:20:00','2026-05-20 13:30:00'),
  ('Robert','Chen','Facilities Director','Westbrook University','robert.chen@demo-seed.b3macbis.com','+1-215-555-0415','Education','Philadelphia, PA','USA','proposal','warm','Email Campaign',198000,'2026-11-15',60,69,'Dishwashing Systems','David Williams','2026-02-10 10:15:00','2026-08-25 11:40:00','2026-08-25 11:40:00'),
  ('Fatima','Noor','Catering Lead','Crescent Events & Catering','fatima.noor@demo-seed.b3macbis.com','+1-313-555-0416','Catering','Dearborn, MI','USA','qualified','warm','Referral',54000,'2026-12-10',50,64,'Combi Ovens','David Williams','2026-02-17 13:00:00','2026-08-07 15:25:00','2026-08-07 15:25:00'),
  ('Doug','Pearson','Owner','Big Sky Steakhouse','doug.pearson@demo-seed.b3macbis.com','+1-406-555-0417','Restaurant','Billings, MT','USA','lost','cold','Cold Call',36000,'2026-04-05',0,33,'Ventilation & Hoods','David Williams','2026-02-24 09:35:00','2026-04-10 10:50:00','2026-04-08 14:15:00'),

  -- ============ Mar 2026 ============
  ('Yolanda','Reyes','VP Supply Chain','SunFresh Hotel Collection','yolanda.reyes@demo-seed.b3macbis.com','+1-407-555-0418','Hospitality','Orlando, FL','USA','negotiation','hot','Partner',295000,'2026-10-20',75,87,'Combi Ovens','Sarah Mitchell','2026-03-04 10:20:00','2026-09-05 14:35:00','2026-09-05 14:35:00'),
  ('Peter','Novak','Kitchen Operations Manager','Lakeshore Country Club','peter.novak@demo-seed.b3macbis.com','+1-414-555-0419','Hospitality','Milwaukee, WI','USA','proposal','warm','Referral',88000,'2026-11-05',62,70,'Cook Line Retrofit','David Williams','2026-03-11 11:45:00','2026-08-31 09:55:00','2026-08-31 09:55:00'),
  ('Alice','Duncan','Director of Nutrition','Riverbend Children''s Hospital','alice.duncan@demo-seed.b3macbis.com','+1-314-555-0420','Healthcare','St. Louis, MO','USA','qualified','hot','Webinar',176000,'2026-12-18',55,74,'Servery Counters','Sarah Mitchell','2026-03-18 14:10:00','2026-08-14 16:20:00','2026-08-14 16:20:00'),
  ('Marco','Bellini','Owner','Bellini Brothers Pizza','marco.bellini@demo-seed.b3macbis.com','+1-860-555-0421','Restaurant','Hartford, CT','USA','contacted','cold','Social Media',24000,'2027-01-30',30,38,'Ventilation & Hoods','David Williams','2026-03-25 09:05:00','2026-07-22 13:40:00','2026-07-22 13:40:00'),

  -- ============ Apr 2026 ============
  ('Susan','Park','Dining Director','Elmwood Academy','susan.park@demo-seed.b3macbis.com','+1-804-555-0422','Education','Richmond, VA','USA','proposal','warm','Email Campaign',132000,'2026-11-25',65,68,'Dishwashing Systems','David Williams','2026-04-01 08:30:00','2026-09-01 10:45:00','2026-09-01 10:45:00'),
  ('Hassan','Ali','Operations Director','Doner Express Franchising','hassan.ali@demo-seed.b3macbis.com','+1-313-555-0423','Franchise','Detroit, MI','USA','qualified','warm','Website',210000,'2027-01-15',48,66,'Cook Line Retrofit','Sarah Mitchell','2026-04-08 12:50:00','2026-08-20 15:05:00','2026-08-20 15:05:00'),
  ('Renee','Caldwell','General Manager','Harborview Convention Hall','renee.caldwell@demo-seed.b3macbis.com','+1-410-555-0424','Events','Baltimore, MD','USA','negotiation','hot','Trade Show',262000,'2026-10-10',82,89,'Banquet Kitchen Line','Sarah Mitchell','2026-04-15 15:15:00','2026-09-08 11:30:00','2026-09-08 11:30:00'),
  ('Josh','Tran','Owner','Saigon Corner Kitchen','josh.tran@demo-seed.b3macbis.com','+1-405-555-0425','Restaurant','Oklahoma City, OK','USA','contacted','warm','Website',29000,'2027-02-15',30,52,'Refrigeration','David Williams','2026-04-22 10:40:00','2026-08-05 14:20:00','2026-08-05 14:20:00'),

  -- ============ May 2026 ============
  ('Meredith','Stone','VP Food & Beverage','Stonebridge Resorts','meredith.stone@demo-seed.b3macbis.com','+1-480-555-0426','Hospitality','Scottsdale, AZ','USA','proposal','hot','Referral',320000,'2026-12-05',68,85,'Banquet Kitchen Line','Sarah Mitchell','2026-05-05 09:25:00','2026-09-04 16:50:00','2026-09-04 16:50:00'),
  ('Gary','Holt','Food Services Manager','Pinecrest Retirement Communities','gary.holt@demo-seed.b3macbis.com','+1-916-555-0427','Healthcare','Sacramento, CA','USA','qualified','warm','Email Campaign',143000,'2027-01-20',50,62,'Servery Counters','David Williams','2026-05-12 11:35:00','2026-08-18 09:40:00','2026-08-18 09:40:00'),
  ('Layla','Hassan','Catering Manager','Zaytoon Mediterranean Catering','layla.hassan@demo-seed.b3macbis.com','+1-713-555-0428','Catering','Houston, TX','USA','contacted','warm','Social Media',38000,'2027-02-28',35,55,'Blast Chillers','David Williams','2026-05-19 13:55:00','2026-07-28 10:15:00','2026-07-28 10:15:00'),
  ('Bruce','Callahan','Facilities Manager','Callahan Brewing & Taproom','bruce.callahan@demo-seed.b3macbis.com','+1-412-555-0429','Restaurant','Pittsburgh, PA','USA','contacted','cold','Website',26000,'2027-03-15',25,41,'Refrigeration','David Williams','2026-05-22 15:45:00','2026-06-30 11:20:00','2026-06-30 11:20:00'),
  ('Emma','Fitzgerald','Owner','The Wandering Fork Bistro','emma.fitzgerald@demo-seed.b3macbis.com','+1-912-555-0430','Restaurant','Savannah, GA','USA','new','warm','Website',33000,'2027-03-30',15,48,'Combi Ovens','David Williams','2026-05-28 10:10:00','2026-05-28 10:10:00',NULL),

  -- ============ Jun 2026 ============
  ('Nathan','Cole','Director of Procurement','Beacon Health Network','nathan.cole@demo-seed.b3macbis.com','+1-317-555-0431','Healthcare','Indianapolis, IN','USA','proposal','hot','Webinar',245000,'2026-11-30',66,82,'Dishwashing Systems','Sarah Mitchell','2026-06-02 08:40:00','2026-09-02 14:55:00','2026-09-02 14:55:00'),
  ('Priyanka','Desai','Franchise Operations Manager','Chai & Toast Cafes','priyanka.desai@demo-seed.b3macbis.com','+1-201-555-0432','Franchise','Jersey City, NJ','USA','qualified','warm','Partner',97000,'2027-01-10',50,61,'Espresso Stations','David Williams','2026-06-09 12:15:00','2026-08-26 10:35:00','2026-08-26 10:35:00'),
  ('Wade','Barrett','Executive Chef','Ironwood Smokehouse','wade.barrett@demo-seed.b3macbis.com','+1-816-555-0433','Restaurant','Kansas City, MO','USA','contacted','warm','Trade Show',44000,'2027-02-20',35,57,'Ventilation & Hoods','David Williams','2026-06-16 14:30:00','2026-08-11 16:05:00','2026-08-11 16:05:00'),
  ('Chloe','Martin','Director of Dining','Hillcrest Preparatory School','chloe.martin@demo-seed.b3macbis.com','+1-704-555-0434','Education','Charlotte, NC','USA','new','warm','Email Campaign',76000,'2027-04-10',15,50,'Servery Counters','David Williams','2026-06-23 09:50:00','2026-06-23 09:50:00',NULL),
  ('Tony','Russo','General Manager','Vesuvio Ristorante','tony.russo@demo-seed.b3macbis.com','+1-702-555-0435','Restaurant','Las Vegas, NV','USA','contacted','hot','Referral',58000,'2027-01-25',35,71,'Cook Line Retrofit','Sarah Mitchell','2026-06-26 11:05:00','2026-08-15 13:25:00','2026-08-15 13:25:00'),

  -- ============ Jul 2026 ============
  ('Monica','Vidal','Senior Buyer','Palmetto Hotel Partners','monica.vidal@demo-seed.b3macbis.com','+1-843-555-0436','Hospitality','Charleston, SC','USA','qualified','hot','Trade Show',189000,'2027-02-05',52,73,'Combi Ovens','Sarah Mitchell','2026-07-07 10:25:00','2026-09-01 15:40:00','2026-09-01 15:40:00'),
  ('Derek','Lam','Owner','Lucky Dragon Dim Sum','derek.lam@demo-seed.b3macbis.com','+1-415-555-0437','Restaurant','San Francisco, CA','USA','contacted','warm','Website',31000,'2027-03-05',30,54,'Cook Line Retrofit','David Williams','2026-07-14 13:15:00','2026-08-22 09:30:00','2026-08-22 09:30:00'),
  ('Sandra','Kowalski','Nutrition Services Coordinator','Lakeview Unified Schools','sandra.kowalski@demo-seed.b3macbis.com','+1-716-555-0438','Education','Buffalo, NY','USA','contacted','warm','Email Campaign',112000,'2027-04-01',30,58,'Dishwashing Systems','David Williams','2026-07-17 15:35:00','2026-08-29 11:50:00','2026-08-29 11:50:00'),
  ('Felix','Gruber','F&B Director','Alpenhaus Lodge & Resort','felix.gruber@demo-seed.b3macbis.com','+1-801-555-0439','Hospitality','Salt Lake City, UT','USA','new','hot','Referral',205000,'2027-02-28',20,70,'Banquet Kitchen Line','Sarah Mitchell','2026-07-23 09:00:00','2026-07-23 09:00:00',NULL),
  ('Rachel','Adeyemi','Founder','Lagos Kitchen Collective','rachel.adeyemi@demo-seed.b3macbis.com','+1-404-555-0440','Catering','Atlanta, GA','USA','new','warm','Social Media',27000,'2027-04-20',15,46,'Combi Ovens','David Williams','2026-07-29 14:45:00','2026-07-29 14:45:00',NULL),

  -- ============ Aug 2026 ============
  ('Stephen','Byrne','Director of Operations','Celtic Isle Cruises','stephen.byrne@demo-seed.b3macbis.com','+1-409-555-0441','Cruise','Galveston, TX','USA','qualified','hot','Trade Show',378000,'2027-03-10',55,79,'Full Galley Fitout','Sarah Mitchell','2026-08-04 10:55:00','2026-09-07 16:15:00','2026-09-07 16:15:00'),
  ('Isabella','Moreau','Owner','Patisserie Lumiere','isabella.moreau@demo-seed.b3macbis.com','+1-202-555-0442','Cafe','Washington, DC','USA','contacted','warm','Referral',22000,'2027-03-20',30,53,'Refrigeration','David Williams','2026-08-07 12:05:00','2026-08-27 14:00:00','2026-08-27 14:00:00'),
  ('Aaron','Blackwood','Kitchen Manager','Timberline Ski Resort','aaron.blackwood@demo-seed.b3macbis.com','+1-406-555-0443','Hospitality','Bozeman, MT','USA','contacted','warm','Webinar',91000,'2027-01-05',35,59,'Cook Line Retrofit','David Williams','2026-08-12 09:20:00','2026-09-03 10:40:00','2026-09-03 10:40:00'),
  ('Vanessa','Cruz','Dietary Manager','Mercy Point Hospital','vanessa.cruz@demo-seed.b3macbis.com','+1-915-555-0444','Healthcare','El Paso, TX','USA','new','warm','Website',134000,'2027-05-15',15,56,'Servery Counters','Sarah Mitchell','2026-08-18 11:30:00','2026-08-18 11:30:00',NULL),
  ('Leo','Anderson','Owner','Anderson''s Fish Camp','leo.anderson@demo-seed.b3macbis.com','+1-813-555-0445','Restaurant','Tampa, FL','USA','new','cold','Cold Call',19000,'2027-05-30',10,32,'Ice Machines','David Williams','2026-08-24 13:50:00','2026-08-24 13:50:00',NULL),
  ('Harriet','Vane','Events Director','Willowmere Estate Weddings','harriet.vane@demo-seed.b3macbis.com','+1-207-555-0446','Events','Portland, ME','USA','new','warm','Social Media',47000,'2027-04-30',15,49,'Banquet Kitchen Line','David Williams','2026-08-28 15:10:00','2026-08-28 15:10:00',NULL),

  -- ============ Sep 2026 (through Sep 10) ============
  ('Kenji','Watanabe','COO','Umami Bowl Franchising','kenji.watanabe@demo-seed.b3macbis.com','+1-213-555-0447','Franchise','Los Angeles, CA','USA','contacted','hot','Partner',232000,'2027-02-10',35,75,'Cook Line Retrofit','Sarah Mitchell','2026-09-01 09:10:00','2026-09-08 14:25:00','2026-09-08 14:25:00'),
  ('Bridget','Connolly','Catering Director','Emerald Coast Catering','bridget.connolly@demo-seed.b3macbis.com','+1-850-555-0448','Catering','Pensacola, FL','USA','contacted','warm','Website',36000,'2027-03-25',30,51,'Blast Chillers','David Williams','2026-09-02 10:45:00','2026-09-09 11:15:00','2026-09-09 11:15:00'),
  ('Marcus','Thorne','Director of Facilities','Kingsbridge Boarding School','marcus.thorne@demo-seed.b3macbis.com','+1-518-555-0449','Education','Albany, NY','USA','new','warm','Email Campaign',84000,'2027-05-20',15,47,'Dishwashing Systems','David Williams','2026-09-04 13:30:00','2026-09-04 13:30:00',NULL),
  ('Sofia','Petrov','Owner','Samovar Tea House','sofia.petrov@demo-seed.b3macbis.com','+1-312-555-0450','Cafe','Chicago, IL','USA','new','cold','Social Media',16000,'2027-06-15',10,29,'Espresso Stations','David Williams','2026-09-07 15:20:00','2026-09-07 15:20:00',NULL),
  ('Diego','Ramirez','VP Development','Casa Fuego Restaurant Group','diego.ramirez@demo-seed.b3macbis.com','+1-214-555-0451','Restaurant','Dallas, TX','USA','new','hot','Referral',168000,'2027-03-15',20,72,'Combi Ovens','Sarah Mitchell','2026-09-08 09:40:00','2026-09-08 09:40:00',NULL),
  ('Annie','Lau','Purchasing Manager','Pacific Crest Hotels','annie.lau@demo-seed.b3macbis.com','+1-408-555-0452','Hospitality','San Jose, CA','USA','new','warm','Website',121000,'2027-04-05',15,58,'Banquet Kitchen Line','Sarah Mitchell','2026-09-09 11:55:00','2026-09-09 11:55:00',NULL);
