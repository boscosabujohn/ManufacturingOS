import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { DriverStatus, LicenseType } from '../entities/driver.entity';

export class DriverResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  driverCode: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty({ enum: DriverStatus })
  status: DriverStatus;

  @ApiProperty()
  email: string;

  @ApiProperty()
  mobileNumber: string;

  @ApiProperty()
  licenseNumber: string;

  @ApiProperty({ enum: LicenseType })
  licenseType: LicenseType;

  @ApiProperty()
  licenseExpiryDate: Date;

  @ApiProperty()
  experienceYears: number;

  @ApiPropertyOptional()
  totalTrips?: number;

  @ApiPropertyOptional()
  safetyRating?: number;

  @ApiPropertyOptional()
  isAvailable?: boolean;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
