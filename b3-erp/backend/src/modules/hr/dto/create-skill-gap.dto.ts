import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsString, IsOptional, IsEnum, IsInt, IsNumber, IsArray, IsDateString, Min, Max } from 'class-validator';
import { SkillGapStatus, SkillGapPriority, SkillGapCategory } from '../entities/skill-gap.entity';

export class CreateSkillGapDto {
  @ApiProperty({ description: 'Unique code for the skill gap' })
  @IsString()
  code: string;

  @ApiProperty({ description: 'Name of the skill gap' })
  @IsString()
  name: string;

  @ApiPropertyOptional({ description: 'Description of the skill gap' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: SkillGapCategory })
  @IsOptional()
  @IsEnum(SkillGapCategory)
  category?: SkillGapCategory;

  @ApiPropertyOptional({ description: 'Role ID this gap applies to' })
  @IsOptional()
  @IsString()
  roleId?: string;

  @ApiPropertyOptional({ description: 'Role name' })
  @IsOptional()
  @IsString()
  roleName?: string;

  @ApiPropertyOptional({ description: 'Department ID' })
  @IsOptional()
  @IsString()
  departmentId?: string;

  @ApiPropertyOptional({ description: 'Department name' })
  @IsOptional()
  @IsString()
  departmentName?: string;

  @ApiProperty({ description: 'Skill ID for this gap' })
  @IsString()
  skillId: string;

  @ApiPropertyOptional({ description: 'Required proficiency level (1-5)', default: 3 })
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(5)
  requiredProficiencyLevel?: number;

  @ApiPropertyOptional({ description: 'Current average proficiency' })
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(5)
  currentAverageProficiency?: number;

  @ApiPropertyOptional({ description: 'Number of employees with this skill' })
  @IsOptional()
  @IsInt()
  @Min(0)
  employeesWithSkill?: number;

  @ApiPropertyOptional({ description: 'Number of employees required with this skill' })
  @IsOptional()
  @IsInt()
  @Min(0)
  employeesRequired?: number;

  @ApiPropertyOptional({ description: 'Gap percentage' })
  @IsOptional()
  @IsNumber()
  gapPercentage?: number;

  @ApiPropertyOptional({ enum: SkillGapPriority })
  @IsOptional()
  @IsEnum(SkillGapPriority)
  priority?: SkillGapPriority;

  @ApiPropertyOptional({ description: 'Business impact of this gap' })
  @IsOptional()
  @IsString()
  impact?: string;

  @ApiPropertyOptional({ description: 'Recommended actions' })
  @IsOptional()
  @IsString()
  recommendation?: string;

  @ApiPropertyOptional({ description: 'Training plan to address gap' })
  @IsOptional()
  @IsString()
  trainingPlan?: string;

  @ApiPropertyOptional({ description: 'Target date to close gap' })
  @IsOptional()
  @IsDateString()
  targetDate?: string;

  @ApiPropertyOptional({ description: 'Required competencies' })
  @IsOptional()
  @IsArray()
  requiredCompetencies?: string[];

  @ApiPropertyOptional({ description: 'Related training IDs' })
  @IsOptional()
  @IsArray()
  relatedTrainingIds?: string[];

  @ApiPropertyOptional({ enum: SkillGapStatus })
  @IsOptional()
  @IsEnum(SkillGapStatus)
  status?: SkillGapStatus;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
