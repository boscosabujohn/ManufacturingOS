import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsEmail,
  MaxLength,
  IsDateString,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { LicenseType } from '../entities/driver.entity';

export class CreateDriverDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  driverCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  middleName?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  lastName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @ApiProperty()
  @IsDateString()
  dateOfBirth: Date;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  gender: string;

  @ApiProperty()
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  mobileNumber: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  alternateNumber?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  currentAddress: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  city?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  state?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  postalCode?: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  licenseNumber: string;

  @ApiProperty({ enum: LicenseType })
  @IsEnum(LicenseType)
  licenseType: LicenseType;

  @ApiProperty()
  @IsDateString()
  licenseIssueDate: Date;

  @ApiProperty()
  @IsDateString()
  licenseExpiryDate: Date;

  @ApiProperty()
  @IsDateString()
  joiningDate: Date;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  transportCompanyId?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  employmentType?: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  experienceYears: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  emergencyContactName?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  emergencyContactPhone?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
