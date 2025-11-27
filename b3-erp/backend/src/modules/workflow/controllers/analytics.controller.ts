
import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Workflow - Analytics')
@Controller('api/workflow/analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    @Get('phase-duration')
    @ApiOperation({ summary: 'Get average duration per phase' })
    async getPhaseDuration(@Query('projectId') projectId?: string) {
        return this.analyticsService.getAveragePhaseDuration(projectId);
    }

    @Get('defects')
    @ApiOperation({ summary: 'Get defect statistics' })
    async getDefectStats(@Query('projectId') projectId?: string) {
        return this.analyticsService.getDefectStats(projectId);
    }

    @Get('approvals')
    @ApiOperation({ summary: 'Get approval statistics' })
    async getApprovalStats(@Query('projectId') projectId?: string) {
        return this.analyticsService.getApprovalStats(projectId);
    }
}
