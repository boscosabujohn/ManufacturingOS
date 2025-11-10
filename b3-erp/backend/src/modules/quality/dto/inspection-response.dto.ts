import { ApiProperty } from '@nestjs/swagger';
import { InspectionType, InspectionStatus, InspectionResult, InspectionPriority } from '../entities/inspection.entity';

export class InspectionResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  inspectionNumber: string;

  @ApiProperty()
  inspectionName: string;

  @ApiProperty({ enum: InspectionType })
  inspectionType: InspectionType;

  @ApiProperty({ enum: InspectionStatus })
  status: InspectionStatus;

  @ApiProperty({ enum: InspectionResult })
  result: InspectionResult;

  @ApiProperty({ enum: InspectionPriority })
  priority: InspectionPriority;

  @ApiProperty()
  itemCode: string;

  @ApiProperty()
  itemName: string;

  @ApiProperty()
  lotQuantity: number;

  @ApiProperty()
  sampleSize: number;

  @ApiProperty()
  acceptedQuantity: number;

  @ApiProperty()
  rejectedQuantity: number;

  @ApiProperty()
  scheduledDate: Date;

  @ApiProperty({ required: false })
  assignedToName?: string;

  @ApiProperty({ required: false })
  inspectedByName?: string;

  @ApiProperty()
  defectRate: number;

  @ApiProperty()
  totalDefects: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
