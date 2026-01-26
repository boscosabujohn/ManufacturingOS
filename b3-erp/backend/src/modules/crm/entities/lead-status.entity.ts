import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum LeadStatusState {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
}

@Entity('crm_lead_statuses')
export class LeadStatusEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  code: string;

  @Column()
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  color: string;

  @Column({ type: 'int', default: 0 })
  sequenceOrder: number;

  @Column({ default: false })
  isFinal: boolean;

  @Column({ default: false })
  isWon: boolean;

  @Column({ default: false })
  isLost: boolean;

  @Column({
    type: 'enum',
    enum: LeadStatusState,
    default: LeadStatusState.ACTIVE,
  })
  status: LeadStatusState;

  @Column({ default: true })
  isSystem: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
