import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionSchedule, ScheduleStatus } from '../entities/production-schedule.entity';

@Injectable()
export class ProductionScheduleService {
  constructor(
    @InjectRepository(ProductionSchedule)
    private readonly productionScheduleRepository: Repository<ProductionSchedule>,
  ) {}

  async create(createDto: Partial<ProductionSchedule>): Promise<ProductionSchedule> {
    const existing = await this.productionScheduleRepository.findOne({
      where: { scheduleNumber: createDto.scheduleNumber },
    });

    if (existing) {
      throw new BadRequestException(`Production Schedule ${createDto.scheduleNumber} already exists`);
    }

    const schedule = this.productionScheduleRepository.create(createDto);
    return this.productionScheduleRepository.save(schedule);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: ScheduleStatus;
    productionLineId?: string;
  }): Promise<ProductionSchedule[]> {
    const query = this.productionScheduleRepository.createQueryBuilder('schedule');

    if (filters?.companyId) {
      query.andWhere('schedule.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('schedule.status = :status', { status: filters.status });
    }

    if (filters?.productionLineId) {
      query.andWhere('schedule.productionLineId = :productionLineId', { productionLineId: filters.productionLineId });
    }

    query.orderBy('schedule.startDate', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ProductionSchedule> {
    const schedule = await this.productionScheduleRepository.findOne({ where: { id } });
    if (!schedule) {
      throw new NotFoundException(`Production Schedule with ID ${id} not found`);
    }
    return schedule;
  }

  async update(id: string, updateDto: Partial<ProductionSchedule>): Promise<ProductionSchedule> {
    const schedule = await this.findOne(id);
    if (schedule.status === 'completed' || schedule.status === 'cancelled') {
      throw new BadRequestException('Cannot modify completed or cancelled schedule');
    }
    Object.assign(schedule, updateDto);
    return this.productionScheduleRepository.save(schedule);
  }

  async remove(id: string): Promise<void> {
    const schedule = await this.findOne(id);
    if (schedule.status !== 'draft') {
      throw new BadRequestException('Only draft schedules can be deleted');
    }
    await this.productionScheduleRepository.remove(schedule);
  }

  async publish(id: string): Promise<ProductionSchedule> {
    const schedule = await this.findOne(id);
    schedule.status = 'published';
    schedule.publishedAt = new Date();
    return this.productionScheduleRepository.save(schedule);
  }

  async optimize(id: string): Promise<ProductionSchedule> {
    const schedule = await this.findOne(id);
    schedule.isOptimized = true;
    return this.productionScheduleRepository.save(schedule);
  }

  async getGanttData(id: string): Promise<any> {
    const schedule = await this.findOne(id);

    return {
      scheduleId: schedule.id,
      scheduleName: schedule.name,
      scheduleNumber: schedule.scheduleNumber,
      startDate: schedule.startDate,
      endDate: schedule.endDate,
      scheduleItems: schedule.scheduleItems || [],
      resourceAllocations: schedule.resourceAllocations || [],
    };
  }
}
