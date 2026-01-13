import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { SkillCategory } from './skill-category.entity';
import { UserSkill } from './user-skill.entity';

export enum SkillStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  DEPRECATED = 'Deprecated',
}

export enum SkillType {
  TECHNICAL = 'Technical',
  SOFT_SKILL = 'Soft Skill',
  DOMAIN = 'Domain',
  TOOL = 'Tool',
  CERTIFICATION = 'Certification',
  LANGUAGE = 'Language',
}

@Entity('hr_skills')
export class Skill {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'text', nullable: true })
  useCases: string;

  @Column({ nullable: true })
  categoryId: string;

  @ManyToOne(() => SkillCategory, (category) => category.skills)
  @JoinColumn({ name: 'categoryId' })
  category: SkillCategory;

  @Column({
    type: 'enum',
    enum: SkillType,
    default: SkillType.DOMAIN,
  })
  skillType: SkillType;

  @Column({ type: 'text', nullable: true })
  icon: string;

  @Column({ type: 'varchar', length: 20, nullable: true })
  color: string;

  @Column({ type: 'simple-array', nullable: true })
  tags: string[];

  @Column({ type: 'simple-array', nullable: true })
  relatedSkillCodes: string[];

  @Column({ type: 'boolean', default: false })
  requiresCertification: boolean;

  @Column({ type: 'text', nullable: true })
  certificationUrl: string;

  @Column({ type: 'int', default: 0 })
  sortOrder: number;

  @Column({
    type: 'enum',
    enum: SkillStatus,
    default: SkillStatus.ACTIVE,
  })
  status: SkillStatus;

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

  @OneToMany(() => UserSkill, (userSkill) => userSkill.skill)
  userSkills: UserSkill[];
}
