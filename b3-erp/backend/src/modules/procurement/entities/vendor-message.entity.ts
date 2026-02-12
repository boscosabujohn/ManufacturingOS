import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum MessageType {
  INQUIRY = 'inquiry',
  CLARIFICATION = 'clarification',
  QUOTATION_UPDATE = 'quotation_update',
  NEGOTIATION = 'negotiation',
  GENERAL = 'general',
  DOCUMENT_REQUEST = 'document_request',
  SPECIFICATION_CHANGE = 'specification_change',
  DEADLINE_EXTENSION = 'deadline_extension',
  AWARD_NOTIFICATION = 'award_notification',
  REJECTION_NOTIFICATION = 'rejection_notification',
}

export enum MessageStatus {
  DRAFT = 'draft',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  REPLIED = 'replied',
  ARCHIVED = 'archived',
}

export enum MessagePriority {
  LOW = 'low',
  NORMAL = 'normal',
  HIGH = 'high',
  URGENT = 'urgent',
}

@Entity('vendor_messages')
@Index(['rfqId', 'createdAt'])
@Index(['vendorId', 'createdAt'])
@Index(['status', 'createdAt'])
export class VendorMessage {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  companyId: string;

  // Reference Information
  @Column({ length: 100 })
  rfqId: string;

  @Column({ length: 50 })
  rfqNumber: string;

  @Column({ length: 100, nullable: true })
  quotationId: string;

  // Sender/Receiver
  @Column({ length: 100 })
  vendorId: string;

  @Column({ length: 255 })
  vendorName: string;

  @Column({ length: 255, nullable: true })
  vendorEmail: string;

  @Column({ length: 100, nullable: true })
  vendorContactPerson: string;

  // Message Details
  @Column({
    type: 'enum',
    enum: MessageType,
    default: MessageType.GENERAL,
  })
  messageType: MessageType;

  @Column({
    type: 'enum',
    enum: MessagePriority,
    default: MessagePriority.NORMAL,
  })
  priority: MessagePriority;

  @Column({ length: 255 })
  subject: string;

  @Column({ type: 'text' })
  message: string;

  @Column({
    type: 'enum',
    enum: MessageStatus,
    default: MessageStatus.DRAFT,
  })
  status: MessageStatus;

  // Direction
  @Column({ default: true })
  isOutbound: boolean; // true = buyer to vendor, false = vendor to buyer

  // Parent Message (for threading)
  @Column({ type: 'varchar', nullable: true })
  parentMessageId: string;

  @Column({ type: 'varchar', nullable: true })
  threadId: string;

  // Attachments
  @Column({ type: 'json', nullable: true })
  attachments: {
    fileName: string;
    fileUrl: string;
    fileSize: number;
    fileType: string;
    uploadedAt: Date;
  }[];

  // Tracking
  @Column({ type: 'timestamp', nullable: true })
  sentAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  deliveredAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  readAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  repliedAt: Date;

  // Response Tracking
  @Column({ default: false })
  requiresResponse: boolean;

  @Column({ type: 'date', nullable: true })
  responseDeadline: Date;

  @Column({ default: false })
  isResponded: boolean;

  // User Information
  @Column({ length: 100 })
  createdBy: string;

  @Column({ length: 255 })
  createdByName: string;

  @Column({ length: 100, nullable: true })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
