import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ProficiencyLevel = 'novice' | 'beginner' | 'competent' | 'proficient' | 'expert';
export type SkillCategory = 'technical' | 'safety' | 'quality' | 'equipment' | 'process' | 'leadership';

@Entity('production_skill_matrices')
export class SkillMatrix {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'company_id' })
  companyId: string;

  @Column({ name: 'employee_id' })
  employeeId: string;

  @Column({ name: 'employee_name' })
  employeeName: string;

  @Column({ name: 'employee_code', type: 'varchar', nullable: true })
  employeeCode: string | null;

  @Column({ type: 'varchar', nullable: true })
  department: string | null;

  @Column({ name: 'job_title', type: 'varchar', nullable: true })
  jobTitle: string | null;

  @Column({ type: 'jsonb', nullable: true })
  skills: {
    skillId: string;
    skillName: string;
    category: SkillCategory;
    proficiency: ProficiencyLevel;
    proficiencyScore: number;
    certified: boolean;
    certificationDate: string | null;
    certificationExpiry: string | null;
    lastAssessed: string;
    assessedBy: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  certifications: {
    certificationId: string;
    certificationName: string;
    issuedBy: string;
    issuedDate: string;
    expiryDate: string | null;
    status: string;
    documentUrl: string | null;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  trainingHistory: {
    trainingId: string;
    trainingName: string;
    type: string;
    completedDate: string;
    score: number | null;
    instructor: string;
    duration: number;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  trainingNeeds: {
    skillId: string;
    skillName: string;
    currentLevel: ProficiencyLevel;
    targetLevel: ProficiencyLevel;
    priority: string;
    recommendedTraining: string;
    targetDate: string;
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  equipmentCertifications: {
    equipmentId: string;
    equipmentName: string;
    certified: boolean;
    certifiedDate: string | null;
    expiryDate: string | null;
    restrictedOperations: string[];
  }[] | null;

  @Column({ type: 'jsonb', nullable: true })
  processQualifications: {
    processId: string;
    processName: string;
    qualified: boolean;
    qualificationDate: string | null;
    qualificationLevel: string;
    restrictions: string[];
  }[] | null;

  @Column({ name: 'overall_skill_score', type: 'decimal', precision: 5, scale: 2, nullable: true })
  overallSkillScore: number | null;

  @Column({ name: 'versatility_index', type: 'decimal', precision: 5, scale: 2, nullable: true })
  versatilityIndex: number | null;

  @Column({ name: 'last_assessment_date', type: 'date', nullable: true })
  lastAssessmentDate: Date | null;

  @Column({ name: 'next_assessment_due', type: 'date', nullable: true })
  nextAssessmentDue: Date | null;

  @Column({ name: 'assessed_by', type: 'varchar', nullable: true })
  assessedBy: string | null;

  @Column({ name: 'is_active', type: 'boolean', default: true })
  isActive: boolean;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;
}
