import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AIInsight, InsightType, InsightStatus, InsightPriority } from '../entities/ai-insight.entity';

@Injectable()
export class AIInsightService {
  constructor(
    @InjectRepository(AIInsight)
    private readonly aiInsightRepository: Repository<AIInsight>,
  ) {}

  async create(createDto: Partial<AIInsight>): Promise<AIInsight> {
    const insight = this.aiInsightRepository.create(createDto);
    return this.aiInsightRepository.save(insight);
  }

  async findAll(filters?: {
    companyId?: string;
    insightType?: InsightType;
    status?: InsightStatus;
    priority?: InsightPriority;
  }): Promise<AIInsight[]> {
    const query = this.aiInsightRepository.createQueryBuilder('insight');

    if (filters?.companyId) {
      query.andWhere('insight.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.insightType) {
      query.andWhere('insight.insightType = :insightType', { insightType: filters.insightType });
    }

    if (filters?.status) {
      query.andWhere('insight.status = :status', { status: filters.status });
    }

    if (filters?.priority) {
      query.andWhere('insight.priority = :priority', { priority: filters.priority });
    }

    query.orderBy('insight.generatedAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<AIInsight> {
    const insight = await this.aiInsightRepository.findOne({ where: { id } });
    if (!insight) {
      throw new NotFoundException(`AI Insight with ID ${id} not found`);
    }
    return insight;
  }

  async update(id: string, updateDto: Partial<AIInsight>): Promise<AIInsight> {
    const insight = await this.findOne(id);
    Object.assign(insight, updateDto);
    return this.aiInsightRepository.save(insight);
  }

  async remove(id: string): Promise<void> {
    const insight = await this.findOne(id);
    await this.aiInsightRepository.remove(insight);
  }

  async acknowledge(id: string, acknowledgedBy: string): Promise<AIInsight> {
    const insight = await this.findOne(id);
    insight.status = 'acknowledged';
    insight.acknowledgedBy = acknowledgedBy;
    insight.acknowledgedAt = new Date();
    return this.aiInsightRepository.save(insight);
  }

  async actUpon(id: string, actionTaken: string, actionBy: string): Promise<AIInsight> {
    const insight = await this.findOne(id);
    insight.status = 'acted_upon';
    insight.actionTaken = actionTaken;
    insight.actionBy = actionBy;
    insight.actionAt = new Date();
    return this.aiInsightRepository.save(insight);
  }

  async dismiss(id: string): Promise<AIInsight> {
    const insight = await this.findOne(id);
    insight.status = 'dismissed';
    return this.aiInsightRepository.save(insight);
  }

  async submitFeedback(id: string, feedback: any): Promise<AIInsight> {
    const insight = await this.findOne(id);
    insight.feedback = {
      ...feedback,
      submittedAt: new Date().toISOString(),
    };
    return this.aiInsightRepository.save(insight);
  }

  async getDashboard(companyId: string): Promise<any> {
    const insights = await this.findAll({ companyId });

    const newInsights = insights.filter(i => i.status === 'new');
    const byPriority = {
      critical: insights.filter(i => i.priority === 'critical').length,
      high: insights.filter(i => i.priority === 'high').length,
      medium: insights.filter(i => i.priority === 'medium').length,
      low: insights.filter(i => i.priority === 'low').length,
    };
    const byType = {
      anomaly: insights.filter(i => i.insightType === 'anomaly').length,
      prediction: insights.filter(i => i.insightType === 'prediction').length,
      recommendation: insights.filter(i => i.insightType === 'recommendation').length,
      alert: insights.filter(i => i.insightType === 'alert').length,
      trend: insights.filter(i => i.insightType === 'trend').length,
    };

    return {
      totalInsights: insights.length,
      newInsights: newInsights.length,
      priorityDistribution: byPriority,
      typeDistribution: byType,
      recentInsights: newInsights.slice(0, 10),
    };
  }
}
