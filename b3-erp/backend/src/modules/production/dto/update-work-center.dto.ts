import { PartialType } from '@nestjs/swagger';
import { CreateWorkCenterDto } from './create-work-center.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { WorkCenterStatus } from '../entities/work-center.entity';

export class UpdateWorkCenterDto extends PartialType(CreateWorkCenterDto) {
  @ApiPropertyOptional({ description: 'Work center status', enum: WorkCenterStatus })
  @IsEnum(WorkCenterStatus)
  @IsOptional()
  status?: WorkCenterStatus;

  @ApiPropertyOptional({ description: 'Updated by' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
