import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import {
  BankReconciliation,
  BankStatement,
  ReconciliationMatch,
  ReconciliationStatus,
  TransactionStatus,
} from '../entities/bank-reconciliation.entity';
import { BankAccount } from '../entities/bank-account.entity';
import { GeneralLedger } from '../entities/general-ledger.entity';

@Injectable()
export class BankReconciliationService {
  constructor(
    @InjectRepository(BankReconciliation)
    private readonly reconciliationRepository: Repository<BankReconciliation>,
    @InjectRepository(BankStatement)
    private readonly statementRepository: Repository<BankStatement>,
    @InjectRepository(ReconciliationMatch)
    private readonly matchRepository: Repository<ReconciliationMatch>,
    @InjectRepository(BankAccount)
    private readonly bankAccountRepository: Repository<BankAccount>,
    @InjectRepository(GeneralLedger)
    private readonly glRepository: Repository<GeneralLedger>,
  ) { }

  async importBankStatement(
    bankAccountId: string,
    transactions: any[],
    openingBalance: number,
    closingBalance: number,
    importedBy: string
  ): Promise<BankStatement[]> {
    const savedStatements: BankStatement[] = [];

    for (const t of transactions) {
      const statement = this.statementRepository.create({
        bankAccountId,
        transactionDate: new Date(t.transactionDate),
        valueDate: t.valueDate ? new Date(t.valueDate) : new Date(t.transactionDate),
        description: t.description || '',
        referenceNumber: t.referenceNumber,
        chequeNumber: t.chequeNumber,
        debitAmount: t.debit || 0,
        creditAmount: t.credit || 0,
        balance: t.balance || 0,
        status: TransactionStatus.UNMATCHED,
      });
      savedStatements.push(await this.statementRepository.save(statement));
    }

    return savedStatements;
  }

  async startReconciliation(
    bankAccountId: string,
    periodStart: string,
    periodEnd: string,
    createdBy: string
  ): Promise<BankReconciliation> {
    const bankAccount = await this.bankAccountRepository.findOne({ where: { id: bankAccountId } });
    if (!bankAccount) throw new NotFoundException('Bank account not found');

    const reconciliation = this.reconciliationRepository.create({
      bankAccountId,
      reconciliationNumber: `REC-${Date.now()}`,
      reconciliationDate: new Date(),
      statementStartDate: new Date(periodStart),
      statementEndDate: new Date(periodEnd),
      status: ReconciliationStatus.IN_PROGRESS,
      openingBalancePerBooks: Number(bankAccount.openingBalance),
      closingBalancePerBooks: Number(bankAccount.currentBalance),
      openingBalancePerBank: 0,
      closingBalancePerBank: 0,
      createdBy,
    });

    const savedRec = await this.reconciliationRepository.save(reconciliation);
    await this.runAutoMatching(savedRec.id);
    return this.getReconciliation(savedRec.id);
  }

  async runAutoMatching(reconciliationId: string): Promise<BankReconciliation> {
    const reconciliation = await this.reconciliationRepository.findOne({
      where: { id: reconciliationId },
    });
    if (!reconciliation) throw new NotFoundException('Reconciliation not found');

    const bankTxns = await this.statementRepository.find({
      where: {
        bankAccountId: reconciliation.bankAccountId,
        transactionDate: Between(reconciliation.statementStartDate, reconciliation.statementEndDate),
        isMatched: false,
      },
    });

    const bookTxns = await this.glRepository.find({
      where: {
        postingDate: Between(reconciliation.statementStartDate, reconciliation.statementEndDate),
        isReconciled: false,
      },
      relations: ['account']
    });

    for (const bankTxn of bankTxns) {
      const match = bookTxns.find(b =>
        Math.abs(Number(b.netAmount)) === (Number(bankTxn.creditAmount) || Number(bankTxn.debitAmount)) &&
        (b.referenceNumber === bankTxn.referenceNumber || b.referenceNumber === bankTxn.chequeNumber)
      );

      if (match) {
        await this.createMatch(reconciliation, bankTxn, match, 'Automatic', 100);
      }
    }

    return this.getReconciliation(reconciliationId);
  }

  private async createMatch(
    reconciliation: BankReconciliation,
    bankTxn: BankStatement,
    bookTxn: GeneralLedger,
    matchType: string,
    confidence: number
  ) {
    const match = this.matchRepository.create({
      reconciliationId: reconciliation.id,
      bankStatementId: bankTxn.id,
      generalLedgerId: bookTxn.id,
      matchType,
      amount: Number(bankTxn.creditAmount) || Number(bankTxn.debitAmount),
      matchedDate: new Date(),
      confidenceScore: confidence,
    });

    await this.matchRepository.save(match);

    bankTxn.isMatched = true;
    bankTxn.status = TransactionStatus.MATCHED;
    await this.statementRepository.save(bankTxn);

    bookTxn.isReconciled = true;
    bookTxn.reconciledDate = new Date();
    await this.glRepository.save(bookTxn);
  }

  async getReconciliation(id: string): Promise<BankReconciliation> {
    const rec = await this.reconciliationRepository.findOne({
      where: { id },
      relations: ['bankAccount', 'matches', 'matches.bankStatement'],
    });
    if (!rec) throw new NotFoundException('Reconciliation not found');
    return rec;
  }
}
