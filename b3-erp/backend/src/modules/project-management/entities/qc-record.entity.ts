import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { Item } from '../../core/entities/item.entity';

export enum QCResult {
    PASS = 'pass',
    FAIL = 'fail',
    REWORK = 'rework',
}

@Entity('qc_records')
export class QCRecord {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'item_id' })
    itemId: string;

    @ManyToOne(() => Item)
    @JoinColumn({ name: 'item_id' })
    item: Item;

    @Column({ name: 'inspected_by' })
    inspectedBy: string;

    @Column({
        type: 'enum',
        enum: QCResult,
        default: QCResult.PASS,
    })
    result: QCResult;

    @Column({ name: 'defect_category', nullable: true })
    defectCategory: string;

    @Column({ name: 'rework_operation', nullable: true })
    reworkOperation: string;

    @Column({ type: 'text', nullable: true })
    notes: string;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
