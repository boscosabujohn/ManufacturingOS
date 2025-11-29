import { Controller, Get, Post, Param, Body, Query } from '@nestjs/common';
import { BankReconciliationService } from '../services/bank-reconciliation.service';

@Controller('api/accounts/reconciliation')
export class BankReconciliationController {
    constructor(private readonly reconciliationService: BankReconciliationService) { }

    @Get('unreconciled/:bankAccountId')
    async getUnreconciledTransactions(@Param('bankAccountId') bankAccountId: string) {
        const transactions = await this.reconciliationService.getUnreconciledTransactions(bankAccountId);
        return { success: true, data: transactions };
    }

    @Post('auto-match/:bankAccountId')
    async autoMatch(@Param('bankAccountId') bankAccountId: string) {
        const result = await this.reconciliationService.autoMatch(bankAccountId);
        return { success: true, data: result, message: `Auto-matched ${result.matched} transactions` };
    }

    @Post('match')
    async matchTransaction(@Body() body: { transactionId: string; journalEntryId: string }) {
        await this.reconciliationService.matchTransaction(body.transactionId, body.journalEntryId);
        return { success: true, message: 'Transaction matched successfully' };
    }

    @Post('unmatch/:transactionId')
    async unmatchTransaction(@Param('transactionId') transactionId: string) {
        await this.reconciliationService.unmatchTransaction(transactionId);
        return { success: true, message: 'Transaction unmatched successfully' };
    }

    @Get('report/:bankAccountId')
    async getReconciliationReport(
        @Param('bankAccountId') bankAccountId: string,
        @Query('month') monthStr: string
    ) {
        const month = monthStr ? new Date(monthStr) : new Date();
        const report = await this.reconciliationService.getReconciliationReport(bankAccountId, month);
        return { success: true, data: report };
    }
}
