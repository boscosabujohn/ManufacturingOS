import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class AdvanceService {
    constructor(private prisma: PrismaService) {}

    private generateAdvanceNumber(companyId: string, counter: number): string {
        const year = new Date().getFullYear();
        return `ADV-${year}-${String(counter).padStart(5, '0')}`;
    }

    // ============================================================================
    // SALARY ADVANCES
    // ============================================================================

    async findAllAdvances(companyId: string, filters?: {
        employeeId?: string;
        status?: string;
        fromDate?: string;
        toDate?: string;
        page?: number;
        limit?: number;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.status) where.status = filters.status;
        if (filters?.fromDate) where.requestDate = { ...where.requestDate, gte: new Date(filters.fromDate) };
        if (filters?.toDate) where.requestDate = { ...where.requestDate, lte: new Date(filters.toDate) };

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.salaryAdvance.findMany({
                where,
                include: { recoveries: { orderBy: { installmentNumber: 'asc' } } },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.salaryAdvance.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async findAdvanceById(id: string) {
        const advance = await this.prisma.salaryAdvance.findUnique({
            where: { id },
            include: { recoveries: { orderBy: { installmentNumber: 'asc' } } },
        });
        if (!advance) throw new NotFoundException('Salary advance not found');
        return advance;
    }

    async createAdvance(data: any) {
        const count = await this.prisma.salaryAdvance.count({ where: { companyId: data.companyId } });
        const advanceNumber = this.generateAdvanceNumber(data.companyId, count + 1);

        const monthlyDeduction = data.requestedAmount / (data.repaymentMonths || 1);

        return this.prisma.salaryAdvance.create({
            data: {
                ...data,
                advanceNumber,
                monthlyDeduction: Math.round(monthlyDeduction * 100) / 100,
                balanceAmount: data.requestedAmount,
            },
        });
    }

    async approveAdvance(id: string, approvedBy: string, approvedAmount?: number) {
        const advance = await this.findAdvanceById(id);
        if (advance.status !== 'Pending') {
            throw new BadRequestException('Advance is not in pending status');
        }

        const amount = approvedAmount ?? advance.requestedAmount;
        const monthlyDeduction = amount / (advance.repaymentMonths || 1);

        return this.prisma.salaryAdvance.update({
            where: { id },
            data: {
                status: 'Approved',
                approvedBy,
                approvedAt: new Date(),
                approvedAmount: amount,
                monthlyDeduction: Math.round(monthlyDeduction * 100) / 100,
                balanceAmount: amount,
            },
        });
    }

    async rejectAdvance(id: string, rejectionReason: string) {
        const advance = await this.findAdvanceById(id);
        if (advance.status !== 'Pending') {
            throw new BadRequestException('Advance is not in pending status');
        }

        return this.prisma.salaryAdvance.update({
            where: { id },
            data: { status: 'Rejected', rejectionReason },
        });
    }

    async disburseAdvance(id: string) {
        const advance = await this.findAdvanceById(id);
        if (advance.status !== 'Approved') {
            throw new BadRequestException('Advance must be approved before disbursement');
        }

        const disbursementDate = new Date();
        const startDate = new Date(disbursementDate);
        startDate.setMonth(startDate.getMonth() + 1);

        // Generate recovery schedule
        const recoveries = [];
        let balance = advance.approvedAmount || 0;

        for (let i = 1; i <= advance.repaymentMonths; i++) {
            const dueDate = new Date(startDate);
            dueDate.setMonth(dueDate.getMonth() + i - 1);
            balance -= (advance.monthlyDeduction || 0);

            recoveries.push({
                advanceId: id,
                installmentNumber: i,
                dueDate,
                amount: advance.monthlyDeduction || 0,
                balanceAfter: Math.max(0, Math.round(balance * 100) / 100),
                status: 'Pending',
                companyId: advance.companyId,
            });
        }

        // Create recovery schedule
        await this.prisma.advanceRecovery.createMany({ data: recoveries });

        return this.prisma.salaryAdvance.update({
            where: { id },
            data: {
                status: 'Disbursed',
                disbursementDate,
            },
        });
    }

    async processRecovery(recoveryId: string, payslipId?: string) {
        const recovery = await this.prisma.advanceRecovery.findUnique({
            where: { id: recoveryId },
            include: { advance: true },
        });
        if (!recovery) throw new NotFoundException('Recovery not found');

        if (recovery.status === 'Deducted' || recovery.status === 'Paid') {
            throw new BadRequestException('Recovery already processed');
        }

        // Update recovery
        await this.prisma.advanceRecovery.update({
            where: { id: recoveryId },
            data: {
                status: 'Deducted',
                paidAmount: recovery.amount,
                deductionDate: new Date(),
                payslipId,
            },
        });

        // Update advance
        const advance = recovery.advance;
        const newPaidAmount = (advance.paidAmount || 0) + recovery.amount;
        const newBalance = (advance.balanceAmount || 0) - recovery.amount;
        const allRecovered = newBalance <= 0;

        await this.prisma.salaryAdvance.update({
            where: { id: advance.id },
            data: {
                paidAmount: newPaidAmount,
                balanceAmount: Math.max(0, newBalance),
                status: allRecovered ? 'Closed' : 'Repaying',
            },
        });

        return this.findAdvanceById(advance.id);
    }

    async updateAdvance(id: string, data: any) {
        const advance = await this.findAdvanceById(id);
        if (['Disbursed', 'Repaying', 'Closed'].includes(advance.status)) {
            throw new BadRequestException('Cannot update disbursed or active advance');
        }
        return this.prisma.salaryAdvance.update({ where: { id }, data });
    }

    async deleteAdvance(id: string) {
        const advance = await this.findAdvanceById(id);
        if (['Disbursed', 'Repaying', 'Closed'].includes(advance.status)) {
            throw new BadRequestException('Cannot delete disbursed or active advance');
        }
        return this.prisma.salaryAdvance.delete({ where: { id } });
    }

    // ============================================================================
    // ADVANCE REPORTS
    // ============================================================================

    async getAdvanceSummary(companyId: string) {
        const advances = await this.prisma.salaryAdvance.findMany({
            where: { companyId },
        });

        const byStatus = advances.reduce((acc: any, adv) => {
            if (!acc[adv.status]) {
                acc[adv.status] = { count: 0, totalAmount: 0 };
            }
            acc[adv.status].count++;
            acc[adv.status].totalAmount += adv.approvedAmount || adv.requestedAmount;
            return acc;
        }, {});

        const activeAdvances = advances.filter(a => ['Disbursed', 'Repaying'].includes(a.status));
        const totalDisbursed = activeAdvances.reduce((sum, a) => sum + (a.approvedAmount || 0), 0);
        const totalOutstanding = activeAdvances.reduce((sum, a) => sum + (a.balanceAmount || 0), 0);
        const totalRecovered = activeAdvances.reduce((sum, a) => sum + (a.paidAmount || 0), 0);

        return {
            totalAdvances: advances.length,
            activeAdvances: activeAdvances.length,
            totalDisbursed,
            totalOutstanding,
            totalRecovered,
            byStatus,
        };
    }

    async getPendingRecoveries(companyId: string, month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        return this.prisma.advanceRecovery.findMany({
            where: {
                companyId,
                status: 'Pending',
                dueDate: { gte: startDate, lte: endDate },
            },
            include: { advance: true },
            orderBy: { dueDate: 'asc' },
        });
    }
}
