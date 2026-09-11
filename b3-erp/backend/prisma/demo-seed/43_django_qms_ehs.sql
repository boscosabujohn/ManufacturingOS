-- Demo seed — Django/OptiForge QMS + EHS tables for B3 MACBIS (tenant-scoped).
-- Covers 17 tables (9 QMS, 8 EHS) from optiforge/core/{qms,ehs}/models.py.
-- Story mirrors the NestJS quality demo data (34_quality_logistics.sql):
--   NCR-DEMO themes — bearing lot reject, bore oversize, weld porosity,
--   paint finish complaint, powder-coat defects — in an SS-fabrication /
--   welding / powder-coat kitchen-equipment factory.
--
-- Requires 38_django_foundation.sql (tenancy_tenant anchor + hr_employee
-- EMP0001..EMP0020, whose employee_number values are used as employee_ref).
--
-- Deterministic UUIDs: b343TTNN pattern — 'b3430TTT-0000-4000-8000-0000000000NN'
-- where TTT is a per-table ordinal, so FK links (CAPA->NCR, NCR->QualityCheck,
-- SDS->SDS supersedes) are stable across re-runs.
--
-- Idempotent: every table here is tenant-scoped, so we DELETE by
-- tenant_id = :tenant (children before parents: qms_capa -> qms_ncr ->
-- qms_qualitycheck; ehs_sds self-FK is handled in one statement, checked at
-- statement end). Nothing outside this tenant is touched.
--
-- Note: inspected_by_user_id / approved_by_user_id are free UUID columns
-- (no FK); Django auth_user PKs are integers (9001-9003), so these are left
-- NULL rather than pointing at nonexistent UUID users.

\set tenant '''b3000000-0000-4000-8000-000000000001'''

SET CONSTRAINTS ALL IMMEDIATE;

-- ---------------------------------------------------------------------------
-- Deletes — children first
-- ---------------------------------------------------------------------------
DELETE FROM qms_capa                 WHERE tenant_id = :tenant;  -- refs qms_nonconformancereport
DELETE FROM qms_nonconformancereport WHERE tenant_id = :tenant;  -- refs qms_qualitycheck
DELETE FROM qms_qualitycheck         WHERE tenant_id = :tenant;
DELETE FROM qms_suppliercar          WHERE tenant_id = :tenant;
DELETE FROM qms_spcmeasurement       WHERE tenant_id = :tenant;
DELETE FROM qms_calibrationrecord    WHERE tenant_id = :tenant;
DELETE FROM qms_qualityaudit         WHERE tenant_id = :tenant;
DELETE FROM qms_documentcontrolitem  WHERE tenant_id = :tenant;
DELETE FROM qms_qualitychangecontrol WHERE tenant_id = :tenant;

DELETE FROM ehs_incident             WHERE tenant_id = :tenant;
DELETE FROM ehs_hiraentry            WHERE tenant_id = :tenant;
DELETE FROM ehs_jsa                  WHERE tenant_id = :tenant;
DELETE FROM ehs_ppeallocation        WHERE tenant_id = :tenant;
DELETE FROM ehs_sds                  WHERE tenant_id = :tenant;  -- self-FK, single stmt ok
DELETE FROM ehs_envmonitoringreading WHERE tenant_id = :tenant;
DELETE FROM ehs_trainingrecord       WHERE tenant_id = :tenant;
DELETE FROM ehs_managementofchange   WHERE tenant_id = :tenant;

-- ===========================================================================
-- QMS
-- ===========================================================================

-- qms_qualitycheck — 8 checks: iqc/ipqc/oqc/final mix, pass/fail
-- (check_type: iqc|ipqc|oqc|final; result: pass|fail|pending)
INSERT INTO qms_qualitycheck
  (id, check_type, reference_type, reference_id, item_code, result,
   inspected_at, inspected_by_user_id, measurements, tenant_id)
