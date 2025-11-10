import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  Index,
} from 'typeorm';

export enum PermissionStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

export enum PermissionType {
  SYSTEM = 'System',
  CUSTOM = 'Custom',
  MODULE = 'Module',
  API = 'API',
}

@Entity('it_permissions')
@Index(['code'], { unique: true })
@Index(['module', 'action'])
@Index(['status'])
export class Permission {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  code: string; // e.g., 'inventory.view', 'sales.create', 'reports.export'

  @Column({ length: 50 })
  module: string; // e.g., 'inventory', 'sales', 'hr'

  @Column({ length: 50 })
  action: string; // e.g., 'view', 'create', 'update', 'delete', 'approve', 'export'

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: PermissionType,
    default: PermissionType.MODULE,
  })
  permissionType: PermissionType;

  @Column({
    type: 'enum',
    enum: PermissionStatus,
    default: PermissionStatus.ACTIVE,
  })
  status: PermissionStatus;

  @Column({ nullable: true, length: 50 })
  category: string; // e.g., 'Core', 'Finance', 'Operations'

  @Column({ default: false })
  isSystemPermission: boolean;

  @Column({ default: false })
  requiresApproval: boolean;

  @Column({ type: 'simple-array', nullable: true })
  dependsOn: string[]; // Permission codes that this permission depends on

  @Column({ type: 'simple-array', nullable: true })
  conflictsWith: string[]; // Permission codes that conflict with this permission

  @Column({ nullable: true, length: 100 })
  apiEndpoint: string;

  @Column({ nullable: true, length: 20 })
  httpMethod: string; // GET, POST, PUT, DELETE, PATCH

  @Column({ type: 'jsonb', nullable: true })
  constraints: {
    dataScope?: string; // 'all', 'department', 'own'
    fieldLevel?: string[]; // Specific fields allowed
    conditions?: Record<string, any>; // Additional conditions
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

  @OneToMany(
    () => RolePermission,
    (rolePermission) => rolePermission.permission,
  )
  rolePermissions: RolePermission[];
}

import { RolePermission } from './role-permission.entity';
