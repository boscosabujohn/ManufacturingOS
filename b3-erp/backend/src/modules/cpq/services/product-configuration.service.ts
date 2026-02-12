import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  BundleItem,
  CompatibilityRule,
  ConfigurationRule,
  CPQProduct,
  ProductBundle,
  ProductConfiguration,
  ProductOption,
} from '../entities/product-configuration.entity';

@Injectable()
export class ProductConfigurationService {
  constructor(
    @InjectRepository(CPQProduct)
    private productRepository: Repository<CPQProduct>,
    @InjectRepository(ProductOption)
    private optionRepository: Repository<ProductOption>,
    @InjectRepository(ProductBundle)
    private bundleRepository: Repository<ProductBundle>,
    @InjectRepository(BundleItem)
    private bundleItemRepository: Repository<BundleItem>,
    @InjectRepository(ConfigurationRule)
    private ruleRepository: Repository<ConfigurationRule>,
    @InjectRepository(CompatibilityRule)
    private compatibilityRepository: Repository<CompatibilityRule>,
    @InjectRepository(ProductConfiguration)
    private configurationRepository: Repository<ProductConfiguration>,
  ) {}

  // Products
  async createProduct(
    companyId: string,
    data: Partial<CPQProduct>,
  ): Promise<CPQProduct> {
    const product = this.productRepository.create({
      ...data,
      companyId,
    });
    return this.productRepository.save(product);
  }

