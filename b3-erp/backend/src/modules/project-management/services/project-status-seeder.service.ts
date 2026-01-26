import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectStatusEntity, ProjectStatusState } from '../entities/project-status.entity';

@Injectable()
export class ProjectStatusSeederService implements OnModuleInit {
  private readonly logger = new Logger(ProjectStatusSeederService.name);

  constructor(
    @InjectRepository(ProjectStatusEntity)
    private readonly projectStatusRepository: Repository<ProjectStatusEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedProjectStatuses();
  }

  async seedProjectStatuses(): Promise<void> {
    this.logger.log('Seeding project statuses...');

    const projectStatuses = [
      {
        code: 'PLANNING',
        name: 'Planning',
        description: 'Project is in planning phase, defining scope and requirements',
        color: '#3B82F6',
        sequenceOrder: 1,
        isFinal: false,
        isDefault: true,
        allowTimeLogging: false,
        allowTaskCreation: true,
        allowBudgetModification: true,
        status: ProjectStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'IN_PROGRESS',
        name: 'In Progress',
        description: 'Project is actively being worked on',
        color: '#8B5CF6',
        sequenceOrder: 2,
        isFinal: false,
        isDefault: false,
        allowTimeLogging: true,
        allowTaskCreation: true,
        allowBudgetModification: true,
        status: ProjectStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'ON_HOLD',
        name: 'On Hold',
        description: 'Project is temporarily paused or on hold',
        color: '#F59E0B',
        sequenceOrder: 3,
        isFinal: false,
        isDefault: false,
        allowTimeLogging: false,
        allowTaskCreation: false,
        allowBudgetModification: false,
        status: ProjectStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'DELAYED',
        name: 'Delayed',
        description: 'Project is behind schedule and delayed',
        color: '#EF4444',
        sequenceOrder: 4,
        isFinal: false,
        isDefault: false,
        allowTimeLogging: true,
        allowTaskCreation: true,
        allowBudgetModification: true,
        status: ProjectStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'COMPLETED',
        name: 'Completed',
        description: 'Project has been successfully completed',
        color: '#22C55E',
        sequenceOrder: 5,
        isFinal: true,
        isDefault: false,
        allowTimeLogging: false,
        allowTaskCreation: false,
        allowBudgetModification: false,
        status: ProjectStatusState.ACTIVE,
        isSystem: true,
      },
      {
        code: 'CANCELLED',
        name: 'Cancelled',
        description: 'Project has been cancelled and will not proceed',
        color: '#6B7280',
        sequenceOrder: 6,
        isFinal: true,
        isDefault: false,
        allowTimeLogging: false,
        allowTaskCreation: false,
        allowBudgetModification: false,
        status: ProjectStatusState.ACTIVE,
        isSystem: true,
      },
    ];

    for (const projectStatus of projectStatuses) {
      try {
        const existing = await this.projectStatusRepository.findOne({
          where: { code: projectStatus.code },
        });
        if (!existing) {
          await this.projectStatusRepository.save(projectStatus);
          this.logger.log(`Created project status: ${projectStatus.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed project status ${projectStatus.name}: ${error.message}`);
      }
    }

    this.logger.log('Project statuses seeding completed');
  }
}
