import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProjectStatusState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('project_statuses')
export class ProjectStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ length: 20, nullable: true })
  color: string;

  @Column({ type: 'int', default: 0 })
  sequenceOrder: number;

  @Column({ default: false })
  isFinal: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ default: false })
  allowTimeLogging: boolean;

  @Column({ default: true })
  allowTaskCreation: boolean;

  @Column({ default: true })
  allowBudgetModification: boolean;

  @Column({
    type: 'enum',
    enum: ProjectStatusState,
    default: ProjectStatusState.ACTIVE,
  })
  status: ProjectStatusState;

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
