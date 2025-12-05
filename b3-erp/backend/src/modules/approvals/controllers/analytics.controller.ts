import { Controller, Get, Query } from '@nestjs/common';
import { AnalyticsService } from '../services/analytics.service';

@Controller('api/analytics')
export class AnalyticsController {
    constructor(private readonly analyticsService: AnalyticsService) { }

    /**
     * Get SLA metrics
     */
    @Get('/sla-metrics')
    async getSLAMetrics(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : this.getDefaultStartDate();
        const end = endDate ? new Date(endDate) : new Date();

        return this.analyticsService.getSLAMetrics(start, end);
    }

    /**
     * Get workflow performance
     */
    @Get('/workflow-performance')
    async getWorkflowPerformance(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : this.getDefaultStartDate();
        const end = endDate ? new Date(endDate) : new Date();

        return this.analyticsService.getWorkflowPerformance(start, end);
    }

    /**
     * Get trend data
     */
    @Get('/trends')
    async getTrendData(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('granularity') granularity: 'day' | 'week' | 'month' = 'week',
    ) {
        const start = startDate ? new Date(startDate) : this.getDefaultStartDate();
        const end = endDate ? new Date(endDate) : new Date();

        return this.analyticsService.getTrendData(start, end, granularity);
    }

    /**
     * Get approver performance
     */
    @Get('/approver-performance')
    async getApproverPerformance(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : this.getDefaultStartDate();
        const end = endDate ? new Date(endDate) : new Date();

        return this.analyticsService.getApproverPerformance(start, end);
    }

    /**
     * Get delay analysis
     */
    @Get('/delay-analysis')
    async getDelayAnalysis(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
    ) {
        const start = startDate ? new Date(startDate) : this.getDefaultStartDate();
        const end = endDate ? new Date(endDate) : new Date();

        return this.analyticsService.getDelayAnalysis(start, end);
    }

    /**
     * Get comprehensive dashboard data (all metrics in one call)
     */
    @Get('/dashboard')
    async getDashboardData(
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string,
        @Query('granularity') granularity: 'day' | 'week' | 'month' = 'week',
    ) {
        const start = startDate ? new Date(startDate) : this.getDefaultStartDate();
        const end = endDate ? new Date(endDate) : new Date();

        const [
            slaMetrics,
            workflowPerformance,
            trends,
            approverPerformance,
            delayAnalysis,
        ] = await Promise.all([
            this.analyticsService.getSLAMetrics(start, end),
            this.analyticsService.getWorkflowPerformance(start, end),
            this.analyticsService.getTrendData(start, end, granularity),
            this.analyticsService.getApproverPerformance(start, end),
            this.analyticsService.getDelayAnalysis(start, end),
        ]);

        return {
            slaMetrics,
            workflowPerformance,
            trends,
            approverPerformance,
            delayAnalysis,
        };
    }

    /**
     * Helper: Get default start date (30 days ago)
     */
    private getDefaultStartDate(): Date {
        const date = new Date();
        date.setDate(date.getDate() - 30);
        return date;
    }
}
