import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { ExpenseClaimService } from '../services/expense-claim.service';

@Controller('api/accounts/expense-claims')
export class ExpenseClaimController {
    constructor(private readonly expenseClaimService: ExpenseClaimService) { }

    @Get()
    async findAll(@Query('employeeId') employeeId?: string, @Query('status') status?: string) {
        const claims = await this.expenseClaimService.findAll(employeeId, status);
        return { success: true, data: claims };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const claim = await this.expenseClaimService.findOne(id);
        return { success: true, data: claim };
    }

    @Post()
    async create(@Body() data: any) {
        const claim = await this.expenseClaimService.create(data);
        return { success: true, data: claim, message: 'Expense claim created successfully' };
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        const claim = await this.expenseClaimService.update(id, data);
        return { success: true, data: claim, message: 'Expense claim updated successfully' };
    }

    @Post(':id/submit')
    async submit(@Param('id') id: string) {
        const claim = await this.expenseClaimService.submit(id);
        return { success: true, data: claim, message: 'Expense claim submitted for approval' };
    }

    @Post(':id/approve')
    async approve(@Param('id') id: string, @Body() body: { approvedBy: string }) {
        const claim = await this.expenseClaimService.approve(id, body.approvedBy);
        return { success: true, data: claim, message: 'Expense claim approved successfully' };
    }

    @Post(':id/reject')
    async reject(@Param('id') id: string, @Body() body: { reason: string }) {
        const claim = await this.expenseClaimService.reject(id, body.reason);
        return { success: true, data: claim, message: 'Expense claim rejected' };
    }

    @Post(':id/process-payment')
    async processPayment(@Param('id') id: string, @Body() body: { paymentRef: string; paidBy: string }) {
        const claim = await this.expenseClaimService.processPayment(id, body.paymentRef, body.paidBy);
        return { success: true, data: claim, message: 'Payment processed successfully' };
    }
}
