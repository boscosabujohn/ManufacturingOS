import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PRStatus, PRPriority, PRType } from '../entities/purchase-requisition.entity';

export class PurchaseRequisitionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  prNumber: string;

  @ApiProperty()
  prDate: Date;

  @ApiProperty()
  requiredByDate: Date;

  @ApiProperty({ enum: PRStatus })
  status: PRStatus;

  @ApiProperty({ enum: PRPriority })
  priority: PRPriority;

  @ApiProperty({ enum: PRType })
  prType: PRType;

  @ApiProperty()
  requesterId: string;

  @ApiProperty()
  requesterName: string;

  @ApiPropertyOptional()
  department?: string;

  @ApiPropertyOptional()
  costCenter?: string;

  @ApiPropertyOptional()
  project?: string;

  @ApiProperty()
  items: any[];

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  purpose: string;

  @ApiPropertyOptional()
  justification?: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approverName?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiPropertyOptional()
  approvalNotes?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
