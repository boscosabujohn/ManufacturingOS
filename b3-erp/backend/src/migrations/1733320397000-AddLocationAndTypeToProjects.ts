import { MigrationInterface, QueryRunner, TableColumn } from 'typeorm';

export class AddLocationAndTypeToProjects1733320397000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        if (!(await queryRunner.hasColumn('projects', 'location'))) {
            await queryRunner.addColumn('projects', new TableColumn({
                name: 'location',
                type: 'varchar',
                isNullable: true
            }));
        }
        if (!(await queryRunner.hasColumn('projects', 'project_type'))) {
            await queryRunner.addColumn('projects', new TableColumn({
                name: 'project_type',
                type: 'varchar',
                isNullable: true
            }));
        }
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropColumn('projects', 'project_type');
        await queryRunner.dropColumn('projects', 'location');
    }
}
