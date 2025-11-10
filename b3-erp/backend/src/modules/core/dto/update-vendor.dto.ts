import { PartialType } from '@nestjs/swagger';
import { CreateVendorDto } from './create-vendor.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, MaxLength, IsOptional } from 'class-validator';

export class UpdateVendorDto extends PartialType(CreateVendorDto) {
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  updatedBy?: string;
}
