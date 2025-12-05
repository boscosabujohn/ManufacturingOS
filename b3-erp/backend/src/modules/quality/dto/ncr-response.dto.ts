import { NCRSeverity, NCRStatus } from '../entities/ncr.entity';

export class NCRResponseDto {
    id: string;
    ncrNumber: string;
    title: string;
    source: string;
    severity: NCRSeverity;
    status: NCRStatus;
    description: string;
    reportedBy: string;
    reportedDate: Date;
    assignedTo?: string;
    resolution?: string;
    containmentAction?: string;
    rootCause?: string;
    correctiveAction?: string;
    preventiveAction?: string;
    closedDate?: Date;
    closedBy?: string;
    attachments?: {
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedAt: Date;
    }[];
    createdAt: Date;
    updatedAt: Date;
}
