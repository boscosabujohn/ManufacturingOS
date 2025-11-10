import { IsString, IsEnum, IsNotEmpty, IsDateString, IsOptional, IsNumber, IsArray, IsBoolean } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewCycle, ReviewType } from '../entities/performance-review.entity';

export class CreatePerformanceReviewDto {
  @ApiProperty({ description: 'Employee ID' })
  @IsString()
  @IsNotEmpty()
  employeeId: string;

  @ApiProperty({ description: 'Reviewer ID' })
  @IsString()
  @IsNotEmpty()
  reviewerId: string;

  @ApiProperty({ description: 'Review type', enum: ReviewType })
  @IsEnum(ReviewType)
  reviewType: ReviewType;

  @ApiProperty({ description: 'Review cycle', enum: ReviewCycle })
  @IsEnum(ReviewCycle)
  cycle: ReviewCycle;

  @ApiProperty({ description: 'Review period from (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  reviewPeriodFrom: string;

  @ApiProperty({ description: 'Review period to (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  reviewPeriodTo: string;

  @ApiProperty({ description: 'Review date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  reviewDate: string;

  @ApiPropertyOptional({ description: 'Goals' })
  @IsArray()
  @IsOptional()
  goals?: Array<{
    id: string;
    description: string;
    targetDate: Date;
    achievement: number;
    rating: number;
    comments: string;
  }>;

  @ApiPropertyOptional({ description: 'Competencies' })
  @IsArray()
  @IsOptional()
  competencies?: Array<{
    id: string;
    name: string;
    category: string;
    rating: number;
    weight: number;
    comments: string;
  }>;

  @ApiPropertyOptional({ description: 'Final rating' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  finalRating?: number;

  @ApiPropertyOptional({ description: 'Is promotion recommended' })
  @IsBoolean()
  @IsOptional()
  isPromotionRecommended?: boolean;

  @ApiPropertyOptional({ description: 'Is salary revision recommended' })
  @IsBoolean()
  @IsOptional()
  isSalaryRevisionRecommended?: boolean;

  @ApiPropertyOptional({ description: 'Recommended salary increase percentage' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  recommendedSalaryIncrease?: number;
}
