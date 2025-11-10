import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ChargeType,
  CalculationMethod,
  TaxType,
} from '../entities/freight-charge.entity';

export class CreateFreightChargeDto {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  shipmentId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  tripId?: string;

  @ApiProperty({ enum: ChargeType })
  @IsEnum(ChargeType)
  chargeType: ChargeType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  chargeName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ enum: CalculationMethod })
  @IsEnum(CalculationMethod)
  @IsOptional()
  calculationMethod?: CalculationMethod;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  quantity?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  unit?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  rate?: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  baseAmount: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountPercentage?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  discountAmount?: number;

  @ApiProperty({ enum: TaxType })
  @IsEnum(TaxType)
  @IsOptional()
  taxType?: TaxType;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  taxPercentage?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  taxAmount?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  payableBy?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  transportCompanyId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
