import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    Index,
} from 'typeorm';

@Entity('workflow_documents')
@Index(['projectId', 'documentType'])
@Index(['status'])
export class WorkflowDocument {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column()
    @Index()
    projectId: string;

    @Column()
    documentType: string; // 'boq', 'drawing', 'mep', '3d_render', 'handover_package', etc.

    @Column()
    version: string; // '1.0', '1.1', '2.0', etc.

    @Column()
    fileName: string;

    @Column()
    fileUrl: string; // S3 or file storage URL

    @Column({ type: 'bigint', nullable: true })
    fileSize: number;

    @Column({ nullable: true })
    mimeType: string;

    @Column({ default: 'draft' })
    status: 'draft' | 'pending_review' | 'approved' | 'rejected' | 'archived';

    @Column({ nullable: true })
    uploadedBy: string;

    @Column({ nullable: true })
    reviewedBy: string;

    @Column({ nullable: true })
    approvedBy: string;

    @Column({ type: 'timestamp', nullable: true })
    approvedAt: Date;

    @Column({ type: 'text', nullable: true })
    reviewComments: string;

    @Column({ type: 'jsonb', nullable: true })
    metadata: {
        tags?: string[];
        description?: string;
        relatedDocuments?: string[];
        [key: string]: any;
    };

    @CreateDateColumn()
    uploadedAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
