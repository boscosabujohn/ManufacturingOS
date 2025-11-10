import { PartialType } from '@nestjs/swagger';
import { CreateRoutingDto } from './create-routing.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { RoutingStatus } from '../entities/routing.entity';

export class UpdateRoutingDto extends PartialType(CreateRoutingDto) {
  @ApiPropertyOptional({ description: 'Routing status', enum: RoutingStatus })
  @IsEnum(RoutingStatus)
  @IsOptional()
  status?: RoutingStatus;

  @ApiPropertyOptional({ description: 'Updated by' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
