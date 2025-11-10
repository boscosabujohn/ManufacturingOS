import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateRoutingDto {
  @ApiProperty({ description: 'Routing code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  routingCode: string;

  @ApiProperty({ description: 'Routing name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  routingName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

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

  @ApiPropertyOptional({ description: 'BOM ID' })
  @IsString()
  @IsOptional()
  bomId?: string;

  @ApiPropertyOptional({ description: 'BOM code' })
  @IsString()
  @IsOptional()
  bomCode?: string;

  @ApiPropertyOptional({ description: 'Version number' })
  @IsNumber()
  @IsOptional()
  version?: number;

  @ApiPropertyOptional({ description: 'Is default routing' })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiProperty({ description: 'Operations sequence', type: 'array' })
  @IsArray()
  @IsNotEmpty()
  operations: {
    sequenceNumber: number;
    operationId: string;
    operationCode: string;
    operationName: string;
    operationType: string;
    workCenterId: string;
    workCenterCode: string;
    workCenterName: string;
    setupTimeMinutes: number;
    runTimePerUnitMinutes: number;
    teardownTimeMinutes: number;
    totalTimePerUnitMinutes: number;
    batchSize: number;
    numberOfOperators: number;
    numberOfMachines: number;
    costPerUnit: number;
    requiresQualityInspection: boolean;
    qcTemplateId?: string;
    requiresSupervisorApproval: boolean;
    allowParallelExecution: boolean;
    parallelSequenceGroup?: string;
    workInstructions?: string;
    notes?: string;
  }[];

  @ApiPropertyOptional({ description: 'Batch size' })
  @IsNumber()
  @IsOptional()
  batchSize?: number;

  @ApiPropertyOptional({ description: 'Lead time days' })
  @IsNumber()
  @IsOptional()
  leadTimeDays?: number;

  @ApiPropertyOptional({ description: 'Drawing number' })
  @IsString()
  @IsOptional()
  drawingNumber?: string;

  @ApiPropertyOptional({ description: 'Revision' })
  @IsString()
  @IsOptional()
  revision?: string;

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
