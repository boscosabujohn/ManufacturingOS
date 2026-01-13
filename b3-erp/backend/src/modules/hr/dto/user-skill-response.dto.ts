import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { UserSkillStatus } from '../entities/user-skill.entity';
import { SkillResponseDto } from './skill-response.dto';

export class UserSkillResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  skillId: string;

  @ApiPropertyOptional()
  skill?: SkillResponseDto;

  @ApiPropertyOptional()
  proficiencyLevelId?: string;

  @ApiProperty()
  proficiencyLevel: number;

  @ApiPropertyOptional()
  yearsOfExperience?: number;

  @ApiPropertyOptional()
  lastAssessmentDate?: Date;

  @ApiPropertyOptional()
  certificationDate?: Date;

  @ApiPropertyOptional()
  certificationExpiryDate?: Date;

  @ApiPropertyOptional()
  certificateUrl?: string;

  @ApiPropertyOptional()
  certificateNumber?: string;

  @ApiPropertyOptional()
  verifiedById?: string;

  @ApiPropertyOptional()
  verifiedByName?: string;

  @ApiPropertyOptional()
  verifiedAt?: Date;

  @ApiPropertyOptional()
  verificationNotes?: string;

  @ApiProperty()
  isEnabled: boolean;

  @ApiProperty({ enum: UserSkillStatus })
  status: UserSkillStatus;

  @ApiPropertyOptional()
  notes?: string;

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
