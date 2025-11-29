import { Controller, Get, Post, Put, Param, Body, Query } from '@nestjs/common';
import { PettyCashService } from '../services/petty-cash.service';

@Controller('api/accounts/petty-cash')
export class PettyCashController {
    constructor(private readonly pettyCashService: PettyCashService) { }

    @Get()
    async findAll(@Query('custodian') custodian?: string, @Query('status') status?: string) {
        const transactions = await this.pettyCashService.findAll(custodian, status);
        return { success: true, data: transactions };
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        const transaction = await this.pettyCashService.findOne(id);
        return { success: true, data: transaction };
    }

    @Post()
    async create(@Body() data: any) {
        const transaction = await this.pettyCashService.create(data);
        return { success: true, data: transaction, message: 'Petty cash transaction created successfully' };
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() data: any) {
        const transaction = await this.pettyCashService.update(id, data);
        return { success: true, data: transaction, message: 'Petty cash transaction updated successfully' };
    }

    @Post(':id/approve')
    async approve(@Param('id') id: string, @Body() body: { approvedBy: string }) {
        const transaction = await this.pettyCashService.approve(id, body.approvedBy);
        return { success: true, data: transaction, message: 'Petty cash transaction approved' };
    }

    @Post(':id/reject')
    async reject(@Param('id') id: string) {
        const transaction = await this.pettyCashService.reject(id);
        return { success: true, data: transaction, message: 'Petty cash transaction rejected' };
    }

    @Get('balance/total')
    async getBalance(@Query('custodian') custodian?: string) {
        const balance = await this.pettyCashService.getBalance(custodian);
        return { success: true, data: { balance } };
    }

    @Post('replenish')
    async requestReplenishment(@Body() body: { custodian: string; amount: number; remarks: string }) {
        const transaction = await this.pettyCashService.requestReplenishment(
            body.custodian,
            body.amount,
            body.remarks
        );
        return { success: true, data: transaction, message: 'Replenishment request submitted' };
    }
}
