import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Employee } from './employee.entity';

export enum DepartmentStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
}

@Entity('hr_departments')
export class Department {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true, length: 50 })
  code: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ nullable: true })
  parentDepartmentId: string;

  @Column({ nullable: true })
  headOfDepartmentId: string;

  @Column({ nullable: true, length: 100 })
  headOfDepartmentName: string;

  @Column({ nullable: true })
  costCenterId: string;

  @Column({ nullable: true, length: 100 })
  costCenterName: string;

  @Column({ type: 'text', nullable: true })
  location: string;

  @Column({ length: 100, nullable: true })
  email: string;

  @Column({ length: 20, nullable: true })
  phone: string;

  @Column({
    type: 'enum',
    enum: DepartmentStatus,
    default: DepartmentStatus.ACTIVE,
  })
  status: DepartmentStatus;

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

  @OneToMany(() => Employee, (employee) => employee.department)
  employees: Employee[];
}
