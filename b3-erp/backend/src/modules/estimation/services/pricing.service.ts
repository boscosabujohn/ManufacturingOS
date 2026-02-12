import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CostEstimate } from '../entities/cost-estimate.entity';
import { MarkupRule, Pricing, PricingStatus } from '../entities/pricing.entity';

@Injectable()
export class PricingService {
  constructor(
    @InjectRepository(Pricing)
    private pricingRepository: Repository<Pricing>,
    @InjectRepository(MarkupRule)
    private markupRuleRepository: Repository<MarkupRule>,
    @InjectRepository(CostEstimate)
    private costEstimateRepository: Repository<CostEstimate>,
  ) {}

  async create(
    companyId: string,
    data: Partial<Pricing>,
  ): Promise<Pricing> {
    const pricingNumber = await this.generatePricingNumber(companyId);

    const pricing = this.pricingRepository.create({
      ...data,
      companyId,
      pricingNumber,
    });

    if (data.costEstimateId) {
      await this.applyMarkupsFromEstimate(pricing, data.costEstimateId);
    }

    return this.pricingRepository.save(pricing);
  }

  async findAll(
    companyId: string,
    filters?: {
      status?: PricingStatus;
      customerId?: string;
      fromDate?: string;
      toDate?: string;
    },
  ): Promise<Pricing[]> {
    const query = this.pricingRepository
      .createQueryBuilder('pricing')
      .leftJoinAndSelect('pricing.costEstimate', 'costEstimate')
      .where('pricing.companyId = :companyId', { companyId })
      .orderBy('pricing.createdAt', 'DESC');

    if (filters?.status) {
      query.andWhere('pricing.status = :status', { status: filters.status });
    }
    if (filters?.customerId) {
      query.andWhere('pricing.customerId = :customerId', {
        customerId: filters.customerId,
      });
    }
    if (filters?.fromDate) {
      query.andWhere('pricing.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }
    if (filters?.toDate) {
      query.andWhere('pricing.createdAt <= :toDate', {
        toDate: filters.toDate,
      });
    }

    return query.getMany();
  }

  async findOne(companyId: string, id: string): Promise<Pricing> {
    const pricing = await this.pricingRepository.findOne({
      where: { id, companyId },
      relations: ['costEstimate'],
    });
    if (!pricing) {
      throw new NotFoundException(`Pricing with ID ${id} not found`);
    }
    return pricing;
  }

  async update(
    companyId: string,
    id: string,
    data: Partial<Pricing>,
  ): Promise<Pricing> {
    const pricing = await this.findOne(companyId, id);
    Object.assign(pricing, data);
    await this.calculateTotals(pricing);
    return this.pricingRepository.save(pricing);
  }

  async delete(companyId: string, id: string): Promise<void> {
    const pricing = await this.findOne(companyId, id);
    await this.pricingRepository.remove(pricing);
  }

  async approve(
    companyId: string,
    id: string,
    approvedBy: string,
    notes?: string,
  ): Promise<Pricing> {
    const pricing = await this.findOne(companyId, id);
    pricing.status = PricingStatus.APPROVED;
    pricing.approvedBy = approvedBy;
    pricing.approvedAt = new Date();
    if (notes !== undefined) pricing.approvalNotes = notes;
    return this.pricingRepository.save(pricing);
  }

  async reject(
    companyId: string,
    id: string,
    notes?: string,
  ): Promise<Pricing> {
    const pricing = await this.findOne(companyId, id);
    pricing.status = PricingStatus.REJECTED;
    if (notes !== undefined) pricing.approvalNotes = notes;
    return this.pricingRepository.save(pricing);
  }

  async sendToCustomer(companyId: string, id: string): Promise<Pricing> {
    const pricing = await this.findOne(companyId, id);
    pricing.status = PricingStatus.SENT_TO_CUSTOMER;
    pricing.sentToCustomerAt = new Date();
    return this.pricingRepository.save(pricing);
  }

  async recordCustomerResponse(
    companyId: string,
    id: string,
    accepted: boolean,
    feedback?: string,
  ): Promise<Pricing> {
    const pricing = await this.findOne(companyId, id);
    pricing.status = accepted ? PricingStatus.ACCEPTED : PricingStatus.DECLINED;
    pricing.customerResponseAt = new Date();
    if (feedback !== undefined) pricing.customerFeedback = feedback;
    return this.pricingRepository.save(pricing);
  }

  async getMarginAnalysis(companyId: string, id: string): Promise<{
    baseCost: number;
    markupAmount: number;
    discountAmount: number;
    taxAmount: number;
    totalPrice: number;
    grossMargin: number;
    grossMarginPercentage: number;
    netMargin: number;
    netMarginPercentage: number;
    breakEvenPrice: number;
  }> {
    const pricing = await this.findOne(companyId, id);

    const baseCost = Number(pricing.baseCost);
    const markupAmount = Number(pricing.markupAmount);
    const discountAmount = Number(pricing.discountAmount);
    const taxAmount = Number(pricing.taxAmount);
    const totalPrice = Number(pricing.totalPrice);

    const grossMargin = markupAmount - discountAmount;
    const grossMarginPercentage = baseCost > 0 ? (grossMargin / baseCost) * 100 : 0;
    const netMargin = totalPrice - baseCost - taxAmount;
    const netMarginPercentage = baseCost > 0 ? (netMargin / baseCost) * 100 : 0;
    const breakEvenPrice = baseCost;

    return {
      baseCost,
      markupAmount,
      discountAmount,
      taxAmount,
      totalPrice,
      grossMargin,
      grossMarginPercentage,
      netMargin,
      netMarginPercentage,
      breakEvenPrice,
    };
  }

  // Markup Rules
  async createMarkupRule(
    companyId: string,
    data: Partial<MarkupRule>,
  ): Promise<MarkupRule> {
    const rule = this.markupRuleRepository.create({
      ...data,
      companyId,
    });
    return this.markupRuleRepository.save(rule);
  }

  async findAllMarkupRules(companyId: string): Promise<MarkupRule[]> {
    return this.markupRuleRepository.find({
      where: { companyId },
      order: { priority: 'ASC', createdAt: 'DESC' },
    });
  }

  async findActiveMarkupRules(companyId: string): Promise<MarkupRule[]> {
    const today = new Date();
    return this.markupRuleRepository
      .createQueryBuilder('rule')
      .where('rule.companyId = :companyId', { companyId })
      .andWhere('rule.isActive = :isActive', { isActive: true })
      .andWhere(
        '(rule.effectiveFrom IS NULL OR rule.effectiveFrom <= :today)',
        { today },
      )
      .andWhere(
        '(rule.effectiveUntil IS NULL OR rule.effectiveUntil >= :today)',
        { today },
      )
      .orderBy('rule.priority', 'ASC')
      .getMany();
  }

  async updateMarkupRule(
    companyId: string,
    id: string,
    data: Partial<MarkupRule>,
  ): Promise<MarkupRule> {
    const rule = await this.markupRuleRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException(`Markup Rule with ID ${id} not found`);
    }
    Object.assign(rule, data);
    return this.markupRuleRepository.save(rule);
  }

  async deleteMarkupRule(companyId: string, id: string): Promise<void> {
    const rule = await this.markupRuleRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException(`Markup Rule with ID ${id} not found`);
    }
    await this.markupRuleRepository.remove(rule);
  }

