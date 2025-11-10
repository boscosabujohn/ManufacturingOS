import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsBoolean,
  IsNotEmpty,
  IsEmail,
  IsArray,
  ValidateNested,
  MaxLength,
  IsPhoneNumber,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WarehouseType, WarehouseStatus } from '../entities/warehouse.entity';

export class WorkingHoursDto {
  @ApiProperty()
  @IsString()
  day: string;

  @ApiProperty()
  @IsString()
  startTime: string;

  @ApiProperty()
  @IsString()
  endTime: string;

  @ApiProperty()
  @IsBoolean()
  isClosed: boolean;
}

export class CertificationDto {
  @ApiProperty()
  @IsString()
  certificateName: string;

  @ApiProperty()
  @IsString()
  certificateNumber: string;

  @ApiProperty()
  @IsString()
  issueDate: string;

  @ApiProperty()
  @IsString()
  expiryDate: string;
}

export class CreateWarehouseDto {
  @ApiProperty({ description: 'Unique warehouse code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  warehouseCode: string;

  @ApiProperty({ description: 'Warehouse name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(255)
  warehouseName: string;

  @ApiProperty({
    description: 'Type of warehouse',
    enum: WarehouseType,
    default: WarehouseType.MAIN,
  })
  @IsEnum(WarehouseType)
  @IsOptional()
  warehouseType?: WarehouseType;

  @ApiPropertyOptional({ description: 'Address line 1' })
  @IsString()
  @IsOptional()
  addressLine1?: string;

  @ApiPropertyOptional({ description: 'Address line 2' })
  @IsString()
  @IsOptional()
  addressLine2?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiPropertyOptional({ description: 'Contact person name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  contactPerson?: string;

  @ApiPropertyOptional({ description: 'Phone number' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  phone?: string;

  @ApiPropertyOptional({ description: 'Email address' })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  email?: string;

  @ApiPropertyOptional({ description: 'Total area in square meters' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  totalArea?: number;

  @ApiPropertyOptional({ description: 'Area unit' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  areaUnit?: string;

  @ApiPropertyOptional({ description: 'Storage capacity' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  storageCapacity?: number;

  @ApiPropertyOptional({ description: 'Capacity unit' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  capacityUnit?: string;

  @ApiPropertyOptional({ description: 'Company ID' })
  @IsString()
  @IsOptional()
  companyId?: string;

  @ApiPropertyOptional({ description: 'Branch ID' })
  @IsString()
  @IsOptional()
  branchId?: string;

  @ApiPropertyOptional({ description: 'Parent warehouse ID' })
  @IsString()
  @IsOptional()
  parentWarehouseId?: string;

  @ApiPropertyOptional({ description: 'Manager ID' })
  @IsString()
  @IsOptional()
  managerId?: string;

  @ApiPropertyOptional({ description: 'Manager name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  managerName?: string;

  @ApiPropertyOptional({ description: 'Allow negative stock', default: true })
  @IsBoolean()
  @IsOptional()
  allowNegativeStock?: boolean;

  @ApiPropertyOptional({
    description: 'Requires batch tracking',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requiresBatchTracking?: boolean;

  @ApiPropertyOptional({
    description: 'Requires serial tracking',
    default: false,
  })
  @IsBoolean()
  @IsOptional()
  requiresSerialTracking?: boolean;

  @ApiPropertyOptional({ description: 'Auto replenishment', default: false })
  @IsBoolean()
  @IsOptional()
  autoReplenishment?: boolean;

  @ApiPropertyOptional({ description: 'Minimum temperature' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  temperatureMin?: number;

  @ApiPropertyOptional({ description: 'Maximum temperature' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  temperatureMax?: number;

  @ApiPropertyOptional({ description: 'Minimum humidity' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  humidityMin?: number;

  @ApiPropertyOptional({ description: 'Maximum humidity' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  humidityMax?: number;

  @ApiPropertyOptional({ description: 'Description' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: 'Remarks' })
  @IsString()
  @IsOptional()
  remarks?: string;

  @ApiPropertyOptional({ description: 'Working hours', type: [WorkingHoursDto] })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => WorkingHoursDto)
  workingHours?: WorkingHoursDto[];

  @ApiPropertyOptional({ description: 'Available facilities', type: [String] })
  @IsArray()
  @IsOptional()
  facilities?: string[];

  @ApiPropertyOptional({
    description: 'Certifications',
    type: [CertificationDto],
  })
  @IsArray()
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CertificationDto)
  certifications?: CertificationDto[];
}
