import {
  IsString,
  IsArray,
  IsNotEmpty,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class AssignPermissionDto {
  @ApiProperty({ description: 'Role ID' })
  @IsString()
  @IsNotEmpty()
  roleId: string;

  @ApiProperty({ description: 'Permission IDs', type: [String] })
  @IsArray()
  @IsNotEmpty()
  permissionIds: string[];

  @ApiPropertyOptional({ description: 'Grant permissions', default: true })
  @IsBoolean()
  @IsOptional()
  isGranted?: boolean;
}

export class AssignRoleDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Role IDs', type: [String] })
  @IsArray()
  @IsNotEmpty()
  roleIds: string[];

  @ApiPropertyOptional({ description: 'Primary role ID' })
  @IsString()
  @IsOptional()
  primaryRoleId?: string;
}
