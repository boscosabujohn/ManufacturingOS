import { Controller, Get, Post, Patch, Body, Param } from '@nestjs/common';
import { LogisticsInstallationService } from '../services/logistics-installation.service';

@Controller('api/logistics-installation')
export class LogisticsInstallationController {
    constructor(private readonly service: LogisticsInstallationService) { }

    @Get('readiness/:projectId')
    getReadiness(@Param('projectId') projectId: string) {
        return this.service.getReadiness(projectId);
    }

    @Patch('readiness/:id')
    updateReadiness(@Param('id') id: string, @Body() data: { status: any; verifiedBy: string }) {
        return this.service.updateReadiness(id, data.status, data.verifiedBy);
    }

    @Post('dispatch')
    createDispatch(@Body() data: any) {
        return this.service.createDispatch(data);
    }

    @Get('tasks/:projectId')
    getTasks(@Param('projectId') projectId: string) {
        return this.service.getInstallerTasks(projectId);
    }

    @Patch('task/:id')
    updateTask(@Param('id') id: string, @Body() data: { progress: number; status: any }) {
        return this.service.updateInstallationProgress(id, data.progress, data.status);
    }
}
