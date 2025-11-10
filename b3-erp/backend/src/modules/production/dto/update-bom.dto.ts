import { PartialType } from '@nestjs/swagger';
import { CreateBOMDto } from './create-bom.dto';
import { IsEnum, IsOptional } from 'class-validator';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { BOMStatus } from '../entities/bom.entity';

export class UpdateBOMDto extends PartialType(CreateBOMDto) {
  @ApiPropertyOptional({ description: 'BOM status', enum: BOMStatus })
  @IsEnum(BOMStatus)
  @IsOptional()
  status?: BOMStatus;

  @ApiPropertyOptional({ description: 'Updated by' })
  @IsOptional()
  updatedBy?: string;
}
