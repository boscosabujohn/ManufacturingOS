import { IsString, IsEnum, IsOptional, IsBoolean, IsDateString, IsArray } from 'class-validator';

export enum InteractionType {
  CALL = 'call',
  EMAIL = 'email',
  MEETING = 'meeting',
  SITE_VISIT = 'site_visit',
  SUPPORT = 'support',
  COMPLAINT = 'complaint',
  FEEDBACK = 'feedback',
  PAGE_VISIT = 'page_visit', // Auto-logged page visits
}

export enum InteractionOutcome {
  POSITIVE = 'positive',
  NEUTRAL = 'neutral',
  NEGATIVE = 'negative',
  FOLLOW_UP_REQUIRED = 'follow_up_required',
}

export class CreateInteractionDto {
  @IsEnum(InteractionType)
  type: InteractionType;

  @IsString()
  @IsOptional()
  customer?: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsString()
  subject: string;

  @IsString()
  @IsOptional()
  description?: string;

  @IsEnum(InteractionOutcome)
  @IsOptional()
  outcome?: InteractionOutcome;

  @IsString()
  @IsOptional()
  duration?: string;

  @IsString()
  @IsOptional()
  location?: string;

  @IsString()
  @IsOptional()
  performedBy?: string;

  @IsDateString()
  @IsOptional()
  dateTime?: string;

  @IsBoolean()
  @IsOptional()
  followUpRequired?: boolean;

  @IsDateString()
  @IsOptional()
  followUpDate?: string;

  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsArray()
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  relatedOpportunity?: string;

  @IsString()
  @IsOptional()
  relatedOrder?: string;

  @IsString()
  @IsOptional()
  userId?: string; // For page visit tracking

  @IsString()
  @IsOptional()
  sessionId?: string; // For page visit tracking

  @IsOptional()
  metadata?: Record<string, any>; // For storing additional info like page URL, referrer, etc.
}
