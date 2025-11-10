import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  Index,
} from 'typeorm';

export enum ConfigCategory {
  SYSTEM = 'System',
  SECURITY = 'Security',
  EMAIL = 'Email',
  NOTIFICATION = 'Notification',
  AUTHENTICATION = 'Authentication',
  API = 'API',
  INTEGRATION = 'Integration',
  FEATURE_FLAG = 'Feature Flag',
  BUSINESS_RULE = 'Business Rule',
  CUSTOM = 'Custom',
}

export enum ConfigDataType {
  STRING = 'String',
  NUMBER = 'Number',
  BOOLEAN = 'Boolean',
  JSON = 'JSON',
  ARRAY = 'Array',
  DATE = 'Date',
  ENCRYPTED = 'Encrypted',
}

export enum ConfigStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('it_system_configs')
@Index(['key'], { unique: true })
@Index(['category'])
@Index(['status'])
export class SystemConfig {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 100 })
  key: string; // e.g., 'password.min_length', 'session.timeout'

  @Column({ length: 150 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text' })
  value: string;

  @Column({ type: 'text', nullable: true })
  defaultValue: string;

  @Column({
    type: 'enum',
    enum: ConfigCategory,
    default: ConfigCategory.SYSTEM,
  })
  category: ConfigCategory;

  @Column({
    type: 'enum',
    enum: ConfigDataType,
    default: ConfigDataType.STRING,
  })
  dataType: ConfigDataType;

  @Column({
    type: 'enum',
    enum: ConfigStatus,
    default: ConfigStatus.ACTIVE,
  })
  status: ConfigStatus;

  @Column({ default: false })
  isEncrypted: boolean;

  @Column({ default: true })
  isEditable: boolean;

  @Column({ default: false })
  isSystemConfig: boolean;

  @Column({ default: false })
  requiresRestart: boolean;

  @Column({ type: 'simple-array', nullable: true })
  allowedValues: string[];

  @Column({ nullable: true, type: 'text' })
  validationRegex: string;

  @Column({ nullable: true, length: 500 })
  validationMessage: string;

  @Column({ type: 'jsonb', nullable: true })
  constraints: {
    min?: number;
    max?: number;
    pattern?: string;
    enum?: string[];
  };

  @Column({ nullable: true, length: 50 })
  module: string;

  @Column({ nullable: true, length: 50 })
  environment: string; // 'development', 'staging', 'production'

  @Column({ type: 'jsonb', nullable: true })
  metadata: Record<string, any>;

  @Column({ nullable: true, length: 100 })
  lastModifiedBy: string;

  @Column({ nullable: true, type: 'timestamp' })
  lastModifiedAt: Date;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
