import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ChannelRoutingService {
    private readonly logger = new Logger(ChannelRoutingService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Support Channels
    // ============================================================================

    async createChannel(data: {
        code: string;
        name: string;
        type: string;
        description?: string;
        priority?: number;
        autoAssign?: boolean;
        defaultTeamId?: string;
        defaultAgentId?: string;
        autoResponseEnabled?: boolean;
        autoResponseTemplate?: string;
        slaOverrideId?: string;
        integrationConfig?: Prisma.InputJsonValue;
        companyId: string;
    }) {
        return this.prisma.supportChannel.create({
            data: {
                code: data.code,
                name: data.name,
                type: data.type,
                description: data.description,
                priority: data.priority || 5,
                autoAssign: data.autoAssign || false,
                defaultTeamId: data.defaultTeamId,
                defaultAgentId: data.defaultAgentId,
                autoResponseEnabled: data.autoResponseEnabled || false,
                autoResponseTemplate: data.autoResponseTemplate,
                slaOverrideId: data.slaOverrideId,
                integrationConfig: data.integrationConfig,
                companyId: data.companyId,
            },
        });
    }

    async getChannels(companyId: string, options?: {
        type?: string;
        isEnabled?: boolean;
    }) {
        const where: Prisma.SupportChannelWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.type) {
            where.type = options.type;
        }
        if (options?.isEnabled !== undefined) {
            where.isEnabled = options.isEnabled;
        }

        return this.prisma.supportChannel.findMany({
            where,
            include: {
                routingRules: {
                    where: { isActive: true },
                    orderBy: { priority: 'asc' },
                },
            },
            orderBy: { name: 'asc' },
        });
    }

    async getChannelById(id: string) {
        const channel = await this.prisma.supportChannel.findUnique({
            where: { id },
            include: {
                routingRules: {
                    where: { isActive: true },
                    orderBy: { priority: 'asc' },
                },
            },
        });
        if (!channel) {
            throw new NotFoundException(`Channel ${id} not found`);
        }
        return channel;
    }

    async updateChannel(id: string, data: Partial<{
        name: string;
        description: string;
        priority: number;
        isEnabled: boolean;
        autoAssign: boolean;
        defaultTeamId: string;
        defaultAgentId: string;
        autoResponseEnabled: boolean;
        autoResponseTemplate: string;
        slaOverrideId: string;
        integrationConfig: Prisma.InputJsonValue;
    }>) {
        return this.prisma.supportChannel.update({
            where: { id },
            data: data as Prisma.SupportChannelUpdateInput,
        });
    }

    async deleteChannel(id: string) {
        return this.prisma.supportChannel.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async updateChannelMetrics(id: string, responseTime: number, resolutionTime: number) {
        const channel = await this.prisma.supportChannel.findUnique({
            where: { id },
            select: { ticketCount: true, avgResponseTime: true, avgResolutionTime: true },
        });

        if (!channel) return;

        const newCount = channel.ticketCount + 1;
        const newAvgResponse = ((channel.avgResponseTime || 0) * channel.ticketCount + responseTime) / newCount;
        const newAvgResolution = ((channel.avgResolutionTime || 0) * channel.ticketCount + resolutionTime) / newCount;

        return this.prisma.supportChannel.update({
            where: { id },
            data: {
                ticketCount: newCount,
                avgResponseTime: newAvgResponse,
                avgResolutionTime: newAvgResolution,
            },
        });
    }

    // ============================================================================
    // Routing Rules
    // ============================================================================

    async createRoutingRule(data: {
        name: string;
        description?: string;
        priority?: number;
        channelId?: string;
        conditions: Prisma.InputJsonValue;
        assignToTeamId?: string;
        assignToAgentId?: string;
        setPriority?: string;
        setCategory?: string;
        addTags?: string[];
        autoResponse?: string;
        escalateAfter?: number;
        activeHoursStart?: string;
        activeHoursEnd?: string;
        activeDays?: number[];
        companyId: string;
    }) {
        return this.prisma.channelRoutingRule.create({
            data: {
                name: data.name,
                description: data.description,
                priority: data.priority || 100,
                channelId: data.channelId,
                conditions: data.conditions,
                assignToTeamId: data.assignToTeamId,
                assignToAgentId: data.assignToAgentId,
                setPriority: data.setPriority,
                setCategory: data.setCategory,
                addTags: data.addTags || [],
                autoResponse: data.autoResponse,
                escalateAfter: data.escalateAfter,
                activeHoursStart: data.activeHoursStart,
                activeHoursEnd: data.activeHoursEnd,
                activeDays: data.activeDays || [],
                companyId: data.companyId,
            },
        });
    }

    async getRoutingRules(companyId: string, channelId?: string) {
        const where: Prisma.ChannelRoutingRuleWhereInput = {
            companyId,
            isActive: true,
        };

        if (channelId) {
            where.channelId = channelId;
        }

        return this.prisma.channelRoutingRule.findMany({
            where,
            include: { channel: true },
            orderBy: { priority: 'asc' },
        });
    }

    async getRoutingRuleById(id: string) {
        const rule = await this.prisma.channelRoutingRule.findUnique({
            where: { id },
            include: { channel: true },
        });
        if (!rule) {
            throw new NotFoundException(`Routing rule ${id} not found`);
        }
        return rule;
    }

    async updateRoutingRule(id: string, data: Partial<{
        name: string;
        description: string;
        priority: number;
        channelId: string;
        conditions: Prisma.InputJsonValue;
        assignToTeamId: string;
        assignToAgentId: string;
        setPriority: string;
        setCategory: string;
        addTags: string[];
        autoResponse: string;
        escalateAfter: number;
        activeHoursStart: string;
        activeHoursEnd: string;
        activeDays: number[];
        isActive: boolean;
    }>) {
        return this.prisma.channelRoutingRule.update({
            where: { id },
            data: data as Prisma.ChannelRoutingRuleUpdateInput,
        });
    }

    async deleteRoutingRule(id: string) {
        return this.prisma.channelRoutingRule.update({
            where: { id },
            data: { isActive: false },
        });
    }

    // ============================================================================
    // Routing Engine
    // ============================================================================

    async evaluateRouting(ticket: {
        channel: string;
        subject: string;
        category?: string;
        priority?: string;
        customerId?: string;
        tags?: string[];
    }, companyId: string): Promise<{
        assignToTeamId?: string;
        assignToAgentId?: string;
        priority?: string;
        category?: string;
        tags?: string[];
        autoResponse?: string;
        escalateAfter?: number;
    } | null> {
        const rules = await this.prisma.channelRoutingRule.findMany({
            where: {
                companyId,
                isActive: true,
            },
            orderBy: { priority: 'asc' },
        });

        const now = new Date();
        const currentHour = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
        const currentDay = now.getDay() || 7; // Convert Sunday 0 to 7

        for (const rule of rules) {
            // Check active hours
            if (rule.activeHoursStart && rule.activeHoursEnd) {
                if (currentHour < rule.activeHoursStart || currentHour > rule.activeHoursEnd) {
                    continue;
                }
            }

            // Check active days
            if (rule.activeDays && rule.activeDays.length > 0) {
                if (!rule.activeDays.includes(currentDay)) {
                    continue;
                }
            }

            // Evaluate conditions
            const conditions = rule.conditions as Array<{
                field: string;
                operator: string;
                value: string | string[];
            }>;

            const matches = this.evaluateConditions(conditions, ticket);

            if (matches) {
                return {
                    assignToTeamId: rule.assignToTeamId || undefined,
                    assignToAgentId: rule.assignToAgentId || undefined,
                    priority: rule.setPriority || undefined,
                    category: rule.setCategory || undefined,
                    tags: rule.addTags.length > 0 ? rule.addTags : undefined,
                    autoResponse: rule.autoResponse || undefined,
                    escalateAfter: rule.escalateAfter || undefined,
                };
            }
        }

        return null;
    }

    private evaluateConditions(
        conditions: Array<{ field: string; operator: string; value: string | string[] }>,
        ticket: Record<string, unknown>,
    ): boolean {
        if (!conditions || conditions.length === 0) return true;

        return conditions.every(cond => {
            const fieldValue = ticket[cond.field];

            switch (cond.operator) {
                case 'equals':
                    return fieldValue === cond.value;
                case 'not_equals':
                    return fieldValue !== cond.value;
                case 'contains':
                    return String(fieldValue || '').toLowerCase().includes(String(cond.value).toLowerCase());
                case 'not_contains':
                    return !String(fieldValue || '').toLowerCase().includes(String(cond.value).toLowerCase());
                case 'in':
                    return Array.isArray(cond.value) && cond.value.includes(String(fieldValue));
                case 'not_in':
                    return Array.isArray(cond.value) && !cond.value.includes(String(fieldValue));
                case 'starts_with':
                    return String(fieldValue || '').toLowerCase().startsWith(String(cond.value).toLowerCase());
                case 'ends_with':
                    return String(fieldValue || '').toLowerCase().endsWith(String(cond.value).toLowerCase());
                default:
                    return false;
            }
        });
    }

    // ============================================================================
    // Channel Analytics
    // ============================================================================

    async getChannelAnalytics(companyId: string) {
        const channels = await this.prisma.supportChannel.findMany({
            where: { companyId, isActive: true, isEnabled: true },
            select: {
                id: true,
                code: true,
                name: true,
                type: true,
                ticketCount: true,
                avgResponseTime: true,
                avgResolutionTime: true,
            },
        });

        const totalTickets = channels.reduce((sum, ch) => sum + ch.ticketCount, 0);

        return {
            channels: channels.map(ch => ({
                ...ch,
                percentage: totalTickets > 0 ? Math.round((ch.ticketCount / totalTickets) * 100) : 0,
            })),
            totalTickets,
            byType: channels.reduce((acc, ch) => {
                acc[ch.type] = (acc[ch.type] || 0) + ch.ticketCount;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}
