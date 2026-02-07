import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus, HandoverStatus } from '../project/entities/project.entity';
import { ProjectAttachment, AttachmentCategory } from '../project/entities/project-attachment.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        @InjectRepository(ProjectAttachment)
        private attachmentRepository: Repository<ProjectAttachment>,
    ) { }

    // ... existing methods ...

    async addAttachments(projectId: string, files: Array<Express.Multer.File>, category: AttachmentCategory, comments?: string): Promise<ProjectAttachment[]> {
        const project = await this.findOne(projectId);
        const savedAttachments: ProjectAttachment[] = [];

        for (const file of files) {
            // Check for existing versions
            const existingAttachments = await this.attachmentRepository.find({
                where: { projectId: project.id, fileName: file.originalname },
                order: { version: 'DESC' }
            });

            const nextVersion = existingAttachments.length > 0 ? existingAttachments[0].version + 1 : 1;

            // Mark previous as not latest
            if (existingAttachments.length > 0) {
                await this.attachmentRepository.update(
                    { id: existingAttachments[0].id },
                    { isLatest: false }
                );
            }

            const attachment = this.attachmentRepository.create({
                projectId: project.id,
                fileName: file.originalname,
                fileUrl: `/uploads/projects/${project.id}/v${nextVersion}_${file.originalname}`,
                category: category,
                mimeType: file.mimetype,
                fileSize: file.size,
                version: nextVersion,
                isLatest: true,
                comments: comments
            });

            savedAttachments.push(await this.attachmentRepository.save(attachment));
        }

        return savedAttachments;
    }

    async updateHandoverStatus(id: string, status: HandoverStatus): Promise<Project> {
        const project = await this.findOne(id);
        project.handoverStatus = status;
        return this.projectRepository.save(project);
    }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const projectCode = await this.generateProjectNumber();
        const project = this.projectRepository.create({
            name: createProjectDto.projectName,
            clientName: createProjectDto.customer,
            description: `Project for ${createProjectDto.customer}`,
            projectCode: projectCode,
            salesOrderId: createProjectDto.salesOrderNumber,
            projectManagerId: createProjectDto.projectManager,
            startDate: createProjectDto.startDate ? new Date(createProjectDto.startDate) : undefined,
            endDate: createProjectDto.endDate ? new Date(createProjectDto.endDate) : undefined,
            plannedStart: createProjectDto.startDate ? new Date(createProjectDto.startDate) : undefined,
            plannedEnd: createProjectDto.endDate ? new Date(createProjectDto.endDate) : undefined,
            status: createProjectDto.status || ProjectStatus.PLANNING,
            priority: createProjectDto.priority || 'medium',
            budgetAllocated: createProjectDto.budget || 0,
            location: createProjectDto.location,
            projectType: createProjectDto.projectType,
            awardDate: createProjectDto.awardDate ? new Date(createProjectDto.awardDate) : undefined,
            clientContactPerson: createProjectDto.clientContactPerson,
            clientContactEmail: createProjectDto.clientContactEmail,
        });
        return this.projectRepository.save(project);
    }

    async findAll(): Promise<Project[]> {
        return this.projectRepository.find({
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Project> {
        const project = await this.projectRepository.findOne({ where: { id } });
        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
        return project;
    }

    async update(id: string, updateProjectDto: UpdateProjectDto): Promise<Project> {
        const project = await this.findOne(id);
        Object.assign(project, updateProjectDto);
        return this.projectRepository.save(project);
    }

    async remove(id: string): Promise<void> {
        const result = await this.projectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
    }

    private async generateProjectNumber(): Promise<string> {
        const year = new Date().getFullYear();
        const prefix = `PRJ-${year}-`;

        // Find the latest project code for the current year
        const lastProject = await this.projectRepository
            .createQueryBuilder('project')
            .where('project.projectCode LIKE :prefix', { prefix: `${prefix}%` })
            .orderBy('project.projectCode', 'DESC')
            .getOne();

        let sequence = 1;
        if (lastProject && lastProject.projectCode) {
            const parts = lastProject.projectCode.split('-');
            if (parts.length === 3) {
                const lastSequence = parseInt(parts[2], 10);
                if (!isNaN(lastSequence)) {
                    sequence = lastSequence + 1;
                }
            }
        }

        const paddedSequence = sequence.toString().padStart(4, '0');
        return `${prefix}${paddedSequence}`;
    }
}
