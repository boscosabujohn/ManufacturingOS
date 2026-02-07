import { Controller, Get, Post, Body, Patch, Param, Delete, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { Project, HandoverStatus } from '../project/entities/project.entity';
import { AttachmentCategory } from '../project/entities/project-attachment.entity';

@Controller('projects')
export class ProjectController {
    constructor(private readonly projectService: ProjectService) { }

    @Post()
    create(@Body() createProjectDto: CreateProjectDto) {
        return this.projectService.create(createProjectDto);
    }

    @Get()
    findAll() {
        return this.projectService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
        return this.projectService.findOne(id);
    }

    @Patch(':id')
    update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto) {
        return this.projectService.update(id, updateProjectDto);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.projectService.remove(id);
    }

    @Patch(':id/handover-status')
    updateHandoverStatus(
        @Param('id') id: string,
        @Body('status') status: HandoverStatus
    ) {
        return this.projectService.updateHandoverStatus(id, status);
    }

    @Post(':id/attachments')
    @UseInterceptors(FilesInterceptor('files'))
    uploadAttachments(
        @Param('id') id: string,
        @UploadedFiles() files: Array<Express.Multer.File>,
        @Body('category') category: AttachmentCategory,
        @Body('comments') comments?: string
    ) {
        return this.projectService.addAttachments(id, files, category, comments);
    }
}