VALUES
  ('b3430001-0000-4000-8000-000000000001','iqc','grn','GRN-DEMO-0012','RM-SS304-2MM','pass',
   '2025-10-06 10:00:00+05:30',NULL,'{"thickness_mm":2.02,"spec":"1.90-2.10","surface":"Grade A"}',:tenant),
  ('b3430001-0000-4000-8000-000000000002','iqc','grn','GRN-DEMO-0018','BRG-6205-ZZ','fail',
   '2025-11-03 09:30:00+05:30',NULL,'{"radial_play_mm":0.09,"spec_max":0.05,"sampled":28,"rejected":5}',:tenant),
  ('b3430001-0000-4000-8000-000000000003','ipqc','work_order','WO-DEMO-0002','FAB-SINK-BOWL-600','pass',
   '2025-12-11 14:15:00+05:30',NULL,'{"weld_seam_width_mm":6.1,"dye_penetrant":"clear"}',:tenant),
  ('b3430001-0000-4000-8000-000000000004','ipqc','work_order','WO-DEMO-0004','ASSY-DRIVE-SHAFT','fail',
   '2026-05-14 09:15:00+05:30',NULL,'{"visual":"porosity clusters in 6 weld seams","distorted_units":3}',:tenant),
  ('b3430001-0000-4000-8000-000000000005','final','work_order','WO-DEMO-0006','GEARBOX-HSG-M2','fail',
   '2026-03-05 11:00:00+05:30',NULL,'{"bearing_bore_mm":62.08,"spec":"62.00 +0.03/-0.00"}',:tenant),
  ('b3430001-0000-4000-8000-000000000006','final','work_order','WO-DEMO-0007','WORKTABLE-SS-1800','pass',
   '2026-06-20 16:30:00+05:30',NULL,'{"flatness_mm":0.4,"spec_max":0.8,"finish":"brushed 180 grit"}',:tenant),
  ('b3430001-0000-4000-8000-000000000007','oqc','shipment','SHP-DEMO-0009','COMBI-OVEN-STAND','pass',
   '2026-07-28 12:45:00+05:30',NULL,'{"packing":"ok","hardware_kit":"complete","label":"verified"}',:tenant),
  ('b3430001-0000-4000-8000-000000000008','ipqc','work_order','WO-DEMO-0011','PANEL-PC-DOOR','fail',
   '2026-08-19 10:20:00+05:30',NULL,'{"coating_dft_um":38,"spec_min":60,"defect":"orange peel + thin film"}',:tenant);

-- qms_nonconformancereport — 5 NCRs echoing NCR-DEMO themes
-- (status: open|contained|root_caused|closed)
INSERT INTO qms_nonconformancereport
  (id, number, description, status, created_at, quality_check_id, tenant_id)
VALUES
  ('b3430002-0000-4000-8000-000000000001','NCR-DEMO-0001',
   'Ball Bearing 6205 lot rejected at incoming inspection — radial play 0.09mm against 0.05mm max on 5 of 28 samples. Lot quarantined, return to supplier Bharat Metal Works.',
   'closed','2025-11-03 11:00:00+05:30','b3430001-0000-4000-8000-000000000002',:tenant),
  ('b3430002-0000-4000-8000-000000000002','NCR-DEMO-0002',
   'Gearbox housing bearing bore oversize at final inspection — measured 62.08mm against 62.00 +0.03/-0.00. 8 housings affected; rework by sleeving evaluated.',
   'root_caused','2026-03-05 13:30:00+05:30','b3430001-0000-4000-8000-000000000005',:tenant),
  ('b3430002-0000-4000-8000-000000000003','NCR-DEMO-0003',
   'Weld porosity on drive shaft assemblies — in-process inspection found porosity clusters in 6 assemblies and length distortion in 3 on WO-DEMO-0004 weld line.',
   'contained','2026-05-14 12:30:00+05:30','b3430001-0000-4000-8000-000000000004',:tenant),
  ('b3430002-0000-4000-8000-000000000004','NCR-DEMO-0004',
   'Paint finish complaint on Golden Spoon order — field report of flaking paint on serving counter panels within 60 days of installation.',
   'open','2026-04-08 09:00:00+05:30',NULL,:tenant),
  ('b3430002-0000-4000-8000-000000000005','NCR-DEMO-0005',
   'Powder coating defects on PC door panels — dry film thickness 38um against 60um minimum plus orange-peel texture across the batch. Batch held pending re-coat.',
   'open','2026-08-19 11:45:00+05:30','b3430001-0000-4000-8000-000000000008',:tenant);

-- qms_capa — 6 CAPAs linked to NCRs (ncr_id nullable; all 6 linked here,
-- NCR-DEMO-0003 carries two CAPAs: containment/rework + systemic weld control)
-- (status: open|in_progress|verified|closed)
INSERT INTO qms_capa
  (id, number, root_cause, corrective_action, preventive_action, status,
   target_close_date, ncr_id, tenant_id)
