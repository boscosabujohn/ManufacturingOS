import { MigrationInterface, QueryRunner, Table, TableIndex, TableForeignKey } from 'typeorm';

export class WorkflowEngineEntities1732701000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        // Create project_phases table
        await queryRunner.createTable(
            new Table({
                name: 'project_phases',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'projectId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'currentPhase',
                        type: 'int',
                        default: 1,
                    },
                    {
                        name: 'currentStep',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: "'active'",
                    },
                    {
                        name: 'blockingReasons',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'targetCompletionDate',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'actualCompletionDate',
                        type: 'date',
                        isNullable: true,
                    },
                    {
                        name: 'createdBy',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            'project_phases',
            new TableIndex({
                name: 'IDX_PROJECT_PHASES_PROJECT_ID',
                columnNames: ['projectId'],
            }),
        );

        // Create phase_transitions table
        await queryRunner.createTable(
            new Table({
                name: 'phase_transitions',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'projectId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'fromPhase',
                        type: 'int',
                        isNullable: true,
                    },
                    {
                        name: 'toPhase',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'fromStep',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'toStep',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'transitionType',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'triggeredBy',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'conditionsMet',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'triggeredAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            'phase_transitions',
            new TableIndex({
                name: 'IDX_PHASE_TRANSITIONS_PROJECT_ID',
                columnNames: ['projectId'],
            }),
        );

        await queryRunner.createIndex(
            'phase_transitions',
            new TableIndex({
                name: 'IDX_PHASE_TRANSITIONS_TRIGGERED_AT',
                columnNames: ['triggeredAt'],
            }),
        );

        // Create workflow_documents table
        await queryRunner.createTable(
            new Table({
                name: 'workflow_documents',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'projectId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'documentType',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'version',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'fileName',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'fileUrl',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'fileSize',
                        type: 'bigint',
                        isNullable: true,
                    },
                    {
                        name: 'mimeType',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: "'draft'",
                    },
                    {
                        name: 'uploadedBy',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'reviewedBy',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'approvedBy',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'approvedAt',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'reviewComments',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'uploadedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            'workflow_documents',
            new TableIndex({
                name: 'IDX_WORKFLOW_DOCUMENTS_PROJECT_TYPE',
                columnNames: ['projectId', 'documentType'],
            }),
        );

        await queryRunner.createIndex(
            'workflow_documents',
            new TableIndex({
                name: 'IDX_WORKFLOW_DOCUMENTS_STATUS',
                columnNames: ['status'],
            }),
        );

        // Create workflow_approvals table
        await queryRunner.createTable(
            new Table({
                name: 'workflow_approvals',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'projectId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'approvalType',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'referenceId',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'workflowType',
                        type: 'varchar',
                        default: "'sequential'",
                    },
                    {
                        name: 'currentStep',
                        type: 'int',
                        default: 1,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: "'pending'",
                    },
                    {
                        name: 'createdBy',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'completedAt',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            'workflow_approvals',
            new TableIndex({
                name: 'IDX_WORKFLOW_APPROVALS_PROJECT_STATUS',
                columnNames: ['projectId', 'status'],
            }),
        );

        await queryRunner.createIndex(
            'workflow_approvals',
            new TableIndex({
                name: 'IDX_WORKFLOW_APPROVALS_TYPE',
                columnNames: ['approvalType'],
            }),
        );

        // Create approval_steps table
        await queryRunner.createTable(
            new Table({
                name: 'approval_steps',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'approvalId',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'stepNumber',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'approverId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'approverRole',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: "'pending'",
                    },
                    {
                        name: 'decidedAt',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'comments',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'signatureData',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            'approval_steps',
            new TableIndex({
                name: 'IDX_APPROVAL_STEPS_APPROVAL_STEP',
                columnNames: ['approvalId', 'stepNumber'],
            }),
        );

        await queryRunner.createForeignKey(
            'approval_steps',
            new TableForeignKey({
                columnNames: ['approvalId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'workflow_approvals',
                onDelete: 'CASCADE',
            }),
        );

        // Create quality_gates table
        await queryRunner.createTable(
            new Table({
                name: 'quality_gates',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'projectId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'phase',
                        type: 'int',
                        isNullable: false,
                    },
                    {
                        name: 'gateType',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'checklistTemplateId',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'inspectorId',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: "'pending'",
                    },
                    {
                        name: 'inspectionDate',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'passed',
                        type: 'boolean',
                        isNullable: true,
                    },
                    {
                        name: 'comments',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            'quality_gates',
            new TableIndex({
                name: 'IDX_QUALITY_GATES_PROJECT_PHASE',
                columnNames: ['projectId', 'phase'],
            }),
        );

        await queryRunner.createIndex(
            'quality_gates',
            new TableIndex({
                name: 'IDX_QUALITY_GATES_STATUS',
                columnNames: ['status'],
            }),
        );

        // Create quality_gate_items table
        await queryRunner.createTable(
            new Table({
                name: 'quality_gate_items',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'qualityGateId',
                        type: 'uuid',
                        isNullable: false,
                    },
                    {
                        name: 'itemDescription',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'passed',
                        type: 'boolean',
                        isNullable: true,
                    },
                    {
                        name: 'comments',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'photos',
                        type: 'text',
                        isArray: true,
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                    },
                ],
            }),
            true,
        );

        await queryRunner.createForeignKey(
            'quality_gate_items',
            new TableForeignKey({
                columnNames: ['qualityGateId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'quality_gates',
                onDelete: 'CASCADE',
            }),
        );

        // Create defects table
        await queryRunner.createTable(
            new Table({
                name: 'defects',
                columns: [
                    {
                        name: 'id',
                        type: 'uuid',
                        isPrimary: true,
                        generationStrategy: 'uuid',
                        default: 'uuid_generate_v4()',
                    },
                    {
                        name: 'qualityGateId',
                        type: 'uuid',
                        isNullable: true,
                    },
                    {
                        name: 'projectId',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'severity',
                        type: 'varchar',
                        isNullable: false,
                    },
                    {
                        name: 'description',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'location',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'assignedTo',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'status',
                        type: 'varchar',
                        default: "'open'",
                    },
                    {
                        name: 'photos',
                        type: 'text',
                        isArray: true,
                        isNullable: true,
                    },
                    {
                        name: 'resolutionNotes',
                        type: 'text',
                        isNullable: true,
                    },
                    {
                        name: 'resolvedAt',
                        type: 'timestamp',
                        isNullable: true,
                    },
                    {
                        name: 'resolvedBy',
                        type: 'varchar',
                        isNullable: true,
                    },
                    {
                        name: 'metadata',
                        type: 'jsonb',
                        isNullable: true,
                    },
                    {
                        name: 'createdAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'timestamp',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true,
        );

        await queryRunner.createIndex(
            'defects',
            new TableIndex({
                name: 'IDX_DEFECTS_PROJECT_STATUS',
                columnNames: ['projectId', 'status'],
            }),
        );

        await queryRunner.createIndex(
            'defects',
            new TableIndex({
                name: 'IDX_DEFECTS_SEVERITY',
                columnNames: ['severity'],
            }),
        );

        await queryRunner.createForeignKey(
            'defects',
            new TableForeignKey({
                columnNames: ['qualityGateId'],
                referencedColumnNames: ['id'],
                referencedTableName: 'quality_gates',
                onDelete: 'SET NULL',
            }),
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        // Drop tables in reverse order
        await queryRunner.dropTable('defects');
        await queryRunner.dropTable('quality_gate_items');
        await queryRunner.dropTable('quality_gates');
        await queryRunner.dropTable('approval_steps');
        await queryRunner.dropTable('workflow_approvals');
        await queryRunner.dropTable('workflow_documents');
        await queryRunner.dropTable('phase_transitions');
        await queryRunner.dropTable('project_phases');
    }
}
