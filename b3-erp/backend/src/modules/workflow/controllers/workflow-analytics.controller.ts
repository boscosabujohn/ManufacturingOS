import { Controller, Get, Post, Param } from '@nestjs/common';
import { SLAService } from '../services/sla.service';
import { WorkflowAnalyticsService } from '../services/workflow-analytics.service';

@Controller('api/workflow/analytics')
export class WorkflowAnalyticsController {
    constructor(
        private readonly analyticsService: WorkflowAnalyticsService,
        private readonly slaService: SLAService,
    ) { }

    @Get('metrics')
    getMetrics() {
        return {
            success: true,
            data: this.analyticsService.getWorkflowMetrics(),
        };
    }

    @Get('sla/active')
    getActiveSLAs() {
        return {
            success: true,
            data: this.slaService.getAllActiveSLAs(),
        };
    }

    @Get('sla/breached')
    getBreachedSLAs() {
        return {
            success: true,
            data: this.slaService.getBreachedSLAs(),
        };
    }

    @Get('sla/warnings')
    getWarningSLAs() {
        return {
            success: true,
            data: this.slaService.getWarningSLAs(),
        };
    }

    @Get('workflow/:id')
    getWorkflowPerformance(@Param('id') id: string) {
        return {
            success: true,
            data: this.analyticsService.getWorkflowPerformance(id),
        };
    }

    @Post('cleanup')
    cleanupOldData() {
        this.analyticsService.clearOldData(90);
        return {
            success: true,
            message: 'Old data cleaned up successfully',
        };
    }
}
