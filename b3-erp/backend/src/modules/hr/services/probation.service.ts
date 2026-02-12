import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ProbationService {
    private readonly logger = new Logger(ProbationService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Probation Period
    // ============================================================================

    async createProbationPeriod(data: {
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        departmentId?: string;
        designationId?: string;
        reportingManagerId?: string;
        joiningDate: Date;
        probationStartDate: Date;
        duration?: number;
        companyId: string;
    }) {
        const count = await this.prisma.probationPeriod.count({
            where: { companyId: data.companyId },
        });
        const probationNumber = `PRB-${String(count + 1).padStart(5, '0')}`;

        const durationDays = data.duration || 90;
        const probationEndDate = new Date(data.probationStartDate);
        probationEndDate.setDate(probationEndDate.getDate() + durationDays);

        return this.prisma.probationPeriod.create({
            data: {
                probationNumber,
                ...data,
                duration: durationDays,
                probationEndDate,
            },
        });
    }

    async getProbationPeriods(companyId: string, options?: {
        status?: string;
        departmentId?: string;
        endingSoon?: boolean;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.ProbationPeriodWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;
        if (options?.departmentId) where.departmentId = options.departmentId;
        if (options?.endingSoon) {
            const thirtyDaysFromNow = new Date();
            thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
            where.status = 'active';
            where.probationEndDate = { lte: thirtyDaysFromNow };
        }

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.probationPeriod.findMany({
                where,
                include: {
                    reviews: { orderBy: { reviewNumber: 'asc' } },
                    feedbacks: { where: { isActive: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { probationEndDate: 'asc' },
            }),
            this.prisma.probationPeriod.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getProbationPeriodById(id: string) {
        const probation = await this.prisma.probationPeriod.findUnique({
            where: { id },
            include: {
                reviews: { where: { isActive: true }, orderBy: { reviewNumber: 'asc' } },
                feedbacks: { where: { isActive: true }, orderBy: { createdAt: 'desc' } },
            },
        });
        if (!probation) {
            throw new NotFoundException(`Probation period ${id} not found`);
        }
        return probation;
    }

    async updateProbationPeriod(id: string, data: Partial<{
        status: string;
        performanceRating: number;
        attendanceRating: number;
        behaviorRating: number;
        skillsRating: number;
        overallRating: number;
        recommendation: string;
        decisionBy: string;
        decisionRemarks: string;
        extensionReason: string;
        extensionPeriod: number;
    }>) {
        const updateData: Prisma.ProbationPeriodUpdateInput = {};

        if (data.status) updateData.status = data.status;
        if (data.performanceRating !== undefined) updateData.performanceRating = new Prisma.Decimal(data.performanceRating);
        if (data.attendanceRating !== undefined) updateData.attendanceRating = new Prisma.Decimal(data.attendanceRating);
        if (data.behaviorRating !== undefined) updateData.behaviorRating = new Prisma.Decimal(data.behaviorRating);
        if (data.skillsRating !== undefined) updateData.skillsRating = new Prisma.Decimal(data.skillsRating);
        if (data.overallRating !== undefined) updateData.overallRating = new Prisma.Decimal(data.overallRating);
        if (data.recommendation) updateData.recommendation = data.recommendation;
        if (data.decisionBy) updateData.decisionBy = data.decisionBy;
        if (data.decisionRemarks) updateData.decisionRemarks = data.decisionRemarks;

        if (data.status === 'confirmed') {
            updateData.confirmedAt = new Date();
            updateData.decisionDate = new Date();
        }

        if (data.status === 'extended' && data.extensionPeriod) {
            updateData.extensionReason = data.extensionReason;
            updateData.extensionPeriod = data.extensionPeriod;
            updateData.decisionDate = new Date();

            // Calculate new end date
            const current = await this.prisma.probationPeriod.findUnique({ where: { id } });
            if (current) {
                const newEndDate = new Date(current.probationEndDate);
                newEndDate.setDate(newEndDate.getDate() + data.extensionPeriod);
                updateData.extendedEndDate = newEndDate;
            }
        }

        return this.prisma.probationPeriod.update({
            where: { id },
            data: updateData,
        });
    }

    async confirmEmployee(id: string, data: {
        confirmedBy: string;
        confirmationLetterUrl?: string;
        remarks?: string;
    }) {
        return this.prisma.probationPeriod.update({
            where: { id },
            data: {
                status: 'confirmed',
                confirmedAt: new Date(),
                decisionDate: new Date(),
                decisionBy: data.confirmedBy,
                decisionRemarks: data.remarks,
                confirmationLetterUrl: data.confirmationLetterUrl,
            },
        });
    }

    async extendProbation(id: string, data: {
        extensionPeriod: number;
        extensionReason: string;
        extendedBy: string;
    }) {
        const current = await this.prisma.probationPeriod.findUnique({ where: { id } });
        if (!current) throw new NotFoundException(`Probation period ${id} not found`);

        const newEndDate = new Date(current.extendedEndDate || current.probationEndDate);
        newEndDate.setDate(newEndDate.getDate() + data.extensionPeriod);

        return this.prisma.probationPeriod.update({
            where: { id },
            data: {
                status: 'extended',
                extensionPeriod: data.extensionPeriod,
                extensionReason: data.extensionReason,
                extendedEndDate: newEndDate,
                decisionDate: new Date(),
                decisionBy: data.extendedBy,
            },
        });
    }

    // ============================================================================
    // Probation Reviews
    // ============================================================================

    async scheduleReview(data: {
        probationId: string;
        reviewNumber: number;
        reviewType?: string;
        scheduledDate: Date;
        reviewerId?: string;
        reviewerName?: string;
        companyId: string;
    }) {
        return this.prisma.probationReview.create({ data });
    }

    async getReviews(probationId: string) {
        return this.prisma.probationReview.findMany({
            where: { probationId, isActive: true },
            orderBy: { reviewNumber: 'asc' },
        });
    }

    async submitReview(id: string, data: {
        performanceScore?: number;
        attendanceScore?: number;
        teamworkScore?: number;
        communicationScore?: number;
        technicalScore?: number;
        overallScore?: number;
        strengths?: string;
        areasOfImprovement?: string;
        goalsForNextPeriod?: string;
        recommendation?: string;
        remarks?: string;
    }) {
        const updateData: Prisma.ProbationReviewUpdateInput = {
            status: 'completed',
            actualDate: new Date(),
        };

        if (data.performanceScore !== undefined) updateData.performanceScore = new Prisma.Decimal(data.performanceScore);
        if (data.attendanceScore !== undefined) updateData.attendanceScore = new Prisma.Decimal(data.attendanceScore);
        if (data.teamworkScore !== undefined) updateData.teamworkScore = new Prisma.Decimal(data.teamworkScore);
        if (data.communicationScore !== undefined) updateData.communicationScore = new Prisma.Decimal(data.communicationScore);
        if (data.technicalScore !== undefined) updateData.technicalScore = new Prisma.Decimal(data.technicalScore);
        if (data.overallScore !== undefined) updateData.overallScore = new Prisma.Decimal(data.overallScore);

        if (data.strengths) updateData.strengths = data.strengths;
        if (data.areasOfImprovement) updateData.areasOfImprovement = data.areasOfImprovement;
        if (data.goalsForNextPeriod) updateData.goalsForNextPeriod = data.goalsForNextPeriod;
        if (data.recommendation) updateData.recommendation = data.recommendation;
        if (data.remarks) updateData.remarks = data.remarks;

        return this.prisma.probationReview.update({
            where: { id },
            data: updateData,
        });
    }

    async addEmployeeComments(reviewId: string, comments: string) {
        return this.prisma.probationReview.update({
            where: { id: reviewId },
            data: { employeeComments: comments },
        });
    }

    // ============================================================================
    // Probation Feedback
    // ============================================================================

    async submitFeedback(data: {
        probationId: string;
        feedbackType: string;
        feedbackFrom?: string;
        feedbackFromName?: string;
        technicalSkills?: number;
        communication?: number;
        teamwork?: number;
        initiative?: number;
        punctuality?: number;
        qualityOfWork?: number;
        positives?: string;
        improvements?: string;
        overallComments?: string;
        overallRating?: number;
        isAnonymous?: boolean;
        companyId: string;
    }) {
        return this.prisma.probationFeedback.create({ data });
    }

    async getFeedbacks(probationId: string) {
        return this.prisma.probationFeedback.findMany({
            where: { probationId, isActive: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async acknowledgeFeedback(id: string) {
        return this.prisma.probationFeedback.update({
            where: { id },
            data: { status: 'acknowledged' },
        });
    }

    // ============================================================================
    // Dashboard & Analytics
    // ============================================================================

    async getProbationDashboard(companyId: string) {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const [
            totalActive,
            byStatus,
            endingSoon,
            pendingReviews,
            recentConfirmations,
        ] = await Promise.all([
            this.prisma.probationPeriod.count({
                where: { companyId, isActive: true, status: 'active' },
            }),
            this.prisma.probationPeriod.groupBy({
                by: ['status'],
                where: { companyId, isActive: true },
                _count: { id: true },
            }),
            this.prisma.probationPeriod.findMany({
                where: {
                    companyId,
                    isActive: true,
                    status: 'active',
                    probationEndDate: { lte: thirtyDaysFromNow },
                },
                orderBy: { probationEndDate: 'asc' },
                take: 10,
            }),
            this.prisma.probationReview.count({
                where: {
                    companyId,
                    isActive: true,
                    status: 'scheduled',
                    scheduledDate: { lte: today },
                },
            }),
            this.prisma.probationPeriod.findMany({
                where: {
                    companyId,
                    isActive: true,
                    status: 'confirmed',
                    confirmedAt: { gte: new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000) },
                },
                orderBy: { confirmedAt: 'desc' },
                take: 5,
            }),
        ]);

        return {
            totalActive,
            byStatus: byStatus.reduce((acc, item) => {
                acc[item.status] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
            endingSoon,
            pendingReviews,
            recentConfirmations,
        };
    }

    async getReviewSchedule(companyId: string, options?: {
        fromDate?: Date;
        toDate?: Date;
        reviewerId?: string;
    }) {
        const where: Prisma.ProbationReviewWhereInput = {
            companyId,
            isActive: true,
            status: 'scheduled',
        };

        if (options?.fromDate || options?.toDate) {
            where.scheduledDate = {};
            if (options.fromDate) where.scheduledDate.gte = options.fromDate;
            if (options.toDate) where.scheduledDate.lte = options.toDate;
        }
        if (options?.reviewerId) where.reviewerId = options.reviewerId;

        return this.prisma.probationReview.findMany({
            where,
            include: { probation: true },
            orderBy: { scheduledDate: 'asc' },
        });
    }
}
