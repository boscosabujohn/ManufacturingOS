
import { Injectable, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus, ProjectPriority } from '../../project/entities/project.entity';
import { ProjectAttachment, AttachmentCategory } from '../../project/entities/project-attachment.entity';

@Injectable()
export class ProjectSeederService implements OnModuleInit {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(ProjectAttachment)
        private attachmentRepository: Repository<ProjectAttachment>,
    ) { }

    async onModuleInit() {
        await this.seedProjects();
    }

    async seedProjects() {
        const count = await this.projectRepository.count();
        if (count > 0) return;

        const projects = [
            {
                name: 'Industrial Kitchen 2026',
                clientName: 'Grand Hyatt Dubai',
                description: 'Complete industrial kitchen setup for the new wing.',
                projectCode: 'PRJ-2026-0001',
                status: ProjectStatus.ACTIVE,
                priority: ProjectPriority.HIGH,
                awardDate: new Date('2026-01-10'),
                startDate: new Date('2026-01-15'),
                plannedEnd: new Date('2026-06-30'),
                budgetAllocated: 500000,
                location: 'Dubai, UAE',
                projectType: 'Industrial Kitchen',
                clientContactPerson: 'John Smith',
                clientContactEmail: 'john.smith@hyatt.com',
            },
            {
                name: 'Steel Shutter Unit Production',
                clientName: 'BuildCorp Industries',
                description: 'Manufacturing and installation of 500 steel shutter units.',
                projectCode: 'PRJ-2025-0089',
                status: ProjectStatus.COMPLETED,
                priority: ProjectPriority.MEDIUM,
                awardDate: new Date('2025-09-01'),
                startDate: new Date('2025-09-05'),
                endDate: new Date('2025-12-20'),
                budgetAllocated: 250000,
                location: 'Abu Dhabi, UAE',
                projectType: 'Standard Fabrication',
                clientContactPerson: 'Sarah Abu',
                clientContactEmail: 'sarah@buildcorp.ae',
            },
            {
                name: 'Luxury Villa Fit-out',
                clientName: 'Private Client',
                description: 'Custom kitchen and wardrobe fabrication.',
                projectCode: 'PRJ-2026-0002',
                status: ProjectStatus.PLANNING,
                priority: ProjectPriority.CRITICAL,
                awardDate: new Date('2026-02-01'),
                startDate: new Date('2026-02-15'),
                plannedEnd: new Date('2026-04-30'),
                budgetAllocated: 120000,
                location: 'Palm Jumeirah, Dubai',
                projectType: 'Interior Fit-out',
                clientContactPerson: 'Ahmed Hassan',
                clientContactEmail: 'ahmed@example.com',
            }
        ];

        for (const projectData of projects) {
            const project = this.projectRepository.create(projectData);
            const savedProject = await this.projectRepository.save(project);

            // Seed sample attachment
            const attachment = this.attachmentRepository.create({
                projectId: savedProject.id,
                fileName: `AwardLetter_${savedProject.projectCode}.pdf`,
                fileUrl: `/uploads/projects/${savedProject.id}/award_letter.pdf`,
                category: AttachmentCategory.CONFIRMATION,
                mimeType: 'application/pdf',
                fileSize: 1024 * 500, // 500 KB
            });
            await this.attachmentRepository.save(attachment);
        }

        console.log('Project seeder completed.');
    }
}
