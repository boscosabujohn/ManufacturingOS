import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum HolidayType {
  PUBLIC = 'Public Holiday',
  OPTIONAL = 'Optional Holiday',
  RESTRICTED = 'Restricted Holiday',
  COMPANY = 'Company Holiday',
}

export enum HolidayStatus {
  ACTIVE = 'Active',
  CANCELLED = 'Cancelled',
}

@Entity('hr_holidays')
export class Holiday {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ length: 100 })
  name: string;

  @Column({ type: 'date' })
  date: Date;

  @Column({
    type: 'enum',
    enum: HolidayType,
    default: HolidayType.PUBLIC,
  })
  type: HolidayType;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ default: true })
  isPaid: boolean;

  @Column({ type: 'int', default: 1 })
  numberOfDays: number;

  @Column({ type: 'simple-array', nullable: true })
  applicableLocations: string[];

  @Column({ type: 'simple-array', nullable: true })
  applicableDepartments: string[];

  @Column({ type: 'simple-array', nullable: true })
  applicableEmployeeTypes: string[];

  @Column({ default: false })
  isFloating: boolean;

  @Column({ type: 'int', nullable: true })
  year: number;

  @Column({
    type: 'enum',
    enum: HolidayStatus,
    default: HolidayStatus.ACTIVE,
  })
  status: HolidayStatus;

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
