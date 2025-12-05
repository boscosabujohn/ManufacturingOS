import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { ProjectMilestonesService } from '../services/project-milestones.service';
import { CreateProjectMilestoneDto, UpdateProjectMilestoneDto } from '../dto/project-milestone.dto';

@Controller('project-milestones')
export class ProjectMilestonesController {
    constructor(private readonly milestonesService: ProjectMilestonesService) { }

    @Post()
    create(@Body() createMilestoneDto: CreateProjectMilestoneDto) {
        return this.milestonesService.create(createMilestoneDto);
    }

    @Get()
    findAll(@Query('projectId') projectId: string) {
        return this.milestonesService.findAll(projectId);
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.milestonesService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateMilestoneDto: UpdateProjectMilestoneDto) {
        return this.milestonesService.update(id, updateMilestoneDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.milestonesService.remove(id);
    }
}
