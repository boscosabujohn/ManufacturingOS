import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillCategoryStatus } from '../entities/skill-category.entity';

export class SkillCategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  color?: string;

  @ApiProperty()
  sortOrder: number;

  @ApiProperty({ enum: SkillCategoryStatus })
  status: SkillCategoryStatus;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
