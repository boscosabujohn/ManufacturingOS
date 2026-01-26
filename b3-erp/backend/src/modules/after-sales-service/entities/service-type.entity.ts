import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ServiceTypeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('after_sales_service_types')
export class ServiceType {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defaultDurationHours: number;

  @Column({ nullable: true })
  icon: string;

  @Column({ length: 20, nullable: true })
  color: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: false })
  requiresEquipment: boolean;

  @Column({ default: false })
  requiresWarrantyCheck: boolean;

  @Column({ default: true })
  billable: boolean;

  @Column({
    type: 'enum',
    enum: ServiceTypeStatus,
    default: ServiceTypeStatus.ACTIVE,
  })
  status: ServiceTypeStatus;

  @Column({ default: true })
  isSystem: boolean;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
