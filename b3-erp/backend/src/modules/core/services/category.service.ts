import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { CreateCategoryDto } from '../dto/create-category.dto';
import { UpdateCategoryDto } from '../dto/update-category.dto';

export interface CategoryFilters {
  search?: string;
  categoryType?: string;
  isActive?: boolean;
  parentCategoryId?: string;
  level?: number;
}

export interface PaginationParams {
  page?: number;
  limit?: number;
  sortBy?: string;
  sortOrder?: 'ASC' | 'DESC';
}

@Injectable()
export class CategoryService {
  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async findAll(
    filters: CategoryFilters = {},
    pagination: PaginationParams = {},
  ): Promise<{ data: Category[]; total: number; page: number; limit: number }> {
    const { search, categoryType, isActive, parentCategoryId, level } = filters;

    const {
      page = 1,
      limit = 10,
      sortBy = 'sortOrder',
      sortOrder = 'ASC',
    } = pagination;

    const queryBuilder = this.categoryRepository.createQueryBuilder('category');

    // Apply search filter
    if (search) {
      queryBuilder.andWhere(
        '(category.categoryCode ILIKE :search OR category.categoryName ILIKE :search)',
        { search: `%${search}%` },
      );
    }

    // Apply category type filter
    if (categoryType) {
      queryBuilder.andWhere('category.categoryType = :categoryType', {
        categoryType,
      });
    }

    // Apply active filter
    if (isActive !== undefined) {
      queryBuilder.andWhere('category.isActive = :isActive', { isActive });
    }

    // Apply parent category filter
    if (parentCategoryId !== undefined) {
      if (parentCategoryId === null || parentCategoryId === '') {
        queryBuilder.andWhere('category.parentCategoryId IS NULL');
      } else {
        queryBuilder.andWhere(
          'category.parentCategoryId = :parentCategoryId',
          { parentCategoryId },
        );
      }
    }

    // Apply level filter
    if (level !== undefined) {
      queryBuilder.andWhere('category.level = :level', { level });
    }

    // Apply sorting
    queryBuilder.orderBy(`category.${sortBy}`, sortOrder);
    if (sortBy !== 'sortOrder') {
      queryBuilder.addOrderBy('category.sortOrder', 'ASC');
    }

    // Apply pagination
    const skip = (page - 1) * limit;
    queryBuilder.skip(skip).take(limit);

    // Execute query
    const [data, total] = await queryBuilder.getManyAndCount();

    // Build full path for each category
    await Promise.all(
      data.map(async (category) => {
        category.fullPath = await this.buildFullPath(category);
      }),
    );

    return {
      data,
      total,
      page,
      limit,
    };
  }

  async findOne(id: string): Promise<Category> {
    const category = await this.categoryRepository.findOne({
      where: { id },
      relations: ['parentCategory', 'children'],
    });

    if (!category) {
      throw new NotFoundException(`Category with ID ${id} not found`);
    }

    // Build full path
    category.fullPath = await this.buildFullPath(category);

    return category;
  }

  async findByCode(
    categoryCode: string,
    categoryType: string,
  ): Promise<Category | null> {
    return this.categoryRepository.findOne({
      where: { categoryCode, categoryType: categoryType as any },
    });
  }

  async create(createCategoryDto: CreateCategoryDto): Promise<Category> {
    // Check if category code already exists for the same type
    const existingCategory = await this.findByCode(
      createCategoryDto.categoryCode,
      createCategoryDto.categoryType,
    );
    if (existingCategory) {
      throw new ConflictException(
        `Category with code ${createCategoryDto.categoryCode} and type ${createCategoryDto.categoryType} already exists`,
      );
    }

    // Validate parent category if provided
    let level = 0;
    if (createCategoryDto.parentCategoryId) {
      const parentCategory = await this.categoryRepository.findOne({
        where: { id: createCategoryDto.parentCategoryId },
      });

      if (!parentCategory) {
        throw new BadRequestException(
          `Parent category with ID ${createCategoryDto.parentCategoryId} not found`,
        );
      }

      // Ensure parent category is of the same type
      if (parentCategory.categoryType !== createCategoryDto.categoryType) {
        throw new BadRequestException(
          'Parent category must be of the same type',
        );
      }

      level = parentCategory.level + 1;
    }

    const category = this.categoryRepository.create({
      ...createCategoryDto,
      level,
    });

    return this.categoryRepository.save(category);
  }

