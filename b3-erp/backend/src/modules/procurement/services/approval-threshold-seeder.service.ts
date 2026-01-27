import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export enum ApproverRole {
  PURCHASE_EXEC = 'PURCHASE_EXEC',
  PURCHASE_MGR = 'PURCHASE_MGR',
  FINANCE_MGR = 'FINANCE_MGR',
  GM = 'GM',
  CEO = 'CEO',
}

export interface ApprovalThreshold {
  id: string;
  level: number;
  name: string;
  minAmount: number;
  maxAmount: number;
  approverRole: ApproverRole;
  approverRoleName: string;
  slaHours: number;
  escalationAfterHours: number;
  requiresSequential: boolean;
  isActive: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface ApprovalThresholdSeedData {
  level: number;
  name: string;
  minAmount: number;
  maxAmount: number;
  approverRole: ApproverRole;
  approverRoleName: string;
  slaHours: number;
  escalationAfterHours: number;
  description: string;
}

@Injectable()
export class ApprovalThresholdSeederService implements OnModuleInit {
  private readonly logger = new Logger(ApprovalThresholdSeederService.name);
  private approvalThresholds: ApprovalThreshold[] = [];

  private readonly thresholdDefinitions: ApprovalThresholdSeedData[] = [
    {
      level: 1,
      name: 'Level 1 - Purchase Executive',
      minAmount: 0,
      maxAmount: 50000,
      approverRole: ApproverRole.PURCHASE_EXEC,
      approverRoleName: 'Purchase Executive',
      slaHours: 4,
      escalationAfterHours: 8,
      description: 'Small purchases up to INR 50,000 approved by Purchase Executive',
    },
    {
      level: 2,
      name: 'Level 2 - Purchase Manager',
      minAmount: 50001,
      maxAmount: 200000,
      approverRole: ApproverRole.PURCHASE_MGR,
      approverRoleName: 'Purchase Manager',
      slaHours: 8,
      escalationAfterHours: 16,
      description: 'Medium purchases from INR 50,001 to 2,00,000 approved by Purchase Manager',
    },
    {
      level: 3,
      name: 'Level 3 - Finance Manager',
      minAmount: 200001,
      maxAmount: 500000,
      approverRole: ApproverRole.FINANCE_MGR,
      approverRoleName: 'Finance Manager',
      slaHours: 16,
      escalationAfterHours: 32,
      description: 'Large purchases from INR 2,00,001 to 5,00,000 approved by Finance Manager',
    },
    {
      level: 4,
      name: 'Level 4 - General Manager',
      minAmount: 500001,
      maxAmount: 1000000,
      approverRole: ApproverRole.GM,
      approverRoleName: 'General Manager',
      slaHours: 24,
      escalationAfterHours: 48,
      description: 'High value purchases from INR 5,00,001 to 10,00,000 approved by General Manager',
    },
    {
      level: 5,
      name: 'Level 5 - Chief Executive Officer',
      minAmount: 1000001,
      maxAmount: 999999999999, // Effectively unlimited upper bound
      approverRole: ApproverRole.CEO,
      approverRoleName: 'Chief Executive Officer',
      slaHours: 48,
      escalationAfterHours: 72,
      description: 'Strategic purchases above INR 10,00,000 require CEO approval',
    },
  ];

  async onModuleInit(): Promise<void> {
    await this.seed();
  }

