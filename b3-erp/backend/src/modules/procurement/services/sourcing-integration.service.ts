import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, LessThanOrEqual, MoreThanOrEqual } from 'typeorm';
import {
  SourcingRule,
  SourcingRuleType,
  SourcingRuleStatus,
  SourcingTrigger,
} from '../entities/sourcing-rule.entity';

export interface CreateSourcingRuleDto {
  companyId: string;
  ruleCode: string;
  ruleName: string;
  description?: string;
  ruleType: SourcingRuleType;
  priority?: number;
  triggerType: SourcingTrigger;
  triggerConditions: {
    minAmount?: number;
    maxAmount?: number;
    itemCategories?: string[];
    itemCodes?: string[];
    vendorCategories?: string[];
    vendorIds?: string[];
    departments?: string[];
    criticalityLevels?: string[];
    minLeadTime?: number;
    maxLeadTime?: number;
  };
  actions: {
    minVendors?: number;
    maxVendors?: number;
    preferredVendorIds?: string[];
    excludedVendorIds?: string[];
    requireApproval?: boolean;
    approvalLevels?: number;
    allowNegotiation?: boolean;
    requireTechnicalEvaluation?: boolean;
    requireCommercialEvaluation?: boolean;
    minQuotationsRequired?: number;
    evaluationCriteria?: {
      criterion: string;
      weightage: number;
    }[];
    autoAwardThreshold?: number;
    requireJustificationAbove?: number;
  };
  vendorCriteria?: {
    minRating?: number;
    maxActiveContracts?: number;
    requiredCertifications?: string[];
    requiredCapabilities?: string[];
    geographicRestrictions?: string[];
    minExperience?: number;
    financialStability?: string;
  };
  timeConstraints?: {
    minRfqDuration?: number;
    maxRfqDuration?: number;
    defaultRfqDuration?: number;
    reminderBeforeDays?: number;
    autoCloseAfterDays?: number;
  };
  complianceRequirements?: {
    requireDocumentation?: boolean;
    requiredDocuments?: string[];
    requireAuditTrail?: boolean;
    requireApprovalJustification?: boolean;
    maxSingleSourceAmount?: number;
    competitiveBiddingThreshold?: number;
  };
  effectiveFrom: Date;
  effectiveTo?: Date;
  createdBy: string;
}

export interface SourcingContext {
  companyId: string;
  amount: number;
  itemCategories?: string[];
  itemCodes?: string[];
  vendorCategory?: string;
  department?: string;
  criticality?: string;
  requiredLeadTime?: number;
}

export interface SourcingRecommendation {
  rule: SourcingRule;
  ruleType: SourcingRuleType;
  minVendors: number;
  maxVendors: number;
  preferredVendors: string[];
  excludedVendors: string[];
  requireApproval: boolean;
  approvalLevels: number;
  minQuotationsRequired: number;
  evaluationCriteria: { criterion: string; weightage: number }[];
  timeConstraints: {
    minDuration: number;
    maxDuration: number;
    defaultDuration: number;
  };
  complianceNotes: string[];
}

@Injectable()
export class SourcingIntegrationService {
  constructor(
    @InjectRepository(SourcingRule)
    private readonly ruleRepo: Repository<SourcingRule>,
  ) {}

  async createRule(dto: CreateSourcingRuleDto): Promise<SourcingRule> {
    const rule = this.ruleRepo.create({
      ...dto,
      status: SourcingRuleStatus.ACTIVE,
      priority: dto.priority || 100,
    });

    return this.ruleRepo.save(rule);
  }

