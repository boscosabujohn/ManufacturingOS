import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AIResponsesService {
    private readonly logger = new Logger(AIResponsesService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Response Templates
    // ============================================================================

    async createTemplate(data: {
        code: string;
        name: string;
        description?: string;
        content: string;
        shortcut?: string;
        category?: string;
        tags?: string[];
        useAiEnhancement?: boolean;
        aiPrompt?: string;
        ticketTypes?: string[];
        ticketCategories?: string[];
        companyId: string;
    }) {
        return this.prisma.aIResponseTemplate.create({
            data: {
                code: data.code,
                name: data.name,
                description: data.description,
                content: data.content,
                shortcut: data.shortcut,
                category: data.category,
                tags: data.tags || [],
                useAiEnhancement: data.useAiEnhancement || false,
                aiPrompt: data.aiPrompt,
                ticketTypes: data.ticketTypes || [],
                ticketCategories: data.ticketCategories || [],
                companyId: data.companyId,
            },
        });
    }

    async getTemplates(companyId: string, options?: {
        category?: string;
        ticketType?: string;
        ticketCategory?: string;
        search?: string;
    }) {
        const where: Prisma.AIResponseTemplateWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.category) {
            where.category = options.category;
        }
        if (options?.ticketType) {
            where.ticketTypes = { has: options.ticketType };
        }
        if (options?.ticketCategory) {
            where.ticketCategories = { has: options.ticketCategory };
        }
        if (options?.search) {
            where.OR = [
                { name: { contains: options.search, mode: 'insensitive' } },
                { content: { contains: options.search, mode: 'insensitive' } },
                { shortcut: { contains: options.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.aIResponseTemplate.findMany({
            where,
            orderBy: [{ usageCount: 'desc' }, { name: 'asc' }],
        });
    }

    async getTemplateById(id: string) {
        const template = await this.prisma.aIResponseTemplate.findUnique({
            where: { id },
        });
        if (!template) {
            throw new NotFoundException(`Template ${id} not found`);
        }
        return template;
    }

    async getTemplateByShortcut(shortcut: string, companyId: string) {
        return this.prisma.aIResponseTemplate.findFirst({
            where: { shortcut, companyId, isActive: true },
        });
    }

    async updateTemplate(id: string, data: Partial<{
        name: string;
        description: string;
        content: string;
        shortcut: string;
        category: string;
        tags: string[];
        useAiEnhancement: boolean;
        aiPrompt: string;
        ticketTypes: string[];
        ticketCategories: string[];
    }>) {
        return this.prisma.aIResponseTemplate.update({
            where: { id },
            data,
        });
    }

    async deleteTemplate(id: string) {
        return this.prisma.aIResponseTemplate.update({
            where: { id },
            data: { isActive: false },
        });
    }

    async recordTemplateUsage(id: string, rating?: number) {
        const updateData: Prisma.AIResponseTemplateUpdateInput = {
            usageCount: { increment: 1 },
            lastUsedAt: new Date(),
        };

        if (rating !== undefined) {
            const template = await this.prisma.aIResponseTemplate.findUnique({
                where: { id },
                select: { usageCount: true, avgRating: true },
            });
            if (template) {
                const newAvg = ((template.avgRating || 0) * template.usageCount + rating) / (template.usageCount + 1);
                updateData.avgRating = newAvg;
            }
        }

        return this.prisma.aIResponseTemplate.update({
            where: { id },
            data: updateData,
        });
    }

    // ============================================================================
    // AI Suggestions
    // ============================================================================

    async createSuggestion(data: {
        ticketId: string;
        suggestedResponse: string;
        confidence: number;
        basedOnArticleIds?: string[];
        basedOnTemplateIds?: string[];
        companyId: string;
    }) {
        return this.prisma.aIResponseSuggestion.create({
            data: {
                ticketId: data.ticketId,
                suggestedResponse: data.suggestedResponse,
                confidence: data.confidence,
                basedOnArticleIds: data.basedOnArticleIds || [],
                basedOnTemplateIds: data.basedOnTemplateIds || [],
                status: 'pending',
                companyId: data.companyId,
            },
        });
    }

    async getSuggestionsForTicket(ticketId: string) {
        return this.prisma.aIResponseSuggestion.findMany({
            where: { ticketId },
            orderBy: { confidence: 'desc' },
        });
    }

    async getSuggestionById(id: string) {
        const suggestion = await this.prisma.aIResponseSuggestion.findUnique({
            where: { id },
        });
        if (!suggestion) {
            throw new NotFoundException(`Suggestion ${id} not found`);
        }
        return suggestion;
    }

    async acceptSuggestion(id: string, agentId: string, modifiedResponse?: string, rating?: number) {
        return this.prisma.aIResponseSuggestion.update({
            where: { id },
            data: {
                status: modifiedResponse ? 'modified' : 'accepted',
                agentId,
                agentAction: modifiedResponse ? 'modified' : 'used_as_is',
                modifiedResponse,
                rating,
            },
        });
    }

    async rejectSuggestion(id: string, agentId: string, rating?: number) {
        return this.prisma.aIResponseSuggestion.update({
            where: { id },
            data: {
                status: 'rejected',
                agentId,
                agentAction: 'rejected',
                rating,
            },
        });
    }

    // ============================================================================
    // AI Response Generation (Mock implementation)
    // ============================================================================

    async generateSuggestion(ticket: {
        id: string;
        subject: string;
        description: string;
        category?: string;
    }, companyId: string) {
        // Search for relevant articles
        const articles = await this.prisma.crmKnowledgeArticle.findMany({
            where: {
                companyId,
                isActive: true,
                status: 'published',
                OR: [
                    { title: { contains: ticket.subject.split(' ')[0], mode: 'insensitive' } },
                    { tags: { hasSome: ticket.subject.toLowerCase().split(' ') } },
                ],
            },
            take: 3,
            orderBy: { helpfulCount: 'desc' },
        });

        // Search for relevant templates
        const templates = await this.prisma.aIResponseTemplate.findMany({
            where: {
                companyId,
                isActive: true,
                OR: [
                    { ticketCategories: ticket.category ? { has: ticket.category } : undefined },
                    { content: { contains: ticket.subject.split(' ')[0], mode: 'insensitive' } },
                ],
            },
            take: 3,
            orderBy: { usageCount: 'desc' },
        });

        // Generate a mock AI response
        let suggestedResponse = '';
        let confidence = 0.5;

        if (templates.length > 0) {
            suggestedResponse = templates[0].content;
            confidence = 0.8;
        } else if (articles.length > 0) {
            suggestedResponse = `Based on our knowledge base article "${articles[0].title}":\n\n${articles[0].summary || articles[0].content.substring(0, 500)}...`;
            confidence = 0.7;
        } else {
            suggestedResponse = `Thank you for contacting us regarding "${ticket.subject}". Our team is reviewing your request and will provide a detailed response shortly.`;
            confidence = 0.4;
        }

        // Create and return the suggestion
        return this.createSuggestion({
            ticketId: ticket.id,
            suggestedResponse,
            confidence,
            basedOnArticleIds: articles.map(a => a.id),
            basedOnTemplateIds: templates.map(t => t.id),
            companyId,
        });
    }

    // ============================================================================
    // Analytics
    // ============================================================================

    async getAIAnalytics(companyId: string, options?: {
        fromDate?: Date;
        toDate?: Date;
    }) {
        const where: Prisma.AIResponseSuggestionWhereInput = { companyId };

        if (options?.fromDate || options?.toDate) {
            where.createdAt = {};
            if (options.fromDate) where.createdAt.gte = options.fromDate;
            if (options.toDate) where.createdAt.lte = options.toDate;
        }

        const suggestions = await this.prisma.aIResponseSuggestion.findMany({
            where,
            select: {
                status: true,
                agentAction: true,
                confidence: true,
                rating: true,
            },
        });

        const total = suggestions.length;
        const accepted = suggestions.filter(s => s.status === 'accepted').length;
        const modified = suggestions.filter(s => s.status === 'modified').length;
        const rejected = suggestions.filter(s => s.status === 'rejected').length;
        const pending = suggestions.filter(s => s.status === 'pending').length;

        const avgConfidence = total > 0
            ? suggestions.reduce((sum, s) => sum + s.confidence, 0) / total
            : 0;

        const rated = suggestions.filter(s => s.rating !== null);
        const avgRating = rated.length > 0
            ? rated.reduce((sum, s) => sum + (s.rating || 0), 0) / rated.length
            : 0;

        const acceptanceRate = total > 0
            ? Math.round(((accepted + modified) / (total - pending)) * 100)
            : 0;

        return {
            total,
            byStatus: { accepted, modified, rejected, pending },
            acceptanceRate,
            avgConfidence: Math.round(avgConfidence * 100) / 100,
            avgRating: Math.round(avgRating * 10) / 10,
        };
    }

    async getTopTemplates(companyId: string, limit = 10) {
        return this.prisma.aIResponseTemplate.findMany({
            where: { companyId, isActive: true },
            take: limit,
            orderBy: { usageCount: 'desc' },
            select: {
                id: true,
                code: true,
                name: true,
                category: true,
                usageCount: true,
                avgRating: true,
            },
        });
    }
}