  async seed(): Promise<void> {
    this.logger.log('Starting approval threshold seeding...');

    for (const thresholdData of this.thresholdDefinitions) {
      try {
        const existingThreshold = this.approvalThresholds.find(
          (t) => t.level === thresholdData.level,
        );

        if (existingThreshold) {
          this.logger.debug(
            `Approval threshold Level ${thresholdData.level} already exists, skipping...`,
          );
          continue;
        }

        const threshold: ApprovalThreshold = {
          id: uuidv4(),
          ...thresholdData,
          requiresSequential: thresholdData.level >= 3, // Higher levels require sequential approval
          isActive: true,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        this.approvalThresholds.push(threshold);
        this.logger.log(
          `Created approval threshold: Level ${thresholdData.level} - ${thresholdData.approverRoleName} (${this.formatCurrency(thresholdData.minAmount)} - ${this.formatCurrency(thresholdData.maxAmount)})`,
        );
      } catch (error) {
        this.logger.error(
          `Failed to seed approval threshold Level ${thresholdData.level}: ${error.message}`,
        );
      }
    }

    this.logger.log('Approval threshold seeding completed.');
  }

  private formatCurrency(amount: number): string {
    if (amount >= 999999999999) {
      return 'Unlimited';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(amount);
  }

  // Get all approval thresholds
  async getAllThresholds(): Promise<ApprovalThreshold[]> {
    return [...this.approvalThresholds].sort((a, b) => a.level - b.level);
  }

  // Get threshold by level
  async getThresholdByLevel(level: number): Promise<ApprovalThreshold | null> {
    return this.approvalThresholds.find((t) => t.level === level) ?? null;
  }

  // Get threshold by approver role
  async getThresholdByRole(role: ApproverRole): Promise<ApprovalThreshold | null> {
    return this.approvalThresholds.find((t) => t.approverRole === role) ?? null;
  }

  // Find applicable threshold for a given amount
  async findThresholdForAmount(amount: number): Promise<ApprovalThreshold | null> {
    return (
      this.approvalThresholds.find(
        (t) => amount >= t.minAmount && amount <= t.maxAmount && t.isActive,
      ) ?? null
    );
  }

  // Get the approver role required for a given amount
  async getRequiredApproverRole(amount: number): Promise<ApproverRole | null> {
    const threshold = await this.findThresholdForAmount(amount);
    return threshold?.approverRole ?? null;
  }

  // Check if a role can approve a given amount
  async canRoleApprove(role: ApproverRole, amount: number): Promise<boolean> {
    const threshold = await this.findThresholdForAmount(amount);
    if (!threshold) return false;

    // Get the level of the given role
    const roleThreshold = await this.getThresholdByRole(role);
    if (!roleThreshold) return false;

    // A role can approve if its level is >= the required level
    return roleThreshold.level >= threshold.level;
  }

  // Get all thresholds a role can approve
  async getApprovableThresholds(role: ApproverRole): Promise<ApprovalThreshold[]> {
    const roleThreshold = await this.getThresholdByRole(role);
    if (!roleThreshold) return [];

    // Return all thresholds with level <= role's level
    return this.approvalThresholds.filter(
      (t) => t.level <= roleThreshold.level && t.isActive,
    );
  }

  // Update threshold (for admin use)
  async updateThreshold(
    level: number,
    updates: Partial<ApprovalThresholdSeedData>,
  ): Promise<ApprovalThreshold | null> {
    const index = this.approvalThresholds.findIndex((t) => t.level === level);
    if (index === -1) return null;

    // Validate amount ranges don't overlap
    if (updates.minAmount !== undefined || updates.maxAmount !== undefined) {
      const newMin = updates.minAmount ?? this.approvalThresholds[index].minAmount;
      const newMax = updates.maxAmount ?? this.approvalThresholds[index].maxAmount;

      for (let i = 0; i < this.approvalThresholds.length; i++) {
        if (i === index) continue;
        const other = this.approvalThresholds[i];
        if (
          (newMin >= other.minAmount && newMin <= other.maxAmount) ||
          (newMax >= other.minAmount && newMax <= other.maxAmount)
        ) {
          throw new Error(
            `Amount range ${newMin}-${newMax} overlaps with Level ${other.level}`,
          );
        }
      }
    }

    this.approvalThresholds[index] = {
      ...this.approvalThresholds[index],
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    return this.approvalThresholds[index];
  }

  // Deactivate a threshold
  async deactivateThreshold(level: number): Promise<boolean> {
    const threshold = this.approvalThresholds.find((t) => t.level === level);
    if (!threshold) return false;

    threshold.isActive = false;
    threshold.updatedAt = new Date().toISOString();
    return true;
  }

  // Get threshold summary for display
  async getThresholdSummary(): Promise<
    Array<{
      level: number;
      role: string;
      range: string;
      sla: string;
    }>
  > {
    return this.approvalThresholds
      .filter((t) => t.isActive)
      .sort((a, b) => a.level - b.level)
      .map((t) => ({
        level: t.level,
        role: t.approverRoleName,
        range: `${this.formatCurrency(t.minAmount)} - ${this.formatCurrency(t.maxAmount)}`,
        sla: `${t.slaHours} hours`,
      }));
  }

  // Get seed definitions (without database state)
  getThresholdDefinitions(): ApprovalThresholdSeedData[] {
    return [...this.thresholdDefinitions];
  }
}
