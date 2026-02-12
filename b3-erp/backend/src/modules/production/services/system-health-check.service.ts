import {
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SystemHealthCheck, HealthCheckStatus } from '../entities/system-health-check.entity';

@Injectable()
export class SystemHealthCheckService {
  constructor(
    @InjectRepository(SystemHealthCheck)
    private readonly systemHealthCheckRepository: Repository<SystemHealthCheck>,
  ) {}

  async create(createDto: Partial<SystemHealthCheck>): Promise<SystemHealthCheck> {
    const healthCheck = this.systemHealthCheckRepository.create(createDto);
    return this.systemHealthCheckRepository.save(healthCheck);
  }

  async findAll(filters?: {
    companyId?: string;
    overallStatus?: HealthCheckStatus;
  }): Promise<SystemHealthCheck[]> {
    const query = this.systemHealthCheckRepository.createQueryBuilder('check');

    if (filters?.companyId) {
      query.andWhere('check.companyId = :companyId', { companyId: filters.companyId });
    }

    if (filters?.overallStatus) {
      query.andWhere('check.overallStatus = :overallStatus', { overallStatus: filters.overallStatus });
    }

    query.orderBy('check.checkTimestamp', 'DESC');
    return query.getMany();
  }

  async findOne(id: string): Promise<SystemHealthCheck> {
    const healthCheck = await this.systemHealthCheckRepository.findOne({ where: { id } });
    if (!healthCheck) {
      throw new NotFoundException(`System Health Check with ID ${id} not found`);
    }
    return healthCheck;
  }

  async getLatest(companyId: string): Promise<SystemHealthCheck | null> {
    return this.systemHealthCheckRepository.findOne({
      where: { companyId },
      order: { checkTimestamp: 'DESC' },
    });
  }

  async runHealthCheck(companyId: string, initiatedBy: string): Promise<SystemHealthCheck> {
    const startTime = Date.now();

    // Mock health check results
    const componentStatuses = [
      { componentId: 'db-1', componentName: 'Primary Database', componentType: 'database' as const, status: 'healthy' as const, healthScore: 98, responseTime: 15, lastError: null, metrics: { connections: 45, queryTime: 12 } },
      { componentId: 'api-1', componentName: 'Production API', componentType: 'api' as const, status: 'healthy' as const, healthScore: 95, responseTime: 25, lastError: null, metrics: { requestsPerMin: 1200, errorRate: 0.1 } },
      { componentId: 'mes-1', componentName: 'MES Integration', componentType: 'integration' as const, status: 'healthy' as const, healthScore: 92, responseTime: 45, lastError: null, metrics: { syncRate: 99, pendingItems: 5 } },
    ];

    const overallHealthScore = componentStatuses.reduce((sum, c) => sum + c.healthScore, 0) / componentStatuses.length;
    const overallStatus: HealthCheckStatus = overallHealthScore >= 90 ? 'healthy' : overallHealthScore >= 70 ? 'degraded' : 'unhealthy';

    const healthCheck = this.systemHealthCheckRepository.create({
      companyId,
      checkNumber: `CHK-${Date.now()}`,
      checkTimestamp: new Date(),
      overallStatus,
      overallHealthScore,
      componentStatuses,
      databaseHealth: {
        connectionPool: { active: 45, idle: 5, max: 100 },
        queryPerformance: { avgResponseTime: 12, slowQueries: 2 },
        diskUsage: { used: 50, total: 200, percentage: 25 },
        replicationStatus: 'synchronized',
      },
      apiHealth: [
        { endpoint: '/api/production', status: 'healthy', responseTime: 25, errorRate: 0.1, requestsPerMinute: 500 },
        { endpoint: '/api/quality', status: 'healthy', responseTime: 30, errorRate: 0.2, requestsPerMinute: 200 },
      ],
      resourceUsage: {
        cpu: { usage: 35, cores: 8 },
        memory: { used: 8, total: 32, percentage: 25 },
        disk: { used: 50, total: 200, percentage: 25 },
        network: { inbound: 100, outbound: 150 },
      },
      issuesDetected: 0,
      criticalIssues: 0,
      checkDurationMs: Date.now() - startTime,
      initiatedBy,
    });

    return this.systemHealthCheckRepository.save(healthCheck);
  }

  async getHealthTrend(companyId: string, days: number = 7): Promise<any> {
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    const checks = await this.systemHealthCheckRepository
      .createQueryBuilder('check')
      .where('check.companyId = :companyId', { companyId })
      .andWhere('check.checkTimestamp >= :startDate', { startDate })
      .orderBy('check.checkTimestamp', 'ASC')
      .getMany();

    return {
      periodDays: days,
      checkCount: checks.length,
      avgHealthScore: checks.length > 0
        ? checks.reduce((sum, c) => sum + c.overallHealthScore, 0) / checks.length
        : 0,
      dataPoints: checks.map(c => ({
        timestamp: c.checkTimestamp,
        healthScore: c.overallHealthScore,
        status: c.overallStatus,
        issuesDetected: c.issuesDetected,
      })),
    };
  }
}
