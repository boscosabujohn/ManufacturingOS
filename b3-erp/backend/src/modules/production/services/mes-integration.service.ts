import {
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { MESIntegration, IntegrationStatus, IntegrationType } from '../entities/mes-integration.entity';

@Injectable()
export class MESIntegrationService {
  constructor(
    @InjectRepository(MESIntegration)
    private readonly mesIntegrationRepository: Repository<MESIntegration>,
  ) {}

  async create(createDto: Partial<MESIntegration>): Promise<MESIntegration> {
    const existing = await this.mesIntegrationRepository.findOne({
      where: { integrationCode: createDto.integrationCode },
    });

    if (existing) {
      throw new BadRequestException(`MES Integration ${createDto.integrationCode} already exists`);
    }

    const integration = this.mesIntegrationRepository.create(createDto);
    return this.mesIntegrationRepository.save(integration);
  }

  async findAll(filters?: {
    companyId?: string;
    status?: IntegrationStatus;
    integrationType?: IntegrationType;
  }): Promise<MESIntegration[]> {
    const query = this.mesIntegrationRepository.createQueryBuilder('integration');

    if (filters?.companyId) {
      query.andWhere('integration.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.status) {
      query.andWhere('integration.status = :status', { status: filters.status });
    }

    if (filters?.integrationType) {
      query.andWhere('integration.integrationType = :integrationType', { integrationType: filters.integrationType });
    }

    query.orderBy('integration.createdAt', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<MESIntegration> {
    const integration = await this.mesIntegrationRepository.findOne({ where: { id } });
    if (!integration) {
      throw new NotFoundException(`MES Integration with ID ${id} not found`);
    }
    return integration;
  }

  async update(id: string, updateDto: Partial<MESIntegration>): Promise<MESIntegration> {
    const integration = await this.findOne(id);
    Object.assign(integration, updateDto);
    return this.mesIntegrationRepository.save(integration);
  }

  async remove(id: string): Promise<void> {
    const integration = await this.findOne(id);
    if (integration.status === 'active') {
      throw new BadRequestException('Cannot delete active integration');
    }
    await this.mesIntegrationRepository.remove(integration);
  }

  async activate(id: string): Promise<MESIntegration> {
    const integration = await this.findOne(id);
    integration.status = 'active';
    integration.isActive = true;
    return this.mesIntegrationRepository.save(integration);
  }

  async deactivate(id: string): Promise<MESIntegration> {
    const integration = await this.findOne(id);
    integration.status = 'inactive';
    integration.isActive = false;
    return this.mesIntegrationRepository.save(integration);
  }

  async sync(id: string): Promise<any> {
    const integration = await this.findOne(id);

    if (integration.status !== 'active') {
      throw new BadRequestException('Integration is not active');
    }

    // Mock sync operation
    integration.lastSyncAt = new Date();
    integration.lastSyncStatus = 'success';
    integration.recordsSynced += 10;

    await this.mesIntegrationRepository.save(integration);

    return {
      integrationId: integration.id,
      syncStatus: 'success',
      recordsSynced: 10,
      syncedAt: integration.lastSyncAt,
    };
  }

  async testConnection(id: string): Promise<any> {
    const integration = await this.findOne(id);

    // Mock connection test
    return {
      integrationId: integration.id,
      connectionStatus: 'connected',
      latency: Math.round(Math.random() * 100),
      testedAt: new Date(),
    };
  }

  async getHealthMetrics(id: string): Promise<any> {
    const integration = await this.findOne(id);

    return {
      integrationId: integration.id,
      integrationName: integration.integrationName,
      status: integration.status,
      healthMetrics: integration.healthMetrics,
      errorCount: integration.errorCount,
      lastSyncAt: integration.lastSyncAt,
    };
  }
}
