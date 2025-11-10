import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { TaxType, TaxCategory } from '../entities/tax.entity';

export class TaxMasterResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  taxCode: string;

  @ApiProperty()
  taxName: string;

  @ApiProperty({ enum: TaxType })
  taxType: TaxType;

  @ApiProperty({ enum: TaxCategory })
  taxCategory: TaxCategory;

  @ApiProperty()
  taxRate: number;

  @ApiProperty()
  effectiveFrom: Date;

  @ApiPropertyOptional()
  effectiveTo?: Date;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  taxPayableAccountId?: string;

  @ApiPropertyOptional()
  taxReceivableAccountId?: string;

  @ApiPropertyOptional()
  taxExpenseAccountId?: string;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
