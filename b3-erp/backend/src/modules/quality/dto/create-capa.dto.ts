import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CAPAPriority, CAPAType } from '../entities/capa.entity';

export class CreateCAPADto {
  @ApiProperty({ description: 'CAPA number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  capaNumber: string;

  @ApiProperty({ description: 'Title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Priority', enum: CAPAPriority })
  @IsEnum(CAPAPriority)
  @IsOptional()
  priority?: CAPAPriority;

  @ApiPropertyOptional({ description: 'CAPA type', enum: CAPAType })
  @IsEnum(CAPAType)
  @IsOptional()
  capaType?: CAPAType;

  @ApiPropertyOptional({ description: 'NCR ID' })
  @IsString()
  @IsOptional()
  ncrId?: string;

  @ApiProperty({ description: 'Problem statement' })
  @IsString()
  @IsNotEmpty()
  problemStatement: string;

  @ApiProperty({ description: 'Root cause analysis' })
  @IsString()
  @IsNotEmpty()
  rootCauseAnalysis: string;

  @ApiProperty({ description: 'Action plan' })
  @IsString()
  @IsNotEmpty()
  actionPlan: string;

  @ApiPropertyOptional({ description: 'Owner ID' })
  @IsString()
  @IsOptional()
  ownerId?: string;

  @ApiPropertyOptional({ description: 'Owner name' })
  @IsString()
  @IsOptional()
  ownerName?: string;

  @ApiProperty({ description: 'Target date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  targetDate: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
