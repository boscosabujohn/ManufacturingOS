import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';

export enum PeriodType {
  MONTH = 'Month',
  QUARTER = 'Quarter',
  HALF_YEAR = 'Half Year',
  YEAR = 'Year',
}

export enum PeriodStatus {
  OPEN = 'Open',
  CLOSED = 'Closed',
  LOCKED = 'Locked',
}

@Entity('financial_years')
export class FinancialYear {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  yearCode: string; // e.g., "FY2024-25"

  @Column({ length: 100 })
  yearName: string; // e.g., "Financial Year 2024-2025"

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: PeriodStatus,
    default: PeriodStatus.OPEN,
  })
  status: PeriodStatus;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  closedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => FinancialPeriod, (period) => period.financialYear)
  periods: FinancialPeriod[];
}

@Entity('financial_periods')
export class FinancialPeriod {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  financialYearId: string;

  @ManyToOne(() => FinancialYear, (year) => year.periods, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'financialYearId' })
  financialYear: FinancialYear;

  @Column({ length: 50, unique: true })
  periodCode: string; // e.g., "FY2024-P01", "FY2024-Q1"

  @Column({ length: 100 })
  periodName: string; // e.g., "April 2024", "Q1 2024"

  @Column({
    type: 'enum',
    enum: PeriodType,
  })
  periodType: PeriodType;

  @Column({ type: 'int' })
  periodNumber: number; // 1-12 for months, 1-4 for quarters

  @Column({ type: 'date' })
  startDate: Date;

  @Column({ type: 'date' })
  endDate: Date;

  @Column({
    type: 'enum',
    enum: PeriodStatus,
    default: PeriodStatus.OPEN,
  })
  status: PeriodStatus;

  @Column({ default: false })
  isCurrent: boolean;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  closedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  closedAt: Date;

  @Column({ nullable: true })
  openedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  openedAt: Date;

  // Period-end closing checklist
  @Column({ type: 'json', nullable: true })
  closingChecklist: {
    taskName: string;
    completed: boolean;
    completedBy?: string;
    completedAt?: Date;
  }[];

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
