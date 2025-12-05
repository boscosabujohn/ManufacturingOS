import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
    CreateDateColumn,
} from 'typeorm';
import { ApprovalRequest } from './approval-request.entity';

@Entity('approval_attachments')
export class ApprovalAttachment {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ name: 'request_id' })
    requestId: string;

    @ManyToOne(() => ApprovalRequest, (request) => request.attachments, {
        onDelete: 'CASCADE',
    })
    @JoinColumn({ name: 'request_id' })
    request: ApprovalRequest;

    @Column({ name: 'file_name', length: 255 })
    fileName: string;

    @Column({ name: 'file_url', length: 500 })
    fileUrl: string;

    @Column({ name: 'file_size', type: 'int', nullable: true })
    fileSize: number;

    @Column({ name: 'mime_type', length: 100, nullable: true })
    mimeType: string;

    @Column({ name: 'uploaded_by' })
    uploadedBy: string;

    @CreateDateColumn({ name: 'uploaded_at' })
    uploadedAt: Date;
}
