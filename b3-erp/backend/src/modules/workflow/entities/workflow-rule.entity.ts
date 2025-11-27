
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('workflow_rules')
export class WorkflowRule {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    name: string;

    @Column({ nullable: true })
    description: string;

    @Column('jsonb')
    conditions: any[];

    @Column('jsonb')
    actions: any[];

    @Column({ default: 0 })
    priority: number;

    @Column({ default: true })
    enabled: boolean;

    @Column({ nullable: true })
    triggerEvent: string; // Event that triggers this rule evaluation

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
