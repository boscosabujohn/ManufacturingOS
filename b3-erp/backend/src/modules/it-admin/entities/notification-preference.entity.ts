import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';
import { NotificationChannel } from './notification.entity';

export enum NotificationFrequency {
  REALTIME = 'Realtime',
  HOURLY = 'Hourly',
  DAILY = 'Daily',
  WEEKLY = 'Weekly',
  CUSTOM = 'Custom',
}

@Entity('it_notification_preferences')
@Index(['userId', 'category'], { unique: true })
@Index(['userId'])
export class NotificationPreference {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @Column({ length: 50 })
  category: string; // e.g., 'sales', 'inventory', 'hr', 'system'

  @Column({ default: true })
  enabled: boolean;

  @Column({
    type: 'enum',
    enum: NotificationChannel,
    array: true,
    default: [NotificationChannel.IN_APP],
  })
  enabledChannels: NotificationChannel[];

  @Column({
    type: 'enum',
    enum: NotificationFrequency,
    default: NotificationFrequency.REALTIME,
  })
  frequency: NotificationFrequency;

  @Column({ default: false })
  emailEnabled: boolean;

  @Column({ default: false })
  smsEnabled: boolean;

  @Column({ default: true })
  pushEnabled: boolean;

  @Column({ default: true })
  inAppEnabled: boolean;

  @Column({ type: 'jsonb', nullable: true })
  quietHours: {
    enabled: boolean;
    startTime: string; // HH:mm format
    endTime: string;
    days: string[]; // ['Monday', 'Tuesday', ...]
  };

  @Column({ type: 'simple-array', nullable: true })
  mutedTypes: string[]; // Notification types to mute

  @Column({ type: 'simple-array', nullable: true })
  priorityFilter: string[]; // Only show these priorities

  @Column({ default: true })
  soundEnabled: boolean;

  @Column({ default: true })
  vibrationEnabled: boolean;

  @Column({ default: true })
  desktopNotifications: boolean;

  @Column({ default: true })
  mobileNotifications: boolean;

  @Column({ nullable: true, type: 'text' })
  customSound: string;

  @Column({ type: 'jsonb', nullable: true })
  filters: {
    modules?: string[];
    types?: string[];
    priorities?: string[];
    keywords?: string[];
  };

  @Column({ type: 'jsonb', nullable: true })
  digestSettings: {
    enabled: boolean;
    frequency: string; // 'daily', 'weekly'
    time: string; // HH:mm format
    day?: string; // For weekly digests
  };

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
