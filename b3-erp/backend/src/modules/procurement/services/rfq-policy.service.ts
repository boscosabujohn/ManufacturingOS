import { Injectable, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type PolicyViolationType = 'insufficient_vendors' | 'single_source' | 'limited_competition' | 'vendor_concentration';
export type ExceptionReason = 'emergency' | 'proprietary' | 'standardization' | 'government_directive' | 'time_critical' | 'existing_contract' | 'other';
export type ExceptionStatus = 'pending' | 'approved' | 'rejected' | 'expired';

export interface VendorPolicyConfig {
  id: string;
  name: string;
  minVendorsRequired: number;
  minQuotationsRequired: number;
  maxSingleVendorPercentage: number; // Max % of spend with single vendor
  requiredCategoryTypes: string[]; // e.g., ['local', 'international']
  valueThreshold: number; // Policy applies above this value
  exceptionApprovalRequired: boolean;
  exceptionApprovers: string[];
  isActive: boolean;
}

export interface PolicyException {
  id: string;
  rfqId: string;
  rfqNumber: string;
  requestedBy: string;
  requestedByName: string;
  requestedAt: string;
  reason: ExceptionReason;
  justification: string;
  proposedVendorCount: number;
  proposedVendors: string[];
  amount: number;
  status: ExceptionStatus;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  rejectionReason?: string;
  validUntil?: string;
  attachments?: string[];
}

export interface PolicyValidation {
  isCompliant: boolean;
  violations: PolicyViolation[];
  warnings: string[];
  requiresException: boolean;
  exceptionId?: string;
}

export interface PolicyViolation {
  type: PolicyViolationType;
  message: string;
  severity: 'error' | 'warning';
  suggestedAction: string;
}

export interface RFQComplianceReport {
  rfqId: string;
  rfqNumber: string;
  amount: number;
  vendorsInvited: number;
  quotationsReceived: number;
  complianceStatus: 'compliant' | 'exception_approved' | 'non_compliant';
  policyApplied: string;
  validationDate: string;
}

export interface VendorPerformanceMetrics {
  vendorId: string;
  vendorName: string;
  rfqsReceived: number;
  quotationsSubmitted: number;
  responseRate: number;
  averageResponseTime: number; // hours
  winRate: number;
  lastQuotationDate?: string;
}

@Injectable()
export class RFQPolicyService {
  private policies: VendorPolicyConfig[] = [];
  private exceptions: PolicyException[] = [];
  private complianceRecords: RFQComplianceReport[] = [];

  constructor() {
    this.initializeDefaultPolicies();
  }

  // Policy Configuration
  async createPolicy(policy: Partial<VendorPolicyConfig>): Promise<VendorPolicyConfig> {
    const newPolicy: VendorPolicyConfig = {
      id: uuidv4(),
      name: policy.name || 'Standard RFQ Policy',
      minVendorsRequired: policy.minVendorsRequired ?? 3,
      minQuotationsRequired: policy.minQuotationsRequired ?? 3,
      maxSingleVendorPercentage: policy.maxSingleVendorPercentage ?? 40,
      requiredCategoryTypes: policy.requiredCategoryTypes || [],
      valueThreshold: policy.valueThreshold ?? 50000,
      exceptionApprovalRequired: policy.exceptionApprovalRequired ?? true,
      exceptionApprovers: policy.exceptionApprovers || [],
      isActive: policy.isActive ?? true,
    };

    this.policies.push(newPolicy);
    return newPolicy;
  }

  async getActivePolicy(): Promise<VendorPolicyConfig | null> {
    return this.policies.find(p => p.isActive) || null;
  }

  async updatePolicy(id: string, updates: Partial<VendorPolicyConfig>): Promise<VendorPolicyConfig> {
    const index = this.policies.findIndex(p => p.id === id);
    if (index === -1) {
      throw new BadRequestException(`Policy ${id} not found`);
    }

    this.policies[index] = {
      ...this.policies[index],
      ...updates,
    };

    return this.policies[index];
  }

  // Policy Validation
  async validateRFQCompliance(
    rfqId: string,
    rfqNumber: string,
    amount: number,
    invitedVendors: Array<{ vendorId: string; vendorName: string; category?: string }>,
    receivedQuotations: Array<{ vendorId: string; amount: number }>
  ): Promise<PolicyValidation> {
    const policy = await this.getActivePolicy();
    if (!policy || amount < policy.valueThreshold) {
      return {
        isCompliant: true,
        violations: [],
        warnings: [],
        requiresException: false,
      };
    }

    const violations: PolicyViolation[] = [];
    const warnings: string[] = [];

    // Check minimum vendors invited
    if (invitedVendors.length < policy.minVendorsRequired) {
      violations.push({
        type: 'insufficient_vendors',
        message: `Only ${invitedVendors.length} vendor(s) invited, minimum ${policy.minVendorsRequired} required`,
        severity: 'error',
        suggestedAction: `Invite at least ${policy.minVendorsRequired - invitedVendors.length} more vendor(s)`,
      });
    }

    // Check minimum quotations received
    if (receivedQuotations.length < policy.minQuotationsRequired) {
      if (receivedQuotations.length === 0) {
        warnings.push('No quotations received yet');
      } else if (receivedQuotations.length < policy.minQuotationsRequired) {
        violations.push({
          type: 'limited_competition',
          message: `Only ${receivedQuotations.length} quotation(s) received, minimum ${policy.minQuotationsRequired} required`,
          severity: 'error',
          suggestedAction: 'Wait for more quotations or request exception',
        });
      }
    }

    // Check for single source
    if (invitedVendors.length === 1) {
      violations.push({
        type: 'single_source',
        message: 'Single source procurement requires exception approval',
        severity: 'error',
        suggestedAction: 'Submit single source exception request with justification',
      });
    }

    // Check vendor concentration
    if (receivedQuotations.length > 0) {
      const lowestQuotation = receivedQuotations.reduce((min, q) =>
        q.amount < min.amount ? q : min
      );

      // Check if lowest vendor has too much business (mock check)
      // In production, this would check against actual spend data
    }

    // Check required category types
    if (policy.requiredCategoryTypes.length > 0) {
      const vendorCategories = new Set(invitedVendors.map(v => v.category).filter(Boolean));
      const missingCategories = policy.requiredCategoryTypes.filter(
        cat => !vendorCategories.has(cat)
      );

      if (missingCategories.length > 0) {
        warnings.push(`Missing vendor categories: ${missingCategories.join(', ')}`);
      }
    }

    // Check for existing approved exception
    const existingException = this.exceptions.find(
      e => e.rfqId === rfqId && e.status === 'approved'
    );

    const isCompliant = violations.filter(v => v.severity === 'error').length === 0;
    const requiresException = !isCompliant && !existingException;

    // Record compliance check
    this.complianceRecords.push({
      rfqId,
      rfqNumber,
      amount,
      vendorsInvited: invitedVendors.length,
      quotationsReceived: receivedQuotations.length,
      complianceStatus: isCompliant ? 'compliant' : existingException ? 'exception_approved' : 'non_compliant',
      policyApplied: policy.name,
      validationDate: new Date().toISOString(),
    });

    return {
      isCompliant: isCompliant || !!existingException,
      violations,
      warnings,
      requiresException,
      exceptionId: existingException?.id,
    };
  }

  // Exception Management
  async requestException(request: Partial<PolicyException>): Promise<PolicyException> {
    const exception: PolicyException = {
      id: uuidv4(),
      rfqId: request.rfqId || '',
      rfqNumber: request.rfqNumber || '',
      requestedBy: request.requestedBy || '',
      requestedByName: request.requestedByName || '',
      requestedAt: new Date().toISOString(),
      reason: request.reason || 'other',
      justification: request.justification || '',
      proposedVendorCount: request.proposedVendorCount || 1,
      proposedVendors: request.proposedVendors || [],
      amount: request.amount || 0,
      status: 'pending',
      attachments: request.attachments,
    };

    this.exceptions.push(exception);
    return exception;
  }

  async approveException(
    exceptionId: string,
    approvedBy: string,
    approvedByName: string,
    validDays: number = 30
  ): Promise<PolicyException> {
    const exception = this.exceptions.find(e => e.id === exceptionId);
    if (!exception) {
      throw new BadRequestException(`Exception ${exceptionId} not found`);
    }

    if (exception.status !== 'pending') {
      throw new BadRequestException('Exception is not pending approval');
    }

    exception.status = 'approved';
    exception.approvedBy = approvedBy;
    exception.approvedByName = approvedByName;
    exception.approvedAt = new Date().toISOString();

    const validUntil = new Date();
    validUntil.setDate(validUntil.getDate() + validDays);
    exception.validUntil = validUntil.toISOString();

    return exception;
  }

  async rejectException(
    exceptionId: string,
    rejectedBy: string,
    rejectionReason: string
  ): Promise<PolicyException> {
    const exception = this.exceptions.find(e => e.id === exceptionId);
    if (!exception) {
      throw new BadRequestException(`Exception ${exceptionId} not found`);
    }

    if (exception.status !== 'pending') {
      throw new BadRequestException('Exception is not pending');
    }

    exception.status = 'rejected';
    exception.approvedBy = rejectedBy;
    exception.approvedAt = new Date().toISOString();
    exception.rejectionReason = rejectionReason;

    return exception;
  }

  async getPendingExceptions(): Promise<PolicyException[]> {
    return this.exceptions.filter(e => e.status === 'pending');
  }

  async getExceptionsByRFQ(rfqId: string): Promise<PolicyException[]> {
    return this.exceptions.filter(e => e.rfqId === rfqId);
  }

  // Vendor Performance Tracking
  async getVendorResponseMetrics(vendorId: string): Promise<VendorPerformanceMetrics> {
    // Mock implementation - in production, this would query actual data
    return {
      vendorId,
      vendorName: 'Sample Vendor',
      rfqsReceived: 25,
      quotationsSubmitted: 20,
      responseRate: 80,
      averageResponseTime: 48,
      winRate: 35,
      lastQuotationDate: new Date().toISOString(),
    };
  }

  async getVendorRanking(): Promise<Array<VendorPerformanceMetrics & { rank: number }>> {
    // Mock data for vendor ranking
    const vendors: VendorPerformanceMetrics[] = [
      {
        vendorId: 'v1',
        vendorName: 'Alpha Suppliers',
        rfqsReceived: 50,
        quotationsSubmitted: 48,
        responseRate: 96,
        averageResponseTime: 24,
        winRate: 45,
      },
      {
        vendorId: 'v2',
        vendorName: 'Beta Industries',
        rfqsReceived: 40,
        quotationsSubmitted: 35,
        responseRate: 87.5,
        averageResponseTime: 36,
        winRate: 40,
      },
      {
        vendorId: 'v3',
        vendorName: 'Gamma Corp',
        rfqsReceived: 30,
        quotationsSubmitted: 22,
        responseRate: 73.3,
        averageResponseTime: 48,
        winRate: 30,
      },
    ];

    return vendors
      .sort((a, b) => b.responseRate - a.responseRate)
      .map((v, index) => ({ ...v, rank: index + 1 }));
  }

  // Reporting
  async getComplianceStatistics(): Promise<{
    totalRFQs: number;
    compliantRFQs: number;
    exceptionsApproved: number;
    nonCompliant: number;
    complianceRate: number;
    averageVendorsPerRFQ: number;
    averageQuotationsPerRFQ: number;
    exceptionsByReason: Record<ExceptionReason, number>;
  }> {
    const compliant = this.complianceRecords.filter(r => r.complianceStatus === 'compliant');
    const exceptions = this.complianceRecords.filter(r => r.complianceStatus === 'exception_approved');
    const nonCompliant = this.complianceRecords.filter(r => r.complianceStatus === 'non_compliant');

    const exceptionsByReason: Record<ExceptionReason, number> = {
      emergency: 0,
      proprietary: 0,
      standardization: 0,
      government_directive: 0,
      time_critical: 0,
      existing_contract: 0,
      other: 0,
    };

    for (const exception of this.exceptions.filter(e => e.status === 'approved')) {
      exceptionsByReason[exception.reason]++;
    }

    const totalVendors = this.complianceRecords.reduce((sum, r) => sum + r.vendorsInvited, 0);
    const totalQuotations = this.complianceRecords.reduce((sum, r) => sum + r.quotationsReceived, 0);

    return {
      totalRFQs: this.complianceRecords.length,
      compliantRFQs: compliant.length,
      exceptionsApproved: exceptions.length,
      nonCompliant: nonCompliant.length,
      complianceRate: this.complianceRecords.length > 0
        ? Math.round(((compliant.length + exceptions.length) / this.complianceRecords.length) * 100)
        : 100,
      averageVendorsPerRFQ: this.complianceRecords.length > 0
        ? Math.round((totalVendors / this.complianceRecords.length) * 10) / 10
        : 0,
      averageQuotationsPerRFQ: this.complianceRecords.length > 0
        ? Math.round((totalQuotations / this.complianceRecords.length) * 10) / 10
        : 0,
      exceptionsByReason,
    };
  }

  async getComplianceReport(
    startDate?: string,
    endDate?: string
  ): Promise<RFQComplianceReport[]> {
    let records = [...this.complianceRecords];

    if (startDate) {
      records = records.filter(r => r.validationDate >= startDate);
    }
    if (endDate) {
      records = records.filter(r => r.validationDate <= endDate);
    }

    return records.sort((a, b) =>
      new Date(b.validationDate).getTime() - new Date(a.validationDate).getTime()
    );
  }

  async suggestVendors(
    itemCategory: string,
    requiredCount: number = 3
  ): Promise<Array<{ vendorId: string; vendorName: string; score: number; reason: string }>> {
    // Mock vendor suggestions based on category
    // In production, this would query vendor database with performance metrics
    const suggestions = [
      {
        vendorId: 'v1',
        vendorName: 'Alpha Suppliers',
        score: 95,
        reason: 'High response rate (96%), competitive pricing',
      },
      {
        vendorId: 'v2',
        vendorName: 'Beta Industries',
        score: 88,
        reason: 'Good track record in category, fast delivery',
      },
      {
        vendorId: 'v3',
        vendorName: 'Gamma Corp',
        score: 82,
        reason: 'Certified supplier, quality products',
      },
      {
        vendorId: 'v4',
        vendorName: 'Delta Trading',
        score: 78,
        reason: 'Competitive pricing, local supplier',
      },
      {
        vendorId: 'v5',
        vendorName: 'Epsilon Enterprises',
        score: 75,
        reason: 'New vendor with good ratings',
      },
    ];

    return suggestions.slice(0, requiredCount);
  }

  private initializeDefaultPolicies(): void {
    this.createPolicy({
      name: 'Standard 3-Vendor Policy',
      minVendorsRequired: 3,
      minQuotationsRequired: 3,
      maxSingleVendorPercentage: 40,
      requiredCategoryTypes: [],
      valueThreshold: 50000,
      exceptionApprovalRequired: true,
      exceptionApprovers: ['procurement-head', 'finance-manager'],
      isActive: true,
    });

    // Create sample compliance records
    this.complianceRecords.push(
      {
        rfqId: 'rfq-001',
        rfqNumber: 'RFQ-202401-001',
        amount: 150000,
        vendorsInvited: 4,
        quotationsReceived: 3,
        complianceStatus: 'compliant',
        policyApplied: 'Standard 3-Vendor Policy',
        validationDate: new Date().toISOString(),
      },
      {
        rfqId: 'rfq-002',
        rfqNumber: 'RFQ-202401-002',
        amount: 250000,
        vendorsInvited: 5,
        quotationsReceived: 4,
        complianceStatus: 'compliant',
        policyApplied: 'Standard 3-Vendor Policy',
        validationDate: new Date().toISOString(),
      }
    );
  }
}
