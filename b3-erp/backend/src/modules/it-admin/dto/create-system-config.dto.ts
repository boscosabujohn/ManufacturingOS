import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ConfigCategory,
  ConfigDataType,
  ConfigStatus,
} from '../entities/system-config.entity';

export class CreateSystemConfigDto {
  @ApiProperty({ description: 'Config key (unique)', example: 'password.min_length' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9._-]+$/, {
    message: 'Config key must be lowercase letters, numbers, dots, underscores, and hyphens',
  })
  key: string;

  @ApiProperty({ description: 'Config name', example: 'Minimum Password Length' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Config value', example: '8' })
  @IsString()
  @IsNotEmpty()
  value: string;

  @ApiPropertyOptional({ description: 'Default value', example: '8' })
  @IsString()
  @IsOptional()
  defaultValue?: string;

  @ApiPropertyOptional({ description: 'Category', enum: ConfigCategory })
  @IsEnum(ConfigCategory)
  @IsOptional()
  category?: ConfigCategory;

  @ApiPropertyOptional({ description: 'Data type', enum: ConfigDataType })
  @IsEnum(ConfigDataType)
  @IsOptional()
  dataType?: ConfigDataType;

  @ApiPropertyOptional({ description: 'Status', enum: ConfigStatus })
  @IsEnum(ConfigStatus)
  @IsOptional()
  status?: ConfigStatus;

  @ApiPropertyOptional({ description: 'Is encrypted', default: false })
  @IsBoolean()
  @IsOptional()
  isEncrypted?: boolean;

  @ApiPropertyOptional({ description: 'Is editable', default: true })
  @IsBoolean()
  @IsOptional()
  isEditable?: boolean;

  @ApiPropertyOptional({ description: 'Requires restart', default: false })
  @IsBoolean()
  @IsOptional()
  requiresRestart?: boolean;

  @ApiPropertyOptional({ description: 'Allowed values', type: [String] })
  @IsArray()
  @IsOptional()
  allowedValues?: string[];

  @ApiPropertyOptional({ description: 'Module name' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  module?: string;
}
