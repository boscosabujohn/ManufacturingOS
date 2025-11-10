import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsBoolean,
  IsArray,
  MaxLength,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ParameterType, ParameterDataType, ParameterCriticality } from '../entities/qc-parameter.entity';

export class CreateQCParameterDto {
  @ApiProperty({ description: 'QC Template ID' })
  @IsString()
  @IsNotEmpty()
  qcTemplateId: string;

  @ApiProperty({ description: 'Parameter code', maxLength: 100 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  parameterCode: string;

  @ApiProperty({ description: 'Parameter name', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  parameterName: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Parameter type', enum: ParameterType })
  @IsEnum(ParameterType)
  parameterType: ParameterType;

  @ApiProperty({ description: 'Data type', enum: ParameterDataType })
  @IsEnum(ParameterDataType)
  dataType: ParameterDataType;

  @ApiPropertyOptional({ description: 'Criticality', enum: ParameterCriticality })
  @IsEnum(ParameterCriticality)
  @IsOptional()
  criticality?: ParameterCriticality;

  @ApiProperty({ description: 'Sequence' })
  @IsNumber()
  @IsNotEmpty()
  sequence: number;

  @ApiPropertyOptional({ description: 'Is mandatory' })
  @IsBoolean()
  @IsOptional()
  isMandatory?: boolean;

  @ApiPropertyOptional({ description: 'Unit of measure' })
  @IsString()
  @IsOptional()
  uom?: string;

  @ApiPropertyOptional({ description: 'Nominal value' })
  @IsNumber()
  @IsOptional()
  nominalValue?: number;

  @ApiPropertyOptional({ description: 'Lower spec limit' })
  @IsNumber()
  @IsOptional()
  lowerSpecLimit?: number;

  @ApiPropertyOptional({ description: 'Upper spec limit' })
  @IsNumber()
  @IsOptional()
  upperSpecLimit?: number;

  @ApiPropertyOptional({ description: 'Target value' })
  @IsNumber()
  @IsOptional()
  targetValue?: number;

  @ApiPropertyOptional({ description: 'Tolerance' })
  @IsNumber()
  @IsOptional()
  tolerance?: number;

  @ApiPropertyOptional({ description: 'Allowed values for select type' })
  @IsArray()
  @IsOptional()
  allowedValues?: string[];

  @ApiPropertyOptional({ description: 'Measuring instrument' })
  @IsString()
  @IsOptional()
  measuringInstrument?: string;

  @ApiPropertyOptional({ description: 'Test method' })
  @IsString()
  @IsOptional()
  testMethod?: string;

  @ApiPropertyOptional({ description: 'Enable SPC' })
  @IsBoolean()
  @IsOptional()
  enableSPC?: boolean;

  @ApiPropertyOptional({ description: 'Auto reject on failure' })
  @IsBoolean()
  @IsOptional()
  autoRejectOnFailure?: boolean;

  @ApiPropertyOptional({ description: 'Inspection instructions' })
  @IsString()
  @IsOptional()
  inspectionInstructions?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
