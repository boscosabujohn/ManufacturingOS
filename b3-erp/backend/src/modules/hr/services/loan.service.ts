import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class LoanService {
    constructor(private prisma: PrismaService) {}

    private generateLoanNumber(companyId: string, counter: number): string {
        const year = new Date().getFullYear();
        return `LN-${year}-${String(counter).padStart(5, '0')}`;
    }

    // ============================================================================
    // LOAN TYPES
    // ============================================================================

    async findAllLoanTypes(companyId: string, filters?: {
        isActive?: boolean;
        search?: string;
    }) {
        const where: any = { companyId };

        if (filters?.isActive !== undefined) where.isActive = filters.isActive;
        if (filters?.search) {
            where.OR = [
                { code: { contains: filters.search, mode: 'insensitive' } },
                { name: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        return this.prisma.loanType.findMany({
            where,
            orderBy: { name: 'asc' },
        });
    }

    async findLoanTypeById(id: string) {
        const loanType = await this.prisma.loanType.findUnique({ where: { id } });
        if (!loanType) throw new NotFoundException('Loan type not found');
        return loanType;
    }

    async createLoanType(data: any) {
        const existing = await this.prisma.loanType.findFirst({
            where: { code: data.code, companyId: data.companyId },
        });
        if (existing) throw new BadRequestException('Loan type code already exists');

        return this.prisma.loanType.create({ data });
    }

    async updateLoanType(id: string, data: any) {
        await this.findLoanTypeById(id);
        return this.prisma.loanType.update({ where: { id }, data });
    }

    async deleteLoanType(id: string) {
        await this.findLoanTypeById(id);
        return this.prisma.loanType.delete({ where: { id } });
    }

    // ============================================================================
    // EMPLOYEE LOANS
    // ============================================================================

    async findAllLoans(companyId: string, filters?: {
        employeeId?: string;
        loanTypeId?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.loanTypeId) where.loanTypeId = filters.loanTypeId;
        if (filters?.status) where.status = filters.status;

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.employeeLoan.findMany({
                where,
                include: { loanType: true, repayments: true },
                orderBy: { createdAt: 'desc' },
                skip,
                take: limit,
            }),
            this.prisma.employeeLoan.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async findLoanById(id: string) {
        const loan = await this.prisma.employeeLoan.findUnique({
            where: { id },
            include: { loanType: true, repayments: { orderBy: { emiNumber: 'asc' } } },
        });
        if (!loan) throw new NotFoundException('Loan not found');
        return loan;
    }

    async createLoan(data: any) {
        const count = await this.prisma.employeeLoan.count({ where: { companyId: data.companyId } });
        const loanNumber = this.generateLoanNumber(data.companyId, count + 1);

        const loanType = await this.findLoanTypeById(data.loanTypeId);

        // Calculate EMI based on loan type
        const principal = data.requestedAmount;
        const rate = data.interestRate ?? loanType.defaultInterestRate ?? 0;
        const tenure = data.tenureMonths;
        const processingFee = principal * (loanType.processingFeePercent || 0) / 100;

        let emiAmount = 0;
        let totalRepayable = 0;

        if (rate === 0) {
            // No interest loan
            emiAmount = principal / tenure;
            totalRepayable = principal;
        } else {
            // Simple interest calculation
            const interest = (principal * rate * tenure) / (12 * 100);
            totalRepayable = principal + interest;
            emiAmount = totalRepayable / tenure;
        }

        return this.prisma.employeeLoan.create({
            data: {
                ...data,
                loanNumber,
                interestRate: rate,
                processingFee,
                emiAmount: Math.round(emiAmount * 100) / 100,
                totalRepayable: Math.round(totalRepayable * 100) / 100,
                remainingEMIs: tenure,
            },
        });
    }

    async approveLoan(id: string, approvedBy: string, approvedAmount?: number) {
        const loan = await this.findLoanById(id);
        if (loan.status !== 'Pending') {
            throw new BadRequestException('Loan is not in pending status');
        }

        const amount = approvedAmount ?? loan.requestedAmount;
        const loanType = await this.findLoanTypeById(loan.loanTypeId);

        // Recalculate if amount changed
        const rate = loan.interestRate;
        const tenure = loan.tenureMonths;
        const processingFee = amount * (loanType.processingFeePercent || 0) / 100;

        let emiAmount = 0;
        let totalRepayable = 0;

        if (rate === 0) {
            emiAmount = amount / tenure;
            totalRepayable = amount;
        } else {
            const interest = (amount * rate * tenure) / (12 * 100);
            totalRepayable = amount + interest;
            emiAmount = totalRepayable / tenure;
        }

        return this.prisma.employeeLoan.update({
            where: { id },
            data: {
                status: 'Approved',
                approvedBy,
                approvedAt: new Date(),
                approvedAmount: amount,
                processingFee,
                emiAmount: Math.round(emiAmount * 100) / 100,
                totalRepayable: Math.round(totalRepayable * 100) / 100,
                outstandingBalance: Math.round(totalRepayable * 100) / 100,
                remainingEMIs: tenure,
            },
        });
    }

    async rejectLoan(id: string, rejectionReason: string) {
        const loan = await this.findLoanById(id);
        if (loan.status !== 'Pending') {
            throw new BadRequestException('Loan is not in pending status');
        }

        return this.prisma.employeeLoan.update({
            where: { id },
            data: { status: 'Rejected', rejectionReason },
        });
    }

    async disburseLoan(id: string) {
        const loan = await this.findLoanById(id);
        if (loan.status !== 'Approved') {
            throw new BadRequestException('Loan must be approved before disbursement');
        }

        const disbursementDate = new Date();
        const repaymentStartDate = new Date(disbursementDate);
        repaymentStartDate.setMonth(repaymentStartDate.getMonth() + 1);

        const repaymentEndDate = new Date(repaymentStartDate);
        repaymentEndDate.setMonth(repaymentEndDate.getMonth() + loan.tenureMonths - 1);

        // Generate EMI schedule
        const repayments = [];
        let balance = loan.totalRepayable || 0;
        const monthlyPrincipal = (loan.approvedAmount || 0) / loan.tenureMonths;
        const monthlyInterest = ((loan.totalRepayable || 0) - (loan.approvedAmount || 0)) / loan.tenureMonths;

        for (let i = 1; i <= loan.tenureMonths; i++) {
            const dueDate = new Date(repaymentStartDate);
            dueDate.setMonth(dueDate.getMonth() + i - 1);
            balance -= (loan.emiAmount || 0);

            repayments.push({
                loanId: id,
                emiNumber: i,
                dueDate,
                principalAmount: Math.round(monthlyPrincipal * 100) / 100,
                interestAmount: Math.round(monthlyInterest * 100) / 100,
                emiAmount: loan.emiAmount || 0,
                balanceAfterEMI: Math.max(0, Math.round(balance * 100) / 100),
                status: 'Pending',
                companyId: loan.companyId,
            });
        }

        // Create repayment schedule
        await this.prisma.loanRepayment.createMany({ data: repayments });

        return this.prisma.employeeLoan.update({
            where: { id },
            data: {
                status: 'Disbursed',
                disbursementDate,
                repaymentStartDate,
                repaymentEndDate,
            },
        });
    }

    async processEMIDeduction(repaymentId: string, payslipId?: string) {
        const repayment = await this.prisma.loanRepayment.findUnique({
            where: { id: repaymentId },
            include: { loan: true },
        });
        if (!repayment) throw new NotFoundException('Repayment not found');

        if (repayment.status === 'Deducted' || repayment.status === 'Paid') {
            throw new BadRequestException('EMI already processed');
        }

        // Update repayment
        await this.prisma.loanRepayment.update({
            where: { id: repaymentId },
            data: {
                status: 'Deducted',
                paidAmount: repayment.emiAmount,
                deductionDate: new Date(),
                payslipId,
                paymentMode: 'Salary',
            },
        });

        // Update loan
        const loan = repayment.loan;
        const newPaidEMIs = loan.paidEMIs + 1;
        const newRemainingEMIs = (loan.remainingEMIs || 0) - 1;
        const newOutstanding = (loan.outstandingBalance || 0) - repayment.emiAmount;

        await this.prisma.employeeLoan.update({
            where: { id: loan.id },
            data: {
                paidEMIs: newPaidEMIs,
                remainingEMIs: newRemainingEMIs,
                outstandingBalance: Math.max(0, newOutstanding),
                status: newRemainingEMIs === 0 ? 'Closed' : 'Active',
            },
        });

        return this.findLoanById(loan.id);
    }

    async deleteLoan(id: string) {
        const loan = await this.findLoanById(id);
        if (['Disbursed', 'Active', 'Closed'].includes(loan.status)) {
            throw new BadRequestException('Cannot delete disbursed or active loan');
        }
        return this.prisma.employeeLoan.delete({ where: { id } });
    }

    // ============================================================================
    // LOAN REPORTS
    // ============================================================================

    async getLoanSummary(companyId: string) {
        const loans = await this.prisma.employeeLoan.findMany({
            where: { companyId },
            include: { loanType: true },
        });

        const byStatus = loans.reduce((acc: any, loan) => {
            if (!acc[loan.status]) {
                acc[loan.status] = { count: 0, totalAmount: 0 };
            }
            acc[loan.status].count++;
            acc[loan.status].totalAmount += loan.approvedAmount || loan.requestedAmount;
            return acc;
        }, {});

        const byType = loans.reduce((acc: any, loan) => {
            const typeName = loan.loanType.name;
            if (!acc[typeName]) {
                acc[typeName] = { count: 0, totalAmount: 0, outstanding: 0 };
            }
            acc[typeName].count++;
            acc[typeName].totalAmount += loan.approvedAmount || loan.requestedAmount;
            acc[typeName].outstanding += loan.outstandingBalance || 0;
            return acc;
        }, {});

        const activeLoans = loans.filter(l => ['Disbursed', 'Active'].includes(l.status));
        const totalDisbursed = activeLoans.reduce((sum, l) => sum + (l.approvedAmount || 0), 0);
        const totalOutstanding = activeLoans.reduce((sum, l) => sum + (l.outstandingBalance || 0), 0);
        const totalRecovered = totalDisbursed - totalOutstanding;

        return {
            totalLoans: loans.length,
            activeLoans: activeLoans.length,
            totalDisbursed,
            totalOutstanding,
            totalRecovered,
            byStatus,
            byType,
        };
    }

    async getPendingEMIs(companyId: string, month: number, year: number) {
        const startDate = new Date(year, month - 1, 1);
        const endDate = new Date(year, month, 0);

        return this.prisma.loanRepayment.findMany({
            where: {
                companyId,
                status: 'Pending',
                dueDate: { gte: startDate, lte: endDate },
            },
            include: { loan: { include: { loanType: true } } },
            orderBy: { dueDate: 'asc' },
        });
    }
}
