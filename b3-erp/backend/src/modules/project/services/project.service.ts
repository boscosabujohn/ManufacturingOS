
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, HandoverStatus } from '../entities/project.entity';
import { StateMachineService } from '../../workflow/services/state-machine.service';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private stateMachineService: StateMachineService,
    ) { }

    async createProject(data: Partial<Project>): Promise<Project> {
        if (!data.projectCode) {
            data.projectCode = await this.generateProjectCode();
        }

        const project = this.projectRepository.create(data);
        const savedProject = await this.projectRepository.save(project);

        // Initialize workflow
        await this.stateMachineService.initializeProject(savedProject.id);

        return savedProject;
    }

    private async generateProjectCode(): Promise<string> {
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
                sequence = parseInt(parts[2], 10) + 1;
            }
        }

        const paddedSequence = sequence.toString().padStart(4, '0');
        return `${prefix}${paddedSequence}`;
    }

    async findAll(): Promise<Project[]> {
        return this.projectRepository.find({
            relations: ['phases'],
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<Project> {
        const project = await this.projectRepository.findOne({
            where: { id },
            relations: ['phases', 'documents', 'qualityGates'],
        });

        if (!project) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }

        return project;
    }

    async update(id: string, data: Partial<Project>): Promise<Project> {
        const project = await this.findOne(id);
        Object.assign(project, data);
        return this.projectRepository.save(project);
    }

    async updateHandoverStatus(id: string, status: HandoverStatus): Promise<Project> {
        const project = await this.findOne(id);
        project.handoverStatus = status;
        return this.projectRepository.save(project);
    }

    async delete(id: string): Promise<void> {
        const result = await this.projectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
    }
}
