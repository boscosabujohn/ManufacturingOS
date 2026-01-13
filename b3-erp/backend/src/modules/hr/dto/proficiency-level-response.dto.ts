import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ProficiencyLevelStatus } from '../entities/proficiency-level.entity';

export class ProficiencyLevelResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  level: number;

  @ApiPropertyOptional()
  color?: string;

  @ApiPropertyOptional()
  icon?: string;

  @ApiPropertyOptional()
  criteria?: string;

  @ApiProperty({ enum: ProficiencyLevelStatus })
  status: ProficiencyLevelStatus;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
