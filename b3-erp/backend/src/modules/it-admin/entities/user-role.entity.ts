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
import { Role } from './role.entity';

export enum UserRoleStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  SUSPENDED = 'Suspended',
  EXPIRED = 'Expired',
}

@Entity('it_user_roles')
@Index(['userId', 'roleId'], { unique: true })
@Index(['status'])
export class UserRole {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  userId: string;

  @ManyToOne(() => User, (user) => user.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'userId' })
  user: User;

  @Column()
  roleId: string;

  @ManyToOne(() => Role, (role) => role.userRoles, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'roleId' })
  role: Role;

  @Column({
    type: 'enum',
    enum: UserRoleStatus,
    default: UserRoleStatus.ACTIVE,
  })
  status: UserRoleStatus;

  @Column({ default: false })
  isPrimary: boolean;

  @Column({ nullable: true, type: 'timestamp' })
  assignedAt: Date;

  @Column({ nullable: true, length: 100 })
  assignedBy: string;

  @Column({ nullable: true, type: 'timestamp' })
  effectiveFrom: Date;

  @Column({ nullable: true, type: 'timestamp' })
  effectiveUntil: Date;

  @Column({ nullable: true, type: 'timestamp' })
  revokedAt: Date;

  @Column({ nullable: true, length: 100 })
  revokedBy: string;

  @Column({ nullable: true, type: 'text' })
  revokedReason: string;

  @Column({ nullable: true, length: 100 })
  approvedBy: string;

  @Column({ nullable: true, type: 'timestamp' })
  approvedAt: Date;

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
