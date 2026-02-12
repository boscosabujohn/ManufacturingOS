import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AggregatePlan, AggregatePlanStatus } from '../entities/aggregate-plan.entity';

@Injectable()
export class AggregatePlanService {
  constructor(
    @InjectRepository(AggregatePlan)
    private readonly aggregatePlanRepository: Repository<AggregatePlan>,
  ) {}

  async create(createDto: Partial<AggregatePlan>): Promise<AggregatePlan> {
    const existing = await this.aggregatePlanRepository.findOne({
      where: { planNumber: createDto.planNumber },
    });

    if (existing) {
      throw new BadRequestException(`Aggregate Plan ${createDto.planNumber} already exists`);
    }

    const plan = this.aggregatePlanRepository.create(createDto);
    return this.aggregatePlanRepository.save(plan);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: AggregatePlanStatus;
  }): Promise<AggregatePlan[]> {
    const query = this.aggregatePlanRepository.createQueryBuilder('plan');

    if (filters?.companyId) {
      query.andWhere('plan.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('plan.status = :status', { status: filters.status });
    }

    query.orderBy('plan.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<AggregatePlan> {
    const plan = await this.aggregatePlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Aggregate Plan with ID ${id} not found`);
    }
    return plan;
  }

  async update(id: string, updateDto: Partial<AggregatePlan>): Promise<AggregatePlan> {
    const plan = await this.findOne(id);
    Object.assign(plan, updateDto);
    return this.aggregatePlanRepository.save(plan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    if (plan.status !== 'draft') {
      throw new BadRequestException('Only draft aggregate plans can be deleted');
    }
    await this.aggregatePlanRepository.remove(plan);
  }

  async optimize(id: string): Promise<any> {
    const plan = await this.findOne(id);

    // Calculate total cost from entity fields
    const totalCost = (plan.costs?.regularLaborCost || 0) +
                      (plan.costs?.overtimeCost || 0) +
                      (plan.costs?.inventoryHoldingCost || 0);

    return {
      planId: plan.id,
      planningStrategy: plan.planningStrategy,
      totalCost,
      recommendations: [
        { action: 'Adjust workforce', impact: 'Reduce overtime by 15%' },
        { action: 'Level production', impact: 'Smooth inventory fluctuations' },
      ],
    };
  }
}
