import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type CapacityStatus = 'underutilized' | 'optimal' | 'strained' | 'overloaded';
export type CapacityResourceType = 'machine' | 'labor' | 'facility' | 'storage' | 'logistics';
export type FlexibilityType = 'overtime' | 'subcontract' | 'temporary_staff' | 'equipment_rental' | 'shift_addition' | 'process_optimization';

@Entity('capacity_flexibilities')
export class CapacityFlexibility {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  recordDate: Date;

  @Column({ type: 'varchar', nullable: true })
  resourceId: string;

  @Column()
  resourceName: string;

  @Column({ type: 'varchar', length: 50 })
  resourceType: CapacityResourceType;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  baseCapacity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  currentCapacity: number;

  @Column({ type: 'decimal', precision: 12, scale: 2 })
  currentDemand: number;

  @Column({ type: 'decimal', precision: 8, scale: 4 })
  utilizationRate: number;

  @Column({ type: 'varchar', length: 20 })
  status: CapacityStatus;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  surgeCapacity: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  flexibilityIndex: number;

  @Column({ type: 'jsonb', nullable: true })
  demandForecast: {
    period: string;
    forecastedDemand: number;
    capacityGap: number;
    confidence: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  flexibilityOptions: {
    type: FlexibilityType;
    additionalCapacity: number;
    leadTime: number;
    cost: number;
    availability: 'available' | 'limited' | 'unavailable';
    constraints: string[];
  }[];

  @Column({ type: 'jsonb', nullable: true })
  bottlenecks: {
    process: string;
    severity: 'minor' | 'moderate' | 'severe';
    impact: string;
    resolution: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  historicalTrend: {
    date: Date;
    utilization: number;
    demand: number;
  }[];

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
