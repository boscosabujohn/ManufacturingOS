import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type IntegrationStatus = 'active' | 'inactive' | 'error' | 'maintenance' | 'pending';
export type IntegrationType = 'mes' | 'scada' | 'plc' | 'erp' | 'wms' | 'qms';
export type CommunicationProtocol = 'opc_ua' | 'mqtt' | 'rest_api' | 'modbus' | 'profinet' | 'ethernet_ip';

@Entity('production_mes_integrations')
export class MESIntegration {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'integration_code', unique: true })
  integrationCode: string;

  @Column({ name: 'integration_name' })
  integrationName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'integration_type', type: 'varchar', length: 20 })
  integrationType: IntegrationType;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: IntegrationStatus;

  @Column({ name: 'system_name' })
  systemName: string;

  @Column({ name: 'system_vendor', type: 'varchar', nullable: true })
  systemVendor: string | null;

  @Column({ name: 'system_version', type: 'varchar', nullable: true })
  systemVersion: string | null;

  @Column({ type: 'varchar', length: 20 })
  protocol: CommunicationProtocol;

  @Column({ type: 'jsonb', nullable: true })
  connectionConfig: {
    host: string;
    port: number;
    secure: boolean;
    authType: string;
    credentials?: { username: string; password?: string; certificate?: string };
    timeout: number;
    retryInterval: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  dataMapping: {
    sourceField: string;
    targetField: string;
    dataType: string;
    transformation: string | null;
    required: boolean;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  syncConfig: {
    direction: 'inbound' | 'outbound' | 'bidirectional';
    frequency: string;
    batchSize: number;
    conflictResolution: string;
    enableRealtime: boolean;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  supportedOperations: {
    operation: string;
    description: string;
    enabled: boolean;
    lastUsed: string | null;
  }[] | null;

  @Column({ name: 'last_sync_at', type: 'timestamp', nullable: true })
  lastSyncAt: Date | null;

  @Column({ name: 'last_sync_status', type: 'varchar', nullable: true })
  lastSyncStatus: string | null;

  @Column({ name: 'records_synced', type: 'int', default: 0 })
  recordsSynced: number;

  @Column({ name: 'error_count', type: 'int', default: 0 })
  errorCount: number;

  @Column({ type: 'jsonb', nullable: true })
  healthMetrics: {
    uptime: number;
    averageLatency: number;
    throughput: number;
    errorRate: number;
    lastHealthCheck: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  alerts: {
    alertType: string;
    threshold: number;
    recipients: string[];
    enabled: boolean;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  logs: {
    timestamp: string;
    level: string;
    message: string;
    details: Record<string, any>;
  }[] | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'configured_by' })
  configuredBy: string;

  @Column({ name: 'last_modified_by', type: 'varchar', nullable: true })
  lastModifiedBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
