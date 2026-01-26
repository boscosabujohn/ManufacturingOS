import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalChain, ApprovalLevel } from '../entities';

/**
 * Seeder service for approval chain templates
 * Seeds predefined approval chains for Sales Orders, Purchase Orders, Leave, and Expense Claims
 * Following INR currency thresholds
 */
@Injectable()
export class ApprovalChainSeederService implements OnModuleInit {
  private readonly logger = new Logger(ApprovalChainSeederService.name);

  constructor(
    @InjectRepository(ApprovalChain)
    private readonly chainRepository: Repository<ApprovalChain>,
    @InjectRepository(ApprovalLevel)
    private readonly levelRepository: Repository<ApprovalLevel>,
  ) {}

  async onModuleInit(): Promise<void> {
    await this.seedAll();
  }

  async seedAll(): Promise<void> {
    this.logger.log('Starting approval chain seeding...');
    await this.seedSalesOrderApprovalChain();
    await this.seedPurchaseOrderApprovalChain();
    await this.seedLeaveApprovalChain();
    await this.seedExpenseClaimApprovalChain();
    this.logger.log('Approval chain seeding completed');
  }

  /**
   * Sales Order Approval Chain
   * Threshold-based approval hierarchy in INR
   * - Level 1: Sales Executive (up to ₹1 Lakh)
   * - Level 2: Sales Manager (up to ₹5 Lakhs)
   * - Level 3: GM Sales (up to ₹25 Lakhs)
   * - Level 4: Director (above ₹25 Lakhs)
   */
  async seedSalesOrderApprovalChain(): Promise<void> {
    this.logger.log('Seeding Sales Order Approval Chain...');

    const existingChain = await this.chainRepository.findOne({
      where: { name: 'Sales Order Approval Chain', entityType: 'sales_order_approval' },
    });

    if (existingChain) {
      this.logger.log('Sales Order Approval Chain already exists, skipping...');
      return;
    }

    try {
      const chain = this.chainRepository.create({
        name: 'Sales Order Approval Chain',
        entityType: 'sales_order_approval',
        description: 'Hierarchical approval chain for sales orders based on order value thresholds in INR',
        isActive: true,
      });

      const savedChain = await this.chainRepository.save(chain);

      const levels = [
        {
          chainId: savedChain.id,
          sequence: 1,
          approverType: 'role',
          approverIds: ['sales_executive'],
          requiredCount: 1,
          slaHours: 4,
          conditions: { amount: { lte: 100000 } }, // Up to ₹1 Lakh
          escalationRules: {
            onSLABreach: 'notify_sales_manager',
            autoEscalate: true,
            escalateAfterHours: 6,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 2,
          approverType: 'role',
          approverIds: ['sales_manager'],
          requiredCount: 1,
          slaHours: 8,
          conditions: {
            $and: [
              { amount: { gt: 100000 } },
              { amount: { lte: 500000 } }
            ]
          }, // ₹1 Lakh to ₹5 Lakhs
          escalationRules: {
            onSLABreach: 'notify_gm_sales',
            autoEscalate: true,
            escalateAfterHours: 12,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 3,
          approverType: 'role',
          approverIds: ['gm_sales'],
          requiredCount: 1,
          slaHours: 24,
          conditions: {
            $and: [
              { amount: { gt: 500000 } },
              { amount: { lte: 2500000 } }
            ]
          }, // ₹5 Lakhs to ₹25 Lakhs
          escalationRules: {
            onSLABreach: 'notify_director',
            autoEscalate: true,
            escalateAfterHours: 36,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 4,
          approverType: 'role',
          approverIds: ['director'],
          requiredCount: 1,
          slaHours: 48,
          conditions: { amount: { gt: 2500000 } }, // Above ₹25 Lakhs
          escalationRules: {
            onSLABreach: 'notify_ceo',
            autoEscalate: false,
            escalateAfterHours: 72,
          },
        },
      ];

      await this.levelRepository.save(levels);
      this.logger.log('Sales Order Approval Chain created successfully');
    } catch (error) {
      this.logger.error(`Failed to seed Sales Order Approval Chain: ${error.message}`);
    }
  }

  /**
   * Purchase Order Approval Chain
   * Five-level approval hierarchy in INR
   * - Level 1: Purchase Executive (up to ₹50K)
   * - Level 2: Purchase Manager (up to ₹2 Lakhs)
   * - Level 3: Finance Manager (up to ₹5 Lakhs)
   * - Level 4: GM (up to ₹10 Lakhs)
   * - Level 5: CEO (above ₹10 Lakhs)
   */
  async seedPurchaseOrderApprovalChain(): Promise<void> {
    this.logger.log('Seeding Purchase Order Approval Chain...');

    const existingChain = await this.chainRepository.findOne({
      where: { name: 'Purchase Order Approval Chain', entityType: 'purchase_order_approval' },
    });

    if (existingChain) {
      this.logger.log('Purchase Order Approval Chain already exists, skipping...');
      return;
    }

    try {
      const chain = this.chainRepository.create({
        name: 'Purchase Order Approval Chain',
        entityType: 'purchase_order_approval',
        description: 'Multi-level approval chain for purchase orders with finance and management oversight',
        isActive: true,
      });

      const savedChain = await this.chainRepository.save(chain);

      const levels = [
        {
          chainId: savedChain.id,
          sequence: 1,
          approverType: 'role',
          approverIds: ['purchase_executive'],
          requiredCount: 1,
          slaHours: 4,
          conditions: { amount: { lte: 50000 } }, // Up to ₹50K
          escalationRules: {
            onSLABreach: 'notify_purchase_manager',
            autoEscalate: true,
            escalateAfterHours: 6,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 2,
          approverType: 'role',
          approverIds: ['purchase_manager'],
          requiredCount: 1,
          slaHours: 8,
          conditions: {
            $and: [
              { amount: { gt: 50000 } },
              { amount: { lte: 200000 } }
            ]
          }, // ₹50K to ₹2 Lakhs
          escalationRules: {
            onSLABreach: 'notify_finance_manager',
            autoEscalate: true,
            escalateAfterHours: 12,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 3,
          approverType: 'role',
          approverIds: ['finance_manager'],
          requiredCount: 1,
          slaHours: 12,
          conditions: {
            $and: [
              { amount: { gt: 200000 } },
              { amount: { lte: 500000 } }
            ]
          }, // ₹2 Lakhs to ₹5 Lakhs
          escalationRules: {
            onSLABreach: 'notify_gm',
            autoEscalate: true,
            escalateAfterHours: 18,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 4,
          approverType: 'role',
          approverIds: ['gm'],
          requiredCount: 1,
          slaHours: 24,
          conditions: {
            $and: [
              { amount: { gt: 500000 } },
              { amount: { lte: 1000000 } }
            ]
          }, // ₹5 Lakhs to ₹10 Lakhs
          escalationRules: {
            onSLABreach: 'notify_ceo',
            autoEscalate: true,
            escalateAfterHours: 36,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 5,
          approverType: 'role',
          approverIds: ['ceo'],
          requiredCount: 1,
          slaHours: 48,
          conditions: { amount: { gt: 1000000 } }, // Above ₹10 Lakhs
          escalationRules: {
            onSLABreach: 'notify_board',
            autoEscalate: false,
            escalateAfterHours: 72,
          },
        },
      ];

      await this.levelRepository.save(levels);
      this.logger.log('Purchase Order Approval Chain created successfully');
    } catch (error) {
      this.logger.error(`Failed to seed Purchase Order Approval Chain: ${error.message}`);
    }
  }

  /**
   * Leave Approval Chain
   * Duration-based approval hierarchy
   * - Level 1: Reporting Manager (up to 3 days)
   * - Level 2: Department Head (up to 7 days)
   * - Level 3: HR Manager (above 7 days)
   */
  async seedLeaveApprovalChain(): Promise<void> {
    this.logger.log('Seeding Leave Approval Chain...');

    const existingChain = await this.chainRepository.findOne({
      where: { name: 'Leave Approval Chain', entityType: 'leave_request' },
    });

    if (existingChain) {
      this.logger.log('Leave Approval Chain already exists, skipping...');
      return;
    }

    try {
      const chain = this.chainRepository.create({
        name: 'Leave Approval Chain',
        entityType: 'leave_request',
        description: 'Approval chain for employee leave requests based on leave duration',
        isActive: true,
      });

      const savedChain = await this.chainRepository.save(chain);

      const levels = [
        {
          chainId: savedChain.id,
          sequence: 1,
          approverType: 'dynamic',
          approverIds: ['reporting_manager'], // Dynamic resolution based on employee hierarchy
          requiredCount: 1,
          slaHours: 24,
          conditions: { days: { lte: 3 } }, // Up to 3 days
          escalationRules: {
            onSLABreach: 'notify_department_head',
            autoEscalate: true,
            escalateAfterHours: 36,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 2,
          approverType: 'dynamic',
          approverIds: ['department_head'], // Dynamic resolution based on employee department
          requiredCount: 1,
          slaHours: 48,
          conditions: {
            $and: [
              { days: { gt: 3 } },
              { days: { lte: 7 } }
            ]
          }, // 4 to 7 days
          escalationRules: {
            onSLABreach: 'notify_hr_manager',
            autoEscalate: true,
            escalateAfterHours: 72,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 3,
          approverType: 'role',
          approverIds: ['hr_manager'],
          requiredCount: 1,
          slaHours: 72,
          conditions: { days: { gt: 7 } }, // Above 7 days
          escalationRules: {
            onSLABreach: 'notify_hr_head',
            autoEscalate: false,
            escalateAfterHours: 96,
          },
        },
      ];

      await this.levelRepository.save(levels);
      this.logger.log('Leave Approval Chain created successfully');
    } catch (error) {
      this.logger.error(`Failed to seed Leave Approval Chain: ${error.message}`);
    }
  }

  /**
   * Expense Claim Approval Chain
   * Value-based approval hierarchy in INR
   * - Level 1: Reporting Manager (up to ₹10K)
   * - Level 2: Department Head (up to ₹50K)
   * - Level 3: Finance Manager (above ₹50K)
   */
  async seedExpenseClaimApprovalChain(): Promise<void> {
    this.logger.log('Seeding Expense Claim Approval Chain...');

    const existingChain = await this.chainRepository.findOne({
      where: { name: 'Expense Claim Approval Chain', entityType: 'expense_claim' },
    });

    if (existingChain) {
      this.logger.log('Expense Claim Approval Chain already exists, skipping...');
      return;
    }

    try {
      const chain = this.chainRepository.create({
        name: 'Expense Claim Approval Chain',
        entityType: 'expense_claim',
        description: 'Approval chain for employee expense reimbursement claims based on claim amount',
        isActive: true,
      });

      const savedChain = await this.chainRepository.save(chain);

      const levels = [
        {
          chainId: savedChain.id,
          sequence: 1,
          approverType: 'dynamic',
          approverIds: ['reporting_manager'], // Dynamic resolution based on employee hierarchy
          requiredCount: 1,
          slaHours: 24,
          conditions: { amount: { lte: 10000 } }, // Up to ₹10K
          escalationRules: {
            onSLABreach: 'notify_department_head',
            autoEscalate: true,
            escalateAfterHours: 36,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 2,
          approverType: 'dynamic',
          approverIds: ['department_head'], // Dynamic resolution based on employee department
          requiredCount: 1,
          slaHours: 48,
          conditions: {
            $and: [
              { amount: { gt: 10000 } },
              { amount: { lte: 50000 } }
            ]
          }, // ₹10K to ₹50K
          escalationRules: {
            onSLABreach: 'notify_finance_manager',
            autoEscalate: true,
            escalateAfterHours: 72,
          },
        },
        {
          chainId: savedChain.id,
          sequence: 3,
          approverType: 'role',
          approverIds: ['finance_manager'],
          requiredCount: 1,
          slaHours: 72,
          conditions: { amount: { gt: 50000 } }, // Above ₹50K
          escalationRules: {
            onSLABreach: 'notify_cfo',
            autoEscalate: false,
            escalateAfterHours: 96,
          },
        },
      ];

      await this.levelRepository.save(levels);
      this.logger.log('Expense Claim Approval Chain created successfully');
    } catch (error) {
      this.logger.error(`Failed to seed Expense Claim Approval Chain: ${error.message}`);
    }
  }
}
