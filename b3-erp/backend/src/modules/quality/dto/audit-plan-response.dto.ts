import { ApiProperty } from '@nestjs/swagger';
import { AuditType, AuditStatus, AuditPriority } from '../entities/audit-plan.entity';

export class AuditPlanResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  auditNumber: string;

  @ApiProperty()
  auditTitle: string;

  @ApiProperty({ enum: AuditType })
  auditType: AuditType;

  @ApiProperty({ enum: AuditStatus })
  status: AuditStatus;

  @ApiProperty({ enum: AuditPriority })
  priority: AuditPriority;

  @ApiProperty()
  auditScope: string;

  @ApiProperty({ required: false })
  leadAuditorName?: string;

  @ApiProperty()
  plannedStartDate: Date;

  @ApiProperty()
  plannedEndDate: Date;

  @ApiProperty()
  totalFindings: number;

  @ApiProperty()
  criticalFindings: number;

  @ApiProperty()
  majorFindings: number;

  @ApiProperty()
  minorFindings: number;

  @ApiProperty({ required: false })
  overallRating?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