  async applyMarkupRules(
    companyId: string,
    pricingId: string,
  ): Promise<Pricing> {
    const pricing = await this.findOne(companyId, pricingId);
    const rules = await this.findActiveMarkupRules(companyId);

    if (!pricing.costEstimateId) {
      return pricing;
    }

    const estimate = await this.costEstimateRepository.findOne({
      where: { id: pricing.costEstimateId },
    });

    if (!estimate) {
      return pricing;
    }

    const markupBreakdown: Pricing['markupBreakdown'] = [];
    let totalMarkup = 0;

    const costs = {
      Material: Number(estimate.materialCost),
      Labor: Number(estimate.laborCost),
      Equipment: Number(estimate.equipmentCost),
      Overhead: Number(estimate.overheadCost),
      Subcontractor: Number(estimate.subcontractorCost),
    };

    for (const rule of rules) {
      const applyTo = rule.applyTo as keyof typeof costs | 'All';
      if (applyTo === 'All') {
        const totalCost = Object.values(costs).reduce((sum, c) => sum + c, 0);
        const markup = totalCost * (Number(rule.markupPercentage) / 100);
        totalMarkup += markup;
        markupBreakdown.push({
          categoryId: rule.id,
          categoryName: rule.name,
          percentage: Number(rule.markupPercentage),
          amount: markup,
          applyTo: 'All Costs',
        });
      } else if (costs[applyTo] !== undefined) {
        const markup = costs[applyTo] * (Number(rule.markupPercentage) / 100);
        totalMarkup += markup;
        markupBreakdown.push({
          categoryId: rule.id,
          categoryName: rule.name,
          percentage: Number(rule.markupPercentage),
          amount: markup,
          applyTo: rule.applyTo,
        });
      }
    }

    pricing.markupBreakdown = markupBreakdown;
    pricing.markupAmount = totalMarkup;
    pricing.markupPercentage =
      pricing.baseCost > 0 ? (totalMarkup / Number(pricing.baseCost)) * 100 : 0;

    await this.calculateTotals(pricing);
    return this.pricingRepository.save(pricing);
  }

