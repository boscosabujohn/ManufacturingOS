import {
    Controller,
    Get,
    Post,
    Put,
    Delete,
    Patch,
    Param,
    Body,
    Query,
    HttpCode,
    HttpStatus,
    DefaultValuePipe,
    ParseIntPipe,
} from '@nestjs/common';
import {
    ApiTags,
    ApiOperation,
    ApiResponse,
    ApiParam,
    ApiQuery,
    ApiBearerAuth,
} from '@nestjs/swagger';
import { ReportsManagementService } from './services/reports-management.service';

@ApiTags('Reports')
@ApiBearerAuth()
@Controller('reports')
export class ReportsController {
    constructor(private readonly reportsService: ReportsManagementService) { }

    // ─── Overview ─────────────────────────────────────────────────────────────

    @Get('overview')
    @ApiOperation({ summary: 'Get reports module overview / stats dashboard' })
    @ApiQuery({ name: 'companyId', required: true })
    getOverview(@Query('companyId') companyId: string) {
        return this.reportsService.getReportsOverview(companyId);
    }

    @Get('by-category')
    @ApiOperation({ summary: 'Get report counts grouped by category' })
    @ApiQuery({ name: 'companyId', required: true })
    getByCategory(@Query('companyId') companyId: string) {
        return this.reportsService.getReportsByCategory(companyId);
    }

    // ─── Report Templates ─────────────────────────────────────────────────────

