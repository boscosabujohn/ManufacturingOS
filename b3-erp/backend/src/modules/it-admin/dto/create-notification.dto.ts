import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  IsArray,
  IsDateString,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  NotificationType,
  NotificationPriority,
  NotificationChannel,
} from '../entities/notification.entity';

export class CreateNotificationDto {
  @ApiProperty({ description: 'User ID or IDs', type: [String] })
  @IsArray()
  @IsNotEmpty()
  userIds: string[];

  @ApiPropertyOptional({ description: 'Notification type', enum: NotificationType })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiPropertyOptional({ description: 'Priority', enum: NotificationPriority })
  @IsEnum(NotificationPriority)
  @IsOptional()
  priority?: NotificationPriority;

  @ApiProperty({ description: 'Title', example: 'New message' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(200)
  title: string;

  @ApiProperty({ description: 'Message', example: 'You have a new message' })
  @IsString()
  @IsNotEmpty()
  message: string;

  @ApiPropertyOptional({ description: 'Category', example: 'system' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  category?: string;

  @ApiPropertyOptional({ description: 'Module', example: 'inventory' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  module?: string;

  @ApiPropertyOptional({ description: 'Related entity type' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  relatedEntityType?: string;

  @ApiPropertyOptional({ description: 'Related entity ID' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  relatedEntityId?: string;

  @ApiPropertyOptional({ description: 'Action URL' })
  @IsString()
  @IsOptional()
  @MaxLength(500)
  actionUrl?: string;

  @ApiPropertyOptional({ description: 'Action label' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  actionLabel?: string;

  @ApiPropertyOptional({ description: 'Channels', enum: NotificationChannel, isArray: true })
  @IsArray()
  @IsOptional()
  channels?: NotificationChannel[];

  @ApiPropertyOptional({ description: 'Scheduled for (ISO 8601)' })
  @IsDateString()
  @IsOptional()
  scheduledFor?: string;

  @ApiPropertyOptional({ description: 'Requires acknowledgment', default: false })
  @IsBoolean()
  @IsOptional()
  requiresAcknowledgment?: boolean;

  @ApiPropertyOptional({ description: 'Additional data' })
  @IsOptional()
  data?: Record<string, any>;
}
