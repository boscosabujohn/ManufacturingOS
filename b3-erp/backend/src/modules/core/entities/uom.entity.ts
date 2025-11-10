import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum UOMType {
  QUANTITY = 'Quantity',
  LENGTH = 'Length',
  WEIGHT = 'Weight',
  VOLUME = 'Volume',
  AREA = 'Area',
  TIME = 'Time',
  TEMPERATURE = 'Temperature',
}

@Entity('unit_of_measures')
export class UnitOfMeasure {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  uomCode: string;

  @Column({ length: 255 })
  uomName: string;

  @Column({
    type: 'enum',
    enum: UOMType,
  })
  uomType: UOMType;

  @Column({ length: 20, nullable: true })
  symbol: string;

  @Column({ default: true })
  isActive: boolean;

  // Conversion
  @Column({ nullable: true })
  baseUOMId: string;

  @Column({ type: 'decimal', precision: 15, scale: 6, default: 1 })
  conversionFactor: number;

  // For fractional UOMs
  @Column({ default: true })
  allowFractional: boolean;

  @Column({ type: 'int', default: 2 })
  decimalPlaces: number;

  // Metadata
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
