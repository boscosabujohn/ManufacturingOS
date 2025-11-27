
import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { ProjectService } from '../services/project.service';
import { Project } from '../entities/project.entity';

@ApiTags('Projects')
@Controller('api/projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    @ApiOperation({ summary: 'Create a new project' })
    @ApiResponse({ status: 201, description: 'The project has been successfully created.' })
    async create(@Body() createProjectDto: Partial<Project>) {
        return this.projectService.createProject(createProjectDto);
    }

    @Get()
    @ApiOperation({ summary: 'Get all projects' })
    @ApiResponse({ status: 200, description: 'Return all projects.' })
    async findAll() {
        return this.projectService.findAll();
    }

    @Get(':id')
    @ApiOperation({ summary: 'Get a project by id' })
    @ApiResponse({ status: 200, description: 'Return the project.' })
    @ApiResponse({ status: 404, description: 'Project not found.' })
    async findOne(@Param('id') id: string) {
        return this.projectService.findOne(id);
    }

    @Put(':id')
    @ApiOperation({ summary: 'Update a project' })
    @ApiResponse({ status: 200, description: 'The project has been successfully updated.' })
    async update(@Param('id') id: string, @Body() updateProjectDto: Partial<Project>) {
        return this.projectService.update(id, updateProjectDto);
    }

    @Delete(':id')
    @HttpCode(HttpStatus.NO_CONTENT)
    @ApiOperation({ summary: 'Delete a project' })
    @ApiResponse({ status: 204, description: 'The project has been successfully deleted.' })
    async remove(@Param('id') id: string) {
        return this.projectService.delete(id);
    }
}
