import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsString,
  IsEnum,
  IsBoolean,
  IsNumber,
  IsOptional,
  MinLength,
  MaxLength,
  Min,
} from 'class-validator';
import { CategoryType } from '../entities/category.entity';

export class CreateCategoryDto {
  @ApiProperty({ description: 'Category code', maxLength: 50 })
  @IsString()
  @MinLength(1)
  @MaxLength(50)
  categoryCode: string;

  @ApiProperty({ description: 'Category name', maxLength: 255 })
  @IsString()
  @MinLength(2)
  @MaxLength(255)
  categoryName: string;

  @ApiProperty({ enum: CategoryType, description: 'Type of category' })
  @IsEnum(CategoryType)
  categoryType: CategoryType;

  @ApiPropertyOptional({ description: 'Parent category ID for hierarchical structure' })
  @IsString()
  @IsOptional()
  parentCategoryId?: string;

  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  level?: number;

  @ApiPropertyOptional({ default: true })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  // Image
  @ApiPropertyOptional({ maxLength: 500 })
  @IsString()
  @MaxLength(500)
  @IsOptional()
  imageUrl?: string;

  // Sorting
  @ApiPropertyOptional({ default: 0 })
  @IsNumber()
  @Min(0)
  @IsOptional()
  sortOrder?: number;

  // Metadata
  @ApiPropertyOptional({ maxLength: 100 })
  @IsString()
  @MaxLength(100)
  @IsOptional()
  createdBy?: string;
}
