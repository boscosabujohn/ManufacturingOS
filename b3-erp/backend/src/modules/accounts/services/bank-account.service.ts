import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { BankAccount } from '../entities/bank-account.entity';
import { BankTransaction } from '../entities/bank-transaction.entity';

@Injectable()
export class BankAccountService {
    constructor(
        @InjectRepository(BankAccount)
        private bankAccountRepository: Repository<BankAccount>,
        @InjectRepository(BankTransaction)
        private transactionRepository: Repository<BankTransaction>,
    ) { }

    async create(data: Partial<BankAccount>): Promise<BankAccount> {
        const account = this.bankAccountRepository.create(data);
        return await this.bankAccountRepository.save(account);
    }

    async findAll(): Promise<BankAccount[]> {
        return await this.bankAccountRepository.find({
            where: { status: 'active' },
            order: { createdAt: 'DESC' },
        });
    }

    async findOne(id: string): Promise<BankAccount> {
        const account = await this.bankAccountRepository.findOne({ where: { id } });
        if (!account) {
            throw new NotFoundException(`Bank account ${id} not found`);
        }
        return account;
    }

    async update(id: string, data: Partial<BankAccount>): Promise<BankAccount> {
        await this.findOne(id);
        await this.bankAccountRepository.update(id, data);
        return this.findOne(id);
    }

    async delete(id: string): Promise<void> {
        const account = await this.findOne(id);
        account.status = 'closed';
        await this.bankAccountRepository.save(account);
    }

    async getBalance(id: string): Promise<{ currentBalance: number; lastUpdated: Date }> {
        const account = await this.findOne(id);
        return {
            currentBalance: Number(account.currentBalance),
            lastUpdated: account.updatedAt,
        };
    }

    async getTransactions(id: string, startDate?: Date, endDate?: Date): Promise<BankTransaction[]> {
        const query = this.transactionRepository.createQueryBuilder('transaction')
            .where('transaction.bankAccountId = :id', { id });

        if (startDate) {
            query.andWhere('transaction.transactionDate >= :startDate', { startDate });
        }
        if (endDate) {
            query.andWhere('transaction.transactionDate <= :endDate', { endDate });
        }

        return await query.orderBy('transaction.transactionDate', 'DESC').getMany();
    }

    async addTransaction(data: Partial<BankTransaction>): Promise<BankTransaction> {
        const transaction = this.transactionRepository.create(data);
        const saved = await this.transactionRepository.save(transaction);

        // Update account balance
        if (data.bankAccountId) {
            await this.updateBalance(data.bankAccountId, Number(data.credit) - Number(data.debit));
        }

        return saved;
    }

    private async updateBalance(accountId: string, amount: number): Promise<void> {
        const account = await this.findOne(accountId);
        account.currentBalance = Number(account.currentBalance) + amount;
        await this.bankAccountRepository.save(account);
    }

    async importStatement(accountId: string, transactions: Partial<BankTransaction>[]): Promise<{ imported: number }> {
        let imported = 0;
        for (const txn of transactions) {
            try {
                await this.addTransaction({ ...txn, bankAccountId: accountId });
                imported++;
            } catch (error) {
                console.error('Failed to import transaction:', error);
            }
        }
        return { imported };
    }
}
