import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankTransaction } from '../entities/bank-transaction.entity';

interface ReconciliationMatch {
    transactionId: string;
    journalEntryId: string;
    matched: boolean;
}

@Injectable()
export class BankReconciliationService {
    constructor(
        @InjectRepository(BankTransaction)
        private transactionRepository: Repository<BankTransaction>,
    ) { }

    async getUnreconciledTransactions(bankAccountId: string): Promise<BankTransaction[]> {
        return await this.transactionRepository.find({
            where: {
                bankAccountId,
                reconciled: false,
            },
            order: { transactionDate: 'DESC' },
        });
    }

    async autoMatch(bankAccountId: string): Promise<{ matched: number }> {
        const unreconciledTxns = await this.getUnreconciledTransactions(bankAccountId);
        let matched = 0;

        for (const txn of unreconciledTxns) {
            // Simple auto-match logic: match by amount and date (±2 days)
            // In production, this would be more sophisticated
            const potentialMatches = await this.findPotentialMatches(txn);

            if (potentialMatches.length === 1) {
                await this.matchTransaction(txn.id, potentialMatches[0].id);
                matched++;
            }
        }

        return { matched };
    }

    private async findPotentialMatches(transaction: BankTransaction): Promise<any[]> {
        // Placeholder: In production, query journal entries from Finance module
        // Match by amount, date range, and description similarity
        return [];
    }

    async matchTransaction(transactionId: string, journalEntryId: string): Promise<void> {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
        });

        if (transaction) {
            transaction.reconciled = true;
            transaction.reconciledDate = new Date();
            transaction.journalEntryId = journalEntryId;
            await this.transactionRepository.save(transaction);
        }
    }

    async unmatchTransaction(transactionId: string): Promise<void> {
        const transaction = await this.transactionRepository.findOne({
            where: { id: transactionId },
        });

        if (transaction) {
            transaction.reconciled = false;
            transaction.reconciledDate = null;
            transaction.journalEntryId = null;
            await this.transactionRepository.save(transaction);
        }
    }

    async getReconciliationReport(bankAccountId: string, month: Date): Promise<{
        openingBalance: number;
        closingBalance: number;
        reconciledCount: number;
        unreconciledCount: number;
        totalDebits: number;
        totalCredits: number;
    }> {
        const startDate = new Date(month.getFullYear(), month.getMonth(), 1);
        const endDate = new Date(month.getFullYear(), month.getMonth() + 1, 0);

        const transactions = await this.transactionRepository.find({
            where: {
                bankAccountId,
            },
        });

        const monthTransactions = transactions.filter((t: BankTransaction) =>
            t.transactionDate >= startDate && t.transactionDate <= endDate
        );

        const reconciledCount = monthTransactions.filter((t: BankTransaction) => t.reconciled).length;
        const unreconciledCount = monthTransactions.length - reconciledCount;
        const totalDebits = monthTransactions.reduce((sum: number, t: BankTransaction) => sum + Number(t.debit), 0);
        const totalCredits = monthTransactions.reduce((sum: number, t: BankTransaction) => sum + Number(t.credit), 0);

        return {
            openingBalance: 0, // Calculate from previous month's closing
            closingBalance: totalCredits - totalDebits,
            reconciledCount,
            unreconciledCount,
            totalDebits,
            totalCredits,
        };
    }
}
