import { Injectable } from '@nestjs/common';
import { PrismaService } from '../../prisma/prisma.service';
import { Prisma } from '@prisma/client';

@Injectable()
export class AdminManagementService {
  constructor(private prisma: PrismaService) {}

  // ============================================
  // USER GROUPS
  // ============================================

  async getUserGroups(params: {
    companyId: string;
    groupType?: string;
    search?: string;
  }) {
    const { companyId, groupType, search } = params;

    return this.prisma.userGroup.findMany({
      where: {
        companyId,
        isActive: true,
        ...(groupType && { groupType }),
        ...(search && {
          OR: [
            { groupName: { contains: search, mode: 'insensitive' as const } },
            { groupCode: { contains: search, mode: 'insensitive' as const } },
          ],
        }),
      },
      include: {
        members: true,
        childGroups: true,
      },
      orderBy: { groupName: 'asc' },
    });
  }

  async getUserGroupById(id: string, companyId: string) {
    return this.prisma.userGroup.findFirst({
      where: { id, companyId },
      include: {
        members: true,
        parentGroup: true,
        childGroups: true,
      },
    });
  }

  async createUserGroup(data: {
    companyId: string;
    groupCode: string;
    groupName: string;
    description?: string;
    groupType?: string;
    parentGroupId?: string;
    permissions?: Prisma.InputJsonValue;
  }) {
    return this.prisma.userGroup.create({
      data: {
        groupCode: data.groupCode,
        groupName: data.groupName,
        description: data.description,
        groupType: data.groupType || 'standard',
        parentGroupId: data.parentGroupId,
        permissions: data.permissions,
        companyId: data.companyId,
      },
    });
  }

  async updateUserGroup(id: string, companyId: string, data: Partial<{
    groupName: string;
    description: string;
    groupType: string;
    parentGroupId: string;
    permissions: Prisma.InputJsonValue;
    isActive: boolean;
  }>) {
    return this.prisma.userGroup.updateMany({
      where: { id, companyId },
      data,
    });
  }

  async addUserToGroup(data: {
    groupId: string;
    userId: string;
    isAdmin?: boolean;
    companyId: string;
  }) {
    return this.prisma.userGroupMember.create({
      data: {
        groupId: data.groupId,
        userId: data.userId,
        isAdmin: data.isAdmin || false,
        companyId: data.companyId,
      },
    });
  }

  async removeUserFromGroup(groupId: string, userId: string, companyId: string) {
    return this.prisma.userGroupMember.deleteMany({
      where: { groupId, userId, companyId },
    });
  }

  // ============================================
  // ROLE HIERARCHY & ACCESS POLICIES
  // ============================================

  async getRoleHierarchy(companyId: string) {
    return this.prisma.roleHierarchy.findMany({
      where: { companyId },
      orderBy: { level: 'asc' },
    });
  }

  async createRoleHierarchy(data: {
    roleId: string;
    parentRoleId?: string;
    level?: number;
    inheritPermissions?: boolean;
    companyId: string;
  }) {
    return this.prisma.roleHierarchy.create({
      data: {
        roleId: data.roleId,
        parentRoleId: data.parentRoleId,
        level: data.level || 0,
        inheritPermissions: data.inheritPermissions ?? true,
        companyId: data.companyId,
      },
    });
  }

