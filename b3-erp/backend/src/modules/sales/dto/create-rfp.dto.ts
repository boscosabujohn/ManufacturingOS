import {
  IsString,
  IsEnum,
  IsOptional,
  IsDateString,
  IsNumber,
  IsArray,
  ValidateNested,
  IsEmail,
  Min,
  Max,
} from 'class-validator';
import { Type } from 'class-transformer';
import { RFPStatus, RFPPriority, RFPType } from '../entities/rfp.entity';

export class CreateRFPItemDto {
  @IsString()
  itemName: string;

  @IsString()
  description: string;

  @IsNumber()
  quantity: number;

  @IsString()
  unit: string;

  @IsString()
  @IsOptional()
  specifications?: string;

  @IsNumber()
  @IsOptional()
  estimatedCost?: number;

  @IsString()
  @IsOptional()
  notes?: string;
}

export class CreateRFPRequirementDto {
  @IsString()
  category: string;

  @IsString()
  requirement: string;

  @IsEnum(['must_have', 'should_have', 'nice_to_have'])
  priority: 'must_have' | 'should_have' | 'nice_to_have';

  @IsString()
  @IsOptional()
  details?: string;
}

export class CreateRFPTimelineDto {
  @IsString()
  milestone: string;

  @IsDateString()
  expectedDate: string;

  @IsString()
  @IsOptional()
  description?: string;
}

export class CreateRFPDto {
  @IsString()
  title: string;

  @IsString()
  description: string;

  @IsEnum(RFPType)
  type: RFPType;

  @IsEnum(RFPStatus)
  @IsOptional()
  status?: RFPStatus;

  @IsEnum(RFPPriority)
  priority: RFPPriority;

  // Customer Information
  @IsString()
  @IsOptional()
  customerId?: string;

  @IsString()
  customerName: string;

  @IsString()
  @IsOptional()
  contactPerson?: string;

  @IsEmail()
  @IsOptional()
  contactEmail?: string;

  @IsString()
  @IsOptional()
  contactPhone?: string;

  // RFP Dates
  @IsDateString()
  issueDate: string;

  @IsDateString()
  submissionDeadline: string;

  @IsDateString()
  @IsOptional()
  expectedStartDate?: string;

  @IsDateString()
  @IsOptional()
  expectedCompletionDate?: string;

  // Project Details
  @IsString()
  projectScope: string;

  @IsArray()
  @IsString({ each: true })
  deliverables: string[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRFPItemDto)
  items: CreateRFPItemDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRFPRequirementDto)
  @IsOptional()
  requirements?: CreateRFPRequirementDto[];

  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateRFPTimelineDto)
  @IsOptional()
  timeline?: CreateRFPTimelineDto[];

  // Financial
  @IsNumber()
  @IsOptional()
  estimatedBudget?: number;

  @IsString()
  @IsOptional()
  currency?: string;

  @IsString()
  @IsOptional()
  paymentTerms?: string;

  // Proposal Details
  @IsDateString()
  @IsOptional()
  proposalSubmittedDate?: string;

  @IsNumber()
  @IsOptional()
  proposalValue?: number;

  @IsNumber()
  @IsOptional()
  proposalValidityDays?: number;

  // Technical Requirements
  @IsString()
  @IsOptional()
  technicalSpecifications?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  complianceRequirements?: string[];

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  certifications?: string[];

  // Evaluation
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  evaluationCriteria?: string[];

  // Team and Assignment
  @IsString()
  @IsOptional()
  assignedTo?: string;

  @IsString()
  @IsOptional()
  salesPerson?: string;

  @IsString()
  @IsOptional()
  estimator?: string;

  @IsString()
  @IsOptional()
  technicalLead?: string;

  // Tracking
  @IsString()
  @IsOptional()
  notes?: string;

  @IsString()
  @IsOptional()
  internalComments?: string;

  @IsString()
  @IsOptional()
  competitorAnalysis?: string;

  @IsNumber()
  @Min(0)
  @Max(100)
  @IsOptional()
  winProbability?: number;

  // Related Records
  @IsString()
  @IsOptional()
  relatedQuotationId?: string;

  @IsString()
  @IsOptional()
  relatedOrderId?: string;

  @IsString()
  @IsOptional()
  relatedOpportunityId?: string;

  // Tags and Categories
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsOptional()
  category?: string;

  // Workflow
  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  approvers?: string[];

  @IsString()
  createdBy: string;
}
