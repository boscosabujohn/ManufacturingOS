import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class KnowledgeBaseService {
    private readonly logger = new Logger(KnowledgeBaseService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Knowledge Categories
    // ============================================================================

    async createCategory(data: {
        code: string;
        name: string;
        description?: string;
        parentId?: string;
        icon?: string;
        color?: string;
        displayOrder?: number;
        isPublic?: boolean;
        isInternal?: boolean;
        allowedRoles?: string[];
        companyId: string;
    }) {
        return this.prisma.knowledgeCategory.create({
            data: {
                ...data,
                allowedRoles: data.allowedRoles || [],
            },
        });
    }

    async getCategories(companyId: string, options?: {
        parentId?: string | null;
        isPublic?: boolean;
        isInternal?: boolean;
        includeChildren?: boolean;
    }) {
        const where: Prisma.KnowledgeCategoryWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.parentId !== undefined) {
            where.parentId = options.parentId;
        }
        if (options?.isPublic !== undefined) {
            where.isPublic = options.isPublic;
        }
        if (options?.isInternal !== undefined) {
            where.isInternal = options.isInternal;
        }

        return this.prisma.knowledgeCategory.findMany({
            where,
            include: options?.includeChildren ? {
                children: {
                    where: { isActive: true },
                    orderBy: { displayOrder: 'asc' },
                },
            } : undefined,
            orderBy: { displayOrder: 'asc' },
        });
    }

    async getCategoryById(id: string) {
        const category = await this.prisma.knowledgeCategory.findUnique({
            where: { id },
            include: {
                parent: true,
                children: {
                    where: { isActive: true },
                    orderBy: { displayOrder: 'asc' },
                },
            },
        });
        if (!category) {
            throw new NotFoundException(`Category ${id} not found`);
        }
        return category;
    }

    async updateCategory(id: string, data: Partial<{
        name: string;
        description: string;
        parentId: string;
        icon: string;
        color: string;
        displayOrder: number;
        isPublic: boolean;
        isInternal: boolean;
        allowedRoles: string[];
    }>) {
        return this.prisma.knowledgeCategory.update({
            where: { id },
            data,
        });
    }

    async deleteCategory(id: string) {
        return this.prisma.knowledgeCategory.update({
            where: { id },
            data: { isActive: false },
        });
    }

    // ============================================================================
    // Knowledge Articles (using existing CrmKnowledgeArticle)
    // ============================================================================

    async createArticle(data: {
        title: string;
        content: string;
        summary?: string;
        category: string;
        subcategory?: string;
        tags?: string[];
        isPublic?: boolean;
        isInternal?: boolean;
        authorId?: string;
        authorName?: string;
        relatedArticles?: string[];
        attachments?: Prisma.InputJsonValue;
        companyId: string;
    }) {
        // Generate article number
        const count = await this.prisma.crmKnowledgeArticle.count({
            where: { companyId: data.companyId },
        });
        const articleNumber = `KB-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.crmKnowledgeArticle.create({
            data: {
                articleNumber,
                title: data.title,
                content: data.content,
                summary: data.summary,
                category: data.category,
                subcategory: data.subcategory,
                tags: data.tags || [],
                isPublic: data.isPublic ?? false,
                isInternal: data.isInternal ?? true,
                authorId: data.authorId,
                authorName: data.authorName,
                relatedArticles: data.relatedArticles || [],
                relatedTickets: [],
                attachments: data.attachments,
                companyId: data.companyId,
                status: 'draft',
            },
        });
    }

    async getArticles(companyId: string, options?: {
        category?: string;
        status?: string;
        isPublic?: boolean;
        search?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.CrmKnowledgeArticleWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.category) {
            where.category = options.category;
        }
        if (options?.status) {
            where.status = options.status;
        }
        if (options?.isPublic !== undefined) {
            where.isPublic = options.isPublic;
        }
        if (options?.search) {
            where.OR = [
                { title: { contains: options.search, mode: 'insensitive' } },
                { content: { contains: options.search, mode: 'insensitive' } },
                { tags: { has: options.search } },
            ];
        }

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.crmKnowledgeArticle.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { updatedAt: 'desc' },
            }),
            this.prisma.crmKnowledgeArticle.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getArticleById(id: string) {
        const article = await this.prisma.crmKnowledgeArticle.findUnique({
            where: { id },
        });
        if (!article) {
            throw new NotFoundException(`Article ${id} not found`);
        }
        return article;
    }

    async updateArticle(id: string, data: Partial<{
        title: string;
        content: string;
        summary: string;
        category: string;
        subcategory: string;
        tags: string[];
        isPublic: boolean;
        isInternal: boolean;
        relatedArticles: string[];
        attachments: Prisma.InputJsonValue;
    }>) {
        return this.prisma.crmKnowledgeArticle.update({
            where: { id },
            data: data as Prisma.CrmKnowledgeArticleUpdateInput,
        });
    }

    async publishArticle(id: string) {
        return this.prisma.crmKnowledgeArticle.update({
            where: { id },
            data: {
                status: 'published',
                publishedDate: new Date(),
            },
        });
    }

    async archiveArticle(id: string) {
        return this.prisma.crmKnowledgeArticle.update({
            where: { id },
            data: { status: 'archived' },
        });
    }

    async incrementViewCount(id: string) {
        return this.prisma.crmKnowledgeArticle.update({
            where: { id },
            data: { viewCount: { increment: 1 } },
        });
    }

    async rateArticle(id: string, helpful: boolean) {
        return this.prisma.crmKnowledgeArticle.update({
            where: { id },
            data: helpful
                ? { helpfulCount: { increment: 1 } }
                : { notHelpfulCount: { increment: 1 } },
        });
    }

    async searchArticles(companyId: string, query: string, limit = 10) {
        return this.prisma.crmKnowledgeArticle.findMany({
            where: {
                companyId,
                isActive: true,
                status: 'published',
                OR: [
                    { title: { contains: query, mode: 'insensitive' } },
                    { content: { contains: query, mode: 'insensitive' } },
                    { summary: { contains: query, mode: 'insensitive' } },
                    { tags: { has: query } },
                ],
            },
            take: limit,
            orderBy: [
                { helpfulCount: 'desc' },
                { viewCount: 'desc' },
            ],
        });
    }

    async getPopularArticles(companyId: string, limit = 10) {
        return this.prisma.crmKnowledgeArticle.findMany({
            where: {
                companyId,
                isActive: true,
                status: 'published',
            },
            take: limit,
            orderBy: { viewCount: 'desc' },
        });
    }
}
