import { ApiProperty } from '@nestjs/swagger';
import { AlertType, AlertSeverity, AlertStatus } from '../entities/quality-alert.entity';

export class QualityAlertResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  alertNumber: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: AlertType })
  alertType: AlertType;

  @ApiProperty({ enum: AlertSeverity })
  severity: AlertSeverity;

  @ApiProperty({ enum: AlertStatus })
  status: AlertStatus;

  @ApiProperty()
  alertDate: Date;

  @ApiProperty({ required: false })
  assignedToName?: string;

  @ApiProperty({ required: false })
  acknowledgedBy?: string;

  @ApiProperty()
  ncrGenerated: boolean;

  @ApiProperty()
  capaGenerated: boolean;

  @ApiProperty()
  isOverdue: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
