import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectMilestone } from '../entities/project-milestone.entity';
import { CreateProjectMilestoneDto, UpdateProjectMilestoneDto } from '../dto/project-milestone.dto';

@Injectable()
export class ProjectMilestonesService {
    constructor(
        @InjectRepository(ProjectMilestone)
        private milestoneRepository: Repository<ProjectMilestone>,
    ) { }

    async create(createMilestoneDto: CreateProjectMilestoneDto): Promise<ProjectMilestone> {
        const milestone = this.milestoneRepository.create(createMilestoneDto);
        return this.milestoneRepository.save(milestone);
    }

    async findAll(projectId: string): Promise<ProjectMilestone[]> {
        return this.milestoneRepository.find({
            where: { projectId },
            order: { dueDate: 'ASC' }
        });
    }

    async findOne(id: string): Promise<ProjectMilestone> {
        const milestone = await this.milestoneRepository.findOne({ where: { id } });
        if (!milestone) {
            throw new NotFoundException(`Milestone with ID ${id} not found`);
        }
        return milestone;
    }

    async update(id: string, updateMilestoneDto: UpdateProjectMilestoneDto): Promise<ProjectMilestone> {
        const milestone = await this.findOne(id);
        Object.assign(milestone, updateMilestoneDto);
        return this.milestoneRepository.save(milestone);
    }

    async remove(id: string): Promise<void> {
        const result = await this.milestoneRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Milestone with ID ${id} not found`);
        }
    }
}
