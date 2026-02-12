import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Shift } from './shift.entity';
import { ProductionLine } from './production-line.entity';

export type AssignmentStatus = 'scheduled' | 'active' | 'completed' | 'absent' | 'cancelled';

@Entity('production_shift_assignments')
export class ShiftAssignment {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'shift_id' })
  shiftId: string;

  @ManyToOne(() => Shift)
  @JoinColumn({ name: 'shift_id' })
  shift: Shift;

  @Column({ name: 'production_line_id', type: 'varchar', nullable: true })
  productionLineId: string | null;

  @ManyToOne(() => ProductionLine, { nullable: true })
  @JoinColumn({ name: 'production_line_id' })
  productionLine: ProductionLine;

  @Column({ name: 'work_center_id', type: 'varchar', nullable: true })
  workCenterId: string | null;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'employee_name' })
  employeeName: string;

  @Column({ name: 'assignment_date', type: 'date' })
  assignmentDate: Date;

  @Column({ type: 'varchar', length: 20, default: 'scheduled' })
  status: AssignmentStatus;

  @Column({ type: 'varchar', length: 50 })
  role: string;

  @Column({ name: 'is_supervisor', type: 'boolean', default: false })
  isSupervisor: boolean;

  @Column({ name: 'scheduled_start', type: 'timestamp' })
  scheduledStart: Date;

  @Column({ name: 'scheduled_end', type: 'timestamp' })
  scheduledEnd: Date;

  @Column({ name: 'actual_start', type: 'timestamp', nullable: true })
  actualStart: Date | null;

  @Column({ name: 'actual_end', type: 'timestamp', nullable: true })
  actualEnd: Date | null;

  @Column({ name: 'planned_hours', type: 'decimal', precision: 4, scale: 2 })
  plannedHours: number;

  @Column({ name: 'actual_hours', type: 'decimal', precision: 4, scale: 2, nullable: true })
  actualHours: number | null;

  @Column({ name: 'overtime_hours', type: 'decimal', precision: 4, scale: 2, default: 0 })
  overtimeHours: number;

  @Column({ name: 'break_duration_minutes', type: 'int', default: 0 })
  breakDurationMinutes: number;

  @Column({ type: 'jsonb', nullable: true })
  timeEntries: {
    clockIn: string;
    clockOut: string;
    type: 'regular' | 'break' | 'overtime';
    notes: string;
  }[] | null;

  @Column({ name: 'is_overtime', type: 'boolean', default: false })
  isOvertime: boolean;

  @Column({ name: 'absence_reason', type: 'text', nullable: true })
  absenceReason: string | null;

  @Column({ type: 'text', nullable: true })
  notes: string | null;

  @Column({ name: 'assigned_by' })
  assignedBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
