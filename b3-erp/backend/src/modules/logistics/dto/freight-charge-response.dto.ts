import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  ChargeType,
  CalculationMethod,
  TaxType,
} from '../entities/freight-charge.entity';

export class FreightChargeResponseDto {
  @ApiProperty()
  id: string;

  @ApiPropertyOptional()
  shipmentId?: string;

  @ApiPropertyOptional()
  tripId?: string;

  @ApiProperty({ enum: ChargeType })
  chargeType: ChargeType;

  @ApiProperty()
  chargeName: string;

  @ApiProperty({ enum: CalculationMethod })
  calculationMethod: CalculationMethod;

  @ApiProperty()
  baseAmount: number;

  @ApiPropertyOptional()
  discountAmount?: number;

  @ApiPropertyOptional()
  taxAmount?: number;

  @ApiProperty()
  totalAmount: number;

  @ApiPropertyOptional()
  currency?: string;

  @ApiPropertyOptional()
  isPaid?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
