import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsArray,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RFQType } from '../entities/rfq.entity';

export class CreateRFQDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  rfqDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  submissionDeadline: string;

  @ApiPropertyOptional()
  @IsDateString()
  @IsOptional()
  validUntil?: string;

  @ApiProperty({ enum: RFQType })
  @IsEnum(RFQType)
  @IsNotEmpty()
  rfqType: RFQType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  title: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buyerId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  buyerName: string;

  @ApiProperty()
  @IsArray()
  vendors: any[];

  @ApiProperty()
  @IsArray()
  items: any[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  termsAndConditions?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateRFQDto extends CreateRFQDto {}

export class RFQResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  rfqNumber: string;

  @ApiProperty()
  rfqDate: Date;

  @ApiProperty()
  submissionDeadline: Date;

  @ApiProperty()
  status: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  buyerName: string;

  @ApiProperty()
  quotationsReceived: number;

  @ApiProperty()
  quotationsPending: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
