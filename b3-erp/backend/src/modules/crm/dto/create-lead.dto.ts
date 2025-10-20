import {
  IsString,
  IsEmail,
  IsOptional,
  IsEnum,
  IsNumber,
  IsArray,
  IsBoolean,
  IsDateString,
  IsObject,
  Min,
  Max,
  IsNotEmpty,
} from 'class-validator';
import { Type } from 'class-transformer';
import { LeadStatus, LeadRating } from '../entities/lead.entity';

export class CreateLeadDto {
  // Basic Information
  @IsString()
  @IsNotEmpty()
  firstName: string;

  @IsString()
  @IsNotEmpty()
  lastName: string;

  @IsString()
  @IsOptional()
  title?: string;

  @IsString()
  @IsNotEmpty()
  company: string;

  @IsString()
  @IsOptional()
  website?: string;

  @IsString()
  @IsOptional()
  industry?: string;

  @IsString()
  @IsOptional()
  employeeCount?: string;

  @IsString()
  @IsOptional()
  annualRevenue?: string;

  // Contact Information
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsOptional()
  phone?: string;

  @IsString()
  @IsOptional()
  mobile?: string;

  @IsString()
  @IsOptional()
  fax?: string;

  // Address Information
  @IsString()
  @IsOptional()
  street?: string;

  @IsString()
  @IsOptional()
  city?: string;

  @IsString()
  @IsOptional()
  state?: string;

  @IsString()
  @IsOptional()
  postalCode?: string;

  @IsString()
  @IsOptional()
  country?: string;

  // Lead Details
  @IsEnum(LeadStatus)
  @IsOptional()
  status?: LeadStatus;

  @IsEnum(LeadRating)
  @IsOptional()
  rating?: LeadRating;

  @IsString()
  @IsNotEmpty()
  leadSource: string;

  @IsString()
  @IsOptional()
  leadSubSource?: string;

  @IsString()
  @IsOptional()
  referredBy?: string;

  @IsString()
  @IsOptional()
  campaign?: string;

  // Opportunity Information
  @IsNumber()
  @IsOptional()
  @Type(() => Number)
  estimatedValue?: number;

  @IsDateString()
  @IsOptional()
  estimatedCloseDate?: string;

  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  probability?: number;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  productInterest?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  customProducts?: string[];

  // Assignment & Ownership
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsString()
  @IsOptional()
  teamAssignment?: string;

  // Additional Details
  @IsString()
  @IsOptional()
  description?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsObject()
  @IsOptional()
  customFields?: Record<string, any>;

  // Social Media
  @IsString()
  @IsOptional()
  linkedIn?: string;

  @IsString()
  @IsOptional()
  twitter?: string;

  @IsString()
  @IsOptional()
  facebook?: string;

  // Compliance & Privacy
  @IsBoolean()
  @IsOptional()
  gdprConsent?: boolean;

  @IsBoolean()
  @IsOptional()
  emailOptIn?: boolean;

  @IsBoolean()
  @IsOptional()
  smsOptIn?: boolean;

  @IsBoolean()
  @IsOptional()
  doNotCall?: boolean;

  // Lead Score
  @IsNumber()
  @IsOptional()
  @Min(0)
  @Max(100)
  @Type(() => Number)
  leadScore?: number;

  // Attachments
  @IsArray()
  @IsOptional()
  attachments?: Array<{
    id: string;
    name: string;
    size: number;
    type: string;
    url: string;
    uploadedAt: string;
  }>;
}
