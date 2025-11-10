import { PartialType } from '@nestjs/swagger';
import { CreateProductionEntryDto } from './create-production-entry.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ProductionEntryStatus } from '../entities/production-entry.entity';

export class UpdateProductionEntryDto extends PartialType(CreateProductionEntryDto) {
  @ApiPropertyOptional({ description: 'Entry status', enum: ProductionEntryStatus })
  @IsEnum(ProductionEntryStatus)
  @IsOptional()
  status?: ProductionEntryStatus;

  @ApiPropertyOptional({ description: 'Updated by' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
