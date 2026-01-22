import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '../entities/category.entity';
import { UOM } from '../entities/uom.entity';
import { DEFAULT_CATEGORIES, DefaultCategory } from '../data/default-categories.data';
import { DEFAULT_UOMS, DefaultUOM } from '../data/default-uoms.data';

@Injectable()
export class CoreSeederService implements OnModuleInit {
  private readonly logger = new Logger(CoreSeederService.name);

  constructor(
    @InjectRepository(Category)
    private readonly categoryRepository: Repository<Category>,
    @InjectRepository(UOM)
    private readonly uomRepository: Repository<UOM>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAll();
  }

  async seedAll(): Promise<{
    categories: { created: number; skipped: number; errors: number };
    uoms: { created: number; skipped: number; errors: number };
  }> {
    this.logger.log('Starting Core module seeding...');

    const categoriesResult = await this.seedCategories();
    const uomsResult = await this.seedUOMs();

    this.logger.log('Core module seeding completed');

    return {
      categories: categoriesResult,
      uoms: uomsResult,
    };
  }

  async seedCategories(): Promise<{ created: number; skipped: number; errors: number }> {
    this.logger.log('Seeding categories...');

    const result = { created: 0, skipped: 0, errors: 0 };
    const categoryCodeToIdMap = new Map<string, string>();

    // Sort by level to ensure parents are created first
    const sortedCategories = [...DEFAULT_CATEGORIES].sort((a, b) => a.level - b.level);

    for (const defaultCategory of sortedCategories) {
      try {
        const existing = await this.categoryRepository.findOne({
          where: { categoryCode: defaultCategory.categoryCode },
        });

        if (existing) {
          categoryCodeToIdMap.set(defaultCategory.categoryCode, existing.id);
          result.skipped++;
          continue;
        }

        // Resolve parent category ID
        let parentCategoryId: string | undefined;
        if (defaultCategory.parentCategoryCode) {
          parentCategoryId = categoryCodeToIdMap.get(defaultCategory.parentCategoryCode);
          if (!parentCategoryId) {
            this.logger.warn(
              `Parent category not found for ${defaultCategory.categoryCode}: ${defaultCategory.parentCategoryCode}`,
            );
            result.errors++;
            continue;
          }
        }

        const category = this.categoryRepository.create({
          categoryCode: defaultCategory.categoryCode,
          categoryName: defaultCategory.categoryName,
          categoryType: defaultCategory.categoryType,
          parentCategoryId: parentCategoryId,
          level: defaultCategory.level,
          description: defaultCategory.description,
          sortOrder: defaultCategory.sortOrder,
          isActive: true,
          createdBy: 'SYSTEM_SEEDER',
        });

        const savedCategory = await this.categoryRepository.save(category);
        categoryCodeToIdMap.set(defaultCategory.categoryCode, savedCategory.id);
        result.created++;

        this.logger.debug(`Created category: ${defaultCategory.categoryName}`);
      } catch (error) {
        this.logger.error(
          `Error creating category ${defaultCategory.categoryCode}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `Categories seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );
    return result;
  }

  async seedUOMs(): Promise<{ created: number; skipped: number; errors: number }> {
    this.logger.log('Seeding UOMs...');

    const result = { created: 0, skipped: 0, errors: 0 };
    const uomCodeToIdMap = new Map<string, string>();

    // First pass: Create base UOMs (those without baseUOMCode)
    const baseUOMs = DEFAULT_UOMS.filter(u => !u.baseUOMCode);
    const derivedUOMs = DEFAULT_UOMS.filter(u => u.baseUOMCode);

    // Create base UOMs first
    for (const defaultUOM of baseUOMs) {
      try {
        const existing = await this.uomRepository.findOne({
          where: { uomCode: defaultUOM.uomCode },
        });

        if (existing) {
          uomCodeToIdMap.set(defaultUOM.uomCode, existing.id);
          result.skipped++;
          continue;
        }

        const uom = this.uomRepository.create({
          uomCode: defaultUOM.uomCode,
          uomName: defaultUOM.uomName,
          uomType: defaultUOM.uomType,
          symbol: defaultUOM.symbol,
          conversionFactor: defaultUOM.conversionFactor,
          allowFractional: defaultUOM.allowFractional,
          decimalPlaces: defaultUOM.decimalPlaces,
          description: defaultUOM.description,
          isActive: true,
          createdBy: 'SYSTEM_SEEDER',
        });

        const savedUOM = await this.uomRepository.save(uom);
        uomCodeToIdMap.set(defaultUOM.uomCode, savedUOM.id);
        result.created++;

        this.logger.debug(`Created base UOM: ${defaultUOM.uomName}`);
      } catch (error) {
        this.logger.error(
          `Error creating base UOM ${defaultUOM.uomCode}: ${error.message}`,
        );
        result.errors++;
      }
    }

    // Second pass: Create derived UOMs
    for (const defaultUOM of derivedUOMs) {
      try {
        const existing = await this.uomRepository.findOne({
          where: { uomCode: defaultUOM.uomCode },
        });

        if (existing) {
          uomCodeToIdMap.set(defaultUOM.uomCode, existing.id);
          result.skipped++;
          continue;
        }

        // Resolve base UOM ID
        let baseUOMId: string | undefined;
        if (defaultUOM.baseUOMCode) {
          baseUOMId = uomCodeToIdMap.get(defaultUOM.baseUOMCode);
          if (!baseUOMId) {
            this.logger.warn(
              `Base UOM not found for ${defaultUOM.uomCode}: ${defaultUOM.baseUOMCode}`,
            );
            result.errors++;
            continue;
          }
        }

        const uom = this.uomRepository.create({
          uomCode: defaultUOM.uomCode,
          uomName: defaultUOM.uomName,
          uomType: defaultUOM.uomType,
          symbol: defaultUOM.symbol,
          baseUOMId: baseUOMId,
          conversionFactor: defaultUOM.conversionFactor,
          allowFractional: defaultUOM.allowFractional,
          decimalPlaces: defaultUOM.decimalPlaces,
          description: defaultUOM.description,
          isActive: true,
          createdBy: 'SYSTEM_SEEDER',
        });

        const savedUOM = await this.uomRepository.save(uom);
        uomCodeToIdMap.set(defaultUOM.uomCode, savedUOM.id);
        result.created++;

        this.logger.debug(`Created derived UOM: ${defaultUOM.uomName}`);
      } catch (error) {
        this.logger.error(
          `Error creating derived UOM ${defaultUOM.uomCode}: ${error.message}`,
        );
        result.errors++;
      }
    }

    this.logger.log(
      `UOMs seeding completed. Created: ${result.created}, Skipped: ${result.skipped}, Errors: ${result.errors}`,
    );
    return result;
  }

  async seedMissing(): Promise<{
    categories: { created: number; skipped: number; errors: number };
    uoms: { created: number; skipped: number; errors: number };
  }> {
    // Same as seedAll but explicitly for adding missing records
    return this.seedAll();
  }

  getStats(): {
    categories: { total: number; byType: Record<string, number> };
    uoms: { total: number; byType: Record<string, number> };
  } {
    const categoryStats = {
      total: DEFAULT_CATEGORIES.length,
      byType: {} as Record<string, number>,
    };

    const uomStats = {
      total: DEFAULT_UOMS.length,
      byType: {} as Record<string, number>,
    };

    for (const category of DEFAULT_CATEGORIES) {
      categoryStats.byType[category.categoryType] =
        (categoryStats.byType[category.categoryType] || 0) + 1;
    }

    for (const uom of DEFAULT_UOMS) {
      uomStats.byType[uom.uomType] = (uomStats.byType[uom.uomType] || 0) + 1;
    }

    return { categories: categoryStats, uoms: uomStats };
  }
}
