import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { WorkOrderStatusEntity, WorkOrderStatusState } from '../entities/work-order-status.entity';

@Injectable()
export class WorkOrderStatusSeederService implements OnModuleInit {
  private readonly logger = new Logger(WorkOrderStatusSeederService.name);

  constructor(
    @InjectRepository(WorkOrderStatusEntity)
    private readonly workOrderStatusRepository: Repository<WorkOrderStatusEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedWorkOrderStatuses();
  }

  async seedWorkOrderStatuses(): Promise<void> {
    this.logger.log('Seeding work order statuses...');

    const workOrderStatuses = [
      {
        code: 'DRAFT',
        name: 'Draft',
        description: 'Work order is in draft state, not yet submitted for processing. Can be freely edited.',
        color: '#6B7280',
        sequenceOrder: 1,
        isInitial: true,
        isFinal: false,
        isDefault: true,
        allowMaterialIssue: false,
        allowProduction: false,
        allowQualityCheck: false,
        allowEdit: true,
        allowCancel: true,
        allowedNextStatuses: ['PLANNED', 'CANCELLED'],
        allowedPreviousStatuses: [],
        notifyOnTransition: false,
        notifyRoles: [],
        status: WorkOrderStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'PLANNED',
        name: 'Planned',
        description: 'Work order has been planned and scheduled. Materials and resources are being allocated.',
        color: '#3B82F6',
        sequenceOrder: 2,
        isInitial: false,
        isFinal: false,
        isDefault: false,
        allowMaterialIssue: true,
        allowProduction: false,
        allowQualityCheck: false,
        allowEdit: true,
        allowCancel: true,
        allowedNextStatuses: ['RELEASED', 'ON_HOLD', 'CANCELLED'],
        allowedPreviousStatuses: ['DRAFT'],
        notifyOnTransition: true,
        notifyRoles: ['MANAGER', 'SUPERVISOR'],
        status: WorkOrderStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'RELEASED',
        name: 'Released',
        description: 'Work order has been released for production. All materials have been allocated.',
        color: '#8B5CF6',
        sequenceOrder: 3,
        isInitial: false,
        isFinal: false,
        isDefault: false,
        allowMaterialIssue: true,
        allowProduction: true,
        allowQualityCheck: false,
        allowEdit: false,
        allowCancel: true,
        allowedNextStatuses: ['IN_PROGRESS', 'ON_HOLD', 'CANCELLED'],
        allowedPreviousStatuses: ['PLANNED'],
        notifyOnTransition: true,
        notifyRoles: ['SUPERVISOR', 'OPERATOR'],
        status: WorkOrderStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'IN_PROGRESS',
        name: 'In Progress',
        description: 'Work order is actively being worked on. Production is underway.',
        color: '#F59E0B',
        sequenceOrder: 4,
        isInitial: false,
        isFinal: false,
        isDefault: false,
        allowMaterialIssue: true,
        allowProduction: true,
        allowQualityCheck: true,
        allowEdit: false,
        allowCancel: false,
        allowedNextStatuses: ['COMPLETED', 'ON_HOLD'],
        allowedPreviousStatuses: ['RELEASED', 'ON_HOLD'],
        notifyOnTransition: true,
        notifyRoles: ['MANAGER', 'SUPERVISOR'],
        status: WorkOrderStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'ON_HOLD',
        name: 'On Hold',
        description: 'Work order is temporarily paused due to issues or waiting for resources/approvals.',
        color: '#EF4444',
        sequenceOrder: 5,
        isInitial: false,
        isFinal: false,
        isDefault: false,
        allowMaterialIssue: false,
        allowProduction: false,
        allowQualityCheck: false,
        allowEdit: false,
        allowCancel: true,
        allowedNextStatuses: ['IN_PROGRESS', 'RELEASED', 'PLANNED', 'CANCELLED'],
        allowedPreviousStatuses: ['PLANNED', 'RELEASED', 'IN_PROGRESS'],
        notifyOnTransition: true,
        notifyRoles: ['MANAGER', 'SUPERVISOR', 'ADMIN'],
        status: WorkOrderStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'COMPLETED',
        name: 'Completed',
        description: 'Work order production is complete. Ready for quality inspection and stock receipt.',
        color: '#22C55E',
        sequenceOrder: 6,
        isInitial: false,
        isFinal: true,
        isDefault: false,
        allowMaterialIssue: false,
        allowProduction: false,
        allowQualityCheck: true,
        allowEdit: false,
        allowCancel: false,
        allowedNextStatuses: [],
        allowedPreviousStatuses: ['IN_PROGRESS'],
        notifyOnTransition: true,
        notifyRoles: ['MANAGER', 'SUPERVISOR', 'QUALITY_MANAGER'],
        status: WorkOrderStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'CANCELLED',
        name: 'Cancelled',
        description: 'Work order has been cancelled and will not be processed.',
        color: '#DC2626',
        sequenceOrder: 7,
        isInitial: false,
        isFinal: true,
        isDefault: false,
        allowMaterialIssue: false,
        allowProduction: false,
        allowQualityCheck: false,
        allowEdit: false,
        allowCancel: false,
        allowedNextStatuses: [],
        allowedPreviousStatuses: ['DRAFT', 'PLANNED', 'RELEASED', 'ON_HOLD'],
        notifyOnTransition: true,
        notifyRoles: ['MANAGER', 'ADMIN'],
        status: WorkOrderStatusState.ACTIVE,
        isSystem: true,
      },
    ];

    for (const statusData of workOrderStatuses) {
      try {
        const existing = await this.workOrderStatusRepository.findOne({
          where: { code: statusData.code },
        });

        if (!existing) {
          const workOrderStatus = this.workOrderStatusRepository.create({
            ...statusData,
            metadata: {
              seededAt: new Date().toISOString(),
              source: 'system-seeder',
              version: '1.0',
            },
            createdBy: 'system',
          });
          await this.workOrderStatusRepository.save(workOrderStatus);
          this.logger.log(`Created work order status: ${statusData.name} (Sequence: ${statusData.sequenceOrder})`);
        } else {
          this.logger.debug(`Work order status already exists: ${statusData.code}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed work order status ${statusData.name}: ${error.message}`);
      }
    }

    this.logger.log('Work order statuses seeding completed');
    this.logger.log('Status Flow: DRAFT -> PLANNED -> RELEASED -> IN_PROGRESS -> COMPLETED');
    this.logger.log('Alternative: Any status (except COMPLETED) can transition to ON_HOLD or CANCELLED');
  }
}
