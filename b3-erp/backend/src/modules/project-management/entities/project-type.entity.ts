import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProjectTypeStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('project_types')
export class ProjectTypeEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  icon: string;

  @Column({ length: 20, nullable: true })
  color: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({ default: true })
  requiresBudget: boolean;

  @Column({ default: true })
  requiresTimeline: boolean;

  @Column({ default: false })
  isRecurring: boolean;

  @Column({ type: 'int', nullable: true })
  defaultDurationDays: number;

  @Column({ type: 'simple-array', nullable: true })
  requiredMilestones: string[];

  @Column({
    type: 'enum',
    enum: ProjectTypeStatus,
    default: ProjectTypeStatus.ACTIVE,
  })
  status: ProjectTypeStatus;

  @Column({ default: true })
  isSystem: boolean;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
