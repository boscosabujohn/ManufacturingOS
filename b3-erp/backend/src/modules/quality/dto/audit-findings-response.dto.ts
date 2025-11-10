import { ApiProperty } from '@nestjs/swagger';
import { FindingType, FindingSeverity, FindingStatus } from '../entities/audit-findings.entity';

export class AuditFindingsResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  auditPlanId: string;

  @ApiProperty()
  findingNumber: string;

  @ApiProperty()
  title: string;

  @ApiProperty({ enum: FindingType })
  findingType: FindingType;

  @ApiProperty({ enum: FindingSeverity, required: false })
  severity?: FindingSeverity;

  @ApiProperty({ enum: FindingStatus })
  status: FindingStatus;

  @ApiProperty()
  findingDate: Date;

  @ApiProperty({ required: false })
  standardReference?: string;

  @ApiProperty({ required: false })
  clauseNumber?: string;

  @ApiProperty()
  evidence: string;

  @ApiProperty({ required: false })
  auditorName?: string;

  @ApiProperty({ required: false })
  assignedToName?: string;

  @ApiProperty({ required: false })
  targetCompletionDate?: Date;

  @ApiProperty()
  requiresCAPA: boolean;

  @ApiProperty({ required: false })
  capaNumber?: string;

  @ApiProperty()
  isVerified: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
