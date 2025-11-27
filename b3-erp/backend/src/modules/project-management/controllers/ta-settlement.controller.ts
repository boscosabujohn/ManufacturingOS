import { Controller, Get, Post, Put, Body, Param, Query, UseGuards } from '@nestjs/common';
import { TASettlementService } from '../services/ta-settlement.service';

@Controller('api/project-management/ta-settlement')
export class TASettlementController {
    constructor(private readonly taService: TASettlementService) { }

    @Get('claims')
    async listClaims(@Query('projectId') projectId?: string) {
        // In a real implementation, this would fetch from the database
        return {
            success: true,
            data: []
        };
    }

    @Post('claims')
    async createClaim(
        @Body() body: { projectId: string; engineerId: string; amount: number; description: string }
    ) {
        const result = await this.taService.createClaim(
            body.projectId,
            body.engineerId,
            body.amount,
            body.description
        );
        return {
            success: true,
            data: result
        };
    }

    @Put('claims/:id/approve')
    async approveClaim(
        @Param('id') claimId: string,
        @Body() body: { approvedBy: string }
    ) {
        const result = await this.taService.approveClaim(claimId, body.approvedBy);
        return {
            success: true,
            data: result
        };
    }
}
