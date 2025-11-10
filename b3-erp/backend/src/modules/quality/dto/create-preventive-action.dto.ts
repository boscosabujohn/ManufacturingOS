import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PreventiveActionPriority, PreventiveActionType } from '../entities/preventive-action.entity';

export class CreatePreventiveActionDto {
  @ApiProperty({ description: 'PA number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  paNumber: string;

  @ApiProperty({ description: 'Title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Priority', enum: PreventiveActionPriority })
  @IsEnum(PreventiveActionPriority)
  @IsOptional()
  priority?: PreventiveActionPriority;

  @ApiPropertyOptional({ description: 'Action type', enum: PreventiveActionType })
  @IsEnum(PreventiveActionType)
  @IsOptional()
  actionType?: PreventiveActionType;

  @ApiProperty({ description: 'Risk/Opportunity' })
  @IsString()
  @IsNotEmpty()
  riskOpportunity: string;

  @ApiProperty({ description: 'Action plan' })
  @IsString()
  @IsNotEmpty()
  actionPlan: string;

  @ApiPropertyOptional({ description: 'Assigned to ID' })
  @IsString()
  @IsOptional()
  assignedToId?: string;

  @ApiPropertyOptional({ description: 'Assigned to name' })
  @IsString()
  @IsOptional()
  assignedToName?: string;

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
