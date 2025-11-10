import {
  IsString,
  IsEnum,
  IsOptional,
  IsNumber,
  IsNotEmpty,
  IsArray,
  MaxLength,
  IsInt,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { RouteType } from '../entities/route.entity';

export class CreateRouteDto {
  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  routeCode: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  routeName: string;

  @ApiProperty({ enum: RouteType })
  @IsEnum(RouteType)
  @IsOptional()
  routeType?: RouteType;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  originAddress: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originCity?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  originState?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  originLatitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  originLongitude?: number;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  destinationAddress: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationCity?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  destinationState?: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  destinationLatitude?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  destinationLongitude?: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  totalDistance: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  distanceUnit?: string;

  @ApiProperty()
  @IsInt()
  @Type(() => Number)
  estimatedDurationMinutes: number;

  @ApiPropertyOptional()
  @IsArray()
  @IsOptional()
  stops?: any[];

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  estimatedTollCharges?: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}
