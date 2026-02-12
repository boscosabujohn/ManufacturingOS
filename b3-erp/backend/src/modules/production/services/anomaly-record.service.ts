import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AnomalyRecord, AnomalyStatus, AnomalySeverity, AnomalyType } from '../entities/anomaly-record.entity';

@Injectable()
export class AnomalyRecordService {
  constructor(
    @InjectRepository(AnomalyRecord)
    private readonly anomalyRecordRepository: Repository<AnomalyRecord>,
  ) {}

  async create(createDto: Partial<AnomalyRecord>): Promise<AnomalyRecord> {
    const record = this.anomalyRecordRepository.create(createDto);
    return this.anomalyRecordRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: AnomalyStatus;
    severity?: AnomalySeverity;
    anomalyType?: AnomalyType;
  }): Promise<AnomalyRecord[]> {
    const query = this.anomalyRecordRepository.createQueryBuilder('anomaly');

    if (filters?.companyId) {
      query.andWhere('anomaly.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('anomaly.status = :status', { status: filters.status });
    }

    if (filters?.severity) {
      query.andWhere('anomaly.severity = :severity', { severity: filters.severity });
    }

    if (filters?.anomalyType) {
      query.andWhere('anomaly.anomalyType = :anomalyType', { anomalyType: filters.anomalyType });
    }

    query.orderBy('anomaly.detectedAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<AnomalyRecord> {
    const record = await this.anomalyRecordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Anomaly Record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<AnomalyRecord>): Promise<AnomalyRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.anomalyRecordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.anomalyRecordRepository.remove(record);
  }

  async investigate(id: string, investigatedBy: string, notes: string): Promise<AnomalyRecord> {
    const record = await this.findOne(id);
    record.status = 'investigating';
    record.investigatedBy = investigatedBy;
    record.investigationNotes = notes;
    return this.anomalyRecordRepository.save(record);
  }

  async resolve(id: string, rootCause: string, resolutionAction: string, resolvedBy: string): Promise<AnomalyRecord> {
    const record = await this.findOne(id);
    record.status = 'resolved';
    record.rootCause = rootCause;
    record.resolutionAction = resolutionAction;
    record.resolvedBy = resolvedBy;
    record.resolvedAt = new Date();
    return this.anomalyRecordRepository.save(record);
  }

  async markAsFalsePositive(id: string, notes: string): Promise<AnomalyRecord> {
    const record = await this.findOne(id);
    record.status = 'false_positive';
    record.investigationNotes = notes;
    return this.anomalyRecordRepository.save(record);
  }

  async getAnomalyDashboard(companyId: string): Promise<any> {
    const records = await this.findAll({ companyId });

    const activeAnomalies = records.filter(r => r.status === 'detected' || r.status === 'investigating');
    const bySeverity = {
      critical: records.filter(r => r.severity === 'critical').length,
      high: records.filter(r => r.severity === 'high').length,
      medium: records.filter(r => r.severity === 'medium').length,
      low: records.filter(r => r.severity === 'low').length,
    };

    const byType = {
      statistical: records.filter(r => r.anomalyType === 'statistical').length,
      pattern: records.filter(r => r.anomalyType === 'pattern').length,
      threshold: records.filter(r => r.anomalyType === 'threshold').length,
      contextual: records.filter(r => r.anomalyType === 'contextual').length,
      collective: records.filter(r => r.anomalyType === 'collective').length,
    };

    return {
      totalAnomalies: records.length,
      activeAnomalies: activeAnomalies.length,
      severityDistribution: bySeverity,
      typeDistribution: byType,
      recentAnomalies: activeAnomalies.slice(0, 10),
    };
  }
}
