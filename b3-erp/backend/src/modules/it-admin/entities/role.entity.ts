import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
  Index,
} from 'typeorm';

export enum RoleStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum RoleType {
  SYSTEM = 'System',
  CUSTOM = 'Custom',
  DEPARTMENT = 'Department',
  PROJECT = 'Project',
}

@Entity('it_roles')
@Index(['code'], { unique: true })
@Index(['status'])
export class Role {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: RoleType,
    default: RoleType.CUSTOM,
  })
  roleType: RoleType;

  @Column({
    type: 'enum',
    enum: RoleStatus,
    default: RoleStatus.ACTIVE,
  })
  status: RoleStatus;

  @Column({ default: 0 })
  hierarchyLevel: number;

  @Column({ nullable: true })
  parentRoleId: string;

  @ManyToOne(() => Role, (role) => role.childRoles, { nullable: true })
  @JoinColumn({ name: 'parentRoleId' })
  parentRole: Role;

  @OneToMany(() => Role, (role) => role.parentRole)
  childRoles: Role[];

  @Column({ default: false })
  isSystemRole: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: 0 })
  userCount: number;

  @Column({ type: 'simple-array', nullable: true })
  applicableModules: string[];

  @Column({ type: 'jsonb', nullable: true })
  restrictions: {
    dataAccess?: string; // 'all', 'department', 'own', 'custom'
    timeBasedAccess?: {
      allowedDays: string[];
      allowedHours: { start: string; end: string };
    };
    ipWhitelist?: string[];
    sessionTimeout?: number; // minutes
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

  @OneToMany(() => RolePermission, (rolePermission) => rolePermission.role)
  rolePermissions: RolePermission[];

  @OneToMany(() => UserRole, (userRole) => userRole.role)
  userRoles: UserRole[];
}

import { RolePermission } from './role-permission.entity';
import { UserRole } from './user-role.entity';
