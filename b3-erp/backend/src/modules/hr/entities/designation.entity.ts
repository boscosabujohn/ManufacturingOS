import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from './employee.entity';

export enum DesignationLevel {
  ENTRY = 'Entry Level',
  JUNIOR = 'Junior',
  INTERMEDIATE = 'Intermediate',
  SENIOR = 'Senior',
  LEAD = 'Lead',
  MANAGER = 'Manager',
  SENIOR_MANAGER = 'Senior Manager',
  DIRECTOR = 'Director',
  VP = 'Vice President',
  SVP = 'Senior Vice President',
  CXO = 'C-Level Executive',
}

export enum DesignationStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('hr_designations')
export class Designation {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  title: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({
    type: 'enum',
    enum: DesignationLevel,
    default: DesignationLevel.INTERMEDIATE,
  })
  level: DesignationLevel;

  @Column({ nullable: true })
  reportsTo: string;

  @Column({ nullable: true, length: 100 })
  reportsToTitle: string;

  @Column({ type: 'int', default: 1 })
  gradeLevel: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  minSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  maxSalary: number;

  @Column({ type: 'simple-array', nullable: true })
  responsibilities: string[];

  @Column({ type: 'simple-array', nullable: true })
  requiredSkills: string[];

  @Column({ type: 'simple-array', nullable: true })
  qualifications: string[];

  @Column({ type: 'int', nullable: true })
  minExperience: number;

  @Column({
    type: 'enum',
    enum: DesignationStatus,
    default: DesignationStatus.ACTIVE,
  })
  status: DesignationStatus;

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

  @OneToMany(() => Employee, (employee) => employee.designation)
  employees: Employee[];
}
