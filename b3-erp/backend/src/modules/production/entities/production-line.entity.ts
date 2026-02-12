import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProductionLineStatus = 'active' | 'inactive' | 'maintenance' | 'setup';
export type ProductionLineType = 'assembly' | 'machining' | 'fabrication' | 'packaging' | 'mixed';

@Entity('production_lines')
export class ProductionLine {
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

  @Column({ name: 'line_type', type: 'varchar', length: 20 })
  lineType: ProductionLineType;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: ProductionLineStatus;

  @Column({ name: 'location', type: 'varchar', nullable: true })
  location: string | null;

  @Column({ name: 'building', type: 'varchar', nullable: true })
  building: string | null;

  @Column({ name: 'floor', type: 'varchar', nullable: true })
  floor: string | null;

  @Column({ name: 'capacity_per_hour', type: 'decimal', precision: 15, scale: 4 })
  capacityPerHour: number;

  @Column({ name: 'capacity_uom' })
  capacityUom: string;

  @Column({ name: 'standard_cycle_time', type: 'decimal', precision: 10, scale: 4, nullable: true })
  standardCycleTime: number | null;

  @Column({ name: 'takt_time', type: 'decimal', precision: 10, scale: 4, nullable: true })
  taktTime: number | null;

  @Column({ type: 'jsonb', nullable: true })
  workCenters: {
    workCenterId: string;
    workCenterCode: string;
    workCenterName: string;
    sequence: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  operators: {
    operatorId: string;
    operatorName: string;
    role: string;
    shiftId: string;
  }[] | null;

  @Column({ name: 'min_operators', type: 'int', default: 1 })
  minOperators: number;

  @Column({ name: 'max_operators', type: 'int', nullable: true })
  maxOperators: number | null;

  @Column({ type: 'jsonb', nullable: true })
  operatingHours: {
    dayOfWeek: number;
    startTime: string;
    endTime: string;
    breakDuration: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  capabilities: {
    productTypes: string[];
    maxDimensions: { length: number; width: number; height: number };
    maxWeight: number;
    specialFeatures: string[];
  } | null;

  @Column({ name: 'oee_target', type: 'decimal', precision: 5, scale: 2, default: 85 })
  oeeTarget: number;

  @Column({ name: 'current_oee', type: 'decimal', precision: 5, scale: 2, nullable: true })
  currentOee: number | null;

  @Column({ name: 'cost_per_hour', type: 'decimal', precision: 10, scale: 2, nullable: true })
  costPerHour: number | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'supervisor_id', type: 'varchar', nullable: true })
  supervisorId: string | null;

  @Column({ name: 'supervisor_name', type: 'varchar', nullable: true })
  supervisorName: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
