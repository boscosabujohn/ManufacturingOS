import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role, RoleStatus, RoleType } from '../entities/role.entity';

@Injectable()
export class RoleSeederService implements OnModuleInit {
  private readonly logger = new Logger(RoleSeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedRoles();
  }

  async seedRoles(): Promise<void> {
    this.logger.log('Seeding system roles...');

    const roles = [
      {
        code: 'SUPER_ADMIN',
        name: 'Super Administrator',
        description: 'Full system access with all permissions. Can manage all modules, users, and system configurations.',
        roleType: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        hierarchyLevel: 1,
        isSystemRole: true,
        isDefault: false,
        applicableModules: ['*'],
        restrictions: {
          dataAccess: 'all',
          sessionTimeout: 480, // 8 hours
        },
        metadata: {
          color: '#DC2626',
          icon: 'ShieldAlert',
          canDelegate: true,
          canCreateRoles: true,
        },
        createdBy: 'system',
      },
      {
        code: 'ADMIN',
        name: 'Administrator',
        description: 'Administrative access to manage users, roles, and module configurations. Cannot modify system-level settings.',
        roleType: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        hierarchyLevel: 2,
        isSystemRole: true,
        isDefault: false,
        applicableModules: ['hr', 'sales', 'finance', 'production', 'inventory', 'procurement', 'quality', 'logistics', 'reports'],
        restrictions: {
          dataAccess: 'all',
          sessionTimeout: 480,
        },
        metadata: {
          color: '#EA580C',
          icon: 'Shield',
          canDelegate: true,
          canCreateRoles: true,
        },
        createdBy: 'system',
      },
      {
        code: 'MANAGER',
        name: 'Manager',
        description: 'Department manager with approval authority. Can view, create, edit, and approve within assigned modules.',
        roleType: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        hierarchyLevel: 3,
        isSystemRole: true,
        isDefault: false,
        applicableModules: ['hr', 'sales', 'finance', 'production', 'inventory', 'procurement', 'quality', 'logistics', 'reports'],
        restrictions: {
          dataAccess: 'department',
          sessionTimeout: 240, // 4 hours
        },
        metadata: {
          color: '#CA8A04',
          icon: 'UserCog',
          canDelegate: true,
          canCreateRoles: false,
        },
        createdBy: 'system',
      },
      {
        code: 'SUPERVISOR',
        name: 'Supervisor',
        description: 'Team supervisor with limited approval authority. Can manage team members and their work assignments.',
        roleType: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        hierarchyLevel: 4,
        isSystemRole: true,
        isDefault: false,
        applicableModules: ['hr', 'sales', 'production', 'inventory', 'quality', 'logistics', 'reports'],
        restrictions: {
          dataAccess: 'department',
          sessionTimeout: 240,
        },
        metadata: {
          color: '#16A34A',
          icon: 'Users',
          canDelegate: false,
          canCreateRoles: false,
        },
        createdBy: 'system',
      },
      {
        code: 'EXECUTIVE',
        name: 'Executive',
        description: 'Executive user with create and edit permissions. Can perform day-to-day operations within assigned modules.',
        roleType: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        hierarchyLevel: 5,
        isSystemRole: true,
        isDefault: true,
        applicableModules: ['hr', 'sales', 'production', 'inventory', 'quality', 'logistics', 'reports'],
        restrictions: {
          dataAccess: 'own',
          sessionTimeout: 120, // 2 hours
        },
        metadata: {
          color: '#2563EB',
          icon: 'User',
          canDelegate: false,
          canCreateRoles: false,
        },
        createdBy: 'system',
      },
      {
        code: 'OPERATOR',
        name: 'Operator',
        description: 'Operational user with limited create and edit permissions. Primarily used for data entry and basic operations.',
        roleType: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        hierarchyLevel: 6,
        isSystemRole: true,
        isDefault: false,
        applicableModules: ['production', 'inventory', 'quality', 'logistics'],
        restrictions: {
          dataAccess: 'own',
          sessionTimeout: 120,
        },
        metadata: {
          color: '#7C3AED',
          icon: 'Wrench',
          canDelegate: false,
          canCreateRoles: false,
        },
        createdBy: 'system',
      },
      {
        code: 'VIEWER',
        name: 'Viewer',
        description: 'Read-only access to view data across assigned modules. Cannot create, edit, or delete any records.',
        roleType: RoleType.SYSTEM,
        status: RoleStatus.ACTIVE,
        hierarchyLevel: 7,
        isSystemRole: true,
        isDefault: false,
        applicableModules: ['hr', 'sales', 'finance', 'production', 'inventory', 'procurement', 'quality', 'logistics', 'reports'],
        restrictions: {
          dataAccess: 'department',
          sessionTimeout: 60, // 1 hour
        },
        metadata: {
          color: '#64748B',
          icon: 'Eye',
          canDelegate: false,
          canCreateRoles: false,
        },
        createdBy: 'system',
      },
    ];

    for (const role of roles) {
      try {
        const existing = await this.roleRepository.findOne({
          where: { code: role.code },
        });
        if (!existing) {
          await this.roleRepository.save(role);
          this.logger.log(`Created role: ${role.name} (Level ${role.hierarchyLevel})`);
        } else {
          this.logger.debug(`Role already exists: ${role.code}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed role ${role.name}: ${error.message}`);
      }
    }

    this.logger.log('System roles seeding completed');
  }
}
