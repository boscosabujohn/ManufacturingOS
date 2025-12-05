import { MigrationInterface, QueryRunner } from 'typeorm';

export class FixProjectColumns1733320398000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Helper to check column
        const hasColumn = async (col: string) => queryRunner.hasColumn('projects', col);

        // Helper to migrate and drop
        const migrateAndDrop = async (source: string, target: string) => {
            if (await hasColumn(source)) {
                if (await hasColumn(target)) {
                    // Both exist, migrate data
                    await queryRunner.query(`UPDATE projects SET "${target}" = "${source}" WHERE "${target}" IS NULL`);
                    await queryRunner.dropColumn('projects', source);
                } else {
                    // Only source exists, rename
                    await queryRunner.renameColumn('projects', source, target);
                }
            }
        };

        await migrateAndDrop('projectName', 'name');
        await migrateAndDrop('customer', 'client_name');
        await migrateAndDrop('projectType', 'project_type');
        await migrateAndDrop('salesOrderNumber', 'sales_order_id');
        await migrateAndDrop('startDate', 'start_date');
        await migrateAndDrop('endDate', 'end_date');

        // Budget and Cost (special handling for types)
        if (await hasColumn('budget')) {
            if (await hasColumn('budget_allocated')) {
                await queryRunner.query(`UPDATE projects SET budget_allocated = budget WHERE budget_allocated = 0 OR budget_allocated IS NULL`);
            }
            await queryRunner.dropColumn('projects', 'budget');
        }

        if (await hasColumn('actualCost')) {
            if (await hasColumn('budget_spent')) {
                await queryRunner.query(`UPDATE projects SET budget_spent = "actualCost" WHERE budget_spent = 0 OR budget_spent IS NULL`);
            }
            await queryRunner.dropColumn('projects', 'actualCost');
        }

        // Drop others
        if (await hasColumn('projectNumber')) await queryRunner.dropColumn('projects', 'projectNumber');
        if (await hasColumn('actualEndDate')) await queryRunner.dropColumn('projects', 'actualEndDate');
        if (await hasColumn('phase')) await queryRunner.dropColumn('projects', 'phase');
        if (await hasColumn('teamSize')) await queryRunner.dropColumn('projects', 'teamSize');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Revert... too complex to revert perfectly, just rename back
    }
}
