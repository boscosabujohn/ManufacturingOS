import {
  Injectable,
  NotFoundException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleStatus } from '../entities/role.entity';
import { CreateRoleDto } from '../dto/create-role.dto';
import { UpdateRoleDto } from '../dto/update-role.dto';
import { RolePermissionService } from './role-permission.service';
import { AuditLogService } from './audit-log.service';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role)
    private readonly repository: Repository<Role>,
    private readonly rolePermissionService: RolePermissionService,
    private readonly auditLogService: AuditLogService,
  ) {}

  async create(createDto: CreateRoleDto, createdBy?: string): Promise<Role> {
    // Check if code already exists
    const existing = await this.repository.findOne({
      where: { code: createDto.code },
    });

    if (existing) {
      throw new ConflictException(`Role with code ${createDto.code} already exists`);
    }

    // If parent role specified, verify hierarchy
    if (createDto.parentRoleId) {
      const parent = await this.repository.findOne({
        where: { id: createDto.parentRoleId },
      });

      if (!parent) {
        throw new NotFoundException('Parent role not found');
      }

      createDto.hierarchyLevel = parent.hierarchyLevel + 1;
    }

    const role = this.repository.create({
      ...createDto,
      createdBy,
    });

    const saved = await this.repository.save(role);

    // Assign permissions if provided
    if (createDto.permissionIds && createDto.permissionIds.length > 0) {
      await this.rolePermissionService.assignPermissions(
        saved.id,
        createDto.permissionIds,
        createdBy,
      );
    }

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'CREATE',
      description: `Role ${saved.code} created`,
      entityType: 'Role',
      entityId: saved.id,
      entityName: saved.name,
    });

    return saved;
  }

  async findAll(filters?: any): Promise<Role[]> {
    const query = this.repository.createQueryBuilder('role');

    if (filters?.status) {
      query.andWhere('role.status = :status', { status: filters.status });
    }

    if (filters?.roleType) {
      query.andWhere('role.roleType = :roleType', {
        roleType: filters.roleType,
      });
    }

    if (filters?.search) {
      query.andWhere('(role.code ILIKE :search OR role.name ILIKE :search)', {
        search: `%${filters.search}%`,
      });
    }

    query.orderBy('role.hierarchyLevel', 'ASC').addOrderBy('role.name', 'ASC');

    return await query.getMany();
  }

  async findOne(id: string): Promise<Role> {
    const role = await this.repository.findOne({
      where: { id },
      relations: ['rolePermissions', 'rolePermissions.permission', 'childRoles'],
    });

    if (!role) {
      throw new NotFoundException(`Role with ID ${id} not found`);
    }

    return role;
  }

  async findByCode(code: string): Promise<Role> {
    const role = await this.repository.findOne({
      where: { code },
      relations: ['rolePermissions', 'rolePermissions.permission'],
    });

    if (!role) {
      throw new NotFoundException(`Role with code ${code} not found`);
    }

    return role;
  }

  async update(
    id: string,
    updateDto: UpdateRoleDto,
    updatedBy?: string,
  ): Promise<Role> {
    const role = await this.findOne(id);

    // Prevent updating system roles
    if (role.isSystemRole) {
      throw new BadRequestException('Cannot update system roles');
    }

    const oldValues = { ...role };
    Object.assign(role, updateDto, { updatedBy });

    const updated = await this.repository.save(role);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'UPDATE',
      description: `Role ${updated.code} updated`,
      entityType: 'Role',
      entityId: updated.id,
      entityName: updated.name,
      oldValues,
      newValues: updated,
    });

    return updated;
  }

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
    assignedBy?: string,
  ): Promise<{ message: string }> {
    const role = await this.findOne(roleId);

    await this.rolePermissionService.assignPermissions(
      roleId,
      permissionIds,
      assignedBy,
    );

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'UPDATE',
      description: `Permissions assigned to role ${role.code}`,
      entityType: 'Role',
      entityId: roleId,
      entityName: role.name,
      additionalData: { permissionIds },
    });

    return { message: 'Permissions assigned successfully' };
  }

  async revokePermissions(
    roleId: string,
    permissionIds: string[],
    revokedBy?: string,
  ): Promise<{ message: string }> {
    const role = await this.findOne(roleId);

    await this.rolePermissionService.revokePermissions(roleId, permissionIds);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'UPDATE',
      description: `Permissions revoked from role ${role.code}`,
      entityType: 'Role',
      entityId: roleId,
      entityName: role.name,
      additionalData: { permissionIds },
    });

    return { message: 'Permissions revoked successfully' };
  }

  async getHierarchy(): Promise<Role[]> {
    const roles = await this.repository.find({
      where: { status: RoleStatus.ACTIVE },
      order: { hierarchyLevel: 'ASC', name: 'ASC' },
    });

    return roles;
  }

  async remove(id: string): Promise<void> {
    const role = await this.findOne(id);

    // Prevent deleting system roles
    if (role.isSystemRole) {
      throw new BadRequestException('Cannot delete system roles');
    }

    // Check if role has users
    if (role.userCount > 0) {
      throw new BadRequestException(
        'Cannot delete role that is assigned to users',
      );
    }

    await this.repository.remove(role);

    // Log audit
    await this.auditLogService.log({
      module: 'it-admin',
      action: 'DELETE',
      description: `Role ${role.code} deleted`,
      entityType: 'Role',
      entityId: id,
      entityName: role.name,
    });
  }
}
