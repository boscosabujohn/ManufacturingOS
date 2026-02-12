import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BusinessContinuity, BCPHealthStatus, ProcessCategory, RecoveryPriority } from '../entities/business-continuity.entity';

@Injectable()
export class BusinessContinuityService {
  constructor(
    @InjectRepository(BusinessContinuity)
    private readonly businessContinuityRepository: Repository<BusinessContinuity>,
  ) {}

  async create(createDto: Partial<BusinessContinuity>): Promise<BusinessContinuity> {
    const record = this.businessContinuityRepository.create(createDto);
    return this.businessContinuityRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    category?: ProcessCategory;
    currentStatus?: BCPHealthStatus;
    priority?: RecoveryPriority;
    isActive?: boolean;
  }): Promise<BusinessContinuity[]> {
    const query = this.businessContinuityRepository.createQueryBuilder('bcp');

    if (filters?.companyId) {
      query.andWhere('bcp.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.category) {
      query.andWhere('bcp.category = :category', { category: filters.category });
    }
    if (filters?.currentStatus) {
      query.andWhere('bcp.currentStatus = :currentStatus', { currentStatus: filters.currentStatus });
    }
    if (filters?.priority) {
      query.andWhere('bcp.priority = :priority', { priority: filters.priority });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('bcp.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('bcp.priority', 'ASC').addOrderBy('bcp.healthScore', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<BusinessContinuity> {
    const record = await this.businessContinuityRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Business Continuity record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<BusinessContinuity>): Promise<BusinessContinuity> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.businessContinuityRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.businessContinuityRepository.remove(record);
  }

  async updateStatus(id: string, status: BCPHealthStatus): Promise<BusinessContinuity> {
    const record = await this.findOne(id);
    record.currentStatus = status;
    record.healthScore = this.calculateHealthScore(status);
    return this.businessContinuityRepository.save(record);
  }

  private calculateHealthScore(status: BCPHealthStatus): number {
    switch (status) {
      case 'healthy': return 100;
      case 'warning': return 70;
      case 'critical': return 40;
      case 'down': return 0;
      default: return 50;
    }
  }

  async recordDrill(id: string, drill: any): Promise<BusinessContinuity> {
    const record = await this.findOne(id);
    if (!record.drillHistory) {
      record.drillHistory = [];
    }
    record.drillHistory.push(drill);
    record.lastDrillDate = drill.drillDate;
    return this.businessContinuityRepository.save(record);
  }

  async recordIncident(id: string, incident: any): Promise<BusinessContinuity> {
    const record = await this.findOne(id);
    if (!record.incidentHistory) {
      record.incidentHistory = [];
    }
    record.incidentHistory.push(incident);
    return this.businessContinuityRepository.save(record);
  }

  async getBCPSummary(companyId: string): Promise<any> {
    const records = await this.findAll({ companyId, isActive: true });

    const byStatus: Record<BCPHealthStatus, number> = {
      healthy: 0, warning: 0, critical: 0, down: 0,
    };
    const byCategory: Record<string, number> = {};
    const byPriority: Record<RecoveryPriority, number> = {
      critical: 0, high: 0, medium: 0, low: 0,
    };

    records.forEach(r => {
      byStatus[r.currentStatus]++;
      byCategory[r.category] = (byCategory[r.category] || 0) + 1;
      byPriority[r.priority]++;
    });

    const avgHealthScore = records.length > 0
      ? records.reduce((sum, r) => sum + Number(r.healthScore), 0) / records.length
      : 0;

    const avgRTO = records.length > 0
      ? records.reduce((sum, r) => sum + Number(r.rto), 0) / records.length
      : 0;

    const totalDrills = records.reduce((sum, r) => sum + (r.drillHistory?.length || 0), 0);

    return {
      totalProcesses: records.length,
      byStatus,
      byCategory,
      byPriority,
      averageHealthScore: avgHealthScore,
      averageRTO: avgRTO,
      totalDrillsYTD: totalDrills,
      criticalProcesses: records.filter(r => r.priority === 'critical').map(r => ({
        id: r.id,
        name: r.processName,
        status: r.currentStatus,
        healthScore: r.healthScore,
        rto: r.rto,
      })),
    };
  }

  async getUpcomingDrills(companyId: string, daysAhead: number = 30): Promise<any[]> {
    const records = await this.findAll({ companyId, isActive: true });
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() + daysAhead);

    return records
      .filter(r => r.nextDrillDate && new Date(r.nextDrillDate) <= cutoffDate)
      .map(r => ({
        processId: r.id,
        processName: r.processName,
        category: r.category,
        priority: r.priority,
        nextDrillDate: r.nextDrillDate,
        planOwner: r.planOwner,
      }))
      .sort((a, b) => new Date(a.nextDrillDate!).getTime() - new Date(b.nextDrillDate!).getTime());
  }

  async getRecoveryPlan(id: string): Promise<any> {
    const record = await this.findOne(id);

    return {
      processId: record.id,
      processName: record.processName,
      category: record.category,
      priority: record.priority,
      rto: record.rto,
      rpo: record.rpo,
      mtpd: record.mtpd,
      recoveryProcedures: record.recoveryProcedures,
      backupSystems: record.backupSystems,
      contactList: record.contactList,
      dependencies: record.dependencies,
    };
  }
}
