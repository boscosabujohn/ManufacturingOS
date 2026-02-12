import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WorkloadAssignmentStatus = 'planned' | 'assigned' | 'in_progress' | 'completed' | 'cancelled';
export type WorkloadType = 'production' | 'maintenance' | 'quality' | 'setup' | 'cleanup';
export type BalanceStatus = 'balanced' | 'overloaded' | 'underutilized';

@Entity('production_workload_assignments')
export class WorkloadAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'assignment_number', unique: true })
  assignmentNumber: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'employee_name' })
  employeeName: string;

  @Column({ name: 'assignment_date', type: 'date' })
  assignmentDate: Date;

  @Column({ name: 'shift_id', type: 'varchar', nullable: true })
  shiftId: string | null;

  @Column({ name: 'workstation_id', type: 'varchar', nullable: true })
  workstationId: string | null;

  @Column({ type: 'varchar', length: 20, default: 'planned' })
  status: WorkloadAssignmentStatus;

  @Column({ type: 'jsonb', nullable: true })
  assignedTasks: {
    taskId: string;
    taskType: WorkloadType;
    description: string;
    workOrderId: string | null;
    operationId: string | null;
    plannedStart: string;
    plannedEnd: string;
    actualStart: string | null;
    actualEnd: string | null;
    estimatedHours: number;
    actualHours: number | null;
    priority: number;
    status: string;
  }[] | null;

  @Column({ name: 'total_planned_hours', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalPlannedHours: number;

  @Column({ name: 'total_actual_hours', type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalActualHours: number;

  @Column({ name: 'available_hours', type: 'decimal', precision: 10, scale: 2, default: 8 })
  availableHours: number;

  @Column({ name: 'utilization_rate', type: 'decimal', precision: 5, scale: 2, default: 0 })
  utilizationRate: number;

  @Column({ name: 'balance_status', type: 'varchar', length: 20, default: 'balanced' })
  balanceStatus: BalanceStatus;

  @Column({ type: 'jsonb', nullable: true })
  capacityBreakdown: {
    taskType: WorkloadType;
    plannedHours: number;
    percentage: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  skillRequirements: {
    skillId: string;
    skillName: string;
    required: boolean;
    employeeLevel: string;
    matchScore: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  performanceMetrics: {
    tasksCompleted: number;
    tasksOnTime: number;
    qualityScore: number;
    efficiencyScore: number;
  } | null;

  @Column({ type: 'jsonb', nullable: true })
  breaks: {
    breakType: string;
    scheduledStart: string;
    scheduledEnd: string;
    actualStart: string | null;
    actualEnd: string | null;
    duration: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  overtimeDetails: {
    approved: boolean;
    approvedBy: string | null;
    plannedHours: number;
    actualHours: number;
    reason: string;
  } | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'assigned_by' })
  assignedBy: string;

  @Column({ name: 'approved_by', type: 'varchar', nullable: true })
  approvedBy: string | null;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
