import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { WorkflowTemplateService, WorkflowTemplate } from '../services/workflow-template.service';

@Controller('api/workflow/templates')
export class WorkflowTemplateController {
    constructor(private readonly templateService: WorkflowTemplateService) { }

    @Get()
    getAllTemplates(@Query('category') category?: string) {
        if (category) {
            return {
                success: true,
                data: this.templateService.getTemplatesByCategory(category),
            };
        }
        return {
            success: true,
            data: this.templateService.getAllTemplates(),
        };
    }

    @Get(':id')
    getTemplate(@Param('id') id: string) {
        return {
            success: true,
            data: this.templateService.getTemplateById(id),
        };
    }

    @Post()
    createTemplate(@Body() template: Omit<WorkflowTemplate, 'id' | 'createdAt' | 'updatedAt'>) {
        return {
            success: true,
            data: this.templateService.createTemplate(template),
        };
    }

    @Put(':id')
    updateTemplate(@Param('id') id: string, @Body() updates: Partial<WorkflowTemplate>) {
        return {
            success: true,
            data: this.templateService.updateTemplate(id, updates),
        };
    }

    @Delete(':id')
    deleteTemplate(@Param('id') id: string) {
        this.templateService.deleteTemplate(id);
        return {
            success: true,
            message: 'Template deleted successfully',
        };
    }

    @Post(':id/instantiate')
    instantiateTemplate(@Param('id') id: string, @Body() context: Record<string, any>) {
        return {
            success: true,
            data: this.templateService.instantiateTemplate(id, context),
        };
    }
}
