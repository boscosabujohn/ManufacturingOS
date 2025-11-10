import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { FindingType, FindingSeverity } from '../entities/audit-findings.entity';

export class CreateAuditFindingsDto {
  @ApiProperty({ description: 'Audit plan ID' })
  @IsString()
  @IsNotEmpty()
  auditPlanId: string;

  @ApiProperty({ description: 'Finding number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  findingNumber: string;

  @ApiProperty({ description: 'Title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Finding type', enum: FindingType })
  @IsEnum(FindingType)
  findingType: FindingType;

  @ApiPropertyOptional({ description: 'Severity', enum: FindingSeverity })
  @IsEnum(FindingSeverity)
  @IsOptional()
  severity?: FindingSeverity;

  @ApiProperty({ description: 'Finding date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  findingDate: string;

  @ApiPropertyOptional({ description: 'Standard reference' })
  @IsString()
  @IsOptional()
  standardReference?: string;

  @ApiPropertyOptional({ description: 'Clause number' })
  @IsString()
  @IsOptional()
  clauseNumber?: string;

  @ApiProperty({ description: 'Evidence' })
  @IsString()
  @IsNotEmpty()
  evidence: string;

  @ApiPropertyOptional({ description: 'Auditor name' })
  @IsString()
  @IsOptional()
  auditorName?: string;

  @ApiPropertyOptional({ description: 'Assigned to ID' })
  @IsString()
  @IsOptional()
  assignedToId?: string;

  @ApiPropertyOptional({ description: 'Assigned to name' })
  @IsString()
  @IsOptional()
  assignedToName?: string;

  @ApiPropertyOptional({ description: 'Target completion date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  targetCompletionDate?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
