import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import {
  QuestionnaireResponse,
  RecommendationEvent,
  RecommendationRule,
  SalesPlaybook,
  SalesQuestionnaire,
} from '../entities/guided-selling.entity';

@Injectable()
export class GuidedSellingService {
  constructor(
    @InjectRepository(SalesPlaybook)
    private playbookRepository: Repository<SalesPlaybook>,
    @InjectRepository(RecommendationRule)
    private recommendationRepository: Repository<RecommendationRule>,
    @InjectRepository(SalesQuestionnaire)
    private questionnaireRepository: Repository<SalesQuestionnaire>,
    @InjectRepository(QuestionnaireResponse)
    private responseRepository: Repository<QuestionnaireResponse>,
    @InjectRepository(RecommendationEvent)
    private eventRepository: Repository<RecommendationEvent>,
  ) {}

  // Sales Playbooks
  async createPlaybook(
    companyId: string,
    data: Partial<SalesPlaybook>,
  ): Promise<SalesPlaybook> {
    const playbook = this.playbookRepository.create({
      ...data,
      companyId,
    });
    return this.playbookRepository.save(playbook);
  }

  async findAllPlaybooks(
    companyId: string,
    filters?: {
      industry?: string;
      customerSegment?: string;
      isActive?: boolean;
    },
  ): Promise<SalesPlaybook[]> {
    const query = this.playbookRepository
      .createQueryBuilder('playbook')
      .where('playbook.companyId = :companyId', { companyId })
      .orderBy('playbook.name', 'ASC');

    if (filters?.industry) {
      query.andWhere('playbook.industry = :industry', { industry: filters.industry });
    }
    if (filters?.customerSegment) {
      query.andWhere('playbook.customerSegment = :customerSegment', {
        customerSegment: filters.customerSegment,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('playbook.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async findPlaybookById(companyId: string, id: string): Promise<SalesPlaybook> {
    const playbook = await this.playbookRepository.findOne({
      where: { id, companyId },
    });
    if (!playbook) {
      throw new NotFoundException(`Playbook with ID ${id} not found`);
    }
    return playbook;
  }

  async updatePlaybook(
    companyId: string,
    id: string,
    data: Partial<SalesPlaybook>,
  ): Promise<SalesPlaybook> {
    const playbook = await this.findPlaybookById(companyId, id);
    Object.assign(playbook, data);
    return this.playbookRepository.save(playbook);
  }

  async deletePlaybook(companyId: string, id: string): Promise<void> {
    const playbook = await this.findPlaybookById(companyId, id);
    await this.playbookRepository.remove(playbook);
  }

  async recordPlaybookUsage(companyId: string, id: string): Promise<void> {
    await this.playbookRepository.update(
      { id, companyId },
      { usageCount: () => 'usageCount + 1' },
    );
  }

  // Recommendation Rules
  async createRecommendationRule(
    companyId: string,
    data: Partial<RecommendationRule>,
  ): Promise<RecommendationRule> {
    const rule = this.recommendationRepository.create({
      ...data,
      companyId,
    });
    return this.recommendationRepository.save(rule);
  }

  async findAllRecommendationRules(
    companyId: string,
    filters?: {
      recommendationType?: string;
      sourceProductId?: string;
      isActive?: boolean;
    },
  ): Promise<RecommendationRule[]> {
    const query = this.recommendationRepository
      .createQueryBuilder('rule')
      .where('rule.companyId = :companyId', { companyId })
      .orderBy('rule.priority', 'ASC');

    if (filters?.recommendationType) {
      query.andWhere('rule.recommendationType = :recommendationType', {
        recommendationType: filters.recommendationType,
      });
    }
    if (filters?.sourceProductId) {
      query.andWhere('rule.sourceProductId = :sourceProductId', {
        sourceProductId: filters.sourceProductId,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('rule.isActive = :isActive', { isActive: filters.isActive });
    }

    return query.getMany();
  }

  async getProductRecommendations(
    companyId: string,
    productId: string,
    recommendationType?: 'cross_sell' | 'up_sell',
  ): Promise<{
    productId: string;
    productName: string;
    reason: string;
    priority: number;
    discountOffer?: number;
  }[]> {
    const query = this.recommendationRepository
      .createQueryBuilder('rule')
      .where('rule.companyId = :companyId', { companyId })
      .andWhere('rule.isActive = :isActive', { isActive: true })
      .andWhere('rule.sourceProductId = :productId', { productId })
      .orderBy('rule.priority', 'ASC');

    if (recommendationType) {
      query.andWhere('rule.recommendationType = :recommendationType', {
        recommendationType,
      });
    }

    const rules = await query.getMany();
    const recommendations: {
      productId: string;
      productName: string;
      reason: string;
      priority: number;
      discountOffer?: number;
    }[] = [];

    for (const rule of rules) {
      recommendations.push(...rule.recommendedProducts);
    }

    return recommendations.sort((a, b) => a.priority - b.priority);
  }

  async updateRecommendationRule(
    companyId: string,
    id: string,
    data: Partial<RecommendationRule>,
  ): Promise<RecommendationRule> {
    const rule = await this.recommendationRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException(`Recommendation Rule with ID ${id} not found`);
    }
    Object.assign(rule, data);
    return this.recommendationRepository.save(rule);
  }

  async deleteRecommendationRule(companyId: string, id: string): Promise<void> {
    const rule = await this.recommendationRepository.findOne({
      where: { id, companyId },
    });
    if (!rule) {
      throw new NotFoundException(`Recommendation Rule with ID ${id} not found`);
    }
    await this.recommendationRepository.remove(rule);
  }

  // Sales Questionnaires
  async createQuestionnaire(
    companyId: string,
    data: Partial<SalesQuestionnaire>,
  ): Promise<SalesQuestionnaire> {
    const questionnaire = this.questionnaireRepository.create({
      ...data,
      companyId,
    });
    return this.questionnaireRepository.save(questionnaire);
  }

  async findAllQuestionnaires(
    companyId: string,
    filters?: {
      industry?: string;
      productCategory?: string;
      isActive?: boolean;
    },
  ): Promise<SalesQuestionnaire[]> {
    const query = this.questionnaireRepository
      .createQueryBuilder('questionnaire')
      .where('questionnaire.companyId = :companyId', { companyId })
      .orderBy('questionnaire.name', 'ASC');

    if (filters?.industry) {
      query.andWhere('questionnaire.industry = :industry', {
        industry: filters.industry,
      });
    }
    if (filters?.productCategory) {
      query.andWhere('questionnaire.productCategory = :productCategory', {
        productCategory: filters.productCategory,
      });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('questionnaire.isActive = :isActive', {
        isActive: filters.isActive,
      });
    }

    return query.getMany();
  }

  async findQuestionnaireById(
    companyId: string,
    id: string,
  ): Promise<SalesQuestionnaire> {
    const questionnaire = await this.questionnaireRepository.findOne({
      where: { id, companyId },
    });
    if (!questionnaire) {
      throw new NotFoundException(`Questionnaire with ID ${id} not found`);
    }
    return questionnaire;
  }

  async updateQuestionnaire(
    companyId: string,
    id: string,
    data: Partial<SalesQuestionnaire>,
  ): Promise<SalesQuestionnaire> {
    const questionnaire = await this.findQuestionnaireById(companyId, id);
    Object.assign(questionnaire, data);
    return this.questionnaireRepository.save(questionnaire);
  }

  async deleteQuestionnaire(companyId: string, id: string): Promise<void> {
    const questionnaire = await this.findQuestionnaireById(companyId, id);
    await this.questionnaireRepository.remove(questionnaire);
  }

  // Questionnaire Responses
  async submitQuestionnaireResponse(
    companyId: string,
    data: Partial<QuestionnaireResponse>,
  ): Promise<QuestionnaireResponse> {
    const questionnaire = await this.findQuestionnaireById(
      companyId,
      data.questionnaireId!,
    );

    // Calculate score if scoring rules exist
    let totalScore = 0;
    if (questionnaire.scoringRules && data.responses) {
      for (const response of data.responses) {
        const question = questionnaire.questions.find(
          (q) => q.questionId === response.questionId,
        );
        if (question?.options) {
          const selectedOption = question.options.find(
            (o) => o.value === response.answer,
          );
          if (selectedOption?.score) {
            totalScore += selectedOption.score;
          }
        }
      }
    }

    // Determine recommended products based on outcome mapping
    let recommendedProducts: {
      productId: string;
      productName: string;
      confidenceScore: number;
    }[] = [];
    let recommendedBundles: { bundleId: string; bundleName: string }[] = [];

    if (questionnaire.outcomeMapping && data.responses) {
      for (const mapping of questionnaire.outcomeMapping) {
        const matches = mapping.conditions.every((cond) => {
          const response = data.responses?.find(
            (r) => r.questionId === cond.questionId,
          );
          return response && response.answer === cond.value;
        });

        if (matches) {
          recommendedProducts = mapping.recommendedProducts.map((pid) => ({
            productId: pid,
            productName: '', // Would need product lookup
            confidenceScore: 0.8,
          }));
          recommendedBundles = mapping.recommendedBundles.map((bid) => ({
            bundleId: bid,
            bundleName: '', // Would need bundle lookup
          }));
          break;
        }
      }
    }

    const responseEntity = this.responseRepository.create({
      ...data,
      companyId,
      totalScore,
      recommendedProducts,
      recommendedBundles,
    });

    const savedResponse = await this.responseRepository.save(responseEntity);

    // Update questionnaire completion count
    await this.questionnaireRepository.update(
      { id: data.questionnaireId },
      { completionCount: () => 'completionCount + 1' },
    );

    return savedResponse;
  }

  async findQuestionnaireResponses(
    companyId: string,
    questionnaireId: string,
  ): Promise<QuestionnaireResponse[]> {
    return this.responseRepository.find({
      where: { companyId, questionnaireId },
      order: { createdAt: 'DESC' },
    });
  }

  async findResponseById(
    companyId: string,
    id: string,
  ): Promise<QuestionnaireResponse> {
    const response = await this.responseRepository.findOne({
      where: { id, companyId },
    });
    if (!response) {
      throw new NotFoundException(`Response with ID ${id} not found`);
    }
    return response;
  }

  // Recommendation Events (Cross-sell/Up-sell Tracking)
  async recordRecommendationEvent(
    companyId: string,
    data: Partial<RecommendationEvent>,
  ): Promise<RecommendationEvent> {
    const event = this.eventRepository.create({
      ...data,
      companyId,
    });

    // Update rule metrics
    if (data.recommendationRuleId) {
      const updateField =
        data.eventType === 'impression'
          ? 'impressionCount'
          : data.eventType === 'click'
            ? 'clickCount'
            : data.eventType === 'purchase'
              ? 'conversionCount'
              : null;

      if (updateField) {
        await this.recommendationRepository.update(
          { id: data.recommendationRuleId },
          { [updateField]: () => `${updateField} + 1` },
        );
      }
    }

    return this.eventRepository.save(event);
  }

  async getRecommendationMetrics(
    companyId: string,
    filters?: {
      recommendationType?: 'cross_sell' | 'up_sell';
      fromDate?: Date;
      toDate?: Date;
    },
  ): Promise<{
    totalImpressions: number;
    totalClicks: number;
    totalConversions: number;
    clickThroughRate: number;
    conversionRate: number;
    totalRevenue: number;
  }> {
    const query = this.eventRepository
      .createQueryBuilder('event')
      .where('event.companyId = :companyId', { companyId });

    if (filters?.recommendationType) {
      query.andWhere('event.recommendationType = :recommendationType', {
        recommendationType: filters.recommendationType,
      });
    }
    if (filters?.fromDate) {
      query.andWhere('event.createdAt >= :fromDate', {
        fromDate: filters.fromDate,
      });
    }
    if (filters?.toDate) {
      query.andWhere('event.createdAt <= :toDate', { toDate: filters.toDate });
    }

    const events = await query.getMany();

    const impressions = events.filter((e) => e.eventType === 'impression').length;
    const clicks = events.filter((e) => e.eventType === 'click').length;
    const conversions = events.filter((e) => e.eventType === 'purchase').length;
    const totalRevenue = events
      .filter((e) => e.eventType === 'purchase')
      .reduce((sum, e) => sum + Number(e.revenueGenerated || 0), 0);

    return {
      totalImpressions: impressions,
      totalClicks: clicks,
      totalConversions: conversions,
      clickThroughRate: impressions > 0 ? (clicks / impressions) * 100 : 0,
      conversionRate: clicks > 0 ? (conversions / clicks) * 100 : 0,
      totalRevenue,
    };
  }
}