  async update(
    id: string,
    updateCategoryDto: UpdateCategoryDto,
  ): Promise<Category> {
    const category = await this.findOne(id);

    // Check if category code is being changed and if it already exists
    if (
      updateCategoryDto.categoryCode &&
      updateCategoryDto.categoryCode !== category.categoryCode
    ) {
      const categoryType =
        updateCategoryDto.categoryType || category.categoryType;
      const existingCategory = await this.findByCode(
        updateCategoryDto.categoryCode,
        categoryType,
      );
      if (existingCategory) {
        throw new ConflictException(
          `Category with code ${updateCategoryDto.categoryCode} and type ${categoryType} already exists`,
        );
      }
    }

    // Validate parent category if being changed
    if (
      updateCategoryDto.parentCategoryId !== undefined &&
      updateCategoryDto.parentCategoryId !== category.parentCategoryId
    ) {
      if (updateCategoryDto.parentCategoryId === id) {
        throw new BadRequestException('Category cannot be its own parent');
      }

      if (updateCategoryDto.parentCategoryId) {
        const parentCategory = await this.categoryRepository.findOne({
          where: { id: updateCategoryDto.parentCategoryId },
        });

        if (!parentCategory) {
          throw new BadRequestException(
            `Parent category with ID ${updateCategoryDto.parentCategoryId} not found`,
          );
        }

        // Ensure parent category is of the same type
        const categoryType =
          updateCategoryDto.categoryType || category.categoryType;
        if (parentCategory.categoryType !== categoryType) {
          throw new BadRequestException(
            'Parent category must be of the same type',
          );
        }

        // Check if the new parent is not a descendant of this category
        const isDescendant = await this.isDescendant(
          updateCategoryDto.parentCategoryId,
          id,
        );
        if (isDescendant) {
          throw new BadRequestException(
            'Cannot set a descendant category as parent',
          );
        }

        category.level = parentCategory.level + 1;
      } else {
        category.level = 0;
      }

      // Update levels of all children recursively
      await this.updateChildrenLevels(id, category.level);
    }

    Object.assign(category, updateCategoryDto);
    return this.categoryRepository.save(category);
  }

  async remove(id: string): Promise<void> {
    const category = await this.findOne(id);

    // Check if category has children
    const childrenCount = await this.categoryRepository.count({
      where: { parentCategoryId: id },
    });

    if (childrenCount > 0) {
      throw new BadRequestException(
        `Cannot delete category with ${childrenCount} child categories`,
      );
    }

    await this.categoryRepository.remove(category);
  }

  async getHierarchy(categoryType?: string): Promise<Category[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.parentCategoryId IS NULL')
      .orderBy('category.sortOrder', 'ASC');

    if (categoryType) {
      queryBuilder.andWhere('category.categoryType = :categoryType', {
        categoryType,
      });
    }

    const rootCategories = await queryBuilder.getMany();

    // Load children recursively
    await Promise.all(
      rootCategories.map((category) => this.loadChildren(category)),
    );

    return rootCategories;
  }

  async getChildren(parentId: string): Promise<Category[]> {
    return this.categoryRepository.find({
      where: { parentCategoryId: parentId },
      order: { sortOrder: 'ASC' },
    });
  }

  async getRootCategories(categoryType?: string): Promise<Category[]> {
    const queryBuilder = this.categoryRepository
      .createQueryBuilder('category')
      .where('category.parentCategoryId IS NULL')
      .orderBy('category.sortOrder', 'ASC');

    if (categoryType) {
      queryBuilder.andWhere('category.categoryType = :categoryType', {
        categoryType,
      });
    }

    return queryBuilder.getMany();
  }

  async toggleActive(id: string): Promise<Category> {
    const category = await this.findOne(id);
    category.isActive = !category.isActive;
    return this.categoryRepository.save(category);
  }

  async updateSortOrder(id: string, sortOrder: number): Promise<Category> {
    const category = await this.findOne(id);
    category.sortOrder = sortOrder;
    return this.categoryRepository.save(category);
  }

  // Private helper methods
  private async loadChildren(category: Category): Promise<void> {
    category.children = await this.categoryRepository.find({
      where: { parentCategoryId: category.id },
      order: { sortOrder: 'ASC' },
    });

    if (category.children && category.children.length > 0) {
      await Promise.all(
        category.children.map((child) => this.loadChildren(child)),
      );
    }
  }

  private async buildFullPath(category: Category): Promise<string> {
    const path: string[] = [category.categoryName];
    let currentCategory = category;

    while (currentCategory.parentCategoryId) {
      const parent = await this.categoryRepository.findOne({
        where: { id: currentCategory.parentCategoryId },
      });

      if (!parent) break;

      path.unshift(parent.categoryName);
      currentCategory = parent;
    }

    return path.join(' > ');
  }

  private async isDescendant(
    ancestorId: string,
    descendantId: string,
  ): Promise<boolean> {
    const ancestor = await this.categoryRepository.findOne({
      where: { id: ancestorId },
    });

    if (!ancestor) return false;
    if (!ancestor.parentCategoryId) return false;
    if (ancestor.parentCategoryId === descendantId) return true;

    return this.isDescendant(ancestor.parentCategoryId, descendantId);
  }

  private async updateChildrenLevels(
    parentId: string,
    parentLevel: number,
  ): Promise<void> {
    const children = await this.categoryRepository.find({
      where: { parentCategoryId: parentId },
    });

    for (const child of children) {
      child.level = parentLevel + 1;
      await this.categoryRepository.save(child);
      await this.updateChildrenLevels(child.id, child.level);
    }
  }
}
