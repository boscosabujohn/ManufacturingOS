import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { POType, PaymentTerms, DeliveryTerms } from '../entities/purchase-order.entity';

class POItemDto {
  @ApiProperty()
  @IsNumber()
  lineNumber: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  itemName: string;

  @ApiProperty()
  @IsString()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  uom: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  orderedQuantity: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  unitPrice: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  discountPercentage?: number;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  requiredDate?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accountCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  taxCode?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  taxRate?: number;
}

export class CreatePurchaseOrderDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  poDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  deliveryDate: string;

  @ApiProperty({ enum: POType })
  @IsEnum(POType)
  @IsNotEmpty()
  poType: POType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  prNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  rfqNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  deliveryAddress: string;

  @ApiPropertyOptional({ enum: DeliveryTerms })
  @IsEnum(DeliveryTerms)
  @IsOptional()
  deliveryTerms?: DeliveryTerms;

  @ApiPropertyOptional({ enum: PaymentTerms })
  @IsEnum(PaymentTerms)
  @IsOptional()
  paymentTerms?: PaymentTerms;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiProperty({ type: [POItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => POItemDto)
  items: POItemDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
