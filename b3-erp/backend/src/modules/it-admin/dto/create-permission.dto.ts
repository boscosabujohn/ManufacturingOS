import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  Matches,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PermissionType, PermissionStatus } from '../entities/permission.entity';

export class CreatePermissionDto {
  @ApiProperty({ description: 'Permission code (unique)', example: 'inventory.view' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(100)
  @Matches(/^[a-z0-9._-]+$/, {
    message: 'Permission code must be lowercase letters, numbers, dots, underscores, and hyphens',
  })
  code: string;

  @ApiProperty({ description: 'Module name', example: 'inventory' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  module: string;

  @ApiProperty({ description: 'Action name', example: 'view' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  action: string;

  @ApiProperty({ description: 'Permission name', example: 'View Inventory' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(150)
  name: string;

  @ApiPropertyOptional({ description: 'Permission description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Permission type', enum: PermissionType })
  @IsEnum(PermissionType)
  @IsOptional()
  permissionType?: PermissionType;

  @ApiPropertyOptional({ description: 'Status', enum: PermissionStatus })
  @IsEnum(PermissionStatus)
  @IsOptional()
  status?: PermissionStatus;

  @ApiPropertyOptional({ description: 'Category', example: 'Operations' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({ description: 'Requires approval', default: false })
  @IsBoolean()
  @IsOptional()
  requiresApproval?: boolean;

  @ApiPropertyOptional({ description: 'Depends on permission codes', type: [String] })
  @IsArray()
  @IsOptional()
  dependsOn?: string[];

  @ApiPropertyOptional({ description: 'Conflicts with permission codes', type: [String] })
  @IsArray()
  @IsOptional()
  conflictsWith?: string[];

  @ApiPropertyOptional({ description: 'API endpoint', example: '/api/inventory' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  apiEndpoint?: string;

  @ApiPropertyOptional({ description: 'HTTP method', example: 'GET' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  httpMethod?: string;
}
