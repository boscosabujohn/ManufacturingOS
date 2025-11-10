import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
  Index,
} from 'typeorm';
import { User } from './user.entity';

export enum PasswordChangeReason {
  USER_INITIATED = 'User Initiated',
  ADMIN_RESET = 'Admin Reset',
  PASSWORD_EXPIRED = 'Password Expired',
  SECURITY_POLICY = 'Security Policy',
  COMPROMISED = 'Compromised',
  FIRST_LOGIN = 'First Login',
}

@Entity('it_password_history')
@Index(['userId'])
@Index(['createdAt'])
export class PasswordHistory {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.passwordHistory, {
    onDelete: 'CASCADE',
  })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column({ select: false })
  passwordHash: string;

  @Column({
    type: 'enum',
    enum: PasswordChangeReason,
    default: PasswordChangeReason.USER_INITIATED,
  })
  changeReason: PasswordChangeReason;

  @Column({ nullable: true, length: 50 })
  changedByIp: string;

  @Column({ nullable: true, length: 100 })
  changedBy: string; // User ID or 'System' or 'Admin'

  @Column({ default: false })
  isTemporary: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  expiresAt: Date;

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @CreateDateColumn()
  createdAt: Date;
}
