import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type EmissionScope = 'scope1' | 'scope2' | 'scope3';
export type EmissionSource = 'electricity' | 'fuel' | 'transportation' | 'manufacturing' | 'waste' | 'supply_chain' | 'other';

@Entity('carbon_footprints')
export class CarbonFootprint {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  recordDate: Date;

  @Column({ type: 'varchar', length: 20 })
  scope: EmissionScope;

  @Column({ type: 'varchar', length: 50 })
  source: EmissionSource;

  @Column({ type: 'varchar', nullable: true })
  facilityId: string;

  @Column({ type: 'varchar', nullable: true })
  facilityName: string;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  emissionAmount: number;

  @Column({ type: 'varchar', length: 20, default: 'tCO2e' })
  emissionUnit: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  targetAmount: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  reductionPercentage: number;

  @Column({ type: 'jsonb', nullable: true })
  productEmissions: {
    productId: string;
    productName: string;
    emission: number;
    unit: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  offsetData: {
    offsetAmount: number;
    offsetType: string;
    certificateId: string;
    provider: string;
  };

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'varchar', length: 20, default: 'actual' })
  dataType: 'actual' | 'estimated' | 'projected';

  @Column({ type: 'boolean', default: false })
  isVerified: boolean;

  @Column({ type: 'varchar', nullable: true })
  verifiedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  verifiedAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
