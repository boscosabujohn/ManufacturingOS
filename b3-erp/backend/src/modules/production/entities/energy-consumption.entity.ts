import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type EnergyType = 'electricity' | 'natural_gas' | 'diesel' | 'solar' | 'wind' | 'other_renewable' | 'other';

@Entity('energy_consumptions')
export class EnergyConsumption {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  recordDate: Date;

  @Column({ type: 'varchar', length: 50 })
  energyType: EnergyType;

  @Column({ type: 'varchar', nullable: true })
  zoneId: string;

  @Column({ type: 'varchar', nullable: true })
  zoneName: string;

  @Column({ type: 'decimal', precision: 12, scale: 4 })
  consumptionAmount: number;

  @Column({ type: 'varchar', length: 20, default: 'kWh' })
  consumptionUnit: string;

  @Column({ type: 'decimal', precision: 12, scale: 2, nullable: true })
  cost: number;

  @Column({ type: 'varchar', length: 10, default: 'USD' })
  currency: string;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  renewablePercentage: number;

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  peakDemand: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  peakDemandUnit: string;

  @Column({ type: 'jsonb', nullable: true })
  hourlyBreakdown: {
    hour: number;
    consumption: number;
    cost: number;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  efficiencyMetrics: {
    consumptionPerUnit: number;
    benchmarkPerUnit: number;
    variance: number;
  };

  @Column({ type: 'decimal', precision: 12, scale: 4, nullable: true })
  carbonEquivalent: number;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
