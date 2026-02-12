import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PayrollProcessingService {
    constructor(private prisma: PrismaService) {}

    private generateRunCode(year: number, month: number, counter: number): string {
        return `PR-${year}${String(month).padStart(2, '0')}-${String(counter).padStart(3, '0')}`;
    }

    private generatePayslipNumber(year: number, month: number, counter: number): string {
        return `PS-${year}${String(month).padStart(2, '0')}-${String(counter).padStart(5, '0')}`;
    }

    // ============================================================================
    // PAYROLL PERIODS
    // ============================================================================

    async findAllPeriods(companyId: string, filters?: {
        year?: number;
        status?: string;
    }) {
        const where: any = { companyId };

        if (filters?.year) where.year = filters.year;
        if (filters?.status) where.status = filters.status;

        return this.prisma.payrollPeriod.findMany({
            where,
            orderBy: [{ year: 'desc' }, { month: 'desc' }],
        });
    }

    async findPeriodById(id: string) {
        const period = await this.prisma.payrollPeriod.findUnique({
            where: { id },
            include: { payrollRuns: true },
        });
        if (!period) throw new NotFoundException('Payroll period not found');
        return period;
    }

    async createPeriod(data: any) {
        const periodCode = `${data.year}-${String(data.month).padStart(2, '0')}`;
        const periodName = new Date(data.year, data.month - 1).toLocaleString('default', { month: 'long', year: 'numeric' });

        const existing = await this.prisma.payrollPeriod.findFirst({
            where: { periodCode, companyId: data.companyId },
        });
        if (existing) throw new BadRequestException('Period already exists');

        return this.prisma.payrollPeriod.create({
            data: {
                ...data,
                periodCode,
                periodName,
            },
        });
    }

    async lockPeriod(id: string, lockedBy: string) {
        await this.findPeriodById(id);
        return this.prisma.payrollPeriod.update({
            where: { id },
            data: {
                status: 'Locked',
                lockedBy,
                lockedAt: new Date(),
            },
        });
    }

    async closePeriod(id: string, closedBy: string) {
        const period = await this.findPeriodById(id);
        if (period.status !== 'Locked') {
            throw new BadRequestException('Period must be locked before closing');
        }
        return this.prisma.payrollPeriod.update({
            where: { id },
            data: {
                status: 'Closed',
                closedBy,
                closedAt: new Date(),
            },
        });
    }

    // ============================================================================
    // PAYROLL RUNS
    // ============================================================================

    async findAllRuns(companyId: string, filters?: {
        periodId?: string;
        status?: string;
        runType?: string;
    }) {
        const where: any = { companyId };

        if (filters?.periodId) where.periodId = filters.periodId;
        if (filters?.status) where.status = filters.status;
        if (filters?.runType) where.runType = filters.runType;

        return this.prisma.payrollRun.findMany({
            where,
            include: { period: true },
            orderBy: { createdAt: 'desc' },
        });
    }

    async findRunById(id: string) {
        const run = await this.prisma.payrollRun.findUnique({
            where: { id },
            include: { period: true, payslips: true },
        });
        if (!run) throw new NotFoundException('Payroll run not found');
        return run;
    }

    async createRun(data: any) {
        const period = await this.findPeriodById(data.periodId);
        if (period.status === 'Closed') {
            throw new BadRequestException('Cannot create run for closed period');
        }

        const count = await this.prisma.payrollRun.count({
            where: { periodId: data.periodId },
        });
        const runCode = this.generateRunCode(period.year, period.month, count + 1);

        return this.prisma.payrollRun.create({
            data: {
                ...data,
                runCode,
            },
        });
    }

    async processPayroll(runId: string, employeeIds?: string[]) {
        const run = await this.findRunById(runId);
        if (run.status !== 'Draft') {
            throw new BadRequestException('Payroll run is not in draft status');
        }

        const period = run.period;
        const settings = await this.prisma.payrollSettings.findFirst({
            where: { companyId: run.companyId },
        });

        // Get employees to process
        const employees = await this.prisma.employee.findMany({
            where: {
                companyId: run.companyId,
                isActive: true,
                ...(employeeIds?.length ? { id: { in: employeeIds } } : {}),
            },
            include: { department: true, designation: true },
        });

        // Get salary structures
        const salaryStructures = await this.prisma.employeeSalaryStructure.findMany({
            where: {
                companyId: run.companyId,
                isActive: true,
                effectiveFrom: { lte: period.endDate },
                OR: [
                    { effectiveTo: null },
                    { effectiveTo: { gte: period.startDate } },
                ],
            },
            include: { component: true },
        });

        // Get pending loan EMIs
        const pendingEMIs = await this.prisma.loanRepayment.findMany({
            where: {
                companyId: run.companyId,
                status: 'Pending',
                dueDate: { gte: period.startDate, lte: period.endDate },
            },
        });

        // Get pending advance recoveries
        const pendingRecoveries = await this.prisma.advanceRecovery.findMany({
            where: {
                companyId: run.companyId,
                status: 'Pending',
                dueDate: { gte: period.startDate, lte: period.endDate },
            },
        });

        let processedCount = 0;
        let totalGross = 0;
        let totalDeductions = 0;
        let totalNet = 0;
        let totalPF = 0;
        let totalESI = 0;
        let totalTDS = 0;

        // Process each employee
        for (const employee of employees) {
            const empStructures = salaryStructures.filter(s => s.employeeId === employee.id);

            // Calculate earnings
            let basicSalary = 0;
            let hra = 0;
            let conveyanceAllowance = 0;
            let specialAllowance = 0;
            let otherEarnings = 0;
            const earningsBreakdown: any[] = [];

            for (const struct of empStructures) {
                const component = struct.component;
                if (component.type === 'Earning') {
                    earningsBreakdown.push({
                        componentId: component.id,
                        code: component.code,
                        name: component.name,
                        amount: struct.amount,
                        taxable: component.taxable,
                    });

                    if (component.category === 'Basic') basicSalary = struct.amount;
                    else if (component.code === 'HRA') hra = struct.amount;
                    else if (component.code === 'CONV') conveyanceAllowance = struct.amount;
                    else if (component.code === 'SPECIAL') specialAllowance = struct.amount;
                    else otherEarnings += struct.amount;
                }
            }

            const grossEarnings = basicSalary + hra + conveyanceAllowance + specialAllowance + otherEarnings;

            // Calculate statutory deductions
            const pfEnabled = settings?.pfEnabled ?? true;
            const esiEnabled = settings?.esiEnabled ?? true;
            const pfWageCeiling = settings?.pfWageCeiling ?? 15000;
            const esiWageCeiling = settings?.esiWageCeiling ?? 21000;

            const pfWages = Math.min(basicSalary, pfWageCeiling);
            const pfEmployee = pfEnabled ? pfWages * (settings?.pfEmployeePercent ?? 12) / 100 : 0;
            const pfEmployer = pfEnabled ? pfWages * (settings?.pfEmployerPercent ?? 12) / 100 : 0;

            const esiWages = grossEarnings;
            const esiEmployee = esiEnabled && esiWages <= esiWageCeiling
                ? esiWages * (settings?.esiEmployeePercent ?? 0.75) / 100 : 0;
            const esiEmployer = esiEnabled && esiWages <= esiWageCeiling
                ? esiWages * (settings?.esiEmployerPercent ?? 3.25) / 100 : 0;

            // Calculate loan deductions
            const empEMIs = pendingEMIs.filter(e => {
                const loan = this.prisma.employeeLoan.findFirst({ where: { id: e.loanId } });
                return loan;
            });
            const loanDeductions = empEMIs.reduce((sum, e) => sum + e.emiAmount, 0);

            // Calculate advance deductions
            const empRecoveries = pendingRecoveries.filter(r => {
                const adv = this.prisma.salaryAdvance.findFirst({ where: { id: r.advanceId } });
                return adv;
            });
            const advanceDeductions = empRecoveries.reduce((sum, r) => sum + r.amount, 0);

            // Professional Tax (simplified - state specific)
            let professionalTax = 0;
            if (settings?.ptEnabled) {
                if (grossEarnings > 15000) professionalTax = 200;
                else if (grossEarnings > 10000) professionalTax = 150;
            }

            // TDS calculation (simplified)
            const tds = 0; // Would need proper calculation based on tax declarations

            const grossDeductions = pfEmployee + esiEmployee + professionalTax + tds + loanDeductions + advanceDeductions;
            const netPayable = grossEarnings - grossDeductions;

            // Create payslip
            const payslipCount = await this.prisma.paySlip.count({
                where: { payrollRunId: runId },
            });
            const payslipNumber = this.generatePayslipNumber(period.year, period.month, payslipCount + 1);

            await this.prisma.paySlip.create({
                data: {
                    payslipNumber,
                    payrollRunId: runId,
                    employeeId: employee.id,
                    employeeCode: employee.employeeCode,
                    employeeName: `${employee.firstName} ${employee.lastName}`,
                    departmentId: employee.departmentId,
                    departmentName: employee.department?.name,
                    designationId: employee.designationId,
                    designationName: employee.designation?.name,
                    periodMonth: period.month,
                    periodYear: period.year,
                    workingDays: period.workingDays || 30,
                    presentDays: period.workingDays || 30, // Would need attendance integration
                    paidDays: period.workingDays || 30,
                    basicSalary,
                    hra,
                    conveyanceAllowance,
                    specialAllowance,
                    otherEarnings,
                    earningsBreakdown,
                    grossEarnings,
                    pfEmployee: Math.round(pfEmployee * 100) / 100,
                    pfEmployer: Math.round(pfEmployer * 100) / 100,
                    esiEmployee: Math.round(esiEmployee * 100) / 100,
                    esiEmployer: Math.round(esiEmployer * 100) / 100,
                    professionalTax,
                    tds,
                    loanDeductions,
                    advanceDeductions,
                    grossDeductions: Math.round(grossDeductions * 100) / 100,
                    netPayable: Math.round(netPayable * 100) / 100,
                    status: 'Generated',
                    generatedAt: new Date(),
                    companyId: run.companyId,
                },
            });

            processedCount++;
            totalGross += grossEarnings;
            totalDeductions += grossDeductions;
            totalNet += netPayable;
            totalPF += pfEmployee + pfEmployer;
            totalESI += esiEmployee + esiEmployer;
            totalTDS += tds;
        }

        // Update run with totals
        return this.prisma.payrollRun.update({
            where: { id: runId },
            data: {
                status: 'Completed',
                processedCount,
                totalGross,
                totalDeductions,
                totalNet,
                totalPF,
                totalESI,
                totalTDS,
                processedAt: new Date(),
            },
        });
    }

    async approvePayrollRun(runId: string, approvedBy: string) {
        const run = await this.findRunById(runId);
        if (run.status !== 'Completed') {
            throw new BadRequestException('Payroll run must be completed before approval');
        }

        // Approve all payslips
        await this.prisma.paySlip.updateMany({
            where: { payrollRunId: runId },
            data: {
                status: 'Approved',
                approvedBy,
                approvedAt: new Date(),
            },
        });

        return this.prisma.payrollRun.update({
            where: { id: runId },
            data: {
                status: 'Approved',
                approvedBy,
                approvedAt: new Date(),
            },
        });
    }

    async publishPayslips(runId: string) {
        const run = await this.findRunById(runId);
        if (run.status !== 'Approved') {
            throw new BadRequestException('Payroll run must be approved before publishing');
        }

        await this.prisma.paySlip.updateMany({
            where: { payrollRunId: runId },
            data: {
                status: 'Published',
                publishedAt: new Date(),
            },
        });

        return this.prisma.payrollRun.update({
            where: { id: runId },
            data: { status: 'Paid' },
        });
    }

    // ============================================================================
    // PAYSLIPS
    // ============================================================================

    async findAllPayslips(companyId: string, filters?: {
        employeeId?: string;
        payrollRunId?: string;
        month?: number;
        year?: number;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.payrollRunId) where.payrollRunId = filters.payrollRunId;
        if (filters?.month) where.periodMonth = filters.month;
        if (filters?.year) where.periodYear = filters.year;
        if (filters?.status) where.status = filters.status;

        const page = filters?.page || 1;
        const limit = filters?.limit || 20;
        const skip = (page - 1) * limit;

        const [data, total] = await Promise.all([
            this.prisma.paySlip.findMany({
                where,
                include: { payrollRun: true },
                orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
                skip,
                take: limit,
            }),
            this.prisma.paySlip.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async findPayslipById(id: string) {
        const payslip = await this.prisma.paySlip.findUnique({
            where: { id },
            include: { payrollRun: { include: { period: true } } },
        });
        if (!payslip) throw new NotFoundException('Payslip not found');
        return payslip;
    }

    async getEmployeePayslips(employeeId: string, year?: number) {
        const where: any = { employeeId };
        if (year) where.periodYear = year;

        return this.prisma.paySlip.findMany({
            where,
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        });
    }
}
