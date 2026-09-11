-- Demo seed — named users for B3 MACBIS, created in BOTH auth stores.
--   Ayushi.Gupta@OptiForge.com  — admin rights
--   Didiya.Sujith@OptiForge.com — general user rights
--   Sabu.John@OptiForge.com     — Finance/Production/Stores roles
-- Passwords were provided out-of-band; only one-way hashes are stored here.
-- NestJS store: it_users (bcrypt; username = full email because auth
-- validateUser matches the username column exactly) + it_roles/it_user_roles.
-- Django store: auth_user (pbkdf2, ids 9004-9006) + groups + tenant membership.
-- Idempotent: deletes scoped to these three emails / the DEMO- role codes.
\set company '''b3000000-0000-4000-8000-000000000001'''
SET CONSTRAINTS ALL IMMEDIATE;

-- ============ NestJS: it_users + roles ============

-- Functional roles for Sabu (STORES = inventory module in it_permissions terms)
DELETE FROM it_user_roles WHERE "userId" IN (SELECT id FROM it_users WHERE email IN
  ('Ayushi.Gupta@OptiForge.com','Didiya.Sujith@OptiForge.com','Sabu.John@OptiForge.com'));
DELETE FROM it_role_permissions WHERE "roleId" IN (SELECT id FROM it_roles WHERE code IN ('FINANCE','PRODUCTION','STORES'));
DELETE FROM it_roles WHERE code IN ('FINANCE','PRODUCTION','STORES');
INSERT INTO it_roles (id, code, name, description, "roleType", status, "hierarchyLevel", "createdBy", "createdAt", "updatedAt") VALUES
  ('de460000-0000-4000-8000-000000000001','FINANCE','Finance','Full finance-module access incl. approvals','Custom','Active',3,'demo-seed','2026-09-11 09:00:00','2026-09-11 09:00:00'),
  ('de460000-0000-4000-8000-000000000002','PRODUCTION','Production','Full production-module access','Custom','Active',3,'demo-seed','2026-09-11 09:00:00','2026-09-11 09:00:00'),
  ('de460000-0000-4000-8000-000000000003','STORES','Stores','Inventory/stores access incl. logistics visibility','Custom','Active',3,'demo-seed','2026-09-11 09:00:00','2026-09-11 09:00:00');

INSERT INTO it_role_permissions ("roleId", "permissionId", "isGranted", "grantedBy", "createdAt", "updatedAt")
SELECT r.id, p.id, true, 'demo-seed', now(), now()
FROM it_roles r
JOIN it_permissions p ON (
  (r.code = 'FINANCE'    AND p.code IN ('FINANCE_VIEW','FINANCE_CREATE','FINANCE_EDIT','FINANCE_APPROVE','REPORTS_VIEW','REPORTS_EXPORT')) OR
  (r.code = 'PRODUCTION' AND p.code IN ('PRODUCTION_VIEW','PRODUCTION_CREATE','PRODUCTION_EDIT','QUALITY_VIEW','REPORTS_VIEW')) OR
  (r.code = 'STORES'     AND p.code IN ('INVENTORY_VIEW','INVENTORY_CREATE','INVENTORY_EDIT','LOGISTICS_VIEW','REPORTS_VIEW'))
)
WHERE r.code IN ('FINANCE','PRODUCTION','STORES');

DELETE FROM it_users WHERE email IN
  ('Ayushi.Gupta@OptiForge.com','Didiya.Sujith@OptiForge.com','Sabu.John@OptiForge.com');
INSERT INTO it_users (id, username, email, "passwordHash", "firstName", "lastName", "fullName",
                      "userType", status, "isSystemAdmin", department, designation, "createdAt", "updatedAt") VALUES
  ('de460000-0000-4000-8000-000000000011','Ayushi.Gupta@OptiForge.com','Ayushi.Gupta@OptiForge.com',
   '$2a$10$UmKY3tZ3hTy6NwNoyARUceDhiksOWo.eNJScXB6Sp/u095h2P07f.',
   'Ayushi','Gupta','Ayushi Gupta','Internal','Active',true,'Management','System Administrator','2026-09-11 09:00:00','2026-09-11 09:00:00'),
  ('de460000-0000-4000-8000-000000000012','Didiya.Sujith@OptiForge.com','Didiya.Sujith@OptiForge.com',
   '$2a$10$ecpLfVUB7mBfCtnOBKSng.Go8cuQcWwC5vKejJ4LS2bziEZCoYhMe',
   'Didiya','Sujith','Didiya Sujith','Internal','Active',false,'Operations','Executive','2026-09-11 09:00:00','2026-09-11 09:00:00'),
  ('de460000-0000-4000-8000-000000000013','Sabu.John@OptiForge.com','Sabu.John@OptiForge.com',
   '$2a$10$ezngVyPJ4/oEbg.HSAd3KO/exPXGTszSGEBdcXb6956W4GaZpbisi',
   'Sabu','John','Sabu John','Internal','Active',false,'Finance','Finance Controller','2026-09-11 09:00:00','2026-09-11 09:00:00');

