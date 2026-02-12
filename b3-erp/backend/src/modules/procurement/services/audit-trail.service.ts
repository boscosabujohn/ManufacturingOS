import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, In } from 'typeorm';
import {
  AuditTrail,
  AuditAction,
  AuditEntityType,
} from '../entities/audit-trail.entity';

export interface CreateAuditEntryDto {
  companyId: string;
  entityType: AuditEntityType;
  entityId: string;
  entityNumber?: string;
  action: AuditAction;
  actionDescription: string;
  userId: string;
  userName: string;
  userEmail?: string;
  userRole?: string;
  previousValues?: Record<string, any>;
  newValues?: Record<string, any>;
  changedFields?: string[];
  previousStatus?: string;
  newStatus?: string;
  comments?: string;
  metadata?: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    source?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    relatedEntityNumber?: string;
  };
}

export interface AuditTrailFilter {
  companyId: string;
  entityType?: AuditEntityType;
  entityId?: string;
  action?: AuditAction;
  userId?: string;
  fromDate?: Date;
  toDate?: Date;
  page?: number;
  limit?: number;
}

@Injectable()
export class AuditTrailService {
  constructor(
    @InjectRepository(AuditTrail)
    private readonly auditTrailRepo: Repository<AuditTrail>,
  ) {}

  async createAuditEntry(dto: CreateAuditEntryDto): Promise<AuditTrail> {
    const entry = this.auditTrailRepo.create(dto);
    return this.auditTrailRepo.save(entry);
  }

  async logCreate(
    companyId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityNumber: string,
    userId: string,
    userName: string,
    newValues: Record<string, any>,
    comments?: string,
  ): Promise<AuditTrail> {
    return this.createAuditEntry({
      companyId,
      entityType,
      entityId,
      entityNumber,
      action: AuditAction.CREATE,
      actionDescription: `Created ${entityType} ${entityNumber}`,
      userId,
      userName,
      newValues,
      comments,
    });
  }

  async logUpdate(
    companyId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityNumber: string,
    userId: string,
    userName: string,
    previousValues: Record<string, any>,
    newValues: Record<string, any>,
    changedFields: string[],
    comments?: string,
  ): Promise<AuditTrail> {
    return this.createAuditEntry({
      companyId,
      entityType,
      entityId,
      entityNumber,
      action: AuditAction.UPDATE,
      actionDescription: `Updated ${entityType} ${entityNumber}: ${changedFields.join(', ')}`,
      userId,
      userName,
      previousValues,
      newValues,
      changedFields,
      comments,
    });
  }

  async logStatusChange(
    companyId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityNumber: string,
    userId: string,
    userName: string,
    previousStatus: string,
    newStatus: string,
    comments?: string,
  ): Promise<AuditTrail> {
    return this.createAuditEntry({
      companyId,
      entityType,
      entityId,
      entityNumber,
      action: AuditAction.STATUS_CHANGE,
      actionDescription: `Changed status from ${previousStatus} to ${newStatus}`,
      userId,
      userName,
      previousStatus,
      newStatus,
      comments,
    });
  }

  async logApproval(
    companyId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityNumber: string,
    userId: string,
    userName: string,
    comments?: string,
  ): Promise<AuditTrail> {
    return this.createAuditEntry({
      companyId,
      entityType,
      entityId,
      entityNumber,
      action: AuditAction.APPROVAL,
      actionDescription: `Approved ${entityType} ${entityNumber}`,
      userId,
      userName,
      comments,
    });
  }

  async logRejection(
    companyId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityNumber: string,
    userId: string,
    userName: string,
    comments?: string,
  ): Promise<AuditTrail> {
    return this.createAuditEntry({
      companyId,
      entityType,
      entityId,
      entityNumber,
      action: AuditAction.REJECTION,
      actionDescription: `Rejected ${entityType} ${entityNumber}`,
      userId,
      userName,
      comments,
    });
  }

  async logAward(
    companyId: string,
    entityType: AuditEntityType,
    entityId: string,
    entityNumber: string,
    userId: string,
    userName: string,
    vendorName: string,
    amount: number,
    comments?: string,
  ): Promise<AuditTrail> {
    return this.createAuditEntry({
      companyId,
      entityType,
      entityId,
      entityNumber,
      action: AuditAction.AWARD,
      actionDescription: `Awarded ${entityType} ${entityNumber} to ${vendorName} for ${amount}`,
      userId,
      userName,
      newValues: { vendorName, amount },
      comments,
    });
  }

  async getAuditTrail(filter: AuditTrailFilter): Promise<{
    data: AuditTrail[];
    total: number;
    page: number;
    limit: number;
  }> {
    const { companyId, entityType, entityId, action, userId, fromDate, toDate, page = 1, limit = 50 } = filter;

    const queryBuilder = this.auditTrailRepo
      .createQueryBuilder('audit')
      .where('audit.companyId = :companyId', { companyId });

    if (entityType) {
      queryBuilder.andWhere('audit.entityType = :entityType', { entityType });
    }

    if (entityId) {
      queryBuilder.andWhere('audit.entityId = :entityId', { entityId });
    }

    if (action) {
      queryBuilder.andWhere('audit.action = :action', { action });
    }

    if (userId) {
      queryBuilder.andWhere('audit.userId = :userId', { userId });
    }

    if (fromDate && toDate) {
      queryBuilder.andWhere('audit.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      });
    }

    queryBuilder
      .orderBy('audit.createdAt', 'DESC')
      .skip((page - 1) * limit)
      .take(limit);

    const [data, total] = await queryBuilder.getManyAndCount();

    return { data, total, page, limit };
  }

  async getEntityHistory(
    companyId: string,
    entityType: AuditEntityType,
    entityId: string,
  ): Promise<AuditTrail[]> {
    return this.auditTrailRepo.find({
      where: { companyId, entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  async getUserActivity(
    companyId: string,
    userId: string,
    fromDate?: Date,
    toDate?: Date,
  ): Promise<AuditTrail[]> {
    const where: any = { companyId, userId };

    if (fromDate && toDate) {
      where.createdAt = Between(fromDate, toDate);
    }

    return this.auditTrailRepo.find({
      where,
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async getAuditSummary(
    companyId: string,
    fromDate: Date,
    toDate: Date,
  ): Promise<{
    totalActions: number;
    byAction: Record<string, number>;
    byEntityType: Record<string, number>;
    byUser: { userId: string; userName: string; count: number }[];
  }> {
    const entries = await this.auditTrailRepo.find({
      where: {
        companyId,
        createdAt: Between(fromDate, toDate),
      },
    });

    const byAction: Record<string, number> = {};
    const byEntityType: Record<string, number> = {};
    const userMap: Map<string, { userName: string; count: number }> = new Map();

    entries.forEach((entry) => {
      byAction[entry.action] = (byAction[entry.action] || 0) + 1;
      byEntityType[entry.entityType] = (byEntityType[entry.entityType] || 0) + 1;

      const userData = userMap.get(entry.userId) || { userName: entry.userName, count: 0 };
      userData.count++;
      userMap.set(entry.userId, userData);
    });

    const byUser = Array.from(userMap.entries())
      .map(([userId, data]) => ({ userId, userName: data.userName, count: data.count }))
      .sort((a, b) => b.count - a.count);

    return {
      totalActions: entries.length,
      byAction,
      byEntityType,
      byUser,
    };
  }
}