VALUES
  ('b3430003-0000-4000-8000-000000000001','CAPA-DEMO-0001',
   'Supplier Bharat Metal Works changed bearing sub-vendor without notification; incoming lot from unqualified source.',
   'Return rejected lot; 100% inspection of next 3 lots at supplier cost.',
   'Add sub-vendor change-notification clause to supplier quality agreement; requalify supplier annually.',
   'closed','2025-12-20','b3430002-0000-4000-8000-000000000001',:tenant),
  ('b3430003-0000-4000-8000-000000000002','CAPA-DEMO-0002',
   'Boring bar insert wear not tracked; tool-life counter reset skipped during shift handover.',
   'Sleeve and re-bore 8 affected housings; scrap 2 beyond rework limit.',
   'Introduce tool-life tracking sheet at CNC boring station; add bore check to first-off approval.',
   'in_progress','2026-04-30','b3430002-0000-4000-8000-000000000002',:tenant),
  ('b3430003-0000-4000-8000-000000000003','CAPA-DEMO-0003',
   'Argon shielding gas flow meter reading 8 LPM against 14 LPM required; welder recently rotated onto GTAW line without requalification.',
   'Gouge and re-weld porosity per WPS-07; straighten distorted shafts and re-inspect 100%.',
   'Requalify welder to WPS-07; add daily gas-flow verification to weld line startup checklist.',
   'in_progress','2026-07-15','b3430002-0000-4000-8000-000000000003',:tenant),
  ('b3430003-0000-4000-8000-000000000004','CAPA-DEMO-0004',
   'Systemic: no periodic calibration of gas flow meters on any of the 4 GTAW stations.',
   'Calibrate all gas flow meters; verify last 30 days of weld production by sampling.',
   'Add gas flow meters to the calibration master list with 6-month cycle.',
   'verified','2026-08-10','b3430002-0000-4000-8000-000000000003',:tenant),
  ('b3430003-0000-4000-8000-000000000005','CAPA-DEMO-0005',
   'Wet-paint system used on high-touch counter panels where powder coat was specified; surface prep skipped degreasing step.',
   'Strip and re-coat affected Golden Spoon panels on site; issue service credit.',
   'Route all coated-finish drawings through coating-spec review; lock paint system selection in the router.',
   'open','2026-09-30','b3430002-0000-4000-8000-000000000004',:tenant),
  ('b3430003-0000-4000-8000-000000000006','CAPA-DEMO-0006',
   'Powder booth gun voltage drifted low and conveyor speed increased after maintenance, reducing film build.',
   'Re-coat held batch; verify DFT on 100% of re-coated panels.',
   'Add post-maintenance first-article DFT check before releasing powder line to production.',
   'open','2026-10-15','b3430002-0000-4000-8000-000000000005',:tenant);

-- qms_suppliercar — 3 SCARs (status: issued|supplier_acknowledged|closed)
INSERT INTO qms_suppliercar
  (id, number, supplier_code, description, status, tenant_id)
VALUES
  ('b3430004-0000-4000-8000-000000000001','SCAR-DEMO-0001','BHARAT-METAL-WORKS',
   'Bearing 6205 lot rejection (NCR-DEMO-0001): unauthorized sub-vendor change. Root cause analysis and corrective action plan required within 15 days.','closed',:tenant),
  ('b3430004-0000-4000-8000-000000000002','SCAR-DEMO-0002','SHREE-COATINGS',
   'Outsourced powder-coat batches showing inconsistent film build (35-70um across a single panel). Provide process capability data and control plan for DFT.','supplier_acknowledged',:tenant),
  ('b3430004-0000-4000-8000-000000000003','SCAR-DEMO-0003','ACCUFAST-FASTENERS',
   'M6 SS fasteners with mixed grades (A2/A4) in single packing; two GRNs affected. Segregation and grade-marking verification process required.','issued',:tenant);

-- qms_spcmeasurement — 10 points on 2 characteristics
-- WELD-SEAM-WIDTH-MM (spec 5.5-6.5) and TOP-THICKNESS-MM (spec 1.90-2.10);
-- one out-of-spec point each to light up SPC alerts.
INSERT INTO qms_spcmeasurement
  (id, characteristic, value, lower_spec, upper_spec, measured_at, tenant_id)
