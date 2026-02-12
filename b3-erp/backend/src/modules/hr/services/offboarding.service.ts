import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class OffboardingService {
    private readonly logger = new Logger(OffboardingService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Resignation Requests
    // ============================================================================

    async submitResignation(data: {
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        departmentId?: string;
        designationId?: string;
        reportingManagerId?: string;
        resignationDate: Date;
        requestedLastDay: Date;
        noticePeriodDays?: number;
        resignationReason: string;
        reasonDetails?: string;
        resignationLetterUrl?: string;
        companyId: string;
    }) {
        const count = await this.prisma.resignationRequest.count({
            where: { companyId: data.companyId },
        });
        const resignationNumber = `RES-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.resignationRequest.create({
            data: {
                resignationNumber,
                ...data,
                noticePeriodDays: data.noticePeriodDays || 30,
            },
        });
    }

    async getResignations(companyId: string, options?: {
        status?: string;
        departmentId?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.ResignationRequestWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;
        if (options?.departmentId) where.departmentId = options.departmentId;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.resignationRequest.findMany({
                where,
                include: {
                    clearance: true,
                    exitInterview: true,
                    settlement: true,
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.resignationRequest.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getResignationById(id: string) {
        const resignation = await this.prisma.resignationRequest.findUnique({
            where: { id },
            include: {
                clearance: {
                    include: {
                        clearanceItems: { where: { isActive: true }, orderBy: { sortOrder: 'asc' } },
                        assetReturns: { where: { isActive: true } },
                    },
                },
                exitInterview: true,
                settlement: true,
                exitDocuments: { where: { isActive: true } },
            },
        });
        if (!resignation) {
            throw new NotFoundException(`Resignation request ${id} not found`);
        }
        return resignation;
    }

    async updateResignationStatus(id: string, status: string, data?: {
        approvedBy?: string;
        comments?: string;
        approvedLastDay?: Date;
    }) {
        const updateData: Prisma.ResignationRequestUpdateInput = { status };

        if (status === 'manager_review' || status === 'accepted') {
            updateData.managerApprovalDate = new Date();
            if (data?.approvedBy) updateData.managerApprovedBy = data.approvedBy;
            if (data?.comments) updateData.managerComments = data.comments;
        }

        if (status === 'hr_review' || status === 'accepted') {
            updateData.hrApprovalDate = new Date();
            if (data?.approvedBy) updateData.hrApprovedBy = data.approvedBy;
            if (data?.comments) updateData.hrComments = data.comments;
        }

        if (data?.approvedLastDay) {
            updateData.approvedLastDay = data.approvedLastDay;
        }

        return this.prisma.resignationRequest.update({
            where: { id },
            data: updateData,
        });
    }

    async requestEarlyRelease(id: string, data: {
        earlyReleaseDate: Date;
        earlyReleaseReason: string;
    }) {
        return this.prisma.resignationRequest.update({
            where: { id },
            data: {
                earlyReleaseRequested: true,
                earlyReleaseDate: data.earlyReleaseDate,
                earlyReleaseReason: data.earlyReleaseReason,
                status: 'early_release_requested',
            },
        });
    }

    async approveEarlyRelease(id: string, approvedBy: string, approved: boolean) {
        return this.prisma.resignationRequest.update({
            where: { id },
            data: {
                earlyReleaseApproved: approved,
                earlyReleaseApprovedBy: approvedBy,
                status: approved ? 'early_release_approved' : 'accepted',
                approvedLastDay: approved
                    ? (await this.prisma.resignationRequest.findUnique({ where: { id } }))?.earlyReleaseDate
                    : undefined,
            },
        });
    }

    async withdrawResignation(id: string) {
        return this.prisma.resignationRequest.update({
            where: { id },
            data: { status: 'withdrawn' },
        });
    }

    // ============================================================================
    // Exit Clearance
    // ============================================================================

    async initiateClearance(resignationId: string, companyId: string) {
        const resignation = await this.prisma.resignationRequest.findUnique({
            where: { id: resignationId },
        });
        if (!resignation) throw new NotFoundException(`Resignation ${resignationId} not found`);

        const count = await this.prisma.exitClearance.count({ where: { companyId } });
        const clearanceNumber = `CLR-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.exitClearance.create({
            data: {
                clearanceNumber,
                resignationId,
                employeeId: resignation.employeeId,
                employeeName: resignation.employeeName,
                lastWorkingDay: resignation.approvedLastDay || resignation.requestedLastDay,
                status: 'pending',
                companyId,
            },
        });
    }

    async getClearances(companyId: string, options?: {
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.ExitClearanceWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.exitClearance.findMany({
                where,
                include: {
                    clearanceItems: { where: { isActive: true } },
                    assetReturns: { where: { isActive: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.exitClearance.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async updateDepartmentClearance(id: string, department: string, data: {
        cleared: boolean;
        clearedBy: string;
        remarks?: string;
    }) {
        const fieldMap: Record<string, { cleared: string; clearedAt: string; clearedBy: string; remarks: string }> = {
            it: { cleared: 'itClearance', clearedAt: 'itClearedAt', clearedBy: 'itClearedBy', remarks: 'itRemarks' },
            hr: { cleared: 'hrClearance', clearedAt: 'hrClearedAt', clearedBy: 'hrClearedBy', remarks: 'hrRemarks' },
            finance: { cleared: 'financeClearance', clearedAt: 'financeClearedAt', clearedBy: 'financeClearedBy', remarks: 'financeRemarks' },
            admin: { cleared: 'adminClearance', clearedAt: 'adminClearedAt', clearedBy: 'adminClearedBy', remarks: 'adminRemarks' },
            manager: { cleared: 'managerClearance', clearedAt: 'managerClearedAt', clearedBy: 'managerClearedBy', remarks: 'managerRemarks' },
        };

        const fields = fieldMap[department.toLowerCase()];
        if (!fields) throw new Error(`Invalid department: ${department}`);

        const updateData: Record<string, unknown> = {
            [fields.cleared]: data.cleared,
            [fields.clearedAt]: data.cleared ? new Date() : null,
            [fields.clearedBy]: data.clearedBy,
        };
        if (data.remarks) updateData[fields.remarks] = data.remarks;

        const updated = await this.prisma.exitClearance.update({
            where: { id },
            data: updateData,
        });

        // Check if all clearances are complete
        if (updated.itClearance && updated.hrClearance && updated.financeClearance &&
            updated.adminClearance && updated.managerClearance) {
            await this.prisma.exitClearance.update({
                where: { id },
                data: { status: 'completed', allClearedAt: new Date() },
            });
        } else {
            await this.prisma.exitClearance.update({
                where: { id },
                data: { status: 'in_progress' },
            });
        }

        return updated;
    }

    // ============================================================================
    // Clearance Items
    // ============================================================================

    async addClearanceItem(data: {
        clearanceId: string;
        department: string;
        itemName: string;
        description?: string;
        isMandatory?: boolean;
        assignedTo?: string;
        assignedToName?: string;
        sortOrder?: number;
        companyId: string;
    }) {
        return this.prisma.clearanceItem.create({ data });
    }

    async updateClearanceItem(id: string, data: {
        status: string;
        completedBy?: string;
        remarks?: string;
    }) {
        return this.prisma.clearanceItem.update({
            where: { id },
            data: {
                status: data.status,
                completedAt: data.status === 'completed' ? new Date() : undefined,
                completedBy: data.completedBy,
                remarks: data.remarks,
            },
        });
    }

    // ============================================================================
    // Asset Returns
    // ============================================================================

    async addAssetReturn(data: {
        clearanceId: string;
        assetType: string;
        assetName: string;
        assetTag?: string;
        serialNumber?: string;
        assignedDate?: Date;
        companyId: string;
    }) {
        return this.prisma.assetReturn.create({ data });
    }

    async updateAssetReturn(id: string, data: {
        status: string;
        condition?: string;
        receivedBy?: string;
        damageDetails?: string;
        recoveryAmount?: number;
        remarks?: string;
    }) {
        return this.prisma.assetReturn.update({
            where: { id },
            data: {
                ...data,
                returnedAt: data.status === 'returned' ? new Date() : undefined,
                recoveryAmount: data.recoveryAmount ? new Prisma.Decimal(data.recoveryAmount) : undefined,
            },
        });
    }

    // ============================================================================
    // Exit Interview
    // ============================================================================

    async scheduleExitInterview(data: {
        resignationId: string;
        scheduledDate: Date;
        interviewerId?: string;
        interviewerName?: string;
        companyId: string;
    }) {
        const resignation = await this.prisma.resignationRequest.findUnique({
            where: { id: data.resignationId },
        });
        if (!resignation) throw new NotFoundException(`Resignation ${data.resignationId} not found`);

        const count = await this.prisma.exitInterview.count({ where: { companyId: data.companyId } });
        const interviewNumber = `EXI-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.exitInterview.create({
            data: {
                interviewNumber,
                resignationId: data.resignationId,
                employeeId: resignation.employeeId,
                employeeName: resignation.employeeName,
                scheduledDate: data.scheduledDate,
                interviewerId: data.interviewerId,
                interviewerName: data.interviewerName,
                companyId: data.companyId,
            },
        });
    }

    async getExitInterviews(companyId: string, options?: {
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.ExitInterviewWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.exitInterview.findMany({
                where,
                include: { resignation: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { scheduledDate: 'desc' },
            }),
            this.prisma.exitInterview.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async submitExitInterview(id: string, data: {
        reasonForLeaving?: string;
        jobSatisfaction?: number;
        managementRating?: number;
        workEnvironment?: number;
        careerGrowth?: number;
        compensation?: number;
        workLifeBalance?: number;
        likedMost?: string;
        likedLeast?: string;
        suggestions?: string;
        wouldRecommend?: boolean;
        wouldRejoin?: boolean;
        newEmployer?: string;
        newRole?: string;
        salaryIncrease?: string;
        overallExperience?: number;
        detailedFeedback?: string;
        confidentialNotes?: string;
    }) {
        return this.prisma.exitInterview.update({
            where: { id },
            data: {
                ...data,
                status: 'completed',
                actualDate: new Date(),
            },
        });
    }

    // ============================================================================
    // Full & Final Settlement
    // ============================================================================

    async initiateSettlement(resignationId: string, companyId: string) {
        const resignation = await this.prisma.resignationRequest.findUnique({
            where: { id: resignationId },
        });
        if (!resignation) throw new NotFoundException(`Resignation ${resignationId} not found`);

        const count = await this.prisma.fullFinalSettlement.count({ where: { companyId } });
        const settlementNumber = `FNF-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.fullFinalSettlement.create({
            data: {
                settlementNumber,
                resignationId,
                employeeId: resignation.employeeId,
                employeeName: resignation.employeeName,
                employeeCode: resignation.employeeCode,
                lastWorkingDay: resignation.approvedLastDay || resignation.requestedLastDay,
                status: 'pending',
                companyId,
            },
        });
    }

    async getSettlements(companyId: string, options?: {
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.FullFinalSettlementWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.fullFinalSettlement.findMany({
                where,
                include: { resignation: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.fullFinalSettlement.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async calculateSettlement(id: string, data: {
        salaryDue: number;
        leaveEncashment: number;
        leaveBalance: number;
        leaveEncashDays: number;
        bonus: number;
        gratuity: number;
        gratuityYears: number;
        otherEarnings: number;
        otherEarningsDetails?: Prisma.InputJsonValue;
        noticePeriodRecovery: number;
        shortfallDays: number;
        loanRecovery: number;
        advanceRecovery: number;
        assetRecovery: number;
        taxDeduction: number;
        otherDeductions: number;
        otherDeductionsDetails?: Prisma.InputJsonValue;
        calculatedBy: string;
    }) {
        const totalEarnings = data.salaryDue + data.leaveEncashment + data.bonus +
            data.gratuity + data.otherEarnings;
        const totalDeductions = data.noticePeriodRecovery + data.loanRecovery +
            data.advanceRecovery + data.assetRecovery + data.taxDeduction + data.otherDeductions;
        const netPayable = totalEarnings - totalDeductions;

        return this.prisma.fullFinalSettlement.update({
            where: { id },
            data: {
                salaryDue: new Prisma.Decimal(data.salaryDue),
                leaveEncashment: new Prisma.Decimal(data.leaveEncashment),
                leaveBalance: data.leaveBalance,
                leaveEncashDays: data.leaveEncashDays,
                bonus: new Prisma.Decimal(data.bonus),
                gratuity: new Prisma.Decimal(data.gratuity),
                gratuityYears: new Prisma.Decimal(data.gratuityYears),
                otherEarnings: new Prisma.Decimal(data.otherEarnings),
                otherEarningsDetails: data.otherEarningsDetails,
                totalEarnings: new Prisma.Decimal(totalEarnings),
                noticePeriodRecovery: new Prisma.Decimal(data.noticePeriodRecovery),
                shortfallDays: data.shortfallDays,
                loanRecovery: new Prisma.Decimal(data.loanRecovery),
                advanceRecovery: new Prisma.Decimal(data.advanceRecovery),
                assetRecovery: new Prisma.Decimal(data.assetRecovery),
                taxDeduction: new Prisma.Decimal(data.taxDeduction),
                otherDeductions: new Prisma.Decimal(data.otherDeductions),
                otherDeductionsDetails: data.otherDeductionsDetails,
                totalDeductions: new Prisma.Decimal(totalDeductions),
                netPayable: new Prisma.Decimal(netPayable),
                status: 'calculating',
                calculatedAt: new Date(),
                calculatedBy: data.calculatedBy,
            },
        });
    }

    async approveSettlement(id: string, approvedBy: string) {
        return this.prisma.fullFinalSettlement.update({
            where: { id },
            data: {
                status: 'approved',
                approvedAt: new Date(),
                approvedBy,
            },
        });
    }

    async processPayment(id: string, data: {
        paymentMode: string;
        paymentReference: string;
        bankAccountNumber?: string;
        ifscCode?: string;
    }) {
        return this.prisma.fullFinalSettlement.update({
            where: { id },
            data: {
                status: 'paid',
                paymentDate: new Date(),
                paymentMode: data.paymentMode,
                paymentReference: data.paymentReference,
                bankAccountNumber: data.bankAccountNumber,
                ifscCode: data.ifscCode,
            },
        });
    }

    // ============================================================================
    // Exit Documents
    // ============================================================================

    async generateExitDocument(data: {
        resignationId: string;
        documentType: string;
        documentName: string;
        generatedBy: string;
        documentUrl?: string;
        companyId: string;
    }) {
        const resignation = await this.prisma.resignationRequest.findUnique({
            where: { id: data.resignationId },
        });
        if (!resignation) throw new NotFoundException(`Resignation ${data.resignationId} not found`);

        const count = await this.prisma.exitDocument.count({ where: { companyId: data.companyId } });
        const documentNumber = `DOC-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.exitDocument.create({
            data: {
                documentNumber,
                resignationId: data.resignationId,
                employeeId: resignation.employeeId,
                employeeName: resignation.employeeName,
                documentType: data.documentType,
                documentName: data.documentName,
                status: data.documentUrl ? 'generated' : 'pending',
                generatedAt: data.documentUrl ? new Date() : undefined,
                generatedBy: data.generatedBy,
                documentUrl: data.documentUrl,
                companyId: data.companyId,
            },
        });
    }

    async getExitDocuments(resignationId: string) {
        return this.prisma.exitDocument.findMany({
            where: { resignationId, isActive: true },
            orderBy: { createdAt: 'asc' },
        });
    }

    async updateExitDocument(id: string, data: {
        status?: string;
        documentUrl?: string;
        deliveryMode?: string;
        deliveryAddress?: string;
        trackingNumber?: string;
    }) {
        const updateData: Prisma.ExitDocumentUpdateInput = { ...data };

        if (data.status === 'generated') updateData.generatedAt = new Date();
        if (data.status === 'dispatched') updateData.deliveredAt = new Date();
        if (data.status === 'delivered') updateData.acknowledgedAt = new Date();

        return this.prisma.exitDocument.update({
            where: { id },
            data: updateData,
        });
    }

    // ============================================================================
    // Alumni Management
    // ============================================================================

    async createAlumniRecord(data: {
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        personalEmail?: string;
        personalPhone?: string;
        linkedinUrl?: string;
        joiningDate: Date;
        exitDate: Date;
        lastDesignation?: string;
        lastDepartment?: string;
        exitReason?: string;
        rehireEligible?: boolean;
        rehireRestriction?: string;
        companyId: string;
    }) {
        const count = await this.prisma.alumniRecord.count({
            where: { companyId: data.companyId },
        });
        const alumniNumber = `ALM-${String(count + 1).padStart(5, '0')}`;

        // Calculate tenure
        const tenure = (data.exitDate.getTime() - data.joiningDate.getTime()) / (365.25 * 24 * 60 * 60 * 1000);

        return this.prisma.alumniRecord.create({
            data: {
                alumniNumber,
                ...data,
                totalTenure: new Prisma.Decimal(tenure.toFixed(2)),
                rehireEligible: data.rehireEligible ?? true,
            },
        });
    }

    async getAlumniDirectory(companyId: string, options?: {
        search?: string;
        isNetworkMember?: boolean;
        rehireEligible?: boolean;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.AlumniRecordWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.search) {
            where.OR = [
                { employeeName: { contains: options.search, mode: 'insensitive' } },
                { employeeCode: { contains: options.search, mode: 'insensitive' } },
                { currentCompany: { contains: options.search, mode: 'insensitive' } },
            ];
        }
        if (options?.isNetworkMember !== undefined) where.isNetworkMember = options.isNetworkMember;
        if (options?.rehireEligible !== undefined) where.rehireEligible = options.rehireEligible;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.alumniRecord.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { exitDate: 'desc' },
            }),
            this.prisma.alumniRecord.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async updateAlumniRecord(id: string, data: Partial<{
        personalEmail: string;
        personalPhone: string;
        linkedinUrl: string;
        currentCompany: string;
        currentDesignation: string;
        currentLocation: string;
        isNetworkMember: boolean;
        networkStatus: string;
        rehireEligible: boolean;
        rehireRestriction: string;
        notes: string;
    }>) {
        const updateData = { ...data } as Prisma.AlumniRecordUpdateInput;

        if (data.isNetworkMember === true) {
            updateData.joinedNetworkAt = new Date();
        }

        return this.prisma.alumniRecord.update({
            where: { id },
            data: updateData,
        });
    }

    async recordAlumniEngagement(id: string, type: 'contact' | 'event' | 'referral') {
        const updateData: Prisma.AlumniRecordUpdateInput = {
            lastContactDate: new Date(),
        };

        if (type === 'event') {
            updateData.eventsAttended = { increment: 1 };
        } else if (type === 'referral') {
            updateData.referralsMade = { increment: 1 };
        }

        return this.prisma.alumniRecord.update({
            where: { id },
            data: updateData,
        });
    }

    // ============================================================================
    // Dashboard & Analytics
    // ============================================================================

    async getOffboardingDashboard(companyId: string) {
        const today = new Date();
        const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000);

        const [
            pendingResignations,
            pendingClearances,
            pendingSettlements,
            exitInterviewsPending,
            recentExits,
            byReason,
        ] = await Promise.all([
            this.prisma.resignationRequest.count({
                where: { companyId, isActive: true, status: { in: ['submitted', 'manager_review', 'hr_review'] } },
            }),
            this.prisma.exitClearance.count({
                where: { companyId, isActive: true, status: { in: ['pending', 'in_progress'] } },
            }),
            this.prisma.fullFinalSettlement.count({
                where: { companyId, isActive: true, status: { in: ['pending', 'calculating', 'pending_approval', 'approved'] } },
            }),
            this.prisma.exitInterview.count({
                where: { companyId, isActive: true, status: 'scheduled' },
            }),
            this.prisma.resignationRequest.findMany({
                where: {
                    companyId,
                    isActive: true,
                    status: 'accepted',
                    approvedLastDay: { lte: today },
                },
                orderBy: { approvedLastDay: 'desc' },
                take: 10,
            }),
            this.prisma.resignationRequest.groupBy({
                by: ['resignationReason'],
                where: {
                    companyId,
                    isActive: true,
                    createdAt: { gte: thirtyDaysAgo },
                },
                _count: { id: true },
            }),
        ]);

        return {
            pendingResignations,
            pendingClearances,
            pendingSettlements,
            exitInterviewsPending,
            recentExits,
            byReason: byReason.reduce((acc, item) => {
                acc[item.resignationReason] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
        };
    }
}
