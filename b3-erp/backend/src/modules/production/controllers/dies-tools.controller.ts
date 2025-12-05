import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { DiesToolsService } from '../services/dies-tools.service';

@Controller('api/production/dies-tools')
export class DiesToolsController {
    constructor(private readonly diesToolsService: DiesToolsService) { }

    @Get()
    async listTools() {
        // In real implementation, fetch from database
        return {
            success: true,
            data: []
        };
    }

    @Post()
    async createTool(
        @Body() body: { toolId: string; name: string; type: string; maxLife: number }
    ) {
        const result = await this.diesToolsService.createTool({
            toolId: body.toolId,
            name: body.name,
            type: body.type,
            maxLife: body.maxLife
        });
        return {
            success: true,
            data: result
        };
    }

    @Post(':id/issue')
    async issueTool(
        @Param('id') toolId: string,
        @Body() body: { workOrderId: string; issuedTo: string }
    ) {
        const result = await this.diesToolsService.issueTool(toolId, body.workOrderId, body.issuedTo);
        return {
            success: true,
            data: result
        };
    }

    @Post(':id/return')
    async returnTool(
        @Param('id') toolId: string,
        @Body() body: { cyclesUsed: number; condition: string }
    ) {
        const result = await this.diesToolsService.returnTool(toolId, body.condition || 'Good', body.cyclesUsed);
        return {
            success: true,
            data: result
        };
    }

    @Get(':id/status')
    async getToolStatus(@Param('id') toolId: string) {
        const result = await this.diesToolsService.getToolStatus(toolId);
        return {
            success: true,
            data: result
        };
    }
}
