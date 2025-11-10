import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { WarehouseType, WarehouseStatus } from '../entities/warehouse.entity';

export class WarehouseResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  warehouseCode: string;

  @ApiProperty()
  warehouseName: string;

  @ApiProperty({ enum: WarehouseType })
  warehouseType: WarehouseType;

  @ApiProperty({ enum: WarehouseStatus })
  status: WarehouseStatus;

  @ApiPropertyOptional()
  addressLine1?: string;

  @ApiPropertyOptional()
  addressLine2?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiPropertyOptional()
  contactPerson?: string;

  @ApiPropertyOptional()
  phone?: string;

  @ApiPropertyOptional()
  email?: string;

  @ApiPropertyOptional()
  totalArea?: number;

  @ApiPropertyOptional()
  areaUnit?: string;

  @ApiPropertyOptional()
  storageCapacity?: number;

  @ApiPropertyOptional()
  capacityUnit?: string;

  @ApiPropertyOptional()
  currentUtilization?: number;

  @ApiPropertyOptional()
  companyId?: string;

  @ApiPropertyOptional()
  branchId?: string;

  @ApiPropertyOptional()
  parentWarehouseId?: string;

  @ApiPropertyOptional()
  managerId?: string;

  @ApiPropertyOptional()
  managerName?: string;

  @ApiProperty()
  allowNegativeStock: boolean;

  @ApiProperty()
  requiresBatchTracking: boolean;

  @ApiProperty()
  requiresSerialTracking: boolean;

  @ApiProperty()
  autoReplenishment: boolean;

  @ApiPropertyOptional()
  temperatureMin?: number;

  @ApiPropertyOptional()
  temperatureMax?: number;

  @ApiPropertyOptional()
  humidityMin?: number;

  @ApiPropertyOptional()
  humidityMax?: number;

  @ApiPropertyOptional()
  description?: string;

  @ApiPropertyOptional()
  remarks?: string;

  @ApiPropertyOptional()
  workingHours?: any[];

  @ApiPropertyOptional()
  facilities?: string[];

  @ApiPropertyOptional()
  certifications?: any[];

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
