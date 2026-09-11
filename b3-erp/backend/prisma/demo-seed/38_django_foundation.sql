-- Demo seed — Django/OptiForge platform FOUNDATION tables for B3 MACBIS.
-- Seeds the 14 tables every other Django table FKs into:
--   tenancy_tenant, tenancy_tenantpackactivation, extensions_packregistry,
--   auth_group, auth_group_permissions, auth_user, auth_user_groups,
--   auth_user_user_permissions, identity_abacpolicy, identity_mfaconfig,
--   identity_tenantmembership, hr_department, hr_employee, hr_roleassignment
-- Tenant anchors to the same UUID as the NestJS core_companies anchor row.
-- Idempotent: clears this tenant's demo rows first (children before parents),
-- then re-inserts. Delete predicates:
--   * tenant-scoped tables ........ tenant_id = :tenant
--   * auth_user ................... username IN ('admin','demo','sarah.mitchell')
--   * auth_group .................. name IN ('Admins','Operations','Finance')
--   * link tables ................. via subselect on the above usernames/group names
--   * extensions_packregistry ..... pack_id = 'kitchen-equipment' (global + tenant rows)
--   * hr_employee ................. employee numbers mirrored from NestJS hr_employees
-- Django FKs are DEFERRABLE INITIALLY DEFERRED; force immediate checking so a
-- BEGIN/ROLLBACK validation run still exercises every FK (no-op outside a txn).
SET CONSTRAINTS ALL IMMEDIATE;

\set tenant '''b3000000-0000-4000-8000-000000000001'''

-- ---------------------------------------------------------------------------
-- Deletes — children first
-- ---------------------------------------------------------------------------

-- hr_roleassignment: by tenant
DELETE FROM hr_roleassignment WHERE tenant_id = :tenant;
-- hr_employee: by tenant
DELETE FROM hr_employee WHERE tenant_id = :tenant;
-- hr_department: by tenant
DELETE FROM hr_department WHERE tenant_id = :tenant;
-- identity_mfaconfig: by owning demo usernames
DELETE FROM identity_mfaconfig WHERE user_id IN
  (SELECT id FROM auth_user WHERE username IN ('admin','demo','sarah.mitchell'));
-- identity_tenantmembership: by tenant
DELETE FROM identity_tenantmembership WHERE tenant_id = :tenant;
-- identity_abacpolicy: by tenant
DELETE FROM identity_abacpolicy WHERE tenant_id = :tenant;
-- auth_user_user_permissions / auth_user_groups: by demo usernames
DELETE FROM auth_user_user_permissions WHERE user_id IN
  (SELECT id FROM auth_user WHERE username IN ('admin','demo','sarah.mitchell'));
DELETE FROM auth_user_groups WHERE user_id IN
  (SELECT id FROM auth_user WHERE username IN ('admin','demo','sarah.mitchell'));
-- auth_group_permissions: by demo group names
DELETE FROM auth_group_permissions WHERE group_id IN
  (SELECT id FROM auth_group WHERE name IN ('Admins','Operations','Finance'));
-- auth_user: by demo usernames
DELETE FROM auth_user WHERE username IN ('admin','demo','sarah.mitchell');
-- auth_group: by demo group names
DELETE FROM auth_group WHERE name IN ('Admins','Operations','Finance');
-- tenancy_tenantpackactivation: by tenant
DELETE FROM tenancy_tenantpackactivation WHERE tenant_id = :tenant;
-- extensions_packregistry: by pack_id (covers global row with tenant_id NULL
-- and the per-tenant activation row)
DELETE FROM extensions_packregistry WHERE pack_id = 'kitchen-equipment';
-- tenancy_tenant: the anchor row itself
DELETE FROM tenancy_tenant WHERE id = :tenant;

-- ---------------------------------------------------------------------------
-- tenancy_tenant — ONE tenant, B3 MACBIS (status choices: provisioning|active|
-- suspended|archived per optiforge.platform.tenancy.models.Tenant)
-- ---------------------------------------------------------------------------
INSERT INTO tenancy_tenant (id, name, status, created_at, updated_at) VALUES
  (:tenant, 'B3 MACBIS', 'active',
   '2025-10-01 08:00:00+00', '2026-09-10 07:30:00+00');

