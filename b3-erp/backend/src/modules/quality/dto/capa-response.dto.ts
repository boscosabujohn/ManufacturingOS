import { ApiProperty } from '@nestjs/swagger';
import { CAPAStatus, CAPAPriority, CAPAType } from '../entities/capa.entity';

export class CAPAResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  capaNumber: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: CAPAStatus })
  status: CAPAStatus;

  @ApiProperty({ enum: CAPAPriority })
  priority: CAPAPriority;

  @ApiProperty({ enum: CAPAType })
  capaType: CAPAType;

  @ApiProperty()
  problemStatement: string;

  @ApiProperty()
  rootCauseAnalysis: string;

  @ApiProperty()
  actionPlan: string;

  @ApiProperty({ required: false })
  ownerName?: string;

  @ApiProperty()
  targetDate: Date;

  @ApiProperty()
  isImplemented: boolean;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  isEffective: boolean;

  @ApiProperty()
  progressPercentage: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
