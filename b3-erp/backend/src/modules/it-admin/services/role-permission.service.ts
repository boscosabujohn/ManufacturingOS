import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { RolePermission } from '../entities/role-permission.entity';

@Injectable()
export class RolePermissionService {
  constructor(
    @InjectRepository(RolePermission)
    private readonly repository: Repository<RolePermission>,
  ) {}

  async assignPermissions(
    roleId: string,
    permissionIds: string[],
    grantedBy?: string,
  ): Promise<RolePermission[]> {
    const rolePermissions: RolePermission[] = [];

    for (const permissionId of permissionIds) {
      // Check if already assigned
      let rolePermission = await this.repository.findOne({
        where: { roleId, permissionId },
      });

      if (!rolePermission) {
        rolePermission = this.repository.create({
          roleId,
          permissionId,
          isGranted: true,
          grantedAt: new Date(),
          grantedBy,
        });
      } else {
        rolePermission.isGranted = true;
        rolePermission.grantedAt = new Date();
        rolePermission.grantedBy = grantedBy;
      }

      const saved = await this.repository.save(rolePermission);
      rolePermissions.push(saved);
    }

    return rolePermissions;
  }

  async revokePermissions(
    roleId: string,
    permissionIds: string[],
  ): Promise<void> {
    await this.repository.delete({
      roleId,
      permissionId: In(permissionIds),
    });
  }

  async getPermissionsByRole(roleId: string): Promise<RolePermission[]> {
    return await this.repository.find({
      where: { roleId, isGranted: true },
      relations: ['permission'],
    });
  }

  async getRolesByPermission(permissionId: string): Promise<RolePermission[]> {
    return await this.repository.find({
      where: { permissionId, isGranted: true },
      relations: ['role'],
    });
  }

  async hasPermission(
    roleId: string,
    permissionId: string,
  ): Promise<boolean> {
    const rolePermission = await this.repository.findOne({
      where: { roleId, permissionId, isGranted: true },
    });

    return !!rolePermission;
  }
}