  async getCompetitivePricingAnalysis(companyId: string, id: string): Promise<{
    pricing: Pricing;
    marketPosition: string;
    priceComparison: {
      competitor: string;
      price: number;
      difference: number;
      differencePercentage: number;
    }[];
    recommendation: string;
  }> {
    const pricing = await this.findOne(companyId, id);
    const ourPrice = Number(pricing.totalPrice);
    const competitors = pricing.competitorPricing || [];

    const priceComparison = competitors.map((c) => ({
      competitor: c.competitorName,
      price: c.estimatedPrice,
      difference: ourPrice - c.estimatedPrice,
      differencePercentage:
        c.estimatedPrice > 0
          ? ((ourPrice - c.estimatedPrice) / c.estimatedPrice) * 100
          : 0,
    }));

    const avgCompetitorPrice =
      competitors.length > 0
        ? competitors.reduce((sum, c) => sum + c.estimatedPrice, 0) /
          competitors.length
        : ourPrice;

    let marketPosition = 'On Par';
    let recommendation = 'Current pricing is competitive.';

    if (ourPrice > avgCompetitorPrice * 1.1) {
      marketPosition = 'Premium';
      recommendation =
        'Consider highlighting unique value propositions to justify premium pricing.';
    } else if (ourPrice < avgCompetitorPrice * 0.9) {
      marketPosition = 'Budget';
      recommendation =
        'Consider if margins are sustainable or if price increase is viable.';
    }

    return {
      pricing,
      marketPosition,
      priceComparison,
      recommendation,
    };
  }

  private async applyMarkupsFromEstimate(
    pricing: Pricing,
    costEstimateId: string,
  ): Promise<void> {
    const estimate = await this.costEstimateRepository.findOne({
      where: { id: costEstimateId },
    });

    if (estimate) {
      pricing.baseCost = Number(estimate.totalCost);
      pricing.currency = estimate.currency;
    }
  }

  private async calculateTotals(pricing: Pricing): Promise<void> {
    const baseCost = Number(pricing.baseCost) || 0;
    const markupAmount = Number(pricing.markupAmount) || 0;
    const discountAmount = Number(pricing.discountAmount) || 0;

    const subtotal = baseCost + markupAmount - discountAmount;
    const taxAmount = subtotal * (Number(pricing.taxPercentage) / 100);

    pricing.subtotal = subtotal;
    pricing.taxAmount = taxAmount;
    pricing.totalPrice = subtotal + taxAmount;

    pricing.actualMarginAmount = markupAmount - discountAmount;
    pricing.actualMarginPercentage =
      baseCost > 0 ? (pricing.actualMarginAmount / baseCost) * 100 : 0;
  }

  private async generatePricingNumber(companyId: string): Promise<string> {
    const count = await this.pricingRepository.count({ where: { companyId } });
    const year = new Date().getFullYear();
    return `PRC-${year}-${String(count + 1).padStart(5, '0')}`;
  }
}
