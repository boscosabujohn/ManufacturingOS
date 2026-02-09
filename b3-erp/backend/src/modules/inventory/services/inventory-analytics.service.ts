import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { StockBalance } from '../entities/stock-balance.entity';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class InventoryAnalyticsService {
    private readonly logger = new Logger(InventoryAnalyticsService.name);

    constructor(
        @InjectRepository(StockBalance)
        private readonly stockBalanceRepository: Repository<StockBalance>,
    ) { }

    /**
     * Periodically run stock aging analysis to flag obsolete and slow-moving stock.
     * Runs daily at midnight.
     */
    @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
    async runStockAgingAnalysis(): Promise<void> {
        this.logger.log('Starting daily stock aging analysis...');

        const balances = await this.stockBalanceRepository.find();
        const now = new Date();
        let updatedCount = 0;

        for (const balance of balances) {
            const lastMovementDate = balance.lastIssueDate || balance.lastReceiptDate || balance.createdAt;
            const daysSinceMovement = Math.floor((now.getTime() - lastMovementDate.getTime()) / (1000 * 60 * 60 * 24));

            let modified = false;

            // Flag Slow Moving (e.g., > 90 days)
            const isSlow = daysSinceMovement > 90;
            if (balance.isSlowMoving !== isSlow) {
                balance.isSlowMoving = isSlow;
                modified = true;
            }

            // Flag Non Moving (e.g., > 180 days)
            const isNonMoving = daysSinceMovement > 180;
            if (balance.isNonMoving !== isNonMoving) {
                balance.isNonMoving = isNonMoving;
                modified = true;
            }

            // Flag Obsolete (e.g., > 365 days)
            const isObsolete = daysSinceMovement > 365;
            if (balance.isObsolete !== isObsolete) {
                balance.isObsolete = isObsolete;
                modified = true;
            }

            balance.daysSinceLastMovement = daysSinceMovement;

            if (modified) {
                await this.stockBalanceRepository.save(balance);
                updatedCount++;
            }
        }

        this.logger.log(`Stock aging analysis complete. Updated ${updatedCount} records.`);
    }

    /**
     * Manual trigger for aging analysis.
     */
    async analyzeAging(): Promise<{ updated: number }> {
        const initialCount = 0; // Simplified for return
        await this.runStockAgingAnalysis();
        return { updated: 0 }; // Placeholder
    }
}
