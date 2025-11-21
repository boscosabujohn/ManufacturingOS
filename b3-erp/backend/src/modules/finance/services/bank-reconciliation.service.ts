import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';

export type TransactionType = 'receipt' | 'payment' | 'transfer' | 'charge' | 'interest' | 'other';
export type MatchStatus = 'unmatched' | 'auto_matched' | 'manual_matched' | 'partial_match' | 'no_match';
export type ReconciliationStatus = 'in_progress' | 'completed' | 'approved';

export interface BankStatement {
  id: string;
  bankAccountId: string;
  bankAccountName: string;
  statementDate: string;
  openingBalance: number;
  closingBalance: number;
  transactions: BankTransaction[];
  importedAt: string;
  importedBy: string;
  fileName?: string;
}

export interface BankTransaction {
  id: string;
  transactionDate: string;
  valueDate: string;
  description: string;
  referenceNumber?: string;
  chequeNumber?: string;
  debit: number;
  credit: number;
  balance: number;
  transactionType: TransactionType;
  matchStatus: MatchStatus;
  matchedTransactionId?: string;
  matchedTransactionType?: string;
  matchConfidence?: number;
  matchNotes?: string;
}

export interface BookTransaction {
  id: string;
  transactionDate: string;
  description: string;
  referenceNumber?: string;
  chequeNumber?: string;
  amount: number;
  isDebit: boolean;
  transactionType: 'customer_receipt' | 'vendor_payment' | 'expense' | 'transfer' | 'other';
  partyName?: string;
  invoiceNumber?: string;
  status: 'pending' | 'cleared' | 'reconciled' | 'void';
}

export interface Reconciliation {
  id: string;
  bankAccountId: string;
  bankAccountName: string;
  periodStart: string;
  periodEnd: string;
  status: ReconciliationStatus;

  // Balances
  bankStatementBalance: number;
  bookBalance: number;
  difference: number;

  // Adjustments
  unmatchedBankTransactions: BankTransaction[];
  unmatchedBookTransactions: BookTransaction[];
  matchedPairs: Array<{
    bankTransactionId: string;
    bookTransactionId: string;
    matchType: 'auto' | 'manual';
    confidence: number;
  }>;

  // Statistics
  totalBankTransactions: number;
  totalBookTransactions: number;
  matchedCount: number;
  unmatchedBankCount: number;
  unmatchedBookCount: number;

  // Audit
  createdAt: string;
  createdBy: string;
  completedAt?: string;
  completedBy?: string;
  approvedAt?: string;
  approvedBy?: string;
}

export interface MatchingRule {
  id: string;
  name: string;
  priority: number;
  isActive: boolean;
  conditions: Array<{
    field: 'amount' | 'date' | 'reference' | 'cheque' | 'description';
    operator: 'exact' | 'fuzzy' | 'range' | 'contains';
    tolerance?: number; // For amount tolerance or date range
    weight: number; // Contribution to match confidence
  }>;
  minConfidence: number; // Minimum confidence for auto-match
}

@Injectable()
export class BankReconciliationService {
  private statements: BankStatement[] = [];
  private bookTransactions: BookTransaction[] = [];
  private reconciliations: Reconciliation[] = [];
  private matchingRules: MatchingRule[] = [];

  constructor() {
    this.initializeMatchingRules();
    this.seedMockData();
  }

  async importBankStatement(
    bankAccountId: string,
    bankAccountName: string,
    transactions: Array<Partial<BankTransaction>>,
    openingBalance: number,
    closingBalance: number,
    importedBy: string
  ): Promise<BankStatement> {
    const statement: BankStatement = {
      id: uuidv4(),
      bankAccountId,
      bankAccountName,
      statementDate: new Date().toISOString().split('T')[0],
      openingBalance,
      closingBalance,
      transactions: transactions.map(t => ({
        id: uuidv4(),
        transactionDate: t.transactionDate || '',
        valueDate: t.valueDate || t.transactionDate || '',
        description: t.description || '',
        referenceNumber: t.referenceNumber,
        chequeNumber: t.chequeNumber,
        debit: t.debit || 0,
        credit: t.credit || 0,
        balance: t.balance || 0,
        transactionType: t.transactionType || 'other',
        matchStatus: 'unmatched',
      })),
      importedAt: new Date().toISOString(),
      importedBy,
    };

    this.statements.push(statement);
    return statement;
  }

