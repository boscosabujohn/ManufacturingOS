import { Controller, Get, Post, Delete, Body, Param, Query } from '@nestjs/common';
import { ProjectAttachmentService } from '../services/project-attachment.service';

@Controller('api/project-attachments')
export class ProjectAttachmentController {
    constructor(private readonly service: ProjectAttachmentService) { }

    @Post(':projectId')
    create(@Param('projectId') projectId: string, @Body() data: any) {
        return this.service.createAttachment(projectId, data);
    }

    @Get(':projectId')
    findAll(@Param('projectId') projectId: string, @Query('category') category?: string) {
        return this.service.getProjectAttachments(projectId, category);
    }

    @Delete(':id')
    remove(@Param('id') id: string) {
        return this.service.deleteAttachment(id);
    }

    @Post('simulate-upload')
    getUploadUrl(@Body() body: { fileName: string; contentType: string }) {
        return this.service.simulateUpload(body.fileName, body.contentType);
    }
}
