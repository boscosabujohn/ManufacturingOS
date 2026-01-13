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
import { Employee } from './employee.entity';

export enum UserSkillStatus {
  ACTIVE = 'Active',
  PENDING_VERIFICATION = 'Pending Verification',
  VERIFIED = 'Verified',
  EXPIRED = 'Expired',
  INACTIVE = 'Inactive',
}

@Entity('hr_user_skills')
export class UserSkill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column()
  skillId: string;

  @ManyToOne(() => Skill, (skill) => skill.userSkills)
  @JoinColumn({ name: 'skillId' })
  skill: Skill;

  @Column({ nullable: true })
  proficiencyLevelId: string;

  @Column({ type: 'int', default: 1 })
  proficiencyLevel: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  yearsOfExperience: number;

  @Column({ type: 'date', nullable: true })
  lastAssessmentDate: Date;

  @Column({ type: 'date', nullable: true })
  certificationDate: Date;

  @Column({ type: 'date', nullable: true })
  certificationExpiryDate: Date;

  @Column({ type: 'text', nullable: true })
  certificateUrl: string;

  @Column({ type: 'text', nullable: true })
  certificateNumber: string;

  @Column({ nullable: true })
  verifiedById: string;

  @Column({ type: 'varchar', length: 100, nullable: true })
  verifiedByName: string;

  @Column({ type: 'date', nullable: true })
  verifiedAt: Date;

  @Column({ type: 'text', nullable: true })
  verificationNotes: string;

  @Column({ type: 'boolean', default: true })
  isEnabled: boolean;

  @Column({
    type: 'enum',
    enum: UserSkillStatus,
    default: UserSkillStatus.ACTIVE,
  })
  status: UserSkillStatus;

  @Column({ type: 'text', nullable: true })
  notes: string;

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
