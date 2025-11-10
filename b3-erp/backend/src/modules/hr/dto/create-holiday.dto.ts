import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HolidayType, HolidayStatus } from '../entities/holiday.entity';

export class CreateHolidayDto {
  @ApiProperty({ description: 'Holiday name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiProperty({ description: 'Holiday date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  date: string;

  @ApiProperty({ description: 'Holiday type', enum: HolidayType })
  @IsEnum(HolidayType)
  type: HolidayType;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Is paid', default: true })
  @IsBoolean()
  @IsOptional()
  isPaid?: boolean;

  @ApiPropertyOptional({ description: 'Number of days', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  numberOfDays?: number;

  @ApiPropertyOptional({ description: 'Applicable locations', type: [String] })
  @IsArray()
  @IsOptional()
  applicableLocations?: string[];

  @ApiPropertyOptional({ description: 'Applicable departments', type: [String] })
  @IsArray()
  @IsOptional()
  applicableDepartments?: string[];

  @ApiPropertyOptional({ description: 'Applicable employee types', type: [String] })
  @IsArray()
  @IsOptional()
  applicableEmployeeTypes?: string[];

  @ApiPropertyOptional({ description: 'Is floating holiday', default: false })
  @IsBoolean()
  @IsOptional()
  isFloating?: boolean;

  @ApiPropertyOptional({ description: 'Year' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  year?: number;

  @ApiPropertyOptional({ description: 'Status', enum: HolidayStatus })
  @IsEnum(HolidayStatus)
  @IsOptional()
  status?: HolidayStatus;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
