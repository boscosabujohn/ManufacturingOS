import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual, IsNull, Or } from 'typeorm';
import {
  ContractPricing,
  CustomerPricing,
  DynamicPricingRule,
  PricingRule,
  PromotionalPricing,
  VolumeDiscount,
} from '../entities/pricing-engine.entity';

@Injectable()
export class PricingEngineService {
  constructor(
    @InjectRepository(PricingRule)
    private pricingRuleRepository: Repository<PricingRule>,
    @InjectRepository(VolumeDiscount)
    private volumeDiscountRepository: Repository<VolumeDiscount>,
    @InjectRepository(CustomerPricing)
    private customerPricingRepository: Repository<CustomerPricing>,
    @InjectRepository(ContractPricing)
    private contractPricingRepository: Repository<ContractPricing>,
    @InjectRepository(PromotionalPricing)
    private promotionalPricingRepository: Repository<PromotionalPricing>,
    @InjectRepository(DynamicPricingRule)
    private dynamicPricingRepository: Repository<DynamicPricingRule>,
  ) {}

  // Pricing Rules
  async createPricingRule(
    companyId: string,
    data: Partial<PricingRule>,
  ): Promise<PricingRule> {
    const rule = this.pricingRuleRepository.create({
      ...data,
      companyId,
    });
    return this.pricingRuleRepository.save(rule);
  }

