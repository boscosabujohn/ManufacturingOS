import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DowntimeRecord, DowntimeStatus, DowntimeType } from '../entities/downtime-record.entity';

@Injectable()
export class DowntimeRecordService {
  constructor(
    @InjectRepository(DowntimeRecord)
    private readonly downtimeRecordRepository: Repository<DowntimeRecord>,
  ) {}

  async create(createDto: Partial<DowntimeRecord>): Promise<DowntimeRecord> {
    const record = this.downtimeRecordRepository.create(createDto);
    return this.downtimeRecordRepository.save(record);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: DowntimeStatus;
    downtimeType?: DowntimeType;
    equipmentId?: string;
  }): Promise<DowntimeRecord[]> {
    const query = this.downtimeRecordRepository.createQueryBuilder('record');

    if (filters?.companyId) {
      query.andWhere('record.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('record.status = :status', { status: filters.status });
    }

    if (filters?.downtimeType) {
      query.andWhere('record.downtimeType = :downtimeType', { downtimeType: filters.downtimeType });
    }

    if (filters?.equipmentId) {
      query.andWhere('record.equipmentId = :equipmentId', { equipmentId: filters.equipmentId });
    }

    query.orderBy('record.startTime', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<DowntimeRecord> {
    const record = await this.downtimeRecordRepository.findOne({ where: { id } });
    if (!record) {
      throw new NotFoundException(`Downtime Record with ID ${id} not found`);
    }
    return record;
  }

  async update(id: string, updateDto: Partial<DowntimeRecord>): Promise<DowntimeRecord> {
    const record = await this.findOne(id);
    Object.assign(record, updateDto);
    return this.downtimeRecordRepository.save(record);
  }

  async remove(id: string): Promise<void> {
    const record = await this.findOne(id);
    await this.downtimeRecordRepository.remove(record);
  }

  async endDowntime(id: string, endedBy: string): Promise<DowntimeRecord> {
    const record = await this.findOne(id);
    record.endTime = new Date();
    record.status = 'resolved';

    const duration = (record.endTime.getTime() - new Date(record.startTime).getTime()) / (1000 * 60);
    record.durationMinutes = duration;

    return this.downtimeRecordRepository.save(record);
  }

  async getAnalytics(companyId: string, startDate: Date, endDate: Date): Promise<any> {
    const records = await this.downtimeRecordRepository
      .createQueryBuilder('record')
      .where('record.companyId = :companyId', { companyId })
      .andWhere('record.startTime >= :startDate', { startDate })
      .andWhere('record.startTime <= :endDate', { endDate })
      .getMany();

    const totalDowntime = records.reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
    const plannedDowntime = records
      .filter(r => r.downtimeType === 'planned')
      .reduce((sum, r) => sum + (r.durationMinutes || 0), 0);
    const unplannedDowntime = records
      .filter(r => r.downtimeType === 'unplanned')
      .reduce((sum, r) => sum + (r.durationMinutes || 0), 0);

    const categorySummary = records.reduce((acc, r) => {
      const category = r.category || 'Unknown';
      acc[category] = (acc[category] || 0) + (r.durationMinutes || 0);
      return acc;
    }, {} as Record<string, number>);

    return {
      totalDowntimeMinutes: totalDowntime,
      plannedDowntimeMinutes: plannedDowntime,
      unplannedDowntimeMinutes: unplannedDowntime,
      totalIncidents: records.length,
      categorySummary,
      averageDowntime: records.length > 0 ? totalDowntime / records.length : 0,
    };
  }
}
