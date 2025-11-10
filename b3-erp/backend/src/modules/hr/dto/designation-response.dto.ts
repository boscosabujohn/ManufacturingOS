import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DesignationLevel, DesignationStatus } from '../entities/designation.entity';

export class DesignationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  title: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty({ enum: DesignationLevel })
  level: DesignationLevel;

  @ApiPropertyOptional()
  reportsTo?: string;

  @ApiPropertyOptional()
  reportsToTitle?: string;

  @ApiProperty()
  gradeLevel: number;

  @ApiPropertyOptional()
  minSalary?: number;

  @ApiPropertyOptional()
  maxSalary?: number;

  @ApiPropertyOptional()
  responsibilities?: string[];

  @ApiPropertyOptional()
  requiredSkills?: string[];

  @ApiPropertyOptional()
  qualifications?: string[];

  @ApiPropertyOptional()
  minExperience?: number;

  @ApiProperty({ enum: DesignationStatus })
  status: DesignationStatus;

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
