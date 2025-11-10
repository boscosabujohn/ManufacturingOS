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
import { PlanningMethod } from '../entities/production-plan.entity';

export class CreateProductionPlanDto {
  @ApiProperty({ description: 'Plan number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  planNumber: string;

  @ApiProperty({ description: 'Plan name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  planName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Planning method', enum: PlanningMethod })
  @IsEnum(PlanningMethod)
  @IsOptional()
  planningMethod?: PlanningMethod;

  @ApiProperty({ description: 'Period start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  periodStartDate: string;

  @ApiProperty({ description: 'Period end date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  periodEndDate: string;

  @ApiPropertyOptional({ description: 'Period name' })
  @IsString()
  @IsOptional()
  periodName?: string;

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

  @ApiPropertyOptional({ description: 'Demand quantity' })
  @IsNumber()
  @IsOptional()
  demandQuantity?: number;

  @ApiPropertyOptional({ description: 'Forecast quantity' })
  @IsNumber()
  @IsOptional()
  forecastQuantity?: number;

  @ApiPropertyOptional({ description: 'Planned production quantity' })
  @IsNumber()
  @IsOptional()
  plannedProductionQuantity?: number;

  @ApiPropertyOptional({ description: 'Work center ID' })
  @IsString()
  @IsOptional()
  workCenterId?: string;

  @ApiPropertyOptional({ description: 'Sales order ID' })
  @IsString()
  @IsOptional()
  salesOrderId?: string;

  @ApiPropertyOptional({ description: 'Customer ID' })
  @IsString()
  @IsOptional()
  customerId?: string;

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
