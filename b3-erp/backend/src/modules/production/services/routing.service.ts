import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Routing, RoutingStatus } from '../entities/routing.entity';
import { CreateRoutingDto, UpdateRoutingDto, RoutingResponseDto } from '../dto';

@Injectable()
export class RoutingService {
  constructor(
    @InjectRepository(Routing)
    private readonly routingRepository: Repository<Routing>,
  ) {}

  async create(createDto: CreateRoutingDto): Promise<RoutingResponseDto> {
    const existing = await this.routingRepository.findOne({
      where: { routingCode: createDto.routingCode },
    });

    if (existing) {
      throw new BadRequestException(`Routing code ${createDto.routingCode} already exists`);
    }

    const routing = this.routingRepository.create({
      ...createDto,
      status: RoutingStatus.DRAFT,
      totalOperations: createDto.operations.length,
    });

    // Calculate totals
    let totalSetup = 0;
    let totalRun = 0;
    let totalTeardown = 0;
    let totalCost = 0;

    for (const op of createDto.operations) {
      totalSetup += op.setupTimeMinutes || 0;
      totalRun += op.runTimePerUnitMinutes || 0;
      totalTeardown += op.teardownTimeMinutes || 0;
      totalCost += op.costPerUnit || 0;
    }

    routing.totalSetupTime = totalSetup;
    routing.totalRunTimePerUnit = totalRun;
    routing.totalTeardownTime = totalTeardown;
    routing.totalTimePerUnit = totalSetup / (routing.batchSize || 1) + totalRun + totalTeardown / (routing.batchSize || 1);
    routing.totalCostPerUnit = totalCost;

    const savedRouting = await this.routingRepository.save(routing);
    return this.mapToResponseDto(savedRouting);
  }

  async findAll(filters?: {
    itemId?: string;
    status?: RoutingStatus;
    isActive?: boolean;
  }): Promise<RoutingResponseDto[]> {
    const query = this.routingRepository.createQueryBuilder('routing');

    if (filters?.itemId) {
      query.andWhere('routing.itemId = :itemId', { itemId: filters.itemId });
    }

    if (filters?.status) {
      query.andWhere('routing.status = :status', { status: filters.status });
    }

    if (filters?.isActive !== undefined) {
      query.andWhere('routing.isActive = :isActive', { isActive: filters.isActive });
    }

    query.orderBy('routing.createdAt', 'DESC');

    const routings = await query.getMany();
    return routings.map((routing) => this.mapToResponseDto(routing));
  }

  async findOne(id: string): Promise<RoutingResponseDto> {
    const routing = await this.routingRepository.findOne({ where: { id } });

    if (!routing) {
      throw new NotFoundException(`Routing with ID ${id} not found`);
    }

    return this.mapToResponseDto(routing);
  }

  async update(id: string, updateDto: UpdateRoutingDto): Promise<RoutingResponseDto> {
    const routing = await this.routingRepository.findOne({ where: { id } });

    if (!routing) {
      throw new NotFoundException(`Routing with ID ${id} not found`);
    }

    if (routing.status === RoutingStatus.ACTIVE && updateDto.status !== RoutingStatus.INACTIVE) {
      throw new BadRequestException('Cannot modify active routing. Please create a new version.');
    }

    Object.assign(routing, updateDto);

    // Recalculate totals if operations changed
    if (updateDto.operations) {
      let totalSetup = 0;
      let totalRun = 0;
      let totalTeardown = 0;
      let totalCost = 0;

      for (const op of updateDto.operations) {
        totalSetup += op.setupTimeMinutes || 0;
        totalRun += op.runTimePerUnitMinutes || 0;
        totalTeardown += op.teardownTimeMinutes || 0;
        totalCost += op.costPerUnit || 0;
      }

      routing.totalSetupTime = totalSetup;
      routing.totalRunTimePerUnit = totalRun;
      routing.totalTeardownTime = totalTeardown;
      routing.totalTimePerUnit = totalSetup / (routing.batchSize || 1) + totalRun + totalTeardown / (routing.batchSize || 1);
      routing.totalCostPerUnit = totalCost;
      routing.totalOperations = updateDto.operations.length;
    }

    const updatedRouting = await this.routingRepository.save(routing);
    return this.mapToResponseDto(updatedRouting);
  }

  async remove(id: string): Promise<void> {
    const routing = await this.routingRepository.findOne({ where: { id } });

    if (!routing) {
      throw new NotFoundException(`Routing with ID ${id} not found`);
    }

    if (routing.status === RoutingStatus.ACTIVE) {
      throw new BadRequestException('Cannot delete active routing');
    }

    await this.routingRepository.remove(routing);
  }

  async submit(id: string, submittedBy: string): Promise<RoutingResponseDto> {
    const routing = await this.routingRepository.findOne({ where: { id } });

    if (!routing) {
      throw new NotFoundException(`Routing with ID ${id} not found`);
    }

    if (routing.status !== RoutingStatus.DRAFT) {
      throw new BadRequestException('Only draft routings can be submitted');
    }

    routing.status = RoutingStatus.SUBMITTED;
    routing.submittedBy = submittedBy;
    routing.submittedAt = new Date();

    const updatedRouting = await this.routingRepository.save(routing);
    return this.mapToResponseDto(updatedRouting);
  }

  async approve(id: string, approvedBy: string, comments?: string): Promise<RoutingResponseDto> {
    const routing = await this.routingRepository.findOne({ where: { id } });

    if (!routing) {
      throw new NotFoundException(`Routing with ID ${id} not found`);
    }

    if (routing.status !== RoutingStatus.SUBMITTED) {
      throw new BadRequestException('Only submitted routings can be approved');
    }

    routing.status = RoutingStatus.ACTIVE;
    routing.approvedBy = approvedBy;
    routing.approvedAt = new Date();
    routing.approvalComments = comments;

    const updatedRouting = await this.routingRepository.save(routing);
    return this.mapToResponseDto(updatedRouting);
  }

  private mapToResponseDto(routing: Routing): RoutingResponseDto {
    return {
      id: routing.id,
      routingCode: routing.routingCode,
      routingName: routing.routingName,
      description: routing.description,
      status: routing.status,
      itemId: routing.itemId,
      itemCode: routing.itemCode,
      itemName: routing.itemName,
      bomId: routing.bomId,
      bomCode: routing.bomCode,
      version: routing.version,
      isActive: routing.isActive,
      isDefault: routing.isDefault,
      operations: routing.operations,
      totalSetupTime: routing.totalSetupTime,
      totalRunTimePerUnit: routing.totalRunTimePerUnit,
      totalTimePerUnit: routing.totalTimePerUnit,
      totalOperations: routing.totalOperations,
      totalCostPerUnit: routing.totalCostPerUnit,
      leadTimeDays: routing.leadTimeDays,
      requiresQualityInspection: routing.requiresQualityInspection,
      notes: routing.notes,
      createdBy: routing.createdBy,
      updatedBy: routing.updatedBy,
      createdAt: routing.createdAt,
      updatedAt: routing.updatedAt,
    };
  }
}
