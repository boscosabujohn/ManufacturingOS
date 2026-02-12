import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EquipmentHealth, HealthStatus } from '../entities/equipment-health.entity';

@Injectable()
export class EquipmentHealthService {
  constructor(
    @InjectRepository(EquipmentHealth)
    private readonly equipmentHealthRepository: Repository<EquipmentHealth>,
  ) {}

  async create(createDto: Partial<EquipmentHealth>): Promise<EquipmentHealth> {
    const record = this.equipmentHealthRepository.create(createDto);
    return this.equipmentHealthRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    equipmentId?: string;
    healthStatus?: HealthStatus;
  }): Promise<EquipmentHealth[]> {
    const query = this.equipmentHealthRepository.createQueryBuilder('health');

    if (filters?.companyId) {
      query.andWhere('health.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.equipmentId) {
      query.andWhere('health.equipmentId = :equipmentId', { equipmentId: filters.equipmentId });
    }

    if (filters?.healthStatus) {
      query.andWhere('health.healthStatus = :healthStatus', { healthStatus: filters.healthStatus });
    }

    query.orderBy('health.assessmentDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<EquipmentHealth> {
    const record = await this.equipmentHealthRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Equipment Health record with ID ${id} not found`);
    }
    return record;
  }

  async getLatestForEquipment(equipmentId: string): Promise<EquipmentHealth | null> {
    return this.equipmentHealthRepository.findOne({
      where: { equipmentId },
      order: { assessmentDate: 'DESC' },
    });
  }

  async update(id: string, updateDto: Partial<EquipmentHealth>): Promise<EquipmentHealth> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.equipmentHealthRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.equipmentHealthRepository.remove(record);
  }

  async getHealthDashboard(companyId: string): Promise<any> {
    const records = await this.findAll({ companyId });

    // Get latest record for each equipment
    const latestByEquipment = new Map<string, EquipmentHealth>();
    records.forEach(r => {
      const existing = latestByEquipment.get(r.equipmentId);
      if (!existing || new Date(r.assessmentDate) > new Date(existing.assessmentDate)) {
        latestByEquipment.set(r.equipmentId, r);
      }
    });

    const latestRecords = Array.from(latestByEquipment.values());

    const statusCounts = {
      excellent: 0,
      good: 0,
      fair: 0,
      poor: 0,
      critical: 0,
    };

    latestRecords.forEach(r => {
      statusCounts[r.healthStatus]++;
    });

    const avgHealthScore = latestRecords.length > 0
      ? latestRecords.reduce((sum, r) => sum + r.healthScore, 0) / latestRecords.length
      : 0;

    const criticalAlerts = latestRecords
      .filter(r => r.healthStatus === 'critical' || r.healthStatus === 'poor')
      .map(r => ({
        equipmentId: r.equipmentId,
        equipmentName: r.equipmentName,
        healthScore: r.healthScore,
        predictedFailures: r.predictedFailures,
      }));

    return {
      totalEquipment: latestRecords.length,
      averageHealthScore: avgHealthScore,
      statusDistribution: statusCounts,
      criticalAlerts,
    };
  }

  async getPredictiveMaintenanceAlerts(companyId: string): Promise<any[]> {
    const records = await this.findAll({ companyId });

    const alerts: any[] = [];

    records.forEach(r => {
      if (r.predictedFailures) {
        r.predictedFailures.forEach(failure => {
          if (failure.probability > 0.5) {
            alerts.push({
              equipmentId: r.equipmentId,
              equipmentName: r.equipmentName,
              component: failure.component,
              failureType: failure.failureType,
              probability: failure.probability,
              estimatedTimeToFailure: failure.estimatedTimeToFailure,
              recommendedAction: failure.recommendedAction,
            });
          }
        });
      }
    });

    return alerts.sort((a, b) => b.probability - a.probability);
  }
}