  async findAllProducts(
    companyId: string,
    filters?: {
      category?: string;
      isConfigurable?: boolean;
      isActive?: boolean;
      search?: string;
    },
  ): Promise<CPQProduct[]> {
    const query = this.productRepository
      .createQueryBuilder('product')
      .where('product.companyId = :companyId', { companyId })
      .orderBy('product.name', 'ASC');

    if (filters?.category) {
      query.andWhere('product.category = :category', { category: filters.category });
    }
    if (filters?.isConfigurable !== undefined) {
      query.andWhere('product.isConfigurable = :isConfigurable', {
        isConfigurable: filters.isConfigurable,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('product.isActive = :isActive', { isActive: filters.isActive });
    }
    if (filters?.search) {
      query.andWhere(
        '(product.name ILIKE :search OR product.sku ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    return query.getMany();
  }

  async findProductById(companyId: string, id: string): Promise<CPQProduct> {
    const product = await this.productRepository.findOne({
      where: { id, companyId },
    });
    if (!product) {
      throw new NotFoundException(`Product with ID ${id} not found`);
    }
    return product;
  }

  async updateProduct(
    companyId: string,
    id: string,
    data: Partial<CPQProduct>,
  ): Promise<CPQProduct> {
    const product = await this.findProductById(companyId, id);
    Object.assign(product, data);
    return this.productRepository.save(product);
  }

  async deleteProduct(companyId: string, id: string): Promise<void> {
    const product = await this.findProductById(companyId, id);
    await this.productRepository.remove(product);
  }

  // Product Options
  async createOption(
    companyId: string,
    productId: string,
    data: Partial<ProductOption>,
  ): Promise<ProductOption> {
    const option = this.optionRepository.create({
      ...data,
      companyId,
      productId,
    });
    return this.optionRepository.save(option);
  }

  async findProductOptions(productId: string): Promise<ProductOption[]> {
    return this.optionRepository.find({
      where: { productId },
      order: { optionGroupName: 'ASC', sortOrder: 'ASC' },
    });
  }

  async updateOption(
    companyId: string,
    id: string,
    data: Partial<ProductOption>,
  ): Promise<ProductOption> {
    const option = await this.optionRepository.findOne({
      where: { id, companyId },
    });
    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    Object.assign(option, data);
    return this.optionRepository.save(option);
  }

  async deleteOption(companyId: string, id: string): Promise<void> {
    const option = await this.optionRepository.findOne({
      where: { id, companyId },
    });
    if (!option) {
      throw new NotFoundException(`Option with ID ${id} not found`);
    }
    await this.optionRepository.remove(option);
  }

  // Product Bundles
  async createBundle(
    companyId: string,
    data: Partial<ProductBundle>,
    items?: Partial<BundleItem>[],
  ): Promise<ProductBundle> {
    const bundle = this.bundleRepository.create({
      ...data,
      companyId,
    });
    const savedBundle = await this.bundleRepository.save(bundle);

    if (items && items.length > 0) {
      const bundleItems = items.map((item) =>
        this.bundleItemRepository.create({
          ...item,
          bundleId: savedBundle.id,
        }),
      );
      await this.bundleItemRepository.save(bundleItems);
    }

    return this.findBundleById(companyId, savedBundle.id);
  }

  async findAllBundles(
    companyId: string,
    filters?: { isActive?: boolean },
  ): Promise<ProductBundle[]> {
    const query = this.bundleRepository
      .createQueryBuilder('bundle')
      .where('bundle.companyId = :companyId', { companyId })
      .orderBy('bundle.name', 'ASC');

    if (filters?.isActive !== undefined) {
      query.andWhere('bundle.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async findBundleById(companyId: string, id: string): Promise<ProductBundle> {
    const bundle = await this.bundleRepository.findOne({
      where: { id, companyId },
    });
    if (!bundle) {
      throw new NotFoundException(`Bundle with ID ${id} not found`);
    }
    return bundle;
  }

  async findBundleItems(bundleId: string): Promise<BundleItem[]> {
    return this.bundleItemRepository.find({
      where: { bundleId },
      relations: ['product'],
      order: { sortOrder: 'ASC' },
    });
  }

  async updateBundle(
    companyId: string,
    id: string,
    data: Partial<ProductBundle>,
  ): Promise<ProductBundle> {
    const bundle = await this.findBundleById(companyId, id);
    Object.assign(bundle, data);
    return this.bundleRepository.save(bundle);
  }

  async updateBundleItems(
    bundleId: string,
    items: Partial<BundleItem>[],
  ): Promise<BundleItem[]> {
    await this.bundleItemRepository.delete({ bundleId });
    const newItems = items.map((item) =>
      this.bundleItemRepository.create({
        ...item,
        bundleId,
      }),
    );
    return this.bundleItemRepository.save(newItems);
  }

  async deleteBundle(companyId: string, id: string): Promise<void> {
    const bundle = await this.findBundleById(companyId, id);
    await this.bundleRepository.remove(bundle);
  }

  async calculateBundlePrice(companyId: string, bundleId: string): Promise<{
    baseTotal: number;
    discountAmount: number;
    finalPrice: number;
    items: { productId: string; quantity: number; unitPrice: number; subtotal: number }[];
  }> {
    const bundle = await this.findBundleById(companyId, bundleId);
    const items = await this.findBundleItems(bundleId);

    let baseTotal = 0;
    const itemDetails = items.map((item) => {
      const unitPrice = Number(item.product?.basePrice || 0);
      const subtotal = unitPrice * item.quantity;
      baseTotal += subtotal;
      return {
        productId: item.productId,
        quantity: item.quantity,
        unitPrice,
        subtotal,
      };
    });

    const discountAmount = baseTotal * (Number(bundle.discountPercentage) / 100);
    const finalPrice = bundle.basePrice > 0 ? Number(bundle.basePrice) : baseTotal - discountAmount;

    return {
      baseTotal,
      discountAmount,
      finalPrice,
      items: itemDetails,
    };
  }

  // Configuration Rules
  async createRule(
    companyId: string,
    data: Partial<ConfigurationRule>,
  ): Promise<ConfigurationRule> {
    const rule = this.ruleRepository.create({
      ...data,
      companyId,
    });
    return this.ruleRepository.save(rule);
  }

  async findAllRules(
    companyId: string,
    filters?: { ruleType?: string; productId?: string; isActive?: boolean },
  ): Promise<ConfigurationRule[]> {
    const query = this.ruleRepository
      .createQueryBuilder('rule')
      .where('rule.companyId = :companyId', { companyId })
      .orderBy('rule.priority', 'ASC');

    if (filters?.ruleType) {
      query.andWhere('rule.ruleType = :ruleType', { ruleType: filters.ruleType });
    }
    if (filters?.productId) {
      query.andWhere('rule.productId = :productId', { productId: filters.productId });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('rule.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async updateRule(
    companyId: string,
    id: string,
    data: Partial<ConfigurationRule>,
  ): Promise<ConfigurationRule> {
    const rule = await this.ruleRepository.findOne({ where: { id, companyId } });
    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }
    Object.assign(rule, data);
    return this.ruleRepository.save(rule);
  }

  async deleteRule(companyId: string, id: string): Promise<void> {
    const rule = await this.ruleRepository.findOne({ where: { id, companyId } });
    if (!rule) {
      throw new NotFoundException(`Rule with ID ${id} not found`);
    }
    await this.ruleRepository.remove(rule);
  }

  // Compatibility Matrix
  async createCompatibilityRule(
    companyId: string,
    data: Partial<CompatibilityRule>,
  ): Promise<CompatibilityRule> {
    const rule = this.compatibilityRepository.create({
      ...data,
      companyId,
    });
    return this.compatibilityRepository.save(rule);
  }

  async findCompatibilityRules(
    companyId: string,
    productId?: string,
  ): Promise<CompatibilityRule[]> {
    const query = this.compatibilityRepository
      .createQueryBuilder('rule')
      .leftJoinAndSelect('rule.sourceProduct', 'sourceProduct')
      .leftJoinAndSelect('rule.targetProduct', 'targetProduct')
      .where('rule.companyId = :companyId', { companyId });

    if (productId) {
      query.andWhere(
        '(rule.sourceProductId = :productId OR rule.targetProductId = :productId)',
        { productId },
      );
    }

    return query.getMany();
  }

  async getCompatibilityMatrix(companyId: string): Promise<{
    products: { id: string; name: string }[];
    matrix: { sourceId: string; targetId: string; type: string }[];
  }> {
    const products = await this.productRepository.find({
      where: { companyId, isActive: true },
      select: ['id', 'name'],
    });

    const rules = await this.compatibilityRepository.find({
      where: { companyId, isActive: true },
    });

    return {
      products,
      matrix: rules.map((r) => ({
        sourceId: r.sourceProductId,
        targetId: r.targetProductId,
        type: r.compatibilityType,
      })),
    };
  }

  async deleteCompatibilityRule(companyId: string, id: string): Promise<void> {
    const rule = await this.compatibilityRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException(`Compatibility rule with ID ${id} not found`);
    }
    await this.compatibilityRepository.remove(rule);
  }

  // Product Configuration
  async createConfiguration(
    companyId: string,
    data: Partial<ProductConfiguration>,
  ): Promise<ProductConfiguration> {
    const configNumber = await this.generateConfigurationNumber(companyId);
    const configuration = this.configurationRepository.create({
      ...data,
      companyId,
      configurationNumber: configNumber,
    });
    return this.configurationRepository.save(configuration);
  }

  async findConfigurationById(
    companyId: string,
    id: string,
  ): Promise<ProductConfiguration> {
    const config = await this.configurationRepository.findOne({
      where: { id, companyId },
      relations: ['product'],
    });
    if (!config) {
      throw new NotFoundException(`Configuration with ID ${id} not found`);
    }
    return config;
  }

  async validateConfiguration(
    companyId: string,
    configurationId: string,
  ): Promise<{ isValid: boolean; errors: { field: string; message: string }[] }> {
    const config = await this.findConfigurationById(companyId, configurationId);
    const rules = await this.findAllRules(companyId, {
      productId: config.productId,
      isActive: true,
    });

    const errors: { field: string; message: string }[] = [];

    for (const rule of rules) {
      if (rule.ruleType === 'validation') {
        const isValid = this.evaluateRule(rule, config);
        if (!isValid) {
          errors.push({
            field: rule.name,
            message: rule.description || `Validation failed for ${rule.name}`,
          });
        }
      }
    }

    config.validationErrors = errors;
    config.status = errors.length === 0 ? 'valid' : 'invalid';
    await this.configurationRepository.save(config);

    return { isValid: errors.length === 0, errors };
  }

  async calculateConfigurationPrice(
    companyId: string,
    configurationId: string,
  ): Promise<ProductConfiguration> {
    const config = await this.findConfigurationById(companyId, configurationId);
    const product = await this.findProductById(companyId, config.productId);

    let optionsTotal = 0;
    if (config.selectedOptions) {
      for (const option of config.selectedOptions) {
        optionsTotal += Number(option.priceAdjustment) || 0;
      }
    }

    config.basePrice = Number(product.basePrice);
    config.optionsTotal = optionsTotal;
    config.totalPrice = config.basePrice + optionsTotal;

    return this.configurationRepository.save(config);
  }

  async updateConfiguration(
    companyId: string,
    id: string,
    data: Partial<ProductConfiguration>,
  ): Promise<ProductConfiguration> {
    const config = await this.findConfigurationById(companyId, id);
    Object.assign(config, data);
    return this.configurationRepository.save(config);
  }

  async deleteConfiguration(companyId: string, id: string): Promise<void> {
    const config = await this.findConfigurationById(companyId, id);
    await this.configurationRepository.remove(config);
  }

  private evaluateRule(
    rule: ConfigurationRule,
    config: ProductConfiguration,
  ): boolean {
    // Simplified rule evaluation - in production this would be more comprehensive
    for (const condition of rule.conditions) {
      const selectedOption = config.selectedOptions?.find(
        (o) => o.optionId === condition.field,
      );
      if (!selectedOption) continue;

      switch (condition.operator) {
        case 'equals':
          if (selectedOption.value !== condition.value) return false;
          break;
        case 'not_equals':
          if (selectedOption.value === condition.value) return false;
          break;
        // Add more operators as needed
      }
    }
    return true;
  }

  private async generateConfigurationNumber(companyId: string): Promise<string> {
    const count = await this.configurationRepository.count({ where: { companyId } });
    const year = new Date().getFullYear();
    return `CFG-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}
