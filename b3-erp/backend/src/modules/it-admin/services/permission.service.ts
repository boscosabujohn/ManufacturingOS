import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission } from '../entities/permission.entity';
import { CreatePermissionDto } from '../dto/create-permission.dto';
import { UpdatePermissionDto } from '../dto/update-permission.dto';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class PermissionService {
  constructor(
    @InjectRepository(Permission)
    private readonly repository: Repository<Permission>,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(
    createDto: CreatePermissionDto,
    createdBy?: string,
  ): Promise<Permission> {
    // Check if code already exists
    const existing = await this.repository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new ConflictException(
        `Permission with code ${createDto.code} already exists`,
      );
    }

    const permission = this.repository.create({
      ...createDto,
      createdBy,
    });

    const saved = await this.repository.save(permission);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'CREATE',
      description: `Permission ${saved.code} created`,
      entityType: 'Permission',
      entityId: saved.id,
      entityName: saved.name,
    });

    return saved;
  }

  async findAll(filters?: any): Promise<Permission[]> {
    const query = this.repository.createQueryBuilder('permission');

    if (filters?.module) {
      query.andWhere('permission.module = :module', { module: filters.module });
    }

    if (filters?.action) {
      query.andWhere('permission.action = :action', { action: filters.action });
    }

    if (filters?.category) {
      query.andWhere('permission.category = :category', {
        category: filters.category,
      });
    }

    if (filters?.status) {
      query.andWhere('permission.status = :status', { status: filters.status });
    }

    if (filters?.search) {
      query.andWhere(
        '(permission.code ILIKE :search OR permission.name ILIKE :search)',
        { search: `%${filters.search}%` },
      );
    }

    query.orderBy('permission.module', 'ASC').addOrderBy('permission.action', 'ASC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<Permission> {
    const permission = await this.repository.findOne({ where: { id } });

    if (!permission) {
      throw new NotFoundException(`Permission with ID ${id} not found`);
    }

    return permission;
  }

  async findByCode(code: string): Promise<Permission> {
    const permission = await this.repository.findOne({ where: { code } });

    if (!permission) {
      throw new NotFoundException(`Permission with code ${code} not found`);
    }

    return permission;
  }

  async findByModule(module: string): Promise<Permission[]> {
    return await this.repository.find({
      where: { module },
      order: { action: 'ASC' },
    });
  }

  async getModules(): Promise<string[]> {
    const result = await this.repository
      .createQueryBuilder('permission')
      .select('DISTINCT permission.module', 'module')
      .orderBy('permission.module', 'ASC')
      .getRawMany();

    return result.map((r) => r.module);
  }

  async getActions(): Promise<string[]> {
    const result = await this.repository
      .createQueryBuilder('permission')
      .select('DISTINCT permission.action', 'action')
      .orderBy('permission.action', 'ASC')
      .getRawMany();

    return result.map((r) => r.action);
  }

  async update(
    id: string,
    updateDto: UpdatePermissionDto,
    updatedBy?: string,
  ): Promise<Permission> {
    const permission = await this.findOne(id);

    // Prevent updating system permissions
    if (permission.isSystemPermission) {
      throw new BadRequestException('Cannot update system permissions');
    }

    const oldValues = { ...permission };
    Object.assign(permission, updateDto, { updatedBy });

    const updated = await this.repository.save(permission);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'UPDATE',
      description: `Permission ${updated.code} updated`,
      entityType: 'Permission',
      entityId: updated.id,
      entityName: updated.name,
      oldValues,
      newValues: updated,
    });

    return updated;
  }

  async bulkCreate(
    permissions: CreatePermissionDto[],
    createdBy?: string,
  ): Promise<Permission[]> {
    const created: Permission[] = [];

    for (const dto of permissions) {
      try {
        const permission = await this.create(dto, createdBy);
        created.push(permission);
      } catch (error) {
        // Skip if already exists
        if (!(error instanceof ConflictException)) {
          throw error;
        }
      }
    }

    return created;
  }

  async remove(id: string): Promise<void> {
    const permission = await this.findOne(id);

    // Prevent deleting system permissions
    if (permission.isSystemPermission) {
      throw new BadRequestException('Cannot delete system permissions');
    }

    await this.repository.remove(permission);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'DELETE',
      description: `Permission ${permission.code} deleted`,
      entityType: 'Permission',
      entityId: id,
      entityName: permission.name,
    });
  }
}
