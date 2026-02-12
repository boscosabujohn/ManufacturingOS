import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class BonusService {
    constructor(private prisma: PrismaService) {}

    // ============================================================================
    // BONUS TYPES
    // ============================================================================

    async findAllBonusTypes(companyId: string, filters?: {
        isActive?: boolean;
        frequency?: string;
        search?: string;
    }) {
        const where: any = { companyId };

        if (filters?.isActive !== undefined) where.isActive = filters.isActive;
        if (filters?.frequency) where.frequency = filters.frequency;
        if (filters?.search) {
            where.OR = [
                { code: { contains: filters.search, mode: 'insensitive' } },
                { name: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.bonusType.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }

    async findBonusTypeById(id: string) {
        const bonusType = await this.prisma.bonusType.findUnique({ where: { id } });
        if (!bonusType) throw new NotFoundException('Bonus type not found');
        return bonusType;
    }

    async createBonusType(data: any) {
        const existing = await this.prisma.bonusType.findFirst({
            where: { code: data.code, companyId: data.companyId },
        });
        if (existing) throw new BadRequestException('Bonus type code already exists');

        return this.prisma.bonusType.create({ data });
    }

    async updateBonusType(id: string, data: any) {
        await this.findBonusTypeById(id);
        return this.prisma.bonusType.update({ where: { id }, data });
    }

    async deleteBonusType(id: string) {
        await this.findBonusTypeById(id);
        return this.prisma.bonusType.delete({ where: { id } });
    }

    // ============================================================================
    // BONUS CALCULATIONS
    // ============================================================================

    async findAllBonusCalculations(companyId: string, filters?: {
        employeeId?: string;
        bonusTypeId?: string;
        financialYear?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.bonusTypeId) where.bonusTypeId = filters.bonusTypeId;
        if (filters?.financialYear) where.financialYear = filters.financialYear;
        if (filters?.status) where.status = filters.status;

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.bonusCalculation.findMany({
                where,
                include: { bonusType: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.bonusCalculation.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async findBonusCalculationById(id: string) {
        const calculation = await this.prisma.bonusCalculation.findUnique({
            where: { id },
            include: { bonusType: true },
        });
        if (!calculation) throw new NotFoundException('Bonus calculation not found');
        return calculation;
    }

    async createBonusCalculation(data: any) {
        // Calculate bonus based on type
        const bonusType = await this.findBonusTypeById(data.bonusTypeId);

        let calculatedAmount = data.calculatedAmount || 0;
        if (bonusType.calculationType === 'Fixed') {
            calculatedAmount = bonusType.defaultAmount || 0;
        } else if (bonusType.calculationType === 'PercentageOfBasic') {
            calculatedAmount = (data.bonusableAmount || 0) * (bonusType.defaultPercent || 0) / 100;
        }

        const finalAmount = calculatedAmount + (data.adjustments || 0);
        const netAmount = finalAmount - (data.taxDeducted || 0);

        return this.prisma.bonusCalculation.create({
            data: {
                ...data,
                calculatedAmount,
                finalAmount,
                netAmount,
            },
        });
    }

    async updateBonusCalculation(id: string, data: any) {
        await this.findBonusCalculationById(id);

        if (data.calculatedAmount !== undefined || data.adjustments !== undefined || data.taxDeducted !== undefined) {
            const current = await this.findBonusCalculationById(id);
            const calculatedAmount = data.calculatedAmount ?? current.calculatedAmount;
            const adjustments = data.adjustments ?? current.adjustments;
            const taxDeducted = data.taxDeducted ?? current.taxDeducted;
            data.finalAmount = calculatedAmount + adjustments;
            data.netAmount = data.finalAmount - taxDeducted;
        }

        return this.prisma.bonusCalculation.update({ where: { id }, data });
    }

    async approveBonusCalculation(id: string, approvedBy: string) {
        await this.findBonusCalculationById(id);
        return this.prisma.bonusCalculation.update({
            where: { id },
            data: {
                status: 'Approved',
                approvedBy,
                approvedAt: new Date(),
            },
        });
    }

    async markBonusPaid(id: string) {
        await this.findBonusCalculationById(id);
        return this.prisma.bonusCalculation.update({
            where: { id },
            data: {
                status: 'Paid',
                paidOn: new Date(),
            },
        });
    }

    async deleteBonusCalculation(id: string) {
        const calculation = await this.findBonusCalculationById(id);
        if (calculation.status === 'Paid') {
            throw new BadRequestException('Cannot delete paid bonus');
        }
        return this.prisma.bonusCalculation.delete({ where: { id } });
    }

    // ============================================================================
    // BONUS REPORTS
    // ============================================================================

    async getBonusSummary(companyId: string, financialYear: string) {
        const calculations = await this.prisma.bonusCalculation.findMany({
            where: { companyId, financialYear },
            include: { bonusType: true },
        });

        const byType = calculations.reduce((acc: any, calc) => {
            const typeName = calc.bonusType.name;
            if (!acc[typeName]) {
                acc[typeName] = { count: 0, totalAmount: 0, paidAmount: 0 };
            }
            acc[typeName].count++;
            acc[typeName].totalAmount += calc.finalAmount;
            if (calc.status === 'Paid') {
                acc[typeName].paidAmount += calc.netAmount;
            }
            return acc;
        }, {});

        const totalAmount = calculations.reduce((sum, c) => sum + c.finalAmount, 0);
        const totalPaid = calculations.filter(c => c.status === 'Paid').reduce((sum, c) => sum + c.netAmount, 0);
        const totalPending = calculations.filter(c => c.status !== 'Paid').reduce((sum, c) => sum + c.netAmount, 0);

        return {
            financialYear,
            totalEmployees: new Set(calculations.map(c => c.employeeId)).size,
            totalCalculations: calculations.length,
            totalAmount,
            totalPaid,
            totalPending,
            byType,
        };
    }
}
