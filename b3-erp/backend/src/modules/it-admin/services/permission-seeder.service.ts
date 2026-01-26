import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Permission, PermissionStatus, PermissionType } from '../entities/permission.entity';

interface PermissionDefinition {
  code: string;
  module: string;
  action: string;
  name: string;
  description: string;
  category: string;
  apiEndpoint?: string;
  httpMethod?: string;
  requiresApproval?: boolean;
  dependsOn?: string[];
}

@Injectable()
export class PermissionSeederService implements OnModuleInit {
  private readonly logger = new Logger(PermissionSeederService.name);

  constructor(
    @InjectRepository(Permission)
    private readonly permissionRepository: Repository<Permission>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedPermissions();
  }

  async seedPermissions(): Promise<void> {
    this.logger.log('Seeding system permissions...');

    const permissions: PermissionDefinition[] = [
      // HR Module Permissions
      {
        code: 'HR_VIEW',
        module: 'hr',
        action: 'view',
        name: 'HR View',
        description: 'View HR records including employees, departments, and organizational structure',
        category: 'HR',
        apiEndpoint: '/api/hr/*',
        httpMethod: 'GET',
      },
      {
        code: 'HR_CREATE',
        module: 'hr',
        action: 'create',
        name: 'HR Create',
        description: 'Create new HR records including employees, departments, and positions',
        category: 'HR',
        apiEndpoint: '/api/hr/*',
        httpMethod: 'POST',
        dependsOn: ['HR_VIEW'],
      },
      {
        code: 'HR_EDIT',
        module: 'hr',
        action: 'edit',
        name: 'HR Edit',
        description: 'Edit existing HR records including employee details and department structures',
        category: 'HR',
        apiEndpoint: '/api/hr/*',
        httpMethod: 'PUT',
        dependsOn: ['HR_VIEW'],
      },
      {
        code: 'HR_DELETE',
        module: 'hr',
        action: 'delete',
        name: 'HR Delete',
        description: 'Delete HR records (soft delete with audit trail)',
        category: 'HR',
        apiEndpoint: '/api/hr/*',
        httpMethod: 'DELETE',
        dependsOn: ['HR_VIEW', 'HR_EDIT'],
        requiresApproval: true,
      },
      {
        code: 'HR_APPROVE',
        module: 'hr',
        action: 'approve',
        name: 'HR Approve',
        description: 'Approve HR requests including leave, attendance, and personnel changes',
        category: 'HR',
        apiEndpoint: '/api/hr/*/approve',
        httpMethod: 'POST',
        dependsOn: ['HR_VIEW'],
        requiresApproval: false,
      },

      // Sales Module Permissions
      {
        code: 'SALES_VIEW',
        module: 'sales',
        action: 'view',
        name: 'Sales View',
        description: 'View sales records including orders, quotations, and customer information',
        category: 'Sales',
        apiEndpoint: '/api/sales/*',
        httpMethod: 'GET',
      },
      {
        code: 'SALES_CREATE',
        module: 'sales',
        action: 'create',
        name: 'Sales Create',
        description: 'Create new sales orders, quotations, and customer records',
        category: 'Sales',
        apiEndpoint: '/api/sales/*',
        httpMethod: 'POST',
        dependsOn: ['SALES_VIEW'],
      },
      {
        code: 'SALES_EDIT',
        module: 'sales',
        action: 'edit',
        name: 'Sales Edit',
        description: 'Edit existing sales orders and quotations',
        category: 'Sales',
        apiEndpoint: '/api/sales/*',
        httpMethod: 'PUT',
        dependsOn: ['SALES_VIEW'],
      },
      {
        code: 'SALES_DELETE',
        module: 'sales',
        action: 'delete',
        name: 'Sales Delete',
        description: 'Delete or cancel sales orders (with audit trail)',
        category: 'Sales',
        apiEndpoint: '/api/sales/*',
        httpMethod: 'DELETE',
        dependsOn: ['SALES_VIEW', 'SALES_EDIT'],
        requiresApproval: true,
      },
      {
        code: 'SALES_APPROVE',
        module: 'sales',
        action: 'approve',
        name: 'Sales Approve',
        description: 'Approve sales orders, discounts, and quotations',
        category: 'Sales',
        apiEndpoint: '/api/sales/*/approve',
        httpMethod: 'POST',
        dependsOn: ['SALES_VIEW'],
        requiresApproval: false,
      },

      // Finance Module Permissions
      {
        code: 'FINANCE_VIEW',
        module: 'finance',
        action: 'view',
        name: 'Finance View',
        description: 'View financial records including invoices, payments, and accounts',
        category: 'Finance',
        apiEndpoint: '/api/finance/*',
        httpMethod: 'GET',
      },
      {
        code: 'FINANCE_CREATE',
        module: 'finance',
        action: 'create',
        name: 'Finance Create',
        description: 'Create financial entries including invoices and payment records',
        category: 'Finance',
        apiEndpoint: '/api/finance/*',
        httpMethod: 'POST',
        dependsOn: ['FINANCE_VIEW'],
      },
      {
        code: 'FINANCE_EDIT',
        module: 'finance',
        action: 'edit',
        name: 'Finance Edit',
        description: 'Edit financial records (with audit trail)',
        category: 'Finance',
        apiEndpoint: '/api/finance/*',
        httpMethod: 'PUT',
        dependsOn: ['FINANCE_VIEW'],
      },
      {
        code: 'FINANCE_DELETE',
        module: 'finance',
        action: 'delete',
        name: 'Finance Delete',
        description: 'Delete or void financial records (requires approval)',
        category: 'Finance',
        apiEndpoint: '/api/finance/*',
        httpMethod: 'DELETE',
        dependsOn: ['FINANCE_VIEW', 'FINANCE_EDIT'],
        requiresApproval: true,
      },
      {
        code: 'FINANCE_APPROVE',
        module: 'finance',
        action: 'approve',
        name: 'Finance Approve',
        description: 'Approve financial transactions, payments, and journal entries',
        category: 'Finance',
        apiEndpoint: '/api/finance/*/approve',
        httpMethod: 'POST',
        dependsOn: ['FINANCE_VIEW'],
        requiresApproval: false,
      },

      // Production Module Permissions
      {
        code: 'PRODUCTION_VIEW',
        module: 'production',
        action: 'view',
        name: 'Production View',
        description: 'View production orders, schedules, and manufacturing data',
        category: 'Operations',
        apiEndpoint: '/api/production/*',
        httpMethod: 'GET',
      },
      {
        code: 'PRODUCTION_CREATE',
        module: 'production',
        action: 'create',
        name: 'Production Create',
        description: 'Create production orders and manufacturing schedules',
        category: 'Operations',
        apiEndpoint: '/api/production/*',
        httpMethod: 'POST',
        dependsOn: ['PRODUCTION_VIEW'],
      },
      {
        code: 'PRODUCTION_EDIT',
        module: 'production',
        action: 'edit',
        name: 'Production Edit',
        description: 'Edit production orders and update manufacturing status',
        category: 'Operations',
        apiEndpoint: '/api/production/*',
        httpMethod: 'PUT',
        dependsOn: ['PRODUCTION_VIEW'],
      },
      {
        code: 'PRODUCTION_DELETE',
        module: 'production',
        action: 'delete',
        name: 'Production Delete',
        description: 'Cancel or delete production orders',
        category: 'Operations',
        apiEndpoint: '/api/production/*',
        httpMethod: 'DELETE',
        dependsOn: ['PRODUCTION_VIEW', 'PRODUCTION_EDIT'],
        requiresApproval: true,
      },

      // Inventory Module Permissions
      {
        code: 'INVENTORY_VIEW',
        module: 'inventory',
        action: 'view',
        name: 'Inventory View',
        description: 'View inventory levels, stock movements, and warehouse data',
        category: 'Operations',
        apiEndpoint: '/api/inventory/*',
        httpMethod: 'GET',
      },
      {
        code: 'INVENTORY_CREATE',
        module: 'inventory',
        action: 'create',
        name: 'Inventory Create',
        description: 'Create inventory items and stock entries',
        category: 'Operations',
        apiEndpoint: '/api/inventory/*',
        httpMethod: 'POST',
        dependsOn: ['INVENTORY_VIEW'],
      },
      {
        code: 'INVENTORY_EDIT',
        module: 'inventory',
        action: 'edit',
        name: 'Inventory Edit',
        description: 'Edit inventory records and adjust stock levels',
        category: 'Operations',
        apiEndpoint: '/api/inventory/*',
        httpMethod: 'PUT',
        dependsOn: ['INVENTORY_VIEW'],
      },
      {
        code: 'INVENTORY_DELETE',
        module: 'inventory',
        action: 'delete',
        name: 'Inventory Delete',
        description: 'Delete inventory items (with proper reconciliation)',
        category: 'Operations',
        apiEndpoint: '/api/inventory/*',
        httpMethod: 'DELETE',
        dependsOn: ['INVENTORY_VIEW', 'INVENTORY_EDIT'],
        requiresApproval: true,
      },

      // Procurement Module Permissions
      {
        code: 'PROCUREMENT_VIEW',
        module: 'procurement',
        action: 'view',
        name: 'Procurement View',
        description: 'View purchase orders, vendor information, and procurement data',
        category: 'Procurement',
        apiEndpoint: '/api/procurement/*',
        httpMethod: 'GET',
      },
      {
        code: 'PROCUREMENT_CREATE',
        module: 'procurement',
        action: 'create',
        name: 'Procurement Create',
        description: 'Create purchase orders and vendor records',
        category: 'Procurement',
        apiEndpoint: '/api/procurement/*',
        httpMethod: 'POST',
        dependsOn: ['PROCUREMENT_VIEW'],
      },
      {
        code: 'PROCUREMENT_EDIT',
        module: 'procurement',
        action: 'edit',
        name: 'Procurement Edit',
        description: 'Edit purchase orders and vendor information',
        category: 'Procurement',
        apiEndpoint: '/api/procurement/*',
        httpMethod: 'PUT',
        dependsOn: ['PROCUREMENT_VIEW'],
      },
      {
        code: 'PROCUREMENT_DELETE',
        module: 'procurement',
        action: 'delete',
        name: 'Procurement Delete',
        description: 'Cancel or delete purchase orders',
        category: 'Procurement',
        apiEndpoint: '/api/procurement/*',
        httpMethod: 'DELETE',
        dependsOn: ['PROCUREMENT_VIEW', 'PROCUREMENT_EDIT'],
        requiresApproval: true,
      },
      {
        code: 'PROCUREMENT_APPROVE',
        module: 'procurement',
        action: 'approve',
        name: 'Procurement Approve',
        description: 'Approve purchase orders and procurement requests',
        category: 'Procurement',
        apiEndpoint: '/api/procurement/*/approve',
        httpMethod: 'POST',
        dependsOn: ['PROCUREMENT_VIEW'],
        requiresApproval: false,
      },

      // Quality Module Permissions
      {
        code: 'QUALITY_VIEW',
        module: 'quality',
        action: 'view',
        name: 'Quality View',
        description: 'View quality control records, inspections, and compliance data',
        category: 'Operations',
        apiEndpoint: '/api/quality/*',
        httpMethod: 'GET',
      },
      {
        code: 'QUALITY_CREATE',
        module: 'quality',
        action: 'create',
        name: 'Quality Create',
        description: 'Create quality inspections and compliance records',
        category: 'Operations',
        apiEndpoint: '/api/quality/*',
        httpMethod: 'POST',
        dependsOn: ['QUALITY_VIEW'],
      },
      {
        code: 'QUALITY_EDIT',
        module: 'quality',
        action: 'edit',
        name: 'Quality Edit',
        description: 'Edit quality records and inspection results',
        category: 'Operations',
        apiEndpoint: '/api/quality/*',
        httpMethod: 'PUT',
        dependsOn: ['QUALITY_VIEW'],
      },
      {
        code: 'QUALITY_DELETE',
        module: 'quality',
        action: 'delete',
        name: 'Quality Delete',
        description: 'Delete quality records (with audit trail)',
        category: 'Operations',
        apiEndpoint: '/api/quality/*',
        httpMethod: 'DELETE',
        dependsOn: ['QUALITY_VIEW', 'QUALITY_EDIT'],
        requiresApproval: true,
      },

      // Logistics Module Permissions
      {
        code: 'LOGISTICS_VIEW',
        module: 'logistics',
        action: 'view',
        name: 'Logistics View',
        description: 'View shipping, delivery, and logistics information',
        category: 'Operations',
        apiEndpoint: '/api/logistics/*',
        httpMethod: 'GET',
      },
      {
        code: 'LOGISTICS_CREATE',
        module: 'logistics',
        action: 'create',
        name: 'Logistics Create',
        description: 'Create shipments and delivery schedules',
        category: 'Operations',
        apiEndpoint: '/api/logistics/*',
        httpMethod: 'POST',
        dependsOn: ['LOGISTICS_VIEW'],
      },
      {
        code: 'LOGISTICS_EDIT',
        module: 'logistics',
        action: 'edit',
        name: 'Logistics Edit',
        description: 'Edit shipment details and delivery information',
        category: 'Operations',
        apiEndpoint: '/api/logistics/*',
        httpMethod: 'PUT',
        dependsOn: ['LOGISTICS_VIEW'],
      },
      {
        code: 'LOGISTICS_DELETE',
        module: 'logistics',
        action: 'delete',
        name: 'Logistics Delete',
        description: 'Cancel or delete shipment records',
        category: 'Operations',
        apiEndpoint: '/api/logistics/*',
        httpMethod: 'DELETE',
        dependsOn: ['LOGISTICS_VIEW', 'LOGISTICS_EDIT'],
        requiresApproval: true,
      },

      // Admin Module Permissions
      {
        code: 'ADMIN_VIEW',
        module: 'admin',
        action: 'view',
        name: 'Admin View',
        description: 'View system administration settings and configurations',
        category: 'Administration',
        apiEndpoint: '/api/admin/*',
        httpMethod: 'GET',
      },
      {
        code: 'ADMIN_CREATE',
        module: 'admin',
        action: 'create',
        name: 'Admin Create',
        description: 'Create system configurations and admin records',
        category: 'Administration',
        apiEndpoint: '/api/admin/*',
        httpMethod: 'POST',
        dependsOn: ['ADMIN_VIEW'],
      },
      {
        code: 'ADMIN_EDIT',
        module: 'admin',
        action: 'edit',
        name: 'Admin Edit',
        description: 'Edit system settings and configurations',
        category: 'Administration',
        apiEndpoint: '/api/admin/*',
        httpMethod: 'PUT',
        dependsOn: ['ADMIN_VIEW'],
      },
      {
        code: 'ADMIN_DELETE',
        module: 'admin',
        action: 'delete',
        name: 'Admin Delete',
        description: 'Delete system configurations (restricted)',
        category: 'Administration',
        apiEndpoint: '/api/admin/*',
        httpMethod: 'DELETE',
        dependsOn: ['ADMIN_VIEW', 'ADMIN_EDIT'],
        requiresApproval: true,
      },

      // Reports Module Permissions
      {
        code: 'REPORTS_VIEW',
        module: 'reports',
        action: 'view',
        name: 'Reports View',
        description: 'View reports and analytics dashboards',
        category: 'Reports',
        apiEndpoint: '/api/reports/*',
        httpMethod: 'GET',
      },
      {
        code: 'REPORTS_CREATE',
        module: 'reports',
        action: 'create',
        name: 'Reports Create',
        description: 'Create custom reports and saved queries',
        category: 'Reports',
        apiEndpoint: '/api/reports/*',
        httpMethod: 'POST',
        dependsOn: ['REPORTS_VIEW'],
      },
      {
        code: 'REPORTS_EXPORT',
        module: 'reports',
        action: 'export',
        name: 'Reports Export',
        description: 'Export reports to various formats (PDF, Excel, CSV)',
        category: 'Reports',
        apiEndpoint: '/api/reports/*/export',
        httpMethod: 'GET',
        dependsOn: ['REPORTS_VIEW'],
      },
    ];

    for (const permission of permissions) {
      try {
        const existing = await this.permissionRepository.findOne({
          where: { code: permission.code },
        });
        if (!existing) {
          const permissionEntity = this.permissionRepository.create({
            code: permission.code,
            module: permission.module,
            action: permission.action,
            name: permission.name,
            description: permission.description,
            category: permission.category,
            permissionType: PermissionType.SYSTEM,
            status: PermissionStatus.ACTIVE,
            isSystemPermission: true,
            requiresApproval: permission.requiresApproval || false,
            dependsOn: permission.dependsOn || null,
            apiEndpoint: permission.apiEndpoint || null,
            httpMethod: permission.httpMethod || null,
            constraints: {
              dataScope: 'all',
            },
            metadata: {
              seededAt: new Date().toISOString(),
            },
            createdBy: 'system',
          });
          await this.permissionRepository.save(permissionEntity);
          this.logger.log(`Created permission: ${permission.code}`);
        } else {
          this.logger.debug(`Permission already exists: ${permission.code}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed permission ${permission.code}: ${error.message}`);
      }
    }

    this.logger.log(`System permissions seeding completed. Total: ${permissions.length} permissions`);
  }
}