INSERT INTO it_user_roles ("userId", "roleId", status, "isPrimary", "assignedBy", "assignedAt", "createdAt", "updatedAt")
SELECT u.id, r.id, 'Active', m.is_primary, 'demo-seed', now(), now(), now()
FROM (VALUES
  ('Ayushi.Gupta@OptiForge.com','ADMIN',      true),
  ('Didiya.Sujith@OptiForge.com','OPERATOR',  true),
  ('Sabu.John@OptiForge.com','FINANCE',       true),
  ('Sabu.John@OptiForge.com','PRODUCTION',    false),
  ('Sabu.John@OptiForge.com','STORES',        false)
) AS m(email, role_code, is_primary)
JOIN it_users u ON u.email = m.email
JOIN it_roles r ON r.code = m.role_code;

-- ============ Django: auth_user + groups + tenant membership ============

DELETE FROM identity_tenantmembership WHERE user_id IN (9004,9005,9006);
DELETE FROM auth_user_groups WHERE user_id IN (9004,9005,9006);
DELETE FROM auth_user WHERE id IN (9004,9005,9006);
INSERT INTO auth_user (id, password, last_login, is_superuser, username, first_name, last_name, email, is_staff, is_active, date_joined) VALUES
  (9004,'pbkdf2_sha256$600000$SGMCdqBSU7j6hm9HoT3bAM$gKVst/GiUE+Uo+iE9/fLLNFJvb9hadA8qCO9L9p97ww=',NULL,true,
   'Ayushi.Gupta@OptiForge.com','Ayushi','Gupta','Ayushi.Gupta@OptiForge.com',true,true,'2026-09-11 09:00:00+00'),
  (9005,'pbkdf2_sha256$600000$2ugQpnVBCP2ZMNtR23XyNd$86eqzCTZDczJzi8zsgHwBaODQvA7LVY+IqNr25db6KU=',NULL,false,
   'Didiya.Sujith@OptiForge.com','Didiya','Sujith','Didiya.Sujith@OptiForge.com',false,true,'2026-09-11 09:00:00+00'),
  (9006,'pbkdf2_sha256$600000$rkf6Iv0rzexaRyFiZnLT2j$JaWMp5+YZksMenu6rjG9LKpaUD3r4GmD8Bi9WOCBtUs=',NULL,false,
   'Sabu.John@OptiForge.com','Sabu','John','Sabu.John@OptiForge.com',false,true,'2026-09-11 09:00:00+00');

-- Production (9004) and Stores (9005) groups; Finance (9003) exists from file 38
DELETE FROM auth_group_permissions WHERE group_id IN (9004,9005);
DELETE FROM auth_group WHERE id IN (9004,9005);
INSERT INTO auth_group (id, name) VALUES (9004,'Production'), (9005,'Stores');
INSERT INTO auth_group_permissions (group_id, permission_id)
SELECT g.gid, p.id FROM (VALUES (9004), (9005)) AS g(gid)
JOIN auth_permission p ON p.content_type_id IN (
  SELECT ct.id FROM django_content_type ct
  WHERE (g.gid = 9004 AND ct.app_label IN ('production_planning','mes'))
     OR (g.gid = 9005 AND ct.app_label IN ('inventory','wms'))
);

INSERT INTO auth_user_groups (user_id, group_id) VALUES
  (9004, 9001),            -- Ayushi -> Admins
  (9005, 9002),            -- Didiya -> Operations
  (9006, 9003),            -- Sabu -> Finance
  (9006, 9004),            -- Sabu -> Production
  (9006, 9005);            -- Sabu -> Stores

INSERT INTO identity_tenantmembership (id, role, created_at, tenant_id, user_id, is_delegated_admin) VALUES
  ('de460000-0000-4000-8000-000000000021','tenant_admin','2026-09-11 09:00:00+00',:company,9004,true),
  ('de460000-0000-4000-8000-000000000022','user','2026-09-11 09:00:00+00',:company,9005,false),
  ('de460000-0000-4000-8000-000000000023','manager','2026-09-11 09:00:00+00',:company,9006,false);
