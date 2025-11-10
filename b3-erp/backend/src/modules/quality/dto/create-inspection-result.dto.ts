import {
  IsString,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateInspectionResultDto {
  @ApiProperty({ description: 'Inspection ID' })
  @IsString()
  @IsNotEmpty()
  inspectionId: string;

  @ApiProperty({ description: 'Parameter name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  parameterName: string;

  @ApiProperty({ description: 'Sequence' })
  @IsNumber()
  @IsNotEmpty()
  sequence: number;

  @ApiPropertyOptional({ description: 'QC Parameter ID' })
  @IsString()
  @IsOptional()
  qcParameterId?: string;

  @ApiPropertyOptional({ description: 'Measured value (text)' })
  @IsString()
  @IsOptional()
  measuredValue?: string;

  @ApiPropertyOptional({ description: 'Numeric value' })
  @IsNumber()
  @IsOptional()
  numericValue?: number;

  @ApiPropertyOptional({ description: 'UOM' })
  @IsString()
  @IsOptional()
  uom?: string;

  @ApiPropertyOptional({ description: 'Lower spec limit' })
  @IsNumber()
  @IsOptional()
  lowerSpecLimit?: number;

  @ApiPropertyOptional({ description: 'Upper spec limit' })
  @IsNumber()
  @IsOptional()
  upperSpecLimit?: number;

  @ApiPropertyOptional({ description: 'Has defect' })
  @IsBoolean()
  @IsOptional()
  hasDefect?: boolean;

  @ApiPropertyOptional({ description: 'Defect description' })
  @IsString()
  @IsOptional()
  defectDescription?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
