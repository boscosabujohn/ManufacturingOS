import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WaterUsage, WaterSource, WaterUseType } from '../entities/water-usage.entity';

@Injectable()
export class WaterUsageService {
  constructor(
    @InjectRepository(WaterUsage)
    private readonly waterUsageRepository: Repository<WaterUsage>,
  ) {}

  async create(createDto: Partial<WaterUsage>): Promise<WaterUsage> {
    const record = this.waterUsageRepository.create(createDto);
    return this.waterUsageRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    waterSource?: WaterSource;
    useType?: WaterUseType;
    zoneId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<WaterUsage[]> {
    const query = this.waterUsageRepository.createQueryBuilder('water');

    if (filters?.companyId) {
      query.andWhere('water.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.waterSource) {
      query.andWhere('water.waterSource = :waterSource', { waterSource: filters.waterSource });
    }
    if (filters?.useType) {
      query.andWhere('water.useType = :useType', { useType: filters.useType });
    }
    if (filters?.zoneId) {
      query.andWhere('water.zoneId = :zoneId', { zoneId: filters.zoneId });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('water.recordDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('water.recordDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<WaterUsage> {
    const record = await this.waterUsageRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Water Usage record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<WaterUsage>): Promise<WaterUsage> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.waterUsageRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.waterUsageRepository.remove(record);
  }

  async getUsageSummary(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    const records = await this.findAll({ companyId, startDate, endDate });

    const totalConsumption = records.reduce((sum, r) => sum + Number(r.consumptionAmount), 0);
    const totalRecycled = records.reduce((sum, r) => sum + Number(r.recycledAmount || 0), 0);
    const totalCost = records.reduce((sum, r) => sum + Number(r.cost || 0), 0);

    const bySource: Record<string, number> = {};
    const byUseType: Record<string, number> = {};

    records.forEach(r => {
      bySource[r.waterSource] = (bySource[r.waterSource] || 0) + Number(r.consumptionAmount);
      byUseType[r.useType] = (byUseType[r.useType] || 0) + Number(r.consumptionAmount);
    });

    return {
      period: { startDate, endDate },
      totalConsumption,
      totalRecycled,
      recyclingRate: totalConsumption > 0 ? (totalRecycled / totalConsumption) * 100 : 0,
      totalCost,
      bySource,
      byUseType,
    };
  }

  async getLeakDetectionStatus(companyId: string): Promise<any> {
    const records = await this.findAll({ companyId });

    const activeLeaks = records
      .filter(r => r.leakDetection && r.leakDetection.length > 0)
      .flatMap(r => r.leakDetection || [])
      .filter(l => l.detected && l.status !== 'resolved');

    const totalEstimatedLoss = activeLeaks.reduce((sum, l) => sum + (l.estimatedLoss || 0), 0);

    return {
      activeLeakCount: activeLeaks.length,
      totalEstimatedLoss,
      leaksByStatus: {
        identified: activeLeaks.filter(l => l.status === 'identified').length,
        inRepair: activeLeaks.filter(l => l.status === 'in_repair').length,
      },
      leakLocations: activeLeaks.map(l => l.location),
    };
  }
}
