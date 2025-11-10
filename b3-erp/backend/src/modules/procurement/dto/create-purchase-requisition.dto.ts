import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
  IsBoolean,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { PRStatus, PRPriority, PRType } from '../entities/purchase-requisition.entity';

class PRItemDto {
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
  quantity: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  estimatedUnitPrice: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  estimatedTotal: number;

  @ApiProperty()
  @IsDateString()
  requiredDate: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  specification?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  accountCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreatePurchaseRequisitionDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  prDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  requiredByDate: string;

  @ApiProperty({ enum: PRPriority })
  @IsEnum(PRPriority)
  @IsNotEmpty()
  priority: PRPriority;

  @ApiProperty({ enum: PRType })
  @IsEnum(PRType)
  @IsNotEmpty()
  prType: PRType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requesterId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  requesterName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  department?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  costCenter?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  project?: string;

  @ApiProperty({ type: [PRItemDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PRItemDto)
  items: PRItemDto[];

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  purpose: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  justification?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  budgetCode?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
