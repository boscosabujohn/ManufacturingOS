import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapacityFlexibility, CapacityStatus, CapacityResourceType } from '../entities/capacity-flexibility.entity';

@Injectable()
export class CapacityFlexibilityService {
  constructor(
    @InjectRepository(CapacityFlexibility)
    private readonly capacityFlexibilityRepository: Repository<CapacityFlexibility>,
  ) {}

  async create(createDto: Partial<CapacityFlexibility>): Promise<CapacityFlexibility> {
    const record = this.capacityFlexibilityRepository.create(createDto);
    record.utilizationRate = (Number(createDto.currentDemand) / Number(createDto.currentCapacity)) * 100;
    record.status = this.calculateStatus(record.utilizationRate);
    return this.capacityFlexibilityRepository.save(record);
  }

  private calculateStatus(utilizationRate: number): CapacityStatus {
    if (utilizationRate > 100) return 'overloaded';
    if (utilizationRate > 90) return 'strained';
    if (utilizationRate > 70) return 'optimal';
    return 'underutilized';
  }

  async findAll(filters?: {
    companyId?: string;
    resourceType?: CapacityResourceType;
    status?: CapacityStatus;
    recordDate?: Date;
    isActive?: boolean;
  }): Promise<CapacityFlexibility[]> {
    const query = this.capacityFlexibilityRepository.createQueryBuilder('capacity');

    if (filters?.companyId) {
      query.andWhere('capacity.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.resourceType) {
      query.andWhere('capacity.resourceType = :resourceType', { resourceType: filters.resourceType });
    }
    if (filters?.status) {
      query.andWhere('capacity.status = :status', { status: filters.status });
    }
    if (filters?.recordDate) {
      query.andWhere('capacity.recordDate = :recordDate', { recordDate: filters.recordDate });
    }
    if (filters?.isActive !== undefined) {
      query.andWhere('capacity.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('capacity.recordDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<CapacityFlexibility> {
    const record = await this.capacityFlexibilityRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Capacity Flexibility record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<CapacityFlexibility>): Promise<CapacityFlexibility> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    if (updateDto.currentDemand || updateDto.currentCapacity) {
      record.utilizationRate = (Number(record.currentDemand) / Number(record.currentCapacity)) * 100;
      record.status = this.calculateStatus(record.utilizationRate);
    }
    return this.capacityFlexibilityRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.capacityFlexibilityRepository.remove(record);
  }

  async getCapacitySummary(companyId: string, recordDate?: Date): Promise<any> {
    const filters: any = { companyId, isActive: true };
    if (recordDate) {
      filters.recordDate = recordDate;
    }
    const records = await this.findAll(filters);

    const byStatus: Record<CapacityStatus, number> = {
      underutilized: 0, optimal: 0, strained: 0, overloaded: 0,
    };
    const byType: Record<string, { count: number; avgUtilization: number }> = {};

    records.forEach(r => {
      byStatus[r.status]++;
      if (!byType[r.resourceType]) {
        byType[r.resourceType] = { count: 0, avgUtilization: 0 };
      }
      byType[r.resourceType].count++;
      byType[r.resourceType].avgUtilization += Number(r.utilizationRate);
    });

    Object.keys(byType).forEach(key => {
      byType[key].avgUtilization = byType[key].avgUtilization / byType[key].count;
    });

    const totalCapacity = records.reduce((sum, r) => sum + Number(r.currentCapacity), 0);
    const totalDemand = records.reduce((sum, r) => sum + Number(r.currentDemand), 0);
    const totalSurge = records.reduce((sum, r) => sum + Number(r.surgeCapacity || 0), 0);

    return {
      totalResources: records.length,
      byStatus,
      byType,
      overallUtilization: totalCapacity > 0 ? (totalDemand / totalCapacity) * 100 : 0,
      availableSurgeCapacity: totalSurge,
      constrainedResources: records.filter(r => r.status === 'strained' || r.status === 'overloaded').map(r => ({
        id: r.id,
        name: r.resourceName,
        type: r.resourceType,
        utilization: r.utilizationRate,
        status: r.status,
      })),
    };
  }

  async getFlexibilityOptions(id: string): Promise<any> {
    const record = await this.findOne(id);
    const options = record.flexibilityOptions || [];

    const availableOptions = options.filter(o => o.availability === 'available');
    const totalAdditionalCapacity = availableOptions.reduce((sum, o) => sum + o.additionalCapacity, 0);

    return {
      resourceId: record.id,
      resourceName: record.resourceName,
      currentGap: Number(record.currentDemand) - Number(record.currentCapacity),
      options,
      availableOptions: availableOptions.length,
      totalAdditionalCapacity,
      recommendedOption: availableOptions.sort((a, b) =>
        (a.cost / a.additionalCapacity) - (b.cost / b.additionalCapacity)
      )[0] || null,
    };
  }

  async identifyBottlenecks(companyId: string): Promise<any[]> {
    const records = await this.findAll({ companyId, isActive: true });

    const bottlenecks: any[] = [];
    records.forEach(r => {
      (r.bottlenecks || []).forEach(b => {
        if (b.severity !== 'minor') {
          bottlenecks.push({
            resourceId: r.id,
            resourceName: r.resourceName,
            resourceType: r.resourceType,
            ...b,
          });
        }
      });
    });

    return bottlenecks.sort((a, b) => {
      const severityOrder = { severe: 0, moderate: 1, minor: 2 };
      return severityOrder[a.severity as keyof typeof severityOrder] -
             severityOrder[b.severity as keyof typeof severityOrder];
    });
  }
}
