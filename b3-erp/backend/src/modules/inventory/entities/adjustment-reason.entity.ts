import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum AdjustmentReasonType {
  POSITIVE = 'Positive',
  NEGATIVE = 'Negative',
  BOTH = 'Both',
}

export enum AdjustmentReasonStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('adjustment_reasons')
export class AdjustmentReason {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 255 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: AdjustmentReasonType,
    default: AdjustmentReasonType.BOTH,
  })
  reasonType: AdjustmentReasonType;

  @Column({
    type: 'enum',
    enum: AdjustmentReasonStatus,
    default: AdjustmentReasonStatus.ACTIVE,
  })
  status: AdjustmentReasonStatus;

  // GL Account for financial posting
  @Column({ nullable: true })
  expenseAccountId: string;

  @Column({ length: 255, nullable: true })
  expenseAccountName: string;

  @Column({ nullable: true })
  incomeAccountId: string;

  @Column({ length: 255, nullable: true })
  incomeAccountName: string;

  // Approval requirements
  @Column({ default: false })
  requiresApproval: boolean;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  approvalThreshold: number; // Amount above which approval is required

  // Sorting and display
  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ length: 50, nullable: true })
  icon: string;

  @Column({ length: 20, nullable: true })
  color: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
