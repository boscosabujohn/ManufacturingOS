import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTypeEntity, ProjectTypeStatus } from '../entities/project-type.entity';

@Injectable()
export class ProjectTypeSeederService implements OnModuleInit {
  private readonly logger = new Logger(ProjectTypeSeederService.name);

  constructor(
    @InjectRepository(ProjectTypeEntity)
    private readonly projectTypeRepository: Repository<ProjectTypeEntity>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedProjectTypes();
  }

  async seedProjectTypes(): Promise<void> {
    this.logger.log('Seeding project types...');

    const projectTypes = [
      {
        code: 'INSTALLATION',
        name: 'Installation Project',
        description: 'Project for installing new equipment or systems at customer site',
        icon: 'Settings',
        color: '#3B82F6',
        sortOrder: 1,
        requiresBudget: true,
        requiresTimeline: true,
        isRecurring: false,
        defaultDurationDays: 30,
        requiredMilestones: ['site_survey', 'installation', 'commissioning', 'handover'],
        status: ProjectTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'MANUFACTURING',
        name: 'Manufacturing Project',
        description: 'Project for manufacturing custom products or equipment',
        icon: 'Factory',
        color: '#8B5CF6',
        sortOrder: 2,
        requiresBudget: true,
        requiresTimeline: true,
        isRecurring: false,
        defaultDurationDays: 60,
        requiredMilestones: ['design', 'procurement', 'production', 'testing', 'delivery'],
        status: ProjectTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'SERVICE',
        name: 'Service Project',
        description: 'Project for providing service and maintenance work',
        icon: 'Wrench',
        color: '#22C55E',
        sortOrder: 3,
        requiresBudget: true,
        requiresTimeline: true,
        isRecurring: false,
        defaultDurationDays: 14,
        requiredMilestones: ['assessment', 'execution', 'completion'],
        status: ProjectTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'TURNKEY',
        name: 'Turnkey Project',
        description: 'Complete turnkey solution project including design, build, and commission',
        icon: 'Key',
        color: '#F59E0B',
        sortOrder: 4,
        requiresBudget: true,
        requiresTimeline: true,
        isRecurring: false,
        defaultDurationDays: 180,
        requiredMilestones: ['design', 'approval', 'procurement', 'manufacturing', 'installation', 'commissioning', 'training', 'handover'],
        status: ProjectTypeStatus.ACTIVE,
        isSystem: true,
      },
      {
        code: 'AMC',
        name: 'Annual Maintenance Contract',
        description: 'Recurring annual maintenance contract project',
        icon: 'Calendar',
        color: '#06B6D4',
        sortOrder: 5,
        requiresBudget: true,
        requiresTimeline: true,
        isRecurring: true,
        defaultDurationDays: 365,
        requiredMilestones: ['contract_start', 'quarterly_review', 'annual_review', 'renewal'],
        status: ProjectTypeStatus.ACTIVE,
        isSystem: true,
      },
    ];

    for (const projectType of projectTypes) {
      try {
        const existing = await this.projectTypeRepository.findOne({
          where: { code: projectType.code },
        });
        if (!existing) {
          await this.projectTypeRepository.save(projectType);
          this.logger.log(`Created project type: ${projectType.name}`);
        }
      } catch (error) {
        this.logger.error(`Failed to seed project type ${projectType.name}: ${error.message}`);
      }
    }

    this.logger.log('Project types seeding completed');
  }
}
