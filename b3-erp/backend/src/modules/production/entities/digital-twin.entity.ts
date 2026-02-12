import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type DigitalTwinType = 'machine' | 'production_line' | 'work_center' | 'factory';
export type TwinStatus = 'connected' | 'disconnected' | 'syncing' | 'error';

@Entity('production_digital_twins')
export class DigitalTwin {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'twin_type', type: 'varchar', length: 20 })
  twinType: DigitalTwinType;

  @Column({ type: 'varchar', length: 20, default: 'disconnected' })
  status: TwinStatus;

  @Column({ name: 'physical_asset_id' })
  physicalAssetId: string;

  @Column({ name: 'physical_asset_name' })
  physicalAssetName: string;

  @Column({ name: 'last_sync_at', type: 'timestamp', nullable: true })
  lastSyncAt: Date | null;

  @Column({ name: 'sync_interval_seconds', type: 'int', default: 60 })
  syncIntervalSeconds: number;

  @Column({ type: 'jsonb', nullable: true })
  currentState: {
    operationalStatus: string;
    temperature: number;
    vibration: number;
    powerConsumption: number;
    cycleTime: number;
    outputRate: number;
    errorCodes: string[];
    alerts: string[];
    lastUpdate: string;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  sensors: {
    sensorId: string;
    sensorType: string;
    name: string;
    unit: string;
    currentValue: number;
    minThreshold: number;
    maxThreshold: number;
    isActive: boolean;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  actuators: {
    actuatorId: string;
    actuatorType: string;
    name: string;
    currentState: string;
    isControllable: boolean;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  model3D: {
    fileUrl: string;
    fileType: string;
    version: string;
    scale: { x: number; y: number; z: number };
    position: { x: number; y: number; z: number };
    rotation: { x: number; y: number; z: number };
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  performanceMetrics: {
    oee: number;
    availability: number;
    performance: number;
    quality: number;
    mtbf: number;
    mttr: number;
    utilizationRate: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  predictiveInsights: {
    type: string;
    prediction: string;
    probability: number;
    recommendedAction: string;
    estimatedImpact: string;
    generatedAt: string;
  }[] | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