VALUES
  ('b3430005-0000-4000-8000-000000000001','WELD-SEAM-WIDTH-MM',5.9500,5.5000,6.5000,'2026-05-04 09:00:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000002','WELD-SEAM-WIDTH-MM',6.1200,5.5000,6.5000,'2026-05-18 09:00:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000003','WELD-SEAM-WIDTH-MM',6.0400,5.5000,6.5000,'2026-06-01 09:00:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000004','WELD-SEAM-WIDTH-MM',6.6800,5.5000,6.5000,'2026-06-15 09:00:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000005','WELD-SEAM-WIDTH-MM',6.2100,5.5000,6.5000,'2026-06-29 09:00:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000006','TOP-THICKNESS-MM',2.0200,1.9000,2.1000,'2026-07-06 10:30:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000007','TOP-THICKNESS-MM',1.9800,1.9000,2.1000,'2026-07-20 10:30:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000008','TOP-THICKNESS-MM',2.0500,1.9000,2.1000,'2026-08-03 10:30:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000009','TOP-THICKNESS-MM',1.8700,1.9000,2.1000,'2026-08-17 10:30:00+05:30',:tenant),
  ('b3430005-0000-4000-8000-000000000010','TOP-THICKNESS-MM',2.0100,1.9000,2.1000,'2026-08-31 10:30:00+05:30',:tenant);

-- qms_calibrationrecord — 6 instruments (calipers, torque wrenches, CMM, micrometer)
INSERT INTO qms_calibrationrecord
  (id, instrument_code, calibrated_on, next_due_on, certificate_document_id, tenant_id)
VALUES
  ('b3430006-0000-4000-8000-000000000001','CAL-VCAL-001','2025-11-12','2026-11-12',NULL,:tenant),  -- Digital vernier caliper 0-150mm, weld shop
  ('b3430006-0000-4000-8000-000000000002','CAL-VCAL-002','2026-02-08','2027-02-08',NULL,:tenant),  -- Digital vernier caliper 0-300mm, final inspection
  ('b3430006-0000-4000-8000-000000000003','CAL-TWRN-001','2025-12-05','2026-06-05',NULL,:tenant),  -- Torque wrench 10-60Nm, assembly (overdue — recall list demo)
  ('b3430006-0000-4000-8000-000000000004','CAL-TWRN-002','2026-06-22','2026-12-22',NULL,:tenant),  -- Torque wrench 20-110Nm, assembly
  ('b3430006-0000-4000-8000-000000000005','CAL-CMM-001','2026-01-15','2027-01-15',NULL,:tenant),   -- CMM bridge type, standards room
  ('b3430006-0000-4000-8000-000000000006','CAL-MICR-001','2026-08-02','2027-02-02',NULL,:tenant);  -- Digital micrometer 0-25mm, machine shop

-- qms_qualityaudit — 4 audits, one of each type
-- (audit_type: internal|supplier|customer|regulatory; status: planned|in_progress|reported|closed)
INSERT INTO qms_qualityaudit
  (id, audit_type, scheduled_date, scope, status, tenant_id)
VALUES
  ('b3430007-0000-4000-8000-000000000001','internal','2026-02-10',
   'ISO 9001 internal audit — fabrication, welding and final inspection processes; focus on weld porosity NCR trend and calibration recall compliance.','closed',:tenant),
  ('b3430007-0000-4000-8000-000000000002','supplier','2026-04-22',
   'On-site audit of SHREE-COATINGS powder-coat line: pretreatment, booth controls, DFT measurement practice and batch traceability.','reported',:tenant),
  ('b3430007-0000-4000-8000-000000000003','customer','2026-07-15',
   'Blue Fig Hotels Group second-party audit ahead of banquet-kitchen fitout award: hygiene-grade SS fabrication, weld finish standards, material certs.','in_progress',:tenant),
  ('b3430007-0000-4000-8000-000000000004','regulatory','2026-10-05',
   'BIS surveillance audit for IS 14756 compliance of commercial kitchen equipment line.','planned',:tenant);

-- qms_documentcontrolitem — 4 controlled documents (unique tenant+code+rev)
INSERT INTO qms_documentcontrolitem
  (id, code, title, rev, effective_from, supersedes_id, document_store_id, tenant_id)
