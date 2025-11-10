import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum NotificationType {
  INFO = 'Info',
  SUCCESS = 'Success',
  WARNING = 'Warning',
  ERROR = 'Error',
  ALERT = 'Alert',
  REMINDER = 'Reminder',
  SYSTEM = 'System',
}

export enum NotificationPriority {
  LOW = 'Low',
  MEDIUM = 'Medium',
  HIGH = 'High',
  URGENT = 'Urgent',
}

export enum NotificationStatus {
  UNREAD = 'Unread',
  READ = 'Read',
  ARCHIVED = 'Archived',
  DELETED = 'Deleted',
}

export enum NotificationChannel {
  IN_APP = 'In-App',
  EMAIL = 'Email',
  SMS = 'SMS',
  PUSH = 'Push',
  WEBHOOK = 'Webhook',
}

@Entity('it_notifications')
@Index(['userId'])
@Index(['status'])
@Index(['type'])
@Index(['priority'])
@Index(['createdAt'])
export class Notification {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.notifications, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({
    type: 'enum',
    enum: NotificationType,
    default: NotificationType.INFO,
  })
  type: NotificationType;

  @Column({
    type: 'enum',
    enum: NotificationPriority,
    default: NotificationPriority.MEDIUM,
  })
  priority: NotificationPriority;

  @Column({
    type: 'enum',
    enum: NotificationStatus,
    default: NotificationStatus.UNREAD,
  })
  status: NotificationStatus;

  @Column({ length: 200 })
  title: string;

  @Column({ type: 'text' })
  message: string;

  @Column({ nullable: true, length: 50 })
  category: string;

  @Column({ nullable: true, length: 50 })
  module: string;

  @Column({ nullable: true, length: 100 })
  relatedEntityType: string;

  @Column({ nullable: true, length: 100 })
  relatedEntityId: string;

  @Column({ nullable: true, length: 500 })
  actionUrl: string;

  @Column({ nullable: true, length: 100 })
  actionLabel: string;

  @Column({ nullable: true, length: 100 })
  iconUrl: string;

  @Column({ nullable: true, length: 100 })
  imageUrl: string;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    array: true,
    default: [NotificationChannel.IN_APP],
  })
  channels: NotificationChannel[];

  @Column({ nullable: true, type: 'timestamp' })
  scheduledFor: Date;

  @Column({ nullable: true, type: 'timestamp' })
  sentAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  readAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  archivedAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  expiresAt: Date;

  @Column({ default: false })
  isRead: boolean;

  @Column({ default: false })
  isArchived: boolean;

  @Column({ default: false })
  isPinned: boolean;

  @Column({ default: false })
  requiresAcknowledgment: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  acknowledgedAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  data: Record<string, any>;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
