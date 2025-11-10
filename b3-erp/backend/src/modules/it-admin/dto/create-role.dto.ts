import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  MinLength,
  MaxLength,
  Matches,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RoleType, RoleStatus } from '../entities/role.entity';

export class CreateRoleDto {
  @ApiProperty({ description: 'Role code (unique)', example: 'ADMIN' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  @MaxLength(50)
  @Matches(/^[A-Z0-9_]+$/, {
    message: 'Role code must be uppercase letters, numbers, and underscores only',
  })
  code: string;

  @ApiProperty({ description: 'Role name', example: 'Administrator' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  name: string;

  @ApiPropertyOptional({ description: 'Role description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Role type', enum: RoleType })
  @IsEnum(RoleType)
  @IsOptional()
  roleType?: RoleType;

  @ApiPropertyOptional({ description: 'Status', enum: RoleStatus })
  @IsEnum(RoleStatus)
  @IsOptional()
  status?: RoleStatus;

  @ApiPropertyOptional({ description: 'Hierarchy level', example: 1 })
  @IsNumber()
  @IsOptional()
  hierarchyLevel?: number;

  @ApiPropertyOptional({ description: 'Parent role ID' })
  @IsString()
  @IsOptional()
  parentRoleId?: string;

  @ApiPropertyOptional({ description: 'Is default role for new users', default: false })
  @IsBoolean()
  @IsOptional()
  isDefault?: boolean;

  @ApiPropertyOptional({ description: 'Applicable modules', type: [String] })
  @IsArray()
  @IsOptional()
  applicableModules?: string[];

  @ApiPropertyOptional({ description: 'Permission IDs to assign', type: [String] })
  @IsArray()
  @IsOptional()
  permissionIds?: string[];
}