  async getAccessPolicies(params: {
    companyId: string;
    policyType?: string;
    isActive?: boolean;
  }) {
    const { companyId, policyType, isActive } = params;

    return this.prisma.accessPolicy.findMany({
      where: {
        companyId,
        ...(policyType && { policyType }),
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: [{ priority: 'desc' }, { policyName: 'asc' }],
    });
  }

  async createAccessPolicy(data: {
    companyId: string;
    policyCode: string;
    policyName: string;
    description?: string;
    policyType: string;
    conditions: Prisma.InputJsonValue;
    actions: Prisma.InputJsonValue;
    resources?: Prisma.InputJsonValue;
    priority?: number;
  }) {
    return this.prisma.accessPolicy.create({
      data: {
        policyCode: data.policyCode,
        policyName: data.policyName,
        description: data.description,
        policyType: data.policyType,
        conditions: data.conditions,
        actions: data.actions,
        resources: data.resources,
        priority: data.priority || 0,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // SECURITY - PASSWORD POLICIES
  // ============================================

  async getPasswordPolicies(companyId: string) {
    return this.prisma.passwordPolicy.findMany({
      where: { companyId, isActive: true },
      orderBy: { policyName: 'asc' },
    });
  }

  async getDefaultPasswordPolicy(companyId: string) {
    return this.prisma.passwordPolicy.findFirst({
      where: { companyId, isDefault: true, isActive: true },
    });
  }

  async createPasswordPolicy(data: {
    companyId: string;
    policyCode: string;
    policyName: string;
    description?: string;
    minLength?: number;
    maxLength?: number;
    requireUppercase?: boolean;
    requireLowercase?: boolean;
    requireNumbers?: boolean;
    requireSpecialChars?: boolean;
    expiryDays?: number;
    lockoutThreshold?: number;
    lockoutDurationMinutes?: number;
    mfaRequired?: boolean;
    isDefault?: boolean;
  }) {
    return this.prisma.passwordPolicy.create({
      data: {
        policyCode: data.policyCode,
        policyName: data.policyName,
        description: data.description,
        minLength: data.minLength ?? 8,
        maxLength: data.maxLength ?? 128,
        requireUppercase: data.requireUppercase ?? true,
        requireLowercase: data.requireLowercase ?? true,
        requireNumbers: data.requireNumbers ?? true,
        requireSpecialChars: data.requireSpecialChars ?? true,
        expiryDays: data.expiryDays ?? 90,
        lockoutThreshold: data.lockoutThreshold ?? 5,
        lockoutDurationMinutes: data.lockoutDurationMinutes ?? 30,
        mfaRequired: data.mfaRequired ?? false,
        isDefault: data.isDefault ?? false,
        companyId: data.companyId,
      },
    });
  }

  async updatePasswordPolicy(id: string, companyId: string, data: Partial<{
    policyName: string;
    description: string;
    minLength: number;
    maxLength: number;
    requireUppercase: boolean;
    requireLowercase: boolean;
    requireNumbers: boolean;
    requireSpecialChars: boolean;
    expiryDays: number;
    lockoutThreshold: number;
    lockoutDurationMinutes: number;
    mfaRequired: boolean;
    isDefault: boolean;
    isActive: boolean;
  }>) {
    return this.prisma.passwordPolicy.updateMany({
      where: { id, companyId },
      data,
    });
  }

  // ============================================
  // SECURITY - TWO-FACTOR AUTHENTICATION
  // ============================================

  async getTwoFactorConfig(userId: string, companyId: string) {
    return this.prisma.twoFactorConfig.findFirst({
      where: { userId, companyId },
    });
  }

  async createTwoFactorConfig(data: {
    userId: string;
    method?: string;
    secret?: string;
    phoneNumber?: string;
    companyId: string;
  }) {
    return this.prisma.twoFactorConfig.create({
      data: {
        userId: data.userId,
        method: data.method || 'totp',
        secret: data.secret,
        phoneNumber: data.phoneNumber,
        companyId: data.companyId,
      },
    });
  }

  async enableTwoFactor(userId: string, companyId: string) {
    return this.prisma.twoFactorConfig.updateMany({
      where: { userId, companyId },
      data: {
        isEnabled: true,
        isVerified: true,
        enrolledAt: new Date(),
      },
    });
  }

  async disableTwoFactor(userId: string, companyId: string) {
    return this.prisma.twoFactorConfig.updateMany({
      where: { userId, companyId },
      data: {
        isEnabled: false,
        isVerified: false,
      },
    });
  }

  // ============================================
  // SECURITY - SESSION MANAGEMENT
  // ============================================

  async getUserSessions(params: {
    companyId: string;
    userId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, userId, status, page = 1, limit = 50 } = params;

    const where: Prisma.UserSessionWhereInput = {
      companyId,
      ...(userId && { userId }),
      ...(status && { status }),
    };

    const [sessions, total] = await Promise.all([
      this.prisma.userSession.findMany({
        where,
        orderBy: { loginAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.userSession.count({ where }),
    ]);

    return { sessions, total, page, limit };
  }

  async revokeSession(sessionId: string, companyId: string, revokedBy: string, reason?: string) {
    return this.prisma.userSession.updateMany({
      where: { id: sessionId, companyId },
      data: {
        status: 'revoked',
        revokedAt: new Date(),
        revokedBy,
        revokeReason: reason,
      },
    });
  }

  async revokeAllUserSessions(userId: string, companyId: string, revokedBy: string) {
    return this.prisma.userSession.updateMany({
      where: { userId, companyId, status: 'active' },
      data: {
        status: 'revoked',
        revokedAt: new Date(),
        revokedBy,
        revokeReason: 'Bulk session revocation',
      },
    });
  }

  // ============================================
  // SECURITY - IP WHITELIST
  // ============================================

  async getIPWhitelist(companyId: string) {
    return this.prisma.iPWhitelistEntry.findMany({
      where: { companyId, isActive: true },
      orderBy: { createdAt: 'desc' },
    });
  }

  async addIPToWhitelist(data: {
    companyId: string;
    ipAddress: string;
    ipType?: string;
    description?: string;
    startIp?: string;
    endIp?: string;
    allowedUsers?: string[];
    allowedRoles?: string[];
    validFrom?: Date;
    validTo?: Date;
    createdBy?: string;
  }) {
    return this.prisma.iPWhitelistEntry.create({
      data: {
        ipAddress: data.ipAddress,
        ipType: data.ipType || 'single',
        description: data.description,
        startIp: data.startIp,
        endIp: data.endIp,
        allowedUsers: data.allowedUsers || [],
        allowedRoles: data.allowedRoles || [],
        validFrom: data.validFrom,
        validTo: data.validTo,
        createdBy: data.createdBy,
        companyId: data.companyId,
      },
    });
  }

  async removeIPFromWhitelist(id: string, companyId: string) {
    return this.prisma.iPWhitelistEntry.updateMany({
      where: { id, companyId },
      data: { isActive: false },
    });
  }

  // ============================================
  // SECURITY - ALERTS
  // ============================================

  async getSecurityAlerts(params: {
    companyId: string;
    alertType?: string;
    severity?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, alertType, severity, status, page = 1, limit = 50 } = params;

    const where: Prisma.SecurityAlertWhereInput = {
      companyId,
      ...(alertType && { alertType }),
      ...(severity && { severity }),
      ...(status && { status }),
    };

    const [alerts, total] = await Promise.all([
      this.prisma.securityAlert.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.securityAlert.count({ where }),
    ]);

    return { alerts, total, page, limit };
  }

  async createSecurityAlert(data: {
    companyId: string;
    alertCode: string;
    alertType: string;
    severity?: string;
    title: string;
    description: string;
    details?: Prisma.InputJsonValue;
    userId?: string;
    ipAddress?: string;
  }) {
    return this.prisma.securityAlert.create({
      data: {
        alertCode: data.alertCode,
        alertType: data.alertType,
        severity: data.severity || 'medium',
        title: data.title,
        description: data.description,
        details: data.details,
        userId: data.userId,
        ipAddress: data.ipAddress,
        companyId: data.companyId,
      },
    });
  }

  async acknowledgeSecurityAlert(id: string, companyId: string, acknowledgedBy: string) {
    return this.prisma.securityAlert.updateMany({
      where: { id, companyId },
      data: {
        status: 'investigating',
        acknowledgedBy,
        acknowledgedAt: new Date(),
      },
    });
  }

  async resolveSecurityAlert(id: string, companyId: string, resolvedBy: string, resolution: string) {
    return this.prisma.securityAlert.updateMany({
      where: { id, companyId },
      data: {
        status: 'resolved',
        resolvedBy,
        resolvedAt: new Date(),
        resolution,
      },
    });
  }

  // ============================================
  // AUDIT & COMPLIANCE - AUDIT LOGS
  // ============================================

  async getAuditLogs(params: {
    companyId: string;
    action?: string;
    module?: string;
    userId?: string;
    resourceType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }) {
    const { companyId, action, module, userId, resourceType, dateFrom, dateTo, page = 1, limit = 50 } = params;

    const where: Prisma.AuditLogWhereInput = {
      companyId,
      ...(action && { action }),
      ...(module && { module }),
      ...(userId && { userId }),
      ...(resourceType && { resourceType }),
      ...(dateFrom && { createdAt: { gte: dateFrom } }),
      ...(dateTo && { createdAt: { lte: dateTo } }),
    };

    const [logs, total] = await Promise.all([
      this.prisma.auditLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.auditLog.count({ where }),
    ]);

    return { logs, total, page, limit };
  }

  async createAuditLog(data: {
    companyId: string;
    logCode: string;
    action: string;
    module: string;
    resourceType: string;
    resourceId?: string;
    resourceName?: string;
    userId?: string;
    userName?: string;
    userEmail?: string;
    userRole?: string;
    ipAddress?: string;
    userAgent?: string;
    oldValues?: Prisma.InputJsonValue;
    newValues?: Prisma.InputJsonValue;
    changedFields?: string[];
    status?: string;
    metadata?: Prisma.InputJsonValue;
  }) {
    return this.prisma.auditLog.create({
      data: {
        logCode: data.logCode,
        action: data.action,
        module: data.module,
        resourceType: data.resourceType,
        resourceId: data.resourceId,
        resourceName: data.resourceName,
        userId: data.userId,
        userName: data.userName,
        userEmail: data.userEmail,
        userRole: data.userRole,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        oldValues: data.oldValues,
        newValues: data.newValues,
        changedFields: data.changedFields || [],
        status: data.status || 'success',
        metadata: data.metadata,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // AUDIT & COMPLIANCE - LOGIN HISTORY
  // ============================================

  async getLoginHistory(params: {
    companyId: string;
    userId?: string;
    status?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }) {
    const { companyId, userId, status, dateFrom, dateTo, page = 1, limit = 50 } = params;

    const where: Prisma.LoginHistoryWhereInput = {
      companyId,
      ...(userId && { userId }),
      ...(status && { status }),
      ...(dateFrom && { loginAt: { gte: dateFrom } }),
      ...(dateTo && { loginAt: { lte: dateTo } }),
    };

    const [history, total] = await Promise.all([
      this.prisma.loginHistory.findMany({
        where,
        orderBy: { loginAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.loginHistory.count({ where }),
    ]);

    return { history, total, page, limit };
  }

  async recordLogin(data: {
    companyId: string;
    userId: string;
    userName?: string;
    loginType?: string;
    status: string;
    failureReason?: string;
    ipAddress?: string;
    userAgent?: string;
    deviceType?: string;
    browser?: string;
    operatingSystem?: string;
    location?: string;
    sessionId?: string;
    mfaUsed?: boolean;
  }) {
    return this.prisma.loginHistory.create({
      data: {
        userId: data.userId,
        userName: data.userName,
        loginType: data.loginType || 'password',
        status: data.status,
        failureReason: data.failureReason,
        ipAddress: data.ipAddress,
        userAgent: data.userAgent,
        deviceType: data.deviceType,
        browser: data.browser,
        operatingSystem: data.operatingSystem,
        location: data.location,
        sessionId: data.sessionId,
        mfaUsed: data.mfaUsed || false,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // AUDIT & COMPLIANCE - CHANGE LOGS
  // ============================================

  async getChangeLogs(params: {
    companyId: string;
    entityType?: string;
    entityId?: string;
    changeType?: string;
    changedBy?: string;
    dateFrom?: Date;
    dateTo?: Date;
    page?: number;
    limit?: number;
  }) {
    const { companyId, entityType, entityId, changeType, changedBy, dateFrom, dateTo, page = 1, limit = 50 } = params;

    const where: Prisma.ChangeLogWhereInput = {
      companyId,
      ...(entityType && { entityType }),
      ...(entityId && { entityId }),
      ...(changeType && { changeType }),
      ...(changedBy && { changedBy }),
      ...(dateFrom && { createdAt: { gte: dateFrom } }),
      ...(dateTo && { createdAt: { lte: dateTo } }),
    };

    const [logs, total] = await Promise.all([
      this.prisma.changeLog.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.changeLog.count({ where }),
    ]);

    return { logs, total, page, limit };
  }

  async createChangeLog(data: {
    companyId: string;
    changeCode: string;
    entityType: string;
    entityId: string;
    entityName?: string;
    changeType: string;
    fieldName?: string;
    oldValue?: string;
    newValue?: string;
    fullOldRecord?: Prisma.InputJsonValue;
    fullNewRecord?: Prisma.InputJsonValue;
    changedBy?: string;
    changedByName?: string;
    reason?: string;
    batchId?: string;
  }) {
    return this.prisma.changeLog.create({
      data: {
        changeCode: data.changeCode,
        entityType: data.entityType,
        entityId: data.entityId,
        entityName: data.entityName,
        changeType: data.changeType,
        fieldName: data.fieldName,
        oldValue: data.oldValue,
        newValue: data.newValue,
        fullOldRecord: data.fullOldRecord,
        fullNewRecord: data.fullNewRecord,
        changedBy: data.changedBy,
        changedByName: data.changedByName,
        reason: data.reason,
        batchId: data.batchId,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // AUDIT & COMPLIANCE - COMPLIANCE REPORTS
  // ============================================

  async getComplianceReports(params: {
    companyId: string;
    reportType?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, reportType, status, page = 1, limit = 20 } = params;

    const where: Prisma.ComplianceReportWhereInput = {
      companyId,
      ...(reportType && { reportType }),
      ...(status && { status }),
    };

    const [reports, total] = await Promise.all([
      this.prisma.complianceReport.findMany({
        where,
        orderBy: { generatedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.complianceReport.count({ where }),
    ]);

    return { reports, total, page, limit };
  }

  async createComplianceReport(data: {
    companyId: string;
    reportCode: string;
    reportName: string;
    reportType: string;
    description?: string;
    periodStart: Date;
    periodEnd: Date;
    generatedBy?: string;
    findings?: Prisma.InputJsonValue;
    recommendations?: Prisma.InputJsonValue;
    score?: number;
    riskLevel?: string;
  }) {
    return this.prisma.complianceReport.create({
      data: {
        reportCode: data.reportCode,
        reportName: data.reportName,
        reportType: data.reportType,
        description: data.description,
        periodStart: data.periodStart,
        periodEnd: data.periodEnd,
        generatedBy: data.generatedBy,
        findings: data.findings,
        recommendations: data.recommendations,
        score: data.score,
        riskLevel: data.riskLevel,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // DATABASE MANAGEMENT - BACKUPS
  // ============================================

  async getDatabaseBackups(params: {
    companyId: string;
    backupType?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, backupType, status, page = 1, limit = 20 } = params;

    const where: Prisma.DatabaseBackupWhereInput = {
      companyId,
      ...(backupType && { backupType }),
      ...(status && { status }),
    };

    const [backups, total] = await Promise.all([
      this.prisma.databaseBackup.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.databaseBackup.count({ where }),
    ]);

    return { backups, total, page, limit };
  }

  async createDatabaseBackup(data: {
    companyId: string;
    backupCode: string;
    backupName: string;
    backupType: string;
    databaseName?: string;
    tablesIncluded?: string[];
    tablesExcluded?: string[];
    retentionDays?: number;
    initiatedBy?: string;
    isScheduled?: boolean;
    scheduleId?: string;
  }) {
    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + (data.retentionDays || 30));

    return this.prisma.databaseBackup.create({
      data: {
        backupCode: data.backupCode,
        backupName: data.backupName,
        backupType: data.backupType,
        databaseName: data.databaseName,
        tablesIncluded: data.tablesIncluded || [],
        tablesExcluded: data.tablesExcluded || [],
        retentionDays: data.retentionDays || 30,
        expiresAt,
        initiatedBy: data.initiatedBy,
        isScheduled: data.isScheduled || false,
        scheduleId: data.scheduleId,
        companyId: data.companyId,
      },
    });
  }

  async updateBackupStatus(id: string, companyId: string, status: string, data?: {
    filePath?: string;
    fileSize?: bigint;
    checksum?: string;
    errorMessage?: string;
  }) {
    const updateData: Prisma.DatabaseBackupUpdateManyMutationInput = { status };

    if (status === 'in_progress') {
      updateData.startedAt = new Date();
    } else if (status === 'completed') {
      updateData.completedAt = new Date();
      if (data?.filePath) updateData.filePath = data.filePath;
      if (data?.fileSize) updateData.fileSize = data.fileSize;
      if (data?.checksum) updateData.checksum = data.checksum;
    } else if (status === 'failed' && data?.errorMessage) {
      updateData.errorMessage = data.errorMessage;
    }

    return this.prisma.databaseBackup.updateMany({
      where: { id, companyId },
      data: updateData,
    });
  }

  // ============================================
  // DATABASE MANAGEMENT - EXPORT/IMPORT
  // ============================================

  async getDataExportJobs(companyId: string, status?: string) {
    return this.prisma.dataExportJob.findMany({
      where: {
        companyId,
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDataExportJob(data: {
    companyId: string;
    jobCode: string;
    jobName: string;
    exportType: string;
    format?: string;
    entities: string[];
    filters?: Prisma.InputJsonValue;
    initiatedBy?: string;
  }) {
    return this.prisma.dataExportJob.create({
      data: {
        jobCode: data.jobCode,
        jobName: data.jobName,
        exportType: data.exportType,
        format: data.format || 'csv',
        entities: data.entities,
        filters: data.filters,
        initiatedBy: data.initiatedBy,
        companyId: data.companyId,
      },
    });
  }

  async getDataImportJobs(companyId: string, status?: string) {
    return this.prisma.dataImportJob.findMany({
      where: {
        companyId,
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDataImportJob(data: {
    companyId: string;
    jobCode: string;
    jobName: string;
    importType: string;
    sourceFile?: string;
    format?: string;
    targetEntity: string;
    mappingConfig?: Prisma.InputJsonValue;
    validationRules?: Prisma.InputJsonValue;
    initiatedBy?: string;
  }) {
    return this.prisma.dataImportJob.create({
      data: {
        jobCode: data.jobCode,
        jobName: data.jobName,
        importType: data.importType,
        sourceFile: data.sourceFile,
        format: data.format,
        targetEntity: data.targetEntity,
        mappingConfig: data.mappingConfig,
        validationRules: data.validationRules,
        initiatedBy: data.initiatedBy,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // DATABASE MANAGEMENT - CLEANUP
  // ============================================

  async getDatabaseCleanupJobs(companyId: string, status?: string) {
    return this.prisma.databaseCleanupJob.findMany({
      where: {
        companyId,
        ...(status && { status }),
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async createDatabaseCleanupJob(data: {
    companyId: string;
    jobCode: string;
    jobName: string;
    cleanupType: string;
    targetEntities: string[];
    criteria?: Prisma.InputJsonValue;
    dryRun?: boolean;
    initiatedBy?: string;
    isScheduled?: boolean;
    scheduleId?: string;
  }) {
    return this.prisma.databaseCleanupJob.create({
      data: {
        jobCode: data.jobCode,
        jobName: data.jobName,
        cleanupType: data.cleanupType,
        targetEntities: data.targetEntities,
        criteria: data.criteria,
        dryRun: data.dryRun || false,
        initiatedBy: data.initiatedBy,
        isScheduled: data.isScheduled || false,
        scheduleId: data.scheduleId,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // SYSTEM MONITORING - HEALTH CHECKS
  // ============================================

  async getSystemHealthChecks(params: {
    companyId: string;
    checkType?: string;
    status?: string;
    limit?: number;
  }) {
    const { companyId, checkType, status, limit = 100 } = params;

    return this.prisma.systemHealthCheck.findMany({
      where: {
        companyId,
        ...(checkType && { checkType }),
        ...(status && { status }),
      },
      orderBy: { checkedAt: 'desc' },
      take: limit,
    });
  }

  async createHealthCheck(data: {
    companyId: string;
    checkCode: string;
    checkType: string;
    serviceName: string;
    endpoint?: string;
    status: string;
    responseTime?: number;
    details?: Prisma.InputJsonValue;
    errorMessage?: string;
  }) {
    return this.prisma.systemHealthCheck.create({
      data: {
        checkCode: data.checkCode,
        checkType: data.checkType,
        serviceName: data.serviceName,
        endpoint: data.endpoint,
        status: data.status,
        responseTime: data.responseTime,
        details: data.details,
        errorMessage: data.errorMessage,
        companyId: data.companyId,
      },
    });
  }

  async getLatestHealthStatus(companyId: string) {
    const services = ['database', 'api', 'cache', 'queue', 'storage'];
    const results = await Promise.all(
      services.map(async (service) => {
        const check = await this.prisma.systemHealthCheck.findFirst({
          where: { companyId, checkType: service },
          orderBy: { checkedAt: 'desc' },
        });
        return { service, check };
      })
    );
    return results;
  }

  // ============================================
  // SYSTEM MONITORING - PERFORMANCE METRICS
  // ============================================

  async getPerformanceMetrics(params: {
    companyId: string;
    metricType?: string;
    dateFrom?: Date;
    dateTo?: Date;
    limit?: number;
  }) {
    const { companyId, metricType, dateFrom, dateTo, limit = 100 } = params;

    return this.prisma.performanceMetric.findMany({
      where: {
        companyId,
        ...(metricType && { metricType }),
        ...(dateFrom && { recordedAt: { gte: dateFrom } }),
        ...(dateTo && { recordedAt: { lte: dateTo } }),
      },
      orderBy: { recordedAt: 'desc' },
      take: limit,
    });
  }

  async recordPerformanceMetric(data: {
    companyId: string;
    metricCode: string;
    metricType: string;
    metricName: string;
    value: number;
    unit: string;
    threshold?: number;
    warningThreshold?: number;
    criticalThreshold?: number;
    source?: string;
    tags?: Prisma.InputJsonValue;
  }) {
    let status = 'normal';
    if (data.criticalThreshold && data.value >= data.criticalThreshold) {
      status = 'critical';
    } else if (data.warningThreshold && data.value >= data.warningThreshold) {
      status = 'warning';
    }

    return this.prisma.performanceMetric.create({
      data: {
        metricCode: data.metricCode,
        metricType: data.metricType,
        metricName: data.metricName,
        value: data.value,
        unit: data.unit,
        threshold: data.threshold,
        warningThreshold: data.warningThreshold,
        criticalThreshold: data.criticalThreshold,
        status,
        source: data.source,
        tags: data.tags,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // SYSTEM MONITORING - SERVER LOGS
  // ============================================

  async getServerLogs(params: {
    companyId: string;
    logLevel?: string;
    source?: string;
    dateFrom?: Date;
    dateTo?: Date;
    search?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, logLevel, source, dateFrom, dateTo, search, page = 1, limit = 100 } = params;

    const where: Prisma.ServerLogWhereInput = {
      companyId,
      ...(logLevel && { logLevel }),
      ...(source && { source }),
      ...(dateFrom && { loggedAt: { gte: dateFrom } }),
      ...(dateTo && { loggedAt: { lte: dateTo } }),
      ...(search && {
        OR: [
          { message: { contains: search, mode: 'insensitive' as const } },
          { source: { contains: search, mode: 'insensitive' as const } },
        ],
      }),
    };

    const [logs, total] = await Promise.all([
      this.prisma.serverLog.findMany({
        where,
        orderBy: { loggedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.serverLog.count({ where }),
    ]);

    return { logs, total, page, limit };
  }

  async createServerLog(data: {
    companyId: string;
    logLevel: string;
    source: string;
    category?: string;
    message: string;
    details?: Prisma.InputJsonValue;
    stackTrace?: string;
    requestId?: string;
    userId?: string;
    sessionId?: string;
    ipAddress?: string;
    endpoint?: string;
    method?: string;
    statusCode?: number;
    responseTime?: number;
    tags?: string[];
  }) {
    return this.prisma.serverLog.create({
      data: {
        logLevel: data.logLevel,
        source: data.source,
        category: data.category,
        message: data.message,
        details: data.details,
        stackTrace: data.stackTrace,
        requestId: data.requestId,
        userId: data.userId,
        sessionId: data.sessionId,
        ipAddress: data.ipAddress,
        endpoint: data.endpoint,
        method: data.method,
        statusCode: data.statusCode,
        responseTime: data.responseTime,
        tags: data.tags || [],
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // SYSTEM MONITORING - ERROR TRACKING
  // ============================================

  async getErrorTracking(params: {
    companyId: string;
    errorType?: string;
    status?: string;
    severity?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, errorType, status, severity, page = 1, limit = 50 } = params;

    const where: Prisma.ErrorTrackingWhereInput = {
      companyId,
      ...(errorType && { errorType }),
      ...(status && { status }),
      ...(severity && { severity }),
    };

    const [errors, total] = await Promise.all([
      this.prisma.errorTracking.findMany({
        where,
        orderBy: { lastOccurrence: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.errorTracking.count({ where }),
    ]);

    return { errors, total, page, limit };
  }

  async trackError(data: {
    companyId: string;
    errorCode: string;
    errorType: string;
    message: string;
    stackTrace?: string;
    source: string;
    endpoint?: string;
    method?: string;
    userId?: string;
    context?: Prisma.InputJsonValue;
    severity?: string;
  }) {
    // Check if error already exists
    const existing = await this.prisma.errorTracking.findFirst({
      where: {
        companyId: data.companyId,
        errorCode: data.errorCode,
        message: data.message,
      },
    });

    if (existing) {
      return this.prisma.errorTracking.update({
        where: { id: existing.id },
        data: {
          occurrences: { increment: 1 },
          lastOccurrence: new Date(),
        },
      });
    }

    return this.prisma.errorTracking.create({
      data: {
        errorCode: data.errorCode,
        errorType: data.errorType,
        message: data.message,
        stackTrace: data.stackTrace,
        source: data.source,
        endpoint: data.endpoint,
        method: data.method,
        userId: data.userId,
        context: data.context,
        severity: data.severity || 'medium',
        companyId: data.companyId,
      },
    });
  }

  async resolveError(id: string, companyId: string, resolvedBy: string, resolution: string) {
    return this.prisma.errorTracking.updateMany({
      where: { id, companyId },
      data: {
        status: 'resolved',
        resolvedBy,
        resolvedAt: new Date(),
        resolution,
      },
    });
  }

  // ============================================
  // CUSTOMIZATION - CUSTOM FIELDS
  // ============================================

  async getCustomFields(params: {
    companyId: string;
    entityType?: string;
    isActive?: boolean;
  }) {
    const { companyId, entityType, isActive } = params;

    return this.prisma.customField.findMany({
      where: {
        companyId,
        ...(entityType && { entityType }),
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: [{ entityType: 'asc' }, { displayOrder: 'asc' }],
    });
  }

  async createCustomField(data: {
    companyId: string;
    fieldCode: string;
    fieldName: string;
    fieldLabel: string;
    entityType: string;
    fieldType: string;
    defaultValue?: string;
    placeholder?: string;
    helpText?: string;
    isRequired?: boolean;
    isUnique?: boolean;
    isSearchable?: boolean;
    isFilterable?: boolean;
    showInList?: boolean;
    showInDetail?: boolean;
    options?: Prisma.InputJsonValue;
    validationRules?: Prisma.InputJsonValue;
    displayOrder?: number;
    groupName?: string;
  }) {
    return this.prisma.customField.create({
      data: {
        fieldCode: data.fieldCode,
        fieldName: data.fieldName,
        fieldLabel: data.fieldLabel,
        entityType: data.entityType,
        fieldType: data.fieldType,
        defaultValue: data.defaultValue,
        placeholder: data.placeholder,
        helpText: data.helpText,
        isRequired: data.isRequired || false,
        isUnique: data.isUnique || false,
        isSearchable: data.isSearchable ?? true,
        isFilterable: data.isFilterable ?? true,
        showInList: data.showInList ?? true,
        showInDetail: data.showInDetail ?? true,
        options: data.options,
        validationRules: data.validationRules,
        displayOrder: data.displayOrder || 0,
        groupName: data.groupName,
        companyId: data.companyId,
      },
    });
  }

  async setCustomFieldValue(data: {
    companyId: string;
    customFieldId: string;
    entityType: string;
    entityId: string;
    value: string | number | boolean | Date | Prisma.InputJsonValue;
    fieldType: string;
  }) {
    const valueData: Partial<{
      textValue: string;
      numberValue: number;
      booleanValue: boolean;
      dateValue: Date;
      jsonValue: Prisma.InputJsonValue;
    }> = {};

    switch (data.fieldType) {
      case 'text':
      case 'email':
      case 'url':
      case 'phone':
      case 'select':
        valueData.textValue = data.value as string;
        break;
      case 'number':
        valueData.numberValue = data.value as number;
        break;
      case 'boolean':
        valueData.booleanValue = data.value as boolean;
        break;
      case 'date':
      case 'datetime':
        valueData.dateValue = data.value as Date;
        break;
      case 'multiselect':
      case 'file':
        valueData.jsonValue = data.value as Prisma.InputJsonValue;
        break;
    }

    return this.prisma.customFieldValue.upsert({
      where: {
        customFieldId_entityId: {
          customFieldId: data.customFieldId,
          entityId: data.entityId,
        },
      },
      update: valueData,
      create: {
        customFieldId: data.customFieldId,
        entityType: data.entityType,
        entityId: data.entityId,
        ...valueData,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // CUSTOMIZATION - WORKFLOWS
  // ============================================

  async getWorkflowDefinitions(params: {
    companyId: string;
    entityType?: string;
    isActive?: boolean;
  }) {
    const { companyId, entityType, isActive } = params;

    return this.prisma.workflowDefinition.findMany({
      where: {
        companyId,
        ...(entityType && { entityType }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        steps: { orderBy: { stepOrder: 'asc' } },
      },
      orderBy: { workflowName: 'asc' },
    });
  }

  async createWorkflowDefinition(data: {
    companyId: string;
    workflowCode: string;
    workflowName: string;
    description?: string;
    entityType: string;
    triggerType: string;
    triggerConditions?: Prisma.InputJsonValue;
  }) {
    return this.prisma.workflowDefinition.create({
      data: {
        workflowCode: data.workflowCode,
        workflowName: data.workflowName,
        description: data.description,
        entityType: data.entityType,
        triggerType: data.triggerType,
        triggerConditions: data.triggerConditions,
        companyId: data.companyId,
      },
    });
  }

  async addWorkflowStep(data: {
    workflowId: string;
    stepOrder: number;
    stepName: string;
    stepType: string;
    assigneeType?: string;
    assigneeId?: string;
    actionConfig?: Prisma.InputJsonValue;
    conditions?: Prisma.InputJsonValue;
    timeout?: number;
    timeoutAction?: string;
    escalateTo?: string;
    companyId: string;
  }) {
    return this.prisma.workflowStep.create({
      data: {
        workflowId: data.workflowId,
        stepOrder: data.stepOrder,
        stepName: data.stepName,
        stepType: data.stepType,
        assigneeType: data.assigneeType,
        assigneeId: data.assigneeId,
        actionConfig: data.actionConfig,
        conditions: data.conditions,
        timeout: data.timeout,
        timeoutAction: data.timeoutAction,
        escalateTo: data.escalateTo,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // CUSTOMIZATION - TEMPLATES
  // ============================================

  async getNotificationTemplates(params: {
    companyId: string;
    category?: string;
    channel?: string;
    isActive?: boolean;
  }) {
    const { companyId, category, channel, isActive } = params;

    return this.prisma.notificationTemplate.findMany({
      where: {
        companyId,
        ...(category && { category }),
        ...(channel && { channel }),
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: [{ category: 'asc' }, { templateName: 'asc' }],
    });
  }

  async createNotificationTemplate(data: {
    companyId: string;
    templateCode: string;
    templateName: string;
    description?: string;
    category: string;
    channel: string;
    subject?: string;
    body: string;
    bodyHtml?: string;
    variables?: string[];
    sampleData?: Prisma.InputJsonValue;
  }) {
    return this.prisma.notificationTemplate.create({
      data: {
        templateCode: data.templateCode,
        templateName: data.templateName,
        description: data.description,
        category: data.category,
        channel: data.channel,
        subject: data.subject,
        body: data.body,
        bodyHtml: data.bodyHtml,
        variables: data.variables || [],
        sampleData: data.sampleData,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // CUSTOMIZATION - BRANDING
  // ============================================

  async getBrandingSettings(companyId: string) {
    let settings = await this.prisma.brandingSettings.findFirst({
      where: { companyId },
    });

    if (!settings) {
      settings = await this.prisma.brandingSettings.create({
        data: { companyId },
      });
    }

    return settings;
  }

  async updateBrandingSettings(companyId: string, data: Partial<{
    logoUrl: string;
    logoLightUrl: string;
    faviconUrl: string;
    loginBgUrl: string;
    primaryColor: string;
    secondaryColor: string;
    accentColor: string;
    errorColor: string;
    warningColor: string;
    successColor: string;
    fontFamily: string;
    headingFont: string;
    borderRadius: string;
    sidebarStyle: string;
    headerStyle: string;
    customCss: string;
    footerText: string;
    copyrightText: string;
  }>) {
    const existing = await this.prisma.brandingSettings.findFirst({
      where: { companyId },
    });

    if (existing) {
      return this.prisma.brandingSettings.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.brandingSettings.create({
      data: {
        companyId,
        ...data,
      },
    });
  }

  // ============================================
  // AUTOMATION & SCHEDULER - SCHEDULED JOBS
  // ============================================

  async getScheduledJobs(params: {
    companyId: string;
    jobType?: string;
    isActive?: boolean;
  }) {
    const { companyId, jobType, isActive } = params;

    return this.prisma.scheduledJob.findMany({
      where: {
        companyId,
        ...(jobType && { jobType }),
        ...(isActive !== undefined && { isActive }),
      },
      include: {
        executions: { orderBy: { startedAt: 'desc' }, take: 5 },
      },
      orderBy: { jobName: 'asc' },
    });
  }

  async createScheduledJob(data: {
    companyId: string;
    jobCode: string;
    jobName: string;
    description?: string;
    jobType: string;
    schedule: string;
    timezone?: string;
    configuration?: Prisma.InputJsonValue;
    retryOnFailure?: boolean;
    maxRetries?: number;
    retryDelayMinutes?: number;
    notifyOnSuccess?: boolean;
    notifyOnFailure?: boolean;
    notifyEmails?: string[];
    createdBy?: string;
  }) {
    return this.prisma.scheduledJob.create({
      data: {
        jobCode: data.jobCode,
        jobName: data.jobName,
        description: data.description,
        jobType: data.jobType,
        schedule: data.schedule,
        timezone: data.timezone || 'UTC',
        configuration: data.configuration,
        retryOnFailure: data.retryOnFailure || false,
        maxRetries: data.maxRetries || 3,
        retryDelayMinutes: data.retryDelayMinutes || 5,
        notifyOnSuccess: data.notifyOnSuccess || false,
        notifyOnFailure: data.notifyOnFailure || true,
        notifyEmails: data.notifyEmails || [],
        createdBy: data.createdBy,
        companyId: data.companyId,
      },
    });
  }

  async updateScheduledJob(id: string, companyId: string, data: Partial<{
    jobName: string;
    description: string;
    schedule: string;
    timezone: string;
    isActive: boolean;
    configuration: Prisma.InputJsonValue;
    retryOnFailure: boolean;
    maxRetries: number;
    notifyOnSuccess: boolean;
    notifyOnFailure: boolean;
    notifyEmails: string[];
  }>) {
    return this.prisma.scheduledJob.updateMany({
      where: { id, companyId },
      data,
    });
  }

  // ============================================
  // AUTOMATION & SCHEDULER - JOB EXECUTIONS
  // ============================================

  async getJobExecutions(params: {
    companyId: string;
    jobId?: string;
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const { companyId, jobId, status, page = 1, limit = 50 } = params;

    const where: Prisma.JobExecutionWhereInput = {
      companyId,
      ...(jobId && { jobId }),
      ...(status && { status }),
    };

    const [executions, total] = await Promise.all([
      this.prisma.jobExecution.findMany({
        where,
        include: { job: true },
        orderBy: { startedAt: 'desc' },
        skip: (page - 1) * limit,
        take: limit,
      }),
      this.prisma.jobExecution.count({ where }),
    ]);

    return { executions, total, page, limit };
  }

  async createJobExecution(data: {
    companyId: string;
    executionCode: string;
    jobId: string;
    triggeredBy?: string;
    triggeredByUserId?: string;
    inputParams?: Prisma.InputJsonValue;
  }) {
    return this.prisma.jobExecution.create({
      data: {
        executionCode: data.executionCode,
        jobId: data.jobId,
        status: 'pending',
        triggeredBy: data.triggeredBy || 'scheduler',
        triggeredByUserId: data.triggeredByUserId,
        inputParams: data.inputParams,
        companyId: data.companyId,
      },
    });
  }

  async updateJobExecution(id: string, companyId: string, data: Partial<{
    status: string;
    startedAt: Date;
    completedAt: Date;
    duration: number;
    outputResult: Prisma.InputJsonValue;
    errorMessage: string;
    stackTrace: string;
    retryCount: number;
    logs: string;
  }>) {
    return this.prisma.jobExecution.updateMany({
      where: { id, companyId },
      data,
    });
  }

  // ============================================
  // AUTOMATION & SCHEDULER - AUTOMATION RULES
  // ============================================

  async getAutomationRules(params: {
    companyId: string;
    triggerType?: string;
    isActive?: boolean;
  }) {
    const { companyId, triggerType, isActive } = params;

    return this.prisma.adminAutomationRule.findMany({
      where: {
        companyId,
        ...(triggerType && { triggerType }),
        ...(isActive !== undefined && { isActive }),
      },
      orderBy: [{ priority: 'desc' }, { ruleName: 'asc' }],
    });
  }

  async createAutomationRule(data: {
    companyId: string;
    ruleCode: string;
    ruleName: string;
    description?: string;
    triggerType: string;
    triggerEvent?: string;
    triggerSchedule?: string;
    triggerConditions?: Prisma.InputJsonValue;
    conditions: Prisma.InputJsonValue;
    actions: Prisma.InputJsonValue;
    priority?: number;
    createdBy?: string;
  }) {
    return this.prisma.adminAutomationRule.create({
      data: {
        ruleCode: data.ruleCode,
        ruleName: data.ruleName,
        description: data.description,
        triggerType: data.triggerType,
        triggerEvent: data.triggerEvent,
        triggerSchedule: data.triggerSchedule,
        triggerConditions: data.triggerConditions,
        conditions: data.conditions,
        actions: data.actions,
        priority: data.priority || 0,
        createdBy: data.createdBy,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // LICENSE MANAGEMENT
  // ============================================

  async getLicense(companyId: string) {
    return this.prisma.license.findFirst({
      where: { companyId, status: 'active' },
    });
  }

  async getFeatureAccess(companyId: string, featureCode?: string) {
    return this.prisma.featureAccess.findMany({
      where: {
        companyId,
        ...(featureCode && { featureCode }),
      },
      orderBy: [{ module: 'asc' }, { featureName: 'asc' }],
    });
  }

  async updateFeatureAccess(id: string, companyId: string, data: Partial<{
    isEnabled: boolean;
    accessLevel: string;
    allowedRoles: string[];
    usageLimit: number;
    expiresAt: Date;
  }>) {
    const updateData: Prisma.FeatureAccessUpdateManyMutationInput = { ...data };
    if (data.isEnabled) {
      updateData.enabledAt = new Date();
    }

    return this.prisma.featureAccess.updateMany({
      where: { id, companyId },
      data: updateData,
    });
  }

  // ============================================
  // SYSTEM SETTINGS
  // ============================================

  async getSystemSettings(companyId: string, category?: string) {
    return this.prisma.systemSetting.findMany({
      where: {
        companyId,
        ...(category && { category }),
      },
      orderBy: [{ category: 'asc' }, { settingKey: 'asc' }],
    });
  }

  async getSystemSetting(companyId: string, key: string) {
    return this.prisma.systemSetting.findFirst({
      where: { companyId, settingKey: key },
    });
  }

  async setSystemSetting(data: {
    companyId: string;
    settingKey: string;
    settingValue: string;
    settingType?: string;
    category: string;
    description?: string;
    isEncrypted?: boolean;
  }) {
    return this.prisma.systemSetting.upsert({
      where: {
        settingKey_companyId: {
          settingKey: data.settingKey,
          companyId: data.companyId,
        },
      },
      update: {
        settingValue: data.settingValue,
        settingType: data.settingType,
        description: data.description,
        isEncrypted: data.isEncrypted,
      },
      create: {
        settingKey: data.settingKey,
        settingValue: data.settingValue,
        settingType: data.settingType || 'string',
        category: data.category,
        description: data.description,
        isEncrypted: data.isEncrypted || false,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // EMAIL CONFIGURATION
  // ============================================

  async getEmailConfigurations(companyId: string) {
    return this.prisma.emailConfiguration.findMany({
      where: { companyId, isActive: true },
      orderBy: { configName: 'asc' },
    });
  }

  async getDefaultEmailConfiguration(companyId: string) {
    return this.prisma.emailConfiguration.findFirst({
      where: { companyId, isDefault: true, isActive: true },
    });
  }

  async createEmailConfiguration(data: {
    companyId: string;
    configCode: string;
    configName: string;
    provider?: string;
    host?: string;
    port?: number;
    secure?: boolean;
    username?: string;
    password?: string;
    apiKey?: string;
    fromName: string;
    fromEmail: string;
    replyTo?: string;
    isDefault?: boolean;
  }) {
    return this.prisma.emailConfiguration.create({
      data: {
        configCode: data.configCode,
        configName: data.configName,
        provider: data.provider || 'smtp',
        host: data.host,
        port: data.port,
        secure: data.secure ?? true,
        username: data.username,
        password: data.password,
        apiKey: data.apiKey,
        fromName: data.fromName,
        fromEmail: data.fromEmail,
        replyTo: data.replyTo,
        isDefault: data.isDefault || false,
        companyId: data.companyId,
      },
    });
  }

  // ============================================
  // INTEGRATIONS
  // ============================================

  async getIntegrations(params: {
    companyId: string;
    integrationType?: string;
    isActive?: boolean;
    isConnected?: boolean;
  }) {
    const { companyId, integrationType, isActive, isConnected } = params;

    return this.prisma.integration.findMany({
      where: {
        companyId,
        ...(integrationType && { integrationType }),
        ...(isActive !== undefined && { isActive }),
        ...(isConnected !== undefined && { isConnected }),
      },
      orderBy: { integrationName: 'asc' },
    });
  }

  async createIntegration(data: {
    companyId: string;
    integrationCode: string;
    integrationName: string;
    description?: string;
    integrationType: string;
    provider: string;
    configuration?: Prisma.InputJsonValue;
    credentials?: Prisma.InputJsonValue;
    webhookUrl?: string;
    webhookSecret?: string;
    syncFrequency?: string;
    syncDirection?: string;
    createdBy?: string;
  }) {
    return this.prisma.integration.create({
      data: {
        integrationCode: data.integrationCode,
        integrationName: data.integrationName,
        description: data.description,
        integrationType: data.integrationType,
        provider: data.provider,
        configuration: data.configuration,
        credentials: data.credentials,
        webhookUrl: data.webhookUrl,
        webhookSecret: data.webhookSecret,
        syncFrequency: data.syncFrequency,
        syncDirection: data.syncDirection || 'bidirectional',
        createdBy: data.createdBy,
        companyId: data.companyId,
      },
    });
  }

  async updateIntegrationStatus(id: string, companyId: string, isConnected: boolean) {
    return this.prisma.integration.updateMany({
      where: { id, companyId },
      data: {
        isConnected,
        connectedAt: isConnected ? new Date() : null,
      },
    });
  }

  // ============================================
  // IT ADMIN MODULE SETTINGS
  // ============================================

  async getITAdminSettings(companyId: string) {
    let settings = await this.prisma.iTAdminModuleSettings.findFirst({
      where: { companyId },
    });

    if (!settings) {
      settings = await this.prisma.iTAdminModuleSettings.create({
        data: { companyId },
      });
    }

    return settings;
  }

  async updateITAdminSettings(companyId: string, data: Partial<{
    userPrefix: string;
    groupPrefix: string;
    defaultAccessLevel: string;
    requireEmailVerification: boolean;
    defaultPasswordPolicyId: string;
    sessionTimeoutMinutes: number;
    maxConcurrentSessions: number;
    enforceIpWhitelist: boolean;
    auditRetentionDays: number;
    loginHistoryDays: number;
    changeLogEnabled: boolean;
    autoBackupEnabled: boolean;
    backupFrequency: string;
    backupRetentionDays: number;
    healthCheckInterval: number;
    alertOnHealthDegraded: boolean;
    metricsRetentionDays: number;
    maxConcurrentJobs: number;
    jobTimeoutMinutes: number;
    adminNotificationEmails: string[];
  }>) {
    const existing = await this.prisma.iTAdminModuleSettings.findFirst({
      where: { companyId },
    });

    if (existing) {
      return this.prisma.iTAdminModuleSettings.update({
        where: { id: existing.id },
        data,
      });
    }

    return this.prisma.iTAdminModuleSettings.create({
      data: {
        companyId,
        ...data,
      },
    });
  }

  // ============================================
  // ADMIN DASHBOARD
  // ============================================

  async getAdminDashboard(companyId: string) {
    const [
      totalUsers,
      activeUsers,
      totalRoles,
      totalGroups,
      recentLogins,
      securityAlerts,
      pendingJobs,
      systemHealth,
    ] = await Promise.all([
      this.prisma.user.count({ where: { companyId } }),
      this.prisma.user.count({ where: { companyId, isActive: true } }),
      this.prisma.role.count({ where: { companyId } }),
      this.prisma.userGroup.count({ where: { companyId, isActive: true } }),
      this.prisma.loginHistory.count({
        where: {
          companyId,
          loginAt: { gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
        },
      }),
      this.prisma.securityAlert.count({
        where: { companyId, status: 'new' },
      }),
      this.prisma.scheduledJob.count({
        where: { companyId, isActive: true },
      }),
      this.getLatestHealthStatus(companyId),
    ]);

    return {
      users: {
        total: totalUsers,
        active: activeUsers,
        inactive: totalUsers - activeUsers,
      },
      roles: totalRoles,
      groups: totalGroups,
      recentLogins,
      securityAlerts,
      activeJobs: pendingJobs,
      systemHealth,
    };
  }
}
