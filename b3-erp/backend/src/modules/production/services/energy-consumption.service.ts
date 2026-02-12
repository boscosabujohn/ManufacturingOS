import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { EnergyConsumption, EnergyType } from '../entities/energy-consumption.entity';

@Injectable()
export class EnergyConsumptionService {
  constructor(
    @InjectRepository(EnergyConsumption)
    private readonly energyConsumptionRepository: Repository<EnergyConsumption>,
  ) {}

  async create(createDto: Partial<EnergyConsumption>): Promise<EnergyConsumption> {
    const record = this.energyConsumptionRepository.create(createDto);
    return this.energyConsumptionRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    energyType?: EnergyType;
    zoneId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<EnergyConsumption[]> {
    const query = this.energyConsumptionRepository.createQueryBuilder('energy');

    if (filters?.companyId) {
      query.andWhere('energy.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.energyType) {
      query.andWhere('energy.energyType = :energyType', { energyType: filters.energyType });
    }
    if (filters?.zoneId) {
      query.andWhere('energy.zoneId = :zoneId', { zoneId: filters.zoneId });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('energy.recordDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('energy.recordDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<EnergyConsumption> {
    const record = await this.energyConsumptionRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Energy Consumption record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<EnergyConsumption>): Promise<EnergyConsumption> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.energyConsumptionRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.energyConsumptionRepository.remove(record);
  }

  async getConsumptionSummary(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    const records = await this.findAll({ companyId, startDate, endDate });

    const totalConsumption = records.reduce((sum, r) => sum + Number(r.consumptionAmount), 0);
    const totalCost = records.reduce((sum, r) => sum + Number(r.cost || 0), 0);
    const totalRenewable = records
      .filter(r => ['solar', 'wind', 'other_renewable'].includes(r.energyType))
      .reduce((sum, r) => sum + Number(r.consumptionAmount), 0);

    const byType: Record<string, number> = {};
    records.forEach(r => {
      byType[r.energyType] = (byType[r.energyType] || 0) + Number(r.consumptionAmount);
    });

    return {
      period: { startDate, endDate },
      totalConsumption,
      totalCost,
      renewablePercentage: totalConsumption > 0 ? (totalRenewable / totalConsumption) * 100 : 0,
      byType,
      averageDailyCost: records.length > 0 ? totalCost / records.length : 0,
    };
  }

  async getByZone(companyId: string, recordDate: Date): Promise<any> {
    const records = await this.findAll({ companyId });
    const filtered = records.filter(r =>
      new Date(r.recordDate).toDateString() === new Date(recordDate).toDateString()
    );

    const byZone: Record<string, { consumption: number; cost: number }> = {};
    filtered.forEach(r => {
      const zone = r.zoneName || 'Unknown';
      if (!byZone[zone]) {
        byZone[zone] = { consumption: 0, cost: 0 };
      }
      byZone[zone].consumption += Number(r.consumptionAmount);
      byZone[zone].cost += Number(r.cost || 0);
    });

    return byZone;
  }
}
