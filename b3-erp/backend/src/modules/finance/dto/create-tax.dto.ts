import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaxType, TaxCategory } from '../entities/tax.entity';

export class CreateTaxMasterDto {
  @ApiProperty({ description: 'Unique tax code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  taxCode: string;

  @ApiProperty({ description: 'Tax name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  taxName: string;

  @ApiProperty({ description: 'Tax type', enum: TaxType })
  @IsEnum(TaxType)
  @IsNotEmpty()
  taxType: TaxType;

  @ApiProperty({ description: 'Tax category', enum: TaxCategory })
  @IsEnum(TaxCategory)
  @IsNotEmpty()
  taxCategory: TaxCategory;

  @ApiProperty({ description: 'Tax rate (%)' })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  taxRate: number;

  @ApiProperty({ description: 'Effective from date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  effectiveFrom: string;

  @ApiPropertyOptional({ description: 'Effective to date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  effectiveTo?: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Tax payable account ID' })
  @IsString()
  @IsOptional()
  taxPayableAccountId?: string;

  @ApiPropertyOptional({ description: 'Tax receivable account ID' })
  @IsString()
  @IsOptional()
  taxReceivableAccountId?: string;

  @ApiPropertyOptional({ description: 'Tax expense account ID' })
  @IsString()
  @IsOptional()
  taxExpenseAccountId?: string;
}
