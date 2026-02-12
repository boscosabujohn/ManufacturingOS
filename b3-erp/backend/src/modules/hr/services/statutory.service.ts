import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class StatutoryService {
    constructor(private prisma: PrismaService) {}

    // ============================================================================
    // TAX DECLARATIONS
    // ============================================================================

    async findAllDeclarations(companyId: string, filters?: {
        employeeId?: string;
        financialYear?: string;
        declarationType?: string;
        status?: string;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.financialYear) where.financialYear = filters.financialYear;
        if (filters?.declarationType) where.declarationType = filters.declarationType;
        if (filters?.status) where.status = filters.status;

        return this.prisma.taxDeclaration.findMany({
            where,
            orderBy: { createdAt: 'desc' },
        });
    }

    async findDeclarationById(id: string) {
        const declaration = await this.prisma.taxDeclaration.findUnique({ where: { id } });
        if (!declaration) throw new NotFoundException('Tax declaration not found');
        return declaration;
    }

    async createDeclaration(data: any) {
        // Calculate totals
        const section80C_Total = Math.min(
            150000,
            (data.section80C_PPF || 0) +
            (data.section80C_ELSS || 0) +
            (data.section80C_LIC || 0) +
            (data.section80C_NSC || 0) +
            (data.section80C_HomeLoan || 0) +
            (data.section80C_TuitionFee || 0) +
            (data.section80C_FD || 0) +
            (data.section80C_Other || 0)
        );

        const section80D_Total = Math.min(
            75000,
            (data.section80D_Self || 0) + (data.section80D_Parents || 0)
        );

        const totalDeductions =
            section80C_Total +
            section80D_Total +
            (data.section80E_Education || 0) +
            (data.section80G_Donation || 0) +
            Math.min(10000, data.section80TTA_Savings || 0) +
            Math.min(200000, data.section24_HomeLoan || 0) +
            Math.min(50000, data.nps_80CCD1B || 0) +
            (data.hraExemption || 0) +
            (data.ltaClaimed || 0);

        return this.prisma.taxDeclaration.create({
            data: {
                ...data,
                section80C_Total,
                section80D_Total,
                totalDeductions,
            },
        });
    }

    async updateDeclaration(id: string, data: any) {
        const declaration = await this.findDeclarationById(id);
        if (declaration.status === 'Locked') {
            throw new BadRequestException('Cannot update locked declaration');
        }

        // Recalculate if components changed
        if (Object.keys(data).some(k => k.startsWith('section80') || k === 'hraExemption' || k === 'ltaClaimed')) {
            const current = { ...declaration, ...data };

            const section80C_Total = Math.min(
                150000,
                (current.section80C_PPF || 0) +
                (current.section80C_ELSS || 0) +
                (current.section80C_LIC || 0) +
                (current.section80C_NSC || 0) +
                (current.section80C_HomeLoan || 0) +
                (current.section80C_TuitionFee || 0) +
                (current.section80C_FD || 0) +
                (current.section80C_Other || 0)
            );

            const section80D_Total = Math.min(
                75000,
                (current.section80D_Self || 0) + (current.section80D_Parents || 0)
            );

            data.section80C_Total = section80C_Total;
            data.section80D_Total = section80D_Total;
            data.totalDeductions =
                section80C_Total +
                section80D_Total +
                (current.section80E_Education || 0) +
                (current.section80G_Donation || 0) +
                Math.min(10000, current.section80TTA_Savings || 0) +
                Math.min(200000, current.section24_HomeLoan || 0) +
                Math.min(50000, current.nps_80CCD1B || 0) +
                (current.hraExemption || 0) +
                (current.ltaClaimed || 0);
        }

        return this.prisma.taxDeclaration.update({ where: { id }, data });
    }

    async submitDeclaration(id: string) {
        await this.findDeclarationById(id);
        return this.prisma.taxDeclaration.update({
            where: { id },
            data: { status: 'Submitted', submittedAt: new Date() },
        });
    }

    async verifyDeclaration(id: string, verifiedBy: string) {
        await this.findDeclarationById(id);
        return this.prisma.taxDeclaration.update({
            where: { id },
            data: { status: 'Verified', verifiedBy, verifiedAt: new Date() },
        });
    }

    async approveDeclaration(id: string, approvedBy: string) {
        await this.findDeclarationById(id);
        return this.prisma.taxDeclaration.update({
            where: { id },
            data: { status: 'Approved', approvedBy, approvedAt: new Date() },
        });
    }

    async lockDeclaration(id: string) {
        await this.findDeclarationById(id);
        return this.prisma.taxDeclaration.update({
            where: { id },
            data: { status: 'Locked' },
        });
    }

    // ============================================================================
    // PF CONTRIBUTIONS
    // ============================================================================

    async findAllPFContributions(companyId: string, filters?: {
        employeeId?: string;
        month?: number;
        year?: number;
        status?: string;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.month) where.periodMonth = filters.month;
        if (filters?.year) where.periodYear = filters.year;
        if (filters?.status) where.status = filters.status;

        return this.prisma.pFContribution.findMany({
            where,
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        });
    }

    async createPFContribution(data: any) {
        const settings = await this.prisma.payrollSettings.findFirst({
            where: { companyId: data.companyId },
        });

        const pfWageCeiling = settings?.pfWageCeiling ?? 15000;
        const pfWages = Math.min(data.basicWages, pfWageCeiling);

        // Calculate contributions
        const employeeContribution = pfWages * (settings?.pfEmployeePercent ?? 12) / 100;
        const employerEPF = pfWages * 3.67 / 100;
        const employerEPS = Math.min(pfWages * 8.33 / 100, 15000 * 8.33 / 100);
        const employerEDLI = pfWages * (settings?.pfEdliPercent ?? 0.5) / 100;
        const adminCharges = pfWages * (settings?.pfAdminPercent ?? 0.5) / 100;

        const totalEmployer = employerEPF + employerEPS + employerEDLI + adminCharges;
        const totalContribution = employeeContribution + totalEmployer;

        return this.prisma.pFContribution.create({
            data: {
                ...data,
                pfWages,
                employeeContribution: Math.round(employeeContribution * 100) / 100,
                employerEPF: Math.round(employerEPF * 100) / 100,
                employerEPS: Math.round(employerEPS * 100) / 100,
                employerEDLI: Math.round(employerEDLI * 100) / 100,
                adminCharges: Math.round(adminCharges * 100) / 100,
                totalEmployer: Math.round(totalEmployer * 100) / 100,
                totalContribution: Math.round(totalContribution * 100) / 100,
            },
        });
    }

    async getPFSummary(companyId: string, month: number, year: number) {
        const contributions = await this.prisma.pFContribution.findMany({
            where: { companyId, periodMonth: month, periodYear: year },
        });

        return {
            month,
            year,
            employeeCount: contributions.length,
            totalPFWages: contributions.reduce((sum, c) => sum + c.pfWages, 0),
            totalEmployeeContribution: contributions.reduce((sum, c) => sum + c.employeeContribution, 0),
            totalEmployerEPF: contributions.reduce((sum, c) => sum + c.employerEPF, 0),
            totalEmployerEPS: contributions.reduce((sum, c) => sum + c.employerEPS, 0),
            totalEmployerEDLI: contributions.reduce((sum, c) => sum + c.employerEDLI, 0),
            totalAdminCharges: contributions.reduce((sum, c) => sum + c.adminCharges, 0),
            totalContribution: contributions.reduce((sum, c) => sum + c.totalContribution, 0),
            totalVPF: contributions.reduce((sum, c) => sum + c.vpfEmployee, 0),
        };
    }

    async markPFSubmitted(companyId: string, month: number, year: number, challanNumber: string, challanDate: Date) {
        return this.prisma.pFContribution.updateMany({
            where: { companyId, periodMonth: month, periodYear: year },
            data: { status: 'Submitted', challanNumber, challanDate },
        });
    }

    // ============================================================================
    // ESI CONTRIBUTIONS
    // ============================================================================

    async findAllESIContributions(companyId: string, filters?: {
        employeeId?: string;
        month?: number;
        year?: number;
        status?: string;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.month) where.periodMonth = filters.month;
        if (filters?.year) where.periodYear = filters.year;
        if (filters?.status) where.status = filters.status;

        return this.prisma.eSIContribution.findMany({
            where,
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        });
    }

    async createESIContribution(data: any) {
        const settings = await this.prisma.payrollSettings.findFirst({
            where: { companyId: data.companyId },
        });

        const esiWageCeiling = settings?.esiWageCeiling ?? 21000;

        // Only applicable if wages are below ceiling
        if (data.grossWages > esiWageCeiling) {
            return null; // Employee not eligible for ESI
        }

        const esiWages = data.grossWages;
        const employeeContribution = esiWages * (settings?.esiEmployeePercent ?? 0.75) / 100;
        const employerContribution = esiWages * (settings?.esiEmployerPercent ?? 3.25) / 100;
        const totalContribution = employeeContribution + employerContribution;

        return this.prisma.eSIContribution.create({
            data: {
                ...data,
                esiWages,
                employeeContribution: Math.round(employeeContribution * 100) / 100,
                employerContribution: Math.round(employerContribution * 100) / 100,
                totalContribution: Math.round(totalContribution * 100) / 100,
            },
        });
    }

    async getESISummary(companyId: string, month: number, year: number) {
        const contributions = await this.prisma.eSIContribution.findMany({
            where: { companyId, periodMonth: month, periodYear: year },
        });

        return {
            month,
            year,
            employeeCount: contributions.length,
            totalESIWages: contributions.reduce((sum, c) => sum + c.esiWages, 0),
            totalEmployeeContribution: contributions.reduce((sum, c) => sum + c.employeeContribution, 0),
            totalEmployerContribution: contributions.reduce((sum, c) => sum + c.employerContribution, 0),
            totalContribution: contributions.reduce((sum, c) => sum + c.totalContribution, 0),
        };
    }

    async markESISubmitted(companyId: string, month: number, year: number, challanNumber: string, challanDate: Date) {
        return this.prisma.eSIContribution.updateMany({
            where: { companyId, periodMonth: month, periodYear: year },
            data: { status: 'Submitted', challanNumber, challanDate },
        });
    }

    // ============================================================================
    // TDS DEDUCTIONS
    // ============================================================================

    async findAllTDSDeductions(companyId: string, filters?: {
        employeeId?: string;
        financialYear?: string;
        month?: number;
        year?: number;
    }) {
        const where: any = { companyId };

        if (filters?.employeeId) where.employeeId = filters.employeeId;
        if (filters?.financialYear) where.financialYear = filters.financialYear;
        if (filters?.month) where.periodMonth = filters.month;
        if (filters?.year) where.periodYear = filters.year;

        return this.prisma.tDSDeduction.findMany({
            where,
            orderBy: [{ periodYear: 'desc' }, { periodMonth: 'desc' }],
        });
    }

    async calculateTDS(employeeId: string, financialYear: string, grossSalary: number, companyId: string) {
        // Get tax declaration
        const declaration = await this.prisma.taxDeclaration.findFirst({
            where: { employeeId, financialYear, companyId, status: { in: ['Approved', 'Locked'] } },
        });

        const exemptions = declaration?.totalDeductions || 0;
        const taxableIncome = Math.max(0, grossSalary * 12 - exemptions);

        // Calculate tax based on regime (simplified old regime)
        let taxOnIncome = 0;
        if (declaration?.taxRegime === 'New') {
            // New regime slabs (FY 2024-25)
            if (taxableIncome > 1500000) taxOnIncome = 150000 + (taxableIncome - 1500000) * 0.30;
            else if (taxableIncome > 1200000) taxOnIncome = 75000 + (taxableIncome - 1200000) * 0.25;
            else if (taxableIncome > 900000) taxOnIncome = 45000 + (taxableIncome - 900000) * 0.20;
            else if (taxableIncome > 600000) taxOnIncome = 15000 + (taxableIncome - 600000) * 0.15;
            else if (taxableIncome > 300000) taxOnIncome = (taxableIncome - 300000) * 0.05;
        } else {
            // Old regime slabs
            if (taxableIncome > 1000000) taxOnIncome = 112500 + (taxableIncome - 1000000) * 0.30;
            else if (taxableIncome > 500000) taxOnIncome = 12500 + (taxableIncome - 500000) * 0.20;
            else if (taxableIncome > 250000) taxOnIncome = (taxableIncome - 250000) * 0.05;
        }

        const surcharge = taxableIncome > 5000000 ? taxOnIncome * 0.10 : 0;
        const educationCess = (taxOnIncome + surcharge) * 0.04;
        const totalTax = taxOnIncome + surcharge + educationCess;
        const monthlyTDS = totalTax / 12;

        return {
            taxableIncome,
            taxOnIncome: Math.round(taxOnIncome),
            surcharge: Math.round(surcharge),
            educationCess: Math.round(educationCess),
            totalTax: Math.round(totalTax),
            monthlyTDS: Math.round(monthlyTDS),
        };
    }

    async getTDSSummary(companyId: string, financialYear: string) {
        const deductions = await this.prisma.tDSDeduction.findMany({
            where: { companyId, financialYear },
        });

        const byMonth = deductions.reduce((acc: any, d) => {
            const key = `${d.periodYear}-${String(d.periodMonth).padStart(2, '0')}`;
            if (!acc[key]) {
                acc[key] = { count: 0, totalTDS: 0 };
            }
            acc[key].count++;
            acc[key].totalTDS += d.tdsDeducted;
            return acc;
        }, {});

        return {
            financialYear,
            totalEmployees: new Set(deductions.map(d => d.employeeId)).size,
            totalTDSDeducted: deductions.reduce((sum, d) => sum + d.tdsDeducted, 0),
            byMonth,
        };
    }

    // ============================================================================
    // PAYROLL SETTINGS
    // ============================================================================

    async getPayrollSettings(companyId: string) {
        let settings = await this.prisma.payrollSettings.findFirst({
            where: { companyId },
        });

        if (!settings) {
            // Create default settings
            settings = await this.prisma.payrollSettings.create({
                data: { companyId },
            });
        }

        return settings;
    }

    async updatePayrollSettings(companyId: string, data: any) {
        const settings = await this.getPayrollSettings(companyId);
        return this.prisma.payrollSettings.update({
            where: { id: settings.id },
            data,
        });
    }
}
