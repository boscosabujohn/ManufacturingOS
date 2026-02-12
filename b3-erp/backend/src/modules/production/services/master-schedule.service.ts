import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MasterSchedule, MasterScheduleStatus } from '../entities/master-schedule.entity';

@Injectable()
export class MasterScheduleService {
  constructor(
    @InjectRepository(MasterSchedule)
    private readonly masterScheduleRepository: Repository<MasterSchedule>,
  ) {}

  async create(createDto: Partial<MasterSchedule>): Promise<MasterSchedule> {
    const existing = await this.masterScheduleRepository.findOne({
      where: { scheduleNumber: createDto.scheduleNumber },
    });

    if (existing) {
      throw new BadRequestException(`Master Schedule ${createDto.scheduleNumber} already exists`);
    }

    const schedule = this.masterScheduleRepository.create(createDto);
    return this.masterScheduleRepository.save(schedule);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: MasterScheduleStatus;
  }): Promise<MasterSchedule[]> {
    const query = this.masterScheduleRepository.createQueryBuilder('schedule');

    if (filters?.companyId) {
      query.andWhere('schedule.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('schedule.status = :status', { status: filters.status });
    }

    query.orderBy('schedule.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<MasterSchedule> {
    const schedule = await this.masterScheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Master Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async update(id: string, updateDto: Partial<MasterSchedule>): Promise<MasterSchedule> {
    const schedule = await this.findOne(id);
    if (schedule.status === 'frozen') {
      throw new BadRequestException('Cannot modify frozen schedule');
    }
    Object.assign(schedule, updateDto);
    return this.masterScheduleRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.findOne(id);
    if (schedule.status !== 'draft') {
      throw new BadRequestException('Only draft schedules can be deleted');
    }
    await this.masterScheduleRepository.remove(schedule);
  }

  async freeze(id: string): Promise<MasterSchedule> {
    const schedule = await this.findOne(id);
    schedule.status = 'frozen';
    return this.masterScheduleRepository.save(schedule);
  }

  async calculateATP(id: string): Promise<any> {
    const schedule = await this.findOne(id);

    // Available-to-Promise calculation from weekly schedules
    const atpResults = schedule.scheduleItems?.map(item => ({
      itemId: item.itemId,
      itemCode: item.itemCode,
      itemName: item.itemName,
      totalMpsQuantity: item.totalMpsQuantity,
      totalAtp: item.totalAtp,
      weeklyAtp: item.weeklySchedule?.map(week => ({
        week: week.week,
        weekStart: week.weekStart,
        mpsQuantity: week.mpsQuantity,
        availableToPromise: week.availableToPromise,
      })) || [],
    })) || [];

    return {
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      atpCalculation: atpResults,
    };
  }
}
