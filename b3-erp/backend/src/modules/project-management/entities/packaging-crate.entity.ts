import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { PackagingItem } from './packaging-item.entity';

export enum CrateStatus {
    OPEN = 'open',
    SEALED = 'sealed',
    DISPATCHED = 'dispatched',
}

@Entity('packaging_crates')
export class PackagingCrate {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'crate_number' })
    crateNumber: string;

    @Column({ nullable: true })
    dimensions: string;

    @Column({ name: 'actual_weight', type: 'decimal', precision: 10, scale: 2, default: 0 })
    actualWeight: number;

    @Column({ name: 'design_weight', type: 'decimal', precision: 10, scale: 2, default: 0 })
    designWeight: number;

    @Column({
        type: 'enum',
        enum: CrateStatus,
        default: CrateStatus.OPEN,
    })
    status: CrateStatus;

    @Column({ name: 'qr_code', nullable: true })
    qrCode: string;

    @OneToMany(() => PackagingItem, item => item.crate)
    items: PackagingItem[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
