import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductivityMetric, MetricType } from '../entities/productivity-metric.entity';

@Injectable()
export class ProductivityMetricService {
  constructor(
    @InjectRepository(ProductivityMetric)
    private readonly productivityMetricRepository: Repository<ProductivityMetric>,
  ) {}

  async create(createDto: Partial<ProductivityMetric>): Promise<ProductivityMetric> {
    const metric = this.productivityMetricRepository.create(createDto);
    return this.productivityMetricRepository.save(metric);
  }

  async findAll(filters?: {
    companyId?: string;
    metricType?: MetricType;
    workCenterId?: string;
  }): Promise<ProductivityMetric[]> {
    const query = this.productivityMetricRepository.createQueryBuilder('metric');

    if (filters?.companyId) {
      query.andWhere('metric.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.metricType) {
      query.andWhere('metric.metricType = :metricType', { metricType: filters.metricType });
    }

    if (filters?.workCenterId) {
      query.andWhere('metric.workCenterId = :workCenterId', { workCenterId: filters.workCenterId });
    }

    query.orderBy('metric.metricDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ProductivityMetric> {
    const metric = await this.productivityMetricRepository.findOne({ where: { id } });
    if (!metric) {
      throw new NotFoundException(`Productivity Metric with ID ${id} not found`);
    }
    return metric;
  }

  async update(id: string, updateDto: Partial<ProductivityMetric>): Promise<ProductivityMetric> {
    const metric = await this.findOne(id);
    Object.assign(metric, updateDto);
    return this.productivityMetricRepository.save(metric);
  }

  async remove(id: string): Promise<void> {
    const metric = await this.findOne(id);
    await this.productivityMetricRepository.remove(metric);
  }

  async getProductivityTrend(workCenterId: string, metricType: MetricType, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const metrics = await this.productivityMetricRepository
      .createQueryBuilder('metric')
      .where('metric.workCenterId = :workCenterId', { workCenterId })
      .andWhere('metric.metricType = :metricType', { metricType })
      .andWhere('metric.metricDate >= :startDate', { startDate })
      .orderBy('metric.metricDate', 'ASC')
      .getMany();

    const avgEfficiency = metrics.length > 0
      ? metrics.reduce((sum, m) => sum + m.efficiencyPercentage, 0) / metrics.length
      : 0;

    return {
      workCenterId,
      metricType,
      periodDays: days,
      dataPoints: metrics.map(m => ({
        date: m.metricDate,
        efficiency: m.efficiencyPercentage,
        actualOutput: m.actualOutput,
        plannedOutput: m.plannedOutput,
      })),
      averageEfficiency: avgEfficiency,
    };
  }

  async getSummaryByType(companyId: string): Promise<any> {
    const metrics = await this.findAll({ companyId });

    const summary: Record<string, { count: number; avgEfficiency: number }> = {};

    metrics.forEach(m => {
      if (!summary[m.metricType]) {
        summary[m.metricType] = { count: 0, avgEfficiency: 0 };
      }
      summary[m.metricType].count++;
      summary[m.metricType].avgEfficiency += m.efficiencyPercentage;
    });

    Object.keys(summary).forEach(key => {
      if (summary[key].count > 0) {
        summary[key].avgEfficiency /= summary[key].count;
      }
    });

    return summary;
  }
}
