import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  MaxLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CorrectiveActionPriority } from '../entities/corrective-action.entity';

export class CreateCorrectiveActionDto {
  @ApiProperty({ description: 'CA number', maxLength: 50 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  caNumber: string;

  @ApiProperty({ description: 'Title', maxLength: 255 })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  title: string;

  @ApiProperty({ description: 'Description' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiPropertyOptional({ description: 'Priority', enum: CorrectiveActionPriority })
  @IsEnum(CorrectiveActionPriority)
  @IsOptional()
  priority?: CorrectiveActionPriority;

  @ApiPropertyOptional({ description: 'NCR ID' })
  @IsString()
  @IsOptional()
  ncrId?: string;

  @ApiProperty({ description: 'Problem statement' })
  @IsString()
  @IsNotEmpty()
  problemStatement: string;

  @ApiProperty({ description: 'Root cause' })
  @IsString()
  @IsNotEmpty()
  rootCause: string;

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
