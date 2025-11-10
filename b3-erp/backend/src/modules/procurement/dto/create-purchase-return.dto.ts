import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReturnReason } from '../entities/purchase-return.entity';

export class CreatePurchaseReturnDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  returnDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  goodsReceiptId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  purchaseOrderId?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty({ enum: ReturnReason })
  @IsEnum(ReturnReason)
  @IsNotEmpty()
  returnReason: ReturnReason;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  returnReasonDescription: string;

  @ApiProperty()
  @IsArray()
  items: any[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdatePurchaseReturnDto extends CreatePurchaseReturnDto {}

export class PurchaseReturnResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  returnNumber: string;

  @ApiProperty()
  returnDate: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  vendorName: string;

  @ApiProperty()
  returnReason: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  isCreditNoteReceived: boolean;

  @ApiProperty()
  createdAt: Date;
}
