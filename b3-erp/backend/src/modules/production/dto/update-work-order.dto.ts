import { PartialType } from '@nestjs/swagger';
import { CreateWorkOrderDto } from './create-work-order.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkOrderStatus } from '../entities/work-order.entity';

export class UpdateWorkOrderDto extends PartialType(CreateWorkOrderDto) {
  @ApiPropertyOptional({ description: 'Work order status', enum: WorkOrderStatus })
  @IsEnum(WorkOrderStatus)
  @IsOptional()
  status?: WorkOrderStatus;

  @ApiPropertyOptional({ description: 'Updated by' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
