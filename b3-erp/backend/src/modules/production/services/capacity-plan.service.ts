import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CapacityPlan, CapacityPlanStatus } from '../entities/capacity-plan.entity';

@Injectable()
export class CapacityPlanService {
  constructor(
    @InjectRepository(CapacityPlan)
    private readonly capacityPlanRepository: Repository<CapacityPlan>,
  ) {}

  async create(createDto: Partial<CapacityPlan>): Promise<CapacityPlan> {
    const existing = await this.capacityPlanRepository.findOne({
      where: { planNumber: createDto.planNumber },
    });

    if (existing) {
      throw new BadRequestException(`Capacity Plan ${createDto.planNumber} already exists`);
    }

    const plan = this.capacityPlanRepository.create(createDto);
    return this.capacityPlanRepository.save(plan);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: CapacityPlanStatus;
    workCenterId?: string;
  }): Promise<CapacityPlan[]> {
    const query = this.capacityPlanRepository.createQueryBuilder('plan');

    if (filters?.companyId) {
      query.andWhere('plan.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('plan.status = :status', { status: filters.status });
    }

    if (filters?.workCenterId) {
      query.andWhere('plan.workCenterId = :workCenterId', { workCenterId: filters.workCenterId });
    }

    query.orderBy('plan.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<CapacityPlan> {
    const plan = await this.capacityPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Capacity Plan with ID ${id} not found`);
    }
    return plan;
  }

  async update(id: string, updateDto: Partial<CapacityPlan>): Promise<CapacityPlan> {
    const plan = await this.findOne(id);
    Object.assign(plan, updateDto);
    return this.capacityPlanRepository.save(plan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    if (plan.status !== 'draft') {
      throw new BadRequestException('Only draft capacity plans can be deleted');
    }
    await this.capacityPlanRepository.remove(plan);
  }

  async calculateUtilization(id: string): Promise<any> {
    const plan = await this.findOne(id);
    const utilization = plan.availableCapacity > 0
      ? (plan.requiredCapacity / plan.availableCapacity) * 100
      : 0;

    plan.utilizationPercentage = utilization;
    await this.capacityPlanRepository.save(plan);

    return {
      planId: plan.id,
      requiredCapacity: plan.requiredCapacity,
      availableCapacity: plan.availableCapacity,
      utilization: utilization,
    };
  }
}
