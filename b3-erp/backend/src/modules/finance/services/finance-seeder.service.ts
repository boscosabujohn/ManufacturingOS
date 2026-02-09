import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Company } from '../../core/entities/company.entity';
import { GeneralLedger, TransactionType, EntryStatus } from '../entities/general-ledger.entity';
import { ChartOfAccounts } from '../entities/chart-of-accounts.entity';
import { BankAccount, BankAccountType } from '../entities/bank-account.entity';

@Injectable()
export class FinanceSeederService {
    constructor(
        @InjectRepository(Company)
        private readonly companyRepository: Repository<Company>,
        @InjectRepository(GeneralLedger)
        private readonly glRepository: Repository<GeneralLedger>,
        @InjectRepository(ChartOfAccounts)
        private readonly coaRepository: Repository<ChartOfAccounts>,
        @InjectRepository(BankAccount)
        private readonly bankAccountRepository: Repository<BankAccount>,
    ) { }

    async seedAdvancedFinance() {
        // 1. Seed Companies
        const companyA = await this.companyRepository.save(this.companyRepository.create({
            name: 'Manufacturing HeadQuarters',
            taxId: 'GST-HQ-001',
            baseCurrency: 'INR',
            fiscalYearStart: new Date('2023-04-01'),
        }));

        const companyB = await this.companyRepository.save(this.companyRepository.create({
            name: 'Site Operations Branch',
            taxId: 'GST-SITE-002',
            baseCurrency: 'INR',
            fiscalYearStart: new Date('2023-04-01'),
        }));

        // 2. Seed Bank Accounts
        const bankA = await this.bankAccountRepository.save(this.bankAccountRepository.create({
            accountName: 'HDFC Corporate Account',
            accountNumber: '50100012345678',
            bankName: 'HDFC Bank',
            accountType: BankAccountType.CURRENT,
            accountCode: 'BANK-001',
            branchName: 'Mumbai Main',
            openingBalance: 10000000,
            currentBalance: 10000000,
        }));

        // 3. Seed GL Entries for both companies
        const accounts = await this.coaRepository.find();
        const incomeAcc = accounts.find(a => a.accountType === 'Income');
        const cashAcc = accounts.find(a => a.accountType === 'Asset' && a.accountName.includes('Bank'));

        if (incomeAcc && cashAcc) {
            // Company A Sale
            await this.glRepository.save(this.glRepository.create({
                companyId: companyA.id,
                accountId: incomeAcc.id,
                transactionNumber: 'SAL-HQ-001',
                transactionType: TransactionType.INVOICE,
                postingDate: new Date(),
                transactionDate: new Date(),
                creditAmount: 500000,
                netAmount: -500000,
                description: 'Large Project Sale - HQ',
                status: EntryStatus.POSTED,
                periodId: 'test-period',
            }));

            // Company B Sale
            await this.glRepository.save(this.glRepository.create({
                companyId: companyB.id,
                accountId: incomeAcc.id,
                transactionNumber: 'SAL-SITE-001',
                transactionType: TransactionType.INVOICE,
                postingDate: new Date(),
                transactionDate: new Date(),
                creditAmount: 250000,
                netAmount: -250000,
                description: 'Site Installation Fee',
                status: EntryStatus.POSTED,
                periodId: 'test-period',
            }));
        }

        console.log('Advanced Finance seeding completed.');
    }
}
