import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Skill } from './skill.entity';

export enum SkillGapStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DRAFT = 'Draft',
}

export enum SkillGapPriority {
  CRITICAL = 'Critical',
  HIGH = 'High',
  MEDIUM = 'Medium',
  LOW = 'Low',
}

export enum SkillGapCategory {
  ROLE_REQUIREMENT = 'Role Requirement',
  PROJECT_REQUIREMENT = 'Project Requirement',
  TEAM_CAPABILITY = 'Team Capability',
  ORGANIZATIONAL = 'Organizational',
}

@Entity('hr_skill_gaps')
export class SkillGap {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 50, unique: true })
  code: string;

  @Column({ length: 200 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: SkillGapCategory,
    default: SkillGapCategory.ROLE_REQUIREMENT,
  })
  category: SkillGapCategory;

  @Column({ nullable: true })
  roleId: string;

  @Column({ length: 100, nullable: true })
  roleName: string;

  @Column({ nullable: true })
  departmentId: string;

  @Column({ length: 100, nullable: true })
  departmentName: string;

  @Column({ nullable: true })
  skillId: string;

  @ManyToOne(() => Skill)
  @JoinColumn({ name: 'skillId' })
  skill: Skill;

  @Column({ type: 'int', default: 3 })
  requiredProficiencyLevel: number;

  @Column({ type: 'int', default: 0 })
  currentAverageProficiency: number;

  @Column({ type: 'int', default: 0 })
  employeesWithSkill: number;

  @Column({ type: 'int', default: 0 })
  employeesRequired: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  gapPercentage: number;

  @Column({
    type: 'enum',
    enum: SkillGapPriority,
    default: SkillGapPriority.MEDIUM,
  })
  priority: SkillGapPriority;

  @Column({ type: 'text', nullable: true })
  impact: string;

  @Column({ type: 'text', nullable: true })
  recommendation: string;

  @Column({ type: 'text', nullable: true })
  trainingPlan: string;

  @Column({ type: 'date', nullable: true })
  targetDate: Date;

  @Column({ type: 'json', nullable: true })
  requiredCompetencies: string[];

  @Column({ type: 'json', nullable: true })
  relatedTrainingIds: string[];

  @Column({
    type: 'enum',
    enum: SkillGapStatus,
    default: SkillGapStatus.ACTIVE,
  })
  status: SkillGapStatus;

  @Column({ type: 'json', nullable: true })
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