    @Get('templates')
    @ApiOperation({ summary: 'List all report templates' })
    @ApiQuery({ name: 'companyId', required: true })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'reportType', required: false })
    @ApiQuery({ name: 'search', required: false })
    getTemplates(
        @Query('companyId') companyId: string,
        @Query('category') category?: string,
        @Query('reportType') reportType?: string,
        @Query('search') search?: string,
    ) {
        return this.reportsService.getReportTemplates({ companyId, category, reportType, search });
    }

    @Get('templates/:id')
    @ApiOperation({ summary: 'Get report template by ID' })
    @ApiParam({ name: 'id', description: 'Template UUID' })
    @ApiQuery({ name: 'companyId', required: true })
    getTemplate(@Param('id') id: string, @Query('companyId') companyId: string) {
        return this.reportsService.getReportTemplateById(id, companyId);
    }

    @Post('templates')
    @ApiOperation({ summary: 'Create a new report template' })
    @ApiResponse({ status: 201, description: 'Template created' })
    createTemplate(@Body() body: any) {
        return this.reportsService.createReportTemplate(body);
    }

    // ─── Saved Reports ────────────────────────────────────────────────────────

    @Get('saved')
    @ApiOperation({ summary: 'List saved reports with pagination' })
    @ApiQuery({ name: 'companyId', required: true })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    @ApiQuery({ name: 'category', required: false })
    @ApiQuery({ name: 'isFavorite', required: false })
    getSavedReports(
        @Query('companyId') companyId: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number,
        @Query('category') category?: string,
        @Query('isFavorite') isFavorite?: boolean,
    ) {
        return this.reportsService.getSavedReports({ companyId, page, limit, category, isFavorite });
    }

    @Get('saved/:id')
    @ApiOperation({ summary: 'Get saved report by ID' })
    @ApiParam({ name: 'id', description: 'Saved report UUID' })
    @ApiQuery({ name: 'companyId', required: true })
    getSavedReport(@Param('id') id: string, @Query('companyId') companyId: string) {
        return this.reportsService.getSavedReportById(id, companyId);
    }

    @Post('saved')
    @ApiOperation({ summary: 'Create a new saved report' })
    createSavedReport(@Body() body: any) {
        return this.reportsService.createSavedReport(body);
    }

    @Put('saved/:id')
    @ApiOperation({ summary: 'Update a saved report' })
    @ApiParam({ name: 'id', description: 'Saved report UUID' })
    updateSavedReport(
        @Param('id') id: string,
        @Body() body: any,
    ) {
        const { companyId, ...data } = body;
        return this.reportsService.updateSavedReport(id, companyId, data);
    }

    @Patch('saved/:id/favorite')
    @ApiOperation({ summary: 'Toggle favorite status of a saved report' })
    @ApiParam({ name: 'id', description: 'Saved report UUID' })
    toggleFavorite(@Param('id') id: string, @Query('companyId') companyId: string) {
        return this.reportsService.toggleFavorite(id, companyId);
    }

    @Delete('saved/:id')
    @HttpCode(HttpStatus.OK)
    @ApiOperation({ summary: 'Soft-delete a saved report' })
    @ApiParam({ name: 'id', description: 'Saved report UUID' })
    deleteSavedReport(@Param('id') id: string, @Query('companyId') companyId: string) {
        return this.reportsService.deleteSavedReport(id, companyId);
    }

    // ─── Report Schedules ─────────────────────────────────────────────────────

    @Get('schedules')
    @ApiOperation({ summary: 'List report schedules' })
    @ApiQuery({ name: 'companyId', required: true })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'frequency', required: false })
    getSchedules(
        @Query('companyId') companyId: string,
        @Query('status') status?: string,
        @Query('frequency') frequency?: string,
    ) {
        return this.reportsService.getReportSchedules({ companyId, status, frequency });
    }

    @Get('schedules/:id')
    @ApiOperation({ summary: 'Get report schedule by ID' })
    @ApiParam({ name: 'id', description: 'Schedule UUID' })
    getSchedule(@Param('id') id: string, @Query('companyId') companyId: string) {
        return this.reportsService.getReportScheduleById(id, companyId);
    }

    @Post('schedules')
    @ApiOperation({ summary: 'Create a new report schedule' })
    createSchedule(@Body() body: any) {
        return this.reportsService.createReportSchedule(body);
    }

    @Put('schedules/:id')
    @ApiOperation({ summary: 'Update a report schedule' })
    updateSchedule(@Param('id') id: string, @Body() body: any) {
        const { companyId, ...data } = body;
        return this.reportsService.updateReportSchedule(id, companyId, data);
    }

    @Patch('schedules/:id/toggle-status')
    @ApiOperation({ summary: 'Toggle active/paused status of a schedule' })
    @ApiParam({ name: 'id', description: 'Schedule UUID' })
    toggleSchedule(@Param('id') id: string, @Query('companyId') companyId: string) {
        return this.reportsService.toggleScheduleStatus(id, companyId);
    }

    // ─── Report Executions ────────────────────────────────────────────────────

    @Get('executions')
    @ApiOperation({ summary: 'List report execution history' })
    @ApiQuery({ name: 'companyId', required: true })
    @ApiQuery({ name: 'savedReportId', required: false })
    @ApiQuery({ name: 'scheduleId', required: false })
    @ApiQuery({ name: 'status', required: false })
    @ApiQuery({ name: 'page', required: false })
    @ApiQuery({ name: 'limit', required: false })
    getExecutions(
        @Query('companyId') companyId: string,
        @Query('savedReportId') savedReportId?: string,
        @Query('scheduleId') scheduleId?: string,
        @Query('status') status?: string,
        @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
        @Query('limit', new DefaultValuePipe(20), ParseIntPipe) limit: number = 20,
    ) {
        return this.reportsService.getReportExecutions({ companyId, savedReportId, scheduleId, status, page, limit });
    }

    @Post('executions')
    @ApiOperation({ summary: 'Trigger a report execution' })
    createExecution(@Body() body: any) {
        return this.reportsService.createReportExecution(body);
    }

    // ─── Analytics Dashboards ─────────────────────────────────────────────────

    @Get('dashboards')
    @ApiOperation({ summary: 'List analytics dashboards' })
    @ApiQuery({ name: 'companyId', required: true })
    @ApiQuery({ name: 'category', required: false })
    getDashboards(
        @Query('companyId') companyId: string,
        @Query('category') category?: string,
    ) {
        return this.reportsService.getAnalyticsDashboards({ companyId, category });
    }

    @Get('dashboards/:id')
    @ApiOperation({ summary: 'Get analytics dashboard by ID' })
    @ApiParam({ name: 'id', description: 'Dashboard UUID' })
    getDashboard(@Param('id') id: string, @Query('companyId') companyId: string) {
        return this.reportsService.getAnalyticsDashboardById(id, companyId);
    }

    @Post('dashboards')
    @ApiOperation({ summary: 'Create a new analytics dashboard' })
    createDashboard(@Body() body: any) {
        return this.reportsService.createAnalyticsDashboard(body);
    }

    @Put('dashboards/:id')
    @ApiOperation({ summary: 'Update an analytics dashboard' })
    updateDashboard(@Param('id') id: string, @Body() body: any) {
        const { companyId, ...data } = body;
        return this.reportsService.updateAnalyticsDashboard(id, companyId, data);
    }

    // ─── KPI Management ───────────────────────────────────────────────────────

    @Get('kpis')
    @ApiOperation({ summary: 'List KPI definitions' })
    @ApiQuery({ name: 'companyId', required: true })
    @ApiQuery({ name: 'category', required: false })
    getKPIs(@Query('companyId') companyId: string, @Query('category') category?: string) {
        return this.reportsService.getKPIDefinitions({ companyId, category });
    }

    @Get('kpis/:id')
    @ApiOperation({ summary: 'Get KPI definition by ID' })
    @ApiParam({ name: 'id', description: 'KPI UUID' })
    getKPI(@Param('id') id: string, @Query('companyId') companyId: string) {
        return this.reportsService.getKPIDefinitionById(id, companyId);
    }

    @Post('kpis')
    @ApiOperation({ summary: 'Create a new KPI definition' })
    createKPI(@Body() body: any) {
        return this.reportsService.createKPIDefinition(body);
    }

    @Post('kpis/values')
    @ApiOperation({ summary: 'Record a KPI value for a reporting period' })
    recordKPIValue(@Body() body: any) {
        return this.reportsService.recordKPIValue(body);
    }

    // ─── Analytics Snapshots ──────────────────────────────────────────────────

    @Get('analytics/finance')
    @ApiOperation({ summary: 'Finance analytics snapshots' })
    @ApiQuery({ name: 'companyId', required: true })
    @ApiQuery({ name: 'periodType', required: true })
    getFinanceAnalytics(
        @Query('companyId') companyId: string,
        @Query('periodType') periodType: string,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    ) {
        return this.reportsService.getFinanceAnalytics(companyId, periodType, limit);
    }

    @Get('analytics/sales')
    @ApiOperation({ summary: 'Sales analytics snapshots' })
    getSalesAnalytics(
        @Query('companyId') companyId: string,
        @Query('periodType') periodType: string,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    ) {
        return this.reportsService.getSalesAnalytics(companyId, periodType, limit);
    }

    @Get('analytics/inventory')
    @ApiOperation({ summary: 'Inventory analytics snapshots' })
    getInventoryAnalytics(
        @Query('companyId') companyId: string,
        @Query('periodType') periodType: string,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    ) {
        return this.reportsService.getInventoryAnalytics(companyId, periodType, limit);
    }

    @Get('analytics/hr')
    @ApiOperation({ summary: 'HR analytics snapshots' })
    getHRAnalytics(
        @Query('companyId') companyId: string,
        @Query('periodType') periodType: string,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    ) {
        return this.reportsService.getHRAnalytics(companyId, periodType, limit);
    }

    @Get('analytics/production')
    @ApiOperation({ summary: 'Production analytics snapshots' })
    getProductionAnalytics(
        @Query('companyId') companyId: string,
        @Query('periodType') periodType: string,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    ) {
        return this.reportsService.getProductionAnalytics(companyId, periodType, limit);
    }

    @Get('analytics/quality')
    @ApiOperation({ summary: 'Quality analytics snapshots' })
    getQualityAnalytics(
        @Query('companyId') companyId: string,
        @Query('periodType') periodType: string,
        @Query('limit', new DefaultValuePipe(12), ParseIntPipe) limit: number,
    ) {
        return this.reportsService.getQualityAnalytics(companyId, periodType, limit);
    }
}
