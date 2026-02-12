import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MRPRun, MRPRunStatus } from '../entities/mrp-run.entity';

@Injectable()
export class MRPRunService {
  constructor(
    @InjectRepository(MRPRun)
    private readonly mrpRunRepository: Repository<MRPRun>,
  ) {}

  async create(createDto: Partial<MRPRun>): Promise<MRPRun> {
    const existing = await this.mrpRunRepository.findOne({
      where: { runNumber: createDto.runNumber },
    });

    if (existing) {
      throw new BadRequestException(`MRP Run ${createDto.runNumber} already exists`);
    }

    const run = this.mrpRunRepository.create({
      ...createDto,
      status: 'pending',
    });
    return this.mrpRunRepository.save(run);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: MRPRunStatus;
  }): Promise<MRPRun[]> {
    const query = this.mrpRunRepository.createQueryBuilder('run');

    if (filters?.companyId) {
      query.andWhere('run.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('run.status = :status', { status: filters.status });
    }

    query.orderBy('run.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<MRPRun> {
    const run = await this.mrpRunRepository.findOne({ where: { id } });
    if (!run) {
      throw new NotFoundException(`MRP Run with ID ${id} not found`);
    }
    return run;
  }

  async execute(id: string): Promise<MRPRun> {
    const run = await this.findOne(id);

    if (run.status === 'running') {
      throw new BadRequestException('MRP Run is already in progress');
    }

    run.status = 'running';
    run.runStartedAt = new Date();
    await this.mrpRunRepository.save(run);

    // Simulate MRP execution
    run.itemsProcessed = 150;
    run.plannedOrdersCreated = 45;
    run.actionMessagesGenerated = 32;

    run.summary = {
      totalRequirements: 200,
      totalPlannedOrders: 45,
      totalPurchaseRequisitions: 32,
      totalReschedulingActions: 12,
      totalCancellationActions: 5,
      exceptions: 8,
    };

    run.status = 'completed';
    run.runCompletedAt = new Date();

    return this.mrpRunRepository.save(run);
  }

  async getResults(id: string): Promise<any> {
    const run = await this.findOne(id);
    return {
      runId: run.id,
      runNumber: run.runNumber,
      status: run.status,
      summary: run.summary,
      metrics: {
        itemsProcessed: run.itemsProcessed,
        plannedOrdersCreated: run.plannedOrdersCreated,
        actionMessagesGenerated: run.actionMessagesGenerated,
      },
    };
  }
}