  async startReconciliation(
    bankAccountId: string,
    periodStart: string,
    periodEnd: string,
    createdBy: string
  ): Promise<Reconciliation> {
    // Get bank transactions for period
    const bankTransactions = this.getBankTransactionsForPeriod(bankAccountId, periodStart, periodEnd);
    const bookTxns = this.getBookTransactionsForPeriod(bankAccountId, periodStart, periodEnd);

    // Calculate balances
    const bankBalance = bankTransactions.reduce((sum, t) => sum + t.credit - t.debit, 0);
    const bookBalance = bookTxns.reduce((sum, t) => sum + (t.isDebit ? -t.amount : t.amount), 0);

    const reconciliation: Reconciliation = {
      id: uuidv4(),
      bankAccountId,
      bankAccountName: 'Main Bank Account',
      periodStart,
      periodEnd,
      status: 'in_progress',
      bankStatementBalance: bankBalance,
      bookBalance,
      difference: bankBalance - bookBalance,
      unmatchedBankTransactions: [...bankTransactions],
      unmatchedBookTransactions: [...bookTxns],
      matchedPairs: [],
      totalBankTransactions: bankTransactions.length,
      totalBookTransactions: bookTxns.length,
      matchedCount: 0,
      unmatchedBankCount: bankTransactions.length,
      unmatchedBookCount: bookTxns.length,
      createdAt: new Date().toISOString(),
      createdBy,
    };

    this.reconciliations.push(reconciliation);

    // Run auto-matching
    await this.runAutoMatching(reconciliation.id);

    return this.getReconciliation(reconciliation.id);
  }

  async runAutoMatching(reconciliationId: string): Promise<Reconciliation> {
    const reconciliation = await this.getReconciliation(reconciliationId);

    const activeRules = this.matchingRules
      .filter(r => r.isActive)
      .sort((a, b) => a.priority - b.priority);

    for (const bankTxn of [...reconciliation.unmatchedBankTransactions]) {
      let bestMatch: { bookTxn: BookTransaction; confidence: number } | null = null;

      for (const bookTxn of reconciliation.unmatchedBookTransactions) {
        const confidence = this.calculateMatchConfidence(bankTxn, bookTxn, activeRules);

        if (confidence > 0 && (!bestMatch || confidence > bestMatch.confidence)) {
          bestMatch = { bookTxn, confidence };
        }
      }

      // Auto-match if confidence is high enough
      if (bestMatch && bestMatch.confidence >= 80) {
        this.createMatch(
          reconciliation,
          bankTxn,
          bestMatch.bookTxn,
          'auto',
          bestMatch.confidence
        );
      }
    }

    return reconciliation;
  }

  async manualMatch(
    reconciliationId: string,
    bankTransactionId: string,
    bookTransactionId: string,
    notes?: string
  ): Promise<Reconciliation> {
    const reconciliation = await this.getReconciliation(reconciliationId);

    const bankTxn = reconciliation.unmatchedBankTransactions.find(t => t.id === bankTransactionId);
    const bookTxn = reconciliation.unmatchedBookTransactions.find(t => t.id === bookTransactionId);

    if (!bankTxn || !bookTxn) {
      throw new BadRequestException('Transaction not found or already matched');
    }

    this.createMatch(reconciliation, bankTxn, bookTxn, 'manual', 100);

    if (notes) {
      bankTxn.matchNotes = notes;
    }

    return reconciliation;
  }

  async unmatch(
    reconciliationId: string,
    bankTransactionId: string
  ): Promise<Reconciliation> {
    const reconciliation = await this.getReconciliation(reconciliationId);

    const matchIndex = reconciliation.matchedPairs.findIndex(
      m => m.bankTransactionId === bankTransactionId
    );

    if (matchIndex === -1) {
      throw new BadRequestException('Match not found');
    }

    const match = reconciliation.matchedPairs[matchIndex];

    // Find and restore transactions
    const bankTxn = this.findBankTransaction(bankTransactionId);
    const bookTxn = this.bookTransactions.find(t => t.id === match.bookTransactionId);

    if (bankTxn) {
      bankTxn.matchStatus = 'unmatched';
      bankTxn.matchedTransactionId = undefined;
      reconciliation.unmatchedBankTransactions.push(bankTxn);
    }

    if (bookTxn) {
      bookTxn.status = 'pending';
      reconciliation.unmatchedBookTransactions.push(bookTxn);
    }

    reconciliation.matchedPairs.splice(matchIndex, 1);
    reconciliation.matchedCount--;
    reconciliation.unmatchedBankCount++;
    reconciliation.unmatchedBookCount++;

    this.recalculateDifference(reconciliation);

    return reconciliation;
  }

