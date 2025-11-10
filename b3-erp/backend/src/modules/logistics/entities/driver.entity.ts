import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Trip } from './trip.entity';

export enum DriverStatus {
  ACTIVE = 'Active',
  INACTIVE = 'Inactive',
  ON_TRIP = 'On Trip',
  ON_LEAVE = 'On Leave',
  SUSPENDED = 'Suspended',
  TERMINATED = 'Terminated',
}

export enum LicenseType {
  LMV = 'Light Motor Vehicle (LMV)',
  HMV = 'Heavy Motor Vehicle (HMV)',
  HGMV = 'Heavy Goods Motor Vehicle (HGMV)',
  HPMV = 'Heavy Passenger Motor Vehicle (HPMV)',
  MCWG = 'Motorcycle With Gear (MCWG)',
  MCWOG = 'Motorcycle Without Gear (MCWOG)',
}

@Entity('logistics_drivers')
export class Driver {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  // Driver Identification
  @Column({ unique: true, length: 50 })
  driverCode: string;

  @Column({ nullable: true })
  employeeId: string;

  @Column({ length: 100 })
  firstName: string;

  @Column({ length: 100, nullable: true })
  middleName: string;

  @Column({ length: 100 })
  lastName: string;

  @Column({ length: 200 })
  fullName: string;

  @Column({
    type: 'enum',
    enum: DriverStatus,
    default: DriverStatus.ACTIVE,
  })
  status: DriverStatus;

  // Personal Information
  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column({ length: 50 })
  gender: string;

  @Column({ nullable: true, length: 50 })
  bloodGroup: string;

  @Column({ nullable: true, length: 100 })
  nationality: string;

  // Contact Information
  @Column({ unique: true, length: 100 })
  email: string;

  @Column({ unique: true, length: 20 })
  mobileNumber: string;

  @Column({ length: 20, nullable: true })
  alternateNumber: string;

  @Column({ type: 'text' })
  currentAddress: string;

  @Column({ nullable: true, length: 100 })
  city: string;

  @Column({ nullable: true, length: 100 })
  state: string;

  @Column({ nullable: true, length: 20 })
  postalCode: string;

  @Column({ nullable: true, length: 100 })
  country: string;

  // License Details
  @Column({ unique: true, length: 50 })
  licenseNumber: string;

  @Column({
    type: 'enum',
    enum: LicenseType,
  })
  licenseType: LicenseType;

  @Column({ type: 'date' })
  licenseIssueDate: Date;

  @Column({ type: 'date' })
  licenseExpiryDate: Date;

  @Column({ nullable: true, length: 100 })
  licensingAuthority: string;

  @Column({ type: 'simple-array', nullable: true })
  additionalLicenseTypes: string[];

  @Column({ default: false })
  hasInternationalLicense: boolean;

  @Column({ nullable: true, length: 50 })
  internationalLicenseNumber: string;

  @Column({ type: 'date', nullable: true })
  internationalLicenseExpiry: Date;

  // Employment Details
  @Column({ type: 'date' })
  joiningDate: Date;

  @Column({ nullable: true })
  transportCompanyId: string;

  @Column({ nullable: true, length: 200 })
  transportCompanyName: string;

  @Column({ nullable: true, length: 100 })
  employmentType: string; // Full-time, Part-time, Contract

  @Column({ nullable: true })
  assignedWarehouseId: string;

  @Column({ nullable: true, length: 200 })
  assignedWarehouseName: string;

  @Column({ nullable: true })
  currentVehicleId: string;

  @Column({ nullable: true, length: 100 })
  currentVehicleNumber: string;

  // Experience and Training
  @Column({ type: 'int' })
  experienceYears: number;

  @Column({ type: 'json', nullable: true })
  trainingCertificates: Array<{
    certificateName: string;
    issuingOrganization: string;
    issueDate: Date;
    expiryDate?: Date;
  }>;

  @Column({ type: 'simple-array', nullable: true })
  specializations: string[]; // Hazardous materials, Refrigerated transport, etc.

  // Safety and Compliance
  @Column({ default: 0 })
  totalTrips: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, default: 0 })
  totalDistanceCovered: number;

  @Column({ length: 50, default: 'km' })
  distanceUnit: string;

  @Column({ type: 'int', default: 0 })
  accidentCount: number;

  @Column({ type: 'int', default: 0 })
  trafficViolationCount: number;

  @Column({ type: 'decimal', precision: 5, scale: 2, default: 5 })
  safetyRating: number; // Out of 5

  @Column({ type: 'date', nullable: true })
  lastMedicalCheckupDate: Date;

  @Column({ type: 'date', nullable: true })
  nextMedicalCheckupDate: Date;

  @Column({ default: true })
  isMedicallyFit: boolean;

  @Column({ type: 'json', nullable: true })
  medicalConditions: string[];

  // Government IDs
  @Column({ nullable: true, length: 50 })
  aadharNumber: string;

  @Column({ nullable: true, length: 50 })
  panNumber: string;

  @Column({ nullable: true, length: 50 })
  passportNumber: string;

  @Column({ type: 'date', nullable: true })
  passportExpiryDate: Date;

  // Emergency Contact
  @Column({ nullable: true, length: 100 })
  emergencyContactName: string;

  @Column({ nullable: true, length: 50 })
  emergencyContactRelation: string;

  @Column({ nullable: true, length: 20 })
  emergencyContactPhone: string;

  // Performance Metrics
  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  performanceRating: number; // Out of 5

  @Column({ type: 'decimal', precision: 5, scale: 2, nullable: true })
  onTimeDeliveryRate: number; // Percentage

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  averageFuelEfficiency: number; // km per liter

  @Column({ type: 'int', nullable: true })
  customerComplaintCount: number;

  @Column({ type: 'int', nullable: true })
  customerComplimentCount: number;

  // Financial
  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  basicSalary: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  perTripAllowance: number;

  @Column({ type: 'decimal', precision: 15, scale: 2, nullable: true })
  perKmAllowance: number;

  @Column({ length: 10, default: 'INR' })
  currency: string;

  @Column({ nullable: true, length: 100 })
  bankName: string;

  @Column({ nullable: true, length: 50 })
  accountNumber: string;

  @Column({ nullable: true, length: 50 })
  ifscCode: string;

  // Availability
  @Column({ default: true })
  isAvailable: boolean;

  @Column({ nullable: true })
  currentTripId: string;

  @Column({ type: 'json', nullable: true })
  workingHours: Array<{
    day: string;
    startTime: string;
    endTime: string;
    isWorkingDay: boolean;
  }>;

  // Additional Information
  @Column({ type: 'text', nullable: true })
  notes: string;

  @Column({ type: 'text', nullable: true })
  remarks: string;

  @Column({ type: 'json', nullable: true })
  customFields: Record<string, any>;

  @Column({ type: 'json', nullable: true })
  documents: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;

  @Column({ type: 'text', nullable: true })
  profilePhotoUrl: string;

  @Column({ nullable: true, length: 100 })
  createdBy: string;

  @Column({ nullable: true, length: 100 })
  updatedBy: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  // Relations
  @OneToMany(() => Trip, (trip) => trip.driver)
  trips: Trip[];
}
