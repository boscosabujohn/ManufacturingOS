import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type WasteType = 'hazardous' | 'non_hazardous' | 'recyclable' | 'organic' | 'electronic' | 'construction' | 'other';
export type DisposalMethod = 'recycled' | 'landfill' | 'incinerated' | 'composted' | 'reused' | 'treated' | 'other';

@Entity('waste_records')
export class WasteRecord {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  recordDate: Date;

  @Column({ type: 'varchar', length: 50 })
  wasteType: WasteType;

  @Column({ type: 'varchar', length: 50 })
  disposalMethod: DisposalMethod;

  @Column({ type: 'varchar', nullable: true })
  sourceAreaId: string;

  @Column({ type: 'varchar', nullable: true })
  sourceAreaName: string;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  wasteAmount: number;

  @Column({ type: 'varchar', length: 20, default: 'kg' })
  wasteUnit: string;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  recycledAmount: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  recyclingRate: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  disposalCost: number;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  recyclingRevenue: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'jsonb', nullable: true })
  materialBreakdown: {
    material: string;
    amount: number;
    recycled: boolean;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  scrapData: {
    productionOrderId: string;
    scrapRate: number;
    reason: string;
    materialCost: number;
  }[];

  @Column({ type: 'varchar', nullable: true })
  vendorId: string;

  @Column({ type: 'varchar', nullable: true })
  vendorName: string;

  @Column({ type: 'varchar', nullable: true })
  manifestNumber: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'boolean', default: false })
  isCompliant: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