  async updateRule(id: string, dto: Partial<CreateSourcingRuleDto>): Promise<SourcingRule> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Sourcing rule not found');
    }

    Object.assign(rule, dto);
    return this.ruleRepo.save(rule);
  }

  async activateRule(id: string, approvedBy: string): Promise<SourcingRule> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Sourcing rule not found');
    }

    rule.status = SourcingRuleStatus.ACTIVE;
    rule.approvedBy = approvedBy;
    rule.approvedAt = new Date();

    return this.ruleRepo.save(rule);
  }

  async deactivateRule(id: string): Promise<SourcingRule> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Sourcing rule not found');
    }

    rule.status = SourcingRuleStatus.INACTIVE;
    return this.ruleRepo.save(rule);
  }

  async getRuleById(id: string): Promise<SourcingRule> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Sourcing rule not found');
    }
    return rule;
  }

  async getRules(companyId: string, status?: SourcingRuleStatus): Promise<SourcingRule[]> {
    const where: any = { companyId };
    if (status) {
      where.status = status;
    }

    return this.ruleRepo.find({
      where,
      order: { priority: 'DESC', createdAt: 'DESC' },
    });
  }

  async getActiveRules(companyId: string): Promise<SourcingRule[]> {
    const today = new Date();

    return this.ruleRepo.find({
      where: {
        companyId,
        status: SourcingRuleStatus.ACTIVE,
        effectiveFrom: LessThanOrEqual(today),
      },
      order: { priority: 'DESC' },
    });
  }

  async getSourcingRecommendation(context: SourcingContext): Promise<SourcingRecommendation | null> {
    const activeRules = await this.getActiveRules(context.companyId);

    // Find matching rules based on priority
    for (const rule of activeRules) {
      if (this.ruleMatchesContext(rule, context)) {
        return this.buildRecommendation(rule);
      }
    }

    return null;
  }

  private ruleMatchesContext(rule: SourcingRule, context: SourcingContext): boolean {
    const { triggerConditions } = rule;

    // Check amount threshold
    if (rule.triggerType === SourcingTrigger.AMOUNT_THRESHOLD) {
      if (triggerConditions.minAmount && context.amount < triggerConditions.minAmount) {
        return false;
      }
      if (triggerConditions.maxAmount && context.amount > triggerConditions.maxAmount) {
        return false;
      }
    }

    // Check item category
    if (rule.triggerType === SourcingTrigger.ITEM_CATEGORY) {
      if (triggerConditions.itemCategories?.length && context.itemCategories?.length) {
        const hasMatch = context.itemCategories.some((cat) =>
          triggerConditions.itemCategories!.includes(cat),
        );
        if (!hasMatch) return false;
      }
    }

    // Check department
    if (rule.triggerType === SourcingTrigger.DEPARTMENT) {
      if (triggerConditions.departments?.length && context.department) {
        if (!triggerConditions.departments.includes(context.department)) {
          return false;
        }
      }
    }

    // Check criticality
    if (rule.triggerType === SourcingTrigger.CRITICALITY) {
      if (triggerConditions.criticalityLevels?.length && context.criticality) {
        if (!triggerConditions.criticalityLevels.includes(context.criticality)) {
          return false;
        }
      }
    }

    // Check lead time
    if (rule.triggerType === SourcingTrigger.LEAD_TIME) {
      if (context.requiredLeadTime) {
        if (triggerConditions.minLeadTime && context.requiredLeadTime < triggerConditions.minLeadTime) {
          return false;
        }
        if (triggerConditions.maxLeadTime && context.requiredLeadTime > triggerConditions.maxLeadTime) {
          return false;
        }
      }
    }

    return true;
  }

  private buildRecommendation(rule: SourcingRule): SourcingRecommendation {
    const complianceNotes: string[] = [];

    // Add compliance notes
    if (rule.complianceRequirements?.requireDocumentation) {
      complianceNotes.push('Documentation required for this purchase');
    }
    if (rule.complianceRequirements?.requireApprovalJustification) {
      complianceNotes.push('Approval justification required');
    }
    if (rule.actions.requireTechnicalEvaluation) {
      complianceNotes.push('Technical evaluation required');
    }
    if (rule.actions.requireCommercialEvaluation) {
      complianceNotes.push('Commercial evaluation required');
    }

    return {
      rule,
      ruleType: rule.ruleType,
      minVendors: rule.actions.minVendors || 1,
      maxVendors: rule.actions.maxVendors || 10,
      preferredVendors: rule.actions.preferredVendorIds || [],
      excludedVendors: rule.actions.excludedVendorIds || [],
      requireApproval: rule.actions.requireApproval || false,
      approvalLevels: rule.actions.approvalLevels || 1,
      minQuotationsRequired: rule.actions.minQuotationsRequired || 1,
      evaluationCriteria: rule.actions.evaluationCriteria || [
        { criterion: 'Price', weightage: 40 },
        { criterion: 'Quality', weightage: 30 },
        { criterion: 'Delivery', weightage: 20 },
        { criterion: 'Service', weightage: 10 },
      ],
      timeConstraints: {
        minDuration: rule.timeConstraints?.minRfqDuration || 3,
        maxDuration: rule.timeConstraints?.maxRfqDuration || 30,
        defaultDuration: rule.timeConstraints?.defaultRfqDuration || 7,
      },
      complianceNotes,
    };
  }

  async validateSourcingDecision(
    companyId: string,
    amount: number,
    vendorCount: number,
    ruleId?: string,
  ): Promise<{
    isValid: boolean;
    violations: string[];
    warnings: string[];
  }> {
    const violations: string[] = [];
    const warnings: string[] = [];

    let rule: SourcingRule | null = null;

    if (ruleId) {
      rule = await this.ruleRepo.findOne({ where: { id: ruleId } });
    } else {
      const recommendation = await this.getSourcingRecommendation({
        companyId,
        amount,
      });
      rule = recommendation?.rule || null;
    }

    if (!rule) {
      warnings.push('No sourcing rule found for this purchase');
      return { isValid: true, violations, warnings };
    }

    // Check minimum vendors
    if (rule.actions.minVendors && vendorCount < rule.actions.minVendors) {
      violations.push(`Minimum ${rule.actions.minVendors} vendors required, but only ${vendorCount} selected`);
    }

    // Check competitive bidding threshold
    if (rule.complianceRequirements?.competitiveBiddingThreshold) {
      if (amount >= rule.complianceRequirements.competitiveBiddingThreshold && vendorCount < 3) {
        violations.push(`Competitive bidding (min 3 vendors) required for amounts above ${rule.complianceRequirements.competitiveBiddingThreshold}`);
      }
    }

    // Check single source restriction
    if (rule.complianceRequirements?.maxSingleSourceAmount) {
      if (amount > rule.complianceRequirements.maxSingleSourceAmount && vendorCount === 1) {
        violations.push(`Single source not allowed for amounts above ${rule.complianceRequirements.maxSingleSourceAmount}`);
      }
    }

    return {
      isValid: violations.length === 0,
      violations,
      warnings,
    };
  }

  async deleteRule(id: string): Promise<void> {
    const rule = await this.ruleRepo.findOne({ where: { id } });
    if (!rule) {
      throw new NotFoundException('Sourcing rule not found');
    }

    await this.ruleRepo.remove(rule);
  }
}