  async completeReconciliation(
    reconciliationId: string,
    completedBy: string
  ): Promise<Reconciliation> {
    const reconciliation = await this.getReconciliation(reconciliationId);

    if (Math.abs(reconciliation.difference) > 0.01) {
      throw new BadRequestException('Cannot complete reconciliation with outstanding difference');
    }

    reconciliation.status = 'completed';
    reconciliation.completedAt = new Date().toISOString();
    reconciliation.completedBy = completedBy;

    return reconciliation;
  }

  async approveReconciliation(
    reconciliationId: string,
    approvedBy: string
  ): Promise<Reconciliation> {
    const reconciliation = await this.getReconciliation(reconciliationId);

    if (reconciliation.status !== 'completed') {
      throw new BadRequestException('Reconciliation must be completed before approval');
    }

    reconciliation.status = 'approved';
    reconciliation.approvedAt = new Date().toISOString();
    reconciliation.approvedBy = approvedBy;

    // Update book transaction statuses
    for (const match of reconciliation.matchedPairs) {
      const bookTxn = this.bookTransactions.find(t => t.id === match.bookTransactionId);
      if (bookTxn) {
        bookTxn.status = 'reconciled';
      }
    }

    return reconciliation;
  }

  async getReconciliation(id: string): Promise<Reconciliation> {
    const reconciliation = this.reconciliations.find(r => r.id === id);
    if (!reconciliation) {
      throw new NotFoundException(`Reconciliation ${id} not found`);
    }
    return reconciliation;
  }

  async getSuggestedMatches(
    reconciliationId: string,
    bankTransactionId: string
  ): Promise<Array<{ bookTransaction: BookTransaction; confidence: number; reasons: string[] }>> {
    const reconciliation = await this.getReconciliation(reconciliationId);
    const bankTxn = reconciliation.unmatchedBankTransactions.find(t => t.id === bankTransactionId);

    if (!bankTxn) {
      throw new NotFoundException('Bank transaction not found');
    }

    const suggestions: Array<{ bookTransaction: BookTransaction; confidence: number; reasons: string[] }> = [];
    const activeRules = this.matchingRules.filter(r => r.isActive);

    for (const bookTxn of reconciliation.unmatchedBookTransactions) {
      const confidence = this.calculateMatchConfidence(bankTxn, bookTxn, activeRules);
      const reasons: string[] = [];

      // Amount match
      const bankAmount = bankTxn.debit || bankTxn.credit;
      if (Math.abs(bankAmount - bookTxn.amount) < 0.01) {
        reasons.push('Exact amount match');
      } else if (Math.abs(bankAmount - bookTxn.amount) / bankAmount < 0.01) {
        reasons.push('Amount within 1% tolerance');
      }

      // Reference match
      if (bankTxn.referenceNumber && bankTxn.referenceNumber === bookTxn.referenceNumber) {
        reasons.push('Reference number match');
      }

      // Cheque match
      if (bankTxn.chequeNumber && bankTxn.chequeNumber === bookTxn.chequeNumber) {
        reasons.push('Cheque number match');
      }

      // Date match
      if (bankTxn.transactionDate === bookTxn.transactionDate) {
        reasons.push('Transaction date match');
      }

      if (confidence > 0) {
        suggestions.push({ bookTransaction: bookTxn, confidence, reasons });
      }
    }

    return suggestions
      .sort((a, b) => b.confidence - a.confidence)
      .slice(0, 10);
  }

  async getReconciliationSummary(bankAccountId: string): Promise<{
    lastReconciliationDate?: string;
    unreconciledTransactions: number;
    unreconciledAmount: number;
    pendingReconciliations: number;
  }> {
    const accountReconciliations = this.reconciliations
      .filter(r => r.bankAccountId === bankAccountId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));

    const latestApproved = accountReconciliations.find(r => r.status === 'approved');
    const pending = accountReconciliations.filter(r => r.status === 'in_progress').length;

    // Count unreconciled book transactions
    const unreconciledTxns = this.bookTransactions.filter(t =>
      t.status === 'pending' || t.status === 'cleared'
    );

