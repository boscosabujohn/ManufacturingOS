import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum WorkCenterType {
  MACHINE = 'Machine',
  MANUAL = 'Manual',
  ASSEMBLY_LINE = 'Assembly Line',
  INSPECTION = 'Inspection',
  PACKAGING = 'Packaging',
  WAREHOUSE = 'Warehouse',
  TESTING = 'Testing',
  MAINTENANCE = 'Maintenance',
  OTHER = 'Other',
}

export enum WorkCenterStatus {
  AVAILABLE = 'Available',
  BUSY = 'Busy',
  MAINTENANCE = 'Maintenance',
  BREAKDOWN = 'Breakdown',
  IDLE = 'Idle',
  INACTIVE = 'Inactive',
}

@Entity('work_centers')
export class WorkCenter {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  workCenterCode: string;

  @Column({ length: 255 })
  workCenterName: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'enum', enum: WorkCenterType, default: WorkCenterType.MACHINE })
  workCenterType: WorkCenterType;

  @Column({ type: 'enum', enum: WorkCenterStatus, default: WorkCenterStatus.AVAILABLE })
  status: WorkCenterStatus;

  // Location
  @Column({ length: 100, nullable: true })
  department: string;

  @Column({ length: 100, nullable: true })
  plant: string;

  @Column({ length: 100, nullable: true })
  building: string;

  @Column({ length: 100, nullable: true })
  floor: string;

  @Column({ length: 100, nullable: true })
  area: string;

  @Column({ length: 255, nullable: true })
  location: string;

  // Capacity
  @Column({ type: 'int', default: 1 })
  numberOfStations: number;

  @Column({ type: 'int', default: 8 })
  workingHoursPerDay: number;

  @Column({ type: 'int', default: 5 })
  workingDaysPerWeek: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  availableCapacityHoursPerDay: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  utilisedCapacityHoursPerDay: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  capacityUtilizationPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 100 })
  efficiency: number;

  // Costing
  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  hourlyOperatingCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  laborCostPerHour: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  overheadCostPerHour: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  setupCost: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalCostPerHour: number;

  // Shift configuration
  @Column({ type: 'json', nullable: true })
  shifts: {
    shiftName: string;
    startTime: string;
    endTime: string;
    isActive: boolean;
    numberOfOperators: number;
  }[];

  // Machine details (if applicable)
  @Column({ length: 100, nullable: true })
  machineNumber: string;

  @Column({ length: 100, nullable: true })
  manufacturer: string;

  @Column({ length: 100, nullable: true })
  model: string;

  @Column({ length: 100, nullable: true })
  serialNumber: string;

  @Column({ type: 'date', nullable: true })
  purchaseDate: Date;

  @Column({ type: 'date', nullable: true })
  installationDate: Date;

  @Column({ type: 'int', nullable: true })
  warrantyMonths: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  assetValue: number;

  // Performance tracking
  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalRunningHours: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  totalDowntimeHours: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  uptimePercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  oeePercentage: number; // Overall Equipment Effectiveness

  @Column({ type: 'int', default: 0 })
  totalBreakdowns: number;

  @Column({ type: 'timestamp', nullable: true })
  lastBreakdownDate: Date;

  // Maintenance
  @Column({ default: false })
  requiresPreventiveMaintenance: boolean;

  @Column({ type: 'int', default: 0 })
  maintenanceIntervalDays: number;

  @Column({ type: 'timestamp', nullable: true })
  lastMaintenanceDate: Date;

  @Column({ type: 'timestamp', nullable: true })
  nextMaintenanceDate: Date;

  @Column({ nullable: true })
  maintenanceScheduleId: string;

  @Column({ type: 'json', nullable: true })
  maintenanceHistory: {
    date: Date;
    type: string;
    description: string;
    cost: number;
    performedBy: string;
  }[];

  // Operators/Staff
  @Column({ type: 'int', default: 1 })
  requiredOperators: number;

  @Column({ type: 'json', nullable: true })
  assignedOperators: {
    operatorId: string;
    operatorName: string;
    employeeCode: string;
    isPrimary: boolean;
  }[];

  @Column({ type: 'json', nullable: true })
  requiredSkills: {
    skillId: string;
    skillName: string;
    proficiencyLevel: string;
  }[];

  // Quality
  @Column({ default: false })
  requiresQualityCheck: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  defectRate: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  firstPassYield: number;

  // Supervisor
  @Column({ nullable: true })
  supervisorId: string;

  @Column({ length: 255, nullable: true })
  supervisorName: string;

  @Column({ length: 100, nullable: true })
  supervisorEmployeeCode: string;

  // Technical specifications
  @Column({ type: 'json', nullable: true })
  technicalSpecs: {
    specification: string;
    value: string;
    unit?: string;
  }[];

  // Capabilities
  @Column({ type: 'json', nullable: true })
  capabilities: string[];

  @Column({ type: 'json', nullable: true })
  operationTypes: string[];

  // Documentation
  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

  // Flags
  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isCritical: boolean;

  @Column({ default: true })
  allowBooking: boolean;

  // Calendar
  @Column({ type: 'json', nullable: true })
  holidays: Date[];

  @Column({ type: 'json', nullable: true })
  nonWorkingDays: string[]; // e.g., ['Sunday', 'Saturday']

  // Current status
  @Column({ nullable: true })
  currentWorkOrderId: string;

  @Column({ length: 100, nullable: true })
  currentWorkOrderNumber: string;

  @Column({ nullable: true })
  currentOperationId: string;

  @Column({ type: 'timestamp', nullable: true })
  currentOperationStartTime: Date;

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
