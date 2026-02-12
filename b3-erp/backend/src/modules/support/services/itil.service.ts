import { Injectable, NotFoundException, Logger } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class ITILService {
    private readonly logger = new Logger(ITILService.name);

    constructor(private readonly prisma: PrismaService) {}

    // ============================================================================
    // Incidents
    // ============================================================================

    async createIncident(data: {
        title: string;
        description: string;
        impact?: string;
        urgency?: string;
        category?: string;
        subcategory?: string;
        affectedService?: string;
        affectedCI?: string;
        reportedBy?: string;
        relatedTicketId?: string;
        isMajorIncident?: boolean;
        companyId: string;
    }) {
        // Generate incident number
        const count = await this.prisma.iTILIncident.count({
            where: { companyId: data.companyId },
        });
        const incidentNumber = `INC${String(count + 1).padStart(6, '0')}`;

        // Calculate priority based on impact and urgency
        const priority = this.calculatePriority(data.impact || 'medium', data.urgency || 'medium');

        return this.prisma.iTILIncident.create({
            data: {
                incidentNumber,
                title: data.title,
                description: data.description,
                impact: data.impact || 'medium',
                urgency: data.urgency || 'medium',
                priority,
                category: data.category,
                subcategory: data.subcategory,
                affectedService: data.affectedService,
                affectedCI: data.affectedCI,
                reportedBy: data.reportedBy,
                relatedTicketId: data.relatedTicketId,
                isMajorIncident: data.isMajorIncident || false,
                status: 'new',
                companyId: data.companyId,
            },
        });
    }

    private calculatePriority(impact: string, urgency: string): string {
        const matrix: Record<string, Record<string, string>> = {
            high: { high: 'P1', medium: 'P2', low: 'P3' },
            medium: { high: 'P2', medium: 'P3', low: 'P4' },
            low: { high: 'P3', medium: 'P4', low: 'P5' },
        };
        return matrix[impact]?.[urgency] || 'P3';
    }

    async getIncidents(companyId: string, options?: {
        status?: string;
        priority?: string;
        assignedTo?: string;
        assignedGroup?: string;
        isMajorIncident?: boolean;
        fromDate?: Date;
        toDate?: Date;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.ITILIncidentWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;
        if (options?.priority) where.priority = options.priority;
        if (options?.assignedTo) where.assignedTo = options.assignedTo;
        if (options?.assignedGroup) where.assignedGroup = options.assignedGroup;
        if (options?.isMajorIncident !== undefined) where.isMajorIncident = options.isMajorIncident;
        if (options?.fromDate || options?.toDate) {
            where.reportedAt = {};
            if (options.fromDate) where.reportedAt.gte = options.fromDate;
            if (options.toDate) where.reportedAt.lte = options.toDate;
        }

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.iTILIncident.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ priority: 'asc' }, { reportedAt: 'desc' }],
            }),
            this.prisma.iTILIncident.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getIncidentById(id: string) {
        const incident = await this.prisma.iTILIncident.findUnique({
            where: { id },
        });
        if (!incident) {
            throw new NotFoundException(`Incident ${id} not found`);
        }
        return incident;
    }

    async updateIncident(id: string, data: Partial<{
        title: string;
        description: string;
        impact: string;
        urgency: string;
        category: string;
        subcategory: string;
        affectedService: string;
        affectedCI: string;
        status: string;
        assignedGroup: string;
        assignedTo: string;
        resolutionCode: string;
        resolutionNotes: string;
        rootCause: string;
        relatedProblemId: string;
        relatedChangeId: string;
        isMajorIncident: boolean;
        majorIncidentManager: string;
    }>) {
        // Recalculate priority if impact or urgency changed
        if (data.impact || data.urgency) {
            const current = await this.prisma.iTILIncident.findUnique({
                where: { id },
                select: { impact: true, urgency: true },
            });
            if (current) {
                data = {
                    ...data,
                    priority: this.calculatePriority(
                        data.impact || current.impact,
                        data.urgency || current.urgency,
                    ),
                } as typeof data;
            }
        }

        // Set timestamps based on status
        const timestamps: Record<string, unknown> = {};
        if (data.status === 'assigned' && !data.assignedTo) {
            timestamps.acknowledgedAt = new Date();
        }
        if (data.status === 'resolved') {
            timestamps.resolvedAt = new Date();
        }
        if (data.status === 'closed') {
            timestamps.closedAt = new Date();
        }

        return this.prisma.iTILIncident.update({
            where: { id },
            data: { ...data, ...timestamps },
        });
    }

    async assignIncident(id: string, assignedGroup: string, assignedTo?: string) {
        return this.prisma.iTILIncident.update({
            where: { id },
            data: {
                assignedGroup,
                assignedTo,
                status: 'assigned',
                acknowledgedAt: new Date(),
            },
        });
    }

    async resolveIncident(id: string, resolutionCode: string, resolutionNotes: string, rootCause?: string) {
        return this.prisma.iTILIncident.update({
            where: { id },
            data: {
                status: 'resolved',
                resolutionCode,
                resolutionNotes,
                rootCause,
                resolvedAt: new Date(),
            },
        });
    }

    async closeIncident(id: string) {
        return this.prisma.iTILIncident.update({
            where: { id },
            data: {
                status: 'closed',
                closedAt: new Date(),
            },
        });
    }

    // ============================================================================
    // Problems
    // ============================================================================

    async createProblem(data: {
        title: string;
        description: string;
        impact?: string;
        urgency?: string;
        category?: string;
        affectedService?: string;
        affectedCIs?: string[];
        loggedBy?: string;
        relatedIncidents?: string[];
        companyId: string;
    }) {
        const count = await this.prisma.iTILProblem.count({
            where: { companyId: data.companyId },
        });
        const problemNumber = `PRB${String(count + 1).padStart(6, '0')}`;

        const priority = this.calculatePriority(data.impact || 'medium', data.urgency || 'medium');

        return this.prisma.iTILProblem.create({
            data: {
                problemNumber,
                title: data.title,
                description: data.description,
                impact: data.impact || 'medium',
                urgency: data.urgency || 'medium',
                priority,
                category: data.category,
                affectedService: data.affectedService,
                affectedCIs: data.affectedCIs || [],
                loggedBy: data.loggedBy,
                relatedIncidents: data.relatedIncidents || [],
                incidentCount: data.relatedIncidents?.length || 0,
                status: 'logged',
                companyId: data.companyId,
            },
        });
    }

    async getProblems(companyId: string, options?: {
        status?: string;
        priority?: string;
        assignedTo?: string;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.ITILProblemWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;
        if (options?.priority) where.priority = options.priority;
        if (options?.assignedTo) where.assignedTo = options.assignedTo;

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.iTILProblem.findMany({
                where,
                skip: (page - 1) * limit,
                take: limit,
                orderBy: [{ priority: 'asc' }, { loggedAt: 'desc' }],
            }),
            this.prisma.iTILProblem.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getProblemById(id: string) {
        const problem = await this.prisma.iTILProblem.findUnique({
            where: { id },
        });
        if (!problem) {
            throw new NotFoundException(`Problem ${id} not found`);
        }
        return problem;
    }

    async updateProblem(id: string, data: Partial<{
        title: string;
        description: string;
        impact: string;
        urgency: string;
        category: string;
        affectedService: string;
        affectedCIs: string[];
        status: string;
        assignedGroup: string;
        assignedTo: string;
        rootCause: string;
        workaround: string;
        knownErrorId: string;
        relatedIncidents: string[];
    }>) {
        if (data.relatedIncidents) {
            data = { ...data, incidentCount: data.relatedIncidents.length } as typeof data;
        }

        const timestamps: Record<string, unknown> = {};
        if (data.status === 'investigating') {
            timestamps.investigationStarted = new Date();
        }
        if (data.status === 'resolved') {
            timestamps.resolvedAt = new Date();
        }
        if (data.status === 'closed') {
            timestamps.closedAt = new Date();
        }

        return this.prisma.iTILProblem.update({
            where: { id },
            data: { ...data, ...timestamps },
        });
    }

    async linkIncidentToProblem(problemId: string, incidentId: string) {
        const problem = await this.prisma.iTILProblem.findUnique({
            where: { id: problemId },
            select: { relatedIncidents: true },
        });

        if (!problem) {
            throw new NotFoundException(`Problem ${problemId} not found`);
        }

        const incidents = [...problem.relatedIncidents, incidentId];

        await Promise.all([
            this.prisma.iTILProblem.update({
                where: { id: problemId },
                data: {
                    relatedIncidents: incidents,
                    incidentCount: incidents.length,
                },
            }),
            this.prisma.iTILIncident.update({
                where: { id: incidentId },
                data: { relatedProblemId: problemId },
            }),
        ]);
    }

    // ============================================================================
    // Changes
    // ============================================================================

    async createChange(data: {
        title: string;
        description: string;
        justification?: string;
        changeType?: string;
        category?: string;
        riskLevel?: string;
        impact?: string;
        plannedStartDate?: Date;
        plannedEndDate?: Date;
        requestedBy?: string;
        implementationPlan?: string;
        backoutPlan?: string;
        testPlan?: string;
        relatedProblemId?: string;
        relatedIncidents?: string[];
        affectedCIs?: string[];
        companyId: string;
    }) {
        const count = await this.prisma.iTILChange.count({
            where: { companyId: data.companyId },
        });
        const changeNumber = `CHG${String(count + 1).padStart(6, '0')}`;

        return this.prisma.iTILChange.create({
            data: {
                changeNumber,
                title: data.title,
                description: data.description,
                justification: data.justification,
                changeType: data.changeType || 'normal',
                category: data.category,
                riskLevel: data.riskLevel || 'medium',
                impact: data.impact || 'medium',
                plannedStartDate: data.plannedStartDate,
                plannedEndDate: data.plannedEndDate,
                requestedBy: data.requestedBy,
                implementationPlan: data.implementationPlan,
                backoutPlan: data.backoutPlan,
                testPlan: data.testPlan,
                relatedProblemId: data.relatedProblemId,
                relatedIncidents: data.relatedIncidents || [],
                affectedCIs: data.affectedCIs || [],
                status: 'draft',
                companyId: data.companyId,
            },
        });
    }

    async getChanges(companyId: string, options?: {
        status?: string;
        changeType?: string;
        riskLevel?: string;
        assignedTo?: string;
        fromDate?: Date;
        toDate?: Date;
        page?: number;
        limit?: number;
    }) {
        const where: Prisma.ITILChangeWhereInput = {
            companyId,
            isActive: true,
        };

        if (options?.status) where.status = options.status;
        if (options?.changeType) where.changeType = options.changeType;
        if (options?.riskLevel) where.riskLevel = options.riskLevel;
        if (options?.assignedTo) where.assignedTo = options.assignedTo;
        if (options?.fromDate || options?.toDate) {
            where.plannedStartDate = {};
            if (options.fromDate) where.plannedStartDate.gte = options.fromDate;
            if (options.toDate) where.plannedStartDate.lte = options.toDate;
        }

        const page = options?.page || 1;
        const limit = options?.limit || 20;

        const [data, total] = await Promise.all([
            this.prisma.iTILChange.findMany({
                where,
                include: { approvals: true },
                skip: (page - 1) * limit,
                take: limit,
                orderBy: { plannedStartDate: 'asc' },
            }),
            this.prisma.iTILChange.count({ where }),
        ]);

        return { data, total, page, limit };
    }

    async getChangeById(id: string) {
        const change = await this.prisma.iTILChange.findUnique({
            where: { id },
            include: { approvals: true },
        });
        if (!change) {
            throw new NotFoundException(`Change ${id} not found`);
        }
        return change;
    }

    async updateChange(id: string, data: Partial<{
        title: string;
        description: string;
        justification: string;
        changeType: string;
        category: string;
        riskLevel: string;
        impact: string;
        status: string;
        plannedStartDate: Date;
        plannedEndDate: Date;
        actualStartDate: Date;
        actualEndDate: Date;
        assignedGroup: string;
        assignedTo: string;
        changeManager: string;
        implementationPlan: string;
        backoutPlan: string;
        testPlan: string;
        reviewNotes: string;
        reviewedBy: string;
    }>) {
        const timestamps: Record<string, unknown> = {};
        if (data.reviewedBy) {
            timestamps.reviewedAt = new Date();
        }

        return this.prisma.iTILChange.update({
            where: { id },
            data: { ...data, ...timestamps },
        });
    }

    async submitChange(id: string) {
        return this.prisma.iTILChange.update({
            where: { id },
            data: { status: 'submitted' },
        });
    }

    async requestApproval(changeId: string, approvers: Array<{
        approverId: string;
        approverName?: string;
        approverRole?: string;
    }>, companyId: string) {
        const approvalData = approvers.map(a => ({
            changeId,
            approverId: a.approverId,
            approverName: a.approverName,
            approverRole: a.approverRole,
            decision: 'pending',
            companyId,
        }));

        await Promise.all([
            this.prisma.iTILChangeApproval.createMany({ data: approvalData }),
            this.prisma.iTILChange.update({
                where: { id: changeId },
                data: { status: 'approval' },
            }),
        ]);
    }

    async recordApprovalDecision(approvalId: string, decision: 'approved' | 'rejected' | 'abstained', comments?: string) {
        const approval = await this.prisma.iTILChangeApproval.update({
            where: { id: approvalId },
            data: {
                decision,
                comments,
                decidedAt: new Date(),
            },
        });

        // Check if all approvals are complete
        const allApprovals = await this.prisma.iTILChangeApproval.findMany({
            where: { changeId: approval.changeId },
        });

        const pending = allApprovals.filter(a => a.decision === 'pending');
        const rejected = allApprovals.filter(a => a.decision === 'rejected');

        if (pending.length === 0) {
            const newStatus = rejected.length > 0 ? 'cancelled' : 'scheduled';
            await this.prisma.iTILChange.update({
                where: { id: approval.changeId },
                data: { status: newStatus },
            });
        }

        return approval;
    }

    // ============================================================================
    // ITIL Analytics
    // ============================================================================

    async getITILDashboard(companyId: string) {
        const [incidents, problems, changes] = await Promise.all([
            this.prisma.iTILIncident.groupBy({
                by: ['status'],
                where: { companyId, isActive: true },
                _count: true,
            }),
            this.prisma.iTILProblem.groupBy({
                by: ['status'],
                where: { companyId, isActive: true },
                _count: true,
            }),
            this.prisma.iTILChange.groupBy({
                by: ['status'],
                where: { companyId, isActive: true },
                _count: true,
            }),
        ]);

        const openIncidents = incidents
            .filter(i => !['resolved', 'closed'].includes(i.status))
            .reduce((sum, i) => sum + i._count, 0);

        const majorIncidents = await this.prisma.iTILIncident.count({
            where: { companyId, isActive: true, isMajorIncident: true, status: { notIn: ['resolved', 'closed'] } },
        });

        const openProblems = problems
            .filter(p => !['resolved', 'closed'].includes(p.status))
            .reduce((sum, p) => sum + p._count, 0);

        const pendingChanges = changes
            .filter(c => ['submitted', 'assessment', 'approval'].includes(c.status))
            .reduce((sum, c) => sum + c._count, 0);

        return {
            incidents: {
                open: openIncidents,
                major: majorIncidents,
                byStatus: incidents.reduce((acc, i) => ({ ...acc, [i.status]: i._count }), {}),
            },
            problems: {
                open: openProblems,
                byStatus: problems.reduce((acc, p) => ({ ...acc, [p.status]: p._count }), {}),
            },
            changes: {
                pending: pendingChanges,
                byStatus: changes.reduce((acc, c) => ({ ...acc, [c.status]: c._count }), {}),
            },
        };
    }
}
