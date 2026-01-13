import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillStatus, SkillType } from '../entities/skill.entity';
import { SkillCategoryResponseDto } from './skill-category-response.dto';

export class SkillResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  useCases?: string;

  @ApiPropertyOptional()
  categoryId?: string;

  @ApiPropertyOptional()
  category?: SkillCategoryResponseDto;

  @ApiProperty({ enum: SkillType })
  skillType: SkillType;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional()
  tags?: string[];

  @ApiPropertyOptional()
  relatedSkillCodes?: string[];

  @ApiProperty()
  requiresCertification: boolean;

  @ApiPropertyOptional()
  certificationUrl?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty({ enum: SkillStatus })
  status: SkillStatus;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
