import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';

@Injectable()
export class HRComplianceService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // COMPLIANCE TRACKER
  // ============================================

  async getComplianceTrackers(companyId: string, filters?: {
    complianceType?: string;
    category?: string;
    status?: string;
    riskLevel?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.complianceType) where.complianceType = filters.complianceType;
    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    if (filters?.riskLevel) where.riskLevel = filters.riskLevel;

    return this.prisma.complianceTracker.findMany({
      where,
      include: {
        complianceRecords: {
          take: 5,
          orderBy: { periodEnd: 'desc' },
        },
      },
      orderBy: { nextDueDate: 'asc' },
    });
  }

  async getComplianceTrackerById(id: string, companyId: string) {
    return this.prisma.complianceTracker.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        complianceRecords: {
          orderBy: { periodEnd: 'desc' },
        },
        laborRegisters: true,
      },
    });
  }

  async createComplianceTracker(data: any) {
    return this.prisma.complianceTracker.create({ data });
  }

  async updateComplianceTracker(id: string, companyId: string, data: any) {
    return this.prisma.complianceTracker.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // COMPLIANCE RECORDS
  // ============================================

  async getComplianceRecords(companyId: string, filters?: {
    trackerId?: string;
    status?: string;
    fiscalYear?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.trackerId) where.trackerId = filters.trackerId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.complianceRecord.findMany({
      where,
      include: {
        tracker: true,
      },
      orderBy: { dueDate: 'desc' },
    });
  }

  async createComplianceRecord(data: any) {
    return this.prisma.complianceRecord.create({ data });
  }

  async updateComplianceRecord(id: string, companyId: string, data: any) {
    return this.prisma.complianceRecord.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // LABOR REGISTERS
  // ============================================

  async getLaborRegisters(companyId: string, filters?: {
    registerType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.registerType) where.registerType = filters.registerType;
    if (filters?.status) where.status = filters.status;

    return this.prisma.laborRegister.findMany({
      where,
      include: {
        tracker: true,
        entries: {
          take: 10,
          orderBy: { entryDate: 'desc' },
        },
      },
      orderBy: { registerName: 'asc' },
    });
  }

  async getLaborRegisterById(id: string, companyId: string) {
    return this.prisma.laborRegister.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        tracker: true,
        entries: {
          orderBy: { entryDate: 'desc' },
        },
      },
    });
  }

  async createLaborRegister(data: any) {
    return this.prisma.laborRegister.create({ data });
  }

  async createLaborRegisterEntry(data: any) {
    return this.prisma.laborRegisterEntry.create({ data });
  }

  async getLaborRegisterEntries(registerId: string, companyId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    employeeId?: string;
  }) {
    const where: any = { registerId, companyId, isActive: true };
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.startDate || filters?.endDate) {
      where.entryDate = {};
      if (filters?.startDate) where.entryDate.gte = filters.startDate;
      if (filters?.endDate) where.entryDate.lte = filters.endDate;
    }

    return this.prisma.laborRegisterEntry.findMany({
      where,
      include: {
        register: true,
      },
      orderBy: { entryDate: 'desc' },
    });
  }

  // ============================================
  // COMPLIANCE CALENDAR
  // ============================================

  async getComplianceCalendarEvents(companyId: string, filters?: {
    startDate?: Date;
    endDate?: Date;
    eventType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.eventType) where.eventType = filters.eventType;
    if (filters?.status) where.status = filters.status;
    if (filters?.startDate || filters?.endDate) {
      where.eventDate = {};
      if (filters?.startDate) where.eventDate.gte = filters.startDate;
      if (filters?.endDate) where.eventDate.lte = filters.endDate;
    }

    return this.prisma.complianceCalendar.findMany({
      where,
      orderBy: { eventDate: 'asc' },
    });
  }

  async createComplianceCalendarEvent(data: any) {
    return this.prisma.complianceCalendar.create({ data });
  }

  async updateComplianceCalendarEvent(id: string, companyId: string, data: any) {
    return this.prisma.complianceCalendar.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // STATUTORY RETURNS
  // ============================================

  async getStatutoryReturns(companyId: string, filters?: {
    returnType?: string;
    status?: string;
    fiscalYear?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.returnType) where.returnType = filters.returnType;
    if (filters?.status) where.status = filters.status;
    if (filters?.fiscalYear) where.fiscalYear = filters.fiscalYear;

    return this.prisma.statutoryReturn.findMany({
      where,
      orderBy: { filingDueDate: 'desc' },
    });
  }

  async getStatutoryReturnById(id: string, companyId: string) {
    return this.prisma.statutoryReturn.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createStatutoryReturn(data: any) {
    return this.prisma.statutoryReturn.create({ data });
  }

  async updateStatutoryReturn(id: string, companyId: string, data: any) {
    return this.prisma.statutoryReturn.update({
      where: { id },
      data,
    });
  }

  async getStatutoryReturnsByType(companyId: string, returnType: string, fiscalYear?: string) {
    const where: any = { companyId, isActive: true, returnType };
    if (fiscalYear) where.fiscalYear = fiscalYear;

    return this.prisma.statutoryReturn.findMany({
      where,
      orderBy: { periodStart: 'desc' },
    });
  }

  // ============================================
  // LICENSE MASTER
  // ============================================

  async getLicenses(companyId: string, filters?: {
    licenseType?: string;
    status?: string;
    renewalStatus?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.licenseType) where.licenseType = filters.licenseType;
    if (filters?.status) where.status = filters.status;
    if (filters?.renewalStatus) where.renewalStatus = filters.renewalStatus;

    return this.prisma.licenseMaster.findMany({
      where,
      include: {
        renewals: {
          take: 3,
          orderBy: { renewalTo: 'desc' },
        },
        inspections: {
          take: 3,
          orderBy: { actualDate: 'desc' },
        },
      },
      orderBy: { validTo: 'asc' },
    });
  }

  async getLicenseById(id: string, companyId: string) {
    return this.prisma.licenseMaster.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        renewals: {
          orderBy: { renewalTo: 'desc' },
        },
        inspections: {
          orderBy: { actualDate: 'desc' },
        },
      },
    });
  }

  async createLicense(data: any) {
    return this.prisma.licenseMaster.create({ data });
  }

  async updateLicense(id: string, companyId: string, data: any) {
    return this.prisma.licenseMaster.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // LICENSE RENEWALS
  // ============================================

  async getLicenseRenewals(companyId: string, filters?: {
    licenseId?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.licenseId) where.licenseId = filters.licenseId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.licenseRenewal.findMany({
      where,
      include: {
        license: true,
      },
      orderBy: { renewalTo: 'desc' },
    });
  }

  async createLicenseRenewal(data: any) {
    return this.prisma.licenseRenewal.create({ data });
  }

  async updateLicenseRenewal(id: string, companyId: string, data: any) {
    return this.prisma.licenseRenewal.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // LICENSE INSPECTIONS
  // ============================================

  async getLicenseInspections(companyId: string, filters?: {
    licenseId?: string;
    inspectionType?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.licenseId) where.licenseId = filters.licenseId;
    if (filters?.inspectionType) where.inspectionType = filters.inspectionType;

    return this.prisma.licenseInspection.findMany({
      where,
      include: {
        license: true,
      },
      orderBy: { actualDate: 'desc' },
    });
  }

  async createLicenseInspection(data: any) {
    return this.prisma.licenseInspection.create({ data });
  }

  async updateLicenseInspection(id: string, companyId: string, data: any) {
    return this.prisma.licenseInspection.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // COMPLIANCE CERTIFICATES
  // ============================================

  async getComplianceCertificates(companyId: string, filters?: {
    certificateType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.certificateType) where.certificateType = filters.certificateType;
    if (filters?.status) where.status = filters.status;

    return this.prisma.complianceCertificate.findMany({
      where,
      orderBy: { validTo: 'asc' },
    });
  }

  async createComplianceCertificate(data: any) {
    return this.prisma.complianceCertificate.create({ data });
  }

  async updateComplianceCertificate(id: string, companyId: string, data: any) {
    return this.prisma.complianceCertificate.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // POLICY VIOLATIONS
  // ============================================

  async getPolicyViolations(companyId: string, filters?: {
    employeeId?: string;
    policyCategory?: string;
    status?: string;
    severity?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.policyCategory) where.policyCategory = filters.policyCategory;
    if (filters?.status) where.status = filters.status;
    if (filters?.severity) where.severity = filters.severity;

    return this.prisma.policyViolation.findMany({
      where,
      orderBy: { reportedDate: 'desc' },
    });
  }

  async getPolicyViolationById(id: string, companyId: string) {
    return this.prisma.policyViolation.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createPolicyViolation(data: any) {
    return this.prisma.policyViolation.create({ data });
  }

  async updatePolicyViolation(id: string, companyId: string, data: any) {
    return this.prisma.policyViolation.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // DISCIPLINARY ACTIONS
  // ============================================

  async getDisciplinaryActions(companyId: string, filters?: {
    employeeId?: string;
    actionType?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.actionType) where.actionType = filters.actionType;
    if (filters?.status) where.status = filters.status;

    return this.prisma.disciplinaryAction.findMany({
      where,
      orderBy: { initiationDate: 'desc' },
    });
  }

  async getDisciplinaryActionById(id: string, companyId: string) {
    return this.prisma.disciplinaryAction.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createDisciplinaryAction(data: any) {
    return this.prisma.disciplinaryAction.create({ data });
  }

  async updateDisciplinaryAction(id: string, companyId: string, data: any) {
    return this.prisma.disciplinaryAction.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // DIVERSITY METRICS
  // ============================================

  async getDiversityMetrics(companyId: string, filters?: {
    periodType?: string;
    fiscalYear?: string;
    scope?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.periodType) where.periodType = filters.periodType;
    if (filters?.fiscalYear) where.fiscalYear = filters.fiscalYear;
    if (filters?.scope) where.scope = filters.scope;

    return this.prisma.diversityMetrics.findMany({
      where,
      orderBy: { periodEnd: 'desc' },
    });
  }

  async createDiversityMetrics(data: any) {
    return this.prisma.diversityMetrics.create({ data });
  }

  async updateDiversityMetrics(id: string, companyId: string, data: any) {
    return this.prisma.diversityMetrics.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // EEO REPORTS
  // ============================================

  async getEEOReports(companyId: string, filters?: {
    reportType?: string;
    status?: string;
    fiscalYear?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.reportType) where.reportType = filters.reportType;
    if (filters?.status) where.status = filters.status;
    if (filters?.fiscalYear) where.fiscalYear = filters.fiscalYear;

    return this.prisma.eEOReport.findMany({
      where,
      orderBy: { periodEnd: 'desc' },
    });
  }

  async createEEOReport(data: any) {
    return this.prisma.eEOReport.create({ data });
  }

  async updateEEOReport(id: string, companyId: string, data: any) {
    return this.prisma.eEOReport.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // GRIEVANCES
  // ============================================

  async getGrievances(companyId: string, filters?: {
    complainantId?: string;
    grievanceType?: string;
    status?: string;
    severity?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.complainantId) where.complainantId = filters.complainantId;
    if (filters?.grievanceType) where.grievanceType = filters.grievanceType;
    if (filters?.status) where.status = filters.status;
    if (filters?.severity) where.severity = filters.severity;

    return this.prisma.grievance.findMany({
      where,
      orderBy: { filingDate: 'desc' },
    });
  }

  async getGrievanceById(id: string, companyId: string) {
    return this.prisma.grievance.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createGrievance(data: any) {
    return this.prisma.grievance.create({ data });
  }

  async updateGrievance(id: string, companyId: string, data: any) {
    return this.prisma.grievance.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // POSH COMPLAINTS
  // ============================================

  async getPOSHComplaints(companyId: string, filters?: {
    complaintStatus?: string;
    outcome?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.complaintStatus) where.complaintStatus = filters.complaintStatus;
    if (filters?.outcome) where.outcome = filters.outcome;

    return this.prisma.pOSHComplaint.findMany({
      where,
      orderBy: { filingDate: 'desc' },
    });
  }

  async getPOSHComplaintById(id: string, companyId: string) {
    return this.prisma.pOSHComplaint.findFirst({
      where: { id, companyId, isActive: true },
    });
  }

  async createPOSHComplaint(data: any) {
    return this.prisma.pOSHComplaint.create({ data });
  }

  async updatePOSHComplaint(id: string, companyId: string, data: any) {
    return this.prisma.pOSHComplaint.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // COMPLIANCE AUDITS
  // ============================================

  async getComplianceAudits(companyId: string, filters?: {
    auditType?: string;
    auditCategory?: string;
    status?: string;
    auditYear?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.auditType) where.auditType = filters.auditType;
    if (filters?.auditCategory) where.auditCategory = filters.auditCategory;
    if (filters?.status) where.status = filters.status;
    if (filters?.auditYear) where.auditYear = filters.auditYear;

    return this.prisma.complianceAudit.findMany({
      where,
      include: {
        findings: {
          take: 10,
          orderBy: { severity: 'desc' },
        },
      },
      orderBy: { plannedStartDate: 'desc' },
    });
  }

  async getComplianceAuditById(id: string, companyId: string) {
    return this.prisma.complianceAudit.findFirst({
      where: { id, companyId, isActive: true },
      include: {
        findings: {
          orderBy: { severity: 'desc' },
        },
      },
    });
  }

  async createComplianceAudit(data: any) {
    return this.prisma.complianceAudit.create({ data });
  }

  async updateComplianceAudit(id: string, companyId: string, data: any) {
    return this.prisma.complianceAudit.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // AUDIT FINDINGS
  // ============================================

  async getAuditFindings(companyId: string, filters?: {
    auditId?: string;
    severity?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.auditId) where.auditId = filters.auditId;
    if (filters?.severity) where.severity = filters.severity;
    if (filters?.status) where.status = filters.status;

    return this.prisma.auditFinding.findMany({
      where,
      include: {
        audit: true,
        remediationPlans: true,
      },
      orderBy: { severity: 'desc' },
    });
  }

  async createAuditFinding(data: any) {
    return this.prisma.auditFinding.create({ data });
  }

  async updateAuditFinding(id: string, companyId: string, data: any) {
    return this.prisma.auditFinding.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // REMEDIATION PLANS
  // ============================================

  async getRemediationPlans(companyId: string, filters?: {
    findingId?: string;
    status?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.findingId) where.findingId = filters.findingId;
    if (filters?.status) where.status = filters.status;

    return this.prisma.remediationPlan.findMany({
      where,
      include: {
        finding: {
          include: {
            audit: true,
          },
        },
      },
      orderBy: { plannedEndDate: 'asc' },
    });
  }

  async createRemediationPlan(data: any) {
    return this.prisma.remediationPlan.create({ data });
  }

  async updateRemediationPlan(id: string, companyId: string, data: any) {
    return this.prisma.remediationPlan.update({
      where: { id },
      data,
    });
  }

  // ============================================
  // COMPLIANCE ALERTS
  // ============================================

  async getComplianceAlerts(companyId: string, filters?: {
    alertType?: string;
    alertCategory?: string;
    status?: string;
    severity?: string;
  }) {
    const where: any = { companyId, isActive: true };
    if (filters?.alertType) where.alertType = filters.alertType;
    if (filters?.alertCategory) where.alertCategory = filters.alertCategory;
    if (filters?.status) where.status = filters.status;
    if (filters?.severity) where.severity = filters.severity;

    return this.prisma.complianceAlert.findMany({
      where,
      orderBy: [
        { severity: 'desc' },
        { triggerDate: 'asc' },
      ],
    });
  }

  async createComplianceAlert(data: any) {
    return this.prisma.complianceAlert.create({ data });
  }

  async updateComplianceAlert(id: string, companyId: string, data: any) {
    return this.prisma.complianceAlert.update({
      where: { id },
      data,
    });
  }

  async acknowledgeAlert(id: string, companyId: string, acknowledgedBy: string, acknowledgedByName: string) {
    return this.prisma.complianceAlert.update({
      where: { id },
      data: {
        status: 'acknowledged',
        acknowledgedBy,
        acknowledgedByName,
        acknowledgedAt: new Date(),
      },
    });
  }

  // ============================================
  // HR COMPLIANCE SETTINGS
  // ============================================

  async getComplianceSettings(companyId: string) {
    return this.prisma.hRComplianceSettings.findUnique({
      where: { companyId },
    });
  }

  async upsertComplianceSettings(companyId: string, data: any) {
    return this.prisma.hRComplianceSettings.upsert({
      where: { companyId },
      update: data,
      create: { ...data, companyId },
    });
  }

  // ============================================
  // DASHBOARD & ANALYTICS
  // ============================================

  async getComplianceDashboard(companyId: string) {
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);

    // Get compliance statistics
    const [
      totalCompliances,
      compliantCount,
      nonCompliantCount,
      pendingCount,
      upcomingDeadlines,
      licensesExpiringSoon,
      activeAlerts,
      openGrievances,
      pendingReturns,
      openAuditFindings,
    ] = await Promise.all([
      this.prisma.complianceTracker.count({
        where: { companyId, isActive: true },
      }),
      this.prisma.complianceTracker.count({
        where: { companyId, isActive: true, complianceStatus: 'compliant' },
      }),
      this.prisma.complianceTracker.count({
        where: { companyId, isActive: true, complianceStatus: 'non_compliant' },
      }),
      this.prisma.complianceTracker.count({
        where: { companyId, isActive: true, complianceStatus: 'pending' },
      }),
      this.prisma.complianceCalendar.findMany({
        where: {
          companyId,
          isActive: true,
          eventDate: { gte: now, lte: thirtyDaysFromNow },
          status: { in: ['upcoming', 'due'] },
        },
        orderBy: { eventDate: 'asc' },
        take: 10,
      }),
      this.prisma.licenseMaster.count({
        where: {
          companyId,
          isActive: true,
          validTo: { gte: now, lte: thirtyDaysFromNow },
        },
      }),
      this.prisma.complianceAlert.count({
        where: {
          companyId,
          isActive: true,
          status: 'active',
        },
      }),
      this.prisma.grievance.count({
        where: {
          companyId,
          isActive: true,
          status: { notIn: ['resolved', 'closed', 'withdrawn'] },
        },
      }),
      this.prisma.statutoryReturn.count({
        where: {
          companyId,
          isActive: true,
          status: { in: ['pending', 'draft'] },
        },
      }),
      this.prisma.auditFinding.count({
        where: {
          companyId,
          isActive: true,
          status: { in: ['open', 'acknowledged', 'action_planned', 'in_progress'] },
        },
      }),
    ]);

    return {
      summary: {
        totalCompliances,
        compliantCount,
        nonCompliantCount,
        pendingCount,
        complianceRate: totalCompliances > 0 ? Math.round((compliantCount / totalCompliances) * 100) : 0,
      },
      alerts: {
        activeAlerts,
        licensesExpiringSoon,
        pendingReturns,
        openGrievances,
        openAuditFindings,
      },
      upcomingDeadlines,
    };
  }

  async getStatutoryReportSummary(companyId: string, fiscalYear: string) {
    const returns = await this.prisma.statutoryReturn.groupBy({
      by: ['returnType', 'status'],
      where: { companyId, isActive: true, fiscalYear },
      _count: true,
      _sum: {
        totalAmount: true,
        amountPaid: true,
      },
    });

    return returns;
  }
}
