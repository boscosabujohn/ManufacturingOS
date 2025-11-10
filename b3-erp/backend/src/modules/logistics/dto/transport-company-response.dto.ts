import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  TransportCompanyStatus,
  TransportCompanyType,
  ServiceType,
} from '../entities/transport-company.entity';

export class TransportCompanyResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  companyCode: string;

  @ApiProperty()
  companyName: string;

  @ApiProperty({ enum: TransportCompanyType })
  companyType: TransportCompanyType;

  @ApiProperty({ enum: TransportCompanyStatus })
  status: TransportCompanyStatus;

  @ApiProperty()
  email: string;

  @ApiProperty()
  phone: string;

  @ApiProperty()
  city: string;

  @ApiProperty()
  state: string;

  @ApiProperty()
  contactPersonName: string;

  @ApiProperty()
  serviceTypes: ServiceType[];

  @ApiPropertyOptional()
  numberOfVehicles?: number;

  @ApiPropertyOptional()
  performanceRating?: number;

  @ApiPropertyOptional()
  totalShipmentsHandled?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
