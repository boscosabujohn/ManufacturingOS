import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ReportsManagementService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // REPORT TEMPLATES
  // ============================================

  async getReportTemplates(params: {
    companyId: string;
    category?: string;
    reportType?: string;
    search?: string;
  }) {
    const { companyId, category, reportType, search } = params;

    return this.prisma.reportTemplate.findMany({
      where: {
        companyId,
        isActive: true,
        ...(category && { category }),
        ...(reportType && { reportType }),
        ...(search && {
          OR: [
            { templateName: { contains: search, mode: 'insensitive' as const } },
            { description: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      },
      orderBy: [{ category: 'asc' }, { templateName: 'asc' }],
    });
  }

  async getReportTemplateById(id: string, companyId: string) {
    return this.prisma.reportTemplate.findFirst({
      where: { id, companyId },
      include: {
        savedReports: { where: { isActive: true }, take: 5 },
        schedules: { where: { isActive: true }, take: 5 },
      },
    });
  }

  async createReportTemplate(data: {
    companyId: string;
    templateCode: string;
    templateName: string;
    description?: string;
    category: string;
    subCategory?: string;
    reportType: string;
    dataSource: string;
    defaultFilters?: Prisma.InputJsonValue;
    availableFilters?: Prisma.InputJsonValue;
    columns?: Prisma.InputJsonValue;
    chartConfig?: Prisma.InputJsonValue;
    outputFormats?: string[];
  }) {
    return this.prisma.reportTemplate.create({
      data: {
        templateCode: data.templateCode,
        templateName: data.templateName,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        reportType: data.reportType,
        dataSource: data.dataSource,
        defaultFilters: data.defaultFilters,
        availableFilters: data.availableFilters,
        columns: data.columns,
        chartConfig: data.chartConfig,
        outputFormats: data.outputFormats || ['pdf', 'excel'],
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // SAVED REPORTS
  // ============================================

  async getSavedReports(params: {
    companyId: string;
    category?: string;
    createdById?: string;
    isFavorite?: boolean;
    isShared?: boolean;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, category, createdById, isFavorite, isShared, search, page = 1, limit = 20 } = params;

    const where: Prisma.SavedReportWhereInput = {
      companyId,
      isActive: true,
      ...(category && { category }),
      ...(createdById && { createdById }),
      ...(isFavorite !== undefined && { isFavorite }),
      ...(isShared !== undefined && { isShared }),
      ...(search && {
        OR: [
          { reportName: { contains: search, mode: 'insensitive' as const } },
          { description: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [reports, total] = await Promise.all([
      this.prisma.savedReport.findMany({
        where,
        include: {
          template: { select: { templateName: true, category: true } },
        },
        orderBy: { updatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.savedReport.count({ where }),
    ]);

    return { reports, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async getSavedReportById(id: string, companyId: string) {
    return this.prisma.savedReport.findFirst({
      where: { id, companyId },
      include: {
        template: true,
        schedules: { where: { isActive: true } },
        executions: { orderBy: { startedAt: 'desc' }, take: 10 },
      },
    });
  }

  async createSavedReport(data: {
    companyId: string;
    reportCode: string;
    reportName: string;
    description?: string;
    templateId?: string;
    category: string;
    filters?: Prisma.InputJsonValue;
    columns?: Prisma.InputJsonValue;
    chartConfig?: Prisma.InputJsonValue;
    sortOrder?: Prisma.InputJsonValue;
    groupBy?: string[];
    dateRangeType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    outputFormat?: string;
    createdById: string;
    createdByName?: string;
  }) {
    return this.prisma.savedReport.create({
      data: {
        reportCode: data.reportCode,
        reportName: data.reportName,
        description: data.description,
        templateId: data.templateId,
        category: data.category,
        filters: data.filters,
        columns: data.columns,
        chartConfig: data.chartConfig,
        sortOrder: data.sortOrder,
        groupBy: data.groupBy || [],
        dateRangeType: data.dateRangeType,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        outputFormat: data.outputFormat || 'pdf',
        createdById: data.createdById,
        createdByName: data.createdByName,
        companyId: data.companyId,
      },
    });
  }

  async updateSavedReport(id: string, companyId: string, data: Partial<{
    reportName: string;
    description: string;
    filters: Prisma.InputJsonValue;
    columns: Prisma.InputJsonValue;
    chartConfig: Prisma.InputJsonValue;
    sortOrder: Prisma.InputJsonValue;
    groupBy: string[];
    dateRangeType: string;
    dateFrom: Date;
    dateTo: Date;
    outputFormat: string;
    isFavorite: boolean;
    isShared: boolean;
    sharedWith: string[];
  }>) {
    return this.prisma.savedReport.update({
      where: { id },
      data,
    });
  }

  async deleteSavedReport(id: string, companyId: string) {
    return this.prisma.savedReport.update({
      where: { id },
      data: { isActive: false },
    });
  }

  async toggleFavorite(id: string, companyId: string) {
    const report = await this.prisma.savedReport.findFirst({ where: { id, companyId } });
    if (!report) throw new Error('Report not found');

    return this.prisma.savedReport.update({
      where: { id },
      data: { isFavorite: !report.isFavorite },
    });
  }

  // ============================================
  // REPORT SCHEDULES
  // ============================================

  async getReportSchedules(params: {
    companyId: string;
    status?: string;
    frequency?: string;
    savedReportId?: string;
  }) {
    const { companyId, status, frequency, savedReportId } = params;

    return this.prisma.reportSchedule.findMany({
      where: {
        companyId,
        isActive: true,
        ...(status && { status }),
        ...(frequency && { frequency }),
        ...(savedReportId && { savedReportId }),
      },
      include: {
        savedReport: { select: { reportName: true, category: true } },
        template: { select: { templateName: true } },
      },
      orderBy: { nextRunAt: 'asc' },
    });
  }

  async getReportScheduleById(id: string, companyId: string) {
    return this.prisma.reportSchedule.findFirst({
      where: { id, companyId },
      include: {
        savedReport: true,
        template: true,
        executions: { orderBy: { startedAt: 'desc' }, take: 10 },
      },
    });
  }

  async createReportSchedule(data: {
    companyId: string;
    scheduleCode: string;
    scheduleName: string;
    description?: string;
    savedReportId?: string;
    templateId?: string;
    frequency: string;
    cronExpression?: string;
    dayOfWeek?: number;
    dayOfMonth?: number;
    hour?: number;
    minute?: number;
    timezone?: string;
    reportPeriod?: string;
    deliveryMethod?: string;
    recipients?: Prisma.InputJsonValue;
    emailSubject?: string;
    outputFormat?: string;
    createdById?: string;
  }) {
    const nextRunAt = this.calculateNextRunTime(data);

    return this.prisma.reportSchedule.create({
      data: {
        scheduleCode: data.scheduleCode,
        scheduleName: data.scheduleName,
        description: data.description,
        savedReportId: data.savedReportId,
        templateId: data.templateId,
        frequency: data.frequency,
        cronExpression: data.cronExpression,
        dayOfWeek: data.dayOfWeek,
        dayOfMonth: data.dayOfMonth,
        hour: data.hour ?? 8,
        minute: data.minute ?? 0,
        timezone: data.timezone || 'UTC',
        reportPeriod: data.reportPeriod,
        deliveryMethod: data.deliveryMethod || 'email',
        recipients: data.recipients,
        emailSubject: data.emailSubject,
        outputFormat: data.outputFormat || 'pdf',
        nextRunAt,
        createdById: data.createdById,
        companyId: data.companyId,
      },
    });
  }

  async updateReportSchedule(id: string, companyId: string, data: Partial<{
    scheduleName: string;
    description: string;
    frequency: string;
    dayOfWeek: number;
    dayOfMonth: number;
    hour: number;
    minute: number;
    recipients: Prisma.InputJsonValue;
    emailSubject: string;
    outputFormat: string;
    status: string;
  }>) {
    return this.prisma.reportSchedule.update({
      where: { id },
      data,
    });
  }

  async toggleScheduleStatus(id: string, companyId: string) {
    const schedule = await this.prisma.reportSchedule.findFirst({ where: { id, companyId } });
    if (!schedule) throw new Error('Schedule not found');

    const newStatus = schedule.status === 'active' ? 'paused' : 'active';
    return this.prisma.reportSchedule.update({
      where: { id },
      data: { status: newStatus },
    });
  }

  private calculateNextRunTime(data: { frequency: string; hour?: number; minute?: number; dayOfWeek?: number; dayOfMonth?: number }): Date {
    const now = new Date();
    const next = new Date(now);
    next.setHours(data.hour ?? 8, data.minute ?? 0, 0, 0);

    if (next <= now) {
      switch (data.frequency) {
        case 'daily':
          next.setDate(next.getDate() + 1);
          break;
        case 'weekly':
          next.setDate(next.getDate() + 7);
          break;
        case 'monthly':
          next.setMonth(next.getMonth() + 1);
          break;
        default:
          next.setDate(next.getDate() + 1);
      }
    }
    return next;
  }

  // ============================================
  // REPORT EXECUTIONS
  // ============================================

  async getReportExecutions(params: {
    companyId: string;
    savedReportId?: string;
    scheduleId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }) {
    const { companyId, savedReportId, scheduleId, status, dateFrom, dateTo, page = 1, limit = 20 } = params;

    const where: Prisma.ReportExecutionWhereInput = {
      companyId,
      ...(savedReportId && { savedReportId }),
      ...(scheduleId && { scheduleId }),
      ...(status && { status }),
      ...(dateFrom && { startedAt: { gte: dateFrom } }),
      ...(dateTo && { startedAt: { lte: dateTo } }),
    };

    const [executions, total] = await Promise.all([
      this.prisma.reportExecution.findMany({
        where,
        include: {
          savedReport: { select: { reportName: true } },
          schedule: { select: { scheduleName: true } },
        },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.reportExecution.count({ where }),
    ]);

    return { executions, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async createReportExecution(data: {
    companyId: string;
    executionCode: string;
    savedReportId?: string;
    scheduleId?: string;
    executionType: string;
    filters?: Prisma.InputJsonValue;
    dateFrom?: Date;
    dateTo?: Date;
    outputFormat?: string;
    executedById?: string;
    executedByName?: string;
  }) {
    return this.prisma.reportExecution.create({
      data: {
        executionCode: data.executionCode,
        savedReportId: data.savedReportId,
        scheduleId: data.scheduleId,
        executionType: data.executionType,
        status: 'running',
        filters: data.filters,
        dateFrom: data.dateFrom,
        dateTo: data.dateTo,
        outputFormat: data.outputFormat,
        executedById: data.executedById,
        executedByName: data.executedByName,
        companyId: data.companyId,
      },
    });
  }

  async updateReportExecution(id: string, data: Partial<{
    status: string;
    completedAt: Date;
    durationMs: number;
    resultFileUrl: string;
    resultFileName: string;
    resultFileSize: number;
    recordCount: number;
    errorMessage: string;
    errorDetails: Prisma.InputJsonValue;
    deliveryStatus: string;
    deliveredTo: Prisma.InputJsonValue;
    deliveredAt: Date;
  }>) {
    return this.prisma.reportExecution.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // ANALYTICS DASHBOARDS
  // ============================================

  async getAnalyticsDashboards(params: {
    companyId: string;
    category?: string;
    createdById?: string;
    isPublic?: boolean;
  }) {
    const { companyId, category, createdById, isPublic } = params;

    return this.prisma.analyticsDashboard.findMany({
      where: {
        companyId,
        isActive: true,
        ...(category && { category }),
        ...(createdById && { createdById }),
        ...(isPublic !== undefined && { isPublic }),
      },
      orderBy: [{ isDefault: 'desc' }, { viewCount: 'desc' }],
    });
  }

  async getAnalyticsDashboardById(id: string, companyId: string) {
    const dashboard = await this.prisma.analyticsDashboard.findFirst({
      where: { id, companyId },
    });

    if (dashboard) {
      await this.prisma.analyticsDashboard.update({
        where: { id },
        data: {
          viewCount: { increment: 1 },
          lastViewedAt: new Date(),
        },
      });
    }

    return dashboard;
  }

  async createAnalyticsDashboard(data: {
    companyId: string;
    dashboardCode: string;
    dashboardName: string;
    description?: string;
    category?: string;
    layout?: Prisma.InputJsonValue;
    widgets?: Prisma.InputJsonValue;
    isDefault?: boolean;
    isPublic?: boolean;
    createdById: string;
    createdByName?: string;
  }) {
    return this.prisma.analyticsDashboard.create({
      data: {
        dashboardCode: data.dashboardCode,
        dashboardName: data.dashboardName,
        description: data.description,
        category: data.category,
        layout: data.layout,
        widgets: data.widgets,
        isDefault: data.isDefault || false,
        isPublic: data.isPublic ?? true,
        createdById: data.createdById,
        createdByName: data.createdByName,
        companyId: data.companyId,
      },
    });
  }

  async updateAnalyticsDashboard(id: string, companyId: string, data: Partial<{
    dashboardName: string;
    description: string;
    layout: Prisma.InputJsonValue;
    widgets: Prisma.InputJsonValue;
    isDefault: boolean;
    isPublic: boolean;
    isFavorite: boolean;
    autoRefresh: boolean;
    refreshInterval: number;
  }>) {
    return this.prisma.analyticsDashboard.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // KPI MANAGEMENT
  // ============================================

  async getKPIDefinitions(params: {
    companyId: string;
    category?: string;
  }) {
    const { companyId, category } = params;

    return this.prisma.kPIDefinition.findMany({
      where: {
        companyId,
        isActive: true,
        ...(category && { category }),
      },
      include: {
        values: {
          orderBy: { periodStart: 'desc' },
          take: 12,
        },
      },
      orderBy: [{ category: 'asc' }, { kpiName: 'asc' }],
    });
  }

  async getKPIDefinitionById(id: string, companyId: string) {
    return this.prisma.kPIDefinition.findFirst({
      where: { id, companyId },
      include: {
        values: {
          orderBy: { periodStart: 'desc' },
          take: 24,
        },
      },
    });
  }

  async createKPIDefinition(data: {
    companyId: string;
    kpiCode: string;
    kpiName: string;
    description?: string;
    category: string;
    subCategory?: string;
    formula?: string;
    dataSource: string;
    aggregationType: string;
    unit?: string;
    targetValue?: number;
    targetType?: string;
    warningThreshold?: number;
    criticalThreshold?: number;
    thresholdDirection?: string;
    displayFormat?: string;
    chartType?: string;
    periodType?: string;
  }) {
    return this.prisma.kPIDefinition.create({
      data: {
        kpiCode: data.kpiCode,
        kpiName: data.kpiName,
        description: data.description,
        category: data.category,
        subCategory: data.subCategory,
        formula: data.formula,
        dataSource: data.dataSource,
        aggregationType: data.aggregationType,
        unit: data.unit,
        targetValue: data.targetValue,
        targetType: data.targetType,
        warningThreshold: data.warningThreshold,
        criticalThreshold: data.criticalThreshold,
        thresholdDirection: data.thresholdDirection || 'above',
        displayFormat: data.displayFormat,
        chartType: data.chartType,
        periodType: data.periodType || 'monthly',
        companyId: data.companyId,
      },
    });
  }

  async recordKPIValue(data: {
    companyId: string;
    kpiId: string;
    periodType: string;
    periodStart: Date;
    periodEnd: Date;
    actualValue: number;
    targetValue?: number;
    previousValue?: number;
    breakdown?: Prisma.InputJsonValue;
  }) {
    const variance = data.targetValue ? data.actualValue - data.targetValue : undefined;
    const variancePercent = data.targetValue && data.targetValue !== 0
      ? ((data.actualValue - data.targetValue) / data.targetValue) * 100
      : undefined;

    const trend = data.previousValue
      ? data.actualValue > data.previousValue ? 'up' : data.actualValue < data.previousValue ? 'down' : 'flat'
      : undefined;
    const trendPercent = data.previousValue && data.previousValue !== 0
      ? ((data.actualValue - data.previousValue) / data.previousValue) * 100
      : undefined;

    return this.prisma.kPIValue.upsert({
      where: {
        kpiId_periodType_periodStart_companyId: {
          kpiId: data.kpiId,
          periodType: data.periodType,
          periodStart: data.periodStart,
          companyId: data.companyId,
        },
      },
      update: {
        actualValue: data.actualValue,
        targetValue: data.targetValue,
        previousValue: data.previousValue,
        variance,
        variancePercent,
        trend,
        trendPercent,
        breakdown: data.breakdown,
        calculatedAt: new Date(),
      },
      create: {
        kpiId: data.kpiId,
        periodType: data.periodType,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        actualValue: data.actualValue,
        targetValue: data.targetValue,
        previousValue: data.previousValue,
        variance,
        variancePercent,
        trend,
        trendPercent,
        breakdown: data.breakdown,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // ANALYTICS SNAPSHOTS
  // ============================================

  async getFinanceAnalytics(companyId: string, periodType: string, limit = 12) {
    return this.prisma.financeAnalyticsSnapshot.findMany({
      where: { companyId, periodType },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
    });
  }

  async getSalesAnalytics(companyId: string, periodType: string, limit = 12) {
    return this.prisma.salesAnalyticsSnapshot.findMany({
      where: { companyId, periodType },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
    });
  }

  async getInventoryAnalytics(companyId: string, periodType: string, limit = 12) {
    return this.prisma.inventoryAnalyticsSnapshot.findMany({
      where: { companyId, periodType },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
    });
  }

  async getHRAnalytics(companyId: string, periodType: string, limit = 12) {
    return this.prisma.hRAnalyticsSnapshot.findMany({
      where: { companyId, periodType },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
    });
  }

  async getProductionAnalytics(companyId: string, periodType: string, limit = 12) {
    return this.prisma.productionAnalyticsSnapshot.findMany({
      where: { companyId, periodType },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
    });
  }

  async getQualityAnalytics(companyId: string, periodType: string, limit = 12) {
    return this.prisma.qualityAnalyticsSnapshot.findMany({
      where: { companyId, periodType },
      orderBy: { snapshotDate: 'desc' },
      take: limit,
    });
  }

  // ============================================
  // REPORTS OVERVIEW DASHBOARD
  // ============================================

  async getReportsOverview(companyId: string) {
    const [
      totalReports,
      favoriteReports,
      scheduledReports,
      recentExecutions,
      dashboards,
    ] = await Promise.all([
      this.prisma.savedReport.count({ where: { companyId, isActive: true } }),
      this.prisma.savedReport.count({ where: { companyId, isActive: true, isFavorite: true } }),
      this.prisma.reportSchedule.count({ where: { companyId, isActive: true, status: 'active' } }),
      this.prisma.reportExecution.findMany({
        where: { companyId },
        orderBy: { startedAt: 'desc' },
        take: 5,
        include: {
          savedReport: { select: { reportName: true } },
        },
      }),
      this.prisma.analyticsDashboard.count({ where: { companyId, isActive: true } }),
    ]);

    return {
      totalReports,
      favoriteReports,
      scheduledReports,
      recentExecutions,
      dashboards,
    };
  }

  async getReportsByCategory(companyId: string) {
    const reports = await this.prisma.savedReport.groupBy({
      by: ['category'],
      where: { companyId, isActive: true },
      _count: { id: true },
    });

    return reports.map(r => ({
      category: r.category,
      count: r._count.id,
    }));
  }

  // ============================================
  // SETTINGS
  // ============================================

  async getReportsSettings(companyId: string) {
    let settings = await this.prisma.reportsModuleSettings.findFirst({
      where: { companyId },
    });

    if (!settings) {
      settings = await this.prisma.reportsModuleSettings.create({
        data: {
          companyId,
          defaultDateRange: 'month',
          defaultOutputFormat: 'pdf',
          fiscalYearStart: 4,
          reportStorageDays: 90,
          snapshotRetentionDays: 365,
          maxScheduledReports: 50,
          enableScheduling: true,
          enableSharing: true,
          enableExport: true,
          enableDrilldown: true,
        },
      });
    }

    return settings;
  }

  async updateReportsSettings(companyId: string, data: Partial<{
    defaultDateRange: string;
    defaultOutputFormat: string;
    fiscalYearStart: number;
    emailFromName: string;
    emailFromAddress: string;
    reportStorageDays: number;
    snapshotRetentionDays: number;
    maxScheduledReports: number;
    enableScheduling: boolean;
    enableSharing: boolean;
    enableExport: boolean;
    enableDrilldown: boolean;
    reportLogo: string;
    reportHeaderText: string;
    reportFooterText: string;
  }>) {
    const existing = await this.prisma.reportsModuleSettings.findFirst({
      where: { companyId },
    });

    if (existing) {
      return this.prisma.reportsModuleSettings.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.reportsModuleSettings.create({
      data: {
        companyId,
        ...data,
      },
    });
  }

  // ============================================
  // FAVORITES
  // ============================================

  async getUserFavorites(companyId: string, userId: string) {
    return this.prisma.reportFavorite.findMany({
      where: { companyId, userId },
      orderBy: { displayOrder: 'asc' },
    });
  }

  async addToFavorites(companyId: string, userId: string, userName: string, data: {
    savedReportId?: string;
    dashboardId?: string;
    templateId?: string;
  }) {
    const maxOrder = await this.prisma.reportFavorite.aggregate({
      where: { companyId, userId },
      _max: { displayOrder: true },
    });

    return this.prisma.reportFavorite.create({
      data: {
        userId,
        userName,
        savedReportId: data.savedReportId,
        dashboardId: data.dashboardId,
        templateId: data.templateId,
        displayOrder: (maxOrder._max.displayOrder || 0) + 1,
        companyId,
      },
    });
  }

  async removeFromFavorites(companyId: string, userId: string, favoriteId: string) {
    return this.prisma.reportFavorite.delete({
      where: { id: favoriteId },
    });
  }
}
