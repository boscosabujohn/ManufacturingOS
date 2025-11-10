import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { POStatus, POType, PaymentTerms, DeliveryTerms } from '../entities/purchase-order.entity';

export class PurchaseOrderResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  poNumber: string;

  @ApiProperty()
  poDate: Date;

  @ApiProperty()
  deliveryDate: Date;

  @ApiProperty({ enum: POStatus })
  status: POStatus;

  @ApiProperty({ enum: POType })
  poType: POType;

  @ApiProperty()
  vendorId: string;

  @ApiProperty()
  vendorName: string;

  @ApiProperty()
  deliveryAddress: string;

  @ApiProperty({ enum: DeliveryTerms })
  deliveryTerms: DeliveryTerms;

  @ApiProperty()
  currency: string;

  @ApiProperty({ enum: PaymentTerms })
  paymentTerms: PaymentTerms;

  @ApiProperty()
  subtotal: number;

  @ApiProperty()
  taxAmount: number;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  buyerId: string;

  @ApiProperty()
  buyerName: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiPropertyOptional()
  approvedBy?: string;

  @ApiPropertyOptional()
  approvedAt?: Date;

  @ApiProperty()
  receivedAmount: number;

  @ApiProperty()
  receivedPercentage: number;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