VALUES
  ('b3430008-0000-4000-8000-000000000001','SOP-QC-001','Incoming Inspection Procedure — Raw Material and Bought-outs','C','2025-10-15',NULL,NULL,:tenant),
  ('b3430008-0000-4000-8000-000000000002','WPS-07','Welding Procedure Specification — GTAW SS304/SS316 Sheet','B','2026-01-05',NULL,NULL,:tenant),
  ('b3430008-0000-4000-8000-000000000003','WI-PC-003','Work Instruction — Powder Coating DFT Measurement and Recording','A','2026-06-01',NULL,NULL,:tenant),
  ('b3430008-0000-4000-8000-000000000004','SOP-CAL-002','Calibration Control Procedure — Master List and Recall','B','2026-03-20',NULL,NULL,:tenant);

-- qms_qualitychangecontrol — 3 change controls (status: draft|approved|implemented|rejected)
INSERT INTO qms_qualitychangecontrol
  (id, number, description, status, tenant_id)
VALUES
  ('b3430009-0000-4000-8000-000000000001','QCC-DEMO-0001',
   'Revise WPS-07 to add mandatory shielding-gas flow verification at shift start and after any torch maintenance (outcome of CAPA-DEMO-0003/0004).','implemented',:tenant),
  ('b3430009-0000-4000-8000-000000000002','QCC-DEMO-0002',
   'Change incoming sampling plan for bearing lots from AQL 1.0 to AQL 0.65 with tightened switching rules after NCR-DEMO-0001.','approved',:tenant),
  ('b3430009-0000-4000-8000-000000000003','QCC-DEMO-0003',
   'Introduce first-article DFT approval gate on powder line after every maintenance intervention (linked to CAPA-DEMO-0006).','draft',:tenant);

-- ===========================================================================
-- EHS — SS fabrication / welding / powder-coat factory context
-- ===========================================================================

-- ehs_incident — 6 incidents (severity: near_miss|first_aid|recordable|lti|fatality;
-- status: reported|investigating|closed)
INSERT INTO ehs_incident
  (id, number, occurred_at, location, severity, description, status, tenant_id)
VALUES
  ('b3430010-0000-4000-8000-000000000001','INC-DEMO-0001','2025-10-21 15:40:00+05:30',
   'Sheet metal shop — shearing bay','near_miss',
   'SS304 sheet slipped off forklift tines during transfer to shear; landed clear of walkway. No injury. Load-securing strap was not used.','closed',:tenant),
  ('b3430010-0000-4000-8000-000000000002','INC-DEMO-0002','2025-12-09 11:10:00+05:30',
   'Fabrication — grinding station 2','first_aid',
   'Operator sustained minor forearm abrasion from grinding spark burn-through of worn sleeve. First aid administered; sleeve replacement stock reviewed.','closed',:tenant),
  ('b3430010-0000-4000-8000-000000000003','INC-DEMO-0003','2026-02-17 09:25:00+05:30',
   'Weld shop — GTAW station 3','first_aid',
   'Arc-eye (photokeratitis) reported by helper assisting without welding screen in place. Eye wash and rest advised; screens repositioned.','closed',:tenant),
  ('b3430010-0000-4000-8000-000000000004','INC-DEMO-0004','2026-05-06 14:55:00+05:30',
   'Powder coat plant — oven area','near_miss',
   'LPG smell detected near curing oven manifold; line evacuated and isolated. Loose compression fitting found and re-torqued. Gas detection interlock verified.','investigating',:tenant),
  ('b3430010-0000-4000-8000-000000000005','INC-DEMO-0005','2026-07-23 10:35:00+05:30',
   'Assembly — worktable line','recordable',
   'Deep laceration to left palm from unfinished SS edge while manually flipping a worktable top; 4 sutures. Edge-breaking step missing from router for this SKU.','investigating',:tenant),
  ('b3430010-0000-4000-8000-000000000006','INC-DEMO-0006','2026-08-28 16:20:00+05:30',
   'Stores — solvent cabinet','near_miss',
   'Thinner container found unsealed inside flammables cabinet with damaged cap; vapours noted on opening. Container disposed, stock caps inspected.','reported',:tenant);

-- ehs_hiraentry — 6 rows (likelihood/severity 1-5; controls jsonb list)
INSERT INTO ehs_hiraentry
  (id, activity, hazard, likelihood, severity, controls, tenant_id)
