import { PartialType } from '@nestjs/swagger';
import { CreateShopFloorControlDto } from './create-shop-floor-control.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { ShopFloorStatus } from '../entities/shop-floor-control.entity';

export class UpdateShopFloorControlDto extends PartialType(CreateShopFloorControlDto) {
  @ApiPropertyOptional({ description: 'Status', enum: ShopFloorStatus })
  @IsEnum(ShopFloorStatus)
  @IsOptional()
  status?: ShopFloorStatus;

  @ApiPropertyOptional({ description: 'Updated by' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
