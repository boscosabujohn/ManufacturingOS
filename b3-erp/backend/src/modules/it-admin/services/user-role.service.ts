import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserRole, UserRoleStatus } from '../entities/user-role.entity';

@Injectable()
export class UserRoleService {
  constructor(
    @InjectRepository(UserRole)
    private readonly repository: Repository<UserRole>,
  ) {}

  async assignRoles(
    userId: string,
    roleIds: string[],
    assignedBy?: string,
    primaryRoleId?: string,
  ): Promise<UserRole[]> {
    const userRoles: UserRole[] = [];

    for (const roleId of roleIds) {
      // Check if already assigned
      let userRole = await this.repository.findOne({
        where: { userId, roleId },
      });

      if (!userRole) {
        userRole = this.repository.create({
          userId,
          roleId,
          status: UserRoleStatus.ACTIVE,
          assignedAt: new Date(),
          assignedBy,
          effectiveFrom: new Date(),
          isPrimary: primaryRoleId ? roleId === primaryRoleId : roleIds.indexOf(roleId) === 0,
        });
      } else {
        userRole.status = UserRoleStatus.ACTIVE;
        userRole.assignedAt = new Date();
        userRole.assignedBy = assignedBy;
        userRole.isPrimary = primaryRoleId ? roleId === primaryRoleId : false;
      }

      const saved = await this.repository.save(userRole);
      userRoles.push(saved);
    }

    return userRoles;
  }

  async revokeRoles(
    userId: string,
    roleIds: string[],
    revokedBy?: string,
    reason?: string,
  ): Promise<void> {
    const userRoles = await this.repository.find({
      where: { userId, roleId: In(roleIds) },
    });

    for (const userRole of userRoles) {
      userRole.status = UserRoleStatus.INACTIVE;
      userRole.revokedAt = new Date();
      userRole.revokedBy = revokedBy;
      userRole.revokedReason = reason;
      await this.repository.save(userRole);
    }
  }

  async getRolesByUser(userId: string): Promise<UserRole[]> {
    return await this.repository.find({
      where: { userId, status: UserRoleStatus.ACTIVE },
      relations: ['role', 'role.rolePermissions', 'role.rolePermissions.permission'],
    });
  }

  async getUsersByRole(roleId: string): Promise<UserRole[]> {
    return await this.repository.find({
      where: { roleId, status: UserRoleStatus.ACTIVE },
      relations: ['user'],
    });
  }

  async hasRole(userId: string, roleId: string): Promise<boolean> {
    const userRole = await this.repository.findOne({
      where: { userId, roleId, status: UserRoleStatus.ACTIVE },
    });

    return !!userRole;
  }

  async getPrimaryRole(userId: string): Promise<UserRole | null> {
    return await this.repository.findOne({
      where: { userId, isPrimary: true, status: UserRoleStatus.ACTIVE },
      relations: ['role'],
    });
  }
}
