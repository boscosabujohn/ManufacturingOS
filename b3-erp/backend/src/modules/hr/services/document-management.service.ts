import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class DocumentManagementService {
    private readonly logger = new Logger(DocumentManagementService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Employee Documents
    // ============================================================================

    async createEmployeeDocument(data: {
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        documentCategory: string;
        documentType: string;
        documentName: string;
        description?: string;
        fileName?: string;
        fileUrl?: string;
        fileSize?: number;
        fileType?: string;
        documentDate?: Date;
        issueDate?: Date;
        expiryDate?: Date;
        issuingAuthority?: string;
        documentNumber2?: string;
        isMandatory?: boolean;
        isVerificationRequired?: boolean;
        isConfidential?: boolean;
        renewalRequired?: boolean;
        renewalReminderDays?: number;
        companyId: string;
    }) {
        const count = await this.prisma.employeeDocument.count({
            where: { companyId: data.companyId },
        });
        const documentNumber = `DOC-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.employeeDocument.create({
            data: {
                documentNumber,
                ...data,
            },
        });
    }

    async getEmployeeDocuments(companyId: string, options?: {
        employeeId?: string;
        documentCategory?: string;
        documentType?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.EmployeeDocumentWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.employeeId) where.employeeId = options.employeeId;
        if (options?.documentCategory) where.documentCategory = options.documentCategory;
        if (options?.documentType) where.documentType = options.documentType;
        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.employeeDocument.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.employeeDocument.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getEmployeeDocumentById(id: string) {
        const document = await this.prisma.employeeDocument.findUnique({
            where: { id },
        });
        if (!document) {
            throw new NotFoundException(`Employee document ${id} not found`);
        }
        return document;
    }

    async updateEmployeeDocument(id: string, data: Partial<{
        documentName: string;
        description: string;
        fileName: string;
        fileUrl: string;
        fileSize: number;
        expiryDate: Date;
        status: string;
        verifiedBy: string;
        rejectionReason: string;
    }>) {
        const updateData: Prisma.EmployeeDocumentUpdateInput = { ...data };

        if (data.status === 'verified') {
            updateData.verifiedAt = new Date();
        }

        return this.prisma.employeeDocument.update({
            where: { id },
            data: updateData,
        });
    }

    async verifyDocument(id: string, data: {
        verifiedBy: string;
        remarks?: string;
    }) {
        return this.prisma.employeeDocument.update({
            where: { id },
            data: {
                status: 'verified',
                verifiedBy: data.verifiedBy,
                verifiedAt: new Date(),
                remarks: data.remarks,
            },
        });
    }

    async rejectDocument(id: string, data: {
        rejectedBy: string;
        reason: string;
    }) {
        return this.prisma.employeeDocument.update({
            where: { id },
            data: {
                status: 'rejected',
                verifiedBy: data.rejectedBy,
                verifiedAt: new Date(),
                rejectionReason: data.reason,
            },
        });
    }

    // ============================================================================
    // Compliance Documents
    // ============================================================================

    async createComplianceDocument(data: {
        documentName: string;
        documentCategory: string;
        employeeId?: string;
        employeeName?: string;
        employeeCode?: string;
        formType?: string;
        financialYear?: string;
        effectiveDate?: Date;
        expiryDate?: Date;
        fileName?: string;
        fileUrl?: string;
        companyId: string;
    }) {
        const count = await this.prisma.complianceDocument.count({
            where: { companyId: data.companyId },
        });
        const documentCode = `COMP-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.complianceDocument.create({
            data: {
                documentCode,
                ...data,
            },
        });
    }

    async getComplianceDocuments(companyId: string, options?: {
        documentCategory?: string;
        employeeId?: string;
        formType?: string;
        financialYear?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.ComplianceDocumentWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.documentCategory) where.documentCategory = options.documentCategory;
        if (options?.employeeId) where.employeeId = options.employeeId;
        if (options?.formType) where.formType = options.formType;
        if (options?.financialYear) where.financialYear = options.financialYear;
        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.complianceDocument.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.complianceDocument.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async acknowledgeComplianceDocument(id: string, acknowledgedBy: string) {
        return this.prisma.complianceDocument.update({
            where: { id },
            data: {
                status: 'acknowledged',
                acknowledgedBy,
                acknowledgedAt: new Date(),
            },
        });
    }

    // ============================================================================
    // HR Policies
    // ============================================================================

    async createHRPolicy(data: {
        policyName: string;
        policyCategory: string;
        version?: string;
        summary?: string;
        content?: string;
        fileName?: string;
        fileUrl?: string;
        effectiveFrom: Date;
        effectiveTo?: Date;
        applicableTo?: string;
        applicableEntities?: string[];
        requiresAcknowledgment?: boolean;
        acknowledgmentDeadline?: Date;
        companyId: string;
    }) {
        const count = await this.prisma.hRPolicy.count({
            where: { companyId: data.companyId },
        });
        const policyCode = `POL-${String(count + 1).padStart(5, '0')}`;

        return this.prisma.hRPolicy.create({
            data: {
                policyCode,
                ...data,
            },
        });
    }

    async getHRPolicies(companyId: string, options?: {
        policyCategory?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.HRPolicyWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.policyCategory) where.policyCategory = options.policyCategory;
        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.hRPolicy.findMany({
                where,
                include: {
                    _count: { select: { acknowledgments: true } },
                },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.hRPolicy.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getHRPolicyById(id: string) {
        const policy = await this.prisma.hRPolicy.findUnique({
            where: { id },
            include: {
                acknowledgments: {
                    where: { isActive: true },
                    orderBy: { acknowledgedAt: 'desc' },
                },
            },
        });
        if (!policy) {
            throw new NotFoundException(`HR Policy ${id} not found`);
        }
        return policy;
    }

    async publishPolicy(id: string, publishedBy: string) {
        return this.prisma.hRPolicy.update({
            where: { id },
            data: {
                status: 'published',
                publishedBy,
                publishedAt: new Date(),
            },
        });
    }

    async approvePolicy(id: string, approvedBy: string) {
        return this.prisma.hRPolicy.update({
            where: { id },
            data: {
                status: 'approved',
                approvedBy,
                approvedAt: new Date(),
            },
        });
    }

    async archivePolicy(id: string) {
        return this.prisma.hRPolicy.update({
            where: { id },
            data: { status: 'archived' },
        });
    }

    async acknowledgePolicyByEmployee(policyId: string, data: {
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        companyId: string;
    }) {
        const existing = await this.prisma.policyAcknowledgment.findUnique({
            where: { policyId_employeeId: { policyId, employeeId: data.employeeId } },
        });

        if (existing) {
            return this.prisma.policyAcknowledgment.update({
                where: { id: existing.id },
                data: {
                    status: 'acknowledged',
                    acknowledgedAt: new Date(),
                },
            });
        }

        return this.prisma.policyAcknowledgment.create({
            data: {
                policyId,
                ...data,
                status: 'acknowledged',
                acknowledgedAt: new Date(),
            },
        });
    }

    async getPolicyAcknowledgments(policyId: string) {
        return this.prisma.policyAcknowledgment.findMany({
            where: { policyId, isActive: true },
            orderBy: { acknowledgedAt: 'desc' },
        });
    }

    async getPendingAcknowledgments(companyId: string, employeeId?: string) {
        const where: Prisma.HRPolicyWhereInput = {
            companyId,
            isActive: true,
            status: 'published',
            requiresAcknowledgment: true,
        };

        const policies = await this.prisma.hRPolicy.findMany({
            where,
            include: {
                acknowledgments: employeeId ? {
                    where: { employeeId },
                } : true,
            },
        });

        if (employeeId) {
            return policies.filter(p =>
                p.acknowledgments.length === 0 ||
                p.acknowledgments.every(a => a.status !== 'acknowledged')
            );
        }

        return policies;
    }

    // ============================================================================
    // Document Repository
    // ============================================================================

    async createRepositoryDocument(data: {
        documentName: string;
        documentCategory: string;
        folderId?: string;
        folderPath?: string;
        fileName: string;
        fileUrl: string;
        fileSize?: number;
        fileType?: string;
        description?: string;
        tags?: string[];
        keywords?: string[];
        version?: string;
        previousVersionId?: string;
        accessLevel?: string;
        allowedDepartments?: string[];
        allowedRoles?: string[];
        uploadedBy: string;
        uploadedByName: string;
        companyId: string;
    }) {
        const count = await this.prisma.documentRepository.count({
            where: { companyId: data.companyId },
        });
        const documentCode = `REPO-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.documentRepository.create({
            data: {
                documentCode,
                ...data,
            },
        });
    }

    async getRepositoryDocuments(companyId: string, options?: {
        documentCategory?: string;
        folderId?: string;
        tags?: string[];
        accessLevel?: string;
        status?: string;
        searchQuery?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.DocumentRepositoryWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.documentCategory) where.documentCategory = options.documentCategory;
        if (options?.folderId) where.folderId = options.folderId;
        if (options?.accessLevel) where.accessLevel = options.accessLevel;
        if (options?.status) where.status = options.status;
        if (options?.tags && options.tags.length > 0) {
            where.tags = { hasSome: options.tags };
        }
        if (options?.searchQuery) {
            where.OR = [
                { documentName: { contains: options.searchQuery, mode: 'insensitive' } },
                { description: { contains: options.searchQuery, mode: 'insensitive' } },
                { keywords: { hasSome: [options.searchQuery] } },
            ];
        }

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.documentRepository.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { uploadedAt: 'desc' },
            }),
            this.prisma.documentRepository.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async searchDocuments(companyId: string, query: string, options?: {
        page?: number;
        limit?: number;
    }) {
        return this.getRepositoryDocuments(companyId, {
            searchQuery: query,
            ...options,
        });
    }

    async incrementDownloadCount(id: string) {
        return this.prisma.documentRepository.update({
            where: { id },
            data: {
                downloadCount: { increment: 1 },
                lastAccessedAt: new Date(),
            },
        });
    }

    async archiveDocument(id: string) {
        return this.prisma.documentRepository.update({
            where: { id },
            data: { status: 'archived' },
        });
    }

    // ============================================================================
    // Certificate Requests
    // ============================================================================

    async createCertificateRequest(data: {
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        department?: string;
        designation?: string;
        certificateType: string;
        purpose?: string;
        addressTo?: string;
        customContent?: string;
        requiredByDate?: Date;
        deliveryMethod?: string;
        companyId: string;
    }) {
        const count = await this.prisma.certificateRequest.count({
            where: { companyId: data.companyId },
        });
        const requestNumber = `CERT-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.certificateRequest.create({
            data: {
                requestNumber,
                ...data,
            },
        });
    }

    async getCertificateRequests(companyId: string, options?: {
        employeeId?: string;
        certificateType?: string;
        status?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.CertificateRequestWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.employeeId) where.employeeId = options.employeeId;
        if (options?.certificateType) where.certificateType = options.certificateType;
        if (options?.status) where.status = options.status;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.certificateRequest.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { requestDate: 'desc' },
            }),
            this.prisma.certificateRequest.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getCertificateRequestById(id: string) {
        const request = await this.prisma.certificateRequest.findUnique({
            where: { id },
        });
        if (!request) {
            throw new NotFoundException(`Certificate request ${id} not found`);
        }
        return request;
    }

    async processCertificateRequest(id: string, data: {
        processedBy: string;
        status?: string;
    }) {
        return this.prisma.certificateRequest.update({
            where: { id },
            data: {
                status: data.status || 'under_review',
                processedBy: data.processedBy,
                processedAt: new Date(),
            },
        });
    }

    async approveCertificateRequest(id: string, approvedBy: string) {
        return this.prisma.certificateRequest.update({
            where: { id },
            data: {
                status: 'approved',
                approvedBy,
                approvedAt: new Date(),
            },
        });
    }

    async generateCertificate(id: string, data: {
        documentUrl: string;
        documentNumber?: string;
    }) {
        return this.prisma.certificateRequest.update({
            where: { id },
            data: {
                status: 'generated',
                documentUrl: data.documentUrl,
                documentNumber: data.documentNumber,
            },
        });
    }

    async issueCertificate(id: string) {
        return this.prisma.certificateRequest.update({
            where: { id },
            data: {
                status: 'issued',
                issuedDate: new Date(),
                deliveredAt: new Date(),
            },
        });
    }

    async rejectCertificateRequest(id: string, data: {
        rejectedBy: string;
        reason: string;
    }) {
        return this.prisma.certificateRequest.update({
            where: { id },
            data: {
                status: 'rejected',
                processedBy: data.rejectedBy,
                processedAt: new Date(),
                rejectionReason: data.reason,
            },
        });
    }

    // ============================================================================
    // Document Compliance Tracking
    // ============================================================================

    async createComplianceTracking(data: {
        employeeId: string;
        employeeName: string;
        employeeCode: string;
        department?: string;
        documentCategory: string;
        documentType: string;
        documentName: string;
        complianceStatus: string;
        dueDate?: Date;
        expiryDate?: Date;
        submittedDate?: Date;
        companyId: string;
    }) {
        const count = await this.prisma.documentComplianceTracking.count({
            where: { companyId: data.companyId },
        });
        const trackingCode = `TRK-${String(count + 1).padStart(6, '0')}`;

        return this.prisma.documentComplianceTracking.create({
            data: {
                trackingCode,
                ...data,
            },
        });
    }

    async getComplianceTracking(companyId: string, options?: {
        employeeId?: string;
        complianceStatus?: string;
        documentCategory?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.DocumentComplianceTrackingWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.employeeId) where.employeeId = options.employeeId;
        if (options?.complianceStatus) where.complianceStatus = options.complianceStatus;
        if (options?.documentCategory) where.documentCategory = options.documentCategory;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.documentComplianceTracking.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.documentComplianceTracking.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getMissingDocuments(companyId: string) {
        return this.prisma.documentComplianceTracking.findMany({
            where: {
                companyId,
                isActive: true,
                complianceStatus: 'missing',
            },
            orderBy: { dueDate: 'asc' },
        });
    }

    async getExpiredDocuments(companyId: string) {
        return this.prisma.documentComplianceTracking.findMany({
            where: {
                companyId,
                isActive: true,
                complianceStatus: 'expired',
            },
            orderBy: { expiryDate: 'asc' },
        });
    }

    async getExpiringDocuments(companyId: string, withinDays: number = 30) {
        const futureDate = new Date();
        futureDate.setDate(futureDate.getDate() + withinDays);

        return this.prisma.documentComplianceTracking.findMany({
            where: {
                companyId,
                isActive: true,
                complianceStatus: 'expiring_soon',
                expiryDate: { lte: futureDate },
            },
            orderBy: { expiryDate: 'asc' },
        });
    }

    async sendComplianceReminder(id: string) {
        return this.prisma.documentComplianceTracking.update({
            where: { id },
            data: {
                remindersSent: { increment: 1 },
                lastReminderAt: new Date(),
            },
        });
    }

    async resolveComplianceIssue(id: string, data: {
        resolvedBy: string;
        notes?: string;
    }) {
        return this.prisma.documentComplianceTracking.update({
            where: { id },
            data: {
                complianceStatus: 'compliant',
                resolvedAt: new Date(),
                resolvedBy: data.resolvedBy,
                resolutionNotes: data.notes,
            },
        });
    }

    async escalateComplianceIssue(id: string, escalatedTo: string) {
        return this.prisma.documentComplianceTracking.update({
            where: { id },
            data: {
                escalatedTo,
                escalatedAt: new Date(),
            },
        });
    }

    // ============================================================================
    // Dashboard & Reports
    // ============================================================================

    async getDocumentManagementDashboard(companyId: string) {
        const today = new Date();
        const thirtyDaysFromNow = new Date();
        thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);

        const [
            totalDocuments,
            documentsByCategory,
            documentsByStatus,
            pendingVerifications,
            pendingCertificates,
            missingDocuments,
            expiredDocuments,
            expiringDocuments,
            publishedPolicies,
            pendingAcknowledgments,
        ] = await Promise.all([
            this.prisma.employeeDocument.count({
                where: { companyId, isActive: true },
            }),
            this.prisma.employeeDocument.groupBy({
                by: ['documentCategory'],
                where: { companyId, isActive: true },
                _count: { id: true },
            }),
            this.prisma.employeeDocument.groupBy({
                by: ['status'],
                where: { companyId, isActive: true },
                _count: { id: true },
            }),
            this.prisma.employeeDocument.count({
                where: { companyId, isActive: true, status: 'pending' },
            }),
            this.prisma.certificateRequest.count({
                where: { companyId, isActive: true, status: { in: ['pending', 'under_review', 'approved'] } },
            }),
            this.prisma.documentComplianceTracking.count({
                where: { companyId, isActive: true, complianceStatus: 'missing' },
            }),
            this.prisma.documentComplianceTracking.count({
                where: { companyId, isActive: true, complianceStatus: 'expired' },
            }),
            this.prisma.documentComplianceTracking.count({
                where: {
                    companyId,
                    isActive: true,
                    complianceStatus: 'expiring_soon',
                    expiryDate: { lte: thirtyDaysFromNow },
                },
            }),
            this.prisma.hRPolicy.count({
                where: { companyId, isActive: true, status: 'published' },
            }),
            this.prisma.policyAcknowledgment.count({
                where: { companyId, isActive: true, status: 'pending' },
            }),
        ]);

        return {
            totalDocuments,
            documentsByCategory: documentsByCategory.reduce((acc, item) => {
                acc[item.documentCategory] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
            documentsByStatus: documentsByStatus.reduce((acc, item) => {
                acc[item.status] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
            pendingVerifications,
            pendingCertificates,
            missingDocuments,
            expiredDocuments,
            expiringDocuments,
            publishedPolicies,
            pendingAcknowledgments,
        };
    }

    async getEmployeeDocumentsSummary(companyId: string, employeeId: string) {
        const [
            documents,
            byCategory,
            byStatus,
            pendingVerification,
            expiringDocuments,
        ] = await Promise.all([
            this.prisma.employeeDocument.findMany({
                where: { companyId, employeeId, isActive: true },
                orderBy: { createdAt: 'desc' },
            }),
            this.prisma.employeeDocument.groupBy({
                by: ['documentCategory'],
                where: { companyId, employeeId, isActive: true },
                _count: { id: true },
            }),
            this.prisma.employeeDocument.groupBy({
                by: ['status'],
                where: { companyId, employeeId, isActive: true },
                _count: { id: true },
            }),
            this.prisma.employeeDocument.count({
                where: { companyId, employeeId, isActive: true, status: 'pending' },
            }),
            this.prisma.employeeDocument.count({
                where: {
                    companyId,
                    employeeId,
                    isActive: true,
                    renewalRequired: true,
                    expiryDate: {
                        lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
                    },
                },
            }),
        ]);

        return {
            documents,
            byCategory: byCategory.reduce((acc, item) => {
                acc[item.documentCategory] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
            byStatus: byStatus.reduce((acc, item) => {
                acc[item.status] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
            pendingVerification,
            expiringDocuments,
        };
    }

    async getCertificateRequestStats(companyId: string) {
        const byStatus = await this.prisma.certificateRequest.groupBy({
            by: ['status'],
            where: { companyId, isActive: true },
            _count: { id: true },
        });

        const byType = await this.prisma.certificateRequest.groupBy({
            by: ['certificateType'],
            where: { companyId, isActive: true },
            _count: { id: true },
        });

        return {
            byStatus: byStatus.reduce((acc, item) => {
                acc[item.status] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
            byType: byType.reduce((acc, item) => {
                acc[item.certificateType] = item._count.id;
                return acc;
            }, {} as Record<string, number>),
        };
    }

    async getPolicyComplianceReport(companyId: string) {
        const policies = await this.prisma.hRPolicy.findMany({
            where: {
                companyId,
                isActive: true,
                status: 'published',
                requiresAcknowledgment: true,
            },
            include: {
                _count: {
                    select: { acknowledgments: true },
                },
                acknowledgments: {
                    where: { status: 'acknowledged' },
                },
            },
        });

        return policies.map(policy => ({
            id: policy.id,
            policyCode: policy.policyCode,
            policyName: policy.policyName,
            totalRequired: policy._count.acknowledgments,
            acknowledged: policy.acknowledgments.length,
            pending: policy._count.acknowledgments - policy.acknowledgments.length,
            complianceRate: policy._count.acknowledgments > 0
                ? (policy.acknowledgments.length / policy._count.acknowledgments * 100).toFixed(1)
                : 0,
        }));
    }
}
