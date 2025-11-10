import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { OperationType, OperationStatus } from '../entities/operation.entity';

export class OperationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  operationCode: string;

  @ApiProperty()
  operationName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: OperationType })
  operationType: OperationType;

  @ApiProperty({ enum: OperationStatus })
  status: OperationStatus;

  @ApiPropertyOptional()
  defaultWorkCenterId?: string;

  @ApiPropertyOptional()
  defaultWorkCenterCode?: string;

  @ApiProperty()
  setupTimeMinutes: number;

  @ApiProperty()
  runTimePerUnitMinutes: number;

  @ApiProperty()
  teardownTimeMinutes: number;

  @ApiProperty()
  totalTimePerUnitMinutes: number;

  @ApiProperty()
  batchSize: number;

  @ApiProperty()
  hourlyRate: number;

  @ApiProperty()
  costPerUnit: number;

  @ApiProperty()
  numberOfOperators: number;

  @ApiProperty()
  numberOfMachines: number;

  @ApiProperty()
  requiresQualityInspection: boolean;

  @ApiPropertyOptional()
  workInstructions?: string;

  @ApiProperty()
  isOutsourced: boolean;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
