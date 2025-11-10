import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AlertType, AlertSeverity } from '../entities/quality-alert.entity';

export class CreateQualityAlertDto {
  @ApiProperty({ description: 'Alert number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  alertNumber: string;

  @ApiProperty({ description: 'Title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ description: 'Alert type', enum: AlertType })
  @IsEnum(AlertType)
  alertType: AlertType;

  @ApiPropertyOptional({ description: 'Severity', enum: AlertSeverity })
  @IsEnum(AlertSeverity)
  @IsOptional()
  severity?: AlertSeverity;

  @ApiPropertyOptional({ description: 'Source type' })
  @IsString()
  @IsOptional()
  sourceType?: string;

  @ApiPropertyOptional({ description: 'Source ID' })
  @IsString()
  @IsOptional()
  sourceId?: string;

  @ApiPropertyOptional({ description: 'Item ID' })
  @IsString()
  @IsOptional()
  itemId?: string;

  @ApiProperty({ description: 'Alert date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  alertDate: string;

  @ApiPropertyOptional({ description: 'Assigned to ID' })
  @IsString()
  @IsOptional()
  assignedToId?: string;

  @ApiPropertyOptional({ description: 'Assigned to name' })
  @IsString()
  @IsOptional()
  assignedToName?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Created by' })
  @IsString()
  @IsOptional()
  createdBy?: string;
}
