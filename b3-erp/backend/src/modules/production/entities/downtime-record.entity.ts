import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type DowntimeStatus = 'ongoing' | 'resolved' | 'pending_analysis';
export type DowntimeType = 'planned' | 'unplanned';
export type DowntimeRecordCategory = 'breakdown' | 'setup' | 'changeover' | 'maintenance' | 'material_shortage' | 'quality_issue' | 'operator_unavailable' | 'other';

@Entity('production_downtime_records')
export class DowntimeRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'downtime_number', unique: true })
  downtimeNumber: string;

  @Column({ type: 'varchar', length: 20, default: 'ongoing' })
  status: DowntimeStatus;

  @Column({ name: 'downtime_type', type: 'varchar', length: 20 })
  downtimeType: DowntimeType;

  @Column({ type: 'varchar', length: 30 })
  category: DowntimeRecordCategory;

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

  @Column({ name: 'work_order_id', type: 'varchar', nullable: true })
  workOrderId: string | null;

  @Column({ name: 'start_time', type: 'timestamp' })
  startTime: Date;

  @Column({ name: 'end_time', type: 'timestamp', nullable: true })
  endTime: Date | null;

  @Column({ name: 'duration_minutes', type: 'decimal', precision: 10, scale: 2, nullable: true })
  durationMinutes: number | null;

  @Column({ type: 'text' })
  reason: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'root_cause', type: 'text', nullable: true })
  rootCause: string | null;

  @Column({ name: 'corrective_action', type: 'text', nullable: true })
  correctiveAction: string | null;

  @Column({ name: 'preventive_action', type: 'text', nullable: true })
  preventiveAction: string | null;

  @Column({ type: 'jsonb', nullable: true })
  impactAssessment: {
    lostProductionQuantity: number;
    lostProductionValue: number;
    affectedWorkOrders: string[];
    delayedDeliveries: number;
    laborCost: number;
    repairCost: number;
    totalCost: number;
  } | null;

  @Column({ type: 'varchar', length: 3, default: 'USD' })
  currency: string;

  @Column({ name: 'reported_by' })
  reportedBy: string;

  @Column({ name: 'resolved_by', type: 'varchar', nullable: true })
  resolvedBy: string | null;

  @Column({ name: 'shift_id', type: 'varchar', nullable: true })
  shiftId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedAt: string;
  }[] | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
