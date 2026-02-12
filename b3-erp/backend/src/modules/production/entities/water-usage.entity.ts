import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WaterSource = 'municipal' | 'groundwater' | 'rainwater' | 'recycled' | 'surface_water' | 'other';
export type WaterUseType = 'process' | 'cooling' | 'cleaning' | 'sanitary' | 'landscape' | 'other';

@Entity('water_usages')
export class WaterUsage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  recordDate: Date;

  @Column({ type: 'varchar', length: 50 })
  waterSource: WaterSource;

  @Column({ type: 'varchar', length: 50 })
  useType: WaterUseType;

  @Column({ type: 'varchar', nullable: true })
  zoneId: string;

  @Column({ type: 'varchar', nullable: true })
  zoneName: string;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  consumptionAmount: number;

  @Column({ type: 'varchar', length: 20, default: 'gallons' })
  consumptionUnit: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  recycledAmount: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  recyclingRate: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  dischargeAmount: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cost: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  qualityMetrics: {
    ph: number;
    tds: number;
    bod: number;
    cod: number;
    tss: number;
  };

  @Column({ type: 'jsonb', nullable: true })
  leakDetection: {
    detected: boolean;
    location: string;
    estimatedLoss: number;
    status: 'identified' | 'in_repair' | 'resolved';
  }[];

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  targetConsumption: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  efficiencyRate: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  isCompliant: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
