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
import { PeriodType } from '../entities/financial-period.entity';

export class CreateFinancialPeriodDto {
  @ApiProperty({ description: 'Financial year ID' })
  @IsString()
  @IsNotEmpty()
  financialYearId: string;

  @ApiProperty({ description: 'Period code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  periodCode: string;

  @ApiProperty({ description: 'Period name', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  periodName: string;

  @ApiProperty({ description: 'Period type', enum: PeriodType })
  @IsEnum(PeriodType)
  @IsNotEmpty()
  periodType: PeriodType;

  @ApiProperty({ description: 'Period number (1-12 for months, 1-4 for quarters)' })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  periodNumber: number;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateFinancialYearDto {
  @ApiProperty({ description: 'Year code', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  yearCode: string;

  @ApiProperty({ description: 'Year name', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  yearName: string;

  @ApiProperty({ description: 'Start date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  startDate: string;

  @ApiProperty({ description: 'End date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  endDate: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;
}
