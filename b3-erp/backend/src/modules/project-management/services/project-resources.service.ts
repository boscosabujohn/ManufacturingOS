import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectResource } from '../entities/project-resource.entity';
import { CreateProjectResourceDto, UpdateProjectResourceDto } from '../dto/project-resource.dto';

@Injectable()
export class ProjectResourcesService {
    constructor(
        @InjectRepository(ProjectResource)
        private resourceRepository: Repository<ProjectResource>,
    ) { }

    async create(createResourceDto: CreateProjectResourceDto): Promise<ProjectResource> {
        const resource = this.resourceRepository.create(createResourceDto);
        return this.resourceRepository.save(resource);
    }

    async findAll(projectId: string): Promise<ProjectResource[]> {
        return this.resourceRepository.find({
            where: { projectId },
            order: { createdAt: 'ASC' }
        });
    }

    async findOne(id: string): Promise<ProjectResource> {
        const resource = await this.resourceRepository.findOne({ where: { id } });
        if (!resource) {
            throw new NotFoundException(`Resource with ID ${id} not found`);
        }
        return resource;
    }

    async update(id: string, updateResourceDto: UpdateProjectResourceDto): Promise<ProjectResource> {
        const resource = await this.findOne(id);
        Object.assign(resource, updateResourceDto);
        return this.resourceRepository.save(resource);
    }

    async remove(id: string): Promise<void> {
        const result = await this.resourceRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Resource with ID ${id} not found`);
        }
    }
}
