import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
} from 'typeorm';

export enum NCRSeverity {
    CRITICAL = 'critical',
    MAJOR = 'major',
    MINOR = 'minor',
}

export enum NCRStatus {
    OPEN = 'open',
    IN_PROGRESS = 'in-progress',
    CLOSED = 'closed',
}

@Entity('ncrs')
export class NCR {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ unique: true, length: 50 })
    ncrNumber: string;

    @Column({ length: 255 })
    title: string;

    @Column({ length: 100 })
    source: string;

    @Column({ type: 'enum', enum: NCRSeverity, default: NCRSeverity.MINOR })
    severity: NCRSeverity;

    @Column({ type: 'enum', enum: NCRStatus, default: NCRStatus.OPEN })
    status: NCRStatus;

    @Column({ type: 'text' })
    description: string;

    @Column({ length: 100 })
    reportedBy: string;

    @Column({ type: 'date' })
    reportedDate: Date;

    @Column({ length: 100, nullable: true })
    assignedTo: string;

    @Column({ type: 'text', nullable: true })
    resolution: string;

    @Column({ type: 'text', nullable: true })
    containmentAction: string;

    @Column({ type: 'text', nullable: true })
    rootCause: string;

    @Column({ type: 'text', nullable: true })
    correctiveAction: string;

    @Column({ type: 'text', nullable: true })
    preventiveAction: string;

    @Column({ type: 'date', nullable: true })
    closedDate: Date;

    @Column({ length: 100, nullable: true })
    closedBy: string;

    @Column({ type: 'json', nullable: true })
    attachments: {
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedAt: Date;
    }[];

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}
