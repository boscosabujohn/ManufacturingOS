import {
  IsString,
  IsEnum,
  IsOptional,
  IsNotEmpty,
  IsDateString,
  IsNumber,
  IsArray,
  IsEmail,
  MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  EmployeeStatus,
  EmploymentType,
  Gender,
  MaritalStatus,
  BloodGroup,
} from '../entities/employee.entity';

export class CreateEmployeeDto {
  @ApiProperty({ description: 'Employee code' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  employeeCode: string;

  @ApiPropertyOptional({ description: 'User ID' })
  @IsString()
  @IsOptional()
  userId?: string;

  @ApiPropertyOptional({ description: 'Biometric ID' })
  @IsString()
  @IsOptional()
  biometricId?: string;

  @ApiPropertyOptional({ description: 'RFID card number' })
  @IsString()
  @IsOptional()
  rfidCardNumber?: string;

  @ApiProperty({ description: 'First name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  firstName: string;

  @ApiPropertyOptional({ description: 'Middle name' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  middleName?: string;

  @ApiProperty({ description: 'Last name' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(50)
  lastName: string;

  @ApiProperty({ description: 'Date of birth (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  dateOfBirth: string;

  @ApiProperty({ description: 'Gender', enum: Gender })
  @IsEnum(Gender)
  gender: Gender;

  @ApiPropertyOptional({ description: 'Marital status', enum: MaritalStatus })
  @IsEnum(MaritalStatus)
  @IsOptional()
  maritalStatus?: MaritalStatus;

  @ApiPropertyOptional({ description: 'Blood group', enum: BloodGroup })
  @IsEnum(BloodGroup)
  @IsOptional()
  bloodGroup?: BloodGroup;

  @ApiPropertyOptional({ description: 'Nationality' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  nationality?: string;

  @ApiPropertyOptional({ description: 'Religion' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  religion?: string;

  @ApiProperty({ description: 'Personal email' })
  @IsEmail()
  @IsNotEmpty()
  @MaxLength(100)
  personalEmail: string;

  @ApiPropertyOptional({ description: 'Company email' })
  @IsEmail()
  @IsOptional()
  @MaxLength(100)
  companyEmail?: string;

  @ApiProperty({ description: 'Mobile number' })
  @IsString()
  @IsNotEmpty()
  @MaxLength(20)
  mobileNumber: string;

  @ApiPropertyOptional({ description: 'Alternate number' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  alternateNumber?: string;

  @ApiProperty({ description: 'Current address' })
  @IsString()
  @IsNotEmpty()
  currentAddress: string;

  @ApiPropertyOptional({ description: 'Permanent address' })
  @IsString()
  @IsOptional()
  permanentAddress?: string;

  @ApiPropertyOptional({ description: 'City' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  city?: string;

  @ApiPropertyOptional({ description: 'State' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  state?: string;

  @ApiPropertyOptional({ description: 'Postal code' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  postalCode?: string;

  @ApiPropertyOptional({ description: 'Country' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  country?: string;

  @ApiProperty({ description: 'Department ID' })
  @IsString()
  @IsNotEmpty()
  departmentId: string;

  @ApiProperty({ description: 'Designation ID' })
  @IsString()
  @IsNotEmpty()
  designationId: string;

  @ApiProperty({ description: 'Employment type', enum: EmploymentType })
  @IsEnum(EmploymentType)
  employmentType: EmploymentType;

  @ApiProperty({ description: 'Joining date (YYYY-MM-DD)' })
  @IsDateString()
  @IsNotEmpty()
  joiningDate: string;

  @ApiPropertyOptional({ description: 'Confirmation date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  confirmationDate?: string;

  @ApiPropertyOptional({ description: 'Probation end date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  probationEndDate?: string;

  @ApiPropertyOptional({ description: 'Reporting manager ID' })
  @IsString()
  @IsOptional()
  reportingManagerId?: string;

  @ApiPropertyOptional({ description: 'Reporting manager name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  reportingManagerName?: string;

  @ApiPropertyOptional({ description: 'Shift ID' })
  @IsString()
  @IsOptional()
  shiftId?: string;

  @ApiPropertyOptional({ description: 'Work location' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  workLocation?: string;

  @ApiPropertyOptional({ description: 'Branch' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  branch?: string;

  @ApiPropertyOptional({ description: 'Cost center' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  costCenter?: string;

  @ApiPropertyOptional({ description: 'Status', enum: EmployeeStatus })
  @IsEnum(EmployeeStatus)
  @IsOptional()
  status?: EmployeeStatus;

  @ApiProperty({ description: 'Basic salary' })
  @IsNumber()
  @Type(() => Number)
  basicSalary: number;

  @ApiProperty({ description: 'Gross salary' })
  @IsNumber()
  @Type(() => Number)
  grossSalary: number;

  @ApiPropertyOptional({ description: 'CTC (Cost to Company)' })
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  ctc?: number;

  @ApiPropertyOptional({ description: 'Salary frequency', default: 'Monthly' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  salaryFrequency?: string;

  @ApiPropertyOptional({ description: 'Salary structure ID' })
  @IsString()
  @IsOptional()
  salaryStructureId?: string;

  @ApiPropertyOptional({ description: 'Payment mode' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  paymentMode?: string;

  @ApiPropertyOptional({ description: 'Bank name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  bankName?: string;

  @ApiPropertyOptional({ description: 'Bank branch' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  bankBranch?: string;

  @ApiPropertyOptional({ description: 'Account number' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  accountNumber?: string;

  @ApiPropertyOptional({ description: 'IFSC code' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  ifscCode?: string;

  @ApiPropertyOptional({ description: 'Account holder name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  accountHolderName?: string;

  @ApiPropertyOptional({ description: 'PAN number' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  panNumber?: string;

  @ApiPropertyOptional({ description: 'Aadhar number' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  aadharNumber?: string;

  @ApiPropertyOptional({ description: 'Passport number' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  passportNumber?: string;

  @ApiPropertyOptional({ description: 'Passport expiry date (YYYY-MM-DD)' })
  @IsDateString()
  @IsOptional()
  passportExpiryDate?: string;

  @ApiPropertyOptional({ description: 'PF number' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  pfNumber?: string;

  @ApiPropertyOptional({ description: 'ESI number' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  esiNumber?: string;

  @ApiPropertyOptional({ description: 'UAN number' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  uanNumber?: string;

  @ApiPropertyOptional({ description: 'Emergency contact name' })
  @IsString()
  @IsOptional()
  @MaxLength(100)
  emergencyContactName?: string;

  @ApiPropertyOptional({ description: 'Emergency contact relation' })
  @IsString()
  @IsOptional()
  @MaxLength(50)
  emergencyContactRelation?: string;

  @ApiPropertyOptional({ description: 'Emergency contact phone' })
  @IsString()
  @IsOptional()
  @MaxLength(20)
  emergencyContactPhone?: string;

  @ApiPropertyOptional({ description: 'Education details' })
  @IsOptional()
  education?: Array<{
    degree: string;
    institution: string;
    yearOfPassing: number;
    percentage: number;
  }>;

  @ApiPropertyOptional({ description: 'Previous employment details' })
  @IsOptional()
  previousEmployment?: Array<{
    company: string;
    designation: string;
    from: string;
    to: string;
    responsibilities: string;
  }>;

  @ApiPropertyOptional({ description: 'Skills', type: [String] })
  @IsArray()
  @IsOptional()
  skills?: string[];

  @ApiPropertyOptional({ description: 'Certifications', type: [String] })
  @IsArray()
  @IsOptional()
  certifications?: string[];

  @ApiPropertyOptional({ description: 'Profile photo URL' })
  @IsString()
  @IsOptional()
  profilePhotoUrl?: string;

  @ApiPropertyOptional({ description: 'Notes' })
  @IsString()
  @IsOptional()
  notes?: string;

  @ApiPropertyOptional({ description: 'Custom fields' })
  @IsOptional()
  customFields?: Record<string, any>;
}
