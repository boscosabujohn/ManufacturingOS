import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WarrantyTypeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

export enum WarrantyCoverageType {
  PARTS = 'parts',
  LABOR = 'labor',
  PARTS_LABOR = 'parts_labor',
  ALL = 'all',
}

@Entity('after_sales_warranty_types')
export class WarrantyTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int', default: 12 })
  durationMonths: number;

  @Column({
    type: 'enum',
    enum: WarrantyCoverageType,
    default: WarrantyCoverageType.PARTS_LABOR,
  })
  coverageType: WarrantyCoverageType;

  @Column({ type: 'simple-array', nullable: true })
  includedServices: string[];

  @Column({ type: 'simple-array', nullable: true })
  excludedItems: string[];

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  deductiblePercentage: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxClaimAmount: number;

  @Column({ nullable: true })
  icon: string;

  @Column({ length: 20, nullable: true })
  color: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: false })
  isExtendable: boolean;

  @Column({ default: false })
  isTransferable: boolean;

  @Column({
    type: 'enum',
    enum: WarrantyTypeStatus,
    default: WarrantyTypeStatus.ACTIVE,
  })
  status: WarrantyTypeStatus;

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
