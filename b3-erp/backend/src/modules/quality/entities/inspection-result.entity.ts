import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Inspection } from './inspection.entity';

export enum ResultStatus {
  PASS = 'Pass',
  FAIL = 'Fail',
  WARNING = 'Warning',
  NOT_APPLICABLE = 'Not Applicable',
  PENDING = 'Pending',
}

@Entity('inspection_results')
export class InspectionResult {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  inspectionId: string;

  @Column({ nullable: true })
  qcParameterId: string;

  @Column({ length: 100, nullable: true })
  parameterCode: string;

  @Column({ length: 255 })
  parameterName: string;

  @Column({ length: 100, nullable: true })
  parameterType: string;

  @Column({ type: 'int' })
  sequence: number;

  // Measured value
  @Column({ type: 'text', nullable: true })
  measuredValue: string;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  numericValue: number;

  @Column({ length: 50, nullable: true })
  uom: string;

  // Specification limits
  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  lowerSpecLimit: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  upperSpecLimit: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  nominalValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  targetValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  tolerance: number;

  // Result
  @Column({ type: 'enum', enum: ResultStatus, default: ResultStatus.PENDING })
  status: ResultStatus;

  @Column({ default: false })
  isWithinSpec: boolean;

  @Column({ default: false })
  isOutOfControl: boolean;

  // Deviation
  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  deviation: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  deviationPercentage: number;

  // Defect information
  @Column({ default: false })
  hasDefect: boolean;

  @Column({ length: 50, nullable: true })
  defectSeverity: string; // Critical, Major, Minor

  @Column({ length: 255, nullable: true })
  defectType: string;

  @Column({ type: 'text', nullable: true })
  defectDescription: string;

  @Column({ type: 'int', nullable: true })
  defectCount: number;

  @Column({ length: 255, nullable: true })
  defectLocation: string;

  // Measurement details
  @Column({ length: 255, nullable: true })
  measuringInstrument: string;

  @Column({ length: 100, nullable: true })
  instrumentId: string;

  @Column({ length: 255, nullable: true })
  testMethod: string;

  @Column({ type: 'timestamp', nullable: true })
  measurementTime: Date;

  @Column({ length: 255, nullable: true })
  measuredBy: string;

  // Environmental conditions
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  temperature: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  humidity: number;

  @Column({ type: 'decimal', precision: 7, scale: 2, nullable: true })
  pressure: number;

  // Multiple measurements
  @Column({ type: 'json', nullable: true })
  measurements: number[];

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  averageValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  standardDeviation: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  range: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cpk: number; // Process capability index

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cp: number; // Process capability

  // Actions
  @Column({ default: false })
  requiresRework: boolean;

  @Column({ default: false })
  requiresNCR: boolean;

  @Column({ default: false })
  requiresCAPA: boolean;

  @Column({ length: 255, nullable: true })
  correctionAction: string;

  // Photos
  @Column({ type: 'json', nullable: true })
  photos: {
    fileName: string;
    fileUrl: string;
    description: string;
    uploadedAt: Date;
  }[];

  // Additional
  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  // Metadata
  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @ManyToOne(() => Inspection, (inspection) => inspection.results)
  @JoinColumn({ name: 'inspectionId' })
  inspection: Inspection;
}
