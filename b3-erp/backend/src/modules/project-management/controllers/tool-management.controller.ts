import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ToolManagementService } from '../services/tool-management.service';

@Controller('project-management/tools')
export class ToolManagementController {
    constructor(private readonly toolManagementService: ToolManagementService) { }

    @Post('issue')
    async issueTool(
        @Body() body: { toolId: string; projectId: string; condition: string; issuedBy?: string },
    ) {
        return await this.toolManagementService.issueToolToSite(
            body.toolId,
            body.projectId,
            body.condition,
            body.issuedBy,
        );
    }

    @Post('return')
    async returnTool(
        @Body() body: { deploymentId: string; condition: string; depreciation: number; returnedBy?: string },
    ) {
        return await this.toolManagementService.returnToolFromSite(
            body.deploymentId,
            body.condition,
            body.depreciation,
            body.returnedBy,
        );
    }

    @Get('project/:projectId')
    async getDeployedTools(@Param('projectId') projectId: string) {
        return await this.toolManagementService.getDeployedTools(projectId);
    }

    @Get('all')
    async getAllDeployments() {
        return await this.toolManagementService.getAllDeployments();
    }
}
