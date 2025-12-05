import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectResourcesService } from '../services/project-resources.service';
import { CreateProjectResourceDto, UpdateProjectResourceDto } from '../dto/project-resource.dto';

@Controller('project-resources')
export class ProjectResourcesController {
    constructor(private readonly resourcesService: ProjectResourcesService) { }

    @Post()
    create(@Body() createResourceDto: CreateProjectResourceDto) {
        return this.resourcesService.create(createResourceDto);
    }

    @Get()
    findAll(@Query('projectId') projectId: string) {
        return this.resourcesService.findAll(projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.resourcesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateResourceDto: UpdateProjectResourceDto) {
        return this.resourcesService.update(id, updateResourceDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.resourcesService.remove(id);
    }
}
