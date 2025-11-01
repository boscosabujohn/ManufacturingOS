import { MigrationInterface, QueryRunner } from 'typeorm';

export class ProjectManagementSchema1727462400000 implements MigrationInterface {
  name = 'ProjectManagementSchema1727462400000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE "pm_project_types" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "code" varchar(50) UNIQUE,
        "name" varchar(150) NOT NULL,
        "description" text,
        "workflow_config" jsonb,
        "default_settings" jsonb,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now()
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_project_templates" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_type_id" uuid,
        "code" varchar(50),
        "name" varchar(150) NOT NULL,
        "description" text,
        "scope" text,
        "metadata" jsonb,
        "version" integer NOT NULL DEFAULT 1,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_project_templates_type" FOREIGN KEY ("project_type_id") REFERENCES "pm_project_types"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_pm_project_templates_type_name" ON "pm_project_templates" ("project_type_id", "name")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_projects" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_type_id" uuid,
        "template_id" uuid,
        "code" varchar(50) UNIQUE,
        "name" varchar(200) NOT NULL,
        "description" text,
        "status" varchar(30) NOT NULL DEFAULT 'draft',
        "stage" varchar(100),
        "priority" varchar(20) NOT NULL DEFAULT 'medium',
        "health_status" varchar(20) NOT NULL DEFAULT 'on_track',
        "start_date" date,
        "end_date" date,
        "baseline_start_date" date,
        "baseline_end_date" date,
        "actual_start_date" date,
        "actual_end_date" date,
        "estimated_hours" numeric(10,2),
        "actual_hours" numeric(10,2),
        "budget_total" numeric(14,2),
        "currency" char(3),
        "client_id" uuid,
        "client_name" varchar(200),
        "project_manager_id" uuid,
        "sponsor_id" uuid,
        "department" varchar(150),
        "business_unit" varchar(150),
        "location" varchar(255),
        "tags" text[],
        "custom_fields" jsonb,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_projects_status" CHECK ("status" IN ('draft','planned','in_progress','on_hold','completed','closed','cancelled')),
        CONSTRAINT "CHK_pm_projects_priority" CHECK ("priority" IN ('low','medium','high','critical')),
        CONSTRAINT "CHK_pm_projects_health" CHECK ("health_status" IN ('on_track','at_risk','delayed')),
        CONSTRAINT "FK_pm_projects_type" FOREIGN KEY ("project_type_id") REFERENCES "pm_project_types"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_pm_projects_template" FOREIGN KEY ("template_id") REFERENCES "pm_project_templates"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pm_projects_type" ON "pm_projects" ("project_type_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_pm_projects_manager" ON "pm_projects" ("project_manager_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_pm_projects_status" ON "pm_projects" ("status")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_project_members" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "member_id" uuid,
        "member_type" varchar(30) NOT NULL DEFAULT 'user',
        "role" varchar(100),
        "responsibility" text,
        "allocation_percent" numeric(5,2),
        "is_primary" boolean NOT NULL DEFAULT false,
        "start_date" date,
        "end_date" date,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_project_members_type" CHECK ("member_type" IN ('user','external','vendor')),
        CONSTRAINT "FK_pm_project_members_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_pm_project_members_unique" ON "pm_project_members" ("project_id", "member_id", COALESCE("role", ''))
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_milestone_templates" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_type_id" uuid,
        "name" varchar(150) NOT NULL,
        "description" text,
        "sequence" integer,
        "default_duration_days" integer,
        "metadata" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_milestone_templates_type" FOREIGN KEY ("project_type_id") REFERENCES "pm_project_types"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_project_milestones" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "template_id" uuid,
        "name" varchar(150) NOT NULL,
        "description" text,
        "sequence" integer,
        "planned_start_date" date,
        "planned_end_date" date,
        "baseline_start_date" date,
        "baseline_end_date" date,
        "actual_start_date" date,
        "actual_end_date" date,
        "status" varchar(30) NOT NULL DEFAULT 'planned',
        "owner_id" uuid,
        "completion_percentage" numeric(5,2),
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_project_milestones_status" CHECK ("status" IN ('planned','in_progress','completed','delayed','cancelled')),
        CONSTRAINT "FK_pm_project_milestones_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_project_milestones_template" FOREIGN KEY ("template_id") REFERENCES "pm_milestone_templates"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pm_project_milestones_project" ON "pm_project_milestones" ("project_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_resources" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "resource_type" varchar(30) NOT NULL,
        "external_ref" varchar(100),
        "name" varchar(150) NOT NULL,
        "email" varchar(150),
        "phone" varchar(50),
        "department" varchar(150),
        "title" varchar(150),
        "cost_rate" numeric(12,2),
        "billing_rate" numeric(12,2),
        "currency" char(3),
        "capacity_hours_per_week" numeric(5,2),
        "skills" text[],
        "tags" text[],
        "metadata" jsonb,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_resources_type" CHECK ("resource_type" IN ('human','equipment','material','subcontractor'))
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pm_resources_type" ON "pm_resources" ("resource_type")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_project_tasks" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "milestone_id" uuid,
        "parent_id" uuid,
        "wbs_code" varchar(100),
        "sequence" integer,
        "name" varchar(200) NOT NULL,
        "description" text,
        "task_type" varchar(30) NOT NULL DEFAULT 'task',
        "status" varchar(30) NOT NULL DEFAULT 'not_started',
        "priority" varchar(20) NOT NULL DEFAULT 'medium',
        "stage" varchar(100),
        "start_date" date,
        "end_date" date,
        "baseline_start_date" date,
        "baseline_end_date" date,
        "actual_start_date" date,
        "actual_end_date" date,
        "estimated_hours" numeric(10,2),
        "actual_hours" numeric(10,2),
        "progress_percent" numeric(5,2),
        "cost_estimate" numeric(14,2),
        "cost_actual" numeric(14,2),
        "owner_id" uuid,
        "notes" text,
        "custom_fields" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_project_tasks_type" CHECK ("task_type" IN ('task','milestone','deliverable','phase')),
        CONSTRAINT "CHK_pm_project_tasks_status" CHECK ("status" IN ('not_started','in_progress','completed','blocked','cancelled')),
        CONSTRAINT "CHK_pm_project_tasks_priority" CHECK ("priority" IN ('low','medium','high','critical')),
        CONSTRAINT "FK_pm_project_tasks_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_project_tasks_milestone" FOREIGN KEY ("milestone_id") REFERENCES "pm_project_milestones"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_pm_project_tasks_parent" FOREIGN KEY ("parent_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pm_project_tasks_project" ON "pm_project_tasks" ("project_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_pm_project_tasks_parent" ON "pm_project_tasks" ("parent_id")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_pm_project_tasks_status" ON "pm_project_tasks" ("status")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_task_dependencies" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "task_id" uuid NOT NULL,
        "depends_on_task_id" uuid NOT NULL,
        "dependency_type" varchar(5) NOT NULL DEFAULT 'FS',
        "lag_days" integer NOT NULL DEFAULT 0,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_task_dependencies_type" CHECK ("dependency_type" IN ('FS','FF','SS','SF')),
        CONSTRAINT "FK_pm_task_dependencies_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_task_dependencies_depends" FOREIGN KEY ("depends_on_task_id") REFERENCES "pm_project_tasks"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_pm_task_dependencies_unique" ON "pm_task_dependencies" ("task_id", "depends_on_task_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_task_assignments" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "task_id" uuid NOT NULL,
        "resource_id" uuid,
        "member_id" uuid,
        "role" varchar(100),
        "allocation_percent" numeric(5,2),
        "planned_hours" numeric(10,2),
        "actual_hours" numeric(10,2),
        "start_date" date,
        "end_date" date,
        "is_primary" boolean NOT NULL DEFAULT false,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_task_assignments_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_task_assignments_resource" FOREIGN KEY ("resource_id") REFERENCES "pm_resources"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pm_task_assignments_task" ON "pm_task_assignments" ("task_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_resource_allocations" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "resource_id" uuid NOT NULL,
        "task_id" uuid,
        "allocation_type" varchar(20) NOT NULL DEFAULT 'planned',
        "start_date" date,
        "end_date" date,
        "allocation_percent" numeric(5,2),
        "committed_hours" numeric(10,2),
        "cost_rate_override" numeric(12,2),
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_resource_allocations_type" CHECK ("allocation_type" IN ('planned','actual','tentative')),
        CONSTRAINT "FK_pm_resource_allocations_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_resource_allocations_resource" FOREIGN KEY ("resource_id") REFERENCES "pm_resources"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_resource_allocations_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pm_resource_allocations_project" ON "pm_resource_allocations" ("project_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_resource_utilization_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "resource_id" uuid NOT NULL,
        "project_id" uuid,
        "task_id" uuid,
        "log_date" date NOT NULL,
        "planned_hours" numeric(10,2),
        "actual_hours" numeric(10,2),
        "utilization_percent" numeric(5,2),
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_resource_utilization_resource" FOREIGN KEY ("resource_id") REFERENCES "pm_resources"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_resource_utilization_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_pm_resource_utilization_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_pm_resource_utilization_unique" ON "pm_resource_utilization_logs" ("resource_id", "log_date", COALESCE("project_id", '00000000-0000-0000-0000-000000000000'))
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_deliverables" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "task_id" uuid,
        "code" varchar(50),
        "name" varchar(200) NOT NULL,
        "description" text,
        "deliverable_type" varchar(50),
        "status" varchar(30) NOT NULL DEFAULT 'planned',
        "due_date" date,
        "completed_date" date,
        "owner_id" uuid,
        "acceptance_criteria" text,
        "quality_score" numeric(5,2),
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_deliverables_status" CHECK ("status" IN ('planned','in_progress','submitted','accepted','rejected')),
        CONSTRAINT "FK_pm_deliverables_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_deliverables_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_budgets" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "version" integer NOT NULL DEFAULT 1,
        "name" varchar(150) NOT NULL,
        "status" varchar(30) NOT NULL DEFAULT 'draft',
        "total_amount" numeric(14,2),
        "baseline_amount" numeric(14,2),
        "currency" char(3),
        "approved_by" uuid,
        "approved_at" TIMESTAMPTZ,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_budgets_status" CHECK ("status" IN ('draft','submitted','approved','rejected','closed')),
        CONSTRAINT "FK_pm_budgets_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_pm_budgets_version" ON "pm_budgets" ("project_id", "version")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_budget_line_items" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "budget_id" uuid NOT NULL,
        "category" varchar(30) NOT NULL,
        "sub_category" varchar(100),
        "description" text,
        "cost_code" varchar(50),
        "planned_amount" numeric(14,2),
        "actual_amount" numeric(14,2),
        "variance_amount" numeric(14,2),
        "quantity" numeric(14,2),
        "unit_cost" numeric(14,2),
        "unit_of_measure" varchar(50),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_budget_line_items_category" CHECK ("category" IN ('labor','material','equipment','subcontractor','overhead','contingency','other')),
        CONSTRAINT "FK_pm_budget_line_items_budget" FOREIGN KEY ("budget_id") REFERENCES "pm_budgets"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_cost_entries" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "task_id" uuid,
        "budget_line_item_id" uuid,
        "category" varchar(30),
        "description" text,
        "amount" numeric(14,2) NOT NULL,
        "currency" char(3),
        "cost_date" date NOT NULL,
        "vendor" varchar(150),
        "invoice_reference" varchar(100),
        "billable" boolean NOT NULL DEFAULT false,
        "approved_by" uuid,
        "approved_at" TIMESTAMPTZ,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_cost_entries_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_cost_entries_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_pm_cost_entries_budget_line" FOREIGN KEY ("budget_line_item_id") REFERENCES "pm_budget_line_items"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_project_profitability" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "period_start" date,
        "period_end" date,
        "planned_cost" numeric(14,2),
        "actual_cost" numeric(14,2),
        "planned_revenue" numeric(14,2),
        "actual_revenue" numeric(14,2),
        "planned_margin" numeric(14,2),
        "actual_margin" numeric(14,2),
        "variance_amount" numeric(14,2),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_project_profitability_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_issues" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "task_id" uuid,
        "issue_code" varchar(50),
        "title" varchar(200) NOT NULL,
        "description" text,
        "category" varchar(100),
        "severity" varchar(20) NOT NULL DEFAULT 'medium',
        "priority" varchar(20) NOT NULL DEFAULT 'medium',
        "status" varchar(20) NOT NULL DEFAULT 'open',
        "impact_area" varchar(100),
        "reported_by" uuid,
        "assigned_to" uuid,
        "identified_date" date,
        "due_date" date,
        "resolved_date" date,
        "resolution_summary" text,
        "root_cause" text,
        "tags" text[],
        "custom_fields" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_issues_severity" CHECK ("severity" IN ('low','medium','high','critical')),
        CONSTRAINT "CHK_pm_issues_priority" CHECK ("priority" IN ('low','medium','high','urgent')),
        CONSTRAINT "CHK_pm_issues_status" CHECK ("status" IN ('open','in_progress','resolved','closed','on_hold')),
        CONSTRAINT "FK_pm_issues_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_issues_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE INDEX "IDX_pm_issues_project" ON "pm_issues" ("project_id")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_issue_updates" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "issue_id" uuid NOT NULL,
        "update_type" varchar(30) NOT NULL DEFAULT 'comment',
        "old_status" varchar(20),
        "new_status" varchar(20),
        "update_text" text,
        "updated_by" uuid,
        "progress_percent" numeric(5,2),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_issue_updates_type" CHECK ("update_type" IN ('comment','status_change','attachment','work_log')),
        CONSTRAINT "FK_pm_issue_updates_issue" FOREIGN KEY ("issue_id") REFERENCES "pm_issues"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_change_orders" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "change_number" varchar(50),
        "title" varchar(200) NOT NULL,
        "description" text,
        "category" varchar(100),
        "status" varchar(20) NOT NULL DEFAULT 'draft',
        "requested_by" uuid,
        "requested_date" date,
        "approved_by" uuid,
        "approved_date" date,
        "effective_date" date,
        "reason" text,
        "schedule_impact_days" integer,
        "cost_impact" numeric(14,2),
        "currency" char(3),
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_change_orders_status" CHECK ("status" IN ('draft','submitted','approved','rejected','implemented','closed')),
        CONSTRAINT "FK_pm_change_orders_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_pm_change_orders_project_number" ON "pm_change_orders" ("project_id", COALESCE("change_number", ''))
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_change_order_line_items" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "change_order_id" uuid NOT NULL,
        "budget_line_item_id" uuid,
        "category" varchar(30),
        "description" text,
        "estimated_amount" numeric(14,2),
        "actual_amount" numeric(14,2),
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_change_order_line_items_change" FOREIGN KEY ("change_order_id") REFERENCES "pm_change_orders"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_change_order_line_items_budget" FOREIGN KEY ("budget_line_item_id") REFERENCES "pm_budget_line_items"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_documents" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "task_id" uuid,
        "document_type" varchar(100),
        "title" varchar(200) NOT NULL,
        "description" text,
        "file_name" varchar(255),
        "file_extension" varchar(20),
        "file_size" bigint,
        "storage_url" text,
        "version" integer NOT NULL DEFAULT 1,
        "uploaded_by" uuid,
        "uploaded_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "tags" text[],
        "metadata" jsonb,
        "is_active" boolean NOT NULL DEFAULT true,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_documents_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_documents_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_document_versions" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "document_id" uuid NOT NULL,
        "version_number" integer NOT NULL,
        "file_name" varchar(255),
        "storage_url" text,
        "file_size" bigint,
        "checksum" varchar(100),
        "uploaded_by" uuid,
        "uploaded_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "change_summary" text,
        "metadata" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_document_versions_document" FOREIGN KEY ("document_id") REFERENCES "pm_documents"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_pm_document_versions_unique" ON "pm_document_versions" ("document_id", "version_number")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_progress_updates" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "task_id" uuid,
        "update_date" date NOT NULL,
        "status_summary" text,
        "progress_percent" numeric(5,2),
        "completed_work" text,
        "planned_work" text,
        "blockers" text,
        "risks" text,
        "submitted_by" uuid,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_progress_updates_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_progress_updates_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_project_settings" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "setting_key" varchar(150) NOT NULL,
        "category" varchar(100),
        "setting_value" jsonb,
        "is_inherited" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_project_settings_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE UNIQUE INDEX "IDX_pm_project_settings_unique" ON "pm_project_settings" ("project_id", "setting_key")
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_material_consumption_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "task_id" uuid,
        "material_code" varchar(100),
        "material_name" varchar(200),
        "unit_of_measure" varchar(50),
        "planned_quantity" numeric(14,2),
        "actual_quantity" numeric(14,2),
        "unit_cost" numeric(14,2),
        "consumed_on" date,
        "warehouse_location" varchar(150),
        "batch_number" varchar(100),
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_material_consumption_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_material_consumption_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_labor_logs" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "task_id" uuid,
        "resource_id" uuid,
        "work_date" date NOT NULL,
        "hours_worked" numeric(6,2),
        "overtime_hours" numeric(6,2),
        "cost_rate" numeric(12,2),
        "cost_amount" numeric(14,2),
        "activity_description" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "FK_pm_labor_logs_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_pm_labor_logs_task" FOREIGN KEY ("task_id") REFERENCES "pm_project_tasks"("id") ON DELETE SET NULL,
        CONSTRAINT "FK_pm_labor_logs_resource" FOREIGN KEY ("resource_id") REFERENCES "pm_resources"("id") ON DELETE SET NULL
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_installation_phases" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "phase_name" varchar(200) NOT NULL,
        "description" text,
        "status" varchar(20) NOT NULL DEFAULT 'not_started',
        "sequence" integer,
        "planned_start_date" date,
        "planned_end_date" date,
        "actual_start_date" date,
        "actual_end_date" date,
        "supervisor_id" uuid,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_installation_phases_status" CHECK ("status" IN ('not_started','in_progress','completed','on_hold')),
        CONSTRAINT "FK_pm_installation_phases_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_site_surveys" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "survey_number" varchar(50),
        "site_name" varchar(200),
        "location" varchar(255),
        "survey_date" date,
        "status" varchar(20) NOT NULL DEFAULT 'scheduled',
        "surveyed_by" uuid,
        "weather_conditions" varchar(100),
        "summary" text,
        "risk_rating" varchar(50),
        "attachments" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_site_surveys_status" CHECK ("status" IN ('scheduled','in_progress','completed','issues_found')),
        CONSTRAINT "FK_pm_site_surveys_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_site_issues" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "site_issue_code" varchar(50),
        "site_area" varchar(150),
        "issue_type" varchar(100),
        "severity" varchar(20) NOT NULL DEFAULT 'medium',
        "status" varchar(20) NOT NULL DEFAULT 'open',
        "reported_by" uuid,
        "reported_date" date,
        "resolved_by" uuid,
        "resolved_date" date,
        "resolution_summary" text,
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_site_issues_severity" CHECK ("severity" IN ('low','medium','high','critical')),
        CONSTRAINT "CHK_pm_site_issues_status" CHECK ("status" IN ('open','in_progress','resolved','closed')),
        CONSTRAINT "FK_pm_site_issues_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_quality_inspections" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "inspection_number" varchar(50),
        "inspection_type" varchar(100),
        "scheduled_date" date,
        "completed_date" date,
        "status" varchar(20) NOT NULL DEFAULT 'scheduled',
        "inspector_id" uuid,
        "score" numeric(5,2),
        "findings" text,
        "actions_required" text,
        "attachments" jsonb,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_quality_inspections_status" CHECK ("status" IN ('scheduled','in_progress','passed','failed','closed')),
        CONSTRAINT "FK_pm_quality_inspections_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_commissioning_records" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "commissioning_number" varchar(50),
        "commissioning_date" date,
        "status" varchar(20) NOT NULL DEFAULT 'scheduled',
        "lead_engineer_id" uuid,
        "summary" text,
        "checklist" jsonb,
        "issues_found" text,
        "sign_off_by" uuid,
        "sign_off_date" date,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_commissioning_records_status" CHECK ("status" IN ('scheduled','in_progress','completed','approved','rejected')),
        CONSTRAINT "FK_pm_commissioning_records_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "pm_customer_acceptance" (
        "id" uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
        "project_id" uuid NOT NULL,
        "acceptance_number" varchar(50),
        "acceptance_date" date,
        "status" varchar(20) NOT NULL DEFAULT 'pending',
        "accepted_by" uuid,
        "customer_representative" varchar(200),
        "sign_off_document_url" text,
        "feedback" text,
        "satisfaction_score" numeric(5,2),
        "notes" text,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "CHK_pm_customer_acceptance_status" CHECK ("status" IN ('pending','submitted','approved','rejected')),
        CONSTRAINT "FK_pm_customer_acceptance_project" FOREIGN KEY ("project_id") REFERENCES "pm_projects"("id") ON DELETE CASCADE
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP TABLE "pm_customer_acceptance"');
    await queryRunner.query('DROP TABLE "pm_commissioning_records"');
    await queryRunner.query('DROP TABLE "pm_quality_inspections"');
    await queryRunner.query('DROP TABLE "pm_site_issues"');
    await queryRunner.query('DROP TABLE "pm_site_surveys"');
    await queryRunner.query('DROP TABLE "pm_installation_phases"');
    await queryRunner.query('DROP TABLE "pm_labor_logs"');
    await queryRunner.query('DROP TABLE "pm_material_consumption_logs"');
    await queryRunner.query('DROP INDEX "IDX_pm_project_settings_unique"');
    await queryRunner.query('DROP TABLE "pm_project_settings"');
    await queryRunner.query('DROP TABLE "pm_progress_updates"');
    await queryRunner.query('DROP INDEX "IDX_pm_document_versions_unique"');
    await queryRunner.query('DROP TABLE "pm_document_versions"');
    await queryRunner.query('DROP TABLE "pm_documents"');
    await queryRunner.query('DROP TABLE "pm_change_order_line_items"');
    await queryRunner.query('DROP INDEX "IDX_pm_change_orders_project_number"');
    await queryRunner.query('DROP TABLE "pm_change_orders"');
    await queryRunner.query('DROP TABLE "pm_issue_updates"');
    await queryRunner.query('DROP INDEX "IDX_pm_issues_project"');
    await queryRunner.query('DROP TABLE "pm_issues"');
    await queryRunner.query('DROP TABLE "pm_project_profitability"');
    await queryRunner.query('DROP TABLE "pm_cost_entries"');
    await queryRunner.query('DROP TABLE "pm_budget_line_items"');
    await queryRunner.query('DROP INDEX "IDX_pm_budgets_version"');
    await queryRunner.query('DROP TABLE "pm_budgets"');
    await queryRunner.query('DROP TABLE "pm_deliverables"');
    await queryRunner.query('DROP INDEX "IDX_pm_resource_utilization_unique"');
    await queryRunner.query('DROP TABLE "pm_resource_utilization_logs"');
    await queryRunner.query('DROP INDEX "IDX_pm_resource_allocations_project"');
    await queryRunner.query('DROP TABLE "pm_resource_allocations"');
    await queryRunner.query('DROP INDEX "IDX_pm_task_assignments_task"');
    await queryRunner.query('DROP TABLE "pm_task_assignments"');
    await queryRunner.query('DROP INDEX "IDX_pm_task_dependencies_unique"');
    await queryRunner.query('DROP TABLE "pm_task_dependencies"');
    await queryRunner.query('DROP INDEX "IDX_pm_project_tasks_status"');
    await queryRunner.query('DROP INDEX "IDX_pm_project_tasks_parent"');
    await queryRunner.query('DROP INDEX "IDX_pm_project_tasks_project"');
    await queryRunner.query('DROP TABLE "pm_project_tasks"');
    await queryRunner.query('DROP INDEX "IDX_pm_resources_type"');
    await queryRunner.query('DROP TABLE "pm_resources"');
    await queryRunner.query('DROP INDEX "IDX_pm_project_milestones_project"');
    await queryRunner.query('DROP TABLE "pm_project_milestones"');
    await queryRunner.query('DROP TABLE "pm_milestone_templates"');
    await queryRunner.query('DROP INDEX "IDX_pm_project_members_unique"');
    await queryRunner.query('DROP TABLE "pm_project_members"');
    await queryRunner.query('DROP INDEX "IDX_pm_projects_status"');
    await queryRunner.query('DROP INDEX "IDX_pm_projects_manager"');
    await queryRunner.query('DROP INDEX "IDX_pm_projects_type"');
    await queryRunner.query('DROP TABLE "pm_projects"');
    await queryRunner.query('DROP INDEX "IDX_pm_project_templates_type_name"');
    await queryRunner.query('DROP TABLE "pm_project_templates"');
    await queryRunner.query('DROP TABLE "pm_project_types"');
  }
}
