import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsInt,
  IsBoolean,
  IsArray,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillStatus, SkillType } from '../entities/skill.entity';

export class CreateSkillDto {
  @ApiProperty({ description: 'Skill code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Skill name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Use cases for this skill' })
  @IsString()
  @IsOptional()
  useCases?: string;

  @ApiPropertyOptional({ description: 'Category ID' })
  @IsString()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: 'Skill type', enum: SkillType })
  @IsEnum(SkillType)
  @IsOptional()
  skillType?: SkillType;

  @ApiPropertyOptional({ description: 'Icon name or URL' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: 'Color code' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  color?: string;

  @ApiPropertyOptional({ description: 'Tags for the skill' })
  @IsArray()
  @IsOptional()
  tags?: string[];

  @ApiPropertyOptional({ description: 'Related skill codes' })
  @IsArray()
  @IsOptional()
  relatedSkillCodes?: string[];

  @ApiPropertyOptional({ description: 'Requires certification' })
  @IsBoolean()
  @IsOptional()
  requiresCertification?: boolean;

  @ApiPropertyOptional({ description: 'Certification URL' })
  @IsString()
  @IsOptional()
  certificationUrl?: string;

  @ApiPropertyOptional({ description: 'Sort order' })
  @IsInt()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: 'Status', enum: SkillStatus })
  @IsEnum(SkillStatus)
  @IsOptional()
  status?: SkillStatus;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
