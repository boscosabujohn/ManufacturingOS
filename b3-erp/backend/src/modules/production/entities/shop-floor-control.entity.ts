import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ShopFloorActivityType {
  OPERATION_START = 'Operation Start',
  OPERATION_PAUSE = 'Operation Pause',
  OPERATION_RESUME = 'Operation Resume',
  OPERATION_COMPLETE = 'Operation Complete',
  MATERIAL_ISSUE = 'Material Issue',
  MATERIAL_RETURN = 'Material Return',
  DOWNTIME = 'Downtime',
  QUALITY_CHECK = 'Quality Check',
  TOOL_CHANGE = 'Tool Change',
  SETUP_START = 'Setup Start',
  SETUP_COMPLETE = 'Setup Complete',
}

export enum ShopFloorStatus {
  PENDING = 'Pending',
  IN_PROGRESS = 'In Progress',
  PAUSED = 'Paused',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum DowntimeCategory {
  MACHINE_BREAKDOWN = 'Machine Breakdown',
  TOOL_FAILURE = 'Tool Failure',
  MATERIAL_SHORTAGE = 'Material Shortage',
  POWER_FAILURE = 'Power Failure',
  OPERATOR_ABSENCE = 'Operator Absence',
  QUALITY_ISSUE = 'Quality Issue',
  PLANNED_MAINTENANCE = 'Planned Maintenance',
  CHANGEOVER = 'Changeover',
  OTHER = 'Other',
}

@Entity('shop_floor_control')
export class ShopFloorControl {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  entryNumber: string;

  @Column({ type: 'enum', enum: ShopFloorActivityType })
  activityType: ShopFloorActivityType;

  @Column({ type: 'enum', enum: ShopFloorStatus, default: ShopFloorStatus.PENDING })
  status: ShopFloorStatus;

  // Work order reference
  @Column()
  workOrderId: string;

  @Column({ length: 100 })
  workOrderNumber: string;

  @Column()
  itemId: string;

  @Column({ length: 100 })
  itemCode: string;

  @Column({ length: 255 })
  itemName: string;

  // Operation details
  @Column({ nullable: true })
  operationId: string;

  @Column({ length: 100, nullable: true })
  operationCode: string;

  @Column({ length: 255, nullable: true })
  operationName: string;

  @Column({ type: 'int', nullable: true })
  operationSequence: number;

  // Work center
  @Column({ nullable: true })
  workCenterId: string;

  @Column({ length: 100, nullable: true })
  workCenterCode: string;

  @Column({ length: 255, nullable: true })
  workCenterName: string;

  // Worker/Operator
  @Column({ nullable: true })
  operatorId: string;

  @Column({ length: 255, nullable: true })
  operatorName: string;

  @Column({ length: 100, nullable: true })
  employeeCode: string;

  @Column({ length: 100, nullable: true })
  shift: string;

  // Timing
  @Column({ type: 'timestamp' })
  startTime: Date;

  @Column({ type: 'timestamp', nullable: true })
  endTime: Date;

  @Column({ type: 'int', default: 0 })
  durationMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  setupTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  runTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  teardownTimeMinutes: number;

  // Quantities
  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  targetQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  completedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  acceptedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  rejectedQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  scrapQuantity: number;

  @Column({ type: 'decimal', precision: 15, scale: 4, default: 0 })
  reworkQuantity: number;

  @Column({ length: 50, default: 'PCS' })
  uom: string;

  // Efficiency metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  efficiencyPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  utilizationPercentage: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  yieldPercentage: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  cycleTimeMinutes: number;

  @Column({ type: 'decimal', precision: 10, scale: 2, default: 0 })
  standardTimeMinutes: number;

  // Downtime
  @Column({ default: false })
  hasDowntime: boolean;

  @Column({ type: 'enum', enum: DowntimeCategory, nullable: true })
  downtimeCategory: DowntimeCategory;

  @Column({ type: 'int', default: 0 })
  downtimeMinutes: number;

  @Column({ type: 'text', nullable: true })
  downtimeReason: string;

  @Column({ type: 'text', nullable: true })
  downtimeRemarks: string;

  // Material tracking
  @Column({ type: 'json', nullable: true })
  materialsIssued: {
    itemId: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    uom: string;
    batchNumber?: string;
    serialNumbers?: string[];
  }[];

  @Column({ type: 'json', nullable: true })
  materialsConsumed: {
    itemId: string;
    itemCode: string;
    itemName: string;
    quantity: number;
    uom: string;
    batchNumber?: string;
    serialNumbers?: string[];
  }[];

  // Quality
  @Column({ default: false })
  qualityInspectionRequired: boolean;

  @Column({ default: false })
  qualityInspectionCompleted: boolean;

  @Column({ length: 50, nullable: true })
  qualityStatus: string;

  @Column({ nullable: true })
  qcReportId: string;

  // Tools and equipment
  @Column({ type: 'json', nullable: true })
  toolsUsed: {
    toolId: string;
    toolCode: string;
    toolName: string;
    usageHours: number;
  }[];

  // Batch/Serial tracking
  @Column({ length: 100, nullable: true })
  batchNumber: string;

  @Column({ type: 'json', nullable: true })
  serialNumbers: string[];

  // Supervisor approval
  @Column({ default: false })
  requiresSupervisorApproval: boolean;

  @Column({ default: false })
  isApproved: boolean;

  @Column({ length: 100, nullable: true })
  approvedBy: string;

  @Column({ type: 'timestamp', nullable: true })
  approvedAt: Date;

  // Additional
  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'text', nullable: true })
  issues: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileType: string;
    uploadedBy: string;
    uploadedAt: Date;
  }[];

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
