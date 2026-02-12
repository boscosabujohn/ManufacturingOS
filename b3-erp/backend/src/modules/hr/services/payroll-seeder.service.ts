import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class PayrollSeederService implements OnModuleInit {
    private readonly logger = new Logger(PayrollSeederService.name);

    constructor(private readonly prisma: PrismaService) {}

    async onModuleInit(): Promise<void> {
        await this.seedPayrollData();
    }

    async seedPayrollData(): Promise<void> {
        // Get the first company for seeding
        const company = await this.prisma.company.findFirst();
        if (!company) {
            this.logger.warn('No company found. Skipping payroll seeding.');
            return;
        }

        await this.seedSalaryComponents(company.id);
        await this.seedBonusTypes(company.id);
        await this.seedLoanTypes(company.id);
        await this.seedIncentiveSchemes(company.id);
        await this.seedPayrollSettings(company.id);
    }

    private async seedSalaryComponents(companyId: string): Promise<void> {
        this.logger.log('Seeding salary components...');

        const components = [
            // Earnings
            {
                code: 'BASIC',
                name: 'Basic Salary',
                type: 'Earning',
                category: 'Basic',
                calculationType: 'Fixed',
                taxable: true,
                affectsPF: true,
                affectsESI: true,
                affectsGratuity: true,
                displayOrder: 1,
                companyId,
            },
            {
                code: 'HRA',
                name: 'House Rent Allowance',
                type: 'Earning',
                category: 'Allowance',
                calculationType: 'Percentage',
                calculationBase: 'BasicSalary',
                percentage: 40,
                taxable: true,
                displayOrder: 2,
                companyId,
            },
            {
                code: 'CONV',
                name: 'Conveyance Allowance',
                type: 'Earning',
                category: 'Allowance',
                calculationType: 'Fixed',
                taxable: true,
                displayOrder: 3,
                companyId,
            },
            {
                code: 'SPECIAL',
                name: 'Special Allowance',
                type: 'Earning',
                category: 'Allowance',
                calculationType: 'Fixed',
                taxable: true,
                displayOrder: 4,
                companyId,
            },
            {
                code: 'MEDICAL',
                name: 'Medical Allowance',
                type: 'Earning',
                category: 'Allowance',
                calculationType: 'Fixed',
                taxable: true,
                displayOrder: 5,
                companyId,
            },
            {
                code: 'LTA',
                name: 'Leave Travel Allowance',
                type: 'Earning',
                category: 'Allowance',
                calculationType: 'Fixed',
                taxable: false,
                displayOrder: 6,
                companyId,
            },
            // Deductions
            {
                code: 'PF_EMP',
                name: 'Provident Fund (Employee)',
                type: 'Deduction',
                category: 'Statutory',
                calculationType: 'Percentage',
                calculationBase: 'BasicSalary',
                percentage: 12,
                taxable: false,
                isStatutory: true,
                displayOrder: 10,
                companyId,
            },
            {
                code: 'ESI_EMP',
                name: 'ESI (Employee)',
                type: 'Deduction',
                category: 'Statutory',
                calculationType: 'Percentage',
                calculationBase: 'GrossSalary',
                percentage: 0.75,
                taxable: false,
                isStatutory: true,
                displayOrder: 11,
                companyId,
            },
            {
                code: 'PT',
                name: 'Professional Tax',
                type: 'Deduction',
                category: 'Statutory',
                calculationType: 'Fixed',
                taxable: false,
                isStatutory: true,
                displayOrder: 12,
                companyId,
            },
            {
                code: 'TDS',
                name: 'Tax Deducted at Source',
                type: 'Deduction',
                category: 'Statutory',
                calculationType: 'Formula',
                taxable: false,
                isStatutory: true,
                displayOrder: 13,
                companyId,
            },
        ];

        for (const component of components) {
            const existing = await this.prisma.salaryComponent.findFirst({
                where: { code: component.code, companyId },
            });

            if (!existing) {
                await this.prisma.salaryComponent.create({ data: component });
                this.logger.log(`Created salary component: ${component.name}`);
            }
        }
    }

    private async seedBonusTypes(companyId: string): Promise<void> {
        this.logger.log('Seeding bonus types...');

        const bonusTypes = [
            {
                code: 'ANNUAL',
                name: 'Annual Bonus',
                description: 'Annual performance-based bonus paid at year end',
                calculationType: 'PercentageOfBasic',
                defaultPercent: 8.33,
                frequency: 'Annual',
                taxable: true,
                isStatutory: true,
                minDaysWorked: 30,
                companyId,
            },
            {
                code: 'PERF',
                name: 'Performance Bonus',
                description: 'Quarterly performance bonus based on individual KPIs',
                calculationType: 'PercentageOfGross',
                defaultPercent: 10,
                frequency: 'Quarterly',
                taxable: true,
                companyId,
            },
            {
                code: 'FESTIVAL',
                name: 'Festival Bonus',
                description: 'Festival allowance/bonus',
                calculationType: 'Fixed',
                defaultAmount: 5000,
                frequency: 'Annual',
                taxable: true,
                companyId,
            },
            {
                code: 'RETENTION',
                name: 'Retention Bonus',
                description: 'Retention bonus for key employees',
                calculationType: 'PercentageOfCTC',
                defaultPercent: 15,
                frequency: 'OneTime',
                taxable: true,
                companyId,
            },
            {
                code: 'PROJECT',
                name: 'Project Completion Bonus',
                description: 'Bonus for successful project completion',
                calculationType: 'Fixed',
                frequency: 'OneTime',
                taxable: true,
                companyId,
            },
        ];

        for (const bonusType of bonusTypes) {
            const existing = await this.prisma.bonusType.findFirst({
                where: { code: bonusType.code, companyId },
            });

            if (!existing) {
                await this.prisma.bonusType.create({ data: bonusType });
                this.logger.log(`Created bonus type: ${bonusType.name}`);
            }
        }
    }

    private async seedLoanTypes(companyId: string): Promise<void> {
        this.logger.log('Seeding loan types...');

        const loanTypes = [
            {
                code: 'PERSONAL',
                name: 'Personal Loan',
                description: 'Personal loan for employees for any purpose',
                maxAmount: 500000,
                maxTenureMonths: 36,
                interestType: 'Simple',
                defaultInterestRate: 8,
                processingFeePercent: 1,
                minServiceMonths: 12,
                maxLoanMultiplier: 3,
                companyId,
            },
            {
                code: 'EMERGENCY',
                name: 'Emergency Loan',
                description: 'Interest-free emergency loan for medical/urgent needs',
                maxAmount: 100000,
                maxTenureMonths: 12,
                interestType: 'None',
                defaultInterestRate: 0,
                processingFeePercent: 0,
                minServiceMonths: 6,
                companyId,
            },
            {
                code: 'EDUCATION',
                name: 'Education Loan',
                description: 'Loan for employee or dependent education',
                maxAmount: 300000,
                maxTenureMonths: 48,
                interestType: 'Simple',
                defaultInterestRate: 6,
                processingFeePercent: 0.5,
                minServiceMonths: 24,
                companyId,
            },
            {
                code: 'VEHICLE',
                name: 'Vehicle Loan',
                description: 'Loan for purchasing two-wheeler or car',
                maxAmount: 800000,
                maxTenureMonths: 60,
                interestType: 'Simple',
                defaultInterestRate: 7.5,
                processingFeePercent: 1,
                minServiceMonths: 24,
                requiresGuarantor: true,
                companyId,
            },
            {
                code: 'HOUSING',
                name: 'Housing Loan',
                description: 'Home purchase/construction loan advance',
                maxAmount: 2000000,
                maxTenureMonths: 120,
                interestType: 'Simple',
                defaultInterestRate: 7,
                processingFeePercent: 0.5,
                minServiceMonths: 36,
                requiresGuarantor: true,
                companyId,
            },
        ];

        for (const loanType of loanTypes) {
            const existing = await this.prisma.loanType.findFirst({
                where: { code: loanType.code, companyId },
            });

            if (!existing) {
                await this.prisma.loanType.create({ data: loanType });
                this.logger.log(`Created loan type: ${loanType.name}`);
            }
        }
    }

    private async seedIncentiveSchemes(companyId: string): Promise<void> {
        this.logger.log('Seeding incentive schemes...');

        const schemes = [
            {
                code: 'SALES_COMM',
                name: 'Sales Commission',
                description: 'Monthly sales target achievement incentive',
                schemeType: 'Sales',
                calculationMethod: 'SlabBased',
                targetField: 'salesAmount',
                slabs: [
                    { minPercent: 80, maxPercent: 90, percent: 2 },
                    { minPercent: 90, maxPercent: 100, percent: 3 },
                    { minPercent: 100, maxPercent: 120, percent: 5 },
                    { minPercent: 120, maxPercent: 999, percent: 7 },
                ],
                minThreshold: 80,
                frequency: 'Monthly',
                applicableTo: 'Department',
                effectiveFrom: new Date(),
                companyId,
            },
            {
                code: 'PRODUCTION',
                name: 'Production Incentive',
                description: 'Monthly production target achievement bonus',
                schemeType: 'Production',
                calculationMethod: 'PercentageOfTarget',
                targetField: 'units',
                minThreshold: 90,
                maxCap: 25000,
                frequency: 'Monthly',
                applicableTo: 'Department',
                effectiveFrom: new Date(),
                companyId,
            },
            {
                code: 'ATTENDANCE',
                name: 'Perfect Attendance Bonus',
                description: 'Bonus for 100% attendance in a month',
                schemeType: 'Attendance',
                calculationMethod: 'FixedPerUnit',
                targetField: 'attendancePercent',
                minThreshold: 100,
                frequency: 'Monthly',
                applicableTo: 'All',
                effectiveFrom: new Date(),
                companyId,
            },
            {
                code: 'REFERRAL',
                name: 'Employee Referral Bonus',
                description: 'Bonus for successful employee referrals',
                schemeType: 'Custom',
                calculationMethod: 'FixedPerUnit',
                frequency: 'Monthly',
                applicableTo: 'All',
                effectiveFrom: new Date(),
                companyId,
            },
        ];

        for (const scheme of schemes) {
            const existing = await this.prisma.incentiveScheme.findFirst({
                where: { code: scheme.code, companyId },
            });

            if (!existing) {
                await this.prisma.incentiveScheme.create({ data: scheme });
                this.logger.log(`Created incentive scheme: ${scheme.name}`);
            }
        }
    }

    private async seedPayrollSettings(companyId: string): Promise<void> {
        this.logger.log('Seeding payroll settings...');

        const existing = await this.prisma.payrollSettings.findFirst({
            where: { companyId },
        });

        if (!existing) {
            await this.prisma.payrollSettings.create({
                data: {
                    companyId,
                    pfEnabled: true,
                    pfEmployeePercent: 12,
                    pfEmployerPercent: 12,
                    pfWageCeiling: 15000,
                    pfAdminPercent: 0.5,
                    pfEdliPercent: 0.5,
                    esiEnabled: true,
                    esiEmployeePercent: 0.75,
                    esiEmployerPercent: 3.25,
                    esiWageCeiling: 21000,
                    ptEnabled: true,
                    ptSlabs: [
                        { minSalary: 0, maxSalary: 10000, amount: 0 },
                        { minSalary: 10001, maxSalary: 15000, amount: 150 },
                        { minSalary: 15001, maxSalary: 999999, amount: 200 },
                    ],
                    lwfEnabled: false,
                    gratuityEnabled: true,
                    gratuityPercent: 4.81,
                    payDay: 1,
                    attendanceCutoff: 25,
                    lopCalculation: 'Calendar',
                    arrearProcessing: true,
                },
            });
            this.logger.log('Created payroll settings');
        }
    }
}
