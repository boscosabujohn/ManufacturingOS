import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export type ActivityType = 'task_completed' | 'document_uploaded' | 'comment_added' | 'status_changed' | 'approval_given' | 'milestone_reached' | 'issue_reported' | 'handoff_started' | 'login' | 'logout';
export type UserStatus = 'online' | 'away' | 'busy' | 'offline';
export type ResourceActivityType = 'work_order' | 'project' | 'document' | 'inspection' | 'maintenance' | 'quality_check';

@Entity('team_activities')
export class TeamActivity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  companyId: string;

  @Column()
  userId: string;

  @Column()
  userName: string;

  @Column({ type: 'varchar', nullable: true })
  userAvatar: string;

  @Column({ type: 'varchar', length: 20, default: 'online' })
  userStatus: UserStatus;

  @Column({ type: 'varchar', length: 50 })
  activityType: ActivityType;

  @Column({ type: 'text' })
  activityDescription: string;

  @Column({ type: 'varchar', length: 50, nullable: true })
  resourceType: ResourceActivityType;

  @Column({ type: 'varchar', nullable: true })
  resourceId: string;

  @Column({ type: 'varchar', nullable: true })
  resourceName: string;

  @Column({ type: 'varchar', nullable: true })
  resourceUrl: string;

  @Column({ type: 'jsonb', nullable: true })
  metadata: {
    oldValue?: string;
    newValue?: string;
    reason?: string;
    tags?: string[];
    mentions?: string[];
    attachments?: { name: string; url: string; type: string }[];
  };

  @Column({ type: 'varchar', nullable: true })
  teamId: string;

  @Column({ type: 'varchar', nullable: true })
  teamName: string;

  @Column({ type: 'varchar', nullable: true })
  departmentId: string;

  @Column({ type: 'varchar', nullable: true })
  departmentName: string;

  @Column({ type: 'varchar', nullable: true })
  shiftId: string;

  @Column({ type: 'varchar', nullable: true })
  workstationId: string;

  @Column({ type: 'varchar', nullable: true })
  ipAddress: string;

  @Column({ type: 'varchar', nullable: true })
  deviceInfo: string;

  @Column({ type: 'boolean', default: false })
  isImportant: boolean;

  @Column({ type: 'boolean', default: false })
  isSystemGenerated: boolean;

  @CreateDateColumn()
  activityAt: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
