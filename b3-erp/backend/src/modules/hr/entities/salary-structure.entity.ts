import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ComponentType {
  EARNING = 'Earning',
  DEDUCTION = 'Deduction',
  CONTRIBUTION = 'Contribution',
}

export enum CalculationType {
  FIXED_AMOUNT = 'Fixed Amount',
  PERCENTAGE_OF_BASIC = 'Percentage of Basic',
  PERCENTAGE_OF_GROSS = 'Percentage of Gross',
  PERCENTAGE_OF_CTC = 'Percentage of CTC',
  FORMULA = 'Formula',
}

export enum SalaryStructureStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('hr_salary_structures')
export class SalaryStructure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date' })
  effectiveFrom: Date;

  @Column({ type: 'date', nullable: true })
  effectiveTo: Date;

  @Column({ type: 'simple-array', nullable: true })
  applicableDesignations: string[];

  @Column({ type: 'simple-array', nullable: true })
  applicableDepartments: string[];

  @Column({ type: 'simple-array', nullable: true })
  applicableEmployeeTypes: string[];

  @Column({ type: 'json' })
  components: Array<{
    id: string;
    name: string;
    code: string;
    type: ComponentType;
    calculationType: CalculationType;
    value: number;
    isStatutory: boolean;
    isTaxable: boolean;
    isPFApplicable: boolean;
    isESIApplicable: boolean;
    isGratuityApplicable: boolean;
    formula: string;
    displayOrder: number;
    isActive: boolean;
  }>;

  @Column({ default: true })
  isPFApplicable: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 12 })
  pfEmployeeRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 12 })
  pfEmployerRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  pfCeiling: number;

  @Column({ default: true })
  isESIApplicable: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0.75 })
  esiEmployeeRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 3.25 })
  esiEmployerRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  esiCeiling: number;

  @Column({ default: true })
  isGratuityApplicable: boolean;

  @Column({ default: true })
  isPTApplicable: boolean;

  @Column({ default: true })
  isLWFApplicable: boolean;

  @Column({
    type: 'enum',
    enum: SalaryStructureStatus,
    default: SalaryStructureStatus.ACTIVE,
  })
  status: SalaryStructureStatus;

  @Column({ type: 'json', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
