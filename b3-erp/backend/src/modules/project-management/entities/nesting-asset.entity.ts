import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from '../../project/entities/project.entity';

export enum NestingStatus {
    PENDING = 'pending',
    APPROVED = 'approved',
    OBSOLETE = 'obsolete',
}

@Entity('nesting_assets')
export class NestingAsset {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'project_id' })
    projectId: string;

    @ManyToOne(() => Project)
    @JoinColumn({ name: 'project_id' })
    project: Project;

    @Column({ name: 'file_name' })
    fileName: string;

    @Column({ name: 'file_type' })
    fileType: string;

    @Column({ default: 1 })
    revision: number;

    @Column({
        type: 'enum',
        enum: NestingStatus,
        default: NestingStatus.PENDING,
    })
    status: NestingStatus;

    @Column({ type: 'jsonb', nullable: true })
    metadata: any;

    @CreateDateColumn({ name: 'created_at' })
    createdAt: Date;

    @UpdateDateColumn({ name: 'updated_at' })
    updatedAt: Date;
}
