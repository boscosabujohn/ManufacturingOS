import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ESGScore, ReportingPeriod, ESGCategory } from '../entities/esg-score.entity';

@Injectable()
export class ESGScoreService {
  constructor(
    @InjectRepository(ESGScore)
    private readonly esgScoreRepository: Repository<ESGScore>,
  ) {}

  async create(createDto: Partial<ESGScore>): Promise<ESGScore> {
    const record = this.esgScoreRepository.create(createDto);
    return this.esgScoreRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    reportingPeriod?: ReportingPeriod;
    isPublished?: boolean;
  }): Promise<ESGScore[]> {
    const query = this.esgScoreRepository.createQueryBuilder('esg');

    if (filters?.companyId) {
      query.andWhere('esg.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.reportingPeriod) {
      query.andWhere('esg.reportingPeriod = :reportingPeriod', { reportingPeriod: filters.reportingPeriod });
    }
    if (filters?.isPublished !== undefined) {
      query.andWhere('esg.isPublished = :isPublished', { isPublished: filters.isPublished });
    }

    query.orderBy('esg.periodEndDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ESGScore> {
    const record = await this.esgScoreRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`ESG Score record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<ESGScore>): Promise<ESGScore> {
    const record = await this.findOne(id);
    if (record.isPublished) {
      throw new BadRequestException('Cannot modify published ESG scores');
    }
    Object.assign(record, updateDto);
    return this.esgScoreRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    if (record.isPublished) {
      throw new BadRequestException('Cannot delete published ESG scores');
    }
    await this.esgScoreRepository.remove(record);
  }

  async publish(id: string, approvedBy: string): Promise<ESGScore> {
    const record = await this.findOne(id);
    if (record.isPublished) {
      throw new BadRequestException('ESG Score is already published');
    }
    record.isPublished = true;
    record.publishedAt = new Date();
    record.approvedBy = approvedBy;
    return this.esgScoreRepository.save(record);
  }

  async getLatestScore(companyId: string): Promise<ESGScore | null> {
    return this.esgScoreRepository.findOne({
      where: { companyId, isPublished: true },
      order: { periodEndDate: 'DESC' },
    });
  }

  async getScoreTrend(companyId: string, periods: number = 4): Promise<any> {
    const records = await this.esgScoreRepository.find({
      where: { companyId, isPublished: true },
      order: { periodEndDate: 'DESC' },
      take: periods,
    });

    return records.map(r => ({
      period: `${r.periodStartDate} - ${r.periodEndDate}`,
      overallScore: r.overallScore,
      environmental: r.environmentalScore,
      social: r.socialScore,
      governance: r.governanceScore,
    })).reverse();
  }

  async getKPIPerformance(id: string): Promise<any> {
    const record = await this.findOne(id);
    const kpis = record.kpis || [];

    const onTrack = kpis.filter(k => k.status === 'on_track').length;
    const atRisk = kpis.filter(k => k.status === 'at_risk').length;
    const offTrack = kpis.filter(k => k.status === 'off_track').length;
    const exceeded = kpis.filter(k => k.status === 'exceeded').length;

    const byCategory: Record<ESGCategory, any[]> = {
      environmental: [],
      social: [],
      governance: [],
    };

    kpis.forEach(k => {
      byCategory[k.category].push({
        name: k.name,
        current: k.currentValue,
        target: k.targetValue,
        status: k.status,
        trend: k.trend,
      });
    });

    return {
      summary: { onTrack, atRisk, offTrack, exceeded, total: kpis.length },
      byCategory,
    };
  }
}
