import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { UOMType } from '../entities/uom.entity';

export class CreateUomDto {
  @ApiProperty({ description: 'Unique UOM code', maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  uomCode: string;

  @ApiProperty({ description: 'UOM name', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  uomName: string;

  @ApiProperty({ enum: UOMType, description: 'Type of unit of measure' })
  @IsEnum(UOMType)
  uomType: UOMType;

  @ApiPropertyOptional({ maxLength: 20 })
  @IsString()
  @MaxLength(20)
  @IsOptional()
  symbol?: string;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  // Conversion
  @ApiPropertyOptional({ description: 'Base UOM ID for conversion' })
  @IsString()
  @IsOptional()
  baseUOMId?: string;

  @ApiPropertyOptional({ default: 1, description: 'Conversion factor relative to base UOM' })
  @IsNumber()
  @Min(0)
  @IsOptional()
  conversionFactor?: number;

  // For fractional UOMs
  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  allowFractional?: boolean;

  @ApiPropertyOptional({ default: 2 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  decimalPlaces?: number;

  // Metadata
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  createdBy?: string;
}
