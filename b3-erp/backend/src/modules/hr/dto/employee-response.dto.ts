import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmployeeStatus,
  EmploymentType,
  Gender,
  MaritalStatus,
  BloodGroup,
} from '../entities/employee.entity';

export class EmployeeResponseDto {
  @ApiProperty()
  id: string;

  @ApiProperty()
  employeeCode: string;

  @ApiPropertyOptional()
  userId?: string;

  @ApiPropertyOptional()
  biometricId?: string;

  @ApiPropertyOptional()
  rfidCardNumber?: string;

  @ApiProperty()
  firstName: string;

  @ApiPropertyOptional()
  middleName?: string;

  @ApiProperty()
  lastName: string;

  @ApiProperty()
  fullName: string;

  @ApiProperty()
  dateOfBirth: Date;

  @ApiProperty({ enum: Gender })
  gender: Gender;

  @ApiProperty({ enum: MaritalStatus })
  maritalStatus: MaritalStatus;

  @ApiPropertyOptional({ enum: BloodGroup })
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional()
  nationality?: string;

  @ApiPropertyOptional()
  religion?: string;

  @ApiProperty()
  personalEmail: string;

  @ApiPropertyOptional()
  companyEmail?: string;

  @ApiProperty()
  mobileNumber: string;

  @ApiPropertyOptional()
  alternateNumber?: string;

  @ApiProperty()
  currentAddress: string;

  @ApiPropertyOptional()
  permanentAddress?: string;

  @ApiPropertyOptional()
  city?: string;

  @ApiPropertyOptional()
  state?: string;

  @ApiPropertyOptional()
  postalCode?: string;

  @ApiPropertyOptional()
  country?: string;

  @ApiProperty()
  departmentId: string;

  @ApiProperty()
  designationId: string;

  @ApiProperty({ enum: EmploymentType })
  employmentType: EmploymentType;

  @ApiProperty()
  joiningDate: Date;

  @ApiPropertyOptional()
  confirmationDate?: Date;

  @ApiPropertyOptional()
  probationEndDate?: Date;

  @ApiPropertyOptional()
  reportingManagerId?: string;

  @ApiPropertyOptional()
  reportingManagerName?: string;

  @ApiPropertyOptional()
  shiftId?: string;

  @ApiPropertyOptional()
  workLocation?: string;

  @ApiPropertyOptional()
  branch?: string;

  @ApiPropertyOptional()
  costCenter?: string;

  @ApiProperty({ enum: EmployeeStatus })
  status: EmployeeStatus;

  @ApiProperty()
  basicSalary: number;

  @ApiProperty()
  grossSalary: number;

  @ApiPropertyOptional()
  ctc?: number;

  @ApiProperty()
  salaryFrequency: string;

  @ApiPropertyOptional()
  salaryStructureId?: string;

  @ApiPropertyOptional()
  paymentMode?: string;

  @ApiPropertyOptional()
  bankName?: string;

  @ApiPropertyOptional()
  bankBranch?: string;

  @ApiPropertyOptional()
  accountNumber?: string;

  @ApiPropertyOptional()
  ifscCode?: string;

  @ApiPropertyOptional()
  accountHolderName?: string;

  @ApiPropertyOptional()
  panNumber?: string;

  @ApiPropertyOptional()
  aadharNumber?: string;

  @ApiPropertyOptional()
  passportNumber?: string;

  @ApiPropertyOptional()
  passportExpiryDate?: Date;

  @ApiPropertyOptional()
  pfNumber?: string;

  @ApiPropertyOptional()
  esiNumber?: string;

  @ApiPropertyOptional()
  uanNumber?: string;

  @ApiPropertyOptional()
  emergencyContactName?: string;

  @ApiPropertyOptional()
  emergencyContactRelation?: string;

  @ApiPropertyOptional()
  emergencyContactPhone?: string;

  @ApiPropertyOptional()
  education?: Array<{
    degree: string;
    institution: string;
    yearOfPassing: number;
    percentage: number;
  }>;

  @ApiPropertyOptional()
  previousEmployment?: Array<{
    company: string;
    designation: string;
    from: string;
    to: string;
    responsibilities: string;
  }>;

  @ApiPropertyOptional()
  skills?: string[];

  @ApiPropertyOptional()
  certifications?: string[];

  @ApiPropertyOptional()
  relievingDate?: Date;

  @ApiPropertyOptional()
  lastWorkingDay?: Date;

  @ApiPropertyOptional()
  exitReason?: string;

  @ApiPropertyOptional()
  exitNotes?: string;

  @ApiProperty()
  isExited: boolean;

  @ApiPropertyOptional()
  documents?: Array<{
    id: string;
    name: string;
    type: string;
    url: string;
    uploadedAt: Date;
  }>;

  @ApiPropertyOptional()
  profilePhotoUrl?: string;

  @ApiPropertyOptional()
  notes?: string;

  @ApiPropertyOptional()
  customFields?: Record<string, any>;

  @ApiPropertyOptional()
  createdBy?: string;

  @ApiPropertyOptional()
  updatedBy?: string;

  @ApiProperty()
  createdAt: Date;

  @ApiProperty()
  updatedAt: Date;
}
