import {
  IsString,
  IsEnum,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsOptional,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { EvaluationPeriod } from '../entities/vendor-evaluation.entity';

export class CreateVendorEvaluationDto {
  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  evaluationDate: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  evaluationPeriodStart: string;

  @ApiProperty()
  @IsDateString()
  @IsNotEmpty()
  evaluationPeriodEnd: string;

  @ApiProperty({ enum: EvaluationPeriod })
  @IsEnum(EvaluationPeriod)
  @IsNotEmpty()
  evaluationPeriod: EvaluationPeriod;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  vendorName: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  evaluatorId: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  evaluatorName: string;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  qualityScore: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  deliveryScore: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  priceScore: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  responsivenessScore: number;

  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  complianceScore: number;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  recommendations?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  notes?: string;
}

export class UpdateVendorEvaluationDto extends CreateVendorEvaluationDto {}

export class VendorEvaluationResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  evaluationNumber: string;

  @ApiProperty()
  evaluationDate: Date;

  @ApiProperty()
  vendorName: string;

  @ApiProperty()
  evaluationPeriod: string;

  @ApiProperty()
  overallScore: number;

  @ApiProperty()
  performanceGrade: string;

  @ApiProperty()
  status: string;

  @ApiProperty()
  isApproved: boolean;

  @ApiProperty()
  createdAt: Date;
}
