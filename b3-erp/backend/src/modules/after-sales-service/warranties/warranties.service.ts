import { Injectable } from '@nestjs/common';
import { CreateWarrantyDto } from '../dto/create-warranty.dto';
import { UpdateWarrantyDto } from '../dto/update-warranty.dto';
import { CreateWarrantyClaimDto } from '../dto/create-warranty-claim.dto';
import {
  Warranty,
  WarrantyClaim,
  WarrantyStatus,
  ClaimStatus,
} from '../entities/warranty.entity';

@Injectable()
export class WarrantiesService {
  private warranties: Warranty[] = [];
  private claims: WarrantyClaim[] = [];
  private warrantyIdCounter = 1;
  private claimIdCounter = 1;

  create(createWarrantyDto: CreateWarrantyDto): Warranty {
    const warranty: Warranty = {
      id: `WARRANTY-${String(this.warrantyIdCounter++).padStart(6, '0')}`,
      warrantyNumber: `WRN-${new Date().getFullYear()}-${String(this.warrantyIdCounter).padStart(5, '0')}`,
      status: WarrantyStatus.ACTIVE,
      ...createWarrantyDto,
      claimCount: 0,
      totalClaimValue: 0,
      remainingCoverage: 100,
      transferHistory: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.warranties.push(warranty);
    return warranty;
  }

  findAll(filters?: {
    status?: string;
    customerId?: string;
    warrantyType?: string;
  }): Warranty[] {
    let filtered = [...this.warranties];

    if (filters?.status) {
      filtered = filtered.filter((w) => w.status === filters.status);
    }
    if (filters?.customerId) {
      filtered = filtered.filter((w) => w.customerId === filters.customerId);
    }
    if (filters?.warrantyType) {
      filtered = filtered.filter(
        (w) => w.warrantyType === filters.warrantyType,
      );
    }

    return filtered;
  }

  findOne(id: string): Warranty | null {
    return this.warranties.find((w) => w.id === id) || null;
  }

  update(
    id: string,
    updateWarrantyDto: UpdateWarrantyDto,
  ): Warranty | null {
    const index = this.warranties.findIndex((w) => w.id === id);
    if (index === -1) return null;

    this.warranties[index] = {
      ...this.warranties[index],
      ...updateWarrantyDto,
      updatedAt: new Date(),
    };

    return this.warranties[index];
  }

  extendWarranty(
    id: string,
    durationMonths: number,
    extensionValue: number,
    updatedBy: string,
  ): Warranty | null {
    const warranty = this.findOne(id);
    if (!warranty) return null;

    // Calculate new end date
    const newEndDate = new Date(warranty.endDate);
    newEndDate.setMonth(newEndDate.getMonth() + durationMonths);

    // Create extended warranty
    const extendedWarranty: Warranty = {
      ...warranty,
      id: `WARRANTY-${String(this.warrantyIdCounter++).padStart(6, '0')}`,
      warrantyNumber: `WRN-${new Date().getFullYear()}-${String(this.warrantyIdCounter).padStart(5, '0')}`,
      status: WarrantyStatus.ACTIVE,
      endDate: newEndDate,
      durationMonths: warranty.durationMonths + durationMonths,
      isExtended: true,
      baseWarrantyId: warranty.isExtended ? warranty.baseWarrantyId : id,
      extensionValue,
      extensionDate: new Date(),
      claimCount: 0,
      totalClaimValue: 0,
      remainingCoverage: 100,
      updatedBy,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Mark original warranty as extended
    warranty.status = WarrantyStatus.EXTENDED;
    warranty.updatedBy = updatedBy;
    warranty.updatedAt = new Date();

    this.warranties.push(extendedWarranty);
    return extendedWarranty;
  }

  transferWarranty(
    id: string,
    newCustomerId: string,
    newCustomerName: string,
    transferReason: string,
    transferredBy: string,
  ): Warranty | null {
    const warranty = this.findOne(id);
    if (!warranty) return null;

    // Record transfer history
    const transferRecord = {
      fromCustomerId: warranty.customerId,
      fromCustomerName: warranty.customerName,
      toCustomerId: newCustomerId,
      toCustomerName: newCustomerName,
      transferDate: new Date(),
      transferReason,
      transferredBy,
    };

    warranty.transferHistory = warranty.transferHistory || [];
    warranty.transferHistory.push(transferRecord);

    // Update customer details
    warranty.customerId = newCustomerId;
    warranty.customerName = newCustomerName;
    warranty.updatedBy = transferredBy;
    warranty.updatedAt = new Date();

    return warranty;
  }

  voidWarranty(
    id: string,
    reason: string,
    updatedBy: string,
  ): Warranty | null {
    const warranty = this.findOne(id);
    if (!warranty) return null;

    warranty.status = WarrantyStatus.VOID;
    warranty.voidDate = new Date();
    warranty.voidReason = reason;
    warranty.updatedBy = updatedBy;
    warranty.updatedAt = new Date();

    return warranty;
  }

  getExpiringWarranties(days: number): Warranty[] {
    const now = new Date();
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + days);

    return this.warranties.filter((warranty) => {
      return (
        warranty.status === WarrantyStatus.ACTIVE &&
        warranty.endDate >= now &&
        warranty.endDate <= futureDate
      );
    });
  }

  createClaim(
    warrantyId: string,
    createWarrantyClaimDto: CreateWarrantyClaimDto,
  ): WarrantyClaim | null {
    const warranty = this.findOne(warrantyId);
    if (!warranty) return null;

    if (warranty.status !== WarrantyStatus.ACTIVE) {
      throw new Error('Can only create claims for active warranties');
    }

    const claim: WarrantyClaim = {
      id: `CLAIM-${String(this.claimIdCounter++).padStart(6, '0')}`,
      claimNumber: `WCL-${new Date().getFullYear()}-${String(this.claimIdCounter).padStart(5, '0')}`,
      warrantyId,
      warrantyNumber: warranty.warrantyNumber,
      status: ClaimStatus.SUBMITTED,
      ...createWarrantyClaimDto,
      evaluationDate: null,
      approvalDate: null,
      rejectionDate: null,
      completionDate: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    this.claims.push(claim);

    // Update warranty claim count
    warranty.claimCount += 1;
    warranty.lastClaimDate = new Date();
    warranty.updatedAt = new Date();

    return claim;
  }

  findClaim(claimId: string): WarrantyClaim | null {
    return this.claims.find((c) => c.id === claimId) || null;
  }

  approveClaim(
    claimId: string,
    approvedBy: string,
    approvalNotes?: string,
  ): WarrantyClaim | null {
    const claim = this.findClaim(claimId);
    if (!claim) return null;

    claim.status = ClaimStatus.APPROVED;
    claim.approvalDate = new Date();
    claim.approvedBy = approvedBy;
    claim.approvalNotes = approvalNotes;
    claim.updatedAt = new Date();

    return claim;
  }

  rejectClaim(
    claimId: string,
    rejectedBy: string,
    rejectionReason: string,
  ): WarrantyClaim | null {
    const claim = this.findClaim(claimId);
    if (!claim) return null;

    claim.status = ClaimStatus.REJECTED;
    claim.rejectionDate = new Date();
    claim.rejectedBy = rejectedBy;
    claim.rejectionReason = rejectionReason;
    claim.updatedAt = new Date();

    return claim;
  }

  closeClaim(
    claimId: string,
    resolution: string,
    closedBy: string,
    actualCost?: number,
    partsReplaced?: string[],
  ): WarrantyClaim | null {
    const claim = this.findClaim(claimId);
    if (!claim) return null;

    claim.status = ClaimStatus.CLOSED;
    claim.completionDate = new Date();
    claim.resolution = resolution;
    claim.actualCost = actualCost;
    claim.partsReplaced = partsReplaced;
    claim.updatedAt = new Date();

    // Update warranty total claim value
    const warranty = this.findOne(claim.warrantyId);
    if (warranty && actualCost) {
      warranty.totalClaimValue += actualCost;
      warranty.updatedAt = new Date();
    }

    return claim;
  }

  getStatistics() {
    const total = this.warranties.length;
    const active = this.warranties.filter(
      (w) => w.status === WarrantyStatus.ACTIVE,
    ).length;
    const expiring30Days = this.getExpiringWarranties(30).length;
    const totalClaims = this.claims.length;
    const pendingClaims = this.claims.filter(
      (c) => c.status === ClaimStatus.SUBMITTED,
    ).length;
    const approvedClaims = this.claims.filter(
      (c) => c.status === ClaimStatus.APPROVED,
    ).length;

    return {
      totalWarranties: total,
      activeWarranties: active,
      expiringIn30Days: expiring30Days,
      totalClaims,
      pendingClaims,
      approvedClaims,
      claimApprovalRate:
        totalClaims > 0 ? (approvedClaims / totalClaims) * 100 : 0,
      averageClaimsPerWarranty: total > 0 ? totalClaims / total : 0,
    };
  }

  remove(id: string): { message: string } {
    const index = this.warranties.findIndex((w) => w.id === id);
    if (index === -1) {
      return { message: 'Warranty not found' };
    }

    this.warranties.splice(index, 1);
    return { message: 'Warranty deleted successfully' };
  }
}
