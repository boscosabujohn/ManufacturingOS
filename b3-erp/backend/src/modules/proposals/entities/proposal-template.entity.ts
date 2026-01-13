import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';
import { ProposalType } from './proposal.entity';

@Entity('proposal_templates')
export class ProposalTemplate {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: ProposalType,
    default: ProposalType.STANDARD,
  })
  type: ProposalType;

  @Column({ type: 'jsonb', nullable: true })
  structure: {
    sections: Array<{
      id: string;
      name: string;
      type: 'text' | 'table' | 'list' | 'pricing' | 'timeline';
      required: boolean;
      defaultContent?: unknown;
    }>;
  };

  @Column({ type: 'jsonb', nullable: true })
  defaultContent: Record<string, unknown>;

  @Column({ type: 'jsonb', nullable: true })
  styling: {
    primaryColor?: string;
    secondaryColor?: string;
    fontFamily?: string;
    logo?: string;
    headerTemplate?: string;
    footerTemplate?: string;
  };

  @Column({ default: true })
  isActive: boolean;

  @Column({ default: false })
  isDefault: boolean;

  @Column({ nullable: true })
  createdById: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
