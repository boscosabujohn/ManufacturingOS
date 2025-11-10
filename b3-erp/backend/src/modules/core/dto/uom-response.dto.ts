import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UOMType } from '../entities/uom.entity';

export class UomResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  uomCode: string;

  @ApiProperty()
  uomName: string;

  @ApiProperty({ enum: UOMType })
  uomType: UOMType;

  @ApiPropertyOptional()
  symbol?: string;

  @ApiProperty()
  isActive: boolean;

  // Conversion
  @ApiPropertyOptional()
  baseUOMId?: string;

  @ApiProperty()
  conversionFactor: number;

  // For fractional UOMs
  @ApiProperty()
  allowFractional: boolean;

  @ApiProperty()
  decimalPlaces: number;

  // Metadata
  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
