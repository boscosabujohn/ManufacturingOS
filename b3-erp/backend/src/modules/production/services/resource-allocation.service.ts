import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ResourceAllocation, AllocationStatus, ResourceType } from '../entities/resource-allocation.entity';

@Injectable()
export class ResourceAllocationService {
  constructor(
    @InjectRepository(ResourceAllocation)
    private readonly resourceAllocationRepository: Repository<ResourceAllocation>,
  ) {}

  async create(createDto: Partial<ResourceAllocation>): Promise<ResourceAllocation> {
    const allocation = this.resourceAllocationRepository.create(createDto);
    return this.resourceAllocationRepository.save(allocation);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: AllocationStatus;
    resourceType?: ResourceType;
    resourceId?: string;
    scheduleId?: string;
  }): Promise<ResourceAllocation[]> {
    const query = this.resourceAllocationRepository.createQueryBuilder('allocation');

    if (filters?.companyId) {
      query.andWhere('allocation.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('allocation.status = :status', { status: filters.status });
    }

    if (filters?.resourceType) {
      query.andWhere('allocation.resourceType = :resourceType', { resourceType: filters.resourceType });
    }

    if (filters?.resourceId) {
      query.andWhere('allocation.resourceId = :resourceId', { resourceId: filters.resourceId });
    }

    if (filters?.scheduleId) {
      query.andWhere('allocation.scheduleId = :scheduleId', { scheduleId: filters.scheduleId });
    }

    query.orderBy('allocation.startTime', 'ASC');
    return query.getMany();
  }

  async findOne(id: string): Promise<ResourceAllocation> {
    const allocation = await this.resourceAllocationRepository.findOne({ where: { id } });
    if (!allocation) {
      throw new NotFoundException(`Resource Allocation with ID ${id} not found`);
    }
    return allocation;
  }

  async update(id: string, updateDto: Partial<ResourceAllocation>): Promise<ResourceAllocation> {
    const allocation = await this.findOne(id);
    Object.assign(allocation, updateDto);
    return this.resourceAllocationRepository.save(allocation);
  }

  async remove(id: string): Promise<void> {
    const allocation = await this.findOne(id);
    if (allocation.status === 'released') {
      throw new BadRequestException('Cannot delete released allocations');
    }
    await this.resourceAllocationRepository.remove(allocation);
  }

  async checkConflicts(resourceId: string, startTime: Date, endTime: Date): Promise<any[]> {
    const conflicts = await this.resourceAllocationRepository
      .createQueryBuilder('allocation')
      .where('allocation.resourceId = :resourceId', { resourceId })
      .andWhere('allocation.status NOT IN (:...statuses)', { statuses: ['released', 'unavailable'] })
      .andWhere(
        '(allocation.startTime < :endTime AND allocation.endTime > :startTime)',
        { startTime, endTime }
      )
      .getMany();

    return conflicts;
  }

  async getUtilization(resourceId: string, startDate: Date, endDate: Date): Promise<any> {
    const allocations = await this.resourceAllocationRepository
      .createQueryBuilder('allocation')
      .where('allocation.resourceId = :resourceId', { resourceId })
      .andWhere('allocation.startTime >= :startDate', { startDate })
      .andWhere('allocation.endTime <= :endDate', { endDate })
      .getMany();

    const totalAllocatedHours = allocations.reduce((sum, a) => sum + a.allocatedHours, 0);
    const totalHours = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60);

    return {
      resourceId,
      totalAllocatedHours,
      totalAvailableHours: totalHours,
      utilizationRate: totalHours > 0 ? (totalAllocatedHours / totalHours) * 100 : 0,
    };
  }
}
