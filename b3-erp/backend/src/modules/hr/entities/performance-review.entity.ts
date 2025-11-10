import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Employee } from './employee.entity';

export enum ReviewCycle {
  MONTHLY = 'Monthly',
  QUARTERLY = 'Quarterly',
  HALF_YEARLY = 'Half Yearly',
  ANNUAL = 'Annual',
}

export enum ReviewStatus {
  SCHEDULED = 'Scheduled',
  SELF_ASSESSMENT = 'Self Assessment',
  MANAGER_REVIEW = 'Manager Review',
  HR_REVIEW = 'HR Review',
  COMPLETED = 'Completed',
  CANCELLED = 'Cancelled',
}

export enum ReviewType {
  PROBATION = 'Probation Review',
  PERFORMANCE = 'Performance Review',
  APPRAISAL = 'Appraisal',
  PROMOTION = 'Promotion Review',
  INCIDENT = 'Incident Review',
  EXIT = 'Exit Review',
}

export enum OverallRating {
  OUTSTANDING = 'Outstanding',
  EXCEEDS_EXPECTATIONS = 'Exceeds Expectations',
  MEETS_EXPECTATIONS = 'Meets Expectations',
  NEEDS_IMPROVEMENT = 'Needs Improvement',
  UNSATISFACTORY = 'Unsatisfactory',
}

@Entity('hr_performance_reviews')
export class PerformanceReview {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  reviewNumber: string;

  @Column()
  employeeId: string;

  @ManyToOne(() => Employee)
  @JoinColumn({ name: 'employeeId' })
  employee: Employee;

  @Column({ nullable: true })
  reviewerId: string;

  @Column({ nullable: true, length: 100 })
  reviewerName: string;

  @Column({
    type: 'enum',
    enum: ReviewType,
    default: ReviewType.PERFORMANCE,
  })
  reviewType: ReviewType;

  @Column({
    type: 'enum',
    enum: ReviewCycle,
    default: ReviewCycle.ANNUAL,
  })
  cycle: ReviewCycle;

  @Column({ type: 'date' })
  reviewPeriodFrom: Date;

  @Column({ type: 'date' })
  reviewPeriodTo: Date;

  @Column({ type: 'date' })
  reviewDate: Date;

  @Column({ type: 'date', nullable: true })
  scheduledDate: Date;

  @Column({
    type: 'enum',
    enum: ReviewStatus,
    default: ReviewStatus.SCHEDULED,
  })
  status: ReviewStatus;

  // Goals & Objectives
  @Column({ type: 'json', nullable: true })
  goals: Array<{
    id: string;
    description: string;
    targetDate: Date;
    achievement: number; // percentage
    rating: number;
    comments: string;
  }>;

  // KPIs (Key Performance Indicators)
  @Column({ type: 'json', nullable: true })
  kpis: Array<{
    id: string;
    name: string;
    target: number;
    actual: number;
    unit: string;
    weight: number;
    score: number;
    comments: string;
  }>;

  // Competencies
  @Column({ type: 'json', nullable: true })
  competencies: Array<{
    id: string;
    name: string;
    category: string; // Technical, Behavioral, Leadership
    rating: number; // 1-5
    weight: number;
    selfRating: number;
    managerRating: number;
    comments: string;
  }>;

  // Ratings
  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  selfRating: number;

  @Column({ type: 'text', nullable: true })
  selfComments: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  managerRating: number;

  @Column({ type: 'text', nullable: true })
  managerComments: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  hrRating: number;

  @Column({ type: 'text', nullable: true })
  hrComments: string;

  @Column({ type: 'decimal', precision: 3, scale: 2, nullable: true })
  finalRating: number;

  @Column({
    type: 'enum',
    enum: OverallRating,
    nullable: true,
  })
  overallRating: OverallRating;

  // Strengths & Areas of Improvement
  @Column({ type: 'simple-array', nullable: true })
  strengths: string[];

  @Column({ type: 'simple-array', nullable: true })
  areasOfImprovement: string[];

  @Column({ type: 'text', nullable: true })
  achievements: string;

  @Column({ type: 'text', nullable: true })
  developmentNeeds: string;

  // Training Recommendations
  @Column({ type: 'json', nullable: true })
  trainingRecommendations: Array<{
    trainingName: string;
    reason: string;
    priority: string;
  }>;

  // Career Development
  @Column({ type: 'text', nullable: true })
  careerAspirations: string;

  @Column({ type: 'text', nullable: true })
  careerDevelopmentPlan: string;

  @Column({ default: false })
  isPromotionRecommended: boolean;

  @Column({ nullable: true, length: 100 })
  recommendedDesignation: string;

  @Column({ default: false })
  isSalaryRevisionRecommended: boolean;

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  recommendedSalaryIncrease: number; // percentage

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  recommendedNewSalary: number;

  // Attendance & Punctuality
  @Column({ type: 'int', default: 0 })
  totalWorkingDays: number;

  @Column({ type: 'int', default: 0 })
  presentDays: number;

  @Column({ type: 'int', default: 0 })
  absentDays: number;

  @Column({ type: 'int', default: 0 })
  lateDays: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 0 })
  leavesTaken: number;

  // Workflow
  @Column({ default: false })
  isSelfAssessmentCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  selfAssessmentDate: Date;

  @Column({ default: false })
  isManagerReviewCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  managerReviewDate: Date;

  @Column({ default: false })
  isHrReviewCompleted: boolean;

  @Column({ type: 'timestamp', nullable: true })
  hrReviewDate: Date;

  @Column({ default: false })
  isEmployeeAcknowledged: boolean;

  @Column({ type: 'timestamp', nullable: true })
  employeeAcknowledgementDate: Date;

  @Column({ type: 'text', nullable: true })
  employeeRemarks: string;

  // Next Review
  @Column({ type: 'date', nullable: true })
  nextReviewDate: Date;

  // Documents
  @Column({ type: 'json', nullable: true })
  attachments: Array<{
    id: string;
    name: string;
    url: string;
    uploadedAt: Date;
  }>;

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
