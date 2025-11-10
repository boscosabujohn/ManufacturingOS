import { ApiProperty } from '@nestjs/swagger';
import { CorrectiveActionStatus, CorrectiveActionPriority } from '../entities/corrective-action.entity';

export class CorrectiveActionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  caNumber: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: CorrectiveActionStatus })
  status: CorrectiveActionStatus;

  @ApiProperty({ enum: CorrectiveActionPriority })
  priority: CorrectiveActionPriority;

  @ApiProperty()
  problemStatement: string;

  @ApiProperty()
  rootCause: string;

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