VALUES
  ('b3430011-0000-4000-8000-000000000001','GTAW welding of SS sinks and counters','Metal fume and ozone exposure; arc radiation',3,4,
   '["Local exhaust ventilation at each station","Welding screens and shade-11 helmets","Fume extraction filter change schedule","Hexavalent chrome awareness training"]',:tenant),
  ('b3430011-0000-4000-8000-000000000002','Angle grinding and polishing of SS fabrications','Flying particles, sparks, wheel burst',4,3,
   '["Face shield over safety goggles","Guard integrity check at issue","Ring test for new wheels","Flame-retardant sleeves and apron"]',:tenant),
  ('b3430011-0000-4000-8000-000000000003','Powder coating and oven curing','Combustible powder cloud; LPG fired oven fire/explosion',2,5,
   '["ATEX-rated booth extraction and earthing","LPG gas detection with oven interlock","Hot work permit for maintenance","Daily booth housekeeping to prevent powder accumulation"]',:tenant),
  ('b3430011-0000-4000-8000-000000000004','Forklift movement of sheet stock and finished goods','Struck-by / crush injury to pedestrians',3,5,
   '["Segregated pedestrian walkways","Speed limit 5 km/h with reverse alarm","Load securing straps mandatory","Licensed operators only, annual refresher"]',:tenant),
  ('b3430011-0000-4000-8000-000000000005','Hydraulic shearing and press brake operation','Amputation / caught-between at point of operation',2,5,
   '["Light curtain on press brake","Two-hand control on shear","LOTO for die change","Daily guard function check"]',:tenant),
  ('b3430011-0000-4000-8000-000000000006','Working at height during ducting and hood installation','Fall from ladder or scaffold above 2m',3,4,
   '["Full body harness with double lanyard","Scaffold inspection tag system","Work-at-height permit","Trained standby spotter"]',:tenant);

-- ehs_jsa — 4 job safety analyses (steps jsonb: [{step, hazards, controls}])
INSERT INTO ehs_jsa
  (id, job_title, steps, approved_by_user_id, approved_at, tenant_id)
VALUES
  ('b3430012-0000-4000-8000-000000000001','GTAW welding — sink bowl seam welding',
   '[{"step":"Set up torch, verify argon flow 14 LPM","hazards":["gas leak","incorrect flow"],"controls":["flow meter check","leak spray test"]},{"step":"Tack and seam weld bowl to counter","hazards":["arc radiation","fume exposure"],"controls":["shade-11 helmet","LEV positioned within 300mm"]},{"step":"Post-weld cleaning and passivation","hazards":["acid contact"],"controls":["nitrile gauntlets","face shield","eye wash station nearby"]}]',
   NULL,'2026-01-20 10:00:00+05:30',:tenant),
  ('b3430012-0000-4000-8000-000000000002','Powder booth deep clean and filter change',
   '[{"step":"Isolate booth power and LPG supply","hazards":["unexpected startup","gas release"],"controls":["LOTO on booth panel and gas valve"]},{"step":"Vacuum powder accumulation","hazards":["combustible dust cloud"],"controls":["ATEX vacuum only, no compressed air","earth bonding"]},{"step":"Replace cartridge filters","hazards":["dust inhalation","manual handling"],"controls":["P2 respirator","two-person lift"]}]',
   NULL,'2026-03-14 15:30:00+05:30',:tenant),
  ('b3430012-0000-4000-8000-000000000003','Press brake die change',
   '[{"step":"LOTO hydraulic system","hazards":["stored energy","unexpected stroke"],"controls":["lock and tag both isolation points","bleed pressure"]},{"step":"Remove and stage dies","hazards":["crush from die weight","sharp edges"],"controls":["die cart with retention pins","cut-resistant gloves"]},{"step":"Install and align new die, test stroke","hazards":["caught-between during jog"],"controls":["two-hand jog control","no hands past guard line"]}]',
   NULL,'2026-05-08 09:45:00+05:30',:tenant),
  ('b3430012-0000-4000-8000-000000000004','Exhaust hood installation at customer site (work at height)',
   '[{"step":"Erect and tag mobile scaffold","hazards":["scaffold collapse","falling objects"],"controls":["competent-person inspection","barricade drop zone"]},{"step":"Hoist hood sections","hazards":["load swing, struck-by"],"controls":["tag lines","rated slings, check SWL"]},{"step":"Fix hood and connect ducting","hazards":["fall from height","sharp duct edges"],"controls":["harness clipped 100%","edge protection on cut duct"]}]',
   NULL,NULL,:tenant);  -- pending approval

