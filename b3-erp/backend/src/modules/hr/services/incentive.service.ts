import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class IncentiveService {
    constructor(private prisma: PrismaService) {}

    // ============================================================================
    // INCENTIVE SCHEMES
    // ============================================================================

    async findAllSchemes(companyId: string, filters?: {
        isActive?: boolean;
        schemeType?: string;
        frequency?: string;
        search?: string;
    }) {
        const where: any = { companyId };

        if (filters?.isActive !== undefined) where.isActive = filters.isActive;
        if (filters?.schemeType) where.schemeType = filters.schemeType;
        if (filters?.frequency) where.frequency = filters.frequency;
        if (filters?.search) {
            where.OR = [
                { code: { contains: filters.search, mode: 'insensitive' } },
                { name: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.incentiveScheme.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }

    async findSchemeById(id: string) {
        const scheme = await this.prisma.incentiveScheme.findUnique({ where: { id } });
        if (!scheme) throw new NotFoundException('Incentive scheme not found');
        return scheme;
    }

    async createScheme(data: any) {
        const existing = await this.prisma.incentiveScheme.findFirst({
            where: { code: data.code, companyId: data.companyId },
        });
        if (existing) throw new BadRequestException('Incentive scheme code already exists');

        return this.prisma.incentiveScheme.create({ data });
    }

    async updateScheme(id: string, data: any) {
        await this.findSchemeById(id);
        return this.prisma.incentiveScheme.update({ where: { id }, data });
    }

    async deleteScheme(id: string) {
        await this.findSchemeById(id);
        return this.prisma.incentiveScheme.delete({ where: { id } });
    }

    // ============================================================================
    // EMPLOYEE INCENTIVES
    // ============================================================================

    async findAllIncentives(companyId: string, filters?: {
        employeeId?: string;
        schemeId?: string;
        status?: string;
        fromDate?: string;
        toDate?: string;
        page?: number;
        limit?: number;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.schemeId) where.schemeId = filters.schemeId;
        if (filters?.status) where.status = filters.status;
        if (filters?.fromDate) where.periodStart = { gte: new Date(filters.fromDate) };
        if (filters?.toDate) where.periodEnd = { lte: new Date(filters.toDate) };

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.employeeIncentive.findMany({
                where,
                include: { scheme: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.employeeIncentive.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async findIncentiveById(id: string) {
        const incentive = await this.prisma.employeeIncentive.findUnique({
            where: { id },
            include: { scheme: true },
        });
        if (!incentive) throw new NotFoundException('Employee incentive not found');
        return incentive;
    }

    async createIncentive(data: any) {
        const scheme = await this.findSchemeById(data.schemeId);

        // Calculate incentive based on scheme
        let incentiveAmount = data.incentiveAmount || 0;
        const achievementPercent = data.targetValue
            ? (data.achievedValue / data.targetValue) * 100
            : 100;

        if (scheme.calculationMethod === 'SlabBased' && scheme.slabs) {
            const slabs = scheme.slabs as any[];
            for (const slab of slabs) {
                if (achievementPercent >= slab.minPercent && achievementPercent <= slab.maxPercent) {
                    incentiveAmount = slab.amount || (data.achievedValue * (slab.percent || 0) / 100);
                    break;
                }
            }
        } else if (scheme.calculationMethod === 'PercentageOfTarget') {
            incentiveAmount = data.achievedValue * (achievementPercent / 100);
        }

        // Apply caps
        if (scheme.minThreshold && achievementPercent < scheme.minThreshold) {
            incentiveAmount = 0;
        }
        if (scheme.maxCap && incentiveAmount > scheme.maxCap) {
            incentiveAmount = scheme.maxCap;
        }

        const finalAmount = incentiveAmount + (data.adjustments || 0);

        return this.prisma.employeeIncentive.create({
            data: {
                ...data,
                achievementPercent,
                incentiveAmount: Math.round(incentiveAmount * 100) / 100,
                finalAmount: Math.round(finalAmount * 100) / 100,
            },
        });
    }

    async updateIncentive(id: string, data: any) {
        const incentive = await this.findIncentiveById(id);
        if (incentive.status === 'Paid') {
            throw new BadRequestException('Cannot update paid incentive');
        }

        if (data.achievedValue !== undefined || data.adjustments !== undefined) {
            const achievedValue = data.achievedValue ?? incentive.achievedValue;
            const adjustments = data.adjustments ?? incentive.adjustments;
            const incentiveAmount = data.incentiveAmount ?? incentive.incentiveAmount;
            data.finalAmount = incentiveAmount + adjustments;
        }

        return this.prisma.employeeIncentive.update({ where: { id }, data });
    }

    async approveIncentive(id: string, approvedBy: string) {
        await this.findIncentiveById(id);
        return this.prisma.employeeIncentive.update({
            where: { id },
            data: {
                status: 'Approved',
                approvedBy,
                approvedAt: new Date(),
            },
        });
    }

    async markIncentivePaid(id: string, payslipId?: string) {
        await this.findIncentiveById(id);
        return this.prisma.employeeIncentive.update({
            where: { id },
            data: {
                status: 'Paid',
                paidOn: new Date(),
                payslipId,
            },
        });
    }

    async deleteIncentive(id: string) {
        const incentive = await this.findIncentiveById(id);
        if (incentive.status === 'Paid') {
            throw new BadRequestException('Cannot delete paid incentive');
        }
        return this.prisma.employeeIncentive.delete({ where: { id } });
    }

    // ============================================================================
    // INCENTIVE REPORTS
    // ============================================================================

    async getIncentiveSummary(companyId: string, periodStart?: Date, periodEnd?: Date) {
        const where: any = { companyId };
        if (periodStart) where.periodStart = { gte: periodStart };
        if (periodEnd) where.periodEnd = { lte: periodEnd };

        const incentives = await this.prisma.employeeIncentive.findMany({
            where,
            include: { scheme: true },
        });

        const byScheme = incentives.reduce((acc: any, inc) => {
            const schemeName = inc.scheme.name;
            if (!acc[schemeName]) {
                acc[schemeName] = { count: 0, totalAmount: 0, paidAmount: 0 };
            }
            acc[schemeName].count++;
            acc[schemeName].totalAmount += inc.finalAmount;
            if (inc.status === 'Paid') {
                acc[schemeName].paidAmount += inc.finalAmount;
            }
            return acc;
        }, {});

        const totalAmount = incentives.reduce((sum, i) => sum + i.finalAmount, 0);
        const totalPaid = incentives.filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.finalAmount, 0);
        const totalPending = incentives.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.finalAmount, 0);

        return {
            totalEmployees: new Set(incentives.map(i => i.employeeId)).size,
            totalCalculations: incentives.length,
            totalAmount,
            totalPaid,
            totalPending,
            byScheme,
        };
    }
}
