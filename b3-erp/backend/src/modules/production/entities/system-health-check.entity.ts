import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type HealthCheckStatus = 'healthy' | 'degraded' | 'unhealthy' | 'unknown';
export type ComponentType = 'database' | 'api' | 'integration' | 'service' | 'hardware' | 'network';

@Entity('production_system_health_checks')
export class SystemHealthCheck {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'check_number', unique: true })
  checkNumber: string;

  @Column({ name: 'check_timestamp', type: 'timestamp' })
  checkTimestamp: Date;

  @Column({ name: 'overall_status', type: 'varchar', length: 20 })
  overallStatus: HealthCheckStatus;

  @Column({ name: 'overall_health_score', type: 'decimal', precision: 5, scale: 2 })
  overallHealthScore: number;

  @Column({ type: 'jsonb', nullable: true })
  componentStatuses: {
    componentId: string;
    componentName: string;
    componentType: ComponentType;
    status: HealthCheckStatus;
    healthScore: number;
    responseTime: number;
    lastError: string | null;
    metrics: Record<string, number>;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  databaseHealth: {
    connectionPool: { active: number; idle: number; max: number };
    queryPerformance: { avgResponseTime: number; slowQueries: number };
    diskUsage: { used: number; total: number; percentage: number };
    replicationStatus: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  apiHealth: {
    endpoint: string;
    status: string;
    responseTime: number;
    errorRate: number;
    requestsPerMinute: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  integrationHealth: {
    integrationId: string;
    integrationName: string;
    status: string;
    lastSync: string;
    pendingItems: number;
    errorCount: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  resourceUsage: {
    cpu: { usage: number; cores: number };
    memory: { used: number; total: number; percentage: number };
    disk: { used: number; total: number; percentage: number };
    network: { inbound: number; outbound: number };
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  performanceMetrics: {
    metric: string;
    currentValue: number;
    threshold: number;
    status: string;
    trend: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  activeAlerts: {
    alertId: string;
    severity: string;
    component: string;
    message: string;
    triggeredAt: string;
    acknowledged: boolean;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  scheduledMaintenance: {
    maintenanceId: string;
    component: string;
    scheduledStart: string;
    scheduledEnd: string;
    impact: string;
  }[] | null;

  @Column({ name: 'issues_detected', type: 'int', default: 0 })
  issuesDetected: number;

  @Column({ name: 'critical_issues', type: 'int', default: 0 })
  criticalIssues: number;

  @Column({ type: 'jsonb', nullable: true })
  recommendations: {
    priority: number;
    component: string;
    recommendation: string;
    expectedImprovement: string;
  }[] | null;

  @Column({ name: 'check_duration_ms', type: 'int' })
  checkDurationMs: number;

  @Column({ name: 'initiated_by' })
  initiatedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
