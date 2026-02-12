import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';
export type RiskCategory = 'supply' | 'demand' | 'operational' | 'financial' | 'geopolitical' | 'environmental' | 'cyber';
export type SourceType = 'single' | 'dual' | 'multi';
export type StockStatus = 'adequate' | 'low' | 'critical' | 'stockout';

@Entity('supply_chain_risks')
export class SupplyChainRisk {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  riskName: string;

  @Column({ type: 'varchar', length: 50 })
  category: RiskCategory;

  @Column({ type: 'varchar', length: 20 })
  riskLevel: RiskLevel;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  probabilityScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  impactScore: number;

  @Column({ type: 'decimal', precision: 5, scale: 2 })
  overallRiskScore: number;

  @Column({ type: 'varchar', nullable: true })
  supplierId: string;

  @Column({ type: 'varchar', nullable: true })
  supplierName: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  sourceType: SourceType;

  @Column({ type: 'jsonb', nullable: true })
  affectedItems: {
    itemId: string;
    itemName: string;
    stockStatus: StockStatus;
    daysOfSupply: number;
    bufferStock: number;
    reorderPoint: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  alternateSuppliers: {
    supplierId: string;
    supplierName: string;
    leadTime: number;
    qualificationStatus: 'qualified' | 'pending' | 'not_qualified';
    priceVariance: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  mitigationActions: {
    action: string;
    owner: string;
    dueDate: Date;
    status: 'pending' | 'in_progress' | 'completed';
    effectiveness: string;
  }[];

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'date', nullable: true })
  identifiedDate: Date;

  @Column({ type: 'date', nullable: true })
  reviewDate: Date;

  @Column({ type: 'varchar', length: 20, default: 'open' })
  status: 'open' | 'monitoring' | 'mitigated' | 'closed';

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