-- ---------------------------------------------------------------------------
-- extensions_packregistry — KitchenEquipment pack manifest
-- (tenant_id NULL = global registration; tenant_id set = per-tenant activation)
-- Manifest mirrors backend/optiforge/packs/kitchen_equipment/manifest.py
-- ---------------------------------------------------------------------------
INSERT INTO extensions_packregistry
  (id, pack_id, name, version, manifest, tenant_id, is_active, created_at, updated_at)
VALUES
  ('b3ec0000-0000-4000-8000-000000000001', 'kitchen-equipment', 'KitchenEquipment', '0.1.0',
   '{"id": "kitchen-equipment", "name": "KitchenEquipment", "version": "0.1.0", "depends_on": {"modes": ["eto"], "core_version_range": ">=0.1.0,<1.0.0"}, "extends": {"integrations": {"boq_import": {"parser": "optiforge.packs.kitchen_equipment.parsers.boq_parser"}}, "entities": {"Item": {"fascia_type": {"type": "string", "required": true}, "cladding_type": {"type": "string", "required": true}}}}}'::jsonb,
   NULL, false, '2025-10-01 08:05:00+00', '2025-10-01 08:05:00+00'),
  ('b3ec0000-0000-4000-8000-000000000002', 'kitchen-equipment', 'KitchenEquipment', '0.1.0',
   '{"id": "kitchen-equipment", "name": "KitchenEquipment", "version": "0.1.0", "depends_on": {"modes": ["eto"], "core_version_range": ">=0.1.0,<1.0.0"}, "extends": {"integrations": {"boq_import": {"parser": "optiforge.packs.kitchen_equipment.parsers.boq_parser"}}, "entities": {"Item": {"fascia_type": {"type": "string", "required": true}, "cladding_type": {"type": "string", "required": true}}}}}'::jsonb,
   :tenant, true, '2025-10-02 09:00:00+00', '2025-10-02 09:00:00+00');

-- ---------------------------------------------------------------------------
-- tenancy_tenantpackactivation — KitchenEquipment active for B3 MACBIS
-- ---------------------------------------------------------------------------
INSERT INTO tenancy_tenantpackactivation
  (id, pack_id, pack_version, is_active, activated_at, deactivated_at, tenant_id)
VALUES
  ('b3ac0000-0000-4000-8000-000000000001', 'kitchen-equipment', '0.1.0', true,
   '2025-10-02 09:00:00+00', NULL, :tenant);

-- ---------------------------------------------------------------------------
-- auth_group — fixed ids >= 9000 (identity is GENERATED BY DEFAULT)
-- ---------------------------------------------------------------------------
INSERT INTO auth_group (id, name) VALUES
  (9001, 'Admins'),
  (9002, 'Operations'),
  (9003, 'Finance');

-- ---------------------------------------------------------------------------
-- auth_group_permissions — reference existing auth_permission rows by
-- (app_label, codename) subselect (532 rows already seeded by migrations)
-- ---------------------------------------------------------------------------
INSERT INTO auth_group_permissions (group_id, permission_id)
SELECT g.gid, p.id
FROM (VALUES
        (9001, 'crm',                 'add_lead'),
        (9001, 'crm',                 'change_lead'),
        (9001, 'crm',                 'delete_lead'),
        (9001, 'crm',                 'view_lead'),
        (9001, 'hr',                  'add_employee'),
        (9001, 'hr',                  'change_employee'),
        (9001, 'hr',                  'view_employee'),
        (9001, 'finance',             'view_glentry'),
        (9002, 'crm',                 'view_lead'),
        (9002, 'hr',                  'view_employee'),
        (9002, 'production_planning', 'view_workorder'),
        (9003, 'finance',             'add_glentry'),
        (9003, 'finance',             'change_glentry'),
        (9003, 'finance',             'view_glentry'),
        (9003, 'finance',             'add_arinvoice'),
        (9003, 'finance',             'view_arinvoice'),
        (9003, 'finance',             'view_apinvoice')
     ) AS g (gid, app_label, codename)
JOIN django_content_type ct ON ct.app_label = g.app_label
JOIN auth_permission p       ON p.content_type_id = ct.id AND p.codename = g.codename;

