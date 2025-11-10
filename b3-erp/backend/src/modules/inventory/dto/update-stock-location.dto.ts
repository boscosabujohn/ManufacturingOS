import { PartialType } from '@nestjs/swagger';
import { CreateStockLocationDto } from './create-stock-location.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { LocationStatus } from '../entities/stock-location.entity';

export class UpdateStockLocationDto extends PartialType(CreateStockLocationDto) {
  @ApiPropertyOptional({
    description: 'Location status',
    enum: LocationStatus,
  })
  @IsEnum(LocationStatus)
  @IsOptional()
  status?: LocationStatus;
}
