import { PartialType } from '@nestjs/swagger';
import { CreateBatchNumberDto } from './create-batch-number.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { BatchStatus } from '../entities/batch-number.entity';

export class UpdateBatchNumberDto extends PartialType(CreateBatchNumberDto) {
  @ApiPropertyOptional({
    description: 'Batch status',
    enum: BatchStatus,
  })
  @IsEnum(BatchStatus)
  @IsOptional()
  status?: BatchStatus;
}
