import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category, CategoryType } from '../entities/category.entity';

@Injectable()
export class CategorySeederService implements OnModuleInit {
  private readonly logger = new Logger(CategorySeederService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedCategories();
  }

  async seedCategories(): Promise<void> {
    this.logger.log('Seeding item categories...');

    const categories = [
      {
        categoryCode: 'RM',
        categoryName: 'Raw Materials',
        categoryType: CategoryType.ITEM,
        description: 'Basic materials used in manufacturing processes',
        level: 0,
        sortOrder: 1,
        isActive: true,
      },
      {
        categoryCode: 'FG',
        categoryName: 'Finished Goods',
        categoryType: CategoryType.ITEM,
        description: 'Completed products ready for sale',
        level: 0,
        sortOrder: 2,
        isActive: true,
      },
      {
        categoryCode: 'WIP',
        categoryName: 'Work in Progress',
        categoryType: CategoryType.ITEM,
        description: 'Items currently in the manufacturing process',
        level: 0,
        sortOrder: 3,
        isActive: true,
      },
      {
        categoryCode: 'SPARE',
        categoryName: 'Spare Parts',
        categoryType: CategoryType.ITEM,
        description: 'Replacement parts for machines and equipment',
        level: 0,
        sortOrder: 4,
        isActive: true,
      },
      {
        categoryCode: 'CONS',
        categoryName: 'Consumables',
        categoryType: CategoryType.ITEM,
        description: 'Items consumed during production (lubricants, cleaning supplies, etc.)',
        level: 0,
        sortOrder: 5,
        isActive: true,
      },
      {
        categoryCode: 'SVC',
        categoryName: 'Services',
        categoryType: CategoryType.ITEM,
        description: 'Non-tangible service items',
        level: 0,
        sortOrder: 6,
        isActive: true,
      },
      {
        categoryCode: 'TOOL',
        categoryName: 'Tools',
        categoryType: CategoryType.ITEM,
        description: 'Hand tools and equipment used in manufacturing',
        level: 0,
        sortOrder: 7,
        isActive: true,
      },
      {
        categoryCode: 'ASSET',
        categoryName: 'Fixed Assets',
        categoryType: CategoryType.ASSET,
        description: 'Long-term assets such as machinery and equipment',
        level: 0,
        sortOrder: 8,
        isActive: true,
      },
    ];

    for (const category of categories) {
      try {
        const existing = await this.categoryRepository.findOne({
          where: { categoryCode: category.categoryCode },
        });
        if (!existing) {
          await this.categoryRepository.save(category);
          this.logger.log(`Created category: ${category.categoryName} (${category.categoryCode})`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed category ${category.categoryName}: ${error.message}`);
      }
    }

    this.logger.log('Item categories seeding completed');
  }
}