  async findAllPricingRules(
    companyId: string,
    filters?: { ruleType?: string; applyTo?: string; isActive?: boolean },
  ): Promise<PricingRule[]> {
    const query = this.pricingRuleRepository
      .createQueryBuilder('rule')
      .where('rule.companyId = :companyId', { companyId })
      .orderBy('rule.priority', 'ASC');

    if (filters?.ruleType) {
      query.andWhere('rule.ruleType = :ruleType', { ruleType: filters.ruleType });
    }
    if (filters?.applyTo) {
      query.andWhere('rule.applyTo = :applyTo', { applyTo: filters.applyTo });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('rule.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async findPricingRuleById(companyId: string, id: string): Promise<PricingRule> {
    const rule = await this.pricingRuleRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException(`Pricing Rule with ID ${id} not found`);
    }
    return rule;
  }

  async updatePricingRule(
    companyId: string,
    id: string,
    data: Partial<PricingRule>,
  ): Promise<PricingRule> {
    const rule = await this.findPricingRuleById(companyId, id);
    Object.assign(rule, data);
    return this.pricingRuleRepository.save(rule);
  }

  async deletePricingRule(companyId: string, id: string): Promise<void> {
    const rule = await this.findPricingRuleById(companyId, id);
    await this.pricingRuleRepository.remove(rule);
  }

  // Volume Discounts
  async createVolumeDiscount(
    companyId: string,
    data: Partial<VolumeDiscount>,
  ): Promise<VolumeDiscount> {
    const discount = this.volumeDiscountRepository.create({
      ...data,
      companyId,
    });
    return this.volumeDiscountRepository.save(discount);
  }

  async findAllVolumeDiscounts(
    companyId: string,
    filters?: { productId?: string; isActive?: boolean },
  ): Promise<VolumeDiscount[]> {
    const query = this.volumeDiscountRepository
      .createQueryBuilder('discount')
      .where('discount.companyId = :companyId', { companyId })
      .orderBy('discount.name', 'ASC');

    if (filters?.productId) {
      query.andWhere('discount.productId = :productId', {
        productId: filters.productId,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('discount.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async getApplicableVolumeDiscount(
    companyId: string,
    productId: string,
    quantity: number,
  ): Promise<{ discountPercentage: number; discountAmount: number; tier: unknown } | null> {
    const discounts = await this.volumeDiscountRepository.find({
      where: {
        companyId,
        productId,
        isActive: true,
      },
    });

    for (const discount of discounts) {
      for (const tier of discount.tiers) {
        if (
          quantity >= tier.minQuantity &&
          (tier.maxQuantity === undefined || quantity <= tier.maxQuantity)
        ) {
          return {
            discountPercentage: tier.discountPercentage || 0,
            discountAmount: tier.discountAmount || 0,
            tier,
          };
        }
      }
    }

    return null;
  }

  async updateVolumeDiscount(
    companyId: string,
    id: string,
    data: Partial<VolumeDiscount>,
  ): Promise<VolumeDiscount> {
    const discount = await this.volumeDiscountRepository.findOne({
      where: { id, companyId },
    });
    if (!discount) {
      throw new NotFoundException(`Volume Discount with ID ${id} not found`);
    }
    Object.assign(discount, data);
    return this.volumeDiscountRepository.save(discount);
  }

  async deleteVolumeDiscount(companyId: string, id: string): Promise<void> {
    const discount = await this.volumeDiscountRepository.findOne({
      where: { id, companyId },
    });
    if (!discount) {
      throw new NotFoundException(`Volume Discount with ID ${id} not found`);
    }
    await this.volumeDiscountRepository.remove(discount);
  }

  // Customer-Specific Pricing
  async createCustomerPricing(
    companyId: string,
    data: Partial<CustomerPricing>,
  ): Promise<CustomerPricing> {
    const pricing = this.customerPricingRepository.create({
      ...data,
      companyId,
    });
    return this.customerPricingRepository.save(pricing);
  }

  async findCustomerPricing(
    companyId: string,
    customerId: string,
    productId?: string,
  ): Promise<CustomerPricing[]> {
    const query = this.customerPricingRepository
      .createQueryBuilder('pricing')
      .where('pricing.companyId = :companyId', { companyId })
      .andWhere('pricing.customerId = :customerId', { customerId })
      .andWhere('pricing.isActive = :isActive', { isActive: true })
      .orderBy('pricing.priority', 'ASC');

    if (productId) {
      query.andWhere('(pricing.productId = :productId OR pricing.productId IS NULL)', {
        productId,
      });
    }

    return query.getMany();
  }

  async updateCustomerPricing(
    companyId: string,
    id: string,
    data: Partial<CustomerPricing>,
  ): Promise<CustomerPricing> {
    const pricing = await this.customerPricingRepository.findOne({
      where: { id, companyId },
    });
    if (!pricing) {
      throw new NotFoundException(`Customer Pricing with ID ${id} not found`);
    }
    Object.assign(pricing, data);
    return this.customerPricingRepository.save(pricing);
  }

  async deleteCustomerPricing(companyId: string, id: string): Promise<void> {
    const pricing = await this.customerPricingRepository.findOne({
      where: { id, companyId },
    });
    if (!pricing) {
      throw new NotFoundException(`Customer Pricing with ID ${id} not found`);
    }
    await this.customerPricingRepository.remove(pricing);
  }

  // Contract Pricing
  async createContractPricing(
    companyId: string,
    data: Partial<ContractPricing>,
  ): Promise<ContractPricing> {
    const pricing = this.contractPricingRepository.create({
      ...data,
      companyId,
    });
    return this.contractPricingRepository.save(pricing);
  }

  async findContractPricing(
    companyId: string,
    filters?: { customerId?: string; contractId?: string; isActive?: boolean },
  ): Promise<ContractPricing[]> {
    const query = this.contractPricingRepository
      .createQueryBuilder('pricing')
      .where('pricing.companyId = :companyId', { companyId });

    if (filters?.customerId) {
      query.andWhere('pricing.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }
    if (filters?.contractId) {
      query.andWhere('pricing.contractId = :contractId', {
        contractId: filters.contractId,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('pricing.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async getActiveContractPrice(
    companyId: string,
    customerId: string,
    productId: string,
  ): Promise<ContractPricing | null> {
    const today = new Date();
    return this.contractPricingRepository.findOne({
      where: {
        companyId,
        customerId,
        productId,
        isActive: true,
        startDate: LessThanOrEqual(today),
        endDate: MoreThanOrEqual(today),
      },
    });
  }

  async updateContractPricing(
    companyId: string,
    id: string,
    data: Partial<ContractPricing>,
  ): Promise<ContractPricing> {
    const pricing = await this.contractPricingRepository.findOne({
      where: { id, companyId },
    });
    if (!pricing) {
      throw new NotFoundException(`Contract Pricing with ID ${id} not found`);
    }
    Object.assign(pricing, data);
    return this.contractPricingRepository.save(pricing);
  }

  async deleteContractPricing(companyId: string, id: string): Promise<void> {
    const pricing = await this.contractPricingRepository.findOne({
      where: { id, companyId },
    });
    if (!pricing) {
      throw new NotFoundException(`Contract Pricing with ID ${id} not found`);
    }
    await this.contractPricingRepository.remove(pricing);
  }

  // Promotional Pricing
  async createPromotionalPricing(
    companyId: string,
    data: Partial<PromotionalPricing>,
  ): Promise<PromotionalPricing> {
    const pricing = this.promotionalPricingRepository.create({
      ...data,
      companyId,
    });
    return this.promotionalPricingRepository.save(pricing);
  }

  async findAllPromotions(
    companyId: string,
    filters?: { isActive?: boolean },
  ): Promise<PromotionalPricing[]> {
    const query = this.promotionalPricingRepository
      .createQueryBuilder('promo')
      .where('promo.companyId = :companyId', { companyId })
      .orderBy('promo.startDate', 'DESC');

    if (filters?.isActive !== undefined) {
      query.andWhere('promo.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async validatePromoCode(
    companyId: string,
    promoCode: string,
    customerId?: string,
    orderValue?: number,
  ): Promise<{
    isValid: boolean;
    promotion?: PromotionalPricing;
    error?: string;
  }> {
    const promo = await this.promotionalPricingRepository.findOne({
      where: { companyId, promoCode, isActive: true },
    });

    if (!promo) {
      return { isValid: false, error: 'Invalid promo code' };
    }

    const today = new Date();
    if (today < promo.startDate || today > promo.endDate) {
      return { isValid: false, error: 'Promo code has expired' };
    }

    if (promo.maxUsageCount && promo.currentUsageCount >= promo.maxUsageCount) {
      return { isValid: false, error: 'Promo code usage limit reached' };
    }

    if (promo.minimumOrderValue && orderValue && orderValue < Number(promo.minimumOrderValue)) {
      return {
        isValid: false,
        error: `Minimum order value of ${promo.minimumOrderValue} required`,
      };
    }

    if (promo.eligibleCustomerIds && customerId) {
      if (!promo.eligibleCustomerIds.includes(customerId)) {
        return { isValid: false, error: 'Promo code not valid for this customer' };
      }
    }

    return { isValid: true, promotion: promo };
  }

  async applyPromoCode(companyId: string, promoCode: string): Promise<void> {
    await this.promotionalPricingRepository.update(
      { companyId, promoCode },
      { currentUsageCount: () => 'currentUsageCount + 1' },
    );
  }

  async updatePromotionalPricing(
    companyId: string,
    id: string,
    data: Partial<PromotionalPricing>,
  ): Promise<PromotionalPricing> {
    const pricing = await this.promotionalPricingRepository.findOne({
      where: { id, companyId },
    });
    if (!pricing) {
      throw new NotFoundException(`Promotional Pricing with ID ${id} not found`);
    }
    Object.assign(pricing, data);
    return this.promotionalPricingRepository.save(pricing);
  }

  async deletePromotionalPricing(companyId: string, id: string): Promise<void> {
    const pricing = await this.promotionalPricingRepository.findOne({
      where: { id, companyId },
    });
    if (!pricing) {
      throw new NotFoundException(`Promotional Pricing with ID ${id} not found`);
    }
    await this.promotionalPricingRepository.remove(pricing);
  }

  // Dynamic Pricing
  async createDynamicPricingRule(
    companyId: string,
    data: Partial<DynamicPricingRule>,
  ): Promise<DynamicPricingRule> {
    const rule = this.dynamicPricingRepository.create({
      ...data,
      companyId,
    });
    return this.dynamicPricingRepository.save(rule);
  }

  async findAllDynamicPricingRules(
    companyId: string,
    filters?: { pricingStrategy?: string; isActive?: boolean },
  ): Promise<DynamicPricingRule[]> {
    const query = this.dynamicPricingRepository
      .createQueryBuilder('rule')
      .where('rule.companyId = :companyId', { companyId });

    if (filters?.pricingStrategy) {
      query.andWhere('rule.pricingStrategy = :pricingStrategy', {
        pricingStrategy: filters.pricingStrategy,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('rule.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async updateDynamicPricingRule(
    companyId: string,
    id: string,
    data: Partial<DynamicPricingRule>,
  ): Promise<DynamicPricingRule> {
    const rule = await this.dynamicPricingRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException(`Dynamic Pricing Rule with ID ${id} not found`);
    }
    Object.assign(rule, data);
    return this.dynamicPricingRepository.save(rule);
  }

  async deleteDynamicPricingRule(companyId: string, id: string): Promise<void> {
    const rule = await this.dynamicPricingRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException(`Dynamic Pricing Rule with ID ${id} not found`);
    }
    await this.dynamicPricingRepository.remove(rule);
  }

  // Price Calculation
  async calculatePrice(
    companyId: string,
    productId: string,
    basePrice: number,
    quantity: number,
    customerId?: string,
  ): Promise<{
    listPrice: number;
    unitPrice: number;
    extendedPrice: number;
    discounts: { type: string; amount: number; description: string }[];
    totalDiscount: number;
  }> {
    const discounts: { type: string; amount: number; description: string }[] = [];
    let currentPrice = basePrice;

    // 1. Check contract pricing
    if (customerId) {
      const contractPrice = await this.getActiveContractPrice(
        companyId,
        customerId,
        productId,
      );
      if (contractPrice) {
        if (contractPrice.contractPrice) {
          const discountAmt = basePrice - Number(contractPrice.contractPrice);
          discounts.push({
            type: 'contract',
            amount: discountAmt,
            description: `Contract Price (${contractPrice.contractNumber})`,
          });
          currentPrice = Number(contractPrice.contractPrice);
        } else if (contractPrice.discountPercentage) {
          const discountAmt = basePrice * (Number(contractPrice.discountPercentage) / 100);
          discounts.push({
            type: 'contract',
            amount: discountAmt,
            description: `Contract Discount ${contractPrice.discountPercentage}%`,
          });
          currentPrice = basePrice - discountAmt;
        }
      }
    }

    // 2. Check customer-specific pricing
    if (customerId && discounts.length === 0) {
      const customerPrices = await this.findCustomerPricing(
        companyId,
        customerId,
        productId,
      );
      if (customerPrices.length > 0) {
        const cp = customerPrices[0];
        if (cp.pricingType === 'fixed_price' && cp.value) {
          const discountAmt = basePrice - Number(cp.value);
          discounts.push({
            type: 'customer',
            amount: discountAmt,
            description: 'Customer Special Price',
          });
          currentPrice = Number(cp.value);
        } else if (cp.pricingType === 'discount_percentage' && cp.value) {
          const discountAmt = basePrice * (Number(cp.value) / 100);
          discounts.push({
            type: 'customer',
            amount: discountAmt,
            description: `Customer Discount ${cp.value}%`,
          });
          currentPrice = basePrice - discountAmt;
        }
      }
    }

    // 3. Check volume discounts
    const volumeDiscount = await this.getApplicableVolumeDiscount(
      companyId,
      productId,
      quantity,
    );
    if (volumeDiscount) {
      if (volumeDiscount.discountPercentage) {
        const discountAmt = currentPrice * (volumeDiscount.discountPercentage / 100);
        discounts.push({
          type: 'volume',
          amount: discountAmt * quantity,
          description: `Volume Discount ${volumeDiscount.discountPercentage}%`,
        });
        currentPrice = currentPrice - discountAmt;
      }
    }

    const totalDiscount = discounts.reduce((sum, d) => sum + d.amount, 0);
    const extendedPrice = currentPrice * quantity;

    return {
      listPrice: basePrice,
      unitPrice: currentPrice,
      extendedPrice,
      discounts,
      totalDiscount,
    };
  }
}
