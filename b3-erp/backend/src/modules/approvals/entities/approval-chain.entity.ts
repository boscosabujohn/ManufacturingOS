import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
} from 'typeorm';
import { ApprovalLevel } from './approval-level.entity';

@Entity('approval_chains')
export class ApprovalChain {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ length: 255 })
    name: string;

    @Column({ name: 'entity_type', length: 100 })
    entityType: string; // 'purchase_order', 'expense', 'quotation', etc.

    @Column({ name: 'is_active', default: true })
    isActive: boolean;

    @Column({ type: 'text', nullable: true })
    description: string;

    @OneToMany(() => ApprovalLevel, (level) => level.chain, {
        cascade: true,
        eager: true,
    })
    levels: ApprovalLevel[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
