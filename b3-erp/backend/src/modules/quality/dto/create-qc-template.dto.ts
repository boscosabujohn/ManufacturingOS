import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { QCTemplateType } from '../entities/qc-template.entity';

export class CreateQCTemplateDto {
  @ApiProperty({ description: 'Template code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  templateCode: string;

  @ApiProperty({ description: 'Template name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  templateName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Template type', enum: QCTemplateType })
  @IsEnum(QCTemplateType)
  templateType: QCTemplateType;

  @ApiPropertyOptional({ description: 'Item ID' })
  @IsString()
  @IsOptional()
  itemId?: string;

  @ApiPropertyOptional({ description: 'Item code' })
  @IsString()
  @IsOptional()
  itemCode?: string;

  @ApiPropertyOptional({ description: 'Item name' })
  @IsString()
  @IsOptional()
  itemName?: string;

  @ApiPropertyOptional({ description: 'Item category' })
  @IsString()
  @IsOptional()
  itemCategory?: string;

  @ApiPropertyOptional({ description: 'Supplier ID' })
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({ description: 'Supplier name' })
  @IsString()
  @IsOptional()
  supplierName?: string;

  @ApiPropertyOptional({ description: 'Process ID' })
  @IsString()
  @IsOptional()
  processId?: string;

  @ApiPropertyOptional({ description: 'Process code' })
  @IsString()
  @IsOptional()
  processCode?: string;

  @ApiPropertyOptional({ description: 'Sample size' })
  @IsNumber()
  @IsOptional()
  sampleSize?: number;

  @ApiPropertyOptional({ description: 'Acceptable quality level (AQL)' })
  @IsNumber()
  @IsOptional()
  acceptableQualityLevel?: number;

  @ApiPropertyOptional({ description: 'Inspection level' })
  @IsString()
  @IsOptional()
  inspectionLevel?: string;

  @ApiPropertyOptional({ description: 'Sampling plan' })
  @IsString()
  @IsOptional()
  samplingPlan?: string;

  @ApiPropertyOptional({ description: 'Require photos' })
  @IsBoolean()
  @IsOptional()
  requirePhotos?: boolean;

  @ApiPropertyOptional({ description: 'Require signature' })
  @IsBoolean()
  @IsOptional()
  requireSignature?: boolean;

  @ApiPropertyOptional({ description: 'Inspection frequency' })
  @IsString()
  @IsOptional()
  inspectionFrequency?: string;

  @ApiPropertyOptional({ description: 'Frequency value' })
  @IsNumber()
  @IsOptional()
  frequencyValue?: number;

  @ApiPropertyOptional({ description: 'Acceptance threshold' })
  @IsNumber()
  @IsOptional()
  acceptanceThreshold?: number;

  @ApiPropertyOptional({ description: 'Rejection threshold' })
  @IsNumber()
  @IsOptional()
  rejectionThreshold?: number;

  @ApiPropertyOptional({ description: 'Auto reject on failure' })
  @IsBoolean()
  @IsOptional()
  autoReject?: boolean;

  @ApiPropertyOptional({ description: 'Auto create NCR' })
  @IsBoolean()
  @IsOptional()
  autoCreateNCR?: boolean;

  @ApiPropertyOptional({ description: 'Auto notify' })
  @IsBoolean()
  @IsOptional()
  autoNotify?: boolean;

  @ApiPropertyOptional({ description: 'Notification emails' })
  @IsArray()
  @IsOptional()
  notificationEmails?: string[];

  @ApiPropertyOptional({ description: 'Reference standard' })
  @IsString()
  @IsOptional()
  referenceStandard?: string;

  @ApiPropertyOptional({ description: 'Reference document' })
  @IsString()
  @IsOptional()
  referenceDocument?: string;

  @ApiPropertyOptional({ description: 'Inspection instructions' })
  @IsString()
  @IsOptional()
  inspectionInstructions?: string;

  @ApiPropertyOptional({ description: 'Checklist items' })
  @IsOptional()
  checklistItems?: any[];

  @ApiPropertyOptional({ description: 'Effective date' })
  @IsDateString()
  @IsOptional()
  effectiveDate?: string;

  @ApiPropertyOptional({ description: 'Expiry date' })
  @IsDateString()
  @IsOptional()
  expiryDate?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Custom fields' })
  @IsOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