-- ---------------------------------------------------------------------------
-- auth_user — 3 users, fixed ids >= 9000; password is pbkdf2_sha256 of
-- 'Demo@1234' (generated with Django's make_password)
-- ---------------------------------------------------------------------------
INSERT INTO auth_user
  (id, password, last_login, is_superuser, username, first_name, last_name,
   email, is_staff, is_active, date_joined)
VALUES
  (9001, 'pbkdf2_sha256$600000$LYHEKFwdpjSLGVQskkpXt7$w+PdS+wNeP8qWvo/9XojAHucxlBUHSA2klw/vmP9htI=',
   '2026-09-10 06:45:00+00', true,  'admin',          'System', 'Admin',
   'admin@b3macbis.com', true,  true, '2025-10-01 08:10:00+00'),
  (9002, 'pbkdf2_sha256$600000$LYHEKFwdpjSLGVQskkpXt7$w+PdS+wNeP8qWvo/9XojAHucxlBUHSA2klw/vmP9htI=',
   '2026-09-09 14:20:00+00', false, 'demo',           'Demo',   'User',
   'demo@b3macbis.com',  false, true, '2025-10-15 10:00:00+00'),
  (9003, 'pbkdf2_sha256$600000$LYHEKFwdpjSLGVQskkpXt7$w+PdS+wNeP8qWvo/9XojAHucxlBUHSA2klw/vmP9htI=',
   '2026-09-08 11:05:00+00', false, 'sarah.mitchell', 'Sarah',  'Mitchell',
   'sarah.mitchell@b3macbis.com', false, true, '2025-11-03 09:30:00+00');

-- ---------------------------------------------------------------------------
-- auth_user_groups — admin→Admins, demo→Operations, sarah→Operations+Finance
-- ---------------------------------------------------------------------------
INSERT INTO auth_user_groups (user_id, group_id) VALUES
  (9001, 9001),
  (9002, 9002),
  (9003, 9002),
  (9003, 9003);

-- ---------------------------------------------------------------------------
-- auth_user_user_permissions — a few direct grants on top of group perms
-- ---------------------------------------------------------------------------
INSERT INTO auth_user_user_permissions (user_id, permission_id)
SELECT u.uid, p.id
FROM (VALUES
        (9003, 'crm', 'add_lead'),
        (9003, 'crm', 'change_lead'),
        (9002, 'hr',  'view_employee')
     ) AS u (uid, app_label, codename)
JOIN django_content_type ct ON ct.app_label = u.app_label
JOIN auth_permission p       ON p.content_type_id = ct.id AND p.codename = u.codename;

-- ---------------------------------------------------------------------------
-- identity_tenantmembership — role choices: super_admin|tenant_admin|manager|user
-- ---------------------------------------------------------------------------
INSERT INTO identity_tenantmembership
  (id, role, created_at, tenant_id, user_id, is_delegated_admin)
VALUES
  ('b3ae0000-0000-4000-8000-000000000001', 'tenant_admin', '2025-10-01 08:15:00+00', :tenant, 9001, true),
  ('b3ae0000-0000-4000-8000-000000000002', 'user',         '2025-10-15 10:05:00+00', :tenant, 9002, false),
  ('b3ae0000-0000-4000-8000-000000000003', 'manager',      '2025-11-03 09:35:00+00', :tenant, 9003, false);

-- ---------------------------------------------------------------------------
-- identity_abacpolicy — 3 policies (effect: allow|deny)
-- ---------------------------------------------------------------------------
INSERT INTO identity_abacpolicy
  (id, name, description, resource_type, action, conditions, effect, priority,
   is_active, created_at, tenant_id)
VALUES
  ('b3ab0000-0000-4000-8000-000000000001',
   'Tenant admin full access',
   'Tenant admins may perform any action on any resource within the tenant.',
   '*', '*', '{"user_role": "tenant_admin"}'::jsonb, 'allow', 100, true,
   '2025-10-01 08:20:00+00', :tenant),
  ('b3ab0000-0000-4000-8000-000000000002',
   'Managers view finance GL',
   'Managers and above may view general-ledger entries.',
   'finance.glentry', 'view',
   '{"user_role_in": ["manager", "tenant_admin", "super_admin"]}'::jsonb,
   'allow', 50, true, '2026-01-12 11:00:00+00', :tenant),
  ('b3ab0000-0000-4000-8000-000000000003',
   'Deny HR salary export to regular users',
   'Regular users may not export employee salary data.',
   'hr.employee', 'export', '{"user_role": "user"}'::jsonb, 'deny', 10, true,
   '2026-04-20 15:30:00+00', :tenant);

-- ---------------------------------------------------------------------------
-- identity_mfaconfig — TOTP enabled for admin
-- ---------------------------------------------------------------------------
INSERT INTO identity_mfaconfig
  (id, is_enabled, totp_secret, backup_codes, created_at, user_id)
VALUES
  ('b3fa0000-0000-4000-8000-000000000001', true,
   'JBSWY3DPEHPK3PXPJBSWY3DPEHPK3PXP',
   '["84931-20475", "17362-99841", "55210-73648", "90417-16205", "38754-61092"]'::jsonb,
   '2025-10-05 12:00:00+00', 9001);

-- ---------------------------------------------------------------------------
-- hr_department — 8 departments mirroring the NestJS hr_departments names
-- (unique per tenant on code)
-- ---------------------------------------------------------------------------
INSERT INTO hr_department (id, code, name, parent_id, tenant_id) VALUES
  ('b3d10000-0000-4000-8000-000000000001', 'MGMT',   'Management',             NULL, :tenant),
  ('b3d10000-0000-4000-8000-000000000002', 'HR',     'Human Resources',        NULL, :tenant),
  ('b3d10000-0000-4000-8000-000000000003', 'FIN',    'Finance & Accounts',     NULL, :tenant),
  ('b3d10000-0000-4000-8000-000000000004', 'SLS',    'Sales & Marketing',      NULL, :tenant),
  ('b3d10000-0000-4000-8000-000000000005', 'PROD',   'Production',             NULL, :tenant),
  ('b3d10000-0000-4000-8000-000000000006', 'QC',     'Quality Control',        NULL, :tenant),
  ('b3d10000-0000-4000-8000-000000000007', 'STORES', 'Stores & Inventory',     NULL, :tenant),
  ('b3d10000-0000-4000-8000-000000000008', 'IT',     'Information Technology', NULL, :tenant);

-- ---------------------------------------------------------------------------
-- hr_employee — MIRROR the 20 NestJS hr_employees rows (INSERT..SELECT).
-- Deterministic id derived from employeeCode (EMP0001 -> ...000000000001);
-- department matched by name against the 8 Django departments (employees in
-- Maintenance / Dispatch & Logistics get NULL department_id — column is
-- nullable); job_title from hr_designations; created_at spread from
-- 2025-10-01 by 3 days per employee ordinal.
-- ---------------------------------------------------------------------------
INSERT INTO hr_employee
  (id, employee_number, first_name, last_name, email, job_title, hire_date,
   is_active, user_id, created_at, department_id, tenant_id)
SELECT
  ('b3e10000-0000-4000-8000-' || lpad(substring(e."employeeCode" from 4), 12, '0'))::uuid,
  e."employeeCode",
  e."firstName",
  e."lastName",
  coalesce(e."companyEmail", e."personalEmail",
           lower(e."firstName" || '.' || e."lastName") || '@b3macbis.com'),
  coalesce(dg.title, 'Staff'),
  e."joiningDate",
  (e.status::text = 'Active'),
  NULL,
  timestamptz '2025-10-01 09:00:00+00'
    + (substring(e."employeeCode" from 4)::int * interval '3 days'),
  dd.id,
  :tenant
FROM hr_employees e
LEFT JOIN hr_departments  sd ON sd.id = e."departmentId"
LEFT JOIN hr_designations dg ON dg.id = e."designationId"
LEFT JOIN hr_department   dd ON dd.name = sd.name AND dd.tenant_id = :tenant
ORDER BY e."employeeCode";

-- ---------------------------------------------------------------------------
-- hr_roleassignment — role codes for key employees (employee via
-- employee_number subselect so ids stay reliable)
-- ---------------------------------------------------------------------------
INSERT INTO hr_roleassignment
  (id, role_code, effective_from, effective_to, employee_id, tenant_id)
SELECT r.rid::uuid, r.role_code, r.eff_from::date, NULL, emp.id, :tenant
FROM (VALUES
        ('b3ea0000-0000-4000-8000-000000000001', 'CEO',                'EMP0001', '2025-10-01'),
        ('b3ea0000-0000-4000-8000-000000000002', 'HR_MANAGER',         'EMP0003', '2025-11-01'),
        ('b3ea0000-0000-4000-8000-000000000003', 'FINANCE_CONTROLLER', 'EMP0005', '2025-12-01'),
        ('b3ea0000-0000-4000-8000-000000000004', 'PRODUCTION_HEAD',    'EMP0007', '2026-01-15'),
        ('b3ea0000-0000-4000-8000-000000000005', 'QC_LEAD',            'EMP0011', '2026-03-01')
     ) AS r (rid, role_code, emp_no, eff_from)
JOIN hr_employee emp
  ON emp.employee_number = r.emp_no AND emp.tenant_id = :tenant;
