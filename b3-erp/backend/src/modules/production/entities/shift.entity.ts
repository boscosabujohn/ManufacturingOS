import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ShiftStatus = 'active' | 'inactive';
export type ShiftType = 'day' | 'evening' | 'night' | 'rotating' | 'flexible';

@Entity('production_shifts')
export class Shift {
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

  @Column({ name: 'shift_type', type: 'varchar', length: 20 })
  shiftType: ShiftType;

  @Column({ type: 'varchar', length: 20, default: 'active' })
  status: ShiftStatus;

  @Column({ name: 'start_time', type: 'time' })
  startTime: string;

  @Column({ name: 'end_time', type: 'time' })
  endTime: string;

  @Column({ name: 'duration_hours', type: 'decimal', precision: 4, scale: 2 })
  durationHours: number;

  @Column({ type: 'jsonb', nullable: true })
  breaks: {
    name: string;
    startTime: string;
    endTime: string;
    durationMinutes: number;
    isPaid: boolean;
  }[] | null;

  @Column({ name: 'total_break_minutes', type: 'int', default: 0 })
  totalBreakMinutes: number;

  @Column({ name: 'effective_hours', type: 'decimal', precision: 4, scale: 2 })
  effectiveHours: number;

  @Column({ type: 'jsonb', nullable: true })
  workingDays: {
    dayOfWeek: number;
    dayName: string;
    isWorking: boolean;
  }[] | null;

  @Column({ name: 'overtime_multiplier', type: 'decimal', precision: 3, scale: 2, default: 1.5 })
  overtimeMultiplier: number;

  @Column({ name: 'night_shift_premium', type: 'decimal', precision: 3, scale: 2, default: 1.0 })
  nightShiftPremium: number;

  @Column({ type: 'jsonb', nullable: true })
  rotationPattern: {
    weekNumber: number;
    shiftId: string;
    shiftName: string;
  }[] | null;

  @Column({ name: 'min_staff', type: 'int', default: 1 })
  minStaff: number;

  @Column({ name: 'max_staff', type: 'int', nullable: true })
  maxStaff: number | null;

  @Column({ name: 'supervisor_required', type: 'boolean', default: true })
  supervisorRequired: boolean;

  @Column({ type: 'jsonb', nullable: true })
  requiredSkills: {
    skillId: string;
    skillName: string;
    minimumLevel: number;
    count: number;
  }[] | null;

  @Column({ name: 'color_code', type: 'varchar', nullable: true })
  colorCode: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @Column({ name: 'created_by' })
  createdBy: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
