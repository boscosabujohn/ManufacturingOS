import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { HolidayType, HolidayStatus } from '../entities/holiday.entity';

export class HolidayResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  name: string;

  @ApiProperty()
  date: Date;

  @ApiProperty({ enum: HolidayType })
  type: HolidayType;

  @ApiPropertyOptional()
  description?: string;

  @ApiProperty()
  isPaid: boolean;

  @ApiProperty()
  numberOfDays: number;

  @ApiPropertyOptional()
  applicableLocations?: string[];

  @ApiPropertyOptional()
  applicableDepartments?: string[];

  @ApiPropertyOptional()
  applicableEmployeeTypes?: string[];

  @ApiProperty()
  isFloating: boolean;

  @ApiPropertyOptional()
  year?: number;

  @ApiProperty({ enum: HolidayStatus })
  status: HolidayStatus;

  @ApiPropertyOptional()
  metadata?: Record<string, any>;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