    return {
      lastReconciliationDate: latestApproved?.completedAt?.split('T')[0],
      unreconciledTransactions: unreconciledTxns.length,
      unreconciledAmount: unreconciledTxns.reduce((sum, t) => sum + t.amount, 0),
      pendingReconciliations: pending,
    };
  }

  async getOutstandingItems(bankAccountId: string): Promise<{
    outstandingDeposits: BookTransaction[];
    outstandingChecks: BookTransaction[];
    bankCharges: BankTransaction[];
  }> {
    const deposits = this.bookTransactions.filter(t =>
      !t.isDebit && t.status !== 'reconciled'
    );

    const checks = this.bookTransactions.filter(t =>
      t.isDebit && t.status !== 'reconciled'
    );

    const charges = this.statements
      .filter(s => s.bankAccountId === bankAccountId)
      .flatMap(s => s.transactions)
      .filter(t => t.transactionType === 'charge' && t.matchStatus === 'unmatched');

    return {
      outstandingDeposits: deposits,
      outstandingChecks: checks,
      bankCharges: charges,
    };
  }

  private calculateMatchConfidence(
    bankTxn: BankTransaction,
    bookTxn: BookTransaction,
    rules: MatchingRule[]
  ): number {
    let totalWeight = 0;
    let matchedWeight = 0;

    const bankAmount = bankTxn.debit || bankTxn.credit;
    const isBankDebit = bankTxn.debit > 0;

    // Amount must be same direction (bank debit = book credit to bank, etc.)
    if (isBankDebit !== bookTxn.isDebit) {
      return 0;
    }

    for (const rule of rules) {
      for (const condition of rule.conditions) {
        totalWeight += condition.weight;

        switch (condition.field) {
          case 'amount':
            if (condition.operator === 'exact' && Math.abs(bankAmount - bookTxn.amount) < 0.01) {
              matchedWeight += condition.weight;
            } else if (condition.operator === 'range' && condition.tolerance) {
              const diff = Math.abs(bankAmount - bookTxn.amount);
              if (diff <= condition.tolerance) {
                matchedWeight += condition.weight * (1 - diff / condition.tolerance);
              }
            }
            break;

          case 'date':
            const bankDate = new Date(bankTxn.transactionDate).getTime();
            const bookDate = new Date(bookTxn.transactionDate).getTime();
            const daysDiff = Math.abs(bankDate - bookDate) / (1000 * 60 * 60 * 24);

            if (condition.operator === 'exact' && daysDiff === 0) {
              matchedWeight += condition.weight;
            } else if (condition.operator === 'range' && condition.tolerance && daysDiff <= condition.tolerance) {
              matchedWeight += condition.weight * (1 - daysDiff / condition.tolerance);
            }
            break;

          case 'reference':
            if (bankTxn.referenceNumber && bookTxn.referenceNumber) {
              if (bankTxn.referenceNumber === bookTxn.referenceNumber) {
                matchedWeight += condition.weight;
              } else if (condition.operator === 'fuzzy') {
                const similarity = this.stringSimilarity(bankTxn.referenceNumber, bookTxn.referenceNumber);
                matchedWeight += condition.weight * similarity;
              }
            }
            break;

          case 'cheque':
            if (bankTxn.chequeNumber && bookTxn.chequeNumber &&
                bankTxn.chequeNumber === bookTxn.chequeNumber) {
              matchedWeight += condition.weight;
            }
            break;

          case 'description':
            if (condition.operator === 'contains' && bookTxn.partyName) {
              if (bankTxn.description.toLowerCase().includes(bookTxn.partyName.toLowerCase())) {
                matchedWeight += condition.weight;
              }
            }
            break;
        }
      }
    }

    return totalWeight > 0 ? Math.round((matchedWeight / totalWeight) * 100) : 0;
  }

  private stringSimilarity(str1: string, str2: string): number {
    const s1 = str1.toLowerCase();
    const s2 = str2.toLowerCase();
    if (s1 === s2) return 1;

    const longer = s1.length > s2.length ? s1 : s2;
    const shorter = s1.length > s2.length ? s2 : s1;

    if (longer.length === 0) return 1;

    let matches = 0;
    for (let i = 0; i < shorter.length; i++) {
      if (longer.includes(shorter[i])) matches++;
    }

    return matches / longer.length;
  }

  private createMatch(
    reconciliation: Reconciliation,
    bankTxn: BankTransaction,
    bookTxn: BookTransaction,
    matchType: 'auto' | 'manual',
    confidence: number
  ): void {
    // Update bank transaction
    bankTxn.matchStatus = matchType === 'auto' ? 'auto_matched' : 'manual_matched';
    bankTxn.matchedTransactionId = bookTxn.id;
    bankTxn.matchConfidence = confidence;

    // Update book transaction
    bookTxn.status = 'cleared';

    // Add to matched pairs
    reconciliation.matchedPairs.push({
      bankTransactionId: bankTxn.id,
      bookTransactionId: bookTxn.id,
      matchType,
      confidence,
    });

    // Remove from unmatched lists
    reconciliation.unmatchedBankTransactions = reconciliation.unmatchedBankTransactions
      .filter(t => t.id !== bankTxn.id);
    reconciliation.unmatchedBookTransactions = reconciliation.unmatchedBookTransactions
      .filter(t => t.id !== bookTxn.id);

    // Update counts
    reconciliation.matchedCount++;
    reconciliation.unmatchedBankCount--;
    reconciliation.unmatchedBookCount--;

    this.recalculateDifference(reconciliation);
  }

  private recalculateDifference(reconciliation: Reconciliation): void {
    const unmatchedBankAmount = reconciliation.unmatchedBankTransactions
      .reduce((sum, t) => sum + t.credit - t.debit, 0);
    const unmatchedBookAmount = reconciliation.unmatchedBookTransactions
      .reduce((sum, t) => sum + (t.isDebit ? -t.amount : t.amount), 0);

    reconciliation.difference = unmatchedBankAmount - unmatchedBookAmount;
  }

  private getBankTransactionsForPeriod(
    bankAccountId: string,
    startDate: string,
    endDate: string
  ): BankTransaction[] {
    return this.statements
      .filter(s => s.bankAccountId === bankAccountId)
      .flatMap(s => s.transactions)
      .filter(t => t.transactionDate >= startDate && t.transactionDate <= endDate);
  }

  private getBookTransactionsForPeriod(
    bankAccountId: string,
    startDate: string,
    endDate: string
  ): BookTransaction[] {
    return this.bookTransactions.filter(t =>
      t.transactionDate >= startDate &&
      t.transactionDate <= endDate &&
      t.status !== 'void'
    );
  }

  private findBankTransaction(id: string): BankTransaction | undefined {
    for (const statement of this.statements) {
      const txn = statement.transactions.find(t => t.id === id);
      if (txn) return txn;
    }
    return undefined;
  }

  private initializeMatchingRules(): void {
    this.matchingRules = [
      {
        id: uuidv4(),
        name: 'Exact Amount and Reference',
        priority: 1,
        isActive: true,
        conditions: [
          { field: 'amount', operator: 'exact', weight: 50 },
          { field: 'reference', operator: 'exact', weight: 40 },
          { field: 'date', operator: 'range', tolerance: 3, weight: 10 },
        ],
        minConfidence: 90,
      },
      {
        id: uuidv4(),
        name: 'Cheque Number Match',
        priority: 2,
        isActive: true,
        conditions: [
          { field: 'cheque', operator: 'exact', weight: 60 },
          { field: 'amount', operator: 'exact', weight: 30 },
          { field: 'date', operator: 'range', tolerance: 7, weight: 10 },
        ],
        minConfidence: 85,
      },
      {
        id: uuidv4(),
        name: 'Amount and Date',
        priority: 3,
        isActive: true,
        conditions: [
          { field: 'amount', operator: 'exact', weight: 60 },
          { field: 'date', operator: 'exact', weight: 30 },
          { field: 'description', operator: 'contains', weight: 10 },
        ],
        minConfidence: 80,
      },
    ];
  }

  private seedMockData(): void {
    // Create sample book transactions
    this.bookTransactions = [
      {
        id: uuidv4(),
        transactionDate: '2024-01-10',
        description: 'Customer Payment - Acme Corp',
        referenceNumber: 'REC-001',
        amount: 500000,
        isDebit: false,
        transactionType: 'customer_receipt',
        partyName: 'Acme Corp',
        invoiceNumber: 'INV-001',
        status: 'pending',
      },
      {
        id: uuidv4(),
        transactionDate: '2024-01-12',
        description: 'Vendor Payment - Alpha Suppliers',
        referenceNumber: 'PAY-001',
        chequeNumber: 'CHQ-12345',
        amount: 350000,
        isDebit: true,
        transactionType: 'vendor_payment',
        partyName: 'Alpha Suppliers',
        status: 'pending',
      },
    ];

    // Create sample bank statement
    this.importBankStatement(
      'bank-001',
      'Main Bank Account',
      [
        {
          transactionDate: '2024-01-10',
          valueDate: '2024-01-10',
          description: 'NEFT/ACME CORP/REC-001',
          referenceNumber: 'REC-001',
          debit: 0,
          credit: 500000,
          balance: 2500000,
          transactionType: 'receipt',
        },
        {
          transactionDate: '2024-01-12',
          valueDate: '2024-01-12',
          description: 'CHQ CLR/12345/ALPHA SUPPLIERS',
          chequeNumber: 'CHQ-12345',
          debit: 350000,
          credit: 0,
          balance: 2150000,
          transactionType: 'payment',
        },
        {
          transactionDate: '2024-01-15',
          valueDate: '2024-01-15',
          description: 'BANK CHARGES',
          debit: 1500,
          credit: 0,
          balance: 2148500,
          transactionType: 'charge',
        },
      ],
      2000000,
      2148500,
      'system'
    );
  }
}
