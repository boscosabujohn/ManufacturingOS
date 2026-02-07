import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany } from 'typeorm';
import { Project } from '../../project/entities/project.entity';
import { BOMDetail } from './bom-detail.entity';

export enum BOMStatus {
    DRAFT = 'draft',
    VERIFIED = 'verified',
    RELEASED = 'released',
    ARCHIVED = 'archived',
}

@Entity('bom_headers')
export class BOMHeader {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    project: Project;

    @Column()
    name: string;

    @Column({
        type: 'enum',
        enum: BOMStatus,
        default: BOMStatus.DRAFT,
    })
    status: BOMStatus;

    @Column({ default: 1 })
    version: number;

    @Column({ name: 'is_latest', default: true })
    isLatest: boolean;

    @Column({ name: 'verified_by', nullable: true })
    verifiedBy: string;

    @Column({ name: 'verified_at', type: 'timestamp', nullable: true })
    verifiedAt: Date;

    @OneToMany(() => BOMDetail, detail => detail.header)
    details: BOMDetail[];

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
