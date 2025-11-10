import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ReviewCycle, ReviewType, ReviewStatus, OverallRating } from '../entities/performance-review.entity';

export class PerformanceReviewResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  reviewNumber: string;

  @ApiProperty()
  employeeId: string;

  @ApiProperty()
  reviewerId: string;

  @ApiProperty({ enum: ReviewType })
  reviewType: ReviewType;

  @ApiProperty({ enum: ReviewCycle })
  cycle: ReviewCycle;

  @ApiProperty()
  reviewPeriodFrom: Date;

  @ApiProperty()
  reviewPeriodTo: Date;

  @ApiProperty()
  reviewDate: Date;

  @ApiProperty({ enum: ReviewStatus })
  status: ReviewStatus;

  @ApiPropertyOptional()
  goals?: any[];

  @ApiPropertyOptional()
  competencies?: any[];

  @ApiPropertyOptional()
  finalRating?: number;

  @ApiPropertyOptional({ enum: OverallRating })
  overallRating?: OverallRating;

  @ApiProperty()
  isPromotionRecommended: boolean;

  @ApiProperty()
  isSalaryRevisionRecommended: boolean;

  @ApiPropertyOptional()
  recommendedSalaryIncrease?: number;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
