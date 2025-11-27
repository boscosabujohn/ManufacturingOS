
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project } from '../entities/project.entity';
import { StateMachineService } from '../../workflow/services/state-machine.service';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
        private stateMachineService: StateMachineService,
    ) { }

    async createProject(data: Partial<Project>): Promise<Project> {
        const project = this.projectRepository.create(data);
        const savedProject = await this.projectRepository.save(project);

        // Initialize workflow
        await this.stateMachineService.initializeProject(savedProject.id);

        return savedProject;
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

    async delete(id: string): Promise<void> {
        const result = await this.projectRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Project with ID ${id} not found`);
        }
    }
}
