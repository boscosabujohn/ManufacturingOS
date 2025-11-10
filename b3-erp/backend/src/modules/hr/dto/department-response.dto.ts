import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DepartmentStatus } from '../entities/department.entity';

export class DepartmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  code: string;

  @ApiProperty()
  name: string;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  parentDepartmentId?: string;

  @ApiPropertyOptional()
  headOfDepartmentId?: string;

  @ApiPropertyOptional()
  headOfDepartmentName?: string;

  @ApiPropertyOptional()
  costCenterId?: string;

  @ApiPropertyOptional()
  costCenterName?: string;

  @ApiPropertyOptional()
  location?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiProperty({ enum: DepartmentStatus })
  status: DepartmentStatus;

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
