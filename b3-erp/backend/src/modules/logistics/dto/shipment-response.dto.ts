import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ShipmentStatus,
  ShipmentType,
  ShipmentMode,
  ShipmentPriority,
} from '../entities/shipment.entity';

export class ShipmentResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  shipmentNumber: string;

  @ApiPropertyOptional()
  referenceNumber?: string;

  @ApiPropertyOptional()
  trackingNumber?: string;

  @ApiProperty({ enum: ShipmentType })
  shipmentType: ShipmentType;

  @ApiProperty({ enum: ShipmentStatus })
  status: ShipmentStatus;

  @ApiProperty({ enum: ShipmentPriority })
  priority: ShipmentPriority;

  @ApiProperty({ enum: ShipmentMode })
  shipmentMode: ShipmentMode;

  @ApiProperty()
  originName: string;

  @ApiProperty()
  originAddress: string;

  @ApiPropertyOptional()
  originCity?: string;

  @ApiPropertyOptional()
  originState?: string;

  @ApiProperty()
  destinationName: string;

  @ApiProperty()
  destinationAddress: string;

  @ApiPropertyOptional()
  destinationCity?: string;

  @ApiPropertyOptional()
  destinationState?: string;

  @ApiPropertyOptional()
  totalPackages?: number;

  @ApiPropertyOptional()
  totalWeight?: number;

  @ApiPropertyOptional()
  weightUnit?: string;

  @ApiPropertyOptional()
  freightCharges?: number;

  @ApiPropertyOptional()
  totalAmount?: number;

  @ApiPropertyOptional()
  currency?: string;

  @ApiPropertyOptional()
  plannedPickupDate?: Date;

  @ApiPropertyOptional()
  plannedDeliveryDate?: Date;

  @ApiPropertyOptional()
  actualDeliveryDate?: Date;

  @ApiPropertyOptional()
  estimatedDistance?: number;

  @ApiPropertyOptional()
  items?: any[];

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
