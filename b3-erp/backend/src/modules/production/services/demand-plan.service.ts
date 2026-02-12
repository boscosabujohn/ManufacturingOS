import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DemandPlan, DemandPlanStatus } from '../entities/demand-plan.entity';

@Injectable()
export class DemandPlanService {
  constructor(
    @InjectRepository(DemandPlan)
    private readonly demandPlanRepository: Repository<DemandPlan>,
  ) {}

  async create(createDto: Partial<DemandPlan>): Promise<DemandPlan> {
    const existing = await this.demandPlanRepository.findOne({
      where: { planNumber: createDto.planNumber },
    });

    if (existing) {
      throw new BadRequestException(`Demand Plan ${createDto.planNumber} already exists`);
    }

    const plan = this.demandPlanRepository.create(createDto);
    return this.demandPlanRepository.save(plan);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: DemandPlanStatus;
    productId?: string;
  }): Promise<DemandPlan[]> {
    const query = this.demandPlanRepository.createQueryBuilder('plan');

    if (filters?.companyId) {
      query.andWhere('plan.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('plan.status = :status', { status: filters.status });
    }

    if (filters?.productId) {
      query.andWhere('plan.productId = :productId', { productId: filters.productId });
    }

    query.orderBy('plan.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<DemandPlan> {
    const plan = await this.demandPlanRepository.findOne({ where: { id } });
    if (!plan) {
      throw new NotFoundException(`Demand Plan with ID ${id} not found`);
    }
    return plan;
  }

  async update(id: string, updateDto: Partial<DemandPlan>): Promise<DemandPlan> {
    const plan = await this.findOne(id);
    Object.assign(plan, updateDto);
    return this.demandPlanRepository.save(plan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.findOne(id);
    if (plan.status !== 'draft') {
      throw new BadRequestException('Only draft demand plans can be deleted');
    }
    await this.demandPlanRepository.remove(plan);
  }

  async runForecast(id: string): Promise<any> {
    const plan = await this.findOne(id);

    // Mock forecast calculation based on demand items
    const forecastData = plan.demandItems?.map((item, index) => ({
      period: item.period || `Period ${index + 1}`,
      forecastedDemand: item.forecastQuantity * (1 + (Math.random() * 0.2 - 0.1)),
      confidenceLevel: 0.85 + Math.random() * 0.1,
    })) || [];

    return {
      planId: plan.id,
      forecastResults: forecastData,
      forecastMethod: plan.forecastMethod,
    };
  }
}