-- ehs_ppeallocation — 10 issues to hr_employee employee_number refs
INSERT INTO ehs_ppeallocation
  (id, employee_ref, ppe_code, issued_at, size, tenant_id)
VALUES
  ('b3430013-0000-4000-8000-000000000001','EMP0020','PPE-WELD-HELMET-S11','2025-10-10 09:00:00+05:30','Universal',:tenant),  -- Ganesh Patil, welder
  ('b3430013-0000-4000-8000-000000000002','EMP0020','PPE-WELD-GAUNTLET','2025-10-10 09:05:00+05:30','L',:tenant),
  ('b3430013-0000-4000-8000-000000000003','EMP0019','PPE-SAFETY-SHOES-ST','2025-11-02 10:30:00+05:30','9',:tenant),           -- Ramesh Yadav
  ('b3430013-0000-4000-8000-000000000004','EMP0014','PPE-SAFETY-GOGGLES','2025-12-15 11:15:00+05:30','Universal',:tenant),   -- Lakshmi Iyer
  ('b3430013-0000-4000-8000-000000000005','EMP0009','PPE-RESPIRATOR-P2','2026-02-03 09:40:00+05:30','M',:tenant),            -- Deepak Joshi, powder line
  ('b3430013-0000-4000-8000-000000000006','EMP0010','PPE-EAR-PLUGS-25DB','2026-03-11 14:00:00+05:30','Universal',:tenant),   -- Ravi Menon, shearing
  ('b3430013-0000-4000-8000-000000000007','EMP0013','PPE-CUT-GLOVES-L5','2026-04-24 10:10:00+05:30','L',:tenant),            -- Mohan Das, assembly
  ('b3430013-0000-4000-8000-000000000008','EMP0018','PPE-FACE-SHIELD','2026-06-05 15:20:00+05:30','Universal',:tenant),      -- Pooja Mehta, grinding
  ('b3430013-0000-4000-8000-000000000009','EMP0008','PPE-FR-SLEEVE','2026-07-17 09:50:00+05:30','M',:tenant),                -- Kiran Reddy, inspection near weld
  ('b3430013-0000-4000-8000-000000000010','EMP0020','PPE-HARNESS-2LAN','2026-08-21 08:30:00+05:30','Universal',:tenant);     -- site installation work

-- ehs_sds — 5 substances; SDS-THN rev supersession pair kept within the 5
-- (parent old rev + child new rev inserted in one statement; FK checked at
-- statement end so ordering inside VALUES is safe)
INSERT INTO ehs_sds
  (id, substance_code, substance_name, hazard_class, sds_document_id, issued_on, supersedes_id, tenant_id)
VALUES
  ('b3430014-0000-4000-8000-000000000001','HAZ-ARGON','Argon (compressed shielding gas)','Compressed Gas',NULL,'2025-10-05',NULL,:tenant),
  ('b3430014-0000-4000-8000-000000000002','HAZ-THN-R1','Cellulose Thinner (rev 1)','Flammable Liquid Cat 2',NULL,'2025-10-05',NULL,:tenant),
  ('b3430014-0000-4000-8000-000000000003','HAZ-THN-R2','Cellulose Thinner (rev 2, GHS update)','Flammable Liquid Cat 2',NULL,'2026-06-12','b3430014-0000-4000-8000-000000000002',:tenant),
  ('b3430014-0000-4000-8000-000000000004','HAZ-PWDR-EP','Epoxy-Polyester Powder Coat RAL 9016','Combustible Dust; Skin Sens 1',NULL,'2026-01-18',NULL,:tenant),
  ('b3430014-0000-4000-8000-000000000005','HAZ-LPG','Liquefied Petroleum Gas (oven fuel)','Flammable Gas Cat 1',NULL,'2026-02-25',NULL,:tenant);

-- ehs_envmonitoringreading — 12 readings: noise dB(A), VOC ppm, PM10 ug/m3,
-- monthly-ish spread; one noise and one VOC exceedance flagged.
INSERT INTO ehs_envmonitoringreading
  (id, parameter, value, unit, recorded_at, limit_value, is_exceedance, tenant_id)
