import { PartialType } from '@nestjs/swagger';
import { CreateProductionPlanDto } from './create-production-plan.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductionPlanStatus } from '../entities/production-plan.entity';

export class UpdateProductionPlanDto extends PartialType(CreateProductionPlanDto) {
  @ApiPropertyOptional({ description: 'Plan status', enum: ProductionPlanStatus })
  @IsEnum(ProductionPlanStatus)
  @IsOptional()
  status?: ProductionPlanStatus;

  @ApiPropertyOptional({ description: 'Updated by' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
