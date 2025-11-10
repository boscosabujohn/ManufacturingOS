import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoutingStatus } from '../entities/routing.entity';

export class RoutingResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  routingCode: string;

  @ApiProperty()
  routingName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: RoutingStatus })
  status: RoutingStatus;

  @ApiProperty()
  itemId: string;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiPropertyOptional()
  bomId?: string;

  @ApiPropertyOptional()
  bomCode?: string;

  @ApiProperty()
  version: number;

  @ApiProperty()
  isActive: boolean;

  @ApiProperty()
  isDefault: boolean;

  @ApiProperty()
  operations: any[];

  @ApiProperty()
  totalSetupTime: number;

  @ApiProperty()
  totalRunTimePerUnit: number;

  @ApiProperty()
  totalTimePerUnit: number;

  @ApiProperty()
  totalOperations: number;

  @ApiProperty()
  totalCostPerUnit: number;

  @ApiProperty()
  leadTimeDays: number;

  @ApiProperty()
  requiresQualityInspection: boolean;

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
