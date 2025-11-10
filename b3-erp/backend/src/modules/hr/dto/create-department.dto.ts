import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  MaxLength,
  IsEmail,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DepartmentStatus } from '../entities/department.entity';

export class CreateDepartmentDto {
  @ApiProperty({ description: 'Department code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  code: string;

  @ApiProperty({ description: 'Department name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Department description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Parent department ID' })
  @IsString()
  @IsOptional()
  parentDepartmentId?: string;

  @ApiPropertyOptional({ description: 'Head of department employee ID' })
  @IsString()
  @IsOptional()
  headOfDepartmentId?: string;

  @ApiPropertyOptional({ description: 'Head of department name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  headOfDepartmentName?: string;

  @ApiPropertyOptional({ description: 'Cost center ID' })
  @IsString()
  @IsOptional()
  costCenterId?: string;

  @ApiPropertyOptional({ description: 'Cost center name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  costCenterName?: string;

  @ApiPropertyOptional({ description: 'Location' })
  @IsString()
  @IsOptional()
  location?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Status', enum: DepartmentStatus })
  @IsEnum(DepartmentStatus)
  @IsOptional()
  status?: DepartmentStatus;

  @ApiPropertyOptional({ description: 'Additional metadata' })
  @IsOptional()
  metadata?: Record<string, any>;
}
