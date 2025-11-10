import { PartialType } from '@nestjs/swagger';
import { CreateOperationDto } from './create-operation.dto';
import { IsEnum, IsOptional, IsString } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { OperationStatus } from '../entities/operation.entity';

export class UpdateOperationDto extends PartialType(CreateOperationDto) {
  @ApiPropertyOptional({ description: 'Operation status', enum: OperationStatus })
  @IsEnum(OperationStatus)
  @IsOptional()
  status?: OperationStatus;

  @ApiPropertyOptional({ description: 'Updated by' })
  @IsString()
  @IsOptional()
  updatedBy?: string;
}
