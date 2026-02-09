import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { GeneralLedger } from '../entities/general-ledger.entity';
import { Company } from '../../core/entities/company.entity';
import { ChartOfAccounts } from '../entities/chart-of-accounts.entity';

@Injectable()
export class ConsolidationService {
    constructor(
        @InjectRepository(GeneralLedger)
        private readonly glRepository: Repository<GeneralLedger>,
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(ChartOfAccounts)
        private readonly coaRepository: Repository<ChartOfAccounts>,
    ) { }

    async consolidateFinancials(companyIds: string[], startDate: Date, endDate: Date): Promise<any> {
        const companies = await this.companyRepository.find({
            where: { id: In(companyIds) }
        });

        if (companies.length === 0) throw new NotFoundException('No companies found for consolidation');

        // Aggregate GL entries across all selected companies
        const glEntries = await this.glRepository.find({
            where: {
                companyId: In(companyIds),
                postingDate: Between(startDate, endDate),
            },
            relations: ['account'],
        });

        const consolidatedBalances = new Map<string, { accountName: string, budget: number, actual: number }>();

        glEntries.forEach(entry => {
            const accountId = entry.accountId;
            const current = consolidatedBalances.get(accountId) || {
                accountName: entry.account.accountName,
                budget: 0,
                actual: 0
            };

            current.actual += Number(entry.netAmount);
            consolidatedBalances.set(accountId, current);
        });

        return {
            period: { startDate, endDate },
            companies: companies.map(c => c.name),
            balances: Array.from(consolidatedBalances.entries()).map(([id, data]) => ({
                accountId: id,
                ...data
            })),
            totalConsolidatedRefresh: new Date(),
        };
    }

    // Support for elimination entries (inter-company transaction removals)
    async getEliminationEntries(companyIds: string[], startDate: Date, endDate: Date): Promise<any> {
        // Logic to identify and return offsetting entries between selected entities
        // In a mature system, this would look for specific "Inter-company" account types
        return [];
    }
}

// Helper to handle Date range (simplified)
function Between(start: Date, end: Date) {
    // This is a placeholder for actual TypeORM Between operator if not already imported correctly
    return require('typeorm').Between(start, end);
}
