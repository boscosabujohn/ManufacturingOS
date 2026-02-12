import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LeadStatus {
  NEW = 'new',
  CONTACTED = 'contacted',
  QUALIFIED = 'qualified',
  PROPOSAL = 'proposal',
  NEGOTIATION = 'negotiation',
  WON = 'won',
  LOST = 'lost',
}

export enum LeadRating {
  HOT = 'hot',
  WARM = 'warm',
  COLD = 'cold',
}

@Entity('crm_leads')
export class Lead {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Basic Information
  @Column()
  firstName: string;

  @Column()
  lastName: string;

  @Column({ type: 'varchar', nullable: true })
  title: string;

  @Column()
  company: string;

  @Column({ type: 'varchar', nullable: true })
  website: string;

  @Column({ type: 'varchar', nullable: true })
  industry: string;

  @Column({ type: 'varchar', nullable: true })
  employeeCount: string;

  @Column({ type: 'varchar', nullable: true })
  annualRevenue: string;

  // Contact Information
  @Column()
  email: string;

  @Column({ type: 'varchar', nullable: true })
  phone: string;

  @Column({ type: 'varchar', nullable: true })
  mobile: string;

  @Column({ type: 'varchar', nullable: true })
  fax: string;

  // Address Information
  @Column({ type: 'varchar', nullable: true })
  street: string;

  @Column({ type: 'varchar', nullable: true })
  city: string;

  @Column({ type: 'varchar', nullable: true })
  state: string;

  @Column({ type: 'varchar', nullable: true })
  postalCode: string;

  @Column({ type: 'varchar', nullable: true })
  country: string;

  // Lead Details
  @Column({
    type: 'enum',
    enum: LeadStatus,
    default: LeadStatus.NEW,
  })
  status: LeadStatus;

  @Column({
    type: 'enum',
    enum: LeadRating,
    default: LeadRating.WARM,
  })
  rating: LeadRating;

  @Column()
  leadSource: string;

  @Column({ type: 'varchar', nullable: true })
  leadSubSource: string;

  @Column({ type: 'varchar', nullable: true })
  referredBy: string;

  @Column({ type: 'varchar', nullable: true })
  campaign: string;

  // Opportunity Information
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  estimatedValue: number;

  @Column({ type: 'date', nullable: true })
  estimatedCloseDate: Date;

  @Column({ type: 'int', nullable: true, default: 50 })
  probability: number;

  @Column({ type: 'simple-array', nullable: true })
  productInterest: string[];

  @Column({ type: 'simple-array', nullable: true })
  customProducts: string[];

  // Assignment & Ownership
  @Column({ type: 'varchar', nullable: true })
  assignedTo: string;

  @Column({ type: 'varchar', nullable: true })
  teamAssignment: string;

  // Additional Details
  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  // Social Media
  @Column({ type: 'varchar', nullable: true })
  linkedIn: string;

  @Column({ type: 'varchar', nullable: true })
  twitter: string;

  @Column({ type: 'varchar', nullable: true })
  facebook: string;

  // Compliance & Privacy
  @Column({ default: false })
  gdprConsent: boolean;

  @Column({ default: true })
  emailOptIn: boolean;

  @Column({ default: false })
  smsOptIn: boolean;

  @Column({ default: false })
  doNotCall: boolean;

  // Lead Score
  @Column({ type: 'int', default: 0 })
  leadScore: number;

  // Attachments
  @Column({ type: 'json', nullable: true })
  attachments: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: string;
  }>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @Column({ type: 'timestamp', nullable: true })
  lastContactDate: Date;
}
