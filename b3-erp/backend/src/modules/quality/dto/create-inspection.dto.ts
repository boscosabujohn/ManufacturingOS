import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { InspectionType, InspectionPriority } from '../entities/inspection.entity';

export class CreateInspectionDto {
  @ApiProperty({ description: 'Inspection number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  inspectionNumber: string;

  @ApiProperty({ description: 'Inspection name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  inspectionName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Inspection type', enum: InspectionType })
  @IsEnum(InspectionType)
  inspectionType: InspectionType;

  @ApiPropertyOptional({ description: 'Priority', enum: InspectionPriority })
  @IsEnum(InspectionPriority)
  @IsOptional()
  priority?: InspectionPriority;

  @ApiPropertyOptional({ description: 'QC Template ID' })
  @IsString()
  @IsOptional()
  qcTemplateId?: string;

  @ApiProperty({ description: 'Item ID' })
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty({ description: 'Item code' })
  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty({ description: 'Item name' })
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty({ description: 'Lot quantity' })
  @IsNumber()
  @IsNotEmpty()
  lotQuantity: number;

  @ApiProperty({ description: 'Sample size' })
  @IsNumber()
  @IsNotEmpty()
  sampleSize: number;

  @ApiPropertyOptional({ description: 'Batch number' })
  @IsString()
  @IsOptional()
  batchNumber?: string;

  @ApiPropertyOptional({ description: 'Work order ID' })
  @IsString()
  @IsOptional()
  workOrderId?: string;

  @ApiPropertyOptional({ description: 'Purchase order ID' })
  @IsString()
  @IsOptional()
  purchaseOrderId?: string;

  @ApiPropertyOptional({ description: 'Supplier ID' })
  @IsString()
  @IsOptional()
  supplierId?: string;

  @ApiPropertyOptional({ description: 'Supplier name' })
  @IsString()
  @IsOptional()
  supplierName?: string;

  @ApiProperty({ description: 'Scheduled date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  scheduledDate: string;

  @ApiPropertyOptional({ description: 'Assigned to ID' })
  @IsString()
  @IsOptional()
  assignedToId?: string;

  @ApiPropertyOptional({ description: 'Assigned to name' })
  @IsString()
  @IsOptional()
  assignedToName?: string;

  @ApiPropertyOptional({ description: 'Inspection location' })
  @IsString()
  @IsOptional()
  inspectionLocation?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
