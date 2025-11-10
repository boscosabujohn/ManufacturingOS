import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsNumber,
  IsArray,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DesignationLevel, DesignationStatus } from '../entities/designation.entity';

export class CreateDesignationDto {
  @ApiProperty({ description: 'Designation code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Designation title' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  title: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Level', enum: DesignationLevel })
  @IsEnum(DesignationLevel)
  level: DesignationLevel;

  @ApiPropertyOptional({ description: 'Reports to designation ID' })
  @IsString()
  @IsOptional()
  reportsTo?: string;

  @ApiPropertyOptional({ description: 'Reports to title' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  reportsToTitle?: string;

  @ApiPropertyOptional({ description: 'Grade level', default: 1 })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  gradeLevel?: number;

  @ApiPropertyOptional({ description: 'Minimum salary' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minSalary?: number;

  @ApiPropertyOptional({ description: 'Maximum salary' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  maxSalary?: number;

  @ApiPropertyOptional({ description: 'Responsibilities', type: [String] })
  @IsArray()
  @IsOptional()
  responsibilities?: string[];

  @ApiPropertyOptional({ description: 'Required skills', type: [String] })
  @IsArray()
  @IsOptional()
  requiredSkills?: string[];

  @ApiPropertyOptional({ description: 'Qualifications', type: [String] })
  @IsArray()
  @IsOptional()
  qualifications?: string[];

  @ApiPropertyOptional({ description: 'Minimum experience in years' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  minExperience?: number;

  @ApiPropertyOptional({ description: 'Status', enum: DesignationStatus })
  @IsEnum(DesignationStatus)
  @IsOptional()
  status?: DesignationStatus;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
