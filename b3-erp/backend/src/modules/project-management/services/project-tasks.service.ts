import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectTask } from '../entities/project-task.entity';
import { CreateProjectTaskDto, UpdateProjectTaskDto } from '../dto/project-task.dto';

@Injectable()
export class ProjectTasksService {
    constructor(
        @InjectRepository(ProjectTask)
        private taskRepository: Repository<ProjectTask>,
    ) { }

    async create(createTaskDto: CreateProjectTaskDto): Promise<ProjectTask> {
        const task = this.taskRepository.create(createTaskDto);
        return this.taskRepository.save(task);
    }

    async findAll(projectId: string): Promise<ProjectTask[]> {
        return this.taskRepository.find({
            where: { projectId },
            order: { createdAt: 'ASC' },
            relations: ['subtasks', 'parentTask']
        });
    }

    async findOne(id: string): Promise<ProjectTask> {
        const task = await this.taskRepository.findOne({
            where: { id },
            relations: ['subtasks', 'parentTask']
        });
        if (!task) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
        return task;
    }

    async update(id: string, updateTaskDto: UpdateProjectTaskDto): Promise<ProjectTask> {
        const task = await this.findOne(id);
        Object.assign(task, updateTaskDto);
        return this.taskRepository.save(task);
    }

    async remove(id: string): Promise<void> {
        const result = await this.taskRepository.delete(id);
        if (result.affected === 0) {
            throw new NotFoundException(`Task with ID ${id} not found`);
        }
    }
}
