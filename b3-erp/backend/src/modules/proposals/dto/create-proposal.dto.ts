import {
  IsString,
  IsOptional,
  IsEnum,
  IsArray,
  IsDate,
  MaxLength,
  IsObject,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ProposalType } from '../entities/proposal.entity';

export class CreateProposalDto {
  @ApiProperty({ description: 'Proposal title' })
  @IsString()
  @MaxLength(255)
  title: string;

  @ApiPropertyOptional({ description: 'Proposal description' })
  @IsOptional()
  @IsString()
  description?: string;

  @ApiPropertyOptional({ enum: ProposalType })
  @IsOptional()
  @IsEnum(ProposalType)
  type?: ProposalType;

  // Client Information
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerId?: string;

  @ApiProperty({ description: 'Customer name' })
  @IsString()
  customerName: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerContact?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  customerEmail?: string;

  // Reference
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rfpNumber?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  rfpId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  opportunityId?: string;

  // Content
  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  executiveSummary?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  scopeOfWork?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  deliverables?: Array<{
    name: string;
    description: string;
    timeline?: string;
  }>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  pricing?: {
    items: Array<{
      description: string;
      quantity: number;
      unitPrice: number;
      total: number;
    }>;
    subtotal: number;
    discount?: number;
    tax?: number;
    total: number;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  timeline?: {
    startDate?: string;
    endDate?: string;
    milestones?: Array<{
      name: string;
      date: string;
      description?: string;
    }>;
  };

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  termsAndConditions?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsObject()
  technicalSpecifications?: Record<string, unknown>;

  @ApiPropertyOptional()
  @IsOptional()
  @IsArray()
  teamMembers?: Array<{
    name: string;
    role: string;
    experience?: string;
  }>;

  // Metadata
  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  templateId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  assignedToId?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Date)
  @IsDate()
  validUntil?: Date;
}
