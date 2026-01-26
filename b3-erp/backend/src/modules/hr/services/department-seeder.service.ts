import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department, DepartmentStatus } from '../entities/department.entity';

@Injectable()
export class DepartmentSeederService implements OnModuleInit {
  private readonly logger = new Logger(DepartmentSeederService.name);

  constructor(
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedDepartments();
  }

  async seedDepartments(): Promise<void> {
    this.logger.log('Seeding departments...');

    const departments = [
      {
        code: 'MGMT',
        name: 'Management',
        description: 'Executive management and leadership team responsible for strategic decisions and overall company direction.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'HR',
        name: 'Human Resources',
        description: 'Handles recruitment, employee relations, training, benefits administration, and workforce management.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'FIN',
        name: 'Finance & Accounts',
        description: 'Manages financial planning, accounting, budgeting, taxation, and financial reporting.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'SALES',
        name: 'Sales & Marketing',
        description: 'Drives revenue through sales activities, marketing campaigns, customer acquisition, and brand management.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'PROD',
        name: 'Production',
        description: 'Oversees manufacturing operations, production planning, scheduling, and shop floor management.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'QC',
        name: 'Quality Control',
        description: 'Ensures product quality through inspection, testing, quality assurance, and compliance with standards.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'STORE',
        name: 'Stores & Inventory',
        description: 'Manages raw materials, finished goods inventory, warehousing, and stock control.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'MAINT',
        name: 'Maintenance',
        description: 'Handles equipment maintenance, repairs, preventive maintenance programs, and facility upkeep.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'IT',
        name: 'Information Technology',
        description: 'Manages IT infrastructure, software systems, cybersecurity, and digital transformation initiatives.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'ADMIN',
        name: 'Administration',
        description: 'Handles general administration, office management, facilities, and administrative support services.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
      {
        code: 'DISPATCH',
        name: 'Dispatch & Logistics',
        description: 'Manages shipping, transportation, delivery scheduling, and logistics coordination.',
        status: DepartmentStatus.ACTIVE,
        createdBy: 'system',
      },
    ];

    for (const department of departments) {
      try {
        const existing = await this.departmentRepository.findOne({
          where: { code: department.code },
        });
        if (!existing) {
          await this.departmentRepository.save(department);
          this.logger.log(`Created department: ${department.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed department ${department.name}: ${error.message}`);
      }
    }

    this.logger.log('Departments seeding completed');
  }
}
