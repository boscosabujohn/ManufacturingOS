
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { Project } from './project.entity';

export enum AttachmentCategory {
    CONFIRMATION = 'confirmation',
    DRAWING = 'drawing',
    BOQ = 'boq',
    SPECIFICATION = 'specification',
    RENDER = 'render',
    OTHER = 'other',
}

@Entity('project_attachments')
export class ProjectAttachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    projectId: string;

    @Column()
    fileName: string;

    @Column()
    fileUrl: string;

    @Column({
        type: 'enum',
        enum: AttachmentCategory,
        default: AttachmentCategory.OTHER,
    })
    category: AttachmentCategory;

    @Column({ nullable: true })
    mimeType: string;

    @Column({ type: 'int', nullable: true })
    fileSize: number;

    @Column({ default: 1 })
    version: number;

    @Column({ default: true })
    isLatest: boolean;

    @Column({ type: 'text', nullable: true })
    comments: string;

    @CreateDateColumn()
    uploadedAt: Date;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'projectId' })
    project: Project;
}
