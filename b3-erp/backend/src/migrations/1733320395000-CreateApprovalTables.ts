import { MigrationInterface, QueryRunner, Table, TableForeignKey, TableIndex } from 'typeorm';

export class CreateApprovalTables1733320395000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // ========== 1. APPROVAL_CHAINS TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'approval_chains',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'entity_type',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                        comment: 'purchase_order, quotation, design, bom, etc.',
                    },
                    {
                        name: 'is_active',
                        type: 'boolean',
                        default: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Index on entity_type for fast lookup
        await queryRunner.createIndex(
            'approval_chains',
            new TableIndex({
                name: 'IDX_APPROVAL_CHAINS_ENTITY_TYPE',
                columnNames: ['entity_type'],
            }),
        );

        // ========== 2. APPROVAL_LEVELS TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'approval_levels',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'chain_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'sequence',
                        type: 'int',
                        isNullable: false,
                        comment: 'Order of approval level (1, 2, 3, etc.)',
                    },
                    {
                        name: 'approver_type',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        comment: 'role, user, position',
                    },
                    {
                        name: 'approver_ids',
                        type: 'jsonb',
                        isNullable: false,
                        comment: 'Array of user/role IDs who can approve',
                    },
                    {
                        name: 'required_count',
                        type: 'int',
                        default: 1,
                        comment: 'Number of approvals required from approver_ids',
                    },
                    {
                        name: 'sla_hours',
                        type: 'int',
                        isNullable: false,
                        comment: 'SLA time in hours',
                    },
                    {
                        name: 'conditions',
                        type: 'jsonb',
                        isNullable: true,
                        comment: 'Conditions for this level to apply (e.g., amount > 50000)',
                    },
                    {
                        name: 'escalation_rules',
                        type: 'jsonb',
                        isNullable: true,
                        comment: 'Escalation configuration',
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Foreign key to approval_chains
        await queryRunner.createForeignKey(
            'approval_levels',
            new TableForeignKey({
                columnNames: ['chain_id'],
                referencedTableName: 'approval_chains',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        // Index on chain_id and sequence
        await queryRunner.createIndex(
            'approval_levels',
            new TableIndex({
                name: 'IDX_APPROVAL_LEVELS_CHAIN_SEQUENCE',
                columnNames: ['chain_id', 'sequence'],
            }),
        );

        // ========== 3. APPROVAL_REQUESTS TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'approval_requests',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'chain_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'entity_type',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'entity_id',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                        comment: 'ID of the PO, design, etc. being approved',
                    },
                    {
                        name: 'requested_by',
                        type: 'uuid',
                        isNullable: false,
                        comment: 'User who initiated the approval',
                    },
                    {
                        name: 'current_level_sequence',
                        type: 'int',
                        default: 1,
                        comment: 'Current approval level',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '50',
                        default: "'pending'",
                        comment: 'pending, approved, rejected, cancelled',
                    },
                    {
                        name: 'priority',
                        type: 'varchar',
                        length: '20',
                        default: "'medium'",
                        comment: 'low, medium, high, urgent',
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                        comment: 'Additional data (amount, discount, etc.)',
                    },
                    {
                        name: 'deadline',
                        type: 'timestamp',
                        isNullable: true,
                        comment: 'SLA deadline for current level',
                    },
                    {
                        name: 'completed_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Foreign key to approval_chains
        await queryRunner.createForeignKey(
            'approval_requests',
            new TableForeignKey({
                columnNames: ['chain_id'],
                referencedTableName: 'approval_chains',
                referencedColumnNames: ['id'],
                onDelete: 'RESTRICT',
            }),
        );

        // Indexes for common queries
        await queryRunner.createIndex(
            'approval_requests',
            new TableIndex({
                name: 'IDX_APPROVAL_REQUESTS_STATUS',
                columnNames: ['status'],
            }),
        );

        await queryRunner.createIndex(
            'approval_requests',
            new TableIndex({
                name: 'IDX_APPROVAL_REQUESTS_ENTITY',
                columnNames: ['entity_type', 'entity_id'],
            }),
        );

        await queryRunner.createIndex(
            'approval_requests',
            new TableIndex({
                name: 'IDX_APPROVAL_REQUESTS_DEADLINE',
                columnNames: ['deadline'],
            }),
        );

        // ========== 4. APPROVAL_HISTORY TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'approval_history',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'request_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'level_sequence',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'approver_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'action',
                        type: 'varchar',
                        length: '50',
                        isNullable: false,
                        comment: 'approved, rejected, delegated',
                    },
                    {
                        name: 'comment',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Foreign key to approval_requests
        await queryRunner.createForeignKey(
            'approval_history',
            new TableForeignKey({
                columnNames: ['request_id'],
                referencedTableName: 'approval_requests',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        // Index for fetching history
        await queryRunner.createIndex(
            'approval_history',
            new TableIndex({
                name: 'IDX_APPROVAL_HISTORY_REQUEST',
                columnNames: ['request_id', 'created_at'],
            }),
        );

        // ========== 5. APPROVAL_COMMENTS TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'approval_comments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'request_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'comment',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Foreign key to approval_requests
        await queryRunner.createForeignKey(
            'approval_comments',
            new TableForeignKey({
                columnNames: ['request_id'],
                referencedTableName: 'approval_requests',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        // ========== 6. APPROVAL_ATTACHMENTS TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'approval_attachments',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'request_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'file_name',
                        type: 'varchar',
                        length: '255',
                        isNullable: false,
                    },
                    {
                        name: 'file_path',
                        type: 'varchar',
                        length: '500',
                        isNullable: false,
                    },
                    {
                        name: 'file_size',
                        type: 'bigint',
                        isNullable: false,
                    },
                    {
                        name: 'mime_type',
                        type: 'varchar',
                        length: '100',
                        isNullable: false,
                    },
                    {
                        name: 'uploaded_by',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Foreign key to approval_requests
        await queryRunner.createForeignKey(
            'approval_attachments',
            new TableForeignKey({
                columnNames: ['request_id'],
                referencedTableName: 'approval_requests',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        // ========== 7. USER_TASKS TABLE ==========
        await queryRunner.createTable(
            new Table({
                name: 'user_tasks',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'user_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'request_id',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'task_type',
                        type: 'varchar',
                        length: '50',
                        default: "'approval'",
                        comment: 'approval, notification, etc.',
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        length: '50',
                        default: "'pending'",
                        comment: 'pending, completed, expired',
                    },
                    {
                        name: 'sla_status',
                        type: 'varchar',
                        length: '50',
                        default: "'on_time'",
                        comment: 'on_time, approaching, breached',
                    },
                    {
                        name: 'deadline',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'completed_at',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'created_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updated_at',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                        onUpdate: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        // Foreign key to approval_requests
        await queryRunner.createForeignKey(
            'user_tasks',
            new TableForeignKey({
                columnNames: ['request_id'],
                referencedTableName: 'approval_requests',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            }),
        );

        // Indexes for task queries
        await queryRunner.createIndex(
            'user_tasks',
            new TableIndex({
                name: 'IDX_USER_TASKS_USER_STATUS',
                columnNames: ['user_id', 'status'],
            }),
        );

        await queryRunner.createIndex(
            'user_tasks',
            new TableIndex({
                name: 'IDX_USER_TASKS_DEADLINE',
                columnNames: ['deadline'],
            }),
        );

        await queryRunner.createIndex(
            'user_tasks',
            new TableIndex({
                name: 'IDX_USER_TASKS_SLA',
                columnNames: ['sla_status'],
            }),
        );

        console.log('✅ All approval system tables created successfully!');
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order (to respect foreign key constraints)
        await queryRunner.dropTable('user_tasks', true);
        await queryRunner.dropTable('approval_attachments', true);
        await queryRunner.dropTable('approval_comments', true);
        await queryRunner.dropTable('approval_history', true);
        await queryRunner.dropTable('approval_requests', true);
        await queryRunner.dropTable('approval_levels', true);
        await queryRunner.dropTable('approval_chains', true);

        console.log('✅ All approval system tables dropped successfully!');
    }
}
