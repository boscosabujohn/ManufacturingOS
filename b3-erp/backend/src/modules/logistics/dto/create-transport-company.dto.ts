import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsEmail,
  IsArray,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TransportCompanyType,
  ServiceType,
} from '../entities/transport-company.entity';

export class CreateTransportCompanyDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  companyCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  companyName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  legalName?: string;

  @ApiProperty({ enum: TransportCompanyType })
  @IsEnum(TransportCompanyType)
  @IsOptional()
  companyType?: TransportCompanyType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  address: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  city: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  state: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  postalCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  country: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  phone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  website?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactPersonName: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  contactPersonEmail: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  contactPersonPhone: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  gstNumber?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  panNumber?: string;

  @ApiProperty()
  @IsArray()
  @IsEnum(ServiceType, { each: true })
  serviceTypes: ServiceType[];

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  serviceAreas?: string[];

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  numberOfVehicles?: number;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  numberOfDrivers?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  baseRate?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  paymentTerms?: string;

  @ApiPropertyOptional()
  @IsInt()
  @IsOptional()
  @Type(() => Number)
  creditDays?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