VALUES
  ('b3430015-0000-4000-8000-000000000001','NOISE-SHEAR-BAY',82.4000,'dBA','2025-10-15 11:00:00+05:30',85.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000002','NOISE-SHEAR-BAY',84.1000,'dBA','2026-01-15 11:00:00+05:30',85.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000003','NOISE-SHEAR-BAY',87.6000,'dBA','2026-04-15 11:00:00+05:30',85.0000,true,:tenant),
  ('b3430015-0000-4000-8000-000000000004','NOISE-SHEAR-BAY',83.2000,'dBA','2026-07-15 11:00:00+05:30',85.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000005','VOC-PAINT-AREA',38.5000,'ppm','2025-11-20 14:30:00+05:30',100.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000006','VOC-PAINT-AREA',52.0000,'ppm','2026-02-20 14:30:00+05:30',100.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000007','VOC-PAINT-AREA',112.3000,'ppm','2026-05-20 14:30:00+05:30',100.0000,true,:tenant),
  ('b3430015-0000-4000-8000-000000000008','VOC-PAINT-AREA',44.8000,'ppm','2026-08-20 14:30:00+05:30',100.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000009','PM10-WELD-SHOP',61.0000,'ug/m3','2025-12-10 10:00:00+05:30',100.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000010','PM10-WELD-SHOP',74.5000,'ug/m3','2026-03-10 10:00:00+05:30',100.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000011','PM10-WELD-SHOP',68.2000,'ug/m3','2026-06-10 10:00:00+05:30',100.0000,false,:tenant),
  ('b3430015-0000-4000-8000-000000000012','PM10-WELD-SHOP',59.9000,'ug/m3','2026-09-08 10:00:00+05:30',100.0000,false,:tenant);

-- ehs_trainingrecord — 8 records against hr_employee employee_number refs
INSERT INTO ehs_trainingrecord
  (id, employee_ref, course_code, completed_on, expires_on, tenant_id)
VALUES
  ('b3430016-0000-4000-8000-000000000001','EMP0020','EHS-WELD-SAFETY','2025-10-20','2027-10-20',:tenant),
  ('b3430016-0000-4000-8000-000000000002','EMP0009','EHS-POWDER-ATEX','2025-11-14','2027-11-14',:tenant),
  ('b3430016-0000-4000-8000-000000000003','EMP0010','EHS-FORKLIFT-OPR','2025-12-18','2026-12-18',:tenant),
  ('b3430016-0000-4000-8000-000000000004','EMP0013','EHS-FIRST-AID','2026-01-22','2028-01-22',:tenant),
  ('b3430016-0000-4000-8000-000000000005','EMP0019','EHS-FIRE-WARDEN','2026-03-05','2027-03-05',:tenant),
  ('b3430016-0000-4000-8000-000000000006','EMP0014','EHS-LOTO','2026-04-16','2027-04-16',:tenant),
  ('b3430016-0000-4000-8000-000000000007','EMP0018','EHS-WORK-AT-HEIGHT','2026-06-09','2027-06-09',:tenant),
  ('b3430016-0000-4000-8000-000000000008','EMP0008','EHS-HAZMAT-HANDLING','2026-08-12','2027-08-12',:tenant);

-- ehs_managementofchange — 3 MoCs (status: draft|review|approved|implemented|rejected)
-- hira_reference_id points at the seeded HIRA rows above (free UUID, no FK)
INSERT INTO ehs_managementofchange
  (id, number, title, change_summary, hira_reference_id, status, tenant_id)
VALUES
  ('b3430017-0000-4000-8000-000000000001','MOC-DEMO-0001','Switch grinding wheels to ceramic abrasive',
   'Replace aluminium-oxide grinding wheels with ceramic abrasive across fabrication to cut grinding time and spark volume; requires updated wheel-speed check and revised PPE assessment.',
   'b3430011-0000-4000-8000-000000000002','implemented',:tenant),
  ('b3430017-0000-4000-8000-000000000002','MOC-DEMO-0002','Add second LPG curing oven to powder line',
   'Install second LPG-fired curing oven to debottleneck powder coat plant; extends gas manifold, adds detection heads and a new oven interlock loop; fire-load recalculation needed.',
   'b3430011-0000-4000-8000-000000000003','review',:tenant),
  ('b3430017-0000-4000-8000-000000000003','MOC-DEMO-0003','Night-shift forklift operation in FG store',
   'Introduce forklift movements on night shift for dispatch loading; requires lighting survey, revised pedestrian segregation and additional licensed operators.',
   'b3430011-0000-4000-8000-000000000004','draft',:tenant);
