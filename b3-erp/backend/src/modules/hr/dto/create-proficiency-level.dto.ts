import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsInt,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProficiencyLevelStatus } from '../entities/proficiency-level.entity';

export class CreateProficiencyLevelDto {
  @ApiProperty({ description: 'Proficiency level code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Proficiency level name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ description: 'Level number (1-5)' })
  @IsInt()
  level: number;

  @ApiPropertyOptional({ description: 'Color code' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({ description: 'Icon name or URL' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: 'Criteria for this level' })
  @IsString()
  @IsOptional()
  criteria?: string;

  @ApiPropertyOptional({ description: 'Status', enum: ProficiencyLevelStatus })
  @IsEnum(ProficiencyLevelStatus)
  @IsOptional()
  status?: ProficiencyLevelStatus;
}
