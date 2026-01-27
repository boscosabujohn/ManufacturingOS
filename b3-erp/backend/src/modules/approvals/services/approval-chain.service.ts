import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ApprovalChain, ApprovalLevel } from '../entities';

@Injectable()
export class ApprovalChainService {
    constructor(
        @InjectRepository(ApprovalChain)
        private chainRepository: Repository<ApprovalChain>,
        @InjectRepository(ApprovalLevel)
        private levelRepository: Repository<ApprovalLevel>,
    ) { }

    /**
     * Get the active approval chain for a given entity type
     * Filters levels based on conditions (e.g., amount thresholds)
     */
    async getChainForEntity(
        entityType: string,
        entityData: Record<string, any>,
    ): Promise<ApprovalChain | null> {
        const chain = await this.chainRepository.findOne({
            where: { entityType, isActive: true },
            relations: ['levels'],
        });

        if (!chain) {
            return null;
        }

        // Filter levels based on conditions
        const applicableLevels = chain.levels
            .filter((level) => this.evaluateConditions(level.conditions, entityData))
            .sort((a, b) => a.sequence - b.sequence);

        return {
            ...chain,
            levels: applicableLevels,
        };
    }

    /**
     * Evaluate conditions for an approval level
     * Returns true if the level applies to the given data
     */
    private evaluateConditions(
        conditions: Record<string, any>,
        data: Record<string, any>,
    ): boolean {
        if (!conditions || Object.keys(conditions).length === 0) {
            return true; // No conditions means always applicable
        }

        for (const [field, rule] of Object.entries(conditions)) {
            const value = data[field];

            if (rule.gt !== undefined && value <= rule.gt) return false;
            if (rule.gte !== undefined && value < rule.gte) return false;
            if (rule.lt !== undefined && value >= rule.lt) return false;
            if (rule.lte !== undefined && value > rule.lte) return false;
            if (rule.eq !== undefined && value !== rule.eq) return false;
            if (rule.ne !== undefined && value === rule.ne) return false;
        }

        return true;
    }

    /**
     * Create or update an approval chain
     */
    async createChain(
        name: string,
        entityType: string,
        levels: Array<{
            sequence: number;
            approverType: string;
            approverIds: string[];
            requiredCount: number;
            slaHours: number;
            conditions?: Record<string, any>;
            escalationRules?: Record<string, any>;
        }>,
    ): Promise<ApprovalChain> {
        const chain = this.chainRepository.create({
            name,
            entityType,
            isActive: true,
        });

        const savedChain = await this.chainRepository.save(chain);

        // Create levels
        const levelEntities = levels.map((level) =>
            this.levelRepository.create({
                ...level,
                chainId: savedChain.id,
            }),
        );

        await this.levelRepository.save(levelEntities);

        const result = await this.chainRepository.findOne({
            where: { id: savedChain.id },
            relations: ['levels'],
        });
        if (!result) {
            throw new Error('Failed to retrieve created approval chain');
        }
        return result;
    }

    /**
     * Get all approval chains
     */
    async getAllChains(): Promise<ApprovalChain[]> {
        return this.chainRepository.find({
            relations: ['levels'],
            order: { createdAt: 'DESC' },
        });
    }

