import { PartialType } from '@nestjs/swagger';
import { CreateWarehouseDto } from './create-warehouse.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { WarehouseStatus } from '../entities/warehouse.entity';

export class UpdateWarehouseDto extends PartialType(CreateWarehouseDto) {
  @ApiPropertyOptional({
    description: 'Warehouse status',
    enum: WarehouseStatus,
  })
  @IsEnum(WarehouseStatus)
  @IsOptional()
  status?: WarehouseStatus;
}
