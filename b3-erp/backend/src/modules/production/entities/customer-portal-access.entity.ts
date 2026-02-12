import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type PortalAccessLevel = 'view_only' | 'comment' | 'approve' | 'full';
export type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'revision_requested';
export type ProjectPhase = 'design' | 'procurement' | 'production' | 'quality' | 'shipping' | 'installation' | 'completed';

@Entity('customer_portal_accesses')
export class CustomerPortalAccess {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  customerId: string;

  @Column()
  customerName: string;

  @Column({ type: 'varchar', nullable: true })
  contactId: string;

  @Column({ type: 'varchar', nullable: true })
  contactName: string;

  @Column({ type: 'varchar', nullable: true })
  contactEmail: string;

  @Column({ type: 'varchar', nullable: true })
  orderId: string;

  @Column({ type: 'varchar', nullable: true })
  orderNumber: string;

  @Column({ type: 'varchar', nullable: true })
  projectId: string;

  @Column({ type: 'varchar', nullable: true })
  projectName: string;

  @Column({ type: 'varchar', length: 20, default: 'view_only' })
  accessLevel: PortalAccessLevel;

  @Column({ type: 'varchar', length: 20, nullable: true })
  currentPhase: ProjectPhase;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  overallProgress: number;

  @Column({ type: 'jsonb', nullable: true })
  milestones: {
    id: string;
    name: string;
    phase: ProjectPhase;
    plannedDate: Date;
    actualDate: Date;
    status: 'pending' | 'in_progress' | 'completed' | 'delayed';
    isCustomerVisible: boolean;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  sharedDocuments: {
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
    uploadedBy: string;
    requiresApproval: boolean;
    approvalStatus: ApprovalStatus;
    approvedAt: Date;
    approvedBy: string;
    comments: string;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  pendingApprovals: {
    id: string;
    type: 'design' | 'material' | 'change_order' | 'inspection' | 'other';
    title: string;
    description: string;
    requestedAt: Date;
    dueDate: Date;
    status: ApprovalStatus;
    attachments: { name: string; url: string }[];
  }[];

  @Column({ type: 'jsonb', nullable: true })
  updates: {
    id: string;
    date: Date;
    title: string;
    message: string;
    type: 'info' | 'milestone' | 'delay' | 'approval_request' | 'completion';
    isRead: boolean;
    readAt: Date;
  }[];

  @Column({ type: 'jsonb', nullable: true })
  accessLog: {
    accessedAt: Date;
    action: string;
    ipAddress: string;
    userAgent: string;
  }[];

  @Column({ type: 'boolean', default: true })
  notificationsEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  notificationPreferences: {
    email: boolean;
    sms: boolean;
    milestones: boolean;
    delays: boolean;
    approvalRequests: boolean;
    documents: boolean;
  };

  @Column({ type: 'timestamp', nullable: true })
  lastAccessedAt: Date;

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @Column({ type: 'timestamp', nullable: true })
  expiresAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
