import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { OEERecord } from '../entities/oee-record.entity';

@Injectable()
export class OEERecordService {
  constructor(
    @InjectRepository(OEERecord)
    private readonly oeeRecordRepository: Repository<OEERecord>,
  ) {}

  async create(createDto: Partial<OEERecord>): Promise<OEERecord> {
    // Calculate OEE
    const availability = createDto.availability || 0;
    const performance = createDto.performance || 0;
    const quality = createDto.quality || 0;
    const oee = (availability * performance * quality) / 10000;

    const record = this.oeeRecordRepository.create({
      ...createDto,
      oee,
    });
    return this.oeeRecordRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    equipmentId?: string;
    productionLineId?: string;
    startDate?: Date;
    endDate?: Date;
  }): Promise<OEERecord[]> {
    const query = this.oeeRecordRepository.createQueryBuilder('record');

    if (filters?.companyId) {
      query.andWhere('record.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.equipmentId) {
      query.andWhere('record.equipmentId = :equipmentId', { equipmentId: filters.equipmentId });
    }

    if (filters?.productionLineId) {
      query.andWhere('record.productionLineId = :productionLineId', { productionLineId: filters.productionLineId });
    }

    if (filters?.startDate) {
      query.andWhere('record.recordDate >= :startDate', { startDate: filters.startDate });
    }

    if (filters?.endDate) {
      query.andWhere('record.recordDate <= :endDate', { endDate: filters.endDate });
    }

    query.orderBy('record.recordDate', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<OEERecord> {
    const record = await this.oeeRecordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`OEE Record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<OEERecord>): Promise<OEERecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);

    // Recalculate OEE
    record.oee = (record.availability * record.performance * record.quality) / 10000;

    return this.oeeRecordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.oeeRecordRepository.remove(record);
  }

  async getEquipmentOEETrend(equipmentId: string, days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const records = await this.oeeRecordRepository
      .createQueryBuilder('record')
      .where('record.equipmentId = :equipmentId', { equipmentId })
      .andWhere('record.recordDate >= :startDate', { startDate })
      .orderBy('record.recordDate', 'ASC')
      .getMany();

    const avgOEE = records.length > 0
      ? records.reduce((sum, r) => sum + r.oee, 0) / records.length
      : 0;

    return {
      equipmentId,
      periodDays: days,
      records: records.map(r => ({
        date: r.recordDate,
        oee: r.oee,
        availability: r.availability,
        performance: r.performance,
        quality: r.quality,
      })),
      averageOEE: avgOEE,
      trend: records.length > 1 ? (records[records.length - 1].oee - records[0].oee) : 0,
    };
  }

  async getOEESummary(companyId: string): Promise<any> {
    const records = await this.findAll({ companyId });

    if (records.length === 0) {
      return {
        averageOEE: 0,
        averageAvailability: 0,
        averagePerformance: 0,
        averageQuality: 0,
        recordCount: 0,
      };
    }

    return {
      averageOEE: records.reduce((sum, r) => sum + r.oee, 0) / records.length,
      averageAvailability: records.reduce((sum, r) => sum + r.availability, 0) / records.length,
      averagePerformance: records.reduce((sum, r) => sum + r.performance, 0) / records.length,
      averageQuality: records.reduce((sum, r) => sum + r.quality, 0) / records.length,
      recordCount: records.length,
    };
  }
}
