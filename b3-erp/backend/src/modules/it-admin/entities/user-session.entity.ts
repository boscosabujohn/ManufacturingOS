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

export enum SessionStatus {
  ACTIVE = 'Active',
  EXPIRED = 'Expired',
  TERMINATED = 'Terminated',
  LOGGED_OUT = 'Logged Out',
}

@Entity('it_user_sessions')
@Index(['userId'])
@Index(['sessionToken'], { unique: true })
@Index(['status'])
@Index(['expiresAt'])
export class UserSession {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.sessions, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ unique: true, length: 255 })
  sessionToken: string;

  @Column({ nullable: true, length: 500 })
  refreshToken: string;

  @Column({
    type: 'enum',
    enum: SessionStatus,
    default: SessionStatus.ACTIVE,
  })
  status: SessionStatus;

  @Column({ length: 50 })
  ipAddress: string;

  @Column({ type: 'text', nullable: true })
  userAgent: string;

  @Column({ nullable: true, length: 100 })
  device: string;

  @Column({ nullable: true, length: 100 })
  browser: string;

  @Column({ nullable: true, length: 50 })
  os: string;

  @Column({ nullable: true, length: 100 })
  location: string;

  @Column({ nullable: true })
  latitude: number;

  @Column({ nullable: true })
  longitude: number;

  @Column({ type: 'timestamp' })
  expiresAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  lastActivityAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  loggedOutAt: Date;

  @Column({ nullable: true, type: 'timestamp' })
  terminatedAt: Date;

  @Column({ nullable: true, length: 100 })
  terminatedBy: string;

  @Column({ nullable: true, type: 'text' })
  terminationReason: string;

  @Column({ default: 0 })
  requestCount: number;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
