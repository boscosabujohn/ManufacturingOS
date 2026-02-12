import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ResourceRateType {
  MATERIAL = 'Material',
  LABOR = 'Labor',
  EQUIPMENT = 'Equipment',
  SUBCONTRACTOR = 'Subcontractor',
}

export enum RateUnit {
  EACH = 'Each',
  PIECE = 'Piece',
  KG = 'Kilogram',
  TON = 'Ton',
  METER = 'Meter',
  SQ_METER = 'Square Meter',
  CU_METER = 'Cubic Meter',
  HOUR = 'Hour',
  DAY = 'Day',
  WEEK = 'Week',
  MONTH = 'Month',
  LUMP_SUM = 'Lump Sum',
  LITER = 'Liter',
  GALLON = 'Gallon',
}

@Entity('estimation_resource_rates')
export class ResourceRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ResourceRateType,
  })
  rateType: ResourceRateType;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  subCategory: string;

  @Column({
    type: 'enum',
    enum: RateUnit,
    default: RateUnit.EACH,
  })
  unit: RateUnit;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 4 })
  standardRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  minimumRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  maximumRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  overtimeRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  overtimeMultiplier: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveUntil: Date;

  @Column({ type: 'json', nullable: true })
  priceBreaks: {
    minQuantity: number;
    maxQuantity: number;
    rate: number;
    discountPercentage: number;
  }[];

  @Column({ type: 'json', nullable: true })
  regionalRates: {
    region: string;
    rate: number;
  }[];

  @Column({ type: 'varchar', nullable: true })
  supplierId: string;

  @Column({ type: 'varchar', nullable: true })
  supplierName: string;

  @Column({ type: 'text', nullable: true })
  specifications: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @Column({ type: 'varchar', nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_material_rate_cards')
export class MaterialRateCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveUntil: Date;

  @Column({ type: 'varchar', nullable: true })
  supplierId: string;

  @Column({ type: 'varchar', nullable: true })
  supplierName: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  items: {
    resourceRateId: string;
    code: string;
    name: string;
    unit: string;
    rate: number;
    category: string;
  }[];

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_labor_rate_cards')
export class LaborRateCard {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ type: 'date', nullable: true })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveUntil: Date;

  @Column({ type: 'varchar', nullable: true })
  region: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'json', nullable: true })
  roles: {
    roleId: string;
    roleName: string;
    skillLevel: string;
    hourlyRate: number;
    dailyRate: number;
    overtimeRate: number;
    benefits: number;
    totalHourlyRate: number;
  }[];

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_equipment_rates')
export class EquipmentRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', nullable: true })
  category: string;

  @Column({ type: 'varchar', nullable: true })
  manufacturer: string;

  @Column({ type: 'varchar', nullable: true })
  model: string;

  @Column({ default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2 })
  dailyRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  weeklyRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  monthlyRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  fuelCostPerHour: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  operatorCostPerHour: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maintenanceCostPerHour: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  mobilizationCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  demobilizationCost: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ type: 'varchar', nullable: true })
  supplierId: string;

  @Column({ type: 'varchar', nullable: true })
  supplierName: string;

  @Column({ type: 'text', nullable: true })
  specifications: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}

@Entity('estimation_subcontractor_rates')
export class SubcontractorRate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  subcontractorId: string;

  @Column()
  subcontractorName: string;

  @Column({ type: 'varchar', nullable: true })
  contactPerson: string;

  @Column({ type: 'varchar', nullable: true })
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'json' })
  services: {
    serviceId: string;
    serviceName: string;
    description: string;
    unit: string;
    rate: number;
    minimumCharge: number;
    leadTime: string;
  }[];

  @Column({ type: 'json', nullable: true })
  certifications: {
    name: string;
    issuedBy: string;
    validUntil: string;
  }[];

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  performanceRating: number;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isPreferred: boolean;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', nullable: true })
  createdBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
