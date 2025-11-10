import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemConfig } from '../entities/system-config.entity';
import { CreateSystemConfigDto } from '../dto/create-system-config.dto';
import { UpdateSystemConfigDto } from '../dto/update-system-config.dto';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class SystemConfigService {
  constructor(
    @InjectRepository(SystemConfig)
    private readonly repository: Repository<SystemConfig>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    createDto: CreateSystemConfigDto,
    createdBy?: string,
  ): Promise<SystemConfig> {
    // Check if key already exists
    const existing = await this.repository.findOne({
      where: { key: createDto.key },
    });

    if (existing) {
      throw new ConflictException(
        `Config with key ${createDto.key} already exists`,
      );
    }

    const config = this.repository.create({
      ...createDto,
      createdBy,
      lastModifiedBy: createdBy,
      lastModifiedAt: new Date(),
    });

    const saved = await this.repository.save(config);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'CREATE',
      description: `System config ${saved.key} created`,
      entityType: 'SystemConfig',
      entityId: saved.id,
      entityName: saved.name,
    });

    return saved;
  }

  async findAll(filters?: any): Promise<SystemConfig[]> {
    const query = this.repository.createQueryBuilder('config');

    if (filters?.category) {
      query.andWhere('config.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.module) {
      query.andWhere('config.module = :module', { module: filters.module });
    }

    if (filters?.status) {
      query.andWhere('config.status = :status', { status: filters.status });
    }

    if (filters?.search) {
      query.andWhere('(config.key ILIKE :search OR config.name ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    query.orderBy('config.category', 'ASC').addOrderBy('config.key', 'ASC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<SystemConfig> {
    const config = await this.repository.findOne({ where: { id } });

    if (!config) {
      throw new NotFoundException(`Config with ID ${id} not found`);
    }

    return config;
  }

  async findByKey(key: string): Promise<SystemConfig> {
    const config = await this.repository.findOne({ where: { key } });

    if (!config) {
      throw new NotFoundException(`Config with key ${key} not found`);
    }

    return config;
  }

  async getValue(key: string, defaultValue?: any): Promise<any> {
    try {
      const config = await this.findByKey(key);

      if (config.dataType === 'JSON') {
        return JSON.parse(config.value);
      } else if (config.dataType === 'NUMBER') {
        return parseFloat(config.value);
      } else if (config.dataType === 'BOOLEAN') {
        return config.value.toLowerCase() === 'true';
      } else if (config.dataType === 'ARRAY') {
        return JSON.parse(config.value);
      }

      return config.value;
    } catch (error) {
      if (error instanceof NotFoundException && defaultValue !== undefined) {
        return defaultValue;
      }
      throw error;
    }
  }

  async setValue(
    key: string,
    value: any,
    updatedBy?: string,
  ): Promise<SystemConfig> {
    const config = await this.findByKey(key);

    if (!config.isEditable) {
      throw new BadRequestException('This configuration is not editable');
    }

    const oldValue = config.value;
    let stringValue: string;

    if (
      config.dataType === 'JSON' ||
      config.dataType === 'ARRAY' ||
      typeof value === 'object'
    ) {
      stringValue = JSON.stringify(value);
    } else {
      stringValue = String(value);
    }

    config.value = stringValue;
    config.updatedBy = updatedBy;
    config.lastModifiedBy = updatedBy;
    config.lastModifiedAt = new Date();

    const updated = await this.repository.save(config);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'UPDATE',
      description: `System config ${updated.key} value changed`,
      entityType: 'SystemConfig',
      entityId: updated.id,
      entityName: updated.name,
      oldValues: { value: oldValue },
      newValues: { value: updated.value },
    });

    return updated;
  }

  async update(
    id: string,
    updateDto: UpdateSystemConfigDto,
    updatedBy?: string,
  ): Promise<SystemConfig> {
    const config = await this.findOne(id);

    if (!config.isEditable) {
      throw new BadRequestException('This configuration is not editable');
    }

    const oldValues = { ...config };
    Object.assign(config, updateDto, {
      updatedBy,
      lastModifiedBy: updatedBy,
      lastModifiedAt: new Date(),
    });

    const updated = await this.repository.save(config);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'UPDATE',
      description: `System config ${updated.key} updated`,
      entityType: 'SystemConfig',
      entityId: updated.id,
      entityName: updated.name,
      oldValues,
      newValues: updated,
    });

    return updated;
  }

  async getByCategory(category: string): Promise<SystemConfig[]> {
    return await this.repository.find({
      where: { category },
      order: { key: 'ASC' },
    });
  }

  async getByModule(module: string): Promise<SystemConfig[]> {
    return await this.repository.find({
      where: { module },
      order: { key: 'ASC' },
    });
  }

  async remove(id: string): Promise<void> {
    const config = await this.findOne(id);

    if (config.isSystemConfig) {
      throw new BadRequestException('Cannot delete system configuration');
    }

    await this.repository.remove(config);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'DELETE',
      description: `System config ${config.key} deleted`,
      entityType: 'SystemConfig',
      entityId: id,
      entityName: config.name,
    });
  }
}
