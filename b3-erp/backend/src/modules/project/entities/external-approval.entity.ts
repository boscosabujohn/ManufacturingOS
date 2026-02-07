import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { Project } from './project.entity';

export enum ApprovalStatus {
    SENT = 'SENT',
    VIEWED = 'VIEWED',
    APPROVED = 'APPROVED',
    REJECTED = 'REJECTED',
}

@Entity('external_approvals')
export class ExternalApproval {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    projectId: string;

    @ManyToOne(() => Project, { onDelete: 'CASCADE' })
    project: Project;

    @Column()
    attachmentId: string; // The drawing or document being approved

    @Column()
    clientEmail: string;

    @Column({ unique: true })
    magicToken: string;

    @Column({
        type: 'enum',
        enum: ApprovalStatus,
        default: ApprovalStatus.SENT,
    })
    status: ApprovalStatus;

    @Column({ nullable: true })
    signatureUrl: string;

    @Column('text', { nullable: true })
    comments: string;

    @Column({ type: 'timestamp', nullable: true })
    expiresAt: Date;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
