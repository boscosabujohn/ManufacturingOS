import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  IsNumber,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { AuditAction, AuditSeverity } from '../entities/audit-log.entity';

export class CreateAuditLogDto {
  @ApiPropertyOptional({ description: 'User ID' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Username' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  username?: string;

  @ApiProperty({ description: 'Module name', example: 'inventory' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  module: string;

  @ApiProperty({ description: 'Action', enum: AuditAction })
  @IsEnum(AuditAction)
  action: AuditAction;

  @ApiProperty({ description: 'Description', example: 'User logged in successfully' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  description: string;

  @ApiPropertyOptional({ description: 'Entity type', example: 'Product' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  entityType?: string;

  @ApiPropertyOptional({ description: 'Entity ID' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  entityId?: string;

  @ApiPropertyOptional({ description: 'Entity name' })
  @IsString()
  @IsOptional()
  @MaxLength(200)
  entityName?: string;

  @ApiPropertyOptional({ description: 'Old values' })
  @IsOptional()
  oldValues?: Record<string, any>;

  @ApiPropertyOptional({ description: 'New values' })
  @IsOptional()
  newValues?: Record<string, any>;

  @ApiPropertyOptional({ description: 'Severity', enum: AuditSeverity })
  @IsEnum(AuditSeverity)
  @IsOptional()
  severity?: AuditSeverity;

  @ApiPropertyOptional({ description: 'IP address' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  ipAddress?: string;

  @ApiPropertyOptional({ description: 'User agent' })
  @IsString()
  @IsOptional()
  userAgent?: string;

  @ApiPropertyOptional({ description: 'Session ID' })
  @IsString()
  @IsOptional()
  sessionId?: string;

  @ApiPropertyOptional({ description: 'Success status', default: true })
  @IsBoolean()
  @IsOptional()
  success?: boolean;

  @ApiPropertyOptional({ description: 'Error message' })
  @IsString()
  @IsOptional()
  errorMessage?: string;

  @ApiPropertyOptional({ description: 'Additional data' })
  @IsOptional()
  additionalData?: Record<string, any>;
}
