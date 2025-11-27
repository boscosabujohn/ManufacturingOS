import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Project, ProjectStatus } from './entities/project.entity';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
    constructor(
        @InjectRepository(Project)
        private projectRepository: Repository<Project>,
    ) { }

    async create(createProjectDto: CreateProjectDto): Promise<Project> {
        const projectNumber = await this.generateProjectNumber();
        const project = this.projectRepository.create({
            ...createProjectDto,
            projectNumber,
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
        const count = await this.projectRepository.count();
        const year = new Date().getFullYear();
        return `PRJ-${year}-${String(count + 1).padStart(3, '0')}`;
    }
}
