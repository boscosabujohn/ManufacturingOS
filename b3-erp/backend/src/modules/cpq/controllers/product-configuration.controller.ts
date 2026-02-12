import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import {
  BundleItem,
  CompatibilityRule,
  ConfigurationRule,
  CPQProduct,
  ProductBundle,
  ProductConfiguration,
  ProductOption,
} from '../entities/product-configuration.entity';
import { ProductConfigurationService } from '../services/product-configuration.service';

@Controller('cpq/products')
export class ProductConfigurationController {
  constructor(
    private readonly productConfigurationService: ProductConfigurationService,
  ) {}

  // Products
  @Post()
  createProduct(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CPQProduct>,
  ): Promise<CPQProduct> {
    return this.productConfigurationService.createProduct(companyId, data);
  }

  @Get()
  findAllProducts(
    @Headers('x-company-id') companyId: string,
    @Query('category') category?: string,
    @Query('isConfigurable') isConfigurable?: string,
    @Query('isActive') isActive?: string,
    @Query('search') search?: string,
  ): Promise<CPQProduct[]> {
    return this.productConfigurationService.findAllProducts(companyId, {
      category,
      isConfigurable: isConfigurable === 'true' ? true : isConfigurable === 'false' ? false : undefined,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
      search,
    });
  }

  @Get(':id')
  findProductById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<CPQProduct> {
    return this.productConfigurationService.findProductById(companyId, id);
  }

  @Patch(':id')
  updateProduct(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<CPQProduct>,
  ): Promise<CPQProduct> {
    return this.productConfigurationService.updateProduct(companyId, id, data);
  }

  @Delete(':id')
  deleteProduct(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.productConfigurationService.deleteProduct(companyId, id);
  }

  // Product Options
  @Post(':productId/options')
  createOption(
    @Headers('x-company-id') companyId: string,
    @Param('productId') productId: string,
    @Body() data: Partial<ProductOption>,
  ): Promise<ProductOption> {
    return this.productConfigurationService.createOption(companyId, productId, data);
  }

  @Get(':productId/options')
  findProductOptions(
    @Param('productId') productId: string,
  ): Promise<ProductOption[]> {
    return this.productConfigurationService.findProductOptions(productId);
  }

  @Patch('options/:id')
  updateOption(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<ProductOption>,
  ): Promise<ProductOption> {
    return this.productConfigurationService.updateOption(companyId, id, data);
  }

  @Delete('options/:id')
  deleteOption(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.productConfigurationService.deleteOption(companyId, id);
  }

  // Product Bundles
  @Post('bundles')
  createBundle(
    @Headers('x-company-id') companyId: string,
    @Body() body: { bundle: Partial<ProductBundle>; items?: Partial<BundleItem>[] },
  ): Promise<ProductBundle> {
    return this.productConfigurationService.createBundle(
      companyId,
      body.bundle,
      body.items,
    );
  }

  @Get('bundles')
  findAllBundles(
    @Headers('x-company-id') companyId: string,
    @Query('isActive') isActive?: string,
  ): Promise<ProductBundle[]> {
    return this.productConfigurationService.findAllBundles(companyId, {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('bundles/:id')
  findBundleById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<ProductBundle> {
    return this.productConfigurationService.findBundleById(companyId, id);
  }

  @Get('bundles/:id/items')
  findBundleItems(@Param('id') bundleId: string): Promise<BundleItem[]> {
    return this.productConfigurationService.findBundleItems(bundleId);
  }

  @Get('bundles/:id/price')
  calculateBundlePrice(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<{
    baseTotal: number;
    discountAmount: number;
    finalPrice: number;
    items: { productId: string; quantity: number; unitPrice: number; subtotal: number }[];
  }> {
    return this.productConfigurationService.calculateBundlePrice(companyId, id);
  }

  @Patch('bundles/:id')
  updateBundle(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<ProductBundle>,
  ): Promise<ProductBundle> {
    return this.productConfigurationService.updateBundle(companyId, id, data);
  }

  @Patch('bundles/:id/items')
  updateBundleItems(
    @Param('id') bundleId: string,
    @Body() items: Partial<BundleItem>[],
  ): Promise<BundleItem[]> {
    return this.productConfigurationService.updateBundleItems(bundleId, items);
  }

  @Delete('bundles/:id')
  deleteBundle(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.productConfigurationService.deleteBundle(companyId, id);
  }

  // Configuration Rules
  @Post('rules')
  createRule(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ConfigurationRule>,
  ): Promise<ConfigurationRule> {
    return this.productConfigurationService.createRule(companyId, data);
  }

  @Get('rules')
  findAllRules(
    @Headers('x-company-id') companyId: string,
    @Query('ruleType') ruleType?: string,
    @Query('productId') productId?: string,
    @Query('isActive') isActive?: string,
  ): Promise<ConfigurationRule[]> {
    return this.productConfigurationService.findAllRules(companyId, {
      ruleType,
      productId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Patch('rules/:id')
  updateRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<ConfigurationRule>,
  ): Promise<ConfigurationRule> {
    return this.productConfigurationService.updateRule(companyId, id, data);
  }

  @Delete('rules/:id')
  deleteRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.productConfigurationService.deleteRule(companyId, id);
  }

  // Compatibility Matrix
  @Post('compatibility')
  createCompatibilityRule(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CompatibilityRule>,
  ): Promise<CompatibilityRule> {
    return this.productConfigurationService.createCompatibilityRule(companyId, data);
  }

  @Get('compatibility')
  findCompatibilityRules(
    @Headers('x-company-id') companyId: string,
    @Query('productId') productId?: string,
  ): Promise<CompatibilityRule[]> {
    return this.productConfigurationService.findCompatibilityRules(companyId, productId);
  }

  @Get('compatibility/matrix')
  getCompatibilityMatrix(
    @Headers('x-company-id') companyId: string,
  ): Promise<{
    products: { id: string; name: string }[];
    matrix: { sourceId: string; targetId: string; type: string }[];
  }> {
    return this.productConfigurationService.getCompatibilityMatrix(companyId);
  }

  @Delete('compatibility/:id')
  deleteCompatibilityRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.productConfigurationService.deleteCompatibilityRule(companyId, id);
  }

  // Product Configurations
  @Post('configurations')
  createConfiguration(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ProductConfiguration>,
  ): Promise<ProductConfiguration> {
    return this.productConfigurationService.createConfiguration(companyId, data);
  }

  @Get('configurations/:id')
  findConfigurationById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<ProductConfiguration> {
    return this.productConfigurationService.findConfigurationById(companyId, id);
  }

  @Post('configurations/:id/validate')
  validateConfiguration(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<{ isValid: boolean; errors: { field: string; message: string }[] }> {
    return this.productConfigurationService.validateConfiguration(companyId, id);
  }

  @Post('configurations/:id/calculate-price')
  calculateConfigurationPrice(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<ProductConfiguration> {
    return this.productConfigurationService.calculateConfigurationPrice(companyId, id);
  }

  @Patch('configurations/:id')
  updateConfiguration(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<ProductConfiguration>,
  ): Promise<ProductConfiguration> {
    return this.productConfigurationService.updateConfiguration(companyId, id, data);
  }

  @Delete('configurations/:id')
  deleteConfiguration(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.productConfigurationService.deleteConfiguration(companyId, id);
  }
}
