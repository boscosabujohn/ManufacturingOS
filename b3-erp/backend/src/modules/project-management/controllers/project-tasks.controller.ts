import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectTasksService } from '../services/project-tasks.service';
import { CreateProjectTaskDto, UpdateProjectTaskDto } from '../dto/project-task.dto';

@Controller('project-tasks')
export class ProjectTasksController {
    constructor(private readonly tasksService: ProjectTasksService) { }

    @Post()
    create(@Body() createTaskDto: CreateProjectTaskDto) {
        return this.tasksService.create(createTaskDto);
    }

    @Get()
    findAll(@Query('projectId') projectId: string) {
        return this.tasksService.findAll(projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.tasksService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateTaskDto: UpdateProjectTaskDto) {
        return this.tasksService.update(id, updateTaskDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.tasksService.remove(id);
    }
}
