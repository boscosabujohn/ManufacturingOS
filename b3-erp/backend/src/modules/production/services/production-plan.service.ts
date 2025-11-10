import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProductionPlan, ProductionPlanStatus } from '../entities/production-plan.entity';
import { CreateProductionPlanDto, UpdateProductionPlanDto, ProductionPlanResponseDto } from '../dto';

@Injectable()
export class ProductionPlanService {
  constructor(
    @InjectRepository(ProductionPlan)
    private readonly productionPlanRepository: Repository<ProductionPlan>,
  ) {}

  async create(createDto: CreateProductionPlanDto): Promise<ProductionPlanResponseDto> {
    const existing = await this.productionPlanRepository.findOne({
      where: { planNumber: createDto.planNumber },
    });

    if (existing) {
      throw new BadRequestException(`Production Plan ${createDto.planNumber} already exists`);
    }

    const plan = this.productionPlanRepository.create({
      ...createDto,
      status: ProductionPlanStatus.DRAFT,
    });

    const savedPlan = await this.productionPlanRepository.save(plan);
    return this.mapToResponseDto(savedPlan);
  }

  async findAll(filters?: {
    status?: ProductionPlanStatus;
    periodStartDate?: string;
    periodEndDate?: string;
  }): Promise<ProductionPlanResponseDto[]> {
    const query = this.productionPlanRepository.createQueryBuilder('plan');

    if (filters?.status) {
      query.andWhere('plan.status = :status', { status: filters.status });
    }

    if (filters?.periodStartDate) {
      query.andWhere('plan.periodStartDate >= :startDate', {
        startDate: filters.periodStartDate,
      });
    }

    if (filters?.periodEndDate) {
      query.andWhere('plan.periodEndDate <= :endDate', {
        endDate: filters.periodEndDate,
      });
    }

    query.orderBy('plan.periodStartDate', 'DESC');

    const plans = await query.getMany();
    return plans.map((plan) => this.mapToResponseDto(plan));
  }

  async findOne(id: string): Promise<ProductionPlanResponseDto> {
    const plan = await this.productionPlanRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Production Plan with ID ${id} not found`);
    }

    return this.mapToResponseDto(plan);
  }

  async update(id: string, updateDto: UpdateProductionPlanDto): Promise<ProductionPlanResponseDto> {
    const plan = await this.productionPlanRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Production Plan with ID ${id} not found`);
    }

    if (plan.isFrozen) {
      throw new BadRequestException('Cannot modify frozen production plan');
    }

    Object.assign(plan, updateDto);
    const updatedPlan = await this.productionPlanRepository.save(plan);
    return this.mapToResponseDto(updatedPlan);
  }

  async remove(id: string): Promise<void> {
    const plan = await this.productionPlanRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Production Plan with ID ${id} not found`);
    }

    if (plan.status !== ProductionPlanStatus.DRAFT) {
      throw new BadRequestException('Only draft production plans can be deleted');
    }

    await this.productionPlanRepository.remove(plan);
  }

  // Special operations
  async runMRP(id: string, runBy: string): Promise<any> {
    const plan = await this.productionPlanRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Production Plan with ID ${id} not found`);
    }

    // MRP Calculation logic
    const netRequirement = plan.demandQuantity + plan.forecastQuantity - plan.currentStockQuantity;
    
    plan.netRequirement = netRequirement > 0 ? netRequirement : 0;
    plan.plannedProductionQuantity = plan.netRequirement;
    plan.mrpRunExecuted = true;
    plan.mrpRunDate = new Date();
    plan.mrpRunBy = runBy;

    // Mock MRP results
    plan.mrpResults = {
      componentsRequired: 0,
      purchaseRequisitionsGenerated: 0,
      workOrdersRecommended: Math.ceil(plan.plannedProductionQuantity / (plan.lotSize || 1)),
      shortages: [],
      excesses: [],
    };

    await this.productionPlanRepository.save(plan);

    return {
      planId: plan.id,
      planNumber: plan.planNumber,
      netRequirement: plan.netRequirement,
      plannedProduction: plan.plannedProductionQuantity,
      mrpResults: plan.mrpResults,
    };
  }

  async capacityPlanning(id: string): Promise<any> {
    const plan = await this.productionPlanRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Production Plan with ID ${id} not found`);
    }

    // Capacity planning logic
    plan.capacityUtilizationPercentage = 
      plan.availableCapacityHours > 0
        ? (plan.requiredCapacityHours / plan.availableCapacityHours) * 100
        : 0;

    plan.hasCapacityConstraint = plan.capacityUtilizationPercentage > 100;

    await this.productionPlanRepository.save(plan);

    return {
      planId: plan.id,
      planNumber: plan.planNumber,
      requiredCapacity: plan.requiredCapacityHours,
      availableCapacity: plan.availableCapacityHours,
      utilization: plan.capacityUtilizationPercentage,
      hasConstraint: plan.hasCapacityConstraint,
    };
  }

  async freeze(id: string): Promise<ProductionPlanResponseDto> {
    const plan = await this.productionPlanRepository.findOne({ where: { id } });

    if (!plan) {
      throw new NotFoundException(`Production Plan with ID ${id} not found`);
    }

    plan.isFrozen = true;
    plan.frozenDate = new Date();

    const updatedPlan = await this.productionPlanRepository.save(plan);
    return this.mapToResponseDto(updatedPlan);
  }

  private mapToResponseDto(plan: ProductionPlan): ProductionPlanResponseDto {
    return {
      id: plan.id,
      planNumber: plan.planNumber,
      planName: plan.planName,
      description: plan.description,
      status: plan.status,
      planningMethod: plan.planningMethod,
      periodStartDate: plan.periodStartDate,
      periodEndDate: plan.periodEndDate,
      periodName: plan.periodName,
      itemId: plan.itemId,
      itemCode: plan.itemCode,
      itemName: plan.itemName,
      demandQuantity: plan.demandQuantity,
      forecastQuantity: plan.forecastQuantity,
      plannedProductionQuantity: plan.plannedProductionQuantity,
      actualProductionQuantity: plan.actualProductionQuantity,
      netRequirement: plan.netRequirement,
      requiredCapacityHours: plan.requiredCapacityHours,
      availableCapacityHours: plan.availableCapacityHours,
      completionPercentage: plan.completionPercentage,
      mrpRunExecuted: plan.mrpRunExecuted,
      mrpRunDate: plan.mrpRunDate,
      isFrozen: plan.isFrozen,
      notes: plan.notes,
      createdBy: plan.createdBy,
      updatedBy: plan.updatedBy,
      createdAt: plan.createdAt,
      updatedAt: plan.updatedAt,
    };
  }
}
