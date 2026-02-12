import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('production_oee_records')
export class OEERecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'record_date', type: 'date' })
  recordDate: Date;

  @Column({ name: 'shift_id', type: 'varchar', nullable: true })
  shiftId: string | null;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ name: 'work_center_name', type: 'varchar', nullable: true })
  workCenterName: string | null;

  @Column({ name: 'machine_id', type: 'varchar', nullable: true })
  machineId: string | null;

  @Column({ name: 'machine_name', type: 'varchar', nullable: true })
  machineName: string | null;

  @Column({ name: 'production_line_id', type: 'varchar', nullable: true })
  productionLineId: string | null;

  @Column({ name: 'planned_production_time', type: 'decimal', precision: 10, scale: 2 })
  plannedProductionTime: number;

  @Column({ name: 'operating_time', type: 'decimal', precision: 10, scale: 2 })
  operatingTime: number;

  @Column({ name: 'net_operating_time', type: 'decimal', precision: 10, scale: 2 })
  netOperatingTime: number;

  @Column({ name: 'fully_productive_time', type: 'decimal', precision: 10, scale: 2 })
  fullyProductiveTime: number;

  @Column({ name: 'availability', type: 'decimal', precision: 5, scale: 2 })
  availability: number;

  @Column({ name: 'performance', type: 'decimal', precision: 5, scale: 2 })
  performance: number;

  @Column({ name: 'quality', type: 'decimal', precision: 5, scale: 2 })
  quality: number;

  @Column({ name: 'oee', type: 'decimal', precision: 5, scale: 2 })
  oee: number;

  @Column({ name: 'total_count', type: 'int', default: 0 })
  totalCount: number;

  @Column({ name: 'good_count', type: 'int', default: 0 })
  goodCount: number;

  @Column({ name: 'reject_count', type: 'int', default: 0 })
  rejectCount: number;

  @Column({ name: 'ideal_cycle_time', type: 'decimal', precision: 10, scale: 4, nullable: true })
  idealCycleTime: number | null;

  @Column({ name: 'actual_cycle_time', type: 'decimal', precision: 10, scale: 4, nullable: true })
  actualCycleTime: number | null;

  @Column({ type: 'jsonb', nullable: true })
  downtimeBreakdown: {
    category: string;
    duration: number;
    percentage: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  speedLossBreakdown: {
    reason: string;
    duration: number;
    percentage: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  qualityLossBreakdown: {
    defectType: string;
    count: number;
    percentage: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  sixBigLosses: {
    equipmentFailure: number;
    setupAdjustment: number;
    idlingMinorStoppages: number;
    reducedSpeed: number;
    processDefects: number;
    reducedYield: number;
  } | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'recorded_by' })
  recordedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
