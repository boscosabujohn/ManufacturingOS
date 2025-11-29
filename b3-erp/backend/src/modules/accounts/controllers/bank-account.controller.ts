import { Controller, Get, Post, Put, Delete, Body, Param, Query } from '@nestjs/common';
import { BankAccountService } from '../services/bank-account.service';

@Controller('api/accounts/banks')
export class BankAccountController {
    constructor(private readonly bankAccountService: BankAccountService) { }

    @Get()
    async findAll() {
        const accounts = await this.bankAccountService.findAll();
        return { success: true, data: accounts };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const account = await this.bankAccountService.findOne(id);
        return { success: true, data: account };
    }

    @Post()
    async create(@Body() data: any) {
        const account = await this.bankAccountService.create(data);
        return { success: true, data: account, message: 'Bank account created successfully' };
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        const account = await this.bankAccountService.update(id, data);
        return { success: true, data: account, message: 'Bank account updated successfully' };
    }

    @Delete(':id')
    async delete(@Param('id') id: string) {
        await this.bankAccountService.delete(id);
        return { success: true, message: 'Bank account closed successfully' };
    }

    @Get(':id/balance')
    async getBalance(@Param('id') id: string) {
        const balance = await this.bankAccountService.getBalance(id);
        return { success: true, data: balance };
    }

    @Get(':id/transactions')
    async getTransactions(
        @Param('id') id: string,
        @Query('startDate') startDate?: string,
        @Query('endDate') endDate?: string
    ) {
        const start = startDate ? new Date(startDate) : undefined;
        const end = endDate ? new Date(endDate) : undefined;
        const transactions = await this.bankAccountService.getTransactions(id, start, end);
        return { success: true, data: transactions };
    }

    @Post(':id/transactions')
    async addTransaction(@Param('id') id: string, @Body() data: any) {
        const transaction = await this.bankAccountService.addTransaction({ ...data, bankAccountId: id });
        return { success: true, data: transaction, message: 'Transaction added successfully' };
    }

    @Post(':id/import-statement')
    async importStatement(@Param('id') id: string, @Body() body: { transactions: any[] }) {
        const result = await this.bankAccountService.importStatement(id, body.transactions);
        return { success: true, data: result, message: `Imported ${result.imported} transactions` };
    }
}
