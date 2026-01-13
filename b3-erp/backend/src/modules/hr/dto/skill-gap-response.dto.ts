import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { SkillGapStatus, SkillGapPriority, SkillGapCategory } from '../entities/skill-gap.entity';
import { SkillResponseDto } from './skill-response.dto';

export class SkillGapResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: SkillGapCategory })
  category: SkillGapCategory;

  @ApiPropertyOptional()
  roleId?: string;

  @ApiPropertyOptional()
  roleName?: string;

  @ApiPropertyOptional()
  departmentId?: string;

  @ApiPropertyOptional()
  departmentName?: string;

  @ApiProperty()
  skillId: string;

  @ApiPropertyOptional()
  skill?: SkillResponseDto;

  @ApiProperty()
  requiredProficiencyLevel: number;

  @ApiProperty()
  currentAverageProficiency: number;

  @ApiProperty()
  employeesWithSkill: number;

  @ApiProperty()
  employeesRequired: number;

  @ApiProperty()
  gapPercentage: number;

  @ApiProperty({ enum: SkillGapPriority })
  priority: SkillGapPriority;

  @ApiPropertyOptional()
  impact?: string;

  @ApiPropertyOptional()
  recommendation?: string;

  @ApiPropertyOptional()
  trainingPlan?: string;

  @ApiPropertyOptional()
  targetDate?: Date;

  @ApiPropertyOptional()
  requiredCompetencies?: string[];

  @ApiPropertyOptional()
  relatedTrainingIds?: string[];

  @ApiProperty({ enum: SkillGapStatus })
  status: SkillGapStatus;

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
