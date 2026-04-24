-- Postgres schema initialisation for ManufacturingOS (ADR-0004).
-- One physical database, two logical schemas; Django owns `optiforge.*`,
-- NestJS owns `b3_erp.*`. Cross-schema reads via views are allowed; writes are not.
--
-- This file runs exactly once, on first-init of the postgres container volume.
-- To re-run: `docker-compose down -v` (deletes the volume), then `up` again.

CREATE SCHEMA IF NOT EXISTS optiforge;
CREATE SCHEMA IF NOT EXISTS b3_erp;

-- Default search_path puts the most-used schema first for each backend.
-- Each backend overrides this via its own connection settings (search_path
-- in DATABASES for Django, schema option on TypeORM DataSource for NestJS).

COMMENT ON SCHEMA optiforge IS 'OptiForge (Django) — platform + core + modes + compliance + packs. See ADR-0004.';
COMMENT ON SCHEMA b3_erp   IS 'b3-erp (NestJS) — 29 domain services. See ADR-0004.';
