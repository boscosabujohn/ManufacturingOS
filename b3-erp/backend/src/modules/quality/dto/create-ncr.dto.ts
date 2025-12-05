import { IsString, IsEnum, IsOptional, IsDateString, IsArray } from 'class-validator';
import { NCRSeverity, NCRStatus } from '../entities/ncr.entity';

export class CreateNCRDto {
    @IsString()
    title: string;

    @IsString()
    source: string;

    @IsEnum(NCRSeverity)
    severity: NCRSeverity;

    @IsString()
    description: string;

    @IsString()
    reportedBy: string;

    @IsDateString()
    reportedDate: string;

    @IsString()
    @IsOptional()
    assignedTo?: string;

    @IsArray()
    @IsOptional()
    attachments?: {
        fileName: string;
        fileUrl: string;
        uploadedBy: string;
        uploadedAt: Date;
    }[];
}
