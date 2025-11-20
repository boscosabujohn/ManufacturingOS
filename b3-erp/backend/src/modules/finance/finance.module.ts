import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import {
  ChartOfAccounts,
  GeneralLedger,
  JournalEntry,
  JournalEntryLine,
  Invoice,
  InvoiceLine,
  Payment,
  BankAccount,
  BankReconciliation,
  BankStatement,
  ReconciliationMatch,
  FinancialYear,
  FinancialPeriod,
  Budget,
  BudgetLine,
  CostCenter,
  StandardCost,
  VarianceAnalysis,
  WIPAccounting,
  CashFlowTransaction,
  AnticipatedReceipt,
  AnticipatedPayment,
  FixedAsset,
  AssetDepreciation,
  AssetMaintenance,
  TaxMaster,
  GSTTransaction,
  TDSTransaction,
  GSTRPeriod,
} from './entities';

// Controllers
import {
  ChartOfAccountsController,
  ChartOfAccountsSeederController,
  JournalEntryController,
  InvoiceController,
  PaymentController,
  FinancialReportsController,
} from './controllers';

// Services
import {
  ChartOfAccountsService,
  ChartOfAccountsSeederService,
  JournalEntryService,
  InvoiceService,
  PaymentService,
  FinancialReportsService,
} from './services';
import { AccountsReceivableService } from './services/accounts-receivable.service';
import { AccountsPayableService } from './services/accounts-payable.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      // Core Accounting
      ChartOfAccounts,
      GeneralLedger,

      // Journal Entries
      JournalEntry,
      JournalEntryLine,

      // Invoicing
      Invoice,
      InvoiceLine,

      // Payments
      Payment,

      // Banking
      BankAccount,
      BankReconciliation,
      BankStatement,
      ReconciliationMatch,

      // Financial Periods
      FinancialYear,
      FinancialPeriod,

      // Budgeting
      Budget,
      BudgetLine,

      // Cost Accounting
      CostCenter,
      StandardCost,
      VarianceAnalysis,
      WIPAccounting,

      // Cash Flow
      CashFlowTransaction,
      AnticipatedReceipt,
      AnticipatedPayment,

      // Fixed Assets
      FixedAsset,
      AssetDepreciation,
      AssetMaintenance,

      // Taxation
      TaxMaster,
      GSTTransaction,
      TDSTransaction,
      GSTRPeriod,
    ]),
  ],
  controllers: [
    ChartOfAccountsController,
    ChartOfAccountsSeederController,
    JournalEntryController,
    InvoiceController,
    PaymentController,
    FinancialReportsController,
  ],
  providers: [
    ChartOfAccountsService,
    ChartOfAccountsSeederService,
    JournalEntryService,
    InvoiceService,
    PaymentService,
    FinancialReportsService,
    AccountsReceivableService,
    AccountsPayableService,
  ],
  exports: [
    ChartOfAccountsService,
    ChartOfAccountsSeederService,
    JournalEntryService,
    InvoiceService,
    PaymentService,
    FinancialReportsService,
    AccountsReceivableService,
    AccountsPayableService,
  ],
})
export class FinanceModule {}
