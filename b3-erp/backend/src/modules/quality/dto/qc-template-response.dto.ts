import { ApiProperty } from '@nestjs/swagger';
import { QCTemplateType, QCTemplateStatus } from '../entities/qc-template.entity';

export class QCTemplateResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  templateCode: string;

  @ApiProperty()
  templateName: string;

  @ApiProperty({ required: false })
  description?: string;

  @ApiProperty({ enum: QCTemplateType })
  templateType: QCTemplateType;

  @ApiProperty({ enum: QCTemplateStatus })
  status: QCTemplateStatus;

  @ApiProperty()
  version: number;

  @ApiProperty({ required: false })
  itemId?: string;

  @ApiProperty({ required: false })
  itemCode?: string;

  @ApiProperty({ required: false })
  itemName?: string;

  @ApiProperty()
  sampleSize: number;

  @ApiProperty()
  acceptableQualityLevel: number;

  @ApiProperty()
  inspectionLevel: string;

  @ApiProperty()
  samplingPlan: string;

  @ApiProperty()
  requirePhotos: boolean;

  @ApiProperty()
  requireSignature: boolean;

  @ApiProperty({ required: false })
  referenceStandard?: string;

  @ApiProperty({ required: false })
  effectiveDate?: Date;

  @ApiProperty({ required: false })
  expiryDate?: Date;

  @ApiProperty({ required: false })
  createdBy?: string;

  @ApiProperty({ required: false })
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
