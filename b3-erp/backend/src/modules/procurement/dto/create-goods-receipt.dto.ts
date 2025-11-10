import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  IsBoolean,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { GRNType } from '../entities/goods-receipt.entity';

export class CreateGoodsReceiptDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  grnDate: string;

  @ApiProperty({ enum: GRNType })
  @IsEnum(GRNType)
  @IsNotEmpty()
  grnType: GRNType;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseOrderId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseOrderNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  deliveryNoteNumber?: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  deliveryNoteDate?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  warehouseName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  receivedBy: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  receivedByName: string;

  @ApiProperty()
  @IsArray()
  items: any[];

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  requiresQualityCheck?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateGoodsReceiptDto extends CreateGoodsReceiptDto {}

export class GoodsReceiptResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  grnNumber: string;

  @ApiProperty()
  grnDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  grnType: string;

  @ApiProperty()
  vendorName: string;

  @ApiProperty()
  warehouseName: string;

  @ApiProperty()
  totalReceivedAmount: number;

  @ApiProperty()
  totalAcceptedAmount: number;

  @ApiProperty()
  isPostedToInventory: boolean;

  @ApiProperty()
  createdAt: Date;
}
