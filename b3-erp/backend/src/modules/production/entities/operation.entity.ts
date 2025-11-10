import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum OperationType {
  MACHINING = 'Machining',
  ASSEMBLY = 'Assembly',
  WELDING = 'Welding',
  PAINTING = 'Painting',
  TESTING = 'Testing',
  INSPECTION = 'Inspection',
  PACKAGING = 'Packaging',
  HEAT_TREATMENT = 'Heat Treatment',
  SURFACE_TREATMENT = 'Surface Treatment',
  QUALITY_CONTROL = 'Quality Control',
  MATERIAL_HANDLING = 'Material Handling',
  SETUP = 'Setup',
  OTHER = 'Other',
}

export enum OperationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  OBSOLETE = 'Obsolete',
}

export enum TimeCalculationMethod {
  MANUAL = 'Manual',
  STANDARD_TIME = 'Standard Time',
  ESTIMATED = 'Estimated',
  ACTUAL_AVERAGE = 'Actual Average',
}

@Entity('operations')
export class Operation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  operationCode: string;

  @Column({ length: 255 })
  operationName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: OperationType, default: OperationType.MACHINING })
  operationType: OperationType;

  @Column({ type: 'enum', enum: OperationStatus, default: OperationStatus.ACTIVE })
  status: OperationStatus;

  // Work center
  @Column({ nullable: true })
  defaultWorkCenterId: string;

  @Column({ length: 100, nullable: true })
  defaultWorkCenterCode: string;

  @Column({ length: 255, nullable: true })
  defaultWorkCenterName: string;

  @Column({ type: 'json', nullable: true })
  alternateWorkCenters: {
    workCenterId: string;
    workCenterCode: string;
    workCenterName: string;
    priority: number;
  }[];

  // Time standards
  @Column({ type: 'enum', enum: TimeCalculationMethod, default: TimeCalculationMethod.STANDARD_TIME })
  timeCalculationMethod: TimeCalculationMethod;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  setupTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  runTimePerUnitMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  teardownTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalTimePerUnitMinutes: number;

  @Column({ type: 'int', default: 1 })
  batchSize: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  changoverTimeMinutes: number;

  // Costing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  hourlyRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  costPerUnit: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadRate: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCostPerUnit: number;

  // Capacity
  @Column({ type: 'int', default: 1 })
  numberOfOperators: number;

  @Column({ type: 'int', default: 1 })
  numberOfMachines: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  capacityPerHour: number;

  @Column({ length: 50, default: 'PCS' })
  capacityUOM: string;

  // Quality
  @Column({ default: false })
  requiresQualityInspection: boolean;

  @Column({ nullable: true })
  qcTemplateId: string;

  @Column({ length: 100, nullable: true })
  qcTemplateName: string;

  @Column({ default: false })
  requiresSupervisorApproval: boolean;

  // Skills and certifications
  @Column({ type: 'json', nullable: true })
  requiredSkills: {
    skillId: string;
    skillName: string;
    proficiencyLevel: string;
    isMandatory: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  requiredCertifications: {
    certificationId: string;
    certificationName: string;
    isMandatory: boolean;
  }[];

  // Tools and equipment
  @Column({ type: 'json', nullable: true })
  requiredTools: {
    toolId: string;
    toolCode: string;
    toolName: string;
    quantity: number;
    isCritical: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  requiredEquipment: {
    equipmentId: string;
    equipmentCode: string;
    equipmentName: string;
    quantity: number;
    isCritical: boolean;
  }[];

  // Safety
  @Column({ type: 'json', nullable: true })
  safetyRequirements: {
    requirement: string;
    description: string;
    isMandatory: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  safetyEquipment: string[];

  // Work instructions
  @Column({ type: 'text', nullable: true })
  workInstructions: string;

  @Column({ type: 'json', nullable: true })
  instructionSteps: {
    stepNumber: number;
    stepDescription: string;
    estimatedTime: number;
    safetyNotes?: string;
  }[];

  // Documentation
  @Column({ length: 100, nullable: true })
  drawingNumber: string;

  @Column({ length: 100, nullable: true })
  revision: string;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Performance tracking
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  targetEfficiency: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  actualEfficiency: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defectRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  reworkRate: number;

  // Flags
  @Column({ default: false })
  isOutsourced: boolean;

  @Column({ nullable: true })
  outsourcedVendorId: string;

  @Column({ length: 255, nullable: true })
  outsourcedVendorName: string;

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isCritical: boolean;

  @Column({ default: false })
  allowParallelOperations: boolean;

  // Additional
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
}
