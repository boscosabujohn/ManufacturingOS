import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum ProficiencyLevelStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('hr_proficiency_levels')
export class ProficiencyLevel {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'int' })
  level: number;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color: string;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ type: 'text', nullable: true })
  criteria: string;

  @Column({
    type: 'enum',
    enum: ProficiencyLevelStatus,
    default: ProficiencyLevelStatus.ACTIVE,
  })
  status: ProficiencyLevelStatus;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
