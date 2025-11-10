import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NCRType, NCRSeverity, NCRPriority } from '../entities/non-conformance.entity';

export class CreateNonConformanceDto {
  @ApiProperty({ description: 'NCR number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  ncrNumber: string;

  @ApiProperty({ description: 'Title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'NCR type', enum: NCRType })
  @IsEnum(NCRType)
  ncrType: NCRType;

  @ApiProperty({ description: 'Severity', enum: NCRSeverity })
  @IsEnum(NCRSeverity)
  severity: NCRSeverity;

  @ApiPropertyOptional({ description: 'Priority', enum: NCRPriority })
  @IsEnum(NCRPriority)
  @IsOptional()
  priority?: NCRPriority;

  @ApiPropertyOptional({ description: 'Inspection ID' })
  @IsString()
  @IsOptional()
  inspectionId?: string;

  @ApiPropertyOptional({ description: 'Item ID' })
  @IsString()
  @IsOptional()
  itemId?: string;

  @ApiPropertyOptional({ description: 'Item code' })
  @IsString()
  @IsOptional()
  itemCode?: string;

  @ApiPropertyOptional({ description: 'Affected quantity' })
  @IsNumber()
  @IsOptional()
  affectedQuantity?: number;

  @ApiProperty({ description: 'Reported date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  reportedDate: string;

  @ApiPropertyOptional({ description: 'Reported by ID' })
  @IsString()
  @IsOptional()
  reportedById?: string;

  @ApiPropertyOptional({ description: 'Reported by name' })
  @IsString()
  @IsOptional()
  reportedByName?: string;

  @ApiPropertyOptional({ description: 'Defect description' })
  @IsString()
  @IsOptional()
  defectDescription?: string;

  @ApiPropertyOptional({ description: 'Immediate action' })
  @IsString()
  @IsOptional()
  immediateAction?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
