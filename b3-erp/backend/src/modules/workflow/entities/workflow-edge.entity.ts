import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';
import { WorkflowDefinition } from './workflow-definition.entity';

@Entity('workflow_edges')
export class WorkflowEdge {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WorkflowDefinition, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workflowDefinitionId' })
    workflowDefinition: WorkflowDefinition;

    @Column()
    workflowDefinitionId: string;

    @Column()
    source: string; // Node ID

    @Column()
    target: string; // Node ID

    @Column({ type: 'varchar', nullable: true })
    label: string;

    @Column({ type: 'jsonb', nullable: true })
    data: Record<string, any>;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
