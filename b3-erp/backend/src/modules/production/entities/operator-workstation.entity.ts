import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WorkstationStatus = 'active' | 'idle' | 'maintenance' | 'offline';
export type WorkstationType = 'assembly' | 'machining' | 'inspection' | 'packaging' | 'testing';

@Entity('production_operator_workstations')
export class OperatorWorkstation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'workstation_code', unique: true })
  workstationCode: string;

  @Column({ name: 'workstation_name' })
  workstationName: string;

  @Column({ type: 'text', nullable: true })
  description: string | null;

  @Column({ name: 'workstation_type', type: 'varchar', length: 20 })
  workstationType: WorkstationType;

  @Column({ type: 'varchar', length: 20, default: 'idle' })
  status: WorkstationStatus;

  @Column({ name: 'production_line_id', type: 'varchar', nullable: true })
  productionLineId: string | null;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  location: {
    building: string;
    floor: string;
    zone: string;
    position: string;
  } | null;

  @Column({ name: 'current_operator_id', type: 'varchar', nullable: true })
  currentOperatorId: string | null;

  @Column({ name: 'current_operator_name', type: 'varchar', nullable: true })
  currentOperatorName: string | null;

  @Column({ name: 'current_shift_id', type: 'varchar', nullable: true })
  currentShiftId: string | null;

  @Column({ name: 'current_work_order_id', type: 'varchar', nullable: true })
  currentWorkOrderId: string | null;

  @Column({ name: 'current_operation_id', type: 'varchar', nullable: true })
  currentOperationId: string | null;

  @Column({ type: 'jsonb', nullable: true })
  equipmentAssigned: {
    equipmentId: string;
    equipmentName: string;
    equipmentType: string;
    status: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  toolsRequired: {
    toolId: string;
    toolName: string;
    quantity: number;
    available: boolean;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  performanceMetrics: {
    unitsProduced: number;
    targetUnits: number;
    efficiency: number;
    qualityRate: number;
    cycleTime: number;
    downtime: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  ergonomicSettings: {
    heightAdjustable: boolean;
    currentHeight: number;
    lightingLevel: number;
    temperatureZone: string;
    noiseLevel: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  safetyChecklist: {
    item: string;
    checked: boolean;
    lastChecked: string;
    checkedBy: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  workInstructions: {
    documentId: string;
    documentName: string;
    version: string;
    url: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  alerts: {
    alertType: string;
    message: string;
    severity: string;
    timestamp: string;
    acknowledged: boolean;
  }[] | null;

  @Column({ name: 'last_activity_at', type: 'timestamp', nullable: true })
  lastActivityAt: Date | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
