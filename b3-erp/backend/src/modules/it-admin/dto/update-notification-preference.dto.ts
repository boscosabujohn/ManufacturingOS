import { PartialType, OmitType } from '@nestjs/swagger';
import { CreateNotificationPreferenceDto } from './create-notification-preference.dto';

export class UpdateNotificationPreferenceDto extends PartialType(
  OmitType(CreateNotificationPreferenceDto, ['userId', 'category'] as const)
) {}
