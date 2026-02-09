import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource } from 'typeorm';
import { CycleCountPlan, CycleCountStatus, CycleCountItem } from '../entities/cycle-count-plan.entity';
import { StockBalance } from '../entities/stock-balance.entity';
import { StockAdjustment, AdjustmentType, AdjustmentStatus } from '../entities/stock-adjustment.entity';

@Injectable()
export class CycleCountService {
    constructor(
        @InjectRepository(CycleCountPlan)
        private readonly planRepository: Repository<CycleCountPlan>,
        @InjectRepository(StockBalance)
        private readonly stockBalanceRepository: Repository<StockBalance>,
        private readonly dataSource: DataSource,
    ) { }

    /**
     * Generate a cycle count plan based on warehouse and ABC classification.
     */
    async generatePlan(data: any): Promise<CycleCountPlan> {
        return await this.dataSource.transaction(async (manager) => {
            const planNumber = `CCP-${new Date().getFullYear()}-${Math.floor(Math.random() * 10000).toString().padStart(4, '0')}`;

            const plan = manager.create(CycleCountPlan, {
                ...data,
                planNumber,
                status: CycleCountStatus.SCHEDULED,
            });

            const savedPlan = await manager.save(plan);

            // Fetch items matching criteria
            const query = manager.createQueryBuilder(StockBalance, 'balance')
                .where('balance.warehouseId = :warehouseId', { warehouseId: data.warehouseId });

            if (data.abcClass) {
                query.andWhere('balance.abcClassification = :abc', { abc: data.abcClass });
            }

            const balances = await query.getMany();

            const items = balances.map((b, index) => manager.create(CycleCountItem, {
                planId: savedPlan.id,
                itemId: b.itemId,
                itemCode: b.itemCode,
                itemName: b.itemName,
                systemQuantity: b.availableQuantity,
                isCounted: false,
            }));

            await manager.save(CycleCountItem, items);

            return savedPlan;
        });
    }

    /**
     * Start the counting process.
     */
    async startCounting(id: string): Promise<CycleCountPlan> {
        const plan = await this.planRepository.findOne({ where: { id } });
        if (!plan) throw new NotFoundException('Plan not found');

        plan.status = CycleCountStatus.IN_PROGRESS;
        return await this.planRepository.save(plan);
    }

    /**
     * Record count results and reconcile.
     */
    async completeAndReconcile(id: string, results: { itemId: string, actualQty: number }[]): Promise<CycleCountPlan> {
        return await this.dataSource.transaction(async (manager) => {
            const plan = await manager.findOne(CycleCountPlan, {
                where: { id },
                relations: ['items']
            });
            if (!plan) throw new NotFoundException('Plan not found');

            // Update item counts
            for (const item of plan.items) {
                const result = results.find(r => r.itemId === item.itemId);
                if (result) {
                    item.actualQuantity = result.actualQty;
                    item.isCounted = true;
                    item.countedAt = new Date();
                }
            }
            await manager.save(CycleCountItem, plan.items);

            // Create Stock Adjustment for discrepancies
            const discrepancies = plan.items.filter(i => Number(i.actualQuantity) !== Number(i.systemQuantity));

            if (discrepancies.length > 0) {
                const adjustment = manager.create(StockAdjustment, {
                    adjustmentNumber: `ADJ-CC-${plan.planNumber}`,
                    adjustmentType: AdjustmentType.CYCLE_COUNT,
                    status: AdjustmentStatus.DRAFT,
                    adjustmentDate: new Date(),
                    warehouseId: plan.warehouseId || '',
                    warehouseName: plan.warehouseName || '',
                    referenceType: 'Cycle Count Plan',
                    referenceId: plan.id,
                    referenceNumber: plan.planNumber,
                    isCycleCount: true,
                });

                const savedAdj = await manager.save(StockAdjustment, adjustment);
                plan.adjustmentId = savedAdj.id;
            }

            plan.status = CycleCountStatus.COMPLETED;
            return await manager.save(CycleCountPlan, plan);
        });
    }
}
