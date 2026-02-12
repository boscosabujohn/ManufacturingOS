import { Injectable, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class BacklogService {
    private readonly logger = new Logger(BacklogService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Backlog Snapshots
    // ============================================================================

    async createSnapshot(companyId: string) {
        // Get current ticket counts by status
        const statusCounts = await this.prisma.crmSupportTicket.groupBy({
            by: ['status'],
            where: { companyId, isActive: true },
            _count: true,
        });

        // Get counts by priority
        const priorityCounts = await this.prisma.crmSupportTicket.groupBy({
            by: ['priority'],
            where: { companyId, isActive: true, status: { notIn: ['resolved', 'closed'] } },
            _count: true,
        });

        // Get counts by source/channel
        const channelCounts = await this.prisma.crmSupportTicket.groupBy({
            by: ['source'],
            where: { companyId, isActive: true },
            _count: true,
        });

        // Get counts by category
        const categoryCounts = await this.prisma.crmSupportTicket.groupBy({
            by: ['category'],
            where: { companyId, isActive: true, status: { notIn: ['resolved', 'closed'] } },
            _count: true,
        });

        // Get SLA metrics
        const slaMetrics = await this.prisma.crmSupportTicket.groupBy({
            by: ['status'],
            where: {
                companyId,
                isActive: true,
                status: { notIn: ['resolved', 'closed'] },
                resolutionDeadline: { lt: new Date() },
            },
            _count: true,
        });

        const slaBreached = slaMetrics.reduce((sum, m) => sum + m._count, 0);

        // Calculate at-risk (within 2 hours of deadline)
        const twoHoursFromNow = new Date();
        twoHoursFromNow.setHours(twoHoursFromNow.getHours() + 2);

        const slaAtRisk = await this.prisma.crmSupportTicket.count({
            where: {
                companyId,
                isActive: true,
                status: { notIn: ['resolved', 'closed'] },
                resolutionDeadline: {
                    gte: new Date(),
                    lte: twoHoursFromNow,
                },
            },
        });

        // Calculate average age of open tickets
        const openTickets = await this.prisma.crmSupportTicket.findMany({
            where: {
                companyId,
                isActive: true,
                status: { notIn: ['resolved', 'closed'] },
            },
            select: { createdAt: true },
        });

        const now = new Date().getTime();
        const avgAgeHours = openTickets.length > 0
            ? openTickets.reduce((sum, t) => sum + (now - t.createdAt.getTime()) / (1000 * 60 * 60), 0) / openTickets.length
            : 0;

        // Build snapshot data
        const statusMap: Record<string, number> = {};
        statusCounts.forEach(s => { statusMap[s.status] = s._count; });

        const priorityMap: Record<string, number> = {};
        priorityCounts.forEach(p => { priorityMap[p.priority] = p._count; });

        const channelMetrics: Record<string, number> = {};
        channelCounts.forEach(c => { channelMetrics[c.source || 'unknown'] = c._count; });

        const categoryMetrics: Record<string, number> = {};
        categoryCounts.forEach(c => { categoryMetrics[c.category || 'uncategorized'] = c._count; });

        return this.prisma.backlogSnapshot.create({
            data: {
                totalOpen: statusMap['open'] || 0,
                totalInProgress: statusMap['in_progress'] || 0,
                totalPending: statusMap['pending'] || 0,
                totalResolved: statusMap['resolved'] || 0,
                totalClosed: statusMap['closed'] || 0,
                priorityCritical: priorityMap['critical'] || 0,
                priorityHigh: priorityMap['high'] || 0,
                priorityMedium: priorityMap['medium'] || 0,
                priorityLow: priorityMap['low'] || 0,
                channelMetrics,
                categoryMetrics,
                slaAtRisk,
                slaBreached,
                avgAgeHours,
                companyId,
            },
        });
    }

    async getSnapshots(companyId: string, options?: {
        fromDate?: Date;
        toDate?: Date;
        limit?: number;
    }) {
        const where: Prisma.BacklogSnapshotWhereInput = { companyId };

        if (options?.fromDate || options?.toDate) {
            where.snapshotDate = {};
            if (options.fromDate) where.snapshotDate.gte = options.fromDate;
            if (options.toDate) where.snapshotDate.lte = options.toDate;
        }

        return this.prisma.backlogSnapshot.findMany({
            where,
            take: options?.limit || 30,
            orderBy: { snapshotDate: 'desc' },
        });
    }

    async getLatestSnapshot(companyId: string) {
        return this.prisma.backlogSnapshot.findFirst({
            where: { companyId },
            orderBy: { snapshotDate: 'desc' },
        });
    }

    // ============================================================================
    // Backlog Analytics
    // ============================================================================

    async getBacklogTrend(companyId: string, days = 30) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);

        const snapshots = await this.prisma.backlogSnapshot.findMany({
            where: {
                companyId,
                snapshotDate: { gte: fromDate },
            },
            orderBy: { snapshotDate: 'asc' },
            select: {
                snapshotDate: true,
                totalOpen: true,
                totalInProgress: true,
                totalPending: true,
                slaAtRisk: true,
                slaBreached: true,
                avgAgeHours: true,
            },
        });

        return snapshots.map(s => ({
            date: s.snapshotDate.toISOString().split('T')[0],
            open: s.totalOpen,
            inProgress: s.totalInProgress,
            pending: s.totalPending,
            total: s.totalOpen + s.totalInProgress + s.totalPending,
            slaAtRisk: s.slaAtRisk,
            slaBreached: s.slaBreached,
            avgAgeHours: Math.round(s.avgAgeHours || 0),
        }));
    }

    async getBacklogForecast(companyId: string, forecastDays = 7) {
        // Get historical data for the past 30 days
        const historicalDays = 30;
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - historicalDays);

        const snapshots = await this.prisma.backlogSnapshot.findMany({
            where: {
                companyId,
                snapshotDate: { gte: fromDate },
            },
            orderBy: { snapshotDate: 'asc' },
            select: {
                snapshotDate: true,
                totalOpen: true,
                totalInProgress: true,
                totalPending: true,
            },
        });

        if (snapshots.length < 7) {
            return {
                forecast: [],
                confidence: 'low',
                message: 'Insufficient historical data for accurate forecasting',
            };
        }

        // Calculate daily change rate
        const totalBacklogs = snapshots.map(s => s.totalOpen + s.totalInProgress + s.totalPending);
        const changes: number[] = [];
        for (let i = 1; i < totalBacklogs.length; i++) {
            changes.push(totalBacklogs[i] - totalBacklogs[i - 1]);
        }

        // Calculate average and standard deviation
        const avgChange = changes.reduce((sum, c) => sum + c, 0) / changes.length;
        const variance = changes.reduce((sum, c) => sum + Math.pow(c - avgChange, 2), 0) / changes.length;
        const stdDev = Math.sqrt(variance);

        // Generate forecast
        const lastBacklog = totalBacklogs[totalBacklogs.length - 1];
        const forecast: Array<{
            date: string;
            predicted: number;
            lower: number;
            upper: number;
        }> = [];

        for (let i = 1; i <= forecastDays; i++) {
            const date = new Date();
            date.setDate(date.getDate() + i);

            const predicted = Math.max(0, Math.round(lastBacklog + avgChange * i));
            const uncertainty = stdDev * Math.sqrt(i);

            forecast.push({
                date: date.toISOString().split('T')[0],
                predicted,
                lower: Math.max(0, Math.round(predicted - uncertainty * 1.96)),
                upper: Math.round(predicted + uncertainty * 1.96),
            });
        }

        // Determine confidence level
        const coefficientOfVariation = changes.length > 0 ? Math.abs(stdDev / avgChange) : 1;
        let confidence: 'high' | 'medium' | 'low';
        if (coefficientOfVariation < 0.3) {
            confidence = 'high';
        } else if (coefficientOfVariation < 0.6) {
            confidence = 'medium';
        } else {
            confidence = 'low';
        }

        return {
            forecast,
            confidence,
            historicalAvgChange: Math.round(avgChange * 10) / 10,
            currentBacklog: lastBacklog,
        };
    }

    async getBacklogByCategory(companyId: string) {
        const latest = await this.getLatestSnapshot(companyId);
        if (!latest || !latest.categoryMetrics) {
            return [];
        }

        const metrics = latest.categoryMetrics as Record<string, number>;
        const total = Object.values(metrics).reduce((sum, v) => sum + v, 0);

        return Object.entries(metrics)
            .map(([category, count]) => ({
                category,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count);
    }

    async getBacklogByChannel(companyId: string) {
        const latest = await this.getLatestSnapshot(companyId);
        if (!latest || !latest.channelMetrics) {
            return [];
        }

        const metrics = latest.channelMetrics as Record<string, number>;
        const total = Object.values(metrics).reduce((sum, v) => sum + v, 0);

        return Object.entries(metrics)
            .map(([channel, count]) => ({
                channel,
                count,
                percentage: total > 0 ? Math.round((count / total) * 100) : 0,
            }))
            .sort((a, b) => b.count - a.count);
    }

    // ============================================================================
    // Workload Analysis
    // ============================================================================

    async getAgentWorkload(companyId: string) {
        const workload = await this.prisma.crmSupportTicket.groupBy({
            by: ['assignedToId', 'assignedToName'],
            where: {
                companyId,
                isActive: true,
                status: { notIn: ['resolved', 'closed'] },
                assignedToId: { not: null },
            },
            _count: true,
        });

        // Get priority breakdown per agent
        const priorityBreakdown = await this.prisma.crmSupportTicket.groupBy({
            by: ['assignedToId', 'priority'],
            where: {
                companyId,
                isActive: true,
                status: { notIn: ['resolved', 'closed'] },
                assignedToId: { not: null },
            },
            _count: true,
        });

        const agentMap: Record<string, {
            id: string;
            name: string;
            total: number;
            byPriority: Record<string, number>;
        }> = {};

        workload.forEach(w => {
            if (w.assignedToId) {
                agentMap[w.assignedToId] = {
                    id: w.assignedToId,
                    name: w.assignedToName || 'Unknown',
                    total: w._count,
                    byPriority: {},
                };
            }
        });

        priorityBreakdown.forEach(p => {
            if (p.assignedToId && agentMap[p.assignedToId]) {
                agentMap[p.assignedToId].byPriority[p.priority] = p._count;
            }
        });

        return Object.values(agentMap).sort((a, b) => b.total - a.total);
    }

    async getCapacityUtilization(companyId: string, agentCapacity = 20) {
        const workload = await this.getAgentWorkload(companyId);
        const totalAgents = workload.length;
        const totalCapacity = totalAgents * agentCapacity;
        const totalTickets = workload.reduce((sum, w) => sum + w.total, 0);

        const utilizationPercent = totalCapacity > 0
            ? Math.round((totalTickets / totalCapacity) * 100)
            : 0;

        const overloadedAgents = workload.filter(w => w.total > agentCapacity);
        const underutilizedAgents = workload.filter(w => w.total < agentCapacity * 0.5);

        return {
            totalAgents,
            totalCapacity,
            totalTickets,
            utilizationPercent,
            overloadedCount: overloadedAgents.length,
            underutilizedCount: underutilizedAgents.length,
            status: utilizationPercent > 90 ? 'critical' :
                    utilizationPercent > 70 ? 'warning' : 'healthy',
        };
    }
}
