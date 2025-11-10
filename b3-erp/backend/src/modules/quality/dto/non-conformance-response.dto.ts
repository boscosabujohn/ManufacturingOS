import { ApiProperty } from '@nestjs/swagger';
import { NCRType, NCRStatus, NCRSeverity, NCRPriority } from '../entities/non-conformance.entity';

export class NonConformanceResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  ncrNumber: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  description: string;

  @ApiProperty({ enum: NCRType })
  ncrType: NCRType;

  @ApiProperty({ enum: NCRStatus })
  status: NCRStatus;

  @ApiProperty({ enum: NCRSeverity })
  severity: NCRSeverity;

  @ApiProperty({ enum: NCRPriority })
  priority: NCRPriority;

  @ApiProperty({ required: false })
  itemCode?: string;

  @ApiProperty({ required: false })
  affectedQuantity?: number;

  @ApiProperty()
  reportedDate: Date;

  @ApiProperty({ required: false })
  reportedByName?: string;

  @ApiProperty()
  requiresCAPA: boolean;

  @ApiProperty({ required: false })
  capaNumber?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
