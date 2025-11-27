import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { AuditLog, AuditAction } from '../entities/audit-log.entity';
import { CreateAuditLogDto } from '../dto/create-audit-log.dto';
import { AuditLogQueryDto } from '../dto/audit-log-query.dto';

@Injectable()
export class AuditLogService {
  constructor(
    @InjectRepository(AuditLog)
    private readonly repository: Repository<AuditLog>,
  ) { }

  async log(createDto: CreateAuditLogDto | any): Promise<AuditLog> {
    const log = this.repository.create(createDto as CreateAuditLogDto);
    return await this.repository.save(log);
  }

  async findAll(query: AuditLogQueryDto): Promise<{
    data: AuditLog[];
    total: number;
    page: number;
    limit: number;
    pages: number;
  }> {
    const page = query.page || 1;
    const limit = query.limit || 50;
    const skip = (page - 1) * limit;

    const queryBuilder = this.repository.createQueryBuilder('log');

    if (query.userId) {
      queryBuilder.andWhere('log.userId = :userId', { userId: query.userId });
    }

    if (query.module) {
      queryBuilder.andWhere('log.module = :module', { module: query.module });
    }

    if (query.action) {
      queryBuilder.andWhere('log.action = :action', { action: query.action });
    }

    if (query.entityType) {
      queryBuilder.andWhere('log.entityType = :entityType', {
        entityType: query.entityType,
      });
    }

    if (query.entityId) {
      queryBuilder.andWhere('log.entityId = :entityId', {
        entityId: query.entityId,
      });
    }

    if (query.severity) {
      queryBuilder.andWhere('log.severity = :severity', {
        severity: query.severity,
      });
    }

    if (query.startDate && query.endDate) {
      queryBuilder.andWhere('log.createdAt BETWEEN :startDate AND :endDate', {
        startDate: new Date(query.startDate),
        endDate: new Date(query.endDate),
      });
    } else if (query.startDate) {
      queryBuilder.andWhere('log.createdAt >= :startDate', {
        startDate: new Date(query.startDate),
      });
    } else if (query.endDate) {
      queryBuilder.andWhere('log.createdAt <= :endDate', {
        endDate: new Date(query.endDate),
      });
    }

    const [data, total] = await queryBuilder
      .orderBy('log.createdAt', 'DESC')
      .skip(skip)
      .take(limit)
      .getManyAndCount();

    return {
      data,
      total,
      page,
      limit,
      pages: Math.ceil(total / limit),
    };
  }

  async getUserActivity(
    userId: string,
    days: number = 30,
  ): Promise<AuditLog[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.repository.find({
      where: {
        userId,
        createdAt: Between(startDate, new Date()),
      },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async getLoginHistory(
    userId: string,
    limit: number = 20,
  ): Promise<AuditLog[]> {
    return await this.repository.find({
      where: {
        userId,
        action: AuditAction.LOGIN,
      },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  async getModuleActivity(
    module: string,
    days: number = 7,
  ): Promise<AuditLog[]> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    return await this.repository.find({
      where: {
        module,
        createdAt: Between(startDate, new Date()),
      },
      order: { createdAt: 'DESC' },
      take: 100,
    });
  }

  async getEntityHistory(
    entityType: string,
    entityId: string,
  ): Promise<AuditLog[]> {
    return await this.repository.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
    });
  }

  async getStatistics(days: number = 30): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const totalLogs = await this.repository.count({
      where: {
        createdAt: Between(startDate, new Date()),
      },
    });

    const byModule = await this.repository
      .createQueryBuilder('log')
      .select('log.module', 'module')
      .addSelect('COUNT(*)', 'count')
      .where('log.createdAt >= :startDate', { startDate })
      .groupBy('log.module')
      .orderBy('count', 'DESC')
      .getRawMany();

    const byAction = await this.repository
      .createQueryBuilder('log')
      .select('log.action', 'action')
      .addSelect('COUNT(*)', 'count')
      .where('log.createdAt >= :startDate', { startDate })
      .groupBy('log.action')
      .orderBy('count', 'DESC')
      .getRawMany();

    const bySeverity = await this.repository
      .createQueryBuilder('log')
      .select('log.severity', 'severity')
      .addSelect('COUNT(*)', 'count')
      .where('log.createdAt >= :startDate', { startDate })
      .groupBy('log.severity')
      .orderBy('count', 'DESC')
      .getRawMany();

    return {
      totalLogs,
      byModule,
      byAction,
      bySeverity,
      period: `Last ${days} days`,
    };
  }
}
