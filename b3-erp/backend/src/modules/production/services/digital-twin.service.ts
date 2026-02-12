import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DigitalTwin, TwinStatus } from '../entities/digital-twin.entity';

@Injectable()
export class DigitalTwinService {
  constructor(
    @InjectRepository(DigitalTwin)
    private readonly digitalTwinRepository: Repository<DigitalTwin>,
  ) {}

  async create(createDto: Partial<DigitalTwin>): Promise<DigitalTwin> {
    const existing = await this.digitalTwinRepository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new BadRequestException(`Digital Twin ${createDto.code} already exists`);
    }

    const twin = this.digitalTwinRepository.create(createDto);
    return this.digitalTwinRepository.save(twin);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: TwinStatus;
    entityType?: string;
  }): Promise<DigitalTwin[]> {
    const query = this.digitalTwinRepository.createQueryBuilder('twin');

    if (filters?.companyId) {
      query.andWhere('twin.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('twin.status = :status', { status: filters.status });
    }

    if (filters?.entityType) {
      query.andWhere('twin.entityType = :entityType', { entityType: filters.entityType });
    }

    query.orderBy('twin.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<DigitalTwin> {
    const twin = await this.digitalTwinRepository.findOne({ where: { id } });
    if (!twin) {
      throw new NotFoundException(`Digital Twin with ID ${id} not found`);
    }
    return twin;
  }

  async update(id: string, updateDto: Partial<DigitalTwin>): Promise<DigitalTwin> {
    const twin = await this.findOne(id);
    Object.assign(twin, updateDto);
    return this.digitalTwinRepository.save(twin);
  }

  async remove(id: string): Promise<void> {
    const twin = await this.findOne(id);
    await this.digitalTwinRepository.remove(twin);
  }

  async syncWithPhysical(id: string): Promise<DigitalTwin> {
    const twin = await this.findOne(id);
    twin.lastSyncAt = new Date();
    twin.status = 'connected';
    return this.digitalTwinRepository.save(twin);
  }

  async getRealTimeState(id: string): Promise<any> {
    const twin = await this.findOne(id);

    return {
      twinId: twin.id,
      name: twin.name,
      status: twin.status,
      currentState: twin.currentState,
      sensors: twin.sensors,
      lastSyncAt: twin.lastSyncAt,
      predictiveInsights: twin.predictiveInsights,
    };
  }

  async runSimulation(id: string, parameters: any): Promise<any> {
    const twin = await this.findOne(id);

    // Mock simulation results
    return {
      twinId: twin.id,
      simulationId: `SIM-${Date.now()}`,
      parameters,
      results: {
        predictedOutput: 1000,
        efficiency: 0.85,
        bottlenecks: [],
        recommendations: [
          { action: 'Increase speed by 5%', impact: 'Improve throughput' },
        ],
      },
      simulatedAt: new Date(),
    };
  }
}
