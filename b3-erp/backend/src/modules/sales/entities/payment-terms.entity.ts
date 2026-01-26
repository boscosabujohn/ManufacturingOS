import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum PaymentTermsStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('sales_payment_terms')
export class PaymentTerms {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 0 })
  dueDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  discountPercent: number;

  @Column({ type: 'int', default: 0 })
  discountDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  advancePercent: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  balancePercent: number;

  @Column({ nullable: true })
  balanceCondition: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({
    type: 'enum',
    enum: PaymentTermsStatus,
    default: PaymentTermsStatus.ACTIVE,
  })
  status: PaymentTermsStatus;

  @Column({ default: true })
  isSystem: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
