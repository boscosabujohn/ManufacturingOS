import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Role } from '../entities/role.entity';
import { Permission } from '../entities/permission.entity';
import { RolePermission } from '../entities/role-permission.entity';

interface RolePermissionMapping {
  roleCode: string;
  permissionCodes: string[];
}

@Injectable()
export class RolePermissionSeederService implements OnModuleInit {
  private readonly logger = new Logger(RolePermissionSeederService.name);

  constructor(
    @InjectRepository(Role)
    private readonly roleRepository: Repository<Role>,
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
    @InjectRepository(RolePermission)
    private readonly rolePermissionRepository: Repository<RolePermission>,
  ) {}

  async onModuleInit(): Promise<void> {
    // Delay to ensure roles and permissions are seeded first
    setTimeout(() => this.seedRolePermissions(), 2000);
  }

  async seedRolePermissions(): Promise<void> {
    this.logger.log('Seeding role-permission mappings...');

    // Define role-permission mappings
    const rolePermissionMappings: RolePermissionMapping[] = [
      {
        // SUPER_ADMIN gets all permissions
        roleCode: 'SUPER_ADMIN',
        permissionCodes: [
          'HR_VIEW', 'HR_CREATE', 'HR_EDIT', 'HR_DELETE', 'HR_APPROVE',
          'SALES_VIEW', 'SALES_CREATE', 'SALES_EDIT', 'SALES_DELETE', 'SALES_APPROVE',
          'FINANCE_VIEW', 'FINANCE_CREATE', 'FINANCE_EDIT', 'FINANCE_DELETE', 'FINANCE_APPROVE',
          'PRODUCTION_VIEW', 'PRODUCTION_CREATE', 'PRODUCTION_EDIT', 'PRODUCTION_DELETE',
          'INVENTORY_VIEW', 'INVENTORY_CREATE', 'INVENTORY_EDIT', 'INVENTORY_DELETE',
          'PROCUREMENT_VIEW', 'PROCUREMENT_CREATE', 'PROCUREMENT_EDIT', 'PROCUREMENT_DELETE', 'PROCUREMENT_APPROVE',
          'QUALITY_VIEW', 'QUALITY_CREATE', 'QUALITY_EDIT', 'QUALITY_DELETE',
          'LOGISTICS_VIEW', 'LOGISTICS_CREATE', 'LOGISTICS_EDIT', 'LOGISTICS_DELETE',
          'ADMIN_VIEW', 'ADMIN_CREATE', 'ADMIN_EDIT', 'ADMIN_DELETE',
          'REPORTS_VIEW', 'REPORTS_CREATE', 'REPORTS_EXPORT',
        ],
      },
      {
        // ADMIN gets most permissions except system admin delete
        roleCode: 'ADMIN',
        permissionCodes: [
          'HR_VIEW', 'HR_CREATE', 'HR_EDIT', 'HR_DELETE', 'HR_APPROVE',
          'SALES_VIEW', 'SALES_CREATE', 'SALES_EDIT', 'SALES_DELETE', 'SALES_APPROVE',
          'FINANCE_VIEW', 'FINANCE_CREATE', 'FINANCE_EDIT', 'FINANCE_APPROVE',
          'PRODUCTION_VIEW', 'PRODUCTION_CREATE', 'PRODUCTION_EDIT', 'PRODUCTION_DELETE',
          'INVENTORY_VIEW', 'INVENTORY_CREATE', 'INVENTORY_EDIT', 'INVENTORY_DELETE',
          'PROCUREMENT_VIEW', 'PROCUREMENT_CREATE', 'PROCUREMENT_EDIT', 'PROCUREMENT_DELETE', 'PROCUREMENT_APPROVE',
          'QUALITY_VIEW', 'QUALITY_CREATE', 'QUALITY_EDIT', 'QUALITY_DELETE',
          'LOGISTICS_VIEW', 'LOGISTICS_CREATE', 'LOGISTICS_EDIT', 'LOGISTICS_DELETE',
          'ADMIN_VIEW', 'ADMIN_CREATE', 'ADMIN_EDIT',
          'REPORTS_VIEW', 'REPORTS_CREATE', 'REPORTS_EXPORT',
        ],
      },
      {
        // MANAGER gets view, create, edit, and approve permissions
        roleCode: 'MANAGER',
        permissionCodes: [
          'HR_VIEW', 'HR_CREATE', 'HR_EDIT', 'HR_APPROVE',
          'SALES_VIEW', 'SALES_CREATE', 'SALES_EDIT', 'SALES_APPROVE',
          'FINANCE_VIEW', 'FINANCE_CREATE', 'FINANCE_EDIT', 'FINANCE_APPROVE',
          'PRODUCTION_VIEW', 'PRODUCTION_CREATE', 'PRODUCTION_EDIT',
          'INVENTORY_VIEW', 'INVENTORY_CREATE', 'INVENTORY_EDIT',
          'PROCUREMENT_VIEW', 'PROCUREMENT_CREATE', 'PROCUREMENT_EDIT', 'PROCUREMENT_APPROVE',
          'QUALITY_VIEW', 'QUALITY_CREATE', 'QUALITY_EDIT',
          'LOGISTICS_VIEW', 'LOGISTICS_CREATE', 'LOGISTICS_EDIT',
          'REPORTS_VIEW', 'REPORTS_CREATE', 'REPORTS_EXPORT',
        ],
      },
      {
        // SUPERVISOR gets view, create, and edit permissions
        roleCode: 'SUPERVISOR',
        permissionCodes: [
          'HR_VIEW', 'HR_CREATE', 'HR_EDIT',
          'SALES_VIEW', 'SALES_CREATE', 'SALES_EDIT',
          'PRODUCTION_VIEW', 'PRODUCTION_CREATE', 'PRODUCTION_EDIT',
          'INVENTORY_VIEW', 'INVENTORY_CREATE', 'INVENTORY_EDIT',
          'QUALITY_VIEW', 'QUALITY_CREATE', 'QUALITY_EDIT',
          'LOGISTICS_VIEW', 'LOGISTICS_CREATE', 'LOGISTICS_EDIT',
          'REPORTS_VIEW', 'REPORTS_EXPORT',
        ],
      },
      {
        // EXECUTIVE gets view, create, and limited edit permissions
        roleCode: 'EXECUTIVE',
        permissionCodes: [
          'HR_VIEW', 'HR_CREATE', 'HR_EDIT',
          'SALES_VIEW', 'SALES_CREATE', 'SALES_EDIT',
          'PRODUCTION_VIEW', 'PRODUCTION_CREATE', 'PRODUCTION_EDIT',
          'INVENTORY_VIEW', 'INVENTORY_CREATE', 'INVENTORY_EDIT',
          'QUALITY_VIEW', 'QUALITY_CREATE', 'QUALITY_EDIT',
          'LOGISTICS_VIEW', 'LOGISTICS_CREATE', 'LOGISTICS_EDIT',
          'REPORTS_VIEW',
        ],
      },
      {
        // OPERATOR gets view and create for operational modules
        roleCode: 'OPERATOR',
        permissionCodes: [
          'PRODUCTION_VIEW', 'PRODUCTION_CREATE', 'PRODUCTION_EDIT',
          'INVENTORY_VIEW', 'INVENTORY_CREATE',
          'QUALITY_VIEW', 'QUALITY_CREATE',
          'LOGISTICS_VIEW', 'LOGISTICS_CREATE',
        ],
      },
      {
        // VIEWER gets only view permissions
        roleCode: 'VIEWER',
        permissionCodes: [
          'HR_VIEW',
          'SALES_VIEW',
          'FINANCE_VIEW',
          'PRODUCTION_VIEW',
          'INVENTORY_VIEW',
          'PROCUREMENT_VIEW',
          'QUALITY_VIEW',
          'LOGISTICS_VIEW',
          'REPORTS_VIEW',
        ],
      },
    ];

    for (const mapping of rolePermissionMappings) {
      try {
        // Find the role
        const role = await this.roleRepository.findOne({
          where: { code: mapping.roleCode },
        });

        if (!role) {
          this.logger.warn(`Role not found: ${mapping.roleCode}, skipping...`);
          continue;
        }

        // Process each permission for this role
        for (const permissionCode of mapping.permissionCodes) {
          const permission = await this.permissionRepository.findOne({
            where: { code: permissionCode },
          });

          if (!permission) {
            this.logger.debug(`Permission not found: ${permissionCode}, skipping...`);
            continue;
          }

          // Check if mapping already exists
          const existing = await this.rolePermissionRepository.findOne({
            where: {
              roleId: role.id,
              permissionId: permission.id,
            },
          });

          if (!existing) {
            const rolePermission = this.rolePermissionRepository.create({
              roleId: role.id,
              permissionId: permission.id,
              isGranted: true,
              grantedAt: new Date(),
              grantedBy: 'system',
              constraints: {
                dataScope: this.getDataScopeForRole(mapping.roleCode),
              },
              metadata: {
                seededAt: new Date().toISOString(),
                source: 'system-seeder',
              },
              createdBy: 'system',
            });
            await this.rolePermissionRepository.save(rolePermission);
            this.logger.debug(`Mapped permission ${permissionCode} to role ${mapping.roleCode}`);
          }
        }

        this.logger.log(`Completed permission mapping for role: ${mapping.roleCode}`);
      } catch (error) {
        this.logger.error(`Failed to seed permissions for role ${mapping.roleCode}: ${error.message}`);
      }
    }

    this.logger.log('Role-permission mappings seeding completed');
  }

  private getDataScopeForRole(roleCode: string): string {
    switch (roleCode) {
      case 'SUPER_ADMIN':
      case 'ADMIN':
        return 'all';
      case 'MANAGER':
      case 'SUPERVISOR':
      case 'VIEWER':
        return 'department';
      case 'EXECUTIVE':
      case 'OPERATOR':
        return 'own';
      default:
        return 'own';
    }
  }
}
