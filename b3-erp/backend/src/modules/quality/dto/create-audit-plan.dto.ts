import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditType, AuditPriority } from '../entities/audit-plan.entity';

export class CreateAuditPlanDto {
  @ApiProperty({ description: 'Audit number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  auditNumber: string;

  @ApiProperty({ description: 'Audit title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  auditTitle: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Audit type', enum: AuditType })
  @IsEnum(AuditType)
  auditType: AuditType;

  @ApiPropertyOptional({ description: 'Priority', enum: AuditPriority })
  @IsEnum(AuditPriority)
  @IsOptional()
  priority?: AuditPriority;

  @ApiProperty({ description: 'Audit scope' })
  @IsString()
  @IsNotEmpty()
  auditScope: string;

  @ApiPropertyOptional({ description: 'Lead auditor ID' })
  @IsString()
  @IsOptional()
  leadAuditorId?: string;

  @ApiPropertyOptional({ description: 'Lead auditor name' })
  @IsString()
  @IsOptional()
  leadAuditorName?: string;

  @ApiProperty({ description: 'Planned start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  plannedStartDate: string;

  @ApiProperty({ description: 'Planned end date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  plannedEndDate: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
