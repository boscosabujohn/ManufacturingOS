import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { QCTemplate } from './qc-template.entity';

export enum ParameterType {
  DIMENSIONAL = 'Dimensional',
  VISUAL = 'Visual',
  FUNCTIONAL = 'Functional',
  CHEMICAL = 'Chemical',
  MECHANICAL = 'Mechanical',
  ELECTRICAL = 'Electrical',
  ATTRIBUTE = 'Attribute',
  VARIABLE = 'Variable',
}

export enum ParameterDataType {
  NUMERIC = 'Numeric',
  TEXT = 'Text',
  BOOLEAN = 'Boolean',
  PASS_FAIL = 'Pass/Fail',
  OK_NOT_OK = 'OK/Not OK',
  ACCEPT_REJECT = 'Accept/Reject',
  SELECT = 'Select',
  MULTI_SELECT = 'Multi-Select',
}

export enum ParameterCriticality {
  CRITICAL = 'Critical',
  MAJOR = 'Major',
  MINOR = 'Minor',
}

@Entity('qc_parameters')
export class QCParameter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  qcTemplateId: string;

  @Column({ length: 100 })
  parameterCode: string;

  @Column({ length: 255 })
  parameterName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: ParameterType })
  parameterType: ParameterType;

  @Column({ type: 'enum', enum: ParameterDataType })
  dataType: ParameterDataType;

  @Column({ type: 'enum', enum: ParameterCriticality, default: ParameterCriticality.MAJOR })
  criticality: ParameterCriticality;

  @Column({ type: 'int' })
  sequence: number;

  @Column({ default: true })
  isMandatory: boolean;

  @Column({ default: false })
  requiresCalibration: boolean;

  // Measurement specifications
  @Column({ length: 50, nullable: true })
  uom: string; // Unit of measure

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  nominalValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  lowerSpecLimit: number; // LSL

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  upperSpecLimit: number; // USL

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  lowerControlLimit: number; // LCL

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  upperControlLimit: number; // UCL

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  tolerance: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  targetValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  minValue: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, nullable: true })
  maxValue: number;

  // For select type parameters
  @Column({ type: 'json', nullable: true })
  allowedValues: string[];

  @Column({ length: 255, nullable: true })
  defaultValue: string;

  // Validation rules
  @Column({ type: 'json', nullable: true })
  validationRules: {
    rule: string;
    value: any;
    message: string;
  }[];

  // Measurement tools
  @Column({ length: 255, nullable: true })
  measuringInstrument: string;

  @Column({ length: 100, nullable: true })
  instrumentId: string;

  @Column({ type: 'date', nullable: true })
  lastCalibrationDate: Date;

  @Column({ type: 'date', nullable: true })
  nextCalibrationDate: Date;

  // Testing method
  @Column({ length: 255, nullable: true })
  testMethod: string;

  @Column({ type: 'text', nullable: true })
  testProcedure: string;

  @Column({ length: 255, nullable: true })
  referenceStandard: string;

  // SPC settings
  @Column({ default: false })
  enableSPC: boolean;

  @Column({ type: 'int', nullable: true })
  spcSampleSize: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  cpkTarget: number;

  // Failure actions
  @Column({ default: false })
  autoRejectOnFailure: boolean;

  @Column({ default: false })
  requiresRework: boolean;

  @Column({ default: false })
  requiresNCR: boolean;

  // Instructions
  @Column({ type: 'text', nullable: true })
  inspectionInstructions: string;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
  }[];

  // Additional
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ default: true })
  isActive: boolean;

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
  @ManyToOne(() => QCTemplate, (template) => template.parameters)
  @JoinColumn({ name: 'qcTemplateId' })
  qcTemplate: QCTemplate;
}
