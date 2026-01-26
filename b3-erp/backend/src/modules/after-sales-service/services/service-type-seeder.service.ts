import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ServiceType, ServiceTypeStatus } from '../entities/service-type.entity';

@Injectable()
export class ServiceTypeSeederService implements OnModuleInit {
  private readonly logger = new Logger(ServiceTypeSeederService.name);

  constructor(
    @InjectRepository(ServiceType)
    private readonly serviceTypeRepository: Repository<ServiceType>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedServiceTypes();
  }

  async seedServiceTypes(): Promise<void> {
    this.logger.log('Seeding service types...');

    const serviceTypes = [
      {
        code: 'INSTALLATION',
        name: 'Installation',
        description: 'New equipment installation and commissioning service',
        defaultDurationHours: 8,
        icon: 'Settings',
        color: '#3B82F6',
        sortOrder: 1,
        requiresEquipment: true,
        requiresWarrantyCheck: false,
        billable: true,
        status: ServiceTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'REPAIR',
        name: 'Repair',
        description: 'Equipment repair and troubleshooting service',
        defaultDurationHours: 4,
        icon: 'Wrench',
        color: '#EF4444',
        sortOrder: 2,
        requiresEquipment: true,
        requiresWarrantyCheck: true,
        billable: true,
        status: ServiceTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'MAINTENANCE',
        name: 'Preventive Maintenance',
        description: 'Scheduled preventive maintenance service',
        defaultDurationHours: 2,
        icon: 'Tool',
        color: '#22C55E',
        sortOrder: 3,
        requiresEquipment: true,
        requiresWarrantyCheck: false,
        billable: true,
        status: ServiceTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'INSPECTION',
        name: 'Annual Inspection',
        description: 'Annual equipment inspection and compliance check',
        defaultDurationHours: 4,
        icon: 'ClipboardCheck',
        color: '#8B5CF6',
        sortOrder: 4,
        requiresEquipment: true,
        requiresWarrantyCheck: false,
        billable: true,
        status: ServiceTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'CALIBRATION',
        name: 'Calibration',
        description: 'Equipment calibration and certification service',
        defaultDurationHours: 2,
        icon: 'Gauge',
        color: '#F59E0B',
        sortOrder: 5,
        requiresEquipment: true,
        requiresWarrantyCheck: false,
        billable: true,
        status: ServiceTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'UPGRADE',
        name: 'Upgrade/Modification',
        description: 'Equipment upgrade, modification, or enhancement service',
        defaultDurationHours: 8,
        icon: 'ArrowUpCircle',
        color: '#06B6D4',
        sortOrder: 6,
        requiresEquipment: true,
        requiresWarrantyCheck: true,
        billable: true,
        status: ServiceTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'TRAINING',
        name: 'Customer Training',
        description: 'Customer training and knowledge transfer service',
        defaultDurationHours: 4,
        icon: 'GraduationCap',
        color: '#EC4899',
        sortOrder: 7,
        requiresEquipment: false,
        requiresWarrantyCheck: false,
        billable: true,
        status: ServiceTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'BREAKDOWN',
        name: 'Breakdown Service',
        description: 'Emergency breakdown and fault diagnosis service',
        defaultDurationHours: 4,
        icon: 'AlertTriangle',
        color: '#DC2626',
        sortOrder: 8,
        requiresEquipment: true,
        requiresWarrantyCheck: true,
        billable: true,
        status: ServiceTypeStatus.ACTIVE,
        isSystem: true,
      },
    ];

    for (const serviceType of serviceTypes) {
      try {
        const existing = await this.serviceTypeRepository.findOne({
          where: { code: serviceType.code },
        });
        if (!existing) {
          await this.serviceTypeRepository.save(serviceType);
          this.logger.log(`Created service type: ${serviceType.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed service type ${serviceType.name}: ${error.message}`);
      }
    }

    this.logger.log('Service types seeding completed');
  }
}
