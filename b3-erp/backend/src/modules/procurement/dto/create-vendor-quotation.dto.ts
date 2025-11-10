import {
  IsString,
  IsNotEmpty,
  IsDateString,
  IsArray,
  IsOptional,
  IsNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateVendorQuotationDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  quotationDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  validUntil: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rfqId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  rfqNumber: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty()
  @IsArray()
  items: any[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  currency?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  deliveryDays?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateVendorQuotationDto extends CreateVendorQuotationDto {}

export class VendorQuotationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  quotationNumber: string;

  @ApiProperty()
  quotationDate: Date;

  @ApiProperty()
  validUntil: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  rfqNumber: string;

  @ApiProperty()
  vendorName: string;

  @ApiProperty()
  totalAmount: number;

  @ApiProperty()
  isEvaluated: boolean;

  @ApiProperty()
  isAwarded: boolean;

  @ApiProperty()
  createdAt: Date;
}
