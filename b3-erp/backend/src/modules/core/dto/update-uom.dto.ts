import { PartialType } from '@nestjs/swagger';
import { CreateUomDto } from './create-uom.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateUomDto extends PartialType(CreateUomDto) {
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  updatedBy?: string;
}