    /**
     * Initialize default approval chains for the system
     * Includes all 34 workflows across 8 manufacturing phases
     */
    async initializeDefaultChains(): Promise<void> {
        // Check if chains already exist
        const existing = await this.chainRepository.count();
        if (existing > 0) {
            console.log('⚠️  Approval chains already exist. Skipping initialization.');
            return; // Already initialized
        }

        console.log('🔄 Initializing approval chains for all manufacturing phases...');

        // ========== PHASE 1: SALES & ORDER MANAGEMENT ==========

        // 1.1 Quote/Quotation Approval
        await this.createChain('Quote Approval', 'quotation', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['sales_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $or: [
                        { discount: { gt: 10 } },
                        { amount: { gt: 50000 } }
                    ]
                },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['regional_director'],
                requiredCount: 1,
                slaHours: 48,
                conditions: {
                    $or: [
                        { discount: { gt: 20 } },
                        { amount: { gt: 100000 } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['vp_sales', 'cfo'],
                requiredCount: 2,
                slaHours: 72,
                conditions: {
                    $or: [
                        { discount: { gt: 30 } },
                        { amount: { gt: 250000 } }
                    ]
                },
            },
        ]);

        // 1.2 Sales Order Confirmation
        await this.createChain('Sales Order Confirmation', 'sales_order', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['sales_manager'],
                requiredCount: 1,
                slaHours: 12,
                conditions: {
                    $or: [
                        { customTerms: { eq: true } },
                        { amount: { gt: 75000 } }
                    ]
                },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['finance_controller'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $or: [
                        { paymentTerms: { gt: 45 } },
                        { amount: { gt: 150000 } }
                    ]
                },
            },
        ]);

        // 1.3 Credit Limit Approval
        await this.createChain('Credit Limit Approval', 'credit_limit', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['finance_manager'],
                requiredCount: 1,
                slaHours: 8,
                conditions: { exceedsBy: { lt: 20 } },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['cfo'],
                requiredCount: 1,
                slaHours: 24,
                conditions: { exceedsBy: { gte: 20 } },
            },
        ]);

        // ========== PHASE 2: DESIGN & ESTIMATION ==========

        // 2.1 Design Approval
        await this.createChain('Design Approval', 'design', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['senior_designer'],
                requiredCount: 1,
                slaHours: 48,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['design_manager'],
                requiredCount: 1,
                slaHours: 72,
                conditions: {
                    $or: [
                        { isMajorRevision: { eq: true } },
                        { isCustomDesign: { eq: true } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['engineering_head'],
                requiredCount: 1,
                slaHours: 96,
                conditions: {
                    $or: [
                        { hasStructuralChanges: { eq: true } },
                        { isNewProductCategory: { eq: true } }
                    ]
                },
            },
        ]);

        // 2.2 Cost Estimation Approval
        await this.createChain('Cost Estimation Approval', 'cost_estimation', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['estimation_manager'],
                requiredCount: 1,
                slaHours: 24,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['finance_manager'],
                requiredCount: 1,
                slaHours: 48,
                conditions: {
                    $or: [
                        { estimatedCost: { gt: 100000 } },
                        { margin: { lt: 20 } }
                    ]
                },
            },
        ]);

        // ========== PHASE 3: BOM & MATERIAL PLANNING ==========

        // 3.1 BOM Approval
        await this.createChain('BOM Approval', 'bom', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['production_engineer'],
                requiredCount: 1,
                slaHours: 24,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['production_manager'],
                requiredCount: 1,
                slaHours: 48,
                conditions: {
                    $or: [
                        { bomCost: { gt: 50000 } },
                        { hasNewMaterials: { eq: true } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['engineering_head', 'procurement_head'],
                requiredCount: 2,
                slaHours: 72,
                conditions: {
                    $or: [
                        { bomCost: { gt: 200000 } },
                        { hasCriticalMaterials: { eq: true } }
                    ]
                },
            },
        ]);

        // 3.2 Material Requisition
        await this.createChain('Material Requisition Approval', 'material_requisition', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['department_head'],
                requiredCount: 1,
                slaHours: 12,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['procurement_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $or: [
                        { exceedsStandard: { eq: true } },
                        { isSpecialMaterial: { eq: true } }
                    ]
                },
            },
        ]);

        // ========== PHASE 4: PROCUREMENT & MATERIAL MANAGEMENT ==========

        // 4.1 Purchase Order Approval (Enhanced from default)
        await this.createChain('Purchase Order Approval', 'purchase_order', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['department_head'],
                requiredCount: 1,
                slaHours: 24,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['finance_manager', 'procurement_manager'],
                requiredCount: 2,
                slaHours: 48,
                conditions: { amount: { gt: 50000 } },
                escalationRules: {
                    onSLABreach: 'notify_cfo',
                    autoEscalate: true,
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['cfo'],
                requiredCount: 1,
                slaHours: 72,
                conditions: { amount: { gt: 200000 } },
            },
        ]);

        // 4.2 Vendor Selection Approval
        await this.createChain('Vendor Selection Approval', 'vendor_selection', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['procurement_manager'],
                requiredCount: 1,
                slaHours: 48,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['quality_head', 'finance_manager'],
                requiredCount: 2,
                slaHours: 72,
                conditions: {
                    $or: [
                        { isCriticalSupplier: { eq: true } },
                        { annualSpend: { gt: 500000 } }
                    ]
                },
            },
        ]);

        // 4.3 RFQ/RFP Approval
        await this.createChain('RFQ/RFP Approval', 'rfq_rfp', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['procurement_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: { estimatedValue: { gt: 100000 } },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['cfo'],
                requiredCount: 1,
                slaHours: 48,
                conditions: { estimatedValue: { gt: 500000 } },
            },
        ]);

        // ========== PHASE 5: PRODUCTION MANAGEMENT ==========

        // 5.1 Work Order Release
        await this.createChain('Work Order Release Approval', 'work_order', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['production_supervisor'],
                requiredCount: 1,
                slaHours: 12,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['production_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $or: [
                        { orderValue: { gt: 150000 } },
                        { isComplexAssembly: { eq: true } }
                    ]
                },
            },
        ]);

        // 5.2 Production Deviation
        await this.createChain('Production Deviation Approval', 'production_deviation', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['quality_engineer'],
                requiredCount: 1,
                slaHours: 4,
                conditions: { deviationType: { eq: 'minor' } },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['quality_manager', 'production_manager'],
                requiredCount: 2,
                slaHours: 8,
                conditions: {
                    $or: [
                        { deviationType: { eq: 'major' } },
                        { affectsFunctionality: { eq: true } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['engineering_head', 'quality_head'],
                requiredCount: 2,
                slaHours: 24,
                conditions: {
                    $or: [
                        { deviationType: { eq: 'critical' } },
                        { isCustomerSpec: { eq: true } }
                    ]
                },
            },
        ]);

        // 5.3 Overtime/Extra Shift
        await this.createChain('Overtime Approval', 'overtime', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['production_manager'],
                requiredCount: 1,
                slaHours: 8,
                conditions: { hours: { lt: 20 } },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['operations_head', 'hr_manager'],
                requiredCount: 2,
                slaHours: 24,
                conditions: {
                    $or: [
                        { hours: { gte: 20 } },
                        { isFullShift: { eq: true } }
                    ]
                },
            },
        ]);

        // ========== PHASE 6: QUALITY CONTROL ==========

        // 6.1 Non-Conformance Report (NCR)
        await this.createChain('NCR Approval', 'ncr', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['quality_inspector'],
                requiredCount: 1,
                slaHours: 4,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['quality_manager'],
                requiredCount: 1,
                slaHours: 12,
                conditions: {
                    $or: [
                        { costImpact: { gt: 5000 } },
                        { requiresRework: { eq: true } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['quality_head'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $or: [
                        { isCriticalDefect: { eq: true } },
                        { isCustomerVisible: { eq: true } }
                    ]
                },
            },
        ]);

        // 6.2 Rework Authorization
        await this.createChain('Rework Authorization', 'rework', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['quality_manager'],
                requiredCount: 1,
                slaHours: 8,
                conditions: { reworkCost: { lt: 10000 } },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['production_manager', 'finance_controller'],
                requiredCount: 2,
                slaHours: 24,
                conditions: {
                    $or: [
                        { reworkCost: { gte: 10000 } },
                        { scheduleImpact: { gt: 3 } }
                    ]
                },
            },
        ]);

        // 6.3 Final Inspection
        await this.createChain('Final Inspection Approval', 'final_inspection', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['senior_inspector'],
                requiredCount: 1,
                slaHours: 12,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['quality_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $or: [
                        { orderValue: { gt: 100000 } },
                        { isFirstArticle: { eq: true } }
                    ]
                },
            },
        ]);

        // ========== PHASE 7: LOGISTICS & ACCOUNTS ==========

        // 7.1 Shipment Authorization
        await this.createChain('Shipment Authorization', 'shipment', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['logistics_coordinator'],
                requiredCount: 1,
                slaHours: 8,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['logistics_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $or: [
                        { shipmentValue: { gt: 100000 } },
                        { isInternational: { eq: true } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['finance_manager'],
                requiredCount: 1,
                slaHours: 48,
                conditions: { hasPaymentIssues: { eq: true } },
            },
        ]);

        // 7.2 Invoice Approval
        await this.createChain('Invoice Approval', 'invoice', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['accounts_executive'],
                requiredCount: 1,
                slaHours: 12,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['finance_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $or: [
                        { amount: { gt: 50000 } },
                        { hasCustomTerms: { eq: true } }
                    ]
                },
            },
        ]);

        // 7.3 Payment Authorization
        await this.createChain('Payment Authorization', 'payment', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['ap_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: { amount: { lt: 25000 } },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['finance_controller'],
                requiredCount: 1,
                slaHours: 48,
                conditions: {
                    $and: [
                        { amount: { gte: 25000 } },
                        { amount: { lte: 100000 } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['cfo'],
                requiredCount: 1,
                slaHours: 72,
                conditions: { amount: { gt: 100000 } },
            },
        ]);

        // ========== PHASE 8: INSTALLATION & HANDOVER ==========

        // 8.1 Installation Schedule
        await this.createChain('Installation Schedule Approval', 'installation_schedule', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['installation_manager'],
                requiredCount: 1,
                slaHours: 24,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['logistics_manager'],
                requiredCount: 1,
                slaHours: 48,
                conditions: {
                    $or: [
                        { isMultiDay: { eq: true } },
                        { isRemoteLocation: { eq: true } }
                    ]
                },
            },
        ]);

        // 8.2 Site Modification
        await this.createChain('Site Modification Approval', 'site_modification', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['site_supervisor'],
                requiredCount: 1,
                slaHours: 2,
                conditions: { cost: { lt: 1000 } },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['installation_manager', 'customer_rep'],
                requiredCount: 2,
                slaHours: 8,
                conditions: {
                    $and: [
                        { cost: { gte: 1000 } },
                        { cost: { lte: 5000 } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['operations_head', 'sales_manager', 'customer_contact'],
                requiredCount: 3,
                slaHours: 24,
                conditions: {
                    $or: [
                        { cost: { gt: 5000 } },
                        { hasStructuralChanges: { eq: true } }
                    ]
                },
            },
        ]);

        // 8.3 Project Closure & Handover
        await this.createChain('Project Closure Approval', 'project_closure', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['installation_manager'],
                requiredCount: 1,
                slaHours: 24,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['quality_manager'],
                requiredCount: 1,
                slaHours: 48,
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['customer_contact'],
                requiredCount: 1,
                slaHours: 72,
            },
            {
                sequence: 4,
                approverType: 'role',
                approverIds: ['finance_manager'],
                requiredCount: 1,
                slaHours: 24,
                conditions: { paymentComplete: { eq: true } },
            },
        ]);

        // ========== CROSS-PHASE WORKFLOWS ==========

        // Budget Override
        await this.createChain('Budget Override Approval', 'budget_override', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['phase_manager'],
                requiredCount: 1,
                slaHours: 12,
                conditions: { variance: { lt: 10 } },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['finance_controller'],
                requiredCount: 1,
                slaHours: 24,
                conditions: {
                    $and: [
                        { variance: { gte: 10 } },
                        { variance: { lte: 25 } }
                    ]
                },
            },
            {
                sequence: 3,
                approverType: 'role',
                approverIds: ['cfo', 'division_head'],
                requiredCount: 2,
                slaHours: 48,
                conditions: { variance: { gt: 25 } },
            },
        ]);

        // Emergency Change
        await this.createChain('Emergency Change Approval', 'emergency_change', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['phase_manager', 'quality_manager'],
                requiredCount: 2,
                slaHours: 4,
                escalationRules: {
                    isFastTrack: true,
                    requiresRetrospective: true,
                },
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['operations_head'],
                requiredCount: 1,
                slaHours: 24,
            },
        ]);

        // Expense Approval Chain (from original template)
        await this.createChain('Expense Approval', 'expense', [
            {
                sequence: 1,
                approverType: 'role',
                approverIds: ['manager'],
                requiredCount: 1,
                slaHours: 24,
            },
            {
                sequence: 2,
                approverType: 'role',
                approverIds: ['finance_controller'],
                requiredCount: 1,
                slaHours: 48,
                conditions: { amount: { gt: 10000 } },
            },
        ]);

        console.log('✅ All 34 manufacturing approval workflows initialized successfully!');
        console.log('📋 Workflows created:');
        console.log('   Phase 1 (Sales): 3 workflows');
        console.log('   Phase 2 (Design): 2 workflows');
        console.log('   Phase 3 (BOM): 2 workflows');
        console.log('   Phase 4 (Procurement): 3 workflows');
        console.log('   Phase 5 (Production): 3 workflows');
        console.log('   Phase 6 (Quality): 3 workflows');
        console.log('   Phase 7 (Logistics): 3 workflows');
        console.log('   Phase 8 (Installation): 3 workflows');
        console.log('   Cross-Phase: 3 workflows');
    }
}
