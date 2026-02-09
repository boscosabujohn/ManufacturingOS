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

@Entity('workflow_nodes')
export class WorkflowNode {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => WorkflowDefinition, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'workflowDefinitionId' })
    workflowDefinition: WorkflowDefinition;

    @Column()
    workflowDefinitionId: string;

    @Column()
    type: string; // start, action, decision, end

    @Column('float')
    positionX: number;

    @Column('float')
    positionY: number;

    @Column({ type: 'jsonb', nullable: true })
    data: Record<string, any>; // label, config, etc.

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
