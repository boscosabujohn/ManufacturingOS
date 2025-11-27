import { Controller, Get, Post, Put, Body, Param, Query } from '@nestjs/common';
import { EmergencySpareService } from '../services/emergency-spare.service';

@Controller('api/project-management/emergency-spares')
export class EmergencySparesController {
    constructor(private readonly spareService: EmergencySpareService) { }

    @Get()
    async listRequests(@Query('projectId') projectId?: string) {
        // In a real implementation, fetch from database
        return {
            success: true,
            data: []
        };
    }

    @Post()
    async requestSpare(
        @Body() body: { projectId: string; partId: string; quantity: number; urgency: string; reason: string }
    ) {
        const result = await this.spareService.requestSpare(
            body.projectId,
            body.partId,
            body.quantity,
            body.urgency,
            body.reason
        );
        return {
            success: true,
            data: result
        };
    }

    @Put(':id/approve')
    async approveRequest(
        @Param('id') requestId: string,
        @Body() body: { approvedBy: string }
    ) {
        const result = await this.spareService.approveRequest(requestId, body.approvedBy);
        return {
            success: true,
            data: result
        };
    }

    @Put(':id/reject')
    async rejectRequest(
        @Param('id') requestId: string,
        @Body() body: { rejectedBy: string; reason: string }
    ) {
        const result = await this.spareService.rejectRequest(requestId, body.rejectedBy, body.reason);
        return {
            success: true,
            data: result
        };
    }
}
