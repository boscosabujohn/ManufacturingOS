import { ApiProperty } from '@nestjs/swagger';
import { PreventiveActionStatus, PreventiveActionPriority, PreventiveActionType } from '../entities/preventive-action.entity';

export class PreventiveActionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  paNumber: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: PreventiveActionStatus })
  status: PreventiveActionStatus;

  @ApiProperty({ enum: PreventiveActionPriority })
  priority: PreventiveActionPriority;

  @ApiProperty({ enum: PreventiveActionType })
  actionType: PreventiveActionType;

  @ApiProperty()
  riskOpportunity: string;

  @ApiProperty()
  actionPlan: string;

  @ApiProperty({ required: false })
  assignedToName?: string;

  @ApiProperty()
  targetDate: Date;

  @ApiProperty()
  isImplemented: boolean;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  progressPercentage: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
