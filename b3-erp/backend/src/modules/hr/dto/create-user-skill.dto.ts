import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsInt,
  IsNumber,
  IsBoolean,
  IsDateString,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserSkillStatus } from '../entities/user-skill.entity';

export class CreateUserSkillDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Skill ID' })
  @IsString()
  @IsNotEmpty()
  skillId: string;

  @ApiPropertyOptional({ description: 'Proficiency level ID' })
  @IsString()
  @IsOptional()
  proficiencyLevelId?: string;

  @ApiPropertyOptional({ description: 'Proficiency level (1-5)' })
  @IsInt()
  @IsOptional()
  proficiencyLevel?: number;

  @ApiPropertyOptional({ description: 'Years of experience' })
  @IsNumber()
  @IsOptional()
  yearsOfExperience?: number;

  @ApiPropertyOptional({ description: 'Last assessment date' })
  @IsDateString()
  @IsOptional()
  lastAssessmentDate?: string;

  @ApiPropertyOptional({ description: 'Certification date' })
  @IsDateString()
  @IsOptional()
  certificationDate?: string;

  @ApiPropertyOptional({ description: 'Certification expiry date' })
  @IsDateString()
  @IsOptional()
  certificationExpiryDate?: string;

  @ApiPropertyOptional({ description: 'Certificate URL' })
  @IsString()
  @IsOptional()
  certificateUrl?: string;

  @ApiPropertyOptional({ description: 'Certificate number' })
  @IsString()
  @IsOptional()
  certificateNumber?: string;

  @ApiPropertyOptional({ description: 'Is skill enabled' })
  @IsBoolean()
  @IsOptional()
  isEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Status', enum: UserSkillStatus })
  @IsEnum(UserSkillStatus)
  @IsOptional()
  status?: UserSkillStatus;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsObject()
  @IsOptional()
  metadata?: Record<string, any>;
}
