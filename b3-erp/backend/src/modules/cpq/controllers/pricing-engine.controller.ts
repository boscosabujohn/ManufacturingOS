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
  ContractPricing,
  CustomerPricing,
  DynamicPricingRule,
  PricingRule,
  PromotionalPricing,
  VolumeDiscount,
} from '../entities/pricing-engine.entity';
import { PricingEngineService } from '../services/pricing-engine.service';

@Controller('cpq/pricing')
export class PricingEngineController {
  constructor(private readonly pricingEngineService: PricingEngineService) {}

  // Pricing Rules
  @Post('rules')
  createPricingRule(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<PricingRule>,
  ): Promise<PricingRule> {
    return this.pricingEngineService.createPricingRule(companyId, data);
  }

  @Get('rules')
  findAllPricingRules(
    @Headers('x-company-id') companyId: string,
    @Query('ruleType') ruleType?: string,
    @Query('applyTo') applyTo?: string,
    @Query('isActive') isActive?: string,
  ): Promise<PricingRule[]> {
    return this.pricingEngineService.findAllPricingRules(companyId, {
      ruleType,
      applyTo,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('rules/:id')
  findPricingRuleById(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<PricingRule> {
    return this.pricingEngineService.findPricingRuleById(companyId, id);
  }

  @Patch('rules/:id')
  updatePricingRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<PricingRule>,
  ): Promise<PricingRule> {
    return this.pricingEngineService.updatePricingRule(companyId, id, data);
  }

  @Delete('rules/:id')
  deletePricingRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.pricingEngineService.deletePricingRule(companyId, id);
  }

  // Volume Discounts
  @Post('volume-discounts')
  createVolumeDiscount(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<VolumeDiscount>,
  ): Promise<VolumeDiscount> {
    return this.pricingEngineService.createVolumeDiscount(companyId, data);
  }

  @Get('volume-discounts')
  findAllVolumeDiscounts(
    @Headers('x-company-id') companyId: string,
    @Query('productId') productId?: string,
    @Query('isActive') isActive?: string,
  ): Promise<VolumeDiscount[]> {
    return this.pricingEngineService.findAllVolumeDiscounts(companyId, {
      productId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('volume-discounts/applicable')
  getApplicableVolumeDiscount(
    @Headers('x-company-id') companyId: string,
    @Query('productId') productId: string,
    @Query('quantity') quantity: string,
  ): Promise<{
    discountPercentage: number;
    discountAmount: number;
    tier: unknown;
  } | null> {
    return this.pricingEngineService.getApplicableVolumeDiscount(
      companyId,
      productId,
      parseInt(quantity, 10),
    );
  }

  @Patch('volume-discounts/:id')
  updateVolumeDiscount(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<VolumeDiscount>,
  ): Promise<VolumeDiscount> {
    return this.pricingEngineService.updateVolumeDiscount(companyId, id, data);
  }

  @Delete('volume-discounts/:id')
  deleteVolumeDiscount(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.pricingEngineService.deleteVolumeDiscount(companyId, id);
  }

  // Customer-Specific Pricing
  @Post('customer-pricing')
  createCustomerPricing(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<CustomerPricing>,
  ): Promise<CustomerPricing> {
    return this.pricingEngineService.createCustomerPricing(companyId, data);
  }

  @Get('customer-pricing')
  findCustomerPricing(
    @Headers('x-company-id') companyId: string,
    @Query('customerId') customerId: string,
    @Query('productId') productId?: string,
  ): Promise<CustomerPricing[]> {
    return this.pricingEngineService.findCustomerPricing(
      companyId,
      customerId,
      productId,
    );
  }

  @Patch('customer-pricing/:id')
  updateCustomerPricing(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<CustomerPricing>,
  ): Promise<CustomerPricing> {
    return this.pricingEngineService.updateCustomerPricing(companyId, id, data);
  }

  @Delete('customer-pricing/:id')
  deleteCustomerPricing(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.pricingEngineService.deleteCustomerPricing(companyId, id);
  }

  // Contract Pricing
  @Post('contract-pricing')
  createContractPricing(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<ContractPricing>,
  ): Promise<ContractPricing> {
    return this.pricingEngineService.createContractPricing(companyId, data);
  }

  @Get('contract-pricing')
  findContractPricing(
    @Headers('x-company-id') companyId: string,
    @Query('customerId') customerId?: string,
    @Query('contractId') contractId?: string,
    @Query('isActive') isActive?: string,
  ): Promise<ContractPricing[]> {
    return this.pricingEngineService.findContractPricing(companyId, {
      customerId,
      contractId,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Get('contract-pricing/active')
  getActiveContractPrice(
    @Headers('x-company-id') companyId: string,
    @Query('customerId') customerId: string,
    @Query('productId') productId: string,
  ): Promise<ContractPricing | null> {
    return this.pricingEngineService.getActiveContractPrice(
      companyId,
      customerId,
      productId,
    );
  }

  @Patch('contract-pricing/:id')
  updateContractPricing(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<ContractPricing>,
  ): Promise<ContractPricing> {
    return this.pricingEngineService.updateContractPricing(companyId, id, data);
  }

  @Delete('contract-pricing/:id')
  deleteContractPricing(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.pricingEngineService.deleteContractPricing(companyId, id);
  }

  // Promotional Pricing
  @Post('promotions')
  createPromotionalPricing(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<PromotionalPricing>,
  ): Promise<PromotionalPricing> {
    return this.pricingEngineService.createPromotionalPricing(companyId, data);
  }

  @Get('promotions')
  findAllPromotions(
    @Headers('x-company-id') companyId: string,
    @Query('isActive') isActive?: string,
  ): Promise<PromotionalPricing[]> {
    return this.pricingEngineService.findAllPromotions(companyId, {
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Post('promotions/validate')
  validatePromoCode(
    @Headers('x-company-id') companyId: string,
    @Body()
    body: { promoCode: string; customerId?: string; orderValue?: number },
  ): Promise<{
    isValid: boolean;
    promotion?: PromotionalPricing;
    error?: string;
  }> {
    return this.pricingEngineService.validatePromoCode(
      companyId,
      body.promoCode,
      body.customerId,
      body.orderValue,
    );
  }

  @Post('promotions/apply')
  applyPromoCode(
    @Headers('x-company-id') companyId: string,
    @Body() body: { promoCode: string },
  ): Promise<void> {
    return this.pricingEngineService.applyPromoCode(companyId, body.promoCode);
  }

  @Patch('promotions/:id')
  updatePromotionalPricing(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<PromotionalPricing>,
  ): Promise<PromotionalPricing> {
    return this.pricingEngineService.updatePromotionalPricing(companyId, id, data);
  }

  @Delete('promotions/:id')
  deletePromotionalPricing(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.pricingEngineService.deletePromotionalPricing(companyId, id);
  }

  // Dynamic Pricing
  @Post('dynamic')
  createDynamicPricingRule(
    @Headers('x-company-id') companyId: string,
    @Body() data: Partial<DynamicPricingRule>,
  ): Promise<DynamicPricingRule> {
    return this.pricingEngineService.createDynamicPricingRule(companyId, data);
  }

  @Get('dynamic')
  findAllDynamicPricingRules(
    @Headers('x-company-id') companyId: string,
    @Query('pricingStrategy') pricingStrategy?: string,
    @Query('isActive') isActive?: string,
  ): Promise<DynamicPricingRule[]> {
    return this.pricingEngineService.findAllDynamicPricingRules(companyId, {
      pricingStrategy,
      isActive: isActive === 'true' ? true : isActive === 'false' ? false : undefined,
    });
  }

  @Patch('dynamic/:id')
  updateDynamicPricingRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
    @Body() data: Partial<DynamicPricingRule>,
  ): Promise<DynamicPricingRule> {
    return this.pricingEngineService.updateDynamicPricingRule(companyId, id, data);
  }

  @Delete('dynamic/:id')
  deleteDynamicPricingRule(
    @Headers('x-company-id') companyId: string,
    @Param('id') id: string,
  ): Promise<void> {
    return this.pricingEngineService.deleteDynamicPricingRule(companyId, id);
  }

  // Price Calculation
  @Post('calculate')
  calculatePrice(
    @Headers('x-company-id') companyId: string,
    @Body()
    body: {
      productId: string;
      basePrice: number;
      quantity: number;
      customerId?: string;
    },
  ): Promise<{
    listPrice: number;
    unitPrice: number;
    extendedPrice: number;
    discounts: { type: string; amount: number; description: string }[];
    totalDiscount: number;
  }> {
    return this.pricingEngineService.calculatePrice(
      companyId,
      body.productId,
      body.basePrice,
      body.quantity,
      body.customerId,
    );
  }
}
