-- Demo seed — CRM (customers + leads) for B3 MACBIS.
-- companyId anchors to core_companies row b3000000-0000-4000-8000-000000000001.
-- Idempotent: clears this company's demo rows first, then re-inserts.
\set company '''b3000000-0000-4000-8000-000000000001'''

DELETE FROM crm_customers WHERE "companyId" = :company;
INSERT INTO crm_customers
  ("companyId", "customerName", industry, "contactPerson", phone, email, status, segment,
   location, region, "accountManager", "creditLimit", "paymentTerms", "totalOrders", "lifetimeValue")
VALUES
  (:company,'Harbour Grill Restaurants','Hospitality','Marcus Lee','+1-415-555-0110','marcus@harbourgrill.com','Active','Enterprise','San Francisco, CA','West','Sarah Mitchell',250000,'Net 30',42,1875000),
  (:company,'Blue Fig Hotels Group','Hospitality','Amelia Torres','+1-212-555-0132','amelia@bluefighotels.com','Active','Enterprise','New York, NY','East','Sarah Mitchell',500000,'Net 45',67,3120000),
  (:company,'Campus Dining Co-op','Education','Raj Patel','+1-617-555-0155','raj@campusdining.edu','Active','Mid-Market','Boston, MA','East','David Williams',120000,'Net 30',23,640000),
  (:company,'Summit Catering Services','Catering','Nina Alvarez','+1-303-555-0178','nina@summitcatering.com','Active','Mid-Market','Denver, CO','West','David Williams',90000,'Net 15',31,510000),
  (:company,'Metro Hospital Kitchens','Healthcare','Dr. Karen Ng','+1-312-555-0193','karen@metrohospital.org','Active','Enterprise','Chicago, IL','Central','Sarah Mitchell',300000,'Net 60',18,980000),
  (:company,'Riverside Bistro Chain','Hospitality','Tom Becker','+1-206-555-0201','tom@riversidebistro.com','Prospect','SMB','Seattle, WA','West','David Williams',40000,'Net 30',5,72000),
  (:company,'Golden Spoon Franchises','Franchise','Priya Shah','+1-480-555-0214','priya@goldenspoon.com','Active','Enterprise','Phoenix, AZ','West','Sarah Mitchell',420000,'Net 45',54,2450000),
  (:company,'Lakeside Resort & Spa','Hospitality','Henrik Olsen','+1-305-555-0227','henrik@lakesideresort.com','Active','Mid-Market','Miami, FL','East','David Williams',180000,'Net 30',29,1130000);

DELETE FROM crm_leads WHERE company IN (
  'Coastal Eats','Peak Performance Gyms','Urban Roast Coffee','Fairview School District',
  'Silverline Cruises','Green Valley Farms Cafe','Nexus Coworking','Bayside Convention Center');
INSERT INTO crm_leads
  ("firstName","lastName",title,company,email,phone,industry,city,country,status,rating,
   "leadSource","estimatedValue","leadScore","productInterest")
VALUES
  ('Olivia','Grant','Head of Operations','Coastal Eats','olivia@coastaleats.com','+1-415-555-0301','Hospitality','San Diego, CA','USA','new','hot','Website',85000,78,'Combi Ovens'),
  ('Daniel','Wu','Facilities Manager','Peak Performance Gyms','daniel@peakgyms.com','+1-212-555-0312','Fitness','Newark, NJ','USA','contacted','warm','Trade Show',42000,61,'Blast Chillers'),
  ('Sophia','Rossi','Owner','Urban Roast Coffee','sophia@urbanroast.com','+1-503-555-0323','Cafe','Portland, OR','USA','qualified','hot','Referral',28000,72,'Espresso Stations'),
  ('James','Carter','Procurement Lead','Fairview School District','james@fairviewsd.edu','+1-617-555-0334','Education','Cambridge, MA','USA','new','warm','Email Campaign',150000,68,'Dishwashing Systems'),
  ('Mia','Nakamura','F&B Director','Silverline Cruises','mia@silverlinecruises.com','+1-305-555-0345','Cruise','Fort Lauderdale, FL','USA','contacted','hot','Website',320000,88,'Full Galley Fitout'),
  ('Ethan','Brooks','Cafe Manager','Green Valley Farms Cafe','ethan@greenvalleycafe.com','+1-720-555-0356','Cafe','Boulder, CO','USA','new','cold','Social Media',18000,40,'Refrigeration'),
  ('Ava','Lindqvist','Operations Head','Nexus Coworking','ava@nexuscowork.com','+1-206-555-0367','Coworking','Seattle, WA','USA','qualified','warm','Partner',55000,65,'Pantry Kitchens'),
  ('Noah','Feldman','GM','Bayside Convention Center','noah@baysideconvention.com','+1-312-555-0378','Events','Chicago, IL','USA','contacted','hot','Trade Show',410000,90,'Banquet Kitchen Line');
