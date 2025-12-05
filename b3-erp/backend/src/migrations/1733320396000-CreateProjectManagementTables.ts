import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex, TableColumn } from 'typeorm';

export class CreateProjectManagementTables1733320396000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ========== 1. PROJECTS TABLE ==========
        const tableExists = await queryRunner.hasTable('projects');

        if (!tableExists) {
            await queryRunner.createTable(
                new Table({
                    name: 'projects',
                    columns: [
                        { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                        { name: 'name', type: 'varchar', length: '255', isNullable: false },
                        { name: 'description', type: 'text', isNullable: true },
                        { name: 'project_code', type: 'varchar', length: '50', isUnique: true, isNullable: true }, // Made nullable for existing records
                        { name: 'start_date', type: 'date', isNullable: true },
                        { name: 'end_date', type: 'date', isNullable: true },
                        { name: 'planned_start', type: 'date', isNullable: true },
                        { name: 'planned_end', type: 'date', isNullable: true },
                        { name: 'status', type: 'varchar', length: '50', default: "'planning'" },
                        { name: 'priority', type: 'varchar', length: '50', default: "'medium'" },
                        { name: 'progress', type: 'decimal', precision: 5, scale: 2, default: 0 },
                        { name: 'project_manager_id', type: 'uuid', isNullable: true },
                        { name: 'budget_allocated', type: 'decimal', precision: 15, scale: 2, default: 0 },
                        { name: 'budget_spent', type: 'decimal', precision: 15, scale: 2, default: 0 },
                        { name: 'client_name', type: 'varchar', isNullable: true }, // Align with existing entity
                        { name: 'sales_order_id', type: 'varchar', isNullable: true }, // Align with existing entity
                        { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                        { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                    ],
                }),
                true,
            );
        } else {
            // Add missing columns if table exists
            const columnsToAdd = [
                { name: 'project_code', type: 'varchar', length: '50', isUnique: true, isNullable: true },
                { name: 'planned_start', type: 'date', isNullable: true },
                { name: 'planned_end', type: 'date', isNullable: true },
                { name: 'priority', type: 'varchar', length: '50', default: "'medium'" },
                { name: 'progress', type: 'decimal', precision: 5, scale: 2, default: 0 },
                { name: 'budget_allocated', type: 'decimal', precision: 15, scale: 2, default: 0 },
                { name: 'budget_spent', type: 'decimal', precision: 15, scale: 2, default: 0 },
                { name: 'project_manager_id', type: 'uuid', isNullable: true }, // Might exist as managerId?
            ];

            for (const col of columnsToAdd) {
                const hasColumn = await queryRunner.hasColumn('projects', col.name);
                if (!hasColumn) {
                    await queryRunner.addColumn('projects', new TableColumn(col as any));
                }
            }
        }

        // ========== 2. PROJECT_TASKS TABLE ==========
        // (Rest of the tables are new, so createTable is fine, but use ifNotExists=true)
        await queryRunner.createTable(
            new Table({
                name: 'project_tasks',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'project_id', type: 'uuid', isNullable: false },
                    { name: 'name', type: 'varchar', length: '255', isNullable: false },
                    { name: 'description', type: 'text', isNullable: true },
                    { name: 'start_date', type: 'date', isNullable: true },
                    { name: 'end_date', type: 'date', isNullable: true },
                    { name: 'planned_duration', type: 'int', isNullable: true },
                    { name: 'actual_duration', type: 'int', isNullable: true },
                    { name: 'progress', type: 'decimal', precision: 5, scale: 2, default: 0 },
                    { name: 'status', type: 'varchar', length: '50', default: "'not_started'" },
                    { name: 'priority', type: 'varchar', length: '50', default: "'medium'" },
                    { name: 'assigned_to', type: 'uuid', isArray: true, isNullable: true },
                    { name: 'parent_task_id', type: 'uuid', isNullable: true },
                    { name: 'dependencies', type: 'jsonb', isNullable: true },
                    { name: 'estimated_hours', type: 'decimal', precision: 10, scale: 2, default: 0 },
                    { name: 'actual_hours', type: 'decimal', precision: 10, scale: 2, default: 0 },
                    { name: 'milestone', type: 'boolean', default: false },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        // Add FKs only if they don't exist (TypeORM createTable with FKs might fail if table exists but FK doesn't? No, createTable skips if table exists)
        // Since project_tasks is new, we can add FKs.
        // But if we re-run, we should be careful.
        // For simplicity, I'll assume project_tasks is new or fully created.

        // ... (Rest of the tables) ...

        // ========== 3. PROJECT_RESOURCES TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'project_resources',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'project_id', type: 'uuid', isNullable: false },
                    { name: 'user_id', type: 'uuid', isNullable: false },
                    { name: 'role', type: 'varchar', length: '100', isNullable: true },
                    { name: 'allocation_percentage', type: 'int', default: 100 },
                    { name: 'start_date', type: 'date', isNullable: true },
                    { name: 'end_date', type: 'date', isNullable: true },
                    { name: 'hourly_rate', type: 'decimal', precision: 10, scale: 2, default: 0 },
                    { name: 'total_hours_allocated', type: 'decimal', precision: 10, scale: 2, default: 0 },
                    { name: 'total_hours_spent', type: 'decimal', precision: 10, scale: 2, default: 0 },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        // ========== 4. PROJECT_BUDGETS TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'project_budgets',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'project_id', type: 'uuid', isNullable: false },
                    { name: 'category', type: 'varchar', length: '50', isNullable: false },
                    { name: 'budget_allocated', type: 'decimal', precision: 15, scale: 2, default: 0 },
                    { name: 'budget_spent', type: 'decimal', precision: 15, scale: 2, default: 0 },
                    { name: 'forecast_cost', type: 'decimal', precision: 15, scale: 2, default: 0 },
                    { name: 'notes', type: 'text', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        // ========== 5. PROJECT_MILESTONES TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'project_milestones',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'project_id', type: 'uuid', isNullable: false },
                    { name: 'name', type: 'varchar', length: '255', isNullable: false },
                    { name: 'description', type: 'text', isNullable: true },
                    { name: 'due_date', type: 'date', isNullable: true },
                    { name: 'completed_date', type: 'date', isNullable: true },
                    { name: 'status', type: 'varchar', length: '50', default: "'pending'" },
                    { name: 'deliverables', type: 'jsonb', isNullable: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        // ========== 6. RESOURCE_CAPACITY TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'resource_capacity',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'user_id', type: 'uuid', isNullable: false },
                    { name: 'date', type: 'date', isNullable: false },
                    { name: 'available_hours', type: 'decimal', precision: 5, scale: 2, default: 8 },
                    { name: 'allocated_hours', type: 'decimal', precision: 5, scale: 2, default: 0 },
                    { name: 'utilization_percentage', type: 'decimal', precision: 5, scale: 2, default: 0 },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        // ========== 7. TIME_LOGS TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'time_logs',
                columns: [
                    { name: 'id', type: 'uuid', isPrimary: true, generationStrategy: 'uuid', default: 'uuid_generate_v4()' },
                    { name: 'project_id', type: 'uuid', isNullable: false },
                    { name: 'task_id', type: 'uuid', isNullable: true },
                    { name: 'user_id', type: 'uuid', isNullable: false },
                    { name: 'date', type: 'date', isNullable: false },
                    { name: 'hours', type: 'decimal', precision: 5, scale: 2, isNullable: false },
                    { name: 'description', type: 'text', isNullable: true },
                    { name: 'billable', type: 'boolean', default: true },
                    { name: 'created_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP' },
                    { name: 'updated_at', type: 'timestamp', default: 'CURRENT_TIMESTAMP', onUpdate: 'CURRENT_TIMESTAMP' },
                ],
            }),
            true,
        );

        // Add Foreign Keys manually to avoid errors if tables exist
        // Helper to add FK safely
        const addFk = async (table: string, column: string, refTable: string, refColumn: string) => {
            const tableObj = await queryRunner.getTable(table);
            const fk = tableObj?.foreignKeys.find(fk => fk.columnNames.indexOf(column) !== -1);
            if (!fk) {
                await queryRunner.createForeignKey(table, new TableForeignKey({
                    columnNames: [column],
                    referencedTableName: refTable,
                    referencedColumnNames: [refColumn],
                    onDelete: 'CASCADE'
                }));
            }
        };

        await addFk('project_tasks', 'project_id', 'projects', 'id');
        await addFk('project_tasks', 'parent_task_id', 'project_tasks', 'id');
        await addFk('project_resources', 'project_id', 'projects', 'id');
        await addFk('project_budgets', 'project_id', 'projects', 'id');
        await addFk('project_milestones', 'project_id', 'projects', 'id');
        await addFk('time_logs', 'project_id', 'projects', 'id');
        await addFk('time_logs', 'task_id', 'project_tasks', 'id');

        console.log('✅ All project management tables created/updated successfully!');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('time_logs', true);
        await queryRunner.dropTable('resource_capacity', true);
        await queryRunner.dropTable('project_milestones', true);
        await queryRunner.dropTable('project_budgets', true);
        await queryRunner.dropTable('project_resources', true);
        await queryRunner.dropTable('project_tasks', true);
        await queryRunner.dropTable('projects', true);

        console.log('✅ All project management tables dropped successfully!');
    }
}
