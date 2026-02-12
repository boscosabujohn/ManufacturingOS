import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class CSATService {
    private readonly logger = new Logger(CSATService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Survey Templates
    // ============================================================================

    async createSurveyTemplate(data: {
        code: string;
        name: string;
        description?: string;
        surveyType?: string;
        triggerEvent?: string;
        questions: Prisma.InputJsonValue;
        sendDelay?: number;
        expiresAfter?: number;
        reminderEnabled?: boolean;
        reminderAfter?: number;
        headerImage?: string;
        thankYouMessage?: string;
        isDefault?: boolean;
        companyId: string;
    }) {
        // If setting as default, unset other defaults
        if (data.isDefault) {
            await this.prisma.cSATSurveyTemplate.updateMany({
                where: { companyId: data.companyId, isDefault: true },
                data: { isDefault: false },
            });
        }

        return this.prisma.cSATSurveyTemplate.create({
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
                surveyType: data.surveyType || 'post_resolution',
                triggerEvent: data.triggerEvent,
                questions: data.questions,
                sendDelay: data.sendDelay || 0,
                expiresAfter: data.expiresAfter || 168,
                reminderEnabled: data.reminderEnabled ?? true,
                reminderAfter: data.reminderAfter || 48,
                headerImage: data.headerImage,
                thankYouMessage: data.thankYouMessage,
                isDefault: data.isDefault || false,
                companyId: data.companyId,
            },
        });
    }

    async getSurveyTemplates(companyId: string) {
        return this.prisma.cSATSurveyTemplate.findMany({
            where: { companyId, isActive: true },
            orderBy: { name: 'asc' },
        });
    }

    async getSurveyTemplateById(id: string) {
        const template = await this.prisma.cSATSurveyTemplate.findUnique({
            where: { id },
            include: { responses: { take: 5, orderBy: { createdAt: 'desc' } } },
        });
        if (!template) {
            throw new NotFoundException(`Survey template ${id} not found`);
        }
        return template;
    }

    async updateSurveyTemplate(id: string, data: Partial<{
        name: string;
        description: string;
        surveyType: string;
        triggerEvent: string;
        questions: Prisma.InputJsonValue;
        sendDelay: number;
        expiresAfter: number;
        reminderEnabled: boolean;
        reminderAfter: number;
        headerImage: string;
        thankYouMessage: string;
        isDefault: boolean;
    }>) {
        return this.prisma.cSATSurveyTemplate.update({
            where: { id },
            data: data as Prisma.CSATSurveyTemplateUpdateInput,
        });
    }

    async deleteSurveyTemplate(id: string) {
        return this.prisma.cSATSurveyTemplate.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async getDefaultTemplate(companyId: string) {
        return this.prisma.cSATSurveyTemplate.findFirst({
            where: { companyId, isDefault: true, isActive: true },
        });
    }

    // ============================================================================
    // Survey Responses
    // ============================================================================

    async sendSurvey(data: {
        surveyId: string;
        ticketId?: string;
        customerId?: string;
        customerEmail?: string;
        customerName?: string;
        companyId: string;
    }) {
        return this.prisma.cSATSurveyResponse.create({
            data: {
                surveyId: data.surveyId,
                ticketId: data.ticketId,
                customerId: data.customerId,
                customerEmail: data.customerEmail,
                customerName: data.customerName,
                responses: {},
                sentAt: new Date(),
                companyId: data.companyId,
            },
        });
    }

    async recordSurveyOpen(responseId: string) {
        return this.prisma.cSATSurveyResponse.update({
            where: { id: responseId },
            data: { openedAt: new Date() },
        });
    }

    async submitSurveyResponse(responseId: string, data: {
        responses: Prisma.InputJsonValue;
        overallRating?: number;
        npsScore?: number;
    }) {
        return this.prisma.cSATSurveyResponse.update({
            where: { id: responseId },
            data: {
                responses: data.responses,
                overallRating: data.overallRating,
                npsScore: data.npsScore,
                completedAt: new Date(),
            },
        });
    }

    async getSurveyResponses(companyId: string, options?: {
        surveyId?: string;
        ticketId?: string;
        customerId?: string;
        completed?: boolean;
        fromDate?: Date;
        toDate?: Date;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.CSATSurveyResponseWhereInput = { companyId };

        if (options?.surveyId) {
            where.surveyId = options.surveyId;
        }
        if (options?.ticketId) {
            where.ticketId = options.ticketId;
        }
        if (options?.customerId) {
            where.customerId = options.customerId;
        }
        if (options?.completed !== undefined) {
            where.completedAt = options.completed ? { not: null } : null;
        }
        if (options?.fromDate || options?.toDate) {
            where.sentAt = {};
            if (options.fromDate) where.sentAt.gte = options.fromDate;
            if (options.toDate) where.sentAt.lte = options.toDate;
        }

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.cSATSurveyResponse.findMany({
                where,
                include: { survey: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { sentAt: 'desc' },
            }),
            this.prisma.cSATSurveyResponse.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getSurveyResponseById(id: string) {
        const response = await this.prisma.cSATSurveyResponse.findUnique({
            where: { id },
            include: { survey: true },
        });
        if (!response) {
            throw new NotFoundException(`Survey response ${id} not found`);
        }
        return response;
    }

    async markFollowUpRequired(responseId: string, notes?: string, assignedTo?: string) {
        return this.prisma.cSATSurveyResponse.update({
            where: { id: responseId },
            data: {
                followUpRequired: true,
                followUpNotes: notes,
                followUpBy: assignedTo,
            },
        });
    }

    async completeFollowUp(responseId: string) {
        return this.prisma.cSATSurveyResponse.update({
            where: { id: responseId },
            data: {
                followUpRequired: false,
                followUpAt: new Date(),
            },
        });
    }

    // ============================================================================
    // Analytics
    // ============================================================================

    async getCSATMetrics(companyId: string, options?: {
        fromDate?: Date;
        toDate?: Date;
        surveyId?: string;
    }) {
        const where: Prisma.CSATSurveyResponseWhereInput = {
            companyId,
            completedAt: { not: null },
        };

        if (options?.surveyId) {
            where.surveyId = options.surveyId;
        }
        if (options?.fromDate || options?.toDate) {
            where.completedAt = { not: null };
            if (options.fromDate) where.sentAt = { gte: options.fromDate };
            if (options.toDate) where.sentAt = { ...where.sentAt as Prisma.DateTimeFilter, lte: options.toDate };
        }

        const responses = await this.prisma.cSATSurveyResponse.findMany({
            where,
            select: {
                overallRating: true,
                npsScore: true,
            },
        });

        const totalResponses = responses.length;
        const totalSent = await this.prisma.cSATSurveyResponse.count({
            where: { companyId, ...options?.fromDate ? { sentAt: { gte: options.fromDate } } : {} },
        });

        // CSAT calculation (% of 4 or 5 ratings)
        const satisfied = responses.filter(r => (r.overallRating || 0) >= 4).length;
        const csatScore = totalResponses > 0 ? Math.round((satisfied / totalResponses) * 100) : 0;

        // Average rating
        const avgRating = totalResponses > 0
            ? responses.reduce((sum, r) => sum + (r.overallRating || 0), 0) / totalResponses
            : 0;

        // NPS calculation
        const npsResponses = responses.filter(r => r.npsScore !== null);
        const promoters = npsResponses.filter(r => (r.npsScore || 0) >= 9).length;
        const detractors = npsResponses.filter(r => (r.npsScore || 0) <= 6).length;
        const nps = npsResponses.length > 0
            ? Math.round(((promoters - detractors) / npsResponses.length) * 100)
            : 0;

        // Response rate
        const responseRate = totalSent > 0 ? Math.round((totalResponses / totalSent) * 100) : 0;

        // Rating distribution
        const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
        responses.forEach(r => {
            if (r.overallRating) {
                ratingDistribution[r.overallRating] = (ratingDistribution[r.overallRating] || 0) + 1;
            }
        });

        return {
            totalSent,
            totalResponses,
            responseRate,
            csatScore,
            avgRating: Math.round(avgRating * 10) / 10,
            nps,
            ratingDistribution,
        };
    }

    async getCSATTrend(companyId: string, days = 30) {
        const fromDate = new Date();
        fromDate.setDate(fromDate.getDate() - days);

        const responses = await this.prisma.cSATSurveyResponse.findMany({
            where: {
                companyId,
                completedAt: { not: null },
                sentAt: { gte: fromDate },
            },
            select: {
                sentAt: true,
                overallRating: true,
            },
            orderBy: { sentAt: 'asc' },
        });

        // Group by date
        const byDate: Record<string, { count: number; sum: number }> = {};
        responses.forEach(r => {
            const date = r.sentAt.toISOString().split('T')[0];
            if (!byDate[date]) {
                byDate[date] = { count: 0, sum: 0 };
            }
            byDate[date].count++;
            byDate[date].sum += r.overallRating || 0;
        });

        return Object.entries(byDate).map(([date, data]) => ({
            date,
            responses: data.count,
            avgRating: Math.round((data.sum / data.count) * 10) / 10,
        }));
    }
}
