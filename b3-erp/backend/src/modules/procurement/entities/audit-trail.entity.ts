import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  Index,
} from 'typeorm';

export enum AuditAction {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  STATUS_CHANGE = 'status_change',
  APPROVAL = 'approval',
  REJECTION = 'rejection',
  SUBMIT = 'submit',
  SEND = 'send',
  RECEIVE = 'receive',
  EVALUATE = 'evaluate',
  AWARD = 'award',
  CANCEL = 'cancel',
  COMMENT = 'comment',
  ATTACHMENT = 'attachment',
  VIEW = 'view',
  EXPORT = 'export',
  PRINT = 'print',
}

export enum AuditEntityType {
  RFQ = 'rfq',
  VENDOR_QUOTATION = 'vendor_quotation',
  PURCHASE_ORDER = 'purchase_order',
  PURCHASE_REQUISITION = 'purchase_requisition',
  GOODS_RECEIPT = 'goods_receipt',
  PURCHASE_INVOICE = 'purchase_invoice',
  PURCHASE_RETURN = 'purchase_return',
  VENDOR_EVALUATION = 'vendor_evaluation',
  VENDOR_CONTRACT = 'vendor_contract',
  VENDOR_MESSAGE = 'vendor_message',
  SOURCING_RULE = 'sourcing_rule',
}

@Entity('procurement_audit_trail')
@Index(['entityType', 'entityId'])
@Index(['userId', 'createdAt'])
@Index(['action', 'createdAt'])
export class AuditTrail {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  companyId: string;

  // Entity Reference
  @Column({
    type: 'enum',
    enum: AuditEntityType,
  })
  entityType: AuditEntityType;

  @Column({ length: 100 })
  entityId: string;

  @Column({ length: 100, nullable: true })
  entityNumber: string;

  // Action Details
  @Column({
    type: 'enum',
    enum: AuditAction,
  })
  action: AuditAction;

  @Column({ length: 255 })
  actionDescription: string;

  // User Information
  @Column({ length: 100 })
  userId: string;

  @Column({ length: 255 })
  userName: string;

  @Column({ length: 255, nullable: true })
  userEmail: string;

  @Column({ length: 100, nullable: true })
  userRole: string;

  // Change Details
  @Column({ type: 'json', nullable: true })
  previousValues: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  newValues: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  changedFields: string[];

  // Status Change Tracking
  @Column({ length: 50, nullable: true })
  previousStatus: string;

  @Column({ length: 50, nullable: true })
  newStatus: string;

  // Additional Context
  @Column({ type: 'text', nullable: true })
  comments: string;

  @Column({ type: 'json', nullable: true })
  metadata: {
    ipAddress?: string;
    userAgent?: string;
    sessionId?: string;
    source?: string;
    relatedEntityType?: string;
    relatedEntityId?: string;
    relatedEntityNumber?: string;
  };

  // Timestamps
  @CreateDateColumn()
  createdAt: Date;
}
