import { IsString, IsOptional, IsEnum, IsArray, IsNumber, IsDateString, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { QuotationStatus } from '../entities/quotation.entity';

export class CreateQuotationItemDto {
    @IsString()
    productId: string;

    @IsString()
    productCode: string;

    @IsString()
    productName: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsNumber()
    quantity: number;

    @IsNumber()
    unitPrice: number;

    @IsNumber()
    @IsOptional()
    discountPercentage?: number;

    @IsNumber()
    @IsOptional()
    taxRate?: number;
}

export class CreateQuotationDto {
    @IsString()
    @IsOptional()
    customerId?: string;

    @IsString()
    customerName: string;

    @IsString()
    @IsOptional()
    contactPerson?: string;

    @IsDateString()
    quotationDate: string;

    @IsDateString()
    validUntil: string;

    @IsEnum(QuotationStatus)
    @IsOptional()
    status?: QuotationStatus;

    @IsString()
    currency: string;

    @IsNumber()
    @IsOptional()
    exchangeRate?: number;

    @IsString()
    @IsOptional()
    paymentTerms?: string;

    @IsString()
    @IsOptional()
    deliveryTerms?: string;

    @IsString()
    @IsOptional()
    notes?: string;

    @IsString()
    @IsOptional()
    assignedUserId?: string;

    @IsArray()
    @ValidateNested({ each: true })
    @Type(() => CreateQuotationItemDto)
    items: CreateQuotationItemDto[];
}

export class UpdateQuotationDto extends (CreateQuotationDto) {
    @IsEnum(QuotationStatus)
    @IsOptional()
    status?: QuotationStatus;
}
