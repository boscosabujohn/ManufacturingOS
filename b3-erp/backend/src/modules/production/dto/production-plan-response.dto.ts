import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProductionPlanStatus, PlanningMethod } from '../entities/production-plan.entity';

export class ProductionPlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  planNumber: string;

  @ApiProperty()
  planName: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: ProductionPlanStatus })
  status: ProductionPlanStatus;

  @ApiProperty({ enum: PlanningMethod })
  planningMethod: PlanningMethod;

  @ApiProperty()
  periodStartDate: Date;

  @ApiProperty()
  periodEndDate: Date;

  @ApiPropertyOptional()
  periodName?: string;

  @ApiPropertyOptional()
  itemId?: string;

  @ApiPropertyOptional()
  itemCode?: string;

  @ApiPropertyOptional()
  itemName?: string;

  @ApiProperty()
  demandQuantity: number;

  @ApiProperty()
  forecastQuantity: number;

  @ApiProperty()
  plannedProductionQuantity: number;

  @ApiProperty()
  actualProductionQuantity: number;

  @ApiProperty()
  netRequirement: number;

  @ApiProperty()
  requiredCapacityHours: number;

  @ApiProperty()
  availableCapacityHours: number;

  @ApiProperty()
  completionPercentage: number;

  @ApiProperty()
  mrpRunExecuted: boolean;

  @ApiPropertyOptional()
  mrpRunDate?: Date;

  @ApiProperty()
  isFrozen: boolean;

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
