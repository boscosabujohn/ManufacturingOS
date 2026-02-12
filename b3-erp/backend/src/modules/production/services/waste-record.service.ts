import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WasteRecord, WasteType, DisposalMethod } from '../entities/waste-record.entity';

@Injectable()
export class WasteRecordService {
  constructor(
    @InjectRepository(WasteRecord)
    private readonly wasteRecordRepository: Repository<WasteRecord>,
  ) {}

  async create(createDto: Partial<WasteRecord>): Promise<WasteRecord> {
    const record = this.wasteRecordRepository.create(createDto);
    return this.wasteRecordRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    wasteType?: WasteType;
    disposalMethod?: DisposalMethod;
    startDate?: Date;
    endDate?: Date;
  }): Promise<WasteRecord[]> {
    const query = this.wasteRecordRepository.createQueryBuilder('waste');

    if (filters?.companyId) {
      query.andWhere('waste.companyId = :companyId', { companyId: filters.companyId });
    }
    if (filters?.wasteType) {
      query.andWhere('waste.wasteType = :wasteType', { wasteType: filters.wasteType });
    }
    if (filters?.disposalMethod) {
      query.andWhere('waste.disposalMethod = :disposalMethod', { disposalMethod: filters.disposalMethod });
    }
    if (filters?.startDate && filters?.endDate) {
      query.andWhere('waste.recordDate BETWEEN :startDate AND :endDate', {
        startDate: filters.startDate,
        endDate: filters.endDate,
      });
    }

    query.orderBy('waste.recordDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<WasteRecord> {
    const record = await this.wasteRecordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Waste Record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<WasteRecord>): Promise<WasteRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.wasteRecordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.wasteRecordRepository.remove(record);
  }

  async getWasteSummary(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    const records = await this.findAll({ companyId, startDate, endDate });

    const totalWaste = records.reduce((sum, r) => sum + Number(r.wasteAmount), 0);
    const totalRecycled = records.reduce((sum, r) => sum + Number(r.recycledAmount || 0), 0);
    const totalDisposalCost = records.reduce((sum, r) => sum + Number(r.disposalCost || 0), 0);
    const totalRecyclingRevenue = records.reduce((sum, r) => sum + Number(r.recyclingRevenue || 0), 0);

    const byType: Record<string, number> = {};
    const byMethod: Record<string, number> = {};

    records.forEach(r => {
      byType[r.wasteType] = (byType[r.wasteType] || 0) + Number(r.wasteAmount);
      byMethod[r.disposalMethod] = (byMethod[r.disposalMethod] || 0) + Number(r.wasteAmount);
    });

    return {
      period: { startDate, endDate },
      totalWaste,
      totalRecycled,
      recyclingRate: totalWaste > 0 ? (totalRecycled / totalWaste) * 100 : 0,
      netCost: totalDisposalCost - totalRecyclingRevenue,
      byType,
      byMethod,
    };
  }

  async getScrapAnalysis(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    const records = await this.findAll({ companyId, startDate, endDate });

    const scrapData = records
      .filter(r => r.scrapData && r.scrapData.length > 0)
      .flatMap(r => r.scrapData || []);

    const totalScrapCost = scrapData.reduce((sum, s) => sum + (s.materialCost || 0), 0);
    const avgScrapRate = scrapData.length > 0
      ? scrapData.reduce((sum, s) => sum + (s.scrapRate || 0), 0) / scrapData.length
      : 0;

    return {
      period: { startDate, endDate },
      totalScrapRecords: scrapData.length,
      totalScrapCost,
      averageScrapRate: avgScrapRate,
      scrapByReason: scrapData.reduce((acc, s) => {
        const reason = s.reason || 'Unknown';
        acc[reason] = (acc[reason] || 0) + 1;
        return acc;
      }, {} as Record<string, number>),
    };
  }
}
