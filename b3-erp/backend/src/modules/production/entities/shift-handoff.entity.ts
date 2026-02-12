import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type HandoffStatus = 'pending' | 'in_progress' | 'completed' | 'acknowledged';
export type HandoffShiftType = 'morning' | 'afternoon' | 'night' | 'custom';
export type ItemPriority = 'low' | 'medium' | 'high' | 'critical';
export type ItemCategory = 'safety' | 'quality' | 'production' | 'maintenance' | 'inventory' | 'general';

@Entity('shift_handoffs')
export class ShiftHandoff {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column({ type: 'date' })
  handoffDate: Date;

  @Column({ type: 'varchar', length: 20 })
  outgoingShiftType: HandoffShiftType;

  @Column({ type: 'varchar', length: 20 })
  incomingShiftType: HandoffShiftType;

  @Column()
  outgoingShiftId: string;

  @Column()
  incomingShiftId: string;

  @Column()
  outgoingUserId: string;

  @Column()
  outgoingUserName: string;

  @Column({ type: 'varchar', nullable: true })
  incomingUserId: string;

  @Column({ type: 'varchar', nullable: true })
  incomingUserName: string;

  @Column({ type: 'varchar', nullable: true })
  workstationId: string;

  @Column({ type: 'varchar', nullable: true })
  workstationName: string;

  @Column({ type: 'varchar', nullable: true })
  productionLineId: string;

  @Column({ type: 'varchar', nullable: true })
  productionLineName: string;

  @Column({ type: 'varchar', length: 20, default: 'pending' })
  status: HandoffStatus;

  @Column({ type: 'jsonb', nullable: true })
  checklistItems: {
    id: string;
    category: ItemCategory;
    item: string;
    priority: ItemPriority;
    isCompleted: boolean;
    notes: string;
    completedAt: Date;
    completedBy: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  activeIssues: {
    id: string;
    issue: string;
    severity: ItemPriority;
    status: 'open' | 'in_progress' | 'resolved';
    reportedAt: Date;
    assignedTo: string;
    resolution: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  productionStatus: {
    ordersCompleted: number;
    ordersInProgress: number;
    ordersPending: number;
    unitsProduced: number;
    defectsFound: number;
    machineStatus: { machineId: string; machineName: string; status: string }[];
  };

  @Column({ type: 'jsonb', nullable: true })
  pendingTasks: {
    taskId: string;
    taskName: string;
    priority: ItemPriority;
    dueDate: Date;
    status: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  safetyNotes: {
    note: string;
    severity: ItemPriority;
    timestamp: Date;
  }[];

  @Column({ type: 'text', nullable: true })
  generalNotes: string;

  @Column({ type: 'timestamp', nullable: true })
  handoffStartedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  handoffCompletedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  acknowledgedAt: Date;

  @Column({ type: 'text', nullable: true })
  acknowledgementNotes: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
