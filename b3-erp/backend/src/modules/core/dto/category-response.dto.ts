import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { CategoryType } from '../entities/category.entity';

export class CategoryResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  categoryCode: string;

  @ApiProperty()
  categoryName: string;

  @ApiProperty({ enum: CategoryType })
  categoryType: CategoryType;

  @ApiPropertyOptional()
  parentCategoryId?: string;

  @ApiProperty()
  level: number;

  @ApiProperty()
  isActive: boolean;

  @ApiPropertyOptional()
  description?: string;

  // Image
  @ApiPropertyOptional()
  imageUrl?: string;

  // Sorting
  @ApiProperty()
  sortOrder: number;

  // Metadata
  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;

  // Virtual fields
  @ApiPropertyOptional()
  fullPath?: string;

  @ApiPropertyOptional()
  itemCount?: number;

  @ApiPropertyOptional()
  children?: CategoryResponseDto[];
}
