import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { ApprovalChain } from './approval-chain.entity';

@Entity('approval_levels')
export class ApprovalLevel {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'chain_id' })
    chainId: string;

    @ManyToOne(() => ApprovalChain, (chain) => chain.levels, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'chain_id' })
    chain: ApprovalChain;

    @Column({ type: 'int' })
    sequence: number; // 1, 2, 3

    @Column({ name: 'approver_type', length: 50 })
    approverType: string; // 'user', 'role', 'dynamic'

    @Column({ name: 'approver_ids', type: 'simple-array' })
    approverIds: string[]; // Array of user IDs or role names

    @Column({ name: 'required_count', type: 'int', default: 1 })
    requiredCount: number; // How many approvers needed at this level

    @Column({ name: 'sla_hours', type: 'int' })
    slaHours: number; // SLA in hours

    @Column({ type: 'jsonb', nullable: true })
    conditions: Record<string, any>; // Conditions for this level to apply

    @Column({ name: 'escalation_rules', type: 'jsonb', nullable: true })
    escalationRules: Record<string, any>; // Escalation configuration
}
