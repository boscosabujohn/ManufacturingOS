import {
  IsString,
  IsEnum,
  IsOptional,
  IsBoolean,
  IsNotEmpty,
  MaxLength,
  IsArray,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { NotificationChannel } from '../entities/notification.entity';
import { NotificationFrequency } from '../entities/notification-preference.entity';

export class CreateNotificationPreferenceDto {
  @ApiProperty({ description: 'User ID' })
  @IsString()
  @IsNotEmpty()
  userId: string;

  @ApiProperty({ description: 'Category', example: 'sales' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  category: string;

  @ApiPropertyOptional({ description: 'Enabled', default: true })
  @IsBoolean()
  @IsOptional()
  enabled?: boolean;

  @ApiPropertyOptional({ description: 'Enabled channels', enum: NotificationChannel, isArray: true })
  @IsArray()
  @IsOptional()
  enabledChannels?: NotificationChannel[];

  @ApiPropertyOptional({ description: 'Frequency', enum: NotificationFrequency })
  @IsEnum(NotificationFrequency)
  @IsOptional()
  frequency?: NotificationFrequency;

  @ApiPropertyOptional({ description: 'Email enabled', default: false })
  @IsBoolean()
  @IsOptional()
  emailEnabled?: boolean;

  @ApiPropertyOptional({ description: 'SMS enabled', default: false })
  @IsBoolean()
  @IsOptional()
  smsEnabled?: boolean;

  @ApiPropertyOptional({ description: 'Push enabled', default: true })
  @IsBoolean()
  @IsOptional()
  pushEnabled?: boolean;

  @ApiPropertyOptional({ description: 'In-app enabled', default: true })
  @IsBoolean()
  @IsOptional()
  inAppEnabled?: boolean;
}
