import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

// Entities
import { BankAccount } from './entities/bank-account.entity';
import { BankTransaction } from './entities/bank-transaction.entity';
import { PettyCash } from './entities/petty-cash.entity';
import { ExpenseClaim } from './entities/expense-claim.entity';

// Services
import { BankAccountService } from './services/bank-account.service';
import { BankReconciliationService } from './services/bank-reconciliation.service';
import { PettyCashService } from './services/petty-cash.service';
import { ExpenseClaimService } from './services/expense-claim.service';

// Controllers
import { BankAccountController } from './controllers/bank-account.controller';
import { BankReconciliationController } from './controllers/bank-reconciliation.controller';
import { PettyCashController } from './controllers/petty-cash.controller';
import { ExpenseClaimController } from './controllers/expense-claim.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      BankAccount,
      BankTransaction,
      PettyCash,
      ExpenseClaim,
    ]),
  ],
  controllers: [
    BankAccountController,
    BankReconciliationController,
    PettyCashController,
    ExpenseClaimController,
  ],
  providers: [
    BankAccountService,
    BankReconciliationService,
    PettyCashService,
    ExpenseClaimService,
  ],
  exports: [
    BankAccountService,
    BankReconciliationService,
    PettyCashService,
    ExpenseClaimService,
  ],
})
export class AccountsModule { }
