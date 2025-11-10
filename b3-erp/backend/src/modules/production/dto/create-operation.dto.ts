import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OperationType } from '../entities/operation.entity';

export class CreateOperationDto {
  @ApiProperty({ description: 'Operation code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  operationCode: string;

  @ApiProperty({ description: 'Operation name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  operationName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Operation type', enum: OperationType })
  @IsEnum(OperationType)
  @IsOptional()
  operationType?: OperationType;

  @ApiPropertyOptional({ description: 'Default work center ID' })
  @IsString()
  @IsOptional()
  defaultWorkCenterId?: string;

  @ApiPropertyOptional({ description: 'Default work center code' })
  @IsString()
  @IsOptional()
  defaultWorkCenterCode?: string;

  @ApiPropertyOptional({ description: 'Setup time in minutes' })
  @IsNumber()
  @IsOptional()
  setupTimeMinutes?: number;

  @ApiPropertyOptional({ description: 'Run time per unit in minutes' })
  @IsNumber()
  @IsOptional()
  runTimePerUnitMinutes?: number;

  @ApiPropertyOptional({ description: 'Teardown time in minutes' })
  @IsNumber()
  @IsOptional()
  teardownTimeMinutes?: number;

  @ApiPropertyOptional({ description: 'Batch size' })
  @IsNumber()
  @IsOptional()
  batchSize?: number;

  @ApiPropertyOptional({ description: 'Hourly rate' })
  @IsNumber()
  @IsOptional()
  hourlyRate?: number;

  @ApiPropertyOptional({ description: 'Number of operators' })
  @IsNumber()
  @IsOptional()
  numberOfOperators?: number;

  @ApiPropertyOptional({ description: 'Number of machines' })
  @IsNumber()
  @IsOptional()
  numberOfMachines?: number;

  @ApiPropertyOptional({ description: 'Requires quality inspection' })
  @IsBoolean()
  @IsOptional()
  requiresQualityInspection?: boolean;

  @ApiPropertyOptional({ description: 'Work instructions' })
  @IsString()
  @IsOptional()
  workInstructions?: string;

  @ApiPropertyOptional({ description: 'Is outsourced' })
  @IsBoolean()
  @IsOptional()
  isOutsourced?: boolean;

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
